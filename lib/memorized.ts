const MEMORIZED_KEY = "fude_memorized";

export function getMemorizedKanji(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(MEMORIZED_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return Array.from(
      new Set(parsed.filter((item): item is string => typeof item === "string"))
    );
  } catch (error) {
    console.error("Gagal membaca daftar hafalan:", error);
    return [];
  }
}

export function saveMemorizedKanji(items: string[]): boolean {
  if (typeof window === "undefined") return false;

  const safeItems = Array.from(
    new Set(items.filter((item): item is string => typeof item === "string"))
  );

  try {
    localStorage.setItem(MEMORIZED_KEY, JSON.stringify(safeItems));
    return true;
  } catch (error) {
    console.error("Gagal menyimpan daftar hafalan:", error);
    return false;
  }
}
