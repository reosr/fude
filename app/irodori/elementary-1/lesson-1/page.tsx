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
const lessonId = "elementary1-01";

const greetingConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>あ、<ruby>久<rt>ひさ</rt></ruby>しぶりです。お<ruby>元気<rt>げんき</rt></ruby>ですか？</>,
    romaji: "A, hisashiburi desu. Ogenki desu ka?",
    translation: "Ah, sudah lama tidak bertemu. Apa kabar?",
    audioFileName: "irodori-elementary1-01-a01-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>はい、<ruby>元気<rt>げんき</rt></ruby>です。ユイさんもお<ruby>元気<rt>げんき</rt></ruby>ですか？</>,
    romaji: "Hai, genki desu. Yui-san mo ogenki desu ka?",
    translation: "Ya, saya baik. Yui juga apa kabar?",
    audioFileName: "irodori-elementary1-01-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>はい、おかげさまで。</>,
    romaji: "Hai, okagesama de.",
    translation: "Ya, berkat doa semuanya saya baik.",
    audioFileName: "irodori-elementary1-01-a01-l03.mp3",
  },
];

const casualGreetingConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>あ、<ruby>久<rt>ひさ</rt></ruby>しぶり！</>,
    romaji: "A, hisashiburi!",
    translation: "Eh, sudah lama tidak bertemu!",
    audioFileName: "irodori-elementary1-01-a02-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>ああ、<ruby>久<rt>ひさ</rt></ruby>しぶり。<ruby>元気<rt>げんき</rt></ruby>？</>,
    romaji: "Aa, hisashiburi. Genki?",
    translation: "Iya, sudah lama. Apa kabar?",
    audioFileName: "irodori-elementary1-01-a02-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>うん、<ruby>元気<rt>げんき</rt></ruby>だよ。</>,
    romaji: "Un, genki da yo.",
    translation: "Iya, aku baik.",
    audioFileName: "irodori-elementary1-01-a02-l03.mp3",
  },
];

const recentLifeConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>ソウタさん、<ruby>日本<rt>にほん</rt></ruby>に<ruby>来<rt>き</rt></ruby>て、どのぐらいになりますか？</>,
    romaji: "Souta-san, Nihon ni kite, dono gurai ni narimasu ka?",
    translation: "Sota, sudah berapa lama sejak datang ke Jepang?",
    audioFileName: "irodori-elementary1-01-a03-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>ちょうど<ruby>一年<rt>いちねん</rt></ruby>になります。</>,
    romaji: "Choudo ichinen ni narimasu.",
    translation: "Tepat satu tahun.",
    audioFileName: "irodori-elementary1-01-a03-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>そうですか。<ruby>日本<rt>にほん</rt></ruby>の<ruby>生活<rt>せいかつ</rt></ruby>に<ruby>慣<rt>な</rt></ruby>れましたか？</>,
    romaji: "Sou desu ka. Nihon no seikatsu ni naremashita ka?",
    translation: "Begitu, ya. Apakah sudah terbiasa dengan kehidupan di Jepang?",
    audioFileName: "irodori-elementary1-01-a03-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい、だいぶ<ruby>慣<rt>な</rt></ruby>れました。</>,
    romaji: "Hai, daibu naremashita.",
    translation: "Ya, sekarang sudah cukup terbiasa.",
    audioFileName: "irodori-elementary1-01-a03-l04.mp3",
  },
];

const arrivalConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>アキコさんは、いつ<ruby>日本<rt>にほん</rt></ruby>に<ruby>来<rt>き</rt></ruby>ましたか？</>,
    romaji: "Akiko-san wa, itsu Nihon ni kimashita ka?",
    translation: "Akiko, kapan datang ke Jepang?",
    audioFileName: "irodori-elementary1-01-a04-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <><ruby>去年<rt>きょねん</rt></ruby>の<ruby>四月<rt>しがつ</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。</>,
    romaji: "Kyonen no shigatsu ni kimashita.",
    translation: "Saya datang pada bulan April tahun lalu.",
    audioFileName: "irodori-elementary1-01-a04-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>そうですか。もう<ruby>慣<rt>な</rt></ruby>れましたか？</>,
    romaji: "Sou desu ka. Mou naremashita ka?",
    translation: "Begitu, ya. Apakah sudah terbiasa?",
    audioFileName: "irodori-elementary1-01-a04-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>はい、なんとか。</>,
    romaji: "Hai, nantoka.",
    translation: "Ya, sedikit demi sedikit.",
    audioFileName: "irodori-elementary1-01-a04-l04.mp3",
  },
];

const activityConversation: IrodoriUtterance[] = [
  {
    speakerId: "kenji",
    japanese: <>ユイさん、<ruby>日本<rt>にほん</rt></ruby>では<ruby>何<rt>なに</rt></ruby>をしていますか？</>,
    romaji: "Yui-san, Nihon dewa nani o shite imasu ka?",
    translation: "Yui, sekarang melakukan kegiatan apa di Jepang?",
    audioFileName: "irodori-elementary1-01-a05-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>レストランで<ruby>働<rt>はたら</rt></ruby>いています。</>,
    romaji: "Resutoran de hataraite imasu.",
    translation: "Saya bekerja di restoran.",
    audioFileName: "irodori-elementary1-01-a05-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>そうですか。<ruby>仕事<rt>しごと</rt></ruby>はどうですか？</>,
    romaji: "Sou desu ka. Shigoto wa dou desu ka?",
    translation: "Begitu, ya. Bagaimana pekerjaannya?",
    audioFileName: "irodori-elementary1-01-a05-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>とても<ruby>忙<rt>いそが</rt></ruby>しいです。でも、みんな<ruby>親切<rt>しんせつ</rt></ruby>です。</>,
    romaji: "Totemo isogashii desu. Demo, minna shinsetsu desu.",
    translation: "Sangat sibuk. Tetapi, semua orang baik hati.",
    audioFileName: "irodori-elementary1-01-a05-l04.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>それはよかったですね。</>,
    romaji: "Sore wa yokatta desu ne.",
    translation: "Syukurlah kalau begitu.",
    audioFileName: "irodori-elementary1-01-a05-l05.mp3",
  },
];

const canDos = [
  { id: "greet-after-time", text: "Menyapa seseorang yang sudah lama tidak ditemui dengan ungkapan yang sesuai." },
  { id: "share-recent-condition", text: "Menceritakan keadaan atau kabar terkini secara sederhana ketika ditanya orang yang dikenal." },
  { id: "describe-work-activity", text: "Menjelaskan secara sederhana kegiatan atau pekerjaan yang dilakukan di Jepang." },
  { id: "ask-duration", text: "Menanyakan dan menjawab berapa lama seseorang sudah tinggal di suatu tempat." },
  { id: "share-impression", text: "Menyampaikan kesan sederhana tentang kegiatan atau pekerjaan sehari-hari." },
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

const practiceTasks: Task[] = [
  {
    prompt: <>Ungkapan sopan untuk menyapa orang yang lama tidak ditemui adalah …</>,
    options: [
      { key: "a", label: "お久しぶりです。" },
      { key: "b", label: "おやすみなさい。" },
      { key: "c", label: "いただきます。" },
    ],
    answer: "a",
    explanation: <>お<ruby>久<rt>ひさ</rt></ruby>しぶりです adalah sapaan sopan saat bertemu kembali setelah cukup lama.</>,
  },
  {
    prompt: <>Kalimat 「元気？」 paling sesuai digunakan kepada …</>,
    options: [
      { key: "a", label: "Teman dekat." },
      { key: "b", label: "Orang yang baru dikenal dalam situasi resmi." },
      { key: "c", label: "Petugas yang belum dikenal." },
    ],
    answer: "a",
    explanation: <>元気？ merupakan bentuk kasual. Untuk orang yang belum dekat, gunakan お<ruby>元気<rt>げんき</rt></ruby>ですか？</>,
  },
  {
    prompt: <>Apa arti 「ちょうど一年になります」?</>,
    options: [
      { key: "a", label: "Sudah tepat satu tahun." },
      { key: "b", label: "Akan datang tahun depan." },
      { key: "c", label: "Satu tahun yang lalu." },
    ],
    answer: "a",
    explanation: <>一年になります menyatakan bahwa durasi waktu yang disebutkan sudah tercapai.</>,
  },
  {
    prompt: <>Pilih ungkapan yang benar untuk “Saya datang bulan lalu.”</>,
    options: [
      { key: "a", label: <>先月に<ruby>来<rt>き</rt></ruby>ました。</> },
      { key: "b", label: <>先月、<ruby>来<rt>き</rt></ruby>ました。</> },
      { key: "c", label: <>先月を<ruby>来<rt>き</rt></ruby>ました。</> },
    ],
    answer: "b",
    explanation: <>先月 dan 去年 adalah kata waktu yang tidak memerlukan partikel に pada pola ini.</>,
  },
  {
    prompt: <>Pilih bentuk ～ています dari 「働きます」.</>,
    options: [
      { key: "a", label: "働いています" },
      { key: "b", label: "働きています" },
      { key: "c", label: "働いてあります" },
    ],
    answer: "a",
    explanation: <><ruby>働<rt>はたら</rt></ruby>きます berubah menjadi bentuk て, yaitu <ruby>働<rt>はたら</rt></ruby>いて, lalu diikuti います.</>,
  },
  {
    prompt: <>Kalimat 「忙しいです。でも、楽しいです。」 menunjukkan …</>,
    options: [
      { key: "a", label: "Urutan waktu." },
      { key: "b", label: "Dua keadaan yang kontras." },
      { key: "c", label: "Tempat tujuan." },
    ],
    answer: "b",
    explanation: <>でも berarti “tetapi” dan menghubungkan dua informasi yang memiliki kontras.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Sapaan 「お久しぶりです」 digunakan ketika …</>,
    options: [
      { key: "a", label: "Bertemu seseorang setelah lama tidak bertemu." },
      { key: "b", label: "Akan tidur." },
      { key: "c", label: "Memulai makan." },
    ],
    answer: "a",
    explanation: <>Ungkapan ini digunakan saat bertemu kembali setelah cukup lama.</>,
  },
  {
    prompt: <>Mana pasangan yang menunjukkan bentuk sopan dan kasual?</>,
    options: [
      { key: "a", label: "お元気ですか？ ／ 元気？" },
      { key: "b", label: "おはようございます ／ さようなら" },
      { key: "c", label: "ありがとう ／ いただきます" },
    ],
    answer: "a",
    explanation: <>お<ruby>元気<rt>げんき</rt></ruby>ですか adalah bentuk sopan, sedangkan 元気？ adalah bentuk kasual.</>,
  },
  {
    prompt: <>Lengkapi: 「日本に来て、どのぐらい ___ か？」</>,
    options: [
      { key: "a", label: "なります" },
      { key: "b", label: "あります" },
      { key: "c", label: "します" },
    ],
    answer: "a",
    explanation: <>どのぐらいになりますか menanyakan durasi waktu yang telah berlalu.</>,
  },
  {
    prompt: <>Bagaimana mengatakan “Sudah enam bulan”?</>,
    options: [
      { key: "a", label: "六か月になります。" },
      { key: "b", label: "六か月に来ました。" },
      { key: "c", label: "六か月をいます。" },
    ],
    answer: "a",
    explanation: <>Durasi dapat dinyatakan dengan ～か月になります.</>,
  },
  {
    prompt: <>Pilih kalimat yang benar untuk “Saya datang tahun lalu.”</>,
    options: [
      { key: "a", label: <>去年に<ruby>来<rt>き</rt></ruby>ました。</> },
      { key: "b", label: <><ruby>去年<rt>きょねん</rt></ruby>、<ruby>来<rt>き</rt></ruby>ました。</> },
      { key: "c", label: <>去年で<ruby>来<rt>き</rt></ruby>ました。</> },
    ],
    answer: "b",
    explanation: <>去年 tidak diikuti に pada ungkapan waktu lampau seperti contoh ini.</>,
  },
  {
    prompt: <>Apa arti 「日本語学校に通っています」?</>,
    options: [
      { key: "a", label: "Saya bersekolah di sekolah bahasa Jepang." },
      { key: "b", label: "Saya sudah lulus sekolah bahasa Jepang." },
      { key: "c", label: "Saya akan membuka sekolah bahasa Jepang." },
    ],
    answer: "a",
    explanation: <>通っています menyatakan kegiatan yang sedang menjadi rutinitas atau keadaan saat ini.</>,
  },
  {
    prompt: <>Bentuk ～ています dari 「勉強します」 adalah …</>,
    options: [
      { key: "a", label: "勉強していました" },
      { key: "b", label: "勉強しています" },
      { key: "c", label: "勉強しっています" },
    ],
    answer: "b",
    explanation: <>します berubah menjadi して, kemudian ditambah います.</>,
  },
  {
    prompt: <>Pertanyaan 「仕事はどうですか？」 menanyakan …</>,
    options: [
      { key: "a", label: "Bagaimana pekerjaannya?" },
      { key: "b", label: "Di mana tempat kerjanya?" },
      { key: "c", label: "Kapan mulai bekerja?" },
    ],
    answer: "a",
    explanation: <>どうですか menanyakan keadaan atau kesan tentang sesuatu.</>,
  },
  {
    prompt: <>Pilih tanggapan yang menyatakan kontras dengan alami.</>,
    options: [
      { key: "a", label: "忙しいです。でも、楽しいです。" },
      { key: "b", label: "忙しいです。それから、楽しいです。" },
      { key: "c", label: "忙しいです。どこですか？" },
    ],
    answer: "a",
    explanation: <>でも menghubungkan dua informasi yang kontras: sibuk, tetapi menyenangkan.</>,
  },
  {
    prompt: <>Apa informasi yang sesuai saat seseorang bertanya tentang keadaan terkini?</>,
    options: [
      { key: "a", label: "Kabar, kegiatan, atau keadaan sehari-hari." },
      { key: "b", label: "Hanya nomor telepon orang lain." },
      { key: "c", label: "Daftar kata tanpa konteks." },
    ],
    answer: "a",
    explanation: <>Kita bisa menjawab dengan kabar, kegiatan yang dilakukan, dan kesan sederhana.</>,
  },
];

const simulations = [
  {
    title: "01 · Memilih sapaan",
    heading: "Bertemu kembali dengan kenalan",
    prompt: "Yui bertemu kembali dengan seseorang yang belum terlalu dekat setelah beberapa bulan.",
    japanese: <>お<ruby>久<rt>ひさ</rt></ruby>しぶりですね。</>,
    translation: "Sudah lama tidak bertemu.",
    options: [
      { key: "polite", label: "お久しぶりです。お元気ですか？", meaning: "Sapaan sopan." },
      { key: "casual", label: "久しぶり！元気？", meaning: "Sapaan kasual untuk teman dekat." },
      { key: "sleep", label: "おやすみなさい。", meaning: "Ucapan sebelum tidur." },
    ],
    answer: "polite",
    explanation: "Karena lawan bicara belum terlalu dekat, bentuk sopan lebih sesuai.",
  },
  {
    title: "02 · Menjawab durasi",
    heading: "Sudah berapa lama?",
    prompt: "Akiko bertanya berapa lama Sota sudah tinggal di Jepang. Sota sudah tinggal tepat enam bulan.",
    japanese: <>日本に<ruby>来<rt>き</rt></ruby>て、どのぐらいになりますか？</>,
    translation: "Sudah berapa lama sejak datang ke Jepang?",
    options: [
      { key: "duration", label: "ちょうど半年です。", meaning: "Tepat enam bulan." },
      { key: "arrival", label: "先月、来ました。", meaning: "Saya datang bulan lalu." },
      { key: "work", label: "レストランで働いています。", meaning: "Saya bekerja di restoran." },
    ],
    answer: "duration",
    explanation: "半年 adalah durasi enam bulan. Bentuk になります juga bisa digunakan untuk menyatakan durasi.",
  },
  {
    title: "03 · Menyebut waktu lampau",
    heading: "Kapan datang?",
    prompt: "Yui ingin mengatakan bahwa ia datang ke Jepang tahun lalu.",
    japanese: <>いつ<ruby>日本<rt>にほん</rt></ruby>に<ruby>来<rt>き</rt></ruby>ましたか？</>,
    translation: "Kapan datang ke Jepang?",
    options: [
      { key: "lastyear", label: "去年、来ました。", meaning: "Saya datang tahun lalu." },
      { key: "wrongparticle", label: "去年に来ました。", meaning: "Partikel に tidak diperlukan pada contoh ini." },
      { key: "future", label: "来年、来ます。", meaning: "Saya akan datang tahun depan." },
    ],
    answer: "lastyear",
    explanation: "去年 tidak memerlukan partikel に pada pola waktu lampau ini.",
  },
  {
    title: "04 · Menjelaskan kegiatan",
    heading: "Apa yang dilakukan sekarang?",
    prompt: "Sota menjelaskan bahwa sekarang ia belajar bahasa Jepang di sekolah bahasa.",
    japanese: <>日本では、<ruby>何<rt>なに</rt></ruby>をしていますか？</>,
    translation: "Sekarang melakukan kegiatan apa di Jepang?",
    options: [
      { key: "teiru", label: "日本語学校に通っています。", meaning: "Saya bersekolah di sekolah bahasa Jepang." },
      { key: "past", label: "日本語学校に通いました。", meaning: "Saya pernah bersekolah di sekolah bahasa Jepang." },
      { key: "place", label: "日本語学校はどこですか？", meaning: "Sekolah bahasa Jepangnya di mana?" },
    ],
    answer: "teiru",
    explanation: "V-ています dapat menjelaskan keadaan atau kegiatan yang berlangsung sebagai rutinitas saat ini.",
  },
  {
    title: "05 · Menyampaikan kesan",
    heading: "Bagaimana pekerjaannya?",
    prompt: "Yui mengatakan bahwa pekerjaannya sibuk, tetapi rekan-rekannya baik hati.",
    japanese: <><ruby>仕事<rt>しごと</rt></ruby>はどうですか？</>,
    translation: "Bagaimana pekerjaannya?",
    options: [
      { key: "impression", label: "忙しいです。でも、みんな親切です。", meaning: "Sibuk, tetapi semua orang baik hati." },
      { key: "sequence", label: "忙しいです。それから、駅です。", meaning: "Tidak sesuai konteks." },
      { key: "question", label: "どこで働いていますか？", meaning: "Di mana bekerja?" },
    ],
    answer: "impression",
    explanation: "でも digunakan untuk menghubungkan dua informasi yang kontras.",
  },
];

const vocabulary = [
  ["久しぶり", "ひさしぶり · hisashiburi", "Sudah lama tidak bertemu"],
  ["お元気", "おげんき · ogenki", "Kabar / keadaan sehat (sopan)"],
  ["最近", "さいきん · saikin", "Akhir-akhir ini"],
  ["生活", "せいかつ · seikatsu", "Kehidupan"],
  ["慣れる", "なれる · nareru", "Menjadi terbiasa"],
  ["去年", "きょねん · kyonen", "Tahun lalu"],
  ["先月", "せんげつ · sengetsu", "Bulan lalu"],
  ["先週", "せんしゅう · senshuu", "Minggu lalu"],
  ["半年", "はんとし · hantoshi", "Setengah tahun"],
  ["一年", "いちねん · ichinen", "Satu tahun"],
  ["仕事", "しごと · shigoto", "Pekerjaan"],
  ["働く", "はたらく · hataraku", "Bekerja"],
  ["学校に通う", "がっこうにかよう", "Bersekolah / rutin pergi ke sekolah"],
  ["勉強する", "べんきょうする", "Belajar"],
  ["毎日", "まいにち · mainichi", "Setiap hari"],
  ["忙しい", "いそがしい · isogashii", "Sibuk"],
  ["親切", "しんせつ · shinsetsu", "Baik hati"],
  ["楽しい", "たのしい · tanoshii", "Menyenangkan"],
];

const kanjiWords = [
  ["元気", "げんき · genki", "Sehat / baik"],
  ["去年", "きょねん · kyonen", "Tahun lalu"],
  ["生活", "せいかつ · seikatsu", "Kehidupan"],
  ["学校", "がっこう · gakkou", "Sekolah"],
  ["学生", "がくせい · gakusei", "Pelajar"],
  ["仕事", "しごと · shigoto", "Pekerjaan"],
  ["働く", "はたらく · hataraku", "Bekerja"],
  ["先週", "せんしゅう · senshuu", "Minggu lalu"],
  ["忙しい", "いそがしい · isogashii", "Sibuk"],
  ["作る", "つくる · tsukuru", "Membuat"],
];

export default function IrodoriElementaryOneLessonOnePage() {
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
        <ArrowLeft size={15} /> Kembali ke Elementary 1
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#476C51]/45 bg-gradient-to-br from-[#203428] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#91B99A]/[0.08]">仕</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">IRODORI • ELEMENTARY 1 A2 • LESSON 01</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya bekerja di restoran.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9CDB0]"><ruby>レストラン<rt>れすとらん</rt></ruby>で<ruby>働<rt>はたら</rt></ruby>いています</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Berlatih menyapa orang yang lama tidak ditemui, menceritakan kabar terkini, menjelaskan kegiatan saat ini, serta bertanya tentang durasi dan kesan.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9CDB0]" />Sapaan & kabar</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#A9CDB0]" />Durasi waktu</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#A9CDB0]" />Kegiatan & pekerjaan</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A9CDB0]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Tiga target pertama mengikuti sasaran komunikasi utama pelajaran resmi. Dua target berikutnya merupakan latihan penguatan Fude.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">{index < 3 ? "CAN-DO UTAMA" : "LATIHAN PENGUATAN"} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KOSAKATA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sapaan, keadaan, dan kegiatan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kata yang digunakan untuk menyapa kembali, menjelaskan durasi, dan membicarakan kegiatan sehari-hari.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {vocabulary.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <p className="font-mincho text-base text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#A9CDB0]">{reading}</p>
              <p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Bertemu kembali dan bertukar kabar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Dialog dibuat orisinal oleh Fude. Perhatikan kapan bentuk sopan atau kasual digunakan, serta bagaimana menjelaskan keadaan sekarang.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Menyapa kenalan setelah lama tidak bertemu" speakers={[speakers.yui, speakers.akiko]} utterances={greetingConversation} />
          <IrodoriConversation title="Sapaan kasual antar teman dekat" speakers={[speakers.sota, speakers.kenji]} utterances={casualGreetingConversation} />
          <IrodoriConversation title="Menanyakan durasi tinggal dan keadaan" speakers={[speakers.akiko, speakers.sota]} utterances={recentLifeConversation} />
          <IrodoriConversation title="Menanyakan kapan seseorang datang" speakers={[speakers.yui, speakers.akiko]} utterances={arrivalConversation} />
          <IrodoriConversation title="Menjelaskan kegiatan dan kesan" speakers={[speakers.kenji, speakers.yui]} utterances={activityConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menyampaikan kabar dan kegiatan saat ini</h2>
        </div>
        {[
          {
            title: "01 · Bentuk sopan dan kasual",
            pattern: "お久しぶりです。／ 久しぶり。",
            example: <>お<ruby>元気<rt>げんき</rt></ruby>ですか？ ／ <ruby>元気<rt>げんき</rt></ruby>？</>,
            note: "Bentuk sopan memakai です／ます dan sesuai untuk orang yang belum dekat atau situasi formal. Bentuk kasual sering dipakai di antara teman dekat dan keluarga. Pada tahap ini, utamakan kemampuan memahami keduanya dan menggunakan bentuk sopan dengan tepat.",
          },
          {
            title: "02 · Menyatakan durasi dengan ～になります",
            pattern: "Durasi + になります",
            example: <><ruby>日本<rt>にほん</rt></ruby>に<ruby>来<rt>き</rt></ruby>て、<ruby>一年<rt>いちねん</rt></ruby>になります。</>,
            note: "Pola ini menyatakan waktu yang sudah berlalu sejak suatu awal kejadian. Contoh: 一年になります (sudah satu tahun), 半年になります (sudah enam bulan), dan 三か月になります (sudah tiga bulan).",
          },
          {
            title: "03 · Menyebut waktu lampau",
            pattern: "去年／先月／先週 + (、) + V-ました",
            example: <><ruby>去年<rt>きょねん</rt></ruby>の<ruby>四月<rt>しがつ</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。／ <ruby>先月<rt>せんげつ</rt></ruby>、<ruby>来<rt>き</rt></ruby>ました。</>,
            note: "Untuk menyebut kapan suatu kejadian terjadi, gunakan bentuk lampau. Kata 去年, 先月, dan 先週 biasanya tidak diikuti partikel に. Nama bulan atau tanggal tertentu dapat memakai に, seperti 四月に来ました.",
          },
          {
            title: "04 · V-ています untuk keadaan atau kegiatan saat ini",
            pattern: "Kata kerja bentuk て + います",
            example: <><ruby>日本語<rt>にほんご</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>しています。／ レストランで<ruby>働<rt>はたら</rt></ruby>いています。</>,
            note: "Pola V-ています dapat menjelaskan kegiatan yang sedang menjadi rutinitas atau keadaan seseorang saat ini. Misalnya, belajar bahasa Jepang, bekerja, atau bersekolah.",
          },
          {
            title: "05 · Menyampaikan kesan dengan でも",
            pattern: "S1。でも、S2。",
            example: <><ruby>忙<rt>いそが</rt></ruby>しいです。でも、<ruby>楽<rt>たの</rt></ruby>しいです。</>,
            note: "でも berarti “tetapi”. Gunakan saat ingin menyambungkan dua keadaan yang memiliki sisi berbeda, misalnya sibuk tetapi menyenangkan.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#8EAE93]">{item.title}</p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#A9CDB0]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KANJI DAN KATA PENTING</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali tulisan yang sering muncul</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading
                reading={reading}
                meaning={meaning}
                contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9CDB0]"
                romajiClassName="mt-1 text-sm italic text-[#A9A398]"
                translationClassName="mt-2 text-xs leading-5 text-[#A9A398]"
              >
                {jp}
              </JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">SIMULASI INTERAKTIF</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan ungkapan dalam situasi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi ini dengan memilih respons yang paling sesuai. Setiap situasi harus dijawab benar.</p>
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
                <p className="mt-1 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p>
              </div>
              <div className="rounded-xl border border-[#6E9A75]/20 bg-[#202720] p-4">
                <p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{task.japanese}</JapaneseReading></p>
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
                    <p className="font-mincho text-sm text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></p>
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
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></h3>
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
                      <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {practiceSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
                    <JapaneseReading allowIndexFallback>{task.explanation}</JapaneseReading>
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
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{question.prompt}</JapaneseReading></h3>
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
                      <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
                    <JapaneseReading allowIndexFallback>{question.explanation}</JapaneseReading>
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9CDB0]">CAN-DO CHECK</p>
        </div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. Progres Elementary 1 tersimpan dalam jalur Irodori, terpisah dari Minna no Nihongo dan JLPT.</p>
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
                    <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
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
            Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian Can-do.
          </p>
        )}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Dialog, tokoh, dan situasi latihan dibuat orisinal oleh Fude. Materi ini dirancang sebagai latihan bahasa dan bukan panduan kerja.
      </p>
    </main>
  );
}
