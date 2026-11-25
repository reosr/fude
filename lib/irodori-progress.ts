"use client";

import { useSyncExternalStore } from "react";
import { notifyFudeLocalDataChanged } from "./supabase/events";

export type IrodoriRating = 1 | 2 | 3;

export interface IrodoriProgress {
  completedLessons: string[];
  selfEvaluations: Record<string, Record<string, IrodoriRating>>;
}

export const IRODORI_PROGRESS_IRODORI_PROGRESS_STORAGE_KEY = "fude_irodori_progress_v1";
export const IRODORI_PROGRESS_UPDATED_EVENT = "fude:irodori-progress-updated";

const EMPTY_PROGRESS: IrodoriProgress = {
  completedLessons: [],
  selfEvaluations: {},
};

let cachedProgress: IrodoriProgress | null = null;

function normalizeProgress(value: unknown): IrodoriProgress {
  if (!value || typeof value !== "object") return EMPTY_PROGRESS;

  const raw = value as Partial<IrodoriProgress>;
  const completedLessons = Array.isArray(raw.completedLessons)
    ? raw.completedLessons.filter(
        (item): item is string => typeof item === "string"
      )
    : [];

  const selfEvaluations: IrodoriProgress["selfEvaluations"] = {};

  if (raw.selfEvaluations && typeof raw.selfEvaluations === "object") {
    for (const [lessonId, rawRatings] of Object.entries(raw.selfEvaluations)) {
      if (!rawRatings || typeof rawRatings !== "object") continue;

      const ratings: Record<string, IrodoriRating> = {};

      for (const [canDoId, rating] of Object.entries(rawRatings)) {
        if (rating === 1 || rating === 2 || rating === 3) {
          ratings[canDoId] = rating;
        }
      }

      selfEvaluations[lessonId] = ratings;
    }
  }

  return { completedLessons, selfEvaluations };
}

function readStoredProgress(): IrodoriProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;

  try {
    const raw = window.localStorage.getItem(IRODORI_PROGRESS_STORAGE_KEY);
    return raw ? normalizeProgress(JSON.parse(raw)) : EMPTY_PROGRESS;
  } catch (error) {
    console.warn("Gagal membaca progres Irodori:", error);
    return EMPTY_PROGRESS;
  }
}

function getSnapshot(): IrodoriProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;

  if (cachedProgress === null) {
    cachedProgress = readStoredProgress();
  }

  return cachedProgress;
}

function getServerSnapshot(): IrodoriProgress {
  return EMPTY_PROGRESS;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== IRODORI_PROGRESS_STORAGE_KEY && event.key !== null) return;
    cachedProgress = null;
    callback();
  };

  window.addEventListener(IRODORI_PROGRESS_UPDATED_EVENT, callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(IRODORI_PROGRESS_UPDATED_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function writeProgress(next: IrodoriProgress): void {
  cachedProgress = next;

  try {
    window.localStorage.setItem(IRODORI_PROGRESS_STORAGE_KEY, JSON.stringify(next));
    notifyFudeLocalDataChanged(IRODORI_PROGRESS_STORAGE_KEY);
  } catch (error) {
    console.warn("Gagal menyimpan progres Irodori:", error);
  }

  window.dispatchEvent(new Event(IRODORI_PROGRESS_UPDATED_EVENT));
}

export function saveIrodoriSelfEvaluation(
  lessonId: string,
  ratings: Record<string, IrodoriRating>
): void {
  const current = getSnapshot();

  writeProgress({
    ...current,
    selfEvaluations: {
      ...current.selfEvaluations,
      [lessonId]: { ...ratings },
    },
  });
}

export function completeIrodoriLesson(lessonId: string): void {
  const current = getSnapshot();

  if (current.completedLessons.includes(lessonId)) return;

  writeProgress({
    ...current,
    completedLessons: [...current.completedLessons, lessonId],
  });
}

export function getIrodoriProgress(): IrodoriProgress {
  const current = getSnapshot();
  return {
    completedLessons: [...current.completedLessons],
    selfEvaluations: Object.fromEntries(
      Object.entries(current.selfEvaluations).map(([lessonId, ratings]) => [
        lessonId,
        { ...ratings },
      ])
    ),
  };
}

export function getCompletedIrodoriLessons(): string[] {
  return [...getSnapshot().completedLessons];
}

export function useIrodoriProgress(): IrodoriProgress {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
