"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ClipboardList,
  Package,
  RefreshCw,
  Users,
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

const workplaceTourConversation: IrodoriUtterance[] = [
  {
    speakerId: "kenji",
    japanese: <>こちらへどうぞ。<ruby>部屋<rt>へや</rt></ruby>を<ruby>案内<rt>あんない</rt></ruby>します。</>,
    romaji: "Kochira e douzo. Heya o annai shimasu.",
    translation: "Silakan lewat sini. Saya akan menunjukkan ruangan.",
    audioFileName: "irodori-starter-08-a01-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ありがとうございます。</>,
    romaji: "Arigatou gozaimasu.",
    translation: "Terima kasih.",
    audioFileName: "irodori-starter-08-a01-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>ここは<ruby>会議室<rt>かいぎしつ</rt></ruby>です。ここで<ruby>会議<rt>かいぎ</rt></ruby>をします。</>,
    romaji: "Koko wa kaigishitsu desu. Koko de kaigi o shimasu.",
    translation: "Ini ruang rapat. Rapat dilakukan di sini.",
    audioFileName: "irodori-starter-08-a01-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>あちらは<ruby>何<rt>なん</rt></ruby>の<ruby>部屋<rt>へや</rt></ruby>ですか？</>,
    romaji: "Achira wa nan no heya desu ka?",
    translation: "Ruangan yang di sana itu ruangan apa?",
    audioFileName: "irodori-starter-08-a01-l04.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>あそこは<ruby>休憩室<rt>きゅうけいしつ</rt></ruby>です。ここで<ruby>休<rt>やす</rt></ruby>みます。</>,
    romaji: "Asoko wa kyuukeishitsu desu. Koko de yasumimasu.",
    translation: "Itu ruang istirahat. Kita beristirahat di sini.",
    audioFileName: "irodori-starter-08-a01-l05.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>わかりました。ありがとうございます。</>,
    romaji: "Wakarimashita. Arigatou gozaimasu.",
    translation: "Saya mengerti. Terima kasih.",
    audioFileName: "irodori-starter-08-a01-l06.mp3",
  },
];

const personLocationConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>すみません。<ruby>山田<rt>やまだ</rt></ruby>さんは、どこにいますか？</>,
    romaji: "Sumimasen. Yamada-san wa, doko ni imasu ka?",
    translation: "Permisi. Yamada ada di mana?",
    audioFileName: "irodori-starter-08-a02-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <><ruby>食堂<rt>しょくどう</rt></ruby>にいますよ。</>,
    romaji: "Shokudou ni imasu yo.",
    translation: "Ada di kantin.",
    audioFileName: "irodori-starter-08-a02-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <><ruby>佐藤<rt>さとう</rt></ruby>さんは、いますか？</>,
    romaji: "Satou-san wa, imasu ka?",
    translation: "Apakah Sato ada?",
    audioFileName: "irodori-starter-08-a02-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>すみません。<ruby>今<rt>いま</rt></ruby>、いません。たぶん<ruby>会議室<rt>かいぎしつ</rt></ruby>です。</>,
    romaji: "Sumimasen. Ima, imasen. Tabun kaigishitsu desu.",
    translation: "Maaf, sekarang tidak ada di sini. Mungkin di ruang rapat.",
    audioFileName: "irodori-starter-08-a02-l04.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>そうですか。ありがとうございます。</>,
    romaji: "Sou desu ka. Arigatou gozaimasu.",
    translation: "Begitu ya. Terima kasih.",
    audioFileName: "irodori-starter-08-a02-l05.mp3",
  },
];

const equipmentLocationConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>あのう、はさみはどこにありますか？</>,
    romaji: "Anou, hasami wa doko ni arimasu ka?",
    translation: "Permisi, gunting ada di mana?",
    audioFileName: "irodori-starter-08-a03-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>ここにあります。<ruby>机<rt>つくえ</rt></ruby>の<ruby>上<rt>うえ</rt></ruby>です。</>,
    romaji: "Koko ni arimasu. Tsukue no ue desu.",
    translation: "Ada di sini. Di atas meja.",
    audioFileName: "irodori-starter-08-a03-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>のりは、どこですか？</>,
    romaji: "Nori wa, doko desu ka?",
    translation: "Kalau lem, ada di mana?",
    audioFileName: "irodori-starter-08-a03-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <><ruby>引<rt>ひ</rt></ruby>き<ruby>出<rt>だ</rt></ruby>しの<ruby>中<rt>なか</rt></ruby>にあります。</>,
    romaji: "Hikidashi no naka ni arimasu.",
    translation: "Ada di dalam laci.",
    audioFileName: "irodori-starter-08-a03-l04.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ごみ<ruby>箱<rt>ばこ</rt></ruby>は、どこですか？</>,
    romaji: "Gomibako wa, doko desu ka?",
    translation: "Tempat sampah ada di mana?",
    audioFileName: "irodori-starter-08-a03-l05.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>あそこです。<ruby>机<rt>つくえ</rt></ruby>の<ruby>下<rt>した</rt></ruby>にあります。</>,
    romaji: "Asoko desu. Tsukue no shita ni arimasu.",
    translation: "Di sana. Ada di bawah meja.",
    audioFileName: "irodori-starter-08-a03-l06.mp3",
  },
];

const roomSignConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>この<ruby>表示<rt>ひょうじ</rt></ruby>は、<ruby>何<rt>なん</rt></ruby>ですか？</>,
    romaji: "Kono hyouji wa, nan desu ka?",
    translation: "Tulisan penanda ini artinya apa?",
    audioFileName: "irodori-starter-08-a04-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>「<ruby>事務室<rt>じむしつ</rt></ruby>」です。</>,
    romaji: "Jimushitsu desu.",
    translation: "Itu “ruang kantor”.",
    audioFileName: "irodori-starter-08-a04-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>ここで<ruby>何<rt>なに</rt></ruby>をしますか？</>,
    romaji: "Koko de nani o shimasu ka?",
    translation: "Apa yang dilakukan di sini?",
    audioFileName: "irodori-starter-08-a04-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ここで<ruby>仕事<rt>しごと</rt></ruby>をします。</>,
    romaji: "Koko de shigoto o shimasu.",
    translation: "Orang bekerja di sini.",
    audioFileName: "irodori-starter-08-a04-l04.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>わかりました。ありがとうございます。</>,
    romaji: "Wakarimashita. Arigatou gozaimasu.",
    translation: "Saya mengerti. Terima kasih.",
    audioFileName: "irodori-starter-08-a04-l05.mp3",
  },
];

const canDos = [
  { id: "workplace-tour", text: "Memahami penjelasan sederhana ketika diajak melihat ruangan di tempat kerja." },
  { id: "person-location", text: "Menanyakan dan menjawab lokasi seseorang di dalam gedung." },
  { id: "equipment-location", text: "Menanyakan dan menjawab lokasi barang atau perlengkapan." },
  { id: "room-signs", text: "Mengenali nama ruangan dari papan atau tanda di pintu masuk." },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Sudah bisa, masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

const workplaceRooms = [
  { jp: <ruby>会議室<rt>かいぎしつ</rt></ruby>, reading: "kaigishitsu", meaning: "Ruang rapat", icon: "🗣️", activity: <>ここで<ruby>会議<rt>かいぎ</rt></ruby>をします。</> },
  { jp: <ruby>食堂<rt>しょくどう</rt></ruby>, reading: "shokudou", meaning: "Kantin", icon: "🍱", activity: <>ここで<ruby>ご飯<rt>ごはん</rt></ruby>を<ruby>食<rt>た</rt></ruby>べます。</> },
  { jp: <ruby>休憩室<rt>きゅうけいしつ</rt></ruby>, reading: "kyuukeishitsu", meaning: "Ruang istirahat", icon: "☕", activity: <>ここで<ruby>休<rt>やす</rt></ruby>みます。</> },
  { jp: <ruby>事務室<rt>じむしつ</rt></ruby>, reading: "jimushitsu", meaning: "Ruang kantor", icon: "💻", activity: <>ここで<ruby>仕事<rt>しごと</rt></ruby>をします。</> },
  { jp: <ruby>受付<rt>うけつけ</rt></ruby>, reading: "uketsuke", meaning: "Resepsionis", icon: "🛎️", activity: <>ここで<ruby>質問<rt>しつもん</rt></ruby>をします。</> },
  { jp: <ruby>倉庫<rt>そうこ</rt></ruby>, reading: "souko", meaning: "Gudang", icon: "📦", activity: <>ここに<ruby>道具<rt>どうぐ</rt></ruby>があります。</> },
  { jp: <ruby>更衣室<rt>こういしつ</rt></ruby>, reading: "kouishitsu", meaning: "Ruang ganti", icon: "👕", activity: <>ここで<ruby>着替<rt>きが</rt></ruby>えます。</> },
  { jp: <ruby>給湯室<rt>きゅうとうしつ</rt></ruby>, reading: "kyuutoushitsu", meaning: "Ruang membuat minuman", icon: "🍵", activity: <>ここでお<ruby>茶<rt>ちゃ</rt></ruby>をいれます。</> },
];

const officeItems = [
  { jp: "はさみ", reading: "hasami", meaning: "Gunting", icon: "✂️" },
  { jp: "のり", reading: "nori", meaning: "Lem", icon: "🧴" },
  { jp: <><ruby>机<rt>つくえ</rt></ruby></>, reading: "tsukue", meaning: "Meja", icon: "🪑" },
  { jp: <><ruby>引<rt>ひ</rt></ruby>き<ruby>出<rt>だ</rt></ruby>し</>, reading: "hikidashi", meaning: "Laci", icon: "🗄️" },
  { jp: <>ごみ<ruby>箱<rt>ばこ</rt></ruby></>, reading: "gomibako", meaning: "Tempat sampah", icon: "🗑️" },
  { jp: <ruby>複合機<rt>ふくごうき</rt></ruby>, reading: "fukugouki", meaning: "Mesin fotokopi / printer", icon: "🖨️" },
  { jp: <ruby>電話<rt>でんわ</rt></ruby>, reading: "denwa", meaning: "Telepon", icon: "☎️" },
  { jp: <ruby>書類<rt>しょるい</rt></ruby>, reading: "shorui", meaning: "Dokumen", icon: "📄" },
];

const positionWords = [
  { jp: <ruby>上<rt>うえ</rt></ruby>, reading: "ue", meaning: "Di atas", icon: "⬆️" },
  { jp: <ruby>下<rt>した</rt></ruby>, reading: "shita", meaning: "Di bawah", icon: "⬇️" },
  { jp: <ruby>中<rt>なか</rt></ruby>, reading: "naka", meaning: "Di dalam", icon: "📦" },
  { jp: <ruby>横<rt>よこ</rt></ruby>, reading: "yoko", meaning: "Di samping", icon: "↔️" },
];

const roomSigns = [
  { jp: <ruby>会議室<rt>かいぎしつ</rt></ruby>, meaning: "Ruang rapat", icon: "🗣️", detail: "Tempat orang berdiskusi dan mengadakan rapat." },
  { jp: <ruby>食堂<rt>しょくどう</rt></ruby>, meaning: "Kantin", icon: "🍱", detail: "Tempat orang makan." },
  { jp: <ruby>事務室<rt>じむしつ</rt></ruby>, meaning: "Ruang kantor", icon: "💻", detail: "Tempat staf mengerjakan pekerjaan administrasi." },
  { jp: <ruby>受付<rt>うけつけ</rt></ruby>, meaning: "Resepsionis", icon: "🛎️", detail: "Tempat pengunjung bertanya atau menyampaikan keperluan." },
  { jp: <ruby>倉庫<rt>そうこ</rt></ruby>, meaning: "Gudang", icon: "📦", detail: "Tempat menyimpan barang dan perlengkapan." },
  { jp: <ruby>更衣室<rt>こういしつ</rt></ruby>, meaning: "Ruang ganti", icon: "👕", detail: "Tempat berganti pakaian." },
];

const practiceTasks: {
  prompt: ReactNode;
  options: { value: string; label: string }[];
  answer: string;
  explanation: string;
}[] = [
  {
    prompt: <>Di manakah <ruby>山田<rt>やまだ</rt></ruby>さん berada?</>,
    options: [
      { value: "a", label: "かいぎしつ (ruang rapat)" },
      { value: "b", label: "しょくどう (kantin)" },
      { value: "c", label: "そうこ (gudang)" },
    ],
    answer: "b",
    explanation: "Dalam informasi latihan, Yamada berada di kantin: しょくどうにいます。",
  },
  {
    prompt: <>Jawaban yang tepat ketika <ruby>佐藤<rt>さとう</rt></ruby>さん sedang tidak ada di sini adalah…</>,
    options: [
      { value: "a", label: "います。" },
      { value: "b", label: "いません。" },
      { value: "c", label: "あります。" },
    ],
    answer: "b",
    explanation: "いません adalah bentuk negatif dari います untuk menyatakan seseorang tidak ada.",
  },
  {
    prompt: <>Di manakah gunting berada pada ilustrasi meja latihan?</>,
    options: [
      { value: "a", label: "つくえのうえ (di atas meja)" },
      { value: "b", label: "つくえのした (di bawah meja)" },
      { value: "c", label: "ひきだしのなか (di dalam laci)" },
    ],
    answer: "a",
    explanation: "Untuk benda, gunakan あります: はさみはつくえのうえにあります。",
  },
  {
    prompt: <>Di manakah lem disimpan?</>,
    options: [
      { value: "a", label: "つくえのよこ (di samping meja)" },
      { value: "b", label: "ひきだしのなか (di dalam laci)" },
      { value: "c", label: "食堂 (di kantin)" },
    ],
    answer: "b",
    explanation: "Posisi di dalam sesuatu dinyatakan dengan のなか: ひきだしのなかにあります。",
  },
  {
    prompt: <>Papan nama 「<ruby>会議室<rt>かいぎしつ</rt></ruby>」 menunjukkan ruangan untuk…</>,
    options: [
      { value: "a", label: "Makan bersama" },
      { value: "b", label: "Menyimpan barang" },
      { value: "c", label: "Rapat atau diskusi" },
    ],
    answer: "c",
    explanation: "会議室 (kaigishitsu) berarti ruang rapat.",
  },
];

const quizQuestions: {
  prompt: ReactNode;
  options: { key: string; label: ReactNode }[];
  answer: string;
  explanation: ReactNode;
}[] = [
  {
    prompt: <>Partikel で pada kalimat 「ここで<ruby>会議<rt>かいぎ</rt></ruby>をします」 menunjukkan…</>,
    options: [
      { key: "a", label: "Tempat berlangsungnya suatu aktivitas." },
      { key: "b", label: "Pemilik suatu benda." },
      { key: "c", label: "Waktu suatu kejadian." },
    ],
    answer: "a",
    explanation: "で menandai tempat suatu tindakan dilakukan.",
  },
  {
    prompt: <>Bagaimana mengatakan “Yamada berada di kantin”?</>,
    options: [
      { key: "a", label: <><ruby>山田<rt>やまだ</rt></ruby>さんは<ruby>食堂<rt>しょくどう</rt></ruby>にあります。</> },
      { key: "b", label: <><ruby>山田<rt>やまだ</rt></ruby>さんは<ruby>食堂<rt>しょくどう</rt></ruby>にいます。</> },
      { key: "c", label: <><ruby>山田<rt>やまだ</rt></ruby>さんは<ruby>食堂<rt>しょくどう</rt></ruby>であります。</> },
    ],
    answer: "b",
    explanation: "います dipakai untuk menyatakan lokasi orang dan hewan.",
  },
  {
    prompt: <>Pertanyaan yang tepat untuk mencari seseorang adalah…</>,
    options: [
      { key: "a", label: <>どこにありますか？</> },
      { key: "b", label: <>どこにいますか？</> },
      { key: "c", label: <>どこでしますか？</> },
    ],
    answer: "b",
    explanation: "どこにいますか？ berarti “ada di mana?” ketika yang dicari adalah orang atau hewan.",
  },
  {
    prompt: <>Bentuk negatif dari います yang berarti “tidak ada (orang)” adalah…</>,
    options: [
      { key: "a", label: <>いません。</> },
      { key: "b", label: <>ありません。</> },
      { key: "c", label: <>いますです。</> },
    ],
    answer: "a",
    explanation: "いません adalah bentuk negatif sopan dari います. いないです juga memiliki arti yang sama.",
  },
  {
    prompt: <>Untuk menanyakan lokasi gunting, kalimat yang tepat adalah…</>,
    options: [
      { key: "a", label: <>はさみはどこにいますか？</> },
      { key: "b", label: <>はさみはどこにありますか？</> },
      { key: "c", label: <>はさみはどこでありますか？</> },
    ],
    answer: "b",
    explanation: "あります digunakan untuk benda, sedangkan います digunakan untuk orang dan hewan.",
  },
  {
    prompt: <>Kapan kata ここ digunakan untuk menunjukkan lokasi?</>,
    options: [
      { key: "a", label: "Untuk tempat yang dekat dengan pembicara." },
      { key: "b", label: "Untuk tempat yang dekat dengan pendengar." },
      { key: "c", label: "Untuk tempat yang jauh dari pembicara dan pendengar." },
    ],
    answer: "a",
    explanation: "ここ dekat dengan pembicara, そこ dekat dengan pendengar, dan あそこ jauh dari keduanya.",
  },
  {
    prompt: <>Arti dari 「<ruby>机<rt>つくえ</rt></ruby>の<ruby>下<rt>した</rt></ruby>」 adalah…</>,
    options: [
      { key: "a", label: "Di atas meja." },
      { key: "b", label: "Di dalam meja." },
      { key: "c", label: "Di bawah meja." },
    ],
    answer: "c",
    explanation: "Kata した (shita) berarti bagian bawah.",
  },
  {
    prompt: <>「<ruby>引<rt>ひ</rt></ruby>き<ruby>出<rt>だ</rt></ruby>しの<ruby>中<rt>なか</rt></ruby>にあります」 berarti…</>,
    options: [
      { key: "a", label: "Ada di samping laci." },
      { key: "b", label: "Ada di dalam laci." },
      { key: "c", label: "Ada di atas laci." },
    ],
    answer: "b",
    explanation: "Pola N の中 berarti “di dalam N”.",
  },
  {
    prompt: <>Papan nama 「<ruby>食堂<rt>しょくどう</rt></ruby>」 menunjukkan…</>,
    options: [
      { key: "a", label: "Kantin atau ruang makan." },
      { key: "b", label: "Ruang ganti." },
      { key: "c", label: "Gudang." },
    ],
    answer: "a",
    explanation: "食堂 (shokudou) adalah tempat untuk makan.",
  },
  {
    prompt: <>Pasangan kata kerja yang benar untuk membedakan orang dan benda adalah…</>,
    options: [
      { key: "a", label: "Orang: あります · Benda: います" },
      { key: "b", label: "Orang: います · Benda: あります" },
      { key: "c", label: "Orang dan benda selalu memakai います" },
    ],
    answer: "b",
    explanation: "います digunakan untuk orang/hewan, sedangkan あります untuk benda.",
  },
];

export default function IrodoriPemulaLessonEightPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const progress = useIrodoriProgress();
  const ratings = progress.selfEvaluations["starter-08"] ?? {};
  const isCompleted = progress.completedLessons.includes("starter-08");

  const answeredCount = Object.keys(answers).length;
  const score = quizQuestions.filter(
    (question, index) => answers[index] === question.answer
  ).length;
  const practiceAnsweredCount = Object.keys(practiceAnswers).length;
  const practiceScore = practiceTasks.filter(
    (task, index) => practiceAnswers[index] === task.answer
  ).length;
  const canDosRated = canDos.every((canDo) => Boolean(ratings[canDo.id]));
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;

  const resetQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
  };

  const resetPractice = () => {
    setPracticeAnswers({});
    setPracticeSubmitted(false);
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
          職
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">
            TOPIC 04 • HOMES AND WORKPLACES
          </p>
          <p className="mt-5 text-sm font-semibold text-[#B9A98B]">
            Pelajaran 8
          </p>
          <h1 className="mt-1 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Yamada ada di mana?</h1>
          <p className="mt-2 font-mincho text-2xl text-[#D9B66D]">
            <ruby>山田<rt>やまだ</rt></ruby>さんはどこにいますか？
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#B6B0A5]">
            Kenali ruangan di tempat kerja, tanyakan lokasi seseorang dan
            perlengkapan, lalu baca papan nama yang biasa dipasang di pintu
            ruangan. Semua contoh tempat dan nama di halaman ini bersifat fiktif.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              4 target target komunikasi
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
            <Building2 size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 01
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Mengikuti tur ruangan di tempat kerja
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Saat diajak melihat sebuah gedung, dengarkan nama ruangannya dan
          kegiatan yang dilakukan di sana. Partikel で menunjukkan tempat
          berlangsungnya suatu aktivitas: 「ここで<ruby>会議<rt>かいぎ</rt></ruby>をします」 berarti
          “Rapat dilakukan di sini”.
        </p>
        <IrodoriConversation
          title="Scene A · Tur gedung contoh"
          speakers={[IRODORI_SPEAKERS.kenji, IRODORI_SPEAKERS.yui]}
          utterances={workplaceTourConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {workplaceRooms.map((room) => (
            <article
              key={room.reading}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <div className="flex h-12 items-center justify-center rounded-lg bg-black/15 text-2xl">
                {room.icon}
              </div>
              <p className="mt-3 font-mincho text-base font-bold text-[#F1EBDD]">
                {room.jp}
              </p>
              <p className="text-[10px] italic text-[#B8860B]">{room.reading}</p>
              <p className="mt-1 text-xs text-[#A9A398]">{room.meaning}</p>
              <p className="mt-2 border-t border-white/[0.06] pt-2 font-mincho text-xs leading-5 text-[#D9B66D]">
                {room.activity}
              </p>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">
            Pola untuk menjelaskan fungsi ruangan
          </p>
          <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">
            ここは<ruby>食堂<rt>しょくどう</rt></ruby>です。ここでご飯を<ruby>食<rt>た</rt></ruby>べます。
          </p>
          <p className="mt-1 text-xs leading-5 text-[#A9A398]">
            Ini kantin. Kita makan di sini.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4B8B9B]/15 text-[#8FCAD4]">
            <Users size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 02
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Menanyakan lokasi seseorang
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Untuk menanyakan keberadaan orang, gunakan 「どこにいますか？」.
          Jawaban dapat menyebutkan ruangan dengan partikel に. Jika orangnya
          tidak ada, gunakan 「いません」 atau 「いないです」.
        </p>
        <IrodoriConversation
          title="Scene B · Mencari rekan di gedung"
          speakers={[IRODORI_SPEAKERS.yui, IRODORI_SPEAKERS.sota]}
          utterances={personLocationConversation}
        />
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
          <div className="border-b border-white/[0.07] bg-[#2B2118] p-4">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
              FUDE OFFICE · DENAH FIKTIF
            </p>
            <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">
              <ruby>人<rt>ひと</rt></ruby>を<ruby>探<rt>さが</rt></ruby>しています · Sedang mencari seseorang
            </h3>
            <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">
              Lihat nama ruangan pada denah contoh. Lokasi nama dan karakter di
              sini hanya untuk latihan.
            </p>
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Yamada", room: <ruby>食堂<rt>しょくどう</rt></ruby>, icon: "🍱", status: "Ada di kantin" },
              { name: "Nagai", room: <ruby>会議室<rt>かいぎしつ</rt></ruby>, icon: "🗣️", status: "Ada di ruang rapat" },
              { name: "Tsuji", room: <ruby>倉庫<rt>そうこ</rt></ruby>, icon: "📦", status: "Ada di gudang" },
            ].map((person) => (
              <article
                key={person.name}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/15 p-3"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#B8860B]/10 text-2xl">
                  {person.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#EAE6DD]">{person.name}-san</p>
                  <p className="font-mincho text-sm text-[#D9B66D]">{person.room}</p>
                  <p className="text-[10px] text-[#A9A398]">{person.status}</p>
                </div>
              </article>
            ))}
            <article className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/15 p-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-2xl">
                👤
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#EAE6DD]">Amanda-san</p>
                <p className="font-mincho text-sm text-[#D9B66D]">—</p>
                <p className="text-[10px] text-[#A9A398]">Tidak disebutkan berada di gedung</p>
              </div>
            </article>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              BERTANYA
            </p>
            <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">
              <ruby>山田<rt>やまだ</rt></ruby>さんは、どこにいますか？
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">Yamada ada di mana?</p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              MENJAWAB
            </p>
            <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">
              <ruby>食堂<rt>しょくどう</rt></ruby>にいます。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">Ada di kantin.</p>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7D9C69]/15 text-[#A8C791]">
            <Package size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 03
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Menanyakan lokasi perlengkapan
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Untuk benda, gunakan 「あります」. Kata ここ berarti dekat pembicara,
          そこ dekat pendengar, dan あそこ jauh dari keduanya. Lokasi yang lebih
          spesifik bisa dijelaskan dengan 「Nの上・下・中・横」.
        </p>
        <IrodoriConversation
          title="Scene C · Mencari perlengkapan kantor"
          speakers={[IRODORI_SPEAKERS.akiko, IRODORI_SPEAKERS.kenji]}
          utterances={equipmentLocationConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {officeItems.map((item) => (
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
        <div className="rounded-2xl border border-white/[0.08] bg-[#1B1A18] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
                POSITION WORDS
              </p>
              <h3 className="mt-1 text-sm font-bold text-[#EAE6DD]">
                Kata untuk menjelaskan posisi
              </h3>
            </div>
            <span className="text-xl">📍</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {positionWords.map((word) => (
              <div
                key={word.reading}
                className="rounded-xl border border-white/[0.06] bg-black/15 p-3 text-center"
              >
                <span className="text-2xl">{word.icon}</span>
                <JapaneseVocabularyReading
                  reading={word.reading}
                  meaning={word.meaning}
                  contentClassName="mt-1 font-mincho text-xl font-bold leading-relaxed text-[#F1EBDD]"
                  kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]"
                  romajiClassName="mt-1 text-sm italic text-[#B8860B]"
                  translationClassName="mt-2 text-xs text-[#A9A398]"
                >
                  {word.jp}
                </JapaneseVocabularyReading>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              BENDA
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              はさみは、ここにあります。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">Gunting ada di sini.</p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              POSISI SPESIFIK
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              のりは、<ruby>引<rt>ひ</rt></ruby>き<ruby>出<rt>だ</rt></ruby>しの<ruby>中<rt>なか</rt></ruby>にあります。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">Lem ada di dalam laci.</p>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A77FBD]/15 text-[#C7A9DB]">
            <ClipboardList size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 04
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Membaca papan nama ruangan
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Di pintu masuk ruangan, nama tempat sering ditulis pada papan kecil.
          Coba kenali kata yang sering muncul agar kamu bisa menemukan tempat
          yang dituju tanpa harus membaca kalimat panjang.
        </p>
        <IrodoriConversation
          title="Scene D · Memastikan tulisan di pintu"
          speakers={[IRODORI_SPEAKERS.sota, IRODORI_SPEAKERS.akiko]}
          utterances={roomSignConversation}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roomSigns.map((sign, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]"
            >
              <div className="border-b border-white/[0.07] bg-gradient-to-br from-[#3A3329] to-[#201D19] p-3">
                <p className="text-[9px] font-black tracking-[0.18em] text-[#D9B66D]">
                  ROOM SIGN · 0{index + 1}
                </p>
                <div className="mt-3 flex min-h-20 items-center justify-center rounded-lg border-2 border-[#D9B66D]/50 bg-[#E8DFC9] px-2 text-center shadow-lg">
                  <span className="font-mincho text-2xl font-black text-[#352B20] [&_rt]:text-[0.55em]">
                    {sign.jp}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{sign.icon}</span>
                  <p className="text-sm font-bold text-[#F1EBDD]">{sign.meaning}</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#A9A398]">{sign.detail}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">
            Cara cepat mengenali papan nama
          </p>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">
            Perhatikan gabungan kanji dan akhiran kata. Misalnya, kanji <ruby>室<rt>しつ</rt></ruby> sering muncul pada nama ruangan, seperti
            <ruby>会議室<rt>かいぎしつ</rt></ruby> dan <ruby>事務室<rt>じむしつ</rt></ruby>. Untuk tahap
            pemula, cukup kenali beberapa nama ruangan yang sering digunakan.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            CATATAN TATA BAHASA
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Pola penting Pelajaran 8
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              01 · TEMPAT MELAKUKAN AKTIVITAS
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              【place】で V-ます
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              ここで<ruby>会議<rt>かいぎ</rt></ruby>をします。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Partikel で menunjukkan lokasi sebuah tindakan dilakukan.
              Gunakan setelah nama tempat atau kata yang menunjukkan tempat.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              02 · LOKASI ORANG
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              人は place に います
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              <ruby>山田<rt>やまだ</rt></ruby>さんは<ruby>食堂<rt>しょくどう</rt></ruby>にいます。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              います dipakai untuk menyatakan lokasi orang atau hewan.
              Untuk bertanya, gunakan どこにいますか？. Bentuk negatifnya
              adalah いません atau いないです.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              03 · LOKASI BENDA
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              ものは place に あります
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              はさみは、そこにあります。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              あります dipakai untuk benda. ここ dekat pembicara, そこ dekat
              pendengar, dan あそこ jauh dari keduanya. ～です dapat menjadi
              jawaban singkat untuk ～にあります.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              04 · MENJELASKAN POSISI
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              N の 上・下・中・横 に あります
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              <ruby>机<rt>つくえ</rt></ruby>の<ruby>上<rt>うえ</rt></ruby>にあります。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Gunakan の untuk menghubungkan benda acuan dengan posisinya:
              di atas, di bawah, di dalam, atau di samping.
            </p>
          </article>
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">
            Bedakan あります dan います
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-xl text-[#F1EBDD]">あります</p>
              <p className="mt-1 text-xs text-[#A9A398]">Untuk benda atau barang.</p>
              <p className="mt-2 font-mincho text-base text-[#D9B66D]">
                <ruby>机<rt>つくえ</rt></ruby>があります。
              </p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-xl text-[#F1EBDD]">います</p>
              <p className="mt-1 text-xs text-[#A9A398]">Untuk orang atau hewan.</p>
              <p className="mt-2 font-mincho text-base text-[#D9B66D]">
                <ruby>人<rt>ひと</rt></ruby>がいます。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            KATA-KATA KANJI
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Kanji lokasi yang perlu dikenali
          </h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { jp: <ruby>上<rt>うえ</rt></ruby>, reading: "ue", meaning: "Atas" },
            { jp: <ruby>下<rt>した</rt></ruby>, reading: "shita", meaning: "Bawah" },
            { jp: <ruby>中<rt>なか</rt></ruby>, reading: "naka", meaning: "Dalam / tengah" },
          ].map((item) => (
            <article
              key={item.reading}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <JapaneseVocabularyReading reading={item.reading} meaning={item.meaning}
                  contentClassName="font-mincho text-3xl font-bold text-[#F1EBDD]"
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
            Menemukan ruangan di gedung
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Papan nama di pintu
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Kantor, sekolah, dan fasilitas umum dapat memasang nama ruangan
              di dekat pintu. Perhatikan kata seperti 会議室, 事務室, 食堂, dan
              受付 untuk mengetahui fungsi tempat tersebut.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Bertanya dengan sopan
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Awali pertanyaan kepada staf dengan すみません. Setelah
              memperoleh petunjuk, ucapkan ありがとうございます sebagai
              ungkapan terima kasih.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Ruangan memiliki fungsi berbeda
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Nama ruangan membantu pengunjung memahami tempat yang boleh
              dimasuki dan kegiatannya. Ikuti petunjuk gedung atau tanyakan
              kepada petugas ketika belum yakin.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Perlengkapan bersama
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Barang seperti gunting, lem, dan mesin fotokopi dapat disimpan
              di lokasi bersama. Menanyakan 「どこにありますか？」 adalah cara
              sederhana untuk mencari letaknya.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            LATIHAN PRAKTIK
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Cari orang, barang, dan nama ruangan
          </h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Gunakan petunjuk dari dialog dan papan nama. Pilih jawaban terbaik
            untuk kelima situasi berikut.
          </p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => (
            <article
              key={index}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
                LATIHAN 0{index + 1}
              </p>
              <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">
                <JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading>
              </h3>
              <select
                value={practiceAnswers[index] ?? ""}
                onChange={(event) =>
                  setPracticeAnswers((current) => ({
                    ...current,
                    [index]: event.target.value,
                  }))
                }
                disabled={practiceSubmitted}
                className="mt-3 w-full rounded-lg border border-white/10 bg-[#24221F] px-3 py-3 text-xs text-[#EAE6DD] outline-none focus:border-[#D6AD4F]/60 disabled:opacity-70"
              >
                <option value="">Pilih jawaban…</option>
                {task.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
                  </option>
                ))}
              </select>
              {practiceSubmitted && (
                <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">
                  <span
                    className={
                      "mr-1 font-bold " +
                      (practiceAnswers[index] === task.answer
                        ? "text-emerald-300"
                        : "text-[#E7A1A1]")
                    }
                  >
                    {practiceAnswers[index] === task.answer ? "Benar." : "Belum tepat."}
                  </span>
                  <JapaneseReading allowIndexFallback>{task.explanation}</JapaneseReading>
                </p>
              )}
            </article>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">
            {practiceSubmitted
              ? "Hasil praktik: " + practiceScore + " dari " + practiceTasks.length + " benar."
              : practiceAnsweredCount + " dari " + practiceTasks.length + " pertanyaan dijawab."}
          </p>
          {practiceSubmitted ? (
            <button
              type="button"
              onClick={resetPractice}
              className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1] hover:bg-[#B8860B]/10"
            >
              <RefreshCw size={13} />
              Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={practiceAnsweredCount !== practiceTasks.length}
              className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
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
          Nilai kemampuanmu setelah mencoba tur gedung, mencari seseorang,
          mencari perlengkapan, dan membaca papan nama. ★☆☆ berarti sudah bisa
          tetapi masih perlu latihan, ★★☆ berarti sudah bisa, dan ★★★ berarti
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
                        saveIrodoriSelfEvaluation("starter-08", nextRatings);
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
              onClick={() => completeIrodoriLesson("starter-08")}
              disabled={!quizSubmitted || !practiceIsCorrect || !canDosRated}
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
        {!quizSubmitted || !practiceIsCorrect || !canDosRated ? (
          <p className="mt-2 text-[10px] leading-5 text-[#817A73]">
            Selesaikan kuis, jawab benar seluruh praktik lokasi dan papan nama,
            lalu isi keempat penilaian target komunikasi untuk menandai pelajaran selesai.
          </p>
        ) : null}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Dialog dan latihan disusun orisinal oleh Fude untuk pembelajaran
        komunikasi tingkat pemula. Seluruh nama tokoh dan lokasi merupakan
        contoh fiktif.
      </p>
    </main>
  );
}
