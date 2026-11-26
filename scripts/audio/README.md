# Fude audio manifest preparation

This tool creates an inventory of audio items that are already referenced by Fude.
It is a **preparation step only**: it reads project data and writes a JSON manifest.
It does not connect to a TTS backend, generate audio, replace MP3 files, or delete files.

## Run from the Fude repository root

Preview counts only:

```powershell
py -3.12 scripts/audio/build_manifest.py --summary-only
```

Write the manifest:

```powershell
py -3.12 scripts/audio/build_manifest.py
```

The output is `audio-manifest.json` in the repository root. It is generated locally and does not need to be committed.

To write it elsewhere:

```powershell
py -3.12 scripts/audio/build_manifest.py --output D:\\MioTTS\\audio-manifest.json
```

## Manifest fields

Each item includes:

- `category`: vocab, kana, stories, JLPT listening, Irodori, or practical phrases/dialogue.
- `source`: the Fude source file.
- `output`: path relative to `public/`, preserving the current webapp audio URL structure.
- `text` or `segments`: Japanese text to be spoken.
- `speaker`, `voice_role`, and `voice_role_source`: suggested speaker metadata to review before synthesis.

The project default role is `teen_female`. Voice roles are metadata only; they do not create or imply a voice preset. Some dialogue labels use a deterministic fallback based on speaker order and should be reviewed before any large production batch.

## Safety

This script never modifies `public/audio`. Keep current audio files until replacement files have been generated, checked, and uploaded successfully.
