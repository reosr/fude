"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  MessageCircle,
  Sparkles,
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

const speakers = [IRODORI_SPEAKERS.yui, IRODORI_SPEAKERS.sota];

const morningGreetings: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>おはようございます。</>,
    romaji: "Ohayou gozaimasu.",
    translation: "Selamat pagi (sopan).",
    audioFileName: "irodori-starter-01-a01-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>おはようございます。</>,
    romaji: "Ohayou gozaimasu.",
    translation: "Selamat pagi (sopan).",
    audioFileName: "irodori-starter-01-a01-l02.mp3",
  },
];

const casualMorningGreetings: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>おはよう。</>,
    romaji: "Ohayou.",
    translation: "Pagi! (akrab).",
    audioFileName: "irodori-starter-01-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>おはよう。</>,
    romaji: "Ohayou.",
    translation: "Pagi! (akrab).",
    audioFileName: "irodori-starter-01-a01-l04.mp3",
  },
];

const daytimeGreetings: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>こんにちは。</>,
    romaji: "Konnichiwa.",
    translation: "Halo. / Selamat siang.",
    audioFileName: "irodori-starter-01-a01-l05.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>こんにちは。</>,
    romaji: "Konnichiwa.",
    translation: "Halo. / Selamat siang.",
    audioFileName: "irodori-starter-01-a01-l06.mp3",
  },
];

const eveningGreetings: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>こんばんは。</>,
    romaji: "Konbanwa.",
    translation: "Selamat malam (sapaan saat bertemu).",
    audioFileName: "irodori-starter-01-a01-l07.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>こんばんは。</>,
    romaji: "Konbanwa.",
    translation: "Selamat malam (sapaan saat bertemu).",
    audioFileName: "irodori-starter-01-a01-l08.mp3",
  },
];

const leavingConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します。</>,
    romaji: "Osaki ni shitsurei shimasu.",
    translation: "Permisi, saya pamit lebih dahulu.",
    audioFileName: "irodori-starter-01-a02-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>お<ruby>疲<rt>つか</rt></ruby>れさまでした。</>,
    romaji: "Otsukaresama deshita.",
    translation: "Terima kasih atas kerja keras hari ini.",
    audioFileName: "irodori-starter-01-a02-l02.mp3",
  },
];

const friendFarewellConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>じゃあ、また。</>,
    romaji: "Jaa, mata.",
    translation: "Kalau begitu, sampai jumpa lagi.",
    audioFileName: "irodori-starter-01-a02-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>またね。</>,
    romaji: "Mata ne.",
    translation: "Sampai jumpa, ya.",
    audioFileName: "irodori-starter-01-a02-l04.mp3",
  },
];

const nightFarewellConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>おやすみなさい。</>,
    romaji: "Oyasuminasai.",
    translation: "Selamat malam (sebelum tidur).",
    audioFileName: "irodori-starter-01-a02-l05.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>おやすみなさい。</>,
    romaji: "Oyasuminasai.",
    translation: "Selamat tidur.",
    audioFileName: "irodori-starter-01-a02-l06.mp3",
  },
];

const thanksConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>これ、どうぞ。</>,
    romaji: "Kore, douzo.",
    translation: "Ini, silakan.",
    audioFileName: "irodori-starter-01-a03-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>あ、ありがとうございます。</>,
    romaji: "A, arigatou gozaimasu.",
    translation: "Oh, terima kasih.",
    audioFileName: "irodori-starter-01-a03-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>いえいえ。</>,
    romaji: "Ie ie.",
    translation: "Tidak apa-apa. / Sama-sama.",
    audioFileName: "irodori-starter-01-a03-l03.mp3",
  },
];

const thanksWithSumimasenConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>どうぞ。</>,
    romaji: "Douzo.",
    translation: "Silakan.",
    audioFileName: "irodori-starter-01-a03-l04.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>すみません。ありがとうございます。</>,
    romaji: "Sumimasen. Arigatou gozaimasu.",
    translation: "Wah, terima kasih. (Ungkapan sopan saat menerima bantuan.)",
    audioFileName: "irodori-starter-01-a03-l05.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>いえいえ。</>,
    romaji: "Ie ie.",
    translation: "Tidak apa-apa. / Sama-sama.",
    audioFileName: "irodori-starter-01-a03-l06.mp3",
  },
];

const apologyConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>あっ、すみません。</>,
    romaji: "A, sumimasen.",
    translation: "Ah, maaf.",
    audioFileName: "irodori-starter-01-a03-l07.mp3",
  },
  {
    speakerId: "sota",
    japanese: <><ruby>大丈夫<rt>だいじょうぶ</rt></ruby>ですよ。</>,
    romaji: "Daijoubu desu yo.",
    translation: "Tidak apa-apa.",
    audioFileName: "irodori-starter-01-a03-l08.mp3",
  },
];

const casualApologyConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>ごめんね。</>,
    romaji: "Gomen ne.",
    translation: "Maaf, ya. (Akrab.)",
    audioFileName: "irodori-starter-01-a03-l09.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>ううん、<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>。</>,
    romaji: "Uun, daijoubu.",
    translation: "Tidak, tidak apa-apa. (Akrab.)",
    audioFileName: "irodori-starter-01-a03-l10.mp3",
  },
];

const situationQuestions = [
  {
    prompt: "Pukul 07.30. Kamu bertemu guru di sekolah. Apa sapaan yang sesuai?",
    options: ["おはようございます", "こんにちは", "こんばんは"],
    answer: "おはようございます",
    explanation: "おはようございます adalah sapaan pagi yang sopan dan sesuai untuk guru.",
  },
  {
    prompt: "Pagi hari, kamu bertemu teman dekat. Apa yang bisa kamu ucapkan?",
    options: ["おやすみなさい", "おはよう", "お先に失礼します"],
    answer: "おはよう",
    explanation: "おはよう adalah bentuk akrab dari sapaan pagi.",
  },
  {
    prompt: "Pukul 14.00, kamu bertemu tetangga. Apa sapaannya?",
    options: ["こんばんは", "おはようございます", "こんにちは"],
    answer: "こんにちは",
    explanation: "こんにちは umum digunakan sebagai sapaan pada siang hari.",
  },
  {
    prompt: "Pukul 19.00, kamu bertemu kenalan di depan rumah. Apa sapaannya?",
    options: ["こんばんは", "おやすみなさい", "じゃあ、また"],
    answer: "こんばんは",
    explanation: "こんばんは digunakan saat bertemu seseorang pada malam hari. おやすみなさい diucapkan sebelum tidur.",
  },
  {
    prompt: "Kamu selesai bekerja dan pulang lebih dahulu daripada rekan kerja. Apa yang kamu katakan?",
    options: ["お疲れさまでした", "お先に失礼します", "おはようございます"],
    answer: "お先に失礼します",
    explanation: "Orang yang pulang lebih dahulu menggunakan ungkapan pamit, sedangkan rekan yang masih bekerja memberikan balasan yang sesuai.",
  },
  {
    prompt: "Seorang tetangga menahan pintu agar kamu bisa lewat. Ungkapan sopan apa yang juga dapat menyampaikan terima kasih?",
    options: ["すみません", "おやすみなさい", "じゃあ、また"],
    answer: "すみません",
    explanation: "すみません dapat dipakai untuk menyampaikan terima kasih saat menerima bantuan kecil. Dalam situasi lain, ありがとうございます juga merupakan pilihan yang sopan.",
  },
  {
    prompt: "Kamu tidak sengaja menyenggol teman dekat. Ungkapan akrab apa yang bisa kamu gunakan untuk meminta maaf?",
    options: ["ごめんね", "こんばんは", "お先に失礼します"],
    answer: "ごめんね",
    explanation: "ごめんね adalah permintaan maaf yang akrab. Untuk orang yang belum dikenal atau situasi lebih sopan, gunakan すみません.",
  },
];

function renderJapaneseOption(option: string) {
  switch (option) {
    case "お先に失礼します":
      return (
        <>
          お<ruby>先<rt>さき</rt></ruby>に
          <ruby>失礼<rt>しつれい</rt></ruby>します
        </>
      );
    case "お疲れさまでした":
      return (
        <>
          お<ruby>疲<rt>つか</rt></ruby>れさまでした
        </>
      );
    default:
      return option;
  }
}

const stickerQuestions = [
  {
    sticker: "おはようございます",
    reading: "Ohayou gozaimasu",
    question: "Stiker ini paling sesuai dikirim ketika ...",
    options: [
      "Mengirim pesan pada pagi hari",
      "Akan tidur malam",
      "Mengucapkan selamat tinggal setelah bekerja",
    ],
    answer: "Mengirim pesan pada pagi hari",
    explanation: "おはようございます adalah sapaan sopan yang umum dipakai pada pagi hari.",
  },
  {
    sticker: "ありがとう",
    reading: "Arigatou",
    question: "Apa maksud stiker ini?",
    options: ["Maaf ya", "Terima kasih", "Sampai jumpa"],
    answer: "Terima kasih",
    explanation: "ありがとう adalah ungkapan terima kasih yang akrab.",
  },
  {
    sticker: "おやすみなさい",
    reading: "Oyasuminasai",
    question: "Kapan stiker ini cocok dikirim?",
    options: [
      "Saat bertemu pada siang hari",
      "Saat akan tidur",
      "Saat menerima hadiah pada pagi hari",
    ],
    answer: "Saat akan tidur",
    explanation: "おやすみなさい adalah ucapan sebelum tidur atau selamat tidur.",
  },
  {
    sticker: "じゃあ、また",
    reading: "Jaa, mata",
    question: "Apa maksud pesan ini?",
    options: ["Sampai jumpa lagi", "Selamat pagi", "Terima kasih banyak"],
    answer: "Sampai jumpa lagi",
    explanation: "じゃあ、また adalah ungkapan perpisahan santai.",
  },
  {
    sticker: "すみません",
    reading: "Sumimasen",
    question: "Ungkapan ini dapat digunakan untuk ...",
    options: [
      "Meminta maaf atau menarik perhatian",
      "Mengucapkan selamat tidur",
      "Menyapa teman pada pagi hari",
    ],
    answer: "Meminta maaf atau menarik perhatian",
    explanation: "すみません dapat berarti maaf atau permisi, tergantung situasinya.",
  },
];

const vocabulary = [
  { jp: <>おはようございます</>, romaji: "Ohayou gozaimasu", meaning: "Selamat pagi (sopan)" },
  { jp: <>おはよう</>, romaji: "Ohayou", meaning: "Selamat pagi (akrab)" },
  { jp: <>こんにちは</>, romaji: "Konnichiwa", meaning: "Halo / selamat siang" },
  { jp: <>こんばんは</>, romaji: "Konbanwa", meaning: "Selamat malam (sapaan)" },
  { jp: <>じゃあ、また</>, romaji: "Jaa, mata", meaning: "Kalau begitu, sampai jumpa lagi" },
  { jp: <>またね</>, romaji: "Mata ne", meaning: "Sampai jumpa (akrab)" },
  { jp: <>おやすみなさい</>, romaji: "Oyasuminasai", meaning: "Selamat tidur" },
  { jp: <>お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します</>, romaji: "Osaki ni shitsurei shimasu", meaning: "Permisi, saya pamit lebih dahulu" },
  { jp: <>お<ruby>疲<rt>つか</rt></ruby>れさまでした</>, romaji: "Otsukaresama deshita", meaning: "Terima kasih atas kerja keras hari ini" },
  { jp: <>ありがとうございます</>, romaji: "Arigatou gozaimasu", meaning: "Terima kasih (sopan)" },
  { jp: <>どうもありがとう</>, romaji: "Doumo arigatou", meaning: "Terima kasih banyak (akrab)" },
  { jp: <>すみません</>, romaji: "Sumimasen", meaning: "Maaf / permisi" },
  { jp: <>ごめんね</>, romaji: "Gomen ne", meaning: "Maaf ya (akrab)" },
  { jp: <>どうぞ</>, romaji: "Douzo", meaning: "Silakan / ini" },
  { jp: <>いえいえ</>, romaji: "Ie ie", meaning: "Tidak apa-apa / sama-sama" },
];

const canDos = [
  {
    id: "greetings",
    text: "Bertukar sapaan saat bertemu seseorang.",
  },
  {
    id: "leave-taking",
    text: "Berpamitan ketika akan meninggalkan tempat.",
  },
  {
    id: "thanks-apology",
    text: "Mengucapkan terima kasih atau meminta maaf.",
  },
  {
    id: "message-stickers",
    text: "Memahami pesan singkat seperti selamat pagi dan terima kasih.",
  },
];

const canDoRatingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Sudah bisa, masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

const hiraganaWords = [
  { word: "おはよう", romaji: "Ohayou", meaning: "Selamat pagi (akrab)" },
  { word: "ありがとう", romaji: "Arigatou", meaning: "Terima kasih (akrab)" },
  { word: "ごめんね", romaji: "Gomen ne", meaning: "Maaf ya (akrab)" },
  { word: "またね", romaji: "Mata ne", meaning: "Sampai jumpa (akrab)" },
  { word: "こんにちは", romaji: "Konnichiwa", meaning: "Halo / selamat siang" },
  { word: "こんばんは", romaji: "Konbanwa", meaning: "Selamat malam (sapaan)" },
  { word: "おやすみなさい", romaji: "Oyasuminasai", meaning: "Selamat tidur" },
];

export default function IrodoriPemulaLessonOnePage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [situationAnswers, setSituationAnswers] = useState<Record<number, string>>({});
  const [situationQuizSubmitted, setSituationQuizSubmitted] = useState(false);
  const progress = useIrodoriProgress();
  const canDoRatings = progress.selfEvaluations["starter-01"] ?? {};
  const isLessonCompleted = progress.completedLessons.includes("starter-01");

  const answeredCount = Object.keys(answers).length;
  const score = stickerQuestions.filter(
    (question, index) => answers[index] === question.answer
  ).length;
  const situationAnsweredCount = Object.keys(situationAnswers).length;
  const situationScore = situationQuestions.filter(
    (question, index) => situationAnswers[index] === question.answer
  ).length;

  const resetQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
  };

  const resetSituationQuiz = () => {
    setSituationAnswers({});
    setSituationQuizSubmitted(false);
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
          挨
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">
            TOPIK 01 • MULAI BERBICARA BAHASA JEPANG
          </p>
          <p className="mt-5 text-sm font-semibold text-[#B9A98B]">
            Pelajaran 1
          </p>
          <h1 className="mt-1 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Selamat pagi!</h1>
          <p className="mt-2 font-mincho text-2xl text-[#D9B66D]">
            おはようございます
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#B6B0A5]">
            Belajar menyapa, berpamitan, berterima kasih, dan meminta maaf
            melalui ungkapan sederhana yang bisa langsung digunakan sehari-hari.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              4 target komunikasi
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              Dialog dengan 2 tokoh
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              Kuis pemahaman
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
              Menyapa saat bertemu
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Sapaan Jepang berubah mengikuti waktu saat bertemu. Pada pagi hari,
          gunakan おはようございます dalam situasi sopan dan おはよう kepada
          teman dekat. Pada siang hari gunakan こんにちは, sedangkan pada malam
          hari saat bertemu gunakan こんばんは.
        </p>
        <IrodoriConversation
          title="Percakapan A · Pagi hari (sopan)"
          speakers={speakers}
          utterances={morningGreetings}
        />
        <IrodoriConversation
          title="Percakapan B · Pagi hari (akrab)"
          speakers={speakers}
          utterances={casualMorningGreetings}
        />
        <IrodoriConversation
          title="Percakapan C · Bertemu pada siang hari"
          speakers={speakers}
          utterances={daytimeGreetings}
        />
        <IrodoriConversation
          title="Percakapan D · Bertemu pada malam hari"
          speakers={speakers}
          utterances={eveningGreetings}
        />
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
            <p className="text-[9px] font-bold text-[#B8860B]">PAGI</p>
            <p className="mt-1 font-mincho text-lg text-[#EAE6DD]">おはよう</p>
            <p className="text-[10px] text-[#A3A099]">おはようございます lebih sopan.</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
            <p className="text-[9px] font-bold text-[#B8860B]">SIANG</p>
            <p className="mt-1 font-mincho text-lg text-[#EAE6DD]">こんにちは</p>
            <p className="text-[10px] text-[#A3A099]">Sapaan umum pada siang hari.</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
            <p className="text-[9px] font-bold text-[#B8860B]">MALAM</p>
            <p className="mt-1 font-mincho text-lg text-[#EAE6DD]">こんばんは</p>
            <p className="text-[10px] text-[#A3A099]">Sapaan saat bertemu pada malam hari.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B8860B]/15 text-[#D9B66D]">
            <Compass size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 02
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Berpamitan saat pulang
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Dalam situasi kerja, orang yang pulang lebih dahulu dapat mengatakan
          <ruby>お先<rt>おさき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します.
          Rekan yang masih tinggal dapat membalas dengan
          お<ruby>疲<rt>つか</rt></ruby>れさまでした.
        </p>
        <IrodoriConversation
          title="Percakapan A · Pulang lebih dahulu dari tempat kerja"
          speakers={speakers}
          utterances={leavingConversation}
        />
        <IrodoriConversation
          title="Percakapan B · Berpisah dengan teman"
          speakers={speakers}
          utterances={friendFarewellConversation}
        />
        <IrodoriConversation
          title="Percakapan C · Sebelum tidur"
          speakers={speakers}
          utterances={nightFarewellConversation}
        />
        <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">Ingat perbedaannya</p>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">
            じゃあ、また dan またね cocok untuk perpisahan santai.
            お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します
            digunakan saat meninggalkan tempat kerja lebih dahulu. おやすみなさい
            diucapkan sebelum tidur, bukan sebagai sapaan ketika baru bertemu.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F8A67]/15 text-[#85C49A]">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 03
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Berterima kasih dan meminta maaf
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          ありがとうございます adalah ucapan terima kasih yang sopan.
          すみません dapat menyampaikan permintaan maaf, menarik perhatian,
          atau rasa terima kasih saat menerima bantuan. ごめんね lebih akrab
          dan digunakan kepada orang yang dekat.
        </p>
        <IrodoriConversation
          title="Percakapan A · Menerima sesuatu"
          speakers={speakers}
          utterances={thanksConversation}
        />
        <IrodoriConversation
          title="Percakapan B · Menerima bantuan dengan sopan"
          speakers={speakers}
          utterances={thanksWithSumimasenConversation}
        />
        <IrodoriConversation
          title="Percakapan C · Meminta maaf dengan sopan"
          speakers={speakers}
          utterances={apologyConversation}
        />
        <IrodoriConversation
          title="Percakapan D · Meminta maaf kepada teman"
          speakers={speakers}
          utterances={casualApologyConversation}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#80619B]/15 text-[#B99AD8]">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 04
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Memahami stiker pesan
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Stiker pada aplikasi pesan sering memakai ungkapan singkat. Pilih
          makna yang paling sesuai untuk setiap pesan.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {stickerQuestions.map((question, index) => (
            <article
              key={question.sticker}
              className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] font-black tracking-widest text-[#B8860B]">
                  STIKER 0{index + 1}
                </span>
                <span className="text-[10px] text-[#817A73]">
                  {question.reading}
                </span>
              </div>
              <div className="my-4 flex min-h-20 items-center justify-center rounded-xl border border-[#B8860B]/15 bg-gradient-to-br from-[#342A20] to-[#211C19]">
                <span className="font-mincho text-2xl font-bold text-[#EAD5A6]">
                  {question.sticker}
                </span>
              </div>
              <p className="mb-3 text-xs font-semibold text-[#EAE6DD]">
                {question.question}
              </p>
              <div className="space-y-2">
                {question.options.map((option) => {
                  const selected = answers[index] === option;
                  const correct = option === question.answer;
                  const showResult = quizSubmitted;

                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        if (quizSubmitted) return;
                        setAnswers((current) => ({ ...current, [index]: option }));
                      }}
                      disabled={quizSubmitted}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left text-[11px] transition-colors ${
                        showResult && correct
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                          : showResult && selected
                            ? "border-red-400/50 bg-red-400/10 text-red-200"
                            : selected
                              ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398] hover:border-white/20"
                      }`}
                    >
                      <span className="mr-2 inline-block w-4 text-center">
                        {showResult && correct ? "✓" : selected ? "●" : "○"}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
              {quizSubmitted && (
                <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                  {question.explanation}
                </p>
              )}
            </article>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">
            {quizSubmitted
              ? `Hasil latihan: ${score} dari ${stickerQuestions.length} benar.`
              : `${answeredCount} dari ${stickerQuestions.length} pertanyaan dijawab.`}
          </p>
          {quizSubmitted ? (
            <button
              type="button"
              onClick={resetQuiz}
              className="rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1] hover:bg-[#B8860B]/10"
            >
              Ulangi latihan
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={answeredCount !== stickerQuestions.length}
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
            PRAKTIK SITUASI
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Pilih ungkapan sesuai situasi
          </h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Baca waktunya dan perhatikan siapa lawan bicaramu. Pilih ungkapan
            yang paling sesuai, bukan sekadar yang artinya kamu ingat.
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
                  const selected = situationAnswers[index] === option;
                  const correct = option === question.answer;

                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        if (situationQuizSubmitted) return;
                        setSituationAnswers((current) => ({
                          ...current,
                          [index]: option,
                        }));
                      }}
                      disabled={situationQuizSubmitted}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left text-xs transition-colors ${
                        situationQuizSubmitted && correct
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                          : situationQuizSubmitted && selected
                            ? "border-red-400/50 bg-red-400/10 text-red-200"
                            : selected
                              ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398] hover:border-white/20"
                      }`}
                    >
                      <span className="mr-2 inline-block w-4 text-center">
                        {situationQuizSubmitted && correct
                          ? "✓"
                          : selected
                            ? "●"
                            : "○"}
                      </span>
                      <span className="font-mincho text-sm [&_rt]:text-[0.65em] [&_rt]:text-[#D6AD4F]">{renderJapaneseOption(option)}</span>
                    </button>
                  );
                })}
              </div>
              {situationQuizSubmitted && (
                <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                  {index === 4 ? (
                    <>
                      Orang yang pulang lebih dahulu mengatakan
                      {" "}お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します.
                      {" "}Rekan yang masih bekerja dapat membalas
                      {" "}お<ruby>疲<rt>つか</rt></ruby>れさまでした.
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
            {situationQuizSubmitted
              ? `Hasil latihan: ${situationScore} dari ${situationQuestions.length} benar.`
              : `${situationAnsweredCount} dari ${situationQuestions.length} situasi dijawab.`}
          </p>
          {situationQuizSubmitted ? (
            <button
              type="button"
              onClick={resetSituationQuiz}
              className="rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1] hover:bg-[#B8860B]/10"
            >
              Ulangi latihan
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSituationQuizSubmitted(true)}
              disabled={situationAnsweredCount !== situationQuestions.length}
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
            UNGKAPAN PENTING
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Kosakata dan frasa
          </h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#1B1A18]">
          {vocabulary.map((item, index) => (
            <div
              key={item.romaji}
              className={`grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center sm:gap-4 ${
                index > 0 ? "border-t border-white/[0.05]" : ""
              }`}
            >
              <JapaneseReading
                allowIndexFallback
                romaji={item.romaji}
                translation={item.meaning}
                contentClassName="font-mincho text-base font-bold leading-relaxed text-[#EAE6DD]"
                romajiClassName="mt-1 text-sm italic leading-relaxed text-[#B8860B]"
                translationClassName="mt-2 text-xs leading-5 text-[#A9A398]"
              >
                {item.jp}
              </JapaneseReading>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            KATA-KATA HIRAGANA
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Baca ungkapan berikut
          </h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Semua contoh di bawah ditulis dengan hiragana. Coba baca perlahan,
            lalu cocokkan dengan romaji dan artinya.
          </p>
          <p className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-3 text-xs leading-6 text-[#C7C1B5]">
            <span className="font-bold text-[#E7D2A1]">Catatan baca:</span>{" "}
            pada こんにちは dan こんばんは, huruf は di akhir sapaan dibaca
            “wa”, bukan “ha”.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {hiraganaWords.map((item) => (
            <article
              key={item.word}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <JapaneseReading
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

      <section className="space-y-3">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            TIPS KEHIDUPAN DI JEPANG
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Perhatikan konteksnya
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Sapaan dan gestur
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Sapaan dapat disertai anggukan atau sedikit membungkuk. Ikuti
              situasi dan kebiasaan orang yang sedang diajak bicara.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Tidak semua pamit adalah さようなら
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Untuk teman, じゃあ、また atau またね terdengar santai.
              Di tempat kerja, gunakan ungkapan pamit dan balasan yang sesuai.
              おやすみなさい khusus untuk mengucapkan selamat tidur.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Makna すみません
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Selain meminta maaf, すみません juga dapat dipakai untuk menarik
              perhatian seseorang. Dalam konteks tertentu, ungkapan ini juga
              menyampaikan rasa terima kasih.
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
          Nilai kemampuanmu setelah mencoba aktivitas dan latihan. ★☆☆ berarti
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
                {canDoRatingOptions.map((option) => {
                  const selected = canDoRatings[canDo.id] === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        const nextRatings = {
                          ...canDoRatings,
                          [canDo.id]: option.value,
                        };
                        saveIrodoriSelfEvaluation("starter-01", nextRatings);
                      }}
                      className={`rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors ${
                        selected
                          ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]"
                          : "border-white/[0.08] bg-[#24221F] text-[#A3A099] hover:border-white/20 hover:text-[#EAE6DD]"
                      }`}
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
          {isLessonCompleted ? (
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200">
              <CheckCircle2 size={15} />
              Pelajaran selesai
            </span>
          ) : (
            <button
              type="button"
              onClick={() => completeIrodoriLesson("starter-01")}
              disabled={
                !quizSubmitted ||
                !situationQuizSubmitted ||
                canDos.some((canDo) => !canDoRatings[canDo.id])
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
            <ChevronRight size={15} />
          </Link>
        </div>
        {!quizSubmitted && (
          <p className="mt-2 text-[10px] text-[#817A73]">
            Selesaikan kuis stiker dan latihan situasi, lalu isi penilaian
            target komunikasi untuk menyelesaikan pelajaran.
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
