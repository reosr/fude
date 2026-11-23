import { getCompletedIrodoriLessons } from "./irodori-progress";

let kosakataPromise: Promise<MinnaVocabGroup[]> | null = null;
let irodoriVocabPromise: Promise<IrodoriVocabLesson[]> | null = null;

export type VocabSource =
  | { type: "minna"; bab: number }
  | {
      type: "irodori";
      courseId: string;
      courseLabel: string;
      lessonId: string;
      lessonNumber: number;
      lessonTitle: string;
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

function addSource(item: VocabItem, source: VocabSource): void {
  const sources = item.sources ?? [];
  const sourceKey = source.type === "minna"
    ? `minna:${source.bab}`
    : `irodori:${source.courseId}:${source.lessonId}`;

  const alreadyAdded = sources.some((existing) => {
    const existingKey = existing.type === "minna"
      ? `minna:${existing.bab}`
      : `irodori:${existing.courseId}:${existing.lessonId}`;
    return existingKey === sourceKey;
  });

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
  const [allKosakata, allIrodoriVocab] = await Promise.all([
    loadKosakata(),
    loadIrodoriVocab(),
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

  return result;
}
