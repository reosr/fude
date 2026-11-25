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
const lessonId = "elementary1-07";

const askingMeetingDetailsConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>明日のイベント、何時にどこで会いますか。</>, romaji: "Ashita no ibento, nanji ni doko de aimasu ka?", translation: "Untuk acara besok, kita bertemu jam berapa dan di mana?", audioFileName: "irodori-elementary1-07-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>午前九時はどうですか。待ち合わせ場所は駅の東口にしましょう。</>, romaji: "Gozen kuji wa dou desu ka? Machiawase basho wa eki no higashiguchi ni shimashou.", translation: "Bagaimana kalau pukul sembilan pagi? Kita bertemu di pintu keluar timur stasiun saja.", audioFileName: "irodori-elementary1-07-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>九時ですね。駅の東口ですね。</>, romaji: "Kuji desu ne. Eki no higashiguchi desu ne.", translation: "Pukul sembilan, ya. Di pintu keluar timur stasiun.", audioFileName: "irodori-elementary1-07-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>はい。わかりやすいですよ。</>, romaji: "Hai. Wakariyasui desu yo.", translation: "Iya. Tempatnya mudah ditemukan.", audioFileName: "irodori-elementary1-07-a01-l04.mp3" },
  { speakerId: "yui", japanese: <>わかりました。では、明日。</>, romaji: "Wakarimashita. De wa, ashita.", translation: "Oke, sampai besok.", audioFileName: "irodori-elementary1-07-a01-l05.mp3" },
];

const decidingMeetingTimeConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>土曜日の待ち合わせは、午後二時はどうですか。</>, romaji: "Doyoubi no machiawase wa, gogo niji wa dou desu ka?", translation: "Bagaimana kalau kita bertemu hari Sabtu pukul dua siang?", audioFileName: "irodori-elementary1-07-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>二時は少し早いです。三時でもいいですか。</>, romaji: "Niji wa sukoshi hayai desu. Sanji demo ii desu ka?", translation: "Pukul dua agak terlalu awal. Bolehkah pukul tiga?", audioFileName: "irodori-elementary1-07-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>はい、大丈夫です。場所はカフェの前はどうですか。</>, romaji: "Hai, daijoubu desu. Basho wa kafe no mae wa dou desu ka?", translation: "Ya, tidak masalah. Bagaimana kalau kita bertemu di depan kafe?", audioFileName: "irodori-elementary1-07-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>いいですね。三時にカフェの前ですね。</>, romaji: "Ii desu ne. Sanji ni kafe no mae desu ne.", translation: "Oke. Jadi, pukul tiga di depan kafe, ya.", audioFileName: "irodori-elementary1-07-a02-l04.mp3" },
];

const readingLateMessageConversation: IrodoriUtterance[] = [
  { speakerId: "sota", japanese: <>友だちからメッセージが来ました。</>, romaji: "Tomodachi kara messeeji ga kimashita.", translation: "Ada pesan dari teman.", audioFileName: "irodori-elementary1-07-a03-l01.mp3" },
  { speakerId: "yui", japanese: <>「電車が止まっていて、十五分ぐらい遅れます」と書いてあります。</>, romaji: "Densha ga tomatte ite, juugofun gurai okuremasu to kaite arimasu.", translation: "Tertulis, “Kereta berhenti, jadi saya akan terlambat sekitar 15 menit.”", audioFileName: "irodori-elementary1-07-a03-l02.mp3" },
  { speakerId: "sota", japanese: <>電車のことで遅れるんですね。</>, romaji: "Densha no koto de okureru n desu ne.", translation: "Jadi, dia terlambat karena masalah kereta, ya.", audioFileName: "irodori-elementary1-07-a03-l03.mp3" },
  { speakerId: "yui", japanese: <>はい。先に着いたら、連絡しましょう。</>, romaji: "Hai. Saki ni tsuitara, renraku shimashou.", translation: "Iya. Kalau kita sampai duluan, kita kabari dia.", audioFileName: "irodori-elementary1-07-a03-l04.mp3" },
];

const sendingDelayMessageConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>待ち合わせに遅れそうです。</>, romaji: "Machiawase ni okuresou desu.", translation: "Sepertinya saya akan terlambat datang ke tempat janjian.", audioFileName: "irodori-elementary1-07-a04-l01.mp3" },
  { speakerId: "kenji", japanese: <>どうしましたか。</>, romaji: "Dou shimashita ka?", translation: "Ada apa?", audioFileName: "irodori-elementary1-07-a04-l02.mp3" },
  { speakerId: "akiko", japanese: <>道に迷って、十分ぐらい遅れます。すみません。</>, romaji: "Michi ni mayotte, juppun gurai okuremasu. Sumimasen.", translation: "Saya tersesat, jadi akan terlambat sekitar sepuluh menit. Maaf.", audioFileName: "irodori-elementary1-07-a04-l03.mp3" },
  { speakerId: "kenji", japanese: <>わかりました。気をつけて来てください。</>, romaji: "Wakarimashita. Ki o tsukete kite kudasai.", translation: "Oke, hati-hati di jalan.", audioFileName: "irodori-elementary1-07-a04-l04.mp3" },
];

const replyingToMessageConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>「少し遅れます」というメッセージが来ました。</>, romaji: "\"Sukoshi okuremasu\" to iu messeeji ga kimashita.", translation: "Ada pesan masuk: “Saya akan sedikit terlambat.”", audioFileName: "irodori-elementary1-07-a05-l01.mp3" },
  { speakerId: "sota", japanese: <>どんな返事を送りますか。</>, romaji: "Donna henji o okurimasu ka?", translation: "Balasan seperti apa yang akan kamu kirim?", audioFileName: "irodori-elementary1-07-a05-l02.mp3" },
  { speakerId: "yui", japanese: <>「大丈夫です。カフェで待っています」と送りましょう。</>, romaji: "\"Daijoubu desu. Kafe de matte imasu\" to okurimashou.", translation: "Kita balas, “Tidak apa-apa. Saya tunggu di kafe.”", audioFileName: "irodori-elementary1-07-a05-l03.mp3" },
  { speakerId: "sota", japanese: <>そうですね。先に着いたことも伝えます。</>, romaji: "Sou desu ne. Saki ni tsuita koto mo tsutaemasu.", translation: "Iya. Kita beri tahu juga kalau kita sudah sampai duluan.", audioFileName: "irodori-elementary1-07-a05-l04.mp3" },
];

const canDos = [
  { id: "ask-meeting-details", text: "Menanyakan dan memahami waktu serta tempat untuk bertemu." },
  { id: "decide-meeting-details", text: "Membicarakan dan menentukan waktu serta tempat pertemuan bersama." },
  { id: "understand-late-message", text: "Membaca pesan dari teman yang memberi tahu bahwa ia akan terlambat, lalu memahami isinya." },
  { id: "write-late-message", text: "Menulis pesan untuk memberi tahu bahwa diri sendiri akan terlambat dari waktu yang disepakati." },
  { id: "reply-to-late-message", text: "Membalas pesan keterlambatan dengan sopan dan memberi informasi yang diperlukan." },
];

const delayMessages = [
  {
    id: "train",
    sender: "りな",
    time: "09:12",
    japanese: "すみません。電車が止まっていて、十五分ぐらい遅れます。",
    romaji: "Sumimasen. Densha ga tomatte ite, juugofun gurai okuremasu.",
    translation: "Maaf. Kereta berhenti, jadi saya akan terlambat sekitar 15 menit.",
    reason: "Alasan: layanan kereta sedang berhenti.",
    reply: "大丈夫です。駅の中で待っています。",
    replyMeaning: "Tidak apa-apa. Saya menunggu di dalam stasiun.",
  },
  {
    id: "lost",
    sender: "たくや",
    time: "13:25",
    japanese: "道に迷ってしまいました。十分ぐらい遅れそうです。",
    romaji: "Michi ni mayotte shimaimashita. Juppun gurai okuresou desu.",
    translation: "Saya tersesat. Sepertinya saya akan terlambat sekitar 10 menit.",
    reason: "Alasan: pengirim salah jalan dan sedang mencari lokasi.",
    reply: "わかりました。あわてなくても大丈夫ですよ。",
    replyMeaning: "Saya mengerti. Tidak perlu terburu-buru.",
  },
  {
    id: "overslept",
    sender: "みほ",
    time: "08:05",
    japanese: "すみません。寝坊して、今から急ぎます。",
    romaji: "Sumimasen. Nebou shite, ima kara isogimasu.",
    translation: "Maaf, saya kesiangan. Saya segera berangkat sekarang.",
    reason: "Alasan: pengirim bangun kesiangan.",
    reply: "連絡ありがとう。着いたら教えてください。",
    replyMeaning: "Terima kasih sudah memberi kabar. Beri tahu saya saat sudah sampai.",
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
    prompt: <>Ungkapan 「午後二時はどうですか」 digunakan untuk …</>,
    options: [{ key: "a", label: "Mengusulkan pukul dua siang sebagai waktu bertemu." }, { key: "b", label: "Memberi tahu alasan keterlambatan." }, { key: "c", label: "Menanyakan arah jalan." }],
    answer: "a",
    explanation: <>N はどうですか dipakai untuk mengusulkan pilihan waktu atau tempat dan menanyakan apakah orang lain setuju.</>,
  },
  {
    prompt: <>Pilih kalimat yang menawarkan waktu alternatif dengan sopan.</>,
    options: [{ key: "a", label: "三時でもいいですか。" }, { key: "b", label: "三時に着きました。" }, { key: "c", label: "三時から始まります。" }],
    answer: "a",
    explanation: <>N でもいいですか digunakan untuk mengusulkan alternatif dan memastikan apakah pilihan tersebut cocok.</>,
  },
  {
    prompt: <>Pada kalimat 「事故で電車が止まりました」, apa penyebab kereta berhenti?</>,
    options: [{ key: "a", label: "Karena ada insiden." }, { key: "b", label: "Karena tempat pertemuannya berubah." }, { key: "c", label: "Karena sudah sampai." }],
    answer: "a",
    explanation: <>Partikel で setelah kata benda dapat menandai sebab atau alasan pada kalimat berikutnya.</>,
  },
  {
    prompt: <>Lengkapi: 「道に迷って、少し ___。」</>,
    options: [{ key: "a", label: "遅れます" }, { key: "b", label: "集合です" }, { key: "c", label: "待ち合わせです" }],
    answer: "a",
    explanation: <>Bentuk ～て pada kata kerja dapat menghubungkan alasan dengan akibatnya: tersesat, jadi terlambat.</>,
  },
  {
    prompt: <>Pada pesan 「十五分ぐらい遅れます」, berapa lama keterlambatannya?</>,
    options: [{ key: "a", label: "Sekitar lima belas menit." }, { key: "b", label: "Sekitar lima belas jam." }, { key: "c", label: "Tidak ada keterlambatan." }],
    answer: "a",
    explanation: <>十五分ぐらい berarti sekitar lima belas menit. ぐらい menunjukkan perkiraan jumlah atau durasi.</>,
  },
  {
    prompt: <>Pilih balasan yang ramah untuk teman yang mengirim pesan akan terlambat.</>,
    options: [{ key: "a", label: "わかりました。気をつけて来てください。" }, { key: "b", label: "どうして早く来ませんか。" }, { key: "c", label: "もう帰ります。" }],
    answer: "a",
    explanation: <>Balasan ini menunjukkan bahwa pesan sudah diterima dan mengingatkan teman agar datang dengan aman tanpa perlu terburu-buru.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa fungsi 「午後二時はどうですか」?</>,
    options: [{ key: "a", label: "Mengusulkan waktu pertemuan." }, { key: "b", label: "Meminta maaf karena terlambat." }, { key: "c", label: "Menjelaskan penyebab kereta berhenti." }],
    answer: "a",
    explanation: <>N はどうですか digunakan untuk mengusulkan waktu atau tempat dan meminta pendapat lawan bicara.</>,
  },
  {
    prompt: <>Kalimat 「駅の東口はどうですか」 mengusulkan …</>,
    options: [{ key: "a", label: "Pintu keluar timur stasiun sebagai tempat bertemu." }, { key: "b", label: "Waktu keberangkatan kereta." }, { key: "c", label: "Alasan seseorang terlambat." }],
    answer: "a",
    explanation: <>N dapat berupa kata yang menunjukkan tempat, bukan hanya waktu.</>,
  },
  {
    prompt: <>Pilih ungkapan untuk menawarkan waktu lain jika pilihan awal kurang cocok.</>,
    options: [{ key: "a", label: "三時でもいいですか。" }, { key: "b", label: "三時はどうでしたか。" }, { key: "c", label: "三時に遅れました。" }],
    answer: "a",
    explanation: <>N でもいいですか menawarkan alternatif dan menanyakan apakah pilihan baru dapat diterima.</>,
  },
  {
    prompt: <>Pada pesan 「電車が止まっていて、十五分ぐらい遅れます」, apa informasi utamanya?</>,
    options: [{ key: "a", label: "Pengirim terlambat sekitar lima belas menit karena kereta berhenti." }, { key: "b", label: "Pengirim sudah tiba di tempat pertemuan." }, { key: "c", label: "Pengirim ingin mengganti lokasi pertemuan besok." }],
    answer: "a",
    explanation: <>Pesan menyebutkan alasan (kereta berhenti) dan perkiraan durasi keterlambatan (sekitar 15 menit).</>,
  },
  {
    prompt: <>Pola N で、～ dapat digunakan untuk menyatakan …</>,
    options: [{ key: "a", label: "Sebab atau alasan." }, { key: "b", label: "Tempat tujuan yang ingin didatangi." }, { key: "c", label: "Pilihan yang ditolak." }],
    answer: "a",
    explanation: <>Kata benda yang diikuti で dapat menjadi sebab atau alasan, misalnya 事故で電車が止まりました.</>,
  },
  {
    prompt: <>Pola V-て、～ dalam Lesson 7 juga dapat menunjukkan …</>,
    options: [{ key: "a", label: "Sebab atau alasan." }, { key: "b", label: "Hanya bentuk perintah." }, { key: "c", label: "Hanya waktu pertemuan." }],
    answer: "a",
    explanation: <>Selain menghubungkan urutan tindakan, bentuk ～て dapat menjelaskan penyebab atau alasan.</>,
  },
  {
    prompt: <>Apa arti 「道に迷う」?</>,
    options: [{ key: "a", label: "Tersesat." }, { key: "b", label: "Bertemu teman." }, { key: "c", label: "Memesan tempat." }],
    answer: "a",
    explanation: <>道 berarti jalan dan 迷う berarti bingung atau tersesat; bersama-sama berarti tersesat di jalan.</>,
  },
  {
    prompt: <>Pada pesan 「寝坊して、今から急ぎます」, apa yang dilakukan pengirim?</>,
    options: [{ key: "a", label: "Bangun kesiangan dan sekarang akan bergegas." }, { key: "b", label: "Sudah tiba lebih awal." }, { key: "c", label: "Sedang menentukan tempat pertemuan." }],
    answer: "a",
    explanation: <>寝坊して menyatakan alasan, sedangkan 今から急ぎます menjelaskan tindakan mulai sekarang.</>,
  },
  {
    prompt: <>Apa arti 「十分ぐらい」?</>,
    options: [{ key: "a", label: "Sekitar sepuluh menit." }, { key: "b", label: "Sepuluh orang." }, { key: "c", label: "Sepuluh tempat." }],
    answer: "a",
    explanation: <>十分 dibaca じゅっぷん (juppun), yaitu sepuluh menit. ぐらい menyatakan perkiraan.</>,
  },
  {
    prompt: <>Kamu menerima pesan bahwa teman akan terlambat. Balasan yang paling sesuai adalah …</>,
    options: [{ key: "a", label: "わかりました。ここで待っています。" }, { key: "b", label: "メッセージを読みません。" }, { key: "c", label: "もう約束を忘れました。" }],
    answer: "a",
    explanation: <>Balasan ini memastikan pesan sudah diterima dan memberi tahu bahwa kamu akan menunggu di tempat yang disepakati.</>,
  },
];

const simulations = [
  {
    title: "01 · Menanyakan waktu dan tempat",
    heading: "Memastikan detail pertemuan",
    prompt: "Yui ingin memastikan rencana bertemu besok sebelum pergi bersama.",
    japanese: <>明日は何時にどこで会いますか。</>,
    translation: "Besok kita bertemu jam berapa dan di mana?",
    options: [
      { key: "details", label: "午前九時に駅の東口です。", meaning: "Pukul sembilan pagi di pintu keluar timur stasiun." },
      { key: "reason", label: "道に迷って、遅れます。", meaning: "Saya tersesat, jadi akan terlambat." },
      { key: "reply", label: "気をつけて来てください。", meaning: "Hati-hati saat datang." },
    ],
    answer: "details",
    explanation: "Jawaban menyebutkan waktu dan tempat secara jelas sehingga kedua orang memiliki informasi pertemuan yang sama.",
  },
  {
    title: "02 · Mengusulkan waktu pertemuan",
    heading: "Memakai N はどうですか",
    prompt: "Akiko ingin mengusulkan pukul tiga sore sebagai waktu bertemu.",
    japanese: <>待ち合わせは何時にしますか。</>,
    translation: "Kita bertemu jam berapa?",
    options: [
      { key: "suggest", label: "午後三時はどうですか。", meaning: "Bagaimana kalau pukul tiga sore?" },
      { key: "late", label: "午後三時ぐらい遅れます。", meaning: "Saya akan terlambat sekitar tiga jam." },
      { key: "cause", label: "事故で電車が止まりました。", meaning: "Kereta berhenti karena sebuah insiden." },
    ],
    answer: "suggest",
    explanation: "N はどうですか digunakan untuk menawarkan waktu atau tempat dan meminta pendapat orang lain.",
  },
  {
    title: "03 · Menawarkan pilihan alternatif",
    heading: "Memakai N でもいいですか",
    prompt: "Pukul dua kurang cocok bagi Kenji. Ia ingin menawarkan pukul tiga sebagai pilihan lain.",
    japanese: <>二時はちょっと早いです。</>,
    translation: "Pukul dua agak terlalu awal.",
    options: [
      { key: "alternative", label: "三時でもいいですか。", meaning: "Bolehkah pukul tiga?" },
      { key: "same", label: "二時でいいですか。", meaning: "Apakah pukul dua tidak apa-apa?" },
      { key: "late", label: "三時に遅れます。", meaning: "Saya terlambat pukul tiga." },
    ],
    answer: "alternative",
    explanation: "N でもいいですか menanyakan apakah alternatif baru dapat diterima.",
  },
  {
    title: "04 · Memahami alasan keterlambatan",
    heading: "Membaca isi pesan",
    prompt: "Kamu menerima pesan: 「道に迷って、十分ぐらい遅れます。」",
    japanese: <>どうして遅れますか。</>,
    translation: "Mengapa dia terlambat?",
    options: [
      { key: "lost", label: "道に迷ったからです。", meaning: "Karena tersesat." },
      { key: "place", label: "場所を決めたからです。", meaning: "Karena sudah menentukan tempat." },
      { key: "early", label: "先に着いたからです。", meaning: "Karena sudah tiba lebih dahulu." },
    ],
    answer: "lost",
    explanation: "道に迷って menyebutkan penyebab keterlambatan; 迷う berarti tersesat.",
  },
  {
    title: "05 · Membalas pesan keterlambatan",
    heading: "Menanggapi dengan sopan",
    prompt: "Teman mengabari bahwa ia akan terlambat sekitar sepuluh menit. Kamu sudah berada di tempat pertemuan.",
    japanese: <>どんな返事を送りますか。</>,
    translation: "Balasan seperti apa yang akan kamu kirim?",
    options: [
      { key: "kind", label: "わかりました。ここで待っています。", meaning: "Saya mengerti. Saya menunggu di sini." },
      { key: "blame", label: "どうして遅れましたか。", meaning: "Mengapa kamu terlambat?" },
      { key: "leave", label: "もう帰ります。", meaning: "Saya pulang sekarang." },
    ],
    answer: "kind",
    explanation: "Balasan ini memastikan pesan diterima dan memberi informasi bahwa kamu akan menunggu di lokasi yang disepakati.",
  },
];

const vocabulary = [
  ["待ち合わせ", "まちあわせ · machiawase", "Janji bertemu di waktu dan tempat tertentu"],
  ["集合する", "しゅうごうする · shuugou suru", "Berkumpul"],
  ["時間", "じかん · jikan", "Waktu"],
  ["場所", "ばしょ · basho", "Tempat"],
  ["駅", "えき · eki", "Stasiun"],
  ["受付", "うけつけ · uketsuke", "Resepsionis / meja penerimaan"],
  ["ホール", "ホール · hooru", "Aula"],
  ["会社", "かいしゃ · kaisha", "Perusahaan"],
  ["門", "もん · mon", "Gerbang"],
  ["案内する", "あんないする · annai suru", "Memandu / menunjukkan tempat"],
  ["イベント", "イベント · ibento", "Acara"],
  ["始まる", "はじまる · hajimaru", "Dimulai"],
  ["スタッフ", "スタッフ · sutaffu", "Staf"],
  ["〜前", "〜まえ · mae", "Sebelum / di depan"],
  ["待ち合わせする", "まちあわせする · machiawase suru", "Bertemu sesuai janji"],
  ["事故", "じこ · jiko", "Insiden / kecelakaan"],
  ["止まる", "とまる · tomaru", "Berhenti"],
  ["連絡する", "れんらくする · renraku suru", "Menghubungi / memberi kabar"],
  ["ねぼうする", "ねぼうする · nebou suru", "Bangun kesiangan"],
  ["今から", "いまから · ima kara", "Mulai sekarang"],
  ["急ぐ", "いそぐ · isogu", "Bergegas"],
  ["道に迷う", "みちにまよう · michi ni mayou", "Tersesat"],
  ["遅れる", "おくれる · okureru", "Terlambat"],
  ["着く", "つく · tsuku", "Tiba / sampai"],
  ["待つ", "まつ · matsu", "Menunggu"],
];

const kanjiWords = [
  ["時間", "じかん · jikan", "Waktu"],
  ["電車", "でんしゃ · densha", "Kereta"],
  ["場所", "ばしょ · basho", "Tempat"],
  ["待つ", "まつ · matsu", "Menunggu"],
  ["駅", "えき · eki", "Stasiun"],
  ["止まる", "とまる · tomaru", "Berhenti"],
  ["受付", "うけつけ · uketsuke", "Meja penerimaan"],
  ["着く", "つく · tsuku", "Tiba / sampai"],
  ["門", "もん · mon", "Gerbang"],
  ["急ぐ", "いそぐ · isogu", "Bergegas"],
];

export default function IrodoriElementaryOneLessonSevenPage() {
  const progress = useIrodoriProgress();
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [messageDraft, setMessageDraft] = useState("");

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
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#91B99A]/[0.08]">待</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">IRODORI • DASAR 1 A2 • PELAJARAN 07</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya akan sedikit terlambat karena tersesat.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9CDB0]">道に迷って、少し遅れます</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Berlatih menentukan waktu dan tempat pertemuan, membaca pesan tentang keterlambatan, serta memberi kabar jika tidak dapat tiba tepat waktu.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9CDB0]" />Waktu & tempat bertemu</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#A9CDB0]" />Menentukan jadwal</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#A9CDB0]" />Pesan keterlambatan</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A9CDB0]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target pertama mengikuti target komunikasi resmi. Target terakhir merupakan latihan penguatan Fude.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">{index < 4 ? "CAN-DO UTAMA" : "LATIHAN PENGUATAN"} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KOSAKATA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pertemuan, waktu, dan keterlambatan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata untuk menentukan tempat bertemu, menyebutkan waktu, dan memberi kabar ketika terlambat.</p>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Mengatur pertemuan dan mengabarkan keterlambatan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan cara menanyakan waktu dan tempat, menyepakati pilihan, serta menyampaikan alasan keterlambatan.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Menanyakan waktu dan tempat pertemuan" speakers={[speakers.yui, speakers.sota]} utterances={askingMeetingDetailsConversation} />
          <IrodoriConversation title="Menyepakati pilihan waktu dan tempat" speakers={[speakers.akiko, speakers.kenji]} utterances={decidingMeetingTimeConversation} />
          <IrodoriConversation title="Memahami pesan keterlambatan" speakers={[speakers.sota, speakers.yui]} utterances={readingLateMessageConversation} />
          <IrodoriConversation title="Mengirim pesan keterlambatan" speakers={[speakers.kenji, speakers.akiko]} utterances={sendingDelayMessageConversation} />
          <IrodoriConversation title="Membalas pesan teman" speakers={[speakers.yui, speakers.sota]} utterances={replyingToMessageConversation} />
        </div>
      </section>


      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">MEMBACA PESAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Cari alasan dan perkiraan waktu</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Baca pesan singkat, lalu cari tiga informasi: siapa yang mengirim, apa alasannya, dan kira-kira berapa lama ia terlambat.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {delayMessages.map((message) => (
            <article key={message.id} className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <div className="flex items-center justify-between gap-2 text-[10px]">
                <span className="font-bold text-[#A9CDB0]">{message.sender}</span>
                <span className="text-[#817A73]">{message.time}</span>
              </div>
              <div className="mt-3 rounded-xl border border-[#6E9A75]/20 bg-[#202720] p-3">
                <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">{message.japanese}</p>
                <p className="mt-2 text-[10px] italic leading-5 text-[#A9CDB0]">{message.romaji}</p>
                <p className="mt-2 text-xs leading-5 text-[#D0C9BD]">{message.translation}</p>
              </div>
              <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">{message.reason}</p>
              <div className="mt-3 rounded-lg bg-black/20 p-3">
                <p className="text-[8px] font-black tracking-[0.16em] text-[#8EAE93]">CONTOH BALASAN</p>
                <p className="mt-1 font-mincho text-sm text-[#F1EBDD]">{message.reply}</p>
                <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{message.replyMeaning}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4 md:p-5">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">LATIHAN MENULIS PESAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Buat pesanmu sendiri</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Tulis pesan singkat ketika kamu tidak dapat tiba sesuai waktu yang disepakati. Usahakan mencakup permintaan maaf, alasan, dan perkiraan waktu tiba.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
            <p className="text-[9px] font-black tracking-[0.14em] text-[#A9CDB0]">01 · 謝ることば</p>
            <p className="mt-1 text-xs text-[#C8C2B8]">Mulai dengan permintaan maaf.</p>
            <p className="mt-2 font-mincho text-sm text-[#F1EBDD]">すみません。</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
            <p className="text-[9px] font-black tracking-[0.14em] text-[#A9CDB0]">02 · 理由</p>
            <p className="mt-1 text-xs text-[#C8C2B8]">Jelaskan alasan keterlambatan.</p>
            <p className="mt-2 font-mincho text-sm text-[#F1EBDD]">電車が止まっていて…</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
            <p className="text-[9px] font-black tracking-[0.14em] text-[#A9CDB0]">03 · 時間</p>
            <p className="mt-1 text-xs text-[#C8C2B8]">Sebutkan perkiraan durasinya.</p>
            <p className="mt-2 font-mincho text-sm text-[#F1EBDD]">十五分ぐらい遅れます。</p>
          </div>
        </div>
        <label htmlFor="irodori-delay-message" className="block text-xs font-semibold text-[#D0C9BD]">Pesan yang ingin kamu kirim</label>
        <textarea
          id="irodori-delay-message"
          value={messageDraft}
          onChange={(event) => setMessageDraft(event.target.value)}
          rows={4}
          placeholder="すみません。道に迷って、十分ぐらい遅れます。"
          className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171615] p-3 text-sm leading-7 text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#8EAE93]/60"
        />
        <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">PRATINJAU PESAN</p>
            <span className="text-[9px] text-[#817A73]">{messageDraft.length} karakter</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-[#D0C9BD]">{messageDraft || "Pesan yang kamu tulis akan muncul di sini."}</p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menentukan rencana dan menjelaskan alasan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Tiga pola ini membantu mengusulkan waktu atau tempat, menawarkan pilihan lain, dan menyampaikan alasan ketika rencana berubah.</p>
        </div>
        {[
          {
            title: "01 · Mengusulkan waktu atau tempat",
            pattern: "N はどうですか？",
            example: <>午後二時はどうですか。／ 駅の東口はどうですか。</>,
            note: "Gunakan pola ini untuk mengusulkan pilihan dan menanyakan pendapat lawan bicara. N dapat berupa kata yang menunjukkan waktu atau tempat. Contoh: 明日の午前十時はどうですか (Bagaimana kalau besok pukul sepuluh pagi?).",
          },
          {
            title: "02 · Menawarkan pilihan alternatif",
            pattern: "N でもいいですか？",
            example: <>三時でもいいですか。／ カフェの前でもいいですか。</>,
            note: "Gunakan pola ini ketika pilihan pertama kurang cocok dan kamu ingin mengusulkan alternatif. N dapat berupa waktu atau tempat. Ungkapan ini menanyakan apakah pilihan baru dapat diterima, bukan memaksakan keputusan.",
          },
          {
            title: "03 · Menyampaikan sebab atau alasan",
            pattern: "N で、～ / V-て、～",
            example: <>事故で電車が止まりました。／ 道に迷って、少し遅れます。</>,
            note: "Kata benda + で dan kata kerja bentuk ～て dapat menunjukkan alasan untuk peristiwa berikutnya. Contoh: 事故で (karena insiden), 電車が止まりました (kereta berhenti); 寝坊して (karena bangun kesiangan), 今から急ぎます (sekarang akan bergegas).",
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali tulisan penting tentang waktu, tempat, dan pertemuan</h2>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan ungkapan dalam situasi membuat janji</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi mengatur pertemuan, memahami alasan keterlambatan, dan menanggapi pesan. Setiap situasi harus dijawab benar.</p>
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
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. </p>
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
        Dialog, tokoh, pesan, dan situasi latihan dibuat orisinal oleh Fude untuk melatih komunikasi tentang janji bertemu dan keterlambatan.
      </p>
    </main>
  );
}
