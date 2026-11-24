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
    title: "A. Membeli tiket dan menggunakan kartu IC",
    description: "Ungkapan untuk membeli tiket, memilih perjalanan satu arah atau pulang-pergi, serta menggunakan kartu transportasi.",
    items: [
      { jp: "<ruby>京都<rt>きょうと</rt></ruby>までの<ruby>切符<rt>きっぷ</rt></ruby>を<ruby>一枚<rt>いちまい</rt></ruby>お願いします。", romaji: "Kyouto made no kippu o ichimai onegaishimasu.", id: "Tolong satu tiket sampai Kyoto.", tone: "Membeli tiket" },
      { jp: "<ruby>片道<rt>かたみち</rt></ruby>でお願いします。", romaji: "Katamichi de onegaishimasu.", id: "Untuk sekali jalan, ya.", tone: "Tiket satu arah" },
      { jp: "<ruby>往復<rt>おうふく</rt></ruby>でお願いします。", romaji: "Oufuku de onegaishimasu.", id: "Untuk pulang-pergi, ya.", tone: "Tiket pulang-pergi" },
      { jp: "<ruby>交通系<rt>こうつうけい</rt></ruby>ICカードは<ruby>使<rt>つか</rt></ruby>えますか。", romaji: "Koutsuukei ai shii kaado wa tsukaemasu ka.", id: "Apakah kartu IC transportasi bisa digunakan?", tone: "Menanyakan pembayaran" },
      { jp: "チャージをお願いします。", romaji: "Chaaji o onegaishimasu.", id: "Tolong isi saldo kartu saya.", tone: "Mengisi saldo kartu", note: "チャージ berarti menambahkan saldo ke kartu transportasi atau kartu prabayar." },
    ],
  },
  {
    title: "B. Mencari peron dan berpindah kereta",
    description: "Gunakan ungkapan ini untuk memastikan jalur, arah kereta, dan stasiun tempat harus berganti kereta.",
    items: [
      { jp: "<ruby>改札口<rt>かいさつぐち</rt></ruby>はどこですか。", romaji: "Kaisatsuguchi wa doko desu ka.", id: "Pintu pemeriksaan tiket ada di mana?", tone: "Mencari gerbang tiket" },
      { jp: "<ruby>何番線<rt>なんばんせん</rt></ruby>から<ruby>出<rt>で</rt></ruby>ますか。", romaji: "Nanbansen kara demasu ka.", id: "Berangkat dari peron nomor berapa?", tone: "Menanyakan peron" },
      { jp: "この<ruby>電車<rt>でんしゃ</rt></ruby>は<ruby>新宿<rt>しんじゅく</rt></ruby>に<ruby>行<rt>い</rt></ruby>きますか。", romaji: "Kono densha wa Shinjuku ni ikimasu ka.", id: "Apakah kereta ini menuju Shinjuku?", tone: "Memastikan arah kereta" },
      { jp: "どこで<ruby>乗<rt>の</rt></ruby>り<ruby>換<rt>か</rt></ruby>えればいいですか。", romaji: "Doko de norikaereba ii desu ka.", id: "Di mana saya harus pindah kereta?", tone: "Menanyakan tempat transit" },
      { jp: "<ruby>次<rt>つぎ</rt></ruby>の<ruby>駅<rt>えき</rt></ruby>で<ruby>乗<rt>の</rt></ruby>り<ruby>換<rt>か</rt></ruby>えます。", romaji: "Tsugi no eki de norikaemasu.", id: "Saya akan pindah kereta di stasiun berikutnya.", tone: "Menjelaskan rencana transit" },
      { jp: "ここで<ruby>降<rt>お</rt></ruby>りればいいですか。", romaji: "Koko de orireba ii desu ka.", id: "Apakah saya harus turun di sini?", tone: "Memastikan stasiun tujuan" },
    ],
  },
  {
    title: "C. Naik bus dan mencari halte",
    description: "Ungkapan untuk memastikan rute bus, waktu kedatangan, dan cara membayar ongkos.",
    items: [
      { jp: "バス<ruby>停<rt>てい</rt></ruby>はどこですか。", romaji: "Basutei wa doko desu ka.", id: "Halte bus ada di mana?", tone: "Mencari halte" },
      { jp: "このバスは<ruby>市役所<rt>しやくしょ</rt></ruby>に<ruby>行<rt>い</rt></ruby>きますか。", romaji: "Kono basu wa shiyakusho ni ikimasu ka.", id: "Apakah bus ini menuju kantor balai kota?", tone: "Memastikan rute bus" },
      { jp: "<ruby>次<rt>つぎ</rt></ruby>のバスは<ruby>何時<rt>なんじ</rt></ruby>ですか。", romaji: "Tsugi no basu wa nanji desu ka.", id: "Bus berikutnya pukul berapa?", tone: "Menanyakan jadwal bus" },
      { jp: "<ruby>次<rt>つぎ</rt></ruby>で<ruby>降<rt>お</rt></ruby>ります。", romaji: "Tsugi de orimasu.", id: "Saya turun di halte berikutnya.", tone: "Memberi tahu akan turun" },
      { jp: "先に<ruby>運賃<rt>うんちん</rt></ruby>を<ruby>払<rt>はら</rt></ruby>いますか。", romaji: "Saki ni unchin o haraimasu ka.", id: "Apakah ongkos dibayar terlebih dahulu?", tone: "Menanyakan cara pembayaran" },
    ],
  },
  {
    title: "D. Jadwal, keterlambatan, dan bantuan",
    description: "Ungkapan untuk menanyakan waktu perjalanan dan meminta bantuan saat mengalami kendala.",
    items: [
      { jp: "<ruby>何時<rt>なんじ</rt></ruby>に<ruby>出発<rt>しゅっぱつ</rt></ruby>しますか。", romaji: "Nanji ni shuppatsu shimasu ka.", id: "Berangkat pukul berapa?", tone: "Menanyakan waktu keberangkatan" },
      { jp: "<ruby>何時<rt>なんじ</rt></ruby>に<ruby>着<rt>つ</rt></ruby>きますか。", romaji: "Nanji ni tsukimasu ka.", id: "Tiba pukul berapa?", tone: "Menanyakan waktu tiba" },
      { jp: "<ruby>電車<rt>でんしゃ</rt></ruby>が<ruby>遅<rt>おく</rt></ruby>れています。", romaji: "Densha ga okurete imasu.", id: "Kereta sedang mengalami keterlambatan.", tone: "Memberi tahu keterlambatan" },
      { jp: "<ruby>乗<rt>の</rt></ruby>り<ruby>遅<rt>おく</rt></ruby>れました。", romaji: "Noriokuremashita.", id: "Saya ketinggalan kereta atau kendaraan.", tone: "Ketinggalan kendaraan" },
      { jp: "<ruby>忘<rt>わす</rt></ruby>れ<ruby>物<rt>もの</rt></ruby>をしました。", romaji: "Wasuremono o shimashita.", id: "Saya tertinggal barang.", tone: "Melaporkan barang tertinggal" },
      { jp: "<ruby>駅員<rt>えきいん</rt></ruby>さんを<ruby>呼<rt>よ</rt></ruby>んでもらえますか。", romaji: "Ekiin-san o yonde moraemasu ka.", id: "Bisakah Anda memanggil petugas stasiun?", tone: "Meminta bantuan" },
    ],
  },
];

const dialogues: { title: string; context: string; lines: DialogueLine[] }[] = [
  {
    title: "Percakapan 1 · Membeli tiket di loket",
    context: "Kamu ingin membeli tiket sekali jalan menuju Kyoto.",
    lines: [
      { speaker: "駅員", jp: "どちらまでですか。", romaji: "Dochira made desu ka.", id: "Mau pergi sampai mana?" },
      { speaker: "客", jp: "<ruby>京都<rt>きょうと</rt></ruby>までの<ruby>切符<rt>きっぷ</rt></ruby>を<ruby>一枚<rt>いちまい</rt></ruby>お願いします。", romaji: "Kyouto made no kippu o ichimai onegaishimasu.", id: "Tolong satu tiket sampai Kyoto." },
      { speaker: "駅員", jp: "<ruby>片道<rt>かたみち</rt></ruby>ですか、<ruby>往復<rt>おうふく</rt></ruby>ですか。", romaji: "Katamichi desu ka, oufuku desu ka.", id: "Sekali jalan atau pulang-pergi?" },
      { speaker: "客", jp: "<ruby>片道<rt>かたみち</rt></ruby>でお願いします。", romaji: "Katamichi de onegaishimasu.", id: "Sekali jalan, ya." },
      { speaker: "駅員", jp: "かしこまりました。こちらが<ruby>切符<rt>きっぷ</rt></ruby>です。", romaji: "Kashikomarimashita. Kochira ga kippu desu.", id: "Baik. Ini tiketnya." },
      { speaker: "客", jp: "ありがとうございます。", romaji: "Arigatou gozaimasu.", id: "Terima kasih." },
    ],
  },
  {
    title: "Percakapan 2 · Memastikan arah dan tempat transit",
    context: "Kamu berada di stasiun dan ingin memastikan kereta yang harus dinaiki.",
    lines: [
      { speaker: "客", jp: "すみません、この<ruby>電車<rt>でんしゃ</rt></ruby>は<ruby>新宿<rt>しんじゅく</rt></ruby>に<ruby>行<rt>い</rt></ruby>きますか。", romaji: "Sumimasen, kono densha wa Shinjuku ni ikimasu ka.", id: "Permisi, apakah kereta ini menuju Shinjuku?" },
      { speaker: "駅員", jp: "はい、<ruby>行<rt>い</rt></ruby>きます。<ruby>三番線<rt>さんばんせん</rt></ruby>から<ruby>出<rt>で</rt></ruby>ます。", romaji: "Hai, ikimasu. Sanbansen kara demasu.", id: "Ya, menuju ke sana. Kereta berangkat dari peron nomor tiga." },
      { speaker: "客", jp: "どこで<ruby>乗<rt>の</rt></ruby>り<ruby>換<rt>か</rt></ruby>えればいいですか。", romaji: "Doko de norikaereba ii desu ka.", id: "Di mana saya harus pindah kereta?" },
      { speaker: "駅員", jp: "<ruby>次<rt>つぎ</rt></ruby>の<ruby>駅<rt>えき</rt></ruby>で<ruby>乗<rt>の</rt></ruby>り<ruby>換<rt>か</rt></ruby>えてください。", romaji: "Tsugi no eki de norikaete kudasai.", id: "Silakan pindah kereta di stasiun berikutnya." },
      { speaker: "客", jp: "わかりました。ありがとうございます。", romaji: "Wakarimashita. Arigatou gozaimasu.", id: "Baik, saya mengerti. Terima kasih." },
    ],
  },
  {
    title: "Percakapan 3 · Memastikan rute dan pembayaran bus",
    context: "Kamu ingin naik bus menuju kantor balai kota dan memastikan cara membayar ongkos.",
    lines: [
      { speaker: "客", jp: "すみません、このバスは<ruby>市役所<rt>しやくしょ</rt></ruby>に<ruby>行<rt>い</rt></ruby>きますか。", romaji: "Sumimasen, kono basu wa shiyakusho ni ikimasu ka.", id: "Permisi, apakah bus ini menuju kantor balai kota?" },
      { speaker: "運転手", jp: "はい、<ruby>行<rt>い</rt></ruby>きます。<ruby>運賃<rt>うんちん</rt></ruby>は<ruby>先<rt>さき</rt></ruby><ruby>払<rt>ばら</rt></ruby>いです。", romaji: "Hai, ikimasu. Unchin wa sakibarai desu.", id: "Ya, menuju ke sana. Ongkos dibayar di muka." },
      { speaker: "客", jp: "<ruby>交通系<rt>こうつうけい</rt></ruby>ICカードは<ruby>使<rt>つか</rt></ruby>えますか。", romaji: "Koutsuukei ai shii kaado wa tsukaemasu ka.", id: "Apakah kartu IC transportasi bisa digunakan?" },
      { speaker: "運転手", jp: "はい、<ruby>使<rt>つか</rt></ruby>えます。<ruby>乗<rt>の</rt></ruby>るときにタッチしてください。", romaji: "Hai, tsukaemasu. Noru toki ni tacchi shite kudasai.", id: "Ya, bisa. Silakan tempelkan kartu saat naik." },
      { speaker: "客", jp: "わかりました。ありがとうございます。", romaji: "Wakarimashita. Arigatou gozaimasu.", id: "Baik, saya mengerti. Terima kasih." },
    ],
  },
];

const vocabulary = [
  { word: "<ruby>切符<rt>きっぷ</rt></ruby>", reading: "きっぷ", romaji: "kippu", meaning: "Tiket" },
  { word: "<ruby>乗<rt>の</rt></ruby>り<ruby>換<rt>か</rt></ruby>え", reading: "のりかえ", romaji: "norikae", meaning: "Pindah kendaraan / transit" },
  { word: "<ruby>改札口<rt>かいさつぐち</rt></ruby>", reading: "かいさつぐち", romaji: "kaisatsuguchi", meaning: "Gerbang pemeriksaan tiket" },
  { word: "<ruby>番線<rt>ばんせん</rt></ruby>", reading: "ばんせん", romaji: "bansen", meaning: "Nomor jalur / peron" },
  { word: "<ruby>運賃<rt>うんちん</rt></ruby>", reading: "うんちん", romaji: "unchin", meaning: "Ongkos / tarif perjalanan" },
  { word: "<ruby>出発<rt>しゅっぱつ</rt></ruby>", reading: "しゅっぱつ", romaji: "shuppatsu", meaning: "Keberangkatan" },
  { word: "<ruby>到着<rt>とうちゃく</rt></ruby>", reading: "とうちゃく", romaji: "touchaku", meaning: "Kedatangan" },
  { word: "<ruby>遅延<rt>ちえん</rt></ruby>", reading: "ちえん", romaji: "chien", meaning: "Keterlambatan" },
];

const quiz = [
  {
    question: "Kamu ingin membeli tiket sekali jalan menuju Kyoto. Apa yang sebaiknya kamu katakan?",
    options: [
      { label: "<ruby>片道<rt>かたみち</rt></ruby>でお願いします。", correct: true, feedback: "Benar. 片道 berarti perjalanan satu arah atau sekali jalan." },
      { label: "<ruby>往復<rt>おうふく</rt></ruby>でお願いします。", correct: false, feedback: "往復 berarti perjalanan pulang-pergi." },
      { label: "<ruby>次<rt>つぎ</rt></ruby>で<ruby>降<rt>お</rt></ruby>ります。", correct: false, feedback: "Kalimat ini berarti akan turun di pemberhentian berikutnya." },
    ],
  },
  {
    question: "Kamu tidak tahu di stasiun mana harus berganti kereta. Pertanyaan mana yang tepat?",
    options: [
      { label: "<ruby>何時<rt>なんじ</rt></ruby>に<ruby>着<rt>つ</rt></ruby>きますか。", correct: false, feedback: "Kalimat ini menanyakan pukul berapa kendaraan tiba." },
      { label: "どこで<ruby>乗<rt>の</rt></ruby>り<ruby>換<rt>か</rt></ruby>えればいいですか。", correct: true, feedback: "Tepat. Ungkapan ini menanyakan di mana harus melakukan transit." },
      { label: "<ruby>切符<rt>きっぷ</rt></ruby>を<ruby>一枚<rt>いちまい</rt></ruby>お願いします。", correct: false, feedback: "Kalimat ini digunakan untuk meminta satu tiket." },
    ],
  },
  {
    question: "Kamu ingin memastikan apakah kartu IC transportasi dapat digunakan. Apa yang kamu tanyakan?",
    options: [
      { label: "<ruby>運賃<rt>うんちん</rt></ruby>は先<ruby>払<rt>ばら</rt></ruby>いですか。", correct: false, feedback: "Kalimat ini menanyakan apakah ongkos dibayar terlebih dahulu." },
      { label: "<ruby>次<rt>つぎ</rt></ruby>のバスは<ruby>何時<rt>なんじ</rt></ruby>ですか。", correct: false, feedback: "Kalimat ini menanyakan jadwal bus berikutnya." },
      { label: "<ruby>交通系<rt>こうつうけい</rt></ruby>ICカードは<ruby>使<rt>つか</rt></ruby>えますか。", correct: true, feedback: "Benar. Ini menanyakan apakah kartu IC transportasi diterima." },
    ],
  },
];

const simulation = [
  {
    prompt: "Kamu berada di loket tiket. Petugas bertanya:",
    japanese: "どちらまでですか。",
    romaji: "Dochira made desu ka.",
    translation: "Mau pergi sampai mana?",
    task: "Katakan bahwa kamu ingin satu tiket sampai Kyoto.",
    options: [
      { label: "<ruby>京都<rt>きょうと</rt></ruby>までの<ruby>切符<rt>きっぷ</rt></ruby>を<ruby>一枚<rt>いちまい</rt></ruby>お願いします。", correct: true, feedback: "Tepat. Kamu menyebutkan tujuan dan jumlah tiket yang dibutuhkan." },
      { label: "<ruby>京都<rt>きょうと</rt></ruby>で<ruby>降<rt>お</rt></ruby>ります。", correct: false, feedback: "Kalimat ini berarti kamu turun di Kyoto, bukan meminta tiket." },
      { label: "<ruby>次<rt>つぎ</rt></ruby>のバスは<ruby>何時<rt>なんじ</rt></ruby>ですか。", correct: false, feedback: "Kalimat ini menanyakan jadwal bus berikutnya." },
    ],
  },
  {
    prompt: "Kamu sedang berada di stasiun dan ingin memastikan kereta yang akan dinaiki. Petugas bertanya:",
    japanese: "何かお困りですか。",
    romaji: "Nanika okomari desu ka.",
    translation: "Apakah ada yang bisa dibantu?",
    task: "Tanyakan apakah kereta ini menuju Shinjuku.",
    options: [
      { label: "<ruby>新宿<rt>しんじゅく</rt></ruby>までの<ruby>切符<rt>きっぷ</rt></ruby>をお願いします。", correct: false, feedback: "Kalimat ini meminta tiket menuju Shinjuku." },
      { label: "この<ruby>電車<rt>でんしゃ</rt></ruby>は<ruby>新宿<rt>しんじゅく</rt></ruby>に<ruby>行<rt>い</rt></ruby>きますか。", correct: true, feedback: "Benar. Kamu memastikan tujuan kereta sebelum naik." },
      { label: "<ruby>次<rt>つぎ</rt></ruby>で<ruby>降<rt>お</rt></ruby>ります。", correct: false, feedback: "Kalimat ini berarti kamu akan turun di pemberhentian berikutnya." },
    ],
  },
  {
    prompt: "Kamu akan naik bus. Sopir memberi tahu:",
    japanese: "<ruby>運賃<rt>うんちん</rt></ruby>は<ruby>先<rt>さき</rt></ruby><ruby>払<rt>ばら</rt></ruby>いです。",
    romaji: "Unchin wa sakibarai desu.",
    translation: "Ongkos dibayar di muka.",
    task: "Tanyakan apakah kartu IC transportasi bisa digunakan.",
    options: [
      { label: "<ruby>交通系<rt>こうつうけい</rt></ruby>ICカードは<ruby>使<rt>つか</rt></ruby>えますか。", correct: true, feedback: "Tepat. Kamu menanyakan apakah pembayaran dengan kartu IC dapat digunakan." },
      { label: "<ruby>何時<rt>なんじ</rt></ruby>に<ruby>着<rt>つ</rt></ruby>きますか。", correct: false, feedback: "Kalimat ini menanyakan waktu tiba." },
      { label: "<ruby>改札口<rt>かいさつぐち</rt></ruby>はどこですか。", correct: false, feedback: "Kalimat ini menanyakan lokasi gerbang tiket di stasiun." },
    ],
  },
];

export default function TransportasiPerjalananPage() {
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
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">KATEGORI 04 · MATERI 1</p>
        <h1 className="mt-2 text-2xl font-bold text-[#EAE6DD] sm:text-3xl">Transportasi dan Perjalanan</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A3A099]">
          Pelajari cara membeli tiket, mencari peron, berpindah kereta, menggunakan bus,
          memahami jadwal, dan meminta bantuan saat perjalanan.
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
          Setelah materi ini, kamu diharapkan bisa membeli tiket, memastikan arah dan peron,
          menanyakan tempat transit, memahami cara membayar bus, serta menjelaskan kendala perjalanan sederhana.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Ungkapan penting</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Pelajari ungkapan dari sisi penumpang maupun petugas transportasi.</p>
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
          <p className="mt-1 text-xs text-[#A3A099]">Tiga situasi: membeli tiket, memastikan arah kereta, dan naik bus.</p>
        </div>
        {dialogues.map((dialogue) => (
          <Dialogue key={dialogue.title} {...dialogue} />
        ))}
      </section>

      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Kebiasaan dan tips saat bepergian</h2>
        </div>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[#C5C0B7]">
          <li><span className="font-semibold text-[#EAE6DD]">Periksa tujuan dan arah kereta.</span> Pastikan nama tujuan, jalur, dan arah perjalanan sebelum naik. Kereta yang melewati jalur sama belum tentu menuju tujuan yang kamu inginkan.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Pahami nomor peron.</span> 番線 menunjukkan nomor jalur atau peron keberangkatan. Cocokkan informasi di papan petunjuk dengan tiket atau aplikasi perjalanan.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Kartu IC dan saldo.</span> Kartu transportasi prabayar dapat digunakan di banyak jaringan, tetapi tidak semua rute atau operator selalu menerima kartu yang sama. Pastikan saldo cukup sebelum melewati gerbang.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Cara naik bus dapat berbeda.</span> Ada bus yang meminta pembayaran saat naik dan ada yang dibayar saat turun. Perhatikan petunjuk di pintu, mesin, atau informasi dari pengemudi.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Saat terjadi keterlambatan.</span> Dengarkan pengumuman dan periksa informasi keberangkatan berikutnya. Jika bingung, mintalah bantuan petugas dengan すみません.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Barang tertinggal.</span> Segera hubungi petugas stasiun atau operator kendaraan dan jelaskan barang serta rute perjalanan sejelas mungkin.</li>
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
          Hadapi tiga situasi perjalanan. Pilih respons yang sesuai agar perjalananmu berjalan lancar.
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
