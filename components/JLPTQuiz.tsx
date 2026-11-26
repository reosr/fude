
"use client";

import { notifyFudeLocalDataChanged } from "@/lib/supabase/events";
import {
  awardJlptCompletionXpOnce,
  awardJlptHighScoreBonusOnce,
  awardJlptPerfectRewardOnce,
  awardJlptLevelCompletionOnce,
} from "../lib/gamification";

import { syncNewCollectionUnlocks } from "../lib/profile-collections";
import { useState, useEffect } from "react";
import FudeAudioPlayer from "@/components/FudeAudioPlayer";
import JapaneseReading from "@/components/JapaneseReading";
import {
  ArrowLeft,
  Trophy,
  CheckCircle2,
  XCircle,
  BookOpen,
  RotateCcw,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  type?: "sentence-composition";
  correctOrder?: number[];
  starPosition?: number;
  passage?: string;
  audioUrl?: string;
  dialogue?: { speaker: string; jp: string }[];
  itemType?: string;
}

type SectionId = "vocab" | "grammar" | "reading" | "listening";
type JLPTSections = Partial<Record<SectionId, Question[]>>;

interface JLPTTestSet {
  id: string;
  title: string;
  level?: string;
  sections?: JLPTSections;
  examFormat?: {
    format?: string;
    timed?: boolean;
    testSections?: {
      id: string;
      label: string;
      minutes: number;
      dataSections: SectionId[];
    }[];
  };
}

interface JLPTQuizProps {
  testSet: JLPTTestSet;
  onBack: () => void;
  level: string;
  levelSetIds: string[];
}

interface SavedQuizResult {
  answers?: Record<string, Record<number, number>>;
  activeSection?: string;
  currentIndex?: number;
  sectionPositions?: Partial<Record<SectionId, number>>;
  isFinished?: boolean;
  isPerfect?: boolean;
  completedOnce?: boolean;
  examDeadlines?: Partial<Record<ExamBlockId, number>>;
  expiredExamBlocks?: ExamBlockId[];
}

// Jangan tampilkan bacaan otomatis pada soal yang sedang menguji bacaan
// kanji atau meminta memilih penulisan kanji dari petunjuk kana.
function canShowAutomaticReadingHint(sectionId: string, question: string): boolean {
  // Data soal boleh berisi tag ruby pada kata petunjuk seperti 読み方.
  // Hilangkan tag dan isi rt sebelum mendeteksi jenis soal agar target kanji
  // tetap terlindungi setelah furigana ditambahkan ke teks pendamping.
  const plainQuestion = question
    .replace(/<rt\b[^>]*>[\s\S]*?<\/rt>/gi, "")
    .replace(/<[^>]*>/g, "");
  const asksKanjiReading = /読み方はどれですか|何と読みますか/.test(plainQuestion);
  const asksKanjiSpelling = sectionId === "vocab" && (
    /正しい(?:漢字|書き方)(?:はどれですか|を選んでください)/.test(plainQuestion) ||
    /「[^」]+」の「[^」]+」は、どれですか/.test(plainQuestion)
  );
  return !asksKanjiReading && !asksKanjiSpelling;
}

const SECTIONS = [
  { id: "vocab", label: "Kosakata (文字・語彙)" },
  { id: "grammar", label: "Tata Bahasa (文法)" },
  { id: "reading", label: "Membaca (読解)" },
  { id: "listening", label: "Mendengar (聴解)" },
] as const;

type ExamBlockId = "vocab" | "grammar-reading" | "listening";

const EXAM_BLOCK_ORDER: ExamBlockId[] = ["vocab", "grammar-reading", "listening"];

const EXAM_BLOCK_CONFIG = {
  vocab: {
    label: "Sesi 1 · Kosakata",
    minutes: { N5: 20, N4: 25 },
  },
  "grammar-reading": {
    label: "Sesi 2 · Tata Bahasa + Membaca",
    minutes: { N5: 40, N4: 55 },
  },
  listening: {
    label: "Sesi 3 · Mendengar",
    minutes: { N5: 30, N4: 35 },
  },
} as const;

function getExamBlockId(sectionId: SectionId): ExamBlockId {
  if (sectionId === "grammar" || sectionId === "reading") {
    return "grammar-reading";
  }
  return sectionId;
}

function formatExamTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getItemTypeLabel(itemType?: string): string | null {
  const labels: Record<string, string> = {
    "kanji-reading": "Membaca kanji",
    orthography: "Penulisan kanji",
    "contextually-defined-expressions": "Kosakata sesuai konteks",
    paraphrases: "Padanan makna",
    usage: "Penggunaan kata",
    "sentential-grammar-1": "Tata bahasa kalimat",
    "sentential-grammar-2": "Penyusunan kalimat",
    "text-grammar": "Tata bahasa dalam teks",
    "short-passage": "Bacaan pendek",
    "mid-size-passage": "Bacaan menengah",
    "information-retrieval": "Mencari informasi",
    "task-based-comprehension": "Memahami situasi dan tugas",
    "key-point-comprehension": "Memahami informasi penting",
    "verbal-expressions": "Ungkapan lisan",
    "quick-response": "Respons cepat",
  };
  return itemType ? labels[itemType] || null : null;
}

const createEmptyAnswers = () => ({
  vocab: {},
  grammar: {},
  reading: {},
  listening: {},
});

function hasAllQuestionsAnswered(
  answers: Record<string, Record<number, number>>,
  sections?: JLPTSections
): boolean {
  let totalQuestions = 0;
  let answeredQuestions = 0;

  SECTIONS.forEach((section) => {
    const questions = sections?.[section.id] || [];
    const sectionAnswers = answers?.[section.id] || {};

    totalQuestions += questions.length;

    questions.forEach((question, index) => {
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
  sections?: JLPTSections
) {
  let totalCorrect = 0;
  let totalQuestions = 0;

  SECTIONS.forEach((section) => {
    const questions = sections?.[section.id] || [];
    totalQuestions += questions.length;

    questions.forEach((question, index) => {
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

function getJlptLevel(testSet: JLPTTestSet): string {
  if (testSet?.level) {
    return String(testSet.level).toUpperCase();
  }

  const match = String(testSet?.id || "").match(/^(n[1-5])/i);

  return match ? match[1].toUpperCase() : "";
}

function persistQuizResult(
  storageKey: string,
  result: SavedQuizResult
): boolean {
  try {
    localStorage.setItem(storageKey, JSON.stringify(result));
    notifyFudeLocalDataChanged(storageKey);
    return true;
  } catch (error) {
    console.error("Gagal menyimpan hasil ujian JLPT:", error);
    return false;
  }
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
    useState<SectionId>("vocab");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sectionPositions, setSectionPositions] = useState<Record<SectionId, number>>({
    vocab: 0,
    grammar: 0,
    reading: 0,
    listening: 0,
  });

  const [userAnswers, setUserAnswers] = useState<
    Record<string, Record<number, number>>
  >(createEmptyAnswers());

  const [isFinished, setIsFinished] = useState(false);
  const [isPerfect, setIsPerfect] = useState(false);
  const [completedOnce, setCompletedOnce] = useState(false);

  const [showReview, setShowReview] = useState(false);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [audioUnavailableUrl, setAudioUnavailableUrl] = useState<string | null>(null);
  const [examDeadlines, setExamDeadlines] = useState<Partial<Record<ExamBlockId, number>>>({});
  const [expiredExamBlocks, setExpiredExamBlocks] = useState<ExamBlockId[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const storageKey = `jlpt_result_${testSet.id}`;
  const isLoaded = loadedStorageKey === storageKey;
  const currentLevel = (level || getJlptLevel(testSet)).toUpperCase();
  const isTimedExam = currentLevel === "N5" || currentLevel === "N4";
  const activeExamBlock = getExamBlockId(activeSection);
  const activeExamMinutes = isTimedExam
    ? EXAM_BLOCK_CONFIG[activeExamBlock].minutes[currentLevel as "N5" | "N4"]
    : 0;
  const isActiveBlockExpired = isTimedExam && expiredExamBlocks.includes(activeExamBlock);
  const activeExamBlockOrder = EXAM_BLOCK_ORDER.indexOf(activeExamBlock);
  const nextTimedSectionAfterExpiry = isActiveBlockExpired
    ? SECTIONS.find((section) => {
        const hasQuestions = (testSet.sections?.[section.id] || []).length > 0;
        const block = getExamBlockId(section.id);
        return hasQuestions &&
          EXAM_BLOCK_ORDER.indexOf(block) > activeExamBlockOrder &&
          !expiredExamBlocks.includes(block);
      })
    : undefined;
  const isFinalTimedBlockExpired = isTimedExam && isActiveBlockExpired && !nextTimedSectionAfterExpiry;

  // Simpan posisi aktif dan posisi terakhir pada setiap bagian.
  const saveProgress = (
    section: SectionId,
    index: number,
    answers = userAnswers
  ) => {
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed: SavedQuizResult = saved ? JSON.parse(saved) : {};
      const updatedPositions: Record<SectionId, number> = {
        ...sectionPositions,
        [section]: index,
      };

      setSectionPositions(updatedPositions);
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...parsed,
          answers,
          activeSection: section,
          currentIndex: index,
          sectionPositions: updatedPositions,
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
    let active = true;

    queueMicrotask(() => {
      if (!active) return;

      let saved: string | null;

      try {
        saved = localStorage.getItem(storageKey);
      } catch (error) {
        console.error("Gagal membaca data ujian JLPT:", error);
        setStorageError("Progres ujian belum bisa dimuat. Coba muat ulang halaman.");
        setLoadedStorageKey(storageKey);
        return;
      }

    if (saved) {
      try {
        const parsed: SavedQuizResult = JSON.parse(saved);

        const savedAnswers = {
          ...createEmptyAnswers(),
          ...(parsed.answers || {}),
        };

        setExamDeadlines(parsed.examDeadlines || {});
        setExpiredExamBlocks(Array.isArray(parsed.expiredExamBlocks) ? parsed.expiredExamBlocks : []);
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

        const restoredPositions: Record<SectionId, number> = {
          vocab: 0,
          grammar: 0,
          reading: 0,
          listening: 0,
        };

        SECTIONS.forEach((section) => {
          const savedIndex = parsed.sectionPositions?.[section.id];
          const sectionLength = (testSet.sections?.[section.id] || []).length;

          if (
            Number.isInteger(savedIndex) &&
            savedIndex! >= 0 &&
            savedIndex! < sectionLength
          ) {
            restoredPositions[section.id] = savedIndex!;
          }
        });

        // Kompatibel dengan progress lama yang hanya menyimpan satu posisi aktif.
        restoredPositions[restoredSection] = restoredIndex;

        setActiveSection(restoredSection);
        setCurrentIndex(restoredIndex);
        setSectionPositions(restoredPositions);

        const score = calculateQuizScore(
          savedAnswers,
          testSet.sections
        );

        const hasAllAnswers = hasAllQuestionsAnswered(
          savedAnswers,
          testSet.sections
        );

        // Pada mode bertimer, peserta boleh menyelesaikan ujian dengan jawaban kosong.
        // Untuk level tanpa timer, semua soal tetap wajib dijawab sebelum selesai.
        const wasFinished = isTimedExam
          ? parsed.isFinished === true
          : hasAllAnswers && (parsed.isFinished === true || parsed.isPerfect === true);

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
          const migratedResult = {
            ...parsed,
            answers: savedAnswers,
            isFinished: wasFinished,
            isPerfect: wasPerfect,
            completedOnce: true,
          };

          if (!persistQuizResult(storageKey, migratedResult)) {
            setStorageError("Riwayat ujian belum bisa diperbarui. Coba lagi.");
          }
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
      setExamDeadlines({});
      setExpiredExamBlocks([]);
      setRemainingSeconds(null);
      setSectionPositions({
        vocab: 0,
        grammar: 0,
        reading: 0,
        listening: 0,
      });
    }

    setShowReview(false);
    setShowConfirm(false);

    if (!saved) {
      setActiveSection("vocab");
      setCurrentIndex(0);
    }

    setLoadedStorageKey(storageKey);

      // Sinkronkan koleksi setelah hasil lama selesai dimigrasikan.
      syncNewCollectionUnlocks();
    });

    return () => {
      active = false;
    };
  }, [storageKey, testSet, currentLevel, levelSetIds, isTimedExam]);

  // Timer memakai deadline absolut agar tetap akurat setelah reload.
  // Grammar dan Reading berbagi satu deadline, sama seperti sesi resmi N5/N4.
  useEffect(() => {
    if (!isLoaded || !isTimedExam || isFinished || isPerfect) return;

    if (expiredExamBlocks.includes(activeExamBlock)) return;

    let deadline = examDeadlines[activeExamBlock];
    let needsDeadlineState = false;

    if (!deadline) {
      deadline = Date.now() + activeExamMinutes * 60_000;
      const updatedDeadlines = {
        ...examDeadlines,
        [activeExamBlock]: deadline,
      };
      needsDeadlineState = true;

      try {
        const saved = localStorage.getItem(storageKey);
        const parsed: SavedQuizResult = saved ? JSON.parse(saved) : {};
        persistQuizResult(storageKey, {
          ...parsed,
          examDeadlines: updatedDeadlines,
          expiredExamBlocks,
        });
      } catch (error) {
        console.error("Gagal menyimpan waktu sesi JLPT:", error);
      }
    }

    const updateTimer = () => {
      if (needsDeadlineState) {
        needsDeadlineState = false;
        setExamDeadlines({
          ...examDeadlines,
          [activeExamBlock]: deadline!,
        });
      }

      const secondsLeft = Math.max(0, Math.ceil((deadline! - Date.now()) / 1000));
      setRemainingSeconds(secondsLeft);

      if (secondsLeft === 0 && !expiredExamBlocks.includes(activeExamBlock)) {
        const updatedExpired = [...expiredExamBlocks, activeExamBlock];
        setExpiredExamBlocks(updatedExpired);

        try {
          const saved = localStorage.getItem(storageKey);
          const parsed: SavedQuizResult = saved ? JSON.parse(saved) : {};
          persistQuizResult(storageKey, {
            ...parsed,
            examDeadlines: {
              ...examDeadlines,
              [activeExamBlock]: deadline,
            },
            expiredExamBlocks: updatedExpired,
          });
        } catch (error) {
          console.error("Gagal menyimpan akhir waktu sesi JLPT:", error);
        }

      }
    };

    const intervalId = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(intervalId);
  }, [
    isLoaded,
    isTimedExam,
    isFinished,
    isPerfect,
    activeExamBlock,
    activeExamMinutes,
    examDeadlines,
    expiredExamBlocks,
    storageKey,
  ]);

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
    const resetResult = {
      answers: emptyAnswers,
      activeSection: "vocab",
      currentIndex: 0,
      sectionPositions: {
        vocab: 0,
        grammar: 0,
        reading: 0,
        listening: 0,
      },
      isFinished: false,
      isPerfect: false,
      completedOnce: previouslyCompleted,
      examDeadlines: {},
      expiredExamBlocks: [],
    };

    if (!persistQuizResult(storageKey, resetResult)) {
      setStorageError("Ujian belum bisa diulang sekarang. Coba lagi.");
      return;
    }

    setStorageError(null);
    setUserAnswers(emptyAnswers);
    setIsFinished(false);
    setIsPerfect(false);
    setCompletedOnce(previouslyCompleted);
    setExamDeadlines({});
    setExpiredExamBlocks([]);
    setRemainingSeconds(null);
    setShowReview(false);
    setActiveSection("vocab");
    setCurrentIndex(0);
    setSectionPositions({
      vocab: 0,
      grammar: 0,
      reading: 0,
      listening: 0,
    });
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

      persistQuizResult(storageKey, {
        ...parsed,
        answers: userAnswers,
        activeSection,
        currentIndex,
        sectionPositions,
        isFinished: false,
        isPerfect: false,
        completedOnce,
        examDeadlines,
        expiredExamBlocks,
      });
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
    sectionPositions,
    completedOnce,
    examDeadlines,
    expiredExamBlocks,
  ]);

  const handleAnswer = (optIndex: number) => {
  if (isFinished || isPerfect || isActiveBlockExpired) return;
  if (currentQ?.audioUrl && audioUnavailableUrl === currentQ.audioUrl) return;

  const updatedAnswers = {
    ...userAnswers,
    [activeSection]: {
      ...userAnswers[activeSection],
      [currentIndex]: optIndex,
    },
  };

  setUserAnswers(updatedAnswers);

  const answerSaved = persistQuizResult(storageKey, {
    answers: updatedAnswers,
    activeSection,
    currentIndex,
    isFinished: false,
    isPerfect: false,
    completedOnce,
    examDeadlines,
    expiredExamBlocks,
  });

  if (answerSaved) setStorageError(null);
  else setStorageError("Jawaban belum berhasil disimpan. Periksa penyimpanan perangkat, lalu coba lagi.");
};

  // ==========================================
  // HITUNG SOAL YANG BELUM DIJAWAB
  // ==========================================
  let totalUnanswered = 0;

  SECTIONS.forEach((section) => {
    const questions = testSet.sections?.[section.id] || [];

    questions.forEach((_, index) => {
      if (userAnswers[section.id]?.[index] === undefined) {
        totalUnanswered++;
      }
    });
  });

  // ==========================================
  // NAVIGASI SOAL
  // ==========================================
  const goToSection = (sectionId: SectionId) => {
    if (isTimedExam && expiredExamBlocks.includes(getExamBlockId(sectionId))) return;

    const questions = testSet.sections?.[sectionId] || [];
    if (questions.length === 0) return;

    const savedIndex = sectionPositions[sectionId] ?? 0;
    const targetIndex = Math.min(
      Math.max(savedIndex, 0),
      questions.length - 1
    );

    saveProgress(sectionId, targetIndex);
    setActiveSection(sectionId);
    setCurrentIndex(targetIndex);
  };

  const hasPreviousQuestion = () => {
    if (currentIndex > 0) return true;

    const currentSectionIndex = SECTIONS.findIndex(
      (section) => section.id === activeSection
    );

    return SECTIONS.slice(0, currentSectionIndex).some(
      (section) => (testSet.sections?.[section.id] || []).length > 0
    );
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      saveProgress(activeSection, previousIndex);
      setCurrentIndex(previousIndex);
      return;
    }

    const currentSectionIndex = SECTIONS.findIndex(
      (section) => section.id === activeSection
    );

    const previousSection = SECTIONS
      .slice(0, currentSectionIndex)
      .reverse()
      .find(
        (section) =>
          (testSet.sections?.[section.id] || []).length > 0
      );

    if (previousSection) {
      const previousIndex =
        (testSet.sections?.[previousSection.id] || []).length - 1;
      saveProgress(previousSection.id, previousIndex);
      setActiveSection(previousSection.id);
      setCurrentIndex(previousIndex);
    }
  };

  const nextQuestion = () => {
    if (isActiveBlockExpired) return;

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

  const handlePrimaryExamAction = () => {
    if (isActiveBlockExpired) {
      if (nextTimedSectionAfterExpiry) {
        goToSection(nextTimedSectionAfterExpiry.id);
      } else {
        setShowConfirm(true);
      }
      return;
    }

    nextQuestion();
  };

  // ==========================================
  // HITUNG SKOR
  // ==========================================
  const {
    totalCorrect,
    totalQuestions,
    totalScorePercent,
  } = calculateQuizScore(userAnswers, testSet.sections);
  const cannotFinish = (!isTimedExam && totalUnanswered > 0) || totalQuestions === 0;

  const answeredQuestions = Math.max(0, totalQuestions - totalUnanswered);
  const overallProgress = totalQuestions > 0
    ? Math.round((answeredQuestions / totalQuestions) * 100)
    : 0;

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
            Akurasi Jawaban Latihan
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
          <p className="mt-2 text-xs text-[#A3A099]">
            Persentase ini adalah hitungan benar Fude, bukan skor skala resmi JLPT.
          </p>

          {isPerfect && (
            <div className="mt-5 inline-flex items-center gap-2 bg-[#B8860B]/15 border border-[#B8860B]/40 text-[#D9AD42] px-4 py-2 rounded-full text-sm font-bold">
              <CheckCircle2 size={17} />
              Selesai Sempurna
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

            questions.forEach((question, index) => {
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

                {questions.map((question, index) => {
                  const showReadingHint = canShowAutomaticReadingHint(section.id, question.question);
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
                              <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback={showReadingHint}
                                html={question.passage}
                                contentClassName="p-4 max-h-[200px] overflow-y-auto text-sm text-[#EAE6DD] leading-relaxed font-mincho [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B] text-left"
                                kanaClassName="px-4 pb-2 font-mincho text-sm text-[#D6AD4F]"
                                romajiClassName="px-4 pb-3 text-xs italic text-[#A9A398]"
                              />
                            </div>
                          )}

                          <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback={showReadingHint}
                            html={question.question}
                            contentClassName="text-[#EAE6DD] font-mincho mb-4 text-lg [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B]"
                            kanaClassName="mt-1 font-mincho text-sm text-[#D6AD4F]"
                            romajiClassName="mt-1 text-xs italic text-[#A9A398]"
                          />

                          <div className="space-y-1 text-sm mb-4">
                            <p className="text-[#A3A099]">
                              Jawaban kamu:{" "}
                              <span className={isUnanswered ? "text-yellow-500" : isCorrect ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                                {isUnanswered ? "Tidak dijawab" : question.type === "sentence-composition" ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-[#B8860B]/15 px-1.5 text-xs font-bold text-[#D9AD42]">
                                  {userAnswer + 1}
                                </span>
                                <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback={showReadingHint} html={question.options[userAnswer]} contentClassName="inline font-mincho" kanaClassName="text-xs font-mincho text-[#D6AD4F]" romajiClassName="text-[10px] italic text-[#A9A398]" />
                              </span>
                            ) : <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback={showReadingHint} html={question.options[userAnswer]} contentClassName="inline font-mincho" kanaClassName="text-xs font-mincho text-[#D6AD4F]" romajiClassName="text-[10px] italic text-[#A9A398]" />}
                              </span>
                            </p>

                            {!isCorrect && (
                              <p className="text-[#A3A099]">
                                Jawaban benar:{" "}
                                <span className="text-green-500 font-bold">
                                  {question.type === "sentence-composition" && (
                                    <span className="mr-2 text-xs">Nomor {question.answer + 1}:</span>
                                  )}
                                  <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback={showReadingHint} html={question.options[question.answer]} contentClassName="inline font-mincho" kanaClassName="text-xs font-mincho text-[#D6AD4F]" romajiClassName="text-[10px] italic text-[#A9A398]" />
                                </span>
                              </p>
                            )}
                          </div>

                          <div className="bg-[#121110]/50 p-3 rounded-lg border border-[#33312E]/50">
                            <p className="text-xs font-bold text-[#B8860B] mb-1">
                              PENJELASAN
                            </p>

                            {question.type === "sentence-composition" && question.correctOrder && (
                              <p className="mb-2 text-xs font-bold text-[#D9AD42]">
                                Urutan lengkap: {question.correctOrder.join(" → ")}
                              </p>
                            )}

                            <JapaneseReading showKana={false} showRomaji={false}
                              html={question.explanation}
                              allowIndexFallback
                              contentClassName="text-sm text-[#A3A099] leading-relaxed"
                              kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]"
                              romajiClassName="mt-1 text-xs italic text-[#A9A398]"
                            />
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
  const showReadingHint = currentQ
    ? canShowAutomaticReadingHint(activeSection, currentQ.question)
    : false;
  const audioUnavailable = Boolean(
    currentQ?.audioUrl && audioUnavailableUrl === currentQ.audioUrl
  );

  return (
    <>
      {storageError && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
        >
          {storageError}
        </div>
      )}

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

        {isTimedExam && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#B8860B]/30 bg-[#B8860B]/5 p-4">
            <div>
              <p className="text-sm font-bold text-[#EAE6DD]">
                {EXAM_BLOCK_CONFIG[activeExamBlock].label}
              </p>
              <p className="mt-1 text-xs text-[#A3A099]">
                {activeExamBlock === "grammar-reading"
                  ? "Tata bahasa dan membaca memakai satu alokasi waktu gabungan."
                  : "Waktu sesi mulai berjalan saat bagian ini pertama kali dibuka."}
              </p>
            </div>
            <span className={`rounded-lg px-3 py-2 text-sm font-black tabular-nums ${
              isActiveBlockExpired
                ? "bg-red-500/10 text-red-300"
                : "bg-[#B8860B]/15 text-[#D9AD42]"
            }`}>
              {isActiveBlockExpired
                ? "WAKTU HABIS"
                : remainingSeconds === null
                  ? "Menyiapkan timer..."
                  : `Sisa waktu ${formatExamTime(remainingSeconds)}`}
            </span>
          </div>
        )}

        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
          {SECTIONS.map((section) => {
            const hasQuestions =
              (testSet.sections?.[section.id] || []).length > 0;

            if (!hasQuestions) return null;

            const isActive = activeSection === section.id;
            const sectionQuestions = testSet.sections?.[section.id] || [];
            const sectionAnswered = sectionQuestions.reduce(
              (count, _question, index) =>
                count + (userAnswers[section.id]?.[index] !== undefined ? 1 : 0),
              0
            );

            return (
              <button
                key={section.id}
                onClick={() => goToSection(section.id)}
                disabled={isTimedExam && expiredExamBlocks.includes(getExamBlockId(section.id))}
                aria-current={isActive ? "step" : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#C93438] text-white shadow-lg"
                    : "bg-[#262523] border border-[#33312E] text-[#A3A099] hover:text-[#EAE6DD]"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                <span>{section.label}</span>
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] leading-none ${
                  isActive ? "bg-white/15 text-white" : "bg-[#121110] text-[#A3A099]"
                }`}>
                  {sectionAnswered}/{sectionQuestions.length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mb-6 rounded-xl border border-[#33312E] bg-[#262523] p-4">
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-[#EAE6DD]">Progress keseluruhan</span>
            <span className="shrink-0 font-bold tabular-nums text-[#D9AD42]">
              {answeredQuestions}/{totalQuestions} soal
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Progress keseluruhan ujian"
            aria-valuemin={0}
            aria-valuemax={totalQuestions}
            aria-valuenow={answeredQuestions}
            className="h-2 overflow-hidden rounded-full bg-[#121110]"
          >
            <div
              className="h-full rounded-full bg-[#B8860B] transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[#A3A099]">
            {totalUnanswered} soal belum dijawab
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-[#33312E] bg-[#1A1918] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-[#EAE6DD]">Navigasi nomor soal</span>
            <span className="text-xs text-[#A3A099]">
              {currentQuestions.filter((_question, index) => userAnswers[activeSection]?.[index] !== undefined).length}/{totalQuestionsInSection} dijawab
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
            {currentQuestions.map((_question, index) => {
              const isCurrent = currentIndex === index;
              const isQuestionAnswered = userAnswers[activeSection]?.[index] !== undefined;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    saveProgress(activeSection, index);
                    setCurrentIndex(index);
                  }}
                  aria-label={`Buka soal ${index + 1}${isQuestionAnswered ? ", sudah dijawab" : ", belum dijawab"}`}
                  aria-current={isCurrent ? "step" : undefined}
                  title={`Soal ${index + 1}${isQuestionAnswered ? " · Sudah dijawab" : " · Belum dijawab"}`}
                  disabled={isActiveBlockExpired}
                  className={`flex h-10 min-w-0 items-center justify-center rounded-lg border text-sm font-bold tabular-nums transition-colors ${
                    isCurrent
                      ? "border-[#C93438] bg-[#C93438] text-white shadow-md shadow-[#C93438]/20"
                      : isQuestionAnswered
                        ? "border-[#B8860B]/40 bg-[#B8860B]/10 text-[#D9AD42] hover:bg-[#B8860B]/20"
                        : "border-[#33312E] bg-[#262523] text-[#A3A099] hover:border-[#777067] hover:text-[#EAE6DD]"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#A3A099]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-[#B8860B]" />
              Sudah dijawab
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm border border-[#777067] bg-[#262523]" />
              Belum dijawab
            </span>
          </div>
        </div>

        {currentQ ? (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#C93438] bg-[#C93438]/10 px-2 py-1 rounded-md uppercase tracking-wider">
                  {SECTIONS.find(
                    (section) => section.id === activeSection
                  )?.label}
                </span>
                {currentQ.itemType && getItemTypeLabel(currentQ.itemType) && (
                  <span className="rounded-md border border-[#33312E] bg-[#262523] px-2 py-1 text-[11px] font-semibold text-[#D9AD42]">
                    {getItemTypeLabel(currentQ.itemType)}
                  </span>
                )}
              </div>

              <span className="text-xs font-bold text-[#A3A099]">
                SOAL {currentIndex + 1} / {totalQuestionsInSection}
              </span>
            </div>

            {currentQ.passage && (
              <div className="bg-[#1A1918] border-l-4 border-[#B8860B] rounded-r-xl mb-6 shadow-md">
                <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback
                  html={currentQ.passage}
                  contentClassName="p-5 md:p-6 text-[#EAE6DD] text-base md:text-lg leading-[2] font-mincho [&_rt]:text-[0.55em] [&_rt]:text-[#B8860B] text-left"
                  kanaClassName="px-5 md:px-6 pb-1 font-mincho text-sm md:text-base text-[#D6AD4F]"
                  romajiClassName="px-5 md:px-6 pb-3 text-xs italic text-[#A9A398]"
                />
              </div>
            )}

            {currentQ.audioUrl && (
              <div className="bg-[#121110] border border-[#33312E] p-6 rounded-xl mb-6 flex flex-col items-center justify-center gap-4 shadow-inner">
                {audioUnavailable ? (
                  <>
                    <AlertTriangle size={32} className="text-amber-400" />
                    <div className="text-center">
                      <p className="font-bold text-amber-200">
                        Audio belum tersedia
                      </p>
                      <p className="mt-1 text-sm text-[#A3A099]">
                        Bagian ini bisa dikerjakan setelah file audio dipublikasikan.
                      </p>
                    </div>
                  </>
                ) : (
                  <FudeAudioPlayer
                    key={currentQ.audioUrl}
                    src={currentQ.audioUrl}
                    onUnavailable={() => setAudioUnavailableUrl(currentQ.audioUrl ?? null)}
                  />
                )}
              </div>
            )}

            {isActiveBlockExpired && (
              <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-200">
                Waktu sesi ini sudah habis dan jawaban pada sesi ini dikunci. {nextTimedSectionAfterExpiry
                  ? "Lanjutkan ke sesi berikutnya untuk mengerjakan bagian yang masih memiliki waktu."
                  : "Waktu ujian sudah selesai. Kirim jawaban yang tersimpan untuk melihat hasil."}
              </div>
            )}

            {currentQ.type === "sentence-composition" && (
              <div className="mb-5 rounded-xl border border-[#B8860B]/25 bg-[#B8860B]/5 p-4">
                <p className="mb-1 text-xs font-bold tracking-wide text-[#D9AD42]">
                  文の組み立て · PENYUSUNAN KALIMAT
                </p>
                <p className="text-sm leading-relaxed text-[#C9C2B5]">
                  Susun keempat potongan menjadi kalimat yang benar, lalu pilih nomor potongan yang berada di posisi ★.
                </p>
              </div>
            )}

            <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback={showReadingHint}
              html={currentQ.question}
              contentClassName="text-xl md:text-2xl font-bold text-[#EAE6DD] mb-2 text-center leading-[2] font-mincho [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B]"
              kanaClassName="mt-1 font-mincho text-sm md:text-base text-[#D6AD4F] text-center"
              romajiClassName="mt-1 text-xs italic text-[#A9A398] text-center mb-6"
            />

            {currentQ.type === "sentence-composition" ? (
              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentQ.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAnswer(index)}
                      disabled={audioUnavailable || isActiveBlockExpired}
                      aria-label={`Pilih potongan nomor ${index + 1}`}
                      className={`flex min-h-[68px] w-full items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all ${isSelected
                        ? "border-[#C93438] bg-[#C93438] text-white shadow-lg shadow-[#C93438]/20"
                        : "border-[#33312E] bg-[#262523] text-[#EAE6DD] hover:border-[#C93438]"
                      }`}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black ${isSelected ? "bg-white/15 text-white" : "bg-[#B8860B]/15 text-[#D9AD42]"}`}>
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback={showReadingHint}
                          html={option}
                          contentClassName="font-mincho text-base md:text-lg [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B]"
                          kanaClassName="mt-1 font-mincho text-sm text-[#F4DFA7]"
                          romajiClassName="mt-1 text-xs italic text-white/75"
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
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
                      disabled={audioUnavailable || isActiveBlockExpired}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all text-base md:text-lg font-mincho [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B] ${buttonClass} disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback={showReadingHint}
                        html={option}
                        contentClassName="font-mincho text-base md:text-lg [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B]"
                        kanaClassName="mt-1 font-mincho text-sm text-[#F4DFA7]"
                        romajiClassName="mt-1 text-xs italic text-white/75"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-[#33312E]/50 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={previousQuestion}
                disabled={!hasPreviousQuestion() || isActiveBlockExpired}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#33312E] bg-[#262523] px-5 py-4 font-bold text-[#EAE6DD] transition-colors hover:border-[#777067] hover:bg-[#33312E] disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[190px]"
              >
                <ChevronLeft size={18} />
                Soal Sebelumnya
              </button>

              <button
                onClick={handlePrimaryExamAction}
                disabled={!isActiveBlockExpired && (!isAnswered || audioUnavailable)}
                className={`flex-1 rounded-xl py-4 text-lg font-bold transition-all ${
                  isAnswered || isActiveBlockExpired
                    ? "bg-[#B8860B] text-white hover:bg-[#9a7009] shadow-lg shadow-[#B8860B]/20"
                    : "bg-[#33312E] text-[#A3A099] cursor-not-allowed"
                }`}
              >
                {isActiveBlockExpired
                  ? nextTimedSectionAfterExpiry ? "Lanjut ke Sesi Berikutnya" : "Kirim Hasil"
                  : currentIndex === totalQuestionsInSection - 1
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
                {isFinalTimedBlockExpired ? "Waktu Ujian Habis" : "Selesaikan Ujian?"}
              </h3>

              {isFinalTimedBlockExpired ? (
                <p className="text-[#D9AD42] font-bold bg-[#B8860B]/10 p-3 rounded-lg text-sm border border-[#B8860B]/20">
                  Waktu seluruh sesi ujian sudah habis. Jawaban yang tersimpan akan dikumpulkan dan soal kosong dihitung salah.
                </p>
              ) : totalQuestions === 0 ? (
                <p className="text-[#C93438] font-bold bg-[#C93438]/10 p-3 rounded-lg text-sm border border-[#C93438]/20">
                  Set ini belum memiliki soal. Ujian belum bisa diselesaikan.
                </p>
              ) : totalUnanswered > 0 ? (
                <p className="text-[#C93438] font-bold bg-[#C93438]/10 p-3 rounded-lg text-sm border border-[#C93438]/20">
                  {isTimedExam
                    ? `Masih ada ${totalUnanswered} soal kosong. Jawaban kosong akan dihitung salah dalam hasil latihan.`
                    : `Perhatian: Masih ada ${totalUnanswered} soal yang belum kamu jawab!`}
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
                disabled={cannotFinish}
                onClick={() => {
                  // Pada sesi bertimer, jawaban kosong diperbolehkan dan dinilai salah.
                  if (cannotFinish) return;

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
                    examDeadlines,
                    expiredExamBlocks,
                    activeSection,
                    currentIndex,
                    sectionPositions,
                  };

                  if (!persistQuizResult(storageKey, savedResult)) {
                    setStorageError("Hasil ujian belum berhasil disimpan. Periksa penyimpanan perangkat, lalu coba lagi.");
                    return;
                  }

                  setStorageError(null);

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
                  cannotFinish
                    ? "bg-[#33312E] text-[#817A73] cursor-not-allowed shadow-none"
                    : "bg-[#C93438] text-white hover:bg-[#B02A2E] shadow-[#C93438]/20"
                }`}
              >
                {isFinalTimedBlockExpired ? "Kirim Hasil" : "Ya, Selesaikan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
