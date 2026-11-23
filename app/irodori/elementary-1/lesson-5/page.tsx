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
const lessonId = "elementary1-05";

const townImpressionConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>この町はどうですか。</>, romaji: "Kono machi wa dou desu ka?", translation: "Bagaimana menurutmu kota ini?", audioFileName: "irodori-elementary1-05-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>とてもにぎやかで、便利です。</>, romaji: "Totemo nigiyaka de, benri desu.", translation: "Sangat ramai dan praktis.", audioFileName: "irodori-elementary1-05-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>そうですか。店も多いですね。</>, romaji: "Sou desu ka. Mise mo ooi desu ne.", translation: "Begitu, ya. Tokonya juga banyak.", audioFileName: "irodori-elementary1-05-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>はい。でも、駅の近くは人が多いです。</>, romaji: "Hai. Demo, eki no chikaku wa hito ga ooi desu.", translation: "Iya. Tetapi, di dekat stasiun banyak orang.", audioFileName: "irodori-elementary1-05-a01-l04.mp3" },
  { speakerId: "yui", japanese: <>そうですね。でも、住みやすい町ですね。</>, romaji: "Sou desu ne. Demo, sumiyasui machi desu ne.", translation: "Betul. Tetapi, kota ini nyaman untuk ditinggali, ya.", audioFileName: "irodori-elementary1-05-a01-l05.mp3" },
];

const recommendedPlaceConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>この近くに、おすすめの場所がありますか。</>, romaji: "Kono chikaku ni, osusume no basho ga arimasu ka?", translation: "Apakah ada tempat rekomendasi di dekat sini?", audioFileName: "irodori-elementary1-05-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>はい。桜公園がおすすめです。</>, romaji: "Hai. Sakura Kouen ga osusume desu.", translation: "Ada. Taman Sakura adalah tempat yang saya rekomendasikan.", audioFileName: "irodori-elementary1-05-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>どんなところですか。</>, romaji: "Donna tokoro desu ka?", translation: "Tempat seperti apa itu?", audioFileName: "irodori-elementary1-05-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>駅から遠いけど、静かで、きれいですよ。</>, romaji: "Eki kara tooi kedo, shizuka de, kirei desu yo.", translation: "Memang jauh dari stasiun, tetapi tenang dan indah.", audioFileName: "irodori-elementary1-05-a02-l04.mp3" },
];

const localShopConversation: IrodoriUtterance[] = [
  { speakerId: "sota", japanese: <>この町に有名な食堂がありますか。</>, romaji: "Kono machi ni yuumei na shokudou ga arimasu ka?", translation: "Apakah ada kedai makan terkenal di kota ini?", audioFileName: "irodori-elementary1-05-a03-l01.mp3" },
  { speakerId: "yui", japanese: <>はい。駅の近くに、ひかり食堂があります。</>, romaji: "Hai. Eki no chikaku ni, Hikari Shokudou ga arimasu.", translation: "Ada. Di dekat stasiun terdapat Kedai Makan Hikari.", audioFileName: "irodori-elementary1-05-a03-l02.mp3" },
  { speakerId: "sota", japanese: <>どんな店ですか。</>, romaji: "Donna mise desu ka?", translation: "Toko atau kedai seperti apa itu?", audioFileName: "irodori-elementary1-05-a03-l03.mp3" },
  { speakerId: "yui", japanese: <>料理がおいしくて、値段も安いです。</>, romaji: "Ryouri ga oishikute, nedan mo yasui desu.", translation: "Masakannya enak dan harganya juga murah.", audioFileName: "irodori-elementary1-05-a03-l04.mp3" },
];

const townMapConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>この町の地図を見ていますか。</>, romaji: "Kono machi no chizu o mite imasu ka?", translation: "Apakah kamu sedang melihat peta kota ini?", audioFileName: "irodori-elementary1-05-a04-l01.mp3" },
  { speakerId: "akiko", japanese: <>はい。図書館はどこですか。</>, romaji: "Hai. Toshokan wa doko desu ka?", translation: "Iya. Di mana perpustakaannya?", audioFileName: "irodori-elementary1-05-a04-l02.mp3" },
  { speakerId: "kenji", japanese: <>公園の近くです。駅から少し遠いです。</>, romaji: "Kouen no chikaku desu. Eki kara sukoshi tooi desu.", translation: "Letaknya dekat taman. Agak jauh dari stasiun.", audioFileName: "irodori-elementary1-05-a04-l03.mp3" },
  { speakerId: "akiko", japanese: <>そうですか。静かなところですね。</>, romaji: "Sou desu ka. Shizuka na tokoro desu ne.", translation: "Begitu, ya. Tempat yang tenang.", audioFileName: "irodori-elementary1-05-a04-l04.mp3" },
];

const townActivityConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>この町には何がありますか。</>, romaji: "Kono machi ni wa nani ga arimasu ka?", translation: "Ada apa saja di kota ini?", audioFileName: "irodori-elementary1-05-a05-l01.mp3" },
  { speakerId: "sota", japanese: <>大きい公園があります。春には花を見ることができます。</>, romaji: "Ookii kouen ga arimasu. Haru ni wa hana o miru koto ga dekimasu.", translation: "Ada taman yang besar. Pada musim semi, kita bisa melihat bunga.", audioFileName: "irodori-elementary1-05-a05-l02.mp3" },
  { speakerId: "yui", japanese: <>町は静かですか。</>, romaji: "Machi wa shizuka desu ka?", translation: "Apakah kotanya tenang?", audioFileName: "irodori-elementary1-05-a05-l03.mp3" },
  { speakerId: "sota", japanese: <>駅の周りはにぎやかだけど、少し離れると静かです。</>, romaji: "Eki no mawari wa nigiyaka da kedo, sukoshi hanareru to shizuka desu.", translation: "Di sekitar stasiun ramai, tetapi agak jauh dari sana suasananya tenang.", audioFileName: "irodori-elementary1-05-a05-l04.mp3" },
];

const canDos = [
  { id: "describe-town", text: "Menceritakan kesan sederhana tentang kota tempat tinggal." },
  { id: "ask-recommended-places", text: "Bertanya tentang tempat rekomendasi di sekitar kota dan memahami jawabannya." },
  { id: "read-town-map", text: "Melihat peta kota dan memperoleh informasi tentang tempat terkenal atau toko." },
  { id: "connect-descriptions", text: "Menghubungkan dua deskripsi sederhana dengan pola ～で／～くて." },
  { id: "describe-what-is-possible", text: "Menjelaskan kegiatan yang dapat dilakukan di suatu tempat dengan ～ことができます." },
];

const townPlaces = [
  {
    id: "sakura-park",
    name: "桜公園",
    category: "公園 · Taman",
    location: "町の北側 · Agak jauh dari stasiun",
    japanese: "駅から少し遠いけど、静かで、景色がきれいです。",
    reading: "Eki kara sukoshi tooi kedo, shizuka de, keshiki ga kirei desu.",
    translation: "Agak jauh dari stasiun, tetapi tenang dan pemandangannya indah.",
    detail: "春にはいろいろな花を見ることができます。 — Pada musim semi, kamu bisa melihat berbagai bunga.",
  },
  {
    id: "hikari-diner",
    name: "ひかり食堂",
    category: "食堂 · Kedai makan",
    location: "駅の近く · Dekat stasiun",
    japanese: "料理がおいしくて、値段も安いです。",
    reading: "Ryouri ga oishikute, nedan mo yasui desu.",
    translation: "Masakannya enak dan harganya juga terjangkau.",
    detail: "昼も夜も食事をすることができます。 — Kamu bisa makan siang maupun malam di sini.",
  },
  {
    id: "sakura-shopping-street",
    name: "さくら商店街",
    category: "商店街 · Area pertokoan",
    location: "駅の南側 · Sebelah selatan stasiun",
    japanese: "店が多くて、とてもにぎやかです。",
    reading: "Mise ga ookute, totemo nigiyaka desu.",
    translation: "Tokonya banyak dan suasananya sangat ramai.",
    detail: "いろいろな店で買い物をすることができます。 — Kamu bisa berbelanja di berbagai toko.",
  },
  {
    id: "city-library",
    name: "市立図書館",
    category: "図書館 · Perpustakaan",
    location: "公園の近く · Dekat taman",
    japanese: "静かで、ゆっくり本を読むことができます。",
    reading: "Shizuka de, yukkuri hon o yomu koto ga dekimasu.",
    translation: "Tempatnya tenang dan kamu bisa membaca buku dengan santai.",
    detail: "町の北側にあります。 — Letaknya di bagian utara kota.",
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
    prompt: <>Lengkapi kalimat: 「この町はにぎやか ___、便利です。」</>,
    options: [{ key: "a", label: "で" }, { key: "b", label: "くて" }, { key: "c", label: "けど" }],
    answer: "a",
    explanation: <>Kata sifat な seperti にぎやか dihubungkan dengan kata sifat atau kalimat berikutnya menggunakan で.</>,
  },
  {
    prompt: <>Gabungkan 「駅が近い」 dan 「便利です」 menjadi satu kalimat.</>,
    options: [{ key: "a", label: "駅が近くて、便利です。" }, { key: "b", label: "駅が近いで、便利です。" }, { key: "c", label: "駅が近いけど、便利です。" }],
    answer: "a",
    explanation: <>Kata sifat い 近い berubah menjadi 近くて saat menghubungkan dua deskripsi.</>,
  },
  {
    prompt: <>Pilih kalimat yang menyatakan dua keadaan saling berlawanan.</>,
    options: [{ key: "a", label: "公園は遠いけど、きれいです。" }, { key: "b", label: "公園は遠くて、きれいです。" }, { key: "c", label: "公園は遠いですから、きれいです。" }],
    answer: "a",
    explanation: <>けど menghubungkan dua informasi yang berlawanan: taman jauh, tetapi indah.</>,
  },
  {
    prompt: <>Ungkapan yang tepat untuk menanyakan tempat rekomendasi di sekitar adalah …</>,
    options: [{ key: "a", label: "この近くに、おすすめの場所がありますか。" }, { key: "b", label: "昨日は雨でしたか。" }, { key: "c", label: "何時に起きますか。" }],
    answer: "a",
    explanation: <>この近くに berarti di sekitar sini, sedangkan おすすめの場所 berarti tempat yang direkomendasikan.</>,
  },
  {
    prompt: <>Pada peta tertulis 「図書館は公園の近くです」. Di mana perpustakaan?</>,
    options: [{ key: "a", label: "Di dekat taman." }, { key: "b", label: "Jauh dari taman." }, { key: "c", label: "Di dalam stasiun." }],
    answer: "a",
    explanation: <>公園の近く berarti di dekat taman. Perhatikan kata lokasi untuk mengambil informasi dari peta.</>,
  },
  {
    prompt: <>Apa arti 「本を読むことができます」?</>,
    options: [{ key: "a", label: "Bisa membaca buku." }, { key: "b", label: "Sedang membaca buku." }, { key: "c", label: "Harus membeli buku." }],
    answer: "a",
    explanation: <>Bentuk kamus kata kerja + ことができます menyatakan kemampuan atau hal yang dapat dilakukan.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Pilih bentuk yang tepat untuk menghubungkan kata sifat な 「便利」 dengan deskripsi berikutnya.</>,
    options: [{ key: "a", label: "便利で" }, { key: "b", label: "便利くて" }, { key: "c", label: "便利いけど" }],
    answer: "a",
    explanation: <>便利 adalah kata sifat な, sehingga bentuk penghubungnya adalah 便利で.</>,
  },
  {
    prompt: <>Kata sifat い 「おいしい」 berubah menjadi bentuk penghubung …</>,
    options: [{ key: "a", label: "おいしくて" }, { key: "b", label: "おいしいで" }, { key: "c", label: "おいしいだけど" }],
    answer: "a",
    explanation: <>Akhiran い pada kata sifat い berubah menjadi くて: おいしい → おいしくて.</>,
  },
  {
    prompt: <>Pilih kalimat yang benar untuk menyatakan “Kota ini tenang dan nyaman.”</>,
    options: [{ key: "a", label: "この町は静かで、便利です。" }, { key: "b", label: "この町は静かくて、便利です。" }, { key: "c", label: "この町は静かいで、便利です。" }],
    answer: "a",
    explanation: <>静か adalah kata sifat な. Bentuk penghubungnya adalah 静かで.</>,
  },
  {
    prompt: <>Pola ～けど digunakan untuk …</>,
    options: [{ key: "a", label: "Menghubungkan dua informasi yang berlawanan." }, { key: "b", label: "Menunjukkan urutan waktu." }, { key: "c", label: "Menyatakan kemampuan." }],
    answer: "a",
    explanation: <>けど menghubungkan dua kalimat yang memiliki hubungan kontras, misalnya “jauh, tetapi indah”.</>,
  },
  {
    prompt: <>Apa arti 「駅から遠いけど、きれいです」?</>,
    options: [{ key: "a", label: "Jauh dari stasiun, tetapi indah." }, { key: "b", label: "Dekat stasiun dan indah." }, { key: "c", label: "Stasiun itu ramai dan besar." }],
    answer: "a",
    explanation: <>遠い berarti jauh, けど berarti tetapi, dan きれい berarti indah atau bersih.</>,
  },
  {
    prompt: <>Lengkapi: 「公園で花を見る ___ ができます。」</>,
    options: [{ key: "a", label: "こと" }, { key: "b", label: "もの" }, { key: "c", label: "ところ" }],
    answer: "a",
    explanation: <>Kata kerja bentuk kamus diikuti ことができます untuk menyatakan sesuatu yang dapat dilakukan.</>,
  },
  {
    prompt: <>Kalimat 「この近くにおすすめの店がありますか」 menanyakan …</>,
    options: [{ key: "a", label: "Apakah ada toko rekomendasi di dekat sini?" }, { key: "b", label: "Apakah toko itu tutup kemarin?" }, { key: "c", label: "Berapa lama perjalanan ke sekolah?" }],
    answer: "a",
    explanation: <>この近くに menunjukkan lokasi sekitar sini, sedangkan おすすめの店 berarti toko rekomendasi.</>,
  },
  {
    prompt: <>Pada peta, 「図書館は公園の近くです」 berarti …</>,
    options: [{ key: "a", label: "Perpustakaan berada dekat taman." }, { key: "b", label: "Taman berada jauh dari kota." }, { key: "c", label: "Perpustakaan berada di dalam toko." }],
    answer: "a",
    explanation: <>公園の近く berarti dekat taman. Informasi lokasi seperti ini membantu membaca peta sederhana.</>,
  },
  {
    prompt: <>Apa arti kata 「有名」?</>,
    options: [{ key: "a", label: "Terkenal." }, { key: "b", label: "Sepi." }, { key: "c", label: "Jauh." }],
    answer: "a",
    explanation: <>有名（ゆうめい）berarti terkenal dan merupakan kata sifat な.</>,
  },
  {
    prompt: <>Apa informasi dari 「店が多くて、とてもにぎやかです」?</>,
    options: [{ key: "a", label: "Tokonya banyak dan suasananya sangat ramai." }, { key: "b", label: "Tokonya sedikit dan suasananya tenang." }, { key: "c", label: "Tokonya jauh dan sudah tutup." }],
    answer: "a",
    explanation: <>多くて adalah bentuk penghubung dari 多い, sedangkan にぎやか berarti ramai.</>,
  },
];

const simulations = [
  {
    title: "01 · Mendeskripsikan kota",
    heading: "Menggabungkan dua kesan",
    prompt: "Yui bertanya bagaimana kesan Sota tentang kota tempat tinggalnya. Kota itu ramai dan praktis.",
    japanese: <>この町はどうですか。</>,
    translation: "Bagaimana menurutmu kota ini?",
    options: [
      { key: "correct", label: "とてもにぎやかで、便利です。", meaning: "Sangat ramai dan praktis." },
      { key: "contrast", label: "とてもにぎやかだけど、便利です。", meaning: "Sangat ramai, tetapi praktis." },
      { key: "past", label: "昨日はとてもにぎやかでした。", meaning: "Kemarin sangat ramai." },
    ],
    answer: "correct",
    explanation: "にぎやか adalah kata sifat な, sehingga dihubungkan dengan 便利 menggunakan で.",
  },
  {
    title: "02 · Menghubungkan kata sifat い",
    heading: "Memilih bentuk くて",
    prompt: "Kamu ingin menjelaskan bahwa jalan dekat stasiun dan praktis.",
    japanese: <>駅は近いです。それに、便利です。</>,
    translation: "Stasiunnya dekat. Selain itu, praktis.",
    options: [
      { key: "correct", label: "駅が近くて、便利です。", meaning: "Stasiunnya dekat dan praktis." },
      { key: "wrong1", label: "駅が近いで、便利です。", meaning: "Bentuk penghubungnya tidak tepat." },
      { key: "wrong2", label: "駅が近いだけど、便利です。", meaning: "Bentuk kontrasnya tidak sesuai untuk maksud ini." },
    ],
    answer: "correct",
    explanation: "近い adalah kata sifat い. Ubah い menjadi くて untuk menghubungkan dua deskripsi.",
  },
  {
    title: "03 · Menanyakan tempat rekomendasi",
    heading: "Memahami jawaban tentang taman",
    prompt: "Akiko bertanya tentang tempat yang direkomendasikan. Kenji menyarankan taman yang agak jauh, tetapi tenang dan indah.",
    japanese: <>おすすめの場所がありますか。</>,
    translation: "Apakah ada tempat yang direkomendasikan?",
    options: [
      { key: "park", label: "駅から遠いけど、静かで、きれいですよ。", meaning: "Jauh dari stasiun, tetapi tenang dan indah." },
      { key: "shop", label: "店が多くて、にぎやかです。", meaning: "Tokonya banyak dan ramai." },
      { key: "weather", label: "明日は晴れるでしょう。", meaning: "Besok mungkin cerah." },
    ],
    answer: "park",
    explanation: "Jawaban menyebutkan jarak dari stasiun dan dua kesan positif tentang taman.",
  },
  {
    title: "04 · Membaca peta kota",
    heading: "Menemukan lokasi perpustakaan",
    prompt: "Pada peta kota, perpustakaan berada di dekat taman dan agak jauh dari stasiun.",
    japanese: <>図書館はどこですか。</>,
    translation: "Di mana perpustakaannya?",
    options: [
      { key: "library", label: "公園の近くです。駅から少し遠いです。", meaning: "Dekat taman dan agak jauh dari stasiun." },
      { key: "station", label: "駅の中です。", meaning: "Di dalam stasiun." },
      { key: "park", label: "公園から遠いです。", meaning: "Jauh dari taman." },
    ],
    answer: "library",
    explanation: "公園の近く berarti dekat taman. Perhatikan dua informasi lokasi yang disebutkan.",
  },
  {
    title: "05 · Menjelaskan hal yang bisa dilakukan",
    heading: "Menggunakan ことができます",
    prompt: "Kamu ingin menjelaskan kegiatan yang bisa dilakukan di taman pada musim semi.",
    japanese: <>春には何をすることができますか。</>,
    translation: "Apa yang bisa dilakukan pada musim semi?",
    options: [
      { key: "flowers", label: "いろいろな花を見ることができます。", meaning: "Bisa melihat berbagai bunga." },
      { key: "past", label: "昨日、花を見ました。", meaning: "Kemarin melihat bunga." },
      { key: "weather", label: "今日は雨です。", meaning: "Hari ini hujan." },
    ],
    answer: "flowers",
    explanation: "見る adalah bentuk kamus dari kata kerja. Pola 見ることができます berarti bisa melihat.",
  },
];

const vocabulary = [
  ["町", "まち · machi", "Kota"],
  ["店", "みせ · mise", "Toko"],
  ["食堂", "しょくどう · shokudou", "Kedai makan / kantin"],
  ["便利", "べんり · benri", "Praktis / nyaman"],
  ["不便", "ふべん · fuben", "Tidak praktis"],
  ["静か", "しずか · shizuka", "Tenang"],
  ["有名", "ゆうめい · yuumei", "Terkenal"],
  ["多い", "おおい · ooi", "Banyak"],
  ["少ない", "すくない · sukunai", "Sedikit"],
  ["遠い", "とおい · tooi", "Jauh"],
  ["にぎやか", "にぎやか · nigiyaka", "Ramai"],
  ["田舎", "いなか · inaka", "Pedesaan"],
  ["商店街", "しょうてんがい · shoutengai", "Area pertokoan"],
  ["公園", "こうえん · kouen", "Taman"],
  ["図書館", "としょかん · toshokan", "Perpustakaan"],
  ["駅", "えき · eki", "Stasiun"],
  ["場所", "ばしょ · basho", "Tempat"],
  ["おすすめ", "おすすめ · osusume", "Rekomendasi"],
  ["景色", "けしき · keshiki", "Pemandangan"],
  ["住む", "すむ · sumu", "Tinggal / menetap"],
  ["人", "ひと · hito", "Orang"],
  ["緑", "みどり · midori", "Pepohonan / kehijauan"],
  ["近く", "ちかく · chikaku", "Dekat / sekitar"],
  ["きれい", "きれい · kirei", "Indah / bersih"],
  ["住みやすい", "すみやすい · sumiyasui", "Nyaman untuk ditinggali"],
];

const kanjiWords = [
  ["町", "まち · machi", "Kota"],
  ["店", "みせ · mise", "Toko"],
  ["食堂", "しょくどう · shokudou", "Kedai makan"],
  ["便利", "べんり · benri", "Praktis"],
  ["不便", "ふべん · fuben", "Tidak praktis"],
  ["静か", "しずか · shizuka", "Tenang"],
  ["有名", "ゆうめい · yuumei", "Terkenal"],
  ["多い", "おおい · ooi", "Banyak"],
  ["少ない", "すくない · sukunai", "Sedikit"],
  ["遠い", "とおい · tooi", "Jauh"],
];

export default function IrodoriElementaryOneLessonFivePage() {
  const progress = useIrodoriProgress();
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});

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
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#91B99A]/[0.08]">町</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">IRODORI • DASAR 1 A2 • PELAJARAN 05</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Tempat ini sangat ramai dan nyaman.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9CDB0]">とてもにぎやかで便利です</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Berlatih menceritakan kesan tentang kota, bertanya tentang tempat rekomendasi, dan mengambil informasi sederhana dari peta kota.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9CDB0]" />Kesan tentang kota</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#A9CDB0]" />Tempat rekomendasi</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#A9CDB0]" />Membaca peta kota</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A9CDB0]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Tiga target pertama mengikuti target komunikasi resmi. Dua target terakhir merupakan latihan penguatan Fude.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">{index < 3 ? "CAN-DO UTAMA" : "LATIHAN PENGUATAN"} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KOSAKATA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kota, fasilitas, dan tempat menarik</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata untuk menggambarkan suasana kota, fasilitas umum, dan tempat yang bisa dikunjungi.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {vocabulary.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9CDB0]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menceritakan suasana kota dan tempat rekomendasi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan cara menyampaikan kesan tentang kota, bertanya tentang tempat menarik, dan memahami informasi lokasi.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Menyampaikan kesan tentang kota" speakers={[speakers.yui, speakers.sota]} utterances={townImpressionConversation} />
          <IrodoriConversation title="Bertanya tentang tempat rekomendasi" speakers={[speakers.akiko, speakers.kenji]} utterances={recommendedPlaceConversation} />
          <IrodoriConversation title="Mencari kedai makan terkenal" speakers={[speakers.sota, speakers.yui]} utterances={localShopConversation} />
          <IrodoriConversation title="Membaca peta kota" speakers={[speakers.kenji, speakers.akiko]} utterances={townMapConversation} />
          <IrodoriConversation title="Membicarakan kegiatan di kota" speakers={[speakers.yui, speakers.sota]} utterances={townActivityConversation} />
        </div>
      </section>


      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">PETA KOTA & TEMPAT REKOMENDASI</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali lokasi dan keistimewaan tempat</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan peta teks sederhana untuk melihat letak beberapa tempat. Setelah itu, baca deskripsi singkat setiap lokasi.</p>
        </div>
        <article className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4 md:p-5">
          <p className="text-[9px] font-black tracking-[0.18em] text-[#A9CDB0]">TOWN MAP · 町の地図</p>
          <p className="mt-1 text-[10px] text-[#A9A398]">Peta sederhana kota contoh · Bukan peta navigasi sebenarnya</p>
          <div className="mx-auto mt-4 grid max-w-xl grid-cols-3 gap-2 text-center">
            <div className="col-start-2 rounded-lg border border-white/[0.07] bg-black/15 p-2 text-[10px] text-[#A9A398]">北側 · Bagian utara</div>
            <div className="rounded-xl border border-[#6E9A75]/25 bg-[#263D2D] p-3">
              <p className="font-mincho text-sm text-[#F1EBDD]">桜公園</p>
              <p className="mt-1 text-[9px] text-[#A9CDB0]">Taman Sakura</p>
            </div>
            <div className="rounded-xl border border-[#6E9A75]/25 bg-[#263D2D] p-3">
              <p className="font-mincho text-sm text-[#F1EBDD]">市立図書館</p>
              <p className="mt-1 text-[9px] text-[#A9CDB0]">Perpustakaan kota</p>
            </div>
            <div className="col-span-3 rounded-lg border border-white/[0.07] bg-black/15 p-2 text-[10px] text-[#A9A398]">中央通り · Jalan utama</div>
            <div className="rounded-xl border border-[#6E9A75]/25 bg-[#263D2D] p-3">
              <p className="font-mincho text-sm text-[#F1EBDD]">さくら商店街</p>
              <p className="mt-1 text-[9px] text-[#A9CDB0]">Area pertokoan</p>
            </div>
            <div className="rounded-xl border border-[#8EAE93]/45 bg-[#314735] p-3">
              <p className="font-mincho text-sm text-[#F1EBDD]">駅</p>
              <p className="mt-1 text-[9px] text-[#CFE4D2]">Stasiun</p>
            </div>
            <div className="rounded-xl border border-[#6E9A75]/25 bg-[#263D2D] p-3">
              <p className="font-mincho text-sm text-[#F1EBDD]">ひかり食堂</p>
              <p className="mt-1 text-[9px] text-[#A9CDB0]">Kedai makan</p>
            </div>
          </div>
          <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">ヒント: 桜公園 dan 市立図書館 berada di bagian utara. さくら商店街 dan ひかり食堂 berada di sekitar bagian selatan dan stasiun.</p>
        </article>
        <div className="grid gap-3 sm:grid-cols-2">
          {townPlaces.map((place) => (
            <article key={place.id} className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mincho text-base font-bold text-[#F1EBDD]">{place.name}</span>
                <span className="rounded-full border border-[#8EAE93]/25 bg-[#476C51]/15 px-2.5 py-1 text-[9px] font-bold text-[#CFE4D2]">{place.category}</span>
              </div>
              <p className="mt-2 text-[10px] text-[#A9CDB0]">{place.location}</p>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{place.japanese}</p>
              <p className="mt-1 text-[10px] italic leading-5 text-[#A9CDB0]">{place.reading}</p>
              <p className="mt-2 text-xs leading-5 text-[#D0C9BD]">{place.translation}</p>
              <p className="mt-3 rounded-lg bg-black/20 p-2 text-[10px] leading-5 text-[#A9A398]">{place.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menghubungkan deskripsi dan menyampaikan kemampuan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Tiga pola utama pada pelajaran ini membantu menjelaskan suasana kota, menyampaikan perbandingan, dan mengatakan hal yang dapat dilakukan.</p>
        </div>
        {[
          {
            title: "01 · Menghubungkan kata benda dan kata sifat",
            pattern: "N で、～ / ナA-で、～ / イA-くて、～",
            example: <>この町は、とてもにぎやかで、便利です。／ 駅が近くて、便利です。</>,
            note: "Pola ini menggabungkan dua kalimat atau deskripsi. Kata benda dan kata sifat な menggunakan で: 田舎で、静かです. Kata sifat い mengubah い menjadi くて: 近い → 近くて, おいしい → おいしくて.",
          },
          {
            title: "02 · Menyatakan kontras dengan けど",
            pattern: "Nだ / ナA-だ / イA-い + けど、～",
            example: <>この公園は、駅から遠いけど、きれいです。／ この町は田舎だけど、便利です。</>,
            note: "けど menghubungkan dua informasi yang berlawanan. Kata benda dan kata sifat な menggunakan だけど, sedangkan kata sifat い langsung diikuti けど: 遠いけど. Pola ini sering digunakan untuk menyampaikan kelebihan dan kekurangan suatu tempat.",
          },
          {
            title: "03 · Menyatakan hal yang dapat dilakukan",
            pattern: "V-る + ことができます",
            example: <>公園で花を見ることができます。／ 図書館で本を読むことができます。</>,
            note: "Gunakan kata kerja bentuk kamus sebelum ことができます untuk menyatakan kemampuan atau kegiatan yang tersedia. 見ます berubah menjadi 見る, lalu menjadi 見ることができます (bisa melihat).",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#8EAE93]">{item.title}</p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#A9CDB0]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KANJI DAN KATA PENTING</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali tulisan penting tentang kota dan fasilitas</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9CDB0]"
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">SIMULASI INTERAKTIF</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan ungkapan dalam situasi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi komunikasi tentang kota, tempat rekomendasi, dan informasi lokasi. Setiap situasi harus dijawab benar.</p>
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
                <p className="mt-1 text-xs leading-6 text-[#A9A398]"><JapaneseReading showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></p>
              </div>
              <div className="rounded-xl border border-[#6E9A75]/20 bg-[#202720] p-4">
                <p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading showRomaji={false} allowIndexFallback>{task.japanese}</JapaneseReading></p>
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
                    <p className="font-mincho text-sm text-[#F1EBDD]"><JapaneseReading showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></p>
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
                              ? "border-[#8EAE93]/60 bg-[#476C51]/15 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      <JapaneseReading showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {practiceSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
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
                              ? "border-[#8EAE93]/60 bg-[#476C51]/15 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      <JapaneseReading showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
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
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. Progres Dasar 1 tersimpan dalam jalur Irodori, terpisah dari Minna no Nihongo dan JLPT.</p>
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
                    <JapaneseReading showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
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
        Dialog, tokoh, dan situasi latihan dibuat orisinal oleh Fude untuk melatih percakapan tentang kota dan tempat di sekitarnya.
      </p>
    </main>
  );
}
