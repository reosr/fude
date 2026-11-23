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
const lessonId = "elementary1-09";

const studyExperienceConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>どこで日本語を勉強しましたか。</>,romaji:"Doko de nihongo o benkyou shimashita ka?",translation:"Di mana kamu belajar bahasa Jepang?",audioFileName:"irodori-elementary1-09-a01-l01.mp3"},
{speakerId:"sota",japanese:<>高校で勉強しました。アプリでも練習しました。</>,romaji:"Koukou de benkyou shimashita. Apuri demo renshuu shimashita.",translation:"Saya belajar di SMA. Saya juga berlatih dengan aplikasi.",audioFileName:"irodori-elementary1-09-a01-l02.mp3"},
{speakerId:"yui",japanese:<>そうですか。どれぐらい勉強しましたか。</>,romaji:"Sou desu ka. Dore gurai benkyou shimashita ka?",translation:"Begitu, ya. Berapa lama kamu belajar?",audioFileName:"irodori-elementary1-09-a01-l03.mp3"},
{speakerId:"sota",japanese:<>2年間ぐらいです。</>,romaji:"Ninenkan gurai desu.",translation:"Sekitar dua tahun.",audioFileName:"irodori-elementary1-09-a01-l04.mp3"},
{speakerId:"yui",japanese:<>長いですね。</>,romaji:"Nagai desu ne.",translation:"Cukup lama, ya.",audioFileName:"irodori-elementary1-09-a01-l05.mp3"},
];
const sharingLearningImpressionsConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>日本語の勉強はどうですか。</>,romaji:"Nihongo no benkyou wa dou desu ka?",translation:"Bagaimana belajar bahasa Jepang?",audioFileName:"irodori-elementary1-09-a02-l01.mp3"},
{speakerId:"kenji",japanese:<>おもしろいです。でも、漢字を読むのが難しいです。</>,romaji:"Omoshiroi desu. Demo, kanji o yomu no ga muzukashii desu.",translation:"Menarik. Tetapi, membaca kanji itu sulit.",audioFileName:"irodori-elementary1-09-a02-l02.mp3"},
{speakerId:"akiko",japanese:<>会話はどうですか。</>,romaji:"Kaiwa wa dou desu ka?",translation:"Bagaimana dengan percakapan?",audioFileName:"irodori-elementary1-09-a02-l03.mp3"},
{speakerId:"kenji",japanese:<>会話はまあまあです。話すのは楽しいです。</>,romaji:"Kaiwa wa maa maa desu. Hanasu no wa tanoshii desu.",translation:"Percakapan lumayan. Berbicara itu menyenangkan.",audioFileName:"irodori-elementary1-09-a02-l04.mp3"},
];
const comparingJapaneseSkillsConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>日本語の勉強はどうですか。</>,romaji:"Nihongo no benkyou wa dou desu ka?",translation:"Bagaimana belajar bahasa Jepang?",audioFileName:"irodori-elementary1-09-a03-l01.mp3"},
{speakerId:"sota",japanese:<>読むのは少し難しいです。</>,romaji:"Yomu no wa sukoshi muzukashii desu.",translation:"Membaca agak sulit.",audioFileName:"irodori-elementary1-09-a03-l02.mp3"},
{speakerId:"yui",japanese:<>会話はどうですか。</>,romaji:"Kaiwa wa dou desu ka?",translation:"Bagaimana dengan percakapan?",audioFileName:"irodori-elementary1-09-a03-l03.mp3"},
{speakerId:"sota",japanese:<>会話は得意です。でも、漢字を書くのは苦手です。</>,romaji:"Kaiwa wa tokui desu. Demo, kanji o kaku no wa nigate desu.",translation:"Saya cukup mahir bercakap-cakap. Tetapi, saya kurang mahir menulis kanji.",audioFileName:"irodori-elementary1-09-a03-l04.mp3"},
];
const askingKanjiReadingConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>すみません。この漢字の読み方がわかりません。</>,romaji:"Sumimasen. Kono kanji no yomikata ga wakarimasen.",translation:"Permisi. Saya tidak tahu cara membaca kanji ini.",audioFileName:"irodori-elementary1-09-a04-l01.mp3"},
{speakerId:"akiko",japanese:<>どの漢字ですか。</>,romaji:"Dono kanji desu ka?",translation:"Kanji yang mana?",audioFileName:"irodori-elementary1-09-a04-l02.mp3"},
{speakerId:"yui",japanese:<>この「練習」です。読み方を教えてもらえませんか。</>,romaji:"Kono 'renshuu' desu. Yomikata o oshiete moraemasen ka?",translation:"Yang ini, 「練習」. Bisakah Anda memberi tahu cara membacanya?",audioFileName:"irodori-elementary1-09-a04-l03.mp3"},
{speakerId:"akiko",japanese:<>はい。「れんしゅう」です。</>,romaji:"Hai. 'Renshuu' desu.",translation:"Tentu. Dibaca 'renshuu'.",audioFileName:"irodori-elementary1-09-a04-l04.mp3"},
];
const askingForStudyHelpConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>この文法の説明がよくわかりません。</>,romaji:"Kono bunpou no setsumei ga yoku wakarimasen.",translation:"Saya kurang memahami penjelasan tata bahasa ini.",audioFileName:"irodori-elementary1-09-a05-l01.mp3"},
{speakerId:"kenji",japanese:<>どこがわかりませんか。</>,romaji:"Doko ga wakarimasen ka?",translation:"Bagian mana yang tidak kamu pahami?",audioFileName:"irodori-elementary1-09-a05-l02.mp3"},
{speakerId:"sota",japanese:<>もう一度、簡単なことばで説明してもらえませんか。</>,romaji:"Mou ichido, kantan na kotoba de setsumei shite moraemasen ka?",translation:"Bisakah dijelaskan sekali lagi dengan kata-kata yang sederhana?",audioFileName:"irodori-elementary1-09-a05-l03.mp3"},
{speakerId:"kenji",japanese:<>もちろんです。</>,romaji:"Mochiron desu.",translation:"Tentu saja.",audioFileName:"irodori-elementary1-09-a05-l04.mp3"},
];
const canDos=[
{id:"learning-experience",text:"Menceritakan secara sederhana pengalaman belajar bahasa Jepang, misalnya tempat atau sarana yang digunakan."},
{id:"learning-impressions",text:"Memberikan kesan dan komentar tentang belajar bahasa Jepang, termasuk bagian yang mudah atau sulit."},
{id:"ask-for-help",text:"Meminta bantuan orang lain saat mengalami kesulitan dalam bahasa Jepang dengan ungkapan yang sopan."},
{id:"read-study-forum",text:"Membaca forum daring sederhana tentang belajar bahasa Jepang dan memahami metode belajar yang direkomendasikan."},
{id:"ask-how-to-read",text:"Menanyakan cara membaca, menulis, atau menggunakan kata dengan pola ～方 dan ～てもらえませんか."},
];
const outingPlans=[
{id:"app",title:"アプリで勉強する",subtitle:"Belajar menggunakan aplikasi",time:"短い時間 · Sesi singkat",before:"今日の単語を5つ選びます。",beforeMeaning:"Pilih lima kosakata untuk hari ini.",activity:"アプリで単語を練習します。",activityMeaning:"Berlatih kosakata dengan aplikasi.",after:"まちがえたことばをもう一度復習します。",afterMeaning:"Ulangi kosakata yang tadi masih keliru."},
{id:"reading",title:"短い文を読む",subtitle:"Membaca kalimat pendek",time:"毎日 · Setiap hari",before:"知らないことばに線を引きます。",beforeMeaning:"Tandai kata-kata yang belum dikenal.",activity:"辞書で意味と読み方を調べます。",activityMeaning:"Cari arti dan cara baca di kamus.",after:"新しいことばをノートに書きます。",afterMeaning:"Tulis kosakata baru di buku catatan."},
{id:"conversation",title:"会話を練習する",subtitle:"Berlatih percakapan",time:"週に数回 · Beberapa kali seminggu",before:"短い質問を二つ用意します。",beforeMeaning:"Siapkan dua pertanyaan pendek.",activity:"友だちと日本語で話します。",activityMeaning:"Berbicara dalam bahasa Jepang dengan teman.",after:"言えなかったことばを確認します。",afterMeaning:"Periksa kembali kata yang tadi belum bisa diucapkan."},
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

const practiceTasks:Task[]=[
{prompt:<>Dalam kalimat 「アプリで日本語を勉強しました」, partikel で menunjukkan …</>,options:[{key:"a",label:"Sarana atau cara belajar."},{key:"b",label:"Waktu belajar."},{key:"c",label:"Pemilik buku."}],answer:"a",explanation:<>Nで dapat menunjukkan sarana atau metode, seperti アプリで atau ネットで.</>},
{prompt:<>Pilih kalimat yang berarti “Bagian tulisan dalam bahasa Jepang sulit.”</>,options:[{key:"a",label:"日本語は文字が難しいです。"},{key:"b",label:"文字は日本語で勉強しました。"},{key:"c",label:"日本語を文字に貸しました。"}],answer:"a",explanation:<>Pola N1はN2が～ menjelaskan karakteristik bagian tertentu dari topik N1.</>},
{prompt:<>Lengkapi: 「漢字を読む ___ が難しいです。」</>,options:[{key:"a",label:"の"},{key:"b",label:"で"},{key:"c",label:"を"}],answer:"a",explanation:<>Kata kerja bentuk kamus dapat diikuti の: 読むのが難しいです.</>},
{prompt:<>Pilih kalimat yang berarti “Membaca agak sulit. Tetapi, percakapan cukup mudah.”</>,options:[{key:"a",label:"読むのは少し難しいです。でも、会話は簡単です。"},{key:"b",label:"読むのが少し難しいですから、会話です。"},{key:"c",label:"読むのを難しいです。でも会話がです。"}],answer:"a",explanation:<>は dapat menandai dua hal yang dibandingkan, sedangkan でも menghubungkan pernyataan yang kontras.</>},
{prompt:<>Pilih bentuk sopan untuk meminta seseorang menjelaskan sekali lagi.</>,options:[{key:"a",label:"もう一度説明してもらえませんか。"},{key:"b",label:"もう一度説明する方です。"},{key:"c",label:"もう一度説明でください。"}],answer:"a",explanation:<>V-てもらえませんか disambungkan pada bentuk て dan digunakan untuk meminta bantuan dengan sopan.</>},
{prompt:<>Bentuk 「読み方」 berasal dari kata kerja …</>,options:[{key:"a",label:"読みます → 読み方"},{key:"b",label:"読みます → 読ん方"},{key:"c",label:"読む → 読む方"}],answer:"a",explanation:<>V-方 dibentuk dari bentuk ます dengan menghilangkan ます, lalu menambahkan 方.</>},
];

const quizQuestions:Task[]=[
{prompt:<>Apa arti 「練習」?</>,options:[{key:"a",label:"Latihan."},{key:"b",label:"Kamus."},{key:"c",label:"Universitas."}],answer:"a",explanation:<>練習（れんしゅう）berarti latihan atau praktik.</>},
{prompt:<>Kalimat 「大学で日本語を勉強しました」 berarti …</>,options:[{key:"a",label:"Saya belajar bahasa Jepang di universitas."},{key:"b",label:"Saya meminjam universitas."},{key:"c",label:"Saya mengajar kamus."}],answer:"a",explanation:<>大学で menunjukkan tempat berlangsungnya kegiatan belajar.</>},
{prompt:<>Pilih kalimat yang menjelaskan bagian yang sulit dari bahasa Jepang.</>,options:[{key:"a",label:"日本語は発音が難しいです。"},{key:"b",label:"日本語を発音に貸します。"},{key:"c",label:"発音は日本語を勉強しました。"}],answer:"a",explanation:<>N1はN2が～ menjelaskan bagian atau karakteristik tertentu dari N1.</>},
{prompt:<>Lengkapi: 「話す ___ が楽しいです。」</>,options:[{key:"a",label:"の"},{key:"b",label:"を"},{key:"c",label:"に"}],answer:"a",explanation:<>V bentuk kamus + の dapat menjadi bagian yang dinilai dengan kata sifat.</>},
{prompt:<>Ungkapan 「でも」 pada pola perbandingan digunakan untuk …</>,options:[{key:"a",label:"Menghubungkan dua pernyataan yang berlawanan."},{key:"b",label:"Menunjukkan sarana."},{key:"c",label:"Menunjukkan kepemilikan."}],answer:"a",explanation:<>でも membantu menegaskan kontras antara dua hal.</>},
{prompt:<>Pilih permintaan yang lebih sopan.</>,options:[{key:"a",label:"この漢字の読み方を教えてもらえませんか。"},{key:"b",label:"この漢字の読み方を言います。"},{key:"c",label:"この漢字の読み方で勉強します。"}],answer:"a",explanation:<>教えてもらえませんか adalah permintaan sopan yang menggunakan bentuk て dari 教えます.</>},
{prompt:<>Bentuk て dari 「貸します」 adalah …</>,options:[{key:"a",label:"貸して"},{key:"b",label:"貸って"},{key:"c",label:"貸いて"}],answer:"a",explanation:<>貸します → 貸して. Bentuk て ini dapat digunakan sebelum もらえませんか.</>},
{prompt:<>Pilih arti 「書き方」.</>,options:[{key:"a",label:"Cara menulis."},{key:"b",label:"Cara membaca."},{key:"c",label:"Cara berbicara."}],answer:"a",explanation:<>書きます tanpa ます menjadi 書き, lalu + 方 menjadi 書き方.</>},
{prompt:<>Kosakata 「無料」 berarti …</>,options:[{key:"a",label:"Gratis."},{key:"b",label:"Sulit."},{key:"c",label:"Panjang."}],answer:"a",explanation:<>無料（むりょう）berarti gratis atau tanpa biaya.</>},
{prompt:<>Saran mana yang merupakan metode belajar yang baik untuk pemula?</>,options:[{key:"a",label:"Membaca kalimat pendek secara rutin dan mencatat kata baru."},{key:"b",label:"Menghafal semua kata sekaligus tanpa mengulang."},{key:"c",label:"Berhenti bertanya saat menemukan kata yang sulit."}],answer:"a",explanation:<>Latihan singkat dan berulang membantu membangun kebiasaan belajar serta mengingat kosakata.</>},
];

const simulations=[
{title:"01 · Menceritakan cara belajar",heading:"Memilih partikel untuk sarana",prompt:"Kamu belajar bahasa Jepang dengan aplikasi. Pilih ungkapan yang tepat untuk menjelaskan sarana yang digunakan.",japanese:<>アプリ ___ 日本語を勉強しました。</>,translation:"Saya belajar bahasa Jepang dengan aplikasi.",options:[{key:"de",label:"で",meaning:"アプリで日本語を勉強しました。— Saya belajar bahasa Jepang dengan aplikasi."},{key:"o",label:"を",meaning:"を menandai objek, bukan sarana pada kalimat ini."},{key:"ni",label:"に",meaning:"に tidak menyatakan sarana belajar pada contoh ini."}],answer:"de",explanation:"Partikel で dapat menunjukkan sarana atau metode yang digunakan untuk belajar."},
{title:"02 · Menjelaskan bagian yang sulit",heading:"Memilih pola NはNが",prompt:"Kamu ingin mengatakan bahwa huruf dalam bahasa Jepang sulit.",japanese:<>日本語は文字が難しいです。</>,translation:"Huruf dalam bahasa Jepang sulit.",options:[{key:"correct",label:"日本語は文字が難しいです。",meaning:"Bahasa Jepang, bagian hurufnya sulit."},{key:"wrong1",label:"日本語で文字を難しいです。",meaning:"Susunan partikel dan bentuk kalimatnya tidak tepat."},{key:"wrong2",label:"文字は日本語が勉強します。",meaning:"Susunan kalimat ini tidak menyampaikan maksud yang diminta."}],answer:"correct",explanation:"N1は mengangkat topik, lalu N2が menunjukkan bagian yang memiliki karakteristik tersebut."},
{title:"03 · Membandingkan dua kemampuan",heading:"Menggunakan でも",prompt:"Membaca terasa sulit, tetapi berbicara terasa menyenangkan. Pilih kalimat yang menyampaikan kontras itu.",japanese:<>読むのは難しいです。でも、話すのは楽しいです。</>,translation:"Membaca itu sulit. Tetapi, berbicara itu menyenangkan.",options:[{key:"contrast",label:"読むのは難しいです。でも、話すのは楽しいです。",meaning:"Membaca sulit, tetapi berbicara menyenangkan."},{key:"same",label:"読むのが難しいですから、話すのが難しいです。",meaning:"Membaca sulit, jadi berbicara juga sulit."},{key:"means",label:"読むので話すを勉強しました。",meaning:"Susunan ini tidak menyatakan perbandingan yang diminta."}],answer:"contrast",explanation:"でも menghubungkan dua pernyataan yang berlawanan atau kontras."},
{title:"04 · Meminta bantuan membaca kanji",heading:"Memakai V-てもらえませんか",prompt:"Kamu tidak tahu cara membaca sebuah kanji dan ingin meminta bantuan dengan sopan.",japanese:<>この漢字の読み方を教えてもらえませんか。</>,translation:"Bisakah Anda memberi tahu cara membaca kanji ini?",options:[{key:"polite",label:"この漢字の読み方を教えてもらえませんか。",meaning:"Permintaan bantuan yang sopan."},{key:"statement",label:"この漢字の読み方を教えます。",meaning:"Saya akan mengajarkan cara membaca kanji ini."},{key:"means",label:"この漢字の読み方で勉強します。",meaning:"Saya belajar dengan cara membaca kanji ini."}],answer:"polite",explanation:"Bentuk て dari 教えます adalah 教えて. Tambahkan もらえませんか untuk meminta bantuan dengan sopan."},
{title:"05 · Memahami saran di forum",heading:"Memilih metode belajar",prompt:"Sebuah forum menyarankan cara sederhana untuk memperkaya kosakata. Pilih saran yang paling sesuai.",japanese:<>短い文を毎日読んで、新しいことばをノートに書きます。</>,translation:"Membaca kalimat pendek setiap hari dan menulis kosakata baru di buku catatan.",options:[{key:"habit",label:"短い文を毎日読んで、新しいことばをノートに書きます。",meaning:"Membaca dan mencatat kosakata secara rutin."},{key:"skip",label:"わからないことばを全部そのままにします。",meaning:"Membiarkan semua kata yang tidak dipahami."},{key:"once",label:"一日に全部のことばを一度だけ覚えます。",meaning:"Mencoba menghafal semua kata sekaligus hanya sekali."}],answer:"habit",explanation:"Saran belajar yang baik dapat berupa latihan singkat, rutin, dan mengulang kosakata yang belum dipahami."},
];

const vocabulary=[
["日本語","にほんご · nihongo","Bahasa Jepang"],["高校","こうこう · koukou","SMA"],["大学","だいがく · daigaku","Universitas"],["練習","れんしゅう · renshuu","Latihan"],["漢字","かんじ · kanji","Kanji"],["無料","むりょう · muryou","Gratis"],["言う","いう · iu","Mengatakan"],["書く","かく · kaku","Menulis"],["貸す","かす · kasu","Meminjamkan"],["教える","おしえる · oshieru","Mengajari / memberi tahu"],["説明する","せつめいする · setsumei suru","Menjelaskan"],["学習","がくしゅう · gakushuu","Pembelajaran"],["読み方","よみかた · yomikata","Cara membaca"],["書き方","かきかた · kakikata","Cara menulis"],["文字","もじ · moji","Huruf / tulisan"],["会話","かいわ · kaiwa","Percakapan"],["文法","ぶんぽう · bunpou","Tata bahasa"],["発音","はつおん · hatsuon","Pelafalan"],["単語","たんご · tango","Kata / kosakata"],["意味","いみ · imi","Arti / makna"],["辞書","じしょ · jisho","Kamus"],["教科書","きょうかしょ · kyoukasho","Buku pelajaran"],["覚える","おぼえる · oboeru","Menghafal / mengingat"],["読む","よむ · yomu","Membaca"],["アプリ","アプリ · apuri","Aplikasi"]
];

const kanjiWords=[
["高校","こうこう · koukou","SMA"],["大学","だいがく · daigaku","Universitas"],["練習","れんしゅう · renshuu","Latihan"],["漢字","かんじ · kanji","Kanji"],["無料","むりょう · muryou","Gratis"],["言う","いう · iu","Mengatakan"],["書く","かく · kaku","Menulis"],["貸す","かす · kasu","Meminjamkan"],["教える","おしえる · oshieru","Mengajari / memberi tahu"],["説明する","せつめいする · setsumei suru","Menjelaskan"]
];

export default function IrodoriElementaryOneLessonNinePage() {
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
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#91B99A]/[0.08]">読</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">IRODORI • DASAR 1 A2 • PELAJARAN 09</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Maukah kamu memberi tahu cara membaca ini?</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9CDB0]">読み方を教えてもらえませんか？</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Berlatih menanyakan pengalaman dan minat, mengajak teman melakukan kegiatan, menentukan rencana berikutnya, serta menyampaikan kesan setelah acara.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9CDB0]" />Pengalaman & minat</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#A9CDB0]" />Ajakan kegiatan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#A9CDB0]" />Kesan setelah acara</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A9CDB0]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target pertama mengikuti target komunikasi resmi. Target terakhir merupakan latihan penguatan Fude.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">{index < 4 ? "CAN-DO UTAMA" : "LATIHAN PENGUATAN"} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KOSAKATA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Belajar bahasa Jepang</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata tentang pengalaman belajar, huruf, percakapan, metode latihan, dan meminta bantuan.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {vocabulary.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9CDB0]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menceritakan pengalaman dan kesan belajar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan cara menceritakan pengalaman belajar, menjelaskan bagian yang sulit, membandingkan kemampuan, dan meminta bantuan dengan sopan.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Menceritakan pengalaman belajar" speakers={[speakers.yui, speakers.sota]} utterances={studyExperienceConversation} />
          <IrodoriConversation title="Memberi kesan tentang belajar bahasa Jepang" speakers={[speakers.akiko, speakers.kenji]} utterances={sharingLearningImpressionsConversation} />
          <IrodoriConversation title="Membandingkan kemampuan bahasa" speakers={[speakers.sota, speakers.yui]} utterances={comparingJapaneseSkillsConversation} />
          <IrodoriConversation title="Meminta bantuan membaca kanji" speakers={[speakers.kenji, speakers.akiko]} utterances={askingKanjiReadingConversation} />
          <IrodoriConversation title="Meminta penjelasan tata bahasa" speakers={[speakers.yui, speakers.sota]} utterances={askingForStudyHelpConversation} />
        </div>
      </section>


      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">METODE BELAJAR</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Contoh rutinitas belajar sederhana</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pilih latihan singkat yang bisa dilakukan secara rutin, lalu ulangi kosakata yang masih sulit.</p></div>
        <div className="grid gap-3 md:grid-cols-3">
          {outingPlans.map((plan)=>(<article key={plan.id} className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="font-mincho text-base font-bold text-[#F1EBDD]">{plan.title}</p><p className="mt-1 text-[10px] text-[#A9CDB0]">{plan.subtitle}</p><p className="mt-3 inline-flex rounded-full border border-[#8EAE93]/25 bg-[#476C51]/15 px-2.5 py-1 text-[9px] font-bold text-[#CFE4D2]">{plan.time}</p><ol className="mt-4 space-y-3"><li className="rounded-lg bg-black/15 p-3"><p className="text-[8px] font-black tracking-[0.16em] text-[#8EAE93]">START · はじめに</p><p className="mt-1 font-mincho text-sm leading-6 text-[#F1EBDD]">{plan.before}</p><p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{plan.beforeMeaning}</p></li><li className="rounded-lg bg-[#263D2D]/60 p-3"><p className="text-[8px] font-black tracking-[0.16em] text-[#A9CDB0]">LATIHAN · 練習</p><p className="mt-1 font-mincho text-sm leading-6 text-[#F1EBDD]">{plan.activity}</p><p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{plan.activityMeaning}</p></li><li className="rounded-lg bg-black/15 p-3"><p className="text-[8px] font-black tracking-[0.16em] text-[#8EAE93]">REVIEW · 復習</p><p className="mt-1 font-mincho text-sm leading-6 text-[#F1EBDD]">{plan.after}</p><p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{plan.afterMeaning}</p></li></ol></article>))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">PENGALAMAN & KESAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Ceritakan perjalanan belajarmu</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jelaskan tempat atau sarana belajar, lalu sampaikan bagian yang terasa mudah dan sulit.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">EXPERIENCE · 学習経験</p><p className="mt-2 font-mincho text-base text-[#F1EBDD]">アプリで日本語を勉強しました。</p><p className="mt-1 text-xs text-[#A9A398]">Saya belajar bahasa Jepang dengan aplikasi.</p><div className="mt-3 space-y-2 rounded-lg bg-black/15 p-3"><p className="font-mincho text-sm text-[#CFE4D2]">高校で勉強しました。</p><p className="text-[10px] text-[#A9A398]">Saya belajar di SMA.</p><p className="font-mincho text-sm text-[#CFE4D2]">ネットで勉強しました。</p><p className="text-[10px] text-[#A9A398]">Saya belajar melalui internet.</p></div></article>
          <article className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">IMPRESSION · 感想</p><p className="mt-2 font-mincho text-base text-[#F1EBDD]">読むのは少し難しいです。</p><p className="mt-1 text-xs text-[#A9A398]">Membaca agak sulit.</p><div className="mt-3 space-y-2 rounded-lg bg-black/15 p-3"><p className="font-mincho text-sm text-[#CFE4D2]">でも、会話は楽しいです。</p><p className="text-[10px] text-[#A9A398]">Tetapi, percakapan menyenangkan.</p><p className="font-mincho text-sm text-[#CFE4D2]">文法はおもしろいです。</p><p className="text-[10px] text-[#A9A398]">Tata bahasa menarik.</p></div></article>
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima pola untuk belajar dan meminta bantuan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pahami fungsi setiap pola dan perhatikan perubahan bentuk kata kerja pada contoh.</p></div>
        {[
          {title:"01 · Menyatakan sarana atau metode",pattern:"N で",example:<>アプリで日本語を勉強しました。／ ネットで調べました。</>,note:"Partikel で dapat menunjukkan sarana atau metode. Contoh lain: 本で (dengan buku), ラジオで (melalui radio), dan アプリで (dengan aplikasi)."},
          {title:"02 · Menjelaskan bagian atau hal yang sulit",pattern:"N1 は N2 が ナA-です／イA-いです\nN は V-る の が ナA-です／イA-いです",example:<>日本語は文字が難しいです。／ 日本語は話すのが大変です。</>,note:"N1 は memperkenalkan topik, sedangkan N2 が menunjukkan bagian yang dijelaskan. Jika bagian itu berupa kegiatan, gunakan kata kerja bentuk kamus + の: 読むのが難しいです (membaca itu sulit)."},
          {title:"03 · Membandingkan dua hal",pattern:"N1 は ～。でも、N2 は ～。",example:<>日本語は読むのは少し難しいです。でも、会話は得意です。</>,note:"Pola ini membandingkan dua karakteristik. は menandai hal yang dibandingkan dan でも berarti tetapi. Contoh: ひらがなは好きです。でも、カタカナは苦手です。"},
          {title:"04 · Meminta bantuan dengan sopan",pattern:"V-て + もらえませんか？",example:<>この漢字の読み方を教えてもらえませんか。／ もう一度説明してもらえませんか。</>,note:"Ini merupakan permintaan yang lebih sopan. Hubungkan bentuk て kata kerja dengan もらえませんか: 教えます → 教えて, 貸します → 貸して, 説明します → 説明して."},
          {title:"05 · Menyatakan cara melakukan sesuatu",pattern:"V-ます (hapus ます) + 方（かた）",example:<>読みます → 読み方 ／ 書きます → 書き方 ／ 使います → 使い方</>,note:"方 menunjukkan cara atau metode melakukan sesuatu. Ambil bentuk ます, hilangkan ます, lalu tambahkan 方: 読みます → 読み方 (cara membaca)."},
        ].map((item)=>(<article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#8EAE93]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p><p className="mt-2 font-mincho text-base leading-7 text-[#A9CDB0]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>))}
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">PAPAN DISKUSI MINI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Baca saran belajar dari forum</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Bacalah empat unggahan orisinal berikut. Temukan metode yang disarankan dan perhatikan kosakata yang digunakan.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-[#6E9A75]/25 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">POST 01 · ことばノート</p><p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">毎日、短い文を読んでいます。知らないことばをノートに書きます。</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">Setiap hari saya membaca kalimat pendek. Saya menulis kata-kata yang belum dikenal di buku catatan.</p><p className="mt-3 text-[10px] font-semibold text-[#CFE4D2]">Saran: membaca dan mencatat kosakata baru.</p></article>
          <article className="rounded-2xl border border-[#6E9A75]/25 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">POST 02 · まいにち練習</p><p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">単語カードを使っています。前に覚えたことばも、もう一度復習します。</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">Saya menggunakan kartu kosakata. Saya juga mengulang kata-kata yang sudah dipelajari sebelumnya.</p><p className="mt-3 text-[10px] font-semibold text-[#CFE4D2]">Saran: mengulang kosakata secara berkala.</p></article>
          <article className="rounded-2xl border border-[#6E9A75]/25 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">POST 03 · 会話クラブ</p><p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">友だちと短い会話を練習します。わからないときは、ゆっくり言ってもらいます。</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">Saya berlatih percakapan pendek dengan teman. Saat tidak mengerti, saya meminta lawan bicara mengucapkannya perlahan.</p><p className="mt-3 text-[10px] font-semibold text-[#CFE4D2]">Saran: berlatih percakapan dan meminta pengulangan.</p></article>
          <article className="rounded-2xl border border-[#6E9A75]/25 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">POST 04 · 漢字メモ</p><p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">漢字の読み方がわからないとき、辞書で調べます。意味もいっしょに書きます。</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">Saat tidak tahu cara membaca kanji, saya mencarinya di kamus. Saya juga menulis artinya.</p><p className="mt-3 text-[10px] font-semibold text-[#CFE4D2]">Saran: mencari cara baca dan arti kanji di kamus.</p></article>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KANJI DAN KATA PENTING</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali tulisan tentang pengalaman dan kegiatan</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9CDB0]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">SIMULASI INTERAKTIF</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Meminta bantuan dan memilih strategi belajar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi tentang sarana belajar, kesan, perbandingan, permintaan bantuan, dan saran di forum. Setiap situasi harus dijawab benar.</p>
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
                <p className="mt-1 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p>
              </div>
              <div className="rounded-xl border border-[#6E9A75]/20 bg-[#202720] p-4">
                <p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{task.japanese}</JapaneseReading></p>
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
                    <p className="font-mincho text-sm text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></p>
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
                              ? "border-[#8EAE93]/60 bg-[#476C51]/15 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {practiceSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
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
                              ? "border-[#8EAE93]/60 bg-[#476C51]/15 text-[#F1EBDD]"
                              : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                      )}
                    >
                      <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
                    </button>
                  ))}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
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
                    <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
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
        Dialog, tokoh, forum mini, dan situasi latihan dibuat orisinal oleh Fude untuk melatih percakapan tentang pengalaman belajar, kesan, dan permintaan bantuan.
      </p>
    </main>
  );
}
