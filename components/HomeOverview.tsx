"use client";

import { useState, useEffect } from "react";
import { getProgress } from "../lib/progress";
import LevelBadge from "./LevelBadge";

interface BabTitle {
  bab: number | string;
  title?: string;
}

interface HomeOverviewProps {
  babTitles: BabTitle[];
}

export default function HomeOverview({ babTitles }: HomeOverviewProps) {
  const [currentBab, setCurrentBab] = useState<number>(1);
  const [heroBg, setHeroBg] = useState(
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop"
  );

  useEffect(() => {
    setCurrentBab(getProgress());

    const heroImages = [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1200&auto=format&fit=crop",
    ];

    setHeroBg(heroImages[Math.floor(Math.random() * heroImages.length)]);
  }, []);

  const currentBabData = babTitles.find(
    (b) => Number(b.bab) === Number(currentBab)
  );

  return (
    <>
      {/* HERO SECTION */}
      <div className="relative bg-[#1E1D1B] border border-[#33312E] rounded-3xl overflow-hidden shadow-2xl h-64 md:h-80 flex flex-col justify-center px-8 md:px-12">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Japan Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121110] via-[#121110]/80 to-transparent"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-[#EAE6DD] mb-2 font-mincho">
            おかえりなさい
          </h2>
          <p className="text-lg text-[#A3A099] mb-6">
            Selamat datang kembali, Pejuang N1.
          </p>
          <div className="flex gap-3">
            <LevelBadge currentBab={currentBab} />
          </div>
        </div>

        <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-[120px] md:text-[180px] font-mincho font-bold text-[#C93438] opacity-30 pointer-events-none select-none">
          筆
        </div>
      </div>

      {/* KARTU PROGRESS */}
      <div className="bg-gradient-to-br from-[#1E1D1B] to-[#121110] border border-[#C93438]/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C93438]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

        <div className="flex justify-between items-center mb-4 relative z-10">
          <div>
            <p className="text-xs font-bold text-[#C93438] uppercase tracking-wider mb-1">
              Progress Belajar
            </p>
            <h3 className="text-2xl font-bold text-[#EAE6DD]">
              Bab {currentBab}: {currentBabData?.title || "Selesai"}
            </h3>
          </div>

          <a
            href="/belajar"
            className="bg-[#C93438] text-white p-3 rounded-full hover:bg-[#B02A2E] transition-colors"
          >
            <span className="text-xl">›</span>
          </a>
        </div>

        <div className="h-2 bg-[#33312E] rounded-full overflow-hidden relative z-10">
          <div
            className="h-full bg-[#C93438]"
            style={{ width: `${(currentBab / 50) * 100}%` }}
          />
        </div>

        <p className="text-xs text-[#A3A099] mt-3 relative z-10">
          {currentBab} dari 50 Bab telah dibuka
        </p>
      </div>
    </>
  );
}