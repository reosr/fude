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
const lessonId = "elementary1-08";

const baseballExperienceConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>野球をしたことがありますか。</>, romaji: "Yakyuu o shita koto ga arimasu ka?", translation: "Apakah kamu pernah bermain bisbol?", audioFileName: "irodori-elementary1-08-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>はい。学校で一度したことがあります。</>, romaji: "Hai. Gakkou de ichido shita koto ga arimasu.", translation: "Ya. Saya pernah bermain sekali di sekolah.", audioFileName: "irodori-elementary1-08-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>そうですか。野球が好きですか。</>, romaji: "Sou desu ka. Yakyuu ga suki desu ka?", translation: "Begitu, ya. Apakah kamu suka bisbol?", audioFileName: "irodori-elementary1-08-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>はい、好きです。</>, romaji: "Hai, suki desu.", translation: "Ya, saya suka.", audioFileName: "irodori-elementary1-08-a01-l04.mp3" },
  { speakerId: "yui", japanese: <>じゃあ、今度いっしょに試合を見に行きませんか。</>, romaji: "Jaa, kondo issho ni shiai o mi ni ikimasen ka?", translation: "Kalau begitu, maukah kita menonton pertandingan bersama lain kali?", audioFileName: "irodori-elementary1-08-a01-l05.mp3" },
];

const checkingPopularPlaceConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>新しい博物館、もう行きましたか。</>, romaji: "Atarashii hakubutsukan, mou ikimashita ka?", translation: "Apakah kamu sudah pergi ke museum yang baru?", audioFileName: "irodori-elementary1-08-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>いいえ、まだです。行きたいです。</>, romaji: "Iie, mada desu. Ikitai desu.", translation: "Belum. Saya ingin pergi.", audioFileName: "irodori-elementary1-08-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>土曜日にいっしょに行きませんか。</>, romaji: "Doyoubi ni issho ni ikimasen ka?", translation: "Maukah kita pergi bersama hari Sabtu?", audioFileName: "irodori-elementary1-08-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>いいですね。楽しみです。</>, romaji: "Ii desu ne. Tanoshimi desu.", translation: "Boleh juga. Saya menantikannya.", audioFileName: "irodori-elementary1-08-a02-l04.mp3" },
];

const decidingNextActivityConversation: IrodoriUtterance[] = [
  { speakerId: "sota", japanese: <>このあと、どうしますか。</>, romaji: "Kono ato, dou shimasu ka?", translation: "Setelah ini, bagaimana?", audioFileName: "irodori-elementary1-08-a03-l01.mp3" },
  { speakerId: "yui", japanese: <>食事のあとで、動物園に行きませんか。</>, romaji: "Shokuji no ato de, doubutsuen ni ikimasen ka?", translation: "Setelah makan, maukah kita pergi ke kebun binatang?", audioFileName: "irodori-elementary1-08-a03-l02.mp3" },
  { speakerId: "sota", japanese: <>いいですね。動物園の前に、切符を買いましょう。</>, romaji: "Ii desu ne. Doubutsuen no mae ni, kippu o kaimashou.", translation: "Boleh juga. Sebelum ke kebun binatang, mari membeli tiket.", audioFileName: "irodori-elementary1-08-a03-l03.mp3" },
  { speakerId: "yui", japanese: <>わかりました。入口で会いましょう。</>, romaji: "Wakarimashita. Iriguchi de aimashou.", translation: "Baik. Mari bertemu di pintu masuk.", audioFileName: "irodori-elementary1-08-a03-l04.mp3" },
];

const sharingEventImpressionsConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>今日の動物園はどうでしたか。</>, romaji: "Kyou no doubutsuen wa dou deshita ka?", translation: "Bagaimana kebun binatang hari ini?", audioFileName: "irodori-elementary1-08-a04-l01.mp3" },
  { speakerId: "akiko", japanese: <>とても楽しかったです。パンダがかわいかったです。</>, romaji: "Totemo tanoshikatta desu. Panda ga kawaikatta desu.", translation: "Sangat menyenangkan. Panda-nya lucu.", audioFileName: "irodori-elementary1-08-a04-l02.mp3" },
  { speakerId: "kenji", japanese: <>そうですね。写真もたくさん撮りました。</>, romaji: "Sou desu ne. Shashin mo takusan torimashita.", translation: "Betul. Saya juga mengambil banyak foto.", audioFileName: "irodori-elementary1-08-a04-l03.mp3" },
  { speakerId: "akiko", japanese: <>またいっしょに行きたいですね。</>, romaji: "Mata issho ni ikitai desu ne.", translation: "Lain kali kita pergi bersama lagi, ya.", audioFileName: "irodori-elementary1-08-a04-l04.mp3" },
];

const askingAtSportsShopConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>すみません。運動靴を買いたいんですが…。</>, romaji: "Sumimasen. Undougutsu o kaitai n desu ga...", translation: "Permisi. Saya ingin membeli sepatu olahraga…", audioFileName: "irodori-elementary1-08-a05-l01.mp3" },
  { speakerId: "sota", japanese: <>どんな靴をお探しですか。</>, romaji: "Donna kutsu o osagashi desu ka?", translation: "Sepatu seperti apa yang sedang Anda cari?", audioFileName: "irodori-elementary1-08-a05-l02.mp3" },
  { speakerId: "yui", japanese: <>歩きやすい靴がいいです。</>, romaji: "Arukiyasui kutsu ga ii desu.", translation: "Saya ingin sepatu yang nyaman untuk berjalan.", audioFileName: "irodori-elementary1-08-a05-l03.mp3" },
  { speakerId: "sota", japanese: <>こちらはいかがですか。</>, romaji: "Kochira wa ikaga desu ka?", translation: "Bagaimana dengan yang ini?", audioFileName: "irodori-elementary1-08-a05-l04.mp3" },
];

const canDos = [
  { id: "invite-through-experience", text: "Mengajak seseorang makan, berbelanja, atau menghadiri acara sambil menanyakan pengalaman dan minatnya." },
  { id: "discuss-next-activity", text: "Mendiskusikan kegiatan berikutnya dan tempat yang akan dikunjungi saat bepergian bersama." },
  { id: "share-event-impressions", text: "Menyampaikan kesan tentang acara atau kegiatan yang diikuti bersama." },
  { id: "talk-about-experience", text: "Menceritakan pengalaman sederhana dengan pola ～たことがあります／ありません." },
  { id: "sequence-an-outing", text: "Menjelaskan urutan kegiatan sebelum dan sesudah aktivitas dengan 前に dan あとで." },
];

const outingPlans = [
  {
    id: "baseball",
    title: "野球の試合",
    subtitle: "Menonton pertandingan bisbol",
    time: "午後 · Siang / sore",
    before: "試合の前に、飲み物を買います。",
    beforeMeaning: "Sebelum pertandingan, membeli minuman.",
    activity: "野球の試合を見ます。",
    activityMeaning: "Menonton pertandingan bisbol.",
    after: "試合のあとで、食事をします。",
    afterMeaning: "Setelah pertandingan, makan bersama.",
  },
  {
    id: "museum",
    title: "博物館",
    subtitle: "Mengunjungi museum",
    time: "午前 · Pagi",
    before: "博物館の前に、駅で会います。",
    beforeMeaning: "Sebelum ke museum, bertemu di stasiun.",
    activity: "博物館を見学します。",
    activityMeaning: "Mengunjungi dan melihat-lihat museum.",
    after: "見学のあとで、公園を散歩します。",
    afterMeaning: "Setelah kunjungan, berjalan-jalan di taman.",
  },
  {
    id: "zoo",
    title: "動物園",
    subtitle: "Pergi ke kebun binatang",
    time: "午前 · Pagi",
    before: "動物園の前に、切符を買います。",
    beforeMeaning: "Sebelum masuk kebun binatang, membeli tiket.",
    activity: "動物を見ます。",
    activityMeaning: "Melihat hewan.",
    after: "動物園のあとで、写真を見ます。",
    afterMeaning: "Setelah dari kebun binatang, melihat foto-foto.",
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
    prompt: <>Ungkapan 「野球をしたことがありますか」 digunakan untuk menanyakan …</>,
    options: [{ key: "a", label: "Pengalaman bermain bisbol." }, { key: "b", label: "Rencana makan malam." }, { key: "c", label: "Harga tiket pertandingan." }],
    answer: "a",
    explanation: <>V-たことがありますか menanyakan apakah seseorang pernah mengalami atau melakukan sesuatu.</>,
  },
  {
    prompt: <>Pilih jawaban yang tepat untuk 「もう博物館に行きましたか」 jika belum pernah pergi.</>,
    options: [{ key: "a", label: "いいえ、まだです。" }, { key: "b", label: "はい、行きました。" }, { key: "c", label: "いいえ、行きたいです。" }],
    answer: "a",
    explanation: <>Untuk menjawab pertanyaan もうV-ましたか dengan negatif, ungkapan yang umum adalah いいえ、まだです (belum).</>,
  },
  {
    prompt: <>Kalimat yang mengajak teman menonton pertandingan bersama adalah …</>,
    options: [{ key: "a", label: "いっしょに試合を見に行きませんか。" }, { key: "b", label: "試合を見たことがあります。" }, { key: "c", label: "試合のあとで帰りました。" }],
    answer: "a",
    explanation: <>V-に行きませんか digunakan untuk mengajak seseorang melakukan suatu kegiatan bersama.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Setelah makan, mari pergi ke kebun binatang.”</>,
    options: [{ key: "a", label: "食事のあとで、動物園に行きませんか。" }, { key: "b", label: "食事の前に、動物園に行きませんか。" }, { key: "c", label: "動物園のあとで、食事をしました。" }],
    answer: "a",
    explanation: <>Nのあとで berarti setelah suatu kegiatan atau waktu yang disebutkan.</>,
  },
  {
    prompt: <>Apa maksud 「新しい靴を買いたいんですが…」?</>,
    options: [{ key: "a", label: "Saya ingin membeli sepatu baru… (membuka permintaan atau pertanyaan)." }, { key: "b", label: "Saya sudah membeli sepatu baru." }, { key: "c", label: "Saya tidak suka sepatu baru." }],
    answer: "a",
    explanation: <>V-たいんですが… menyampaikan keinginan sebagai pembuka untuk meminta bantuan atau informasi.</>,
  },
  {
    prompt: <>Pilih kesan lampau yang tepat untuk “Panda-nya lucu.”</>,
    options: [{ key: "a", label: "パンダがかわいかったです。" }, { key: "b", label: "パンダがかわいいです。" }, { key: "c", label: "パンダがかわいくてです。" }],
    answer: "a",
    explanation: <>Kata sifat い berubah menjadi bentuk lampau dengan mengganti い menjadi かった: かわいい → かわいかった.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa fungsi 「もうV-ましたか」?</>,
    options: [{ key: "a", label: "Menanyakan apakah sesuatu sudah dilakukan." }, { key: "b", label: "Mengundang orang melakukan sesuatu nanti." }, { key: "c", label: "Menjelaskan lokasi." }],
    answer: "a",
    explanation: <>もうV-ましたか menanyakan apakah tindakan yang diharapkan sudah selesai dilakukan.</>,
  },
  {
    prompt: <>Jawaban yang lazim untuk 「もう行きましたか」 jika belum adalah …</>,
    options: [{ key: "a", label: "いいえ、まだです。" }, { key: "b", label: "はい、行きました。" }, { key: "c", label: "はい、行きません。" }],
    answer: "a",
    explanation: <>まだです berarti belum, dan merupakan jawaban singkat yang umum untuk pertanyaan もう～ましたか.</>,
  },
  {
    prompt: <>Pilih contoh pertanyaan pengalaman.</>,
    options: [{ key: "a", label: "野球をしたことがありますか。" }, { key: "b", label: "野球をしますか。" }, { key: "c", label: "野球をしてください。" }],
    answer: "a",
    explanation: <>V-たことがありますか menanyakan pengalaman yang pernah dilakukan.</>,
  },
  {
    prompt: <>Bentuk タ dari 「食べます」 adalah …</>,
    options: [{ key: "a", label: "食べた" }, { key: "b", label: "食べて" }, { key: "c", label: "食べます" }],
    answer: "a",
    explanation: <>食べます → 食べて → 食べた. Untuk kelompok 2, bentuk タ dibuat dengan mengganti て menjadi た.</>,
  },
  {
    prompt: <>Pilih ajakan yang berarti “Maukah kita pergi makan bersama?”</>,
    options: [{ key: "a", label: "いっしょに食べに行きませんか。" }, { key: "b", label: "いっしょに食べました。" }, { key: "c", label: "いっしょに食べたいですか。" }],
    answer: "a",
    explanation: <>食べます menjadi 食べに行きませんか untuk mengajak seseorang pergi makan bersama.</>,
  },
  {
    prompt: <>Lengkapi: 「買い物の ___ で、ゲームコーナーに行きます。」</>,
    options: [{ key: "a", label: "あと" }, { key: "b", label: "前" }, { key: "c", label: "中" }],
    answer: "a",
    explanation: <>Nのあとで menyatakan bahwa kegiatan berikutnya dilakukan setelah kegiatan pertama selesai.</>,
  },
  {
    prompt: <>Apa arti 「食事の前に」?</>,
    options: [{ key: "a", label: "Sebelum makan." }, { key: "b", label: "Setelah makan." }, { key: "c", label: "Saat makan." }],
    answer: "a",
    explanation: <>前に berarti sebelum, sedangkan あとで berarti setelah.</>,
  },
  {
    prompt: <>Pola 「V-たいんですが…」 digunakan untuk …</>,
    options: [{ key: "a", label: "Menyampaikan keinginan sebelum meminta bantuan atau informasi." }, { key: "b", label: "Menceritakan pengalaman lampau." }, { key: "c", label: "Membandingkan dua tempat." }],
    answer: "a",
    explanation: <>V-たいんですが… merupakan pembuka halus untuk menyatakan apa yang ingin dilakukan.</>,
  },
  {
    prompt: <>Apa bentuk lampau dari 「楽しいです」?</>,
    options: [{ key: "a", label: "楽しかったです。" }, { key: "b", label: "楽しいでした。" }, { key: "c", label: "楽しくてです。" }],
    answer: "a",
    explanation: <>Kata sifat い membentuk lampau dengan perubahan い menjadi かった.</>,
  },
  {
    prompt: <>Ungkapan yang paling sesuai setelah mengikuti acara bersama adalah …</>,
    options: [{ key: "a", label: "とても楽しかったです。" }, { key: "b", label: "もう行きませんか。" }, { key: "c", label: "どこにありますか。" }],
    answer: "a",
    explanation: <>楽しかったです menyampaikan kesan bahwa kegiatan yang sudah selesai terasa menyenangkan.</>,
  },
];

const simulations = [
  {
    title: "01 · Menanyakan pengalaman dan mengajak",
    heading: "Menyusun ajakan yang sesuai",
    prompt: "Yui tahu Sota pernah bermain bisbol dan menyukai olahraga itu. Ia ingin mengajak Sota menonton pertandingan bersama.",
    japanese: <>野球をしたことがありますか。</>,
    translation: "Apakah kamu pernah bermain bisbol?",
    options: [
      { key: "invite", label: "じゃあ、いっしょに試合を見に行きませんか。", meaning: "Kalau begitu, maukah kita menonton pertandingan bersama?" },
      { key: "past", label: "昨日、試合を見ました。", meaning: "Kemarin saya menonton pertandingan." },
      { key: "place", label: "試合はどこですか。", meaning: "Pertandingannya di mana?" },
    ],
    answer: "invite",
    explanation: "Pertanyaan tentang pengalaman dan minat dapat diikuti ajakan yang sesuai dengan hal yang disukai lawan bicara.",
  },
  {
    title: "02 · Memeriksa apakah sudah pernah pergi",
    heading: "Memakai もうV-ましたか",
    prompt: "Kamu ingin mengetahui apakah teman sudah mengunjungi museum yang baru dibuka.",
    japanese: <>新しい博物館に行きましたか。</>,
    translation: "Apakah kamu sudah pergi ke museum yang baru?",
    options: [
      { key: "already", label: "もう行きましたか。", meaning: "Apakah sudah pergi?" },
      { key: "experience", label: "行ったことがありますか。", meaning: "Apakah pernah pergi?" },
      { key: "invite", label: "いっしょに行きませんか。", meaning: "Maukah pergi bersama?" },
    ],
    answer: "already",
    explanation: "もうV-ましたか menanyakan apakah tindakan yang diharapkan sudah dilakukan, sedangkan V-たことがありますか menanyakan pengalaman.",
  },
  {
    title: "03 · Membicarakan kegiatan berikutnya",
    heading: "Menyusun urutan kegiatan",
    prompt: "Kalian sudah makan dan ingin menentukan kegiatan berikutnya.",
    japanese: <>食事のあとで、どうしますか。</>,
    translation: "Setelah makan, bagaimana?",
    options: [
      { key: "zoo", label: "動物園に行きませんか。", meaning: "Maukah kita pergi ke kebun binatang?" },
      { key: "before", label: "食事の前に、駅で会いました。", meaning: "Sebelum makan, kami bertemu di stasiun." },
      { key: "experience", label: "動物園に行ったことがあります。", meaning: "Saya pernah pergi ke kebun binatang." },
    ],
    answer: "zoo",
    explanation: "Konteksnya adalah kegiatan setelah makan, sehingga ajakan pergi ke tempat berikutnya menjadi respons yang sesuai.",
  },
  {
    title: "04 · Menyampaikan kesan setelah acara",
    heading: "Menggunakan bentuk lampau",
    prompt: "Setelah mengunjungi kebun binatang, Kenji bertanya tentang pengalaman Akiko.",
    japanese: <>パンダはどうでしたか。</>,
    translation: "Bagaimana panda-nya?",
    options: [
      { key: "impression", label: "とてもかわいかったです。", meaning: "Sangat lucu." },
      { key: "future", label: "いっしょに行きませんか。", meaning: "Maukah pergi bersama?" },
      { key: "present", label: "パンダがかわいいです。", meaning: "Panda-nya lucu (sekarang/umum)." },
    ],
    answer: "impression",
    explanation: "Bentuk lampau かわいかったです cocok untuk menyampaikan kesan setelah kegiatan yang sudah selesai.",
  },
  {
    title: "05 · Meminta bantuan di toko",
    heading: "Memakai V-たいんですが",
    prompt: "Yui ingin membeli sepatu olahraga dan membutuhkan bantuan staf toko.",
    japanese: <>何をお探しですか。</>,
    translation: "Apa yang sedang Anda cari?",
    options: [
      { key: "shoes", label: "運動靴を買いたいんですが…。", meaning: "Saya ingin membeli sepatu olahraga…" },
      { key: "past", label: "運動靴を買いました。", meaning: "Saya sudah membeli sepatu olahraga." },
      { key: "experience", label: "運動靴を買ったことがあります。", meaning: "Saya pernah membeli sepatu olahraga." },
    ],
    answer: "shoes",
    explanation: "V-たいんですが… menyampaikan keinginan dengan halus sebagai pembuka untuk bertanya atau meminta bantuan.",
  },
];

const vocabulary = [
  ["お金", "おかね · okane", "Uang"],
  ["食事", "しょくじ · shokuji", "Makan / waktu makan"],
  ["店", "みせ · mise", "Toko"],
  ["博物館", "はくぶつかん · hakubutsukan", "Museum"],
  ["動物園", "どうぶつえん · doubutsuen", "Kebun binatang"],
  ["試合", "しあい · shiai", "Pertandingan"],
  ["楽しい", "たのしい · tanoshii", "Menyenangkan"],
  ["難しい", "むずかしい · muzukashii", "Sulit"],
  ["登る", "のぼる · noboru", "Mendaki / naik"],
  ["買う", "かう · kau", "Membeli"],
  ["野球", "やきゅう · yakyuu", "Bisbol"],
  ["経験", "けいけん · keiken", "Pengalaman"],
  ["一度", "いちど · ichido", "Satu kali / pernah sekali"],
  ["もう", "もう · mou", "Sudah"],
  ["まだ", "まだ · mada", "Belum / masih"],
  ["行く", "いく · iku", "Pergi"],
  ["見る", "みる · miru", "Melihat / menonton"],
  ["食べる", "たべる · taberu", "Makan"],
  ["遊ぶ", "あそぶ · asobu", "Bermain"],
  ["写真", "しゃしん · shashin", "Foto"],
  ["かわいい", "かわいい · kawaii", "Lucu"],
  ["前", "まえ · mae", "Sebelum / depan"],
  ["あと", "あと · ato", "Setelah"],
  ["買い物", "かいもの · kaimono", "Belanja"],
  ["運動靴", "うんどうぐつ · undougutsu", "Sepatu olahraga"],
];

const kanjiWords = [
  ["お金", "おかね · okane", "Uang"],
  ["食事", "しょくじ · shokuji", "Makan / waktu makan"],
  ["店", "みせ · mise", "Toko"],
  ["博物館", "はくぶつかん · hakubutsukan", "Museum"],
  ["動物園", "どうぶつえん · doubutsuen", "Kebun binatang"],
  ["試合", "しあい · shiai", "Pertandingan"],
  ["楽しい", "たのしい · tanoshii", "Menyenangkan"],
  ["難しい", "むずかしい · muzukashii", "Sulit"],
  ["登る", "のぼる · noboru", "Mendaki / naik"],
  ["買う", "かう · kau", "Membeli"],
];

export default function IrodoriElementaryOneLessonEightPage() {
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
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#91B99A]/[0.08]">野</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">IRODORI • DASAR 1 A2 • PELAJARAN 08</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Pernah bermain bisbol?</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9CDB0]">野球、したことありますか？</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Berlatih menanyakan pengalaman dan minat, mengajak teman melakukan kegiatan, menentukan rencana berikutnya, serta menyampaikan kesan setelah acara.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9CDB0]" />Pengalaman & minat</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#A9CDB0]" />Ajakan kegiatan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#A9CDB0]" />Kesan setelah acara</span>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pengalaman, acara, dan kegiatan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata untuk membicarakan pengalaman, mengunjungi tempat, dan menyampaikan kesan setelah kegiatan.</p>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membicarakan pengalaman dan pergi bersama</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan cara menanyakan pengalaman, mengajak teman, menentukan kegiatan berikutnya, dan menyampaikan kesan.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Menanyakan pengalaman dan mengajak teman" speakers={[speakers.yui, speakers.sota]} utterances={baseballExperienceConversation} />
          <IrodoriConversation title="Menanyakan tempat yang belum dikunjungi" speakers={[speakers.akiko, speakers.kenji]} utterances={checkingPopularPlaceConversation} />
          <IrodoriConversation title="Menentukan kegiatan berikutnya" speakers={[speakers.sota, speakers.yui]} utterances={decidingNextActivityConversation} />
          <IrodoriConversation title="Menyampaikan kesan setelah acara" speakers={[speakers.kenji, speakers.akiko]} utterances={sharingEventImpressionsConversation} />
          <IrodoriConversation title="Meminta bantuan di toko olahraga" speakers={[speakers.yui, speakers.sota]} utterances={askingAtSportsShopConversation} />
        </div>
      </section>


      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">RENCANA PERGI BERSAMA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kegiatan sebelum, saat, dan sesudah acara</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Baca contoh rencana sederhana. Perhatikan urutan kegiatan dengan 前に (sebelum) dan あとで (setelah).</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {outingPlans.map((plan) => (
            <article key={plan.id} className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base font-bold text-[#F1EBDD]">{plan.title}</p>
              <p className="mt-1 text-[10px] text-[#A9CDB0]">{plan.subtitle}</p>
              <p className="mt-3 inline-flex rounded-full border border-[#8EAE93]/25 bg-[#476C51]/15 px-2.5 py-1 text-[9px] font-bold text-[#CFE4D2]">{plan.time}</p>
              <ol className="mt-4 space-y-3">
                <li className="rounded-lg bg-black/15 p-3">
                  <p className="text-[8px] font-black tracking-[0.16em] text-[#8EAE93]">BEFORE · 前に</p>
                  <p className="mt-1 font-mincho text-sm leading-6 text-[#F1EBDD]">{plan.before}</p>
                  <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{plan.beforeMeaning}</p>
                </li>
                <li className="rounded-lg bg-[#263D2D]/60 p-3">
                  <p className="text-[8px] font-black tracking-[0.16em] text-[#A9CDB0]">ACTIVITY · 活動</p>
                  <p className="mt-1 font-mincho text-sm leading-6 text-[#F1EBDD]">{plan.activity}</p>
                  <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{plan.activityMeaning}</p>
                </li>
                <li className="rounded-lg bg-black/15 p-3">
                  <p className="text-[8px] font-black tracking-[0.16em] text-[#8EAE93]">AFTER · あとで</p>
                  <p className="mt-1 font-mincho text-sm leading-6 text-[#F1EBDD]">{plan.after}</p>
                  <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{plan.afterMeaning}</p>
                </li>
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">CERITA PENGALAMAN & KESAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pernah melakukan apa? Bagaimana rasanya?</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Bedakan pertanyaan tentang pengalaman dan pertanyaan apakah suatu kegiatan sudah dilakukan. Setelah acara selesai, sampaikan kesan dengan bentuk lampau.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">EXPERIENCE · 経験</p>
            <p className="mt-2 font-mincho text-base text-[#F1EBDD]">野球をしたことがありますか。</p>
            <p className="mt-1 text-xs text-[#A9A398]">Apakah pernah bermain bisbol?</p>
            <div className="mt-3 space-y-2 rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-sm text-[#CFE4D2]">はい、あります。</p>
              <p className="text-[10px] text-[#A9A398]">Ya, pernah.</p>
              <p className="font-mincho text-sm text-[#CFE4D2]">いいえ、ありません。</p>
              <p className="text-[10px] text-[#A9A398]">Tidak, belum pernah.</p>
            </div>
          </article>
          <article className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">IMPRESSION · 感想</p>
            <p className="mt-2 font-mincho text-base text-[#F1EBDD]">パンダがかわいかったです。</p>
            <p className="mt-1 text-xs text-[#A9A398]">Panda-nya lucu.</p>
            <div className="mt-3 space-y-2 rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-sm text-[#CFE4D2]">とても楽しかったです。</p>
              <p className="text-[10px] text-[#A9A398]">Sangat menyenangkan.</p>
              <p className="font-mincho text-sm text-[#CFE4D2]">少し難しかったです。</p>
              <p className="text-[10px] text-[#A9A398]">Agak sulit.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menceritakan pengalaman dan membuat rencana</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Lima pola resmi ini membantu bertanya apakah sesuatu sudah dilakukan, membicarakan pengalaman, mengajak teman, dan menyusun urutan kegiatan.</p>
        </div>
        {[
          {
            title: "01 · Menanyakan apakah sesuatu sudah dilakukan",
            pattern: "もう V-ましたか？",
            example: <>新しい博物館、もう行きましたか。／ もう昼ご飯を食べましたか。</>,
            note: "もう berarti sudah. Gunakan pola ini untuk menanyakan apakah kegiatan yang diharapkan sudah dilakukan. Jawaban positif: はい、行きました. Jawaban negatif yang umum: いいえ、まだです (belum).",
          },
          {
            title: "02 · Menanyakan pengalaman",
            pattern: "V-たことがありますか？",
            example: <>野球をしたことがありますか。／ 富士山に登ったことがありますか。</>,
            note: "Tambahkan ことがあります setelah kata kerja bentuk タ untuk menanyakan pengalaman. Bentuk タ dibentuk dari bentuk テ: して → した, 見て → 見た, 行って → 行った. Jawaban: はい、あります／いいえ、ありません. Pola ini menanyakan pengalaman, bukan apakah kegiatan sudah dilakukan kali ini.",
          },
          {
            title: "03 · Mengajak seseorang melakukan kegiatan",
            pattern: "V-ます (hapus ます) + に行きませんか？",
            example: <>いっしょに試合を見に行きませんか。／ 食べに行きませんか。</>,
            note: "Pola ini digunakan untuk mengajak seseorang pergi melakukan suatu kegiatan. Ambil bentuk ます, hilangkan ます, lalu tambahkan に行きませんか: 見ます → 見に行きませんか, 食べます → 食べに行きませんか.",
          },
          {
            title: "04 · Menyatakan sebelum dan sesudah",
            pattern: "N の前に、～ ／ N のあとで、～",
            example: <>食事の前に、お金を用意します。／ 買い物のあとで、公園に行きます。</>,
            note: "Nの前に berarti sebelum kegiatan atau waktu yang disebutkan. Nのあとで berarti setelahnya. Perhatikan urutannya: 食事の前に berarti sebelum makan, sedangkan 食事のあとで berarti setelah makan.",
          },
          {
            title: "05 · Menyampaikan keinginan sebagai pembuka permintaan",
            pattern: "V-たいんですが…",
            example: <>新しい運動靴を買いたいんですが…。／ 博物館に行きたいんですが…。</>,
            note: "Gunakan bentuk V-たい untuk menyampaikan apa yang ingin dilakukan, lalu tambahkan んですが sebagai pembuka yang halus sebelum bertanya atau meminta bantuan. Contoh: 買います → 買いたいんですが… (Saya ingin membeli…).",
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali tulisan tentang pengalaman dan kegiatan</h2>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan ungkapan saat pergi bersama</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi menanyakan pengalaman, mengajak teman, memilih kegiatan berikutnya, dan menyampaikan kesan. Setiap situasi harus dijawab benar.</p>
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
        Dialog, tokoh, dan situasi latihan dibuat orisinal oleh Fude untuk melatih percakapan tentang pengalaman, ajakan, dan kegiatan bersama.
      </p>
    </main>
  );
}
