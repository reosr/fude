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
  Train,
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
const lessonId = "elementary2-06";

const readTrainTicketConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>この切符は、何時に出発しますか。</>,
    romaji: "Kono kippu wa, nanji ni shuppatsu shimasu ka?",
    translation: "Kereta pada tiket ini berangkat pukul berapa?",
    audioFileName: "irodori-elementary2-06-a01-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>午前九時三十分に出発します。到着は十一時十五分です。</>,
    romaji: "Gozen kuji sanjuppun ni shuppatsu shimasu. Touchaku wa juuichiji juugofun desu.",
    translation: "Berangkat pukul 09.30 pagi. Tiba pukul 11.15.",
    audioFileName: "irodori-elementary2-06-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>何番線から乗りますか。</>,
    romaji: "Nanbansen kara norimasu ka?",
    translation: "Naik dari jalur nomor berapa?",
    audioFileName: "irodori-elementary2-06-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>三番線です。二号車の指定席ですよ。</>,
    romaji: "Sanbansen desu. Nigousha no shiteiseki desu yo.",
    translation: "Jalur 3. Kursi yang dipesan ada di gerbong 2.",
    audioFileName: "irodori-elementary2-06-a01-l04.mp3",
  },
];

const explainTravelPlanConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>旅行先で会った人に、次の予定を聞かれました。</>,
    romaji: "Ryokousaki de atta hito ni, tsugi no yotei o kikaremashita.",
    translation: "Seseorang yang kami temui di tempat wisata bertanya tentang rencana berikutnya.",
    audioFileName: "irodori-elementary2-06-a02-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>明日は、友だちと二人で京都へ行くつもりです。</>,
    romaji: "Ashita wa, tomodachi to futari de Kyouto e iku tsumori desu.",
    translation: "Besok, saya berencana pergi ke Kyoto berdua dengan teman.",
    audioFileName: "irodori-elementary2-06-a02-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>京都で何をしますか。</>,
    romaji: "Kyouto de nani o shimasu ka?",
    translation: "Apa yang akan dilakukan di Kyoto?",
    audioFileName: "irodori-elementary2-06-a02-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>お寺を見たり、おいしいものを食べたりするつもりです。</>,
    romaji: "Otera o mitari, oishii mono o tabetari suru tsumori desu.",
    translation: "Kami berencana melihat kuil dan mencoba makanan yang enak.",
    audioFileName: "irodori-elementary2-06-a02-l04.mp3",
  },
];

const askStationInformationConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>まもなく、東京行きの電車が三番線に到着します。</>,
    romaji: "Mamonaku, Toukyou-yuki no densha ga sanbansen ni touchaku shimasu.",
    translation: "Kereta tujuan Tokyo akan segera tiba di jalur 3.",
    audioFileName: "irodori-elementary2-06-a03-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>この電車は、東京まで行きますか。</>,
    romaji: "Kono densha wa, Toukyou made ikimasu ka?",
    translation: "Apakah kereta ini pergi sampai Tokyo?",
    audioFileName: "irodori-elementary2-06-a03-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。東京方面へ行きます。次は上野に止まります。</>,
    romaji: "Hai. Toukyou houmen e ikimasu. Tsugi wa Ueno ni tomarimasu.",
    translation: "Ya. Kereta ini menuju arah Tokyo. Berikutnya berhenti di Ueno.",
    audioFileName: "irodori-elementary2-06-a03-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>ありがとうございます。乗り換えは必要ですか。</>,
    romaji: "Arigatou gozaimasu. Norikae wa hitsuyou desu ka?",
    translation: "Terima kasih. Apakah perlu berganti kereta?",
    audioFileName: "irodori-elementary2-06-a03-l04.mp3",
  },
];

const shareTravelImpressionsConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>週末の旅行はどうでしたか。</>,
    romaji: "Shuumatsu no ryokou wa dou deshita ka?",
    translation: "Bagaimana perjalanan akhir pekanmu?",
    audioFileName: "irodori-elementary2-06-a04-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>海で泳げたし、きれいな夕日も見られたし、とても楽しかったです。</>,
    romaji: "Umi de oyogeta shi, kirei na yuuhi mo mirareta shi, totemo tanoshikatta desu.",
    translation: "Saya bisa berenang di laut dan melihat matahari terbenam yang indah. Sangat menyenangkan.",
    audioFileName: "irodori-elementary2-06-a04-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>いいですね。旅行で一番よかったことは何ですか。</>,
    romaji: "Ii desu ne. Ryokou de ichiban yokatta koto wa nan desu ka?",
    translation: "Wah, bagus sekali. Apa hal terbaik dari perjalanan itu?",
    audioFileName: "irodori-elementary2-06-a04-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>友だちとゆっくり話せたことです。</>,
    romaji: "Tomodachi to yukkuri hanaseta koto desu.",
    translation: "Saya bisa mengobrol santai dengan teman.",
    audioFileName: "irodori-elementary2-06-a04-l04.mp3",
  },
];

const travelPostConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>旅行の写真を投稿しましたか。</>,
    romaji: "Ryokou no shashin o toukou shimashita ka?",
    translation: "Apakah kamu sudah mengunggah foto perjalanan?",
    audioFileName: "irodori-elementary2-06-a05-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。先週、友だちと二人で大阪へ行きました。</>,
    romaji: "Hai. Senshuu, tomodachi to futari de Oosaka e ikimashita.",
    translation: "Ya. Minggu lalu, saya pergi ke Osaka berdua dengan teman.",
    audioFileName: "irodori-elementary2-06-a05-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>何が一番おもしろかったですか。</>,
    romaji: "Nani ga ichiban omoshirokatta desu ka?",
    translation: "Apa yang paling menarik?",
    audioFileName: "irodori-elementary2-06-a05-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>大きな公園を歩いたことです。景色がきれいで、気持ちよかったです。</>,
    romaji: "Ookina kouen o aruita koto desu. Keshiki ga kirei de, kimochi yokatta desu.",
    translation: "Berjalan-jalan di taman yang luas. Pemandangannya indah dan terasa menyenangkan.",
    audioFileName: "irodori-elementary2-06-a05-l04.mp3",
  },
];

const canDos = [
  {
    id: "read-train-ticket-information",
    source: "CAN-DO 23",
    text: "Membaca tiket kereta, informasi di dalam kereta, atau pemberitahuan di stasiun untuk menemukan informasi yang diperlukan.",
  },
  {
    id: "explain-travel-plan-at-destination",
    source: "CAN-DO 24",
    text: "Menjelaskan secara sederhana rencana perjalanan kepada orang yang ditemui di tempat tujuan wisata.",
  },
  {
    id: "understand-train-announcement",
    source: "CAN-DO 25",
    text: "Memahami informasi penting dalam pengumuman di stasiun atau kereta dan bertanya kepada orang di sekitar jika belum jelas.",
  },
  {
    id: "talk-about-travel-impression",
    source: "CAN-DO 26",
    text: "Menceritakan secara sederhana kesan atau pengalaman setelah melakukan perjalanan.",
  },
  {
    id: "write-travel-social-post",
    source: "CAN-DO 27",
    text: "Menulis unggahan singkat di media sosial tentang pengalaman dan kesan selama perjalanan.",
  },
];

const vocabRows = [
  ["切符", "きっぷ · kippu", "Tiket"],
  ["指定席", "していせき · shiteiseki", "Kursi dengan nomor yang dipesan"],
  ["自由席", "じゆうせき · jiyuuseki", "Kursi bebas tanpa nomor khusus"],
  ["号車", "ごうしゃ · gousha", "Nomor gerbong"],
  ["何番線", "なんばんせん · nanbansen", "Jalur nomor berapa"],
  ["～発", "～はつ · ~hatsu", "Berangkat dari"],
  ["～着", "～ちゃく · ~chaku", "Tiba di"],
  ["～行き", "～ゆき · ~yuki", "Tujuan ke"],
  ["～方面", "～ほうめん · ~houmen", "Arah menuju"],
  ["発車する", "はっしゃする · hassha suru", "Berangkat (kereta)"],
  ["到着する", "とうちゃくする · touchaku suru", "Tiba"],
  ["乗り換える", "のりかえる · norikaeru", "Berganti kendaraan"],
  ["運転", "うんてん · unten", "Operasi atau mengemudi"],
  ["事故", "じこ · jiko", "Kecelakaan"],
  ["故障", "こしょう · koshou", "Kerusakan mesin"],
  ["駅員", "えきいん · ekiin", "Petugas stasiun"],
  ["案内", "あんない · annai", "Informasi atau panduan"],
  ["放送", "ほうそう · housou", "Pengumuman siaran"],
  ["乗り場", "のりば · noriba", "Tempat naik kendaraan"],
  ["週末", "しゅうまつ · shuumatsu", "Akhir pekan"],
  ["予定", "よてい · yotei", "Rencana atau jadwal"],
  ["旅行先", "りょこうさき · ryokousaki", "Tempat tujuan perjalanan"],
  ["友だち", "ともだち · tomodachi", "Teman"],
  ["二人で", "ふたりで · futari de", "Berdua"],
  ["つもり", "つもり · tsumori", "Niat atau rencana"],
  ["泳ぐ", "およぐ · oyogu", "Berenang"],
  ["泳げる", "およげる · oyogeru", "Bisa berenang"],
  ["見る", "みる · miru", "Melihat"],
  ["見られる", "みられる · mirareru", "Bisa melihat"],
  ["絵", "え · e", "Gambar atau lukisan"],
  ["描く", "えがく · egaku", "Menggambar"],
  ["空", "そら · sora", "Langit"],
  ["光る", "ひかる · hikaru", "Bersinar"],
  ["景色", "けしき · keshiki", "Pemandangan"],
  ["夕日", "ゆうひ · yuuhi", "Matahari terbenam"],
  ["海", "うみ · umi", "Laut"],
  ["公園", "こうえん · kouen", "Taman"],
  ["感想", "かんそう · kansou", "Kesan atau pendapat"],
  ["楽しい", "たのしい · tanoshii", "Menyenangkan"],
  ["おもしろい", "おもしろい · omoshiroi", "Menarik atau seru"],
  ["すてき", "すてき · suteki", "Bagus atau mengagumkan"],
  ["気持ちいい", "きもちいい · kimochi ii", "Terasa nyaman atau menyenangkan"],
  ["感動する", "かんどうする · kandou suru", "Merasa terharu atau kagum"],
  ["残念", "ざんねん · zannen", "Disayangkan"],
  ["大変", "たいへん · taihen", "Berat atau melelahkan"],
  ["疲れる", "つかれる · tsukareru", "Merasa lelah"],
  ["びっくりする", "びっくりする · bikkuri suru", "Terkejut"],
  ["投稿する", "とうこうする · toukou suru", "Mengunggah atau memposting"],
  ["写真", "しゃしん · shashin", "Foto"],
  ["思い出", "おもいで · omoide", "Kenangan"],
];

const kanjiWords = [
  ["運転", "うんてん · unten", "Operasi atau mengemudi"],
  ["事故", "じこ · jiko", "Kecelakaan"],
  ["故障", "こしょう · koshou", "Kerusakan mesin"],
  ["指定席", "していせき · shiteiseki", "Kursi yang dipesan"],
  ["週末", "しゅうまつ · shuumatsu", "Akhir pekan"],
  ["到着する", "とうちゃくする · touchaku suru", "Tiba"],
  ["絵", "え · e", "Gambar atau lukisan"],
  ["空", "そら · sora", "Langit"],
  ["泳ぐ", "およぐ · oyogu", "Berenang"],
  ["光る", "ひかる · hikaru", "Bersinar"],
];

const trainTicket = [
  { label: "行き先", value: "東京" },
  { label: "出発", value: "09:30 · 上野駅" },
  { label: "到着", value: "11:15 · 東京駅" },
  { label: "乗り場", value: "3番線" },
  { label: "座席", value: "2号車 · 8A · 指定席" },
];

const trainAnnouncements = [
  {
    japanese: "東京行きの電車は、三番線から発車します。",
    reading: "とうきょうゆきのでんしゃは、さんばんせんからはっしゃします。",
    meaning: "Kereta tujuan Tokyo berangkat dari jalur 3.",
  },
  {
    japanese: "次の駅は、上野です。",
    reading: "つぎのえきは、うえのです。",
    meaning: "Stasiun berikutnya adalah Ueno.",
  },
  {
    japanese: "この電車は、十分遅れて到着します。",
    reading: "このでんしゃは、じゅっぷんおくれてとうちゃくします。",
    meaning: "Kereta ini akan tiba terlambat sepuluh menit.",
  },
];

const travelPost = {
  heading: "週末の大阪旅行",
  japanese: "先週、友だちと二人で大阪へ行きました。大きな公園を歩いたり、町の景色を見たりしました。空が青くて、とても気持ちよかったです。また行きたいです。",
  reading: "せんしゅう、ともだちとふたりでおおさかへいきました。おおきなこうえんをあるいたり、まちのけしきをみたりしました。そらがあおくて、とてもきもちよかったです。またいきたいです。",
  translation: "Minggu lalu, saya pergi ke Osaka berdua dengan teman. Kami berjalan-jalan di taman yang luas dan melihat pemandangan kota. Langitnya biru dan suasananya sangat menyenangkan. Saya ingin pergi lagi.",
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
    title: "01 · Membaca tiket kereta",
    heading: "Menemukan waktu keberangkatan",
    prompt: "Lihat informasi tiket. Kereta berangkat pukul 09.30 dan tiba pukul 11.15. Berapa lama perjalanannya?",
    japanese: <>午前九時三十分に出発して、十一時十五分に到着します。</>,
    translation: "Berangkat pukul 09.30 dan tiba pukul 11.15.",
    options: [
      { key: "a", label: "Satu jam lima belas menit.", meaning: "Dari 09.30 sampai 10.45 adalah 1 jam 15 menit." },
      { key: "b", label: "Satu jam empat puluh lima menit.", meaning: "Dari 09.30 sampai 11.15 adalah 1 jam 45 menit." },
      { key: "c", label: "Dua jam tiga puluh menit.", meaning: "Durasi ini lebih lama daripada waktu pada tiket." },
    ],
    answer: "b",
    explanation: "Cari waktu berangkat dan waktu tiba, kemudian hitung selisih waktunya.",
  },
  {
    title: "02 · Menjelaskan rencana",
    heading: "Menyampaikan rencana perjalanan",
    prompt: "Kamu berencana pergi ke Kyoto besok bersama satu teman. Kalimat mana yang tepat?",
    japanese: <>明日は、友だちと二人で京都へ行くつもりです。</>,
    translation: "Besok, saya berencana pergi ke Kyoto berdua dengan teman.",
    options: [
      { key: "a", label: "明日は、友だちと二人で京都へ行くつもりです。", meaning: "V-るつもりです menyatakan rencana; 友だちと二人で berarti berdua dengan teman." },
      { key: "b", label: "明日は、友だちと二人で京都へ行ったつもりです。", meaning: "Bentuk lampau つもり tidak menyatakan rencana masa depan dalam konteks ini." },
      { key: "c", label: "明日は、友だちと二人で京都へ行けません。", meaning: "Kalimat ini berarti tidak bisa pergi ke Kyoto." },
    ],
    answer: "a",
    explanation: "Gunakan kata kerja bentuk kamus + つもりです untuk menyatakan rencana.",
  },
  {
    title: "03 · Memahami pengumuman",
    heading: "Mencari jalur keberangkatan",
    prompt: "Pengumuman berbunyi 「東京行きの電車は、三番線から発車します」. Kereta berangkat dari jalur berapa?",
    japanese: <>東京行きの電車は、三番線から発車します。</>,
    translation: "Kereta tujuan Tokyo berangkat dari jalur 3.",
    options: [
      { key: "a", label: "Jalur 2.", meaning: "Pengumuman tidak menyebut 二番線." },
      { key: "b", label: "Jalur 3.", meaning: "三番線 berarti jalur nomor 3." },
      { key: "c", label: "Jalur 5.", meaning: "Pengumuman tidak menyebut 五番線." },
    ],
    answer: "b",
    explanation: "三番線 dibaca sanbansen dan berarti jalur nomor tiga.",
  },
  {
    title: "04 · Menceritakan kesan",
    heading: "Menggabungkan beberapa alasan",
    prompt: "Kamu bisa berenang di laut dan melihat pemandangan yang indah. Pilih kalimat yang menyampaikan dua alasan.",
    japanese: <>海で泳げたし、景色もきれいだったし、とても楽しかったです。</>,
    translation: "Saya bisa berenang di laut dan pemandangannya juga indah, jadi sangat menyenangkan.",
    options: [
      { key: "a", label: "海で泳げなかったし、景色も見ませんでした。", meaning: "Kalimat ini menyatakan hal yang tidak dapat dilakukan." },
      { key: "b", label: "海で泳げたし、景色もきれいだったし、とても楽しかったです。", meaning: "～し digunakan untuk menyebut beberapa alasan atau hal yang menjadi dasar kesan." },
      { key: "c", label: "海で泳ぐつもりですし、まだ行きません。", meaning: "Kalimat ini menyatakan rencana, bukan pengalaman yang sudah terjadi." },
    ],
    answer: "b",
    explanation: "Pola ～し dapat menghubungkan beberapa alasan untuk menjelaskan kesan.",
  },
  {
    title: "05 · Membaca unggahan perjalanan",
    heading: "Menemukan pengalaman penulis",
    prompt: "Baca kalimat 「友だちと二人で大阪へ行きました。公園を歩いて、楽しかったです」. Apa pengalaman penulis?",
    japanese: <>友だちと二人で大阪へ行きました。公園を歩いて、楽しかったです。</>,
    translation: "Saya pergi ke Osaka berdua dengan teman. Berjalan-jalan di taman dan merasa senang.",
    options: [
      { key: "a", label: "Pergi ke Osaka bersama teman dan berjalan di taman.", meaning: "Inilah dua informasi utama yang terdapat dalam unggahan." },
      { key: "b", label: "Pergi sendiri ke Tokyo untuk bekerja.", meaning: "Kalimat tidak menyebut Tokyo atau pekerjaan." },
      { key: "c", label: "Tinggal di rumah sepanjang akhir pekan.", meaning: "Kalimat menyebut pergi ke Osaka." },
    ],
    answer: "a",
    explanation: "Unggahan perjalanan biasanya menyebut tujuan, teman perjalanan, kegiatan, dan kesan.",
  },
];

const practiceTasks: Task[] = [
  {
    prompt: <>Apa arti 「指定席」?</>,
    options: [
      { key: "a", label: "Kursi yang sudah ditentukan atau dipesan." },
      { key: "b", label: "Tempat membeli makanan." },
      { key: "c", label: "Jalur untuk kereta barang." },
    ],
    answer: "a",
    explanation: <>指定席（していせき）adalah kursi dengan nomor yang telah ditentukan pada tiket.</>,
  },
  {
    prompt: <>Pilih arti 「三番線」.</>,
    options: [
      { key: "a", label: "Gerbong nomor tiga." },
      { key: "b", label: "Jalur nomor tiga." },
      { key: "c", label: "Pintu keluar nomor tiga." },
    ],
    answer: "b",
    explanation: <>番線 menunjuk nomor jalur atau peron keberangkatan kereta.</>,
  },
  {
    prompt: <>Lengkapi kalimat rencana: 「明日、京都へ＿＿＿つもりです。」</>,
    options: [
      { key: "a", label: "行く." },
      { key: "b", label: "行った." },
      { key: "c", label: "行って." },
    ],
    answer: "a",
    explanation: <>V-るつもりです: kata kerja bentuk kamus + つもりです untuk menyatakan rencana.</>,
  },
  {
    prompt: <>Pilih arti 「友だちと二人で旅行しました」.</>,
    options: [
      { key: "a", label: "Saya bepergian sendiri dan bertemu dua teman." },
      { key: "b", label: "Saya bepergian berdua dengan seorang teman." },
      { key: "c", label: "Dua teman bepergian tanpa saya." },
    ],
    answer: "b",
    explanation: <>友だちと二人で menunjukkan bahwa saya dan teman melakukan perjalanan bersama, total dua orang.</>,
  },
  {
    prompt: <>Pilih kalimat yang menyebutkan dua alasan untuk kesan yang menyenangkan.</>,
    options: [
      { key: "a", label: "海で泳げたし、景色もきれいだったし、楽しかったです。" },
      { key: "b", label: "海で泳ぐつもりです。まだ行きません。" },
      { key: "c", label: "海で泳げませんでした。景色も見ません。" },
    ],
    answer: "a",
    explanation: <>～し dapat digunakan untuk menyebut beberapa hal yang menjadi alasan suatu kesan.</>,
  },
  {
    prompt: <>Apa arti 「到着します」?</>,
    options: [
      { key: "a", label: "Berangkat." },
      { key: "b", label: "Berganti kereta." },
      { key: "c", label: "Tiba." },
    ],
    answer: "c",
    explanation: <>到着する（とうちゃくする）berarti tiba atau sampai di tujuan.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa arti 「自由席」?</>,
    options: [
      { key: "a", label: "Kursi bebas tanpa nomor khusus." },
      { key: "b", label: "Kursi yang sudah dipesan." },
      { key: "c", label: "Ruang khusus petugas." },
    ],
    answer: "a",
    explanation: <>自由席 adalah kursi yang tidak memiliki nomor kursi khusus pada tiket.</>,
  },
  {
    prompt: <>Bagaimana membaca 「到着する」?</>,
    options: [
      { key: "a", label: "はっしゃする · hassha suru." },
      { key: "b", label: "とうちゃくする · touchaku suru." },
      { key: "c", label: "のりかえる · norikaeru." },
    ],
    answer: "b",
    explanation: <>到着する dibaca とうちゃくする dan berarti tiba.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Saya berencana pergi ke Kyoto besok”.</>,
    options: [
      { key: "a", label: "明日は京都へ行ったつもりです。" },
      { key: "b", label: "明日は京都へ行くつもりです。" },
      { key: "c", label: "明日は京都へ行けません。" },
    ],
    answer: "b",
    explanation: <>行くつもりです menyatakan rencana untuk pergi.</>,
  },
  {
    prompt: <>Apa arti 「東京行き」 pada papan informasi kereta?</>,
    options: [
      { key: "a", label: "Datang dari Tokyo." },
      { key: "b", label: "Berhenti di Tokyo saja." },
      { key: "c", label: "Tujuan kereta adalah Tokyo." },
    ],
    answer: "c",
    explanation: <>～行き menunjukkan tujuan, jadi 東京行き berarti menuju Tokyo.</>,
  },
  {
    prompt: <>Apa arti 「乗り換える」?</>,
    options: [
      { key: "a", label: "Berganti kendaraan atau kereta." },
      { key: "b", label: "Membeli tiket perjalanan." },
      { key: "c", label: "Membatalkan perjalanan." },
    ],
    answer: "a",
    explanation: <>乗り換える berarti berpindah dari satu kendaraan atau jalur ke kendaraan atau jalur lain.</>,
  },
  {
    prompt: <>Pilih kalimat yang menyatakan “Saya bisa berenang di laut, jadi senang”.</>,
    options: [
      { key: "a", label: "海で泳げなくて、残念でした。" },
      { key: "b", label: "海で泳げて、うれしかったです。" },
      { key: "c", label: "海で泳ぐつもりです。" },
    ],
    answer: "b",
    explanation: <>泳げて adalah bentuk te dari bentuk potensial 泳げる, menyatakan pengalaman yang berhasil dilakukan.</>,
  },
  {
    prompt: <>Apa fungsi 「～し」 dalam kalimat 「泳げたし、景色もきれいだったし、楽しかったです」?</>,
    options: [
      { key: "a", label: "Menyatakan larangan." },
      { key: "b", label: "Menyatakan urutan waktu secara tegas." },
      { key: "c", label: "Menyebut beberapa alasan atau hal." },
    ],
    answer: "c",
    explanation: <>～し menghubungkan beberapa alasan atau fakta untuk mendukung kesan.</>,
  },
  {
    prompt: <>「旅行しているとき」 berarti kapan?</>,
    options: [
      { key: "a", label: "Saat sedang bepergian." },
      { key: "b", label: "Sebelum mulai bepergian." },
      { key: "c", label: "Setelah perjalanan selesai." },
    ],
    answer: "a",
    explanation: <>V-ているとき menunjukkan saat suatu kegiatan sedang berlangsung.</>,
  },
  {
    prompt: <>Apa arti 「友だちと三人で行きました」?</>,
    options: [
      { key: "a", label: "Saya pergi sendiri bersama tiga teman." },
      { key: "b", label: "Saya pergi bersama teman, total tiga orang." },
      { key: "c", label: "Tiga teman pergi tanpa saya." },
    ],
    answer: "b",
    explanation: <>友だちと三人で berarti bersama teman dengan jumlah keseluruhan tiga orang, termasuk pembicara.</>,
  },
  {
    prompt: <>Apa saja yang biasanya ditulis dalam unggahan perjalanan sederhana?</>,
    options: [
      { key: "a", label: "Nomor pribadi semua penumpang." },
      { key: "b", label: "Tujuan, kegiatan, dan kesan perjalanan." },
      { key: "c", label: "Hanya jadwal pelajaran sekolah." },
    ],
    answer: "b",
    explanation: <>Unggahan sederhana dapat berisi tujuan, teman perjalanan, kegiatan, dan kesan pribadi.</>,
  },
];

export default function IrodoriElementaryTwoLessonSixPage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [travelDraft, setTravelDraft] = useState("");

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
      <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#E1B66B]/40 hover:text-[#EAE6DD]">
        <ArrowLeft size={15} /> Kembali ke Dasar 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#9A7442]/35 bg-gradient-to-br from-[#3B3020] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#E7C58C]/[0.08]">旅</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#E7C58C]">IRODORI • DASAR 2 A2 • PELAJARAN 06</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya senang bisa mengunjungi banyak tempat.</h1>
          <p className="mt-2 text-sm font-semibold text-[#E7C58C]">いろいろなところに行けて、よかったです</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar membaca tiket dan informasi kereta, memahami pengumuman, menjelaskan rencana perjalanan, menceritakan kesan wisata, dan menulis unggahan singkat.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Train size={14} className="text-[#E7C58C]" />Informasi kereta</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><MapPin size={14} className="text-[#E7C58C]" />Pengalaman wisata</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Star size={14} className="text-[#E7C58C]" />Kesan perjalanan</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#9A7442]/20 bg-[#302719]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#E7C58C]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Lima target berikut sesuai target komunikasi 23–27 pada Irodori Dasar 2 Lesson 6.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E7C58C]">{item.source} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7C58C]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membaca informasi, bepergian, dan berbagi pengalaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Seluruh percakapan dibuat orisinal oleh Fude berdasarkan target komunikasi pelajaran ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Membaca tiket kereta" speakers={[friendYui, friendSota]} utterances={readTrainTicketConversation} />
          <IrodoriConversation title="Menjelaskan rencana perjalanan" speakers={[friendAkiko, friendKenji]} utterances={explainTravelPlanConversation} />
          <IrodoriConversation title="Mendengarkan pengumuman dan bertanya" speakers={[friendSota, friendYui]} utterances={askStationInformationConversation} />
          <IrodoriConversation title="Menceritakan kesan perjalanan" speakers={[friendAkiko, friendKenji]} utterances={shareTravelImpressionsConversation} />
          <IrodoriConversation title="Membagikan pengalaman wisata" speakers={[friendYui, friendSota]} utterances={travelPostConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7C58C]">MEMBACA TIKET</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Temukan informasi penting pada tiket</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Contoh tiket latihan berikut bersifat fiktif. Perhatikan tujuan, waktu, jalur, gerbong, dan jenis kursi.</p>
        </div>
        <div className="rounded-2xl border border-[#9A7442]/25 bg-[#211D17] p-4 md:p-5">
          <div className="flex items-center justify-between border-b border-dashed border-[#9A7442]/35 pb-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.18em] text-[#E7C58C]">LATIHAN MEMBACA TIKET KERETA</p>
              <h3 className="mt-1 font-mincho text-xl font-bold text-[#F1EBDD]">東京行き</h3>
            </div>
            <Train size={30} className="text-[#E7C58C]" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {trainTicket.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/[0.06] bg-black/15 p-3">
                <p className="text-[9px] text-[#A9A398]">{item.label}</p>
                <p className="mt-1 text-sm font-bold text-[#F1EBDD]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7C58C]">PENGUMUMAN STASIUN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali ungkapan yang sering terdengar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Cocokkan informasi bahasa Jepang dengan arti sederhananya.</p>
        </div>
        <div className="space-y-2">
          {trainAnnouncements.map((item, index) => (
            <article key={item.japanese} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E7C58C]">PENGUMUMAN 01{index + 1}</p>
              <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]">{item.japanese}</p>
              <p className="mt-1 text-[10px] text-[#E7C58C]">{item.reading}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7C58C]">KOSAKATA PERJALANAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tiket, perjalanan, dan kesan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kata-kata untuk membaca informasi kereta dan menceritakan pengalaman wisata.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E7C58C]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7C58C]">KANJI UTAMA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sepuluh kata kanji pada materi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan cara baca dan maknanya dalam konteks perjalanan.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-[#9A7442]/20 bg-[#211D17] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E7C58C]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7C58C]">POLA TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima pola untuk rencana dan pengalaman perjalanan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan pola-pola ini untuk menjelaskan rencana, mengungkapkan hal yang berhasil dilakukan, dan menceritakan kesan.</p>
        </div>
        {[
          {
            title: "01 · Menyatakan rencana",
            pattern: "V-るつもりです",
            example: <>明日は京都へ行くつもりです。<br />来週、旅行するつもりです。</>,
            note: "Gunakan kata kerja bentuk kamus sebelum つもりです untuk menyatakan niat atau rencana yang sudah dipikirkan. 行く menjadi 行くつもりです; 旅行する menjadi 旅行するつもりです.",
          },
          {
            title: "02 · Menyatakan pengalaman yang berhasil atau tidak berhasil",
            pattern: "V-可能形-て、～ ／ V-可能形-なくて、～",
            example: <>いろいろなところに行けて、よかったです。<br />海で泳げなくて、残念でした。</>,
            note: "Bentuk potensial dalam bentuk て menghubungkan pengalaman yang berhasil dilakukan dengan kesan. Bentuk なくて menyatakan hal yang tidak dapat dilakukan dan dapat menjadi alasan perasaan kecewa.",
          },
          {
            title: "03 · Menyebut beberapa alasan atau fakta",
            pattern: "S1し、S2し、～",
            example: <>海で泳げたし、景色もきれいだったし、楽しかったです。</>,
            note: "～し digunakan untuk menambahkan beberapa alasan atau fakta. Bentuk ini membantu menjelaskan mengapa suatu pengalaman terasa menyenangkan, menarik, atau sebaliknya.",
          },
          {
            title: "04 · Menjelaskan waktu terjadinya sesuatu",
            pattern: "V-る ／ V-ている ／ V-た とき",
            example: <>旅行に行くとき、切符を買います。<br />電車に乗っているとき、音楽を聞きました。<br />家に帰ったとき、写真を見ました。</>,
            note: "V-るとき menunjuk waktu sebelum atau saat akan melakukan tindakan; V-ているとき berarti ketika tindakan sedang berlangsung; V-たとき menunjuk saat setelah tindakan terjadi.",
          },
          {
            title: "05 · Menyebut teman dan jumlah orang",
            pattern: "人 + と + jumlah orang + で",
            example: <>友だちと二人で京都へ行きました。<br />家族と四人で旅行するつもりです。</>,
            note: "Pola ini menjelaskan dengan siapa bepergian dan jumlah keseluruhan orang, termasuk pembicara. 友だちと二人で berarti saya dan seorang teman, total dua orang.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#E7C58C]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#E7C58C]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7C58C]">MEMBACA UNGGAHAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Contoh catatan perjalanan singkat</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Unggahan berikut merupakan contoh fiktif. Perhatikan tujuan, teman perjalanan, kegiatan, dan kesan penulis.</p>
        </div>
        <article className="rounded-2xl border border-[#9A7442]/25 bg-[#211D17] p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E7C58C]">CATATAN PERJALANAN</p>
              <h3 className="mt-1 text-sm font-bold text-[#F1EBDD]">{travelPost.heading}</h3>
            </div>
            <FileText size={20} className="text-[#E7C58C]" />
          </div>
          <p className="mt-3 font-mincho text-base leading-8 text-[#F1EBDD]">{travelPost.japanese}</p>
          <p className="mt-2 text-[10px] leading-6 text-[#E7C58C]">{travelPost.reading}</p>
          <p className="mt-3 border-t border-white/[0.07] pt-3 text-xs leading-6 text-[#A9A398]">{travelPost.translation}</p>
        </article>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#9A7442]/20 bg-[#211D17] p-4 md:p-5">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7C58C]">LATIHAN MENULIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Buat unggahan perjalananmu sendiri</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Tulislah 2–4 kalimat sederhana dalam bahasa Jepang. Ceritakan kapan dan dengan siapa kamu pergi, apa yang dilakukan, serta bagaimana kesanmu.</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
          <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">いつ、だれと、どこへ行きましたか。何をしましたか。どう思いましたか。</p>
          <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">Kapan, dengan siapa, dan ke mana kamu pergi? Apa yang kamu lakukan? Bagaimana perasaanmu?</p>
        </div>
        <label htmlFor="travel-post-draft" className="block text-xs font-semibold text-[#E7C58C]">Tulis unggahan dalam bahasa Jepang</label>
        <textarea
          id="travel-post-draft"
          value={travelDraft}
          onChange={(event) => setTravelDraft(event.target.value)}
          rows={5}
          placeholder="先週、友だちと二人で……"
          className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#E7C58C]/50"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] text-[#817A73]">Draf ini hanya untuk latihan di halaman ini.</p>
          <span className="text-[10px] tabular-nums text-[#E7C58C]">{travelDraft.length} karakter</span>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7C58C]">SIMULASI SITUASI</p>
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
              <p className="text-[9px] font-black tracking-[0.16em] text-[#E7C58C]">{task.title}</p>
              <h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#9A7442]/20 bg-[#302719]/70 p-3">
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
                          ? "border-[#E7C58C]/60 bg-[#9A7442]/15 text-[#F1EBDD]"
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
                  className="rounded-lg bg-[#9A7442] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#805E34] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
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
          <button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#9A7442]/35 px-4 py-2 text-xs font-bold text-[#E7C58C]">
            <RefreshCw size={13} /> Ulangi simulasi
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7C58C]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#E7C58C]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#E7C58C]/60 bg-[#9A7442]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#9A7442]/35 px-4 py-2 text-xs font-bold text-[#E7C58C]">
              <RefreshCw size={13} /> Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={Object.keys(practiceAnswers).length !== practiceTasks.length}
              className="rounded-lg bg-[#9A7442] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E7C58C]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#E7C58C]">SOAL {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#E7C58C]/60 bg-[#9A7442]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#9A7442]/35 px-4 py-2 text-xs font-bold text-[#E7C58C]">
              <RefreshCw size={13} /> Ulangi kuis
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="rounded-lg bg-[#9A7442] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa kuis
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#9A7442]/20 bg-[#302719]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#E7C58C]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi target komunikasi</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">
          Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.
        </p>
        <div className="space-y-3">
          {canDos.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E7C58C]">{item.source}</p>
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
                        ? "border-[#E7C58C]/50 bg-[#9A7442]/20 text-[#F8EEDC]"
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
              ? "Lesson 6 selesai. Progres tersimpan."
              : canDosRated
                ? "Semua target komunikasi sudah dinilai."
                : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button
            type="button"
            onClick={finishLesson}
            disabled={!canComplete || isCompleted}
            className="rounded-xl bg-[#9A7442] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#805E34] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
          >
            {isCompleted ? "Lesson 6 selesai" : "Selesaikan Lesson 6"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Dasar 2 · 06 / 18</span>
      </div>
    </main>
  );
}
