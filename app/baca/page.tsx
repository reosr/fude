"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Square, ArrowLeft, Volume2, Gauge, User } from "lucide-react";
import allStories from "../../data/all-stories.json";
import allBabs from "../../data/all-bab.json"; // <-- Import ini buat kamus Romaji
import { getProgress } from "../../lib/progress";
import * as wanakana from "wanakana";

const MACRON_TO_DOUBLE: Record<string, string> = {
  "ā": "aa", "ī": "ii", "ū": "uu", "ē": "ee", "ō": "oo",
  "Ā": "aa", "Ī": "ii", "Ū": "uu", "Ē": "ee", "Ō": "oo",
};

// Bungkus wanakana biar hasilnya konsisten:
// - ん sebelum vokal/y dikasih apostrof (shin'ya, bukan shinya)
// - ー (katakana) jadi vokal ganda: コーヒー -> koohii, bukan "ko-hi-"
// - macron (ō, ū, dst) disamakan jadi vokal ganda, sama kayak hiragana (ookii)
const toRomajiClean = (kana: string) => {
  const prepared = kana
    .replace(/ん(?=[あいうえおやゆよ])/g, "ん'")
    .replace(/ン(?=[アイウエオヤユヨ])/g, "ン'");
  return wanakana
    .toRomaji(prepared)
    .replace(/[āīūēōĀĪŪĒŌ]/g, (m) => MACRON_TO_DOUBLE[m])
    .replace(/([aiueo])[ー-]/g, "$1$1");
};

// ==========================================
// ROMAJI BERBASIS Intl.Segmenter (bawaan browser)
// Teks dipecah per kata dari versi yang MASIH ADA KANJI-nya (lebih akurat),
// lalu tiap kata dibaca pakai furigana (<rt>) / kana-nya.
// ==========================================
const JOIN_COMMON_WORDS = [
  "これ", "それ", "あれ", "この", "その", "あの", "ここ", "そこ", "あそこ", "どこ",
  "どちら", "どう", "こんにちは", "こんばんは", "はじめまして", "おはようございます",
  "ありがとうございます", "ありがとうございました", "ごめんなさい", "すみません",
  "ください", "ありません", "ありました", "いません", "いました", "でしょう",
  "おにぎり", "いくら", "りんご", "ひらがな", "カタカナ", "となり", "うしろ",
  "ちかく", "みんな", "だれか", "なにか", "どこか", "いくつ", "ちょっと",
];

const ROMAJI_PARTICLES = new Set([
  "は", "が", "を", "に", "で", "と", "へ", "も", "の", "か", "や", "ね", "よ",
  "から", "まで", "より", "しか", "だけ", "など",
]);
const WA_ENDING_COMBOS = new Set(["では", "には", "とは", "からは", "までは", "よりは"]);
const AUX_HEAD = new Set(["ま", "まし", "ませ", "ます", "ました", "ません", "ましょう"]);
const AUX_TAIL = new Set(["た", "した", "せん", "しょう", "ん", "でした"]);
const INTERROGATIVES = new Set(["なに", "なん", "だれ", "どこ", "いつ", "どれ"]);
const SPECIAL_READINGS: Record<string, string> = {
  "こんにちは": "konnichiwa",
  "こんばんは": "konbanwa",
  "おはようございます": "ohayou gozaimasu",
  "ありがとうございます": "arigatou gozaimasu",
  "ありがとうございました": "arigatou gozaimashita",
};
// Kata+partikel yang sering dianggap satu kata oleh Segmenter
const SPLIT_TOKENS: Record<string, string[]> = {
  "ほかに": ["ほか", "に"],
  "ほかには": ["ほか", "には"],
  "ほかの": ["ほか", "の"],
};
const PUNCT_MAP: Record<string, string> = { "。": ".", "、": ",", "！": "!", "？": "?" };
const PUNCT_ONLY = /^[\s。、！？!?,.「」『』]+$/;

let japaneseSegmenter: any = null;
const canSegmentJapanese = () => typeof Intl !== "undefined" && "Segmenter" in Intl;

const getRomajiSegmented = (jpText: string, bab: number): string => {
  if (!japaneseSegmenter) japaneseSegmenter = new (Intl as any).Segmenter("ja", { granularity: "word" });

  // 1. Pisahkan teks (kanji tetap ada) dan posisi furigana-nya
  const plain = (t: string) => t.replace(/<[^>]+>/g, "").normalize("NFC");
  let surface = "";
  const rubies: { start: number; end: number; reading: string }[] = [];
  const rubyRegex = /<ruby>([\s\S]*?)<rt>([\s\S]*?)<\/rt><\/ruby>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = rubyRegex.exec(jpText)) !== null) {
    surface += plain(jpText.slice(last, m.index));
    const start = surface.length;
    surface += plain(m[1]).trim();
    rubies.push({ start, end: surface.length, reading: plain(m[2]).trim() });
    last = rubyRegex.lastIndex;
  }
  surface += plain(jpText.slice(last));

  // 2. Pecah jadi kata, tapi jangan sampai memotong tengah-tengah furigana
  const spans: { start: number; end: number }[] = [];
  for (const s of japaneseSegmenter.segment(surface)) {
    const start = s.index as number;
    const end = start + (s.segment as string).length;
    const prev = spans[spans.length - 1];
    if (prev && rubies.some((r) => r.start < start && start < r.end)) prev.end = end;
    else spans.push({ start, end });
  }

  const readingOf = (start: number, end: number) => {
    let out = "";
    let k = start;
    while (k < end) {
      const r = rubies.find((x) => x.start <= k && k < x.end);
      if (r) { out += r.reading; k = r.end; } else { out += surface[k]; k++; }
    }
    return out;
  };

  type Tok = { kana: string; punct: boolean };
  let toks: Tok[] = spans
    .map(({ start, end }) => {
      const text = surface.slice(start, end);
      return { text, kana: readingOf(start, end), punct: PUNCT_ONLY.test(text) };
    })
    .filter((t) => !/^\s+$/.test(t.text))
    .map(({ kana, punct }) => ({ kana, punct }));

  // 3. Kata yang sering salah dipecah (terutama yang hiragana) disambung lagi lewat kamus
  const joinDict = new Set<string>(JOIN_COMMON_WORDS);
  allBabs
    .filter((b: any) => b.bab <= bab)
    .forEach((b: any) => b.vocab?.forEach((v: any) => v.kana && joinDict.add(v.kana)));

  const afterDict: Tok[] = [];
  for (let i = 0; i < toks.length; ) {
    let took = 0;
    if (!toks[i].punct) {
      for (let n = Math.min(6, toks.length - i); n >= 2; n--) {
        const slice = toks.slice(i, i + n);
        if (slice.some((t) => t.punct)) continue;
        const kana = slice.map((t) => t.kana).join("");
        if (joinDict.has(kana)) {
          afterDict.push({ kana, punct: false });
          took = n;
          break;
        }
      }
    }
    if (!took) { afterDict.push(toks[i]); took = 1; }
    i += took;
  }

  // 4. Perbaiki: 何かいります -> なに / か / いり..., lalu sambung akhiran ます-form
  const finalToks: Tok[] = [];
  const pushTok = (t: Tok) => {
    const prev = finalToks[finalToks.length - 1];
    const prevIsWord = prev && !prev.punct && !ROMAJI_PARTICLES.has(prev.kana);
    if (prevIsWord && AUX_HEAD.has(t.kana)) { prev.kana += t.kana; return; }
    if (prevIsWord && AUX_TAIL.has(t.kana) && /(ま|まし|ませ|ません)$/.test(prev.kana)) { prev.kana += t.kana; return; }
    finalToks.push({ ...t });
  };
  for (const t of afterDict) {
    if (SPLIT_TOKENS[t.kana]) {
      SPLIT_TOKENS[t.kana].forEach((kana) => pushTok({ kana, punct: false }));
      continue;
    }
    const prev = finalToks[finalToks.length - 1];
    if (prev && INTERROGATIVES.has(prev.kana) && !t.punct && t.kana.length > 1 && t.kana.startsWith("か")) {
      pushTok({ kana: "か", punct: false });
      pushTok({ kana: t.kana.slice(1), punct: false });
      continue;
    }
    pushTok(t);
  }

  // 5. Ubah ke romaji
  const parts: string[] = [];
  for (const t of finalToks) {
    if (t.punct) {
      const mapped = [...t.kana].map((c) => PUNCT_MAP[c] ?? (/[.,!?]/.test(c) ? c : "")).join("");
      if (parts.length && mapped) parts[parts.length - 1] += mapped;
      continue;
    }
    const k = t.kana;
    let roman: string;
    if (k === "は") roman = "wa";
    else if (k === "へ") roman = "e";
    else if (k === "を") roman = "o";
    else if (SPECIAL_READINGS[k]) roman = SPECIAL_READINGS[k];
    else if (WA_ENDING_COMBOS.has(k)) roman = toRomajiClean(k.slice(0, -1)) + "wa";
    else roman = toRomajiClean(k);
    if (roman) parts.push(roman);
  }
  return parts.join(" ");
};

export default function Baca() {
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number>(1.0);
  const [currentBab, setCurrentBab] = useState<number>(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    setCurrentBab(getProgress());
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // ==========================================
  // FUNGSI ROMAJI VERSI CLAUDE (SUPER AKURAT)
  // ==========================================
  const getRomajiLegacy = (jpText: string, bab: number) => {
    const unlockedBabs = allBabs.filter((b: any) => b.bab <= bab);

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
      "これ", "それ", "あれ", "この", "その", "あの", "ここ", "そこ",
      "あそこ", "どこ", "どちら", "どう", "こんにちは", "こんばんは",
      "はじめまして", "おはようございます", "りんご", "ごみ", "たばこ",
      "ひらがな", "カタカナ", "となり", "うえ", "した", "まえ", "うしろ",
      "なか", "そと", "そば", "ちかく", "パン", "コーヒー", "クラス",
      "みんな", "だれか", "なにか", "どこか", "いくつ", "ちょっと",
      "はさみ", "パソコン", "テレビ", "ケーキ", "ボタン", "ニュース",
    ];

    const dictionary = new Set<string>([...commonWords, ...grammarWords, ...honorifics]);
    const vocabKanji = new Set<string>();

    unlockedBabs.forEach((b: any) => {
      b.vocab?.forEach((v: any) => {
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
        return rest.length === 0 || /^(です|でした|でしょう|ください)/.test(rest);
      });
      const tailIsGrammar = grammarWords.some((word) => nextKana.startsWith(word));
      const tailIsHonorific = honorifics.some((suffix) => nextKana.startsWith(suffix));
      const rubyEndsAtWordBoundary = nextKana.length === 0 || tailIsParticle || tailIsGrammar || tailIsHonorific;
      const containsInternalGrammarBoundary = !isKnownVocab && ["の", "こと", "とき"].some((part) => base.includes(part));

      if (rubyEndsAtWordBoundary && reading && !containsInternalGrammarBoundary) {
        dictionary.add(reading);
      }
    }

    const sortedWords = Array.from(dictionary).sort((a, b) => b.length - a.length);
    const cleanText = jpText
      .replace(/<ruby>[\s\S]*?<rt>([\s\S]*?)<\/rt><\/ruby>/g, "$1")
      .replace(/<[^>]+>/g, "")
      .normalize("NFC");

    const isPunctuation = (char: string) => /[。、！？,.!?「」『』]/.test(char);
    const isSeparator = (index: number) =>
      index >= cleanText.length || /\s/.test(cleanText[index]) || isPunctuation(cleanText[index]);

    const findWordAt = (index: number): string | null => {
      for (const word of sortedWords) {
        if (!cleanText.startsWith(word, index)) continue;
        const end = index + word.length;
        const rest = cleanText.slice(end);
        const followedByParticle = particles.some((p) => rest.startsWith(p));
        const followedByGrammar = grammarWords.some((g) => rest.startsWith(g));
        const followedByHonorific = honorifics.some((h) => rest.startsWith(h));

        if (isSeparator(end) || followedByParticle || followedByGrammar || followedByHonorific) {
          return word;
        }
      }
      return null;
    };

    const findParticleAt = (index: number): string | null =>
      particles.find((particle) => cleanText.startsWith(particle, index)) ?? null;

    type RomajiToken = { text: string; kind: "word" | "particle"; known: boolean; end: number; };
    const tokens: RomajiToken[] = [];
    let i = 0;

    const shouldSplitParticle = (position: number, particle: string, unknownStart?: number) => {
      const afterParticle = position + particle.length;
      const previousToken = tokens[tokens.length - 1];
      const previousKnownIsAdjacent = previousToken?.known && previousToken.end === position;
      const nextWord = findWordAt(afterParticle);
      const endsAtSeparator = isSeparator(afterParticle);
      const unknownPrefix = unknownStart === undefined ? "" : cleanText.slice(unknownStart, position);
      const prefixHasKatakana = /[ァ-ヶ]/.test(unknownPrefix);

      // を hampir selalu partikel, jadi selalu dipisah (biar jadi "o", bukan "wo")
      if (particle === "を") return true;
      if (previousKnownIsAdjacent) return true;

      // partikel bertumpuk: ここ|で|は, えき|から|は, にも, でも, とも, dst.
      const previousIsParticleAdjacent =
        previousToken?.kind === "particle" && previousToken.end === position;
      if (previousIsParticleAdjacent) {
        if (particle === "は" && ["に", "で", "と", "から", "まで", "より", "へ"].includes(previousToken.text)) return true;
        if (particle === "も" && ["に", "で", "と", "から", "まで", "へ"].includes(previousToken.text)) return true;
      }

      if (unknownPrefix && nextWord) return true;
      if (unknownPrefix && prefixHasKatakana && endsAtSeparator) return true;
      if (unknownPrefix && ["か", "ね", "よ"].includes(particle) && endsAtSeparator) return true;

      const remaining = cleanText.slice(position);
      if (previousToken && remaining.startsWith(particle) && isSeparator(position + particle.length)) {
        return true;
      }
      return false;
    };

    while (i < cleanText.length) {
      const char = cleanText[i];
      if (/\s/.test(char)) { i++; continue; }
      if (isPunctuation(char)) {
        const punctuationMap: Record<string, string> = { "。": ".", "、": ",", "！": "!", "？": "?" };
        if (tokens.length > 0 && punctuationMap[char]) tokens[tokens.length - 1].text += punctuationMap[char];
        i++; continue;
      }

      const word = findWordAt(i);
      if (word && grammarWords.includes(word)) {
        tokens.push({ text: word, kind: "word", known: true, end: i + word.length });
        i += word.length; continue;
      }

      const particle = findParticleAt(i);
      if (particle && shouldSplitParticle(i, particle)) {
        tokens.push({ text: particle, kind: "particle", known: false, end: i + particle.length });
        i += particle.length; continue;
      }

      if (word) {
        tokens.push({ text: word, kind: "word", known: true, end: i + word.length });
        i += word.length; continue;
      }

      let j = i + 1;
      let particleAfterUnknown: string | null = null;

      while (j < cleanText.length && !/\s/.test(cleanText[j]) && !isPunctuation(cleanText[j])) {
        const candidateParticle = findParticleAt(j);
        if (candidateParticle && shouldSplitParticle(j, candidateParticle, i)) {
          particleAfterUnknown = candidateParticle;
          break;
        }
        const honorific = honorifics.find((suffix) => cleanText.startsWith(suffix, j));
        const prefix = cleanText.slice(i, j);
        if (honorific && /[ァ-ヶ]/.test(prefix) && (isSeparator(j + honorific.length) || particles.some((p) => cleanText.startsWith(p, j + honorific.length)))) {
          break;
        }
        j++;
      }

      if (j === i) j++;
      const unknownWord = cleanText.slice(i, j);
      tokens.push({ text: unknownWord, kind: "word", known: false, end: j });
      i = j;

      if (particleAfterUnknown) {
        tokens.push({ text: particleAfterUnknown, kind: "particle", known: false, end: i + particleAfterUnknown.length });
        i += particleAfterUnknown.length;
      }
    }

    const specialReadings: Record<string, string> = {
      "こんにちは": "konnichiwa",
      "こんばんは": "konbanwa",
      "ではありません": "dewa arimasen", // は di sini dibaca "wa"
      "じゃありません": "ja arimasen",
      "おはようございます": "ohayou gozaimasu",
      "ありがとうございます": "arigatou gozaimasu",
    };

    return tokens
      .map((token) => {
        // tanda baca nempel di akhir token (mis. "こんにちは。" -> "こんにちは."),
        // jadi dipisah dulu supaya pencarian bacaan khusus & partikel tetap kena
        const trailing = token.text.match(/[.,!?]+$/)?.[0] ?? "";
        const core = trailing ? token.text.slice(0, -trailing.length) : token.text;

        if (token.kind === "particle") {
          if (core === "は") return "wa" + trailing;
          if (core === "へ") return "e" + trailing;
          if (core === "を") return "o" + trailing;
        }
        return (specialReadings[core] ?? toRomajiClean(core)) + trailing;
      })
      .filter(Boolean)
      .join(" ");
  };
  // ==========================================

  const getRomaji = (jpText: string, bab: number) =>
    canSegmentJapanese() ? getRomajiSegmented(jpText, bab) : getRomajiLegacy(jpText, bab);

  const stopAudio = () => {
    isPlayingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setActiveIndex(null);
  };

  const playOne = (url: string, index: number, rate: number) => {
    return new Promise<void>((resolve) => {
      if (!audioRef.current) return resolve();
      const audio = audioRef.current;
      audio.src = url;
      audio.playbackRate = rate;
      setActiveIndex(index);
      audio.onended = () => resolve();
      audio.onerror = () => {
        console.error("Gagal muter:", url);
        resolve();
      };
      audio.play().catch((err) => {
        console.warn("Browser ngeblokir audio:", err);
        resolve();
      });
    });
  };

  const playAudio = async (storyId: string, index: number) => {
    stopAudio();
    isPlayingRef.current = true;
    setIsPlaying(true);
    const url = `/audio/${storyId}-${index + 1}.mp3`;
    await playOne(url, index, speed);
    if (isPlayingRef.current) {
      setIsPlaying(false);
      setActiveIndex(null);
    }
  };

  const playAll = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }
    stopAudio();
    isPlayingRef.current = true;
    setIsPlaying(true);
    for (let i = 0; i < selectedStory.sentences.length; i++) {
      if (!isPlayingRef.current) break; 
      const url = `/audio/${selectedStory.id}-${i + 1}.mp3`;
      await playOne(url, i, speed);
    }
    if (isPlayingRef.current) {
      setIsPlaying(false);
      setActiveIndex(null);
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  // ==========================================
  // TAMPILAN 1: GRID DAFTAR CERITA
  // ==========================================
  if (!selectedStory) {
    return (
      <div className="space-y-8 pb-10">
        <div>
          <h2 className="text-3xl font-bold text-[#EAE6DD]">Latihan Baca</h2>
          <p className="text-[#A3A099] text-sm mt-1">
            Pilih cerita atau percakapan sesuai levelmu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allStories.map((story: any) => (
            <button
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="relative flex flex-col items-start p-5 rounded-2xl border bg-[#1E1D1B] border-[#33312E] hover:border-[#C93438] transition-all text-left group h-full min-h-[160px]"
            >
              <div className="flex justify-between items-center w-full mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#C93438]/20 text-[#C93438]">
                  Level {story.level}
                </span>
                {story.isNatural && (
                  <span className="text-[10px] font-bold text-[#B8860B] bg-[#B8860B]/10 px-2 py-0.5 rounded border border-[#B8860B]/30">
                    Natural
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg text-[#EAE6DD] group-hover:text-[#C93438] transition-colors mb-2">
                {story.title}
              </h3>
              <p className="text-xs text-[#A3A099] line-clamp-2 mt-auto">
                {story.sentences[0].jp.replace(/<[^>]+>/g, '')}...
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN 2: BACA CERITA
  // ==========================================
  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      <button 
        onClick={() => { stopAudio(); setSelectedStory(null); }}
        className="flex items-center gap-2 text-sm font-bold text-[#A3A099] hover:text-[#EAE6DD] transition-colors mb-4"
      >
        <ArrowLeft size={16} /> Kembali ke Daftar Cerita
      </button>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#33312E] pb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
             <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#C93438]/20 text-[#C93438]">
                Level {selectedStory.level}
              </span>
              {selectedStory.isNatural && (
                <span className="text-[10px] font-bold text-[#B8860B] bg-[#B8860B]/10 px-2 py-0.5 rounded border border-[#B8860B]/30">
                  Natural Speed
                </span>
              )}
          </div>
          {/* Tambahin leading-tight biar judul 2 baris ga terlalu jauh */}
          <h2 className="text-3xl font-bold text-[#EAE6DD] leading-tight">{selectedStory.title}</h2>
        </div>
        
        {/* Tambahin shrink-0 biar tombol ga pernah mengecil / turun */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center gap-2 bg-[#1E1D1B] border border-[#33312E] rounded-xl px-3 py-2">
            <Gauge size={16} className="text-[#A3A099]" />
            <select 
              value={speed} 
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="bg-transparent text-sm text-[#EAE6DD] outline-none cursor-pointer appearance-none pr-4"
            >
              <option value={0.7} className="bg-[#1E1D1B] text-[#EAE6DD]">0.7x (Pemula)</option>
              <option value={0.85} className="bg-[#1E1D1B] text-[#EAE6DD]">0.85x (Santai)</option>
              <option value={1.0} className="bg-[#1E1D1B] text-[#EAE6DD]">1.0x (Normal)</option>
              <option value={1.2} className="bg-[#1E1D1B] text-[#EAE6DD]">1.2x (Native)</option>
            </select>
          </div>

          <button
            onClick={playAll}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg whitespace-nowrap ${
              isPlaying 
                ? "bg-[#33312E] text-[#EAE6DD] shadow-none" 
                : "bg-[#C93438] text-white hover:bg-[#B02A2E] shadow-[#C93438]/20"
            }`}
          >
            {isPlaying ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            {isPlaying ? "Hentikan" : "Putar Semua"}
          </button>
        </div>
      </div>

      {/* LIST PERCAKAPAN */}
      <div className="bg-[#1E1D1B]/80 backdrop-blur-md border border-[#33312E] rounded-3xl p-2 md:p-4 shadow-xl">
        <div className="flex flex-col divide-y divide-[#33312E]/60">
          {selectedStory.sentences.map((s: any, i: number) => {
            const isNarrator = s.speaker === "Narator";
            
            return (
                            <div 
                key={i} 
                className={`group flex flex-col md:flex-row items-start gap-3 md:gap-4 py-2 px-4 rounded-xl transition-all ${
                  activeIndex === i ? "bg-[#C93438]/10" : "hover:bg-[#262523]"
                }`}
              >
                <button
                  onClick={() => playAudio(selectedStory.id, i)}
                  className="shrink-0 w-8 h-8 mt-1 rounded-full bg-[#33312E] flex items-center justify-center text-[#A3A099] group-hover:text-white group-hover:bg-[#C93438] transition-all hidden md:flex"
                >
                  <Volume2 size={16} />
                </button>

                <div className="w-full">
                  {!isNarrator && (
                    <p className="text-xs font-bold text-[#B8860B] mb-0.5 flex items-center gap-1.5">
                      <User size={12} /> {s.speaker}
                    </p>
                  )}
                  
                  {/* Teks Jepang - Jarak Baris Dirapetin */}
                  <div 
                    className={`text-xl md:text-2xl text-[#EAE6DD] font-mincho leading-[2] ${isNarrator ? "italic text-[#A3A099]" : ""} [&_rt]:text-[0.5em]`}
                    dangerouslySetInnerHTML={{ __html: s.jp }}
                  />
                  
                  {/* Romaji - Jarak Dirapetin */}
                  <p className="text-sm text-[#B8860B] italic mt-1 mb-1">
                    {s.romaji ?? getRomaji(s.jp, currentBab)}
                  </p>
                  
                  {/* Terjemahan */}
                  <p className="text-sm text-[#A3A099] leading-snug">
                    {s.id}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}