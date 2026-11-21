import { createClient } from "./client";

export interface CloudJlptResult {
  set_id: string;
  result: Record<string, unknown>;
  updated_at: string;
}

export interface CloudFudeData {
  profile: Record<string, unknown> | null;
  profileUpdatedAt: string | null;
  progress: {
    current_bab: number;
    total_xp: number | string;
    xp_rewards: string[];
    memorized_kanji: string[];
    updated_at: string;
  } | null;
  jlptResults: CloudJlptResult[];
}

export async function readCloudFudeData(): Promise<CloudFudeData> {
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

  const [profileResult, progressResult, jlptResult] =
    await Promise.all([
      supabase
        .from("fude_profiles")
        .select("profile, updated_at")
        .eq("user_id", user.id)
        .maybeSingle(),

      supabase
        .from("fude_learning_progress")
        .select(
          "current_bab, total_xp, xp_rewards, memorized_kanji, updated_at"
        )
        .eq("user_id", user.id)
        .maybeSingle(),

      supabase
        .from("fude_jlpt_results")
        .select("set_id, result, updated_at")
        .eq("user_id", user.id),
    ]);

  if (profileResult.error) {
    throw new Error(
      `Gagal membaca profil cloud: ${profileResult.error.message}`
    );
  }

  if (progressResult.error) {
    throw new Error(
      `Gagal membaca progres cloud: ${progressResult.error.message}`
    );
  }

  if (jlptResult.error) {
    throw new Error(
      `Gagal membaca hasil JLPT cloud: ${jlptResult.error.message}`
    );
  }

  return {
    profile:
      profileResult.data?.profile as Record<string,
      profileUpdatedAt: profileResult.data?.updated_at ?? null, unknown> | null,

    progress: progressResult.data,

    jlptResults: jlptResult.data ?? [],
  };
}