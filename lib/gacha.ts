import {
  awardGachaMaxedRarityCompensationOnce,
  getFudeTokens,
  spendFudeTokensOnce,
} from "./gamification";
import { getCompletedJlptLevels } from "./profile-collections";
import { GACHA_BADGES, GACHA_BADGE_COUNTS, LEGACY_GACHA_BADGE_ID_MAP } from "../data/gacha-badges";

// =====================================================
// GACHA CONFIGURATION
// =====================================================

export const GACHA_UPDATED_EVENT = "fude-gacha-updated";
export const GACHA_INVENTORY_KEY = "fude_gacha_inventory_v1";
export const GACHA_HISTORY_KEY = "fude_gacha_history_v1";

export const GACHA_SINGLE_COST = 1;
export const GACHA_TEN_COST = 10;
export const GACHA_MAX_EVOLUTION = 3;
export const GACHA_INVENTORY_VERSION = 2;
export const GACHA_CATALOG_SIZE = 300;

export const GACHA_RARITIES = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "mythic",
  "legendary",
] as const;

export type GachaRarity = (typeof GACHA_RARITIES)[number];
export type GachaEvolutionLevel = 1 | 2 | 3;

export interface GachaBadgeDefinition {
  id: string;
  name: string;
  icon: string;
  rarity: GachaRarity;
  tier: GachaRarity;
  description?: string;
  unlockLabel?: string;
}

export interface GachaBadgeCopies {
  level1: number;
  level2: number;
  level3: number;
}

export interface GachaInventory {
  version: 1;
  badges: Record<string, GachaBadgeCopies>;
  newBadgeIds: string[];
  updatedAt: number;
}

export interface GachaHistoryEntry {
  id: string;
  badgeId: string;
  badgeName: string;
  rarity: GachaRarity;
  evolutionLevel: 1;
  createdAt: number;
}

export interface GachaCompensation {
  id: string;
  rarity: GachaRarity;
  tokens: number;
}

export interface GachaSummonResult {
  transactionId: string;
  count: number;
  cost: number;
  results: GachaHistoryEntry[];
  compensations: GachaCompensation[];
  remainingTokens: number;
}

export type GachaOperationResult =
  | { ok: true; inventory: GachaInventory }
  | {
      ok: false;
      reason:
        | "not-available"
        | "invalid-catalog"
        | "invalid-count"
        | "insufficient-tokens"
        | "storage-error"
        | "not-enough-copies"
        | "max-evolution";
    };

const BASE_RATES: Record<string, Record<GachaRarity, number>> = {
  N5: {
    common: 65,
    uncommon: 25,
    rare: 8,
    epic: 1.7,
    mythic: 0.28,
    legendary: 0.02,
  },
  N4: {
    common: 62,
    uncommon: 25,
    rare: 9.5,
    epic: 2.8,
    mythic: 0.65,
    legendary: 0.05,
  },
  N3: {
    common: 58,
    uncommon: 25,
    rare: 11,
    epic: 4.2,
    mythic: 1.5,
    legendary: 0.3,
  },
  N2: {
    common: 54,
    uncommon: 24,
    rare: 13,
    epic: 5.8,
    mythic: 2.5,
    legendary: 0.7,
  },
  N1: {
    common: 50,
    uncommon: 23,
    rare: 14,
    epic: 7,
    mythic: 4,
    legendary: 2,
  },
};

export function getGachaRates(
  level?: string
): Record<GachaRarity, number> {
  const completedLevels = getCompletedJlptLevels();
  const highestCompleted = [...completedLevels]
    .reverse()
    .find((item) => item === "N1" || item === "N2" || item === "N3" || item === "N4" || item === "N5");
  const selected = level && Object.prototype.hasOwnProperty.call(BASE_RATES, level)
    ? level
    : highestCompleted ?? "N5";

  return { ...BASE_RATES[selected] };
}

export function getGachaRateLevel(): string {
  const completed = getCompletedJlptLevels();
  return [...completed].reverse()[0] ?? "N5";
}

function canonicalBadgeId(id: string): string {
  return LEGACY_GACHA_BADGE_ID_MAP[id] ?? id;
}

function emptyCopies(): GachaBadgeCopies {
  return { level1: 0, level2: 0, level3: 0 };
}

function emptyInventory(): GachaInventory {
  return { version: GACHA_INVENTORY_VERSION, badges: {}, newBadgeIds: [], updatedAt: Date.now() };
}

function isSafeCount(value: unknown): value is number {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isInteger(value) &&
    value >= 0;
}

export function getGachaInventory(): GachaInventory {
  if (typeof window === "undefined") return emptyInventory();

  try {
    const raw = localStorage.getItem(GACHA_INVENTORY_KEY);
    if (!raw) return emptyInventory();

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" ||
      !parsed.badges || typeof parsed.badges !== "object") {
      return emptyInventory();
    }

    const badges: Record<string, GachaBadgeCopies> = {};
    for (const [id, value] of Object.entries(parsed.badges)) {
      if (!id || !value || typeof value !== "object") continue;
      const copies = value as Partial<GachaBadgeCopies>;
      const canonicalId = canonicalBadgeId(id);
      const isLegacyInventory = parsed.version !== GACHA_INVENTORY_VERSION;
      const legacyLevel0 = isSafeCount((copies as Partial<GachaBadgeCopies> & { level0?: number }).level0)
        ? (copies as Partial<GachaBadgeCopies> & { level0?: number }).level0 as number
        : 0;
      const oldLevel1 = isSafeCount(copies.level1) ? copies.level1 : 0;
      const oldLevel2 = isSafeCount(copies.level2) ? copies.level2 : 0;
      const oldLevel3 = isSafeCount(copies.level3) ? copies.level3 : 0;
      const normalized = isLegacyInventory
        ? { level1: legacyLevel0, level2: oldLevel1, level3: oldLevel2 + oldLevel3 }
        : { level1: oldLevel1, level2: oldLevel2, level3: oldLevel3 };
      const previous = badges[canonicalId] ?? emptyCopies();
      badges[canonicalId] = {
        level0: previous.level0 + normalized.level0,
        level1: previous.level1 + normalized.level1,
        level2: previous.level2 + normalized.level2,
        level3: previous.level3 + normalized.level3,
      };
    }

    const rawNewBadgeIds: unknown[] = Array.isArray(parsed.newBadgeIds)
      ? parsed.newBadgeIds
      : [];
    const newBadgeIds = Array.from(
      new Set(
        rawNewBadgeIds
          .filter((id): id is string => typeof id === "string")
          .map(canonicalBadgeId)
      )
    );

    return {
      version: GACHA_INVENTORY_VERSION,
      badges,
      newBadgeIds,
      updatedAt: typeof parsed.updatedAt === "number"
        ? parsed.updatedAt
        : Date.now(),
    };
  } catch (error) {
    console.error("Gagal membaca inventori Gacha:", error);
    return emptyInventory();
  }
}

function saveGachaInventory(inventory: GachaInventory): void {
  localStorage.setItem(
    GACHA_INVENTORY_KEY,
    JSON.stringify({
      ...inventory,
      version: GACHA_INVENTORY_VERSION,
      updatedAt: Date.now(),
    })
  );
}

export function getGachaHistory(limit = 50): GachaHistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(GACHA_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is GachaHistoryEntry =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.badgeId === "string" &&
        typeof item.badgeName === "string" &&
        GACHA_RARITIES.includes(item.rarity) &&
        (item.evolutionLevel === 0 || item.evolutionLevel === 1) &&
        typeof item.createdAt === "number"
      )
      .map((item) => {
        const badgeId = canonicalBadgeId(item.badgeId);
        const definition = GACHA_BADGES.find((badge) => badge.id === badgeId);
        return {
          ...item,
          evolutionLevel: 1 as const,
          badgeId,
          badgeName: definition?.name ?? item.badgeName,
          rarity: definition?.rarity ?? item.rarity,
        };
      })
      .slice(0, Math.max(1, Math.min(200, Math.floor(limit))));
  } catch {
    return [];
  }
}

function validateCatalog(
  catalog: GachaBadgeDefinition[]
): boolean {
  if (!Array.isArray(catalog) || catalog.length === 0) return false;

  const ids = new Set<string>();
  const counts = Object.fromEntries(
    GACHA_RARITIES.map((rarity) => [rarity, 0])
  ) as Record<GachaRarity, number>;

  for (const badge of catalog) {
    if (
      !badge ||
      typeof badge.id !== "string" ||
      !badge.id.trim() ||
      typeof badge.name !== "string" ||
      !badge.name.trim() ||
      typeof badge.icon !== "string" ||
      !GACHA_RARITIES.includes(badge.rarity) ||
      ids.has(badge.id)
    ) {
      return false;
    }

    ids.add(badge.id);
    counts[badge.rarity]++;
  }

  return GACHA_RARITIES.every(
    (rarity) => counts[rarity] === GACHA_BADGE_COUNTS[rarity]
  ) && ids.size === GACHA_CATALOG_SIZE;
}

function randomUnit(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] / 4294967296;
  }

  return Math.random();
}

function chooseRarity(rates: Record<GachaRarity, number>): GachaRarity {
  const roll = randomUnit() * 100;
  let cumulative = 0;

  for (const rarity of GACHA_RARITIES) {
    cumulative += rates[rarity];
    if (roll < cumulative) return rarity;
  }

  return "legendary";
}

function createTransactionId(): string {
  return `gacha-${Date.now().toString(36)}-${Math.floor(randomUnit() * 0xffffffff).toString(36)}`;
}

export function summonGacha(
  count: 1 | 10,
  catalog: GachaBadgeDefinition[]
): GachaOperationResult & { summon?: GachaSummonResult } {
  if (typeof window === "undefined") {
    return { ok: false, reason: "not-available" };
  }

  if (!validateCatalog(catalog)) {
    return { ok: false, reason: "invalid-catalog" };
  }

  if (count !== 1 && count !== 10) {
    return { ok: false, reason: "invalid-count" };
  }

  const cost = count === 10 ? GACHA_TEN_COST : GACHA_SINGLE_COST;
  if (getFudeTokens() < cost) {
    return { ok: false, reason: "insufficient-tokens" };
  }

  const transactionId = createTransactionId();
  const rates = getGachaRates();
  const previousInventory = getGachaInventory();
  const nextInventory: GachaInventory = {
    ...previousInventory,
    badges: { ...previousInventory.badges },
    newBadgeIds: [...previousInventory.newBadgeIds],
    updatedAt: Date.now(),
  };
  const results: GachaHistoryEntry[] = [];
  const pendingCompensations: Array<{ rarity: GachaRarity; index: number }> = [];

  for (let index = 0; index < count; index++) {
    const rarity = chooseRarity(rates);
    // Badge yang sudah mencapai Level 3 tidak lagi masuk pool summon.
    const candidates = catalog.filter((badge) => {
      if (badge.rarity !== rarity) return false;
      return (nextInventory.badges[badge.id]?.level3 ?? 0) === 0;
    });

    if (candidates.length === 0) {
      pendingCompensations.push({ rarity, index });
      continue;
    }

    const badge = candidates[Math.floor(randomUnit() * candidates.length)];
    const copies = nextInventory.badges[badge.id] ?? emptyCopies();
    nextInventory.badges[badge.id] = {
      ...copies,
      level1: copies.level1 + 1,
    };

    results.push({
      id: `${transactionId}-${index + 1}`,
      badgeId: badge.id,
      badgeName: badge.name,
      rarity,
      evolutionLevel: 1,
      createdAt: Date.now(),
    });
  }

  const previousHistory = getGachaHistory(200);
  const nextHistory = [...results, ...previousHistory].slice(0, 200);
  nextInventory.newBadgeIds = [
    ...new Set([
      ...previousInventory.newBadgeIds,
      ...results.map((result) => result.badgeId),
    ]),
  ];

  try {
    // Simpan hasil terlebih dahulu; jika token gagal dibelanjakan,
    // kedua catatan dikembalikan ke kondisi sebelumnya.
    saveGachaInventory(nextInventory);
    localStorage.setItem(GACHA_HISTORY_KEY, JSON.stringify(nextHistory));

    const spent = spendFudeTokensOnce(
      transactionId,
      cost,
      count === 10 ? "Gacha Summon 10x" : "Gacha Summon 1x"
    );

    if (!spent) {
      saveGachaInventory(previousInventory);
      localStorage.setItem(GACHA_HISTORY_KEY, JSON.stringify(previousHistory));
      return { ok: false, reason: "insufficient-tokens" };
    }

    const compensations: GachaCompensation[] = [];

    for (const compensation of pendingCompensations) {
      const compensationId = `${transactionId}-compensation-${compensation.index + 1}`;
      if (
        awardGachaMaxedRarityCompensationOnce(
          compensationId,
          compensation.rarity
        )
      ) {
        compensations.push({
          id: compensationId,
          rarity: compensation.rarity,
          tokens: 1,
        });
      }
    }

    window.dispatchEvent(new Event(GACHA_UPDATED_EVENT));

    return {
      ok: true,
      inventory: nextInventory,
      summon: {
        transactionId,
        count,
        cost,
        results,
        compensations,
        remainingTokens: getFudeTokens(),
      },
    };
  } catch (error) {
    console.error("Gagal memproses Gacha:", error);
    try {
      saveGachaInventory(previousInventory);
      localStorage.setItem(GACHA_HISTORY_KEY, JSON.stringify(previousHistory));
    } catch (rollbackError) {
      console.error("Gagal mengembalikan data Gacha:", rollbackError);
    }
    return { ok: false, reason: "storage-error" };
  }
}

export function evolveGachaBadge(
  badgeId: string
): GachaOperationResult & {
  fromLevel?: GachaEvolutionLevel;
  toLevel?: GachaEvolutionLevel;
} {
  if (typeof window === "undefined") {
    return { ok: false, reason: "not-available" };
  }

  if (!badgeId) return { ok: false, reason: "not-enough-copies" };

  const inventory = getGachaInventory();
  const copies = inventory.badges[badgeId];

  if (!copies) return { ok: false, reason: "not-enough-copies" };

  const levels: GachaEvolutionLevel[] = [2, 1];
  const fromLevel = levels.find((level) => {
    const key = `level${level}` as keyof GachaBadgeCopies;
    const needed = 3;
    return copies[key] >= needed;
  });

  if (fromLevel === undefined) {
    if (copies.level3 > 0) return { ok: false, reason: "max-evolution" };
    return { ok: false, reason: "not-enough-copies" };
  }

  const needed = 3;
  const fromKey = `level${fromLevel}` as keyof GachaBadgeCopies;
  const toKey = `level${fromLevel + 1}` as keyof GachaBadgeCopies;
  const updatedCopies = {
    ...copies,
    [fromKey]: copies[fromKey] - needed,
    [toKey]: copies[toKey] + 1,
  };

  const nextInventory: GachaInventory = {
    ...inventory,
    badges: {
      ...inventory.badges,
      [badgeId]: updatedCopies,
    },
    updatedAt: Date.now(),
  };

  try {
    saveGachaInventory(nextInventory);
    window.dispatchEvent(new Event(GACHA_UPDATED_EVENT));

    return {
      ok: true,
      inventory: nextInventory,
      fromLevel,
      toLevel: (fromLevel + 1) as GachaEvolutionLevel,
    };
  } catch (error) {
    console.error("Gagal mengembangkan badge:", error);
    return { ok: false, reason: "storage-error" };
  }
}

export function markGachaBadgeSeen(badgeId: string): void {
  if (typeof window === "undefined" || !badgeId) return;

  const inventory = getGachaInventory();
  if (!inventory.newBadgeIds.includes(badgeId)) return;

  const nextInventory: GachaInventory = {
    ...inventory,
    newBadgeIds: inventory.newBadgeIds.filter((id) => id !== badgeId),
    updatedAt: Date.now(),
  };

  try {
    saveGachaInventory(nextInventory);
    window.dispatchEvent(new Event(GACHA_UPDATED_EVENT));
  } catch (error) {
    console.error("Gagal memperbarui status NEW badge:", error);
  }
}

export function getTotalGachaBadgeCopies(
  copies: GachaBadgeCopies
): number {
  return copies.level1 + copies.level2 + copies.level3;
}

export function getGachaBadgeEvolutionProgress(
  copies: GachaBadgeCopies
): {
  currentLevel: GachaEvolutionLevel;
  copiesOwned: number;
  copiesRequired: number;
  canEvolve: boolean;
} {
  if (copies.level3 > 0) {
    return {
      currentLevel: 3,
      copiesOwned: copies.level3,
      copiesRequired: 0,
      canEvolve: false,
    };
  }

  if (copies.level2 >= 3) {
    return {
      currentLevel: 2,
      copiesOwned: copies.level2,
      copiesRequired: 3,
      canEvolve: true,
    };
  }

  if (copies.level1 >= 3) {
    return {
      currentLevel: 1,
      copiesOwned: copies.level1,
      copiesRequired: 3,
      canEvolve: true,
    };
  }

  if (copies.level2 > 0) {
    return {
      currentLevel: 2,
      copiesOwned: copies.level2,
      copiesRequired: 3,
      canEvolve: false,
    };
  }

  if (copies.level1 > 0) {
    return {
      currentLevel: 1,
      copiesOwned: copies.level1,
      copiesRequired: 3,
      canEvolve: false,
    };
  }

  return {
    currentLevel: 1,
    copiesOwned: copies.level1,
    copiesRequired: 3,
    canEvolve: false,
  };
}
