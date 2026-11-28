import json, urllib.request
from pathlib import Path

API = "http://127.0.0.1:8765"
OUT = Path("test-suara")
OUT.mkdir(exist_ok=True)

KALIMAT = [
    "こんにちは。今日はいい天気ですね！",
    "すみません、駅はどこですか。",
]

with urllib.request.urlopen(f"{API}/v1/voices") as r:
    voices = [v["id"] for v in json.load(r)["voices"]]

for voice in voices:
    for i, teks in enumerate(KALIMAT, 1):
        body = json.dumps({"voice": voice, "input": teks}, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(
            f"{API}/v1/audio/speech", data=body,
            headers={"Content-Type": "application/json; charset=utf-8"},
        )
        try:
            with urllib.request.urlopen(req, timeout=600) as r:
                (OUT / f"{voice}_{i}.wav").write_bytes(r.read())
            print("OK", voice, i)
        except Exception as e:
            print("GAGAL", voice, i, e)