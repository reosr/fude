"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  RefreshCw,
  Search,
  Star,
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
const guideYui = { ...speakers.yui, name: "Yui", role: "Pemandu kelompok" };
const friendSota = { ...speakers.sota, name: "Sota", role: "Teman" };
const friendAkiko = { ...speakers.akiko, name: "Akiko", role: "Teman" };
const friendKenji = { ...speakers.kenji, name: "Kenji", role: "Teman" };
const lessonId = "elementary2-02";

const findingPersonConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>すみません。アオイさんは、どの人ですか。</>,
    romaji: "Sumimasen. Aoi-san wa dono hito desu ka?",
    translation: "Permisi, yang mana Aoi?",
    audioFileName: "irodori-elementary2-02-a01-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>あそこで本を読んでいる人ですよ。</>,
    romaji: "Asoko de hon o yonde iru hito desu yo.",
    translation: "Yang sedang membaca buku di sana.",
    audioFileName: "irodori-elementary2-02-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>あの、髪が長くて、青いシャツを着ている人ですね。</>,
    romaji: "Ano, kami ga nagakute, aoi shatsu o kite iru hito desu ne.",
    translation: "Oh, yang rambutnya panjang dan memakai kemeja biru itu, ya?",
    audioFileName: "irodori-elementary2-02-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい、そうです。となりにいる人は、アオイさんの友だちです。</>,
    romaji: "Hai, sou desu. Tonari ni iru hito wa, Aoi-san no tomodachi desu.",
    translation: "Ya, benar. Yang di sebelahnya itu teman Aoi.",
    audioFileName: "irodori-elementary2-02-a01-l04.mp3",
  },
];

const describingClothesConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>ケンさんは、どの人ですか。</>,
    romaji: "Ken-san wa, dono hito desu ka?",
    translation: "Ken yang mana?",
    audioFileName: "irodori-elementary2-02-a02-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>黒いめがねをかけている人です。</>,
    romaji: "Kuroi megane o kakete iru hito desu.",
    translation: "Yang memakai kacamata hitam.",
    audioFileName: "irodori-elementary2-02-a02-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>白いシャツを着て、いすに座っている人ですか。</>,
    romaji: "Shiroi shatsu o kite, isu ni suwatte iru hito desu ka?",
    translation: "Yang memakai kemeja putih dan duduk di kursi itu?",
    audioFileName: "irodori-elementary2-02-a02-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>そうです。わかりやすいですね。</>,
    romaji: "Sou desu. Wakariyasui desu ne.",
    translation: "Betul. Penjelasannya mudah dipahami, ya.",
    audioFileName: "irodori-elementary2-02-a02-l04.mp3",
  },
];

const describingPersonalityConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>この写真の人は、どんな人ですか。</>,
    romaji: "Kono shashin no hito wa, donna hito desu ka?",
    translation: "Orang di foto ini seperti apa?",
    audioFileName: "irodori-elementary2-02-a03-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>最初は、まじめそうな人だと思いました。</>,
    romaji: "Saisho wa, majime sou na hito da to omoimashita.",
    translation: "Awalnya, saya kira dia orangnya serius.",
    audioFileName: "irodori-elementary2-02-a03-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>本当はどうですか。</>,
    romaji: "Hontou wa dou desu ka?",
    translation: "Sebenarnya dia seperti apa?",
    audioFileName: "irodori-elementary2-02-a03-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>とてもやさしくて、おもしろい人ですよ。話すと楽しいです。</>,
    romaji: "Totemo yasashikute, omoshiroi hito desu yo. Hanasu to tanoshii desu.",
    translation: "Dia sangat baik dan menyenangkan. Mengobrol dengannya terasa seru.",
    audioFileName: "irodori-elementary2-02-a03-l04.mp3",
  },
];

const favoriteArtistConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>好きな俳優がいますか。</>,
    romaji: "Suki na haiyuu ga imasu ka?",
    translation: "Apakah kamu punya aktor favorit?",
    audioFileName: "irodori-elementary2-02-a04-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>私は、リクさんが好きです。演技が上手だし、声もすてきです。</>,
    romaji: "Watashi wa, Riku-san ga suki desu. Engi ga jouzu da shi, koe mo suteki desu.",
    translation: "Saya suka Riku. Aktingnya bagus dan suaranya juga bagus.",
    audioFileName: "irodori-elementary2-02-a04-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>好きになったきっかけは何ですか。</>,
    romaji: "Suki ni natta kikkake wa nan desu ka?",
    translation: "Apa yang membuatmu mulai menyukainya?",
    audioFileName: "irodori-elementary2-02-a04-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>映画を見て、好きになりました。今でも応援しています。</>,
    romaji: "Eiga o mite, suki ni narimashita. Ima demo ouen shite imasu.",
    translation: "Saya mulai menyukainya setelah menonton filmnya. Sampai sekarang pun saya masih jadi penggemarnya.",
    audioFileName: "irodori-elementary2-02-a04-l04.mp3",
  },
];

const communityInterviewConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>コミュニティ誌のインタビューを読みましたか。</>,
    romaji: "Komyuniti-shi no intabyuu o yomimashita ka?",
    translation: "Apakah kamu sudah membaca wawancara di majalah komunitas?",
    audioFileName: "irodori-elementary2-02-a05-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい。イラさんは、明るくて元気な人ですね。</>,
    romaji: "Hai. Ira-san wa, akarukute genki na hito desu ne.",
    translation: "Ya. Ira orangnya ceria dan bersemangat, ya.",
    audioFileName: "irodori-elementary2-02-a05-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>絵を描くのが好きだそうですね。</>,
    romaji: "E o kaku no ga suki da sou desu ne.",
    translation: "Saya dengar dia suka menggambar.",
    audioFileName: "irodori-elementary2-02-a05-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>そうです。町の人に絵を教えたり、作品を紹介したりしています。</>,
    romaji: "Sou desu. Machi no hito ni e o oshietari, sakuhin o shoukaishitari shite imasu.",
    translation: "Betul. Dia mengajari orang-orang di kota cara menggambar dan memperkenalkan karya-karyanya.",
    audioFileName: "irodori-elementary2-02-a05-l04.mp3",
  },
];

const canDos = [
  {
    id: "identify-person-by-features",
    source: "CAN-DO 05",
    text: "Menyebutkan ciri seseorang dan mengenali orang yang dicari berdasarkan ciri yang didengar.",
  },
  {
    id: "describe-person-not-present",
    source: "CAN-DO 06",
    text: "Menceritakan penampilan atau sifat seseorang yang sedang tidak berada di tempat.",
  },
  {
    id: "explain-favorite-person",
    source: "CAN-DO 07",
    text: "Menceritakan alasan menyukai seorang figur publik dan hal yang pertama membuat tertarik.",
  },
  {
    id: "understand-interview-article",
    source: "CAN-DO 08",
    text: "Membaca artikel wawancara sederhana yang memperkenalkan seseorang dan memahami informasi utamanya.",
  },
];

const vocabRows = [
  ["髪", "かみ · kami", "Rambut"],
  ["長い", "ながい · nagai", "Panjang"],
  ["短い", "みじかい · mijikai", "Pendek"],
  ["背", "せ · se", "Tinggi badan"],
  ["高い", "たかい · takai", "Tinggi"],
  ["座る", "すわる · suwaru", "Duduk"],
  ["立つ", "たつ · tatsu", "Berdiri"],
  ["帽子", "ぼうし · boushi", "Topi"],
  ["かぶる", "かぶる · kaburu", "Memakai topi"],
  ["ピアス", "ピアス · piasu", "Anting tindik"],
  ["ワンピース", "ワンピース · wanpiisu", "Gaun terusan"],
  ["着る", "きる · kiru", "Memakai pakaian"],
  ["靴", "くつ · kutsu", "Sepatu"],
  ["はく", "はく · haku", "Memakai sepatu atau celana"],
  ["めがね", "めがね · megane", "Kacamata"],
  ["かける", "かける · kakeru", "Memakai kacamata"],
  ["ひげ", "ひげ · hige", "Janggut atau kumis"],
  ["ネクタイ", "ネクタイ · nekutai", "Dasi"],
  ["シャツ", "シャツ · shatsu", "Kemeja"],
  ["ズボン", "ズボン · zubon", "Celana panjang"],
  ["赤い", "あかい · akai", "Merah"],
  ["白い", "しろい · shiroi", "Putih"],
  ["黄色い", "きいろい · kiiroi", "Kuning"],
  ["青い", "あおい · aoi", "Biru"],
  ["黒い", "くろい · kuroi", "Hitam"],
  ["まじめ", "まじめ · majime", "Serius atau sungguh-sungguh"],
  ["やさしい", "やさしい · yasashii", "Baik hati"],
  ["きびしい", "きびしい · kibishii", "Tegas"],
  ["こわい", "こわい · kowai", "Menakutkan"],
  ["おもしろい", "おもしろい · omoshiroi", "Menarik atau menyenangkan"],
  ["かわいい", "かわいい · kawaii", "Lucu"],
  ["忙しい", "いそがしい · isogashii", "Sibuk"],
  ["元気", "げんき · genki", "Sehat atau bersemangat"],
  ["見た目", "みため · mitame", "Penampilan luar"],
  ["歌手", "かしゅ · kashu", "Penyanyi"],
  ["俳優", "はいゆう · haiyuu", "Aktor"],
  ["演技", "えんぎ · engi", "Akting"],
  ["上手", "じょうず · jouzu", "Mahir atau pandai"],
  ["きっかけ", "きっかけ · kikkake", "Awal atau pemicu ketertarikan"],
  ["引退する", "いんたいする · intai suru", "Pensiun dari profesi"],
  ["世界中", "せかいじゅう · sekaijuu", "Di seluruh dunia"],
  ["ファン", "ファン · fan", "Penggemar"],
  ["明るい", "あかるい · akarui", "Ceria atau terang"],
  ["心配", "しんぱい · shinpai", "Khawatir"],
];

const kanjiWords = [
  ["写真", "しゃしん · shashin", "Foto"],
  ["歌", "うた · uta", "Lagu"],
  ["歌手", "かしゅ · kashu", "Penyanyi"],
  ["上手", "じょうず · jouzu", "Mahir"],
  ["明るい", "あかるい · akarui", "Ceria atau terang"],
  ["長い", "ながい · nagai", "Panjang"],
  ["短い", "みじかい · mijikai", "Pendek"],
  ["着る", "きる · kiru", "Memakai pakaian"],
  ["立つ", "たつ · tatsu", "Berdiri"],
  ["泣く", "なく · naku", "Menangis"],
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
    title: "01 · Menemukan seseorang",
    heading: "Mencari teman di ruang belajar",
    prompt: "Kamu sedang mencari Aoi. Temanmu menjelaskan bahwa Aoi adalah orang yang sedang membaca buku di dekat jendela.",
    japanese: <>窓の近くで本を読んでいる人ですよ。</>,
    translation: "Dia yang sedang membaca buku di dekat jendela.",
    options: [
      { key: "a", label: "窓の近くで本を読んでいる人です。", meaning: "Menjelaskan orang berdasarkan kegiatan yang sedang dilakukan." },
      { key: "b", label: "窓の近くで本を買った人です。", meaning: "Mengatakan orang yang membeli buku di dekat jendela." },
      { key: "c", label: "窓の近くに本がある人です。", meaning: "Mengatakan orang yang memiliki buku di dekat jendela." },
    ],
    answer: "a",
    explanation: "V-ている + 人 menjelaskan orang berdasarkan tindakan yang sedang dilakukan.",
  },
  {
    title: "02 · Menggambarkan ciri",
    heading: "Membedakan dua orang",
    prompt: "Kamu diminta menjelaskan teman yang berambut pendek. Pilih kalimat yang alami.",
    japanese: <>田中さんは、髪が短い人です。</>,
    translation: "Tanaka adalah orang yang berambut pendek.",
    options: [
      { key: "a", label: "田中さんは、髪が短い人です。", meaning: "Menjelaskan ciri rambut seseorang." },
      { key: "b", label: "田中さんは、髪を短い人です。", meaning: "Partikel yang digunakan tidak tepat." },
      { key: "c", label: "田中さんは、短い髪を人です。", meaning: "Susunan kata tidak tepat." },
    ],
    answer: "a",
    explanation: "Gunakan N1 は N2 が + kata sifat untuk menjelaskan ciri, misalnya 髪が短い.",
  },
  {
    title: "03 · Menyampaikan kesan",
    heading: "Melihat foto seorang teman",
    prompt: "Dari foto, temanmu terlihat serius. Kamu ingin menyampaikan kesan berdasarkan penampilan.",
    japanese: <>まじめそうな人ですね。</>,
    translation: "Kelihatannya dia orang yang serius, ya.",
    options: [
      { key: "a", label: "まじめそうな人ですね。", meaning: "Menyampaikan kesan dari penampilan." },
      { key: "b", label: "まじめ人ですね。", meaning: "Kata sifat-na memerlukan bentuk yang sesuai sebelum kata benda." },
      { key: "c", label: "まじめそうに人ですね。", meaning: "Bentuk そう yang digunakan tidak tepat." },
    ],
    answer: "a",
    explanation: "Kata sifat-na seperti まじめ menjadi まじめそうな sebelum kata benda.",
  },
  {
    title: "04 · Menyebutkan alasan",
    heading: "Menceritakan figur favorit",
    prompt: "Kamu menyukai seorang aktor karena aktingnya bagus dan suaranya menarik. Gabungkan kedua alasan.",
    japanese: <>演技が上手だし、声もすてきです。</>,
    translation: "Aktingnya bagus dan suaranya juga menarik.",
    options: [
      { key: "a", label: "演技が上手だし、声もすてきです。", meaning: "Menghubungkan beberapa alasan." },
      { key: "b", label: "演技が上手に、声もすてきです。", meaning: "Bentuk penghubung tidak sesuai." },
      { key: "c", label: "演技が上手を、声もすてきです。", meaning: "Partikel tidak sesuai." },
    ],
    answer: "a",
    explanation: "し dapat digunakan untuk menyebutkan beberapa alasan atau dasar pendapat.",
  },
  {
    title: "05 · Menceritakan awal ketertarikan",
    heading: "Menjelaskan mengapa mulai menyukai seorang aktor",
    prompt: "Kamu mulai menyukai seorang aktor setelah menonton filmnya. Pilih kalimat yang tepat.",
    japanese: <>映画を見て、好きになりました。</>,
    translation: "Saya mulai menyukainya setelah menonton film.",
    options: [
      { key: "a", label: "映画を見て、好きになりました。", meaning: "Menjelaskan hal yang menjadi awal ketertarikan." },
      { key: "b", label: "映画を見たし、好きになります前。", meaning: "Bentuk dan susunan kalimat tidak tepat." },
      { key: "c", label: "映画に見て、好きになりました。", meaning: "Partikel yang digunakan tidak tepat." },
    ],
    answer: "a",
    explanation: "V-て dapat menghubungkan tindakan dengan perubahan perasaan atau keadaan setelahnya.",
  },
];

const practiceTasks: Task[] = [
  {
    prompt: <>Dalam 「山田さんは、髪が長いです」, bagian 「髪が長い」 menjelaskan …</>,
    options: [
      { key: "a", label: "Ciri orang yang sedang dibicarakan." },
      { key: "b", label: "Tempat orang itu tinggal." },
      { key: "c", label: "Waktu orang itu datang." },
    ],
    answer: "a",
    explanation: <>Pola N1 は N2 が + kata sifat digunakan untuk menjelaskan ciri atau karakteristik suatu topik.</>,
  },
  {
    prompt: <>Pilih frasa yang berarti “orang yang sedang memakai topi”.</>,
    options: [
      { key: "a", label: "帽子をかぶっている人" },
      { key: "b", label: "帽子をかぶる人を" },
      { key: "c", label: "帽子がかぶって人" },
    ],
    answer: "a",
    explanation: <>V-ている diubah menjadi bentuk biasa ている untuk menerangkan kata 人.</>,
  },
  {
    prompt: <>Apa arti 「元気そうな赤ちゃんですね」?</>,
    options: [
      { key: "a", label: "Bayinya kelihatan sehat dan bersemangat." },
      { key: "b", label: "Bayinya sedang menangis." },
      { key: "c", label: "Bayinya sangat sibuk." },
    ],
    answer: "a",
    explanation: <>元気そう menyatakan kesan bahwa seseorang tampak sehat atau bersemangat.</>,
  },
  {
    prompt: <>Pada akhir kalimat, よ biasanya digunakan untuk …</>,
    options: [
      { key: "a", label: "Menyampaikan informasi baru kepada lawan bicara." },
      { key: "b", label: "Meminta seseorang mengulang kalimat." },
      { key: "c", label: "Menunjukkan tempat." },
    ],
    answer: "a",
    explanation: <>よ dapat menegaskan atau menyampaikan informasi yang mungkin belum diketahui lawan bicara.</>,
  },
  {
    prompt: <>Lengkapi kalimat: 「歌が上手だし、ダンスも＿＿＿です。」</>,
    options: [
      { key: "a", label: "上手" },
      { key: "b", label: "上手を" },
      { key: "c", label: "上手に人" },
    ],
    answer: "a",
    explanation: <>し menghubungkan alasan. Dalam contoh ini, dua kemampuan disebutkan sebagai alasan menyukai seorang penyanyi.</>,
  },
  {
    prompt: <>Pilih kalimat yang menyatakan “Saya mulai menyukai aktor itu setelah menonton filmnya”.</>,
    options: [
      { key: "a", label: "映画を見て、その俳優が好きになりました。" },
      { key: "b", label: "映画を見ます、その俳優が好き前です。" },
      { key: "c", label: "映画が見て、その俳優を好きでした。" },
    ],
    answer: "a",
    explanation: <>見て menghubungkan kegiatan menonton film dengan perubahan perasaan menjadi suka.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa arti 「見た目」?</>,
    options: [
      { key: "a", label: "Penampilan luar." },
      { key: "b", label: "Pengalaman masa lalu." },
      { key: "c", label: "Awal perjalanan." },
    ],
    answer: "a",
    explanation: <>見た目 berarti penampilan atau kesan yang terlihat dari luar.</>,
  },
  {
    prompt: <>Pilih kata yang berarti “berdiri”.</>,
    options: [
      { key: "a", label: "立つ" },
      { key: "b", label: "座る" },
      { key: "c", label: "泣く" },
    ],
    answer: "a",
    explanation: <>立つ（たつ）berarti berdiri, sedangkan 座る berarti duduk dan 泣く berarti menangis.</>,
  },
  {
    prompt: <>Apa arti 「帽子をかぶっている人」?</>,
    options: [
      { key: "a", label: "Orang yang sedang memakai topi." },
      { key: "b", label: "Orang yang membeli topi." },
      { key: "c", label: "Orang yang membuat topi." },
    ],
    answer: "a",
    explanation: <>かぶっている menjelaskan keadaan sedang mengenakan topi.</>,
  },
  {
    prompt: <>Bagaimana bentuk 「忙しい」 ketika menyampaikan kesan “kelihatannya sibuk”?</>,
    options: [
      { key: "a", label: "忙しそう" },
      { key: "b", label: "忙しいそう" },
      { key: "c", label: "忙しなそう" },
    ],
    answer: "a",
    explanation: <>Untuk kata sifat-i, hilangkan い lalu tambahkan そう: 忙しい → 忙しそう.</>,
  },
  {
    prompt: <>Kalimat 「写真はまじめそうですけど、本当はおもしろい人です」 berarti …</>,
    options: [
      { key: "a", label: "Di foto dia terlihat serius, tetapi sebenarnya orangnya menyenangkan." },
      { key: "b", label: "Di foto dia sedang bekerja, lalu pulang." },
      { key: "c", label: "Foto itu sangat menarik dan mahal." },
    ],
    answer: "a",
    explanation: <>そう menyatakan kesan dari penampilan, sedangkan けど menghubungkan dua informasi yang kontras.</>,
  },
  {
    prompt: <>Pola 「Sし、Sし」 dapat digunakan untuk …</>,
    options: [
      { key: "a", label: "Menyebutkan beberapa alasan." },
      { key: "b", label: "Menyatakan waktu tertentu." },
      { key: "c", label: "Meminta izin." },
    ],
    answer: "a",
    explanation: <>し digunakan untuk menghubungkan beberapa alasan atau dasar pendapat.</>,
  },
  {
    prompt: <>Apa arti 「歌手」?</>,
    options: [
      { key: "a", label: "Penyanyi." },
      { key: "b", label: "Penari." },
      { key: "c", label: "Penonton." },
    ],
    answer: "a",
    explanation: <>歌手（かしゅ）berarti penyanyi.</>,
  },
  {
    prompt: <>Pilih bentuk yang tepat untuk menyebutkan awal ketertarikan.</>,
    options: [
      { key: "a", label: "好きになったきっかけは、映画を見たことです。" },
      { key: "b", label: "好きになったきっかけは、映画を見ますです。" },
      { key: "c", label: "好きになったきっかけは、映画に見てです。" },
    ],
    answer: "a",
    explanation: <>Pola 「きっかけは、V-たことです」 digunakan untuk menjelaskan pengalaman yang menjadi awal ketertarikan.</>,
  },
  {
    prompt: <>Dalam konteks mencari seseorang, よ pada 「あそこで本を読んでいる人ですよ」 berfungsi untuk …</>,
    options: [
      { key: "a", label: "Memberi tahu informasi kepada orang yang sedang mencari." },
      { key: "b", label: "Menanyakan apakah orang itu sibuk." },
      { key: "c", label: "Menyatakan bahwa buku itu milik pembicara." },
    ],
    answer: "a",
    explanation: <>よ menandai informasi yang disampaikan kepada lawan bicara.</>,
  },
  {
    prompt: <>Apa isi utama artikel wawancara sederhana?</>,
    options: [
      { key: "a", label: "Informasi tentang orang yang diperkenalkan, seperti asal, kegiatan, dan kesukaannya." },
      { key: "b", label: "Daftar angka tanpa penjelasan." },
      { key: "c", label: "Petunjuk menggunakan mesin." },
    ],
    answer: "a",
    explanation: <>Artikel wawancara memperkenalkan seseorang melalui jawaban atas beberapa pertanyaan.</>,
  },
];

export default function IrodoriElementaryTwoLessonTwoPage() {
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

  const interviewQuestions = [
    {
      question: "イラさんは、どこから来ましたか。",
      answer: "インドネシアのバンドンから来ました。",
      reading: "Indoneshia no Bandon kara kimashita.",
      meaning: "Ira berasal dari Bandung, Indonesia.",
    },
    {
      question: "イラさんは、どんなことが好きですか。",
      answer: "絵を描くことと、町を歩くことです。",
      reading: "E o kaku koto to, machi o aruku koto desu.",
      meaning: "Dia suka menggambar dan berjalan-jalan di kota.",
    },
    {
      question: "イラさんは、地域で何をしていますか。",
      answer: "子どもや大人に絵を教えています。",
      reading: "Kodomo ya otona ni e o oshiete imasu.",
      meaning: "Dia mengajarkan menggambar kepada anak-anak dan orang dewasa.",
    },
  ];

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-12">
      <Link
        href="/irodori/elementary-2"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#86A9D0]/40 hover:text-[#EAE6DD]"
      >
        <ArrowLeft size={15} />
        Kembali ke Dasar 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#486C91]/35 bg-gradient-to-br from-[#20364C] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#A9C9E8]/[0.08]">人</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#A9C9E8]">IRODORI • DASAR 2 A2 • PELAJARAN 02</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Dia tampak seperti orang yang serius.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9C9E8]">まじめそうな人ですね</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar mengenali seseorang dari ciri yang terlihat, mendeskripsikan sifat orang lain, menceritakan figur publik favorit dan alasannya, serta memahami artikel wawancara sederhana.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Search size={14} className="text-[#A9C9E8}" />Mencari seseorang</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Eye size={14} className="text-[#A9C9E8}" />Ciri dan sifat</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Star size={14} className="text-[#A9C9E8}" />Figur favorit</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><FileText size={14} className="text-[#A9C9E8}" />Artikel wawancara</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#486C91]/20 bg-[#202A35]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A9C9E8]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target ini mengikuti target komunikasi resmi Irodori Dasar 2 Lesson 2.</p>
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">KOSAKATA CIRI DAN SIFAT</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Penampilan, pakaian, dan kepribadian</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Kosakata berikut membantu menjelaskan orang secara netral, mengenali pakaian, dan menyampaikan kesan sederhana.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9C9E8]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menemukan orang dan berbagi cerita</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Seluruh dialog dibuat orisinal untuk Fude. Nama, situasi, dan figur yang dibicarakan merupakan contoh fiktif.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Mencari teman di ruang belajar" speakers={[guideYui, friendSota]} utterances={findingPersonConversation} />
          <IrodoriConversation title="Menjelaskan pakaian dan ciri" speakers={[friendAkiko, friendKenji]} utterances={describingClothesConversation} />
          <IrodoriConversation title="Menceritakan sifat teman" speakers={[guideYui, friendAkiko]} utterances={describingPersonalityConversation} />
          <IrodoriConversation title="Membicarakan figur publik favorit" speakers={[friendSota, friendAkiko]} utterances={favoriteArtistConversation} />
          <IrodoriConversation title="Membicarakan artikel komunitas" speakers={[guideYui, friendKenji]} utterances={communityInterviewConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">MENCARI SESEORANG</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Jelaskan ciri yang mudah dikenali</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Mulai dari lokasi, kegiatan yang sedang dilakukan, lalu pakaian atau ciri lain yang membantu lawan bicara menemukan orangnya.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["あそこで本を読んでいる人です。", "Asoko de hon o yonde iru hito desu.", "Orang yang sedang membaca buku di sana."],
            ["髪が長くて、青いシャツを着ている人です。", "Kami ga nagakute, aoi shatsu o kite iru hito desu.", "Orang yang rambutnya panjang dan memakai kemeja biru."],
            ["帽子をかぶっている人ですよ。", "Boushi o kabutte iru hito desu yo.", "Orang yang sedang memakai topi itu."],
            ["黒いめがねをかけている人です。", "Kuroi megane o kakete iru hito desu.", "Orang yang memakai kacamata hitam."],
            ["白いシャツを着て、いすに座っている人です。", "Shiroi shatsu o kite, isu ni suwatte iru hito desu.", "Orang yang memakai kemeja putih dan duduk di kursi."],
            ["あの赤いかばんを持っている人ですね。", "Ano akai kaban o motte iru hito desu ne.", "Orang yang membawa tas merah itu, ya?"],
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">MENYAMPAIKAN KESAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Penampilan belum tentu sama dengan sifat sebenarnya</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pola 〜そう digunakan untuk menyampaikan kesan dari apa yang terlihat. Gunakan ungkapan yang netral dan ingat bahwa kesan awal belum tentu menggambarkan sifat seseorang sepenuhnya.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["まじめそうな人ですね。", "Majime sou na hito desu ne.", "Kelihatannya dia orang yang serius."],
            ["元気そうな人ですね。", "Genki sou na hito desu ne.", "Kelihatannya dia sehat dan bersemangat."],
            ["忙しそうですね。", "Isogashisou desu ne.", "Kelihatannya sedang sibuk."],
            ["うれしそうですね。", "Ureshisou desu ne.", "Kelihatannya senang."],
            ["写真では静かそうですけど、話すとおもしろい人です。", "Shashin de wa shizuka sou desu kedo, hanasu to omoshiroi hito desu.", "Di foto dia tampak pendiam, tetapi saat diajak bicara orangnya menyenangkan."],
            ["見た目はまじめそうだけど、よく笑う人です。", "Mitame wa majime sou da kedo, yoku warau hito desu.", "Dari penampilannya terlihat serius, tetapi dia sering tertawa."],
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">FIGUR PUBLIK FAVORIT</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Ceritakan alasan dan awal ketertarikan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan contoh tokoh fiktif. Kamu dapat menyebutkan beberapa hal yang disukai, lalu menceritakan pengalaman yang membuatmu tertarik.</p>
        </div>
        <article className="rounded-2xl border border-[#486C91]/25 bg-[#202A35]/80 p-4">
          <p className="text-[9px] font-black tracking-[0.16em] text-[#A9C9E8]">CONTOH FIGUR FIKTIF</p>
          <h3 className="mt-2 font-mincho text-xl font-bold text-[#F1EBDD]">リク · Riku</h3>
          <p className="mt-1 text-xs text-[#A9A398]">Aktor dalam contoh latihan Fude</p>
          <div className="mt-3 space-y-2">
            {[
              ["私はリクさんが好きです。", "Saya suka Riku."],
              ["演技が上手だし、声もすてきです。", "Aktingnya bagus dan suaranya juga menarik."],
              ["好きになったきっかけは、映画を見たことです。", "Awal saya menyukainya adalah saat menonton filmnya."],
              ["映画を見て、好きになりました。", "Saya mulai menyukainya setelah menonton film."],
            ].map(([jp, meaning]) => (
              <div key={jp} className="rounded-lg border border-white/[0.06] bg-black/15 p-3">
                <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">{jp}</p>
                <p className="mt-1 text-xs text-[#A9A398]">{meaning}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">ARTIKEL WAWANCARA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Mengenal anggota komunitas melalui wawancara</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Artikel berikut fiktif. Baca jawaban narasumber untuk menemukan informasi tentang asal, kesukaan, dan kegiatannya.</p>
        </div>
        <article className="overflow-hidden rounded-2xl border border-[#486C91]/25 bg-[#202A35]">
          <div className="border-b border-white/[0.08] bg-[#293D52] px-4 py-3">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#A9C9E8]">MAJALAH KOMUNITAS · CONTOH FIKTIF</p>
            <h3 className="mt-1 font-mincho text-xl font-bold text-[#F1EBDD]">町のとなりの人 · Mengenal Tetangga Kita</h3>
            <p className="mt-1 text-[10px] text-[#A9A398]">Edisi 12 · Profil anggota komunitas</p>
          </div>
          <div className="space-y-4 p-4">
            <div>
              <p className="text-[10px] font-bold text-[#A9C9E8]">インタビュー · Wawancara</p>
              <h4 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">イラ・サントソさん · Ira Santoso</h4>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]">Ira berasal dari Bandung, Indonesia. Ia baru bergabung dengan komunitas seni di kotanya.</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border border-white/[0.06] bg-black/15 p-3">
                <p className="text-[10px] font-bold text-[#A9C9E8]">Q：出身はどこですか。</p>
                <p className="mt-1 font-mincho text-sm leading-7 text-[#F1EBDD]">インドネシアのバンドンから来ました。</p>
                <p className="mt-1 text-xs text-[#A9A398]">Saya berasal dari Bandung, Indonesia.</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-black/15 p-3">
                <p className="text-[10px] font-bold text-[#A9C9E8]">Q：どんなことが好きですか。</p>
                <p className="mt-1 font-mincho text-sm leading-7 text-[#F1EBDD]">絵を描くことと、町を歩くことです。自然も好きです。</p>
                <p className="mt-1 text-xs text-[#A9A398]">Saya suka menggambar, berjalan-jalan di kota, dan menikmati alam.</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-black/15 p-3">
                <p className="text-[10px] font-bold text-[#A9C9E8]">Q：今、何をしていますか。</p>
                <p className="mt-1 font-mincho text-sm leading-7 text-[#F1EBDD]">地域の人に絵を教えたり、作品を紹介したりしています。</p>
                <p className="mt-1 text-xs text-[#A9A398]">Saya mengajar menggambar dan memperkenalkan karya kepada warga setempat.</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-black/15 p-3">
                <p className="text-[10px] font-bold text-[#A9C9E8]">Q：これから、どんなことをしたいですか。</p>
                <p className="mt-1 font-mincho text-sm leading-7 text-[#F1EBDD]">もっと作品を作って、町の展示会に参加したいです。</p>
                <p className="mt-1 text-xs text-[#A9A398]">Saya ingin membuat lebih banyak karya dan ikut pameran di kota.</p>
              </div>
            </div>
            <p className="border-t border-white/[0.07] pt-3 text-[10px] leading-5 text-[#A9A398]">Nama, informasi, dan kutipan artikel ini dibuat khusus untuk latihan bahasa Jepang.</p>
          </div>
        </article>
        <div className="space-y-2">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#A9C9E8]">PERTANYAAN PEMAHAMAN</p>
          {interviewQuestions.map((item, index) => (
            <article key={item.question} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <p className="text-xs font-semibold leading-6 text-[#EAE6DD]">{index + 1}. {item.question}</p>
              <p className="mt-1 font-mincho text-sm leading-7 text-[#A9C9E8]">{item.answer}</p>
              <p className="text-[9px] text-[#817A73]">{item.reading}</p>
              <p className="mt-1 text-xs text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">KOSAKATA KANJI</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kosakata kanji pada pelajaran ini</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan cara baca dan makna kanji yang digunakan untuk menjelaskan orang, kegiatan, dan kesukaan.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-xl leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9C9E8]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pola untuk mengenali dan menceritakan seseorang</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari cara menjelaskan ciri, menyampaikan kesan dari penampilan, dan menghubungkan alasan.</p>
        </div>
        {[
          {
            title: "01 · Menjelaskan ciri seseorang",
            pattern: "N1 は N2 が + kata sifat",
            example: <>田中さんは、髪が短いです。<br />山田さんは、背が高いです。</>,
            note: "N1 menunjukkan orang yang dibicarakan, sedangkan N2 menunjukkan bagian atau ciri yang dijelaskan. Contoh: 髪が長い (rambut panjang), 背が高い (bertubuh tinggi), dan 声が大きい (suara keras).",
          },
          {
            title: "02 · Menjelaskan orang berdasarkan tindakan atau pakaian",
            pattern: "V-ている + 人",
            example: <>帽子をかぶっている人です。<br />あそこで本を読んでいる人ですよ。</>,
            note: "Gunakan bentuk biasa ている sebelum 人 untuk menerangkan orang. Bentuk ini dapat menyatakan keadaan yang masih berlangsung, seperti sedang membaca, atau keadaan hasil tindakan, seperti sedang mengenakan topi, pakaian, dan kacamata.",
          },
          {
            title: "03 · Menyampaikan kesan dari penampilan",
            pattern: "い-adj：〜い → 〜そう<br />な-adj：〜な → 〜そう",
            example: <>忙しい → 忙しそうです。<br />まじめな → まじめそうな人です。<br />元気な → 元気そうですね。</>,
            note: "〜そう menyampaikan kesan berdasarkan apa yang terlihat. Untuk kata sifat-i, hilangkan い sebelum menambahkan そう. Untuk kata sifat-na, hilangkan な. Bedakan kesan 〜そう ini dengan そうです yang digunakan untuk kabar yang didengar.",
          },
          {
            title: "04 · よ dan ね di akhir kalimat",
            pattern: "S よ ／ S ね",
            example: <>あそこで本を読んでいる人ですよ。<br />あの人ですね。</>,
            note: "よ digunakan untuk memberi tahu informasi yang baru atau belum diketahui lawan bicara. ね dapat digunakan untuk meminta konfirmasi atau menunjukkan kesepahaman.",
          },
          {
            title: "05 · Menghubungkan beberapa alasan",
            pattern: "S し、S し",
            example: <>演技が上手だし、声もすてきです。<br />明るいし、親切だし、話しやすい人です。</>,
            note: "し menghubungkan alasan atau dasar pendapat. Pola ini cocok saat menyebutkan beberapa hal yang membuat kita menyukai atau menilai seseorang.",
          },
          {
            title: "06 · Menjelaskan awal ketertarikan",
            pattern: "V-て、好きになりました。<br />きっかけは、V-たことです。",
            example: <>映画を見て、好きになりました。<br />好きになったきっかけは、映画を見たことです。</>,
            note: "V-て dapat menghubungkan pengalaman dengan perubahan perasaan. きっかけは〜ことです digunakan untuk menjelaskan pengalaman yang menjadi awal ketertarikan.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-sm font-bold tracking-[0.02em] text-[#A9C9E8]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#A9C9E8]"><JapaneseReading allowIndexFallback romajiClassName="mt-1 text-sm italic text-[#D9B66D]">{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
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
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#486C91]/20 bg-[#202A35]/70 p-3">
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
                          ? "border-[#A9C9E8]/60 bg-[#486C91]/20 text-[#F1EBDD]"
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
                  className="rounded-lg bg-[#486C91] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#3B5E82] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
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
                              ? "border-[#A9C9E8]/60 bg-[#486C91]/20 text-[#F1EBDD]"
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
                              ? "border-[#A9C9E8]/60 bg-[#486C91]/20 text-[#F1EBDD]"
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
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi target komunikasi</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">
          Nilai kemampuanmu setelah kelima simulasi benar, seluruh latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.
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
              ? "Lesson 2 selesai."
              : canDosRated
                ? "Semua target komunikasi sudah dinilai."
                : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button
            type="button"
            onClick={finishLesson}
            disabled={!canComplete || isCompleted}
            className="rounded-xl bg-[#486C91] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#3B5E82] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
          >
            {isCompleted ? "Lesson 2 selesai" : "Selesaikan Lesson 2"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Dasar 2 · 02 / 18</span>
      </div>
    </main>
  );
}
