let kosakataPromise: Promise<any[]> | null = null;
let irodoriVocabPromise: Promise<IrodoriVocabLesson[]> | null = null;

import { getCompletedIrodoriLessons } from "./irodori-progress";

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
  bab?: number;
  sources?: VocabSource[];
  [key: string]: any;
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
    .replace(/[\\s\\u3000]/g, "")
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
  const sources = item.sources ?? (item.bab !== undefined ? [{ type: "minna" as const, bab: item.bab }] : []);

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
    .filter((group: any) => Number(group.bab) <= Number(currentBab))
    .sort((a: any, b: any) => Number(a.bab) - Number(b.bab))
    .forEach((group: any) => {
      (group.vocab || []).forEach((v: any) => {
        const key = vocabKey(v);
        const existing = itemByKey.get(key);

        if (existing) {
          addSource(existing, { type: "minna", bab: Number(group.bab) });
          return;
        }

        const item: VocabItem = {
          ...v,
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
