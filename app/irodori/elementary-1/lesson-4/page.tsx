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
const lessonId = "elementary1-04";




const weatherGreetingConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>今日はいい天気ですね。</>, romaji: "Kyou wa ii tenki desu ne.", translation: "Cuaca bagus hari ini, ya.", audioFileName: "irodori-elementary1-04-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>そうですね。朝は少し寒かったですが、今は暖かいですね。</>, romaji: "Sou desu ne. Asa wa sukoshi samukatta desu ga, ima wa atatakai desu ne.", translation: "Iya, ya. Tadi pagi agak dingin, tetapi sekarang hangat.", audioFileName: "irodori-elementary1-04-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>昨日は雨でしたね。</>, romaji: "Kinou wa ame deshita ne.", translation: "Kemarin hujan, ya.", audioFileName: "irodori-elementary1-04-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>はい。でも、今日は晴れています。</>, romaji: "Hai. Demo, kyou wa harete imasu.", translation: "Iya. Tetapi, hari ini cerah.", audioFileName: "irodori-elementary1-04-a01-l04.mp3" },
  { speakerId: "yui", japanese: <>気持ちがいいですね。</>, romaji: "Kimochi ga ii desu ne.", translation: "Rasanya menyenangkan, ya.", audioFileName: "irodori-elementary1-04-a01-l05.mp3" },
];

const yesterdayRainConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>昨日はすごい雨でしたね。</>, romaji: "Kinou wa sugoi ame deshita ne.", translation: "Kemarin hujannya deras sekali, ya.", audioFileName: "irodori-elementary1-04-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>そうですね。夜まで雨が降っていました。</>, romaji: "Sou desu ne. Yoru made ame ga futte imashita.", translation: "Betul. Hujan turun sampai malam.", audioFileName: "irodori-elementary1-04-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>今も少し降っていますか？</>, romaji: "Ima mo sukoshi futte imasu ka?", translation: "Apakah sekarang masih turun sedikit?", audioFileName: "irodori-elementary1-04-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>いいえ、もうやみましたよ。</>, romaji: "Iie, mou yamimashita yo.", translation: "Tidak, hujannya sudah berhenti.", audioFileName: "irodori-elementary1-04-a02-l04.mp3" },
];

const forecastConversation: IrodoriUtterance[] = [
  { speakerId: "sota", japanese: <>天気予報を見ましたか？</>, romaji: "Tenki yohou o mimashita ka?", translation: "Apakah sudah melihat prakiraan cuaca?", audioFileName: "irodori-elementary1-04-a03-l01.mp3" },
  { speakerId: "yui", japanese: <>はい。明日は晴れるでしょう。</>, romaji: "Hai. Ashita wa hareru deshou.", translation: "Ya. Besok kemungkinan akan cerah.", audioFileName: "irodori-elementary1-04-a03-l02.mp3" },
  { speakerId: "sota", japanese: <>雨は降らないでしょうか？</>, romaji: "Ame wa furanai deshou ka?", translation: "Kira-kira hujan tidak akan turun?", audioFileName: "irodori-elementary1-04-a03-l03.mp3" },
  { speakerId: "yui", japanese: <>午後は少し曇るでしょう。でも、雨は降らないでしょう。</>, romaji: "Gogo wa sukoshi kumoru deshou. Demo, ame wa furanai deshou.", translation: "Sore nanti mungkin sedikit berawan. Tetapi, sepertinya tidak akan hujan.", audioFileName: "irodori-elementary1-04-a03-l04.mp3" },
];

const weatherPostConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>この天気の書き込みを読みましたか？</>, romaji: "Kono tenki no kakikomi o yomimashita ka?", translation: "Apakah sudah membaca unggahan cuaca ini?", audioFileName: "irodori-elementary1-04-a04-l01.mp3" },
  { speakerId: "akiko", japanese: <>はい。「台風が近づいています」と書いてあります。</>, romaji: "Hai. 'Taifuu ga chikazuite imasu' to kaite arimasu.", translation: "Ya. Tertulis, “Angin topan sedang mendekat.”", audioFileName: "irodori-elementary1-04-a04-l02.mp3" },
  { speakerId: "kenji", japanese: <>今夜から風が強くなるでしょうね。</>, romaji: "Konya kara kaze ga tsuyoku naru deshou ne.", translation: "Mulai malam ini anginnya mungkin akan menjadi kencang, ya.", audioFileName: "irodori-elementary1-04-a04-l03.mp3" },
  { speakerId: "akiko", japanese: <>そうですね。今日は家で過ごしましょう。</>, romaji: "Sou desu ne. Kyou wa ie de sugoshimashou.", translation: "Betul. Hari ini sebaiknya kita di rumah saja.", audioFileName: "irodori-elementary1-04-a04-l04.mp3" },
];

const changingWeatherConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>朝から風が強いですね。</>, romaji: "Asa kara kaze ga tsuyoi desu ne.", translation: "Sejak pagi anginnya kencang, ya.", audioFileName: "irodori-elementary1-04-a05-l01.mp3" },
  { speakerId: "sota", japanese: <>はい。雨も降っています。</>, romaji: "Hai. Ame mo futte imasu.", translation: "Iya. Hujan juga sedang turun.", audioFileName: "irodori-elementary1-04-a05-l02.mp3" },
  { speakerId: "yui", japanese: <>午後も雨でしょうか？</>, romaji: "Gogo mo ame deshou ka?", translation: "Apakah nanti sore juga akan hujan?", audioFileName: "irodori-elementary1-04-a05-l03.mp3" },
  { speakerId: "sota", japanese: <>天気予報では、夕方にはやむでしょう。</>, romaji: "Tenki yohou de wa, yuugata ni wa yamu deshou.", translation: "Menurut prakiraan cuaca, hujan mungkin berhenti menjelang sore.", audioFileName: "irodori-elementary1-04-a05-l04.mp3" },
];

const canDos = [
  { id: "greet-with-weather", text: "Bertukar sapaan sederhana sambil membicarakan keadaan cuaca." },
  { id: "understand-weather-forecast", text: "Mendengarkan prakiraan cuaca dan memahami sebagian besar informasi utamanya." },
  { id: "read-weather-post", text: "Membaca unggahan singkat tentang cuaca dan memahami informasi utamanya." },
  { id: "talk-about-past-weather", text: "Menceritakan cuaca hari sebelumnya dengan bentuk lampau yang sesuai." },
  { id: "describe-current-weather", text: "Menjelaskan keadaan cuaca yang sedang berlangsung dan perkiraan sederhananya." },
];

const weatherPosts = [
  {
    id: "morning",
    author: "ゆき",
    time: "08:10",
    japanese: "朝から雨が降っています。午後も雨でしょう。",
    reading: "Asa kara ame ga futte imasu. Gogo mo ame deshou.",
    translation: "Sejak pagi hujan turun. Sore nanti mungkin juga hujan.",
    detail: "Hujan mulai pagi dan diperkirakan berlanjut pada sore hari.",
  },
  {
    id: "typhoon",
    author: "そら",
    time: "11:45",
    japanese: "台風が近づいています。今夜は風が強くなるでしょう。",
    reading: "Taifuu ga chikazuite imasu. Konya wa kaze ga tsuyoku naru deshou.",
    translation: "Angin topan sedang mendekat. Malam ini angin mungkin akan menjadi kencang.",
    detail: "Ada angin topan yang mendekat dan angin diperkirakan menguat malam ini.",
  },
  {
    id: "sunny",
    author: "はる",
    time: "16:20",
    japanese: "昨日は大雨でしたが、今日はよく晴れています。",
    reading: "Kinou wa ooame deshita ga, kyou wa yoku harete imasu.",
    translation: "Kemarin hujan deras, tetapi hari ini cerah sekali.",
    detail: "Kemarin hujan deras, sedangkan hari ini cuacanya cerah.",
  },
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
    prompt: <>Ungkapan 「今日はいい天気ですね」 paling sesuai digunakan untuk …</>,
    options: [{ key: "a", label: "Berbagi komentar tentang cuaca dengan lawan bicara." }, { key: "b", label: "Memastikan jumlah barang." }, { key: "c", label: "Menanyakan harga." }],
    answer: "a",
    explanation: <>ね di akhir kalimat dapat dipakai untuk mencari atau menunjukkan kesamaan perasaan tentang keadaan yang sama-sama diketahui.</>,
  },
  {
    prompt: <>Pilih bentuk lampau yang tepat dari 「雨です」.</>,
    options: [{ key: "a", label: "雨でした。" }, { key: "b", label: "雨でしょう。" }, { key: "c", label: "雨ています。" }],
    answer: "a",
    explanation: <>でした adalah bentuk lampau sopan dari です. Untuk cuaca kemarin, gunakan bentuk lampau.</>,
  },
  {
    prompt: <>Apa arti 「今も雨が降っています」?</>,
    options: [{ key: "a", label: "Sekarang hujan masih turun." }, { key: "b", label: "Kemarin hujan turun." }, { key: "c", label: "Besok akan hujan." }],
    answer: "a",
    explanation: <>V-ています menjelaskan kegiatan atau keadaan yang sedang berlangsung saat ini.</>,
  },
  {
    prompt: <>Pilih bentuk perkiraan yang tepat: 「明日は晴れる ___。」</>,
    options: [{ key: "a", label: "でしょう" }, { key: "b", label: "でした" }, { key: "c", label: "ています" }],
    answer: "a",
    explanation: <>でしょう digunakan untuk menyatakan perkiraan atau kemungkinan, misalnya 明日は晴れるでしょう.</>,
  },
  {
    prompt: <>Prakiraan cuaca mengatakan 「午後から雨が降るでしょう」. Apa informasi utamanya?</>,
    options: [{ key: "a", label: "Kemungkinan hujan mulai sore." }, { key: "b", label: "Hujan sudah berhenti pagi tadi." }, { key: "c", label: "Besok pasti bersalju." }],
    answer: "a",
    explanation: <>午後から berarti mulai sore, sedangkan 降るでしょう menyatakan perkiraan bahwa hujan akan turun.</>,
  },
  {
    prompt: <>Pada unggahan 「台風が近づいています」, apa yang sedang terjadi?</>,
    options: [{ key: "a", label: "Angin topan sedang mendekat." }, { key: "b", label: "Angin topan sudah berlalu." }, { key: "c", label: "Cuaca sedang sangat cerah." }],
    answer: "a",
    explanation: <>近づいています adalah bentuk V-ています dari 近づく dan berarti sedang mendekat.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa fungsi 「ね」 pada 「今日は暑いですね」?</>,
    options: [{ key: "a", label: "Mengajak lawan bicara berbagi kesan tentang keadaan." }, { key: "b", label: "Menunjukkan tempat." }, { key: "c", label: "Menandai bentuk lampau." }],
    answer: "a",
    explanation: <>ね dapat menunjukkan simpati atau meminta persetujuan tentang hal yang sama-sama diketahui.</>,
  },
  {
    prompt: <>Pilih kalimat lampau yang berarti “Kemarin hujan.”</>,
    options: [{ key: "a", label: "昨日は雨でした。" }, { key: "b", label: "明日は雨でしょう。" }, { key: "c", label: "今、雨が降っています。" }],
    answer: "a",
    explanation: <>昨日 berarti kemarin dan 雨でした merupakan bentuk lampau dari 雨です.</>,
  },
  {
    prompt: <>Kalimat 「昨日は雪が降りました」 menjelaskan …</>,
    options: [{ key: "a", label: "Salju turun kemarin." }, { key: "b", label: "Salju sedang turun sekarang." }, { key: "c", label: "Besok mungkin turun salju." }],
    answer: "a",
    explanation: <>降りました adalah bentuk lampau sopan dari 降ります.</>,
  },
  {
    prompt: <>Apa arti 「風が強くなっています」?</>,
    options: [{ key: "a", label: "Angin sedang menjadi semakin kencang." }, { key: "b", label: "Angin sudah berhenti kemarin." }, { key: "c", label: "Angin akan selalu lemah." }],
    answer: "a",
    explanation: <>V-ています dapat menjelaskan perubahan atau keadaan yang sedang berlangsung.</>,
  },
  {
    prompt: <>Bentuk kamus 「降ります」 adalah …</>,
    options: [{ key: "a", label: "降る" }, { key: "b", label: "降った" }, { key: "c", label: "降って" }],
    answer: "a",
    explanation: <>降る adalah bentuk kamus yang digunakan sebelum でしょう, misalnya 雨が降るでしょう.</>,
  },
  {
    prompt: <>Lengkapi prakiraan: 「明日は晴れる ___。」</>,
    options: [{ key: "a", label: "でしょう" }, { key: "b", label: "でした" }, { key: "c", label: "ています" }],
    answer: "a",
    explanation: <>でしょう menyampaikan perkiraan: besok kemungkinan akan cerah.</>,
  },
  {
    prompt: <>Apa arti 「天気予報」?</>,
    options: [{ key: "a", label: "Prakiraan cuaca." }, { key: "b", label: "Peta kota." }, { key: "c", label: "Jadwal kereta." }],
    answer: "a",
    explanation: <>天気 berarti cuaca dan 予報 berarti perkiraan atau ramalan.</>,
  },
  {
    prompt: <>Pada unggahan 「今夜から風が強くなるでしょう」, kapan angin diperkirakan menguat?</>,
    options: [{ key: "a", label: "Mulai malam ini." }, { key: "b", label: "Kemarin pagi." }, { key: "c", label: "Minggu lalu." }],
    answer: "a",
    explanation: <>今夜から berarti mulai malam ini, dan 強くなるでしょう menyatakan perkiraan angin akan menguat.</>,
  },
  {
    prompt: <>Apa informasi utama dari 「昨日は大雨でしたが、今日は晴れています」?</>,
    options: [{ key: "a", label: "Kemarin hujan deras, tetapi hari ini cerah." }, { key: "b", label: "Kemarin cerah dan hari ini salju turun." }, { key: "c", label: "Besok hujan deras sepanjang hari." }],
    answer: "a",
    explanation: <>昨日は大雨でした adalah keadaan kemarin, sedangkan 今日は晴れています menjelaskan cuaca hari ini.</>,
  },
  {
    prompt: <>Jika membaca unggahan bahwa angin topan sedang mendekat dan angin diperkirakan menguat, respons yang paling aman adalah …</>,
    options: [{ key: "a", label: "Mengikuti informasi resmi dan tetap berada di tempat yang aman." }, { key: "b", label: "Pergi keluar untuk melihat anginnya." }, { key: "c", label: "Mengabaikan semua informasi cuaca." }],
    answer: "a",
    explanation: <>Saat cuaca berbahaya diperkirakan, utamakan informasi resmi dan hindari keluar untuk melihat kondisi secara langsung.</>,
  },
];

const simulations = [
  {
    title: "01 · Bertukar sapaan tentang cuaca",
    heading: "Menanggapi komentar cuaca",
    prompt: "Yui menyapa Sota pada pagi yang cerah dan berkata bahwa cuacanya bagus.",
    japanese: <>今日はいい天気ですね。</>,
    translation: "Cuaca bagus hari ini, ya.",
    options: [
      { key: "agree", label: "そうですね。気持ちがいいですね。", meaning: "Iya, ya. Rasanya menyenangkan." },
      { key: "past", label: "昨日は雨でした。", meaning: "Kemarin hujan." },
      { key: "forecast", label: "明日は雨でしょう。", meaning: "Besok mungkin hujan." },
    ],
    answer: "agree",
    explanation: "そうですね adalah tanggapan alami untuk menunjukkan kesamaan kesan tentang cuaca.",
  },
  {
    title: "02 · Menceritakan cuaca kemarin",
    heading: "Menggunakan bentuk lampau",
    prompt: "Akiko ingin mengatakan bahwa kemarin hujan deras.",
    japanese: <>昨日の天気はどうでしたか？</>,
    translation: "Bagaimana cuaca kemarin?",
    options: [
      { key: "past", label: "昨日はすごい雨でした。", meaning: "Kemarin hujannya deras sekali." },
      { key: "now", label: "今、雨が降っています。", meaning: "Sekarang hujan sedang turun." },
      { key: "future", label: "明日は晴れるでしょう。", meaning: "Besok mungkin cerah." },
    ],
    answer: "past",
    explanation: "昨日 menunjukkan waktu lampau, sehingga bentuk でした sesuai untuk menjelaskan cuaca kemarin.",
  },
  {
    title: "03 · Menjelaskan keadaan saat ini",
    heading: "Hujan masih turun",
    prompt: "Sota ingin menjelaskan bahwa hujan masih turun sekarang.",
    japanese: <>今も雨が降っていますか？</>,
    translation: "Apakah sekarang hujan masih turun?",
    options: [
      { key: "ongoing", label: "はい、雨が降っています。", meaning: "Ya, hujan sedang turun." },
      { key: "past", label: "はい、雨が降りました。", meaning: "Ya, hujan sudah turun (lampau)." },
      { key: "forecast", label: "はい、雨が降るでしょう。", meaning: "Ya, kemungkinan akan hujan." },
    ],
    answer: "ongoing",
    explanation: "V-ています dipakai untuk menyatakan keadaan yang sedang berlangsung saat ini.",
  },
  {
    title: "04 · Memahami prakiraan cuaca",
    heading: "Menyebut kemungkinan besok",
    prompt: "Prakiraan mengatakan bahwa besok cuaca kemungkinan akan cerah.",
    japanese: <>明日の天気はどうでしょうか？</>,
    translation: "Bagaimana kira-kira cuaca besok?",
    options: [
      { key: "forecast", label: "明日は晴れるでしょう。", meaning: "Besok kemungkinan akan cerah." },
      { key: "past", label: "昨日は晴れでした。", meaning: "Kemarin cerah." },
      { key: "ongoing", label: "今、晴れています。", meaning: "Sekarang sedang cerah." },
    ],
    answer: "forecast",
    explanation: "でしょう diletakkan setelah bentuk kamus kata kerja untuk menyatakan perkiraan.",
  },
  {
    title: "05 · Membaca unggahan cuaca",
    heading: "Memahami informasi tentang angin topan",
    prompt: "Kamu membaca unggahan: 「台風が近づいています。今夜から風が強くなるでしょう。」",
    japanese: <>この書き込みの内容は何ですか？</>,
    translation: "Apa isi unggahan ini?",
    options: [
      { key: "safe", label: "Angin topan mendekat dan angin mungkin menguat malam ini.", meaning: "Pahami informasinya dan utamakan keselamatan." },
      { key: "sunny", label: "Besok pasti cerah sepanjang hari.", meaning: "Tidak sesuai dengan isi unggahan." },
      { key: "past", label: "Angin topan sudah berlalu kemarin.", meaning: "Tidak sesuai dengan bentuk waktu pada unggahan." },
    ],
    answer: "safe",
    explanation: "近づいています berarti sedang mendekat, sedangkan 強くなるでしょう adalah perkiraan angin akan menguat.",
  },
];

const vocabulary = [
  ["天気", "てんき · tenki", "Cuaca"],
  ["晴れ", "はれ · hare", "Cerah"],
  ["晴れる", "はれる · hareru", "Menjadi cerah"],
  ["曇り", "くもり · kumori", "Berawan"],
  ["雨", "あめ · ame", "Hujan"],
  ["大雨", "おおあめ · ooame", "Hujan deras"],
  ["雪", "ゆき · yuki", "Salju"],
  ["風", "かぜ · kaze", "Angin"],
  ["強い", "つよい · tsuyoi", "Kuat"],
  ["弱い", "よわい · yowai", "Lemah"],
  ["降る", "ふる · furu", "Turun (hujan/salju)"],
  ["やむ", "やむ · yamu", "Berhenti (hujan/salju)"],
  ["吹く", "ふく · fuku", "Bertiup"],
  ["天気予報", "てんきよほう · tenki yohou", "Prakiraan cuaca"],
  ["予報", "よほう · yohou", "Prakiraan"],
  ["気温", "きおん · kion", "Suhu udara"],
  ["台風", "たいふう · taifuu", "Angin topan"],
  ["近づく", "ちかづく · chikazuku", "Mendekat"],
  ["今", "いま · ima", "Sekarang"],
  ["昨日", "きのう · kinou", "Kemarin"],
  ["明日", "あした · ashita", "Besok"],
  ["毎日", "まいにち · mainichi", "Setiap hari"],
  ["傘", "かさ · kasa", "Payung"],
  ["午前", "ごぜん · gozen", "Pagi / sebelum tengah hari"],
  ["午後", "ごご · gogo", "Sore / setelah tengah hari"],
];

const kanjiWords = [
  ["天気", "てんき · tenki", "Cuaca"],
  ["晴れ", "はれ · hare", "Cerah"],
  ["雨", "あめ · ame", "Hujan"],
  ["雪", "ゆき · yuki", "Salju"],
  ["風", "かぜ · kaze", "Angin"],
  ["今", "いま · ima", "Sekarang"],
  ["昨日", "きのう · kinou", "Kemarin"],
  ["明日", "あした · ashita", "Besok"],
  ["毎日", "まいにち · mainichi", "Setiap hari"],
  ["強い", "つよい · tsuyoi", "Kuat"],
];
export default function IrodoriElementaryOneLessonFourPage() {
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
          <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">IRODORI • DASAR 1 A2 • PELAJARAN 04</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Kemarin hujan deras.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9CDB0]">昨日はすごい雨でしたね</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Berlatih menyapa sambil membicarakan cuaca, memahami prakiraan cuaca, dan membaca unggahan singkat tentang keadaan cuaca.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9CDB0]" />Sapaan & cuaca</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#A9CDB0]" />Prakiraan cuaca</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#A9CDB0]" />Info cuaca</span>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Cuaca, prakiraan, dan informasi harian</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata untuk membicarakan keadaan cuaca, prakiraan, dan perubahan cuaca.</p>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membicarakan cuaca hari ini dan kemarin</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan cara bertukar sapaan, menceritakan cuaca kemarin, memahami prakiraan, dan membaca informasi cuaca singkat.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Bertukar sapaan tentang cuaca" speakers={[speakers.yui, speakers.sota]} utterances={weatherGreetingConversation} />
          <IrodoriConversation title="Menceritakan hujan kemarin" speakers={[speakers.akiko, speakers.kenji]} utterances={yesterdayRainConversation} />
          <IrodoriConversation title="Membicarakan prakiraan cuaca" speakers={[speakers.sota, speakers.yui]} utterances={forecastConversation} />
          <IrodoriConversation title="Membaca unggahan tentang angin topan" speakers={[speakers.kenji, speakers.akiko]} utterances={weatherPostConversation} />
          <IrodoriConversation title="Membicarakan perubahan cuaca" speakers={[speakers.yui, speakers.sota]} utterances={changingWeatherConversation} />
        </div>
      </section>


      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">BACA UNGGAHAN CUACA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pahami informasi singkat</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Baca isi unggahan, perhatikan waktu yang disebutkan, lalu simpulkan keadaan cuaca atau perkiraannya.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {weatherPosts.map((post) => (
            <article key={post.id} className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <div className="flex items-center justify-between gap-3 text-[10px]">
                <span className="font-bold text-[#A9CDB0]">@{post.author}</span>
                <span className="text-[#817A73]">{post.time}</span>
              </div>
              <p className="mt-3 font-mincho text-base leading-8 text-[#F1EBDD]">{post.japanese}</p>
              <p className="mt-2 text-[10px] italic leading-5 text-[#A9CDB0]">{post.reading}</p>
              <p className="mt-2 text-xs leading-5 text-[#D0C9BD]">{post.translation}</p>
              <p className="mt-3 rounded-lg bg-black/20 p-2 text-[10px] leading-5 text-[#A9A398]">{post.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membicarakan cuaca dan perkiraannya</h2>
        </div>
        {[
          {
            title: "01 · Menunjukkan kesamaan kesan dengan ね",
            pattern: "S + ね",
            example: <>今日はいい天気ですね。／ だいぶ暖かくなりましたね。</>,
            note: "ね di akhir kalimat dapat digunakan untuk mencari simpati atau menunjukkan bahwa pembicara dan pendengar memiliki kesan yang sama. Topik cuaca sering digunakan untuk memulai percakapan karena mudah dibagikan dengan siapa saja.",
          },
          {
            title: "02 · Membedakan bentuk non-lampau dan lampau",
            pattern: "Sekarang: Nです / イA-いです / V-ます · Lampau: Nでした / イA-かったです / V-ました",
            example: <>今日は雨です。／ 昨日はすごい雨でした。／ 昨日は雨が降りました。</>,
            note: "Gunakan bentuk non-lampau untuk cuaca saat ini atau keadaan umum. Untuk membicarakan cuaca kemarin, gunakan bentuk lampau. Contoh: 暑いです → 暑かったです, 雨です → 雨でした, 降ります → 降りました.",
          },
          {
            title: "03 · Menyatakan keadaan yang sedang berlangsung dengan V-ています",
            pattern: "V-て + います",
            example: <>今も少し雨が降っています。／ 風が強くなっています。</>,
            note: "V-ています menjelaskan tindakan atau keadaan yang sedang berlangsung saat ini. 降ります berubah menjadi 降って lalu ditambah います. Pola ini dapat digunakan untuk hujan yang masih turun atau angin yang sedang menguat.",
          },
          {
            title: "04 · Memperkirakan cuaca dengan でしょう",
            pattern: "N / ナA / イA-い / V-る + でしょう",
            example: <>明日は晴れるでしょう。／ 午後は雨でしょう。／ 風は強いでしょう。</>,
            note: "でしょう digunakan untuk menyampaikan perkiraan atau kemungkinan. Kata benda, kata sifat な, kata sifat い, dan kata kerja bentuk kamus dapat diikuti でしょう. Contoh: 雨でしょう, 静かでしょう, 寒いでしょう, 雪が降るでしょう. Perkiraan bukan kepastian.",
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9CDB0]">CAN-DO CHECK</p>
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
        Dialog, tokoh, dan situasi latihan dibuat orisinal oleh Fude sebagai latihan komunikasi tentang cuaca sehari-hari.
      </p>
    </main>
  );
}
