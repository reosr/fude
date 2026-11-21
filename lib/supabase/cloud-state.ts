import { createClient } from "./client";

export async function inspectCloudFudeState() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Gagal memeriksa login: ${authError.message}`);
  }

  if (!user) {
    throw new Error("Belum login ke akun Fude.");
  }

  const [profileResult, progressResult, jlptResult] = await Promise.all([
    supabase
      .from("fude_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle(),

    supabase
      .from("fude_learning_progress")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle(),

    supabase
      .from("fude_jlpt_results")
      .select("set_id")
      .eq("user_id", user.id),
  ]);

  if (profileResult.error) {
    throw new Error(`Gagal memeriksa profil: ${profileResult.error.message}`);
  }

  if (progressResult.error) {
    throw new Error(`Gagal memeriksa progres: ${progressResult.error.message}`);
  }

  if (jlptResult.error) {
    throw new Error(`Gagal memeriksa hasil JLPT: ${jlptResult.error.message}`);
  }

  const hasProfile = profileResult.data !== null;
  const hasLearningProgress = progressResult.data !== null;
  const jlptSetCount = jlptResult.data?.length ?? 0;

  return {
    hasProfile,
    hasLearningProgress,
    jlptSetCount,
    hasAnyData: hasProfile || hasLearningProgress || jlptSetCount > 0,
  };
}