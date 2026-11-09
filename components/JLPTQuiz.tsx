
"use client";

import {
  awardJlptCompletionXpOnce,
  awardJlptHighScoreBonusOnce,
  awardJlptPerfectRewardOnce,
  awardJlptLevelCompletionOnce,
} from "../lib/gamification";

import { syncNewCollectionUnlocks } from "../lib/profile-collections";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Volume2,
  Trophy,
  CheckCircle2,
  XCircle,
  BookOpen,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  passage?: string;
  audioUrl?: string;
}

interface JLPTQuizProps {
  testSet: any;
  onBack: () => void;
  level: string;
  levelSetIds: string[];
}

interface SavedQuizResult {
  answers?: Record<string, Record<number, number>>;
  activeSection?: string;
  currentIndex?: number;
  isFinished?: boolean;
  isPerfect?: boolean;
  completedOnce?: boolean;
}

const SECTIONS = [
  { id: "vocab", label: "Kosakata (文字・語彙)" },
  { id: "grammar", label: "Grammar (文法)" },
  { id: "reading", label: "Membaca (読解)" },
  { id: "listening", label: "Mendengar (聴解)" },
];

const createEmptyAnswers = () => ({
  vocab: {},
  grammar: {},
  reading: {},
  listening: {},
});

function hasAllQuestionsAnswered(
  answers: Record<string, Record<number, number>>,
  sections: any
): boolean {
  let totalQuestions = 0;
  let answeredQuestions = 0;

  SECTIONS.forEach((section) => {
    const questions = sections?.[section.id] || [];
    const sectionAnswers = answers?.[section.id] || {};

    totalQuestions += questions.length;

    questions.forEach((question: any, index: number) => {
      const selectedAnswer = sectionAnswers[index];

      if (
        Number.isInteger(selectedAnswer) &&
        selectedAnswer >= 0 &&
        selectedAnswer < (question.options?.length || 0)
      ) {
        answeredQuestions++;
      }
    });
  });

  return totalQuestions > 0 && answeredQuestions === totalQuestions;
}

function calculateQuizScore(
  answers: Record<string, Record<number, number>>,
  sections: any
) {
  let totalCorrect = 0;
  let totalQuestions = 0;

  SECTIONS.forEach((section) => {
    const questions = sections?.[section.id] || [];
    totalQuestions += questions.length;

    questions.forEach((question: any, index: number) => {
      if (answers?.[section.id]?.[index] === question.answer) {
        totalCorrect++;
      }
    });
  });

  const totalScorePercent =
    totalQuestions === 0
      ? 0
      : Math.round((totalCorrect / totalQuestions) * 100);

  return {
    totalCorrect,
    totalQuestions,
    totalScorePercent,
    isPerfect:
      totalQuestions > 0 && totalCorrect === totalQuestions,
  };
}

function getJlptLevel(testSet: any): string {
  if (testSet?.level) {
    return String(testSet.level).toUpperCase();
  }

  const match = String(testSet?.id || "").match(/^(n[1-5])/i);

  return match ? match[1].toUpperCase() : "";
}

function isSavedSetCompleted(setId: string): boolean {
  try {
    const saved = localStorage.getItem(`jlpt_result_${setId}`);

    if (!saved) return false;

    const parsed: SavedQuizResult = JSON.parse(saved);

    // Hanya flag riwayat yang sudah tervalidasi yang boleh
    // dihitung untuk hadiah penyelesaian level.
    return parsed.completedOnce === true;
  } catch {
    return false;
  }
}

function awardLevelCompletionIfReady(
  level: string,
  levelSetIds: string[]
) {
  if (!level || levelSetIds.length === 0) return;

  const allCompleted = levelSetIds.every((id) =>
    isSavedSetCompleted(id)
  );

  if (allCompleted) {
    awardJlptLevelCompletionOnce(level);
  }
}

export default function JLPTQuiz({
  testSet,
  onBack,
  level,
  levelSetIds,
}: JLPTQuizProps) {
  const [activeSection, setActiveSection] =
    useState<string>("vocab");

  const [currentIndex, setCurrentIndex] = useState(0);

  const [userAnswers, setUserAnswers] = useState<
    Record<string, Record<number, number>>
  >(createEmptyAnswers());

  const [isFinished, setIsFinished] = useState(false);
  const [isPerfect, setIsPerfect] = useState(false);
  const [completedOnce, setCompletedOnce] = useState(false);

  const [showReview, setShowReview] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const storageKey = `jlpt_result_${testSet.id}`;
  const currentLevel = level || getJlptLevel(testSet);

  // Simpan progress langsung saat navigasi, tidak hanya mengandalkan useEffect.
  const saveProgress = (
    section: string,
    index: number,
    answers = userAnswers
  ) => {
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed: SavedQuizResult = saved ? JSON.parse(saved) : {};

      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...parsed,
          answers,
          activeSection: section,
          currentIndex: index,
          isFinished: false,
          isPerfect: false,
          completedOnce,
        })
      );
    } catch (error) {
      console.error("Gagal menyimpan progress ujian JLPT:", error);
    }
  };

  // ==========================================
  // LOAD HASIL SEBELUMNYA
  // ==========================================
  useEffect(() => {
    setIsLoaded(false);

    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed: SavedQuizResult = JSON.parse(saved);

        const savedAnswers = {
          ...createEmptyAnswers(),
          ...(parsed.answers || {}),
        };

        setUserAnswers(savedAnswers);

        // Pulihkan posisi terakhir yang dibuka jika masih valid.
        const savedSection = SECTIONS.find(
          (section) =>
            section.id === parsed.activeSection &&
            (testSet.sections?.[section.id] || []).length > 0
        );

        const restoredSection = savedSection?.id || "vocab";
        const restoredQuestions =
          testSet.sections?.[restoredSection] || [];
        const restoredIndex =
          Number.isInteger(parsed.currentIndex) &&
          parsed.currentIndex! >= 0 &&
          parsed.currentIndex! < restoredQuestions.length
            ? parsed.currentIndex!
            : 0;

        setActiveSection(restoredSection);
        setCurrentIndex(restoredIndex);

        const score = calculateQuizScore(
          savedAnswers,
          testSet.sections
        );

        const hasAllAnswers = hasAllQuestionsAnswered(
          savedAnswers,
          testSet.sections
        );

        // Status ujian hanya dianggap selesai jika semua soal benar-benar dijawab.
        const wasFinished =
          hasAllAnswers &&
          (parsed.isFinished === true || parsed.isPerfect === true);

        const wasPerfect =
          hasAllAnswers && score.isPerfect;

        setIsFinished(wasFinished);
        setIsPerfect(wasPerfect);

        // completedOnce adalah riwayat penyelesaian yang tetap dipertahankan
        // walaupun pengguna mengulang set dan jawaban saat ini dikosongkan.
        const wasCompleted =
          parsed.completedOnce === true ||
          wasFinished ||
          wasPerfect;

        setCompletedOnce(wasCompleted);

        // Migrasikan hasil lama yang valid agar riwayatnya tetap tersimpan.
        if (wasCompleted && parsed.completedOnce !== true) {
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              ...parsed,
              answers: savedAnswers,
              isFinished: wasFinished,
              isPerfect: wasPerfect,
              completedOnce: true,
            })
          );
        }

        // Pulihkan klaim reward secara idempoten dari hasil yang sudah tersimpan.
        // Ini menutup celah jika halaman tertutup setelah hasil disimpan,
        // tetapi sebelum seluruh fungsi reward selesai dijalankan.
        if (wasCompleted) {
          awardJlptCompletionXpOnce(testSet.id);
        }

        if (
          wasFinished &&
          score.totalQuestions > 0 &&
          score.totalCorrect / score.totalQuestions >= 0.8
        ) {
          awardJlptHighScoreBonusOnce(testSet.id);
        }

        // Hasil 100% tetap menjadi satu-satunya kondisi untuk reward Token
        // Perfect Score dan penguncian permanen Practice Set.
        if (wasPerfect) {
          awardJlptPerfectRewardOnce(testSet.id);
        }

        if (wasCompleted) {
          awardLevelCompletionIfReady(
            currentLevel,
            levelSetIds
          );
        }
      } catch (error) {
        console.error("Gagal load data ujian JLPT:", error);
      }
    } else {
      setUserAnswers(createEmptyAnswers());
      setIsFinished(false);
      setIsPerfect(false);
      setCompletedOnce(false);
    }

    setShowReview(false);
    setShowConfirm(false);

    if (!saved) {
      setActiveSection("vocab");
      setCurrentIndex(0);
    }

    setIsLoaded(true);

    // Sinkronkan koleksi setelah hasil lama selesai dimigrasikan.
    syncNewCollectionUnlocks();
  }, [storageKey, testSet, currentLevel, levelSetIds]);

  // ==========================================
  // RESET / ULANGI UJIAN
  // ==========================================
  const handleReset = () => {
    // Set sempurna tidak boleh diulang.
    if (isPerfect) return;

    let previouslyCompleted = completedOnce;

    try {
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        const parsed: SavedQuizResult = JSON.parse(saved);

        const savedAnswers = {
          ...createEmptyAnswers(),
          ...(parsed.answers || {}),
        };
        const savedScore = calculateQuizScore(
          savedAnswers,
          testSet.sections
        );
        const hasAllAnswers = hasAllQuestionsAnswered(
          savedAnswers,
          testSet.sections
        );

        previouslyCompleted =
          previouslyCompleted ||
          parsed.completedOnce === true ||
          (hasAllAnswers &&
            (parsed.isFinished === true ||
              (parsed.isPerfect === true && savedScore.isPerfect)));
      }
    } catch {
      // Abaikan data lama yang tidak valid.
    }

    const emptyAnswers = createEmptyAnswers();

    // Riwayat penyelesaian tetap dipertahankan.
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        answers: emptyAnswers,
        activeSection: "vocab",
        currentIndex: 0,
        isFinished: false,
        isPerfect: false,
        completedOnce: previouslyCompleted,
      })
    );

    setUserAnswers(emptyAnswers);
    setIsFinished(false);
    setIsPerfect(false);
    setCompletedOnce(previouslyCompleted);
    setShowReview(false);
    setActiveSection("vocab");
    setCurrentIndex(0);
    setShowConfirm(false);
  };

  const currentQuestions: Question[] =
    testSet.sections?.[activeSection] || [];

  const currentQ = currentQuestions[currentIndex];

  const totalQuestionsInSection = currentQuestions.length;

  // Simpan posisi terakhir agar ujian dapat dilanjutkan
  // dari bagian dan nomor soal yang sama setelah halaman dibuka ulang.
  useEffect(() => {
    if (!isLoaded || isFinished || isPerfect) return;

    try {
      const saved = localStorage.getItem(storageKey);
      const parsed: SavedQuizResult = saved ? JSON.parse(saved) : {};

      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...parsed,
          answers: userAnswers,
          activeSection,
          currentIndex,
          isFinished: false,
          isPerfect: false,
          completedOnce,
        })
      );
    } catch (error) {
      console.error("Gagal menyimpan posisi ujian JLPT:", error);
    }
  }, [
    isLoaded,
    isFinished,
    isPerfect,
    storageKey,
    userAnswers,
    activeSection,
    currentIndex,
    completedOnce,
  ]);

  const handleAnswer = (optIndex: number) => {
  if (isFinished || isPerfect) return;

  const updatedAnswers = {
    ...userAnswers,
    [activeSection]: {
      ...userAnswers[activeSection],
      [currentIndex]: optIndex,
    },
  };

  setUserAnswers(updatedAnswers);

  localStorage.setItem(
    storageKey,
    JSON.stringify({
      answers: updatedAnswers,
      activeSection,
      currentIndex,
      isFinished: false,
      isPerfect: false,
      completedOnce,
    })
  );
};

  // ==========================================
  // HITUNG SOAL YANG BELUM DIJAWAB
  // ==========================================
  let totalUnanswered = 0;

  SECTIONS.forEach((section) => {
    const questions = testSet.sections?.[section.id] || [];

    questions.forEach((_: any, index: number) => {
      if (userAnswers[section.id]?.[index] === undefined) {
        totalUnanswered++;
      }
    });
  });

  // ==========================================
  // NAVIGASI SOAL
  // ==========================================
  const nextQuestion = () => {
    if (currentIndex < totalQuestionsInSection - 1) {
      const nextIndex = currentIndex + 1;
      saveProgress(activeSection, nextIndex);
      setCurrentIndex(nextIndex);
      return;
    }

    const currentSectionIndex = SECTIONS.findIndex(
      (section) => section.id === activeSection
    );

    const nextSection = SECTIONS
      .slice(currentSectionIndex + 1)
      .find(
        (section) =>
          (testSet.sections?.[section.id] || []).length > 0
      );

    if (nextSection) {
      saveProgress(nextSection.id, 0);
      setCurrentIndex(0);
      setActiveSection(nextSection.id);
    } else {
      setShowConfirm(true);
    }
  };

  // ==========================================
  // HITUNG SKOR
  // ==========================================
  const {
    totalCorrect,
    totalQuestions,
    totalScorePercent,
  } = calculateQuizScore(userAnswers, testSet.sections);

  if (!isLoaded) return null;

  // ==========================================
  // TAMPILAN 1: HALAMAN HASIL SKOR
  // ==========================================
  if (isFinished && !showReview) {
    return (
      <div className="bg-[#1E1D1B] border border-[#33312E] rounded-3xl p-8 text-center shadow-xl mt-8 animate-in fade-in zoom-in-95">
        <Trophy
          className="mx-auto text-[#B8860B] mb-4"
          size={64}
        />

        <h3 className="text-3xl font-bold text-[#EAE6DD] mb-2">
          Ujian Selesai!
        </h3>

        <p className="text-[#A3A099] mb-8">
          Berikut adalah rincian skor kamu untuk {testSet.title}.
        </p>

        <div className="bg-[#262523] border border-[#B8860B]/30 rounded-2xl p-6 mb-8 max-w-md mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#B8860B]/10 rounded-full blur-2xl -mr-5 -mt-5"></div>

          <p className="text-sm font-bold text-[#B8860B] uppercase tracking-wider mb-2">
            Total Skor Akhir
          </p>

          <div className="flex items-end justify-center gap-1">
            <span className="text-6xl font-black text-[#EAE6DD]">
              {totalScorePercent}
            </span>

            <span className="text-2xl font-bold text-[#A3A099] mb-2">
              %
            </span>
          </div>

          <p className="text-sm text-[#A3A099] mt-2">
            {totalCorrect} Benar dari {totalQuestions} Soal
          </p>

          {isPerfect && (
            <div className="mt-5 inline-flex items-center gap-2 bg-[#B8860B]/15 border border-[#B8860B]/40 text-[#D9AD42] px-4 py-2 rounded-full text-sm font-bold">
              <CheckCircle2 size={17} />
              Perfect Completed
            </div>
          )}

          {isPerfect && (
            <p className="text-xs text-[#A3A099] mt-3">
              Kamu mendapatkan 100 token. Set ini sudah terkunci
              dan tidak dapat diulang.
            </p>
          )}
        </div>

        <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
          {SECTIONS.map((section) => {
            const questions =
              testSet.sections?.[section.id] || [];

            if (questions.length === 0) return null;

            let correct = 0;

            questions.forEach((question: any, index: number) => {
              if (
                userAnswers[section.id]?.[index] ===
                question.answer
              ) {
                correct++;
              }
            });

            const scorePercent = Math.round(
              (correct / questions.length) * 100
            );

            return (
              <div
                key={section.id}
                className="bg-[#1A1918] border border-[#33312E] p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-sm text-[#EAE6DD]">
                    {section.label}
                  </p>

                  <p className="text-xs text-[#A3A099]">
                    {questions.length} Soal
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`font-bold text-lg ${
                      scorePercent >= 60
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {scorePercent}%
                  </p>

                  <p className="text-xs text-[#A3A099]">
                    {correct} Benar
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <button
            onClick={() => setShowReview(true)}
            className="flex-1 bg-[#B8860B] text-white font-bold py-3 rounded-xl hover:bg-[#9a7009] transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen size={18} />
            Lihat Pembahasan
          </button>

          {!isPerfect ? (
            <button
              onClick={handleReset}
              className="flex-1 bg-[#33312E] text-white font-bold py-3 rounded-xl hover:bg-[#444] transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Ulangi Ujian
            </button>
          ) : (
            <div className="flex-1 bg-[#262523] border border-[#B8860B]/30 text-[#B8860B] font-bold py-3 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              Set Terkunci
            </div>
          )}
        </div>

        <button
          onClick={onBack}
          className="mt-4 text-sm font-bold text-[#A3A099] hover:text-[#EAE6DD]"
        >
          Kembali ke Daftar Set
        </button>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN 2: REVIEW PEMBAHASAN
  // ==========================================
  if (isFinished && showReview) {
    return (
      <div className="bg-[#1E1D1B] border border-[#33312E] rounded-3xl p-6 md:p-8 shadow-xl mt-4 animate-in slide-in-from-bottom-8">
        <div className="flex items-center gap-3 border-b border-[#33312E] pb-4 mb-6">
          <button
            onClick={() => setShowReview(false)}
            className="p-2 bg-[#262523] rounded-full hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h3 className="text-xl font-bold text-[#EAE6DD]">
              Pembahasan Jawaban
            </h3>

            <p className="text-xs text-[#A3A099]">
              {testSet.title}
            </p>
          </div>
        </div>

        <div
          className="space-y-8 overflow-y-auto pr-2"
          style={{ maxHeight: "60vh" }}
        >
          {SECTIONS.map((section) => {
            const questions =
              testSet.sections?.[section.id] || [];

            if (questions.length === 0) return null;

            return (
              <div key={section.id} className="space-y-4">
                <h4 className="font-bold text-lg text-[#EAE6DD] border-l-4 border-[#C93438] pl-3 py-1 bg-[#C93438]/5">
                  {section.label}
                </h4>

                {questions.map((question: any, index: number) => {
                  const userAnswer =
                    userAnswers[section.id]?.[index];

                  const isCorrect =
                    userAnswer === question.answer;

                  const isUnanswered =
                    userAnswer === undefined;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${
                        isCorrect
                          ? "border-green-900/50 bg-green-900/10"
                          : "border-red-900/50 bg-red-900/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 shrink-0">
                          {isCorrect ? (
                            <CheckCircle2
                              className="text-green-500"
                              size={20}
                            />
                          ) : (
                            <XCircle
                              className="text-red-500"
                              size={20}
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#A3A099] mb-2">
                            SOAL {index + 1}
                          </p>

                          {question.passage && (
                            <div className="bg-[#121110]/50 border-l-4 border-[#33312E] rounded-r-lg mb-3">
                              <div
                                className="p-4 max-h-[200px] overflow-y-auto text-sm text-[#EAE6DD] leading-relaxed font-mincho [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B] text-left"
                                dangerouslySetInnerHTML={{
                                  __html: question.passage,
                                }}
                              />
                            </div>
                          )}

                          <div
                            className="text-[#EAE6DD] font-mincho mb-4 text-lg [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B]"
                            dangerouslySetInnerHTML={{
                              __html: question.question,
                            }}
                          />

                          <div className="space-y-1 text-sm mb-4">
                            <p className="text-[#A3A099]">
                              Jawaban kamu:{" "}
                              <span
                                className={
                                  isUnanswered
                                    ? "text-yellow-500"
                                    : isCorrect
                                      ? "text-green-500 font-bold"
                                      : "text-red-500 font-bold"
                                }
                              >
                                {isUnanswered
                                  ? "Tidak dijawab"
                                  : question.options[userAnswer]}
                              </span>
                            </p>

                            {!isCorrect && (
                              <p className="text-[#A3A099]">
                                Jawaban benar:{" "}
                                <span className="text-green-500 font-bold">
                                  {question.options[question.answer]}
                                </span>
                              </p>
                            )}
                          </div>

                          <div className="bg-[#121110]/50 p-3 rounded-lg border border-[#33312E]/50">
                            <p className="text-xs font-bold text-[#B8860B] mb-1">
                              PENJELASAN
                            </p>

                            <p className="text-sm text-[#A3A099] leading-relaxed">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-[#33312E] flex flex-wrap justify-end gap-3">
          {!isPerfect && (
            <button
              onClick={handleReset}
              className="bg-[#33312E] text-white font-bold py-2 px-6 rounded-xl hover:bg-[#444] transition-colors flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Ulangi Ujian
            </button>
          )}

          <button
            onClick={() => setShowReview(false)}
            className="bg-[#B8860B] text-white font-bold py-2 px-6 rounded-xl hover:bg-[#9a7009] transition-colors"
          >
            Kembali ke Skor
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN 3: UJIAN BERLANGSUNG
  // ==========================================
  const selectedAnswer =
    userAnswers[activeSection]?.[currentIndex];

  const isAnswered = selectedAnswer !== undefined;

  return (
    <>
      <div className="bg-[#1E1D1B] border border-[#33312E] rounded-3xl p-6 md:p-8 shadow-xl mt-4">
        <div className="flex items-center gap-3 border-b border-[#33312E] pb-4 mb-6">
          <button
            onClick={() => {
              saveProgress(activeSection, currentIndex);
              onBack();
            }}
            className="p-2 bg-[#262523] rounded-full hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h3 className="text-xl font-bold text-[#EAE6DD] leading-tight">
              {testSet.title}
            </h3>

            <p className="text-xs text-[#A3A099]">
              Simulasi Ujian JLPT
            </p>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
          {SECTIONS.map((section) => {
            const hasQuestions =
              (testSet.sections?.[section.id] || []).length > 0;

            if (!hasQuestions) return null;

            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => {
                  saveProgress(section.id, 0);
                  setCurrentIndex(0);
                  setActiveSection(section.id);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#C93438] text-white shadow-lg"
                    : "bg-[#262523] border border-[#33312E] text-[#A3A099] hover:text-[#EAE6DD]"
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </div>

        {currentQ ? (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-[#C93438] bg-[#C93438]/10 px-2 py-1 rounded-md uppercase tracking-wider">
                {SECTIONS.find(
                  (section) => section.id === activeSection
                )?.label}
              </span>

              <span className="text-xs font-bold text-[#A3A099]">
                SOAL {currentIndex + 1} / {totalQuestionsInSection}
              </span>
            </div>

            {currentQ.passage && (
              <div className="bg-[#1A1918] border-l-4 border-[#B8860B] rounded-r-xl mb-6 shadow-md">
                <div
                  className="p-5 md:p-6 max-h-[300px] overflow-y-auto text-[#EAE6DD] text-base md:text-lg leading-[2] font-mincho [&_rt]:text-[0.55em] [&_rt]:text-[#B8860B] pr-2 custom-scrollbar text-left"
                  dangerouslySetInnerHTML={{
                    __html: currentQ.passage,
                  }}
                />
              </div>
            )}

            {currentQ.audioUrl && (
              <div className="bg-[#121110] border border-[#33312E] p-6 rounded-xl mb-6 flex flex-col items-center justify-center gap-4 shadow-inner">
                <Volume2
                  size={40}
                  className="text-[#B8860B] animate-pulse"
                />

                <audio
                  key={currentQ.audioUrl}
                  controls
                  className="w-full max-w-md"
                >
                  <source
                    src={currentQ.audioUrl}
                    type="audio/mpeg"
                  />
                  Browser kamu tidak mendukung audio.
                </audio>
              </div>
            )}

            <h3
              className="text-xl md:text-2xl font-bold text-[#EAE6DD] mb-8 text-center leading-[2] font-mincho [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B]"
              dangerouslySetInnerHTML={{
                __html: currentQ.question,
              }}
            />

            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswer === index;

                let buttonClass =
                  "bg-[#262523] border-[#33312E] text-[#EAE6DD] hover:border-[#C93438]";

                if (isSelected) {
                  buttonClass =
                    "bg-[#C93438] border-[#C93438] text-white shadow-lg shadow-[#C93438]/20";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all text-base md:text-lg font-mincho [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B] ${buttonClass}`}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: option,
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-6 border-t border-[#33312E]/50">
              <button
                onClick={nextQuestion}
                disabled={!isAnswered}
                className={`w-full font-bold py-4 rounded-xl transition-all text-lg ${
                  isAnswered
                    ? "bg-[#B8860B] text-white hover:bg-[#9a7009] shadow-lg shadow-[#B8860B]/20"
                    : "bg-[#33312E] text-[#A3A099] cursor-not-allowed"
                }`}
              >
                {currentIndex === totalQuestionsInSection - 1
                  ? "Lanjut / Selesaikan Ujian"
                  : "Soal Selanjutnya"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-[#A3A099] py-10">
            Belum ada soal untuk section ini.
          </div>
        )}
      </div>

      {/* MODAL KONFIRMASI SELESAI UJIAN */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-[#1A1918] border border-[#33312E] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 md:p-8 animate-in zoom-in-95"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#C93438]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C93438]/20">
                <AlertTriangle
                  className="text-[#C93438]"
                  size={32}
                />
              </div>

              <h3 className="text-2xl font-bold text-[#EAE6DD] mb-2">
                Selesaikan Ujian?
              </h3>

              {totalQuestions === 0 ? (
                <p className="text-[#C93438] font-bold bg-[#C93438]/10 p-3 rounded-lg text-sm border border-[#C93438]/20">
                  Set ini belum memiliki soal. Ujian belum bisa diselesaikan.
                </p>
              ) : totalUnanswered > 0 ? (
                <p className="text-[#C93438] font-bold bg-[#C93438]/10 p-3 rounded-lg text-sm border border-[#C93438]/20">
                  Perhatian: Masih ada {totalUnanswered} soal
                  yang belum kamu jawab!
                </p>
              ) : (
                <p className="text-[#A3A099] text-sm">
                  Kamu sudah menjawab semua soal. Yakin ingin
                  menyelesaikan ujian dan melihat hasilnya?
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-[#33312E] text-[#EAE6DD] font-bold py-3 rounded-xl hover:bg-[#444] transition-colors"
              >
                Batal
              </button>

              <button
                disabled={totalUnanswered > 0 || totalQuestions === 0}
                onClick={() => {
                  // Pengaman tambahan: set kosong atau belum lengkap
                  // tidak boleh diselesaikan maupun menerima reward.
                  if (totalUnanswered > 0 || totalQuestions === 0) return;

                  const score = calculateQuizScore(
                    userAnswers,
                    testSet.sections
                  );

                  const perfect = score.isPerfect;

                  // Simpan status selesai lebih dulu agar sinkronisasi koleksi
                  // yang dipicu oleh reward langsung membaca riwayat valid.
                  const savedResult = {
                    answers: userAnswers,
                    isFinished: true,
                    isPerfect: perfect,
                    completedOnce: true,
                  };

                  localStorage.setItem(
                    storageKey,
                    JSON.stringify(savedResult)
                  );

                  // EXP penyelesaian: +50, satu kali per set.
                  awardJlptCompletionXpOnce(testSet.id);

                  // Bonus skor minimal 80%: +25,
                  // bisa diperoleh pada percobaan berikutnya.
                  if (
                    score.totalQuestions > 0 &&
                    score.totalCorrect / score.totalQuestions >= 0.8
                  ) {
                    awardJlptHighScoreBonusOnce(testSet.id);
                  }

                  // Token hanya diberikan jika semua jawaban benar.
                  if (perfect) {
                    awardJlptPerfectRewardOnce(testSet.id);
                  }

                  setIsPerfect(perfect);
                  setCompletedOnce(true);
                  setShowConfirm(false);
                  setIsFinished(true);

                  // Bonus level jika seluruh set pernah selesai.
                  awardLevelCompletionIfReady(
                    currentLevel,
                    levelSetIds
                  );
                }}
                className={`flex-1 font-bold py-3 rounded-xl transition-colors shadow-lg ${
                  totalUnanswered > 0 || totalQuestions === 0
                    ? "bg-[#33312E] text-[#817A73] cursor-not-allowed shadow-none"
                    : "bg-[#C93438] text-white hover:bg-[#B02A2E] shadow-[#C93438]/20"
                }`}
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
