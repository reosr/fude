"use client";

import { useState } from "react";
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, PlayCircle } from "lucide-react";
// Import data jlpt.json lo
import jlptData from "@/data/jlpt.json"; 

export default function HomeQuiz() {
  // Ambil data N5, Set 1, bagian Vocab
  const n5Set1 = jlptData.find((d) => d.level === "N5")?.sets[0];
  const questions = n5Set1?.sections.vocab || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (!currentQuestion) return <div className="text-white">Data soal belum siap.</div>;

  if (isFinished) {
    return (
      <div className="bg-[#1E1D1B] border border-[#C93438]/30 rounded-2xl p-8 text-center shadow-xl">
        <Trophy className="mx-auto text-[#B8860B] mb-4" size={48} />
        <h3 className="text-2xl font-bold text-[#EAE6DD] mb-2">Kuis Selesai!</h3>
        <p className="text-[#A3A099] mb-6">
          Skor kamu: <span className="text-[#B8860B] font-bold text-xl">{score}</span> dari {questions.length}
        </p>
        <button
          onClick={resetQuiz}
          className="flex items-center gap-2 mx-auto bg-[#C93438] text-white px-6 py-3 rounded-xl hover:bg-[#B02A2E] transition-colors font-bold"
        >
          <RotateCcw size={20} /> Ulangi Kuis
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      
      {/* Header: Level & Progress */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <span className="text-xs font-bold text-[#B8860B] bg-[#B8860B]/10 px-2 py-1 rounded-md border border-[#B8860B]/20">
          N5 Vocab
        </span>
        <span className="text-sm text-[#A3A099]">
          Soal {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Pertanyaan (Pakai dangerouslySetInnerHTML buat render <ruby>) */}
      <div className="text-center mb-8 relative z-10 min-h-[100px] flex flex-col justify-center">
        <p 
          className="text-xl md:text-2xl text-[#EAE6DD] leading-relaxed font-mincho"
          dangerouslySetInnerHTML={{ __html: currentQuestion.question }} 
        />
      </div>

      {/* Pilihan Jawaban */}
      <div className="grid grid-cols-1 gap-3 mb-6 relative z-10">
        {currentQuestion.options.map((option, index) => {
          const isCorrect = index === currentQuestion.answer;
          const isSelected = index === selectedAnswer;
          
          let buttonClass = "bg-[#262523] border-[#33312E] hover:border-[#C93438] text-[#EAE6DD]";
          if (isAnswered) {
            if (isCorrect) buttonClass = "bg-green-900/20 border-green-500 text-green-400";
            else if (isSelected) buttonClass = "bg-red-900/20 border-red-500 text-red-400";
            else buttonClass = "bg-[#1A1918] border-[#33312E] text-[#A3A099] opacity-50";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={isAnswered}
              className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between font-medium ${buttonClass}`}
            >
              <span dangerouslySetInnerHTML={{ __html: option }} />
              {isAnswered && isCorrect && <CheckCircle size={20} />}
              {isAnswered && isSelected && !isCorrect && <XCircle size={20} />}
            </button>
          );
        })}
      </div>

      {/* Penjelasan (Muncul kalau udah jawab) */}
      {isAnswered && (
        <div className="mb-6 p-4 rounded-xl bg-[#1A1918] border border-[#33312E] text-sm text-[#A3A099] animate-in fade-in">
          <span className="font-bold text-[#B8860B]">Penjelasan: </span>
          <span dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }} />
        </div>
      )}

      {/* Tombol Next */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 bg-[#C93438] text-white font-bold py-4 rounded-xl hover:bg-[#B02A2E] transition-all relative z-10 animate-in fade-in slide-in-from-bottom-2"
        >
          {currentIndex === questions.length - 1 ? "Lihat Hasil" : "Soal Selanjutnya"}
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}