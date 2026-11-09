
let kosakataPromise: Promise<any[]> | null = null;

export type VocabItem = {
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
  bab: number;
  [key: string]: any;
};

const norm = (s: string) =>
  (s || "")
    .normalize("NFKC")
    .replace(/[\s\u3000]/g, "")
    .replace(/[ã€œï½žâˆ¼]/g, "~");

export const vocabKey = (v: { kanji: string; kana: string }) =>
  `${norm(v.kanji)}-${norm(v.kana)}`;

async function loadKosakata(): Promise<any[]> {
  if (!kosakataPromise) {
    kosakataPromise = import("../data/kosakata.json")
      .then((module) => module.default as any[])
      .catch((error) => {
        kosakataPromise = null;
        throw error;
      });
  }

  return kosakataPromise;
}

// Memuat kosakata hanya ketika diperlukan.
// Kalau satu kata muncul di beberapa bab, yang dipakai bab paling awal.
export async function getUnlockedVocab(
  currentBab: number
): Promise<VocabItem[]> {
  const allKosakata = await loadKosakata();

  const seen = new Set<string>();
  const result: VocabItem[] = [];

  allKosakata
    .filter((group: any) => Number(group.bab) <= Number(currentBab))
    .sort((a: any, b: any) => Number(a.bab) - Number(b.bab))
    .forEach((group: any) => {
      (group.vocab || []).forEach((v: any) => {
        const key = vocabKey(v);

        if (seen.has(key)) return;

        seen.add(key);
        result.push({ ...v, bab: Number(group.bab) });
      });
    });

  return result;
}
