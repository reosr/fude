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
        <JapaneseReading
          html={phrase.note}
          showKana={false}
          showRomaji={false}
          showTranslation={false}
          contentClassName="mt-3 border-t border-[#33312E] pt-2 text-xs leading-relaxed text-[#A3A099]"
        />
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
            <span className="pt-1 text-[10px] font-bold text-[#D9B66D] sm:text-xs" dangerouslySetInnerHTML={{ __html: line.speaker }} />
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
    title: "A. Reservasi dan mendapatkan tempat duduk",
    description: "Ungkapan untuk memberi tahu reservasi, menyebutkan jumlah orang, dan mengikuti arahan pegawai.",
    items: [
      { jp: "<ruby>予約<rt>よやく</rt></ruby>しています。", romaji: "Yoyaku shite imasu.", id: "Saya sudah membuat reservasi.", tone: "Pelanggan · reservasi" },
      { jp: "<ruby>予約<rt>よやく</rt></ruby>していません。", romaji: "Yoyaku shite imasen.", id: "Saya tidak membuat reservasi.", tone: "Pelanggan · tanpa reservasi" },
      { jp: "<ruby>二人<rt>ふたり</rt></ruby>です。", romaji: "Futari desu.", id: "Dua orang.", tone: "Menyebutkan jumlah orang" },
      { jp: "<ruby>何名様<rt>なんめいさま</rt></ruby>ですか。", romaji: "Nanmei-sama desu ka.", id: "Untuk berapa orang?", tone: "Pegawai · menanyakan jumlah orang" },
      { jp: "こちらへどうぞ。", romaji: "Kochira e douzo.", id: "Silakan lewat sini.", tone: "Pegawai · mengarahkan tamu" },
    ],
  },
  {
    title: "B. Meminta menu dan rekomendasi",
    description: "Gunakan pertanyaan berikut saat ingin melihat menu, memilih hidangan, atau mengetahui isi makanan.",
    items: [
      { jp: "メニューをお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Menyuu o onegaishimasu.", id: "Tolong berikan menunya.", tone: "Meminta menu" },
      { jp: "おすすめは<ruby>何<rt>なん</rt></ruby>ですか。", romaji: "Osusume wa nan desu ka.", id: "Apa rekomendasinya?", tone: "Meminta rekomendasi" },
      { jp: "どれが<ruby>人気<rt>にんき</rt></ruby>ですか。", romaji: "Dore ga ninki desu ka.", id: "Yang mana yang populer?", tone: "Menanyakan menu populer" },
      { jp: "これは<ruby>何<rt>なに</rt></ruby>が<ruby>入<rt>はい</rt></ruby>っていますか。", romaji: "Kore wa nani ga haitte imasu ka.", id: "Apa saja yang ada di dalam makanan ini?", tone: "Menanyakan bahan makanan" },
      { jp: "もう<ruby>少<rt>すこ</rt></ruby>し<ruby>見<rt>み</rt></ruby>てもいいですか。", romaji: "Mou sukoshi mite mo ii desu ka.", id: "Bolehkah saya melihat-lihat sebentar lagi?", tone: "Meminta waktu memilih" },
    ],
  },
  {
    title: "C. Memesan dan meminta penyesuaian",
    description: "Pilih ungkapan yang jelas dan sopan saat menyampaikan pesanan atau permintaan khusus.",
    items: [
      { jp: "ご<ruby>注文<rt>ちゅうもん</rt></ruby>はお<ruby>決<rt>き</rt></ruby>まりですか。", romaji: "Gochuumon wa okimari desu ka.", id: "Apakah Anda sudah menentukan pesanan?", tone: "Pegawai · menanyakan pesanan" },
      { jp: "これを<ruby>一<rt>ひと</rt></ruby>つお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Kore o hitotsu onegaishimasu.", id: "Saya pesan satu yang ini.", tone: "Memesan makanan" },
      { jp: "じゃあ、それにします。", romaji: "Jaa, sore ni shimasu.", id: "Kalau begitu, saya pilih itu.", tone: "Menentukan pilihan" },
      { jp: "お<ruby>水<rt>みず</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Omizu o onegaishimasu.", id: "Tolong air putihnya.", tone: "Meminta minum" },
      { jp: "ご<ruby>飯<rt>はん</rt></ruby>を<ruby>少<rt>すく</rt></ruby>なめにできますか。", romaji: "Gohan o sukuname ni dekimasu ka.", id: "Bisakah porsi nasinya dikurangi?", tone: "Meminta porsi lebih sedikit" },
      { jp: "<ruby>辛<rt>から</rt></ruby>くしないでください。", romaji: "Karaku shinaide kudasai.", id: "Tolong jangan dibuat pedas.", tone: "Meminta makanan tidak pedas" },
      { jp: "お<ruby>持<rt>も</rt></ruby>ち<ruby>帰<rt>かえ</rt></ruby>りできますか。", romaji: "Omochikaeri dekimasu ka.", id: "Apakah bisa dibawa pulang?", tone: "Menanyakan layanan bungkus" },
    ],
  },
  {
    title: "D. Membayar dan mengakhiri makan",
    description: "Ungkapan untuk meminta tagihan, memilih cara pembayaran, dan mengucapkan terima kasih setelah makan.",
    items: [
      { jp: "お<ruby>会計<rt>かいけい</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Okaikei o onegaishimasu.", id: "Minta tagihannya, ya.", tone: "Meminta tagihan" },
      { jp: "カードは<ruby>使<rt>つか</rt></ruby>えますか。", romaji: "Kaado wa tsukaemasu ka.", id: "Apakah bisa membayar dengan kartu?", tone: "Menanyakan metode pembayaran" },
      { jp: "カードでお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Kaado de onegaishimasu.", id: "Dengan kartu, ya.", tone: "Pembayaran" },
      { jp: "<ruby>別々<rt>べつべつ</rt></ruby>に<ruby>払<rt>はら</rt></ruby>えますか。", romaji: "Betsubetsu ni haraemasu ka.", id: "Bisakah kami membayar secara terpisah?", tone: "Meminta pembayaran terpisah" },
      { jp: "ごちそうさまでした。", romaji: "Gochisousama deshita.", id: "Terima kasih atas makanannya.", tone: "Setelah selesai makan", note: "Ungkapan ini lazim diucapkan setelah makan sebagai bentuk penghargaan atas hidangan." },
    ],
  },
];

const dialogues: { title: string; context: string; lines: DialogueLine[] }[] = [
  {
    title: "Percakapan 1 · Datang ke restoran",
    context: "Kamu datang bersama satu teman dan sudah membuat reservasi.",
    lines: [
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "いらっしゃいませ。<ruby>何名様<rt>なんめいさま</rt></ruby>ですか。", romaji: "Irasshaimase. Nanmei-sama desu ka.", id: "Selamat datang. Untuk berapa orang?" },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "<ruby>二人<rt>ふたり</rt></ruby>です。<ruby>予約<rt>よやく</rt></ruby>しています。", romaji: "Futari desu. Yoyaku shite imasu.", id: "Dua orang. Kami sudah membuat reservasi." },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "お<ruby>名前<rt>なまえ</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>してもよろしいですか。", romaji: "Onamae o kakunin shite mo yoroshii desu ka.", id: "Boleh saya memastikan nama reservasinya?" },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "タナカです。", romaji: "Tanaka desu.", id: "Atas nama Tanaka." },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "ありがとうございます。こちらへどうぞ。", romaji: "Arigatou gozaimasu. Kochira e douzo.", id: "Terima kasih. Silakan lewat sini." },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "ありがとうございます。", romaji: "Arigatou gozaimasu.", id: "Terima kasih." },
    ],
  },
  {
    title: "Percakapan 2 · Memesan makanan",
    context: "Setelah duduk dan membaca menu, kamu meminta rekomendasi sebelum memesan.",
    lines: [
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "ご<ruby>注文<rt>ちゅうもん</rt></ruby>はお<ruby>決<rt>き</rt></ruby>まりですか。", romaji: "Gochuumon wa okimari desu ka.", id: "Apakah Anda sudah menentukan pesanan?" },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "おすすめは<ruby>何<rt>なん</rt></ruby>ですか。", romaji: "Osusume wa nan desu ka.", id: "Apa rekomendasinya?" },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "こちらの<ruby>魚<rt>さかな</rt></ruby>の<ruby>定食<rt>ていしょく</rt></ruby>が<ruby>人気<rt>にんき</rt></ruby>です。", romaji: "Kochira no sakana no teishoku ga ninki desu.", id: "Paket nasi dengan lauk ikan ini populer." },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "じゃあ、それを<ruby>一<rt>ひと</rt></ruby>つお<ruby>願<rt>ねが</rt></ruby>いします。お<ruby>水<rt>みず</rt></ruby>もお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Jaa, sore o hitotsu onegaishimasu. Omizu mo onegaishimasu.", id: "Kalau begitu, saya pesan satu yang itu. Air putih juga, ya." },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "かしこまりました。<ruby>少々<rt>しょうしょう</rt></ruby>お<ruby>待<rt>ま</rt></ruby>ちください。", romaji: "Kashikomarimashita. Shoushou omachi kudasai.", id: "Baik. Mohon tunggu sebentar." },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "はい。", romaji: "Hai.", id: "Baik." },
    ],
  },
  {
    title: "Percakapan 3 · Membayar setelah makan",
    context: "Kamu sudah selesai makan dan ingin membayar menggunakan kartu.",
    lines: [
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "すみません、お<ruby>会計<rt>かいけい</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Sumimasen, okaikei o onegaishimasu.", id: "Permisi, tolong tagihannya." },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "<ruby>合計<rt>ごうけい</rt></ruby>は<ruby>千八百円<rt>せんはっぴゃくえん</rt></ruby>です。", romaji: "Goukei wa sen happyaku en desu.", id: "Totalnya 1.800 yen." },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "お<ruby>支払<rt>しはら</rt></ruby>いはカードですか、<ruby>現金<rt>げんきん</rt></ruby>ですか。", romaji: "Oshiharai wa kaado desu ka, genkin desu ka.", id: "Pembayarannya dengan kartu atau uang tunai?" },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "カードでお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Kaado de onegaishimasu.", id: "Dengan kartu, ya." },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "かしこまりました。ありがとうございます。", romaji: "Kashikomarimashita. Arigatou gozaimasu.", id: "Baik. Terima kasih." },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "ごちそうさまでした。", romaji: "Gochisousama deshita.", id: "Terima kasih atas makanannya." },
    ],
  },
];

const vocabulary = [
  { word: "<ruby>予約<rt>よやく</rt></ruby>", reading: "よやく", romaji: "yoyaku", meaning: "Reservasi / pemesanan" },
  { word: "<ruby>注文<rt>ちゅうもん</rt></ruby>", reading: "ちゅうもん", romaji: "chuumon", meaning: "Pesanan / memesan" },
  { word: "<ruby>料理<rt>りょうり</rt></ruby>", reading: "りょうり", romaji: "ryouri", meaning: "Masakan / hidangan" },
  { word: "おすすめ", reading: "おすすめ", romaji: "osusume", meaning: "Rekomendasi" },
  { word: "<ruby>定食<rt>ていしょく</rt></ruby>", reading: "ていしょく", romaji: "teishoku", meaning: "Paket makanan" },
  { word: "<ruby>会計<rt>かいけい</rt></ruby>", reading: "かいけい", romaji: "kaikei", meaning: "Tagihan / pembayaran" },
  { word: "<ruby>持<rt>も</rt></ruby>ち<ruby>帰<rt>かえ</rt></ruby>り", reading: "もちかえり", romaji: "mochikaeri", meaning: "Dibawa pulang / takeout" },
  { word: "<ruby>辛<rt>から</rt></ruby>い", reading: "からい", romaji: "karai", meaning: "Pedas" },
];

const quiz = [
  {
    question: "Pegawai restoran bertanya 「<ruby>何名様<rt>なんめいさま</rt></ruby>ですか。」 Kamu datang berdua. Apa jawaban yang tepat?",
    options: [
      { label: "<ruby>二人<rt>ふたり</rt></ruby>です。", correct: true, feedback: "Benar. <ruby>二人<rt>ふたり</rt></ruby>です digunakan untuk menyebutkan dua orang." },
      { label: "<ruby>二階<rt>にかい</rt></ruby>です。", correct: false, feedback: "<ruby>二階<rt>にかい</rt></ruby>です berarti berada di lantai dua." },
      { label: "<ruby>二<rt>ふた</rt></ruby>つください。", correct: false, feedback: "<ruby>二<rt>ふた</rt></ruby>つください berarti meminta dua buah barang." },
    ],
  },
  {
    question: "Kamu ingin mengetahui bahan yang ada di dalam suatu hidangan. Apa yang sebaiknya ditanyakan?",
    options: [
      { label: "お<ruby>会計<rt>かいけい</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", correct: false, feedback: "Ungkapan ini digunakan untuk meminta tagihan." },
      { label: "これは<ruby>何<rt>なに</rt></ruby>が<ruby>入<rt>はい</rt></ruby>っていますか。", correct: true, feedback: "Kalimat ini menanyakan bahan atau isi makanan." },
      { label: "カードは<ruby>使<rt>つか</rt></ruby>えますか。", correct: false, feedback: "Kalimat ini menanyakan apakah kartu bisa digunakan untuk membayar." },
    ],
  },
  {
    question: "Kamu sudah selesai makan dan ingin meminta tagihan. Pilih ungkapan yang sesuai.",
    options: [
      { label: "メニューをお<ruby>願<rt>ねが</rt></ruby>いします。", correct: false, feedback: "Kalimat ini digunakan untuk meminta menu." },
      { label: "おすすめは<ruby>何<rt>なん</rt></ruby>ですか。", correct: false, feedback: "Kalimat ini meminta rekomendasi makanan." },
      { label: "お<ruby>会計<rt>かいけい</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", correct: true, feedback: "Benar. お<ruby>会計<rt>かいけい</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします digunakan untuk meminta tagihan." },
    ],
  },
];

const simulation = [
  {
    prompt: "Kamu datang ke restoran bersama satu teman. Pegawai bertanya:",
    japanese: "<ruby>何名様<rt>なんめいさま</rt></ruby>ですか。",
    romaji: "Nanmei-sama desu ka.",
    translation: "Untuk berapa orang?",
    task: "Jawab bahwa kalian datang berdua.",
    options: [
      { label: "<ruby>二人<rt>ふたり</rt></ruby>です。", correct: true, feedback: "Tepat. <ruby>二人<rt>ふたり</rt></ruby>です berarti dua orang." },
      { label: "<ruby>予約<rt>よやく</rt></ruby>しています。", correct: false, feedback: "Kalimat ini berarti sudah membuat reservasi." },
      { label: "<ruby>一人<rt>ひとり</rt></ruby>です。", correct: false, feedback: "<ruby>一人<rt>ひとり</rt></ruby>です berarti satu orang." },
    ],
  },
  {
    prompt: "Kamu sudah membaca menu, tetapi masih ingin meminta saran. Pegawai bertanya:",
    japanese: "ご<ruby>注文<rt>ちゅうもん</rt></ruby>はお<ruby>決<rt>き</rt></ruby>まりですか。",
    romaji: "Gochuumon wa okimari desu ka.",
    translation: "Apakah Anda sudah menentukan pesanan?",
    task: "Tanyakan apa rekomendasi restoran.",
    options: [
      { label: "お<ruby>会計<rt>かいけい</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", correct: false, feedback: "Kalimat ini meminta tagihan, biasanya setelah selesai makan." },
      { label: "おすすめは<ruby>何<rt>なん</rt></ruby>ですか。", correct: true, feedback: "Benar. Kamu meminta rekomendasi sebelum menentukan pesanan." },
      { label: "<ruby>予約<rt>よやく</rt></ruby>しています。", correct: false, feedback: "Kalimat ini menyampaikan bahwa kamu sudah memiliki reservasi." },
    ],
  },
  {
    prompt: "Makanan sudah selesai dan pegawai menanyakan metode pembayaran:",
    japanese: "お<ruby>支払<rt>しはら</rt></ruby>いはカードですか、<ruby>現金<rt>げんきん</rt></ruby>ですか。",
    romaji: "Oshiharai wa kaado desu ka, genkin desu ka.",
    translation: "Pembayarannya dengan kartu atau uang tunai?",
    task: "Pilih jawaban bahwa kamu akan membayar dengan kartu.",
    options: [
      { label: "カードでお<ruby>願<rt>ねが</rt></ruby>いします。", correct: true, feedback: "Tepat. Kamu memilih pembayaran menggunakan kartu." },
      { label: "ごちそうさまでした。", correct: false, feedback: "Ungkapan ini diucapkan setelah selesai makan, bukan untuk memilih metode pembayaran." },
      { label: "メニューをお<ruby>願<rt>ねが</rt></ruby>いします。", correct: false, feedback: "Kalimat ini digunakan untuk meminta menu." },
    ],
  },
];

export default function RestoranMakananPage() {
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
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">KATEGORI 03 · MATERI 1</p>
        <h1 className="mt-2 text-2xl font-bold text-[#EAE6DD] sm:text-3xl">Restoran dan Makanan</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A3A099]">
          Pelajari cara membuat reservasi, mendapatkan tempat duduk, meminta rekomendasi,
          memesan hidangan, menyampaikan permintaan sederhana, dan membayar di restoran Jepang.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold">
          <span className="rounded-full border border-[#269B70]/30 bg-[#269B70]/10 px-3 py-1 text-[#66C49C]">Dasar · A1</span>
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
          Setelah materi ini, kamu diharapkan bisa menyampaikan jumlah orang dan reservasi,
          memahami pertanyaan pegawai, meminta rekomendasi, memesan makanan, serta menyelesaikan pembayaran.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Ungkapan penting</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Pelajari ungkapan dari sisi pelanggan maupun pegawai restoran.</p>
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
          <p className="mt-1 text-xs text-[#A3A099]">Tiga situasi: datang ke restoran, memesan hidangan, dan membayar setelah makan.</p>
        </div>
        {dialogues.map((dialogue) => (
          <Dialogue key={dialogue.title} {...dialogue} />
        ))}
      </section>

      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Etika dan kebiasaan di restoran</h2>
        </div>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[#C5C0B7]">
          <li><span className="font-semibold text-[#EAE6DD]">Tunggu arahan tempat duduk.</span> Di banyak restoran, pegawai akan mengarahkan tamu ke meja. Sampaikan jumlah orang terlebih dahulu dan ikuti petunjuknya.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Panggil pegawai dengan sopan.</span> Jika perlu bantuan, すみません adalah cara yang wajar untuk menarik perhatian pegawai.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Periksa isi makanan.</span> Gunakan これは<ruby>何<rt>なに</rt></ruby>が<ruby>入<rt>はい</rt></ruby>っていますか untuk menanyakan bahan. Jika memiliki alergi atau pantangan, jelaskan dengan spesifik dan pastikan kembali kepada pegawai; jangan berasumsi semua permintaan bisa dipenuhi.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Permintaan penyesuaian bergantung restoran.</span> Restoran mungkin bisa mengurangi porsi atau menyesuaikan tingkat pedas, tetapi tidak semua tempat menyediakan pilihan tersebut.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Ucapkan ごちそうさまでした.</span> Ungkapan ini lazim diucapkan setelah selesai makan sebagai bentuk penghargaan atas hidangan.</li>
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
              <div className="text-sm font-semibold leading-relaxed text-[#EAE6DD]">
                  {questionIndex + 1}. <JapaneseReading html={item.question} showKana={false} showRomaji={false} showTranslation={false} contentClassName="text-sm font-semibold leading-relaxed text-[#EAE6DD]" />
                </div>
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
                <JapaneseReading
                  html={item.options[selected].feedback}
                  showKana={false}
                  showRomaji={false}
                  showTranslation={false}
                  contentClassName={"mt-3 text-xs leading-relaxed " + (item.options[selected].correct ? "text-[#8ED8B4]" : "text-[#F08B8E]")}
                />
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
          Hadapi tiga situasi di restoran. Pilih respons yang sesuai agar percakapan berjalan wajar.
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
