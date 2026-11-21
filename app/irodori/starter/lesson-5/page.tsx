"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Coffee,
  Heart,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
  Utensils,
} from "lucide-react";
import IrodoriConversation, {
  type IrodoriUtterance,
} from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import {
  completeIrodoriLesson,
  saveIrodoriSelfEvaluation,
  useIrodoriProgress,
} from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const favoriteFoodConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>ユイさん、<ruby>魚<rt>さかな</rt></ruby>は<ruby>好<rt>す</rt></ruby>きですか？</>,
    romaji: "Yui-san, sakana wa suki desu ka?",
    translation: "Yui, apakah kamu suka ikan?",
    audioFileName: "irodori-starter-05-a01-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>はい、<ruby>好<rt>す</rt></ruby>きです。</>,
    romaji: "Hai, suki desu.",
    translation: "Ya, saya suka.",
    audioFileName: "irodori-starter-05-a01-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>じゃあ、<ruby>肉<rt>にく</rt></ruby>は？</>,
    romaji: "Jaa, niku wa?",
    translation: "Kalau daging?",
    audioFileName: "irodori-starter-05-a01-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <><ruby>肉<rt>にく</rt></ruby>も<ruby>好<rt>す</rt></ruby>きです。</>,
    romaji: "Niku mo suki desu.",
    translation: "Saya juga suka daging.",
    audioFileName: "irodori-starter-05-a01-l04.mp3",
  },
  {
    speakerId: "sota",
    japanese: <><ruby>野菜<rt>やさい</rt></ruby>は<ruby>好<rt>す</rt></ruby>きですか？</>,
    romaji: "Yasai wa suki desu ka?",
    translation: "Apakah kamu suka sayuran?",
    audioFileName: "irodori-starter-05-a01-l05.mp3",
  },
  {
    speakerId: "yui",
    japanese: <><ruby>野菜<rt>やさい</rt></ruby>は、あまり<ruby>好<rt>す</rt></ruby>きじゃないです。</>,
    romaji: "Yasai wa, amari suki janai desu.",
    translation: "Saya tidak terlalu suka sayuran.",
    audioFileName: "irodori-starter-05-a01-l06.mp3",
  },
];

const japaneseFoodConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <><ruby>日本<rt>にほん</rt></ruby>の<ruby>食べ物<rt>たべもの</rt></ruby>、<ruby>何<rt>なに</rt></ruby>が<ruby>好<rt>す</rt></ruby>きですか？</>,
    romaji: "Nihon no tabemono, nani ga suki desu ka?",
    translation: "Makanan Jepang apa yang kamu suka?",
    audioFileName: "irodori-starter-05-a02-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>うどんが<ruby>好<rt>す</rt></ruby>きです。</>,
    romaji: "Udon ga suki desu.",
    translation: "Saya suka udon.",
    audioFileName: "irodori-starter-05-a02-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>そばは？</>,
    romaji: "Soba wa?",
    translation: "Kalau soba?",
    audioFileName: "irodori-starter-05-a02-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>そばも<ruby>好<rt>す</rt></ruby>きです。</>,
    romaji: "Soba mo suki desu.",
    translation: "Saya juga suka soba.",
    audioFileName: "irodori-starter-05-a02-l04.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <><ruby>納豆<rt>なっとう</rt></ruby>は、だいじょうぶですか？</>,
    romaji: "Nattou wa, daijoubu desu ka?",
    translation: "Bagaimana dengan natto, kamu bisa memakannya?",
    audioFileName: "irodori-starter-05-a02-l05.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>あ、<ruby>納豆<rt>なっとう</rt></ruby>は、ちょっと……。</>,
    romaji: "A, nattou wa, chotto...",
    translation: "Ah, kalau natto, agak kurang cocok untuk saya…",
    audioFileName: "irodori-starter-05-a02-l06.mp3",
  },
];

const drinkConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>ソウタさん、お<ruby>茶<rt>ちゃ</rt></ruby>、<ruby>飲<rt>の</rt></ruby>みますか？</>,
    romaji: "Souta-san, ocha, nomimasu ka?",
    translation: "Sota, mau minum teh?",
    audioFileName: "irodori-starter-05-a03-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>いえ、けっこうです。</>,
    romaji: "Ie, kekkou desu.",
    translation: "Tidak, terima kasih.",
    audioFileName: "irodori-starter-05-a03-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>じゃあ、<ruby>何<rt>なに</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みますか？</>,
    romaji: "Jaa, nani o nomimasu ka?",
    translation: "Kalau begitu, kamu mau minum apa?",
    audioFileName: "irodori-starter-05-a03-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <><ruby>水<rt>みず</rt></ruby>、お<ruby>願<rt>ねが</rt></ruby>いします。</>,
    romaji: "Mizu, onegaishimasu.",
    translation: "Air putih, tolong.",
    audioFileName: "irodori-starter-05-a03-l04.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>はい、どうぞ。</>,
    romaji: "Hai, douzo.",
    translation: "Silakan.",
    audioFileName: "irodori-starter-05-a03-l05.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>ありがとうございます。</>,
    romaji: "Arigatou gozaimasu.",
    translation: "Terima kasih.",
    audioFileName: "irodori-starter-05-a03-l06.mp3",
  },
];

const breakfastConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>ケンジさん、<ruby>朝ご飯<rt>あさごはん</rt></ruby>、いつも<ruby>何<rt>なに</rt></ruby>を<ruby>食<rt>た</rt></ruby>べますか？</>,
    romaji: "Kenji-san, asagohan, itsumo nani o tabemasu ka?",
    translation: "Kenji, biasanya kamu makan apa untuk sarapan?",
    audioFileName: "irodori-starter-05-a04-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>パンと<ruby>卵<rt>たまご</rt></ruby>を<ruby>食<rt>た</rt></ruby>べます。</>,
    romaji: "Pan to tamago o tabemasu.",
    translation: "Saya makan roti dan telur.",
    audioFileName: "irodori-starter-05-a04-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <><ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>も<ruby>飲<rt>の</rt></ruby>みますか？</>,
    romaji: "Gyuunyuu mo nomimasu ka?",
    translation: "Apakah kamu juga minum susu?",
    audioFileName: "irodori-starter-05-a04-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい。<ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>をよく<ruby>飲<rt>の</rt></ruby>みます。</>,
    romaji: "Hai. Gyuunyuu o yoku nomimasu.",
    translation: "Ya. Saya sering minum susu.",
    audioFileName: "irodori-starter-05-a04-l04.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <><ruby>ご飯<rt>ごはん</rt></ruby>は<ruby>食<rt>た</rt></ruby>べますか？</>,
    romaji: "Gohan wa tabemasu ka?",
    translation: "Apakah kamu makan nasi?",
    audioFileName: "irodori-starter-05-a04-l05.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <><ruby>ご飯<rt>ごはん</rt></ruby>は、あまり<ruby>食<rt>た</rt></ruby>べません。</>,
    romaji: "Gohan wa, amari tabemasen.",
    translation: "Saya tidak terlalu sering makan nasi.",
    audioFileName: "irodori-starter-05-a04-l06.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>そうですか。<ruby>果物<rt>くだもの</rt></ruby>は？</>,
    romaji: "Sou desu ka. Kudamono wa?",
    translation: "Oh, begitu. Kalau buah?",
    audioFileName: "irodori-starter-05-a04-l07.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <><ruby>果物<rt>くだもの</rt></ruby>もよく<ruby>食<rt>た</rt></ruby>べます。</>,
    romaji: "Kudamono mo yoku tabemasu.",
    translation: "Saya juga sering makan buah.",
    audioFileName: "irodori-starter-05-a04-l08.mp3",
  },
];

const canDos = [
  {
    id: "likes",
    text: "Menjawab pertanyaan sederhana tentang makanan yang disukai dan tidak disukai.",
  },
  {
    id: "japanese-food",
    text: "Menanyakan dan menjawab makanan Jepang yang disukai, termasuk menolak dengan halus.",
  },
  {
    id: "drink-offer",
    text: "Merespons tawaran minuman, menerima, menolak dengan sopan, atau memilih minuman.",
  },
  {
    id: "breakfast",
    text: "Menanyakan dan menjawab makanan serta minuman yang biasa dikonsumsi saat sarapan.",
  },
  {
    id: "food-post",
    text: "Memahami dan menulis keterangan singkat untuk unggahan tentang makanan.",
  },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Sudah bisa, masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

const quizQuestions: {
  prompt: ReactNode;
  options: { key: string; label: ReactNode }[];
  answer: string;
  explanation: ReactNode;
}[] = [
  {
    prompt: <>Kalimat 「<ruby>魚<rt>さかな</rt></ruby>が<ruby>好<rt>す</rt></ruby>きです」 memiliki arti…</>,
    options: [
      { key: "a", label: "Saya suka ikan." },
      { key: "b", label: "Saya makan ikan." },
      { key: "c", label: "Saya tidak suka ikan." },
    ],
    answer: "a",
    explanation: <><ruby>好<rt>す</rt></ruby>きです berarti suka. Untuk menyatakan hal yang disukai, gunakan partikel が.</>,
  },
  {
    prompt: "Kalimat mana yang menyatakan “Saya tidak suka daging”?",
    options: [
      { key: "a", label: <><ruby>肉<rt>にく</rt></ruby>が<ruby>好<rt>す</rt></ruby>きです。</> },
      { key: "b", label: <><ruby>肉<rt>にく</rt></ruby>は<ruby>好<rt>す</rt></ruby>きじゃないです。</> },
      { key: "c", label: <><ruby>肉<rt>にく</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みます。</> },
    ],
    answer: "b",
    explanation: <><ruby>肉<rt>にく</rt></ruby>は<ruby>好<rt>す</rt></ruby>きじゃないです menyatakan tidak suka daging.</>,
  },
  {
    prompt: "Saat ingin menyampaikan bahwa kamu kurang menyukai natto dengan halus, ungkapan mana yang cocok?",
    options: [
      { key: "a", label: <><ruby>納豆<rt>なっとう</rt></ruby>は、ちょっと……。</> },
      { key: "b", label: <><ruby>納豆<rt>なっとう</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みます。</> },
      { key: "c", label: <><ruby>納豆<rt>なっとう</rt></ruby>が<ruby>大<rt>おお</rt></ruby>きいです。</> },
    ],
    answer: "a",
    explanation: <>「Nは、ちょっと…」 adalah cara halus untuk menyampaikan bahwa sesuatu kurang cocok atau tidak disukai.</>,
  },
  {
    prompt: "Seseorang menawarkan teh. Bagaimana cara menerima tawaran dengan sopan?",
    options: [
      { key: "a", label: <>いえ、けっこうです。</> },
      { key: "b", label: <>はい、お<ruby>願<rt>ねが</rt></ruby>いします。</> },
      { key: "c", label: <>なんですか？</> },
    ],
    answer: "b",
    explanation: <>はい、<ruby>お願い<rt>おねが</rt></ruby> berarti “Ya, boleh/terima kasih”.</>,
  },
  {
    prompt: "Bagaimana cara menolak tawaran minuman dengan sopan?",
    options: [
      { key: "a", label: <>ありがとうございます。</> },
      { key: "b", label: <>はい、どうぞ。</> },
      { key: "c", label: <>いえ、けっこうです。</> },
    ],
    answer: "c",
    explanation: <>いえ、けっこうです berarti “Tidak, terima kasih” saat menolak tawaran.</>,
  },
  {
    prompt: <>Lengkapi kalimat: 「<ruby>水<rt>みず</rt></ruby>＿＿<ruby>飲<rt>の</rt></ruby>みます。」 Partikel yang tepat adalah…</>,
    options: [
      { key: "a", label: "が" },
      { key: "b", label: "を" },
      { key: "c", label: "に" },
    ],
    answer: "b",
    explanation: <>Partikel を menandai objek dari kata kerja. <ruby>水<rt>みず</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みます berarti minum air.</>,
  },
  {
    prompt: <>「よく<ruby>食<rt>た</rt></ruby>べます」 menunjukkan kebiasaan yang bagaimana?</>,
    options: [
      { key: "a", label: "Sering makan." },
      { key: "b", label: "Tidak pernah makan." },
      { key: "c", label: "Jarang makan." },
    ],
    answer: "a",
    explanation: <>よく berarti sering. Kata ini diletakkan sebelum kata kerja.</>,
  },
  {
    prompt: <>「<ruby>朝ご飯<rt>あさごはん</rt></ruby>は、あまり<ruby>食<rt>た</rt></ruby>べません」 memiliki arti…</>,
    options: [
      { key: "a", label: "Saya selalu sarapan." },
      { key: "b", label: "Saya tidak terlalu sering makan sarapan." },
      { key: "c", label: "Saya suka sarapan." },
    ],
    answer: "b",
    explanation: <>あまり biasanya dipakai bersama bentuk negatif, seperti <ruby>食<rt>た</rt></ruby>べません, untuk menyatakan “tidak terlalu sering”.</>,
  },
  {
    prompt: <>Kanji 「<ruby>水<rt>みず</rt></ruby>」 dibaca dan berarti…</>,
    options: [
      { key: "a", label: "みず — air" },
      { key: "b", label: "たべます — makan" },
      { key: "c", label: "のみます — minum" },
    ],
    answer: "a",
    explanation: <><ruby>水<rt>みず</rt></ruby> dibaca mizu dan berarti air.</>,
  },
  {
    prompt: <>Kamu membaca unggahan: 「パンと<ruby>卵<rt>たまご</rt></ruby>を<ruby>食<rt>た</rt></ruby>べます。<ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みます。」 Apa yang dilakukan penulis?</>,
    options: [
      { key: "a", label: "Makan roti dan telur, lalu minum susu." },
      { key: "b", label: "Makan ikan dan minum teh." },
      { key: "c", label: "Tidak sarapan." },
    ],
    answer: "a",
    explanation: <>パンと<ruby>卵<rt>たまご</rt></ruby>を<ruby>食<rt>た</rt></ruby>べます berarti makan roti dan telur. <ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みます berarti minum susu.</>,
  },
];

const favoriteFoods = [
  { jp: <ruby>魚<rt>さかな</rt></ruby>, reading: "sakana", meaning: "Ikan", icon: "🐟" },
  { jp: <ruby>肉<rt>にく</rt></ruby>, reading: "niku", meaning: "Daging", icon: "🍗" },
  { jp: <ruby>野菜<rt>やさい</rt></ruby>, reading: "yasai", meaning: "Sayuran", icon: "🥬" },
  { jp: <ruby>果物<rt>くだもの</rt></ruby>, reading: "kudamono", meaning: "Buah-buahan", icon: "🍎" },
  { jp: "パン", reading: "pan", meaning: "Roti", icon: "🍞" },
  { jp: <ruby>卵<rt>たまご</rt></ruby>, reading: "tamago", meaning: "Telur", icon: "🥚" },
];

const japaneseFoods = [
  { jp: "うどん", reading: "udon", meaning: "Mi tebal dari tepung terigu", icon: "🍜" },
  { jp: "そば", reading: "soba", meaning: "Mi dari tepung buckwheat", icon: "🥢" },
  { jp: "すし", reading: "sushi", meaning: "Nasi berbumbu dengan aneka topping", icon: "🍣" },
  { jp: <><ruby>天<rt>てん</rt></ruby>ぷら</>, reading: "tenpura", meaning: "Bahan makanan berbalut tepung lalu digoreng", icon: "🍤" },
  { jp: "ラーメン", reading: "raamen", meaning: "Mi kuah khas Jepang", icon: "🍥" },
  { jp: "カレー", reading: "karee", meaning: "Kari ala Jepang", icon: "🍛" },
  { jp: <ruby>納豆<rt>なっとう</rt></ruby>, reading: "nattou", meaning: "Kedelai fermentasi", icon: "🫘" },
  { jp: <ruby>梅干し<rt>うめぼし</rt></ruby>, reading: "umeboshi", meaning: "Acar ume bercita rasa asam", icon: "🍑" },
];

const drinks = [
  { jp: <ruby>水<rt>みず</rt></ruby>, reading: "みず · mizu", meaning: "Air putih", icon: "💧" },
  { jp: <><ruby>お茶<rt>おちゃ</rt></ruby></>, reading: "おちゃ · ocha", meaning: "Teh", icon: "🍵" },
  { jp: "コーヒー", reading: "koohii", meaning: "Kopi", icon: "☕" },
  { jp: <ruby>紅茶<rt>こうちゃ</rt></ruby>, reading: "こうちゃ · koucha", meaning: "Teh hitam", icon: "🫖" },
  { jp: "ジュース", reading: "juusu", meaning: "Jus", icon: "🧃" },
];

const breakfastFoods = [
  { jp: <ruby>ご飯<rt>ごはん</rt></ruby>, reading: "ごはん · gohan", meaning: "Nasi", icon: "🍚" },
  { jp: "パン", reading: "pan", meaning: "Roti", icon: "🍞" },
  { jp: <ruby>卵<rt>たまご</rt></ruby>, reading: "たまご · tamago", meaning: "Telur", icon: "🥚" },
  { jp: "ヨーグルト", reading: "yooguruto", meaning: "Yoghurt", icon: "🥣" },
  { jp: <ruby>果物<rt>くだもの</rt></ruby>, reading: "くだもの · kudamono", meaning: "Buah", icon: "🍎" },
  { jp: "サラダ", reading: "sarada", meaning: "Salad", icon: "🥗" },
  { jp: <>みそ<ruby>汁<rt>しる</rt></ruby></>, reading: "みそしる · misoshiru", meaning: "Sup miso", icon: "🍲" },
  { jp: <ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>, reading: "ぎゅうにゅう · gyuunyuu", meaning: "Susu", icon: "🥛" },
];

export default function IrodoriStarterLessonFivePage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [postCaption, setPostCaption] = useState("");
  const [previewCaption, setPreviewCaption] = useState("");
  const progress = useIrodoriProgress();
  const ratings = progress.selfEvaluations["starter-05"] ?? {};
  const isCompleted = progress.completedLessons.includes("starter-05");

  const answeredCount = Object.keys(answers).length;
  const score = quizQuestions.filter(
    (question, index) => answers[index] === question.answer
  ).length;
  const canDosRated = canDos.every((canDo) => Boolean(ratings[canDo.id]));
  const postSubmitted = previewCaption.trim().length > 0;

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
          食
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">
            TOPIC 03 • MY FAVORITE FOODS
          </p>
          <p className="mt-5 text-sm font-semibold text-[#B9A98B]">
            Pelajaran 5
          </p>
          <h1 className="mt-1 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">
            I like udon.
          </h1>
          <p className="mt-2 font-mincho text-2xl text-[#D9B66D]">
            うどんが<ruby>好き<rt>す</rt></ruby>
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#B6B0A5]">
            Ungkapkan makanan yang kamu sukai, bertanya tentang makanan Jepang,
            merespons tawaran minuman, membicarakan kebiasaan sarapan, dan
            menulis keterangan sederhana tentang makanan.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              5 target Can-do
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              4 dialog orisinal
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              10 soal latihan
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
            <Heart size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 01
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Makanan yang disukai dan tidak disukai
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Gunakan <span className="font-semibold text-[#E7D2A1]"><ruby>好<rt>す</rt></ruby>きです</span>{" "}
          untuk mengatakan suka, dan{" "}
          <span className="font-semibold text-[#E7D2A1]"><ruby>好<rt>す</rt></ruby>きじゃないです</span>{" "}
          untuk mengatakan tidak suka. Saat menanggapi pertanyaan, jawaban
          singkat seperti はい、<ruby>好き<rt>す</rt></ruby> juga terdengar alami.
        </p>
        <IrodoriConversation
          title="Scene A · Obrolan saat makan siang"
          speakers={[IRODORI_SPEAKERS.sota, IRODORI_SPEAKERS.yui]}
          utterances={favoriteFoodConversation}
        />
        <div className="grid gap-2 sm:grid-cols-3">
          {favoriteFoods.map((item) => (
            <article
              key={item.reading}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/20 text-2xl">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="font-mincho text-lg font-bold text-[#F1EBDD]">
                  {item.jp}
                </p>
                <p className="text-[10px] italic text-[#B8860B]">
                  {item.reading}
                </p>
                <p className="text-xs text-[#A9A398]">{item.meaning}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">Pola sederhana</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-lg text-[#F1EBDD]">
                <ruby>魚<rt>さかな</rt></ruby>が<ruby>好<rt>す</rt></ruby>きです。
              </p>
              <p className="mt-1 text-xs text-[#A9A398]">Saya suka ikan.</p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-lg text-[#F1EBDD]">
                <ruby>肉<rt>にく</rt></ruby>は<ruby>好<rt>す</rt></ruby>きじゃないです。
              </p>
              <p className="mt-1 text-xs text-[#A9A398]">Saya tidak suka daging.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D6AD4F]/15 text-[#D9B66D]">
            <Utensils size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 02
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Makanan khas Jepang
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Untuk menanyakan makanan Jepang yang disukai, gunakan
          「<ruby>日本<rt>にほん</rt></ruby>の<ruby>食べ物<rt>たべもの</rt></ruby>、<ruby>何<rt>なに</rt></ruby>が<ruby>好き<rt>す</rt></ruby>か？」. Bila ada makanan yang kurang
          cocok, 「Nは、ちょっと…」 menjadi cara yang lebih halus daripada
          mengatakan tidak suka secara langsung.
        </p>
        <IrodoriConversation
          title="Scene B · Membicarakan makanan Jepang"
          speakers={[IRODORI_SPEAKERS.akiko, IRODORI_SPEAKERS.kenji]}
          utterances={japaneseFoodConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {japaneseFoods.map((item) => (
            <article
              key={item.reading}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <div className="flex h-14 items-center justify-center rounded-lg bg-black/15 text-3xl">
                {item.icon}
              </div>
              <p className="mt-3 font-mincho text-lg font-bold text-[#F1EBDD]">
                {item.jp}
              </p>
              <p className="text-[10px] italic text-[#B8860B]">{item.reading}</p>
              <p className="mt-1 text-xs leading-5 text-[#A9A398]">
                {item.meaning}
              </p>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-4">
          <p className="font-mincho text-lg text-[#F1EBDD]">
            <ruby>日本<rt>にほん</rt></ruby>の<ruby>食べ物<rt>たべもの</rt></ruby>、<ruby>何<rt>なに</rt></ruby>が<ruby>好<rt>す</rt></ruby>きですか？
          </p>
          <p className="mt-1 text-xs text-[#A9A398]">
            Makanan Jepang apa yang kamu suka?
          </p>
          <p className="mt-3 font-mincho text-lg text-[#D9B66D]">
            <ruby>納豆<rt>なっとう</rt></ruby>は、ちょっと……。
          </p>
          <p className="mt-1 text-xs text-[#A9A398]">
            Kalau natto, saya kurang cocok…
          </p>
          <p className="mt-3 text-[10px] leading-5 text-[#817A73]">
            「ちょっと…」 sengaja tidak menyelesaikan kalimat. Pendengar biasanya
            memahami bahwa pembicara sedang menolak atau menyatakan kurang suka.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4B8B9B]/15 text-[#8FCAD4]">
            <Coffee size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 03
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Menanggapi tawaran minuman
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Saat seseorang menawarkan minuman, kamu dapat menerima dengan
          「はい、<ruby>お願い<rt>おねが</rt></ruby>」 atau menolak dengan sopan menggunakan
          「いえ、けっこうです」. Untuk memilih minuman, sebutkan namanya lalu
          tambahkan <ruby>お願い<rt>おねが</rt></ruby>.
        </p>
        <IrodoriConversation
          title="Scene C · Ditawari teh"
          speakers={[IRODORI_SPEAKERS.yui, IRODORI_SPEAKERS.sota]}
          utterances={drinkConversation}
        />
        <div className="grid gap-2 sm:grid-cols-3">
          {drinks.map((item) => (
            <article
              key={item.reading}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/15 text-2xl">
                {item.icon}
              </span>
              <div>
                <p className="font-mincho text-lg font-bold text-[#F1EBDD]">
                  {item.jp}
                </p>
                <p className="text-[10px] text-[#B8860B]">{item.reading}</p>
                <p className="text-xs text-[#A9A398]">{item.meaning}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              MENERIMA
            </p>
            <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">
              はい、<ruby>お願い<rt>おねが</rt></ruby>。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">Ya, boleh. Terima kasih.</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              MENOLAK DENGAN SOPAN
            </p>
            <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">
              いえ、けっこうです。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">Tidak, terima kasih.</p>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p className="font-mincho text-lg text-[#F1EBDD]">
            <ruby>何<rt>なに</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みますか？
          </p>
          <p className="mt-1 text-xs text-[#A9A398]">Mau minum apa?</p>
          <p className="mt-3 font-mincho text-lg text-[#D9B66D]">
            <ruby>水<rt>みず</rt></ruby>、お<ruby>願<rt>ねが</rt></ruby>いします。
          </p>
          <p className="mt-1 text-xs text-[#A9A398]">Air putih, tolong.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7D9C69]/15 text-[#A8C791]">
            <BookOpen size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 04
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Membicarakan kebiasaan sarapan
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Gunakan kata kerja bentuk ます untuk menceritakan kebiasaan makan dan
          minum. Kata <span className="font-semibold text-[#E7D2A1]">いつも</span>{" "}
          berarti selalu, <span className="font-semibold text-[#E7D2A1]">よく</span>{" "}
          berarti sering, dan <span className="font-semibold text-[#E7D2A1]">あまり</span>{" "}
          dipakai bersama kalimat negatif untuk menyatakan tidak terlalu sering.
        </p>
        <IrodoriConversation
          title="Scene D · Obrolan tentang sarapan"
          speakers={[IRODORI_SPEAKERS.akiko, IRODORI_SPEAKERS.kenji]}
          utterances={breakfastConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {breakfastFoods.map((item) => (
            <article
              key={item.reading}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/15 text-2xl">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="font-mincho text-base font-bold text-[#F1EBDD]">
                  {item.jp}
                </p>
                <p className="text-[10px] text-[#B8860B]">{item.reading}</p>
                <p className="text-xs text-[#A9A398]">{item.meaning}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
            <p className="text-xs font-bold text-[#E7D2A1]">いつも</p>
            <p className="mt-1 text-xs text-[#A9A398]">Selalu</p>
            <p className="mt-2 font-mincho text-base text-[#F1EBDD]">
              いつも<ruby>食<rt>た</rt></ruby>べます。
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
            <p className="text-xs font-bold text-[#E7D2A1]">よく</p>
            <p className="mt-1 text-xs text-[#A9A398]">Sering</p>
            <p className="mt-2 font-mincho text-base text-[#F1EBDD]">
              よく<ruby>飲<rt>の</rt></ruby>みます。
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
            <p className="text-xs font-bold text-[#E7D2A1]">あまり ～ ません</p>
            <p className="mt-1 text-xs text-[#A9A398]">Tidak terlalu sering</p>
            <p className="mt-2 font-mincho text-base text-[#F1EBDD]">
              あまり<ruby>食<rt>た</rt></ruby>べません。
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A77FBD]/15 text-[#C7A9DB]">
            <MessageCircle size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 05
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Menulis unggahan tentang makanan
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Sebuah unggahan sederhana dapat berisi nama makanan dan minuman.
          Perhatikan contoh fiktif berikut, lalu buat keterangan pendek dalam
          bahasa Jepang. Kamu tidak perlu mengunggah foto asli atau menuliskan
          informasi pribadi.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
            <div className="flex items-center gap-3 border-b border-white/[0.06] p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B8860B]/15 text-lg">
                🍙
              </span>
              <div>
                <p className="text-xs font-bold text-[#EAE6DD]">haru_kitchen</p>
                <p className="text-[9px] text-[#817A73]">Contoh unggahan fiktif</p>
              </div>
            </div>
            <div className="flex min-h-36 items-center justify-center bg-gradient-to-br from-[#493322] to-[#25201B] text-6xl">
              🍚 🥣 🥬
            </div>
            <div className="p-4">
              <p className="font-mincho text-base leading-8 text-[#F1EBDD]">
                <ruby>今日<rt>きょう</rt></ruby>の<ruby>朝ご飯<rt>あさごはん</rt></ruby> 🌞
                <br />
                <ruby>ご飯<rt>ごはん</rt></ruby>とみそ<ruby>汁<rt>しる</rt></ruby>を<ruby>食<rt>た</rt></ruby>べます。
                <br />
                <ruby>お茶<rt>おちゃ</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みます。
                <br />
                いただきます！
              </p>
              <p className="mt-3 text-[10px] text-[#B8860B]">
                #<ruby>朝<ruby>ご飯<rt>ごはん</rt></ruby><rt>あさごはん</rt></ruby> #<ruby>和食<rt>わしょく</rt></ruby>
              </p>
            </div>
          </article>
          <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
            <div className="flex items-center gap-3 border-b border-white/[0.06] p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B8860B]/15 text-lg">
                🐈
              </span>
              <div>
                <p className="text-xs font-bold text-[#EAE6DD]">mika_days</p>
                <p className="text-[9px] text-[#817A73]">Contoh unggahan fiktif</p>
              </div>
            </div>
            <div className="flex min-h-36 items-center justify-center bg-gradient-to-br from-[#4B4630] to-[#25201B] text-6xl">
              🍞 🥚 🍎
            </div>
            <div className="p-4">
              <p className="font-mincho text-base leading-8 text-[#F1EBDD]">
                <ruby>今日<rt>きょう</rt></ruby>の<ruby>朝ご飯<rt>あさごはん</rt></ruby> ✨
                <br />
                パンと<ruby>卵<rt>たまご</rt></ruby>を<ruby>食<rt>た</rt></ruby>べます。
                <br />
                <ruby>果物<rt>くだもの</rt></ruby>も<ruby>食<rt>た</rt></ruby>べます。
                <br />
                おいしいです！
              </p>
              <p className="mt-3 text-[10px] text-[#B8860B]">
                #<ruby>朝<ruby>ご飯<rt>ごはん</rt></ruby><rt>あさごはん</rt></ruby> #フルーツ
              </p>
            </div>
          </article>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#1B1A18] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-[#D9B66D]" />
            <p className="text-xs font-bold text-[#E7D2A1]">
              Praktik menulis
            </p>
          </div>
          <label
            htmlFor="irodori-breakfast-caption"
            className="mt-3 block text-xs leading-6 text-[#A9A398]"
          >
            Tulis 1–3 kalimat pendek tentang sarapan. Kamu boleh memakai contoh
            fiktif, misalnya makanan yang ingin kamu ceritakan.
          </label>
          <textarea
            id="irodori-breakfast-caption"
            value={postCaption}
            onChange={(event) => {
              setPostCaption(event.target.value);
              setPreviewCaption("");
            }}
            rows={3}
            maxLength={160}
            placeholder="Contoh: ぱんとたまごをたべます。みずをのみます。"
            className="mt-2 w-full resize-y rounded-xl border border-white/[0.09] bg-black/20 px-3 py-3 font-mincho text-base leading-7 text-[#F1EBDD] outline-none placeholder:text-[#746F65] focus:border-[#B8860B]/50"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] text-[#817A73]">
              {postCaption.length}/160 karakter
            </p>
            <button
              type="button"
              onClick={() => setPreviewCaption(postCaption.trim())}
              disabled={!postCaption.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#C93438] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              <Send size={13} />
              Buat pratinjau
            </button>
          </div>
          {postSubmitted && (
            <div className="mt-4 rounded-xl border border-[#B8860B]/20 bg-black/15 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-300" />
                <p className="text-[10px] font-bold text-emerald-200">
                  Pratinjau berhasil dibuat
                </p>
              </div>
              <p className="mt-3 whitespace-pre-wrap font-mincho text-base leading-8 text-[#F1EBDD]">
                {previewCaption}
              </p>
              <p className="mt-2 text-[9px] text-[#817A73]">
                Pratinjau ini hanya tersimpan sementara di halaman latihan.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            CATATAN TATA BAHASA
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Pola penting Pelajaran 5
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              01 · MENYATAKAN SUKA
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              Nが<ruby>好き<rt>す</rt></ruby>
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              うどんが<ruby>好き<rt>す</rt></ruby>。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Gunakan が setelah kata benda untuk menyebut sesuatu yang disukai.
              Bentuk negatifnya adalah Nは<ruby>好き<rt>す</rt></ruby>.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              02 · MENOLAK DENGAN HALUS
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              Nは、ちょっと…
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              わさびは、ちょっと…。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Cara halus untuk menyatakan kurang suka atau kurang cocok tanpa
              mengatakan penolakan secara langsung.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              03 · MENAWARKAN DAN MEMILIH
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              V-ますか？
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              <ruby>お茶<rt>おちゃ</rt></ruby>、<ruby>飲<rt>の</rt></ruby>みますか？
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Untuk menerima, ucapkan はい、<ruby>お願い<rt>おねが</rt></ruby>. Untuk menolak dengan
              sopan, ucapkan いえ、けっこうです.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              04 · OBJEK KATA KERJA
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              NをV-ます
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              パンを<ruby>食<rt>た</rt></ruby>べます。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Partikel を menandai objek dan dibaca “o”. Dalam percakapan,
              partikel ini terkadang dihilangkan pada pertanyaan.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              05 · BENTUK NEGATIF
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              V-ません
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              <ruby>朝<ruby>ご飯<rt>ごはん</rt></ruby><rt>あさごはん</rt></ruby>は<ruby>食<rt>た</rt></ruby>べません。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Ubah akhiran ます menjadi ません untuk membuat bentuk negatif
              yang sopan. <ruby>食<rt>た</rt></ruby> memiliki arti serupa dan sering terdengar
              dalam percakapan.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              06 · FREKUENSI
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              いつも / よく / あまり
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              よく<ruby>食<rt>た</rt></ruby>べます。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              いつも berarti selalu, よく berarti sering. あまり dipakai
              bersama kalimat negatif, misalnya あまり<ruby>食<rt>た</rt></ruby>.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            KATA-KATA KANJI
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Tiga kata kanji dari pelajaran ini
          </h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { jp: <ruby>水<rt>みず</rt></ruby>, reading: "mizu", meaning: "Air" },
            { jp: <ruby>食<rt>た</rt></ruby>べます, reading: "tabemasu", meaning: "Makan" },
            { jp: <ruby>飲<rt>の</rt></ruby>みます, reading: "nomimasu", meaning: "Minum" },
          ].map((item) => (
            <article
              key={item.reading}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <p className="font-mincho text-2xl font-bold text-[#F1EBDD]">
                {item.jp}
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
            Mengenal beberapa hidangan Jepang
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">Udon dan soba</h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Udon dibuat dari mi tepung terigu yang tebal, sedangkan soba
              umumnya dibuat dari tepung buckwheat. Keduanya bisa disajikan
              berkuah hangat atau dingin dengan saus celup.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">Sushi dan sashimi</h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Sushi biasanya memadukan nasi berbumbu dengan bahan lain.
              Sashimi adalah irisan bahan segar yang disajikan tanpa nasi.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">Tempura</h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Sayuran atau bahan laut dibalut adonan tepung lalu digoreng.
              Tempura juga sering dijadikan topping untuk mi atau nasi.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">いただきます</h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Ungkapan yang biasa diucapkan sebelum mulai makan. Ini merupakan
              cara menghargai makanan dan orang-orang yang menyiapkannya.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            LATIHAN SITUASI
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Periksa pemahamanmu
          </h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Pilih jawaban terbaik untuk setiap pertanyaan. Semua nomor harus
            dijawab sebelum hasil dapat diperiksa.
          </p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selectedAnswer = answers[index];
            const isCorrect = selectedAnswer === question.answer;

            return (
              <article
                key={index}
                className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
              >
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
                  QUESTION {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">
                  {question.prompt}
                </h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {question.options.map((option) => {
                    const selected = selectedAnswer === option.key;
                    const correct = option.key === question.answer;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          if (quizSubmitted) return;
                          setAnswers((current) => ({
                            ...current,
                            [index]: option.key,
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
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span
                      className={
                        "mr-1 font-bold " +
                        (isCorrect ? "text-emerald-300" : "text-[#E7A1A1]")
                      }
                    >
                      {isCorrect ? "Benar." : "Belum tepat."}
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
          Nilai kemampuanmu setelah mencoba dialog, kosakata, dan latihan.
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
                        saveIrodoriSelfEvaluation("starter-05", nextRatings);
                      }}
                      className={
                        "rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors " +
                        (selected
                          ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]"
                          : "border-white/[0.08] bg-[#24221F] text-[#A3A099] hover:border-white/20 hover:text-[#EAE6DD]")
                      }
                    >
                      {option.label}
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
              onClick={() => completeIrodoriLesson("starter-05")}
              disabled={!quizSubmitted || !postSubmitted || !canDosRated}
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
        {!quizSubmitted || !postSubmitted || !canDosRated ? (
          <p className="mt-2 text-[10px] leading-5 text-[#817A73]">
            Selesaikan kuis, buat pratinjau tulisan, dan isi kelima penilaian
            Can-do untuk menyelesaikan pelajaran.
          </p>
        ) : null}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Materi dan dialog contoh disusun orisinal oleh Fude sebagai latihan
        komunikasi tingkat pemula.
      </p>
    </main>
  );
}
