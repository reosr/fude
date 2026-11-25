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

    supabase
      .from("fude_irodori_progress")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle(),

    supabase
      .from("fude_study_progress")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle(),

    supabase
      .from("fude_gacha_data")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle(),
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
  if (irodoriResult.error) {
    throw new Error(`Gagal memeriksa progres Irodori: ${irodoriResult.error.message}`);
  }
  if (studyResult.error) {
    throw new Error(`Gagal memeriksa progres belajar: ${studyResult.error.message}`);
  }
  if (gachaResult.error) {
    throw new Error(`Gagal memeriksa data Gacha: ${gachaResult.error.message}`);
  }

  const hasProfile = profileResult.data !== null;
  const hasLearningProgress = progressResult.data !== null;
  const jlptSetCount = jlptResult.data?.length ?? 0;
  const hasIrodoriProgress = irodoriResult.data !== null;
  const hasStudyProgress = studyResult.data !== null;
  const hasGachaData = gachaResult.data !== null;

  return {
    hasProfile,
    hasLearningProgress,
    jlptSetCount,
    hasIrodoriProgress,
    hasStudyProgress,
    hasGachaData,
    hasAnyData:
      hasProfile ||
      hasLearningProgress ||
      jlptSetCount > 0 ||
      hasIrodoriProgress ||
      hasStudyProgress ||
      hasGachaData,
  };
}