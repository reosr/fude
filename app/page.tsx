"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProgress } from "../lib/progress";
import LevelBadge from "../components/LevelBadge";
import { ArrowRightLeft, BookText, ChevronRight, Award, Flame } from "lucide-react";
import allBabs from "../data/all-bab.json";

export default function Dashboard() {
  const [currentBab, setCurrentBab] = useState<number>(1);

  useEffect(() => {
    setCurrentBab(getProgress());
  }, []);

  const currentBabData = allBabs.find((b: any) => b.bab === currentBab);

  return (
    <div className="space-y-8 pb-10">
            {/* HERO SECTION */}
      <div className="relative bg-[#1E1D1B] border border-[#33312E] rounded-3xl overflow-hidden shadow-2xl h-64 md:h-80 flex flex-col justify-center px-8 md:px-12">
        {/* Background Gambar & Gradasi Kiri ke Kanan */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop" 
            alt="Japanese Wagasa" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121110] via-[#121110]/80 to-transparent"></div>
        </div>

        {/* Konten Hero */}
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-[#EAE6DD] mb-2 font-mincho">
            おかえりなさい
          </h2>
          <p className="text-lg text-[#A3A099] mb-6">Selamat datang kembali, Pejuang N1.</p>
          <div className="flex gap-3">
            <LevelBadge currentBab={currentBab} />
          </div>
        </div>

        {/* Hiasan Kanji Besar di Kanan */}
        <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-[120px] md:text-[180px] font-mincho font-bold text-[#C93438] opacity-30 pointer-events-none select-none">
          筆
        </div>
      </div>

      {/* (Sisa kode kartu progress dan menu cepat ke bawah biarkan sama) */}
      <div className="bg-gradient-to-br from-[#1E1D1B] to-[#121110] border border-[#C93438]/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C93438]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div>
            <p className="text-xs font-bold text-[#C93438] uppercase tracking-wider mb-1">Progress Belajar</p>
            <h3 className="text-2xl font-bold text-[#EAE6DD]">Bab {currentBab}: {currentBabData?.title || "Selesai"}</h3>
          </div>
          <Link 
            href="/belajar"
            className="bg-[#C93438] text-white p-3 rounded-full hover:bg-[#B02A2E] transition-colors"
          >
            <ChevronRight size={24} />
          </Link>
        </div>
        
        <div className="h-2 bg-[#33312E] rounded-full overflow-hidden relative z-10">
          <div 
            className="h-full bg-[#C93438]" 
            style={{ width: `${(currentBab / 50) * 100}%` }}
          />
        </div>
        <p className="text-xs text-[#A3A099] mt-3 relative z-10">{currentBab} dari 50 Bab telah dibuka</p>
      </div>

      {/* Grid Menu Cepat */}
      <div>
        <h3 className="font-bold text-lg text-[#EAE6DD] mb-4">Menu Cepat</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* KARTU MATERI */}
          <Link href="/belajar" className="relative bg-[#1E1D1B] border border-[#33312E] hover:border-[#C93438] rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center transition-all group h-32">
            <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/80 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-[#33312E] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#C93438]/20 transition-colors">
                <Award className="text-[#EAE6DD]" size={20} />
              </div>
              <span className="text-sm font-bold text-[#EAE6DD]">Materi & Kuis</span>
            </div>
          </Link>

          {/* KARTU TERJEMAHAN */}
          <Link href="/terjemahan" className="relative bg-[#1E1D1B] border border-[#33312E] hover:border-[#B8860B] rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center transition-all group h-32">
            <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/80 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-[#33312E] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#B8860B]/20 transition-colors">
                <ArrowRightLeft className="text-[#EAE6DD]" size={20} />
              </div>
              <span className="text-sm font-bold text-[#EAE6DD]">Terjemahan</span>
            </div>
          </Link>

          {/* KARTU BACA */}
          <Link href="/baca" className="relative bg-[#1E1D1B] border border-[#33312E] hover:border-blue-500 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center transition-all group h-32">
            <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/80 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-[#33312E] rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-500/20 transition-colors">
                <BookText className="text-[#EAE6DD]" size={20} />
              </div>
              <span className="text-sm font-bold text-[#EAE6DD]">Latihan Baca</span>
            </div>
          </Link>

          {/* KARTU SOON */}
          <div className="relative bg-[#1E1D1B] border border-[#33312E] rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center opacity-50 cursor-not-allowed h-32">
            <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/90 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-[#33312E] rounded-full flex items-center justify-center mb-2">
                <Flame className="text-[#A3A099]" size={20} />
              </div>
              <span className="text-sm font-bold text-[#A3A099]">Harian</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}