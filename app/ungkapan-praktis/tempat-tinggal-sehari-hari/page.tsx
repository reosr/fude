"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Lightbulb,
  MessagesSquare,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import JapaneseReading from "@/components/JapaneseReading";

type Phrase = {
  jp: string;
  romaji: string;
  id: string;
  note?: string;
  tone?: string;
};

function PhraseCard({ phrase }: { phrase: Phrase }) {
  return (
    <div className="rounded-xl border border-[#33312E] bg-[#191817]/90 p-3 sm:p-4">
      {phrase.tone && (
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#B8860B]">
          {phrase.tone}
        </p>
      )}
      <JapaneseReading
        html={phrase.jp}
        romaji={phrase.romaji}
        translation={phrase.id}
        contentClassName="font-mincho text-lg leading-[2.1] text-[#EAE6DD] sm:text-xl"
        kanaClassName="mt-1 font-mincho text-sm text-[#D9B66D]"
        romajiClassName="mt-1 text-xs italic text-[#A3A099]"
        translationClassName="mt-2 text-sm leading-relaxed text-[#C5C0B7]"
      />
      {phrase.note && (
        <p className="mt-3 border-t border-[#33312E] pt-2 text-xs leading-relaxed text-[#A3A099]">
          {phrase.note}
        </p>
      )}
    </div>
  );
}

type DialogueLine = Phrase & { speaker: string };

function Dialogue({ title, context, lines }: { title: string; context: string; lines: DialogueLine[] }) {
  return (
    <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="font-bold text-[#EAE6DD]">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-[#A3A099]">{context}</p>
      </div>
      <div className="space-y-3">
        {lines.map((line, index) => (
          <div key={title + "-" + index} className="grid grid-cols-[74px_minmax(0,1fr)] gap-2 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-3">
            <span className="pt-1 text-[10px] font-bold text-[#D9B66D] sm:text-xs">{line.speaker}</span>
            <div className="min-w-0 rounded-xl border border-[#33312E]/80 bg-[#121110]/70 p-3">
              <JapaneseReading
                html={line.jp}
                romaji={line.romaji}
                translation={line.id}
                contentClassName="font-mincho text-base leading-[2] text-[#EAE6DD] sm:text-lg"
                kanaClassName="mt-1 font-mincho text-xs text-[#D9B66D]"
                romajiClassName="mt-1 text-[11px] italic text-[#A3A099]"
                translationClassName="mt-2 text-xs leading-relaxed text-[#A3A099]"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const phrases: { title: string; description: string; items: Phrase[] }[] = [
  {
    title: "A. Masalah di rumah atau apartemen",
    description: "Ungkapan untuk menjelaskan kerusakan fasilitas dan meminta bantuan pengelola tempat tinggal.",
    items: [
      { jp: "エアコンが<ruby>動<rt>うご</rt></ruby>きません。", romaji: "Eakon ga ugokimasen.", id: "AC-nya tidak berfungsi.", tone: "Melaporkan kerusakan" },
      { jp: "お<ruby>湯<rt>ゆ</rt></ruby>が<ruby>出<rt>で</rt></ruby>ません。", romaji: "Oyu ga demasen.", id: "Air panasnya tidak keluar.", tone: "Masalah air panas" },
      { jp: "<ruby>水<rt>みず</rt></ruby>が<ruby>漏<rt>も</rt></ruby>れています。", romaji: "Mizu ga morete imasu.", id: "Ada kebocoran air.", tone: "Melaporkan kebocoran" },
      { jp: "<ruby>電気<rt>でんき</rt></ruby>がつきません。", romaji: "Denki ga tsukimasen.", id: "Lampunya tidak menyala.", tone: "Masalah listrik atau lampu" },
      { jp: "<ruby>鍵<rt>かぎ</rt></ruby>をなくしてしまいました。", romaji: "Kagi o nakushite shimaimashita.", id: "Saya kehilangan kunci.", tone: "Masalah kunci" },
      { jp: "<ruby>管理会社<rt>かんりがいしゃ</rt></ruby>に<ruby>連絡<rt>れんらく</rt></ruby>したいです。", romaji: "Kanri gaisha ni renraku shitai desu.", id: "Saya ingin menghubungi perusahaan pengelola.", tone: "Menghubungi pengelola" },
    ],
  },
  {
    title: "B. Sampah dan fasilitas bersama",
    description: "Pelajari cara bertanya tentang pemilahan sampah dan aturan penggunaan fasilitas di tempat tinggal.",
    items: [
      { jp: "ゴミはどこに<ruby>出<rt>だ</rt></ruby>せばいいですか。", romaji: "Gomi wa doko ni daseba ii desu ka.", id: "Sampah harus dibuang di mana?", tone: "Menanyakan lokasi sampah" },
      { jp: "<ruby>何曜日<rt>なんようび</rt></ruby>に<ruby>出<rt>だ</rt></ruby>せばいいですか。", romaji: "Nanyoubi ni daseba ii desu ka.", id: "Sampah harus dikeluarkan pada hari apa?", tone: "Menanyakan jadwal" },
      { jp: "ゴミの<ruby>分<rt>わ</rt></ruby>け<ruby>方<rt>かた</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えてください。", romaji: "Gomi no wakekata o oshiete kudasai.", id: "Tolong jelaskan cara memilah sampah.", tone: "Menanyakan pemilahan" },
      { jp: "これは<ruby>燃<rt>も</rt></ruby>えるゴミですか。", romaji: "Kore wa moeru gomi desu ka.", id: "Apakah ini termasuk sampah yang bisa dibakar?", tone: "Memastikan kategori sampah" },
      { jp: "<ruby>粗大<rt>そだい</rt></ruby>ゴミはどうやって<ruby>出<rt>だ</rt></ruby>しますか。", romaji: "Sodai gomi wa dou yatte dashimasu ka.", id: "Bagaimana cara membuang sampah berukuran besar?", tone: "Sampah berukuran besar" },
      { jp: "<ruby>洗濯機<rt>せんたくき</rt></ruby>は<ruby>何時<rt>なんじ</rt></ruby>まで<ruby>使<rt>つか</rt></ruby>えますか。", romaji: "Sentakuki wa nanji made tsukaemasu ka.", id: "Sampai pukul berapa mesin cuci boleh digunakan?", tone: "Aturan fasilitas bersama" },
    ],
  },
  {
    title: "C. Berkenalan dan berbicara dengan tetangga",
    description: "Ungkapan sederhana untuk menyapa tetangga, meminta pengertian, dan menjaga hubungan baik.",
    items: [
      { jp: "<ruby>隣<rt>となり</rt></ruby>の<ruby>部屋<rt>へや</rt></ruby>に<ruby>引<rt>ひ</rt></ruby>っ<ruby>越<rt>こ</rt></ruby>してきました。", romaji: "Tonari no heya ni hikkoshite kimashita.", id: "Saya baru pindah ke kamar sebelah.", tone: "Memperkenalkan diri" },
      { jp: "これからよろしくお願いします。", romaji: "Kore kara yoroshiku onegaishimasu.", id: "Mohon hubungan baiknya mulai sekarang.", tone: "Salam kepada tetangga" },
      { jp: "<ruby>少<rt>すこ</rt></ruby>し<ruby>音<rt>おと</rt></ruby>を<ruby>小<rt>ちい</rt></ruby>さくしていただけますか。", romaji: "Sukoshi oto o chiisaku shite itadakemasu ka.", id: "Bisakah suaranya sedikit dikecilkan?", tone: "Meminta dengan sopan" },
      { jp: "ご<ruby>迷惑<rt>めいわく</rt></ruby>をおかけしてすみません。", romaji: "Gomeiwaku o okake shite sumimasen.", id: "Maaf sudah merepotkan.", tone: "Meminta maaf" },
      { jp: "<ruby>何<rt>なに</rt></ruby>か<ruby>困<rt>こま</rt></ruby>ったことがあったら、<ruby>教<rt>おし</rt></ruby>えてください。", romaji: "Nanika komatta koto ga attara, oshiete kudasai.", id: "Kalau ada masalah atau kesulitan, beri tahu saya, ya.", tone: "Menawarkan bantuan" },
    ],
  },
  {
    title: "D. Paket dan area bersama",
    description: "Ungkapan yang sering berguna ketika menerima kiriman atau menggunakan fasilitas gedung.",
    items: [
      { jp: "<ruby>宅配便<rt>たくはいびん</rt></ruby>が<ruby>届<rt>とど</rt></ruby>いています。", romaji: "Takuhaibin ga todoite imasu.", id: "Ada paket yang sudah tiba.", tone: "Informasi kiriman" },
      { jp: "<ruby>宅配<rt>たくはい</rt></ruby>ボックスに<ruby>入<rt>い</rt></ruby>れてください。", romaji: "Takuhai bokkusu ni irete kudasai.", id: "Tolong letakkan di kotak paket.", tone: "Instruksi pengantaran" },
      { jp: "<ruby>荷物<rt>にもつ</rt></ruby>を<ruby>受<rt>う</rt></ruby>け<ruby>取<rt>と</rt></ruby>れませんでした。", romaji: "Nimotsu o uketoremasen deshita.", id: "Saya tidak berhasil menerima paketnya.", tone: "Paket tidak diterima" },
      { jp: "<ruby>再配達<rt>さいはいたつ</rt></ruby>をお願いできますか。", romaji: "Saihaitatsu o onegaidekimasu ka.", id: "Bisakah paketnya diantarkan kembali?", tone: "Meminta pengantaran ulang" },
      { jp: "エレベーターはどこですか。", romaji: "Erebeetaa wa doko desu ka.", id: "Lift ada di mana?", tone: "Mencari fasilitas gedung" },
    ],
  },
];

const dialogues: { title: string; context: string; lines: DialogueLine[] }[] = [
  {
    title: "Percakapan 1 · Berkenalan dengan tetangga",
    context: "Kamu baru pindah ke apartemen dan bertemu tetangga di lorong.",
    lines: [
      { speaker: "佐藤", jp: "こんにちは。<ruby>隣<rt>となり</rt></ruby>の<ruby>部屋<rt>へや</rt></ruby>に<ruby>引<rt>ひ</rt></ruby>っ<ruby>越<rt>こ</rt></ruby>してきた佐藤です。", romaji: "Konnichiwa. Tonari no heya ni hikkoshite kita Satou desu.", id: "Halo. Saya Sato, baru pindah ke kamar sebelah." },
      { speaker: "隣人", jp: "そうなんですね。よろしくお願いします。", romaji: "Sou nan desu ne. Yoroshiku onegaishimasu.", id: "Oh, begitu. Senang berkenalan dengan Anda." },
      { speaker: "佐藤", jp: "こちらこそ、これからよろしくお願いします。", romaji: "Kochira koso, kore kara yoroshiku onegaishimasu.", id: "Saya juga. Mohon hubungan baiknya mulai sekarang." },
      { speaker: "隣人", jp: "<ruby>何<rt>なに</rt></ruby>か<ruby>困<rt>こま</rt></ruby>ったことがあったら、<ruby>教<rt>おし</rt></ruby>えてください。", romaji: "Nanika komatta koto ga attara, oshiete kudasai.", id: "Kalau ada kesulitan, beri tahu saya, ya." },
    ],
  },
  {
    title: "Percakapan 2 · Melaporkan masalah di apartemen",
    context: "Air panas di apartemenmu tidak keluar, jadi kamu menghubungi pengelola.",
    lines: [
      { speaker: "入居者", jp: "すみません。<ruby>部屋<rt>へや</rt></ruby>のお<ruby>湯<rt>ゆ</rt></ruby>が<ruby>出<rt>で</rt></ruby>ません。", romaji: "Sumimasen. Heya no oyu ga demasen.", id: "Permisi. Air panas di kamar saya tidak keluar." },
      { speaker: "管理人", jp: "いつからですか。", romaji: "Itsu kara desu ka.", id: "Sejak kapan?" },
      { speaker: "入居者", jp: "<ruby>今朝<rt>けさ</rt></ruby>からです。", romaji: "Kesa kara desu.", id: "Sejak pagi ini." },
      { speaker: "管理人", jp: "わかりました。<ruby>確認<rt>かくにん</rt></ruby>に<ruby>伺<rt>うかが</rt></ruby>います。", romaji: "Wakarimashita. Kakunin ni ukagaimasu.", id: "Baik. Kami akan datang untuk memeriksanya." },
      { speaker: "入居者", jp: "ありがとうございます。よろしくお願いします。", romaji: "Arigatou gozaimasu. Yoroshiku onegaishimasu.", id: "Terima kasih. Mohon bantuannya." },
    ],
  },
  {
    title: "Percakapan 3 · Menanyakan jadwal pembuangan sampah",
    context: "Kamu belum memahami aturan pemilahan sampah di lingkungan tempat tinggal.",
    lines: [
      { speaker: "入居者", jp: "すみません。ゴミの<ruby>分<rt>わ</rt></ruby>け<ruby>方<rt>かた</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えていただけますか。", romaji: "Sumimasen. Gomi no wakekata o oshiete itadakemasu ka.", id: "Permisi. Bisakah Anda menjelaskan cara memilah sampah?" },
      { speaker: "管理人", jp: "<ruby>燃<rt>も</rt></ruby>えるゴミは<ruby>月曜日<rt>げつようび</rt></ruby>と<ruby>木曜日<rt>もくようび</rt></ruby>です。", romaji: "Moeru gomi wa getsuyoubi to mokuyoubi desu.", id: "Sampah yang bisa dibakar dijemput pada hari Senin dan Kamis." },
      { speaker: "入居者", jp: "<ruby>何時<rt>なんじ</rt></ruby>までに<ruby>出<rt>だ</rt></ruby>せばいいですか。", romaji: "Nanji made ni daseba ii desu ka.", id: "Sampah harus dikeluarkan paling lambat pukul berapa?" },
      { speaker: "管理人", jp: "<ruby>朝<rt>あさ</rt></ruby><ruby>八時<rt>はちじ</rt></ruby>までに<ruby>出<rt>だ</rt></ruby>してください。", romaji: "Asa hachi-ji made ni dashite kudasai.", id: "Silakan keluarkan sampah sebelum pukul delapan pagi." },
      { speaker: "入居者", jp: "わかりました。ありがとうございます。", romaji: "Wakarimashita. Arigatou gozaimasu.", id: "Baik, saya mengerti. Terima kasih." },
    ],
  },
];

const vocabulary = [
  { word: "<ruby>管理会社<rt>かんりがいしゃ</rt></ruby>", reading: "かんりがいしゃ", romaji: "kanri gaisha", meaning: "Perusahaan pengelola gedung" },
  { word: "<ruby>管理人<rt>かんりにん</rt></ruby>", reading: "かんりにん", romaji: "kanrinin", meaning: "Pengelola / petugas gedung" },
  { word: "<ruby>設備<rt>せつび</rt></ruby>", reading: "せつび", romaji: "setsubi", meaning: "Fasilitas / instalasi" },
  { word: "<ruby>故障<rt>こしょう</rt></ruby>", reading: "こしょう", romaji: "koshou", meaning: "Kerusakan / tidak berfungsi" },
  { word: "<ruby>分別<rt>ぶんべつ</rt></ruby>", reading: "ぶんべつ", romaji: "bunbetsu", meaning: "Pemilahan (sampah)" },
  { word: "<ruby>燃<rt>も</rt></ruby>えるゴミ", reading: "もえるごみ", romaji: "moeru gomi", meaning: "Sampah yang dapat dibakar" },
  { word: "<ruby>粗大<rt>そだい</rt></ruby>ゴミ", reading: "そだいごみ", romaji: "sodai gomi", meaning: "Sampah berukuran besar" },
  { word: "<ruby>宅配便<rt>たくはいびん</rt></ruby>", reading: "たくはいびん", romaji: "takuhaibin", meaning: "Layanan pengiriman paket" },
];

const quiz = [
  {
    question: "Air panas di apartemenmu tidak keluar. Apa yang sebaiknya kamu sampaikan kepada pengelola?",
    options: [
      { label: "お<ruby>湯<rt>ゆ</rt></ruby>が<ruby>出<rt>で</rt></ruby>ません。", correct: true, feedback: "Benar. お湯が出ません berarti air panas tidak keluar." },
      { label: "<ruby>鍵<rt>かぎ</rt></ruby>をなくしました。", correct: false, feedback: "Kalimat ini berarti kehilangan kunci." },
      { label: "エレベーターはどこですか。", correct: false, feedback: "Kalimat ini menanyakan letak lift." },
    ],
  },
  {
    question: "Kamu ingin mengetahui hari yang tepat untuk mengeluarkan sampah. Pertanyaan mana yang sesuai?",
    options: [
      { label: "<ruby>何曜日<rt>なんようび</rt></ruby>に<ruby>出<rt>だ</rt></ruby>せばいいですか。", correct: true, feedback: "Tepat. Pertanyaan ini menanyakan hari untuk mengeluarkan sampah." },
      { label: "<ruby>何時<rt>なんじ</rt></ruby>に<ruby>着<rt>つ</rt></ruby>きますか。", correct: false, feedback: "Kalimat ini menanyakan pukul berapa seseorang tiba." },
      { label: "<ruby>水<rt>みず</rt></ruby>が<ruby>漏<rt>も</rt></ruby>れています。", correct: false, feedback: "Kalimat ini melaporkan kebocoran air." },
    ],
  },
  {
    question: "Petugas pengiriman tidak berhasil menyerahkan paket. Kamu ingin meminta pengantaran ulang. Apa yang kamu katakan?",
    options: [
      { label: "ゴミの<ruby>分<rt>わ</rt></ruby>け<ruby>方<rt>かた</rt></ruby>を<ruby>教<rt>おし</rt></ruby>てください。", correct: false, feedback: "Kalimat ini meminta penjelasan cara memilah sampah." },
      { label: "<ruby>再配達<rt>さいはいたつ</rt></ruby>をお願いできますか。", correct: true, feedback: "Benar. 再配達をお願いできますか digunakan untuk meminta pengantaran ulang." },
      { label: "<ruby>洗濯機<rt>せんたくき</rt></ruby>は<ruby>何時<rt>なんじ</rt></ruby>まで<ruby>使<rt>つか</rt></ruby>えますか。", correct: false, feedback: "Kalimat ini menanyakan batas waktu penggunaan mesin cuci." },
    ],
  },
];

const simulation = [
  {
    prompt: "Kamu baru pindah ke apartemen. Tetangga menyapamu:",
    japanese: "こんにちは。こちらに<ruby>引<rt>ひ</rt></ruby>っ<ruby>越<rt>こ</rt></ruby>してきたんですか。",
    romaji: "Konnichiwa. Kochira ni hikkoshite kitan desu ka.",
    translation: "Halo. Apakah kamu baru pindah ke sini?",
    task: "Perkenalkan diri sebagai tetangga baru.",
    options: [
      { label: "<ruby>隣<rt>となり</rt></ruby>の<ruby>部屋<rt>へや</rt></ruby>に<ruby>引<rt>ひ</rt></ruby>っ<ruby>越<rt>こ</rt></ruby>してきました。", correct: true, feedback: "Tepat. Kamu menjelaskan bahwa baru pindah ke kamar sebelah." },
      { label: "お<ruby>湯<rt>ゆ</rt></ruby>が<ruby>出<rt>で</rt></ruby>ません。", correct: false, feedback: "Kalimat ini melaporkan masalah air panas." },
      { label: "<ruby>再配達<rt>さいはいたつ</rt></ruby>をお願いできますか。", correct: false, feedback: "Kalimat ini meminta pengantaran paket ulang." },
    ],
  },
  {
    prompt: "Kamu menelepon pengelola apartemen. Petugas bertanya:",
    japanese: "どのような<ruby>問題<rt>もんだい</rt></ruby>がありますか。",
    romaji: "Dono you na mondai ga arimasu ka.",
    translation: "Masalah seperti apa yang terjadi?",
    task: "Jelaskan bahwa AC tidak berfungsi.",
    options: [
      { label: "エアコンが<ruby>動<rt>うご</rt></ruby>きません。", correct: true, feedback: "Benar. Kamu menyampaikan bahwa AC tidak berfungsi." },
      { label: "<ruby>何曜日<rt>なんようび</rt></ruby>に<ruby>出<rt>だ</rt></ruby>せばいいですか。", correct: false, feedback: "Kalimat ini menanyakan hari untuk mengeluarkan sampah." },
      { label: "これからよろしくお願いします。", correct: false, feedback: "Ungkapan ini digunakan saat berkenalan atau memulai hubungan baik." },
    ],
  },
  {
    prompt: "Kamu bertemu petugas gedung dan ingin memahami aturan sampah. Petugas berkata:",
    japanese: "ゴミについて、<ruby>何<rt>なに</rt></ruby>か<ruby>質問<rt>しつもん</rt></ruby>がありますか。",
    romaji: "Gomi ni tsuite, nanika shitsumon ga arimasu ka.",
    translation: "Apakah ada pertanyaan tentang sampah?",
    task: "Tanyakan cara memilah sampah.",
    options: [
      { label: "<ruby>鍵<rt>かぎ</rt></ruby>をなくしてしまいました。", correct: false, feedback: "Kalimat ini berarti kehilangan kunci." },
      { label: "ゴミの<ruby>分<rt>わ</rt></ruby>け<ruby>方<rt>かた</rt></ruby>を<ruby>教<rt>おし</rt></ruby>てください。", correct: true, feedback: "Tepat. Kamu meminta penjelasan cara memilah sampah." },
      { label: "エレベーターはどこですか。", correct: false, feedback: "Kalimat ini menanyakan letak lift." },
    ],
  },
];

export default function TempatTinggalSehariHariPage() {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationAnswer, setSimulationAnswer] = useState<number | null>(null);

  const answerQuiz = (questionIndex: number, optionIndex: number) => {
    setQuizAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
  };

  const resetSimulation = () => {
    setSimulationStep(0);
    setSimulationAnswer(null);
  };

  const currentSimulation = simulation[simulationStep];

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-12">
      <Link href="/ungkapan-praktis" className="inline-flex items-center gap-2 text-xs font-semibold text-[#A3A099] transition-colors hover:text-[#EAE6DD]">
        <ArrowLeft size={15} /> Kembali ke kategori
      </Link>

      <header className="border-b border-[#33312E] pb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">KATEGORI 05 · MATERI 1</p>
        <h1 className="mt-2 text-2xl font-bold text-[#EAE6DD] sm:text-3xl">Tempat Tinggal dan Kehidupan Sehari-hari</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A3A099]">
          Pelajari cara berbicara dengan tetangga, menjelaskan masalah di apartemen,
          memahami aturan sampah, dan mengurus paket serta fasilitas tempat tinggal.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold">
          <span className="rounded-full border border-[#269B70]/30 bg-[#269B70]/10 px-3 py-1 text-[#66C49C]">Dasar · A1–A2</span>
          <span className="rounded-full border border-[#33312E] bg-[#1E1D1B] px-3 py-1 text-[#A3A099]">3 dialog</span>
          <span className="rounded-full border border-[#33312E] bg-[#1E1D1B] px-3 py-1 text-[#A3A099]">8 kosakata inti</span>
        </div>
      </header>

      <section className="rounded-2xl border border-[#B8860B]/25 bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-[#D9B66D]">
          <Sparkles size={17} />
          <h2 className="text-sm font-bold">Target belajar</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[#C5C0B7]">
          Setelah materi ini, kamu diharapkan bisa menyapa tetangga, melaporkan masalah fasilitas,
          bertanya tentang aturan sampah, serta mengurus paket dan fasilitas gedung.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Ungkapan penting</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Ungkapan praktis untuk penghuni rumah atau apartemen.</p>
        </div>
        {phrases.map((group) => (
          <div key={group.title} className="space-y-3">
            <div>
              <h3 className="font-bold text-[#D9B66D]">{group.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#A3A099]">{group.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.items.map((phrase, index) => (
                <PhraseCard key={group.title + "-" + index} phrase={phrase} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Contoh percakapan</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Tiga situasi: berkenalan dengan tetangga, melapor ke pengelola, dan bertanya tentang sampah.</p>
        </div>
        {dialogues.map((dialogue) => (
          <Dialogue key={dialogue.title} {...dialogue} />
        ))}
      </section>

      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Kebiasaan dan aturan tempat tinggal</h2>
        </div>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[#C5C0B7]">
          <li><span className="font-semibold text-[#EAE6DD]">Aturan sampah berbeda menurut wilayah.</span> Hari pengumpulan, kategori, dan cara membuang sampah ditentukan oleh pemerintah daerah atau pengelola tempat tinggal. Periksa panduan setempat sebelum membuangnya.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Pisahkan sampah sesuai kategori.</span> Ada wilayah yang membedakan sampah yang dapat dibakar, tidak dapat dibakar, barang daur ulang, dan sampah berukuran besar. Istilah dan jadwalnya dapat berbeda.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Perhatikan waktu tenang.</span> Suara dari musik, televisi, percakapan, atau mesin cuci dapat terdengar ke unit lain. Ikuti aturan gedung dan gunakan fasilitas bersama dengan mempertimbangkan tetangga.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Hubungi pengelola untuk kerusakan.</span> Untuk kebocoran, masalah listrik, atau fasilitas yang tidak berfungsi, sampaikan lokasi dan kapan masalah mulai terjadi. Jangan mencoba memperbaiki instalasi berisiko sendiri.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Paket dan pengantaran ulang.</span> Jika tidak ada di rumah saat kurir datang, periksa pemberitahuan pengantaran dan ikuti prosedur untuk meminta pengantaran ulang.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Kosakata inti</h2>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {vocabulary.map((item) => (
            <div key={item.word} className="flex items-center justify-between gap-3 rounded-xl border border-[#33312E] bg-[#121110]/60 p-3">
              <div className="min-w-0">
                <p className="font-mincho text-lg text-[#EAE6DD]" dangerouslySetInnerHTML={{ __html: item.word }} />
                <p className="mt-0.5 text-[10px] text-[#A3A099]">{item.reading} · {item.romaji}</p>
              </div>
              <p className="text-right text-xs text-[#C5C0B7]">{item.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Latihan memilih ungkapan</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Pilih jawaban yang paling sesuai dengan situasi. Pembahasan muncul setelah kamu memilih.</p>
        </div>
        {quiz.map((item, questionIndex) => {
          const selected = quizAnswers[questionIndex];
          return (
            <div key={questionIndex} className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
              <p className="text-sm font-semibold leading-relaxed text-[#EAE6DD]">{questionIndex + 1}. {item.question}</p>
              <div className="mt-3 grid gap-2">
                {item.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  const showResult = selected !== undefined;
                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      onClick={() => answerQuiz(questionIndex, optionIndex)}
                      className={"rounded-xl border px-3 py-3 text-left text-sm transition-colors " + (
                        showResult && isSelected
                          ? option.correct ? "border-[#269B70]/70 bg-[#269B70]/10 text-[#8ED8B4]" : "border-[#C93438]/70 bg-[#C93438]/10 text-[#F08B8E]"
                          : "border-[#33312E] bg-[#121110]/60 text-[#EAE6DD] hover:border-[#B8860B]/60"
                      )}
                    >
                      <JapaneseReading
                        html={option.label}
                        showKana={false}
                        showRomaji={false}
                        showTranslation={false}
                        contentClassName="font-mincho text-base leading-relaxed text-inherit"
                      />
                    </button>
                  );
                })}
              </div>
              {selected !== undefined && (
                <p className={"mt-3 text-xs leading-relaxed " + (item.options[selected].correct ? "text-[#8ED8B4]" : "text-[#F08B8E]")}>
                  {item.options[selected].feedback}
                </p>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => setQuizAnswers({})}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-[#33312E] px-4 py-2 text-xs font-bold text-[#A3A099] transition-colors hover:border-[#B8860B]/50 hover:text-[#EAE6DD]"
        >
          <RotateCcw size={14} /> Ulangi latihan
        </button>
      </section>

      <section className="rounded-2xl border border-[#B8860B]/30 bg-gradient-to-br from-[#241F16] to-[#1A1918] p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <MessagesSquare size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Simulasi percakapan</h2>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-[#A3A099]">
          Hadapi tiga situasi sehari-hari di tempat tinggal. Pilih respons yang sesuai agar komunikasi berjalan lancar.
        </p>

        <div className="mt-4 rounded-xl border border-[#49402E] bg-[#121110]/70 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B]">LANGKAH {simulationStep + 1} DARI {simulation.length}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#EAE6DD]">{currentSimulation.prompt}</p>
          <div className="mt-3 rounded-lg border border-[#33312E] bg-[#1E1D1B] p-3">
            <JapaneseReading
              html={currentSimulation.japanese}
              romaji={currentSimulation.romaji}
              translation={currentSimulation.translation}
              contentClassName="font-mincho text-base leading-[2] text-[#EAE6DD]"
              kanaClassName="mt-1 font-mincho text-xs text-[#D9B66D]"
              romajiClassName="mt-1 text-[11px] italic text-[#A3A099]"
              translationClassName="mt-2 text-xs text-[#A3A099]"
            />
          </div>
          <p className="mt-3 text-xs font-semibold text-[#D9B66D]">{currentSimulation.task}</p>
          <div className="mt-3 grid gap-2">
            {currentSimulation.options.map((option, index) => (
              <button
                key={index}
                type="button"
                disabled={simulationAnswer !== null}
                onClick={() => setSimulationAnswer(index)}
                className={"rounded-xl border px-3 py-3 text-left text-sm transition-colors " + (
                  simulationAnswer === index
                    ? option.correct
                      ? "border-[#269B70]/70 bg-[#269B70]/10 text-[#8ED8B4]"
                      : "border-[#C93438]/70 bg-[#C93438]/10 text-[#F08B8E]"
                    : "border-[#33312E] bg-[#1E1D1B] text-[#EAE6DD] hover:border-[#B8860B]/60 disabled:opacity-60"
                )}
              >
                <JapaneseReading
                  html={option.label}
                  showKana={false}
                  showRomaji={false}
                  showTranslation={false}
                  contentClassName="font-mincho text-base leading-relaxed text-inherit"
                />
              </button>
            ))}
          </div>
          {simulationAnswer !== null && (
            <div className="mt-3 rounded-lg bg-[#1E1D1B] p-3">
              <p className={"text-xs leading-relaxed " + (currentSimulation.options[simulationAnswer].correct ? "text-[#8ED8B4]" : "text-[#F08B8E]")}>
                {currentSimulation.options[simulationAnswer].feedback}
              </p>
              <div className="mt-3 flex justify-end">
                {simulationStep < simulation.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => { setSimulationStep((step) => step + 1); setSimulationAnswer(null); }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#B8860B] px-3 py-2 text-xs font-bold text-[#121110] hover:bg-[#D0A63B]"
                  >
                    Lanjut <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetSimulation}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#B8860B] px-3 py-2 text-xs font-bold text-[#121110] hover:bg-[#D0A63B]"
                  >
                    <RotateCcw size={14} /> Ulangi simulasi
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-[#33312E] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/ungkapan-praktis" className="text-xs font-semibold text-[#A3A099] transition-colors hover:text-[#EAE6DD]">
          <ArrowLeft className="mr-1 inline" size={14} /> Daftar kategori
        </Link>
        <p className="text-xs text-[#817A73]">Kategori berikutnya akan ditambahkan bertahap.</p>
      </div>
    </div>
  );
}
