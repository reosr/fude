"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Gift,
  RefreshCw,
  Star,
  Users,
  Sparkles,
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
const lessonId = "elementary2-09";

const explainComingOfAgeConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>成人の日は、何をするんですか。</>,
    romaji: "Seijin no Hi wa, nani o surun desu ka?",
    translation: "Apa yang dilakukan pada Hari Kedewasaan?",
    audioFileName: "irodori-elementary2-09-a01-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>大人になる人をお祝いする日です。地域で式が行われることがあります。</>,
    romaji: "Otona ni naru hito o oiwai suru hi desu. Chiiki de shiki ga okonawareru koto ga arimasu.",
    translation: "Itu hari untuk merayakan orang yang memasuki masa dewasa. Di daerah setempat, upacara dapat diadakan.",
    audioFileName: "irodori-elementary2-09-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>式では、どんなことをするんですか。</>,
    romaji: "Shiki de wa, donna koto o surun desu ka?",
    translation: "Apa yang dilakukan dalam upacara itu?",
    audioFileName: "irodori-elementary2-09-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>お祝いの話を聞いたり、友だちと写真を撮ったりします。</>,
    romaji: "Oiwai no hanashi o kiitari, tomodachi to shashin o tottari shimasu.",
    translation: "Orang-orang mendengarkan sambutan dan berfoto bersama teman.",
    audioFileName: "irodori-elementary2-09-a01-l04.mp3",
  },
];

const talkNewYearHolidayConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>お正月休みは、どうでしたか。</>,
    romaji: "Oshougatsu yasumi wa, dou deshita ka?",
    translation: "Bagaimana liburan Tahun Barumu?",
    audioFileName: "irodori-elementary2-09-a02-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>家族と親戚の家に行きました。二日だけでしたが、楽しかったです。</>,
    romaji: "Kazoku to shinseki no ie ni ikimashita. Futsuka dake deshita ga, tanoshikatta desu.",
    translation: "Saya pergi ke rumah kerabat bersama keluarga. Hanya dua hari, tetapi menyenangkan.",
    audioFileName: "irodori-elementary2-09-a02-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>何をしましたか。</>,
    romaji: "Nani o shimashita ka?",
    translation: "Apa yang kamu lakukan?",
    audioFileName: "irodori-elementary2-09-a02-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>みんなで料理を食べたり、昔の写真を見たりして、ゆっくり過ごしました。</>,
    romaji: "Minna de ryouri o tabetari, mukashi no shashin o mitari shite, yukkuri sugoshimashita.",
    translation: "Kami makan bersama dan melihat foto-foto lama, lalu menghabiskan waktu dengan santai.",
    audioFileName: "irodori-elementary2-09-a02-l04.mp3",
  },
];

const introduceHomeCountryEventConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>インドネシアには、どんな年中行事がありますか。</>,
    romaji: "Indoneshia ni wa, donna nenjuu gyouji ga arimasu ka?",
    translation: "Apa saja perayaan tahunan di Indonesia?",
    audioFileName: "irodori-elementary2-09-a03-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>独立記念日があります。毎年、八月十七日です。</>,
    romaji: "Dokuritsu kinenbi ga arimasu. Maitoshi, hachigatsu juunananoka desu.",
    translation: "Ada Hari Kemerdekaan. Setiap tahun, tanggal 17 Agustus.",
    audioFileName: "irodori-elementary2-09-a03-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>どんなことをするんですか。</>,
    romaji: "Donna koto o surun desu ka?",
    translation: "Kegiatan apa yang dilakukan?",
    audioFileName: "irodori-elementary2-09-a03-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>地域によって違いますが、飾りを作ったり、ゲームをしたりします。</>,
    romaji: "Chiiki ni yotte chigaimasu ga, kazari o tsukuttari, geemu o shitari shimasu.",
    translation: "Berbeda-beda menurut daerah, tetapi orang-orang membuat hiasan dan bermain permainan bersama.",
    audioFileName: "irodori-elementary2-09-a03-l04.mp3",
  },
];

const readLocalEventArticleConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>町の文化フェスティバルの記事を読みましたか。</>,
    romaji: "Machi no bunka fesutibaru no kiji o yomimashita ka?",
    translation: "Apakah kamu sudah membaca artikel tentang festival budaya kota?",
    audioFileName: "irodori-elementary2-09-a04-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>はい。音楽やダンスの発表があったそうです。</>,
    romaji: "Hai. Ongaku ya dansu no happyou ga atta sou desu.",
    translation: "Ya. Katanya ada pertunjukan musik dan tari.",
    audioFileName: "irodori-elementary2-09-a04-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>参加した人は、何をしたんですか。</>,
    romaji: "Sanka shita hito wa, nani o shitan desu ka?",
    translation: "Apa yang dilakukan oleh orang-orang yang ikut?",
    audioFileName: "irodori-elementary2-09-a04-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>音楽を聞いたり、地域の料理を紹介したりして、楽しんだそうです。</>,
    romaji: "Ongaku o kiitari, chiiki no ryouri o shoukai shitari shite, tanoshinda sou desu.",
    translation: "Katanya mereka menikmati acara dengan mendengarkan musik dan memperkenalkan makanan daerah.",
    audioFileName: "irodori-elementary2-09-a04-l04.mp3",
  },
];

const sendNewYearGreetingConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>新年のメッセージを書きましたか。</>,
    romaji: "Shinnen no messeeji o kakimashita ka?",
    translation: "Apakah kamu sudah menulis pesan Tahun Baru?",
    audioFileName: "irodori-elementary2-09-a05-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。友だちと先生に送りました。</>,
    romaji: "Hai. Tomodachi to sensei ni okurimashita.",
    translation: "Ya. Saya mengirimkannya kepada teman dan guru.",
    audioFileName: "irodori-elementary2-09-a05-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>どんなあいさつを書きましたか。</>,
    romaji: "Donna aisatsu o kakimashita ka?",
    translation: "Ucapan seperti apa yang kamu tulis?",
    audioFileName: "irodori-elementary2-09-a05-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>「あけましておめでとうございます。今年もよろしくお願いします」と書きました。</>,
    romaji: "Akemashite omedetou gozaimasu. Kotoshi mo yoroshiku onegaishimasu to kakimashita.",
    translation: "Saya menulis, “Selamat Tahun Baru. Mohon kerja samanya juga tahun ini.”",
    audioFileName: "irodori-elementary2-09-a05-l04.mp3",
  },
];

const canDos = [
  {
    id: "understand-japanese-annual-events",
    source: "CAN-DO 38",
    text: "Mendengarkan dan memahami kegiatan yang dilakukan serta makanan yang disajikan pada perayaan tahunan di Jepang.",
  },
  {
    id: "talk-about-new-year-holiday",
    source: "CAN-DO 39",
    text: "Menceritakan secara sederhana kegiatan selama liburan, seperti libur Tahun Baru, serta kesan tentang liburan tersebut.",
  },
  {
    id: "introduce-home-country-festival",
    source: "CAN-DO 40",
    text: "Memperkenalkan secara sederhana festival atau perayaan yang ada di negara sendiri.",
  },
  {
    id: "read-local-event-article",
    source: "CAN-DO 41",
    text: "Membaca artikel tentang acara lokal yang pernah diikuti dan memahami garis besar isinya.",
  },
  {
    id: "write-new-year-greeting",
    source: "CAN-DO 42",
    text: "Menulis dan mengirim ucapan Tahun Baru yang sederhana.",
  },
];

const vocabRows = [
  ["今年", "ことし · kotoshi", "Tahun ini"],
  ["昨年", "さくねん · sakunen", "Tahun lalu"],
  ["毎年", "まいとし · maitoshi", "Setiap tahun"],
  ["年末", "ねんまつ · nenmatsu", "Akhir tahun"],
  ["年始", "ねんし · nenshi", "Awal tahun"],
  ["正月", "しょうがつ · shougatsu", "Tahun Baru Jepang"],
  ["お正月休み", "おしょうがつやすみ · oshougatsu yasumi", "Libur Tahun Baru"],
  ["成人の日", "せいじんのひ · seijin no hi", "Hari Kedewasaan"],
  ["成人式", "せいじんしき · seijinshiki", "Upacara kedewasaan"],
  ["成人", "せいじん · seijin", "Orang dewasa"],
  ["大人", "おとな · otona", "Orang dewasa"],
  ["式", "しき · shiki", "Upacara atau seremoni"],
  ["文化", "ぶんか · bunka", "Budaya"],
  ["祭り", "まつり · matsuri", "Festival"],
  ["行事", "ぎょうじ · gyouji", "Acara atau kegiatan khusus"],
  ["年中行事", "ねんちゅうぎょうじ · nenchuu gyouji", "Perayaan tahunan"],
  ["お祝い", "おいわい · oiwai", "Perayaan atau ucapan selamat"],
  ["祝う", "いわう · iwau", "Merayakan"],
  ["家族", "かぞく · kazoku", "Keluarga"],
  ["親戚", "しんせき · shinseki", "Kerabat"],
  ["実家", "じっか · jikka", "Rumah orang tua atau kampung halaman"],
  ["田舎", "いなか · inaka", "Daerah asal atau pedesaan"],
  ["帰る", "かえる · kaeru", "Pulang"],
  ["集まる", "あつまる · atsumaru", "Berkumpul"],
  ["お年玉", "おとしだま · otoshidama", "Hadiah uang Tahun Baru untuk anak-anak"],
  ["甥", "おい · oi", "Keponakan laki-laki"],
  ["姪", "めい · mei", "Keponakan perempuan"],
  ["料理", "りょうり · ryouri", "Masakan atau hidangan"],
  ["特別", "とくべつ · tokubetsu", "Khusus atau istimewa"],
  ["おせち料理", "おせちりょうり · osechi ryouri", "Hidangan tradisional Tahun Baru"],
  ["もち", "もち · mochi", "Kue beras Jepang"],
  ["雑煮", "ぞうに · zouni", "Sup Tahun Baru berisi mochi"],
  ["初詣", "はつもうで · hatsumoude", "Kunjungan pertama ke tempat ibadah pada Tahun Baru"],
  ["願い事", "ねがいごと · negaigoto", "Harapan atau permohonan"],
  ["年賀状", "ねんがじょう · nengajou", "Kartu ucapan Tahun Baru"],
  ["新年", "しんねん · shinnen", "Tahun Baru"],
  ["あいさつ", "あいさつ · aisatsu", "Salam atau ucapan"],
  ["あけましておめでとうございます", "あけましておめでとうございます · akemashite omedetou gozaimasu", "Selamat Tahun Baru"],
  ["今年もよろしくお願いします", "ことしもよろしくおねがいします · kotoshi mo yoroshiku onegaishimasu", "Mohon kerja samanya juga tahun ini"],
  ["春節", "しゅんせつ · shunsetsu", "Tahun Baru Imlek"],
  ["ソンクラーン", "ソンクラーン · sonkuraan", "Songkran, perayaan Tahun Baru Thailand"],
  ["独立記念日", "どくりつきねんび · dokuritsu kinenbi", "Hari Kemerdekaan"],
  ["地域", "ちいき · chiiki", "Wilayah atau lingkungan"],
  ["イベント", "イベント · ibento", "Acara"],
  ["参加する", "さんかする · sanka suru", "Berpartisipasi atau ikut"],
  ["準備する", "じゅんびする · junbi suru", "Mempersiapkan"],
  ["飾り", "かざり · kazari", "Hiasan"],
  ["踊る", "おどる · odoru", "Menari"],
  ["歌う", "うたう · utau", "Bernyanyi"],
  ["思い出", "おもいで · omoide", "Kenangan"],
];

const kanjiWords = [
  ["今年", "ことし · kotoshi", "Tahun ini"],
  ["昨年", "さくねん · sakunen", "Tahun lalu"],
  ["毎年", "まいとし · maitoshi", "Setiap tahun"],
  ["文化", "ぶんか · bunka", "Budaya"],
  ["祭り", "まつり · matsuri", "Festival"],
  ["正月", "しょうがつ · shougatsu", "Tahun Baru Jepang"],
  ["式", "しき · shiki", "Upacara atau seremoni"],
  ["大人", "おとな · otona", "Orang dewasa"],
  ["米", "こめ · kome", "Beras"],
  ["特別", "とくべつ · tokubetsu", "Khusus atau istimewa"],
];

const japaneseAnnualEvents = [
  {
    title: "お正月 · Tahun Baru",
    date: "1月1日",
    activities: "家族と過ごしたり、特別な料理を食べたりします。",
    translation: "Menghabiskan waktu bersama keluarga dan menikmati hidangan khusus.",
  },
  {
    title: "成人の日 · Hari Kedewasaan",
    date: "1月の第2月曜日",
    activities: "地域で式が行われたり、友だちと写真を撮ったりします。",
    translation: "Upacara dapat diadakan di daerah setempat dan teman-teman berfoto bersama.",
  },
  {
    title: "ひな祭り · Festival Hinamatsuri",
    date: "3月3日",
    activities: "ひな人形を飾ったり、特別な料理を食べたりします。",
    translation: "Orang-orang memasang boneka hina dan menikmati hidangan khusus.",
  },
  {
    title: "こどもの日 · Hari Anak",
    date: "5月5日",
    activities: "こいのぼりを飾ったり、家族で過ごしたりします。",
    translation: "Orang-orang memasang hiasan ikan koi dan menghabiskan waktu bersama keluarga.",
  },
];

const eventArticle = {
  title: "春の町文化フェスティバル",
  date: "5月10日",
  venue: "町の中央広場",
  body: "先週、町の中央広場で春の文化フェスティバルが開かれました。会場では、地域の音楽グループが演奏したり、学生が絵を展示したりしました。食べ物のコーナーでは、町の特別な料理も紹介されました。家族や友だちと来た人が多く、会場はとてもにぎやかでした。私は友だちと音楽を聞きながら、いろいろな展示を見ました。初めて参加しましたが、とてもいい思い出になりました。",
  reading: "Senshuu, machi no chuou hiroba de haru no bunka fesutibaru ga hirakaremashita. Kaijou de wa, chiiki no ongaku guruupu ga ensou shitari, gakusei ga e o tenji shitari shimashita. Tabemono no koonaa de wa, machi no tokubetsu na ryouri mo shoukai saremashita. Kazoku ya tomodachi to kita hito ga ooku, kaijou wa totemo nigiyaka deshita. Watashi wa tomodachi to ongaku o kikinagara, iroiro na tenji o mimashita. Hajimete sanka shimashita ga, totemo ii omoide ni narimashita.",
  translation: "Minggu lalu, festival budaya musim semi diadakan di alun-alun pusat kota. Grup musik daerah tampil dan para pelajar memamerkan lukisan. Di area makanan, hidangan khas kota juga diperkenalkan. Banyak orang datang bersama keluarga atau teman sehingga tempat acara sangat ramai. Saya melihat berbagai pameran sambil mendengarkan musik bersama teman. Ini pertama kalinya saya ikut, dan menjadi kenangan yang sangat baik.",
};

const newYearMessageExamples = [
  {
    label: "Untuk teman",
    japanese: "あけましておめでとう！今年もいっしょに楽しいことをしようね。",
    meaning: "Selamat Tahun Baru! Mari melakukan hal-hal menyenangkan bersama lagi tahun ini.",
  },
  {
    label: "Untuk guru atau orang yang dihormati",
    japanese: "あけましておめでとうございます。今年もよろしくお願いいたします。",
    meaning: "Selamat Tahun Baru. Mohon bimbingan dan kerja samanya kembali tahun ini.",
  },
  {
    label: "Pesan singkat",
    japanese: "今年も元気で楽しい一年になりますように。",
    meaning: "Semoga tahun ini menjadi tahun yang sehat dan menyenangkan.",
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
    title: "01 · Memahami perayaan Jepang",
    heading: "Mengenali kegiatan pada Hari Kedewasaan",
    prompt: "Kamu mendengar bahwa pada Hari Kedewasaan orang menghadiri upacara dan bertemu teman. Kegiatan mana yang sesuai dengan penjelasan itu?",
    japanese: <>式に出たり、友だちと写真を撮ったりします。</>,
    translation: "Menghadiri upacara dan berfoto bersama teman.",
    options: [
      { key: "a", label: "Menghadiri upacara dan berfoto bersama teman.", meaning: "Kedua kegiatan sesuai dengan penjelasan tentang perayaan tersebut." },
      { key: "b", label: "Mengikuti kelas setiap hari.", meaning: "Kegiatan ini tidak disebutkan dalam penjelasan." },
      { key: "c", label: "Berangkat untuk perjalanan kerja.", meaning: "Penjelasan tidak membahas perjalanan kerja." },
    ],
    answer: "a",
    explanation: "Kata 式 berarti upacara, sedangkan 写真を撮る berarti mengambil foto.",
  },
  {
    title: "02 · Menceritakan liburan",
    heading: "Menyebut contoh kegiatan selama liburan",
    prompt: "Kamu mengunjungi kerabat dan menikmati hidangan bersama keluarga. Pilih kalimat yang paling sesuai.",
    japanese: <>親戚の家に行ったり、家族と料理を食べたりして、楽しかったです。</>,
    translation: "Saya pergi ke rumah kerabat dan menikmati hidangan bersama keluarga. Menyenangkan.",
    options: [
      { key: "a", label: "親戚の家に行くつもりです。", meaning: "Kalimat ini menyatakan rencana, bukan pengalaman liburan yang sudah dilakukan." },
      { key: "b", label: "親戚の家に行ったり、家族と料理を食べたりして、楽しかったです。", meaning: "V-たりして menyebut contoh kegiatan yang dilakukan." },
      { key: "c", label: "親戚の家に行かなくちゃなりません。", meaning: "Kalimat ini menyatakan keharusan." },
    ],
    answer: "b",
    explanation: "V-たりして digunakan untuk menyebut contoh kegiatan, lalu menambahkan kesan.",
  },
  {
    title: "03 · Memperkenalkan perayaan",
    heading: "Menjelaskan perbedaan menurut wilayah",
    prompt: "Kegiatan perayaan berbeda-beda menurut daerah. Pilih ungkapan yang tepat.",
    japanese: <>地域によって、祭りの内容が違います。</>,
    translation: "Isi festival berbeda menurut daerah.",
    options: [
      { key: "a", label: "地域しか、祭りの内容が違います。", meaning: "しか tidak digunakan untuk membandingkan perbedaan berdasarkan wilayah." },
      { key: "b", label: "地域だけ、祭りの内容が違います。", meaning: "だけ membatasi kata benda, bukan menyatakan variasi menurut wilayah." },
      { key: "c", label: "地域によって、祭りの内容が違います。", meaning: "Nによって menyatakan bahwa sesuatu berbeda bergantung pada N." },
    ],
    answer: "c",
    explanation: "Nによって digunakan untuk menjelaskan variasi berdasarkan wilayah, orang, atau keadaan.",
  },
  {
    title: "04 · Membaca artikel acara",
    heading: "Menemukan kegiatan yang dilakukan",
    prompt: "Artikel menyebutkan bahwa grup musik tampil dan pelajar memamerkan lukisan. Informasi mana yang benar?",
    japanese: <>音楽グループが演奏したり、学生が絵を展示したりしました。</>,
    translation: "Grup musik tampil dan pelajar memamerkan lukisan.",
    options: [
      { key: "a", label: "Acara hanya berisi perlombaan olahraga.", meaning: "Artikel tidak menyebut perlombaan olahraga." },
      { key: "b", label: "Ada penampilan musik dan pameran lukisan pelajar.", meaning: "Kedua kegiatan disebutkan langsung dalam artikel." },
      { key: "c", label: "Acara dibatalkan karena cuaca.", meaning: "Artikel menyatakan festival berlangsung." },
    ],
    answer: "b",
    explanation: "Saat membaca artikel, cari siapa yang melakukan kegiatan dan apa kegiatannya.",
  },
  {
    title: "05 · Menulis ucapan Tahun Baru",
    heading: "Memilih salam yang sesuai",
    prompt: "Kamu ingin mengirim ucapan Tahun Baru yang sopan kepada guru. Pilih pesan yang tepat.",
    japanese: <>あけましておめでとうございます。今年もよろしくお願いいたします。</>,
    translation: "Selamat Tahun Baru. Mohon bimbingan dan kerja samanya kembali tahun ini.",
    options: [
      { key: "a", label: "あけましておめでとう！またね。", meaning: "Ini ucapan yang lebih santai untuk teman dekat." },
      { key: "b", label: "今年は去年です。", meaning: "Susunan kalimat ini tidak membentuk ucapan Tahun Baru." },
      { key: "c", label: "あけましておめでとうございます。今年もよろしくお願いいたします。", meaning: "Ungkapan ini sopan dan sesuai untuk guru." },
    ],
    answer: "c",
    explanation: "Untuk guru atau orang yang dihormati, gunakan bentuk sopan ございます dan お願いいたします.",
  },
];

const practiceTasks: Task[] = [
  {
    prompt: <>Apa arti 「毎年」?</>,
    options: [
      { key: "a", label: "Tahun lalu." },
      { key: "b", label: "Setiap tahun." },
      { key: "c", label: "Tahun depan." },
    ],
    answer: "b",
    explanation: <>毎年（まいとし）berarti setiap tahun.</>,
  },
  {
    prompt: <>Pilih bentuk yang tepat: 「休みは二日＿＿＿ありませんでした。」 untuk menyatakan hanya dua hari.</>,
    options: [
      { key: "a", label: "しか." },
      { key: "b", label: "だけ." },
      { key: "c", label: "によって." },
    ],
    answer: "a",
    explanation: <>Nしか harus digunakan bersama kalimat negatif: 二日しかありませんでした.</>,
  },
  {
    prompt: <>Apa fungsi 「だけ」 dalam kalimat 「今年は一日だけ帰りました」?</>,
    options: [
      { key: "a", label: "Menyatakan sebab." },
      { key: "b", label: "Menyatakan keharusan." },
      { key: "c", label: "Membatasi jumlah atau cakupan." },
    ],
    answer: "c",
    explanation: <>一日だけ berarti hanya satu hari. だけ tidak memerlukan bentuk negatif.</>,
  },
  {
    prompt: <>Pilih arti 「準備しなくちゃなりません」.</>,
    options: [
      { key: "a", label: "Tidak perlu menyiapkan." },
      { key: "b", label: "Harus menyiapkan." },
      { key: "c", label: "Sudah selesai menyiapkan." },
    ],
    answer: "b",
    explanation: <>V-なくちゃならない menyatakan sesuatu yang harus dilakukan.</>,
  },
  {
    prompt: <>Pilih bentuk potensial percakapan dari 「見る」 yang digunakan dalam materi.</>,
    options: [
      { key: "a", label: "見れます." },
      { key: "b", label: "見ます." },
      { key: "c", label: "見ました." },
    ],
    answer: "a",
    explanation: <>見れます adalah bentuk ら抜き yang umum dalam percakapan. Bentuk standar untuk tulisan formal adalah 見られます.</>,
  },
  {
    prompt: <>Apa arti 「音楽を聞きながら、写真を見ます」?</>,
    options: [
      { key: "a", label: "Setelah mendengarkan musik, baru melihat foto." },
      { key: "b", label: "Tidak mendengarkan musik dan tidak melihat foto." },
      { key: "c", label: "Melihat foto sambil mendengarkan musik." },
    ],
    answer: "c",
    explanation: <>V-ながら menyatakan dua kegiatan yang dilakukan bersamaan oleh subjek yang sama.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa arti 「成人の日」?</>,
    options: [
      { key: "a", label: "Hari Kedewasaan." },
      { key: "b", label: "Hari Anak." },
      { key: "c", label: "Hari Tahun Baru." },
    ],
    answer: "a",
    explanation: <>成人の日 adalah hari libur nasional di Jepang yang berkaitan dengan perayaan memasuki masa dewasa.</>,
  },
  {
    prompt: <>Apa fungsi 「～んですか？」 dalam 「何をするんですか？」?</>,
    options: [
      { key: "a", label: "Memerintah seseorang." },
      { key: "b", label: "Meminta penjelasan lebih lanjut tentang sesuatu." },
      { key: "c", label: "Menyatakan jumlah yang sedikit." },
    ],
    answer: "b",
    explanation: <>～んですか digunakan untuk meminta penjelasan lebih rinci tentang hal yang belum dipahami.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Saya hanya punya satu kartu”.</>,
    options: [
      { key: "a", label: "カードだけあります。" },
      { key: "b", label: "カードによってあります。" },
      { key: "c", label: "カードが一枚しかありません。" },
    ],
    answer: "c",
    explanation: <>しか digunakan bersama kalimat negatif untuk menekankan keterbatasan.</>,
  },
  {
    prompt: <>Kalimat 「友だちと写真を撮ったりして、楽しかったです」 berarti apa?</>,
    options: [
      { key: "a", label: "Saya bersenang-senang dengan melakukan hal seperti berfoto bersama teman." },
      { key: "b", label: "Saya wajib berfoto bersama teman." },
      { key: "c", label: "Saya belum pernah berfoto dengan teman." },
    ],
    answer: "a",
    explanation: <>V-たりして menyebut satu atau beberapa contoh kegiatan yang dilakukan.</>,
  },
  {
    prompt: <>Apa arti 「毎年、祭りに参加する人が多いです」?</>,
    options: [
      { key: "a", label: "Setiap tahun tidak ada yang ikut festival." },
      { key: "b", label: "Setiap tahun banyak orang ikut festival." },
      { key: "c", label: "Festival berubah setiap tahun." },
    ],
    answer: "b",
    explanation: <>S bentuk biasa + 人が多い berarti banyak orang yang melakukan tindakan tersebut.</>,
  },
  {
    prompt: <>Apa arti 「町を歩きながら、歌を歌います」?</>,
    options: [
      { key: "a", label: "Bernyanyi setelah selesai berjalan." },
      { key: "b", label: "Berjalan tanpa bernyanyi." },
      { key: "c", label: "Bernyanyi sambil berjalan di kota." },
    ],
    answer: "c",
    explanation: <>V-ながら berarti melakukan satu kegiatan sambil melakukan kegiatan lain.</>,
  },
  {
    prompt: <>Apa arti 「日にちによって違います」?</>,
    options: [
      { key: "a", label: "Berbeda menurut tanggal atau harinya." },
      { key: "b", label: "Selalu sama setiap tanggal." },
      { key: "c", label: "Tidak ada tanggalnya." },
    ],
    answer: "a",
    explanation: <>Nによって menyatakan bahwa sesuatu berbeda bergantung pada N.</>,
  },
  {
    prompt: <>Pilih bentuk standar yang lebih sesuai untuk tulisan formal dari bentuk percakapan 「食べれます」.</>,
    options: [
      { key: "a", label: "食べます." },
      { key: "b", label: "食べられます." },
      { key: "c", label: "食べました." },
    ],
    answer: "b",
    explanation: <>食べられます adalah bentuk potensial standar. 食べれます merupakan bentuk ら抜き yang lebih sering terdengar dalam percakapan.</>,
  },
  {
    prompt: <>Apa arti 「新年のあいさつ」?</>,
    options: [
      { key: "a", label: "Ucapan Tahun Baru." },
      { key: "b", label: "Jadwal liburan musim panas." },
      { key: "c", label: "Undangan ulang tahun." },
    ],
    answer: "a",
    explanation: <>新年 berarti Tahun Baru dan あいさつ berarti salam atau ucapan.</>,
  },
  {
    prompt: <>Apa informasi utama yang biasanya dicari dalam artikel acara lokal?</>,
    options: [
      { key: "a", label: "Nomor rahasia seluruh peserta." },
      { key: "b", label: "Tanggal, tempat, kegiatan, dan kesan acara." },
      { key: "c", label: "Daftar nilai ujian semua pengunjung." },
    ],
    answer: "b",
    explanation: <>Informasi pokok artikel acara dapat mencakup waktu, tempat, kegiatan, peserta, dan kesan penulis.</>,
  },
];

export default function IrodoriElementaryTwoLessonNinePage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [newYearDraft, setNewYearDraft] = useState("");

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
      <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#D79C72]/40 hover:text-[#EAE6DD]">
        <ArrowLeft size={15} /> Kembali ke Dasar 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#9A5E46]/35 bg-gradient-to-br from-[#452B2B] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#E2B08D]/[0.08]">正</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#E2B08D]">IRODORI • DASAR 2 A2 • PELAJARAN 09</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Apa yang dilakukan orang pada Hari Kedewasaan?</h1>
          <p className="mt-2 text-sm font-semibold text-[#E2B08D]">成人の日は、何をするんですか？</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar memahami perayaan tahunan Jepang, menceritakan liburan, memperkenalkan festival negara sendiri, membaca artikel acara, dan menulis ucapan Tahun Baru.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><CalendarDays size={14} className="text-[#E2B08D]" />Perayaan tahunan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#E2B08D]" />Keluarga dan komunitas</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Gift size={14} className="text-[#E2B08D]" />Ucapan Tahun Baru</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#9A5E46]/20 bg-[#302322]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#E2B08D]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Lima target berikut sesuai target komunikasi 38–42 pada Irodori Dasar 2 Lesson 9.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E2B08D]">{item.source} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#9A5E46]/20 bg-[#211A19] p-4 md:p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#E2B08D]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Catatan budaya: 成人の日</h2>
        </div>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Materi Irodori memberi contoh upacara untuk orang yang berusia 20 tahun. Di Jepang, usia dewasa menurut hukum berubah menjadi 18 tahun sejak 1 April 2022. Namun, banyak pemerintah daerah tetap mengadakan upacara lokal untuk orang yang berusia 20 tahun. Pelaksanaan dan format acara dapat berbeda menurut daerah.</p>
        <p className="mt-2 text-[10px] leading-5 text-[#887F74]">Di pelajaran ini, kita mempelajari bahasa dan kebiasaan budaya, bukan ketentuan hukum.</p>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E2B08D]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Memahami perayaan dan berbagi pengalaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Seluruh percakapan dibuat orisinal oleh Fude berdasarkan target komunikasi pelajaran ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Membicarakan Hari Kedewasaan" speakers={[friendYui, friendSota]} utterances={explainComingOfAgeConversation} />
          <IrodoriConversation title="Menceritakan libur Tahun Baru" speakers={[friendAkiko, friendKenji]} utterances={talkNewYearHolidayConversation} />
          <IrodoriConversation title="Memperkenalkan perayaan di Indonesia" speakers={[friendSota, friendYui]} utterances={introduceHomeCountryEventConversation} />
          <IrodoriConversation title="Membahas artikel acara lokal" speakers={[friendAkiko, friendKenji]} utterances={readLocalEventArticleConversation} />
          <IrodoriConversation title="Mengirim ucapan Tahun Baru" speakers={[friendYui, friendSota]} utterances={sendNewYearGreetingConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E2B08D]">PERAYAAN TAHUNAN JEPANG</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kegiatan yang dilakukan pada beberapa hari khusus</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Berikut contoh tradisi tahunan di Jepang. Kebiasaan dapat berbeda menurut keluarga dan daerah.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {japaneseAnnualEvents.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#9A5E46]/20 bg-[#211A19] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mincho text-base font-bold text-[#F1EBDD]">{item.title}</h3>
                <span className="rounded-lg bg-[#9A5E46]/15 px-2.5 py-1 text-[10px] font-semibold text-[#E2B08D]">{item.date}</span>
              </div>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.activities}</p>
              <p className="mt-1 text-xs leading-5 text-[#A9A398]">{item.translation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E2B08D]">MEMPERKENALKAN FESTIVAL</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Contoh perayaan dan kegiatan di Indonesia</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan informasi berikut sebagai contoh untuk menjelaskan kegiatan di negara sendiri. Detail acara dapat berbeda menurut daerah.</p>
        </div>
        <article className="rounded-2xl border border-[#9A5E46]/25 bg-[#211A19] p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E2B08D]">PERAYAAN TAHUNAN</p>
              <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">独立記念日 · Hari Kemerdekaan</h3>
            </div>
            <Star size={22} className="text-[#E2B08D]" />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg bg-black/15 p-3">
              <p className="text-[9px] text-[#A9A398]">Tanggal</p>
              <p className="mt-1 text-sm font-bold text-[#F1EBDD]">8月17日</p>
              <p className="text-[10px] text-[#A9A398]">17 Agustus</p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="text-[9px] text-[#A9A398]">Frekuensi</p>
              <p className="mt-1 text-sm font-bold text-[#F1EBDD]">毎年</p>
              <p className="text-[10px] text-[#A9A398]">Setiap tahun</p>
            </div>
            <div className="rounded-lg bg-black/15 p-3">
              <p className="text-[9px] text-[#A9A398]">Kegiatan</p>
              <p className="mt-1 text-sm font-bold text-[#F1EBDD]">地域によって違います</p>
              <p className="text-[10px] text-[#A9A398]">Berbeda menurut daerah</p>
            </div>
          </div>
          <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">地域によって違いますが、飾りを作ったり、ゲームをしたり、歌を歌ったりします。</p>
          <p className="mt-1 text-xs leading-5 text-[#A9A398]">Kegiatannya berbeda menurut daerah, tetapi dapat mencakup membuat hiasan, bermain permainan, dan bernyanyi bersama.</p>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E2B08D]">MEMBACA ARTIKEL ACARA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Festival budaya musim semi di kota</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Artikel ini fiktif dan dibuat sebagai latihan. Perhatikan waktu, tempat, kegiatan, dan kesan penulis.</p>
        </div>
        <article className="rounded-2xl border border-[#9A5E46]/25 bg-[#211A19] p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#9A5E46]/30 pb-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E2B08D]">ARTIKEL ACARA LOKAL</p>
              <h3 className="mt-1 text-sm font-bold text-[#F1EBDD]">{eventArticle.title}</h3>
            </div>
            <FileText size={21} className="text-[#E2B08D]" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-black/15 px-3 py-2 text-[10px] text-[#C9C3B8]">日時 · {eventArticle.date}</span>
            <span className="rounded-lg bg-black/15 px-3 py-2 text-[10px] text-[#C9C3B8]">場所 · {eventArticle.venue}</span>
          </div>
          <p className="mt-3 font-mincho text-sm leading-8 text-[#F1EBDD]">{eventArticle.body}</p>
          <p className="mt-3 border-t border-white/[0.07] pt-3 text-[10px] leading-6 text-[#E2B08D]">{eventArticle.reading}</p>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">{eventArticle.translation}</p>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E2B08D]">UCAPAN TAHUN BARU</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih salam sesuai dengan penerimanya</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Ucapan bisa berbeda menurut hubungan dengan penerima. Gunakan bentuk yang lebih sopan kepada guru atau orang yang dihormati.</p>
        </div>
        <div className="space-y-2">
          {newYearMessageExamples.map((item) => (
            <article key={item.label} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E2B08D]">{item.label}</p>
              <p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.japanese}</p>
              <p className="mt-1 text-xs text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#9A5E46]/20 bg-[#302322]/60 p-4 md:p-5">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E2B08D]">LATIHAN MENULIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tulis pesan Tahun Baru sederhana</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Tulis 1–3 kalimat untuk teman atau guru. Mulai dengan ucapan Tahun Baru, lalu tambahkan harapan atau salam untuk tahun ini.</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
          <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">あけましておめでとうございます。今年もよろしくお願いします。</p>
          <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">Selamat Tahun Baru. Mohon kerja samanya juga tahun ini.</p>
        </div>
        <label htmlFor="new-year-message-draft" className="block text-xs font-semibold text-[#E2B08D]">Tulis ucapan dalam bahasa Jepang</label>
        <textarea
          id="new-year-message-draft"
          value={newYearDraft}
          onChange={(event) => setNewYearDraft(event.target.value)}
          rows={4}
          placeholder="あけましておめでとうございます。"
          className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#E2B08D]/50"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] text-[#817A73]">Draf hanya digunakan untuk latihan di halaman ini.</p>
          <span className="text-[10px] tabular-nums text-[#E2B08D]">{newYearDraft.length} karakter</span>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E2B08D]">KOSAKATA PERAYAAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Hari khusus, keluarga, dan kebiasaan tahunan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kata-kata yang sering digunakan saat membahas liburan, tradisi, festival, dan ucapan Tahun Baru.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E2B08D]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E2B08D]">KANJI UTAMA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sepuluh kata kanji pada materi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenali bacaan dan makna kanji yang berhubungan dengan perayaan tahunan.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-[#9A5E46]/20 bg-[#211A19] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E2B08D]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E2B08D]">POLA TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sembilan pola untuk membicarakan perayaan dan pengalaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari pertanyaan untuk meminta penjelasan, pembatasan jumlah, contoh kegiatan, keharusan, bentuk potensial percakapan, dan variasi kebiasaan.</p>
        </div>
        {[
          {
            title: "01 · Meminta penjelasan lebih rinci",
            pattern: "～んですか？",
            example: <>成人の日は、何をするんですか。<br />この祭りでは、何を食べるんですか。</>,
            note: "Gunakan ～んですか untuk meminta penjelasan lebih lanjut tentang situasi atau hal yang belum dipahami. Bentuk ini terasa lebih seperti meminta keterangan daripada sekadar menanyakan fakta.",
          },
          {
            title: "02 · Membatasi jumlah atau cakupan dengan しか",
            pattern: "Nしか ＋ kalimat negatif",
            example: <>休みは二日しかありませんでした。<br />今年は一回しか行けませんでした。</>,
            note: "しか menekankan bahwa jumlah atau cakupannya terbatas dan harus diikuti kalimat negatif. Bandingkan: 二日しかありません (hanya ada dua hari).",
          },
          {
            title: "03 · Membatasi dengan だけ",
            pattern: "Nだけ",
            example: <>今年は一日だけ実家に帰りました。<br />特別な料理は一つだけ食べました。</>,
            note: "だけ berarti hanya dan membatasi kata benda atau jumlah. Berbeda dari しか, だけ tidak harus diikuti kalimat negatif dan tidak secara khusus mengekspresikan rasa kecewa.",
          },
          {
            title: "04 · Menyebut contoh kegiatan",
            pattern: "V-たりして、～",
            example: <>家族と写真を撮ったりして、楽しかったです。<br />料理を作ったりして、過ごしました。</>,
            note: "Bentuk V-たり digunakan untuk menyebut satu atau beberapa contoh kegiatan. Tidak harus menyebut semua hal yang dilakukan.",
          },
          {
            title: "05 · Menyatakan keharusan",
            pattern: "V-なくちゃならない",
            example: <>新年のカードを書かなくちゃなりません。<br />イベントの準備をしなくちゃなりません。</>,
            note: "Ubah bentuk nai kata kerja dengan mengganti ない menjadi なくちゃならない. Maknanya harus melakukan sesuatu. Bentuk ini lebih santai daripada ～なければなりません.",
          },
          {
            title: "06 · Bentuk potensial percakapan ら抜き",
            pattern: "V-れます（bentuk percakapan）",
            example: <>昔の写真が見れました。<br />特別な料理が食べれました。</>,
            note: "Dalam percakapan, bentuk potensial kata kerja golongan 2 kadang menghilangkan ら: 見られます → 見れます, 食べられます → 食べれます. Ini disebut ら抜き言葉. Untuk tulisan formal, gunakan bentuk standar 見られます dan 食べられます.",
          },
          {
            title: "07 · Menjelaskan orang yang melakukan sesuatu",
            pattern: "S (bentuk biasa) ＋ 人が～ ／ 人も～",
            example: <>毎年、祭りに参加する人が多いです。<br />休みに旅行する人もいます。</>,
            note: "Kalimat bentuk biasa sebelum 人 menjelaskan orang seperti apa yang dimaksud. 人が多い berarti banyak orang yang melakukan hal tersebut; 人もいます berarti ada juga orang yang melakukannya.",
          },
          {
            title: "08 · Melakukan dua kegiatan bersamaan",
            pattern: "V-ながら、～",
            example: <>音楽を聞きながら、料理を作ります。<br />友だちと話しながら、写真を見ました。</>,
            note: "Gunakan bentuk masu tanpa ます + ながら untuk menyatakan satu kegiatan dilakukan sambil melakukan kegiatan lain. Biasanya kedua tindakan dilakukan oleh subjek yang sama.",
          },
          {
            title: "09 · Menyatakan perbedaan berdasarkan sesuatu",
            pattern: "Nによって",
            example: <>祭りの日は、地域によって違います。<br />行事の内容は、年によって変わります。</>,
            note: "Nによって menyatakan bahwa sesuatu berbeda atau berubah bergantung pada wilayah, tahun, orang, atau keadaan tertentu.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#E2B08D]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#E2B08D]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E2B08D]">SIMULASI SITUASI</p>
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
              <p className="text-[9px] font-black tracking-[0.16em] text-[#E2B08D]">{task.title}</p>
              <h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#9A5E46]/20 bg-[#302322]/70 p-3">
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
                          ? "border-[#E2B08D]/60 bg-[#9A5E46]/15 text-[#F1EBDD]"
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
                  className="rounded-lg bg-[#9A5E46] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#7D4937] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
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
          <button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#9A5E46]/35 px-4 py-2 text-xs font-bold text-[#E2B08D]">
            <RefreshCw size={13} /> Ulangi simulasi
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E2B08D]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#E2B08D]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#E2B08D]/60 bg-[#9A5E46]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#9A5E46]/35 px-4 py-2 text-xs font-bold text-[#E2B08D]">
              <RefreshCw size={13} /> Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={Object.keys(practiceAnswers).length !== practiceTasks.length}
              className="rounded-lg bg-[#9A5E46] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E2B08D]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#E2B08D]">SOAL {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#E2B08D]/60 bg-[#9A5E46]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#9A5E46]/35 px-4 py-2 text-xs font-bold text-[#E2B08D]">
              <RefreshCw size={13} /> Ulangi kuis
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="rounded-lg bg-[#9A5E46] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa kuis
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#9A5E46]/20 bg-[#302322]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#E2B08D]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi target komunikasi</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">
          Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.
        </p>
        <div className="space-y-3">
          {canDos.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E2B08D]">{item.source}</p>
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
                        ? "border-[#E2B08D]/50 bg-[#9A5E46]/20 text-[#F8EEDC]"
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
              ? "Lesson 9 selesai. Progres tersimpan."
              : canDosRated
                ? "Semua target komunikasi sudah dinilai."
                : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button
            type="button"
            onClick={finishLesson}
            disabled={!canComplete || isCompleted}
            className="rounded-xl bg-[#9A5E46] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#7D4937] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
          >
            {isCompleted ? "Lesson 9 selesai" : "Selesaikan Lesson 9"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Dasar 2 · 09 / 18</span>
      </div>
    </main>
  );
}
