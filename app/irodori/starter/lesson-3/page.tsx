"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  FileText,
  IdCard,
  MessageCircle,
  RefreshCw,
  Users,
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

const introductionConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>はじめまして。ユイです。</>,
    romaji: "Hajimemashite. Yui desu.",
    translation: "Salam kenal. Saya Yui.",
    audioFileName: "irodori-starter-03-a01-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はじめまして。ソウタです。</>,
    romaji: "Hajimemashite. Souta desu.",
    translation: "Salam kenal. Saya Sota.",
    audioFileName: "irodori-starter-03-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>インドネシアから<ruby>来<rt>き</rt></ruby>ました。</>,
    romaji: "Indonesia kara kimashita.",
    translation: "Saya datang dari Indonesia.",
    audioFileName: "irodori-starter-03-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>そうですか。どうぞよろしくお<ruby>願<rt>ねが</rt></ruby>いします。</>,
    romaji: "Sou desu ka. Douzo yoroshiku onegaishimasu.",
    translation: "Oh, begitu. Senang berkenalan denganmu.",
    audioFileName: "irodori-starter-03-a01-l04.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>こちらこそ、よろしくお<ruby>願<rt>ねが</rt></ruby>いします。</>,
    romaji: "Kochira koso, yoroshiku onegaishimasu.",
    translation: "Saya juga senang berkenalan denganmu.",
    audioFileName: "irodori-starter-03-a01-l05.mp3",
  },
];

const originConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>お<ruby>名前<rt>なまえ</rt></ruby>は？</>,
    romaji: "Onamae wa?",
    translation: "Siapa nama Anda?",
    audioFileName: "irodori-starter-03-a03-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>ケンジです。</>,
    romaji: "Kenji desu.",
    translation: "Saya Kenji.",
    audioFileName: "irodori-starter-03-a03-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ご<ruby>出身<rt>しゅっしん</rt></ruby>はどちらですか？</>,
    romaji: "Goshusshin wa dochira desu ka?",
    translation: "Anda berasal dari mana?",
    audioFileName: "irodori-starter-03-a03-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>インドネシアのバンドンです。</>,
    romaji: "Indonesia no Bandon desu.",
    translation: "Saya dari Bandung, Indonesia.",
    audioFileName: "irodori-starter-03-a03-l04.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>そうですか。よろしくお<ruby>願<rt>ねが</rt></ruby>いします。</>,
    romaji: "Sou desu ka. Yoroshiku onegaishimasu.",
    translation: "Oh, begitu. Senang berkenalan dengan Anda.",
    audioFileName: "irodori-starter-03-a03-l05.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>こちらこそ、よろしくお<ruby>願<rt>ねが</rt></ruby>いします。</>,
    romaji: "Kochira koso, yoroshiku onegaishimasu.",
    translation: "Saya juga senang berkenalan dengan Anda.",
    audioFileName: "irodori-starter-03-a03-l06.mp3",
  },
];

const canDos = [
  {
    id: "self-introduction",
    text: "Memperkenalkan diri secara sederhana, misalnya menyebutkan nama dan negara atau kota asal.",
  },
  {
    id: "name-tag",
    text: "Menulis nama dan negara asal pada kartu nama sederhana.",
  },
  {
    id: "asking-origin",
    text: "Menanyakan dan menjawab nama serta negara atau kota asal saat pertama kali bertemu.",
  },
  {
    id: "application-form",
    text: "Menulis nama lengkap, kewarganegaraan, dan tanggal lahir pada formulir sederhana.",
  },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Sudah bisa, masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

const vocabulary = [
  { word: "私", reading: "わたし · Watashi", meaning: "Saya" },
  { word: "名前", reading: "なまえ · Namae", meaning: "Nama" },
  { word: "国", reading: "くに · Kuni", meaning: "Negara" },
  { word: "出身", reading: "しゅっしん · Shusshin", meaning: "Tempat asal" },
];

const quizQuestions: {
  prompt: string;
  term?: string;
  options: string[];
  answer: string;
  explanation: string;
}[] = [
  {
    prompt: "Kamu bertemu seseorang untuk pertama kali. Ungkapan pembuka mana yang sesuai?",
    options: ["はじめまして", "おやすみなさい", "じゃあ、また"],
    answer: "はじめまして",
    explanation: "はじめまして digunakan saat berkenalan untuk pertama kali.",
  },
  {
    prompt: "Kalimat mana yang bisa kamu gunakan untuk memperkenalkan namamu?",
    options: ["ユイです", "どうぞよろしくお願いします", "さようなら"],
    answer: "ユイです",
    explanation: "Pola sederhana untuk memperkenalkan nama adalah 「Nama + です」.",
  },
  {
    prompt: "Kamu berasal dari Indonesia. Ungkapan mana yang sesuai?",
    options: [
      "インドネシアから来ました",
      "インドネシア語ができます",
      "インドネシアですか？",
    ],
    answer: "インドネシアから来ました",
    explanation: "から来ました berarti datang dari. Ungkapan ini bisa digunakan untuk menyebut negara atau kota asal.",
  },
  {
    prompt: "Kamu ingin menanyakan asal seseorang. Pertanyaan mana yang paling sesuai?",
    options: [
      "ご出身はどちらですか？",
      "お名前は？",
      "ありがとうございます",
    ],
    answer: "ご出身はどちらですか？",
    explanation: "Ungkapan ini digunakan untuk menanyakan tempat asal seseorang dengan sopan.",
  },
  {
    prompt: "Pada kartu nama, kolom ini digunakan untuk menulis nama lengkap:",
    term: "氏名",
    options: ["Nama lengkap", "Negara asal", "Tanggal lahir"],
    answer: "Nama lengkap",
    explanation: "Kolom ini meminta nama lengkap.",
  },
  {
    prompt: "Pada formulir, kolom ini menanyakan kewarganegaraan:",
    term: "国籍",
    options: ["Nama lengkap", "Kewarganegaraan", "Tempat tinggal"],
    answer: "Kewarganegaraan",
    explanation: "Kolom ini meminta kewarganegaraan.",
  },
  {
    prompt: "Pada formulir, kolom ini meminta tanggal lahir:",
    term: "生年月日",
    options: ["Tanggal lahir", "Nama", "Negara asal"],
    answer: "Tanggal lahir",
    explanation: "Kolom ini meminta tanggal lahir.",
  },
];

function renderJapaneseTerm(term: string) {
  switch (term) {
    case "氏名":
      return <ruby>氏名<rt>しめい</rt></ruby>;
    case "国籍":
      return <ruby>国籍<rt>こくせき</rt></ruby>;
    case "生年月日":
      return <ruby>生年月日<rt>せいねんがっぴ</rt></ruby>;
    case "ご出身はどちらですか？":
      return <>ご<ruby>出身<rt>しゅっしん</rt></ruby>はどちらですか？</>;
    case "お名前は？":
      return <>お<ruby>名前<rt>なまえ</rt></ruby>は？</>;
    case "インドネシアから来ました":
      return <>インドネシアから<ruby>来<rt>き</rt></ruby>ました</>;
    case "インドネシア語ができます":
      return <>インドネシア<ruby>語<rt>ご</rt></ruby>ができます</>;
    default:
      return term;
  }
}

export default function IrodoriStarterLessonThreePage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [nameTagDraft, setNameTagDraft] = useState({
    name: "",
    country: "",
  });
  const [nameTagSubmitted, setNameTagSubmitted] = useState(false);
  const [formDraft, setFormDraft] = useState({
    fullName: "",
    nationality: "",
    birthDate: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const progress = useIrodoriProgress();
  const ratings = progress.selfEvaluations["starter-03"] ?? {};
  const isCompleted = progress.completedLessons.includes("starter-03");

  const answeredCount = Object.keys(answers).length;
  const score = quizQuestions.filter(
    (question, index) => answers[index] === question.answer
  ).length;

  const resetQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
  };

  const normalizedNameTag = {
    name: nameTagDraft.name.trim().replace(/\s/g, ""),
    country: nameTagDraft.country.trim().replace(/\s/g, ""),
  };
  const nameTagResults = [
    normalizedNameTag.name === "マリア・プトリ",
    normalizedNameTag.country === "インドネシア",
  ];
  const canCheckNameTag = Object.values(nameTagDraft).every(
    (value) => value.trim().length > 0
  );

  const resetNameTagPractice = () => {
    setNameTagDraft({ name: "", country: "" });
    setNameTagSubmitted(false);
  };

  const normalizedFormDraft = {
    fullName: formDraft.fullName.trim().replace(/\s/g, ""),
    nationality: formDraft.nationality.trim().replace(/\s/g, ""),
    birthDate: formDraft.birthDate.trim().replace(/\s/g, ""),
  };
  const formResults = [
    normalizedFormDraft.fullName === "マリア・プトリ",
    normalizedFormDraft.nationality === "インドネシア",
    normalizedFormDraft.birthDate === "2002年4月18日",
  ];
  const canCheckForm = Object.values(formDraft).every(
    (value) => value.trim().length > 0
  );

  const resetFormPractice = () => {
    setFormDraft({ fullName: "", nationality: "", birthDate: "" });
    setFormSubmitted(false);
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
          STARTER • A1
        </span>
      </div>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#79602F]/45 bg-gradient-to-br from-[#302319] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-6 -top-10 select-none font-mincho text-[190px] leading-none text-[#D6AD4F]/[0.07]">
          名
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">
            TOPIC 02 • ABOUT MYSELF
          </p>
          <p className="mt-5 text-sm font-semibold text-[#B9A98B]">
            Pelajaran 3
          </p>
          <h1 className="mt-1 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Senang berkenalan dengan Anda.</h1>
          <p className="mt-2 font-mincho text-2xl text-[#D9B66D]">
            はじめまして
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#B6B0A5]">
            Belajar memperkenalkan diri, menulis kartu nama sederhana,
            menanyakan tempat asal, dan mengenali kolom pada formulir.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              4 target Can-do
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              2 dialog orisinal
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              7 latihan situasi
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
              ACTIVITY 01
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Memperkenalkan diri
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Saat bertemu orang untuk pertama kali, awali dengan はじめまして.
          Sebutkan nama, lalu ceritakan negara atau kota asalmu. Akhiri dengan
          ungkapan sopan どうぞよろしくお願いします.
        </p>
        <IrodoriConversation
          title="Scene A · Berkenalan untuk pertama kali"
          speakers={[IRODORI_SPEAKERS.yui, IRODORI_SPEAKERS.sota]}
          utterances={introductionConversation}
        />
        <div className="rounded-xl border border-[#B8860B]/20 bg-gradient-to-br from-[#2B2118] to-[#191817] p-4">
          <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
            POLA PERKENALAN SEDERHANA
          </p>
          <p className="mt-2 font-mincho text-xl leading-[2] text-[#F1EBDD]">
            はじめまして。〇〇です。
          </p>
          <p className="font-mincho text-lg leading-[2] text-[#E7D2A1]">
            〇〇から来ました。
          </p>
          <p className="font-mincho text-lg leading-[2] text-[#E7D2A1]">
            どうぞよろしくお願いします。
          </p>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">
            Ganti 〇〇 dengan nama dan negara atau kota asal pada contoh
            perkenalanmu.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4D7198]/15 text-[#8CB0D8]">
            <IdCard size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 02
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Menulis kartu nama
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Kartu nama sederhana dapat memuat nama dan negara asal. Nama asing
          sering ditulis menggunakan katakana. Perhatikan contoh kartu nama
          fiktif berikut.
        </p>
        <div className="mx-auto max-w-md rounded-2xl border border-[#D6AD4F]/30 bg-gradient-to-br from-[#F0E6CC] to-[#CDBD9C] p-5 text-[#332A20] shadow-[0_14px_40px_rgba(0,0,0,0.22)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] text-[#8A6A36]">
                NAME TAG · SAMPLE
              </p>
              <p className="mt-4 font-mincho text-2xl font-bold">
                マリア・プトリ
              </p>
              <p className="mt-1 text-xs text-[#6D5B43]">
                インドネシア
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#9B7B47]/40 bg-white/35">
              <BadgeCheck size={20} />
            </span>
          </div>
          <div className="mt-5 border-t border-[#8A6A36]/25 pt-3">
            <p className="font-mincho text-sm font-bold">名前（なまえ）</p>
            <p className="mt-1 text-[10px] text-[#6D5B43]">
              Nama
            </p>
            <p className="mt-3 font-mincho text-sm font-bold">国（くに）</p>
            <p className="mt-1 text-[10px] text-[#6D5B43]">
              Negara
            </p>
          </div>
        </div>
        <p className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3 text-xs leading-6 text-[#A9A398]">
          <span className="font-bold text-[#E7D2A1]">Ingat:</span>{" "}
          untuk latihan menulis nama, ikuti cara penulisan nama yang diminta
          pada kartu atau formulir. Contoh di atas hanya memakai tokoh fiktif.
        </p>

        <div className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              LATIHAN KARTU NAMA
            </p>
            <h3 className="mt-1 text-sm font-bold text-[#EAE6DD]">
              Salin nama dan negara
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Gunakan contoh kartu nama di atas. Tulis nama dan negara dalam
              bahasa Jepang.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-[#C7C1B5]">
                <ruby>名前<rt>なまえ</rt></ruby> · Nama
              </span>
              <input
                type="text"
                value={nameTagDraft.name}
                onChange={(event) =>
                  setNameTagDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                disabled={nameTagSubmitted}
                placeholder="マリア・プトリ"
                aria-label="Tulis nama pada kartu nama"
                className="w-full rounded-lg border border-white/[0.1] bg-black/20 px-3 py-3 font-mincho text-base text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#B8860B]/50 disabled:opacity-70"
              />
              {nameTagSubmitted && (
                <span className={nameTagResults[0] ? "mt-1 block text-[10px] text-emerald-300" : "mt-1 block text-[10px] text-red-300"}>
                  {nameTagResults[0] ? "Benar" : "Periksa kembali penulisan nama."}
                </span>
              )}
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-[#C7C1B5]">
                <ruby>国<rt>くに</rt></ruby> · Negara
              </span>
              <input
                type="text"
                value={nameTagDraft.country}
                onChange={(event) =>
                  setNameTagDraft((current) => ({
                    ...current,
                    country: event.target.value,
                  }))
                }
                disabled={nameTagSubmitted}
                placeholder="インドネシア"
                aria-label="Tulis negara pada kartu nama"
                className="w-full rounded-lg border border-white/[0.1] bg-black/20 px-3 py-3 font-mincho text-base text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#B8860B]/50 disabled:opacity-70"
              />
              {nameTagSubmitted && (
                <span className={nameTagResults[1] ? "mt-1 block text-[10px] text-emerald-300" : "mt-1 block text-[10px] text-red-300"}>
                  {nameTagResults[1] ? "Benar" : "Periksa kembali nama negara."}
                </span>
              )}
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">
              {nameTagSubmitted
                ? "Hasil: " + nameTagResults.filter(Boolean).length + " dari 2 bagian benar."
                : "Isi kedua kolom menggunakan contoh fiktif."}
            </p>
            {nameTagSubmitted ? (
              <button
                type="button"
                onClick={resetNameTagPractice}
                className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1] hover:bg-[#B8860B]/10"
              >
                <RefreshCw size={13} />
                Ulangi latihan
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setNameTagSubmitted(true)}
                disabled={!canCheckNameTag}
                className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
              >
                Periksa kartu nama
              </button>
            )}
          </div>
          <p className="mt-3 text-[10px] leading-5 text-[#817A73]">
            Isian ini hanya untuk latihan dan tidak disimpan ke profil atau progres.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#80619B]/15 text-[#B99AD8]">
            <Users size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 03
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Menanyakan nama dan tempat asal
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Setelah berkenalan, kamu dapat menanyakan nama dan tempat asal orang
          lain. Ungkapan pertama menanyakan nama, sedangkan ungkapan kedua
          menanyakan tempat asal dengan sopan.
        </p>
        <IrodoriConversation
          title="Scene A · Bertanya tentang asal"
          speakers={[IRODORI_SPEAKERS.akiko, IRODORI_SPEAKERS.kenji]}
          utterances={originConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-bold text-[#B8860B]">
              MENANYAKAN NAMA
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              お<ruby>名前<rt>なまえ</rt></ruby>は？
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">
              Siapa nama Anda?
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-bold text-[#B8860B]">
              MENANYAKAN TEMPAT ASAL
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              ご<ruby>出身<rt>しゅっしん</rt></ruby>はどちらですか？
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">
              Anda berasal dari mana?
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F8A67]/15 text-[#85C49A]">
            <FileText size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 04
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Membaca formulir sederhana
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Formulir dapat meminta nama lengkap, kewarganegaraan, dan tanggal
          lahir. Kenali label setiap kolom agar kamu tahu informasi apa yang
          perlu ditulis.
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
          <div className="flex items-center justify-between border-b border-white/[0.07] bg-black/15 px-4 py-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
                SAMPLE FORM
              </p>
              <h3 className="mt-1 text-sm font-bold text-[#EAE6DD]">
                Formulir pendaftaran
              </h3>
            </div>
            <FileText size={18} className="text-[#B8860B]" />
          </div>
          <div className="divide-y divide-white/[0.06] p-4">
            <div className="grid gap-1 sm:grid-cols-[150px_1fr] sm:items-center sm:gap-3">
              <p className="text-xs font-semibold text-[#C7C1B5]">
                <ruby>氏名<rt>しめい</rt></ruby>
              </p>
              <p className="rounded-lg border border-white/[0.07] bg-black/15 px-3 py-2 font-mincho text-base text-[#F1EBDD]">
                マリア・プトリ
              </p>
            </div>
            <div className="grid gap-1 pt-3 sm:grid-cols-[150px_1fr] sm:items-center sm:gap-3">
              <p className="text-xs font-semibold text-[#C7C1B5]">
                <ruby>国籍<rt>こくせき</rt></ruby>
              </p>
              <p className="rounded-lg border border-white/[0.07] bg-black/15 px-3 py-2 font-mincho text-base text-[#F1EBDD]">
                インドネシア
              </p>
            </div>
            <div className="grid gap-1 pt-3 sm:grid-cols-[150px_1fr] sm:items-center sm:gap-3">
              <p className="text-xs font-semibold text-[#C7C1B5]">
                <ruby>生年月日<rt>せいねんがっぴ</rt></ruby>
              </p>
              <div>
                <p className="rounded-lg border border-white/[0.07] bg-black/15 px-3 py-2 font-mincho text-base text-[#F1EBDD]">
                  2002<ruby>年<rt>ねん</rt></ruby>4<ruby>月<rt>がつ</rt></ruby>18<ruby>日<rt>じゅうはちにち</rt></ruby>
                </p>
                <p className="mt-1 text-[9px] text-[#817A73]">
                  にせんにねん・しがつ・じゅうはちにち
                </p>
              </div>
            </div>
          </div>
          <p className="border-t border-white/[0.06] px-4 py-3 text-[10px] leading-5 text-[#817A73]">
            Data di atas sepenuhnya fiktif dan hanya digunakan sebagai contoh
            membaca kolom formulir.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              LATIHAN MENULIS
            </p>
            <h3 className="mt-1 text-sm font-bold text-[#EAE6DD]">
              Isi formulir dari contoh
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Salin informasi tokoh fiktif di atas ke dalam kolom Jepang.
              Gunakan nama, negara, dan tanggal yang sama.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-[#C7C1B5]">
                <ruby>氏名<rt>しめい</rt></ruby> · Nama lengkap
              </span>
              <input
                type="text"
                value={formDraft.fullName}
                onChange={(event) =>
                  setFormDraft((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
                disabled={formSubmitted}
                placeholder="マリア・プトリ"
                aria-label="Tulis nama lengkap dalam katakana"
                className="w-full rounded-lg border border-white/[0.1] bg-black/20 px-3 py-3 font-mincho text-base text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#B8860B]/50 disabled:opacity-70"
              />
              {formSubmitted && (
                <span className={formResults[0] ? "mt-1 block text-[10px] text-emerald-300" : "mt-1 block text-[10px] text-red-300"}>
                  {formResults[0] ? "Benar" : "Periksa kembali penulisan nama."}
                </span>
              )}
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-[#C7C1B5]">
                <ruby>国籍<rt>こくせき</rt></ruby> · Kewarganegaraan
              </span>
              <input
                type="text"
                value={formDraft.nationality}
                onChange={(event) =>
                  setFormDraft((current) => ({
                    ...current,
                    nationality: event.target.value,
                  }))
                }
                disabled={formSubmitted}
                placeholder="インドネシア"
                aria-label="Tulis kewarganegaraan dalam bahasa Jepang"
                className="w-full rounded-lg border border-white/[0.1] bg-black/20 px-3 py-3 font-mincho text-base text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#B8860B]/50 disabled:opacity-70"
              />
              {formSubmitted && (
                <span className={formResults[1] ? "mt-1 block text-[10px] text-emerald-300" : "mt-1 block text-[10px] text-red-300"}>
                  {formResults[1] ? "Benar" : "Periksa kembali penulisan negara."}
                </span>
              )}
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-[#C7C1B5]">
                <ruby>生年月日<rt>せいねんがっぴ</rt></ruby> · Tanggal lahir
              </span>
              <input
                type="text"
                value={formDraft.birthDate}
                onChange={(event) =>
                  setFormDraft((current) => ({
                    ...current,
                    birthDate: event.target.value,
                  }))
                }
                disabled={formSubmitted}
                placeholder="Salin tanggal dari contoh"
                aria-label="Tulis tanggal lahir dalam format Jepang"
                className="w-full rounded-lg border border-white/[0.1] bg-black/20 px-3 py-3 font-mincho text-base text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#B8860B]/50 disabled:opacity-70"
              />
              {formSubmitted && (
                <span className={formResults[2] ? "mt-1 block text-[10px] text-emerald-300" : "mt-1 block text-[10px] text-red-300"}>
                  {formResults[2] ? "Benar" : "Periksa kembali urutan tanggal."}
                </span>
              )}
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">
              {formSubmitted
                ? "Hasil: " + formResults.filter(Boolean).length + " dari 3 kolom benar."
                : "Isi ketiga kolom menggunakan contoh fiktif."}
            </p>
            {formSubmitted ? (
              <button
                type="button"
                onClick={resetFormPractice}
                className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1] hover:bg-[#B8860B]/10"
              >
                <RefreshCw size={13} />
                Ulangi latihan
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setFormSubmitted(true)}
                disabled={!canCheckForm}
                className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
              >
                Periksa isian
              </button>
            )}
          </div>
          <p className="mt-3 text-[10px] leading-5 text-[#817A73]">
            Isian latihan ini hanya berada di halaman selama latihan dan tidak
            disimpan ke profil atau progres Irodori.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            PRAKTIK SITUASI
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Perkenalan dan informasi diri
          </h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Pilih ungkapan atau arti kolom yang sesuai. Jawab semua pertanyaan,
            lalu periksa hasil latihanmu.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {quizQuestions.map((question, index) => (
            <article
              key=<JapaneseReading allowIndexFallback>{question.prompt}</JapaneseReading>
              className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <p className="text-[9px] font-black tracking-widest text-[#B8860B]">
                LATIHAN 0{index + 1}
              </p>
              <p className="mt-3 text-xs font-semibold leading-6 text-[#EAE6DD]">
                <JapaneseReading allowIndexFallback>{question.prompt}</JapaneseReading>
              </p>
              {question.term && (
                <p className="mt-3 rounded-lg border border-[#B8860B]/20 bg-black/15 px-3 py-2 text-center font-mincho text-xl text-[#E7D2A1] [&_rt]:text-[0.65em]">
                  {renderJapaneseTerm(question.term)}
                </p>
              )}
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
                        {renderJapaneseTerm(option)}
                      </span>
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
              ? "Hasil latihan: " + score + " dari " + quizQuestions.length + " benar."
              : answeredCount + " dari " + quizQuestions.length + " pertanyaan dijawab."}
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
              disabled={answeredCount !== quizQuestions.length}
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
            KATA-KATA PENTING
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Kanji sederhana
          </h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {vocabulary.map((item) => (
            <article
              key={item.word}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <p className="font-mincho text-2xl font-bold text-[#F1EBDD]">
                {item.word}
              </p>
              <p className="mt-1 text-[10px] italic text-[#B8860B]">
                {item.reading}
              </p>
              <p className="mt-2 text-xs text-[#A9A398]">{item.meaning}</p>
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
            Nama dan cara menyapa
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Menggunakan さん
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              さん diletakkan setelah nama orang sebagai sapaan sopan.
              Contohnya, ユイさん. Biasanya, jangan menambahkan さん pada
              nama sendiri ketika memperkenalkan diri.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Nama asing dan katakana
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Nama dari bahasa lain sering ditulis menggunakan katakana.
              Ejaan dapat disesuaikan dengan bunyi nama, jadi penulisannya
              mungkin tidak sama persis dengan huruf Latin.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4 sm:col-span-2">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Kalender Jepang
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Selain kalender masehi (<ruby>西暦<rt>せいれき</rt></ruby>),
              Jepang juga menggunakan kalender era
              (<ruby>和暦<rt>われき</rt></ruby>) pada beberapa dokumen. Perhatikan
              apakah formulir meminta tahun masehi atau tahun era sebelum mengisi tanggal.
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-[#B8860B]/25 bg-gradient-to-br from-[#2B2118] to-[#191817] p-5 md:p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-[#D9B66D]" />
          <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
            CAN-DO CHECK
          </p>
        </div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">
          Coba nilai kemampuanmu
        </h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">
          Nilai kemampuanmu setelah mencoba dialog, kartu nama, dan formulir.
          ★☆☆ berarti sudah bisa tetapi masih perlu latihan, ★★☆ berarti
          sudah bisa, dan ★★★ berarti bisa dengan baik. Penilaian ini tersimpan
          khusus untuk Irodori, terpisah dari progres Minna no Nihongo dan JLPT.
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
                        saveIrodoriSelfEvaluation("starter-03", nextRatings);
                      }}
                      className={
                        "rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors " +
                        (selected
                          ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]"
                          : "border-white/[0.08] bg-[#24221F] text-[#A3A099] hover:border-white/20 hover:text-[#EAE6DD]")
                      }
                    >
                      <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
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
              onClick={() => completeIrodoriLesson("starter-03")}
              disabled={
                !quizSubmitted ||
                !nameTagSubmitted ||
                !formSubmitted ||
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
        {(!quizSubmitted || !nameTagSubmitted || !formSubmitted) && (
          <p className="mt-2 text-[10px] text-[#817A73]">
            Selesaikan kuis situasi, dua latihan menulis, dan isi keempat
            penilaian Can-do untuk menyelesaikan pelajaran.
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
