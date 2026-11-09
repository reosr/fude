
const fs = require("node:fs");
const path = require("node:path");

const sourcePath = path.join("data", "all-stories.json");
const indexPath = path.join("data", "story-index.json");
const detailDir = path.join("data", "story-details");
const loaderPath = path.join("data", "story-loaders.ts");

const stories = JSON.parse(
  fs.readFileSync(sourcePath, "utf8")
);

if (!Array.isArray(stories) || stories.length === 0) {
  throw new Error("Database cerita tidak valid.");
}

const ids = new Set();

for (const story of stories) {
  if (
    !story.id ||
    !/^[a-z0-9-]+$/i.test(story.id) ||
    !story.title ||
    !Array.isArray(story.sentences) ||
    story.sentences.length === 0 ||
    ids.has(story.id)
  ) {
    throw new Error(`Struktur cerita tidak valid: ${story.id || "tanpa ID"}`);
  }

  ids.add(story.id);
}

// Buat index ringkas.
const index = stories.map((story) => ({
  id: story.id,
  level: story.level,
  title: story.title,
  speakers: story.speakers,
  isNatural: story.isNatural,
  previewJP: story.sentences[0].jp,
  sentenceCount: story.sentences.length
}));

fs.mkdirSync(detailDir, { recursive: true });

// Buat atau perbarui setiap file cerita.
for (const story of stories) {
  fs.writeFileSync(
    path.join(detailDir, `${story.id}.json`),
    JSON.stringify(story),
    "utf8"
  );
}

// Buat peta dynamic import agar cerita bisa dimuat satu per satu.
const loaderEntries = stories.map((story) =>
  `  ${JSON.stringify(story.id)}: () => import("./story-details/${story.id}.json"),`
).join("\n");

const loaderSource = `// File ini dibuat otomatis. Jangan diedit manual.

type StoryModule = { default: any };

const storyLoaders: Record<string, () => Promise<StoryModule>> = {
${loaderEntries}
};

export async function loadStory(id: string): Promise<any> {
  const loader = storyLoaders[id];

  if (!loader) {
    throw new Error(\`Cerita tidak ditemukan: \${id}\`);
  }

  const module = await loader();
  return module.default;
}
`;

fs.writeFileSync(indexPath, JSON.stringify(index), "utf8");
fs.writeFileSync(loaderPath, loaderSource, "utf8");

console.log("=== GENERATOR CERITA BERHASIL ===");
console.log("Jumlah cerita:", stories.length);
console.log("Index diperbarui:", indexPath);
console.log("Detail cerita diperbarui:", detailDir);
console.log("Loader diperbarui:", loaderPath);
console.log("Sumber utama tidak diubah.");
