const fs = require('fs');
const path = require('path');

// Path ke file JSON lo
const allBabPath = path.join(__dirname, 'data', 'all-bab.json');
const kosakataPath = path.join(__dirname, 'data', 'kosakata.json');

console.log("Membaca file all-bab.json...");
const allBabs = JSON.parse(fs.readFileSync(allBabPath, 'utf8'));

const kosakataData = [];

// Looping semua bab
for (let i = 0; i < allBabs.length; i++) {
    const bab = allBabs[i];
    
    // Ambil vocab-nya, masukin ke data kosakata baru
    kosakataData.push({
        bab: bab.bab,
        vocab: bab.vocab || []
    });
    
    // Kosongin vocab di all-bab.json
    bab.vocab = []; 
}

// Simpan ke kosakata.json
fs.writeFileSync(kosakataPath, JSON.stringify(kosakataData, null, 2), 'utf8');
console.log("Berhasil membuat data/kosakata.json!");

// Simpan kembali all-bab.json yang udah bersih
fs.writeFileSync(allBabPath, JSON.stringify(allBabs, null, 2), 'utf8');
console.log("Berhasil membersihkan data/all-bab.json!");
console.log("Selesai! Silakan cek folder data lo.");