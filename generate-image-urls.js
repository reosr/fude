const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'all-bab.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function getImageUrl(query) {
  const cleanQuery = encodeURIComponent(query.split(' ')[0]); // Ambil 1 kata aja biar akurat
  // Pakai LoremFlickr (Foto asli, bukan AI)
  return `https://loremflickr.com/400/300/${cleanQuery}`;
}

data.forEach(bab => {
  if (!bab.vocab) return;
  bab.vocab.forEach(v => {
    const query = v.imageQuery || v.meaning || 'object';
    v.imageUrl = getImageUrl(query);
  });
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('✅ Gambar diganti ke LoremFlickr (Foto Asli)!');