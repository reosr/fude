export function getProgress(): number {
  if (typeof window === "undefined") return 1;
  const saved = localStorage.getItem("fude_progress");
  return saved ? parseInt(saved) : 1;
}

export function setProgress(bab: number) {
  if (typeof window !== "undefined") {
    localStorage.setItem("fude_progress", bab.toString());
  }
}