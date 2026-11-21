import { createClient } from "./client";
import { inspectCloudFudeState } from "./cloud-state";
import { getLocalFudeSnapshot } from "./sync";

type MigrationResult =
  | { status: "migrated"; jlpt_sets: number }
  | { status: "already_has_data" };

export async function migrateLocalFudeData(): Promise<MigrationResult> {
  // Pastikan database akun ini masih kosong.
  const cloudState = await inspectCloudFudeState();

  if (cloudState.hasAnyData) {
    return { status: "already_has_data" };
  }

  // Ambil salinan data lokal Fude.
  const snapshot = getLocalFudeSnapshot();

  const supabase = createClient();

  // Kirim data melalui fungsi migrasi yang sudah dibuat di Supabase.
  const { data, error } = await supabase.rpc("fude_migrate_local_data", {
    p_profile: snapshot.profile,
    p_current_bab: snapshot.currentBab,
    p_total_xp: snapshot.totalXp,
    p_xp_rewards: snapshot.xpRewards,
    p_memorized_kanji: snapshot.memorizedKanji,
    p_jlpt_results: snapshot.jlptResults,
  });

  if (error) {
    throw new Error(`Migrasi Fude gagal: ${error.message}`);
  }

  if (!data || typeof data !== "object" || !("status" in data)) {
    throw new Error("Respons migrasi Supabase tidak valid.");
  }

  const result = data as {
    status?: unknown;
    jlpt_sets?: unknown;
  };

  if (result.status === "already_has_data") {
    return { status: "already_has_data" };
  }

  if (result.status === "migrated") {
    return {
      status: "migrated",
      jlpt_sets:
        typeof result.jlpt_sets === "number" ? result.jlpt_sets : 0,
    };
  }

  throw new Error("Status migrasi tidak dikenali.");
}