"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, Play, Square } from "lucide-react";
import storyData from "../../data/stories/n5-01.json";

export default function Baca() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopRef = useRef(false);

  const stopAudio = () => {
    stopRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setActiveIndex(null);
  };

  const playOne = (url: string, index: number) =>
    new Promise<void>((resolve) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      setActiveIndex(index);
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });

  const playAudio = async (url: string, index: number) => {
    stopAudio();
    stopRef.current = false;
    setIsPlaying(true);
    await playOne(url, index);
    setIsPlaying(false);
    setActiveIndex(null);
  };

  const playAll = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    stopAudio();
    stopRef.current = false;
    setIsPlaying(true);

    for (let i = 0; i < storyData.sentences.length; i++) {
      if (stopRef.current) return;
      await playOne(storyData.sentences[i].audioUrl, i);
    }

    setIsPlaying(false);
    setActiveIndex(null);
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <div className="space-y-6 pb-10 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#33312E] pb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#EAE6DD]">Latihan Baca</h2>
          <p className="text-[#A3A099] text-sm mt-1">Level {storyData.level}</p>
        </div>
        <button
          onClick={playAll}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg ${
            isPlaying 
              ? "bg-[#33312E] text-[#EAE6DD] shadow-none" 
              : "bg-[#C93438] text-white hover:bg-[#B02A2E] shadow-[#C93438]/20"
          }`}
        >
          {isPlaying ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          {isPlaying ? "Hentikan" : "Putar Semua"}
        </button>
      </div>

      <div className="bg-[#1E1D1B]/80 backdrop-blur-md border border-[#33312E] rounded-3xl p-5 md:p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-[#EAE6DD] mb-6 font-mincho">
          {storyData.title}
        </h3>

        <div className="space-y-2">
          {storyData.sentences.map((s, i) => (
            <div 
              key={i} 
              className={`group flex items-start gap-4 p-3 -mx-3 rounded-xl transition-all ${
                activeIndex === i ? "bg-[#C93438]/10 border border-[#C93438]/30" : "hover:bg-[#262523] border border-transparent"
              }`}
            >
              <button
                onClick={() => playAudio(s.audioUrl, i)}
                className="shrink-0 w-8 h-8 mt-1 rounded-full bg-[#33312E] flex items-center justify-center text-[#A3A099] group-hover:text-white group-hover:bg-[#C93438] transition-all"
              >
                <Volume2 size={16} />
              </button>
              <div>
                <p className="text-lg md:text-xl text-[#EAE6DD] font-mincho leading-snug">
                  {s.jp}
                </p>
                <p className="text-sm text-[#A3A099] mt-1">
                  {s.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}