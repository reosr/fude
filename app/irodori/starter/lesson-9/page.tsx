"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  AlarmClock,
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Coffee,
  Moon,
  RefreshCw,
  Sun,
} from "lucide-react";
import IrodoriConversation, {
  type IrodoriUtterance,
} from "@/components/IrodoriConversation";
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

const wakeSleepConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>ユイさんは、<ruby>毎朝<rt>まいあさ</rt></ruby><ruby>何時<rt>なんじ</rt></ruby>に<ruby>起<rt>お</rt></ruby>きますか？</>,
    romaji: "Yui-san wa, maiasa nanji ni okimasu ka?",
    translation: "Yui, setiap pagi kamu bangun pukul berapa?",
    audioFileName: "irodori-starter-09-a01-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>7<ruby>時<rt>じ</rt></ruby>ごろ<ruby>起<rt>お</rt></ruby>きます。</>,
    romaji: "Shichiji goro okimasu.",
    translation: "Saya bangun sekitar pukul tujuh.",
    audioFileName: "irodori-starter-09-a01-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>そうですか。<ruby>夜<rt>よる</rt></ruby>は、<ruby>何時<rt>なんじ</rt></ruby>に<ruby>寝<rt>ね</rt></ruby>ますか？</>,
    romaji: "Sou desu ka. Yoru wa, nanji ni nemasu ka?",
    translation: "Begitu ya. Kalau malam, kamu tidur pukul berapa?",
    audioFileName: "irodori-starter-09-a01-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>11<ruby>時半<rt>じはん</rt></ruby>に<ruby>寝<rt>ね</rt></ruby>ます。</>,
    romaji: "Juuichiji han ni nemasu.",
    translation: "Saya tidur pukul setengah dua belas malam.",
    audioFileName: "irodori-starter-09-a01-l04.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ときどき、<ruby>朝<rt>あさ</rt></ruby>、ジョギングをしますか？</>,
    romaji: "Tokidoki, asa, jogingu o shimasu ka?",
    translation: "Apakah kadang-kadang kamu jogging pada pagi hari?",
    audioFileName: "irodori-starter-09-a01-l05.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>はい。<ruby>毎朝<rt>まいあさ</rt></ruby>ではありません。<ruby>土曜日<rt>どようび</rt></ruby>にします。</>,
    romaji: "Hai. Maiasa de wa arimasen. Doyoubi ni shimasu.",
    translation: "Ya. Tidak setiap pagi. Saya melakukannya pada hari Sabtu.",
    audioFileName: "irodori-starter-09-a01-l06.mp3",
  },
];

const workScheduleConversation: IrodoriUtterance[] = [
  {
    speakerId: "kenji",
    japanese: <>この<ruby>会社<rt>かいしゃ</rt></ruby>の<ruby>仕事<rt>しごと</rt></ruby>は、<ruby>何時<rt>なんじ</rt></ruby>からですか？</>,
    romaji: "Kono kaisha no shigoto wa, nanji kara desu ka?",
    translation: "Pekerjaan di perusahaan ini mulai pukul berapa?",
    audioFileName: "irodori-starter-09-a02-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <><ruby>朝<rt>あさ</rt></ruby>9<ruby>時<rt>じ</rt></ruby>からです。はじめに、<ruby>朝礼<rt>ちょうれい</rt></ruby>があります。</>,
    romaji: "Asa kuji kara desu. Hajime ni, chourei ga arimasu.",
    translation: "Mulai pukul sembilan pagi. Pertama, ada pengarahan pagi.",
    audioFileName: "irodori-starter-09-a02-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <><ruby>午前<rt>ごぜん</rt></ruby>の<ruby>仕事<rt>しごと</rt></ruby>は、<ruby>何時<rt>なんじ</rt></ruby>までですか？</>,
    romaji: "Gozen no shigoto wa, nanji made desu ka?",
    translation: "Jam kerja pagi sampai pukul berapa?",
    audioFileName: "irodori-starter-09-a02-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>12<ruby>時<rt>じ</rt></ruby>までです。</>,
    romaji: "Juuni-ji made desu.",
    translation: "Sampai pukul dua belas.",
    audioFileName: "irodori-starter-09-a02-l04.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <><ruby>昼休<rt>ひるやす</rt></ruby>みは、<ruby>何時<rt>なんじ</rt></ruby>から<ruby>何時<rt>なんじ</rt></ruby>までですか？</>,
    romaji: "Hiruyasumi wa, nanji kara nanji made desu ka?",
    translation: "Istirahat siang mulai pukul berapa sampai pukul berapa?",
    audioFileName: "irodori-starter-09-a02-l05.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>12<ruby>時<rt>じ</rt></ruby>から1<ruby>時<rt>じ</rt></ruby>までです。</>,
    romaji: "Juuni-ji kara ichiji made desu.",
    translation: "Dari pukul dua belas sampai pukul satu.",
    audioFileName: "irodori-starter-09-a02-l06.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <><ruby>午後<rt>ごご</rt></ruby>の<ruby>仕事<rt>しごと</rt></ruby>は、<ruby>何時<rt>なんじ</rt></ruby>までですか？</>,
    romaji: "Gogo no shigoto wa, nanji made desu ka?",
    translation: "Jam kerja setelah istirahat siang sampai pukul berapa?",
    audioFileName: "irodori-starter-09-a02-l07.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>6<ruby>時<rt>じ</rt></ruby>までです。ときどき、<ruby>残業<rt>ざんぎょう</rt></ruby>があります。</>,
    romaji: "Rokuji made desu. Tokidoki, zangyou ga arimasu.",
    translation: "Sampai pukul enam. Kadang-kadang ada lembur.",
    audioFileName: "irodori-starter-09-a02-l08.mp3",
  },
];

const scheduleBoardConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <><ruby>今<rt>いま</rt></ruby>、11<ruby>時半<rt>じはん</rt></ruby>です。<ruby>田中<rt>たなか</rt></ruby>さんは、いますか？</>,
    romaji: "Ima, juuichiji han desu. Tanaka-san wa, imasu ka?",
    translation: "Sekarang pukul setengah dua belas. Apakah Tanaka ada?",
    audioFileName: "irodori-starter-09-a03-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>はい、います。<ruby>小林<rt>こばやし</rt></ruby>さんもいます。</>,
    romaji: "Hai, imasu. Kobayashi-san mo imasu.",
    translation: "Ya, ada. Kobayashi juga ada.",
    audioFileName: "irodori-starter-09-a03-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ミナさんは、どこですか？</>,
    romaji: "Mina-san wa, doko desu ka?",
    translation: "Kalau Mina, di mana?",
    audioFileName: "irodori-starter-09-a03-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <><ruby>銀行<rt>ぎんこう</rt></ruby>へ<ruby>外出<rt>がいしゅつ</rt></ruby>しています。12<ruby>時<rt>じ</rt></ruby>ごろ<ruby>戻<rt>もど</rt></ruby>ります。</>,
    romaji: "Ginkou e gaishutsu shite imasu. Juuniji goro modorimasu.",
    translation: "Dia sedang keluar ke bank. Akan kembali sekitar pukul dua belas.",
    audioFileName: "irodori-starter-09-a03-l04.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>エマさんは？</>,
    romaji: "Ema-san wa?",
    translation: "Kalau Emma?",
    audioFileName: "irodori-starter-09-a03-l05.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <><ruby>今日<rt>きょう</rt></ruby>は<ruby>休<rt>やす</rt></ruby>みです。ラウルさんは、<ruby>午後<rt>ごご</rt></ruby>1<ruby>時<rt>じ</rt></ruby>からです。</>,
    romaji: "Kyou wa yasumi desu. Rauru-san wa, gogo ichiji kara desu.",
    translation: "Hari ini dia libur. Raul mulai masuk pukul satu siang.",
    audioFileName: "irodori-starter-09-a03-l06.mp3",
  },
];

const availabilityConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <><ruby>映画<rt>えいが</rt></ruby>、いつがいいですか？</>,
    romaji: "Eiga, itsu ga ii desu ka?",
    translation: "Kapan waktu yang cocok untuk menonton film?",
    audioFileName: "irodori-starter-09-a04-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <><ruby>土曜日<rt>どようび</rt></ruby>がいいです。</>,
    romaji: "Doyoubi ga ii desu.",
    translation: "Hari Sabtu cocok buat saya.",
    audioFileName: "irodori-starter-09-a04-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>すみません。<ruby>土曜日<rt>どようび</rt></ruby>は、ちょっと……。</>,
    romaji: "Sumimasen. Doyoubi wa, chotto...",
    translation: "Maaf. Hari Sabtu agak sulit bagi saya...",
    audioFileName: "irodori-starter-09-a04-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>じゃあ、<ruby>日曜日<rt>にちようび</rt></ruby>はどうですか？</>,
    romaji: "Jaa, nichiyoubi wa dou desu ka?",
    translation: "Kalau begitu, bagaimana hari Minggu?",
    audioFileName: "irodori-starter-09-a04-l04.mp3",
  },
  {
    speakerId: "sota",
    japanese: <><ruby>日曜日<rt>にちようび</rt></ruby>は、だいじょうぶです。</>,
    romaji: "Nichiyoubi wa, daijoubu desu.",
    translation: "Hari Minggu tidak masalah.",
    audioFileName: "irodori-starter-09-a04-l05.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>じゃあ、<ruby>日曜日<rt>にちようび</rt></ruby>にしましょう。</>,
    romaji: "Jaa, nichiyoubi ni shimashou.",
    translation: "Kalau begitu, kita pilih hari Minggu.",
    audioFileName: "irodori-starter-09-a04-l06.mp3",
  },
];

const canDos = [
  { id: "wake-sleep-time", text: "Menanyakan dan menjawab jam berapa biasanya bangun dan tidur." },
  { id: "workday-schedule", text: "Memahami penjelasan sederhana tentang jadwal kegiatan selama satu hari kerja." },
  { id: "schedule-board", text: "Membaca papan jadwal di tempat kerja dan memahami informasi kehadiran serta kegiatan orang lain." },
  { id: "arrange-availability", text: "Menanyakan waktu yang cocok dan menyepakati hari atau jam untuk membuat janji." },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Sudah bisa, masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

const timeWords = [
  { jp: <><ruby>朝<rt>あさ</rt></ruby></>, reading: "asa", meaning: "Pagi", icon: "🌅" },
  { jp: <><ruby>昼<rt>ひる</rt></ruby></>, reading: "hiru", meaning: "Siang", icon: "☀️" },
  { jp: <><ruby>夜<rt>よる</rt></ruby></>, reading: "yoru", meaning: "Malam", icon: "🌙" },
  { jp: <><ruby>午前<rt>ごぜん</rt></ruby></>, reading: "gozen", meaning: "Sebelum pukul 12 siang", icon: "🌤️" },
  { jp: <><ruby>午後<rt>ごご</rt></ruby></>, reading: "gogo", meaning: "Setelah pukul 12 siang", icon: "🌆" },
  { jp: <><ruby>毎朝<rt>まいあさ</rt></ruby></>, reading: "maiasa", meaning: "Setiap pagi", icon: "🔁" },
  { jp: <><ruby>毎晩<rt>まいばん</rt></ruby></>, reading: "maiban", meaning: "Setiap malam", icon: "🌙" },
  { jp: <><ruby>毎日<rt>まいにち</rt></ruby></>, reading: "mainichi", meaning: "Setiap hari", icon: "📅" },
];

const clockExamples = [
  { time: "4:00", jp: <><ruby>4時<rt>よじ</rt></ruby></>, reading: "yoji", note: "Bukan yonji" },
  { time: "7:00", jp: <><ruby>7時<rt>しちじ</rt></ruby></>, reading: "shichiji", note: "Jam tujuh" },
  { time: "9:00", jp: <><ruby>9時<rt>くじ</rt></ruby></>, reading: "kuji", note: "Bukan kyuuji" },
  { time: "7:15", jp: <><ruby>7時15分<rt>しちじじゅうごふん</rt></ruby></>, reading: "shichiji juugofun", note: "Jam tujuh lewat lima belas" },
  { time: "8:30", jp: <><ruby>8時半<rt>はちじはん</rt></ruby></>, reading: "hachiji han", note: "Setengah sembilan" },
  { time: "10:45", jp: <><ruby>10時45分<rt>じゅうじよんじゅうごふん</rt></ruby></>, reading: "juuji yonjuugofun", note: "Jam sepuluh lewat empat puluh lima" },
];

const dailyActivities = [
  { time: "09.00", label: <><ruby>朝礼<rt>ちょうれい</rt></ruby></>, description: "Pengarahan pagi", icon: "🗣️", tone: "border-[#B8860B]/30 bg-[#B8860B]/10" },
  { time: "09.15–12.00", label: <><ruby>午前<rt>ごぜん</rt></ruby>の<ruby>仕事<rt>しごと</rt></ruby></>, description: "Pekerjaan pagi", icon: "💼", tone: "border-[#4B8B9B]/30 bg-[#4B8B9B]/10" },
  { time: "12.00–13.00", label: <><ruby>昼休<rt>ひるやす</rt></ruby>み</>, description: "Istirahat siang", icon: "🍱", tone: "border-[#7D9C69]/30 bg-[#7D9C69]/10" },
  { time: "13.00–15.00", label: <><ruby>午後<rt>ごご</rt></ruby>の<ruby>仕事<rt>しごと</rt></ruby></>, description: "Pekerjaan siang", icon: "🧑‍💻", tone: "border-[#4B8B9B]/30 bg-[#4B8B9B]/10" },
  { time: "15.00–15.15", label: <><ruby>休憩時間<rt>きゅうけいじかん</rt></ruby></>, description: "Istirahat singkat", icon: "☕", tone: "border-[#7D9C69]/30 bg-[#7D9C69]/10" },
  { time: "15.15–18.00", label: <><ruby>仕事<rt>しごと</rt></ruby></>, description: "Melanjutkan pekerjaan", icon: "🗂️", tone: "border-[#4B8B9B]/30 bg-[#4B8B9B]/10" },
  { time: "18.00–", label: <><ruby>残業<rt>ざんぎょう</rt></ruby>（ときどき）</>, description: "Lembur (kadang-kadang)", icon: "🌙", tone: "border-[#A77FBD]/30 bg-[#A77FBD]/10" },
];

const scheduleBoard = [
  { name: "Tanaka", status: "在", statusReading: "zai", note: "Di kantor", detail: "Sedang bekerja", color: "text-emerald-300" },
  { name: "Mina", status: "不在", statusReading: "fuzai", note: "外出 · 銀行", detail: "Kembali sekitar 12.00", color: "text-amber-300" },
  { name: "Erik", status: "不在", statusReading: "fuzai", note: "休み", detail: "Libur hari ini", color: "text-[#A9A398]" },
  { name: "Kobayashi", status: "在", statusReading: "zai", note: "早退 · 16.00", detail: "Pulang lebih awal pukul 16.00", color: "text-emerald-300" },
  { name: "Emma", status: "不在", statusReading: "fuzai", note: "休み", detail: "Libur hari ini", color: "text-[#A9A398]" },
  { name: "Sato", status: "在", statusReading: "zai", note: "会議中 · 10.30–11.30", detail: "Sedang rapat sampai 11.30", color: "text-emerald-300" },
];

const weekdays = [
  { key: "mon", jp: <ruby>月曜日<rt>げつようび</rt></ruby>, reading: "getsuyoubi", label: "Senin" },
  { key: "tue", jp: <ruby>火曜日<rt>かようび</rt></ruby>, reading: "kayoubi", label: "Selasa" },
  { key: "wed", jp: <ruby>水曜日<rt>すいようび</rt></ruby>, reading: "suiyoubi", label: "Rabu" },
  { key: "thu", jp: <ruby>木曜日<rt>もくようび</rt></ruby>, reading: "mokuyoubi", label: "Kamis" },
  { key: "fri", jp: <ruby>金曜日<rt>きんようび</rt></ruby>, reading: "kinyoubi", label: "Jumat" },
  { key: "sat", jp: <ruby>土曜日<rt>どようび</rt></ruby>, reading: "doyoubi", label: "Sabtu" },
  { key: "sun", jp: <ruby>日曜日<rt>にちようび</rt></ruby>, reading: "nichiyoubi", label: "Minggu" },
];

const availabilityRows = [
  { day: "金曜日", reading: "きんようび", yui: true, sota: false },
  { day: "土曜日", reading: "どようび", yui: true, sota: true },
  { day: "日曜日", reading: "にちようび", yui: false, sota: true },
];

const practiceTasks: {
  prompt: ReactNode;
  options: { key: string; label: ReactNode }[];
  answer: string;
  explanation: ReactNode;
}[] = [
  {
    prompt: <>Yui bangun sekitar pukul berapa?</>,
    options: [
      { key: "a", label: <><ruby>5時<rt>ごじ</rt></ruby>ごろ (sekitar pukul lima)</> },
      { key: "b", label: <><ruby>7時<rt>しちじ</rt></ruby>ごろ (sekitar pukul tujuh)</> },
      { key: "c", label: <><ruby>9時<rt>くじ</rt></ruby>ごろ (sekitar pukul sembilan)</> },
    ],
    answer: "b",
    explanation: <>Yui mengatakan 「<ruby>7時<rt>しちじ</rt></ruby>ごろ<ruby>起<rt>お</rt></ruby>きます」, artinya bangun sekitar pukul tujuh.</>,
  },
  {
    prompt: <>Pukul berapa pengarahan pagi dimulai?</>,
    options: [
      { key: "a", label: "8.00" },
      { key: "b", label: "9.00" },
      { key: "c", label: "10.00" },
    ],
    answer: "b",
    explanation: <>Jadwal dimulai pukul 9.00 dengan 「<ruby>朝礼<rt>ちょうれい</rt></ruby>」 atau pengarahan pagi.</>,
  },
  {
    prompt: <>Istirahat siang berlangsung dari jam berapa sampai jam berapa?</>,
    options: [
      { key: "a", label: "11.00–12.00" },
      { key: "b", label: "12.00–13.00" },
      { key: "c", label: "13.00–14.00" },
    ],
    answer: "b",
    explanation: <>「12<ruby>時<rt>じ</rt></ruby>から1<ruby>時<rt>じ</rt></ruby>まで」 berarti dari pukul dua belas sampai pukul satu.</>,
  },
  {
    prompt: <>Siapa yang sedang libur hari ini menurut papan jadwal?</>,
    options: [
      { key: "a", label: "Mina" },
      { key: "b", label: "Erik" },
      { key: "c", label: "Kobayashi" },
    ],
    answer: "b",
    explanation: <>Pada baris Erik tertulis 「<ruby>休<rt>やす</rt></ruby>み」, artinya libur.</>,
  },
  {
    prompt: <>Kapan Mina diperkirakan kembali ke kantor?</>,
    options: [
      { key: "a", label: "Sekitar 11.00" },
      { key: "b", label: "Sekitar 12.00" },
      { key: "c", label: "Sekitar 13.00" },
    ],
    answer: "b",
    explanation: <>Mina sedang keluar dan catatan jadwal menyebutkan akan kembali sekitar pukul dua belas.</>,
  },
  {
    prompt: <>Hari apa yang cocok untuk Yui dan Sota menonton film bersama?</>,
    options: [
      { key: "a", label: "Jumat" },
      { key: "b", label: "Sabtu" },
      { key: "c", label: "Minggu" },
    ],
    answer: "b",
    explanation: <>Sabtu adalah satu-satunya hari yang tersedia untuk Yui dan Sota pada tabel latihan.</>,
  },
];

const quizQuestions: {
  prompt: ReactNode;
  options: { key: string; label: ReactNode }[];
  answer: string;
  explanation: ReactNode;
}[] = [
  {
    prompt: <>Bagaimana mengatakan “Saya bangun pukul tujuh” dengan waktu yang tepat?</>,
    options: [
      { key: "a", label: <><ruby>7時<rt>しちじ</rt></ruby>に<ruby>起<rt>お</rt></ruby>きます。</> },
      { key: "b", label: <><ruby>7時<rt>しちじ</rt></ruby>ごろに<ruby>起<rt>お</rt></ruby>きます。</> },
      { key: "c", label: <><ruby>7時<rt>しちじ</rt></ruby>から<ruby>起<rt>お</rt></ruby>きます。</> },
    ],
    answer: "a",
    explanation: <>Gunakan partikel に setelah waktu yang tepat: 「7<ruby>時<rt>しちじ</rt></ruby>に<ruby>起<rt>お</rt></ruby>きます」.</>,
  },
  {
    prompt: <>Apa perbedaan 「<ruby>7時<rt>しちじ</rt></ruby>に」 dan 「<ruby>7時<rt>しちじ</rt></ruby>ごろ」?</>,
    options: [
      { key: "a", label: "Keduanya hanya berarti tepat pukul tujuh." },
      { key: "b", label: "に menunjukkan waktu tertentu, ごろ menunjukkan sekitar waktu tersebut." },
      { key: "c", label: "ごろ dipakai untuk menunjukkan tempat." },
    ],
    answer: "b",
    explanation: <>に menyatakan waktu tertentu, sedangkan ごろ menyatakan perkiraan waktu.</>,
  },
  {
    prompt: <>Bacaan yang benar untuk 「<ruby>4時<rt>よじ</rt></ruby>」 adalah…</>,
    options: [
      { key: "a", label: "yonji" },
      { key: "b", label: "yoji" },
      { key: "c", label: "shichiji" },
    ],
    answer: "b",
    explanation: <>4<ruby>時<rt>よじ</rt></ruby> dibaca yoji, salah satu bacaan waktu yang perlu diingat.</>,
  },
  {
    prompt: <>「12<ruby>時<rt>じ</rt></ruby>から1<ruby>時<rt>じ</rt></ruby>まで」 berarti…</>,
    options: [
      { key: "a", label: "Sampai pukul dua belas dari pukul satu." },
      { key: "b", label: "Dari pukul dua belas sampai pukul satu." },
      { key: "c", label: "Sekitar pukul dua belas sampai satu." },
    ],
    answer: "b",
    explanation: <>から menandai waktu mulai dan まで menandai waktu selesai.</>,
  },
  {
    prompt: <>Kalimat 「<ruby>仕事<rt>しごと</rt></ruby>は6<ruby>時<rt>ろくじ</rt></ruby>までです」 berarti…</>,
    options: [
      { key: "a", label: "Pekerjaan dimulai pukul enam." },
      { key: "b", label: "Pekerjaan selesai pukul enam." },
      { key: "c", label: "Pekerjaan sekitar pukul enam." },
    ],
    answer: "b",
    explanation: <>まで menandai batas akhir, sehingga kalimat tersebut berarti pekerjaan sampai pukul enam.</>,
  },
  {
    prompt: <>Kata 「<ruby>昼休<rt>ひるやす</rt></ruby>み」 berarti…</>,
    options: [
      { key: "a", label: "Istirahat siang." },
      { key: "b", label: "Pengarahan pagi." },
      { key: "c", label: "Lembur." },
    ],
    answer: "a",
    explanation: <>昼休み (hiruyasumi) adalah waktu istirahat pada siang hari.</>,
  },
  {
    prompt: <>Apa arti 「<ruby>外出<rt>がいしゅつ</rt></ruby>」 pada papan jadwal?</>,
    options: [
      { key: "a", label: "Sedang libur." },
      { key: "b", label: "Sedang keluar / berada di luar kantor." },
      { key: "c", label: "Pulang lebih awal." },
    ],
    answer: "b",
    explanation: <><ruby>外出<rt>がいしゅつ</rt></ruby> berarti sedang keluar dari tempat kerja untuk suatu keperluan.</>,
  },
  {
    prompt: <>Bagaimana mengatakan “Hari Sabtu cocok untuk saya”?</>,
    options: [
      { key: "a", label: <><ruby>土曜日<rt>どようび</rt></ruby>がいいです。</> },
      { key: "b", label: <><ruby>土曜日<rt>どようび</rt></ruby>からです。</> },
      { key: "c", label: <><ruby>土曜日<rt>どようび</rt></ruby>までです。</> },
    ],
    answer: "a",
    explanation: <>Pola 「hari がいいです」 digunakan untuk menyebut hari atau waktu yang cocok.</>,
  },
  {
    prompt: <>Jika hari yang ditawarkan tidak cocok, ungkapan yang dapat digunakan adalah…</>,
    options: [
      { key: "a", label: <>だいじょうぶです。</> },
      { key: "b", label: <>すみません。<ruby>土曜日<rt>どようび</rt></ruby>はちょっと……。</> },
      { key: "c", label: <>じゃあ、そうしましょう。</> },
    ],
    answer: "b",
    explanation: <>「～はちょっと……」 adalah cara halus untuk menyatakan bahwa waktu tersebut kurang cocok.</>,
  },
  {
    prompt: <>Apa maksud 「じゃあ、<ruby>日曜日<rt>にちようび</rt></ruby>にしましょう」?</>,
    options: [
      { key: "a", label: "Kalau begitu, kita tetapkan hari Minggu." },
      { key: "b", label: "Hari Minggu tidak cocok." },
      { key: "c", label: "Hari Minggu sudah lewat." },
    ],
    answer: "a",
    explanation: <>「～にしましょう」 digunakan untuk menyepakati pilihan atau keputusan.</>,
  },
];

export default function IrodoriPemulaLessonNinePage() {
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const progress = useIrodoriProgress();
  const ratings = progress.selfEvaluations["starter-09"] ?? {};
  const isCompleted = progress.completedLessons.includes("starter-09");

  const practiceAnsweredCount = Object.keys(practiceAnswers).length;
  const practiceScore = practiceTasks.filter(
    (task, index) => practiceAnswers[index] === task.answer
  ).length;
  const practiceIsCorrect =
    practiceSubmitted && practiceScore === practiceTasks.length;
  const answeredCount = Object.keys(answers).length;
  const score = quizQuestions.filter(
    (question, index) => answers[index] === question.answer
  ).length;
  const canDosRated = canDos.every((canDo) => Boolean(ratings[canDo.id]));

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/irodori/starter"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"
        >
          <ArrowLeft size={15} />
          Daftar Pelajaran
        </Link>
        <span className="rounded-full border border-[#D6AD4F]/25 bg-[#D6AD4F]/10 px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#E7D2A1]">
          PEMULA • A1
        </span>
      </div>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#79602F]/45 bg-gradient-to-br from-[#302319] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-6 -top-10 select-none font-mincho text-[190px] leading-none text-[#D6AD4F]/[0.07]">
          時
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">
            TOPIK 05 • KEHIDUPAN SEHARI-HARI
          </p>
          <p className="mt-5 text-sm font-semibold text-[#B9A98B]">
            Pelajaran 9
          </p>
          <h1 className="mt-1 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Makan siang pukul 12.00 sampai 13.00.</h1>
          <p className="mt-2 font-mincho text-2xl text-[#D9B66D]">
            12<ruby>時<rt>じ</rt></ruby>から1<ruby>時<rt>じ</rt></ruby>まで<ruby>昼休<rt>ひるやす</rt></ruby>みです
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#B6B0A5]">
            Bicarakan kebiasaan harian, pahami jadwal kerja, baca papan jadwal
            sederhana, lalu tentukan hari dan waktu yang cocok untuk membuat
            janji bersama.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              4 target komunikasi
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              4 dialog orisinal
            </span>
            <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              10 soal kuis
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
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D6AD4F]/15 text-[#D9B66D]">
            <AlarmClock size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 01
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Menanyakan jam bangun dan tidur
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Gunakan 「<ruby>何時<rt>なんじ</rt></ruby>に<ruby>起<rt>お</rt></ruby>きますか？」 untuk bertanya jam bangun
          dan 「<ruby>何時<rt>なんじ</rt></ruby>に<ruby>寝<rt>ね</rt></ruby>ますか？」 untuk bertanya jam tidur.
          Waktu yang pasti memakai に, sedangkan waktu perkiraan memakai ごろ.
        </p>
        <IrodoriConversation
          title="Percakapan A · Rutinitas pagi dan malam"
          speakers={[IRODORI_SPEAKERS.akiko, IRODORI_SPEAKERS.yui]}
          utterances={wakeSleepConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {timeWords.map((word) => (
            <article
              key={word.reading}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/15 text-2xl">
                {word.icon}
              </span>
              <div className="min-w-0">
<JapaneseVocabularyReading reading={word.reading} meaning={word.meaning}
                  contentClassName="font-mincho text-base font-bold leading-relaxed text-[#F1EBDD]"
                  kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]"
                  romajiClassName="mt-1 text-sm italic text-[#B8860B]"
                  translationClassName="mt-2 text-xs leading-5 text-[#A9A398]"
                >
                  {word.jp}
                </JapaneseVocabularyReading>
              </div>
            </article>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
          <div className="border-b border-white/[0.07] bg-[#2B2118] p-4">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
              MEMBACA JAM
            </p>
            <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">
              Contoh membaca jam
            </h3>
            <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">
              Perhatikan bacaan khusus untuk beberapa jam dan menit.
            </p>
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {clockExamples.map((item) => (
              <article
                key={item.time}
                className="rounded-xl border border-white/[0.07] bg-black/15 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-black tabular-nums text-[#D9B66D]">
                    {item.time}
                  </span>
                  <JapaneseVocabularyReading
                    allowIndexFallback
                    reading={item.reading}
                    meaning={
                      <JapaneseReading
                        allowIndexFallback
                        showKana={false}
                        showRomaji={false}
                        contentClassName="text-xs leading-5 text-[#A9A398]"
                        kanaClassName="mt-2 font-mincho text-sm leading-relaxed text-[#D6AD4F]"
                      >
                        {formatGrammarNotation(item.note)}
                      </JapaneseReading>
                    }
                    contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]"
                    kanaClassName="mt-2 font-mincho text-base text-[#D6AD4F]"
                    romajiClassName="mt-1 text-[10px] italic text-[#B8860B]"
                    translationClassName="mt-2 text-xs leading-5 text-[#A9A398]"
                  >
                    {item.jp}
                  </JapaneseVocabularyReading>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              WAKTU YANG PASTI
            </p>
            <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">
              7<ruby>時<rt>しちじ</rt></ruby>に<ruby>起<rt>お</rt></ruby>きます。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">Saya bangun tepat pukul tujuh.</p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              WAKTU PERKIRAAN
            </p>
            <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">
              7<ruby>時<rt>しちじ</rt></ruby>ごろ<ruby>起<rt>お</rt></ruby>きます。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">Saya bangun sekitar pukul tujuh.</p>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4B8B9B]/15 text-[#8FCAD4]">
            <BriefcaseBusiness size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 02
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Memahami jadwal satu hari kerja
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Perhatikan penjelasan urutan kegiatan dalam satu hari. Pola 「AからBまで」
          menunjukkan waktu mulai dan waktu selesai. Dengarkan juga kata yang
          menandakan istirahat atau kegiatan kerja.
        </p>
        <IrodoriConversation
          title="Percakapan B · Penjelasan jadwal kantor fiktif"
          speakers={[IRODORI_SPEAKERS.kenji, IRODORI_SPEAKERS.sota]}
          utterances={workScheduleConversation}
        />
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
          <div className="border-b border-white/[0.07] bg-[#2B2118] p-4">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
              FUDE OFFICE · CONTOH FIKTIF
            </p>
            <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">
              <ruby>一日<rt>いちにち</rt></ruby>のスケジュール · Jadwal satu hari
            </h3>
            <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">
              Jadwal contoh untuk latihan memahami waktu mulai, selesai, dan jeda.
            </p>
          </div>
          <div className="space-y-2 p-4">
            {dailyActivities.map((item, index) => (
              <article
                key={index}
                className={"flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center " + item.tone}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/15 text-2xl">
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mincho text-sm font-bold text-[#F1EBDD]">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-[#A9A398]">{item.description}</p>
                </div>
                <span className="font-mono text-sm font-bold tabular-nums text-[#E7D2A1]">
                  {item.time}
                </span>
              </article>
            ))}
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              WAKTU MULAI
            </p>
            <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">
              9<ruby>時<rt>くじ</rt></ruby>からです。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">Mulai pukul sembilan.</p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
              WAKTU SELESAI
            </p>
            <p className="mt-2 font-mincho text-xl text-[#F1EBDD]">
              6<ruby>時<rt>ろくじ</rt></ruby>までです。
            </p>
            <p className="mt-1 text-xs text-[#A9A398]">Sampai pukul enam.</p>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7D9C69]/15 text-[#A8C791]">
            <CalendarDays size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 03
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Membaca papan jadwal kerja
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Papan jadwal dapat menunjukkan siapa yang sedang berada di kantor,
          sedang keluar, libur, datang terlambat, atau pulang lebih awal.
          Perhatikan kolom status dan catatan waktunya.
        </p>
        <IrodoriConversation
          title="Percakapan C · Memeriksa papan kehadiran"
          speakers={[IRODORI_SPEAKERS.yui, IRODORI_SPEAKERS.akiko]}
          utterances={scheduleBoardConversation}
        />
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
          <div className="border-b border-white/[0.07] bg-[#2B2118] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
                  PAPAN INFORMASI PEGAWAI · FIKTIF
                </p>
                <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">
                  <ruby>行動予定表<rt>こうどうよていひょう</rt></ruby>
                </h3>
              </div>
              <span className="rounded-lg border border-[#D6AD4F]/25 bg-[#D6AD4F]/10 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]">
                <ruby>今日<rt>きょう</rt></ruby> · 11.30
              </span>
            </div>
            <p className="mt-1 text-[10px] text-[#A9A398]">
              Papan informasi pegawai pada pukul 11.30.
            </p>
          </div>
          <div className="overflow-x-auto p-3">
            <table className="w-full min-w-[580px] border-collapse text-left text-xs">
              <thead>
                <tr className="bg-[#302D29] text-[#D9B66D]">
                  <th className="border border-white/[0.08] p-3">Nama</th>
                  <th className="border border-white/[0.08] p-3">Status</th>
                  <th className="border border-white/[0.08] p-3">Catatan</th>
                  <th className="border border-white/[0.08] p-3">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {scheduleBoard.map((person) => (
                  <tr key={person.name} className="text-[#C7C1B5]">
                    <td className="border border-white/[0.08] p-3 font-semibold text-[#EAE6DD]">
                      {person.name}
                    </td>
                    <td className={"border border-white/[0.08] p-3 font-mincho font-bold " + person.color}>
                      {person.status === "在" ? <ruby>在<rt>ざい</rt></ruby> : <ruby>不在<rt>ふざい</rt></ruby>}
                    </td>
                    <td className="border border-white/[0.08] p-3 font-mincho text-[#E7D2A1]">
                      {person.note === "外出 · 銀行" ? <><ruby>外出<rt>がいしゅつ</rt></ruby> · <ruby>銀行<rt>ぎんこう</rt></ruby></> :
                       person.note === "休み" ? <><ruby>休<rt>やす</rt></ruby>み</> :
                       person.note.startsWith("早退") ? <><ruby>早退<rt>そうたい</rt></ruby> · 16.00</> :
                       person.note.startsWith("遅刻") ? <><ruby>遅刻<rt>ちこく</rt></ruby> · <ruby>午後<rt>ごご</rt></ruby>1<ruby>時<rt>じ</rt></ruby>から</> :
                       <><ruby>会議中<rt>かいぎちゅう</rt></ruby> · 10.30–11.30</>}
                    </td>
                    <td className="border border-white/[0.08] p-3 text-[#A9A398]">
                      {person.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-2 border-t border-white/[0.07] p-3 sm:grid-cols-3">
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-sm font-bold text-emerald-300"><ruby>在<rt>ざい</rt></ruby></p>
              <p className="mt-1 text-[10px] text-[#A9A398]">Berada di tempat kerja</p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-sm font-bold text-amber-300"><ruby>不在<rt>ふざい</rt></ruby></p>
              <p className="mt-1 text-[10px] text-[#A9A398]">Tidak berada di tempat kerja</p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-sm font-bold text-[#D9B66D]"><ruby>外出<rt>がいしゅつ</rt></ruby> / <ruby>休<rt>やす</rt></ruby>み</p>
              <p className="mt-1 text-[10px] text-[#A9A398]">Keluar kantor / libur</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">
            Kosakata di papan jadwal
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { jp: <ruby>在<rt>ざい</rt></ruby>, meaning: "Ada / hadir" },
              { jp: <ruby>不在<rt>ふざい</rt></ruby>, meaning: "Tidak hadir" },
              { jp: <ruby>遅刻<rt>ちこく</rt></ruby>, meaning: "Terlambat" },
              { jp: <ruby>早退<rt>そうたい</rt></ruby>, meaning: "Pulang lebih awal" },
              { jp: <ruby>外出<rt>がいしゅつ</rt></ruby>, meaning: "Sedang keluar" },
              { jp: <><ruby>休<rt>やす</rt></ruby>み</>, meaning: "Libur" },
              { jp: <ruby>会議中<rt>かいぎちゅう</rt></ruby>, meaning: "Sedang rapat" },
            ].map((word, index) => (
              <div key={index} className="rounded-lg bg-black/15 p-3">
                <p className="font-mincho text-lg font-bold text-[#F1EBDD]">{word.jp}</p>
                <p className="mt-1 text-xs text-[#A9A398]">{word.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A77FBD]/15 text-[#C7A9DB]">
            <CalendarDays size={18} />
          </span>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
              KEGIATAN 04
            </p>
            <h2 className="text-lg font-black text-[#EAE6DD]">
              Menentukan hari dan waktu bersama
            </h2>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#A9A398]">
          Saat membuat janji, tanyakan 「いつがいいですか？」. Jawab dengan
          pola 「hari がいいです」. Jika waktu yang ditawarkan tidak cocok,
          kamu bisa mengatakan 「～はちょっと……」 atau 「～はだめです」,
          lalu mengusulkan pilihan lain.
        </p>
        <IrodoriConversation
          title="Percakapan D · Menentukan hari menonton film"
          speakers={[IRODORI_SPEAKERS.sota, IRODORI_SPEAKERS.yui]}
          utterances={availabilityConversation}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {weekdays.map((day) => (
            <article
              key={day.key}
              className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3 text-center"
            >
              <p className="font-mincho text-lg font-bold text-[#F1EBDD]">{day.jp}</p>
              <p className="mt-1 text-[10px] italic text-[#B8860B]">{day.reading}</p>
              <p className="mt-1 text-xs text-[#A9A398]">{day.label}</p>
            </article>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1B1A18]">
          <div className="border-b border-white/[0.07] bg-[#2B2118] p-4">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
              AVAILABILITY CHECK · FIKTIF
            </p>
            <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">
              Hari yang cocok untuk menonton film
            </h3>
            <p className="mt-1 text-[10px] text-[#A9A398]">
              Bandingkan jadwal Yui dan Sota. Tanda ○ berarti bisa, tanda × berarti tidak bisa.
            </p>
          </div>
          <div className="overflow-x-auto p-3">
            <table className="w-full min-w-[440px] border-collapse text-center text-xs">
              <thead>
                <tr className="bg-[#302D29] text-[#D9B66D]">
                  <th className="border border-white/[0.08] p-3">Hari</th>
                  <th className="border border-white/[0.08] p-3">Yui</th>
                  <th className="border border-white/[0.08] p-3">Sota</th>
                </tr>
              </thead>
              <tbody>
                {availabilityRows.map((row) => (
                  <tr key={row.day}>
                    <td className="border border-white/[0.08] p-3 font-mincho font-bold text-[#EAE6DD]">
                      {row.day === "金曜日" ? <ruby>金曜日<rt>きんようび</rt></ruby> :
                       row.day === "土曜日" ? <ruby>土曜日<rt>どようび</rt></ruby> :
                       <ruby>日曜日<rt>にちようび</rt></ruby>}
                    </td>
                    <td className={"border border-white/[0.08] p-3 text-lg font-black " + (row.yui ? "text-emerald-300" : "text-[#E7A1A1]")}>
                      {row.yui ? "○" : "×"}
                    </td>
                    <td className={"border border-white/[0.08] p-3 text-lg font-black " + (row.sota ? "text-emerald-300" : "text-[#E7A1A1]")}>
                      {row.sota ? "○" : "×"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-4 pb-4 text-xs text-[#D9B66D]">
            Kedua orang bisa pada hari Sabtu, jadi 「土曜日にしましょう」.
          </p>
        </div>
        <div className="rounded-xl border border-[#B8860B]/15 bg-[#1B1A18] p-4">
          <p className="text-xs font-bold text-[#E7D2A1]">
            Ungkapan untuk menyepakati jadwal
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-lg text-[#F1EBDD]">いつがいいですか？</p>
              <p className="mt-1 text-xs text-[#A9A398]">Kapan waktu yang cocok?</p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-lg text-[#F1EBDD]">～がいいです。</p>
              <p className="mt-1 text-xs text-[#A9A398]">～ cocok untuk saya.</p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-lg text-[#F1EBDD]">～はちょっと……。</p>
              <p className="mt-1 text-xs text-[#A9A398]">～ agak sulit / kurang cocok.</p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="font-mincho text-lg text-[#F1EBDD]">じゃあ、～にしましょう。</p>
              <p className="mt-1 text-xs text-[#A9A398]">Kalau begitu, kita tetapkan ～.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            CATATAN TATA BAHASA
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Pola penting Pelajaran 9
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              01 · WAKTU TERTENTU
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              【time】に V-ます
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              <ruby>朝<rt>あさ</rt></ruby>7<ruby>時<rt>しちじ</rt></ruby>に<ruby>起<rt>お</rt></ruby>きます。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Partikel に diletakkan setelah waktu yang pasti untuk menyebut
              kapan suatu kegiatan dilakukan.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              02 · WAKTU PERKIRAAN
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              【time】ごろ V-ます
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              11<ruby>時<rt>じ</rt></ruby>ごろ<ruby>寝<rt>ね</rt></ruby>ます。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              ごろ berarti sekitar. Untuk perkiraan waktu, gunakan ごろ tanpa
              menambahkan に setelah jam.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              03 · WAKTU MULAI DAN SELESAI
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              【time】から【time】まで
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              12<ruby>時<rt>じ</rt></ruby>から1<ruby>時<rt>じ</rt></ruby>まで<ruby>昼休<rt>ひるやす</rt></ruby>みです。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              から menunjukkan waktu mulai, sedangkan まで menunjukkan waktu
              selesai atau batas akhir.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">
              04 · WAKTU YANG COCOK
            </p>
            <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">
              【date / time】がいいです
            </p>
            <p className="mt-1 font-mincho text-base text-[#D9B66D]">
              <ruby>土曜日<rt>どようび</rt></ruby>がいいです。
            </p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              がいいです menyatakan pilihan yang cocok. Untuk menyampaikan
              bahwa waktu kurang cocok, gunakan ～はちょっと…… atau
              ～はだめです.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            TIPS KEHIDUPAN DI JEPANG
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Jadwal dan kebiasaan sehari-hari
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <div className="flex items-center gap-2">
              <Sun size={17} className="text-[#D9B66D]" />
              <h3 className="text-xs font-bold text-[#E7D2A1]">Pengarahan pagi</h3>
            </div>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Sebagian tempat kerja di Jepang mengadakan <ruby>朝礼<rt>ちょうれい</rt></ruby>,
              yaitu pertemuan singkat sebelum pekerjaan dimulai. Kegiatannya
              dapat berisi salam, informasi pekerjaan, dan pengingat penting.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <div className="flex items-center gap-2">
              <Coffee size={17} className="text-[#D9B66D]" />
              <h3 className="text-xs font-bold text-[#E7D2A1]">Istirahat siang</h3>
            </div>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Waktu istirahat dapat berbeda menurut tempat kerja. Papan jadwal
              membantu pegawai mengetahui kapan kegiatan berhenti dan dimulai
              kembali.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <div className="flex items-center gap-2">
              <Moon size={17} className="text-[#D9B66D]" />
              <h3 className="text-xs font-bold text-[#E7D2A1]">Lembur</h3>
            </div>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              <ruby>残業<rt>ざんぎょう</rt></ruby> berarti bekerja melewati jam kerja
              yang dijadwalkan. Catatan seperti ini dapat muncul pada jadwal
              kerja, tetapi tidak berarti semua pegawai selalu lembur.
            </p>
          </article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={17} className="text-[#D9B66D]" />
              <h3 className="text-xs font-bold text-[#E7D2A1]">Membuat janji</h3>
            </div>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">
              Saat membuat janji, tanyakan ketersediaan orang lain terlebih
              dahulu. Bila waktu yang ditawarkan tidak cocok, sampaikan dengan
              sopan lalu ajukan pilihan lain.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            LATIHAN PRAKTIK
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Pahami rutinitas dan jadwal
          </h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Gunakan dialog, jadwal kantor, dan tabel ketersediaan untuk menjawab
            keenam pertanyaan berikut.
          </p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selectedAnswer = practiceAnswers[index];
            const isCorrect = selectedAnswer === task.answer;

            return (
              <article
                key={index}
                className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
              >
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
                  LATIHAN {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">
                  <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading>
                </h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {task.options.map((option) => {
                    const selected = selectedAnswer === option.key;
                    const correct = option.key === task.answer;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          if (practiceSubmitted) return;
                          setPracticeAnswers((current) => ({
                            ...current,
                            [index]: option.key,
                          }));
                        }}
                        disabled={practiceSubmitted}
                        className={
                          "w-full rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " +
                          (practiceSubmitted && correct
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                            : practiceSubmitted && selected
                              ? "border-red-400/50 bg-red-400/10 text-red-200"
                              : selected
                                ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]"
                                : "border-white/[0.07] bg-black/15 text-[#A9A398] hover:border-white/20")
                        }
                      >
                        <span className="mr-2 inline-block w-4 text-center">
                          {practiceSubmitted && correct ? "✓" : selected ? "●" : "○"}
                        </span>
                        <span className="font-mincho text-sm [&_rt]:text-[0.65em] [&_rt]:text-[#D6AD4F]">
                          <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {practiceSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span
                      className={
                        "mr-1 font-bold " +
                        (isCorrect ? "text-emerald-300" : "text-[#E7A1A1]")
                      }
                    >
                      {isCorrect ? "Benar." : "Belum tepat."}
                    </span>
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
              : practiceAnsweredCount + " dari " + practiceTasks.length + " pertanyaan dijawab."}
          </p>
          {practiceSubmitted ? (
            <button
              type="button"
              onClick={resetPractice}
              className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1] hover:bg-[#B8860B]/10"
            >
              <RefreshCw size={13} />
              Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={practiceAnsweredCount !== practiceTasks.length}
              className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            LATIHAN SITUASI
          </p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">
            Periksa pemahamanmu
          </h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Pilih jawaban terbaik untuk setiap pertanyaan. Semua nomor harus
            dijawab sebelum hasil dapat diperiksa.
          </p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selectedAnswer = answers[index];
            const isCorrect = selectedAnswer === question.answer;

            return (
              <article
                key={index}
                className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"
              >
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">
                  SOAL {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">
                  <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.prompt}</JapaneseReading>
                </h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {question.options.map((option) => {
                    const selected = selectedAnswer === option.key;
                    const correct = option.key === question.answer;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          if (quizSubmitted) return;
                          setAnswers((current) => ({
                            ...current,
                            [index]: option.key,
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
                          <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span
                      className={
                        "mr-1 font-bold " +
                        (isCorrect ? "text-emerald-300" : "text-[#E7A1A1]")
                      }
                    >
                      {isCorrect ? "Benar." : "Belum tepat."}
                    </span>
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

      <section className="rounded-2xl border border-[#B8860B]/25 bg-gradient-to-br from-[#2B2118] to-[#191817] p-5 md:p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-[#D9B66D]" />
          <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
            CEK TARGET KOMUNIKASI
          </p>
        </div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">
          Coba nilai kemampuanmu
        </h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">
          Nilai kemampuanmu setelah mencoba rutinitas harian, jadwal kerja,
          papan kehadiran, dan menyepakati waktu bersama. ★☆☆ berarti sudah
          bisa tetapi masih perlu latihan, ★★☆ berarti sudah bisa, dan ★★★
          berarti bisa dengan baik. Penilaian ini tersimpan khusus untuk
          Irodori, terpisah dari progres Minna no Nihongo dan JLPT.
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
                        saveIrodoriSelfEvaluation("starter-09", nextRatings);
                      }}
                      className={
                        "rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors " +
                        (selected
                          ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]"
                          : "border-white/[0.08] bg-[#24221F] text-[#A3A099] hover:border-white/20 hover:text-[#EAE6DD]")
                      }
                    >
                      <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
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
              onClick={() => completeIrodoriLesson("starter-09")}
              disabled={!quizSubmitted || !practiceIsCorrect || !canDosRated}
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
        {!quizSubmitted || !practiceIsCorrect || !canDosRated ? (
          <p className="mt-2 text-[10px] leading-5 text-[#817A73]">
            Selesaikan kuis, jawab benar seluruh enam soal praktik, lalu isi
            keempat penilaian target komunikasi untuk menandai pelajaran selesai.
          </p>
        ) : null}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Dialog, jadwal, dan latihan disusun orisinal oleh Fude sebagai latihan
        komunikasi tingkat pemula. Nama tokoh dan jadwal kantor bersifat fiktif.
      </p>
    </main>
  );
}
