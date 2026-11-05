const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'all-bab.json'), 'utf8'));

data.forEach(bab => {
  if (!bab.grammar || bab.grammar.length === 0) return;

  let knownKanji = new Set(bab.vocab.map(v => v.kanji));
  
  bab.grammar.forEach(g => {
    if (!g.example_kanji) return;
    
    // Ambil teks murni tanpa tag HTML
    let cleanText = g.example_kanji.replace(/<[^>]+>/g, '');
    
    // Ambil semua gumpalan Kanji (termasuk yang ada Hiragana nempelnya, misal 食べる)
    // Regex ini nyari Kanji + Hiragana yang nempel
    let words = cleanText.match(/[\u4e00-\u9faf]+[ぁ-ゖ]*/g) || [];
    
    words.forEach(w => {
      // Bersihin tanda baca
      w = w.replace(/[。、！？]/g, '');
      if (w.length > 0 && !knownKanji.has(w)) {
        console.log(`Bab ${bab.bab} | Missing: ${w} (dari kalimat: ${cleanText})`);
      }
    });
  });
});