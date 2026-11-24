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
import practicalVocabData from "@/data/practical-vocab.json";

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
    title: "A. Berkunjung ke klinik dan rumah sakit",
    description: "Ungkapan untuk mendaftar, menyampaikan keperluan pemeriksaan, dan memahami pertanyaan petugas.",
    items: [
      { jp: "<ruby>受付<rt>うけつけ</rt></ruby>はどこですか。", romaji: "Uketsuke wa doko desu ka.", id: "Loket pendaftaran ada di mana?", tone: "Mencari bagian pendaftaran" },
      { jp: "<ruby>診察<rt>しんさつ</rt></ruby>を<ruby>受<rt>う</rt></ruby>けたいです。", romaji: "Shinsatsu o uketai desu.", id: "Saya ingin menjalani pemeriksaan.", tone: "Menyampaikan keperluan" },
      { jp: "<ruby>予約<rt>よやく</rt></ruby>しています。", romaji: "Yoyaku shite imasu.", id: "Saya sudah membuat janji.", tone: "Datang dengan reservasi" },
      { jp: "<ruby>予約<rt>よやく</rt></ruby>していません。", romaji: "Yoyaku shite imasen.", id: "Saya belum membuat janji.", tone: "Datang tanpa reservasi" },
      { jp: "<ruby>初<rt>はじ</rt></ruby>めてです。", romaji: "Hajimete desu.", id: "Ini pertama kalinya saya berkunjung.", tone: "Pasien baru" },
      { jp: "<ruby>今日<rt>きょう</rt></ruby>はどうされましたか。", romaji: "Kyou wa dou saremashita ka.", id: "Ada keluhan apa hari ini?", tone: "Pertanyaan petugas medis" },
    ],
  },
  {
    title: "B. Menjelaskan keluhan dan kondisi",
    description: "Gunakan kalimat sederhana untuk menyampaikan bagian tubuh yang terasa sakit atau gejala yang dialami.",
    items: [
      { jp: "<ruby>頭<rt>あたま</rt></ruby>が<ruby>痛<rt>いた</rt></ruby>いです。", romaji: "Atama ga itai desu.", id: "Kepala saya sakit.", tone: "Keluhan" },
      { jp: "お<ruby>腹<rt>なか</rt></ruby>が<ruby>痛<rt>いた</rt></ruby>いです。", romaji: "Onaka ga itai desu.", id: "Perut saya sakit.", tone: "Keluhan" },
      { jp: "<ruby>熱<rt>ねつ</rt></ruby>があります。", romaji: "Netsu ga arimasu.", id: "Saya demam.", tone: "Keluhan" },
      { jp: "<ruby>咳<rt>せき</rt></ruby>が<ruby>出<rt>で</rt></ruby>ます。", romaji: "Seki ga demasu.", id: "Saya batuk.", tone: "Keluhan" },
      { jp: "のどが<ruby>痛<rt>いた</rt></ruby>いです。", romaji: "Nodo ga itai desu.", id: "Tenggorokan saya sakit.", tone: "Keluhan" },
      { jp: "<ruby>気分<rt>きぶん</rt></ruby>が<ruby>悪<rt>わる</rt></ruby>いです。", romaji: "Kibun ga warui desu.", id: "Saya merasa tidak enak badan.", tone: "Kondisi umum" },
      { jp: "いつからですか。", romaji: "Itsu kara desu ka.", id: "Sejak kapan?", tone: "Pertanyaan petugas medis" },
      { jp: "<ruby>昨日<rt>きのう</rt></ruby>からです。", romaji: "Kinou kara desu.", id: "Sejak kemarin.", tone: "Menjelaskan sejak kapan" },
      { jp: "アレルギーがあります。", romaji: "Arerugii ga arimasu.", id: "Saya memiliki alergi.", tone: "Informasi penting" },
      { jp: "<ruby>今<rt>いま</rt></ruby>、この<ruby>薬<rt>くすり</rt></ruby>を<ruby>飲<rt>の</rt></ruby>んでいます。", romaji: "Ima, kono kusuri o nonde imasu.", id: "Saat ini saya sedang mengonsumsi obat ini.", tone: "Informasi obat" },
    ],
  },
  {
    title: "C. Bertanya di apotek",
    description: "Ungkapan untuk meminta penjelasan dari apoteker tentang obat dan aturan pakainya.",
    items: [
      { jp: "この<ruby>薬<rt>くすり</rt></ruby>は<ruby>何<rt>なに</rt></ruby>に<ruby>効<rt>き</rt></ruby>きますか。", romaji: "Kono kusuri wa nani ni kikimasu ka.", id: "Obat ini untuk mengatasi apa?", tone: "Menanyakan kegunaan obat" },
      { jp: "<ruby>一日<rt>いちにち</rt></ruby>に<ruby>何回<rt>なんかい</rt></ruby><ruby>飲<rt>の</rt></ruby>めばいいですか。", romaji: "Ichinichi ni nankai nomeba ii desu ka.", id: "Dalam sehari, berapa kali obat ini perlu diminum?", tone: "Menanyakan aturan pakai" },
      { jp: "<ruby>食後<rt>しょくご</rt></ruby>に<ruby>飲<rt>の</rt></ruby>んでください。", romaji: "Shokugo ni nonde kudasai.", id: "Silakan minum setelah makan.", tone: "Instruksi apoteker" },
      { jp: "<ruby>処方箋<rt>しょほうせん</rt></ruby>があります。", romaji: "Shohousen ga arimasu.", id: "Saya memiliki resep dokter.", tone: "Menyerahkan resep" },
      { jp: "<ruby>薬局<rt>やっきょく</rt></ruby>はどこですか。", romaji: "Yakkyoku wa doko desu ka.", id: "Apotek ada di mana?", tone: "Mencari apotek" },
      { jp: "<ruby>薬<rt>くすり</rt></ruby>の<ruby>説明<rt>せつめい</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Kusuri no setsumei o onegaishimasu.", id: "Tolong jelaskan tentang obat ini.", tone: "Meminta penjelasan" },
    ],
  },
  {
    title: "D. Meminta bantuan dalam keadaan darurat",
    description: "Ungkapan singkat untuk meminta pertolongan dan menyampaikan bahwa diperlukan bantuan medis darurat.",
    items: [
      { jp: "<ruby>助<rt>たす</rt></ruby>けてください。", romaji: "Tasukete kudasai.", id: "Tolong, bantu saya.", tone: "Meminta pertolongan" },
      { jp: "<ruby>救急車<rt>きゅうきゅうしゃ</rt></ruby>を<ruby>呼<rt>よ</rt></ruby>んでください。", romaji: "Kyuukyuusha o yonde kudasai.", id: "Tolong panggil ambulans.", tone: "Meminta ambulans" },
      { jp: "<ruby>救急<rt>きゅうきゅう</rt></ruby>です。", romaji: "Kyuukyuu desu.", id: "Ini keadaan darurat medis.", tone: "Saat meminta bantuan darurat" },
      { jp: "119<ruby>番<rt>ばん</rt></ruby>に<ruby>電話<rt>でんわ</rt></ruby>してください。", romaji: "Hyaku juu kyuu ban ni denwa shite kudasai.", id: "Tolong telepon 119.", tone: "Meminta orang lain menghubungi layanan darurat" },
      { jp: "<ruby>日本語<rt>にほんご</rt></ruby>があまり<ruby>話<rt>はな</rt></ruby>せません。", romaji: "Nihongo ga amari hanasemasen.", id: "Saya tidak begitu bisa berbicara bahasa Jepang.", tone: "Menjelaskan keterbatasan bahasa" },
      { jp: "ゆっくり<ruby>話<rt>はな</rt></ruby>してください。", romaji: "Yukkuri hanashite kudasai.", id: "Tolong bicara pelan-pelan.", tone: "Meminta lawan bicara memperlambat ucapan" },
    ],
  },
];

const dialogues: { title: string; context: string; lines: DialogueLine[] }[] = [
  {
    title: "Percakapan 1 · Mendaftar di klinik",
    context: "Kamu datang ke klinik karena merasa tidak enak badan dan belum pernah berkunjung ke sana.",
    lines: [
      { speaker: "<ruby>受付<rt>うけつけ</rt></ruby>", jp: "こんにちは。<ruby>今日<rt>きょう</rt></ruby>はどうされましたか。", romaji: "Konnichiwa. Kyou wa dou saremashita ka.", id: "Selamat siang. Ada keluhan apa hari ini?" },
      { speaker: "<ruby>患者<rt>かんじゃ</rt></ruby>", jp: "<ruby>熱<rt>ねつ</rt></ruby>があります。のども<ruby>痛<rt>いた</rt></ruby>いです。", romaji: "Netsu ga arimasu. Nodo mo itai desu.", id: "Saya demam. Tenggorokan juga sakit." },
      { speaker: "<ruby>受付<rt>うけつけ</rt></ruby>", jp: "いつからですか。", romaji: "Itsu kara desu ka.", id: "Sejak kapan?" },
      { speaker: "<ruby>患者<rt>かんじゃ</rt></ruby>", jp: "<ruby>昨日<rt>きのう</rt></ruby>からです。", romaji: "Kinou kara desu.", id: "Sejak kemarin." },
      { speaker: "<ruby>受付<rt>うけつけ</rt></ruby>", jp: "<ruby>初<rt>はじ</rt></ruby>めての<ruby>受診<rt>じゅしん</rt></ruby>ですか。", romaji: "Hajimete no jushin desu ka.", id: "Apakah ini pertama kalinya Anda menjalani pemeriksaan di sini?" },
      { speaker: "<ruby>患者<rt>かんじゃ</rt></ruby>", jp: "はい、<ruby>初<rt>はじ</rt></ruby>めてです。", romaji: "Hai, hajimete desu.", id: "Ya, ini pertama kalinya." },
    ],
  },
  {
    title: "Percakapan 2 · Bertanya kepada apoteker",
    context: "Kamu membawa resep dan ingin memahami aturan penggunaan obat dari apoteker.",
    lines: [
      { speaker: "<ruby>患者<rt>かんじゃ</rt></ruby>", jp: "すみません。<ruby>処方箋<rt>しょほうせん</rt></ruby>があります。", romaji: "Sumimasen. Shohousen ga arimasu.", id: "Permisi. Saya memiliki resep dokter." },
      { speaker: "<ruby>薬剤師<rt>やくざいし</rt></ruby>", jp: "かしこまりました。こちらがお<ruby>薬<rt>くすり</rt></ruby>です。", romaji: "Kashikomarimashita. Kochira ga okusuri desu.", id: "Baik. Ini obat Anda." },
      { speaker: "<ruby>患者<rt>かんじゃ</rt></ruby>", jp: "<ruby>一日<rt>いちにち</rt></ruby>に<ruby>何回<rt>なんかい</rt></ruby><ruby>飲<rt>の</rt></ruby>めばいいですか。", romaji: "Ichinichi ni nankai nomeba ii desu ka.", id: "Dalam sehari, berapa kali obat ini perlu diminum?" },
      { speaker: "<ruby>薬剤師<rt>やくざいし</rt></ruby>", jp: "<ruby>薬<rt>くすり</rt></ruby>によって<ruby>飲<rt>の</rt></ruby>み<ruby>方<rt>かた</rt></ruby>が<ruby>違<rt>ちが</rt></ruby>います。<ruby>説明書<rt>せつめいしょ</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>してください。", romaji: "Kusuri ni yotte nomikata ga chigaimasu. Setsumeisho o kakunin shite kudasai.", id: "Aturan minum berbeda-beda tergantung obatnya. Silakan periksa petunjuk penggunaan." },
      { speaker: "<ruby>患者<rt>かんじゃ</rt></ruby>", jp: "わかりました。ありがとうございます。", romaji: "Wakarimashita. Arigatou gozaimasu.", id: "Baik, saya mengerti. Terima kasih." },
    ],
  },
  {
    title: "Percakapan 3 · Meminta bantuan darurat",
    context: "Kamu melihat seseorang membutuhkan bantuan medis segera dan meminta orang di sekitar untuk menolong.",
    lines: [
      { speaker: "あなた", jp: "すみません。<ruby>助<rt>たす</rt></ruby>けてください。", romaji: "Sumimasen. Tasukete kudasai.", id: "Permisi. Tolong bantu." },
      { speaker: "<ruby>通行人<rt>つうこうにん</rt></ruby>", jp: "どうしましたか。", romaji: "Dou shimashita ka.", id: "Ada apa?" },
      { speaker: "あなた", jp: "<ruby>具合<rt>ぐあい</rt></ruby>が<ruby>悪<rt>わる</rt></ruby>い<ruby>人<rt>ひと</rt></ruby>がいます。<ruby>救急車<rt>きゅうきゅうしゃ</rt></ruby>を<ruby>呼<rt>よ</rt></ruby>んでください。", romaji: "Guai ga warui hito ga imasu. Kyuukyuusha o yonde kudasai.", id: "Ada seseorang yang kondisinya tidak baik. Tolong panggil ambulans." },
      { speaker: "<ruby>通行人<rt>つうこうにん</rt></ruby>", jp: "わかりました。119<ruby>番<rt>ばん</rt></ruby>に<ruby>電話<rt>でんわ</rt></ruby>します。", romaji: "Wakarimashita. Hyaku juu kyuu ban ni denwa shimasu.", id: "Baik. Saya akan menelepon 119." },
      { speaker: "あなた", jp: "ありがとうございます。", romaji: "Arigatou gozaimasu.", id: "Terima kasih." },
    ],
  },
];

const practicalCategory = practicalVocabData.find((category) => category.id === "kesehatan-keadaan-darurat")!;
const vocabulary = practicalCategory.vocab;

const quiz = [
  {
    question: "Petugas klinik bertanya 「<ruby>今日<rt>きょう</rt></ruby>はどうされましたか。」 Kamu ingin mengatakan bahwa tenggorokanmu sakit. Pilih jawaban yang tepat.",
    options: [
      { label: "のどが<ruby>痛<rt>いた</rt></ruby>いです。", correct: true, feedback: "Benar. のどが<ruby>痛<rt>いた</rt></ruby>いです berarti tenggorokan saya sakit." },
      { label: "<ruby>薬局<rt>やっきょく</rt></ruby>はどこですか。", correct: false, feedback: "Kalimat ini menanyakan lokasi apotek." },
      { label: "<ruby>予約<rt>よやく</rt></ruby>しています。", correct: false, feedback: "Kalimat ini menyampaikan bahwa kamu sudah membuat janji." },
    ],
  },
  {
    question: "Kamu ingin bertanya kepada apoteker berapa kali obat perlu diminum dalam sehari. Apa yang kamu katakan?",
    options: [
      { label: "<ruby>一日<rt>いちにち</rt></ruby>に<ruby>何回<rt>なんかい</rt></ruby><ruby>飲<rt>の</rt></ruby>めばいいですか。", correct: true, feedback: "Tepat. Pertanyaan ini menanyakan frekuensi minum obat dalam sehari." },
      { label: "<ruby>何時<rt>なんじ</rt></ruby>に<ruby>着<rt>つ</rt></ruby>きますか。", correct: false, feedback: "Kalimat ini menanyakan pukul berapa seseorang tiba." },
      { label: "<ruby>熱<rt>ねつ</rt></ruby>があります。", correct: false, feedback: "Kalimat ini menyampaikan bahwa kamu demam." },
    ],
  },
  {
    question: "Dalam keadaan medis darurat, kamu ingin meminta seseorang memanggil ambulans. Pilih ungkapan yang sesuai.",
    options: [
      { label: "<ruby>薬<rt>くすり</rt></ruby>の<ruby>説明<rt>せつめい</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", correct: false, feedback: "Kalimat ini meminta penjelasan tentang obat." },
      { label: "<ruby>救急車<rt>きゅうきゅうしゃ</rt></ruby>を<ruby>呼<rt>よ</rt></ruby>んでください。", correct: true, feedback: "Benar. Ungkapan ini berarti tolong panggil ambulans." },
      { label: "<ruby>予約<rt>よやく</rt></ruby>していません。", correct: false, feedback: "Kalimat ini menyampaikan bahwa kamu belum membuat janji." },
    ],
  },
];

const simulation = [
  {
    prompt: "Kamu datang ke klinik dan petugas bertanya:",
    japanese: "<ruby>今日<rt>きょう</rt></ruby>はどうされましたか。",
    romaji: "Kyou wa dou saremashita ka.",
    translation: "Ada keluhan apa hari ini?",
    task: "Sampaikan bahwa kamu demam.",
    options: [
      { label: "<ruby>熱<rt>ねつ</rt></ruby>があります。", correct: true, feedback: "Tepat. <ruby>熱<rt>ねつ</rt></ruby>があります berarti saya demam." },
      { label: "<ruby>薬局<rt>やっきょく</rt></ruby>はどこですか。", correct: false, feedback: "Kalimat ini menanyakan lokasi apotek." },
      { label: "<ruby>救急車<rt>きゅうきゅうしゃ</rt></ruby>を<ruby>呼<rt>よ</rt></ruby>んでください。", correct: false, feedback: "Kalimat ini meminta seseorang memanggil ambulans." },
    ],
  },
  {
    prompt: "Apoteker menunjukkan obat dan bertanya apakah ada hal yang ingin kamu tanyakan:",
    japanese: "<ruby>何<rt>なん</rt></ruby>か<ruby>質問<rt>しつもん</rt></ruby>はありますか。",
    romaji: "Nanika shitsumon wa arimasu ka.",
    translation: "Apakah ada pertanyaan?",
    task: "Tanyakan berapa kali obat diminum dalam sehari.",
    options: [
      { label: "<ruby>一日<rt>いちにち</rt></ruby>に<ruby>何回<rt>なんかい</rt></ruby><ruby>飲<rt>の</rt></ruby>めばいいですか。", correct: true, feedback: "Benar. Kamu bertanya tentang frekuensi minum obat; ikuti penjelasan apoteker." },
      { label: "<ruby>昨日<rt>きのう</rt></ruby>からです。", correct: false, feedback: "Kalimat ini menjawab pertanyaan sejak kapan keluhan dimulai." },
      { label: "<ruby>受付<rt>うけつけ</rt></ruby>はどこですか。", correct: false, feedback: "Kalimat ini menanyakan lokasi loket pendaftaran." },
    ],
  },
  {
    prompt: "Kamu berada dalam keadaan darurat medis dan perlu bantuan. Kamu berkata kepada orang di dekatmu:",
    japanese: "<ruby>何<rt>なに</rt></ruby>かお<ruby>手伝<rt>てつだ</rt></ruby>いしましょうか。",
    romaji: "Nanika otetsudai shimashou ka.",
    translation: "Apakah ada yang bisa saya bantu?",
    task: "Minta orang tersebut memanggil ambulans.",
    options: [
      { label: "<ruby>救急車<rt>きゅうきゅうしゃ</rt></ruby>を<ruby>呼<rt>よ</rt></ruby>んでください。", correct: true, feedback: "Tepat. Kamu meminta orang tersebut memanggil ambulans." },
      { label: "<ruby>予約<rt>よやく</rt></ruby>しています。", correct: false, feedback: "Kalimat ini menyampaikan bahwa kamu sudah membuat janji." },
      { label: "<ruby>薬局<rt>やっきょく</rt></ruby>はどこですか。", correct: false, feedback: "Kalimat ini menanyakan lokasi apotek." },
    ],
  },
];

export default function KesehatanKeadaanDaruratPage() {
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
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">KATEGORI 06 · MATERI 1</p>
        <h1 className="mt-2 text-2xl font-bold text-[#EAE6DD] sm:text-3xl">Kesehatan dan Keadaan Darurat</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A3A099]">
          Pelajari cara mendaftar di klinik, menjelaskan keluhan, bertanya tentang obat,
          dan meminta bantuan dalam keadaan darurat di Jepang.
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
          Setelah materi ini, kamu diharapkan bisa mendaftar di klinik, menjelaskan gejala sederhana,
          menyampaikan informasi alergi atau obat yang sedang digunakan, bertanya kepada apoteker,
          dan meminta bantuan darurat.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Ungkapan penting</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Pelajari contoh kalimat dari sisi pasien, petugas medis, dan orang yang membantu.</p>
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
          <p className="mt-1 text-xs text-[#A3A099]">Tiga situasi: mendaftar di klinik, bertanya kepada apoteker, dan meminta bantuan darurat.</p>
        </div>
        {dialogues.map((dialogue) => (
          <Dialogue key={dialogue.title} {...dialogue} />
        ))}
      </section>

      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Catatan saat mencari bantuan medis</h2>
        </div>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[#C5C0B7]">
          <li><span className="font-semibold text-[#EAE6DD]">Jelaskan keluhan dengan sederhana.</span> Sebutkan bagian tubuh yang terasa sakit, gejala yang dialami, dan sejak kapan. Jika sulit menjelaskan, tunjukkan catatan atau terjemahan tertulis.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Sampaikan informasi penting.</span> Beri tahu petugas medis tentang alergi dan obat yang sedang digunakan. Jangan menebak aturan obat; tanyakan langsung kepada dokter atau apoteker.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Pahami peran apoteker.</span> Apoteker dapat menjelaskan kegunaan dan aturan penggunaan obat yang diberikan. Tanyakan kembali jika ada bagian yang belum jelas.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Nomor darurat medis di Jepang.</span> Untuk keadaan medis darurat yang membutuhkan ambulans, hubungi 119. Saat menjelaskan keperluan, ungkapan <ruby>救急<rt>きゅうきゅう</rt></ruby>です berarti “ini keadaan darurat medis”. Nomor 119 juga digunakan untuk kebakaran. <a href="https://www.jnto.go.jp/emergency/index.html" target="_blank" rel="noreferrer" className="font-semibold text-[#D9B66D] underline underline-offset-2">Panduan resmi JNTO</a>.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Minta bantuan bahasa bila perlu.</span> Kamu dapat mengatakan <ruby>日本語<rt>にほんご</rt></ruby>があまり<ruby>話<rt>はな</rt></ruby>せません dan meminta lawan bicara berbicara lebih pelan. Ketersediaan dukungan bahasa bergantung pada fasilitas.</li>
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
          Hadapi tiga situasi kesehatan. Pilih respons yang sesuai agar kamu dapat menyampaikan kebutuhan dengan jelas.
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

      <section className="rounded-2xl border border-[#B8860B]/30 bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div>
          <h2 className="text-lg font-bold text-[#EAE6DD]">Lanjutkan latihan</h2>
          <p className="mt-1 text-xs leading-relaxed text-[#A3A099]">
            Kosakata kategori ini juga tersedia di modul Kosakata dan Flashcard. Cerita terkait bisa dibaca kembali di Latihan Baca.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/kosakata?category=${practicalCategory.id}`}
            className="rounded-xl border border-[#B8860B]/40 bg-[#B8860B]/10 px-3 py-2 text-xs font-bold text-[#D9B66D] transition-colors hover:bg-[#B8860B]/20"
          >
            Buka Kosakata
          </Link>
          <Link
            href={`/flashcard?category=${practicalCategory.id}`}
            className="rounded-xl border border-[#B8860B]/40 bg-[#B8860B]/10 px-3 py-2 text-xs font-bold text-[#D9B66D] transition-colors hover:bg-[#B8860B]/20"
          >
            Latihan Flashcard
          </Link>
          {practicalCategory.relatedStories.length > 0 ? (
            practicalCategory.relatedStories.map((story) => (
              <Link
                key={story.id}
                href={`/baca?story=${story.id}`}
                className="rounded-xl border border-[#33312E] px-3 py-2 text-xs font-semibold text-[#C5C0B7] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"
              >
                Baca: {story.title}
              </Link>
            ))
          ) : (
            <Link
              href="/baca"
              className="rounded-xl border border-[#33312E] px-3 py-2 text-xs font-semibold text-[#C5C0B7] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"
            >
              Buka Latihan Baca
            </Link>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-[#33312E] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/ungkapan-praktis" className="text-xs font-semibold text-[#A3A099] transition-colors hover:text-[#EAE6DD]">
          <ArrowLeft className="mr-1 inline" size={14} /> Daftar kategori
        </Link>
        <p className="text-xs text-[#817A73]">Seluruh 10 kategori Ungkapan Praktis sudah tersedia.</p>
      </div>
    </div>
  );
}
