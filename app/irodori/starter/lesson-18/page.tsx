"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Compass,
  MessageCircle,
  RefreshCw,
  Send,
  TrainFront,
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

const holidayPlanConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>ケンジさん、<ruby>今度<rt>こんど</rt></ruby>の<ruby>休<rt>やす</rt></ruby>みはどうしますか？</>,
    romaji: "Kenji-san, kondo no yasumi wa dou shimasu ka?",
    translation: "Kenji, apa rencanamu untuk libur berikutnya?",
    audioFileName: "irodori-starter-18-a01-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>どこか<ruby>旅行<rt>りょこう</rt></ruby>したいです。</>,
    romaji: "Dokoka ryokou shitai desu.",
    translation: "Saya ingin bepergian ke suatu tempat.",
    audioFileName: "irodori-starter-18-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>いいですね。どこへ<ruby>行<rt>い</rt></ruby>きたいですか？</>,
    romaji: "Ii desu ne. Doko e ikitai desu ka?",
    translation: "Wah, bagus. Kamu ingin pergi ke mana?",
    audioFileName: "irodori-starter-18-a01-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <><ruby>山<rt>やま</rt></ruby>の<ruby>近<rt>ちか</rt></ruby>くへ<ruby>行<rt>い</rt></ruby>きたいです。ゆっくりしたいです。</>,
    romaji: "Yama no chikaku e ikitai desu. Yukkuri shitai desu.",
    translation: "Saya ingin pergi ke dekat pegunungan. Saya ingin bersantai.",
    audioFileName: "irodori-starter-18-a01-l04.mp3",
  },
];

const japanWishConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>アキコさん、<ruby>日本<rt>にほん</rt></ruby>で<ruby>何<rt>なに</rt></ruby>がしたいですか？</>,
    romaji: "Akiko-san, Nihon de nani ga shitai desu ka?",
    translation: "Akiko, apa yang ingin kamu lakukan di Jepang?",
    audioFileName: "irodori-starter-18-a02-l01.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <><ruby>新幹線<rt>しんかんせん</rt></ruby>に<ruby>乗<rt>の</rt></ruby>りたいです。</>,
    romaji: "Shinkansen ni noritai desu.",
    translation: "Saya ingin naik Shinkansen.",
    audioFileName: "irodori-starter-18-a02-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>そうですか。ほかに、<ruby>何<rt>なに</rt></ruby>がしたいですか？</>,
    romaji: "Sou desu ka. Hoka ni, nani ga shitai desu ka?",
    translation: "Begitu, ya. Selain itu, apa lagi yang ingin kamu lakukan?",
    audioFileName: "irodori-starter-18-a02-l03.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>おいしいお<ruby>菓子<rt>かし</rt></ruby>が<ruby>食<rt>た</rt></ruby>べたいです。あと、<ruby>雪<rt>ゆき</rt></ruby>も<ruby>見<rt>み</rt></ruby>たいです。</>,
    romaji: "Oishii okashi ga tabetai desu. Ato, yuki mo mitai desu.",
    translation: "Saya ingin makan kue yang enak. Selain itu, saya juga ingin melihat salju.",
    audioFileName: "irodori-starter-18-a02-l04.mp3",
  },
];

const tripConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>ソウタさん、<ruby>週末<rt>しゅうまつ</rt></ruby>はどこへ<ruby>行<rt>い</rt></ruby>きましたか？</>,
    romaji: "Souta-san, shuumatsu wa doko e ikimashita ka?",
    translation: "Sota, akhir pekan kemarin pergi ke mana?",
    audioFileName: "irodori-starter-18-a03-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <><ruby>海<rt>うみ</rt></ruby>の<ruby>近<rt>ちか</rt></ruby>くへ<ruby>行<rt>い</rt></ruby>きました。</>,
    romaji: "Umi no chikaku e ikimashita.",
    translation: "Saya pergi ke dekat laut.",
    audioFileName: "irodori-starter-18-a03-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>そこで、<ruby>何<rt>なに</rt></ruby>をしましたか？</>,
    romaji: "Soko de, nani o shimashita ka?",
    translation: "Di sana, apa yang kamu lakukan?",
    audioFileName: "irodori-starter-18-a03-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>まず、<ruby>船<rt>ふね</rt></ruby>に<ruby>乗<rt>の</rt></ruby>りました。それから、<ruby>海<rt>うみ</rt></ruby>の<ruby>写真<rt>しゃしん</rt></ruby>を<ruby>撮<rt>と</rt></ruby>りました。</>,
    romaji: "Mazu, fune ni norimashita. Sorekara, umi no shashin o torimashita.",
    translation: "Pertama, saya naik kapal. Setelah itu, saya mengambil foto laut.",
    audioFileName: "irodori-starter-18-a03-l04.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>どうでしたか？</>,
    romaji: "Dou deshita ka?",
    translation: "Bagaimana perjalanannya?",
    audioFileName: "irodori-starter-18-a03-l05.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>とても<ruby>楽<rt>たの</rt></ruby>しかったです。それに、<ruby>景色<rt>けしき</rt></ruby>もきれいでした。</>,
    romaji: "Totemo tanoshikatta desu. Soreni, keshiki mo kirei deshita.",
    translation: "Sangat menyenangkan. Pemandangannya juga indah.",
    audioFileName: "irodori-starter-18-a03-l06.mp3",
  },
];

const socialPostConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>ユイさん、<ruby>写真<rt>しゃしん</rt></ruby>を<ruby>見<rt>み</rt></ruby>ました。どこへ<ruby>行<rt>い</rt></ruby>きましたか？</>,
    romaji: "Yui-san, shashin o mimashita. Doko e ikimashita ka?",
    translation: "Yui, saya melihat fotomu. Kamu pergi ke mana?",
    audioFileName: "irodori-starter-18-a04-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <><ruby>日曜日<rt>にちようび</rt></ruby>に、<ruby>公園<rt>こうえん</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きました。</>,
    romaji: "Nichiyoubi ni, kouen e ikimashita.",
    translation: "Hari Minggu saya pergi ke taman.",
    audioFileName: "irodori-starter-18-a04-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>そこで、<ruby>何<rt>なに</rt></ruby>をしましたか？</>,
    romaji: "Soko de, nani o shimashita ka?",
    translation: "Di sana, apa yang kamu lakukan?",
    audioFileName: "irodori-starter-18-a04-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>お<ruby>弁当<rt>べんとう</rt></ruby>を<ruby>食<rt>た</rt></ruby>べました。とてもおいしかったです。</>,
    romaji: "Obentou o tabemashita. Totemo oishikatta desu.",
    translation: "Saya makan bekal. Rasanya sangat enak.",
    audioFileName: "irodori-starter-18-a04-l04.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>いいですね。<ruby>次<rt>つぎ</rt></ruby>は、<ruby>何<rt>なに</rt></ruby>をしたいですか？</>,
    romaji: "Ii desu ne. Tsugi wa, nani o shitai desu ka?",
    translation: "Wah, menyenangkan. Berikutnya, apa yang ingin kamu lakukan?",
    audioFileName: "irodori-starter-18-a04-l05.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>こんどは、<ruby>海<rt>うみ</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きたいです。</>,
    romaji: "Kondo wa, umi e ikitai desu.",
    translation: "Lain kali, saya ingin pergi ke laut.",
    audioFileName: "irodori-starter-18-a04-l06.mp3",
  },
];

const invitationConversation: IrodoriUtterance[] = [
  {
    speakerId: "kenji",
    japanese: <>らいしゅうの<ruby>休<rt>やす</rt></ruby>み、いっしょにどこか<ruby>行<rt>い</rt></ruby>きませんか？</>,
    romaji: "Raishuu no yasumi, issho ni dokoka ikimasen ka?",
    translation: "Libur minggu depan, mau pergi ke suatu tempat bersama?",
    audioFileName: "irodori-starter-18-a05-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>いいですね。どこへ<ruby>行<rt>い</rt></ruby>きたいですか？</>,
    romaji: "Ii desu ne. Doko e ikitai desu ka?",
    translation: "Boleh juga. Kamu ingin pergi ke mana?",
    audioFileName: "irodori-starter-18-a05-l02.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>みどり<ruby>公園<rt>こうえん</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きたいです。</>,
    romaji: "Midori kouen e ikitai desu.",
    translation: "Saya ingin pergi ke Taman Midori.",
    audioFileName: "irodori-starter-18-a05-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>いいですね。いっしょに<ruby>行<rt>い</rt></ruby>きましょう。</>,
    romaji: "Ii desu ne. Issho ni ikimashou.",
    translation: "Bagus. Ayo pergi bersama.",
    audioFileName: "irodori-starter-18-a05-l04.mp3",
  },
];

const canDos = [
  { id: "ask-answer-holiday-wishes", text: "Bertanya dan menjawab tentang hal yang ingin dilakukan pada hari libur." },
  { id: "answer-japan-wishes", text: "Memberi jawaban sederhana tentang hal yang ingin dilakukan di Jepang." },
  { id: "write-holiday-post", text: "Menulis unggahan singkat tentang kegiatan pada hari libur." },
  { id: "describe-trip-sequence", text: "Menceritakan dua kegiatan dalam perjalanan secara berurutan dengan それから." },
  { id: "share-trip-impressions", text: "Menyampaikan beberapa kesan tentang perjalanan dengan それに dan でも." },
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
    prompt: <>Pilih bentuk ～たいです dari 「行きます」 (pergi).</>,
    options: [
      { key: "a", label: "行きたいです" },
      { key: "b", label: "行きますたいです" },
      { key: "c", label: "行きてたいです" },
    ],
    answer: "a",
    explanation: <>Lepaskan ます dari <ruby>行<rt>い</rt></ruby>きます, lalu tambahkan たいです: <ruby>行<rt>い</rt></ruby>きたいです.</>,
  },
  {
    prompt: <>Lengkapi kalimat: 「温泉 ___ 入りたいです。」</>,
    options: [
      { key: "a", label: "が" },
      { key: "b", label: "に" },
      { key: "c", label: "で" },
    ],
    answer: "b",
    explanation: <>Untuk kegiatan masuk ke onsen, 温泉に<ruby>入<rt>はい</rt></ruby>ります adalah pola yang dipakai. Partikel に menunjukkan tujuan / tempat masuk pada ungkapan ini.</>,
  },
  {
    prompt: <>Apa arti 「どこか旅行したいです」?</>,
    options: [
      { key: "a", label: "Saya tidak ingin bepergian ke mana pun." },
      { key: "b", label: "Saya ingin bepergian ke suatu tempat." },
      { key: "c", label: "Saya sedang mencari alamat." },
    ],
    answer: "b",
    explanation: <>どこか berarti suatu tempat atau somewhere, yaitu tempat yang belum ditentukan.</>,
  },
  {
    prompt: <>Pilih partikel penunjuk arah yang dibaca “e”.</>,
    options: [
      { key: "a", label: "へ" },
      { key: "b", label: "で" },
      { key: "c", label: "と" },
    ],
    answer: "a",
    explanation: <>Partikel へ ditulis へ tetapi dibaca “e”. Partikel ini dapat dipakai bersama kata kerja perpindahan seperti <ruby>行<rt>い</rt></ruby>きます.</>,
  },
  {
    prompt: <>Kata penghubung yang menambahkan keinginan lain, seperti “selain itu”, adalah …</>,
    options: [
      { key: "a", label: "でも" },
      { key: "b", label: "あと" },
      { key: "c", label: "それから" },
    ],
    answer: "b",
    explanation: <>あと menambahkan informasi atau keinginan lain. Contoh: <ruby>雪<rt>ゆき</rt></ruby>が<ruby>見<rt>み</rt></ruby>たいです。あと、<ruby>温泉<rt>おんせん</rt></ruby>にも<ruby>入<rt>はい</rt></ruby>りたいです.</>,
  },
  {
    prompt: <>Urutan dua kegiatan “naik kapal, setelah itu mengambil foto” memakai …</>,
    options: [
      { key: "a", label: "それに" },
      { key: "b", label: "でも" },
      { key: "c", label: "それから" },
    ],
    answer: "c",
    explanation: <>それから menghubungkan dua kejadian yang diceritakan sesuai urutan waktu.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa bentuk ～たいです dari 「食べます」?</>,
    options: [
      { key: "a", label: "食べたいです" },
      { key: "b", label: "食べますたいです" },
      { key: "c", label: "食べたいます" },
    ],
    answer: "a",
    explanation: <>Ambil bentuk masu <ruby>食<rt>た</rt></ruby>べます, lepaskan ます, lalu tambahkan たいです.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Saya ingin melihat salju.”</>,
    options: [
      { key: "a", label: <>雪を見ました。</> },
      { key: "b", label: <>雪が見たいです。</> },
      { key: "c", label: <>雪に見ます。</> },
    ],
    answer: "b",
    explanation: <>Untuk menyatakan keinginan, gunakan <ruby>見<rt>み</rt></ruby>たいです. Partikel が sering dipakai untuk objek pada pola ～たいです.</>,
  },
  {
    prompt: <>Apa arti 「どこか行きたいです」?</>,
    options: [
      { key: "a", label: "Saya ingin pergi ke suatu tempat." },
      { key: "b", label: "Saya tahu tempat itu." },
      { key: "c", label: "Saya tidak pergi ke mana pun." },
    ],
    answer: "a",
    explanation: <>どこか berarti somewhere, lokasi yang belum ditentukan.</>,
  },
  {
    prompt: <>Kalimat yang benar untuk “Saya ingin pergi ke Kyoto” adalah …</>,
    options: [
      { key: "a", label: <>京都で<ruby>行<rt>い</rt></ruby>きたいです。</> },
      { key: "b", label: <>京都へ<ruby>行<rt>い</rt></ruby>きたいです。</> },
      { key: "c", label: <>京都を<ruby>行<rt>い</rt></ruby>きたいです。</> },
    ],
    answer: "b",
    explanation: <>へ menunjukkan arah setelah nama tempat dan dibaca “e”. 京都に<ruby>行<rt>い</rt></ruby>きたいです juga benar.</>,
  },
  {
    prompt: <>Kalimat 「あと、雪も見たいです」 menyatakan …</>,
    options: [
      { key: "a", label: "Keinginan tambahan." },
      { key: "b", label: "Urutan kegiatan yang telah selesai." },
      { key: "c", label: "Pertentangan pendapat." },
    ],
    answer: "a",
    explanation: <>あと dipakai untuk menambahkan informasi atau keinginan lain.</>,
  },
  {
    prompt: <>Penghubung yang cocok untuk urutan “Pertama pergi ke taman. Setelah itu makan bekal.” adalah …</>,
    options: [
      { key: "a", label: "でも" },
      { key: "b", label: "それから" },
      { key: "c", label: "それに" },
    ],
    answer: "b",
    explanation: <>それから menghubungkan dua tindakan secara kronologis.</>,
  },
  {
    prompt: <>Penghubung untuk menambahkan kesan lain yang searah adalah …</>,
    options: [
      { key: "a", label: "それに" },
      { key: "b", label: "でも" },
      { key: "c", label: "どこか" },
    ],
    answer: "a",
    explanation: <>それに berarti selain itu / ditambah lagi dan menghubungkan dua kesan yang saling melengkapi.</>,
  },
  {
    prompt: <>Pilih kalimat yang menunjukkan pertentangan “Makanannya enak, tetapi agak mahal.”</>,
    options: [
      { key: "a", label: "おいしかったです。それから、高かったです。" },
      { key: "b", label: "おいしかったです。でも、ちょっと高かったです。" },
      { key: "c", label: "おいしかったです。それに、安かったです。" },
    ],
    answer: "b",
    explanation: <>でも menghubungkan dua kalimat yang maknanya berlawanan atau kontras.</>,
  },
  {
    prompt: <>Ungkapan sopan untuk mengajak teman pergi ke suatu tempat bersama adalah …</>,
    options: [
      { key: "a", label: <>いっしょにどこか<ruby>行<rt>い</rt></ruby>きませんか？</> },
      { key: "b", label: <>どこにも<ruby>行<rt>い</rt></ruby>きません。</> },
      { key: "c", label: <>どこで<ruby>行<rt>い</rt></ruby>きますか？</> },
    ],
    answer: "a",
    explanation: <>いっしょにどこか<ruby>行<rt>い</rt></ruby>きませんか？ adalah ajakan untuk pergi ke suatu tempat bersama.</>,
  },
  {
    prompt: <>Apa informasi yang cocok ditulis pada unggahan tentang hari libur?</>,
    options: [
      { key: "a", label: "Tempat yang dikunjungi, kegiatan, kesan, dan keinginan berikutnya." },
      { key: "b", label: "Hanya daftar angka tanpa penjelasan." },
      { key: "c", label: "Hanya nama orang tanpa cerita." },
    ],
    answer: "a",
    explanation: <>Unggahan sederhana bisa berisi ke mana pergi, apa yang dilakukan, bagaimana kesannya, dan apa yang ingin dilakukan selanjutnya.</>,
  },
];

const holidayWords = [
  ["休み", "やすみ · yasumi", "Hari libur"],
  ["今度", "こんど · kondo", "Lain kali / mendatang"],
  ["予定", "よてい · yotei", "Rencana"],
  ["連休", "れんきゅう · renkyuu", "Libur berurutan"],
  ["夏休み", "なつやすみ · natsuyasumi", "Libur musim panas"],
  ["旅行", "りょこう · ryokou", "Perjalanan"],
  ["どこか", "dokoka", "Suatu tempat"],
  ["ゆっくりする", "yukkuri suru", "Bersantai"],
  ["友だちに会う", "ともだちにあう", "Bertemu teman"],
  ["買い物する", "かいものする", "Berbelanja"],
];

const wishWords = [
  ["温泉に入る", "おんせんにはいる", "Masuk / berendam di pemandian air panas"],
  ["雪を見る", "ゆきをみる", "Melihat salju"],
  ["新幹線に乗る", "しんかんせんにのる", "Naik Shinkansen"],
  ["富士山に登る", "ふじさんにのぼる", "Mendaki Gunung Fuji"],
  ["京都へ行く", "きょうとへいく", "Pergi ke Kyoto"],
  ["船に乗る", "ふねにのる", "Naik kapal"],
  ["写真を撮る", "しゃしんをとる", "Mengambil foto"],
  ["お菓子を食べる", "おかしをたべる", "Makan kue / camilan"],
  ["景色を見る", "けしきをみる", "Melihat pemandangan"],
  ["家で休む", "いえでやすむ", "Beristirahat di rumah"],
];

const connectors = [
  ["あと", "selain itu / juga", "Menambahkan rencana atau keinginan lain."],
  ["それから", "setelah itu", "Mengurutkan dua kegiatan berdasarkan waktu."],
  ["それに", "ditambah lagi", "Menambahkan kesan lain yang searah."],
  ["でも", "tetapi", "Menghubungkan dua kesan yang berlawanan."],
];

const kanjiWords = [
  ["温泉", "おんせん · onsen", "Pemandian air panas"],
  ["旅行", "りょこう · ryokou", "Perjalanan"],
  ["家族", "かぞく · kazoku", "Keluarga"],
  ["友だち", "ともだち · tomodachi", "Teman"],
  ["予定", "よてい · yotei", "Rencana"],
  ["週末", "しゅうまつ · shuumatsu", "Akhir pekan"],
  ["連休", "れんきゅう · renkyuu", "Libur berurutan"],
  ["景色", "けしき · keshiki", "Pemandangan"],
];

export default function IrodoriPemulaLessonEighteenPage() {
  const progress = useIrodoriProgress();
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [planChoice, setPlanChoice] = useState("");
  const [planSubmitted, setPlanSubmitted] = useState(false);
  const [wishChoice, setWishChoice] = useState("");
  const [wishSubmitted, setWishSubmitted] = useState(false);
  const [sequenceChoice, setSequenceChoice] = useState("");
  const [sequenceSubmitted, setSequenceSubmitted] = useState(false);
  const [postChoice, setPostChoice] = useState("");
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [invitationChoice, setInvitationChoice] = useState("");
  const [invitationSubmitted, setInvitationSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const isCompleted = progress.completedLessons.includes("starter-18");
  const practiceScore = practiceTasks.filter((task, index) => practiceAnswers[index] === task.answer).length;
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;
  const score = quizQuestions.filter((question, index) => answers[index] === question.answer).length;
  const planIsCorrect = planSubmitted && planChoice === "relax";
  const wishIsCorrect = wishSubmitted && wishChoice === "hot-spring";
  const sequenceIsCorrect = sequenceSubmitted && sequenceChoice === "sorekara";
  const postIsCorrect = postSubmitted && postChoice === "post-complete";
  const invitationIsCorrect = invitationSubmitted && invitationChoice === "invite";
  const activitiesComplete = planIsCorrect && wishIsCorrect && sequenceIsCorrect && postIsCorrect && invitationIsCorrect;
  const canDosRated = canDos.every((item) => ratings[item.id] !== undefined);

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
        href="/irodori/starter"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"
      >
        <ArrowLeft size={15} /> Kembali ke Pemula
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#79602F]/45 bg-gradient-to-br from-[#302319] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D6AD4F]/[0.07]">休</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">IRODORI • PEMULA A1 • PELAJARAN 18</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya ingin pergi ke pemandian air panas.</h1>
          <p className="mt-2 text-sm font-semibold text-[#D9B66D]"><ruby>温泉<rt>おんせん</rt></ruby>に<ruby>入<rt>はい</rt></ruby>りたいです</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Belajar menceritakan rencana hari libur, menyampaikan hal yang ingin dilakukan di Jepang, menulis unggahan sederhana, serta berbagi urutan kegiatan dan kesan perjalanan.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><CalendarDays size={14} className="text-[#D6AD4F]" />Rencana liburan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Compass size={14} className="text-[#D6AD4F]" />Keinginan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><TrainFront size={14} className="text-[#D6AD4F]" />Perjalanan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Send size={14} className="text-[#D6AD4F]" />Unggahan singkat</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#B8860B]/20 bg-[#1B1917]/80 p-4 md:p-5">
        <div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#D9B66D]" /><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2></div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Tiga target pertama mengikuti target komunikasi utama pelajaran. Dua target terakhir adalah latihan penguatan Fude dari dialog perjalanan.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">{index < 3 ? "CAN-DO RESMI" : "LATIHAN PENGUATAN"} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA 01</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Rencana hari libur</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Ungkapan untuk bertanya tentang rencana dan menceritakan kegiatan yang ingin dilakukan.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {holidayWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dengarkan rencana dan cerita perjalanan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Dialog orisinal Fude. Perhatikan perbedaan keinginan, rencana, kegiatan lampau, dan kesan.</p></div>
        <div className="space-y-4">
          <IrodoriConversation title="Bertanya tentang rencana liburan" speakers={[speakers.yui, speakers.kenji]} utterances={holidayPlanConversation} />
          <IrodoriConversation title="Menyampaikan keinginan di Jepang" speakers={[speakers.sota, speakers.akiko]} utterances={japanWishConversation} />
          <IrodoriConversation title="Menceritakan perjalanan" speakers={[speakers.yui, speakers.sota]} utterances={tripConversation} />
          <IrodoriConversation title="Bercerita melalui unggahan foto" speakers={[speakers.akiko, speakers.yui]} utterances={socialPostConversation} />
          <IrodoriConversation title="Mengajak teman pergi bersama" speakers={[speakers.kenji, speakers.yui]} utterances={invitationConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KOSAKATA 02</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tempat dan kegiatan yang diinginkan</h2></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {wishWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menyampaikan keinginan dan merangkai cerita</h2></div>
        {[
          {
            title: "01 · Kata kerja bentuk ～たいです",
            pattern: "V-ます → buang ます + たいです",
            example: <><ruby>温泉<rt>おんせん</rt></ruby>に<ruby>入<rt>はい</rt></ruby>りたいです。／ <ruby>雪<rt>ゆき</rt></ruby>が<ruby>見<rt>み</rt></ruby>たいです。</>,
            note: <>Pola ～たいです digunakan untuk menyatakan keinginan sendiri. Ambil bentuk masu, lepaskan ます, lalu tambahkan たいです: <ruby>行<rt>い</rt></ruby>きます → <ruby>行<rt>い</rt></ruby>きたいです; <ruby>食<rt>た</rt></ruby>べます → <ruby>食<rt>た</rt></ruby>べたいです. Partikel を yang menandai objek sering berubah menjadi が pada pola ini, misalnya お<ruby>菓子<rt>かし</rt></ruby>が<ruby>食<rt>た</rt></ruby>べたいです.</>,
          },
          {
            title: "02 · どこか untuk tempat yang belum ditentukan",
            pattern: "どこか + V-ます / V-たいです",
            example: <>どこか<ruby>旅行<rt>りょこう</rt></ruby>したいです。／ <ruby>休<rt>やす</rt></ruby>みの日、どこか<ruby>行<rt>い</rt></ruby>きませんか？</>,
            note: <>どこか berarti somewhere atau suatu tempat yang belum ditentukan. Bedakan dengan どこ (di mana) dan どこにも yang biasanya dipakai bersama bentuk negatif, misalnya どこにも<ruby>行<rt>い</rt></ruby>きません.</>,
          },
          {
            title: "03 · Partikel へ dan に untuk arah / tujuan",
            pattern: "Place + へ / に + 行きます",
            example: <><ruby>京都<rt>きょうと</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きたいです。／ <ruby>京都<rt>きょうと</rt></ruby>に<ruby>行<rt>い</rt></ruby>きたいです。</>,
            note: "へ ditulis へ tetapi dibaca “e”. Partikel ini menunjukkan arah pada kata kerja perpindahan seperti 行きます, 来ます, dan 帰ります. Untuk contoh ini, に juga dapat menggantikan へ.",
          },
          {
            title: "04 · あと untuk menambahkan keinginan",
            pattern: "S1。あと、S2。",
            example: <><ruby>雪<rt>ゆき</rt></ruby>が<ruby>見<rt>み</rt></ruby>たいです。あと、<ruby>温泉<rt>おんせん</rt></ruby>にも<ruby>入<rt>はい</rt></ruby>りたいです。</>,
            note: "あと berarti selain itu atau juga. Gunakan untuk menambahkan satu hal lagi ke daftar keinginan. Ungkapan ini sering muncul dalam percakapan.",
          },
          {
            title: "05 · Mengurutkan kegiatan dan menyampaikan kesan",
            pattern: "S1。それから、S2。／ S1。それに、S2。／ S1。でも、S2。",
            example: <><ruby>船<rt>ふね</rt></ruby>に<ruby>乗<rt>の</rt></ruby>りました。それから、<ruby>写真<rt>しゃしん</rt></ruby>を<ruby>撮<rt>と</rt></ruby>りました。／ <ruby>景色<rt>けしき</rt></ruby>はきれいでした。でも、少し<ruby>寒<rt>さむ</rt></ruby>かったです。</>,
            note: "それから mengurutkan kejadian berdasarkan waktu (setelah itu). それに menambahkan kesan yang searah (ditambah lagi). でも menyatakan kontras (tetapi). Ketiganya membantu cerita perjalanan terasa runtut.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B8860B]">{item.title}</p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-7 text-[#D9B66D]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">UNGKAPAN PENGHUBUNG</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih penghubung yang tepat</h2></div>
        <div className="grid gap-2 sm:grid-cols-2">
          {connectors.map(([word, meaning, note]) => (
            <article key={word} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseReading allowIndexFallback translation={meaning} contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]" kanaClassName="mt-1 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-1 text-xs font-bold text-[#D9B66D]">{word}</JapaneseReading>
              <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KANJI DAN KATA PENTING</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Baca kata untuk perjalanan</h2></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]" romajiClassName="mt-1 text-sm italic text-[#D9B66D]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 01 · RENCANA LIBUR</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Jawab tentang rencana berikutnya</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Yui bertanya kepada Kenji apa yang ingin dilakukan saat libur. Kenji ingin beristirahat di rumah.</p></div>
        <div className="rounded-xl border border-[#D6AD4F]/20 bg-[#27231D] p-4">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">PERTANYAAN</p>
          <p className="mt-2 font-mincho text-lg text-[#F1EBDD]">休みは、どうしますか？</p>
          <p className="mt-1 text-[10px] text-[#A9A398]">Apa rencanamu saat libur?</p>
        </div>
        <div className="grid gap-2">
          {[
            { key: "relax", label: "うちでゆっくりしたいです。", meaning: "Saya ingin bersantai di rumah." },
            { key: "bought", label: "きのう、買い物をしました。", meaning: "Kemarin saya berbelanja." },
            { key: "where", label: "駅はどこですか？", meaning: "Stasiunnya di mana?" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={planSubmitted} aria-pressed={planChoice === item.key} onClick={() => setPlanChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (planSubmitted && item.key === "relax" ? "border-emerald-500/50 bg-emerald-500/10" : planSubmitted && planChoice === item.key ? "border-red-400/50 bg-red-400/10" : planChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <JapaneseReading allowIndexFallback translation={item.meaning} contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-4 text-[#A9A398]">{item.label}</JapaneseReading>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{planSubmitted ? planIsCorrect ? "Benar. Jawaban menyampaikan keinginan dengan ～たいです." : "Belum tepat. Pilih kalimat yang sesuai dengan rencana Kenji." : "Pilih jawaban yang sesuai."}</p>
          {planSubmitted ? <button type="button" onClick={() => { setPlanChoice(""); setPlanSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!planChoice} onClick={() => setPlanSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa jawaban</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 02 · KEINGINAN DI JEPANG</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih hal yang ingin dilakukan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Akiko ingin mencoba pengalaman khas saat berkunjung ke Jepang. Ia ingin masuk ke pemandian air panas.</p></div>
        <div className="rounded-xl border border-[#D6AD4F]/20 bg-[#27231D] p-4">
          <p className="font-mincho text-base text-[#F1EBDD]">日本で何がしたいですか？</p>
          <p className="mt-1 text-[10px] text-[#A9A398]">Apa yang ingin dilakukan di Jepang?</p>
        </div>
        <div className="grid gap-2">
          {[
            { key: "snow", label: "雪を見ました。", meaning: "Saya melihat salju (sudah terjadi)." },
            { key: "hot-spring", label: "温泉に入りたいです。", meaning: "Saya ingin masuk ke pemandian air panas." },
            { key: "home", label: "うちで休みました。", meaning: "Saya beristirahat di rumah (sudah terjadi)." },
          ].map((item) => (
            <button key={item.key} type="button" disabled={wishSubmitted} aria-pressed={wishChoice === item.key} onClick={() => setWishChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (wishSubmitted && item.key === "hot-spring" ? "border-emerald-500/50 bg-emerald-500/10" : wishSubmitted && wishChoice === item.key ? "border-red-400/50 bg-red-400/10" : wishChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <JapaneseReading allowIndexFallback translation={item.meaning} contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-4 text-[#A9A398]">{item.label}</JapaneseReading>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{wishSubmitted ? wishIsCorrect ? "Benar. 入ります berubah menjadi 入りたいです." : "Belum tepat. Pilih bentuk yang menyatakan keinginan." : "Pilih satu jawaban."}</p>
          {wishSubmitted ? <button type="button" onClick={() => { setWishChoice(""); setWishSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!wishChoice} onClick={() => setWishSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa keinginan</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 03 · URUTAN KEGIATAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Susun cerita perjalanan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Sota bercerita: ia naik kapal, lalu mengambil foto laut. Pilih penghubung yang tepat.</p></div>
        <div className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
          <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">船に乗りました。＿＿＿、海の写真を撮りました。</p>
          <p className="mt-1 text-[10px] text-[#A9A398]">Saya naik kapal. Setelah itu, saya mengambil foto laut.</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "sorekara", label: "それから", meaning: "Setelah itu" },
            { key: "soreni", label: "それに", meaning: "Ditambah lagi" },
            { key: "demo", label: "でも", meaning: "Tetapi" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={sequenceSubmitted} aria-pressed={sequenceChoice === item.key} onClick={() => setSequenceChoice(item.key)} className={"rounded-xl border p-3 text-center transition-colors " + (sequenceSubmitted && item.key === "sorekara" ? "border-emerald-500/50 bg-emerald-500/10" : sequenceSubmitted && sequenceChoice === item.key ? "border-red-400/50 bg-red-400/10" : sequenceChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <JapaneseReading allowIndexFallback translation={item.meaning} contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[9px] leading-4 text-[#A9A398]">{item.label}</JapaneseReading>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{sequenceSubmitted ? sequenceIsCorrect ? "Benar. それから menandai urutan waktu." : "Belum tepat. Pilih kata yang menunjukkan kejadian berikutnya." : "Pilih kata penghubung."}</p>
          {sequenceSubmitted ? <button type="button" onClick={() => { setSequenceChoice(""); setSequenceSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!sequenceChoice} onClick={() => setSequenceSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa penghubung</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 04 · UNGGAHAN SINGKAT</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih unggahan yang lengkap</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Yui ingin bercerita tentang hari liburnya. Unggahan yang baik menyebut tempat, kegiatan, kesan, dan keinginan berikutnya.</p></div>
        <div className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#D9B66D]">POST YUI · 日曜日</p>
          <JapaneseReading
            allowIndexFallback
            translation="Hari Minggu pergi ke taman. Makan bekal. Sangat menyenangkan. Lain kali ingin pergi ke laut."
            contentClassName="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]"
            kanaClassName="mt-2 font-mincho text-sm leading-relaxed text-[#D6AD4F]"
            romajiClassName="mt-1 text-xs italic text-[#A9A398]"
            translationClassName="mt-2 text-[10px] leading-5 text-[#A9A398]"
          >
            日曜日、公園へ行きました。お弁当を食べました。とても楽しかったです。こんどは、海へ行きたいです。
          </JapaneseReading>
        </div>
        <p className="text-xs font-semibold text-[#EAE6DD]">Apa saja informasi yang muncul dalam unggahan?</p>
        <div className="grid gap-2">
          {[
            { key: "only-place", label: "Hanya tempat yang dikunjungi.", meaning: "Informasi kegiatan dan kesan tidak disebut." },
            { key: "post-complete", label: "Tempat, kegiatan, kesan, dan rencana berikutnya.", meaning: "Keempat bagian bisa ditemukan." },
            { key: "only-wish", label: "Hanya hal yang ingin dilakukan nanti.", meaning: "Tidak menjelaskan hari libur yang sudah terjadi." },
          ].map((item) => (
            <button key={item.key} type="button" disabled={postSubmitted} aria-pressed={postChoice === item.key} onClick={() => setPostChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (postSubmitted && item.key === "post-complete" ? "border-emerald-500/50 bg-emerald-500/10" : postSubmitted && postChoice === item.key ? "border-red-400/50 bg-red-400/10" : postChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <p className="text-xs text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{postSubmitted ? postIsCorrect ? "Benar. Unggahan memuat tempat, kegiatan, kesan, dan keinginan berikutnya." : "Belum tepat. Periksa kembali isi unggahan dari awal sampai akhir." : "Pilih informasi yang ditemukan."}</p>
          {postSubmitted ? <button type="button" onClick={() => { setPostChoice(""); setPostSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!postChoice} onClick={() => setPostSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa unggahan</button>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">SIMULASI 05 · AJAKAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih tanggapan yang alami</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenji mengajak Yui pergi ke suatu tempat bersama minggu depan. Pilih tanggapan yang menerima ajakan.</p></div>
        <div className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#D9B66D]">KENJI</p>
          <p className="mt-2 font-mincho text-base leading-7 text-[#F1EBDD]">来週の休み、いっしょにどこか行きませんか？</p>
          <p className="mt-1 text-[10px] text-[#A9A398]">Libur minggu depan, mau pergi ke suatu tempat bersama?</p>
        </div>
        <div className="grid gap-2">
          {[
            { key: "invite", label: "いいですね。いっしょに行きましょう。", meaning: "Boleh juga. Ayo pergi bersama." },
            { key: "no", label: "どこにも行きません。", meaning: "Saya tidak pergi ke mana pun." },
            { key: "where", label: "駅はどこですか？", meaning: "Stasiunnya di mana?" },
          ].map((item) => (
            <button key={item.key} type="button" disabled={invitationSubmitted} aria-pressed={invitationChoice === item.key} onClick={() => setInvitationChoice(item.key)} className={"rounded-xl border p-3 text-left transition-colors " + (invitationSubmitted && item.key === "invite" ? "border-emerald-500/50 bg-emerald-500/10" : invitationSubmitted && invitationChoice === item.key ? "border-red-400/50 bg-red-400/10" : invitationChoice === item.key ? "border-[#D6AD4F]/60 bg-[#B8860B]/10" : "border-white/[0.07] bg-black/10")}>
              <JapaneseReading allowIndexFallback translation={item.meaning} contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm text-[#D6AD4F]" romajiClassName="mt-1 text-xs italic text-[#D9B66D]" translationClassName="mt-1 text-[10px] leading-4 text-[#A9A398]">{item.label}</JapaneseReading>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-[10px] text-[#A9A398]">{invitationSubmitted ? invitationIsCorrect ? "Benar. いいですね menerima ajakan, lalu いっしょに行きましょう menunjukkan persetujuan." : "Belum tepat. Pilih ungkapan yang menerima ajakan." : "Pilih tanggapan."}</p>
          {invitationSubmitted ? <button type="button" onClick={() => { setInvitationChoice(""); setInvitationSubmitted(false); }} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]"><RefreshCw size={12}/>Ulangi</button> : <button type="button" disabled={!invitationChoice} onClick={() => setInvitationSubmitted(true)} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa tanggapan</button>}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban praktik harus benar untuk membuka evaluasi akhir.</p></div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {task.options.map((option) => (
                    <button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected === option.key} onClick={() => setPracticeAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (practiceSubmitted && option.key === task.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : practiceSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>
                  ))}
                </div>
                {practiceSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span><JapaneseReading allowIndexFallback>{task.explanation}</JapaneseReading></p>}
              </article>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{practiceSubmitted ? "Hasil praktik: " + practiceScore + " dari " + practiceTasks.length + " benar." : Object.keys(practiceAnswers).length + " dari " + practiceTasks.length + " pertanyaan dijawab."}</p>
          {practiceSubmitted ? <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1]"><RefreshCw size={13}/>Ulangi praktik</button> : <button type="button" onClick={() => setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length !== practiceTasks.length} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa praktik</button>}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">KUIS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p></div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B8860B]">SOAL {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{question.prompt}</JapaneseReading></h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {question.options.map((option) => (
                    <button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected === option.key} onClick={() => setAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (quizSubmitted && option.key === question.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : quizSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#B8860B]/60 bg-[#B8860B]/10 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>
                  ))}
                </div>
                {quizSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span><JapaneseReading allowIndexFallback>{question.explanation}</JapaneseReading></p>}
              </article>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{quizSubmitted ? "Nilai latihan: " + score + " dari " + quizQuestions.length + " benar." : Object.keys(answers).length + " dari " + quizQuestions.length + " pertanyaan dijawab."}</p>
          {quizSubmitted ? <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#B8860B]/35 px-4 py-2 text-xs font-bold text-[#E7D2A1]"><RefreshCw size={13}/>Ulangi kuis</button> : <button type="button" onClick={() => setQuizSubmitted(true)} disabled={Object.keys(answers).length !== quizQuestions.length} className="rounded-lg bg-[#C93438] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa jawaban</button>}
        </div>
      </section>

      <section className="rounded-2xl border border-[#B8860B]/25 bg-gradient-to-br from-[#2B2118] to-[#191817] p-5 md:p-6">
        <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#D9B66D]"/><p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">CAN-DO CHECK</p></div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Nilai lima kemampuan setelah menyelesaikan praktik, kelima simulasi, dan kuis. Progres Irodori tersimpan terpisah dari Minna no Nihongo dan JLPT.</p>
        <div className="mt-4 space-y-3">
          {canDos.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3">
              <p className="text-xs font-semibold leading-5 text-[#EAE6DD]"><span className="mr-2 text-[#D9B66D]">0{index + 1}</span>{item.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ratingOptions.map((option) => (
                  <button key={option.value} type="button" aria-pressed={ratings[item.id] === option.value} onClick={() => { const next = { ...ratings, [item.id]: option.value }; setRatings(next); saveIrodoriSelfEvaluation("starter-18", next); }} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors " + (ratings[item.id] === option.value ? "border-[#D6AD4F]/60 bg-[#B8860B]/15 text-[#F0D99F]" : "border-white/[0.08] bg-[#24221F] text-[#A3A099]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {isCompleted ? <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/>Pelajaran selesai</span> : <button type="button" onClick={() => completeIrodoriLesson("starter-18")} disabled={!quizSubmitted || !practiceIsCorrect || !activitiesComplete || !canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#C93438] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/>Tandai pelajaran selesai</button>}
          <Link href="/irodori/starter" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
        </div>
        {(!quizSubmitted || !practiceIsCorrect || !activitiesComplete || !canDosRated) && <p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian target komunikasi.</p>}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, unggahan, dan aktivitas latihan dibuat orisinal oleh Fude. Semua nama, cerita, lokasi, dan situasi bersifat fiktif.</p>
    </main>
  );
}
