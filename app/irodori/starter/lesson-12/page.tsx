"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  RefreshCw,
  Ticket,
} from "lucide-react";
import IrodoriConversation, { type IrodoriUtterance } from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import {
  completeIrodoriLesson,
  saveIrodoriSelfEvaluation,
  useIrodoriProgress,
} from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const noticeConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>この<ruby>案内<rt>あんない</rt></ruby>を<ruby>見<rt>み</rt></ruby>てください。<ruby>来週<rt>らいしゅう</rt></ruby>、イベントがあります。</>,
    romaji: "Kono annai o mite kudasai. Raishuu, ibento ga arimasu.",
    translation: "Tolong lihat pengumuman ini. Minggu depan ada acara.",
    audioFileName: "irodori-starter-12-a01-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>いつですか？</>,
    romaji: "Itsu desu ka?",
    translation: "Kapan acaranya?",
    audioFileName: "irodori-starter-12-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>5<ruby>月<rt>がつ</rt></ruby>17<ruby>日<rt>にち</rt></ruby>、<ruby>日曜日<rt>にちようび</rt></ruby>です。</>,
    romaji: "Gogatsu juushichinichi, nichiyoubi desu.",
    translation: "Tanggal 17 Mei, hari Minggu.",
    audioFileName: "irodori-starter-12-a01-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>どこですか？</>,
    romaji: "Doko desu ka?",
    translation: "Di mana tempatnya?",
    audioFileName: "irodori-starter-12-a01-l04.mp3",
  },
  {
    speakerId: "yui",
    japanese: <><ruby>青葉<rt>あおば</rt></ruby><ruby>公園<rt>こうえん</rt></ruby>です。<ruby>入場<rt>にゅうじょう</rt></ruby><ruby>無料<rt>むりょう</rt></ruby>ですよ。</>,
    romaji: "Aoba kouen desu. Nyuujou muryou desu yo.",
    translation: "Di Taman Aoba. Masuknya gratis.",
    audioFileName: "irodori-starter-12-a01-l05.mp3",
  },
];

const attendanceConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>ユイさん、<ruby>今週<rt>こんしゅう</rt></ruby>の<ruby>日曜日<rt>にちようび</rt></ruby>、<ruby>本<rt>ほん</rt></ruby>のイベントに<ruby>行<rt>い</rt></ruby>きますか？</>,
    romaji: "Yui-san, konshuu no nichiyoubi, hon no ibento ni ikimasu ka?",
    translation: "Yui, hari Minggu minggu ini kamu akan pergi ke acara buku?",
    audioFileName: "irodori-starter-12-a02-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>はい、<ruby>行<rt>い</rt></ruby>きます。とても<ruby>楽<rt>たの</rt></ruby>しみです。</>,
    romaji: "Hai, ikimasu. Totemo tanoshimi desu.",
    translation: "Ya, saya akan pergi. Saya sangat menantikannya.",
    audioFileName: "irodori-starter-12-a02-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>そうですか。わたしも<ruby>行<rt>い</rt></ruby>きます。</>,
    romaji: "Sou desu ka. Watashi mo ikimasu.",
    translation: "Begitu ya. Saya juga akan pergi.",
    audioFileName: "irodori-starter-12-a02-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>じゃあ、<ruby>会場<rt>かいじょう</rt></ruby>で<ruby>会<rt>あ</rt></ruby>いましょう。</>,
    romaji: "Jaa, kaijou de aimashou.",
    translation: "Kalau begitu, mari bertemu di lokasi acara.",
    audioFileName: "irodori-starter-12-a02-l04.mp3",
  },
];

const invitationConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>土曜日に、いっしょに<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>に<ruby>行<rt>い</rt></ruby>きませんか？</>,
    romaji: "Doyoubi ni, issho ni eiga o mi ni ikimasen ka?",
    translation: "Mau pergi menonton film bersama hari Sabtu?",
    audioFileName: "irodori-starter-12-a03-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>いいですね。<ruby>何時<rt>なんじ</rt></ruby>からですか？</>,
    romaji: "Ii desu ne. Nanji kara desu ka?",
    translation: "Boleh juga. Mulai pukul berapa?",
    audioFileName: "irodori-starter-12-a03-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>2<ruby>時<rt>じ</rt></ruby>からです。</>,
    romaji: "Niji kara desu.",
    translation: "Mulai pukul dua.",
    audioFileName: "irodori-starter-12-a03-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>はい、だいじょうぶです。いっしょに<ruby>行<rt>い</rt></ruby>きましょう。</>,
    romaji: "Hai, daijoubu desu. Issho ni ikimashou.",
    translation: "Ya, saya bisa. Ayo pergi bersama.",
    audioFileName: "irodori-starter-12-a03-l04.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>よかったです。じゃあ、<ruby>土曜日<rt>どようび</rt></ruby>に。</>,
    romaji: "Yokatta desu. Jaa, doyoubi ni.",
    translation: "Syukurlah. Kalau begitu, sampai hari Sabtu.",
    audioFileName: "irodori-starter-12-a03-l05.mp3",
  },
];

const messageConversation: IrodoriUtterance[] = [
  {
    speakerId: "kenji",
    japanese: <>アキコさんからメッセージです。「<ruby>明日<rt>あした</rt></ruby>、みんなで<ruby>公園<rt>こうえん</rt></ruby>に<ruby>行<rt>い</rt></ruby>きませんか？」</>,
    romaji: "Akiko-san kara messeeji desu. Ashita, minna de kouen ni ikimasen ka?",
    translation: "Ada pesan dari Akiko: “Besok, mau pergi ke taman bersama-sama?”",
    audioFileName: "irodori-starter-12-a04-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>いいですね。わたしも<ruby>行<rt>い</rt></ruby>きます。</>,
    romaji: "Ii desu ne. Watashi mo ikimasu.",
    translation: "Boleh juga. Saya ikut.",
    audioFileName: "irodori-starter-12-a04-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>もし<ruby>行<rt>い</rt></ruby>けないときは、どう<ruby>返事<rt>へんじ</rt></ruby>しますか？</>,
    romaji: "Moshi ikenai toki wa, dou henji shimasu ka?",
    translation: "Kalau tidak bisa pergi, bagaimana membalasnya?",
    audioFileName: "irodori-starter-12-a04-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>「ごめんなさい。<ruby>明日<rt>あした</rt></ruby>はちょっと……。また<ruby>今度<rt>こんど</rt></ruby>おねがいします。」</>,
    romaji: "Gomennasai. Ashita wa chotto... Mata kondo onegaishimasu.",
    translation: "“Maaf, besok agak sulit. Lain kali, ya.”",
    audioFileName: "irodori-starter-12-a04-l04.mp3",
  },
];

const canDos = [
  { id: "read-event-notice", text: "Membaca pengumuman acara dan menemukan informasi penting seperti tanggal, waktu, dan tempat." },
  { id: "ask-event-attendance", text: "Bertanya dan menjawab apakah seseorang akan pergi ke suatu acara." },
  { id: "invite-and-availability", text: "Mengajak seseorang melakukan kegiatan bersama dan menyampaikan apakah waktunya cocok." },
  { id: "reply-to-invitation", text: "Membaca undangan singkat dari teman dan menulis balasan yang sesuai." },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

const eventNotices = [
  {
    id: "book",
    title: "Pameran Buku Aoba",
    date: "5月17日（日）",
    reading: "Gogatsu juushichinichi · Nichiyoubi",
    time: "10.00–15.00",
    place: "青葉公園（Aoba Park）",
    fee: "入場無料 · Gratis",
    description: "Bazar buku dan kegiatan membaca",
  },
  {
    id: "film",
    title: "Hari Film Komunitas",
    date: "6月8日（月）",
    reading: "Rokugatsu youka · Getsuyoubi",
    time: "13.30–16.00",
    place: "中央ホール（Aula Chuo）",
    fee: "300円 · 300 yen",
    description: "Pemutaran film dan diskusi",
  },
  {
    id: "culture",
    title: "Festival Budaya",
    date: "7月19日（日）",
    reading: "Shichigatsu juukunichi · Nichiyoubi",
    time: "11.00–17.00",
    place: "みどり広場（Lapangan Midori）",
    fee: "入場無料 · Gratis",
    description: "Pameran seni, permainan, dan pertunjukan",
  },
];

const monthWords = [
  ["1月", "いちがつ", "ichigatsu"],
  ["2月", "にがつ", "nigatsu"],
  ["3月", "さんがつ", "sangatsu"],
  ["4月", "しがつ", "shigatsu"],
  ["5月", "ごがつ", "gogatsu"],
  ["6月", "ろくがつ", "rokugatsu"],
  ["7月", "しちがつ", "shichigatsu"],
  ["8月", "はちがつ", "hachigatsu"],
  ["9月", "くがつ", "kugatsu"],
  ["10月", "じゅうがつ", "juugatsu"],
  ["11月", "じゅういちがつ", "juuichigatsu"],
  ["12月", "じゅうにがつ", "juunigatsu"],
];

const dateWords = [
  ["1日", "ついたち", "tsuitachi"],
  ["2日", "ふつか", "futsuka"],
  ["3日", "みっか", "mikka"],
  ["4日", "よっか", "yokka"],
  ["5日", "いつか", "itsuka"],
  ["6日", "むいか", "muika"],
  ["7日", "なのか", "nanoka"],
  ["8日", "ようか", "youka"],
  ["9日", "ここのか", "kokonoka"],
  ["10日", "とおか", "tooka"],
  ["14日", "じゅうよっか", "juuyokka"],
  ["20日", "はつか", "hatsuka"],
  ["24日", "にじゅうよっか", "nijuyokka"],
];

type Task = {
  prompt: ReactNode;
  options: { key: string; label: ReactNode }[];
  answer: string;
  explanation: ReactNode;
};

const practiceTasks: Task[] = [
  {
    prompt: "Pada hari apa Pameran Buku Aoba diadakan?",
    options: [
      { key: "a", label: "Minggu, 17 Mei" },
      { key: "b", label: "Senin, 8 Juni" },
      { key: "c", label: "Minggu, 19 Juli" },
    ],
    answer: "a",
    explanation: <>Pada pengumuman pertama tertulis 「5<ruby>月<rt>がつ</rt></ruby>17<ruby>日<rt>にち</rt></ruby>（<ruby>日曜日<rt>にちようび</rt></ruby>）」.</>,
  },
  {
    prompt: "Di mana Hari Film Komunitas berlangsung?",
    options: [
      { key: "a", label: "Taman Aoba" },
      { key: "b", label: "Aula Chuo" },
      { key: "c", label: "Lapangan Midori" },
    ],
    answer: "b",
    explanation: <>Lokasinya tertulis 「<ruby>中央<rt>ちゅうおう</rt></ruby>ホール」.</>,
  },
  {
    prompt: "Berapa biaya masuk Festival Budaya?",
    options: [
      { key: "a", label: "Gratis" },
      { key: "b", label: "300 yen" },
      { key: "c", label: "500 yen" },
    ],
    answer: "a",
    explanation: <>「<ruby>入場<rt>にゅうじょう</rt></ruby><ruby>無料<rt>むりょう</rt></ruby>」 berarti masuk gratis.</>,
  },
  {
    prompt: "Akiko bertanya apakah Yui akan datang ke acara buku. Yui menjawab 「はい、行きます」. Apa artinya?",
    options: [
      { key: "a", label: "Ya, saya akan pergi." },
      { key: "b", label: "Tidak, saya tidak pergi." },
      { key: "c", label: "Saya belum tahu." },
    ],
    answer: "a",
    explanation: <>「はい、<ruby>行<rt>い</rt></ruby>きます」 menyatakan bahwa Yui akan datang.</>,
  },
  {
    prompt: "Apa arti 「まだわかりません」?",
    options: [
      { key: "a", label: "Tentu saja pergi." },
      { key: "b", label: "Belum tahu." },
      { key: "c", label: "Tidak tertarik." },
    ],
    answer: "b",
    explanation: <>まだわかりません berarti belum tahu atau belum bisa memastikan.</>,
  },
  {
    prompt: "Sota mengajak Akiko menonton film hari Sabtu. Akiko menjawab 「いいですね」. Bagaimana respons ini?",
    options: [
      { key: "a", label: "Menolak ajakan dengan tegas." },
      { key: "b", label: "Menerima atau menyambut ajakan." },
      { key: "c", label: "Menanyakan tempat tinggal." },
    ],
    answer: "b",
    explanation: <>「いいですね」 berarti “Boleh juga” atau “Kedengarannya bagus”.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: "Partikel apa yang menandai tanggal atau waktu suatu acara?",
    options: [
      { key: "a", label: "に" },
      { key: "b", label: "で" },
      { key: "c", label: "を" },
    ],
    answer: "a",
    explanation: <>Contoh: 「<ruby>日曜日<rt>にちようび</rt></ruby>に」 menunjukkan hari atau tanggal acara.</>,
  },
  {
    prompt: "Partikel apa yang menandai tempat berlangsungnya acara?",
    options: [
      { key: "a", label: "へ" },
      { key: "b", label: "で" },
      { key: "c", label: "が" },
    ],
    answer: "b",
    explanation: <>Contoh: 「<ruby>公園<rt>こうえん</rt></ruby>で」 berarti di taman sebagai tempat acara berlangsung.</>,
  },
  {
    prompt: "Apa arti 「明日、映画があります」?",
    options: [
      { key: "a", label: "Besok ada pemutaran film." },
      { key: "b", label: "Kemarin saya menonton film." },
      { key: "c", label: "Filmnya ada di mana?" },
    ],
    answer: "a",
    explanation: <>「<ruby>明日<rt>あした</rt></ruby>」 berarti besok dan 「あります」 menyatakan ada acara.</>,
  },
  {
    prompt: "Bagaimana menanyakan apakah seseorang akan pergi ke acara?",
    options: [
      { key: "a", label: <><ruby>イベント<rt></rt></ruby>に<ruby>行<rt>い</rt></ruby>きますか？</> },
      { key: "b", label: <>イベントをありますか？</> },
      { key: "c", label: <>イベントでしますか？</> },
    ],
    answer: "a",
    explanation: <>Gunakan pola 「Nに<ruby>行<rt>い</rt></ruby>きますか？」 untuk bertanya apakah seseorang pergi ke acara atau kegiatan tersebut.</>,
  },
  {
    prompt: "Bacaan yang benar untuk 「4月」 adalah…",
    options: [
      { key: "a", label: "よんがつ (yongatsu)" },
      { key: "b", label: "しがつ (shigatsu)" },
      { key: "c", label: "よがつ (yogatsu)" },
    ],
    answer: "b",
    explanation: <>Bulan April dibaca 「しがつ」, bukan よんがつ.</>,
  },
  {
    prompt: "Bacaan yang benar untuk 「20日」 adalah…",
    options: [
      { key: "a", label: "にじゅうにち (nijuu nichi)" },
      { key: "b", label: "はつか (hatsuka)" },
      { key: "c", label: "にじゅうよっか (nijuyokka)" },
    ],
    answer: "b",
    explanation: <>Tanggal 20 memiliki bacaan khusus yaitu 「はつか」.</>,
  },
  {
    prompt: "Apa fungsi 「V-ませんか？」?",
    options: [
      { key: "a", label: "Mengundang seseorang melakukan sesuatu bersama." },
      { key: "b", label: "Meminta informasi tempat." },
      { key: "c", label: "Menyatakan bahwa acara sudah selesai." },
    ],
    answer: "a",
    explanation: <>「<ruby>行<rt>い</rt></ruby>きませんか？」 adalah bentuk ajakan yang sopan.</>,
  },
  {
    prompt: "Apa arti 「また今度行きましょう」?",
    options: [
      { key: "a", label: "Ayo pergi lain kali." },
      { key: "b", label: "Jangan pergi lagi." },
      { key: "c", label: "Saya sudah pernah pergi." },
    ],
    answer: "a",
    explanation: <>「V-ましょう」 dapat menyatakan ajakan atau usulan untuk melakukan sesuatu bersama.</>,
  },
  {
    prompt: "Bentuk yang tepat untuk “pergi menonton film” adalah…",
    options: [
      { key: "a", label: <><ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>に<ruby>行<rt>い</rt></ruby>きます。</> },
      { key: "b", label: <><ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>ますに<ruby>行<rt>い</rt></ruby>きます。</> },
      { key: "c", label: <><ruby>映画<rt>えいが</rt></ruby>に<ruby>見<rt>み</rt></ruby>ます。</> },
    ],
    answer: "a",
    explanation: <>Hilangkan ます dari bentuk ます lalu tambahkan に: 「<ruby>見<rt>み</rt></ruby>ます」 menjadi 「<ruby>見<rt>み</rt></ruby>に<ruby>行<rt>い</rt></ruby>きます」.</>,
  },
  {
    prompt: "Teman mengajakmu pada hari yang tidak cocok. Balasan yang halus adalah…",
    options: [
      { key: "a", label: <>すみません。その<ruby>日<rt>ひ</rt></ruby>はちょっと……。</> },
      { key: "b", label: <>はい、<ruby>行<rt>い</rt></ruby>きます。</> },
      { key: "c", label: <>どこですか？</> },
    ],
    answer: "a",
    explanation: <>「その<ruby>日<rt>ひ</rt></ruby>はちょっと……」 adalah cara halus untuk menyatakan bahwa hari tersebut kurang cocok.</>,
  },
];

export default function IrodoriStarterLessonTwelvePage() {
  const progress = useIrodoriProgress();
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [noticeChoice, setNoticeChoice] = useState("book");
  const [noticeSubmitted, setNoticeSubmitted] = useState(false);
  const [replyChoice, setReplyChoice] = useState("accept");
  const [replySubmitted, setReplySubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const isCompleted = progress.completedLessons.includes("starter-12");
  const practiceScore = practiceTasks.filter((task, index) => practiceAnswers[index] === task.answer).length;
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;
  const score = quizQuestions.filter((question, index) => answers[index] === question.answer).length;
  const noticeIsCorrect = noticeSubmitted && noticeChoice === "book";
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
        <ArrowLeft size={15} /> Kembali ke Starter
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#79602F]/45 bg-gradient-to-br from-[#302319] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D6AD4F]/[0.07]">祭</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">IRODORI • STARTER A1 • LESSON 12</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Shall we go together?</h1>
          <p className="mt-2 text-sm font-semibold text-[#D9B66D]">いっしょに行きませんか？</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Membaca pengumuman acara, menanyakan siapa yang akan datang,
            mengajak teman melakukan kegiatan, dan membalas undangan dengan sopan.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["4 target Can-do", "4 dialog", "19 slot audio", "26 kosakata tanggal", "10 kuis"].map((item) => (
              <span key={item} className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">{item}</span>
            ))}
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">TARGET PELAJARAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Rencanakan kegiatan bersama</h2></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Membaca pengumuman", text: "Temukan tanggal, waktu, tempat, dan biaya masuk pada informasi acara." },
            { title: "Menanyakan kehadiran", text: "Gunakan 「行きますか？」 untuk bertanya apakah teman akan datang." },
            { title: "Mengajak teman", text: "Gunakan 「行きませんか？」 untuk mengajak dan 「行きましょう」 untuk menyepakati rencana." },
            { title: "Membalas undangan", text: "Terima ajakan dengan ramah atau sampaikan bahwa waktunya kurang cocok dengan ungkapan yang halus." },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <h3 className="text-xs font-bold text-[#E7D2A1]">{item.title}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">DIALOG</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dengarkan dan pahami percakapan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua tokoh, acara, tanggal, dan tempat dalam latihan ini bersifat fiktif. Slot audio disiapkan untuk rekaman Fude.</p></div>
        {[
          { title: "01 · Membaca pengumuman", desc: "Menemukan tanggal dan tempat acara dari sebuah pengumuman.", data: noticeConversation, speakers: [IRODORI_SPEAKERS.yui, IRODORI_SPEAKERS.kenji] },
          { title: "02 · Menanyakan kehadiran", desc: "Bertanya apakah teman akan datang ke sebuah acara.", data: attendanceConversation, speakers: [IRODORI_SPEAKERS.akiko, IRODORI_SPEAKERS.yui] },
          { title: "03 · Mengajak menonton film", desc: "Mengundang teman dan memastikan waktu yang cocok.", data: invitationConversation, speakers: [IRODORI_SPEAKERS.sota, IRODORI_SPEAKERS.akiko] },
          { title: "04 · Membalas pesan undangan", desc: "Memahami undangan dan memilih jawaban yang sesuai.", data: messageConversation, speakers: [IRODORI_SPEAKERS.kenji, IRODORI_SPEAKERS.yui] },
        ].map((item) => (
          <article key={item.title} className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
            <h3 className="text-sm font-bold text-[#E7D2A1]">{item.title}</h3>
            <p className="mt-1 text-xs text-[#8F897F]">{item.desc}</p>
            <div className="mt-3"><IrodoriConversation title={item.title} utterances={item.data} speakers={item.speakers} /></div>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">PENGUMUMAN ACARA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Cari informasi yang penting</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Baca setiap pengumuman fiktif. Perhatikan 日時 (tanggal dan waktu), 場所 (tempat), dan 入場料 (biaya masuk).</p></div>
        <div className="grid gap-3 md:grid-cols-3">
          {eventNotices.map((event, index) => (
            <article key={event.id} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
              <div className="border-b border-white/[0.07] bg-gradient-to-r from-[#302319] to-[#211C18] p-4">
                <p className="text-[9px] font-black tracking-[0.18em] text-[#D9B66D]">EVENT NOTICE 0{index + 1}</p>
                <h3 className="mt-2 text-sm font-bold text-[#F1EBDD]">{event.title}</h3>
                <p className="mt-1 text-[10px] text-[#A9A398]">{event.description}</p>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex gap-2"><CalendarDays size={15} className="mt-0.5 shrink-0 text-[#D9B66D]"/><div><p className="font-mincho text-sm text-[#EAE6DD]">{event.date}</p><p className="text-[9px] text-[#A9A398]">{event.reading}</p></div></div>
                <div className="flex gap-2"><Clock3 size={15} className="mt-0.5 shrink-0 text-[#D9B66D]"/><p className="text-xs text-[#C9C3B8]">{event.time}</p></div>
                <div className="flex gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-[#D9B66D]"/><p className="text-xs text-[#C9C3B8]">{event.place}</p></div>
                <div className="flex gap-2"><Ticket size={15} className="mt-0.5 shrink-0 text-[#D9B66D]"/><p className="text-xs text-[#C9C3B8]">{event.fee}</p></div>
              </div>
            </article>
          ))}
        </div>
        <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#EAE6DD]">Latihan membaca pengumuman</p>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">Acara mana yang berlangsung pada tanggal 17 Mei di Taman Aoba?</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {eventNotices.map((event) => (
              <button key={event.id} type="button" disabled={noticeSubmitted} aria-pressed={noticeChoice === event.id} onClick={() => setNoticeChoice(event.id)} className={"rounded-lg border px-3 py-2.5 text-left text-xs " + (noticeChoice === event.id ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}>{event.title}</button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] text-[#A9A398]">{noticeSubmitted ? noticeIsCorrect ? "Benar. Tanggalnya 5月17日 dan tempatnya 青葉公園." : "Belum tepat. Periksa kembali tanggal dan tempat pada setiap kartu." : "Pilih satu acara, lalu periksa jawaban."}</p>
            {noticeSubmitted ? (
              <button type="button" onClick={() => { setNoticeChoice("book"); setNoticeSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button>
            ) : (
              <button type="button" onClick={() => setNoticeSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-[10px] font-bold text-white">Periksa pengumuman</button>
            )}
          </div>
        </article>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KALENDER & TANGGAL</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membaca bulan dan tanggal</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Bacaan beberapa bulan dan tanggal tidak mengikuti pola angka biasa. Hafalkan bentuk khusus ini.</p></div>
        <article className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <h3 className="text-xs font-bold text-[#E7D2A1]">Bulan · ～月（がつ）</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {monthWords.map(([jp, kana, romaji]) => <div key={jp} className="rounded-lg border border-white/[0.06] bg-black/15 p-2.5"><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="text-[10px] text-[#D9B66D]">{kana}</p><p className="text-[9px] text-[#8F897F]">{romaji}</p></div>)}
          </div>
        </article>
        <article className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <h3 className="text-xs font-bold text-[#E7D2A1]">Tanggal · ～日（にち）</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {dateWords.map(([jp, kana, romaji]) => <div key={jp} className="rounded-lg border border-white/[0.06] bg-black/15 p-2.5"><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="text-[10px] text-[#D9B66D]">{kana}</p><p className="text-[9px] text-[#8F897F]">{romaji}</p></div>)}
          </div>
          <p className="mt-3 text-[10px] leading-5 text-[#8F897F]">Contoh: 4月 dibaca しがつ, 7月 dibaca しちがつ, dan 9月 dibaca くがつ. Tanggal 1–10, 14, 20, dan 24 memiliki bacaan khusus seperti di atas.</p>
        </article>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["今日", "きょう", "kyou", "Hari ini"],
            ["明日", "あした", "ashita", "Besok"],
            ["あさって", "あさって", "asatte", "Lusa"],
            ["今週", "こんしゅう", "konshuu", "Minggu ini"],
            ["来週", "らいしゅう", "raishuu", "Minggu depan"],
            ["今度", "こんど", "kondo", "Lain kali / kesempatan berikutnya"],
          ].map(([jp, kana, romaji, meaning]) => <article key={jp} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#211E1A] p-3"><div><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="text-[10px] text-[#D9B66D]">{kana} · {romaji}</p></div><p className="text-right text-xs text-[#A9A398]">{meaning}</p></article>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Informasi acara dan kegiatan</h2></div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["イベント", "ibento", "Acara"],
            ["案内", "あんない · annai", "Pengumuman / panduan"],
            ["日時", "にちじ · nichiji", "Tanggal dan waktu"],
            ["場所", "ばしょ · basho", "Tempat"],
            ["会場", "かいじょう · kaijou", "Lokasi acara"],
            ["入場料", "にゅうじょうりょう · nyuujouryou", "Biaya masuk"],
            ["無料", "むりょう · muryou", "Gratis"],
            ["夏祭り", "なつまつり · natsu matsuri", "Festival musim panas"],
            ["映画", "えいが · eiga", "Film"],
            ["交流会", "こうりゅうかい · kouryuukai", "Acara pertukaran / pertemuan"],
            ["広場", "ひろば · hiroba", "Lapangan"],
            ["ホール", "hooru", "Aula"],
            ["行きます", "いきます · ikimasu", "Pergi"],
            ["見に行きます", "みにいきます · mi ni ikimasu", "Pergi untuk menonton"],
            ["食べに行きます", "たべにいきます · tabe ni ikimasu", "Pergi untuk makan"],
            ["楽しみ", "たのしみ · tanoshimi", "Hal yang dinantikan"],
          ].map(([jp, reading, meaning]) => <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[10px] text-[#D9B66D]">{reading}</p><p className="mt-1 text-xs text-[#A9A398]">{meaning}</p></article>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Memberi informasi dan mengajak teman</h2></div>
        {[
          {
            title: "01 · Menyebut tanggal, tempat, dan acara",
            pattern: "【waktu】に【tempat】で【acara】があります",
            example: <><ruby>日曜日<rt>にちようび</rt></ruby>に、<ruby>公園<rt>こうえん</rt></ruby>で<ruby>本<rt>ほん</rt></ruby>のイベントがあります。</>,
            note: "に menandai tanggal atau waktu. で menandai tempat berlangsungnya acara. Kata seperti 明日, 今日, dan 来週 biasanya tidak memakai に.",
          },
          {
            title: "02 · Pergi ke sebuah acara",
            pattern: "N に 行きます",
            example: <><ruby>来週<rt>らいしゅう</rt></ruby>、<ruby>映画<rt>えいが</rt></ruby>に<ruby>行<rt>い</rt></ruby>きます。</>,
            note: "に setelah kata benda seperti 映画, パーティー, atau 試合 menunjukkan tujuan kegiatan bersama kata kerja 行きます.",
          },
          {
            title: "03 · Mengajak seseorang",
            pattern: "V-ませんか？",
            example: <>いっしょに<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>に<ruby>行<rt>い</rt></ruby>きませんか？</>,
            note: "Ubah akhiran ます pada kata kerja bentuk ます menjadi ませんか？ untuk mengundang seseorang dengan sopan.",
          },
          {
            title: "04 · Menyepakati atau mengusulkan",
            pattern: "V-ましょう",
            example: <>はい。いっしょに<ruby>行<rt>い</rt></ruby>きましょう。</>,
            note: "ましょう digunakan untuk mengajak melakukan sesuatu bersama atau menyepakati rencana. 「また今度行きましょう」 berarti ayo pergi lain kali.",
          },
          {
            title: "05 · Menyatakan tujuan pergi dengan kata kerja",
            pattern: "V-ます（buang ます）+ に行きます",
            example: <><ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>に<ruby>行<rt>い</rt></ruby>きます。／ごはんを<ruby>食<rt>た</rt></ruby>べに<ruby>行<rt>い</rt></ruby>きます。</>,
            note: "Ambil bentuk ます, hilangkan ます, lalu tambahkan に行きます: 見ます → 見に行きます, 食べます → 食べに行きます.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">{item.title}</p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]">{item.pattern}</p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#D9B66D]">{item.example}</p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pahami pengumuman dan percakapan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan berdasarkan pengumuman, tanggal, dan dialog.</p></div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">PRACTICE {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">{task.prompt}</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {task.options.map((option) => (
                    <button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected === option.key} onClick={() => setPracticeAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (practiceSubmitted && option.key === task.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : practiceSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}>{option.label}</button>
                  ))}
                </div>
                {practiceSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>{task.explanation}</p>}
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
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI BALASAN UNDANGAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Balas pesan teman dengan sopan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Baca undangan singkat fiktif, kemudian pilih balasan yang cocok.</p></div>
        <div className="mx-auto max-w-lg space-y-3 rounded-2xl border border-white/[0.08] bg-[#1B1A18] p-4">
          <div className="flex items-center gap-3 border-b border-white/[0.07] pb-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#567B8A]/20 text-sm font-bold text-[#B8D4DD]">A</div>
            <div><p className="text-xs font-bold text-[#F1EBDD]">Akiko · Teman</p><p className="text-[9px] text-[#8F897F]">Pesan simulasi</p></div>
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#302D29] p-3">
            <p className="text-xs leading-6 text-[#EAE6DD]"><ruby>明日<rt>あした</rt></ruby>、みんなで<ruby>公園<rt>こうえん</rt></ruby>に<ruby>行<rt>い</rt></ruby>きませんか？</p>
            <p className="mt-1 text-[9px] text-[#8F897F]">Besok, mau pergi ke taman bersama-sama?</p>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-[#4B563B]/40 p-3">
              <p className="text-[9px] font-bold text-[#B7D19A]">Pilih balasan</p>
              <div className="mt-2 space-y-2">
                {[
                  { key: "accept", jp: "いいですね。行きます！", meaning: "Boleh juga. Saya ikut!" },
                  { key: "decline", jp: "ごめんなさい。明日はちょっと……。", meaning: "Maaf, besok agak sulit." },
                ].map((item) => (
                  <button key={item.key} type="button" disabled={replySubmitted} aria-pressed={replyChoice === item.key} onClick={() => setReplyChoice(item.key)} className={"block w-full rounded-lg border p-2.5 text-left " + (replyChoice === item.key ? "border-[#B7D19A]/60 bg-[#B7D19A]/10" : "border-white/[0.07] bg-black/10")}>
                    <p className="font-mincho text-xs text-[#F1EBDD]">{item.jp}</p>
                    <p className="mt-1 text-[9px] text-[#A9A398]">{item.meaning}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-3">
            <p className="text-[10px] text-[#A9A398]">{replySubmitted ? "Balasan sudah dipilih. Kedua pilihan merupakan respons yang wajar: menerima atau menolak dengan halus." : "Kedua pilihan dapat digunakan sesuai ketersediaan waktumu."}</p>
            {replySubmitted ? <button type="button" onClick={() => setReplySubmitted(false)} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" onClick={() => setReplySubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-[10px] font-bold text-white">Kirim balasan</button>}
          </div>
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
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">QUESTION {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">{question.prompt}</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {question.options.map((option) => (
                    <button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected === option.key} onClick={() => setAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (quizSubmitted && option.key === question.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : quizSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}>{option.label}</button>
                  ))}
                </div>
                {quizSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>{question.explanation}</p>}
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
        <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#D9B66D]"/><p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">CAN-DO CHECK</p></div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Nilai empat kemampuan setelah menyelesaikan latihan. Progres tersimpan terpisah dari Minna no Nihongo dan JLPT.</p>
        <div className="mt-4 space-y-3">
          {canDos.map((item,index)=><div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3"><p className="text-xs font-semibold leading-5 text-[#EAE6DD]"><span className="mr-2 text-[#D9B66D]">0{index+1}</span>{item.text}</p><div className="mt-3 flex flex-wrap gap-2">{ratingOptions.map((option)=><button key={option.value} type="button" aria-pressed={ratings[item.id]===option.value} onClick={()=>{const next={...ratings,[item.id]:option.value};setRatings(next);saveIrodoriSelfEvaluation("starter-12",next);}} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors "+(ratings[item.id]===option.value?"border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]":"border-white/[0.08] bg-[#24221F] text-[#A3A099]")}>{option.label}</button>)}</div></div>)}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {isCompleted ? <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/>Pelajaran selesai</span> : <button type="button" onClick={()=>completeIrodoriLesson("starter-12")} disabled={!quizSubmitted||!practiceIsCorrect||!noticeIsCorrect||!replySubmitted||!canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#C93438] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/>Tandai pelajaran selesai</button>}
          <Link href="/irodori/starter" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
        </div>
        {(!quizSubmitted||!practiceIsCorrect||!noticeIsCorrect||!replySubmitted||!canDosRated)&&<p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, periksa satu pengumuman dengan tepat, kirim balasan undangan, lalu isi keempat penilaian Can-do.</p>}
      </section>
      <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, pengumuman, tanggal, dan tempat disusun orisinal oleh Fude. Semua acara dan tokoh dalam latihan bersifat fiktif.</p>
    </main>
  );
}
