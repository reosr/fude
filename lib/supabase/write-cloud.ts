import { createClient } from "./client";
import type { MergedFudeData } from "./merge";
import type { CloudFudeData } from "./read-cloud";

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

function throwWriteError(label: string, message: string): never {
  throw new Error(`Gagal menyimpan ${label}: ${message}`);
}

export async function writeCloudFudeData(
  data: MergedFudeData,
  expectedUserId: string,
  cloud: CloudFudeData
): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Gagal memeriksa akun: ${authError.message}`);
  }

  if (!user) {
    throw new Error("Belum login ke akun Fude.");
  }

  if (user.id !== expectedUserId) {
    throw new Error(
      "Akun berubah selama sinkronisasi. Pengiriman data dibatalkan."
    );
  }

  const now = new Date().toISOString();

  const profile = {
    name: data.profile.name,
    avatar: data.profile.avatar,
    equippedBadgeId: data.profile.equippedBadgeId ?? null,
    equippedFrameId: data.profile.equippedFrameId ?? null,
    photoPositionX: data.profile.photoPositionX ?? 50,
    photoPositionY: data.profile.photoPositionY ?? 50,
    photoZoom: data.profile.photoZoom ?? 1,
  };

  if (!cloud.profile) {
    const result = await supabase
      .from("fude_profiles")
      .insert({
        user_id: user.id,
        profile,
        updated_at: now,
      });

    if (result.error) {
      throwWriteError("profil", result.error.message);
    }
  } else if (!sameJson(profile, cloud.profile)) {
    if (!cloud.profileUpdatedAt) {
      throw new Error(
        "Waktu versi profil cloud tidak tersedia. Penulisan dibatalkan."
      );
    }

    const result = await supabase
      .from("fude_profiles")
      .update({ profile, updated_at: now })
      .eq("user_id", user.id)
      .eq("updated_at", cloud.profileUpdatedAt)
      .select("user_id")
      .maybeSingle();

    if (result.error) {
      throwWriteError("profil", result.error.message);
    }
    if (!result.data) {
      throw new Error(
        "Profil cloud berubah saat proses sinkronisasi. Data belum ditimpa; coba sinkronkan ulang."
      );
    }
  }

  const progress = cloud.progress;
  const progressChanged =
    !progress ||
    Number(progress.current_bab) !== data.currentBab ||
    Number(progress.total_xp) !== data.totalXp ||
    Number(progress.xp_base) !== data.xpBase ||
    !sameJson(progress.xp_events, data.xpEvents) ||
    !sameJson(progress.xp_rewards, data.xpRewards) ||
    !sameJson(progress.memorized_kanji, data.memorizedKanji);

  if (!progress) {
    const result = await supabase
      .from("fude_learning_progress")
      .insert({
        user_id: user.id,
        current_bab: data.currentBab,
        total_xp: data.totalXp,
        xp_base: data.xpBase,
        xp_events: data.xpEvents,
        xp_rewards: data.xpRewards,
        memorized_kanji: data.memorizedKanji,
        updated_at: now,
      });

    if (result.error) {
      throwWriteError("progres belajar", result.error.message);
    }
  } else if (progressChanged) {
    const result = await supabase
      .from("fude_learning_progress")
      .update({
        current_bab: data.currentBab,
        total_xp: data.totalXp,
        xp_base: data.xpBase,
        xp_events: data.xpEvents,
        xp_rewards: data.xpRewards,
        memorized_kanji: data.memorizedKanji,
        updated_at: now,
      })
      .eq("user_id", user.id)
      .eq("updated_at", progress.updated_at)
      .select("user_id")
      .maybeSingle();

    if (result.error) {
      throwWriteError("progres belajar", result.error.message);
    }
    if (!result.data) {
      throw new Error(
        "Progres EXP cloud berubah saat proses sinkronisasi. Data belum ditimpa; coba sinkronkan ulang."
      );
    }
  }

  const cloudJlptMap = new Map(
    cloud.jlptResults.map((item) => [item.set_id, item])
  );

  for (const item of data.jlptResults) {
    const existing = cloudJlptMap.get(item.setId);

    if (existing && sameJson(existing.result, item.result)) {
      continue;
    }

    if (!existing) {
      const result = await supabase
        .from("fude_jlpt_results")
        .insert({
          user_id: user.id,
          set_id: item.setId,
          result: item.result,
          updated_at: now,
        });

      if (result.error) {
        throwWriteError(`hasil JLPT ${item.setId}`, result.error.message);
      }
      continue;
    }

    const result = await supabase
      .from("fude_jlpt_results")
      .update({
        result: item.result,
        updated_at: now,
      })
      .eq("user_id", user.id)
      .eq("set_id", item.setId)
      .eq("updated_at", existing.updated_at)
      .select("set_id")
      .maybeSingle();

    if (result.error) {
      throwWriteError(`hasil JLPT ${item.setId}`, result.error.message);
    }
    if (!result.data) {
      throw new Error(
        `Hasil JLPT ${item.setId} berubah di cloud saat sinkronisasi. Data belum ditimpa; coba sinkronkan ulang.`
      );
    }
  }

  const irodoriPayload = {
    completed_lessons: data.irodoriProgress.completedLessons,
    self_evaluations: data.irodoriProgress.selfEvaluations,
  };
  const cloudIrodori = cloud.irodoriProgress;
  const irodoriChanged =
    !cloudIrodori ||
    !sameJson(irodoriPayload.completed_lessons, cloudIrodori.completed_lessons) ||
    !sameJson(irodoriPayload.self_evaluations, cloudIrodori.self_evaluations);

  if (!cloudIrodori) {
    const result = await supabase
      .from("fude_irodori_progress")
      .insert({
        user_id: user.id,
        ...irodoriPayload,
        updated_at: now,
      });

    if (result.error) {
      throwWriteError("progres Irodori", result.error.message);
    }
  } else if (irodoriChanged) {
    const result = await supabase
      .from("fude_irodori_progress")
      .update({ ...irodoriPayload, updated_at: now })
      .eq("user_id", user.id)
      .eq("updated_at", cloudIrodori.updated_at)
      .select("user_id")
      .maybeSingle();

    if (result.error) {
      throwWriteError("progres Irodori", result.error.message);
    }
    if (!result.data) {
      throw new Error(
        "Progres Irodori berubah di cloud saat sinkronisasi. Data belum ditimpa; coba sinkronkan ulang."
      );
    }
  }

  const studyPayload = {
    completed_practical_categories:
      data.studyProgress.completedPracticalCategories,
    completed_stories: data.studyProgress.completedStories,
  };
  const cloudStudy = cloud.studyProgress;
  const studyChanged =
    !cloudStudy ||
    !sameJson(
      studyPayload.completed_practical_categories,
      cloudStudy.completed_practical_categories
    ) ||
    !sameJson(studyPayload.completed_stories, cloudStudy.completed_stories);

  if (!cloudStudy) {
    const result = await supabase
      .from("fude_study_progress")
      .insert({
        user_id: user.id,
        ...studyPayload,
        updated_at: now,
      });

    if (result.error) {
      throwWriteError("progres Ungkapan Praktis dan cerita", result.error.message);
    }
  } else if (studyChanged) {
    const result = await supabase
      .from("fude_study_progress")
      .update({ ...studyPayload, updated_at: now })
      .eq("user_id", user.id)
      .eq("updated_at", cloudStudy.updated_at)
      .select("user_id")
      .maybeSingle();

    if (result.error) {
      throwWriteError("progres Ungkapan Praktis dan cerita", result.error.message);
    }
    if (!result.data) {
      throw new Error(
        "Progres Ungkapan Praktis atau cerita berubah di cloud saat sinkronisasi. Data belum ditimpa; coba sinkronkan ulang."
      );
    }
  }

  const cloudGacha = cloud.gachaData;
  const gachaChanged =
    !cloudGacha ||
    !sameJson(data.gachaData.inventory, cloudGacha.inventory) ||
    !sameJson(data.gachaData.history, cloudGacha.history);

  if (!cloudGacha) {
    const result = await supabase
      .from("fude_gacha_data")
      .insert({
        user_id: user.id,
        inventory: data.gachaData.inventory,
        history: data.gachaData.history,
        updated_at: now,
      });

    if (result.error) {
      throwWriteError("data Gacha", result.error.message);
    }
  } else if (gachaChanged) {
    const result = await supabase
      .from("fude_gacha_data")
      .update({
        inventory: data.gachaData.inventory,
        history: data.gachaData.history,
        updated_at: now,
      })
      .eq("user_id", user.id)
      .eq("updated_at", cloudGacha.updated_at)
      .select("user_id")
      .maybeSingle();

    if (result.error) {
      throwWriteError("data Gacha", result.error.message);
    }
    if (!result.data) {
      throw new Error(
        "Data Gacha berubah di cloud saat sinkronisasi. Inventori dan riwayat tidak ditimpa; coba sinkronkan ulang."
      );
    }
  }
}
