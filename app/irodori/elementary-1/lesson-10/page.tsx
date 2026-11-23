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
const lessonId = "elementary1-10";

const classScheduleConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>この日本語クラスは、いつですか。</>,romaji:"Kono nihongo kurasu wa, itsu desu ka?",translation:"Kelas bahasa Jepang ini kapan?",audioFileName:"irodori-elementary1-10-a01-l01.mp3"},
{speakerId:"sota",japanese:<>火曜日と木曜日です。午前10時からです。</>,romaji:"Kayoubi to mokuyoubi desu. Gozen juuji kara desu.",translation:"Hari Selasa dan Kamis. Mulai pukul 10 pagi.",audioFileName:"irodori-elementary1-10-a01-l02.mp3"},
{speakerId:"yui",japanese:<>場所はどこですか。</>,romaji:"Basho wa doko desu ka?",translation:"Tempatnya di mana?",audioFileName:"irodori-elementary1-10-a01-l03.mp3"},
{speakerId:"sota",japanese:<>市民センターの2階です。</>,romaji:"Shimin sentaa no nikai desu.",translation:"Di lantai dua pusat komunitas.",audioFileName:"irodori-elementary1-10-a01-l04.mp3"},
{speakerId:"yui",japanese:<>ありがとうございます。</>,romaji:"Arigatou gozaimasu.",translation:"Terima kasih.",audioFileName:"irodori-elementary1-10-a01-l05.mp3"},
];
const askingAtCommunityCenterConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>すみません。書道教室に参加してみたいんですが…。</>,romaji:"Sumimasen. Shodou kyoushitsu ni sanka shite mitai n desu ga...",translation:"Permisi. Saya ingin mencoba ikut kelas kaligrafi Jepang…",audioFileName:"irodori-elementary1-10-a02-l01.mp3"},
{speakerId:"kenji",japanese:<>はい。毎週水曜日の午後2時からです。</>,romaji:"Hai. Maishuu suiyoubi no gogo niji kara desu.",translation:"Baik. Setiap Rabu mulai pukul 2 siang.",audioFileName:"irodori-elementary1-10-a02-l02.mp3"},
{speakerId:"akiko",japanese:<>道具は自分で用意しますか。</>,romaji:"Dougu wa jibun de youi shimasu ka?",translation:"Apakah saya harus menyiapkan alat sendiri?",audioFileName:"irodori-elementary1-10-a02-l03.mp3"},
{speakerId:"kenji",japanese:<>いいえ。最初の道具は教室にあります。</>,romaji:"Iie. Saisho no dougu wa kyoushitsu ni arimasu.",translation:"Tidak. Peralatan awal tersedia di kelas.",audioFileName:"irodori-elementary1-10-a02-l04.mp3"},
];
const talkingAboutJapaneseClassConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>地域の日本語クラスはどうですか。</>,romaji:"Chiiki no nihongo kurasu wa dou desu ka?",translation:"Bagaimana kelas bahasa Jepang di lingkungan ini?",audioFileName:"irodori-elementary1-10-a03-l01.mp3"},
{speakerId:"sota",japanese:<>とてもいいですよ。週に1回、勉強します。</>,romaji:"Totemo ii desu yo. Shuu ni ikkai, benkyou shimasu.",translation:"Bagus sekali. Kami belajar sekali seminggu.",audioFileName:"irodori-elementary1-10-a03-l02.mp3"},
{speakerId:"yui",japanese:<>先生は親切ですか。</>,romaji:"Sensei wa shinsetsu desu ka?",translation:"Apakah gurunya ramah?",audioFileName:"irodori-elementary1-10-a03-l03.mp3"},
{speakerId:"sota",japanese:<>はい。ゆっくり話してくれます。</>,romaji:"Hai. Yukkuri hanashite kuremasu.",translation:"Ya. Beliau berbicara dengan perlahan.",audioFileName:"irodori-elementary1-10-a03-l04.mp3"},
];
const sharingLearningGoalsConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>日本語をどのくらい勉強しましたか。</>,romaji:"Nihongo o dono kurai benkyou shimashita ka?",translation:"Sudah berapa lama kamu belajar bahasa Jepang?",audioFileName:"irodori-elementary1-10-a04-l01.mp3"},
{speakerId:"yui",japanese:<>高校のとき、少し勉強しました。</>,romaji:"Koukou no toki, sukoshi benkyou shimashita.",translation:"Waktu SMA, saya belajar sedikit.",audioFileName:"irodori-elementary1-10-a04-l02.mp3"},
{speakerId:"akiko",japanese:<>どうしてクラスに参加したいですか。</>,romaji:"Doushite kurasu ni sanka shitai desu ka?",translation:"Mengapa kamu ingin ikut kelas?",audioFileName:"irodori-elementary1-10-a04-l03.mp3"},
{speakerId:"yui",japanese:<>日本語で友だちと話したいです。</>,romaji:"Nihongo de tomodachi to hanashitai desu.",translation:"Saya ingin berbicara dengan teman menggunakan bahasa Jepang.",audioFileName:"irodori-elementary1-10-a04-l04.mp3"},
];
const clarifyingClassDetailsConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>このクラスは月に何回ありますか。</>,romaji:"Kono kurasu wa tsuki ni nankai arimasu ka?",translation:"Berapa kali kelas ini diadakan dalam sebulan?",audioFileName:"irodori-elementary1-10-a05-l01.mp3"},
{speakerId:"kenji",japanese:<>月に4回です。</>,romaji:"Tsuki ni yonkai desu.",translation:"Empat kali sebulan.",audioFileName:"irodori-elementary1-10-a05-l02.mp3"},
{speakerId:"sota",japanese:<>すみません。「初級」は、どういう意味ですか。</>,romaji:"Sumimasen. 'Shokyuu' wa, dou iu imi desu ka?",translation:"Maaf. Apa arti 'shokyuu' (tingkat pemula)?",audioFileName:"irodori-elementary1-10-a05-l03.mp3"},
{speakerId:"kenji",japanese:<>初めて勉強する人のクラスです。</>,romaji:"Hajimete benkyou suru hito no kurasu desu.",translation:"Itu kelas untuk orang yang baru mulai belajar.",audioFileName:"irodori-elementary1-10-a05-l04.mp3"},
];
const canDos=[
{id:"read-class-information",text:"Menemukan dan memahami informasi tentang tempat, tanggal, serta waktu kelas yang ditawarkan di pusat komunitas setempat."},
{id:"ask-about-community-class",text:"Menanyakan hal-hal tentang kelas yang diminati di kantor layanan masyarakat dan memahami jawabannya."},
{id:"talk-about-japanese-class",text:"Bertanya kepada teman atau menjawab pertanyaan tentang kelas bahasa Jepang di lingkungan sekitar."},
{id:"explain-learning-goals",text:"Menjawab pertanyaan tentang pengalaman dan tujuan belajar bahasa Jepang untuk mengikuti kelas."},
{id:"confirm-class-details",text:"Memastikan kembali jadwal, frekuensi, atau istilah kelas ketika ada informasi yang belum dipahami."},
];
const classOptions=[
{id:"beginner",title:"日本語入門クラス",subtitle:"Kelas bahasa Jepang pemula",time:"週に2回 · Dua kali seminggu",schedule:"火曜日・木曜日 10:00–11:30",place:"市民センター 2階",level:"初級",summary:"Belajar salam, kosakata sehari-hari, dan percakapan sederhana."},
{id:"conversation",title:"日本語会話クラス",subtitle:"Kelas percakapan bahasa Jepang",time:"週に1回 · Sekali seminggu",schedule:"土曜日 14:00–15:30",place:"交流ルーム 1階",level:"初級・中級",summary:"Berlatih percakapan singkat dan bertanya jawab dengan teman."},
{id:"calligraphy",title:"書道教室",subtitle:"Kelas kaligrafi Jepang",time:"週に1回 · Sekali seminggu",schedule:"水曜日 14:00–15:00",place:"市民センター 3階",level:"初めての人も参加できます",summary:"Mengenal alat tulis dan mencoba menulis huruf Jepang dengan rapi."},
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
{prompt:<>Pada kalimat 「書道教室に参加してみたいんですが」, pola V-てみたい menyatakan …</>,options:[{key:"a",label:"Keinginan untuk mencoba melakukan sesuatu."},{key:"b",label:"Kebiasaan yang dilakukan setiap hari."},{key:"c",label:"Kegiatan yang sudah selesai."}],answer:"a",explanation:<>V-てみたい menyatakan ingin mencoba melakukan kegiatan: 参加します → 参加してみたい.</>},
{prompt:<>Apa arti 「週に1回」?</>,options:[{key:"a",label:"Sekali seminggu."},{key:"b",label:"Sekali sehari."},{key:"c",label:"Sekali sebulan."}],answer:"a",explanation:<>週に1回 berarti satu kali dalam seminggu. Periode waktu diikuti に dan jumlah kali diikuti 回.</>},
{prompt:<>Pilih ungkapan untuk menawarkan bantuan membawa brosur.</>,options:[{key:"a",label:"チラシを持って来ましょうか。"},{key:"b",label:"チラシを持って来たいです。"},{key:"c",label:"チラシを持って来ましたか。"}],answer:"a",explanation:<>V-ましょうか digunakan untuk menawarkan bantuan: 持って来ます → 持って来ましょうか.</>},
{prompt:<>Jika belum memahami kata 「初級」, pertanyaan yang sesuai adalah …</>,options:[{key:"a",label:"「初級」は、どういう意味ですか。"},{key:"b",label:"「初級」は、何時ですか。"},{key:"c",label:"「初級」は、何回ですか。"}],answer:"a",explanation:<>どういう意味ですか digunakan untuk menanyakan arti kata atau istilah yang belum dipahami.</>},
{prompt:<>Lengkapi: 「高校 ___、日本語を勉強しました。」</>,options:[{key:"a",label:"のとき"},{key:"b",label:"の回"},{key:"c",label:"のほう"}],answer:"a",explanation:<>Nのとき berarti ketika/saat berada dalam periode yang disebutkan, misalnya 高校のとき.</>},
{prompt:<>Pilih bentuk yang benar untuk “saat sibuk”.</>,options:[{key:"a",label:"忙しいとき"},{key:"b",label:"忙しいのとき"},{key:"c",label:"忙しなとき"}],answer:"a",explanation:<>Kata sifat い langsung diikuti とき: 忙しいとき. Kata sifat な memakai なとき.</>},
];

const quizQuestions:Task[]=[
{prompt:<>Apa arti 「午前」?</>,options:[{key:"a",label:"Pagi / sebelum tengah hari."},{key:"b",label:"Sore / setelah tengah hari."},{key:"c",label:"Minggu depan."}],answer:"a",explanation:<>午前 berarti sebelum tengah hari atau waktu pagi.</>},
{prompt:<>Pada pengumuman kelas, 「教室」 berarti …</>,options:[{key:"a",label:"Ruang kelas."},{key:"b",label:"Buku pelajaran."},{key:"c",label:"Guru."}],answer:"a",explanation:<>教室（きょうしつ）adalah ruang kelas.</>},
{prompt:<>Pilih kalimat yang menyatakan ingin mencoba mengikuti kelas.</>,options:[{key:"a",label:"日本語クラスに参加してみたいんですが。"},{key:"b",label:"日本語クラスに参加しました。"},{key:"c",label:"日本語クラスに参加しませんでした。"}],answer:"a",explanation:<>V-てみたいんですが menyatakan ingin mencoba melakukan sesuatu sebagai pembuka pertanyaan.</>},
{prompt:<>「月に2回」 berarti …</>,options:[{key:"a",label:"Dua kali sebulan."},{key:"b",label:"Dua bulan sekali."},{key:"c",label:"Dua kali sehari."}],answer:"a",explanation:<>月に2回 berarti dua kali dalam satu bulan.</>},
{prompt:<>Ungkapan 「手伝いましょうか」 digunakan untuk …</>,options:[{key:"a",label:"Menawarkan bantuan."},{key:"b",label:"Meminta izin pergi."},{key:"c",label:"Menjelaskan pengalaman lampau."}],answer:"a",explanation:<>V-ましょうか dapat digunakan untuk menawarkan melakukan sesuatu bagi orang lain.</>},
{prompt:<>Kalimat untuk menanyakan arti sebuah istilah adalah …</>,options:[{key:"a",label:"「教科書」は、どういう意味ですか。"},{key:"b",label:"「教科書」は、どこですか。"},{key:"c",label:"「教科書」は、何時ですか。"}],answer:"a",explanation:<>どういう意味ですか menanyakan arti atau makna sebuah kata.</>},
{prompt:<>Bentuk yang benar dari 「元気（な）」 + とき adalah …</>,options:[{key:"a",label:"元気なとき"},{key:"b",label:"元気のとき"},{key:"c",label:"元気いとき"}],answer:"a",explanation:<>Kata sifat な diikuti なとき: 元気なとき.</>},
{prompt:<>Lengkapi: 「子どもの ___、よく本を読みました。」</>,options:[{key:"a",label:"とき"},{key:"b",label:"回"},{key:"c",label:"午前"}],answer:"a",explanation:<>Nのとき digunakan untuk menyebut periode waktu: 子どものとき (waktu masih kecil).</>},
{prompt:<>Apa arti 「全部」?</>,options:[{key:"a",label:"Semuanya."},{key:"b",label:"Sebagian."},{key:"c",label:"Kemarin."}],answer:"a",explanation:<>全部 berarti seluruhnya atau semuanya.</>},
{prompt:<>Apa informasi yang sebaiknya diperiksa pada pengumuman kelas?</>,options:[{key:"a",label:"Tempat, hari, jam, dan frekuensi kelas."},{key:"b",label:"Warna pakaian setiap peserta."},{key:"c",label:"Nama semua orang di lingkungan."}],answer:"a",explanation:<>Tempat, tanggal atau hari, waktu, dan frekuensi merupakan informasi utama dalam pengumuman kelas.</>},
];

const simulations=[
{title:"01 · Membaca pengumuman kelas",heading:"Menemukan hari dan waktu kelas",prompt:"Pada papan pengumuman tertulis: 火曜日と木曜日、午前10時から11時半まで. Pilih kesimpulan yang benar.",japanese:<>火曜日と木曜日、午前10時から11時半まで</>,translation:"Hari Selasa dan Kamis, pukul 10.00–11.30 pagi.",options:[{key:"correct",label:"Kelas diadakan dua kali seminggu pada pagi hari.",meaning:"Selasa dan Kamis, pukul 10.00–11.30."},{key:"wrong1",label:"Kelas diadakan setiap sore hari.",meaning:"Informasi sore tidak sesuai dengan 午前."},{key:"wrong2",label:"Kelas diadakan hanya pada hari Minggu.",meaning:"Hari Minggu tidak tercantum di pengumuman."}],answer:"correct",explanation:"Perhatikan hari yang tercantum dan 午前 yang berarti sebelum tengah hari."},
{title:"02 · Bertanya tentang kelas yang diminati",heading:"Menyampaikan keinginan mencoba",prompt:"Kamu tertarik mencoba kelas kaligrafi dan ingin menanyakan jadwalnya kepada petugas pusat komunitas.",japanese:<>書道教室に参加してみたいんですが…。</>,translation:"Saya ingin mencoba ikut kelas kaligrafi…",options:[{key:"try",label:"書道教室に参加してみたいんですが。",meaning:"Saya ingin mencoba ikut kelas kaligrafi."},{key:"past",label:"書道教室に参加しました。",meaning:"Saya sudah ikut kelas kaligrafi."},{key:"method",label:"書道教室に参加する方です。",meaning:"Ini bukan ungkapan untuk membuka pertanyaan."}],answer:"try",explanation:"V-てみたいんですが menyampaikan keinginan mencoba suatu kegiatan sebelum bertanya lebih lanjut."},
{title:"03 · Menanyakan frekuensi kelas",heading:"Menggunakan ～回",prompt:"Temanmu mengatakan kelas bahasa Jepang diadakan dua kali dalam sebulan. Pilih ungkapannya.",japanese:<>月に2回です。</>,translation:"Dua kali sebulan.",options:[{key:"frequency",label:"月に2回です。",meaning:"Dua kali dalam sebulan."},{key:"duration",label:"2か月です。",meaning:"Dua bulan."},{key:"time",label:"午後2時です。",meaning:"Pukul dua siang."}],answer:"frequency",explanation:"Periode 月に diikuti jumlah kali 2回 untuk menyatakan frekuensi."},
{title:"04 · Menawarkan bantuan",heading:"Memakai V-ましょうか",prompt:"Temanmu sedang mencari brosur kelas. Kamu menemukannya di meja dan ingin menawarkan untuk membawanya.",japanese:<>チラシを持って来ましょうか。</>,translation:"Mau saya bawakan brosurnya?",options:[{key:"offer",label:"チラシを持って来ましょうか。",meaning:"Menawarkan untuk membawakan brosur."},{key:"request",label:"チラシを持って来てください。",meaning:"Meminta orang lain membawa brosur."},{key:"past",label:"チラシを持って来ました。",meaning:"Sudah membawa brosur."}],answer:"offer",explanation:"V-ましょうか dapat dipakai untuk menawarkan bantuan kepada orang lain."},
{title:"05 · Mengonfirmasi istilah kelas",heading:"Meminta penjelasan istilah",prompt:"Kamu melihat kata 初級 pada brosur tetapi belum tahu artinya. Pilih pertanyaan yang sesuai.",japanese:<>「初級」は、どういう意味ですか。</>,translation:"Apa arti 'shokyuu' (tingkat pemula)?",options:[{key:"meaning",label:"「初級」は、どういう意味ですか。",meaning:"Menanyakan arti istilah."},{key:"when",label:"「初級」は、いつですか。",meaning:"Menanyakan kapan, bukan arti."},{key:"where",label:"「初級」は、どこですか。",meaning:"Menanyakan lokasi, bukan arti."}],answer:"meaning",explanation:"どういう意味ですか adalah ungkapan untuk meminta penjelasan arti kata."},
];

const vocabulary=[
["午前","ごぜん · gozen","Pagi / sebelum tengah hari"],["午後","ごご · gogo","Siang / setelah tengah hari"],["教科書","きょうかしょ · kyoukasho","Buku pelajaran"],["教室","きょうしつ · kyoushitsu","Ruang kelas"],["先生","せんせい · sensei","Guru"],["全部","ぜんぶ · zenbu","Semuanya"],["～回","～かい · ~kai","Kali (frekuensi)"],["参加する","さんかする · sanka suru","Berpartisipasi / ikut"],["用意する","よういする · youi suru","Menyiapkan"],["日本語クラス","にほんごクラス · nihongo kurasu","Kelas bahasa Jepang"],["入門","にゅうもん · nyuumon","Pengantar / pemula"],["初級","しょきゅう · shokyuu","Tingkat pemula"],["中級","ちゅうきゅう · chuukyuu","Tingkat menengah"],["市民センター","しみんセンター · shimin sentaa","Pusat komunitas"],["教室案内","きょうしつあんない · kyoushitsu annai","Informasi kelas"],["曜日","ようび · youbi","Hari dalam sepekan"],["火曜日","かようび · kayoubi","Hari Selasa"],["木曜日","もくようび · mokuyoubi","Hari Kamis"],["水曜日","すいようび · suiyoubi","Hari Rabu"],["土曜日","どようび · doyoubi","Hari Sabtu"],["日程","にってい · nittei","Jadwal / tanggal kegiatan"],["申し込み","もうしこみ · moushikomi","Pendaftaran"],["費用","ひよう · hiyou","Biaya"],["書道","しょどう · shodou","Kaligrafi Jepang"],["質問","しつもん · shitsumon","Pertanyaan"]
];

const kanjiWords=[
["午前","ごぜん · gozen","Pagi / sebelum tengah hari"],["午後","ごご · gogo","Siang / setelah tengah hari"],["教科書","きょうかしょ · kyoukasho","Buku pelajaran"],["教室","きょうしつ · kyoushitsu","Ruang kelas"],["先生","せんせい · sensei","Guru"],["全部","ぜんぶ · zenbu","Semuanya"],["～回","～かい · ~kai","Kali (frekuensi)"],["参加する","さんかする · sanka suru","Berpartisipasi / ikut"],["用意する","よういする · youi suru","Menyiapkan"]
];

export default function IrodoriElementaryOneLessonTenPage() {
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
        <ArrowLeft size={15} /> Kembali ke Elementary 1
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#476C51]/45 bg-gradient-to-br from-[#203428] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#91B99A]/[0.08]">教</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">IRODORI • ELEMENTARY 1 A2 • LESSON 10</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya ingin mengikuti kelas bahasa Jepang.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9CDB0]">日本語のクラスに参加したいんですが。</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Berlatih membaca informasi kelas komunitas, menanyakan jadwal dan isi pelajaran, membicarakan kelas bahasa Jepang, serta menjelaskan pengalaman dan tujuan belajar.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9CDB0]" />Informasi kelas</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#A9CDB0]" />Jadwal & frekuensi</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#A9CDB0]" />Tujuan belajar</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A9CDB0]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target pertama mengikuti Can-do resmi. Target terakhir merupakan latihan penguatan Fude.</p>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kelas dan kegiatan belajar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata tentang jadwal kelas, ruang belajar, guru, pendaftaran, dan frekuensi kegiatan.</p>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Mencari informasi kelas dan mendaftar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan cara membaca jadwal, bertanya kepada petugas, membicarakan kelas bahasa, dan menjelaskan tujuan belajar.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Membaca jadwal kelas komunitas" speakers={[speakers.yui, speakers.sota]} utterances={classScheduleConversation} />
          <IrodoriConversation title="Bertanya kepada petugas pusat komunitas" speakers={[speakers.akiko, speakers.kenji]} utterances={askingAtCommunityCenterConversation} />
          <IrodoriConversation title="Membicarakan kelas bahasa Jepang" speakers={[speakers.sota, speakers.yui]} utterances={talkingAboutJapaneseClassConversation} />
          <IrodoriConversation title="Menjelaskan pengalaman dan tujuan" speakers={[speakers.kenji, speakers.akiko]} utterances={sharingLearningGoalsConversation} />
          <IrodoriConversation title="Memastikan informasi kelas" speakers={[speakers.yui, speakers.sota]} utterances={clarifyingClassDetailsConversation} />
        </div>
      </section>


      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">PILIHAN KELAS KOMUNITAS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membaca jadwal dan tempat kegiatan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan nama kelas, hari, jam, lokasi, dan tingkat peserta.</p></div>
        <div className="grid gap-3 md:grid-cols-3">{classOptions.map((item)=>(<article key={item.id} className="rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="font-mincho text-base font-bold text-[#F1EBDD]">{item.title}</p><p className="mt-1 text-[10px] text-[#A9CDB0]">{item.subtitle}</p><p className="mt-3 rounded-lg border border-[#8EAE93]/20 bg-[#202720] p-3 text-xs font-semibold text-[#CFE4D2]">{item.schedule}</p><dl className="mt-3 space-y-2 text-[10px]"><div className="flex justify-between gap-3"><dt className="text-[#817A73]">Tempat</dt><dd className="text-right text-[#C8C2B8]">{item.place}</dd></div><div className="flex justify-between gap-3"><dt className="text-[#817A73]">Tingkat</dt><dd className="text-right text-[#C8C2B8]">{item.level}</dd></div><div className="flex justify-between gap-3"><dt className="text-[#817A73]">Frekuensi</dt><dd className="text-right text-[#C8C2B8]">{item.time}</dd></div></dl><p className="mt-3 border-t border-white/[0.06] pt-3 text-[10px] leading-5 text-[#A9A398]">{item.summary}</p></article>))}</div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">PENGALAMAN & TUJUAN BELAJAR</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Siapkan jawaban saat mendaftar kelas</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Saat ingin mengikuti kelas, kamu mungkin ditanya tentang pengalaman dan tujuan belajar.</p></div>
        <div className="grid gap-3 sm:grid-cols-2"><article className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">EXPERIENCE · 経験</p><p className="mt-2 font-mincho text-base text-[#F1EBDD]">高校のとき、少し勉強しました。</p><p className="mt-1 text-xs text-[#A9A398]">Waktu SMA, saya belajar sedikit.</p><p className="mt-3 font-mincho text-sm text-[#CFE4D2]">大学のとき、日本語を勉強しました。</p><p className="text-[10px] text-[#A9A398]">Waktu kuliah, saya belajar bahasa Jepang.</p></article><article className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">GOAL · 目標</p><p className="mt-2 font-mincho text-base text-[#F1EBDD]">日本語で友だちと話したいです。</p><p className="mt-1 text-xs text-[#A9A398]">Saya ingin berbicara dengan teman dalam bahasa Jepang.</p><p className="mt-3 font-mincho text-sm text-[#CFE4D2]">会話が上手になりたいです。</p><p className="text-[10px] text-[#A9A398]">Saya ingin lebih mahir bercakap-cakap.</p></article></div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima pola untuk mengikuti kegiatan dan kelas</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pola untuk mengatakan ingin mencoba, menanyakan frekuensi, menawarkan bantuan, meminta penjelasan, dan membicarakan waktu.</p></div>
        {[
          {title:"01 · Menyampaikan keinginan mencoba",pattern:"V-て + みたいんですが…",example:<>書道教室に参加してみたいんですが。</>,note:"V-てみたい menyatakan ingin mencoba melakukan sesuatu. Bentuk ini dapat diikuti んですが untuk membuka pertanyaan dengan halus."},
          {title:"02 · Menyatakan frekuensi kegiatan",pattern:"[periode waktu] (に) ～回",example:<>日本語クラスは週に1回です。／ 月に2回、書道を習います。</>,note:"Gunakan 週に atau 月に, lalu jumlah kali + 回. Contoh: 週に1回 (sekali seminggu), 月に2回 (dua kali sebulan)."},
          {title:"03 · Menawarkan bantuan",pattern:"V-ましょうか？",example:<>教室のチラシを持って来ましょうか。</>,note:"V-ましょうか dapat digunakan untuk menawarkan bantuan. Contoh: 持って来ます → 持って来ましょうか (Mau saya bawakan?)."},
          {title:"04 · Meminta penjelasan ulang",pattern:"～は、どういう意味ですか？",example:<>「初級」は、どういう意味ですか。／ もう一度お願いします。</>,note:"どういう意味ですか digunakan untuk menanyakan arti kata atau istilah. もう一度お願いします berarti Tolong sekali lagi."},
          {title:"05 · Membicarakan waktu atau keadaan",pattern:"N のとき ／ ナA-なとき ／ イA-いとき",example:<>高校のとき、少し日本語を勉強しました。／ 暇なとき、本を読みます。</>,note:"とき berarti saat atau ketika. Kata benda memakai のとき, kata sifat な memakai なとき, dan kata sifat い langsung diikuti とき."},
        ].map((item)=>(<article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#8EAE93]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p><p className="mt-2 font-mincho text-base leading-7 text-[#A9CDB0]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>))}
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">PAPAN INFORMASI KELAS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Temukan informasi penting pada pengumuman</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Contoh pengumuman latihan. Cari informasi nama kelas, waktu, tempat, dan hal yang perlu disiapkan.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-[#6E9A75]/25 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">お知らせ · INFORMASI KELAS</p><h3 className="mt-2 font-mincho text-base font-bold text-[#F1EBDD]">日本語入門クラス</h3><p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">毎週火曜日と木曜日<br/>午前10時から11時半まで<br/>市民センター 2階</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">Setiap Selasa dan Kamis, pukul 10.00–11.30 pagi, di lantai dua pusat komunitas.</p></article>
          <article className="rounded-2xl border border-[#6E9A75]/25 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">持ち物 · YANG PERLU DIBAWA</p><h3 className="mt-2 font-mincho text-base font-bold text-[#F1EBDD]">用意するもの</h3><p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">教科書、ノート、えんぴつ</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">Buku pelajaran, buku catatan, dan pensil.</p></article>
          <article className="rounded-2xl border border-[#6E9A75]/25 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">申し込み · PENDAFTARAN</p><h3 className="mt-2 font-mincho text-base font-bold text-[#F1EBDD]">参加したい人</h3><p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">市民センターの受付で申し込んでください。</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">Peserta dapat mendaftar di meja penerimaan pusat komunitas.</p></article>
          <article className="rounded-2xl border border-[#6E9A75]/25 bg-[#1B201C]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">質問 · PERTANYAAN</p><h3 className="mt-2 font-mincho text-base font-bold text-[#F1EBDD]">わからないとき</h3><p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">わからないことがあるときは、先生に聞いてください。</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">Jika ada hal yang belum dipahami, tanyakan kepada guru.</p></article>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KANJI DAN KATA PENTING</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali tulisan tentang jadwal dan kelas</h2>
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
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9CDB0]">CAN-DO CHECK</p>
        </div>
        <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. Progres Elementary 1 tersimpan dalam jalur Irodori, terpisah dari Minna no Nihongo dan JLPT.</p>
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
            Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian Can-do.
          </p>
        )}
      </section>

      <p className="text-center text-[10px] leading-5 text-[#746F65]">
        Dialog, tokoh, pengumuman, dan situasi latihan dibuat orisinal oleh Fude untuk melatih komunikasi seputar kelas komunitas dan tujuan belajar bahasa Jepang.
      </p>
    </main>
  );
}
