"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  RefreshCw,
  Star,
  Ticket,
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

const weekendConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>ケンジさん、<ruby>週末<rt>しゅうまつ</rt></ruby>は<ruby>何<rt>なに</rt></ruby>をしましたか？</>,
    romaji: "Kenji-san, shuumatsu wa nani o shimashita ka?",
    translation: "Kenji, apa yang kamu lakukan akhir pekan kemarin?",
    audioFileName: "irodori-starter-17-a01-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <><ruby>友<rt>とも</rt></ruby>だちと<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>ました。</>,
    romaji: "Tomodachi to eiga o mimashita.",
    translation: "Saya menonton film bersama teman.",
    audioFileName: "irodori-starter-17-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>そうですか。<ruby>日曜日<rt>にちようび</rt></ruby>は？</>,
    romaji: "Sou desu ka. Nichiyoubi wa?",
    translation: "Oh begitu. Kalau hari Minggu?",
    audioFileName: "irodori-starter-17-a01-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <><ruby>家<rt>いえ</rt></ruby>でゆっくりしました。</>,
    romaji: "Ie de yukkuri shimashita.",
    translation: "Saya bersantai di rumah.",
    audioFileName: "irodori-starter-17-a01-l04.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>いい<ruby>週末<rt>しゅうまつ</rt></ruby>でしたね。</>,
    romaji: "Ii shuumatsu deshita ne.",
    translation: "Akhir pekan yang menyenangkan, ya.",
    audioFileName: "irodori-starter-17-a01-l05.mp3",
  },
];

const impressionConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <><ruby>映画<rt>えいが</rt></ruby>はどうでしたか？</>,
    romaji: "Eiga wa dou deshita ka?",
    translation: "Bagaimana filmnya?",
    audioFileName: "irodori-starter-17-a02-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>とてもおもしろかったです。</>,
    romaji: "Totemo omoshirokatta desu.",
    translation: "Seru sekali.",
    audioFileName: "irodori-starter-17-a02-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>よかったですね。<ruby>映画館<rt>えいがかん</rt></ruby>は<ruby>混<rt>こ</rt></ruby>んでいましたか？</>,
    romaji: "Yokatta desu ne. Eigakan wa konde imashita ka?",
    translation: "Wah, bagus, ya. Apakah bioskopnya ramai?",
    audioFileName: "irodori-starter-17-a02-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>いいえ、あまり<ruby>多<rt>おお</rt></ruby>くなかったです。</>,
    romaji: "Iie, amari ooku nakatta desu.",
    translation: "Tidak, bioskopnya tidak terlalu ramai.",
    audioFileName: "irodori-starter-17-a02-l04.mp3",
  },
];

const photoConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>アキコさんの<ruby>写真<rt>しゃしん</rt></ruby>を<ruby>見<rt>み</rt></ruby>ました。<ruby>水族館<rt>すいぞくかん</rt></ruby>に<ruby>行<rt>い</rt></ruby>きましたか？</>,
    romaji: "Akiko-san no shashin o mimashita. Suizokukan ni ikimashita ka?",
    translation: "Saya melihat foto Akiko. Apakah kamu pergi ke akuarium?",
    audioFileName: "irodori-starter-17-a03-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>はい。<ruby>家族<rt>かぞく</rt></ruby>で<ruby>行<rt>い</rt></ruby>きました。</>,
    romaji: "Hai. Kazoku de ikimashita.",
    translation: "Ya. Saya pergi bersama keluarga.",
    audioFileName: "irodori-starter-17-a03-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ペンギンは、かわいかったですか？</>,
    romaji: "Pengin wa, kawaikatta desu ka?",
    translation: "Apakah penguinnya lucu?",
    audioFileName: "irodori-starter-17-a03-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>はい、とてもかわいかったです。クラゲもきれいでした。</>,
    romaji: "Hai, totemo kawaikatta desu. Kurage mo kirei deshita.",
    translation: "Ya, sangat lucu. Ubur-uburnya juga indah.",
    audioFileName: "irodori-starter-17-a03-l04.mp3",
  },
];

const feeConversation: IrodoriUtterance[] = [
  {
    speakerId: "kenji",
    japanese: <>この<ruby>科学館<rt>かがくかん</rt></ruby>の<ruby>料金<rt>りょうきん</rt></ruby>を<ruby>見<rt>み</rt></ruby>てください。</>,
    romaji: "Kono kagakukan no ryoukin o mite kudasai.",
    translation: "Coba lihat biaya masuk ke museum sains ini.",
    audioFileName: "irodori-starter-17-a04-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <><ruby>高校生<rt>こうこうせい</rt></ruby>は、いくらですか？</>,
    romaji: "Koukoosee wa, ikura desu ka?",
    translation: "Berapa harga untuk siswa SMA?",
    audioFileName: "irodori-starter-17-a04-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>500<ruby>円<rt>えん</rt></ruby>です。</>,
    romaji: "Gohyaku en desu.",
    translation: "Harganya 500 yen.",
    audioFileName: "irodori-starter-17-a04-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>大人は800<ruby>円<rt>えん</rt></ruby>ですね。</>,
    romaji: "Otona wa happyaku en desu ne.",
    translation: "Untuk orang dewasa 800 yen, ya.",
    audioFileName: "irodori-starter-17-a04-l04.mp3",
  },
];

const messageConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <><ruby>今<rt>いま</rt></ruby>、<ruby>家<rt>いえ</rt></ruby>に<ruby>着<rt>つ</rt></ruby>きました。<ruby>今日<rt>きょう</rt></ruby>はありがとう！</>,
    romaji: "Ima, ie ni tsukimashita. Kyou wa arigatou!",
    translation: "Saya baru sampai rumah. Terima kasih untuk hari ini!",
    audioFileName: "irodori-starter-17-a05-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>こちらこそ。<ruby>映画<rt>えいが</rt></ruby>はとても<ruby>楽<rt>たの</rt></ruby>しかったです。</>,
    romaji: "Kochira koso. Eiga wa totemo tanoshikatta desu.",
    translation: "Sama-sama. Filmnya seru sekali.",
    audioFileName: "irodori-starter-17-a05-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>またいっしょに<ruby>行<rt>い</rt></ruby>きましょう！</>,
    romaji: "Mata issho ni ikimashou!",
    translation: "Ayo pergi bersama lagi!",
    audioFileName: "irodori-starter-17-a05-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>はい。また<ruby>連絡<rt>れんらく</rt></ruby>します。</>,
    romaji: "Hai. Mata renraku shimasu.",
    translation: "Ya. Nanti saya hubungi lagi.",
    audioFileName: "irodori-starter-17-a05-l04.mp3",
  },
];

const canDos = [
  { id: "answer-weekend-activity", text: "Memberi jawaban sederhana ketika ditanya apa yang dilakukan pada hari libur." },
  { id: "ask-and-share-impressions", text: "Bertanya dan menjawab tentang kegiatan pada hari libur serta kesannya." },
  { id: "read-social-post", text: "Membaca unggahan media sosial sederhana dan memahami kegiatan seseorang dengan bantuan foto." },
  { id: "read-facility-fees", text: "Membaca daftar tarif fasilitas umum dan memahami jumlah yang perlu dibayar." },
  { id: "send-after-outing-message", text: "Mengirim pesan singkat berisi kesan setelah pergi bersama seseorang." },
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
    prompt: <>Pilih bentuk lampau dari 「見ます」 (menonton / melihat).</>,
    options: [
      { key: "a", label: "見ました" },
      { key: "b", label: "見ません" },
      { key: "c", label: "見ませんでした" },
    ],
    answer: "a",
    explanation: <>Bentuk positif lampau dibuat dengan mengganti ～ます menjadi ～ました: <ruby>見<rt>み</rt></ruby>ます → <ruby>見<rt>み</rt></ruby>ました.</>,
  },
  {
    prompt: <>Bagaimana mengatakan “Saya tidak pergi ke mana pun”?</>,
    options: [
      { key: "a", label: <>どこにも<ruby>行<rt>い</rt></ruby>きました。</> },
      { key: "b", label: <>どこにも<ruby>行<rt>い</rt></ruby>きませんでした。</> },
      { key: "c", label: <>どこも<ruby>行<rt>い</rt></ruby>きました。</> },
    ],
    answer: "b",
    explanation: <>どこにも dipakai bersama bentuk negatif untuk menyatakan tidak pergi ke mana pun.</>,
  },
  {
    prompt: <>Bentuk lampau dari kata sifat い 「楽しい」 adalah …</>,
    options: [
      { key: "a", label: "楽しいでした" },
      { key: "b", label: "楽しかったです" },
      { key: "c", label: "楽しくでした" },
    ],
    answer: "b",
    explanation: <>Untuk kata sifat い, ubah ～い menjadi ～かったです: <ruby>楽<rt>たの</rt></ruby>しい → <ruby>楽<rt>たの</rt></ruby>しかったです.</>,
  },
  {
    prompt: <>Bentuk lampau dari na-adjective 「静かです」 adalah …</>,
    options: [
      { key: "a", label: "静かかったです" },
      { key: "b", label: "静かでした" },
      { key: "c", label: "静かじゃなかったです" },
    ],
    answer: "b",
    explanation: <>Untuk na-adjective, ubah ～です menjadi ～でした: <ruby>静<rt>しず</rt></ruby>かです → <ruby>静<rt>しず</rt></ruby>かでした.</>,
  },
  {
    prompt: <>Apa arti 「何もしませんでした」?</>,
    options: [
      { key: "a", label: "Saya melakukan semuanya." },
      { key: "b", label: "Saya tidak melakukan apa pun." },
      { key: "c", label: "Saya melakukan sesuatu." },
    ],
    answer: "b",
    explanation: <>何も berarti tidak melakukan apa pun jika dipakai bersama kata kerja bentuk negatif.</>,
  },
  {
    prompt: <>Kata 「よかったです」 merupakan bentuk lampau khusus dari …</>,
    options: [
      { key: "a", label: "いいです" },
      { key: "b", label: "おもしろいです" },
      { key: "c", label: "静かです" },
    ],
    answer: "a",
    explanation: <>いい adalah bentuk khusus. Bentuk lampau positifnya adalah よかったです.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa bentuk lampau dari 「買います」?</>,
    options: [
      { key: "a", label: "買いました" },
      { key: "b", label: "買いませんでした" },
      { key: "c", label: "買いますでした" },
    ],
    answer: "a",
    explanation: <>買います → <ruby>買<rt>か</rt></ruby>いました. Bentuk lampau positif menggunakan ～ました.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Saya tidak belajar bahasa Jepang.”</>,
    options: [
      { key: "a", label: <>日本語を<ruby>勉強<rt>べんきょう</rt></ruby>しました。</> },
      { key: "b", label: <>日本語を<ruby>勉強<rt>べんきょう</rt></ruby>しませんでした。</> },
      { key: "c", label: <>日本語は<ruby>勉強<rt>べんきょう</rt></ruby>でした。</> },
    ],
    answer: "b",
    explanation: <>Bentuk negatif lampau: ～ませんでした. Contoh: <ruby>勉強<rt>べんきょう</rt></ruby>しませんでした.</>,
  },
  {
    prompt: <>Bagaimana menanyakan kesan seseorang tentang acara?</>,
    options: [
      { key: "a", label: "イベントはどこですか？" },
      { key: "b", label: "イベントはどうでしたか？" },
      { key: "c", label: "イベントは何時ですか？" },
    ],
    answer: "b",
    explanation: <>どうでしたか digunakan untuk menanyakan bagaimana pengalaman atau kesan tentang sesuatu yang sudah terjadi.</>,
  },
  {
    prompt: <>Bentuk lampau dari 「おもしろいです」 adalah …</>,
    options: [
      { key: "a", label: "おもしろでした" },
      { key: "b", label: "おもしろかったです" },
      { key: "c", label: "おもしろくでした" },
    ],
    answer: "b",
    explanation: <>おもしろい adalah i-adjective. Ganti い dengan かったです.</>,
  },
  {
    prompt: <>Apa bentuk lampau positif dari 「雨です」?</>,
    options: [
      { key: "a", label: "雨かったです" },
      { key: "b", label: "雨でした" },
      { key: "c", label: "雨じゃなかったです" },
    ],
    answer: "b",
    explanation: <>Kalimat nomina memakai bentuk ～でした untuk menyatakan keadaan lampau.</>,
  },
  {
    prompt: <>Apa arti 「映画はまあまあでした」?</>,
    options: [
      { key: "a", label: "Filmnya sangat buruk." },
      { key: "b", label: "Filmnya lumayan." },
      { key: "c", label: "Filmnya sangat panjang." },
    ],
    answer: "b",
    explanation: <>まあまあ berarti lumayan atau biasa saja.</>,
  },
  {
    prompt: <>Pilih bentuk negatif lampau yang benar untuk 「きれいです」.</>,
    options: [
      { key: "a", label: "きれいくなかったです。" },
      { key: "b", label: "きれいじゃなかったです。" },
      { key: "c", label: "きれいかったです。" },
    ],
    answer: "b",
    explanation: <>kata sifat -na memakai じゃなかったです untuk negatif lampau.</>,
  },
  {
    prompt: <>Bentuk negatif lampau dari 「高いです」 adalah …</>,
    options: [
      { key: "a", label: "高くなかったです。" },
      { key: "b", label: "高いじゃなかったです。" },
      { key: "c", label: "高いでした。" },
    ],
    answer: "a",
    explanation: <>kata sifat -i memakai ～くなかったです: <ruby>高<rt>たか</rt></ruby>い → <ruby>高<rt>たか</rt></ruby>くなかったです.</>,
  },
  {
    prompt: <>Jika tiket museum untuk satu orang dewasa 800 yen dan satu siswa SMA 500 yen, berapa totalnya?</>,
    options: [
      { key: "a", label: "1,000円" },
      { key: "b", label: "1,300円" },
      { key: "c", label: "1,500円" },
    ],
    answer: "b",
    explanation: <>800 + 500 = 1.300 yen. Baca kategori tiket dan harga sebelum menjumlahkan.</>,
  },
  {
    prompt: <>Kalimat yang cocok untuk pesan setelah jalan bersama adalah …</>,
    options: [
      { key: "a", label: <>今日はありがとう。とても<ruby>楽<rt>たの</rt></ruby>しかったです。</> },
      { key: "b", label: <>明日は<ruby>何<rt>なに</rt></ruby>をしますか？</> },
      { key: "c", label: <>ここはどこですか？</> },
    ],
    answer: "a",
    explanation: <>Ungkapan ini berterima kasih dan menyampaikan kesan positif setelah kegiatan bersama.</>,
  },
];

const activityWords = [
  ["映画を見る", "えいがをみる · eiga o miru", "Menonton film"],
  ["運動する", "うんどうする · undou suru", "Berolahraga"],
  ["服を買う", "ふくをかう · fuku o kau", "Membeli pakaian"],
  ["勉強する", "べんきょうする · benkyou suru", "Belajar"],
  ["掃除する", "そうじする · souji suru", "Membersihkan"],
  ["洗濯する", "せんたくする · sentaku suru", "Mencuci pakaian"],
  ["寝る", "ねる · neru", "Tidur"],
  ["ゆっくりする", "yukkuri suru", "Bersantai"],
  ["水族館に行く", "すいぞくかんにいく · suizokukan ni iku", "Pergi ke akuarium"],
  ["コンサートに行く", "konsaato ni iku", "Pergi ke konser"],
  ["家族", "かぞく · kazoku", "Keluarga"],
  ["週末", "しゅうまつ · shuumatsu", "Akhir pekan"],
];

const impressionWords = [
  ["楽しい", "たのしい · tanoshii", "Menyenangkan"],
  ["おもしろい", "omoshiroi", "Menarik"],
  ["いい", "ii", "Bagus"],
  ["すばらしい", "subarashii", "Hebat / luar biasa"],
  ["まあまあ", "maamaa", "Lumayan"],
  ["大変", "たいへん · taihen", "Berat / melelahkan"],
  ["つまらない", "tsumaranai", "Membosankan"],
  ["いまいち", "imaichi", "Kurang memuaskan"],
  ["きれい", "kirei", "Indah / bersih"],
  ["多い", "おおい · ooi", "Banyak"],
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
  ["10,000", "いちまん · ichiman"],
];

const facilityFees = [
  {
    name: "Planetarium Aoba",
    jp: "あおばプラネタリウム",
    hours: "10:00–17:00",
    fees: [
      ["大人", "おとな · otona", "800円"],
      ["高校生", "こうこうせい · koukousei", "500円"],
      ["小・中学生", "しょう・ちゅうがくせい", "300円"],
    ],
  },
  {
    name: "Akuarium Mori",
    jp: "もり水族館",
    hours: "9:30–18:00",
    fees: [
      ["大人", "おとな · otona", "900円"],
      ["高校生", "こうこうせい · koukousei", "600円"],
      ["小・中学生", "しょう・ちゅうがくせい", "400円"],
    ],
  },
];

export default function IrodoriPemulaLessonSeventeenPage() {
  const progress = useIrodoriProgress();
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activityChoice, setActivityChoice] = useState("");
  const [activitySubmitted, setActivitySubmitted] = useState(false);
  const [impressionChoice, setImpressionChoice] = useState("");
  const [impressionSubmitted, setImpressionSubmitted] = useState(false);
  const [postChoice, setPostChoice] = useState("");
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [feeChoice, setFeeChoice] = useState("");
  const [feeSubmitted, setFeeSubmitted] = useState(false);
  const [messageChoice, setMessageChoice] = useState("");
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const isCompleted = progress.completedLessons.includes("starter-17");
  const practiceScore = practiceTasks.filter((task, index) => practiceAnswers[index] === task.answer).length;
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;
  const score = quizQuestions.filter((question, index) => answers[index] === question.answer).length;
  const activityIsCorrect = activitySubmitted && activityChoice === "movie";
  const impressionIsCorrect = impressionSubmitted && impressionChoice === "fun";
  const postIsCorrect = postSubmitted && postChoice === "aquarium";
  const feeIsCorrect = feeSubmitted && feeChoice === "sixteen-hundred";
  const messageIsCorrect = messageSubmitted && messageChoice === "thank-you";
  const activitiesComplete = activityIsCorrect && impressionIsCorrect && postIsCorrect && feeIsCorrect && messageIsCorrect;
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
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D6AD4F]/[0.07]">休</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">IRODORI • PEMULA A1 • PELAJARAN 17</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya pergi menonton film.</h1>
          <p className="mt-2 text-sm font-semibold text-[#D9B66D]"><ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>に<ruby>行<rt>い</rt></ruby>きました</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Belajar menceritakan kegiatan saat libur, bertanya tentang pengalaman dan kesan, membaca unggahan sederhana, memahami daftar tarif fasilitas, serta mengirim pesan setelah jalan bersama.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><CalendarDays size={14} className="text-[#D6AD4F}" />Kegiatan akhir pekan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Star size={14} className="text-[#D6AD4F]" />Kesan pengalaman</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Ticket size={14} className="text-[#D6AD4F]" />Tarif fasilitas</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><MessageCircle size={14} className="text-[#D6AD4F]" />Pesan singkat</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#B8860B]/20 bg-[#1B1917]/80 p-4 md:p-5">
        <div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#D9B66D]" /><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2></div>
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
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA 01</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kegiatan saat hari libur</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kata kerja ini membantu menceritakan apa yang dilakukan kemarin atau saat akhir pekan.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {activityWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dengarkan percakapan dan pesan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Dialog orisinal Fude. Perhatikan bentuk lampau pada kata kerja dan cara menyampaikan kesan.</p></div>
        <div className="space-y-4">
          <IrodoriConversation title="Bertanya tentang akhir pekan" speakers={[speakers.yui, speakers.kenji]} utterances={weekendConversation} />
          <IrodoriConversation title="Bertanya tentang kesan" speakers={[speakers.sota, speakers.akiko]} utterances={impressionConversation} />
          <IrodoriConversation title="Membicarakan foto kunjungan" speakers={[speakers.yui, speakers.akiko]} utterances={photoConversation} />
          <IrodoriConversation title="Memahami daftar tarif" speakers={[speakers.kenji, speakers.yui]} utterances={feeConversation} />
          <IrodoriConversation title="Mengirim pesan setelah kegiatan bersama" speakers={[speakers.sota, speakers.yui]} utterances={messageConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA 02</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menyampaikan kesan</h2></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {impressionWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/20 bg-[#211E1A] p-3">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">BENTUK LAMPAU YANG SERING DIPAKAI</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["楽しかったです", "menyenangkan"],
              ["おもしろかったです", "menarik"],
              ["よかったです", "bagus"],
              ["まあまあでした", "lumayan"],
              ["大変でした", "melelahkan"],
              ["つまらなかったです", "membosankan"],
              ["きれいでした", "indah"],
              ["多くなかったです", "tidak terlalu banyak"],
            ].map(([jp, meaning]) => (
              <div key={jp} className="rounded-lg border border-white/[0.06] bg-black/15 p-2"><p className="font-mincho text-sm text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#A9A398]">{meaning}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menceritakan hal yang sudah terjadi</h2></div>
        {[
          {
            title: "01 · Kata kerja bentuk lampau positif dan negatif",
            pattern: "V-ます → V-ました ／ V-ません → V-ませんでした",
            example: <><ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>ました。／ <ruby>勉強<rt>べんきょう</rt></ruby>しませんでした。</>,
            note: "Gunakan ～ました untuk menyatakan kegiatan yang sudah dilakukan. Gunakan ～ませんでした untuk menyatakan kegiatan yang tidak dilakukan pada waktu lampau. Bentuk ini dipakai untuk menceritakan aktivitas akhir pekan atau hari libur.",
          },
          {
            title: "02 · Menegaskan tidak melakukan apa pun atau tidak pergi ke mana pun",
            pattern: "何も + V-ませんでした ／ どこにも + 行きませんでした",
            example: <>週末は、<ruby>何<rt>なに</rt></ruby>もしませんでした。／ どこにも<ruby>行<rt>い</rt></ruby>きませんでした。</>,
            note: "何も berarti tidak melakukan apa pun dan dipakai bersama kata kerja negatif. どこにも berarti tidak ke mana pun dan dalam pola ini dipakai bersama 行きませんでした.",
          },
          {
            title: "03 · Kata sifat bentuk lampau positif",
            pattern: "ナA-です → ナA-でした ／ イA-いです → イA-かったです",
            example: <><ruby>公園<rt>こうえん</rt></ruby>は<ruby>静<rt>しず</rt></ruby>かでした。／ <ruby>映画<rt>えいが</rt></ruby>はおもしろかったです。／ よかったです。</>,
            note: "kata sifat -na mengubah です menjadi でした. kata sifat -i mengubah akhiran い menjadi かったです. Kata いい adalah bentuk khusus: bentuk lampau positifnya よかったです. Untuk bertanya kesan, gunakan どうでしたか？",
          },
          {
            title: "04 · Kalimat nomina bentuk lampau",
            pattern: "Nです → Nでした",
            example: <><ruby>昨日<rt>きのう</rt></ruby>は<ruby>休<rt>やす</rt></ruby>みでした。／ とてもいい<ruby>天気<rt>てんき</rt></ruby>でした。</>,
            note: "Untuk kalimat yang predikatnya nomina, ubah です menjadi でした saat menceritakan keadaan pada masa lalu.",
          },
          {
            title: "05 · Bentuk negatif lampau untuk nomina dan kata sifat",
            pattern: "N／ナA-じゃなかったです ／ イA-くなかったです",
            example: <><ruby>店<rt>みせ</rt></ruby>は<ruby>休<rt>やす</rt></ruby>みじゃなかったです。／ <ruby>映画<rt>えいが</rt></ruby>はおもしろくなかったです。／ <ruby>公園<rt>こうえん</rt></ruby>は<ruby>静<rt>しず</rt></ruby>かじゃなかったです。</>,
            note: "Untuk nomina dan na-adjective, gunakan じゃなかったです. Untuk i-adjective, ubah い menjadi くなかったです. Bentuk yang lebih formal じゃありませんでした dan くありませんでした juga ada.",
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
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KANJI DAN NOMINAL</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membaca angka dan harga</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kanji dasar 百, 千, dan 万 sering muncul dalam daftar tarif.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {numberWords.map(([number, reading]) => (
            <article key={number} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3 text-center">
              <JapaneseVocabularyReading reading={reading} contentClassName="font-mincho text-xl leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]">{number}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/20 bg-[#211E1A] p-3">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">KATA YANG SERING MUNCUL PADA DAFTAR TARIF</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["料金", "りょうきん · ryoukin", "Tarif"],
              ["大人", "おとな · otona", "Dewasa"],
              ["高校生", "こうこうせい · koukousei", "Siswa SMA"],
              ["小・中学生", "しょう・ちゅうがくせい", "SD dan SMP"],
              ["チケット", "chiketto", "Tiket"],
              ["営業時間", "えいぎょうじかん", "Jam operasional"],
              ["休業日", "きゅうぎょうび", "Hari tutup"],
              ["入館券", "にゅうかんけん", "Tiket masuk"],
            ].map(([jp, reading, meaning]) => (
              <div key={jp} className="rounded-lg border border-white/[0.06] bg-black/15 p-2"><p className="font-mincho text-sm text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#D9B66D]">{reading}</p><p className="mt-1 text-[9px] text-[#A9A398]">{meaning}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">UNGGAHAN SEDERHANA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Baca cerita dari foto</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Lihat petunjuk gambar, kemudian baca tulisan singkat untuk memahami kegiatan yang dilakukan.</p></div>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#1B1A18]">
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#263C4A] to-[#456B78] text-6xl">🎬 🍿</div>
            <div className="p-4">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">UNGGAHAN 01 · KENJI</p>
              <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]">土曜日、友だちと映画を見に行きました。とてもおもしろかったです！</p>
              <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Hari Sabtu pergi menonton film bersama teman. Filmnya sangat menarik.</p>
            </div>
          </article>
          <article className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#1B1A18]">
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#27564E] to-[#71A28A] text-6xl">🐧 🪼</div>
            <div className="p-4">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">UNGGAHAN 02 · AKIKO</p>
              <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]">家族で水族館に行きました。ペンギンがかわいかったです。</p>
              <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Pergi ke akuarium bersama keluarga. Penguin-nya lucu.</p>
            </div>
          </article>
          <article className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#1B1A18]">
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#5B3D62] to-[#9A78A0] text-6xl">🎹 🎼</div>
            <div className="p-4">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">UNGGAHAN 03 · YUI</p>
              <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]">日曜日、コンサートに行きました。音楽はすばらしかったです。</p>
              <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Hari Minggu pergi ke konser. Musiknya luar biasa.</p>
            </div>
          </article>
          <article className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#1B1A18]">
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#6E5935] to-[#B39B68] text-6xl">🌼 📷</div>
            <div className="p-4">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">UNGGAHAN 04 · SOTA</p>
              <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]">公園で花の写真を撮りました。天気がよかったです。</p>
              <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Mengambil foto bunga di taman. Cuacanya bagus.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">DAFTAR TARIF</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membaca harga fasilitas</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Daftar tarif berikut dibuat khusus untuk latihan. Perhatikan kategori pengunjung dan jumlah tiket yang dibutuhkan.</p></div>
        <div className="grid gap-3 md:grid-cols-2">
          {facilityFees.map((facility) => (
            <article key={facility.name} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#EAE6DD]">{facility.name}</p>
                  <JapaneseReading allowIndexFallback contentClassName="mt-1 font-mincho text-sm leading-relaxed text-[#D9B66D]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#A9A398]">{facility.jp}</JapaneseReading>
                </div>
                <Ticket size={17} className="text-[#D9B66D]" />
              </div>
              <p className="mt-3 text-[9px] font-black tracking-[0.15em] text-[#B8860B]">料金表 · DAFTAR TARIF</p>
              <div className="mt-2 space-y-2">
                {facility.fees.map(([category, reading, price]) => (
                  <div key={category} className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-2">
                    <JapaneseVocabularyReading reading={reading} contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]" kanaClassName="mt-1 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-[9px] italic text-[#A9A398]">{category}</JapaneseVocabularyReading>
                    <p className="font-mincho text-sm font-bold text-[#E7D2A1]">{price}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 text-[10px] text-[#A9A398]"><Clock3 size={12} className="shrink-0 text-[#D9B66D]"/><JapaneseReading allowIndexFallback contentClassName="text-[10px] leading-5 text-[#A9A398]" kanaClassName="mt-1 font-mincho text-xs text-[#D6AD4F]" romajiClassName="mt-1 text-[10px] italic text-[#A9A398]">営業時間：{facility.hours}</JapaneseReading></div>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/20 bg-[#211E1A] p-3 text-[10px] leading-5 text-[#A9A398]">
          Contoh menghitung tiket: satu tiket dewasa (800円) + satu tiket siswa SMA (500円) + satu tiket siswa SD/SMP (300円) = 1.600円.
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 01 · KEGIATAN AKHIR PEKAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Jawab pertanyaan tentang hari libur</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Yui bertanya apa yang dilakukan Kenji pada hari Sabtu. Petunjuknya: Kenji pergi menonton film bersama teman.</p></div>
        <div className="rounded-xl border border-[#D6AD4F]/20 bg-[#27231D] p-4">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">PERTANYAAN</p>
          <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">週末は何をしましたか？</p>
          <p className="mt-1 text-[10px] text-[#A9A398]">Apa yang kamu lakukan akhir pekan kemarin?</p>
        </div>
        <div className="grid gap-2">
          {[
            { key: "movie", label: "友だちと映画を見ました。", meaning: "Menonton film bersama teman." },
            { key: "study", label: "日本語を勉強します。", meaning: "Belajar bahasa Jepang (sekarang / kebiasaan)." },
            { key: "sleep", label: "毎日、学校へ行きます。", meaning: "Pergi ke sekolah setiap hari." },
          ].map((item) => (
            <button key={item.key} type="button" disabled={activitySubmitted} aria-pressed={activityChoice === item.key} onClick={() => setActivityChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (activitySubmitted && item.key === "movie" ? "border-emerald-500/50 bg-emerald-500/10" : activitySubmitted && activityChoice === item.key ? "border-red-400/50 bg-red-400/10" : activityChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback translation={item.meaning} contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-4 text-[#A9A398]">{item.label}</JapaneseReading>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{activitySubmitted ? activityIsCorrect ? "Benar. Jawaban memakai bentuk lampau 見ました." : "Belum tepat. Pilih jawaban yang cocok dengan petunjuk dan gunakan bentuk lampau." : "Pilih jawaban yang sesuai."}</p>
          {activitySubmitted ? <button type="button" onClick={() => { setActivityChoice(""); setActivitySubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!activityChoice} onClick={() => setActivitySubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa jawaban</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 02 · KESAN PENGALAMAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih jawaban yang cocok</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Seseorang bertanya bagaimana film yang kamu tonton. Filmnya seru sekali.</p></div>
        <div className="rounded-xl border border-[#D6AD4F]/20 bg-[#27231D] p-4">
          <p className="font-mincho text-base text-[#F1EBDD]">映画はどうでしたか？</p>
          <p className="mt-1 text-[10px] text-[#A9A398]">Bagaimana filmnya?</p>
        </div>
        <div className="grid gap-2">
          {[
            { key: "hard", label: "大変でした。", meaning: "Melelahkan." },
            { key: "fun", label: "とても楽しかったです。", meaning: "Sangat menyenangkan." },
            { key: "rain", label: "雨でした。", meaning: "Hujan." },
          ].map((item) => (
            <button key={item.key} type="button" disabled={impressionSubmitted} aria-pressed={impressionChoice === item.key} onClick={() => setImpressionChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (impressionSubmitted && item.key === "fun" ? "border-emerald-500/50 bg-emerald-500/10" : impressionSubmitted && impressionChoice === item.key ? "border-red-400/50 bg-red-400/10" : impressionChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback translation={item.meaning} contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-4 text-[#A9A398]">{item.label}</JapaneseReading>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{impressionSubmitted ? impressionIsCorrect ? "Benar. 楽しい berubah menjadi 楽しかったです." : "Belum tepat. Pilih kesan yang sesuai dengan petunjuk." : "Pilih satu jawaban."}</p>
          {impressionSubmitted ? <button type="button" onClick={() => { setImpressionChoice(""); setImpressionSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!impressionChoice} onClick={() => setImpressionSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa kesan</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 03 · MEMBACA UNGGAHAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pahami kegiatan dari foto</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Baca unggahan Akiko dan perhatikan petunjuk gambar penguin dan ubur-ubur.</p></div>
        <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#20251F]">
          <div className="flex h-32 items-center justify-center bg-gradient-to-br from-[#27564E] to-[#71A28A] text-6xl">🐧 🪼</div>
          <div className="p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">@akiko · 日曜日</p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]">家族で水族館に行きました。ペンギンがかわいかったです。</p>
            <p className="mt-1 text-[10px] text-[#A9A398]">Pergi ke akuarium bersama keluarga. Penguin-nya lucu.</p>
          </div>
        </div>
        <p className="text-xs font-semibold text-[#EAE6DD]">Ke mana Akiko pergi?</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "park", label: "公園", meaning: "Taman" },
            { key: "aquarium", label: "水族館", meaning: "Akuarium" },
            { key: "cinema", label: "映画館", meaning: "Bioskop" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={postSubmitted} aria-pressed={postChoice === item.key} onClick={() => setPostChoice(item.key)} className={"rounded-xl border p-3 text-center transition-colors " + (postSubmitted && item.key === "aquarium" ? "border-emerald-500/50 bg-emerald-500/10" : postSubmitted && postChoice === item.key ? "border-red-400/50 bg-red-400/10" : postChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback translation={item.meaning} contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-4 text-[#A9A398]">{item.label}</JapaneseReading>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{postSubmitted ? postIsCorrect ? "Benar. Unggahan menyebut 水族館 dan foto mendukung petunjuk tersebut." : "Belum tepat. Perhatikan kata 水族館 dan gambar hewan laut." : "Pilih tempat yang dikunjungi."}</p>
          {postSubmitted ? <button type="button" onClick={() => { setPostChoice(""); setPostSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!postChoice} onClick={() => setPostSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa unggahan</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 04 · DAFTAR TARIF</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Hitung jumlah tiket masuk</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Satu orang dewasa, satu siswa SMA, dan satu siswa SD/SMP akan masuk ke Planetarium Aoba. Berapa total biayanya?</p></div>
        <div className="overflow-hidden rounded-xl border border-white/[0.07]">
          <div className="flex items-center justify-between bg-[#30271C] p-3"><div><p className="text-xs font-bold text-[#F1EBDD]">Planetarium Aoba</p><p className="mt-1 text-[9px] text-[#D9B66D]">あおばプラネタリウム · 料金表</p></div><Ticket size={17} className="text-[#D9B66D]"/></div>
          <div className="space-y-2 bg-black/15 p-3">
            {[
              ["大人", "1人", "800円"],
              ["高校生", "1人", "500円"],
              ["小・中学生", "1人", "300円"],
            ].map(([category, amount, price]) => (
              <div key={category} className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs">
                <span className="font-mincho text-[#F1EBDD]">{category} <span className="text-[9px] text-[#A9A398]">× {amount}</span></span><span className="font-bold text-[#E7D2A1]">{price}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "fourteen-hundred", label: "1,400円" },
            { key: "sixteen-hundred", label: "1,600円" },
            { key: "eighteen-hundred", label: "1,800円" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={feeSubmitted} aria-pressed={feeChoice === item.key} onClick={() => setFeeChoice(item.key)} className={"rounded-xl border p-3 text-center font-mincho text-lg font-bold transition-colors " + (feeSubmitted && item.key === "sixteen-hundred" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : feeSubmitted && feeChoice === item.key ? "border-red-400/50 bg-red-400/10 text-red-200" : feeChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/10 text-[#A9A398]")}>{item.label}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{feeSubmitted ? feeIsCorrect ? "Benar. 800 + 500 + 300 = 1.600 yen." : "Belum tepat. Jumlahkan ketiga harga berdasarkan kategori." : "Pilih jumlah yang benar."}</p>
          {feeSubmitted ? <button type="button" onClick={() => { setFeeChoice(""); setFeeSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!feeChoice} onClick={() => setFeeSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa total</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 05 · PESAN SETELAH JALAN BERSAMA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih pesan yang sesuai</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kamu baru pulang setelah menonton film bersama teman. Kamu ingin mengucapkan terima kasih dan menyampaikan kesan.</p></div>
        <div className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">CHAT · YUI</p>
          <div className="mt-3 ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[#2C473A] p-3">
            <p className="font-mincho text-sm leading-6 text-[#F1EBDD]">今日はありがとう！</p>
            <p className="mt-1 text-[9px] text-[#B4C9B6]">Terima kasih untuk hari ini!</p>
          </div>
        </div>
        <p className="text-xs font-semibold text-[#EAE6DD]">Pesan mana yang cocok sebagai balasan setelah menonton film bersama?</p>
        <div className="grid gap-2">
          {[
            { key: "where", label: "今、どこですか？", meaning: "Sekarang di mana?" },
            { key: "thank-you", label: "こちらこそ。映画はとても楽しかったです。また行きましょう！", meaning: "Sama-sama. Filmnya seru sekali. Ayo pergi lagi!" },
            { key: "price", label: "チケットはいくらですか？", meaning: "Tiketnya berapa?" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={messageSubmitted} aria-pressed={messageChoice === item.key} onClick={() => setMessageChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (messageSubmitted && item.key === "thank-you" ? "border-emerald-500/50 bg-emerald-500/10" : messageSubmitted && messageChoice === item.key ? "border-red-400/50 bg-red-400/10" : messageChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback translation={item.meaning} contentClassName="font-mincho text-sm leading-6 text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-4 text-[#A9A398]">{item.label}</JapaneseReading>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{messageSubmitted ? messageIsCorrect ? "Benar. Pesan berisi terima kasih dan kesan setelah kegiatan bersama." : "Belum tepat. Pilih pesan yang menyampaikan terima kasih dan kesan." : "Pilih balasan yang tepat."}</p>
          {messageSubmitted ? <button type="button" onClick={() => { setMessageChoice(""); setMessageSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!messageChoice} onClick={() => setMessageSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa pesan</button>}
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
                  <button key={option.value} type="button" aria-pressed={ratings[item.id] === option.value} onClick={() => { const next = { ...ratings, [item.id]: option.value }; setRatings(next); saveIrodoriSelfEvaluation("starter-17", next); }} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors " + (ratings[item.id] === option.value ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]" : "border-white/[0.08] bg-[#24221F] text-[#A3A099]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {isCompleted ? <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/>Pelajaran selesai</span> : <button type="button" onClick={() => completeIrodoriLesson("starter-17")} disabled={!quizSubmitted || !practiceIsCorrect || !activitiesComplete || !canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#C93438] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/>Tandai pelajaran selesai</button>}
          <Link href="/irodori/starter" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
        </div>
        {(!quizSubmitted || !practiceIsCorrect || !activitiesComplete || !canDosRated) && <p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian target komunikasi.</p>}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, unggahan, dan daftar tarif dibuat orisinal oleh Fude. Semua nama, cerita, lokasi, dan harga bersifat fiktif.</p>
    </main>
  );
}
