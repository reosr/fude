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
    title: "A. Reservasi dan check-in",
    description: "Ungkapan untuk menyampaikan reservasi, menyebutkan nama, dan menanyakan waktu layanan hotel.",
    items: [
      { jp: "チェックインをお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Chekkuin o onegaishimasu.", id: "Saya ingin check-in.", tone: "Tamu · check-in" },
      { jp: "<ruby>予約<rt>よやく</rt></ruby>しています。", romaji: "Yoyaku shite imasu.", id: "Saya sudah membuat reservasi.", tone: "Tamu · dengan reservasi" },
      { jp: "<ruby>予約<rt>よやく</rt></ruby>していません。", romaji: "Yoyaku shite imasen.", id: "Saya tidak membuat reservasi.", tone: "Tamu · tanpa reservasi" },
      { jp: "ご<ruby>予約<rt>よやく</rt></ruby>のお<ruby>名前<rt>なまえ</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Goyoyaku no onamae o onegaishimasu.", id: "Boleh tahu nama yang digunakan untuk reservasi?", tone: "Petugas · memastikan nama" },
      { jp: "<ruby>朝食<rt>ちょうしょく</rt></ruby>は<ruby>何時<rt>なんじ</rt></ruby>からですか。", romaji: "Choushoku wa nanji kara desu ka.", id: "Sarapan mulai pukul berapa?", tone: "Menanyakan fasilitas makan" },
      { jp: "チェックアウトは<ruby>何時<rt>なんじ</rt></ruby>ですか。", romaji: "Chekkuauto wa nanji desu ka.", id: "Check-out pukul berapa?", tone: "Menanyakan waktu check-out" },
    ],
  },
  {
    title: "B. Fasilitas kamar dan layanan hotel",
    description: "Gunakan ungkapan ini untuk menanyakan fasilitas atau meminta bantuan selama menginap.",
    items: [
      { jp: "Wi-Fiのパスワードは<ruby>何<rt>なん</rt></ruby>ですか。", romaji: "Waifai no pasuwaado wa nan desu ka.", id: "Apa kata sandi Wi-Fi-nya?", tone: "Menanyakan akses internet" },
      { jp: "タオルをもう<ruby>一枚<rt>いちまい</rt></ruby>いただけますか。", romaji: "Taoru o mou ichimai itadakemasu ka.", id: "Bolehkah saya meminta satu handuk lagi?", tone: "Meminta perlengkapan tambahan" },
      { jp: "<ruby>部屋<rt>へや</rt></ruby>に<ruby>冷蔵庫<rt>れいぞうこ</rt></ruby>はありますか。", romaji: "Heya ni reizouko wa arimasu ka.", id: "Apakah ada kulkas di kamar?", tone: "Menanyakan fasilitas kamar" },
      { jp: "エレベーターはどこですか。", romaji: "Erebeetaa wa doko desu ka.", id: "Lift ada di mana?", tone: "Mencari fasilitas hotel" },
      { jp: "<ruby>荷物<rt>にもつ</rt></ruby>を<ruby>預<rt>あず</rt></ruby>かっていただけますか。", romaji: "Nimotsu o azukatte itadakemasu ka.", id: "Bisakah saya menitipkan barang bawaan?", tone: "Meminta penitipan bagasi" },
    ],
  },
  {
    title: "C. Menyampaikan masalah di kamar",
    description: "Kalimat sederhana untuk melaporkan fasilitas yang bermasalah dan meminta bantuan petugas.",
    items: [
      { jp: "エアコンが<ruby>動<rt>うご</rt></ruby>きません。", romaji: "Eakon ga ugokimasen.", id: "AC-nya tidak berfungsi.", tone: "Melaporkan kerusakan" },
      { jp: "シャワーのお<ruby>湯<rt>ゆ</rt></ruby>が<ruby>出<rt>で</rt></ruby>ません。", romaji: "Shawaa no oyu ga demasen.", id: "Air panas di shower tidak keluar.", tone: "Masalah air panas" },
      { jp: "<ruby>隣<rt>となり</rt></ruby>の<ruby>部屋<rt>へや</rt></ruby>が<ruby>少<rt>すこ</rt></ruby>しうるさいです。", romaji: "Tonari no heya ga sukoshi urusai desu.", id: "Kamar sebelah agak berisik.", tone: "Menyampaikan gangguan" },
      { jp: "<ruby>部屋<rt>へや</rt></ruby>を<ruby>変<rt>か</rt></ruby>えていただけますか。", romaji: "Heya o kaete itadakemasu ka.", id: "Bisakah saya pindah kamar?", tone: "Meminta solusi" },
      { jp: "<ruby>部屋<rt>へや</rt></ruby>の<ruby>鍵<rt>かぎ</rt></ruby>をなくしてしまいました。", romaji: "Heya no kagi o nakushite shimaimashita.", id: "Saya kehilangan kunci kamar.", tone: "Melaporkan masalah kunci" },
      { jp: "すぐに<ruby>確認<rt>かくにん</rt></ruby>いたします。", romaji: "Sugu ni kakunin itashimasu.", id: "Kami akan segera memeriksanya.", tone: "Petugas · menanggapi keluhan" },
    ],
  },
  {
    title: "D. Check-out dan mengurus bagasi",
    description: "Ungkapan untuk menyelesaikan pembayaran, meminta bukti pembayaran, dan mengatur perjalanan setelah menginap.",
    items: [
      { jp: "チェックアウトをお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Chekkuauto o onegaishimasu.", id: "Saya ingin check-out.", tone: "Menyelesaikan masa menginap" },
      { jp: "<ruby>領収書<rt>りょうしゅうしょ</rt></ruby>をいただけますか。", romaji: "Ryoushuusho o itadakemasu ka.", id: "Bolehkah saya meminta kuitansi?", tone: "Meminta bukti pembayaran" },
      { jp: "<ruby>別々<rt>べつべつ</rt></ruby>に<ruby>払<rt>はら</rt></ruby>えますか。", romaji: "Betsubetsu ni haraemasu ka.", id: "Bisakah kami membayar secara terpisah?", tone: "Pembayaran terpisah" },
      { jp: "タクシーを<ruby>呼<rt>よ</rt></ruby>んでいただけますか。", romaji: "Takushii o yonde itadakemasu ka.", id: "Bisakah Anda memanggilkan taksi?", tone: "Meminta bantuan transportasi" },
      { jp: "お<ruby>世話<rt>せわ</rt></ruby>になりました。", romaji: "Osewa ni narimashita.", id: "Terima kasih atas pelayanan dan bantuannya selama saya menginap.", tone: "Ucapan saat akan pergi", note: "Ungkapan sopan untuk menyampaikan terima kasih atas bantuan atau pelayanan yang diterima." },
    ],
  },
];

const dialogues: { title: string; context: string; lines: DialogueLine[] }[] = [
  {
    title: "Percakapan 1 · Check-in dengan reservasi",
    context: "Kamu tiba di hotel dan ingin melakukan check-in menggunakan nama reservasi.",
    lines: [
      { speaker: "フロント", jp: "いらっしゃいませ。ご<ruby>予約<rt>よやく</rt></ruby>のお<ruby>名前<rt>なまえ</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Irasshaimase. Goyoyaku no onamae o onegaishimasu.", id: "Selamat datang. Boleh tahu nama yang digunakan untuk reservasi?" },
      { speaker: "お客様", jp: "<ruby>田中<rt>たなか</rt></ruby>です。<ruby>予約<rt>よやく</rt></ruby>しています。", romaji: "Tanaka desu. Yoyaku shite imasu.", id: "Atas nama Tanaka. Saya sudah membuat reservasi." },
      { speaker: "フロント", jp: "ありがとうございます。こちらが<ruby>部屋<rt>へや</rt></ruby>のカードキーです。", romaji: "Arigatou gozaimasu. Kochira ga heya no kaado kii desu.", id: "Terima kasih. Ini kartu kunci kamar Anda." },
      { speaker: "お客様", jp: "<ruby>朝食<rt>ちょうしょく</rt></ruby>は<ruby>何時<rt>なんじ</rt></ruby>からですか。", romaji: "Choushoku wa nanji kara desu ka.", id: "Sarapan mulai pukul berapa?" },
      { speaker: "フロント", jp: "<ruby>朝<rt>あさ</rt></ruby><ruby>七時<rt>しちじ</rt></ruby>からです。", romaji: "Asa shichi-ji kara desu.", id: "Mulai pukul tujuh pagi." },
      { speaker: "お客様", jp: "わかりました。ありがとうございます。", romaji: "Wakarimashita. Arigatou gozaimasu.", id: "Baik, saya mengerti. Terima kasih." },
    ],
  },
  {
    title: "Percakapan 2 · Melaporkan masalah kamar",
    context: "Setelah masuk kamar, kamu mendapati AC tidak berfungsi dan menghubungi petugas hotel.",
    lines: [
      { speaker: "お客様", jp: "すみません。エアコンが<ruby>動<rt>うご</rt></ruby>きません。", romaji: "Sumimasen. Eakon ga ugokimasen.", id: "Permisi. AC-nya tidak berfungsi." },
      { speaker: "フロント", jp: "ご<ruby>不便<rt>ふべん</rt></ruby>をおかけして<ruby>申<rt>もう</rt></ruby>し<ruby>訳<rt>わけ</rt></ruby>ございません。すぐに<ruby>確認<rt>かくにん</rt></ruby>いたします。", romaji: "Gofuben o okake shite moushiwake gozaimasen. Sugu ni kakunin itashimasu.", id: "Mohon maaf atas ketidaknyamanannya. Kami akan segera memeriksanya." },
      { speaker: "お客様", jp: "もし<ruby>直<rt>なお</rt></ruby>らない<ruby>場合<rt>ばあい</rt></ruby>、<ruby>部屋<rt>へや</rt></ruby>を<ruby>変<rt>か</rt></ruby>えていただけますか。", romaji: "Moshi naoranai baai, heya o kaete itadakemasu ka.", id: "Jika tidak bisa diperbaiki, bisakah saya pindah kamar?" },
      { speaker: "フロント", jp: "はい。<ruby>別<rt>べつ</rt></ruby>のお<ruby>部屋<rt>へや</rt></ruby>をご<ruby>用意<rt>ようい</rt></ruby>いたします。", romaji: "Hai. Betsu no oheya o go-youi itashimasu.", id: "Baik. Kami akan menyiapkan kamar lain." },
      { speaker: "お客様", jp: "ありがとうございます。", romaji: "Arigatou gozaimasu.", id: "Terima kasih." },
    ],
  },
  {
    title: "Percakapan 3 · Check-out dan meminta kuitansi",
    context: "Kamu sudah selesai menginap dan ingin menyelesaikan pembayaran sebelum pergi.",
    lines: [
      { speaker: "お客様", jp: "チェックアウトをお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Chekkuauto o onegaishimasu.", id: "Saya ingin check-out." },
      { speaker: "フロント", jp: "かしこまりました。お<ruby>支払<rt>しはら</rt></ruby>いはカードですか、<ruby>現金<rt>げんきん</rt></ruby>ですか。", romaji: "Kashikomarimashita. Oshiharai wa kaado desu ka, genkin desu ka.", id: "Baik. Pembayarannya dengan kartu atau uang tunai?" },
      { speaker: "お客様", jp: "カードでお<ruby>願<rt>ねが</rt></ruby>いします。<ruby>領収書<rt>りょうしゅうしょ</rt></ruby>もいただけますか。", romaji: "Kaado de onegaishimasu. Ryoushuusho mo itadakemasu ka.", id: "Dengan kartu, ya. Bolehkah saya meminta kuitansinya juga?" },
      { speaker: "フロント", jp: "もちろんです。こちらが<ruby>領収書<rt>りょうしゅうしょ</rt></ruby>です。", romaji: "Mochiron desu. Kochira ga ryoushuusho desu.", id: "Tentu. Ini kuitansinya." },
      { speaker: "お客様", jp: "お<ruby>世話<rt>せわ</rt></ruby>になりました。", romaji: "Osewa ni narimashita.", id: "Terima kasih atas pelayanan dan bantuannya selama saya menginap." },
    ],
  },
];

const vocabulary = [
  { word: "<ruby>宿泊<rt>しゅくはく</rt></ruby>", reading: "しゅくはく", romaji: "shukuhaku", meaning: "Menginap" },
  { word: "<ruby>予約<rt>よやく</rt></ruby>", reading: "よやく", romaji: "yoyaku", meaning: "Reservasi" },
  { word: "<ruby>受付<rt>うけつけ</rt></ruby>", reading: "うけつけ", romaji: "uketsuke", meaning: "Resepsionis / pendaftaran" },
  { word: "<ruby>客室<rt>きゃくしつ</rt></ruby>", reading: "きゃくしつ", romaji: "kyakushitsu", meaning: "Kamar tamu" },
  { word: "<ruby>荷物<rt>にもつ</rt></ruby>", reading: "にもつ", romaji: "nimotsu", meaning: "Barang bawaan / bagasi" },
  { word: "<ruby>領収書<rt>りょうしゅうしょ</rt></ruby>", reading: "りょうしゅうしょ", romaji: "ryoushuusho", meaning: "Kuitansi" },
  { word: "<ruby>朝食<rt>ちょうしょく</rt></ruby>", reading: "ちょうしょく", romaji: "choushoku", meaning: "Sarapan" },
  { word: "<ruby>鍵<rt>かぎ</rt></ruby>", reading: "かぎ", romaji: "kagi", meaning: "Kunci" },
];

const quiz = [
  {
    question: "Kamu sudah memesan kamar dan tiba di hotel. Petugas meminta nama reservasi. Apa jawaban yang sesuai?",
    options: [
      { label: "<ruby>田中<rt>たなか</rt></ruby>です。<ruby>予約<rt>よやく</rt></ruby>しています。", correct: true, feedback: "Benar. Kamu menyebutkan nama dan memberi tahu bahwa sudah memiliki reservasi." },
      { label: "<ruby>領収書<rt>りょうしゅうしょ</rt></ruby>をいただけますか。", correct: false, feedback: "Kalimat ini digunakan untuk meminta kuitansi, biasanya saat check-out." },
      { label: "<ruby>部屋<rt>へや</rt></ruby>を<ruby>変<rt>か</rt></ruby>えていただけますか。", correct: false, feedback: "Kalimat ini digunakan untuk meminta pindah kamar." },
    ],
  },
  {
    question: "AC kamar tidak berfungsi. Bagaimana cara menyampaikan masalah itu kepada petugas hotel?",
    options: [
      { label: "<ruby>朝食<rt>ちょうしょく</rt></ruby>は<ruby>何時<rt>なんじ</rt></ruby>からですか。", correct: false, feedback: "Kalimat ini menanyakan waktu mulai sarapan." },
      { label: "エアコンが<ruby>動<rt>うご</rt></ruby>きません。", correct: true, feedback: "Tepat. Kalimat ini menyampaikan bahwa AC tidak berfungsi." },
      { label: "チェックアウトをお<ruby>願<rt>ねが</rt></ruby>いします。", correct: false, feedback: "Kalimat ini digunakan untuk meminta check-out." },
    ],
  },
  {
    question: "Kamu ingin meminta kuitansi setelah menyelesaikan pembayaran. Ungkapan mana yang tepat?",
    options: [
      { label: "<ruby>荷物<rt>にもつ</rt></ruby>を<ruby>預<rt>あず</rt></ruby>かっていただけますか。", correct: false, feedback: "Kalimat ini meminta petugas untuk menyimpan bagasi." },
      { label: "タオルをもう<ruby>一枚<rt>いちまい</rt></ruby>いただけますか。", correct: false, feedback: "Kalimat ini meminta satu handuk tambahan." },
      { label: "<ruby>領収書<rt>りょうしゅうしょ</rt></ruby>をいただけますか。", correct: true, feedback: "Benar. 領収書 berarti kuitansi atau bukti pembayaran." },
    ],
  },
];

const simulation = [
  {
    prompt: "Kamu baru tiba di hotel. Petugas menyambutmu dan bertanya:",
    japanese: "ご<ruby>予約<rt>よやく</rt></ruby>のお<ruby>名前<rt>なまえ</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。",
    romaji: "Goyoyaku no onamae o onegaishimasu.",
    translation: "Boleh tahu nama yang digunakan untuk reservasi?",
    task: "Jawab bahwa namamu Tanaka dan kamu sudah membuat reservasi.",
    options: [
      { label: "<ruby>田中<rt>たなか</rt></ruby>です。<ruby>予約<rt>よやく</rt></ruby>しています。", correct: true, feedback: "Tepat. Kamu memberikan nama dan mengonfirmasi reservasi." },
      { label: "<ruby>領収書<rt>りょうしゅうしょ</rt></ruby>をいただけますか。", correct: false, feedback: "Kalimat ini digunakan untuk meminta kuitansi." },
      { label: "エアコンが<ruby>動<rt>うご</rt></ruby>きません。", correct: false, feedback: "Kalimat ini melaporkan AC yang tidak berfungsi." },
    ],
  },
  {
    prompt: "Kamu berada di kamar dan AC tidak berfungsi. Petugas bertanya:",
    japanese: "どうされましたか。",
    romaji: "Dou saremashita ka.",
    translation: "Ada masalah apa?",
    task: "Jelaskan bahwa AC tidak berfungsi.",
    options: [
      { label: "エアコンが<ruby>動<rt>うご</rt></ruby>きません。", correct: true, feedback: "Benar. Kamu menjelaskan masalah pada AC." },
      { label: "<ruby>朝食<rt>ちょうしょく</rt></ruby>は<ruby>何時<rt>なんじ</rt></ruby>からですか。", correct: false, feedback: "Kalimat ini menanyakan waktu mulai sarapan." },
      { label: "お<ruby>世話<rt>せわ</rt></ruby>になりました。", correct: false, feedback: "Ungkapan ini merupakan ucapan terima kasih saat akan pergi." },
    ],
  },
  {
    prompt: "Kamu sudah selesai menginap dan akan meninggalkan hotel. Petugas bertanya:",
    japanese: "ほかにお<ruby>手伝<rt>てつだ</rt></ruby>いできることはありますか。",
    romaji: "Hoka ni otetsudai dekiru koto wa arimasu ka.",
    translation: "Apakah ada hal lain yang bisa kami bantu?",
    task: "Minta kuitansi untuk pembayaranmu.",
    options: [
      { label: "<ruby>領収書<rt>りょうしゅうしょ</rt></ruby>をいただけますか。", correct: true, feedback: "Tepat. Kamu meminta kuitansi setelah pembayaran." },
      { label: "<ruby>部屋<rt>へや</rt></ruby>に<ruby>冷蔵庫<rt>れいぞうこ</rt></ruby>はありますか。", correct: false, feedback: "Kalimat ini menanyakan apakah kamar memiliki kulkas." },
      { label: "タオルをもう<ruby>一枚<rt>いちまい</rt></ruby>いただけますか。", correct: false, feedback: "Kalimat ini meminta handuk tambahan." },
    ],
  },
];

export default function HotelAkomodasiPage() {
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
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">KATEGORI 09 · MATERI 1</p>
        <h1 className="mt-2 text-2xl font-bold text-[#EAE6DD] sm:text-3xl">Hotel dan Akomodasi</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A3A099]">
          Pelajari cara melakukan check-in, menanyakan fasilitas, meminta bantuan saat ada masalah di kamar,
          dan menyelesaikan check-out dengan ungkapan yang sopan.
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
          Setelah materi ini, kamu diharapkan bisa melakukan check-in dan check-out,
          menanyakan fasilitas hotel, meminta bantuan untuk masalah kamar, serta mengurus bagasi dan kuitansi.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Ungkapan penting</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Pelajari ungkapan yang bisa digunakan oleh tamu maupun petugas hotel.</p>
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
          <p className="mt-1 text-xs text-[#A3A099]">Dialog orisinal Fude tentang check-in, masalah kamar, dan check-out.</p>
        </div>
        {dialogues.map((dialogue) => (
          <Dialogue key={dialogue.title} {...dialogue} />
        ))}
      </section>

      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Kebiasaan dan tips saat menginap</h2>
        </div>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[#C5C0B7]">
          <li><span className="font-semibold text-[#EAE6DD]">Siapkan nama reservasi.</span> Saat check-in, petugas biasanya akan meminta nama pemesan. Jika reservasi dibuat oleh orang lain, sebutkan nama yang tercantum pada pemesanan.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Perhatikan jam layanan.</span> Jam sarapan dan check-out berbeda di setiap penginapan. Periksa informasi hotel atau tanyakan langsung kepada petugas.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Tanyakan layanan penitipan bagasi.</span> Sebagian hotel dapat menyimpan barang sebelum check-in atau setelah check-out, tetapi kebijakan dan waktunya berbeda-beda.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Laporkan masalah kamar kepada resepsionis.</span> Jelaskan fasilitas yang bermasalah dan nomor kamar. Petugas dapat membantu memeriksa atau menawarkan solusi sesuai kondisi hotel.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Simpan bukti pembayaran.</span> Jika memerlukan kuitansi, minta 領収書 saat pembayaran atau check-out. Pastikan nama dan informasi yang tercetak sudah sesuai kebutuhan.</li>
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
          Hadapi tiga situasi selama menginap. Pilih respons yang sesuai agar komunikasi dengan petugas hotel berjalan lancar.
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
