const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'all-bab.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Fungsi ambil gambar dari Openverse (tanpa API key)
async function fetchOpenverseImage(query) {
  try {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=1&license_type=all-cc`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FudeApp/1.0' } // Sopan santun ke API
    });
    const json = await res.json();
    if (json.results && json.results.length > 0) {
      return json.results[0].url;
    }
  } catch (e) {
    console.log("Openverse error:", e.message);
  }
  return null;
}

// Fallback kalau Openverse ga nemu
function getFallbackUrl(query) {
  const cleanQuery = query.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
  return `https://loremflickr.com/400/300/${cleanQuery || 'object'}`;
}

async function run() {
  console.log("Mulai update gambar (Openverse + Fallback)...");

  for (let bab of data) {
    if (!bab.vocab) continue;

    for (let v of bab.vocab) {
      // Bersihin query dari kata sampah
      let rawQuery = v.imageQuery || v.meaning || 'object';
      let cleanQuery = rawQuery
        .replace(/Japanese|vocabulary|illustration|for|self|introduction|daily|activities|objects|belongings|counting|counter|numbers/gi, '')
        .trim() || 'object';

      console.log(`Mencari: ${cleanQuery}...`);
      
      let imageUrl = await fetchOpenverseImage(cleanQuery);
      
      if (!imageUrl) {
        console.log(`  -> Openverse gagal, pakai fallback.`);
        imageUrl = getFallbackUrl(cleanQuery);
      }

      v.imageUrl = imageUrl;

      // Jeda 1.5 detik biar ga kena rate limit Openverse (1 request/detik)
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log("✅ Selesai! Semua gambar udah diupdate.");
}

run();