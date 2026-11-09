
"use client";

import { useState, useEffect } from "react";
import { RotateCcw, X } from "lucide-react";

// =====================================================
// TYPES
// =====================================================

type VocabItem = {
  kanji?: string;
  kana?: string;
  meaning?: string;
};

type GrammarQuizItem = {
  question?: string;
  sentence: string;
  answer: string;
  options: string[];
  explanation?: string;
};

type GrammarItem = {
  pattern?: string;
  formula?: string;
  meaning?: string;
  explanation?: string;
  examples?: {
    kanji?: string;
    id?: string;
  }[];
  quiz?: GrammarQuizItem[];
};

type QuizBankItem = {
  id?: string;
  type?: string;
  question?: string;
  sentence?: string;
  answer?: string;
  options?: string[];
  explanation?: string;
};

type Question = {
  id?: string;
  type: "grammar" | "vocab";
  question: string;
  sentence: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
};

// =====================================================
// RANDOMIZER - FISHER YATES
// =====================================================

function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// =====================================================
// VALIDATE OPTIONS
// =====================================================

function validateOptions(
  correct: string,
  candidates: string[]
): string[] {
  const unique = Array.from(
    new Set(
      candidates
        .filter((value) => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );

  if (!unique.includes(correct.trim())) {
    return [];
  }

  // Maksimal 4 pilihan.
  return shuffle(unique).slice(0, 4);
}

// =====================================================
// QUESTION GENERATOR
// =====================================================

function buildQuizQuestions(
  vocab: VocabItem[],
  grammar: GrammarItem[]
): Question[] {
  const vocabQuestions: Question[] = [];
  const grammarQuestions: Question[] = [];

  // ---------------------------------------------------
  // 1. VOCABULARY QUESTIONS
  // ---------------------------------------------------

  const validVocab = vocab.filter(
    (v) =>
      typeof v.kanji === "string" &&
      v.kanji.trim() &&
      typeof v.meaning === "string" &&
      v.meaning.trim()
  );

  shuffle(validVocab).forEach((item) => {
    const correct = item.meaning!.trim();

    const candidates = validVocab
      .filter((v) => v.meaning!.trim() !== correct)
      .map((v) => v.meaning!.trim());

    const options = validateOptions(correct, [
      correct,
      ...shuffle(candidates).slice(0, 3),
    ]);

    // Jangan buat soal jika pilihan tidak cukup.
    if (options.length < 2) return;

    vocabQuestions.push({
      type: "vocab",
      question: "Apa arti dari kata berikut?",
      sentence: item.kana
        ? `${item.kanji} (${item.kana})`
        : item.kanji!,
      correctAnswer: correct,
      options,
      explanation: `Arti kata ${item.kanji} adalah ${correct}.`,
    });
  });

  // ---------------------------------------------------
  // 2. GRAMMAR QUESTIONS
  // ---------------------------------------------------

  grammar.forEach((g) => {
    if (!Array.isArray(g.quiz)) return;

    g.quiz.forEach((item) => {
      const sentence = item.sentence?.trim();
      const answer = item.answer?.trim();

      if (!sentence || !answer) return;

      // Soal harus memiliki bagian rumpang.
      if (!sentence.includes("___")) return;

      if (!Array.isArray(item.options)) return;

      const options = validateOptions(answer, item.options);

      // Minimal 2 pilihan unik dan jawaban harus tersedia.
      if (options.length < 2) return;

      grammarQuestions.push({
        type: "grammar",
        question:
          item.question ||
          "Lengkapi kalimat berikut dengan pilihan yang tepat.",
        sentence,
        correctAnswer: answer,
        options,
        explanation:
          item.explanation ||
          g.explanation ||
          g.meaning ||
          "Pelajari kembali pola grammar ini.",
      });
    });
  });

  // ---------------------------------------------------
  // 3. COMPOSITION
  // Target: 3 grammar + 2 vocabulary
  // ---------------------------------------------------

  const selectedGrammar = shuffle(grammarQuestions).slice(0, 3);
  const selectedVocab = shuffle(vocabQuestions).slice(0, 2);

  let generated = [
    ...selectedGrammar,
    ...selectedVocab,
  ];

  // Isi slot kosong dengan soal valid yang belum dipakai.
  if (generated.length < 5) {
    const remaining = shuffle([
      ...grammarQuestions.filter(
        (q) => !selectedGrammar.includes(q)
      ),
      ...vocabQuestions.filter(
        (q) => !selectedVocab.includes(q)
      ),
    ]);

    generated = [
      ...generated,
      ...remaining.slice(0, 5 - generated.length),
    ];
  }

  return shuffle(generated).slice(0, 5);
}

function buildQuestionsFromBank(
  bankQuestions: QuizBankItem[]
): Question[] {
  return bankQuestions.flatMap((item, index) => {
    const sentence = item.sentence?.trim();
    const answer = item.answer?.trim();

    if (!sentence || !answer) return [];
    if (!sentence.includes("___")) return [];
    if (!Array.isArray(item.options)) return [];

    const uniqueOptions = Array.from(
      new Set(
        item.options
          .map((option) => option.trim())
          .filter(Boolean)
      )
    );

    if (!uniqueOptions.includes(answer)) return [];

    const wrongOptions = shuffle(
      uniqueOptions.filter((option) => option !== answer)
    ).slice(0, 3);

    const options = shuffle([
      answer,
      ...wrongOptions,
    ]);

    if (options.length < 2) return [];

    return [{
      id: item.id || `bab-question-${index + 1}`,
      type: item.type === "vocab" ? "vocab" : "grammar",
      question:
      item.question ||
      "Pilih jawaban yang paling tepat untuk melengkapi kalimat berikut.",
      sentence,
      correctAnswer: answer,
      options,
      explanation:
        item.explanation || "文全体の意味を確認しましょう。",
    }];
  });
}

function pickQuestionsForAttempt(
  pool: Question[],
  babNumber: number
): Question[] {
  if (pool.length === 0) return [];

  const normalizedPool = pool.map((q, index) => ({
    ...q,
    id: q.id || `bab-${babNumber}-question-${index + 1}`,
  }));

  const storageKey = `jp-quiz-remaining-bab-${babNumber}`;

  let remainingIds: string[] = [];

  try {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      const parsed: unknown = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        remainingIds = parsed.filter(
          (id): id is string => typeof id === "string"
        );
      }
    }
  } catch {
    remainingIds = [];
  }

  const validIds = new Set(
    normalizedPool.map((q) => q.id)
  );

  remainingIds = [
    ...new Set(remainingIds.filter((id) => validIds.has(id))),
  ];

  if (remainingIds.length === 0) {
    remainingIds = shuffle(
      normalizedPool.map((q) => q.id)
    );
  }

  const selectedIds: string[] = [];
  const targetCount = Math.min(5, normalizedPool.length);

  while (selectedIds.length < targetCount) {
    if (remainingIds.length === 0) {
      const selectedSet = new Set(selectedIds);

      remainingIds = shuffle(
        normalizedPool
          .map((q) => q.id)
          .filter((id) => !selectedSet.has(id))
      );
    }

    const nextId = remainingIds.shift();

    if (nextId && !selectedIds.includes(nextId)) {
      selectedIds.push(nextId);
    }
  }

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(remainingIds)
    );
  } catch {
    // Kuis tetap berjalan jika penyimpanan tidak tersedia.
  }

  const questionMap = new Map(
    normalizedPool.map((q) => [q.id, q])
  );

const selectedQuestions: Question[] = [];

selectedIds.forEach((id) => {
  const question = questionMap.get(id);

  if (question) {
    selectedQuestions.push(question);
  }
});

return shuffle(selectedQuestions);
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function Quiz({
  vocab = [],
  grammar = [],
  grammarQuestions,
  babNumber = 1,
  onPass,
  onClose,
}: {
  vocab?: VocabItem[];
  grammar?: GrammarItem[];
  grammarQuestions?: QuizBankItem[];
  babNumber?: number;
  onPass: () => void;
  onClose: () => void;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // ---------------------------------------------------
  // RESET QUIZ
  // ---------------------------------------------------

  const resetQuiz = () => {
  const questionPool = buildQuestionsFromBank(
  grammarQuestions || []
  );

  const newQuestions = pickQuestionsForAttempt(
    questionPool,
    babNumber
  );

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  useEffect(() => {
  resetQuiz();
  }, [grammarQuestions, babNumber]);

  // ---------------------------------------------------
  // ANSWER
  // ---------------------------------------------------

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === questions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  // ---------------------------------------------------
  // NEXT QUESTION
  // ---------------------------------------------------

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  // ---------------------------------------------------
  // EMPTY STATE
  // ---------------------------------------------------

  if (questions.length === 0) {
    return (
      <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-8 text-center relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A3A099] hover:text-white"
        >
          <X size={20} />
        </button>

        <p className="text-[#A3A099]">
          Belum cukup data untuk membuat soal pada bab ini.
        </p>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-[#33312E] text-white rounded-lg"
        >
          Tutup
        </button>
      </div>
    );
  }

  const passingScore = Math.ceil(questions.length * 0.8);

  // ---------------------------------------------------
  // RESULT
  // ---------------------------------------------------

  if (isFinished) {
    const isPassed = score >= passingScore;

    return (
      <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-8 text-center shadow-2xl relative max-h-[90vh] overflow-y-auto w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A3A099] hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-bold text-[#EAE6DD] mb-2">
          Kuis Selesai!
        </h3>

        <p className="text-[#A3A099] mb-6">
          Skor kamu:{" "}
          <span className="font-bold text-[#C93438]">
            {score} / {questions.length}
          </span>
        </p>

        {isPassed ? (
          <div className="space-y-4">
            <p className="text-green-500 font-bold mb-4">
              Hebat! Kamu lulus dan bisa lanjut.
            </p>

            <button
              onClick={onPass}
              className="w-full bg-[#C93438] text-white font-bold py-3 rounded-xl hover:bg-[#B02A2E] transition-colors"
            >
              Lanjut
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-red-500 font-bold mb-4">
              Yah, kamu belum lulus. Minimal harus benar {passingScore} soal.
            </p>

            <button
              onClick={resetQuiz}
              className="w-full flex items-center justify-center gap-2 bg-[#33312E] text-[#EAE6DD] font-bold py-3 rounded-xl hover:bg-[#44413D] transition-colors"
            >
              <RotateCcw size={18} />
              Ulangi Kuis
            </button>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------
  // QUESTION VIEW
  // ---------------------------------------------------

  const currentQ = questions[currentIndex];

  return (
    <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto w-full">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-[#A3A099] hover:text-white transition-colors bg-[#262523] p-1.5 rounded-full"
      >
        <X size={18} />
      </button>

      <div className="flex justify-between items-center mb-6 pr-8">
        <span className="text-xs font-bold text-[#A3A099]">
          SOAL {currentIndex + 1} DARI {questions.length}
        </span>

        <span className="text-xs font-bold text-[#B8860B]">
          Skor: {score}
        </span>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-[#A3A099] mb-2">
          {currentQ.question}
        </p>

        <h3
          className="text-2xl font-bold text-[#EAE6DD] font-mincho leading-[2.5] [&_rt]:text-[0.5em] break-words"
          dangerouslySetInnerHTML={{
            __html: currentQ.sentence,
          }}
        />
      </div>

      <div className="space-y-3">
        {currentQ.options.map((opt, i) => {
          let btnClass =
            "bg-[#262523] border-[#33312E] text-[#EAE6DD] hover:border-[#C93438]/50";

          if (isAnswered) {
            if (opt === currentQ.correctAnswer) {
              btnClass =
                "bg-green-900/30 border-green-500 text-green-200";
            } else if (opt === selectedAnswer) {
              btnClass =
                "bg-red-900/30 border-red-500 text-red-200";
            } else {
              btnClass =
                "bg-[#1A1918] border-[#33312E] opacity-50";
            }
          }

          return (
            <button
              key={`${currentIndex}-${i}`}
              onClick={() => handleAnswer(opt)}
              disabled={isAnswered}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${btnClass}`}
            >
              <span dangerouslySetInnerHTML={{ __html: opt }} />
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-6 space-y-4">
          <div className="text-sm text-[#B8860B] italic">
            {selectedAnswer === currentQ.correctAnswer
              ? "Benar! "
              : `Jawaban yang benar: ${currentQ.correctAnswer}. `}

            <span className="block mt-2 text-[#A3A099] not-italic leading-relaxed">
              {currentQ.explanation}
            </span>
          </div>

          <div className="flex justify-end">
            <button
              onClick={nextQuestion}
              className="bg-[#C93438] text-white font-bold px-6 py-2 rounded-lg hover:bg-[#B02A2E] whitespace-nowrap"
            >
              {currentIndex === questions.length - 1
                ? "Lihat Hasil"
                : "Selanjutnya"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
