"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Users,
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
const lessonId = "elementary1-11";

const planningFoodConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>来週の集まり、何を持って行きますか。</>,romaji:"Raishuu no atsumari, nani o motte ikimasu ka?",translation:"Kita perlu bawa apa untuk acara minggu depan?",audioFileName:"irodori-elementary1-11-a01-l01.mp3"},
{speakerId:"sota",japanese:<>肉と野菜は、私が買って行きますよ。</>,romaji:"Niku to yasai wa, watashi ga katte ikimasu yo.",translation:"Daging dan sayuran biar saya yang beli dan bawa.",audioFileName:"irodori-elementary1-11-a01-l02.mp3"},
{speakerId:"akiko",japanese:<>じゃあ、私はおにぎりを作って持って行きますね。</>,romaji:"Jaa, watashi wa onigiri o tsukutte motte ikimasu ne.",translation:"Kalau begitu, saya buat onigiri dan bawa ke sana, ya.",audioFileName:"irodori-elementary1-11-a01-l03.mp3"},
{speakerId:"kenji",japanese:<>私はお茶と果物を持って行きます。</>,romaji:"Watashi wa ocha to kudamono o motte ikimasu.",translation:"Saya akan membawa teh dan buah-buahan.",audioFileName:"irodori-elementary1-11-a01-l04.mp3"},
];
const choosingPartyFoodConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>デザートはどうしますか。</>,romaji:"Dezaato wa dou shimasu ka?",translation:"Untuk dessert, bagaimana?",audioFileName:"irodori-elementary1-11-a02-l01.mp3"},
{speakerId:"sota",japanese:<>ケーキと果物、どっちがいいですか。</>,romaji:"Keeki to kudamono, docchi ga ii desu ka?",translation:"Kamu lebih suka kue atau buah?",audioFileName:"irodori-elementary1-11-a02-l02.mp3"},
{speakerId:"akiko",japanese:<>果物のほうがいいです。</>,romaji:"Kudamono no hou ga ii desu.",translation:"Saya lebih suka buah.",audioFileName:"irodori-elementary1-11-a02-l03.mp3"},
{speakerId:"sota",japanese:<>飲み物はいろいろありますね。どれがいいですか。</>,romaji:"Nomimono wa iroiro arimasu ne. Dore ga ii desu ka?",translation:"Ada banyak pilihan minuman. Kamu mau yang mana?",audioFileName:"irodori-elementary1-11-a02-l04.mp3"},
{speakerId:"akiko",japanese:<>りんごジュースがいいです。</>,romaji:"Ringo juusu ga ii desu.",translation:"Saya mau jus apel.",audioFileName:"irodori-elementary1-11-a02-l05.mp3"},
];
const askingAboutIngredientsConversation: IrodoriUtterance[] = [
{speakerId:"kenji",japanese:<>すみません。このサンドイッチ、卵を使ってますか。</>,romaji:"Sumimasen. Kono sandoicchi, tamago o tsukattemasu ka?",translation:"Permisi. Apakah sandwich ini pakai telur?",audioFileName:"irodori-elementary1-11-a03-l01.mp3"},
{speakerId:"akiko",japanese:<>いいえ、使ってませんよ。</>,romaji:"Iie, tsukattemasen yo.",translation:"Tidak, sandwich ini tidak pakai telur.",audioFileName:"irodori-elementary1-11-a03-l02.mp3"},
{speakerId:"kenji",japanese:<>このサラダにはチーズが入ってますか。</>,romaji:"Kono sarada ni wa chiizu ga haittemasu ka?",translation:"Apakah salad ini mengandung keju?",audioFileName:"irodori-elementary1-11-a03-l03.mp3"},
{speakerId:"akiko",japanese:<>はい、少し入ってます。</>,romaji:"Hai, sukoshi haittemasu.",translation:"Ya, ada sedikit.",audioFileName:"irodori-elementary1-11-a03-l04.mp3"},
];
const checkingFoodDateConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>すみません。このおにぎり、いつまでですか。</>,romaji:"Sumimasen. Kono onigiri, itsu made desu ka?",translation:"Permisi, onigiri ini baik dikonsumsi sampai kapan?",audioFileName:"irodori-elementary1-11-a04-l01.mp3"},
{speakerId:"kenji",japanese:<>消費期限は、今日の午後8時までです。</>,romaji:"Shouhi kigen wa, kyou no gogo hachiji made desu.",translation:"Batas konsumsinya pukul 8 malam ini.",audioFileName:"irodori-elementary1-11-a04-l02.mp3"},
{speakerId:"akiko",japanese:<>わかりました。ありがとうございます。</>,romaji:"Wakarimashita. Arigatou gozaimasu.",translation:"Baik, saya mengerti. Terima kasih.",audioFileName:"irodori-elementary1-11-a04-l03.mp3"},
{speakerId:"kenji",japanese:<>ありがとうございました。</>,romaji:"Arigatou gozaimashita.",translation:"Terima kasih.",audioFileName:"irodori-elementary1-11-a04-l04.mp3"},
];
const bringingItemsConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>お皿とコップは、だれが持って行きますか。</>,romaji:"Osara to koppu wa, dare ga motte ikimasu ka?",translation:"Siapa yang akan membawa piring dan gelas?",audioFileName:"irodori-elementary1-11-a05-l01.mp3"},
{speakerId:"yui",japanese:<>私が持って行きます。</>,romaji:"Watashi ga motte ikimasu.",translation:"Saya yang akan membawanya.",audioFileName:"irodori-elementary1-11-a05-l02.mp3"},
{speakerId:"sota",japanese:<>ありがとうございます。飲み物は、もう買いましたか。</>,romaji:"Arigatou gozaimasu. Nomimono wa, mou kaimashita ka?",translation:"Terima kasih. Minumannya sudah kamu beli?",audioFileName:"irodori-elementary1-11-a05-l03.mp3"},
{speakerId:"yui",japanese:<>はい、さっき買って来ました。</>,romaji:"Hai, sakki katte kimashita.",translation:"Ya, tadi saya sudah membelinya dan membawanya ke sini.",audioFileName:"irodori-elementary1-11-a05-l04.mp3"},
];
const canDos=[
{id:"share-who-brings-what",text:"Membicarakan siapa yang akan menyiapkan atau membawa barang saat mengadakan acara makan bersama."},
{id:"choose-party-shopping",text:"Membandingkan dua pilihan dan menentukan makanan atau minuman yang akan dibeli untuk acara bersama."},
{id:"ask-food-ingredients-dates",text:"Menanyakan bahan makanan dan batas tanggal makanan kepada petugas toko, lalu memahami jawabannya."},
{id:"read-food-labels",text:"Membaca label makanan sederhana untuk memeriksa bahan yang tercantum."},
{id:"organize-food-items",text:"Menyepakati pilihan barang dan memastikan siapa yang membawa perlengkapan yang diperlukan."},
];
const sharingPlan=[
{id:"sota",name:"Sota",items:"肉と野菜",reading:"Niku to yasai",meaning:"Daging dan sayuran",sentence:"肉と野菜は、私が買って行きます。"},
{id:"akiko",name:"Akiko",items:"おにぎり",reading:"Onigiri",meaning:"Onigiri",sentence:"おにぎりを作って持って行きます。"},
{id:"kenji",name:"Kenji",items:"お茶と果物",reading:"Ocha to kudamono",meaning:"Teh dan buah-buahan",sentence:"お茶と果物を持って行きます。"},
{id:"yui",name:"Yui",items:"お皿とコップ",reading:"Osara to koppu",meaning:"Piring dan gelas",sentence:"お皿とコップを持って行きます。"},
];
const foodLabels=[
{id:"onigiri",name:"おにぎり · Onigiri",ingredients:"米（こめ）、のり、塩",reading:"Kome, nori, shio",meaning:"Beras, rumput laut, garam",allergens:"Contoh: tidak ada bahan alergen yang dicantumkan pada label latihan ini.",dateLabel:"消費期限",dateValue:"2026年12月10日"},
{id:"sandwich",name:"サンドイッチ · Sandwich",ingredients:"パン、卵、レタス",reading:"Pan, tamago, retasu",meaning:"Roti, telur, selada",allergens:"Label latihan: mengandung telur dan gandum.",dateLabel:"消費期限",dateValue:"2026年12月11日"},
{id:"cookies",name:"クッキー · Cookies",ingredients:"小麦粉、砂糖、バター",reading:"Komugiko, satou, bataa",meaning:"Tepung terigu, gula, mentega",allergens:"Label latihan: mengandung gandum dan susu.",dateLabel:"賞味期限",dateValue:"2026年12月20日"},
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

const practiceTasks:Task[]=[
{prompt:<>Pada kalimat 「肉と野菜を買って行きます」, bentuk 買って行きます menunjukkan …</>,options:[{key:"a",label:"Membeli lalu membawa ke tempat tujuan."},{key:"b",label:"Membeli lalu membawa ke tempat pembicara berada."},{key:"c",label:"Membeli pada masa lampau."}],answer:"a",explanation:<>V-て行きます menyatakan tindakan lalu pergi ke tempat tujuan dengan membawa barangnya.</>},
{prompt:<>Jika hanya ada dua pilihan, kue atau buah, pertanyaan yang tepat adalah …</>,options:[{key:"a",label:"ケーキと果物、どっちがいいですか。"},{key:"b",label:"ケーキと果物、どれがいいですか。"},{key:"c",label:"ケーキと果物、何回ですか。"}],answer:"a",explanation:<>どっち dipakai untuk dua pilihan. どれ dipakai jika pilihannya tiga atau lebih.</>},
{prompt:<>Jika tersedia tiga jenis minuman, ungkapan yang tepat adalah …</>,options:[{key:"a",label:"どれがいいですか。"},{key:"b",label:"どっちがいいですか。"},{key:"c",label:"だれがいいですか。"}],answer:"a",explanation:<>どれ digunakan untuk memilih satu dari tiga atau lebih pilihan.</>},
{prompt:<>Pilih kalimat yang berarti “Saya lebih suka buah.”</>,options:[{key:"a",label:"果物のほうがいいです。"},{key:"b",label:"果物でもいいです。"},{key:"c",label:"果物を持って行きます。"}],answer:"a",explanation:<>Nのほうがいいです menyatakan pilihan atau preferensi terhadap N.</>},
{prompt:<>Lengkapi jawaban jika tidak memiliki pilihan khusus: 「何 ___ いいです。」</>,options:[{key:"a",label:"でも"},{key:"b",label:"から"},{key:"c",label:"まで"}],answer:"a",explanation:<>何でもいいです berarti apa saja boleh atau tidak ada pilihan khusus.</>},
{prompt:<>Pilih jawaban yang sesuai untuk pertanyaan 「このパン、卵を使ってますか。」 jika roti itu tidak menggunakan telur.</>,options:[{key:"a",label:"いいえ、使ってません。"},{key:"b",label:"はい、使ってます。"},{key:"c",label:"卵のほうがいいです。"}],answer:"a",explanation:<>使ってません adalah bentuk percakapan dari 使っていません, yang berarti tidak menggunakan.</>},
];

const quizQuestions:Task[]=[
{prompt:<>Apa arti 「飲み物」?</>,options:[{key:"a",label:"Minuman."},{key:"b",label:"Makanan."},{key:"c",label:"Peralatan makan."}],answer:"a",explanation:<>飲み物（のみもの）berarti minuman.</>},
{prompt:<>Apa arti 「材料」?</>,options:[{key:"a",label:"Bahan."},{key:"b",label:"Harga."},{key:"c",label:"Piring."}],answer:"a",explanation:<>材料（ざいりょう）berarti bahan yang digunakan untuk membuat sesuatu.</>},
{prompt:<>Pilih kalimat yang berarti “Saya akan membawa sayuran ke sana.”</>,options:[{key:"a",label:"野菜を持って行きます。"},{key:"b",label:"野菜を持って来ます。"},{key:"c",label:"野菜を売ります。"}],answer:"a",explanation:<>持って行きます berarti membawa barang pergi ke tempat tujuan.</>},
{prompt:<>「持って来ました」 berarti …</>,options:[{key:"a",label:"Sudah membawa ke tempat pembicara berada."},{key:"b",label:"Akan membawa ke tempat lain."},{key:"c",label:"Akan membeli nanti."}],answer:"a",explanation:<>持って来ました adalah bentuk lampau dari 持って来ます, membawa menuju tempat pembicara.</>},
{prompt:<>「チーズケーキと果物、どっちがいいですか。」 digunakan saat …</>,options:[{key:"a",label:"Memilih antara dua pilihan."},{key:"b",label:"Memilih dari lima pilihan."},{key:"c",label:"Menanyakan siapa pemiliknya."}],answer:"a",explanation:<>どっち digunakan saat membandingkan dua pilihan.</>},
{prompt:<>Pilih ungkapan untuk tiga atau lebih pilihan.</>,options:[{key:"a",label:"どれがいいですか。"},{key:"b",label:"どっちがいいですか。"},{key:"c",label:"どこがいいですか。"}],answer:"a",explanation:<>どれ digunakan ketika ada tiga atau lebih pilihan.</>},
{prompt:<>Apa fungsi 「Nのほうがいいです」?</>,options:[{key:"a",label:"Menyatakan pilihan yang lebih disukai."},{key:"b",label:"Menyatakan siapa yang membawa barang."},{key:"c",label:"Menyatakan tanggal pada kemasan."}],answer:"a",explanation:<>Nのほうがいいです menyampaikan preferensi terhadap salah satu pilihan.</>},
{prompt:<>「どっちでもいいです」 berarti …</>,options:[{key:"a",label:"Keduanya boleh / saya tidak punya preferensi."},{key:"b",label:"Keduanya tidak boleh."},{key:"c",label:"Hanya pilihan pertama."}],answer:"a",explanation:<>どっちでもいいです menyatakan bahwa kedua pilihan dapat diterima.</>},
{prompt:<>Apa arti 「消費期限」 pada label makanan?</>,options:[{key:"a",label:"Batas waktu konsumsi yang dicantumkan pada produk."},{key:"b",label:"Tempat makanan dibuat."},{key:"c",label:"Jumlah bahan yang digunakan."}],answer:"a",explanation:<>消費期限 adalah batas waktu konsumsi untuk makanan yang mudah rusak.</>},
{prompt:<>Apa yang dapat ditemukan pada bagian 「原材料名」?</>,options:[{key:"a",label:"Daftar bahan makanan."},{key:"b",label:"Nama kasir."},{key:"c",label:"Waktu toko dibuka."}],answer:"a",explanation:<>原材料名 menunjukkan nama bahan yang digunakan pada produk.</>},
];

const simulations=[
{title:"01 · Membagi barang yang dibawa",heading:"Menentukan siapa membawa apa",prompt:"Untuk acara makan bersama, Sota sudah setuju membawa daging dan sayuran. Akiko ingin membawa onigiri. Pilih kalimat yang tepat.",japanese:<>おにぎりを作って持って行きます。</>,translation:"Saya akan membuat onigiri dan membawanya ke sana.",options:[{key:"bring",label:"おにぎりを作って持って行きます。",meaning:"Membuat lalu membawa onigiri ke tempat acara."},{key:"bringhere",label:"おにぎりを作って持って来ます。",meaning:"Membawa onigiri menuju tempat pembicara berada."},{key:"past",label:"おにぎりを作りました。",meaning:"Sudah membuat onigiri, tanpa menyatakan membawanya."}],answer:"bring",explanation:"持って行きます digunakan ketika barang dibawa pergi menuju tempat acara."},
{title:"02 · Memilih di antara dua makanan",heading:"Menggunakan どっち",prompt:"Ada dua pilihan hidangan penutup, kue atau buah. Kamu ingin bertanya mana yang lebih disukai teman.",japanese:<>ケーキと果物、どっちがいいですか。</>,translation:"Kamu lebih suka kue atau buah?",options:[{key:"choice",label:"ケーキと果物、どっちがいいですか。",meaning:"Menanyakan pilihan di antara dua benda."},{key:"many",label:"ケーキと果物、どれがいいですか。",meaning:"どれ biasanya digunakan untuk tiga pilihan atau lebih."},{key:"person",label:"ケーキと果物、だれがいいですか。",meaning:"だれ menanyakan orang."}],answer:"choice",explanation:"どっち digunakan ketika pilihan yang dibandingkan berjumlah dua."},
{title:"03 · Memilih dari beberapa minuman",heading:"Menggunakan どれ",prompt:"Di meja tersedia air putih, teh, dan jus apel. Kamu ingin memilih satu minuman.",japanese:<>飲み物、どれがいいですか。</>,translation:"Minuman yang mana yang kamu inginkan?",options:[{key:"which",label:"飲み物、どれがいいですか。",meaning:"どれ dipakai untuk tiga atau lebih pilihan."},{key:"two",label:"飲み物、どっちがいいですか。",meaning:"どっち cocok untuk dua pilihan."},{key:"who",label:"飲み物、だれがいいですか。",meaning:"だれ menanyakan orang."}],answer:"which",explanation:"Karena pilihannya tiga, gunakan どれ."},
{title:"04 · Bertanya tentang bahan makanan",heading:"Memastikan bahan yang digunakan",prompt:"Kamu ingin mengetahui apakah sebuah sandwich menggunakan telur. Pilih pertanyaan yang tepat kepada petugas.",japanese:<>このサンドイッチ、卵を使ってますか。</>,translation:"Apakah sandwich ini pakai telur?",options:[{key:"ingredient",label:"このサンドイッチ、卵を使ってますか。",meaning:"Menanyakan apakah telur digunakan sebagai bahan."},{key:"date",label:"このサンドイッチ、いつまでですか。",meaning:"Menanyakan batas tanggal."},{key:"price",label:"このサンドイッチ、どっちがいいですか。",meaning:"Menanyakan pilihan di antara dua hal."}],answer:"ingredient",explanation:"～を使ってますか digunakan untuk bertanya apakah suatu bahan dipakai."},
{title:"05 · Membaca label makanan",heading:"Menemukan bahan dan tanggal",prompt:"Pada label cookies tertulis: 原材料名：小麦粉、砂糖、バター / 賞味期限：2026年12月20日. Informasi mana yang benar?",japanese:<>原材料名：小麦粉、砂糖、バター<br/>賞味期限：2026年12月20日</>,translation:"Bahan: tepung terigu, gula, mentega. Baik dikonsumsi sebelum: 20 Desember 2026.",options:[{key:"label",label:"Bahan yang tercantum adalah tepung terigu, gula, dan mentega.",meaning:"原材料名 menunjukkan daftar bahan."},{key:"wrongdate",label:"Tanggal pada label menunjukkan tanggal pembuatan.",meaning:"賞味期限 bukan tanggal pembuatan."},{key:"wrongplace",label:"Label tersebut menunjukkan lokasi toko.",meaning:"Tidak ada informasi lokasi toko."}],answer:"label",explanation:"原材料名 berarti nama bahan, sedangkan 賞味期限 adalah tanggal baik dikonsumsi sebelum."},
];

const vocabulary=[
["飲み物","のみもの · nomimono","Minuman"],["お茶","おちゃ · ocha","Teh"],["材料","ざいりょう · zairyou","Bahan"],["野菜","やさい · yasai","Sayuran"],["牛肉","ぎゅうにく · gyuuniku","Daging sapi"],["豚肉","ぶたにく · butaniku","Daging babi"],["皿","さら · sara","Piring"],["売る","うる · uru","Menjual"],["持って行く","もっていく · motte iku","Membawa pergi ke tempat tujuan"],["買う","かう · kau","Membeli"],["持って来る","もってくる · motte kuru","Membawa ke tempat pembicara"],["作る","つくる · tsukuru","Membuat"],["おにぎり","おにぎり · onigiri","Nasi kepal Jepang"],["コップ","コップ · koppu","Gelas"],["果物","くだもの · kudamono","Buah-buahan"],["ケーキ","ケーキ · keeki","Kue"],["チーズ","チーズ · chiizu","Keju"],["塩","しお · shio","Garam"],["砂糖","さとう · satou","Gula"],["料理","りょうり · ryouri","Masakan"],["食品表示","しょくひんひょうじ · shokuhin hyouji","Label makanan"],["賞味期限","しょうみきげん · shoumi kigen","Baik dikonsumsi sebelum"],["消費期限","しょうひきげん · shouhi kigen","Batas waktu konsumsi"],["卵","たまご · tamago","Telur"],["小麦粉","こむぎこ · komugiko","Tepung terigu"]
];

const kanjiWords=[
["飲み物","のみもの · nomimono","Minuman"],["お茶","おちゃ · ocha","Teh"],["材料","ざいりょう · zairyou","Bahan"],["野菜","やさい · yasai","Sayuran"],["牛肉","ぎゅうにく · gyuuniku","Daging sapi"],["豚肉","ぶたにく · butaniku","Daging babi"],["皿","さら · sara","Piring"],["売る","うる · uru","Menjual"],["持って行く","もっていく · motte iku","Membawa pergi ke tempat tujuan"],["買う","かう · kau","Membeli"]
];

export default function IrodoriElementaryOneLessonElevenPage() {
  const progress = useIrodoriProgress();
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});

  const isCompleted = progress.completedLessons.includes(lessonId);
  const visibleRatings = {
    ...(progress.selfEvaluations[lessonId] ?? {}),
    ...ratings,
  };
  const practiceScore = practiceTasks.filter((task, index) => practiceAnswers[index] === task.answer).length;
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;
  const score = quizQuestions.filter((question, index) => answers[index] === question.answer).length;

  const simulationsComplete = simulations.every(
    (task, index) => simulationChecked[index] && simulationChoices[index] === task.answer
  );
  const canDosRated = canDos.every((item) => visibleRatings[item.id] !== undefined);

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
        href="/irodori/elementary-1"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"
      >
        <ArrowLeft size={15} /> Kembali ke Dasar 1
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#476C51]/45 bg-gradient-to-br from-[#203428] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#91B99A]/[0.08]">食</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">IRODORI • DASAR 1 A2 • PELAJARAN 11</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya akan membawa daging dan sayuran.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9CDB0]">肉と野菜は私が買って行きます。</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Berlatih membagi barang untuk acara bersama, memilih makanan dan minuman, menanyakan bahan serta tanggal makanan, dan membaca label sederhana.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9CDB0]" />Berbagi barang</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#A9CDB0]" />Memilih menu</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#A9CDB0]" />Label makanan</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A9CDB0]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target pertama mengikuti target komunikasi resmi. Target terakhir merupakan latihan penguatan Fude.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">{index < 4 ? "CAN-DO UTAMA" : "LATIHAN PENGUATAN"} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KOSAKATA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Makanan dan perlengkapan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata tentang bahan makanan, minuman, perlengkapan makan, dan label produk.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {vocabulary.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9CDB0]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Berbagi makanan dan memilih barang</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan cara membagi barang yang dibawa, memilih makanan, dan menanyakan bahan serta tanggal produk.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Membagi barang untuk acara bersama" speakers={[speakers.yui, speakers.sota, speakers.akiko, speakers.kenji]} utterances={planningFoodConversation} />
          <IrodoriConversation title="Memilih makanan untuk acara" speakers={[speakers.yui, speakers.sota, speakers.akiko]} utterances={choosingPartyFoodConversation} />
          <IrodoriConversation title="Menanyakan bahan makanan" speakers={[speakers.kenji, speakers.akiko]} utterances={askingAboutIngredientsConversation} />
          <IrodoriConversation title="Memeriksa tanggal makanan" speakers={[speakers.akiko, speakers.kenji]} utterances={checkingFoodDateConversation} />
          <IrodoriConversation title="Membawa perlengkapan makan" speakers={[speakers.yui, speakers.sota]} utterances={bringingItemsConversation} />
        </div>
      </section>


      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">PEMBAGIAN BARANG</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Siapa membawa apa?</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Contoh pembagian sederhana untuk acara makan bersama. Perhatikan pola ～て行きます untuk barang yang dibawa ke tempat acara.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {sharingPlan.map((item)=>(<article key={item.id} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-[#A9CDB0]">{item.name}</p><span className="rounded-full border border-[#8EAE93]/25 bg-[#476C51]/15 px-2 py-1 text-[9px] text-[#CFE4D2]">{item.meaning}</span></div>
            <p className="mt-3 font-mincho text-lg text-[#F1EBDD]">{item.items}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.reading}</p>
            <p className="mt-3 rounded-lg bg-black/15 p-3 font-mincho text-sm leading-6 text-[#CFE4D2]">{item.sentence}</p>
          </article>))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">MEMILIH MAKANAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membandingkan dua atau beberapa pilihan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan どっち untuk dua pilihan, どれ untuk tiga pilihan atau lebih, lalu jawab dengan のほうがいいです atau でもいいです.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">TWO CHOICES · どっち</p><p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]">ケーキと果物、どっちがいいですか。</p><p className="mt-1 text-xs text-[#A9A398]">Kamu lebih suka kue atau buah?</p><p className="mt-3 rounded-lg bg-black/15 p-3 font-mincho text-sm text-[#CFE4D2]">果物のほうがいいです。</p><p className="mt-1 text-[10px] text-[#A9A398]">Saya lebih suka buah.</p></article>
          <article className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">THREE OR MORE · どれ</p><p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]">お茶と水とジュース、どれがいいですか。</p><p className="mt-1 text-xs text-[#A9A398]">Teh, air putih, atau jus, yang mana?</p><p className="mt-3 rounded-lg bg-black/15 p-3 font-mincho text-sm text-[#CFE4D2]">何でもいいです。</p><p className="mt-1 text-[10px] text-[#A9A398]">Apa saja boleh.</p></article>
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Empat pola untuk membawa dan memilih barang</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan pola ini untuk menjelaskan barang yang dibawa, membandingkan pilihan, dan menyampaikan preferensi.</p></div>
        {[
          {title:"01 · Membawa sesuatu ke tempat tujuan",pattern:"V-て + 行きます ／ 来ます",example:<>肉と野菜を買って行きます。／ お茶を持って来ました。</>,note:"V-て行きます menunjukkan tindakan lalu pergi ke tempat tujuan dengan membawa barangnya. V-て来ます menunjukkan tindakan lalu membawa sesuatu menuju tempat pembicara berada. Contoh: 買います → 買って行きます、持ちます → 持って来ます."},
          {title:"02 · Memilih dari dua atau beberapa pilihan",pattern:"N1 と N2（と）、どっちがいいですか？\nS。どれがいいですか？",example:<>ケーキと果物、どっちがいいですか。／ 飲み物、どれがいいですか。</>,note:"どっち digunakan untuk dua pilihan. どれ digunakan untuk tiga pilihan atau lebih. Partikel と menghubungkan nama benda yang dibandingkan."},
          {title:"03 · Menyatakan pilihan yang lebih disukai",pattern:"N のほうがいいです",example:<>果物のほうがいいです。／ お茶のほうがいいです。</>,note:"Gunakan のほうがいいです untuk menyebut pilihan yang lebih disukai. のほうが dapat dihilangkan pada beberapa jawaban: 果物がいいです."},
          {title:"04 · Menyatakan pilihan bebas",pattern:"[Kata tanya] + でもいいです",example:<>何でもいいです。／ どっちでもいいです。</>,note:"Pola ini digunakan saat tidak memiliki pilihan khusus. 何でも berarti apa saja, sedangkan どっちでも berarti keduanya boleh."},
        ].map((item)=>(<article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-sm font-bold tracking-[0.02em] text-[#8EAE93]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p><p className="mt-2 font-mincho text-base leading-7 text-[#A9CDB0]"><JapaneseReading allowIndexFallback romajiClassName="mt-1 text-sm italic text-[#D9B66D]">{item.example}</JapaneseReading></p><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>))}
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">CONTOH LABEL MAKANAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Perhatikan bahan dan tanggal pada kemasan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Label di bawah ini fiktif dan dibuat untuk latihan membaca. 原材料名 menunjukkan daftar bahan, sedangkan 賞味期限 dan 消費期限 menunjukkan jenis batas tanggal yang berbeda.</p></div>
        <div className="grid gap-3 md:grid-cols-3">
          {foodLabels.map((item)=>(<article key={item.id} className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">食品表示 · LABEL MAKANAN</p><h3 className="mt-2 font-mincho text-base font-bold text-[#F1EBDD]">{item.name}</h3>
            <div className="mt-3 rounded-lg border border-[#8EAE93]/20 bg-[#202720] p-3"><p className="text-[9px] font-bold text-[#A9CDB0]">原材料名</p><p className="mt-1 font-mincho text-sm leading-6 text-[#F1EBDD]">{item.ingredients}</p><p className="mt-1 text-[9px] text-[#A9A398]">{item.reading} · {item.meaning}</p></div>
            <p className="mt-3 text-[10px] leading-5 text-[#C8C2B8]">{item.allergens}</p>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3"><span className="text-[9px] text-[#A9A398]">{item.dateLabel}</span><span className="text-[10px] font-bold text-[#CFE4D2]">{item.dateValue}</span></div>
          </article>))}
        </div>
        <div className="rounded-xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">CATATAN</p><p className="mt-2 text-xs leading-6 text-[#C8C2B8]">賞味期限 adalah tanggal baik dikonsumsi sebelum, sedangkan 消費期限 adalah batas waktu konsumsi yang dicantumkan untuk makanan yang lebih mudah rusak. Selalu baca label produk yang sebenarnya dengan teliti.</p></div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KANJI DAN KATA PENTING</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali tulisan tentang bahan makanan dan perlengkapan</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9CDB0]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">SIMULASI INTERAKTIF</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membawa barang dan memilih makanan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi tentang membawa barang, memilih makanan, menanyakan bahan, dan membaca label. Setiap situasi harus dijawab benar.</p>
        </div>
        {simulations.map((task, index) => {
          const selected = simulationChoices[index];
          const isCorrect = simulationChecked[index] && selected === task.answer;
          const isWrong = simulationChecked[index] && selected !== task.answer;
          return (
            <article key={task.title} className="space-y-3 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
              <div>
                <p className="text-[9px] font-black tracking-[0.18em] text-[#8EAE93]">{task.title}</p>
                <h3 className="mt-1 text-base font-black text-[#EAE6DD]">{task.heading}</h3>
                <p className="mt-1 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></p>
              </div>
              <div className="rounded-xl border border-[#6E9A75]/20 bg-[#202720] p-4">
                <p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.japanese}</JapaneseReading></p>
                <p className="mt-1 text-[10px] text-[#A9CDB0]">{task.translation}</p>
              </div>
              <div className="grid gap-2">
                {task.options.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    disabled={Boolean(isCorrect)}
                    aria-pressed={selected === option.key}
                    onClick={() => {
                      setSimulationChoices((current) => ({ ...current, [index]: option.key }));
                      setSimulationChecked((current) => ({ ...current, [index]: false }));
                    }}
                    className={"rounded-xl border p-3 text-left transition-colors " + (
                      isCorrect && option.key === task.answer
                        ? "border-emerald-500/50 bg-emerald-500/10"
                        : isWrong && selected === option.key
                          ? "border-red-400/50 bg-red-400/10"
                          : selected === option.key
                            ? "border-[#8EAE93]/60 bg-[#476C51]/15"
                            : "border-white/[0.07] bg-black/10"
                    )}
                  >
                    <p className="font-mincho text-sm text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></p>
                    <p className="mt-1 text-[10px] text-[#A9A398]">{option.meaning}</p>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p role="status" aria-live="polite" className="text-[10px] leading-5 text-[#A9A398]">
                  {isCorrect
                    ? "Benar. " + task.explanation
                    : isWrong
                      ? "Belum tepat. Coba pilih jawaban lain."
                      : "Pilih satu jawaban, lalu periksa."}
                </p>
                <button
                  type="button"
                  disabled={!selected || Boolean(isCorrect)}
                  onClick={() => setSimulationChecked((current) => ({ ...current, [index]: true }))}
                  className="rounded-lg bg-[#426B4C] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#365A3F] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
                >
                  {isCorrect ? "Selesai" : "Periksa"}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban praktik harus benar untuk membuka evaluasi akhir.</p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#8EAE93]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></h3>
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
                              ? "border-[#8EAE93]/60 bg-[#476C51]/15 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {practiceSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
                    <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.explanation}</JapaneseReading>
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
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#6E9A75]/35 px-4 py-2 text-xs font-bold text-[#B5D0B9]">
              <RefreshCw size={13} /> Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={Object.keys(practiceAnswers).length !== practiceTasks.length}
              className="rounded-lg bg-[#426B4C] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#8EAE93]">SOAL {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.prompt}</JapaneseReading></h3>
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
                              ? "border-[#8EAE93]/60 bg-[#476C51]/15 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
                    <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.explanation}</JapaneseReading>
                  </p>
                )}
              </article>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">
            {quizSubmitted
              ? "Nilai kuis: " + score + " dari " + quizQuestions.length + " benar."
              : Object.keys(answers).length + " dari " + quizQuestions.length + " pertanyaan dijawab."}
          </p>
          {quizSubmitted ? (
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#6E9A75]/35 px-4 py-2 text-xs font-bold text-[#B5D0B9]">
              <RefreshCw size={13} /> Ulangi kuis
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="rounded-lg bg-[#426B4C] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa jawaban
            </button>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[#6E9A75]/25 bg-gradient-to-br from-[#202D22] to-[#191817] p-5 md:p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-[#A9CDB0]" />
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9CDB0]">CEK TARGET KOMUNIKASI</p>
        </div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. </p>
        <div className="mt-4 space-y-3">
          {canDos.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
              <p className="text-xs font-semibold leading-5 text-[#EAE6DD]">
                <span className="mr-2 text-[#A9CDB0]">{String(index + 1).padStart(2, "0")}</span>
                {item.text}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ratingOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    disabled={!quizSubmitted || !practiceIsCorrect || !simulationsComplete}
                    aria-pressed={visibleRatings[item.id] === option.value}
                    onClick={() => {
                      const next = { ...visibleRatings, [item.id]: option.value };
                      setRatings(next);
                      saveIrodoriSelfEvaluation(lessonId, next);
                    }}
                    className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 " + (
                      visibleRatings[item.id] === option.value
                        ? "border-[#8EAE93]/60 bg-[#476C51]/20 text-[#CFE4D2]"
                        : "border-white/[0.08] bg-[#24221F] text-[#A3A099]"
                    )}
                  >
                    <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
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
              onClick={() => completeIrodoriLesson(lessonId)}
              disabled={!quizSubmitted || !practiceIsCorrect || !simulationsComplete || !canDosRated}
              className="inline-flex items-center gap-2 rounded-xl bg-[#426B4C] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#365A3F] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              <CheckCircle2 size={15} /> Tandai pelajaran selesai
            </button>
          )}
          <Link
            href="/irodori/elementary-1"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#8EAE93]/40 hover:text-[#EAE6DD]"
          >
            Daftar pelajaran <ArrowLeft size={15} className="rotate-180" />
          </Link>
        </div>
        {(!quizSubmitted || !practiceIsCorrect || !simulationsComplete || !canDosRated) && (
          <p className="mt-2 text-[10px] leading-5 text-[#817A73]">
            Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian target komunikasi.
          </p>
        )}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Dialog, tokoh, label fiktif, dan situasi latihan dibuat orisinal oleh Fude untuk melatih komunikasi saat menyiapkan acara makan bersama.
      </p>
    </main>
  );
}
