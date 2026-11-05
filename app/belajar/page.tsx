"use client";

import { useState, useEffect } from "react";
import allBabs from "../../data/all-bab.json";
import { getProgress, setProgress } from "../../lib/progress";
import LevelBadge from "../../components/LevelBadge";
import { ChevronLeft, ChevronRight, CheckCircle2, Lock, BookOpen, ArrowLeft } from "lucide-react";
import * as wanakana from "wanakana";
import Quiz from "../../components/Quiz";

export default function Home() {
  const [currentBab, setCurrentBab] = useState<number>(1); // Bab tertinggi yang terbuka
  const [selectedBab, setSelectedBab] = useState<number>(1); // Bab yang lagi diliat
  const [viewMode, setViewMode] = useState<"grid" | "detail">("grid");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const progress = getProgress();
    setCurrentBab(progress);
    setSelectedBab(progress);
    setIsLoaded(true);
  }, []);

  const handleOpenBab = (babNumber: number) => {
    if (babNumber <= currentBab) {
      setSelectedBab(babNumber);
      setViewMode("detail");
      window.scrollTo(0, 0);
    }
  };

  // Ganti handleComplete jadi begini:
  const handleComplete = () => {
    // Kalau udah di Bab 50, balikin ke Peta Belajar
    if (selectedBab === 50) {
      setViewMode("grid");
      window.scrollTo(0, 0);
      return;
    }

    const nextBab = selectedBab + 1;
    if (nextBab > currentBab) {
      setProgress(nextBab);
      setCurrentBab(nextBab);
    }
    
    // LANGSUNG PINDAH KE BAB SELANJUTNYA (Jangan ke grid)
    setSelectedBab(nextBab); 
    window.scrollTo(0, 0);
  };

  const getRomaji = (jpText: string, currentBab: number) => {
    const unlockedBabs = allBabs.filter((b: any) => b.bab <= currentBab);

    // Partikel yang dibaca berbeda dari cara baca hiragana biasanya.
    const particles = [
      "から", "まで", "より", "しか", "だけ", "など", "は", "が", "を",
      "に", "で", "と", "へ", "も", "の", "か", "や", "ね", "よ",
    ].sort((a, b) => b.length - a.length);

    const grammarWords = [
      "じゃありません", "ではありません", "でしょう", "でした", "です",
      "ください", "なりません", "なら", "とき", "こと", "もの", "ところ",
      "ため", "よう", "ほう", "な",
    ];
    const honorifics = ["さん", "ちゃん", "くん"];

    // Kata umum yang sering muncul di contoh tetapi tidak selalu ada di vocab.
    const commonWords = [
      "これ", "それ", "あれ", "この", "その", "あの", "ここ", "そこ",
      "あそこ", "どこ", "どちら", "どう", "こんにちは", "こんばんは",
      "はじめまして", "おはようございます", "りんご", "ごみ", "たばこ",
      "ひらがな", "カタカナ", "となり", "うえ", "した", "まえ", "うしろ",
      "なか", "そと", "そば", "ちかく", "パン", "コーヒー", "クラス",
      "みんな", "だれか", "なにか", "どこか", "いくつ", "ちょっと",
      "はさみ", "パソコン", "テレビ", "ケーキ", "ボタン", "ニュース",
    ];

    const dictionary = new Set<string>([
      ...commonWords,
      ...grammarWords,
      ...honorifics,
    ]);
    const vocabKanji = new Set<string>();

    unlockedBabs.forEach((bab: any) => {
      bab.vocab?.forEach((v: any) => {
        if (v.kana) dictionary.add(v.kana);
        if (v.kanji) vocabKanji.add(v.kanji);
      });
    });

    // Tambahkan bacaan ruby yang memang merupakan satu kata utuh.
    // Kalau karakter setelah ruby adalah okurigana (mis. 行 + きます),
    // jangan jadikan potongan bacaan Kanji itu sebagai kata terpisah.
    const rubyRegex = /<ruby>([\s\S]*?)<rt>([\s\S]*?)<\/rt><\/ruby>/g;
    let rubyMatch: RegExpExecArray | null;

    while ((rubyMatch = rubyRegex.exec(jpText)) !== null) {
      const base = rubyMatch[1].replace(/<[^>]*>/g, "").trim();
      let reading = rubyMatch[2].replace(/<[^>]*>/g, "").trim();
      const afterRuby = jpText.slice(rubyRegex.lastIndex);
      const nextKana = afterRuby.match(/^[ぁ-ゖー]+/)?.[0] ?? "";
      const isKnownVocab = vocabKanji.has(base);

      // Ruby kadang mencakup partikel di ujungnya, mis. 一緒に / 食べませんか.
      // Pisahkan partikel tersebut kecuali seluruh bentuknya memang kosakata.
      if (!isKnownVocab) {
        const trailingParticle = particles.find(
          (particle) => base.endsWith(particle) && reading.endsWith(particle)
        );
        if (trailingParticle && base.length > trailingParticle.length) {
          reading = reading.slice(0, -trailingParticle.length);
        }
      }

      const tailIsParticle = particles.some((particle) => {
        if (!nextKana.startsWith(particle)) return false;
        const rest = nextKana.slice(particle.length);
        return (
          rest.length === 0 ||
          /^(です|でした|でしょう|ください)/.test(rest)
        );
      });
      const tailIsGrammar = grammarWords.some((word) => nextKana.startsWith(word));
      const tailIsHonorific = honorifics.some((suffix) =>
        nextKana.startsWith(suffix)
      );
      const rubyEndsAtWordBoundary =
        nextKana.length === 0 || tailIsParticle || tailIsGrammar || tailIsHonorific;

      const containsInternalGrammarBoundary =
        !isKnownVocab && ["の", "こと", "とき"].some((part) => base.includes(part));

      if (rubyEndsAtWordBoundary && reading && !containsInternalGrammarBoundary) {
        dictionary.add(reading);
      }
    }

    const sortedWords = Array.from(dictionary).sort(
      (a, b) => b.length - a.length
    );

    // Ambil bacaan dari <rt>, lalu buang tag HTML lainnya.
    const cleanText = jpText
      .replace(/<ruby>[\s\S]*?<rt>([\s\S]*?)<\/rt><\/ruby>/g, "$1")
      .replace(/<[^>]+>/g, "")
      .normalize("NFC");

    const isPunctuation = (char: string) => /[。、！？,.!?「」『』]/.test(char);
    const isSeparator = (index: number) =>
      index >= cleanText.length ||
      /\s/.test(cleanText[index]) ||
      isPunctuation(cleanText[index]);

    const findWordAt = (index: number): string | null => {
      for (const word of sortedWords) {
        if (!cleanText.startsWith(word, index)) continue;

        const end = index + word.length;
        const rest = cleanText.slice(end);
        const followedByParticle = particles.some((p) => rest.startsWith(p));
        const followedByGrammar = grammarWords.some((g) => rest.startsWith(g));
        const followedByHonorific = honorifics.some((h) => rest.startsWith(h));

        // Hindari mencocokkan potongan kata di tengah kata kerja.
        // Contoh: 今 (いま) tidak boleh dipotong dari います (います).
        if (
          isSeparator(end) ||
          followedByParticle ||
          followedByGrammar ||
          followedByHonorific
        ) {
          return word;
        }
      }
      return null;
    };

    const findParticleAt = (index: number): string | null =>
      particles.find((particle) => cleanText.startsWith(particle, index)) ?? null;

    type RomajiToken = {
      text: string;
      kind: "word" | "particle";
      known: boolean;
      end: number;
    };

    const tokens: RomajiToken[] = [];
    let i = 0;

    const shouldSplitParticle = (
      position: number,
      particle: string,
      unknownStart?: number
    ) => {
      const afterParticle = position + particle.length;
      const previousToken = tokens[tokens.length - 1];
      const previousKnownIsAdjacent =
        previousToken?.known && previousToken.end === position;
      const nextWord = findWordAt(afterParticle);
      const endsAtSeparator = isSeparator(afterParticle);
      const unknownPrefix =
        unknownStart === undefined
          ? ""
          : cleanText.slice(unknownStart, position);
      const prefixHasKatakana = /[ァ-ヶ]/.test(unknownPrefix);

      if (previousKnownIsAdjacent) return true;
      if (unknownPrefix && nextWord) return true;
      if (unknownPrefix && prefixHasKatakana && endsAtSeparator) return true;

      // か・ね・よ di akhir kalimat sering menjadi partikel penutup.
      if (
        unknownPrefix &&
        ["か", "ね", "よ"].includes(particle) &&
        endsAtSeparator
      ) {
        return true;
      }

      // Partikel yang ditulis terpisah dengan spasi juga dikenali,
      // tetapi hanya jika seluruh tokennya memang partikel.
      const remaining = cleanText.slice(position);
      if (
        previousToken &&
        remaining.startsWith(particle) &&
        isSeparator(position + particle.length)
      ) {
        return true;
      }

      return false;
    };

    while (i < cleanText.length) {
      const char = cleanText[i];

      if (/\s/.test(char)) {
        i++;
        continue;
      }

      if (isPunctuation(char)) {
        const punctuationMap: Record<string, string> = {
          "。": ".",
          "、": ",",
          "！": "!",
          "？": "?",
        };
        if (tokens.length > 0 && punctuationMap[char]) {
          tokens[tokens.length - 1].text += punctuationMap[char];
        }
        i++;
        continue;
      }

      const word = findWordAt(i);

      // Kata tata bahasa seperti です / でしょう harus dikenali lebih dulu,
      // supaya awalan で tidak salah dianggap sebagai partikel.
      if (word && grammarWords.includes(word)) {
        tokens.push({
          text: word,
          kind: "word",
          known: true,
          end: i + word.length,
        });
        i += word.length;
        continue;
      }

      // は sebagai partikel menjadi "wa", tetapi は di dalam はし / はな /
      // こんにちは tetap dibaca "ha" karena bukan batas partikel.
      const particle = findParticleAt(i);
      if (particle && shouldSplitParticle(i, particle)) {
        tokens.push({
          text: particle,
          kind: "particle",
          known: false,
          end: i + particle.length,
        });
        i += particle.length;
        continue;
      }

      if (word) {
        tokens.push({
          text: word,
          kind: "word",
          known: true,
          end: i + word.length,
        });
        i += word.length;
        continue;
      }

      // Gabungkan karakter yang tidak dikenal sebagai satu rangkaian,
      // bukan memisahkannya satu per satu menjadi suku kata.
      let j = i + 1;
      let particleAfterUnknown: string | null = null;

      while (j < cleanText.length && !/\s/.test(cleanText[j]) && !isPunctuation(cleanText[j])) {
        const candidateParticle = findParticleAt(j);
        if (
          candidateParticle &&
          shouldSplitParticle(j, candidateParticle, i)
        ) {
          particleAfterUnknown = candidateParticle;
          break;
        }

        // Pisahkan honorifik setelah nama Katakana, mis. ミラーさん.
        const honorific = honorifics.find((suffix) =>
          cleanText.startsWith(suffix, j)
        );
        const prefix = cleanText.slice(i, j);
        if (
          honorific &&
          /[ァ-ヶ]/.test(prefix) &&
          (isSeparator(j + honorific.length) ||
            particles.some((p) => cleanText.startsWith(p, j + honorific.length)))
        ) {
          break;
        }

        j++;
      }

      if (j === i) j++;
      const unknownWord = cleanText.slice(i, j);
      tokens.push({
        text: unknownWord,
        kind: "word",
        known: false,
        end: j,
      });
      i = j;

      // Jika rangkaian tadi berhenti tepat sebelum partikel, keluarkan partikel
      // sebagai token sendiri pada iterasi berikutnya.
      if (particleAfterUnknown) {
        tokens.push({
          text: particleAfterUnknown,
          kind: "particle",
          known: false,
          end: i + particleAfterUnknown.length,
        });
        i += particleAfterUnknown.length;
      }
    }

    const specialReadings: Record<string, string> = {
      "こんにちは": "konnichiwa",
      "こんばんは": "konbanwa",
    };

    return tokens
      .map((token) => {
        if (token.kind === "particle") {
          if (token.text === "は") return "wa";
          if (token.text === "へ") return "e";
          if (token.text === "を") return "o";
        }
        return specialReadings[token.text] ?? wanakana.toRomaji(token.text);
      })
      .filter(Boolean)
      .join(" ");
  };

  if (!isLoaded) return null;

  // ==========================================
  // TAMPILAN 1: GRID DAFTAR MATERI
  // ==========================================
  if (viewMode === "grid") {
    return (
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#33312E] pb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#EAE6DD]">Peta Belajar 👋</h2>
            <p className="text-[#A3A099] text-sm mt-1">
              Selesaikan satu bab untuk membuka bab berikutnya.
            </p>
          </div>
          <div className="self-start md:self-center">
            <LevelBadge currentBab={currentBab} />
          </div>
        </div>

        {/* Grid Bab */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {allBabs.map((bab: any) => {
            const isLocked = bab.bab > currentBab;
            const isCompleted = bab.bab < currentBab;
            const isCurrent = bab.bab === currentBab;

            return (
              <button
                key={bab.bab}
                onClick={() => handleOpenBab(bab.bab)}
                disabled={isLocked}
                className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all h-full ${
                  isLocked
                    ? "bg-[#1E1D1B]/50 border-[#33312E]/50 opacity-60 cursor-not-allowed"
                    : isCurrent
                    ? "bg-[#1E1D1B] border-[#C93438] shadow-lg shadow-[#C93438]/10 hover:border-[#C93438]/80"
                    : "bg-[#1E1D1B] border-[#33312E] hover:border-[#B8860B]/50"
                }`}
              >
                <div className="flex justify-between items-center w-full mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${isLocked ? "bg-[#33312E] text-[#A3A099]" : isCompleted ? "bg-[#B8860B]/20 text-[#B8860B]" : "bg-[#C93438]/20 text-[#C93438]"}`}>
                    Bab {bab.bab}
                  </span>
                  {isLocked ? (
                    <Lock size={16} className="text-[#A3A099]" />
                  ) : isCompleted ? (
                    <CheckCircle2 size={16} className="text-[#B8860B]" />
                  ) : (
                    <BookOpen size={16} className="text-[#C93438]" />
                  )}
                </div>
                <h3 className={`font-bold text-sm mb-1 line-clamp-2 ${isLocked ? "text-[#A3A099]" : "text-[#EAE6DD]"}`}>
                  {bab.title}
                </h3>
                <p className="text-[10px] text-[#A3A099] mt-auto pt-2">{bab.level}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN 2: DETAIL MATERI (YANG TADI)
  // ==========================================
  const babData = allBabs.find((b: any) => b.bab === selectedBab);

    return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Tombol Kembali ke Grid */}
      <button 
        onClick={() => setViewMode("grid")}
        className="flex items-center gap-2 text-sm font-bold text-[#A3A099] hover:text-[#EAE6DD] transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Kembali ke Daftar Materi
      </button>

      {babData ? (
        <div className="space-y-8">
          <div className="pb-2">
            <h3 className="text-2xl font-bold text-[#EAE6DD]">Bab {babData.bab}: {babData.title}</h3>
            <p className="text-xs font-bold text-[#C93438] mt-2 bg-[#C93438]/10 inline-block px-2 py-1 rounded-md border border-[#C93438]/20">
              Level {babData.level}
            </p>
          </div>

          {babData.tips && (
            <div className="bg-[#B8860B]/10 border border-[#B8860B]/30 rounded-xl p-4 shadow-sm mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <span className="text-sm font-bold text-[#B8860B]">Tips & Nuansa Penting</span>
              </div>
              <p className="text-sm text-[#EAE6DD] leading-relaxed whitespace-pre-wrap">
                {babData.tips}
              </p>
            </div>
          )}

          {babData.grammar && babData.grammar.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-[#EAE6DD]">Pola Kalimat (Grammar)</h4>
              {babData.grammar.map((g: any, i: number) => (
                <div key={i} className="bg-[#1E1D1B]/80 backdrop-blur-md border border-[#33312E] rounded-xl p-5 shadow-xl">
                {/* Ganti pattern */}
                  <div 
                    className="font-bold text-xl text-[#EAE6DD] font-mincho leading-[2] pt-3 mb-1 [&_rt]:text-[0.45em]"
                    dangerouslySetInnerHTML={{ __html: g.pattern }} 
                  />
                  
                  {/* Ganti formula */}
                  {g.formula && (
                    <div className="bg-[#262523] border border-[#44413D] rounded-lg p-3 my-3">
                      <p className="text-xs font-bold text-[#B8860B] mb-1">RUMUS / PERUBAHAN</p>
                      <div 
                        className="text-base font-mono text-[#EAE6DD] whitespace-pre-wrap leading-[2.4] pt-2 [&_rt]:text-[0.75em]"
                        dangerouslySetInnerHTML={{ __html: g.formula }} 
                      />
                    </div>
                  )}

                  {g.explanation && (
                    <p className="text-sm text-[#A3A099] leading-relaxed mb-4 border-l-2 border-[#33312E] pl-3">
                      {g.explanation}
                    </p>
                  )}

                  <div className="bg-[#121110]/50 rounded-lg p-4 text-sm border border-[#33312E]/50 mt-4">
                    <div 
                      className="text-[#EAE6DD] text-lg md:text-2xl font-mincho leading-[2.8] pt-2 tracking-wide mb-1 [&_rt]:text-[0.5em]"
                      dangerouslySetInnerHTML={{ __html: g.example_kanji || g.example_jp }} 
                    />
              {/* Romaji Otomatis (Pakai Kamus Kosakata) */}
                    <p className="text-sm text-[#B8860B] mb-3 italic tracking-wide">
                      {getRomaji(g.example_kanji || g.example_jp, babData.bab)} 
                    </p>
                    <p className="text-[#A3A099] border-t border-[#333132]/50 pt-3">
                      {g.example_id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-bold text-lg text-[#EAE6DD]">Kosakata Baru</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {babData.vocab.map((v: any, i: number) => (
                <div key={i} className="bg-[#1E1D1B]/80 backdrop-blur-md border border-[#33312E] rounded-xl p-4 shadow-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-xl text-[#EAE6DD]">{v.kanji}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#C93438]">{v.meaning}</p>
                    <p className="text-xs text-[#A3A099]">{v.kana} ({v.romaji})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol Selesai */}
          {/* TOMBOL NAVIGASI BAWAH / KUIS */}
          <div className="pt-8 border-t border-[#33312E] mt-8">
            {showQuiz ? (
              <Quiz 
                vocab={babData.vocab} 
                grammar={babData.grammar} 
                onPass={handleComplete} 
              />
            ) : (
              <div className="flex items-center justify-between">
                {/* Tombol Sebelumnya (Muncul kalau bukan Bab 1) */}
                {selectedBab > 1 ? (
                  <button 
                    onClick={() => {
                      setSelectedBab(selectedBab - 1);
                      window.scrollTo(0, 0);
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all bg-[#1E1D1B] text-[#EAE6DD] border border-[#33312E] hover:bg-[#262523]"
                  >
                    <ChevronLeft size={20} />
                    Bab Sebelumnya
                  </button>
                ) : (
                  <div></div> 
                )}

                {/* Tombol Mulai Kuis */}
                <button 
                  onClick={() => setShowQuiz(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all bg-[#C93438] text-white hover:bg-[#B02A2E] shadow-lg shadow-[#C93438]/20 active:scale-95"
                >
                  <CheckCircle2 size={20} />
                  Ikuti Kuis untuk Lanjut
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}