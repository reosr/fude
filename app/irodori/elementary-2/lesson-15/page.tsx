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
const lessonId = "elementary2-15";

const readEcoPosterConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>このポスターには、何と書いてありますか。</>, romaji: "Kono posutaa ni wa, nan to kaite arimasu ka?", translation: "Apa yang tertulis di poster ini?", audioFileName: "irodori-elementary2-15-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>使い終わったら、電気を消してください、と書いてあります。</>, romaji: "Tsukai owattara, denki o keshite kudasai, to kaite arimasu.", translation: "Tertulis, 'Setelah selesai digunakan, silakan matikan lampu'.", audioFileName: "irodori-elementary2-15-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>電気を消すのを忘れないようにしたいですね。</>, romaji: "Denki o kesu no o wasurenai you ni shitai desu ne.", translation: "Kita usahakan jangan lupa mematikan lampu, ya.", audioFileName: "irodori-elementary2-15-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>そうですね。使っていない部屋の電気は消しましょう。</>, romaji: "Sou desu ne. Tsukatte inai heya no denki wa keshimashou.", translation: "Betul. Mari matikan lampu di ruangan yang tidak digunakan.", audioFileName: "irodori-elementary2-15-a01-l04.mp3" },
];
const saveEnergyConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>会社では、節電のために何をしていますか。</>, romaji: "Kaisha de wa, setsuden no tame ni nani o shite imasu ka?", translation: "Di kantor, apa yang dilakukan untuk menghemat listrik?", audioFileName: "irodori-elementary2-15-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>使っていない部屋の電気を消すようにしています。</>, romaji: "Tsukatte inai heya no denki o kesu you ni shite imasu.", translation: "Kami berusaha mematikan lampu di ruangan yang tidak digunakan.", audioFileName: "irodori-elementary2-15-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>会議の資料はどうしていますか。</>, romaji: "Kaigi no shiryou wa dou shite imasu ka?", translation: "Kalau dokumen rapat, bagaimana?", audioFileName: "irodori-elementary2-15-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>紙を節約するために、両面コピーにしています。</>, romaji: "Kami o setsuyaku suru tame ni, ryoumen kopii ni shite imasu.", translation: "Untuk menghemat kertas, kami menggunakan fotokopi bolak-balik.", audioFileName: "irodori-elementary2-15-a02-l04.mp3" },
];
const saveWaterConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>お皿を洗うとき、水を出したままにしていますか。</>, romaji: "Osara o arau toki, mizu o dashita mama ni shite imasu ka?", translation: "Saat mencuci piring, apakah air dibiarkan mengalir terus?", audioFileName: "irodori-elementary2-15-a03-l01.mp3" },
  { speakerId: "akiko", japanese: <>いいえ。洗剤をつけるときは、水を止めています。</>, romaji: "Iie. Senzai o tsukeru toki wa, mizu o tomete imasu.", translation: "Tidak. Saat memakai sabun, saya mematikan keran.", audioFileName: "irodori-elementary2-15-a03-l02.mp3" },
  { speakerId: "yui", japanese: <>それは節水にいいですね。</>, romaji: "Sore wa sessui ni ii desu ne.", translation: "Itu cara yang bagus untuk menghemat air, ya.", audioFileName: "irodori-elementary2-15-a03-l03.mp3" },
  { speakerId: "akiko", japanese: <>はい。できることから続けるようにしています。</>, romaji: "Hai. Dekiru koto kara tsuzukeru you ni shite imasu.", translation: "Ya. Saya mulai dari hal-hal yang bisa saya lakukan.", audioFileName: "irodori-elementary2-15-a03-l04.mp3" },
];
const readWasteGuideConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>この地域では、ごみを何種類に分けていますか。</>, romaji: "Kono chiiki de wa, gomi o nan shurui ni wakete imasu ka?", translation: "Di daerah ini, sampah dipilah menjadi berapa jenis?", audioFileName: "irodori-elementary2-15-a04-l01.mp3" },
  { speakerId: "sota", japanese: <>四種類です。資源ごみ、燃えるごみ、燃えないごみ、粗大ごみです。</>, romaji: "Yon shurui desu. Shigen gomi, moeru gomi, moenai gomi, sodai gomi desu.", translation: "Ada empat jenis: sampah daur ulang, sampah yang bisa dibakar, sampah yang tidak bisa dibakar, dan sampah berukuran besar.", audioFileName: "irodori-elementary2-15-a04-l02.mp3" },
  { speakerId: "kenji", japanese: <>種類によって、出す曜日が違いますか。</>, romaji: "Shurui ni yotte, dasu youbi ga chigaimasu ka?", translation: "Apakah jadwal membuangnya berbeda-beda, tergantung jenis sampah?", audioFileName: "irodori-elementary2-15-a04-l03.mp3" },
  { speakerId: "sota", japanese: <>はい。説明の紙で、曜日と注意点を確認してください。</>, romaji: "Hai. Setsumei no kami de, youbi to chuuiten o kakunin shite kudasai.", translation: "Ya. Cek jadwal dan hal-hal yang perlu diperhatikan di lembar panduan.", audioFileName: "irodori-elementary2-15-a04-l04.mp3" },
];
const askWasteDisposalConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>このペットボトルは、どうやって捨てればいいですか。</>, romaji: "Kono petto botoru wa, dou yatte sutereba ii desu ka?", translation: "Bagaimana cara membuang botol plastik ini?", audioFileName: "irodori-elementary2-15-a05-l01.mp3" },
  { speakerId: "kenji", japanese: <>この地域の案内では、資源ごみの日に出すことになっています。</>, romaji: "Kono chiiki no annai de wa, shigen gomi no hi ni dasu koto ni natte imasu.", translation: "Menurut panduan di daerah ini, botol plastik dibuang pada hari pengumpulan sampah daur ulang.", audioFileName: "irodori-elementary2-15-a05-l02.mp3" },
  { speakerId: "akiko", japanese: <>ほかに、気をつけることはありますか。</>, romaji: "Hoka ni, ki o tsukeru koto wa arimasu ka?", translation: "Apakah ada hal lain yang perlu diperhatikan?", audioFileName: "irodori-elementary2-15-a05-l03.mp3" },
  { speakerId: "kenji", japanese: <>はい。ラベルなどの扱いも、地域の説明を確認してください。</>, romaji: "Hai. Raberu nado no atsukai mo, chiiki no setsumei o kakunin shite kudasai.", translation: "Ya. Periksa juga panduan setempat tentang cara menangani label dan bagian lainnya.", audioFileName: "irodori-elementary2-15-a05-l04.mp3" },
];

const canDos = [
  { id: "understand-eco-posters", source: "CAN-DO 64", text: "Membaca poster kegiatan ramah lingkungan di tempat kerja atau fasilitas umum dan memahami hal-hal yang perlu diperhatikan." },
  { id: "talk-about-eco-habits", source: "CAN-DO 65", text: "Membicarakan kebiasaan yang dilakukan untuk menjaga lingkungan dan memahami cerita orang lain." },
  { id: "read-waste-separation-guide", source: "CAN-DO 66", text: "Membaca panduan pemilahan dan pembuangan sampah, termasuk mengetahui kapan jenis sampah tertentu dikeluarkan." },
  { id: "ask-how-to-dispose-waste", source: "CAN-DO 67", text: "Bertanya tentang cara membuang jenis sampah tertentu dan memahami jawabannya." },
];

const vocabRows = [
  ["自然", "しぜん · shizen", "Alam"],
  ["環境", "かんきょう · kankyou", "Lingkungan"],
  ["地球", "ちきゅう · chikyuu", "Bumi"],
  ["エコ", "エコ · eko", "Ramah lingkungan atau eco"],
  ["活動", "かつどう · katsudou", "Kegiatan atau aktivitas"],
  ["エコ活動", "エコかつどう · eko katsudou", "Kegiatan ramah lingkungan"],
  ["貼り紙", "はりがみ · harigami", "Poster atau pemberitahuan yang ditempel"],
  ["注意点", "ちゅういてん · chuuiten", "Hal yang perlu diperhatikan"],
  ["電気", "でんき · denki", "Listrik atau lampu"],
  ["温度", "おんど · ondo", "Suhu"],
  ["設定する", "せっていする · settei suru", "Mengatur atau menetapkan"],
  ["節電", "せつでん · setsuden", "Penghematan listrik"],
  ["節水", "せっすい · sessui", "Penghematan air"],
  ["紙", "かみ · kami", "Kertas"],
  ["節約する", "せつやくする · setsuyaku suru", "Menghemat"],
  ["両面コピー", "りょうめんコピー · ryoumen kopii", "Fotokopi dua sisi"],
  ["水", "みず · mizu", "Air"],
  ["もったいない", "もったいない · mottainai", "Sayang jika terbuang atau boros"],
  ["エアコン", "エアコン · eakon", "Pendingin ruangan"],
  ["照明", "しょうめい · shoumei", "Penerangan atau lampu"],
  ["消す", "けす · kesu", "Mematikan"],
  ["つける", "つける · tsukeru", "Menyalakan"],
  ["止める", "とめる · tomeru", "Menghentikan"],
  ["出す", "だす · dasu", "Mengeluarkan atau menaruh sampah"],
  ["リサイクルする", "リサイクルする · risaikuru suru", "Mendaur ulang"],
  ["ごみ", "ごみ · gomi", "Sampah"],
  ["ごみ箱", "ごみばこ · gomibako", "Tempat sampah"],
  ["ごみ袋", "ごみぶくろ · gomibukuro", "Kantong sampah"],
  ["分別する", "ぶんべつする · bunbetsu suru", "Memilah"],
  ["分ける", "わける · wakeru", "Memisahkan atau membagi"],
  ["種類", "しゅるい · shurui", "Jenis atau macam"],
  ["資源ごみ", "しげんごみ · shigen gomi", "Sampah yang dapat didaur ulang"],
  ["燃えるごみ", "もえるごみ · moeru gomi", "Sampah yang dapat dibakar"],
  ["燃えないごみ", "もえないごみ · moenai gomi", "Sampah yang tidak dapat dibakar"],
  ["粗大ごみ", "そだいごみ · sodai gomi", "Sampah berukuran besar"],
  ["曜日", "ようび · youbi", "Hari dalam minggu"],
  ["決める", "きめる · kimeru", "Menentukan atau memutuskan"],
  ["回収日", "かいしゅうび · kaishuubi", "Hari pengumpulan sampah"],
  ["収集場所", "しゅうしゅうばしょ · shuushuu basho", "Tempat pengumpulan"],
  ["ペットボトル", "ペットボトル · petto botoru", "Botol plastik"],
  ["缶", "かん · kan", "Kaleng"],
  ["びん", "びん · bin", "Botol kaca"],
  ["段ボール", "だんボール · danbooru", "Kardus bergelombang"],
  ["古紙", "こし · koshi", "Kertas bekas"],
  ["資源", "しげん · shigen", "Sumber daya atau bahan yang dapat dimanfaatkan kembali"],
  ["ラベル", "ラベル · raberu", "Label"],
  ["キャップ", "キャップ · kyappu", "Tutup botol"],
  ["生ごみ", "なまごみ · namagomi", "Sampah organik atau sisa makanan"],
  ["リユース", "リユース · riyuusu", "Menggunakan kembali"],
  ["マイバッグ", "マイバッグ · mai baggu", "Tas belanja pakai ulang"],
];

const kanjiWords = [
  ["温度", "おんど · ondo", "Suhu"],
  ["危険", "きけん · kiken", "Bahaya"],
  ["～種類", "～しゅるい · ~shurui", "Jenis atau macam"],
  ["消す", "けす · kesu", "Mematikan"],
  ["捨てる", "すてる · suteru", "Membuang"],
  ["出す", "だす · dasu", "Mengeluarkan atau menaruh"],
  ["分ける", "わける · wakeru", "Memisahkan"],
  ["燃える", "もえる · moeru", "Dapat dibakar"],
  ["決める", "きめる · kimeru", "Menentukan"],
  ["設定する", "せっていする · settei suru", "Mengatur atau menetapkan"],
];

const ecoPosters = [
  { title: "電気を消すのを忘れずに", meaning: "Jangan lupa mematikan lampu.", note: "Periksa lampu saat ruangan sudah tidak digunakan." },
  { title: "エアコンは適切な温度に設定しましょう", meaning: "Atur pendingin ruangan pada suhu yang sesuai.", note: "Pilih pengaturan yang nyaman dan ikuti aturan di tempat tersebut." },
  { title: "紙は両面コピーで節約", meaning: "Hemat kertas dengan fotokopi dua sisi.", note: "Gunakan kedua sisi kertas jika dokumennya memungkinkan." },
  { title: "マイバッグを持ち歩きましょう", meaning: "Mari membawa tas belanja pakai ulang.", note: "Tas pakai ulang dapat digunakan berkali-kali." },
  { title: "水を出したままにしないでください", meaning: "Jangan biarkan air terus mengalir.", note: "Tutup keran saat air tidak diperlukan." },
];

const ecoActions = [
  { title: "節電する", body: "使っていない部屋の電気を消すようにしています。", meaning: "Saya berusaha mematikan lampu di ruangan yang tidak digunakan." },
  { title: "節水する", body: "水を出したままにしないようにしています。", meaning: "Saya berusaha tidak membiarkan air terus mengalir." },
  { title: "紙を節約する", body: "できるだけ、両面コピーを使うようにしています。", meaning: "Saya berusaha menggunakan fotokopi dua sisi jika memungkinkan." },
  { title: "ごみを減らす", body: "マイバッグを持ち歩くようにしています。", meaning: "Saya berusaha membawa tas belanja pakai ulang." },
];

const wasteGuide = [
  { kind: "資源ごみ", examples: "紙・段ボール・缶・ペットボトル", day: "水曜日（例）", meaning: "Bahan yang dapat dimanfaatkan atau didaur ulang. Hari pada contoh ini bersifat fiktif." },
  { kind: "燃えるごみ", examples: "生ごみ・汚れた紙など", day: "月曜日・木曜日（例）", meaning: "Sampah yang pada panduan contoh masuk kategori dapat dibakar." },
  { kind: "燃えないごみ", examples: "地域の案内で指定された品目", day: "金曜日（例）", meaning: "Kategori untuk barang tertentu sesuai daftar wilayah. Periksa panduan setempat." },
  { kind: "粗大ごみ", examples: "大きな家具など", day: "予約制（例）", meaning: "Barang berukuran besar dapat memiliki aturan pengumpulan tersendiri." },
];

const grammarNotes = [
  { title: "01 · Menyatakan keadaan yang tetap berlangsung", pattern: "V-たままです", example: <>会議室の電気がついたままでした。<br />窓が開いたままです。</>, note: "まま menyatakan keadaan yang tidak berubah. V-たまま dipakai saat suatu keadaan seharusnya sudah berakhir, tetapi masih berlanjut. Hubungkan dengan bentuk タ kata kerja: つく → ついたまま、開く → 開いたまま、出す → 出したまま. そのまま berarti membiarkan keadaan tetap seperti itu." },
  { title: "02 · Menyatakan sesuatu berguna untuk suatu tujuan", pattern: "V-るのにいいです", example: <>マイバッグは、ごみを減らすのにいいです。<br />両面コピーは、紙を節約するのにいいです。</>, note: "Pola V-るのにいい menyatakan bahwa sesuatu baik atau berguna untuk melakukan suatu tindakan atau mencapai tujuan. Contoh: 節電するのにいい (berguna untuk menghemat listrik), ごみを減らすのにいい (berguna untuk mengurangi sampah)." },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];
type Task = { prompt: ReactNode; options: { key: string; label: ReactNode }[]; answer: string; explanation: ReactNode; };
type Simulation = { title: string; heading: string; prompt: string; japanese: ReactNode; translation: string; options: { key: string; label: string; meaning: string }[]; answer: string; explanation: string; };

const simulations: Simulation[] = [
  { title: "01 · Membaca poster ramah lingkungan", heading: "Memahami pesan pada poster", prompt: "Di ruang kelas tertulis 「使い終わったら、電気を消してください」. Apa tindakan yang diminta?", japanese: <>使い終わったら、電気を消してください。</>, translation: "Setelah selesai digunakan, silakan matikan lampu.", options: [
    { key: "a", label: "Menyalakan semua lampu.", meaning: "Poster meminta lampu dimatikan setelah ruangan selesai digunakan." },
    { key: "b", label: "Mematikan lampu setelah selesai menggunakan ruangan.", meaning: "Ini sesuai dengan pesan poster." },
    { key: "c", label: "Membiarkan lampu tetap menyala.", meaning: "Pesan poster justru meminta lampu dimatikan." },
  ], answer: "b", explanation: "Cari kata kerja utama pada poster, lalu perhatikan kapan tindakan dilakukan." },
  { title: "02 · Membicarakan kebiasaan menjaga lingkungan", heading: "Memahami tindakan dan tujuannya", prompt: "Seseorang berkata bahwa ia selalu membawa tas belanja pakai ulang agar mengurangi sampah. Apa kebiasaannya?", japanese: <>ごみを減らすために、マイバッグを持ち歩いています。</>, translation: "Saya membawa tas belanja pakai ulang untuk mengurangi sampah.", options: [
    { key: "a", label: "Membawa tas belanja pakai ulang.", meaning: "マイバッグを持ち歩く berarti membawa tas belanja sendiri." },
    { key: "b", label: "Menggunakan lebih banyak kantong sekali pakai.", meaning: "Pernyataan itu bertujuan mengurangi sampah, bukan menambahnya." },
    { key: "c", label: "Membiarkan air mengalir.", meaning: "Air tidak disebutkan dalam kalimat." },
  ], answer: "a", explanation: "Pahami tindakan yang dilakukan dan tujuan lingkungan yang disebutkan." },
  { title: "03 · Membaca panduan pemilahan sampah", heading: "Menemukan hari pengumpulan", prompt: "Pada panduan fiktif Fude, sampah daur ulang dikumpulkan pada hari Rabu. Kapan kaleng dan kertas bekas dikeluarkan jika keduanya termasuk kategori itu?", japanese: <>資源ごみは、水曜日に出してください。</>, translation: "Sampah daur ulang harus dibuang pada hari Rabu.", options: [
    { key: "a", label: "Hari Senin.", meaning: "Panduan contoh menyebut hari Rabu." },
    { key: "b", label: "Hari Rabu.", meaning: "Kertas bekas dan kaleng termasuk contoh kategori資源ごみ pada latihan ini." },
    { key: "c", label: "Setiap hari tanpa melihat panduan.", meaning: "Panduan memberikan hari pengumpulan tertentu." },
  ], answer: "b", explanation: "Jadwal ini hanya contoh latihan. Jadwal dan kategori sebenarnya berbeda menurut wilayah." },
  { title: "04 · Bertanya cara membuang barang", heading: "Memilih pertanyaan yang sesuai", prompt: "Kamu tidak tahu cara membuang botol plastik. Kalimat mana yang tepat untuk bertanya?", japanese: <>ペットボトルは、どうやって捨てればいいですか。</>, translation: "Bagaimana cara membuang botol plastik?", options: [
    { key: "a", label: "ペットボトルは、どうやって捨てればいいですか。", meaning: "どうやって捨てればいいですか menanyakan cara membuang sesuatu." },
    { key: "b", label: "ペットボトルは、何時に開きますか。", meaning: "Kalimat ini menanyakan jam buka, bukan cara membuang." },
    { key: "c", label: "ペットボトルは、どこで買いましたか。", meaning: "Kalimat ini menanyakan tempat membeli." },
  ], answer: "a", explanation: "Gunakan どうやって untuk menanyakan cara melakukan sesuatu." },
  { title: "05 · Memahami keadaan yang masih berlangsung", heading: "Menafsirkan V-たまま", prompt: "Seseorang berkata 「水が出したままですよ」. Apa yang sedang terjadi?", japanese: <>水が出たままですよ。</>, translation: "Air masih dibiarkan mengalir.", options: [
    { key: "a", label: "Air sudah berhenti.", meaning: "まま menunjukkan keadaan tetap berlangsung." },
    { key: "b", label: "Air masih mengalir dan belum dihentikan.", meaning: "Kalimat itu menunjukkan keadaan yang dibiarkan tetap berlangsung." },
    { key: "c", label: "Air sedang dibawa ke tempat lain.", meaning: "Tidak ada informasi tentang memindahkan air." },
  ], answer: "b", explanation: "V-たまま menyatakan bahwa keadaan hasil suatu tindakan masih berlanjut." },
];

const practiceTasks: Task[] = [
  { prompt: <>Lengkapi bentuk V-たまま: 「窓が開い＿＿＿＿です。」</>, options: [{ key: "a", label: "たまま" }, { key: "b", label: "るのに" }, { key: "c", label: "てから" }], answer: "a", explanation: <>Bentuk タ dari 開く adalah 開いた, jadi 開いたままです.</> },
  { prompt: <>Pilih kalimat yang berarti “lampu dibiarkan menyala”.</>, options: [{ key: "a", label: "電気が消えたままです。" }, { key: "b", label: "電気がついたままです。" }, { key: "c", label: "電気を消すのにいいです。" }], answer: "b", explanation: <>ついたまま menyatakan keadaan lampu tetap menyala.</> },
  { prompt: <>Lengkapi pola V-るのにいい: 「マイバッグは、ごみを減らす＿＿＿＿いいです。」</>, options: [{ key: "a", label: "まで" }, { key: "b", label: "のに" }, { key: "c", label: "たまま" }], answer: "b", explanation: <>V-るのにいい menyatakan bahwa sesuatu berguna untuk suatu tujuan.</> },
  { prompt: <>Apa arti 「紙を節約するのにいいです」?</>, options: [{ key: "a", label: "Baik untuk menghemat kertas." }, { key: "b", label: "Kertas dibiarkan terbuka." }, { key: "c", label: "Kertas harus dibuang hari ini." }], answer: "a", explanation: <>節約するのにいい berarti berguna untuk menghemat.</> },
  { prompt: <>Pilih pertanyaan yang menanyakan cara membuang sampah.</>, options: [{ key: "a", label: "何種類ありますか。" }, { key: "b", label: "どうやって捨てればいいですか。" }, { key: "c", label: "いつ始まりますか。" }], answer: "b", explanation: <>どうやって menanyakan cara atau metode.</> },
  { prompt: <>Apa arti 「ごみを分別する」?</>, options: [{ key: "a", label: "Memilah sampah." }, { key: "b", label: "Membeli barang baru." }, { key: "c", label: "Menyalakan lampu." }], answer: "a", explanation: <>分別する berarti memisahkan atau memilah berdasarkan kategori.</> },
];

const quizQuestions: Task[] = [
  { prompt: <>Apa arti 「環境」?</>, options: [{ key: "a", label: "Lingkungan." }, { key: "b", label: "Perjalanan." }, { key: "c", label: "Gedung." }], answer: "a", explanation: <>環境 berarti lingkungan.</> },
  { prompt: <>Apa arti 「節電」?</>, options: [{ key: "a", label: "Penghematan air." }, { key: "b", label: "Penghematan listrik." }, { key: "c", label: "Pemilahan sampah." }], answer: "b", explanation: <>節電 berarti menghemat penggunaan listrik.</> },
  { prompt: <>Apa fungsi 「V-たまま」?</>, options: [{ key: "a", label: "Menyatakan keadaan yang tetap berlangsung tanpa perubahan." }, { key: "b", label: "Menanyakan tempat." }, { key: "c", label: "Menyatakan jumlah benda." }], answer: "a", explanation: <>V-たまま menggambarkan keadaan yang seharusnya berubah atau berakhir tetapi masih berlanjut.</> },
  { prompt: <>Pilih bentuk タ dari 「消す」.</>, options: [{ key: "a", label: "消した" }, { key: "b", label: "消いて" }, { key: "c", label: "消すた" }], answer: "a", explanation: <>消す berubah menjadi 消した dalam bentuk タ.</> },
  { prompt: <>Apa makna 「マイバッグは、ごみを減らすのにいいです」?</>, options: [{ key: "a", label: "Tas pakai ulang berguna untuk mengurangi sampah." }, { key: "b", label: "Tas itu dibiarkan terbuka." }, { key: "c", label: "Tas itu hanya dipakai sekali." }], answer: "a", explanation: <>V-るのにいい menyatakan bahwa sesuatu berguna untuk melakukan suatu tindakan.</> },
  { prompt: <>Apa arti 「資源ごみ」?</>, options: [{ key: "a", label: "Sampah yang dapat dimanfaatkan atau didaur ulang." }, { key: "b", label: "Sampah berukuran besar saja." }, { key: "c", label: "Sampah yang dibuang setiap hari tanpa pemilahan." }], answer: "a", explanation: <>資源ごみ adalah kategori sampah yang dapat dimanfaatkan sebagai sumber daya.</> },
  { prompt: <>Apa arti 「回収日」?</>, options: [{ key: "a", label: "Hari pengumpulan." }, { key: "b", label: "Hari libur sekolah." }, { key: "c", label: "Hari ulang tahun." }], answer: "a", explanation: <>回収日 berarti hari pengumpulan barang atau sampah.</> },
  { prompt: <>Ungkapan 「どうやって捨てればいいですか」 digunakan untuk apa?</>, options: [{ key: "a", label: "Menanyakan cara membuang sesuatu." }, { key: "b", label: "Menanyakan harga barang." }, { key: "c", label: "Menanyakan suhu udara." }], answer: "a", explanation: <>どうやって menanyakan cara, sedangkan 捨てればいいですか meminta saran tindakan.</> },
  { prompt: <>Apa arti 「燃えるごみ」 pada panduan pemilahan?</>, options: [{ key: "a", label: "Kategori sampah yang dapat dibakar." }, { key: "b", label: "Sampah daur ulang kertas saja." }, { key: "c", label: "Barang yang bisa digunakan kembali." }], answer: "a", explanation: <>燃えるごみ berarti sampah yang dapat dibakar menurut kategori panduan setempat.</> },
  { prompt: <>Mengapa jadwal sampah pada panduan contoh Fude tidak boleh dianggap sebagai jadwal sungguhan?</>, options: [{ key: "a", label: "Karena setiap wilayah dapat memiliki aturan dan jadwal berbeda." }, { key: "b", label: "Karena semua sampah selalu dibuang pada hari yang sama." }, { key: "c", label: "Karena panduan tidak pernah digunakan." }], answer: "a", explanation: <>Selalu ikuti panduan resmi dari wilayah tempat tinggal; contoh Fude hanya untuk latihan bahasa.</> },
];

export default function IrodoriElementaryTwoLessonFifteenPage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [ecoDraft, setEcoDraft] = useState("");

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

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#4B796C]/35 bg-gradient-to-br from-[#203A35] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#B2D7CB]/[0.08]">環</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#B2D7CB]">IRODORI • DASAR 2 A2 • PELAJARAN 15</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Lampu ruang rapat dibiarkan menyala.</h1>
          <p className="mt-2 text-sm font-semibold text-[#B2D7CB]">会議室の電気がついたままでした。</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar memahami poster ramah lingkungan, membicarakan kebiasaan hemat energi dan air, membaca panduan pemilahan sampah, serta bertanya tentang cara membuang sampah.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><CalendarDays size={14} className="text-[#B2D7CB]" />Alam dan lingkungan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#B2D7CB]" />Kebiasaan sehari-hari</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Gift size={14} className="text-[#B2D7CB]" />Hemat energi dan pemilahan</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#4B796C]/20 bg-[#1D302C]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target berikut mengikuti target komunikasi 64–67 pada Irodori Dasar 2 Lesson 15.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">{item.source} · {String(index + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#4B796C]/20 bg-[#192A26] p-4 md:p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Catatan: kebiasaan ramah lingkungan</h2>
        </div>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Kebiasaan sederhana seperti mematikan lampu yang tidak digunakan, menghemat air, memakai kedua sisi kertas, dan membawa tas pakai ulang dapat membantu mengurangi pemborosan.</p>
        <p className="mt-2 text-[10px] leading-5 text-[#887F74]">Contoh jadwal dan kategori sampah di halaman ini hanya untuk latihan. Aturan pemilahan dan hari pengumpulan yang sebenarnya berbeda menurut wilayah. Ikuti panduan resmi setempat dan tanyakan kepada orang tua atau wali jika belum yakin.</p>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Poster lingkungan, hemat energi, dan pemilahan sampah</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Lima percakapan berikut ditulis orisinal oleh Fude untuk melatih seluruh target komunikasi pelajaran ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Membaca poster ramah lingkungan" speakers={[friendYui, friendSota]} utterances={readEcoPosterConversation} />
          <IrodoriConversation title="Membicarakan penghematan listrik" speakers={[friendAkiko, friendKenji]} utterances={saveEnergyConversation} />
          <IrodoriConversation title="Menghemat air di rumah" speakers={[friendYui, friendAkiko]} utterances={saveWaterConversation} />
          <IrodoriConversation title="Membaca panduan pemilahan sampah" speakers={[friendKenji, friendSota]} utterances={readWasteGuideConversation} />
          <IrodoriConversation title="Bertanya cara membuang botol plastik" speakers={[friendAkiko, friendKenji]} utterances={askWasteDisposalConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#B2D7CB]" />
          <h2 className="text-lg font-black text-[#EAE6DD]">Mengenali poster kegiatan ramah lingkungan</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Perhatikan kata kerja dan tindakan yang diminta dalam setiap pemberitahuan.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {ecoPosters.map((item) => (
            <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base font-bold text-[#F1EBDD]">{item.title}</p>
              <p className="mt-2 text-xs leading-5 text-[#B2D7CB]">{item.meaning}</p>
              <p className="mt-1 text-[10px] leading-5 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#B2D7CB]" />
          <h2 className="text-lg font-black text-[#EAE6DD]">Kebiasaan untuk menjaga lingkungan</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Gunakan ungkapan berikut untuk menceritakan kebiasaan yang berusaha dilakukan secara rutin.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {ecoActions.map((item) => (
            <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <h3 className="text-xs font-bold text-[#B2D7CB]">{item.title}</h3>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.body}</p>
              <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#4B796C]/20 bg-[#192A26] p-4 md:p-5">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Contoh panduan pemilahan sampah</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Ini jadwal fiktif untuk latihan membaca. Cocokkan kategori, contoh barang, dan hari pengumpulan.</p>
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#F2EEE3] text-[#28251F]">
          <div className="bg-[#D9E2D8] px-4 py-3">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#455C50]">CONTOH FIKTIF · ごみの分け方・出し方</p>
            <h3 className="mt-1 font-mincho text-lg font-bold">ごみの分け方・出し方</h3>
          </div>
          <div className="divide-y divide-[#D8D2C5]">
            {wasteGuide.map((item) => (
              <div key={item.kind} className="grid gap-2 p-3 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center">
                <p className="font-mincho text-sm font-bold">{item.kind}</p>
                <div>
                  <p className="text-xs">{item.examples}</p>
                  <p className="mt-1 text-[10px] leading-5 text-[#665F54]">{item.meaning}</p>
                </div>
                <span className="rounded-md bg-[#D9E2D8] px-2 py-1 text-[10px] font-bold text-[#455C50]">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] leading-5 text-[#817A73]">Panduan di wilayah tempat tinggalmu dapat berbeda. Jangan menggunakan jadwal contoh ini untuk membuang sampah sungguhan.</p>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">KOSAKATA ALAM DAN LINGKUNGAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima puluh kosakata penting</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata lingkungan, penghematan, pemilahan sampah, serta petunjuk pengumpulan.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#B2D7CB]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">KANJI UTAMA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sepuluh kata kanji pada materi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenali kata kanji yang digunakan dalam poster dan panduan lingkungan.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-[#4B796C]/20 bg-[#192A26] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#B2D7CB]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">POLA TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dua pola untuk menjelaskan keadaan dan tujuan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari cara menyatakan keadaan yang terus berlangsung dan menjelaskan kegunaan suatu tindakan.</p>
        </div>
        {grammarNotes.map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-sm font-bold tracking-[0.02em] text-[#B2D7CB]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#B2D7CB]"><JapaneseReading allowIndexFallback romajiClassName="mt-1 text-sm italic text-[#D9B66D]">{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
        <article className="rounded-xl border border-[#4B796C]/20 bg-[#192A26] p-4">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">UNGKAPAN PENDUKUNG DARI DIALOG</p>
          <p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">V-るようにしています ／ V-ないようにしています</p>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">Ungkapan ini dipakai untuk menjelaskan kebiasaan atau usaha yang dilakukan secara rutin: 電気を消すようにしています (saya berusaha mematikan lampu), 水を出したままにしないようにしています (saya berusaha tidak membiarkan air mengalir).</p>
        </article>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#4B796C]/20 bg-[#192A26] p-4 md:p-5">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Latihan menulis kebiasaan ramah lingkungan</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Tuliskan dua hal yang berusaha kamu lakukan untuk menghemat sumber daya atau mengurangi sampah. Tambahkan alasan jika bisa.</p>
        <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">電気を消すようにしています。紙を節約するのに、両面コピーがいいです。</p>
        <label htmlFor="eco-habits-draft" className="block text-xs font-semibold text-[#B2D7CB]">Tulis kebiasaanmu dalam bahasa Jepang</label>
        <textarea id="eco-habits-draft" value={ecoDraft} onChange={(event) => setEcoDraft(event.target.value)} rows={4} placeholder="環境のために、..." className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#B2D7CB]/50" />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] text-[#817A73]">Draf hanya digunakan untuk latihan di halaman ini.</p>
          <span className="text-[10px] tabular-nums text-[#B2D7CB]">{ecoDraft.length} karakter</span>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">SIMULASI SITUASI</p>
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
              <p className="text-[9px] font-black tracking-[0.16em] text-[#B2D7CB]">{task.title}</p>
              <h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#4B796C]/20 bg-[#1D302C]/70 p-3">
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
                        ? "border-[#B2D7CB]/60 bg-[#4B796C]/15 text-[#F1EBDD]"
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
                <button type="button" disabled={!selected || isCorrect} onClick={() => setSimulationChecked((current) => ({ ...current, [index]: true }))} className="rounded-lg bg-[#4B796C] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#365B50] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">
                  {isCorrect ? "Selesai" : "Periksa"}
                </button>
              </div>
              {checked && isWrong && <p className="mt-2 text-[10px] text-[#E7A1A1]">{task.options.find((option) => option.key === task.answer)?.meaning}</p>}
            </article>
          );
        })}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
          <p className="text-xs text-[#A9A398]">Simulasi benar: {simulationScore} dari {simulations.length}.</p>
          <button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#4B796C]/35 px-4 py-2 text-xs font-bold text-[#B2D7CB]">
            <RefreshCw size={13} /> Ulangi simulasi
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B2D7CB]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {task.options.map((option) => (
                    <button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected === option.key} onClick={() => setPracticeAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (
                      practiceSubmitted && option.key === task.answer
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                        : practiceSubmitted && selected === option.key
                          ? "border-red-400/50 bg-red-400/10 text-red-200"
                          : selected === option.key
                            ? "border-[#B2D7CB]/60 bg-[#4B796C]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#4B796C]/35 px-4 py-2 text-xs font-bold text-[#B2D7CB]"><RefreshCw size={13} /> Ulangi praktik</button>
          ) : (
            <button type="button" onClick={() => setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length !== practiceTasks.length} className="rounded-lg bg-[#4B796C] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa praktik</button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B2D7CB]">SOAL {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.prompt}</JapaneseReading></h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {question.options.map((option) => (
                    <button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected === option.key} onClick={() => setAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors " + (
                      quizSubmitted && option.key === question.answer
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                        : quizSubmitted && selected === option.key
                          ? "border-red-400/50 bg-red-400/10 text-red-200"
                          : selected === option.key
                            ? "border-[#B2D7CB]/60 bg-[#4B796C]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#4B796C]/35 px-4 py-2 text-xs font-bold text-[#B2D7CB]"><RefreshCw size={13} /> Ulangi kuis</button>
          ) : (
            <button type="button" onClick={() => setQuizSubmitted(true)} disabled={Object.keys(answers).length !== quizQuestions.length} className="rounded-lg bg-[#4B796C] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa kuis</button>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#4B796C]/20 bg-[#1D302C]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi target komunikasi</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.</p>
        <div className="space-y-3">
          {canDos.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">{item.source}</p>
              <p className="mt-1 text-xs leading-5 text-[#EAE6DD]">{item.text}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {ratingOptions.map((option) => (
                  <button key={option.value} type="button" disabled={!canEvaluate} aria-pressed={visibleRatings[item.id] === option.value} onClick={() => {
                    const nextRatings = { ...visibleRatings, [item.id]: option.value };
                    setRatings(nextRatings);
                    saveIrodoriSelfEvaluation(lessonId, nextRatings);
                  }} className={"rounded-lg border px-3 py-2 text-left text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 " + (
                    visibleRatings[item.id] === option.value
                      ? "border-[#B2D7CB]/50 bg-[#4B796C]/20 text-[#F8EEDC]"
                      : "border-white/[0.07] bg-black/15 text-[#A9A398]"
                  )}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
          <p className="text-xs text-[#A9A398]">
            {isCompleted ? "Lesson 15 selesai." : canDosRated ? "Semua target komunikasi sudah dinilai." : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button type="button" onClick={finishLesson} disabled={!canComplete || isCompleted} className="rounded-xl bg-[#4B796C] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#365B50] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">
            {isCompleted ? "Lesson 15 selesai" : "Selesaikan Lesson 15"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Dasar 2 · 15 / 18</span>
      </div>
    </main>
  );
}
