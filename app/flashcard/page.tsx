"use client";

import { useState, useEffect } from "react";
import { getUnlockedVocab } from "../../lib/vocab";
import { getProgress } from "../../lib/progress";
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, CheckCircle2, Eye, EyeOff, X, BookOpen } from "lucide-react";
import dynamic from "next/dynamic";
import FitText from "../../components/FitText";
import verbTypeData from "../../data/verb-type-index.json";
import { buildVerbTypeMap, getVerbType, typeBadgeClass } from "../../components/verbType";

const KanjiStroke = dynamic(() => import("../../components/KanjiStroke"), { ssr: false });

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


export default function Flashcard() {
  const [deck, setDeck] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [memorized, setMemorized] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false); 
  const [swipeDir, setSwipeDir] = useState<"left" | "right">("left"); 
  
  const [imageMap, setImageMap] = useState<Record<string, string>>({});

  const TIMER_FRONT = 5;
  const TIMER_BACK = 7;
  const [timeLeft, setTimeLeft] = useState(TIMER_FRONT * 20); 

  
useEffect(() => {
  let active = true;

  const loadData = async () => {
    try {
      const savedMemorized = JSON.parse(
        localStorage.getItem("fude_memorized") || "[]"
      );

      if (active) {
        setMemorized(savedMemorized);
      }

      const allVocab = await getUnlockedVocab(getProgress());

      if (!active) return;

      const stableOrder = [...allVocab].sort(
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

      const shuffled = [...allVocab]
        .sort(() => Math.random() - 0.5)
        .map((v, i) => ({
          ...v,
          uid: `vocab-${i}`,
        }));

      setDeck(shuffled);
    } catch (error) {
      console.error("Gagal memuat Flashcard:", error);
    } finally {
      if (active) {
        setIsLoaded(true);
      }
    }
  };

  void loadData();

  return () => {
    active = false;
  };
}, []);


  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const filteredDeck = deck.filter(c => !memorized.includes(c.kanji));

  useEffect(() => {
    setTimeLeft((isFlipped ? TIMER_BACK : TIMER_FRONT) * 20);
  }, [currentIndex, isFlipped]);

  useEffect(() => {
    if (!isAutoPlay || isHovered || !isWindowFocused || filteredDeck.length === 0 || isModalOpen || isAdvancing) return;
    if (timeLeft <= 0) return; 

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 50); 

    return () => clearInterval(timer);
  }, [isAutoPlay, isHovered, isWindowFocused, filteredDeck.length, timeLeft === 0, isModalOpen, isAdvancing]);

  useEffect(() => {
    if (timeLeft === 0 && isAutoPlay && !isHovered && isWindowFocused && !isModalOpen && !isAdvancing) {
      if (isFlipped) {
        handleNext();
      } else {
        setIsFlipped(true);
      }
    }
  }, [timeLeft, isAutoPlay, isHovered, isWindowFocused, isModalOpen, isAdvancing]);

  if (!isLoaded) return null;
  if (filteredDeck.length === 0) return (
    <div className="text-center mt-10 text-[#A3A099]">
      {deck.length === 0 ? "Belum ada kosakata." : "Semua kartu sudah kamu hafal! Hebat! 🎉"}
      <br/>
      <button onClick={() => setIsModalOpen(true)} className="mt-4 text-[#C93438] underline">Lihat Daftar Hafalan</button>
    </div>
  );

  const handleNext = () => {
    if (isAdvancing || isRewinding || filteredDeck.length <= 1) return;
    setIsFlipped(false);
    setSwipeDir("left");
    setIsAdvancing(true);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredDeck.length);
      setIsAdvancing(false);
    }, 400);
  };

  const handlePrev = () => {
    if (isAdvancing || isRewinding || filteredDeck.length <= 1) return;
    setIsFlipped(false);
    setSwipeDir("right");
    setIsAdvancing(true);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredDeck.length) % filteredDeck.length);
      setIsAdvancing(false);
      
      setIsRewinding(true);
      setTimeout(() => setIsRewinding(false), 50);
    }, 400);
  };

  const toggleMemorized = () => {
    const currentCard = filteredDeck[currentIndex];
    let newMemorized;
    if (memorized.includes(currentCard.kanji)) {
      newMemorized = memorized.filter(k => k !== currentCard.kanji);
      setMemorized(newMemorized);
      localStorage.setItem("fude_memorized", JSON.stringify(newMemorized));
    } else {
      newMemorized = Array.from(new Set([...memorized, currentCard.kanji]));
      setMemorized(newMemorized);
      localStorage.setItem("fude_memorized", JSON.stringify(newMemorized));
      handleNext(); 
    }
  };

  const removeFromMemorized = (kanji: string) => {
    const newMemorized = memorized.filter(k => k !== kanji);
    setMemorized(newMemorized);
    localStorage.setItem("fude_memorized", JSON.stringify(newMemorized));
  };

  const currentCard = filteredDeck[currentIndex];
  const isMemorized = memorized.includes(currentCard?.kanji);
  const maxTime = (isFlipped ? TIMER_BACK : TIMER_FRONT) * 20;
  const progressWidth = Math.max(0, (timeLeft / maxTime) * 100);

  const stackCards = [];
  for (let i = 0; i < 3; i++) {
    if (filteredDeck.length > i) {
      stackCards.push(filteredDeck[(currentIndex + i) % filteredDeck.length]);
    }
  }

  return (
    <div className="space-y-6 pb-10 flex flex-col items-center relative overflow-hidden">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-20">
        <div>
          <h2 className="text-3xl font-bold text-[#EAE6DD]">Flashcard</h2>
          <p className="text-[#A3A099] text-sm mt-1">
            Latihan mengingat kosakata. Klik kartu untuk melihat arti.
          </p>
        </div>
        
        {memorized.length > 0 && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors bg-[#1E1D1B] text-[#A3A099] border border-[#33312E] hover:text-[#EAE6DD] hover:border-[#C93438]"
          >
            <BookOpen size={16} />
            Daftar Hafalan ({memorized.length})
          </button>
        )}
      </div>

      <div className="w-full max-w-md flex justify-between items-center text-xs font-bold text-[#A3A099] mt-4 relative z-20">
        <span>KARTU {currentIndex + 1} DARI {filteredDeck.length}</span>
        <span className="text-[#C93438]">{Math.round(((currentIndex + 1) / filteredDeck.length) * 100)}%</span>
      </div>

      <div 
        className="relative w-full max-w-md h-[500px] [perspective:1200px] mt-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {stackCards.map((card, i) => {
          const isTop = i === 0;
          const cardImg = imageMap[`${card.kanji}-${card.kana}`] || bgImages[0];
          const verbType = getVerbType(verbTypeMap, card.kanji, card.kana, card.romaji);
          
          let wrapperStyle = "";
          if (i === 0) {
            if (isRewinding) {
              wrapperStyle = "translate-x-[-120%] rotate-[-10deg] opacity-0 scale-100 !transition-none";
            } else if (isAdvancing) {
              if (swipeDir === "left") {
                wrapperStyle = "translate-x-[-120%] rotate-[-10deg] opacity-0 scale-100"; 
              } else {
                wrapperStyle = "translate-y-4 scale-[0.95] brightness-[0.6]"; 
              }
            } else {
              wrapperStyle = "translate-x-0 rotate-0 opacity-100 scale-100";
            }
          } else if (i === 1) {
            wrapperStyle = "translate-y-4 scale-[0.95] brightness-[0.6]";
          } else {
            wrapperStyle = "translate-y-8 scale-[0.90] brightness-[0.3]";
          }

          return (
            <div 
              key={card.uid}
              className={`absolute inset-0 w-full h-full transition-all duration-400 ease-in-out origin-bottom ${wrapperStyle}`}
              style={{ zIndex: 10 - i }}
            >
              <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${(isTop && isFlipped) ? '[transform:rotateY(180deg)]' : ''}`}>
                
                <div 
                  className={`absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#1E1D1B] border-2 border-[#33312E] rounded-3xl flex flex-col items-center justify-center shadow-2xl overflow-hidden ${isTop ? "cursor-pointer hover:border-[#C93438]/50" : "pointer-events-none"} ${(isTop && isFlipped) ? "pointer-events-none" : ""}`}
                  onClick={() => { if (isTop) setIsFlipped(true); }}
                >
                  <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                    <img src={cardImg} alt="Background" className="w-full h-full object-cover opacity-40" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1D1B] via-[#1E1D1B]/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,29,27,0.75)_0%,rgba(30,29,27,0.45)_45%,transparent_75%)]"></div>
                  </div>

                  <span className="text-[10px] font-bold text-[#A3A099] absolute top-6 bg-[#33312E]/80 px-3 py-1 rounded-full z-10 border border-[#33312E]">TEKAN UNTUK BALIK</span>
                  <h3 className="relative z-10 w-full px-6">
                    <FitText
                      maxSize={72}
                      minSize={18}
                      className="font-mincho text-[#EAE6DD] font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
                    >
                      {card.kanji}
                    </FitText>
                  </h3>
                  {verbType && (
                    <span className={`relative z-10 mt-4 text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider backdrop-blur-sm ${typeBadgeClass(verbType)}`}>
                      {verbType}
                    </span>
                  )}
                </div>

                <div 
                  className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#1A1918] border-2 border-[#C93438] rounded-3xl flex flex-col items-center justify-center p-6 shadow-2xl overflow-hidden ${isTop ? "cursor-pointer" : "pointer-events-none"} ${(isTop && isFlipped) ? "" : "pointer-events-none"}`}
                  onClick={(e) => {
                    if (isTop && !(e.target as HTMLElement).closest("[data-no-flip]")) setIsFlipped(false);
                  }}
                >
                  <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                    <img src={cardImg} alt="Background" className="w-full h-full object-cover opacity-30" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-[#1A1918]/90 to-transparent"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,25,24,0.75)_0%,rgba(26,25,24,0.45)_45%,transparent_75%)]"></div>
                  </div>

                  <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                    <div className="text-center w-full mb-4">
                      {verbType && (
                        <span className={`inline-block mb-3 text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider backdrop-blur-sm ${typeBadgeClass(verbType)}`}>
                          {verbType}
                        </span>
                      )}
                      <div className="mb-1">
                        <FitText maxSize={24} minSize={12} className="text-[#EAE6DD] font-mincho drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                          {card.kana}
                        </FitText>
                      </div>
                      <p className="text-sm text-[#A3A099] mb-2 break-words drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">({card.romaji})</p>
                      <p className="text-2xl sm:text-3xl font-bold text-[#C93438] mt-2 break-words leading-snug drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">{card.meaning}</p>
                    </div>

                    <div className="w-full flex justify-center mb-4">
                      {isTop && isWindowFocused ? <KanjiStroke kanji={card.kanji} /> : <div className="h-[120px]"></div>}
                    </div>

                    <p className="text-[10px] font-bold text-[#A3A099] bg-[#33312E]/80 px-3 py-1 rounded-full mt-2 border border-[#33312E]">
                      TEKAN DI LUAR KANJI UNTUK KEMBALI
                    </p>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        <div className="absolute -bottom-6 left-0 right-0 px-4 z-30">
          <div className="h-1.5 bg-[#33312E] rounded-full overflow-hidden w-full">
            <div 
              className="h-full bg-[#C93438]"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full max-w-md mt-12 relative z-20">
        <button onClick={handlePrev} disabled={isAdvancing} className="w-14 h-14 rounded-full bg-[#1E1D1B] border border-[#33312E] flex items-center justify-center text-[#EAE6DD] hover:bg-[#262523] transition-colors disabled:opacity-50">
          <ArrowLeft size={24} />
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAutoPlay(!isAutoPlay)} 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg ${isAutoPlay ? "bg-[#B8860B] text-white shadow-[#B8860B]/20" : "bg-[#262523] text-[#A3A099] border border-[#33312E]"}`}
          >
            {isAutoPlay ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button onClick={() => setIsFlipped(!isFlipped)} className="w-12 h-12 rounded-full bg-[#C93438] text-white flex items-center justify-center hover:bg-[#B02A2E] transition-colors shadow-lg shadow-[#C93438]/20">
            <RotateCcw size={20} />
          </button>

          <button 
            onClick={toggleMemorized}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg ${isMemorized ? "bg-green-600 text-white shadow-green-600/20" : "bg-[#1E1D1B] border border-[#33312E] text-[#A3A099] hover:text-green-500 hover:border-green-500"}`}
          >
            <CheckCircle2 size={20} />
          </button>
        </div>

        <button onClick={handleNext} disabled={isAdvancing} className="w-14 h-14 rounded-full bg-[#1E1D1B] border border-[#33312E] flex items-center justify-center text-[#EAE6DD] hover:bg-[#262523] transition-colors disabled:opacity-50">
          <ArrowRight size={24} />
        </button>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-[#1A1918] border border-[#33312E] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-[#33312E]">
              <div>
                <h3 className="text-xl font-bold text-[#EAE6DD]">Daftar Hafalan</h3>
                <p className="text-xs text-[#A3A099] mt-1">Klik ikon silang jika kamu lupa dan ingin menghafalnya lagi.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#A3A099] hover:text-[#EAE6DD] transition-colors p-2 bg-[#262523] rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-3">
              {deck
                .filter((v, i, self) => memorized.includes(v.kanji) && self.findIndex(t => t.kanji === v.kanji) === i)
                .map((v: any, i: number) => {
                  const modalImage = imageMap[`${v.kanji}-${v.kana}`] || bgImages[0];
                  return (
                    <div key={i} className="relative bg-[#1E1D1B] border border-[#33312E] rounded-xl overflow-hidden p-4 flex flex-col items-center justify-center text-center shadow-lg group min-h-[120px]">
                      <img src={modalImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1E1D1B] via-[#1E1D1B]/80 to-transparent"></div>
                      <button 
                        onClick={() => removeFromMemorized(v.kanji)}
                        className="absolute top-2 right-2 z-20 text-white bg-black/50 hover:bg-red-500 p-1.5 rounded-full transition-colors border border-white/20"
                      >
                        <X size={14} />
                      </button>
                      <div className="relative z-10 w-full mt-2">
                        <p className="font-bold text-2xl text-[#EAE6DD] mb-1 font-mincho">{v.kanji}</p>
                        <p className="text-[10px] text-[#A3A099] mb-2">{v.kana} ({v.romaji})</p>
                        <p className="text-xs font-semibold text-[#C93438]">{v.meaning}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}