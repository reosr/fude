"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Layers,
  MessageCircle,
  RefreshCw,
  ShoppingBag,
  Signpost,
  Store,
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

const storeConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>すみません。<ruby>電池<rt>でんち</rt></ruby>がほしいんですが、どこで<ruby>買<rt>か</rt></ruby>えますか？</>,
    romaji: "Sumimasen. Denchi ga hoshii n desu ga, doko de kaemasu ka?",
    translation: "Permisi. Saya membutuhkan baterai. Di mana saya bisa membelinya?",
    audioFileName: "irodori-starter-15-a01-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>コンビニで<ruby>買<rt>か</rt></ruby>えますよ。100<ruby>円<rt>えん</rt></ruby>ショップにもあります。</>,
    romaji: "Konbini de kaemasu yo. Hyaku-en shoppu ni mo arimasu.",
    translation: "Bisa dibeli di minimarket. Ada juga di toko 100 yen.",
    audioFileName: "irodori-starter-15-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>そうですか。ありがとうございます。</>,
    romaji: "Sou desu ka. Arigatou gozaimasu.",
    translation: "Begitu, ya. Terima kasih.",
    audioFileName: "irodori-starter-15-a01-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>どういたしまして。</>,
    romaji: "Dou itashimashite.",
    translation: "Sama-sama.",
    audioFileName: "irodori-starter-15-a01-l04.mp3",
  },
];

const floorGuideConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>このフロアガイドを<ruby>見<rt>み</rt></ruby>てください。ノートは<ruby>何階<rt>なんがい</rt></ruby>ですか？</>,
    romaji: "Kono furoa gaido o mite kudasai. Nooto wa nangai desu ka?",
    translation: "Tolong lihat panduan lantai ini. Buku catatan ada di lantai berapa?",
    audioFileName: "irodori-starter-15-a02-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>3<ruby>階<rt>がい</rt></ruby>です。<ruby>文房具<rt>ぶんぼうぐ</rt></ruby>の<ruby>売<rt>う</rt></ruby>り<ruby>場<rt>ば</rt></ruby>にありますよ。</>,
    romaji: "Sangai desu. Bunbougu no uriba ni arimasu yo.",
    translation: "Di lantai tiga. Ada di bagian alat tulis.",
    audioFileName: "irodori-starter-15-a02-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>じゃあ、<ruby>電池<rt>でんち</rt></ruby>は<ruby>何階<rt>なんがい</rt></ruby>ですか？</>,
    romaji: "Jaa, denchi wa nangai desu ka?",
    translation: "Kalau begitu, baterai ada di lantai berapa?",
    audioFileName: "irodori-starter-15-a02-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>4<ruby>階<rt>かい</rt></ruby>です。<ruby>家電<rt>かでん</rt></ruby>のフロアです。</>,
    romaji: "Yonkai desu. Kaden no furoa desu.",
    translation: "Di lantai empat, di bagian elektronik rumah tangga.",
    audioFileName: "irodori-starter-15-a02-l04.mp3",
  },
];

const staffConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>すみません。かさがほしいんですが、どこにありますか？</>,
    romaji: "Sumimasen. Kasa ga hoshii n desu ga, doko ni arimasu ka?",
    translation: "Permisi, saya mau membeli payung. Ada di mana?",
    audioFileName: "irodori-starter-15-a03-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>2<ruby>階<rt>かい</rt></ruby>でございます。</>,
    romaji: "Nikai de gozaimasu.",
    translation: "Ada di lantai dua.",
    audioFileName: "irodori-starter-15-a03-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ありがとうございます。</>,
    romaji: "Arigatou gozaimasu.",
    translation: "Terima kasih.",
    audioFileName: "irodori-starter-15-a03-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>こちらです。ご<ruby>案内<rt>あんない</rt></ruby>します。</>,
    romaji: "Kochira desu. Go-annai shimasu.",
    translation: "Lewat sini. Saya akan mengantarkan Anda.",
    audioFileName: "irodori-starter-15-a03-l04.mp3",
  },
];

const productConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>ねえ、<ruby>見<rt>み</rt></ruby>て。このバッグ。</>,
    romaji: "Nee, mite. Kono baggu.",
    translation: "Hei, lihat tas ini.",
    audioFileName: "irodori-starter-15-a04-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>わあ、かっこいいですね。</>,
    romaji: "Waa, kakkoii desu ne.",
    translation: "Wah, keren, ya.",
    audioFileName: "irodori-starter-15-a04-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>それに、<ruby>軽<rt>かる</rt></ruby>いですね。</>,
    romaji: "Sore ni, karui desu ne.",
    translation: "Tasnya juga ringan, ya.",
    audioFileName: "irodori-starter-15-a04-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>ほんとう！でも、ちょっと<ruby>高<rt>たか</rt></ruby>いですね。</>,
    romaji: "Hontou! Demo, chotto takai desu ne.",
    translation: "Iya juga! Tapi agak mahal, ya.",
    audioFileName: "irodori-starter-15-a04-l04.mp3",
  },
];

const signConversation: IrodoriUtterance[] = [
  {
    speakerId: "kenji",
    japanese: <>お<ruby>客様<rt>きゃくさま</rt></ruby><ruby>入口<rt>いりぐち</rt></ruby>は、あちらです。</>,
    romaji: "Okyakusama iriguchi wa, achira desu.",
    translation: "Pintu masuk pengunjung ada di sebelah sana.",
    audioFileName: "irodori-starter-15-a05-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ドアは、どうしますか？</>,
    romaji: "Doa wa, dou shimasu ka?",
    translation: "Bagaimana cara membuka pintunya?",
    audioFileName: "irodori-starter-15-a05-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>「<ruby>押<rt>お</rt></ruby>す」と<ruby>書<rt>か</rt></ruby>いてあります。<ruby>押<rt>お</rt></ruby>してください。</>,
    romaji: "\"Osu\" to kaite arimasu. Oshite kudasai.",
    translation: "Tertulis \"DORONG\". Silakan dorong.",
    audioFileName: "irodori-starter-15-a05-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>わかりました。ありがとうございます。</>,
    romaji: "Wakarimashita. Arigatou gozaimasu.",
    translation: "Baik, saya mengerti. Terima kasih.",
    audioFileName: "irodori-starter-15-a05-l04.mp3",
  },
];

const canDos = [
  { id: "ask-where-to-buy", text: "Menanyakan kepada orang lain di mana bisa membeli barang yang dibutuhkan dan memahami jawabannya." },
  { id: "read-floor-guide", text: "Membaca panduan lantai toko untuk menemukan bagian tempat barang yang dicari." },
  { id: "ask-store-staff", text: "Menanyakan lokasi barang kepada staf pusat perbelanjaan dan memahami petunjuknya." },
  { id: "comment-on-products", text: "Bertukar komentar sederhana tentang produk saat berbelanja bersama teman." },
  { id: "understand-store-signs", text: "Memahami arti papan tanda yang umum ditemui di department store atau pusat perbelanjaan." },
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
    prompt: <>Ungkapan untuk bertanya di mana bisa membeli baterai adalah …</>,
    options: [
      { key: "a", label: <>電池がほしいんですが、どこで買えますか？</> },
      { key: "b", label: <>電池は何階ですか？</> },
      { key: "c", label: <>電池はかっこいいですね。</> },
    ],
    answer: "a",
    explanation: <>「<ruby>電池<rt>でんち</rt></ruby>がほしいんですが、どこで<ruby>買<rt>か</rt></ruby>えますか？」 digunakan untuk menyampaikan kebutuhan dan menanyakan tempat membeli barang.</>,
  },
  {
    prompt: <>Jika panduan lantai menunjukkan buku dan alat tulis di lantai 3, ke lantai berapa kamu pergi untuk mencari buku catatan?</>,
    options: [
      { key: "a", label: "1階（いっかい）" },
      { key: "b", label: "3階（さんがい）" },
      { key: "c", label: "4階（よんかい）" },
    ],
    answer: "b",
    explanation: <>Untuk lantai tiga, bacaannya adalah 「さんがい」 atau 「さんかい」. Pada panduan ini, alat tulis berada di lantai tiga.</>,
  },
  {
    prompt: <>Staf toko menjawab 「2階でございます」. Apa artinya?</>,
    options: [
      { key: "a", label: "Ada di lantai dua." },
      { key: "b", label: "Harganya dua yen." },
      { key: "c", label: "Toko tutup pukul dua." },
    ],
    answer: "a",
    explanation: <>「でございます」 adalah bentuk sopan dari 「です」. 「2<ruby>階<rt>かい</rt></ruby>でございます」 berarti ada di lantai dua.</>,
  },
  {
    prompt: <>Pilih komentar yang berarti tasnya keren.</>,
    options: [
      { key: "a", label: "このバッグ、かわいいですね。" },
      { key: "b", label: "このバッグ、かっこいいですね。" },
      { key: "c", label: "このバッグ、高いですね。" },
    ],
    answer: "b",
    explanation: <>「かっこいい」 berarti keren atau terlihat bagus. 「かわいい」 berarti imut, sedangkan 「<ruby>高<rt>たか</rt></ruby>い」 berarti mahal atau tinggi.</>,
  },
  {
    prompt: <>Apa arti tanda 「引く」 pada pintu?</>,
    options: [
      { key: "a", label: "Dorong" },
      { key: "b", label: "Tarik" },
      { key: "c", label: "Keluar" },
    ],
    answer: "b",
    explanation: <>「<ruby>引<rt>ひ</rt></ruby>く」 berarti tarik. Pasangannya adalah 「<ruby>押<rt>お</rt></ruby>す」 yang berarti dorong.</>,
  },
  {
    prompt: <>Tanda 「非常口」 menunjukkan …</>,
    options: [
      { key: "a", label: "Pintu keluar darurat" },
      { key: "b", label: "Pintu masuk pengunjung" },
      { key: "c", label: "Toilet" },
    ],
    answer: "a",
    explanation: <>「<ruby>非常口<rt>ひじょうぐち</rt></ruby>」 berarti pintu keluar darurat.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Dalam pola 「Nがほしいんですが」, partikel apa yang menandai barang yang diinginkan?</>,
    options: [
      { key: "a", label: "が" },
      { key: "b", label: "を" },
      { key: "c", label: "で" },
    ],
    answer: "a",
    explanation: <>Barang yang diinginkan memakai partikel が, misalnya 「<ruby>電池<rt>でんち</rt></ruby>がほしいんですが」.</>,
  },
  {
    prompt: <>Pertanyaan 「どこで買えますか？」 digunakan untuk menanyakan …</>,
    options: [
      { key: "a", label: "Di mana barang bisa dibeli?" },
      { key: "b", label: "Berapa harga barang?" },
      { key: "c", label: "Barang itu milik siapa?" },
    ],
    answer: "a",
    explanation: <>「どこで<ruby>買<rt>か</rt></ruby>えますか」 adalah ungkapan untuk menanyakan tempat membeli barang.</>,
  },
  {
    prompt: <>Bacaan yang benar untuk 「1階」 adalah …</>,
    options: [
      { key: "a", label: "いちかい" },
      { key: "b", label: "いっかい" },
      { key: "c", label: "ひとかい" },
    ],
    answer: "b",
    explanation: <>1階 memiliki bacaan khusus 「いっかい」.</>,
  },
  {
    prompt: <>Bacaan yang benar untuk 「6階」 adalah …</>,
    options: [
      { key: "a", label: "ろくかい" },
      { key: "b", label: "ろっかい" },
      { key: "c", label: "むっかい" },
    ],
    answer: "b",
    explanation: <>6階 dibaca 「ろっかい」.</>,
  },
  {
    prompt: <>Kalimat yang tepat untuk bertanya lantai tempat kamera berada adalah …</>,
    options: [
      { key: "a", label: <>カメラは<ruby>何階<rt>なんがい</rt></ruby>ですか？</> },
      { key: "b", label: <>カメラは<ruby>何時<rt>なんじ</rt></ruby>ですか？</> },
      { key: "c", label: <>カメラは<ruby>何人<rt>なんにん</rt></ruby>ですか？</> },
    ],
    answer: "a",
    explanation: <>「<ruby>何階<rt>なんがい</rt></ruby>ですか？」 menanyakan suatu barang berada di lantai berapa.</>,
  },
  {
    prompt: <>Manakah bentuk sopan yang dapat digunakan staf toko untuk mengatakan “Ada di lantai empat”?</>,
    options: [
      { key: "a", label: "4階でございます。" },
      { key: "b", label: "4階がほしいです。" },
      { key: "c", label: "4階を買います。" },
    ],
    answer: "a",
    explanation: <>「でございます」 merupakan bentuk yang lebih sopan dari 「です」.</>,
  },
  {
    prompt: <>Pilih bentuk kata sifat -na yang benar untuk menyampaikan kesan tentang toko yang indah.</>,
    options: [
      { key: "a", label: "きれいな店ですね。" },
      { key: "b", label: "きれいい店ですね。" },
      { key: "c", label: "きれいく店ですね。" },
    ],
    answer: "a",
    explanation: <>kata sifat -na memakai な sebelum kata benda: きれいな<ruby>店<rt>みせ</rt></ruby>.</>,
  },
  {
    prompt: <>Kalimat 「このバッグ、安いですね」 berarti …</>,
    options: [
      { key: "a", label: "Tas ini mahal, ya." },
      { key: "b", label: "Tas ini murah, ya." },
      { key: "c", label: "Tas ini besar, ya." },
    ],
    answer: "b",
    explanation: <>「<ruby>安<rt>やす</rt></ruby>い」 berarti murah. Lawan katanya adalah 「<ruby>高<rt>たか</rt></ruby>い」 untuk mahal.</>,
  },
  {
    prompt: <>Tanda 「入口」 dan 「出口」 berarti …</>,
    options: [
      { key: "a", label: "Pintu masuk dan pintu keluar" },
      { key: "b", label: "Dorong dan tarik" },
      { key: "c", label: "Naik dan turun" },
    ],
    answer: "a",
    explanation: <>「<ruby>入口<rt>いりぐち</rt></ruby>」 berarti pintu masuk dan 「<ruby>出口<rt>でぐち</rt></ruby>」 berarti pintu keluar.</>,
  },
  {
    prompt: <>Apa arti 「上りエスカレーター」?</>,
    options: [
      { key: "a", label: "Eskalator turun" },
      { key: "b", label: "Eskalator naik" },
      { key: "c", label: "Lift" },
    ],
    answer: "b",
    explanation: <>「<ruby>上<rt>のぼ</rt></ruby>り」 berarti naik atau arah ke atas. 「<ruby>下<rt>くだ</rt></ruby>り」 berarti turun atau arah ke bawah.</>,
  },
];

const storeTypes = [
  ["コンビニ", "konbini", "Minimarket"],
  ["スーパー", "suupaa", "Supermarket"],
  ["100円ショップ", "hyaku-en shoppu", "Toko serba 100 yen"],
  ["ホームセンター", "hoomu sentaa", "Toko perlengkapan rumah"],
  ["文房具店", "ぶんぼうぐてん · bunbougu-ten", "Toko alat tulis"],
  ["家電量販店", "かでんりょうはんてん · kaden ryouhanten", "Toko elektronik"],
  ["デパート", "depaato", "Department store"],
  ["ショッピングセンター", "shoppingu sentaa", "Pusat perbelanjaan"],
];

const itemWords = [
  ["電池", "でんち · denchi", "Baterai"],
  ["ノート", "nooto", "Buku catatan"],
  ["ボールペン", "boorupen", "Pulpen"],
  ["傘", "かさ · kasa", "Payung"],
  ["お弁当箱", "おべんとうばこ · obentoubako", "Kotak bekal"],
  ["懐中電灯", "かいちゅうでんとう · kaichuu dentou", "Senter"],
  ["延長コード", "えんちょうコード · enchou koodo", "Kabel ekstensi"],
  ["洗濯ばさみ", "せんたくばさみ · sentakubasami", "Jepitan jemuran"],
  ["くつ下", "くつした · kutsushita", "Kaos kaki"],
  ["バッグ", "baggu", "Tas"],
  ["帽子", "ぼうし · boushi", "Topi"],
  ["文房具", "ぶんぼうぐ · bunbougu", "Alat tulis"],
];

const floorGuide = [
  {
    floor: "Lantai 4",
    reading: "よんかい · yonkai",
    name: "家電・生活用品",
    meaning: "Elektronik rumah tangga dan perlengkapan sehari-hari",
    items: "電池・懐中電灯・延長コード・お弁当箱",
  },
  {
    floor: "Lantai 3",
    reading: "さんがい · sangai",
    name: "本・文房具・ホビー",
    meaning: "Buku, alat tulis, dan hobi",
    items: "ノート・ボールペン・本・おもちゃ",
  },
  {
    floor: "Lantai 2",
    reading: "にかい · nikai",
    name: "ファッション",
    meaning: "Pakaian dan aksesori",
    items: "傘・バッグ・帽子・くつ下",
  },
  {
    floor: "Lantai 1",
    reading: "いっかい · ikkai",
    name: "食品・サービス",
    meaning: "Makanan dan layanan",
    items: "食品・サービスカウンター",
  },
];

const productWords = [
  ["かっこいい", "kakkoii", "Keren"],
  ["かわいい", "kawaii", "Imut"],
  ["おもしろい", "omoshiroi", "Menarik / unik"],
  ["きれい（な）", "kirei (na)", "Indah / bersih"],
  ["すてき（な）", "suteki (na)", "Bagus / menawan"],
  ["おしゃれ（な）", "oshare (na)", "Modis"],
  ["安い", "やすい · yasui", "Murah"],
  ["高い", "たかい · takai", "Mahal / tinggi"],
  ["軽い", "かるい · karui", "Ringan"],
  ["便利（な）", "べんり（な） · benri (na)", "Praktis"],
];

const signWords = [
  ["入口", "いりぐち · iriguchi", "Pintu masuk"],
  ["出口", "でぐち · deguchi", "Pintu keluar"],
  ["お客様入口", "おきゃくさまいりぐち · okyakusama iriguchi", "Pintu masuk pengunjung"],
  ["化粧室", "けしょうしつ · keshoushitsu", "Toilet"],
  ["非常口", "ひじょうぐち · hijouguchi", "Pintu keluar darurat"],
  ["押す", "おす · osu", "Dorong"],
  ["引く", "ひく · hiku", "Tarik"],
  ["開く", "ひらく · hiraku", "Buka"],
  ["閉じる", "とじる · tojiru", "Tutup"],
  ["上り", "のぼり · nobori", "Naik"],
  ["下り", "くだり · kudari", "Turun"],
];

export default function IrodoriPemulaLessonFifteenPage() {
  const progress = useIrodoriProgress();
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [storeChoice, setStoreChoice] = useState("");
  const [storeSubmitted, setStoreSubmitted] = useState(false);
  const [floorChoice, setFloorChoice] = useState("");
  const [floorSubmitted, setFloorSubmitted] = useState(false);
  const [staffChoice, setStaffChoice] = useState("");
  const [staffSubmitted, setStaffSubmitted] = useState(false);
  const [commentChoice, setCommentChoice] = useState("");
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [signChoice, setSignChoice] = useState("");
  const [signSubmitted, setSignSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const isCompleted = progress.completedLessons.includes("starter-15");
  const practiceScore = practiceTasks.filter((task, index) => practiceAnswers[index] === task.answer).length;
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;
  const score = quizQuestions.filter((question, index) => answers[index] === question.answer).length;
  const storeIsCorrect = storeSubmitted && storeChoice === "convenience";
  const floorIsCorrect = floorSubmitted && floorChoice === "third";
  const staffIsCorrect = staffSubmitted && staffChoice === "ask-floor";
  const commentIsCorrect = commentSubmitted && commentChoice === "cool";
  const signIsCorrect = signSubmitted && signChoice === "pull";
  const activitiesComplete = storeIsCorrect && floorIsCorrect && staffIsCorrect && commentIsCorrect && signIsCorrect;
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
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D6AD4F]/[0.07]">店</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">IRODORI • PEMULA A1 • PELAJARAN 15</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya perlu baterai.</h1>
          <p className="mt-2 text-sm font-semibold text-[#D9B66D]"><ruby>電池<rt>でんち</rt></ruby>がほしいんですが…</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Belajar menanyakan tempat membeli barang, membaca panduan lantai, mencari barang dengan bantuan staf, menyampaikan komentar tentang produk, dan memahami papan tanda di pusat perbelanjaan.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Store size={14} className="text-[#D6AD4F]" />Jenis toko</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Layers size={14} className="text-[#D6AD4F]" />Panduan lantai</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><MessageCircle size={14} className="text-[#D6AD4F]" />Komentar produk</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Signpost size={14} className="text-[#D6AD4F]" />Papan tanda</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#B8860B]/20 bg-[#1B1917]/80 p-4 md:p-5">
        <div className="flex items-center gap-2"><ShoppingBag size={16} className="text-[#D9B66D]" /><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2></div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">TARGET KOMUNIKASI 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA 01</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Jenis toko</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Nama tempat yang biasa dikunjungi untuk mencari kebutuhan sehari-hari.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {storeTypes.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dengarkan dan pahami percakapan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Dialog orisinal Fude dengan furigana pada kanji. Perhatikan cara menyampaikan kebutuhan, bertanya kepada staf, dan memberi komentar.</p></div>
        <div className="space-y-4">
          <IrodoriConversation title="Menanyakan tempat membeli barang" speakers={[speakers.yui, speakers.kenji]} utterances={storeConversation} />
          <IrodoriConversation title="Membaca panduan lantai" speakers={[speakers.sota, speakers.yui]} utterances={floorGuideConversation} />
          <IrodoriConversation title="Bertanya kepada staf toko" speakers={[speakers.akiko, speakers.kenji]} utterances={staffConversation} />
          <IrodoriConversation title="Bertukar komentar tentang produk" speakers={[speakers.yui, speakers.sota]} utterances={productConversation} />
          <IrodoriConversation title="Memahami tanda di pusat perbelanjaan" speakers={[speakers.kenji, speakers.akiko]} utterances={signConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA 02</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Barang yang dicari</h2></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {itemWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">PANDUAN LANTAI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Cari bagian yang tepat</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Panduan pusat belanja fiktif ini menunjukkan barang yang tersedia di setiap lantai.</p></div>
        <div className="space-y-2">
          {floorGuide.map((floor) => (
            <article key={floor.floor} className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3 sm:flex-row sm:items-center">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-[#D6AD4F]/25 bg-[#D6AD4F]/10 font-mincho text-xl font-bold text-[#E7D2A1]">{floor.floor}</div>
              <div className="min-w-0 flex-1">
                <JapaneseReading allowIndexFallback translation={floor.meaning} contentClassName="font-mincho text-base font-bold leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-5 text-[#A9A398]">{floor.name}</JapaneseReading>
                <JapaneseReading allowIndexFallback contentClassName="mt-2 font-mincho text-xs leading-6 text-[#CFC8BA]" kanaClassName="mt-1 font-mincho text-xs text-[#D6AD4F]" romajiClassName="mt-1 text-[10px] italic text-[#D9B66D]">{floor.items}</JapaneseReading>
              </div>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/20 bg-[#211E1A] p-3">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">CARA MEMBACA ～階</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              ["1階", "いっかい"],
              ["2階", "にかい"],
              ["3階", "さんがい"],
              ["4階", "よんかい"],
              ["5階", "ごかい"],
              ["6階", "ろっかい"],
              ["7階", "ななかい"],
              ["8階", "はっかい"],
              ["9階", "きゅうかい"],
              ["10階", "じゅっかい"],
            ].map(([jp, reading]) => (
              <div key={jp} className="rounded-lg border border-white/[0.06] bg-black/15 p-2 text-center">
                <JapaneseVocabularyReading reading={reading} contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]">{jp}</JapaneseVocabularyReading>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[9px] leading-5 text-[#8F897F]">3階 juga dapat dibaca さんかい, 8階 dapat dibaca はちかい, dan 10階 dapat dibaca じっかい. Untuk latihan ini gunakan bacaan yang ditampilkan di kartu.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA 03</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Memberi komentar tentang produk</h2></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {productWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menyatakan keinginan dan komentar</h2></div>
        {[
          {
            title: "01 · Menyatakan barang yang diinginkan",
            pattern: "N が ほしいんですが…",
            example: <><ruby>電池<rt>でんち</rt></ruby>がほしいんですが…。</>,
            note: "ほしい berarti ingin atau membutuhkan sesuatu. Barang yang diinginkan memakai partikel が. Akhiran んですが menjelaskan keadaan kita dan membuka percakapan untuk meminta bantuan atau saran.",
          },
          {
            title: "02 · Menanyakan tempat membeli",
            pattern: "どこで買えますか？",
            example: <>ノートはどこで<ruby>買<rt>か</rt></ruby>えますか？</>,
            note: "Gunakan どこで買えますか untuk menanyakan di mana barang dapat dibeli. Pada tingkat ini, hafalkan 買えます sebagai satu ungkapan praktis; bentuk potensialnya dipelajari lebih lanjut pada tahap berikutnya.",
          },
          {
            title: "03 · Menanyakan lokasi barang di toko",
            pattern: "N は どこですか？ ／ N は どこにありますか？ ／ N は 何階ですか？",
            example: <>カメラは<ruby>何階<rt>なんがい</rt></ruby>ですか？ ／ スマホケースはどこにありますか？</>,
            note: "Pilih pertanyaan sesuai informasi yang diperlukan: tempat secara umum, lokasi barang, atau lantai tempat barang dijual. Staf dapat menjawab secara sopan dengan 2階でございます atau ご案内します.",
          },
          {
            title: "04 · Memberi komentar dengan kata sifat",
            pattern: "ナA-ですね ／ イA-いですね ／ ナA！ ／ イA-い！",
            example: <>このバッグ、かっこいいですね。／ この<ruby>店<rt>みせ</rt></ruby>、きれいですね。／ かわいい！</>,
            note: "kata sifat -i memakai bentuk い sebelum ですね, misalnya 安いですね. kata sifat -na memakai な sebelum kata benda, misalnya きれいな店. Saat berkomentar singkat, bentuk ですね dapat dihilangkan: かわいい！ atau すてき！.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-sm font-bold tracking-[0.02em] text-[#B8860B]">{item.title}</p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#D9B66D]"><JapaneseReading allowIndexFallback romajiClassName="mt-1 text-sm italic text-[#D9B66D]">{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">PAPAN TANDA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali tanda di pusat perbelanjaan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Tanda-tanda umum ini membantu pengunjung menemukan fasilitas dan memahami petunjuk pintu.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {signWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["入口", "↘", "Masuk"],
            ["出口", "↗", "Keluar"],
            ["押す", "→", "Dorong"],
            ["引く", "←", "Tarik"],
            ["開く", "＋", "Buka"],
            ["閉じる", "－", "Tutup"],
            ["上り", "↑", "Naik"],
            ["下り", "↓", "Turun"],
          ].map(([jp, symbol, meaning]) => (
            <article key={jp} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#27231D] p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#D6AD4F]/10 text-lg font-bold text-[#D9B66D]">{symbol}</span>
              <div><p className="font-mincho text-sm text-[#F1EBDD]">{jp}</p><p className="text-[9px] text-[#A9A398]">{meaning}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 01 · MENANYAKAN TEMPAT MEMBELI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Cari baterai</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kamu sedang berada di lingkungan pusat kota. Papan informasi dua toko menunjukkan ketersediaan baterai.</p></div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-[#D6AD4F]/25 bg-[#27231D] p-3"><p className="text-xs font-bold text-[#F1EBDD]">さくらコンビニ</p><p className="mt-2 text-sm text-[#D9B66D]">電池 · tersedia</p><p className="text-[9px] text-[#A9A398]">Baterai tersedia di minimarket.</p></div>
          <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3"><p className="text-xs font-bold text-[#F1EBDD]">みどり文房具店</p><p className="mt-2 text-sm text-[#A9A398]">ノート・ペン</p><p className="text-[9px] text-[#8F897F]">Buku catatan dan pulpen.</p></div>
        </div>
        <p className="text-xs font-semibold text-[#EAE6DD]">Toko mana yang dapat kamu pilih untuk membeli baterai?</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { key: "convenience", label: "さくらコンビニ", meaning: "Minimarket · tersedia baterai" },
            { key: "stationery", label: "みどり文房具店", meaning: "Toko alat tulis · buku dan pulpen" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={storeSubmitted} aria-pressed={storeChoice === item.key} onClick={() => setStoreChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (storeSubmitted && item.key === "convenience" ? "border-emerald-500/50 bg-emerald-500/10" : storeSubmitted && storeChoice === item.key ? "border-red-400/50 bg-red-400/10" : storeChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback translation={item.meaning} contentClassName="text-sm font-bold leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-4 text-[#A9A398]">{item.label}</JapaneseReading>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{storeSubmitted ? storeIsCorrect ? "Benar. Baterai tersedia di Sakura Konbini." : "Belum tepat. Periksa barang yang tersedia di setiap toko." : "Pilih salah satu toko."}</p>
          {storeSubmitted ? <button type="button" onClick={() => { setStoreChoice(""); setStoreSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!storeChoice} onClick={() => setStoreSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa toko</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 02 · PANDUAN LANTAI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Temukan buku catatan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan panduan lantai di atas. Kamu ingin membeli ノート (buku catatan).</p></div>
        <div className="rounded-xl border border-white/[0.06] bg-black/15 p-4">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">ITEM YANG DICARI</p>
          <p className="mt-2 font-mincho text-2xl text-[#F1EBDD]">ノート</p>
          <p className="mt-1 text-xs text-[#A9A398]">Buku catatan · bagian buku dan alat tulis</p>
        </div>
        <p className="text-xs font-semibold text-[#EAE6DD]">Kartu lantai mana yang harus kamu tuju?</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { key: "first", label: "1F", detail: "食品・サービス" },
            { key: "second", label: "2F", detail: "ファッション" },
            { key: "third", label: "3F", detail: "本・文房具・ホビー" },
            { key: "fourth", label: "4F", detail: "家電・生活用品" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={floorSubmitted} aria-pressed={floorChoice === item.key} onClick={() => setFloorChoice(item.key)} className={"rounded-xl border p-3 text-center transition-colors " + (floorSubmitted && item.key === "third" ? "border-emerald-500/50 bg-emerald-500/10" : floorSubmitted && floorChoice === item.key ? "border-red-400/50 bg-red-400/10" : floorChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <p className="font-mincho text-xl font-bold text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-[9px] text-[#A9A398]">{item.detail}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{floorSubmitted ? floorIsCorrect ? "Benar. Buku catatan ada di lantai tiga." : "Belum tepat. Cari 文房具 di panduan lantai." : "Pilih lantai."}</p>
          {floorSubmitted ? <button type="button" onClick={() => { setFloorChoice(""); setFloorSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!floorChoice} onClick={() => setFloorSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa lantai</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 03 · BERTANYA KEPADA STAF</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tanyakan lokasi kamera</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kamu berada di toko elektronik dan ingin mencari kamera. Pilih pertanyaan yang paling tepat kepada staf.</p></div>
        <div className="rounded-xl border border-[#D6AD4F]/20 bg-[#27231D] p-4">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">TOKO ELEKTRONIK · PANDUAN LANTAI</p>
          <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">カメラ · 4階</p>
          <p className="mt-1 text-xs text-[#A9A398]">Kamera · lantai empat</p>
        </div>
        <div className="grid gap-2">
          {[
            { key: "ask-time", label: "カメラは何時ですか？", meaning: "Kamera pukul berapa?" },
            { key: "ask-floor", label: "すみません。カメラは何階ですか？", meaning: "Permisi. Kamera ada di lantai berapa?" },
            { key: "ask-price", label: "カメラは何人ですか？", meaning: "Kamera berapa orang?" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={staffSubmitted} aria-pressed={staffChoice === item.key} onClick={() => setStaffChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (staffSubmitted && item.key === "ask-floor" ? "border-emerald-500/50 bg-emerald-500/10" : staffSubmitted && staffChoice === item.key ? "border-red-400/50 bg-red-400/10" : staffChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <p className="font-mincho text-sm text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{staffSubmitted ? staffIsCorrect ? "Benar. 何階ですか menanyakan lantai." : "Belum tepat. 何階 menanyakan lantai, bukan waktu atau jumlah orang." : "Pilih pertanyaan kepada staf."}</p>
          {staffSubmitted ? <button type="button" onClick={() => { setStaffChoice(""); setStaffSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!staffChoice} onClick={() => setStaffSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa pertanyaan</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 04 · KOMENTAR PRODUK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih komentar yang sesuai</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Temanmu menunjukkan tas dengan desain keren. Pilih komentar sederhana yang cocok.</p></div>
        <div className="rounded-xl border border-[#D6AD4F]/20 bg-[#27231D] p-4 text-center">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">PRODUK</p>
          <div className="mx-auto mt-3 flex size-20 items-center justify-center rounded-2xl border border-[#D6AD4F]/20 bg-[#D6AD4F]/10"><ShoppingBag size={34} className="text-[#E7D2A1]"/></div>
          <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">かっこいいバッグ</p>
          <p className="mt-1 text-xs text-[#A9A398]">Tas dengan desain keren</p>
        </div>
        <div className="grid gap-2">
          {[
            { key: "cute", label: "このバッグ、かわいいですね。", meaning: "Tas ini imut, ya." },
            { key: "cool", label: "このバッグ、かっこいいですね。", meaning: "Tas ini keren, ya." },
            { key: "expensive", label: "このバッグ、高いですね。", meaning: "Tas ini mahal, ya." },
          ].map((item) => (
            <button key={item.key} type="button" disabled={commentSubmitted} aria-pressed={commentChoice === item.key} onClick={() => setCommentChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (commentSubmitted && item.key === "cool" ? "border-emerald-500/50 bg-emerald-500/10" : commentSubmitted && commentChoice === item.key ? "border-red-400/50 bg-red-400/10" : commentChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <p className="font-mincho text-sm text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{commentSubmitted ? commentIsCorrect ? "Benar. かっこいい menyatakan kesan keren." : "Belum tepat. Pilih komentar yang sesuai dengan desain produk." : "Pilih satu komentar."}</p>
          {commentSubmitted ? <button type="button" onClick={() => { setCommentChoice(""); setCommentSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!commentChoice} onClick={() => setCommentSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa komentar</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 05 · MEMAHAMI PAPAN TANDA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih tanda pada pintu</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kamu melihat tulisan PULL pada pintu. Pilih tanda Jepang yang memiliki arti sama.</p></div>
        <div className="rounded-xl border border-white/[0.07] bg-black/15 p-4 text-center">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">TANDA PADA PINTU</p>
          <p className="mt-2 text-3xl font-black tracking-[0.18em] text-[#F1EBDD]">PULL</p>
          <p className="mt-1 text-[10px] text-[#A9A398]">Tarik</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { key: "push", label: "押す", meaning: "Dorong" },
            { key: "pull", label: "引く", meaning: "Tarik" },
            { key: "entrance", label: "入口", meaning: "Pintu masuk" },
            { key: "exit", label: "出口", meaning: "Pintu keluar" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={signSubmitted} aria-pressed={signChoice === item.key} onClick={() => setSignChoice(item.key)} className={"rounded-xl border p-3 text-center transition-colors " + (signSubmitted && item.key === "pull" ? "border-emerald-500/50 bg-emerald-500/10" : signSubmitted && signChoice === item.key ? "border-red-400/50 bg-red-400/10" : signChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <p className="font-mincho text-xl font-bold text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{signSubmitted ? signIsCorrect ? "Benar. 引く berarti tarik. 押す berarti dorong." : "Belum tepat. Bedakan 押す (dorong) dan 引く (tarik)." : "Pilih tanda yang tepat."}</p>
          {signSubmitted ? <button type="button" onClick={() => { setSignChoice(""); setSignSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!signChoice} onClick={() => setSignSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa tanda</button>}
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
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {task.options.map((option) => (
                    <button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected === option.key} onClick={() => setPracticeAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (practiceSubmitted && option.key === task.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : practiceSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>
                  ))}
                </div>
                {practiceSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.explanation}</JapaneseReading></p>}
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
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.prompt}</JapaneseReading></h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {question.options.map((option) => (
                    <button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected === option.key} onClick={() => setAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (quizSubmitted && option.key === question.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : quizSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>
                  ))}
                </div>
                {quizSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.explanation}</JapaneseReading></p>}
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
                  <button key={option.value} type="button" aria-pressed={ratings[item.id] === option.value} onClick={() => { const next = { ...ratings, [item.id]: option.value }; setRatings(next); saveIrodoriSelfEvaluation("starter-15", next); }} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors " + (ratings[item.id] === option.value ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]" : "border-white/[0.08] bg-[#24221F] text-[#A3A099]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {isCompleted ? <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/>Pelajaran selesai</span> : <button type="button" onClick={() => completeIrodoriLesson("starter-15")} disabled={!quizSubmitted || !practiceIsCorrect || !activitiesComplete || !canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#C93438] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/>Tandai pelajaran selesai</button>}
          <Link href="/irodori/starter" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
        </div>
        {(!quizSubmitted || !practiceIsCorrect || !activitiesComplete || !canDosRated) && <p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian target komunikasi.</p>}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, nama toko, dan panduan lantai disusun orisinal oleh Fude. Seluruh tempat dan situasi latihan bersifat fiktif.</p>
    </main>
  );
}
