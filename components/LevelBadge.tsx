"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import {
  getFudeXp,
  getLevelInfo,
  XP_UPDATED_EVENT,
} from "../lib/gamification";

interface LevelBadgeProps {
  currentBab: number;
}

export default function LevelBadge({ currentBab }: LevelBadgeProps) {
  const [levelInfo, setLevelInfo] = useState(() => getLevelInfo(0));

  useEffect(() => {
    const updateLevel = () => {
      setLevelInfo(getLevelInfo(getFudeXp()));
    };

    updateLevel();

    window.addEventListener(XP_UPDATED_EVENT, updateLevel);
    window.addEventListener("storage", updateLevel);

    return () => {
      window.removeEventListener(XP_UPDATED_EVENT, updateLevel);
      window.removeEventListener("storage", updateLevel);
    };
  }, []);

  const jlptLevel = currentBab <= 25 ? "N5" : "N4";

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-[#C93438]/20 to-[#B8860B]/20 border border-[#C93438]/30 px-3 py-1.5 rounded-full shadow-sm">
      <Shield size={14} className="text-[#C93438]" />
      <span className="text-xs font-bold text-[#EAE6DD] tracking-wide">
        {levelInfo.rank} • LVL {levelInfo.level}
      </span>
      <span className="w-1 h-1 bg-[#A3A099] rounded-full" />
      <span className="text-xs font-bold text-[#B8860B]">
        {jlptLevel}
      </span>
    </div>
  );
}