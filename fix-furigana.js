const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'all-bab.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Fungsi untuk memisahkan Hiragana dari Kanji di dalam tag <ruby>
function fixRubyTags(text) {
  if (!text) return text;
  
  return text.replace(/<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>/g, (match, base, reading) => {
    // Cari huruf yang sama di akhir kata (Okurigana)
    let i = base.length - 1;
    let j = reading.length - 1;
    let suffix = '';

    while (i >= 0 && j >= 0 && base[i] === reading[j]) {
      suffix = base[i] + suffix;
      i--;
      j--;
    }

    const pureKanji = base.substring(0, i + 1);
    const pureReading = reading.substring(0, j + 1);

    // Kalau ada Kanji dan bacanya, bungkus cuma bagian Kanjinya aja
    if (pureKanji && pureReading) {
      return `<ruby>${pureKanji}<rt>${pureReading}</rt></ruby>${suffix}`;
    }
    return match; // Kalau gagal, biarin aja
  });
}

// Proses semua data
data.forEach(bab => {
  // Benerin di grammar
  if (bab.grammar) {
    bab.grammar.forEach(g => {
      g.pattern = fixRubyTags(g.pattern);
      g.formula = fixRubyTags(g.formula);
      g.example_kanji = fixRubyTags(g.example_kanji);
    });
  }
  // Benerin di tips (kalau ada)
  bab.tips = fixRubyTags(bab.tips);
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('✅ Semua tag Furigana berhasil dirapikan otomatis!');