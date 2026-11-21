import type { FudeProfile } from "../gamification";
import type { LocalFudeSnapshot, LocalJlptResult } from "./sync";
import type { CloudFudeData } from "./read-cloud";
import type { PendingSyncChange } from "./events";

export interface MergedFudeData {
  profile: FudeProfile;
  currentBab: number;
  totalXp: number;
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

function mergeProfile(
  local: FudeProfile,
  cloud: Record<string, unknown> | null,
  localChanged: boolean
): FudeProfile {
  if (!cloud || localChanged) return local;

  return {
    name:
      typeof cloud.name === "string" && cloud.name.trim()
        ? cloud.name
        : local.name,

    avatar:
      typeof cloud.avatar === "string"
        ? cloud.avatar
        : local.avatar,

    // Foto lokal tidak diganti oleh data JSON cloud.
    photoDataUrl: local.photoDataUrl ?? null,

    equippedBadgeId:
      typeof cloud.equippedBadgeId === "string"
        ? cloud.equippedBadgeId
        : null,

    equippedFrameId:
      typeof cloud.equippedFrameId === "string"
        ? cloud.equippedFrameId
        : null,
  };
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

  const totalXp = Math.max(
    local.totalXp,
    safeNumber(cloudProgress?.total_xp, 0)
  );

  const xpRewards = mergeUnique(
    local.xpRewards,
    cloudProgress?.xp_rewards ?? []
  );

  const memorizedKanji = mergeUnique(
    local.memorizedKanji,
    cloudProgress?.memorized_kanji ?? []
  );

  const localJlptMap = new Map(
    local.jlptResults.map((item) => [item.setId, item.result])
  );

  const cloudJlptMap = new Map(
    cloud.jlptResults.map((item) => [item.set_id, item.result])
  );

  const allSetIds = new Set([
    ...localJlptMap.keys(),
    ...cloudJlptMap.keys(),
  ]);

  const jlptResults: LocalJlptResult[] = [];

  for (const setId of allSetIds) {
    const localResult = localJlptMap.get(setId);
    const cloudResult = cloudJlptMap.get(setId);

    const preferLocal = hasPending(
      pending,
      `jlpt_result_${setId}`
    );

    const result =
      preferLocal && localResult
        ? localResult
        : cloudResult ?? localResult;

    if (result) {
      jlptResults.push({ setId, result });
    }
  }

  return {
    profile: mergeProfile(
      local.profile,
      cloud.profile,
      hasPending(pending, "fude_profile")
    ),
    currentBab,
    totalXp,
    xpRewards,
    memorizedKanji,
    jlptResults,
  };
}