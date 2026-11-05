import { Shield } from "lucide-react";

interface LevelBadgeProps {
  currentBab: number;
}

export default function LevelBadge({ currentBab }: LevelBadgeProps) {
  const jlptLevel = currentBab <= 25 ? "N5" : "N4";
  const gameLevel = Math.ceil(currentBab / 5) || 1;

  // LOGIKA GELAR JEPANG
  let title = "Kenshi"; // Level 1-3
  if (gameLevel >= 4 && gameLevel <= 6) title = "Samurai";
  if (gameLevel >= 7) title = "Shogun";

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-[#C93438]/20 to-[#B8860B]/20 border border-[#C93438]/30 px-3 py-1.5 rounded-full shadow-sm">
      <Shield size={14} className="text-[#C93438]" />
      <span className="text-xs font-bold text-[#EAE6DD] tracking-wide">
        {title} • LVL {gameLevel}
      </span>
      <span className="w-1 h-1 bg-[#A3A099] rounded-full"></span>
      <span className="text-xs font-bold text-[#B8860B]">
        {jlptLevel}
      </span>
    </div>
  );
}