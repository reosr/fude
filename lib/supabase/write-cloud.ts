import { createClient } from "./client";
import type { MergedFudeData } from "./merge";

export async function writeCloudFudeData(
  data: MergedFudeData,
  expectedUserId: string
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

  const profileWrite = await supabase
    .from("fude_profiles")
    .upsert(
      {
        user_id: user.id,
        profile,
        updated_at: now,
      },
      { onConflict: "user_id" }
    );

  if (profileWrite.error) {
    throw new Error(
      `Gagal menyimpan profil: ${profileWrite.error.message}`
    );
  }

  const progressWrite = await supabase
    .from("fude_learning_progress")
    .upsert(
      {
        user_id: user.id,
        current_bab: data.currentBab,
        total_xp: data.totalXp,
        xp_base: data.xpBase,
        xp_events: data.xpEvents,
        xp_rewards: data.xpRewards,
        memorized_kanji: data.memorizedKanji,
        updated_at: now,
      },
      { onConflict: "user_id" }
    );

  if (progressWrite.error) {
    throw new Error(
      `Gagal menyimpan progres: ${progressWrite.error.message}`
    );
  }

  if (data.jlptResults.length > 0) {
    const jlptRows = data.jlptResults.map((item) => ({
      user_id: user.id,
      set_id: item.setId,
      result: item.result,
      updated_at: now,
    }));

    const jlptWrite = await supabase
      .from("fude_jlpt_results")
      .upsert(jlptRows, {
        onConflict: "user_id,set_id",
      });

    if (jlptWrite.error) {
      throw new Error(
        `Gagal menyimpan hasil JLPT: ${jlptWrite.error.message}`
      );
    }
  }

  const irodoriWrite = await supabase
    .from("fude_irodori_progress")
    .upsert(
      {
        user_id: user.id,
        completed_lessons: data.irodoriProgress.completedLessons,
        self_evaluations: data.irodoriProgress.selfEvaluations,
        updated_at: now,
      },
      { onConflict: "user_id" }
    );

  if (irodoriWrite.error) {
    throw new Error(
      `Gagal menyimpan progres Irodori: ${irodoriWrite.error.message}`
    );
  }

  const studyWrite = await supabase
    .from("fude_study_progress")
    .upsert(
      {
        user_id: user.id,
        completed_practical_categories:
          data.studyProgress.completedPracticalCategories,
        completed_stories: data.studyProgress.completedStories,
        updated_at: now,
      },
      { onConflict: "user_id" }
    );

  if (studyWrite.error) {
    throw new Error(
      `Gagal menyimpan progres belajar: ${studyWrite.error.message}`
    );
  }

  const gachaWrite = await supabase
    .from("fude_gacha_data")
    .upsert(
      {
        user_id: user.id,
        inventory: data.gachaData.inventory,
        history: data.gachaData.history,
        updated_at: now,
      },
      { onConflict: "user_id" }
    );

  if (gachaWrite.error) {
    throw new Error(
      `Gagal menyimpan data Gacha: ${gachaWrite.error.message}`
    );
  }
}