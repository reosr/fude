const DB_NAME = "fude-profile-assets";
const DB_VERSION = 1;
const STORE_NAME = "assets";
const PHOTO_KEY = "profile-photo";
const PHOTO_UPDATED_KEY = "fude_profile_photo_updated";

export const PROFILE_PHOTO_UPDATED_EVENT = "fude-profile-photo-updated";

function notifyProfilePhotoUpdated(): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(PROFILE_PHOTO_UPDATED_EVENT));

  // Storage events notify other tabs; the custom event updates this tab.
  try {
    localStorage.setItem(
      PHOTO_UPDATED_KEY,
      `${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
  } catch (error) {
    console.error("Gagal menyinkronkan perubahan foto profil:", error);
  }
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

export async function saveProfilePhoto(file: File): Promise<void> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran foto maksimal 5 MB.");
  }

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).put(file, PHOTO_KEY);

    transaction.oncomplete = () => {
      db.close();
      notifyProfilePhotoUpdated();
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

export async function getProfilePhoto(): Promise<Blob | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction
      .objectStore(STORE_NAME)
      .get(PHOTO_KEY);

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

export async function deleteProfilePhoto(): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).delete(PHOTO_KEY);

    transaction.oncomplete = () => {
      db.close();
      notifyProfilePhotoUpdated();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Gagal menghapus foto."));
    };
  });
}