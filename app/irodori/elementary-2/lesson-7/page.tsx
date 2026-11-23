"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  MapPin,
  RefreshCw,
  Star,
  Megaphone,
  ClipboardList,
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
const friendYui = { ...speakers.yui, name: "Yui", role: "Teman" };
const friendSota = { ...speakers.sota, name: "Sota", role: "Teman" };
const friendAkiko = { ...speakers.akiko, name: "Akiko", role: "Teman" };
const friendKenji = { ...speakers.kenji, name: "Kenji", role: "Teman" };
const lessonId = "elementary2-07";

const readCommunityNoticeConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>このお知らせは、何についてですか。</>,
    romaji: "Kono oshirase wa, nani ni tsuite desu ka?",
    translation: "Pengumuman ini tentang apa?",
    audioFileName: "irodori-elementary2-07-a01-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>公園で行われる、花の展示会についてです。</>,
    romaji: "Kouen de okonawareru, hana no tenjikai ni tsuite desu.",
    translation: "Ini tentang pameran bunga yang diadakan di taman.",
    audioFileName: "irodori-elementary2-07-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>いつ、どこでありますか。</>,
    romaji: "Itsu, doko de arimasu ka?",
    translation: "Kapan dan di mana acaranya?",
    audioFileName: "irodori-elementary2-07-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>来週の土曜日、午前十時から、さくら公園です。</>,
    romaji: "Raishuu no doyoubi, gozen juuji kara, Sakura Kouen desu.",
    translation: "Acaranya di Taman Sakura, Sabtu depan mulai pukul sepuluh pagi.",
    audioFileName: "irodori-elementary2-07-a01-l04.mp3",
  },
];

const askAboutMailboxNoticeConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>ポストに入っていたこの紙は、何のお知らせですか。</>,
    romaji: "Posuto ni haitte ita kono kami wa, nan no oshirase desu ka?",
    translation: "Pengumuman di kotak surat ini tentang apa?",
    audioFileName: "irodori-elementary2-07-a02-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>市民センターの本の交換会のお知らせですよ。</>,
    romaji: "Shimin sentaa no hon no koukankai no oshirase desu yo.",
    translation: "Itu pengumuman tentang acara tukar buku di pusat komunitas.",
    audioFileName: "irodori-elementary2-07-a02-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>申し込みが必要ですか。</>,
    romaji: "Moushikomi ga hitsuyou desu ka?",
    translation: "Apakah perlu mendaftar?",
    audioFileName: "irodori-elementary2-07-a02-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>いいえ、必要ありません。当日、受付に来てください。</>,
    romaji: "Iie, hitsuyou arimasen. Toujitsu, uketsuke ni kite kudasai.",
    translation: "Tidak perlu. Silakan langsung datang ke meja pendaftaran pada hari acara.",
    audioFileName: "irodori-elementary2-07-a02-l04.mp3",
  },
];

const understandCommunityBroadcastConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>今の放送は、何のお知らせでしたか。</>,
    romaji: "Ima no housou wa, nan no oshirase deshita ka?",
    translation: "Pengumuman barusan tentang apa?",
    audioFileName: "irodori-elementary2-07-a03-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>来週の公園の清掃活動についてでした。</>,
    romaji: "Raishuu no kouen no seisou katsudou ni tsuite deshita.",
    translation: "Tentang kegiatan bersih-bersih taman minggu depan.",
    audioFileName: "irodori-elementary2-07-a03-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>何時から始まりますか。</>,
    romaji: "Nanji kara hajimarimasu ka?",
    translation: "Mulai pukul berapa?",
    audioFileName: "irodori-elementary2-07-a03-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>午前九時からです。雨の場合は、次の日に変更されます。</>,
    romaji: "Gozen kuji kara desu. Ame no baai wa, tsugi no hi ni henkou saremasu.",
    translation: "Mulai pukul sembilan pagi. Jika hujan, jadwalnya diubah ke hari berikutnya.",
    audioFileName: "irodori-elementary2-07-a03-l04.mp3",
  },
];

const inviteToLocalEventConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>今度の日曜日、地域の文化イベントに行きませんか。</>,
    romaji: "Kondo no nichiyoubi, chiiki no bunka ibento ni ikimasen ka?",
    translation: "Minggu ini, mau ikut acara budaya di lingkungan kita?",
    audioFileName: "irodori-elementary2-07-a04-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>いいですね。どんなことが行われますか。</>,
    romaji: "Ii desu ne. Donna koto ga okonawaremasu ka?",
    translation: "Boleh juga. Akan ada kegiatan apa saja?",
    audioFileName: "irodori-elementary2-07-a04-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>音楽の発表や、子どもの作品の展示があります。</>,
    romaji: "Ongaku no happyou ya, kodomo no sakuhin no tenji ga arimasu.",
    translation: "Ada pertunjukan musik dan pameran hasil karya anak-anak.",
    audioFileName: "irodori-elementary2-07-a04-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>何時に行ったらいいですか。</>,
    romaji: "Nanji ni ittara ii desu ka?",
    translation: "Sebaiknya saya datang jam berapa?",
    audioFileName: "irodori-elementary2-07-a04-l04.mp3",
  },
];

const clarifyEventDetailsConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>イベントは、雨が降ったらどうなりますか。</>,
    romaji: "Ibento wa, ame ga futtara dou narimasu ka?",
    translation: "Kalau hujan, acaranya bagaimana?",
    audioFileName: "irodori-elementary2-07-a05-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>雨だったら、市民センターのホールで行われます。</>,
    romaji: "Ame dattara, shimin sentaa no hooru de okonawaremasu.",
    translation: "Kalau hujan, acaranya dipindahkan ke aula pusat komunitas.",
    audioFileName: "irodori-elementary2-07-a05-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>参加する条件はありますか。</>,
    romaji: "Sanka suru jouken wa arimasu ka?",
    translation: "Apakah ada syarat untuk ikut?",
    audioFileName: "irodori-elementary2-07-a05-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>特にありません。どなたでも参加できます。</>,
    romaji: "Toku ni arimasen. Donata demo sanka dekimasu.",
    translation: "Tidak ada syarat khusus. Semua orang boleh ikut.",
    audioFileName: "irodori-elementary2-07-a05-l04.mp3",
  },
];

const canDos = [
  {
    id: "read-community-notices",
    source: "CAN-DO 28",
    text: "Membaca pengumuman di papan informasi lingkungan atau surat yang diterima di kotak surat, lalu menemukan informasi utamanya.",
  },
  {
    id: "ask-about-community-notices",
    source: "CAN-DO 29",
    text: "Mengajukan pertanyaan tentang isi acara atau pemberitahuan lingkungan dan memahami jawabannya.",
  },
  {
    id: "understand-community-broadcast",
    source: "CAN-DO 30",
    text: "Mendengarkan pengumuman acara melalui pengeras suara komunitas dan memahami informasi utamanya.",
  },
  {
    id: "ask-about-invited-event",
    source: "CAN-DO 31",
    text: "Bertanya tentang isi acara ketika diajak mengikuti kegiatan lingkungan dan memahami jawabannya.",
  },
];

const vocabRows = [
  ["お知らせ", "おしらせ · oshirase", "Pengumuman atau pemberitahuan"],
  ["掲示板", "けいじばん · keijiban", "Papan informasi"],
  ["郵便受け", "ゆうびんうけ · yuubinuke", "Kotak surat"],
  ["地域", "ちいき · chiiki", "Lingkungan atau wilayah setempat"],
  ["自治会", "じちかい · jichikai", "Asosiasi warga lingkungan"],
  ["市民センター", "しみんセンター · shimin sentaa", "Pusat komunitas warga"],
  ["公民館", "こうみんかん · kouminkan", "Balai warga"],
  ["市役所", "しやくしょ · shiyakusho", "Kantor pemerintah kota"],
  ["役場", "やくば · yakuba", "Kantor pemerintah daerah kecil"],
  ["行事", "ぎょうじ · gyouji", "Kegiatan atau acara"],
  ["イベント", "イベント · ibento", "Acara"],
  ["祭り", "まつり · matsuri", "Festival"],
  ["盆踊り", "ぼんおどり · bon odori", "Tarian festival musim panas"],
  ["練習", "れんしゅう · renshuu", "Latihan"],
  ["発表会", "はっぴょうかい · happyoukai", "Pertunjukan atau acara presentasi"],
  ["交換会", "こうかんかい · koukankai", "Acara tukar-menukar"],
  ["展示", "てんじ · tenji", "Pameran atau pajangan"],
  ["展示会", "てんじかい · tenjikai", "Pameran"],
  ["開催する", "かいさいする · kaisai suru", "Menyelenggarakan acara"],
  ["開く", "ひらく · hiraku", "Mengadakan atau membuka"],
  ["行う", "おこなう · okonau", "Melaksanakan"],
  ["行われる", "おこなわれる · okonawareru", "Diadakan atau dilaksanakan"],
  ["開かれる", "ひらかれる · hirakareru", "Diadakan atau dibuka"],
  ["中止する", "ちゅうしする · chuushi suru", "Membatalkan"],
  ["場合", "ばあい · baai", "Jika atau dalam keadaan"],
  ["条件", "じょうけん · jouken", "Syarat atau ketentuan"],
  ["参加する", "さんかする · sanka suru", "Berpartisipasi atau ikut"],
  ["参加者", "さんかしゃ · sankasha", "Peserta"],
  ["申し込む", "もうしこむ · moushikomu", "Mendaftar"],
  ["受付", "うけつけ · uketsuke", "Bagian penerimaan atau pendaftaran"],
  ["会場", "かいじょう · kaijou", "Tempat acara"],
  ["広場", "ひろば · hiroba", "Lapangan atau plaza"],
  ["体育館", "たいいくかん · taiikukan", "Gedung olahraga"],
  ["ホール", "ホール · hooru", "Aula"],
  ["日時", "にちじ · nichiji", "Tanggal dan waktu"],
  ["今月", "こんげつ · kongetsu", "Bulan ini"],
  ["来月", "らいげつ · raigetsu", "Bulan depan"],
  ["今週", "こんしゅう · konshuu", "Minggu ini"],
  ["来週", "らいしゅう · raishuu", "Minggu depan"],
  ["当日", "とうじつ · toujitsu", "Hari pelaksanaan"],
  ["雨", "あめ · ame", "Hujan"],
  ["天気", "てんき · tenki", "Cuaca"],
  ["降る", "ふる · furu", "Turun, seperti hujan"],
  ["晴れる", "はれる · hareru", "Cerah"],
  ["変更", "へんこう · henkou", "Perubahan"],
  ["連絡", "れんらく · renraku", "Pemberitahuan atau kontak"],
  ["水道", "すいどう · suidou", "Saluran atau layanan air"],
  ["工事", "こうじ · kouji", "Pekerjaan konstruksi"],
  ["点検", "てんけん · tenken", "Pemeriksaan"],
  ["以上", "いじょう · ijou", "Sekurang-kurangnya atau lebih"],
];

const kanjiWords = [
  ["お知らせ", "おしらせ · oshirase", "Pengumuman atau pemberitahuan"],
  ["中止", "ちゅうし · chuushi", "Pembatalan"],
  ["今月", "こんげつ · kongetsu", "Bulan ini"],
  ["条件", "じょうけん · jouken", "Syarat atau ketentuan"],
  ["水道", "すいどう · suidou", "Saluran atau layanan air"],
  ["以上", "いじょう · ijou", "Sekurang-kurangnya atau lebih"],
  ["工事", "こうじ · kouji", "Pekerjaan konstruksi"],
  ["開く", "ひらく · hiraku", "Mengadakan atau membuka"],
  ["広場", "ひろば · hiroba", "Lapangan atau plaza"],
  ["場合", "ばあい · baai", "Jika atau dalam keadaan"],
];

const communityNotices = [
  {
    title: "公園の花の展示会",
    category: "お知らせ · Pengumuman acara",
    date: "6月14日（土）",
    time: "10:00–12:00",
    place: "さくら公園",
    details: "花の展示と、子ども向けの工作コーナーがあります。",
    meaning: "Ada pameran bunga dan area prakarya untuk anak-anak.",
    condition: "雨が降ったら、市民センターのホールで行われます。",
    conditionMeaning: "Jika hujan, acara diadakan di aula pusat komunitas.",
  },
  {
    title: "水道点検のお知らせ",
    category: "地域のお知らせ · Pemberitahuan lingkungan",
    date: "6月18日（水）",
    time: "9:00–11:00",
    place: "さくら町 1丁目",
    details: "水道設備の点検が行われます。",
    meaning: "Pemeriksaan fasilitas saluran air akan dilaksanakan.",
    condition: "作業の時間が少し変更される場合があります。",
    conditionMeaning: "Waktu pekerjaan mungkin sedikit berubah.",
  },
  {
    title: "本の交換会",
    category: "市民センター · Pusat komunitas",
    date: "6月22日（日）",
    time: "13:00–15:00",
    place: "市民センター 2階ホール",
    details: "読み終わった本を持って来て、ほかの本と交換できます。",
    meaning: "Bawa buku yang sudah selesai dibaca dan tukarkan dengan buku lain.",
    condition: "申し込みは必要ありません。当日、受付に来てください。",
    conditionMeaning: "Tidak perlu mendaftar. Datang saja ke bagian penerimaan pada hari acara.",
  },
];

const communityBroadcasts = [
  {
    label: "BROADCAST 01 · 花の展示会",
    japanese: "市民センターからお知らせします。来週の土曜日、午前十時から、さくら公園で花の展示会が開かれます。雨が降った場合は、市民センターのホールで行われます。",
    reading: "しみんセンターからおしらせします。らいしゅうのどようび、ごぜんじゅうじから、さくらこうえんではなのてんじかいがひらかれます。あめがふったばあいは、しみんセンターのホールでおこなわれます。",
    meaning: "Pameran bunga akan diadakan di Taman Sakura Sabtu depan mulai pukul sepuluh pagi. Jika hujan, acara akan diadakan di aula pusat komunitas.",
  },
  {
    label: "BROADCAST 02 · 本の交換会",
    japanese: "今月二十二日の日曜日、市民センターで本の交換会が開催されます。午後一時から三時までです。どなたでも参加できます。",
    reading: "こんげつにじゅうににちのにちようび、しみんセンターでほんのこうかんかいがかいさいされます。ごごいちじからさんじまでです。どなたでもさんかできます。",
    meaning: "Acara tukar buku akan diselenggarakan di pusat komunitas pada Minggu tanggal 22 bulan ini, pukul satu sampai tiga sore. Siapa pun boleh ikut.",
  },
  {
    label: "BROADCAST 03 · 水道点検",
    japanese: "水道設備の点検についてお知らせします。来週の水曜日、午前九時から作業が行われます。詳しい時間は、掲示板をご確認ください。",
    reading: "すいどうせつびのてんけんについておしらせします。らいしゅうのすいようび、ごぜんくじからさぎょうがおこなわれます。くわしいじかんは、けいじばんをごかくにんください。",
    meaning: "Pemberitahuan tentang pemeriksaan fasilitas air. Pekerjaan akan dilaksanakan Rabu depan mulai pukul sembilan pagi. Silakan periksa papan informasi untuk waktu lengkapnya.",
  },
];

const eventDetails = [
  { label: "イベント", value: "さくら文化の日" },
  { label: "日時", value: "6月29日（日） 9:30–15:00" },
  { label: "会場", value: "市民センターと前の広場" },
  { label: "内容", value: "音楽の発表、作品展示、読み聞かせ" },
  { label: "雨の場合", value: "ホールで行われます" },
  { label: "参加", value: "どなたでも参加できます" },
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

type Simulation = {
  title: string;
  heading: string;
  prompt: string;
  japanese: ReactNode;
  translation: string;
  options: { key: string; label: string; meaning: string }[];
  answer: string;
  explanation: string;
};

const simulations: Simulation[] = [
  {
    title: "01 · Membaca pengumuman",
    heading: "Menemukan waktu dan tempat acara",
    prompt: "Pada pengumuman pameran bunga, kapan dan di mana acara dimulai?",
    japanese: <>6月14日（土） 10:00–12:00 · さくら公園</>,
    translation: "Sabtu, 14 Juni, pukul 10.00–12.00 di Taman Sakura.",
    options: [
      { key: "a", label: "Sabtu, 14 Juni, pukul 10.00 di Taman Sakura.", meaning: "Tanggal, waktu, dan lokasi sesuai informasi pengumuman." },
      { key: "b", label: "Minggu, 22 Juni, pukul 13.00 di pusat komunitas.", meaning: "Ini adalah informasi acara tukar buku, bukan pameran bunga." },
      { key: "c", label: "Rabu, 18 Juni, pukul 09.00 di Sakura-machi.", meaning: "Ini adalah informasi pemeriksaan saluran air." },
    ],
    answer: "a",
    explanation: "Saat membaca pengumuman, cari tanggal, jam, tempat, dan isi kegiatan.",
  },
  {
    title: "02 · Bertanya tentang pemberitahuan",
    heading: "Meminta informasi yang belum jelas",
    prompt: "Kamu menerima pemberitahuan, tetapi tidak memahami acara yang dimaksud. Pertanyaan mana yang paling sesuai?",
    japanese: <>これは何のお知らせですか。</>,
    translation: "Ini pengumuman tentang apa?",
    options: [
      { key: "a", label: "これは何のお知らせですか。", meaning: "Kalimat ini menanyakan jenis atau isi pengumuman." },
      { key: "b", label: "これは何時に終わりましたか。", meaning: "Kalimat ini menanyakan pukul berapa sesuatu telah selesai." },
      { key: "c", label: "これはだれのかばんですか。", meaning: "Kalimat ini menanyakan pemilik tas." },
    ],
    answer: "a",
    explanation: "何のお知らせですか digunakan untuk menanyakan isi pemberitahuan.",
  },
  {
    title: "03 · Mendengarkan siaran komunitas",
    heading: "Memahami informasi utama",
    prompt: "Siaran menyebutkan bahwa acara tukar buku diselenggarakan Minggu tanggal 22, pukul 13.00–15.00. Informasi mana yang benar?",
    japanese: <>本の交換会が開催されます。午後一時から三時までです。</>,
    translation: "Acara tukar buku diselenggarakan pukul satu sampai tiga sore.",
    options: [
      { key: "a", label: "Acara dimulai pukul sembilan pagi.", meaning: "Waktu yang diumumkan adalah pukul satu siang." },
      { key: "b", label: "Acara berlangsung pukul satu sampai tiga sore.", meaning: "午後一時から三時まで berarti pukul 13.00 sampai 15.00." },
      { key: "c", label: "Acara dibatalkan.", meaning: "Siaran menyampaikan bahwa acara diselenggarakan." },
    ],
    answer: "b",
    explanation: "Perhatikan 午後 untuk waktu sore dan pola から～まで untuk awal serta akhir waktu.",
  },
  {
    title: "04 · Menanyakan rencana jika hujan",
    heading: "Memahami kondisi acara",
    prompt: "Kamu ingin tahu tempat acara jika hujan turun. Pilih pertanyaan dan jawaban yang cocok.",
    japanese: <>雨が降ったら、ホールで行われます。</>,
    translation: "Jika hujan turun, acara akan diadakan di aula.",
    options: [
      { key: "a", label: "雨が降ったら、外で行われます。", meaning: "Kalimat ini menyatakan acara tetap diadakan di luar." },
      { key: "b", label: "雨が降ったら、ホールで行われます。", meaning: "行われます adalah bentuk pasif formal: acara akan dilaksanakan di aula." },
      { key: "c", label: "雨が降らなかったら、中止です。", meaning: "Kalimat ini menyebut pembatalan jika tidak hujan." },
    ],
    answer: "b",
    explanation: "～たら menyatakan kondisi, sedangkan 行われます adalah bentuk pasif yang sering dipakai dalam pengumuman resmi.",
  },
  {
    title: "05 · Memahami pengumuman formal",
    heading: "Mengenali bentuk pasif",
    prompt: "Apa arti kalimat 「コンサートが開催されます」 pada sebuah pengumuman?",
    japanese: <>コンサートが開催されます。</>,
    translation: "Konser akan diselenggarakan.",
    options: [
      { key: "a", label: "Seseorang sedang mencari tempat konser.", meaning: "Kalimat tidak membicarakan pencarian tempat." },
      { key: "b", label: "Konser akan diselenggarakan.", meaning: "開催されます adalah bentuk pasif dari 開催します dan lazim dipakai dalam pengumuman acara." },
      { key: "c", label: "Konser sudah dibatalkan.", meaning: "中止されます yang menyatakan akan dibatalkan, bukan 開催されます." },
    ],
    answer: "b",
    explanation: "Dalam pengumuman, acara sering menjadi subjek kalimat: acara akan diadakan.",
  },
];

const practiceTasks: Task[] = [
  {
    prompt: <>Apa arti 「掲示板」?</>,
    options: [
      { key: "a", label: "Papan informasi." },
      { key: "b", label: "Kotak penyimpanan." },
      { key: "c", label: "Ruang kelas." },
    ],
    answer: "a",
    explanation: <>掲示板（けいじばん）adalah papan untuk menempelkan informasi atau pengumuman.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Jika hujan turun, acara diadakan di aula”.</>,
    options: [
      { key: "a", label: "雨が降ったら、ホールで行われます。" },
      { key: "b", label: "雨が降るので、ホールを読みます。" },
      { key: "c", label: "雨が降って、ホールを中止します。" },
    ],
    answer: "a",
    explanation: <>雨が降ったら menyatakan kondisi “jika hujan turun”, sedangkan ホールで行われます berarti acara dilaksanakan di aula.</>,
  },
  {
    prompt: <>Pilih bentuk pasif yang benar dari 「開く」.</>,
    options: [
      { key: "a", label: "開きます." },
      { key: "b", label: "開かれます." },
      { key: "c", label: "開いています." },
    ],
    answer: "b",
    explanation: <>開く（ひらく）berubah menjadi 開かれる（ひらかれる）dalam bentuk pasif.</>,
  },
  {
    prompt: <>Apa arti 「中止」 pada sebuah pengumuman?</>,
    options: [
      { key: "a", label: "Pembukaan." },
      { key: "b", label: "Pendaftaran." },
      { key: "c", label: "Pembatalan." },
    ],
    answer: "c",
    explanation: <>中止（ちゅうし）berarti pembatalan atau penghentian suatu kegiatan.</>,
  },
  {
    prompt: <>Kalimat 「本の交換会が開催されます」 berarti apa?</>,
    options: [
      { key: "a", label: "Acara tukar buku akan diselenggarakan." },
      { key: "b", label: "Buku-buku sedang dibaca." },
      { key: "c", label: "Pendaftaran acara telah ditutup." },
    ],
    answer: "a",
    explanation: <>開催されます adalah bentuk pasif formal dari 開催します, yang berarti diselenggarakan.</>,
  },
  {
    prompt: <>Apa arti 「雨の場合は、ホールで行います」?</>,
    options: [
      { key: "a", label: "Aula akan ditutup saat hujan." },
      { key: "b", label: "Jika hujan, acara akan dilaksanakan di aula." },
      { key: "c", label: "Acara hanya diadakan saat cuaca cerah." },
    ],
    answer: "b",
    explanation: <>場合（ばあい）berarti keadaan atau kondisi. 雨の場合は berarti jika dalam keadaan hujan.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa arti 「郵便受け」?</>,
    options: [
      { key: "a", label: "Kotak surat." },
      { key: "b", label: "Papan pengumuman." },
      { key: "c", label: "Kantor pemerintah." },
    ],
    answer: "a",
    explanation: <>郵便受け（ゆうびんうけ）adalah tempat menerima surat.</>,
  },
  {
    prompt: <>Pilih bentuk ～たら yang benar dari 「降る」.</>,
    options: [
      { key: "a", label: "降ってら." },
      { key: "b", label: "降ったら." },
      { key: "c", label: "降るたら." },
    ],
    answer: "b",
    explanation: <>降る berubah menjadi 降った, kemudian ditambah ら menjadi 降ったら.</>,
  },
  {
    prompt: <>Apa arti 「来週」?</>,
    options: [
      { key: "a", label: "Minggu lalu." },
      { key: "b", label: "Minggu ini." },
      { key: "c", label: "Minggu depan." },
    ],
    answer: "c",
    explanation: <>来週（らいしゅう）berarti minggu depan.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Pameran akan diadakan di aula”.</>,
    options: [
      { key: "a", label: "展示会がホールで開かれます。" },
      { key: "b", label: "展示会がホールを開きます。" },
      { key: "c", label: "展示会をホールに開きます。" },
    ],
    answer: "a",
    explanation: <>開かれます adalah bentuk pasif dari 開く dan dapat digunakan pada pengumuman acara.</>,
  },
  {
    prompt: <>Apa arti 「参加する条件」?</>,
    options: [
      { key: "a", label: "Waktu mulai acara." },
      { key: "b", label: "Syarat untuk ikut serta." },
      { key: "c", label: "Tempat parkir peserta." },
    ],
    answer: "b",
    explanation: <>参加する berarti ikut serta dan 条件 berarti syarat atau ketentuan.</>,
  },
  {
    prompt: <>Apa arti 「雨だったら、ホールで行われます」?</>,
    options: [
      { key: "a", label: "Jika hujan, acara akan diadakan di aula." },
      { key: "b", label: "Karena tidak hujan, acara dibatalkan." },
      { key: "c", label: "Aula akan mengadakan hujan." },
    ],
    answer: "a",
    explanation: <>雨だったら berarti jika hujan, sedangkan 行われます berarti akan dilaksanakan.</>,
  },
  {
    prompt: <>Pilih bentuk pasif yang benar dari 「開催する」.</>,
    options: [
      { key: "a", label: "開催します." },
      { key: "b", label: "開催して." },
      { key: "c", label: "開催されます." },
    ],
    answer: "c",
    explanation: <>開催する adalah kata kerja golongan 3; bentuk pasifnya 開催される, bentuk sopannya 開催されます.</>,
  },
  {
    prompt: <>Apa arti 「当日、受付に来てください」?</>,
    options: [
      { key: "a", label: "Silakan datang ke bagian pendaftaran pada hari acara." },
      { key: "b", label: "Silakan mendaftar bulan depan." },
      { key: "c", label: "Bagian pendaftaran akan ditutup hari ini." },
    ],
    answer: "a",
    explanation: <>当日 berarti hari pelaksanaan dan 受付 berarti bagian penerimaan atau pendaftaran.</>,
  },
  {
    prompt: <>Frasa 「水道工事」 berkaitan dengan apa?</>,
    options: [
      { key: "a", label: "Pameran karya seni." },
      { key: "b", label: "Pekerjaan pada saluran air." },
      { key: "c", label: "Latihan musik." },
    ],
    answer: "b",
    explanation: <>水道 berarti layanan atau saluran air dan 工事 berarti pekerjaan konstruksi.</>,
  },
  {
    prompt: <>Apa informasi utama yang dicari saat membaca pengumuman acara?</>,
    options: [
      { key: "a", label: "Tanggal, waktu, tempat, isi kegiatan, dan ketentuan." },
      { key: "b", label: "Nama semua orang yang tinggal di kota." },
      { key: "c", label: "Daftar pelajaran di sekolah." },
    ],
    answer: "a",
    explanation: <>Pengumuman biasanya memuat tanggal, waktu, lokasi, isi acara, dan informasi penting lain seperti syarat atau perubahan jadwal.</>,
  },
];

export default function IrodoriElementaryTwoLessonSevenPage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});

  const isCompleted = progress.completedLessons.includes(lessonId);
  const visibleRatings = { ...(progress.selfEvaluations[lessonId] ?? {}), ...ratings };
  const practiceScore = practiceTasks.filter((task, index) => practiceAnswers[index] === task.answer).length;
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;
  const simulationScore = simulations.filter(
    (task, index) => simulationChecked[index] && simulationChoices[index] === task.answer
  ).length;
  const simulationsComplete = simulationScore === simulations.length;
  const quizScore = quizQuestions.filter((question, index) => answers[index] === question.answer).length;
  const canDosRated = canDos.every((item) => visibleRatings[item.id] !== undefined);
  const canEvaluate = practiceIsCorrect && simulationsComplete && quizSubmitted;
  const canComplete = canEvaluate && canDosRated;

  const resetPractice = () => {
    setPracticeAnswers({});
    setPracticeSubmitted(false);
  };

  const resetQuiz = () => {
    setAnswers({});
    setQuizSubmitted(false);
  };

  const resetSimulations = () => {
    setSimulationChoices({});
    setSimulationChecked({});
  };

  const finishLesson = () => {
    if (!canComplete || isCompleted) return;
    completeIrodoriLesson(lessonId);
  };

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-12">
      <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#C78383]/40 hover:text-[#EAE6DD]">
        <ArrowLeft size={15} /> Kembali ke Dasar 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#8B4B4B]/35 bg-gradient-to-br from-[#3A2427] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#E0A7A7]/[0.08]">祭</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#E0A7A7]">IRODORI • DASAR 2 A2 • PELAJARAN 07</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Kalau hujan, acara akan diadakan di aula.</h1>
          <p className="mt-2 text-sm font-semibold text-[#E0A7A7]">雨が降ったら、ホールでやります</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar membaca pengumuman lingkungan, menanyakan isi pemberitahuan, memahami siaran komunitas, dan bertanya tentang acara lokal.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><ClipboardList size={14} className="text-[#E0A7A7]" />Papan pengumuman</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Megaphone size={14} className="text-[#E0A7A7]" />Siaran komunitas</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Star size={14} className="text-[#E0A7A7]" />Acara lingkungan</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#8B4B4B]/20 bg-[#302124]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#E0A7A7]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target berikut sesuai target komunikasi 28–31 pada Irodori Dasar 2 Lesson 7.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E0A7A7]">{item.source} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E0A7A7]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membaca pemberitahuan dan membicarakan acara lokal</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Seluruh percakapan dibuat orisinal oleh Fude berdasarkan target komunikasi pelajaran ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Membaca pengumuman kegiatan taman" speakers={[friendYui, friendSota]} utterances={readCommunityNoticeConversation} />
          <IrodoriConversation title="Bertanya tentang surat pemberitahuan" speakers={[friendAkiko, friendKenji]} utterances={askAboutMailboxNoticeConversation} />
          <IrodoriConversation title="Membahas siaran komunitas" speakers={[friendSota, friendYui]} utterances={understandCommunityBroadcastConversation} />
          <IrodoriConversation title="Mengajak teman ke acara lingkungan" speakers={[friendAkiko, friendKenji]} utterances={inviteToLocalEventConversation} />
          <IrodoriConversation title="Menanyakan perubahan acara jika hujan" speakers={[friendYui, friendSota]} utterances={clarifyEventDetailsConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E0A7A7]">MEMBACA PENGUMUMAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Temukan informasi penting dari papan lingkungan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pengumuman berikut bersifat fiktif. Perhatikan tanggal, waktu, lokasi, kegiatan, dan informasi tambahan.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {communityNotices.map((notice) => (
            <article key={notice.title} className="rounded-2xl border border-[#8B4B4B]/20 bg-[#211A1B] p-4">
              <div className="flex items-start justify-between gap-3 border-b border-dashed border-[#8B4B4B]/30 pb-3">
                <div>
                  <p className="text-[9px] font-black tracking-[0.15em] text-[#E0A7A7]">{notice.category}</p>
                  <h3 className="mt-1 text-sm font-bold text-[#F1EBDD]">{notice.title}</h3>
                </div>
                <FileText size={19} className="shrink-0 text-[#E0A7A7]" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-black/15 p-2.5">
                  <p className="text-[9px] text-[#A9A398]">Tanggal</p>
                  <p className="mt-1 text-xs font-bold text-[#F1EBDD]">{notice.date}</p>
                </div>
                <div className="rounded-lg bg-black/15 p-2.5">
                  <p className="text-[9px] text-[#A9A398]">Waktu</p>
                  <p className="mt-1 text-xs font-bold text-[#F1EBDD]">{notice.time}</p>
                </div>
                <div className="col-span-2 rounded-lg bg-black/15 p-2.5">
                  <p className="text-[9px] text-[#A9A398]">Tempat</p>
                  <p className="mt-1 text-xs font-bold text-[#F1EBDD]">{notice.place}</p>
                </div>
              </div>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{notice.details}</p>
              <p className="mt-1 text-xs leading-5 text-[#A9A398]">{notice.meaning}</p>
              <div className="mt-3 rounded-lg border border-[#8B4B4B]/20 bg-[#302124]/50 p-3">
                <p className="font-mincho text-xs leading-6 text-[#E0A7A7]">{notice.condition}</p>
                <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{notice.conditionMeaning}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E0A7A7]">SIARAN KOMUNITAS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dengarkan informasi melalui pengeras suara</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Contoh teks siaran berikut dibuat khusus untuk latihan. Perhatikan informasi utama dan bentuk pasif yang digunakan.</p>
        </div>
        <div className="space-y-3">
          {communityBroadcasts.map((item) => (
            <article key={item.label} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="flex items-center gap-2 text-[9px] font-black tracking-[0.15em] text-[#E0A7A7]"><Megaphone size={13} />{item.label}</p>
              <p className="mt-2 font-mincho text-sm leading-8 text-[#F1EBDD]">{item.japanese}</p>
              <p className="mt-2 text-[10px] leading-6 text-[#E0A7A7]">{item.reading}</p>
              <p className="mt-2 border-t border-white/[0.07] pt-2 text-xs leading-6 text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E0A7A7]">DETAIL ACARA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Informasi yang perlu ditanyakan saat diundang</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan contoh ini untuk mencari tahu waktu, tempat, kegiatan, kondisi, dan syarat ikut serta.</p>
        </div>
        <article className="rounded-2xl border border-[#8B4B4B]/25 bg-[#211A1B] p-4 md:p-5">
          <div className="flex items-center gap-2 border-b border-white/[0.07] pb-3">
            <MapPin size={18} className="text-[#E0A7A7]" />
            <div>
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E0A7A7]">ACARA KOMUNITAS</p>
              <h3 className="mt-1 text-sm font-bold text-[#F1EBDD]">さくら文化の日</h3>
            </div>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {eventDetails.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/[0.06] bg-black/15 p-3">
                <p className="text-[9px] text-[#A9A398]">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-[#F1EBDD]">{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E0A7A7]">KOSAKATA LINGKUNGAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pengumuman, acara, dan informasi setempat</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kata-kata yang sering muncul pada papan pengumuman, surat warga, dan siaran komunitas.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E0A7A7]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E0A7A7]">KANJI UTAMA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sepuluh kata kanji pada materi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan cara baca dan maknanya di dalam pengumuman.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-[#8B4B4B]/20 bg-[#211A1B] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E0A7A7]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E0A7A7]">POLA TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dua pola utama untuk kondisi dan pengumuman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari cara menjelaskan kondisi suatu acara dan memahami kalimat pasif yang sering digunakan pada pemberitahuan resmi.</p>
        </div>
        {[
          {
            title: "01 · Menyatakan kondisi atau urutan",
            pattern: "～たら",
            example: <>雨が降ったら、ホールでやります。<br />イベントが終わったら、帰ります。<br />天気がよかったら、公園で行います。</>,
            note: "～たら dibuat dari bentuk lampau biasa lalu ditambah ら. Untuk kata kerja: 降る → 降ったら. Untuk kata sifat-i: よい → よかったら. Untuk kata sifat-na dan kata benda, gunakan だったら: 静かだったら／雨だったら. Pola ini dapat menyatakan kondisi yang belum pasti maupun tindakan setelah sesuatu selesai.",
          },
          {
            title: "02 · Bentuk pasif dalam pengumuman",
            pattern: "V-（ら）れます",
            example: <>花の展示会が開かれます。<br />清掃活動が行われます。<br />コンサートが開催されます。</>,
            note: "Bentuk pasif sering digunakan dalam pengumuman formal ketika acara atau kegiatan menjadi fokus kalimat. Contoh: 開く → 開かれる, 行う → 行われる, 開催する → 開催される. Dalam bentuk sopan, gunakan 開かれます, 行われます, dan 開催されます.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#E0A7A7]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#E0A7A7]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E0A7A7]">SIMULASI SITUASI</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan bahasa Jepang dalam konteks</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan kelima situasi dengan memilih jawaban yang paling sesuai. Semua simulasi harus benar untuk membuka evaluasi.</p>
        </div>
        {simulations.map((task, index) => {
          const selected = simulationChoices[index];
          const checked = Boolean(simulationChecked[index]);
          const isCorrect = checked && selected === task.answer;
          const isWrong = checked && selected !== task.answer;
          return (
            <article key={task.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="text-[9px] font-black tracking-[0.16em] text-[#E0A7A7]">{task.title}</p>
              <h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#8B4B4B]/20 bg-[#302124]/70 p-3">
                <p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.japanese}</JapaneseReading></p>
                <p className="mt-1 text-xs text-[#A9A398]">{task.translation}</p>
              </div>
              <div className="mt-3 grid gap-2">
                {task.options.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    disabled={isCorrect}
                    aria-pressed={selected === option.key}
                    onClick={() => {
                      setSimulationChoices((current) => ({ ...current, [index]: option.key }));
                      setSimulationChecked((current) => ({ ...current, [index]: false }));
                    }}
                    className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (
                      isCorrect && option.key === task.answer
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                        : selected === option.key
                          ? "border-[#E0A7A7]/60 bg-[#8B4B4B]/15 text-[#F1EBDD]"
                          : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                    )}
                  >
                    <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                  </button>
                ))}
              </div>
              {(isCorrect || isWrong) && (
                <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                  <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>
                    {isCorrect ? "Benar. " : "Belum tepat. "}
                  </span>
                  {isCorrect ? task.explanation : "Coba tinjau kembali informasi pengumuman dan pilih jawaban lain."}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] text-[#817A73]">{isCorrect ? "Situasi selesai" : "Pilih jawaban lalu periksa"}</p>
                <button
                  type="button"
                  disabled={!selected || isCorrect}
                  onClick={() => setSimulationChecked((current) => ({ ...current, [index]: true }))}
                  className="rounded-lg bg-[#8B4B4B] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#743C3C] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
                >
                  {isCorrect ? "Selesai" : "Periksa"}
                </button>
              </div>
              {checked && isWrong && (
                <p className="mt-2 text-[10px] text-[#E7A1A1]">{task.options.find((option) => option.key === task.answer)?.meaning}</p>
              )}
            </article>
          );
        })}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p className="text-xs text-[#A9A398]">Simulasi benar: {simulationScore} dari {simulations.length}.</p>
          <button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#8B4B4B]/35 px-4 py-2 text-xs font-bold text-[#E0A7A7]">
            <RefreshCw size={13} /> Ulangi simulasi
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E0A7A7]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#E0A7A7]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#E0A7A7]/60 bg-[#8B4B4B]/15 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {practiceSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>
                      {isCorrect ? "Benar. " : "Belum tepat. "}
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
              : Object.keys(practiceAnswers).length + " dari " + practiceTasks.length + " pertanyaan dijawab."}
          </p>
          {practiceSubmitted ? (
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#8B4B4B]/35 px-4 py-2 text-xs font-bold text-[#E0A7A7]">
              <RefreshCw size={13} /> Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={Object.keys(practiceAnswers).length !== practiceTasks.length}
              className="rounded-lg bg-[#8B4B4B] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E0A7A7]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#E0A7A7]">SOAL {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#E0A7A7]/60 bg-[#8B4B4B]/15 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>
                      {isCorrect ? "Benar. " : "Belum tepat. "}
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
              ? "Nilai kuis: " + quizScore + " dari " + quizQuestions.length + " benar."
              : Object.keys(answers).length + " dari " + quizQuestions.length + " pertanyaan dijawab."}
          </p>
          {quizSubmitted ? (
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#8B4B4B]/35 px-4 py-2 text-xs font-bold text-[#E0A7A7]">
              <RefreshCw size={13} /> Ulangi kuis
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="rounded-lg bg-[#8B4B4B] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa kuis
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#8B4B4B]/20 bg-[#302124]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#E0A7A7]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi target komunikasi</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">
          Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.
        </p>
        <div className="space-y-3">
          {canDos.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E0A7A7]">{item.source}</p>
              <p className="mt-1 text-xs leading-5 text-[#EAE6DD]">{item.text}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {ratingOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    disabled={!canEvaluate}
                    aria-pressed={visibleRatings[item.id] === option.value}
                    onClick={() => {
                      const nextRatings = { ...visibleRatings, [item.id]: option.value };
                      setRatings(nextRatings);
                      saveIrodoriSelfEvaluation(lessonId, nextRatings);
                    }}
                    className={"rounded-lg border px-3 py-2 text-left text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 " + (
                      visibleRatings[item.id] === option.value
                        ? "border-[#E0A7A7]/50 bg-[#8B4B4B]/20 text-[#F8EEDC]"
                        : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                    )}
                  >
                    <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
          <p className="text-xs text-[#A9A398]">
            {isCompleted
              ? "Lesson 7 selesai. Progres tersimpan."
              : canDosRated
                ? "Semua target komunikasi sudah dinilai."
                : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button
            type="button"
            onClick={finishLesson}
            disabled={!canComplete || isCompleted}
            className="rounded-xl bg-[#8B4B4B] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#743C3C] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
          >
            {isCompleted ? "Lesson 7 selesai" : "Selesaikan Lesson 7"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Dasar 2 · 07 / 18</span>
      </div>
    </main>
  );
}
