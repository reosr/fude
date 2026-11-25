import type {
  FudeProfile,
  FudeXpEvent,
} from "../gamification";
import type { IrodoriProgress, IrodoriRating } from "../irodori-progress";
import type { StudyProgress } from "../study-progress";
import type {
  GachaSyncData,
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
  irodoriProgress: IrodoriProgress;
  studyProgress: StudyProgress;
  gachaData: GachaSyncData;
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

function normalizeForCompare(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeForCompare);
  }

  if (value !== null && typeof value === "object") {
    const object = value as Record<string, unknown>;

    return Object.fromEntries(
      Object.keys(object)
        .sort()
        .map((key) => [key, normalizeForCompare(object[key])])
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

  return Array.from(events, ([id, amount]) => ({ id, amount }));
}

function mergeProfile(
  local: FudeProfile,
  cloud: Record<string, unknown> | null,
  cloudUpdatedAt: string | null,
  pending: PendingSyncChange[],
  localWasStored: boolean
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
    photoPositionX:
      typeof cloud.photoPositionX === "number"
        ? Math.min(100, Math.max(0, cloud.photoPositionX))
        : (local.photoPositionX ?? 50),
    photoPositionY:
      typeof cloud.photoPositionY === "number"
        ? Math.min(100, Math.max(0, cloud.photoPositionY))
        : (local.photoPositionY ?? 50),
    photoZoom:
      typeof cloud.photoZoom === "number"
        ? Math.min(3, Math.max(1, cloud.photoZoom))
        : (local.photoZoom ?? 1),
  };

  const localProfile = {
    name: local.name,
    avatar: local.avatar,
    equippedBadgeId: local.equippedBadgeId ?? null,
    equippedFrameId: local.equippedFrameId ?? null,
    photoPositionX: local.photoPositionX ?? 50,
    photoPositionY: local.photoPositionY ?? 50,
    photoZoom: local.photoZoom ?? 1,
  };

  if (sameJson(localProfile, cloudProfile)) {
    return {
      ...cloudProfile,
      photoDataUrl: local.photoDataUrl ?? null,
    };
  }

  if (!localWasStored) {
    return {
      ...cloudProfile,
      photoDataUrl: local.photoDataUrl ?? null,
    };
  }

  if (!pending.some((item) => item.key === "fude_profile")) {
    throw new Error(
      "Profil lokal dan cloud berbeda, tetapi perangkat ini tidak memiliki catatan perubahan untuk menentukan versi yang benar. Data profil tidak ditimpa."
    );
  }

  if (!isLocalChangeNewer(pending, "fude_profile", cloudUpdatedAt)) {
    throw new Error(
      "Profil lokal dan cloud berubah pada waktu yang saling bertentangan. Data profil tidak ditimpa; perlu pemeriksaan sebelum sinkronisasi."
    );
  }

  return local;
}

function normalizeCloudIrodori(
  value: CloudFudeData["irodoriProgress"]
): IrodoriProgress {
  const completedLessons = Array.isArray(value?.completed_lessons)
    ? value.completed_lessons.filter((item): item is string => typeof item === "string")
    : [];
  const selfEvaluations: IrodoriProgress["selfEvaluations"] = {};

  const raw = value?.self_evaluations;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    for (const [lessonId, rawRatings] of Object.entries(raw)) {
      if (!rawRatings || typeof rawRatings !== "object" || Array.isArray(rawRatings)) {
        continue;
      }

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

function mergeIrodoriProgress(
  local: IrodoriProgress,
  cloud: CloudFudeData["irodoriProgress"],
  pending: PendingSyncChange[]
): IrodoriProgress {
  if (!cloud) return local;

  const cloudProgress = normalizeCloudIrodori(cloud);
  const completedLessons = mergeUnique(
    local.completedLessons,
    cloudProgress.completedLessons
  );

  const selfEvaluations: IrodoriProgress["selfEvaluations"] = {};
  const lessonIds = new Set([
    ...Object.keys(local.selfEvaluations),
    ...Object.keys(cloudProgress.selfEvaluations),
  ]);

  for (const lessonId of lessonIds) {
    const localRatings = local.selfEvaluations[lessonId] ?? {};
    const cloudRatings = cloudProgress.selfEvaluations[lessonId] ?? {};
    const canDoIds = new Set([
      ...Object.keys(localRatings),
      ...Object.keys(cloudRatings),
    ]);
    const mergedRatings: Record<string, IrodoriRating> = {};

    for (const canDoId of canDoIds) {
      const localRating = localRatings[canDoId];
      const cloudRating = cloudRatings[canDoId];

      if (
        localRating !== undefined &&
        cloudRating !== undefined &&
        localRating !== cloudRating
      ) {
        if (!pending.some((item) => item.key === "fude_irodori_progress_v1")) {
          throw new Error(
            `Penilaian Irodori untuk ${lessonId}/${canDoId} berbeda antara perangkat dan cloud, tetapi tidak ada catatan perubahan lokal untuk menentukan versi terbaru. Data tidak ditimpa.`
          );
        }

        if (
          !isLocalChangeNewer(
            pending,
            "fude_irodori_progress_v1",
            cloud.updated_at
          )
        ) {
          throw new Error(
            `Penilaian Irodori untuk ${lessonId}/${canDoId} memiliki konflik versi. Data tidak ditimpa; perlu pemeriksaan sebelum sinkronisasi.`
          );
        }
        mergedRatings[canDoId] = localRating;
      } else if (localRating !== undefined || cloudRating !== undefined) {
        mergedRatings[canDoId] = localRating ?? cloudRating!;
      }
    }

    if (Object.keys(mergedRatings).length > 0) {
      selfEvaluations[lessonId] = mergedRatings;
    }
  }

  return { completedLessons, selfEvaluations };
}

function normalizeCloudGacha(
  value: CloudFudeData["gachaData"]
): GachaSyncData {
  if (!value) {
    throw new Error("Data Gacha cloud tidak tersedia untuk proses penggabungan.");
  }

  const inventory = value.inventory as GachaSyncData["inventory"] | null;
  const history = value.history;

  if (
    !inventory ||
    typeof inventory !== "object" ||
    inventory.version !== 2 ||
    !inventory.badges ||
    typeof inventory.badges !== "object" ||
    Array.isArray(inventory.badges) ||
    !Array.isArray(inventory.newBadgeIds) ||
    typeof inventory.updatedAt !== "number" ||
    !Array.isArray(history)
  ) {
    throw new Error(
      "Format inventori atau riwayat Gacha di cloud tidak valid. Data lokal tidak diubah."
    );
  }

  return {
    inventory,
    history: history as GachaSyncData["history"],
  };
}

function mergeGachaData(
  local: LocalFudeSnapshot,
  cloud: CloudFudeData
): GachaSyncData {
  const localData = local.gachaData;
  const cloudData = cloud.gachaData
    ? normalizeCloudGacha(cloud.gachaData)
    : null;

  if (!cloudData) return localData;
  if (!local.stored.gacha) return cloudData;
  if (sameJson(localData, cloudData)) return cloudData;

  const baseline = local.gachaBaseline;
  if (!baseline) {
    throw new Error(
      "Inventori Gacha lokal dan cloud berbeda, tetapi perangkat belum memiliki data pembanding sinkronisasi. Data tidak ditimpa; perlu pemeriksaan sebelum melanjutkan."
    );
  }

  const localChanged = !sameJson(localData, baseline);
  const cloudChanged = !sameJson(cloudData, baseline);

  if (localChanged && !cloudChanged) return localData;
  if (cloudChanged && !localChanged) return cloudData;

  throw new Error(
    "Inventori Gacha berubah di perangkat ini dan di cloud sejak sinkronisasi terakhir. Untuk mencegah badge atau riwayat summon hilang/terduplikasi, sinkronisasi dihentikan dan perlu rekonsiliasi data."
  );
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

  const hasLocalXpHistory =
    local.currentBab > 1 ||
    local.totalXp > 0 ||
    local.xpRewards.length > 0 ||
    local.xpEvents.length > 0 ||
    local.jlptResults.length > 0;

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
    xpBase + xpEvents.reduce((sum, event) => sum + event.amount, 0);

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
        const resultKey = `jlpt_result_${setId}`;
        if (!pending.some((item) => item.key === resultKey)) {
          throw new Error(
            `Hasil JLPT ${setId} berbeda antara perangkat dan cloud tanpa catatan perubahan lokal. Data tidak ditimpa.`
          );
        }
        if (!isLocalChangeNewer(pending, resultKey, cloudEntry.updated_at)) {
          throw new Error(
            `Hasil JLPT ${setId} memiliki konflik versi. Data tidak ditimpa; perlu pemeriksaan sebelum sinkronisasi.`
          );
        }
        result = localResult;
      }
    } else {
      result = cloudResult ?? localResult;
    }

    if (result) jlptResults.push({ setId, result });
  }

  const studyProgress: StudyProgress = {
    completedPracticalCategories: mergeUnique(
      local.studyProgress.completedPracticalCategories,
      cloud.studyProgress?.completed_practical_categories ?? []
    ),
    completedStories: mergeUnique(
      local.studyProgress.completedStories,
      cloud.studyProgress?.completed_stories ?? []
    ),
  };

  return {
    profile: mergeProfile(
      local.profile,
      cloud.profile,
      cloud.profileUpdatedAt,
      pending,
      local.stored.profile
    ),
    currentBab,
    totalXp,
    xpBase,
    xpEvents,
    xpRewards,
    memorizedKanji,
    jlptResults,
    irodoriProgress: mergeIrodoriProgress(
      local.irodoriProgress,
      cloud.irodoriProgress,
      pending
    ),
    studyProgress,
    gachaData: mergeGachaData(local, cloud),
  };
}
