"""Dengerin dulu hasil audio kana (huruf + kata contoh) sebelum generate semuanya.

Pemakaian (VOICEVOX harus nyala, taruh file ini satu folder dengan buat_audio_voicevox.py):
    python tes_kana.py                -> tes huruf-huruf yang biasanya paling rawan
    python tes_kana.py あ ほ きゃ      -> tes huruf pilihan sendiri
    python tes_kana.py --voices       -> huruf rawan, dibaca juga oleh karakter lain
Hasil: folder tes-kana di dalam ROOT (D:\\fude\\tes-kana)
"""
import os
import sys

import buat_audio_voicevox as b

ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
TRY_VOICES = "--voices" in sys.argv
DEFAULT_TEST = ["あ", "い", "え", "は", "へ", "を", "ん", "ふ", "きゃ", "ア", "ヲ", "ン"]
OTHER_VOICES = ["四国めたん", "春日部つむぎ", "冥鳴ひまり", "ずんだもん"]
OUT = os.path.join(b.ROOT, "tes-kana")


def make(char, voice, suffix=""):
    phrase = b.kana_phrase(char)
    if phrase is None:
        print(f"LEWATI {char}: belum ada kata contoh")
        return
    path = os.path.join(OUT, f"{b.safe_name(char)}{suffix}.mp3")
    try:
        audio = b.synth_segment(phrase, b.KANA_SPEED, voice)
        os.makedirs(OUT, exist_ok=True)
        audio.export(path, format="mp3", bitrate="192k")
        print(f"OK  {os.path.basename(path):24} dibaca: {phrase}")
    except Exception as exc:
        print(f"GAGAL {char}: {exc}")


def main():
    b.load_speakers()
    chars = ARGS or DEFAULT_TEST
    print("Karakter tersedia:", ", ".join(b.characters), "\n")
    for ch in chars:
        make(ch, b.KANA_CHARACTER)
        if TRY_VOICES:
            for v in OTHER_VOICES:
                if v in b.characters:
                    make(ch, v, f"__{v}")
    print("\nSelesai. Buka folder:", OUT)
    print("Kalau sudah puas: python buat_audio_voicevox.py --only-kana --force")


if __name__ == "__main__":
    main()