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
const lessonId = "elementary2-18";

const dreamConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>将来、どんなことをしたいと思っていますか。</>, romaji: "Shourai, donna koto o shitai to omotte imasu ka?", translation: "Apa yang ingin kamu lakukan di masa depan?", audioFileName: "irodori-elementary2-18-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>いろいろな人の役に立つ仕事をしようと思っています。</>, romaji: "Iroiro na hito no yaku ni tatsu shigoto o shiyou to omotte imasu.", translation: "Saya berencana bekerja di bidang yang bisa bermanfaat bagi banyak orang.", audioFileName: "irodori-elementary2-18-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>そのために、今、何をしていますか。</>, romaji: "Sono tame ni, ima, nani o shite imasu ka?", translation: "Untuk mencapainya, apa yang kamu lakukan sekarang?", audioFileName: "irodori-elementary2-18-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>いろいろな本を読んで、外国語も勉強しようと思います。</>, romaji: "Iroiro na hon o yonde, gaikokugo mo benkyou shiyou to omoimasu.", translation: "Saya berencana membaca berbagai buku dan juga belajar bahasa asing.", audioFileName: "irodori-elementary2-18-a01-l04.mp3" },
];
const experienceConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>日本に来たばかりのころ、何が大変でしたか。</>, romaji: "Nihon ni kita bakari no koro, nani ga taihen deshita ka?", translation: "Apa yang terasa sulit ketika baru datang ke Jepang?", audioFileName: "irodori-elementary2-18-a02-l01.mp3" },
  { speakerId: "kenji", japanese: <>最初は、店員さんの説明がよくわかりませんでした。</>, romaji: "Saisho wa, tenin-san no setsumei ga yoku wakarimasen deshita.", translation: "Awalnya saya sulit memahami penjelasan pegawai toko.", audioFileName: "irodori-elementary2-18-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>どうやって慣れましたか。</>, romaji: "Dou yatte naremashita ka?", translation: "Bagaimana akhirnya kamu bisa terbiasa?", audioFileName: "irodori-elementary2-18-a02-l03.mp3" },
  { speakerId: "kenji", japanese: <>毎日少しずつ日本語を勉強して、わからないことを友達に聞きました。</>, romaji: "Mainichi sukoshi zutsu nihongo o benkyou shite, wakaranai koto o tomodachi ni kikimashita.", translation: "Saya belajar bahasa Jepang sedikit demi sedikit dan bertanya kepada teman kalau ada yang tidak saya pahami.", audioFileName: "irodori-elementary2-18-a02-l04.mp3" },
];
const adviceConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>日本で生活するとき、何が大切だと思いますか。</>, romaji: "Nihon de seikatsu suru toki, nani ga taisetsu da to omoimasu ka?", translation: "Apa yang penting ketika tinggal di Jepang?", audioFileName: "irodori-elementary2-18-a03-l01.mp3" },
  { speakerId: "akiko", japanese: <>一人で悩まないで、周りの人に相談するといいと思います。</>, romaji: "Hitori de nayamanaide, mawari no hito ni soudan suru to ii to omoimasu.", translation: "Menurut saya, jangan hadapi masalah sendirian. Coba bicarakan dengan orang-orang di sekitar.", audioFileName: "irodori-elementary2-18-a03-l02.mp3" },
  { speakerId: "yui", japanese: <>私も、いろいろな人と知り合いたいです。</>, romaji: "Watashi mo, iroiro na hito to shiriaitai desu.", translation: "Saya juga ingin mengenal banyak orang.", audioFileName: "irodori-elementary2-18-a03-l03.mp3" },
  { speakerId: "akiko", japanese: <>そのために、地域のイベントに参加してみたらどうですか。</>, romaji: "Sono tame ni, chiiki no ibento ni sanka shite mitara dou desu ka?", translation: "Kalau begitu, bagaimana kalau ikut acara di lingkungan sekitar?", audioFileName: "irodori-elementary2-18-a03-l04.mp3" },
];
const farewellConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>日本語コースの最後の日に、みんなの前であいさつをします。</>, romaji: "Nihongo koosu no saigo no hi ni, minna no mae de aisatsu o shimasu.", translation: "Pada hari terakhir kursus bahasa Jepang, saya akan menyampaikan sambutan di depan semua orang.", audioFileName: "irodori-elementary2-18-a04-l01.mp3" },
  { speakerId: "sota", japanese: <>まず、どんなことを話しますか。</>, romaji: "Mazu, donna koto o hanashimasu ka?", translation: "Apa yang ingin kamu sampaikan lebih dulu?", audioFileName: "irodori-elementary2-18-a04-l02.mp3" },
  { speakerId: "kenji", japanese: <>一緒に勉強した思い出と、手伝ってもらったことへの感謝を話そうと思います。</>, romaji: "Issho ni benkyou shita omoide to, tetsudatte moratta koto e no kansha o hanasou to omoimasu.", translation: "Saya ingin menceritakan kenangan belajar bersama dan mengucapkan terima kasih atas bantuan yang pernah saya terima.", audioFileName: "irodori-elementary2-18-a04-l03.mp3" },
  { speakerId: "sota", japanese: <>最後に、これからの目標も話すといいですね。</>, romaji: "Saigo ni, kore kara no mokuhyou mo hanasu to ii desu ne.", translation: "Di bagian akhir, kamu juga bisa menyampaikan tujuanmu ke depannya.", audioFileName: "irodori-elementary2-18-a04-l04.mp3" },
];
const helpConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>この前、ユイさんに発表の練習を手伝ってもらいました。</>, romaji: "Kono mae, Yui-san ni happyou no renshuu o tetsudatte moraimashita.", translation: "Beberapa waktu lalu, Yui membantu saya berlatih presentasi.", audioFileName: "irodori-elementary2-18-a05-l01.mp3" },
  { speakerId: "yui", japanese: <>私も、アキコさんに資料を見せてもらいました。</>, romaji: "Watashi mo, Akiko-san ni shiryou o misete moraimashita.", translation: "Saya juga sempat melihat materi yang ditunjukkan Akiko.", audioFileName: "irodori-elementary2-18-a05-l02.mp3" },
  { speakerId: "akiko", japanese: <>ソウタさんが、発表のあとで写真を撮ってくれましたね。</>, romaji: "Souta-san ga, happyou no ato de shashin o totte kuremashita ne.", translation: "Sota juga mengambil foto setelah presentasi, ya.", audioFileName: "irodori-elementary2-18-a05-l03.mp3" },
  { speakerId: "yui", japanese: <>はい。みんなが手伝ってくれて、本当にうれしかったです。</>, romaji: "Hai. Minna ga tetsudatte kurete, hontou ni ureshikatta desu.", translation: "Ya. Saya senang sekali karena semua orang sudah membantu saya.", audioFileName: "irodori-elementary2-18-a05-l04.mp3" },
];

const canDos = [
  { id: "talk-about-future-hopes", source: "CAN-DO 76", text: "Membicarakan secara sederhana impian, harapan, dan rencana untuk masa depan." },
  { id: "understand-experience-and-advice", source: "CAN-DO 77", text: "Mendengarkan pengalaman serta saran seseorang yang sudah lama tinggal di Jepang dan memahami garis besar isinya." },
  { id: "give-a-thank-you-speech", source: "CAN-DO 78", text: "Menyampaikan ucapan terima kasih dalam acara perpisahan dengan menyertakan satu atau dua pengalaman singkat." },
];

const vocabRows: [string, string, string][] = [
  ["将来", "しょうらい · shourai", "Masa depan"],
  ["夢", "ゆめ · yume", "Impian"],
  ["希望", "きぼう · kibou", "Harapan"],
  ["会社", "かいしゃ · kaisha", "Perusahaan"],
  ["作る", "つくる · tsukuru", "Membuat"],
  ["就職する", "しゅうしょくする · shuushoku suru", "Mendapat pekerjaan"],
  ["店", "みせ · mise", "Toko"],
  ["持つ", "もつ · motsu", "Memiliki"],
  ["稼ぐ", "かせぐ · kasegu", "Menghasilkan uang"],
  ["貯金する", "ちょきんする · chokin suru", "Menabung"],
  ["結婚する", "けっこんする · kekkon suru", "Menikah"],
  ["家", "いえ · ie", "Rumah"],
  ["建てる", "たてる · tateru", "Membangun"],
  ["買う", "かう · kau", "Membeli"],
  ["進学する", "しんがくする · shingaku suru", "Melanjutkan pendidikan"],
  ["留学する", "りゅうがくする · ryuugaku suru", "Belajar di luar negeri"],
  ["暮らす", "くらす · kurasu", "Menjalani kehidupan atau tinggal"],
  ["のんびり", "のんびり · nonbiri", "Dengan santai"],
  ["職人", "しょくにん · shokunin", "Perajin atau tenaga ahli"],
  ["ガイド", "ガイド · gaido", "Pemandu"],
  ["通訳", "つうやく · tsuuyaku", "Penerjemah lisan"],
  ["日本語教師", "にほんごきょうし · nihongo kyoushi", "Guru bahasa Jepang"],
  ["自動車", "じどうしゃ · jidousha", "Mobil"],
  ["整備", "せいび · seibi", "Perawatan atau pemeliharaan"],
  ["役に立つ", "やくにたつ · yaku ni tatsu", "Bermanfaat atau berguna"],
  ["技術", "ぎじゅつ · gijutsu", "Keterampilan atau teknik"],
  ["がんばる", "がんばる · ganbaru", "Berusaha dengan tekun"],
  ["暮らし", "くらし · kurashi", "Kehidupan sehari-hari"],
  ["うまくいく", "うまくいく · umaku iku", "Berjalan dengan baik"],
  ["若者", "わかもの · wakamono", "Anak muda"],
  ["卒業する", "そつぎょうする · sotsugyou suru", "Lulus"],
  ["広げる", "ひろげる · hirogeru", "Memperluas"],
  ["募集", "ぼしゅう · boshuu", "Perekrutan atau lowongan"],
  ["応募する", "おうぼする · oubo suru", "Melamar"],
  ["続ける", "つづける · tsuzukeru", "Melanjutkan"],
  ["とにかく", "とにかく · tonikaku", "Pokoknya atau bagaimanapun"],
  ["知り合う", "しりあう · shiriau", "Berkenalan"],
  ["経験", "けいけん · keiken", "Pengalaman"],
  ["文化", "ぶんか · bunka", "Budaya"],
  ["相談する", "そうだんする · soudan suru", "Berkonsultasi atau berdiskusi"],
  ["送別会", "そうべつかい · soubetsukai", "Acara perpisahan"],
  ["最後", "さいご · saigo", "Terakhir"],
  ["あいさつ", "あいさつ · aisatsu", "Salam atau sambutan"],
  ["感謝する", "かんしゃする · kansha suru", "Berterima kasih"],
  ["親切（な）", "しんせつ（な） · shinsetsu (na)", "Ramah atau baik hati"],
  ["助ける", "たすける · tasukeru", "Membantu"],
  ["貸す", "かす · kasu", "Meminjamkan"],
  ["ごちそうする", "ごちそうする · gochisou suru", "Menraktir atau menjamu"],
  ["思い出", "おもいで · omoide", "Kenangan"],
  ["世話になる", "せわになる · sewa ni naru", "Menerima bantuan atau perhatian"],
];

const kanjiWords = [
  ["希望", "きぼう · kibou", "Harapan"],
  ["募集", "ぼしゅう · boshuu", "Perekrutan atau lowongan"],
  ["特に", "とくに · tokuni", "Khususnya"],
  ["住む", "すむ · sumu", "Tinggal"],
  ["建てる", "たてる · tateru", "Membangun"],
  ["続ける", "つづける · tsuzukeru", "Melanjutkan"],
  ["考える", "かんがえる · kangaeru", "Memikirkan"],
  ["役に立つ", "やくにたつ · yaku ni tatsu", "Bermanfaat"],
  ["卒業する", "そつぎょうする · sotsugyou suru", "Lulus"],
  ["留学する", "りゅうがくする · ryuugaku suru", "Belajar di luar negeri"],
];

const dreamExamples = [
  { title: "Mimpi atau harapan", jp: "将来、日本語の先生になりたいと思っています。", meaning: "Saya ingin menjadi guru bahasa Jepang di masa depan." },
  { title: "Rencana yang dipikirkan", jp: "将来、自分の店を持とうと思います。", meaning: "Saya berpikir untuk memiliki toko sendiri di masa depan." },
  { title: "Rencana yang lebih pasti", jp: "学校を卒業したら、大学に進学するつもりです。", meaning: "Setelah lulus sekolah, saya berencana melanjutkan ke universitas." },
  { title: "Tujuan dan usaha", jp: "日本語を上手に話すために、毎日練習しています。", meaning: "Saya berlatih setiap hari agar bisa berbicara bahasa Jepang dengan baik." },
];

const grammarNotes = [
  { title: "01 · Menyampaikan rencana dan niat masa depan", pattern: "V-（よ）うと思います／思っています", example: <>将来、自分の店を持とうと思います。<br />日本語の勉強を続けようと思っています。</>, note: "Tambahkan と 思います／思っています setelah bentuk volisional (意向形). Pola ini menyampaikan niat atau rencana masa depan. 思っています menekankan bahwa pemikiran tersebut sudah ada sejak beberapa waktu. Contoh: 行く → 行こう, 働く → 働こう, 見る → 見よう, する → しよう, 来る → 来よう. Bandingkan dengan V-るつもりです untuk rencana yang lebih konkret dan V-たいと思っています untuk menyatakan sesuatu yang diinginkan." },
  { title: "02 · Menyatakan tujuan", pattern: "V-るために、～", example: <>日本語の先生になるために、勉強しています。<br />将来、自分の店を持つために、経験を積みます。</>, note: "Hubungkan bentuk kamus kata kerja dengan ために untuk menyatakan tujuan tindakan. Biasanya digunakan dengan kata kerja yang berada dalam kendali atau kehendak seseorang, misalnya 勉強する, 就職する, 会社を作る. Bedakan dengan V-る／V-ない／V-可能形 + ように yang menyatakan keadaan yang ingin dicapai atau dihindari." },
  { title: "03 · Melakukan sesuatu untuk orang lain", pattern: "V-てあげます", example: <>友達に、日本語を教えてあげました。<br />妹のために、料理を作ってあげます。</>, note: "Pola ini menyatakan bahwa seseorang melakukan tindakan yang dianggap bermanfaat bagi orang lain. Tambahkan あげる setelah bentuk て. Penerima tindakan ditandai dengan に. Untuk guru, atasan, atau orang yang dihormati, hindari bentuk ini karena dapat terdengar memaksakan kebaikan; pilih ungkapan yang lebih sesuai." },
  { title: "04 · Menerima bantuan atau tindakan dari orang lain", pattern: "V-てもらいます", example: <>友達に、作文を直してもらいました。<br />先生に、発音を教えていただきました。</>, note: "Pola ini menyoroti tindakan yang diterima oleh pembicara dari orang lain dan dianggap bermanfaat. Orang yang menerima tindakan menjadi subjek, sedangkan pemberi tindakan dapat ditandai dengan に. Untuk orang yang dihormati, gunakan bentuk sopan V-ていただきます." },
  { title: "05 · Orang lain melakukan sesuatu untuk pembicara", pattern: "V-てくれます", example: <>友達が、宿題を手伝ってくれました。<br />山田さんが、駅まで案内してくれました。</>, note: "Pola ini menyatakan bahwa orang lain melakukan tindakan yang bermanfaat bagi pembicara. Orang yang melakukan tindakan menjadi subjek. Penerima biasanya adalah pembicara dan dapat dihilangkan jika sudah jelas. Bedakan: V-てあげる = melakukan untuk orang lain; V-てもらう = menerima tindakan; V-てくれる = orang lain melakukan untuk saya." },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];
type Task = { prompt: ReactNode; options: { key: string; label: ReactNode }[]; answer: string; explanation: ReactNode; };
type Simulation = { title: string; heading: string; prompt: string; japanese: ReactNode; translation: string; options: { key: string; label: string; meaning: string }[]; answer: string; explanation: string; };

const simulations: Simulation[] = [
  { title: "01 · Membicarakan impian masa depan", heading: "Memilih ungkapan niat", prompt: "Kamu sudah memikirkan untuk menjadi pemandu wisata di masa depan. Kalimat mana yang menyatakan niat yang sudah dipikirkan?", japanese: <>将来、ツアーガイドになろうと思っています。</>, translation: "Saya sudah berencana menjadi pemandu wisata di masa depan.", options: [
    { key: "a", label: "将来、ツアーガイドになろうと思っています。", meaning: "Bentuk volisional + と思っています menunjukkan niat yang sudah dipikirkan sejak beberapa waktu." },
    { key: "b", label: "将来、ツアーガイドになったことがあります。", meaning: "Kalimat ini berarti pernah menjadi pemandu wisata." },
    { key: "c", label: "将来、ツアーガイドになりませんでした。", meaning: "Kalimat ini berbentuk negatif lampau, bukan rencana masa depan." },
  ], answer: "a", explanation: "Perhatikan bentuk volisional seperti なろう, lalu 思っています untuk niat yang sudah ada." },
  { title: "02 · Memahami pengalaman dan saran", heading: "Menangkap inti cerita", prompt: "Seseorang yang sudah lama tinggal di Jepang berkata 「わからないことがあったら、周りの人に相談するといいですよ」. Apa sarannya?", japanese: <>わからないことがあったら、周りの人に相談するといいですよ。</>, translation: "Jika ada hal yang tidak dipahami, sebaiknya berkonsultasi dengan orang di sekitar.", options: [
    { key: "a", label: "Simpan semua pertanyaan sendiri.", meaning: "Kalimat justru menyarankan untuk berbicara dengan orang sekitar." },
    { key: "b", label: "Tanyakan atau diskusikan hal yang tidak dipahami dengan orang sekitar.", meaning: "相談するといい berarti sebaiknya berkonsultasi." },
    { key: "c", label: "Berhenti mempelajari bahasa Jepang.", meaning: "Tidak ada saran untuk berhenti belajar." },
  ], answer: "b", explanation: "Dengarkan kata kunci わからないこと dan 相談するといい untuk menangkap saran." },
  { title: "03 · Menyatakan tujuan", heading: "Memilih pola yang sesuai", prompt: "Kamu sedang belajar bahasa Jepang agar bisa bekerja sebagai pemandu. Ungkapan mana yang tepat untuk tujuan yang disengaja?", japanese: <>ガイドになるために、日本語を勉強しています。</>, translation: "Saya belajar bahasa Jepang untuk menjadi pemandu.", options: [
    { key: "a", label: "ガイドになるために、日本語を勉強しています。", meaning: "V-るために menyatakan tujuan dan terhubung dengan bentuk kamus." },
    { key: "b", label: "ガイドになったために、日本語を勉強しています。", meaning: "Bentuk lampau tidak menyatakan tujuan seperti yang dimaksud." },
    { key: "c", label: "ガイドになるても、日本語を勉強しています。", meaning: "Bentuk ini tidak sesuai dengan pola tata bahasa." },
  ], answer: "a", explanation: "ために dipakai untuk menyatakan tujuan yang dilakukan dengan kehendak sendiri." },
  { title: "04 · Menyampaikan pidato terima kasih", heading: "Menyusun bagian pidato", prompt: "Dalam pidato perpisahan kelas, kamu ingin menyebut kenangan belajar bersama dan berterima kasih kepada teman yang membantu. Isi mana yang paling tepat?", japanese: <>みなさん、一緒に勉強してくれて、ありがとうございました。</>, translation: "Terima kasih semuanya sudah belajar bersama saya.", options: [
    { key: "a", label: "Salam, kenangan atau bantuan yang diterima, ucapan terima kasih, dan penutup.", meaning: "Struktur ini membuat pidato singkat terasa jelas dan hangat." },
    { key: "b", label: "Hanya menyebut nama orang tanpa penjelasan.", meaning: "Ucapan terima kasih lebih mudah dipahami jika disertai alasan atau kenangan." },
    { key: "c", label: "Membicarakan topik yang tidak berkaitan dengan perpisahan.", meaning: "Isi sebaiknya sesuai dengan situasi perpisahan." },
  ], answer: "a", explanation: "Pidato dapat berisi salam pembuka, pengalaman singkat, ucapan terima kasih, harapan, dan salam penutup." },
  { title: "05 · Memahami ungkapan bantuan", heading: "Membedakan penerima dan pemberi bantuan", prompt: "Kalimat 「友達が、宿題を手伝ってくれました」 berarti apa?", japanese: <>友達が、宿題を手伝ってくれました。</>, translation: "Teman membantu saya mengerjakan tugas.", options: [
    { key: "a", label: "Saya membantu teman mengerjakan tugas.", meaning: "Itu akan dinyatakan dengan pola lain, misalnya 友達を手伝ってあげました." },
    { key: "b", label: "Teman melakukan tindakan yang membantu saya.", meaning: "V-てくれる menyatakan orang lain melakukan sesuatu yang bermanfaat bagi pembicara." },
    { key: "c", label: "Saya meminta teman berhenti mengerjakan tugas.", meaning: "Kalimat tidak mengandung larangan atau permintaan berhenti." },
  ], answer: "b", explanation: "Perhatikan subjek 友達が dan bentuk 手伝ってくれました." },
];

const practiceTasks: Task[] = [
  { prompt: <>Pilih bentuk volisional dari 「行く」.</>, options: [{ key: "a", label: "行こう" }, { key: "b", label: "行きよう" }, { key: "c", label: "行って" }], answer: "a", explanation: <>行く → 行こう adalah bentuk volisional kelompok 1.</> },
  { prompt: <>Pilih bentuk volisional dari 「見る」.</>, options: [{ key: "a", label: "見ろう" }, { key: "b", label: "見よう" }, { key: "c", label: "見って" }], answer: "b", explanation: <>Untuk kelompok 2, hilangkan る dan tambahkan よう: 見る → 見よう.</> },
  { prompt: <>Lengkapi: 「日本語の先生になる＿＿＿＿、勉強しています。」</>, options: [{ key: "a", label: "ために" }, { key: "b", label: "てあげる" }, { key: "c", label: "と思います" }], answer: "a", explanation: <>V-るために menyatakan tujuan tindakan.</> },
  { prompt: <>Kalimat mana yang berarti “Saya membuatkan makanan untuk teman”?</>, options: [{ key: "a", label: "友達に料理を作ってあげました。" }, { key: "b", label: "友達に料理を作ってもらいました。" }, { key: "c", label: "友達が料理を作ってくれました。" }], answer: "a", explanation: <>V-てあげる menyatakan pembicara melakukan sesuatu untuk orang lain.</> },
  { prompt: <>Kalimat 「先生に作文を直していただきました」 menggunakan bentuk apa?</>, options: [{ key: "a", label: "V-ていただく, bentuk hormat dari menerima bantuan." }, { key: "b", label: "V-てあげる, melakukan sesuatu untuk orang lain." }, { key: "c", label: "V-てくれる, orang lain melakukan untuk pembicara." }], answer: "a", explanation: <>V-ていただく adalah bentuk lebih hormat dari V-てもらう.</> },
  { prompt: <>Kalimat 「友達が写真を撮ってくれました」 berarti ...</>, options: [{ key: "a", label: "Saya mengambil foto untuk teman." }, { key: "b", label: "Teman mengambilkan foto untuk saya." }, { key: "c", label: "Saya meminta teman membeli kamera." }], answer: "b", explanation: <>V-てくれる menyatakan orang lain melakukan sesuatu untuk pembicara.</> },
];

const quizQuestions: Task[] = [
  { prompt: <>Apa arti 「将来」?</>, options: [{ key: "a", label: "Masa depan." }, { key: "b", label: "Masa lalu." }, { key: "c", label: "Hari libur." }], answer: "a", explanation: <>将来 berarti masa depan.</> },
  { prompt: <>Apa arti 「職人」?</>, options: [{ key: "a", label: "Perajin atau tenaga ahli." }, { key: "b", label: "Pengunjung." }, { key: "c", label: "Penerjemah." }], answer: "a", explanation: <>職人 adalah orang yang memiliki keterampilan khusus dalam suatu bidang.</> },
  { prompt: <>Apa fungsi 「V-（よ）うと思います」?</>, options: [{ key: "a", label: "Menyampaikan niat atau rencana masa depan." }, { key: "b", label: "Menceritakan pengalaman masa kecil." }, { key: "c", label: "Meminta izin." }], answer: "a", explanation: <>Bentuk volisional + と思います menyatakan kehendak atau rencana pembicara.</> },
  { prompt: <>Apa arti 「V-るために」?</>, options: [{ key: "a", label: "Untuk mencapai tujuan melakukan sesuatu." }, { key: "b", label: "Meskipun sesuatu terjadi." }, { key: "c", label: "Karena sesuatu telah selesai." }], answer: "a", explanation: <>ために setelah bentuk kamus menyatakan tujuan tindakan.</> },
  { prompt: <>Apa arti 「卒業する」?</>, options: [{ key: "a", label: "Lulus." }, { key: "b", label: "Mendaftar." }, { key: "c", label: "Menyumbang." }], answer: "a", explanation: <>卒業する berarti lulus dari sekolah atau program pendidikan.</> },
  { prompt: <>Apa fungsi 「V-てもらいます」?</>, options: [{ key: "a", label: "Menerima tindakan atau bantuan dari orang lain." }, { key: "b", label: "Melakukan sesuatu untuk orang lain." }, { key: "c", label: "Memerintah orang lain." }], answer: "a", explanation: <>Pola ini menyoroti tindakan yang diterima oleh pembicara dari seseorang.</> },
  { prompt: <>Apa perbedaan dasar 「V-てくれます」?</>, options: [{ key: "a", label: "Orang lain melakukan sesuatu yang bermanfaat bagi pembicara." }, { key: "b", label: "Pembicara memberi perintah kepada orang lain." }, { key: "c", label: "Pembicara melakukan sesuatu untuk dirinya sendiri." }], answer: "a", explanation: <>Orang yang melakukan tindakan menjadi subjek; penerimanya adalah pembicara.</> },
  { prompt: <>Mengapa V-てあげる sebaiknya tidak digunakan sembarangan untuk guru atau atasan?</>, options: [{ key: "a", label: "Dapat terdengar seolah-olah memaksakan kebaikan dan kurang sopan." }, { key: "b", label: "Karena bentuknya hanya untuk masa lampau." }, { key: "c", label: "Karena tidak bisa dipakai dengan kata kerja." }], answer: "a", explanation: <>Untuk orang yang dihormati, pilih ungkapan yang lebih sesuai dan sopan.</> },
  { prompt: <>Apa arti 「送別会」?</>, options: [{ key: "a", label: "Acara perpisahan." }, { key: "b", label: "Rapat mingguan." }, { key: "c", label: "Kelas tambahan." }], answer: "a", explanation: <>送別会 adalah acara untuk melepas seseorang yang akan pergi.</> },
  { prompt: <>Bagian apa yang sebaiknya ada dalam pidato ucapan terima kasih?</>, options: [{ key: "a", label: "Salam, pengalaman singkat, ucapan terima kasih, dan penutup." }, { key: "b", label: "Hanya menyebut angka tanpa penjelasan." }, { key: "c", label: "Informasi pribadi orang lain yang tidak perlu." }], answer: "a", explanation: <>Struktur sederhana membantu pendengar memahami alasan kita berterima kasih.</> },
];

export default function IrodoriElementaryTwoLessonEighteenPage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [futureSpeechDraft, setFutureSpeechDraft] = useState("");

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
  const resetPractice = () => { setPracticeAnswers({}); setPracticeSubmitted(false); };
  const resetQuiz = () => { setAnswers({}); setQuizSubmitted(false); };
  const resetSimulations = () => { setSimulationChoices({}); setSimulationChecked({}); };
  const finishLesson = () => { if (!canComplete || isCompleted) return; completeIrodoriLesson(lessonId); };

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-12">
      <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5]"><ArrowLeft size={15} /> Kembali ke Dasar 2</Link>
      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#A64C77]/35 bg-gradient-to-br from-[#422337] via-[#1B1A18] to-[#171615] p-6 md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#E5A9C4]/[0.08]">夢</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#E5A9C4]">IRODORI • DASAR 2 A2 • PELAJARAN 18</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya berpikir untuk mendirikan perusahaan sendiri di masa depan.</h1>
          <p className="mt-2 text-sm font-semibold text-[#E5A9C4]">将来、自分の会社を作ろうと思います</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar membicarakan impian masa depan, memahami pengalaman dan saran, menjelaskan tujuan, serta menyampaikan ucapan terima kasih dalam pidato perpisahan.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] text-[#C9C3B8]">Impian dan rencana</span>
            <span className="rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] text-[#C9C3B8]">Pengalaman dan saran</span>
            <span className="rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] text-[#C9C3B8]">Ucapan terima kasih</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#A64C77]/20 bg-[#35232D]/70 p-4 md:p-5">
        <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Tiga target berikut mengikuti target komunikasi 76–78 pada Irodori Dasar 2 Lesson 18.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#E5A9C4]">{item.source} · {String(index + 1).padStart(2, "0")}</p><p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p></article>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Impian, pengalaman, dan ucapan terima kasih</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Lima percakapan ini ditulis orisinal oleh Fude.</p></div>
        <div className="space-y-4">
          <IrodoriConversation title="Berbagi impian masa depan" speakers={[friendYui, friendSota]} utterances={dreamConversation} />
          <IrodoriConversation title="Mendengarkan pengalaman tinggal di Jepang" speakers={[friendAkiko, friendKenji]} utterances={experienceConversation} />
          <IrodoriConversation title="Memberi saran sederhana" speakers={[friendYui, friendAkiko]} utterances={adviceConversation} />
          <IrodoriConversation title="Menyiapkan pidato perpisahan" speakers={[friendKenji, friendSota]} utterances={farewellConversation} />
          <IrodoriConversation title="Menceritakan bantuan dan rasa terima kasih" speakers={[friendAkiko, friendYui]} utterances={helpConversation} />
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-[#A64C77]/20 bg-[#35232D]/60 p-4 md:p-5">
        <h2 className="text-sm font-bold text-[#EAE6DD]">Contoh impian dan tujuan</h2>
        <p className="text-xs leading-6 text-[#A9A398]">Impian setiap orang berbeda. Kamu boleh membicarakan tujuan belajar, hobi, kegiatan, atau pekerjaan yang ingin dijelajahi di masa depan.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {dreamExamples.map((item) => <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="text-sm font-bold tracking-[0.02em] text-[#E5A9C4]">{item.title}</p><p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{item.jp}</JapaneseReading></p><p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{item.meaning}</p></article>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">KOSAKATA KEHIDUPAN DAN MASA DEPAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima puluh kosakata penting</h2></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E5A9C4]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">KANJI UTAMA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sepuluh kata kanji pada materi resmi</h2></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => <article key={jp} className="rounded-xl border border-[#A64C77]/20 bg-[#35232D]/50 p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E5A9C4]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">POLA TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima pola untuk impian, tujuan, dan ungkapan bantuan</h2></div>
        {grammarNotes.map((item) => <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-sm font-bold tracking-[0.02em] text-[#E5A9C4]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p><p className="mt-2 font-mincho text-base leading-8 text-[#E5A9C4]"><JapaneseReading allowIndexFallback romajiClassName="mt-1 text-sm italic text-[#D9B66D]">{item.example}</JapaneseReading></p><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>)}
      </section>

      <section className="space-y-4 rounded-2xl border border-[#A64C77]/20 bg-[#35232D]/60 p-4 md:p-5">
        <h2 className="text-sm font-bold text-[#EAE6DD]">Latihan pidato singkat tentang tujuan dan rasa terima kasih</h2>
        <p className="text-xs leading-6 text-[#A9A398]">Bayangkan kamu menutup kursus atau kegiatan belajar. Tulis salam pembuka, satu kenangan atau bantuan yang pernah diterima, ucapan terima kasih, dan satu tujuan untuk masa depan. Gunakan nama samaran; jangan tuliskan alamat atau informasi pribadi.</p>
        <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#E5A9C4]">CONTOH ORISINAL FUDE</p><p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">みなさん、いっしょに勉強してくれて、ありがとうございました。<br />わからないとき、友達に助けてもらいました。<br />これからも、日本語の勉強を続けようと思います。</p><p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Terima kasih semuanya sudah belajar bersama saya. Ketika saya tidak mengerti, teman membantu saya. Saya berencana melanjutkan belajar bahasa Jepang.</p></div>
        <label htmlFor="future-speech-draft" className="block text-xs font-semibold text-[#E5A9C4]">Tulis pidato singkatmu dalam bahasa Jepang</label>
        <textarea id="future-speech-draft" value={futureSpeechDraft} onChange={(event) => setFutureSpeechDraft(event.target.value)} rows={5} placeholder="みなさん、ありがとうございました。" className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none placeholder:text-[#746F65] focus:border-[#E5A9C4]/50" />
        <div className="flex items-center justify-between gap-3"><p className="text-[10px] text-[#817A73]">Draf hanya digunakan untuk latihan di halaman ini.</p><span className="text-[10px] tabular-nums text-[#E5A9C4]">{futureSpeechDraft.length} karakter</span></div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">SIMULASI SITUASI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan bahasa Jepang dalam konteks</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan kelima situasi dengan memilih jawaban yang paling sesuai. Semua simulasi harus benar untuk membuka evaluasi.</p></div>
        {simulations.map((task, index) => {
          const selected = simulationChoices[index];
          const checked = Boolean(simulationChecked[index]);
          const isCorrect = checked && selected === task.answer;
          const isWrong = checked && selected !== task.answer;
          return <article key={task.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#E5A9C4]">{task.title}</p><h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></p>
            <div className="mt-3 rounded-xl border border-[#A64C77]/20 bg-[#35232D]/60 p-3"><p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.japanese}</JapaneseReading></p><p className="mt-1 text-xs text-[#A9A398]">{task.translation}</p></div>
            <div className="mt-3 grid gap-2">{task.options.map((option) => <button key={option.key} type="button" disabled={isCorrect} aria-pressed={selected === option.key} onClick={() => { setSimulationChoices((current) => ({ ...current, [index]: option.key })); setSimulationChecked((current) => ({ ...current, [index]: false })); }} className={"rounded-lg border px-3 py-2.5 text-left text-xs " + (isCorrect && option.key === task.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : selected === option.key ? "border-[#E5A9C4]/60 bg-[#A64C77]/15 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>
            {(isCorrect || isWrong) && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>{isCorrect ? task.explanation : "Tinjau kembali informasi dan pilih jawaban yang sesuai."}</p>}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-[10px] text-[#817A73]">{isCorrect ? "Situasi selesai" : "Pilih jawaban lalu periksa"}</p><button type="button" disabled={!selected || isCorrect} onClick={() => setSimulationChecked((current) => ({ ...current, [index]: true }))} className="rounded-lg bg-[#A64C77] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">{isCorrect ? "Selesai" : "Periksa"}</button></div>
            {checked && isWrong && <p className="mt-2 text-[10px] text-[#E7A1A1]">{task.options.find((option) => option.key === task.answer)?.meaning}</p>}
          </article>;
        })}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-xs text-[#A9A398]">Simulasi benar: {simulationScore} dari {simulations.length}.</p><button type="button" onClick={resetSimulations} className="rounded-lg border border-[#A64C77]/35 px-4 py-2 text-xs font-bold text-[#E5A9C4]"><RefreshCw size={13} /> Ulangi simulasi</button></div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p></div>
        <div className="space-y-3">{practiceTasks.map((task, index) => { const selected = practiceAnswers[index]; const isCorrect = selected === task.answer; return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#E5A9C4]">LATIHAN {String(index + 1).padStart(2, "0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{task.options.map((option) => <button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected === option.key} onClick={() => setPracticeAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs " + (practiceSubmitted && option.key === task.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : practiceSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#E5A9C4]/60 bg-[#A64C77]/15 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{practiceSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.explanation}</JapaneseReading></p>}</article>; })}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{practiceSubmitted ? "Hasil praktik: " + practiceScore + " dari " + practiceTasks.length + " benar." : Object.keys(practiceAnswers).length + " dari " + practiceTasks.length + " pertanyaan dijawab."}</p>{practiceSubmitted ? <button type="button" onClick={resetPractice} className="rounded-lg border border-[#A64C77]/35 px-4 py-2 text-xs font-bold text-[#E5A9C4]"><RefreshCw size={13} /> Ulangi praktik</button> : <button type="button" onClick={() => setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length !== practiceTasks.length} className="rounded-lg bg-[#A64C77] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D]">Periksa praktik</button>}</div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#E5A9C4]">KUIS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2></div>
        <div className="space-y-3">{quizQuestions.map((question, index) => { const selected = answers[index]; const isCorrect = selected === question.answer; return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#E5A9C4]">SOAL {String(index + 1).padStart(2, "0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{question.options.map((option) => <button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected === option.key} onClick={() => setAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs " + (quizSubmitted && option.key === question.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : quizSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#E5A9C4]/60 bg-[#A64C77]/15 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{quizSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.explanation}</JapaneseReading></p>}</article>; })}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{quizSubmitted ? "Nilai kuis: " + quizScore + " dari " + quizQuestions.length + " benar." : Object.keys(answers).length + " dari " + quizQuestions.length + " pertanyaan dijawab."}</p>{quizSubmitted ? <button type="button" onClick={resetQuiz} className="rounded-lg border border-[#A64C77]/35 px-4 py-2 text-xs font-bold text-[#E5A9C4]"><RefreshCw size={13} /> Ulangi kuis</button> : <button type="button" onClick={() => setQuizSubmitted(true)} disabled={Object.keys(answers).length !== quizQuestions.length} className="rounded-lg bg-[#A64C77] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D]">Periksa kuis</button>}</div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#A64C77]/20 bg-[#35232D]/70 p-4 md:p-5">
        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#E5A9C4]" /><h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi target komunikasi</h2></div>
        <p className="text-xs leading-6 text-[#A9A398]">Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan.</p>
        <div className="space-y-3">{canDos.map((item) => <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#E5A9C4]">{item.source}</p><p className="mt-1 text-xs leading-5 text-[#EAE6DD]">{item.text}</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{ratingOptions.map((option) => <button key={option.value} type="button" disabled={!canEvaluate} aria-pressed={visibleRatings[item.id] === option.value} onClick={() => { const nextRatings = { ...visibleRatings, [item.id]: option.value }; setRatings(nextRatings); saveIrodoriSelfEvaluation(lessonId, nextRatings); }} className={"rounded-lg border px-3 py-2 text-left text-[10px] font-semibold disabled:opacity-40 " + (visibleRatings[item.id] === option.value ? "border-[#E5A9C4]/50 bg-[#A64C77]/20 text-[#F8EEDC]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>)}</div></article>)}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4"><p className="text-xs text-[#A9A398]">{isCompleted ? "Lesson 18 selesai." : canDosRated ? "Semua target komunikasi sudah dinilai." : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}</p><button type="button" onClick={finishLesson} disabled={!canComplete || isCompleted} className="rounded-xl bg-[#A64C77] px-5 py-2.5 text-xs font-black text-white disabled:bg-[#39342D] disabled:text-[#817A73]">{isCompleted ? "Lesson 18 selesai" : "Selesaikan Lesson 18"}</button></div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5"><Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398]"><ArrowLeft size={14} /> Daftar pelajaran</Link><span className="text-[10px] font-semibold text-[#817A73]">Dasar 2 · 18 / 18</span></div>
    </main>
  );
}
