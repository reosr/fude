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
const lessonId = "elementary1-06";

const askingBusStopConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>すみません。バス停はどこですか。</>, romaji: "Sumimasen. Basutei wa doko desu ka?", translation: "Permisi. Di mana halte bus?", audioFileName: "irodori-elementary1-06-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>この道をまっすぐ行ってください。</>, romaji: "Kono michi o massugu itte kudasai.", translation: "Jalan lurus saja menyusuri jalan ini.", audioFileName: "irodori-elementary1-06-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>信号の近くですか。</>, romaji: "Shingou no chikaku desu ka?", translation: "Apakah dekat lampu lalu lintas?", audioFileName: "irodori-elementary1-06-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>はい。公園の前にあります。</>, romaji: "Hai. Kouen no mae ni arimasu.", translation: "Iya. Letaknya di depan taman.", audioFileName: "irodori-elementary1-06-a01-l04.mp3" },
  { speakerId: "yui", japanese: <>わかりました。ありがとうございます。</>, romaji: "Wakarimashita. Arigatou gozaimasu.", translation: "Baik, saya mengerti. Terima kasih.", audioFileName: "irodori-elementary1-06-a01-l05.mp3" },
];

const askingByPhoneConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>もしもし。郵便局に行きたいんですが…。</>, romaji: "Moshi moshi. Yuubinkyoku ni ikitaindesuga...", translation: "Halo. Saya ingin pergi ke kantor pos…", audioFileName: "irodori-elementary1-06-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>はい。今、どちらにいますか。</>, romaji: "Hai. Ima, dochira ni imasu ka?", translation: "Baik. Sekarang Anda berada di mana?", audioFileName: "irodori-elementary1-06-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>駅の前にいます。どう行ったらいいですか。</>, romaji: "Eki no mae ni imasu. Dou ittara ii desu ka?", translation: "Saya berada di depan stasiun. Sebaiknya lewat mana?", audioFileName: "irodori-elementary1-06-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>駅を出て、右に曲がってください。</>, romaji: "Eki o dete, migi ni magatte kudasai.", translation: "Keluar dari stasiun, lalu belok ke kanan.", audioFileName: "irodori-elementary1-06-a02-l04.mp3" },
];

const postOfficeDirectionsConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>そのあと、どうしますか。</>, romaji: "Sono ato, dou shimasu ka?", translation: "Setelah itu, harus bagaimana?", audioFileName: "irodori-elementary1-06-a03-l01.mp3" },
  { speakerId: "kenji", japanese: <>まっすぐ行って、銀行の前を通ってください。</>, romaji: "Massugu itte, ginkou no mae o tootte kudasai.", translation: "Jalan lurus, lalu lewat di depan bank.", audioFileName: "irodori-elementary1-06-a03-l02.mp3" },
  { speakerId: "akiko", japanese: <>郵便局はどこにありますか。</>, romaji: "Yuubinkyoku wa doko ni arimasu ka?", translation: "Di mana kantor posnya?", audioFileName: "irodori-elementary1-06-a03-l03.mp3" },
  { speakerId: "kenji", japanese: <>二つ目の信号の左側にありますよ。</>, romaji: "Futatsume no shingou no hidari gawa ni arimasu yo.", translation: "Letaknya di sebelah kiri lampu lalu lintas kedua.", audioFileName: "irodori-elementary1-06-a03-l04.mp3" },
];

const givingDirectionsByCarConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>家まで送ってもらえますか。</>, romaji: "Ie made okutte moraemasu ka?", translation: "Bisakah saya diantar sampai rumah?", audioFileName: "irodori-elementary1-06-a04-l01.mp3" },
  { speakerId: "sota", japanese: <>いいですよ。家はどこですか。</>, romaji: "Ii desu yo. Ie wa doko desu ka?", translation: "Tentu. Rumahmu di mana?", audioFileName: "irodori-elementary1-06-a04-l02.mp3" },
  { speakerId: "yui", japanese: <>この先に白くて大きな家があります。</>, romaji: "Kono saki ni shirokute ookina ie ga arimasu.", translation: "Di depan sana ada rumah besar berwarna putih.", audioFileName: "irodori-elementary1-06-a04-l03.mp3" },
  { speakerId: "sota", japanese: <>この角を右に曲がりますか。</>, romaji: "Kono kado o migi ni magarimasu ka?", translation: "Apakah belok kanan di sudut ini?", audioFileName: "irodori-elementary1-06-a04-l04.mp3" },
];

const correctingDirectionsConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>この道をまっすぐですね。</>, romaji: "Kono michi o massugu desu ne.", translation: "Ikuti jalan ini lurus, ya.", audioFileName: "irodori-elementary1-06-a05-l01.mp3" },
  { speakerId: "akiko", japanese: <>はい。でも、1つ目の角じゃなくて、2つ目です。</>, romaji: "Hai. Demo, hitotsume no kado ja nakute, futatsume desu.", translation: "Ya, tetapi bukan di belokan pertama, melainkan di belokan kedua.", audioFileName: "irodori-elementary1-06-a05-l02.mp3" },
  { speakerId: "kenji", japanese: <>わかりました。2つ目を左ですね。</>, romaji: "Wakarimashita. Futatsume o hidari desu ne.", translation: "Oke, berarti belok kiri di belokan kedua, ya.", audioFileName: "irodori-elementary1-06-a05-l03.mp3" },
  { speakerId: "akiko", japanese: <>そうです。ありがとうございます。</>, romaji: "Sou desu. Arigatou gozaimasu.", translation: "Betul. Terima kasih.", audioFileName: "irodori-elementary1-06-a05-l04.mp3" },
];

const canDos = [
  { id: "ask-directions-in-person", text: "Meminta dan memahami petunjuk arah ketika bertanya langsung kepada seseorang." },
  { id: "ask-directions-by-phone", text: "Meminta dan memahami petunjuk arah melalui telepon." },
  { id: "give-directions-by-car", text: "Memberi petunjuk menuju tujuan ketika seseorang mengantar dengan mobil." },
  { id: "sequence-route-instructions", text: "Menyampaikan urutan arah dengan menghubungkan beberapa tindakan menggunakan bentuk ～て." },
  { id: "clarify-landmark-number", text: "Meluruskan informasi lokasi dengan pola ～じゃなくて～." },
];

const townRoutes = [
  {
    id: "bus-stop",
    title: "駅からバス停まで",
    subtitle: "Dari stasiun ke halte bus",
    steps: [
      "駅を出てください。 — Keluar dari stasiun.",
      "この道をまっすぐ行ってください。 — Jalan lurus melalui jalan ini.",
      "公園の前にバス停があります。 — Halte bus berada di depan taman.",
    ],
    destination: "バス停 · Halte bus",
  },
  {
    id: "post-office",
    title: "駅から郵便局まで",
    subtitle: "Dari stasiun ke kantor pos",
    steps: [
      "駅を出て、右に曲がってください。 — Keluar dari stasiun, lalu belok kanan.",
      "まっすぐ行って、銀行の前を通ってください。 — Jalan lurus dan lewati bagian depan bank.",
      "二つ目の信号を左に曲がると、右側に郵便局があります。 — Belok kiri di lampu lalu lintas kedua; kantor pos ada di sebelah kanan.",
    ],
    destination: "郵便局 · Kantor pos",
  },
  {
    id: "white-house",
    title: "車で家まで",
    subtitle: "Petunjuk saat diantar dengan mobil",
    steps: [
      "この先に白くて大きな家があります。 — Di depan sana ada rumah besar berwarna putih.",
      "一つ目の角じゃなくて、二つ目の角です。 — Bukan sudut pertama, melainkan sudut kedua.",
      "二つ目の角を右に曲がってください。 — Silakan belok kanan di sudut kedua.",
    ],
    destination: "白くて大きな家 · Rumah besar berwarna putih",
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
    prompt: <>Ungkapan 「郵便局に行きたいんですが…」 digunakan untuk …</>,
    options: [{ key: "a", label: "Menyampaikan tujuan yang ingin dituju sebelum bertanya." }, { key: "b", label: "Mengucapkan terima kasih setelah sampai." }, { key: "c", label: "Menceritakan kegiatan kemarin." }],
    answer: "a",
    explanation: <>Nに行きたいんですが… menyampaikan tempat tujuan yang ingin dikunjungi sebagai pembuka permintaan atau pertanyaan.</>,
  },
  {
    prompt: <>Pilih ungkapan yang berarti “belok ke kanan”.</>,
    options: [{ key: "a", label: "右に曲がってください。" }, { key: "b", label: "左に曲がってください。" }, { key: "c", label: "まっすぐ行ってください。" }],
    answer: "a",
    explanation: <>右（みぎ）berarti kanan, 左（ひだり）berarti kiri, dan 曲がる berarti berbelok.</>,
  },
  {
    prompt: <>Lengkapi urutan petunjuk: 「駅を出て、右に ___ ください。」</>,
    options: [{ key: "a", label: "曲がって" }, { key: "b", label: "曲がる" }, { key: "c", label: "曲がりました" }],
    answer: "a",
    explanation: <>Bentuk ～て menghubungkan tindakan yang berurutan. 曲がる berubah menjadi 曲がって.</>,
  },
  {
    prompt: <>Pada petunjuk 「二つ目の信号を左に曲がってください」, apa yang harus dilakukan?</>,
    options: [{ key: "a", label: "Belok kiri di lampu lalu lintas kedua." }, { key: "b", label: "Belok kanan di lampu lalu lintas pertama." }, { key: "c", label: "Berhenti di lampu lalu lintas pertama." }],
    answer: "a",
    explanation: <>二つ目 berarti yang kedua, sedangkan 左に曲がる berarti belok ke kiri.</>,
  },
  {
    prompt: <>Pilih arti 「1つ目じゃなくて、2つ目です」.</>,
    options: [{ key: "a", label: "Bukan yang pertama, melainkan yang kedua." }, { key: "b", label: "Yang pertama dan yang kedua." }, { key: "c", label: "Bukan yang kedua, melainkan yang pertama." }],
    answer: "a",
    explanation: <>じゃなくて digunakan untuk menyangkal informasi pertama lalu menggantinya dengan informasi yang benar.</>,
  },
  {
    prompt: <>Kalimat 「この先に白くて大きな家があります」 memberi petunjuk tentang …</>,
    options: [{ key: "a", label: "Ciri rumah yang menjadi penanda lokasi di depan." }, { key: "b", label: "Jadwal bus dari stasiun." }, { key: "c", label: "Harga tiket kereta." }],
    answer: "a",
    explanation: <>この先 berarti di depan sana, 白くて大きな家 berarti rumah besar berwarna putih.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa maksud 「銀行に行きたいんですが…」?</>,
    options: [{ key: "a", label: "Saya ingin pergi ke bank…" }, { key: "b", label: "Saya sudah pulang dari bank." }, { key: "c", label: "Bank berada di sebelah kiri." }],
    answer: "a",
    explanation: <>Nに行きたいんですが… digunakan untuk menyampaikan tujuan yang ingin didatangi sebelum meminta informasi.</>,
  },
  {
    prompt: <>Kata 「右」 dibaca dan berarti …</>,
    options: [{ key: "a", label: "みぎ · kanan" }, { key: "b", label: "ひだり · kiri" }, { key: "c", label: "みち · jalan" }],
    answer: "a",
    explanation: <>右 dibaca みぎ (migi) dan berarti kanan.</>,
  },
  {
    prompt: <>Apa arti 「この道をまっすぐ行ってください」?</>,
    options: [{ key: "a", label: "Ikuti jalan ini lurus saja." }, { key: "b", label: "Silakan belok kiri di jalan ini." }, { key: "c", label: "Silakan kembali ke stasiun." }],
    answer: "a",
    explanation: <>まっすぐ berarti lurus, dan 行ってください merupakan bentuk permintaan sopan dari 行く.</>,
  },
  {
    prompt: <>Bentuk ～て dari 「曲がります」 adalah …</>,
    options: [{ key: "a", label: "曲がって" }, { key: "b", label: "曲がる" }, { key: "c", label: "曲がりました" }],
    answer: "a",
    explanation: <>曲がる adalah kata kerja kelompok 1; bentuk ～て-nya adalah 曲がって.</>,
  },
  {
    prompt: <>Ungkapan 「二つ目の信号」 berarti …</>,
    options: [{ key: "a", label: "Lampu lalu lintas yang kedua." }, { key: "b", label: "Lampu lalu lintas yang pertama." }, { key: "c", label: "Lampu lalu lintas terakhir." }],
    answer: "a",
    explanation: <>二つ目（ふたつめ）berarti urutan kedua.</>,
  },
  {
    prompt: <>Kalimat 「1つ目じゃなくて、2つ目です」 digunakan untuk …</>,
    options: [{ key: "a", label: "Mengoreksi pilihan pertama menjadi pilihan kedua." }, { key: "b", label: "Menggabungkan dua tempat." }, { key: "c", label: "Menjelaskan arah lurus." }],
    answer: "a",
    explanation: <>じゃなくて menyatakan “bukan yang ini, melainkan yang itu”.</>,
  },
  {
    prompt: <>Apa arti 「郵便局」?</>,
    options: [{ key: "a", label: "Kantor pos." }, { key: "b", label: "Bank." }, { key: "c", label: "Halte bus." }],
    answer: "a",
    explanation: <>郵便局 dibaca ゆうびんきょく (yuubinkyoku) dan berarti kantor pos.</>,
  },
  {
    prompt: <>Pada kalimat 「公園の近くに銀行があります」, bank berada di mana?</>,
    options: [{ key: "a", label: "Di dekat taman." }, { key: "b", label: "Di dalam mobil." }, { key: "c", label: "Jauh dari taman." }],
    answer: "a",
    explanation: <>公園の近く berarti di dekat taman.</>,
  },
  {
    prompt: <>Apa arti 「車で送ります」 dalam konteks seseorang mengantar teman?</>,
    options: [{ key: "a", label: "Mengantar dengan mobil." }, { key: "b", label: "Mengirim surat dengan mobil." }, { key: "c", label: "Membeli mobil." }],
    answer: "a",
    explanation: <>送る dapat berarti mengantar seseorang; 車で menunjukkan bahwa perjalanan dilakukan dengan mobil.</>,
  },
  {
    prompt: <>Pilih kalimat yang memberi petunjuk lokasi paling jelas.</>,
    options: [{ key: "a", label: "二つ目の信号を左に曲がってください。" }, { key: "b", label: "あそこです。" }, { key: "c", label: "わかりません。" }],
    answer: "a",
    explanation: <>Kalimat itu menyebutkan penanda urutan (信号), urutan kedua (二つ目), dan arah belok (左).</>,
  },
];

const simulations = [
  {
    title: "01 · Bertanya arah secara langsung",
    heading: "Menemukan halte bus",
    prompt: "Yui sedang berada di dekat stasiun. Ia bertanya kepada Sota lokasi halte bus.",
    japanese: <>すみません。バス停はどこですか。</>,
    translation: "Permisi. Di mana halte bus?",
    options: [
      { key: "straight", label: "この道をまっすぐ行ってください。", meaning: "Ikuti jalan ini lurus saja." },
      { key: "past", label: "昨日は雨でした。", meaning: "Kemarin hujan." },
      { key: "phone", label: "もしもし。元気ですか。", meaning: "Halo. Apa kabar?" },
    ],
    answer: "straight",
    explanation: "Jawaban ini memberikan petunjuk arah langsung dengan menyebut jalan yang harus diikuti.",
  },
  {
    title: "02 · Meminta petunjuk melalui telepon",
    heading: "Menyampaikan tujuan",
    prompt: "Akiko menelepon untuk bertanya jalan menuju kantor pos.",
    japanese: <>郵便局に行きたいんですが…。</>,
    translation: "Saya ingin pergi ke kantor pos…",
    options: [
      { key: "destination", label: "駅からどう行ったらいいですか。", meaning: "Sebaiknya lewat mana dari stasiun?" },
      { key: "weather", label: "今日はいい天気ですね。", meaning: "Cuaca hari ini bagus, ya." },
      { key: "food", label: "何を食べますか。", meaning: "Apa yang akan dimakan?" },
    ],
    answer: "destination",
    explanation: "Ungkapan ini melanjutkan pembuka dengan pertanyaan tentang rute dari stasiun.",
  },
  {
    title: "03 · Mengikuti urutan petunjuk",
    heading: "Jalan lurus lalu belok",
    prompt: "Petunjuk menuju kantor pos meminta Akiko berjalan lurus dan kemudian belok kiri di lampu lalu lintas kedua.",
    japanese: <>次はどうしたらいいですか。</>,
    translation: "Selanjutnya, apa yang harus saya lakukan?",
    options: [
      { key: "route", label: "まっすぐ行って、二つ目の信号を左に曲がってください。", meaning: "Jalan lurus, lalu belok kiri di lampu lalu lintas kedua." },
      { key: "opposite", label: "一つ目の信号を右に曲がってください。", meaning: "Belok kanan di lampu lalu lintas pertama." },
      { key: "stop", label: "ここで待ってください。", meaning: "Silakan menunggu di sini." },
    ],
    answer: "route",
    explanation: "Bentuk ～て menghubungkan tindakan yang dilakukan secara berurutan.",
  },
  {
    title: "04 · Memastikan urutan lokasi",
    heading: "Bukan sudut pertama",
    prompt: "Kenji hampir berbelok di sudut pertama. Akiko ingin menjelaskan bahwa belokannya di sudut kedua.",
    japanese: <>どの角を曲がりますか。</>,
    translation: "Di sudut yang mana harus belok?",
    options: [
      { key: "second", label: "一つ目じゃなくて、二つ目です。", meaning: "Bukan yang pertama, melainkan yang kedua." },
      { key: "first", label: "一つ目です。", meaning: "Yang pertama." },
      { key: "straight", label: "まっすぐ行きます。", meaning: "Jalan lurus." },
    ],
    answer: "second",
    explanation: "じゃなくて membetulkan informasi pertama dengan menyebutkan informasi yang benar.",
  },
  {
    title: "05 · Memberi petunjuk saat diantar",
    heading: "Menjelaskan penanda rumah",
    prompt: "Sota mengantar Yui dengan mobil. Yui perlu memberi tahu rumah yang dituju tanpa membuat pengemudi menebak.",
    japanese: <>家はどこですか。</>,
    translation: "Rumahmu di mana?",
    options: [
      { key: "house", label: "この先に白くて大きな家があります。", meaning: "Di depan sana ada rumah besar berwarna putih." },
      { key: "shop", label: "駅の近くに店があります。", meaning: "Ada toko dekat stasiun." },
      { key: "weather", label: "明日は晴れるでしょう。", meaning: "Besok mungkin cerah." },
    ],
    answer: "house",
    explanation: "Petunjuk menyebutkan ciri rumah sebagai penanda lokasi. Pengemudi tetap mengikuti kondisi jalan dan aturan lalu lintas.",
  },
];

const vocabulary = [
  ["道", "みち · michi", "Jalan"],
  ["公園", "こうえん · kouen", "Taman"],
  ["銀行", "ぎんこう · ginkou", "Bank"],
  ["お寺", "おてら · otera", "Kuil Buddha"],
  ["神社", "じんじゃ · jinja", "Kuil Shinto"],
  ["右", "みぎ · migi", "Kanan"],
  ["左", "ひだり · hidari", "Kiri"],
  ["近く", "ちかく · chikaku", "Dekat / sekitar"],
  ["車", "くるま · kuruma", "Mobil"],
  ["送る", "おくる · okuru", "Mengantar seseorang"],
  ["郵便局", "ゆうびんきょく · yuubinkyoku", "Kantor pos"],
  ["バス停", "バスてい · basutei", "Halte bus"],
  ["信号", "しんごう · shingou", "Lampu lalu lintas"],
  ["角", "かど · kado", "Tikungan / sudut jalan"],
  ["交差点", "こうさてん · kousaten", "Persimpangan"],
  ["まっすぐ", "まっすぐ · massugu", "Lurus"],
  ["曲がる", "まがる · magaru", "Berbelok"],
  ["渡る", "わたる · wataru", "Menyeberang"],
  ["出る", "でる · deru", "Keluar"],
  ["前", "まえ · mae", "Depan"],
  ["この先", "このさき · kono saki", "Di depan sana"],
  ["一つ目", "ひとつめ · hitotsume", "Yang pertama"],
  ["二つ目", "ふたつめ · futatsume", "Yang kedua"],
  ["行きたい", "いきたい · ikitai", "Ingin pergi"],
  ["そちら", "そちら · sochira", "Ke arah sana / tempat Anda"],
];

const kanjiWords = [
  ["道", "みち · michi", "Jalan"],
  ["公園", "こうえん · kouen", "Taman"],
  ["銀行", "ぎんこう · ginkou", "Bank"],
  ["お寺", "おてら · otera", "Kuil Buddha"],
  ["神社", "じんじゃ · jinja", "Kuil Shinto"],
  ["右", "みぎ · migi", "Kanan"],
  ["左", "ひだり · hidari", "Kiri"],
  ["近く", "ちかく · chikaku", "Dekat / sekitar"],
  ["車", "くるま · kuruma", "Mobil"],
  ["送る", "おくる · okuru", "Mengantar seseorang"],
];

export default function IrodoriElementaryOneLessonSixPage() {
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
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#91B99A]/[0.08]">道</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">IRODORI • DASAR 1 A2 • PELAJARAN 06</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Tolong beri tahu jalan ke kantor pos.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9CDB0]">郵便局はどう行ったらいいですか</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Berlatih meminta dan memahami petunjuk arah secara langsung maupun melalui telepon, serta memberi petunjuk lokasi saat menjadi penumpang.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9CDB0]" />Bertanya arah</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#A9CDB0]" />Petunjuk lewat telepon</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#A9CDB0]" />Memberi petunjuk lokasi</span>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Jalan, arah, dan tempat tujuan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata untuk menanyakan jalan, memahami petunjuk arah, dan menyebutkan lokasi penanda.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {vocabulary.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9CDB0]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Meminta dan memberikan petunjuk arah</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan cara bertanya arah secara langsung dan lewat telepon, serta menjelaskan rute dengan urutan yang jelas.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Bertanya lokasi halte bus" speakers={[speakers.yui, speakers.sota]} utterances={askingBusStopConversation} />
          <IrodoriConversation title="Meminta petunjuk melalui telepon" speakers={[speakers.akiko, speakers.kenji]} utterances={askingByPhoneConversation} />
          <IrodoriConversation title="Memahami rute ke kantor pos" speakers={[speakers.sota, speakers.yui]} utterances={postOfficeDirectionsConversation} />
          <IrodoriConversation title="Memberi petunjuk saat diantar" speakers={[speakers.kenji, speakers.akiko]} utterances={givingDirectionsByCarConversation} />
          <IrodoriConversation title="Mengoreksi urutan belokan" speakers={[speakers.yui, speakers.sota]} utterances={correctingDirectionsConversation} />
        </div>
      </section>


      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">PETA RUTE & PETUNJUK ARAH</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Ikuti petunjuk langkah demi langkah</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan urutan tindakan, arah belok, dan penanda seperti taman, bank, serta lampu lalu lintas. Peta ini adalah skema belajar sederhana, bukan navigasi jalan sebenarnya.</p>
        </div>
        <article className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4 md:p-5">
          <p className="text-[9px] font-black tracking-[0.18em] text-[#A9CDB0]">ROUTE GUIDE · 道案内</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              { title: "駅", meaning: "Stasiun", icon: "START" },
              { title: "まっすぐ", meaning: "Jalan lurus", icon: "GO" },
              { title: "信号", meaning: "Lampu lalu lintas", icon: "CHECK" },
            ].map((step, index) => (
              <div key={step.title} className="relative rounded-xl border border-white/[0.07] bg-black/15 p-3 text-center">
                <p className="text-[8px] font-black tracking-[0.18em] text-[#8EAE93]">{step.icon}</p>
                <p className="mt-2 font-mincho text-base text-[#F1EBDD]">{step.title}</p>
                <p className="mt-1 text-[10px] text-[#A9A398]">{step.meaning}</p>
                {index < 2 && <p className="mt-2 text-sm font-bold text-[#A9CDB0]">↓</p>}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-[#6E9A75]/25 bg-[#263D2D]/65 p-3">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">ARAH YANG PERLU DIINGAT</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-black/15 p-3">
                <p className="text-2xl font-black text-[#F1EBDD]">↑</p>
                <p className="mt-1 font-mincho text-sm text-[#A9CDB0]">まっすぐ</p>
                <p className="text-[9px] text-[#A9A398]">Lurus</p>
              </div>
              <div className="rounded-lg bg-black/15 p-3">
                <div className="flex justify-center gap-8">
                  <span className="text-2xl font-black text-[#F1EBDD]">←</span>
                  <span className="text-2xl font-black text-[#F1EBDD]">→</span>
                </div>
                <p className="mt-1 font-mincho text-sm text-[#A9CDB0]">左 · 右</p>
                <p className="text-[9px] text-[#A9A398]">Kiri · Kanan</p>
              </div>
            </div>
          </div>
        </article>
        <div className="grid gap-3 md:grid-cols-3">
          {townRoutes.map((route) => (
            <article key={route.id} className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base font-bold text-[#F1EBDD]">{route.title}</p>
              <p className="mt-1 text-[10px] text-[#A9CDB0]">{route.subtitle}</p>
              <ol className="mt-4 space-y-3">
                {route.steps.map((step, index) => (
                  <li key={step} className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#426B4C] text-[9px] font-black text-white">{index + 1}</span>
                    <span className="text-[10px] leading-5 text-[#C8C2B8]">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 rounded-lg bg-black/20 p-2 text-[10px] font-semibold leading-5 text-[#A9CDB0]">{route.destination}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Meminta bantuan dan menjelaskan rute</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Tiga pola utama ini membantu membuka pertanyaan, menyusun petunjuk secara berurutan, dan memperjelas informasi yang keliru.</p>
        </div>
        {[
          {
            title: "01 · Menyampaikan tujuan sebelum meminta bantuan",
            pattern: "N に行きたいんですが…",
            example: <>郵便局に行きたいんですが…。／ 銀行に行きたいんですが、どう行ったらいいですか。</>,
            note: "Pola ini digunakan untuk menyampaikan tempat yang ingin dituju sebelum meminta informasi atau bantuan. 行きます berubah menjadi bentuk keinginan 行きたい, lalu diikuti んですが untuk membuka percakapan dengan halus. Contoh: 駅に行きたいんですが… (Saya ingin pergi ke stasiun…).",
          },
          {
            title: "02 · Menghubungkan tindakan berurutan dengan ～て",
            pattern: "V-て、V-て、～",
            example: <>この道をまっすぐ行って、2つ目の信号を左に曲がってください。</>,
            note: "Bentuk ～て dapat menghubungkan beberapa tindakan yang dilakukan secara berurutan. 行きます → 行って, 曲がります → 曲がって. Dalam petunjuk arah, tindakan pertama dilakukan lebih dahulu, lalu dilanjutkan dengan tindakan berikutnya. まっすぐ行って berarti jalan lurus, lalu lanjutkan ke petunjuk selanjutnya.",
          },
          {
            title: "03 · Mengoreksi informasi dengan じゃなくて",
            pattern: "N1 じゃなくて、N2",
            example: <>1つ目じゃなくて、2つ目です。</>,
            note: "Gunakan じゃなくて untuk menyampaikan bahwa informasi pertama bukan yang dimaksud, lalu menggantinya dengan informasi yang benar. 1つ目じゃなくて、2つ目です berarti bukan yang pertama, melainkan yang kedua. Pola ini berguna untuk memperjelas urutan belokan atau penanda lokasi.",
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali tulisan penting tentang jalan dan arah</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9CDB0]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">SIMULASI INTERAKTIF</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan ungkapan dalam situasi perjalanan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi meminta dan memberi petunjuk arah. Setiap situasi harus dijawab benar.</p>
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
        Dialog, tokoh, dan situasi latihan dibuat orisinal oleh Fude untuk melatih percakapan meminta dan memberi petunjuk arah dengan jelas dan sopan.
      </p>
    </main>
  );
}
