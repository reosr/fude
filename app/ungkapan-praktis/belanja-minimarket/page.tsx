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

const quiz = [
  {
    question: "Kamu tidak menemukan buku catatan yang ingin dibeli. Apa yang sebaiknya kamu tanyakan kepada pegawai?",
    options: [
      { label: "ノートはどこにありますか。", correct: true, feedback: "どこにありますか digunakan untuk menanyakan lokasi barang." },
      { label: "ノートはいくらですか。", correct: false, feedback: "Kalimat ini menanyakan harga, bukan lokasi barang." },
      { label: "ノートを<ruby>温<rt>あたた</rt></ruby>めてもらえますか。", correct: false, feedback: "<ruby>温<rt>あたた</rt></ruby>めてもらえますか digunakan untuk meminta makanan dipanaskan." },
    ],
  },
  {
    question: "Kasir menawarkan kantong belanja, tetapi kamu tidak membutuhkannya. Pilih jawaban yang tepat.",
    options: [
      { label: "<ruby>袋<rt>ふくろ</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", correct: false, feedback: "Kalimat ini berarti kamu meminta kantong." },
      { label: "<ruby>袋<rt>ふくろ</rt></ruby>はいりません。", correct: true, feedback: "いりません berarti tidak perlu atau tidak membutuhkan." },
      { label: "<ruby>袋<rt>ふくろ</rt></ruby>はどこですか。", correct: false, feedback: "Kalimat ini menanyakan letak kantong." },
    ],
  },
  {
    question: "Kamu ingin membayar menggunakan kartu. Apa yang kamu katakan?",
    options: [
      { label: "<ruby>現金<rt>げんきん</rt></ruby>でお<ruby>願<rt>ねが</rt></ruby>いします。", correct: false, feedback: "<ruby>現金<rt>げんきん</rt></ruby> berarti uang tunai." },
      { label: "レシートをお<ruby>願<rt>ねが</rt></ruby>いします。", correct: false, feedback: "Kalimat ini digunakan untuk meminta struk." },
      { label: "カードでお<ruby>願<rt>ねが</rt></ruby>いします。", correct: true, feedback: "で menunjukkan cara pembayaran: menggunakan kartu." },
    ],
  },
];

const simulation = [
  {
    prompt: "Kamu sedang mencari buku catatan di sebuah toko. Pegawai menghampirimu:",
    japanese: "<ruby>何<rt>なに</rt></ruby>かお<ruby>探<rt>さが</rt></ruby>しですか。",
    romaji: "Nanika osagashi desu ka.",
    translation: "Apakah ada sesuatu yang sedang Anda cari?",
    task: "Tanyakan lokasi buku catatan.",
    options: [
      { label: "ノートはどこにありますか。", correct: true, feedback: "Benar. Kamu menanyakan di mana buku catatan berada." },
      { label: "ノートをください。", correct: false, feedback: "Kalimat ini berarti meminta buku catatan, bukan menanyakan lokasinya." },
      { label: "ノートはいりません。", correct: false, feedback: "Kalimat ini berarti tidak membutuhkan buku catatan." },
    ],
  },
  {
    prompt: "Kamu menemukan pakaian yang disukai dan ingin meminta izin untuk mencobanya. Pegawai toko menyambutmu:",
    japanese: "いらっしゃいませ。",
    romaji: "Irasshaimase.",
    translation: "Selamat datang.",
    task: "Tanyakan izin untuk mencoba pakaian tersebut.",
    options: [
      { label: "<ruby>試着<rt>しちゃく</rt></ruby>してもいいですか。", correct: true, feedback: "<ruby>試着<rt>しちゃく</rt></ruby>してもいいですか berarti meminta izin untuk mencoba pakaian." },
      { label: "いくらですか。", correct: false, feedback: "Kalimat ini menanyakan harga." },
      { label: "カードは<ruby>使<rt>つか</rt></ruby>えますか。", correct: false, feedback: "Kalimat ini menanyakan apakah kartu bisa digunakan untuk membayar." },
    ],
  },
  {
    prompt: "Setelah selesai memilih barang, kasir bertanya:",
    japanese: "お<ruby>支払<rt>しはら</rt></ruby>いはカードですか、<ruby>現金<rt>げんきん</rt></ruby>ですか。",
    romaji: "Oshiharai wa kaado desu ka, genkin desu ka.",
    translation: "Pembayarannya dengan kartu atau uang tunai?",
    task: "Kamu ingin membayar dengan kartu dan tidak membutuhkan kantong.",
    options: [
      { label: "カードでお<ruby>願<rt>ねが</rt></ruby>いします。<ruby>袋<rt>ふくろ</rt></ruby>はいりません。", correct: true, feedback: "Tepat. Kamu menyebutkan metode pembayaran dan menolak kantong dengan sopan." },
      { label: "<ruby>現金<rt>げんきん</rt></ruby>でお<ruby>願<rt>ねが</rt></ruby>いします。<ruby>袋<rt>ふくろ</rt></ruby>をください。", correct: false, feedback: "Kalimat ini memilih uang tunai dan meminta kantong." },
      { label: "レシートはどこですか。<ruby>袋<rt>ふくろ</rt></ruby>はありますか。", correct: false, feedback: "Kalimat ini menanyakan struk dan ketersediaan kantong, bukan menyampaikan pilihanmu." },
    ],
  },
];

const phrases: { title: string; description: string; items: Phrase[] }[] = [
  {
    title: "A. Menanyakan barang dan lokasinya",
    description: "Gunakan ungkapan ini saat mencari barang atau meminta bantuan pegawai toko.",
    items: [
      { jp: "すみません、<ruby>商品<rt>しょうひん</rt></ruby>はどこにありますか。", romaji: "Sumimasen, shouhin wa doko ni arimasu ka.", id: "Permisi, barangnya ada di mana?", tone: "Sopan · bertanya lokasi" },
      { jp: "<ruby>文房具<rt>ぶんぼうぐ</rt></ruby><ruby>売<rt>う</rt></ruby>り<ruby>場<rt>ば</rt></ruby>はどこですか。", romaji: "Bunbougu uriba wa doko desu ka.", id: "Bagian alat tulis ada di mana?", tone: "Menanyakan bagian toko" },
      { jp: "この<ruby>商品<rt>しょうひん</rt></ruby>はありますか。", romaji: "Kono shouhin wa arimasu ka.", id: "Apakah barang ini tersedia?", tone: "Menanyakan ketersediaan" },
      { jp: "<ruby>別<rt>べつ</rt></ruby>の<ruby>色<rt>いろ</rt></ruby>はありますか。", romaji: "Betsu no iro wa arimasu ka.", id: "Apakah ada warna lain?", tone: "Meminta pilihan lain" },
      { jp: "ほかのサイズはありますか。", romaji: "Hoka no saizu wa arimasu ka.", id: "Apakah ada ukuran lainnya?", tone: "Meminta pilihan ukuran" },
    ],
  },
  {
    title: "B. Menanyakan harga dan memilih",
    description: "Kamu bisa menanyakan harga, menyampaikan pilihan, atau meminta waktu untuk mempertimbangkan barang.",
    items: [
      { jp: "これはいくらですか。", romaji: "Kore wa ikura desu ka.", id: "Berapa harga ini?", tone: "Menanyakan harga" },
      { jp: "これにします。", romaji: "Kore ni shimasu.", id: "Saya pilih yang ini.", tone: "Menyampaikan keputusan" },
      { jp: "<ruby>少<rt>すこ</rt></ruby>し<ruby>考<rt>かんが</rt></ruby>えます。", romaji: "Sukoshi kangaemasu.", id: "Saya pikir-pikir dulu sebentar.", tone: "Menunda keputusan" },
      { jp: "ほかのものも<ruby>見<rt>み</rt></ruby>ていいですか。", romaji: "Hoka no mono mo mite ii desu ka.", id: "Boleh saya melihat barang yang lain juga?", tone: "Meminta waktu melihat-lihat" },
    ],
  },
  {
    title: "C. Meminta bantuan dan layanan",
    description: "Beberapa ungkapan ini sering terdengar di toko pakaian maupun minimarket.",
    items: [
      { jp: "<ruby>試着<rt>しちゃく</rt></ruby>してもいいですか。", romaji: "Shichaku shite mo ii desu ka.", id: "Bolehkah saya mencobanya?", tone: "Toko pakaian" },
      { jp: "これを<ruby>温<rt>あたた</rt></ruby>めてもらえますか。", romaji: "Kore o atatamete moraemasu ka.", id: "Bisakah ini dipanaskan?", tone: "Minimarket · makanan" },
      { jp: "お<ruby>箸<rt>はし</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Ohashi o onegaishimasu.", id: "Tolong beri saya sumpit.", tone: "Minimarket · makanan" },
      { jp: "<ruby>袋<rt>ふくろ</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Fukuro o onegaishimasu.", id: "Tolong beri saya kantong.", tone: "Meminta kantong" },
      { jp: "<ruby>袋<rt>ふくろ</rt></ruby>はいりません。", romaji: "Fukuro wa irimasen.", id: "Saya tidak perlu kantong.", tone: "Menolak dengan sopan" },
      { jp: "<ruby>少々<rt>しょうしょう</rt></ruby>お<ruby>待<rt>ま</rt></ruby>ちください。", romaji: "Shoushou omachi kudasai.", id: "Mohon tunggu sebentar.", tone: "Ungkapan pegawai toko" },
    ],
  },
  {
    title: "D. Membayar dan menyelesaikan belanja",
    description: "Pahami ungkapan yang berkaitan dengan metode pembayaran, struk, dan kartu anggota.",
    items: [
      { jp: "カードは<ruby>使<rt>つか</rt></ruby>えますか。", romaji: "Kaado wa tsukaemasu ka.", id: "Apakah bisa menggunakan kartu?", tone: "Menanyakan metode pembayaran" },
      { jp: "カードでお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Kaado de onegaishimasu.", id: "Dengan kartu, ya.", tone: "Pembayaran" },
      { jp: "<ruby>現金<rt>げんきん</rt></ruby>でお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Genkin de onegaishimasu.", id: "Dengan uang tunai, ya.", tone: "Pembayaran" },
      { jp: "レシートをお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Reshiito o onegaishimasu.", id: "Tolong berikan struknya.", tone: "Meminta struk" },
      { jp: "ポイントカードはお<ruby>持<rt>も</rt></ruby>ちですか。", romaji: "Pointo kaado wa omochi desu ka.", id: "Apakah Anda memiliki kartu poin?", tone: "Pertanyaan pegawai toko" },
      { jp: "<ruby>持<rt>も</rt></ruby>っていません。", romaji: "Motte imasen.", id: "Saya tidak punya.", tone: "Jawaban sederhana" },
    ],
  },
];

const dialogues: { title: string; context: string; lines: DialogueLine[] }[] = [
  {
    title: "Percakapan 1 · Membeli makanan di minimarket",
    context: "Kamu membeli bekal dan meminta pegawai memanaskannya.",
    lines: [
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "いらっしゃいませ。", romaji: "Irasshaimase.", id: "Selamat datang." },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "すみません、このお<ruby>弁当<rt>べんとう</rt></ruby>を<ruby>温<rt>あたた</rt></ruby>めてもらえますか。", romaji: "Sumimasen, kono obentou o atatamete moraemasu ka.", id: "Permisi, bisakah bekal ini dipanaskan?" },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "はい。お<ruby>箸<rt>はし</rt></ruby>はおつけしますか。", romaji: "Hai. Ohashi wa otsuke shimasu ka.", id: "Baik. Apakah perlu saya sertakan sumpit?" },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "はい、お<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Hai, onegaishimasu.", id: "Ya, tolong." },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "<ruby>袋<rt>ふくろ</rt></ruby>はご<ruby>利用<rt>りよう</rt></ruby>ですか。", romaji: "Fukuro wa goriyou desu ka.", id: "Apakah Anda perlu kantong?" },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "いいえ、いりません。", romaji: "Iie, irimasen.", id: "Tidak, saya tidak perlu." },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "かしこまりました。", romaji: "Kashikomarimashita.", id: "Baik, dimengerti." },
    ],
  },
  {
    title: "Percakapan 2 · Mencari barang di toko",
    context: "Kamu mencari alat tulis dan bertanya kepada pegawai tentang lokasinya.",
    lines: [
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "すみません、ノートはどこにありますか。", romaji: "Sumimasen, nooto wa doko ni arimasu ka.", id: "Permisi, buku catatan ada di mana?" },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "<ruby>文房具<rt>ぶんぼうぐ</rt></ruby><ruby>売<rt>う</rt></ruby>り<ruby>場<rt>ば</rt></ruby>は<ruby>二階<rt>にかい</rt></ruby>です。", romaji: "Bunbougu uriba wa nikai desu.", id: "Bagian alat tulis ada di lantai dua." },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "ありがとうございます。", romaji: "Arigatou gozaimasu.", id: "Terima kasih." },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "こちらのエスカレーターをご<ruby>利用<rt>りよう</rt></ruby>ください。", romaji: "Kochira no esukareetaa o goriyou kudasai.", id: "Silakan gunakan eskalator yang ini." },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "わかりました。", romaji: "Wakarimashita.", id: "Baik, saya mengerti." },
    ],
  },
  {
    title: "Percakapan 3 · Membayar di kasir",
    context: "Kamu sudah memilih barang dan ingin membayar dengan kartu.",
    lines: [
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "<ruby>合計<rt>ごうけい</rt></ruby>は<ruby>千二百円<rt>せんにひゃくえん</rt></ruby>です。", romaji: "Goukei wa sen nihyaku en desu.", id: "Totalnya 1.200 yen." },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "お<ruby>支払<rt>しはら</rt></ruby>いはカードですか、<ruby>現金<rt>げんきん</rt></ruby>ですか。", romaji: "Oshiharai wa kaado desu ka, genkin desu ka.", id: "Pembayarannya dengan kartu atau uang tunai?" },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "カードでお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Kaado de onegaishimasu.", id: "Dengan kartu, ya." },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "ポイントカードはお<ruby>持<rt>も</rt></ruby>ちですか。", romaji: "Pointo kaado wa omochi desu ka.", id: "Apakah Anda memiliki kartu poin?" },
      { speaker: "<ruby>客<rt>きゃく</rt></ruby>", jp: "いいえ、<ruby>持<rt>も</rt></ruby>っていません。", romaji: "Iie, motte imasen.", id: "Tidak, saya tidak punya." },
      { speaker: "<ruby>店員<rt>てんいん</rt></ruby>", jp: "ありがとうございます。レシートです。", romaji: "Arigatou gozaimasu. Reshiito desu.", id: "Terima kasih. Ini struknya." },
    ],
  },
];

const vocabulary = [
  { word: "<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>", reading: "かいもの", romaji: "kaimono", meaning: "Belanja" },
  { word: "<ruby>商品<rt>しょうひん</rt></ruby>", reading: "しょうひん", romaji: "shouhin", meaning: "Barang / produk" },
  { word: "<ruby>値段<rt>ねだん</rt></ruby>", reading: "ねだん", romaji: "nedan", meaning: "Harga" },
  { word: "<ruby>売<rt>う</rt></ruby>り<ruby>場<rt>ば</rt></ruby>", reading: "うりば", romaji: "uriba", meaning: "Bagian / area penjualan" },
  { word: "<ruby>試着<rt>しちゃく</rt></ruby>", reading: "しちゃく", romaji: "shichaku", meaning: "Mencoba pakaian" },
  { word: "<ruby>現金<rt>げんきん</rt></ruby>", reading: "げんきん", romaji: "genkin", meaning: "Uang tunai" },
  { word: "<ruby>袋<rt>ふくろ</rt></ruby>", reading: "ふくろ", romaji: "fukuro", meaning: "Kantong" },
  { word: "<ruby>会計<rt>かいけい</rt></ruby>", reading: "かいけい", romaji: "kaikei", meaning: "Pembayaran / kasir" },
];

export default function BelanjaMinimarketPage() {
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
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">KATEGORI 02 · MATERI 1</p>
        <h1 className="mt-2 text-2xl font-bold text-[#EAE6DD] sm:text-3xl">Belanja dan Minimarket</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A3A099]">
          Pelajari cara mencari barang, menanyakan harga dan ukuran, meminta bantuan pegawai,
          serta menyelesaikan pembayaran dengan ungkapan yang wajar dan sopan.
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
          Setelah materi ini, kamu diharapkan bisa menanyakan lokasi dan ketersediaan barang,
          memilih ukuran atau warna, meminta layanan sederhana, serta menyampaikan metode pembayaran.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Ungkapan penting</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Pelajari ungkapan yang bisa langsung digunakan saat berbelanja di Jepang.</p>
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
          <p className="mt-1 text-xs text-[#A3A099]">Tiga situasi belanja: minimarket, mencari barang, dan pembayaran di kasir.</p>
        </div>
        {dialogues.map((dialogue) => (
          <Dialogue key={dialogue.title} {...dialogue} />
        ))}
      </section>

      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Etika dan kebiasaan saat berbelanja</h2>
        </div>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[#C5C0B7]">
          <li><span className="font-semibold text-[#EAE6DD]">Awali dengan すみません.</span> Saat membutuhkan bantuan pegawai, ungkapan ini merupakan cara yang wajar untuk menarik perhatian dengan sopan.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Harga umumnya sudah ditetapkan.</span> Di minimarket dan sebagian besar toko biasa, menawar harga bukan kebiasaan umum. Lebih baik tanyakan apakah barang sedang diskon atau tersedia pilihan lain.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Kantong belanja.</span> Pegawai mungkin menanyakan apakah kamu memerlukan kantong. Jawab <ruby>袋<rt>ふくろ</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします jika perlu, atau <ruby>袋<rt>ふくろ</rt></ruby>はいりません jika tidak.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Pembayaran bisa berbeda-beda.</span> Tidak semua toko menerima setiap jenis kartu atau pembayaran digital. Perhatikan tanda di kasir atau tanyakan カードは<ruby>使<rt>つか</rt></ruby>えますか.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Jangan membuka makanan sebelum membayar.</span> Bawa barang ke kasir terlebih dahulu, lalu ikuti arahan pegawai saat pembayaran.</li>
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
          Hadapi tiga situasi saat berbelanja. Pilih respons yang sesuai agar percakapan berjalan wajar.
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
