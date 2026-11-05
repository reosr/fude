import os, sys, json, re
import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = r"D:\fude"
PUBLIC = os.path.join(ROOT, "public")
VOICE = "jf_alpha"
VOCAB_SPEED = 1.0
STORY_SPEED = 1.0
FORCE = "--force" in sys.argv

counter = {"jadi": 0, "lewat": 0}
seen = set()


def safe_name(text):
    return re.sub(r'[\\/:*?"<>|]', "_", text)


def synth(pipeline, text, speed):
    chunks = []
    for _, _, audio in pipeline(text, voice=VOICE, speed=speed):
        chunks.append(audio.cpu().numpy() if hasattr(audio, "cpu") else np.asarray(audio))
    return np.concatenate(chunks) if chunks else None


def save(pipeline, path, text, speed):
    if path in seen:
        return
    seen.add(path)
    if os.path.exists(path) and not FORCE:
        counter["lewat"] += 1
        return
    wav = synth(pipeline, text, speed)
    if wav is None:
        print("Kosong, dilewati:", text)
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sf.write(path, wav, 24000)
    counter["jadi"] += 1
    print("Jadi:", os.path.relpath(path, PUBLIC), "|", text)


json_files = []
for folder, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".next", ".git", "public")]
    for f in files:
        if f.endswith(".json"):
            json_files.append(os.path.join(folder, f))

pipeline = KPipeline(lang_code="j")

for jp in json_files:
    try:
        data = json.load(open(jp, encoding="utf-8"))
    except Exception:
        continue
    if not isinstance(data, dict):
        continue

    if isinstance(data.get("vocab"), list):
        print("Kosakata:", os.path.basename(jp))
        for v in data["vocab"]:
            text = v.get("kana")
            if not text:
                continue
            name = safe_name(text)
            if name != text:
                print("Nama file bermasalah, dilewati:", text)
                continue
            save(pipeline, os.path.join(PUBLIC, "audio", "vocab", name + ".wav"), text, VOCAB_SPEED)

    if isinstance(data.get("sentences"), list):
        print("Cerita:", os.path.basename(jp))
        speed = data.get("speed", STORY_SPEED)
        for s in data["sentences"]:
            url = s.get("audioUrl")
            text = s.get("jp")
            if not url or not text:
                continue
            path = os.path.join(PUBLIC, url.lstrip("/").replace("/", os.sep))
            save(pipeline, path, text, speed)

print("Selesai. Baru dibuat:", counter["jadi"], "| Sudah ada (dilewati):", counter["lewat"])