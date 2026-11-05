"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

export default function Quiz({ vocab, grammar, onPass }: { vocab: any[], grammar: any[], onPass: () => void }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, [vocab, grammar]);

  const generateQuestions = () => {
    let generatedQ: any[] = [];

    // 1. BUAT SOAL GRAMMAR (Isi Bagian Kosong) - Maksimal 3 soal
    if (grammar && grammar.length > 0) {
      const shuffledGrammar = [...grammar].sort(() => Math.random() - 0.5).slice(0, 3);
      
      shuffledGrammar.forEach((g) => {
        // Ambil yang ada Kanjinya dulu, kalau nggak ada baru pakai Hiragana
        const sentence = g.example_kanji || g.example_jp;
        
        // Cari partikel yang mau dikosongin (は, が, を, に, で, と)
        const particles = ['は', 'が', 'を', 'に', 'で', 'と', 'へ'];
        let targetParticle = '';
        let blankedSentence = sentence;

        // Cari partikel yang ada di dalam kalimat
        for (const p of particles) {
          if (sentence.includes(p)) {
            targetParticle = p;
            // Ganti partikel pertama yang ketemu dengan garis bawah
            blankedSentence = sentence.replace(p, ' ___ ');
            break;
          }
        }

        // Kalau ketemu partikel, bikin soal
        if (targetParticle) {
          // Pilihan jawaban (1 bener, 3 salah)
          const wrongOptions = particles.filter(p => p !== targetParticle).sort(() => Math.random() - 0.5).slice(0, 3);
          const options = [targetParticle, ...wrongOptions].sort(() => Math.random() - 0.5);

          generatedQ.push({
            type: "grammar",
            question: "Lengkapi kalimat berikut:",
            sentence: blankedSentence,
            correctAnswer: targetParticle,
            options: options,
            explanation: g.meaning // Kasih tau arti pola kalimatnya
          });
        }
      });
    }

    // 2. BUAT SOAL KOSAKATA (Arti Kanji) - Sisa slotnya (maksimal 5 total)
    const remainingSlots = 5 - generatedQ.length;
    if (remainingSlots > 0 && vocab.length > 0) {
      const shuffledVocab = [...vocab].sort(() => Math.random() - 0.5).slice(0, remainingSlots);
      
      shuffledVocab.forEach((item) => {
        const wrongOptions = vocab
          .filter((v: any) => v.meaning !== item.meaning)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((v: any) => v.meaning);

        const options = [item.meaning, ...wrongOptions].sort(() => Math.random() - 0.5);

        generatedQ.push({
          type: "vocab",
          question: "Apa arti dari kata berikut?",
          sentence: `${item.kanji} (${item.kana})`,
          correctAnswer: item.meaning,
          options: options,
          explanation: ""
        });
      });
    }

    // Acak urutan soal campuran (grammar & vocab)
    generatedQ = generatedQ.sort(() => Math.random() - 0.5);

    setQuestions(generatedQ);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === questions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (questions.length === 0) return <div className="text-center text-[#A3A099]">Belum ada soal untuk bab ini.</div>;

  const passingScore = Math.ceil(questions.length * 0.8); // Lulus jika benar 80%

  if (isFinished) {
    const isPassed = score >= passingScore;
    return (
      <div className="bg-[#1E1D1B] border border-[#33312E] rounded-xl p-8 text-center shadow-xl">
        <h3 className="text-2xl font-bold text-[#EAE6DD] mb-2">Kuis Selesai!</h3>
        <p className="text-[#A3A099] mb-6">Skor kamu: <span className="font-bold text-[#C93438]">{score} / {questions.length}</span></p>

        {isPassed ? (
          <div className="space-y-4">
            <p className="text-green-500 font-bold">Hebat! Kamu lulus dan bisa lanjut ke bab berikutnya.</p>
            <button onClick={onPass} className="w-full bg-[#C93438] text-white font-bold py-3 rounded-xl hover:bg-[#B02A2E] transition-colors">
              Lanjut ke Bab Berikutnya
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-red-500 font-bold">Yah, kamu belum lulus. Minimal harus benar {passingScore} soal.</p>
            <button onClick={generateQuestions} className="w-full flex items-center justify-center gap-2 bg-[#33312E] text-[#EAE6DD] font-bold py-3 rounded-xl hover:bg-[#44413D] transition-colors">
              <RotateCcw size={18} /> Ulangi Kuis
            </button>
          </div>
        )}
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="bg-[#1E1D1B] border border-[#33312E] rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-[#A3A099]">SOAL {currentIndex + 1} DARI {questions.length}</span>
        <span className="text-xs font-bold text-[#B8860B]">Skor: {score}</span>
      </div>

    <div className="text-center mb-6">
        <p className="text-sm text-[#A3A099] mb-2">{currentQ.question}</p>
        {/* PAKAI DANGEROUSLY SET INNER HTML BIAR RENDER KANJI + FURIGANA */}
        <h3 
          className="text-2xl font-bold text-[#EAE6DD] font-mincho leading-[2.5] [&_rt]:text-[0.5em]"
          dangerouslySetInnerHTML={{ __html: currentQ.sentence }} 
        />
    </div>

      <div className="space-y-3">
        {currentQ.options.map((opt: string, i: number) => {
          let btnClass = "bg-[#262523] border-[#33312E] text-[#EAE6DD] hover:border-[#C93438]/50";
          if (isAnswered) {
            if (opt === currentQ.correctAnswer) btnClass = "bg-green-900/30 border-green-500 text-green-200";
            else if (opt === selectedAnswer) btnClass = "bg-red-900/30 border-red-500 text-red-200";
            else btnClass = "bg-[#1A1918] border-[#33312E] opacity-50";
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={isAnswered}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-6 flex justify-between items-end">
          <div className="text-sm text-[#B8860B] italic">
            {currentQ.explanation && `Pola: ${currentQ.explanation}`}
          </div>
          <button
            onClick={nextQuestion}
            className="bg-[#C93438] text-white font-bold px-6 py-2 rounded-lg hover:bg-[#B02A2E] whitespace-nowrap"
          >
            {currentIndex === questions.length - 1 ? "Lihat Hasil" : "Soal Selanjutnya"}
          </button>
        </div>
      )}
    </div>
  );
}