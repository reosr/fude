const SYNC_USER_KEY = "fude_sync_user_id";

export function checkFudeSyncAccount(userId: string): void {
  if (typeof window === "undefined") {
    throw new Error("Pemeriksaan akun hanya bisa dilakukan di browser.");
  }

  const boundUserId = localStorage.getItem(SYNC_USER_KEY);

  if (boundUserId && boundUserId !== userId) {
    throw new Error(
      "Data lokal Fude sudah terhubung ke akun Google lain. Sinkronisasi dihentikan agar data tidak tercampur."
    );
  }
}

export function bindFudeSyncAccount(userId: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(SYNC_USER_KEY, userId);
}

export function getFudeSyncAccount(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(SYNC_USER_KEY);
}