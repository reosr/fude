const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'all-bab.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Perbaiki format "bab": [1] menjadi "bab": 1
const fixedData = data.map(item => {
  return {
    ...item,
    bab: Array.isArray(item.bab) ? item.bab[0] : item.bab
  };
});

fs.writeFileSync(filePath, JSON.stringify(fixedData, null, 2));
console.log('✅ Berhasil memperbaiki format JSON! 50 Bab siap digunakan.');