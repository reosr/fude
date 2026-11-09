"use client";

import { getUnlockedVocab, type VocabItem } from "../../lib/vocab";
import { useState, useEffect, useRef } from "react";
import { getProgress } from "../../lib/progress";
import { getMemorizedKanji } from "../../lib/memorized";
import { Search, X, Volume2 } from "lucide-react";
import dynamic from "next/dynamic";
import FitText from "../../components/FitText";
import verbTypeData from "../../data/verb-type-index.json";
import { buildVerbTypeMap, getVerbType, typeBadgeClass } from "../../components/verbType";

const KanjiStroke = dynamic(() => import("../../components/KanjiStroke"), { ssr: false });
const KanaStroke = dynamic(() => import("../../components/KanaStroke"), { ssr: false });

const verbTypeMap = buildVerbTypeMap(verbTypeData);

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
  const [allVocab, setAllVocab] = useState<VocabItem[]>([]);
  const [currentBab, setCurrentBab] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedWord, setSelectedWord] = useState<any | null>(null);
  const [memorized, setMemorized] = useState<string[]>([]);
  const [memFilter, setMemFilter] = useState<"all" | "belum" | "sudah">("all");
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
  let active = true;

  const loadData = async () => {
    const progress = getProgress();

    setCurrentBab(progress);

    setMemorized(getMemorizedKanji());

    try {
      const rawVocab = await getUnlockedVocab(progress);

      if (!active) return;

      setAllVocab(rawVocab);

      const stableOrder = [...rawVocab].sort(
        (a, b) => a.kanji.localeCompare(b.kanji)
      );

      let currentPool = [...bgImages].sort(
        () => Math.random() - 0.5
      );

      let poolIndex = 0;
      const newMap: Record<string, string> = {};

      stableOrder.forEach((v) => {
        if (poolIndex >= currentPool.length) {
          currentPool = [...bgImages].sort(
            () => Math.random() - 0.5
          );
          poolIndex = 0;
        }

        newMap[`${v.kanji}-${v.kana}`] = currentPool[poolIndex];
        poolIndex++;
      });

      setImageMap(newMap);
    } catch (error) {
      console.error("Gagal memuat kosakata:", error);
    } finally {
      if (active) setIsLoaded(true);
    }
  };

  void loadData();

  return () => {
    active = false;
  };
}, []);

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


  const memorizedCount = allVocab.filter((v) => memorized.includes(v.kanji)).length;
  const notMemorizedCount = allVocab.length - memorizedCount;

  const filteredVocab = allVocab.filter(
    (v) =>
      (memFilter === "all" ||
        (memFilter === "sudah" ? memorized.includes(v.kanji) : !memorized.includes(v.kanji))) &&
      (v.kanji.includes(search) ||
        v.kana.includes(search) ||
        v.romaji.toLowerCase().includes(search.toLowerCase()) ||
        v.meaning.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedVerbType = selectedWord
    ? getVerbType(verbTypeMap, selectedWord.kanji, selectedWord.kana, selectedWord.romaji)
    : undefined;

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

      {/* FILTER HAFALAN */}
      <div className="flex flex-wrap gap-2">
        {([
          { key: "all", label: "Semua", count: allVocab.length },
          { key: "belum", label: "Belum hafal", count: notMemorizedCount },
          { key: "sudah", label: "Sudah hafal", count: memorizedCount },
        ] as const).map((f) => (
          <button
            key={f.key}
            onClick={() => setMemFilter(f.key)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
              memFilter === f.key
                ? "bg-[#C93438] border-[#C93438] text-white"
                : "bg-[#1E1D1B]/80 border-[#33312E] text-[#A3A099] hover:text-[#EAE6DD]"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredVocab.map((v, i) => {
          const kanjiLength = v.kanji.length;
          // kata panjang dapat kolom kiri lebih lebar
          const kanjiColWidth = kanjiLength > 5 ? "w-[48%]" : kanjiLength > 3 ? "w-[40%]" : "w-[35%]";
          const cardImage = imageMap[`${v.kanji}-${v.kana}`] || bgImages[0];
          const verbType = getVerbType(verbTypeMap, v.kanji, v.kana, v.romaji);

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
                <div className={`${kanjiColWidth} flex flex-col items-center justify-center gap-1.5 px-3 py-2 shrink-0 overflow-hidden`}>
                  <FitText
                    maxSize={36}
                    minSize={12}
                    className="font-mincho text-[#EAE6DD] font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] group-hover:text-[#C93438] transition-colors"
                  >
                    {v.kanji}
                  </FitText>
                  {verbType && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider backdrop-blur-sm ${typeBadgeClass(verbType)}`}>
                      {verbType}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 py-3 pr-4 pl-1 flex flex-col justify-center">
                  <span className="absolute top-3 right-3 text-[10px] font-bold text-[#A3A099] bg-[#33312E]/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-[#33312E]/50">
                    Bab {v.bab}
                  </span>
                  
                  <p className="text-xs text-[#EAE6DD]/80 mt-3 truncate">{v.kana}</p>
                  <p className="text-[10px] text-[#A3A099] mb-1 truncate">({v.romaji})</p>
                  
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
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#C93438] bg-[#C93438]/10 px-2 py-1 rounded-md border border-[#C93438]/20">
                  Bab {selectedWord.bab}
                </span>
                {selectedVerbType && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-md border uppercase tracking-wider ${typeBadgeClass(selectedVerbType)}`}>
                    {selectedVerbType}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setSelectedWord(null)}
                className="text-[#A3A099] hover:text-[#EAE6DD] transition-colors p-1 bg-[#262523] rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative p-8 pt-10 text-center min-h-[400px] flex flex-col justify-center">
              
              <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <img 
                  src={imageMap[`${selectedWord.kanji}-${selectedWord.kana}`] || bgImages[0]} 
                  alt="Background" 
                  className="w-full h-full object-cover opacity-20" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-[#1A1918]/90 to-transparent"></div>
              </div>

              <div className="relative z-10 w-full">
                <h3 className="mb-3 px-6">
                  <FitText maxSize={60} minSize={20} className="font-mincho text-[#EAE6DD]">
                    {selectedWord.kanji}
                  </FitText>
                </h3>
                <p className="text-xl text-[#A3A099] mb-1">{selectedWord.kana}</p>
                <p className="text-base text-[#B8860B] font-medium mb-6">{selectedWord.romaji}</p>
                
                <div className="bg-[#262523]/80 backdrop-blur-sm rounded-xl p-5 mb-6 shadow-inner border border-[#33312E]/50">
                  <p className="text-xl font-bold text-[#EAE6DD]">{selectedWord.meaning}</p>
                </div>

                <KanjiStroke kanji={selectedWord.kanji} />
                <KanaStroke kana={selectedWord.kana} />

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