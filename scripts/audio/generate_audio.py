#!/usr/bin/env python3
"""Generate Fude MP3 audio from audio-manifest.json using the local Qwen3-TTS API.

Safe defaults:
- dry-run unless --execute is supplied;
- existing audio without a Qwen state record is skipped unless --force is supplied;
- per-item, per-role voice assignments are persisted separately and are random
  without immediate repeats for each role;
- successful items are fingerprinted after each write so an interrupted batch can resume.

The MioTTS generator, config, state and report are not modified by this script.
"""
from __future__ import annotations

import argparse
import difflib
import hashlib
import io
import json
import math
import os
import random
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
import wave
from array import array
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public"
DEFAULT_MANIFEST = ROOT / "audio-manifest.json"
DEFAULT_CONFIG = ROOT / "scripts" / "audio" / "voice-presets-qwen.json"
DEFAULT_STATE = ROOT / "audio-generation-state-qwen.json"
DEFAULT_REPORT = ROOT / "audio-generation-report-qwen.json"
DEFAULT_API_URL = "http://127.0.0.1:8765"
DEFAULT_ROLE = "teen_female"

# Quality control for short items (single words / kana).
SMALL_KANA = set("ゃゅょゎぁぃぅぇぉャュョヮァィゥェォ")
END_PUNCT = "。！？!?.…"
PAUSE_PUNCT = "、,。"
SEC_PER_MORA = 0.17
MAX_RATIO = 1.5
MIN_RATIO = 0.5
MAX_INTERNAL_GAP = 0.15
EDGE_PAD = 0.06


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
    temp_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    temp_path.replace(path)


def stable_hash(value: Any) -> str:
    packed = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(packed.encode("utf-8")).hexdigest()


def spoken_text(item: dict[str, Any]) -> str:
    """For vocab, use the kana filename stem when it is a valid kana reading."""
    text = str(item.get("text") or "").strip()
    if item.get("category") == "vocab" and text:
        stem = Path(str(item.get("output") or "")).stem
        if stem and all(0x3041 <= ord(c) <= 0x30FF or c == "ー" for c in stem):
            return stem
    return text


def item_segments(item: dict[str, Any], default_role: str = DEFAULT_ROLE) -> list[dict[str, Any]]:
    """Normalize both single-text items and multi-segment conversations."""
    fallback_role = str(item.get("voice_role") or default_role)
    segments = item.get("segments")
    if isinstance(segments, list) and segments:
        normalized: list[dict[str, Any]] = []
        for segment in segments:
            if not isinstance(segment, dict) or not str(segment.get("text") or "").strip():
                continue
            part = dict(segment)
            part["voice_role"] = str(part.get("voice_role") or fallback_role)
            part["pause_after_ms"] = int(part.get("pause_after_ms", 0) or 0)
            normalized.append(part)
        return normalized

    text = spoken_text(item)
    if not text:
        return []
    return [{
        "text": text,
        "voice_role": fallback_role,
        "pause_after_ms": 0,
    }]


def mora_count(text: str) -> int:
    count = 0
    for ch in text:
        if ch in SMALL_KANA:
            continue
        if 0x3041 <= ord(ch) <= 0x30FF:
            count += 1
        elif ch.isalnum():
            count += 2
    return max(count, 1)


def analyze_wav(wav_data: bytes) -> dict[str, Any] | None:
    """Measure speech and internal silence; return speech trimmed with EDGE_PAD."""
    with wave.open(io.BytesIO(wav_data), "rb") as handle:
        rate = handle.getframerate()
        channels = handle.getnchannels()
        width = handle.getsampwidth()
        frames = handle.readframes(handle.getnframes())
    if width != 2:
        return None
    samples = array("h")
    samples.frombytes(frames)
    if channels > 1:
        samples = samples[::channels]
    win = max(1, int(rate * 0.01))
    rms = []
    for i in range(0, len(samples) - win + 1, win):
        chunk = samples[i:i + win]
        rms.append(math.sqrt(sum(x * x for x in chunk) / win))
    if not rms or max(rms) < 50:
        return None
    threshold = max(max(rms) * 0.06, 20.0)
    voiced = [i for i, value in enumerate(rms) if value > threshold]
    if not voiced:
        return None
    first, last = voiced[0], voiced[-1]
    max_gap = run = 0
    for value in rms[first:last + 1]:
        if value <= threshold:
            run += 1
            max_gap = max(max_gap, run)
        else:
            run = 0
    start = max(0, int((first * win / rate - EDGE_PAD) * rate))
    end = min(len(samples), int(((last + 1) * win / rate + EDGE_PAD) * rate))
    out = io.BytesIO()
    with wave.open(out, "wb") as writer:
        writer.setnchannels(1)
        writer.setsampwidth(2)
        writer.setframerate(rate)
        writer.writeframes(samples[start:end].tobytes())
    return {
        "speech_seconds": (last - first + 1) * win / rate,
        "max_gap_seconds": max_gap * win / rate,
        "trimmed_wav": out.getvalue(),
    }


def cut_at_long_gap(wav_data: bytes, min_gap: float = 0.6) -> bytes:
    """Keep audio before the first long silence following speech (for short items)."""
    with wave.open(io.BytesIO(wav_data), "rb") as handle:
        params = handle.getparams()
        frames = handle.readframes(handle.getnframes())
    if params.sampwidth != 2:
        return wav_data
    samples = array("h")
    samples.frombytes(frames)
    mono = samples[::params.nchannels]
    win = max(1, int(params.framerate * 0.01))
    rms = [
        math.sqrt(sum(x * x for x in mono[i:i + win]) / win)
        for i in range(0, len(mono) - win + 1, win)
    ]
    if not rms or max(rms) < 50:
        return wav_data
    threshold = max(max(rms) * 0.06, 20.0)
    started = False
    run = 0
    for i, value in enumerate(rms):
        if value > threshold:
            started = True
            run = 0
            continue
        run += 1
        if started and run * win / params.framerate >= min_gap:
            end = (i - run + 1) * win + int(params.framerate * EDGE_PAD)
            out = io.BytesIO()
            with wave.open(out, "wb") as writer:
                writer.setparams(params)
                writer.writeframes(frames[:end * params.nchannels * params.sampwidth])
            return out.getvalue()
    return wav_data


def build_verifier(model_name: str):
    """Optional Whisper check; needs faster-whisper and pykakasi."""
    try:
        from faster_whisper import WhisperModel
        import pykakasi
    except ImportError as exc:
        print(f"WARNING: --verify needs faster-whisper and pykakasi ({exc}). Continuing WITHOUT Whisper.")
        return None
    try:
        model = WhisperModel(model_name, device="cuda", compute_type="float16")
    except Exception as exc:  # noqa: BLE001
        print(f"WARNING: Whisper on GPU failed ({exc}); using CPU (slower).")
        model = WhisperModel(model_name, device="cpu", compute_type="int8")
    kks = pykakasi.kakasi()

    def to_hira(text: str) -> str:
        text = "".join(ch for ch in text if ch.isalnum() or ch == "ー")
        hira = "".join(part["hira"] for part in kks.convert(text))
        return "".join(chr(ord(c) - 0x60) if 0x30A1 <= ord(c) <= 0x30F6 else c for c in hira)

    def verify(wav_data: bytes, expected_text: str) -> float:
        fd, name = tempfile.mkstemp(suffix=".wav")
        os.close(fd)
        try:
            Path(name).write_bytes(wav_data)
            segments, _ = model.transcribe(
                name, language="ja", beam_size=5, condition_on_previous_text=False
            )
            heard = "".join(seg.text for seg in segments)
        finally:
            Path(name).unlink(missing_ok=True)
        return difflib.SequenceMatcher(None, to_hira(heard), to_hira(expected_text)).ratio()

    return verify


def http_json(url: str, *, method: str = "GET", payload: dict[str, Any] | None = None,
              timeout: float = 30.0) -> dict[str, Any]:
    data = None
    headers = {"Accept": "application/json"}
    if payload is not None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json; charset=utf-8"
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


def request_qwen_wav(base_url: str, text: str, voice_id: str, timeout: float) -> tuple[bytes, dict[str, Any]]:
    """POST UTF-8 JSON to Qwen and return the raw WAV response bytes."""
    payload = {"voice": voice_id, "input": text}
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        f"{base_url}/v1/audio/speech",
        data=body,
        headers={
            "Accept": "audio/wav",
            "Content-Type": "application/json; charset=utf-8",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            wav_data = response.read()
            response_info = {
                "voice_id": response.headers.get("X-Voice-ID", voice_id),
                "duration_header": response.headers.get("X-Audio-Duration"),
                "sample_rate_header": response.headers.get("X-Audio-Sample-Rate"),
                "http_status": response.status,
            }
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:1200]
        raise RuntimeError(f"Qwen API HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Cannot reach Qwen API: {exc.reason}") from exc

    if len(wav_data) < 44 or wav_data[:4] != b"RIFF" or wav_data[8:12] != b"WAVE":
        raise RuntimeError("Qwen API response was not a valid WAV file")
    try:
        with wave.open(io.BytesIO(wav_data), "rb") as handle:
            if handle.getframerate() <= 0 or handle.getnframes() <= 0:
                raise RuntimeError("Qwen returned an empty/invalid WAV stream")
            duration = handle.getnframes() / float(handle.getframerate())
            response_info["sample_rate"] = handle.getframerate()
            response_info["duration_seconds"] = round(duration, 3)
    except (wave.Error, ZeroDivisionError) as exc:
        raise RuntimeError(f"Could not inspect Qwen WAV response: {exc}") from exc

    # Basic safety check; the short-item quality path performs stricter checks below.
    max_reasonable_seconds = max(8.0, len(text) * 0.75)
    if duration > max_reasonable_seconds:
        raise RuntimeError(
            f"Suspiciously long Qwen result: {duration:.1f}s for {len(text)} input characters "
            f"(limit {max_reasonable_seconds:.1f}s). Output was rejected, not saved."
        )
    return wav_data, response_info


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


def validate_voice_config(config: dict[str, Any]) -> dict[str, list[str]]:
    pools = config.get("voice_by_role")
    if not isinstance(pools, dict) or not pools:
        raise ValueError("Qwen config must contain a non-empty voice_by_role object")
    normalized: dict[str, list[str]] = {}
    seen_ids: set[str] = set()
    for role, values in pools.items():
        if not isinstance(values, list) or len(values) < 2:
            raise ValueError(f"Role {role!r} must have at least two Qwen voice IDs")
        voice_ids = [str(value).strip() for value in values]
        if any(not value for value in voice_ids) or len(set(voice_ids)) != len(voice_ids):
            raise ValueError(f"Role {role!r} contains an empty or duplicate voice ID")
        normalized[str(role)] = voice_ids
        seen_ids.update(voice_ids)
    return normalized


def conversation_group_key(item: dict[str, Any], line_suffix_regex: str = r"[-_]l\d+$") -> str:
    """Return a stable conversation key.

    Multi-segment manifest entries are already a complete conversation. For
    separately stored lesson/dialogue lines such as ``...-a01-l01.mp3`` and
    ``...-a01-l02.mp3``, strip the final line number so all lines share the
    same voice assignment. Other files remain their own conversation.
    """
    output = str(item.get("output") or "").replace("\\", "/").strip("/")
    if output:
        path = Path(output)
        parent = path.parent.as_posix()
        stem = path.stem
        try:
            grouped_stem = re.sub(line_suffix_regex, "", stem, flags=re.IGNORECASE)
        except re.error as exc:
            raise ValueError(f"Invalid rotation.line_suffix_regex: {exc}") from exc
        if not grouped_stem:
            grouped_stem = stem
        return f"{parent}/{grouped_stem}" if parent not in ("", ".") else grouped_stem

    return str(item.get("id") or "unknown-item")


def load_or_create_voice_assignments(
    manifest: dict[str, Any], config: dict[str, Any], assignment_path: Path,
    default_role: str,
) -> dict[str, dict[str, str]]:
    """Persist random non-repeating voice choices per conversation and role.

    Every manifest item belonging to the same conversation receives the same
    voice for a given role. A role's choice cannot repeat in consecutive
    conversation groups (groups are ordered by first appearance in the manifest).
    """
    pools = validate_voice_config(config)
    rotation = config.get("rotation") or {}
    if rotation.get("mode") != "random_non_repeating":
        raise ValueError("Only rotation.mode='random_non_repeating' is supported")
    if rotation.get("scope") != "conversation":
        raise ValueError("rotation.scope must be 'conversation'")
    line_suffix_regex = str(rotation.get("line_suffix_regex") or r"[-_]l\d+$")

    saved_groups: dict[str, Any] = {}
    if assignment_path.is_file():
        existing = read_json(assignment_path)
        if not isinstance(existing, dict):
            raise ValueError(f"Unexpected voice assignment file structure: {assignment_path}")
        # Never reuse the older manifest-item assignment schema: it allowed
        # a character's voice to change between separate dialogue line files.
        if existing.get("scope") == "conversation" and isinstance(existing.get("groups"), dict):
            saved_groups = existing["groups"]

    group_order: list[str] = []
    roles_by_group: dict[str, list[str]] = {}
    items_by_group: dict[str, list[str]] = {}
    item_to_group: dict[str, str] = {}

    for index, item in enumerate(manifest.get("items", []), start=1):
        item_id = str(item.get("id") or item.get("output") or f"item-{index}")
        if item_id in item_to_group:
            raise ValueError(f"Duplicate manifest item ID: {item_id}")

        group_key = conversation_group_key(item, line_suffix_regex)
        if group_key not in roles_by_group:
            group_order.append(group_key)
            roles_by_group[group_key] = []
            items_by_group[group_key] = []
        item_to_group[item_id] = group_key
        items_by_group[group_key].append(item_id)

        for part in item_segments(item, default_role):
            role = str(part.get("voice_role") or item.get("voice_role") or default_role)
            if role not in pools:
                raise ValueError(
                    f"No Qwen voice pool configured for role {role!r} "
                    f"in manifest item {item_id!r} (conversation {group_key!r})"
                )
            if role not in roles_by_group[group_key]:
                roles_by_group[group_key].append(role)

    rng = random.SystemRandom()
    group_assignments: dict[str, dict[str, str]] = {}
    last_by_role: dict[str, str] = {}
    reassigned = 0

    for group_key in group_order:
        old_group = saved_groups.get(group_key, {})
        if not isinstance(old_group, dict):
            old_group = {}

        current: dict[str, str] = {}
        for role in roles_by_group[group_key]:
            options = pools[role]
            previous = last_by_role.get(role)
            selected = old_group.get(role)
            if selected not in options or selected == previous:
                candidates = [voice_id for voice_id in options if voice_id != previous]
                selected = rng.choice(candidates)
                if role in old_group:
                    reassigned += 1
            current[role] = selected
            last_by_role[role] = selected
        group_assignments[group_key] = current

    item_assignments: dict[str, dict[str, str]] = {}
    for item_id, group_key in item_to_group.items():
        item_assignments[item_id] = dict(group_assignments[group_key])

    payload = {
        "schema_version": 2,
        "mode": "random_non_repeating",
        "scope": "conversation",
        "line_suffix_regex": line_suffix_regex,
        "updated_at": utc_now(),
        "groups": group_assignments,
        "group_by_item": item_to_group,
        "items": item_assignments,
        "last_by_role": last_by_role,
    }
    write_json_atomic(assignment_path, payload)
    print(
        f"Voice assignments: {len(item_assignments)} manifest items across "
        f"{len(group_order)} conversations saved to {assignment_path}"
    )
    if reassigned:
        print(
            f"NOTE: {reassigned} saved role assignment(s) were changed to restore "
            "the no-immediate-repeat rule."
        )
    return item_assignments


def item_fingerprint(
    item: dict[str, Any], config: dict[str, Any],
    item_voice_assignments: dict[str, str], default_role: str,
) -> tuple[str, list[str]]:
    mapped = []
    voice_ids: list[str] = []
    for part in item_segments(item, default_role):
        role = str(part.get("voice_role") or item.get("voice_role") or default_role)
        voice_id = item_voice_assignments.get(role)
        if not voice_id:
            raise ValueError(f"No persisted Qwen voice assignment for role {role!r}")
        mapped.append({
            "text": str(part.get("text") or "").strip(),
            "role": role,
            "voice_id": voice_id,
            "pause_after_ms": int(part.get("pause_after_ms", 0) or 0),
        })
        voice_ids.append(voice_id)
    fingerprint_data = {
        "id": item.get("id"),
        "category": item.get("category"),
        "output": item.get("output"),
        "parts": mapped,
        "audio_processing": config.get("audio_processing", {}),
        "quality": {
            "takes": (config.get("_quality") or {}).get("takes", 1),
            "short_len": (config.get("_quality") or {}).get("short_len", 0),
        },
        "mp3_bitrate": config.get("mp3_bitrate", "128k"),
    }
    return stable_hash(fingerprint_data), voice_ids


def load_state(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"schema_version": 1, "updated_at": utc_now(), "items": {}}
    state = read_json(path)
    if not isinstance(state, dict) or not isinstance(state.get("items"), dict):
        raise ValueError(f"Unexpected state-file structure: {path}")
    return state


def choose_jobs(
    manifest: dict[str, Any], state: dict[str, Any], config: dict[str, Any],
    assignments: dict[str, dict[str, str]], default_role: str,
    categories: set[str] | None, force: bool,
) -> tuple[list[dict[str, Any]], dict[str, int]]:
    jobs: list[dict[str, Any]] = []
    counts = {"manifest": 0, "ready": 0, "skip_current": 0, "skip_legacy": 0, "filtered": 0}
    state_items = state["items"]
    for index, item in enumerate(manifest.get("items", []), start=1):
        counts["manifest"] += 1
        if categories and item.get("category") not in categories:
            counts["filtered"] += 1
            continue
        output = str(item.get("output") or "")
        destination = resolve_output_path(output)
        item_id = str(item.get("id") or output or f"item-{index}")
        voice_map = assignments.get(item_id, {})
        fingerprint, voice_ids = item_fingerprint(item, config, voice_map, default_role)
        old = state_items.get(item_id)
        if destination.exists() and not force:
            if isinstance(old, dict) and old.get("fingerprint") == fingerprint:
                counts["skip_current"] += 1
                continue
            if not isinstance(old, dict):
                counts["skip_legacy"] += 1
                continue
        jobs.append({
            "item": item,
            "item_id": item_id,
            "conversation_group": conversation_group_key(
                item, str((config.get("rotation") or {}).get("line_suffix_regex") or r"[-_]l\d+$")
            ),
            "destination": destination,
            "fingerprint": fingerprint,
            "voice_by_role": voice_map,
            "voice_ids": voice_ids,
        })
    counts["ready"] = len(jobs)
    return jobs, counts


def check_server(base_url: str, timeout: float, required_voice_ids: set[str]) -> None:
    health = http_json(f"{base_url}/health", timeout=timeout)
    if str(health.get("status", "")).lower() != "ok" or health.get("model_loaded") is not True:
        raise RuntimeError(f"Qwen health check did not confirm a loaded model: {health}")
    if int(health.get("voice_count", 0)) != 25:
        raise RuntimeError(f"Qwen API expected 25 registered voices, got: {health.get('voice_count')}")
    voices_response = http_json(f"{base_url}/v1/voices", timeout=timeout)
    available = {
        str(item.get("id")) for item in (voices_response.get("voices") or [])
        if isinstance(item, dict) and item.get("id")
    }
    missing = sorted(required_voice_ids - available)
    if missing:
        raise RuntimeError("Missing Qwen voice ID(s): " + ", ".join(missing))
    print(f"Qwen API server OK: {base_url}")
    print(f"Available Qwen voices: {len(available)}")


TTS_OVERRIDES = {
    "ほうほう": "方法",
}


def apply_override(text: str) -> str:
    core = text.rstrip(END_PUNCT)
    suffix = text[len(core):]
    return TTS_OVERRIDES.get(core, core) + suffix


def synthesize_take(base_url: str, text: str, voice_id: str, config: dict[str, Any],
                    timeout: float, retries: int, max_text_length: int) -> tuple[bytes, dict[str, Any]]:
    spoken = apply_override(text.strip())
    if not spoken:
        raise ValueError("Cannot synthesize empty text")
    if len(spoken) > max_text_length:
        raise ValueError(
            f"Text has {len(spoken)} characters; configured Qwen limit is {max_text_length}. "
            "Shorten/split the source text rather than truncating it automatically."
        )

    last_error: Exception | None = None
    for attempt in range(retries + 1):
        try:
            wav_data, info = request_qwen_wav(base_url, spoken, voice_id, timeout)
            diagnostics = {
                "duration_seconds": info["duration_seconds"],
                "sample_rate": info["sample_rate"],
                "voice_id": voice_id,
                "http_status": info.get("http_status"),
                "input_text": spoken,
            }
            return wav_data, diagnostics
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            if attempt < retries:
                wait = min(2 ** attempt, 8)
                print(f"    retry {attempt + 1}/{retries} after error: {exc} (wait {wait}s)")
                time.sleep(wait)
    assert last_error is not None
    raise last_error


def synthesize_wav(base_url: str, text: str, voice_id: str, config: dict[str, Any],
                   timeout: float, retries: int, max_text_length: int) -> tuple[bytes, dict[str, Any]]:
    """Long text: one take. Short text: best-of-N with duration/silence checks."""
    quality = config.get("_quality") or {}
    spoken = text.strip()
    takes = int(quality.get("takes", 1))
    if not spoken or takes <= 1 or len(spoken) > int(quality.get("short_len", 0)):
        return synthesize_take(base_url, text, voice_id, config, timeout, retries, max_text_length)

    suffix = str(quality.get("suffix") or "")
    tts_text = spoken if (not suffix or spoken[-1] in END_PUNCT) else spoken + suffix
    verifier = quality.get("verifier")
    threshold = float(quality.get("threshold", 0.8))
    pauses = sum(1 for ch in spoken if ch in PAUSE_PUNCT)
    expected = 0.1 + SEC_PER_MORA * mora_count(spoken) + 0.25 * pauses
    allowed_gap = MAX_INTERNAL_GAP + 0.4 * pauses + 0.12 * sum(1 for ch in spoken if ch in "っッ")

    rejects: list[str] = []
    for take in range(1, takes + 1):
        try:
            wav_data, info = synthesize_take(
                base_url, tts_text, voice_id, config, timeout, retries, max_text_length
            )
        except Exception as exc:  # noqa: BLE001
            rejects.append(f"take {take}: {exc}")
            print(f"    take {take}/{takes}: API/duration error: {exc}")
            continue
        if not pauses:
            wav_data = cut_at_long_gap(wav_data)
        stats = analyze_wav(wav_data)
        similarity = None
        if stats is None:
            reason = "silent audio"
        elif stats["speech_seconds"] > expected * MAX_RATIO + 0.15:
            reason = "too long (repeat/ramble?)"
        elif stats["speech_seconds"] < expected * MIN_RATIO:
            reason = "too short (cut off?)"
        elif stats["max_gap_seconds"] > allowed_gap:
            reason = "pause in the middle"
        else:
            reason = ""
            if verifier is not None:
                similarity = verifier(stats["trimmed_wav"], spoken)
                if similarity < threshold:
                    reason = f"Whisper heard something else (similarity {similarity:.2f})"
        if stats is not None:
            print(
                f"    take {take}/{takes}: speech={stats['speech_seconds']:.2f}s "
                f"(expected ~{expected:.2f}s) gap={stats['max_gap_seconds']:.2f}s "
                f"| {reason or 'OK'}"
            )
        else:
            print(f"    take {take}/{takes}: {reason}")
        if reason:
            rejects.append(f"take {take}: {reason}")
            continue
        info["duration_seconds"] = round(stats["speech_seconds"], 3)
        info["take"] = take
        info["tts_text"] = tts_text
        if similarity is not None:
            info["verify_similarity"] = round(similarity, 3)
        return stats["trimmed_wav"], info
    raise RuntimeError(f"No acceptable take after {takes} tries: " + "; ".join(rejects[-3:]))


def postprocess_audio_wav(wav_data: bytes, ffmpeg: str, role: str,
                          config: dict[str, Any]) -> tuple[bytes, dict[str, Any]]:
    """Trim excessive leading/trailing silence and apply configured role tempo."""
    settings = config.get("audio_processing") or {}
    silence = settings.get("silence_cleanup") or {}
    speed_map = settings.get("speed_by_role") or {}
    speed = float(speed_map.get(role, 1.0))
    if not math.isfinite(speed) or not 0.5 <= speed <= 2.0:
        raise ValueError(f"Invalid tempo {speed!r} for role {role!r}")

    with wave.open(io.BytesIO(wav_data), "rb") as handle:
        input_duration = handle.getnframes() / float(handle.getframerate())

    filters: list[str] = []
    if silence.get("enabled", True):
        start_duration = float(silence.get("start_duration", 0.05))
        start_silence = float(silence.get("start_silence", 0.05))
        stop_duration = float(silence.get("stop_duration", 0.25))
        stop_silence = float(silence.get("stop_silence", 0.2))
        if min(start_duration, start_silence, stop_duration, stop_silence) < 0:
            raise ValueError("Audio silence durations cannot be negative")
        filters.append(
            "silenceremove="
            f"start_periods={int(silence.get('start_periods', 1))}:"
            f"start_duration={start_duration}:"
            f"start_threshold={float(silence.get('start_threshold_db', -55))}dB:"
            f"start_silence={start_silence}:"
            f"stop_periods={int(silence.get('stop_periods', -1))}:"
            f"stop_duration={stop_duration}:"
            f"stop_threshold={float(silence.get('stop_threshold_db', -40))}dB:"
            f"stop_silence={stop_silence}"
        )
    if abs(speed - 1.0) > 0.001:
        filters.append(f"atempo={speed:.3f}")
    if not filters:
        return wav_data, {
            "role": role, "speed": speed,
            "input_duration_seconds": round(input_duration, 3),
            "output_duration_seconds": round(input_duration, 3), "filters": [],
        }

    with tempfile.TemporaryDirectory(prefix="fude-qwen-audio-process-") as temp_dir_name:
        temp_dir = Path(temp_dir_name)
        source_path = temp_dir / "source.wav"
        output_path = temp_dir / "processed.wav"
        source_path.write_bytes(wav_data)
        command = [
            ffmpeg, "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(source_path), "-af", ",".join(filters),
            "-c:a", "pcm_s16le", str(output_path),
        ]
        completed = subprocess.run(command, capture_output=True, text=True, check=False)
        if completed.returncode != 0 or not output_path.is_file():
            detail = (completed.stderr or completed.stdout or "FFmpeg audio processing failed").strip()
            raise RuntimeError(detail[-2000:])
        processed = output_path.read_bytes()

    if len(processed) < 44 or processed[:4] != b"RIFF" or processed[8:12] != b"WAVE":
        raise RuntimeError("FFmpeg audio processing did not produce a valid WAV")
    with wave.open(io.BytesIO(processed), "rb") as handle:
        output_duration = handle.getnframes() / float(handle.getframerate())
    return processed, {
        "role": role, "speed": speed,
        "input_duration_seconds": round(input_duration, 3),
        "output_duration_seconds": round(output_duration, 3), "filters": filters,
    }


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
        for index, _wav_path in enumerate(wav_paths):
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
        filters.append("".join(concat_inputs) + f"concat=n={len(concat_inputs)}:v=0:a=1[out]")
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
                   ffmpeg: str, timeout: float, retries: int, max_text_length: int,
                   default_role: str) -> list[dict[str, Any]]:
    item = job["item"]
    segments = item_segments(item, default_role)
    if not segments:
        raise ValueError("Manifest item contains neither text nor usable segments")
    diagnostics: list[dict[str, Any]] = []
    with tempfile.TemporaryDirectory(prefix="fude-qwen-audio-") as temp_dir_name:
        temp_dir = Path(temp_dir_name)
        wav_paths: list[Path] = []
        for index, segment in enumerate(segments, start=1):
            role = str(segment.get("voice_role") or item.get("voice_role") or default_role)
            voice_id = job["voice_by_role"].get(role)
            if not voice_id:
                raise ValueError(f"No voice assignment for role {role!r} in item {job['item_id']!r}")
            wav_data, info = synthesize_wav(
                base_url, str(segment.get("text") or ""), voice_id, config,
                timeout, retries, max_text_length,
            )
            wav_data, processing_info = postprocess_audio_wav(wav_data, ffmpeg, role, config)
            info["synthesis_duration_seconds"] = info.get("duration_seconds")
            info["duration_seconds"] = processing_info["output_duration_seconds"]
            info["audio_processing"] = processing_info
            info["input_text"] = str(segment.get("text") or "")
            info["voice_role"] = role
            info["voice_id"] = voice_id
            diagnostics.append(info)
            print(
                f"    segment {index}: role={role} voice={voice_id} "
                f"duration={info['duration_seconds']:.2f}s"
            )
            wav_path = temp_dir / f"segment-{index:04d}.wav"
            wav_path.write_bytes(wav_data)
            wav_paths.append(wav_path)
        make_mp3(
            wav_paths, segments, job["destination"], ffmpeg,
            str(config.get("mp3_bitrate", "128k")),
        )
    return diagnostics


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate Fude MP3 audio through the local Qwen3-TTS API. Dry-run is the default."
    )
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--state", type=Path, default=DEFAULT_STATE)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--api-base-url", default=None,
                        help="Qwen API base URL; default is read from voice-presets-qwen.json")
    parser.add_argument("--category", action="append", default=[],
                        help="Only process this category; repeat the option to include more than one")
    parser.add_argument("--limit", type=int, default=0,
                        help="Process at most N pending items (useful for a small test batch)")
    parser.add_argument("--match", default="",
                        help="Only process items whose ID, output path, or speech text contains this string")
    parser.add_argument("--show-items", action="store_true", help="Print every planned item")
    parser.add_argument("--execute", action="store_true",
                        help="Actually synthesize audio; without this flag, only assignments and a preview are produced")
    parser.add_argument("--force", action="store_true",
                        help="Overwrite existing MP3s, including legacy files without a Qwen state record")
    parser.add_argument("--retries", type=int, default=1, help="Retries per Qwen request after a failure")
    parser.add_argument("--timeout", type=float, default=None, help="HTTP timeout in seconds")
    parser.add_argument("--max-text-length", type=int, default=300,
                        help="Reject longer segments instead of silently truncating them")
    parser.add_argument("--takes", type=int, default=1,
                        help="Max takes per SHORT item; first take passing automatic checks wins (1 = off)")
    parser.add_argument("--short-len", type=int, default=8,
                        help="Items whose text is at most this many characters use the best-of-N path")
    parser.add_argument("--short-suffix", default="。",
                        help="Appended to short text without end punctuation; '' = off")
    parser.add_argument("--verify", action="store_true",
                        help="Also check each short take with Whisper (pip install faster-whisper pykakasi)")
    parser.add_argument("--verify-threshold", type=float, default=0.8)
    parser.add_argument("--whisper-model", default="medium")
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
            raise ValueError("Qwen voice configuration must be a JSON object")

        default_role = str(
            config.get("default_voice_role")
            or manifest.get("default_voice_role")
            or DEFAULT_ROLE
        )
        pools = validate_voice_config(config)
        if default_role not in pools:
            raise ValueError(f"Default voice role {default_role!r} is not configured")
        base_url = normalize_base_url(args.api_base_url or config.get("api_base_url") or DEFAULT_API_URL)
        timeout = float(args.timeout or config.get("timeout_seconds", 600))
        if args.limit < 0 or args.retries < 0 or timeout <= 0 or args.max_text_length <= 0:
            raise ValueError("--limit/--retries must be non-negative; timeout and max-text-length must be positive")
        if args.takes < 1 or args.short_len < 0:
            raise ValueError("--takes must be at least 1 and --short-len cannot be negative")
        ffmpeg = shutil.which(args.ffmpeg) if not Path(args.ffmpeg).is_file() else args.ffmpeg
        if not ffmpeg:
            raise RuntimeError("FFmpeg was not found. Install it or pass --ffmpeg with the full executable path.")

        rotation = config.get("rotation") or {}
        assignment_name = str(rotation.get("assignment_file") or "audio-qwen-voice-assignments.json")
        assignment_path = Path(assignment_name)
        if not assignment_path.is_absolute():
            assignment_path = ROOT / assignment_path
        assignments = load_or_create_voice_assignments(
            manifest, config, assignment_path, default_role
        )

        state = load_state(args.state)
        config["_quality"] = {
            "takes": args.takes,
            "short_len": args.short_len,
            "suffix": args.short_suffix,
            "threshold": args.verify_threshold,
            "verifier": build_verifier(args.whisper_model) if (args.verify and args.execute) else None,
        }
        categories = set(args.category) if args.category else None
        manifest_categories = {str(item.get("category")) for item in manifest["items"]}
        unknown = sorted((categories or set()) - manifest_categories)
        if unknown:
            raise ValueError(
                "Unknown category name(s): " + ", ".join(unknown)
                + ". Available: " + ", ".join(sorted(manifest_categories))
            )

        jobs, counts = choose_jobs(
            manifest, state, config, assignments, default_role, categories, args.force
        )
        if args.match:
            needle = args.match.casefold()
            jobs = [
                job for job in jobs
                if needle in " ".join([
                    str(job["item"].get("id") or ""),
                    str(job["item"].get("output") or ""),
                    str(job["item"].get("text") or ""),
                    " ".join(str(part.get("text") or "") for part in item_segments(job["item"], default_role)),
                ]).casefold()
            ]
        counts["ready"] = len(jobs)
        if args.limit:
            jobs = jobs[:args.limit]

        print("Fude Qwen audio batch generator")
        print("-------------------------------")
        print(f"Manifest items: {counts['manifest']}")
        print(f"Pending after filters: {counts['ready']}")
        print(f"Already generated with matching Qwen state: {counts['skip_current']}")
        print(f"Existing audio protected from overwrite: {counts['skip_legacy']}")
        print(f"Voice assignment file: {assignment_path}")
        print("Voice rotation: random non-repeating per role, per conversation")
        print("Conversation grouping: matching output names with trailing -lNN/_lNN share one group")
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
            display_jobs = jobs if args.show_items else jobs[:12]
            for job in display_jobs:
                item = job["item"]
                parts = item_segments(item, default_role)
                roles_summary = ", ".join(
                    f"{role}={voice_id}" for role, voice_id in job["voice_by_role"].items()
                )
                preview_text = item.get("text") or f"{len(parts)} dialogue segments"
                print(
                    f"  [{item.get('category')}] {item.get('output')} "
                    f"conversation={job['conversation_group']} "
                    f"text={preview_text!r} voices=[{roles_summary}]"
                )
            if not args.show_items and len(jobs) > 12:
                print(f"  ... {len(jobs) - 12} more (use --show-items to list them)")
        if not args.execute:
            print("\nPreview only. Add --execute to start synthesis.")
            print("Note: the voice assignment metadata was saved; no MP3 audio was written.")
            return 0
        if not jobs:
            print("\nNothing to generate.")
            return 0

        required_voice_ids = {voice_id for job in jobs for voice_id in job["voice_ids"]}
        check_server(base_url, timeout, required_voice_ids)

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
                        args.retries, args.max_text_length, default_role,
                    )
                    state["items"][job["item_id"]] = {
                        "fingerprint": job["fingerprint"],
                        "output": item.get("output"),
                        "voice_by_role": job["voice_by_role"],
                        "voice_ids": sorted(set(job["voice_ids"])),
                        "segments": synthesis_info,
                        "generated_at": utc_now(),
                        "generator": "scripts/audio/generate_audio_qwen.py",
                    }
                    state["updated_at"] = utc_now()
                    write_json_atomic(args.state, state)
                    completed += 1
                    print("    OK")
                except KeyboardInterrupt:
                    raise
                except Exception as exc:  # noqa: BLE001
                    failures.append({
                        "id": str(item.get("id")),
                        "output": label,
                        "error": str(exc),
                    })
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
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
