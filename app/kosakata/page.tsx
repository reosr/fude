"use client";

import allBabs from "../../data/all-bab.json";
import { useState, useEffect, useRef } from "react";
import { getProgress } from "../../lib/progress";
import { Search, X, Volume2 } from "lucide-react";
import dynamic from "next/dynamic";

const KanjiStroke = dynamic(() => import("../../components/KanjiStroke"), { ssr: false });

// Kumpulan gambar tema Jepang dari Unsplash (30 Gambar)
const bgImages = [
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554797589-7241bb691973?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533050487297-09b450131914?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512418490979-92798cec1380?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528164344705-47542687000d?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493857671505-72967e2e2760?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532236204992-f5e85c024202?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554797589-7241bb691973?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=75&w=400&auto=format&fit=crop"
];

export default function Kosakata() {
  const [currentBab, setCurrentBab] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedWord, setSelectedWord] = useState<any | null>(null);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Load progress & Bikin Map Gambar (Sistem Shuffle Pool)
  useEffect(() => {
    const progress = getProgress();
    setCurrentBab(progress);
    setIsLoaded(true);

    // Kumpulkan semua vocab dari bab 1 sampai bab sekarang
    let allVocab: any[] = [];
    allBabs.filter((b: any) => b.bab <= progress).forEach((b: any) => {
      allVocab = [...allVocab, ...b.vocab];
    });

    // Sistem Shuffle Pool
    let currentPool = [...bgImages].sort(() => Math.random() - 0.5);
    let poolIndex = 0;
    const newMap: Record<string, string> = {};

    allVocab.forEach((v) => {
      if (poolIndex >= currentPool.length) {
        // Kalau gambar udah habis, kocok ulang
        currentPool = [...bgImages].sort(() => Math.random() - 0.5);
        poolIndex = 0;
      }
      // Simpan gambar berdasarkan gabungan kanji+kana
      newMap[`${v.kanji}-${v.kana}`] = currentPool[poolIndex];
      poolIndex++;
    });

    setImageMap(newMap);
  }, []);

  // 2. Cleanup audio
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const playVocab = (kana: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(`/audio/vocab/${encodeURIComponent(kana)}.mp3`);
    audioRef.current = audio;
    audio.play().catch(() => {});
  };

  if (!isLoaded) return null;

  const allVocab = allBabs
    .filter((b: any) => b.bab <= currentBab)
    .flatMap((b: any) => b.vocab.map((v: any) => ({ ...v, bab: b.bab })));

  const filteredVocab = allVocab.filter(
    (v) =>
      v.kanji.includes(search) ||
      v.kana.includes(search) ||
      v.romaji.toLowerCase().includes(search.toLowerCase()) ||
      v.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#EAE6DD]">Daftar Kosakata</h2>
          <p className="text-[#A3A099] text-sm mt-1">
            Total {allVocab.length} kata dari {currentBab} bab yang sudah kamu pelajari.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-[#A3A099]" />
        </div>
        
        <input
          type="text"
          placeholder="Cari kanji, kana, romaji, atau arti..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1E1D1B]/80 border border-[#33312E] text-[#EAE6DD] rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:border-[#C93438] focus:ring-1 focus:ring-[#C93438] transition-all"
        />

        {search.length > 0 && (
          <button
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#A3A099] hover:text-[#EAE6DD] transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredVocab.map((v, i) => {
          const kanjiLength = v.kanji.length;
          const kanjiSize = kanjiLength > 5 ? "text-lg" : kanjiLength > 3 ? "text-2xl" : "text-3xl md:text-4xl";
          const cardImage = imageMap[`${v.kanji}-${v.kana}`] || bgImages[0];

          return (
            <div 
              key={i} 
              onClick={() => setSelectedWord(v)}
              className="relative bg-[#1E1D1B] border border-[#33312E] rounded-xl overflow-hidden shadow-xl flex group cursor-pointer hover:border-[#C93438]/50 transition-colors h-[110px]"
            >
              <img 
                src={cardImage} 
                alt="Japanese Theme" 
                loading="lazy" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1E1D1B]/80 to-[#1E1D1B]"></div>
              
              <div className="relative z-10 flex w-full h-full">
                <div className="w-[35%] flex items-center justify-center p-2 shrink-0 overflow-hidden">
                  <p className={`font-mincho ${kanjiSize} text-[#EAE6DD] font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] group-hover:text-[#C93438] transition-colors whitespace-nowrap text-center`}>
                    {v.kanji}
                  </p>
                </div>
                
                <div className="w-[65%] p-4 flex flex-col justify-center">
                  <span className="absolute top-3 right-3 text-[10px] font-bold text-[#A3A099] bg-[#33312E]/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-[#33312E]/50">
                    Bab {v.bab}
                  </span>
                  
                  <p className="text-xs text-[#A3A099] mb-1 mt-2 line-clamp-1">
                    {v.kana} <span className="opacity-60">({v.romaji})</span>
                  </p>
                  
                  <p className="text-sm font-bold text-[#EAE6DD] leading-snug line-clamp-2">
                    {v.meaning}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredVocab.length === 0 && (
          <div className="col-span-full text-center py-10 text-[#A3A099]">
            Tidak ada kosakata yang cocok dengan pencarian "{search}".
          </div>
        )}
      </div>

      {/* MODAL DETAIL KOSAKATA */}
      {selectedWord && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedWord(null)}
        >
          <div 
            className="bg-[#1A1918] border border-[#33312E] rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="flex justify-between items-center p-5 border-b border-[#33312E] sticky top-0 bg-[#1A1918]/90 backdrop-blur-md z-20">
              <span className="text-xs font-bold text-[#C93438] bg-[#C93438]/10 px-2 py-1 rounded-md border border-[#C93438]/20">
                Bab {selectedWord.bab}
              </span>
              <button 
                onClick={() => setSelectedWord(null)}
                className="text-[#A3A099] hover:text-[#EAE6DD] transition-colors p-1 bg-[#262523] rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative p-8 pt-10 text-center min-h-[400px] flex flex-col justify-center">
              
              {/* BACKGROUND GAMBAR & GRADASI DI MODAL */}
              <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <img 
                  src={imageMap[`${selectedWord.kanji}-${selectedWord.kana}`] || bgImages[0]} 
                  alt="Background" 
                  className="w-full h-full object-cover opacity-20" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-[#1A1918]/90 to-transparent"></div>
              </div>

              {/* KONTEN MODAL (Z-10 biar di atas gradasi) */}
              <div className="relative z-10 w-full">
                <h3 className="font-mincho text-6xl text-[#EAE6DD] mb-3">{selectedWord.kanji}</h3>
                <p className="text-xl text-[#A3A099] mb-1">{selectedWord.kana}</p>
                <p className="text-base text-[#B8860B] font-medium mb-6">{selectedWord.romaji}</p>
                
                <div className="bg-[#262523]/80 backdrop-blur-sm rounded-xl p-5 mb-6 shadow-inner border border-[#33312E]/50">
                  <p className="text-xl font-bold text-[#EAE6DD]">{selectedWord.meaning}</p>
                </div>

                <KanjiStroke kanji={selectedWord.kanji} />

                <div className="flex gap-3 justify-center mt-6">
                  <button
                    onClick={() => playVocab(selectedWord.kana)}
                    className="w-full flex items-center justify-center gap-2 bg-[#C93438] text-white font-bold py-4 rounded-xl hover:bg-[#B02A2E] transition-colors shadow-lg shadow-[#C93438]/20"
                  >
                    <Volume2 size={20} />
                    Dengar Suara
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}