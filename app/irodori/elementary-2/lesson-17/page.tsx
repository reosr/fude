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
  Sparkles,
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
const friendYui = { ...speakers.yui, name: "Yui", role: "Teman" };
const friendSota = { ...speakers.sota, name: "Sota", role: "Teman" };
const friendAkiko = { ...speakers.akiko, name: "Akiko", role: "Teman" };
const friendKenji = { ...speakers.kenji, name: "Kenji", role: "Teman" };
const lessonId = "elementary2-17";

const talkAboutDailyChangesConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>日本での生活には、もう慣れましたか。</>, romaji: "Nihon de no seikatsu ni wa, mou naremashita ka?", translation: "Kamu sudah mulai terbiasa tinggal di Jepang?", audioFileName: "irodori-elementary2-17-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>はい。最初は駅の案内がよくわかりませんでしたが、今は簡単な案内なら聞き取れるようになりました。</>, romaji: "Hai. Saisho wa eki no annai ga yoku wakarimasen deshita ga, ima wa kantan na annai nara kikitoreru you ni narimashita.", translation: "Ya. Awalnya saya sulit memahami petunjuk di stasiun, tetapi sekarang saya sudah bisa memahami petunjuk sederhana.", audioFileName: "irodori-elementary2-17-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>それはよかったですね。休みの日は何をしていますか。</>, romaji: "Sore wa yokatta desu ne. Yasumi no hi wa nani o shite imasu ka?", translation: "Wah, bagus sekali. Biasanya kamu melakukan apa saat hari libur?", audioFileName: "irodori-elementary2-17-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>最近は友達と町を歩いたり、写真を撮ったりしています。</>, romaji: "Saikin wa tomodachi to machi o aruitari, shashin o tottari shite imasu.", translation: "Belakangan ini saya berjalan-jalan di kota dan mengambil foto bersama teman-teman.", audioFileName: "irodori-elementary2-17-a01-l04.mp3" },
];
const talkAboutWorkProgressConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>最近、仕事はどうですか。</>, romaji: "Saikin, shigoto wa dou desu ka?", translation: "Bagaimana pekerjaanmu belakangan ini?", audioFileName: "irodori-elementary2-17-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>最初は報告書の書き方が難しかったですが、今は一人でまとめられるようになりました。</>, romaji: "Saisho wa houkokusho no kakikata ga muzukashikatta desu ga, ima wa hitori de matomerareru you ni narimashita.", translation: "Awalnya cara menulis laporan sulit, tetapi sekarang saya sudah bisa menyusunnya sendiri.", audioFileName: "irodori-elementary2-17-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>それはすごいですね。何か困ったことはありませんか。</>, romaji: "Sore wa sugoi desu ne. Nanika komatta koto wa arimasen ka?", translation: "Hebat sekali. Apakah ada sesuatu yang masih menyulitkan?", audioFileName: "irodori-elementary2-17-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>わからない言葉があったら、同僚に質問するようにしています。</>, romaji: "Wakaranai kotoba ga attara, douryou ni shitsumon suru you ni shite imasu.", translation: "Kalau ada kata yang tidak saya pahami, saya membiasakan diri untuk bertanya kepada rekan kerja.", audioFileName: "irodori-elementary2-17-a02-l04.mp3" },
];
const talkAboutJapaneseProgressConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>日本語の勉強はどうですか。</>, romaji: "Nihongo no benkyou wa dou desu ka?", translation: "Bagaimana perkembangan belajarmu dalam bahasa Jepang?", audioFileName: "irodori-elementary2-17-a03-l01.mp3" },
  { speakerId: "akiko", japanese: <>前よりも、短いニュースならだいたい読めるようになりました。</>, romaji: "Mae yori mo, mijikai nyuusu nara daitai yomeru you ni narimashita.", translation: "Dibandingkan sebelumnya, sekarang saya sudah bisa membaca berita pendek dengan cukup baik.", audioFileName: "irodori-elementary2-17-a03-l02.mp3" },
  { speakerId: "yui", japanese: <>毎日、練習しているんですか。</>, romaji: "Mainichi, renshuu shite iru n desu ka?", translation: "Apakah kamu berlatih setiap hari?", audioFileName: "irodori-elementary2-17-a03-l03.mp3" },
  { speakerId: "akiko", japanese: <>はい。授業で習った言葉を、家でも使うようにしています。</>, romaji: "Hai. Jugyou de naratta kotoba o, ie demo tsukau you ni shite imasu.", translation: "Ya. Saya berusaha memakai kata-kata yang dipelajari di kelas saat di rumah juga.", audioFileName: "irodori-elementary2-17-a03-l04.mp3" },
];
const prepareTeacherUpdateConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>前に日本語を教えてくれた先生に、メッセージを送りたいんです。</>, romaji: "Mae ni nihongo o oshiete kureta sensei ni, messeeji o okuritai n desu.", translation: "Saya ingin mengirim pesan kepada guru yang dulu mengajar bahasa Jepang kepada saya.", audioFileName: "irodori-elementary2-17-a04-l01.mp3" },
  { speakerId: "sota", japanese: <>いいですね。最近の生活について書いたらどうですか。</>, romaji: "Ii desu ne. Saikin no seikatsu ni tsuite kaitara dou desu ka?", translation: "Ide bagus. Bagaimana kalau kamu menulis tentang kehidupanmu belakangan ini?", audioFileName: "irodori-elementary2-17-a04-l02.mp3" },
  { speakerId: "kenji", japanese: <>日本語で友達と話せるようになったことも伝えたいです。</>, romaji: "Nihongo de tomodachi to hanaseru you ni natta koto mo tsutaetai desu.", translation: "Saya juga ingin bercerita bahwa sekarang saya sudah bisa berbicara bahasa Jepang dengan teman-teman.", audioFileName: "irodori-elementary2-17-a04-l03.mp3" },
  { speakerId: "sota", japanese: <>最後に、教えてくれたことへの感謝も書くといいですよ。</>, romaji: "Saigo ni, oshiete kureta koto e no kansha mo kaku to ii desu yo.", translation: "Di bagian akhir, tulis juga ucapan terima kasih atas semua yang sudah diajarkan.", audioFileName: "irodori-elementary2-17-a04-l04.mp3" },
];
const shareLifeChangesConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>最近、生活で何か変わったことがありますか。</>, romaji: "Saikin, seikatsu de nanika kawatta koto ga arimasu ka?", translation: "Belakangan ini, ada perubahan dalam kehidupanmu?", audioFileName: "irodori-elementary2-17-a05-l01.mp3" },
  { speakerId: "yui", japanese: <>前は家で本を読むだけでしたが、今は友達と出かけるようになりました。</>, romaji: "Mae wa ie de hon o yomu dake deshita ga, ima wa tomodachi to dekakeru you ni narimashita.", translation: "Dulu saya hanya membaca buku di rumah, tetapi sekarang saya mulai pergi bersama teman-teman.", audioFileName: "irodori-elementary2-17-a05-l02.mp3" },
  { speakerId: "akiko", japanese: <>生活が楽しくなりましたね。</>, romaji: "Seikatsu ga tanoshiku narimashita ne.", translation: "Kehidupanmu jadi lebih menyenangkan, ya.", audioFileName: "irodori-elementary2-17-a05-l03.mp3" },
  { speakerId: "yui", japanese: <>はい。新しい友達も増えて、前ほど心配しなくなりました。</>, romaji: "Hai. Atarashii tomodachi mo fuete, mae hodo shinpai shinaku narimashita.", translation: "Ya. Teman saya bertambah, dan sekarang saya tidak terlalu khawatir seperti dulu.", audioFileName: "irodori-elementary2-17-a05-l04.mp3" },
];

const canDos = [
  { id: "talk-about-life-changes", source: "CAN-DO 73", text: "Menceritakan secara sederhana pengalaman dan perubahan kehidupan yang dialami setelah datang ke Jepang." },
  { id: "talk-about-recent-work", source: "CAN-DO 74", text: "Membicarakan secara sederhana perkembangan atau keadaan pekerjaan belakangan ini dengan rekan kerja." },
  { id: "write-a-recent-update", source: "CAN-DO 75", text: "Menulis dan mengirim pesan singkat berisi kabar terbaru kepada guru bahasa Jepang atau orang yang pernah mengajar." },
];

const vocabRows = [
  ["最近", "さいきん · saikin", "Belakangan ini"],
  ["この間", "このあいだ · kono aida", "Beberapa waktu lalu"],
  ["前", "まえ · mae", "Sebelumnya atau dahulu"],
  ["今", "いま · ima", "Sekarang"],
  ["生活", "せいかつ · seikatsu", "Kehidupan sehari-hari"],
  ["変化", "へんか · henka", "Perubahan"],
  ["日本語", "にほんご · nihongo", "Bahasa Jepang"],
  ["会話", "かいわ · kaiwa", "Percakapan"],
  ["話す", "はなす · hanasu", "Berbicara"],
  ["話せる", "はなせる · hanaseru", "Bisa berbicara"],
  ["聞く", "きく · kiku", "Mendengar atau bertanya"],
  ["聞き取る", "ききとる · kikitoru", "Menangkap atau memahami yang didengar"],
  ["読む", "よむ · yomu", "Membaca"],
  ["書く", "かく · kaku", "Menulis"],
  ["教える", "おしえる · oshieru", "Mengajar atau memberi tahu"],
  ["教わる", "おそわる · osowaru", "Belajar dari seseorang"],
  ["授業", "じゅぎょう · jugyou", "Pelajaran atau kelas"],
  ["先生", "せんせい · sensei", "Guru"],
  ["言葉", "ことば · kotoba", "Kata atau bahasa"],
  ["意味", "いみ · imi", "Arti atau makna"],
  ["質問", "しつもん · shitsumon", "Pertanyaan"],
  ["問題", "もんだい · mondai", "Masalah atau soal"],
  ["大変", "たいへん · taihen", "Sulit atau berat"],
  ["困る", "こまる · komaru", "Kesulitan atau kebingungan"],
  ["違う", "ちがう · chigau", "Berbeda"],
  ["慣れる", "なれる · nareru", "Menjadi terbiasa"],
  ["増える", "ふえる · fueru", "Bertambah"],
  ["減る", "へる · heru", "Berkurang"],
  ["笑う", "わらう · warau", "Tertawa"],
  ["苦労する", "くろうする · kurou suru", "Mengalami kesulitan atau berjuang"],
  ["仕事", "しごと · shigoto", "Pekerjaan"],
  ["職場", "しょくば · shokuba", "Tempat kerja"],
  ["同僚", "どうりょう · douryou", "Rekan kerja"],
  ["やり方", "やりかた · yarikata", "Cara atau metode"],
  ["経験", "けいけん · keiken", "Pengalaman"],
  ["趣味", "しゅみ · shumi", "Hobi"],
  ["サークル", "サークル · saakuru", "Klub atau kelompok kegiatan"],
  ["参加する", "さんかする · sanka suru", "Berpartisipasi"],
  ["誘う", "さそう · sasou", "Mengajak"],
  ["友達", "ともだち · tomodachi", "Teman"],
  ["連絡する", "れんらくする · renraku suru", "Menghubungi"],
  ["近況", "きんきょう · kinkyou", "Kabar atau keadaan terkini"],
  ["近況報告", "きんきょうほうこく · kinkyou houkoku", "Laporan kabar terbaru"],
  ["メッセージ", "メッセージ · messeeji", "Pesan"],
  ["おかげで", "おかげで · okage de", "Berkat atau berkat bantuan"],
  ["前より", "まえより · mae yori", "Dibandingkan sebelumnya"],
  ["できる", "できる · dekiru", "Bisa atau mampu"],
  ["上手になる", "じょうずになる · jouzu ni naru", "Menjadi mahir"],
  ["便利", "べんり · benri", "Praktis atau nyaman"],
  ["続ける", "つづける · tsuzukeru", "Melanjutkan atau terus melakukan"],
];

const kanjiWords = [
  ["最近", "さいきん · saikin", "Belakangan ini"],
  ["授業", "じゅぎょう · jugyou", "Pelajaran atau kelas"],
  ["問題", "もんだい · mondai", "Masalah atau soal"],
  ["大変（な）", "たいへん（な） · taihen (na)", "Sulit atau berat"],
  ["困る", "こまる · komaru", "Kesulitan atau kebingungan"],
  ["違う", "ちがう · chigau", "Berbeda"],
  ["慣れる", "なれる · nareru", "Menjadi terbiasa"],
  ["増える", "ふえる · fueru", "Bertambah"],
  ["笑う", "わらう · warau", "Tertawa"],
  ["苦労する", "くろうする · kurou suru", "Mengalami kesulitan atau berjuang"],
];

const progressExamples = [
  { title: "Kemampuan", before: "前は、長い文章が読めませんでした。", after: "今は、短い記事なら読めるようになりました。", meaning: "Dulu saya belum bisa membaca teks panjang. Sekarang saya sudah bisa membaca artikel pendek." },
  { title: "Kebiasaan", before: "前は、あまり日本語で話しませんでした。", after: "今は、友達と日本語で話すようになりました。", meaning: "Dulu saya jarang berbicara bahasa Jepang. Sekarang saya mulai terbiasa berbicara dengan teman." },
  { title: "Perubahan keadaan", before: "最初は、生活が大変でした。", after: "今は、少し便利になりました。", meaning: "Awalnya kehidupan terasa sulit; sekarang menjadi sedikit lebih praktis." },
];

const grammarNotes = [
  { title: "01 · Kemampuan yang berkembang", pattern: "V-（られ）るようになりました", example: <>前より、日本語が話せるようになりました。<br />短いニュースが読めるようになりました。</>, note: "Gunakan bentuk potensial kata kerja + ようになりました untuk menyatakan kemampuan yang sebelumnya belum dimiliki, tetapi sekarang sudah bisa dilakukan. Contoh: 話す → 話せるようになりました, 読む → 読めるようになりました, 書く → 書けるようになりました. Untuk わかる dan できる, gunakan langsung わかるようになりました dan できるようになりました." },
  { title: "02 · Menyatakan perubahan keadaan atau kebiasaan", pattern: "N／ナA-になる · イA-くなる · V-るようになる · V-なくなる", example: <>友達が増えて、生活が楽しくなりました。<br />毎日、日記を書くようになりました。<br />前ほど困らなくなりました。</>, note: "Pola ini merangkum beberapa bentuk perubahan: kata benda + になる (学生になりました), kata sifat な + になる (元気になりました), kata sifat い dengan い → く + なる (楽しくなりました), bentuk kamus kata kerja + ようになる untuk kebiasaan baru, serta bentuk ない dengan ない → なく + なる untuk kebiasaan yang berhenti dilakukan. Perhatikan bahwa V-るようになる membicarakan perubahan kebiasaan, sedangkan V-（られ）るようになる pada pola pertama menekankan kemampuan." },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];
type Task = { prompt: ReactNode; options: { key: string; label: ReactNode }[]; answer: string; explanation: ReactNode; };
type Simulation = { title: string; heading: string; prompt: string; japanese: ReactNode; translation: string; options: { key: string; label: string; meaning: string }[]; answer: string; explanation: string; };

const simulations: Simulation[] = [
  { title: "01 · Menceritakan perubahan kehidupan", heading: "Memilih kalimat tentang perubahan kemampuan", prompt: "Seseorang dahulu belum bisa memahami pengumuman sederhana, tetapi sekarang sudah bisa. Kalimat mana yang paling tepat?", japanese: <>前は、案内がよくわかりませんでした。今は、聞き取れるようになりました。</>, translation: "Dulu saya sulit memahami petunjuk. Sekarang saya sudah bisa menangkapnya.", options: [
    { key: "a", label: "前は聞き取れませんでしたが、今は聞き取れるようになりました。", meaning: "Bentuk potensial + ようになりました menyatakan kemampuan yang berkembang." },
    { key: "b", label: "前は聞き取れましたが、今は聞き取れません。", meaning: "Kalimat ini justru menyatakan kemampuan menurun." },
    { key: "c", label: "前も今も、聞き取るつもりです。", meaning: "Kalimat ini menyatakan niat, bukan perubahan kemampuan." },
  ], answer: "a", explanation: "Bandingkan 前は dengan 今は, lalu cari bentuk potensial yang diikuti ようになりました." },
  { title: "02 · Menjelaskan perubahan kebiasaan", heading: "Mengenali V-るようになりました", prompt: "Dulu seseorang jarang membaca buku, tetapi sekarang ia mulai membaca setiap malam. Pilih kalimat yang tepat.", japanese: <>最近、毎晩本を読むようになりました。</>, translation: "Belakangan ini saya mulai membaca buku setiap malam.", options: [
    { key: "a", label: "最近、毎晩本を読めるようになりました。", meaning: "読めるようになりました lebih menekankan kemampuan membaca, bukan kebiasaan baru." },
    { key: "b", label: "最近、毎晩本を読むようになりました。", meaning: "Bentuk kamus + ようになりました menyatakan kebiasaan baru." },
    { key: "c", label: "最近、毎晩本を読まなくなりました。", meaning: "Kalimat ini berarti berhenti membaca setiap malam." },
  ], answer: "b", explanation: "V-るようになりました menunjukkan perubahan kebiasaan atau hal yang mulai dilakukan." },
  { title: "03 · Membicarakan perkembangan pekerjaan", heading: "Memahami laporan singkat rekan kerja", prompt: "Seorang rekan berkata bahwa sekarang ia sudah bisa menyusun laporan sendiri. Apa perkembangan yang ia ceritakan?", japanese: <>今は、一人で報告書をまとめられるようになりました。</>, translation: "Sekarang saya sudah bisa menyusun laporan sendiri.", options: [
    { key: "a", label: "Sekarang ia tidak lagi membuat laporan.", meaning: "Kalimat menyatakan kemampuan menyusun laporan, bukan berhenti melakukannya." },
    { key: "b", label: "Ia baru mulai belajar membaca.", meaning: "Tidak ada keterangan tentang membaca." },
    { key: "c", label: "Sekarang ia sudah bisa menyusun laporan sendiri.", meaning: "まとめられる adalah bentuk potensial dari まとめる." },
  ], answer: "c", explanation: "まとめられる adalah bentuk potensial yang berarti mampu menyusun atau merangkum." },
  { title: "04 · Menulis pesan kabar terbaru", heading: "Memilih isi pesan yang sesuai untuk guru", prompt: "Kamu ingin memberi kabar kepada guru bahasa Jepang tentang perkembangan belajarmu. Pesan mana yang paling sesuai?", japanese: <>先生、お元気ですか。最近は日本語で短い日記を書けるようになりました。いつもありがとうございます。</>, translation: "Guru, apa kabar? Belakangan ini saya sudah bisa menulis buku harian singkat dalam bahasa Jepang. Terima kasih selalu.", options: [
    { key: "a", label: "Pesan yang berisi kabar terbaru, perkembangan, dan ucapan terima kasih.", meaning: "Isi ini sesuai untuk pesan kabar kepada guru." },
    { key: "b", label: "Pesan yang hanya berisi daftar belanja.", meaning: "Daftar belanja tidak memberikan kabar perkembangan belajar." },
    { key: "c", label: "Pesan tanpa sapaan atau konteks.", meaning: "Pesan kepada guru sebaiknya tetap memiliki sapaan dan isi yang jelas." },
  ], answer: "a", explanation: "Pesan singkat yang baik memiliki sapaan, kabar terbaru, dan penutup yang sopan." },
  { title: "05 · Membaca perubahan sebelum dan sekarang", heading: "Menemukan makna kalimat", prompt: "Baca kalimat 「友達が増えて、生活が楽しくなりました。」. Apa dua perubahan yang disebutkan?", japanese: <>友達が増えて、生活が楽しくなりました。</>, translation: "Teman bertambah dan kehidupan menjadi lebih menyenangkan.", options: [
    { key: "a", label: "Teman berkurang dan kehidupan menjadi sulit.", meaning: "増えて berarti bertambah dan 楽しくなりました berarti menjadi menyenangkan." },
    { key: "b", label: "Teman bertambah dan kehidupan menjadi lebih menyenangkan.", meaning: "Kedua perubahan sesuai dengan makna 増える dan 楽しくなる." },
    { key: "c", label: "Tidak ada perubahan dalam kehidupan.", meaning: "Kalimat tersebut menyebut dua perubahan." },
  ], answer: "b", explanation: "増える menyatakan jumlah yang bertambah, sedangkan 楽しくなる menyatakan keadaan yang menjadi lebih menyenangkan." },
];

const practiceTasks: Task[] = [
  { prompt: <>Pilih bentuk potensial dari 「話す」.</>, options: [{ key: "a", label: "話せる" }, { key: "b", label: "話さる" }, { key: "c", label: "話して" }], answer: "a", explanation: <>話す berubah menjadi 話せる dalam bentuk potensial.</> },
  { prompt: <>Lengkapi: 「前より日本語が話せる＿＿＿＿になりました。」</>, options: [{ key: "a", label: "こと" }, { key: "b", label: "よう" }, { key: "c", label: "ため" }], answer: "b", explanation: <>Bentuk potensial + ようになりました menyatakan kemampuan yang berkembang.</> },
  { prompt: <>Pilih bentuk potensial dari 「読む」.</>, options: [{ key: "a", label: "読める" }, { key: "b", label: "読まれる" }, { key: "c", label: "読んだ" }], answer: "a", explanation: <>読む berubah menjadi 読める untuk menyatakan bisa membaca.</> },
  { prompt: <>Untuk kata kerja 「わかる」, bentuk perubahan kemampuan yang benar adalah ...</>, options: [{ key: "a", label: "わかれるようになりました" }, { key: "b", label: "わかるようになりました" }, { key: "c", label: "わかってようになりました" }], answer: "b", explanation: <>わかる dan できる digunakan langsung dalam bentuk kamus + ようになりました.</> },
  { prompt: <>Pilih kalimat yang menyatakan kebiasaan baru.</>, options: [{ key: "a", label: "毎朝、日記を書くようになりました。" }, { key: "b", label: "毎朝、日記を書けるようになりました。" }, { key: "c", label: "毎朝、日記を書かなくなりました。" }], answer: "a", explanation: <>V-るようになりました menyatakan kebiasaan atau hal yang mulai dilakukan.</> },
  { prompt: <>Apa perubahan pada kalimat 「生活が楽しくなりました」?</>, options: [{ key: "a", label: "Kehidupan menjadi lebih menyenangkan." }, { key: "b", label: "Kehidupan berhenti." }, { key: "c", label: "Kehidupan menjadi lebih sulit." }], answer: "a", explanation: <>Kata sifat い 楽しい berubah menjadi 楽しく + なりました.</> },
];

const quizQuestions: Task[] = [
  { prompt: <>Apa arti 「最近」?</>, options: [{ key: "a", label: "Belakangan ini." }, { key: "b", label: "Tahun depan." }, { key: "c", label: "Kemarin pagi." }], answer: "a", explanation: <>最近 berarti belakangan ini atau akhir-akhir ini.</> },
  { prompt: <>Apa arti 「慣れる」?</>, options: [{ key: "a", label: "Menjadi terbiasa." }, { key: "b", label: "Menjadi terlambat." }, { key: "c", label: "Menjadi ramai." }], answer: "a", explanation: <>慣れる berarti menjadi terbiasa dengan sesuatu.</> },
  { prompt: <>Apa bentuk potensial dari 「書く」?</>, options: [{ key: "a", label: "書ける." }, { key: "b", label: "書かれる." }, { key: "c", label: "書いて." }], answer: "a", explanation: <>書く berubah menjadi 書ける untuk menyatakan bisa menulis.</> },
  { prompt: <>Apa fungsi 「V-（られ）るようになりました」?</>, options: [{ key: "a", label: "Menyatakan kemampuan yang sekarang sudah bisa dilakukan." }, { key: "b", label: "Memerintahkan seseorang." }, { key: "c", label: "Menanyakan waktu." }], answer: "a", explanation: <>Pola ini menjelaskan perubahan dari belum mampu menjadi mampu melakukan sesuatu.</> },
  { prompt: <>Apa arti 「友達が増えました」?</>, options: [{ key: "a", label: "Teman bertambah." }, { key: "b", label: "Teman berpindah rumah." }, { key: "c", label: "Teman berkurang." }], answer: "a", explanation: <>増える berarti bertambah atau meningkat.</> },
  { prompt: <>Pola 「V-るようになりました」 biasanya menyatakan ...</>, options: [{ key: "a", label: "Kebiasaan baru yang mulai dilakukan." }, { key: "b", label: "Kemampuan fisik saja." }, { key: "c", label: "Peristiwa yang belum terjadi." }], answer: "a", explanation: <>Pola ini digunakan untuk perubahan kebiasaan, preferensi, atau cara berpikir.</> },
  { prompt: <>Apa arti 「困る」?</>, options: [{ key: "a", label: "Mengalami kesulitan atau kebingungan." }, { key: "b", label: "Mengundang teman." }, { key: "c", label: "Meningkatkan jumlah." }], answer: "a", explanation: <>困る berarti berada dalam kesulitan atau tidak tahu harus berbuat apa.</> },
  { prompt: <>Bagaimana perubahan kata sifat い 「楽しい」 menjadi “menjadi menyenangkan”?</>, options: [{ key: "a", label: "楽しくなる." }, { key: "b", label: "楽しいになる." }, { key: "c", label: "楽しになる." }], answer: "a", explanation: <>Untuk kata sifat い, ubah い menjadi く lalu tambahkan なる.</> },
  { prompt: <>Bagian apa yang sesuai untuk pesan kabar terbaru kepada guru?</>, options: [{ key: "a", label: "Sapaan, kabar terbaru, perkembangan, dan ucapan terima kasih." }, { key: "b", label: "Hanya satu kata tanpa konteks." }, { key: "c", label: "Daftar nama orang yang tidak dikenal." }], answer: "a", explanation: <>Susun pesan agar sopan dan mudah dipahami penerima.</> },
  { prompt: <>Apa arti 「苦労する」?</>, options: [{ key: "a", label: "Mengalami kesulitan atau berjuang." }, { key: "b", label: "Menjadi terbiasa." }, { key: "c", label: "Menjadi bertambah." }], answer: "a", explanation: <>苦労する berarti bersusah payah atau mengalami banyak kesulitan.</> },
];

export default function IrodoriElementaryTwoLessonSeventeenPage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [updateMessageDraft, setUpdateMessageDraft] = useState("");

  const isCompleted = progress.completedLessons.includes(lessonId);
  const visibleRatings = { ...(progress.selfEvaluations[lessonId] ?? {}), ...ratings };
  const practiceScore = practiceTasks.filter((task, index) => practiceAnswers[index] === task.answer).length;
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;
  const simulationScore = simulations.filter((task, index) => simulationChecked[index] && simulationChoices[index] === task.answer).length;
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

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#A64C77]/35 bg-gradient-to-br from-[#422337] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#E5A9C4]/[0.08]">変</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#E5A9C4]">IRODORI • DASAR 2 A2 • PELAJARAN 17</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Sekarang saya bisa berbicara bahasa Jepang lebih baik daripada sebelumnya.</h1>
          <p className="mt-2 text-sm font-semibold text-[#E5A9C4]">日本語が前より話せるようになりました</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar menceritakan perubahan kehidupan, membicarakan perkembangan pekerjaan belakangan ini, menjelaskan kemampuan yang meningkat, dan menulis pesan kabar terbaru kepada guru.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><CalendarDays size={14} className="text-[#E5A9C4]" />Perubahan kehidupan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#E5A9C4]" />Belajar dan pekerjaan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Gift size={14} className="text-[#E5A9C4]" />Kabar terbaru</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#A64C77]/20 bg-[#35232D]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#E5A9C4]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Tiga target berikut mengikuti target komunikasi 73–75 pada Irodori Dasar 2 Lesson 17.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E5A9C4]">{item.source} · {String(index + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Perubahan kehidupan, kemampuan, dan kabar terbaru</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Lima percakapan berikut ditulis orisinal oleh Fude untuk melatih seluruh target komunikasi pelajaran ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Menceritakan perubahan kehidupan sehari-hari" speakers={[friendYui, friendSota]} utterances={talkAboutDailyChangesConversation} />
          <IrodoriConversation title="Membicarakan perkembangan pekerjaan" speakers={[friendAkiko, friendKenji]} utterances={talkAboutWorkProgressConversation} />
          <IrodoriConversation title="Membicarakan kemajuan bahasa Jepang" speakers={[friendYui, friendAkiko]} utterances={talkAboutJapaneseProgressConversation} />
          <IrodoriConversation title="Menyiapkan pesan kepada guru" speakers={[friendKenji, friendSota]} utterances={prepareTeacherUpdateConversation} />
          <IrodoriConversation title="Berbagi perubahan kebiasaan" speakers={[friendAkiko, friendYui]} utterances={shareLifeChangesConversation} />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#A64C77]/20 bg-[#35232D]/60 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#E5A9C4]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Contoh perubahan dari dahulu hingga sekarang</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Bandingkan keadaan sebelumnya dengan keadaan sekarang. Tandai apakah perubahan itu berkaitan dengan kemampuan, kebiasaan, atau keadaan.</p>
        <div className="grid gap-3">
          {progressExamples.map((item) => (
            <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E5A9C4]">{item.title}</p>
              <p className="mt-2 font-mincho text-sm leading-7 text-[#B6B0A5]">{item.before}</p>
              <p className="mt-1 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.after}</p>
              <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">KOSAKATA KEHIDUPAN SEHARI-HARI</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima puluh kosakata penting</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata tentang pengalaman, perubahan, kemampuan, hubungan sosial, pekerjaan, dan pesan kabar terbaru.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E5A9C4]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">KANJI UTAMA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sepuluh kata kanji pada materi resmi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Daftar ini mengikuti sepuluh kosakata kanji pada bagian Kanji Words Lesson 17.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-[#A64C77]/20 bg-[#35232D]/50 p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E5A9C4]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">POLA TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menyatakan kemampuan dan perubahan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari bentuk potensial yang menunjukkan kemampuan baru, lalu bandingkan dengan pola perubahan kebiasaan dan keadaan.</p>
        </div>
        {grammarNotes.map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#E5A9C4]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#E5A9C4]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-[#A64C77]/20 bg-[#35232D]/60 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#E5A9C4]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Latihan menulis pesan kabar terbaru</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Bayangkan kamu menulis kepada guru yang pernah mengajar bahasa Jepang. Tulis sapaan, kabar kehidupanmu belakangan ini, satu kemampuan atau kebiasaan yang berkembang, dan ucapan terima kasih. Gunakan nama samaran; jangan tuliskan nomor telepon, alamat, atau informasi pribadi.</p>
        <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#E5A9C4]">CONTOH ORISINAL FUDE</p>
          <p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">先生、お元気ですか。<br />最近は、日本語で短い日記を書けるようになりました。<br />毎日少しずつ勉強しています。<br />いつも教えてくださって、ありがとうございます。</p>
          <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Guru, apa kabar? Belakangan ini saya sudah bisa menulis catatan harian singkat dalam bahasa Jepang. Saya belajar sedikit demi sedikit setiap hari. Terima kasih selalu sudah mengajar saya.</p>
        </div>
        <label htmlFor="recent-update-message" className="block text-xs font-semibold text-[#E5A9C4]">Tulis pesanmu dalam bahasa Jepang</label>
        <textarea id="recent-update-message" value={updateMessageDraft} onChange={(event) => setUpdateMessageDraft(event.target.value)} rows={5} placeholder="先生、お元気ですか。..." className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#E5A9C4]/50" />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] text-[#817A73]">Draf hanya digunakan untuk latihan di halaman ini.</p>
          <span className="text-[10px] tabular-nums text-[#E5A9C4]">{updateMessageDraft.length} karakter</span>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">SIMULASI SITUASI</p>
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
              <p className="text-[9px] font-black tracking-[0.16em] text-[#E5A9C4]">{task.title}</p>
              <h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#A64C77]/20 bg-[#35232D]/60 p-3">
                <p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.japanese}</JapaneseReading></p>
                <p className="mt-1 text-xs text-[#A9A398]">{task.translation}</p>
              </div>
              <div className="mt-3 grid gap-2">
                {task.options.map((option) => (
                  <button key={option.key} type="button" disabled={isCorrect} aria-pressed={selected === option.key} onClick={() => {
                    setSimulationChoices((current) => ({ ...current, [index]: option.key }));
                    setSimulationChecked((current) => ({ ...current, [index]: false }));
                  }} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (
                    isCorrect && option.key === task.answer
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                      : selected === option.key
                        ? "border-[#E5A9C4]/60 bg-[#A64C77]/15 text-[#F1EBDD]"
                        : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                  )}>
                    <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading>
                  </button>
                ))}
              </div>
              {(isCorrect || isWrong) && (
                <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                  <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
                  {isCorrect ? task.explanation : "Tinjau kembali informasi dan pilih jawaban yang sesuai."}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] text-[#817A73]">{isCorrect ? "Situasi selesai" : "Pilih jawaban lalu periksa"}</p>
                <button type="button" disabled={!selected || isCorrect} onClick={() => setSimulationChecked((current) => ({ ...current, [index]: true }))} className="rounded-lg bg-[#A64C77] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#7E3758] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">
                  {isCorrect ? "Selesai" : "Periksa"}
                </button>
              </div>
              {checked && isWrong && <p className="mt-2 text-[10px] text-[#E7A1A1]">{task.options.find((option) => option.key === task.answer)?.meaning}</p>}
            </article>
          );
        })}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p className="text-xs text-[#A9A398]">Simulasi benar: {simulationScore} dari {simulations.length}.</p>
          <button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#A64C77]/35 px-4 py-2 text-xs font-bold text-[#E5A9C4]">
            <RefreshCw size={13} /> Ulangi simulasi
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#E5A9C4]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {task.options.map((option) => (
                    <button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected === option.key} onClick={() => setPracticeAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (
                      practiceSubmitted && option.key === task.answer
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                        : practiceSubmitted && selected === option.key
                          ? "border-red-400/50 bg-red-400/10 text-red-200"
                          : selected === option.key
                            ? "border-[#E5A9C4]/60 bg-[#A64C77]/15 text-[#F1EBDD]"
                            : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                    )}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>
                  ))}
                </div>
                {practiceSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
                    <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.explanation}</JapaneseReading>
                  </p>
                )}
              </article>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{practiceSubmitted ? "Hasil praktik: " + practiceScore + " dari " + practiceTasks.length + " benar." : Object.keys(practiceAnswers).length + " dari " + practiceTasks.length + " pertanyaan dijawab."}</p>
          {practiceSubmitted ? (
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#A64C77]/35 px-4 py-2 text-xs font-bold text-[#E5A9C4]"><RefreshCw size={13} /> Ulangi praktik</button>
          ) : (
            <button type="button" onClick={() => setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length !== practiceTasks.length} className="rounded-lg bg-[#A64C77] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa praktik</button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#E5A9C4]">SOAL {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.prompt}</JapaneseReading></h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {question.options.map((option) => (
                    <button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected === option.key} onClick={() => setAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (
                      quizSubmitted && option.key === question.answer
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                        : quizSubmitted && selected === option.key
                          ? "border-red-400/50 bg-red-400/10 text-red-200"
                          : selected === option.key
                            ? "border-[#E5A9C4]/60 bg-[#A64C77]/15 text-[#F1EBDD]"
                            : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                    )}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>
                  ))}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
                    <JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.explanation}</JapaneseReading>
                  </p>
                )}
              </article>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{quizSubmitted ? "Nilai kuis: " + quizScore + " dari " + quizQuestions.length + " benar." : Object.keys(answers).length + " dari " + quizQuestions.length + " pertanyaan dijawab."}</p>
          {quizSubmitted ? (
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#A64C77]/35 px-4 py-2 text-xs font-bold text-[#E5A9C4]"><RefreshCw size={13} /> Ulangi kuis</button>
          ) : (
            <button type="button" onClick={() => setQuizSubmitted(true)} disabled={Object.keys(answers).length !== quizQuestions.length} className="rounded-lg bg-[#A64C77] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa kuis</button>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#A64C77]/20 bg-[#35232D]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#E5A9C4]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi target komunikasi</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.</p>
        <div className="space-y-3">
          {canDos.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#E5A9C4]">{item.source}</p>
              <p className="mt-1 text-xs leading-5 text-[#EAE6DD]">{item.text}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {ratingOptions.map((option) => (
                  <button key={option.value} type="button" disabled={!canEvaluate} aria-pressed={visibleRatings[item.id] === option.value} onClick={() => {
                    const nextRatings = { ...visibleRatings, [item.id]: option.value };
                    setRatings(nextRatings);
                    saveIrodoriSelfEvaluation(lessonId, nextRatings);
                  }} className={"rounded-lg border px-3 py-2 text-left text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 " + (
                    visibleRatings[item.id] === option.value
                      ? "border-[#E5A9C4]/50 bg-[#A64C77]/20 text-[#F8EEDC]"
                      : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                  )}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
          <p className="text-xs text-[#A9A398]">
            {isCompleted ? "Lesson 17 selesai. Progres tersimpan." : canDosRated ? "Semua target komunikasi sudah dinilai." : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button type="button" onClick={finishLesson} disabled={!canComplete || isCompleted} className="rounded-xl bg-[#A64C77] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#7E3758] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">
            {isCompleted ? "Lesson 17 selesai" : "Selesaikan Lesson 17"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Dasar 2 · 17 / 18</span>
      </div>
    </main>
  );
}
