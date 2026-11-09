const PROGRESS_KEY = "fude_progress";

export function getProgress(): number {
  if (typeof window === "undefined") return 1;

  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved === null || !/^\d+$/.test(saved)) return 1;

    const progress = Number(saved);

    return Number.isSafeInteger(progress) && progress >= 1
      ? progress
      : 1;
  } catch {
    return 1;
  }
}

export function setProgress(bab: number): void {
  if (typeof window === "undefined") return;
  if (!Number.isSafeInteger(bab) || bab < 1) return;

  try {
    localStorage.setItem(PROGRESS_KEY, String(bab));
  } catch {
    // Progres tetap bisa dibaca dari state halaman selama sesi berjalan.
  }
}
