import { createClient } from "./client";
import { getLocalFudeSnapshot } from "./sync";
import { readCloudFudeData } from "./read-cloud";
import { mergeFudeData } from "./merge";
import { applyMergedDataToLocal } from "./apply-local";
import { writeCloudFudeData } from "./write-cloud";

import {
  getPendingSyncChanges,
  clearPendingSyncChanges,
} from "./events";

import {
  getFudeSyncAccount,
  checkFudeSyncAccount,
} from "./account-guard";

export interface FudeSyncReport {
  status: "synced";
  userId: string;
  jlptSets: number;
  syncedAt: string;
}

export async function syncFudeNow(
  expectedUserId: string
): Promise<FudeSyncReport> {
  if (typeof window === "undefined") {
    throw new Error("Sinkronisasi hanya bisa dilakukan di browser.");
  }

  const supabase = createClient();

  // Pastikan pengguna masih login.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Gagal memeriksa akun: ${authError.message}`);
  }

  if (!user) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  if (user.id !== expectedUserId) {
    throw new Error("Akun berubah. Sinkronisasi dibatalkan.");
  }

  // Pastikan perangkat terikat ke akun yang benar.
  const boundUserId = getFudeSyncAccount();

  if (!boundUserId || boundUserId !== user.id) {
    throw new Error(
      "Perangkat belum ditautkan ke akun cloud yang benar."
    );
  }

  checkFudeSyncAccount(user.id);

  // Catat perubahan yang sudah ada sebelum proses dimulai.
  const pendingAtStart = getPendingSyncChanges();

  // Ambil data perangkat dan cloud.
  const local = getLocalFudeSnapshot();
  const cloud = await readCloudFudeData();

  // Periksa kembali akun sebelum menerapkan perubahan.
  const {
    data: { user: currentUser },
    error: currentAuthError,
  } = await supabase.auth.getUser();

  if (currentAuthError || !currentUser || currentUser.id !== user.id) {
    throw new Error(
      "Sesi akun berubah selama proses. Sinkronisasi dibatalkan."
    );
  }

  // Gabungkan data menggunakan aturan keamanan Fude.
  const merged = mergeFudeData(
    local,
    cloud,
    pendingAtStart
  );

  // Terapkan hasil merge ke penyimpanan lokal.
  applyMergedDataToLocal(merged);

  // Simpan hasil penggabungan ke Supabase.
  await writeCloudFudeData(merged, user.id);

  // Hanya hapus penanda perubahan yang benar-benar sudah dikirim.
  clearPendingSyncChanges(pendingAtStart);

  return {
    status: "synced",
    userId: user.id,
    jlptSets: merged.jlptResults.length,
    syncedAt: new Date().toISOString(),
  };
}