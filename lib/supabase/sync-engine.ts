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

let activeSync: Promise<FudeSyncReport> | null = null;
let syncAgainRequested = false;

async function performSync(
  expectedUserId: string
): Promise<FudeSyncReport> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Gagal memeriksa akun: ${authError.message}`);
  }

  if (!user || user.id !== expectedUserId) {
    throw new Error("Akun berubah. Sinkronisasi dibatalkan.");
  }

  if (getFudeSyncAccount() !== user.id) {
    throw new Error("Perangkat belum tertaut ke akun ini.");
  }

  checkFudeSyncAccount(user.id);

  // Baca cloud terlebih dahulu.
  const cloud = await readCloudFudeData();

  // Pastikan sesi masih sama setelah membaca cloud.
  const {
    data: { user: currentUser },
    error: currentAuthError,
  } = await supabase.auth.getUser();

  if (
    currentAuthError ||
    !currentUser ||
    currentUser.id !== user.id
  ) {
    throw new Error("Sesi berubah. Sinkronisasi dibatalkan.");
  }

  // Ambil snapshot terbaru setelah proses baca cloud selesai.
  const pending = getPendingSyncChanges();
  const local = getLocalFudeSnapshot();

  const merged = mergeFudeData(local, cloud, pending);

  // Terapkan hasil merge secara sinkron.
  applyMergedDataToLocal(merged);

  // Kirim hasil merge ke akun yang sama.
  await writeCloudFudeData(merged, user.id);

  // Jangan hapus penanda jika akun berubah.
  const {
    data: { user: finalUser },
    error: finalAuthError,
  } = await supabase.auth.getUser();

  if (
    finalAuthError ||
    !finalUser ||
    finalUser.id !== user.id
  ) {
    throw new Error(
      "Sesi berubah setelah pengiriman. Penanda perubahan tetap dipertahankan."
    );
  }

  clearPendingSyncChanges(pending);

  return {
    status: "synced",
    userId: user.id,
    jlptSets: merged.jlptResults.length,
    syncedAt: new Date().toISOString(),
  };
}

export async function syncFudeNow(
  expectedUserId: string
): Promise<FudeSyncReport> {
  // Cegah dua proses sinkronisasi berjalan bersamaan.
  if (activeSync) {
    syncAgainRequested = true;
    return activeSync;
  }

  const runLoop = async (): Promise<FudeSyncReport> => {
    let report: FudeSyncReport;

    do {
      syncAgainRequested = false;
      report = await performSync(expectedUserId);
    } while (syncAgainRequested);

    return report;
  };

  const task = runLoop();
  activeSync = task;

  try {
    return await task;
  } finally {
    if (activeSync === task) {
      activeSync = null;
    }
  }
}