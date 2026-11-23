"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Gift,
  RefreshCw,
  Star,
  Users,
  Sparkles,
} from "lucide-react";
import IrodoriConversation, { type IrodoriUtterance } from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import JapaneseReading from "@/components/JapaneseReading";
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
const lessonId = "elementary2-11";



const shoppingTryOnConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>すみません。このセーター、着てみてもいいですか。</>, romaji: "Sumimasen. Kono seetaa, kite mite mo ii desu ka?", translation: "Permisi, bolehkah saya mencoba sweater ini?", audioFileName: "irodori-elementary2-11-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>はい。試着室はこちらです。</>, romaji: "Hai. Shichakushitsu wa kochira desu.", translation: "Tentu. Ruang pas ada di sini.", audioFileName: "irodori-elementary2-11-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>ありがとうございます。少し大きすぎますね。</>, romaji: "Arigatou gozaimasu. Sukoshi ookisugimasu ne.", translation: "Terima kasih. Sepertinya sedikit terlalu besar.", audioFileName: "irodori-elementary2-11-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>では、もう少し小さいのをお持ちします。</>, romaji: "Dewa, mou sukoshi chiisai no o omochi shimasu.", translation: "Kalau begitu, saya ambilkan yang sedikit lebih kecil.", audioFileName: "irodori-elementary2-11-a01-l04.mp3" },
];

const chooseColorSizeConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>ほかの色もありますか。</>, romaji: "Hoka no iro mo arimasu ka?", translation: "Apakah ada warna lain juga?", audioFileName: "irodori-elementary2-11-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>はい。青とグレーがございます。</>, romaji: "Hai. Ao to guree ga gozaimasu.", translation: "Ada. Tersedia warna biru dan abu-abu.", audioFileName: "irodori-elementary2-11-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>この青いの、見せてもらえますか。</>, romaji: "Kono aoi no, misete moraemasu ka?", translation: "Bolehkah saya melihat yang biru ini?", audioFileName: "irodori-elementary2-11-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>もちろんです。こちらです。お気に入りでしたら、こちらにしますか。</>, romaji: "Mochiron desu. Kochira desu. Oki ni iri deshitara, kochira ni shimasu ka?", translation: "Tentu. Ini barangnya. Kalau cocok, apakah Anda memilih yang ini?", audioFileName: "irodori-elementary2-11-a02-l04.mp3" },
];

const forgotPointCardConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>ポイントカードはお持ちですか。</>, romaji: "Pointo kaado wa omochi desu ka?", translation: "Apakah Anda membawa kartu poin?", audioFileName: "irodori-elementary2-11-a03-l01.mp3" },
  { speakerId: "sota", japanese: <>すみません。ポイントカードを忘れてしまいました。</>, romaji: "Sumimasen. Pointo kaado o wasurete shimaimashita.", translation: "Maaf, saya lupa membawa kartu poin.", audioFileName: "irodori-elementary2-11-a03-l02.mp3" },
  { speakerId: "yui", japanese: <>レシートにスタンプを押しておきますね。</>, romaji: "Reshiito ni sutanpu o oshite okimasu ne.", translation: "Saya akan memberi cap pada struknya, ya.", audioFileName: "irodori-elementary2-11-a03-l03.mp3" },
  { speakerId: "sota", japanese: <>ありがとうございます。次回、カードとレシートを持って来ます。</>, romaji: "Arigatou gozaimasu. Jikai, kaado to reshiito o motte kimasu.", translation: "Terima kasih. Lain kali saya akan membawa kartu dan struknya.", audioFileName: "irodori-elementary2-11-a03-l04.mp3" },
];

const lostBottleConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>すみません。水筒を忘れてしまったんですが、届いていませんか。</>, romaji: "Sumimasen. Suitou o wasurete shimattan desu ga, todoite imasen ka?", translation: "Permisi, saya sepertinya tertinggal botol minum. Apakah ada yang menyerahkannya ke sini?", audioFileName: "irodori-elementary2-11-a04-l01.mp3" },
  { speakerId: "kenji", japanese: <>どんな水筒ですか。特徴を教えてください。</>, romaji: "Donna suitou desu ka? Tokuchou o oshiete kudasai.", translation: "Botol minum seperti apa? Tolong jelaskan ciri-cirinya.", audioFileName: "irodori-elementary2-11-a04-l02.mp3" },
  { speakerId: "akiko", japanese: <>青い水筒で、白い星のシールがついています。</>, romaji: "Aoi suitou de, shiroi hoshi no shiiru ga tsuite imasu.", translation: "Botolnya berwarna biru dan ada stiker bintang putih.", audioFileName: "irodori-elementary2-11-a04-l03.mp3" },
  { speakerId: "kenji", japanese: <>わかりました。お昼ごろ、フードコートにあったかもしれませんね。</>, romaji: "Wakarimashita. Ohiru goro, fuudo kooto ni atta kamo shiremasen ne.", translation: "Baik. Mungkin botol itu ada di area food court sekitar siang tadi.", audioFileName: "irodori-elementary2-11-a04-l04.mp3" },
];

const mallAnnouncementConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>今の店内放送、聞きましたか。</>, romaji: "Ima no tennai housou, kikimashita ka?", translation: "Apakah kamu mendengar pengumuman toko tadi?", audioFileName: "irodori-elementary2-11-a05-l01.mp3" },
  { speakerId: "sota", japanese: <>はい。文具売り場でセールをしているそうです。</>, romaji: "Hai. Bungu uriba de seeru o shite iru sou desu.", translation: "Ya. Katanya sedang ada obral di bagian alat tulis.", audioFileName: "irodori-elementary2-11-a05-l02.mp3" },
  { speakerId: "yui", japanese: <>何階ですか。</>, romaji: "Nankai desu ka?", translation: "Di lantai berapa?", audioFileName: "irodori-elementary2-11-a05-l03.mp3" },
  { speakerId: "sota", japanese: <>一階です。今日から日曜日までだそうですよ。</>, romaji: "Ikkai desu. Kyou kara nichiyoubi made da sou desu yo.", translation: "Di lantai satu. Katanya berlangsung dari hari ini sampai Minggu.", audioFileName: "irodori-elementary2-11-a05-l04.mp3" },
];

const canDos = [
  { id: "shop-for-clothes", source: "CAN-DO 47", text: "Menyampaikan pilihan warna dan ukuran kepada staf toko pakaian, lalu membeli barang yang diinginkan." },
  { id: "explain-shopping-problem", source: "CAN-DO 48", text: "Menyampaikan kepada orang di sekitar ketika mengalami masalah sederhana saat berbelanja." },
  { id: "describe-lost-property", source: "CAN-DO 49", text: "Menjelaskan ciri-ciri barang yang tertinggal serta perkiraan tempat atau waktu barang itu tertinggal." },
  { id: "understand-mall-announcement", source: "CAN-DO 50", text: "Mendengarkan pengumuman di pusat perbelanjaan dan memahami informasi utamanya." },
];

const vocabRows = [
  ["色", "いろ · iro", "Warna"],
  ["赤", "あか · aka", "Merah"],
  ["青", "あお · ao", "Biru"],
  ["緑", "みどり · midori", "Hijau"],
  ["黄色", "きいろ · kiiro", "Kuning"],
  ["黒", "くろ · kuro", "Hitam"],
  ["白", "しろ · shiro", "Putih"],
  ["ベージュ", "ベージュ · beeju", "Beige"],
  ["ピンク", "ピンク · pinku", "Merah muda"],
  ["茶色", "ちゃいろ · chairo", "Cokelat"],
  ["グレー", "グレー · guree", "Abu-abu"],
  ["カーキ", "カーキ · kaaki", "Khaki"],
  ["サイズ", "サイズ · saizu", "Ukuran"],
  ["フリーサイズ", "フリーサイズ · furii saizu", "Ukuran bebas"],
  ["セーター", "セーター · seetaa", "Sweater"],
  ["洋服", "ようふく · youfuku", "Pakaian"],
  ["靴", "くつ · kutsu", "Sepatu"],
  ["試着する", "しちゃくする · shichaku suru", "Mencoba pakaian"],
  ["試着室", "しちゃくしつ · shichakushitsu", "Ruang pas"],
  ["派手", "はで · hade", "Mencolok"],
  ["大きい", "おおきい · ookii", "Besar"],
  ["小さい", "ちいさい · chiisai", "Kecil"],
  ["似合う", "にあう · niau", "Cocok atau terlihat serasi"],
  ["店員", "てんいん · ten'in", "Pegawai toko"],
  ["売り場", "うりば · uriba", "Bagian atau area penjualan"],
  ["全品", "ぜんぴん · zenpin", "Semua barang"],
  ["割引", "わりびき · waribiki", "Diskon"],
  ["会計", "かいけい · kaikei", "Pembayaran atau kasir"],
  ["レシート", "レシート · reshiito", "Struk belanja"],
  ["ポイントカード", "ポイントカード · pointo kaado", "Kartu poin"],
  ["会員証", "かいいんしょう · kaiinshou", "Kartu anggota"],
  ["スタンプ", "スタンプ · sutanpu", "Cap atau stempel"],
  ["次回", "じかい · jikai", "Lain kali"],
  ["忘れる", "わすれる · wasureru", "Lupa"],
  ["忘れ物", "わすれもの · wasuremono", "Barang yang tertinggal"],
  ["落とし物", "おとしもの · otoshimono", "Barang yang terjatuh atau hilang"],
  ["水筒", "すいとう · suitou", "Botol minum"],
  ["特徴", "とくちょう · tokuchou", "Ciri-ciri"],
  ["カバー", "カバー · kabaa", "Pelindung atau cover"],
  ["機種", "きしゅ · kishu", "Jenis atau model perangkat"],
  ["フードコート", "フードコート · fuudo kooto", "Area makan di pusat perbelanjaan"],
  ["広場", "ひろば · hiroba", "Plaza atau area terbuka"],
  ["入口", "いりぐち · iriguchi", "Pintu masuk"],
  ["駐輪場", "ちゅうりんじょう · chuurinjou", "Area parkir sepeda"],
  ["インフォメーション", "インフォメーション · infomeeshon", "Pusat informasi"],
  ["営業時間", "えいぎょうじかん · eigyou jikan", "Jam operasional"],
  ["店内放送", "てんないほうそう · tennai housou", "Pengumuman di dalam toko"],
  ["呼び出す", "よびだす · yobidasu", "Memanggil seseorang"],
  ["延長する", "えんちょうする · enchou suru", "Memperpanjang"],
  ["案内する", "あんないする · annai suru", "Memberi petunjuk atau mengarahkan"],
];

const kanjiWords = [
  ["色", "いろ · iro", "Warna"],
  ["赤", "あか · aka", "Merah"],
  ["青", "あお · ao", "Biru"],
  ["黒", "くろ · kuro", "Hitam"],
  ["白", "しろ · shiro", "Putih"],
  ["女性", "じょせい · josei", "Perempuan"],
  ["男性", "だんせい · dansei", "Laki-laki"],
  ["急に", "きゅうに · kyuu ni", "Tiba-tiba"],
  ["営業する", "えいぎょうする · eigyou suru", "Beroperasi atau buka"],
  ["案内する", "あんないする · annai suru", "Memberi petunjuk atau mengarahkan"],
];

const japaneseAnnualEvents = [
  { title: "試着してみる", date: "お店で", activities: "気になる服を見つけたら、店員さんに試着してもいいか聞いてみます。", translation: "Saat menemukan pakaian yang menarik, tanyakan kepada pegawai apakah boleh mencobanya." },
  { title: "色やサイズを聞く", date: "商品を選ぶとき", activities: "色やサイズを具体的に伝えて、ほかの商品があるか聞きます。", translation: "Sebutkan warna dan ukuran yang dicari, lalu tanyakan apakah ada pilihan lain." },
  { title: "ポイントカードを忘れたとき", date: "お会計で", activities: "店員さんに忘れたことを伝え、レシートや次回の手続きについて確認します。", translation: "Beri tahu pegawai bahwa kartu poin tertinggal dan tanyakan prosedur menggunakan struk untuk kunjungan berikutnya." },
  { title: "落とし物を探すとき", date: "インフォメーションで", activities: "色や形などの特徴と、最後に見た場所や時間を説明します。", translation: "Jelaskan warna, bentuk, serta tempat dan waktu terakhir kali barang terlihat." },
];

const interculturalExamples = [
  { title: "Ukuran pakaian", japanese: "サイズは、国やメーカーによって違います。", meaning: "Label ukuran bisa berbeda menurut negara dan produsen." },
  { title: "Memilih warna", japanese: "ほかの色も見せてもらえますか。", meaning: "Kamu bisa meminta pegawai menunjukkan pilihan warna lain." },
  { title: "Membandingkan barang", japanese: "この青いのと、あの黒いのを比べてみます。", meaning: "Gunakan の untuk menyebut barang tanpa mengulang kata bendanya." },
];

const eventArticle = {
  title: "さくらショッピングセンターからのお知らせ",
  date: "本日から日曜日まで",
  venue: "一階・文具売り場",
  body: "さくらショッピングセンターよりお知らせいたします。ただいま、一階の文具売り場で文房具のセールを行っています。ノートやペンなど、一部の商品が10％引きです。期間は本日から日曜日までです。また、インフォメーションカウンターでは、落とし物のお問い合わせを受け付けています。お心当たりのある方は、一階カウンターまでお越しください。",
  reading: "Sakura shoppingu sentaa yori oshirase itashimasu. Tadaima, ikkai no bungu uriba de bunbougu no seeru o okonatte imasu. Nooto ya pen nado, ichibu no shouhin ga juu paasento biki desu. Kikan wa honjitsu kara nichiyoubi made desu. Mata, infomeeshon kauntaa de wa, otoshimono no otoiawase o uketsukete imasu. O-kokoroatari no aru kata wa, ikkai kauntaa made okoshi kudasai.",
  translation: "Pengumuman dari Sakura Shopping Center. Saat ini ada obral alat tulis di bagian alat tulis lantai satu. Beberapa barang, seperti buku catatan dan pulpen, mendapat diskon 10%. Periode berlangsung dari hari ini sampai Minggu. Pusat informasi juga menerima pertanyaan tentang barang tertinggal. Orang yang merasa memiliki barang tersebut dipersilakan datang ke konter lantai satu.",
};

const mannersPhraseExamples = [
  { label: "Meminta izin mencoba pakaian", japanese: "このセーター、着てみてもいいですか。", meaning: "Bolehkah saya mencoba sweater ini?" },
  { label: "Meminta ukuran lain", japanese: "もう少し大きいの、ありますか。", meaning: "Apakah ada yang sedikit lebih besar?" },
  { label: "Memberi tahu kartu poin tertinggal", japanese: "ポイントカードを忘れてしまいました。", meaning: "Saya lupa membawa kartu poin." },
];

const grammarNotes = [
  { title: "01 · Meminta izin untuk mencoba sesuatu", pattern: "V-てみてもいいですか？", example: <>このセーター、着てみてもいいですか。<br />このペン、使ってみてもいいですか。</>, note: "Gunakan pola ini untuk meminta izin mencoba sesuatu. Gabungkan bentuk て dari kata kerja dengan みてもいいですか. Contoh: 着る → 着てみてもいいですか、使う → 使ってみてもいいですか." },
  { title: "02 · Menyatakan sesuatu terlalu ...", pattern: "イ形容詞 (hapus い) + すぎます\nナ形容詞 (hapus な) + すぎます", example: <>この服は大きすぎます。<br />この色は派手すぎます。</>, note: "～すぎます berarti terlalu atau melebihi tingkat yang diinginkan. Untuk イ形容詞, hapus い: 大きい → 大きすぎます. Untuk ナ形容詞, hapus な: 派手な → 派手すぎます." },
  { title: "03 · Menggantikan kata benda dengan の", pattern: "ナ形容詞-な／イ形容詞-い + の", example: <>もう少し小さいの、ありますか。<br />きれいなのを見せてください。</>, note: "の menggantikan kata benda yang sudah diketahui dari konteks. 小さいの berarti barang yang kecil; きれいなの berarti barang yang bagus atau cantik." },
  { title: "04 · Bentuk pasif yang menunjukkan pihak yang terdampak", pattern: "Orang は／が + N を + V-(ら)れます", example: <>私は弟にノートを使われました。<br />私は友だちに水筒を使われました。</>, note: "Bentuk pasif ini dapat digunakan saat barang milik seseorang digunakan orang lain dan pembicara merasa terdampak. Fokus kalimat berada pada orang yang mengalami situasi itu. Contoh: 使う → 使われる." },
  { title: "05 · Menyatakan kemungkinan", pattern: "Kalimat bentuk biasa + かもしれません", example: <>水筒をフードコートに忘れたかもしれません。<br />今日は店が休みかもしれません。</>, note: "Gunakan かもしれません saat sesuatu mungkin terjadi, tetapi pembicara belum yakin. Kata benda dan ナ形容詞 tidak memakai だ sebelum かもしれません: 休みかもしれません." },
  { title: "06 · Menyatakan penyesalan atau kejadian yang tidak diharapkan", pattern: "V-てしまいました\nBentuk percakapan: V-ちゃいました／V-ちゃった", example: <>ポイントカードを忘れてしまいました。<br />水筒をなくしちゃいました。</>, note: "Pola ini digunakan saat pembicara menyesali sesuatu atau merasa sayang terhadap kejadian yang sudah terjadi. Dalam percakapan santai, ～てしまいました dapat berubah menjadi ～ちゃいました atau ～ちゃった." },
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
    title: "01 · Mencoba sweater",
    heading: "Meminta izin kepada pegawai toko",
    prompt: "Kamu ingin mencoba sweater sebelum memilihnya. Kalimat mana yang tepat untuk meminta izin?",
    japanese: <>このセーター、着てみてもいいですか。</>,
    translation: "Bolehkah saya mencoba sweater ini?",
    options: [
      { key: "a", label: "このセーター、着てみてもいいですか。", meaning: "V-てみてもいいですか digunakan untuk meminta izin mencoba sesuatu." },
      { key: "b", label: "このセーター、着すぎますか。", meaning: "Kalimat ini tidak tepat untuk meminta izin mencoba pakaian." },
      { key: "c", label: "このセーター、着てしまいました。", meaning: "Kalimat ini menyatakan sesuatu sudah terlanjur dilakukan." },
    ],
    answer: "a",
    explanation: "Bentuk て + みてもいいですか digunakan saat meminta izin mencoba barang.",
  },
  {
    title: "02 · Meminta ukuran lain",
    heading: "Menjelaskan ukuran yang kurang sesuai",
    prompt: "Pakaian yang kamu coba terasa terlalu besar. Pilih kalimat yang sesuai.",
    japanese: <>この服は大きすぎます。もう少し小さいの、ありますか。</>,
    translation: "Pakaian ini terlalu besar. Apakah ada yang sedikit lebih kecil?",
    options: [
      { key: "a", label: "この服は大きいすぎます。", meaning: "Untuk イ形容詞, hapus い sebelum menambahkan すぎます." },
      { key: "b", label: "この服は大きすぎます。", meaning: "大きい berubah menjadi 大きすぎます." },
      { key: "c", label: "この服は大きなすぎます。", meaning: "Bentuk ini tidak sesuai untuk イ形容詞." },
    ],
    answer: "b",
    explanation: "大きい → 大きすぎます. Setelah itu, の menggantikan kata benda pada 小さいの.",
  },
  {
    title: "03 · Kartu poin tertinggal",
    heading: "Menjelaskan masalah saat pembayaran",
    prompt: "Pegawai menanyakan kartu poin. Kamu lupa membawanya. Apa yang sebaiknya kamu katakan?",
    japanese: <>ポイントカードを忘れてしまいました。</>,
    translation: "Saya lupa membawa kartu poin.",
    options: [
      { key: "a", label: "ポイントカードを忘れてしまいました。", meaning: "V-てしまいました menyampaikan kejadian yang disesali." },
      { key: "b", label: "ポイントカードを持ってみてもいいですか。", meaning: "Kalimat ini meminta izin mencoba membawa kartu." },
      { key: "c", label: "ポイントカードが大きすぎます。", meaning: "Kalimat ini berarti kartu terlalu besar." },
    ],
    answer: "a",
    explanation: "Setelah menjelaskan masalah, tanyakan apakah struk dapat digunakan pada kunjungan berikutnya.",
  },
  {
    title: "04 · Menjelaskan barang tertinggal",
    heading: "Memberi informasi kepada pusat informasi",
    prompt: "Botol minummu tertinggal. Kamu ingat mungkin meninggalkannya di food court. Pilih kalimat yang menunjukkan perkiraan.",
    japanese: <>フードコートに忘れたかもしれません。</>,
    translation: "Mungkin saya meninggalkannya di food court.",
    options: [
      { key: "a", label: "フードコートに忘れました。", meaning: "Kalimat ini menyampaikan kepastian, bukan perkiraan." },
      { key: "b", label: "フードコートに忘れたかもしれません。", meaning: "Bentuk biasa + かもしれません menyatakan kemungkinan." },
      { key: "c", label: "フードコートに忘れてみてもいいですか。", meaning: "Kalimat ini tidak tepat untuk menjelaskan barang tertinggal." },
    ],
    answer: "b",
    explanation: "Sebutkan juga warna, bentuk, stiker, dan tempat terakhir kali barang terlihat.",
  },
  {
    title: "05 · Memahami pengumuman toko",
    heading: "Mencari informasi utama dari pengumuman",
    prompt: "Kamu mendengar pengumuman: 「一階の文具売り場でセールを行っています。」 Informasi apa yang disampaikan?",
    japanese: <>一階の文具売り場でセールを行っています。</>,
    translation: "Sedang ada obral di bagian alat tulis lantai satu.",
    options: [
      { key: "a", label: "Ada obral di bagian alat tulis lantai satu.", meaning: "一階 berarti lantai satu, 文具売り場 berarti bagian alat tulis, dan セール berarti obral." },
      { key: "b", label: "Toko akan tutup sepanjang hari.", meaning: "Pengumuman tidak menyampaikan bahwa toko tutup." },
      { key: "c", label: "Ada kelas bahasa di lantai dua.", meaning: "Tidak ada informasi tentang kelas bahasa." },
    ],
    answer: "a",
    explanation: "Saat mendengarkan pengumuman, tangkap kata kunci tempat, barang, waktu, dan tindakan yang diminta.",
  },
];

const practiceTasks: Task[] = [
  { prompt: <>Lengkapi pola untuk meminta izin mencoba pakaian: 「着て＿＿＿もいいですか。」</>, options: [{ key: "a", label: "みて" }, { key: "b", label: "すぎて" }, { key: "c", label: "しまって" }], answer: "a", explanation: <>Pola lengkapnya adalah V-てみてもいいですか.</> },
  { prompt: <>Pilih bentuk yang benar dari 「大きい」 + すぎます.</>, options: [{ key: "a", label: "大きいすぎます" }, { key: "b", label: "大きすぎます" }, { key: "c", label: "大きなすぎます" }], answer: "b", explanation: <>Untuk イ形容詞, hapus い sebelum menambahkan すぎます.</> },
  { prompt: <>Apa arti 「もう少し小さいの、ありますか」?</>, options: [{ key: "a", label: "Apakah ada yang sedikit lebih kecil?" }, { key: "b", label: "Apakah ada yang sedikit lebih mahal?" }, { key: "c", label: "Apakah ada warna yang lebih gelap?" }], answer: "a", explanation: <>小さいの berarti barang yang lebih kecil; の menggantikan kata benda yang sudah diketahui.</> },
  { prompt: <>Lengkapi kalimat kemungkinan: 「水筒を家に忘れた＿＿＿しれません。」</>, options: [{ key: "a", label: "て" }, { key: "b", label: "かもしれ" }, { key: "c", label: "すぎ" }], answer: "b", explanation: <>Bentuk lengkapnya adalah 忘れたかもしれません, yang berarti mungkin tertinggal.</> },
  { prompt: <>Apa makna 「ポイントカードを忘れてしまいました」?</>, options: [{ key: "a", label: "Saya akan membawa kartu poin." }, { key: "b", label: "Saya lupa membawa kartu poin." }, { key: "c", label: "Saya sedang mencari kartu poin." }], answer: "b", explanation: <>V-てしまいました dapat menunjukkan penyesalan atas sesuatu yang terjadi.</> },
  { prompt: <>Kalimat 「私は弟にノートを使われました」 menggunakan bentuk apa?</>, options: [{ key: "a", label: "Bentuk pasif yang menunjukkan pihak terdampak." }, { key: "b", label: "Bentuk izin." }, { key: "c", label: "Bentuk perbandingan." }], answer: "a", explanation: <>使われました adalah bentuk pasif dari 使う. Kalimat menyoroti orang yang terdampak.</> },
];

const quizQuestions: Task[] = [
  { prompt: <>Apa arti 「試着室」?</>, options: [{ key: "a", label: "Ruang pas." }, { key: "b", label: "Ruang makan." }, { key: "c", label: "Pusat informasi." }], answer: "a", explanation: <>試着室 adalah ruang untuk mencoba pakaian.</> },
  { prompt: <>Apa fungsi 「着てみてもいいですか」?</>, options: [{ key: "a", label: "Meminta izin untuk mencoba memakai sesuatu." }, { key: "b", label: "Menyatakan pakaian terlalu besar." }, { key: "c", label: "Menjelaskan barang tertinggal." }], answer: "a", explanation: <>V-てみてもいいですか digunakan untuk meminta izin mencoba sesuatu.</> },
  { prompt: <>Pilih bentuk yang benar dari 「派手な」 + すぎます.</>, options: [{ key: "a", label: "派手なすぎます" }, { key: "b", label: "派手すぎます" }, { key: "c", label: "派手いすぎます" }], answer: "b", explanation: <>Untuk ナ形容詞, hapus な sebelum menambahkan すぎます.</> },
  { prompt: <>Dalam 「赤いのがいいです」, apa fungsi の?</>, options: [{ key: "a", label: "Menggantikan kata benda yang sudah diketahui." }, { key: "b", label: "Menandai waktu lampau." }, { key: "c", label: "Menyatakan kemungkinan." }], answer: "a", explanation: <>赤いの berarti barang yang berwarna merah.</> },
  { prompt: <>Apa arti 「次回」?</>, options: [{ key: "a", label: "Kemarin." }, { key: "b", label: "Lain kali." }, { key: "c", label: "Setiap hari." }], answer: "b", explanation: <>次回 berarti kesempatan atau kunjungan berikutnya.</> },
  { prompt: <>Kalimat 「私は友だちに水筒を使われました」 memakai bentuk apa?</>, options: [{ key: "a", label: "Bentuk pasif yang menunjukkan pihak terdampak." }, { key: "b", label: "Bentuk potensial." }, { key: "c", label: "Bentuk larangan." }], answer: "a", explanation: <>使われました adalah bentuk pasif dari 使う.</> },
  { prompt: <>Apa arti 「フードコートに忘れたかもしれません」?</>, options: [{ key: "a", label: "Pasti saya tidak meninggalkannya di food court." }, { key: "b", label: "Mungkin saya meninggalkannya di food court." }, { key: "c", label: "Saya ingin pergi ke food court." }], answer: "b", explanation: <>Bentuk biasa + かもしれません menyatakan kemungkinan yang belum pasti.</> },
  { prompt: <>Apa fungsi 「忘れてしまいました」?</>, options: [{ key: "a", label: "Menunjukkan penyesalan atas sesuatu yang terjadi." }, { key: "b", label: "Meminta izin untuk mencoba." }, { key: "c", label: "Menyatakan ukuran barang." }], answer: "a", explanation: <>V-てしまいました dapat menyampaikan rasa menyesal atau kecewa.</> },
  { prompt: <>Apa arti 「営業時間」?</>, options: [{ key: "a", label: "Jam operasional." }, { key: "b", label: "Kartu poin." }, { key: "c", label: "Ruang pas." }], answer: "a", explanation: <>営業時間 berarti jam saat toko atau tempat usaha beroperasi.</> },
  { prompt: <>Jika pengumuman menyebut 「一階のインフォメーションカウンター」, ke mana kita harus pergi?</>, options: [{ key: "a", label: "Konter informasi lantai satu." }, { key: "b", label: "Area parkir lantai tiga." }, { key: "c", label: "Ruang pas di lantai dua." }], answer: "a", explanation: <>一階 berarti lantai satu dan インフォメーションカウンター berarti konter informasi.</> },
];

export default function IrodoriElementaryTwoLessonElevenPage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [lostItemDraft, setLostItemDraft] = useState("");

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
      <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#D79C72]/40 hover:text-[#EAE6DD]">
        <ArrowLeft size={15} /> Kembali ke Elementary 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#486C91]/35 bg-gradient-to-br from-[#20364C] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#A9C9E8]/[0.08]">買</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#A9C9E8]">IRODORI • ELEMENTARY 2 A2 • LESSON 11</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya lupa membawa kartu poin.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9C9E8]">ポイントカードを忘れてしまいました。</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar berbelanja pakaian, menjelaskan masalah sederhana, mencari barang tertinggal, dan memahami pengumuman pusat perbelanjaan.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><CalendarDays size={14} className="text-[#A9C9E8]" />Belanja dengan baik</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9C9E8]" />Toko dan pusat informasi</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Gift size={14} className="text-[#A9C9E8]" />Kartu poin dan pengumuman</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#486C91]/20 bg-[#1D2A37]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A9C9E8]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target berikut sesuai Can-do 47–50 pada Irodori Elementary 2 Lesson 11.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9C9E8]">{item.source} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#486C91]/20 bg-[#1B2632] p-4 md:p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#A9C9E8]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Catatan budaya: ukuran dan layanan toko</h2>
        </div>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Label ukuran pakaian dapat berbeda menurut negara dan produsen. Saat berbelanja, periksa tabel ukuran dari merek tersebut atau tanyakan kepada pegawai. Memilih pakaian yang nyaman dan sesuai kebutuhan lebih penting daripada membandingkan ukuran antarorang.</p>
        <p className="mt-2 text-[10px] leading-5 text-[#887F74]">Kartu poin juga memiliki aturan berbeda menurut toko. Periksa syarat penggunaan dan simpan struk sampai transaksi selesai.</p>
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Berbelanja, menyampaikan masalah, dan mencari informasi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Seluruh percakapan dibuat orisinal oleh Fude berdasarkan target komunikasi lesson ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Meminta izin mencoba sweater" speakers={[friendYui, friendSota]} utterances={shoppingTryOnConversation} />
          <IrodoriConversation title="Memilih warna dan ukuran" speakers={[friendAkiko, friendKenji]} utterances={chooseColorSizeConversation} />
          <IrodoriConversation title="Menjelaskan kartu poin tertinggal" speakers={[friendSota, friendYui]} utterances={forgotPointCardConversation} />
          <IrodoriConversation title="Mencari botol minum yang tertinggal" speakers={[friendAkiko, friendKenji]} utterances={lostBottleConversation} />
          <IrodoriConversation title="Memahami pengumuman pusat perbelanjaan" speakers={[friendYui, friendSota]} utterances={mallAnnouncementConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">SITUASI BERBELANJA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Ungkapan dan tindakan di toko</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Contoh situasi sederhana untuk bertanya, memilih, dan meminta bantuan saat berbelanja.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {japaneseAnnualEvents.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#486C91]/20 bg-[#1B2632] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mincho text-base font-bold text-[#F1EBDD]">{item.title}</h3>
                <span className="rounded-lg bg-[#486C91]/15 px-2.5 py-1 text-[10px] font-semibold text-[#A9C9E8]">{item.date}</span>
              </div>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.activities}</p>
              <p className="mt-1 text-xs leading-5 text-[#A9A398]">{item.translation}</p>
            </article>
          ))}
        </div>
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">TIPS BERBELANJA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Memilih barang dan memeriksa informasi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan ungkapan berikut untuk meminta bantuan dan memahami pilihan produk.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {interculturalExamples.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#486C91]/20 bg-[#1B2632] p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[#F1EBDD]">{item.title}</h3>
                <Star size={18} className="shrink-0 text-[#A9C9E8]" />
              </div>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.japanese}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">MENDENGARKAN PENGUMUMAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pengumuman dari pusat perbelanjaan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Teks pengumuman ini fiktif dan dibuat sebagai latihan. Perhatikan tempat, barang, periode, dan tujuan pengumuman.</p>
        </div>
        <article className="rounded-2xl border border-[#486C91]/25 bg-[#1B2632] p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#486C91]/30 pb-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9C9E8]">SHOPPING CENTER ANNOUNCEMENT</p>
              <h3 className="mt-1 text-sm font-bold text-[#F1EBDD]">{eventArticle.title}</h3>
            </div>
            <FileText size={21} className="text-[#A9C9E8]" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-black/15 px-3 py-2 text-[10px] text-[#C9C3B8]">期間 · {eventArticle.date}</span>
            <span className="rounded-lg bg-black/15 px-3 py-2 text-[10px] text-[#C9C3B8]">場所 · {eventArticle.venue}</span>
          </div>
          <p className="mt-3 font-mincho text-sm leading-8 text-[#F1EBDD]">{eventArticle.body}</p>
          <p className="mt-3 border-t border-white/[0.07] pt-3 text-[10px] leading-6 text-[#A9C9E8]">{eventArticle.reading}</p>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">{eventArticle.translation}</p>
        </article>
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">UNGKAPAN SAAT BERBELANJA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Contoh kalimat kepada pegawai toko</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan bentuk sopan saat bertanya atau menjelaskan sesuatu kepada pegawai toko.</p>
        </div>
        <div className="space-y-2">
          {mannersPhraseExamples.map((item) => (
            <article key={item.label} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9C9E8]">{item.label}</p>
              <p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.japanese}</p>
              <p className="mt-1 text-xs text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      
      <section className="space-y-4 rounded-2xl border border-[#486C91]/20 bg-[#1D2A37]/60 p-4 md:p-5">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">LATIHAN MENULIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Jelaskan barang yang tertinggal</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Bayangkan kamu melapor ke pusat informasi. Tulis 2–4 kalimat yang menjelaskan jenis barang, warna atau cirinya, serta tempat dan waktu terakhir kali kamu melihatnya.</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
          <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">青い水筒です。白い星のシールがついています。お昼ごろ、フードコートに置いたかもしれません。</p>
          <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">Botol minumnya berwarna biru. Ada stiker bintang putih. Mungkin saya meletakkannya di food court sekitar siang tadi.</p>
        </div>
        <label htmlFor="lost-item-description-draft" className="block text-xs font-semibold text-[#A9C9E8]">Tulis penjelasan dalam bahasa Jepang</label>
        <textarea
          id="lost-item-description-draft"
          value={lostItemDraft}
          onChange={(event) => setLostItemDraft(event.target.value)}
          rows={4}
          placeholder="黒いかばんです。..."
          className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#A9C9E8]/50"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] text-[#817A73]">Draf hanya digunakan untuk latihan di halaman ini.</p>
          <span className="text-[10px] tabular-nums text-[#A9C9E8]">{lostItemDraft.length} karakter</span>
        </div>
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">KOSAKATA BELANJA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Warna, ukuran, pembayaran, dan informasi toko</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata yang sering digunakan saat memilih barang, membayar, dan mencari barang tertinggal.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <p className="font-mincho text-base text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#A9C9E8]">{reading}</p>
              <p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">KANJI UTAMA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sepuluh kata kanji pada materi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenali sepuluh kata kanji pada materi Lesson 11.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-[#486C91]/20 bg-[#1B2632] p-3">
              <p className="font-mincho text-lg font-bold text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#A9C9E8]">{reading}</p>
              <p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">POLA TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Enam pola untuk berbelanja dan menjelaskan masalah</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari cara meminta izin mencoba barang, menyatakan ukuran yang terlalu besar atau kecil, menggantikan kata benda, dan menjelaskan kejadian yang belum pasti atau disesali.</p>
        </div>
        {grammarNotes.map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#A9C9E8]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#A9C9E8]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">SIMULASI SITUASI</p>
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
              <p className="text-[9px] font-black tracking-[0.16em] text-[#A9C9E8]">{task.title}</p>
              <h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#486C91]/20 bg-[#1D2A37]/70 p-3">
                <p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{task.japanese}</JapaneseReading></p>
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
                          ? "border-[#A9C9E8]/60 bg-[#486C91]/15 text-[#F1EBDD]"
                          : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                    )}
                  >
                    <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
                  </button>
                ))}
              </div>
              {(isCorrect || isWrong) && (
                <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                  <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>
                    {isCorrect ? "Benar. " : "Belum tepat. "}
                  </span>
                  {isCorrect ? task.explanation : "Coba tinjau kembali informasi dan pilih jawaban lain."}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] text-[#817A73]">{isCorrect ? "Situasi selesai" : "Pilih jawaban lalu periksa"}</p>
                <button
                  type="button"
                  disabled={!selected || isCorrect}
                  onClick={() => setSimulationChecked((current) => ({ ...current, [index]: true }))}
                  className="rounded-lg bg-[#486C91] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#3A5C7A] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
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
          <button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#486C91]/35 px-4 py-2 text-xs font-bold text-[#A9C9E8]">
            <RefreshCw size={13} /> Ulangi simulasi
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#A9C9E8]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#A9C9E8]/60 bg-[#486C91]/15 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {practiceSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>
                      {isCorrect ? "Benar. " : "Belum tepat. "}
                    </span>
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
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#486C91]/35 px-4 py-2 text-xs font-bold text-[#A9C9E8]">
              <RefreshCw size={13} /> Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={Object.keys(practiceAnswers).length !== practiceTasks.length}
              className="rounded-lg bg-[#486C91] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#A9C9E8]">SOAL {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#A9C9E8]/60 bg-[#486C91]/15 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>
                      {isCorrect ? "Benar. " : "Belum tepat. "}
                    </span>
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
              ? "Nilai kuis: " + quizScore + " dari " + quizQuestions.length + " benar."
              : Object.keys(answers).length + " dari " + quizQuestions.length + " pertanyaan dijawab."}
          </p>
          {quizSubmitted ? (
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#486C91]/35 px-4 py-2 text-xs font-bold text-[#A9C9E8]">
              <RefreshCw size={13} /> Ulangi kuis
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="rounded-lg bg-[#486C91] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa kuis
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#486C91]/20 bg-[#1D2A37]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#A9C9E8]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi Can-do</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">
          Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.
        </p>
        <div className="space-y-3">
          {canDos.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9C9E8]">{item.source}</p>
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
                        ? "border-[#A9C9E8]/50 bg-[#486C91]/20 text-[#F8EEDC]"
                        : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                    )}
                  >
                    <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
          <p className="text-xs text-[#A9A398]">
            {isCompleted
              ? "Lesson 11 selesai. Progres tersimpan."
              : canDosRated
                ? "Semua target Can-do sudah dinilai."
                : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button
            type="button"
            onClick={finishLesson}
            disabled={!canComplete || isCompleted}
            className="rounded-xl bg-[#486C91] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#3A5C7A] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
          >
            {isCompleted ? "Lesson 11 selesai" : "Selesaikan Lesson 11"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Elementary 2 · 11 / 18</span>
      </div>
    </main>
  );
}
