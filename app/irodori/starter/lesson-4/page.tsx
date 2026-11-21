"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  MapPin,
  MessageCircle,
  RefreshCw,
  Users,
} from "lucide-react";
import IrodoriConversation, {
  type IrodoriUtterance,
} from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import {
  completeIrodoriLesson,
  saveIrodoriSelfEvaluation,
  useIrodoriProgress,
} from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const familyConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>これは、<ruby>家族<rt>かぞく</rt></ruby>の<ruby>写真<rt>しゃしん</rt></ruby>です。</>,
    romaji: "Kore wa, kazoku no shashin desu.",
    translation: "Ini foto keluarga saya.",
    audioFileName: "irodori-starter-04-a01-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>こちらは、どなたですか？</>,
    romaji: "Kochira wa, donata desu ka?",
    translation: "Siapa orang ini?",
    audioFileName: "irodori-starter-04-a01-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <><ruby>父<rt>ちち</rt></ruby>と<ruby>母<rt>はは</rt></ruby>です。</>,
    romaji: "Chichi to haha desu.",
    translation: "Ayah dan ibu saya.",
    audioFileName: "irodori-starter-04-a01-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>こちらの<ruby>人<rt>ひと</rt></ruby>は？</>,
    romaji: "Kochira no hito wa?",
    translation: "Kalau orang yang ini?",
    audioFileName: "irodori-starter-04-a01-l04.mp3",
  },
  {
    speakerId: "sota",
    japanese: <><ruby>妹<rt>いもうと</rt></ruby>です。<ruby>父<rt>ちち</rt></ruby>と<ruby>母<rt>はは</rt></ruby>と<ruby>妹<rt>いもうと</rt></ruby>です。</>,
    romaji: "Imouto desu. Chichi to haha to imouto desu.",
    translation: "Adik perempuan saya. Ini ayah, ibu, dan adik perempuan saya.",
    audioFileName: "irodori-starter-04-a01-l05.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>そうですか。すてきな<ruby>写真<rt>しゃしん</rt></ruby>ですね。</>,
    romaji: "Sou desu ka. Sutekina shashin desu ne.",
    translation: "Oh, begitu. Foto yang bagus, ya.",
    audioFileName: "irodori-starter-04-a01-l06.mp3",
  },
];

const ageResidenceConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>ミナさんは、<ruby>何歳<rt>なんさい</rt></ruby>ですか？</>,
    romaji: "Mina-san wa, nansai desu ka?",
    translation: "Mina, berapa usiamu?",
    audioFileName: "irodori-starter-04-a02-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>２５<ruby>歳<rt>さい</rt></ruby>です。</>,
    romaji: "Nijuu-go sai desu.",
    translation: "Saya berusia 25 tahun.",
    audioFileName: "irodori-starter-04-a02-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>そうですか。どこに<ruby>住<rt>す</rt></ruby>んでいますか？</>,
    romaji: "Sou desu ka. Doko ni sunde imasu ka?",
    translation: "Oh, begitu. Kamu tinggal di mana?",
    audioFileName: "irodori-starter-04-a02-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <><ruby>名古屋<rt>なごや</rt></ruby>に<ruby>住<rt>す</rt></ruby>んでいます。</>,
    romaji: "Nagoya ni sunde imasu.",
    translation: "Saya tinggal di Nagoya.",
    audioFileName: "irodori-starter-04-a02-l04.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ご<ruby>家族<rt>かぞく</rt></ruby>はどこに<ruby>住<rt>す</rt></ruby>んでいますか？</>,
    romaji: "Gokazoku wa doko ni sunde imasu ka?",
    translation: "Keluarga Anda tinggal di mana?",
    audioFileName: "irodori-starter-04-a02-l05.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <><ruby>家族<rt>かぞく</rt></ruby>は、インドネシアに<ruby>住<rt>す</rt></ruby>んでいます。</>,
    romaji: "Kazoku wa, Indonesia ni sunde imasu.",
    translation: "Keluarga saya tinggal di Indonesia.",
    audioFileName: "irodori-starter-04-a02-l06.mp3",
  },
];

const photoConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>これ、だれですか？</>,
    romaji: "Kore, dare desu ka?",
    translation: "Ini siapa?",
    audioFileName: "irodori-starter-04-a03-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <><ruby>私<rt>わたし</rt></ruby>の<ruby>母<rt>はは</rt></ruby>です。</>,
    romaji: "Watashi no haha desu.",
    translation: "Ini ibu saya.",
    audioFileName: "irodori-starter-04-a03-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>こちらは？</>,
    romaji: "Kochira wa?",
    translation: "Kalau yang ini?",
    audioFileName: "irodori-starter-04-a03-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <><ruby>姉<rt>あね</rt></ruby>の<ruby>子<rt>こ</rt></ruby>どもです。</>,
    romaji: "Ane no kodomo desu.",
    translation: "Ini anak kakak perempuan saya.",
    audioFileName: "irodori-starter-04-a03-l04.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>かわいいですね。</>,
    romaji: "Kawaii desu ne.",
    translation: "Lucu, ya.",
    audioFileName: "irodori-starter-04-a03-l05.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。それから、ペットのジョンです。</>,
    romaji: "Hai. Sorekara, petto no Jon desu.",
    translation: "Iya. Lalu, ini hewan peliharaan saya, John.",
    audioFileName: "irodori-starter-04-a03-l06.mp3",
  },
];

const canDos = [
  {
    id: "family",
    text: "Memahami siapa anggota keluarga ketika seseorang memperkenalkan keluarganya.",
  },
  {
    id: "age-residence",
    text: "Menanyakan dan menjawab pertanyaan sederhana tentang usia serta tempat tinggal.",
  },
  {
    id: "photo",
    text: "Menanyakan dan menjawab siapa orang atau hewan dalam sebuah foto.",
  },
  {
    id: "social-post",
    text: "Memahami topik unggahan singkat teman dengan bantuan foto.",
  },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Sudah bisa, masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

const ageExamples = [
  { age: "1", reading: "いっさい", note: "issai" },
  { age: "2", reading: "にさい", note: "nisai" },
  { age: "3", reading: "さんさい", note: "sansai" },
  { age: "4", reading: "よんさい", note: "yonsai" },
  { age: "5", reading: "ごさい", note: "gosai" },
  { age: "6", reading: "ろくさい", note: "rokusai" },
  { age: "7", reading: "ななさい", note: "nanasai" },
  { age: "8", reading: "はっさい", note: "hassai" },
  { age: "9", reading: "きゅうさい", note: "kyuusai" },
  { age: "10", reading: "じゅっさい", note: "jussai" },
  { age: "18", reading: "じゅうはっさい", note: "juuhassai" },
  { age: "20", reading: "はたち", note: "hatachi" },
];

const quizQuestions: {
  prompt: string;
  term?: string;
  options: string[];
  answer: string;
  explanation: string;
}[] = [
  {
    prompt: "Dalam sebuah foto keluarga, seseorang memperkenalkan ayah dan ibunya. Kata penghubung apa yang berarti “dan”?",
    options: ["と", "の", "に"],
    answer: "と",
    explanation: "と menghubungkan dua kata benda, seperti ayah dan ibu.",
  },
  {
    prompt: "Ungkapan manakah yang berarti “adik perempuan saya”?",
    options: ["妹", "姉", "兄"],
    answer: "妹",
    explanation: "妹 dibaca imouto dan berarti adik perempuan.",
  },
  {
    prompt: "Seorang tokoh fiktif berusia 20 tahun. Bagaimana menyebut usianya?",
    options: ["二十歳（はたち）", "二十歳（にじゅっさい）", "二十日（はつか）"],
    answer: "二十歳（はたち）",
    explanation: "Usia 20 tahun memiliki bacaan khusus, yaitu はたち (hatachi).",
  },
  {
    prompt: "Kamu ingin bertanya tempat tinggal seseorang. Kalimat mana yang tepat?",
    options: ["どこに住んでいますか？", "何歳ですか？", "これ、だれですか？"],
    answer: "どこに住んでいますか？",
    explanation: "Pilih pertanyaan yang menanyakan lokasi tempat tinggal.",
  },
  {
    prompt: "Kamu menjawab bahwa kamu tinggal di Nagoya. Pilih kalimat yang benar.",
    options: ["名古屋に住んでいます", "名古屋の住んでいます", "名古屋と住んでいます"],
    answer: "名古屋に住んでいます",
    explanation: "Gunakan partikel に setelah nama tempat untuk menyebut lokasi tinggal.",
  },
  {
    prompt: "Dalam sebuah foto, kamu ingin menyebut bahwa orang itu adalah ibumu. Pola mana yang tepat?",
    options: ["私の母です", "母と私ですか", "母に住んでいます"],
    answer: "私の母です",
    explanation: "の menghubungkan dua kata benda untuk menunjukkan hubungan atau kepemilikan.",
  },
  {
    prompt: "Ungkapan mana yang cocok untuk memperkenalkan hewan peliharaan bernama John?",
    options: ["ペットのジョンです", "ジョンに住んでいます", "ジョンは何歳ですか"],
    answer: "ペットのジョンです",
    explanation: "ペットのジョン berarti hewan peliharaan bernama John.",
  },
  {
    prompt: "Sebuah unggahan menampilkan sekelompok teman di tepi pantai. Apa topik utama unggahan itu?",
    options: ["Teman-teman di pantai", "Ulang tahun keluarga", "Foto hewan peliharaan"],
    answer: "Teman-teman di pantai",
    explanation: "Gunakan petunjuk gambar dan kalimat pendek untuk menemukan topik utama.",
  },
];

function renderJapaneseTerm(term: string) {
  switch (term) {
    case "妹":
      return <ruby>妹<rt>いもうと</rt></ruby>;
    case "姉":
      return <ruby>姉<rt>あね</rt></ruby>;
    case "兄":
      return <ruby>兄<rt>あに</rt></ruby>;
    case "二十歳（はたち）":
      return <><ruby>二十歳<rt>はたち</rt></ruby></>;
    case "二十歳（にじゅっさい）":
      return <><ruby>二十歳<rt>にじゅっさい</rt></ruby></>;
    case "二十日（はつか）":
      return <><ruby>二十日<rt>はつか</rt></ruby></>;
    case "どこに住んでいますか？":
      return <>どこに<ruby>住<rt>す</rt></ruby>んでいますか？</>;
    case "何歳ですか？":
      return <><ruby>何歳<rt>なんさい</rt></ruby>ですか？</>;
    case "名古屋に住んでいます":
      return <><ruby>名古屋<rt>なごや</rt></ruby>に<ruby>住<rt>す</rt></ruby>んでいます</>;
    case "名古屋の住んでいます":
    case "名古屋と住んでいます":
      return optionWithoutFurigana(term);
    case "私の母です":
      return <><ruby>私<rt>わたし</rt></ruby>の<ruby>母<rt>はは</rt></ruby>です</>;
    case "母と私ですか":
      return <><ruby>母<rt>はは</rt></ruby>と<ruby>私<rt>わたし</rt></ruby>ですか</>;
    case "母に住んでいます":
      return <><ruby>母<rt>はは</rt></ruby>に<ruby>住<rt>す</rt></ruby>んでいます</>;
    case "ジョンは何歳ですか":
      return <>ジョンは<ruby>何歳<rt>なんさい</rt></ruby>ですか</>;
    case "海":
      return <ruby>海<rt>うみ</rt></ruby>;
    default:
      return term;
  }
}

function optionWithoutFurigana(term: string) {
  if (term === "名古屋の住んでいます") {
    return <><ruby>名古屋<rt>なごや</rt></ruby>の<ruby>住<rt>す</rt></ruby>んでいます</>;
  }
  if (term === "名古屋と住んでいます") {
    return <><ruby>名古屋<rt>なごや</rt></ruby>と<ruby>住<rt>す</rt></ruby>んでいます</>;
  }
  return term;
}

export default function IrodoriStarterLessonFourPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const progress = useIrodoriProgress();
  const ratings = progress.selfEvaluations["starter-04"] ?? {};
  const isCompleted = progress.completedLessons.includes("starter-04");

  const answeredCount = Object.keys(answers).length;
  const score = quizQuestions.filter(
    (question, index) => answers[index] === question.answer
  ).length;

  const resetQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
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
          住
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">
            TOPIC 02 • ABOUT MYSELF
          </p>
          <p className="mt-5 text-sm font-semibold text-[#B9A98B]">
            Pelajaran 4
          </p>
          <h1 className="mt-1 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">
            I live in Tokyo.
          </h1>
          <p className="mt-2 font-mincho text-2xl text-[#D9B66D]">
            <ruby>東京<rt>とうきょう</rt></ruby>に<ruby>住<rt>す</rt></ruby>んでいます
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#B6B0A5]">
            Belajar memahami perkenalan keluarga, bertanya tentang usia dan
            tempat tinggal, membicarakan orang dalam foto, serta membaca
            unggahan singkat dengan bantuan gambar.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              4 target Can-do
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              3 dialog orisinal
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              8 latihan situasi
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
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C93438]/15 text-[#E46A6D]">
            <Users size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 01
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Mengenali anggota keluarga
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Saat seseorang memperkenalkan keluarganya, dengarkan kata yang
          digunakan untuk setiap anggota keluarga. Ungkapan 「A と B」 dapat
          menghubungkan dua anggota keluarga dalam satu kalimat.
        </p>
        <IrodoriConversation
          title="Scene A · Melihat foto keluarga"
          speakers={[IRODORI_SPEAKERS.sota, IRODORI_SPEAKERS.yui]}
          utterances={familyConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { jp: <ruby>父<rt>ちち</rt></ruby>, reading: "chichi", meaning: "Ayah saya" },
            { jp: <ruby>母<rt>はは</rt></ruby>, reading: "haha", meaning: "Ibu saya" },
            { jp: <ruby>兄<rt>あに</rt></ruby>, reading: "ani", meaning: "Kakak laki-laki saya" },
            { jp: <ruby>姉<rt>あね</rt></ruby>, reading: "ane", meaning: "Kakak perempuan saya" },
            { jp: <ruby>弟<rt>おとうと</rt></ruby>, reading: "otouto", meaning: "Adik laki-laki saya" },
            { jp: <ruby>妹<rt>いもうと</rt></ruby>, reading: "imouto", meaning: "Adik perempuan saya" },
            { jp: <ruby>夫<rt>おっと</rt></ruby>, reading: "otto", meaning: "Suami" },
            { jp: <ruby>妻<rt>つま</rt></ruby>, reading: "tsuma", meaning: "Istri" },
            { jp: <ruby>子ども<rt>こども</rt></ruby>, reading: "kodomo", meaning: "Anak" },
          ].map((item) => (
            <article
              key={item.reading}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <p className="font-mincho text-xl font-bold text-[#F1EBDD]">
                {item.jp}
              </p>
              <p className="mt-1 text-[10px] italic text-[#B8860B]">
                {item.reading}
              </p>
              <p className="mt-1 text-xs text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
        <p className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-3 text-xs leading-6 text-[#A9A398]">
          <span className="font-bold text-[#E7D2A1]">Catatan:</span>{" "}
          kata seperti <ruby>父<rt>ちち</rt></ruby> dan <ruby>母<rt>はは</rt></ruby> biasanya digunakan saat menyebut keluarga
          sendiri. Saat menyebut keluarga orang lain dengan sopan, kamu dapat
          mendengar お<ruby>父<rt>とう</rt></ruby>さん dan お<ruby>母<rt>かあ</rt></ruby>さん.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4D7198]/15 text-[#8CB0D8]">
            <MapPin size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 02
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Bertanya tentang usia dan tempat tinggal
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Dua pertanyaan sederhana yang sering muncul saat berbincang adalah
          <ruby>何歳<rt>なんさい</rt></ruby>ですか？ untuk menanyakan usia dan
          どこに<ruby>住<rt>す</rt></ruby>んでいますか？ untuk menanyakan tempat tinggal.
        </p>
        <IrodoriConversation
          title="Scene A · Usia dan tempat tinggal"
          speakers={[IRODORI_SPEAKERS.akiko, IRODORI_SPEAKERS.kenji]}
          utterances={ageResidenceConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-bold text-[#B8860B]">
              MENANYAKAN USIA
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              <ruby>何歳<rt>なんさい</rt></ruby>ですか？
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">
              Berapa usia Anda?
            </p>
            <p className="mt-3 font-mincho text-base text-[#E7D2A1]">
              おいくつですか？
            </p>
            <p className="mt-1 text-[10px] text-[#817A73]">
              Bentuk pertanyaan yang lebih sopan.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-bold text-[#B8860B]">
              MENANYAKAN TEMPAT TINGGAL
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              どこに<ruby>住<rt>す</rt></ruby>んでいますか？
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">
              Kamu tinggal di mana?
            </p>
            <p className="mt-3 font-mincho text-base text-[#E7D2A1]">
              <ruby>東京<rt>とうきょう</rt></ruby>に<ruby>住<rt>す</rt></ruby>んでいます。
            </p>
            <p className="mt-1 text-[10px] text-[#817A73]">
              Saya tinggal di Tokyo.
            </p>
          </article>
        </div>

        <div className="rounded-xl border border-[#B8860B]/20 bg-[#1B1A18] p-4">
          <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
            CARA MENYEBUT USIA
          </p>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">
            Beberapa angka memiliki bacaan khusus saat diikuti
            <ruby>歳<rt>さい</rt></ruby>. Perhatikan contoh berikut.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {ageExamples.map((item) => (
              <div
                key={item.age}
                className="rounded-lg border border-white/[0.06] bg-black/15 p-3"
              >
                <p className="font-mincho text-lg font-bold text-[#F1EBDD]">
                  {item.age === "20" ? (
                    <ruby>二十歳<rt>はたち</rt></ruby>
                  ) : (
                    <>{item.age}<ruby>歳<rt>さい</rt></ruby></>
                  )}
                </p>
                <p className="mt-1 text-[10px] text-[#D9B66D]">
                  {item.reading}
                </p>
                <p className="mt-0.5 text-[9px] italic text-[#817A73]">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-5 text-[#817A73]">
            Khusus untuk latihan, gunakan usia tokoh fiktif. Kamu tidak perlu
            membagikan usia atau informasi tempat tinggalmu yang sebenarnya.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#80619B]/15 text-[#B99AD8]">
            <Heart size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 03
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Bertanya tentang orang dalam foto
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Saat melihat foto bersama teman, kamu dapat bertanya 「これ、だれですか？」
          (Ini siapa?). Jawaban dapat menyebut hubungan orang tersebut dengan
          pemilik foto.
        </p>
        <IrodoriConversation
          title="Scene A · Melihat foto"
          speakers={[IRODORI_SPEAKERS.yui, IRODORI_SPEAKERS.sota]}
          utterances={photoConversation}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-2xl">👩</p>
            <p className="mt-2 font-mincho text-base text-[#E7D2A1]">
              <ruby>私<rt>わたし</rt></ruby>の<ruby>母<rt>はは</rt></ruby>です。
            </p>
            <p className="mt-1 text-[10px] text-[#A9A398]">Ini ibu saya.</p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-2xl">🧒</p>
            <p className="mt-2 font-mincho text-base text-[#E7D2A1]">
              <ruby>姉<rt>あね</rt></ruby>の<ruby>子<rt>こ</rt></ruby>どもです。
            </p>
            <p className="mt-1 text-[10px] text-[#A9A398]">Ini anak kakak perempuan saya.</p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-2xl">🐶</p>
            <p className="mt-2 font-mincho text-base text-[#E7D2A1]">
              ペットのジョンです。
            </p>
            <p className="mt-1 text-[10px] text-[#A9A398]">Ini John, hewan peliharaan saya.</p>
          </article>
        </div>
        <p className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-3 text-xs leading-6 text-[#A9A398]">
          <span className="font-bold text-[#E7D2A1]">Pola の:</span>{" "}
          私の母 berarti ibu saya, sedangkan 姉の子ども berarti anak kakak
          perempuan saya. Partikel の menunjukkan hubungan antara dua kata benda.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F8A67]/15 text-[#85C49A]">
            <MessageCircle size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              ACTIVITY 04
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Membaca unggahan singkat
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Baca kalimat pendek pada unggahan, lalu gunakan petunjuk ilustrasi
          untuk memahami topiknya. Tidak semua detail harus dimengerti untuk
          menangkap isi utama.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
            <div className="flex items-center gap-3 border-b border-white/[0.06] p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B8860B]/15 text-lg">🌸</span>
              <div>
                <p className="text-xs font-bold text-[#EAE6DD]">sakura_days</p>
                <p className="text-[9px] text-[#817A73]">Unggahan teman · 2 jam lalu</p>
              </div>
            </div>
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#3D5661] to-[#78908B] text-5xl">
              🌊 ☀️
            </div>
            <div className="p-4">
              <p className="font-mincho text-lg text-[#F1EBDD]">
                <ruby>友達<rt>ともだち</rt></ruby>と<ruby>海<rt>うみ</rt></ruby>！
              </p>
              <p className="mt-1 text-xs text-[#B6B0A5]">
                お<ruby>天気<rt>てんき</rt></ruby>、<ruby>最高<rt>さいこう</rt></ruby>！
              </p>
              <p className="mt-3 text-[10px] text-[#817A73]">
                Petunjuk ilustrasi: beberapa teman sedang berfoto di pantai.
              </p>
            </div>
          </article>
          <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
            <div className="flex items-center gap-3 border-b border-white/[0.06] p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B8860B]/15 text-lg">🐾</span>
              <div>
                <p className="text-xs font-bold text-[#EAE6DD]">ken_photo</p>
                <p className="text-[9px] text-[#817A73]">Unggahan teman · Kemarin</p>
              </div>
            </div>
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#5F6652] to-[#9E9A73] text-5xl">
              🐕 🌳
            </div>
            <div className="p-4">
              <p className="font-mincho text-lg text-[#F1EBDD]">
                ペットのポチです。
              </p>
              <p className="mt-1 text-xs text-[#B6B0A5]">
                かわいいですね！
              </p>
              <p className="mt-3 text-[10px] text-[#817A73]">
                Petunjuk ilustrasi: seekor anjing sedang duduk di taman.
              </p>
            </div>
          </article>
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-3 text-xs leading-6 text-[#A9A398]">
          <span className="font-bold text-[#E7D2A1]">Strategi membaca:</span>{" "}
          perhatikan nama akun, kata yang berulang, dan ilustrasi. Kata
          <ruby>海<rt>うみ</rt></ruby> berarti laut; ペット berarti hewan peliharaan.
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            PRAKTIK SITUASI
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Keluarga, usia, foto, dan unggahan
          </h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Jawab semua pertanyaan berdasarkan materi. Beberapa pilihan
            menampilkan kanji dengan furigana agar mudah dibaca.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {quizQuestions.map((question, index) => (
            <article
              key={question.prompt}
              className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <p className="text-[9px] font-black tracking-widest text-[#B8860B]">
                LATIHAN 0{index + 1}
              </p>
              <p className="mt-3 text-xs font-semibold leading-6 text-[#EAE6DD]">
                {question.prompt}
              </p>
              {question.term && (
                <p className="mt-3 rounded-lg border border-[#B8860B]/20 bg-black/15 px-3 py-2 text-center font-mincho text-xl text-[#E7D2A1] [&_rt]:text-[0.65em]">
                  {renderJapaneseTerm(question.term)}
                </p>
              )}
              <div className="mt-3 space-y-2">
                {question.options.map((option) => {
                  const selected = answers[index] === option;
                  const correct = option === question.answer;

                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        if (quizSubmitted) return;
                        setAnswers((current) => ({
                          ...current,
                          [index]: option,
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
                        {renderJapaneseTerm(option)}
                      </span>
                    </button>
                  );
                })}
              </div>
              {quizSubmitted && (
                <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                  {index === 0 ? (
                    <>
                      と adalah partikel yang menghubungkan kata benda dengan arti “dan”.
                    </>
                  ) : index === 1 ? (
                    <>
                      <ruby>妹<rt>いもうと</rt></ruby> berarti adik perempuan.
                    </>
                  ) : index === 2 ? (
                    <>
                      <ruby>二十歳<rt>はたち</rt></ruby> adalah bacaan khusus untuk usia 20 tahun.
                    </>
                  ) : index === 3 ? (
                    <>
                      どこに<ruby>住<rt>す</rt></ruby>んでいますか？ digunakan untuk menanyakan tempat tinggal.
                    </>
                  ) : index === 4 ? (
                    <>
                      Gunakan partikel に setelah nama tempat sebelum
                      <ruby>住<rt>す</rt></ruby>んでいます.
                    </>
                  ) : index === 5 ? (
                    <>
                      の menunjukkan hubungan antara dua kata benda.
                      <ruby>私<rt>わたし</rt></ruby>の<ruby>母<rt>はは</rt></ruby> berarti ibu saya.
                    </>
                  ) : index === 6 ? (
                    <>
                      ペットのジョン berarti hewan peliharaan bernama John.
                    </>
                  ) : (
                    <>
                      <ruby>海<rt>うみ</rt></ruby> dibaca umi dan berarti laut.
                      Tulisan dan ilustrasi membantu memahami unggahan.
                    </>
                  )}
                </p>
              )}
            </article>
          ))}
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

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            KATA-KATA KANJI
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Empat kanji dari pelajaran ini
          </h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { jp: <ruby>父<rt>ちち</rt></ruby>, reading: "chichi", meaning: "Ayah saya" },
            { jp: <ruby>母<rt>はは</rt></ruby>, reading: "haha", meaning: "Ibu saya" },
            { jp: <><ruby>子<rt>こ</rt></ruby>ども</>, reading: "kodomo", meaning: "Anak" },
            { jp: <ruby>日本<rt>にほん</rt></ruby>, reading: "nihon", meaning: "Jepang" },
          ].map((item) => (
            <article
              key={item.reading}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
            >
              <p className="font-mincho text-2xl font-bold text-[#F1EBDD]">
                {item.jp}
              </p>
              <p className="mt-1 text-[10px] italic text-[#B8860B]">
                {item.reading}
              </p>
              <p className="mt-2 text-xs text-[#A9A398]">{item.meaning}</p>
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
            Kota, usia, dan foto keluarga
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Beberapa kota besar
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Jepang memiliki banyak kota. Contohnya <ruby>東京<rt>とうきょう</rt></ruby>{" "}
              (Tokyo), <ruby>大阪<rt>おおさか</rt></ruby> (Osaka),
              <ruby> 名古屋<rt>なごや</rt></ruby> (Nagoya), dan
              <ruby> 札幌<rt>さっぽろ</rt></ruby> (Sapporo).
              Gunakan nama kota setelah partikel に saat mengatakan tempat tinggal.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Menanyakan usia dengan sopan
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              <ruby>何歳<rt>なんさい</rt></ruby>ですか？ adalah pertanyaan umum.
              おいくつですか？ terdengar lebih sopan. Pertanyaan tentang usia
              bisa terasa pribadi, jadi perhatikan kedekatan dan situasinya.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4 sm:col-span-2">
            <h3 className="text-xs font-bold text-[#E7D2A1]">
              Membagikan foto
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Saat membagikan foto keluarga atau teman, perhatikan izin dan
              privasi orang yang ada di dalam foto. Dalam latihan ini, semua
              contoh tokoh dan unggahan adalah fiktif.
            </p>
          </article>
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
          Nilai kemampuanmu setelah mencoba dialog, foto, dan unggahan.
          ★☆☆ berarti sudah bisa tetapi masih perlu latihan, ★★☆ berarti
          sudah bisa, dan ★★★ berarti bisa dengan baik. Penilaian ini tersimpan
          khusus untuk Irodori, terpisah dari progres Minna no Nihongo dan JLPT.
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
                        saveIrodoriSelfEvaluation("starter-04", nextRatings);
                      }}
                      className={
                        "rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors " +
                        (selected
                          ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]"
                          : "border-white/[0.08] bg-[#24221F] text-[#A3A099] hover:border-white/20 hover:text-[#EAE6DD]")
                      }
                    >
                      {option.label}
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
              onClick={() => completeIrodoriLesson("starter-04")}
              disabled={
                !quizSubmitted ||
                canDos.some((canDo) => !ratings[canDo.id])
              }
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
        {!quizSubmitted && (
          <p className="mt-2 text-[10px] text-[#817A73]">
            Selesaikan kuis situasi dan isi keempat penilaian Can-do untuk
            menyelesaikan pelajaran.
          </p>
        )}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Materi dan dialog contoh disusun orisinal oleh Fude sebagai latihan
        komunikasi tingkat pemula.
      </p>
    </main>
  );
}
