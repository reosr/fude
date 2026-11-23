"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  MapPin,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import IrodoriConversation, {
  type IrodoriUtterance,
} from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import JapaneseReading from "@/components/JapaneseReading";
import JapaneseVocabularyReading from "@/components/JapaneseVocabularyReading";
import {
  completeIrodoriLesson,
  saveIrodoriSelfEvaluation,
  useIrodoriProgress,
} from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const menuConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>このメニュー、<ruby>見<rt>み</rt></ruby>てもいいですか？</>,
    romaji: "Kono menyuu, mite mo ii desu ka?",
    translation: "Boleh saya melihat menu ini?",
    audioFileName: "irodori-starter-06-a01-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。どうぞ。</>,
    romaji: "Hai. Douzo.",
    translation: "Ya. Silakan.",
    audioFileName: "irodori-starter-06-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ハンバーガーのセットはありますか？</>,
    romaji: "Hanbaagaa no setto wa arimasu ka?",
    translation: "Apakah ada paket hamburger?",
    audioFileName: "irodori-starter-06-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。ポテトとドリンクがつきます。</>,
    romaji: "Hai. Poteto to dorinku ga tsukimasu.",
    translation: "Ada. Paketnya termasuk kentang dan minuman.",
    audioFileName: "irodori-starter-06-a01-l04.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>デザートもありますか？</>,
    romaji: "Dezaato mo arimasu ka?",
    translation: "Apakah ada hidangan penutup juga?",
    audioFileName: "irodori-starter-06-a01-l05.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。アイスクリームとアップルパイがあります。</>,
    romaji: "Hai. Aisukuriimu to appurupai ga arimasu.",
    translation: "Ada. Tersedia es krim dan pai apel.",
    audioFileName: "irodori-starter-06-a01-l06.mp3",
  },
];

const fastFoodConversation: IrodoriUtterance[] = [
  {
    speakerId: "kenji",
    japanese: <>いらっしゃいませ。ご<ruby>注文<rt>ちゅうもん</rt></ruby>は？</>,
    romaji: "Irasshaimase. Gochuumon wa?",
    translation: "Selamat datang. Mau pesan apa?",
    audioFileName: "irodori-starter-06-a02-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>チーズバーガーのセット、お<ruby>願<rt>ねが</rt></ruby>いします。</>,
    romaji: "Chiizubaagaa no setto, onegaishimasu.",
    translation: "Paket cheeseburger, tolong.",
    audioFileName: "irodori-starter-06-a02-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>ドリンクは<ruby>何<rt>なに</rt></ruby>になさいますか？</>,
    romaji: "Dorinku wa nani ni nasaimasu ka?",
    translation: "Untuk minumannya, pilih apa?",
    audioFileName: "irodori-starter-06-a02-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>オレンジジュースにします。</>,
    romaji: "Orenji juusu ni shimasu.",
    translation: "Saya pilih jus jeruk.",
    audioFileName: "irodori-starter-06-a02-l04.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>こちらでおめしあがりですか？</>,
    romaji: "Kochira de omeshiagari desu ka?",
    translation: "Mau makan di sini?",
    audioFileName: "irodori-starter-06-a02-l05.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>テイクアウトでお<ruby>願<rt>ねが</rt></ruby>いします。</>,
    romaji: "Teikuauto de onegaishimasu.",
    translation: "Dibungkus untuk dibawa pulang, ya.",
    audioFileName: "irodori-starter-06-a02-l06.mp3",
  },
];

const chooseMealConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>ケンジさん、<ruby>何<rt>なに</rt></ruby>にしますか？</>,
    romaji: "Kenji-san, nani ni shimasu ka?",
    translation: "Kenji, mau pilih yang mana?",
    audioFileName: "irodori-starter-06-a03-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>うーん……。カレーにします。</>,
    romaji: "Uun... Karee ni shimasu.",
    translation: "Hmm… Saya pilih kari.",
    audioFileName: "irodori-starter-06-a03-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ユイさんは？</>,
    romaji: "Yui-san wa?",
    translation: "Kalau Yui?",
    audioFileName: "irodori-starter-06-a03-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <><ruby>私<rt>わたし</rt></ruby>は、うどんにします。</>,
    romaji: "Watashi wa, udon ni shimasu.",
    translation: "Saya pilih udon.",
    audioFileName: "irodori-starter-06-a03-l04.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>じゃあ、<ruby>私<rt>わたし</rt></ruby>はそばにします。</>,
    romaji: "Jaa, watashi wa soba ni shimasu.",
    translation: "Kalau begitu, saya pilih soba.",
    audioFileName: "irodori-starter-06-a03-l05.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>いいですね。</>,
    romaji: "Ii desu ne.",
    translation: "Kedengarannya bagus.",
    audioFileName: "irodori-starter-06-a03-l06.mp3",
  },
];

const quantityConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>すみません。</>,
    romaji: "Sumimasen.",
    translation: "Permisi.",
    audioFileName: "irodori-starter-06-a04-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい。</>,
    romaji: "Hai.",
    translation: "Ya, ada yang bisa dibantu?",
    audioFileName: "irodori-starter-06-a04-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <><ruby>唐揚<rt>からあ</rt></ruby>げ、ふたつください。</>,
    romaji: "Karaage, futatsu kudasai.",
    translation: "Karaage dua porsi, tolong.",
    audioFileName: "irodori-starter-06-a04-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい。</>,
    romaji: "Hai.",
    translation: "Baik.",
    audioFileName: "irodori-starter-06-a04-l04.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>あと、<ruby>取<rt>と</rt></ruby>り<ruby>皿<rt>ざら</rt></ruby>、ありますか？</>,
    romaji: "Ato, torizara, arimasu ka?",
    translation: "Lalu, apakah ada piring kecil?",
    audioFileName: "irodori-starter-06-a04-l05.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい、お<ruby>持<rt>も</rt></ruby>ちします。</>,
    romaji: "Hai, omochi shimasu.",
    translation: "Baik, akan saya bawakan.",
    audioFileName: "irodori-starter-06-a04-l06.mp3",
  },
];

const canDos = [
  {
    id: "menu",
    text: "Membaca menu restoran cepat saji dan mengenali makanan, minuman, serta paket yang tersedia.",
  },
  {
    id: "fast-food-order",
    text: "Memesan makanan atau paket sederhana dan menjawab apakah makan di tempat atau dibawa pulang.",
  },
  {
    id: "choose-meal",
    text: "Menanyakan dan menjawab pilihan makanan ketika makan bersama orang lain.",
  },
  {
    id: "quantities-request",
    text: "Memesan beberapa porsi dan meminta barang tambahan seperti piring kecil atau sendok.",
  },
  {
    id: "restaurant-signs",
    text: "Mengenali jenis restoran dari tulisan atau papan nama di bagian depan.",
  },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Sudah bisa, masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

const menuBurgers = [
  { jp: "ハンバーガー", reading: "hanbaagaa", meaning: "Hamburger", single: "¥210", set: "¥510", icon: "🍔" },
  { jp: "チーズバーガー", reading: "chiizubaagaa", meaning: "Cheeseburger", single: "¥260", set: "¥560", icon: "🧀" },
  { jp: "てりやきバーガー", reading: "teriyaki baagaa", meaning: "Burger teriyaki", single: "¥350", set: "¥650", icon: "🥬" },
  { jp: "フィッシュバーガー", reading: "fisshu baagaa", meaning: "Burger ikan", single: "¥310", set: "¥610", icon: "🐟" },
  { jp: "チキンバーガー", reading: "chikin baagaa", meaning: "Burger ayam", single: "¥310", set: "¥610", icon: "🍗" },
];

const sideMenu = [
  { jp: "フライドポテト", reading: "furaido poteto", meaning: "Kentang goreng", price: "S ¥180 · M ¥230 · L ¥260", icon: "🍟" },
  { jp: "サラダ", reading: "sarada", meaning: "Salad", price: "¥240", icon: "🥗" },
  { jp: "アップルパイ", reading: "appurupai", meaning: "Pai apel", price: "¥270", icon: "🥧" },
  { jp: "アイスクリーム", reading: "aisukuriimu", meaning: "Es krim", price: "¥260", icon: "🍦" },
];

const drinkMenu = [
  { jp: "オレンジジュース", reading: "orenji juusu", meaning: "Jus jeruk", price: "S ¥180 · M ¥230 · L ¥260", icon: "🧃" },
  { jp: "ウーロン茶", reading: "uuroncha", meaning: "Teh oolong", price: "S ¥180 · M ¥230 · L ¥260", icon: "🍵" },
  { jp: "ホットコーヒー", reading: "hotto koohii", meaning: "Kopi panas", price: "S ¥180 · M ¥230 · L ¥260", icon: "☕" },
  { jp: "アイスコーヒー", reading: "aisu koohii", meaning: "Kopi dingin", price: "S ¥180 · M ¥230 · L ¥260", icon: "🧋" },
  { jp: "水", reading: "みず · mizu", meaning: "Air putih", price: "無料 · gratis", icon: "💧" },
];

const mealChoices = [
  { jp: "カレー", reading: "karee", meaning: "Kari Jepang", icon: "🍛" },
  { jp: "うどん", reading: "udon", meaning: "Mi udon", icon: "🍜" },
  { jp: "そば", reading: "soba", meaning: "Mi soba", icon: "🥢" },
  { jp: "すし", reading: "sushi", meaning: "Sushi", icon: "🍣" },
];

const restaurantSigns = [
  { sign: "すし", reading: "sushi", meaning: "Restoran sushi", clue: "Ikan dan nasi", icon: "🍣" },
  { sign: "ラーメン", reading: "raamen", meaning: "Restoran ramen", clue: "Mi berkuah", icon: "🍜" },
  { sign: "カレー", reading: "karee", meaning: "Restoran kari", clue: "Nasi dengan saus kari", icon: "🍛" },
  { sign: "そば・うどん", reading: "soba · udon", meaning: "Restoran soba dan udon", clue: "Pilihan mi Jepang", icon: "🥢" },
  { sign: "焼肉", reading: "やきにく · yakiniku", meaning: "Restoran yakiniku", clue: "Daging panggang", icon: "🥩" },
  { sign: "パン", reading: "pan", meaning: "Toko roti", clue: "Roti dan pastry", icon: "🥐" },
];

const quizQuestions: {
  prompt: ReactNode;
  options: { key: string; label: ReactNode }[];
  answer: string;
  explanation: ReactNode;
}[] = [
  {
    prompt: "Kamu membaca menu dan ingin membeli cheeseburger. Tulisan mana yang harus dicari?",
    options: [
      { key: "a", label: "チーズバーガー" },
      { key: "b", label: "フライドポテト" },
      { key: "c", label: "アップルパイ" },
    ],
    answer: "a",
    explanation: <>チーズバーガー berarti cheeseburger. フライドポテト adalah kentang goreng dan アップルパイ adalah pai apel.</>,
  },
  {
    prompt: "Kalimat mana yang paling tepat untuk memesan minuman dengan sopan?",
    options: [
      { key: "a", label: <>コーヒー、<ruby>好<rt>す</rt></ruby>きです。</> },
      { key: "b", label: <>コーヒー、お<ruby>願<rt>ねが</rt></ruby>いします。</> },
      { key: "c", label: <>コーヒー、どこですか？</> },
    ],
    answer: "b",
    explanation: <>Sebut nama pesanan, lalu tambahkan お願いします untuk meminta dengan sopan.</>,
  },
  {
    prompt: <>Apa arti 「テイクアウトでお<ruby>願<rt>ねが</rt></ruby>いします」?</>,
    options: [
      { key: "a", label: "Saya makan di sini." },
      { key: "b", label: "Saya ingin membatalkan pesanan." },
      { key: "c", label: "Tolong dibungkus untuk dibawa pulang." },
    ],
    answer: "c",
    explanation: <>テイクアウト berarti dibawa pulang. Untuk makan di tempat, kamu dapat mengatakan ここで.</>,
  },
  {
    prompt: <>Staf bertanya 「ドリンクは<ruby>何<rt>なに</rt></ruby>にしますか？」. Apa yang sedang ditanyakan?</>,
    options: [
      { key: "a", label: "Minuman apa yang kamu pilih?" },
      { key: "b", label: "Berapa harga minumannya?" },
      { key: "c", label: "Di mana tempat duduknya?" },
    ],
    answer: "a",
    explanation: <>「<ruby>何<rt>なに</rt></ruby>にしますか」 digunakan untuk menanyakan pilihan seseorang.</>,
  },
  {
    prompt: <>Lengkapi jawaban: 「<ruby>私<rt>わたし</rt></ruby>は、カレー＿＿します。」</>,
    options: [
      { key: "a", label: "を" },
      { key: "b", label: "に" },
      { key: "c", label: "で" },
    ],
    answer: "b",
    explanation: <>Pola Nにします menyatakan pilihan atau keputusan. カレーにします berarti memilih kari.</>,
  },
  {
    prompt: "Bagaimana mengatakan “dua porsi karaage, tolong”?",
    options: [
      { key: "a", label: <><ruby>唐揚<rt>からあ</rt></ruby>げ、ふたつください。</> },
      { key: "b", label: <>ふたつ、<ruby>唐揚<rt>からあ</rt></ruby>げください。</> },
      { key: "c", label: <><ruby>唐揚<rt>からあ</rt></ruby>げ、にこください。</> },
    ],
    answer: "a",
    explanation: <>Untuk menghitung benda atau porsi secara umum, gunakan ひとつ、ふたつ… dan sebutkan jumlah setelah nama benda.</>,
  },
  {
    prompt: "「みっつ」 berarti berapa?",
    options: [
      { key: "a", label: "Satu" },
      { key: "b", label: "Dua" },
      { key: "c", label: "Tiga" },
    ],
    answer: "c",
    explanation: <>みっつ adalah hitungan benda umum untuk tiga. Contohnya、りんごみっつ.</>,
  },
  {
    prompt: "Kamu ingin meminta piring kecil. Kalimat mana yang tepat?",
    options: [
      { key: "a", label: <><ruby>取<rt>と</rt></ruby>り<ruby>皿<rt>ざら</rt></ruby>、ありますか？</> },
      { key: "b", label: <><ruby>取<rt>と</rt></ruby>り<ruby>皿<rt>ざら</rt></ruby>、<ruby>食<rt>た</rt></ruby>べますか？</> },
      { key: "c", label: <><ruby>取<rt>と</rt></ruby>り<ruby>皿<rt>ざら</rt></ruby>、<ruby>好<rt>す</rt></ruby>きですか？</> },
    ],
    answer: "a",
    explanation: <>Nはありますか digunakan untuk bertanya apakah suatu barang tersedia. Partikel は kadang dihilangkan dalam percakapan.</>,
  },
  {
    prompt: "Jika kamu melihat papan nama 「そば・うどん」, tempat apakah itu?",
    options: [
      { key: "a", label: "Toko roti" },
      { key: "b", label: "Restoran soba dan udon" },
      { key: "c", label: "Restoran sushi" },
    ],
    answer: "b",
    explanation: <>そば dan うどん adalah jenis mi Jepang. Papan itu menunjukkan restoran yang menyediakan keduanya.</>,
  },
  {
    prompt: <>Pada papan nama restoran tertulis 「<ruby>焼肉<rt>やきにく</rt></ruby>」. Makanan apa yang menjadi ciri tempat tersebut?</>,
    options: [
      { key: "a", label: "Daging panggang" },
      { key: "b", label: "Pai apel" },
      { key: "c", label: "Es krim" },
    ],
    answer: "a",
    explanation: <><ruby>焼肉<rt>やきにく</rt></ruby> berarti daging panggang.</>,
  },
];

export default function IrodoriStarterLessonSixPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedMain, setSelectedMain] = useState("チーズバーガー");
  const [selectedDrink, setSelectedDrink] = useState("オレンジジュース");
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedStyle, setSelectedStyle] = useState("ここで");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const progress = useIrodoriProgress();
  const ratings = progress.selfEvaluations["starter-06"] ?? {};
  const isCompleted = progress.completedLessons.includes("starter-06");

  const answeredCount = Object.keys(answers).length;
  const score = quizQuestions.filter(
    (question, index) => answers[index] === question.answer
  ).length;
  const canDosRated = canDos.every((canDo) => Boolean(ratings[canDo.id]));

  const resetQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
  };

  const resetOrder = () => {
    setSelectedMain("チーズバーガー");
    setSelectedDrink("オレンジジュース");
    setSelectedSize("M");
    setSelectedStyle("ここで");
    setOrderConfirmed(false);
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
          店
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">
            TOPIC 03 • EATING OUT
          </p>
          <p className="mt-5 text-sm font-semibold text-[#B9A98B]">
            Pelajaran 6
          </p>
          <h1 className="mt-1 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya pesan cheeseburger.</h1>
          <p className="mt-2 font-mincho text-2xl text-[#D9B66D]">
            チーズバーガー、ください
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#B6B0A5]">
            Belajar membaca menu, memesan makanan, memilih hidangan bersama
            teman, menyebut jumlah pesanan, meminta perlengkapan tambahan,
            serta mengenali jenis restoran dari papan namanya.
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
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D6AD4F]/15 text-[#D9B66D]">
            <ClipboardList size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 01
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Membaca menu restoran cepat saji
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Lihat kategori menu dan perhatikan perbedaan harga satuan serta harga
          paket. Menu latihan ini fiktif, jadi harga hanya digunakan untuk
          latihan membaca informasi.
        </p>
        <IrodoriConversation
          title="Scene A · Melihat menu bersama teman"
          speakers={[IRODORI_SPEAKERS.yui, IRODORI_SPEAKERS.sota]}
          utterances={menuConversation}
        />

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] bg-[#2B2118] p-4">
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
                FUDE BURGER
              </p>
              <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">
                メニュー · Menu
              </h3>
            </div>
            <span className="rounded-lg border border-[#D6AD4F]/20 bg-black/20 px-3 py-2 text-[10px] font-bold text-[#D9B66D]">
              ¥ Yen
            </span>
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="mb-3 text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
                BURGER
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {menuBurgers.map((item) => (
                  <article
                    key=<JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading>
                    className="rounded-xl border border-white/[0.07] bg-black/15 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#302D29] text-2xl">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <JapaneseVocabularyReading reading={item.reading} meaning={item.meaning}
                          contentClassName="font-mincho text-sm font-bold leading-relaxed text-[#F1EBDD]"
                          kanaClassName="mt-2 font-mincho text-base text-[#D6AD4F]"
                          romajiClassName="mt-1 text-[10px] text-[#B8860B]"
                          translationClassName="mt-2 text-[10px] leading-5 text-[#A9A398]"
                        >
                          {item.jp}
                        </JapaneseVocabularyReading>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between gap-2 border-t border-white/[0.06] pt-2 text-[10px]">
                      <span className="text-[#A9A398]">Satuan</span>
                      <span className="font-bold text-[#E7D2A1]">{item.single}</span>
                    </div>
                    <div className="mt-1 flex justify-between gap-2 text-[10px]">
                      <span className="text-[#A9A398]">Set</span>
                      <span className="font-bold text-[#D9B66D]">{item.set}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="mb-3 text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
                  SIDE & DESSERT
                </p>
                <div className="space-y-2">
                  {sideMenu.map((item) => (
                    <div
                      key=<JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading>
                      className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/15 p-3"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div className="min-w-0 flex-1">
                        <JapaneseVocabularyReading reading={item.reading} meaning={item.meaning}
                          contentClassName="font-mincho text-sm font-bold leading-relaxed text-[#F1EBDD]"
                          kanaClassName="mt-2 font-mincho text-base text-[#D6AD4F]"
                          romajiClassName="mt-1 text-[9px] text-[#B8860B]"
                          translationClassName="mt-2 text-[10px] leading-5 text-[#A9A398]"
                        >
                          {item.jp === "ウーロン茶" ? <>ウーロン<ruby>茶<rt>ちゃ</rt></ruby></> : item.jp === "水" ? <ruby>水<rt>みず</rt></ruby> : item.jp}
                        </JapaneseVocabularyReading>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold text-[#E7D2A1]">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
                  DRINK
                </p>
                <div className="space-y-2">
                  {drinkMenu.map((item) => (
                    <div
                      key=<JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading>
                      className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/15 p-3"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="min-w-0 flex-1">
                        <JapaneseVocabularyReading reading={item.reading} meaning={item.meaning}
                  contentClassName="font-mincho text-sm font-bold text-[#F1EBDD]"
                  kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]"
                  romajiClassName="mt-1 text-[9px] text-[#B8860B]"
                  translationClassName="mt-2 text-[10px] text-[#A9A398]"
                >
                  {item.jp}
                </JapaneseVocabularyReading>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold text-[#E7D2A1]">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/[0.07] bg-black/15 px-4 py-3">
            <p className="text-[10px] leading-5 text-[#817A73]">
              Catatan: set biasanya berisi burger, kentang, dan satu minuman.
              Periksa keterangan menu untuk mengetahui isi paketnya.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">
            Cara membaca harga
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-base text-[#F1EBDD]">
                <ruby>単品<rt>たんぴん</rt></ruby>
              </p>
              <p className="mt-1 text-xs text-[#A9A398]">
                Satuan: membeli satu item tanpa paket.
              </p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-base text-[#F1EBDD]">
                セット
              </p>
              <p className="mt-1 text-xs text-[#A9A398]">
                Paket: beberapa item yang dijual bersama.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C93438]/15 text-[#E46A6D]">
            <ShoppingBag size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 02
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Memesan di restoran cepat saji
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Untuk memesan, sebutkan nama makanan lalu tambahkan ください atau
          お<ruby>願<rt>ねが</rt></ruby>いします. Ungkapan お<ruby>願<rt>ねが</rt></ruby>いします terdengar lebih sopan. Staf juga
          mungkin bertanya apakah kamu makan di tempat atau membawa pulang.
        </p>
        <IrodoriConversation
          title="Scene B · Memesan cheeseburger"
          speakers={[IRODORI_SPEAKERS.kenji, IRODORI_SPEAKERS.yui]}
          utterances={fastFoodConversation}
        />

        <div className="rounded-2xl border border-white/[0.08] bg-[#1B1A18] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={15} className="text-[#D9B66D]" />
            <p className="text-xs font-bold text-[#E7D2A1]">
              Praktik interaktif · Susun pesananmu
            </p>
          </div>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">
            Pilih burger, minuman, ukuran, dan cara menerima pesanan. Setelah
            itu, tekan tombol untuk melihat bagaimana pesananmu diucapkan.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold text-[#B9A98B]">
                Burger
              </span>
              <select
                value={selectedMain}
                onChange={(event) => {
                  setSelectedMain(event.target.value);
                  setOrderConfirmed(false);
                }}
                className="w-full rounded-xl border border-white/[0.1] bg-[#24221F] px-3 py-3 text-sm text-[#F1EBDD] outline-none focus:border-[#B8860B]/50"
              >
                {menuBurgers.map((item) => (
                  <option key=<JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading> value=<JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading>>
                    {item.jp === "水" ? "水（みず）" : item.jp}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold text-[#B9A98B]">
                Minuman
              </span>
              <select
                value={selectedDrink}
                onChange={(event) => {
                  setSelectedDrink(event.target.value);
                  setOrderConfirmed(false);
                }}
                className="w-full rounded-xl border border-white/[0.1] bg-[#24221F] px-3 py-3 text-sm text-[#F1EBDD] outline-none focus:border-[#B8860B]/50"
              >
                {drinkMenu.map((item) => (
                  <option key=<JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading> value=<JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading>>
                    <JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading>
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold text-[#B9A98B]">
                Ukuran minuman
              </span>
              <select
                value={selectedSize}
                onChange={(event) => {
                  setSelectedSize(event.target.value);
                  setOrderConfirmed(false);
                }}
                className="w-full rounded-xl border border-white/[0.1] bg-[#24221F] px-3 py-3 text-sm text-[#F1EBDD] outline-none focus:border-[#B8860B]/50"
              >
                <option value="S">S · Kecil</option>
                <option value="M">M · Sedang</option>
                <option value="L">L · Besar</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold text-[#B9A98B]">
                Makan di tempat atau dibawa pulang?
              </span>
              <select
                value={selectedStyle}
                onChange={(event) => {
                  setSelectedStyle(event.target.value);
                  setOrderConfirmed(false);
                }}
                className="w-full rounded-xl border border-white/[0.1] bg-[#24221F] px-3 py-3 text-sm text-[#F1EBDD] outline-none focus:border-[#B8860B]/50"
              >
                <option value="ここで">ここで · Makan di tempat</option>
                <option value="テイクアウト">テイクアウト · Dibawa pulang</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOrderConfirmed(true)}
              className="rounded-lg bg-[#C93438] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E]"
            >
              Tampilkan pesanan
            </button>
            <button
              type="button"
              onClick={resetOrder}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-4 py-2.5 text-xs font-bold text-[#C7C1B5] hover:border-[#B8860B]/40"
            >
              <RefreshCw size={13} />
              Atur ulang
            </button>
          </div>
          {orderConfirmed && (
            <div className="mt-4 rounded-xl border border-[#B8860B]/20 bg-black/15 p-4">
              <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
                PESANANMU
              </p>
              <p className="mt-2 font-mincho text-lg leading-8 text-[#F1EBDD]">
                {selectedMain}のセット、お<ruby>願<rt>ねが</rt></ruby>いします。
                <br />
                {selectedDrink}、{selectedSize}サイズ、お<ruby>願<rt>ねが</rt></ruby>いします。
                <br />
                {selectedStyle === "ここで" ? <>ここで<ruby>食<rt>た</rt></ruby>べます。</> : <>テイクアウトでお<ruby>願<rt>ねが</rt></ruby>いします。</>}
              </p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">
                Ini adalah contoh susunan pesanan. Coba ucapkan dengan suara
                sendiri untuk berlatih.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7D9C69]/15 text-[#A8C791]">
            <Utensils size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 03
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Memilih makanan bersama teman
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Gunakan pola Nにします untuk mengatakan pilihan yang sudah kamu
          tentukan. Pertanyaan 「<ruby>何<rt>なに</rt></ruby>にしますか？」 berarti “Mau pilih yang mana?”. 
        </p>
        <IrodoriConversation
          title="Scene C · Memilih makan siang"
          speakers={[IRODORI_SPEAKERS.akiko, IRODORI_SPEAKERS.kenji, IRODORI_SPEAKERS.yui]}
          utterances={chooseMealConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {mealChoices.map((item) => (
            <article
              key=<JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading>
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <div className="flex h-16 items-center justify-center rounded-lg bg-black/15 text-3xl">
                {item.icon}
              </div>
              <JapaneseVocabularyReading reading={item.reading} meaning={item.meaning}
                  contentClassName="mt-3 font-mincho text-lg font-bold text-[#F1EBDD]"
                  kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]"
                  romajiClassName="mt-1 text-[10px] italic text-[#B8860B]"
                  translationClassName="mt-2 mt-1 text-xs text-[#A9A398]"
                >
                  {item.jp}
                </JapaneseVocabularyReading>
              <p className="mt-3 rounded-lg bg-black/15 px-2 py-2 font-mincho text-sm text-[#D9B66D]">
                <JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading>にします。
              </p>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">Pola pilihan</p>
          <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">
            <ruby>何<rt>なに</rt></ruby>にしますか？
          </p>
          <p className="mt-1 text-xs text-[#A9A398]">Mau pilih yang mana?</p>
          <p className="mt-3 font-mincho text-xl text-[#D9B66D]">
            <ruby>私<rt>わたし</rt></ruby>は、カレーにします。
          </p>
          <p className="mt-1 text-xs text-[#A9A398]">Saya pilih kari.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4B8B9B]/15 text-[#8FCAD4]">
            <PackageCheck size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 04
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Menyebut jumlah dan meminta barang tambahan
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Saat memesan beberapa porsi, letakkan jumlah setelah nama makanan.
          Untuk benda yang dihitung secara umum, pelajari hitungan ひとつ、
          ふたつ, dan seterusnya. Kamu juga bisa bertanya apakah barang yang
          dibutuhkan tersedia dengan pola Nはありますか？
        </p>
        <IrodoriConversation
          title="Scene D · Memesan tambahan"
          speakers={[IRODORI_SPEAKERS.yui, IRODORI_SPEAKERS.kenji]}
          utterances={quantityConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { num: "1つ", reading: "ひとつ · hitotsu", meaning: "Satu" },
            { num: "2つ", reading: "ふたつ · futatsu", meaning: "Dua" },
            { num: "3つ", reading: "みっつ · mittsu", meaning: "Tiga" },
            { num: "4つ", reading: "よっつ · yottsu", meaning: "Empat" },
            { num: "5つ", reading: "いつつ · itsutsu", meaning: "Lima" },
            { num: "6つ", reading: "むっつ · muttsu", meaning: "Enam" },
            { num: "7つ", reading: "ななつ · nanatsu", meaning: "Tujuh" },
            { num: "8つ", reading: "やっつ · yattsu", meaning: "Delapan" },
            { num: "9つ", reading: "ここのつ · kokonotsu", meaning: "Sembilan" },
            { num: "いくつ", reading: "ikutsu", meaning: "Berapa?" },
          ].map((item) => (
            <article
              key={item.num}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <div>
                <JapaneseVocabularyReading
                  reading={item.reading}
                  meaning={item.meaning}
                  contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]"
                  kanaClassName="mt-1 font-mincho text-base text-[#D6AD4F]"
                  romajiClassName="mt-1 text-[10px] italic text-[#B8860B]"
                  translationClassName="mt-1 text-xs text-[#A9A398]"
                >
                  {item.num}
                </JapaneseVocabularyReading>
            </article>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              MEMESAN JUMLAH
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              <ruby>唐揚<rt>からあ</rt></ruby>げ、ふたつください。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">
              Dua porsi karaage, tolong.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              MEMINTA BARANG
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              <ruby>取<rt>と</rt></ruby>り<ruby>皿<rt>ざら</rt></ruby>、ありますか？
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">
              Apakah ada piring kecil?
            </p>
          </article>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">Kosakata barang tambahan</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              { jp: <><ruby>取<rt>と</rt></ruby>り<ruby>皿<rt>ざら</rt></ruby></>, reading: "torizara", meaning: "Piring kecil" },
              { jp: "スプーン", reading: "supuun", meaning: "Sendok" },
              { jp: "フォーク", reading: "fooku", meaning: "Garpu" },
              { jp: <ruby>箸<rt>はし</rt></ruby>, reading: "hashi", meaning: "Sumpit" },
              { jp: "ケチャップ", reading: "kechappu", meaning: "Saus tomat" },
              { jp: "マヨネーズ", reading: "mayoneezu", meaning: "Mayones" },
            ].map((item) => (
              <div
                key={item.reading}
                className="flex items-center justify-between gap-3 rounded-lg bg-black/15 px-3 py-2"
              >
                <div>
                  <JapaneseVocabularyReading reading={item.reading} meaning={item.meaning}
                    contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]"
                    kanaClassName="mt-1 font-mincho text-base text-[#D6AD4F]"
                    romajiClassName="mt-1 text-[9px] text-[#B8860B]"
                    translationClassName="mt-2 text-xs leading-5 text-[#A9A398]"
                  >
                    {item.jp}
                  </JapaneseVocabularyReading>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A77FBD]/15 text-[#C7A9DB]">
            <MapPin size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 05
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Mengenali papan nama restoran
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Papan nama di depan toko sering memakai nama hidangan sebagai petunjuk.
          Perhatikan kata yang paling besar, lalu cocokkan dengan jenis makanan
          yang biasanya tersedia.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {restaurantSigns.map((item, index) => (
            <article
              key={item.sign}
              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]"
            >
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-[#4A3825] to-[#211B17] p-3">
                <div className="flex h-20 w-full items-center justify-center rounded-lg border-2 border-[#D9B66D]/45 bg-[#E8D7B1] px-2 shadow-lg">
                  <span className="font-mincho text-xl font-black tracking-wider text-[#382719]">
                    {item.sign === "焼肉" ? <ruby>焼肉<rt className="text-[0.5em]">やきにく</rt></ruby> : item.sign}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
                    SIGNBOARD 0{index + 1}
                  </span>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <p className="mt-2 font-mincho text-base font-bold text-[#F1EBDD]">
                  {item.meaning}
                </p>
                <p className="mt-1 text-[10px] text-[#B8860B]">{item.reading}</p>
                <p className="mt-2 text-xs text-[#A9A398]">
                  Petunjuk: {item.clue}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            CATATAN TATA BAHASA
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Pola penting Pelajaran 6
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              01 · MEMESAN SESUATU
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              N、ください / お<ruby>願<rt>ねが</rt></ruby>いします
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              チーズバーガー、ください。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Sebutkan nama barang, lalu tambahkan ください. お<ruby>願<rt>ねが</rt></ruby>いします
              terdengar lebih sopan karena berupa permintaan kepada orang lain.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              02 · MENENTUKAN PILIHAN
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              Nにします
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              <ruby>私<rt>わたし</rt></ruby>は、カレーにします。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Partikel に digunakan bersama します untuk menyatakan pilihan
              atau keputusan. <ruby>何<rt>なに</rt></ruby>にしますか berarti “Mau pilih yang mana?”.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              03 · MENGHITUNG BARANG
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              N + ひとつ / ふたつ…
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              ポテト、ふたつください。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Jumlah disebut setelah nama makanan. Untuk hitungan benda umum,
              gunakan ひとつ、ふたつ、みっつ, bukan いち、に、さん.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              04 · BERTANYA KETERSEDIAAN
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              N（は）ありますか？
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              <ruby>水<rt>みず</rt></ruby>はありますか？
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Gunakan untuk menanyakan apakah suatu barang tersedia. Dalam
              percakapan, partikel は kadang dihilangkan.
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
            { jp: <ruby>魚<rt>さかな</rt></ruby>, reading: "sakana", meaning: "Ikan" },
            { jp: <ruby>肉<rt>にく</rt></ruby>, reading: "niku", meaning: "Daging" },
            { jp: <><ruby>好<rt>す</rt></ruby>き</>, reading: "suki", meaning: "Suka" },
          ].map((item) => (
            <article
              key={item.reading}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <JapaneseVocabularyReading reading={item.reading} meaning={item.meaning}
                  contentClassName="font-mincho text-2xl font-bold text-[#F1EBDD]"
                  kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]"
                  romajiClassName="mt-1 mt-1 text-[10px] italic text-[#B8860B]"
                  translationClassName="mt-2 mt-2 text-xs text-[#A9A398]"
                >
                  {item.jp}
                </JapaneseVocabularyReading>
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
            Kebiasaan memesan makanan
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Memilih paket burger
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Banyak restoran cepat saji menawarkan paket berisi makanan utama,
              kentang, dan minuman. Isi paket dapat berbeda, jadi perhatikan
              tulisan pada menu sebelum memesan.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Makan di tempat atau dibawa pulang
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Staf dapat bertanya 「こちらでおめしあがりですか？」.
              Jawab ここで jika makan di tempat, atau テイクアウトで
              jika ingin membawa pesanan pulang.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Mesin tiket makanan
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Sebagian tempat makan menggunakan mesin untuk membeli tiket
              pesanan. Pilih menu pada layar atau tombol, simpan tiketnya,
              lalu ikuti petunjuk untuk menerima makanan.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Meminta barang tambahan
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Bila membutuhkan sendok, sumpit, atau piring kecil, panggil staf
              dengan sopan menggunakan すみません lalu sampaikan permintaanmu.
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
                  SOAL {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">
                  <JapaneseReading allowIndexFallback>{question.prompt}</JapaneseReading>
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
                          <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
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
                    <JapaneseReading allowIndexFallback>{question.explanation}</JapaneseReading>
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
          Nilai kemampuanmu setelah mencoba menu, dialog, praktik pesanan,
          dan latihan membaca papan nama. ★☆☆ berarti sudah bisa tetapi
          masih perlu latihan, ★★☆ berarti sudah bisa, dan ★★★ berarti
          bisa dengan baik. Penilaian ini tersimpan khusus untuk Irodori,
          terpisah dari progres Minna no Nihongo dan JLPT.
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
                        saveIrodoriSelfEvaluation("starter-06", nextRatings);
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
              onClick={() => completeIrodoriLesson("starter-06")}
              disabled={!quizSubmitted || !orderConfirmed || !canDosRated}
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
        {!quizSubmitted || !orderConfirmed || !canDosRated ? (
          <p className="mt-2 text-[10px] leading-5 text-[#817A73]">
            Selesaikan kuis, susun satu pesanan, dan isi kelima penilaian
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
