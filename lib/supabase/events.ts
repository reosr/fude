export const FUDE_LOCAL_DATA_CHANGED_EVENT =
  "fude:local-data-changed";

let applyingCloudData = false;

export function notifyFudeLocalDataChanged(key: string): void {
  if (typeof window === "undefined" || applyingCloudData) return;

  window.dispatchEvent(
    new CustomEvent(FUDE_LOCAL_DATA_CHANGED_EVENT, {
      detail: { key },
    })
  );
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