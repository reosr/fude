// Helper bersama untuk badge tipe kata kerja (Ichidan / Godan / Irregular)

export type VerbForm = {
  name?: string;
  jpName?: string;
  ruby?: string;
  romaji?: string;
};

export type VerbType = "Godan" | "Ichidan" | "Irregular";
export type VerbTransitivity = "transitive" | "intransitive" | "both" | "unreviewed";

export type VerbEntry = {
  kanji: string;
  kana: string;
  type: string;
  jlptLevel?: string;
  transitivity?: string;
  transitivityPairId?: string;
  transitivityPairRole?: string;
  pairedVerb?: { kanji: string; kana: string };
  transitivityNote?: string;
  forms?: VerbForm[];
};

// Buang tag <ruby>/<rt>/<rp> dan sisakan teks utamanya: "<ruby>食<rt>た</rt></ruby>べます" -> "食べます"
function stripRuby(html: string): string {
  return html
    .replace(/<rt>.*?<\/rt>/gi, "")
    .replace(/<rp>.*?<\/rp>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

const normRomaji = (r: string) => r.toLowerCase().replace(/\s+/g, "");

// Bikin peta pencarian tipe verb.
// Kunci yang didaftarkan per kata kerja:
//  - "kanji-kana" dan "kanji"  (bentuk kamus, mis. 食べる)
//  - teks bentuk masu          (mis. 食べます)  <- ini yang dipakai kosakata.json
//  - "romaji:" + romaji masu   (mis. romaji:tabemasu) sebagai cadangan
export function buildVerbTypeMap(data: VerbEntry[]): Map<string, string> {
  const map = new Map<string, string>();
  const kanjiTypes = new Map<string, Set<string>>();
  const add = (key: string, type: string) => {
    if (key && !map.has(key)) map.set(key, type);
  };

  data.forEach((v) => {
    // Pasangan kanji+kana selalu lebih spesifik daripada kanji saja.
    add(`${v.kanji}-${v.kana}`, v.type);

    const knownTypes = kanjiTypes.get(v.kanji) ?? new Set<VerbType>();
    knownTypes.add(v.type);
    kanjiTypes.set(v.kanji, knownTypes);

    const masu = (v.forms || []).find((f) =>
      /ます形|masu/i.test(`${f.jpName || ""} ${f.name || ""}`)
    );
    if (masu) {
      if (masu.ruby) add(stripRuby(masu.ruby), v.type);
      if (masu.romaji) add(`romaji:${normRomaji(masu.romaji)}`, v.type);
    }
  });

  // Fallback kanji hanya dipasang bila tidak ada lebih dari satu tipe untuk kanji itu.
  kanjiTypes.forEach((types, kanji) => {
    if (types.size === 1) add(kanji, Array.from(types)[0]);
  });

  return map;
}

// Cari tipe verb dari sebuah kosakata. undefined = bukan kata kerja (atau tidak ada di data konjugasi)
export function getVerbType(
  map: Map<string, string>,
  kanji: string,
  kana: string,
  romaji?: string
): string | undefined {
  return (
    map.get(`${kanji}-${kana}`) ??
    map.get(kanji) ??
    (romaji ? map.get(`romaji:${normRomaji(romaji)}`) : undefined)
  );
}

// Metadata transitivitas ditelusuri dengan kombinasi kanji+kana,
// karena satu tulisan kanji dapat memiliki beberapa bacaan dan fungsi.
export function buildVerbTransitivityMap(data: VerbEntry[]): Map<string, VerbTransitivity> {
  const map = new Map<string, VerbTransitivity>();
  data.forEach((verb) => {
    const value = verb.transitivity ?? "unreviewed";
    map.set(`${verb.kanji}-${verb.kana}`, value as VerbTransitivity);
  });
  return map;
}

export function getVerbTransitivity(
  map: Map<string, VerbTransitivity>,
  kanji: string,
  kana: string
): VerbTransitivity | undefined {
  return map.get(`${kanji}-${kana}`);
}

// Mengambil anggota pasangan transitif/intransitif dari data yang sama.
export function getTransitivityPair<T extends VerbEntry>(data: T[], pairId: string): T[] {
  return data.filter((verb) => verb.transitivityPairId === pairId);
}

// Warna badge per tipe
export function typeBadgeClass(type: string): string {
  const t = (type || "").toLowerCase();
  if (t.includes("ichidan")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";
  if (t.includes("godan")) return "text-sky-400 bg-sky-500/10 border-sky-500/25";
  return "text-[#B8860B] bg-[#B8860B]/10 border-[#B8860B]/25"; // irregular / lainnya
}

// Warna garis aksen kiri per tipe
export function typeAccentClass(type: string): string {
  const t = (type || "").toLowerCase();
  if (t.includes("ichidan")) return "border-l-emerald-500/60";
  if (t.includes("godan")) return "border-l-sky-500/60";
  return "border-l-[#B8860B]/60";
}