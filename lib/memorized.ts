import { notifyFudeLocalDataChanged } from "./supabase/events";
import {
  getMemorizedVocabKey,
  isMemorizedVocabKey,
  normalizeVocabIdentityPart,
  type VocabIdentity,
} from "./vocab-identity";

const MEMORIZED_KEY = "fude_memorized";
const LEGACY_BACKUP_KEY = "fude_memorized_legacy_backup_v1";
const FORMAT_MARKER = "__fude_memorized_format_v2__";

type MinnaGroup = { vocab?: VocabIdentity[] };
type IrodoriLesson = { vocab?: VocabIdentity[] };
type PracticalCategory = {
  vocab?: { word?: string; reading?: string }[];
};

function readStoredMemorizedValues(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(MEMORIZED_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return Array.from(
      new Set(parsed.filter((item): item is string => typeof item === "string"))
    );
  } catch (error) {
    console.error("Gagal membaca daftar hafalan:", error);
    return [];
  }
}

function writeStoredMemorizedValues(items: string[]): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(MEMORIZED_KEY, JSON.stringify(items));
    notifyFudeLocalDataChanged(MEMORIZED_KEY);
    return true;
  } catch (error) {
    console.error("Gagal menyimpan daftar hafalan:", error);
    return false;
  }
}

function backUpLegacyValues(values: string[]): void {
  if (typeof window === "undefined" || values.length === 0) return;

  try {
    const rawBackup = window.localStorage.getItem(LEGACY_BACKUP_KEY);
    const parsed: unknown = rawBackup ? JSON.parse(rawBackup) : [];
    const existing = Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
    window.localStorage.setItem(
      LEGACY_BACKUP_KEY,
      JSON.stringify(Array.from(new Set([...existing, ...values])))
    );
  } catch (error) {
    console.warn("Gagal membuat cadangan hafalan versi lama:", error);
  }
}

async function loadAllVocabularyIdentities(
  availableVocab: readonly VocabIdentity[]
): Promise<VocabIdentity[]> {
  const [minnaModule, irodoriModule, practicalModule] = await Promise.all([
    import("../data/kosakata.json"),
    import("../data/irodori-vocab.json"),
    import("../data/practical-vocab.json"),
  ]);

  const allVocab: VocabIdentity[] = [...availableVocab];
  const minna = minnaModule.default as MinnaGroup[];
  const irodori = irodoriModule.default as IrodoriLesson[];
  const practical = practicalModule.default as PracticalCategory[];

  for (const group of minna) {
    allVocab.push(...(group.vocab ?? []));
  }
  for (const lesson of irodori) {
    allVocab.push(...(lesson.vocab ?? []));
  }
  for (const category of practical) {
    for (const entry of category.vocab ?? []) {
      const kanji = (entry.word ?? "")
        .replace(/<rt\b[^>]*>[\s\S]*?<\/rt>/gi, "")
        .replace(/<[^>]*>/g, "")
        .trim();
      if (kanji && entry.reading) {
        allVocab.push({ kanji, kana: entry.reading });
      }
    }
  }

  return allVocab;
}

/**
 * Status hafalan memakai pasangan kanji + kana.
 * Data lama yang hanya menyimpan kanji dimigrasikan hanya saat pasangan
 * tersebut unik di seluruh materi Minna, Irodori, dan Ungkapan Praktis.
 * Entri ambigu tetap dicadangkan dan tidak menandai bacaan apa pun.
 */
export async function getMemorizedVocabKeys(
  availableVocab: readonly VocabIdentity[] = []
): Promise<string[]> {
  if (typeof window === "undefined") return [];

  const stored = readStoredMemorizedValues();
  const currentKeys = new Set(stored.filter(isMemorizedVocabKey));

  if (stored.includes(FORMAT_MARKER)) {
    return Array.from(currentKeys);
  }

  const legacyValues = stored.filter(
    (value) => value !== FORMAT_MARKER && !isMemorizedVocabKey(value)
  );

  if (legacyValues.length === 0) {
    const migratedValues = [FORMAT_MARKER, ...currentKeys];
    if (
      stored.length !== migratedValues.length ||
      stored.some((value, index) => value !== migratedValues[index])
    ) {
      writeStoredMemorizedValues(migratedValues);
    }
    return Array.from(currentKeys);
  }

  let allVocab: VocabIdentity[];
  try {
    allVocab = await loadAllVocabularyIdentities(availableVocab);
  } catch (error) {
    console.warn("Migrasi hafalan ditunda karena index kosakata belum tersedia:", error);
    return Array.from(currentKeys);
  }

  const keysByKanji = new Map<string, Set<string>>();
  for (const vocab of allVocab) {
    const kanji = normalizeVocabIdentityPart(vocab.kanji);
    const key = getMemorizedVocabKey(vocab);
    const candidates = keysByKanji.get(kanji) ?? new Set<string>();
    candidates.add(key);
    keysByKanji.set(kanji, candidates);
  }

  const unresolvedLegacy: string[] = [];
  for (const legacyKanji of legacyValues) {
    const candidates = keysByKanji.get(normalizeVocabIdentityPart(legacyKanji));
    if (candidates?.size === 1) {
      currentKeys.add(Array.from(candidates)[0]);
    } else {
      unresolvedLegacy.push(legacyKanji);
    }
  }

  backUpLegacyValues(legacyValues);
  const migratedValues = [
    FORMAT_MARKER,
    ...new Set(unresolvedLegacy),
    ...currentKeys,
  ];

  if (
    stored.length !== migratedValues.length ||
    stored.some((value, index) => value !== migratedValues[index])
  ) {
    writeStoredMemorizedValues(migratedValues);
  }

  return Array.from(currentKeys);
}

export function saveMemorizedVocabKeys(keys: string[]): boolean {
  if (typeof window === "undefined") return false;

  const stored = readStoredMemorizedValues();
  const unresolvedLegacy = stored.filter(
    (value) => value !== FORMAT_MARKER && !isMemorizedVocabKey(value)
  );
  const safeKeys = Array.from(
    new Set(keys.filter((item) => typeof item === "string" && isMemorizedVocabKey(item)))
  );

  return writeStoredMemorizedValues([
    FORMAT_MARKER,
    ...new Set(unresolvedLegacy),
    ...safeKeys,
  ]);
}

/** Data mentah untuk snapshot cloud, termasuk penanda format dan legacy cadangan. */
export function getMemorizedSyncState(): string[] {
  return readStoredMemorizedValues();
}
