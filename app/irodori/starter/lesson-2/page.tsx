"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Languages,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import IrodoriConversation, {
  type IrodoriUtterance,
} from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import JapaneseReading from "@/components/JapaneseReading";
import {
  completeIrodoriLesson,
  saveIrodoriSelfEvaluation,
  useIrodoriProgress,
} from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const yuiAndSota = [IRODORI_SPEAKERS.yui, IRODORI_SPEAKERS.sota];
const akikoAndKenji = [IRODORI_SPEAKERS.akiko, IRODORI_SPEAKERS.kenji];

const repeatConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>すみません。よくわかりません。</>,
    romaji: "Sumimasen. Yoku wakarimasen.",
    translation: "Maaf, saya kurang mengerti.",
    audioFileName: "irodori-starter-02-a01-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。</>,
    romaji: "Hai.",
    translation: "Ya.",
    audioFileName: "irodori-starter-02-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>もういちど、お願いします。</>,
    romaji: "Mou ichido, onegai shimasu.",
    translation: "Tolong ulangi sekali lagi.",
    audioFileName: "irodori-starter-02-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。ゆっくり<ruby>言<rt>い</rt></ruby>います。</>,
    romaji: "Hai. Yukkuri iimasu.",
    translation: "Baik. Saya akan mengatakannya pelan-pelan.",
    audioFileName: "irodori-starter-02-a01-l04.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>バスは３<ruby>時<rt>じ</rt></ruby>に<ruby>来<rt>き</rt></ruby>ます。</>,
    romaji: "Basu wa sanji ni kimasu.",
    translation: "Bus datang pukul tiga.",
    audioFileName: "irodori-starter-02-a01-l05.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>バスは３<ruby>時<rt>じ</rt></ruby>ですね。</>,
    romaji: "Basu wa sanji desu ne.",
    translation: "Bus-nya pukul tiga, ya.",
    audioFileName: "irodori-starter-02-a01-l06.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。わかりましたか？</>,
    romaji: "Hai. Wakarimashita ka?",
    translation: "Ya. Apakah sekarang sudah mengerti?",
    audioFileName: "irodori-starter-02-a01-l07.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>はい、わかりました。</>,
    romaji: "Hai, wakarimashita.",
    translation: "Ya, saya mengerti.",
    audioFileName: "irodori-starter-02-a01-l08.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ありがとうございます。</>,
    romaji: "Arigatou gozaimasu.",
    translation: "Terima kasih.",
    audioFileName: "irodori-starter-02-a01-l09.mp3",
  },
];

const languageConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <><ruby>日本語<rt>にほんご</rt></ruby>、できますか？</>,
    romaji: "Nihongo, dekimasu ka?",
    translation: "Apakah kamu bisa berbahasa Jepang?",
    audioFileName: "irodori-starter-02-a02-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい、<ruby>少<rt>すこ</rt></ruby>しできます。</>,
    romaji: "Hai, sukoshi dekimasu.",
    translation: "Ya, bisa sedikit.",
    audioFileName: "irodori-starter-02-a02-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <><ruby>英語<rt>えいご</rt></ruby>、できますか？</>,
    romaji: "Eigo, dekimasu ka?",
    translation: "Apakah kamu bisa berbahasa Inggris?",
    audioFileName: "irodori-starter-02-a02-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>はい、できます。</>,
    romaji: "Hai, dekimasu.",
    translation: "Ya, bisa.",
    audioFileName: "irodori-starter-02-a02-l04.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>インドネシア<ruby>語<rt>ご</rt></ruby>、できますか？</>,
    romaji: "Indoneshia-go, dekimasu ka?",
    translation: "Apakah kamu bisa berbahasa Indonesia?",
    audioFileName: "irodori-starter-02-a02-l05.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>いいえ、あまりできません。</>,
    romaji: "Iie, amari dekimasen.",
    translation: "Tidak, saya tidak begitu bisa.",
    audioFileName: "irodori-starter-02-a02-l06.mp3",
  },
];

const wordingConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>これは<ruby>日本語<rt>にほんご</rt></ruby>で<ruby>何<rt>なん</rt></ruby>と<ruby>言<rt>い</rt></ruby>いますか？</>,
    romaji: "Kore wa nihongo de nan to iimasu ka?",
    translation: "Apa bahasa Jepangnya ini?",
    audioFileName: "irodori-starter-02-a03-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>「water」は<ruby>日本語<rt>にほんご</rt></ruby>で「<ruby>水<rt>みず</rt></ruby>」です。</>,
    romaji: "Water wa nihongo de mizu desu.",
    translation: "Kata “water” dalam bahasa Jepang adalah “mizu”.",
    audioFileName: "irodori-starter-02-a03-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ああ、<ruby>水<rt>みず</rt></ruby>ですね。</>,
    romaji: "Aa, mizu desu ne.",
    translation: "Oh, mizu, ya.",
    audioFileName: "irodori-starter-02-a03-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>では、「apple」は？</>,
    romaji: "De wa, apple wa?",
    translation: "Kalau begitu, bagaimana dengan “apple”?",
    audioFileName: "irodori-starter-02-a03-l04.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>「apple」は<ruby>日本語<rt>にほんご</rt></ruby>で「りんご」です。</>,
    romaji: "Apple wa nihongo de ringo desu.",
    translation: "Kata “apple” dalam bahasa Jepang adalah “ringo”.",
    audioFileName: "irodori-starter-02-a03-l05.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>りんご。わかりました。</>,
    romaji: "Ringo. Wakarimashita.",
    translation: "Ringo. Saya mengerti.",
    audioFileName: "irodori-starter-02-a03-l06.mp3",
  },
];

const situationQuestions = [
  {
    prompt: "Kamu ingin meminta teman mengulangi ucapannya karena belum paham. Ungkapan mana yang secara langsung meminta pengulangan?",
    options: ["もういちど、お願いします", "ゆっくり、お願いします", "はい、わかりました"],
    answer: "もういちど、お願いします",
    explanation: "もういちど berarti sekali lagi. Ungkapan ini meminta lawan bicara mengulangi ucapannya.",
  },
  {
    prompt: "Teman berbicara terlalu cepat. Kamu ingin ia berbicara lebih pelan. Apa yang kamu katakan?",
    options: ["もういちど、お願いします", "ゆっくり、お願いします", "はい、わかりました"],
    answer: "ゆっくり、お願いします",
    explanation: "ゆっくり berarti perlahan. Ungkapan ini meminta orang lain berbicara lebih pelan, bukan mengulangi seluruh ucapan.",
  },
  {
    prompt: "Seseorang bertanya apakah kamu bisa berbahasa Jepang. Kamu bisa sedikit. Apa jawaban yang paling sesuai?",
    options: ["はい、少しできます", "はい、できます", "いいえ、できません"],
    answer: "はい、少しできます",
    explanation: "少し berarti sedikit. Jawaban ini menyampaikan bahwa kamu bisa berbahasa Jepang, tetapi masih sedikit.",
  },
  {
    prompt: "Kamu ingin menanyakan apakah seseorang bisa berbahasa Inggris, bukan bahasa Jepang. Apa kalimatnya?",
    options: ["英語、できますか？", "日本語、できますか？", "英語で何と言いますか？"],
    answer: "英語、できますか？",
    explanation: "英語 berarti bahasa Inggris. 日本語 berarti bahasa Jepang, sedangkan 英語で何と言いますか menanyakan cara mengatakan sesuatu dalam bahasa Inggris.",
  },
  {
    prompt: "Kamu memegang sebuah benda dan ingin tahu cara menyebutnya dalam bahasa Jepang. Apa yang kamu tanyakan?",
    options: [
      "これは日本語で何と言いますか？",
      "これは何ですか？",
      "もういちど、お願いします",
    ],
    answer: "これは日本語で何と言いますか？",
    explanation: "これは日本語で何と言いますか？ menanyakan bagaimana mengatakan sesuatu dalam bahasa Jepang. これは何ですか？ hanya menanyakan benda itu apa.",
  },
  {
    prompt: "Teman menjawab bahwa kata “air” dalam bahasa Jepang adalah みず. Tulisan Jepang mana yang dimaksud?",
    options: ["水", "りんご", "ノート"],
    answer: "水",
    explanation: "水 dibaca みず, artinya air.",
  },
];

function renderJapaneseOption(option: string) {
  switch (option) {
    case "はい、少しできます":
      return <>はい、<ruby>少<rt>すこ</rt></ruby>しできます</>;
    case "はい、できます":
    case "いいえ、できません":
      return option;
    case "日本語、できますか？":
      return <><ruby>日本語<rt>にほんご</rt></ruby>、できますか？</>;
    case "英語で何と言いますか？":
      return <><ruby>英語<rt>えいご</rt></ruby>で<ruby>何<rt>なん</rt></ruby>と<ruby>言<rt>い</rt></ruby>いますか？</>;
    case "これは何ですか？":
      return <>これは<ruby>何<rt>なん</rt></ruby>ですか？</>;
    case "英語、できますか？":
      return <><ruby>英語<rt>えいご</rt></ruby>、できますか？</>;
    case "日本語で何と言いますか？":
      return <><ruby>日本語<rt>にほんご</rt></ruby>で<ruby>何<rt>なん</rt></ruby>と<ruby>言<rt>い</rt></ruby>いますか？</>;
    case "これは日本語で何と言いますか？":
      return <>これは<ruby>日本語<rt>にほんご</rt></ruby>で<ruby>何<rt>なん</rt></ruby>と<ruby>言<rt>い</rt></ruby>いますか？</>;
    case "お疲れさまでした":
      return <>お<ruby>疲<rt>つか</rt></ruby>れさまでした</>;
    case "お先に失礼します":
      return <>お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します</>;
    case "水":
      return <ruby>水<rt>みず</rt></ruby>;
    default:
      return option;
  }
}

const canDos = [
  {
    id: "repeat",
    text: "Meminta lawan bicara mengulangi ucapan ketika belum paham.",
  },
  {
    id: "language",
    text: "Menjawab pertanyaan tentang kemampuan berbahasa Jepang dan menanyakan bahasa lain.",
  },
  {
    id: "wording",
    text: "Menanyakan cara mengatakan sesuatu dalam bahasa Jepang dan memahami jawabannya.",
  },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Sudah bisa, masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

const katakanaWords = [
  { word: "コーヒー", romaji: "Koohii", meaning: "Kopi" },
  { word: "テレビ", romaji: "Terebi", meaning: "Televisi" },
  { word: "ノート", romaji: "Nooto", meaning: "Buku catatan" },
  { word: "バス", romaji: "Basu", meaning: "Bus" },
  { word: "ホテル", romaji: "Hoteru", meaning: "Hotel" },
  { word: "レストラン", romaji: "Resutoran", meaning: "Restoran" },
  { word: "コンビニ", romaji: "Konbini", meaning: "Toko serba ada / minimarket" },
  { word: "スマホ", romaji: "Sumaho", meaning: "Ponsel pintar (singkatan)" },
];

export default function IrodoriPemulaLessonTwoPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const progress = useIrodoriProgress();
  const ratings = progress.selfEvaluations["starter-02"] ?? {};
  const isCompleted = progress.completedLessons.includes("starter-02");

  const answeredCount = Object.keys(answers).length;
  const score = situationQuestions.filter(
    (question, index) => answers[index] === question.answer
  ).length;

  const resetQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/irodori/starter"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"
        >
          <ArrowLeft size={15} />
          Daftar Pelajaran
        </Link>
        <span className="rounded-full border border-[#D6AD4F]/25 bg-[#D6AD4F]/10 px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#E7D2A1]">
          PEMULA • A1
        </span>
      </div>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#79602F]/45 bg-gradient-to-br from-[#302319] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-6 -top-10 select-none font-mincho text-[190px] leading-none text-[#D6AD4F]/[0.07]">
          聞
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">
            TOPIK 01 • MULAI BERBICARA BAHASA JEPANG
          </p>
          <p className="mt-5 text-sm font-semibold text-[#B9A98B]">
            Pelajaran 2
          </p>
          <h1 className="mt-1 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Maaf, saya kurang mengerti.</h1>
          <p className="mt-2 font-mincho text-2xl text-[#D9B66D]">
            すみません、よくわかりません
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#B6B0A5]">
            Belajar meminta pengulangan, membicarakan kemampuan bahasa, dan
            menanyakan cara menyebut sesuatu dalam bahasa Jepang.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              3 target komunikasi
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              3 dialog orisinal
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              6 latihan situasi
            </span>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <div>
          <p className="text-[9px] font-black tracking-[0.22em] text-[#B8860B]">
            TUJUAN PEMBELAJARAN
          </p>
          <h2 className="mt-1 text-xl font-black text-[#EAE6DD]">
            Setelah pelajaran ini, kamu bisa...
          </h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {canDos.map((canDo, index) => (
            <div
              key={canDo.id}
              className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#B8860B]/15 text-[10px] font-black text-[#D9B66D]">
                0{index + 1}
              </span>
              <p className="text-xs leading-6 text-[#C7C1B5]">{canDo.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C93438]/15 text-[#E46A6D]">
            <MessageCircle size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 01
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Meminta lawan bicara mengulangi ucapan
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Saat belum memahami ucapan seseorang, kamu tidak perlu menebak.
          Gunakan ungkapan sopan untuk meminta orang tersebut mengulanginya.
          Kamu juga bisa meminta lawan bicara berbicara lebih pelan.
        </p>
        <IrodoriConversation
          title="Percakapan A · Meminta pengulangan"
          speakers={yuiAndSota}
          utterances={repeatConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-bold text-[#B8860B]">MINTA DIULANGI</p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              もういちど、お願いします。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">
              Tolong ulangi sekali lagi.
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-bold text-[#B8860B]">MINTA LEBIH PELAN</p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              ゆっくり、お願いします。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">
              Tolong lebih pelan.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4D7198]/15 text-[#8CB0D8]">
            <Languages size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 02
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Menanyakan kemampuan berbahasa
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          <span className="font-mincho text-[#E7D2A1]">できますか？</span>{" "}
          dapat digunakan untuk menanyakan apakah seseorang bisa melakukan
          sesuatu. Dalam konteks ini, ungkapan tersebut dipakai untuk bertanya
          apakah lawan bicara bisa menggunakan suatu bahasa.
        </p>
        <IrodoriConversation
          title="Percakapan A · Bertanya tentang bahasa"
          speakers={akikoAndKenji}
          utterances={languageConversation}
        />
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
            <p className="text-[9px] font-bold text-[#B8860B]">BISA</p>
            <p className="mt-2 font-mincho text-base text-[#F1EBDD]">
              はい、できます。
            </p>
            <p className="mt-1 text-[10px] text-[#A9A398]">Ya, bisa.</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
            <p className="text-[9px] font-bold text-[#B8860B]">BISA SEDIKIT</p>
            <p className="mt-2 font-mincho text-base text-[#F1EBDD]">
              はい、<ruby>少<rt>すこ</rt></ruby>しできます。
            </p>
            <p className="mt-1 text-[10px] text-[#A9A398]">
              Ya, bisa sedikit.
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
            <p className="text-[9px] font-bold text-[#B8860B]">TIDAK BEGITU BISA</p>
            <p className="mt-2 font-mincho text-base text-[#F1EBDD]">
              いいえ、あまりできません。
            </p>
            <p className="mt-1 text-[10px] text-[#A9A398]">
              Tidak, tidak begitu bisa.
            </p>
          </div>
        </div>
        <p className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-3 text-xs leading-6 text-[#A9A398]">
          <span className="font-bold text-[#E7D2A1]">Perhatikan:</span>{" "}
          あまり biasanya digunakan bersama bentuk negatif. Jadi
          あまりできません berarti tidak begitu bisa.
        </p>
        <p className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-3 text-xs leading-6 text-[#A9A398]">
          <span className="font-bold text-[#E7D2A1]">Catatan:</span>{" "}
          sebutkan nama bahasa sebelum できますか？, misalnya
          <span className="font-mincho text-[#E7D2A1]"> <ruby>英語<rt>えいご</rt></ruby>、できますか？</span>{" "}
          untuk menanyakan bahasa Inggris.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#80619B]/15 text-[#B99AD8]">
            <MessageCircle size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 03
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Menanyakan cara mengatakan sesuatu
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Saat tidak tahu nama sebuah benda dalam bahasa Jepang, tunjuk bendanya
          dan tanyakan cara menyebutnya. Perhatikan jawaban, lalu ulangi kata
          yang baru kamu pelajari.
        </p>
        <IrodoriConversation
          title="Percakapan A · Bertanya nama benda"
          speakers={yuiAndSota}
          utterances={wordingConversation}
        />
        <div className="rounded-xl border border-[#B8860B]/20 bg-gradient-to-br from-[#2B2118] to-[#191817] p-4">
          <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
            POLA KALIMAT
          </p>
          <p className="mt-2 font-mincho text-xl leading-[2] text-[#F1EBDD]">
            これは<ruby>日本語<rt>にほんご</rt></ruby>で<ruby>何<rt>なん</rt></ruby>と<ruby>言<rt>い</rt></ruby>いますか？
          </p>
          <p className="mt-1 text-xs text-[#B6B0A5]">
            Bagaimana mengatakan ini dalam bahasa Jepang?
          </p>
          <p className="mt-3 text-xs leading-6 text-[#A9A398]">
            Ganti benda yang ditunjuk atau kata yang ingin kamu tanyakan.
            Dengarkan jawaban, lalu coba ucapkan kembali.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            PRAKTIK SITUASI
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Pilih ungkapan yang sesuai
          </h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Gunakan petunjuk situasi untuk memilih ungkapan. Jawab semua soal,
            lalu periksa hasil latihanmu.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {situationQuestions.map((question, index) => (
            <article
              key={index}
              className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <p className="text-[9px] font-black tracking-widest text-[#B8860B]">
                SITUASI 0{index + 1}
              </p>
              <p className="mt-3 min-h-12 text-xs font-semibold leading-6 text-[#EAE6DD]">
                <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.prompt}</JapaneseReading>
              </p>
              <div className="mt-3 space-y-2">
                {question.options.map((option) => {
                  const selected = answers[index] === option;
                  const correct = option === question.answer;

                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        if (quizSubmitted) return;
                        setAnswers((current) => ({
                          ...current,
                          [index]: option,
                        }));
                      }}
                      disabled={quizSubmitted}
                      className={
                        "w-full rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " +
                        (quizSubmitted && correct
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                          : quizSubmitted && selected
                            ? "border-red-400/50 bg-red-400/10 text-red-200"
                            : selected
                              ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398] hover:border-white/20")
                      }
                    >
                      <span className="mr-2 inline-block w-4 text-center">
                        {quizSubmitted && correct ? "✓" : selected ? "●" : "○"}
                      </span>
                      <span className="font-mincho text-sm [&_rt]:text-[0.65em] [&_rt]:text-[#D6AD4F]">
                        {renderJapaneseOption(option)}
                      </span>
                    </button>
                  );
                })}
              </div>
              {quizSubmitted && (
                <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                  {index === 2 ? (
                    <>
                      <ruby>少<rt>すこ</rt></ruby>し berarti “sedikit”.
                      Jawaban ini menyatakan bahwa kamu bisa sedikit.
                    </>
                  ) : index === 3 ? (
                    <>
                      <ruby>英語<rt>えいご</rt></ruby> berarti bahasa Inggris,
                      sedangkan <ruby>日本語<rt>にほんご</rt></ruby> berarti bahasa Jepang.
                    </>
                  ) : index === 4 ? (
                    <>
                      これは<ruby>日本語<rt>にほんご</rt></ruby>で<ruby>何<rt>なん</rt></ruby>と
                      <ruby>言<rt>い</rt></ruby>いますか？ menanyakan cara mengatakan sesuatu
                      dalam bahasa Jepang.
                    </>
                  ) : index === 5 ? (
                    <>
                      <ruby>水<rt>みず</rt></ruby> berarti air.
                    </>
                  ) : (
                    question.explanation
                  )}
                </p>
              )}
            </article>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">
            {quizSubmitted
              ? "Hasil latihan: " + score + " dari " + situationQuestions.length + " benar."
              : answeredCount + " dari " + situationQuestions.length + " situasi dijawab."}
          </p>
          {quizSubmitted ? (
            <button
              type="button"
              onClick={resetQuiz}
              className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1] hover:bg-[#B8860B]/10"
            >
              <RefreshCw size={13} />
              Ulangi latihan
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={answeredCount !== situationQuestions.length}
              className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa jawaban
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            KATA-KATA KATAKANA
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Baca kata serapan berikut
          </h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Katakana sering digunakan untuk menulis kata yang berasal dari
            bahasa lain. Coba baca bentuk Jepang, romaji, dan artinya.
          </p>
        </div>
        <p className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-3 text-xs leading-6 text-[#C7C1B5]">
          <span className="font-bold text-[#E7D2A1]">Tanda bunyi panjang:</span>{" "}
          garis ー memanjangkan bunyi vokal sebelumnya, seperti pada
          <span className="font-mincho text-[#E7D2A1]"> コーヒー</span> dan
          <span className="font-mincho text-[#E7D2A1]"> ノート</span>.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {katakanaWords.map((item) => (
            <article
              key={item.word}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
<JapaneseReading
                allowIndexFallback
                romaji={item.romaji}
                translation={item.meaning}
                contentClassName="font-mincho text-2xl font-bold leading-relaxed text-[#F1EBDD]"
                romajiClassName="mt-1 text-sm italic text-[#B8860B]"
                translationClassName="mt-2 text-xs leading-5 text-[#A9A398]"
              >
                {item.word}
              </JapaneseReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            TIPS KEHIDUPAN DI JEPANG
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Kenali hal-hal di sekitar
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Kartu izin tinggal
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              <ruby>在留<rt>ざいりゅう</rt></ruby>カード adalah kartu yang
              memuat informasi penting mengenai status tinggal bagi orang
              asing yang memenuhi ketentuan. Kenali namanya saat membaca
              petunjuk atau dokumen resmi, dan simpan dokumen penting dengan aman.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Makanan bernama おでん
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              おでん adalah hidangan berkuah hangat yang populer, terutama saat
              cuaca dingin. Isinya dapat berupa lobak, telur, konnyaku, dan
              aneka olahan ikan.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Singkatan sehari-hari
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              コンビニ adalah singkatan dari コンビニエンスストア. スマホ
              adalah singkatan dari スマートフォン. Bentuk pendek seperti ini
              sering muncul dalam percakapan dan papan informasi.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Mengenal nyamuk
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Nyamuk disebut <ruby>蚊<rt>か</rt></ruby> (ka). Nyamuk dapat muncul
              terutama pada musim hangat. Perhatikan kasa jendela dan ikuti
              petunjuk penggunaan perlindungan dari gigitan serangga.
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-[#B8860B]/25 bg-gradient-to-br from-[#2B2118] to-[#191817] p-5 md:p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-[#D9B66D]" />
          <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
            CEK TARGET KOMUNIKASI
          </p>
        </div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">
          Coba nilai kemampuanmu
        </h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">
          Nilai kemampuanmu setelah mencoba dialog dan latihan. ★☆☆ berarti
          sudah bisa tetapi masih perlu latihan, ★★☆ berarti sudah bisa, dan
          ★★★ berarti bisa dengan baik. Penilaian ini tersimpan khusus untuk
          Irodori, terpisah dari progres Minna no Nihongo dan JLPT.
        </p>
        <div className="mt-4 space-y-3">
          {canDos.map((canDo, index) => (
            <div
              key={canDo.id}
              className="rounded-xl border border-white/[0.07] bg-black/15 p-3"
            >
              <p className="text-xs font-semibold leading-5 text-[#EAE6DD]">
                <span className="mr-2 text-[#D9B66D]">0{index + 1}</span>
                {canDo.text}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ratingOptions.map((option) => {
                  const selected = ratings[canDo.id] === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        const nextRatings = {
                          ...ratings,
                          [canDo.id]: option.value,
                        };
                        saveIrodoriSelfEvaluation("starter-02", nextRatings);
                      }}
                      className={
                        "rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors " +
                        (selected
                          ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]"
                          : "border-white/[0.08] bg-[#24221F] text-[#A3A099] hover:border-white/20 hover:text-[#EAE6DD]")
                      }
                    >
                      <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {isCompleted ? (
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200">
              <CheckCircle2 size={15} />
              Pelajaran selesai
            </span>
          ) : (
            <button
              type="button"
              onClick={() => completeIrodoriLesson("starter-02")}
              disabled={
                !quizSubmitted ||
                canDos.some((canDo) => !ratings[canDo.id])
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#C93438] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              <CheckCircle2 size={15} />
              Tandai pelajaran selesai
            </button>
          )}

          <Link
            href="/irodori/starter"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"
          >
            Daftar pelajaran
            <ArrowLeft size={15} className="rotate-180" />
          </Link>
        </div>
        {!quizSubmitted && (
          <p className="mt-2 text-[10px] text-[#817A73]">
            Selesaikan kuis situasi dan isi ketiga penilaian target komunikasi untuk
            menyelesaikan pelajaran.
          </p>
        )}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Materi dan dialog contoh disusun orisinal oleh Fude sebagai latihan
        komunikasi tingkat pemula.
      </p>
    </main>
  );
}
