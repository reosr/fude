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
  Plane,
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
const lessonId = "elementary2-05";

const destinationIntroductionConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>北海道は、どんなところですか。</>,
    romaji: "Hokkaidou wa, donna tokoro desu ka?",
    translation: "Hokkaido itu tempat seperti apa?",
    audioFileName: "irodori-elementary2-05-a01-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>自然が豊かで、食べ物がおいしいところですよ。</>,
    romaji: "Shizen ga yutaka de, tabemono ga oishii tokoro desu yo.",
    translation: "Tempat yang alamnya kaya dan makanannya enak.",
    audioFileName: "irodori-elementary2-05-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>何ができますか。</>,
    romaji: "Nani ga dekimasu ka?",
    translation: "Di sana kita bisa melakukan apa?",
    audioFileName: "irodori-elementary2-05-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>新鮮な魚が食べられますし、冬は雪の景色も見られます。</>,
    romaji: "Shinsen na sakana ga taberaremasu shi, fuyu wa yuki no keshiki mo miraremasu.",
    translation: "Kita bisa makan ikan segar dan pada musim dingin juga bisa melihat pemandangan salju.",
    audioFileName: "irodori-elementary2-05-a01-l04.mp3",
  },
];

const planTripConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>今度の休みに、どこへ行きたいですか。</>,
    romaji: "Kondo no yasumi ni, doko e ikitai desu ka?",
    translation: "Saat libur nanti, kamu ingin pergi ke mana?",
    audioFileName: "irodori-elementary2-05-a02-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>景色がきれいなところがいいです。</>,
    romaji: "Keshiki ga kirei na tokoro ga ii desu.",
    translation: "Saya ingin pergi ke tempat yang pemandangannya indah.",
    audioFileName: "irodori-elementary2-05-a02-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>じゃあ、湖が見られる場所はどうですか。</>,
    romaji: "Jaa, mizuumi ga mirareru basho wa dou desu ka?",
    translation: "Kalau begitu, bagaimana tempat yang memiliki danau untuk dilihat?",
    audioFileName: "irodori-elementary2-05-a02-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>いいですね。電車で行けるところがいいです。</>,
    romaji: "Ii desu ne. Densha de ikeru tokoro ga ii desu.",
    translation: "Bagus. Saya ingin tempat yang bisa dicapai dengan kereta.",
    audioFileName: "irodori-elementary2-05-a02-l04.mp3",
  },
];

const askTravelAdviceConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>来月、奈良へ行くんですけど、どこに泊まったらいいですか。</>,
    romaji: "Raigetsu, Nara e ikun desu kedo, doko ni tomattara ii desu ka?",
    translation: "Bulan depan saya akan pergi ke Nara. Sebaiknya menginap di mana?",
    audioFileName: "irodori-elementary2-05-a03-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>静かな宿なら、駅から少し離れた旅館がいいですよ。</>,
    romaji: "Shizuka na yado nara, eki kara sukoshi hanareta ryokan ga ii desu yo.",
    translation: "Kalau ingin penginapan yang tenang, ryokan yang agak jauh dari stasiun bagus.",
    audioFileName: "irodori-elementary2-05-a03-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>予約はいつしたらいいですか。</>,
    romaji: "Yoyaku wa itsu shitara ii desu ka?",
    translation: "Sebaiknya kapan saya membuat reservasi?",
    audioFileName: "irodori-elementary2-05-a03-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>早めに予約したほうがいいですよ。</>,
    romaji: "Hayame ni yoyaku shita hou ga ii desu yo.",
    translation: "Sebaiknya buat reservasi lebih awal.",
    audioFileName: "irodori-elementary2-05-a03-l04.mp3",
  },
];

const travelPreparationConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>山の近くへ行くんですけど、何を持って行ったらいいですか。</>,
    romaji: "Yama no chikaku e ikun desu kedo, nani o motte ittara ii desu ka?",
    translation: "Saya akan pergi ke dekat pegunungan. Apa yang sebaiknya saya bawa?",
    audioFileName: "irodori-elementary2-05-a04-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>朝は涼しいので、上着を持って行ったほうがいいですよ。</>,
    romaji: "Asa wa suzushii node, uwagi o motte itta hou ga ii desu yo.",
    translation: "Pagi hari sejuk, jadi sebaiknya bawa jaket.",
    audioFileName: "irodori-elementary2-05-a04-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ほかに、準備したほうがいいものはありますか。</>,
    romaji: "Hoka ni, junbi shita hou ga ii mono wa arimasu ka?",
    translation: "Selain itu, adakah barang lain yang sebaiknya disiapkan?",
    audioFileName: "irodori-elementary2-05-a04-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>天気を調べて、歩きやすい靴を準備したほうがいいですよ。</>,
    romaji: "Tenki o shirabete, arukiyasui kutsu o junbi shita hou ga ii desu yo.",
    translation: "Sebaiknya periksa cuaca dan siapkan sepatu yang nyaman untuk berjalan.",
    audioFileName: "irodori-elementary2-05-a04-l04.mp3",
  },
];

const travelReviewConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>旅行サイトの口コミを読みましたか。</>,
    romaji: "Ryokou saito no kuchikomi o yomimashita ka?",
    translation: "Apakah kamu sudah membaca ulasan di situs perjalanan?",
    audioFileName: "irodori-elementary2-05-a05-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。駅から近くて、景色がきれいだって聞きました。</>,
    romaji: "Hai. Eki kara chikakute, keshiki ga kirei da tte kikimashita.",
    translation: "Ya. Katanya tempat itu dekat dari stasiun dan pemandangannya indah.",
    audioFileName: "irodori-elementary2-05-a05-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ほかには、どんなことが書いてありましたか。</>,
    romaji: "Hoka ni wa, donna koto ga kaite arimashita ka?",
    translation: "Selain itu, apa lagi yang tertulis di sana?",
    audioFileName: "irodori-elementary2-05-a05-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>静かで、ゆっくりできるところだって書いてありました。</>,
    romaji: "Shizuka de, yukkuri dekiru tokoro da tte kaite arimashita.",
    translation: "Tertulis bahwa itu tempat yang tenang dan cocok untuk bersantai.",
    audioFileName: "irodori-elementary2-05-a05-l04.mp3",
  },
];

const canDos = [
  {
    id: "understand-tourist-destination",
    source: "CAN-DO 19",
    text: "Memahami gambaran singkat tentang tempat wisata, termasuk ciri tempat dan kegiatan yang bisa dilakukan di sana.",
  },
  {
    id: "discuss-travel-plan",
    source: "CAN-DO 20",
    text: "Membicarakan rencana perjalanan bersama teman, seperti tujuan, kegiatan, dan cara pergi.",
  },
  {
    id: "ask-give-travel-advice",
    source: "CAN-DO 21",
    text: "Meminta dan memberikan saran tentang perjalanan yang sedang direncanakan.",
  },
  {
    id: "read-travel-review",
    source: "CAN-DO 22",
    text: "Membaca ulasan di situs perjalanan dan memahami garis besar informasi di dalamnya.",
  },
];

const vocabRows = [
  ["観光地", "かんこうち · kankouchi", "Tempat wisata"],
  ["観光客", "かんこうきゃく · kankoukyaku", "Wisatawan"],
  ["自然", "しぜん · shizen", "Alam"],
  ["景色", "けしき · keshiki", "Pemandangan"],
  ["豊か", "ゆたか · yutaka", "Kaya atau melimpah"],
  ["海", "うみ · umi", "Laut"],
  ["暖かい", "あたたかい · atatakai", "Hangat"],
  ["涼しい", "すずしい · suzushii", "Sejuk"],
  ["古い町", "ふるいまち · furui machi", "Kota tua"],
  ["人が多い", "ひとがおおい · hito ga ooi", "Banyak orang"],
  ["混んでいる", "こんでいる · konde iru", "Ramai atau padat"],
  ["人気がある", "にんきがある · ninki ga aru", "Populer"],
  ["遊べる", "あそべる · asoberu", "Bisa bermain"],
  ["食べられる", "たべられる · taberareru", "Bisa makan"],
  ["見られる", "みられる · mirareru", "Bisa melihat"],
  ["水族館", "すいぞくかん · suizokukan", "Akuarium"],
  ["お土産", "おみやげ · omiyage", "Oleh-oleh"],
  ["旅行", "りょこう · ryokou", "Perjalanan atau wisata"],
  ["行き先", "いきさき · ikisaki", "Tujuan perjalanan"],
  ["計画", "けいかく · keikaku", "Rencana"],
  ["交通", "こうつう · koutsuu", "Transportasi atau lalu lintas"],
  ["便利", "べんり · benri", "Praktis atau nyaman"],
  ["飛行機", "ひこうき · hikouki", "Pesawat terbang"],
  ["船", "ふね · fune", "Kapal"],
  ["電車", "でんしゃ · densha", "Kereta"],
  ["バス", "バス · basu", "Bus"],
  ["車", "くるま · kuruma", "Mobil"],
  ["自転車", "じてんしゃ · jitensha", "Sepeda"],
  ["出発する", "しゅっぱつする · shuppatsu suru", "Berangkat"],
  ["到着する", "とうちゃくする · touchaku suru", "Tiba"],
  ["泊まる", "とまる · tomaru", "Menginap"],
  ["旅館", "りょかん · ryokan", "Penginapan tradisional Jepang"],
  ["民宿", "みんしゅく · minshuku", "Penginapan kecil milik keluarga"],
  ["宿", "やど · yado", "Penginapan"],
  ["予約する", "よやくする · yoyaku suru", "Memesan atau reservasi"],
  ["調べる", "しらべる · shiraberu", "Memeriksa atau mencari tahu"],
  ["準備する", "じゅんびする · junbi suru", "Mempersiapkan"],
  ["持って行く", "もっていく · motte iku", "Membawa pergi"],
  ["上着", "うわぎ · uwagi", "Jaket atau pakaian luar"],
  ["帽子", "ぼうし · boushi", "Topi"],
  ["手袋", "てぶくろ · tebukuro", "Sarung tangan"],
  ["サングラス", "サングラス · sangurasu", "Kacamata hitam"],
  ["水着", "みずぎ · mizugi", "Baju renang"],
  ["旅行サイト", "りょこうサイト · ryokou saito", "Situs perjalanan"],
  ["口コミ", "くちこみ · kuchikomi", "Ulasan pengguna"],
  ["評判", "ひょうばん · hyouban", "Reputasi atau penilaian"],
  ["おすすめ", "おすすめ · osusume", "Rekomendasi"],
  ["いつか", "いつか · itsuka", "Suatu hari nanti"],
  ["紅葉", "こうよう · kouyou", "Daun musim gugur yang berubah warna"],
  ["温泉", "おんせん · onsen", "Pemandian air panas alami"],
];

const kanjiWords = [
  ["自然", "しぜん · shizen", "Alam"],
  ["交通", "こうつう · koutsuu", "Transportasi atau lalu lintas"],
  ["船", "ふね · fune", "Kapal"],
  ["自転車", "じてんしゃ · jitensha", "Sepeda"],
  ["旅館", "りょかん · ryokan", "Penginapan tradisional Jepang"],
  ["東京", "とうきょう · Toukyou", "Tokyo"],
  ["計画", "けいかく · keikaku", "Rencana"],
  ["遊ぶ", "あそぶ · asobu", "Bermain"],
  ["調べる", "しらべる · shiraberu", "Memeriksa atau mencari tahu"],
  ["出発する", "しゅっぱつする · shuppatsu suru", "Berangkat"],
];

const travelReviews = [
  {
    name: "みずうみ旅館",
    category: "湖の近く · Dekat danau",
    rating: "4.6 / 5",
    price: "¥8,000 / malam",
    good: "駅から近くて、景色がとてもきれいです。",
    goodMeaning: "Dekat dari stasiun dan pemandangannya sangat indah.",
    note: "部屋は少し小さいですが、静かです。",
    noteMeaning: "Kamarnya agak kecil, tetapi suasananya tenang.",
  },
  {
    name: "まちのホテル",
    category: "町の中心 · Pusat kota",
    rating: "4.2 / 5",
    price: "¥7,000 / malam",
    good: "交通が便利で、近くに店がたくさんあります。",
    goodMeaning: "Transportasinya praktis dan ada banyak toko di dekatnya.",
    note: "週末は人が多くて、少し混んでいます。",
    noteMeaning: "Akhir pekan banyak orang dan tempatnya agak ramai.",
  },
  {
    name: "やまの宿",
    category: "自然の近く · Dekat alam",
    rating: "4.5 / 5",
    price: "¥6,500 / malam",
    good: "自然が豊かで、ゆっくりできるところです。",
    goodMeaning: "Alamnya melimpah dan tempatnya cocok untuk bersantai.",
    note: "バスの本数が少ないので、時間を調べたほうがいいです。",
    noteMeaning: "Busnya tidak terlalu sering, jadi sebaiknya periksa jadwal.",
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
    title: "01 · Memahami deskripsi destinasi",
    heading: "Mengenali ciri tempat wisata",
    prompt: "Kamu mendengar deskripsi 「自然が豊かで、海がきれいなところです」. Informasi apa yang kamu pahami?",
    japanese: <>自然が豊かで、海がきれいなところです。</>,
    translation: "Tempat yang alamnya melimpah dan lautnya indah.",
    options: [
      { key: "a", label: "Tempat yang ramai dan banyak gedung.", meaning: "Deskripsi tidak menyebut keramaian atau gedung." },
      { key: "b", label: "Tempat dengan alam yang melimpah dan laut yang indah.", meaning: "豊か menjelaskan alam yang melimpah, sedangkan 海がきれい menjelaskan laut yang indah." },
      { key: "c", label: "Tempat yang terkenal karena pusat belanja.", meaning: "Tidak ada informasi tentang pusat belanja." },
    ],
    answer: "b",
    explanation: "Perhatikan kata sifat yang menjelaskan tempat: 自然が豊か dan 海がきれい.",
  },
  {
    title: "02 · Membicarakan rencana",
    heading: "Menentukan tempat yang diinginkan",
    prompt: "Temanmu ingin tempat dengan pemandangan indah. Pilih ungkapan yang paling sesuai.",
    japanese: <>景色がきれいなところがいいです。</>,
    translation: "Saya ingin tempat yang pemandangannya indah.",
    options: [
      { key: "a", label: "景色がきれいなところがいいです。", meaning: "ところ diterangkan oleh klausa 景色がきれい." },
      { key: "b", label: "景色を予約したほうがいいです。", meaning: "Artinya menyarankan untuk memesan pemandangan." },
      { key: "c", label: "景色が出発したいです。", meaning: "Susunan kata tidak sesuai untuk menyatakan preferensi tempat." },
    ],
    answer: "a",
    explanation: "Kata ところ berarti tempat. Keterangan sebelumnya menjelaskan tempat seperti apa yang diinginkan.",
  },
  {
    title: "03 · Meminta saran",
    heading: "Bertanya tentang barang yang perlu dibawa",
    prompt: "Kamu akan pergi ke tempat yang sejuk. Bagaimana bertanya apa yang sebaiknya dibawa?",
    japanese: <>何を持って行ったらいいですか。</>,
    translation: "Apa yang sebaiknya saya bawa?",
    options: [
      { key: "a", label: "何を持って行きますか。", meaning: "Menanyakan apa yang akan dibawa, bukan meminta saran." },
      { key: "b", label: "何を持って行ったらいいですか。", meaning: "Pola V-たらいいですか digunakan untuk meminta saran." },
      { key: "c", label: "何を持って行かないでください。", meaning: "Berarti meminta seseorang untuk tidak membawa sesuatu." },
    ],
    answer: "b",
    explanation: "V-たらいいですか dipakai untuk meminta saran tentang cara atau hal yang sebaiknya dilakukan.",
  },
  {
    title: "04 · Memberikan saran",
    heading: "Menyarankan reservasi lebih awal",
    prompt: "Penginapan sering penuh saat liburan. Berikan saran yang sesuai.",
    japanese: <>早く予約したほうがいいですよ。</>,
    translation: "Sebaiknya buat reservasi lebih awal.",
    options: [
      { key: "a", label: "早く予約しないほうがいいですよ。", meaning: "Berarti sebaiknya tidak membuat reservasi lebih awal." },
      { key: "b", label: "早く予約したらいいですか。", meaning: "Ini bentuk pertanyaan untuk meminta saran." },
      { key: "c", label: "早く予約したほうがいいですよ。", meaning: "V-たほうがいい digunakan untuk menyarankan suatu tindakan." },
    ],
    answer: "c",
    explanation: "V-たほうがいい menyarankan tindakan yang sebaiknya dilakukan.",
  },
  {
    title: "05 · Membaca ulasan perjalanan",
    heading: "Menemukan informasi utama",
    prompt: "Baca kalimat 「交通が便利で、近くに店がたくさんあります」. Apa kelebihan tempat tersebut?",
    japanese: <>交通が便利で、近くに店がたくさんあります。</>,
    translation: "Transportasinya praktis dan ada banyak toko di dekatnya.",
    options: [
      { key: "a", label: "Jauh dari transportasi dan tidak ada toko.", meaning: "Maknanya berlawanan dengan kalimat." },
      { key: "b", label: "Transportasinya praktis dan banyak toko di dekatnya.", meaning: "便利 berarti praktis atau nyaman; 近くに店がたくさんある berarti ada banyak toko di dekatnya." },
      { key: "c", label: "Tempatnya selalu tutup saat akhir pekan.", meaning: "Kalimat tidak menyebutkan jam buka." },
    ],
    answer: "b",
    explanation: "Ulasan perjalanan dapat berisi informasi tentang lokasi, transportasi, suasana, dan fasilitas di sekitar.",
  },
];

const practiceTasks: Task[] = [
  {
    prompt: <>Apa arti 「観光地」?</>,
    options: [
      { key: "a", label: "Tempat wisata." },
      { key: "b", label: "Tempat bekerja." },
      { key: "c", label: "Tempat belajar." },
    ],
    answer: "a",
    explanation: <>観光地（かんこうち）berarti tempat wisata atau destinasi wisata.</>,
  },
  {
    prompt: <>Pilih bentuk kemampuan yang benar dari 「遊ぶ」.</>,
    options: [
      { key: "a", label: "遊びます." },
      { key: "b", label: "遊べます." },
      { key: "c", label: "遊んでいます." },
    ],
    answer: "b",
    explanation: <>遊ぶ berubah menjadi 遊べる dalam bentuk potensial, lalu menjadi 遊べます dalam bentuk sopan.</>,
  },
  {
    prompt: <>Lengkapi kalimat: 「景色がきれいな＿＿＿へ行きたいです。」</>,
    options: [
      { key: "a", label: "ところ." },
      { key: "b", label: "交通." },
      { key: "c", label: "予約." },
    ],
    answer: "a",
    explanation: <>ところ berarti tempat. 景色がきれいなところ berarti tempat yang pemandangannya indah.</>,
  },
  {
    prompt: <>Pilih kalimat yang meminta saran tentang tempat menginap.</>,
    options: [
      { key: "a", label: "どこに泊まりますか。" },
      { key: "b", label: "どこに泊まったらいいですか。" },
      { key: "c", label: "どこに泊まったほうがいいです。" },
    ],
    answer: "b",
    explanation: <>V-たらいいですか dipakai untuk meminta saran. 泊まる menjadi 泊まったら.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Sebaiknya memeriksa jadwal bus lebih dahulu”.</>,
    options: [
      { key: "a", label: "バスの時間を調べたほうがいいです。" },
      { key: "b", label: "バスの時間を調べないほうがいいです。" },
      { key: "c", label: "バスの時間を調べたらいいですか。" },
    ],
    answer: "a",
    explanation: <>調べたほうがいいです menyarankan untuk memeriksa atau mencari tahu.</>,
  },
  {
    prompt: <>Apa arti 「口コミ」 pada situs perjalanan?</>,
    options: [
      { key: "a", label: "Jadwal kereta." },
      { key: "b", label: "Peta perjalanan." },
      { key: "c", label: "Ulasan pengguna." },
    ],
    answer: "c",
    explanation: <>口コミ adalah komentar atau ulasan yang dibagikan pengguna berdasarkan pengalaman mereka.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa arti 「自然が豊かです」?</>,
    options: [
      { key: "a", label: "Alamnya melimpah atau kaya." },
      { key: "b", label: "Transportasinya ramai." },
      { key: "c", label: "Tempatnya sangat jauh." },
    ],
    answer: "a",
    explanation: <>自然 berarti alam, sedangkan 豊か berarti kaya atau melimpah.</>,
  },
  {
    prompt: <>Pilih bentuk potensial dari 「食べる」.</>,
    options: [
      { key: "a", label: "食べて." },
      { key: "b", label: "食べられる." },
      { key: "c", label: "食べない." },
    ],
    answer: "b",
    explanation: <>食べる berubah menjadi 食べられる untuk menyatakan bisa makan.</>,
  },
  {
    prompt: <>Apa arti 「遊べるところ」?</>,
    options: [
      { key: "a", label: "Tempat yang harus ditinggalkan." },
      { key: "b", label: "Tempat yang sedang dibangun." },
      { key: "c", label: "Tempat untuk bisa bermain." },
    ],
    answer: "c",
    explanation: <>遊べる adalah bentuk potensial dari 遊ぶ. Jika diletakkan sebelum ところ, artinya tempat untuk bisa bermain.</>,
  },
  {
    prompt: <>Pilih ungkapan yang berarti “Saya dengar Kyoto adalah kota tua”.</>,
    options: [
      { key: "a", label: "京都は古い町だって聞きました。" },
      { key: "b", label: "京都で古い町を予約しました。" },
      { key: "c", label: "京都は古い町に出発しました。" },
    ],
    answer: "a",
    explanation: <>S bentuk biasa + って聞きました digunakan untuk menyampaikan informasi yang didengar.</>,
  },
  {
    prompt: <>Apa arti 「どこに泊まったらいいですか」?</>,
    options: [
      { key: "a", label: "Di mana saya sudah menginap?" },
      { key: "b", label: "Sebaiknya saya menginap di mana?" },
      { key: "c", label: "Di mana saya tidak boleh menginap?" },
    ],
    answer: "b",
    explanation: <>V-たらいいですか digunakan untuk meminta saran. 泊まったら berarti jika menginap.</>,
  },
  {
    prompt: <>Apa makna 「早く予約したほうがいいですよ」?</>,
    options: [
      { key: "a", label: "Jangan membuat reservasi lebih awal." },
      { key: "b", label: "Apakah saya harus membuat reservasi?" },
      { key: "c", label: "Sebaiknya membuat reservasi lebih awal." },
    ],
    answer: "c",
    explanation: <>V-たほうがいい memberikan saran tentang tindakan yang sebaiknya dilakukan.</>,
  },
  {
    prompt: <>Apa makna 「日曜日は行かないほうがいいです」?</>,
    options: [
      { key: "a", label: "Sebaiknya tidak pergi pada hari Minggu." },
      { key: "b", label: "Sebaiknya pergi setiap hari Minggu." },
      { key: "c", label: "Saya pergi pada hari Minggu." },
    ],
    answer: "a",
    explanation: <>V-ないほうがいい digunakan untuk menyarankan agar tidak melakukan sesuatu.</>,
  },
  {
    prompt: <>Bagaimana membaca kanji 「自然」?</>,
    options: [
      { key: "a", label: "こうつう · koutsuu." },
      { key: "b", label: "しぜん · shizen." },
      { key: "c", label: "けいかく · keikaku." },
    ],
    answer: "b",
    explanation: <>自然 dibaca しぜん (shizen), artinya alam.</>,
  },
  {
    prompt: <>Apa arti 「出発します」?</>,
    options: [
      { key: "a", label: "Tiba." },
      { key: "b", label: "Mencari tahu." },
      { key: "c", label: "Berangkat." },
    ],
    answer: "c",
    explanation: <>出発する berarti berangkat atau memulai perjalanan.</>,
  },
  {
    prompt: <>Informasi apa yang bisa ditemukan dari ulasan penginapan?</>,
    options: [
      { key: "a", label: "Lokasi, suasana, fasilitas sekitar, dan harga." },
      { key: "b", label: "Nilai ujian dan jadwal kelas." },
      { key: "c", label: "Nama semua penumpang kereta." },
    ],
    answer: "a",
    explanation: <>Ulasan perjalanan dapat menjelaskan lokasi, suasana, transportasi, fasilitas, dan biaya.</>,
  },
];

export default function IrodoriElementaryTwoLessonFivePage() {
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
      <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#88C39D]/40 hover:text-[#EAE6DD]">
        <ArrowLeft size={15} /> Kembali ke Dasar 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#438A61]/35 bg-gradient-to-br from-[#1D3B2D] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#A8D5B5]/[0.08]">旅</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#A8D5B5]">IRODORI • DASAR 2 A2 • PELAJARAN 05</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Sebaiknya pesan tempat lebih awal.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A8D5B5]">早く予約したほうがいいですよ</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar memahami gambaran tempat wisata, membicarakan rencana perjalanan, meminta dan memberi saran, serta membaca ulasan perjalanan.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Plane size={14} className="text-[#A8D5B5]" />Rencana perjalanan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><MapPin size={14} className="text-[#A8D5B5]" />Destinasi wisata</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Star size={14} className="text-[#A8D5B5]" />Ulasan perjalanan</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#438A61]/20 bg-[#1D3026]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A8D5B5]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target berikut sesuai target komunikasi 19–22 pada Irodori Dasar 2 Lesson 5.</p>
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">KOSAKATA PERJALANAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Destinasi, transportasi, dan persiapan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenali kata-kata untuk menjelaskan tempat wisata, menentukan tujuan, memilih transportasi, dan menyiapkan perjalanan.</p>
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">MENGENAL DESTINASI</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tempat seperti apa, dan apa yang bisa dilakukan?</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Deskripsi singkat membantu kita membayangkan suasana tempat dan kegiatan yang tersedia. Contoh berikut adalah materi latihan bahasa.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              name: "北海道 · Hokkaido",
              feature: "自然が豊かで、食べ物がおいしいところです。",
              meaning: "Tempat dengan alam yang melimpah dan makanan yang enak.",
              activity: "新鮮な魚が食べられます。",
              activityMeaning: "Bisa menikmati ikan segar.",
            },
            {
              name: "京都 · Kyoto",
              feature: "古い町で、歴史のある建物が多いです。",
              meaning: "Kota tua dengan banyak bangunan bersejarah.",
              activity: "古い町並みが見られます。",
              activityMeaning: "Bisa melihat kawasan kota tua.",
            },
            {
              name: "沖縄 · Okinawa",
              feature: "海がきれいで、暖かいところです。",
              meaning: "Tempat yang lautnya indah dan berhawa hangat.",
              activity: "水族館で魚が見られます。",
              activityMeaning: "Bisa melihat ikan di akuarium.",
            },
          ].map((place) => (
            <article key={place.name} className="rounded-2xl border border-[#438A61]/20 bg-[#1D3026]/65 p-4">
              <p className="text-[9px] font-black tracking-[0.14em] text-[#A8D5B5]">DESTINASI CONTOH</p>
              <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">{place.name}</h3>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{place.feature}</p>
              <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{place.meaning}</p>
              <div className="mt-3 border-t border-white/[0.07] pt-3">
                <p className="font-mincho text-sm leading-7 text-[#A8D5B5]">{place.activity}</p>
                <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{place.activityMeaning}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">MERENCANAKAN PERJALANAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tujuan, kegiatan, dan cara pergi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Saat menyusun rencana bersama teman, sampaikan tempat yang diinginkan, kegiatan yang menarik, dan pilihan transportasi.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["景色がきれいなところがいいです。", "Keshiki ga kirei na tokoro ga ii desu.", "Saya ingin tempat yang pemandangannya indah."],
            ["自然が豊かなところに行きたいです。", "Shizen ga yutaka na tokoro ni ikitai desu.", "Saya ingin pergi ke tempat yang alamnya melimpah."],
            ["湖が見られる場所はどうですか。", "Mizuumi ga mirareru basho wa dou desu ka?", "Bagaimana tempat yang memiliki danau untuk dilihat?"],
            ["電車で行けるところがいいです。", "Densha de ikeru tokoro ga ii desu.", "Saya ingin tempat yang bisa dicapai dengan kereta."],
            ["そこで何をしますか。", "Soko de nani o shimasu ka?", "Di sana kita akan melakukan apa?"],
            ["お土産を買えるところがありますか。", "Omiyage o kaeru tokoro ga arimasu ka?", "Apakah ada tempat untuk membeli oleh-oleh?"],
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">MEMINTA DAN MEMBERI SARAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Apa yang sebaiknya dilakukan?</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan V-たらいいですか untuk meminta saran. Jawaban dapat menggunakan V-たほうがいい atau V-ないほうがいい.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["どこに泊まったらいいですか。", "Doko ni tomattara ii desu ka?", "Sebaiknya saya menginap di mana?"],
            ["何を持って行ったらいいですか。", "Nani o motte ittara ii desu ka?", "Apa yang sebaiknya saya bawa?"],
            ["早く予約したほうがいいですよ。", "Hayaku yoyaku shita hou ga ii desu yo.", "Sebaiknya buat reservasi lebih awal."],
            ["混む時間に行かないほうがいいです。", "Komu jikan ni ikanai hou ga ii desu.", "Sebaiknya tidak pergi pada jam ramai."],
            ["天気を調べたほうがいいですよ。", "Tenki o shirabeta hou ga ii desu yo.", "Sebaiknya periksa cuaca."],
            ["時間に余裕を持ったほうがいいです。", "Jikan ni yoyuu o motta hou ga ii desu.", "Sebaiknya sediakan waktu yang cukup."],
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">MEMBACA ULASAN PERJALANAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Cari informasi penting dari口コミ</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Ulasan berikut fiktif dan dibuat untuk latihan membaca. Perhatikan lokasi, transportasi, suasana, kelebihan, dan catatan dari pengunjung.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {travelReviews.map((review) => (
            <article key={review.name} className="overflow-hidden rounded-2xl border border-[#438A61]/20 bg-[#1D3026]/65">
              <div className="border-b border-white/[0.06] bg-[#274B36]/70 p-3">
                <p className="text-[9px] font-black tracking-[0.15em] text-[#A8D5B5]">ULASAN FIKTIF</p>
                <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">{review.name}</h3>
                <p className="mt-1 text-[10px] text-[#B6C8B8]">{review.category}</p>
              </div>
              <div className="space-y-3 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#E8D49C]">★ {review.rating}</span>
                  <span className="text-[10px] font-bold text-[#EAE6DD]">{review.price}</span>
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-[0.12em] text-[#A8D5B5]">良いところ · KELEBIHAN</p>
                  <p className="mt-1 font-mincho text-xs leading-6 text-[#F1EBDD]">{review.good}</p>
                  <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{review.goodMeaning}</p>
                </div>
                <div className="border-t border-white/[0.06] pt-2">
                  <p className="text-[9px] font-black tracking-[0.12em] text-[#D9B66D]">メモ · CATATAN</p>
                  <p className="mt-1 font-mincho text-xs leading-6 text-[#F1EBDD]">{review.note}</p>
                  <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{review.noteMeaning}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3 text-[10px] leading-5 text-[#A9A398]">Nama penginapan, rating, dan harga di atas hanya data fiktif untuk latihan membaca, bukan ulasan atau harga akomodasi sungguhan.</p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#A8D5B5]" />
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">KOSAKATA KANJI</p>
            <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kosakata kanji pada pelajaran ini</h2>
          </div>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Kenali kanji untuk alam, transportasi, rencana perjalanan, dan tempat menginap.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Mengenal tempat dan menyusun perjalanan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Dialog dibuat orisinal oleh Fude berdasarkan target komunikasi pelajaran ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Mendengarkan gambaran destinasi wisata" speakers={[friendYui, friendSota]} utterances={destinationIntroductionConversation} />
          <IrodoriConversation title="Membicarakan rencana perjalanan" speakers={[friendAkiko, friendKenji]} utterances={planTripConversation} />
          <IrodoriConversation title="Meminta saran tempat menginap" speakers={[friendSota, friendYui]} utterances={askTravelAdviceConversation} />
          <IrodoriConversation title="Meminta saran barang persiapan" speakers={[friendAkiko, friendKenji]} utterances={travelPreparationConversation} />
          <IrodoriConversation title="Membicarakan ulasan perjalanan" speakers={[friendYui, friendSota]} utterances={travelReviewConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Bertanya, menjelaskan, dan berbagi rekomendasi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Dialog dibuat orisinal oleh Fude berdasarkan target komunikasi pelajaran ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Meminta rekomendasi tempat makan" speakers={[friendYui, friendSota]} utterances={destinationIntroductionConversation} />
          <IrodoriConversation title="Memahami petunjuk cara makan" speakers={[friendAkiko, friendKenji]} utterances={planTripConversation} />
          <IrodoriConversation title="Bertanya tentang saus dan cara makan" speakers={[friendSota, friendYui]} utterances={askTravelAdviceConversation} />
          <IrodoriConversation title="Memperkenalkan hidangan Indonesia" speakers={[friendAkiko, friendKenji]} utterances={travelPreparationConversation} />
          <IrodoriConversation title="Membicarakan ulasan restoran" speakers={[friendYui, friendSota]} utterances={travelReviewConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima pola untuk menjelaskan tempat dan memberi saran</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari cara menyatakan kemampuan, menggambarkan tempat, menyampaikan informasi yang didengar, meminta saran, dan memberi saran.</p>
        </div>
        {[
          {
            title: "01 · Menyatakan kemampuan",
            pattern: "V-可能形 · bentuk potensial",
            example: <>新鮮な魚が食べられます。<br />湖が見られます。<br />電車で行けます。</>,
            note: "Bentuk potensial menyatakan bahwa seseorang bisa melakukan sesuatu atau sesuatu dapat dilakukan. Contoh: 食べる → 食べられる, 見る → 見られる, 行く → 行ける. Bentuk sopannya adalah 食べられます, 見られます, dan 行けます.",
          },
          {
            title: "02 · Menjelaskan tempat",
            pattern: "～ところ",
            example: <>遊べるところはありますか。<br />景色がきれいなところに行きたいです。</>,
            note: "ところ berarti tempat. Kata atau kalimat sebelum ところ menjelaskan tempat seperti apa yang dimaksud. Contohnya 遊べるところ berarti tempat untuk bisa bermain, sedangkan 景色がきれいなところ berarti tempat yang pemandangannya indah.",
          },
          {
            title: "03 · Menyampaikan informasi yang didengar",
            pattern: "S (plain-form) って聞きました ／ って言っていました",
            example: <>京都は古い町だって聞きました。<br />バスが便利だって友だちが言っていました。</>,
            note: "Pola ini digunakan untuk menyampaikan kabar, reputasi, atau informasi yang didengar dari orang lain. って adalah bentuk percakapan dari と yang menandai kutipan. Untuk kata benda dan kata sifat-na, gunakan だって: 古い町だって, 便利だって.",
          },
          {
            title: "04 · Meminta saran",
            pattern: "【kata tanya】V-たらいいですか",
            example: <>何で行ったらいいですか。<br />どんなところに泊まったらいいですか。</>,
            note: "V-たらいいですか digunakan untuk meminta saran tentang cara, tempat, waktu, atau hal yang perlu dilakukan. Bentuk ini dibangun dari bentuk lampau biasa kata kerja ditambah ら, lalu いいですか. Contohnya 行ったら, 泊まったら, dan 調べたら.",
          },
          {
            title: "05 · Memberi saran",
            pattern: "V-た ／ V-ない ほうがいいです",
            example: <>早く予約したほうがいいですよ。<br />混む時間に行かないほうがいいです。</>,
            note: "V-たほうがいい menyarankan tindakan yang sebaiknya dilakukan. V-ないほうがいい menyarankan agar tindakan tidak dilakukan. Pola ini memberi saran yang lebih tegas dibandingkan V-るといい.",
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
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#438A61]/20 bg-[#1D3026]/70 p-3">
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
                          ? "border-[#A8D5B5]/60 bg-[#438A61]/15 text-[#F1EBDD]"
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
                              ? "border-[#A8D5B5]/60 bg-[#438A61]/15 text-[#F1EBDD]"
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
                              ? "border-[#A8D5B5]/60 bg-[#438A61]/15 text-[#F1EBDD]"
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
              ? "Lesson 5 selesai. Progres tersimpan."
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
            {isCompleted ? "Lesson 5 selesai" : "Selesaikan Lesson 5"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Dasar 2 · 05 / 18</span>
      </div>
    </main>
  );
}
