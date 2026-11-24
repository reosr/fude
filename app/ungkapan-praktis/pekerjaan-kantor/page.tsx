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
import practicalVocabData from "@/data/practical-vocab.json";

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
        <JapaneseReading
          html={phrase.note}
          showKana={false}
          showRomaji={false}
          showTranslation={false}
          contentClassName="mt-3 border-t border-[#33312E] pt-2 text-xs leading-relaxed text-[#A3A099]"
        />
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
            <span className="pt-1 text-[10px] font-bold text-[#D9B66D] sm:text-xs" dangerouslySetInnerHTML={{ __html: line.speaker }} />
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
    title: "A. Sapaan dan komunikasi di kantor",
    description: "Ungkapan sehari-hari untuk menyapa rekan kerja, memulai pembicaraan, dan mengakhiri hari kerja.",
    items: [
      { jp: "おはようございます。", romaji: "Ohayou gozaimasu.", id: "Selamat pagi.", tone: "Salam saat datang bekerja" },
      { jp: "<ruby>今日<rt>きょう</rt></ruby>もよろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Kyou mo yoroshiku onegaishimasu.", id: "Mohon kerja samanya hari ini juga.", tone: "Sapaan kepada rekan kerja" },
      { jp: "お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します。", romaji: "Osaki ni shitsurei shimasu.", id: "Saya pamit pulang lebih dahulu.", tone: "Pulang lebih dahulu", note: "Rekan yang masih bekerja dapat menjawab お<ruby>疲<rt>つか</rt></ruby>れさまでした." },
      { jp: "お<ruby>疲<rt>つか</rt></ruby>れさまでした。", romaji: "Otsukaresama deshita.", id: "Terima kasih atas kerja kerasnya hari ini.", tone: "Menanggapi rekan yang selesai bekerja" },
      { jp: "<ruby>少<rt>すこ</rt></ruby>しお<ruby>時間<rt>じかん</rt></ruby>よろしいですか。", romaji: "Sukoshi ojikan yoroshii desu ka.", id: "Apakah Anda punya sedikit waktu?", tone: "Memulai pembicaraan dengan sopan" },
      { jp: "<ruby>今<rt>いま</rt></ruby>、お<ruby>話<rt>はな</rt></ruby>ししてもよろしいですか。", romaji: "Ima, ohanashi shite mo yoroshii desu ka.", id: "Bolehkah saya berbicara dengan Anda sekarang?", tone: "Meminta waktu atasan atau rekan" },
    ],
  },
  {
    title: "B. Memahami instruksi dan pekerjaan",
    description: "Gunakan ungkapan ini untuk memastikan tugas, meminta contoh, dan memahami urutan pekerjaan.",
    items: [
      { jp: "この<ruby>仕事<rt>しごと</rt></ruby>のやり<ruby>方<rt>かた</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えていただけますか。", romaji: "Kono shigoto no yarikata o oshiete itadakemasu ka.", id: "Bisakah Anda mengajari saya cara mengerjakan tugas ini?", tone: "Meminta petunjuk" },
      { jp: "もう<ruby>一度<rt>いちど</rt></ruby><ruby>確認<rt>かくにん</rt></ruby>してもいいですか。", romaji: "Mou ichido kakunin shite mo ii desu ka.", id: "Bolehkah saya memastikannya sekali lagi?", tone: "Memastikan instruksi" },
      { jp: "<ruby>優先順位<rt>ゆうせんじゅんい</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えてください。", romaji: "Yuusen jun'i o oshiete kudasai.", id: "Tolong beri tahu urutan prioritasnya.", tone: "Menentukan prioritas" },
      { jp: "こちらで<ruby>合<rt>あ</rt></ruby>っていますか。", romaji: "Kochira de atte imasu ka.", id: "Apakah yang ini sudah benar?", tone: "Memastikan hasil pekerjaan" },
      { jp: "<ruby>締<rt>し</rt></ruby>め<ruby>切<rt>き</rt></ruby>りはいつですか。", romaji: "Shimekiri wa itsu desu ka.", id: "Kapan tenggat waktunya?", tone: "Menanyakan tenggat" },
    ],
  },
  {
    title: "C. Melaporkan perkembangan pekerjaan",
    description: "Ungkapan untuk menyampaikan progres, mengonfirmasi pekerjaan selesai, dan melaporkan kendala.",
    items: [
      { jp: "<ruby>今<rt>いま</rt></ruby>、<ruby>作業<rt>さぎょう</rt></ruby>を<ruby>進<rt>すす</rt></ruby>めています。", romaji: "Ima, sagyou o susumete imasu.", id: "Saya sedang melanjutkan pekerjaan sekarang.", tone: "Melaporkan progres" },
      { jp: "<ruby>終<rt>お</rt></ruby>わりましたので、ご<ruby>確認<rt>かくにん</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Owarimashita node, go-kakunin o onegaishimasu.", id: "Pekerjaannya sudah selesai. Mohon diperiksa.", tone: "Melaporkan pekerjaan selesai" },
      { jp: "<ruby>少<rt>すこ</rt></ruby>し<ruby>時間<rt>じかん</rt></ruby>がかかりそうです。", romaji: "Sukoshi jikan ga kakarisou desu.", id: "Sepertinya akan membutuhkan sedikit waktu lagi.", tone: "Memberi kabar tentang durasi" },
      { jp: "<ruby>問題<rt>もんだい</rt></ruby>が<ruby>発生<rt>はっせい</rt></ruby>しました。", romaji: "Mondai ga hassei shimashita.", id: "Ada masalah yang terjadi.", tone: "Melaporkan kendala" },
      { jp: "すぐに<ruby>確認<rt>かくにん</rt></ruby>します。", romaji: "Sugu ni kakunin shimasu.", id: "Saya akan segera memeriksanya.", tone: "Menanggapi permintaan" },
    ],
  },
  {
    title: "D. Rapat, izin, dan keterlambatan",
    description: "Ungkapan untuk mengatur waktu, meminta izin, dan memberi tahu rekan kerja ketika ada perubahan jadwal.",
    items: [
      { jp: "<ruby>会議<rt>かいぎ</rt></ruby>は<ruby>何時<rt>なんじ</rt></ruby>からですか。", romaji: "Kaigi wa nanji kara desu ka.", id: "Rapat dimulai pukul berapa?", tone: "Menanyakan jadwal rapat" },
      { jp: "<ruby>会議室<rt>かいぎしつ</rt></ruby>はどこですか。", romaji: "Kaigishitsu wa doko desu ka.", id: "Ruang rapat ada di mana?", tone: "Menanyakan lokasi rapat" },
      { jp: "<ruby>明日<rt>あした</rt></ruby>、<ruby>休暇<rt>きゅうか</rt></ruby>を<ruby>取<rt>と</rt></ruby>ってもよろしいでしょうか。", romaji: "Ashita, kyuuka o totte mo yoroshii deshou ka.", id: "Apakah besok saya boleh mengambil cuti?", tone: "Meminta izin cuti" },
      { jp: "<ruby>電車<rt>でんしゃ</rt></ruby>が<ruby>遅<rt>おく</rt></ruby>れているため、<ruby>少<rt>すこ</rt></ruby>し<ruby>遅<rt>おく</rt></ruby>れます。", romaji: "Densha ga okurete iru tame, sukoshi okuremasu.", id: "Karena kereta terlambat, saya akan datang sedikit terlambat.", tone: "Memberi kabar keterlambatan" },
      { jp: "<ruby>体調<rt>たいちょう</rt></ruby>が<ruby>悪<rt>わる</rt></ruby>いため、<ruby>本日<rt>ほんじつ</rt></ruby>はお<ruby>休<rt>やす</rt></ruby>みをいただけますか。", romaji: "Taichou ga warui tame, honjitsu wa oyasumi o itadakemasu ka.", id: "Karena kondisi saya kurang sehat, bolehkah hari ini saya izin tidak masuk?", tone: "Memberi kabar sakit" },
      { jp: "お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>してもよろしいでしょうか。", romaji: "Osaki ni shitsurei shite mo yoroshii deshou ka.", id: "Bolehkah saya pulang lebih dahulu?", tone: "Meminta izin pulang lebih awal" },
    ],
  },
];

const dialogues: { title: string; context: string; lines: DialogueLine[] }[] = [
  {
    title: "Percakapan 1 · Memastikan instruksi dari atasan",
    context: "Kamu menerima tugas baru dan ingin memastikan cara serta tenggat pengerjaannya.",
    lines: [
      { speaker: "<ruby>上司<rt>じょうし</rt></ruby>", jp: "この<ruby>資料<rt>しりょう</rt></ruby>をまとめてもらえますか。", romaji: "Kono shiryou o matomete moraemasu ka.", id: "Bisakah kamu merangkum bahan ini?" },
      { speaker: "<ruby>社員<rt>しゃいん</rt></ruby>", jp: "はい。いつまでに<ruby>終<rt>お</rt></ruby>わらせればいいですか。", romaji: "Hai. Itsu made ni owarasereba ii desu ka.", id: "Baik. Kapan paling lambat harus selesai?" },
      { speaker: "<ruby>上司<rt>じょうし</rt></ruby>", jp: "<ruby>明日<rt>あした</rt></ruby>の<ruby>午後<rt>ごご</rt></ruby>までにお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Ashita no gogo made ni onegaishimasu.", id: "Tolong selesaikan paling lambat besok sore." },
      { speaker: "<ruby>社員<rt>しゃいん</rt></ruby>", jp: "わかりました。<ruby>確認<rt>かくにん</rt></ruby>したいことがあれば、また<ruby>質問<rt>しつもん</rt></ruby>します。", romaji: "Wakarimashita. Kakunin shitai koto ga areba, mata shitsumon shimasu.", id: "Baik. Kalau ada yang ingin saya pastikan, saya akan bertanya lagi." },
      { speaker: "<ruby>上司<rt>じょうし</rt></ruby>", jp: "よろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Yoroshiku onegaishimasu.", id: "Mohon dikerjakan dengan baik." },
    ],
  },
  {
    title: "Percakapan 2 · Melaporkan hasil pekerjaan",
    context: "Kamu sudah menyelesaikan tugas dan meminta atasan memeriksa hasilnya.",
    lines: [
      { speaker: "<ruby>社員<rt>しゃいん</rt></ruby>", jp: "お<ruby>疲<rt>つか</rt></ruby>れさまです。<ruby>資料<rt>しりょう</rt></ruby>が<ruby>完成<rt>かんせい</rt></ruby>しました。", romaji: "Otsukaresama desu. Shiryou ga kansei shimashita.", id: "Halo, dokumen yang diminta sudah selesai." },
      { speaker: "<ruby>上司<rt>じょうし</rt></ruby>", jp: "ありがとうございます。<ruby>少<rt>すこ</rt></ruby>し<ruby>確認<rt>かくにん</rt></ruby>します。", romaji: "Arigatou gozaimasu. Sukoshi kakunin shimasu.", id: "Terima kasih. Saya akan memeriksanya sebentar." },
      { speaker: "<ruby>上司<rt>じょうし</rt></ruby>", jp: "この<ruby>部分<rt>ぶぶん</rt></ruby>をもう<ruby>少<rt>すこ</rt></ruby>し<ruby>直<rt>なお</rt></ruby>してください。", romaji: "Kono bubun o mou sukoshi naoshite kudasai.", id: "Tolong perbaiki bagian ini sedikit lagi." },
      { speaker: "<ruby>社員<rt>しゃいん</rt></ruby>", jp: "わかりました。<ruby>修正<rt>しゅうせい</rt></ruby>してから、もう<ruby>一度<rt>いちど</rt></ruby><ruby>提出<rt>ていしゅつ</rt></ruby>します。", romaji: "Wakarimashita. Shuusei shite kara, mou ichido teishutsu shimasu.", id: "Baik. Setelah diperbaiki, saya akan mengumpulkannya sekali lagi." },
      { speaker: "<ruby>上司<rt>じょうし</rt></ruby>", jp: "よろしくお<ruby>願<rt>ねが</rt></ruby>いします。", romaji: "Yoroshiku onegaishimasu.", id: "Mohon dikerjakan." },
    ],
  },
  {
    title: "Percakapan 3 · Memberi kabar akan terlambat",
    context: "Dalam perjalanan ke kantor, kereta mengalami keterlambatan sehingga kamu mengabari rekan kerja.",
    lines: [
      { speaker: "<ruby>社員<rt>しゃいん</rt></ruby>", jp: "おはようございます。<ruby>電車<rt>でんしゃ</rt></ruby>が<ruby>遅<rt>おく</rt></ruby>れているため、<ruby>少<rt>すこ</rt></ruby>し<ruby>遅<rt>おく</rt></ruby>れます。", romaji: "Ohayou gozaimasu. Densha ga okurete iru tame, sukoshi okuremasu.", id: "Selamat pagi. Karena kereta terlambat, saya akan datang sedikit terlambat." },
      { speaker: "<ruby>同僚<rt>どうりょう</rt></ruby>", jp: "わかりました。<ruby>気<rt>き</rt></ruby>をつけて<ruby>来<rt>き</rt></ruby>てください。", romaji: "Wakarimashita. Ki o tsukete kite kudasai.", id: "Baik. Hati-hati di jalan." },
      { speaker: "<ruby>社員<rt>しゃいん</rt></ruby>", jp: "ありがとうございます。<ruby>着<rt>つ</rt></ruby>いたら、すぐに<ruby>連絡<rt>れんらく</rt></ruby>します。", romaji: "Arigatou gozaimasu. Tsuitara, sugu ni renraku shimasu.", id: "Terima kasih. Setelah sampai, saya akan segera menghubungi." },
      { speaker: "<ruby>同僚<rt>どうりょう</rt></ruby>", jp: "はい、お<ruby>待<rt>ま</rt></ruby>ちしています。", romaji: "Hai, omachi shite imasu.", id: "Baik, kami tunggu." },
    ],
  },
];

const practicalCategory = practicalVocabData.find((category) => category.id === "pekerjaan-kantor")!;
const vocabulary = practicalCategory.vocab;

const quiz = [
  {
    question: "Atasan memberi tugas, tetapi kamu belum memahami cara mengerjakannya. Ungkapan mana yang paling sesuai?",
    options: [
      { label: "この<ruby>仕事<rt>しごと</rt></ruby>のやり<ruby>方<rt>かた</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えていただけますか。", correct: true, feedback: "Benar. Ini cara sopan untuk meminta petunjuk tentang cara mengerjakan tugas." },
      { label: "お<ruby>先<rt>さき</rt></ruby>に<ruby>失礼<rt>しつれい</rt></ruby>します。", correct: false, feedback: "Ungkapan ini digunakan saat pamit pulang lebih dahulu." },
      { label: "<ruby>会議室<rt>かいぎしつ</rt></ruby>はどこですか。", correct: false, feedback: "Kalimat ini menanyakan lokasi ruang rapat." },
    ],
  },
  {
    question: "Kamu sudah menyelesaikan pekerjaan dan ingin meminta atasan memeriksa hasilnya. Apa yang kamu katakan?",
    options: [
      { label: "<ruby>少<rt>すこ</rt></ruby>し<ruby>時間<rt>じかん</rt></ruby>がかかりそうです。", correct: false, feedback: "Kalimat ini menyampaikan bahwa pekerjaan masih membutuhkan waktu." },
      { label: "<ruby>終<rt>お</rt></ruby>わりましたので、ご<ruby>確認<rt>かくにん</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", correct: true, feedback: "Tepat. Kamu memberi tahu bahwa pekerjaan selesai dan meminta hasilnya diperiksa." },
      { label: "<ruby>明日<rt>あした</rt></ruby>、<ruby>休暇<rt>きゅうか</rt></ruby>を<ruby>取<rt>と</rt></ruby>ってもよろしいでしょうか。", correct: false, feedback: "Kalimat ini digunakan untuk meminta izin cuti besok." },
    ],
  },
  {
    question: "Kereta terlambat dan kamu perlu memberi tahu kantor bahwa kamu akan datang terlambat. Pilih kalimat yang tepat.",
    options: [
      { label: "<ruby>会議<rt>かいぎ</rt></ruby>は<ruby>何時<rt>なんじ</rt></ruby>からですか。", correct: false, feedback: "Kalimat ini menanyakan waktu dimulainya rapat." },
      { label: "すぐに<ruby>確認<rt>かくにん</rt></ruby>します。", correct: false, feedback: "Kalimat ini berarti akan segera memeriksa sesuatu." },
      { label: "<ruby>電車<rt>でんしゃ</rt></ruby>が<ruby>遅<rt>おく</rt></ruby>れているため、<ruby>少<rt>すこ</rt></ruby>し<ruby>遅<rt>おく</rt></ruby>れます。", correct: true, feedback: "Benar. Kalimat ini memberi tahu bahwa kamu akan terlambat karena kereta mengalami keterlambatan." },
    ],
  },
];

const simulation = [
  {
    prompt: "Atasan memberikan tugas baru dan bertanya:",
    japanese: "この<ruby>仕事<rt>しごと</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。",
    romaji: "Kono shigoto o onegaishimasu.",
    translation: "Tolong kerjakan tugas ini.",
    task: "Tanyakan bagaimana cara mengerjakan tugas tersebut.",
    options: [
      { label: "この<ruby>仕事<rt>しごと</rt></ruby>のやり<ruby>方<rt>かた</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えていただけますか。", correct: true, feedback: "Tepat. Kamu meminta petunjuk dengan bahasa yang sopan." },
      { label: "<ruby>会議室<rt>かいぎしつ</rt></ruby>はどこですか。", correct: false, feedback: "Kalimat ini menanyakan lokasi ruang rapat." },
      { label: "お<ruby>疲<rt>つか</rt></ruby>れさまでした。", correct: false, feedback: "Ungkapan ini digunakan untuk menyapa atau menanggapi rekan kerja yang selesai bekerja." },
    ],
  },
  {
    prompt: "Kamu sudah menyelesaikan tugas. Atasan berkata:",
    japanese: "できましたか。",
    romaji: "Dekimashita ka.",
    translation: "Apakah sudah selesai?",
    task: "Sampaikan bahwa pekerjaan sudah selesai dan minta diperiksa.",
    options: [
      { label: "<ruby>問題<rt>もんだい</rt></ruby>が<ruby>発生<rt>はっせい</rt></ruby>しました。", correct: false, feedback: "Kalimat ini melaporkan bahwa ada masalah." },
      { label: "<ruby>終<rt>お</rt></ruby>わりましたので、ご<ruby>確認<rt>かくにん</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。", correct: true, feedback: "Benar. Kamu mengonfirmasi bahwa pekerjaan selesai dan meminta pemeriksaan." },
      { label: "<ruby>休暇<rt>きゅうか</rt></ruby>を<ruby>取<rt>と</rt></ruby>ってもよろしいでしょうか。", correct: false, feedback: "Kalimat ini meminta izin mengambil cuti." },
    ],
  },
  {
    prompt: "Kamu sedang menuju kantor, tetapi kereta terlambat. Rekan kerja menanyakan apakah kamu sudah dalam perjalanan:",
    japanese: "もう<ruby>会社<rt>かいしゃ</rt></ruby>に<ruby>向<rt>む</rt></ruby>かっていますか。",
    romaji: "Mou kaisha ni mukatte imasu ka.",
    translation: "Kamu sudah dalam perjalanan ke kantor?",
    task: "Beri tahu bahwa kereta terlambat sehingga kamu akan datang sedikit terlambat.",
    options: [
      { label: "<ruby>電車<rt>でんしゃ</rt></ruby>が<ruby>遅<rt>おく</rt></ruby>れているため、<ruby>少<rt>すこ</rt></ruby>し<ruby>遅<rt>おく</rt></ruby>れます。", correct: true, feedback: "Tepat. Kamu menjelaskan penyebab keterlambatan dan memberi kabar akan terlambat." },
      { label: "<ruby>締<rt>し</rt></ruby>め<ruby>切<rt>き</rt></ruby>りはいつですか。", correct: false, feedback: "Kalimat ini menanyakan tenggat waktu pekerjaan." },
      { label: "<ruby>資料<rt>しりょう</rt></ruby>を<ruby>提出<rt>ていしゅつ</rt></ruby>しました。", correct: false, feedback: "Kalimat ini menyampaikan bahwa dokumen sudah dikumpulkan." },
    ],
  },
];

export default function PekerjaanKantorPage() {
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
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">KATEGORI 08 · MATERI 1</p>
        <h1 className="mt-2 text-2xl font-bold text-[#EAE6DD] sm:text-3xl">Pekerjaan dan Lingkungan Kantor</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A3A099]">
          Pelajari cara berkomunikasi dengan atasan dan rekan kerja, memahami instruksi,
          melaporkan perkembangan tugas, serta mengatur jadwal dan izin kerja.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold">
          <span className="rounded-full border border-[#269B70]/30 bg-[#269B70]/10 px-3 py-1 text-[#66C49C]">Dasar · A2</span>
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
          Setelah materi ini, kamu diharapkan bisa menyapa rekan kerja, meminta penjelasan instruksi,
          melaporkan hasil pekerjaan, memahami jadwal rapat, serta menyampaikan izin atau keterlambatan.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Ungkapan penting</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Pelajari pilihan ungkapan untuk berbicara dengan atasan, rekan, dan staf kantor.</p>
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
          <p className="mt-1 text-xs text-[#A3A099]">Dialog orisinal Fude tentang instruksi, laporan pekerjaan, dan keterlambatan.</p>
        </div>
        {dialogues.map((dialogue) => (
          <Dialogue key={dialogue.title} {...dialogue} />
        ))}
      </section>

      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Etika komunikasi di tempat kerja</h2>
        </div>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[#C5C0B7]">
          <li><span className="font-semibold text-[#EAE6DD]">Gunakan bahasa sopan kepada atasan dan orang yang belum akrab.</span> Bentuk seperti いただけますか dan よろしいでしょうか terdengar lebih halus ketika meminta bantuan atau izin.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Pastikan instruksi sebelum mulai bekerja.</span> Ulangi poin penting seperti hasil yang diharapkan, tenggat, dan prioritas agar tidak terjadi salah paham.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Laporkan kendala lebih awal.</span> Jika tugas berpotensi terlambat atau ada masalah, sampaikan kondisinya dan langkah berikutnya secara jelas.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Pahami お<ruby>疲<rt>つか</rt></ruby>れさまです dan お<ruby>疲<rt>つか</rt></ruby>れさまでした.</span> Ungkapan ini sering digunakan untuk menyapa rekan kerja atau mengakui usaha mereka, bukan hanya berarti lelah secara harfiah.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Ikuti aturan kantor untuk cuti dan izin.</span> Cara mengajukan cuti, melaporkan sakit, serta mengabari keterlambatan dapat berbeda di setiap tempat kerja.</li>
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
              <div className="text-sm font-semibold leading-relaxed text-[#EAE6DD]">
                  {questionIndex + 1}. <JapaneseReading html={item.question} showKana={false} showRomaji={false} showTranslation={false} contentClassName="text-sm font-semibold leading-relaxed text-[#EAE6DD]" />
                </div>
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
                <JapaneseReading
                  html={item.options[selected].feedback}
                  showKana={false}
                  showRomaji={false}
                  showTranslation={false}
                  contentClassName={"mt-3 text-xs leading-relaxed " + (item.options[selected].correct ? "text-[#8ED8B4]" : "text-[#F08B8E]")}
                />
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
          Hadapi tiga situasi di kantor. Pilih respons yang tepat agar komunikasi pekerjaan berjalan lancar.
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

      <section className="rounded-2xl border border-[#B8860B]/30 bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div>
          <h2 className="text-lg font-bold text-[#EAE6DD]">Lanjutkan latihan</h2>
          <p className="mt-1 text-xs leading-relaxed text-[#A3A099]">
            Kosakata kategori ini juga tersedia di modul Kosakata dan Flashcard. Cerita terkait bisa dibaca kembali di Latihan Baca.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/kosakata?category=${practicalCategory.id}`}
            className="rounded-xl border border-[#B8860B]/40 bg-[#B8860B]/10 px-3 py-2 text-xs font-bold text-[#D9B66D] transition-colors hover:bg-[#B8860B]/20"
          >
            Buka Kosakata
          </Link>
          <Link
            href={`/flashcard?category=${practicalCategory.id}`}
            className="rounded-xl border border-[#B8860B]/40 bg-[#B8860B]/10 px-3 py-2 text-xs font-bold text-[#D9B66D] transition-colors hover:bg-[#B8860B]/20"
          >
            Latihan Flashcard
          </Link>
          {practicalCategory.relatedStories.length > 0 ? (
            practicalCategory.relatedStories.map((story) => (
              <Link
                key={story.id}
                href={`/baca?story=${story.id}`}
                className="rounded-xl border border-[#33312E] px-3 py-2 text-xs font-semibold text-[#C5C0B7] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"
              >
                Baca: {story.title}
              </Link>
            ))
          ) : (
            <Link
              href="/baca"
              className="rounded-xl border border-[#33312E] px-3 py-2 text-xs font-semibold text-[#C5C0B7] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"
            >
              Buka Latihan Baca
            </Link>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-[#33312E] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/ungkapan-praktis" className="text-xs font-semibold text-[#A3A099] transition-colors hover:text-[#EAE6DD]">
          <ArrowLeft className="mr-1 inline" size={14} /> Daftar kategori
        </Link>
        <p className="text-xs text-[#817A73]">Seluruh 10 kategori Ungkapan Praktis sudah tersedia.</p>
      </div>
    </div>
  );
}
