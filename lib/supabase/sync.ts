
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

export interface LocalJlptResult {
  setId: string;
  result: Record<string, unknown>;
}

export interface LocalFudeSnapshot {
  profile: FudeProfile;
  currentBab: number;
  totalXp: number;
  xpRewards: string[];
  memorizedKanji: string[];
  jlptResults: LocalJlptResult[];
  capturedAt: string;
  stored: {
    profile: boolean;
    progress: boolean;
    xp: boolean;
    memorizedKanji: boolean;
  };
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
  };

  return {
    profile: getFudeProfile(),
    currentBab: getProgress(),
    totalXp: getFudeXp(),
    xpRewards: readStringArray(XP_REWARDS_KEY),
    memorizedKanji: getMemorizedKanji(),
    jlptResults: readJlptResults(),
    capturedAt: new Date().toISOString(),
    stored,
  };
}
