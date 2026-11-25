import { createClient } from "./client";
import type { GachaSyncData } from "./sync";
import type { IrodoriRating } from "../irodori-progress";

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
    xp_base: number | string;
    xp_events: {
    id: string;
    amount: number;
    }[];
    memorized_kanji: string[];
    updated_at: string;
  } | null;
  jlptResults: CloudJlptResult[];
  irodoriProgress: {
    completed_lessons: string[];
    self_evaluations: Record<string, Record<string, IrodoriRating>>;
    updated_at: string;
  } | null;
  studyProgress: {
    completed_practical_categories: string[];
    completed_stories: string[];
    updated_at: string;
  } | null;
  gachaData: (GachaSyncData & { updated_at: string }) | null;
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

  const [
    profileResult,
    progressResult,
    jlptResult,
    irodoriResult,
    studyResult,
    gachaResult,
  ] = await Promise.all([
      supabase
        .from("fude_profiles")
        .select("profile, updated_at")
        .eq("user_id", user.id)
        .maybeSingle(),

      supabase
        .from("fude_learning_progress")
        .select(
        "current_bab, total_xp, xp_base, xp_events, xp_rewards, memorized_kanji, updated_at"
        )
        .eq("user_id", user.id)
        .maybeSingle(),

      supabase
        .from("fude_jlpt_results")
        .select("set_id, result, updated_at")
        .eq("user_id", user.id),

      supabase
        .from("fude_irodori_progress")
        .select("completed_lessons, self_evaluations, updated_at")
        .eq("user_id", user.id)
        .maybeSingle(),

      supabase
        .from("fude_study_progress")
        .select("completed_practical_categories, completed_stories, updated_at")
        .eq("user_id", user.id)
        .maybeSingle(),

      supabase
        .from("fude_gacha_data")
        .select("inventory, history, updated_at")
        .eq("user_id", user.id)
        .maybeSingle(),
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

  if (irodoriResult.error) {
    throw new Error(
      `Gagal membaca progres Irodori cloud: ${irodoriResult.error.message}`
    );
  }

  if (studyResult.error) {
    throw new Error(
      `Gagal membaca progres belajar cloud: ${studyResult.error.message}`
    );
  }

  if (gachaResult.error) {
    throw new Error(
      `Gagal membaca data Gacha cloud: ${gachaResult.error.message}`
    );
  }

  return {
    profile:
      profileResult.data?.profile as Record<string, unknown> | null,

    profileUpdatedAt: profileResult.data?.updated_at ?? null,
    progress: progressResult.data,

    jlptResults: jlptResult.data ?? [],
    irodoriProgress: irodoriResult.data,
    studyProgress: studyResult.data,
    gachaData: gachaResult.data as CloudFudeData["gachaData"],
  };
}