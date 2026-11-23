"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  PhoneCall,
  Receipt,
  RefreshCw,
  Utensils,
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
const lessonId = "elementary2-03";

const explainFoodConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>このチキン定食、おいしそうですね。食べますか。</>,
    romaji: "Kono chikin teishoku, oishisou desu ne. Tabemasu ka?",
    translation: "Set menu ayam ini kelihatannya enak. Mau makan?",
    audioFileName: "irodori-elementary2-03-a01-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>すみません。私はエビのアレルギーがあるので、食べられないんです。</>,
    romaji: "Sumimasen. Watashi wa ebi no arerugii ga aru node, taberarenai n desu.",
    translation: "Maaf. Saya punya alergi udang, jadi tidak bisa memakannya.",
    audioFileName: "irodori-elementary2-03-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>そうなんですね。ほかの料理はだいじょうぶですか。</>,
    romaji: "Sou nan desu ne. Hoka no ryouri wa daijoubu desu ka?",
    translation: "Begitu, ya. Apakah hidangan lainnya tidak masalah?",
    audioFileName: "irodori-elementary2-03-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。エビが入っていないものを選びます。</>,
    romaji: "Hai. Ebi ga haitte inai mono o erabimasu.",
    translation: "Ya. Saya akan memilih hidangan yang tidak mengandung udang.",
    audioFileName: "irodori-elementary2-03-a01-l04.mp3",
  },
];

const confirmIngredientsConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>すみません。このカレーに卵は入っていますか。</>,
    romaji: "Sumimasen. Kono karee ni tamago wa haitte imasu ka?",
    translation: "Permisi. Apakah kari ini mengandung telur?",
    audioFileName: "irodori-elementary2-03-a02-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい、上に目玉焼きがのっています。</>,
    romaji: "Hai, ue ni medamayaki ga notte imasu.",
    translation: "Ya, ada telur mata sapi di atasnya.",
    audioFileName: "irodori-elementary2-03-a02-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>そうですか。卵のアレルギーがあるので、卵抜きにできますか。</>,
    romaji: "Sou desu ka. Tamago no arerugii ga aru node, tamago o nuki ni dekimasu ka?",
    translation: "Begitu, ya. Karena saya alergi telur, apakah telurnya bisa dihilangkan?",
    audioFileName: "irodori-elementary2-03-a02-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>確認します。少々お待ちください。</>,
    romaji: "Kakunin shimasu. Shoushou omachi kudasai.",
    translation: "Saya periksa dulu. Mohon tunggu sebentar.",
    audioFileName: "irodori-elementary2-03-a02-l04.mp3",
  },
];

const restaurantOrderConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>いらっしゃいませ。テーブルとカウンターがございます。</>,
    romaji: "Irasshaimase. Teeburu to kauntaa ga gozaimasu.",
    translation: "Selamat datang. Kami menyediakan tempat duduk meja dan konter.",
    audioFileName: "irodori-elementary2-03-a03-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>テーブルでお願いします。</>,
    romaji: "Teeburu de onegaishimasu.",
    translation: "Saya pilih tempat duduk meja.",
    audioFileName: "irodori-elementary2-03-a03-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ご注文はお決まりですか。</>,
    romaji: "Gochuumon wa okimari desu ka?",
    translation: "Apakah pesanannya sudah diputuskan?",
    audioFileName: "irodori-elementary2-03-a03-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>人気があるのは、チキン定食ですか。</>,
    romaji: "Ninki ga aru no wa, chikin teishoku desu ka?",
    translation: "Apakah menu yang populer adalah set menu ayam?",
    audioFileName: "irodori-elementary2-03-a03-l04.mp3",
  },
];

const phoneReservationConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>あのう、予約をしたいんですけど。</>,
    romaji: "Anou, yoyaku o shitai n desu kedo.",
    translation: "Permisi, saya ingin membuat reservasi.",
    audioFileName: "irodori-elementary2-03-a04-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>ありがとうございます。お日にちは、お決まりですか。</>,
    romaji: "Arigatou gozaimasu. Ohinichi wa, okimari desu ka?",
    translation: "Terima kasih. Apakah tanggalnya sudah ditentukan?",
    audioFileName: "irodori-elementary2-03-a04-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>来週の土曜日です。4人で、午後6時はだいじょうぶですか。</>,
    romaji: "Raishuu no doyoubi desu. Yonin de, gogo rokuji wa daijoubu desu ka?",
    translation: "Sabtu minggu depan. Untuk empat orang, apakah pukul enam sore bisa?",
    audioFileName: "irodori-elementary2-03-a04-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい。お名前をお願いします。</>,
    romaji: "Hai. Onamae o onegaishimasu.",
    translation: "Baik. Mohon sebutkan nama Anda.",
    audioFileName: "irodori-elementary2-03-a04-l04.mp3",
  },
];

const couponConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>このクーポンは、いつ見せますか。</>,
    romaji: "Kono kuupon wa, itsu misemasu ka?",
    translation: "Kupon ini ditunjukkan kapan?",
    audioFileName: "irodori-elementary2-03-a05-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>会計のときに見せてください。</>,
    romaji: "Kaikei no toki ni misete kudasai.",
    translation: "Silakan tunjukkan saat pembayaran.",
    audioFileName: "irodori-elementary2-03-a05-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>有効期限は、いつまでですか。</>,
    romaji: "Yuukoukigen wa, itsu made desu ka?",
    translation: "Sampai kapan masa berlakunya?",
    audioFileName: "irodori-elementary2-03-a05-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>6月30日までです。1グループ1回使えます。</>,
    romaji: "Rokugatsu sanjuunichi made desu. Ichi guruupu ikkai tsukaemasu.",
    translation: "Sampai 30 Juni. Bisa digunakan satu kali untuk setiap kelompok.",
    audioFileName: "irodori-elementary2-03-a05-l04.mp3",
  },
];

const canDos = [
  {
    id: "read-restaurant-menu",
    source: "CAN-DO 09",
    text: "Membaca menu dan memahami nama hidangan, harga, serta informasi layanan yang tersedia.",
  },
  {
    id: "explain-food-restriction",
    source: "CAN-DO 10",
    text: "Memberi tahu teman makan atau staf restoran tentang makanan yang tidak bisa dimakan dan alasannya.",
  },
  {
    id: "request-seating-and-order",
    source: "CAN-DO 11",
    text: "Menyampaikan pilihan tempat duduk, menu, dan permintaan sederhana kepada staf restoran.",
  },
  {
    id: "make-phone-reservation",
    source: "CAN-DO 12",
    text: "Membuat reservasi restoran melalui telepon dengan menyebutkan tanggal, jumlah orang, waktu, dan nama.",
  },
  {
    id: "understand-restaurant-coupon",
    source: "CAN-DO 13",
    text: "Membaca kupon restoran dan menemukan informasi penting seperti potongan harga, cara penggunaan, dan masa berlaku.",
  },
];

const vocabRows = [
  ["アレルギー", "アレルギー · arerugii", "Alergi"],
  ["食べられない", "たべられない · taberarenai", "Tidak bisa makan"],
  ["苦手", "にがて · nigate", "Kurang suka atau tidak mahir"],
  ["注文", "ちゅうもん · chuumon", "Pesanan"],
  ["注文する", "ちゅうもんする · chuumon suru", "Memesan"],
  ["定食", "ていしょく · teishoku", "Menu paket"],
  ["料理", "りょうり · ryouri", "Masakan atau hidangan"],
  ["値段", "ねだん · nedan", "Harga"],
  ["料金", "りょうきん · ryoukin", "Biaya"],
  ["ご飯", "ごはん · gohan", "Nasi atau makanan"],
  ["牛乳", "ぎゅうにゅう · gyuunyuu", "Susu"],
  ["卵", "たまご · tamago", "Telur"],
  ["エビ", "エビ · ebi", "Udang"],
  ["ナッツ", "ナッツ · nattsu", "Kacang-kacangan"],
  ["小麦", "こむぎ · komugi", "Gandum"],
  ["材料", "ざいりょう · zairyou", "Bahan"],
  ["入る", "はいる · hairu", "Masuk atau terkandung"],
  ["抜き", "ぬき · nuki", "Tanpa atau tidak memakai"],
  ["予約", "よやく · yoyaku", "Reservasi"],
  ["人数", "にんずう · ninzuu", "Jumlah orang"],
  ["日にち", "ひにち · hinichi", "Tanggal"],
  ["電話番号", "でんわばんごう · denwa bangou", "Nomor telepon"],
  ["何名様", "なんめいさま · nanmeisama", "Berapa orang? (sopan)"],
  ["会計", "かいけい · kaikei", "Pembayaran"],
  ["別々", "べつべつ · betsubetsu", "Terpisah"],
  ["店員", "てんいん · tenin", "Pegawai toko atau restoran"],
  ["おすすめ", "おすすめ · osusume", "Rekomendasi"],
  ["人気", "にんき · ninki", "Populer"],
  ["座席", "ざせき · zaseki", "Tempat duduk"],
  ["テーブル", "テーブル · teeburu", "Meja"],
  ["カウンター", "カウンター · kauntaa", "Konter"],
  ["座敷", "ざしき · zashiki", "Tempat duduk lesehan bergaya Jepang"],
  ["大盛り", "おおもり · oomori", "Porsi besar"],
  ["普通", "ふつう · futsuu", "Biasa atau normal"],
  ["少なめ", "すくなめ · sukuname", "Sedikit lebih sedikit"],
  ["おかわり", "おかわり · okawari", "Tambah porsi"],
  ["自由", "じゆう · jiyuu", "Bebas"],
  ["クーポン", "クーポン · kuupon", "Kupon"],
  ["半額", "はんがく · hangaku", "Setengah harga"],
  ["割引", "わりびき · waribiki", "Potongan harga"],
  ["有効期限", "ゆうこうきげん · yuukoukigen", "Masa berlaku"],
  ["次回", "じかい · jikai", "Kesempatan berikutnya"],
  ["提示する", "ていじする · teiji suru", "Menunjukkan atau memperlihatkan"],
  ["確認する", "かくにんする · kakunin suru", "Memeriksa atau memastikan"],
  ["水", "みず · mizu", "Air"],
  ["ジュース", "ジュース · juusu", "Jus"],
];

const kanjiWords = [
  ["注文", "ちゅうもん · chuumon", "Pesanan"],
  ["会計", "かいけい · kaikei", "Pembayaran"],
  ["予約", "よやく · yoyaku", "Reservasi"],
  ["電話番号", "でんわばんごう · denwa bangou", "Nomor telepon"],
  ["～様", "～さま · ~sama", "Sapaan hormat untuk nama seseorang"],
  ["ご飯", "ごはん · gohan", "Nasi atau makanan"],
  ["牛乳", "ぎゅうにゅう · gyuunyuu", "Susu"],
  ["生", "なま · nama", "Mentah atau tidak dimasak"],
  ["自由", "じゆう · jiyuu", "Bebas"],
  ["有効期限", "ゆうこうきげん · yuukoukigen", "Masa berlaku"],
];

const menuItems = [
  { name: "チキン定食", reading: "Chikin teishoku", meaning: "Set menu ayam", price: 780, note: "Termasuk nasi dan sup" },
  { name: "焼き魚定食", reading: "Yakizakana teishoku", meaning: "Set menu ikan panggang", price: 850, note: "Jenis ikan tersedia hari itu" },
  { name: "野菜カレー", reading: "Yasai karee", meaning: "Kari sayuran", price: 680, note: "Disajikan dengan nasi" },
  { name: "ハンバーグ定食", reading: "Hanbaagu teishoku", meaning: "Set menu hamburger steak", price: 820, note: "Termasuk nasi dan sup" },
  { name: "野菜うどん", reading: "Yasai udon", meaning: "Udon sayuran", price: 620, note: "Kuah sayuran" },
];

const menuServices = [
  "Set menu termasuk nasi dan sup.",
  "Tambah nasi besar: +50 yen.",
  "Porsi nasi normal atau sedikit tersedia.",
  "Air putih tersedia tanpa biaya tambahan.",
];

const reservationChecklist = [
  ["日にち", "Tanggal reservasi"],
  ["人数", "Jumlah orang"],
  ["時間", "Waktu reservasi"],
  ["名前", "Nama pemesan"],
  ["電話番号", "Nomor telepon kontak"],
];

const couponDetails = [
  ["特典", "Potongan 10% untuk menu set makan siang."],
  ["提示", "Tunjukkan kupon saat pembayaran."],
  ["有効期限", "Sampai 30 Juni (contoh latihan)."],
  ["条件", "Satu kali untuk satu kelompok; tidak dapat digabung dengan kupon lain."],
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
    title: "01 · Menjelaskan makanan yang tidak bisa dimakan",
    heading: "Teman menawarkan hidangan",
    prompt: "Teman menawarkan hidangan udang. Kamu tidak bisa memakannya karena alergi. Pilih jawaban yang sopan dan jelas.",
    japanese: <>エビのアレルギーがあるので、食べられないんです。</>,
    translation: "Karena saya punya alergi udang, saya tidak bisa memakannya.",
    options: [
      { key: "a", label: "エビのアレルギーがあるので、食べられないんです。", meaning: "Menyampaikan alasan dengan sopan." },
      { key: "b", label: "エビを予約したいです。", meaning: "Mengatakan ingin memesan udang, bukan menjelaskan pantangan." },
      { key: "c", label: "エビは何名様ですか。", meaning: "Menanyakan jumlah orang dengan ungkapan yang tidak sesuai." },
    ],
    answer: "a",
    explanation: "ので menghubungkan alasan dengan akibat: punya alergi udang, jadi tidak bisa memakannya.",
  },
  {
    title: "02 · Memastikan bahan makanan",
    heading: "Bertanya tentang isi saus",
    prompt: "Kamu memperkirakan saus mengandung susu dan ingin memastikan dugaan itu kepada staf.",
    japanese: <>このソース、牛乳が入っていますよね。</>,
    translation: "Saus ini mengandung susu, ya?",
    options: [
      { key: "a", label: "このソース、牛乳が入っていますよね。", meaning: "Meminta konfirmasi tentang sesuatu yang diduga benar." },
      { key: "b", label: "このソース、牛乳でお願いします。", meaning: "Memilih susu sebagai pesanan, bukan meminta konfirmasi." },
      { key: "c", label: "このソース、牛乳なので予約します。", meaning: "Susunan alasan dan tindakan tidak sesuai konteks." },
    ],
    answer: "a",
    explanation: "よね digunakan untuk meminta konfirmasi atas sesuatu yang menurut pembicara kemungkinan benar.",
  },
  {
    title: "03 · Memilih tempat duduk",
    heading: "Staf menawarkan dua pilihan",
    prompt: "Restoran menawarkan tempat duduk meja atau konter. Kamu memilih meja.",
    japanese: <>テーブルでお願いします。</>,
    translation: "Saya pilih tempat duduk meja.",
    options: [
      { key: "a", label: "テーブルでお願いします。", meaning: "Menyatakan pilihan dengan Nで." },
      { key: "b", label: "テーブルなのでお願いします。", meaning: "Menyatakan alasan, bukan pilihan." },
      { key: "c", label: "テーブルのはお願いします。", meaning: "Pola kalimatnya tidak tepat." },
    ],
    answer: "a",
    explanation: "Nで dipakai untuk menyebut pilihan yang diambil, misalnya tempat duduk atau menu.",
  },
  {
    title: "04 · Membuat reservasi",
    heading: "Menelepon restoran",
    prompt: "Kamu ingin membuat reservasi. Pilih pembuka percakapan yang sopan.",
    japanese: <>あのう、予約をしたいんですけど。</>,
    translation: "Permisi, saya ingin membuat reservasi.",
    options: [
      { key: "a", label: "あのう、予約をしたいんですけど。", meaning: "Pembuka yang sopan untuk menyampaikan keinginan." },
      { key: "b", label: "予約は半額です。", meaning: "Mengatakan reservasi setengah harga, tidak sesuai." },
      { key: "c", label: "何を食べられないんですか。", meaning: "Menanyakan makanan yang tidak bisa dimakan." },
    ],
    answer: "a",
    explanation: "予約をしたいんですけど adalah ungkapan pembuka yang halus untuk memulai permintaan reservasi.",
  },
  {
    title: "05 · Memahami kupon",
    heading: "Membaca syarat kupon",
    prompt: "Kupon bertuliskan 会計のときに見せてください. Kapan kupon harus ditunjukkan?",
    japanese: <>会計のときに見せてください。</>,
    translation: "Silakan tunjukkan saat pembayaran.",
    options: [
      { key: "a", label: "Saat pembayaran." , meaning: "会計のとき berarti pada waktu pembayaran." },
      { key: "b", label: "Saat memesan melalui telepon.", meaning: "Bukan informasi yang tertulis di kupon." },
      { key: "c", label: "Setelah masa berlaku habis.", meaning: "Berlawanan dengan syarat penggunaan." },
    ],
    answer: "a",
    explanation: "会計のとき berarti saat pembayaran. Informasi penggunaan kupon harus dibaca dengan teliti.",
  },
];

const practiceTasks: Task[] = [
  {
    prompt: <>Pilih arti 「定食」 dalam konteks menu restoran.</>,
    options: [
      { key: "a", label: "Menu paket dengan beberapa hidangan." },
      { key: "b", label: "Nomor telepon restoran." },
      { key: "c", label: "Kupon potongan harga." },
    ],
    answer: "a",
    explanation: <>定食 adalah menu paket yang biasanya terdiri dari hidangan utama dan pelengkap.</>,
  },
  {
    prompt: <>Lengkapi kalimat: 「卵のアレルギーがある＿＿、食べられないんです。」</>,
    options: [
      { key: "a", label: "ので" },
      { key: "b", label: "で" },
      { key: "c", label: "のは" },
    ],
    answer: "a",
    explanation: <>ので menghubungkan alasan dengan hasil atau tindakan setelahnya.</>,
  },
  {
    prompt: <>Pada 「このソース、牛乳が入っていますよね」, よね digunakan untuk …</>,
    options: [
      { key: "a", label: "Meminta konfirmasi atas dugaan." },
      { key: "b", label: "Meminta meja untuk duduk." },
      { key: "c", label: "Menyatakan harga." },
    ],
    answer: "a",
    explanation: <>よね digunakan untuk meminta konfirmasi mengenai sesuatu yang diperkirakan benar.</>,
  },
  {
    prompt: <>Pilih jawaban untuk memilih tempat duduk meja.</>,
    options: [
      { key: "a", label: "テーブルでお願いします。" },
      { key: "b", label: "テーブルなのでお願いします。" },
      { key: "c", label: "テーブルのはお願いします。" },
    ],
    answer: "a",
    explanation: <>Nで menyatakan pilihan, misalnya テーブルでお願いします.</>,
  },
  {
    prompt: <>Apa arti 「有効期限」 pada kupon?</>,
    options: [
      { key: "a", label: "Masa berlaku." },
      { key: "b", label: "Jumlah pesanan." },
      { key: "c", label: "Tempat duduk." },
    ],
    answer: "a",
    explanation: <>有効期限 menunjukkan sampai kapan kupon atau dokumen masih berlaku.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Menu yang populer adalah set menu ayam”.</>,
    options: [
      { key: "a", label: "人気があるのは、チキン定食です。" },
      { key: "b", label: "チキン定食なので、人気がありますか。" },
      { key: "c", label: "チキン定食で、人気があるのを。" },
    ],
    answer: "a",
    explanation: <>Pola 〜のは、Nです menempatkan informasi yang ingin disampaikan setelah のは.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa arti 「注文」?</>,
    options: [
      { key: "a", label: "Pesanan." },
      { key: "b", label: "Reservasi." },
      { key: "c", label: "Pembayaran." },
    ],
    answer: "a",
    explanation: <>注文（ちゅうもん）berarti pesanan atau tindakan memesan.</>,
  },
  {
    prompt: <>Apa arti 「抜き」 dalam 「卵抜き」?</>,
    options: [
      { key: "a", label: "Tanpa telur." },
      { key: "b", label: "Telur tambahan." },
      { key: "c", label: "Telur porsi besar." },
    ],
    answer: "a",
    explanation: <>〜抜き berarti tanpa bahan yang disebutkan sebelumnya.</>,
  },
  {
    prompt: <>Pilih ungkapan yang tepat untuk mengatakan “Saya tidak bisa makan kacang karena alergi”.</>,
    options: [
      { key: "a", label: "ナッツのアレルギーがあるので、食べられないんです。" },
      { key: "b", label: "ナッツで予約したいんです。" },
      { key: "c", label: "ナッツの会計は何時ですか。" },
    ],
    answer: "a",
    explanation: <>ので menyatakan alasan. 食べられないんです menyampaikan bahwa makanan tersebut tidak bisa dimakan.</>,
  },
  {
    prompt: <>Apa arti 「何名様ですか」?</>,
    options: [
      { key: "a", label: "Berapa orang?" },
      { key: "b", label: "Jam berapa?" },
      { key: "c", label: "Menu apa?" },
    ],
    answer: "a",
    explanation: <>何名様ですか adalah pertanyaan sopan untuk mengetahui jumlah tamu.</>,
  },
  {
    prompt: <>Bagaimana cara menyatakan pilihan menu dengan pola Nで?</>,
    options: [
      { key: "a", label: "カレーでお願いします。" },
      { key: "b", label: "カレーなのでお願いします。" },
      { key: "c", label: "カレーのはお願いします。" },
    ],
    answer: "a",
    explanation: <>カレーでお願いします berarti memilih kari sebagai pesanan.</>,
  },
  {
    prompt: <>Lengkapi: 「人気があるのは、野菜カレー＿＿。」</>,
    options: [
      { key: "a", label: "です" },
      { key: "b", label: "ので" },
      { key: "c", label: "で" },
    ],
    answer: "a",
    explanation: <>Pola ～のは、Nです memakai です untuk menyampaikan informasi yang menjadi fokus kalimat.</>,
  },
  {
    prompt: <>Apa yang sebaiknya disiapkan saat menelepon untuk reservasi?</>,
    options: [
      { key: "a", label: "Tanggal, jumlah orang, waktu, nama, dan nomor kontak." },
      { key: "b", label: "Hanya nama menu." },
      { key: "c", label: "Hanya warna tempat duduk." },
    ],
    answer: "a",
    explanation: <>Restoran biasanya perlu tanggal, jumlah orang, waktu, dan informasi pemesan untuk mencatat reservasi.</>,
  },
  {
    prompt: <>Ungkapan 「会計のときに見せてください」 berarti …</>,
    options: [
      { key: "a", label: "Tunjukkan saat pembayaran." },
      { key: "b", label: "Tunjukkan saat menelepon." },
      { key: "c", label: "Tunjukkan setelah tutup." },
    ],
    answer: "a",
    explanation: <>会計のときに berarti pada saat pembayaran.</>,
  },
  {
    prompt: <>Pilih ungkapan yang tepat untuk bertanya apakah bahan tertentu terkandung dalam makanan.</>,
    options: [
      { key: "a", label: "この料理に牛乳は入っていますか。" },
      { key: "b", label: "この料理は何名様ですか。" },
      { key: "c", label: "この料理は電話番号ですか。" },
    ],
    answer: "a",
    explanation: <>〜に〜が入っていますか digunakan untuk menanyakan apakah suatu bahan terkandung dalam hidangan.</>,
  },
  {
    prompt: <>Apa arti 「別々でお願いします」 ketika membayar?</>,
    options: [
      { key: "a", label: "Tolong bayar secara terpisah." },
      { key: "b", label: "Tolong pesan menu yang sama." },
      { key: "c", label: "Tolong duduk di meja." },
    ],
    answer: "a",
    explanation: <>別々でお願いします digunakan ketika meminta pembayaran terpisah.</>,
  },
];

export default function IrodoriElementaryTwoLessonThreePage() {
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
      <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#86A9D0]/40 hover:text-[#EAE6DD]">
        <ArrowLeft size={15} /> Kembali ke Dasar 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#438A61]/35 bg-gradient-to-br from-[#1D3B2D] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#A8D5B5]/[0.08]">食</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#A8D5B5]">IRODORI • DASAR 2 A2 • PELAJARAN 03</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya tidak bisa memakannya karena alergi.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A8D5B5]">アレルギーがあるので、食べられないんです</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar membaca menu dan harga, menjelaskan makanan yang tidak bisa dimakan, meminta pilihan tempat duduk dan pesanan, membuat reservasi lewat telepon, serta memahami kupon restoran.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Utensils size={14} className="text-[#A8D5B5]" />Menu dan bahan makanan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B5]"><PhoneCall size={14} className="text-[#A8D5B5]" />Reservasi telepon</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Receipt size={14} className="text-[#A8D5B5]" />Kupon dan pembayaran</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#438A61]/20 bg-[#1D3026]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A8D5B5]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Lima target berikut sesuai target komunikasi 09–13 pada Irodori Dasar 2 Lesson 3.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A8D5B5]">{item.source} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">KOSAKATA MENU DAN RESTORAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Hidangan, bahan, dan layanan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kata untuk memahami menu, menjelaskan bahan yang perlu dihindari, memilih pesanan, dan membaca informasi restoran.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A8D5B5]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">CONTOH MENU</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Baca nama hidangan dan harganya</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Menu berikut fiktif dan dibuat untuk latihan membaca harga, pilihan menu, dan keterangan layanan.</p>
        </div>
        <article className="overflow-hidden rounded-2xl border border-[#438A61]/25 bg-[#1D3026]/80">
          <div className="border-b border-white/[0.08] bg-[#274B36] px-4 py-3">
            <p className="text-[9px] font-black tracking-[0.17em] text-[#A8D5B5]">KEDAI CONTOH · MENU LATIHAN</p>
            <h3 className="mt-1 font-mincho text-xl font-bold text-[#F1EBDD]">みどり食堂 · Midori Shokudou</h3>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {menuItems.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-mincho text-base text-[#F1EBDD]">{item.name}</p>
                  <p className="mt-0.5 text-[9px] text-[#A8D5B5]">{item.reading}</p>
                  <p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning} · <JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
                </div>
                <p className="shrink-0 text-sm font-black tabular-nums text-[#E8D49C]">¥{item.price}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.08] bg-black/15 p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#A8D5B5]">INFORMASI LAYANAN</p>
            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-[#C8C2B8]">
              {menuServices.map((item) => <li key={item}>・{item}</li>)}
            </ul>
          </div>
        </article>
        <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#A8D5B5]">CONTOH MEMBACA HARGA</p>
          <p className="mt-2 font-mincho text-base text-[#F1EBDD]">野菜カレーは、680円です。</p>
          <p className="mt-1 text-xs text-[#A9A398]">Kari sayuran harganya 680 yen.</p>
          <p className="mt-3 font-mincho text-base text-[#F1EBDD]">ご飯を大盛りにすると、50円プラスです。</p>
          <p className="mt-1 text-xs text-[#A9A398]">Jika memilih nasi porsi besar, tambah 50 yen.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">MENJELASKAN MAKANAN YANG TIDAK BISA DIMAKAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sampaikan bahan dan alasan dengan jelas</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan alasan singkat dan sopan. Untuk latihan ini, contoh berfokus pada alergi dan makanan yang tidak disukai.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["エビのアレルギーがあるので、食べられないんです。", "Ebi no arerugii ga aru node, taberarenai n desu.", "Karena saya alergi udang, saya tidak bisa memakannya."],
            ["卵が苦手なので、卵抜きでお願いします。", "Tamago ga nigate na node, tamago o nuki de onegaishimasu.", "Karena saya kurang suka telur, tolong tanpa telur."],
            ["この料理に牛乳は入っていますか。", "Kono ryouri ni gyuunyuu wa haitte imasu ka?", "Apakah hidangan ini mengandung susu?"],
            ["このソース、ナッツが入っていますよね。", "Kono soosu, nattsu ga haitte imasu yo ne.", "Saus ini mengandung kacang, ya?"],
            ["小麦のアレルギーがあるので、確認してください。", "Komugi no arerugii ga aru node, kakunin shite kudasai.", "Karena saya alergi gandum, mohon periksa terlebih dahulu."],
            ["材料を教えていただけますか。", "Zairyou o oshiete itadakemasu ka?", "Bisakah Anda memberi tahu bahan-bahannya?"],
          ].map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base leading-7 text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#A8D5B5]">{reading}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
        <p className="rounded-xl border border-[#438A61]/20 bg-[#1D3026]/70 p-3 text-[10px] leading-5 text-[#B9C8BC]">
          Catatan keselamatan: ini latihan bahasa, bukan saran medis. Dalam situasi alergi sungguhan, jelaskan alergi secara langsung kepada orang dewasa pendamping dan staf restoran; jangan menebak isi makanan.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">MEMILIH TEMPAT DUDUK DAN PESANAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Ungkapan ketika berada di restoran</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Staf restoran dapat menawarkan jenis tempat duduk, rekomendasi hidangan, dan ukuran porsi.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["テーブルでお願いします。", "Teeburu de onegaishimasu.", "Saya pilih meja."],
            ["カウンターでお願いします。", "Kauntaa de onegaishimasu.", "Saya pilih tempat duduk konter."],
            ["おすすめは何ですか。", "Osusume wa nan desu ka?", "Apa rekomendasinya?"],
            ["じゃあ、それにします。", "Jaa, sore ni shimasu.", "Kalau begitu, saya pilih itu."],
            ["ご飯は普通でだいじょうぶです。", "Gohan wa futsuu de daijoubu desu.", "Nasi porsi normal tidak apa-apa."],
            ["別々でお願いします。", "Betsubetsu de onegaishimasu.", "Tolong pembayarannya terpisah."],
          ].map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base leading-7 text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#A8D5B5]">{reading}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">RESERVASI MELALUI TELEPON</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Siapkan informasi sebelum menelepon</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Saat latihan reservasi, petugas akan menanyakan beberapa informasi. Contoh data di bawah bersifat fiktif; jangan gunakan nomor pribadi dalam latihan terbuka.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {reservationChecklist.map(([jp, meaning], index) => (
            <article key={jp} className="rounded-xl border border-[#438A61]/20 bg-[#1D3026]/70 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A8D5B5]">INFO · 0{index + 1}</p>
              <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-xs text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#438A61]/25 bg-[#1D3026]/80">
          <div className="border-b border-white/[0.08] bg-[#274B36] px-4 py-3">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#A8D5B5]">CONTOH TELEPON · FIKTIF</p>
            <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">予約をしたいんですけど。</h3>
            <p className="mt-1 text-[10px] text-[#B7C8BB]">Saya ingin membuat reservasi.</p>
          </div>
          <div className="space-y-3 p-4">
            {[
              ["店員", "お日にちは、お決まりですか。", "Apakah tanggalnya sudah ditentukan?"],
              ["お客さん", "来週の土曜日です。", "Sabtu minggu depan."],
              ["店員", "何名様ですか。", "Untuk berapa orang?"],
              ["お客さん", "4人です。午後6時はだいじょうぶですか。", "Empat orang. Apakah pukul enam sore bisa?"],
              ["店員", "お名前とお電話番号をお願いします。", "Mohon sebutkan nama dan nomor telepon."],
              ["お客さん", "アオイです。電話番号は、000-0000-0000です。", "Nama saya Aoi. Nomor teleponnya contoh fiktif."],
              ["店員", "土曜日の18時から4名様でおまちがいないでしょうか。", "Jadi, Sabtu pukul 18.00 untuk empat orang, benar?"],
              ["お客さん", "はい。よろしくお願いします。", "Ya, terima kasih."],
            ].map(([role, jp, meaning], index) => (
              <div key={index} className="grid grid-cols-[88px_1fr] gap-3 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
                <p className="text-[10px] font-bold text-[#A8D5B5]">{role}</p>
                <div>
                  <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">{jp}</p>
                  <p className="mt-1 text-xs leading-5 text-[#A9A398]">{meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">MEMBACA KUPON RESTORAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Perhatikan manfaat, syarat, dan masa berlaku</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Contoh kupon berikut fiktif. Baca kapan kupon ditunjukkan, menu apa yang mendapat potongan, dan sampai kapan kupon berlaku.</p>
        </div>
        <article className="overflow-hidden rounded-2xl border border-[#438A61]/30 bg-[#E9E3C8] text-[#263328]">
          <div className="border-b-2 border-dashed border-[#718C68] bg-[#D3DFC9] p-4">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#476447]">MIDORI SHOKUDOU · COUPON SAMPLE</p>
            <h3 className="mt-2 font-mincho text-2xl font-black">ランチ定食 10% OFF</h3>
            <p className="mt-1 text-sm font-bold">Potongan 10% untuk set menu makan siang</p>
          </div>
          <div className="space-y-2 p-4 text-xs leading-6">
            {couponDetails.map(([jp, meaning]) => (
              <div key={jp} className="flex gap-3 border-b border-[#87927A]/35 pb-2 last:border-0">
                <span className="w-24 shrink-0 font-black text-[#476447]">{jp}</span>
                <span>{meaning}</span>
              </div>
            ))}
          </div>
          <p className="border-t border-dashed border-[#718C68] px-4 py-3 text-[9px] text-[#5F705B]">KUPON FIKTIF UNTUK LATIHAN · BUKAN KUPON YANG DAPAT DIGUNAKAN</p>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">KOSAKATA KANJI</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kosakata kanji pada pelajaran ini</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan kanji yang sering muncul pada menu, pesanan, pembayaran, dan reservasi.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-xl leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A8D5B5]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Berkomunikasi di restoran</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Dialog dibuat orisinal oleh Fude berdasarkan target komunikasi pelajaran ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Menjelaskan makanan yang tidak bisa dimakan" speakers={[friendYui, friendSota]} utterances={explainFoodConversation} />
          <IrodoriConversation title="Memastikan bahan makanan" speakers={[friendAkiko, friendKenji]} utterances={confirmIngredientsConversation} />
          <IrodoriConversation title="Memilih tempat duduk dan menu" speakers={[friendYui, friendSota]} utterances={restaurantOrderConversation} />
          <IrodoriConversation title="Membuat reservasi lewat telepon" speakers={[friendAkiko, friendKenji]} utterances={phoneReservationConversation} />
          <IrodoriConversation title="Memahami informasi kupon" speakers={[friendSota, friendYui]} utterances={couponConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Empat pola untuk alasan, pilihan, dan rekomendasi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan pola berikut untuk menjelaskan alasan, memastikan informasi, memilih sesuatu, dan menyampaikan hidangan yang direkomendasikan.</p>
        </div>
        {[
          {
            title: "01 · Menjelaskan alasan dengan sopan",
            pattern: "S1 ので、S2",
            example: <>エビのアレルギーがあるので、食べられないんです。<br />この店は人気なので、いつも混んでいます。</>,
            note: "ので menghubungkan alasan dan hasilnya. Kata kerja dan kata sifat dapat memakai bentuk biasa sebelum ので. Kata benda dan kata sifat-na menggunakan なので, misalnya 人気店なので atau 静かなので. Dibandingkan から, ので sering terdengar lebih halus ketika menyampaikan alasan pribadi.",
          },
          {
            title: "02 · Meminta konfirmasi atas dugaan",
            pattern: "S よね",
            example: <>この料理、卵が入っていますよね。<br />予約は午後6時からですよね。</>,
            note: "よね digunakan ketika pembicara memiliki dugaan dan ingin memastikan hal itu kepada lawan bicara. Berbeda dengan pertanyaan netral, ungkapan ini menunjukkan bahwa pembicara memperkirakan jawabannya.",
          },
          {
            title: "03 · Menyatakan pilihan",
            pattern: "N でお願いします ／ N でだいじょうぶです",
            example: <>テーブルでお願いします。<br />ご飯は普通でだいじょうぶです。<br />じゃあ、野菜カレーで。</>,
            note: "Nで dipakai untuk menjawab pilihan yang ditawarkan, seperti tempat duduk, menu, atau ukuran porsi. Ungkapan ini sering diikuti お願いします atau だいじょうぶです.",
          },
          {
            title: "04 · Menyampaikan informasi utama",
            pattern: "ナA-な／イA-い／V-る のは、Nです",
            example: <>人気があるのは、チキン定食です。<br />おいしいのは、野菜カレーです。<br />一番安いのは、野菜うどんです。</>,
            note: "Pola ～のは、Nです dipakai untuk menempatkan informasi utama di bagian akhir kalimat. Bagian sebelum のは menjelaskan kondisi atau hal yang sedang dibicarakan, lalu N menyebutkan jawabannya.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#A8D5B5]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#A8D5B5]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">SIMULASI SITUASI</p>
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
              <p className="text-[9px] font-black tracking-[0.16em] text-[#A8D5B5]">{task.title}</p>
              <h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#438A61]/20 bg-[#1D3026]/70 p-3">
                <p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading showRomaji={false} allowIndexFallback>{task.japanese}</JapaneseReading></p>
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
                          ? "border-[#A8D5B5]/60 bg-[#438A61]/15 text-[#F1EBDD]"
                          : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                    )}
                  >
                    <JapaneseReading showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                  </button>
                ))}
              </div>
              {(isCorrect || isWrong) && (
                <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                  <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>
                    {isCorrect ? "Benar. " : "Belum tepat. "}
                  </span>
                  {isCorrect ? task.explanation : "Coba tinjau kembali pola kalimat dan pilih jawaban lain."}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] text-[#817A73]">{isCorrect ? "Situasi selesai" : "Pilih jawaban lalu periksa"}</p>
                <button
                  type="button"
                  disabled={!selected || isCorrect}
                  onClick={() => setSimulationChecked((current) => ({ ...current, [index]: true }))}
                  className="rounded-lg bg-[#438A61] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#34734F] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
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
          <button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#438A61]/35 px-4 py-2 text-xs font-bold text-[#A8D5B5]">
            <RefreshCw size={13} /> Ulangi simulasi
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#A8D5B5]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></h3>
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
                              ? "border-[#A8D5B5]/60 bg-[#438A61]/15 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      <JapaneseReading showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {practiceSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>
                      {isCorrect ? "Benar. " : "Belum tepat. "}
                    </span>
                    <JapaneseReading showRomaji={false} allowIndexFallback>{task.explanation}</JapaneseReading>
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
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#438A61]/35 px-4 py-2 text-xs font-bold text-[#A8D5B5]">
              <RefreshCw size={13} /> Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={Object.keys(practiceAnswers).length !== practiceTasks.length}
              className="rounded-lg bg-[#438A61] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#A8D5B5]">SOAL {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showRomaji={false} allowIndexFallback>{question.prompt}</JapaneseReading></h3>
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
                              ? "border-[#A8D5B5]/60 bg-[#438A61]/15 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      <JapaneseReading showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>
                      {isCorrect ? "Benar. " : "Belum tepat. "}
                    </span>
                    <JapaneseReading showRomaji={false} allowIndexFallback>{question.explanation}</JapaneseReading>
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
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#438A61]/35 px-4 py-2 text-xs font-bold text-[#A8D5B5]">
              <RefreshCw size={13} /> Ulangi kuis
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="rounded-lg bg-[#438A61] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa kuis
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#438A61]/20 bg-[#1D3026]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#A8D5B5]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi target komunikasi</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">
          Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.
        </p>
        <div className="space-y-3">
          {canDos.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A8D5B5]">{item.source}</p>
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
                        ? "border-[#A8D5B5]/50 bg-[#438A61]/20 text-[#ECF8EF]"
                        : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                    )}
                  >
                    <JapaneseReading showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
          <p className="text-xs text-[#A9A398]">
            {isCompleted
              ? "Lesson 3 selesai. Progres tersimpan."
              : canDosRated
                ? "Semua target komunikasi sudah dinilai."
                : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button
            type="button"
            onClick={finishLesson}
            disabled={!canComplete || isCompleted}
            className="rounded-xl bg-[#438A61] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#34734F] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
          >
            {isCompleted ? "Lesson 3 selesai" : "Selesaikan Lesson 3"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Dasar 2 · 03 / 18</span>
      </div>
    </main>
  );
}
