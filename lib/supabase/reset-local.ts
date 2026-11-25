import {
  PROFILE_KEY,
  PROFILE_UPDATED_EVENT,
  XP_KEY,
  XP_REWARDS_KEY,
  XP_BASE_KEY,
  XP_EVENTS_KEY,
  XP_UPDATED_EVENT,
  TOKEN_KEY,
  TOKEN_REWARDS_KEY,
  TOKEN_SPENDS_KEY,
  TOKEN_TRANSACTIONS_KEY,
  ECONOMY_VERSION_KEY,
  TOKEN_UPDATED_EVENT,
} from "../gamification";
import {
  IRODORI_PROGRESS_STORAGE_KEY,
  IRODORI_PROGRESS_UPDATED_EVENT,
} from "../irodori-progress";
import {
  STUDY_PROGRESS_STORAGE_KEY,
  STUDY_PROGRESS_UPDATED_EVENT,
} from "../study-progress";
import {
  GACHA_INVENTORY_KEY,
  GACHA_HISTORY_KEY,
  GACHA_UPDATED_EVENT,
} from "../gacha";
import { PROFILE_PHOTO_UPDATED_EVENT, clearLocalProfilePhotoForLogout } from "../profile-photo";

const ACCOUNT_LOCAL_KEYS = [
  PROFILE_KEY,
  "fude_progress",
  XP_KEY,
  XP_REWARDS_KEY,
  XP_BASE_KEY,
  XP_EVENTS_KEY,
  "fude_memorized",
  IRODORI_PROGRESS_STORAGE_KEY,
  STUDY_PROGRESS_STORAGE_KEY,
  GACHA_INVENTORY_KEY,
  GACHA_HISTORY_KEY,
  TOKEN_KEY,
  TOKEN_REWARDS_KEY,
  TOKEN_SPENDS_KEY,
  TOKEN_TRANSACTIONS_KEY,
  ECONOMY_VERSION_KEY,
  "fude_sync_user_id",
  "fude_sync_pending",
  "fude_sync_gacha_baseline_v1",
];

let resetTask: Promise<void> | null = null;

async function performReset(): Promise<void> {
  if (typeof window === "undefined") return;

  const keys = new Set(ACCOUNT_LOCAL_KEYS);

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith("jlpt_result_")) keys.add(key);
  }

  for (const key of keys) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Gagal mengosongkan data lokal ${key}:`, error);
    }
  }

  try {
    await clearLocalProfilePhotoForLogout();
  } catch (error) {
    console.error("Gagal mengosongkan foto profil lokal:", error);
  }

  // Beri tahu komponen React agar kembali membaca nilai default.
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  window.dispatchEvent(new Event(XP_UPDATED_EVENT));
  window.dispatchEvent(new Event(TOKEN_UPDATED_EVENT));
  window.dispatchEvent(new Event(IRODORI_PROGRESS_UPDATED_EVENT));
  window.dispatchEvent(new Event(STUDY_PROGRESS_UPDATED_EVENT));
  window.dispatchEvent(new Event(GACHA_UPDATED_EVENT));
  window.dispatchEvent(new Event(PROFILE_PHOTO_UPDATED_EVENT));
}

export function resetFudeLocalAccountData(): Promise<void> {
  if (resetTask) return resetTask;

  resetTask = performReset().finally(() => {
    resetTask = null;
  });

  return resetTask;
}
