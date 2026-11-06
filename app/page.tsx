"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Tambahan Link buat pindah halaman
import { getProgress } from "../lib/progress";
import LevelBadge from "../components/LevelBadge";
import { ArrowRightLeft, BookText, ChevronRight, Award, Flame, Trophy } from "lucide-react";
import allBabs from "../data/all-bab.json";


const JLPT_IMAGES: Record<string, string> = {
  N5: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=600&auto=format&fit=crop",
  N4: "https://images.unsplash.com/photo-1533050487297-09b450131914?q=80&w=600&auto=format&fit=crop",
  N3: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=600&auto=format&fit=crop",
  N2: "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=600&auto=format&fit=crop",
  N1: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop",
};

export default function Dashboard() {
  const [currentBab, setCurrentBab] = useState<number>(1);
  const [heroBg, setHeroBg] = useState("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop");

  useEffect(() => {
    setCurrentBab(getProgress());
    const heroImages = [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1200&auto=format&fit=crop",
    ];
    setHeroBg(heroImages[Math.floor(Math.random() * heroImages.length)]);
  }, []);

  const currentBabData = allBabs.find((b: any) => b.bab === currentBab);

  return (
    <div className="space-y-8 pb-10">
      {/* HERO SECTION */}
      <div className="relative bg-[#1E1D1B] border border-[#33312E] rounded-3xl overflow-hidden shadow-2xl h-64 md:h-80 flex flex-col justify-center px-8 md:px-12">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Japan Background" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121110] via-[#121110]/80 to-transparent"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-[#EAE6DD] mb-2 font-mincho">おかえりなさい</h2>
          <p className="text-lg text-[#A3A099] mb-6">Selamat datang kembali, Pejuang N1.</p>
          <div className="flex gap-3"><LevelBadge currentBab={currentBab} /></div>
        </div>
        <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-[120px] md:text-[180px] font-mincho font-bold text-[#C93438] opacity-30 pointer-events-none select-none">筆</div>
      </div>

      {/* KARTU PROGRESS */}
      <div className="bg-gradient-to-br from-[#1E1D1B] to-[#121110] border border-[#C93438]/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C93438]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div>
            <p className="text-xs font-bold text-[#C93438] uppercase tracking-wider mb-1">Progress Belajar</p>
            <h3 className="text-2xl font-bold text-[#EAE6DD]">Bab {currentBab}: {currentBabData?.title || "Selesai"}</h3>
          </div>
          <Link href="/belajar" className="bg-[#C93438] text-white p-3 rounded-full hover:bg-[#B02A2E] transition-colors">
            <ChevronRight size={24} />
          </Link>
        </div>
        <div className="h-2 bg-[#33312E] rounded-full overflow-hidden relative z-10">
          <div className="h-full bg-[#C93438]" style={{ width: `${(currentBab / 50) * 100}%` }} />
        </div>
        <p className="text-xs text-[#A3A099] mt-3 relative z-10">{currentBab} dari 50 Bab telah dibuka</p>
      </div>

      {/* MENU CEPAT */}
      <div>
        <h3 className="font-bold text-lg text-[#EAE6DD] mb-4">Menu Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/belajar" className="relative bg-[#1E1D1B] border border-[#33312E] hover:border-[#C93438] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center transition-all group h-40">
            <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=75&w=400&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/60 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 bg-[#33312E]/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-[#C93438] transition-colors shadow-lg">
                <Award className="text-[#EAE6DD]" size={24} />
              </div>
              <span className="text-sm font-bold text-[#EAE6DD] drop-shadow-md">Materi & Kuis</span>
            </div>
          </Link>

          <Link href="/terjemahan" className="relative bg-[#1E1D1B] border border-[#33312E] hover:border-[#B8860B] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center transition-all group h-40">
            <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=75&w=400&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/60 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 bg-[#33312E]/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-[#B8860B] transition-colors shadow-lg">
                <ArrowRightLeft className="text-[#EAE6DD]" size={24} />
              </div>
              <span className="text-sm font-bold text-[#EAE6DD] drop-shadow-md">Terjemahan</span>
            </div>
          </Link>

          <Link href="/baca" className="relative bg-[#1E1D1B] border border-[#33312E] hover:border-blue-500 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center transition-all group h-40">
            <img src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=75&w=400&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/60 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 bg-[#33312E]/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-500 transition-colors shadow-lg">
                <BookText className="text-[#EAE6DD]" size={24} />
              </div>
              <span className="text-sm font-bold text-[#EAE6DD] drop-shadow-md">Latihan Baca</span>
            </div>
          </Link>

          <div className="relative bg-[#1E1D1B] border border-[#33312E] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center opacity-60 cursor-not-allowed h-40">
            <img src="https://images.unsplash.com/photo-1522383225653-ed111181a951?q=75&w=400&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/80 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 bg-[#33312E] rounded-full flex items-center justify-center mb-3 shadow-lg">
                <Flame className="text-[#A3A099]" size={24} />
              </div>
              <span className="text-sm font-bold text-[#A3A099]">Harian (Soon)</span>
            </div>
          </div>
        </div>
      </div>

      {/* LATIHAN SOAL JLPT */}
      <div className="pt-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-[#B8860B]" size={20} />
          <h3 className="font-bold text-lg text-[#EAE6DD]">Latihan Soal JLPT</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["N5", "N4", "N3", "N2", "N1"].map((level) => (
            // GANTI BUTTON JADI LINK KE HALAMAN BARU
            <Link
              key={level}
              href={`/jlpt/${level}`} 
              className="relative bg-[#1E1D1B] border border-[#33312E] hover:border-[#B8860B] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center transition-all group h-36"
            >
              <img src={JLPT_IMAGES[level]} alt={level} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <span className="relative z-10 text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-[#B8860B] transition-colors">{level}</span>
              <span className="relative z-10 text-[10px] font-bold text-white/80 mt-1 uppercase tracking-widest drop-shadow-md">Latihan Soal</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}