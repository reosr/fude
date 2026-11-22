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
const lessonId = "elementary2-14";

const dryCleaningConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>このズボンをクリーニングに出したいんですが。</>, romaji: "Kono zubon o kuriiningu ni dashitai n desu ga.", translation: "Saya ingin menyerahkan celana ini untuk dicuci di penatu.", audioFileName: "irodori-elementary2-14-a01-l01.mp3" },
  { speakerId: "akiko", japanese: <>こちらにシミがありますね。シミ抜きもしますか。</>, romaji: "Kochira ni shimi ga arimasu ne. Shimi nuki mo shimasu ka?", translation: "Ada noda di bagian ini. Apakah ingin sekalian dilakukan penghilangan noda?", audioFileName: "irodori-elementary2-14-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>はい。別料金はいくらですか。</>, romaji: "Hai. Betsu ryoukin wa ikura desu ka?", translation: "Ya. Berapa biaya tambahannya?", audioFileName: "irodori-elementary2-14-a01-l03.mp3" },
  { speakerId: "akiko", japanese: <>この店では三百円です。仕上がりは三日後です。</>, romaji: "Kono mise de wa sanbyaku en desu. Shiagari wa mikka go desu.", translation: "Di toko ini biayanya 300 yen. Pakaian selesai tiga hari lagi.", audioFileName: "irodori-elementary2-14-a01-l04.mp3" },
];
const bicycleServiceConversation: IrodoriUtterance[] = [
  { speakerId: "sota", japanese: <>すみません、自転車のタイヤに空気を入れてもらえますか。</>, romaji: "Sumimasen, jitensha no taiya ni kuuki o irete moraemasu ka?", translation: "Permisi, bisakah Anda membantu mengisi angin ban sepeda saya?", audioFileName: "irodori-elementary2-14-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>はい。こちらへどうぞ。</>, romaji: "Hai. Kochira e douzo.", translation: "Tentu. Silakan ke sini.", audioFileName: "irodori-elementary2-14-a02-l02.mp3" },
  { speakerId: "sota", japanese: <>料金はかかりますか。</>, romaji: "Ryoukin wa kakarimasu ka?", translation: "Apakah ada biayanya?", audioFileName: "irodori-elementary2-14-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>空気入れは無料です。必要なら、タイヤも確認します。</>, romaji: "Kuuki ire wa muryou desu. Hitsuyou nara, taiya mo kakunin shimasu.", translation: "Pompa angin dapat digunakan gratis. Bila perlu, kami juga akan memeriksa ban.", audioFileName: "irodori-elementary2-14-a02-l04.mp3" },
];
const parcelDeliveryConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>荷物を送りたいんですが、元払いでお願いします。</>, romaji: "Nimotsu o okuritai n desu ga, moto barai de onegai shimasu.", translation: "Saya ingin mengirim paket. Saya akan membayar ongkos kirim di sini.", audioFileName: "irodori-elementary2-14-a03-l01.mp3" },
  { speakerId: "kenji", japanese: <>わかりました。こちらの伝票に、お届け先を書いてください。</>, romaji: "Wakarimashita. Kochira no denpyou ni, otodokesaki o kaite kudasai.", translation: "Baik. Silakan tulis alamat tujuan pada formulir ini.", audioFileName: "irodori-elementary2-14-a03-l02.mp3" },
  { speakerId: "akiko", japanese: <>配達日は、明日でもいいですか。</>, romaji: "Haitatsubi wa, ashita demo ii desu ka?", translation: "Apakah paketnya bisa dikirim besok?", audioFileName: "irodori-elementary2-14-a03-l03.mp3" },
  { speakerId: "kenji", japanese: <>はい。希望の時間帯も選べます。</>, romaji: "Hai. Kibou no jikantai mo erabemasu.", translation: "Bisa. Anda juga dapat memilih rentang waktu yang diinginkan.", audioFileName: "irodori-elementary2-14-a03-l04.mp3" },
];
const hairSalonConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>前髪を少し短くしてください。</>, romaji: "Maegami o sukoshi mijikaku shite kudasai.", translation: "Tolong potong poni saya sedikit lebih pendek.", audioFileName: "irodori-elementary2-14-a04-l01.mp3" },
  { speakerId: "sota", japanese: <>どのぐらい切りますか。</>, romaji: "Dono gurai kirimasu ka?", translation: "Ingin dipotong seberapa panjang?", audioFileName: "irodori-elementary2-14-a04-l02.mp3" },
  { speakerId: "yui", japanese: <>一センチぐらい切ってください。全体は長く残してください。</>, romaji: "Issenti gurai kitte kudasai. Zentai wa nagaku nokoshite kudasai.", translation: "Tolong potong sekitar satu sentimeter. Bagian lainnya biarkan tetap panjang.", audioFileName: "irodori-elementary2-14-a04-l03.mp3" },
  { speakerId: "sota", japanese: <>わかりました。最後に鏡で確認してください。</>, romaji: "Wakarimashita. Saigo ni kagami de kakunin shite kudasai.", translation: "Baik. Silakan periksa hasilnya dengan cermin pada akhir layanan.", audioFileName: "irodori-elementary2-14-a04-l04.mp3" },
];
const internationalSupportConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>この相談窓口では、どんなサービスがありますか。</>, romaji: "Kono soudan madoguchi de wa, donna saabisu ga arimasu ka?", translation: "Layanan apa saja yang tersedia di loket konsultasi ini?", audioFileName: "irodori-elementary2-14-a05-l01.mp3" },
  { speakerId: "akiko", japanese: <>外国の方のために、生活相談や通訳のサービスがあります。</>, romaji: "Gaikoku no kata no tame ni, seikatsu soudan ya tsuuyaku no saabisu ga arimasu.", translation: "Ada layanan konsultasi kehidupan dan penerjemah lisan untuk warga dari luar negeri.", audioFileName: "irodori-elementary2-14-a05-l02.mp3" },
  { speakerId: "kenji", japanese: <>英語以外の言葉でも相談できますか。</>, romaji: "Eigo igai no kotoba demo soudan dekimasu ka?", translation: "Apakah saya bisa berkonsultasi dalam bahasa selain bahasa Inggris?", audioFileName: "irodori-elementary2-14-a05-l03.mp3" },
  { speakerId: "akiko", japanese: <>はい。使える言語と時間を受付で確認してください。</>, romaji: "Hai. Tsukaeru gengo to jikan o uketsuke de kakunin shite kudasai.", translation: "Bisa. Silakan periksa bahasa yang tersedia dan waktunya di resepsionis.", audioFileName: "irodori-elementary2-14-a05-l04.mp3" },
];

const canDos = [
  { id: "understand-local-services", source: "CAN-DO 60", text: "Memahami penjelasan tentang cara menggunakan layanan seperti pengiriman paket, penatu, dan layanan lainnya." },
  { id: "understand-redelivery-notice", source: "CAN-DO 61", text: "Membaca pemberitahuan pengiriman saat penerima tidak ada di rumah dan memahami cara meminta pengiriman ulang." },
  { id: "explain-hairstyle-request", source: "CAN-DO 62", text: "Menyampaikan permintaan tentang model atau panjang potongan rambut di salon atau tempat pangkas rambut." },
  { id: "understand-international-services", source: "CAN-DO 63", text: "Memahami layanan untuk warga asing yang tersedia di pusat pertukaran internasional atau loket konsultasi." },
];

const vocabRows = [
  ["銀行", "ぎんこう · ginkou", "Bank"],
  ["郵便局", "ゆうびんきょく · yuubinkyoku", "Kantor pos"],
  ["理髪店", "りはつてん · rihatsuten", "Tempat pangkas rambut"],
  ["床屋", "とこや · tokoya", "Pangkas rambut (sebutan sehari-hari)"],
  ["美容院", "びよういん · biyouin", "Salon rambut"],
  ["クリーニング店", "クリーニングてん · kuriiningu ten", "Toko penatu atau dry cleaning"],
  ["コインランドリー", "コインランドリー · koin randorii", "Laundry koin"],
  ["自転車店", "じてんしゃてん · jitensha ten", "Toko sepeda"],
  ["リサイクルショップ", "リサイクルショップ · risaikuru shoppu", "Toko barang daur ulang atau bekas"],
  ["サービス", "サービス · saabisu", "Layanan"],
  ["利用する", "りようする · riyou suru", "Menggunakan atau memanfaatkan"],
  ["利用方法", "りようほうほう · riyou houhou", "Cara penggunaan"],
  ["料金", "りょうきん · ryoukin", "Biaya atau tarif"],
  ["別料金", "べつりょうきん · betsu ryoukin", "Biaya tambahan"],
  ["仕上がり", "しあがり · shiagari", "Hasil akhir atau waktu selesai"],
  ["受け取る", "うけとる · uketoru", "Menerima atau mengambil"],
  ["預ける", "あずける · azukeru", "Menitipkan"],
  ["お渡し", "おわたし · o-watashi", "Penyerahan atau pemberian"],
  ["シミ", "シミ · shimi", "Noda"],
  ["落ちる", "おちる · ochiru", "Hilang atau terangkat (noda)"],
  ["シミ抜き", "しみぬき · shimi nuki", "Penghilangan noda"],
  ["洗う", "あらう · arau", "Mencuci"],
  ["空気", "くうき · kuuki", "Udara"],
  ["空気入れ", "くうきいれ · kuuki ire", "Pompa angin"],
  ["タイヤ", "タイヤ · taiya", "Ban"],
  ["キャップ", "キャップ · kyappu", "Tutup atau katup kecil"],
  ["はずす", "はずす · hazusu", "Melepaskan"],
  ["はさむ", "はさむ · hasamu", "Menjepit"],
  ["かぶせる", "かぶせる · kabuseru", "Memasang penutup"],
  ["油を差す", "あぶらをさす · abura o sasu", "Memberi pelumas"],
  ["宅配便", "たくはいびん · takuhaibin", "Layanan pengiriman paket"],
  ["荷物", "にもつ · nimotsu", "Paket atau barang bawaan"],
  ["着払い", "ちゃくばらい · chakubarai", "Ongkos kirim dibayar penerima"],
  ["元払い", "もとばらい · motobarai", "Ongkos kirim dibayar pengirim"],
  ["伝票", "でんぴょう · denpyou", "Formulir pengiriman"],
  ["配達", "はいたつ · haitatsu", "Pengantaran"],
  ["再配達", "さいはいたつ · sai haitatsu", "Pengiriman ulang"],
  ["不在", "ふざい · fuzai", "Tidak berada di tempat"],
  ["通知", "つうち · tsuuchi", "Pemberitahuan"],
  ["受取人", "うけとりにん · uketorin nin", "Penerima"],
  ["保管期限", "ほかんきげん · hokan kigen", "Batas waktu penyimpanan"],
  ["郵便物", "ゆうびんぶつ · yuubinbutsu", "Kiriman pos"],
  ["希望時間帯", "きぼうじかんたい · kibou jikantai", "Rentang waktu yang diinginkan"],
  ["窓口", "まどぐち · madoguchi", "Loket layanan"],
  ["外国", "がいこく · gaikoku", "Negara asing atau luar negeri"],
  ["情報", "じょうほう · jouhou", "Informasi"],
  ["相談", "そうだん · soudan", "Konsultasi"],
  ["質問", "しつもん · shitsumon", "Pertanyaan"],
  ["自動", "じどう · jidou", "Otomatis"],
  ["入力する", "にゅうりょくする · nyuuryoku suru", "Memasukkan data"],
  ["近所", "きんじょ · kinjo", "Lingkungan sekitar"],
];

const kanjiWords = [
  ["外国", "がいこく · gaikoku", "Negara asing atau luar negeri"],
  ["情報", "じょうほう · jouhou", "Informasi"],
  ["相談", "そうだん · soudan", "Konsultasi"],
  ["質問", "しつもん · shitsumon", "Pertanyaan"],
  ["窓口", "まどぐち · madoguchi", "Loket layanan"],
  ["郵便局", "ゆうびんきょく · yuubinkyoku", "Kantor pos"],
  ["近所", "きんじょ · kinjo", "Lingkungan sekitar"],
  ["自動", "じどう · jidou", "Otomatis"],
  ["洗う", "あらう · arau", "Mencuci"],
  ["入力する", "にゅうりょくする · nyuuryoku suru", "Memasukkan data"],
];

const serviceExamples = [
  { title: "クリーニング店 · Penatu", body: "服を預けるとき、シミ抜きが必要か、別料金はいくらか、いつ受け取れるかを確認します。", meaning: "Saat menyerahkan pakaian, tanyakan apakah perlu penghilangan noda, berapa biaya tambahannya, dan kapan pakaian dapat diambil." },
  { title: "宅配便 · Pengiriman paket", body: "元払いか着払いかを確認して、伝票に必要な情報を書きます。配達日や希望時間帯も確認できます。", meaning: "Pastikan apakah ongkos kirim dibayar pengirim atau penerima, lalu isi informasi yang diperlukan pada formulir. Tanggal dan rentang waktu pengantaran juga dapat diperiksa." },
  { title: "自転車店 · Toko sepeda", body: "自転車の空気を入れたいとき、店の人にサービスの利用方法や料金を聞きます。", meaning: "Saat ingin menggunakan layanan pompa angin, tanyakan cara penggunaan dan biayanya kepada pegawai toko." },
  { title: "国際交流協会 · Pusat pertukaran internasional", body: "外国の方のために、生活相談、通訳、翻訳、生活ガイドブックなどのサービスがあります。", meaning: "Tersedia layanan konsultasi kehidupan, penerjemah lisan, terjemahan tertulis, dan buku panduan kehidupan untuk warga asing." },
];

const redeliveryNotice = [
  { label: "お知らせ", value: "郵便物等ご不在連絡票", meaning: "Pemberitahuan bahwa kiriman tidak dapat diserahkan karena penerima tidak ada." },
  { label: "受取人", value: "山田 花子（例）", meaning: "Nama penerima pada contoh fiktif." },
  { label: "配達日", value: "○月○日", meaning: "Tanggal pengantaran yang dicoba." },
  { label: "保管期限", value: "○月○日まで", meaning: "Batas akhir pengambilan atau pengaturan pengiriman ulang pada contoh." },
  { label: "再配達の方法", value: "窓口・電話・インターネット", meaning: "Pilihan cara untuk mengatur pengiriman ulang. Cara sebenarnya bergantung pada penyedia layanan." },
];

const salonPhrases = [
  { japanese: "前髪を少し短くしてください。", meaning: "Tolong potong poni sedikit lebih pendek." },
  { japanese: "全体的に短く切ってください。", meaning: "Tolong potong rambut secara keseluruhan lebih pendek." },
  { japanese: "上は長く、横は短くしてください。", meaning: "Bagian atas biarkan panjang, bagian samping potong pendek." },
  { japanese: "もう少し短く切ってもらえますか。", meaning: "Bisakah dipotong sedikit lebih pendek?" },
  { japanese: "写真のような感じにお願いします。", meaning: "Saya ingin hasil yang kurang lebih seperti foto ini." },
  { japanese: "シャンプーだけお願いします。", meaning: "Saya hanya ingin layanan keramas." },
];

const grammarNotes = [
  { title: "01 · Mengubah kata sifat menjadi keterangan", pattern: "ナA → ナA-に + V\nイA → イA-く + V", example: <>静かに話してください。<br />髪を短く切ってください。</>, note: "Bentuk ini menerangkan bagaimana suatu tindakan dilakukan. Untuk kata sifat-na, ubah な menjadi に: 静かな → 静かに. Untuk kata sifat-i, hilangkan い lalu tambahkan く: 早い → 早く、短い → 短く. Bentuk ini juga dapat dipakai dengan する: 部屋をきれいにする (membuat ruangan menjadi bersih)." },
  { title: "02 · Menyatakan untuk siapa atau untuk tujuan apa", pattern: "N のために、～\nN1 のための N2", example: <>外国の方のために、相談サービスがあります。<br />これは子どものための本です。</>, note: "Nのために menunjukkan orang atau tujuan yang mendapat manfaat: 家族のために (untuk keluarga), 健康のために (demi kesehatan). Bentuk N1のためのN2 menerangkan kata benda setelahnya: 外国の方のためのガイドブック (buku panduan untuk warga asing)." },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];
type Task = { prompt: ReactNode; options: { key: string; label: ReactNode }[]; answer: string; explanation: ReactNode; };
type Simulation = { title: string; heading: string; prompt: string; japanese: ReactNode; translation: string; options: { key: string; label: string; meaning: string }[]; answer: string; explanation: string; };

const simulations: Simulation[] = [
  { title: "01 · Menggunakan layanan penatu", heading: "Memahami biaya tambahan dan waktu selesai", prompt: "Pegawai mengatakan penghilangan noda membutuhkan biaya tambahan 300 yen dan pakaian selesai tiga hari lagi. Pernyataan mana yang benar?", japanese: <>シミ抜きは別料金で、三百円です。仕上がりは三日後です。</>, translation: "Penghilangan noda dikenai biaya tambahan 300 yen. Pakaian selesai tiga hari lagi.", options: [
    { key: "a", label: "Tidak ada biaya tambahan dan pakaian selesai hari ini.", meaning: "Penjelasan menyebut 別料金 dan 三日後, jadi ada biaya tambahan dan selesai tiga hari lagi." },
    { key: "b", label: "Biaya tambahan 300 yen dan selesai tiga hari lagi.", meaning: "Pernyataan ini sesuai dengan penjelasan pegawai." },
    { key: "c", label: "Biaya tambahannya 3.000 yen dan selesai besok.", meaning: "Jumlah dan waktunya tidak sesuai dengan informasi." },
  ], answer: "b", explanation: "Dengarkan jumlah biaya, jenis layanan tambahan, dan kapan barang dapat diambil." },
  { title: "02 · Membaca pemberitahuan pengiriman", heading: "Menentukan langkah berikutnya", prompt: "Kamu menemukan pemberitahuan bahwa kiriman tidak dapat diserahkan. Pilihan apa yang dapat dibaca pada contoh pemberitahuan?", japanese: <>郵便物等ご不在連絡票。再配達を申し込んでください。</>, translation: "Pemberitahuan kiriman saat penerima tidak ada. Silakan ajukan pengiriman ulang.", options: [
    { key: "a", label: "Mengajukan pengiriman ulang melalui salah satu cara yang tersedia.", meaning: "Pemberitahuan menjelaskan cara mengajukan pengiriman ulang." },
    { key: "b", label: "Mengabaikan tanggal batas penyimpanan.", meaning: "Batas penyimpanan adalah informasi penting yang perlu diperiksa." },
    { key: "c", label: "Mengirim ulang paket ke pengirim tanpa membaca pemberitahuan.", meaning: "Pemberitahuan meminta penerima memilih cara untuk menerima kiriman." },
  ], answer: "a", explanation: "Periksa tanggal, batas penyimpanan, dan pilihan cara pengiriman ulang. Contoh ini fiktif; ikuti petunjuk penyedia layanan sebenarnya." },
  { title: "03 · Menjelaskan potongan rambut", heading: "Mengutarakan permintaan secara jelas", prompt: "Kamu ingin poni dipotong sedikit lebih pendek. Kalimat mana yang sesuai?", japanese: <>前髪は、もう少し短く切ってもらえますか。</>, translation: "Bisakah poni dipotong sedikit lebih pendek?", options: [
    { key: "a", label: "前髪を長く洗ってください。", meaning: "Kalimat ini meminta poni dicuci lama, bukan dipotong lebih pendek." },
    { key: "b", label: "前髪は、もう少し短く切ってもらえますか。", meaning: "Ungkapan ini meminta perubahan potongan poni dengan sopan." },
    { key: "c", label: "前髪のために、店に行きます。", meaning: "Kalimat ini menyatakan pergi ke toko demi poni, bukan menyampaikan permintaan potongan." },
  ], answer: "b", explanation: "Gunakan ukuran atau bagian rambut yang jelas, lalu tanyakan dengan sopan jika meminta perubahan." },
  { title: "04 · Memahami layanan warga asing", heading: "Mengenali jenis layanan", prompt: "Pusat pertukaran internasional menyediakan konsultasi kehidupan dan penerjemah lisan. Informasi mana yang benar?", japanese: <>外国の方のために、生活相談や通訳があります。</>, translation: "Ada konsultasi kehidupan dan penerjemah lisan untuk warga asing.", options: [
    { key: "a", label: "Tempat itu hanya menjual barang.", meaning: "Informasi menyebut layanan konsultasi dan penerjemah, bukan penjualan." },
    { key: "b", label: "Tempat itu hanya menyediakan layanan potong rambut.", meaning: "Layanan potong rambut tidak disebutkan." },
    { key: "c", label: "Tempat itu menyediakan konsultasi kehidupan dan penerjemah lisan.", meaning: "Ini sesuai dengan penjelasan tentang layanan bagi warga asing." },
  ], answer: "c", explanation: "Perhatikan kata layanan seperti 相談 (konsultasi), 通訳 (penerjemah lisan), dan 翻訳 (terjemahan tertulis)." },
  { title: "05 · Meminta layanan dengan sopan", heading: "Menggunakan ungkapan permintaan", prompt: "Kamu ingin pegawai membantu mengisi angin ban sepeda. Kalimat mana yang paling sesuai?", japanese: <>タイヤに空気を入れてもらえますか。</>, translation: "Bisakah Anda membantu mengisi angin ban?", options: [
    { key: "a", label: "タイヤに空気を入れてもらえますか。", meaning: "～てもらえますか digunakan untuk meminta bantuan dengan sopan." },
    { key: "b", label: "タイヤは外国のためです。", meaning: "Kalimat ini tidak menyampaikan permintaan bantuan." },
    { key: "c", label: "空気が三日後に仕上がります。", meaning: "Kalimat ini tidak tepat untuk meminta bantuan di toko sepeda." },
  ], answer: "a", explanation: "～てもらえますか adalah cara sopan untuk meminta seseorang melakukan sesuatu bagi kita." },
];

const practiceTasks: Task[] = [
  { prompt: <>Ubah kata sifat-i 短い menjadi bentuk keterangan untuk menerangkan 切ります.</>, options: [{ key: "a", label: "短いに" }, { key: "b", label: "短く" }, { key: "c", label: "短いく" }], answer: "b", explanation: <>Kata sifat-i menghilangkan い lalu ditambah く: 短い → 短く.</> },
  { prompt: <>Ubah kata sifat-na 静かな menjadi bentuk keterangan.</>, options: [{ key: "a", label: "静かく" }, { key: "b", label: "静かなに" }, { key: "c", label: "静かに" }], answer: "c", explanation: <>Kata sifat-na mengubah な menjadi に: 静かな → 静かに.</> },
  { prompt: <>Apa arti 「外国の方のために、相談窓口があります」?</>, options: [{ key: "a", label: "Ada loket konsultasi untuk warga asing." }, { key: "b", label: "Warga asing bekerja di loket." }, { key: "c", label: "Loket konsultasi berada di luar negeri." }], answer: "a", explanation: <>Nのために menunjukkan pihak yang mendapat manfaat atau tujuan layanan.</> },
  { prompt: <>Pilih kalimat yang menggunakan bentuk keterangan dengan benar.</>, options: [{ key: "a", label: "部屋をきれいに掃除します。" }, { key: "b", label: "部屋をきれいな掃除します。" }, { key: "c", label: "部屋をきれいく掃除します。" }], answer: "a", explanation: <>きれい adalah kata sifat-na; bentuk keterangannya きれいに.</> },
  { prompt: <>Apa arti 「元払い」 pada layanan pengiriman?</>, options: [{ key: "a", label: "Penerima membayar ongkos kirim." }, { key: "b", label: "Pengirim membayar ongkos kirim." }, { key: "c", label: "Paket tidak perlu dikirim." }], answer: "b", explanation: <>元払い berarti biaya pengiriman dibayar oleh pengirim. 着払い berarti penerima yang membayar.</> },
  { prompt: <>Kalimat mana yang meminta potongan rambut sedikit lebih pendek secara sopan?</>, options: [{ key: "a", label: "もう少し短く切ってもらえますか。" }, { key: "b", label: "もう少し短いに切ります。" }, { key: "c", label: "もう少し短くのために。" }], answer: "a", explanation: <>～てもらえますか meminta bantuan atau tindakan dari orang lain dengan sopan.</> },
];

const quizQuestions: Task[] = [
  { prompt: <>Apa arti 「クリーニング店」?</>, options: [{ key: "a", label: "Toko penatu atau dry cleaning." }, { key: "b", label: "Toko sepeda." }, { key: "c", label: "Kantor pos." }], answer: "a", explanation: <>クリーニング店 adalah tempat untuk membersihkan pakaian sebagai layanan.</> },
  { prompt: <>Apa arti 「別料金」?</>, options: [{ key: "a", label: "Layanan gratis." }, { key: "b", label: "Biaya tambahan." }, { key: "c", label: "Waktu pengambilan." }], answer: "b", explanation: <>別料金 berarti ada biaya terpisah atau tambahan.</> },
  { prompt: <>Apa arti 「再配達」?</>, options: [{ key: "a", label: "Pengiriman ulang." }, { key: "b", label: "Pengiriman pertama." }, { key: "c", label: "Pengambilan di toko." }], answer: "a", explanation: <>再配達 berarti pengiriman yang dilakukan kembali.</> },
  { prompt: <>Apa fungsi 「元払い」?</>, options: [{ key: "a", label: "Pengirim membayar ongkos kirim." }, { key: "b", label: "Penerima membayar ongkos kirim." }, { key: "c", label: "Tidak ada biaya layanan." }], answer: "a", explanation: <>元払い adalah pembayaran ongkos kirim oleh pengirim; 着払い dibayar penerima.</> },
  { prompt: <>Pilih bentuk keterangan dari kata sifat-i 早い.</>, options: [{ key: "a", label: "早いに" }, { key: "b", label: "早く" }, { key: "c", label: "早いく" }], answer: "b", explanation: <>早い berubah menjadi 早く sebelum kata kerja.</> },
  { prompt: <>Pilih bentuk keterangan dari kata sifat-na 静か.</>, options: [{ key: "a", label: "静かに" }, { key: "b", label: "静かく" }, { key: "c", label: "静かな" }], answer: "a", explanation: <>静か menjadi 静かに untuk menerangkan kata kerja.</> },
  { prompt: <>Apa arti 「外国の方のためのガイドブック」?</>, options: [{ key: "a", label: "Buku panduan untuk warga asing." }, { key: "b", label: "Buku panduan dari luar negeri." }, { key: "c", label: "Buku panduan tentang salon." }], answer: "a", explanation: <>N1のためのN2 menerangkan bahwa N2 ditujukan untuk N1.</> },
  { prompt: <>Apa arti 「通訳」?</>, options: [{ key: "a", label: "Penerjemahan lisan atau juru bahasa." }, { key: "b", label: "Terjemahan dokumen tertulis." }, { key: "c", label: "Pengiriman paket." }], answer: "a", explanation: <>通訳 adalah penerjemahan secara lisan; 翻訳 biasanya untuk teks tertulis.</> },
  { prompt: <>Apa arti 「窓口」?</>, options: [{ key: "a", label: "Loket layanan." }, { key: "b", label: "Ruang tunggu." }, { key: "c", label: "Ruang cuci." }], answer: "a", explanation: <>窓口 adalah loket atau bagian layanan tempat orang bertanya dan mengurus keperluan.</> },
  { prompt: <>Ungkapan 「もう少し短く切ってもらえますか」 digunakan untuk apa?</>, options: [{ key: "a", label: "Meminta potongan sedikit lebih pendek dengan sopan." }, { key: "b", label: "Meminta pakaian dicuci." }, { key: "c", label: "Meminta paket dikirim ulang." }], answer: "a", explanation: <>～てもらえますか menyampaikan permintaan kepada orang lain dengan sopan.</> },
];

export default function IrodoriElementaryTwoLessonFourteenPage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [serviceDraft, setServiceDraft] = useState("");

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
        <ArrowLeft size={15} /> Kembali ke Elementary 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#4B796C]/35 bg-gradient-to-br from-[#203A35] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#B2D7CB]/[0.08]">店</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#B2D7CB]">IRODORI • ELEMENTARY 2 A2 • LESSON 14</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Will you cut my bangs a little shorter?</h1>
          <p className="mt-2 text-sm font-semibold text-[#B2D7CB]">前髪は、もう少し短く切ってもらえますか？</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar menggunakan layanan sehari-hari, membaca pemberitahuan pengiriman ulang, menyampaikan permintaan di salon, dan memahami layanan untuk warga asing.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><CalendarDays size={14} className="text-[#B2D7CB]" />Layanan sehari-hari</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#B2D7CB]" />Salon dan loket layanan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Gift size={14} className="text-[#B2D7CB]" />Petunjuk dan permintaan</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#4B796C]/20 bg-[#1D302C]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target berikut mengikuti Can-do 60–63 pada Irodori Elementary 2 Lesson 14.</p>
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
          <h2 className="text-sm font-bold text-[#EAE6DD]">Catatan: biaya dan informasi layanan</h2>
        </div>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Biaya, waktu penyelesaian, pilihan layanan, dan cara pengiriman dapat berbeda menurut penyedia layanan. Selalu periksa pemberitahuan terbaru atau tanyakan langsung kepada petugas.</p>
        <p className="mt-2 text-[10px] leading-5 text-[#887F74]">Nama, angka biaya, tanggal, serta contoh pemberitahuan di halaman Fude bersifat fiktif untuk latihan bahasa Jepang dan bukan petunjuk resmi layanan tertentu.</p>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Layanan penatu, pengiriman, salon, dan konsultasi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Lima percakapan berikut ditulis orisinal oleh Fude untuk melatih seluruh target komunikasi lesson ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Menyerahkan pakaian ke penatu" speakers={[friendYui, friendAkiko]} utterances={dryCleaningConversation} />
          <IrodoriConversation title="Meminta bantuan di toko sepeda" speakers={[friendSota, friendKenji]} utterances={bicycleServiceConversation} />
          <IrodoriConversation title="Mengirim paket" speakers={[friendAkiko, friendKenji]} utterances={parcelDeliveryConversation} />
          <IrodoriConversation title="Menyampaikan permintaan di salon" speakers={[friendYui, friendSota]} utterances={hairSalonConversation} />
          <IrodoriConversation title="Bertanya tentang layanan konsultasi" speakers={[friendKenji, friendAkiko]} utterances={internationalSupportConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#B2D7CB]" />
          <h2 className="text-lg font-black text-[#EAE6DD]">Contoh layanan dan cara menggunakannya</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Baca penjelasan singkat berikut untuk memahami jenis layanan dan informasi yang perlu ditanyakan.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {serviceExamples.map((item) => (
            <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <h3 className="text-xs font-bold text-[#B2D7CB]">{item.title}</h3>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.body}</p>
              <p className="mt-3 border-t border-white/[0.07] pt-3 text-[10px] leading-5 text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#4B796C]/20 bg-[#192A26] p-4 md:p-5">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Membaca pemberitahuan pengiriman ulang</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Contoh fiktif pemberitahuan saat kiriman tidak dapat diserahkan karena penerima tidak ada. Perhatikan jenis pemberitahuan, nama penerima, tanggal, dan batas penyimpanan.</p>
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#F2EEE3] text-[#28251F]">
          <div className="bg-[#D9E2D8] px-4 py-3">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#455C50]">CONTOH FIKTIF · 郵便局からのお知らせ</p>
            <h3 className="mt-1 font-mincho text-lg font-bold">郵便物等ご不在連絡票</h3>
          </div>
          <div className="grid gap-px bg-[#D8D2C5] sm:grid-cols-2">
            {redeliveryNotice.map((item) => (
              <div key={item.label} className="bg-[#F2EEE3] p-3">
                <p className="text-[9px] font-black tracking-[0.12em] text-[#68766B]">{item.label}</p>
                <p className="mt-1 font-mincho text-sm font-bold">{item.value}</p>
                <p className="mt-1 text-[10px] leading-5 text-[#665F54]">{item.meaning}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] leading-5 text-[#817A73]">Saat membaca pemberitahuan yang sebenarnya, periksa informasi terbaru dari penyedia layanan dan jaga data pribadi agar tidak dibagikan kepada orang yang tidak berwenang.</p>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">PERMINTAAN DI SALON</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menyampaikan keinginan dengan jelas</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Sebutkan layanan yang diinginkan, bagian rambut, panjang potongan, atau contoh foto. Periksa hasilnya dan sampaikan perubahan yang diinginkan dengan sopan.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {salonPhrases.map((item) => (
            <article key={item.japanese} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base leading-7 text-[#F1EBDD]">{item.japanese}</p>
              <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">KOSAKATA LAYANAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima puluh kosakata penting</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari nama tempat layanan, pengiriman, penatu, dan konsultasi untuk warga asing.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <p className="font-mincho text-base text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#B2D7CB]">{reading}</p>
              <p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">KANJI UTAMA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sepuluh kata kanji pada materi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenali kata-kata kanji yang muncul dalam materi Lesson 14.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-[#4B796C]/20 bg-[#192A26] p-3">
              <p className="font-mincho text-lg font-bold text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#B2D7CB]">{reading}</p>
              <p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">POLA TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dua pola untuk menjelaskan layanan dan permintaan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari cara menerangkan tindakan dengan kata sifat dan menjelaskan siapa yang menjadi tujuan suatu layanan.</p>
        </div>
        {grammarNotes.map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]">{item.pattern}</p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#B2D7CB]">{item.example}</p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]">{item.note}</p>
          </article>
        ))}
        <article className="rounded-xl border border-[#4B796C]/20 bg-[#192A26] p-4">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">UNGKAPAN PERMINTAAN</p>
          <p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">V-てください ／ V-てもらえますか</p>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">てください menyampaikan permintaan secara langsung dan sopan. てもらえますか terdengar lebih tidak langsung ketika meminta seseorang melakukan sesuatu untuk kita: もう少し短く切ってもらえますか。</p>
        </article>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#4B796C]/20 bg-[#192A26] p-4 md:p-5">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Latihan menulis permintaan layanan</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Pilih satu layanan, lalu tulis apa yang ingin kamu minta dan informasi apa yang perlu kamu tanyakan. Kamu dapat menggunakan pola kata sifat dan ungkapan permintaan.</p>
        <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">前髪を少し短くしてください。料金はいくらですか。</p>
        <label htmlFor="service-request-draft" className="block text-xs font-semibold text-[#B2D7CB]">Tulis permintaanmu dalam bahasa Jepang</label>
        <textarea id="service-request-draft" value={serviceDraft} onChange={(event) => setServiceDraft(event.target.value)} rows={4} placeholder="このサービスを利用したいんですが..." className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#B2D7CB]/50" />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] text-[#817A73]">Draf hanya digunakan untuk latihan di halaman ini.</p>
          <span className="text-[10px] tabular-nums text-[#B2D7CB]">{serviceDraft.length} karakter</span>
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
              <p className="mt-2 text-xs leading-6 text-[#A9A398]">{task.prompt}</p>
              <div className="mt-3 rounded-xl border border-[#4B796C]/20 bg-[#1D302C]/70 p-3">
                <p className="font-mincho text-base leading-7 text-[#F1EBDD]">{task.japanese}</p>
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
                    {option.label}
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
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B2D7CB]">PRACTICE {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">{task.prompt}</h3>
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
                    )}>{option.label}</button>
                  ))}
                </div>
                {practiceSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
                    {task.explanation}
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
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B2D7CB]">QUESTION {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">{question.prompt}</h3>
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
                    )}>{option.label}</button>
                  ))}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-[10px] leading-5 text-[#A9A398]">
                    <span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>
                    {question.explanation}
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
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi Can-do</h2>
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
                  )}>{option.label}</button>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
          <p className="text-xs text-[#A9A398]">
            {isCompleted ? "Lesson 14 selesai. Progres tersimpan." : canDosRated ? "Semua target Can-do sudah dinilai." : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button type="button" onClick={finishLesson} disabled={!canComplete || isCompleted} className="rounded-xl bg-[#4B796C] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#365B50] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">
            {isCompleted ? "Lesson 14 selesai" : "Selesaikan Lesson 14"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Elementary 2 · 14 / 18</span>
      </div>
    </main>
  );
}
