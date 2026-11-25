"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Trophy } from "lucide-react";

interface LevelSummary {
  level: string;
  totalSets: number;
  completedSets: number;
}

const LEVELS = ["N5", "N4", "N3", "N2", "N1"];

const LEVEL_DETAILS: Record<string, { subtitle: string; image: string }> = {
  N5: {
    subtitle: "Level dasar · Mulai dari fondasi bahasa Jepang",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=900&auto=format&fit=crop",
  },
  N4: {
    subtitle: "Dasar lanjutan · Perluas pemahaman bahasa Jepang",
    image: "https://images.unsplash.com/photo-1533050487297-09b450131914?q=80&w=900&auto=format&fit=crop",
  },
  N3: {
    subtitle: "Menengah · Gunakan bahasa Jepang lebih mandiri",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=900&auto=format&fit=crop",
  },
  N2: {
    subtitle: "Menengah atas · Pahami bahasa Jepang yang lebih kompleks",
    image: "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=900&auto=format&fit=crop",
  },
  N1: {
    subtitle: "Mahir · Tantang kemampuan bahasa Jepang tingkat tinggi",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=900&auto=format&fit=crop",
  },
};

function getCompletedSetCount(sets: any[]): number {
  return sets.filter((set) => {
    const saved = localStorage.getItem(`jlpt_result_${set.id}`);
    if (!saved) return false;

    try {
      const parsed = JSON.parse(saved);
      const answers = parsed.answers || {};
      const sections = ["vocab", "grammar", "reading", "listening"];
      let correct = 0;
      let total = 0;

      const hasAllAnswers = sections.every((section) => {
        const questions = set.sections?.[section] || [];
        const sectionAnswers = answers[section] || {};

        total += questions.length;
        return questions.every((_question: any, index: number) => {
          const selectedAnswer = sectionAnswers[index];
          const optionCount = questions[index]?.options?.length || 0;

          if (
            Number.isInteger(selectedAnswer) &&
            selectedAnswer >= 0 &&
            selectedAnswer < optionCount
          ) {
            if (selectedAnswer === questions[index]?.answer) correct++;
            return true;
          }

          return false;
        });
      });

      return (
        parsed.completedOnce === true ||
        (hasAllAnswers && total > 0 && (parsed.isFinished === true || correct === total))
      );
    } catch (error) {
      console.error(`Gagal membaca progres set ${set.id}:`, error);
      return false;
    }
  }).length;
}

export default function JLPTPage() {
  const router = useRouter();
  const [summaries, setSummaries] = useState<LevelSummary[]>(
    LEVELS.map((level) => ({ level, totalSets: 0, completedSets: 0 }))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    let jlptLevels: any[] = [];

    const refreshProgress = () => {
      if (!active || jlptLevels.length === 0) return;

      setSummaries(
        LEVELS.map((level) => {
          const levelData = jlptLevels.find(
            (item) => String(item.level).toUpperCase() === level
          );
          const sets = Array.isArray(levelData?.sets) ? levelData.sets : [];

          return {
            level,
            totalSets: sets.length,
            completedSets: getCompletedSetCount(sets),
          };
        })
      );
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key.startsWith("jlpt_result_")) {
        refreshProgress();
      }
    };

    const handleFocus = () => refreshProgress();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refreshProgress();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    const loadData = async () => {
      try {
        // Data dimuat secara dinamis agar tidak masuk ke initial bundle.
        const module = await import("../../data/jlpt.json");
        if (!active) return;

        jlptLevels = module.default as any[];
        refreshProgress();
      } catch (error) {
        console.error("Gagal memuat daftar level JLPT:", error);
        if (active) setLoadError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadData();

    return () => {
      active = false;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      <button
        onClick={() => router.push("/")}
        className="mb-2 flex items-center gap-2 text-sm font-bold text-[#A3A099] transition-colors hover:text-[#EAE6DD]"
      >
        <ArrowLeft size={16} />
        Kembali ke Beranda
      </button>

      <div className="border-b border-[#33312E] pb-6">
        <div className="mb-2 flex items-center gap-3">
          <Trophy className="text-[#B8860B]" size={28} />
          <h2 className="text-3xl font-bold text-[#EAE6DD]">
            Latihan Soal JLPT
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-[#A3A099]">
          Pilih level yang ingin kamu latih. Setiap level memiliki kumpulan soal
          Kosakata, Tata Bahasa, Membaca, dan Mendengar.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-[#A3A099]">
          Memuat level JLPT...
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-[#33312E] bg-[#1E1D1B] py-16 text-center text-sm text-[#A3A099]">
          Gagal memuat data JLPT. Silakan muat ulang halaman.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((summary) => {
            const details = LEVEL_DETAILS[summary.level];
            const percent = summary.totalSets > 0
              ? Math.round((summary.completedSets / summary.totalSets) * 100)
              : 0;

            return (
              <Link
                key={summary.level}
                href={`/jlpt/${summary.level}`}
                className="group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-2xl border border-[#33312E] bg-[#1E1D1B] p-5 transition-all hover:-translate-y-0.5 hover:border-[#B8860B]/70"
              >
                <img
                  src={details.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover opacity-45 transition-all duration-500 group-hover:scale-105 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/75 to-[#121110]/25" />

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-4xl font-black tracking-tight text-white drop-shadow-md transition-colors group-hover:text-[#D9B66D]">
                      {summary.level}
                    </p>
                    <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-white/85">
                      {details.subtitle}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[9px] font-bold tracking-wider text-white/85 backdrop-blur-sm">
                    JLPT
                  </span>
                </div>

                <div className="relative z-10 mt-6">
                  <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-white/85">
                      {summary.totalSets > 0
                        ? `${summary.completedSets}/${summary.totalSets} set selesai`
                        : "Belum ada set latihan"}
                    </span>
                    {summary.totalSets > 0 && (
                      <span className="font-bold tabular-nums text-[#D9B66D]">
                        {percent}%
                      </span>
                    )}
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-black/45">
                    <div
                      className="h-full rounded-full bg-[#B8860B] transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2 text-sm font-bold text-[#D9B66D] transition-transform group-hover:translate-x-1">
                    Lihat Set
                    <PlayCircle size={20} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
