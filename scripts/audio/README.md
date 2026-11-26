# Fude audio tools

These scripts prepare an inventory of the audio used by Fude and generate MP3 files through the local MioTTS REST API.

## 1. Build the manifest

Run from the Fude repository root:

```powershell
py -3.12 scripts/audio/build_manifest.py --summary-only
py -3.12 scripts/audio/build_manifest.py
```

The full manifest is written to `audio-manifest.json` in the repository root. It is generated locally and is not meant to be committed.

The manifest includes:
- Japanese text from currently wired Fude content.
- Relative output paths under `public/`, matching the URLs used by the app.
- Speaker and voice-role metadata for narration and dialogue.

## 2. Configure MioTTS presets

Edit `scripts/audio/voice-presets.json` to map Fude roles to preset IDs returned by MioTTS at `GET /v1/presets`.

The current MioTTS built-in Japanese presets are `jp_female` and `jp_male`. For now, all female age roles point to `jp_female`, and all male age roles point to `jp_male`. This keeps the Fude role labels ready, but **does not create distinct child, teen, adult, and elderly voices yet**. To make age distinctions real, register separate reference-audio presets and map each role to its own preset ID.

The default Fude role remains `teen_female`, currently mapped to `jp_female`.

## 3. Preview a batch

The generator is a dry-run by default. It does not contact MioTTS or write audio unless `--execute` is provided.

From PowerShell:

```powershell
.\scripts\audio\generate-audio.bat --category vocab --limit 3 --force --show-items
```

Review the three output paths. To actually generate and replace those sample files:

```powershell
.\scripts\audio\generate-audio.bat --execute --category vocab --limit 3 --force --show-items
```

The launcher uses the Python 3.12 path previously configured on the Fude workstation. If that path is unavailable, it falls back to `py -3.12`.

The API default is `http://127.0.0.1:8001`. Start the MioTTS API server first. The generator checks `GET /health` and `GET /v1/presets` before synthesis.

## 4. Batch options

Examples:

```powershell
# Preview the entire manifest; no audio or API calls
.\scripts\audio\generate-audio.bat

# Generate only missing audio in one category
.\scripts\audio\generate-audio.bat --execute --category stories

# Generate multiple categories
.\scripts\audio\generate-audio.bat --execute --category vocab --category kana

# Explicitly regenerate/overwrite matching legacy audio
.\scripts\audio\generate-audio.bat --execute --force

# Stop safely with Ctrl+C; rerun the same command to resume
```

Available manifest categories: `vocab`, `kana`, `stories`, `jlpt-listening`, `irodori`, `practical-phrases`, and `practical-dialogue`.

## 5. Skip, update, retry, and resume behavior

- Existing MP3 files without a generator state record are treated as legacy files and are skipped by default. Use `--force` when you intentionally want to replace them.
- After an item is generated, its text, voice preset, generation settings, and output path are fingerprinted in `audio-generation-state.json`.
- If a Fude text or voice mapping changes later, the fingerprint changes and that generated item is queued again.
- Failed items are not marked complete; running the same command again retries them.
- Progress is saved after every successful output. Pressing Ctrl+C stops the batch safely; run the command again to continue with the remaining items.
- Dialogues are synthesized one line at a time using each line's mapped speaker preset, then combined into one MP3 with the configured pauses.
- A summary and any failures are written to `audio-generation-report.json`.

The generator requires FFmpeg with MP3 encoding support. It does not delete audio files.

## 6. Important voice and license notes

The age labels in the manifest are role metadata, not proof that a preset sounds like a person of that age. Distinct age voices require appropriately licensed, separately registered reference voices.

The upstream MioTTS README says its bundled default reference presets were generated using third-party TTS services and **must not be used commercially**. Before distributing audio publicly or using it in a commercial Fude service, review the applicable MioTTS preset and model licenses and use reference audio/presets whose rights permit the intended use.

## Safety

Keep current audio files until replacement files have been generated, listened to, checked, and uploaded successfully. Neither script deletes files.
