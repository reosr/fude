"use client";

import { useState, useEffect } from "react";
import babsKana from "../../data/hira-kata.json";
import babIndex from "../../data/bab-index.json"; 
import { getProgress, setProgress } from "../../lib/progress";
import {
  awardChapterCompletionOnce,
} from "../../lib/gamification";
import LevelBadge from "../../components/LevelBadge";
import { ChevronLeft, ChevronRight, CheckCircle2, Lock, BookOpen, ArrowLeft, X, Volume2 } from "lucide-react";
import dynamic from "next/dynamic";
import { syncNewCollectionUnlocks } from "../../lib/profile-collections";

let wanakanaModule: typeof import("wanakana") | null = null;
let wanakanaPromise: Promise<typeof import("wanakana")> | null = null;

const loadWanakana = async (): Promise<typeof import("wanakana")> => {
  if (!wanakanaPromise) {
    wanakanaPromise = import("wanakana")
      .then((module) => {
        wanakanaModule = module;
        return module;
      })
      .catch((error) => {
        wanakanaPromise = null;
        throw error;
      });
  }

  return wanakanaPromise;
};

const KanaStroke = dynamic(() => import("../../components/KanaStroke"), { ssr: false });

const Quiz = dynamic(() => import("../../components/Quiz"), {
  loading: () => (
    <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-8 text-center text-[#A3A099]">
      Memuat komponen kuis...
    </div>
  ),
});

// DATA RINGKAS UNTUK PETA BELAJAR
const allBabs = [...babsKana, ...babIndex];

// PEMUAT CHUNK MATERI SESUAI NOMOR BAB
async function loadBabChunk(babNumber: number): Promise<any[]> {
  if (babNumber >= 1 && babNumber <= 10) {
    return (await import("../../data/bab-chunk-1-to-10.json")).default;
  }

  if (babNumber <= 20) {
    return (await import("../../data/bab-chunk-11-to-20.json")).default;
  }

  if (babNumber <= 30) {
    return (await import("../../data/bab-chunk-21-to-30.json")).default;
  }

  if (babNumber <= 40) {
    return (await import("../../data/bab-chunk-31-to-40.json")).default;
  }

  if (babNumber <= 50) {
    return (await import("../../data/bab-chunk-41-to-50.json")).default;
  }

  throw new Error(`Bab ${babNumber} tidak tersedia.`);
}

let vocabIndexPromise: Promise<any[]> | null = null;

function loadVocabIndex(): Promise<any[]> {
  if (!vocabIndexPromise) {
    vocabIndexPromise = import("../../data/vocab-index.json")
      .then((module) => module.default as any[])
      .catch((error) => {
        vocabIndexPromise = null;
        throw error;
      });
  }

  return vocabIndexPromise;
}

// --- KAMUS CONTOH KATA & ARTI (UI) ---
const KANA_EXAMPLES: Record<string, { word: string, meaning: string }> = {
  "あ": { word: "あめ", meaning: "hujan" }, "い": { word: "いぬ", meaning: "anjing" }, "う": { word: "うみ", meaning: "laut" }, "え": { word: "えき", meaning: "stasiun" }, "お": { word: "おちゃ", meaning: "teh" },
  "か": { word: "かさ", meaning: "payung" }, "き": { word: "きつね", meaning: "rubah" }, "く": { word: "くるま", meaning: "mobil" }, "け": { word: "けむり", meaning: "asap" }, "こ": { word: "こども", meaning: "anak" },
  "さ": { word: "さかな", meaning: "ikan" }, "し": { word: "しお", meaning: "garam" }, "す": { word: "すし", meaning: "sushi" }, "せ": { word: "せんせい", meaning: "guru" }, "そ": { word: "そら", meaning: "langit" },
  "た": { word: "たこ", meaning: "gurita" }, "ち": { word: "ちず", meaning: "peta" }, "つ": { word: "つき", meaning: "bulan" }, "て": { word: "てがみ", meaning: "surat" }, "と": { word: "とり", meaning: "burung" },
  "な": { word: "なつ", meaning: "musim panas" }, "に": { word: "にく", meaning: "daging" }, "ぬ": { word: "ぬの", meaning: "kain" }, "ね": { word: "ねこ", meaning: "kucing" }, "の": { word: "のり", meaning: "rumput laut" },
  "は": { word: "はな", meaning: "bunga" }, "ひ": { word: "ひと", meaning: "orang" }, "ふ": { word: "ふね", meaning: "kapal" }, "へ": { word: "へや", meaning: "kamar" }, "ほ": { word: "ほし", meaning: "bintang" },
  "ま": { word: "まど", meaning: "jendela" }, "み": { word: "みず", meaning: "air" }, "む": { word: "むし", meaning: "serangga" }, "め": { word: "めがね", meaning: "kacamata" }, "も": { word: "もも", meaning: "persik" },
  "や": { word: "やま", meaning: "gunung" }, "ゆ": { word: "ゆき", meaning: "salju" }, "よ": { word: "よる", meaning: "malam" },
  "ら": { word: "らくだ", meaning: "unta" }, "り": { word: "りんご", meaning: "apel" }, "る": { word: "るす", meaning: "rumah kosong" }, "れ": { word: "れもん", meaning: "lemon" }, "ろ": { word: "ろうそく", meaning: "lilin" },
  "わ": { word: "わに", meaning: "buaya" }, "を": { word: "を", meaning: "partikel objek" }, "ん": { word: "ほん", meaning: "buku" },
  "ア": { word: "アイス", meaning: "es krim" }, "イ": { word: "インク", meaning: "tinta" }, "ウ": { word: "ウイスキー", meaning: "wiski" }, "エ": { word: "エアコン", meaning: "AC" }, "オ": { word: "オレンジ", meaning: "jeruk" },
  "カ": { word: "カメラ", meaning: "kamera" }, "キ": { word: "キウイ", meaning: "kiwi" }, "ク": { word: "クラス", meaning: "kelas" }, "ケ": { word: "ケーキ", meaning: "kue" }, "コ": { word: "コーヒー", meaning: "kopi" },
  "サ": { word: "サラダ", meaning: "salad" }, "シ": { word: "シネマ", meaning: "bioskop" }, "ス": { word: "スープ", meaning: "sup" }, "セ": { word: "セーター", meaning: "sweter" }, "ソ": { word: "ソファ", meaning: "sofa" },
  "タ": { word: "タクシー", meaning: "taksi" }, "チ": { word: "チーズ", meaning: "keju" }, "ツ": { word: "ツアー", meaning: "tur" }, "テ": { word: "テレビ", meaning: "TV" }, "ト": { word: "トマト", meaning: "tomat" },
  "ナ": { word: "ナイフ", meaning: "pisau" }, "ニ": { word: "ニット", meaning: "rajutan" }, "ヌ": { word: "ヌードル", meaning: "mi" }, "ネ": { word: "ネクタイ", meaning: "dasi" }, "ノ": { word: "ノート", meaning: "buku catatan" },
  "ハ": { word: "ハム", meaning: "ham" }, "ヒ": { word: "ヒーター", meaning: "pemanas" }, "フ": { word: "フルーツ", meaning: "buah" }, "ヘ": { word: "ヘリコプター", meaning: "helikopter" }, "ホ": { word: "ホテル", meaning: "hotel" },
  "マ": { word: "マスク", meaning: "masker" }, "ミ": { word: "ミルク", meaning: "susu" }, "ム": { word: "ムービー", meaning: "film" }, "メ": { word: "メロン", meaning: "melon" }, "モ": { word: "モデル", meaning: "model" },
  "ヤ": { word: "ヤード", meaning: "yard" }, "ユ": { word: "ユニフォーム", meaning: "seragam" }, "ヨ": { word: "ヨーグルト", meaning: "yoghurt" },
  "ラ": { word: "ラジオ", meaning: "radio" }, "リ": { word: "リボン", meaning: "pita" }, "ル": { word: "ルール", meaning: "aturan" }, "レ": { word: "レモン", meaning: "lemon" }, "ロ": { word: "ロボット", meaning: "robot" },
  "ワ": { word: "ワイン", meaning: "anggur" }, "ヲ": { word: "ヲ", meaning: "partikel objek" }, "ン": { word: "パン", meaning: "roti" },
};

const HIRAGANA_GRID = [
  "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ",
  "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ",
  "ま", "み", "む", "め", "も", "や", null, "ゆ", null, "よ", "ら", "り", "る", "れ", "ろ",
  "わ", null, null, null, "を", "ん", null, null, null, null
];

const KATAKANA_GRID = [
  "ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ",
  "タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ",
  "マ", "ミ", "ム", "メ", "モ", "ヤ", null, "ユ", null, "ヨ", "ラ", "リ", "ル", "レ", "ロ",
  "ワ", null, null, null, "ヲ", "ン", null, null, null, null
];

const levelGroups = [
  { id: "kana", title: "Langkah Pertama", subtitle: "Hiragana & Katakana", levels: ["Kana"] },
  { id: "n5-n4", title: "Materi Awal (N5 - N4)", subtitle: "Minna no Nihongo I & II", levels: ["N5", "N4"] },
  { id: "n3", title: "Intermediate (N3)", subtitle: "Materi Tingkat Menengah", levels: ["N3"] },
  { id: "n2", title: "Advanced I (N2)", subtitle: "Materi Tingkat Lanjut I", levels: ["N2"] },
  { id: "n1", title: "Advanced II (N1)", subtitle: "Materi Tingkat Lanjut II", levels: ["N1"] }
];

export default function Home() {
  const [currentBab, setCurrentBab] = useState<number>(1); 
  const [selectedBab, setSelectedBab] = useState<number>(1); 
  const [viewMode, setViewMode] = useState<"level-select" | "grid" | "detail">("level-select");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeKana, setActiveKana] = useState<any>(null);
  const [grammarQuizData, setGrammarQuizData] = useState<any[] | null>(null); 

  const [loadedBabData, setLoadedBabData] = useState<any | null>(null);
  const [vocabIndex, setVocabIndex] = useState<any[] | null>(null);
  const [isBabLoading, setIsBabLoading] = useState(false);
  const [babLoadError, setBabLoadError] = useState(false);

  useEffect(() => {
    const progress = getProgress();
    setCurrentBab(progress);
    setSelectedBab(progress);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
  if (viewMode !== "detail") return;

  const selectedMeta = allBabs.find(
    (b: any) => Number(b.bab) === Number(selectedBab)
  );

  // Bab Kana sudah tersedia di database hiragana/katakana.
  if (!selectedMeta || selectedMeta.level === "Kana") {
    setLoadedBabData(null);
    setIsBabLoading(false);
    setBabLoadError(false);
    return;
  }

  let isActive = true;

  setIsBabLoading(true);
  setBabLoadError(false);

 Promise.all([
  loadBabChunk(selectedBab),
  loadVocabIndex()
])
  .then(async ([chunk, vocab]) => {
    if (!isActive) return;

    const fullBab = chunk.find(
      (b: any) => Number(b.bab) === Number(selectedBab)
    );

    if (!fullBab) {
      throw new Error(`Materi Bab ${selectedBab} tidak ditemukan.`);
    }

    const hasRomajiExamples = fullBab.grammar?.some(
      (g: any) => g.examples?.length > 0
    );

    if (hasRomajiExamples) {
      await loadWanakana();
    }

    if (!isActive) return;

    setLoadedBabData(fullBab);
    setVocabIndex(vocab);
  })
  .catch((error) => {
    console.error("Gagal memuat materi:", error);

    if (isActive) {
      setLoadedBabData(null);
      setBabLoadError(true);
    }
  })
  .finally(() => {
    if (isActive) setIsBabLoading(false);
  });

  return () => {
    isActive = false;
  };
}, [viewMode, selectedBab]);

  useEffect(() => {
  if (!showQuiz || grammarQuizData !== null) return;

  let isActive = true;

  import("../../data/grammar-quiz.json")
    .then((module) => {
      if (isActive) {
        setGrammarQuizData(module.default);
      }
    })
    .catch((error) => {
      console.error("Gagal memuat soal grammar:", error);
      if (isActive) setGrammarQuizData([]);
    });

  return () => {
    isActive = false;
  };
}, [showQuiz, grammarQuizData]);

  const handleOpenBab = (babNumber: number) => {
    if (babNumber <= currentBab) { 
      setSelectedBab(babNumber);
      setViewMode("detail");
      window.scrollTo(0, 0);
    }
  };

  const handleComplete = () => {
  // Reward EXP dan token diberikan satu kali per bab.
  awardChapterCompletionOnce(selectedBab);

  const currentGroup = levelGroups.find(
    (g) => g.id === selectedGroupId
  );

  const babsInGroup = allBabs.filter(
    (b: any) => currentGroup?.levels.includes(b.level)
  );

  const isLastInGroup =
    babsInGroup.length > 0 &&
    babsInGroup[babsInGroup.length - 1].bab === selectedBab;

  const nextBab = selectedBab + 1;

  if (nextBab > currentBab) {
    setProgress(nextBab);
    setCurrentBab(nextBab);
  }

  // Sinkronisasi badge dan frame yang baru terbuka.
  syncNewCollectionUnlocks();

  setShowQuiz(false);

  if (isLastInGroup) {
    setViewMode("grid");
  } else {
    setSelectedBab(nextBab);
  }

  window.scrollTo(0, 0);
};

  const playAudio = () => {
    const audio = new Audio(`/audio/kana/${encodeURIComponent(activeKana.kanji)}.mp3`);
    audio.play().catch((err) => console.log("Audio belum ada:", err));
  };

  // ==========================================
  // FUNGSI GET ROMAJI
  // ==========================================
  const getRomaji = (jpText: string, currentBab: number) => {
    const unlockedVocabGroups = (vocabIndex || []).filter(
      (group: any) => Number(group.bab) <= Number(currentBab)
    );

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

    const commonWords = [
  // Kata tunjuk dan kata tanya
  "これ", "それ", "あれ", "この", "その", "あの",
  "ここ", "そこ", "あそこ", "どこ", "どちら", "どう",
  "だれか", "なにか", "どこか", "いくつ", "ちょっと",

  // Salam dan ungkapan
  "こんにちは", "こんばんは", "はじめまして",
  "おはようございます",

  // Kata dengan は
  "はなしている", "はなす", "はな", "はやい", "はじまる",
  "はい", "はこ", "はこぶ", "はいる", "はし", "はしる",
  "はじめる", "はじめて", "はなれる", "はたらく",
  "はたけ", "はっぱ", "はなび", "はなみ", "はんぶん",
  "はんたい", "はず", "はずかしい", "はかる",
  "はれる", "はる", "はいしゃ", "はいゆう",

  // Kata dengan へ
  "へや", "へた", "へび", "へんじ", "へんか",
  "へいわ", "へいき", "へる", "へらす",

  // Kata dengan に
  "にほん", "にほんご", "にく", "にわ", "にんじん",
  "におい", "にがい", "にげる", "にる", "にぎる",
  "にんき", "にゅうがく",

  // Kata dengan と
  "とけい", "ともだち", "とし", "としょかん",
  "とおい", "とおる", "とぶ", "とまる", "とめる",
  "とる", "とり", "とても", "ときどき",
  "とくい", "とくべつ",

  // Kata dengan で
  "でんき", "でんしゃ", "でんわ", "でんち",
  "でぐち", "でかける", "できる", "でる",
  "であう", "でんとう",

  // Kata dengan の dan も
  "のみもの", "のむ", "のる", "のこる", "のこす",
  "のりもの", "のど", "のぼる",
  "もも", "もり", "もち", "もつ", "もらう",
  "もどる", "もどす", "もの", "もんだい",
  "もし", "もっと", "なつやすみ",

  // Kata dengan が dan から
  "がくせい", "がっこう", "がいこく",
  "がいしゃ", "がんばる",
  "からだ", "からい", "からす", "からあげ",
  "よりみち",

  // Kosakata umum lainnya
  "りんご", "ごみ", "たばこ",
  "ひらがな", "カタカナ", "となり", "うえ",
  "した", "まえ", "うしろ", "なか", "そと",
  "そば", "ちかく", "パン", "コーヒー",
  "クラス", "みんな", "はさみ", "パソコン",
  "テレビ", "ケーキ", "ボタン", "ニュース",
  "おてあらい", "おにさん", "しずか",
    ];

    const dictionary = new Set<string>([
      ...commonWords,
      ...grammarWords,
      ...honorifics,
    ]);
    const vocabKanji = new Set<string>();

    unlockedVocabGroups.forEach((group: any) => {
      group.vocab?.forEach((v: any) => {
        if (v.kana) dictionary.add(v.kana);
        if (v.kanji) vocabKanji.add(v.kanji);
      });
    });

    const rubyRegex = /<ruby>([\s\S]*?)<rt>([\s\S]*?)<\/rt><\/ruby>/g;
    let rubyMatch: RegExpExecArray | null;

    while ((rubyMatch = rubyRegex.exec(jpText)) !== null) {
      const base = rubyMatch[1].replace(/<[^>]*>/g, "").trim();
      let reading = rubyMatch[2].replace(/<[^>]*>/g, "").trim();
      const afterRuby = jpText.slice(rubyRegex.lastIndex);
      const nextKana = afterRuby.match(/^[ぁ-ゖー]+/)?.[0] ?? "";
      const isKnownVocab = vocabKanji.has(base);

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

    const cleanText = (jpText || "")
      .replace(/<ruby>[\s\S]*?<rt>([\s\S]*?)<\/rt><\/ruby>/g, "$1")
      .replace(/<[^>]+>/g, "")
      .normalize("NFC");

    const isPunctuation = (char: string) => /[。、！？,.!?「」『』]/.test(char);
    const isSeparator = (index: number) =>
      index >= cleanText.length ||
      /\s/.test(cleanText[index]) ||
      isPunctuation(cleanText[index]);

const findWordAt = (index: number): string | null => {
  // Kenali nominal angka + えん / エン secara otomatis.
  // Contoh: 80えん, 100えん, 1,000えん, ８０エン.
  const yenMatch = cleanText.slice(index).match(
    /^[0-9０-９]+(?:[,，][0-9０-９]{3})*(?:えん|エン)/
  );

  if (yenMatch) return yenMatch[0];

  // Pencarian kosakata biasa.
  for (const word of sortedWords) {
    if (!cleanText.startsWith(word, index)) continue;

    const end = index + word.length;
    const rest = cleanText.slice(end);

    const followedByParticle = particles.some((p) => rest.startsWith(p));
    const followedByGrammar = grammarWords.some((g) => rest.startsWith(g));
    const followedByHonorific = honorifics.some((h) => rest.startsWith(h));

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

      if (
        unknownPrefix &&
        ["か", "ね", "よ"].includes(particle) &&
        endsAtSeparator
      ) {
        return true;
      }

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
        const normalizedToken = token.text.normalize("NFKC");

        return specialReadings[normalizedToken] ?? wanakanaModule!.toRomaji(normalizedToken);
      })
      .filter(Boolean)
      .join(" ");
  };

  if (!isLoaded) return null;

  if (viewMode === "level-select") {
    return (
      <div className="space-y-8 pb-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#33312E] pb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#EAE6DD]">Peta Belajar 👋</h2>
            <p className="text-[#A3A099] text-sm mt-1">Pilih tingkat level untuk mulai belajar.</p>
          </div>
          <div className="self-start md:self-center"><LevelBadge currentBab={currentBab} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
          {levelGroups.map((group) => {
            const babsInGroup = allBabs.filter((b: any) => group.levels.includes(b.level));
            const totalBab = babsInGroup.length;
            const completedBab = babsInGroup.filter((b: any) => b.bab < currentBab).length;
            const progressPercent = totalBab > 0 ? Math.round((completedBab / totalBab) * 100) : 0;
            return (
              <button key={group.id} onClick={() => { setSelectedGroupId(group.id); setViewMode("grid"); window.scrollTo(0, 0); }} className="group relative flex flex-col items-start p-6 rounded-2xl border bg-[#1E1D1B] border-[#33312E] hover:border-[#C93438]/80 hover:shadow-lg hover:shadow-[#C93438]/10 transition-all text-left h-full">
                <div className="w-12 h-12 rounded-full bg-[#C93438]/10 flex items-center justify-center text-[#C93438] mb-4 group-hover:scale-110 transition-transform"><BookOpen size={24} /></div>
                <h3 className="text-xl font-bold text-[#EAE6DD] mb-1">{group.title}</h3>
                <p className="text-sm text-[#A3A099] mb-6">{group.subtitle}</p>
                <div className="mt-auto w-full">
                  <div className="flex justify-between text-xs font-bold text-[#A3A099] mb-2"><span>{completedBab} / {totalBab} Bab</span><span>{progressPercent}%</span></div>
                  <div className="w-full bg-[#33312E] rounded-full h-2 overflow-hidden"><div className="bg-[#C93438] h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} /></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (viewMode === "grid") {
    const currentGroup = levelGroups.find(g => g.id === selectedGroupId);
    const babsToShow = allBabs.filter((b: any) => currentGroup?.levels.includes(b.level));
    return (
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#33312E] pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => { setViewMode("level-select"); setSelectedGroupId(null); window.scrollTo(0, 0); }} className="p-2 rounded-full border border-[#33312E] hover:bg-[#262523] text-[#EAE6DD] transition-colors"><ArrowLeft size={20} /></button>
            <div><h2 className="text-2xl md:text-3xl font-bold text-[#EAE6DD]">{currentGroup?.title}</h2><p className="text-[#A3A099] text-sm mt-1">{currentGroup?.subtitle}</p></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {babsToShow.map((bab: any) => {
            const isLocked = bab.bab > currentBab;
            const isCompleted = bab.bab < currentBab;
            const isCurrent = bab.bab === currentBab;
            return (
              <button key={bab.bab} onClick={() => handleOpenBab(bab.bab)} disabled={isLocked} className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all h-full ${isLocked ? "bg-[#1E1D1B]/50 border-[#33312E]/50 opacity-60 cursor-not-allowed" : isCurrent ? "bg-[#1E1D1B] border-[#C93438] shadow-lg shadow-[#C93438]/10 hover:border-[#C93438]/80" : "bg-[#1E1D1B] border-[#33312E] hover:border-[#B8860B]/50"}`}>
                <div className="flex justify-between items-center w-full mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${isLocked ? "bg-[#33312E] text-[#A3A099]" : isCompleted ? "bg-[#B8860B]/20 text-[#B8860B]" : "bg-[#C93438]/20 text-[#C93438]"}`}>{bab.level === "Kana" ? bab.title : `Bab ${bab.bab}`}</span>
                  {isLocked ? <Lock size={16} className="text-[#A3A099]" /> : isCompleted ? <CheckCircle2 size={16} className="text-[#B8860B]" /> : <BookOpen size={16} className="text-[#C93438]" />}
                </div>
                <h3 className={`font-bold text-sm mb-1 line-clamp-2 ${isLocked ? "text-[#A3A099]" : "text-[#EAE6DD]"}`}>{bab.level === "Kana" ? `Belajar ${bab.title}` : bab.title}</h3>
                <p className="text-[10px] text-[#A3A099] mt-auto pt-2">{bab.level}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const babMeta = allBabs.find(
    (b: any) => Number(b.bab) === Number(selectedBab)
  );

  const isKanaBab = babMeta?.level === "Kana";

  const babData: any = isKanaBab
    ? babMeta
    : Number(loadedBabData?.bab) === Number(selectedBab)
      ? loadedBabData
      : null;

  const gridLayout = babMeta?.title?.includes("Hiragana")
    ? HIRAGANA_GRID
    : KATAKANA_GRID;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
            <div className="sticky top-0 z-50 -mx-4 mb-2 px-4 py-2 lg:mx-0 lg:px-0 lg:py-3 pointer-events-none">
        <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#49302D]/90 bg-[#171312]/95 px-3 py-2 shadow-[0_10px_28px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none lg:backdrop-blur-none xl:-ml-[clamp(0px,calc((100vw-77rem)/2-1rem),16rem)] xl:w-[calc(100%+clamp(0px,calc(100vw-79rem),32rem))]">
          <button type="button" onClick={() => { setViewMode("grid"); window.scrollTo(0, 0); } } className="group inline-flex min-h-11 items-center gap-2.5 rounded-xl px-1.5 py-1 text-left text-sm font-semibold text-[#EAE6DD] transition-all duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C93438] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121110] active:scale-[0.98] pointer-events-auto">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C93438]/40 bg-[#C93438]/15 text-[#F06A6E] transition-all duration-200 group-hover:border-[#E05256]/80 group-hover:bg-[#C93438] group-hover:text-white group-hover:shadow-[0_0_22px_rgba(201,52,56,0.28)]"><ArrowLeft size={17} className="transition-transform duration-200 group-hover:-translate-x-0.5" /></span>
            <span className="flex flex-col leading-tight"><span className="sm:hidden">Daftar Materi</span><span className="hidden sm:inline group-hover:text-[#F06A6E]">Kembali ke Daftar Materi</span><span className="hidden pt-0.5 text-[10px] font-medium tracking-[0.12em] text-[#817A73] sm:block">PETA BELAJAR</span></span>
          </button>
          <div className="pointer-events-auto inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.08] bg-black/25 px-3 py-2 text-[11px] font-semibold text-[#A3A099] backdrop-blur-md sm:px-3.5 sm:text-xs">
            <BookOpen size={13} className="text-[#B8860B]" />
            <span>{isKanaBab ? babData.title : `Bab ${selectedBab}`}<span className="px-1 text-[#625E58]">/</span>{babData?.level}</span>
          </div>
        </div>
      </div>

      {babData ? (
        <div className="space-y-8">
          <div className="pb-2">
            <h3 className="text-2xl font-bold text-[#EAE6DD]">{isKanaBab ? babData.title : `Bab ${babData.bab}: ${babData.title}`}</h3>
            <p className="text-xs font-bold text-[#C93438] mt-2 bg-[#C93438]/10 inline-block px-2 py-1 rounded-md border border-[#C93438]/20">{isKanaBab ? "Materi Dasar" : `Level ${babData.level}`}</p>
          </div>

          {babData.tips && (
            <div className="bg-[#B8860B]/10 border border-[#B8860B]/30 rounded-xl p-4 shadow-sm mt-4">
              <div className="flex items-center gap-2 mb-2"><span className="text-lg">💡</span><span className="text-sm font-bold text-[#B8860B]">Tips & Nuansa Penting</span></div>
              <div className="text-sm text-[#EAE6DD] leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: babData.tips }} />
            </div>
          )}

          {babData.grammar && babData.grammar.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-[#EAE6DD]">Pola Kalimat (Grammar)</h4>
              {babData.grammar.map((g: any, i: number) => (
                <div key={i} className="bg-[#1E1D1B]/80 backdrop-blur-md border border-[#33312E] rounded-xl p-5 shadow-xl">
                  <div className="font-bold text-xl text-[#EAE6DD] font-mincho leading-[2] pt-3 mb-1 [&_rt]:text-[0.45em]" dangerouslySetInnerHTML={{ __html: g.pattern }} />
                  {g.formula && (
                    <div className="bg-[#262523] border border-[#44413D] rounded-lg p-3 my-3">
                      <p className="text-xs font-bold text-[#B8860B] mb-1">RUMUS / PERUBAHAN</p>
                      <div className="text-base font-mono text-[#EAE6DD] whitespace-pre-wrap leading-[2.4] pt-2 [&_rt]:text-[0.75em]" dangerouslySetInnerHTML={{ __html: g.formula }} />
                    </div>
                  )}
                  {g.explanation && <div className="text-sm text-[#A3A099] leading-relaxed mb-4 border-l-2 border-[#33312E] pl-3" dangerouslySetInnerHTML={{ __html: g.explanation }} />}
                  <div className="space-y-3 mt-4">
                    {g.examples && g.examples.map((ex: any, index: number) => (
                      <div key={index} className="bg-[#121110]/50 rounded-lg p-4 text-sm border border-[#33312E]/50">
                        <div className="text-[#EAE6DD] text-lg md:text-2xl font-mincho leading-[2.8] pt-2 tracking-wide mb-1 [&_rt]:text-[0.5em]" dangerouslySetInnerHTML={{ __html: ex.kanji }} />
                        <p className="text-sm text-[#B8860B] mb-3 italic tracking-wide">{getRomaji(ex.kanji, babData.bab)}</p>
                        <div className="text-[#A3A099] border-t border-[#333132]/50 pt-3" dangerouslySetInnerHTML={{ __html: ex.id }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-bold text-lg text-[#EAE6DD]">{isKanaBab ? "Daftar Huruf" : "Kosakata Baru"}</h4>
            
            {isKanaBab ? (
              <div className="grid grid-cols-5 gap-2 md:gap-4 mt-4">
                {gridLayout.map((char, i) => {
                  if (!char) return <div key={i} className="aspect-square"></div>; 
                  const v = babData.vocab.find((item: any) => item.kanji === char);
                  if (!v) return <div key={i} className="aspect-square"></div>;
                  
                  return (
                    <div 
                      key={i} 
                      onClick={() => setActiveKana(v)} 
                      className="bg-[#1E1D1B]/80 backdrop-blur-md border border-[#33312E] rounded-xl p-2 md:p-3 shadow-xl transition-all flex flex-col items-center justify-center text-center aspect-square hover:border-[#C93438] cursor-pointer hover:scale-105 hover:shadow-[#C93438]/20"
                    >
                      <p className="font-brush text-4xl md:text-5xl text-[#EAE6DD] leading-none mb-2 md:mb-3">{v.kanji}</p>
                      
                      <div className="flex flex-col gap-0.5 md:gap-1 w-full">
                        <p className="text-xs md:text-sm font-bold text-[#C93438] uppercase">{v.romaji}</p>
                        <p className="text-[10px] md:text-xs text-[#A3A099] line-clamp-1">{KANA_EXAMPLES[v.kanji]?.word || ""}</p>
                        <p className="text-[9px] md:text-[10px] text-[#817A73] line-clamp-1">{KANA_EXAMPLES[v.kanji]?.meaning || ""}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {babData.vocab.map((v: any, i: number) => (
                  <div key={i} className="bg-[#1E1D1B]/80 backdrop-blur-md border border-[#33312E] rounded-xl p-4 shadow-xl flex justify-between items-center">
                    <div><p className="font-bold text-xl text-[#EAE6DD]">{v.kanji}</p></div>
                    <div className="text-right"><p className="text-sm font-medium text-[#C93438]">{v.meaning}</p><p className="text-xs text-[#A3A099]">{v.kana} ({v.romaji})</p></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-[#33312E] mt-8">
            <div className="flex items-center justify-between">
              {selectedBab > -1 ? (
                <button onClick={() => { setSelectedBab(selectedBab - 1); window.scrollTo(0, 0); }} className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all bg-[#1E1D1B] text-[#EAE6DD] border border-[#33312E] hover:bg-[#262523]"><ChevronLeft size={20} /> Sebelumnya</button>
              ) : <div></div>}
              <button onClick={() => setShowQuiz(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all bg-[#C93438] text-white hover:bg-[#B02A2E] shadow-lg shadow-[#C93438]/20 active:scale-95"><CheckCircle2 size={20} /> Ikuti Kuis untuk Lanjut <ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
      ) : null}

      {showQuiz && babData && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
    onClick={() => setShowQuiz(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-2xl"
    >
      {grammarQuizData === null ? (
        <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-8 text-center text-[#A3A099]">
          Memuat soal latihan...
        </div>
      ) : grammarQuizData.length === 0 ? (
        <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-8 text-center text-[#C93438]">
          Gagal memuat soal. Coba muat ulang halaman.
        </div>
      ) : (
        <Quiz
          grammarQuestions={
            grammarQuizData.find(
              (item) => Number(item.bab) === Number(babData.bab)
            )?.questions ?? []
          }
          babNumber={Number(babData.bab)}
          onPass={handleComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  </div>
)}

      {activeKana && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6" onClick={() => setActiveKana(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-[#1E1D1B] border border-[#33312E] rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl relative flex flex-col items-center">
            <button onClick={() => setActiveKana(null)} className="absolute top-4 right-4 text-[#A3A099] hover:text-white bg-[#262523] p-1.5 rounded-full transition-colors"><X size={20}/></button>
            <h3 className="text-3xl font-bold text-[#EAE6DD] mb-6 font-brush">{activeKana.kanji}</h3>
            <div className="w-48 h-48 bg-white/5 rounded-2xl p-4 flex items-center justify-center mb-6 border border-[#33312E] shadow-inner relative">
              <KanaStroke kana={activeKana.kanji} />
            </div>
            <div className="flex flex-col items-center gap-1 mb-6">
              <span className="text-2xl font-bold text-[#C93438] uppercase">{activeKana.romaji}</span>
              <div className="text-center mt-1">
                <span className="text-lg text-[#EAE6DD] font-mincho block">{KANA_EXAMPLES[activeKana.kanji]?.word}</span>
                <span className="text-sm text-[#A3A099] block">{KANA_EXAMPLES[activeKana.kanji]?.meaning}</span>
              </div>
            </div>
            <button onClick={playAudio} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all bg-[#B8860B] text-white hover:bg-[#9A7009] active:scale-95 shadow-lg shadow-[#B8860B]/20 w-full justify-center"><Volume2 size={20} /> Dengarkan Suara</button>
          </div>
        </div>
      )}
    </div>
  );
}