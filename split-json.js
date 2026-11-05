const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'all-bab.json'), 'utf8'));

// Bagi jadi kelompok 10 bab
const chunkSize = 10;
for (let i = 0; i < data.length; i += chunkSize) {
  const chunk = data.slice(i, i + chunkSize);
  const fileName = `chunk-${i+1}-to-${i+chunkSize}.json`;
  fs.writeFileSync(path.join(__dirname, 'data', fileName), JSON.stringify(chunk, null, 2));
  console.log(`✅ Dibuat: ${fileName}`);
}