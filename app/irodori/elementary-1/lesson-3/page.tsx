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
const lessonId = "elementary1-03";



const seasonOverviewConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>日<ruby>本<rt>ほん</rt></ruby>には、どんな<ruby>季節<rt>きせつ</rt></ruby>がありますか？</>, romaji: "Nihon ni wa, donna kisetsu ga arimasu ka?", translation: "Di Jepang ada musim apa saja?", audioFileName: "irodori-elementary1-03-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>春、夏、秋、冬の<ruby>四季<rt>しき</rt></ruby>があります。</>, romaji: "Haru, natsu, aki, fuyu no shiki ga arimasu.", translation: "Ada empat musim: semi, panas, gugur, dan dingin.", audioFileName: "irodori-elementary1-03-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>春はどんな<ruby>季節<rt>きせつ</rt></ruby>ですか？</>, romaji: "Haru wa donna kisetsu desu ka?", translation: "Musim semi itu seperti apa?", audioFileName: "irodori-elementary1-03-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>暖かくなります。桜の花も<ruby>咲<rt>さ</rt></ruby>きます。</>, romaji: "Atatakaku narimasu. Sakura no hana mo sakimasu.", translation: "Cuaca mulai menghangat. Bunga sakura juga bermekaran.", audioFileName: "irodori-elementary1-03-a01-l04.mp3" },
  { speakerId: "yui", japanese: <>そうですか。冬はとても<ruby>寒<rt>さむ</rt></ruby>くなりますね。</>, romaji: "Sou desu ka. Fuyu wa totemo samuku narimasu ne.", translation: "Begitu, ya. Musim dingin menjadi sangat dingin, ya.", audioFileName: "irodori-elementary1-03-a01-l05.mp3" },
];

const seasonsInIndonesiaConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>インドネシアには、どんな<ruby>季節<rt>きせつ</rt></ruby>がありますか？</>, romaji: "Indoneshia ni wa, donna kisetsu ga arimasu ka?", translation: "Di Indonesia ada musim apa saja?", audioFileName: "irodori-elementary1-03-a02-l01.mp3" },
  { speakerId: "yui", japanese: <>多くのところには、雨季と<ruby>乾季<rt>かんき</rt></ruby>があります。</>, romaji: "Ooku no tokoro ni wa, uki to kanki ga arimasu.", translation: "Di banyak wilayah ada musim hujan dan musim kemarau.", audioFileName: "irodori-elementary1-03-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>雨季はどんな天気ですか？</>, romaji: "Uki wa donna tenki desu ka?", translation: "Bagaimana cuaca pada musim hujan?", audioFileName: "irodori-elementary1-03-a02-l03.mp3" },
  { speakerId: "yui", japanese: <>雨がたくさん<ruby>降<rt>ふ</rt></ruby>ります。ときどき、すずしくなります。</>, romaji: "Ame ga takusan furimasu. Tokidoki, suzushiku narimasu.", translation: "Hujan turun cukup sering. Kadang-kadang cuaca menjadi lebih sejuk.", audioFileName: "irodori-elementary1-03-a02-l04.mp3" },
];

const weatherComparisonConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>ケンジさんの<ruby>国<rt>くに</rt></ruby>は、一年中暑いですか？</>, romaji: "Kenji-san no kuni wa, ichinenjuu atsui desu ka?", translation: "Apakah negara Kenji panas sepanjang tahun?", audioFileName: "irodori-elementary1-03-a03-l01.mp3" },
  { speakerId: "kenji", japanese: <>いいえ。夏はとても暑いですが、冬は<ruby>寒<rt>さむ</rt></ruby>くなります。</>, romaji: "Iie. Natsu wa totemo atsui desu ga, fuyu wa samuku narimasu.", translation: "Tidak. Musim panas sangat panas, tetapi musim dingin menjadi dingin.", audioFileName: "irodori-elementary1-03-a03-l02.mp3" },
  { speakerId: "akiko", japanese: <>雪も<ruby>降<rt>ふ</rt></ruby>りますか？</>, romaji: "Yuki mo furimasu ka?", translation: "Apakah salju juga turun?", audioFileName: "irodori-elementary1-03-a03-l03.mp3" },
  { speakerId: "kenji", japanese: <>はい。北のほうでは、雪がたくさん降ります。</>, romaji: "Hai. Kita no hou de wa, yuki ga takusan furimasu.", translation: "Ya. Di wilayah utara, salju turun cukup banyak.", audioFileName: "irodori-elementary1-03-a03-l04.mp3" },
];

const rainySeasonConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>日本の<ruby>梅雨<rt>つゆ</rt></ruby>は、いつごろですか？</>, romaji: "Nihon no tsuyu wa, itsu goro desu ka?", translation: "Kapan kira-kira musim hujan tsuyu di Jepang?", audioFileName: "irodori-elementary1-03-a04-l01.mp3" },
  { speakerId: "akiko", japanese: <>だいたい六月ごろです。雨がたくさん降ります。</>, romaji: "Daitai rokugatsu goro desu. Ame ga takusan furimasu.", translation: "Kira-kira sekitar bulan Juni. Hujan turun cukup sering.", audioFileName: "irodori-elementary1-03-a04-l02.mp3" },
  { speakerId: "yui", japanese: <>じめじめして、<ruby>蒸<rt>む</rt></ruby>し暑いですね。</>, romaji: "Jimejime shite, mushiatsui desu ne.", translation: "Udara terasa lembap dan gerah, ya.", audioFileName: "irodori-elementary1-03-a04-l03.mp3" },
  { speakerId: "akiko", japanese: <>そうですね。でも、雨のあと、少しすずしくなる日もあります。</>, romaji: "Sou desu ne. Demo, ame no ato, sukoshi suzushiku naru hi mo arimasu.", translation: "Betul. Tetapi, setelah hujan, ada juga hari yang menjadi sedikit sejuk.", audioFileName: "irodori-elementary1-03-a04-l04.mp3" },
];

const favoriteSeasonConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>ユイさんは、どの<ruby>季節<rt>きせつ</rt></ruby>がいちばん好きですか？</>, romaji: "Yui-san wa, dono kisetsu ga ichiban suki desu ka?", translation: "Yui paling suka musim apa?", audioFileName: "irodori-elementary1-03-a05-l01.mp3" },
  { speakerId: "yui", japanese: <>春がいちばん好きです。暖かいですから。</>, romaji: "Haru ga ichiban suki desu. Atatakai desu kara.", translation: "Saya paling suka musim semi karena cuacanya hangat.", audioFileName: "irodori-elementary1-03-a05-l02.mp3" },
  { speakerId: "kenji", japanese: <>私は秋が好きです。もみじの<ruby>景色<rt>けしき</rt></ruby>がきれいですから。</>, romaji: "Watashi wa aki ga suki desu. Momiji no keshiki ga kirei desu kara.", translation: "Saya suka musim gugur karena pemandangan daun momiji indah.", audioFileName: "irodori-elementary1-03-a05-l03.mp3" },
  { speakerId: "yui", japanese: <>秋は<ruby>果物<rt>くだもの</rt></ruby>もおいしいですよね。</>, romaji: "Aki wa kudamono mo oishii desu yo ne.", translation: "Buah-buahan pada musim gugur juga enak, ya.", audioFileName: "irodori-elementary1-03-a05-l04.mp3" },
];

const canDos = [
  { id: "understand-japan-seasons", text: "Memahami ciri dasar empat musim di Jepang dari penjelasan sederhana." },
  { id: "describe-country-seasons", text: "Menjelaskan secara sederhana musim dan ciri cuaca di negara sendiri atau tempat tinggal." },
  { id: "explain-favorite-season", text: "Menyampaikan musim favorit dan alasan menyukainya dengan kalimat sederhana." },
  { id: "describe-weather-changes", text: "Menjelaskan perubahan cuaca atau suhu dengan pola ～になります." },
  { id: "give-seasonal-examples", text: "Memberikan beberapa contoh cuaca, kegiatan, atau hal khas pada suatu musim." },
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
    prompt: <>Pilih bentuk yang tepat untuk melengkapi: 「冬は寒く ___。」</>,
    options: [{ key: "a", label: "なります" }, { key: "b", label: "います" }, { key: "c", label: "あります" }],
    answer: "a",
    explanation: <>い形容詞 寒い berubah menjadi 寒く sebelum なります untuk menyatakan perubahan keadaan.</>,
  },
  {
    prompt: <>Apa arti 「秋がいちばん好きです」?</>,
    options: [{ key: "a", label: "Saya paling suka musim gugur." }, { key: "b", label: "Saya tidak suka musim gugur." }, { key: "c", label: "Musim gugur akan datang." }],
    answer: "a",
    explanation: <>いちばん yang diletakkan sebelum kata sifat berarti “paling”.</>,
  },
  {
    prompt: <>Lengkapi: 「私は暑い ___ が好きです。」</>,
    options: [{ key: "a", label: "の" }, { key: "b", label: "で" }, { key: "c", label: "に" }],
    answer: "a",
    explanation: <>い形容詞 + のが好きです menyatakan suka terhadap kondisi atau keadaan yang dijelaskan kata sifat.</>,
  },
  {
    prompt: <>Kalimat 「秋が好きです。景色がきれいですから。」 menjelaskan …</>,
    options: [{ key: "a", label: "Alasan menyukai musim gugur." }, { key: "b", label: "Tempat tinggal seseorang." }, { key: "c", label: "Kegiatan yang dilakukan kemarin." }],
    answer: "a",
    explanation: <>から di akhir kalimat menjelaskan alasan, yaitu pemandangannya indah.</>,
  },
  {
    prompt: <>Pilih partikel yang memberi contoh beberapa benda: 「海 ___ 山で遊びます。」</>,
    options: [{ key: "a", label: "や" }, { key: "b", label: "が" }, { key: "c", label: "を" }],
    answer: "a",
    explanation: <>や menghubungkan kata benda sebagai contoh dan menunjukkan bahwa masih ada contoh lain.</>,
  },
  {
    prompt: <>Mana kalimat yang menyatakan “Musim hujan dan musim kemarau ada”?</>,
    options: [{ key: "a", label: "雨季と乾季があります。" }, { key: "b", label: "雨季が乾季です。" }, { key: "c", label: "雨季を乾季があります。" }],
    answer: "a",
    explanation: <>と menghubungkan dua kata benda yang disebutkan secara lengkap dalam kalimat.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa arti 「春は暖かくなります」?</>,
    options: [{ key: "a", label: "Pada musim semi, cuaca mulai menjadi hangat." }, { key: "b", label: "Pada musim semi, cuaca selalu dingin." }, { key: "c", label: "Musim semi sudah berakhir." }],
    answer: "a",
    explanation: <>暖かい berubah menjadi 暖かく sebelum なります untuk menyatakan perubahan menjadi hangat.</>,
  },
  {
    prompt: <>Bentuk yang benar dari 暑い + なります adalah …</>,
    options: [{ key: "a", label: "暑くなります" }, { key: "b", label: "暑いになります" }, { key: "c", label: "暑くいます" }],
    answer: "a",
    explanation: <>Untuk い形容詞, ubah い menjadi く lalu tambahkan なります.</>,
  },
  {
    prompt: <>Apa arti kata 「梅雨」?</>,
    options: [{ key: "a", label: "Musim hujan pada awal musim panas di Jepang." }, { key: "b", label: "Musim salju." }, { key: "c", label: "Musim panen buah." }],
    answer: "a",
    explanation: <>梅雨（つゆ）adalah periode musim hujan di Jepang, biasanya sekitar awal musim panas.</>,
  },
  {
    prompt: <>Lengkapi: 「春、夏、秋、冬の ___ があります。」</>,
    options: [{ key: "a", label: "四季" }, { key: "b", label: "四月" }, { key: "c", label: "四人" }],
    answer: "a",
    explanation: <>四季（しき）berarti empat musim.</>,
  },
  {
    prompt: <>「いちばん」 sebelum kata sifat memiliki arti …</>,
    options: [{ key: "a", label: "Paling." }, { key: "b", label: "Sedikit." }, { key: "c", label: "Kadang-kadang." }],
    answer: "a",
    explanation: <>いちばん + kata sifat menunjukkan tingkat paling atau paling ... dibandingkan pilihan lain.</>,
  },
  {
    prompt: <>Pilih ungkapan yang berarti “Saya tidak suka cuaca dingin.”</>,
    options: [{ key: "a", label: "寒いのは好きじゃないです。" }, { key: "b", label: "寒いのが大好きです。" }, { key: "c", label: "寒くなります。" }],
    answer: "a",
    explanation: <>寒い + のは好きじゃないです menyatakan tidak suka terhadap cuaca dingin.</>,
  },
  {
    prompt: <>Kata 「苦手」 paling dekat artinya dengan …</>,
    options: [{ key: "a", label: "Kurang suka atau tidak nyaman dengan sesuatu." }, { key: "b", label: "Sangat ahli dalam sesuatu." }, { key: "c", label: "Sangat panas." }],
    answer: "a",
    explanation: <>苦手 adalah ungkapan yang lebih halus untuk menyatakan kurang menyukai atau tidak pandai dalam sesuatu.</>,
  },
  {
    prompt: <>Kalimat 「果物がおいしいですから、秋が好きです」 berarti …</>,
    options: [{ key: "a", label: "Saya suka musim gugur karena buah-buahan enak." }, { key: "b", label: "Saya membeli buah saat musim dingin." }, { key: "c", label: "Buah-buahan tidak enak pada musim gugur." }],
    answer: "a",
    explanation: <>から menghubungkan alasan dan hasil: buah enak, jadi menyukai musim gugur.</>,
  },
  {
    prompt: <>Apa fungsi 「や」 pada 「海や山」?</>,
    options: [{ key: "a", label: "Menyebut beberapa contoh dan tidak harus semuanya." }, { key: "b", label: "Menunjukkan waktu." }, { key: "c", label: "Menunjukkan objek langsung." }],
    answer: "a",
    explanation: <>や memberi contoh kata benda, sehingga daftar yang disebutkan tidak harus lengkap.</>,
  },
  {
    prompt: <>Pilih kalimat yang menjelaskan ciri iklim Indonesia secara sederhana.</>,
    options: [
      { key: "a", label: "多くのところには、雨季と乾季があります。" },
      { key: "b", label: "インドネシアには、四季だけがあります。" },
      { key: "c", label: "インドネシアは、一年中雪が降ります。" },
    ],
    answer: "a",
    explanation: <>Di banyak wilayah Indonesia dikenal musim hujan dan musim kemarau; pola cuaca dapat berbeda menurut daerah.</>,
  },
];

const simulations = [
  {
    title: "01 · Menjelaskan perubahan cuaca",
    heading: "Cuaca mulai menjadi dingin",
    prompt: "Akiko ingin mengatakan bahwa saat musim dingin, cuaca menjadi sangat dingin.",
    japanese: <>冬はどうなりますか？</>,
    translation: "Bagaimana keadaan pada musim dingin?",
    options: [
      { key: "change", label: "冬はとても寒くなります。", meaning: "Musim dingin menjadi sangat dingin." },
      { key: "static", label: "冬はとても寒いにいます。", meaning: "Bentuk kalimat tidak tepat." },
      { key: "past", label: "冬はとても寒かったですか。", meaning: "Apakah musim dingin sangat dingin? (lampau)" },
    ],
    answer: "change",
    explanation: "寒い berubah menjadi 寒く sebelum なります untuk menyatakan perubahan keadaan.",
  },
  {
    title: "02 · Menjelaskan iklim tempat tinggal",
    heading: "Menyebut musim di negara sendiri",
    prompt: "Yui ingin menjelaskan bahwa di banyak wilayah Indonesia ada musim hujan dan musim kemarau.",
    japanese: <>インドネシアには、どんな季節がありますか？</>,
    translation: "Di Indonesia ada musim apa saja?",
    options: [
      { key: "seasons", label: "多くのところには、雨季と乾季があります。", meaning: "Di banyak wilayah ada musim hujan dan musim kemarau." },
      { key: "four", label: "多くのところには、四つの冬があります。", meaning: "Tidak sesuai untuk menjelaskan iklim." },
      { key: "snow", label: "一年中、雪が降ります。", meaning: "Salju turun sepanjang tahun." },
    ],
    answer: "seasons",
    explanation: "雨季 dan 乾季 adalah musim hujan dan musim kemarau. 多くのところ berarti di banyak tempat atau wilayah.",
  },
  {
    title: "03 · Menyatakan musim favorit",
    heading: "Memilih musim yang paling disukai",
    prompt: "Sota ingin mengatakan bahwa ia paling suka musim semi.",
    japanese: <>どの季節がいちばん好きですか？</>,
    translation: "Musim apa yang paling disukai?",
    options: [
      { key: "best", label: "春がいちばん好きです。", meaning: "Saya paling suka musim semi." },
      { key: "least", label: "春がいちばん寒くなります。", meaning: "Musim semi menjadi paling dingin." },
      { key: "place", label: "春に学校があります。", meaning: "Ada sekolah pada musim semi." },
    ],
    answer: "best",
    explanation: "いちばん diletakkan sebelum 好き untuk menyatakan musim yang paling disukai.",
  },
  {
    title: "04 · Menjelaskan alasan",
    heading: "Mengatakan mengapa menyukai musim",
    prompt: "Kenji suka musim gugur karena pemandangan daun momiji indah.",
    japanese: <>どうして秋が好きですか？</>,
    translation: "Mengapa suka musim gugur?",
    options: [
      { key: "reason", label: "もみじの景色がきれいですから。", meaning: "Karena pemandangan momiji indah." },
      { key: "contrast", label: "もみじの景色がきれいです。でも。", meaning: "Penghubungnya tidak tepat untuk menyatakan alasan." },
      { key: "question", label: "もみじの景色はどこですか。", meaning: "Di mana pemandangan momiji?" },
    ],
    answer: "reason",
    explanation: "から di akhir kalimat menyampaikan alasan untuk pernyataan sebelumnya.",
  },
  {
    title: "05 · Memberi contoh",
    heading: "Menyebut contoh cuaca atau kegiatan",
    prompt: "Yui ingin menyebut laut dan gunung sebagai contoh tempat bermain saat liburan.",
    japanese: <>どこで遊ぶのが好きですか？</>,
    translation: "Di mana suka bermain?",
    options: [
      { key: "examples", label: "海や山で遊ぶのが好きです。", meaning: "Saya suka bermain di laut dan gunung, sebagai beberapa contoh." },
      { key: "reason", label: "海から山が好きです。", meaning: "Partikel tidak tepat untuk maksud ini." },
      { key: "time", label: "海に山を遊びます。", meaning: "Susunan partikel tidak tepat." },
    ],
    answer: "examples",
    explanation: "や menghubungkan kata benda sebagai contoh, dan daftar tersebut tidak harus lengkap.",
  },
];

const vocabulary = [
  ["季節", "きせつ · kisetsu", "Musim"],
  ["春", "はる · haru", "Musim semi"],
  ["夏", "なつ · natsu", "Musim panas"],
  ["秋", "あき · aki", "Musim gugur"],
  ["冬", "ふゆ · fuyu", "Musim dingin"],
  ["暑い", "あつい · atsui", "Panas (cuaca)"],
  ["寒い", "さむい · samui", "Dingin"],
  ["暖かい", "あたたかい · atatakai", "Hangat"],
  ["すずしい", "すずしい · suzushii", "Sejuk"],
  ["蒸し暑い", "むしあつい · mushiatsui", "Gerah / panas lembap"],
  ["雨が降る", "あめがふる · ame ga furu", "Hujan turun"],
  ["雪が降る", "ゆきがふる · yuki ga furu", "Salju turun"],
  ["桜", "さくら · sakura", "Bunga sakura"],
  ["花が咲く", "はながさく · hana ga saku", "Bunga bermekaran"],
  ["もみじ", "もみじ · momiji", "Daun maple Jepang"],
  ["景色", "けしき · keshiki", "Pemandangan"],
  ["梅雨", "つゆ · tsuyu", "Musim hujan di Jepang"],
  ["雨季", "うき · uki", "Musim hujan"],
  ["乾季", "かんき · kanki", "Musim kemarau"],
  ["一年中", "いちねんじゅう · ichinenjuu", "Sepanjang tahun"],
  ["同じ", "おなじ · onaji", "Sama"],
  ["変わる", "かわる · kawaru", "Berubah"],
  ["果物", "くだもの · kudamono", "Buah-buahan"],
  ["セミ", "せみ · semi", "Tonggeret / cicada"],
  ["たくさん", "たくさん · takusan", "Banyak"],
];

const kanjiWords = [
  ["季節", "きせつ · kisetsu", "Musim"],
  ["春", "はる · haru", "Musim semi"],
  ["夏", "なつ · natsu", "Musim panas"],
  ["秋", "あき · aki", "Musim gugur"],
  ["冬", "ふゆ · fuyu", "Musim dingin"],
  ["花", "はな · hana", "Bunga"],
  ["同じ", "おなじ · onaji", "Sama"],
  ["暑い", "あつい · atsui", "Panas"],
  ["寒い", "さむい · samui", "Dingin"],
  ["雪", "ゆき · yuki", "Salju"],
];
export default function IrodoriElementaryOneLessonThreePage() {
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
          <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">IRODORI • DASAR 1 A2 • PELAJARAN 03</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Musim dingin sangat dingin.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9CDB0]">冬はとても寒くなります</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Mempelajari ciri empat musim di Jepang, menjelaskan musim dan cuaca di negara sendiri, serta menyampaikan musim favorit beserta alasannya.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9CDB0]" />Empat musim</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#A9CDB0]" />Cuaca & iklim</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#A9CDB0]" />Musim favorit</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A9CDB0]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Tiga target pertama mengikuti target komunikasi resmi. Dua target terakhir merupakan latihan penguatan Fude.</p>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Musim, suhu, dan keadaan cuaca</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata untuk menyebut musim, menjelaskan perubahan cuaca, dan menceritakan ciri iklim.</p>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membicarakan empat musim dan iklim</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan cara menjelaskan ciri musim, perubahan suhu, iklim tempat tinggal, dan alasan memilih musim favorit.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Mengenali ciri empat musim" speakers={[speakers.yui, speakers.sota]} utterances={seasonOverviewConversation} />
          <IrodoriConversation title="Menjelaskan musim di Indonesia" speakers={[speakers.akiko, speakers.yui]} utterances={seasonsInIndonesiaConversation} />
          <IrodoriConversation title="Membandingkan cuaca di dua wilayah" speakers={[speakers.akiko, speakers.kenji]} utterances={weatherComparisonConversation} />
          <IrodoriConversation title="Membicarakan musim hujan" speakers={[speakers.yui, speakers.akiko]} utterances={rainySeasonConversation} />
          <IrodoriConversation title="Menyebut musim favorit dan alasannya" speakers={[speakers.kenji, speakers.yui]} utterances={favoriteSeasonConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menjelaskan musim, cuaca, dan alasan</h2>
        </div>
        {[
          {
            title: "01 · Menyatakan perubahan dengan ～になります",
            pattern: "N / ナA + になります · イA-い → イA-くなります",
            example: <>春は<ruby>暖<rt>あたた</rt></ruby>かくなります。／ 夏は<ruby>休<rt>やす</rt></ruby>みになります。</>,
            note: "なります（なる）menunjukkan perubahan keadaan. Untuk kata benda dan kata sifat な, gunakan ～になります. Untuk kata sifat い, ubah akhiran い menjadi く sebelum なります. Contoh: 寒い → 寒くなります (menjadi dingin), すずしい → すずしくなります (menjadi sejuk).",
          },
          {
            title: "02 · Menyatakan yang paling dengan いちばん",
            pattern: "いちばん + ナA-です / イA-いです",
            example: <>秋がいちばん<ruby>好<rt>す</rt></ruby>きです。／ 八月がいちばん<ruby>暑<rt>あつ</rt></ruby>いです。</>,
            note: "いちばん berarti “paling” ketika diletakkan sebelum kata sifat. Gunakan untuk menyatakan pilihan atau tingkat tertinggi dibandingkan pilihan lain.",
          },
          {
            title: "03 · Menyatakan suka atau kurang suka pada cuaca",
            pattern: "イA-い + のが好きです / 苦手です",
            example: <>暑いのが<ruby>好<rt>す</rt></ruby>きです。／ <ruby>寒<rt>さむ</rt></ruby>いのが<ruby>苦手<rt>にがて</rt></ruby>です。</>,
            note: "の dapat mengikuti kata sifat い untuk menjadikannya hal atau keadaan yang dibicarakan. 苦手 adalah cara yang lebih halus untuk mengatakan kurang suka atau kurang nyaman. Dalam bentuk negatif, biasanya が berubah menjadi は: 寒いのは好きじゃないです.",
          },
          {
            title: "04 · Menjelaskan alasan dengan ～ですから",
            pattern: "Kalimat kata sifat + ですから",
            example: <>秋が好きです。<ruby>景色<rt>けしき</rt></ruby>がきれいですから。</>,
            note: "から di akhir kalimat memberikan alasan atas pernyataan sebelumnya. Pada pola ini, kata sifat tetap memakai です sebelum から. Contoh lain: 果物がおいしいですから (karena buah-buahan enak).",
          },
          {
            title: "05 · Menghubungkan alasan dan hasil dengan から",
            pattern: "S1 + から、S2",
            example: <>暑いのが大好きですから、夏が好きです。</>,
            note: "から juga dapat diletakkan di tengah untuk menghubungkan dua kalimat. S1 adalah alasan dan S2 adalah hasil atau kesimpulannya. Bentuk ini dapat mengikuti kalimat kata benda, kata sifat, maupun kata kerja.",
          },
          {
            title: "06 · Memberi contoh dengan N1やN2",
            pattern: "N1 や N2（など）",
            example: <>春は桜やチューリップなどの花が咲きます。</>,
            note: "や menghubungkan kata benda sebagai contoh, bukan daftar yang lengkap. Artinya masih ada contoh lain selain yang disebutkan. など dapat ditambahkan setelah contoh terakhir.",
          },
          {
            title: "07 · Memberi contoh dengan N1とか（N2とか）",
            pattern: "N1 とか（N2 とか）",
            example: <>秋は果物がおいしいです。ぶどうとか梨とか。</>,
            note: "とか juga digunakan untuk memberi contoh. Berbeda dengan や, とか dapat digunakan walaupun hanya menyebut satu contoh dan terasa lebih kasual dalam percakapan.",
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
            Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian target komunikasi.
          </p>
        )}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Dialog, tokoh, dan situasi latihan dibuat orisinal oleh Fude sebagai latihan komunikasi tentang musim dan cuaca.
      </p>
    </main>
  );
}
