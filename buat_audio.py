import os
import sys
import json
import re
import html
import urllib.parse
import urllib.request

# ============================================================
# Generator audio pakai VOICEVOX (gratis, jalan lokal).
# Syarat: aplikasi VOICEVOX / VOICEVOX Engine harus SEDANG JALAN
# (default: http://127.0.0.1:50021).
# Flag sama seperti script lama: --preview  --force  --only=a.wav,b.wav
# ============================================================

ROOT = r"D:\fude"
PUBLIC = os.path.join(ROOT, "public")
AUDIO_DIR = os.path.join(PUBLIC, "audio")
PREVIEW = "--preview" in sys.argv
OUTPUT_AUDIO_DIR = os.path.join(PUBLIC, "audio-preview") if PREVIEW else AUDIO_DIR

ENGINE = os.environ.get("VOICEVOX_URL", "http://127.0.0.1:50021")

# Pemetaan nama voice lama (yang ada di JSON) -> (karakter VOICEVOX, style).
# Nama karakter diterjemahkan ke ID otomatis lewat /speakers, jadi tidak perlu hafal ID.
# Cowok: 玄野武宏 / 白上虎太郎. (青山龍星 sengaja tidak dipakai: ada syarat khusus kalau dipakai perusahaan.)
VOICE_MAP = {
    "jm_kumo":       ("玄野武宏", "ノーマル"),
    "jf_alpha":      ("四国めたん", "ノーマル"),
    "jf_tebukuro":   ("波音リツ", "ノーマル"),
    "jf_gongitsune": ("春日部つむぎ", "ノーマル"),
    "jf_nezumi":     ("冥鳴ひまり", "ノーマル"),
}
DEFAULT_VOICE = "jf_alpha"

# Parameter suara. Coba ubah kalau kurang pas.
VOCAB_SPEED = 0.95
STORY_SPEED = 1.0
INTONATION = 1.15      # 1.0 = default; naikkan biar intonasi lebih terasa
PRE_SILENCE = 0.1      # detik hening di awal
POST_SILENCE = 0.2     # detik hening di akhir

# Kalau ada kata yang salah dibaca, paksa bacaannya. Contoh: {"今日": "きょう"}
READING_FIXES = {}

FORCE = "--force" in sys.argv
ONLY_AUDIO = next(
    (
        {name.strip().lower() for name in arg.split("=", 1)[1].split(",") if name.strip()}
        for arg in sys.argv
        if arg.startswith("--only=")
    ),
    None,
)

counter = {"jadi": 0, "lewat": 0, "error": 0}
seen = set()
_speaker_ids = {}


def safe_name(text):
    return re.sub(r'[\\/:*?"<>|]', "_", text)


def clean_html(text):
    """Buang furigana <rt>, pertahankan kanji supaya accent dibaca benar."""
    if not text:
        return ""
    text = html.unescape(str(text))

    def ruby_repl(match):
        block = match.group(0)
        base = re.sub(r"<rt\b[^>]*>.*?</rt>|<rp\b[^>]*>.*?</rp>", "", block,
                      flags=re.IGNORECASE | re.DOTALL)
        base = re.sub(r"<[^>]+>", "", base)
        return READING_FIXES.get(base, base)

    text = re.sub(r"<ruby\b[^>]*>.*?</ruby>", ruby_repl, text,
                  flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<rt\b[^>]*>.*?</rt>", "", text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<rp\b[^>]*>.*?</rp>", "", text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def http(method, path, params=None, body=None):
    url = ENGINE + path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    data = json.dumps(body).encode("utf-8") if body is not None else (b"" if method == "POST" else None)
    req = urllib.request.Request(url, data=data, method=method,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read()


def load_speakers():
    speakers = json.loads(http("GET", "/speakers"))
    for sp in speakers:
        for st in sp.get("styles", []):
            _speaker_ids[(sp["name"], st["name"])] = st["id"]


def speaker_id(voice):
    character, style = VOICE_MAP.get(voice, VOICE_MAP[DEFAULT_VOICE])
    sid = _speaker_ids.get((character, style))
    if sid is None:
        # fallback: style pertama milik karakter itu
        for (name, _), value in _speaker_ids.items():
            if name == character:
                return value
        raise RuntimeError(
            f"Karakter '{character}' belum terpasang di VOICEVOX. "
            f"Pasang dari menu 音声ライブラリ atau ganti VOICE_MAP."
        )
    return sid


def synth(text, speed, voice):
    sid = speaker_id(voice)
    query = json.loads(http("POST", "/audio_query", params={"text": text, "speaker": sid}))
    query["speedScale"] = float(speed)
    query["intonationScale"] = INTONATION
    query["prePhonemeLength"] = PRE_SILENCE
    query["postPhonemeLength"] = POST_SILENCE
    return http("POST", "/synthesis", params={"speaker": sid}, body=query)


def save(path, text, speed, voice=DEFAULT_VOICE):
    if ONLY_AUDIO and os.path.basename(path).lower() not in ONLY_AUDIO:
        return
    if path in seen:
        return
    seen.add(path)

    if os.path.exists(path) and not FORCE:
        counter["lewat"] += 1
        return

    clean_text = clean_html(text)
    if not clean_text:
        return

    try:
        wav_bytes = synth(clean_text, speed, voice)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            f.write(wav_bytes)
        counter["jadi"] += 1
        print(f"Jadi [{voice}]:", os.path.relpath(path, PUBLIC), "|", clean_text)
    except Exception as exc:
        counter["error"] += 1
        print(f"ERROR [{voice}] {path}: {exc}")


def collect_json_files(root):
    json_files = []
    for folder, dirs, files in os.walk(root):
        dirs[:] = [
            d for d in dirs
            if d not in ("node_modules", ".next", ".git", "public", "venv", ".venv")
        ]
        for filename in files:
            if filename.lower().endswith(".json"):
                json_files.append(os.path.join(folder, filename))
    return json_files


def main():
    if not os.path.isdir(ROOT):
        raise SystemExit(f"Folder project tidak ditemukan: {ROOT}")

    try:
        version = http("GET", "/version").decode("utf-8")
        load_speakers()
    except Exception as exc:
        raise SystemExit(
            f"Tidak bisa konek ke VOICEVOX di {ENGINE} ({exc}).\n"
            "Buka aplikasi VOICEVOX dulu, lalu jalankan script ini lagi."
        )

    print("VOICEVOX engine:", version)
    print("Mode:", "REGENERATE (--force)" if FORCE else "skip audio yang sudah ada")
    if PREVIEW:
        print("Preview disimpan ke:", OUTPUT_AUDIO_DIR)
    if ONLY_AUDIO:
        print("Hanya generate:", ", ".join(sorted(ONLY_AUDIO)))

    for jp in collect_json_files(ROOT):
        try:
            with open(jp, "r", encoding="utf-8-sig") as file:
                data = json.load(file)
        except Exception as exc:
            print(f"JSON dilewati ({jp}): {exc}")
            continue

        if not isinstance(data, list) or not data or not isinstance(data[0], dict):
            continue

        if "sentences" in data[0]:
            print(f"\nMemproses Cerita: {os.path.basename(jp)}")
            for story in data:
                if not isinstance(story, dict) or "id" not in story:
                    continue
                speed = story.get("speed", STORY_SPEED)
                speaker_voices = story.get("speakers", {}) or {}

                for index, sentence in enumerate(story.get("sentences", [])):
                    if not isinstance(sentence, dict):
                        continue
                    text = sentence.get("jp")
                    if not text:
                        continue
                    speaker = sentence.get("speaker", "Narator")
                    voice = speaker_voices.get(speaker, DEFAULT_VOICE)
                    filename = f"{story['id']}-{index + 1}.wav"
                    save(os.path.join(OUTPUT_AUDIO_DIR, filename), text, speed, voice)

        elif "vocab" in data[0]:
            print(f"\nMemproses Kosakata: {os.path.basename(jp)}")
            for chapter in data:
                if not isinstance(chapter, dict):
                    continue
                for vocab in chapter.get("vocab", []):
                    if not isinstance(vocab, dict):
                        continue
                    text = vocab.get("kana")
                    if not text:
                        continue
                    output_path = os.path.join(OUTPUT_AUDIO_DIR, "vocab", safe_name(text) + ".wav")
                    save(output_path, text, VOCAB_SPEED, DEFAULT_VOICE)

    print(
        "\nSelesai. Baru dibuat:", counter["jadi"],
        "| Dilewati:", counter["lewat"],
        "| Error:", counter["error"],
    )


if __name__ == "__main__":
    main()