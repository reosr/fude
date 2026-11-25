
import { getProgress } from "../progress";
import {
  getFudeProfile,
  getFudeXp,
  getFudeXpSyncState,
  XP_REWARDS_KEY,
  type FudeProfile,
  type FudeXpEvent,
} from "../gamification";
import { getMemorizedKanji } from "../memorized";
import {
  getIrodoriProgress,
  IRODORI_PROGRESS_STORAGE_KEY,
  type IrodoriProgress,
} from "../irodori-progress";
import {
  getStudyProgress,
  STUDY_PROGRESS_STORAGE_KEY,
  type StudyProgress,
} from "../study-progress";
import {
  getGachaHistory,
  getGachaInventory,
  GACHA_HISTORY_KEY,
  GACHA_INVENTORY_KEY,
  type GachaHistoryEntry,
  type GachaInventory,
} from "../gacha";

export interface LocalJlptResult {
  setId: string;
  result: Record<string, unknown>;
}

export interface GachaSyncData {
  inventory: GachaInventory;
  history: GachaHistoryEntry[];
}

export interface LocalFudeSnapshot {
  profile: FudeProfile;
  currentBab: number;
  totalXp: number;
  xpBase: number;
  xpEvents: FudeXpEvent[];
  xpRewards: string[];
  memorizedKanji: string[];
  jlptResults: LocalJlptResult[];
  irodoriProgress: IrodoriProgress;
  studyProgress: StudyProgress;
  gachaData: GachaSyncData;
  gachaBaseline: GachaSyncData | null;
  capturedAt: string;
  stored: {
    profile: boolean;
    progress: boolean;
    xp: boolean;
    memorizedKanji: boolean;
    irodoriProgress: boolean;
    studyProgress: boolean;
    gacha: boolean;
  };
}


const GACHA_SYNC_BASELINE_KEY = "fude_sync_gacha_baseline_v1";

const EMPTY_GACHA_INVENTORY: GachaInventory = {
  version: 2,
  badges: {},
  newBadgeIds: [],
  updatedAt: 0,
};

function isGachaSyncData(value: unknown): value is GachaSyncData {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Partial<GachaSyncData>;
  const inventory = candidate.inventory as Partial<GachaInventory> | undefined;
  return Boolean(
    inventory &&
    inventory.version === 2 &&
    inventory.badges &&
    typeof inventory.badges === "object" &&
    !Array.isArray(inventory.badges) &&
    Array.isArray(inventory.newBadgeIds) &&
    typeof inventory.updatedAt === "number" &&
    Array.isArray(candidate.history)
  );
}

export function readGachaSyncBaseline(): GachaSyncData | null {
  try {
    const raw = localStorage.getItem(GACHA_SYNC_BASELINE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isGachaSyncData(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveGachaSyncBaseline(data: GachaSyncData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GACHA_SYNC_BASELINE_KEY, JSON.stringify(data));
}

function readStringArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return Array.from(
      new Set(
        parsed.filter(
          (item): item is string => typeof item === "string"
        )
      )
    );
  } catch {
    return [];
  }
}

function readJlptResults(): LocalJlptResult[] {
  const results: LocalJlptResult[] = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);

    if (!key?.startsWith("jlpt_result_")) continue;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed: unknown = JSON.parse(raw);

      if (
        parsed === null ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        continue;
      }

      results.push({
        setId: key.slice("jlpt_result_".length),
        result: parsed as Record<string, unknown>,
      });
    } catch {
      console.warn("Melewati data JLPT yang tidak valid:", key);
    }
  }

  return results;
}

export function getLocalFudeSnapshot(): LocalFudeSnapshot {
  if (typeof window === "undefined") {
    throw new Error("Data Fude hanya bisa dibaca di browser.");
  }

  const stored = {
    profile: localStorage.getItem("fude_profile") !== null,
    progress: localStorage.getItem("fude_progress") !== null,
    xp: localStorage.getItem("fude_xp") !== null,
    memorizedKanji: localStorage.getItem("fude_memorized") !== null,
    irodoriProgress: localStorage.getItem(IRODORI_PROGRESS_STORAGE_KEY) !== null,
    studyProgress: localStorage.getItem(STUDY_PROGRESS_STORAGE_KEY) !== null,
    gacha:
      localStorage.getItem(GACHA_INVENTORY_KEY) !== null ||
      localStorage.getItem(GACHA_HISTORY_KEY) !== null,
  };

  const storedInventory = localStorage.getItem(GACHA_INVENTORY_KEY);
  const gachaData: GachaSyncData = {
    inventory: storedInventory
      ? getGachaInventory()
      : EMPTY_GACHA_INVENTORY,
    history: stored.gacha ? getGachaHistory(200) : [],
  };

  const xpSyncState = getFudeXpSyncState();

  return {
    profile: getFudeProfile(),
    currentBab: getProgress(),
    totalXp: getFudeXp(),
    xpBase: xpSyncState.base,
    xpEvents: xpSyncState.events,
    xpRewards: readStringArray(XP_REWARDS_KEY),
    memorizedKanji: getMemorizedKanji(),
    jlptResults: readJlptResults(),
    irodoriProgress: getIrodoriProgress(),
    studyProgress: getStudyProgress(),
    gachaData,
    gachaBaseline: readGachaSyncBaseline(),
    capturedAt: new Date().toISOString(),
    stored,
  };
}
