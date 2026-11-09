
const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = process.cwd();
const OWNER = "parsimonhi";
const REPO = "animCJK";
const BRANCH = "master";

const SVG_FOLDER = "svgsJaKana";

const PUBLIC_DIR = path.join(ROOT, "public", "kana-strokes");
const INDEX_FILE = path.join(ROOT, "data", "kana-stroke-index.json");

const USER_AGENT = "Fude-Kana-Asset-Generator";

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Gagal mengambil ${url}: HTTP ${response.status}`
    );
  }

  return response.text();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": USER_AGENT,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Gagal mengambil daftar GitHub: HTTP ${response.status}`
    );
  }

  return response.json();
}

function toMilliseconds(value, unit) {
  const number = Number(value);

  return unit.toLowerCase() === "ms"
    ? number
    : number * 1000;
}

function getAnimationDuration(svg) {
  const delays = [
    ...svg.matchAll(/--d\s*:\s*([\d.]+)\s*(ms|s)/gi),
  ].map((match) => toMilliseconds(match[1], match[2]));

  const durationMatch = svg.match(
    /--t\s*:\s*([\d.]+)\s*(ms|s)/i
  );

  const animationDuration = durationMatch
    ? toMilliseconds(durationMatch[1], durationMatch[2])
    : 800;

  const lastDelay = Math.max(0, ...delays);

  // Sisakan jeda setelah animasi selesai sebelum diputar kembali.
  return Math.ceil(lastDelay + animationDuration + 1000);
}

async function main() {
  console.log("Mengambil daftar Kana AnimCJK...");

  const treeUrl =
    `https://api.github.com/repos/${OWNER}/${REPO}` +
    `/git/trees/${BRANCH}?recursive=1`;

  const treeData = await fetchJson(treeUrl);

  if (!Array.isArray(treeData.tree) || treeData.truncated) {
    throw new Error(
      "Daftar file GitHub tidak lengkap. Generator dihentikan."
    );
  }

  const files = treeData.tree
    .filter((item) => {
      return (
        item.type === "blob" &&
        item.path.startsWith(`${SVG_FOLDER}/`) &&
        /^\d+\.svg$/i.test(path.posix.basename(item.path))
      );
    })
    .sort((a, b) => {
      return (
        Number(path.posix.basename(a.path, ".svg")) -
        Number(path.posix.basename(b.path, ".svg"))
      );
    });

  if (files.length === 0) {
    throw new Error("Tidak ditemukan file SVG Kana.");
  }

  console.log(`Ditemukan ${files.length} file SVG.`);

  await fs.mkdir(PUBLIC_DIR, { recursive: true });
  await fs.mkdir(path.dirname(INDEX_FILE), { recursive: true });

  const index = {};
  let completed = 0;
  let nextTask = 0;

  async function worker() {
    while (nextTask < files.length) {
      const current = files[nextTask++];
      const filename = path.posix.basename(current.path);
      const codepoint = Number(
        path.posix.basename(current.path, ".svg")
      );

      const character = String.fromCodePoint(codepoint);

      const rawUrl =
        `https://raw.githubusercontent.com/${OWNER}/${REPO}` +
        `/${BRANCH}/${current.path}`;

      const svg = await fetchText(rawUrl);

      if (!/<svg\b/i.test(svg) || !/class=["']acjk["']/i.test(svg)) {
        throw new Error(`Format SVG tidak valid: ${filename}`);
      }

      const destination = path.join(PUBLIC_DIR, filename);

      await fs.writeFile(destination, svg, "utf8");

      index[character] = {
        file: filename,
        durationMs: getAnimationDuration(svg),
      };

      completed++;

      if (completed % 25 === 0 || completed === files.length) {
        console.log(
          `Download: ${completed}/${files.length}`
        );
      }
    }
  }

  // Maksimal enam download berjalan bersamaan.
  const workers = Array.from(
    { length: 6 },
    () => worker()
  );

  await Promise.all(workers);

  const licenseFiles = [
    {
      name: "LGPL.txt",
      url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/licenses/LGPL.txt`,
    },
    {
      name: "COPYING.txt",
      url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/licenses/COPYING.txt`,
    },
  ];

  for (const license of licenseFiles) {
    const content = await fetchText(license.url);

    await fs.writeFile(
      path.join(PUBLIC_DIR, license.name),
      content,
      "utf8"
    );
  }

  const sortedIndex = Object.fromEntries(
    Object.entries(index).sort(
      ([a], [b]) => a.codePointAt(0) - b.codePointAt(0)
    )
  );

  await fs.writeFile(
    INDEX_FILE,
    JSON.stringify(sortedIndex, null, 2) + "\n",
    "utf8"
  );

  const attribution = `AnimCJK Kana SVG Assets

Copyright 2016-2026 FM&SH.

Original source:
https://github.com/${OWNER}/${REPO}/tree/${BRANCH}/${SVG_FOLDER}

Project website:
https://parsimonhi.github.io/${REPO}/

These Kana SVG files are distributed under the GNU Lesser General
Public License, version 3 or (at your option) any later version,
as described in the upstream COPYING.txt.

The original SVG files are retained without modification.

See LGPL.txt and COPYING.txt for the license information.
`;

  await fs.writeFile(
    path.join(PUBLIC_DIR, "ATTRIBUTION.txt"),
    attribution,
    "utf8"
  );

  const totalBytes = files.reduce(
    (sum, file) => sum + (file.size || 0),
    0
  );

  console.log("\n=== KANA SVG BERHASIL DIUNDUH ===");
  console.log("Jumlah SVG:", files.length);
  console.log("Jumlah karakter:", Object.keys(sortedIndex).length);
  console.log(
    "Ukuran download:",
    (totalBytes / 1024).toFixed(2),
    "KB"
  );
  console.log("Folder:", "public/kana-strokes");
  console.log("Index:", "data/kana-stroke-index.json");
  console.log("Lisensi dan atribusi: berhasil disimpan.");
}

main().catch((error) => {
  console.error("\nGENERATOR GAGAL:", error.message);
  process.exitCode = 1;
});
