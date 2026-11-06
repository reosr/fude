"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Volume2, Trophy, CheckCircle2, XCircle, BookOpen, RotateCcw, AlertTriangle } from "lucide-react";

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
}

const SECTIONS = [
  { id: "vocab", label: "Kosakata (文字・語彙)" },
  { id: "grammar", label: "Grammar (文法)" },
  { id: "reading", label: "Membaca (読解)" },
  { id: "listening", label: "Mendengar (聴解)" },
];

export default function JLPTQuiz({ testSet, onBack }: JLPTQuizProps) {
  const [activeSection, setActiveSection] = useState<string>("vocab");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, Record<number, number>>>({
    vocab: {}, grammar: {}, reading: {}, listening: {}
  });
  
  const [isFinished, setIsFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // STATE UNTUK POP-UP KONFIRMASI
  const [showConfirm, setShowConfirm] = useState(false);

  const storageKey = `jlpt_result_${testSet.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setUserAnswers(parsed.answers);
        if (parsed.isFinished) setIsFinished(parsed.isFinished);
      } catch (e) {
        console.error("Gagal load data", e);
      }
    }
    setIsLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (isFinished && isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify({ answers: userAnswers, isFinished: true }));
    }
  }, [isFinished, userAnswers, storageKey, isLoaded]);

  const handleReset = () => {
    localStorage.removeItem(storageKey);
    setUserAnswers({ vocab: {}, grammar: {}, reading: {}, listening: {} });
    setIsFinished(false);
    setShowReview(false);
    setActiveSection("vocab");
    setCurrentIndex(0);
    setShowConfirm(false);
  };

  const currentQuestions: Question[] = testSet.sections[activeSection] || [];
  const currentQ = currentQuestions[currentIndex];
  const totalQuestionsInSection = currentQuestions.length;

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeSection]);

  const handleAnswer = (optIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        [currentIndex]: optIndex,
      },
    }));
  };

  // CEK TOTAL SOAL KOSONG (BUAT PERINGATAN DI POP-UP)
  let totalUnanswered = 0;
  SECTIONS.forEach((sec) => {
    const qs = testSet.sections[sec.id] || [];
    qs.forEach((q: any, i: number) => {
      if (userAnswers[sec.id][i] === undefined) totalUnanswered++;
    });
  });

  const nextQuestion = () => {
    if (currentIndex < totalQuestionsInSection - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const currentSectionIndex = SECTIONS.findIndex(s => s.id === activeSection);
      if (currentSectionIndex < SECTIONS.length - 1) {
        setActiveSection(SECTIONS[currentSectionIndex + 1].id);
      } else {
        // MUNCULIN POP-UP KONFIRMASI KETIKA KLIK SELESAIKAN UJIAN
        setShowConfirm(true);
      }
    }
  };

  // Hitung Skor
  let totalCorrect = 0;
  let totalQuestions = 0;

  SECTIONS.forEach((sec) => {
    const qs = testSet.sections[sec.id] || [];
    totalQuestions += qs.length;
    qs.forEach((q: any, i: number) => {
      if (userAnswers[sec.id][i] === q.answer) totalCorrect++;
    });
  });

  const totalScorePercent = totalQuestions === 0 ? 0 : Math.round((totalCorrect / totalQuestions) * 100);

  if (!isLoaded) return null; 

  // ==========================================
  // TAMPILAN 1: HALAMAN HASIL SKOR
  // ==========================================
  if (isFinished && !showReview) {
    return (
      <div className="bg-[#1E1D1B] border border-[#33312E] rounded-3xl p-8 text-center shadow-xl mt-8 animate-in fade-in zoom-in-95">
        <Trophy className="mx-auto text-[#B8860B] mb-4" size={64} />
        <h3 className="text-3xl font-bold text-[#EAE6DD] mb-2">Ujian Selesai!</h3>
        <p className="text-[#A3A099] mb-8">Berikut adalah rincian skor kamu untuk {testSet.title}.</p>

        <div className="bg-[#262523] border border-[#B8860B]/30 rounded-2xl p-6 mb-8 max-w-md mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#B8860B]/10 rounded-full blur-2xl -mr-5 -mt-5"></div>
          <p className="text-sm font-bold text-[#B8860B] uppercase tracking-wider mb-2">Total Skor Akhir</p>
          <div className="flex items-end justify-center gap-1">
            <span className="text-6xl font-black text-[#EAE6DD]">{totalScorePercent}</span>
            <span className="text-2xl font-bold text-[#A3A099] mb-2">%</span>
          </div>
          <p className="text-sm text-[#A3A099] mt-2">{totalCorrect} Benar dari {totalQuestions} Soal</p>
        </div>

        <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
          {SECTIONS.map((sec) => {
            const qs = testSet.sections[sec.id] || [];
            if (qs.length === 0) return null;
            
            let correct = 0;
            qs.forEach((q: any, i: number) => {
              if (userAnswers[sec.id][i] === q.answer) correct++;
            });
            const scorePercent = Math.round((correct / qs.length) * 100);

            return (
              <div key={sec.id} className="bg-[#1A1918] border border-[#33312E] p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-[#EAE6DD]">{sec.label}</p>
                  <p className="text-xs text-[#A3A099]">{qs.length} Soal</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${scorePercent >= 60 ? 'text-green-500' : 'text-red-500'}`}>{scorePercent}%</p>
                  <p className="text-xs text-[#A3A099]">{correct} Benar</p>
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
            <BookOpen size={18} /> Lihat Pembahasan
          </button>
          <button 
            onClick={handleReset} 
            className="flex-1 bg-[#33312E] text-white font-bold py-3 rounded-xl hover:bg-[#444] transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> Ulangi Ujian
          </button>
        </div>
        <button onClick={onBack} className="mt-4 text-sm font-bold text-[#A3A099] hover:text-[#EAE6DD]">
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
          <button onClick={() => setShowReview(false)} className="p-2 bg-[#262523] rounded-full hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="text-xl font-bold text-[#EAE6DD]">Pembahasan Jawaban</h3>
            <p className="text-xs text-[#A3A099]">{testSet.title}</p>
          </div>
        </div>

        <div className="space-y-8 overflow-y-auto pr-2" style={{ maxHeight: "60vh" }}>
          {SECTIONS.map((sec) => {
            const qs = testSet.sections[sec.id] || [];
            if (qs.length === 0) return null;

            return (
              <div key={sec.id} className="space-y-4">
                <h4 className="font-bold text-lg text-[#EAE6DD] border-l-4 border-[#C93438] pl-3 py-1 bg-[#C93438]/5">
                  {sec.label}
                </h4>
                
                {qs.map((q: any, i: number) => {
                  const userAnswer = userAnswers[sec.id][i];
                  const isCorrect = userAnswer === q.answer;
                  const isUnanswered = userAnswer === undefined;

                  return (
                    <div key={i} className={`p-4 rounded-xl border ${isCorrect ? 'border-green-900/50 bg-green-900/10' : 'border-red-900/50 bg-red-900/10'}`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 shrink-0">
                          {isCorrect ? <CheckCircle2 className="text-green-500" size={20} /> : <XCircle className="text-red-500" size={20} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#A3A099] mb-2">SOAL {i + 1}</p>
                          
                        {q.passage && (
                        <div className="bg-[#121110]/50 border-l-4 border-[#33312E] rounded-r-lg mb-3">
                        <div 
                            className="p-4 max-h-[200px] overflow-y-auto text-sm text-[#EAE6DD] leading-relaxed font-mincho [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B] text-left"
                            dangerouslySetInnerHTML={{ __html: q.passage }}
                        />
                        </div>
                        )}

                          <div 
                            className="text-[#EAE6DD] font-mincho mb-4 text-lg [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B]"
                            dangerouslySetInnerHTML={{ __html: q.question }} 
                          />

                          <div className="space-y-1 text-sm mb-4">
                            <p className="text-[#A3A099]">
                              Jawaban kamu: <span className={isUnanswered ? "text-yellow-500" : isCorrect ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                                {isUnanswered ? "Tidak dijawab" : q.options[userAnswer]}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-[#A3A099]">
                                Jawaban benar: <span className="text-green-500 font-bold">{q.options[q.answer]}</span>
                              </p>
                            )}
                          </div>

                          <div className="bg-[#121110]/50 p-3 rounded-lg border border-[#33312E]/50">
                            <p className="text-xs font-bold text-[#B8860B] mb-1">PENJELASAN</p>
                            <p className="text-sm text-[#A3A099] leading-relaxed">{q.explanation}</p>
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

        <div className="mt-6 pt-4 border-t border-[#33312E] flex justify-end gap-3">
          <button onClick={handleReset} className="bg-[#33312E] text-white font-bold py-2 px-6 rounded-xl hover:bg-[#444] transition-colors flex items-center gap-2">
            <RotateCcw size={16} /> Ulangi Ujian
          </button>
          <button onClick={() => setShowReview(false)} className="bg-[#B8860B] text-white font-bold py-2 px-6 rounded-xl hover:bg-[#9a7009] transition-colors">
            Kembali ke Skor
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN 3: UJIAN BERLANGSUNG
  // ==========================================
  const selectedAnswer = userAnswers[activeSection]?.[currentIndex];
  const isAnswered = selectedAnswer !== undefined;

  return (
    <>
      <div className="bg-[#1E1D1B] border border-[#33312E] rounded-3xl p-6 md:p-8 shadow-xl mt-4">
        <div className="flex items-center gap-3 border-b border-[#33312E] pb-4 mb-6">
          <button onClick={onBack} className="p-2 bg-[#262523] rounded-full hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="text-xl font-bold text-[#EAE6DD] leading-tight">{testSet.title}</h3>
            <p className="text-xs text-[#A3A099]">Simulasi Ujian JLPT</p>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
          {SECTIONS.map((sec) => {
            const hasQuestions = testSet.sections[sec.id]?.length > 0;
            if (!hasQuestions) return null;

            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  isActive 
                    ? "bg-[#C93438] text-white shadow-lg" 
                    : "bg-[#262523] border border-[#33312E] text-[#A3A099] hover:text-[#EAE6DD]"
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>

        {currentQ ? (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-[#C93438] bg-[#C93438]/10 px-2 py-1 rounded-md uppercase tracking-wider">
                {SECTIONS.find(s => s.id === activeSection)?.label}
              </span>
              <span className="text-xs font-bold text-[#A3A099]">SOAL {currentIndex + 1} / {totalQuestionsInSection}</span>
            </div>

            {currentQ.passage && (
            <div className="bg-[#1A1918] border-l-4 border-[#B8860B] rounded-r-xl mb-6 shadow-md">
            <div 
                className="p-5 md:p-6 max-h-[300px] overflow-y-auto text-[#EAE6DD] text-base md:text-lg leading-[2] font-mincho [&_rt]:text-[0.55em] [&_rt]:text-[#B8860B] pr-2 custom-scrollbar text-left"
                dangerouslySetInnerHTML={{ __html: currentQ.passage }}
            />
            </div>
            )}

            {currentQ.audioUrl && (
              <div className="bg-[#121110] border border-[#33312E] p-6 rounded-xl mb-6 flex flex-col items-center justify-center gap-4 shadow-inner">
                <Volume2 size={40} className="text-[#B8860B] animate-pulse" />
                <audio key={currentQ.audioUrl} controls className="w-full max-w-md">
                <source src={currentQ.audioUrl} type="audio/mpeg" />
                Browser kamu tidak mendukung audio.
                </audio>
              </div>
            )}

            <h3 
              className="text-xl md:text-2xl font-bold text-[#EAE6DD] mb-8 text-center leading-[2] font-mincho [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B]" 
              dangerouslySetInnerHTML={{ __html: currentQ.question }} 
            />

            <div className="space-y-3 mb-8">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                let btnClass = "bg-[#262523] border-[#33312E] text-[#EAE6DD] hover:border-[#C93438]";
                
                if (isSelected) {
                  btnClass = "bg-[#C93438] border-[#C93438] text-white shadow-lg shadow-[#C93438]/20";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all text-base md:text-lg font-mincho [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B] ${btnClass}`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: opt }} />
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
                  ? (activeSection === "listening" ? "Selesaikan Ujian" : "Lanjut ke Section Berikutnya") 
                  : "Soal Selanjutnya"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-[#A3A099] py-10">Belum ada soal untuk section ini.</div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL KONFIRMASI SELESAI UJIAN             */}
      {/* ========================================== */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-[#1A1918] border border-[#33312E] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 md:p-8 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#C93438]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C93438]/20">
                <AlertTriangle className="text-[#C93438]" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#EAE6DD] mb-2">Selesaikan Ujian?</h3>
              
              {totalUnanswered > 0 ? (
                <p className="text-[#C93438] font-bold bg-[#C93438]/10 p-3 rounded-lg text-sm border border-[#C93438]/20">
                  Perhatian: Masih ada {totalUnanswered} soal yang belum kamu jawab!
                </p>
              ) : (
                <p className="text-[#A3A099] text-sm">
                  Kamu sudah menjawab semua soal. Yakin ingin menyelesaikan ujian dan melihat hasilnya?
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
                onClick={() => {
                  setShowConfirm(false);
                  setIsFinished(true);
                }} 
                className="flex-1 bg-[#C93438] text-white font-bold py-3 rounded-xl hover:bg-[#B02A2E] transition-colors shadow-lg shadow-[#C93438]/20"
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