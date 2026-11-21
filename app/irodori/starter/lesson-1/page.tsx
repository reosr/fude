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
  type IrodoriSpeaker,
  type IrodoriUtterance,
} from "@/components/IrodoriConversation";

const speakers: IrodoriSpeaker[] = [
  {
    id: "A",
    name: "Yui",
    role: "Rekan kerja",
    voiceDescription: "Perempuan muda · jernih, ramah, natural",
  },
  {
    id: "B",
    name: "Sota",
    role: "Rekan kerja",
    voiceDescription: "Laki-laki muda · jelas, hangat, santai",
  },
];

const morningGreetings: IrodoriUtterance[] = [
  {
    speakerId: "A",
    japanese: <>おはようございます。</>,
    romaji: "Ohayou gozaimasu.",
    translation: "Selamat pagi.",
    audioFileName: "irodori-starter-01-a01-l01.mp3",
  },
  {
    speakerId: "B",
    japanese: <>おはようございます。</>,
    romaji: "Ohayou gozaimasu.",
    translation: "Selamat pagi.",
    audioFileName: "irodori-starter-01-a01-l02.mp3",
  },
];

const daytimeGreetings: IrodoriUtterance[] = [
  {
    speakerId: "A",
    japanese: <>こんにちは。</>,
    romaji: "Konnichiwa.",
    translation: "Halo. / Selamat siang.",
    audioFileName: "irodori-starter-01-a01-l03.mp3",
  },
  {
    speakerId: "B",
    japanese: <>こんにちは。</>,
    romaji: "Konnichiwa.",
    translation: "Halo. / Selamat siang.",
    audioFileName: "irodori-starter-01-a01-l04.mp3",
  },
  {
    speakerId: "A",
    japanese: <><ruby>元気<rt>げんき</rt></ruby>ですか。</>,
    romaji: "Genki desu ka.",
    translation: "Apa kabar?",
    audioFileName: "irodori-starter-01-a01-l05.mp3",
  },
  {
    speakerId: "B",
    japanese: <>はい、<ruby>元気<rt>げんき</rt></ruby>です。ありがとうございます。</>,
    romaji: "Hai, genki desu. Arigatou gozaimasu.",
    translation: "Ya, saya baik. Terima kasih.",
    audioFileName: "irodori-starter-01-a01-l06.mp3",
  },
];

const leavingConversation: IrodoriUtterance[] = [
  {
    speakerId: "A",
    japanese: <>お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します。</>,
    romaji: "Osaki ni shitsurei shimasu.",
    translation: "Permisi, saya pamit lebih dahulu.",
    audioFileName: "irodori-starter-01-a02-l01.mp3",
  },
  {
    speakerId: "B",
    japanese: <>お<ruby>疲<rt>つか</rt></ruby>れさまでした。また<ruby>明日<rt>あした</rt></ruby>。</>,
    romaji: "Otsukaresama deshita. Mata ashita.",
    translation: "Terima kasih atas kerja hari ini. Sampai besok.",
    audioFileName: "irodori-starter-01-a02-l02.mp3",
  },
  {
    speakerId: "A",
    japanese: <>お<ruby>疲<rt>つか</rt></ruby>れさまでした。</>,
    romaji: "Otsukaresama deshita.",
    translation: "Terima kasih. Sampai jumpa.",
    audioFileName: "irodori-starter-01-a02-l03.mp3",
  },
];

const thanksConversation: IrodoriUtterance[] = [
  {
    speakerId: "A",
    japanese: <>これ、どうぞ。</>,
    romaji: "Kore, douzo.",
    translation: "Ini, silakan.",
    audioFileName: "irodori-starter-01-a03-l01.mp3",
  },
  {
    speakerId: "B",
    japanese: <>ありがとうございます。</>,
    romaji: "Arigatou gozaimasu.",
    translation: "Terima kasih.",
    audioFileName: "irodori-starter-01-a03-l02.mp3",
  },
  {
    speakerId: "A",
    japanese: <>どういたしまして。</>,
    romaji: "Dou itashimashite.",
    translation: "Sama-sama.",
    audioFileName: "irodori-starter-01-a03-l03.mp3",
  },
];

const apologyConversation: IrodoriUtterance[] = [
  {
    speakerId: "A",
    japanese: <>あっ、すみません。</>,
    romaji: "A, sumimasen.",
    translation: "Ah, maaf.",
    audioFileName: "irodori-starter-01-a03-l04.mp3",
  },
  {
    speakerId: "B",
    japanese: <><ruby>大丈夫<rt>だいじょうぶ</rt></ruby>ですよ。</>,
    romaji: "Daijoubu desu yo.",
    translation: "Tidak apa-apa.",
    audioFileName: "irodori-starter-01-a03-l05.mp3",
  },
];

const stickerQuestions = [
  {
    sticker: "おはよう",
    reading: "Ohayou",
    question: "Apa arti pesan ini?",
    options: ["Selamat pagi", "Terima kasih", "Sampai besok"],
    answer: "Selamat pagi",
    explanation: "おはよう adalah sapaan santai yang digunakan pada pagi hari.",
  },
  {
    sticker: "ありがとう",
    reading: "Arigatou",
    question: "Pesan ini digunakan untuk ...",
    options: ["Meminta maaf", "Mengucapkan terima kasih", "Berpamitan"],
    answer: "Mengucapkan terima kasih",
    explanation: "ありがとう adalah ungkapan terima kasih dalam suasana akrab.",
  },
  {
    sticker: "ごめんね",
    reading: "Gomen ne",
    question: "Apa maksud pesan ini?",
    options: ["Selamat malam", "Maaf ya", "Apa kabar?"],
    answer: "Maaf ya",
    explanation: "ごめんね adalah ungkapan maaf yang akrab dan kasual.",
  },
  {
    sticker: "おつかれさま",
    reading: "Otsukaresama",
    question: "Pesan ini biasanya berkaitan dengan ...",
    options: [
      "Mengapresiasi usaha atau pekerjaan seseorang",
      "Memperkenalkan diri",
      "Mengucapkan selamat pagi",
    ],
    answer: "Mengapresiasi usaha atau pekerjaan seseorang",
    explanation:
      "おつかれさま digunakan untuk mengakui usaha seseorang, misalnya setelah bekerja atau menyelesaikan kegiatan.",
  },
];

const vocabulary = [
  { jp: <>おはようございます</>, romaji: "Ohayou gozaimasu", meaning: "Selamat pagi (sopan)" },
  { jp: <>おはよう</>, romaji: "Ohayou", meaning: "Selamat pagi (akrab)" },
  { jp: <>こんにちは</>, romaji: "Konnichiwa", meaning: "Halo / selamat siang" },
  { jp: <>お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します</>, romaji: "Osaki ni shitsurei shimasu", meaning: "Permisi, saya pamit lebih dahulu" },
  { jp: <>お<ruby>疲<rt>つか</rt></ruby>れさまでした</>, romaji: "Otsukaresama deshita", meaning: "Terima kasih atas usaha hari ini" },
  { jp: <>ありがとうございます</>, romaji: "Arigatou gozaimasu", meaning: "Terima kasih (sopan)" },
  { jp: <>すみません</>, romaji: "Sumimasen", meaning: "Maaf / permisi" },
  { jp: <>ごめんなさい</>, romaji: "Gomennasai", meaning: "Maaf" },
  { jp: <>また<ruby>明日<rt>あした</rt></ruby></>, romaji: "Mata ashita", meaning: "Sampai besok" },
];

const canDos = [
  "Bertukar sapaan saat bertemu seseorang.",
  "Berpamitan ketika akan meninggalkan tempat.",
  "Mengucapkan terima kasih atau meminta maaf.",
  "Memahami pesan singkat seperti selamat pagi dan terima kasih.",
];

export default function IrodoriStarterLessonOnePage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const score = stickerQuestions.filter(
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
          STARTER • A1
        </span>
      </div>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#79602F]/45 bg-gradient-to-br from-[#302319] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-6 -top-10 select-none font-mincho text-[190px] leading-none text-[#D6AD4F]/[0.07]">
          挨
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">
            TOPIC 01 • STARTING TO SPEAK JAPANESE
          </p>
          <p className="mt-5 text-sm font-semibold text-[#B9A98B]">
            Pelajaran 1
          </p>
          <h1 className="mt-1 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">
            Good morning!
          </h1>
          <p className="mt-2 font-mincho text-2xl text-[#D9B66D]">
            おはようございます
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#B6B0A5]">
            Belajar menyapa, berpamitan, berterima kasih, dan meminta maaf
            melalui ungkapan sederhana yang bisa langsung digunakan sehari-hari.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              4 target Can-do
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              Dialog dengan 2 speaker
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
              key={canDo}
              className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#B8860B]/15 text-[10px] font-black text-[#D9B66D]">
                0{index + 1}
              </span>
              <p className="text-xs leading-6 text-[#C7C1B5]">{canDo}</p>
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
              Menyapa saat bertemu
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Pilih sapaan yang sesuai dengan waktu dan situasi. おはようございます
          umum digunakan pada pagi hari dengan sopan, sedangkan こんにちは
          digunakan sebagai sapaan pada siang hari.
        </p>
        <IrodoriConversation
          title="Scene A · Pagi hari"
          speakers={speakers}
          utterances={morningGreetings}
        />
        <IrodoriConversation
          title="Scene B · Bertemu pada siang hari"
          speakers={speakers}
          utterances={daytimeGreetings}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B8860B]/15 text-[#D9B66D]">
            <Compass size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 02
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
          title="Scene · Selesai bekerja"
          speakers={speakers}
          utterances={leavingConversation}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F8A67]/15 text-[#85C49A]">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 03
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Berterima kasih dan meminta maaf
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Gunakan ありがとうございます untuk berterima kasih dengan sopan.
          すみません dapat digunakan untuk meminta maaf. Dengarkan konteks
          percakapannya, bukan hanya menghafal terjemahan.
        </p>
        <IrodoriConversation
          title="Scene A · Menerima bantuan"
          speakers={speakers}
          utterances={thanksConversation}
        />
        <IrodoriConversation
          title="Scene B · Meminta maaf"
          speakers={speakers}
          utterances={apologyConversation}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#80619B]/15 text-[#B99AD8]">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 04
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
          <p className="text-xs text-[#A9A398]">
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
              <div>
                <p className="font-mincho text-base font-bold text-[#EAE6DD]">
                  {item.jp}
                </p>
                <p className="text-[10px] italic text-[#B8860B]">{item.romaji}</p>
              </div>
              <p className="text-xs text-[#A9A398]">{item.meaning}</p>
            </div>
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
              Untuk berpisah sebentar, またね atau また明日 sering lebih sesuai.
              Di tempat kerja, gunakan ungkapan pamit dan balasan yang sesuai.
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
            CAN-DO CHECK
          </p>
        </div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">
          Coba nilai kemampuanmu
        </h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">
          Setelah belajar, coba lakukan empat hal berikut tanpa melihat contoh.
          Penanda ini adalah refleksi mandiri dan belum disimpan sebagai progres akun.
        </p>
        <ul className="mt-4 space-y-2">
          {canDos.map((canDo) => (
            <li key={canDo} className="flex items-start gap-2 text-xs text-[#C7C1B5]">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#D9B66D]" />
              {canDo}
            </li>
          ))}
        </ul>
        <Link
          href="/irodori/starter"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#C93438] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E]"
        >
          Kembali ke daftar pelajaran
          <ChevronRight size={15} />
        </Link>
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Materi dan dialog contoh disusun orisinal oleh Fude sebagai latihan
        komunikasi tingkat pemula.
      </p>
    </main>
  );
}
