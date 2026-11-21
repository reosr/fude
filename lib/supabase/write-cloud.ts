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
}