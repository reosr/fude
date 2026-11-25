import {
  PROFILE_UPDATED_EVENT,
  XP_KEY,
  XP_REWARDS_KEY,
  XP_BASE_KEY,
  XP_EVENTS_KEY,
  XP_UPDATED_EVENT,
} from "../gamification";

import { applyCloudData } from "./events";
import type { MergedFudeData } from "./merge";
import {
  GACHA_HISTORY_KEY,
  GACHA_INVENTORY_KEY,
  GACHA_UPDATED_EVENT,
} from "../gacha";
import { IRODORI_PROGRESS_STORAGE_KEY, IRODORI_PROGRESS_UPDATED_EVENT } from "../irodori-progress";
import { STUDY_PROGRESS_STORAGE_KEY, STUDY_PROGRESS_UPDATED_EVENT } from "../study-progress";

const PROFILE_KEY = "fude_profile";
const PROGRESS_KEY = "fude_progress";
const MEMORIZED_KEY = "fude_memorized";

export function applyMergedDataToLocal(
  data: MergedFudeData
): void {
  if (typeof window === "undefined") {
    throw new Error("Data hanya bisa diterapkan di browser.");
  }

  const writes = new Map<string, string>();

  writes.set(PROFILE_KEY, JSON.stringify(data.profile));
  writes.set(PROGRESS_KEY, String(data.currentBab));
  writes.set(XP_KEY, String(data.totalXp));
writes.set(XP_BASE_KEY, String(data.xpBase));
writes.set(XP_EVENTS_KEY, JSON.stringify(data.xpEvents));
writes.set(XP_REWARDS_KEY, JSON.stringify(data.xpRewards));
  writes.set(MEMORIZED_KEY, JSON.stringify(data.memorizedKanji));
  writes.set(
    IRODORI_PROGRESS_STORAGE_KEY,
    JSON.stringify(data.irodoriProgress)
  );
  writes.set(
    STUDY_PROGRESS_STORAGE_KEY,
    JSON.stringify(data.studyProgress)
  );
  writes.set(GACHA_INVENTORY_KEY, JSON.stringify(data.gachaData.inventory));
  writes.set(GACHA_HISTORY_KEY, JSON.stringify(data.gachaData.history));

  for (const item of data.jlptResults) {
    if (!item.setId) continue;

    writes.set(
      `jlpt_result_${item.setId}`,
      JSON.stringify(item.result)
    );
  }

  const backup = new Map<string, string | null>();

  for (const key of writes.keys()) {
    backup.set(key, localStorage.getItem(key));
  }

  try {
    applyCloudData(() => {
      for (const [key, value] of writes) {
        localStorage.setItem(key, value);
      }
    });
  } catch (error) {
    // Kembalikan data lokal jika ada penulisan yang gagal.
    applyCloudData(() => {
      for (const [key, oldValue] of backup) {
        try {
          if (oldValue === null) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, oldValue);
          }
        } catch (rollbackError) {
          console.error(
            `Gagal memulihkan data ${key}:`,
            rollbackError
          );
        }
      }
    });

    throw new Error(
      error instanceof Error
        ? `Gagal menerapkan data cloud: ${error.message}`
        : "Gagal menerapkan data cloud."
    );
  }

  // Perbarui tampilan komponen yang mendengarkan perubahan profil dan EXP.
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  window.dispatchEvent(new Event(XP_UPDATED_EVENT));
  window.dispatchEvent(new Event(IRODORI_PROGRESS_UPDATED_EVENT));
  window.dispatchEvent(new Event(STUDY_PROGRESS_UPDATED_EVENT));
  window.dispatchEvent(new Event(GACHA_UPDATED_EVENT));
}