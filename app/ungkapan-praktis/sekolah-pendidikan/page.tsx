"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Lightbulb,
  MessagesSquare,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import JapaneseReading from "@/components/JapaneseReading";

type Phrase = {
  jp: string;
  romaji: string;
  id: string;
  note?: string;
  tone?: string;
};

function PhraseCard({ phrase }: { phrase: Phrase }) {
  return (
    <div className="rounded-xl border border-[#33312E] bg-[#191817]/90 p-3 sm:p-4">
      {phrase.tone && (
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#B8860B]">
          {phrase.tone}
        </p>
      )}
      <JapaneseReading
        html={phrase.jp}
        romaji={phrase.romaji}
        translation={phrase.id}
        contentClassName="font-mincho text-lg leading-[2.1] text-[#EAE6DD] sm:text-xl"
        kanaClassName="mt-1 font-mincho text-sm text-[#D9B66D]"
        romajiClassName="mt-1 text-xs italic text-[#A3A099]"
        translationClassName="mt-2 text-sm leading-relaxed text-[#C5C0B7]"
      />
      {phrase.note && (
        <p className="mt-3 border-t border-[#33312E] pt-2 text-xs leading-relaxed text-[#A3A099]">
          {phrase.note}
        </p>
      )}
    </div>
  );
}

type DialogueLine = Phrase & { speaker: string };

function Dialogue({ title, context, lines }: { title: string; context: string; lines: DialogueLine[] }) {
  return (
    <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="font-bold text-[#EAE6DD]">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-[#A3A099]">{context}</p>
      </div>
      <div className="space-y-3">
        {lines.map((line, index) => (
          <div key={title + "-" + index} className="grid grid-cols-[74px_minmax(0,1fr)] gap-2 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-3">
            <span className="pt-1 text-[10px] font-bold text-[#D9B66D] sm:text-xs">{line.speaker}</span>
            <div className="min-w-0 rounded-xl border border-[#33312E]/80 bg-[#121110]/70 p-3">
              <JapaneseReading
                html={line.jp}
                romaji={line.romaji}
                translation={line.id}
                contentClassName="font-mincho text-base leading-[2] text-[#EAE6DD] sm:text-lg"
                kanaClassName="mt-1 font-mincho text-xs text-[#D9B66D]"
                romajiClassName="mt-1 text-[11px] italic text-[#A3A099]"
                translationClassName="mt-2 text-xs leading-relaxed text-[#A3A099]"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const phrases: { title: string; description: string; items: Phrase[] }[] = [
  {
    title: "A. Bertanya dan memahami pelajaran",
    description: "Gunakan ungkapan ini ketika ingin bertanya, meminta penjelasan, atau memastikan bahwa kamu memahami materi.",
    items: [
      { jp: "<ruby>質問<rt>しつもん</rt></ruby>してもいいですか。", romaji: "Shitsumon shite mo ii desu ka.", id: "Bolehkah saya bertanya?", tone: "Meminta izin bertanya" },
      { jp: "これはどういう<ruby>意味<rt>いみ</rt></ruby>ですか。", romaji: "Kore wa dou iu imi desu ka.", id: "Apa arti dari ini?", tone: "Menanyakan arti" },
      { jp: "ここがよくわかりません。", romaji: "Koko ga yoku wakarimasen.", id: "Saya belum begitu memahami bagian ini.", tone: "Menyampaikan kesulitan" },
      { jp: "もう<ruby>一度<rt>いちど</rt></ruby><ruby>説明<rt>せつめい</rt></ruby>していただけますか。", romaji: "Mou ichido setsumei shite itadakemasu ka.", id: "Bisakah Anda menjelaskannya sekali lagi?", tone: "Meminta penjelasan ulang" },
      { jp: "もう<ruby>少<rt>すこ</rt></ruby>しゆっくり<ruby>話<rt>はな</rt></ruby>してください。", romaji: "Mou sukoshi yukkuri hanashite kudasai.", id: "Tolong bicara sedikit lebih pelan.", tone: "Meminta penjelasan lebih pelan" },
      { jp: "<ruby>授業<rt>じゅぎょう</rt></ruby>は<ruby>何時<rt>なんじ</rt></ruby>に<ruby>始<rt>はじ</rt></ruby>まりますか。", romaji: "Jugyou wa nanji ni hajimarimasu ka.", id: "Pelajaran dimulai pukul berapa?", tone: "Menanyakan jadwal kelas" },
    ],
  },
  {
    title: "B. Meminta izin dan keperluan di kelas",
    description: "Ungkapan untuk meminta izin kepada guru dan menyampaikan hal yang berkaitan dengan perlengkapan belajar.",
    items: [
      { jp: "トイレに<ruby>行<rt>い</rt></ruby>ってもいいですか。", romaji: "Toire ni itte mo ii desu ka.", id: "Bolehkah saya pergi ke toilet?", tone: "Meminta izin" },
      { jp: "<ruby>窓<rt>まど</rt></ruby>を<ruby>開<rt>あ</rt></ruby>けてもいいですか。", romaji: "Mado o akete mo ii desu ka.", id: "Bolehkah saya membuka jendela?", tone: "Meminta izin" },
      { jp: "すみません、<ruby>教科書<rt>きょうかしょ</rt></ruby>を<ruby>忘<rt>わす</rt></ruby>れました。", romaji: "Sumimasen, kyoukasho o wasuremashita.", id: "Maaf, saya lupa membawa buku pelajaran.", tone: "Menjelaskan perlengkapan tertinggal" },
      { jp: "<ruby>宿題<rt>しゅくだい</rt></ruby>を<ruby>忘<rt>わす</rt></ruby>れてしまいました。", romaji: "Shukudai o wasurete shimaimashita.", id: "Saya lupa mengerjakan atau membawa PR.", tone: "Mengakui kelalaian", note: "Konteksnya menentukan apakah maksudnya lupa mengerjakan atau lupa membawa tugas." },
      { jp: "ノートを<ruby>見<rt>み</rt></ruby>せてもらえますか。", romaji: "Nooto o misete moraemasu ka.", id: "Bolehkah saya melihat catatanmu?", tone: "Meminta bantuan teman" },
    ],
  },
  {
    title: "C. Tugas, laporan, dan ujian",
    description: "Pahami ungkapan untuk menanyakan tenggat, menyerahkan tugas, dan meminta tambahan waktu dengan sopan.",
    items: [
      { jp: "<ruby>宿題<rt>しゅくだい</rt></ruby>はいつまでに<ruby>出<rt>だ</rt></ruby>せばいいですか。", romaji: "Shukudai wa itsu made ni daseba ii desu ka.", id: "PR harus dikumpulkan paling lambat kapan?", tone: "Menanyakan tenggat" },
      { jp: "レポートの<ruby>締<rt>し</rt></ruby>め<ruby>切<rt>き</rt></ruby>りはいつですか。", romaji: "Repooto no shimekiri wa itsu desu ka.", id: "Kapan batas pengumpulan laporan?", tone: "Menanyakan deadline laporan" },
      { jp: "ここに<ruby>名前<rt>なまえ</rt></ruby>を<ruby>書<rt>か</rt></ruby>いてください。", romaji: "Koko ni namae o kaite kudasai.", id: "Tolong tulis nama di sini.", tone: "Instruksi guru" },
      { jp: "レポートを<ruby>提出<rt>ていしゅつ</rt></ruby>しました。", romaji: "Repooto o teishutsu shimashita.", id: "Saya sudah mengumpulkan laporan.", tone: "Mengonfirmasi pengumpulan" },
      { jp: "もう<ruby>少<rt>すこ</rt></ruby>し<ruby>時間<rt>じかん</rt></ruby>をいただけますか。", romaji: "Mou sukoshi jikan o itadakemasu ka.", id: "Bisakah saya diberi sedikit tambahan waktu?", tone: "Meminta perpanjangan waktu" },
      { jp: "テストは<ruby>何時<rt>なんじ</rt></ruby>からですか。", romaji: "Tesuto wa nanji kara desu ka.", id: "Ujian dimulai pukul berapa?", tone: "Menanyakan jadwal ujian" },
    ],
  },
  {
    title: "D. Belajar dan bekerja dalam kelompok",
    description: "Ungkapan untuk mengajak teman belajar, membagi tugas, dan mempersiapkan presentasi.",
    items: [
      { jp: "<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>勉強<rt>べんきょう</rt></ruby>しませんか。", romaji: "Issho ni benkyou shimasen ka.", id: "Mau belajar bersama?", tone: "Mengajak teman" },
      { jp: "この<ruby>問題<rt>もんだい</rt></ruby>を<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>考<rt>かんが</rt></ruby>えましょう。", romaji: "Kono mondai o issho ni kangaemashou.", id: "Mari kita bahas soal ini bersama.", tone: "Mengajak berdiskusi" },
      { jp: "<ruby>私<rt>わたし</rt></ruby>は<ruby>資料<rt>しりょう</rt></ruby>を<ruby>作<rt>つく</rt></ruby>ります。", romaji: "Watashi wa shiryou o tsukurimasu.", id: "Saya akan membuat bahan presentasi.", tone: "Membagi tugas" },
      { jp: "<ruby>発表<rt>はっぴょう</rt></ruby>の<ruby>練習<rt>れんしゅう</rt></ruby>をしましょう。", romaji: "Happyou no renshuu o shimashou.", id: "Mari berlatih presentasi.", tone: "Persiapan kelompok" },
      { jp: "<ruby>私<rt>わたし</rt></ruby>の<ruby>担当<rt>たんとう</rt></ruby>はこの<ruby>部分<rt>ぶぶん</rt></ruby>です。", romaji: "Watashi no tantou wa kono bubun desu.", id: "Bagian yang menjadi tanggung jawab saya adalah bagian ini.", tone: "Menjelaskan pembagian tugas" },
    ],
  },
];

const dialogues: { title: string; context: string; lines: DialogueLine[] }[] = [
  {
    title: "Percakapan 1 · Meminta penjelasan kepada guru",
    context: "Kamu belum memahami salah satu bagian pelajaran dan ingin meminta penjelasan ulang.",
    lines: [
      { speaker: "学生", jp: "先生、<ruby>質問<rt>しつもん</rt></ruby>してもいいですか。", romaji: "Sensei, shitsumon shite mo ii desu ka.", id: "Pak/Bu Guru, bolehkah saya bertanya?" },
      { speaker: "先生", jp: "はい、どうぞ。", romaji: "Hai, douzo.", id: "Ya, silakan." },
      { speaker: "学生", jp: "この<ruby>部分<rt>ぶぶん</rt></ruby>がよくわかりません。もう<ruby>一度<rt>いちど</rt></ruby><ruby>説明<rt>せつめい</rt></ruby>していただけますか。", romaji: "Kono bubun ga yoku wakarimasen. Mou ichido setsumei shite itadakemasu ka.", id: "Saya belum memahami bagian ini. Bisakah dijelaskan sekali lagi?" },
      { speaker: "先生", jp: "もちろんです。ゆっくり<ruby>説明<rt>せつめい</rt></ruby>しますね。", romaji: "Mochiron desu. Yukkuri setsumei shimasu ne.", id: "Tentu. Saya akan menjelaskannya pelan-pelan." },
      { speaker: "学生", jp: "ありがとうございます。", romaji: "Arigatou gozaimasu.", id: "Terima kasih." },
    ],
  },
  {
    title: "Percakapan 2 · Menanyakan batas pengumpulan tugas",
    context: "Kamu sedang mengerjakan laporan dan ingin memastikan kapan tugas harus dikumpulkan.",
    lines: [
      { speaker: "学生", jp: "先生、レポートの<ruby>締<rt>し</rt></ruby>め<ruby>切<rt>き</rt></ruby>りはいつですか。", romaji: "Sensei, repooto no shimekiri wa itsu desu ka.", id: "Pak/Bu Guru, kapan batas pengumpulan laporan?" },
      { speaker: "先生", jp: "<ruby>金曜日<rt>きんようび</rt></ruby>までに<ruby>提出<rt>ていしゅつ</rt></ruby>してください。", romaji: "Kinyoubi made ni teishutsu shite kudasai.", id: "Silakan kumpulkan paling lambat hari Jumat." },
      { speaker: "学生", jp: "わかりました。もし<ruby>間<rt>ま</rt></ruby>に<ruby>合<rt>あ</rt></ruby>わない<ruby>場合<rt>ばあい</rt></ruby>は、どうすればいいですか。", romaji: "Wakarimashita. Moshi maniawanai baai wa, dou sureba ii desu ka.", id: "Baik. Jika saya tidak sempat menyelesaikannya tepat waktu, apa yang sebaiknya saya lakukan?" },
      { speaker: "先生", jp: "<ruby>早<rt>はや</rt></ruby>めに<ruby>相談<rt>そうだん</rt></ruby>してください。", romaji: "Hayame ni soudan shite kudasai.", id: "Silakan bicarakan dengan saya lebih awal." },
      { speaker: "学生", jp: "はい、ありがとうございます。", romaji: "Hai, arigatou gozaimasu.", id: "Baik, terima kasih." },
    ],
  },
  {
    title: "Percakapan 3 · Mempersiapkan presentasi kelompok",
    context: "Kamu dan teman sekelompok sedang membagi tugas untuk presentasi.",
    lines: [
      { speaker: "ミカ", jp: "<ruby>発表<rt>はっぴょう</rt></ruby>の<ruby>準備<rt>じゅんび</rt></ruby>を<ruby>始<rt>はじ</rt></ruby>めましょう。", romaji: "Happyou no junbi o hajimemashou.", id: "Mari kita mulai persiapan presentasi." },
      { speaker: "ケン", jp: "いいですね。<ruby>誰<rt>だれ</rt></ruby>が<ruby>資料<rt>しりょう</rt></ruby>を<ruby>作<rt>つく</rt></ruby>りますか。", romaji: "Ii desu ne. Dare ga shiryou o tsukurimasu ka.", id: "Ide bagus. Siapa yang akan membuat bahan presentasi?" },
      { speaker: "ミカ", jp: "<ruby>私<rt>わたし</rt></ruby>が<ruby>資料<rt>しりょう</rt></ruby>を<ruby>作<rt>つく</rt></ruby>ります。", romaji: "Watashi ga shiryou o tsukurimasu.", id: "Saya yang akan membuat bahan presentasi." },
      { speaker: "ケン", jp: "では、<ruby>私<rt>わたし</rt></ruby>は<ruby>発表<rt>はっぴょう</rt></ruby>の<ruby>練習<rt>れんしゅう</rt></ruby>をします。", romaji: "Dewa, watashi wa happyou no renshuu o shimasu.", id: "Kalau begitu, saya akan berlatih presentasi." },
      { speaker: "ミカ", jp: "<ruby>最後<rt>さいご</rt></ruby>に<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>確認<rt>かくにん</rt></ruby>しましょう。", romaji: "Saigo ni issho ni kakunin shimashou.", id: "Terakhir, mari kita periksa bersama." },
    ],
  },
];

const vocabulary = [
  { word: "<ruby>授業<rt>じゅぎょう</rt></ruby>", reading: "じゅぎょう", romaji: "jugyou", meaning: "Pelajaran / kelas" },
  { word: "<ruby>教科書<rt>きょうかしょ</rt></ruby>", reading: "きょうかしょ", romaji: "kyoukasho", meaning: "Buku pelajaran" },
  { word: "<ruby>宿題<rt>しゅくだい</rt></ruby>", reading: "しゅくだい", romaji: "shukudai", meaning: "Pekerjaan rumah / PR" },
  { word: "<ruby>提出<rt>ていしゅつ</rt></ruby>", reading: "ていしゅつ", romaji: "teishutsu", meaning: "Pengumpulan / menyerahkan" },
  { word: "<ruby>締<rt>し</rt></ruby>め<ruby>切<rt>き</rt></ruby>り", reading: "しめきり", romaji: "shimekiri", meaning: "Batas waktu / tenggat" },
  { word: "<ruby>発表<rt>はっぴょう</rt></ruby>", reading: "はっぴょう", romaji: "happyou", meaning: "Presentasi" },
  { word: "<ruby>質問<rt>しつもん</rt></ruby>", reading: "しつもん", romaji: "shitsumon", meaning: "Pertanyaan" },
  { word: "<ruby>出席<rt>しゅっせき</rt></ruby>", reading: "しゅっせき", romaji: "shusseki", meaning: "Kehadiran" },
];

const quiz = [
  {
    question: "Kamu belum memahami penjelasan guru dan ingin meminta penjelasan sekali lagi. Apa yang sebaiknya kamu katakan?",
    options: [
      { label: "もう<ruby>一度<rt>いちど</rt></ruby><ruby>説明<rt>せつめい</rt></ruby>していただけますか。", correct: true, feedback: "Benar. Ungkapan ini meminta guru menjelaskan sekali lagi dengan sopan." },
      { label: "<ruby>宿題<rt>しゅくだい</rt></ruby>を<ruby>提出<rt>ていしゅつ</rt></ruby>しました。", correct: false, feedback: "Kalimat ini berarti kamu sudah mengumpulkan PR." },
      { label: "<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>勉強<rt>べんきょう</rt></ruby>しませんか。", correct: false, feedback: "Kalimat ini digunakan untuk mengajak seseorang belajar bersama." },
    ],
  },
  {
    question: "Kamu ingin memastikan kapan laporan harus dikumpulkan. Pertanyaan mana yang tepat?",
    options: [
      { label: "テストは<ruby>何時<rt>なんじ</rt></ruby>からですか。", correct: false, feedback: "Kalimat ini menanyakan waktu mulai ujian." },
      { label: "レポートの<ruby>締<rt>し</rt></ruby>め<ruby>切<rt>き</rt></ruby>りはいつですか。", correct: true, feedback: "Tepat. 締め切り berarti tenggat atau batas waktu." },
      { label: "ここに<ruby>名前<rt>なまえ</rt></ruby>を<ruby>書<rt>か</rt></ruby>いてください。", correct: false, feedback: "Kalimat ini merupakan instruksi untuk menulis nama." },
    ],
  },
  {
    question: "Kamu ingin mengajak teman belajar bersama setelah kelas. Apa yang kamu katakan?",
    options: [
      { label: "<ruby>質問<rt>しつもん</rt></ruby>してもいいですか。", correct: false, feedback: "Kalimat ini digunakan untuk meminta izin bertanya kepada guru atau orang lain." },
      { label: "<ruby>教科書<rt>きょうかしょ</rt></ruby>を<ruby>忘<rt>わす</rt></ruby>れました。", correct: false, feedback: "Kalimat ini berarti lupa membawa buku pelajaran." },
      { label: "<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>勉強<rt>べんきょう</rt></ruby>しませんか。", correct: true, feedback: "Benar. Bentuk しませんか merupakan cara yang wajar untuk mengajak teman." },
    ],
  },
];

const simulation = [
  {
    prompt: "Kamu sedang mengikuti pelajaran, tetapi ada bagian yang belum dipahami. Guru bertanya:",
    japanese: "<ruby>何<rt>なに</rt></ruby>か<ruby>質問<rt>しつもん</rt></ruby>がありますか。",
    romaji: "Nanika shitsumon ga arimasu ka.",
    translation: "Apakah ada pertanyaan?",
    task: "Minta guru menjelaskan sekali lagi.",
    options: [
      { label: "もう<ruby>一度<rt>いちど</rt></ruby><ruby>説明<rt>せつめい</rt></ruby>していただけますか。", correct: true, feedback: "Tepat. Kamu meminta penjelasan ulang dengan sopan." },
      { label: "<ruby>宿題<rt>しゅくだい</rt></ruby>を<ruby>提出<rt>ていしゅつ</rt></ruby>しました。", correct: false, feedback: "Kalimat ini menyampaikan bahwa kamu sudah mengumpulkan PR." },
      { label: "<ruby>私<rt>わたし</rt></ruby>は<ruby>資料<rt>しりょう</rt></ruby>を<ruby>作<rt>つく</rt></ruby>ります。", correct: false, feedback: "Kalimat ini menyatakan bahwa kamu akan membuat bahan presentasi." },
    ],
  },
  {
    prompt: "Kamu sedang mengerjakan laporan. Guru memberitahu:",
    japanese: "<ruby>金曜日<rt>きんようび</rt></ruby>までに<ruby>提出<rt>ていしゅつ</rt></ruby>してください。",
    romaji: "Kinyoubi made ni teishutsu shite kudasai.",
    translation: "Silakan kumpulkan paling lambat hari Jumat.",
    task: "Tanyakan kapan batas pengumpulan laporan.",
    options: [
      { label: "<ruby>授業<rt>じゅぎょう</rt></ruby>は<ruby>何時<rt>なんじ</rt></ruby>に<ruby>始<rt>はじ</rt></ruby>まりますか。", correct: false, feedback: "Kalimat ini menanyakan pukul berapa pelajaran dimulai." },
      { label: "レポートの<ruby>締<rt>し</rt></ruby>め<ruby>切<rt>き</rt></ruby>りはいつですか。", correct: true, feedback: "Benar. Kamu menanyakan tenggat pengumpulan laporan." },
      { label: "トイレに<ruby>行<rt>い</rt></ruby>ってもいいですか。", correct: false, feedback: "Kalimat ini meminta izin pergi ke toilet." },
    ],
  },
  {
    prompt: "Kamu dan teman sedang menyusun tugas kelompok. Teman bertanya:",
    japanese: "<ruby>何<rt>なに</rt></ruby>を<ruby>担当<rt>たんとう</rt></ruby>しますか。",
    romaji: "Nani o tantou shimasu ka.",
    translation: "Kamu akan bertanggung jawab atas bagian apa?",
    task: "Jawab bahwa kamu akan membuat bahan presentasi.",
    options: [
      { label: "<ruby>私<rt>わたし</rt></ruby>は<ruby>資料<rt>しりょう</rt></ruby>を<ruby>作<rt>つく</rt></ruby>ります。", correct: true, feedback: "Tepat. Kamu menyampaikan bagian yang akan kamu kerjakan." },
      { label: "<ruby>質問<rt>しつもん</rt></ruby>してもいいですか。", correct: false, feedback: "Kalimat ini digunakan untuk meminta izin bertanya." },
      { label: "もう<ruby>少<rt>すこ</rt></ruby>しゆっくり<ruby>話<rt>はな</rt></ruby>してください。", correct: false, feedback: "Kalimat ini meminta seseorang berbicara lebih pelan." },
    ],
  },
];

export default function SekolahPendidikanPage() {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationAnswer, setSimulationAnswer] = useState<number | null>(null);

  const answerQuiz = (questionIndex: number, optionIndex: number) => {
    setQuizAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
  };

  const resetSimulation = () => {
    setSimulationStep(0);
    setSimulationAnswer(null);
  };

  const currentSimulation = simulation[simulationStep];

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-12">
      <Link href="/ungkapan-praktis" className="inline-flex items-center gap-2 text-xs font-semibold text-[#A3A099] transition-colors hover:text-[#EAE6DD]">
        <ArrowLeft size={15} /> Kembali ke kategori
      </Link>

      <header className="border-b border-[#33312E] pb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">KATEGORI 07 · MATERI 1</p>
        <h1 className="mt-2 text-2xl font-bold text-[#EAE6DD] sm:text-3xl">Sekolah dan Pendidikan</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A3A099]">
          Pelajari cara bertanya kepada guru, meminta izin di kelas, membicarakan tugas,
          dan bekerja sama dengan teman dalam kegiatan belajar.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold">
          <span className="rounded-full border border-[#269B70]/30 bg-[#269B70]/10 px-3 py-1 text-[#66C49C]">Dasar · A1–A2</span>
          <span className="rounded-full border border-[#33312E] bg-[#1E1D1B] px-3 py-1 text-[#A3A099]">3 dialog</span>
          <span className="rounded-full border border-[#33312E] bg-[#1E1D1B] px-3 py-1 text-[#A3A099]">8 kosakata inti</span>
        </div>
      </header>

      <section className="rounded-2xl border border-[#B8860B]/25 bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-[#D9B66D]">
          <Sparkles size={17} />
          <h2 className="text-sm font-bold">Target belajar</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[#C5C0B7]">
          Setelah materi ini, kamu diharapkan bisa meminta penjelasan, menyampaikan kebutuhan di kelas,
          memahami tenggat tugas, dan membagi tanggung jawab dalam kerja kelompok.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Ungkapan penting</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Perhatikan ungkapan untuk berbicara dengan guru dan teman sekelas.</p>
        </div>
        {phrases.map((group) => (
          <div key={group.title} className="space-y-3">
            <div>
              <h3 className="font-bold text-[#D9B66D]">{group.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#A3A099]">{group.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.items.map((phrase, index) => (
                <PhraseCard key={group.title + "-" + index} phrase={phrase} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Contoh percakapan</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Dialog orisinal Fude tentang pelajaran, tugas, dan kerja kelompok.</p>
        </div>
        {dialogues.map((dialogue) => (
          <Dialogue key={dialogue.title} {...dialogue} />
        ))}
      </section>

      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Etika komunikasi di lingkungan belajar</h2>
        </div>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[#C5C0B7]">
          <li><span className="font-semibold text-[#EAE6DD]">Sapa guru dengan 先生.</span> Saat bertanya langsung kepada guru, memanggilnya 先生 (sensei) merupakan bentuk sapaan yang lazim. Dalam situasi formal, gunakan ungkapan sopan seperti いただけますか.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Akui jika belum memahami materi.</span> Kalimat ここがよくわかりません lebih jelas daripada hanya mengatakan わかりません. Kamu bisa menunjuk bagian yang ingin dijelaskan.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Perhatikan tenggat tugas.</span> Gunakan 締め切り untuk menyebut batas waktu. Jika mengalami kesulitan, sampaikan lebih awal dan tanyakan kemungkinan solusinya.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Bagi tugas dengan jelas.</span> Dalam kerja kelompok, jelaskan siapa yang mengerjakan tiap bagian dan sisakan waktu untuk memeriksa hasil bersama.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Sesuaikan bahasa dengan lawan bicara.</span> Bentuk sopan cocok untuk guru dan staf sekolah. Dengan teman akrab, bentuk yang lebih santai dapat digunakan sesuai hubungan.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Kosakata inti</h2>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {vocabulary.map((item) => (
            <div key={item.word} className="flex items-center justify-between gap-3 rounded-xl border border-[#33312E] bg-[#121110]/60 p-3">
              <div className="min-w-0">
                <p className="font-mincho text-lg text-[#EAE6DD]" dangerouslySetInnerHTML={{ __html: item.word }} />
                <p className="mt-0.5 text-[10px] text-[#A3A099]">{item.reading} · {item.romaji}</p>
              </div>
              <p className="text-right text-xs text-[#C5C0B7]">{item.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Latihan memilih ungkapan</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Pilih jawaban yang paling sesuai dengan situasi. Pembahasan muncul setelah kamu memilih.</p>
        </div>
        {quiz.map((item, questionIndex) => {
          const selected = quizAnswers[questionIndex];
          return (
            <div key={questionIndex} className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
              <p className="text-sm font-semibold leading-relaxed text-[#EAE6DD]">{questionIndex + 1}. {item.question}</p>
              <div className="mt-3 grid gap-2">
                {item.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  const showResult = selected !== undefined;
                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      onClick={() => answerQuiz(questionIndex, optionIndex)}
                      className={"rounded-xl border px-3 py-3 text-left text-sm transition-colors " + (
                        showResult && isSelected
                          ? option.correct ? "border-[#269B70]/70 bg-[#269B70]/10 text-[#8ED8B4]" : "border-[#C93438]/70 bg-[#C93438]/10 text-[#F08B8E]"
                          : "border-[#33312E] bg-[#121110]/60 text-[#EAE6DD] hover:border-[#B8860B]/60"
                      )}
                    >
                      <JapaneseReading
                        html={option.label}
                        showKana={false}
                        showRomaji={false}
                        showTranslation={false}
                        contentClassName="font-mincho text-base leading-relaxed text-inherit"
                      />
                    </button>
                  );
                })}
              </div>
              {selected !== undefined && (
                <p className={"mt-3 text-xs leading-relaxed " + (item.options[selected].correct ? "text-[#8ED8B4]" : "text-[#F08B8E]")}>
                  {item.options[selected].feedback}
                </p>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => setQuizAnswers({})}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-[#33312E] px-4 py-2 text-xs font-bold text-[#A3A099] transition-colors hover:border-[#B8860B]/50 hover:text-[#EAE6DD]"
        >
          <RotateCcw size={14} /> Ulangi latihan
        </button>
      </section>

      <section className="rounded-2xl border border-[#B8860B]/30 bg-gradient-to-br from-[#241F16] to-[#1A1918] p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <MessagesSquare size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Simulasi percakapan</h2>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-[#A3A099]">
          Hadapi tiga situasi di sekolah. Pilih respons yang tepat agar komunikasi dengan guru dan teman berjalan lancar.
        </p>

        <div className="mt-4 rounded-xl border border-[#49402E] bg-[#121110]/70 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B]">LANGKAH {simulationStep + 1} DARI {simulation.length}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#EAE6DD]">{currentSimulation.prompt}</p>
          <div className="mt-3 rounded-lg border border-[#33312E] bg-[#1E1D1B] p-3">
            <JapaneseReading
              html={currentSimulation.japanese}
              romaji={currentSimulation.romaji}
              translation={currentSimulation.translation}
              contentClassName="font-mincho text-base leading-[2] text-[#EAE6DD]"
              kanaClassName="mt-1 font-mincho text-xs text-[#D9B66D]"
              romajiClassName="mt-1 text-[11px] italic text-[#A3A099]"
              translationClassName="mt-2 text-xs text-[#A3A099]"
            />
          </div>
          <p className="mt-3 text-xs font-semibold text-[#D9B66D]">{currentSimulation.task}</p>
          <div className="mt-3 grid gap-2">
            {currentSimulation.options.map((option, index) => (
              <button
                key={index}
                type="button"
                disabled={simulationAnswer !== null}
                onClick={() => setSimulationAnswer(index)}
                className={"rounded-xl border px-3 py-3 text-left text-sm transition-colors " + (
                  simulationAnswer === index
                    ? option.correct
                      ? "border-[#269B70]/70 bg-[#269B70]/10 text-[#8ED8B4]"
                      : "border-[#C93438]/70 bg-[#C93438]/10 text-[#F08B8E]"
                    : "border-[#33312E] bg-[#1E1D1B] text-[#EAE6DD] hover:border-[#B8860B]/60 disabled:opacity-60"
                )}
              >
                <JapaneseReading
                  html={option.label}
                  showKana={false}
                  showRomaji={false}
                  showTranslation={false}
                  contentClassName="font-mincho text-base leading-relaxed text-inherit"
                />
              </button>
            ))}
          </div>
          {simulationAnswer !== null && (
            <div className="mt-3 rounded-lg bg-[#1E1D1B] p-3">
              <p className={"text-xs leading-relaxed " + (currentSimulation.options[simulationAnswer].correct ? "text-[#8ED8B4]" : "text-[#F08B8E]")}>
                {currentSimulation.options[simulationAnswer].feedback}
              </p>
              <div className="mt-3 flex justify-end">
                {simulationStep < simulation.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => { setSimulationStep((step) => step + 1); setSimulationAnswer(null); }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#B8860B] px-3 py-2 text-xs font-bold text-[#121110] hover:bg-[#D0A63B]"
                  >
                    Lanjut <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetSimulation}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#B8860B] px-3 py-2 text-xs font-bold text-[#121110] hover:bg-[#D0A63B]"
                  >
                    <RotateCcw size={14} /> Ulangi simulasi
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-[#33312E] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/ungkapan-praktis" className="text-xs font-semibold text-[#A3A099] transition-colors hover:text-[#EAE6DD]">
          <ArrowLeft className="mr-1 inline" size={14} /> Daftar kategori
        </Link>
        <p className="text-xs text-[#817A73]">Kategori berikutnya akan ditambahkan bertahap.</p>
      </div>
    </div>
  );
}
