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
const lessonId = "elementary1-02";


const hobbyConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>ソウタさんの<ruby>趣味<rt>しゅみ</rt></ruby>は<ruby>何<rt>なん</rt></ruby>ですか？</>, romaji: "Souta-san no shumi wa nan desu ka?", translation: "Sota, apa hobimu?", audioFileName: "irodori-elementary1-02-a01-l01.mp3" },
  { speakerId: "sota", japanese: <><ruby>音楽<rt>おんがく</rt></ruby>を<ruby>聞<rt>き</rt></ruby>くことです。よく<ruby>電車<rt>でんしゃ</rt></ruby>で<ruby>聞<rt>き</rt></ruby>きます。</>, romaji: "Ongaku o kiku koto desu. Yoku densha de kikimasu.", translation: "Hobi saya adalah mendengarkan musik. Saya sering mendengarkannya di kereta.", audioFileName: "irodori-elementary1-02-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>そうですか。<ruby>私<rt>わたし</rt></ruby>も<ruby>音楽<rt>おんがく</rt></ruby>が<ruby>好<rt>す</rt></ruby>きです。</>, romaji: "Sou desu ka. Watashi mo ongaku ga suki desu.", translation: "Begitu, ya. Saya juga suka musik.", audioFileName: "irodori-elementary1-02-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>どんな<ruby>音楽<rt>おんがく</rt></ruby>が<ruby>好<rt>す</rt></ruby>きですか？</>, romaji: "Donna ongaku ga suki desu ka?", translation: "Kamu suka musik seperti apa?", audioFileName: "irodori-elementary1-02-a01-l04.mp3" },
];

const favoriteActivityConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>ケンジさんは、<ruby>休<rt>やす</rt></ruby>みの<ruby>日<rt>ひ</rt></ruby>に<ruby>何<rt>なに</rt></ruby>をするのが<ruby>好<rt>す</rt></ruby>きですか？</>, romaji: "Kenji-san wa, yasumi no hi ni nani o suru no ga suki desu ka?", translation: "Kenji, apa yang kamu suka lakukan saat hari libur?", audioFileName: "irodori-elementary1-02-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <><ruby>家<rt>いえ</rt></ruby>で<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>むのが<ruby>好<rt>す</rt></ruby>きです。</>, romaji: "Ie de hon o yomu no ga suki desu.", translation: "Saya suka membaca buku di rumah.", audioFileName: "irodori-elementary1-02-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <><ruby>外<rt>そと</rt></ruby>に<ruby>出<rt>で</rt></ruby>かけるのは<ruby>好<rt>す</rt></ruby>きじゃないですか？</>, romaji: "Soto ni dekakeru no wa suki ja nai desu ka?", translation: "Kamu tidak suka pergi keluar?", audioFileName: "irodori-elementary1-02-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>はい。うちでゆっくりするのが<ruby>好<rt>す</rt></ruby>きです。</>, romaji: "Hai. Uchi de yukkuri suru no ga suki desu.", translation: "Ya. Saya suka bersantai di rumah.", audioFileName: "irodori-elementary1-02-a02-l04.mp3" },
];

const holidayConversation: IrodoriUtterance[] = [
  { speakerId: "sota", japanese: <>ユイさんは、<ruby>休<rt>やす</rt></ruby>みの<ruby>日<rt>ひ</rt></ruby>はたいてい<ruby>何<rt>なに</rt></ruby>をしますか？</>, romaji: "Yui-san wa, yasumi no hi wa taitei nani o shimasu ka?", translation: "Yui, biasanya kamu melakukan apa saat hari libur?", audioFileName: "irodori-elementary1-02-a03-l01.mp3" },
  { speakerId: "yui", japanese: <>たいてい<ruby>友達<rt>ともだち</rt></ruby>と<ruby>公園<rt>こうえん</rt></ruby>でバドミントンをします。</>, romaji: "Taitei tomodachi to kouen de badominton o shimasu.", translation: "Biasanya saya bermain bulu tangkis di taman bersama teman.", audioFileName: "irodori-elementary1-02-a03-l02.mp3" },
  { speakerId: "sota", japanese: <>いいですね。どのぐらいしますか？</>, romaji: "Ii desu ne. Dono gurai shimasu ka?", translation: "Wah, seru, ya. Biasanya bermain berapa lama?", audioFileName: "irodori-elementary1-02-a03-l03.mp3" },
  { speakerId: "yui", japanese: <>二時間ぐらいです。そのあと、みんなでご<ruby>飯<rt>はん</rt></ruby>を<ruby>食<rt>た</rt></ruby>べます。</>, romaji: "Nijikan gurai desu. Sono ato, minna de gohan o tabemasu.", translation: "Sekitar dua jam. Setelah itu, kami makan bersama.", audioFileName: "irodori-elementary1-02-a03-l04.mp3" },
  { speakerId: "sota", japanese: <>とても<ruby>楽<rt>たの</rt></ruby>しそうですね。</>, romaji: "Totemo tanoshisou desu ne.", translation: "Sepertinya sangat menyenangkan.", audioFileName: "irodori-elementary1-02-a03-l05.mp3" },
];

const weeklyRoutineConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>アキコさんは、<ruby>週末<rt>しゅうまつ</rt></ruby>に<ruby>何<rt>なに</rt></ruby>をしていますか？</>, romaji: "Akiko-san wa, shuumatsu ni nani o shite imasu ka?", translation: "Akiko, biasanya kamu melakukan apa pada akhir pekan?", audioFileName: "irodori-elementary1-02-a04-l01.mp3" },
  { speakerId: "akiko", japanese: <>日曜日に<ruby>友達<rt>ともだち</rt></ruby>と<ruby>図書館<rt>としょかん</rt></ruby>で<ruby>日本語<rt>にほんご</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>しています。</>, romaji: "Nichiyoubi ni tomodachi to toshokan de nihongo o benkyou shite imasu.", translation: "Pada hari Minggu saya belajar bahasa Jepang di perpustakaan bersama teman.", audioFileName: "irodori-elementary1-02-a04-l02.mp3" },
  { speakerId: "yui", japanese: <>そのあと、<ruby>何<rt>なに</rt></ruby>をしますか？</>, romaji: "Sono ato, nani o shimasu ka?", translation: "Setelah itu, kamu melakukan apa?", audioFileName: "irodori-elementary1-02-a04-l03.mp3" },
  { speakerId: "akiko", japanese: <><ruby>勉強<rt>べんきょう</rt></ruby>して、それからカフェで<ruby>休<rt>やす</rt></ruby>みます。</>, romaji: "Benkyou shite, sorekara kafe de yasumimasu.", translation: "Setelah belajar, saya beristirahat di kafe.", audioFileName: "irodori-elementary1-02-a04-l04.mp3" },
];

const learningAndAbilityConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>ユイさん、<ruby>最近<rt>さいきん</rt></ruby>、<ruby>何<rt>なに</rt></ruby>か<ruby>習<rt>なら</rt></ruby>っていますか？</>, romaji: "Yui-san, saikin, nanika naratte imasu ka?", translation: "Yui, belakangan ini kamu sedang belajar sesuatu?", audioFileName: "irodori-elementary1-02-a05-l01.mp3" },
  { speakerId: "yui", japanese: <>はい。<ruby>週<rt>しゅう</rt></ruby>に<ruby>一回<rt>いっかい</rt></ruby>、<ruby>料理<rt>りょうり</rt></ruby>を<ruby>習<rt>なら</rt></ruby>っています。</>, romaji: "Hai. Shuu ni ikkai, ryouri o naratte imasu.", translation: "Ya. Saya belajar memasak sekali seminggu.", audioFileName: "irodori-elementary1-02-a05-l02.mp3" },
  { speakerId: "kenji", japanese: <>そうですか。<ruby>料理<rt>りょうり</rt></ruby>ができますか？</>, romaji: "Sou desu ka. Ryouri ga dekimasu ka?", translation: "Oh, begitu. Kamu bisa memasak?", audioFileName: "irodori-elementary1-02-a05-l03.mp3" },
  { speakerId: "yui", japanese: <>はい、<ruby>簡単<rt>かんたん</rt></ruby>なものならできます。</>, romaji: "Hai, kantan na mono nara dekimasu.", translation: "Ya, saya bisa membuat masakan sederhana.", audioFileName: "irodori-elementary1-02-a05-l04.mp3" },
];

const canDos = [
  { id: "talk-about-hobbies", text: "Menceritakan hobi dan hal yang disukai secara sederhana." },
  { id: "ask-about-days-off", text: "Menanyakan dan menjawab pertanyaan tentang kegiatan pada hari libur." },
  { id: "describe-activity-details", text: "Menjelaskan kegiatan hari libur, termasuk apa yang dilakukan, di mana, dan bersama siapa." },
  { id: "describe-routine", text: "Menceritakan rutinitas sederhana dengan frekuensi dan urutan kegiatan." },
  { id: "talk-about-ability", text: "Menyampaikan kegiatan yang sedang dipelajari dan kemampuan yang dimiliki." },
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
    prompt: <>Pilih bentuk yang tepat: 「趣味は本を読む ___ です。」</>,
    options: [{ key: "a", label: "こと" }, { key: "b", label: "のが" }, { key: "c", label: "て" }],
    answer: "a",
    explanation: <>Pola 趣味は～ことです memakai bentuk kamus kata kerja diikuti こと untuk menyatakan hobi.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Saya suka bermain game.”</>,
    options: [{ key: "a", label: "ゲームをするのが好きです。" }, { key: "b", label: "ゲームをして好きです。" }, { key: "c", label: "ゲームをしたことです。" }],
    answer: "a",
    explanation: <>Untuk menyatakan suka melakukan aktivitas, gunakan kata kerja bentuk kamus + のが好きです.</>,
  },
  {
    prompt: <>Kata yang paling sesuai untuk “biasanya” adalah …</>,
    options: [{ key: "a", label: "たいてい" }, { key: "b", label: "ときどき" }, { key: "c", label: "ぜんぜん" }],
    answer: "a",
    explanation: <>たいてい berarti biasanya atau pada umumnya. ときどき berarti kadang-kadang.</>,
  },
  {
    prompt: <>Lengkapi: 「友達 ___ 公園 ___ サッカーをします。」</>,
    options: [{ key: "a", label: "と ／ で" }, { key: "b", label: "で ／ と" }, { key: "c", label: "に ／ を" }],
    answer: "a",
    explanation: <>と menandai teman kegiatan, sedangkan で menandai tempat aktivitas dilakukan.</>,
  },
  {
    prompt: <>Kalimat 「週に一回、ピアノを習っています」 menunjukkan …</>,
    options: [
      { key: "a", label: "Kegiatan yang dilakukan berulang sebagai rutinitas." },
      { key: "b", label: "Kegiatan yang hanya dilakukan satu kali pada masa lalu." },
      { key: "c", label: "Kegiatan yang tidak pernah dilakukan." },
    ],
    answer: "a",
    explanation: <>V-ています dapat menyatakan kebiasaan atau kegiatan yang berulang dalam suatu periode.</>,
  },
  {
    prompt: <>Pilih kalimat yang menyatakan kemampuan dengan benar.</>,
    options: [{ key: "a", label: "料理ができます。" }, { key: "b", label: "料理をできます。" }, { key: "c", label: "料理でできます。" }],
    answer: "a",
    explanation: <>Pola Nができます digunakan untuk menyatakan kemampuan atau sesuatu yang bisa dilakukan.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa arti 「趣味は写真を撮ることです」?</>,
    options: [{ key: "a", label: "Hobi saya adalah memotret." }, { key: "b", label: "Saya sedang membeli kamera." }, { key: "c", label: "Saya tidak suka foto." }],
    answer: "a",
    explanation: <>写真を撮ること berarti kegiatan memotret yang dijadikan hobi.</>,
  },
  {
    prompt: <>Bentuk apa yang digunakan sebelum こと dalam pola 「趣味は～ことです」?</>,
    options: [{ key: "a", label: "Bentuk kamus kata kerja." }, { key: "b", label: "Bentuk て kata kerja." }, { key: "c", label: "Bentuk lampau kata kerja." }],
    answer: "a",
    explanation: <>Kata kerja bentuk kamus diikuti こと untuk membentuk frasa benda yang menjelaskan hobi.</>,
  },
  {
    prompt: <>Lengkapi: 「音楽を聞く ___ が好きです。」</>,
    options: [{ key: "a", label: "の" }, { key: "b", label: "を" }, { key: "c", label: "で" }],
    answer: "a",
    explanation: <>Bentuk kamus + のが好きです berarti suka melakukan aktivitas tersebut.</>,
  },
  {
    prompt: <>Mana yang berarti “Saya tidak terlalu suka pergi keluar”?</>,
    options: [{ key: "a", label: "出かけるのはあまり好きじゃないです。" }, { key: "b", label: "出かけるのが大好きです。" }, { key: "c", label: "出かけることができます。" }],
    answer: "a",
    explanation: <>あまり～好きじゃない menyatakan tidak terlalu suka.</>,
  },
  {
    prompt: <>Pada kalimat 「友達と公園で運動します」, apa fungsi と?</>,
    options: [{ key: "a", label: "Menunjukkan teman kegiatan." }, { key: "b", label: "Menunjukkan tempat kegiatan." }, { key: "c", label: "Menunjukkan tujuan arah." }],
    answer: "a",
    explanation: <>と menandai orang yang melakukan kegiatan bersama, sedangkan で menandai tempat.</>,
  },
  {
    prompt: <>Pada kalimat 「図書館で勉強します」, apa fungsi で?</>,
    options: [{ key: "a", label: "Menunjukkan tempat kegiatan dilakukan." }, { key: "b", label: "Menunjukkan orang yang diajak." }, { key: "c", label: "Menunjukkan waktu lampau." }],
    answer: "a",
    explanation: <>で menunjukkan lokasi tempat suatu aktivitas berlangsung.</>,
  },
  {
    prompt: <>Lengkapi urutan kegiatan: 「本を読ん ___、音楽を聞きます。」</>,
    options: [{ key: "a", label: "で" }, { key: "b", label: "ます" }, { key: "c", label: "る" }],
    answer: "a",
    explanation: <>読んで adalah bentuk て dari 読みます dan menghubungkan dua kegiatan.</>,
  },
  {
    prompt: <>Arti 「毎週、日本語を勉強しています」 adalah …</>,
    options: [{ key: "a", label: "Saya belajar bahasa Jepang setiap minggu." }, { key: "b", label: "Saya pernah belajar bahasa Jepang satu kali." }, { key: "c", label: "Saya tidak belajar bahasa Jepang." }],
    answer: "a",
    explanation: <>V-ています juga dapat menyatakan kebiasaan atau kegiatan yang berulang.</>,
  },
  {
    prompt: <>Pilih arti yang tepat dari 「英語ができます」.</>,
    options: [{ key: "a", label: "Saya bisa berbahasa Inggris." }, { key: "b", label: "Saya sedang membaca buku bahasa Inggris." }, { key: "c", label: "Saya pergi ke Inggris." }],
    answer: "a",
    explanation: <>Nができます menyatakan kemampuan; ～語 dapat dipakai untuk menyebut bahasa.</>,
  },
  {
    prompt: <>Mana pertanyaan yang paling sesuai untuk mengetahui hobi seseorang?</>,
    options: [{ key: "a", label: "趣味は何ですか？" }, { key: "b", label: "何時に寝ますか？" }, { key: "c", label: "どこに住んでいますか？" }],
    answer: "a",
    explanation: <>趣味は何ですか berarti “Apa hobi Anda?” dan sesuai untuk membuka percakapan tentang kegemaran.</>,
  },
];

const simulations = [
  {
    title: "01 · Menjelaskan hobi",
    heading: "Menceritakan kegemaran",
    prompt: "Sota ingin mengatakan bahwa hobinya adalah mendengarkan musik.",
    japanese: <>ソウタさんの<ruby>趣味<rt>しゅみ</rt></ruby>は<ruby>何<rt>なん</rt></ruby>ですか？</>,
    translation: "Sota, apa hobimu?",
    options: [
      { key: "hobby", label: "趣味は音楽を聞くことです。", meaning: "Hobi saya adalah mendengarkan musik." },
      { key: "like", label: "音楽を聞いています。", meaning: "Saya sedang mendengarkan musik." },
      { key: "ability", label: "音楽ができます。", meaning: "Bukan ungkapan alami untuk menyebut hobi." },
    ],
    answer: "hobby",
    explanation: "Untuk menjelaskan hobi dengan kata kerja, gunakan bentuk kamus + ことです.",
  },
  {
    title: "02 · Menyatakan kesukaan",
    heading: "Menjawab hal yang disukai",
    prompt: "Akiko ingin mengatakan bahwa ia suka membaca buku.",
    japanese: <>どんなことをするのが<ruby>好<rt>す</rt></ruby>きですか？</>,
    translation: "Apa kegiatan yang kamu sukai?",
    options: [
      { key: "reading", label: "本を読むのが好きです。", meaning: "Saya suka membaca buku." },
      { key: "past", label: "本を読んで好きです。", meaning: "Bentuk ini tidak tepat untuk menyatakan kesukaan." },
      { key: "hobby", label: "本を読んだことです。", meaning: "Bentuk ini tidak tepat untuk pola tersebut." },
    ],
    answer: "reading",
    explanation: "Gunakan kata kerja bentuk kamus + のが好きです untuk menyatakan suka melakukan aktivitas.",
  },
  {
    title: "03 · Kegiatan hari libur",
    heading: "Menyebut teman dan tempat",
    prompt: "Yui biasanya bermain bulu tangkis bersama temannya di taman.",
    japanese: <>休みの日は、たいてい何をしますか？</>,
    translation: "Biasanya kamu melakukan apa saat hari libur?",
    options: [
      { key: "place", label: "友達と公園でバドミントンをします。", meaning: "Bermain bulu tangkis di taman bersama teman." },
      { key: "wrong", label: "友達で公園とバドミントンをします。", meaning: "Partikel と dan で tertukar." },
      { key: "alone", label: "一人で家で寝ます。", meaning: "Tidur sendiri di rumah." },
    ],
    answer: "place",
    explanation: "と menunjukkan teman kegiatan, sedangkan で menunjukkan lokasi kegiatan.",
  },
  {
    title: "04 · Menghubungkan kegiatan",
    heading: "Menceritakan dua kegiatan berurutan",
    prompt: "Setelah belajar di perpustakaan, Akiko beristirahat di kafe.",
    japanese: <>そのあと、何をしますか？</>,
    translation: "Setelah itu, kamu melakukan apa?",
    options: [
      { key: "sequence", label: "図書館で勉強して、カフェで休みます。", meaning: "Belajar di perpustakaan, lalu beristirahat di kafe." },
      { key: "wrong", label: "図書館で勉強する、カフェで休みます。", meaning: "Kedua verba belum dihubungkan dengan bentuk て." },
      { key: "past", label: "図書館で勉強しました。", meaning: "Hanya menyampaikan satu kegiatan lampau." },
    ],
    answer: "sequence",
    explanation: "Bentuk て dapat menghubungkan dua kegiatan yang dilakukan berurutan.",
  },
  {
    title: "05 · Menyampaikan kemampuan",
    heading: "Menjelaskan hal yang bisa dilakukan",
    prompt: "Yui sedang belajar memasak dan ingin mengatakan bahwa ia bisa membuat masakan sederhana.",
    japanese: <>料理ができますか？</>,
    translation: "Kamu bisa memasak?",
    options: [
      { key: "ability", label: "簡単な料理ができます。", meaning: "Saya bisa membuat masakan sederhana." },
      { key: "hobby", label: "料理をすることです。", meaning: "Hobi saya adalah memasak." },
      { key: "routine", label: "料理を習っています。", meaning: "Saya sedang belajar memasak." },
    ],
    answer: "ability",
    explanation: "Nができます menyatakan kemampuan; ～を習っています menyatakan kegiatan yang sedang dipelajari.",
  },
];

const vocabulary = [
  ["趣味", "しゅみ · shumi", "Hobi"],
  ["好き", "すき · suki", "Suka"],
  ["大好き", "だいすき · daisuki", "Sangat suka"],
  ["休みの日", "やすみのひ · yasumi no hi", "Hari libur"],
  ["週末", "しゅうまつ · shuumatsu", "Akhir pekan"],
  ["映画", "えいが · eiga", "Film"],
  ["音楽", "おんがく · ongaku", "Musik"],
  ["本", "ほん · hon", "Buku"],
  ["写真", "しゃしん · shashin", "Foto"],
  ["撮る", "とる · toru", "Memotret"],
  ["料理", "りょうり · ryouri", "Masakan / memasak"],
  ["旅行", "りょこう · ryokou", "Perjalanan / wisata"],
  ["ゲーム", "ゲーム · geemu", "Game"],
  ["読む", "よむ · yomu", "Membaca"],
  ["聞く", "きく · kiku", "Mendengarkan"],
  ["友達", "ともだち · tomodachi", "Teman"],
  ["公園", "こうえん · kouen", "Taman"],
  ["図書館", "としょかん · toshokan", "Perpustakaan"],
  ["出かける", "でかける · dekakeru", "Pergi keluar"],
  ["たいてい", "たいてい · taitei", "Biasanya"],
  ["ときどき", "ときどき · tokidoki", "Kadang-kadang"],
  ["習う", "ならう · narau", "Belajar dari seseorang / mengikuti pelajaran"],
  ["できる", "できる · dekiru", "Bisa / mampu"],
  ["一週間", "いっしゅうかん · isshuukan", "Satu minggu"],
  ["一回", "いっかい · ikkai", "Satu kali"],
];

const kanjiWords = [
  ["趣味", "しゅみ · shumi", "Hobi"],
  ["音楽", "おんがく · ongaku", "Musik"],
  ["家族", "かぞく · kazoku", "Keluarga"],
  ["英語", "えいご · eigo", "Bahasa Inggris"],
  ["習う", "ならう · narau", "Belajar"],
  ["話す", "はなす · hanasu", "Berbicara"],
  ["出かける", "でかける · dekakeru", "Pergi keluar"],
  ["夕方", "ゆうがた · yuugata", "Sore"],
  ["友達", "ともだち · tomodachi", "Teman"],
  ["図書館", "としょかん · toshokan", "Perpustakaan"],
];

export default function IrodoriElementaryOneLessonTwoPage() {
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
        <ArrowLeft size={15} /> Kembali ke Dasar 1
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#476C51]/45 bg-gradient-to-br from-[#203428] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#91B99A]/[0.08]">仕</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">IRODORI • DASAR 1 A2 • PELAJARAN 02</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya suka bermain gim video.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9CDB0]">ゲームをするのが好きです</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Berlatih menceritakan hobi dan hal yang disukai, bertanya tentang kegiatan hari libur, serta menjelaskan rutinitas dan kemampuan sederhana.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9CDB0]" />Hobi & minat</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#A9CDB0]" />Hari libur</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#A9CDB0]" />Rutinitas & kemampuan</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A9CDB0]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Dua target pertama mengikuti target komunikasi resmi. Target ketiga merinci keterampilan praktis yang mendukung target komunikasi kedua; dua target terakhir merupakan penguatan Fude.</p>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Hobi, kesukaan, dan waktu luang</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata untuk membicarakan hobi, kegiatan pada hari libur, rutinitas, serta kemampuan.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {vocabulary.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membicarakan hobi dan kegiatan hari libur</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan cara menyebut hobi, menyatakan kesukaan, menjelaskan kegiatan bersama, dan menghubungkan aktivitas.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Menanyakan hobi" speakers={[speakers.yui, speakers.sota]} utterances={hobbyConversation} />
          <IrodoriConversation title="Membicarakan kegiatan yang disukai" speakers={[speakers.akiko, speakers.kenji]} utterances={favoriteActivityConversation} />
          <IrodoriConversation title="Bertukar cerita tentang hari libur" speakers={[speakers.sota, speakers.yui]} utterances={holidayConversation} />
          <IrodoriConversation title="Menjelaskan rutinitas akhir pekan" speakers={[speakers.yui, speakers.akiko]} utterances={weeklyRoutineConversation} />
          <IrodoriConversation title="Menceritakan kegiatan belajar dan kemampuan" speakers={[speakers.kenji, speakers.yui]} utterances={learningAndAbilityConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menceritakan hobi dan rutinitas</h2>
        </div>
        {[
          {
            title: "01 · Menyebut hobi dengan ～ことです",
            pattern: "趣味は + V-ることです",
            example: <>趣味は<ruby>写真<rt>しゃしん</rt></ruby>を<ruby>撮<rt>と</rt></ruby>ることです。</>,
            note: "Untuk menyebut hobi, kata benda dapat langsung mengikuti 趣味は. Jika menggunakan kata kerja, pakai bentuk kamus lalu tambahkan ことです. Contoh: 本を読むことです (membaca buku) dan 料理をすることです (memasak). こと mengubah kegiatan menjadi frasa benda.",
          },
          {
            title: "02 · Menyatakan kesukaan dengan ～のが好きです",
            pattern: "V-る + のが好きです",
            example: <>ゲームをするのが<ruby>好<rt>す</rt></ruby>きです。／ <ruby>出<rt>で</rt></ruby>かけるのはあまり<ruby>好<rt>す</rt></ruby>きじゃないです。</>,
            note: "Jika hal yang disukai berupa kegiatan, gunakan kata kerja bentuk kamus + のが好きです. Untuk menyatakan tidak suka, gunakan ～のは好きじゃないです atau ～のは好きじゃありません. Contoh: 音楽を聞くのが好きです (suka mendengarkan musik).",
          },
          {
            title: "03 · Menyebut teman dan tempat kegiatan",
            pattern: "[orang] と + [tempat] で + V-ます",
            example: <><ruby>友達<rt>ともだち</rt></ruby>と<ruby>公園<rt>こうえん</rt></ruby>でバドミントンをします。</>,
            note: "Partikel と menunjukkan orang yang melakukan kegiatan bersama, sedangkan で menunjukkan tempat aktivitas dilakukan. Urutannya dapat berubah: 友達と公園で atau 公園で友達と.",
          },
          {
            title: "04 · Menghubungkan kegiatan dengan bentuk て",
            pattern: "V1-て、V2-ます",
            example: <><ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、それから<ruby>音楽<rt>おんがく</rt></ruby>を<ruby>聞<rt>き</rt></ruby>きます。</>,
            note: "Bentuk て dapat menghubungkan dua atau lebih kegiatan yang dilakukan berurutan. 読みます berubah menjadi 読んで. Ungkapan それから dapat dipakai untuk memperjelas arti “setelah itu”.",
          },
          {
            title: "05 · Menjelaskan rutinitas dengan V-ています",
            pattern: "V-て + います",
            example: <>週に一回、<ruby>料理<rt>りょうり</rt></ruby>を<ruby>習<rt>なら</rt></ruby>っています。</>,
            note: "Selain pekerjaan atau kegiatan yang sedang berlangsung, V-ています juga digunakan untuk kegiatan yang dilakukan berulang selama suatu periode atau sebagai kebiasaan. 週に一回 berarti sekali seminggu.",
          },
          {
            title: "06 · Menyatakan kemampuan dengan Nができます",
            pattern: "N + ができます",
            example: <><ruby>日本語<rt>にほんご</rt></ruby>ができます。／ <ruby>簡単<rt>かんたん</rt></ruby>な<ruby>料理<rt>りょうり</rt></ruby>ができます。</>,
            note: "できます menyatakan bahwa seseorang mampu melakukan sesuatu. Pola ini dapat dipakai untuk bahasa, olahraga, musik, dan keterampilan lainnya. Untuk nama bahasa, tambahkan 語 seperti 日本語 atau 英語.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-sm font-bold tracking-[0.02em] text-[#8EAE93]">{item.title}</p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#A9CDB0]"><JapaneseReading allowIndexFallback romajiClassName="mt-1 text-sm italic text-[#D9B66D]">{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
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
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
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
                <p className="mt-1 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></p>
              </div>
              <div className="rounded-xl border border-[#6E9A75]/20 bg-[#202720] p-4">
                <p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.japanese}</JapaneseReading></p>
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
                    <p className="font-mincho text-sm text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></p>
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
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></h3>
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
                      <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {practiceSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
                    <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.explanation}</JapaneseReading>
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
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.prompt}</JapaneseReading></h3>
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
                      <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
                    <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.explanation}</JapaneseReading>
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9CDB0]">CEK TARGET KOMUNIKASI</p>
        </div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. Progres Dasar 1 tersimpan dalam jalur Irodori, terpisah dari Minna no Nihongo dan JLPT.</p>
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
                    <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
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
            Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian target komunikasi.
          </p>
        )}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Dialog, tokoh, dan situasi latihan dibuat orisinal oleh Fude sebagai latihan komunikasi sehari-hari.
      </p>
    </main>
  );
}
