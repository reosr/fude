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
const lessonId = "elementary2-10";


const askFormalEventConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>友だちの結婚式に招待されたんですが、どんな服を着て行けばいいですか。</>, romaji: "Tomodachi no kekkonshiki ni shoutai sareta n desu ga, donna fuku o kite ikeba ii desu ka?", translation: "Saya diundang ke pernikahan teman. Pakaian seperti apa yang sebaiknya saya kenakan?", audioFileName: "irodori-elementary2-10-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>招待状や案内を確認すればいいですよ。</>, romaji: "Shoutaijou ya annai o kakunin sureba ii desu yo.", translation: "Sebaiknya periksa undangan atau petunjuk acaranya.", audioFileName: "irodori-elementary2-10-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>会場で写真を撮ってもいいですか。</>, romaji: "Kaijou de shashin o totte mo ii desu ka?", translation: "Apakah boleh mengambil foto di tempat acara?", audioFileName: "irodori-elementary2-10-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>先に主催者に聞けば安心ですね。</>, romaji: "Saki ni shusai-sha ni kikeba anshin desu ne.", translation: "Lebih baik bertanya kepada penyelenggara terlebih dahulu agar yakin.", audioFileName: "irodori-elementary2-10-a01-l04.mp3" },
];
const hospitalVisitConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>友だちのお見舞いに行くんです。面会時間はどこで確認すればいいですか。</>, romaji: "Tomodachi no omimai ni ikun desu. Menkai jikan wa doko de kakunin sureba ii desu ka?", translation: "Saya akan menjenguk teman. Di mana saya bisa memeriksa jam kunjungan?", audioFileName: "irodori-elementary2-10-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>受付や病院の案内で確認できますよ。</>, romaji: "Uketsuke ya byouin no annai de kakunin dekimasu yo.", translation: "Kamu bisa memeriksanya di bagian resepsionis atau petunjuk rumah sakit.", audioFileName: "irodori-elementary2-10-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>病室では、どんなことに気をつければいいですか。</>, romaji: "Byoushitsu de wa, donna koto ni ki o tsukereba ii desu ka?", translation: "Apa yang perlu diperhatikan di ruang pasien?", audioFileName: "irodori-elementary2-10-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>静かに話して、長くならないようにするといいですよ。</>, romaji: "Shizuka ni hanashite, nagaku naranai you ni suru to ii desu yo.", translation: "Sebaiknya berbicara pelan dan tidak berkunjung terlalu lama.", audioFileName: "irodori-elementary2-10-a02-l04.mp3" },
];
const foodCourtMannersConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>食器は自分で片付けるんですか。</>, romaji: "Shokki wa jibun de katazukeru n desu ka?", translation: "Apakah kita harus membereskan peralatan makan sendiri?", audioFileName: "irodori-elementary2-10-a03-l01.mp3" },
  { speakerId: "sota", japanese: <>はい。使った食器は返却口に持って行かなくちゃ。</>, romaji: "Hai. Tsukatta shokki wa henkyaku-guchi ni motte ikanakucha.", translation: "Ya. Peralatan makan yang sudah dipakai harus dibawa ke tempat pengembalian.", audioFileName: "irodori-elementary2-10-a03-l02.mp3" },
  { speakerId: "yui", japanese: <>どうしてですか。</>, romaji: "Doushite desu ka?", translation: "Mengapa begitu?", audioFileName: "irodori-elementary2-10-a03-l03.mp3" },
  { speakerId: "sota", japanese: <>次の人がすぐに使えるように、テーブルをきれいにするんです。</>, romaji: "Tsugi no hito ga sugu ni tsukaeru you ni, teeburu o kirei ni suru n desu.", translation: "Agar orang berikutnya bisa langsung menggunakannya, meja dirapikan.", audioFileName: "irodori-elementary2-10-a03-l04.mp3" },
];
const homeCustomDifferenceConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>日本の家に入るとき、靴を脱がなくちゃいけませんか。</>, romaji: "Nihon no ie ni hairu toki, kutsu o nuganakucha ikemasen ka?", translation: "Saat masuk ke rumah di Jepang, apakah kita harus melepas sepatu?", audioFileName: "irodori-elementary2-10-a04-l01.mp3" },
  { speakerId: "kenji", japanese: <>はい。玄関で靴を脱ぎます。靴のまま入っちゃだめですよ。</>, romaji: "Hai. Genkan de kutsu o nugimasu. Kutsu no mama haitcha dame desu yo.", translation: "Ya. Sepatu dilepas di area pintu masuk. Jangan masuk ke dalam rumah dengan sepatu.", audioFileName: "irodori-elementary2-10-a04-l02.mp3" },
  { speakerId: "akiko", japanese: <>私の国でも、家によって習慣が違います。</>, romaji: "Watashi no kuni demo, ie ni yotte shuukan ga chigaimasu.", translation: "Di negara saya juga, kebiasaan berbeda-beda menurut rumah.", audioFileName: "irodori-elementary2-10-a04-l03.mp3" },
  { speakerId: "kenji", japanese: <>そうですね。わからないときは、家の人に聞けばいいですよ。</>, romaji: "Sou desu ne. Wakaranai toki wa, ie no hito ni kikeba ii desu yo.", translation: "Betul. Kalau tidak tahu, sebaiknya tanyakan kepada penghuni rumah.", audioFileName: "irodori-elementary2-10-a04-l04.mp3" },
];
const photoPermissionConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>どうしたの。</>, romaji: "Doushita no?", translation: "Ada apa?", audioFileName: "irodori-elementary2-10-a05-l01.mp3" },
  { speakerId: "sota", japanese: <>写真を撮る前に、許可をもらわなかったんです。</>, romaji: "Shashin o toru mae ni, kyoka o morawanakatta n desu.", translation: "Saya tadi belum meminta izin sebelum mengambil foto.", audioFileName: "irodori-elementary2-10-a05-l02.mp3" },
  { speakerId: "yui", japanese: <>会場では、先に係の人に聞かなきゃ。</>, romaji: "Kaijou de wa, saki ni kakari no hito ni kikanakya.", translation: "Di tempat acara, kamu harus bertanya kepada petugas terlebih dahulu.", audioFileName: "irodori-elementary2-10-a05-l03.mp3" },
  { speakerId: "sota", japanese: <>はい。友だちにマナーを説明されました。次から気をつけます。</>, romaji: "Hai. Tomodachi ni manaa o setsumei saremashita. Tsugi kara ki o tsukemasu.", translation: "Ya. Teman saya menjelaskan etiketnya. Lain kali saya akan lebih berhati-hati.", audioFileName: "irodori-elementary2-10-a05-l04.mp3" },
];

const canDos = [
  { id: "ask-about-event-manners", source: "CAN-DO 43", text: "Menanyakan kebiasaan dan etiket dalam acara pernikahan atau pemakaman di Jepang, lalu memahami penjelasan yang diberikan." },
  { id: "compare-customs", source: "CAN-DO 44", text: "Menanyakan dan mengomentari perbedaan kebiasaan antara Jepang dan negara sendiri." },
  { id: "talk-intercultural-experience", source: "CAN-DO 45", text: "Menceritakan secara sederhana pengalaman atau kejadian yang berkaitan dengan perbedaan budaya." },
  { id: "read-online-customs-post", source: "CAN-DO 46", text: "Membaca unggahan online tentang perbedaan etiket dan kebiasaan, lalu memahami garis besar isinya." },
];

const vocabRows = [
  ["服", "ふく · fuku", "Pakaian"],
  ["服装", "ふくそう · fukusou", "Busana atau cara berpakaian"],
  ["洋服", "ようふく · youfuku", "Pakaian model Barat"],
  ["正装", "せいそう · seisou", "Pakaian resmi"],
  ["普段着", "ふだんぎ · fudangi", "Pakaian sehari-hari"],
  ["上着", "うわぎ · uwagi", "Jaket atau pakaian luar"],
  ["袋", "ふくろ · fukuro", "Kantong atau tas"],
  ["靴", "くつ · kutsu", "Sepatu"],
  ["靴下", "くつした · kutsushita", "Kaos kaki"],
  ["玄関", "げんかん · genkan", "Area pintu masuk rumah"],
  ["脱ぐ", "ぬぐ · nugu", "Melepas pakaian atau sepatu"],
  ["履く", "はく · haku", "Memakai sepatu atau bawahan"],
  ["着る", "きる · kiru", "Memakai pakaian"],
  ["持ち物", "もちもの · mochimono", "Barang bawaan"],
  ["持って行く", "もっていく · motte iku", "Membawa pergi"],
  ["花", "はな · hana", "Bunga"],
  ["お見舞い", "おみまい · omimai", "Kunjungan untuk menjenguk"],
  ["病院", "びょういん · byouin", "Rumah sakit"],
  ["入院する", "にゅういんする · nyuuin suru", "Dirawat di rumah sakit"],
  ["面会", "めんかい · menkai", "Kunjungan atau pertemuan"],
  ["面会時間", "めんかいじかん · menkaijikan", "Jam kunjungan"],
  ["受付", "うけつけ · uketsuke", "Resepsionis atau loket"],
  ["病室", "びょうしつ · byoushitsu", "Ruang pasien"],
  ["静か", "しずか · shizuka", "Tenang atau sunyi"],
  ["声", "こえ · koe", "Suara"],
  ["店長", "てんちょう · tenchou", "Manajer toko"],
  ["自分", "じぶん · jibun", "Diri sendiri"],
  ["全員", "ぜんいん · zen'in", "Semua orang"],
  ["習慣", "しゅうかん · shuukan", "Kebiasaan"],
  ["普通", "ふつう · futsuu", "Biasa atau normal"],
  ["暗い", "くらい · kurai", "Gelap"],
  ["怒る", "おこる · okoru", "Marah"],
  ["注意する", "ちゅういする · chuui suru", "Mengingatkan atau menegur"],
  ["気をつける", "きをつける · ki o tsukeru", "Berhati-hati"],
  ["食器", "しょっき · shokki", "Peralatan makan"],
  ["片付ける", "かたづける · katazukeru", "Membereskan"],
  ["返す", "かえす · kaesu", "Mengembalikan"],
  ["会場", "かいじょう · kaijou", "Tempat acara"],
  ["結婚式", "けっこんしき · kekkonshiki", "Pernikahan atau upacara pernikahan"],
  ["招待状", "しょうたいじょう · shoutaijou", "Undangan"],
  ["出席する", "しゅっせきする · shusseki suru", "Menghadiri acara"],
  ["案内", "あんない · annai", "Petunjuk atau informasi"],
  ["確認する", "かくにんする · kakunin suru", "Memastikan atau memeriksa"],
  ["規則", "きそく · kisoku", "Peraturan"],
  ["許可", "きょか · kyoka", "Izin"],
  ["撮影する", "さつえいする · satsuei suru", "Mengambil foto atau video"],
  ["撮る", "とる · toru", "Mengambil foto"],
  ["迷惑", "めいわく · meiwaku", "Gangguan atau ketidaknyamanan"],
  ["国によって", "くにによって · kuni ni yotte", "Bergantung pada negara"],
  ["丁寧", "ていねい · teinei", "Sopan atau teliti"],
];

const kanjiWords = [
  ["服", "ふく · fuku", "Pakaian"],
  ["袋", "ふくろ · fukuro", "Kantong atau tas"],
  ["自分", "じぶん · jibun", "Diri sendiri"],
  ["店長", "てんちょう · tenchou", "Manajer toko"],
  ["全員", "ぜんいん · zen'in", "Semua orang"],
  ["習慣", "しゅうかん · shuukan", "Kebiasaan"],
  ["普通", "ふつう · futsuu", "Biasa atau normal"],
  ["暗い", "くらい · kurai", "Gelap"],
  ["怒る", "おこる · okoru", "Marah"],
  ["入院する", "にゅういんする · nyuuin suru", "Dirawat di rumah sakit"],
];

const japaneseAnnualEvents = [
  { title: "結婚式などの正式な行事", date: "案内を確認", activities: "招待状や主催者の案内を確認して、指定された服装に合わせます。", translation: "Periksa undangan dan petunjuk penyelenggara, lalu sesuaikan pakaian dengan ketentuan acara." },
  { title: "病院へのお見舞い", date: "時間を確認", activities: "面会時間や施設の案内を確認し、周りの人の迷惑にならないように静かに過ごします。", translation: "Periksa jam kunjungan dan petunjuk rumah sakit. Bersikaplah tenang agar tidak mengganggu orang lain." },
  { title: "食事スペース", date: "使った後", activities: "使った食器を片付けて、次の人が気持ちよく使えるようにテーブルを整えます。", translation: "Rapikan peralatan makan agar orang berikutnya dapat menggunakan meja dengan nyaman." },
  { title: "写真を撮るとき", date: "先に確認", activities: "写真を撮る前に、写る人に許可をもらい、会場の案内や規則を確認します。", translation: "Sebelum mengambil foto, mintalah izin orang yang akan difoto dan periksa aturan tempat acara." },
];

const interculturalExamples = [
  { title: "Berkunjung ke rumah teman", japanese: "玄関で靴を脱ぐ習慣があります。", meaning: "Ada kebiasaan melepas sepatu di area pintu masuk. Kebiasaan rumah bisa berbeda-beda." },
  { title: "Menggunakan ruang bersama", japanese: "次の人が使えるように、使った物を片付けます。", meaning: "Barang yang telah digunakan dirapikan agar orang berikutnya bisa memakainya." },
  { title: "Mengambil foto", japanese: "写真を撮る前に、許可をもらいます。", meaning: "Sebelum mengambil foto, kita meminta izin terlebih dahulu." },
];

const eventArticle = {
  title: "日本の家での習慣について",
  date: "投稿：5月12日",
  venue: "テーマ：玄関での靴のマナー",
  body: "日本の友だちの家に行ったとき、玄関で靴を脱ぐように教えてもらいました。私は最初、どうすればいいのかわかりませんでした。友だちに「ここでは靴を脱ぐんだよ」と説明されました。靴を履いたまま部屋に入ってはいけません。脱いだ靴は、次の人が通れるようにそろえます。国によって家の習慣は違いますね。わからないときは、家の人に聞けばいいと思います。",
  reading: "Nihon no tomodachi no ie ni itta toki, genkan de kutsu o nugu you ni oshiete moraimashita. Watashi wa saisho, dou sureba ii no ka wakarimasen deshita. Tomodachi ni koko de wa kutsu o nugu n da yo to setsumei saremashita. Kutsu o haita mama heya ni haitte wa ikemasen. Nuida kutsu wa, tsugi no hito ga tooreru you ni soroemasu. Kuni ni yotte ie no shuukan wa chigaimasu ne. Wakaranai toki wa, ie no hito ni kikeba ii to omoimasu.",
  translation: "Saat pergi ke rumah teman di Jepang, saya diajari untuk melepas sepatu di area pintu masuk. Awalnya saya tidak tahu harus bagaimana. Teman saya menjelaskan bahwa sepatu dilepas di sana. Kita tidak boleh masuk ke kamar dengan tetap memakai sepatu. Sepatu yang dilepas dirapikan agar orang berikutnya bisa lewat. Kebiasaan rumah berbeda-beda menurut negara. Kalau tidak tahu, sebaiknya bertanya kepada penghuni rumah.",
};

const mannersPhraseExamples = [
  { label: "Meminta saran tentang pakaian", japanese: "どんな服を着て行けばいいですか。", meaning: "Pakaian seperti apa yang sebaiknya saya kenakan?" },
  { label: "Mengingatkan tentang aturan", japanese: "ここでは写真を撮ってはいけません。", meaning: "Di sini kita tidak boleh mengambil foto." },
  { label: "Menyatakan hal yang perlu dilakukan", japanese: "使った食器は自分で片付けなくちゃ。", meaning: "Peralatan makan yang dipakai harus dibereskan sendiri." },
];

const grammarNotes = [
  { title: "01 · Meminta saran tentang aturan atau kebiasaan", pattern: "Kata tanya + V-ばいいですか？", example: <>何を持って行けばいいですか。<br />どんな服を着て行けばいいですか。</>, note: "Gunakan ～ばいいですか untuk bertanya tentang cara atau aturan yang sebaiknya diikuti. Untuk kata kerja golongan 1, ubah bunyi akhir dari baris う ke baris え lalu tambahkan ば: 行く → 行けば. Golongan 2: 着る → 着れば. Kata kerja tidak beraturan: する → すれば、来る → 来れば." },
  { title: "02 · Menyatakan larangan", pattern: "V-てはいけません／V-てはだめです\nBentuk percakapan: V-ちゃいけません／V-ちゃだめ", example: <>ここで写真を撮ってはいけません。<br />靴のまま入っちゃだめですよ。</>, note: "Pola ini digunakan untuk menyatakan sesuatu yang tidak boleh dilakukan. ～てはいけません lebih jelas dan sopan; ～ちゃだめ merupakan bentuk percakapan yang lebih santai." },
  { title: "03 · Menyatakan keharusan dengan bentuk percakapan", pattern: "V-なくちゃ", example: <>食器は自分で片付けなくちゃ。<br />面会時間を確認しなくちゃ。</>, note: "～なくちゃ merupakan bentuk percakapan singkat dari ～なくてはならない. Maknanya harus melakukan sesuatu. Bentuk ini sering dipakai dalam percakapan sehari-hari." },
  { title: "04 · Menyatakan tujuan atau hal yang perlu dihindari", pattern: "V-るように、～／V-ないように、～", example: <>次の人が使えるように、テーブルをきれいにします。<br />迷惑をかけないように、静かに話します。</>, note: "Gunakan V-るように untuk menyatakan tujuan atau hasil yang diharapkan. Gunakan V-ないように untuk menyatakan upaya agar sesuatu yang tidak diinginkan tidak terjadi." },
  { title: "05 · Bentuk pasif", pattern: "V-(ら)れます", example: <>友だちにマナーを説明されました。<br />店長さんに注意されました。</>, note: "Bentuk pasif menempatkan orang atau benda yang menerima tindakan sebagai fokus kalimat. Contoh: 説明する → 説明される, 注意する → 注意される." },
  { title: "06 · Meminta penjelasan dalam percakapan santai", pattern: "S (bentuk biasa) + の？", example: <>どうしたの。<br />どうして靴を脱ぐの。</>, note: "～の？ digunakan untuk meminta penjelasan tentang situasi atau alasan dengan gaya santai. Bentuk ini lebih kasual daripada ～んですか？. Gunakan kepada teman atau orang yang akrab." },
  { title: "07 · Menyatakan keharusan secara singkat", pattern: "V-なきゃ", example: <>時間を確認しなきゃ。<br />先に係の人に聞かなきゃ。</>, note: "～なきゃ merupakan bentuk percakapan singkat dari ～なければならない. Artinya harus melakukan sesuatu. Seperti ～なくちゃ, bentuk ini umum dalam percakapan santai." },
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
    title: "01 · Memilih pakaian untuk acara",
    heading: "Memeriksa petunjuk pakaian pada undangan",
    prompt: "Kamu diundang ke acara resmi dan belum tahu pakaian yang sesuai. Apa pertanyaan yang tepat?",
    japanese: <>どんな服を着て行けばいいですか。</>,
    translation: "Pakaian seperti apa yang sebaiknya saya kenakan?",
    options: [
      { key: "a", label: "どんな服を着て行けばいいですか。", meaning: "Pola ～ばいいですか dipakai untuk meminta saran tentang cara atau aturan." },
      { key: "b", label: "どんな服を着てはいけませんか。", meaning: "Kalimat ini bertanya tentang pakaian yang dilarang, bukan meminta saran umum." },
      { key: "c", label: "どんな服を着なきゃでしたか。", meaning: "Bentuk ini tidak tepat untuk pertanyaan meminta saran." },
    ],
    answer: "a",
    explanation: "Periksa undangan atau tanyakan kepada penyelenggara agar pilihan pakaian sesuai dengan acara.",
  },
  {
    title: "02 · Berkunjung ke rumah sakit",
    heading: "Memastikan informasi sebelum berkunjung",
    prompt: "Kamu ingin menjenguk teman. Apa yang sebaiknya dilakukan sebelum datang?",
    japanese: <>面会時間を確認すればいいですよ。</>,
    translation: "Sebaiknya periksa jam kunjungan.",
    options: [
      { key: "a", label: "面会時間を確認しなくてもいいです。", meaning: "Kalimat ini mengatakan tidak perlu memeriksa jam kunjungan." },
      { key: "b", label: "面会時間を確認すればいいです。", meaning: "Kalimat ini memberi saran untuk memastikan jam kunjungan." },
      { key: "c", label: "病室で大きな声で話してもいいです。", meaning: "Berbicara keras dapat mengganggu orang lain." },
    ],
    answer: "b",
    explanation: "Periksa petunjuk rumah sakit dan jaga suasana tetap tenang saat berkunjung.",
  },
  {
    title: "03 · Menggunakan ruang makan bersama",
    heading: "Menjaga tempat agar siap digunakan orang berikutnya",
    prompt: "Setelah makan, kamu perlu merapikan meja agar orang berikutnya bisa menggunakannya.",
    japanese: <>次の人が使えるように、食器を片付けます。</>,
    translation: "Saya membereskan peralatan makan agar orang berikutnya bisa menggunakannya.",
    options: [
      { key: "a", label: "次の人が使わないように、食器を片付けます。", meaning: "Artinya agar orang berikutnya tidak menggunakannya." },
      { key: "b", label: "次の人が使ったように、食器を片付けます。", meaning: "Bentuk ini tidak menyatakan tujuan yang dimaksud." },
      { key: "c", label: "次の人が使えるように、食器を片付けます。", meaning: "V-るように menyatakan tujuan agar orang berikutnya bisa menggunakan tempat tersebut." },
    ],
    answer: "c",
    explanation: "V-るように menjelaskan tujuan dari tindakan merapikan meja.",
  },
  {
    title: "04 · Memahami kebiasaan di rumah",
    heading: "Mengingat aturan ketika bertamu",
    prompt: "Di rumah teman, sepatu harus dilepas sebelum masuk. Pilih pengingat santai yang sesuai.",
    japanese: <>靴のまま入っちゃだめですよ。</>,
    translation: "Jangan masuk dengan tetap memakai sepatu.",
    options: [
      { key: "a", label: "靴のまま入ってもいいですよ。", meaning: "Kalimat ini justru memperbolehkan masuk dengan sepatu." },
      { key: "b", label: "靴のまま入っちゃだめですよ。", meaning: "～ちゃだめ merupakan bentuk percakapan untuk menyatakan larangan." },
      { key: "c", label: "靴のまま入らなきゃ。", meaning: "Kalimat ini menyatakan keharusan untuk masuk dengan sepatu." },
    ],
    answer: "b",
    explanation: "Gunakan ～ちゃだめ untuk mengingatkan teman secara santai tentang hal yang tidak boleh dilakukan.",
  },
  {
    title: "05 · Meminta izin sebelum mengambil foto",
    heading: "Mengikuti aturan tempat acara",
    prompt: "Kamu berada di tempat acara dan belum tahu apakah foto boleh diambil. Apa yang harus dilakukan?",
    japanese: <>先に係の人に聞かなきゃ。</>,
    translation: "Saya harus bertanya kepada petugas terlebih dahulu.",
    options: [
      { key: "a", label: "先に係の人に聞かなきゃ。", meaning: "～なきゃ menyatakan keharusan dalam percakapan santai." },
      { key: "b", label: "写真を撮る前に、何も確認しちゃだめです。", meaning: "Kalimat ini tidak sesuai dengan tujuan memastikan aturan." },
      { key: "c", label: "許可をもらわないようにします。", meaning: "Artinya berusaha agar tidak mendapat izin, bukan meminta izin." },
    ],
    answer: "a",
    explanation: "Tanyakan terlebih dahulu dan ikuti petunjuk penyelenggara sebelum mengambil foto.",
  },
];

const practiceTasks: Task[] = [
  { prompt: <>Lengkapi kalimat: 「何を持って行け＿＿＿いいですか。」</>, options: [{ key: "a", label: "ば" }, { key: "b", label: "たり" }, { key: "c", label: "ながら" }], answer: "a", explanation: <>Pola yang benar adalah 持って行けばいいですか, digunakan untuk meminta saran.</> },
  { prompt: <>Apa arti 「ここで写真を撮ってはいけません」?</>, options: [{ key: "a", label: "Di sini boleh mengambil foto." }, { key: "b", label: "Di sini tidak boleh mengambil foto." }, { key: "c", label: "Di sini harus mengambil foto." }], answer: "b", explanation: <>～てはいけません menyatakan larangan.</> },
  { prompt: <>Pilih kalimat yang berarti “Saya harus membereskan peralatan makan sendiri”.</>, options: [{ key: "a", label: "食器は自分で片付けなくちゃ。" }, { key: "b", label: "食器は自分で片付けちゃだめ。" }, { key: "c", label: "食器は自分で片付けるように。" }], answer: "a", explanation: <>～なくちゃ adalah bentuk percakapan untuk menyatakan keharusan.</> },
  { prompt: <>Pilih kalimat dengan makna “agar orang berikutnya bisa menggunakan meja”.</>, options: [{ key: "a", label: "次の人が使わないように。" }, { key: "b", label: "次の人が使えるように。" }, { key: "c", label: "次の人が使ったの？" }], answer: "b", explanation: <>V-るように menyatakan tujuan atau hasil yang diharapkan.</> },
  { prompt: <>Kalimat 「友だちに説明されました」 menggunakan bentuk apa?</>, options: [{ key: "a", label: "Bentuk pasif." }, { key: "b", label: "Bentuk larangan." }, { key: "c", label: "Bentuk ajakan." }], answer: "a", explanation: <>説明されました adalah bentuk pasif dari 説明します.</> },
  { prompt: <>Ungkapan 「時間を確認しなきゃ」 berarti apa?</>, options: [{ key: "a", label: "Tidak perlu memeriksa waktu." }, { key: "b", label: "Saya sudah memeriksa waktu." }, { key: "c", label: "Saya harus memeriksa waktu." }], answer: "c", explanation: <>～なきゃ adalah bentuk percakapan singkat yang menyatakan keharusan.</> },
];

const quizQuestions: Task[] = [
  { prompt: <>Apa arti 「服装」?</>, options: [{ key: "a", label: "Pakaian atau cara berpakaian." }, { key: "b", label: "Jam kunjungan." }, { key: "c", label: "Undangan." }], answer: "a", explanation: <>服装 berarti busana atau cara berpakaian.</> },
  { prompt: <>Apa fungsi 「何を持って行けばいいですか」?</>, options: [{ key: "a", label: "Melarang seseorang membawa sesuatu." }, { key: "b", label: "Meminta saran tentang apa yang sebaiknya dibawa." }, { key: "c", label: "Menceritakan sesuatu yang sudah dibawa." }], answer: "b", explanation: <>Kata kerja bentuk ば + いいですか digunakan untuk meminta saran tentang cara atau aturan.</> },
  { prompt: <>Kalimat 「ここで写真を撮ってはいけません」 menyatakan apa?</>, options: [{ key: "a", label: "Izin mengambil foto." }, { key: "b", label: "Ajakan untuk mengambil foto." }, { key: "c", label: "Larangan mengambil foto." }], answer: "c", explanation: <>～てはいけません menyatakan sesuatu yang tidak boleh dilakukan.</> },
  { prompt: <>Bentuk santai 「靴のまま入っちゃだめ」 setara dengan pola apa?</>, options: [{ key: "a", label: "入ってはいけません／入ってはだめです." }, { key: "b", label: "入ってもいいです." }, { key: "c", label: "入らなくてもいいです." }], answer: "a", explanation: <>～ちゃだめ merupakan bentuk percakapan dari ～てはいけません／～てはだめです.</> },
  { prompt: <>Apa makna 「食器は自分で片付けなくちゃ」?</>, options: [{ key: "a", label: "Peralatan makan tidak boleh dibereskan." }, { key: "b", label: "Peralatan makan harus dibereskan sendiri." }, { key: "c", label: "Peralatan makan sudah dibereskan orang lain." }], answer: "b", explanation: <>～なくちゃ menyatakan keharusan dan merupakan bentuk percakapan.</> },
  { prompt: <>Pilih makna 「次の人が使えるように、テーブルをきれいにします」.</>, options: [{ key: "a", label: "Saya membersihkan meja agar orang berikutnya bisa menggunakannya." }, { key: "b", label: "Saya membersihkan meja setelah orang berikutnya menggunakannya." }, { key: "c", label: "Saya tidak ingin orang berikutnya menggunakan meja." }], answer: "a", explanation: <>V-るように menyatakan tujuan atau hasil yang diharapkan.</> },
  { prompt: <>Kalimat 「友だちにマナーを説明されました」 menggunakan bentuk apa?</>, options: [{ key: "a", label: "Bentuk potensial." }, { key: "b", label: "Bentuk pasif." }, { key: "c", label: "Bentuk perintah." }], answer: "b", explanation: <>説明されました adalah bentuk pasif dari 説明する.</> },
  { prompt: <>Dalam percakapan santai, 「どうしたの？」 digunakan untuk apa?</>, options: [{ key: "a", label: "Meminta penjelasan tentang keadaan atau alasan." }, { key: "b", label: "Menyatakan larangan." }, { key: "c", label: "Meminta izin tertulis." }], answer: "a", explanation: <>S (bentuk biasa) + の？ merupakan cara santai untuk meminta penjelasan.</> },
  { prompt: <>Apa arti 「面会時間」?</>, options: [{ key: "a", label: "Jam pelajaran." }, { key: "b", label: "Jam kunjungan." }, { key: "c", label: "Jam makan." }], answer: "b", explanation: <>面会時間 berarti waktu atau jam kunjungan.</> },
  { prompt: <>Pilih kalimat yang berarti “Saya harus bertanya kepada petugas terlebih dahulu”.</>, options: [{ key: "a", label: "先に係の人に聞かなきゃ。" }, { key: "b", label: "先に係の人に聞いてはいけません。" }, { key: "c", label: "先に係の人に聞いたの？" }], answer: "a", explanation: <>～なきゃ adalah bentuk percakapan singkat untuk menyatakan keharusan.</> },
];
export default function IrodoriElementaryTwoLessonTenPage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [mannersDraft, setMannersDraft] = useState("");

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
        <ArrowLeft size={15} /> Kembali ke Elementary 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#486C91]/35 bg-gradient-to-br from-[#20364C] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#A9C9E8]/[0.08]">服</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#A9C9E8]">IRODORI • ELEMENTARY 2 A2 • LESSON 09</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Pakaian seperti apa yang sebaiknya saya kenakan?</h1>
          <p className="mt-2 text-sm font-semibold text-[#A9C9E8]">どんな服を着て行けばいいですか？</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar menanyakan etiket acara, membandingkan kebiasaan antarnegara, menceritakan pengalaman lintas budaya, dan memahami unggahan tentang kebiasaan.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><CalendarDays size={14} className="text-[#A9C9E8]" />Etiket acara</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9C9E8]" />Kebiasaan sehari-hari</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Gift size={14} className="text-[#A9C9E8]" />Pakaian dan aturan</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#486C91]/20 bg-[#1D2A37]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A9C9E8]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target berikut sesuai Can-do 43–46 pada Irodori Elementary 2 Lesson 10.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9C9E8]">{item.source} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#486C91]/20 bg-[#1B2632] p-4 md:p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#A9C9E8]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Catatan budaya: kebiasaan dapat berbeda</h2>
        </div>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Etiket tidak selalu sama di setiap tempat. Kebiasaan rumah, aturan rumah sakit, dan ketentuan tempat acara dapat berbeda menurut keluarga, wilayah, atau penyelenggara. Perhatikan papan informasi, baca undangan, dan tanyakan dengan sopan jika belum yakin.</p>
        <p className="mt-2 text-[10px] leading-5 text-[#887F74]">Contoh dalam lesson ini merupakan latihan bahasa. Untuk situasi nyata, ikuti petunjuk resmi dari tempat atau penyelenggara.</p>
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Membahas pakaian, etiket, dan perbedaan kebiasaan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Seluruh percakapan dibuat orisinal oleh Fude berdasarkan target komunikasi lesson ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Bertanya tentang pakaian untuk acara" speakers={[friendYui, friendSota]} utterances={askFormalEventConversation} />
          <IrodoriConversation title="Menanyakan aturan kunjungan" speakers={[friendAkiko, friendKenji]} utterances={hospitalVisitConversation} />
          <IrodoriConversation title="Membicarakan kebiasaan di ruang makan" speakers={[friendSota, friendYui]} utterances={foodCourtMannersConversation} />
          <IrodoriConversation title="Membandingkan kebiasaan di rumah" speakers={[friendAkiko, friendKenji]} utterances={homeCustomDifferenceConversation} />
          <IrodoriConversation title="Meminta izin sebelum mengambil foto" speakers={[friendYui, friendSota]} utterances={photoPermissionConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">ETIKET DALAM BERBAGAI SITUASI</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Contoh kebiasaan di tempat dan acara yang berbeda</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Aturan dapat berbeda menurut tempat, keluarga, dan penyelenggara. Periksa petunjuk yang tersedia atau tanyakan dengan sopan.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {japaneseAnnualEvents.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#486C91]/20 bg-[#1B2632] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mincho text-base font-bold text-[#F1EBDD]">{item.title}</h3>
                <span className="rounded-lg bg-[#486C91]/15 px-2.5 py-1 text-[10px] font-semibold text-[#A9C9E8]">{item.date}</span>
              </div>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.activities}</p>
              <p className="mt-1 text-xs leading-5 text-[#A9A398]">{item.translation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">MEMBANDINGKAN KEBIASAAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Contoh kalimat untuk pengalaman lintas budaya</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan contoh ini untuk menjelaskan kebiasaan di rumah atau tempat umum. Perbedaan tidak berarti satu kebiasaan selalu lebih baik daripada yang lain.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {interculturalExamples.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#486C91]/20 bg-[#1B2632] p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[#F1EBDD]">{item.title}</h3>
                <Star size={18} className="shrink-0 text-[#A9C9E8]" />
              </div>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.japanese}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">MEMBACA UNGGAHAN ONLINE</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Unggahan tentang kebiasaan melepas sepatu di rumah</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Unggahan ini fiktif dan dibuat sebagai latihan. Perhatikan kebiasaan yang dijelaskan dan alasan di baliknya.</p>
        </div>
        <article className="rounded-2xl border border-[#486C91]/25 bg-[#1B2632] p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#486C91]/30 pb-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9C9E8]">ONLINE POST · CUSTOMS</p>
              <h3 className="mt-1 text-sm font-bold text-[#F1EBDD]">{eventArticle.title}</h3>
            </div>
            <FileText size={21} className="text-[#A9C9E8]" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-black/15 px-3 py-2 text-[10px] text-[#C9C3B8]">投稿 · {eventArticle.date}</span>
            <span className="rounded-lg bg-black/15 px-3 py-2 text-[10px] text-[#C9C3B8]">内容 · {eventArticle.venue}</span>
          </div>
          <p className="mt-3 font-mincho text-sm leading-8 text-[#F1EBDD]">{eventArticle.body}</p>
          <p className="mt-3 border-t border-white/[0.07] pt-3 text-[10px] leading-6 text-[#A9C9E8]">{eventArticle.reading}</p>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">{eventArticle.translation}</p>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">UNGKAPAN TENTANG ETIKET</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Contoh kalimat untuk bertanya dan mengingatkan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pilih ungkapan sesuai situasi. Gunakan bentuk yang sopan saat bertanya kepada penyelenggara atau orang yang belum akrab.</p>
        </div>
        <div className="space-y-2">
          {mannersPhraseExamples.map((item) => (
            <article key={item.label} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9C9E8]">{item.label}</p>
              <p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.japanese}</p>
              <p className="mt-1 text-xs text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#486C91]/20 bg-[#1D2A37]/60 p-4 md:p-5">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">LATIHAN MENULIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Ceritakan pengalaman tentang kebiasaan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Tulis 2–4 kalimat tentang kebiasaan di rumah, sekolah, atau acara di negara sendiri. Jelaskan apa yang dilakukan dan bagaimana kebiasaan itu berbeda dari tempat lain.</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
          <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">国によって習慣は違います。わからないときは、相手に聞けばいいと思います。</p>
          <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">Kebiasaan berbeda menurut negara. Jika tidak tahu, sebaiknya bertanya kepada orang yang bersangkutan.</p>
        </div>
        <label htmlFor="manners-experience-draft" className="block text-xs font-semibold text-[#A9C9E8]">Tulis pengalamanmu dalam bahasa Jepang</label>
        <textarea
          id="new-year-message-draft"
          value={mannersDraft}
          onChange={(event) => setMannersDraft(event.target.value)}
          rows={4}
          placeholder="あけましておめでとうございます。"
          className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#A9C9E8]/50"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] text-[#817A73]">Draf hanya digunakan untuk latihan di halaman ini.</p>
          <span className="text-[10px] tabular-nums text-[#A9C9E8]">{mannersDraft.length} karakter</span>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">KOSAKATA ETIKET</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pakaian, kunjungan, dan kebiasaan sehari-hari</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kata-kata yang digunakan saat membicarakan pakaian, tempat kunjungan, aturan, dan kebiasaan.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9C9E8]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">KANJI UTAMA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sepuluh kata kanji pada materi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenali sepuluh kata kanji pada materi Lesson 10.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-[#486C91]/20 bg-[#1B2632] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9C9E8]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">POLA TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tujuh pola untuk bertanya dan membahas etiket</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari cara meminta saran, menyatakan larangan dan keharusan, menjelaskan tujuan, serta menggunakan bentuk pasif dan pertanyaan santai.</p>
        </div>
        {grammarNotes.map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#A9C9E8]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#A9C9E8]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">SIMULASI SITUASI</p>
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
              <p className="text-[9px] font-black tracking-[0.16em] text-[#A9C9E8]">{task.title}</p>
              <h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#486C91]/20 bg-[#1D2A37]/70 p-3">
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
                          ? "border-[#A9C9E8]/60 bg-[#486C91]/15 text-[#F1EBDD]"
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
                  className="rounded-lg bg-[#486C91] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#3A5C7A] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
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
          <button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#486C91]/35 px-4 py-2 text-xs font-bold text-[#A9C9E8]">
            <RefreshCw size={13} /> Ulangi simulasi
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#A9C9E8]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#A9C9E8]/60 bg-[#486C91]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#486C91]/35 px-4 py-2 text-xs font-bold text-[#A9C9E8]">
              <RefreshCw size={13} /> Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={Object.keys(practiceAnswers).length !== practiceTasks.length}
              className="rounded-lg bg-[#486C91] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#A9C9E8]">SOAL {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#A9C9E8]/60 bg-[#486C91]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#486C91]/35 px-4 py-2 text-xs font-bold text-[#A9C9E8]">
              <RefreshCw size={13} /> Ulangi kuis
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="rounded-lg bg-[#486C91] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa kuis
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#486C91]/20 bg-[#1D2A37]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#A9C9E8]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi Can-do</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">
          Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.
        </p>
        <div className="space-y-3">
          {canDos.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A9C9E8]">{item.source}</p>
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
                        ? "border-[#A9C9E8]/50 bg-[#486C91]/20 text-[#F8EEDC]"
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
              ? "Lesson 10 selesai. Progres tersimpan."
              : canDosRated
                ? "Semua target Can-do sudah dinilai."
                : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button
            type="button"
            onClick={finishLesson}
            disabled={!canComplete || isCompleted}
            className="rounded-xl bg-[#486C91] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#3A5C7A] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
          >
            {isCompleted ? "Lesson 10 selesai" : "Selesaikan Lesson 10"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Elementary 2 · 10 / 18</span>
      </div>
    </main>
  );
}
