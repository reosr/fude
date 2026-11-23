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
const lessonId = "elementary2-13";

const facilityTourConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>この建物には、どんな施設がありますか。</>, romaji: "Kono tatemono ni wa, donna shisetsu ga arimasu ka?", translation: "Fasilitas apa saja yang ada di gedung ini?", audioFileName: "irodori-elementary2-13-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>図書館と市民ホール、それから美術展示室があります。</>, romaji: "Toshokan to shimin hooru, sorekara bijutsu tenjishitsu ga arimasu.", translation: "Ada perpustakaan, aula komunitas, dan ruang pameran seni.", audioFileName: "irodori-elementary2-13-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>ホールでは、どんなことができますか。</>, romaji: "Hooru de wa, donna koto ga dekimasu ka?", translation: "Kegiatan apa yang bisa dilakukan di aula?", audioFileName: "irodori-elementary2-13-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>音楽会や地域の行事に使われています。</>, romaji: "Ongakukai ya chiiki no gyouji ni tsukawarete imasu.", translation: "Aula itu digunakan untuk konser dan berbagai kegiatan masyarakat.", audioFileName: "irodori-elementary2-13-a01-l04.mp3" },
];
const gymRulesConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>すみません、スポーツジムを初めて利用するんですが。</>, romaji: "Sumimasen, supootsu jimu o hajimete riyou suru n desu ga.", translation: "Permisi, saya baru pertama kali menggunakan gym.", audioFileName: "irodori-elementary2-13-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>受付で登録してください。室内用のシューズが必要です。</>, romaji: "Uketsuke de touroku shite kudasai. Shitsunaiyou no shuuzu ga hitsuyou desu.", translation: "Silakan mendaftar di resepsionis. Sepatu khusus dalam ruangan diperlukan.", audioFileName: "irodori-elementary2-13-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>マシンの使い方は、教えてもらえますか。</>, romaji: "Mashin no tsukaikata wa, oshiete moraemasu ka?", translation: "Bisa tolong ajari saya cara menggunakan alatnya?", audioFileName: "irodori-elementary2-13-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>はい。初めての方には、スタッフが説明します。</>, romaji: "Hai. Hajimete no kata ni wa, sutaffu ga setsumei shimasu.", translation: "Tentu. Staf akan menjelaskan cara penggunaannya kepada pengunjung baru.", audioFileName: "irodori-elementary2-13-a02-l04.mp3" },
];
const libraryCardConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>図書館を使いたいんですが、利用カードが必要ですか。</>, romaji: "Toshokan o tsukaitai n desu ga, riyou kaado ga hitsuyou desu ka?", translation: "Saya ingin menggunakan perpustakaan. Apakah perlu kartu anggota?", audioFileName: "irodori-elementary2-13-a03-l01.mp3" },
  { speakerId: "akiko", japanese: <>はい。初めに、受付で利用カードを作ってください。</>, romaji: "Hai. Hajime ni, uketsuke de riyou kaado o tsukutte kudasai.", translation: "Ya. Pertama, silakan buat kartu perpustakaan di loket.", audioFileName: "irodori-elementary2-13-a03-l02.mp3" },
  { speakerId: "yui", japanese: <>本は何冊まで借りられますか。</>, romaji: "Hon wa nansatsu made kariraremasu ka?", translation: "Berapa buku maksimal yang bisa dipinjam?", audioFileName: "irodori-elementary2-13-a03-l03.mp3" },
  { speakerId: "akiko", japanese: <>一人八冊まで、二週間借りられます。</>, romaji: "Hitori hassatsu made, nishuukan kariraremasu.", translation: "Setiap orang bisa meminjam maksimal delapan buku selama dua minggu.", audioFileName: "irodori-elementary2-13-a03-l04.mp3" },
];
const libraryReturnConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>図書館が閉まっているとき、本を返すにはどうしますか。</>, romaji: "Toshokan ga shimatte iru toki, hon o kaesu ni wa dou shimasu ka?", translation: "Bagaimana cara mengembalikan buku saat perpustakaan tutup?", audioFileName: "irodori-elementary2-13-a04-l01.mp3" },
  { speakerId: "sota", japanese: <>入口の横にある返却ポストに入れてください。</>, romaji: "Iriguchi no yoko ni aru henkyaku posuto ni irete kudasai.", translation: "Masukkan ke kotak pengembalian di samping pintu masuk.", audioFileName: "irodori-elementary2-13-a04-l02.mp3" },
  { speakerId: "kenji", japanese: <>DVDも返却ポストに入れていいですか。</>, romaji: "DVD mo henkyaku posuto ni irete ii desu ka?", translation: "Apakah DVD juga boleh dimasukkan ke kotak pengembalian?", audioFileName: "irodori-elementary2-13-a04-l03.mp3" },
  { speakerId: "sota", japanese: <>いいえ。DVDは、図書館が開いているときに返してください。</>, romaji: "Iie. DVD wa, toshokan ga aite iru toki ni kaeshite kudasai.", translation: "Tidak. DVD harus dikembalikan saat perpustakaan buka.", audioFileName: "irodori-elementary2-13-a04-l04.mp3" },
];
const facilitySignsConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>入口に「撮影禁止」と書いてありますね。</>, romaji: "Iriguchi ni 'satsuei kinshi' to kaite arimasu ne.", translation: "Di pintu masuk tertulis 'Dilarang memotret', ya.", audioFileName: "irodori-elementary2-13-a05-l01.mp3" },
  { speakerId: "sota", japanese: <>ここでは、写真を撮ってはいけないという意味です。</>, romaji: "Koko de wa, shashin o totte wa ikenai to iu imi desu.", translation: "Artinya, kita tidak boleh mengambil foto di sini.", audioFileName: "irodori-elementary2-13-a05-l02.mp3" },
  { speakerId: "yui", japanese: <>大きなかばんは、どうすればいいですか。</>, romaji: "Ookina kaban wa, dou sureba ii desu ka?", translation: "Apa yang harus dilakukan dengan tas besar?", audioFileName: "irodori-elementary2-13-a05-l03.mp3" },
  { speakerId: "sota", japanese: <>ロッカーにお預けください、と書いてあります。</>, romaji: "Rokkaa ni o-azuke kudasai, to kaite arimasu.", translation: "Tertulis, 'Silakan titipkan di loker'.", audioFileName: "irodori-elementary2-13-a05-l04.mp3" },
];

const canDos = [
  { id: "understand-facility-tour", source: "CAN-DO 55", text: "Memahami penjelasan saat diajak berkeliling fasilitas, termasuk apa yang tersedia dan kegiatan yang dapat dilakukan." },
  { id: "understand-public-facility-rules", source: "CAN-DO 56", text: "Memahami penjelasan tentang cara menggunakan fasilitas umum seperti gym, serta aturan yang berlaku." },
  { id: "ask-library-usage", source: "CAN-DO 57", text: "Bertanya tentang cara menggunakan perpustakaan dan memahami jawaban petugas." },
  { id: "read-library-guide", source: "CAN-DO 58", text: "Membaca panduan penggunaan perpustakaan dalam bahasa Jepang sederhana dan memahami isinya." },
  { id: "understand-prohibition-signs", source: "CAN-DO 59", text: "Memahami tanda dan pemberitahuan di dalam fasilitas, seperti larangan memotret atau makan dan minum." },
];

const vocabRows = [
  ["市", "し · shi", "Kota atau pemerintahan kota"],
  ["市民", "しみん · shimin", "Warga kota"],
  ["公共施設", "こうきょうしせつ · koukyou shisetsu", "Fasilitas umum"],
  ["文化施設", "ぶんかしせつ · bunka shisetsu", "Fasilitas kebudayaan"],
  ["施設", "しせつ · shisetsu", "Fasilitas"],
  ["ホール", "ホール · hooru", "Aula"],
  ["図書館", "としょかん · toshokan", "Perpustakaan"],
  ["美術館", "びじゅつかん · bijutsukan", "Museum seni"],
  ["博物館", "はくぶつかん · hakubutsukan", "Museum"],
  ["民俗資料館", "みんぞくしりょうかん · minzoku shiryokan", "Museum sejarah dan budaya rakyat"],
  ["体育館", "たいいくかん · taiikukan", "Gedung olahraga"],
  ["スポーツジム", "スポーツジム · supootsu jimu", "Pusat kebugaran"],
  ["プール", "プール · puuru", "Kolam renang"],
  ["入浴施設", "にゅうよくしせつ · nyuuyoku shisetsu", "Fasilitas pemandian"],
  ["インフォメーションコーナー", "インフォメーションコーナー · infomeeshon koonaa", "Pusat informasi"],
  ["物産コーナー", "ぶっさんコーナー · bussan koonaa", "Area produk khas daerah"],
  ["展示する", "てんじする · tenji suru", "Memamerkan atau memajang"],
  ["資料", "しりょう · shiryou", "Bahan informasi atau dokumen"],
  ["道具", "どうぐ · dougu", "Alat atau perlengkapan"],
  ["歴史", "れきし · rekishi", "Sejarah"],
  ["文化", "ぶんか · bunka", "Budaya"],
  ["行事", "ぎょうじ · gyouji", "Acara atau kegiatan"],
  ["利用する", "りようする · riyou suru", "Menggunakan atau memanfaatkan"],
  ["利用方法", "りようほうほう · riyou houhou", "Cara penggunaan"],
  ["規則", "きそく · kisoku", "Peraturan"],
  ["料金", "りょうきん · ryoukin", "Biaya atau tarif"],
  ["延長料金", "えんちょうりょうきん · enchou ryoukin", "Biaya tambahan untuk perpanjangan"],
  ["必要", "ひつよう · hitsuyou", "Perlu atau diperlukan"],
  ["室内用", "しつないよう · shitsunaiyou", "Untuk digunakan di dalam ruangan"],
  ["靴", "くつ · kutsu", "Sepatu"],
  ["更衣室", "こういしつ · kouishitsu", "Ruang ganti"],
  ["受付", "うけつけ · uketsuke", "Resepsionis atau loket"],
  ["利用カード", "りようカード · riyou kaado", "Kartu anggota atau kartu pengguna"],
  ["確認する", "かくにんする · kakunin suru", "Memeriksa atau memastikan"],
  ["住所", "じゅうしょ · juusho", "Alamat"],
  ["借りる", "かりる · kariru", "Meminjam"],
  ["返す", "かえす · kaesu", "Mengembalikan"],
  ["返却ポスト", "へんきゃくポスト · henkyaku posuto", "Kotak pengembalian buku"],
  ["開く", "あく · aku", "Buka (misalnya perpustakaan buka)"],
  ["閉まる", "しまる · shimaru", "Tutup (misalnya perpustakaan tutup)"],
  ["返却日", "へんきゃくび · henkyakubi", "Tanggal pengembalian"],
  ["～冊", "～さつ · ~satsu", "Kata bantu hitung untuk buku"],
  ["～点", "～てん · ~ten", "Kata bantu hitung untuk barang"],
  ["延ばす", "のばす · nobasu", "Memperpanjang"],
  ["予約", "よやく · yoyaku", "Pemesanan atau reservasi"],
  ["撮影禁止", "さつえいきんし · satsuei kinshi", "Dilarang memotret"],
  ["立入禁止", "たちいりきんし · tachiiri kinshi", "Dilarang masuk"],
  ["飲食禁止", "いんしょくきんし · inshoku kinshi", "Dilarang makan dan minum"],
  ["館内", "かんない · kannai", "Di dalam gedung"],
  ["預ける", "あずける · azukeru", "Menitipkan atau menyimpan sementara"],
];

const kanjiWords = [
  ["市", "し · shi", "Kota"],
  ["料金", "りょうきん · ryoukin", "Biaya atau tarif"],
  ["図書館", "としょかん · toshokan", "Perpustakaan"],
  ["道具", "どうぐ · dougu", "Alat atau perlengkapan"],
  ["～点", "～てん · ~ten", "Kata bantu hitung barang"],
  ["必要", "ひつよう · hitsuyou", "Perlu atau diperlukan"],
  ["借りる", "かりる · kariru", "Meminjam"],
  ["返す", "かえす · kaesu", "Mengembalikan"],
  ["開く", "あく · aku", "Buka"],
  ["閉まる", "しまる · shimaru", "Tutup"],
  ["利用する", "りようする · riyou suru", "Menggunakan atau memanfaatkan"],
];

const libraryGuide = [
  { title: "かりるとき · Saat meminjam", body: "図書館カードと借りたい本を受付に持ってきてください。一人八冊まで、二週間借りられます。", meaning: "Bawa kartu perpustakaan dan buku yang ingin dipinjam ke loket. Setiap orang dapat meminjam maksimal delapan buku selama dua minggu." },
  { title: "かえすとき · Saat mengembalikan", body: "図書館が閉まっているときは、本を返却ポストに入れてください。DVDは、図書館が開いているときに返してください。", meaning: "Saat perpustakaan tutup, masukkan buku ke kotak pengembalian. DVD harus dikembalikan saat perpustakaan buka." },
  { title: "予約するとき · Saat memesan", body: "読みたい本が貸し出し中のときは、受付で予約できます。返却日を延ばしたいときは、受付に確認してください。", meaning: "Jika buku yang ingin dibaca sedang dipinjam, kamu dapat memesannya di loket. Tanyakan kepada petugas jika ingin memperpanjang tanggal pengembalian." },
];

const signExamples = [
  { sign: "撮影禁止", meaning: "Dilarang memotret atau merekam.", note: "Jangan memotret di area tersebut." },
  { sign: "関係者以外 立入禁止", meaning: "Selain petugas atau orang yang berkepentingan, dilarang masuk.", note: "Area tersebut hanya untuk orang yang berwenang." },
  { sign: "食べ物・飲み物の持ち込みはご遠慮ください", meaning: "Mohon tidak membawa makanan atau minuman dari luar.", note: "ご遠慮ください adalah permintaan sopan untuk tidak melakukan sesuatu." },
  { sign: "館内での通話はお控えください", meaning: "Mohon tidak melakukan panggilan telepon di dalam gedung.", note: "お控えください adalah ungkapan sopan untuk meminta seseorang menahan diri." },
  { sign: "大きなかばんはロッカーにお預けください", meaning: "Silakan titipkan tas besar di loker.", note: "お預けください adalah bentuk sopan dari 預けてください." },
];

const grammarNotes = [
  { title: "01 · Bentuk pasif", pattern: "V-(ら)れます", example: <>このホールは、去年建てられました。<br />この部屋は、地域の会議に使われています。</>, note: "Bentuk pasif digunakan ketika fokus kalimat ada pada benda atau orang yang menerima tindakan. Untuk kata kerja kelompok 2, hilangkan ます lalu tambahkan られます: 建てます → 建てられます. Untuk kelompok 1, ubah bunyi akhir bentuk kamus ke baris あ lalu tambahkan れます: 使う → 使われます. Kata kerja tidak beraturan: します → されます, 来ます → 来られます." },
  { title: "02 · Menyatakan sesuatu sudah disiapkan atau dipasang", pattern: "V-てあります", example: <>ロビーに案内のパンフレットが置いてあります。<br />昔の道具が展示してあります。</>, note: "Gunakan bentuk て + あります untuk menyatakan keadaan hasil dari tindakan yang sengaja dilakukan seseorang. Fokusnya pada hasil yang masih ada sekarang: 置く → 置いてあります、展示する → 展示してあります. Berbeda dari ています yang lebih sering menyatakan keadaan atau kegiatan berlangsung." },
  { title: "03 · Tidak hanya A, tetapi juga B", pattern: "N1 だけじゃなくて、N2 も～", example: <>この施設には、図書館だけじゃなくて、プールもあります。</>, note: "Pola ini menambahkan informasi lain: bukan hanya N1, N2 juga. Ungkapan だけじゃなくて lebih percakapan; bentuk だけでなくて lebih formal. Partikel も dipakai pada bagian kedua." },
  { title: "04 · Menentukan batas atau kondisi", pattern: "N なら、～", example: <>市内の図書館なら、どこでも返せます。</>, note: "なら mengangkat suatu hal sebagai kondisi atau topik: “kalau untuk/perihal ...”. Pada contoh, aturan pengembalian berlaku jika perpustakaannya berada di dalam kota tersebut." },
  { title: "05 · Kata tanya + V-ても", pattern: "[Kata tanya] + V-ても、～", example: <>この本は、市内の図書館なら、どこに返してもいいです。</>, note: "Gabungkan kata tanya dengan bentuk て + も untuk menyatakan “di mana pun”, “kapan pun”, atau “siapa pun”. どこに返してもいい berarti boleh mengembalikannya di perpustakaan mana pun dalam wilayah yang dimaksud. Bentuk ～てもいい juga menyatakan izin." },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];
type Task = { prompt: ReactNode; options: { key: string; label: ReactNode }[]; answer: string; explanation: ReactNode; };
type Simulation = { title: string; heading: string; prompt: string; japanese: ReactNode; translation: string; options: { key: string; label: string; meaning: string }[]; answer: string; explanation: string; };

const simulations: Simulation[] = [
  { title: "01 · Memahami tur fasilitas", heading: "Mengenali fasilitas dan kegiatannya", prompt: "Pemandu menjelaskan bahwa gedung memiliki perpustakaan, aula, dan ruang pameran. Aula digunakan untuk acara masyarakat. Pernyataan mana yang sesuai?", japanese: <>図書館とホールがあります。ホールは地域の行事に使われています。</>, translation: "Ada perpustakaan dan aula. Aula digunakan untuk kegiatan masyarakat.", options: [
    { key: "a", label: "Gedung hanya memiliki kolam renang.", meaning: "Penjelasan menyebut perpustakaan dan aula, bukan kolam renang." },
    { key: "b", label: "Aula digunakan untuk kegiatan masyarakat.", meaning: "Pernyataan ini sesuai dengan penjelasan pemandu." },
    { key: "c", label: "Aula tidak dapat digunakan untuk acara.", meaning: "Pemandu menjelaskan bahwa aula digunakan untuk kegiatan." },
  ], answer: "b", explanation: "Dengarkan nama fasilitas dan kegiatan yang dilakukan di dalamnya." },
  { title: "02 · Memahami aturan gym", heading: "Menangkap petunjuk penggunaan", prompt: "Staf menjelaskan bahwa sepatu khusus dalam ruangan diperlukan dan pengguna baru akan mendapat penjelasan dari staf. Apa yang harus disiapkan?", japanese: <>室内用のシューズが必要です。初めての方には、スタッフが説明します。</>, translation: "Diperlukan sepatu khusus untuk di dalam ruangan. Staf akan menjelaskan cara penggunaannya kepada pengunjung baru.", options: [
    { key: "a", label: "Sepatu khusus dalam ruangan.", meaning: "Staf secara jelas mengatakan 室内用のシューズが必要です." },
    { key: "b", label: "Kartu perpustakaan.", meaning: "Kartu perpustakaan tidak disebutkan dalam aturan gym." },
    { key: "c", label: "Buku yang akan dipinjam.", meaning: "Buku tidak berkaitan dengan penggunaan gym." },
  ], answer: "a", explanation: "必要です menyatakan bahwa sesuatu diperlukan. Perhatikan juga petunjuk khusus untuk pengguna baru." },
  { title: "03 · Bertanya tentang peminjaman", heading: "Memahami jumlah dan lama pinjaman", prompt: "Petugas menjawab: 「本は一人八冊まで、二週間借りられます。」 Berapa jumlah buku maksimal dan lama peminjaman?", japanese: <>本は一人八冊まで、二週間借りられます。</>, translation: "Setiap orang bisa meminjam maksimal delapan buku selama dua minggu.", options: [
    { key: "a", label: "Delapan buku selama dua hari.", meaning: "二週間 berarti dua minggu, bukan dua hari." },
    { key: "b", label: "Delapan buku selama dua minggu.", meaning: "八冊まで berarti maksimal delapan buku; 二週間 berarti dua minggu." },
    { key: "c", label: "Dua buku selama delapan minggu.", meaning: "Jumlah dan durasinya tertukar." },
  ], answer: "b", explanation: "～冊 adalah kata bantu hitung buku; まで menandakan batas maksimal." },
  { title: "04 · Membaca panduan pengembalian", heading: "Memilih cara mengembalikan barang", prompt: "Panduan menyebut buku boleh dimasukkan ke kotak saat perpustakaan tutup, tetapi DVD harus dikembalikan saat perpustakaan buka. Apa yang dilakukan saat perpustakaan tutup?", japanese: <>図書館が閉まっているときは、本を返却ポストに入れてください。</>, translation: "Saat perpustakaan tutup, masukkan buku ke kotak pengembalian.", options: [
    { key: "a", label: "Masukkan buku ke kotak pengembalian.", meaning: "Panduan menyebut buku dapat dikembalikan melalui 返却ポスト." },
    { key: "b", label: "Masukkan DVD ke kotak pengembalian.", meaning: "Panduan meminta DVD dikembalikan saat perpustakaan buka." },
    { key: "c", label: "Simpan semua buku selamanya.", meaning: "Panduan menjelaskan cara mengembalikan buku, bukan menyimpannya." },
  ], answer: "a", explanation: "Bedakan aturan untuk buku dan DVD. Tidak semua barang dapat dikembalikan melalui kotak." },
  { title: "05 · Memahami tanda larangan", heading: "Mengartikan pemberitahuan di fasilitas", prompt: "Di ruang pamer tertulis 「撮影禁止」. Apa maksud tanda tersebut?", japanese: <>撮影禁止</>, translation: "Dilarang memotret atau merekam.", options: [
    { key: "a", label: "Silakan mengambil foto.", meaning: "禁止 menyatakan larangan, bukan izin." },
    { key: "b", label: "Dilarang mengambil foto.", meaning: "撮影 berarti fotografi atau pengambilan gambar; 禁止 berarti dilarang." },
    { key: "c", label: "Foto harus dikumpulkan di loket.", meaning: "Tanda ini tidak menyebut pengumpulan foto." },
  ], answer: "b", explanation: "Kata 禁止 menunjukkan bahwa suatu tindakan tidak diperbolehkan." },
];

const practiceTasks: Task[] = [
  { prompt: <>Lengkapi bentuk pasif: 「この建物は、去年＿＿＿＿。」 (建てます)</>, options: [{ key: "a", label: "建てました" }, { key: "b", label: "建てられました" }, { key: "c", label: "建ててあります" }], answer: "b", explanation: <>建てる adalah kata kerja kelompok 2. Bentuk pasifnya 建てられます, bentuk lampau sopannya 建てられました.</> },
  { prompt: <>Lengkapi kalimat: 「ロビーにパンフレットが置いて＿＿＿＿。」</>, options: [{ key: "a", label: "います" }, { key: "b", label: "あります" }, { key: "c", label: "ください" }], answer: "b", explanation: <>V-てあります menyatakan keadaan hasil dari tindakan yang sengaja dilakukan.</> },
  { prompt: <>Pilih pasangan yang tepat untuk pola 「N1だけじゃなくて、N2も～」.</>, options: [{ key: "a", label: "図書館だけじゃなくて、ホールもあります。" }, { key: "b", label: "図書館なら、ホールだけです。" }, { key: "c", label: "図書館を、ホールまで。" }], answer: "a", explanation: <>Pola ini berarti bukan hanya perpustakaan, aula juga tersedia.</> },
  { prompt: <>Apa arti 「市内の図書館なら、どこでも返せます」?</>, options: [{ key: "a", label: "Hanya boleh mengembalikan di satu perpustakaan." }, { key: "b", label: "Jika perpustakaannya berada di dalam kota itu, buku bisa dikembalikan di mana saja." }, { key: "c", label: "Buku tidak bisa dikembalikan." }], answer: "b", explanation: <>なら menyatakan kondisi/topik; どこでも berarti di mana saja.</> },
  { prompt: <>Lengkapi pola kata tanya + V-ても: 「＿＿＿＿に返してもいいです。」</>, options: [{ key: "a", label: "どこ" }, { key: "b", label: "どの" }, { key: "c", label: "どんな" }], answer: "a", explanation: <>どこに返してもいい berarti boleh mengembalikannya di mana pun yang memenuhi kondisi.</> },
  { prompt: <>Apa makna tanda 「飲食禁止」?</>, options: [{ key: "a", label: "Dilarang makan dan minum." }, { key: "b", label: "Makanan dan minuman gratis." }, { key: "c", label: "Silakan membawa makanan." }], answer: "a", explanation: <>飲食 berarti makan dan minum; 禁止 berarti larangan.</> },
];

const quizQuestions: Task[] = [
  { prompt: <>Apa arti 「公共施設」?</>, options: [{ key: "a", label: "Fasilitas umum." }, { key: "b", label: "Toko pribadi." }, { key: "c", label: "Rumah keluarga." }], answer: "a", explanation: <>公共施設 adalah fasilitas yang dapat digunakan masyarakat.</> },
  { prompt: <>Pilih bentuk pasif yang benar dari 「使います」.</>, options: [{ key: "a", label: "使われます" }, { key: "b", label: "使ってあります" }, { key: "c", label: "使いますられます" }], answer: "a", explanation: <>Kata kerja kelompok 1 使う berubah menjadi 使われます dalam bentuk pasif.</> },
  { prompt: <>Apa fungsi 「V-てあります」?</>, options: [{ key: "a", label: "Menyatakan keadaan hasil dari tindakan yang sengaja dilakukan." }, { key: "b", label: "Menyatakan larangan." }, { key: "c", label: "Membandingkan dua pilihan." }], answer: "a", explanation: <>パンフレットが置いてあります menggambarkan pamflet yang sudah diletakkan dan masih tersedia.</> },
  { prompt: <>Apa makna 「本だけじゃなくて、CDも借りられます」?</>, options: [{ key: "a", label: "Hanya buku yang bisa dipinjam." }, { key: "b", label: "Bukan hanya buku, CD juga bisa dipinjam." }, { key: "c", label: "Buku dan CD tidak bisa dipinjam." }], answer: "b", explanation: <>だけじゃなくて menambahkan hal lain; も berarti juga.</> },
  { prompt: <>Dalam 「市内の図書館なら」, apa fungsi なら?</>, options: [{ key: "a", label: "Menyatakan kondisi atau topik yang dibatasi." }, { key: "b", label: "Menyatakan waktu lampau." }, { key: "c", label: "Menyatakan larangan." }], answer: "a", explanation: <>なら berarti kira-kira “kalau untuk/perihal ...” dalam konteks ini.</> },
  { prompt: <>Apa arti 「どこに返してもいいです」?</>, options: [{ key: "a", label: "Tidak boleh mengembalikan di mana pun." }, { key: "b", label: "Boleh mengembalikannya di mana saja." }, { key: "c", label: "Harus mengembalikannya besok." }], answer: "b", explanation: <>Kata tanya + ても dapat berarti “di mana pun”; ～てもいい menyatakan izin.</> },
  { prompt: <>Apa arti kata bantu hitung 「～冊」?</>, options: [{ key: "a", label: "Untuk menghitung buku." }, { key: "b", label: "Untuk menghitung orang." }, { key: "c", label: "Untuk menghitung hari." }], answer: "a", explanation: <>冊 (さつ) dipakai untuk menghitung buku atau jilid.</> },
  { prompt: <>Apa arti 「返却ポスト」?</>, options: [{ key: "a", label: "Kotak pengembalian." }, { key: "b", label: "Kartu anggota." }, { key: "c", label: "Ruang ganti." }], answer: "a", explanation: <>返却 berarti pengembalian dan ポスト berarti kotak pos.</> },
  { prompt: <>Apa arti 「ご遠慮ください」 pada pemberitahuan?</>, options: [{ key: "a", label: "Mohon jangan lakukan atau mohon hindari." }, { key: "b", label: "Silakan lakukan sekarang." }, { key: "c", label: "Layanan sudah tutup." }], answer: "a", explanation: <>ご遠慮ください adalah ungkapan sopan untuk meminta orang tidak melakukan sesuatu.</> },
  { prompt: <>Apa arti 「関係者以外 立入禁止」?</>, options: [{ key: "a", label: "Semua pengunjung boleh masuk." }, { key: "b", label: "Selain orang yang berkepentingan, dilarang masuk." }, { key: "c", label: "Pintu masuk berada di sebelah kanan." }], answer: "b", explanation: <>関係者以外 berarti selain orang yang berkepentingan; 立入禁止 berarti dilarang masuk.</> },
];

export default function IrodoriElementaryTwoLessonThirteenPage() {
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
        <ArrowLeft size={15} /> Kembali ke Dasar 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#4B796C]/35 bg-gradient-to-br from-[#203A35] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#B2D7CB]/[0.08]">公</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#B2D7CB]">IRODORI • DASAR 2 A2 • PELAJARAN 13</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Mereka memajang banyak bahan.</h1>
          <p className="mt-2 text-sm font-semibold text-[#B2D7CB]">いろいろな資料を展示してあります。</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Mengenal fasilitas umum, memahami aturan gym dan perpustakaan, bertanya tentang cara peminjaman, membaca panduan layanan, dan memahami tanda larangan.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><CalendarDays size={14} className="text-[#B2D7CB]" />Fasilitas umum</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#B2D7CB]" />Perpustakaan dan gym</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Gift size={14} className="text-[#B2D7CB]" />Aturan dan tanda</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#4B796C]/20 bg-[#1D302C]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Lima target berikut mengikuti target komunikasi 55–59 pada Irodori Dasar 2 Lesson 13.</p>
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
          <h2 className="text-sm font-bold text-[#EAE6DD]">Catatan: aturan fasilitas umum</h2>
        </div>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Setiap tempat dapat memiliki ketentuan berbeda tentang biaya, jam buka, peminjaman, dan barang yang boleh dibawa. Bacalah pengumuman terbaru atau tanyakan langsung kepada petugas fasilitas tersebut.</p>
        <p className="mt-2 text-[10px] leading-5 text-[#887F74]">Nama tempat, angka biaya, dan ketentuan pada contoh Fude bersifat fiktif untuk latihan bahasa. Jangan menganggapnya sebagai aturan fasilitas sungguhan.</p>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tur fasilitas, aturan penggunaan, dan perpustakaan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Lima percakapan berikut ditulis orisinal oleh Fude untuk melatih seluruh target komunikasi pelajaran ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Berkeliling fasilitas umum" speakers={[friendYui, friendSota]} utterances={facilityTourConversation} />
          <IrodoriConversation title="Bertanya tentang aturan gym" speakers={[friendAkiko, friendKenji]} utterances={gymRulesConversation} />
          <IrodoriConversation title="Membuat kartu perpustakaan" speakers={[friendYui, friendAkiko]} utterances={libraryCardConversation} />
          <IrodoriConversation title="Mengembalikan buku dan DVD" speakers={[friendKenji, friendSota]} utterances={libraryReturnConversation} />
          <IrodoriConversation title="Membaca tanda di fasilitas" speakers={[friendYui, friendSota]} utterances={facilitySignsConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#B2D7CB]" />
          <h2 className="text-lg font-black text-[#EAE6DD]">Contoh panduan perpustakaan</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Baca informasi dalam bahasa Jepang sederhana, lalu perhatikan kata kerja dan aturan yang digunakan.</p>
        <div className="grid gap-3 md:grid-cols-3">
          {libraryGuide.map((item) => (
            <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <h3 className="text-xs font-bold text-[#B2D7CB]">{item.title}</h3>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.body}</p>
              <p className="mt-3 border-t border-white/[0.07] pt-3 text-[10px] leading-5 text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">TANDA DAN PEMBERITAHUAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Mengenali larangan dan permintaan sopan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan perbedaan bentuk larangan langsung dan ungkapan sopan yang meminta pengunjung menghindari sesuatu.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {signExamples.map((item) => (
            <article key={item.sign} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base font-bold text-[#F1EBDD]">{item.sign}</p>
              <p className="mt-2 text-xs leading-5 text-[#B2D7CB]">{item.meaning}</p>
              <p className="mt-1 text-[10px] leading-5 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">KOSAKATA FASILITAS DAN LAYANAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima puluh kosakata penting</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari nama fasilitas umum, layanan, peminjaman, dan tanda yang sering dijumpai di tempat umum.</p>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kosakata kanji dari materi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenali kata-kata kanji yang muncul pada pelajaran ini.</p>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima pola untuk memahami layanan dan aturan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari bentuk pasif, hasil tindakan yang masih tersedia, penambahan informasi, kondisi, dan pola kata tanya.</p>
        </div>
        {grammarNotes.map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#B2D7CB]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-[#4B796C]/20 bg-[#192A26] p-4 md:p-5">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Latihan menulis panduan singkat</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Bayangkan kamu sedang menjelaskan satu fasilitas kepada pengunjung baru. Tulis fasilitas yang tersedia, cara menggunakannya, dan satu aturan yang perlu diketahui.</p>
        <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">この施設には、図書館とホールがあります。利用カードを作ってください。館内で食べないでください。</p>
        <label htmlFor="service-guide-draft" className="block text-xs font-semibold text-[#B2D7CB]">Tulis panduanmu dalam bahasa Jepang</label>
        <textarea id="service-guide-draft" value={serviceDraft} onChange={(event) => setServiceDraft(event.target.value)} rows={4} placeholder="この施設には、図書館があります。..." className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#B2D7CB]/50" />
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
            {isCompleted ? "Lesson 13 selesai. Progres tersimpan." : canDosRated ? "Semua target komunikasi sudah dinilai." : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button type="button" onClick={finishLesson} disabled={!canComplete || isCompleted} className="rounded-xl bg-[#4B796C] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#365B50] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">
            {isCompleted ? "Lesson 13 selesai" : "Selesaikan Lesson 13"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Dasar 2 · 13 / 18</span>
      </div>
    </main>
  );
}
