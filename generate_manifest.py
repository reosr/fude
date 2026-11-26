"""
Generate semua audio dari audio-manifest.json pakai MioTTS.

Contoh:
  python generate_manifest.py --limit 10          # tes 10 item dulu
  python generate_manifest.py --category kana     # satu kategori
  python generate_manifest.py                      # semuanya

Hasil: <OUT>/<audio_root>/<output>, misal D:/MioTTS/output/public/audio/vocab/あつい.mp3
Item yang file hasilnya sudah ada dilewati, jadi aman dijalankan ulang.
"""
import argparse, base64, io, json, shutil, subprocess, sys, time, wave
import urllib.request
from pathlib import Path

# ---------------------------------------------------------------- SETTINGS
MANIFEST = Path("D:/MioTTS/audio-manifest.json")
OUT_DIR = Path("D:/MioTTS/output")
API = "http://localhost:8001/v1/tts"

# voice_role di manifest -> preset MioTTS.
# Preset bawaan cuma jp_female / jp_male. Kalau nanti lo bikin preset sendiri
# (scripts/generate_preset.py), ganti nilainya di sini, misal "teen_female".
PRESET_MAP = {
    "teen_female": "jp_female",
    "adult_female": "jp_female",
    "child_female": "jp_female",
    "teen_male": "jp_male",
    "adult_male": "jp_male",
    "elderly_male": "jp_male",
}
DEFAULT_PRESET = "jp_female"
DEFAULT_PAUSE_MS = 500
RETRIES = 2
# -------------------------------------------------------------------------


def tts(text, preset, dry_run=False):
    """Kirim satu teks ke API, balikin bytes WAV."""
    if dry_run:
        buf = io.BytesIO()
        with wave.open(buf, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(24000)
            w.writeframes(b"\x00\x00" * 7200)  # 0.3 detik hening
        return buf.getvalue()

    body = json.dumps({
        "text": text,
        "reference": {"type": "preset", "preset_id": preset},
        "output": {"format": "base64"},
    }).encode("utf-8")
    req = urllib.request.Request(API, data=body, headers={"Content-Type": "application/json"})
    last = None
    for attempt in range(RETRIES + 1):
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                return base64.b64decode(json.load(r)["audio"])
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(2)
    raise RuntimeError(f"API gagal: {last}")


def concat_wavs(parts, pauses_ms):
    """Gabung beberapa WAV dengan jeda hening di antaranya."""
    out = io.BytesIO()
    params = None
    with wave.open(out, "wb") as ow:
        for i, data in enumerate(parts):
            with wave.open(io.BytesIO(data)) as w:
                if params is None:
                    params = w.getparams()
                    ow.setparams(params)
                ow.writeframes(w.readframes(w.getnframes()))
            if i < len(parts) - 1:
                n = int(params.framerate * pauses_ms[i] / 1000)
                ow.writeframes(b"\x00" * (n * params.sampwidth * params.nchannels))
    return out.getvalue()


def synth_item(item, dry_run=False):
    """Balikin bytes WAV untuk satu item (teks tunggal atau dialog)."""
    if item.get("segments"):
        parts, pauses = [], []
        for seg in item["segments"]:
            preset = PRESET_MAP.get(seg.get("voice_role"), DEFAULT_PRESET)
            parts.append(tts(seg["text"], preset, dry_run))
            pauses.append(seg.get("pause_after_ms", DEFAULT_PAUSE_MS))
        return concat_wavs(parts, pauses)
    preset = PRESET_MAP.get(item.get("voice_role"), DEFAULT_PRESET)
    return tts(item["text"], preset, dry_run)


def save(wav_bytes, path, wav_only):
    path.parent.mkdir(parents=True, exist_ok=True)
    if wav_only:
        path.with_suffix(".wav").write_bytes(wav_bytes)
        return
    # WAV -> mp3 lewat ffmpeg (stdin -> file)
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "wav", "-i", "pipe:0",
         "-codec:a", "libmp3lame", "-q:a", "4", str(path)],
        input=wav_bytes, check=True,
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, help="proses N item pertama saja (buat tes)")
    ap.add_argument("--category", help="hanya kategori ini (irodori, kana, vocab, ...)")
    ap.add_argument("--wav-only", action="store_true", help="simpan .wav, tanpa ffmpeg")
    ap.add_argument("--dry-run", action="store_true", help="tanpa API, isi hening (tes parsing)")
    args = ap.parse_args()

    if not args.wav_only and not shutil.which("ffmpeg"):
        sys.exit("ffmpeg tidak ditemukan. Install ffmpeg, atau jalankan dengan --wav-only.")

    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    root = OUT_DIR / data.get("audio_root", "")
    items = data["items"]
    if args.category:
        items = [i for i in items if i["category"] == args.category]
    if args.limit:
        items = items[: args.limit]

    todo, skipped = [], 0
    for it in items:
        target = root / it["output"]
        done = target.with_suffix(".wav").exists() if args.wav_only else target.exists()
        if done:
            skipped += 1
        else:
            todo.append(it)
    print(f"Total {len(items)} | sudah ada {skipped} | akan digenerate {len(todo)}")

    failed, t0 = [], time.time()
    for n, it in enumerate(todo, 1):
        try:
            wav = synth_item(it, args.dry_run)
            save(wav, root / it["output"], args.wav_only)
        except Exception as e:  # noqa: BLE001
            failed.append((it["id"], str(e)))
            print(f"GAGAL {it['id']}: {e}")
        if n % 25 == 0 or n == len(todo):
            el = time.time() - t0
            eta = el / n * (len(todo) - n)
            print(f"[{n}/{len(todo)}] {el/60:.1f} menit berjalan, sisa ~{eta/60:.1f} menit")

    if failed:
        log = OUT_DIR / "failed.txt"
        log.write_text("\n".join(f"{i}\t{e}" for i, e in failed), encoding="utf-8")
        print(f"{len(failed)} item gagal, daftar di {log}. Jalankan ulang script untuk mencoba lagi.")
    else:
        print("Selesai tanpa gagal.")


if __name__ == "__main__":
    main()
