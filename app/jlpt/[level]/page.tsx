"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import jlptData from "../../../data/jlpt.json";
import { ArrowLeft, PlayCircle, Trophy, CheckCircle2 } from "lucide-react";

export default function JLPTLevelPage() {
  const params = useParams();
  const router = useRouter();
  const level = params.level as string; 
  const levelData = jlptData.find((j: any) => j.level === level);
  
  // State buat nyimpen skor dari localStorage
  const [results, setResults] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!levelData) return;
    const newResults: Record<string, number> = {};
    
    levelData.sets?.forEach((set: any) => {
      const saved = localStorage.getItem(`jlpt_result_${set.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.answers) {
            let correct = 0;
            let total = 0;
            ["vocab", "grammar", "reading", "listening"].forEach(sec => {
              const qs = set.sections[sec] || [];
              total += qs.length;
              qs.forEach((q: any, i: number) => {
                if (parsed.answers[sec]?.[i] === q.answer) correct++;
              });
            });
            newResults[set.id] = total === 0 ? 0 : Math.round((correct / total) * 100);
          }
        } catch (e) {}
      }
    });
    setResults(newResults);
  }, [levelData]);

  if (!levelData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-[#EAE6DD] mb-4">Level tidak ditemukan</h2>
        <Link href="/" className="text-[#C93438] hover:underline">Kembali ke Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <button 
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-sm font-bold text-[#A3A099] hover:text-[#EAE6DD] transition-colors mb-4"
      >
        <ArrowLeft size={16} /> Kembali ke Home
      </button>

      <div className="border-b border-[#33312E] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="text-[#B8860B]" size={28} />
          <h2 className="text-3xl font-bold text-[#EAE6DD]">Simulasi JLPT {level}</h2>
        </div>
        <p className="text-[#A3A099] text-sm">
          Pilih set ujian di bawah ini. Setiap set terdiri dari Kosakata, Grammar, Membaca, dan Mendengar.
        </p>
      </div>

      <div className="space-y-4">
        {levelData.sets && levelData.sets.length > 0 ? (
          levelData.sets.map((set: any, index: number) => {
            const hasResult = results[set.id] !== undefined;
            
            return (
              <Link
                key={set.id}
                href={`/jlpt/${level}/${set.id}`}
                className="w-full block text-left bg-[#1E1D1B] border border-[#33312E] hover:border-[#C93438] rounded-2xl p-6 transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <h3 className="text-xl font-bold text-[#EAE6DD] group-hover:text-[#C93438] transition-colors mb-2">
                    {set.title || `Set Ujian ${index + 1}`}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs font-bold text-[#A3A099]">
                    <span className="bg-[#262523] px-2 py-1 rounded">{set.sections?.vocab?.length || 0} Vocab</span>
                    <span className="bg-[#262523] px-2 py-1 rounded">{set.sections?.grammar?.length || 0} Grammar</span>
                    <span className="bg-[#262523] px-2 py-1 rounded">{set.sections?.reading?.length || 0} Reading</span>
                    <span className="bg-[#262523] px-2 py-1 rounded">{set.sections?.listening?.length || 0} Listening</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* TAMPILIN SKOR KALO UDAH PERNAH NGERJAIN */}
                  {hasResult && (
                    <div className="flex items-center gap-2 bg-[#B8860B]/10 border border-[#B8860B]/30 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 size={16} className="text-[#B8860B]" />
                      <span className="text-sm font-bold text-[#B8860B]">Skor: {results[set.id]}%</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-[#C93438] font-bold group-hover:translate-x-1 transition-transform whitespace-nowrap">
                    {hasResult ? "Lihat Hasil" : "Mulai Ujian"} <PlayCircle size={24} />
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-16 bg-[#1E1D1B] border border-[#33312E] rounded-2xl">
            <p className="text-[#A3A099]">Belum ada set ujian untuk level {level}.</p>
          </div>
        )}
      </div>
    </div>
  );
}