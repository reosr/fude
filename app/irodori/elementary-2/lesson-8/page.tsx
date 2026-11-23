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
  Utensils,
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
const lessonId = "elementary2-08";

const readFestivalProgramConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>このフェスティバルは、いつありますか。</>,
    romaji: "Kono fesutibaru wa, itsu arimasu ka?",
    translation: "Festival ini diadakan kapan?",
    audioFileName: "irodori-elementary2-08-a01-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>六月二十二日の日曜日です。午前十時から午後四時までです。</>,
    romaji: "Rokugatsu nijuu-futsuka no nichiyoubi desu. Gozen juuji kara gogo yoji made desu.",
    translation: "Minggu, 22 Juni. Mulai pukul sepuluh pagi sampai empat sore.",
    audioFileName: "irodori-elementary2-08-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ステージでは、何がありますか。</>,
    romaji: "Suteeji de wa, nani ga arimasu ka?",
    translation: "Ada acara apa di panggung?",
    audioFileName: "irodori-elementary2-08-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>午前はダンス、午後は音楽の発表があります。</>,
    romaji: "Gozen wa dansu, gogo wa ongaku no happyou ga arimasu.",
    translation: "Pagi ada pertunjukan tari dan sore ada penampilan musik.",
    audioFileName: "irodori-elementary2-08-a01-l04.mp3",
  },
];

const askEventTimeAndPlaceConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>すみません。料理の紹介コーナーは、どこですか。</>,
    romaji: "Sumimasen. Ryouri no shoukai koonaa wa, doko desu ka?",
    translation: "Permisi, di mana area pengenalan makanan?",
    audioFileName: "irodori-elementary2-08-a02-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>あちらのテントのとなりです。</>,
    romaji: "Achira no tento no tonari desu.",
    translation: "Di sebelah tenda itu.",
    audioFileName: "irodori-elementary2-08-a02-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>子どもの工作は、何時からか、わかりますか。</>,
    romaji: "Kodomo no kousaku wa, nanji kara ka, wakarimasu ka?",
    translation: "Kamu tahu lokakarya anak-anak mulai pukul berapa?",
    audioFileName: "irodori-elementary2-08-a02-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>午後一時からだと思います。案内でも確認できますよ。</>,
    romaji: "Gogo ichiji kara da to omoimasu. Annai demo kakunin dekimasu yo.",
    translation: "Katanya mulai pukul satu siang. Kamu juga bisa memastikannya di meja informasi.",
    audioFileName: "irodori-elementary2-08-a02-l04.mp3",
  },
];

const askParticipationRequirementsConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>折り紙のワークショップに参加したいんですが、申し込みが必要ですか。</>,
    romaji: "Origami no waakushoppu ni sanka shitain desu ga, moushikomi ga hitsuyou desu ka?",
    translation: "Saya ingin ikut lokakarya origami. Apakah perlu mendaftar?",
    audioFileName: "irodori-elementary2-08-a03-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>いいえ、必要ありません。受付でカードをもらってください。</>,
    romaji: "Iie, hitsuyou arimasen. Uketsuke de kaado o moratte kudasai.",
    translation: "Tidak perlu. Silakan ambil kartu di meja pendaftaran.",
    audioFileName: "irodori-elementary2-08-a03-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>何歳から参加できますか。</>,
    romaji: "Nansai kara sanka dekimasu ka?",
    translation: "Mulai usia berapa boleh ikut?",
    audioFileName: "irodori-elementary2-08-a03-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>小学生以上なら、だれでも参加できます。</>,
    romaji: "Shougakusei ijou nara, dare demo sanka dekimasu.",
    translation: "Siswa SD atau yang lebih tinggi boleh ikut.",
    audioFileName: "irodori-elementary2-08-a03-l04.mp3",
  },
];

const understandVenueAnnouncementConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>会場の放送を聞きましたか。</>,
    romaji: "Kaijou no housou o kikimashita ka?",
    translation: "Apakah kamu mendengar pengumuman di tempat acara?",
    audioFileName: "irodori-elementary2-08-a04-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい。ホールの中では、食べ物を食べないでくださいと言っていました。</>,
    romaji: "Hai. Hooru no naka de wa, tabemono o tabenaide kudasai to itte imashita.",
    translation: "Ya. Ada pengumuman bahwa kita tidak boleh makan di dalam aula.",
    audioFileName: "irodori-elementary2-08-a04-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>飲み物もだめですか。</>,
    romaji: "Nomimono mo dame desu ka?",
    translation: "Kalau minum, juga tidak boleh?",
    audioFileName: "irodori-elementary2-08-a04-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい。飲食は、外の休憩コーナーでお願いします。</>,
    romaji: "Hai. Inshoku wa, soto no kyuukei koonaa de onegaishimasu.",
    translation: "Ya. Makan dan minum diperbolehkan di area istirahat luar.",
    audioFileName: "irodori-elementary2-08-a04-l04.mp3",
  },
];

const shareFestivalExperienceConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>先週の国際交流フェスティバルに行きましたか。</>,
    romaji: "Senshuu no kokusai kouryuu fesutibaru ni ikimashita ka?",
    translation: "Minggu lalu, kamu pergi ke festival pertukaran budaya internasional?",
    audioFileName: "irodori-elementary2-08-a05-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。友だちと行きました。いろいろな国の音楽を聞きました。</>,
    romaji: "Hai. Tomodachi to ikimashita. Iroiro na kuni no ongaku o kikimashita.",
    translation: "Ya. Saya pergi bersama seorang teman dan mendengarkan musik dari berbagai negara.",
    audioFileName: "irodori-elementary2-08-a05-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>屋台の食べ物はどうでしたか。</>,
    romaji: "Yatai no tabemono wa dou deshita ka?",
    translation: "Bagaimana makanan di kios festival?",
    audioFileName: "irodori-elementary2-08-a05-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>とてもおいしかったです。また来年も行きたいです。</>,
    romaji: "Totemo oishikatta desu. Mata rainen mo ikitai desu.",
    translation: "Makanannya enak sekali. Saya ingin datang lagi tahun depan.",
    audioFileName: "irodori-elementary2-08-a05-l04.mp3",
  },
];

const canDos = [
  {
    id: "read-event-program",
    source: "CAN-DO 32",
    text: "Membaca program acara dan menemukan informasi utama, seperti waktu mulai dan jenis pertunjukan.",
  },
  {
    id: "ask-event-time-place",
    source: "CAN-DO 33",
    text: "Bertanya kepada petugas atau orang di sekitar tentang waktu dan lokasi acara, lalu memahami jawabannya.",
  },
  {
    id: "ask-participation-requirements",
    source: "CAN-DO 34",
    text: "Bertanya kepada penanggung jawab tentang persyaratan dan cara mendaftar kegiatan yang ingin diikuti.",
  },
  {
    id: "understand-venue-announcements",
    source: "CAN-DO 35",
    text: "Memahami garis besar pengumuman dan hal-hal yang perlu diperhatikan di lokasi acara.",
  },
  {
    id: "read-festival-social-post",
    source: "CAN-DO 36",
    text: "Membaca unggahan singkat teman tentang acara yang diikuti dan memahami isi utamanya.",
  },
  {
    id: "write-event-social-post",
    source: "CAN-DO 37",
    text: "Menulis unggahan singkat tentang acara yang pernah diikuti, kegiatan yang dilakukan, dan kesannya.",
  },
];

const vocabRows = [
  ["屋台", "やたい · yatai", "Kios atau stan makanan"],
  ["会場", "かいじょう · kaijou", "Tempat acara"],
  ["ステージ", "ステージ · suteeji", "Panggung"],
  ["出し物", "だしもの · dashimono", "Pertunjukan atau acara yang ditampilkan"],
  ["プログラム", "プログラム · puroguramu", "Susunan acara"],
  ["国際交流", "こくさいこうりゅう · kokusai kouryuu", "Pertukaran internasional"],
  ["フェスティバル", "フェスティバル · fesutibaru", "Festival"],
  ["入場料", "にゅうじょうりょう · nyuujouryou", "Biaya masuk"],
  ["無料", "むりょう · muryou", "Gratis"],
  ["案内", "あんない · annai", "Informasi atau panduan"],
  ["係の人", "かかりのひと · kakari no hito", "Petugas yang bertanggung jawab"],
  ["受付", "うけつけ · uketsuke", "Meja pendaftaran atau penerimaan"],
  ["場所", "ばしょ · basho", "Tempat atau lokasi"],
  ["時間", "じかん · jikan", "Waktu"],
  ["始まる", "はじまる · hajimaru", "Mulai"],
  ["終わる", "おわる · owaru", "Selesai"],
  ["まだ", "まだ · mada", "Belum atau masih"],
  ["もう", "もう · mou", "Sudah"],
  ["コンテスト", "コンテスト · kontesuto", "Kontes"],
  ["大会", "たいかい · taikai", "Kompetisi atau perlombaan"],
  ["スピーチ", "スピーチ · supiichi", "Pidato"],
  ["カラオケ", "カラオケ · karaoke", "Karaoke"],
  ["参加する", "さんかする · sanka suru", "Berpartisipasi atau ikut"],
  ["参加者", "さんかしゃ · sankasha", "Peserta"],
  ["参加条件", "さんかじょうけん · sanka jouken", "Persyaratan keikutsertaan"],
  ["参加費", "さんかひ · sanka hi", "Biaya partisipasi"],
  ["申し込む", "もうしこむ · moushikomu", "Mendaftar"],
  ["申込書", "もうしこみしょ · moushikomisho", "Formulir pendaftaran"],
  ["必要", "ひつよう · hitsuyou", "Perlu atau dibutuhkan"],
  ["以上", "いじょう · ijou", "Sekurang-kurangnya atau lebih"],
  ["先着順", "せんちゃくじゅん · senchakujun", "Urutan berdasarkan siapa cepat"],
  ["抽選", "ちゅうせん · chuusen", "Pengundian"],
  ["賞品", "しょうひん · shouhin", "Hadiah"],
  ["発表", "はっぴょう · happyou", "Penampilan atau presentasi"],
  ["演奏", "えんそう · ensou", "Pertunjukan musik"],
  ["体験", "たいけん · taiken", "Pengalaman atau mencoba langsung"],
  ["展示", "てんじ · tenji", "Pameran"],
  ["民族衣装", "みんぞくいしょう · minzoku ishou", "Pakaian tradisional"],
  ["写真", "しゃしん · shashin", "Foto"],
  ["動画", "どうが · douga", "Video"],
  ["撮影する", "さつえいする · satsuei suru", "Mengambil foto atau video"],
  ["携帯電話", "けいたいでんわ · keitai denwa", "Telepon genggam"],
  ["電源", "でんげん · dengen", "Daya atau tombol daya"],
  ["設定する", "せっていする · settei suru", "Mengatur atau menyetel"],
  ["持ち込み", "もちこみ · mochikomi", "Membawa masuk"],
  ["禁止", "きんし · kinshi", "Larangan"],
  ["休憩", "きゅうけい · kyuukei", "Istirahat"],
  ["感想", "かんそう · kansou", "Kesan atau pendapat"],
  ["来年", "らいねん · rainen", "Tahun depan"],
  ["太鼓", "たいこ · taiko", "Genderang Jepang"],
];

const kanjiWords = [
  ["会場", "かいじょう · kaijou", "Tempat acara"],
  ["世界", "せかい · sekai", "Dunia"],
  ["体験", "たいけん · taiken", "Pengalaman atau mencoba langsung"],
  ["国際交流", "こくさいこうりゅう · kokusai kouryuu", "Pertukaran internasional"],
  ["来年", "らいねん · rainen", "Tahun depan"],
  ["参加", "さんか · sanka", "Partisipasi"],
  ["必要", "ひつよう · hitsuyou", "Perlu atau dibutuhkan"],
  ["写真", "しゃしん · shashin", "Foto"],
  ["携帯電話", "けいたいでんわ · keitai denwa", "Telepon genggam"],
  ["太鼓", "たいこ · taiko", "Genderang Jepang"],
];

const festivalProgram = [
  {
    area: "ステージ · Panggung",
    color: "bg-[#3B2B4A]",
    items: [
      { time: "10:30–11:00", title: "世界のダンス", meaning: "Tarian dari berbagai negara" },
      { time: "11:30–12:00", title: "スピーチ発表", meaning: "Penampilan pidato" },
      { time: "13:00–13:30", title: "和太鼓の演奏", meaning: "Pertunjukan taiko Jepang" },
      { time: "14:00–14:30", title: "音楽の発表", meaning: "Penampilan musik" },
    ],
  },
  {
    area: "体験コーナー · Area pengalaman",
    color: "bg-[#26413B]",
    items: [
      { time: "11:00–12:00", title: "折り紙ワークショップ", meaning: "Lokakarya origami" },
      { time: "13:00–14:00", title: "世界の遊び体験", meaning: "Mencoba permainan dari berbagai negara" },
    ],
  },
  {
    area: "屋台 · Kios makanan",
    color: "bg-[#493722]",
    items: [
      { time: "10:00–16:00", title: "世界の料理", meaning: "Makanan dari berbagai negara" },
      { time: "10:00–16:00", title: "飲み物コーナー", meaning: "Area minuman" },
    ],
  },
];

const participationInfo = [
  { label: "参加条件", value: "小学生以上", meaning: "Usia sekolah dasar atau lebih" },
  { label: "申し込み", value: "受付でカードをもらう", meaning: "Ambil kartu di meja pendaftaran" },
  { label: "参加費", value: "無料", meaning: "Gratis" },
  { label: "定員", value: "各回20人", meaning: "20 orang untuk setiap sesi" },
];

const venueAnnouncements = [
  {
    title: "撮影について · Tentang pengambilan gambar",
    japanese: "ステージの写真撮影はできますが、動画の撮影はご遠慮ください。周りの人の迷惑にならないようにお願いします。",
    reading: "Suteeji no shashin satsuei wa dekimasu ga, douga no satsuei wa goenryo kudasai. Mawari no hito no meiwaku ni naranai you ni onegaishimasu.",
    meaning: "Foto panggung diperbolehkan, tetapi mohon tidak merekam video. Harap jangan mengganggu orang di sekitar.",
  },
  {
    title: "携帯電話について · Tentang telepon genggam",
    japanese: "発表の間は、携帯電話をマナーモードに設定してください。会場の中では、通話をご遠慮ください。",
    reading: "Happyou no aida wa, keitai denwa o manaa moodo ni settei shite kudasai. Kaijou no naka de wa, tsuuwa o goenryo kudasai.",
    meaning: "Selama penampilan, atur telepon ke mode senyap. Mohon tidak menelepon di dalam tempat acara.",
  },
  {
    title: "飲食について · Tentang makan dan minum",
    japanese: "ホールの中への食べ物や飲み物の持ち込みは禁止されています。飲食は、外の休憩コーナーをご利用ください。",
    reading: "Hooru no naka e no tabemono ya nomimono no mochikomi wa kinshi sarete imasu. Inshoku wa, soto no kyuukei koonaa o goriyou kudasai.",
    meaning: "Makanan dan minuman tidak boleh dibawa masuk ke aula. Silakan gunakan area istirahat di luar untuk makan dan minum.",
  },
];

const festivalSocialPost = {
  author: "Mika",
  date: "6月22日",
  japanese: "日曜日に、友だちと国際交流フェスティバルに行きました。ステージで世界のダンスを見たり、太鼓の音楽を聞いたりしました。折り紙のワークショップにも参加しました。初めてでしたが、とても楽しかったです。屋台の料理もおいしかったです。また来年も行きたいです。",
  reading: "Nichiyoubi ni, tomodachi to kokusai kouryuu fesutibaru ni ikimashita. Suteeji de sekai no dansu o mitari, taiko no ongaku o kiitari shimashita. Origami no waakushoppu ni mo sanka shimashita. Hajimete deshita ga, totemo tanoshikatta desu. Yatai no ryouri mo oishikatta desu. Mata rainen mo ikitai desu.",
  translation: "Hari Minggu, saya pergi ke festival pertukaran budaya internasional bersama seorang teman. Saya menonton tarian dari berbagai negara dan mendengarkan musik taiko di panggung. Saya juga ikut lokakarya origami. Ini pengalaman pertama saya, tetapi seru sekali. Makanan di stan-stan festival juga enak. Saya ingin datang lagi tahun depan.",
};

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
    title: "01 · Membaca program acara",
    heading: "Mencari waktu pertunjukan",
    prompt: "Kamu ingin menonton penampilan taiko. Pada program, kapan pertunjukan itu dimulai?",
    japanese: <>13:00–13:30 · 和太鼓の演奏</>,
    translation: "Pukul 13.00–13.30 · Pertunjukan taiko Jepang.",
    options: [
      { key: "a", label: "Pukul 10.30.", meaning: "Pukul 10.30 adalah waktu tarian dari berbagai negara." },
      { key: "b", label: "Pukul 13.00.", meaning: "Program menyebut penampilan taiko dimulai pukul 13.00." },
      { key: "c", label: "Pukul 14.00.", meaning: "Pukul 14.00 adalah waktu penampilan musik." },
    ],
    answer: "b",
    explanation: "Lihat nama kegiatan dan cocokkan dengan kolom waktu pada program.",
  },
  {
    title: "02 · Bertanya tentang lokasi",
    heading: "Meminta informasi dengan sopan",
    prompt: "Kamu belum tahu di mana kios makanan berada. Pertanyaan mana yang cocok untuk orang di sekitar?",
    japanese: <>屋台がどこか、わかりますか。</>,
    translation: "Apakah kamu tahu di mana kios makanan?",
    options: [
      { key: "a", label: "屋台がどこか、わかりますか。", meaning: "Kata tanya どこ diikuti kalimat bentuk biasa + か, lalu わかりますか." },
      { key: "b", label: "屋台は何時に食べますか。", meaning: "Kalimat ini menanyakan pukul berapa kios makan." },
      { key: "c", label: "屋台がどこでしたか、行きます。", meaning: "Susunan ini tidak membentuk pertanyaan tidak langsung yang tepat." },
    ],
    answer: "a",
    explanation: "Pola kata tanya + kalimat bentuk biasa + か dapat diikuti わかりますか untuk bertanya apakah lawan bicara tahu.",
  },
  {
    title: "03 · Menanyakan persyaratan",
    heading: "Memastikan cara ikut lokakarya",
    prompt: "Kamu ingin mengikuti lokakarya. Kamu perlu tahu apakah pendaftaran diperlukan. Pilih pertanyaan yang tepat.",
    japanese: <>申し込みが必要ですか。</>,
    translation: "Apakah perlu mendaftar?",
    options: [
      { key: "a", label: "申し込みは何時に食べますか。", meaning: "Pertanyaan ini tidak sesuai dengan makna mendaftar." },
      { key: "b", label: "申し込みが必要ですか。", meaning: "必要ですか menanyakan apakah sesuatu diperlukan." },
      { key: "c", label: "申し込みはどこを聞きますか。", meaning: "Susunan ini tidak tepat untuk menanyakan apakah pendaftaran diperlukan." },
    ],
    answer: "b",
    explanation: "Kita dapat bertanya tentang persyaratan, biaya, kuota, dan cara mendaftar kepada petugas.",
  },
  {
    title: "04 · Memahami pengumuman",
    heading: "Menangkap aturan di lokasi acara",
    prompt: "Pengumuman menyebutkan bahwa makanan tidak boleh dibawa ke aula dan pengunjung dapat makan di area istirahat luar. Apa yang harus dilakukan?",
    japanese: <>飲食は、外の休憩コーナーをご利用ください。</>,
    translation: "Silakan gunakan area istirahat luar untuk makan dan minum.",
    options: [
      { key: "a", label: "Makan di dalam aula.", meaning: "Pengumuman melarang membawa makanan dan minuman ke aula." },
      { key: "b", label: "Makan di area istirahat luar.", meaning: "Inilah tempat yang dianjurkan dalam pengumuman." },
      { key: "c", label: "Makan di panggung.", meaning: "Panggung bukan area makan yang disebutkan." },
    ],
    answer: "b",
    explanation: "Saat mendengarkan pengumuman, fokus pada tindakan yang diperbolehkan dan tempat yang disebutkan.",
  },
  {
    title: "05 · Membaca unggahan teman",
    heading: "Menemukan kegiatan yang diikuti",
    prompt: "Mika menulis bahwa ia melihat tarian, mendengarkan taiko, dan mengikuti lokakarya origami. Kegiatan mana yang ia ikuti sendiri?",
    japanese: <>折り紙のワークショップにも参加しました。</>,
    translation: "Saya juga ikut lokakarya origami.",
    options: [
      { key: "a", label: "Pertunjukan tarian di panggung.", meaning: "Dalam unggahan, Mika mengatakan ia menonton tarian." },
      { key: "b", label: "Penampilan musik taiko.", meaning: "Mika mengatakan ia mendengarkan musik taiko." },
      { key: "c", label: "Lokakarya origami.", meaning: "参加しました berarti ikut serta; ini kegiatan yang ia ikuti." },
    ],
    answer: "c",
    explanation: "Bedakan kata 見ました (menonton), 聞きました (mendengarkan), dan 参加しました (mengikuti).",
  },
];

const practiceTasks: Task[] = [
  {
    prompt: <>Apa arti 「屋台」?</>,
    options: [
      { key: "a", label: "Kios atau stan makanan." },
      { key: "b", label: "Ruang pertunjukan." },
      { key: "c", label: "Meja pendaftaran." },
    ],
    answer: "a",
    explanation: <>屋台（やたい）adalah kios atau stan, misalnya stan makanan pada festival.</>,
  },
  {
    prompt: <>Pilih arti 「もう始まりました」.</>,
    options: [
      { key: "a", label: "Belum dimulai." },
      { key: "b", label: "Sudah dimulai." },
      { key: "c", label: "Masih akan dimulai tahun depan." },
    ],
    answer: "b",
    explanation: <>もう + kalimat positif bentuk lampau menyatakan bahwa kegiatan sudah terjadi atau selesai.</>,
  },
  {
    prompt: <>Lengkapi jawaban: 「まだ＿＿＿。」 untuk menyatakan acara belum dimulai.</>,
    options: [
      { key: "a", label: "始まっていません." },
      { key: "b", label: "始まりました." },
      { key: "c", label: "始まります." },
    ],
    answer: "a",
    explanation: <>まだ + V-ていません menyatakan bahwa tindakan belum terjadi atau belum selesai.</>,
  },
  {
    prompt: <>Apa arti 「まだイベントをやっています」?</>,
    options: [
      { key: "a", label: "Acaranya sudah berakhir." },
      { key: "b", label: "Acaranya belum pernah diadakan." },
      { key: "c", label: "Acaranya masih berlangsung." },
    ],
    answer: "c",
    explanation: <>まだ + kalimat positif menyatakan keadaan yang masih berlanjut.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Apakah kamu tahu di mana panggungnya?”</>,
    options: [
      { key: "a", label: "ステージがどこか、わかりますか。" },
      { key: "b", label: "ステージはだれか、わかりますか。" },
      { key: "c", label: "ステージが何人か、わかりますか。" },
    ],
    answer: "a",
    explanation: <>どこか adalah bagian tanya tidak langsung yang berarti “di mana”.</>,
  },
  {
    prompt: <>Apa arti 「申込書」?</>,
    options: [
      { key: "a", label: "Tiket masuk." },
      { key: "b", label: "Formulir pendaftaran." },
      { key: "c", label: "Program panggung." },
    ],
    answer: "b",
    explanation: <>申込書（もうしこみしょ）adalah formulir yang digunakan untuk mendaftar.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa arti 「入場料無料」?</>,
    options: [
      { key: "a", label: "Biaya masuk gratis." },
      { key: "b", label: "Acara sudah selesai." },
      { key: "c", label: "Pendaftaran ditutup." },
    ],
    answer: "a",
    explanation: <>入場料 berarti biaya masuk dan 無料 berarti gratis.</>,
  },
  {
    prompt: <>Bagaimana membaca 「会場」?</>,
    options: [
      { key: "a", label: "かいじょう · kaijou." },
      { key: "b", label: "けいじばん · keijiban." },
      { key: "c", label: "かいけい · kaikei." },
    ],
    answer: "a",
    explanation: <>会場 dibaca かいじょう (kaijou), artinya tempat acara.</>,
  },
  {
    prompt: <>Apa arti 「まだ始まっていません」?</>,
    options: [
      { key: "a", label: "Sudah dimulai." },
      { key: "b", label: "Belum dimulai." },
      { key: "c", label: "Masih berlangsung." },
    ],
    answer: "b",
    explanation: <>まだ + V-ていません menyatakan bahwa kegiatan belum dimulai atau belum selesai.</>,
  },
  {
    prompt: <>Apa arti 「まだやっています」?</>,
    options: [
      { key: "a", label: "Acaranya masih berlangsung." },
      { key: "b", label: "Acaranya sudah dibatalkan." },
      { key: "c", label: "Acaranya belum pernah dimulai." },
    ],
    answer: "a",
    explanation: <>まだ + kalimat positif dapat menunjukkan bahwa suatu keadaan masih berlanjut.</>,
  },
  {
    prompt: <>Lengkapi pola pertanyaan tidak langsung: 「屋台がどこ＿＿＿、わかりますか。」</>,
    options: [
      { key: "a", label: "を." },
      { key: "b", label: "に." },
      { key: "c", label: "か." },
    ],
    answer: "c",
    explanation: <>Kalimat tanya bentuk biasa menjadi bagian pertanyaan tidak langsung dengan か.</>,
  },
  {
    prompt: <>Apa arti 「先着順」?</>,
    options: [
      { key: "a", label: "Urutan berdasarkan siapa yang datang atau mendaftar lebih dahulu." },
      { key: "b", label: "Semua peserta dipilih secara acak." },
      { key: "c", label: "Acara hanya berlangsung satu hari." },
    ],
    answer: "a",
    explanation: <>先着順（せんちゃくじゅん）berarti urutan berdasarkan siapa yang lebih dahulu.</>,
  },
  {
    prompt: <>Apa arti 「抽選」?</>,
    options: [
      { key: "a", label: "Pendaftaran langsung." },
      { key: "b", label: "Pengundian." },
      { key: "c", label: "Pertunjukan musik." },
    ],
    answer: "b",
    explanation: <>抽選（ちゅうせん）adalah pemilihan melalui undian.</>,
  },
  {
    prompt: <>Apa yang diminta dalam kalimat 「携帯電話をマナーモードに設定してください」?</>,
    options: [
      { key: "a", label: "Matikan semua lampu." },
      { key: "b", label: "Atur telepon genggam ke mode senyap." },
      { key: "c", label: "Ambil foto panggung." },
    ],
    answer: "b",
    explanation: <>マナーモード berarti mode senyap atau mode getar pada telepon.</>,
  },
  {
    prompt: <>Apa arti 「来年も行きたいです」?</>,
    options: [
      { key: "a", label: "Saya juga ingin pergi tahun depan." },
      { key: "b", label: "Saya pergi tahun lalu." },
      { key: "c", label: "Saya tidak pernah pergi." },
    ],
    answer: "a",
    explanation: <>来年 berarti tahun depan, sedangkan 行きたいです berarti ingin pergi.</>,
  },
  {
    prompt: <>Apa saja yang sebaiknya ada dalam unggahan pengalaman acara?</>,
    options: [
      { key: "a", label: "Nama lengkap dan data pribadi seluruh pengunjung." },
      { key: "b", label: "Waktu, lokasi, kegiatan yang diikuti, dan kesan." },
      { key: "c", label: "Hanya nomor tiket masuk." },
    ],
    answer: "b",
    explanation: <>Unggahan sederhana dapat menceritakan acara, waktu, lokasi, kegiatan, dan kesan pribadi tanpa membagikan data pribadi orang lain.</>,
  },
];

export default function IrodoriElementaryTwoLessonEightPage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [eventDraft, setEventDraft] = useState("");

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
      <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#D8A66A]/40 hover:text-[#EAE6DD]">
        <ArrowLeft size={15} /> Kembali ke Dasar 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#A36D3D]/35 bg-gradient-to-br from-[#3B2C21] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#E7BE8E]/[0.08]">祭</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#E7BE8E]">IRODORI • DASAR 2 A2 • PELAJARAN 08</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Apakah kamu tahu di mana stan makanan?</h1>
          <p className="mt-2 text-sm font-semibold text-[#E7BE8E]">屋台はどこかわかりますか？</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar membaca program festival, bertanya tentang waktu dan lokasi, memahami persyaratan kegiatan dan pengumuman, serta berbagi pengalaman melalui unggahan singkat.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Utensils size={14} className="text-[#E7BE8E]" />Kios festival</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Megaphone size={14} className="text-[#E7BE8E]" />Pengumuman acara</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Star size={14} className="text-[#E7BE8E]" />Kesan festival</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#A36D3D]/20 bg-[#30251D]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#E7BE8E]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Enam target berikut sesuai target komunikasi 32–37 pada Irodori Dasar 2 Lesson 8.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E7BE8E]">{item.source} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7BE8E]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membaca program dan bertanya kepada petugas</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Seluruh percakapan dibuat orisinal oleh Fude berdasarkan target komunikasi pelajaran ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Membaca program festival" speakers={[friendYui, friendSota]} utterances={readFestivalProgramConversation} />
          <IrodoriConversation title="Bertanya waktu dan lokasi kegiatan" speakers={[friendAkiko, friendKenji]} utterances={askEventTimeAndPlaceConversation} />
          <IrodoriConversation title="Menanyakan persyaratan lokakarya" speakers={[friendSota, friendYui]} utterances={askParticipationRequirementsConversation} />
          <IrodoriConversation title="Memahami pengumuman di lokasi acara" speakers={[friendAkiko, friendKenji]} utterances={understandVenueAnnouncementConversation} />
          <IrodoriConversation title="Berbagi pengalaman festival" speakers={[friendYui, friendSota]} utterances={shareFestivalExperienceConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7BE8E]">PROGRAM FESTIVAL</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Cari waktu dan kegiatan yang ingin dikunjungi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Contoh program fiktif untuk latihan membaca. Festival berlangsung pukul 10.00–16.00 dan tidak dipungut biaya masuk.</p>
        </div>
        <article className="rounded-2xl border border-[#A36D3D]/25 bg-[#211B16] p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#A36D3D]/35 pb-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.16em] text-[#E7BE8E]">COMMUNITY FESTIVAL · 22 JUNE</p>
              <h3 className="mt-1 font-mincho text-xl font-bold text-[#F1EBDD]">みどり国際交流フェスティバル</h3>
              <p className="mt-1 text-[10px] text-[#A9A398]">6月22日（日） · 10:00–16:00 · 入場料無料</p>
            </div>
            <div className="rounded-xl border border-[#A36D3D]/30 bg-[#493722]/40 p-3 text-center">
              <p className="text-[9px] text-[#A9A398]">Tempat</p>
              <p className="mt-1 text-xs font-bold text-[#F1EBDD]">市民広場</p>
              <p className="text-[9px] text-[#E7BE8E]">Plaza warga</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {festivalProgram.map((area) => (
              <div key={area.area} className="overflow-hidden rounded-xl border border-white/[0.06]">
                <div className={"px-3 py-2 text-[10px] font-bold text-[#F1EBDD] " + area.color}>{area.area}</div>
                <div className="divide-y divide-white/[0.05]">
                  {area.items.map((item) => (
                    <div key={item.time + item.title} className="flex flex-wrap items-center justify-between gap-2 bg-black/15 px-3 py-2.5">
                      <div>
                        <p className="font-mincho text-sm text-[#F1EBDD]">{item.title}</p>
                        <p className="mt-0.5 text-[10px] text-[#A9A398]">{item.meaning}</p>
                      </div>
                      <span className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold tabular-nums text-[#E7BE8E]">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7BE8E]">PERSYARATAN KEGIATAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Ketahui syarat dan cara mendaftar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Informasi lokakarya berikut juga fiktif. Perhatikan usia peserta, pendaftaran, biaya, dan jumlah tempat.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {participationInfo.map((item) => (
            <article key={item.label} className="rounded-xl border border-[#A36D3D]/20 bg-[#211B16] p-3">
              <p className="text-[9px] font-black tracking-[0.12em] text-[#E7BE8E]">{item.label}</p>
              <p className="mt-1 font-mincho text-base font-bold text-[#F1EBDD]">{item.value}</p>
              <p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7BE8E]">PENGUMUMAN LOKASI ACARA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pahami informasi dan hal yang perlu diperhatikan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Contoh pengumuman berikut dibuat khusus untuk latihan dan memiliki arti dalam bahasa Indonesia.</p>
        </div>
        <div className="space-y-3">
          {venueAnnouncements.map((item, index) => (
            <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="flex items-center gap-2 text-[9px] font-black tracking-[0.15em] text-[#E7BE8E]"><Megaphone size={13} />PENGUMUMAN 01{index + 1}</p>
              <h3 className="mt-2 text-xs font-bold text-[#EAE6DD]">{item.title}</h3>
              <p className="mt-2 font-mincho text-sm leading-8 text-[#F1EBDD]">{item.japanese}</p>
              <p className="mt-2 text-[10px] leading-6 text-[#E7BE8E]">{item.reading}</p>
              <p className="mt-2 border-t border-white/[0.07] pt-2 text-xs leading-6 text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7BE8E]">MEMBACA UNGGAHAN TEMAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Temukan kegiatan yang dilakukan dan kesannya</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Unggahan berikut merupakan contoh fiktif dari seorang pengunjung festival.</p>
        </div>
        <article className="rounded-2xl border border-[#A36D3D]/25 bg-[#211B16] p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E7BE8E]">UNGGAHAN FESTIVAL · {festivalSocialPost.date}</p>
              <h3 className="mt-1 text-sm font-bold text-[#F1EBDD]">{festivalSocialPost.author}</h3>
            </div>
            <FileText size={20} className="text-[#E7BE8E]" />
          </div>
          <p className="mt-3 font-mincho text-sm leading-8 text-[#F1EBDD]">{festivalSocialPost.japanese}</p>
          <p className="mt-2 text-[10px] leading-6 text-[#E7BE8E]">{festivalSocialPost.reading}</p>
          <p className="mt-3 border-t border-white/[0.07] pt-3 text-xs leading-6 text-[#A9A398]">{festivalSocialPost.translation}</p>
        </article>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#A36D3D]/20 bg-[#30251D]/60 p-4 md:p-5">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7BE8E]">LATIHAN MENULIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tulis unggahan tentang acara yang pernah kamu ikuti</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Tulis 2–4 kalimat sederhana. Ceritakan acara apa yang kamu kunjungi, kapan dan di mana acara berlangsung, kegiatan yang kamu ikuti, serta bagaimana perasaanmu.</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
          <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">どんなイベントでしたか。いつ、どこでありましたか。何をしましたか。どうでしたか。</p>
          <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">Acara seperti apa? Kapan dan di mana? Apa yang kamu lakukan? Bagaimana kesannya?</p>
        </div>
        <label htmlFor="event-post-draft" className="block text-xs font-semibold text-[#E7BE8E]">Tulis unggahan dalam bahasa Jepang</label>
        <textarea
          id="event-post-draft"
          value={eventDraft}
          onChange={(event) => setEventDraft(event.target.value)}
          rows={5}
          placeholder="先週、友だちとイベントに行きました。"
          className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#E7BE8E]/50"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] text-[#817A73]">Draf hanya digunakan untuk latihan di halaman ini.</p>
          <span className="text-[10px] tabular-nums text-[#E7BE8E]">{eventDraft.length} karakter</span>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7BE8E]">KOSAKATA FESTIVAL</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Program, peserta, dan pengumuman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenali kata-kata yang sering muncul di program acara dan informasi lokasi festival.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E7BE8E]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7BE8E]">KANJI UTAMA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sepuluh kata kanji pada materi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan cara baca dan maknanya di dalam konteks festival.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-[#A36D3D]/20 bg-[#211B16] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E7BE8E]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7BE8E]">POLA TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tiga pola untuk bertanya dan memahami informasi acara</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari cara menanyakan apakah kegiatan sudah dimulai, apakah kegiatan masih berlangsung, dan apakah seseorang mengetahui waktu atau lokasi acara.</p>
        </div>
        {[
          {
            title: "01 · Menyatakan sesuatu sudah atau belum terjadi",
            pattern: "もう V-ました ／ まだ V-ていません",
            example: <>コンテストは、もう始まりましたか。<br />いいえ、まだ始まっていません。</>,
            note: "もう + kalimat positif bentuk lampau menyatakan tindakan sudah terjadi. まだ + V-ていません menyatakan tindakan belum terjadi atau belum selesai. Untuk menjawab singkat, まだです juga dapat digunakan.",
          },
          {
            title: "02 · Menyatakan keadaan yang masih berlangsung",
            pattern: "まだ V-ます",
            example: <>フリーマーケットは、まだやっていますか。<br />はい、午後四時までやっています。</>,
            note: "まだ juga berarti masih. Jika diikuti kalimat positif, pola ini menyatakan kegiatan atau keadaan masih berlangsung sampai sekarang.",
          },
          {
            title: "03 · Pertanyaan tidak langsung",
            pattern: "【kata tanya】＋ S (bentuk biasa) ＋ か、～",
            example: <>屋台がどこか、わかりますか。<br />子どもの工作が何時からか、知っていますか。<br />イベントがいつ始まるか、教えてください。</>,
            note: "Gunakan kata tanya seperti どこ, いつ, 何時, atau だれ, lalu kalimat bentuk biasa + か. Ungkapan seperti わかりますか, 知っていますか, atau 教えてください dapat diletakkan setelahnya. Jika pertanyaan langsung berakhir dengan ですか, hapus です sebelum menambahkan か.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#E7BE8E]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#E7BE8E]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7BE8E]">SIMULASI SITUASI</p>
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
              <p className="text-[9px] font-black tracking-[0.16em] text-[#E7BE8E]">{task.title}</p>
              <h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#A36D3D]/20 bg-[#30251D]/70 p-3">
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
                          ? "border-[#E7BE8E]/60 bg-[#A36D3D]/15 text-[#F1EBDD]"
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
                  {isCorrect ? task.explanation : "Coba tinjau kembali informasi festival dan pilih jawaban lain."}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] text-[#817A73]">{isCorrect ? "Situasi selesai" : "Pilih jawaban lalu periksa"}</p>
                <button
                  type="button"
                  disabled={!selected || isCorrect}
                  onClick={() => setSimulationChecked((current) => ({ ...current, [index]: true }))}
                  className="rounded-lg bg-[#A36D3D] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#85562F] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
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
          <button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#A36D3D]/35 px-4 py-2 text-xs font-bold text-[#E7BE8E]">
            <RefreshCw size={13} /> Ulangi simulasi
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7BE8E]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#E7BE8E]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#E7BE8E]/60 bg-[#A36D3D]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#A36D3D]/35 px-4 py-2 text-xs font-bold text-[#E7BE8E]">
              <RefreshCw size={13} /> Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={Object.keys(practiceAnswers).length !== practiceTasks.length}
              className="rounded-lg bg-[#A36D3D] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7BE8E]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#E7BE8E]">SOAL {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#E7BE8E]/60 bg-[#A36D3D]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#A36D3D]/35 px-4 py-2 text-xs font-bold text-[#E7BE8E]">
              <RefreshCw size={13} /> Ulangi kuis
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="rounded-lg bg-[#A36D3D] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa kuis
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#A36D3D]/20 bg-[#30251D]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#E7BE8E]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi target komunikasi</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">
          Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.
        </p>
        <div className="space-y-3">
          {canDos.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E7BE8E]">{item.source}</p>
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
                        ? "border-[#E7BE8E]/50 bg-[#A36D3D]/20 text-[#F8EEDC]"
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
              ? "Lesson 8 selesai. Progres tersimpan."
              : canDosRated
                ? "Semua target komunikasi sudah dinilai."
                : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button
            type="button"
            onClick={finishLesson}
            disabled={!canComplete || isCompleted}
            className="rounded-xl bg-[#A36D3D] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#85562F] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
          >
            {isCompleted ? "Lesson 8 selesai" : "Selesaikan Lesson 8"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Dasar 2 · 08 / 18</span>
      </div>
    </main>
  );
}
