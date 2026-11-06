import os
import sys
import json
import re
import html
import zlib
import urllib.parse
import urllib.request
import io
import random
from pydub import AudioSegment

# ============================================================
# Generator audio pakai VOICEVOX (gratis, jalan lokal) -> Output MP3
# Pastikan aplikasi VOICEVOX SEDANG JALAN (http://127.0.0.1:50021).
# ============================================================

ROOT = r"D:\fude"
PUBLIC = os.path.join(ROOT, "public")
AUDIO_DIR = os.path.join(PUBLIC, "audio")
PREVIEW = "--preview" in sys.argv
OUTPUT_AUDIO_DIR = os.path.join(PUBLIC, "audio-preview") if PREVIEW else AUDIO_DIR

ENGINE = os.environ.get("VOICEVOX_URL", "http://127.0.0.1:50021")

# Suara default (kosakata & narator)
DEFAULT_CHARACTER = "雨晴はう"

# Path ke file konfigurasi suara
VOICES_JSON = os.path.join(ROOT, "data", "voices.json")

# Parameter suara
VOCAB_SPEED = 0.95
STORY_SPEED = 1.0
INTONATION = 1.0
PRE_SILENCE = 0.1
POST_SILENCE = 0.2

# Penyesuaian pitch & speed berdasarkan role (Tetap di kode karena ini logic)
ROLE_ADJUSTMENTS = {
    "child": {"pitch": 0.15, "speed": 1.1},
    "elderly_male": {"pitch": -0.05, "speed": 0.85},
    "elderly_female": {"pitch": -0.02, "speed": 0.85},
}

STYLE_PREFERENCE = ["ノーマル", "ふつう", "あまあま"]
NARRATOR_NAMES = {"narator", "narrator", "narasi", ""}

FORCE = "--force" in sys.argv
counter = {"jadi": 0, "lewat": 0, "error": 0}
seen = set()
_characters = {}
GLOBAL_SPEAKER_MAP = {}

# Variabel untuk nampung data dari voices.json
ROLE_POOLS = {}
NAME_BANK = {}

def load_voices_config():
    global ROLE_POOLS, NAME_BANK
    try:
        with open(VOICES_JSON, "r", encoding="utf-8") as f:
            config = json.load(f)
            ROLE_POOLS = config.get("roles", {})
            NAME_BANK = config.get("name_bank", {})
    except Exception as e:
        raise SystemExit(f"Gagal membaca voices.json: {e}\nPastikan file data/voices.json ada dan formatnya benar.")

def safe_name(text):
    return re.sub(r'[\\/:*?"<>|]', "_", text)

def clean_html(text):
    if not text: return ""
    text = html.unescape(str(text))
    text = re.sub(r"<rt\b[^>]*>.*?</rt>|<rp\b[^>]*>.*?</rp>", "", text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def http(method, path, params=None, body=None):
    url = ENGINE + path
    if params: url += "?" + urllib.parse.urlencode(params)
    data = json.dumps(body).encode("utf-8") if body is not None else (b"" if method == "POST" else None)
    req = urllib.request.Request(url, data=data, method=method, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read()

def load_speakers():
    for sp in json.loads(http("GET", "/speakers")):
        _characters[sp["name"]] = [(st["name"], st["id"]) for st in sp.get("styles", [])]

def character_id(character):
    styles = _characters.get(character)
    if not styles:
        return character_id(DEFAULT_CHARACTER)
    for pref in STYLE_PREFERENCE:
        for style_name, sid in styles:
            if style_name == pref: return sid
    return styles[0][1]

def get_role(name, declared_value):
    # 1. Cek apakah di JSON cerita udah ditulis role-nya (misal: "Agus": "teen_male")
    v = str(declared_value or "").strip().lower()
    if v in ROLE_POOLS: return v
    if v.startswith("jm_") or v in ("male", "pria", "cowok"): return "adult_male"
    if v.startswith("jf_") or v in ("female", "wanita", "cewek"): return "adult_female"
    
    # 2. Kalau nggak ada, cek ke Buku Nama (name_bank) di voices.json
    if name in NAME_BANK:
        return NAME_BANK[name]
        
    return "adult_male" # Default kalau ga dikenal

def assign_story_voices(story):
    global GLOBAL_SPEAKER_MAP
    
    declared = story.get("speakers", {}) or {}
    order = []
    for sentence in story.get("sentences", []):
        if isinstance(sentence, dict):
            name = sentence.get("speaker", "Narator")
            if name not in order: order.append(name)

    result = {}

    for name in order:
        if str(name).strip().lower() in NARRATOR_NAMES:
            result[name] = {"char": DEFAULT_CHARACTER, "role": "default"}
            continue
            
        if declared.get(name) in _characters:
            result[name] = {"char": declared[name], "role": "default"}
            continue

        if name in GLOBAL_SPEAKER_MAP:
            result[name] = GLOBAL_SPEAKER_MAP[name]
            continue

        role = get_role(name, declared.get(name))
        pool = [c for c in ROLE_POOLS.get(role, []) if c in _characters and c != DEFAULT_CHARACTER]

        if not pool:
            result[name] = {"char": DEFAULT_CHARACTER, "role": role}
        else:
            used_chars = {v["char"] for v in GLOBAL_SPEAKER_MAP.values()}
            available = [c for c in pool if c not in used_chars]

            if available:
                choice = random.choice(available)
            else:
                choice = random.choice(pool)

            result[name] = {"char": choice, "role": role}

        GLOBAL_SPEAKER_MAP[name] = result[name]

    return result

def synth(text, base_speed, sid, role):
    query = json.loads(http("POST", "/audio_query", params={"text": text, "speaker": sid}))
    adj = ROLE_ADJUSTMENTS.get(role, {})
    query["speedScale"] = float(base_speed * adj.get("speed", 1.0))
    query["pitchScale"] = float(adj.get("pitch", 0.0))
    query["intonationScale"] = INTONATION
    query["prePhonemeLength"] = PRE_SILENCE
    query["postPhonemeLength"] = POST_SILENCE
    return http("POST", "/synthesis", params={"speaker": sid}, body=query)

def save(path_mp3, text, speed, character, role="default"):
    if path_mp3 in seen: return
    seen.add(path_mp3)
    
    if os.path.exists(path_mp3) and not FORCE:
        counter["lewat"] += 1
        return

    clean_text = clean_html(text)
    if not clean_text: return

    try:
        wav_bytes = synth(clean_text, speed, character_id(character), role)
        audio = AudioSegment.from_file(io.BytesIO(wav_bytes), format="wav")
        audio = audio.apply_gain(+8.0) 
        
        os.makedirs(os.path.dirname(path_mp3), exist_ok=True)
        audio.export(path_mp3, format="mp3", bitrate="64k")
        
        counter["jadi"] += 1
        print(f"Jadi [{character} | {role}]:", os.path.relpath(path_mp3, PUBLIC), "|", clean_text)
    except Exception as exc:
        counter["error"] += 1
        print(f"ERROR [{character}] {path_mp3}: {exc}")

def collect_json_files(root):
    json_files = []
    for folder, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in ("node_modules", ".next", ".git", "public", "venv", ".venv")]
        for filename in files:
            if filename.lower().endswith(".json"): 
                # Skip file voices.json biar ga dibaca sebagai cerita
                if filename == "voices.json": continue
                json_files.append(os.path.join(folder, filename))
    return json_files

def main():
    load_voices_config()

    try:
        version = http("GET", "/version").decode("utf-8")
        load_speakers()
    except Exception as exc:
        raise SystemExit(f"Tidak bisa konek ke VOICEVOX di {ENGINE}. Pastikan aplikasinya nyala!")

    print("VOICEVOX engine:", version)
    print("Suara default:", DEFAULT_CHARACTER)
    print("Format output: MP3")

    for jp in collect_json_files(ROOT):
        try:
            with open(jp, "r", encoding="utf-8-sig") as file:
                data = json.load(file)
        except Exception: 
            continue

        if not isinstance(data, list) or not data or not isinstance(data[0], dict): 
            continue

        if "sentences" in data[0]:
            print(f"\nMemproses Cerita: {os.path.basename(jp)}")
            for story in data:
                if not isinstance(story, dict) or "id" not in story: continue
                speed = story.get("speed", STORY_SPEED)
                voices = assign_story_voices(story)
                print(f"  [{story['id']}] suara:", ", ".join(f"{n} -> {v['char']}" for n, v in voices.items()))

                for index, sentence in enumerate(story.get("sentences", [])):
                    if not isinstance(sentence, dict): continue
                    text = sentence.get("jp")
                    if not text: continue
                    speaker = sentence.get("speaker", "Narator")
                    v = voices.get(speaker, {"char": DEFAULT_CHARACTER, "role": "default"})
                    
                    filename = f"{story['id']}-{index + 1}.mp3"
                    save(os.path.join(OUTPUT_AUDIO_DIR, filename), text, speed, v["char"], v["role"])

        elif "vocab" in data[0]:
            print(f"\nMemproses Kosakata: {os.path.basename(jp)}")
            for chapter in data:
                if not isinstance(chapter, dict): continue
                for vocab in chapter.get("vocab", []):
                    if not isinstance(vocab, dict): continue
                    text = vocab.get("kana")
                    if not text: continue
                    
                    output_path = os.path.join(OUTPUT_AUDIO_DIR, "vocab", safe_name(text) + ".mp3")
                    save(output_path, text, VOCAB_SPEED, DEFAULT_CHARACTER)

        elif "level" in data[0]:
            print(f"\nMemproses JLPT Tryout: {os.path.basename(jp)}")
            for level_data in data:
                if not isinstance(level_data, dict) or "level" not in level_data: continue
                level = level_data["level"].lower()
                
                for test_set in level_data.get("sets", []):
                    for section_name, questions in test_set.get("sections", {}).items():
                        if section_name != "listening": continue
                        
                        for q_idx, q in enumerate(questions):
                            if "dialogue" not in q: continue
                            
                            combined_audio = AudioSegment.empty()
                            
                            # 1. TENTUKAN SUARA DI AWAL (Biar konsisten 1 soal)
                            pool_male = [c for c in ROLE_POOLS.get("adult_male", []) if c in _characters]
                            pool_female = [c for c in ROLE_POOLS.get("adult_female", []) if c in _characters]
                            
                            char_male = random.choice(pool_male) if pool_male else DEFAULT_CHARACTER
                            char_female = random.choice(pool_female) if pool_female else DEFAULT_CHARACTER
                            
                            for line in q["dialogue"]:
                                speaker = line.get("speaker", "")
                                text = line.get("jp")
                                if not text: continue
                                
                                # 2. PAKAI SUARA YANG UDAH DITENTUKAN
                                if speaker.lower() in ("pria", "male", "otoko"):
                                    char = char_male
                                    role = "adult_male"
                                else:
                                    char = char_female
                                    role = "adult_female"
                                
                                clean_text = clean_html(text)
                                if not clean_text: continue
                                
                                try:
                                    wav_bytes = synth(clean_text, STORY_SPEED, character_id(char), role)
                                    audio_segment = AudioSegment.from_file(io.BytesIO(wav_bytes), format="wav")
                                    
                                    combined_audio += audio_segment
                                    combined_audio += AudioSegment.silent(duration=500)
                                except Exception as exc:
                                    print(f"ERROR synthesis dialogue: {exc}")

                            if len(combined_audio) > 0:
                                audio_url = q.get("audioUrl")
                                if audio_url:
                                    filename = os.path.basename(audio_url)
                                    out_path = os.path.join(OUTPUT_AUDIO_DIR, "jlpt", level, filename)
                                    
                                    os.makedirs(os.path.dirname(out_path), exist_ok=True)
                                    combined_audio = combined_audio.apply_gain(+8.0) # Naikin volume biar jelas
                                    combined_audio.export(out_path, format="mp3", bitrate="192k")
                                    
                                    counter["jadi"] += 1
                                    print(f"Jadi (Percakapan JLPT):", os.path.relpath(out_path, PUBLIC))

    print(f"\nSelesai. Baru dibuat: {counter['jadi']} | Dilewati: {counter['lewat']} | Error: {counter['error']}")


if __name__ == "__main__":
    main()