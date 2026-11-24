"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
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
    question: "Kamu bertemu teman sekelas untuk pertama kali. Ungkapan pembuka mana yang paling tepat?",
    options: [
      { label: "はじめまして。", correct: true, feedback: "はじめまして digunakan saat pertama kali bertemu seseorang." },
      { label: "おやすみなさい。", correct: false, feedback: "おやすみなさい digunakan saat mengucapkan selamat tidur atau berpisah pada malam hari." },
      { label: "いただきます。", correct: false, feedback: "いただきます diucapkan sebelum makan." },
    ],
  },
  {
    question: "Kamu ingin mengatakan bahwa kamu berasal dari Indonesia. Pilih kalimat yang sesuai.",
    options: [
      { label: "インドネシアに<ruby>住<rt>す</rt></ruby>んでいます。", correct: false, feedback: "Kalimat ini berarti kamu tinggal di Indonesia sekarang, bukan menyatakan asal." },
      { label: "インドネシアから<ruby>来<rt>き</rt></ruby>ました。", correct: true, feedback: "から<ruby>来<rt>き</rt></ruby>ました menyatakan tempat asal atau tempat kamu datang." },
      { label: "インドネシアへ<ruby>行<rt>い</rt></ruby>きました。", correct: false, feedback: "へ<ruby>行<rt>い</rt></ruby>きました berarti sudah pergi ke Indonesia, bukan menyatakan bahwa kamu berasal dari sana." },
    ],
  },
  {
    question: "Kamu memperkenalkan teman kepada guru. Ungkapan mana yang cocok untuk memulai?",
    options: [
      { label: "こちらは<ruby>友達<rt>ともだち</rt></ruby>のミラさんです。", correct: true, feedback: "こちらは ... さんです adalah cara sopan untuk memperkenalkan seseorang." },
      { label: "ミラさんは<ruby>同<rt>おな</rt></ruby>じクラスですか。", correct: false, feedback: "Kalimat ini menanyakan apakah Mira berada di kelas yang sama, bukan memperkenalkannya." },
      { label: "ミラさんはどちらから<ruby>来<rt>き</rt></ruby>ましたか。", correct: false, feedback: "Kalimat ini menanyakan asal Mira, bukan memperkenalkan Mira kepada orang lain." },
    ],
  },
];

const simulation = [
  {
    prompt: "Kamu baru bertemu teman sekelas di kelas bahasa Jepang. Dia menyapa dan memperkenalkan diri:",
    japanese: "はじめまして。<ruby>田中<rt>たなか</rt></ruby>です。",
    romaji: "Hajimemashite. Tanaka desu.",
    translation: "Salam kenal. Saya Tanaka.",
    task: "Pilih respons yang paling wajar.",
    options: [
      { label: "はじめまして。アナです。よろしくお<ruby>願<rt>ねが</rt></ruby>いします。", correct: true, feedback: "Kamu membalas salam perkenalan, menyebut nama, lalu menyampaikan よろしくお<ruby>願<rt>ねが</rt></ruby>いします." },
      { label: "お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します。", correct: false, feedback: "Ungkapan ini digunakan saat meninggalkan tempat kerja sebelum orang lain." },
      { label: "いくらですか。", correct: false, feedback: "Kalimat ini menanyakan harga dan tidak sesuai dengan situasi perkenalan." },
    ],
  },
  {
    prompt: "Setelah berkenalan, Tanaka bertanya tentang tempat asalmu:",
    japanese: "ご<ruby>出身<rt>しゅっしん</rt></ruby>はどちらですか。",
    romaji: "Goshusshin wa dochira desu ka.",
    translation: "Anda berasal dari mana?",
    task: "Kamu berasal dari Indonesia. Apa jawaban yang sesuai?",
    options: [
      { label: "インドネシアから<ruby>来<rt>き</rt></ruby>ました。", correct: true, feedback: "Jawaban ini menyampaikan bahwa kamu berasal dari Indonesia." },
      { label: "インドネシアをください。", correct: false, feedback: "ください digunakan untuk meminta sesuatu, bukan menyebut asal." },
      { label: "インドネシアに<ruby>行<rt>い</rt></ruby>きます。", correct: false, feedback: "Kalimat ini berarti akan pergi ke Indonesia." },
    ],
  },
  {
    prompt: "Tanaka menutup perkenalan dengan ungkapan sopan:",
    japanese: "どうぞよろしくお<ruby>願<rt>ねが</rt></ruby>いします。",
    romaji: "Douzo yoroshiku onegaishimasu.",
    translation: "Senang berkenalan dengan Anda. / Mohon hubungan baiknya.",
    task: "Pilih balasan sopan yang sesuai.",
    options: [
      { label: "こちらこそ、よろしくお<ruby>願<rt>ねが</rt></ruby>いします。", correct: true, feedback: "こちらこそ menyampaikan 'saya juga', sehingga menjadi balasan yang wajar." },
      { label: "おはようございます。", correct: false, feedback: "Ini salam pagi dan tidak secara langsung membalas ungkapan perkenalan." },
      { label: "ごちそうさまでした。", correct: false, feedback: "Ungkapan ini digunakan setelah selesai makan." },
    ],
  },
];

const phrases: { title: string; description: string; items: Phrase[] }[] = [
  {
    title: "A. Salam saat bertemu",
    description: "Pilih salam sesuai waktu dan situasi. はじめまして khusus digunakan ketika baru pertama kali berkenalan.",
    items: [
      { jp: "おはようございます。", romaji: "Ohayou gozaimasu.", id: "Selamat pagi.", tone: "Sopan · pagi" },
      { jp: "こんにちは。", romaji: "Konnichiwa.", id: "Halo / selamat siang.", tone: "Netral · siang atau sore" },
      { jp: "こんばんは。", romaji: "Konbanwa.", id: "Selamat malam.", tone: "Netral · malam" },
      { jp: "はじめまして。", romaji: "Hajimemashite.", id: "Salam kenal. / Senang bertemu dengan Anda.", tone: "Pertama kali bertemu" },
    ],
  },
  {
    title: "B. Memperkenalkan diri",
    description: "Kamu tidak harus selalu menyebutkan subjek secara eksplisit. Dalam percakapan, menyebut nama diikuti です sudah terdengar alami.",
    items: [
      { jp: "アナです。", romaji: "Ana desu.", id: "Saya Ana.", tone: "Sederhana · netral" },
      { jp: "<ruby>私<rt>わたし</rt></ruby>はアナです。", romaji: "Watashi wa Ana desu.", id: "Saya Ana.", tone: "Lebih eksplisit" },
      { jp: "インドネシアから<ruby>来<rt>き</rt></ruby>ました。", romaji: "Indoneshia kara kimashita.", id: "Saya berasal dari Indonesia.", tone: "Asal" },
      { jp: "<ruby>今<rt>いま</rt></ruby>はインドネシアに<ruby>住<rt>す</rt></ruby>んでいます。", romaji: "Ima wa Indoneshia ni sunde imasu.", id: "Sekarang saya tinggal di Indonesia.", tone: "Tempat tinggal" },
      { jp: "<ruby>日本語<rt>にほんご</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>しています。", romaji: "Nihongo o benkyou shite imasu.", id: "Saya sedang belajar bahasa Jepang.", tone: "Aktivitas" },
      { jp: "<ruby>趣味<rt>しゅみ</rt></ruby>は<ruby>音楽<rt>おんがく</rt></ruby>です。", romaji: "Shumi wa ongaku desu.", id: "Hobi saya adalah musik.", tone: "Hobi" },
      { jp: "どうぞよろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Douzo yoroshiku onegaishimasu.", id: "Senang berkenalan dengan Anda. / Mohon hubungan baiknya.", tone: "Penutup perkenalan · sopan", note: "Maknanya tidak selalu bisa diterjemahkan kata per kata. Ungkapan ini menyampaikan harapan agar hubungan atau kerja sama berjalan baik." },
    ],
  },
  {
    title: "C. Bertanya kepada orang lain",
    description: "Pertanyaan singkat bisa membuka percakapan. Gunakan bentuk yang lebih halus ketika baru bertemu atau berbicara dalam situasi formal.",
    items: [
      { jp: "お<ruby>名前<rt>なまえ</rt></ruby>は<ruby>何<rt>なん</rt></ruby>ですか。", romaji: "Onamae wa nan desu ka.", id: "Siapa nama Anda?", tone: "Sopan · dasar" },
      { jp: "ご<ruby>出身<rt>しゅっしん</rt></ruby>はどちらですか。", romaji: "Goshusshin wa dochira desu ka.", id: "Anda berasal dari mana?", tone: "Lebih sopan" },
      { jp: "<ruby>日本語<rt>にほんご</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>しているんですか。", romaji: "Nihongo o benkyou shite irun desu ka.", id: "Apakah Anda sedang belajar bahasa Jepang?", tone: "Percakapan alami" },
      { jp: "<ruby>趣味<rt>しゅみ</rt></ruby>は<ruby>何<rt>なん</rt></ruby>ですか。", romaji: "Shumi wa nan desu ka.", id: "Apa hobi Anda?", tone: "Sopan · dasar" },
    ],
  },
  {
    title: "D. Memperkenalkan orang lain",
    description: "こちら adalah cara yang sopan untuk menunjuk orang yang sedang diperkenalkan.",
    items: [
      { jp: "<ruby>紹介<rt>しょうかい</rt></ruby>します。", romaji: "Shoukai shimasu.", id: "Saya akan memperkenalkan.", tone: "Pembuka" },
      { jp: "こちらは<ruby>友達<rt>ともだち</rt></ruby>のミラさんです。", romaji: "Kochira wa tomodachi no Mira-san desu.", id: "Ini teman saya, Mira.", tone: "Sopan" },
      { jp: "こちらこそ、よろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Kochira koso, yoroshiku onegaishimasu.", id: "Saya juga senang berkenalan dengan Anda.", tone: "Balasan perkenalan" },
    ],
  },
  {
    title: "E. Mengakhiri percakapan",
    description: "Gunakan bentuk santai dengan teman dekat dan bentuk sopan saat meninggalkan situasi formal.",
    items: [
      { jp: "じゃあ、また。", romaji: "Jaa, mata.", id: "Kalau begitu, sampai nanti.", tone: "Santai" },
      { jp: "では、また。", romaji: "Dewa, mata.", id: "Kalau begitu, sampai jumpa lagi.", tone: "Lebih sopan" },
      { jp: "<ruby>失礼<rt>しつれい</rt></ruby>します。", romaji: "Shitsurei shimasu.", id: "Permisi, saya pamit.", tone: "Sopan · meninggalkan tempat" },
      { jp: "お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します。", romaji: "Osaki ni shitsurei shimasu.", id: "Saya pamit pulang lebih dahulu.", tone: "Konteks tempat kerja", note: "Ungkapan ini digunakan ketika pulang lebih dahulu sementara rekan kerja masih ada. Rekan yang tinggal dapat menjawab お<ruby>疲<rt>つか</rt></ruby>れさまでした。" },
    ],
  },
];

const dialogues: { title: string; context: string; lines: DialogueLine[] }[] = [
  {
    title: "Percakapan 1 · Bertemu teman sekelas",
    context: "Dua orang baru pertama kali bertemu di kelas bahasa Jepang.",
    lines: [
      { speaker: "ユイ", jp: "はじめまして。ユイです。", romaji: "Hajimemashite. Yui desu.", id: "Salam kenal. Saya Yui." },
      { speaker: "アナ", jp: "はじめまして。アナです。インドネシアから<ruby>来<rt>き</rt></ruby>ました。", romaji: "Hajimemashite. Ana desu. Indoneshia kara kimashita.", id: "Salam kenal. Saya Ana. Saya berasal dari Indonesia." },
      { speaker: "ユイ", jp: "<ruby>日本語<rt>にほんご</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>しているんですか。", romaji: "Nihongo o benkyou shite irun desu ka.", id: "Apakah kamu sedang belajar bahasa Jepang?" },
      { speaker: "アナ", jp: "はい。まだ<ruby>勉強<rt>べんきょう</rt></ruby>を<ruby>始<rt>はじ</rt></ruby>めたばかりです。", romaji: "Hai. Mada benkyou o hajimeta bakari desu.", id: "Iya. Saya baru mulai belajar." },
      { speaker: "ユイ", jp: "そうなんですね。どうぞよろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Sou nan desu ne. Douzo yoroshiku onegaishimasu.", id: "Oh, begitu. Senang berkenalan denganmu." },
      { speaker: "アナ", jp: "こちらこそ、よろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Kochira koso, yoroshiku onegaishimasu.", id: "Saya juga senang berkenalan denganmu." },
    ],
  },
  {
    title: "Percakapan 2 · Bertanya tentang asal",
    context: "Setelah berkenalan, mereka melanjutkan percakapan ringan.",
    lines: [
      { speaker: "ユイ", jp: "ご<ruby>出身<rt>しゅっしん</rt></ruby>はどちらですか。", romaji: "Goshusshin wa dochira desu ka.", id: "Kamu berasal dari mana?" },
      { speaker: "アナ", jp: "インドネシアです。バンドンから<ruby>来<rt>き</rt></ruby>ました。", romaji: "Indoneshia desu. Bandon kara kimashita.", id: "Dari Indonesia. Saya berasal dari Bandung." },
      { speaker: "ユイ", jp: "<ruby>日本<rt>にほん</rt></ruby>は<ruby>初<rt>はじ</rt></ruby>めてですか。", romaji: "Nihon wa hajimete desu ka.", id: "Apakah ini pertama kalinya kamu ke Jepang?" },
      { speaker: "アナ", jp: "はい、<ruby>初<rt>はじ</rt></ruby>めてです。", romaji: "Hai, hajimete desu.", id: "Ya, ini pertama kali." },
      { speaker: "ユイ", jp: "そうなんですね。<ruby>日本<rt>にほん</rt></ruby>の<ruby>生活<rt>せいかつ</rt></ruby>でわからないことがあったら、<ruby>聞<rt>き</rt></ruby>いてくださいね。", romaji: "Sou nan desu ne. Nihon no seikatsu de wakaranai koto ga attara, kiite kudasai ne.", id: "Oh, begitu. Kalau ada yang belum kamu pahami tentang kehidupan di Jepang, tanyakan saja, ya." },
      { speaker: "アナ", jp: "ありがとうございます。", romaji: "Arigatou gozaimasu.", id: "Terima kasih." },
    ],
  },
  {
    title: "Percakapan 3 · Memperkenalkan teman",
    context: "Yui memperkenalkan Ana kepada Tanaka sebelum kelas dimulai.",
    lines: [
      { speaker: "ユイ", jp: "<ruby>田中<rt>たなか</rt></ruby>さん、<ruby>紹介<rt>しょうかい</rt></ruby>します。こちらは<ruby>友達<rt>ともだち</rt></ruby>のアナさんです。", romaji: "Tanaka-san, shoukai shimasu. Kochira wa tomodachi no Ana-san desu.", id: "Pak Tanaka, saya ingin memperkenalkan. Ini teman saya, Ana." },
      { speaker: "<ruby>田中<rt>たなか</rt></ruby>", jp: "はじめまして。<ruby>田中<rt>たなか</rt></ruby>です。どうぞよろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Hajimemashite. Tanaka desu. Douzo yoroshiku onegaishimasu.", id: "Salam kenal. Saya Tanaka. Senang berkenalan dengan Anda." },
      { speaker: "アナ", jp: "はじめまして。アナです。こちらこそ、よろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Hajimemashite. Ana desu. Kochira koso, yoroshiku onegaishimasu.", id: "Salam kenal. Saya Ana. Saya juga senang berkenalan dengan Anda." },
      { speaker: "<ruby>田中<rt>たなか</rt></ruby>", jp: "これから<ruby>同<rt>おな</rt></ruby>じクラスですね。", romaji: "Kore kara onaji kurasu desu ne.", id: "Mulai sekarang kita berada di kelas yang sama, ya." },
      { speaker: "アナ", jp: "はい。よろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Hai. Yoroshiku onegaishimasu.", id: "Iya. Mohon kerja samanya." },
    ],
  },
];

const vocabulary = [
  { word: "<ruby>挨拶<rt>あいさつ</rt></ruby>", reading: "あいさつ", romaji: "aisatsu", meaning: "Salam / sapaan" },
  { word: "<ruby>名前<rt>なまえ</rt></ruby>", reading: "なまえ", romaji: "namae", meaning: "Nama" },
  { word: "<ruby>出身<rt>しゅっしん</rt></ruby>", reading: "しゅっしん", romaji: "shusshin", meaning: "Asal daerah / tempat asal" },
  { word: "<ruby>紹介<rt>しょうかい</rt></ruby>", reading: "しょうかい", romaji: "shoukai", meaning: "Perkenalan / memperkenalkan" },
  { word: "<ruby>趣味<rt>しゅみ</rt></ruby>", reading: "しゅみ", romaji: "shumi", meaning: "Hobi" },
  { word: "<ruby>住<rt>す</rt></ruby>む", reading: "すむ", romaji: "sumu", meaning: "Tinggal / menetap" },
  { word: "<ruby>同<rt>おな</rt></ruby>じ", reading: "おなじ", romaji: "onaji", meaning: "Sama" },
  { word: "<ruby>初<rt>はじ</rt></ruby>めて", reading: "はじめて", romaji: "hajimete", meaning: "Untuk pertama kali" },
];

export default function SalamPerkenalanPage() {
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
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">KATEGORI 01 · MATERI 1</p>
        <h1 className="mt-2 text-2xl font-bold text-[#EAE6DD] sm:text-3xl">Salam dan Perkenalan</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A3A099]">
          Belajar menyapa orang yang baru dikenal, memperkenalkan diri, menanyakan informasi sederhana,
          dan memperkenalkan teman dengan ungkapan yang sesuai.
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
          Setelah materi ini, kamu diharapkan bisa menyapa seseorang, menyebutkan nama dan asal,
          menanyakan informasi dasar secara sopan, serta memperkenalkan orang lain.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Ungkapan penting</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Baca situasinya, perhatikan tingkat kesopanan, lalu pelajari contoh penggunaannya.</p>
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
          <p className="mt-1 text-xs text-[#A3A099]">Dialog orisinal Fude dengan situasi yang berbeda-beda.</p>
        </div>
        {dialogues.map((dialogue) => (
          <Dialogue key={dialogue.title} {...dialogue} />
        ))}
      </section>

      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Perbedaan tingkat kesopanan</h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#49443D] text-[#D9B66D]">
                <th className="px-3 py-2">Situasi</th>
                <th className="px-3 py-2">Ungkapan</th>
                <th className="px-3 py-2">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33312E] text-[#C5C0B7]">
              <tr><td className="px-3 py-3">Teman dekat</td><td className="px-3 py-3 font-mincho text-sm">よろしくね。</td><td className="px-3 py-3">Santai, untuk teman atau orang yang sudah akrab.</td></tr>
              <tr><td className="px-3 py-3">Perkenalan umum</td><td className="px-3 py-3 font-mincho text-sm">どうぞよろしくお<ruby>願<rt>ねが</rt></ruby>いします。</td><td className="px-3 py-3">Sopan dan cocok untuk perkenalan pertama.</td></tr>
              <tr><td className="px-3 py-3">Situasi formal</td><td className="px-3 py-3 font-mincho text-sm">アナと<ruby>申<rt>もう</rt></ruby>します。</td><td className="px-3 py-3">Bentuk rendah hati untuk menyebut nama sendiri.</td></tr>
            </tbody>
          </table>
        </div>
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

      <section className="rounded-2xl border border-[#B8860B]/25 bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Catatan budaya dan penggunaan</h2>
        </div>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[#C5C0B7]">
          <li><span className="font-semibold text-[#EAE6DD]">Pilih salam berdasarkan situasi.</span> おはようございます biasanya dipakai pada pagi hari; こんにちは pada siang atau sore; こんばんは pada malam hari. Batas waktunya tidak selalu kaku.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Gunakan nama + さん.</span> Dalam percakapan, orang Jepang sering memanggil lawan bicara dengan nama keluarga atau nama yang disepakati, diikuti さん. あなた tidak perlu dipakai terus-menerus untuk menyebut “Anda”.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Jangan memaksa pertanyaan pribadi.</span> Pertanyaan tentang asal atau hobi bisa membuka percakapan, tetapi tanyakan secara wajar dan hormati jika orang lain tidak ingin menjawab.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Pahami konteks お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します.</span> Ungkapan ini khususnya lazim ketika seseorang pulang lebih dahulu dari tempat kerja, bukan pengganti umum untuk semua salam perpisahan.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Membungkuk ringan.</span> Anggukan atau bungkukan kecil sering menyertai salam dan perkenalan. Tidak perlu dibuat berlebihan.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Latihan memilih ungkapan</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Pilih satu jawaban untuk setiap situasi. Pembahasan muncul setelah kamu memilih.</p>
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
                  const isCorrect = option.correct;
                  const showResult = selected !== undefined;
                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      onClick={() => answerQuiz(questionIndex, optionIndex)}
                      className={"rounded-xl border px-3 py-3 text-left text-sm transition-colors " + (
                        showResult && isSelected
                          ? isCorrect ? "border-[#269B70]/70 bg-[#269B70]/10 text-[#8ED8B4]" : "border-[#C93438]/70 bg-[#C93438]/10 text-[#F08B8E]"
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
          Bayangkan kamu baru masuk kelas bahasa Jepang dan berkenalan dengan Tanaka. Pilih respons terbaik untuk melanjutkan percakapan.
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
