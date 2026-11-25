"use client";

export type VocabTrack = "minna" | "irodori";
export type IrodoriCourseId =
  | "starter"
  | "elementary-1"
  | "elementary-2"
  | "pre-intermediate";

const ACTIVE_VOCAB_TRACK_KEY = "fude_active_vocab_track_v1";
const ACTIVE_IRODORI_COURSE_KEY = "fude_active_irodori_course_v1";

const IRODORI_COURSE_IDS: IrodoriCourseId[] = [
  "starter",
  "elementary-1",
  "elementary-2",
  "pre-intermediate",
];

export function normalizeIrodoriCourseId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function getActiveVocabularyTrack(): VocabTrack {
  if (typeof window === "undefined") return "minna";

  try {
    return window.localStorage.getItem(ACTIVE_VOCAB_TRACK_KEY) === "irodori"
      ? "irodori"
      : "minna";
  } catch {
    return "minna";
  }
}

export function setActiveVocabularyTrack(track: VocabTrack): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ACTIVE_VOCAB_TRACK_KEY, track);
  } catch (error) {
    console.warn("Gagal menyimpan jalur kosakata aktif:", error);
  }
}

export function getActiveIrodoriCourseId(): IrodoriCourseId {
  if (typeof window === "undefined") return "starter";

  try {
    const stored = window.localStorage.getItem(ACTIVE_IRODORI_COURSE_KEY);
    return IRODORI_COURSE_IDS.includes(stored as IrodoriCourseId)
      ? (stored as IrodoriCourseId)
      : "starter";
  } catch {
    return "starter";
  }
}

export function setActiveIrodoriCourseId(courseId: IrodoriCourseId): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ACTIVE_IRODORI_COURSE_KEY, courseId);
    setActiveVocabularyTrack("irodori");
  } catch (error) {
    console.warn("Gagal menyimpan level Irodori aktif:", error);
  }
}
