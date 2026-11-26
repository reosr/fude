import io
import json
import html
import os
import random
import re
import sys
import time
import urllib.error
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
#   python buat_audio_voicevox.py --only-default -> hanya audio yang memakai suara default
#   python buat_audio_voicevox.py --only-default --force -> timpa audio default saja
# ============================================================

# ---------- PATH & ARGUMEN ----------
ROOT = r"D:\fude"
PUBLIC = os.path.join(ROOT, "public")
AUDIO_DIR = os.path.join(PUBLIC, "audio")
VOICES_JSON = os.path.join(ROOT, "data", "voices.json")

PREVIEW = "--preview" in sys.argv
FORCE = "--force" in sys.argv
ONLY_KANA = "--only-kana" in sys.argv
ONLY_DEFAULT = "--only-default" in sys.argv
OUTPUT_AUDIO_DIR = os.path.join(PUBLIC, "audio-preview") if PREVIEW else AUDIO_DIR

# ---------- VOICEVOX ----------
ENGINE = os.environ.get("VOICEVOX_URL", "http://127.0.0.1:50021")
DEFAULT_CHARACTER = "東北ずん子"  # VOICEVOX style: ノーマル
STYLE_PREFERENCE = ["ノーマル", "ふつう", "あまあま"]

# ---------- PARAMETER SUARA ----------
# Kecepatan, pitch, intonasi, dan jeda mengikuti nilai bawaan /audio_query VOICEVOX.
# Argumen speed di pemroses lama tetap dipertahankan untuk kompatibilitas, tetapi tidak diterapkan.
VOCAB_SPEED = 1.0
STORY_SPEED = 1.0
VOLUME_SCALE = 1.25     # sedikit lebih keras dari default tanpa mengubah karakter suara
HTTP_RETRIES = 3        # ulangi request sementara yang gagal (maks. 4 percobaan)
HTTP_RETRY_DELAY = 0.8  # jeda awal retry, lalu bertambah bertahap
DIALOGUE_GAP_MS = 500   # jeda antar kalimat di percakapan JLPT

# ---------- KHUSUS KANA ----------
# Satu huruf sendirian sering dibaca VOICEVOX dengan tidak jelas. Jadi tiap huruf dibaca
# bareng kata contoh utuh, mis. "ア、あめ", dengan jalur yang sama persis seperti kosakata.
KANA_CHARACTER = DEFAULT_CHARACTER   # ganti kalau mau suara lain khusus kana
KANA_SPEED = VOCAB_SPEED

NARRATOR_NAMES = {"narator", "narrator", "narasi", ""}
MALE_LABELS = {"pria", "male", "otoko"}

# ---------- STATE ----------
counter = {"jadi": 0, "lewat": 0, "error": 0}
seen_paths = set()
characters = {}           # nama karakter -> [(nama_style, id), ...]
global_speaker_map = {}   # nama tokoh cerita -> suara yang sudah dipilih
irodori_voice_map = {}    # ID speaker Irodori -> suara yang konsisten
practical_speaker_voices = {}  # nama speaker Ungkapan Praktis -> (karakter, role)

IRODORI_SPEAKER_ROLES = {
    "yui": "teen_female",
    "sota": "teen_male",
    "akiko": "adult_female",
    "kenji": "adult_male",
}

PRACTICAL_SPEAKER_ROLE_ORDER = [
    "teen_female", "teen_male", "adult_female", "adult_male"
]
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

    retryable_http_codes = {408, 425, 429, 500, 502, 503, 504}
    for attempt in range(HTTP_RETRIES + 1):
        try:
            # Buat ulang Request pada setiap percobaan agar POST aman diulang.
            req = urllib.request.Request(
                url,
                data=data,
                method=method,
                headers={"Content-Type": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                return resp.read()
        except urllib.error.HTTPError as exc:
            if exc.code not in retryable_http_codes or attempt >= HTTP_RETRIES:
                raise
            error_message = f"HTTP {exc.code}"
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            if attempt >= HTTP_RETRIES:
                raise
            error_message = str(exc)

        delay = min(HTTP_RETRY_DELAY * (2 ** attempt), 6.0)
        print(
            f"VOICEVOX request gagal ({error_message}); "
            f"coba ulang {attempt + 1}/{HTTP_RETRIES} dalam {delay:.1f} detik..."
        )
        time.sleep(delay)

    raise RuntimeError("VOICEVOX request gagal setelah seluruh percobaan.")


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


def synth(text, sid):
    """Teks -> bytes WAV dengan parameter bawaan VOICEVOX, kecuali volume."""
    if len(text) <= 2:
        text += "、"  # teks sangat pendek sering terpotong

    query = json.loads(http("POST", "/audio_query", params={"text": text, "speaker": sid}))
    # Biarkan speedScale, pitchScale, intonationScale, dan panjang jeda
    # tetap pada nilai yang diberikan VOICEVOX melalui /audio_query.
    query["volumeScale"] = VOLUME_SCALE

    return http("POST", "/synthesis", params={"speaker": sid}, body=query)


def synth_segment(text, speed, character, role="default"):
    # speed dan role dipertahankan agar pemanggil lama tidak perlu diubah.
    # Parameter artikulasi audio sendiri mengikuti default VOICEVOX.
    wav_bytes = synth(text, character_id(character))
    return AudioSegment.from_file(io.BytesIO(wav_bytes), format="wav")


def save(path_mp3, text, speed, character, role="default"):
    """Buat satu file MP3, kecuali sudah ada (kecuali --force)."""
    # Mode --only-default hanya memproses audio yang memakai karakter default.
    # Filter dilakukan sebelum pengecekan file agar --force tidak menyentuh audio lain.
    if ONLY_DEFAULT and character != DEFAULT_CHARACTER:
        return

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
    # Audio listening JLPT dirangkai dari voice pool pria/wanita, bukan suara default.
    if ONLY_DEFAULT:
        print("Lewati audio listening JLPT (menggunakan voice pool khusus).")
        return

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
# IRODORI (TSX): audio per baris dialog dengan suara tokoh konsisten
# ============================================================
def process_irodori_pages():
    root = os.path.join(ROOT, "app", "irodori")
    if not os.path.isdir(root):
        return

    pattern = re.compile(
        r"""\{\s*speakerId:\s*["']([^"']+)["']([\s\S]*?)audioFileName:\s*["']([^"']+)["'][\s\S]*?\}""",
        re.MULTILINE,
    )

    for folder, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        if "page.tsx" not in files:
            continue

        page_path = os.path.join(folder, "page.tsx")
        try:
            with open(page_path, "r", encoding="utf-8") as f:
                source = f.read()
        except Exception as exc:
            print(f"ERROR membaca halaman Irodori {page_path}: {exc}")
            continue

        for match in pattern.finditer(source):
            speaker_id = match.group(1).strip()
            body = match.group(2)
            filename = safe_name(match.group(3).strip())

            japanese_match = re.search(
                r"\bjapanese:\s*([\s\S]*?),\s*romaji:",
                body,
                re.MULTILINE,
            )
            if not japanese_match or not filename:
                continue

            japanese = clean_html(japanese_match.group(1).replace("<>", ""))
            if not japanese:
                continue

            role = IRODORI_SPEAKER_ROLES.get(speaker_id, "adult_male")
            character = irodori_voice_map.get(speaker_id)
            if not character:
                character = pick_voice(role)
                irodori_voice_map[speaker_id] = character

            save(
                os.path.join(OUTPUT_AUDIO_DIR, "irodori", filename),
                japanese,
                STORY_SPEED,
                character,
                role,
            )


# ============================================================
# UNGKAPAN PRAKTIS: frasa dan tiap baris percakapan
# ============================================================
def decode_js_string(literal):
    try:
        return json.loads(literal)
    except Exception:
        if len(literal) >= 2 and literal[0] in ('"', "'"):
            return literal[1:-1].replace(r"\"", '"').replace(r"\'", "'")
        return literal


def get_practical_speaker_voice(speaker, position):
    speaker = clean_html(speaker).strip()
    if not speaker:
        speaker = "Narator"

    if speaker.lower() in NARRATOR_NAMES:
        return DEFAULT_CHARACTER, "default"

    if speaker not in practical_speaker_voices:
        role = name_bank.get(speaker)
        if not role:
            if any(token in speaker for token in ("店員", "スタッフ", "受付", "先生")):
                role = "adult_female"
            elif any(token in speaker for token in ("店長", "男性", "男")):
                role = "adult_male"
            elif any(token in speaker for token in ("女性", "女")):
                role = "adult_female"
            else:
                role = PRACTICAL_SPEAKER_ROLE_ORDER[position % len(PRACTICAL_SPEAKER_ROLE_ORDER)]

        practical_speaker_voices[speaker] = (pick_voice(role), role)

    return practical_speaker_voices[speaker]


def process_practical_pages():
    root = os.path.join(ROOT, "app", "ungkapan-praktis")
    if not os.path.isdir(root):
        return

    phrase_string = re.compile(
        r"""jp:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')""",
        re.MULTILINE,
    )
    dialogue_line = re.compile(
        r"""\{\s*speaker:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')\s*,\s*jp:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')""",
        re.MULTILINE,
    )

    for folder, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        if "page.tsx" not in files or folder == root:
            continue

        category_id = os.path.basename(folder)
        page_path = os.path.join(folder, "page.tsx")
        try:
            with open(page_path, "r", encoding="utf-8") as f:
                source = f.read()
        except Exception as exc:
            print(f"ERROR membaca halaman Ungkapan Praktis {page_path}: {exc}")
            continue

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
                    phrase_string.finditer(group_match.group(1)),
                    start=1,
                ):
                    japanese = clean_html(decode_js_string(item_match.group(1)))
                    if not japanese:
                        continue

                    filename = (
                        f"{category_id}-phrase-{group_index:02d}-{item_index:02d}.mp3"
                    )
                    save(
                        os.path.join(OUTPUT_AUDIO_DIR, "praktis", filename),
                        japanese,
                        VOCAB_SPEED,
                        DEFAULT_CHARACTER,
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
            speaker_positions = {}
            for line_match in lines:
                speaker = clean_html(decode_js_string(line_match.group(1))).strip()
                if speaker not in speaker_positions:
                    speaker_positions[speaker] = len(speaker_positions)

            for line_index, line_match in enumerate(lines, start=1):
                speaker = clean_html(decode_js_string(line_match.group(1))).strip()
                japanese = clean_html(decode_js_string(line_match.group(2)))
                if not japanese:
                    continue

                character, role = get_practical_speaker_voice(
                    speaker,
                    speaker_positions.get(speaker, 0),
                )
                filename = (
                    f"{category_id}-dialogue-{dialogue_index:02d}-{line_index:02d}.mp3"
                )
                save(
                    os.path.join(OUTPUT_AUDIO_DIR, "praktis", filename),
                    japanese,
                    STORY_SPEED,
                    character,
                    role,
                )


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
    if ONLY_DEFAULT:
        print("Mode: hanya audio dengan suara default", DEFAULT_CHARACTER)

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

    if not ONLY_KANA:
        print("\nMemproses audio dialog Irodori...")
        process_irodori_pages()
        print("\nMemproses audio Ungkapan Praktis...")
        process_practical_pages()

    if _missing_kana:
        print("\nHuruf kana tanpa kata contoh (dilewati, tambahkan di HIRAGANA_WORDS/KATAKANA_WORDS):",
              " ".join(_missing_kana))
    print(f"\nSelesai. Baru dibuat: {counter['jadi']} | "
          f"Dilewati: {counter['lewat']} | Error: {counter['error']}")


if __name__ == "__main__":
    main()