"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  RefreshCw,
  Signpost,
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

const facilityConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>すみません。この<ruby>近<rt>ちか</rt></ruby>くに、トイレはありますか？</>,
    romaji: "Sumimasen. Kono chikaku ni, toire wa arimasu ka?",
    translation: "Permisi. Apakah ada toilet di dekat sini?",
    audioFileName: "irodori-starter-14-a01-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい。この<ruby>先<rt>さき</rt></ruby>にありますよ。</>,
    romaji: "Hai. Kono saki ni arimasu yo.",
    translation: "Ya. Ada di depan sana.",
    audioFileName: "irodori-starter-14-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ありがとうございます。ATMはどこですか？</>,
    romaji: "Arigatou gozaimasu. ATM wa doko desu ka?",
    translation: "Terima kasih. ATM ada di mana?",
    audioFileName: "irodori-starter-14-a01-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>あちらです。エレベーターの<ruby>横<rt>よこ</rt></ruby>ですよ。</>,
    romaji: "Achira desu. Erebeetaa no yoko desu yo.",
    translation: "Di sebelah sana, di samping lift.",
    audioFileName: "irodori-starter-14-a01-l04.mp3",
  },
];

const phoneConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>もしもし。アキコさん、<ruby>今<rt>いま</rt></ruby>、どこにいますか？</>,
    romaji: "Moshi moshi. Akiko-san, ima doko ni imasu ka?",
    translation: "Halo. Akiko, sekarang sedang berada di mana?",
    audioFileName: "irodori-starter-14-a02-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>インフォメーションの<ruby>前<rt>まえ</rt></ruby>にいます。</>,
    romaji: "Infomeeshon no mae ni imasu.",
    translation: "Saya berada di depan meja informasi.",
    audioFileName: "irodori-starter-14-a02-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>インフォメーションの<ruby>前<rt>まえ</rt></ruby>ですね。わかりました。</>,
    romaji: "Infomeeshon no mae desu ne. Wakarimashita.",
    translation: "Di depan meja informasi, ya. Baik, saya mengerti.",
    audioFileName: "irodori-starter-14-a02-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>はい。<ruby>大<rt>おお</rt></ruby>きな<ruby>時計<rt>とけい</rt></ruby>の<ruby>下<rt>した</rt></ruby>です。</>,
    romaji: "Hai. Ookina tokei no shita desu.",
    translation: "Ya. Tepat di bawah jam besar.",
    audioFileName: "irodori-starter-14-a02-l04.mp3",
  },
];

const positionConversation: IrodoriUtterance[] = [
  {
    speakerId: "kenji",
    japanese: <>ユイさん、<ruby>今<rt>いま</rt></ruby>、どこですか？</>,
    romaji: "Yui-san, ima doko desu ka?",
    translation: "Yui, sekarang di mana?",
    audioFileName: "irodori-starter-14-a03-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>コンビニの<ruby>中<rt>なか</rt></ruby>です。</>,
    romaji: "Konbini no naka desu.",
    translation: "Di dalam minimarket.",
    audioFileName: "irodori-starter-14-a03-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>わかりました。すぐ、そっちに<ruby>行<rt>い</rt></ruby>きます。</>,
    romaji: "Wakarimashita. Sugu, socchi ni ikimasu.",
    translation: "Baik. Saya segera ke sana.",
    audioFileName: "irodori-starter-14-a03-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>はい。コンビニの<ruby>後<rt>うし</rt></ruby>ろで<ruby>待<rt>ま</rt></ruby>っています。</>,
    romaji: "Hai. Konbini no ushiro de matte imasu.",
    translation: "Baik. Saya menunggu di belakang minimarket.",
    audioFileName: "irodori-starter-14-a03-l04.mp3",
  },
];

const townConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>ここは、あおば<ruby>公園<rt>こうえん</rt></ruby>です。</>,
    romaji: "Koko wa, Aoba kouen desu.",
    translation: "Ini Taman Aoba.",
    audioFileName: "irodori-starter-14-a04-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>わあ、<ruby>広<rt>ひろ</rt></ruby>い<ruby>公園<rt>こうえん</rt></ruby>ですね。</>,
    romaji: "Waa, hiroi kouen desu ne.",
    translation: "Wah, tamannya luas, ya.",
    audioFileName: "irodori-starter-14-a04-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>あの<ruby>建物<rt>たてもの</rt></ruby>は、まちの<ruby>図書館<rt>としょかん</rt></ruby>です。</>,
    romaji: "Ano tatemono wa, machi no toshokan desu.",
    translation: "Bangunan itu adalah perpustakaan kota.",
    audioFileName: "irodori-starter-14-a04-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>きれいな<ruby>建物<rt>たてもの</rt></ruby>ですね。</>,
    romaji: "Kirei na tatemono desu ne.",
    translation: "Bangunannya indah, ya.",
    audioFileName: "irodori-starter-14-a04-l04.mp3",
  },
];

const streetConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>あれは、<ruby>駅<rt>えき</rt></ruby>の<ruby>近<rt>ちか</rt></ruby>くの<ruby>商店街<rt>しょうてんがい</rt></ruby>です。</>,
    romaji: "Are wa, eki no chikaku no shoutengai desu.",
    translation: "Itu adalah kawasan pertokoan dekat stasiun.",
    audioFileName: "irodori-starter-14-a05-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>にぎやかな<ruby>通<rt>とお</rt></ruby>りですね。</>,
    romaji: "Nigiyaka na toori desu ne.",
    translation: "Jalannya ramai, ya.",
    audioFileName: "irodori-starter-14-a05-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>はい。<ruby>古<rt>ふる</rt></ruby>い<ruby>店<rt>みせ</rt></ruby>も、<ruby>新<rt>あたら</rt></ruby>しい<ruby>店<rt>みせ</rt></ruby>もあります。</>,
    romaji: "Hai. Furui mise mo, atarashii mise mo arimasu.",
    translation: "Ya. Ada toko-toko lama dan juga toko baru.",
    audioFileName: "irodori-starter-14-a05-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>いいですね。ゆっくり<ruby>見<rt>み</rt></ruby>たいです。</>,
    romaji: "Ii desu ne. Yukkuri mitai desu.",
    translation: "Menarik, ya. Saya ingin melihat-lihat dengan santai.",
    audioFileName: "irodori-starter-14-a05-l04.mp3",
  },
];

const canDos = [
  { id: "ask-facility-location", text: "Menanyakan letak toilet, ATM, atau fasilitas lain di tempat umum." },
  { id: "tell-current-location", text: "Memberi tahu posisi diri melalui telepon dengan memakai penanda tempat." },
  { id: "share-impressions", text: "Menyampaikan kesan sederhana tentang tempat atau bangunan yang dikunjungi." },
  { id: "read-opening-signs", text: "Membaca papan informasi toko dan memahami jam buka atau hari liburnya." },
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
    prompt: <>Ungkapan untuk bertanya apakah ada ATM di dekat sini adalah …</>,
    options: [
      { key: "a", label: <>この<ruby>近<rt>ちか</rt></ruby>くに、ATMはありますか？</> },
      { key: "b", label: <>ATMの<ruby>前<rt>まえ</rt></ruby>にいます。</> },
      { key: "c", label: <>ATMは<ruby>大<rt>おお</rt></ruby>きいですね。</> },
    ],
    answer: "a",
    explanation: <>「この<ruby>近<rt>ちか</rt></ruby>くに、～はありますか？」 digunakan untuk menanyakan apakah suatu fasilitas ada di dekat sini.</>,
  },
  {
    prompt: <>Apa arti 「この先です」 ketika menjelaskan lokasi?</>,
    options: [
      { key: "a", label: "Di belakang sini" },
      { key: "b", label: "Di depan sana / sedikit lebih jauh ke depan" },
      { key: "c", label: "Di dalam gedung ini" },
    ],
    answer: "b",
    explanation: <>「この<ruby>先<rt>さき</rt></ruby>」 menunjukkan tempat yang berada lebih jauh ke depan dari posisi pembicara.</>,
  },
  {
    prompt: <>Lengkapi: 今、インフォメーションの ___ にいます。 (Saya berada di depan meja informasi.)</>,
    options: [
      { key: "a", label: "前" },
      { key: "b", label: "中" },
      { key: "c", label: "後ろ" },
    ],
    answer: "a",
    explanation: <>「Nの<ruby>前<rt>まえ</rt></ruby>にいます」 berarti berada di depan suatu tempat atau benda.</>,
  },
  {
    prompt: <>Pilih ungkapan yang benar untuk “taman yang luas”.</>,
    options: [
      { key: "a", label: "広いな公園" },
      { key: "b", label: "広い公園" },
      { key: "c", label: "広く公園" },
    ],
    answer: "b",
    explanation: <>kata sifat -i langsung diikuti kata benda: <ruby>広<rt>ひろ</rt></ruby>い<ruby>公園<rt>こうえん</rt></ruby>.</>,
  },
  {
    prompt: <>Manakah yang merupakan na-adjective untuk “indah / bersih”?</>,
    options: [
      { key: "a", label: "きれい" },
      { key: "b", label: "高い" },
      { key: "c", label: "古い" },
    ],
    answer: "a",
    explanation: <>きれい adalah na-adjective. Sebelum kata benda bentuknya 「きれいなN」.</>,
  },
  {
    prompt: <>Apa arti papan 「定休日：水曜日」?</>,
    options: [
      { key: "a", label: "Buka setiap hari Rabu" },
      { key: "b", label: "Libur rutin setiap hari Rabu" },
      { key: "c", label: "Buka sampai Rabu" },
    ],
    answer: "b",
    explanation: <>「<ruby>定休日<rt>ていきゅうび</rt></ruby>」 adalah hari libur rutin suatu toko atau tempat.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa fungsi partikel に dalam 「この近くに ATM がありますか？」?</>,
    options: [
      { key: "a", label: "Menandai tempat keberadaan sesuatu" },
      { key: "b", label: "Menandai objek yang dilihat" },
      { key: "c", label: "Menandai alat transportasi" },
    ],
    answer: "a",
    explanation: <>Pola 「tempat に benda が／は ありますか」 menanyakan keberadaan suatu benda atau fasilitas.</>,
  },
  {
    prompt: <>Manakah kalimat untuk bertanya langsung “Toilet ada di mana?”?</>,
    options: [
      { key: "a", label: <>トイレは、どこですか？</> },
      { key: "b", label: <>トイレにいますか？</> },
      { key: "c", label: <>トイレは、きれいですね。</> },
    ],
    answer: "a",
    explanation: <>「Nはどこですか？」 merupakan pertanyaan sederhana untuk menanyakan lokasi.</>,
  },
  {
    prompt: <>Apa arti 「横」 (よこ)?</>,
    options: [
      { key: "a", label: "Di atas" },
      { key: "b", label: "Di samping" },
      { key: "c", label: "Di bawah" },
    ],
    answer: "b",
    explanation: <>「<ruby>横<rt>よこ</rt></ruby>」 berarti di samping atau di sisi sesuatu.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Saya berada di dalam minimarket.”</>,
    options: [
      { key: "a", label: <>コンビニの<ruby>外<rt>そと</rt></ruby>にいます。</> },
      { key: "b", label: <>コンビニの<ruby>中<rt>なか</rt></ruby>にいます。</> },
      { key: "c", label: <>コンビニの<ruby>上<rt>うえ</rt></ruby>にいます。</> },
    ],
    answer: "b",
    explanation: <>「Nの<ruby>中<rt>なか</rt></ruby>にいます」 berarti berada di dalam N.</>,
  },
  {
    prompt: <>Bentuk na-adjective yang benar sebelum kata benda adalah …</>,
    options: [
      { key: "a", label: "にぎやかな通り" },
      { key: "b", label: "にぎやかい通り" },
      { key: "c", label: "にぎやか通り" },
    ],
    answer: "a",
    explanation: <>kata sifat -na memakai な sebelum kata benda: にぎやかな<ruby>通<rt>とお</rt></ruby>り.</>,
  },
  {
    prompt: <>Manakah pasangan bentuk yang benar untuk “bangunan besar”?</>,
    options: [
      { key: "a", label: "大きい建物 / 大きな建物" },
      { key: "b", label: "大きな建物 / 大きく建物" },
      { key: "c", label: "大きいな建物 / 大きくな建物" },
    ],
    answer: "a",
    explanation: <>大きい dan 小さい adalah i-adjective khusus yang dapat memakai bentuk 「～いN」 atau 「～なN」.</>,
  },
  {
    prompt: <>Apa arti papan 「準備中」?</>,
    options: [
      { key: "a", label: "Sedang buka" },
      { key: "b", label: "Sedang persiapan; belum melayani" },
      { key: "c", label: "Buka 24 jam" },
    ],
    answer: "b",
    explanation: <>「<ruby>準備中<rt>じゅんびちゅう</rt></ruby>」 berarti sedang bersiap atau belum mulai menerima pengunjung.</>,
  },
  {
    prompt: <>Apa arti 「年中無休」?</>,
    options: [
      { key: "a", label: "Libur setiap akhir pekan" },
      { key: "b", label: "Buka sepanjang tahun tanpa hari libur rutin" },
      { key: "c", label: "Buka hanya saat musim panas" },
    ],
    answer: "b",
    explanation: <>「<ruby>年中無休<rt>ねんじゅうむきゅう</rt></ruby>」 berarti buka sepanjang tahun tanpa hari libur rutin.</>,
  },
  {
    prompt: <>Jika sebuah toko buka pukul 9.00–18.00, apakah toko tersebut masih buka pada pukul 19.00?</>,
    options: [
      { key: "a", label: "Ya, masih buka" },
      { key: "b", label: "Tidak, sudah melewati jam tutup" },
      { key: "c", label: "Hanya jika hari Minggu" },
    ],
    answer: "b",
    explanation: <>Pukul 19.00 sudah melewati jam tutup pukul 18.00.</>,
  },
  {
    prompt: <>Kalimat 「きれいな建物ですね」 menunjukkan …</>,
    options: [
      { key: "a", label: "Menanyakan arah bangunan" },
      { key: "b", label: "Menyampaikan kesan bahwa bangunannya indah" },
      { key: "c", label: "Menanyakan jam buka bangunan" },
    ],
    answer: "b",
    explanation: <>「きれいな」 adalah na-adjective yang menerangkan 建物. 「ですね」 dipakai untuk menyampaikan kesan atau komentar.</>,
  },
];

const locationWords = [
  ["上", "うえ · ue", "Di atas"],
  ["下", "した · shita", "Di bawah"],
  ["前", "まえ · mae", "Di depan"],
  ["後ろ", "うしろ · ushiro", "Di belakang"],
  ["中", "なか · naka", "Di dalam"],
  ["横", "よこ · yoko", "Di samping"],
];

const facilityWords = [
  ["トイレ", "toire", "Toilet"],
  ["コインロッカー", "koin rokkaa", "Loker koin"],
  ["自動販売機", "じどうはんばいき · jidouhanbaiki", "Mesin penjual otomatis"],
  ["コンビニ", "konbini", "Minimarket"],
  ["ATM", "eetiiemu", "ATM"],
  ["インフォメーション", "infomeeshon", "Meja informasi"],
  ["エレベーター", "erebeetaa", "Lift"],
  ["改札", "かいさつ · kaisatsu", "Gerbang tiket"],
];

const adjectiveWords = [
  ["大きい", "おおきい · ookii", "Besar"],
  ["小さい", "ちいさい · chiisai", "Kecil"],
  ["高い", "たかい · takai", "Tinggi"],
  ["低い", "ひくい · hikui", "Rendah"],
  ["広い", "ひろい · hiroi", "Luas"],
  ["せまい", "semai", "Sempit"],
  ["古い", "ふるい · furui", "Lama / tua"],
  ["新しい", "あたらしい · atarashii", "Baru"],
  ["にぎやか", "nigiyaka", "Ramai"],
  ["静か", "しずか · shizuka", "Tenang"],
  ["きれい", "kirei", "Indah / bersih"],
  ["有名", "ゆうめい · yuumei", "Terkenal"],
];

const signWords = [
  ["営業時間", "えいぎょうじかん · eigyou jikan", "Jam operasional"],
  ["定休日", "ていきゅうび · teikyuu-bi", "Hari libur rutin"],
  ["営業中", "えいぎょうちゅう · eigyou-chuu", "Sedang buka"],
  ["準備中", "じゅんびちゅう · junbi-chuu", "Sedang persiapan"],
  ["休業", "きゅうぎょう · kyuugyou", "Tutup / tidak beroperasi"],
  ["年中無休", "ねんじゅうむきゅう · nenjuu mukyuu", "Buka sepanjang tahun"],
  ["午前", "ごぜん · gozen", "Pagi / AM"],
  ["午後", "ごご · gogo", "Siang atau sore / PM"],
];

const shopSigns = [
  {
    id: "aoba",
    name: "Aoba Market",
    hours: "毎日 9:00–21:00",
    reading: "Mainichi kuji kara nijuuichi-ji",
    meaning: "Setiap hari pukul 09.00–21.00",
    closed: "年中無休",
    closedMeaning: "Buka sepanjang tahun",
  },
  {
    id: "hana",
    name: "Hana Café",
    hours: "火〜日 10:00–18:00",
    reading: "Kayou kara nichiyou, juu-ji kara juuhachi-ji",
    meaning: "Selasa–Minggu pukul 10.00–18.00",
    closed: "月曜日 定休日",
    closedMeaning: "Libur rutin hari Senin",
  },
  {
    id: "mori",
    name: "Mori Information Center",
    hours: "毎日 9:00–17:00",
    reading: "Mainichi ku-ji kara juu-shichi-ji",
    meaning: "Setiap hari pukul 09.00–17.00",
    closed: "年中無休",
    closedMeaning: "Buka setiap hari",
  },
];

export default function IrodoriPemulaLessonFourteenPage() {
  const progress = useIrodoriProgress();
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [facilityChoice, setFacilityChoice] = useState("");
  const [facilitySubmitted, setFacilitySubmitted] = useState(false);
  const [locationChoice, setLocationChoice] = useState("");
  const [locationSubmitted, setLocationSubmitted] = useState(false);
  const [impressionChoice, setImpressionChoice] = useState("");
  const [impressionSubmitted, setImpressionSubmitted] = useState(false);
  const [signChoice, setSignChoice] = useState("");
  const [signSubmitted, setSignSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const isCompleted = progress.completedLessons.includes("starter-14");
  const practiceScore = practiceTasks.filter((task, index) => practiceAnswers[index] === task.answer).length;
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;
  const score = quizQuestions.filter((question, index) => answers[index] === question.answer).length;
  const facilityIsCorrect = facilitySubmitted && facilityChoice === "toilet";
  const locationIsCorrect = locationSubmitted && locationChoice === "inside";
  const impressionIsCorrect = impressionSubmitted && impressionChoice === "quiet";
  const signIsCorrect = signSubmitted && signChoice === "aoba";
  const activitiesComplete = facilityIsCorrect && locationIsCorrect && impressionIsCorrect && signIsCorrect;
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
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D6AD4F]/[0.07]">街</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">IRODORI • PEMULA A1 • PELAJARAN 14</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Gedungnya besar, ya.</h1>
          <p className="mt-2 text-sm font-semibold text-[#D9B66D]"><ruby>大<rt>おお</rt></ruby>きな<ruby>建物<rt>たてもの</rt></ruby>ですね</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Belajar menanyakan letak fasilitas umum, menjelaskan posisi saat menelepon teman, menyampaikan kesan tentang tempat, dan membaca papan jam operasional.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><MapPin size={14} className="text-[#D6AD4F}" />Lokasi fasilitas</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><MessageCircle size={14} className="text-[#D6AD4F}" />Percakapan telepon</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Building2 size={14} className="text-[#D6AD4F]" />Kesan tentang tempat</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#D6AD4F}" />Jam operasional</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#B8860B]/20 bg-[#1B1917]/80 p-4 md:p-5">
        <div className="flex items-center gap-2"><Signpost size={16} className="text-[#D9B66D]" /><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2></div>
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
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA 01</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Fasilitas di tempat umum</h2><p className="mt-1 text-xs text-[#A9A398]">Nama fasilitas dan tempat yang mungkin kamu cari saat berada di gedung atau kawasan kota.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {facilityWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dengarkan dan pahami percakapan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Dialog orisinal Fude dengan furigana pada kanji. Baca, dengarkan, lalu perhatikan cara bertanya dan menjelaskan lokasi.</p></div>
        <div className="space-y-4">
          <IrodoriConversation title="Menanyakan letak fasilitas" speakers={[speakers.yui, speakers.kenji]} utterances={facilityConversation} />
          <IrodoriConversation title="Menjelaskan posisi melalui telepon" speakers={[speakers.sota, speakers.akiko]} utterances={phoneConversation} />
          <IrodoriConversation title="Memastikan lokasi saat bertemu" speakers={[speakers.kenji, speakers.yui]} utterances={positionConversation} />
          <IrodoriConversation title="Memberikan kesan tentang tempat" speakers={[speakers.akiko, speakers.sota]} utterances={townConversation} />
          <IrodoriConversation title="Mengomentari kawasan pertokoan" speakers={[speakers.yui, speakers.kenji]} utterances={streetConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA 02</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kata posisi</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Gabungkan kata tempat dengan の untuk menjelaskan posisi benda atau seseorang.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {locationWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3 text-center">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-2xl font-bold leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA 03</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kata sifat untuk menggambarkan tempat</h2></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {adjectiveWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-[#B8860B]/20 bg-[#211E1A] p-3 text-[10px] leading-5 text-[#A9A398]">
          Ingat: きれい adalah na-adjective, sedangkan 広い adalah i-adjective. 大きい dan 小さい dapat memakai bentuk khusus 大きな dan 小さな saat menerangkan kata benda.
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menanyakan lokasi dan menyampaikan kesan</h2></div>
        {[
          {
            title: "01 · Menanyakan apakah ada fasilitas di dekat sini",
            pattern: "【tempat】に【benda / fasilitas】はありますか？",
            example: <>この<ruby>近<rt>ちか</rt></ruby>くに、ATMはありますか？</>,
            note: "Pola ini digunakan untuk bertanya apakah suatu fasilitas tersedia di sekitar lokasi. Jawaban dapat berupa 「はい、この先にあります」 (Ya, ada di depan sana) atau 「このビルにはありません」 (Tidak ada di gedung ini). Untuk bertanya lokasi secara langsung, gunakan 「Nはどこですか？」 atau 「Nはどこにありますか？」.",
          },
          {
            title: "02 · Menjelaskan posisi seseorang",
            pattern: "N の【posisi】にいます ／ N の【posisi】です",
            example: <>今、<ruby>改札<rt>かいさつ</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>にいます。／ コンビニの<ruby>中<rt>なか</rt></ruby>です。</>,
            note: "Sebutkan penanda tempat terlebih dahulu, lalu posisi orang terhadap penanda itu. Contoh posisi: 前 (depan), 後ろ (belakang), 中 (dalam), 横 (samping), 上 (atas), dan 下 (bawah). Bentuk ～です dapat menggantikan ～にいます dalam jawaban singkat.",
          },
          {
            title: "03 · Menyampaikan kesan dengan kata sifat",
            pattern: "ナA-なNですね ／ イA-いNですね",
            example: <><ruby>静<rt>しず</rt></ruby>かな<ruby>公園<rt>こうえん</rt></ruby>ですね。／ <ruby>広<rt>ひろ</rt></ruby>い<ruby>通<rt>とお</rt></ruby>りですね。</>,
            note: "kata sifat -na memakai な sebelum kata benda, seperti にぎやかな通り dan きれいな建物. kata sifat -i memakai bentuk い, seperti 広い公園 dan 高いビル. 大きい dan 小さい juga bisa menjadi 大きな dan 小さな. Tambahan ですね membuat komentar terdengar seperti menyampaikan kesan atau mengajak lawan bicara setuju.",
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
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">PAPAN INFORMASI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membaca jam operasional</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Contoh papan di bawah bersifat fiktif. Perhatikan rentang jam dan hari libur sebelum berkunjung.</p></div>
        <div className="grid gap-3 md:grid-cols-3">
          {shopSigns.map((sign) => (
            <article key={sign.id} className="rounded-xl border border-white/[0.08] bg-[#1B1A18] p-4">
              <div className="flex items-center gap-2"><Clock3 size={15} className="text-[#D9B66D]"/><p className="text-xs font-bold text-[#EAE6DD]">{sign.name}</p></div>
              <p className="mt-3 text-[9px] font-black tracking-[0.12em] text-[#B8860B]">営業時間</p>
              <JapaneseReading allowIndexFallback romaji={sign.reading} translation={sign.meaning} contentClassName="mt-1 font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-5 text-[#A9A398]">{sign.hours}</JapaneseReading>
              <div className="mt-3 border-t border-white/[0.06] pt-3">
                <JapaneseReading allowIndexFallback translation={sign.closedMeaning} contentClassName="font-mincho text-sm leading-relaxed text-[#E7D2A1]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] text-[#A9A398]">{sign.closed}</JapaneseReading>
              </div>
            </article>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {signWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 01 · BERTANYA LOKASI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Cari toilet di dalam gedung</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kamu sedang berada di lobi. Peta sederhana menunjukkan toilet berada di lorong bagian depan.</p></div>
        <div className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">PETUNJUK LOKASI</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-white/[0.07] bg-[#27231D] p-3"><p className="font-mincho text-sm text-[#F1EBDD]">ロビー</p><p className="mt-1 text-[9px] text-[#A9A398]">Lobi</p></div>
            <div className="rounded-lg border border-[#D6AD4F]/35 bg-[#D6AD4F]/10 p-3"><p className="font-mincho text-sm text-[#F1EBDD]">トイレ</p><p className="mt-1 text-[9px] text-[#D9B66D]">Lorong depan</p></div>
            <div className="rounded-lg border border-white/[0.07] bg-[#27231D] p-3"><p className="font-mincho text-sm text-[#F1EBDD]">ATM</p><p className="mt-1 text-[9px] text-[#A9A398]">Sisi belakang</p></div>
          </div>
        </div>
        <p className="text-xs font-semibold text-[#EAE6DD]">Manakah pertanyaan yang sesuai untuk memastikan apakah toilet tersedia di dekat sini?</p>
        <div className="grid gap-2">
          {[
            { key: "toilet", label: "この近くに、トイレはありますか？", meaning: "Apakah ada toilet di dekat sini?" },
            { key: "where", label: "今、どこにいますか？", meaning: "Sekarang berada di mana?" },
            { key: "impression", label: "大きなトイレですね。", meaning: "Toiletnya besar, ya." },
          ].map((item) => (
            <button key={item.key} type="button" disabled={facilitySubmitted} aria-pressed={facilityChoice === item.key} onClick={() => setFacilityChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (facilitySubmitted && item.key === "toilet" ? "border-emerald-500/50 bg-emerald-500/10" : facilitySubmitted && facilityChoice === item.key ? "border-red-400/50 bg-red-400/10" : facilityChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <JapaneseReading allowIndexFallback translation={item.meaning} contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-4 text-[#A9A398]">{item.label}</JapaneseReading>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{facilitySubmitted ? facilityIsCorrect ? "Benar. Gunakan pola この近くに～はありますか untuk menanyakan keberadaan fasilitas." : "Belum tepat. Pilih pertanyaan tentang keberadaan fasilitas." : "Pilih satu pertanyaan."}</p>
          {facilitySubmitted ? <button type="button" onClick={() => { setFacilityChoice(""); setFacilitySubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!facilityChoice} onClick={() => setFacilitySubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 02 · POSISI SAAT INI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Temukan teman melalui telepon</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Akiko sedang berada di dalam minimarket. Pilih kalimat yang paling tepat untuk menjelaskan lokasinya.</p></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/[0.07] bg-[#27231D] p-3 text-center"><p className="font-mincho text-base text-[#A9A398]">コンビニ</p><p className="mt-1 text-[9px] text-[#A9A398]">Minimarket</p></div>
          <div className="rounded-xl border border-[#D6AD4F]/35 bg-[#D6AD4F]/10 p-3 text-center"><p className="font-mincho text-base text-[#F1EBDD]">中</p><p className="mt-1 text-[9px] text-[#D9B66D]">Di dalam</p></div>
          <div className="rounded-xl border border-white/[0.07] bg-[#27231D] p-3 text-center"><p className="font-mincho text-base text-[#A9A398]">外</p><p className="mt-1 text-[9px] text-[#A9A398]">Di luar</p></div>
        </div>
        <div className="grid gap-2">
          {[
            { key: "front", label: "コンビニの前にいます。", meaning: "Saya berada di depan minimarket." },
            { key: "inside", label: "コンビニの中にいます。", meaning: "Saya berada di dalam minimarket." },
            { key: "above", label: "コンビニの上にいます。", meaning: "Saya berada di atas minimarket." },
          ].map((item) => (
            <button key={item.key} type="button" disabled={locationSubmitted} aria-pressed={locationChoice === item.key} onClick={() => setLocationChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (locationSubmitted && item.key === "inside" ? "border-emerald-500/50 bg-emerald-500/10" : locationSubmitted && locationChoice === item.key ? "border-red-400/50 bg-red-400/10" : locationChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <JapaneseReading allowIndexFallback translation={item.meaning} contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-4 text-[#A9A398]">{item.label}</JapaneseReading>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{locationSubmitted ? locationIsCorrect ? "Benar. Nの中にいます berarti berada di dalam N." : "Belum tepat. Cocokkan kalimat dengan posisi yang ditunjukkan." : "Pilih kalimat yang sesuai."}</p>
          {locationSubmitted ? <button type="button" onClick={() => { setLocationChoice(""); setLocationSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!locationChoice} onClick={() => setLocationSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa lokasi</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 03 · KESAN TENTANG TEMPAT</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih komentar yang cocok</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kamu diajak mengunjungi taman dengan suasana tenang. Pilih komentar yang sesuai.</p></div>
        <div className="rounded-xl border border-[#D6AD4F]/20 bg-[#27231D] p-4 text-center">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">TEMPAT YANG DIKUNJUNGI</p>
          <p className="mt-3 font-mincho text-xl text-[#F1EBDD]"><ruby>静<rt>しず</rt></ruby>かな<ruby>公園<rt>こうえん</rt></ruby></p>
          <p className="mt-1 text-xs text-[#A9A398]">Taman yang tenang, banyak pepohonan dan bangku.</p>
        </div>
        <div className="grid gap-2">
          {[
            { key: "busy", label: "にぎやかな通りですね。", meaning: "Jalan yang ramai, ya." },
            { key: "quiet", label: "静かな公園ですね。", meaning: "Tamannya tenang, ya." },
            { key: "high", label: "高いビルですね。", meaning: "Gedungnya tinggi, ya." },
          ].map((item) => (
            <button key={item.key} type="button" disabled={impressionSubmitted} aria-pressed={impressionChoice === item.key} onClick={() => setImpressionChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (impressionSubmitted && item.key === "quiet" ? "border-emerald-500/50 bg-emerald-500/10" : impressionSubmitted && impressionChoice === item.key ? "border-red-400/50 bg-red-400/10" : impressionChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <JapaneseReading allowIndexFallback translation={item.meaning} contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-4 text-[#A9A398]">{item.label}</JapaneseReading>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{impressionSubmitted ? impressionIsCorrect ? "Benar. 静かな公園 memakai na-adjective + な sebelum kata benda." : "Belum tepat. Pilih komentar yang menggambarkan taman yang tenang." : "Pilih satu komentar."}</p>
          {impressionSubmitted ? <button type="button" onClick={() => { setImpressionChoice(""); setImpressionSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!impressionChoice} onClick={() => setImpressionSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa komentar</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 04 · JAM OPERASIONAL</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Cari tempat yang masih buka</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Sekarang hari Senin pukul 19.00. Periksa tiga papan informasi di atas, lalu pilih tempat yang masih buka.</p></div>
        <div className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#D9B66D]"><Clock3 size={15}/> SEKARANG</div>
          <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">月曜日 · 19:00</p>
          <p className="mt-1 text-[10px] text-[#A9A398]">Senin · pukul tujuh malam</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { key: "aoba", label: "Aoba Market", detail: "Setiap hari · 09.00–21.00" },
            { key: "hana", label: "Hana Café", detail: "Selasa–Minggu · 10.00–18.00" },
            { key: "mori", label: "Mori Information Center", detail: "Setiap hari · 09.00–17.00" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={signSubmitted} aria-pressed={signChoice === item.key} onClick={() => setSignChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (signSubmitted && item.key === "aoba" ? "border-emerald-500/50 bg-emerald-500/10" : signSubmitted && signChoice === item.key ? "border-red-400/50 bg-red-400/10" : signChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <p className="text-xs font-bold text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-[9px] leading-4 text-[#A9A398]">{item.detail}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{signSubmitted ? signIsCorrect ? "Benar. Aoba Market masih buka sampai pukul 21.00 dan tidak libur pada hari Senin." : "Belum tepat. Perhatikan jam tutup serta hari libur setiap tempat." : "Pilih tempat yang masih buka."}</p>
          {signSubmitted ? <button type="button" onClick={() => { setSignChoice(""); setSignSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!signChoice} onClick={() => setSignSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa jam buka</button>}
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
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Nilai empat kemampuan setelah menyelesaikan praktik, simulasi, dan kuis. Progres Irodori tersimpan terpisah dari Minna no Nihongo dan JLPT.</p>
        <div className="mt-4 space-y-3">
          {canDos.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
              <p className="text-xs font-semibold leading-5 text-[#EAE6DD]"><span className="mr-2 text-[#D9B66D]">0{index + 1}</span>{item.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ratingOptions.map((option) => (
                  <button key={option.value} type="button" aria-pressed={ratings[item.id] === option.value} onClick={() => { const next = { ...ratings, [item.id]: option.value }; setRatings(next); saveIrodoriSelfEvaluation("starter-14", next); }} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors " + (ratings[item.id] === option.value ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]" : "border-white/[0.08] bg-[#24221F] text-[#A3A099]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {isCompleted ? <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/>Pelajaran selesai</span> : <button type="button" onClick={() => completeIrodoriLesson("starter-14")} disabled={!quizSubmitted || !practiceIsCorrect || !activitiesComplete || !canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#C93438] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/>Tandai pelajaran selesai</button>}
          <Link href="/irodori/starter" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
        </div>
        {(!quizSubmitted || !practiceIsCorrect || !activitiesComplete || !canDosRated) && <p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan keempat simulasi dengan tepat, lalu isi keempat penilaian target komunikasi.</p>}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, nama tempat, dan papan informasi disusun orisinal oleh Fude. Seluruh lokasi dan jadwal dalam latihan bersifat fiktif.</p>
    </main>
  );
}
