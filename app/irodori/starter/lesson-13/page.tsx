"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BusFront,
  CheckCircle2,
  Clock3,
  Compass,
  MapPin,
  RefreshCw,
  Signpost,
  TrainFront,
} from "lucide-react";
import IrodoriConversation, { type IrodoriUtterance } from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import JapaneseReading from "@/components/JapaneseReading";
import { formatGrammarNotation } from "@/lib/japanese-text";
import {
  completeIrodoriLesson,
  saveIrodoriSelfEvaluation,
  useIrodoriProgress,
} from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const busConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>すみません。このバスは<ruby>水族館<rt>すいぞくかん</rt></ruby>に<ruby>行<rt>い</rt></ruby>きますか？</>,
    romaji: "Sumimasen. Kono basu wa suizokukan ni ikimasu ka?",
    translation: "Permisi. Apakah bus ini pergi ke akuarium?",
    audioFileName: "irodori-starter-13-a01-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい、<ruby>行<rt>い</rt></ruby>きますよ。23<ruby>番<rt>ばん</rt></ruby>のバスです。</>,
    romaji: "Hai, ikimasu yo. Nijuu-san ban no basu desu.",
    translation: "Ya, bus ini menuju ke sana. Ini bus nomor 23.",
    audioFileName: "irodori-starter-13-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ありがとうございます。23<ruby>番<rt>ばん</rt></ruby>ですね。</>,
    romaji: "Arigatou gozaimasu. Nijuu-san ban desu ne.",
    translation: "Terima kasih. Nomor 23, ya.",
    audioFileName: "irodori-starter-13-a01-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>そうです。あのバス<ruby>停<rt>てい</rt></ruby>から<ruby>乗<rt>の</rt></ruby>ってください。</>,
    romaji: "Sou desu. Ano basutei kara notte kudasai.",
    translation: "Betul. Silakan naik dari halte itu.",
    audioFileName: "irodori-starter-13-a01-l04.mp3",
  },
];

const stationConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>すみません。ここは、どこですか？</>,
    romaji: "Sumimasen. Koko wa, doko desu ka?",
    translation: "Permisi. Sekarang kita berada di mana?",
    audioFileName: "irodori-starter-13-a02-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>みどり<ruby>駅<rt>えき</rt></ruby>ですよ。</>,
    romaji: "Midori eki desu yo.",
    translation: "Ini Stasiun Midori.",
    audioFileName: "irodori-starter-13-a02-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>ありがとうございます。<ruby>次<rt>つぎ</rt></ruby>は、<ruby>中央<rt>ちゅうおう</rt></ruby><ruby>駅<rt>えき</rt></ruby>ですか？</>,
    romaji: "Arigatou gozaimasu. Tsugi wa, Chuuou eki desu ka?",
    translation: "Terima kasih. Apakah stasiun berikutnya Stasiun Chuo?",
    audioFileName: "irodori-starter-13-a02-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>いいえ。<ruby>次<rt>つぎ</rt></ruby>は、<ruby>西<rt>にし</rt></ruby><ruby>町<rt>まち</rt></ruby><ruby>駅<rt>えき</rt></ruby>です。</>,
    romaji: "Iie. Tsugi wa, Nishimachi eki desu.",
    translation: "Bukan. Stasiun berikutnya adalah Stasiun Nishimachi.",
    audioFileName: "irodori-starter-13-a02-l04.mp3",
  },
];

const commuteConversation: IrodoriUtterance[] = [
  {
    speakerId: "kenji",
    japanese: <>ユイさんは、<ruby>学校<rt>がっこう</rt></ruby>までどうやって<ruby>来<rt>き</rt></ruby>ますか？</>,
    romaji: "Yui-san wa, gakkou made dou yatte kimasu ka?",
    translation: "Yui, bagaimana kamu pergi ke sekolah?",
    audioFileName: "irodori-starter-13-a03-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>バスで<ruby>来<rt>き</rt></ruby>ます。20<ruby>分<rt>ぷん</rt></ruby>ぐらいかかります。</>,
    romaji: "Basu de kimasu. Nijuppun gurai kakarimasu.",
    translation: "Saya naik bus. Perjalanannya sekitar 20 menit.",
    audioFileName: "irodori-starter-13-a03-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>そうですか。<ruby>近<rt>ちか</rt></ruby>いですね。</>,
    romaji: "Sou desu ka. Chikai desu ne.",
    translation: "Begitu, ya. Cukup dekat, ya.",
    audioFileName: "irodori-starter-13-a03-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>はい。でも、<ruby>雨<rt>あめ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>は40<ruby>分<rt>ぷん</rt></ruby>ぐらいです。</>,
    romaji: "Hai. Demo, ame no hi wa yonjuppun gurai desu.",
    translation: "Ya. Tetapi saat hujan, sekitar 40 menit.",
    audioFileName: "irodori-starter-13-a03-l04.mp3",
  },
];

const directionConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>すみません。ここから<ruby>図書館<rt>としょかん</rt></ruby>まで、どうやって<ruby>行<rt>い</rt></ruby>きますか？</>,
    romaji: "Sumimasen. Koko kara toshokan made, dou yatte ikimasu ka?",
    translation: "Permisi. Bagaimana cara pergi dari sini ke perpustakaan?",
    audioFileName: "irodori-starter-13-a04-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ここから、7<ruby>番<rt>ばん</rt></ruby>のバスに<ruby>乗<rt>の</rt></ruby>ります。</>,
    romaji: "Koko kara, nana-ban no basu ni norimasu.",
    translation: "Dari sini, naik bus nomor 7.",
    audioFileName: "irodori-starter-13-a04-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>どこで<ruby>降<rt>お</rt></ruby>りますか？</>,
    romaji: "Doko de orimasu ka?",
    translation: "Turun di mana?",
    audioFileName: "irodori-starter-13-a04-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <><ruby>中央駅前<rt>ちゅうおうえきまえ</rt></ruby>で<ruby>降<rt>お</rt></ruby>りてください。そこから<ruby>歩<rt>ある</rt></ruby>いて5<ruby>分<rt>ふん</rt></ruby>ぐらいです。</>,
    romaji: "Chuuou-ekimae de orite kudasai. Soko kara aruite gofun gurai desu.",
    translation: "Silakan turun di depan Stasiun Chuo. Dari sana, berjalan kaki sekitar lima menit.",
    audioFileName: "irodori-starter-13-a04-l04.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>わかりました。ありがとうございます。</>,
    romaji: "Wakarimashita. Arigatou gozaimasu.",
    translation: "Baik, saya mengerti. Terima kasih.",
    audioFileName: "irodori-starter-13-a04-l05.mp3",
  },
];

const signConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>あの<ruby>案内<rt>あんない</rt></ruby>を<ruby>見<rt>み</rt></ruby>てください。</>,
    romaji: "Ano annai o mite kudasai.",
    translation: "Tolong lihat papan petunjuk itu.",
    audioFileName: "irodori-starter-13-a05-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <><ruby>東口<rt>ひがしぐち</rt></ruby>は、どちらですか？</>,
    romaji: "Higashiguchi wa, dochira desu ka?",
    translation: "Pintu keluar timur ada di sebelah mana?",
    audioFileName: "irodori-starter-13-a05-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>この<ruby>表示<rt>ひょうじ</rt></ruby>です。<ruby>左<rt>ひだり</rt></ruby>に<ruby>行<rt>い</rt></ruby>ってください。</>,
    romaji: "Kono hyouji desu. Hidari ni itte kudasai.",
    translation: "Petunjuk yang ini. Silakan ke arah kiri.",
    audioFileName: "irodori-starter-13-a05-l03.mp3",
  },
];

const speakers = IRODORI_SPEAKERS;

const canDos = [
  { id: "check-transport-destination", text: "Bertanya apakah bus atau kereta menuju tempat yang diinginkan, lalu memahami jawabannya." },
  { id: "ask-station-name", text: "Menanyakan nama stasiun atau posisi saat pengumuman di kendaraan kurang jelas." },
  { id: "explain-transport-time", text: "Menjelaskan cara bepergian dan perkiraan lama perjalanan." },
  { id: "ask-directions", text: "Menanyakan cara menuju tujuan dan memahami petunjuk perjalanan." },
  { id: "read-station-signs", text: "Membaca papan petunjuk umum di stasiun dan memahami artinya." },
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
    prompt: <>Kata bahasa Jepang untuk &quot;kereta&quot; adalah …</>,
    options: [
      { key: "a", label: <><ruby>電車<rt>でんしゃ</rt></ruby></> },
      { key: "b", label: "バス" },
      { key: "c", label: "タクシー" },
    ],
    answer: "a",
    explanation: <><ruby>電車<rt>でんしゃ</rt></ruby> berarti kereta.</>,
  },
  {
    prompt: <>Kalimat untuk bertanya apakah bus ini menuju akuarium adalah …</>,
    options: [
      { key: "a", label: <>このバスは<ruby>水族館<rt>すいぞくかん</rt></ruby>に<ruby>行<rt>い</rt></ruby>きますか？</> },
      { key: "b", label: <>このバスは<ruby>水族館<rt>すいぞくかん</rt></ruby>で<ruby>乗<rt>の</rt></ruby>りますか？</> },
      { key: "c", label: <>このバスは<ruby>水族館<rt>すいぞくかん</rt></ruby>を<ruby>来<rt>き</rt></ruby>ますか？</> },
    ],
    answer: "a",
    explanation: <>Tujuan ditandai dengan partikel に: 「<ruby>水族館<rt>すいぞくかん</rt></ruby>に<ruby>行<rt>い</rt></ruby>きますか？」.</>,
  },
  {
    prompt: <>Kamu ingin memastikan stasiun tempat kereta berhenti sekarang. Ungkapan yang tepat adalah …</>,
    options: [
      { key: "a", label: "ここは、どこですか？" },
      { key: "b", label: "次は、どこですか？" },
      { key: "c", label: "どのぐらいですか？" },
    ],
    answer: "a",
    explanation: <>「ここは、どこですか？」 menanyakan lokasi saat ini. 「<ruby>次<rt>つぎ</rt></ruby>は」 digunakan untuk menanyakan pemberhentian berikutnya.</>,
  },
  {
    prompt: <>Partikel untuk menyebut alat transportasi yang digunakan adalah …</>,
    options: [
      { key: "a", label: "を" },
      { key: "b", label: "で" },
      { key: "c", label: "が" },
    ],
    answer: "b",
    explanation: <>Contoh: バスで<ruby>来<rt>き</rt></ruby>ます berarti datang dengan bus.</>,
  },
  {
    prompt: <>Kalimat yang berarti &quot;perjalanannya sekitar 30 menit&quot; adalah …</>,
    options: [
      { key: "a", label: <>30<ruby>分<rt>ぷん</rt></ruby>ぐらいかかります。</> },
      { key: "b", label: <>30<ruby>分<rt>ぷん</rt></ruby>に<ruby>行<rt>い</rt></ruby>きます。</> },
      { key: "c", label: <>30<ruby>分<rt>ぷん</rt></ruby>を<ruby>乗<rt>の</rt></ruby>ります。</> },
    ],
    answer: "a",
    explanation: <>「ぐらい」 berarti kira-kira, sedangkan 「かかります」 menyatakan waktu yang diperlukan.</>,
  },
  {
    prompt: <>Lengkapi kalimat: ここから、7番のバス ___ 乗ります。</>,
    options: [
      { key: "a", label: "を" },
      { key: "b", label: "が" },
      { key: "c", label: "に" },
    ],
    answer: "c",
    explanation: <>Kata kerja <ruby>乗<rt>の</rt></ruby>ります menggunakan partikel に untuk kendaraan yang dinaiki.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa arti 「この電車は空港に行きますか？」?</>,
    options: [
      { key: "a", label: "Apakah kereta ini menuju bandara?" },
      { key: "b", label: "Di mana bandara berada?" },
      { key: "c", label: "Apakah bandara dekat dengan stasiun?" },
    ],
    answer: "a",
    explanation: <>「<ruby>空港<rt>くうこう</rt></ruby>に<ruby>行<rt>い</rt></ruby>きますか」 menanyakan apakah kendaraan menuju bandara.</>,
  },
  {
    prompt: <>Apa jawaban yang menyatakan kendaraan tidak menuju tempat itu?</>,
    options: [
      { key: "a", label: "はい、行きますよ。" },
      { key: "b", label: "いいえ、行きません。" },
      { key: "c", label: "ここは、どこですか？" },
    ],
    answer: "b",
    explanation: <>「いいえ、<ruby>行<rt>い</rt></ruby>きません」 berarti tidak, kendaraan itu tidak menuju ke sana.</>,
  },
  {
    prompt: <>Untuk menanyakan posisi sekarang, kata yang tepat adalah …</>,
    options: [
      { key: "a", label: "ここ" },
      { key: "b", label: "次" },
      { key: "c", label: "先" },
    ],
    answer: "a",
    explanation: <>「ここ」 berarti di sini. 「<ruby>次<rt>つぎ</rt></ruby>」 berarti berikutnya.</>,
  },
  {
    prompt: <>Bagaimana mengatakan &quot;datang dengan kereta&quot;?</>,
    options: [
      { key: "a", label: <>電車を来ます。</> },
      { key: "b", label: <>電車で来ます。</> },
      { key: "c", label: <>電車に来ます。</> },
    ],
    answer: "b",
    explanation: <>Partikel で menandai sarana atau cara: <ruby>電車<rt>でんしゃ</rt></ruby>で<ruby>来<rt>き</rt></ruby>ます.</>,
  },
  {
    prompt: <>Apa arti 「どのぐらい、かかりますか？」?</>,
    options: [
      { key: "a", label: "Berapa lama waktu yang diperlukan?" },
      { key: "b", label: "Kendaraan apa yang digunakan?" },
      { key: "c", label: "Di stasiun mana harus turun?" },
    ],
    answer: "a",
    explanation: <>Ungkapan ini menanyakan durasi perjalanan.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti &quot;turun di Stasiun Midori&quot;.</>,
    options: [
      { key: "a", label: <>みどり<ruby>駅<rt>えき</rt></ruby>に<ruby>降<rt>お</rt></ruby>ります。</> },
      { key: "b", label: <>みどり<ruby>駅<rt>えき</rt></ruby>で<ruby>降<rt>お</rt></ruby>ります。</> },
      { key: "c", label: <>みどり<ruby>駅<rt>えき</rt></ruby>を<ruby>降<rt>お</rt></ruby>ります。</> },
    ],
    answer: "b",
    explanation: <>Tempat turun memakai で: みどり<ruby>駅<rt>えき</rt></ruby>で<ruby>降<rt>お</rt></ruby>ります. Kendaraan yang ditinggalkan memakai を, misalnya <ruby>電車<rt>でんしゃ</rt></ruby>を<ruby>降<rt>お</rt></ruby>ります.</>,
  },
  {
    prompt: <>Ungkapan 「乗り換えます」 berarti …</>,
    options: [
      { key: "a", label: "Berjalan kaki" },
      { key: "b", label: "Berganti kendaraan atau jalur" },
      { key: "c", label: "Membeli tiket" },
    ],
    answer: "b",
    explanation: <>「<ruby>乗<rt>の</rt></ruby>り<ruby>換<rt>か</rt></ruby>えます」 berarti berpindah kendaraan atau melakukan transit.</>,
  },
  {
    prompt: <>Pada pola 「ここから駅まで」, arti から dan まで adalah …</>,
    options: [
      { key: "a", label: "Di dalam dan di luar" },
      { key: "b", label: "Dari dan sampai" },
      { key: "c", label: "Sebelum dan sesudah" },
    ],
    answer: "b",
    explanation: <>から menunjukkan titik awal dan まで menunjukkan batas tujuan.</>,
  },
  {
    prompt: <>Papan 「東口」 menunjukkan …</>,
    options: [
      { key: "a", label: "Pintu keluar timur" },
      { key: "b", label: "Pintu keluar barat" },
      { key: "c", label: "Pintu keluar utara" },
    ],
    answer: "a",
    explanation: <>「<ruby>東口<rt>ひがしぐち</rt></ruby>」 berarti pintu keluar timur.</>,
  },
  {
    prompt: <>Kalimat 「ここから図書館まで、どうやって行きますか？」 digunakan untuk …</>,
    options: [
      { key: "a", label: "Menanyakan harga tiket" },
      { key: "b", label: "Menanyakan cara menuju perpustakaan dari sini" },
      { key: "c", label: "Menanyakan nama orang di stasiun" },
    ],
    answer: "b",
    explanation: <>「どうやって<ruby>行<rt>い</rt></ruby>きますか」 menanyakan cara mencapai suatu tujuan.</>,
  },
];

const transportWords = [
  ["電車", "でんしゃ · densha", "Kereta"],
  ["バス", "basu", "Bus"],
  ["タクシー", "takushii", "Taksi"],
  ["地下鉄", "ちかてつ · chikatetsu", "Kereta bawah tanah"],
  ["飛行機", "ひこうき · hikouki", "Pesawat"],
  ["船", "ふね · fune", "Kapal"],
];

const travelWords = [
  ["駅", "えき · eki", "Stasiun"],
  ["空港", "くうこう · kuukou", "Bandara"],
  ["学校", "がっこう · gakkou", "Sekolah"],
  ["会社", "かいしゃ · kaisha", "Kantor / perusahaan"],
  ["図書館", "としょかん · toshokan", "Perpustakaan"],
  ["市役所", "しやくしょ · shiyakusho", "Kantor pemerintah kota"],
  ["乗ります", "のります · norimasu", "Naik kendaraan"],
  ["降ります", "おります · orimasu", "Turun dari kendaraan"],
  ["乗り換えます", "のりかえます · norikaemasu", "Berganti kendaraan"],
  ["歩いて", "あるいて · aruite", "Dengan berjalan kaki"],
  ["行きます", "いきます · ikimasu", "Pergi"],
  ["来ます", "きます · kimasu", "Datang"],
];

const stationSigns = [
  { jp: "東口", reading: "ひがしぐち · higashiguchi", meaning: "Pintu keluar timur", symbol: "→" },
  { jp: "西口", reading: "にしぐち · nishiguchi", meaning: "Pintu keluar barat", symbol: "←" },
  { jp: "南口", reading: "みなみぐち · minamiguchi", meaning: "Pintu keluar selatan", symbol: "↓" },
  { jp: "北口", reading: "きたぐち · kitaguchi", meaning: "Pintu keluar utara", symbol: "↑" },
  { jp: "出口", reading: "でぐち · deguchi", meaning: "Pintu keluar", symbol: "↗" },
  { jp: "入口", reading: "いりぐち · iriguchi", meaning: "Pintu masuk", symbol: "↙" },
  { jp: "改札口", reading: "かいさつぐち · kaisatsuguchi", meaning: "Gerbang tiket", symbol: "▥" },
  { jp: "乗り換え", reading: "のりかえ · norikae", meaning: "Transit / pindah jalur", symbol: "⇄" },
  { jp: "案内所", reading: "あんないじょ · annaijo", meaning: "Pusat informasi", symbol: "i" },
  { jp: "ホーム", reading: "hoomu", meaning: "Peron", symbol: "▤" },
];

export default function IrodoriStarterLessonThirteenPage() {
  const progress = useIrodoriProgress();
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [destinationChoice, setDestinationChoice] = useState("");
  const [destinationSubmitted, setDestinationSubmitted] = useState(false);
  const [stationChoice, setStationChoice] = useState("");
  const [stationSubmitted, setStationSubmitted] = useState(false);
  const [routeChoice, setRouteChoice] = useState("");
  const [routeSubmitted, setRouteSubmitted] = useState(false);
  const [signChoice, setSignChoice] = useState("");
  const [signSubmitted, setSignSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const isCompleted = progress.completedLessons.includes("starter-13");
  const practiceScore = practiceTasks.filter((task, index) => practiceAnswers[index] === task.answer).length;
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;
  const score = quizQuestions.filter((question, index) => answers[index] === question.answer).length;
  const destinationIsCorrect = destinationSubmitted && destinationChoice === "23";
  const stationIsCorrect = stationSubmitted && stationChoice === "current";
  const routeIsCorrect = routeSubmitted && routeChoice === "correct";
  const signIsCorrect = signSubmitted && signChoice === "east";
  const activitiesComplete = destinationIsCorrect && stationIsCorrect && routeIsCorrect && signIsCorrect;
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
        <ArrowLeft size={15} /> Kembali ke Starter
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#79602F]/45 bg-gradient-to-br from-[#302319] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D6AD4F]/[0.07]">街</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">IRODORI • STARTER A1 • LESSON 13</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Does this bus go to the airport?</h1>
          <p className="mt-2 text-sm font-semibold text-[#D9B66D]"><ruby>街<rt>まち</rt></ruby>を<ruby>歩<rt>ある</rt></ruby>く · Berjalan-jalan di kota</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Pelajari cara memastikan tujuan bus atau kereta, memahami pengumuman stasiun, menjelaskan lama perjalanan, meminta petunjuk arah, dan membaca papan informasi transportasi.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BusFront size={14} className="text-[#D6AD4F}" />Transportasi umum</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><TrainFront size={14} className="text-[#D6AD4F]" />Stasiun & jalur</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#D6AD4F]" />Durasi perjalanan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Signpost size={14} className="text-[#D6AD4F]" />Papan petunjuk</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#B8860B]/20 bg-[#1B1917]/80 p-4 md:p-5">
        <div className="flex items-center gap-2"><Compass size={16} className="text-[#D9B66D]" /><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2></div>
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
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA PERSIAPAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Jenis transportasi</h2><p className="mt-1 text-xs text-[#A9A398]">Kenali nama kendaraan yang umum digunakan untuk bepergian.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {transportWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3 text-center">
              <p className="font-mincho text-xl text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#D9B66D]">{reading}</p>
              <p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dengarkan dan pahami percakapan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog disusun khusus untuk latihan Fude. Furigana ditampilkan pada kanji agar mudah dibaca.</p></div>
        <div className="space-y-4">
          <IrodoriConversation title="Memastikan bus menuju tujuan" speakers={[speakers.yui, speakers.kenji]} utterances={busConversation} />
          <IrodoriConversation title="Memastikan nama stasiun" speakers={[speakers.sota, speakers.akiko]} utterances={stationConversation} />
          <IrodoriConversation title="Menceritakan cara dan lama perjalanan" speakers={[speakers.kenji, speakers.yui]} utterances={commuteConversation} />
          <IrodoriConversation title="Meminta petunjuk menuju tujuan" speakers={[speakers.sota, speakers.akiko]} utterances={directionConversation} />
          <IrodoriConversation title="Membaca papan petunjuk stasiun" speakers={[speakers.yui, speakers.sota]} utterances={signConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA PERJALANAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tempat dan ungkapan transportasi</h2></div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {travelWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <div><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#D9B66D]">{reading}</p></div>
              <p className="text-right text-xs text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">PAPAN PETUNJUK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali tanda di stasiun</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Papan petunjuk biasanya memakai kata singkat dan arah panah. Pelajari kosakata berikut.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {stationSigns.map((sign) => (
            <article key={sign.jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mincho text-xl font-bold text-[#F1EBDD]">{sign.jp}</p>
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#D6AD4F]/10 text-lg font-bold text-[#D9B66D]">{sign.symbol}</span>
              </div>
              <p className="mt-2 text-[9px] text-[#D9B66D]">{sign.reading}</p>
              <p className="mt-1 text-[10px] leading-4 text-[#A9A398]">{sign.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KATA KANJI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Arah mata angin dan kata kerja</h2></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["東", "ひがし · higashi", "Timur"],
            ["西", "にし · nishi", "Barat"],
            ["南", "みなみ · minami", "Selatan"],
            ["北", "きた · kita", "Utara"],
            ["会社", "かいしゃ · kaisha", "Perusahaan"],
            ["来ます", "きます · kimasu", "Datang"],
            ["行きます", "いきます · ikimasu", "Pergi"],
            ["乗ります", "のります · norimasu", "Naik kendaraan"],
          ].map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <p className="font-mincho text-xl text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#D9B66D]">{reading}</p>
              <p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Bertanya dan menjelaskan perjalanan</h2></div>
        {[
          {
            title: "01 · Memastikan tujuan kendaraan",
            pattern: "この【kendaraan】は【tujuan】に行きますか？",
            example: <>このバスは<ruby>空港<rt>くうこう</rt></ruby>に<ruby>行<rt>い</rt></ruby>きますか？</>,
            note: "Gunakan に untuk menandai tempat tujuan. Jawaban sederhana: 「はい、行きますよ」 (Ya, menuju ke sana) atau 「いいえ、行きません」 (Tidak, tidak menuju ke sana).",
          },
          {
            title: "02 · Memastikan posisi dan pemberhentian",
            pattern: "ここは【tempat】ですか？ ／ 次は【tempat】ですか？",
            example: <>ここは、みどり<ruby>駅<rt>えき</rt></ruby>ですか？ ／ <ruby>次<rt>つぎ</rt></ruby>は、<ruby>中央<rt>ちゅうおう</rt></ruby><ruby>駅<rt>えき</rt></ruby>ですか？</>,
            note: "ここ digunakan untuk memastikan tempat saat ini. 次は digunakan untuk bertanya tentang pemberhentian berikutnya.",
          },
          {
            title: "03 · Menyebutkan alat transportasi",
            pattern: "【kendaraan】で来ます ／ どうやって行きますか？",
            example: <><ruby>電車<rt>でんしゃ</rt></ruby>で<ruby>来<rt>き</rt></ruby>ます。／ バスで<ruby>行<rt>い</rt></ruby>きます。</>,
            note: "Partikel で menandai sarana atau cara. Untuk berjalan kaki, gunakan bentuk 歩いて. Pertanyaan どうやって行きますか berarti bagaimana cara pergi ke sana?",
          },
          {
            title: "04 · Menyatakan lama perjalanan",
            pattern: "【durasi】ぐらいかかります",
            example: <>30<ruby>分<rt>ぷん</rt></ruby>ぐらいかかります。／ 1<ruby>時間<rt>じかん</rt></ruby>ぐらいかかります。</>,
            note: "どのぐらいかかりますか menanyakan berapa lama waktu yang diperlukan. ぐらい berarti kira-kira; 時間 untuk jam sebagai durasi, 分 untuk menit.",
          },
          {
            title: "05 · Naik dan turun kendaraan",
            pattern: "【tempat】で【kendaraan】に乗ります ／ 【kendaraan】を降ります",
            example: <>ここから、7<ruby>番<rt>ばん</rt></ruby>のバスに<ruby>乗<rt>の</rt></ruby>ります。／ <ruby>中央駅前<rt>ちゅうおうえきまえ</rt></ruby>でバスを<ruby>降<rt>お</rt></ruby>ります。</>,
            note: "に dipakai bersama 乗ります untuk kendaraan yang dinaiki. を dipakai bersama 降ります untuk kendaraan yang ditinggalkan. で menandai tempat naik atau turun.",
          },
          {
            title: "06 · Menyebutkan titik awal dan akhir",
            pattern: "【tempat awal】から【tempat tujuan】まで",
            example: <>ここから<ruby>図書館<rt>としょかん</rt></ruby>まで、バスで<ruby>行<rt>い</rt></ruby>きます。</>,
            note: "から berarti dari dan menunjukkan titik awal. まで berarti sampai dan menunjukkan batas tujuan atau titik akhir perjalanan.",
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

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 01 · TUJUAN KENDARAAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih bus yang benar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kamu ingin pergi ke akuarium. Informasi di halte menunjukkan bahwa bus nomor 23 menuju akuarium.</p></div>
        <div className="rounded-xl border border-[#D6AD4F]/20 bg-[#27231D] p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#D9B66D]"><BusFront size={15}/> INFORMASI HALTE</div>
          <p className="mt-3 font-mincho text-xl text-[#F1EBDD]"><ruby>水族館<rt>すいぞくかん</rt></ruby> 行き</p>
          <p className="mt-1 text-xs text-[#A9A398]">Tujuan: Akuarium · Bus: 23番</p>
        </div>
        <p className="text-xs font-semibold text-[#EAE6DD]">Bus nomor berapa yang harus kamu naiki?</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { key: "12", label: "12番のバス" },
            { key: "23", label: "23番のバス" },
            { key: "35", label: "35番のバス" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={destinationSubmitted} aria-pressed={destinationChoice === item.key} onClick={() => setDestinationChoice(item.key)} className={"rounded-xl border px-3 py-3 text-sm font-bold transition-colors " + (destinationSubmitted && item.key === "23" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : destinationSubmitted && destinationChoice === item.key ? "border-red-400/50 bg-red-400/10 text-red-200" : destinationChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}>{item.label}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{destinationSubmitted ? destinationIsCorrect ? "Benar. Bus nomor 23 menuju akuarium." : "Belum tepat. Perhatikan kembali informasi halte." : "Pilih satu nomor bus."}</p>
          {destinationSubmitted ? <button type="button" onClick={() => { setDestinationChoice(""); setDestinationSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!destinationChoice} onClick={() => setDestinationSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 02 · NAMA STASIUN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tanyakan posisi sekarang</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pengumuman di kereta terdengar kurang jelas. Kamu ingin memastikan stasiun tempat kereta berhenti sekarang.</p></div>
        <div className="rounded-xl border border-white/[0.06] bg-black/15 p-4">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">PENGUMUMAN KERETA</p>
          <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">「まもなく、みどり駅です。」</p>
          <p className="mt-1 text-[10px] text-[#8F897F]">Sebentar lagi, Stasiun Midori.</p>
        </div>
        <p className="text-xs font-semibold text-[#EAE6DD]">Kalimat mana yang tepat untuk memastikan lokasi saat ini?</p>
        <div className="grid gap-2">
          {[
            { key: "current", label: "ここは、どこですか？", meaning: "Sekarang ini tempat apa?" },
            { key: "next", label: "次は、どこですか？", meaning: "Pemberhentian berikutnya apa?" },
            { key: "time", label: "どのぐらい、かかりますか？", meaning: "Berapa lama waktu yang diperlukan?" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={stationSubmitted} aria-pressed={stationChoice === item.key} onClick={() => setStationChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (stationSubmitted && item.key === "current" ? "border-emerald-500/50 bg-emerald-500/10" : stationSubmitted && stationChoice === item.key ? "border-red-400/50 bg-red-400/10" : stationChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <p className="font-mincho text-sm text-[#F1EBDD]">{item.label}</p>
              <p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{stationSubmitted ? stationIsCorrect ? "Benar. ここは digunakan untuk memastikan tempat saat ini." : "Belum tepat. Bedakan lokasi saat ini dengan pemberhentian berikutnya." : "Pilih ungkapan yang tepat."}</p>
          {stationSubmitted ? <button type="button" onClick={() => { setStationChoice(""); setStationSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!stationChoice} onClick={() => setStationSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 03 · PETUNJUK RUTE</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Temukan rute ke perpustakaan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Mulai dari halte di depan stasiun. Pilih petunjuk yang sesuai dengan informasi pada dialog.</p></div>
        <div className="rounded-xl border border-white/[0.06] bg-black/15 p-4">
          <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-[#D9B66D]"><span>HALTE STASIUN</span><span className="text-[#8F897F]">TUJUAN: 図書館</span></div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center">
            <div className="min-w-[86px] rounded-lg border border-[#D6AD4F]/30 bg-[#D6AD4F]/10 p-2"><MapPin size={15} className="mx-auto text-[#D9B66D]"/><p className="mt-1 text-[10px] text-[#F1EBDD]">ここ</p></div>
            <span className="text-[#D9B66D]">→</span>
            <div className="min-w-[86px] rounded-lg border border-white/[0.08] bg-white/[0.03] p-2"><BusFront size={15} className="mx-auto text-[#A9A398]"/><p className="mt-1 text-[10px] text-[#F1EBDD]">7番バス</p></div>
            <span className="text-[#D9B66D]">→</span>
            <div className="min-w-[86px] rounded-lg border border-white/[0.08] bg-white/[0.03] p-2"><MapPin size={15} className="mx-auto text-[#A9A398]"/><p className="mt-1 text-[10px] text-[#F1EBDD]">中央駅前</p></div>
            <span className="text-[#D9B66D]">→</span>
            <div className="min-w-[86px] rounded-lg border border-white/[0.08] bg-white/[0.03] p-2"><Compass size={15} className="mx-auto text-[#A9A398]"/><p className="mt-1 text-[10px] text-[#F1EBDD]">徒歩5分</p></div>
          </div>
        </div>
        <p className="text-xs font-semibold text-[#EAE6DD]">Petunjuk mana yang benar?</p>
        <div className="grid gap-2">
          {[
            { key: "wrong-a", label: "12番のバスに乗って、水族館前で降ります。" },
            { key: "correct", label: "7番のバスに乗って、中央駅前で降ります。それから歩きます。" },
            { key: "wrong-b", label: "電車に乗って、空港で降ります。" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={routeSubmitted} aria-pressed={routeChoice === item.key} onClick={() => setRouteChoice(item.key)} className={"rounded-xl border p-3 text-left font-mincho text-sm leading-6 transition-colors " + (routeSubmitted && item.key === "correct" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100" : routeSubmitted && routeChoice === item.key ? "border-red-400/50 bg-red-400/10 text-red-100" : routeChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/10 text-[#A9A398]")}>{item.label}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{routeSubmitted ? routeIsCorrect ? "Benar. Naik bus 7, turun di depan Stasiun Chuo, lalu berjalan kaki." : "Belum tepat. Cocokkan nomor bus dan tempat turun dengan petunjuk." : "Pilih satu rute."}</p>
          {routeSubmitted ? <button type="button" onClick={() => { setRouteChoice(""); setRouteSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!routeChoice} onClick={() => setRouteSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa rute</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 04 · PAPAN PETUNJUK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Cari pintu keluar timur</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kamu ingin keluar dari stasiun melalui sisi timur. Pilih papan petunjuk yang harus diikuti.</p></div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { jp: "西口", meaning: "Barat", reading: "Nishiguchi" },
            { jp: "東口", meaning: "Timur", reading: "Higashiguchi" },
            { jp: "北口", meaning: "Utara", reading: "Kitaguchi" },
          ].map((item) => (
            <div key=<JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading> className="rounded-xl border border-white/[0.07] bg-[#28251F] p-3 text-center">
              <p className="font-mincho text-2xl font-bold text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading></p>
              <p className="mt-1 text-[9px] text-[#D9B66D]">{item.reading}</p>
              <p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "west", label: "西口" },
            { key: "east", label: "東口" },
            { key: "north", label: "北口" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={signSubmitted} aria-pressed={signChoice === item.key} onClick={() => setSignChoice(item.key)} className={"rounded-xl border py-3 font-mincho text-base font-bold transition-colors " + (signSubmitted && item.key === "east" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : signSubmitted && signChoice === item.key ? "border-red-400/50 bg-red-400/10 text-red-200" : signChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/10 text-[#A9A398]")}>{item.label}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{signSubmitted ? signIsCorrect ? "Benar. 東口 berarti pintu keluar timur." : "Belum tepat. Ingat: 東 (higashi) berarti timur." : "Pilih papan petunjuk."}</p>
          {signSubmitted ? <button type="button" onClick={() => { setSignChoice(""); setSignSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!signChoice} onClick={() => setSignSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa tanda</button>}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Untuk membuka evaluasi akhir, seluruh jawaban praktik perlu benar.</p></div>
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
        <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#D9B66D]"/><p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">CAN-DO CHECK</p></div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Nilai lima kemampuan setelah menyelesaikan praktik dan kuis. Progres Irodori tersimpan terpisah dari Minna no Nihongo dan JLPT.</p>
        <div className="mt-4 space-y-3">
          {canDos.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
              <p className="text-xs font-semibold leading-5 text-[#EAE6DD]"><span className="mr-2 text-[#D9B66D]">0{index + 1}</span>{item.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ratingOptions.map((option) => (
                  <button key={option.value} type="button" aria-pressed={ratings[item.id] === option.value} onClick={() => { const next = { ...ratings, [item.id]: option.value }; setRatings(next); saveIrodoriSelfEvaluation("starter-13", next); }} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors " + (ratings[item.id] === option.value ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]" : "border-white/[0.08] bg-[#24221F] text-[#A3A099]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {isCompleted ? <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/>Pelajaran selesai</span> : <button type="button" onClick={() => completeIrodoriLesson("starter-13")} disabled={!quizSubmitted || !practiceIsCorrect || !activitiesComplete || !canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#C93438] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/>Tandai pelajaran selesai</button>}
          <Link href="/irodori/starter" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
        </div>
        {(!quizSubmitted || !practiceIsCorrect || !activitiesComplete || !canDosRated) && <p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan keempat simulasi dengan tepat, lalu isi kelima penilaian Can-do.</p>}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, nama tempat, nomor bus, dan situasi latihan disusun orisinal oleh Fude. Contoh rute bersifat fiktif.</p>
    </main>
  );
}
