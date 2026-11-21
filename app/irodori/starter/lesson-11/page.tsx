"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Heart,
  MessageCircle,
  RefreshCw,
  UserRound,
} from "lucide-react";
import IrodoriConversation, { type IrodoriUtterance } from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import {
  completeIrodoriLesson,
  saveIrodoriSelfEvaluation,
  useIrodoriProgress,
} from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const hobbyConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>ケンジさんの<ruby>趣味<rt>しゅみ</rt></ruby>は、<ruby>何<rt>なん</rt></ruby>ですか？</>,
    romaji: "Kenji-san no shumi wa, nan desu ka?",
    translation: "Kenji, apa hobimu?",
    audioFileName: "irodori-starter-11-a01-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>ええと、<ruby>読書<rt>どくしょ</rt></ruby>です。</>,
    romaji: "Eeto, dokusho desu.",
    translation: "Hmm, membaca buku.",
    audioFileName: "irodori-starter-11-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>そうですか。どんな<ruby>本<rt>ほん</rt></ruby>が<ruby>好<rt>す</rt></ruby>きですか？</>,
    romaji: "Sou desu ka. Donna hon ga suki desu ka?",
    translation: "Begitu ya. Buku seperti apa yang kamu suka?",
    audioFileName: "irodori-starter-11-a01-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>ミステリーが<ruby>好<rt>す</rt></ruby>きです。</>,
    romaji: "Misuteri ga suki desu.",
    translation: "Saya suka cerita misteri.",
    audioFileName: "irodori-starter-11-a01-l04.mp3",
  },
];

const favoriteConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>アキコさんは、マンガが<ruby>好<rt>す</rt></ruby>きですか？</>,
    romaji: "Akiko-san wa, manga ga suki desu ka?",
    translation: "Akiko, apakah kamu suka manga?",
    audioFileName: "irodori-starter-11-a02-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>はい、<ruby>好<rt>す</rt></ruby>きです。マンガが<ruby>大好<rt>だいす</rt></ruby>きです。</>,
    romaji: "Hai, suki desu. Manga ga daisuki desu.",
    translation: "Ya, saya suka. Saya sangat suka manga.",
    audioFileName: "irodori-starter-11-a02-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>どんなマンガが<ruby>好<rt>す</rt></ruby>きですか？</>,
    romaji: "Donna manga ga suki desu ka?",
    translation: "Manga seperti apa yang kamu suka?",
    audioFileName: "irodori-starter-11-a02-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ファンタジーのマンガが<ruby>好<rt>す</rt></ruby>きです。</>,
    romaji: "Fantajii no manga ga suki desu.",
    translation: "Saya suka manga fantasi.",
    audioFileName: "irodori-starter-11-a02-l04.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>スポーツは、<ruby>好<rt>す</rt></ruby>きですか？</>,
    romaji: "Supootsu wa, suki desu ka?",
    translation: "Apakah kamu suka olahraga?",
    audioFileName: "irodori-starter-11-a02-l05.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>スポーツは、あまり<ruby>好<rt>す</rt></ruby>きじゃないです。</>,
    romaji: "Supootsu wa, amari suki janai desu.",
    translation: "Saya tidak terlalu suka olahraga.",
    audioFileName: "irodori-starter-11-a02-l06.mp3",
  },
];

const daysOffConversation: IrodoriUtterance[] = [
  {
    speakerId: "kenji",
    japanese: <>ユイさんは、<ruby>休<rt>やす</rt></ruby>みの<ruby>日<rt>ひ</rt></ruby>は、いつも<ruby>何<rt>なに</rt></ruby>をしますか？</>,
    romaji: "Yui-san wa, yasumi no hi wa, itsumo nani o shimasu ka?",
    translation: "Yui, apa yang biasanya kamu lakukan saat hari libur?",
    audioFileName: "irodori-starter-11-a03-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>たいてい、うちで<ruby>音楽<rt>おんがく</rt></ruby>を<ruby>聞<rt>き</rt></ruby>きます。</>,
    romaji: "Taitei, uchi de ongaku o kikimasu.",
    translation: "Biasanya, saya mendengarkan musik di rumah.",
    audioFileName: "irodori-starter-11-a03-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>ときどき、<ruby>友<rt>とも</rt></ruby>だちと<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>をしますか？</>,
    romaji: "Tokidoki, tomodachi to kaimono o shimasu ka?",
    translation: "Apakah kadang-kadang kamu berbelanja dengan teman?",
    audioFileName: "irodori-starter-11-a03-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>はい。ときどき、<ruby>町<rt>まち</rt></ruby>で<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>をします。</>,
    romaji: "Hai. Tokidoki, machi de kaimono o shimasu.",
    translation: "Ya. Kadang-kadang saya berbelanja di kota.",
    audioFileName: "irodori-starter-11-a03-l04.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>スポーツもしますか？</>,
    romaji: "Supootsu mo shimasu ka?",
    translation: "Apakah kamu juga berolahraga?",
    audioFileName: "irodori-starter-11-a03-l05.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>いいえ、スポーツはあまりしません。</>,
    romaji: "Iie, supootsu wa amari shimasen.",
    translation: "Tidak, saya tidak terlalu sering berolahraga.",
    audioFileName: "irodori-starter-11-a03-l06.mp3",
  },
];

const profileConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>このプロフィールを<ruby>見<rt>み</rt></ruby>てください。</>,
    romaji: "Kono purofiiru o mite kudasai.",
    translation: "Tolong lihat profil ini.",
    audioFileName: "irodori-starter-11-a04-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ハナさんは、<ruby>何<rt>なに</rt></ruby>が<ruby>好<rt>す</rt></ruby>きですか？</>,
    romaji: "Hana-san wa, nani ga suki desu ka?",
    translation: "Apa yang disukai Hana?",
    audioFileName: "irodori-starter-11-a04-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>マンガと<ruby>読書<rt>どくしょ</rt></ruby>が<ruby>好<rt>す</rt></ruby>きです。</>,
    romaji: "Manga to dokusho ga suki desu.",
    translation: "Dia suka manga dan membaca.",
    audioFileName: "irodori-starter-11-a04-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>そうですか。<ruby>休<rt>やす</rt></ruby>みの<ruby>日<rt>ひ</rt></ruby>は、よく<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みますね。</>,
    romaji: "Sou desu ka. Yasumi no hi wa, yoku hon o yomimasu ne.",
    translation: "Begitu ya. Saat hari libur, dia sering membaca buku, ya.",
    audioFileName: "irodori-starter-11-a04-l04.mp3",
  },
];

const canDos = [
  { id: "simple-hobby-answer", text: "Memberikan jawaban sederhana ketika ditanya tentang hobi." },
  { id: "hobbies-and-favorites", text: "Bertanya dan menjawab tentang hobi serta hal-hal yang disukai." },
  { id: "days-off-activities", text: "Bertanya dan menjawab tentang kegiatan yang dilakukan saat hari libur." },
  { id: "read-social-profile", text: "Membaca profil media sosial sederhana dan memahami hal-hal yang disukai pemiliknya." },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

const hobbyVocabulary: { jp: ReactNode; reading: string; meaning: string }[] = [
  { jp: <ruby>趣味<rt>しゅみ</rt></ruby>, reading: "shumi", meaning: "Hobi" },
  { jp: "マンガ", reading: "manga", meaning: "Manga / komik" },
  { jp: <ruby>読書<rt>どくしょ</rt></ruby>, reading: "dokusho", meaning: "Membaca buku" },
  { jp: <ruby>音楽<rt>おんがく</rt></ruby>, reading: "ongaku", meaning: "Musik" },
  { jp: <ruby>映画<rt>えいが</rt></ruby>, reading: "eiga", meaning: "Film" },
  { jp: <ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>, reading: "kaimono", meaning: "Belanja" },
  { jp: <ruby>料理<rt>りょうり</rt></ruby>, reading: "ryouri", meaning: "Memasak" },
  { jp: "ゲーム", reading: "geemu", meaning: "Permainan" },
  { jp: "スポーツ", reading: "supootsu", meaning: "Olahraga" },
  { jp: <ruby>散歩<rt>さんぽ</rt></ruby>, reading: "sanpo", meaning: "Jalan santai" },
  { jp: <ruby>掃除<rt>そうじ</rt></ruby>, reading: "souji", meaning: "Membersihkan" },
  { jp: <ruby>洗濯<rt>せんたく</rt></ruby>, reading: "sentaku", meaning: "Mencuci pakaian" },
  { jp: <ruby>勉強<rt>べんきょう</rt></ruby>, reading: "benkyou", meaning: "Belajar" },
  { jp: <ruby>友<rt>とも</rt></ruby>だち, reading: "tomodachi", meaning: "Teman" },
  { jp: <ruby>休<rt>やす</rt></ruby>みの<ruby>日<rt>ひ</rt></ruby>, reading: "yasumi no hi", meaning: "Hari libur" },
  { jp: <ruby>公園<rt>こうえん</rt></ruby>, reading: "kouen", meaning: "Taman" },
];

const activityWords: { jp: ReactNode; reading: string; meaning: string }[] = [
  { jp: <ruby>読<rt>よ</rt></ruby>みます, reading: "yomimasu", meaning: "Membaca" },
  { jp: <ruby>聞<rt>き</rt></ruby>きます, reading: "kikimasu", meaning: "Mendengarkan" },
  { jp: <ruby>見<rt>み</rt></ruby>ます, reading: "mimasu", meaning: "Menonton / melihat" },
  { jp: <ruby>します</ruby>, reading: "shimasu", meaning: "Melakukan" },
  { jp: <ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>をします, reading: "kaimono o shimasu", meaning: "Berbelanja" },
  { jp: <ruby>料理<rt>りょうり</rt></ruby>をします, reading: "ryouri o shimasu", meaning: "Memasak" },
  { jp: <ruby>散歩<rt>さんぽ</rt></ruby>します, reading: "sanpo shimasu", meaning: "Berjalan-jalan" },
  { jp: <ruby>勉強<rt>べんきょう</rt></ruby>します, reading: "benkyou shimasu", meaning: "Belajar" },
];

const practiceTasks: {
  prompt: ReactNode;
  options: { key: string; label: ReactNode }[];
  answer: string;
  explanation: ReactNode;
}[] = [
  {
    prompt: "Apa hobi Kenji dalam dialog pertama?",
    options: [
      { key: "a", label: "Olahraga" },
      { key: "b", label: "Membaca buku" },
      { key: "c", label: "Memasak" },
    ],
    answer: "b",
    explanation: <>Kenji menjawab 「<ruby>読書<rt>どくしょ</rt></ruby>です」, yaitu membaca buku.</>,
  },
  {
    prompt: "Manga seperti apa yang disukai Akiko?",
    options: [
      { key: "a", label: "Fantasi" },
      { key: "b", label: "Misteri" },
      { key: "c", label: "Komedi" },
    ],
    answer: "a",
    explanation: <>Akiko mengatakan 「ファンタジーのマンガが<ruby>好<rt>す</rt></ruby>きです」.</>,
  },
  {
    prompt: "Apa arti 「あまり好きじゃないです」?",
    options: [
      { key: "a", label: "Sangat suka" },
      { key: "b", label: "Tidak terlalu suka" },
      { key: "c", label: "Tidak tahu" },
    ],
    answer: "b",
    explanation: <>あまり dipakai bersama bentuk negatif untuk menyatakan tingkat kesukaan yang rendah.</>,
  },
  {
    prompt: "Apa yang biasanya Yui lakukan saat hari libur?",
    options: [
      { key: "a", label: "Mendengarkan musik di rumah" },
      { key: "b", label: "Bekerja di kantor" },
      { key: "c", label: "Menonton pertandingan" },
    ],
    answer: "a",
    explanation: <>Yui berkata 「たいてい、うちで<ruby>音楽<rt>おんがく</rt></ruby>を<ruby>聞<rt>き</rt></ruby>きます」.</>,
  },
  {
    prompt: "Apa kegiatan yang kadang-kadang dilakukan Yui bersama temannya?",
    options: [
      { key: "a", label: "Belajar di perpustakaan" },
      { key: "b", label: "Berbelanja di kota" },
      { key: "c", label: "Memasak di rumah" },
    ],
    answer: "b",
    explanation: <>Yui mengatakan 「ときどき、<ruby>町<rt>まち</rt></ruby>で<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>をします」.</>,
  },
  {
    prompt: "Apa hobi Hana yang tertulis pada profil fiktif?",
    options: [
      { key: "a", label: "Manga dan membaca" },
      { key: "b", label: "Memasak dan olahraga" },
      { key: "c", label: "Musik dan belanja" },
    ],
    answer: "a",
    explanation: <>Di profil tertulis 「マンガと<ruby>読書<rt>どくしょ</rt></ruby>が<ruby>好<rt>す</rt></ruby>きです」.</>,
  },
];

const quizQuestions: {
  prompt: ReactNode;
  options: { key: string; label: ReactNode }[];
  answer: string;
  explanation: ReactNode;
}[] = [
  {
    prompt: "Bagaimana menanyakan hobi seseorang?",
    options: [
      { key: "a", label: <><ruby>趣味<rt>しゅみ</rt></ruby>は<ruby>何<rt>なん</rt></ruby>ですか？</> },
      { key: "b", label: <><ruby>趣味<rt>しゅみ</rt></ruby>はどこですか？</> },
      { key: "c", label: <><ruby>趣味<rt>しゅみ</rt></ruby>はいつですか？</> },
    ],
    answer: "a",
    explanation: <>「Nは<ruby>何<rt>なん</rt></ruby>ですか？」 digunakan untuk menanyakan informasi tentang topik N.</>,
  },
  {
    prompt: "Apa arti 「どんなマンガが好きですか？」?",
    options: [
      { key: "a", label: "Apakah kamu membaca manga?" },
      { key: "b", label: "Manga seperti apa yang kamu suka?" },
      { key: "c", label: "Di mana kamu membeli manga?" },
    ],
    answer: "b",
    explanation: <>どんな diletakkan sebelum kata benda untuk menanyakan jenis atau karakteristiknya.</>,
  },
  {
    prompt: "Pilih jawaban yang berarti “Saya sangat suka musik.”",
    options: [
      { key: "a", label: <><ruby>音楽<rt>おんがく</rt></ruby>が<ruby>大好<rt>だいす</rt></ruby>きです。</> },
      { key: "b", label: <><ruby>音楽<rt>おんがく</rt></ruby>はあまり<ruby>好<rt>す</rt></ruby>きじゃないです。</> },
      { key: "c", label: <><ruby>音楽<rt>おんがく</rt></ruby>をぜんぜん<ruby>聞<rt>き</rt></ruby>きません。</> },
    ],
    answer: "a",
    explanation: <>大好きです menyatakan sangat suka.</>,
  },
  {
    prompt: "Ungkapan mana yang berarti “tidak terlalu suka”?",
    options: [
      { key: "a", label: "とても好きです。" },
      { key: "b", label: "あまり好きじゃないです。" },
      { key: "c", label: "大好きです。" },
    ],
    answer: "b",
    explanation: <>あまり diikuti bentuk negatif, misalnya 好きじゃないです.</>,
  },
  {
    prompt: "Kata keterangan frekuensi yang berarti “kadang-kadang” adalah…",
    options: [
      { key: "a", label: "いつも" },
      { key: "b", label: "ときどき" },
      { key: "c", label: "ぜんぜん" },
    ],
    answer: "b",
    explanation: <>ときどき menunjukkan kegiatan yang dilakukan sesekali.</>,
  },
  {
    prompt: "Kata keterangan mana yang biasanya dipakai bersama kata kerja negatif untuk berarti “sama sekali tidak”?",
    options: [
      { key: "a", label: "ぜんぜん" },
      { key: "b", label: "たいてい" },
      { key: "c", label: "よく" },
    ],
    answer: "a",
    explanation: <>ぜんぜん dipakai bersama bentuk negatif, misalnya ぜんぜんしません.</>,
  },
  {
    prompt: "Partikel と pada 「友だちと買い物をします」 menunjukkan…",
    options: [
      { key: "a", label: "Tempat kegiatan" },
      { key: "b", label: "Orang yang melakukan kegiatan bersama" },
      { key: "c", label: "Waktu kegiatan" },
    ],
    answer: "b",
    explanation: <>と setelah nama orang menunjukkan dengan siapa kegiatan dilakukan.</>,
  },
  {
    prompt: "Partikel で pada 「公園で散歩します」 menunjukkan…",
    options: [
      { key: "a", label: "Tempat kegiatan" },
      { key: "b", label: "Orang yang menemani" },
      { key: "c", label: "Hal yang disukai" },
    ],
    answer: "a",
    explanation: <>で setelah kata tempat menunjukkan lokasi suatu kegiatan.</>,
  },
  {
    prompt: "Bentuk negatif yang tepat dari 「テレビを見ます」 adalah…",
    options: [
      { key: "a", label: "テレビを見ません。" },
      { key: "b", label: "テレビを見ないですか。" },
      { key: "c", label: "テレビを見じゃないです。" },
    ],
    answer: "a",
    explanation: <>Bentuk negatif sopan dari kata kerja ～ます adalah ～ません.</>,
  },
  {
    prompt: "Hana sering membaca buku. Kata yang paling sesuai untuk “sering” adalah…",
    options: [
      { key: "a", label: "あまり" },
      { key: "b", label: "よく" },
      { key: "c", label: "ぜんぜん" },
    ],
    answer: "b",
    explanation: <>よく berarti sering dan digunakan dengan kata kerja bentuk positif.</>,
  },
];

export default function IrodoriStarterLessonElevenPage() {
  const progress = useIrodoriProgress();
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [profileChoice, setProfileChoice] = useState("hana");
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const isCompleted = progress.completedLessons.includes("starter-11");
  const practiceScore = practiceTasks.filter((task, index) => practiceAnswers[index] === task.answer).length;
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;
  const score = quizQuestions.filter((question, index) => answers[index] === question.answer).length;
  const profileIsCorrect = profileSubmitted && profileChoice === "hana";
  const canDosRated = canDos.every((item) => ratings[item.id] !== undefined);

  const resetPractice = () => {
    setPracticeAnswers({});
    setPracticeSubmitted(false);
  };
  const resetQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-12">
      <Link
        href="/irodori/starter"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"
      >
        <ArrowLeft size={15} />
        Kembali ke Starter
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#79602F]/45 bg-gradient-to-br from-[#302319] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D6AD4F]/[0.07]">
          趣
        </div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">
            IRODORI • STARTER A1 • LESSON 11
          </p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">
            What kind of manga do you like?
          </h1>
          <p className="mt-2 text-sm font-semibold text-[#D9B66D]">
            どんなマンガが好きですか？
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Bertanya dan menjawab tentang hobi, membicarakan hal yang disukai,
            menceritakan kegiatan saat hari libur, dan memahami profil sederhana.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["4 target Can-do", "4 dialog", "24 audio slots", "16 kosakata", "10 kuis"].map((item) => (
              <span
                key={item}
                className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">TARGET PELAJARAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Ceritakan hal yang kamu sukai</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Menjawab tentang hobi", text: "Mulai dengan menyebut hobi secara singkat. Kamu juga bisa menambahkan satu hal yang disukai." },
            { title: "Bertanya lebih lanjut", text: "Gunakan どんな sebelum kata benda untuk menanyakan jenis buku, musik, film, manga, atau olahraga." },
            { title: "Membahas hari libur", text: "Gunakan kata keterangan frekuensi untuk menjelaskan kegiatan yang biasa atau kadang dilakukan." },
            { title: "Membaca profil", text: "Cari kata kunci tentang minat dan kegiatan. Profil latihan di halaman ini sepenuhnya fiktif." },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <h3 className="text-xs font-bold text-[#E7D2A1]">{item.title}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">DIALOG</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dengarkan dan pahami percakapan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Empat percakapan berikut menggunakan tokoh dan situasi fiktif. Slot audio
            sudah disiapkan untuk rekaman Fude.
          </p>
        </div>
        {[
          { title: "01 · Menanyakan hobi", desc: "Menjawab pertanyaan sederhana dan menyebut jenis buku yang disukai.", data: hobbyConversation, speakers: [IRODORI_SPEAKERS.yui, IRODORI_SPEAKERS.kenji] },
          { title: "02 · Menanyakan hal yang disukai", desc: "Bertanya tentang manga dan menyampaikan tingkat kesukaan.", data: favoriteConversation, speakers: [IRODORI_SPEAKERS.sota, IRODORI_SPEAKERS.akiko] },
          { title: "03 · Kegiatan saat hari libur", desc: "Menceritakan kegiatan yang biasa dan kadang dilakukan.", data: daysOffConversation, speakers: [IRODORI_SPEAKERS.kenji, IRODORI_SPEAKERS.yui] },
          { title: "04 · Membahas profil", desc: "Memahami hobi seseorang dari informasi singkat di profil sosial fiktif.", data: profileConversation, speakers: [IRODORI_SPEAKERS.sota, IRODORI_SPEAKERS.akiko] },
        ].map((item) => (
          <article key={item.title} className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
            <h3 className="text-sm font-bold text-[#E7D2A1]">{item.title}</h3>
            <p className="mt-1 text-xs text-[#8F897F]">{item.desc}</p>
            <div className="mt-3">
              <IrodoriConversation title={item.title} utterances={item.data} speakers={item.speakers} />
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Hobi dan kegiatan sehari-hari</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {hobbyVocabulary.map((word, index) => (
            <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <p className="font-mincho text-lg text-[#F1EBDD]">{word.jp}</p>
              <p className="mt-1 text-[10px] text-[#D9B66D]">{word.reading}</p>
              <p className="mt-1 text-xs text-[#A9A398]">{word.meaning}</p>
            </article>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {activityWords.map((word, index) => (
            <article key={index} className="rounded-xl border border-white/[0.07] bg-[#211E1A] p-3">
              <p className="font-mincho text-base text-[#E7D2A1]">{word.jp}</p>
              <p className="mt-1 text-[10px] text-[#D9B66D]">{word.reading}</p>
              <p className="mt-1 text-xs text-[#A9A398]">{word.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">PROFIL SOSIAL SIMULASI</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali hobi dari profil fiktif</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Baca dua profil latihan. Nama pengguna dan semua keterangannya dibuat
            khusus sebagai contoh, bukan profil orang sungguhan.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
            <div className="flex items-center gap-3 border-b border-white/[0.07] p-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#9B7754]/20 text-[#E7D2A1]">
                <UserRound size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#F1EBDD]">hana_reading</p>
                <p className="text-[10px] text-[#8F897F]">Profil latihan · Hana</p>
              </div>
              <Heart size={16} className="ml-auto text-[#D9B66D]" />
            </div>
            <div className="space-y-2 p-4">
              <p className="text-xs leading-6 text-[#EAE6DD]">
                <ruby>読書<rt>どくしょ</rt></ruby>とマンガが<ruby>好<rt>す</rt></ruby>きです。
              </p>
              <p className="text-xs leading-6 text-[#A9A398]">
                よく<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みます。
                <ruby>休<rt>やす</rt></ruby>みの<ruby>日<rt>ひ</rt></ruby>は、
                ときどき<ruby>友<rt>とも</rt></ruby>だちと<ruby>公園<rt>こうえん</rt></ruby>を
                <ruby>散歩<rt>さんぽ</rt></ruby>します。
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["#読書", "#マンガ", "#散歩"].map((tag) => (
                  <span key={tag} className="rounded-full bg-[#B8860B]/10 px-2.5 py-1 text-[9px] text-[#D9B66D]">{tag}</span>
                ))}
              </div>
            </div>
          </article>
          <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
            <div className="flex items-center gap-3 border-b border-white/[0.07] p-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#567B8A]/20 text-[#B8D4DD]">
                <UserRound size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#F1EBDD]">sora_music</p>
                <p className="text-[10px] text-[#8F897F]">Profil latihan · Sora</p>
              </div>
              <Heart size={16} className="ml-auto text-[#D9B66D]" />
            </div>
            <div className="space-y-2 p-4">
              <p className="text-xs leading-6 text-[#EAE6DD]">
                <ruby>音楽<rt>おんがく</rt></ruby>が<ruby>大好<rt>だいす</rt></ruby>きです。
              </p>
              <p className="text-xs leading-6 text-[#A9A398]">
                いつも<ruby>音楽<rt>おんがく</rt></ruby>を<ruby>聞<rt>き</rt></ruby>きます。
                ときどき<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>ます。
                スポーツは、あまりしません。
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["#音楽", "#映画", "#休日"].map((tag) => (
                  <span key={tag} className="rounded-full bg-[#4B8B9B]/10 px-2.5 py-1 text-[9px] text-[#A8CFDA]">{tag}</span>
                ))}
              </div>
            </div>
          </article>
        </div>
        <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#EAE6DD]">Siapa yang suka membaca dan manga?</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              { key: "hana", label: "Hana (hana_reading)" },
              { key: "sora", label: "Sora (sora_music)" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                disabled={profileSubmitted}
                aria-pressed={profileChoice === item.key}
                onClick={() => setProfileChoice(item.key)}
                className={"rounded-lg border px-3 py-2.5 text-left text-xs " + (
                  profileChoice === item.key
                    ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]"
                    : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] text-[#A9A398]">
              {profileSubmitted
                ? profileIsCorrect ? "Benar. Profil Hana menyebut 読書 dan マンガ." : "Belum tepat. Baca kembali bagian hobi pada kedua profil."
                : "Pilih satu profil, lalu periksa jawaban."}
            </p>
            {profileSubmitted ? (
              <button type="button" onClick={() => { setProfileChoice("hana"); setProfileSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]">
                <RefreshCw size={12} /> Ulangi
              </button>
            ) : (
              <button type="button" onClick={() => setProfileSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-[10px] font-bold text-white">
                Periksa profil
              </button>
            )}
          </div>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Bertanya, menyatakan kesukaan, dan frekuensi</h2>
        </div>
        {[
          {
            title: "01 · Menanyakan informasi tentang hobi",
            pattern: "N は 何ですか？",
            example: <><ruby>趣味<rt>しゅみ</rt></ruby>は、<ruby>何<rt>なん</rt></ruby>ですか？</>,
            note: "何 dibaca なん dalam pola 何ですか. Jika diikuti partikel seperti を atau が, biasanya dibaca なに.",
          },
          {
            title: "02 · Menanyakan jenis atau macam",
            pattern: "どんな N",
            example: <>どんな<ruby>映画<rt>えいが</rt></ruby>が<ruby>好<rt>す</rt></ruby>きですか？</>,
            note: "どんな diletakkan tepat sebelum kata benda untuk menanyakan jenis atau karakteristiknya.",
          },
          {
            title: "03 · Menyatakan tingkat kesukaan",
            pattern: "あまり + bentuk negatif",
            example: <>スポーツは、あまり<ruby>好<rt>す</rt></ruby>きじゃないです。</>,
            note: "あまり biasanya dipakai bersama bentuk negatif. Untuk sangat suka, gunakan とても好き atau 大好き.",
          },
          {
            title: "04 · Menyatakan frekuensi kegiatan",
            pattern: "いつも／たいてい／よく／ときどき + Vます",
            example: <>たいてい、<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みます。</>,
            note: "あまり dan ぜんぜん digunakan bersama bentuk negatif seperti 読みません atau しません.",
          },
          {
            title: "05 · Dengan siapa dan di mana kegiatan dilakukan",
            pattern: "orang と tempat で Vます",
            example: <><ruby>友<rt>とも</rt></ruby>だちと<ruby>公園<rt>こうえん</rt></ruby>で<ruby>散歩<rt>さんぽ</rt></ruby>します。</>,
            note: "と menunjukkan teman melakukan kegiatan bersama. で menunjukkan tempat kegiatan berlangsung.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">{item.title}</p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">{item.pattern}</p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#D9B66D]">{item.example}</p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">{item.note}</p>
          </article>
        ))}
        <div className="rounded-xl border border-white/[0.07] bg-[#211E1A] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">Urutan frekuensi</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["いつも · selalu", "たいてい · biasanya", "よく · sering", "ときどき · kadang-kadang", "あまり · tidak terlalu", "ぜんぜん · sama sekali tidak"].map((item) => (
              <span key={item} className="rounded-lg border border-white/[0.07] bg-black/15 px-3 py-2 text-[10px] text-[#C9C3B8]">{item}</span>
            ))}
          </div>
          <p className="mt-2 text-[10px] leading-5 text-[#8F897F]">
            Dua ungkapan terakhir umumnya dipasangkan dengan bentuk negatif.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pahami dialog dan profil</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Jawab enam pertanyaan berikut berdasarkan percakapan dan profil.
          </p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">PRACTICE {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">{task.prompt}</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {task.options.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      disabled={practiceSubmitted}
                      aria-pressed={selected === option.key}
                      onClick={() => setPracticeAnswers((current) => ({ ...current, [index]: option.key }))}
                      className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (
                        practiceSubmitted && option.key === task.answer
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                          : practiceSubmitted && selected === option.key
                            ? "border-red-400/50 bg-red-400/10 text-red-200"
                            : selected === option.key
                              ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {practiceSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>
                      {isCorrect ? "Benar. " : "Belum tepat. "}
                    </span>
                    {task.explanation}
                  </p>
                )}
              </article>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">
            {practiceSubmitted
              ? "Hasil praktik: " + practiceScore + " dari " + practiceTasks.length + " benar."
              : Object.keys(practiceAnswers).length + " dari " + practiceTasks.length + " pertanyaan dijawab."}
          </p>
          {practiceSubmitted ? (
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1]">
              <RefreshCw size={13} /> Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={Object.keys(practiceAnswers).length !== practiceTasks.length}
              className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">QUESTION {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">{question.prompt}</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {question.options.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      disabled={quizSubmitted}
                      aria-pressed={selected === option.key}
                      onClick={() => setAnswers((current) => ({ ...current, [index]: option.key }))}
                      className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (
                        quizSubmitted && option.key === question.answer
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                          : quizSubmitted && selected === option.key
                            ? "border-red-400/50 bg-red-400/10 text-red-200"
                            : selected === option.key
                              ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>
                      {isCorrect ? "Benar. " : "Belum tepat. "}
                    </span>
                    {question.explanation}
                  </p>
                )}
              </article>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">
            {quizSubmitted
              ? "Nilai latihan: " + score + " dari " + quizQuestions.length + " benar."
              : Object.keys(answers).length + " dari " + quizQuestions.length + " pertanyaan dijawab."}
          </p>
          {quizSubmitted ? (
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1]">
              <RefreshCw size={13} /> Ulangi kuis
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa jawaban
            </button>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[#B8860B]/25 bg-gradient-to-br from-[#2B2118] to-[#191817] p-5 md:p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-[#D9B66D]" />
          <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">CAN-DO CHECK</p>
        </div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">
          Nilai empat kemampuan setelah menyelesaikan latihan. Progres ini tersimpan
          terpisah dari Minna no Nihongo dan JLPT.
        </p>
        <div className="mt-4 space-y-3">
          {canDos.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
              <p className="text-xs font-semibold leading-5 text-[#EAE6DD]">
                <span className="mr-2 text-[#D9B66D]">0{index + 1}</span>{item.text}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ratingOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={ratings[item.id] === option.value}
                    onClick={() => {
                      const nextRatings = { ...ratings, [item.id]: option.value };
                      setRatings(nextRatings);
                      saveIrodoriSelfEvaluation("starter-11", nextRatings);
                    }}
                    className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors " + (
                      ratings[item.id] === option.value
                        ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]"
                        : "border-white/[0.08] bg-[#24221F] text-[#A3A099]"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {isCompleted ? (
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200">
              <CheckCircle2 size={15} /> Pelajaran selesai
            </span>
          ) : (
            <button
              type="button"
              onClick={() => completeIrodoriLesson("starter-11")}
              disabled={!quizSubmitted || !practiceIsCorrect || !profileIsCorrect || !canDosRated}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C93438] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              <CheckCircle2 size={15} /> Tandai pelajaran selesai
            </button>
          )}
          <Link href="/irodori/starter" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]">
            Daftar pelajaran <ArrowLeft size={15} className="rotate-180" />
          </Link>
        </div>
        {(!quizSubmitted || !practiceIsCorrect || !profileIsCorrect || !canDosRated) && (
          <p className="mt-2 text-[10px] leading-5 text-[#817A73]">
            Selesaikan kuis, jawab benar seluruh enam soal praktik, cocokkan profil,
            lalu isi keempat penilaian Can-do.
          </p>
        )}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Dialog, profil, dan latihan disusun orisinal oleh Fude. Semua tokoh,
        nama pengguna, minat, dan situasi merupakan contoh fiktif.
      </p>
    </main>
  );
}
