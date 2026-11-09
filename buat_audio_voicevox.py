import io
import json
import html
import os
import random
import re
import sys
import urllib.parse
import urllib.request

from pydub import AudioSegment

# ============================================================
# Generator audio pakai VOICEVOX (gratis, jalan lokal) -> output MP3
#
# Pemakaian:
#   python buat_audio_voicevox.py             -> buat audio yang belum ada
#   python buat_audio_voicevox.py --force     -> timpa semua audio
#   python buat_audio_voicevox.py --preview   -> keluarin ke public/audio-preview
#   python buat_audio_voicevox.py --only-kana --force -> buat ulang audio hiragana/katakana saja
# ============================================================

# ---------- PATH & ARGUMEN ----------
ROOT = r"D:\fude"
PUBLIC = os.path.join(ROOT, "public")
AUDIO_DIR = os.path.join(PUBLIC, "audio")
VOICES_JSON = os.path.join(ROOT, "data", "voices.json")

PREVIEW = "--preview" in sys.argv
FORCE = "--force" in sys.argv
ONLY_KANA = "--only-kana" in sys.argv
OUTPUT_AUDIO_DIR = os.path.join(PUBLIC, "audio-preview") if PREVIEW else AUDIO_DIR

# ---------- VOICEVOX ----------
ENGINE = os.environ.get("VOICEVOX_URL", "http://127.0.0.1:50021")
DEFAULT_CHARACTER = "雨晴はう"
STYLE_PREFERENCE = ["ノーマル", "ふつう", "あまあま"]

# ---------- PARAMETER SUARA ----------
VOCAB_SPEED = 0.85      # lambat & jelas buat belajar kana/kosakata
STORY_SPEED = 0.95
INTONATION = 1.0
PRE_SILENCE = 0.1
POST_SILENCE = 0.3
VOLUME_SCALE = 1.5      # anti pecah
DIALOGUE_GAP_MS = 500   # jeda antar kalimat di percakapan JLPT

# ---------- KHUSUS KANA ----------
# Satu huruf sendirian sering dibaca VOICEVOX dengan tidak jelas. Jadi tiap huruf dibaca
# bareng kata contoh utuh, mis. "ア、あめ", dengan jalur yang sama persis seperti kosakata.
KANA_CHARACTER = DEFAULT_CHARACTER   # ganti kalau mau suara lain khusus kana
KANA_SPEED = VOCAB_SPEED

ROLE_ADJUSTMENTS = {
    "child": {"pitch": 0.15, "speed": 1.1},
    "elderly_male": {"pitch": -0.05, "speed": 0.85},
    "elderly_female": {"pitch": -0.02, "speed": 0.85},
}

NARRATOR_NAMES = {"narator", "narrator", "narasi", ""}
MALE_LABELS = {"pria", "male", "otoko"}

# ---------- STATE ----------
counter = {"jadi": 0, "lewat": 0, "error": 0}
seen_paths = set()
characters = {}           # nama karakter -> [(nama_style, id), ...]
global_speaker_map = {}   # nama tokoh cerita -> suara yang sudah dipilih
role_pools = {}
name_bank = {}


# ============================================================
# UTILITAS
# ============================================================
def safe_name(text):
    """Buang karakter yang dilarang di nama file Windows."""
    return re.sub(r'[\\/:*?"<>|]', "_", str(text))


def clean_html(text):
    """Hapus tag HTML + furigana (<rt>) supaya yang dibaca cuma teks aslinya."""
    if not text:
        return ""
    text = html.unescape(str(text))
    text = re.sub(r"<rt\b[^>]*>.*?</rt>|<rp\b[^>]*>.*?</rp>", "", text,
                  flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<[^>]+>", "", text)
    return re.sub(r"\s+", " ", text).strip()


def log_relative(prefix, path):
    print(f"{prefix}: {os.path.relpath(path, PUBLIC)}")


# ============================================================
# KOMUNIKASI DENGAN VOICEVOX
# ============================================================
def http(method, path, params=None, body=None):
    url = ENGINE + path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    if body is not None:
        data = json.dumps(body).encode("utf-8")
    else:
        data = b"" if method == "POST" else None
    req = urllib.request.Request(url, data=data, method=method,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read()


def load_speakers():
    for sp in json.loads(http("GET", "/speakers")):
        characters[sp["name"]] = [(st["name"], st["id"]) for st in sp.get("styles", [])]


def character_id(character):
    styles = characters.get(character)
    if not styles:
        if character == DEFAULT_CHARACTER:
            raise SystemExit(f"Karakter default '{DEFAULT_CHARACTER}' tidak ada di VOICEVOX.")
        return character_id(DEFAULT_CHARACTER)
    for pref in STYLE_PREFERENCE:
        for style_name, sid in styles:
            if style_name == pref:
                return sid
    return styles[0][1]


def synth(text, base_speed, sid, role="default"):
    """Teks -> bytes WAV."""
    if len(text) <= 2:
        text += "、"  # teks sangat pendek sering terpotong

    query = json.loads(http("POST", "/audio_query", params={"text": text, "speaker": sid}))
    adj = ROLE_ADJUSTMENTS.get(role, {})

    query["speedScale"] = float(base_speed * adj.get("speed", 1.0))
    query["pitchScale"] = float(adj.get("pitch", 0.0))
    query["intonationScale"] = INTONATION
    query["volumeScale"] = VOLUME_SCALE
    query["prePhonemeLength"] = PRE_SILENCE
    query["postPhonemeLength"] = POST_SILENCE

    return http("POST", "/synthesis", params={"speaker": sid}, body=query)


def synth_segment(text, speed, character, role="default"):
    wav_bytes = synth(text, speed, character_id(character), role)
    return AudioSegment.from_file(io.BytesIO(wav_bytes), format="wav")


def save(path_mp3, text, speed, character, role="default"):
    """Buat satu file MP3, kecuali sudah ada (kecuali --force)."""
    path_mp3 = os.path.abspath(path_mp3)

    if path_mp3 in seen_paths:
        return
    seen_paths.add(path_mp3)

    if os.path.exists(path_mp3) and not FORCE:
        counter["lewat"] += 1
        return

    clean_text = clean_html(text)
    if not clean_text:
        return

    try:
        audio = synth_segment(clean_text, speed, character, role)
        os.makedirs(os.path.dirname(path_mp3), exist_ok=True)
        audio.export(path_mp3, format="mp3", bitrate="192k")
        counter["jadi"] += 1
        print(f"Jadi [{character} | {role}]: {os.path.relpath(path_mp3, PUBLIC)} | {clean_text}")
    except Exception as exc:
        counter["error"] += 1
        print(f"ERROR [{character}] {path_mp3}: {exc}")


# ============================================================
# KANA (hiragana & katakana): huruf + kata contoh
# ============================================================
# Kata contoh hiragana (huruf -> kata). Boleh diedit kalau ada yang kurang cocok.
HIRAGANA_WORDS = {
    "あ": "あめ", "い": "いぬ", "う": "うみ", "え": "えき", "お": "おちゃ",
    "か": "かさ", "き": "きつね", "く": "くるま", "け": "けむり", "こ": "こども",
    "さ": "さかな", "し": "しお", "す": "すし", "せ": "せんせい", "そ": "そら",
    "た": "たこ", "ち": "ちず", "つ": "つき", "て": "てがみ", "と": "とり",
    "な": "なつ", "に": "にく", "ぬ": "ぬの", "ね": "ねこ", "の": "のり",
    "は": "はな", "ひ": "ひと", "ふ": "ふね", "へ": "へや", "ほ": "ほし",
    "ま": "まど", "み": "みず", "む": "むし", "め": "めがね", "も": "もも",
    "や": "やま", "ゆ": "ゆき", "よ": "よる",
    "ら": "らくだ", "り": "りんご", "る": "るす", "れ": "れもん", "ろ": "ろうそく",
    "わ": "わに", "を": "ごはんを", "ん": "ほん",
    "が": "がっこう", "ぎ": "ぎんこう", "ぐ": "ぐあい", "げ": "げんき", "ご": "ごはん",
    "ざ": "ざっし", "じ": "じてんしゃ", "ず": "ずぼん", "ぜ": "ぜんぶ", "ぞ": "ぞう",
    "だ": "だいこん", "ぢ": "はなぢ", "づ": "つづき", "で": "でんしゃ", "ど": "どあ",
    "ば": "ばなな", "び": "びょういん", "ぶ": "ぶた", "べ": "べんきょう", "ぼ": "ぼうし",
    "ぱ": "ぱん", "ぴ": "ぴあの", "ぷ": "ぷりん", "ぺ": "ぺん", "ぽ": "ぽすと",
    "きゃ": "きゃく", "きゅ": "きゅうり", "きょ": "きょう",
    "ぎゃ": "ぎゃく", "ぎゅ": "ぎゅうにゅう", "ぎょ": "ぎょうざ",
    "しゃ": "しゃしん", "しゅ": "しゅくだい", "しょ": "しょくどう",
    "じゃ": "じゃがいも", "じゅ": "じゅうしょ", "じょ": "じょうず",
    "ちゃ": "ちゃいろ", "ちゅ": "ちゅうしゃ", "ちょ": "ちょうちょ",
    "にゃ": "にゃんこ", "にゅ": "にゅうがく", "にょ": "にょうぼう",
    "ひゃ": "ひゃく", "ひゅ": "ひゅうひゅう", "ひょ": "ひょうたん",
    "びゃ": "さんびゃく", "びゅ": "びゅうびゅう", "びょ": "びょうき",
    "ぴゃ": "ろっぴゃく", "ぴゅ": "ぴゅうぴゅう", "ぴょ": "ぴょんぴょん",
    "みゃ": "みゃくはく", "みゅ": "みゅうみゅう", "みょ": "みょうじ",
    "りゃ": "りゃくご", "りゅ": "りゅう", "りょ": "りょこう",
}

# Kata contoh katakana (kata serapan). Huruf yang tidak ada di sini otomatis memakai
# kata hiragana di atas yang diubah ke katakana.
KATAKANA_WORDS = {
    "ア": "アイス", "イ": "インク", "ウ": "ウイスキー", "エ": "エアコン", "オ": "オレンジ",
    "カ": "カメラ", "キ": "キウイ", "ク": "クラス", "ケ": "ケーキ", "コ": "コーヒー",
    "サ": "サラダ", "シ": "シネマ", "ス": "スープ", "セ": "セーター", "ソ": "ソファ",
    "タ": "タクシー", "チ": "チーズ", "ツ": "ツアー", "テ": "テレビ", "ト": "トマト",
    "ナ": "ナイフ", "ニ": "ニット", "ヌ": "ヌードル", "ネ": "ネクタイ", "ノ": "ノート",
    "ハ": "ハム", "ヒ": "ヒーター", "フ": "フルーツ", "ヘ": "ヘリコプター", "ホ": "ホテル",
    "マ": "マスク", "ミ": "ミルク", "ム": "ムービー", "メ": "メロン", "モ": "モデル",
    "ヤ": "ヤード", "ユ": "ユニフォーム", "ヨ": "ヨーグルト",
    "ラ": "ラジオ", "リ": "リボン", "ル": "ルール", "レ": "レモン", "ロ": "ロボット",
    "ワ": "ワイン", "ン": "パン",
    "ガ": "ガム", "ギ": "ギター", "グ": "グラス", "ゲ": "ゲーム", "ゴ": "ゴルフ",
    "ザ": "ザクロ", "ジ": "ジーンズ", "ズ": "ズボン", "ゼ": "ゼリー", "ゾ": "ゾーン",
    "ダ": "ダンス", "デ": "デパート", "ド": "ドア",
    "バ": "バナナ", "ビ": "ビール", "ブ": "ブーツ", "ベ": "ベッド", "ボ": "ボール",
    "パ": "パン", "ピ": "ピアノ", "プ": "プール", "ペ": "ペン", "ポ": "ポスト",
    "キャ": "キャベツ", "キュ": "キュウリ", "キョ": "キョウリュウ",
    "シャ": "シャツ", "シュ": "シュークリーム", "ショ": "ショッピング",
    "ジャ": "ジャム", "ジュ": "ジュース", "ジョ": "ジョギング",
    "チャ": "チャンス", "チュ": "チューリップ", "チョ": "チョコレート",
    "ニュ": "ニュース", "ヒュ": "ヒューマン", "ミュ": "ミュージック",
    "リュ": "リュック", "ギャ": "ギャグ", "ギョ": "ギョウザ",
}

NO_SOUND = set("っッーぁぃぅぇぉゃゅょァィゥェォャュョ")  # bukan bunyi yang berdiri sendiri
_missing_kana = []


def to_katakana(text):
    return "".join(chr(ord(c) + 0x60) if "\u3041" <= c <= "\u3096" else c for c in text)


def to_hiragana(text):
    return "".join(chr(ord(c) - 0x60) if "\u30a1" <= c <= "\u30f6" else c for c in text)


def kana_phrase(char):
    """Huruf -> teks bacaan "huruf、kata contoh", atau None kalau belum ada kata contohnya.

    Hurufnya ditulis katakana supaya は/へ/を tidak salah dibaca sebagai partikel (wa/e/o).
    """
    if char in NO_SOUND:
        return None
    if char in KATAKANA_WORDS:
        word = KATAKANA_WORDS[char]
    elif char in HIRAGANA_WORDS:
        word = HIRAGANA_WORDS[char]
    elif to_katakana(char) != char:
        return None
    else:  # katakana tanpa kata khusus -> pakai kata hiragana versi katakana
        hira = to_hiragana(char)
        if hira not in HIRAGANA_WORDS:
            return None
        word = to_katakana(HIRAGANA_WORDS[hira])
    return f"{to_katakana(char)}、{word}"


# ============================================================
# KONFIGURASI SUARA (voices.json)
# ============================================================
def load_voices_config():
    global role_pools, name_bank
    try:
        with open(VOICES_JSON, "r", encoding="utf-8") as f:
            config = json.load(f)
    except Exception as exc:
        raise SystemExit(f"Gagal membaca voices.json: {exc}")
    role_pools = config.get("roles", {})
    name_bank = config.get("name_bank", {})


def get_role(name, declared_value):
    v = str(declared_value or "").strip().lower()
    if v in role_pools:
        return v
    if v.startswith("jm_") or v in ("male", "pria", "cowok"):
        return "adult_male"
    if v.startswith("jf_") or v in ("female", "wanita", "cewek"):
        return "adult_female"
    if name in name_bank:
        return name_bank[name]
    return "adult_male"


def assign_story_voices(story):
    """Pilih suara untuk tiap tokoh dalam satu cerita (konsisten antar cerita)."""
    declared = story.get("speakers", {}) or {}

    order = []
    for sentence in story.get("sentences", []):
        if isinstance(sentence, dict):
            name = sentence.get("speaker", "Narator")
            if name not in order:
                order.append(name)

    result = {}
    for name in order:
        if str(name).strip().lower() in NARRATOR_NAMES:
            result[name] = {"char": DEFAULT_CHARACTER, "role": "default"}
            continue
        if declared.get(name) in characters:
            result[name] = {"char": declared[name], "role": "default"}
            continue
        if name in global_speaker_map:
            result[name] = global_speaker_map[name]
            continue

        role = get_role(name, declared.get(name))
        pool = [c for c in role_pools.get(role, [])
                if c in characters and c != DEFAULT_CHARACTER]

        if not pool:
            result[name] = {"char": DEFAULT_CHARACTER, "role": role}
        else:
            used = {v["char"] for v in global_speaker_map.values()}
            available = [c for c in pool if c not in used]
            result[name] = {"char": random.choice(available or pool), "role": role}

        global_speaker_map[name] = result[name]

    return result


# ============================================================
# PEMROSES PER JENIS DATA
# ============================================================
def process_stories(data):
    for story in data:
        if not isinstance(story, dict) or "id" not in story:
            continue
        speed = story.get("speed", STORY_SPEED)
        voices = assign_story_voices(story)

        for index, sentence in enumerate(story.get("sentences", [])):
            if not isinstance(sentence, dict):
                continue
            text = sentence.get("jp")
            if not text:
                continue
            speaker = sentence.get("speaker", "Narator")
            voice = voices.get(speaker, {"char": DEFAULT_CHARACTER, "role": "default"})

            filename = f"{safe_name(story['id'])}-{index + 1}.mp3"
            save(os.path.join(OUTPUT_AUDIO_DIR, filename), text, speed,
                 voice["char"], voice["role"])


def process_vocab(data):
    for chapter in data:
        if not isinstance(chapter, dict):
            continue

        is_kana = chapter.get("level", "") == "Kana"
        if ONLY_KANA and not is_kana:
            continue

        for vocab in chapter.get("vocab", []):
            if not isinstance(vocab, dict):
                continue

            if is_kana:
                # page.tsx memanggil /audio/kana/<huruf>.mp3, jadi nama file = hurufnya.
                char = vocab.get("kanji") or vocab.get("kana")
                if not char:
                    continue
                phrase = kana_phrase(char)
                if phrase is None:
                    if char not in NO_SOUND:
                        _missing_kana.append(char)
                    continue
                save(os.path.join(OUTPUT_AUDIO_DIR, "kana", safe_name(char) + ".mp3"),
                     phrase, KANA_SPEED, KANA_CHARACTER)
            else:
                text = vocab.get("kana")
                if text:
                    save(os.path.join(OUTPUT_AUDIO_DIR, "vocab", safe_name(text) + ".mp3"),
                         text, VOCAB_SPEED, DEFAULT_CHARACTER)


def pick_voice(role):
    pool = [c for c in role_pools.get(role, []) if c in characters]
    return random.choice(pool) if pool else DEFAULT_CHARACTER


def process_jlpt(data):
    for level_data in data:
        if not isinstance(level_data, dict) or "level" not in level_data:
            continue
        level = level_data["level"].lower()

        for test_set in level_data.get("sets", []):
            questions = test_set.get("sections", {}).get("listening", [])

            for q in questions:
                if "dialogue" not in q:
                    continue
                audio_url = q.get("audioUrl")
                if not audio_url:
                    continue

                out_path = os.path.join(OUTPUT_AUDIO_DIR, "jlpt", level, os.path.basename(audio_url))
                if os.path.exists(out_path) and not FORCE:
                    counter["lewat"] += 1
                    continue

                char_male = pick_voice("adult_male")
                char_female = pick_voice("adult_female")
                combined = AudioSegment.empty()

                for line in q["dialogue"]:
                    text = clean_html(line.get("jp"))
                    if not text:
                        continue

                    if str(line.get("speaker", "")).lower() in MALE_LABELS:
                        char, role = char_male, "adult_male"
                    else:
                        char, role = char_female, "adult_female"

                    try:
                        combined += synth_segment(text, STORY_SPEED, char, role)
                        combined += AudioSegment.silent(duration=DIALOGUE_GAP_MS)
                    except Exception as exc:
                        counter["error"] += 1
                        print(f"ERROR synthesis dialogue: {exc}")

                if len(combined) > 0:
                    os.makedirs(os.path.dirname(out_path), exist_ok=True)
                    combined.export(out_path, format="mp3", bitrate="192k")
                    counter["jadi"] += 1
                    log_relative("Jadi (Percakapan JLPT)", out_path)


# ============================================================
# MAIN
# ============================================================
SKIP_DIRS = {"node_modules", ".next", ".git", "public", "venv", ".venv"}


def collect_json_files(root):
    found = []
    for folder, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for filename in files:
            if filename.lower().endswith(".json") and filename != "voices.json":
                found.append(os.path.join(folder, filename))
    return found


def detect_kind(data):
    """Tentukan jenis file JSON dari isi elemen pertamanya."""
    if not isinstance(data, list) or not data or not isinstance(data[0], dict):
        return None
    first = data[0]
    if "sentences" in first:
        return "cerita"
    if "vocab" in first:
        return "kosakata"
    if "level" in first:
        return "jlpt"
    return None


PROCESSORS = {
    "cerita": ("Cerita", process_stories),
    "kosakata": ("Kosakata", process_vocab),
    "jlpt": ("JLPT Tryout", process_jlpt),
}


def main():
    load_voices_config()

    try:
        version = http("GET", "/version").decode("utf-8")
        load_speakers()
    except Exception:
        raise SystemExit(f"Tidak bisa konek ke VOICEVOX di {ENGINE}. Pastikan aplikasinya sudah jalan.")

    print("VOICEVOX engine:", version)
    print("Output:", OUTPUT_AUDIO_DIR)

    for json_path in collect_json_files(ROOT):
        try:
            with open(json_path, "r", encoding="utf-8-sig") as f:
                data = json.load(f)
        except Exception:
            continue

        kind = detect_kind(data)
        if not kind or (ONLY_KANA and kind != "kosakata"):
            continue

        label, processor = PROCESSORS[kind]
        print(f"\nMemproses {label}: {os.path.basename(json_path)}")
        processor(data)

    if _missing_kana:
        print("\nHuruf kana tanpa kata contoh (dilewati, tambahkan di HIRAGANA_WORDS/KATAKANA_WORDS):",
              " ".join(_missing_kana))
    print(f"\nSelesai. Baru dibuat: {counter['jadi']} | "
          f"Dilewati: {counter['lewat']} | Error: {counter['error']}")


if __name__ == "__main__":
    main()