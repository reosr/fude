import { createClient } from "./client";
import {
  getLocalFudeSnapshot,
  saveGachaSyncBaseline,
} from "./sync";
import { readCloudFudeData } from "./read-cloud";
import { mergeFudeData } from "./merge";
import { applyMergedDataToLocal } from "./apply-local";
import { writeCloudFudeData } from "./write-cloud";

import {
  getProfilePhoto,
  getPendingProfilePhotoChange,
  clearPendingProfilePhotoChange,
  getSyncedProfilePhotoVersion,
  setSyncedProfilePhotoVersion,
  clearSyncedProfilePhotoVersion,
  saveProfilePhotoFromCloud,
  deleteProfilePhotoFromCloudLocal,
} from "../profile-photo";

import {
  uploadProfilePhotoToCloud,
  downloadProfilePhotoFromCloud,
  deleteProfilePhotoFromCloud,
  getCloudProfilePhotoVersion,
} from "./profile-photo-cloud";

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

async function syncProfilePhoto(
  expectedUserId: string
): Promise<void> {
  const pending = getPendingProfilePhotoChange();

  // Upload foto yang baru dipilih pengguna.
  if (pending?.action === "upload") {
    const photo = await getProfilePhoto();

    if (!photo) {
      throw new Error("Foto lokal tidak ditemukan untuk diunggah.");
    }

    await uploadProfilePhotoToCloud(photo, expectedUserId);

    const version = await getCloudProfilePhotoVersion(expectedUserId);

    if (!version) {
      throw new Error("Upload berhasil, tetapi versi foto cloud tidak ditemukan.");
    }

    setSyncedProfilePhotoVersion(version);
    clearPendingProfilePhotoChange(pending.token);
    return;
  }

  // Hapus foto cloud ketika pengguna menghapus fotonya.
  if (pending?.action === "delete") {
    await deleteProfilePhotoFromCloud(expectedUserId);

    clearSyncedProfilePhotoVersion();
    clearPendingProfilePhotoChange(pending.token);
    return;
  }

  const cloudVersion =
    await getCloudProfilePhotoVersion(expectedUserId);

  const localVersion = getSyncedProfilePhotoVersion();
  const localPhoto = await getProfilePhoto();

  // Periksa ulang supaya perubahan baru tidak tertimpa.
  if (getPendingProfilePhotoChange()) return;

  if (!cloudVersion) {
    // Foto sebelumnya pernah tersinkron tetapi sekarang sudah dihapus cloud.
    if (localVersion !== null) {
      await deleteProfilePhotoFromCloudLocal();
      return;
    }

    // Migrasikan foto lokal lama ke cloud.
    if (localPhoto) {
      await uploadProfilePhotoToCloud(
        localPhoto,
        expectedUserId
      );

      const version =
        await getCloudProfilePhotoVersion(expectedUserId);

      if (!version) {
        throw new Error("Versi foto setelah migrasi tidak ditemukan.");
      }

      setSyncedProfilePhotoVersion(version);
    }

    return;
  }

  // Hindari menimpa foto lokal lama yang belum pernah ditautkan ke cloud.
  if (localPhoto && !localVersion) {
    throw new Error(
      "Foto lokal dan foto cloud belum memiliki riwayat sinkronisasi yang sama. Perlu pemeriksaan sebelum memilih foto."
    );
  }

  // Foto sudah sama dan masih tersedia secara lokal.
  if (cloudVersion === localVersion && localPhoto) {
    return;
  }

  const photo = await downloadProfilePhotoFromCloud(expectedUserId);

  if (!photo) {
    throw new Error("Foto cloud tidak ditemukan saat proses download.");
  }

  // Pastikan akun belum berubah.
  const {
    data: { user },
    error,
  } = await createClient().auth.getUser();

  if (error || !user || user.id !== expectedUserId) {
    throw new Error("Akun berubah. Pemulihan foto dibatalkan.");
  }

  // Jangan timpa foto jika pengguna menggantinya saat download berlangsung.
  if (getPendingProfilePhotoChange()) return;

  await saveProfilePhotoFromCloud(photo, cloudVersion);
}

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
  await syncProfilePhoto(user.id);

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

  saveGachaSyncBaseline(merged.gachaData);
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