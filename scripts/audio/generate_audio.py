#!/usr/bin/env python3
"""Generate Fude MP3 audio from audio-manifest.json using the local MioTTS REST API.

Safe defaults:
- dry-run unless --execute is supplied;
- legacy audio with no state record is skipped unless --force is supplied;
- successful items are fingerprinted after each write so an interrupted batch can resume.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
import wave
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public"
DEFAULT_MANIFEST = ROOT / "audio-manifest.json"
DEFAULT_CONFIG = ROOT / "scripts" / "audio" / "voice-presets.json"
DEFAULT_STATE = ROOT / "audio-generation-state.json"
DEFAULT_REPORT = ROOT / "audio-generation-report.json"
DEFAULT_API_URL = "http://127.0.0.1:8001"
DEFAULT_ROLE = "teen_female"


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def read_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8-sig"))
    except FileNotFoundError:
        raise FileNotFoundError(f"File not found: {path}") from None
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {path}: {exc}") from exc


def write_json_atomic(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = path.with_name(path.name + ".tmp")
    temp_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temp_path.replace(path)


def stable_hash(value: Any) -> str:
    packed = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(packed.encode("utf-8")).hexdigest()


def http_json(url: str, *, method: str = "GET", payload: dict[str, Any] | None = None,
              timeout: float = 30.0) -> dict[str, Any]:
    data = None
    headers = {"Accept": "application/json"}
    if payload is not None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            raw = response.read()
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:1000]
        raise RuntimeError(f"HTTP {exc.code} from {url}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Cannot reach {url}: {exc.reason}") from exc
    try:
        parsed = json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Expected JSON from {url}, received an invalid response") from exc
    if not isinstance(parsed, dict):
        raise RuntimeError(f"Expected a JSON object from {url}")
    return parsed


def normalize_base_url(value: str) -> str:
    return value.strip().rstrip("/")


def resolve_output_path(output: str) -> Path:
    relative = Path(str(output).replace("\\", "/"))
    if relative.is_absolute() or ".." in relative.parts:
        raise ValueError(f"Unsafe manifest output path: {output!r}")
    destination = (PUBLIC / relative).resolve()
    public_root = PUBLIC.resolve()
    try:
        destination.relative_to(public_root)
    except ValueError:
        raise ValueError(f"Output path escapes public/: {output!r}") from None
    if destination.suffix.lower() != ".mp3":
        raise ValueError(f"Expected an MP3 output path, got: {output!r}")
    return destination


def item_segments(item: dict[str, Any]) -> list[dict[str, Any]]:
    segments = item.get("segments")
    if isinstance(segments, list) and segments:
        normalized = []
        for segment in segments:
            if not isinstance(segment, dict) or not str(segment.get("text") or "").strip():
                continue
            normalized.append(segment)
        return normalized
    text = str(item.get("text") or "").strip()
    if not text:
        return []
    return [{
        "text": text,
        "voice_role": item.get("voice_role", DEFAULT_ROLE),
        "pause_after_ms": 0,
    }]


def role_preset(role: str, config: dict[str, Any]) -> str:
    presets = config.get("preset_by_role", {})
    fallback = str(config.get("default_preset", "jp_female"))
    return str(presets.get(role) or presets.get(DEFAULT_ROLE) or fallback)


def item_fingerprint(item: dict[str, Any], config: dict[str, Any]) -> tuple[str, list[str]]:
    parts = item_segments(item)
    mapped = []
    preset_ids: list[str] = []
    for part in parts:
        role = str(part.get("voice_role") or item.get("voice_role") or DEFAULT_ROLE)
        preset_id = role_preset(role, config)
        mapped.append({
            "text": str(part.get("text") or "").strip(),
            "role": role,
            "preset_id": preset_id,
            "pause_after_ms": int(part.get("pause_after_ms", 0) or 0),
        })
        preset_ids.append(preset_id)
    fingerprint_data = {
        "id": item.get("id"),
        "category": item.get("category"),
        "output": item.get("output"),
        "parts": mapped,
        "llm": config.get("llm", {}),
        "best_of_n": config.get("best_of_n", {"enabled": False, "n": 1, "language": "auto"}),
        "mp3_bitrate": config.get("mp3_bitrate", "192k"),
    }
    return stable_hash(fingerprint_data), preset_ids


def load_state(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"schema_version": 1, "updated_at": utc_now(), "items": {}}
    state = read_json(path)
    if not isinstance(state, dict) or not isinstance(state.get("items"), dict):
        raise ValueError(f"Unexpected state-file structure: {path}")
    return state


def choose_jobs(manifest: dict[str, Any], state: dict[str, Any], config: dict[str, Any],
                categories: set[str] | None, force: bool) -> tuple[list[dict[str, Any]], dict[str, int]]:
    jobs: list[dict[str, Any]] = []
    counts = {"manifest": 0, "ready": 0, "skip_current": 0, "skip_legacy": 0, "filtered": 0}
    state_items = state["items"]
    for item in manifest.get("items", []):
        counts["manifest"] += 1
        if categories and item.get("category") not in categories:
            counts["filtered"] += 1
            continue
        output = str(item.get("output") or "")
        destination = resolve_output_path(output)
        fingerprint, preset_ids = item_fingerprint(item, config)
        old = state_items.get(str(item.get("id")))
        if destination.exists() and not force:
            if isinstance(old, dict) and old.get("fingerprint") == fingerprint:
                counts["skip_current"] += 1
                continue
            if not isinstance(old, dict):
                counts["skip_legacy"] += 1
                continue
        jobs.append({
            "item": item,
            "destination": destination,
            "fingerprint": fingerprint,
            "preset_ids": preset_ids,
        })
    counts["ready"] = len(jobs)
    return jobs, counts


def check_server(base_url: str, timeout: float, required_presets: set[str]) -> None:
    health = http_json(f"{base_url}/health", timeout=timeout)
    if str(health.get("status", "")).lower() != "ok":
        raise RuntimeError(f"MioTTS health check did not return status=ok: {health}")
    presets_response = http_json(f"{base_url}/v1/presets", timeout=timeout)
    available = set(presets_response.get("presets") or [])
    missing = sorted(required_presets - available)
    if missing:
        raise RuntimeError(
            "Missing MioTTS preset(s): " + ", ".join(missing)
            + ". Check scripts/audio/voice-presets.json against GET /v1/presets."
        )
    print(f"MioTTS server OK: {base_url}")
    print("Available presets: " + ", ".join(sorted(available)))


def synthesize_wav(base_url: str, text: str, preset_id: str, config: dict[str, Any],
                   timeout: float, retries: int, max_text_length: int) -> tuple[bytes, dict[str, Any]]:
    spoken = text.strip()
    if not spoken:
        raise ValueError("Cannot synthesize empty text")
    if len(spoken) > max_text_length:
        raise ValueError(
            f"Text has {len(spoken)} characters; configured MioTTS limit is {max_text_length}. "
            "Shorten/split the source text rather than truncating it automatically."
        )
    payload = {
        "text": spoken,
        "reference": {"type": "preset", "preset_id": preset_id},
        "llm": config.get("llm", {}),
        "output": {"format": "base64"},
        "best_of_n": config.get("best_of_n", {"enabled": False, "n": 1, "language": "ja"}),
    }
    last_error: Exception | None = None
    for attempt in range(retries + 1):
        try:
            result = http_json(
                f"{base_url}/v1/tts", method="POST", payload=payload, timeout=timeout
            )
            encoded = result.get("audio")
            if not isinstance(encoded, str) or not encoded:
                raise RuntimeError(f"MioTTS response did not contain base64 audio: {result}")
            try:
                wav_data = base64.b64decode(encoded, validate=True)
            except (ValueError, base64.binascii.Error) as exc:
                raise RuntimeError("MioTTS returned invalid base64 audio data") from exc
            if len(wav_data) < 44 or wav_data[:4] != b"RIFF" or wav_data[8:12] != b"WAVE":
                raise RuntimeError("MioTTS response was not a valid WAV file")
            try:
                with wave.open(io.BytesIO(wav_data), "rb") as wav_file:
                    duration = wav_file.getnframes() / float(wav_file.getframerate())
            except (wave.Error, ZeroDivisionError) as exc:
                raise RuntimeError(f"Could not inspect MioTTS WAV duration: {exc}") from exc

            # Reject extreme over-generation (e.g. a 4-kana phrase rendered as 28 seconds).
            max_reasonable_seconds = max(8.0, len(spoken) * 0.75)
            if duration > max_reasonable_seconds:
                normalized = result.get("normalized_text")
                raise RuntimeError(
                    f"Suspiciously long TTS result: {duration:.1f}s for "
                    f"{len(spoken)} input characters (limit {max_reasonable_seconds:.1f}s). "
                    f"normalized_text={normalized!r}. Output was rejected, not saved."
                )
            diagnostics = {
                "duration_seconds": round(duration, 3),
                "normalized_text": result.get("normalized_text"),
                "token_count": result.get("token_count"),
                "timings": result.get("timings"),
            }
            return wav_data, diagnostics
        except Exception as exc:
            last_error = exc
            if attempt < retries:
                wait = min(2 ** attempt, 8)
                print(f"    retry {attempt + 1}/{retries} after error: {exc} (wait {wait}s)")
                time.sleep(wait)
    assert last_error is not None
    raise last_error


def make_mp3(wav_paths: list[Path], segments: list[dict[str, Any]], destination: Path,
             ffmpeg: str, bitrate: str) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    temp_output = destination.with_name(destination.stem + ".generating.tmp.mp3")
    if temp_output.exists():
        temp_output.unlink()

    command = [ffmpeg, "-hide_banner", "-loglevel", "error", "-y"]
    for wav_path in wav_paths:
        command.extend(["-i", str(wav_path)])

    if len(wav_paths) == 1:
        command.extend([
            "-map", "0:a:0", "-vn", "-ar", "24000", "-ac", "1",
            "-codec:a", "libmp3lame", "-b:a", bitrate, str(temp_output),
        ])
    else:
        filters: list[str] = []
        concat_inputs: list[str] = []
        gap_index = 0
        for index, wav_path in enumerate(wav_paths):
            label = f"a{index}"
            filters.append(
                f"[{index}:a]aresample=24000,aformat=sample_fmts=fltp:channel_layouts=mono[{label}]"
            )
            concat_inputs.append(f"[{label}]")
            if index < len(wav_paths) - 1:
                pause_ms = max(0, int(segments[index].get("pause_after_ms", 0) or 0))
                if pause_ms:
                    silence_label = f"s{gap_index}"
                    duration = pause_ms / 1000.0
                    filters.append(f"anullsrc=r=24000:cl=mono:d={duration:.3f}[{silence_label}]")
                    concat_inputs.append(f"[{silence_label}]")
                    gap_index += 1
        filters.append(
            "".join(concat_inputs)
            + f"concat=n={len(concat_inputs)}:v=0:a=1[out]"
        )
        command.extend([
            "-filter_complex", ";".join(filters), "-map", "[out]",
            "-ar", "24000", "-ac", "1", "-codec:a", "libmp3lame",
            "-b:a", bitrate, str(temp_output),
        ])

    try:
        completed = subprocess.run(command, capture_output=True, text=True, check=False)
        if completed.returncode != 0:
            detail = (completed.stderr or completed.stdout or "FFmpeg failed").strip()[-2000:]
            raise RuntimeError(f"FFmpeg could not create MP3: {detail}")
        if not temp_output.is_file() or temp_output.stat().st_size < 256:
            raise RuntimeError("FFmpeg returned success but the MP3 is missing or too small")
        temp_output.replace(destination)
    finally:
        if temp_output.exists():
            temp_output.unlink()


def synthesize_job(job: dict[str, Any], base_url: str, config: dict[str, Any],
                   ffmpeg: str, timeout: float, retries: int, max_text_length: int) -> list[dict[str, Any]]:
    item = job["item"]
    segments = item_segments(item)
    if not segments:
        raise ValueError("Manifest item contains neither text nor usable segments")

    diagnostics: list[dict[str, Any]] = []
    with tempfile.TemporaryDirectory(prefix="fude-audio-") as temp_dir_name:
        temp_dir = Path(temp_dir_name)
        wav_paths: list[Path] = []
        for index, segment in enumerate(segments, start=1):
            role = str(segment.get("voice_role") or item.get("voice_role") or DEFAULT_ROLE)
            preset = role_preset(role, config)
            wav_data, info = synthesize_wav(
                base_url, str(segment.get("text") or ""), preset, config,
                timeout, retries, max_text_length,
            )
            info["input_text"] = str(segment.get("text") or "")
            info["preset_id"] = preset
            diagnostics.append(info)
            print(
                f"    segment {index}: {info['duration_seconds']:.2f}s "
                f"| normalized={info.get('normalized_text')!r}"
            )
            wav_path = temp_dir / f"segment-{index:04d}.wav"
            wav_path.write_bytes(wav_data)
            wav_paths.append(wav_path)
        make_mp3(wav_paths, segments, job["destination"], ffmpeg,
                 str(config.get("mp3_bitrate", "192k")))
    return diagnostics


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate Fude MP3 audio through the local MioTTS REST API. Dry-run is the default."
    )
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--state", type=Path, default=DEFAULT_STATE)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--api-base-url", default=None,
                        help="MioTTS API base URL; default is read from voice-presets.json")
    parser.add_argument("--category", action="append", default=[],
                        help="Only process this category; repeat the option to include more than one")
    parser.add_argument("--limit", type=int, default=0,
                        help="Process at most N pending items (useful for a small test batch)")
    parser.add_argument("--match", default="",
                        help="Only process items whose ID, output path, or speech text contains this string")
    parser.add_argument("--show-items", action="store_true", help="Print every planned item")
    parser.add_argument("--execute", action="store_true",
                        help="Actually synthesize audio; without this flag, the script only previews")
    parser.add_argument("--force", action="store_true",
                        help="Overwrite existing MP3s, including legacy files without a state record")
    parser.add_argument("--retries", type=int, default=2, help="Retries per TTS segment after a failure")
    parser.add_argument("--timeout", type=float, default=None, help="HTTP timeout in seconds")
    parser.add_argument("--max-text-length", type=int, default=300,
                        help="Reject longer segments instead of silently truncating them")
    parser.add_argument("--ffmpeg", default="ffmpeg", help="FFmpeg executable name or full path")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        manifest = read_json(args.manifest)
        config = read_json(args.config)
        if not isinstance(manifest, dict) or not isinstance(manifest.get("items"), list):
            raise ValueError("Manifest must be a JSON object containing an items array")
        if not isinstance(config, dict):
            raise ValueError("Voice configuration must be a JSON object")
        state = load_state(args.state)
        base_url = normalize_base_url(args.api_base_url or config.get("api_base_url") or DEFAULT_API_URL)
        timeout = float(args.timeout or config.get("timeout_seconds", 180))
        if args.limit < 0 or args.retries < 0 or timeout <= 0 or args.max_text_length <= 0:
            raise ValueError("--limit, --retries, --timeout, and --max-text-length must be valid positive values")
        ffmpeg = shutil.which(args.ffmpeg) if not Path(args.ffmpeg).is_file() else args.ffmpeg
        if not ffmpeg:
            raise RuntimeError("FFmpeg was not found. Install it or pass --ffmpeg with the full executable path.")

        categories = set(args.category) if args.category else None
        manifest_categories = {str(item.get("category")) for item in manifest["items"]}
        unknown = sorted((categories or set()) - manifest_categories)
        if unknown:
            raise ValueError("Unknown category name(s): " + ", ".join(unknown)
                             + ". Available: " + ", ".join(sorted(manifest_categories)))

        jobs, counts = choose_jobs(manifest, state, config, categories, args.force)
        if args.match:
            needle = args.match.casefold()
            jobs = [
                job for job in jobs
                if needle in " ".join([
                    str(job["item"].get("id") or ""),
                    str(job["item"].get("output") or ""),
                    str(job["item"].get("text") or ""),
                    " ".join(str(part.get("text") or "") for part in (job["item"].get("segments") or [])),
                ]).casefold()
            ]
        counts["ready"] = len(jobs)
        if args.limit:
            jobs = jobs[:args.limit]
        print("Fude audio batch generator")
        print("--------------------------")
        print(f"Manifest items: {counts['manifest']}")
        print(f"Pending after filters: {counts['ready']}")
        print(f"Already generated with matching state: {counts['skip_current']}")
        print(f"Existing legacy audio protected from overwrite: {counts['skip_legacy']}")
        if categories:
            print("Categories: " + ", ".join(sorted(categories)))
        if args.match:
            print(f"Match filter: {args.match}")
        if args.limit:
            print(f"Limit: {args.limit}")
        print("Mode: EXECUTE" if args.execute else "Mode: DRY RUN (no API calls or audio writes)")
        if args.force:
            print("Force: existing outputs may be replaced")

        if args.show_items or not args.execute:
            for job in jobs[: (len(jobs) if args.show_items else 12)]:
                item = job["item"]
                print(f"  [{item.get('category')}] {item.get('output')}  presets={','.join(sorted(set(job['preset_ids'])))}")
            if len(jobs) > 12 and not args.show_items:
                print(f"  ... {len(jobs) - 12} more (use --show-items to list them)")

        if not args.execute:
            print("\nPreview only. Add --execute to start synthesis.")
            return 0
        if not jobs:
            print("\nNothing to generate.")
            return 0

        required_presets = {preset for job in jobs for preset in job["preset_ids"]}
        check_server(base_url, timeout, required_presets)

        completed = 0
        failures: list[dict[str, str]] = []
        interrupted = False
        started_at = utc_now()
        try:
            for index, job in enumerate(jobs, start=1):
                item = job["item"]
                label = str(item.get("output") or item.get("id") or f"item-{index}")
                print(f"[{index}/{len(jobs)}] {label}")
                try:
                    synthesis_info = synthesize_job(
                        job, base_url, config, ffmpeg, timeout,
                        args.retries, args.max_text_length
                    )
                    state["items"][str(item.get("id"))] = {
                        "fingerprint": job["fingerprint"],
                        "output": item.get("output"),
                        "presets": sorted(set(job["preset_ids"])),
                        "segments": synthesis_info,
                        "generated_at": utc_now(),
                        "generator": "scripts/audio/generate_audio.py",
                    }
                    state["updated_at"] = utc_now()
                    write_json_atomic(args.state, state)
                    completed += 1
                    print("    OK")
                except KeyboardInterrupt:
                    raise
                except Exception as exc:
                    failures.append({"id": str(item.get("id")), "output": label, "error": str(exc)})
                    print(f"    FAILED: {exc}")
        except KeyboardInterrupt:
            interrupted = True
            print("\nStopped safely. Completed items were saved; run the same command again to resume.")

        report = {
            "started_at": started_at,
            "finished_at": utc_now(),
            "interrupted": interrupted,
            "requested_items": len(jobs),
            "completed_items": completed,
            "failed_items": len(failures),
            "failures": failures,
        }
        write_json_atomic(args.report, report)
        print("\nBatch summary")
        print(f"  Generated: {completed}")
        print(f"  Failed: {len(failures)}")
        print(f"  Report: {args.report}")
        print(f"  Resume state: {args.state}")
        if failures:
            print("Failed items are not marked complete; rerunning will retry them.")
            return 1
        return 0
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
