export const FUDE_LOCAL_DATA_CHANGED_EVENT =
  "fude:local-data-changed";

const PENDING_SYNC_KEY = "fude_sync_pending";

export interface PendingSyncChange {
  key: string;
  updatedAt: number;
}

let applyingCloudData = false;

function readPendingChanges(): Record<string, number> {
  try {
    const raw = localStorage.getItem(PENDING_SYNC_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);

    if (
      parsed === null ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([key, value]) =>
          typeof key === "string" &&
          typeof value === "number" &&
          Number.isSafeInteger(value)
      )
    );
  } catch {
    return {};
  }
}

export function notifyFudeLocalDataChanged(key: string): void {
  if (
    typeof window === "undefined" ||
    applyingCloudData
  ) {
    return;
  }

  try {
    const pending = readPendingChanges();

    pending[key] = Math.max(
      Date.now(),
      (pending[key] ?? 0) + 1
    );

    localStorage.setItem(
      PENDING_SYNC_KEY,
      JSON.stringify(pending)
    );
  } catch (error) {
    console.error("Gagal mencatat perubahan sinkronisasi:", error);
  }

  window.dispatchEvent(
    new CustomEvent(FUDE_LOCAL_DATA_CHANGED_EVENT, {
      detail: { key },
    })
  );
}

export function getPendingSyncChanges(): PendingSyncChange[] {
  if (typeof window === "undefined") return [];

  return Object.entries(readPendingChanges()).map(
    ([key, updatedAt]) => ({
      key,
      updatedAt,
    })
  );
}

export function clearPendingSyncChanges(
  sentChanges: PendingSyncChange[]
): void {
  if (typeof window === "undefined" || sentChanges.length === 0) {
    return;
  }

  try {
    const pending = readPendingChanges();

    for (const change of sentChanges) {
      // Jangan hapus penanda yang sudah diperbarui lagi
      // ketika proses upload sedang berjalan.
      if (pending[change.key] === change.updatedAt) {
        delete pending[change.key];
      }
    }

    localStorage.setItem(
      PENDING_SYNC_KEY,
      JSON.stringify(pending)
    );
  } catch (error) {
    console.error("Gagal memperbarui penanda sinkronisasi:", error);
  }
}

export function applyCloudData<T>(callback: () => T): T {
  const previous = applyingCloudData;
  applyingCloudData = true;

  try {
    return callback();
  } finally {
    applyingCloudData = previous;
  }
}