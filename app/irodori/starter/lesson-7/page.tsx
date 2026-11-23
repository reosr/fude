"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ClipboardList,
  Home,
  MessageCircle,
  RefreshCw,
  Settings,
} from "lucide-react";
import IrodoriConversation, {
  type IrodoriUtterance,
} from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-tokohs";
import JapaneseReading from "@/components/JapaneseReading";
import JapaneseVocabularyReading from "@/components/JapaneseVocabularyReading";
import {
  completeIrodoriLesson,
  saveIrodoriSelfEvaluation,
  useIrodoriProgress,
} from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const houseTourConversation: IrodoriUtterance[] = [
  {
    tokohId: "kenji",
    japanese: <>どうぞ。<ruby>入<rt>はい</rt></ruby>ってください。</>,
    romaji: "Douzo. Haitte kudasai.",
    translation: "Silakan masuk.",
    audioFileName: "irodori-starter-07-a01-l01.mp3",
  },
  {
    tokohId: "yui",
    japanese: <>ありがとうございます。</>,
    romaji: "Arigatou gozaimasu.",
    translation: "Terima kasih.",
    audioFileName: "irodori-starter-07-a01-l02.mp3",
  },
  {
    tokohId: "kenji",
    japanese: <>ここは<ruby>玄関<rt>げんかん</rt></ruby>です。くつを<ruby>脱<rt>ぬ</rt></ruby>いでください。</>,
    romaji: "Koko wa genkan desu. Kutsu o nuide kudasai.",
    translation: "Ini area pintu masuk. Silakan lepas sepatu.",
    audioFileName: "irodori-starter-07-a01-l03.mp3",
  },
  {
    tokohId: "yui",
    japanese: <>はい、わかりました。</>,
    romaji: "Hai, wakarimashita.",
    translation: "Baik, saya mengerti.",
    audioFileName: "irodori-starter-07-a01-l04.mp3",
  },
  {
    tokohId: "kenji",
    japanese: <>ここは<ruby>台所<rt>だいどころ</rt></ruby>です。<ruby>一階<rt>いっかい</rt></ruby>に<ruby>部屋<rt>へや</rt></ruby>が<ruby>四<rt>よっ</rt></ruby>つあります。</>,
    romaji: "Koko wa daidokoro desu. Ikkai ni heya ga yottsu arimasu.",
    translation: "Ini dapur. Di lantai satu ada empat ruangan.",
    audioFileName: "irodori-starter-07-a01-l05.mp3",
  },
  {
    tokohId: "yui",
    japanese: <>あそこは<ruby>何<rt>なん</rt></ruby>ですか？</>,
    romaji: "Asoko wa nan desu ka?",
    translation: "Tempat di sana itu apa?",
    audioFileName: "irodori-starter-07-a01-l06.mp3",
  },
  {
    tokohId: "kenji",
    japanese: <>あそこは<ruby>居間<rt>いま</rt></ruby>です。ここに<ruby>階段<rt>かいだん</rt></ruby>があります。</>,
    romaji: "Asoko wa shokudou desu. Koko ni kaidan ga arimasu.",
    translation: "Itu ruang keluarga. Di sini ada tangga.",
    audioFileName: "irodori-starter-07-a01-l07.mp3",
  },
  {
    tokohId: "yui",
    japanese: <><ruby>二階<rt>にかい</rt></ruby>には<ruby>何<rt>なに</rt></ruby>がありますか？</>,
    romaji: "Nikai ni nani ga arimasu ka?",
    translation: "Apa yang ada di lantai dua?",
    audioFileName: "irodori-starter-07-a01-l08.mp3",
  },
  {
    tokohId: "kenji",
    japanese: <><ruby>二階<rt>にかい</rt></ruby>に<ruby>部屋<rt>へや</rt></ruby>が<ruby>二<rt>ふた</rt></ruby>つあります。</>,
    romaji: "Nikai ni heya ga futatsu arimasu.",
    translation: "Di lantai dua ada dua kamar.",
    audioFileName: "irodori-starter-07-a01-l09.mp3",
  },
];

const equipmentConversation: IrodoriUtterance[] = [
  {
    tokohId: "yui",
    japanese: <>すみません。<ruby>電子<rt>でんし</rt></ruby>レンジはありますか？</>,
    romaji: "Sumimasen. Denshi renji wa arimasu ka?",
    translation: "Permisi. Apakah ada microwave?",
    audioFileName: "irodori-starter-07-a02-l01.mp3",
  },
  {
    tokohId: "sota",
    japanese: <>はい、あります。<ruby>台所<rt>だいどころ</rt></ruby>にあります。</>,
    romaji: "Hai, arimasu. Daidokoro ni arimasu.",
    translation: "Ya, ada. Ada di dapur.",
    audioFileName: "irodori-starter-07-a02-l02.mp3",
  },
  {
    tokohId: "yui",
    japanese: <>トースターはありますか？</>,
    romaji: "Toosutaa wa arimasu ka?",
    translation: "Apakah ada toaster?",
    audioFileName: "irodori-starter-07-a02-l03.mp3",
  },
  {
    tokohId: "sota",
    japanese: <>トースターはありません。</>,
    romaji: "Toosutaa wa arimasen.",
    translation: "Toaster tidak ada.",
    audioFileName: "irodori-starter-07-a02-l04.mp3",
  },
  {
    tokohId: "yui",
    japanese: <>Wi-Fiはありますか？</>,
    romaji: "Waifai wa arimasu ka?",
    translation: "Apakah ada Wi-Fi?",
    audioFileName: "irodori-starter-07-a02-l05.mp3",
  },
  {
    tokohId: "sota",
    japanese: <>はい、ありますよ。</>,
    romaji: "Hai, arimasu yo.",
    translation: "Ya, ada.",
    audioFileName: "irodori-starter-07-a02-l06.mp3",
  },
];

const describeHouseConversation: IrodoriUtterance[] = [
  {
    tokohId: "akiko",
    japanese: <>ユイさんは、どこに<ruby>住<rt>す</rt></ruby>んでいますか？</>,
    romaji: "Yui-san wa, doko ni sunde imasu ka?",
    translation: "Yui, kamu tinggal di mana?",
    audioFileName: "irodori-starter-07-a03-l01.mp3",
  },
  {
    tokohId: "yui",
    japanese: <>あおば<ruby>町<rt>まち</rt></ruby>のアパートに<ruby>住<rt>す</rt></ruby>んでいます。</>,
    romaji: "Aoba-machi no apaato ni sunde imasu.",
    translation: "Saya tinggal di apartemen di daerah Aoba.",
    audioFileName: "irodori-starter-07-a03-l02.mp3",
  },
  {
    tokohId: "akiko",
    japanese: <><ruby>家<rt>いえ</rt></ruby>はどうですか？</>,
    romaji: "Ie wa dou desu ka?",
    translation: "Bagaimana rumahnya?",
    audioFileName: "irodori-starter-07-a03-l03.mp3",
  },
  {
    tokohId: "yui",
    japanese: <>ちょっとせまいです。でも、きれいです。</>,
    romaji: "Chotto semai desu. Demo, kirei desu.",
    translation: "Agak sempit. Tetapi, bersih.",
    audioFileName: "irodori-starter-07-a03-l04.mp3",
  },
  {
    tokohId: "akiko",
    japanese: <>そうですか。<ruby>静<rt>しず</rt></ruby>かですか？</>,
    romaji: "Sou desu ka. Shizuka desu ka?",
    translation: "Begitu ya. Apakah tenang?",
    audioFileName: "irodori-starter-07-a03-l05.mp3",
  },
  {
    tokohId: "yui",
    japanese: <>いいえ、あまり<ruby>静<rt>しず</rt></ruby>かじゃないです。<ruby>近<rt>ちか</rt></ruby>くに<ruby>学校<rt>がっこう</rt></ruby>があります。</>,
    romaji: "Iie, amari shizuka janai desu. Chikaku ni gakkou ga arimasu.",
    translation: "Tidak, tidak terlalu tenang. Di dekatnya ada sekolah.",
    audioFileName: "irodori-starter-07-a03-l06.mp3",
  },
];

const residenceConversation: IrodoriUtterance[] = [
  {
    tokohId: "kenji",
    japanese: <>ソウタさんは、どんな<ruby>家<rt>いえ</rt></ruby>に<ruby>住<rt>す</rt></ruby>んでいますか？</>,
    romaji: "Souta-san wa, donna ie ni sunde imasu ka?",
    translation: "Sota, kamu tinggal di rumah seperti apa?",
    audioFileName: "irodori-starter-07-a04-l01.mp3",
  },
  {
    tokohId: "sota",
    japanese: <><ruby>会社<rt>かいしゃ</rt></ruby>の<ruby>寮<rt>りょう</rt></ruby>に<ruby>住<rt>す</rt></ruby>んでいます。</>,
    romaji: "Kaisha no ryou ni sunde imasu.",
    translation: "Saya tinggal di asrama perusahaan.",
    audioFileName: "irodori-starter-07-a04-l02.mp3",
  },
  {
    tokohId: "kenji",
    japanese: <><ruby>広<rt>ひろ</rt></ruby>いですか？</>,
    romaji: "Hiroi desu ka?",
    translation: "Apakah luas?",
    audioFileName: "irodori-starter-07-a04-l03.mp3",
  },
  {
    tokohId: "sota",
    japanese: <>いいえ、<ruby>広<rt>ひろ</rt></ruby>くないです。でも、とても<ruby>静<rt>しず</rt></ruby>かです。</>,
    romaji: "Iie, hirokunai desu. Demo, totemo shizuka desu.",
    translation: "Tidak, tidak luas. Tetapi sangat tenang.",
    audioFileName: "irodori-starter-07-a04-l04.mp3",
  },
  {
    tokohId: "kenji",
    japanese: <>そうですか。<ruby>近<rt>ちか</rt></ruby>くに<ruby>公園<rt>こうえん</rt></ruby>がありますか？</>,
    romaji: "Sou desu ka. Chikaku ni kouen ga arimasu ka?",
    translation: "Begitu ya. Apakah ada taman di dekatnya?",
    audioFileName: "irodori-starter-07-a04-l05.mp3",
  },
  {
    tokohId: "sota",
    japanese: <>はい、あります。</>,
    romaji: "Hai, arimasu.",
    translation: "Ya, ada.",
    audioFileName: "irodori-starter-07-a04-l06.mp3",
  },
];

const canDos = [
  { id: "house-tour", text: "Memahami penjelasan sederhana tentang bagian rumah dan letak ruangan saat mengikuti tur rumah." },
  { id: "room-equipment", text: "Menanyakan apakah fasilitas atau perlengkapan yang dibutuhkan tersedia di rumah atau kamar." },
  { id: "house-description", text: "Memberi jawaban singkat tentang lokasi tempat tinggal dan kondisi rumah." },
  { id: "house-types", text: "Menanyakan dan menjawab jenis tempat tinggal yang digunakan seseorang." },
  { id: "appliance-buttons", text: "Mengenali tulisan pada tombol mesin cuci dan remote AC, lalu memilih fungsi yang tepat." },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Sudah bisa, masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

const rooms = [
  { jp: <ruby>玄関<rt>げんかん</rt></ruby>, reading: "genkan", meaning: "Area pintu masuk", icon: "🚪" },
  { jp: <ruby>台所<rt>だいどころ</rt></ruby>, reading: "daidokoro", meaning: "Dapur", icon: "🍳" },
  { jp: <ruby>居間<rt>いま</rt></ruby>, reading: "ima", meaning: "Ruang keluarga", icon: "🛋️" },
  { jp: <ruby>食堂<rt>しょくどう</rt></ruby>, reading: "shokudou", meaning: "Ruang makan", icon: "🍽️" },
  { jp: <ruby>部屋<rt>へや</rt></ruby>, reading: "heya", meaning: "Kamar / ruangan", icon: "🛏️" },
  { jp: <ruby>風呂<rt>ふろ</rt></ruby>, reading: "furo", meaning: "Kamar mandi / bath", icon: "🛁" },
  { jp: "トイレ", reading: "toire", meaning: "Toilet", icon: "🚻" },
  { jp: <ruby>階段<rt>かいだん</rt></ruby>, reading: "kaidan", meaning: "Tangga", icon: "🪜" },
  { jp: <ruby>庭<rt>にわ</rt></ruby>, reading: "niwa", meaning: "Taman", icon: "🌿" },
];

const appliances = [
  { jp: "エアコン", reading: "eakon", meaning: "AC", icon: "❄️" },
  { jp: <ruby>冷蔵庫<rt>れいぞうこ</rt></ruby>, reading: "reizouko", meaning: "Kulkas", icon: "🧊" },
  { jp: <><ruby>電子<rt>でんし</rt></ruby>レンジ</>, reading: "denshi renji", meaning: "Microwave", icon: "♨️" },
  { jp: <ruby>炊飯器<rt>すいはんき</rt></ruby>, reading: "suihanki", meaning: "Rice cooker", icon: "🍚" },
  { jp: "トースター", reading: "toosutaa", meaning: "Toaster", icon: "🍞" },
  { jp: "ベッド", reading: "beddo", meaning: "Tempat tidur", icon: "🛏️" },
  { jp: "ふとん", reading: "futon", meaning: "Futon", icon: "🛌" },
  { jp: "テーブル", reading: "teeburu", meaning: "Meja", icon: "🪑" },
  { jp: "いす", reading: "isu", meaning: "Kursi", icon: "🪑" },
  { jp: <ruby>洗濯機<rt>せんたくき</rt></ruby>, reading: "sentakuki", meaning: "Mesin cuci", icon: "🧺" },
  { jp: "テレビ", reading: "terebi", meaning: "Televisi", icon: "📺" },
  { jp: "Wi-Fi", reading: "waifai", meaning: "Wi-Fi", icon: "📶" },
];

const houseAdjectives = [
  { jp: <><ruby>広<rt>ひろ</rt></ruby>い</>, reading: "hiroi", meaning: "Luas", opposite: "せまい", type: "kata sifat -i" },
  { jp: "せまい", reading: "semai", meaning: "Sempit", opposite: "ひろい", type: "kata sifat -i" },
  { jp: <><ruby>大<rt>おお</rt></ruby>きい</>, reading: "ookii", meaning: "Besar", opposite: "ちいさい", type: "kata sifat -i" },
  { jp: <><ruby>小<rt>ちい</rt></ruby>さい</>, reading: "chiisai", meaning: "Kecil", opposite: "おおきい", type: "kata sifat -i" },
  { jp: <><ruby>新<rt>あたら</rt></ruby>しい</>, reading: "atarashii", meaning: "Baru", opposite: "ふるい", type: "kata sifat -i" },
  { jp: <><ruby>古<rt>ふる</rt></ruby>い</>, reading: "furui", meaning: "Lama / tua", opposite: "あたらしい", type: "kata sifat -i" },
  { jp: <><ruby>静<rt>しず</rt></ruby>か</>, reading: "shizuka", meaning: "Tenang", opposite: "うるさい", type: "kata sifat -na" },
  { jp: "うるさい", reading: "urusai", meaning: "Berisik", opposite: "しずか", type: "kata sifat -i" },
  { jp: "きれい", reading: "kirei", meaning: "Bersih / indah", opposite: "きたない", type: "kata sifat -na" },
  { jp: "きたない", reading: "kitanai", meaning: "Kotor", opposite: "きれい", type: "kata sifat -i" },
];

const residences = [
  { jp: "アパート", reading: "apaato", meaning: "Apartemen kecil / rumah susun sederhana", icon: "🏘️" },
  { jp: "マンション", reading: "manshon", meaning: "Kondominium / apartemen bertingkat", icon: "🏢" },
  { jp: <ruby>寮<rt>りょう</rt></ruby>, reading: "ryou", meaning: "Asrama", icon: "🏫" },
  { jp: "シェアハウス", reading: "sheahausu", meaning: "Rumah bersama", icon: "🏡" },
  { jp: <><ruby>一戸建<rt>いっこだ</rt></ruby>て</>, reading: "ikkodate", meaning: "Rumah tapak / rumah terpisah", icon: "🏠" },
];

const quizQuestions: {
  prompt: ReactNode;
  options: { key: string; label: ReactNode }[];
  answer: string;
  explanation: ReactNode;
}[] = [
  {
    prompt: <>Kalimat 「ここは<ruby>台所<rt>だいどころ</rt></ruby>です」 berarti…</>,
    options: [
      { key: "a", label: "Ini dapur." },
      { key: "b", label: "Ada dapur." },
      { key: "c", label: "Dapur tidak ada." },
    ],
    answer: "a",
    explanation: <>「ここは～です」 digunakan untuk menjelaskan tempat yang sedang ditunjuk: “Di sini adalah …”.</>,
  },
  {
    prompt: <>「<ruby>一階<rt>いっかい</rt></ruby>に<ruby>部屋<rt>へや</rt></ruby>が<ruby>四<rt>よっ</rt></ruby>つあります」 artinya…</>,
    options: [
      { key: "a", label: "Ada empat kamar di lantai satu." },
      { key: "b", label: "Ada satu kamar di lantai empat." },
      { key: "c", label: "Ada empat rumah di lantai dua." },
    ],
    answer: "a",
    explanation: <>「Tempat に benda が jumlah あります」 menyatakan benda yang ada di suatu tempat dan jumlahnya.</>,
  },
  {
    prompt: <>Bagaimana bertanya “Apakah ada microwave?”</>,
    options: [
      { key: "a", label: <><ruby>電子<rt>でんし</rt></ruby>レンジはありますか？</> },
      { key: "b", label: <><ruby>電子<rt>でんし</rt></ruby>レンジは<ruby>好<rt>す</rt></ruby>きですか？</> },
      { key: "c", label: <><ruby>電子<rt>でんし</rt></ruby>レンジは<ruby>新<rt>あたら</rt></ruby>しいですか？</> },
    ],
    answer: "a",
    explanation: <>「Nはありますか？」 digunakan untuk menanyakan apakah suatu benda tersedia.</>,
  },
  {
    prompt: <>Jawaban negatif yang benar untuk 「ベッドはありますか？」 adalah…</>,
    options: [
      { key: "a", label: <>はい、あります。</> },
      { key: "b", label: <>ベッドはありません。</> },
      { key: "c", label: <>ベッドが<ruby>好<rt>す</rt></ruby>きです。</> },
    ],
    answer: "b",
    explanation: <>「ありません」 dan 「ないです」 dapat digunakan untuk menyatakan bahwa sesuatu tidak tersedia.</>,
  },
  {
    prompt: <>Kalimat 「<ruby>家<rt>いえ</rt></ruby>は<ruby>静<rt>しず</rt></ruby>かです」 memiliki arti…</>,
    options: [
      { key: "a", label: "Rumahnya luas." },
      { key: "b", label: "Rumahnya tenang." },
      { key: "c", label: "Rumahnya baru." },
    ],
    answer: "b",
    explanation: <>「<ruby>静<rt>しず</rt></ruby>か」 adalah na-adjective. Dalam kalimat, bentuknya 「<ruby>静<rt>しず</rt></ruby>かです」.</>,
  },
  {
    prompt: <>Bentuk negatif yang tepat dari 「<ruby>広<rt>ひろ</rt></ruby>いです」 adalah…</>,
    options: [
      { key: "a", label: <><ruby>広<rt>ひろ</rt></ruby>くないです。</> },
      { key: "b", label: <><ruby>広<rt>ひろ</rt></ruby>いじゃないです。</> },
      { key: "c", label: <><ruby>広<rt>ひろ</rt></ruby>くありませんです。</> },
    ],
    answer: "a",
    explanation: <>Untuk i-adjective, ubah akhiran 「～いです」 menjadi 「～くないです」.</>,
  },
  {
    prompt: <>Bentuk negatif dari na-adjective 「<ruby>静<rt>しず</rt></ruby>かです」 adalah…</>,
    options: [
      { key: "a", label: <><ruby>静<rt>しず</rt></ruby>かくないです。</> },
      { key: "b", label: <><ruby>静<rt>しず</rt></ruby>かじゃないです。</> },
      { key: "c", label: <><ruby>静<rt>しず</rt></ruby>かありません。</> },
    ],
    answer: "b",
    explanation: <>Untuk na-adjective, ubah 「です」 menjadi 「じゃないです」.</>,
  },
  {
    prompt: <>Dalam bahasa Jepang, 「マンション」 biasanya berarti…</>,
    options: [
      { key: "a", label: "Kondominium atau apartemen bertingkat." },
      { key: "b", label: "Rumah besar milik bangsawan." },
      { key: "c", label: "Kamar hotel." },
    ],
    answer: "a",
    explanation: <>「マンション」 dalam konteks tempat tinggal Jepang berarti hunian kolektif bertingkat, bukan mansion mewah dalam bahasa Inggris.</>,
  },
  {
    prompt: <>Tombol 「<ruby>入<rt>いり</rt></ruby>」 pada panel mesin cuci menunjukkan fungsi…</>,
    options: [
      { key: "a", label: "Mematikan daya." },
      { key: "b", label: "Menyalakan daya." },
      { key: "c", label: "Mengubah mode." },
    ],
    answer: "b",
    explanation: <>「<ruby>入<rt>いり</rt></ruby>」 berarti ON / nyala, sedangkan 「<ruby>切<rt>きり</rt></ruby>」 berarti OFF / mati.</>,
  },
  {
    prompt: <>Jika ruangan terasa panas dan ingin menyalakan AC untuk mendinginkan ruangan, tombol yang dipilih adalah…</>,
    options: [
      { key: "a", label: <><ruby>暖房<rt>だんぼう</rt></ruby></> },
      { key: "b", label: <><ruby>停止<rt>ていし</rt></ruby></> },
      { key: "c", label: <><ruby>冷房<rt>れいぼう</rt></ruby></> },
    ],
    answer: "c",
    explanation: <>「<ruby>冷房<rt>れいぼう</rt></ruby>」 adalah mode pendingin. 「<ruby>暖房<rt>だんぼう</rt></ruby>」 adalah mode pemanas dan 「<ruby>停止<rt>ていし</rt></ruby>」 berarti berhenti.</>,
  },
];

export default function IrodoriPemulaLessonSevenPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [washerPower, setWasherPower] = useState("入");
  const [washerAction, setWasherAction] = useState("スタート");
  const [airMode, setAirMode] = useState("冷房");
  const [heaterMode, setHeaterMode] = useState("暖房");
  const [appliancePracticeSubmitted, setAppliancePracticeSubmitted] = useState(false);
  const progress = useIrodoriProgress();
  const ratings = progress.selfEvaluations["starter-07"] ?? {};
  const isCompleted = progress.completedLessons.includes("starter-07");

  const answeredCount = Object.keys(answers).length;
  const score = quizQuestions.filter(
    (question, index) => answers[index] === question.answer
  ).length;
  const canDosRated = canDos.every((canDo) => Boolean(ratings[canDo.id]));
  const appliancePracticeCorrect =
    washerPower === "入" &&
    washerAction === "スタート" &&
    airMode === "冷房" &&
    heaterMode === "暖房";

  const resetQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
  };

  const resetAppliancePractice = () => {
    setWasherPower("入");
    setWasherAction("スタート");
    setAirMode("冷房");
    setHeaterMode("暖房");
    setAppliancePracticeSubmitted(false);
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
          家
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">
            TOPIC 04 • HOMES AND WORKPLACES
          </p>
          <p className="mt-5 text-sm font-semibold text-[#B9A98B]">
            Pelajaran 7
          </p>
          <h1 className="mt-1 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Ada empat kamar.</h1>
          <p className="mt-2 font-mincho text-2xl text-[#D9B66D]">
            <ruby>部屋<rt>へや</rt></ruby>が<ruby>四<rt>よっ</rt></ruby>つあります
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#B6B0A5]">
            Ikuti tur rumah, periksa fasilitas yang tersedia, jelaskan kondisi
            tempat tinggal, kenali berbagai jenis hunian, dan pahami tombol
            dasar pada mesin cuci serta remote AC.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              5 target target komunikasi
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
            <Home size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 01
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Mengikuti tur rumah
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Saat seseorang menunjukkan bagian rumah, kamu akan mendengar ungkapan
          seperti 「ここは<ruby>玄関<rt>げんかん</rt></ruby>です」. Gunakan 「ここは～です」 untuk menyebut
          tempat yang sedang ditunjuk, dan 「～に～があります」 untuk
          menjelaskan apa yang ada di suatu tempat.
        </p>
        <IrodoriConversation
          title="Scene A · Tur rumah contoh"
          tokohs={[IRODORI_SPEAKERS.kenji, IRODORI_SPEAKERS.yui]}
          utterances={houseTourConversation}
        />
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
          <div className="border-b border-white/[0.07] bg-[#2B2118] p-4">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
              FUDE HOUSE · CONTOH FIKTIF
            </p>
            <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">
              <ruby>家<rt>いえ</rt></ruby>の<ruby>間取り<rt>まどり</rt></ruby> · Denah rumah
            </h3>
            <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">
              Denah sederhana untuk latihan membaca lokasi dan jumlah ruangan.
            </p>
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-2">
            <article className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mincho text-lg font-bold text-[#F1EBDD]">
                  <ruby>一階<rt>いっかい</rt></ruby> · Lantai 1
                </p>
                <span className="rounded-full bg-[#B8860B]/15 px-2.5 py-1 text-[9px] font-bold text-[#D9B66D]">
                  4 ruangan utama
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex min-h-20 flex-col items-center justify-center rounded-lg border border-white/[0.06] bg-[#302D29] p-2 text-center">
                  <span className="text-2xl">🚪</span>
                  <p className="mt-1 font-mincho text-sm font-bold text-[#F1EBDD]">
                    <ruby>玄関<rt>げんかん</rt></ruby>
                  </p>
                </div>
                <div className="flex min-h-20 flex-col items-center justify-center rounded-lg border border-white/[0.06] bg-[#302D29] p-2 text-center">
                  <span className="text-2xl">🍳</span>
                  <p className="mt-1 font-mincho text-sm font-bold text-[#F1EBDD]">
                    <ruby>台所<rt>だいどころ</rt></ruby>
                  </p>
                </div>
                <div className="flex min-h-20 flex-col items-center justify-center rounded-lg border border-white/[0.06] bg-[#302D29] p-2 text-center">
                  <span className="text-2xl">🛋️</span>
                  <p className="mt-1 font-mincho text-sm font-bold text-[#F1EBDD]">
                    <ruby>居間<rt>いま</rt></ruby>
                  </p>
                </div>
                <div className="flex min-h-20 flex-col items-center justify-center rounded-lg border border-white/[0.06] bg-[#302D29] p-2 text-center">
                  <span className="text-2xl">🛁</span>
                  <p className="mt-1 font-mincho text-sm font-bold text-[#F1EBDD]">
                    <ruby>風呂<rt>ふろ</rt></ruby>
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[10px] leading-5 text-[#817A73]">
                Ada juga toilet dan tangga menuju lantai dua.
              </p>
            </article>
            <article className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mincho text-lg font-bold text-[#F1EBDD]">
                  <ruby>二階<rt>にかい</rt></ruby> · Lantai 2
                </p>
                <span className="rounded-full bg-[#B8860B]/15 px-2.5 py-1 text-[9px] font-bold text-[#D9B66D]">
                  2 kamar
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex min-h-20 flex-col items-center justify-center rounded-lg border border-white/[0.06] bg-[#302D29] p-2 text-center">
                  <span className="text-2xl">🛏️</span>
                  <p className="mt-1 font-mincho text-sm font-bold text-[#F1EBDD]">
                    <ruby>部屋<rt>へや</rt></ruby> A
                  </p>
                </div>
                <div className="flex min-h-20 flex-col items-center justify-center rounded-lg border border-white/[0.06] bg-[#302D29] p-2 text-center">
                  <span className="text-2xl">🛏️</span>
                  <p className="mt-1 font-mincho text-sm font-bold text-[#F1EBDD]">
                    <ruby>部屋<rt>へや</rt></ruby> B
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[10px] leading-5 text-[#817A73]">
                <ruby>二階<rt>にかい</rt></ruby>に<ruby>部屋<rt>へや</rt></ruby>が<ruby>二<rt>ふた</rt></ruby>つあります。
              </p>
            </article>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((item) => (
            <article
              key={item.reading}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/15 text-2xl">
                {item.icon}
              </span>
              <div className="min-w-0">
                <JapaneseVocabularyReading reading={item.reading} meaning={item.meaning}
                  contentClassName="font-mincho text-base font-bold text-[#F1EBDD]"
                  kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]"
                  romajiClassName="mt-1 text-[10px] italic text-[#B8860B]"
                  translationClassName="mt-2 text-xs text-[#A9A398]"
                >
                  {item.jp}
                </JapaneseVocabularyReading>
              </div>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">Pola untuk menjelaskan lokasi</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-lg text-[#F1EBDD]">
                ここは<ruby>台所<rt>だいどころ</rt></ruby>です。
              </p>
              <p className="mt-1 text-xs text-[#A9A398]">Ini dapur.</p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-lg text-[#F1EBDD]">
                ここに<ruby>階段<rt>かいだん</rt></ruby>があります。
              </p>
              <p className="mt-1 text-xs text-[#A9A398]">Di sini ada tangga.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4B8B9B]/15 text-[#8FCAD4]">
            <ClipboardList size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 02
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Mengecek fasilitas dan perlengkapan
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Saat akan tinggal di kamar atau asrama, tanyakan benda yang kamu
          butuhkan dengan pola 「Nはありますか？」. Jawab 「あります」 jika ada,
          atau 「ありません／ないです」 jika tidak ada.
        </p>
        <IrodoriConversation
          title="Scene B · Mengecek fasilitas kamar"
          tokohs={[IRODORI_SPEAKERS.yui, IRODORI_SPEAKERS.sota]}
          utterances={equipmentConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {appliances.map((item) => (
            <article
              key={item.reading}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/15 text-2xl">
                {item.icon}
              </span>
              <div className="min-w-0">
                <JapaneseVocabularyReading reading={item.reading} meaning={item.meaning}
                  contentClassName="font-mincho text-base font-bold text-[#F1EBDD]"
                  kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]"
                  romajiClassName="mt-1 text-[10px] italic text-[#B8860B]"
                  translationClassName="mt-2 text-xs text-[#A9A398]"
                >
                  {item.jp}
                </JapaneseVocabularyReading>
              </div>
            </article>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              JIKA TERSEDIA
            </p>
            <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">
              はい、あります。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">Ya, ada.</p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              JIKA TIDAK TERSEDIA
            </p>
            <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">
              ありません。／ないです。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">Tidak ada.</p>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7D9C69]/15 text-[#A8C791]">
            <MessageCircle size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 03
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Menjelaskan kondisi rumah
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Saat ditanya tempat tinggal, jawab dengan kalimat sederhana. Untuk
          menggambarkan rumah, gunakan kata sifat seperti luas, sempit, baru,
          lama, tenang, atau bersih. Kata 「ちょっと」 berarti agak, sedangkan
          「とても」 berarti sangat.
        </p>
        <IrodoriConversation
          title="Scene C · Bercerita tentang rumah fiktif"
          tokohs={[IRODORI_SPEAKERS.akiko, IRODORI_SPEAKERS.yui]}
          utterances={describeHouseConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {houseAdjectives.map((item) => (
            <article
              key={item.reading}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <JapaneseVocabularyReading reading={item.reading} meaning={item.meaning}
                    contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]"
                    kanaClassName="mt-2 font-mincho text-base text-[#D6AD4F]"
                    romajiClassName="mt-1 text-[10px] italic text-[#B8860B]"
                    translationClassName="mt-2 text-xs leading-5 text-[#A9A398]"
                  >
                    {item.jp}
                  </JapaneseVocabularyReading>
                </div>
                <span className="rounded-md border border-white/[0.08] bg-black/15 px-2 py-1 text-[8px] font-bold text-[#A9A398]">
                  {item.type}
                </span>
              </div>
              <p className="mt-2 border-t border-white/[0.06] pt-2 text-[10px] text-[#817A73]">
                Lawan kata: <span className="font-mincho text-sm text-[#D9B66D]">{item.opposite}</span>
              </p>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">Kata penguat dan penghubung</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-lg text-[#F1EBDD]">ちょっと</p>
              <p className="mt-1 text-xs text-[#A9A398]">Agak / sedikit</p>
              <p className="mt-2 font-mincho text-base text-[#D9B66D]">ちょっとせまいです。</p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-lg text-[#F1EBDD]">とても</p>
              <p className="mt-1 text-xs text-[#A9A398]">Sangat</p>
              <p className="mt-2 font-mincho text-base text-[#D9B66D]">とてもきれいです。</p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-lg text-[#F1EBDD]">でも</p>
              <p className="mt-1 text-xs text-[#A9A398]">Tetapi</p>
              <p className="mt-2 font-mincho text-base text-[#D9B66D]"><ruby>古<rt>ふる</rt></ruby>いです。でも、<ruby>広<rt>ひろ</rt></ruby>いです。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A77FBD]/15 text-[#C7A9DB]">
            <Building2 size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 04
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Mengenali jenis tempat tinggal
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Ada beberapa kata untuk menjelaskan jenis hunian di Jepang. Perhatikan
          istilah Jepang 「マンション」: dalam konteks tempat tinggal, kata ini
          biasanya berarti kondominium atau apartemen bertingkat, bukan rumah
          mewah seperti arti mansion dalam bahasa Inggris.
        </p>
        <IrodoriConversation
          title="Scene D · Membicarakan jenis hunian"
          tokohs={[IRODORI_SPEAKERS.kenji, IRODORI_SPEAKERS.sota]}
          utterances={residenceConversation}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {residences.map((item) => (
            <article
              key={item.reading}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <div className="flex h-16 items-center justify-center rounded-lg bg-black/15 text-3xl">
                {item.icon}
              </div>
              <JapaneseVocabularyReading reading={item.reading} meaning={item.meaning}
                  contentClassName="mt-3 font-mincho text-lg font-bold text-[#F1EBDD]"
                  kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]"
                  romajiClassName="mt-1 text-[10px] italic text-[#B8860B]"
                  translationClassName="mt-2 mt-1 text-xs leading-5 text-[#A9A398]"
                >
                  {item.jp}
                </JapaneseVocabularyReading>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">Pertanyaan yang berguna</p>
          <p className="mt-3 font-mincho text-lg text-[#F1EBDD]">
            どんな<ruby>家<rt>いえ</rt></ruby>に<ruby>住<rt>す</rt></ruby>んでいますか？
          </p>
          <p className="mt-1 text-xs text-[#A9A398]">Kamu tinggal di tempat seperti apa?</p>
          <p className="mt-3 font-mincho text-lg text-[#D9B66D]">
            <ruby>会社<rt>かいしゃ</rt></ruby>の<ruby>寮<rt>りょう</rt></ruby>に<ruby>住<rt>す</rt></ruby>んでいます。
          </p>
          <p className="mt-1 text-xs text-[#A9A398]">Saya tinggal di asrama perusahaan.</p>
        </div>
        <p className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-3 text-[10px] leading-5 text-[#817A73]">
          Semua nama tempat dan contoh tempat tinggal di latihan ini bersifat
          fiktif. Kamu tidak perlu menulis alamat atau informasi rumah yang
          sebenarnya.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C93438]/15 text-[#E46A6D]">
            <Settings size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 05
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Membaca tombol mesin cuci dan remote AC
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Label tombol pada peralatan rumah tangga sering memakai kata Jepang
          yang singkat. Pelajari arti dasar berikut agar kamu bisa mengenali
          fungsi tombol ketika melihat panel atau remote.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
            <div className="border-b border-white/[0.07] bg-[#2B2118] p-4">
              <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
                WASHING MACHINE
              </p>
              <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">
                <ruby>洗濯機<rt>せんたくき</rt></ruby> · Mesin cuci
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              {[
                { jp: "入", reading: "いり · ON", meaning: "Daya nyala", detail: "Menyalakan mesin" },
                { jp: "切", reading: "きり · OFF", meaning: "Daya mati", detail: "Mematikan mesin" },
                { jp: "スタート", reading: "sutaato", meaning: "Mulai", detail: "Memulai proses mencuci" },
                { jp: "一時停止", reading: "いちじていし", meaning: "Jeda", detail: "Menghentikan sementara" },
                { jp: "コース", reading: "koosu", meaning: "Mode", detail: "Memilih jenis cucian" },
                { jp: "水量", reading: "すいりょう", meaning: "Jumlah air", detail: "Mengatur air" },
                { jp: "予約", reading: "よやく", meaning: "Timer", detail: "Mengatur waktu mulai" },
              ].map((item) => (
                <div
                  key={item.jp}
                  className="rounded-lg border border-white/[0.07] bg-black/15 p-3"
                >
                  <JapaneseVocabularyReading reading={item.reading} meaning={item.meaning}
                  contentClassName="text-center font-mincho text-xl font-black text-[#F1EBDD]"
                  kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]"
                  romajiClassName="mt-1 mt-1 text-center text-[9px] text-[#B8860B]"
                  translationClassName="mt-2 mt-2 text-center text-xs font-bold text-[#D9B66D]"
                >
                  {item.jp}
                </JapaneseVocabularyReading>
                  <p className="mt-1 text-center text-[9px] leading-4 text-[#817A73]">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
            <div className="border-b border-white/[0.07] bg-[#2B2118] p-4">
              <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
                AIR CONDITIONER REMOTE
              </p>
              <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">
                エアコン · Remote AC
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              {[
                { jp: "冷房", reading: "れいぼう", meaning: "Pendingin", icon: "❄️" },
                { jp: "暖房", reading: "だんぼう", meaning: "Pemanas", icon: "🔥" },
                { jp: "除湿", reading: "じょしつ", meaning: "Pengurang lembap", icon: "💧" },
                { jp: "自動", reading: "じどう", meaning: "Otomatis", icon: "🔄" },
                { jp: "温度", reading: "おんど", meaning: "Suhu", icon: "🌡️" },
                { jp: "停止", reading: "ていし", meaning: "Berhenti", icon: "⏹️" },
              ].map((item) => (
                <div
                  key={item.jp}
                  className="rounded-lg border border-white/[0.07] bg-black/15 p-3 text-center"
                >
                  <span className="text-xl">{item.icon}</span>
                  <JapaneseVocabularyReading
                    reading={item.reading}
                    meaning={item.meaning}
                    contentClassName="mt-1 font-mincho text-xl font-black leading-relaxed text-[#F1EBDD]"
                    kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]"
                    romajiClassName="mt-1 text-sm italic text-[#B8860B]"
                    translationClassName="mt-2 text-xs font-bold text-[#D9B66D]"
                  >
                    {item.jp}
                  </JapaneseVocabularyReading>
                </div>
              ))}
            </div>
          </article>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#1B1A18] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Settings size={15} className="text-[#D9B66D]" />
            <p className="text-xs font-bold text-[#E7D2A1]">
              Praktik interaktif · Pilih tombol yang tepat
            </p>
          </div>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">
            Pilih tombol untuk empat situasi. Ini simulasi membaca label, bukan
            mengoperasikan peralatan sungguhan.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block rounded-xl border border-white/[0.07] bg-black/15 p-3">
              <span className="block text-xs font-bold text-[#EAE6DD]">
                1. Ingin menyalakan mesin cuci
              </span>
              <select
                value={washerPower}
                onChange={(event) => {
                  setWasherPower(event.target.value);
                  setAppliancePracticeSubmitted(false);
                }}
                className="mt-2 w-full rounded-lg border border-white/[0.1] bg-[#24221F] px-3 py-2.5 text-sm text-[#F1EBDD] outline-none focus:border-[#B8860B]/50"
              >
                <option value="入">入 · ON</option>
                <option value="切">切 · OFF</option>
                <option value="予約">予約 · Timer</option>
              </select>
            </label>
            <label className="block rounded-xl border border-white/[0.07] bg-black/15 p-3">
              <span className="block text-xs font-bold text-[#EAE6DD]">
                2. Mulai proses mencuci
              </span>
              <select
                value={washerAction}
                onChange={(event) => {
                  setWasherAction(event.target.value);
                  setAppliancePracticeSubmitted(false);
                }}
                className="mt-2 w-full rounded-lg border border-white/[0.1] bg-[#24221F] px-3 py-2.5 text-sm text-[#F1EBDD] outline-none focus:border-[#B8860B]/50"
              >
                <option value="スタート">スタート · Mulai</option>
                <option value="コース">コース · Mode</option>
                <option value="水量">水量 · Jumlah air</option>
              </select>
            </label>
            <label className="block rounded-xl border border-white/[0.07] bg-black/15 p-3">
              <span className="block text-xs font-bold text-[#EAE6DD]">
                3. Ruangan terasa panas, ingin didinginkan
              </span>
              <select
                value={airMode}
                onChange={(event) => {
                  setAirMode(event.target.value);
                  setAppliancePracticeSubmitted(false);
                }}
                className="mt-2 w-full rounded-lg border border-white/[0.1] bg-[#24221F] px-3 py-2.5 text-sm text-[#F1EBDD] outline-none focus:border-[#B8860B]/50"
              >
                <option value="冷房">冷房 · Pendingin</option>
                <option value="暖房">暖房 · Pemanas</option>
                <option value="除湿">除湿 · Pengurang lembap</option>
              </select>
            </label>
            <label className="block rounded-xl border border-white/[0.07] bg-black/15 p-3">
              <span className="block text-xs font-bold text-[#EAE6DD]">
                4. Cuaca dingin, ingin menghangatkan ruangan
              </span>
              <select
                value={heaterMode}
                onChange={(event) => {
                  setHeaterMode(event.target.value);
                  setAppliancePracticeSubmitted(false);
                }}
                className="mt-2 w-full rounded-lg border border-white/[0.1] bg-[#24221F] px-3 py-2.5 text-sm text-[#F1EBDD] outline-none focus:border-[#B8860B]/50"
              >
                <option value="暖房">暖房 · Pemanas</option>
                <option value="冷房">冷房 · Pendingin</option>
                <option value="停止">停止 · Berhenti</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAppliancePracticeSubmitted(true)}
              className="rounded-lg bg-[#C93438] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E]"
            >
              Periksa pilihan
            </button>
            <button
              type="button"
              onClick={resetAppliancePractice}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-4 py-2.5 text-xs font-bold text-[#C7C1B5] hover:border-[#B8860B]/40"
            >
              <RefreshCw size={13} />
              Atur ulang
            </button>
          </div>
          {appliancePracticeSubmitted && (
            <div
              role="status"
              className={
                "mt-4 rounded-xl border p-3 " +
                (appliancePracticeCorrect
                  ? "border-emerald-500/25 bg-emerald-500/10"
                  : "border-[#D6AD4F]/20 bg-[#B8860B]/10")
              }
            >
              <p className={"text-xs font-bold " + (appliancePracticeCorrect ? "text-emerald-200" : "text-[#E7D2A1]")}>
                {appliancePracticeCorrect ? "Semua pilihan tepat!" : "Masih ada pilihan yang perlu diperiksa."}
              </p>
              <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">
                {appliancePracticeCorrect
                  ? "Kamu sudah mengenali tombol ON, mulai, pendingin, dan pemanas."
                  : <>Ingat: <ruby>入<rt>いり</rt></ruby> = ON, スタート = mulai, <ruby>冷房<rt>れいぼう</rt></ruby> = pendingin, dan <ruby>暖房<rt>だんぼう</rt></ruby> = pemanas. Ubah pilihan lalu periksa lagi.</>}
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
            Pola penting Pelajaran 7
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              01 · MENJELASKAN TEMPAT
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              ここは【tempat】です
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              ここは<ruby>玄関<rt>げんかん</rt></ruby>です。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Gunakan untuk menyebut tempat yang sedang ditunjuk atau dijelaskan.
              ここ berarti “di sini”.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              02 · MENYATAKAN KEBERADAAN
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              【tempat】に Nがあります
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              <ruby>台所<rt>だいどころ</rt></ruby>に<ruby>冷蔵庫<rt>れいぞうこ</rt></ruby>があります。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              に menunjukkan lokasi keberadaan benda. が menandai benda yang ada.
              Untuk jumlah, letakkan jumlah sebelum あります.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              03 · MENYATAKAN TIDAK ADA
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              Nはありません／ないです
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              ベッドはありません。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Kedua bentuk ini berarti tidak ada. ありません adalah bentuk
              negatif sopan dari あります.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              04 · KATA SIFAT POSITIF
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              ナA-です ／ イA-いです
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              <ruby>家<rt>いえ</rt></ruby>は<ruby>静<rt>しず</rt></ruby>かです。／ちょっとせまいです。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              kata sifat -na menggunakan bentuk dasar tanpa な sebelum です.
              kata sifat -i mempertahankan akhiran い sebelum です.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4 sm:col-span-2">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              05 · KATA SIFAT NEGATIF
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              ナA-じゃないです ／ イA-くないです
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-black/15 p-3">
                <p className="font-mincho text-base text-[#D9B66D]">
                  <ruby>静<rt>しず</rt></ruby>かじゃないです。
                </p>
                <p className="mt-1 text-xs text-[#A9A398]">
                  Tidak tenang. kata sifat -na: ganti です menjadi じゃないです.
                </p>
              </div>
              <div className="rounded-lg bg-black/15 p-3">
                <p className="font-mincho text-base text-[#D9B66D]">
                  <ruby>広<rt>ひろ</rt></ruby>くないです。
                </p>
                <p className="mt-1 text-xs text-[#A9A398]">
                  Tidak luas. kata sifat -i: ubah い menjadi くないです.
                </p>
              </div>
            </div>
          </article>
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">Catatan khusus</p>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">
            「きれい」 adalah na-adjective, meskipun berakhir dengan bunyi い.
            Jadi bentuknya 「きれいです」 dan 「きれいじゃないです」, bukan
            「きれくないです」.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            KATA-KATA KANJI
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Empat kata kanji dari pelajaran ini
          </h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { jp: <ruby>家<rt>いえ</rt></ruby>, reading: "ie", meaning: "Rumah" },
            { jp: <><ruby>新<rt>あたら</rt></ruby>しい</>, reading: "atarashii", meaning: "Baru" },
            { jp: <><ruby>広<rt>ひろ</rt></ruby>い</>, reading: "hiroi", meaning: "Luas" },
            { jp: <><ruby>古<rt>ふる</rt></ruby>い</>, reading: "furui", meaning: "Lama / tua" },
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
            Mengenal rumah dan tempat tinggal di Jepang
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]"><ruby>玄関<rt>げんかん</rt></ruby> · Genkan</h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Area pintu masuk biasanya memiliki perbedaan tinggi antara bagian
              luar dan bagian dalam rumah. Sepatu dilepas di area ini sebelum
              masuk ke dalam rumah.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]"><ruby>和室<rt>わしつ</rt></ruby> · Washitsu</h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Ruang bergaya tradisional Jepang biasanya memakai tatami.
              Sebagian ruangan memiliki pintu geser dan lemari penyimpanan
              untuk futon.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">Futon</h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Futon dapat dibentangkan di lantai untuk tidur dan disimpan
              kembali setelah digunakan. Menjemur atau mengeringkannya secara
              berkala membantu menjaga alas tidur tetap nyaman.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">Jenis hunian</h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Istilah seperti アパート、マンション、<ruby>寮<rt>りょう</rt></ruby>、シェアハウス、
              dan <ruby>一戸建て<rt>いっこだて</rt></ruby> menunjukkan jenis tempat tinggal yang berbeda.
              Penggunaan istilah dapat bergantung pada ukuran dan bentuk
              bangunan.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4 sm:col-span-2">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Susunan alamat Jepang
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Alamat Jepang umumnya ditulis dari wilayah yang lebih besar ke
              bagian yang lebih kecil, seperti prefektur, kota atau distrik,
              area, lalu nomor blok dan bangunan. Pada materi ini kita cukup
              mengenali urutannya; tidak perlu menuliskan alamat sebenarnya.
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
          Nilai kemampuanmu setelah mencoba tur rumah, dialog fasilitas,
          percakapan tempat tinggal, dan latihan tombol alat rumah tangga.
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
                        saveIrodoriSelfEvaluation("starter-07", nextRatings);
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
              onClick={() => completeIrodoriLesson("starter-07")}
              disabled={!quizSubmitted || !appliancePracticeSubmitted || !appliancePracticeCorrect || !canDosRated}
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
        {!quizSubmitted || !appliancePracticeSubmitted || !appliancePracticeCorrect || !canDosRated ? (
          <p className="mt-2 text-[10px] leading-5 text-[#817A73]">
            Selesaikan kuis, jawab benar praktik tombol peralatan, dan isi
            kelima penilaian target komunikasi untuk menyelesaikan pelajaran.
          </p>
        ) : null}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Materi dan dialog contoh disusun orisinal oleh Fude sebagai latihan
        komunikasi tingkat pemula. Contoh tempat tinggal dalam materi ini
        bersifat fiktif.
      </p>
    </main>
  );
}
