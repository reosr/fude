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
const lessonId = "elementary2-16";

const emergencyNewsConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>ニュースで、台風が近づいていると言っていましたね。</>, romaji: "Nyuusu de, taifuu ga chikazuite iru to itte imashita ne.", translation: "Di berita tadi dikatakan bahwa topan sedang mendekat, ya.", audioFileName: "irodori-elementary2-16-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>はい。大雨のおそれがあるそうです。</>, romaji: "Hai. Ooame no osore ga aru sou desu.", translation: "Ya. Katanya ada kemungkinan hujan lebat.", audioFileName: "irodori-elementary2-16-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>何を確認したらいいですか。</>, romaji: "Nani o kakunin shitara ii desu ka?", translation: "Apa yang sebaiknya diperiksa?", audioFileName: "irodori-elementary2-16-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>市のアナウンスを聞いて、最新の情報を確認してください。</>, romaji: "Shi no anaunsu o kiite, saishin no jouhou o kakunin shite kudasai.", translation: "Dengarkan pengumuman kota dan periksa informasi terbaru.", audioFileName: "irodori-elementary2-16-a01-l04.mp3" },
];
const evacuationDrillConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>これから、学校の避難訓練が始まります。</>, romaji: "Kore kara, gakkou no hinan kunren ga hajimarimasu.", translation: "Sebentar lagi latihan evakuasi sekolah dimulai.", audioFileName: "irodori-elementary2-16-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>先生の説明を聞けばいいですか。</>, romaji: "Sensei no setsumei o kikeba ii desu ka?", translation: "Apakah saya perlu mendengarkan penjelasan guru?", audioFileName: "irodori-elementary2-16-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>はい。係の人の指示に従って、落ち着いて行動してください。</>, romaji: "Hai. Kakari no hito no shiji ni shitagatte, ochitsuite koudou shite kudasai.", translation: "Ya. Ikuti instruksi petugas dan bertindaklah dengan tenang.", audioFileName: "irodori-elementary2-16-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>わかりました。勝手に動かないようにします。</>, romaji: "Wakarimashita. Katte ni ugokanai you ni shimasu.", translation: "Baik. Saya akan berusaha untuk tidak bergerak sendiri tanpa arahan.", audioFileName: "irodori-elementary2-16-a02-l04.mp3" },
];
const earthquakeExplanationConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>地震の説明会で、何を聞きましたか。</>, romaji: "Jishin no setsumeikai de, nani o kikimashita ka?", translation: "Apa yang kamu dengar pada sesi penjelasan tentang gempa?", audioFileName: "irodori-elementary2-16-a03-l01.mp3" },
  { speakerId: "akiko", japanese: <>揺れを感じたときは、まず身を守ることが大切だと聞きました。</>, romaji: "Yure o kanjita toki wa, mazu mi o mamoru koto ga taisetsu da to kikimashita.", translation: "Saya mendengar bahwa saat merasakan guncangan, yang penting adalah melindungi diri terlebih dahulu.", audioFileName: "irodori-elementary2-16-a03-l02.mp3" },
  { speakerId: "yui", japanese: <>大きな地震が来ても、あわてないことですね。</>, romaji: "Ookina jishin ga kite mo, awatenai koto desu ne.", translation: "Jadi, meskipun gempa besar terjadi, kita tidak perlu panik, ya.", audioFileName: "irodori-elementary2-16-a03-l03.mp3" },
  { speakerId: "akiko", japanese: <>はい。無理をしないで、係の人の案内を聞いてください。</>, romaji: "Hai. Muri o shinaide, kakari no hito no annai o kiite kudasai.", translation: "Ya. Jangan memaksakan diri dan dengarkan arahan petugas.", audioFileName: "irodori-elementary2-16-a03-l04.mp3" },
];
const askShelterInformationConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>この近くの避難所がどこか、知っていますか。</>, romaji: "Kono chikaku no hinanjo ga doko ka, shitte imasu ka?", translation: "Apakah kamu tahu di mana tempat pengungsian di dekat sini?", audioFileName: "irodori-elementary2-16-a04-l01.mp3" },
  { speakerId: "sota", japanese: <>市の案内によると、北小学校の体育館だそうです。</>, romaji: "Shi no annai ni yoru to, Kita shougakkou no taiikukan da sou desu.", translation: "Menurut informasi kota, tempatnya di gedung olahraga SD Kita.", audioFileName: "irodori-elementary2-16-a04-l02.mp3" },
  { speakerId: "kenji", japanese: <>今、開いているかどうか、どこで確認できますか。</>, romaji: "Ima, aite iru ka dou ka, doko de kakunin dekimasu ka?", translation: "Di mana saya bisa memeriksa apakah tempat itu sedang dibuka?", audioFileName: "irodori-elementary2-16-a04-l03.mp3" },
  { speakerId: "sota", japanese: <>市の公式情報で確認できます。先生や家族にも聞いてください。</>, romaji: "Shi no koushiki jouhou de kakunin dekimasu. Sensei ya kazoku ni mo kiite kudasai.", translation: "Kamu bisa memeriksanya melalui informasi resmi kota. Tanyakan juga kepada guru atau keluarga.", audioFileName: "irodori-elementary2-16-a04-l04.mp3" },
];
const readPreparednessPamphletConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>この防災パンフレットには、何が書いてありますか。</>, romaji: "Kono bousai pamphlet ni wa, nani ga kaite arimasu ka?", translation: "Apa yang tertulis dalam brosur kesiapsiagaan bencana ini?", audioFileName: "irodori-elementary2-16-a05-l01.mp3" },
  { speakerId: "kenji", japanese: <>非常用の品物や、連絡先を確認することが書いてあります。</>, romaji: "Hijouyou no shinamono ya, renrakusaki o kakunin suru koto ga kaite arimasu.", translation: "Tertulis tentang memeriksa barang-barang darurat dan kontak penting.", audioFileName: "irodori-elementary2-16-a05-l02.mp3" },
  { speakerId: "akiko", japanese: <>どんな品物が紹介されていますか。</>, romaji: "Donna shinamono ga shoukai sarete imasu ka?", translation: "Barang-barang apa yang diperkenalkan?", audioFileName: "irodori-elementary2-16-a05-l03.mp3" },
  { speakerId: "kenji", japanese: <>水やライト、ラジオなどです。地域の案内も読んでおくといいそうです。</>, romaji: "Mizu ya raito, rajio nado desu. Chiiki no annai mo yonde oku to ii sou desu.", translation: "Seperti air, lampu, dan radio. Katanya, sebaiknya kita juga membaca informasi wilayah setempat.", audioFileName: "irodori-elementary2-16-a05-l04.mp3" },
];

const canDos = [
  { id: "understand-emergency-announcements", source: "CAN-DO 68", text: "Mendengarkan berita atau pengumuman tentang bencana dan memahami apa yang terjadi serta informasi yang disampaikan." },
  { id: "understand-evacuation-drills", source: "CAN-DO 69", text: "Mendengarkan penjelasan dan instruksi dalam latihan kesiapsiagaan, lalu memahami hal yang perlu diperhatikan." },
  { id: "understand-earthquake-explanations", source: "CAN-DO 70", text: "Mendengarkan penjelasan sederhana tentang hal yang dibahas saat terjadi gempa dan memahami garis besarnya." },
  { id: "ask-disaster-information", source: "CAN-DO 71", text: "Menanyakan informasi yang diperlukan kepada orang di sekitar dalam situasi bencana." },
  { id: "read-disaster-pamphlet", source: "CAN-DO 72", text: "Membaca brosur pencegahan bencana yang ditulis dengan bahasa Jepang sederhana dan memahami isinya." },
];

const vocabRows = [
  ["災害", "さいがい · saigai", "Bencana"],
  ["台風", "たいふう · taifuu", "Topan"],
  ["地震", "じしん · jishin", "Gempa bumi"],
  ["火事", "かじ · kaji", "Kebakaran"],
  ["大雪", "おおゆき · ooyuki", "Salju lebat"],
  ["津波", "つなみ · tsunami", "Tsunami"],
  ["揺れる", "ゆれる · yureru", "Berguncang atau bergoyang"],
  ["警報", "けいほう · keihou", "Peringatan atau alarm"],
  ["緊急地震速報", "きんきゅうじしんそくほう · kinkyuu jishin sokuhou", "Peringatan dini gempa"],
  ["ニュース", "ニュース · nyuusu", "Berita"],
  ["放送", "ほうそう · housou", "Siaran atau pengumuman"],
  ["アナウンス", "アナウンス · anaunsu", "Pengumuman"],
  ["安全", "あんぜん · anzen", "Aman atau keselamatan"],
  ["危険", "きけん · kiken", "Bahaya"],
  ["避難する", "ひなんする · hinan suru", "Mengungsi atau melakukan evakuasi"],
  ["避難所", "ひなんじょ · hinanjo", "Tempat pengungsian"],
  ["避難訓練", "ひなんくんれん · hinan kunren", "Latihan evakuasi"],
  ["防災", "ぼうさい · bousai", "Pencegahan dan kesiapsiagaan bencana"],
  ["防災訓練", "ぼうさいくんれん · bousai kunren", "Latihan kesiapsiagaan bencana"],
  ["指示", "しじ · shiji", "Instruksi atau arahan"],
  ["係員", "かかりいん · kakariin", "Petugas"],
  ["集まる", "あつまる · atsumaru", "Berkumpul"],
  ["並ぶ", "ならぶ · narabu", "Berbaris atau mengantre"],
  ["点呼する", "てんこする · tenko suru", "Memeriksa kehadiran"],
  ["報告する", "ほうこくする · houkoku suru", "Melaporkan"],
  ["姿勢", "しせい · shisei", "Postur atau posisi tubuh"],
  ["煙", "けむり · kemuri", "Asap"],
  ["床", "ゆか · yuka", "Lantai"],
  ["注意点", "ちゅういてん · chuuiten", "Hal yang perlu diperhatikan"],
  ["消防署", "しょうぼうしょ · shoubousho", "Kantor pemadam kebakaran"],
  ["火災報知器", "かさいほうちき · kasai houchiki", "Alarm kebakaran"],
  ["断水する", "だんすいする · dansui suru", "Mengalami penghentian pasokan air"],
  ["停電する", "ていでんする · teiden suru", "Mengalami pemadaman listrik"],
  ["通行止め", "つうこうどめ · tsuukoudome", "Jalan ditutup untuk lalu lintas"],
  ["給水車", "きゅうすいしゃ · kyuusuisha", "Kendaraan pemasok air"],
  ["炊き出し", "たきだし · takidashi", "Penyediaan makanan untuk umum"],
  ["非常食", "ひじょうしょく · hijoushoku", "Makanan untuk keadaan darurat"],
  ["懐中電灯", "かいちゅうでんとう · kaichuudentou", "Senter"],
  ["ラジオ", "ラジオ · rajio", "Radio"],
  ["毛布", "もうふ · moufu", "Selimut"],
  ["寝袋", "ねぶくろ · nebukuro", "Kantong tidur"],
  ["水", "みず · mizu", "Air"],
  ["非常持ち出し袋", "ひじょうもちだしぶくろ · hijou mochidashi bukuro", "Tas perlengkapan darurat"],
  ["貴重品", "きちょうひん · kichouhin", "Barang berharga"],
  ["薬", "くすり · kusuri", "Obat"],
  ["情報", "じょうほう · jouhou", "Informasi"],
  ["ハザードマップ", "ハザードマップ · hazaado mappu", "Peta risiko bencana"],
  ["地域", "ちいき · chiiki", "Wilayah atau daerah"],
  ["準備する", "じゅんびする · junbi suru", "Mempersiapkan"],
  ["確認する", "かくにんする · kakunin suru", "Memeriksa atau memastikan"],
];

const kanjiWords = [
  ["地震", "じしん · jishin", "Gempa bumi"],
  ["台風", "たいふう · taifuu", "Topan"],
  ["外", "そと · soto", "Luar atau bagian luar"],
  ["声", "こえ · koe", "Suara"],
  ["危ない", "あぶない · abunai", "Berbahaya"],
  ["大切（な）", "たいせつ（な） · taisetsu (na)", "Penting"],
  ["心配（な）", "しんぱい（な） · shinpai (na)", "Khawatir"],
  ["集まる", "あつまる · atsumaru", "Berkumpul"],
  ["進む", "すすむ · susumu", "Maju atau bergerak maju"],
];

const announcementCards = [
  { title: "台風のお知らせ", body: "台風が近づいています。最新の情報を確認してください。", meaning: "Topan sedang mendekat. Silakan periksa informasi terbaru.", note: "Kata kunci: 台風, 近づく, 最新の情報." },
  { title: "地震に関する速報", body: "強い揺れに注意してください。落ち着いて放送を聞いてください。", meaning: "Harap waspada terhadap guncangan kuat. Dengarkan siaran dengan tenang.", note: "Kata kunci: 揺れ, 注意する, 放送." },
  { title: "施設からのお知らせ", body: "係員の指示に従ってください。", meaning: "Silakan mengikuti arahan petugas.", note: "Kata kunci: 係員, 指示, 従う." },
  { title: "避難所の情報", body: "避難所が開いているかどうか、市の公式情報で確認してください。", meaning: "Periksa melalui informasi resmi kota apakah tempat pengungsian sedang dibuka.", note: "Pola: V普通形＋かどうか." },
];

const preparednessItems = [
  { jp: "水", reading: "みず · mizu", meaning: "Air minum" },
  { jp: "非常食", reading: "ひじょうしょく · hijoushoku", meaning: "Makanan untuk keadaan darurat" },
  { jp: "懐中電灯", reading: "かいちゅうでんとう · kaichuudentou", meaning: "Senter" },
  { jp: "ラジオ", reading: "ラジオ · rajio", meaning: "Radio" },
  { jp: "毛布", reading: "もうふ · moufu", meaning: "Selimut" },
  { jp: "連絡先のメモ", reading: "れんらくさきのメモ · renrakusaki no memo", meaning: "Catatan kontak penting" },
];

const grammarNotes = [
  { title: "01 · Bentuk perintah dan larangan", pattern: "V（命令形）／ V-るな", example: <>集まる → 集まれ。<br />走る → 走るな。</>, note: "Bentuk perintah digunakan untuk memberi instruksi dengan sangat tegas. Untuk kata kerja kelompok 1, akhiran bunyi -u berubah menjadi -e (行く → 行け, 待つ → 待て). Kelompok 2 mengubah る menjadi ろ (逃げる → 逃げろ). する menjadi しろ dan 来る menjadi 来い. Bentuk larangan dibuat dengan menambahkan な pada bentuk kamus: 行くな、見るな、するな. Bentuk ini perlu dikenali saat membaca atau mendengar instruksi; dalam percakapan biasa, gunakan bentuk yang lebih sopan." },
  { title: "02 · Meminta orang berusaha menghindari sesuatu", pattern: "V-ないようにしてください", example: <>あわてないようにしてください。<br />説明を聞き逃さないようにしてください。</>, note: "Pola ini digunakan untuk meminta seseorang berusaha agar tidak melakukan sesuatu. Bentuk dasarnya adalah kata kerja bentuk ない + ようにしてください. Contoh: 忘れないようにしてください (usahakan jangan lupa)." },
  { title: "03 · Menyatakan perubahan menjadi tidak bisa atau tidak terjadi", pattern: "V-（られ）なくなります", example: <>停電すると、電気が使えなくなります。<br />道が通れなくなりました。</>, note: "Ubah bentuk negatif ない menjadi なく, lalu tambahkan なります. Pola ini menyatakan perubahan keadaan atau menjadi tidak dapat melakukan sesuatu. Contoh: 使えない → 使えなくなります, 通れない → 通れなくなります." },
  { title: "04 · Menyatakan 'meskipun ...'", pattern: "Sでも", example: <>雨が降っても、イベントは行われます。<br />忙しくても、連絡してください。</>, note: "Untuk kata kerja, gunakan bentuk て + も (降っても). Kata sifat い berubah menjadi くても (忙しくても), sedangkan kata benda dan kata sifat な menggunakan でも (雨でも、静かでも). Artinya, keadaan pada bagian pertama tidak menghalangi peristiwa pada bagian berikutnya." },
  { title: "05 · Menyatakan apakah sesuatu benar atau tidak", pattern: "V（普通形）かどうか、～", example: <>避難所が開いているかどうか、確認します。<br />給水車が来るかどうか、知っていますか。</>, note: "Pola かどうか berarti 'apakah ... atau tidak'. Letakkan setelah bentuk biasa kata kerja, kata sifat, atau kalimat yang ingin dipastikan. Pola ini dapat digunakan dengan わかりません, 知っていますか, atau 確認します." },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];
type Task = { prompt: ReactNode; options: { key: string; label: ReactNode }[]; answer: string; explanation: ReactNode; };
type Simulation = { title: string; heading: string; prompt: string; japanese: ReactNode; translation: string; options: { key: string; label: string; meaning: string }[]; answer: string; explanation: string; };

const simulations: Simulation[] = [
  { title: "01 · Memahami berita bencana", heading: "Menangkap inti pengumuman", prompt: "Dalam siaran fiktif terdengar 「台風が近づいています。最新の情報を確認してください。」. Informasi apa yang disampaikan?", japanese: <>台風が近づいています。最新の情報を確認してください。</>, translation: "Topan sedang mendekat. Silakan periksa informasi terbaru.", options: [
    { key: "a", label: "Ada informasi bahwa topan sedang mendekat.", meaning: "台風が近づいています menyampaikan bahwa topan sedang mendekat." },
    { key: "b", label: "Sebuah acara sekolah telah dimulai.", meaning: "Tidak ada kata tentang acara sekolah dalam pengumuman." },
    { key: "c", label: "Tempat pengungsian sudah ditutup.", meaning: "Kalimat tersebut tidak menyebut penutupan tempat pengungsian." },
  ], answer: "a", explanation: "Perhatikan kata 台風 dan 近づいています untuk menangkap pokok beritanya." },
  { title: "02 · Memahami instruksi latihan", heading: "Mengenali larangan yang tegas", prompt: "Dalam konteks latihan, petugas berkata 「走るな」. Apa makna ungkapan tersebut?", japanese: <>走るな。</>, translation: "Jangan berlari.", options: [
    { key: "a", label: "Silakan berlari.", meaning: "走るな adalah bentuk larangan, bukan ajakan." },
    { key: "b", label: "Jangan berlari.", meaning: "Bentuk kamus 走る ditambah な menjadi larangan tegas." },
    { key: "c", label: "Apakah kamu sedang berlari?", meaning: "Kalimat ini bukan pertanyaan." },
  ], answer: "b", explanation: "Bentuk V-るな adalah bentuk larangan yang terdengar tegas; kenali maknanya saat mendengar instruksi." },
  { title: "03 · Memahami penjelasan gempa", heading: "Memahami perubahan keadaan", prompt: "Penjelasan menyebut 「停電すると、電気が使えなくなります」. Apa yang terjadi saat listrik padam?", japanese: <>停電すると、電気が使えなくなります。</>, translation: "Jika terjadi pemadaman listrik, listrik tidak dapat digunakan.", options: [
    { key: "a", label: "Listrik menjadi lebih murah.", meaning: "Kalimat tidak membahas harga listrik." },
    { key: "b", label: "Listrik tidak dapat digunakan.", meaning: "使えなくなります menyatakan perubahan menjadi tidak bisa digunakan." },
    { key: "c", label: "Listrik menyala sepanjang hari.", meaning: "Maknanya justru menyatakan tidak dapat digunakan." },
  ], answer: "b", explanation: "V-なくなります menjelaskan perubahan menjadi keadaan negatif atau tidak dapat melakukan sesuatu." },
  { title: "04 · Menanyakan informasi tempat pengungsian", heading: "Memilih pertanyaan yang tepat", prompt: "Kamu ingin memastikan apakah sebuah tempat pengungsian sedang dibuka. Kalimat mana yang tepat?", japanese: <>避難所が開いているかどうか、知っていますか。</>, translation: "Apakah kamu tahu apakah tempat pengungsian sedang dibuka atau tidak?", options: [
    { key: "a", label: "避難所は何色ですか。", meaning: "Kalimat ini menanyakan warna tempat pengungsian." },
    { key: "b", label: "避難所が開いているかどうか、知っていますか。", meaning: "かどうか digunakan untuk menanyakan apakah sesuatu benar atau tidak." },
    { key: "c", label: "避難所で何を買いましたか。", meaning: "Kalimat ini menanyakan apa yang dibeli." },
  ], answer: "b", explanation: "Gunakan bentuk biasa + かどうか untuk menanyakan apakah suatu keadaan benar atau tidak." },
  { title: "05 · Membaca brosur kesiapsiagaan", heading: "Menemukan informasi dalam daftar", prompt: "Brosur fiktif mencantumkan 水、懐中電灯、ラジオ. Apa topik daftar tersebut?", japanese: <>準備するもの：水、懐中電灯、ラジオ。</>, translation: "Barang yang dipersiapkan: air, senter, radio.", options: [
    { key: "a", label: "Daftar perlengkapan yang disarankan untuk dipersiapkan.", meaning: "準備するもの berarti barang-barang yang dipersiapkan." },
    { key: "b", label: "Daftar tempat wisata.", meaning: "Tidak ada kosakata tentang wisata." },
    { key: "c", label: "Daftar jadwal sekolah.", meaning: "Kalimat menyebut barang, bukan jadwal." },
  ], answer: "a", explanation: "Cari judul atau kata kunci seperti 準備するもの untuk mengenali isi brosur." },
];

const practiceTasks: Task[] = [
  { prompt: <>Apa bentuk perintah tegas dari 「集まる」?</>, options: [{ key: "a", label: "集まれ" }, { key: "b", label: "集まるな" }, { key: "c", label: "集まっている" }], answer: "a", explanation: <>集まる termasuk kelompok 1; akhiran る berubah menjadi れ dalam bentuk perintah.</> },
  { prompt: <>Apa makna 「走るな」?</>, options: [{ key: "a", label: "Silakan berlari." }, { key: "b", label: "Jangan berlari." }, { key: "c", label: "Sedang berlari." }], answer: "b", explanation: <>Bentuk kamus + な menyatakan larangan tegas.</> },
  { prompt: <>Lengkapi pola: 「忘れ＿＿＿＿ようにしてください。」</>, options: [{ key: "a", label: "ない" }, { key: "b", label: "た" }, { key: "c", label: "る" }], answer: "a", explanation: <>V-ないようにしてください meminta seseorang berusaha agar tidak melakukan sesuatu.</> },
  { prompt: <>Lengkapi: 「電気が使え＿＿＿＿なりました。」</>, options: [{ key: "a", label: "なく" }, { key: "b", label: "ないで" }, { key: "c", label: "ても" }], answer: "a", explanation: <>Bentuk negatif 使えない berubah menjadi 使えなく, lalu diikuti なりました.</> },
  { prompt: <>Apa arti 「雨が降っても、イベントは行われます」?</>, options: [{ key: "a", label: "Acara dibatalkan jika hujan." }, { key: "b", label: "Acara tetap diadakan meskipun hujan." }, { key: "c", label: "Hujan turun setelah acara." }], answer: "b", explanation: <>Sでも menyatakan bahwa peristiwa kedua tetap terjadi meskipun kondisi pertama terjadi.</> },
  { prompt: <>Apa fungsi 「避難所が開いているかどうか、確認します」?</>, options: [{ key: "a", label: "Memastikan apakah tempat pengungsian sedang dibuka atau tidak." }, { key: "b", label: "Menanyakan warna tempat pengungsian." }, { key: "c", label: "Mengatakan tempat itu selalu tutup." }], answer: "a", explanation: <>V bentuk biasa + かどうか digunakan untuk memastikan apakah sesuatu benar atau tidak.</> },
];

const quizQuestions: Task[] = [
  { prompt: <>Apa arti 「災害」?</>, options: [{ key: "a", label: "Bencana." }, { key: "b", label: "Perayaan." }, { key: "c", label: "Perjalanan." }], answer: "a", explanation: <>災害 berarti bencana.</> },
  { prompt: <>Apa arti 「避難所」?</>, options: [{ key: "a", label: "Tempat pengungsian." }, { key: "b", label: "Ruang kelas." }, { key: "c", label: "Stasiun kereta." }], answer: "a", explanation: <>避難所 adalah tempat pengungsian atau tempat evakuasi.</> },
  { prompt: <>Apa fungsi bentuk perintah 「集まれ」?</>, options: [{ key: "a", label: "Memberi perintah tegas untuk berkumpul." }, { key: "b", label: "Menanyakan tempat berkumpul." }, { key: "c", label: "Menceritakan masa lalu." }], answer: "a", explanation: <>集まれ adalah bentuk perintah dari 集まる.</> },
  { prompt: <>Bentuk 「V-るな」 digunakan untuk apa?</>, options: [{ key: "a", label: "Larangan tegas." }, { key: "b", label: "Permintaan izin." }, { key: "c", label: "Menyatakan kemampuan." }], answer: "a", explanation: <>Tambahkan な pada bentuk kamus untuk membuat larangan tegas.</> },
  { prompt: <>Apa arti 「煙を吸わないようにしてください」?</>, options: [{ key: "a", label: "Berusahalah agar tidak menghirup asap." }, { key: "b", label: "Silakan menyalakan lampu." }, { key: "c", label: "Asap sudah hilang." }], answer: "a", explanation: <>V-ないようにしてください adalah permintaan agar seseorang berusaha menghindari suatu tindakan.</> },
  { prompt: <>Apa arti 「使えなくなります」?</>, options: [{ key: "a", label: "Menjadi tidak bisa digunakan." }, { key: "b", label: "Menjadi lebih mudah digunakan." }, { key: "c", label: "Sudah digunakan kemarin." }], answer: "a", explanation: <>V-なくなります menyatakan perubahan menjadi keadaan tidak bisa atau tidak terjadi.</> },
  { prompt: <>Apa makna pola 「Sでも」?</>, options: [{ key: "a", label: "Meskipun kondisi atau peristiwa itu terjadi." }, { key: "b", label: "Hanya ketika kondisi itu terjadi." }, { key: "c", label: "Sebelum kondisi itu terjadi." }], answer: "a", explanation: <>でも menyatakan kondisi yang tidak menghalangi bagian kalimat berikutnya.</> },
  { prompt: <>Apa arti 「給水車」?</>, options: [{ key: "a", label: "Kendaraan pemasok air." }, { key: "b", label: "Bus sekolah." }, { key: "c", label: "Mobil pengantar surat." }], answer: "a", explanation: <>給水車 adalah kendaraan yang membawa atau memasok air.</> },
  { prompt: <>Pilih arti yang tepat untuk 「ハザードマップ」.</>, options: [{ key: "a", label: "Peta risiko bencana." }, { key: "b", label: "Peta jalur wisata." }, { key: "c", label: "Peta toko." }], answer: "a", explanation: <>ハザードマップ adalah peta yang menunjukkan risiko bencana di suatu wilayah.</> },
  { prompt: <>Apa yang sebaiknya dilakukan jika membutuhkan informasi bencana yang berlaku saat ini?</>, options: [{ key: "a", label: "Memeriksa sumber resmi setempat dan mendengarkan arahan orang dewasa atau petugas." }, { key: "b", label: "Mengandalkan jadwal fiktif dari latihan." }, { key: "c", label: "Mengikuti pesan yang tidak diketahui sumbernya." }], answer: "a", explanation: <>Materi Fude hanya untuk belajar bahasa. Untuk kondisi nyata, gunakan informasi resmi dan arahan petugas, guru, atau keluarga.</> },
];

export default function IrodoriElementaryTwoLessonSixteenPage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [preparednessDraft, setPreparednessDraft] = useState("");

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
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#B2D7CB]/[0.08]">災</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#B2D7CB]">IRODORI • ELEMENTARY 2 A2 • LESSON 16</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Do not panic in case of an earthquake.</h1>
          <p className="mt-2 text-sm font-semibold text-[#B2D7CB]">地震が来ても、あわてて動かないでください</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar memahami pengumuman bencana, instruksi latihan kesiapsiagaan, penjelasan tentang gempa, informasi tempat pengungsian, dan brosur pencegahan bencana.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><CalendarDays size={14} className="text-[#B2D7CB]" />Alam dan lingkungan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#B2D7CB]" />Pengumuman dan informasi</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Gift size={14} className="text-[#B2D7CB]" />Kesiapsiagaan bencana</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#8B6655]/25 bg-[#34251F]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#E3B69A]" />
          <h2 className="text-sm font-bold text-[#F0E3D7]">Catatan keselamatan</h2>
        </div>
        <p className="mt-2 text-xs leading-6 text-[#D2C0B2]">Ini adalah materi belajar bahasa Jepang, bukan petunjuk tanggap darurat. Dalam keadaan nyata, ikuti informasi resmi serta arahan petugas, guru, atau orang dewasa yang bertanggung jawab. Jangan mencoba peralatan pemadam atau latihan berisiko tanpa pelatihan dan pengawasan yang sesuai.</p>
        <p className="mt-2 text-[10px] leading-5 text-[#A99A8C]">Contoh tempat, pengumuman, dan daftar perlengkapan di halaman ini bersifat fiktif untuk latihan bahasa. Informasi yang berlaku dapat berbeda menurut wilayah dan waktu.</p>
      </section>

      <section className="rounded-2xl border border-[#4B796C]/20 bg-[#1D302C]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Lima target berikut mengikuti Can-do 68–72 pada Irodori Elementary 2 Lesson 16.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">{item.source} · {String(index + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Berita, latihan, dan informasi kesiapsiagaan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Lima percakapan berikut ditulis orisinal oleh Fude untuk melatih seluruh target komunikasi lesson ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Memahami berita bencana" speakers={[friendYui, friendSota]} utterances={emergencyNewsConversation} />
          <IrodoriConversation title="Memahami latihan evakuasi" speakers={[friendAkiko, friendKenji]} utterances={evacuationDrillConversation} />
          <IrodoriConversation title="Mendengarkan penjelasan tentang gempa" speakers={[friendYui, friendAkiko]} utterances={earthquakeExplanationConversation} />
          <IrodoriConversation title="Menanyakan informasi tempat pengungsian" speakers={[friendKenji, friendSota]} utterances={askShelterInformationConversation} />
          <IrodoriConversation title="Membaca brosur kesiapsiagaan" speakers={[friendAkiko, friendKenji]} utterances={readPreparednessPamphletConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#B2D7CB]" />
          <h2 className="text-lg font-black text-[#EAE6DD]">Memahami pengumuman dan pemberitahuan</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Baca kata kunci untuk mengetahui jenis informasi yang disampaikan dalam setiap pengumuman fiktif.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {announcementCards.map((item) => (
            <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">{item.title}</p>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.body}</p>
              <p className="mt-2 text-xs leading-5 text-[#B2D7CB]">{item.meaning}</p>
              <p className="mt-1 text-[10px] leading-5 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#4B796C]/20 bg-[#192A26] p-4 md:p-5">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Contoh daftar pada brosur kesiapsiagaan</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Daftar fiktif ini membantu mengenali kosakata benda dan informasi yang mungkin disebut dalam brosur.</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {preparednessItems.map((item) => (
            <article key=<JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading> className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <p className="font-mincho text-base font-bold text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading></p>
              <p className="mt-1 text-[9px] text-[#B2D7CB]">{item.reading}</p>
              <p className="mt-1 text-xs text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
        <p className="text-[10px] leading-5 text-[#817A73]">Jenis dan jumlah perlengkapan sebaiknya ditentukan bersama keluarga dengan mengacu pada panduan resmi di wilayah masing-masing.</p>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">KOSAKATA ALAM DAN LINGKUNGAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima puluh kosakata penting</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata berita bencana, instruksi, tempat pengungsian, serta informasi kesiapsiagaan.</p>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sembilan kata kanji pada materi resmi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Daftar ini mengikuti sembilan kosakata kanji yang ditampilkan pada bagian Kanji Words Lesson 16.</p>
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
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima pola untuk memahami instruksi dan informasi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan perbedaan tingkat ketegasan dan cara menyatakan perubahan atau kondisi.</p>
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
          <h2 className="text-sm font-bold text-[#EAE6DD]">Latihan menulis informasi sederhana</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">Buat tiga kalimat fiktif: satu kalimat pengumuman, satu kalimat dengan ても, dan satu pertanyaan dengan かどうか. Jangan tuliskan alamat rumah atau informasi pribadi.</p>
        <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">台風が来ても、落ち着いて情報を確認してください。<br />避難所が開いているかどうか、知っていますか。</p>
        <label htmlFor="preparedness-draft" className="block text-xs font-semibold text-[#B2D7CB]">Tulis kalimatmu dalam bahasa Jepang</label>
        <textarea id="preparedness-draft" value={preparednessDraft} onChange={(event) => setPreparednessDraft(event.target.value)} rows={4} placeholder="お知らせです。..." className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#B2D7CB]/50" />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] text-[#817A73]">Draf hanya digunakan untuk latihan di halaman ini.</p>
          <span className="text-[10px] tabular-nums text-[#B2D7CB]">{preparednessDraft.length} karakter</span>
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
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#4B796C]/20 bg-[#1D302C]/70 p-3">
                <p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{task.japanese}</JapaneseReading></p>
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
                    <JapaneseReading allowIndexFallback>{option.label}</JapaneseReading>
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
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></h3>
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
                    )}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>
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
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{question.prompt}</JapaneseReading></h3>
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
                    )}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>
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
                  )}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
          <p className="text-xs text-[#A9A398]">
            {isCompleted ? "Lesson 16 selesai. Progres tersimpan." : canDosRated ? "Semua target Can-do sudah dinilai." : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button type="button" onClick={finishLesson} disabled={!canComplete || isCompleted} className="rounded-xl bg-[#4B796C] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#365B50] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">
            {isCompleted ? "Lesson 16 selesai" : "Selesaikan Lesson 16"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Elementary 2 · 16 / 18</span>
      </div>
    </main>
  );
}
