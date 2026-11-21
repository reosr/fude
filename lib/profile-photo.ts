const DB_NAME = "fude-profile-assets";
const DB_VERSION = 1;
const STORE_NAME = "assets";
const PHOTO_KEY = "profile-photo";

const PHOTO_UPDATED_KEY = "fude_profile_photo_updated";
const PHOTO_PENDING_KEY = "fude_profile_photo_pending";
const PHOTO_CLOUD_VERSION_KEY = "fude_profile_photo_cloud_version";

export const PROFILE_PHOTO_UPDATED_EVENT = "fude-profile-photo-updated";

export interface PendingProfilePhotoChange {
  action: "upload" | "delete";
  token: string;
}

function notifyProfilePhotoUpdated(): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(PROFILE_PHOTO_UPDATED_EVENT));

  try {
    localStorage.setItem(
      PHOTO_UPDATED_KEY,
      `${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
  } catch (error) {
    console.error("Gagal menyinkronkan perubahan foto profil:", error);
  }
}

function markPhotoPending(action: "upload" | "delete"): void {
  if (typeof window === "undefined") return;

  const change: PendingProfilePhotoChange = {
    action,
    token: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  };

  try {
    localStorage.setItem(
      PHOTO_PENDING_KEY,
      JSON.stringify(change)
    );
  } catch (error) {
    console.error("Gagal mencatat perubahan foto:", error);
  }

  notifyProfilePhotoUpdated();
}

export function getPendingProfilePhotoChange():
  PendingProfilePhotoChange | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(PHOTO_PENDING_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("action" in parsed) ||
      !("token" in parsed)
    ) {
      return null;
    }

    if (
      (parsed.action !== "upload" && parsed.action !== "delete") ||
      typeof parsed.token !== "string"
    ) {
      return null;
    }

    return {
      action: parsed.action,
      token: parsed.token,
    };
  } catch {
    return null;
  }
}

export function clearPendingProfilePhotoChange(token: string): void {
  if (typeof window === "undefined") return;

  try {
    const current = getPendingProfilePhotoChange();

    if (current?.token === token) {
      localStorage.removeItem(PHOTO_PENDING_KEY);
    }
  } catch (error) {
    console.error("Gagal membersihkan penanda foto:", error);
  }
}

export function getSyncedProfilePhotoVersion(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(PHOTO_CLOUD_VERSION_KEY);
  } catch {
    return null;
  }
}

export function setSyncedProfilePhotoVersion(
  version: string
): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(PHOTO_CLOUD_VERSION_KEY, version);
}

export function clearSyncedProfilePhotoVersion(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(PHOTO_CLOUD_VERSION_KEY);
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () =>
      reject(request.error ?? new Error("Gagal membuka database foto."));
  });
}

async function writePhotoBlob(blob: Blob | null): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    if (blob) {
      store.put(blob, PHOTO_KEY);
    } else {
      store.delete(PHOTO_KEY);
    }

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Gagal menyimpan foto."));
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error ?? new Error("Penyimpanan foto dibatalkan."));
    };
  });
}

// Dipanggil ketika pengguna memilih foto sendiri.
export async function saveProfilePhoto(file: File): Promise<void> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran foto maksimal 5 MB.");
  }

  await writePhotoBlob(file);
  markPhotoPending("upload");
}

// Membaca foto dari IndexedDB lokal.
export async function getProfilePhoto(): Promise<Blob | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(PHOTO_KEY);

    request.onsuccess = () => {
      resolve(request.result instanceof Blob ? request.result : null);
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Gagal membaca foto."));
    };

    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

// Dipanggil ketika foto berhasil diunduh dari cloud.
// Tidak membuat penanda upload baru.
export async function saveProfilePhotoFromCloud(
  blob: Blob,
  cloudVersion: string
): Promise<void> {
  await writePhotoBlob(blob);
  setSyncedProfilePhotoVersion(cloudVersion);
  notifyProfilePhotoUpdated();
}

// Dipanggil ketika pengguna menghapus foto lokal akibat perubahan cloud.
// Tidak membuat penanda delete baru.
export async function deleteProfilePhotoFromCloudLocal(): Promise<void> {
  await writePhotoBlob(null);
  clearSyncedProfilePhotoVersion();
  notifyProfilePhotoUpdated();
}

// Dipanggil ketika pengguna menghapus fotonya sendiri.
export async function deleteProfilePhoto(): Promise<void> {
  await writePhotoBlob(null);
  clearSyncedProfilePhotoVersion();
  markPhotoPending("delete");
}