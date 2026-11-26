#!/usr/bin/env python3
"""Build an inventory of audio already referenced by Fude.

This script ONLY reads Fude source data and writes audio-manifest.json.
It does not contact a TTS server, synthesize audio, overwrite MP3 files, or delete files.
Run it from any directory; the repository root is detected from this file's location.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public"

ROLE_NAMES = {
    "teen_female", "teen_male",
    "adult_female", "adult_male",
    "elderly_female", "elderly_male",
    "child_female", "child_male",
}
DEFAULT_ROLE = "teen_female"
IRODORI_ROLES = {
    "yui": "teen_female",
    "sota": "teen_male",
    "akiko": "adult_female",
    "kenji": "adult_male",
}
PRACTICAL_ROLE_ORDER = [
    "teen_female", "teen_male", "adult_female", "adult_male",
]
NO_SOUND_KANA = set("っッーぁぃぅぇぉゃゅょァィゥェォャュョ")


class ManifestBuilder:
    def __init__(self) -> None:
        self.items: list[dict[str, Any]] = []
        self.by_output: dict[str, dict[str, Any]] = {}
        self.warnings: list[str] = []
        self.category_counts: Counter[str] = Counter()

    def warn(self, message: str) -> None:
        self.warnings.append(message)

    def add(
        self,
        *,
        category: str,
        source: str,
        output: str,
        text: str | None = None,
        segments: list[dict[str, Any]] | None = None,
        speaker: str | None = None,
        voice_role: str = DEFAULT_ROLE,
        voice_role_source: str = "default",
    ) -> None:
        clean_text = clean_japanese(text or "")
        clean_segments: list[dict[str, Any]] = []

        for segment in segments or []:
            segment_text = clean_japanese(str(segment.get("text", "")))
            if not segment_text:
                continue
            clean_segments.append({
                "text": segment_text,
                "speaker": segment.get("speaker"),
                "voice_role": segment.get("voice_role", DEFAULT_ROLE),
                "voice_role_source": segment.get("voice_role_source", "default"),
                "pause_after_ms": int(segment.get("pause_after_ms", 0)),
            })

        if not clean_text and not clean_segments:
            return

        normalized_output = output.replace("\\", "/").lstrip("/")
        item = {
            "id": f"{category}:{normalized_output}",
            "category": category,
            "source": source.replace("\\", "/"),
            "output": normalized_output,
            "text": clean_text if clean_text else None,
            "segments": clean_segments or None,
            "speaker": speaker,
            "voice_role": voice_role if voice_role in ROLE_NAMES else DEFAULT_ROLE,
            "voice_role_source": voice_role_source,
            "language": "ja",
        }

        previous = self.by_output.get(normalized_output)
        if previous:
            previous_text = previous.get("text") or json.dumps(previous.get("segments"), ensure_ascii=False)
            current_text = item.get("text") or json.dumps(item.get("segments"), ensure_ascii=False)
            if previous_text != current_text:
                self.warn(
                    f"Output path collision with different text: {normalized_output} "
                    f"({previous['source']} vs {source})"
                )
            return

        self.by_output[normalized_output] = item
        self.items.append(item)
        self.category_counts[category] += 1


def read_json(path: Path) -> Any:
    if not path.is_file():
        raise FileNotFoundError(f"Required Fude data file not found: {path.relative_to(ROOT)}")
    with path.open("r", encoding="utf-8-sig") as handle:
        return json.load(handle)


def clean_japanese(value: Any) -> str:
    """Remove HTML/ruby markup while keeping the visible kanji and kana."""
    if value is None:
        return ""
    text = html.unescape(str(value))

    def ruby_base(match: re.Match[str]) -> str:
        body = re.sub(
            r"<rt\b[^>]*>.*?</rt>|<rp\b[^>]*>.*?</rp>",
            "",
            match.group(1),
            flags=re.IGNORECASE | re.DOTALL,
        )
        return re.sub(r"<[^>]+>", "", body)

    text = re.sub(
        r"<ruby\b[^>]*>(.*?)</ruby>",
        ruby_base,
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    text = re.sub(r"<rt\b[^>]*>.*?</rt>|<rp\b[^>]*>.*?</rp>", "", text,
                  flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"</?(?:ruby|span|b|strong|em|i|u|div|p|br|small|rt|rp)\b[^>]*>", " ", text,
                  flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", "", text)
    text = text.replace("<>", " ").replace("</>", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def safe_filename(value: str) -> str:
    return re.sub(r'[\\/:*?"<>|]', "_", value)


def prepare_vocab_pronunciation(reading: str) -> str | None:
    """Remove Japanese grammar placeholders that are not spoken aloud.

    A single placeholder marks an omitted word/slot (e.g. 〜かどうか -> かどうか).
    Multiple slots cannot be read naturally without an example sentence, so omit
    their audio item instead of sending an unpronounceable template to TTS.
    """
    placeholder_count = reading.count("〜") + reading.count("～")
    if placeholder_count > 1:
        return None
    spoken = reading.replace("〜", "").replace("～", "").strip()
    # Slash in the source represents alternative readings (e.g. ふん/ぷん).
    spoken = re.sub(r"[/／]", "、", spoken)
    return spoken or None


def to_katakana(value: str) -> str:
    return "".join(
        chr(ord(char) + 0x60) if "\u3041" <= char <= "\u3096" else char
        for char in value
    )


def decode_js_string(literal: str) -> str:
    try:
        return json.loads(literal)
    except Exception:
        if len(literal) >= 2 and literal[0] in ("'", '"'):
            body = literal[1:-1]
            return body.replace(r"\'", "'").replace(r'\"', '"').replace(r"\\", "\\")
        return literal


def load_kana_examples() -> dict[str, str]:
    """Reuse the kana example words already shown in the learning UI."""
    page = ROOT / "app" / "belajar" / "page.tsx"
    source = page.read_text(encoding="utf-8")
    section = re.search(
        r"const\s+KANA_EXAMPLES\s*:[\s\S]*?=\s*\{([\s\S]*?)\n\};",
        source,
        re.MULTILINE,
    )
    if not section:
        raise ValueError("Could not find KANA_EXAMPLES in app/belajar/page.tsx")

    examples: dict[str, str] = {}
    pattern = re.compile(r'"([^"]+)"\s*:\s*\{\s*word:\s*"([^"]+)"')
    for match in pattern.finditer(section.group(1)):
        examples[match.group(1)] = match.group(2)

    # Keep the existing instructional convention: を is demonstrated inside a phrase
    # so it is not pronounced as the standalone object particle.
    examples["を"] = "ごはんを"
    examples["ヲ"] = "ごはんを"
    return examples


def normalize_role(raw_role: Any, speaker: str = "") -> tuple[str, str]:
    role = str(raw_role or "").strip().lower()
    if role in ROLE_NAMES:
        return role, "declared-speaker-role"
    if role in {"default", "narrator", "narator", ""}:
        return DEFAULT_ROLE, "fude-default"
    if role in {"child", "kid"}:
        return "child_female" if speaker.lower() in {"emi", "hana", "mei"} else "child_male", "age-only-role"
    if role in {"elderly", "senior"}:
        return "elderly_male" if speaker.lower() in {"genzo", "haruto", "satoshi"} else "elderly_female", "age-only-role"
    if role in {"male", "man", "pria", "cowok"}:
        return "adult_male", "gender-only-role"
    if role in {"female", "woman", "perempuan", "cewek"}:
        return "adult_female", "gender-only-role"
    return DEFAULT_ROLE, "fallback-default"


def add_vocab(builder: ManifestBuilder) -> None:
    path = ROOT / "data" / "kosakata.json"
    chapters = read_json(path)
    for chapter in chapters:
        for vocab in chapter.get("vocab", []):
            reading = str(vocab.get("kana") or "").strip()
            if not reading:
                continue
            kanji_form = clean_japanese(vocab.get("kanji") or "")
            has_placeholder = any(mark in reading or mark in kanji_form for mark in ("〜", "～"))
            if has_placeholder:
                # Grammar slots must not be spoken. Use the kana field to preserve
                # irregular readings such as ～君 -> くん.
                spoken_text = prepare_vocab_pronunciation(reading)
            else:
                # A kanji spelling gives the Japanese TTS model lexical context.
                # The audio URL remains keyed by kana, exactly as Fude expects.
                spoken_text = kanji_form or prepare_vocab_pronunciation(reading)
            if not spoken_text:
                builder.warn(
                    f"Skipped vocab audio for template with multiple placeholders: {reading!r}"
                )
                continue
            builder.add(
                category="vocab",
                source="data/kosakata.json",
                output=f"audio/vocab/{safe_filename(reading)}.mp3",
                text=spoken_text,
                voice_role=DEFAULT_ROLE,
                voice_role_source="fude-default",
            )


def add_kana(builder: ManifestBuilder) -> None:
    path = ROOT / "data" / "hira-kata.json"
    chapters = read_json(path)
    examples = load_kana_examples()

    for chapter in chapters:
        for vocab in chapter.get("vocab", []):
            char = str(vocab.get("kanji") or vocab.get("kana") or "").strip()
            if not char or char in NO_SOUND_KANA:
                continue
            example = examples.get(char)
            if not example:
                builder.warn(f"Kana example missing for {char!r}; no audio item added.")
                continue
            # Keep the native script and separate the kana from its example with
            # a Japanese full stop so MioTTS makes a clear, natural pause.
            spoken = f"{char}。{example}"
            builder.add(
                category="kana",
                source="data/hira-kata.json + app/belajar/page.tsx",
                output=f"audio/kana/{safe_filename(char)}.mp3",
                text=spoken,
                voice_role=DEFAULT_ROLE,
                voice_role_source="fude-default",
            )


def add_stories(builder: ManifestBuilder) -> None:
    story_dir = ROOT / "data" / "story-details"
    if not story_dir.is_dir():
        raise FileNotFoundError("Required folder not found: data/story-details")

    for path in sorted(story_dir.glob("*.json")):
        story = read_json(path)
        story_id = str(story.get("id") or path.stem)
        declared_speakers = story.get("speakers", {}) or {}

        for index, sentence in enumerate(story.get("sentences", []), start=1):
            raw_text = sentence.get("jp")
            if not raw_text:
                continue
            speaker = str(sentence.get("speaker") or "Narator")
            role, role_source = normalize_role(declared_speakers.get(speaker), speaker)
            builder.add(
                category="stories",
                source=str(path.relative_to(ROOT)),
                output=f"audio/{safe_filename(story_id)}-{index}.mp3",
                text=raw_text,
                speaker=speaker,
                voice_role=role,
                voice_role_source=role_source,
            )


def add_jlpt_listening(builder: ManifestBuilder) -> None:
    path = ROOT / "data" / "jlpt.json"
    levels = read_json(path)

    for level_data in levels:
        level = str(level_data.get("level") or "").lower()
        for test_set in level_data.get("sets", []):
            questions = test_set.get("sections", {}).get("listening", [])
            for question in questions:
                audio_url = question.get("audioUrl")
                dialogue = question.get("dialogue") or []
                if not audio_url or not dialogue:
                    continue

                segments = []
                for line in dialogue:
                    speaker = str(line.get("speaker") or "").strip()
                    speaker_lower = speaker.lower()
                    if speaker_lower in {"male", "pria", "otoko", "man"}:
                        role = "adult_male"
                    elif speaker_lower in {"female", "perempuan", "onna", "woman"}:
                        role = "adult_female"
                    else:
                        role = "adult_female"
                    segments.append({
                        "text": line.get("jp", ""),
                        "speaker": speaker or None,
                        "voice_role": role,
                        "voice_role_source": "jlpt-dialogue-label",
                        "pause_after_ms": 500,
                    })

                output = str(audio_url).lstrip("/")
                if not output.startswith("audio/"):
                    builder.warn(f"Unexpected JLPT audioUrl path: {audio_url}")
                    continue
                builder.add(
                    category="jlpt-listening",
                    source="data/jlpt.json",
                    output=output,
                    segments=segments,
                    voice_role="adult_female",
                    voice_role_source="mixed-dialogue",
                )


def add_irodori(builder: ManifestBuilder) -> None:
    root = ROOT / "app" / "irodori"
    if not root.is_dir():
        raise FileNotFoundError("Required folder not found: app/irodori")

    utterance_pattern = re.compile(
        r"""\{\s*speakerId:\s*["']([^"']+)["']([\s\S]*?)audioFileName:\s*["']([^"']+)["'][\s\S]*?\}""",
        re.MULTILINE,
    )
    japanese_pattern = re.compile(
        r"\bjapanese:\s*([\s\S]*?),\s*romaji:",
        re.MULTILINE,
    )

    for page in sorted(root.rglob("page.tsx")):
        source = page.read_text(encoding="utf-8")
        for match in utterance_pattern.finditer(source):
            speaker_id = match.group(1).strip()
            body = match.group(2)
            filename = safe_filename(match.group(3).strip())
            japanese_match = japanese_pattern.search(body)
            if not japanese_match or not filename:
                continue
            japanese = clean_japanese(japanese_match.group(1).replace("<>", "").replace("</>", ""))
            if not japanese:
                continue
            role = IRODORI_ROLES.get(speaker_id, DEFAULT_ROLE)
            role_source = "irodori-speaker-map" if speaker_id in IRODORI_ROLES else "fude-default"
            builder.add(
                category="irodori",
                source=str(page.relative_to(ROOT)),
                output=f"audio/irodori/{filename}",
                text=japanese,
                speaker=speaker_id,
                voice_role=role,
                voice_role_source=role_source,
            )


def add_practical(builder: ManifestBuilder) -> None:
    root = ROOT / "app" / "ungkapan-praktis"
    voices_path = ROOT / "data" / "voices.json"
    voice_config = read_json(voices_path) if voices_path.is_file() else {}
    name_bank = voice_config.get("name_bank", {})

    phrase_string = re.compile(
        r"""jp:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')""",
        re.MULTILINE,
    )
    dialogue_line = re.compile(
        r"""\{\s*speaker:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')\s*,\s*jp:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')""",
        re.MULTILINE,
    )

    global_speaker_roles: dict[str, str] = {}

    for page in sorted(root.glob("*/page.tsx")):
        category_id = page.parent.name
        source = page.read_text(encoding="utf-8")

        phrase_section = re.search(
            r"\bconst\s+phrases\b[\s\S]*?=\s*\[([\s\S]*?)\];\s*const\s+dialogues\b",
            source,
            re.MULTILINE,
        )
        if phrase_section:
            groups = re.finditer(
                r"\bitems:\s*\[([\s\S]*?)\]",
                phrase_section.group(1),
                re.MULTILINE,
            )
            for group_index, group_match in enumerate(groups, start=1):
                for item_index, item_match in enumerate(
                    phrase_string.finditer(group_match.group(1)), start=1
                ):
                    phrase = clean_japanese(decode_js_string(item_match.group(1)))
                    if not phrase:
                        continue
                    output = (
                        f"audio/praktis/{category_id}-phrase-"
                        f"{group_index:02d}-{item_index:02d}.mp3"
                    )
                    builder.add(
                        category="practical-phrases",
                        source=str(page.relative_to(ROOT)),
                        output=output,
                        text=phrase,
                        voice_role=DEFAULT_ROLE,
                        voice_role_source="fude-default",
                    )

        dialogue_section = re.search(
            r"\bconst\s+dialogues\b[\s\S]*?=\s*\[([\s\S]*?)\];\s*const\s+practicalCategory\b",
            source,
            re.MULTILINE,
        )
        if not dialogue_section:
            continue

        dialogue_blocks = re.finditer(
            r"\blines:\s*\[([\s\S]*?)\]",
            dialogue_section.group(1),
            re.MULTILINE,
        )
        for dialogue_index, dialogue_match in enumerate(dialogue_blocks, start=1):
            lines = list(dialogue_line.finditer(dialogue_match.group(1)))
            first_seen: dict[str, int] = {}
            for line_match in lines:
                label = clean_japanese(decode_js_string(line_match.group(1))).strip() or "Narator"
                if label not in first_seen:
                    first_seen[label] = len(first_seen)

            for line_index, line_match in enumerate(lines, start=1):
                label = clean_japanese(decode_js_string(line_match.group(1))).strip() or "Narator"
                japanese = clean_japanese(decode_js_string(line_match.group(2)))
                if not japanese:
                    continue

                if label in global_speaker_roles:
                    role = global_speaker_roles[label]
                    role_source = "stable-speaker-label"
                elif label in name_bank and str(name_bank[label]) in ROLE_NAMES:
                    role = str(name_bank[label])
                    role_source = "data/voices.json name_bank"
                    global_speaker_roles[label] = role
                elif any(token in label for token in ("店員", "スタッフ", "受付", "先生", "女性", "女")):
                    role = "adult_female"
                    role_source = "japanese-speaker-label"
                    global_speaker_roles[label] = role
                elif any(token in label for token in ("店長", "男性", "男")):
                    role = "adult_male"
                    role_source = "japanese-speaker-label"
                    global_speaker_roles[label] = role
                else:
                    position = first_seen.get(label, 0)
                    role = PRACTICAL_ROLE_ORDER[position % len(PRACTICAL_ROLE_ORDER)]
                    role_source = "dialogue-speaker-order"
                    global_speaker_roles[label] = role

                output = (
                    f"audio/praktis/{category_id}-dialogue-"
                    f"{dialogue_index:02d}-{line_index:02d}.mp3"
                )
                builder.add(
                    category="practical-dialogue",
                    source=str(page.relative_to(ROOT)),
                    output=output,
                    text=japanese,
                    speaker=label,
                    voice_role=role,
                    voice_role_source=role_source,
                )


def build_manifest() -> dict[str, Any]:
    builder = ManifestBuilder()
    add_vocab(builder)
    add_kana(builder)
    add_stories(builder)
    add_jlpt_listening(builder)
    add_irodori(builder)
    add_practical(builder)

    items = sorted(builder.items, key=lambda item: (item["category"], item["output"]))
    return {
        "schema_version": 1,
        "project": "Fude",
        "description": (
            "Inventory of Japanese audio items currently wired into Fude. "
            "This file is a preparation manifest; it does not synthesize audio."
        ),
        "audio_root": "public",
        "default_voice_role": DEFAULT_ROLE,
        "items_count": len(items),
        "category_counts": dict(sorted(builder.category_counts.items())),
        "warnings_count": len(builder.warnings),
        "warnings": builder.warnings,
        "items": items,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build Fude's audio manifest without generating or deleting audio."
    )
    parser.add_argument(
        "--output",
        default="audio-manifest.json",
        help="Output JSON path, relative to the repository root unless absolute.",
    )
    parser.add_argument(
        "--summary-only",
        action="store_true",
        help="Print counts but do not write the manifest file.",
    )
    args = parser.parse_args()

    try:
        manifest = build_manifest()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    print("Fude audio manifest")
    print("------------------")
    print(f"Items: {manifest['items_count']}")
    for category, count in manifest["category_counts"].items():
        print(f"  {category}: {count}")
    print(f"Warnings: {manifest['warnings_count']}")

    if not args.summary_only:
        output = Path(args.output)
        if not output.is_absolute():
            output = ROOT / output
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Manifest written: {output}")

    print("No TTS server was contacted. No audio file was created, overwritten, or deleted.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
