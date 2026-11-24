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
    title: "A. Berbicara melalui telepon",
    description: "Ungkapan untuk memulai panggilan, memastikan lawan bicara, dan mengatur waktu berbicara.",
    items: [
      { jp: "もしもし、<ruby>田中<rt>たなか</rt></ruby>さんですか。", romaji: "Moshi moshi, Tanaka-san desu ka.", id: "Halo, apakah ini Tanaka?", tone: "Memastikan lawan bicara" },
      { jp: "<ruby>今<rt>いま</rt></ruby>、お<ruby>時間<rt>じかん</rt></ruby>よろしいですか。", romaji: "Ima, ojikan yoroshii desu ka.", id: "Apakah sekarang Anda punya waktu?", tone: "Meminta waktu berbicara" },
      { jp: "あとでかけ<ruby>直<rt>なお</rt></ruby>します。", romaji: "Ato de kakenaoshimasu.", id: "Nanti saya telepon kembali.", tone: "Menunda panggilan" },
      { jp: "もう<ruby>一度<rt>いちど</rt></ruby><ruby>言<rt>い</rt></ruby>っていただけますか。", romaji: "Mou ichido itte itadakemasu ka.", id: "Bisakah Anda mengatakannya sekali lagi?", tone: "Meminta pengulangan" },
      { jp: "<ruby>電波<rt>でんぱ</rt></ruby>が<ruby>悪<rt>わる</rt></ruby>いようです。", romaji: "Denpa ga warui you desu.", id: "Sepertinya sinyalnya kurang bagus.", tone: "Masalah sambungan" },
    ],
  },
  {
    title: "B. Pesan dan komunikasi tertulis",
    description: "Ungkapan untuk menanggapi pesan, mengirim informasi, dan memastikan isi percakapan tertulis.",
    items: [
      { jp: "メッセージを<ruby>確認<rt>かくにん</rt></ruby>しました。", romaji: "Messeeji o kakunin shimashita.", id: "Saya sudah membaca pesannya.", tone: "Mengonfirmasi pesan" },
      { jp: "あとで<ruby>返信<rt>へんしん</rt></ruby>します。", romaji: "Ato de henshin shimasu.", id: "Nanti saya akan membalas.", tone: "Menunda balasan" },
      { jp: "<ruby>写真<rt>しゃしん</rt></ruby>を<ruby>送<rt>おく</rt></ruby>ってもらえますか。", romaji: "Shashin o okutte moraemasu ka.", id: "Bisakah kamu mengirimkan fotonya?", tone: "Meminta kiriman" },
      { jp: "<ruby>詳<rt>くわ</rt></ruby>しいことを<ruby>教<rt>おし</rt></ruby>えてください。", romaji: "Kuwashii koto o oshiete kudasai.", id: "Tolong beri tahu saya detailnya.", tone: "Meminta informasi lebih lanjut" },
      { jp: "<ruby>後<rt>あと</rt></ruby>で<ruby>連絡<rt>れんらく</rt></ruby>します。", romaji: "Ato de renraku shimasu.", id: "Nanti saya akan menghubungi.", tone: "Berjanji mengabari" },
    ],
  },
  {
    title: "C. Mengajak dan menanggapi ajakan",
    description: "Gunakan ungkapan ini untuk mengajak teman, menerima ajakan, atau mengusulkan waktu lain.",
    items: [
      { jp: "<ruby>今度<rt>こんど</rt></ruby>、<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>に<ruby>行<rt>い</rt></ruby>きませんか。", romaji: "Kondo, issho ni eiga o mi ni ikimasen ka.", id: "Kapan-kapan, mau menonton film bersama?", tone: "Mengajak teman" },
      { jp: "<ruby>土曜日<rt>どようび</rt></ruby>は<ruby>空<rt>あ</rt></ruby>いていますか。", romaji: "Doyoubi wa aite imasu ka.", id: "Apakah hari Sabtu kamu ada waktu?", tone: "Menanyakan ketersediaan waktu" },
      { jp: "いいですね。ぜひ<ruby>行<rt>い</rt></ruby>きましょう。", romaji: "Ii desu ne. Zehi ikimashou.", id: "Kedengarannya menyenangkan. Ayo, kita pergi.", tone: "Menerima ajakan" },
      { jp: "その<ruby>日<rt>ひ</rt></ruby>はちょっと<ruby>都合<rt>つごう</rt></ruby>が<ruby>悪<rt>わる</rt></ruby>いです。", romaji: "Sono hi wa chotto tsugou ga warui desu.", id: "Hari itu saya agak tidak bisa.", tone: "Menolak dengan halus" },
      { jp: "<ruby>別<rt>べつ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>でもいいですか。", romaji: "Betsu no hi demo ii desu ka.", id: "Apakah boleh di hari lain?", tone: "Mengusulkan jadwal lain" },
      { jp: "また<ruby>今度<rt>こんど</rt></ruby><ruby>誘<rt>さそ</rt></ruby>ってください。", romaji: "Mata kondo sasotte kudasai.", id: "Lain kali ajak saya lagi, ya.", tone: "Menolak sambil menjaga hubungan" },
    ],
  },
  {
    title: "D. Menyampaikan pendapat dan menanggapi",
    description: "Ungkapan untuk menyatakan pendapat sendiri, menyetujui, atau menyampaikan pandangan yang berbeda dengan sopan.",
    items: [
      { jp: "<ruby>私<rt>わたし</rt></ruby>はそう<ruby>思<rt>おも</rt></ruby>います。", romaji: "Watashi wa sou omoimasu.", id: "Saya juga berpikir begitu.", tone: "Menyatakan persetujuan" },
      { jp: "いい<ruby>考<rt>かんが</rt></ruby>えだと<ruby>思<rt>おも</rt></ruby>います。", romaji: "Ii kangae da to omoimasu.", id: "Menurut saya, itu ide yang bagus.", tone: "Memberi tanggapan positif" },
      { jp: "<ruby>私<rt>わたし</rt></ruby>は<ruby>少<rt>すこ</rt></ruby>し<ruby>違<rt>ちが</rt></ruby>う<ruby>意見<rt>いけん</rt></ruby>があります。", romaji: "Watashi wa sukoshi chigau iken ga arimasu.", id: "Saya punya pandangan yang sedikit berbeda.", tone: "Menyampaikan perbedaan pendapat" },
      { jp: "その<ruby>理由<rt>りゆう</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えてもらえますか。", romaji: "Sono riyuu o oshiete moraemasu ka.", id: "Bisa jelaskan alasannya?", tone: "Meminta alasan" },
      { jp: "なるほど、そういう<ruby>考<rt>かんが</rt></ruby>え<ruby>方<rt>かた</rt></ruby>もありますね。", romaji: "Naruhodo, sou iu kangaekata mo arimasu ne.", id: "Oh begitu, ternyata ada juga cara pandang seperti itu.", tone: "Menanggapi dengan terbuka" },
      { jp: "<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>考<rt>かんが</rt></ruby>えてみましょう。", romaji: "Issho ni kangaete mimashou.", id: "Mari kita pikirkan bersama.", tone: "Mengajak mencari solusi" },
    ],
  },
];

const dialogues: { title: string; context: string; lines: DialogueLine[] }[] = [
  {
    title: "Percakapan 1 · Mengatur waktu melalui telepon",
    context: "Kamu menelepon teman untuk memastikan apakah ia punya waktu berbicara dan mengatur pertemuan.",
    lines: [
      { speaker: "アキ", jp: "もしもし、<ruby>山田<rt>やまだ</rt></ruby>さんですか。", romaji: "Moshi moshi, Yamada-san desu ka.", id: "Halo, apakah ini Yamada?" },
      { speaker: "Yamada", jp: "はい、そうです。", romaji: "Hai, sou desu.", id: "Ya, benar." },
      { speaker: "アキ", jp: "<ruby>今<rt>いま</rt></ruby>、お<ruby>時間<rt>じかん</rt></ruby>よろしいですか。", romaji: "Ima, ojikan yoroshii desu ka.", id: "Apakah sekarang kamu punya waktu?" },
      { speaker: "Yamada", jp: "はい、<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>ですよ。どうしましたか。", romaji: "Hai, daijoubu desu yo. Dou shimashita ka.", id: "Ya, tidak masalah. Ada apa?" },
      { speaker: "アキ", jp: "<ruby>土曜日<rt>どようび</rt></ruby>に<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>に<ruby>行<rt>い</rt></ruby>きませんか。", romaji: "Doyoubi ni issho ni eiga o mi ni ikimasen ka.", id: "Hari Sabtu, mau menonton film bersama?" },
      { speaker: "Yamada", jp: "いいですね。ぜひ<ruby>行<rt>い</rt></ruby>きましょう。", romaji: "Ii desu ne. Zehi ikimashou.", id: "Boleh juga. Ayo, kita pergi." },
    ],
  },
  {
    title: "Percakapan 2 · Menolak ajakan dengan sopan",
    context: "Teman mengajakmu bertemu pada hari yang tidak bisa kamu datangi, lalu kalian mencari hari lain.",
    lines: [
      { speaker: "ミカ", jp: "<ruby>日曜日<rt>にちようび</rt></ruby>にカフェに<ruby>行<rt>い</rt></ruby>きませんか。", romaji: "Nichiyoubi ni kafe ni ikimasen ka.", id: "Mau pergi ke kafe hari Minggu?" },
      { speaker: "ユキ", jp: "<ruby>誘<rt>さそ</rt></ruby>ってくれてありがとう。でも、その<ruby>日<rt>ひ</rt></ruby>はちょっと<ruby>都合<rt>つごう</rt></ruby>が<ruby>悪<rt>わる</rt></ruby>いです。", romaji: "Sasotte kurete arigatou. Demo, sono hi wa chotto tsugou ga warui desu.", id: "Terima kasih sudah mengajak. Tapi, hari itu saya agak tidak bisa." },
      { speaker: "ミカ", jp: "そうですか。じゃあ、<ruby>土曜日<rt>どようび</rt></ruby>はどうですか。", romaji: "Sou desu ka. Jaa, doyoubi wa dou desu ka.", id: "Begitu, ya. Kalau hari Sabtu bagaimana?" },
      { speaker: "ユキ", jp: "はい、<ruby>土曜日<rt>どようび</rt></ruby>なら<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>です。", romaji: "Hai, doyoubi nara daijoubu desu.", id: "Ya, kalau hari Sabtu saya bisa." },
      { speaker: "ミカ", jp: "よかったです。では、<ruby>土曜日<rt>どようび</rt></ruby>にしましょう。", romaji: "Yokatta desu. Dewa, doyoubi ni shimashou.", id: "Syukurlah. Kalau begitu, kita pilih hari Sabtu." },
    ],
  },
  {
    title: "Percakapan 3 · Menyampaikan pendapat",
    context: "Kamu dan teman sedang membicarakan rencana kegiatan bersama dan memiliki pandangan yang berbeda.",
    lines: [
      { speaker: "ケン", jp: "<ruby>来週<rt>らいしゅう</rt></ruby>、みんなで<ruby>旅行<rt>りょこう</rt></ruby>に<ruby>行<rt>い</rt></ruby>くのはどうですか。", romaji: "Raishuu, minna de ryokou ni iku no wa dou desu ka.", id: "Bagaimana kalau minggu depan kita pergi berwisata bersama?" },
      { speaker: "アキ", jp: "いい<ruby>考<rt>かんが</rt></ruby>えだと<ruby>思<rt>おも</rt></ruby>います。でも、<ruby>少<rt>すこ</rt></ruby>し<ruby>違<rt>ちが</rt></ruby>う<ruby>意見<rt>いけん</rt></ruby>があります。", romaji: "Ii kangae da to omoimasu. Demo, sukoshi chigau iken ga arimasu.", id: "Menurut saya idenya bagus. Namun, saya punya pandangan yang sedikit berbeda." },
      { speaker: "ケン", jp: "どんな<ruby>意見<rt>いけん</rt></ruby>ですか。", romaji: "Donna iken desu ka.", id: "Pendapat seperti apa?" },
      { speaker: "アキ", jp: "<ruby>来週<rt>らいしゅう</rt></ruby>は<ruby>忙<rt>いそが</rt></ruby>しい<ruby>人<rt>ひと</rt></ruby>もいるので、<ruby>再来週<rt>さらいしゅう</rt></ruby>はどうでしょうか。", romaji: "Raishuu wa isogashii hito mo iru node, saraishuu wa dou deshou ka.", id: "Karena ada yang sibuk minggu depan, bagaimana kalau dua minggu lagi?" },
      { speaker: "ケン", jp: "なるほど。それもいいですね。みんなに<ruby>聞<rt>き</rt></ruby>いてみましょう。", romaji: "Naruhodo. Sore mo ii desu ne. Minna ni kiite mimashou.", id: "Oh begitu. Itu juga ide bagus. Mari kita tanyakan kepada semuanya." },
    ],
  },
];

const vocabulary = practicalVocabData.find((category) => category.id === "komunikasi-hubungan-sosial")?.vocab ?? [];

const quiz = [
  {
    question: "Kamu sedang menelepon seseorang dan ingin memastikan apakah ia punya waktu untuk berbicara. Apa yang sebaiknya kamu katakan?",
    options: [
      { label: "<ruby>今<rt>いま</rt></ruby>、お<ruby>時間<rt>じかん</rt></ruby>よろしいですか。", correct: true, feedback: "Benar. Ungkapan ini digunakan untuk memastikan apakah lawan bicara punya waktu." },
      { label: "あとで<ruby>返信<rt>へんしん</rt></ruby>します。", correct: false, feedback: "Kalimat ini berarti akan membalas pesan nanti." },
      { label: "<ruby>別<rt>べつ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>でもいいですか。", correct: false, feedback: "Kalimat ini mengusulkan untuk bertemu di hari lain." },
    ],
  },
  {
    question: "Teman mengajakmu pergi pada hari yang tidak bisa kamu datangi. Bagaimana cara menolak dengan halus?",
    options: [
      { label: "いいですね。ぜひ<ruby>行<rt>い</rt></ruby>きましょう。", correct: false, feedback: "Ungkapan ini berarti menerima ajakan dengan antusias." },
      { label: "その<ruby>日<rt>ひ</rt></ruby>はちょっと<ruby>都合<rt>つごう</rt></ruby>が<ruby>悪<rt>わる</rt></ruby>いです。", correct: true, feedback: "Tepat. Ungkapan ini menolak secara halus tanpa terdengar terlalu langsung." },
      { label: "<ruby>写真<rt>しゃしん</rt></ruby>を<ruby>送<rt>おく</rt></ruby>ってもらえますか。", correct: false, feedback: "Kalimat ini meminta seseorang mengirimkan foto." },
    ],
  },
  {
    question: "Kamu memiliki pendapat yang sedikit berbeda dan ingin menyampaikannya dengan sopan. Pilih ungkapan yang tepat.",
    options: [
      { label: "<ruby>私<rt>わたし</rt></ruby>は<ruby>少<rt>すこ</rt></ruby>し<ruby>違<rt>ちが</rt></ruby>う<ruby>意見<rt>いけん</rt></ruby>があります。", correct: true, feedback: "Benar. Kamu menyampaikan perbedaan pendapat tanpa menolak secara kasar." },
      { label: "あとでかけ<ruby>直<rt>なお</rt></ruby>します。", correct: false, feedback: "Kalimat ini berarti akan menelepon kembali nanti." },
      { label: "メッセージを<ruby>確認<rt>かくにん</rt></ruby>しました。", correct: false, feedback: "Kalimat ini berarti sudah membaca pesan." },
    ],
  },
];

const simulation = [
  {
    prompt: "Kamu menelepon teman untuk mengajaknya menonton film. Teman mengangkat telepon:",
    japanese: "もしもし。",
    romaji: "Moshi moshi.",
    translation: "Halo.",
    task: "Tanyakan apakah ia punya waktu berbicara sekarang.",
    options: [
      { label: "<ruby>今<rt>いま</rt></ruby>、お<ruby>時間<rt>じかん</rt></ruby>よろしいですか。", correct: true, feedback: "Tepat. Kamu meminta waktu berbicara dengan sopan." },
      { label: "<ruby>写真<rt>しゃしん</rt></ruby>を<ruby>送<rt>おく</rt></ruby>ってもらえますか。", correct: false, feedback: "Kalimat ini meminta seseorang mengirimkan foto." },
      { label: "その<ruby>日<rt>ひ</rt></ruby>はちょっと<ruby>都合<rt>つごう</rt></ruby>が<ruby>悪<rt>わる</rt></ruby>いです。", correct: false, feedback: "Kalimat ini digunakan untuk menolak ajakan." },
    ],
  },
  {
    prompt: "Kamu mengajak teman pergi hari Minggu, tetapi ia menjawab:",
    japanese: "すみません。その<ruby>日<rt>ひ</rt></ruby>はちょっと<ruby>都合<rt>つごう</rt></ruby>が<ruby>悪<rt>わる</rt></ruby>いです。",
    romaji: "Sumimasen. Sono hi wa chotto tsugou ga warui desu.",
    translation: "Maaf. Hari itu saya agak tidak bisa.",
    task: "Usulkan agar kalian pergi di hari lain.",
    options: [
      { label: "<ruby>別<rt>べつ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>でもいいですか。", correct: true, feedback: "Benar. Kamu mengusulkan untuk memilih hari lain." },
      { label: "あとで<ruby>返信<rt>へんしん</rt></ruby>します。", correct: false, feedback: "Kalimat ini berarti akan membalas pesan nanti." },
      { label: "<ruby>私<rt>わたし</rt></ruby>はそう<ruby>思<rt>おも</rt></ruby>います。", correct: false, feedback: "Kalimat ini menyatakan persetujuan terhadap suatu pendapat." },
    ],
  },
  {
    prompt: "Teman mengusulkan sebuah rencana, lalu meminta pendapatmu:",
    japanese: "どう<ruby>思<rt>おも</rt></ruby>いますか。",
    romaji: "Dou omoimasu ka.",
    translation: "Menurutmu bagaimana?",
    task: "Sampaikan bahwa kamu punya sedikit pendapat berbeda.",
    options: [
      { label: "<ruby>私<rt>わたし</rt></ruby>は<ruby>少<rt>すこ</rt></ruby>し<ruby>違<rt>ちが</rt></ruby>う<ruby>意見<rt>いけん</rt></ruby>があります。", correct: true, feedback: "Tepat. Kamu menyampaikan pandangan berbeda dengan cara yang sopan." },
      { label: "あとでかけ<ruby>直<rt>なお</rt></ruby>します。", correct: false, feedback: "Kalimat ini digunakan ketika ingin menelepon kembali nanti." },
      { label: "メッセージを<ruby>確認<rt>かくにん</rt></ruby>しました。", correct: false, feedback: "Kalimat ini berarti sudah membaca pesan." },
    ],
  },
];

export default function KomunikasiHubunganSosialPage() {
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
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">KATEGORI 10 · MATERI 1</p>
        <h1 className="mt-2 text-2xl font-bold text-[#EAE6DD] sm:text-3xl">Komunikasi dan Hubungan Sosial</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A3A099]">
          Pelajari cara berbicara melalui telepon, membalas pesan, mengajak atau menolak ajakan,
          serta menyampaikan pendapat dengan tetap menghargai lawan bicara.
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
          Setelah materi ini, kamu diharapkan bisa membuka percakapan lewat telepon,
          menanggapi pesan, mengajak atau menolak ajakan dengan halus, dan menyampaikan pendapat secara sopan.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#EAE6DD]">Ungkapan penting</h2>
          <p className="mt-1 text-xs text-[#A3A099]">Perhatikan perbedaan ungkapan ketika berbicara dengan teman dan orang yang belum akrab.</p>
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
          <p className="mt-1 text-xs text-[#A3A099]">Dialog orisinal Fude tentang telepon, ajakan, dan perbedaan pendapat.</p>
        </div>
        {dialogues.map((dialogue) => (
          <Dialogue key={dialogue.title} {...dialogue} />
        ))}
      </section>

      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-[#D9B66D]" />
          <h2 className="text-lg font-bold text-[#EAE6DD]">Etika komunikasi dan hubungan sosial</h2>
        </div>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[#C5C0B7]">
          <li><span className="font-semibold text-[#EAE6DD]">Awali telepon dengan もしもし.</span> Ungkapan ini lazim digunakan saat memulai percakapan telepon sehari-hari. Untuk urusan formal, perkenalkan diri dan tujuan panggilan dengan jelas.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Pastikan waktu lawan bicara.</span> Menanyakan お<ruby>時間<rt>じかん</rt></ruby>よろしいですか menunjukkan bahwa kamu menghargai kesibukan orang lain sebelum memulai pembicaraan.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Menolak ajakan tidak harus terlalu langsung.</span> Ucapkan terima kasih atas ajakan, jelaskan bahwa waktunya kurang cocok, lalu usulkan hari lain bila memungkinkan.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Sampaikan pendapat tanpa merendahkan.</span> Ungkapan seperti <ruby>少<rt>すこ</rt></ruby>し<ruby>違<rt>ちが</rt></ruby>う<ruby>意見<rt>いけん</rt></ruby>があります membantu menyampaikan pandangan berbeda secara lebih halus. Dengarkan alasan lawan bicara juga.</li>
          <li><span className="font-semibold text-[#EAE6DD]">Sesuaikan bahasa dengan hubungan.</span> Pilih bentuk sopan saat berbicara dengan orang yang belum akrab atau dalam situasi formal. Bentuk santai dapat digunakan dengan teman dekat sesuai konteks.</li>
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
          Hadapi tiga situasi komunikasi sehari-hari. Pilih respons yang tepat agar hubungan tetap nyaman.
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
        <p className="text-xs text-[#817A73]">Seluruh 10 kategori Ungkapan Praktis sudah tersedia.</p>
      </div>
    </div>
  );
}
