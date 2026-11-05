const fs = require('fs');
const path = require('path');
const { KokoroJP } = require('kokoro-js-jp'); // <-- pakai library Jepang

async function generate() {
  console.log("Memuat model Kokoro Japanese...");
  // Inisialisasi model Jepang
  const tts = await KokoroJP.load(); 

  const storyPath = path.join(__dirname, 'data', 'stories', 'n5-01.json');
  const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

  const audioDir = path.join(__dirname, 'public', 'audio');
  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

  for (let i = 0; i < story.sentences.length; i++) {
    const text = story.sentences[i].jp;
    const fileName = `n5-01-${i + 1}.wav`;
    const filePath = path.join(audioDir, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`⏩ Skip ${fileName}, sudah ada.`);
      continue;
    }

    console.log(`🎙️ Membuat suara untuk: "${text}"...`);
    // Gunakan method .speak() dan voice "jf_alpha"
    const audio = await tts.speak(text, "jf_alpha"); 

    // Simpan audio
    const buffer = Buffer.from(await audio.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Tersimpan: ${fileName}`);
  }
  
  console.log("🎉 Semua audio berhasil dibuat!");
}

generate().catch(console.error);