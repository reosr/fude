import { getCompletedIrodoriLessons } from "./irodori-progress";

let kosakataPromise: Promise<MinnaVocabGroup[]> | null = null;
let irodoriVocabPromise: Promise<IrodoriVocabLesson[]> | null = null;
let practicalVocabPromise: Promise<PracticalVocabCategory[]> | null = null;

export type VocabSource =
  | { type: "minna"; bab: number }
  | {
      type: "irodori";
      courseId: string;
      courseLabel: string;
      lessonId: string;
      lessonNumber: number;
      lessonTitle: string;
    }
  | {
      type: "practical";
      categoryId: string;
      categoryLabel: string;
    };

export type VocabItem = {
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
  imageQuery?: string;
  imageUrl?: string;
  bab?: number;
  sources?: VocabSource[];
};

type MinnaVocabGroup = {
  bab: number;
  vocab: Omit<VocabItem, "bab" | "sources">[];
};

type IrodoriVocabLesson = {
  lessonId: string;
  courseId: string;
  courseLabel: string;
  lessonNumber: number;
  lessonTitle: string;
  vocab: Omit<VocabItem, "bab" | "sources">[];
};

type PracticalVocabCategory = {
  id: string;
  label: string;
  href: string;
  relatedStoryIds: string[];
  vocab: {
    word: string;
    reading: string;
    romaji: string;
    meaning: string;
  }[];
};

const norm = (s: string) =>
  (s || "")
    .normalize("NFKC")
    .replace(/[\s\u3000]/g, "")
    .replace(/[ã€œï½žâˆ¼]/g, "~");

export const vocabKey = (v: { kanji: string; kana: string }) =>
  `${norm(v.kanji)}-${norm(v.kana)}`;


function normalizeMeaning(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("id")
    .replace(/\s+/g, " ")
    .replace(/[。.!?！？]+$/g, "");
}

function meaningParts(value: string): string[] {
  return value
    .split(/\s*[;；]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

// Pertahankan arti tambahan dari bab/pelajaran lain saat kosakata yang sama
// digabung. Ejaan berbeda kapitalisasi tidak dihitung sebagai arti baru.
function mergeVocabularyMeanings(current: string, incoming: string): string {
  const merged: string[] = [];

  for (const candidate of [...meaningParts(current), ...meaningParts(incoming)]) {
    const candidateTokens = candidate
      .split(/\s*\/\s*/)
      .map(normalizeMeaning)
      .filter(Boolean);

    if (
      candidateTokens.length === 0 ||
      merged.some((existing) => {
        const existingTokens = existing
          .split(/\s*\/\s*/)
          .map(normalizeMeaning)
          .filter(Boolean);
        return candidateTokens.every((token) => existingTokens.includes(token));
      })
    ) {
      continue;
    }

    for (let index = merged.length - 1; index >= 0; index -= 1) {
      const existingTokens = merged[index]
        .split(/\s*\/\s*/)
        .map(normalizeMeaning)
        .filter(Boolean);

      if (existingTokens.every((token) => candidateTokens.includes(token))) {
        merged.splice(index, 1);
      }
    }

    merged.push(candidate);
  }

  return merged.join("; ");
}

async function loadKosakata(): Promise<MinnaVocabGroup[]> {
  if (!kosakataPromise) {
    kosakataPromise = import("../data/kosakata.json")
      .then((module) => module.default as MinnaVocabGroup[])
      .catch((error) => {
        kosakataPromise = null;
        throw error;
      });
  }

  return kosakataPromise;
}

async function loadIrodoriVocab(): Promise<IrodoriVocabLesson[]> {
  if (!irodoriVocabPromise) {
    irodoriVocabPromise = import("../data/irodori-vocab.json")
      .then((module) => module.default as IrodoriVocabLesson[])
      .catch((error) => {
        irodoriVocabPromise = null;
        throw error;
      });
  }

  return irodoriVocabPromise;
}

async function loadPracticalVocab(): Promise<PracticalVocabCategory[]> {
  if (!practicalVocabPromise) {
    practicalVocabPromise = import("../data/practical-vocab.json")
      .then((module) => module.default as PracticalVocabCategory[])
      .catch((error) => {
        practicalVocabPromise = null;
        throw error;
      });
  }

  return practicalVocabPromise;
}

function getSourceKey(source: VocabSource): string {
  if (source.type === "minna") return `minna:${source.bab}`;
  if (source.type === "irodori") return `irodori:${source.courseId}:${source.lessonId}`;
  return `practical:${source.categoryId}`;
}

function addSource(item: VocabItem, source: VocabSource): void {
  const sources = item.sources ?? [];
  const sourceKey = getSourceKey(source);
  const alreadyAdded = sources.some((existing) => getSourceKey(existing) === sourceKey);

  if (!alreadyAdded) {
    item.sources = [...sources, source];
  }
}

export function getVocabSourceLabel(item: VocabItem): string {
  const sources = item.sources ?? (
    item.bab !== undefined
      ? [{ type: "minna" as const, bab: item.bab }]
      : []
  );

  return sources.map((source) => {
    if (source.type === "minna") return `Bab ${source.bab}`;
    if (source.type === "practical") return `Ungkapan Praktis · ${source.categoryLabel}`;

    const shortCourse = source.courseId === "elementary1"
      ? "E1"
      : source.courseId === "elementary2"
        ? "E2"
        : source.courseId === "pre-intermediate"
          ? "Pre-Int"
          : "Starter";
    return `Irodori ${shortCourse} · L${source.lessonNumber}`;
  }).join(" + ");
}

// Memuat kosakata Minna dan Irodori sesuai progres masing-masing jalur.
// Kata yang sama hanya muncul sekali, tetapi semua sumber belajarnya dipertahankan.
export async function getUnlockedVocab(
  currentBab: number
): Promise<VocabItem[]> {
  const [allKosakata, allIrodoriVocab, allPracticalVocab] = await Promise.all([
    loadKosakata(),
    loadIrodoriVocab(),
    loadPracticalVocab(),
  ]);

  const result: VocabItem[] = [];
  const itemByKey = new Map<string, VocabItem>();

  allKosakata
    .filter((group) => Number(group.bab) <= Number(currentBab))
    .sort((a, b) => Number(a.bab) - Number(b.bab))
    .forEach((group) => {
      group.vocab.forEach((vocab) => {
        const key = vocabKey(vocab);
        const existing = itemByKey.get(key);

        if (existing) {
          existing.meaning = mergeVocabularyMeanings(existing.meaning, vocab.meaning);
          addSource(existing, { type: "minna", bab: Number(group.bab) });
          return;
        }

        const item: VocabItem = {
          ...vocab,
          bab: Number(group.bab),
          sources: [{ type: "minna", bab: Number(group.bab) }],
        };
        itemByKey.set(key, item);
        result.push(item);
      });
    });

  const completedLessons = new Set(getCompletedIrodoriLessons());

  allIrodoriVocab.forEach((lesson) => {
    if (!completedLessons.has(lesson.lessonId)) return;

    lesson.vocab.forEach((vocab) => {
      const key = vocabKey(vocab);
      const source: VocabSource = {
        type: "irodori",
        courseId: lesson.courseId,
        courseLabel: lesson.courseLabel,
        lessonId: lesson.lessonId,
        lessonNumber: lesson.lessonNumber,
        lessonTitle: lesson.lessonTitle,
      };
      const existing = itemByKey.get(key);

      if (existing) {
        existing.meaning = mergeVocabularyMeanings(existing.meaning, vocab.meaning);
        addSource(existing, source);
        return;
      }

      const item: VocabItem = {
        ...vocab,
        sources: [source],
      };
      itemByKey.set(key, item);
      result.push(item);
    });
  });

  // Kosakata Ungkapan Praktis selalu tersedia karena seluruh kategorinya
  // sudah dibuka. Sumber kategori tetap disimpan ketika kata yang sama
  // juga muncul di Minna atau Irodori.
  allPracticalVocab.forEach((category) => {
    const source: VocabSource = {
      type: "practical",
      categoryId: category.id,
      categoryLabel: category.label,
    };

    category.vocab.forEach((entry) => {
      const kanji = entry.word
        .replace(/<rt\\b[^>]*>[\\s\\S]*?<\\/rt>/gi, "")
        .replace(/<[^>]*>/g, "")
        .trim();
      const vocab = {
        kanji,
        kana: entry.reading,
        romaji: entry.romaji,
        meaning: entry.meaning,
      };
      const key = vocabKey(vocab);
      const existing = itemByKey.get(key);

      if (existing) {
        existing.meaning = mergeVocabularyMeanings(existing.meaning, vocab.meaning);
        addSource(existing, source);
        return;
      }

      const item: VocabItem = {
        ...vocab,
        sources: [source],
      };
      itemByKey.set(key, item);
      result.push(item);
    });
  });

  return result;
}
