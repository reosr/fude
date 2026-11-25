# JLPT Practice Set Drafts

File JSON di folder ini adalah draft yang belum muncul di halaman JLPT. Jangan salin ke `data/jlpt.json` sebelum semua audio listening tersedia dan sudah diperiksa.

## N4 Practice Set 1 — audio listening

Set ini menyiapkan 28 audio dengan nama:

- `public/audio/jlpt/n4/set1-q01.mp3`
- sampai `public/audio/jlpt/n4/set1-q28.mp3`

Untuk membuatnya di komputer lokal:

1. Pull branch `main` terbaru ke folder project `D:\fude`.
2. Jalankan VOICEVOX Engine seperti biasa dan pastikan tersedia di `http://127.0.0.1:50021`.
3. Buka terminal di root project, lalu jalankan:

   ```bash
   python buat_audio_voicevox.py
   ```

Skrip akan memindai JSON di folder project, termasuk `data/jlpt-drafts/n4-set-1.json`, lalu membuat audio JLPT yang belum ada. Jangan tambahkan `--force`; opsi itu akan menimpa audio yang sudah tersedia.

Setelah proses selesai, periksa bahwa 28 file MP3 di atas sudah ada dan dapat diputar. Barulah draft bisa dipindahkan ke bagian N4 di `data/jlpt.json` agar set tampil di halaman JLPT.
