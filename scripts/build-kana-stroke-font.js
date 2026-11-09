
(async () => {
  const fs = require("node:fs");
  const path = require("node:path");

  const font = (await import("tegaki/fonts/klee-one")).default;

  const sourceDir = path.join(
    "node_modules",
    "tegaki",
    "dist",
    "fonts",
    "klee-one"
  );

  const outputDir = path.join("public", "fonts");
  const dataPath = path.join("data", "kana-stroke-font.json");
  const fontPath = path.join(outputDir, "klee-one-kana.ttf");

  // Ambil glyph Hiragana, Katakana, dan karakter terkait.
  const kanaPattern =
    /^[\u3040-\u30FF\u31F0-\u31FF]+$/u;

  const glyphData = Object.fromEntries(
    Object.entries(font.glyphData).filter(
      ([char]) => kanaPattern.test(char)
    )
  );

  const required = [
    0x3042, // Hiragana
    0x3093, // Hiragana N
    0x30A2, // Katakana
    0x30F3, // Katakana N
    0x30FC  // Choonpu
  ];

  for (const code of required) {
    const char = String.fromCodePoint(code);

    if (!glyphData[char]) {
      throw new Error(`Glyph penting tidak ditemukan: U+${code.toString(16)}`);
    }
  }

  if (Object.keys(glyphData).length !== 164) {
    throw new Error(
      `Jumlah glyph tidak sesuai: ${Object.keys(glyphData).length}`
    );
  }

  // Cari font subset otomatis.
  const subsetFonts = fs.readdirSync(sourceDir).filter(
    (name) => /^klee-one-[a-f0-9]+\.ttf$/i.test(name)
  );

  if (subsetFonts.length !== 1) {
    throw new Error("Font subset Klee One tidak ditemukan secara unik.");
  }

  const sourceFont = path.join(sourceDir, subsetFonts[0]);

  // Bundle ringkas. glyphDataById sengaja tidak disertakan.
  const compactFont = {
    family: font.family,
    lineCap: font.lineCap,
    unitsPerEm: font.unitsPerEm,
    ascender: font.ascender,
    descender: font.descender,
    glyphData
  };

  fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(
    dataPath,
    JSON.stringify(compactFont),
    "utf8"
  );

  fs.copyFileSync(sourceFont, fontPath);

  console.log("=== FONT KANA BERHASIL DIBUAT ===");
  console.log("Jumlah glyph:", Object.keys(glyphData).length);
  console.log(
    "Ukuran JSON:",
    (fs.statSync(dataPath).size / 1024).toFixed(2),
    "KB"
  );
  console.log(
    "Ukuran TTF:",
    (fs.statSync(fontPath).size / 1024).toFixed(2),
    "KB"
  );
  console.log("JSON:", dataPath);
  console.log("Font:", fontPath);
  console.log("Bundle Klee One asli tidak diubah.");
})().catch((error) => {
  console.error("GAGAL:", error.message);
  process.exitCode = 1;
});
