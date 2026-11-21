import type { FudeProfile, FudeXpEvent } from "../gamification";
import type {
  LocalFudeSnapshot,
  LocalJlptResult,
} from "./sync";
import type { CloudFudeData } from "./read-cloud";
import type { PendingSyncChange } from "./events";

export interface MergedFudeData {
  profile: FudeProfile;
  currentBab: number;
  totalXp: number;
  xpBase: number;
  xpEvents: FudeXpEvent[];
  xpRewards: string[];
  memorizedKanji: string[];
  jlptResults: LocalJlptResult[];
}

function mergeUnique(...arrays: string[][]): string[] {
  return Array.from(new Set(arrays.flat()));
}

function safeNumber(value: unknown, fallback: number): number {
  const number = Number(value);

  return Number.isSafeInteger(number) && number >= 0
    ? number
    : fallback;
}

function hasPending(
  pending: PendingSyncChange[],
  key: string
): boolean {
  return pending.some((item) => item.key === key);
}

function isLocalChangeNewer(
  pending: PendingSyncChange[],
  key: string,
  cloudUpdatedAt: string | null
): boolean {
  const localChange = pending.find((item) => item.key === key);

  if (!localChange) return false;

  const cloudTime = Date.parse(cloudUpdatedAt ?? "");

  if (!Number.isFinite(cloudTime)) {
    throw new Error(
      `Waktu perubahan cloud untuk ${key} tidak valid. Sinkronisasi dihentikan.`
    );
  }

  return localChange.updatedAt > cloudTime;
}

function normalizeForCompare(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeForCompare);
  }

  if (value !== null && typeof value === "object") {
    const object = value as Record<string, unknown>;

    return Object.fromEntries(
      Object.keys(object)
        .sort()
        .map((key) => [
          key,
          normalizeForCompare(object[key]),
        ])
    );
  }

  return value;
}

function sameJson(a: unknown, b: unknown): boolean {
  return (
    JSON.stringify(normalizeForCompare(a)) ===
    JSON.stringify(normalizeForCompare(b))
  );
}

function mergeXpEvents(
  localEvents: FudeXpEvent[],
  cloudEvents: FudeXpEvent[]
): FudeXpEvent[] {
  const events = new Map<string, number>();

  for (const event of [...localEvents, ...cloudEvents]) {
    if (
      !event.id ||
      !Number.isSafeInteger(event.amount) ||
      event.amount <= 0
    ) {
      throw new Error("Ditemukan catatan reward EXP yang tidak valid.");
    }

    const existing = events.get(event.id);

    if (existing !== undefined && existing !== event.amount) {
      throw new Error(
        `Nominal reward EXP berbeda untuk ID ${event.id}. Sinkronisasi dihentikan demi keamanan data.`
      );
    }

    events.set(event.id, event.amount);
  }

  return Array.from(events, ([id, amount]) => ({
    id,
    amount,
  }));
}

function mergeProfile(
  local: FudeProfile,
  cloud: Record<string, unknown> | null,
  cloudUpdatedAt: string | null,
  pending: PendingSyncChange[]
): FudeProfile {
  if (!cloud) return local;

  const cloudProfile = {
    name:
      typeof cloud.name === "string" && cloud.name.trim()
        ? cloud.name
        : local.name,

    avatar:
      typeof cloud.avatar === "string"
        ? cloud.avatar
        : local.avatar,

    equippedBadgeId:
      typeof cloud.equippedBadgeId === "string"
        ? cloud.equippedBadgeId
        : null,

    equippedFrameId:
      typeof cloud.equippedFrameId === "string"
        ? cloud.equippedFrameId
        : null,
  };

  const localProfile = {
    name: local.name,
    avatar: local.avatar,
    equippedBadgeId: local.equippedBadgeId ?? null,
    equippedFrameId: local.equippedFrameId ?? null,
  };

  if (
    sameJson(localProfile, cloudProfile) ||
    !isLocalChangeNewer(
      pending,
      "fude_profile",
      cloudUpdatedAt
    )
  ) {
    return {
      ...cloudProfile,
      photoDataUrl: local.photoDataUrl ?? null,
    };
  }

  return local;
}

export function mergeFudeData(
  local: LocalFudeSnapshot,
  cloud: CloudFudeData,
  pending: PendingSyncChange[]
): MergedFudeData {
  const cloudProgress = cloud.progress;

  const currentBab = Math.max(
    local.currentBab,
    safeNumber(cloudProgress?.current_bab, 1),
    1
  );

  const xpRewards = mergeUnique(
    local.xpRewards,
    cloudProgress?.xp_rewards ?? []
  );

  const memorizedKanji = mergeUnique(
    local.memorizedKanji,
    cloudProgress?.memorized_kanji ?? []
  );

  // Periksa apakah perangkat memiliki riwayat belajar lokal.
  const hasLocalXpHistory =
    local.stored.xp ||
    local.currentBab > 1 ||
    local.totalXp > 0 ||
    local.xpRewards.length > 0 ||
    local.xpEvents.length > 0 ||
    local.jlptResults.length > 0;

  // Jika perangkat dan cloud memiliki saldo dasar berbeda,
  // jangan gabungkan secara otomatis.
  const cloudXpBase = safeNumber(
    cloudProgress?.xp_base,
    safeNumber(cloudProgress?.total_xp, 0)
  );

  if (
    cloudProgress &&
    hasLocalXpHistory &&
    local.xpBase !== cloudXpBase
  ) {
    throw new Error(
      "Saldo dasar EXP lokal berbeda dengan cloud. Data belum diubah; perlu pemeriksaan manual sebelum sinkronisasi."
    );
  }

  const xpBase = cloudProgress
    ? hasLocalXpHistory
      ? local.xpBase
      : cloudXpBase
    : local.xpBase;

  const cloudXpEvents = cloudProgress?.xp_events ?? [];

  const xpEvents = cloudProgress
    ? hasLocalXpHistory
      ? mergeXpEvents(local.xpEvents, cloudXpEvents)
      : mergeXpEvents([], cloudXpEvents)
    : mergeXpEvents(local.xpEvents, []);

  const totalXp =
    xpBase +
    xpEvents.reduce((sum, event) => sum + event.amount, 0);

  const localJlptMap = new Map(
    local.jlptResults.map((item) => [item.setId, item.result])
  );

  const cloudJlptMap = new Map(
  cloud.jlptResults.map((item) => [item.set_id, item])
);

const allSetIds = new Set([
  ...localJlptMap.keys(),
  ...cloudJlptMap.keys(),
]);

const jlptResults: LocalJlptResult[] = [];

for (const setId of allSetIds) {
  const localResult = localJlptMap.get(setId);
  const cloudEntry = cloudJlptMap.get(setId);
  const cloudResult = cloudEntry?.result;

  let result: Record<string, unknown> | undefined;

  if (localResult && cloudResult) {
    if (sameJson(localResult, cloudResult)) {
      result = cloudResult;
    } else {
      const localIsNewer = isLocalChangeNewer(
        pending,
        `jlpt_result_${setId}`,
        cloudEntry.updated_at
      );

      result = localIsNewer ? localResult : cloudResult;
    }
  } else {
    result = cloudResult ?? localResult;
  }

  if (result) {
    jlptResults.push({ setId, result });
  }
}

  return {
    profile: mergeProfile(
    local.profile,
    cloud.profile,
    cloud.profileUpdatedAt,
    pending
    ),
    currentBab,
    totalXp,
    xpBase,
    xpEvents,
    xpRewards,
    memorizedKanji,
    jlptResults,
  };
}