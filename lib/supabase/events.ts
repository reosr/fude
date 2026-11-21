export const FUDE_LOCAL_DATA_CHANGED_EVENT =
  "fude:local-data-changed";

export function notifyFudeLocalDataChanged(key: string): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(FUDE_LOCAL_DATA_CHANGED_EVENT, {
      detail: { key },
    })
  );
}