"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Coins,
  PackageCheck,
  Percent,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import IrodoriConversation, { type IrodoriUtterance } from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import JapaneseReading from "@/components/JapaneseReading";
import JapaneseVocabularyReading from "@/components/JapaneseVocabularyReading";
import { formatGrammarNotation } from "@/lib/japanese-text";
import {
  completeIrodoriLesson,
  saveIrodoriSelfEvaluation,
  useIrodoriProgress,
} from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const speakers = IRODORI_SPEAKERS;

const priceConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>すみません。これ、いくらですか？</>,
    romaji: "Sumimasen. Kore, ikura desu ka?",
    translation: "Permisi. Yang ini harganya berapa?",
    audioFileName: "irodori-starter-16-a01-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>380<ruby>円<rt>えん</rt></ruby>です。</>,
    romaji: "Sanbyaku hachijuu en desu.",
    translation: "Harganya 380 yen.",
    audioFileName: "irodori-starter-16-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>じゃあ、これをください。</>,
    romaji: "Jaa, kore o kudasai.",
    translation: "Kalau begitu, saya beli yang ini.",
    audioFileName: "irodori-starter-16-a01-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>ありがとうございます。</>,
    romaji: "Arigatou gozaimasu.",
    translation: "Terima kasih.",
    audioFileName: "irodori-starter-16-a01-l04.mp3",
  },
];

const demonstrativeConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>すみません。あのノートはいくらですか？</>,
    romaji: "Sumimasen. Ano nooto wa ikura desu ka?",
    translation: "Permisi. Buku catatan yang di sana itu berapa harganya?",
    audioFileName: "irodori-starter-16-a02-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>あちらのノートですね。420<ruby>円<rt>えん</rt></ruby>です。</>,
    romaji: "Achira no nooto desu ne. Yonhyaku nijuu en desu.",
    translation: "Buku catatan yang di sana, ya. Harganya 420 yen.",
    audioFileName: "irodori-starter-16-a02-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>そのノートを見せてください。</>,
    romaji: "Sono nooto o misete kudasai.",
    translation: "Tolong perlihatkan buku catatan itu.",
    audioFileName: "irodori-starter-16-a02-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>はい。こちらです。どうぞ。</>,
    romaji: "Hai. Kochira desu. Douzo.",
    translation: "Baik. Ini, silakan.",
    audioFileName: "irodori-starter-16-a02-l04.mp3",
  },
];

const quantityConversation: IrodoriUtterance[] = [
  {
    speakerId: "kenji",
    japanese: <>いらっしゃいませ。何にしますか？</>,
    romaji: "Irasshaimase. Nani ni shimasu ka?",
    translation: "Selamat datang. Mau pesan apa?",
    audioFileName: "irodori-starter-16-a03-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>メロンパンを3つと、クッキーを5<ruby>個<rt>こ</rt></ruby>ください。</>,
    romaji: "Meronpan o mittsu to, kukkii o goko kudasai.",
    translation: "Tolong tiga roti melon dan lima kukis.",
    audioFileName: "irodori-starter-16-a03-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい。メロンパンが3つ、クッキーが5<ruby>個<rt>こ</rt></ruby>ですね。</>,
    romaji: "Hai. Meronpan ga mittsu, kukkii ga goko desu ne.",
    translation: "Baik. Tiga roti melon dan lima kukis, ya.",
    audioFileName: "irodori-starter-16-a03-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>それから、チョコレートケーキとチーズケーキを2<ruby>個<rt>こ</rt></ruby>ずつお願いします。</>,
    romaji: "Sore kara, chokoreeto keeki to chiizu keeki o niko zutsu onegaishimasu.",
    translation: "Lalu, dua kue cokelat dan dua kue keju, masing-masing dua potong.",
    audioFileName: "irodori-starter-16-a03-l04.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>かしこまりました。</>,
    romaji: "Kashikomarimashita.",
    translation: "Baik, dengan senang hati.",
    audioFileName: "irodori-starter-16-a03-l05.mp3",
  },
];

const checkoutConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>こちら、<ruby>温<rt>あたた</rt></ruby>めますか？</>,
    romaji: "Kochira, atatamemasu ka?",
    translation: "Apakah ini ingin dihangatkan?",
    audioFileName: "irodori-starter-16-a04-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい、お願いします。</>,
    romaji: "Hai, onegaishimasu.",
    translation: "Ya, tolong hangatkan.",
    audioFileName: "irodori-starter-16-a04-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>おはしは、おつけしますか？</>,
    romaji: "Ohashi wa, otsuke shimasu ka?",
    translation: "Apakah perlu sumpit?",
    audioFileName: "irodori-starter-16-a04-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。1<ruby>膳<rt>ぜん</rt></ruby>お願いします。</>,
    romaji: "Hai. Ichi-zen onegaishimasu.",
    translation: "Ya. Satu pasang, tolong.",
    audioFileName: "irodori-starter-16-a04-l04.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <><ruby>袋<rt>ふくろ</rt></ruby>は、どうしますか？</>,
    romaji: "Fukuro wa, dou shimasu ka?",
    translation: "Bagaimana dengan kantong belanja?",
    audioFileName: "irodori-starter-16-a04-l05.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>だいじょうぶです。カードでお願いします。</>,
    romaji: "Daijoubu desu. Kaado de onegaishimasu.",
    translation: "Tidak perlu, terima kasih. Saya bayar dengan kartu.",
    audioFileName: "irodori-starter-16-a04-l06.mp3",
  },
];

const discountConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>このシャツ、<ruby>安<rt>やす</rt></ruby>くなっていますね。</>,
    romaji: "Kono shatsu, yasuku natte imasu ne.",
    translation: "Kemeja ini sedang didiskon, ya.",
    audioFileName: "irodori-starter-16-a05-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい。2,000<ruby>円<rt>えん</rt></ruby>から20％<ruby>引<rt>び</rt></ruby>きです。</>,
    romaji: "Hai. Nisen-en kara nijuppaasento-biki desu.",
    translation: "Ya. Diskon 20 persen dari harga 2.000 yen.",
    audioFileName: "irodori-starter-16-a05-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>じゃあ、1,600<ruby>円<rt>えん</rt></ruby>ですね。</>,
    romaji: "Jaa, sen roppyaku en desu ne.",
    translation: "Kalau begitu, harganya 1.600 yen, ya.",
    audioFileName: "irodori-starter-16-a05-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>そうです。レジでお<ruby>支払<rt>しはら</rt></ruby>いください。</>,
    romaji: "Sou desu. Reji de oshiharai kudasai.",
    translation: "Betul. Silakan bayar di kasir.",
    audioFileName: "irodori-starter-16-a05-l04.mp3",
  },
];

const canDos = [
  { id: "understand-prices", text: "Mendengarkan harga suatu produk dan memahami jumlah uang yang disebutkan." },
  { id: "ask-product-price", text: "Menanyakan harga barang kepada staf toko dan memahami jawabannya." },
  { id: "say-quantity", text: "Menyebutkan jumlah atau takaran barang yang ingin dibeli." },
  { id: "answer-checkout", text: "Menjawab pertanyaan staf di kasir, seperti perlu tidaknya makanan dihangatkan, alat makan, atau kantong." },
  { id: "read-discounts", text: "Membaca tanda diskon di toko dan memahami harga setelah potongan." },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

type Task = {
  prompt: ReactNode;
  options: { key: string; label: ReactNode }[];
  answer: string;
  explanation: ReactNode;
};

const practiceTasks: Task[] = [
  {
    prompt: <>Bagaimana menanyakan harga barang yang sedang kamu pegang?</>,
    options: [
      { key: "a", label: "これ、いくらですか？" },
      { key: "b", label: "それ、どこですか？" },
      { key: "c", label: "あれ、なんですか？" },
    ],
    answer: "a",
    explanation: <>「これ、いくらですか？」 berarti berapa harga barang yang dekat dengan pembicara.</>,
  },
  {
    prompt: <>Barang berada dekat lawan bicara. Kata tunjuk yang tepat adalah …</>,
    options: [
      { key: "a", label: "これ" },
      { key: "b", label: "それ" },
      { key: "c", label: "あれ" },
    ],
    answer: "b",
    explanation: <>それ digunakan untuk benda yang dekat dengan lawan bicara. これ dekat dengan pembicara, sedangkan あれ jauh dari keduanya.</>,
  },
  {
    prompt: <>Bagaimana mengatakan membeli tiga buah roti melon?</>,
    options: [
      { key: "a", label: "メロンパンを三つください。" },
      { key: "b", label: "メロンパンを三人ください。" },
      { key: "c", label: "メロンパンを三階ください。" },
    ],
    answer: "a",
    explanation: <>Bentuk hitungan umum adalah 「みっつ」 untuk tiga buah: メロンパンを三つください.</>,
  },
  {
    prompt: <>Apa arti 「2個ずつ」?</>,
    options: [
      { key: "a", label: "Dua barang semuanya" },
      { key: "b", label: "Dua untuk masing-masing jenis" },
      { key: "c", label: "Dua jenis barang saja" },
    ],
    answer: "b",
    explanation: <>ずつ menunjukkan jumlah yang sama untuk setiap jenis barang: dua masing-masing.</>,
  },
  {
    prompt: <>Staf bertanya 「袋はどうしますか？」. Kamu tidak memerlukan kantong. Apa jawaban yang sesuai?</>,
    options: [
      { key: "a", label: "だいじょうぶです。" },
      { key: "b", label: "温めてください。" },
      { key: "c", label: "いくらですか？" },
    ],
    answer: "a",
    explanation: <>だいじょうぶです dapat digunakan untuk menolak tawaran dengan sopan, misalnya kantong yang tidak diperlukan.</>,
  },
  {
    prompt: <>Harga awal 500 yen mendapat diskon 20%. Berapa harga setelah diskon?</>,
    options: [
      { key: "a", label: "400円" },
      { key: "b", label: "450円" },
      { key: "c", label: "480円" },
    ],
    answer: "a",
    explanation: <>20% dari 500 yen adalah 100 yen. Harga setelah potongan: 500 − 100 = 400 yen.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Bacaan yang benar untuk 300円 adalah …</>,
    options: [
      { key: "a", label: "さんひゃくえん" },
      { key: "b", label: "さんびゃくえん" },
      { key: "c", label: "さんぜんえん" },
    ],
    answer: "b",
    explanation: <>300 dibaca さんびゃく, sehingga 300円 adalah さんびゃくえん.</>,
  },
  {
    prompt: <>Bacaan yang benar untuk 800円 adalah …</>,
    options: [
      { key: "a", label: "はっぴゃくえん" },
      { key: "b", label: "はちひゃくえん" },
      { key: "c", label: "はっせんえん" },
    ],
    answer: "a",
    explanation: <>800 dibaca はっぴゃく.</>,
  },
  {
    prompt: <>Bagaimana mengatakan 3.000 yen?</>,
    options: [
      { key: "a", label: "さんびゃくえん" },
      { key: "b", label: "さんぜんえん" },
      { key: "c", label: "さんまんえん" },
    ],
    answer: "b",
    explanation: <>3.000 dibaca さんぜん. Perhatikan bunyi khusus pada angka 3.000.</>,
  },
  {
    prompt: <>Bentuk kata tunjuk yang benar sebelum kata benda adalah …</>,
    options: [
      { key: "a", label: "これノート" },
      { key: "b", label: "このノート" },
      { key: "c", label: "このはノート" },
    ],
    answer: "b",
    explanation: <>Sebelum kata benda gunakan この, その, atau あの: このノート, そのシャツ, あのバッグ.</>,
  },
  {
    prompt: <>Jika ingin meminta dua buah buku catatan, pilihan yang tepat adalah …</>,
    options: [
      { key: "a", label: "ノートを二つください。" },
      { key: "b", label: "ノートを二人ください。" },
      { key: "c", label: "ノートを二階ください。" },
    ],
    answer: "a",
    explanation: <>二つ dibaca ふたつ dan dapat dipakai sebagai hitungan umum untuk dua benda.</>,
  },
  {
    prompt: <>Manakah hitungan 個 yang benar untuk enam buah?</>,
    options: [
      { key: "a", label: "ろくこ" },
      { key: "b", label: "ろっこ" },
      { key: "c", label: "むっつ" },
    ],
    answer: "b",
    explanation: <>6個 dibaca ろっこ. むっつ adalah bentuk hitungan umum dengan つ.</>,
  },
  {
    prompt: <>Apa arti 「2,000円から10％引き」?</>,
    options: [
      { key: "a", label: "Harga 2.000 yen ditambah 10 yen" },
      { key: "b", label: "Diskon 10 persen dari 2.000 yen" },
      { key: "c", label: "Harga menjadi 10.000 yen" },
    ],
    answer: "b",
    explanation: <>10％引き berarti potongan 10 persen dari harga yang tertera.</>,
  },
  {
    prompt: <>Harga 800 yen mendapat potongan 100 yen. Berapa harga akhirnya?</>,
    options: [
      { key: "a", label: "900円" },
      { key: "b", label: "700円" },
      { key: "c", label: "80円" },
    ],
    answer: "b",
    explanation: <>800 − 100 = 700 yen. Tanda 100円引き berarti dikurangi 100 yen.</>,
  },
  {
    prompt: <>Kasir bertanya 「こちら、温めますか？」. Apa yang sedang ditanyakan?</>,
    options: [
      { key: "a", label: "Apakah barang ini ingin dihangatkan?" },
      { key: "b", label: "Apakah barang ini ingin dibungkus?" },
      { key: "c", label: "Apakah barang ini ingin dikembalikan?" },
    ],
    answer: "a",
    explanation: <>温めますか menanyakan apakah makanan ingin dihangatkan.</>,
  },
  {
    prompt: <>Apa arti 「半額」 pada papan diskon?</>,
    options: [
      { key: "a", label: "Diskon 10 persen" },
      { key: "b", label: "Harga setengah dari harga awal" },
      { key: "c", label: "Semua barang seharga 100 yen" },
    ],
    answer: "b",
    explanation: <>半額 berarti setengah harga, atau diskon 50 persen.</>,
  },
];

const currencyWords = [
  ["1円", "いちえん · ichien", "1 yen"],
  ["5円", "ごえん · goen", "5 yen"],
  ["10円", "じゅうえん · juu en", "10 yen"],
  ["50円", "ごじゅうえん · gojuu en", "50 yen"],
  ["100円", "ひゃくえん · hyaku en", "100 yen"],
  ["500円", "ごひゃくえん · gohyaku en", "500 yen"],
  ["1,000円", "せんえん · sen en", "1.000 yen"],
  ["5,000円", "ごせんえん · gosen en", "5.000 yen"],
  ["10,000円", "いちまんえん · ichiman en", "10.000 yen"],
];

const numberWords = [
  ["100", "ひゃく · hyaku"],
  ["200", "にひゃく · nihyaku"],
  ["300", "さんびゃく · sanbyaku"],
  ["400", "よんひゃく · yonhyaku"],
  ["500", "ごひゃく · gohyaku"],
  ["600", "ろっぴゃく · roppyaku"],
  ["700", "ななひゃく · nanahyaku"],
  ["800", "はっぴゃく · happyaku"],
  ["900", "きゅうひゃく · kyuuhyaku"],
  ["1,000", "せん · sen"],
  ["2,000", "にせん · nisen"],
  ["3,000", "さんぜん · sanzen"],
  ["4,000", "よんせん · yonsen"],
  ["5,000", "ごせん · gosen"],
  ["6,000", "ろくせん · rokusen"],
  ["7,000", "ななせん · nanasen"],
  ["8,000", "はっせん · hassen"],
  ["9,000", "きゅうせん · kyuusen"],
  ["10,000", "いちまん · ichiman"],
];

const counterWords = [
  ["1つ", "ひとつ · hitotsu"],
  ["2つ", "ふたつ · futatsu"],
  ["3つ", "みっつ · mittsu"],
  ["4つ", "よっつ · yottsu"],
  ["5つ", "いつつ · itsutsu"],
  ["6つ", "むっつ · muttsu"],
  ["7つ", "ななつ · nanatsu"],
  ["8つ", "やっつ · yattsu"],
  ["9つ", "ここのつ · kokonotsu"],
  ["10", "とお · too"],
];

const itemWords = [
  ["ノート", "nooto", "Buku catatan"],
  ["シャツ", "shatsu", "Kemeja"],
  ["バッグ", "baggu", "Tas"],
  ["カレンダー", "karendaa", "Kalender"],
  ["お菓子", "おかし · okashi", "Camilan"],
  ["ケーキ", "keeki", "Kue"],
  ["メロンパン", "meronpan", "Roti melon"],
  ["クッキー", "kukkii", "Kukis"],
  ["お弁当", "おべんとう · obentou", "Bekal / bento"],
  ["おはし", "ohashi", "Sumpit"],
  ["袋", "ふくろ · fukuro", "Kantong"],
  ["値段", "ねだん · nedan", "Harga"],
];

const discountSigns = [
  { id: "twenty", title: "Kemeja", original: 2000, sign: "20％引き", result: 1600, explanation: "Potongan 20% = 400 yen." },
  { id: "yen", title: "Buku catatan", original: 800, sign: "100円引き", result: 700, explanation: "Harga dikurangi 100 yen." },
  { id: "half", title: "Kotak bekal", original: 600, sign: "半額", result: 300, explanation: "Setengah dari 600 yen." },
  { id: "fixed", title: "Camilan", original: 150, sign: "50円均一", result: 50, explanation: "Semua barang pada rak ini seharga 50 yen." },
];

export default function IrodoriPemulaLessonSixteenPage() {
  const progress = useIrodoriProgress();
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [priceChoice, setPriceChoice] = useState("");
  const [priceSubmitted, setPriceSubmitted] = useState(false);
  const [quantityChoice, setQuantityChoice] = useState("");
  const [quantitySubmitted, setQuantitySubmitted] = useState(false);
  const [checkoutChoice, setCheckoutChoice] = useState("");
  const [checkoutSubmitted, setCheckoutSubmitted] = useState(false);
  const [discountChoice, setDiscountChoice] = useState("");
  const [discountSubmitted, setDiscountSubmitted] = useState(false);
  const [demonstrativeChoice, setDemonstrativeChoice] = useState("");
  const [demonstrativeSubmitted, setDemonstrativeSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const isCompleted = progress.completedLessons.includes("starter-16");
  const practiceScore = practiceTasks.filter((task, index) => practiceAnswers[index] === task.answer).length;
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;
  const score = quizQuestions.filter((question, index) => answers[index] === question.answer).length;
  const priceIsCorrect = priceSubmitted && priceChoice === "this";
  const quantityIsCorrect = quantitySubmitted && quantityChoice === "two-each";
  const checkoutIsCorrect = checkoutSubmitted && checkoutChoice === "no-bag";
  const discountIsCorrect = discountSubmitted && discountChoice === "four-hundred";
  const demonstrativeIsCorrect = demonstrativeSubmitted && demonstrativeChoice === "sono";
  const activitiesComplete = priceIsCorrect && quantityIsCorrect && checkoutIsCorrect && discountIsCorrect && demonstrativeIsCorrect;
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
        <ArrowLeft size={15} /> Kembali ke Pemula
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#79602F]/45 bg-gradient-to-br from-[#302319] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D6AD4F]/[0.07]">円</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">IRODORI • PEMULA A1 • PELAJARAN 16</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Berapa harga barang ini?</h1>
          <p className="mt-2 text-sm font-semibold text-[#D9B66D]">これ、いくらですか？</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Belajar memahami harga, menanyakan harga barang, menyebutkan jumlah dan takaran, menjawab pertanyaan kasir, serta membaca papan diskon di toko.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Coins size={14} className="text-[#D6AD4F}" />Harga & angka</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><ShoppingBag size={14} className="text-[#D6AD4F]" />Jumlah barang</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><PackageCheck size={14} className="text-[#D6AD4F]" />Kasir toko</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Percent size={14} className="text-[#D6AD4F]" />Diskon</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#B8860B]/20 bg-[#1B1917]/80 p-4 md:p-5">
        <div className="flex items-center gap-2"><ShoppingCart size={16} className="text-[#D9B66D]" /><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2></div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">CAN-DO 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA 01</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Uang dan harga</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenali nominal yen. Harga di bawah digunakan sebagai contoh latihan.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {currencyWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3 text-center">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-xl font-bold leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/20 bg-[#211E1A] p-3">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">ANGKA RATUSAN DAN RIBUAN</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {numberWords.map(([number, reading]) => (
              <div key={number} className="rounded-lg border border-white/[0.06] bg-black/15 p-2 text-center">
                <JapaneseVocabularyReading reading={reading} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]">{number}</JapaneseVocabularyReading>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[9px] leading-5 text-[#8F897F]">Perhatikan perubahan bunyi: 300 さんびゃく, 600 ろっぴゃく, 800 はっぴゃく, 3.000 さんぜん, dan 8.000 はっせん.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dengarkan percakapan saat berbelanja</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Dialog disusun orisinal oleh Fude dengan furigana pada kanji. Perhatikan kata tunjuk, harga, jumlah barang, dan pertanyaan kasir.</p></div>
        <div className="space-y-4">
          <IrodoriConversation title="Menanyakan harga barang" speakers={[speakers.yui, speakers.kenji]} utterances={priceConversation} />
          <IrodoriConversation title="Menanyakan harga barang yang jauh" speakers={[speakers.sota, speakers.akiko]} utterances={demonstrativeConversation} />
          <IrodoriConversation title="Memesan beberapa barang" speakers={[speakers.kenji, speakers.yui]} utterances={quantityConversation} />
          <IrodoriConversation title="Menjawab pertanyaan kasir" speakers={[speakers.akiko, speakers.sota]} utterances={checkoutConversation} />
          <IrodoriConversation title="Memahami tanda diskon" speakers={[speakers.yui, speakers.kenji]} utterances={discountConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA 02</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Barang yang biasa dibeli</h2></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {itemWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">HITUNG JUMLAH</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menyebutkan banyak barang</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan hitungan umum つ atau penghitung 個 untuk menyebut jumlah benda.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {counterWords.map(([jp, reading]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3 text-center">
              <JapaneseVocabularyReading reading={reading} contentClassName="font-mincho text-xl leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/20 bg-[#211E1A] p-3">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">PENGHITUNG 個</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["1個", "いっこ · ikko"],
              ["2個", "にこ · niko"],
              ["3個", "さんこ · sanko"],
              ["4個", "よんこ · yonko"],
              ["5個", "ごこ · goko"],
              ["6個", "ろっこ · rokko"],
              ["7個", "ななこ · nanako"],
              ["8個", "はっこ · hakko"],
              ["9個", "きゅうこ · kyuuko"],
              ["10個", "じゅっこ · jukko"],
              ["何個", "なんこ · nanko"],
            ].map(([jp, reading]) => (
              <div key={jp} className="rounded-lg border border-white/[0.06] bg-black/15 p-2 text-center"><p className="font-mincho text-sm text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#D9B66D]">{reading}</p></div>
            ))}
          </div>
          <p className="mt-2 text-[9px] leading-5 text-[#8F897F]">Untuk berat atau takaran, sebutkan angka lalu satuannya, misalnya 200グラム. Untuk beberapa jenis barang dengan jumlah yang sama, tambahkan ずつ.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Bertanya harga dan jumlah</h2></div>
        {[
          {
            title: "01 · Menanyakan harga benda",
            pattern: "これ／それ／あれ（は）いくらですか？",
            example: <>これ、いくらですか？ ／ あれは、いくらですか？</>,
            note: "これ menunjuk benda dekat pembicara, それ benda dekat lawan bicara, dan あれ benda yang jauh dari keduanya. いくら berarti berapa harga.",
          },
          {
            title: "02 · Menunjuk benda sebelum kata benda",
            pattern: "この／その／あの + N",
            example: <>このノート、いくらですか？ ／ あのバッグはいくらですか？</>,
            note: "Jika kata tunjuk langsung diikuti kata benda, gunakan この, その, atau あの. Jangan memakai これノート atau それバッグ.",
          },
          {
            title: "03 · Meminta barang dengan jumlah tertentu",
            pattern: "N を【jumlah】ください ／ お願いします",
            example: <>メロンパンを3つください。／ ノートを2<ruby>個<rt>こ</rt></ruby>お願いします。</>,
            note: "Sebutkan nama barang, jumlah, lalu ください atau お願いします. Untuk berat, gunakan satuan seperti グラム. Gunakan つ atau 個 sesuai benda yang dihitung.",
          },
          {
            title: "04 · Meminta jumlah yang sama untuk setiap jenis",
            pattern: "N と N、【jumlah】ずつお願いします",
            example: <>チョコレートケーキとチーズケーキ、2<ruby>個<rt>こ</rt></ruby>ずつお願いします。</>,
            note: "ずつ berarti masing-masing atau setiap jenis mendapat jumlah yang sama. Pada contoh, dua kue cokelat dan dua kue keju.",
          },
          {
            title: "05 · Menjawab pertanyaan kasir",
            pattern: "はい、お願いします ／ いえ、けっこうです ／ だいじょうぶです",
            example: <>温めますか？ → はい、お願いします。／ 袋はどうしますか？ → だいじょうぶです。</>,
            note: "Gunakan はい、お願いします untuk menerima tawaran. いえ、けっこうです atau だいじょうぶです dapat digunakan untuk menolak dengan sopan. Untuk metode pembayaran, sebutkan ～でお願いします.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">{item.title}</p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#D9B66D]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">PAPAN DISKON</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Memahami harga setelah potongan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan istilah yang sering muncul pada label diskon. Semua harga berikut adalah contoh latihan.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {discountSigns.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="text-xs font-bold text-[#EAE6DD]">{item.title}</p>
              <p className="mt-3 text-[9px] font-black tracking-[0.15em] text-[#B8860B]">DISCOUNT SIGN</p>
              <p className="mt-1 font-mincho text-xl font-bold text-[#E7D2A1]">{item.sign}</p>
              <p className="mt-3 text-[10px] text-[#A9A398]">Harga awal: {item.original.toLocaleString("id-ID")} yen</p>
              <p className="mt-1 text-xs font-bold text-emerald-300">Harga akhir: {item.result.toLocaleString("id-ID")} yen</p>
              <p className="mt-2 text-[9px] text-[#8F897F]">{item.explanation}</p>
            </article>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            ["～％引き", "パーセントびき", "potongan sekian persen"],
            ["～円引き", "えんびき", "potongan sekian yen"],
            ["半額", "はんがく", "setengah harga"],
            ["値下げ", "ねさげ", "harga diturunkan"],
            ["税込", "ぜいこみ", "sudah termasuk pajak"],
            ["均一", "きんいつ", "harga seragam"],
          ].map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#27231D] p-3"><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#D9B66D]">{reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p></article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 01 · TANYA HARGA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tanyakan harga barang yang kamu pegang</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kamu memegang sebuah buku catatan dan ingin tahu harganya.</p></div>
        <div className="rounded-xl border border-[#D6AD4F]/20 bg-[#27231D] p-4 text-center">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">BARANG DI TANGANMU</p>
          <p className="mt-2 font-mincho text-2xl text-[#F1EBDD]">ノート</p>
          <p className="mt-1 text-[10px] text-[#A9A398]">Buku catatan · barang dekat pembicara</p>
        </div>
        <p className="text-xs font-semibold text-[#EAE6DD]">Kalimat mana yang tepat untuk bertanya harga?</p>
        <div className="grid gap-2">
          {[
            { key: "this", label: "これ、いくらですか？", meaning: "Yang ini, berapa harganya?" },
            { key: "that", label: "それ、どこですか？", meaning: "Yang itu, di mana?" },
            { key: "far", label: "あれ、なんですか？", meaning: "Yang jauh itu, apa?" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={priceSubmitted} aria-pressed={priceChoice === item.key} onClick={() => setPriceChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (priceSubmitted && item.key === "this" ? "border-emerald-500/50 bg-emerald-500/10" : priceSubmitted && priceChoice === item.key ? "border-red-400/50 bg-red-400/10" : priceChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <p className="font-mincho text-sm text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{priceSubmitted ? priceIsCorrect ? "Benar. これ menunjuk benda yang dekat dengan pembicara." : "Belum tepat. Pilih kata tunjuk untuk benda yang sedang kamu pegang." : "Pilih ungkapan yang tepat."}</p>
          {priceSubmitted ? <button type="button" onClick={() => { setPriceChoice(""); setPriceSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!priceChoice} onClick={() => setPriceSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 02 · JUMLAH BARANG</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih pesanan yang benar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kamu ingin membeli dua kue cokelat dan dua kue keju.</p></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3 text-center"><p className="font-mincho text-lg text-[#F1EBDD]">チョコレートケーキ</p><p className="mt-1 text-[10px] text-[#A9A398]">Kue cokelat · 2</p></div>
          <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3 text-center"><p className="font-mincho text-lg text-[#F1EBDD]">チーズケーキ</p><p className="mt-1 text-[10px] text-[#A9A398]">Kue keju · 2</p></div>
        </div>
        <div className="grid gap-2">
          {[
            { key: "one-each", label: "チョコレートケーキとチーズケーキ、1個ずつお願いします。", meaning: "Satu masing-masing." },
            { key: "two-each", label: "チョコレートケーキとチーズケーキ、2個ずつお願いします。", meaning: "Dua masing-masing." },
            { key: "four-total", label: "チョコレートケーキとチーズケーキ、4個ずつお願いします。", meaning: "Empat masing-masing." },
          ].map((item) => (
            <button key={item.key} type="button" disabled={quantitySubmitted} aria-pressed={quantityChoice === item.key} onClick={() => setQuantityChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (quantitySubmitted && item.key === "two-each" ? "border-emerald-500/50 bg-emerald-500/10" : quantitySubmitted && quantityChoice === item.key ? "border-red-400/50 bg-red-400/10" : quantityChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <p className="font-mincho text-sm leading-6 text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{quantitySubmitted ? quantityIsCorrect ? "Benar. 2個ずつ berarti dua untuk setiap jenis." : "Belum tepat. Perhatikan arti ずつ." : "Pilih cara memesan."}</p>
          {quantitySubmitted ? <button type="button" onClick={() => { setQuantityChoice(""); setQuantitySubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!quantityChoice} onClick={() => setQuantitySubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa pesanan</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 03 · KASIR</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Jawab pertanyaan kasir</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kasir menawarkan kantong belanja. Kamu sudah membawa tas sendiri, jadi tidak memerlukan kantong.</p></div>
        <div className="rounded-xl border border-[#D6AD4F]/20 bg-[#27231D] p-4">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">KASIR</p>
          <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">袋は、どうしますか？</p>
          <p className="mt-1 text-xs text-[#A9A398]">Bagaimana dengan kantong belanja?</p>
        </div>
        <div className="grid gap-2">
          {[
            { key: "bag", label: "はい、お願いします。", meaning: "Ya, tolong." },
            { key: "no-bag", label: "だいじょうぶです。", meaning: "Tidak perlu, terima kasih." },
            { key: "warm", label: "温めてください。", meaning: "Tolong hangatkan." },
          ].map((item) => (
            <button key={item.key} type="button" disabled={checkoutSubmitted} aria-pressed={checkoutChoice === item.key} onClick={() => setCheckoutChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (checkoutSubmitted && item.key === "no-bag" ? "border-emerald-500/50 bg-emerald-500/10" : checkoutSubmitted && checkoutChoice === item.key ? "border-red-400/50 bg-red-400/10" : checkoutChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <p className="font-mincho text-sm text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{checkoutSubmitted ? checkoutIsCorrect ? "Benar. だいじょうぶです dapat menolak tawaran dengan sopan." : "Belum tepat. Pilih ungkapan untuk menyampaikan bahwa kantong tidak diperlukan." : "Pilih jawaban kepada kasir."}</p>
          {checkoutSubmitted ? <button type="button" onClick={() => { setCheckoutChoice(""); setCheckoutSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!checkoutChoice} onClick={() => setCheckoutSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa jawaban</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 04 · DISKON</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Hitung harga setelah potongan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Sebuah barang berharga 500 yen dan mendapat diskon 20%. Berapa harga akhirnya?</p></div>
        <div className="rounded-xl border border-[#D6AD4F]/25 bg-[#27231D] p-4 text-center">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">SALE</p>
          <p className="mt-2 font-mincho text-2xl font-bold text-[#F1EBDD]">500円</p>
          <p className="mt-1 inline-flex rounded-lg bg-[#C93438]/15 px-3 py-1 text-sm font-black text-[#F0AAAA]">20％引き</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "four-hundred", label: "400円" },
            { key: "four-fifty", label: "450円" },
            { key: "four-eighty", label: "480円" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={discountSubmitted} aria-pressed={discountChoice === item.key} onClick={() => setDiscountChoice(item.key)} className={"rounded-xl border p-3 text-center font-mincho text-lg font-bold transition-colors " + (discountSubmitted && item.key === "four-hundred" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : discountSubmitted && discountChoice === item.key ? "border-red-400/50 bg-red-400/10 text-red-200" : discountChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/10 text-[#A9A398]")}><JapaneseReading allowIndexFallback contentClassName="font-mincho text-lg font-bold text-inherit">{item.label}</JapaneseReading></button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{discountSubmitted ? discountIsCorrect ? "Benar. Diskon 20% dari 500 yen adalah 100 yen; harga akhirnya 400 yen." : "Belum tepat. Hitung 20% dari harga awal, lalu kurangi." : "Pilih harga setelah diskon."}</p>
          {discountSubmitted ? <button type="button" onClick={() => { setDiscountChoice(""); setDiscountSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!discountChoice} onClick={() => setDiscountSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa harga</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 05 · KATA TUNJUK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tunjuk barang di dekat staf</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Buku catatan yang ingin kamu tanyakan berada dekat staf toko, bukan dekatmu.</p></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3 text-center"><p className="font-mincho text-lg text-[#A9A398]">これ</p><p className="mt-1 text-[9px] text-[#A9A398]">Dekat pembicara</p></div>
          <div className="rounded-xl border border-[#D6AD4F]/30 bg-[#D6AD4F]/10 p-3 text-center"><p className="font-mincho text-lg text-[#F1EBDD]">それ</p><p className="mt-1 text-[9px] text-[#D9B66D]">Dekat lawan bicara</p></div>
          <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3 text-center"><p className="font-mincho text-lg text-[#A9A398]">あれ</p><p className="mt-1 text-[9px] text-[#A9A398]">Jauh dari keduanya</p></div>
        </div>
        <p className="text-xs font-semibold text-[#EAE6DD]">Kamu ingin bertanya tentang buku catatan yang berada dekat staf. Pilih kalimat yang tepat.</p>
        <div className="grid gap-2">
          {[
            { key: "kono", label: "このノート、いくらですか？", meaning: "Buku catatan ini (dekat saya), berapa?" },
            { key: "sono", label: "そのノート、いくらですか？", meaning: "Buku catatan itu (dekat Anda), berapa?" },
            { key: "ano", label: "あのノート、いくらですか？", meaning: "Buku catatan yang jauh di sana, berapa?" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={demonstrativeSubmitted} aria-pressed={demonstrativeChoice === item.key} onClick={() => setDemonstrativeChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (demonstrativeSubmitted && item.key === "sono" ? "border-emerald-500/50 bg-emerald-500/10" : demonstrativeSubmitted && demonstrativeChoice === item.key ? "border-red-400/50 bg-red-400/10" : demonstrativeChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <p className="font-mincho text-sm text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{demonstrativeSubmitted ? demonstrativeIsCorrect ? "Benar. その dan そのN menunjuk benda yang dekat dengan lawan bicara." : "Belum tepat. Pilih kata tunjuk untuk benda yang dekat dengan lawan bicara." : "Pilih kata tunjuk."}</p>
          {demonstrativeSubmitted ? <button type="button" onClick={() => { setDemonstrativeChoice(""); setDemonstrativeSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!demonstrativeChoice} onClick={() => setDemonstrativeSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa kalimat</button>}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban praktik harus benar untuk membuka evaluasi akhir.</p></div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {task.options.map((option) => (
                    <button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected === option.key} onClick={() => setPracticeAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (practiceSubmitted && option.key === task.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : practiceSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>
                  ))}
                </div>
                {practiceSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span><JapaneseReading allowIndexFallback>{task.explanation}</JapaneseReading></p>}
              </article>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{practiceSubmitted ? "Hasil praktik: " + practiceScore + " dari " + practiceTasks.length + " benar." : Object.keys(practiceAnswers).length + " dari " + practiceTasks.length + " pertanyaan dijawab."}</p>
          {practiceSubmitted ? <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1]"><RefreshCw size={13}/>Ulangi praktik</button> : <button type="button" onClick={() => setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length !== practiceTasks.length} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa praktik</button>}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KUIS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p></div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">SOAL {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{question.prompt}</JapaneseReading></h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {question.options.map((option) => (
                    <button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected === option.key} onClick={() => setAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (quizSubmitted && option.key === question.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : quizSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>
                  ))}
                </div>
                {quizSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span><JapaneseReading allowIndexFallback>{question.explanation}</JapaneseReading></p>}
              </article>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{quizSubmitted ? "Nilai latihan: " + score + " dari " + quizQuestions.length + " benar." : Object.keys(answers).length + " dari " + quizQuestions.length + " pertanyaan dijawab."}</p>
          {quizSubmitted ? <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1]"><RefreshCw size={13}/>Ulangi kuis</button> : <button type="button" onClick={() => setQuizSubmitted(true)} disabled={Object.keys(answers).length !== quizQuestions.length} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa jawaban</button>}
        </div>
      </section>

      <section className="rounded-2xl border border-[#B8860B]/25 bg-gradient-to-br from-[#2B2118] to-[#191817] p-5 md:p-6">
        <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#D9B66D]"/><p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">CEK TARGET KOMUNIKASI</p></div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Nilai lima kemampuan setelah menyelesaikan praktik, kelima simulasi, dan kuis. Progres Irodori tersimpan terpisah dari Minna no Nihongo dan JLPT.</p>
        <div className="mt-4 space-y-3">
          {canDos.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
              <p className="text-xs font-semibold leading-5 text-[#EAE6DD]"><span className="mr-2 text-[#D9B66D]">0{index + 1}</span>{item.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ratingOptions.map((option) => (
                  <button key={option.value} type="button" aria-pressed={ratings[item.id] === option.value} onClick={() => { const next = { ...ratings, [item.id]: option.value }; setRatings(next); saveIrodoriSelfEvaluation("starter-16", next); }} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors " + (ratings[item.id] === option.value ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]" : "border-white/[0.08] bg-[#24221F] text-[#A3A099]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {isCompleted ? <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/>Pelajaran selesai</span> : <button type="button" onClick={() => completeIrodoriLesson("starter-16")} disabled={!quizSubmitted || !practiceIsCorrect || !activitiesComplete || !canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#C93438] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/>Tandai pelajaran selesai</button>}
          <Link href="/irodori/starter" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
        </div>
        {(!quizSubmitted || !practiceIsCorrect || !activitiesComplete || !canDosRated) && <p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian target komunikasi.</p>}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, nama toko, harga, barang, dan tanda diskon disusun orisinal oleh Fude. Semua contoh transaksi bersifat fiktif.</p>
    </main>
  );
}
