"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Compass,
  GraduationCap,
  RefreshCw,
  Users,
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
const aoi = { ...speakers.yui, name: "Aoi", role: "Pemandu kelompok" };
const ren = { ...speakers.sota, name: "Ren", role: "Anggota kelompok" };
const hana = { ...speakers.akiko, name: "Hana", role: "Anggota baru" };
const dimas = { ...speakers.kenji, name: "Dimas", role: "Anggota kelompok" };
const lessonId = "elementary2-01";

const staffIntroductionConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>こちらは佐藤さんです。グループの活動を担当しています。</>,
    romaji: "Kochira wa Satou-san desu. Guruupu no katsudou o tantou shite imasu.",
    translation: "Ini Sato. Beliau bertanggung jawab atas kegiatan kelompok.",
    audioFileName: "irodori-elementary2-01-a01-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>はじめまして。佐藤です。どうぞよろしくお願いします。</>,
    romaji: "Hajimemashite. Satou desu. Douzo yoroshiku onegaishimasu.",
    translation: "Salam kenal. Saya Sato. Senang berkenalan dengan Anda.",
    audioFileName: "irodori-elementary2-01-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>こちらは田中さんです。資料の準備を担当しています。</>,
    romaji: "Kochira wa Tanaka-san desu. Shiryou no junbi o tantou shite imasu.",
    translation: "Ini Tanaka. Dia bertanggung jawab menyiapkan bahan.",
    audioFileName: "irodori-elementary2-01-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>わかりました。よろしくお願いします。</>,
    romaji: "Wakarimashita. Yoroshiku onegaishimasu.",
    translation: "Baik, saya mengerti. Senang berkenalan dengan semuanya.",
    audioFileName: "irodori-elementary2-01-a01-l04.mp3",
  },
];

const detailedSelfIntroductionConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>はじめまして。ハナと申します。</>,
    romaji: "Hajimemashite. Hana to moushimasu.",
    translation: "Salam kenal. Nama saya Hana.",
    audioFileName: "irodori-elementary2-01-a02-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ハナと呼んでください。「花」という意味です。</>,
    romaji: "Hana to yonde kudasai. Hana to iu imi desu.",
    translation: "Panggil saya Hana. Namanya berarti bunga.",
    audioFileName: "irodori-elementary2-01-a02-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>インドネシアのソロから来ました。先週、日本に来たばかりです。</>,
    romaji: "Indoneshia no Soro kara kimashita. Senshuu, Nihon ni kita bakari desu.",
    translation: "Saya berasal dari Solo, Indonesia. Saya baru tiba di Jepang minggu lalu.",
    audioFileName: "irodori-elementary2-01-a02-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>来る前に、二年間日本語を勉強していました。どうぞよろしくお願いします。</>,
    romaji: "Kuru mae ni, ninenkan Nihongo o benkyou shite imashita. Douzo yoroshiku onegaishimasu.",
    translation: "Sebelum datang, saya sudah belajar bahasa Jepang selama dua tahun. Senang berkenalan dengan semuanya.",
    audioFileName: "irodori-elementary2-01-a02-l04.mp3",
  },
];

const hometownConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>ハナさんの出身はどちらですか。</>,
    romaji: "Hana-san no shusshin wa dochira desu ka?",
    translation: "Hana berasal dari mana?",
    audioFileName: "irodori-elementary2-01-a03-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>インドネシアのソロという町です。</>,
    romaji: "Indoneshia no Soro to iu machi desu.",
    translation: "Saya berasal dari sebuah kota bernama Solo di Indonesia.",
    audioFileName: "irodori-elementary2-01-a03-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ソロはどんなところですか。</>,
    romaji: "Soro wa donna tokoro desu ka?",
    translation: "Solo itu tempat seperti apa?",
    audioFileName: "irodori-elementary2-01-a03-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ジャワ島の中部にあります。町はにぎやかですが、近くに川や山もあります。</>,
    romaji: "Jawa-tou no chuubu ni arimasu. Machi wa nigiyaka desu ga, chikaku ni kawa ya yama mo arimasu.",
    translation: "Letaknya di bagian tengah Pulau Jawa. Kotanya ramai, tetapi di sekitarnya juga ada sungai dan gunung.",
    audioFileName: "irodori-elementary2-01-a03-l04.mp3",
  },
];

const pastExperienceConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>日本に来る前は、何をしていましたか。</>,
    romaji: "Nihon ni kuru mae wa, nani o shite imashita ka?",
    translation: "Sebelum datang ke Jepang, kamu melakukan apa?",
    audioFileName: "irodori-elementary2-01-a04-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>学校で日本語を勉強していました。</>,
    romaji: "Gakkou de Nihongo o benkyou shite imashita.",
    translation: "Saya dulu belajar bahasa Jepang di sekolah.",
    audioFileName: "irodori-elementary2-01-a04-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>そうですか。日本語の勉強はどうでしたか。</>,
    romaji: "Sou desu ka. Nihongo no benkyou wa dou deshita ka?",
    translation: "Begitu, ya. Bagaimana pengalaman belajar bahasa Jepangnya?",
    audioFileName: "irodori-elementary2-01-a04-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>楽しかったです。日本の文化についても勉強しました。</>,
    romaji: "Tanoshikatta desu. Nihon no bunka ni tsuite mo benkyou shimashita.",
    translation: "Menyenangkan. Saya juga belajar tentang budaya Jepang.",
    audioFileName: "irodori-elementary2-01-a04-l04.mp3",
  },
];

const snsIntroductionConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>日本語のグループに自己紹介を書きましたか。</>,
    romaji: "Nihongo no guruupu ni jikoshoukai o kakimashita ka?",
    translation: "Apakah kamu sudah menulis perkenalan di grup bahasa Jepang?",
    audioFileName: "irodori-elementary2-01-a05-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>はい。出身や趣味、日本語の勉強について書きました。</>,
    romaji: "Hai. Shusshin ya shumi, Nihongo no benkyou ni tsuite kakimashita.",
    translation: "Ya. Saya menulis tentang asal, hobi, dan pengalaman belajar bahasa Jepang.",
    audioFileName: "irodori-elementary2-01-a05-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>いいですね。私もあとで読んでみます。</>,
    romaji: "Ii desu ne. Watashi mo ato de yonde mimasu.",
    translation: "Bagus. Nanti saya juga akan membacanya.",
    audioFileName: "irodori-elementary2-01-a05-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>ありがとうございます。これから一生懸命がんばります。</>,
    romaji: "Arigatou gozaimasu. Kore kara isshoukenmei ganbarimasu.",
    translation: "Terima kasih. Mulai sekarang saya akan berusaha dengan sungguh-sungguh.",
    audioFileName: "irodori-elementary2-01-a05-l04.mp3",
  },
];

const canDos = [
  {
    id: "understand-staff-introduction",
    source: "CAN-DO 01",
    text: "Memahami nama dan peran anggota ketika diperkenalkan kepada orang-orang di lingkungan baru.",
  },
  {
    id: "give-detailed-self-introduction",
    source: "CAN-DO 02",
    text: "Memberikan perkenalan diri yang cukup lengkap, seperti nama, asal, pengalaman, dan hobi.",
  },
  {
    id: "talk-about-hometown",
    source: "CAN-DO 03",
    text: "Menceritakan secara sederhana kota asal, ciri-ciri tempat, dan letaknya.",
  },
  {
    id: "write-sns-self-introduction",
    source: "CAN-DO 04",
    text: "Menulis perkenalan singkat di komunitas atau grup media sosial.",
  },
];

const vocabRows = [
  ["担当", "たんとう · tantou", "Tugas atau bagian yang menjadi tanggung jawab"],
  ["役割", "やくわり · yakuwari", "Peran"],
  ["紹介", "しょうかい · shoukai", "Perkenalan"],
  ["出身", "しゅっしん · shusshin", "Asal daerah"],
  ["名前", "なまえ · namae", "Nama"],
  ["意味", "いみ · imi", "Arti atau makna"],
  ["経験", "けいけん · keiken", "Pengalaman"],
  ["趣味", "しゅみ · shumi", "Hobi"],
  ["一生懸命", "いっしょうけんめい · isshoukenmei", "Dengan sungguh-sungguh"],
  ["頑張る", "がんばる · ganbaru", "Berusaha sebaik mungkin"],
  ["先週", "せんしゅう · senshuu", "Minggu lalu"],
  ["来る", "くる · kuru", "Datang"],
  ["働く", "はたらく · hataraku", "Bekerja"],
  ["勉強する", "べんきょうする · benkyou suru", "Belajar"],
  ["山", "やま · yama", "Gunung"],
  ["川", "かわ · kawa", "Sungai"],
  ["海", "うみ · umi", "Laut"],
  ["島", "しま · shima", "Pulau"],
  ["森", "もり · mori", "Hutan"],
  ["首都", "しゅと · shuto", "Ibu kota"],
  ["観光地", "かんこうち · kankouchi", "Tempat wisata"],
  ["都会", "とかい · tokai", "Kota besar"],
  ["にぎやか", "にぎやか · nigiyaka", "Ramai dan hidup"],
  ["のんびり", "のんびり · nonbiri", "Santai dan tenang"],
  ["観光客", "かんこうきゃく · kankoukyaku", "Wisatawan"],
];

const kanjiWords = [
  ["山", "やま · yama", "Gunung"],
  ["川", "かわ · kawa", "Sungai"],
  ["海", "うみ · umi", "Laut"],
  ["島", "しま · shima", "Pulau"],
  ["森", "もり · mori", "Hutan"],
  ["客", "きゃく · kyaku", "Tamu atau pengunjung"],
  ["観光地", "かんこうち · kankouchi", "Tempat wisata"],
  ["意味", "いみ · imi", "Arti atau makna"],
  ["経験", "けいけん · keiken", "Pengalaman"],
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
    title: "01 · Memahami peran anggota",
    heading: "Anggota baru diperkenalkan",
    prompt: "Kamu baru bergabung dengan kelompok. Pemandu menjelaskan bahwa Sato bertanggung jawab atas kegiatan. Pilih ungkapan yang sesuai.",
    japanese: <>佐藤さんはグループの活動を担当しています。</>,
    translation: "Sato bertanggung jawab atas kegiatan kelompok.",
    options: [
      { key: "a", label: "佐藤さんは活動を担当しています。", meaning: "Menjelaskan tugas yang menjadi tanggung jawab Sato." },
      { key: "b", label: "佐藤さんは先週来ました。", meaning: "Mengatakan bahwa Sato datang minggu lalu." },
      { key: "c", label: "佐藤さんは海が好きです。", meaning: "Mengatakan bahwa Sato menyukai laut." },
    ],
    answer: "a",
    explanation: "担当しています menjelaskan peran atau tanggung jawab seseorang.",
  },
  {
    title: "02 · Memperkenalkan diri",
    heading: "Menceritakan waktu kedatangan",
    prompt: "Kamu baru tiba di Jepang minggu lalu. Pilih kalimat yang menyampaikan bahwa kedatangan itu masih baru.",
    japanese: <>先週、日本に来たばかりです。</>,
    translation: "Saya baru saja datang ke Jepang minggu lalu.",
    options: [
      { key: "a", label: "先週、日本に来たばかりです。", meaning: "Menyatakan bahwa baru saja datang minggu lalu." },
      { key: "b", label: "先週、日本に来るつもりです。", meaning: "Menyatakan rencana datang minggu lalu, bentuk waktu tidak sesuai." },
      { key: "c", label: "先週、日本に来てください。", meaning: "Meminta orang lain datang minggu lalu." },
    ],
    answer: "a",
    explanation: "V-たばかりです menyatakan suatu tindakan baru saja selesai atau terjadi belum lama ini.",
  },
  {
    title: "03 · Menceritakan kota asal",
    heading: "Menggambarkan tempat",
    prompt: "Kamu ingin menjelaskan bahwa daerah asalmu memiliki sungai dan gunung serta suasananya cukup tenang.",
    japanese: <>川や山があって、のんびりしています。</>,
    translation: "Ada sungai dan gunung, dan suasananya tenang.",
    options: [
      { key: "a", label: "川や山があって、のんびりしています。", meaning: "Menggabungkan ciri tempat dan suasananya." },
      { key: "b", label: "川や山を呼んでください。", meaning: "Meminta seseorang memanggil sungai dan gunung." },
      { key: "c", label: "川や山に来たばかりです。", meaning: "Mengatakan baru datang ke sungai dan gunung." },
    ],
    answer: "a",
    explanation: "Bentuk 〜て dapat menghubungkan dua informasi, misalnya keberadaan alam dan suasana sebuah kota.",
  },
  {
    title: "04 · Memahami arti nama",
    heading: "Menjelaskan makna sebuah kata",
    prompt: "Seseorang bertanya arti nama Hana. Pilih pola yang tepat untuk menjelaskan maknanya.",
    japanese: <>ハナは「花」という意味です。</>,
    translation: "Hana berarti bunga.",
    options: [
      { key: "a", label: "ハナは「花」という意味です。", meaning: "Menggunakan という untuk menyebut nama atau istilah." },
      { key: "b", label: "ハナは「花」と来ました。", meaning: "Menggabungkan kata dengan kata kerja datang secara tidak tepat." },
      { key: "c", label: "ハナは「花」に頑張ります。", meaning: "Menggunakan partikel dan kata kerja yang tidak sesuai." },
    ],
    answer: "a",
    explanation: "N1というN2 memperkenalkan nama atau istilah, seperti 「花」という意味, yang berarti makna bernama atau berupa bunga.",
  },
  {
    title: "05 · Menulis perkenalan di SNS",
    heading: "Membuat profil singkat",
    prompt: "Pilih perkenalan yang memuat nama, asal, hobi, dan salam penutup secara alami.",
    japanese: <>はじめまして。ハナです。ソロ出身です。趣味は写真を撮ることです。よろしくお願いします。</>,
    translation: "Salam kenal. Saya Hana, berasal dari Solo. Hobi saya memotret. Senang berkenalan dengan semuanya.",
    options: [
      { key: "a", label: "はじめまして。ハナです。ソロ出身です。趣味は写真を撮ることです。よろしくお願いします。", meaning: "Memuat nama, asal, hobi, dan salam penutup." },
      { key: "b", label: "先週です。山です。川です。", meaning: "Hanya menyebut beberapa kata tanpa membentuk perkenalan." },
      { key: "c", label: "花という来ました。趣味は意味です。", meaning: "Susunan pola kalimat dan maknanya tidak tepat." },
    ],
    answer: "a",
    explanation: "Perkenalan singkat yang jelas dapat mencakup sapaan, nama, tempat asal, hobi, dan ungkapan penutup.",
  },
];

const practiceTasks: Task[] = [
  {
    prompt: <>Dalam pola 「N1というN2」, apa fungsi という?</>,
    options: [
      { key: "a", label: "Menghubungkan nama atau istilah dengan keterangan tentangnya." },
      { key: "b", label: "Menyatakan tindakan yang baru selesai." },
      { key: "c", label: "Menyatakan larangan." },
    ],
    answer: "a",
    explanation: <>Contoh 「花」という意味 berarti makna dari kata atau nama “Hana” adalah bunga.</>,
  },
  {
    prompt: <>Pilih bentuk yang berarti “Saya baru saja datang ke Jepang”.</>,
    options: [
      { key: "a", label: "日本に来たばかりです。" },
      { key: "b", label: "日本に来ていました。" },
      { key: "c", label: "日本に来ることです。" },
    ],
    answer: "a",
    explanation: <>来た adalah bentuk lampau biasa dari 来ます. Tambahkan ばかりです untuk menyatakan bahwa tindakan itu baru saja terjadi.</>,
  },
  {
    prompt: <>Apa makna 「前は図書館で勉強していました」?</>,
    options: [
      { key: "a", label: "Dulu saya belajar di perpustakaan." },
      { key: "b", label: "Saya akan belajar di perpustakaan." },
      { key: "c", label: "Saya baru saja tiba di perpustakaan." },
    ],
    answer: "a",
    explanation: <>V-ていました dapat menjelaskan kegiatan atau keadaan yang berlangsung atau menjadi kebiasaan pada masa lalu.</>,
  },
  {
    prompt: <>Pada kalimat 「ソロに大きい図書館があります。そこは静かです」, kata そこ merujuk pada …</>,
    options: [
      { key: "a", label: "Tempat yang baru saja disebutkan, yaitu perpustakaan." },
      { key: "b", label: "Orang yang sedang berbicara." },
      { key: "c", label: "Waktu minggu lalu." },
    ],
    answer: "a",
    explanation: <>そこ dapat menunjuk kembali pada tempat yang sudah disebutkan dalam konteks percakapan.</>,
  },
  {
    prompt: <>Pilih kalimat yang menggabungkan dua ciri sebuah kota dengan alami.</>,
    options: [
      { key: "a", label: "山があって、川もあります。" },
      { key: "b", label: "山を意味します、川から。" },
      { key: "c", label: "山に来たばかりを川。" },
    ],
    answer: "a",
    explanation: <>Bentuk 〜て dapat menyambungkan informasi, misalnya “ada gunung dan ada sungai juga”.</>,
  },
  {
    prompt: <>Apa yang sebaiknya dimasukkan ke dalam perkenalan singkat di grup bahasa?</>,
    options: [
      { key: "a", label: "Nama, asal, hobi, dan sedikit informasi yang ingin dibagikan." },
      { key: "b", label: "Kata-kata acak tanpa keterangan." },
      { key: "c", label: "Hanya alamat pribadi yang sangat rinci." },
    ],
    answer: "a",
    explanation: <>Perkenalan sederhana cukup menyampaikan informasi umum yang relevan. Tidak perlu membagikan alamat atau data pribadi yang rinci.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa arti 「出身」?</>,
    options: [
      { key: "a", label: "Tempat asal." },
      { key: "b", label: "Tempat tujuan." },
      { key: "c", label: "Tempat kerja." },
    ],
    answer: "a",
    explanation: <>出身（しゅっしん）menyatakan asal seseorang.</>,
  },
  {
    prompt: <>Pilih ungkapan yang berarti “Saya bernama Hana” dengan lebih sopan.</>,
    options: [
      { key: "a", label: "ハナと申します。" },
      { key: "b", label: "ハナに来ます。" },
      { key: "c", label: "ハナで働きます。" },
    ],
    answer: "a",
    explanation: <>〜と申します adalah bentuk perkenalan yang lebih sopan daripada 〜と言います.</>,
  },
  {
    prompt: <>Apa arti 「一生懸命」?</>,
    options: [
      { key: "a", label: "Dengan sungguh-sungguh." },
      { key: "b", label: "Dengan sangat jauh." },
      { key: "c", label: "Dengan sangat lambat." },
    ],
    answer: "a",
    explanation: <>一生懸命（いっしょうけんめい）menjelaskan usaha yang dilakukan dengan serius dan sepenuh tenaga.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Saya baru saja datang minggu lalu”.</>,
    options: [
      { key: "a", label: "先週、来たばかりです。" },
      { key: "b", label: "先週、来る前です。" },
      { key: "c", label: "先週、来てください。" },
    ],
    answer: "a",
    explanation: <>来たばかりです menyatakan baru saja datang.</>,
  },
  {
    prompt: <>Apa makna 「日本に来る前に、勉強していました」?</>,
    options: [
      { key: "a", label: "Sebelum datang ke Jepang, saya sedang atau dahulu belajar." },
      { key: "b", label: "Setelah datang ke Jepang, saya akan belajar." },
      { key: "c", label: "Saya baru selesai mengajar di Jepang." },
    ],
    answer: "a",
    explanation: <>〜ていました menunjukkan kegiatan yang berlangsung atau menjadi kebiasaan pada masa lalu.</>,
  },
  {
    prompt: <>Pada 「ホアは『花』という意味です」, apa fungsi という?</>,
    options: [
      { key: "a", label: "Memperkenalkan arti atau nama suatu istilah." },
      { key: "b", label: "Menandai penerima barang." },
      { key: "c", label: "Menunjukkan waktu lampau." },
    ],
    answer: "a",
    explanation: <>N1というN2 dapat digunakan saat menerangkan makna sebuah nama atau istilah.</>,
  },
  {
    prompt: <>Kata 「観光地」 berarti …</>,
    options: [
      { key: "a", label: "Tempat wisata." },
      { key: "b", label: "Tempat belajar." },
      { key: "c", label: "Tempat tinggal." },
    ],
    answer: "a",
    explanation: <>観光地（かんこうち）adalah tempat yang dikunjungi untuk wisata.</>,
  },
  {
    prompt: <>Kalimat 「首都だから、都会です」 memakai から untuk …</>,
    options: [
      { key: "a", label: "Menyatakan alasan: karena merupakan ibu kota." },
      { key: "b", label: "Menyatakan tujuan perjalanan." },
      { key: "c", label: "Menyatakan tempat asal." },
    ],
    answer: "a",
    explanation: <>Dalam kalimat ini, から menyatakan alasan atau sebab.</>,
  },
  {
    prompt: <>Apa fungsi けど pada 「首都ではないけど、にぎやかです」?</>,
    options: [
      { key: "a", label: "Menghubungkan dua hal yang berlawanan atau kontras." },
      { key: "b", label: "Menyatakan waktu yang baru saja lewat." },
      { key: "c", label: "Menyatakan kepemilikan." },
    ],
    answer: "a",
    explanation: <>けど berarti “tetapi” dan menghubungkan dua informasi yang kontras.</>,
  },
  {
    prompt: <>Informasi apa yang paling sesuai untuk perkenalan di komunitas bahasa Jepang?</>,
    options: [
      { key: "a", label: "Nama, asal secara umum, hobi, dan tujuan belajar." },
      { key: "b", label: "Nomor sandi dan informasi akun pribadi." },
      { key: "c", label: "Alamat rumah lengkap dan data rahasia." },
    ],
    answer: "a",
    explanation: <>Perkenalan dapat berisi informasi umum yang aman dan relevan dengan komunitas.</>,
  },
];

export default function IrodoriElementaryTwoLessonOnePage() {
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
      <Link
        href="/irodori/elementary-2"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#86A9D0]/40 hover:text-[#EAE6DD]"
      >
        <ArrowLeft size={15} />
        Kembali ke Elementary 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#486C91]/35 bg-gradient-to-br from-[#20364C] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#A9C9E8]/[0.08]">人</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#A9C9E8]">IRODORI • ELEMENTARY 2 A2 • LESSON 01</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">I just came to Japan last week.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9C9E8]">先週、日本に来たばかりです</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar memahami peran orang di lingkungan baru, memperkenalkan diri dengan lebih lengkap, menceritakan kota asal, dan menulis profil singkat pada komunitas daring.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9C9E8}" />Perkenalan dan peran</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Compass size={14} className="text-[#A9C9E8}" />Kota asal dan lingkungan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><GraduationCap size={14} className="text-[#A9C9E8}" />Pengalaman belajar</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#486C91]/20 bg-[#202A35]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A9C9E8]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target komunikasi ini mengikuti Can-do resmi Irodori Elementary 2 Lesson 1.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9C9E8]">{item.source} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">KOSAKATA PERKENALAN DAN KOTA ASAL</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Orang, pengalaman, dan lingkungan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kata yang sering digunakan saat memperkenalkan seseorang, menceritakan pengalaman, dan menggambarkan tempat asal.</p>
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Bertemu orang baru dan bertukar cerita</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua percakapan dibuat orisinal oleh Fude berdasarkan tujuan komunikasi lesson ini. Nama dan situasinya merupakan contoh fiktif.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Memahami peran anggota kelompok" speakers={[aoi, hana, dimas, ren]} utterances={staffIntroductionConversation} />
          <IrodoriConversation title="Memberikan perkenalan diri yang lebih lengkap" speakers={[hana]} utterances={detailedSelfIntroductionConversation} />
          <IrodoriConversation title="Menceritakan kota asal" speakers={[aoi, hana]} utterances={hometownConversation} />
          <IrodoriConversation title="Membicarakan pengalaman sebelumnya" speakers={[ren, hana]} utterances={pastExperienceConversation} />
          <IrodoriConversation title="Menulis perkenalan pada grup belajar" speakers={[aoi, hana]} utterances={snsIntroductionConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">MEMPERKENALKAN ORANG</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Nama dan peran anggota</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan こちらは…です untuk memperkenalkan seseorang dengan sopan, lalu jelaskan tugas atau perannya.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["こちらは佐藤さんです。", "Kochira wa Satou-san desu.", "Ini Sato."],
            ["グループの活動を担当しています。", "Guruupu no katsudou o tantou shite imasu.", "Bertanggung jawab atas kegiatan kelompok."],
            ["資料の準備を担当しています。", "Shiryou no junbi o tantou shite imasu.", "Bertanggung jawab menyiapkan bahan."],
            ["わからないことがあったら、聞いてください。", "Wakaranai koto ga attara, kiite kudasai.", "Kalau ada yang belum dipahami, silakan bertanya."],
          ].map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base leading-7 text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#A9C9E8]">{reading}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">PERKENALAN DIRI</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Susun informasi secara berurutan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Perkenalan dapat memuat nama dan panggilan, arti nama, tempat asal, waktu kedatangan, pengalaman, serta hobi.</p>
        </div>
        <div className="space-y-2">
          {[
            ["はじめまして。", "Hajimemashite.", "Salam kenal."],
            ["ハナと申します。ハナと呼んでください。", "Hana to moushimasu. Hana to yonde kudasai.", "Nama saya Hana. Silakan panggil saya Hana."],
            ["ハナは「花」という意味です。", "Hana wa 'hana' to iu imi desu.", "Hana berarti bunga."],
            ["インドネシアのソロから来ました。", "Indoneshia no Soro kara kimashita.", "Saya berasal dari Solo, Indonesia."],
            ["先週、日本に来たばかりです。", "Senshuu, Nihon ni kita bakari desu.", "Saya baru tiba di Jepang minggu lalu."],
            ["来る前に、二年間日本語を勉強していました。", "Kuru mae ni, ninenkan Nihongo o benkyou shite imashita.", "Sebelum datang, saya sudah belajar bahasa Jepang selama dua tahun."],
            ["趣味は写真を撮ることです。", "Shumi wa shashin o toru koto desu.", "Hobi saya adalah mengambil foto."],
            ["どうぞよろしくお願いします。", "Douzo yoroshiku onegaishimasu.", "Senang berkenalan dengan semuanya."],
          ].map(([jp, reading, meaning], index) => (
            <article key={jp} className="flex gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#486C91]/35 bg-[#486C91]/10 text-[10px] font-black text-[#A9C9E8]">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">{jp}</p>
                <p className="text-[9px] text-[#A9C9E8]">{reading}</p>
                <p className="mt-1 text-xs text-[#A9A398]">{meaning}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">KOTA ASAL</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menjelaskan ciri dan lokasi sebuah kota</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Kamu dapat menyebutkan nama kota, letak geografis, suasana, dan hal menarik yang ada di sana.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["出身はどちらですか。", "Shusshin wa dochira desu ka?", "Dari mana asal Anda?"],
            ["ソロという町です。", "Soro to iu machi desu.", "Sebuah kota bernama Solo."],
            ["ジャワ島の中部にあります。", "Jawa-tou no chuubu ni arimasu.", "Terletak di bagian tengah Pulau Jawa."],
            ["山や川があって、のんびりしています。", "Yama ya kawa ga atte, nonbiri shite imasu.", "Ada gunung dan sungai, suasananya tenang."],
            ["首都ではないけど、とてもにぎやかです。", "Shuto dewa nai kedo, totemo nigiyaka desu.", "Bukan ibu kota, tetapi sangat ramai."],
            ["観光地としても知られています。", "Kankouchi to shite mo shirarete imasu.", "Juga dikenal sebagai tempat wisata."],
          ].map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base leading-7 text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#A9C9E8]">{reading}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">KANJI WORDS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kosakata kanji pada lesson ini</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan bentuk kanji, cara baca, dan maknanya. Kata-kata ini juga muncul dalam materi kota asal dan pengalaman.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <p className="font-mincho text-xl text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#A9C9E8]">{reading}</p>
              <p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">PERKENALAN DI KOMUNITAS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Contoh tulisan profil sederhana</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Berikut contoh unggahan fiktif pada grup belajar bahasa. Cukup bagikan informasi umum yang nyaman untuk diketahui anggota lain.</p>
        </div>
        <article className="overflow-hidden rounded-2xl border border-[#486C91]/25 bg-[#202A35]">
          <div className="border-b border-white/[0.08] bg-[#293D52] px-4 py-3">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#A9C9E8]">GRUP BELAJAR · CONTOH FIKTIF</p>
            <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">ハナ · Hana</h3>
            <p className="mt-1 text-[9px] text-[#A9A398]">Perkenalan anggota baru</p>
          </div>
          <div className="space-y-3 p-4">
            <p className="font-mincho text-sm leading-8 text-[#F1EBDD]">はじめまして。ハナです。インドネシアのソロ出身です。先週、日本に来たばかりです。趣味は写真を撮ることです。日本語を一生懸命勉強しています。どうぞよろしくお願いします。</p>
            <p className="text-xs leading-6 text-[#A9A398]">Salam kenal. Saya Hana, berasal dari Solo, Indonesia. Saya baru tiba di Jepang minggu lalu. Hobi saya memotret. Saya belajar bahasa Jepang dengan sungguh-sungguh. Senang berkenalan dengan semuanya.</p>
          </div>
          <p className="border-t border-white/[0.08] px-4 py-3 text-[10px] leading-5 text-[#A9A398]">Nama dan profil tersebut dibuat khusus untuk latihan. Tidak mewakili akun atau orang sungguhan.</p>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima pola untuk perkenalan dan deskripsi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pola berikut membantu menyebut nama dan arti, menceritakan pengalaman yang baru terjadi, serta menghubungkan deskripsi.</p>
        </div>
        {[
          {
            title: "01 · Nama atau istilah",
            pattern: "N1 ＋ という ＋ N2",
            example: <>ハナは「花」という意味です。<br />ソロという町から来ました。</>,
            note: "という digunakan untuk memperkenalkan nama atau istilah. Dalam 「花」という意味, kata 花 diterangkan sebagai makna nama Hana. Dalam 「ソロという町」, Solo diterangkan sebagai nama kota.",
          },
          {
            title: "02 · Baru saja melakukan sesuatu",
            pattern: "V-た ＋ ばかりです",
            example: <>先週、日本に来たばかりです。<br />さっき、学校から帰ったばかりです。</>,
            note: "ばかりです mengikuti kata kerja bentuk biasa lampau (V-た) untuk menyatakan bahwa suatu tindakan baru saja terjadi atau belum lama berlalu. Bentuk ini menekankan kesan masih baru.",
          },
          {
            title: "03 · Kegiatan pada masa lalu",
            pattern: "V-て ＋ いました",
            example: <>前は、学校で日本語を勉強していました。<br />子どものころ、よく川で遊んでいました。</>,
            note: "ていました dapat menggambarkan kegiatan yang sedang berlangsung atau menjadi kebiasaan pada masa lalu. Bentuk ini sering dipakai untuk menceritakan pengalaman sebelumnya.",
          },
          {
            title: "04 · Menunjuk kembali pada konteks",
            pattern: "それ ／ そこ",
            example: <>ソロに大きい図書館があります。そこは静かです。<br />日本語の本を読みました。それはとてもおもしろかったです。</>,
            note: "それ menunjuk kembali pada benda atau hal yang sudah disebutkan. そこ menunjuk kembali pada tempat yang telah disebutkan. Makna tepatnya bergantung pada konteks percakapan.",
          },
          {
            title: "05 · Menghubungkan deskripsi",
            pattern: "V-て、～ ／ ～から、～ ／ ～けど、～",
            example: <>山があって、自然がきれいです。<br />首都だから、にぎやかです。<br />首都ではないけど、とても便利です。</>,
            note: "て menghubungkan beberapa ciri atau tindakan. から dapat menyatakan alasan (karena). けど berarti tetapi dan menghubungkan dua informasi yang berlawanan.",
          },
        ].map((item) => (
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
              <div className="mt-3 rounded-xl border border-[#486C91]/20 bg-[#202A35]/70 p-3">
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
                          ? "border-[#A9C9E8]/60 bg-[#486C91]/20 text-[#F1EBDD]"
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
                  {isCorrect ? task.explanation : "Coba tinjau kembali pola kalimat dan pilih jawaban lain."}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] text-[#817A73]">{isCorrect ? "Situasi selesai" : "Pilih jawaban lalu periksa"}</p>
                <button
                  type="button"
                  disabled={!selected || isCorrect}
                  onClick={() => setSimulationChecked((current) => ({ ...current, [index]: true }))}
                  className="rounded-lg bg-[#486C91] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#3B5E82] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
                >
                  {isCorrect ? "Selesai" : "Periksa"}
                </button>
              </div>
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
                              ? "border-[#A9C9E8]/60 bg-[#486C91]/20 text-[#F1EBDD]"
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
                              ? "border-[#A9C9E8]/60 bg-[#486C91]/20 text-[#F1EBDD]"
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

      <section className="space-y-4 rounded-2xl border border-[#486C91]/20 bg-[#202A35]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#A9C9E8]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi Can-do</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">
          Nilai kemampuanmu setelah lima simulasi benar, enam latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.
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
                        ? "border-[#A9C9E8]/50 bg-[#486C91]/20 text-[#EAF3FC]"
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
              ? "Lesson 1 selesai. Progres tersimpan."
              : canDosRated
                ? "Semua target Can-do sudah dinilai."
                : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button
            type="button"
            onClick={finishLesson}
            disabled={!canComplete || isCompleted}
            className="rounded-xl bg-[#486C91] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#3B5E82] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
          >
            {isCompleted ? "Lesson 1 selesai" : "Selesaikan Lesson 1"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Elementary 2 · 01 / 18</span>
      </div>
    </main>
  );
}
