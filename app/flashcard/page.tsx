"use client";

import { useState, useEffect } from "react";
import allBabs from "../../data/all-bab.json";
import { getProgress } from "../../lib/progress";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";

const KanjiStroke = dynamic(() => import("../../components/KanjiStroke"), { ssr: false });

// URL Gambar Statis Tema Jepang
const BG_IMAGE = "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop";

export default function Flashcard() {
  const [deck, setDeck] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const currentBab = getProgress();
    let allVocab: any[] = [];
    
    // Ambil vocab dari bab 1 sampai bab yang lagi dibuka
    allBabs.filter((b: any) => b.bab <= currentBab).forEach((b: any) => {
      allVocab = [...allVocab, ...b.vocab];
    });

    // Acak deck
    const shuffled = allVocab.sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;
  if (deck.length === 0) return <div className="text-center mt-10 text-[#A3A099]">Belum ada kosakata untuk di-flashcard.</div>;

  const currentCard = deck[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
    }, 150);
  };

  return (
    <div className="space-y-6 pb-10 flex flex-col items-center">
      <div className="w-full text-center md:text-left">
        <h2 className="text-3xl font-bold text-[#EAE6DD]">Flashcard</h2>
        <p className="text-[#A3A099] text-sm mt-1">
          Latihan mengingat kosakata. Klik kartu untuk melihat arti dan cara bacanya.
        </p>
      </div>

      <div className="w-full max-w-md flex justify-between items-center text-xs font-bold text-[#A3A099] mt-4">
        <span>KARTU {currentIndex + 1} DARI {deck.length}</span>
        <span className="text-[#C93438]">{Math.round(((currentIndex + 1) / deck.length) * 100)}%</span>
      </div>

      {/* FLASHCARD 3D */}
      <div className="relative w-full max-w-md h-[550px] [perspective:1000px]">
        <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
          
          {/* SISI DEPAN */}
          <div 
            className={`absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#1E1D1B] border-2 border-[#33312E] rounded-3xl flex flex-col items-center justify-center shadow-2xl hover:border-[#C93438]/50 transition-colors overflow-hidden cursor-pointer ${isFlipped ? "pointer-events-none" : ""}`}
            onClick={() => setIsFlipped(true)}
          >
            {/* Background Statis */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
              <img src={BG_IMAGE} alt="" className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-[#1E1D1B]/80 to-transparent"></div>
            </div>

            <span className="text-[10px] font-bold text-[#A3A099] absolute top-6 bg-[#33312E]/80 px-3 py-1 rounded-full z-10 border border-[#33312E]">TEKAN UNTUK BALIK</span>
            <h3 className="relative z-10 font-mincho text-7xl md:text-8xl text-[#EAE6DD] font-bold text-center px-4 leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
              {currentCard.kanji}
            </h3>
          </div>

          {/* SISI BELAKANG */}
          <div 
            className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#1A1918] border-2 border-[#C93438] rounded-3xl flex flex-col items-center justify-center p-6 shadow-2xl overflow-hidden cursor-pointer ${isFlipped ? "" : "pointer-events-none"}`}
            onClick={(e) => {
              // Klik yang berasal dari area KanjiStroke tidak boleh membalik kartu
              if ((e.target as HTMLElement).closest("[data-no-flip]")) return;
              setIsFlipped(false);
            }}
          >
            {/* Background Statis */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
              <img src={BG_IMAGE} alt="" className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-[#1A1918]/90 to-transparent"></div>
            </div>

            {/* Konten Belakang */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
              <div className="text-center w-full mb-4">
                <p className="text-sm text-[#A3A099] mb-1">{currentCard.kana} <span className="opacity-60">({currentCard.romaji})</span></p>
                <p className="text-3xl font-bold text-[#EAE6DD] mt-2 drop-shadow-md">{currentCard.meaning}</p>
              </div>

              {/* Animasi Stroke Order */}
              <div className="w-full flex justify-center mb-4">
                <KanjiStroke kanji={currentCard.kanji} />
              </div>

              <p className="text-[10px] font-bold text-[#A3A099] bg-[#33312E]/80 px-3 py-1 rounded-full mt-2 border border-[#33312E]">
                TEKAN DI LUAR KANJI UNTUK KEMBALI
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="flex items-center gap-6 mt-6">
        <button onClick={prevCard} className="w-14 h-14 rounded-full bg-[#1E1D1B] border border-[#33312E] flex items-center justify-center text-[#EAE6DD] hover:bg-[#262523] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <button onClick={() => setIsFlipped(!isFlipped)} className="px-8 py-4 rounded-full bg-[#C93438] text-white font-bold flex items-center gap-2 hover:bg-[#B02A2E] transition-colors shadow-lg shadow-[#C93438]/20">
          <RotateCcw size={20} />
          Balik Kartu
        </button>
        <button onClick={nextCard} className="w-14 h-14 rounded-full bg-[#1E1D1B] border border-[#33312E] flex items-center justify-center text-[#EAE6DD] hover:bg-[#262523] transition-colors">
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}