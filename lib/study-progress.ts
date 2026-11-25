"use client";

import { useSyncExternalStore } from "react";
import { notifyFudeLocalDataChanged } from "./supabase/events";

export interface StudyProgress {
  completedPracticalCategories: string[];
  completedStories: string[];
}

export const STUDY_PROGRESS_STORAGE_KEY = "fude_learning_progress_v1";
export const STUDY_PROGRESS_UPDATED_EVENT = "fude:learning-progress-updated";

const EMPTY_PROGRESS: StudyProgress = {
  completedPracticalCategories: [],
  completedStories: [],
};

let cachedProgress: StudyProgress | null = null;

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value.filter(
        (item): item is string =>
          typeof item === "string" && item.length > 0 && item.length <= 120
      )
    )
  );
}

function normalizeProgress(value: unknown): StudyProgress {
  if (!value || typeof value !== "object") return EMPTY_PROGRESS;

  const raw = value as Partial<StudyProgress>;
  return {
    completedPracticalCategories: uniqueStrings(raw.completedPracticalCategories),
    completedStories: uniqueStrings(raw.completedStories),
  };
}

function readStoredProgress(): StudyProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;

  try {
    const raw = window.localStorage.getItem(STUDY_PROGRESS_STORAGE_KEY);
    return raw ? normalizeProgress(JSON.parse(raw)) : EMPTY_PROGRESS;
  } catch (error) {
    console.warn("Gagal membaca progres belajar:", error);
    return EMPTY_PROGRESS;
  }
}

function getSnapshot(): StudyProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  if (cachedProgress === null) cachedProgress = readStoredProgress();
  return cachedProgress;
}

function getServerSnapshot(): StudyProgress {
  return EMPTY_PROGRESS;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleProgressChange = () => {
    cachedProgress = null;
    callback();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STUDY_PROGRESS_STORAGE_KEY && event.key !== null) return;
    handleProgressChange();
  };

  window.addEventListener(STUDY_PROGRESS_UPDATED_EVENT, handleProgressChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(STUDY_PROGRESS_UPDATED_EVENT, handleProgressChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function updateProgress(
  update: (current: StudyProgress) => StudyProgress
): void {
  if (typeof window === "undefined") return;

  const current = getSnapshot();
  const next = normalizeProgress(update(current));

  if (
    next.completedPracticalCategories.length === current.completedPracticalCategories.length &&
    next.completedStories.length === current.completedStories.length &&
    next.completedPracticalCategories.every((id) => current.completedPracticalCategories.includes(id)) &&
    next.completedStories.every((id) => current.completedStories.includes(id))
  ) {
    return;
  }

  cachedProgress = next;

  try {
    window.localStorage.setItem(STUDY_PROGRESS_STORAGE_KEY, JSON.stringify(next));
    notifyFudeLocalDataChanged(STUDY_PROGRESS_STORAGE_KEY);
  } catch (error) {
    console.warn("Gagal menyimpan progres belajar:", error);
  }

  window.dispatchEvent(new Event(STUDY_PROGRESS_UPDATED_EVENT));
}

export function completePracticalCategory(categoryId: string): void {
  if (typeof categoryId !== "string" || !/^[a-z0-9-]{1,80}$/.test(categoryId)) return;

  updateProgress((current) => ({
    ...current,
    completedPracticalCategories: [
      ...current.completedPracticalCategories,
      categoryId,
    ],
  }));
}

export function completeReadingStory(storyId: string): void {
  if (typeof storyId !== "string" || !/^[a-z0-9-]{1,100}$/.test(storyId)) return;

  updateProgress((current) => ({
    ...current,
    completedStories: [...current.completedStories, storyId],
  }));
}

export function getStudyProgress(): StudyProgress {
  const current = getSnapshot();
  return {
    completedPracticalCategories: [...current.completedPracticalCategories],
    completedStories: [...current.completedStories],
  };
}

export function getCompletedJlptSetIds(): string[] {
  if (typeof window === "undefined") return [];

  const completed = new Set<string>();

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key?.startsWith("jlpt_result_")) continue;

      try {
        const raw = window.localStorage.getItem(key);
        const result = raw ? JSON.parse(raw) : null;
        if (result?.completedOnce === true) {
          completed.add(key.slice("jlpt_result_".length));
        }
      } catch {
        // Abaikan hasil lama atau data set yang tidak valid.
      }
    }
  } catch (error) {
    console.warn("Gagal membaca progres JLPT:", error);
  }

  return Array.from(completed);
}

export function useStudyProgress(): StudyProgress {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
