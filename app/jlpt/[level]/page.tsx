"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  PlayCircle,
  Trophy,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

interface SetResult {
  score: number;
  hasAnswers: boolean;
  isFinished: boolean;
  isPerfect: boolean;
  completedOnce: boolean;
}

const SECTIONS = ["vocab", "grammar", "reading", "listening"];

export default function JLPTLevelPage() {
  const params = useParams();
  const router = useRouter();
  const level = String(params.level ?? "").toUpperCase();

  const [levelData, setLevelData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [results, setResults] = useState<
    Record<string, SetResult>
  >({});

  useEffect(() => {
    let active = true;

    let refreshResults: (() => void) | null = null;

    const loadData = async () => {
      setIsLoading(true);
      setLoadError(false);
      setLevelData(null);
      setResults({});

      try {
        // Tetap dynamic import agar JSON JLPT tidak masuk
        // ke initial load halaman yang tidak membutuhkannya.
        const module = await import("../../../data/jlpt.json");
        const allJlptData = module.default as any[];

        const data = allJlptData.find(
          (item: any) =>
            String(item.level).toUpperCase() === level
        );

        if (!active) return;

        if (!data) {
          setLevelData(null);
          return;
        }

        setLevelData(data);

        const updateResults = () => {
          const newResults: Record<string, SetResult> = {};

          data.sets?.forEach((set: any) => {
            const saved = localStorage.getItem(
              `jlpt_result_${set.id}`
            );

            if (!saved) return;

            try {
              const parsed = JSON.parse(saved);
              const answers = parsed.answers || {};

              let correct = 0;
              let total = 0;
              let hasAnswers = false;

              SECTIONS.forEach((section) => {
                const questions =
                  set.sections?.[section] || [];

                const sectionAnswers =
                  answers[section] || {};

                if (Object.keys(sectionAnswers).length > 0) {
                  hasAnswers = true;
                }

                total += questions.length;

                questions.forEach(
                  (question: any, index: number) => {
                    if (
                      sectionAnswers[index] === question.answer
                    ) {
                      correct++;
                    }
                  }
                );
              });

              const score =
                total === 0
                  ? 0
                  : Math.round((correct / total) * 100);

              const hasAllAnswers =
                total > 0 &&
                SECTIONS.every((section) => {
                  const questions = set.sections?.[section] || [];
                  const sectionAnswers = answers[section] || {};

                  return questions.every(
                    (_question: any, index: number) => {
                      const selectedAnswer = sectionAnswers[index];
                      const optionCount =
                        questions[index]?.options?.length || 0;

                      return (
                        Number.isInteger(selectedAnswer) &&
                        selectedAnswer >= 0 &&
                        selectedAnswer < optionCount
                      );
                    }
                  );
                });

              const isFinished =
                hasAllAnswers && parsed.isFinished === true;

              const isPerfect =
                hasAllAnswers && correct === total;

              const completedOnce =
                parsed.completedOnce === true ||
                isFinished ||
                isPerfect;

              newResults[set.id] = {
                score,
                hasAnswers,
                isFinished,
                isPerfect,
                completedOnce,
              };
            } catch (error) {
              console.error(
                `Gagal membaca hasil set ${set.id}:`,
                error
              );
            }
          });

          if (active) {
            setResults(newResults);
          }
        };

        refreshResults = updateResults;

        updateResults();

        // Refresh status ketika kembali dari halaman ujian
        // atau ketika hasil berubah di tab browser lain.
        const handleFocus = () => updateResults();

        const handleStorage = (event: StorageEvent) => {
          if (
            event.key === null ||
            event.key.startsWith("jlpt_result_")
          ) {
            updateResults();
          }
        };

        const handleVisibility = () => {
          if (document.visibilityState === "visible") {
            updateResults();
          }
        };

        window.addEventListener("focus", handleFocus);
        window.addEventListener("storage", handleStorage);
        document.addEventListener(
          "visibilitychange",
          handleVisibility
        );

        // Simpan cleanup listener untuk unmount.
        cleanupListeners = () => {
          window.removeEventListener("focus", handleFocus);
          window.removeEventListener("storage", handleStorage);
          document.removeEventListener(
            "visibilitychange",
            handleVisibility
          );
        };
      } catch (error) {
        console.error("Gagal memuat data JLPT:", error);

        if (active) {
          setLoadError(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    let cleanupListeners = () => {};

    void loadData();

    return () => {
      active = false;
      cleanupListeners();
    };
  }, [level]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-[#A3A099]">
        Memuat daftar ujian...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-center py-20 text-[#A3A099]">
        Gagal memuat data JLPT. Silakan muat ulang halaman.
      </div>
    );
  }

  if (!levelData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-[#EAE6DD] mb-4">
          Level tidak ditemukan
        </h2>

        <Link
          href="/"
          className="text-[#C93438] hover:underline"
        >
          Kembali ke Home
        </Link>
      </div>
    );
  }

  const sets = levelData.sets || [];

  const completedCount = sets.filter(
    (set: any) => results[set.id]?.completedOnce
  ).length;

  const perfectCount = sets.filter(
    (set: any) => results[set.id]?.isPerfect
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Tombol Back */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-sm font-bold text-[#A3A099] hover:text-[#EAE6DD] transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Kembali ke Home
      </button>

      {/* Header */}
      <div className="border-b border-[#33312E] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="text-[#B8860B]" size={28} />

          <h2 className="text-3xl font-bold text-[#EAE6DD]">
            Simulasi JLPT {level}
          </h2>
        </div>

        <p className="text-[#A3A099] text-sm">
          Pilih set ujian di bawah ini. Setiap set terdiri dari
          Kosakata, Grammar, Membaca, dan Mendengar.
        </p>

        {sets.length > 0 && (
          <div className="mt-5 bg-[#1E1D1B] border border-[#33312E] rounded-xl p-4">
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span className="text-[#A3A099]">
                Set diselesaikan
              </span>

              <span className="font-bold text-[#EAE6DD]">
                {completedCount} / {sets.length}
              </span>
            </div>

            <div className="h-2 bg-[#33312E] rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-[#B8860B] rounded-full transition-all"
                style={{
                  width: `${
                    (completedCount / sets.length) * 100
                  }%`,
                }}
              />
            </div>

            <p className="text-xs text-[#A3A099] mt-3">
              Perfect Completed: {perfectCount} / {sets.length}
            </p>
          </div>
        )}
      </div>

      {/* List Set Ujian */}
      <div className="space-y-4">
        {sets.length > 0 ? (
          sets.map((set: any, index: number) => {
            const result = results[set.id];

            const hasAnswers = result?.hasAnswers ?? false;
            const isFinished = result?.isFinished ?? false;
            const isPerfect = result?.isPerfect ?? false;
            const completedOnce =
              result?.completedOnce ?? false;

            let statusLabel = "BELUM DICOBA";
            let statusClass =
              "bg-[#262523] text-[#A3A099]";
            let actionLabel = "Mulai Ujian";

            if (isPerfect) {
              statusLabel = "PERFECT COMPLETED";
              statusClass =
                "bg-[#B8860B]/10 border border-[#B8860B]/30 text-[#B8860B]";
              actionLabel = "Lihat Hasil";
            } else if (isFinished || completedOnce) {
              statusLabel = "SUDAH DICOBA · BISA DIULANG";
              statusClass =
                "bg-[#33312E] border border-[#55514B] text-[#C7C1B5]";
              actionLabel = isFinished
                ? "Lihat Hasil"
                : "Mulai Ujian";
            } else if (hasAnswers) {
              statusLabel = "SEDANG DIKERJAKAN";
              statusClass =
                "bg-[#C93438]/10 border border-[#C93438]/30 text-[#C93438]";
              actionLabel = "Lanjutkan Ujian";
            }

            return (
              <Link
                key={set.id}
                href={`/jlpt/${level}/${set.id}`}
                className="w-full block text-left bg-[#1E1D1B] border border-[#33312E] hover:border-[#C93438] rounded-2xl p-6 transition-all group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#EAE6DD] group-hover:text-[#C93438] transition-colors mb-2">
                      {set.title || `Set Ujian ${index + 1}`}
                    </h3>

                    <div className="flex flex-wrap gap-2 text-xs font-bold text-[#A3A099]">
                      <span className="bg-[#262523] px-2 py-1 rounded">
                        {set.sections?.vocab?.length || 0} Vocab
                      </span>

                      <span className="bg-[#262523] px-2 py-1 rounded">
                        {set.sections?.grammar?.length || 0} Grammar
                      </span>

                      <span className="bg-[#262523] px-2 py-1 rounded">
                        {set.sections?.reading?.length || 0} Reading
                      </span>

                      <span className="bg-[#262523] px-2 py-1 rounded">
                        {set.sections?.listening?.length || 0} Listening
                      </span>
                    </div>

                    <div className="mt-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${statusClass}`}
                      >
                        {isPerfect ? (
                          <CheckCircle2 size={14} />
                        ) : completedOnce || isFinished ? (
                          <RotateCcw size={14} />
                        ) : null}

                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-3 font-bold group-hover:translate-x-1 transition-transform whitespace-nowrap ${
                      isPerfect
                        ? "text-[#B8860B]"
                        : "text-[#C93438]"
                    }`}
                  >
                    {(isFinished || hasAnswers) && (
                      <span className="text-sm font-bold text-[#A3A099]">
                        Skor: {result?.score ?? 0}%
                      </span>
                    )}

                    {actionLabel}

                    {isPerfect ? (
                      <Trophy size={22} />
                    ) : (
                      <PlayCircle size={24} />
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-16 bg-[#1E1D1B] border border-[#33312E] rounded-2xl">
            <p className="text-[#A3A099]">
              Belum ada set ujian untuk level {level}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}