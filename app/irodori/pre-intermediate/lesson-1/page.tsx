"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
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
const lessonId = "preintermediate-01";

const favoriteSportsConversation: IrodoriUtterance[] = [
  { speakerId: "yui", japanese: <>休みの日は、何をして過ごしていますか。</>, romaji: "Yasumi no hi wa, nani o shite sugoshite imasu ka?", translation: "Apa yang biasanya kamu lakukan saat hari libur?", audioFileName: "irodori-preintermediate-01-a01-l01.mp3" },
  { speakerId: "sota", japanese: <>最近は、友達とバドミントンの試合を見るのが好きです。</>, romaji: "Saikin wa, tomodachi to badominton no shiai o miru no ga suki desu.", translation: "Belakangan ini saya suka menonton pertandingan bulu tangkis bersama teman.", audioFileName: "irodori-preintermediate-01-a01-l02.mp3" },
  { speakerId: "yui", japanese: <>自分でスポーツをするのも好きですか。</>, romaji: "Jibun de supootsu o suru no mo suki desu ka?", translation: "Apakah kamu juga suka berolahraga sendiri?", audioFileName: "irodori-preintermediate-01-a01-l03.mp3" },
  { speakerId: "sota", japanese: <>運動はあまり得意じゃないんですが、試合を見るとわくわくします。</>, romaji: "Undou wa amari tokui janai n desu ga, shiai o miru to wakuwaku shimasu.", translation: "Saya tidak terlalu mahir berolahraga, tetapi menonton pertandingan membuat saya bersemangat.", audioFileName: "irodori-preintermediate-01-a01-l04.mp3" },
];
const explainFavoriteConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>ソウタさんは、どんなところが好きなんですか。</>, romaji: "Souta-san wa, donna tokoro ga suki na n desu ka?", translation: "Bagian apa yang kamu sukai?", audioFileName: "irodori-preintermediate-01-a02-l01.mp3" },
  { speakerId: "sota", japanese: <>最後まで結果がわからないところです。どちらのチームもよく頑張るので。</>, romaji: "Saigo made kekka ga wakaranai tokoro desu. Dochira no chiimu mo yoku ganbaru node.", translation: "Saya suka karena hasilnya belum bisa diketahui sampai akhir. Kedua tim sama-sama berusaha.", audioFileName: "irodori-preintermediate-01-a02-l02.mp3" },
  { speakerId: "akiko", japanese: <>なるほど。私は、みんなで応援する雰囲気が好きです。</>, romaji: "Naruhodo. Watashi wa, minna de ouen suru funiki ga suki desu.", translation: "Begitu, ya. Saya suka suasana ketika semua orang bersorak bersama.", audioFileName: "irodori-preintermediate-01-a02-l03.mp3" },
  { speakerId: "sota", japanese: <>一緒に見ると、もっと楽しいですよね。</>, romaji: "Issho ni miru to, motto tanoshii desu yo ne.", translation: "Kalau menonton bersama, rasanya lebih menyenangkan, ya.", audioFileName: "irodori-preintermediate-01-a02-l04.mp3" },
];
const inviteToEventConversation: IrodoriUtterance[] = [
  { speakerId: "kenji", japanese: <>来週の日曜日、町のスポーツイベントに行くことになったんです。</>, romaji: "Raishuu no nichiyoubi, machi no supootsu ibento ni iku koto ni natta n desu.", translation: "Minggu depan saya jadi pergi ke acara olahraga di kota.", audioFileName: "irodori-preintermediate-01-a03-l01.mp3" },
  { speakerId: "yui", japanese: <>どこでありますか。</>, romaji: "Doko de arimasu ka?", translation: "Acaranya diadakan di mana?", audioFileName: "irodori-preintermediate-01-a03-l02.mp3" },
  { speakerId: "kenji", japanese: <>中央公園です。いろいろなスポーツを見られるそうですよ。</>, romaji: "Chuuou kouen desu. Iroiro na supootsu o mirareru sou desu yo.", translation: "Di Taman Chuo. Katanya ada berbagai macam olahraga yang bisa ditonton.", audioFileName: "irodori-preintermediate-01-a03-l03.mp3" },
  { speakerId: "yui", japanese: <>おもしろそうですね。よかったら、いっしょに行ってくれませんか。</>, romaji: "Omoshirosou desu ne. Yokattara, issho ni itte kuremasen ka?", translation: "Kedengarannya menarik. Kalau tidak keberatan, mau pergi bersama saya?", audioFileName: "irodori-preintermediate-01-a03-l04.mp3" },
];
const respondToInvitationConversation: IrodoriUtterance[] = [
  { speakerId: "sota", japanese: <>イベントは何時からでしたっけ。</>, romaji: "Ibento wa nanji kara deshita kke?", translation: "Acaranya mulai pukul berapa, ya?", audioFileName: "irodori-preintermediate-01-a04-l01.mp3" },
  { speakerId: "kenji", japanese: <>午後二時からですよ。入口の前で待ち合わせましょう。</>, romaji: "Gogo niji kara desu yo. Iriguchi no mae de machiawasemashou.", translation: "Mulai pukul dua siang. Ayo bertemu di depan pintu masuk.", audioFileName: "irodori-preintermediate-01-a04-l02.mp3" },
  { speakerId: "sota", japanese: <>わかりました。日曜日は、家族と出かけないことになりました。</>, romaji: "Wakarimashita. Nichiyoubi wa, kazoku to dekakenai koto ni narimashita.", translation: "Baik. Hari Minggu saya jadi tidak pergi bersama keluarga.", audioFileName: "irodori-preintermediate-01-a04-l03.mp3" },
  { speakerId: "kenji", japanese: <>それなら、いっしょに行けますね。</>, romaji: "Sore nara, issho ni ikemasu ne.", translation: "Kalau begitu, kita bisa pergi bersama, ya.", audioFileName: "irodori-preintermediate-01-a04-l04.mp3" },
];
const cancelPlansConversation: IrodoriUtterance[] = [
  { speakerId: "akiko", japanese: <>土曜日のイベントですが、行けなくなってしまいました。</>, romaji: "Doyoubi no ibento desu ga, ikenaku natte shimaimashita.", translation: "Tentang acara hari Sabtu, ternyata saya tidak bisa datang.", audioFileName: "irodori-preintermediate-01-a05-l01.mp3" },
  { speakerId: "yui", japanese: <>そうなんですか。何か予定ができたんですか。</>, romaji: "Sou nan desu ka. Nanika yotei ga dekita n desu ka?", translation: "Begitu, ya. Apakah ada rencana lain?", audioFileName: "irodori-preintermediate-01-a05-l02.mp3" },
  { speakerId: "akiko", japanese: <>家族と出かけることになったんです。直前に連絡して、ごめんなさい。</>, romaji: "Kazoku to dekakeru koto ni natta n desu. Chokuzen ni renraku shite, gomen nasai.", translation: "Saya jadi harus pergi bersama keluarga. Maaf baru memberi kabar menjelang acaranya.", audioFileName: "irodori-preintermediate-01-a05-l03.mp3" },
  { speakerId: "yui", japanese: <>わかりました。また都合がいいときに行きましょう。</>, romaji: "Wakarimashita. Mata tsugou ga ii toki ni ikimashou.", translation: "Tidak apa-apa. Ayo pergi lagi saat waktunya cocok.", audioFileName: "irodori-preintermediate-01-a05-l04.mp3" },
];

const canDos = [
  { id: "listen-favorite-sports", source: "CAN-DO 01 · A2", text: "Mendengarkan komentar sederhana teman tentang olahraga yang disukai dan memahami alasan menyukainya serta daya tarik olahraga tersebut." },
  { id: "invite-or-respond-to-event", source: "CAN-DO 02 · A2", text: "Membicarakan detail sebuah acara ketika mengundang teman atau menanggapi undangan." },
  { id: "write-cancellation-message", source: "CAN-DO 03 · A2", text: "Menulis pesan sederhana kepada teman atau rekan untuk membatalkan janji disertai alasannya." },
];

const vocabRows: [string, string, string][] = [
  ["フットサル", "フットサル · futtosaru", "Futsal"],
  ["スポーツ", "スポーツ · supootsu", "Olahraga"],
  ["野球", "やきゅう · yakyuu", "Bisbol"],
  ["相撲", "すもう · sumou", "Sumo"],
  ["登山", "とざん · tozan", "Mendaki gunung"],
  ["サッカー", "サッカー · sakkaa", "Sepak bola"],
  ["運動", "うんどう · undou", "Olahraga atau aktivitas fisik"],
  ["試合", "しあい · shiai", "Pertandingan"],
  ["チーム", "チーム · chiimu", "Tim"],
  ["選手", "せんしゅ · senshu", "Atlet atau pemain"],
  ["応援", "おうえん · ouen", "Dukungan atau sorakan"],
  ["観客", "かんきゃく · kankyaku", "Penonton"],
  ["得意（な）", "とくい（な） · tokui (na)", "Mahir atau unggul"],
  ["苦手（な）", "にがて（な） · nigate (na)", "Kurang mahir atau tidak terlalu suka"],
  ["伝統的（な）", "でんとうてき（な） · dentouteki (na)", "Tradisional"],
  ["強い", "つよい · tsuyoi", "Kuat"],
  ["弱い", "よわい · yowai", "Lemah"],
  ["勝つ", "かつ · katsu", "Menang"],
  ["負ける", "まける · makeru", "Kalah"],
  ["競争", "きょうそう · kyousou", "Persaingan"],
  ["ルール", "ルール · ruuru", "Aturan"],
  ["コート", "コート · kooto", "Lapangan"],
  ["人数", "にんずう · ninzuu", "Jumlah orang"],
  ["ペース", "ペース · peesu", "Kecepatan atau tempo"],
  ["気軽（な）", "きがる（な） · kigaru (na)", "Santai atau tanpa beban"],
  ["健康", "けんこう · kenkou", "Kesehatan"],
  ["景色", "けしき · keshiki", "Pemandangan"],
  ["山頂", "さんちょう · sanchou", "Puncak gunung"],
  ["興奮する", "こうふんする · koufun suru", "Merasa bersemangat"],
  ["約束", "やくそく · yakusoku", "Janji"],
  ["誘う", "さそう · sasou", "Mengajak"],
  ["誘われる", "さそわれる · sasowareru", "Diajak"],
  ["イベント", "イベント · ibento", "Acara"],
  ["お祭り", "おまつり · omatsuri", "Festival"],
  ["公園", "こうえん · kouen", "Taman"],
  ["開催する", "かいさいする · kaisai suru", "Menyelenggarakan"],
  ["参加する", "さんかする · sanka suru", "Berpartisipasi"],
  ["見に行く", "みにいく · mi ni iku", "Pergi untuk menonton"],
  ["予定", "よてい · yotei", "Rencana atau jadwal"],
  ["決まる", "きまる · kimaru", "Diputuskan atau ditetapkan"],
  ["ことになる", "ことになる · koto ni naru", "Menjadi keputusan atau ketetapan"],
  ["座る", "すわる · suwaru", "Duduk"],
  ["落語", "らくご · rakugo", "Rakugo (seni bercerita tradisional)"],
  ["演劇", "えんげき · engeki", "Drama atau teater"],
  ["舞踊", "ぶよう · buyou", "Tari atau seni tari"],
  ["連絡する", "れんらくする · renraku suru", "Menghubungi atau memberi kabar"],
  ["都合", "つごう · tsugou", "Kecocokan waktu atau keadaan"],
  ["残念（な）", "ざんねん（な） · zannen (na)", "Disayangkan atau mengecewakan"],
  ["キャンセルする", "キャンセルする · kyanseru suru", "Membatalkan"],
  ["理由", "りゆう · riyuu", "Alasan"],
];

const kanjiWords = [
  ["野球", "やきゅう · yakyuu", "Bisbol"],
  ["応援", "おうえん · ouen", "Dukungan atau sorakan"],
  ["約束", "やくそく · yakusoku", "Janji"],
  ["得意（な）", "とくい（な） · tokui (na)", "Mahir atau unggul"],
  ["伝統的（な）", "でんとうてき（な） · dentouteki (na)", "Tradisional"],
  ["弱い", "よわい · yowai", "Lemah"],
  ["勝つ", "かつ · katsu", "Menang"],
  ["負ける", "まける · makeru", "Kalah"],
  ["誘う", "さそう · sasou", "Mengajak"],
  ["座る", "すわる · suwaru", "Duduk"],
];

const grammarNotes = [
  { title: "01 · Memastikan kembali informasi yang samar diingat", pattern: "N でしたっけ？／S（普通形）んでしたっけ？", example: <>フットサルって、何でしたっけ？<br />イベントは、日曜日でしたっけ？</>, note: "Gunakan pola ini ketika kamu pernah mendengar atau mengetahui sesuatu, tetapi ingin memastikan kembali karena ingatannya belum jelas. Berbeda dari 何ですか yang menanyakan sesuatu yang belum diketahui, 何でしたっけ？ menunjukkan bahwa kamu sedang mencoba mengingat. Kata って dapat digunakan untuk mengangkat topik sebelum bertanya." },
  { title: "02 · Menyampaikan rencana yang sudah diputuskan", pattern: "V-ることになりました／V-ないことになりました", example: <>来月、学校のイベントに参加することになりました。<br />雨のため、試合は行わないことになりました。</>, note: "Pola ini menyampaikan keputusan atau rencana yang sudah ditetapkan melalui keadaan, pembicaraan, atau keputusan bersama. Tidak selalu berarti pembicara sendiri yang memutuskan. Bentuk negatif V-ないことになりました menyatakan bahwa sesuatu diputuskan untuk tidak dilakukan." },
  { title: "03 · Meminta seseorang melakukan sesuatu dengan sopan", pattern: "V-てくれませんか？", example: <>よかったら、いっしょに見に来てくれませんか？<br />イベントの時間を教えてくれませんか？</>, note: "Gunakan pola ini untuk meminta bantuan atau mengajak seseorang melakukan sesuatu yang diharapkan pembicara. Dalam lesson ini, pola digunakan untuk mengundang teman ke acara. Dalam percakapan santai antarteman, bentuk V-てくれない？ juga dapat digunakan." },
];

type Task = { prompt: ReactNode; options: { key: string; label: ReactNode }[]; answer: string; explanation: ReactNode; };
type Simulation = { title: string; heading: string; prompt: string; japanese: ReactNode; translation: string; options: { key: string; label: string; meaning: string }[]; answer: string; explanation: string; };

const simulations: Simulation[] = [
  { title: "01 · Memahami alasan menyukai olahraga", heading: "Menangkap alasan dari komentar teman", prompt: "Seorang teman berkata bahwa ia menyukai mendaki karena bisa menikmati pemandangan dari atas gunung. Apa alasan utamanya?", japanese: <>山に登ると、きれいな景色が見られるので、登山が好きです。</>, translation: "Saya suka mendaki karena bisa melihat pemandangan yang indah.", options: [
    { key: "a", label: "Ia menyukai pemandangan yang dapat dilihat saat mendaki.", meaning: "景色が見られるので menyatakan alasan menyukai kegiatan tersebut." },
    { key: "b", label: "Ia ingin mengikuti pertandingan sepak bola.", meaning: "Tidak ada informasi tentang sepak bola atau pertandingan." },
    { key: "c", label: "Ia tidak suka pergi ke luar rumah.", meaning: "Kalimat justru menjelaskan alasan ia menyukai mendaki." },
  ], answer: "a", explanation: "Cari alasan yang dihubungkan dengan ので: bisa menikmati pemandangan." },
  { title: "02 · Memastikan kembali detail acara", heading: "Menggunakan でしたっけ？", prompt: "Kamu pernah mendengar jadwal acara, tetapi lupa hari pelaksanaannya. Ungkapan mana yang tepat?", japanese: <>イベントは、土曜日でしたっけ？</>, translation: "Acaranya hari Sabtu, ya?", options: [
    { key: "a", label: "イベントは、土曜日ですか？", meaning: "Ini pertanyaan biasa; tidak secara khusus menandakan sedang mencoba mengingat informasi." },
    { key: "b", label: "イベントは、土曜日でしたっけ？", meaning: "でしたっけ？ dipakai untuk memastikan kembali hal yang pernah didengar atau diketahui." },
    { key: "c", label: "イベントは、土曜日になりました。", meaning: "Kalimat ini menyatakan bahwa acara ditetapkan menjadi hari Sabtu." },
  ], answer: "b", explanation: "でしたっけ？ cocok untuk mengonfirmasi kembali informasi yang samar diingat." },
  { title: "03 · Mengundang teman ke acara", heading: "Meminta seseorang datang bersama", prompt: "Kamu ingin mengundang teman datang menonton acara. Pilih ungkapan yang sopan dan sesuai.", japanese: <>よかったら、いっしょに見に来てくれませんか？</>, translation: "Kalau tidak keberatan, mau datang menonton bersama saya?", options: [
    { key: "a", label: "いっしょに見に来てくれませんか？", meaning: "V-てくれませんか？ digunakan untuk meminta seseorang melakukan sesuatu atau mengundangnya." },
    { key: "b", label: "いっしょに見に来ることになりました。", meaning: "Ini menyampaikan keputusan, bukan mengundang atau meminta." },
    { key: "c", label: "いっしょに見に来ましたっけ？", meaning: "Bentuk ini tidak tepat untuk membuat undangan." },
  ], answer: "a", explanation: "V-てくれませんか？ adalah ungkapan permintaan yang dapat digunakan untuk mengundang." },
  { title: "04 · Menjelaskan keputusan yang sudah ditetapkan", heading: "Membedakan keputusan dan niat pribadi", prompt: "Sekolah sudah menetapkan bahwa klub akan tampil pada festival. Kalimat mana yang sesuai?", japanese: <>クラブは、フェスティバルで発表することになりました。</>, translation: "Klub ditetapkan akan tampil di festival.", options: [
    { key: "a", label: "クラブは、フェスティバルで発表したいです。", meaning: "たいです menyatakan keinginan pribadi, bukan keputusan yang telah ditetapkan." },
    { key: "b", label: "クラブは、フェスティバルで発表することになりました。", meaning: "V-ることになりました menyatakan keputusan atau rencana yang sudah ditetapkan." },
    { key: "c", label: "クラブは、フェスティバルで発表してください。", meaning: "ください adalah permintaan atau instruksi, bukan laporan keputusan." },
  ], answer: "b", explanation: "Pola ことになりました cocok untuk keputusan yang muncul dari penetapan atau pembicaraan." },
  { title: "05 · Membatalkan janji dengan sopan", heading: "Menulis pesan pembatalan", prompt: "Kamu tidak bisa datang karena ada urusan keluarga. Pesan mana yang paling sesuai untuk dikirim kepada teman?", japanese: <>ごめんなさい。家族の予定ができて、明日のイベントに行けなくなりました。また今度誘ってください。</>, translation: "Maaf. Ada rencana keluarga, jadi saya tidak bisa datang ke acara besok. Ajak saya lagi lain kali, ya.", options: [
    { key: "a", label: "Pesan singkat yang meminta teman menunggu tanpa menjelaskan apa pun.", meaning: "Pesan pembatalan sebaiknya menyebutkan bahwa kamu tidak bisa datang dan memberi alasan sederhana." },
    { key: "b", label: "Pesan yang menjelaskan tidak bisa datang, memberi alasan, meminta maaf, dan mengusulkan kesempatan lain.", meaning: "Struktur ini jelas, sopan, dan sesuai dengan tujuan membatalkan janji." },
    { key: "c", label: "Pesan yang hanya membahas acara lain.", meaning: "Isi tersebut tidak menyampaikan pembatalan janji yang sedang dibicarakan." },
  ], answer: "b", explanation: "Pesan pembatalan yang baik menyampaikan inti, alasan, permintaan maaf, dan bila perlu ajakan untuk kesempatan berikutnya." },
];

const practiceTasks: Task[] = [
  { prompt: <>Pola 「Nでしたっけ？」 paling tepat digunakan ketika ...</>, options: [{ key: "a", label: "Memastikan kembali sesuatu yang pernah diketahui." }, { key: "b", label: "Memperkenalkan sesuatu yang sama sekali baru." }, { key: "c", label: "Memberi perintah." }], answer: "a", explanation: <>でしたっけ？ digunakan ketika ingin mengonfirmasi kembali informasi yang samar diingat.</> },
  { prompt: <>Lengkapi: 「来週、発表する＿＿＿＿なりました。」</>, options: [{ key: "a", label: "ことに" }, { key: "b", label: "ために" }, { key: "c", label: "ように" }], answer: "a", explanation: <>Bentuk yang tepat adalah V-ることになりました.</> },
  { prompt: <>Manakah bentuk yang benar untuk meminta teman datang menonton?</>, options: [{ key: "a", label: "見に来てくれませんか？" }, { key: "b", label: "見に来るでしたっけ？" }, { key: "c", label: "見に来ることなりました？" }], answer: "a", explanation: <>V-てくれませんか？ digunakan untuk membuat permintaan atau undangan.</> },
  { prompt: <>Apa arti 「得意（な）」?</>, options: [{ key: "a", label: "Mahir atau unggul." }, { key: "b", label: "Lemah." }, { key: "c", label: "Membatalkan." }], answer: "a", explanation: <>得意（な） berarti mahir atau memiliki kelebihan dalam sesuatu.</> },
  { prompt: <>Apa arti 「誘う」?</>, options: [{ key: "a", label: "Mengajak." }, { key: "b", label: "Duduk." }, { key: "c", label: "Kalah." }], answer: "a", explanation: <>誘う berarti mengajak seseorang untuk melakukan sesuatu atau menghadiri acara.</> },
  { prompt: <>Kalimat 「雨のため、イベントを行わないことになりました」 berarti ...</>, options: [{ key: "a", label: "Diputuskan bahwa acara tidak akan diadakan karena hujan." }, { key: "b", label: "Pembicara ingin mengadakan acara saat hujan." }, { key: "c", label: "Acara sudah selesai dan berjalan lancar." }], answer: "a", explanation: <>V-ないことになりました menyatakan keputusan untuk tidak melakukan sesuatu.</> },
];

const quizQuestions: Task[] = [
  { prompt: <>Apa arti 「野球」?</>, options: [{ key: "a", label: "Bisbol." }, { key: "b", label: "Sumo." }, { key: "c", label: "Mendaki gunung." }], answer: "a", explanation: <>野球（やきゅう） berarti bisbol.</> },
  { prompt: <>Apa arti 「応援」?</>, options: [{ key: "a", label: "Dukungan atau sorakan." }, { key: "b", label: "Pemandangan." }, { key: "c", label: "Peraturan." }], answer: "a", explanation: <>応援（おうえん） berarti mendukung atau memberi semangat.</> },
  { prompt: <>Apa makna 「伝統的（な）」?</>, options: [{ key: "a", label: "Tradisional." }, { key: "b", label: "Modern." }, { key: "c", label: "Pribadi." }], answer: "a", explanation: <>伝統的（な） berarti bersifat tradisional.</> },
  { prompt: <>Apa arti 「負ける」?</>, options: [{ key: "a", label: "Kalah." }, { key: "b", label: "Menang." }, { key: "c", label: "Mengajak." }], answer: "a", explanation: <>負ける berarti kalah.</> },
  { prompt: <>Apa fungsi 「Nでしたっけ？」?</>, options: [{ key: "a", label: "Memastikan kembali informasi." }, { key: "b", label: "Menyatakan kemampuan." }, { key: "c", label: "Mengungkapkan larangan." }], answer: "a", explanation: <>Ungkapan ini membantu memastikan kembali hal yang pernah diketahui.</> },
  { prompt: <>Pola 「V-ることになりました」 menyampaikan ...</>, options: [{ key: "a", label: "Rencana atau keputusan yang sudah ditetapkan." }, { key: "b", label: "Perintah kepada orang lain." }, { key: "c", label: "Keinginan yang belum diputuskan." }], answer: "a", explanation: <>Pola ini melaporkan keputusan atau rencana yang ditetapkan melalui keadaan atau pembicaraan.</> },
  { prompt: <>Apa fungsi 「V-てくれませんか？」?</>, options: [{ key: "a", label: "Meminta seseorang melakukan sesuatu atau mengundangnya." }, { key: "b", label: "Melaporkan sesuatu yang sudah terjadi." }, { key: "c", label: "Menyatakan sesuatu yang dilarang." }], answer: "a", explanation: <>Pola ini merupakan ungkapan permintaan yang sopan.</> },
  { prompt: <>Apa arti 「約束」?</>, options: [{ key: "a", label: "Janji." }, { key: "b", label: "Pertandingan." }, { key: "c", label: "Taman." }], answer: "a", explanation: <>約束（やくそく） berarti janji atau kesepakatan.</> },
  { prompt: <>Apa arti 「座る」?</>, options: [{ key: "a", label: "Duduk." }, { key: "b", label: "Berlari." }, { key: "c", label: "Membatalkan." }], answer: "a", explanation: <>座る（すわる） berarti duduk.</> },
  { prompt: <>Informasi apa yang baik dicantumkan dalam pesan pembatalan?</>, options: [{ key: "a", label: "Tidak bisa hadir, alasan singkat, dan permintaan maaf." }, { key: "b", label: "Hanya mengirim tanda baca." }, { key: "c", label: "Membagikan informasi pribadi orang lain." }], answer: "a", explanation: <>Pesan yang jelas membantu penerima memahami bahwa rencana berubah dan alasannya.</> },
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

export default function IrodoriPreIntermediateLessonOnePage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [cancelDraft, setCancelDraft] = useState("");

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
      <Link href="/irodori/pre-intermediate" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] hover:border-[#B79ADE]/40">
        <ArrowLeft size={15} /> Kembali ke Pra-Menengah
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#80619B]/40 bg-gradient-to-br from-[#392B4D] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D9C2F4]/[0.08]">球</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#C8A9EA]">IRODORI • PRA-MENENGAH A2/B1 • PELAJARAN 01</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Futsal itu apa, ya?</h1>
          <p className="mt-2 text-sm font-semibold text-[#C8A9EA]">フットサルって、何でしたっけ？</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Mendengarkan cerita tentang olahraga favorit, bertukar informasi tentang acara, mengundang teman, dan menulis pesan singkat untuk membatalkan rencana.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] text-[#D6C9E6]">Olahraga favorit</span>
            <span className="rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] text-[#D6C9E6]">Undangan acara</span>
            <span className="rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] text-[#D6C9E6]">Pesan pembatalan</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#80619B]/25 bg-[#2A2333]/70 p-4 md:p-5">
        <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Lesson ini memiliki tiga target komunikasi resmi: mendengarkan komentar olahraga, mengundang atau merespons undangan, dan menulis pesan pembatalan. <span className="text-[#C8A9EA]">Kode target komunikasi: 01–03.</span></p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item) => <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#C8A9EA]">{item.source}</p><p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p></article>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Hobi, undangan, dan rencana</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua percakapan berikut ditulis orisinal untuk Fude, berdasarkan fungsi komunikasi lesson ini.</p></div>
        <div className="space-y-4">
          <IrodoriConversation title="Membicarakan olahraga favorit" speakers={[friendYui, friendSota]} utterances={favoriteSportsConversation} />
          <IrodoriConversation title="Menjelaskan hal yang disukai" speakers={[friendAkiko, friendSota]} utterances={explainFavoriteConversation} />
          <IrodoriConversation title="Mengundang teman ke acara" speakers={[friendKenji, friendYui]} utterances={inviteToEventConversation} />
          <IrodoriConversation title="Menanggapi undangan dan memastikan waktu" speakers={[friendSota, friendKenji]} utterances={respondToInvitationConversation} />
          <IrodoriConversation title="Membatalkan rencana dengan sopan" speakers={[friendAkiko, friendYui]} utterances={cancelPlansConversation} />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#80619B]/25 bg-[#2A2333]/55 p-4 md:p-5">
        <div className="flex items-center gap-2"><Sparkles size={16} className="text-[#C8A9EA]" /><h2 className="text-sm font-bold text-[#EAE6DD]">Contoh percakapan tambahan</h2></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#C8A9EA]">MEMASTIKAN KEMBALI</p><JapaneseReading allowIndexFallback translation="A: Futsal itu apa, ya? B: Olahraga yang mirip sepak bola dan bisa dimainkan di dalam ruangan." contentClassName="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm leading-relaxed text-[#C8A9EA]" romajiClassName="mt-1 text-xs italic text-[#A9A398]" translationClassName="mt-1 text-[10px] leading-5 text-[#A9A398]">A：フットサルって、何でしたっけ？ B：室内でもできる、サッカーに似たスポーツですよ。</JapaneseReading></article>
          <article className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#C8A9EA]">MENJELASKAN RENCANA</p><JapaneseReading allowIndexFallback translation="Bulan depan saya jadi pergi menonton pertandingan bersama teman." contentClassName="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm leading-relaxed text-[#C8A9EA]" romajiClassName="mt-1 text-xs italic text-[#A9A398]" translationClassName="mt-1 text-[10px] leading-5 text-[#A9A398]">来月、友達と試合を見に行くことになりました。</JapaneseReading></article>
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">KOSAKATA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima puluh kosakata pilihan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kosakata tentang olahraga, aktivitas, acara, undangan, dan perubahan rencana.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm leading-relaxed text-[#C8A9EA]" romajiClassName="mt-1 text-xs italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">KANJI UTAMA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sepuluh kata kanji resmi</h2></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => <article key={jp} className="rounded-xl border border-[#80619B]/25 bg-[#2A2333]/55 p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#C8A9EA]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">POLA TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tiga pola untuk memastikan, menetapkan, dan mengundang</h2></div>
        {grammarNotes.map((item) => <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#C8A9EA]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p><p className="mt-2 font-mincho text-base leading-8 text-[#D6C2EC]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>)}
      </section>

      <section className="space-y-4 rounded-2xl border border-[#80619B]/25 bg-[#2A2333]/60 p-4 md:p-5">
        <div className="flex items-center gap-2"><FileText size={16} className="text-[#C8A9EA]" /><h2 className="text-sm font-bold text-[#EAE6DD]">Latihan menulis pesan pembatalan</h2></div>
        <p className="text-xs leading-6 text-[#A9A398]">Bayangkan kamu tidak bisa menghadiri acara bersama teman. Tulis pesan singkat yang menyebutkan acara, alasan sederhana, permintaan maaf, dan bila perlu ajakan untuk bertemu lain kali. Gunakan nama samaran dan jangan masukkan informasi pribadi.</p>
        <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#C8A9EA]">CONTOH ORISINAL FUDE</p><JapaneseReading allowIndexFallback translation="Maaf. Tentang acara besok, saya jadi harus pergi bersama keluarga sehingga tidak bisa datang. Ayo pergi bersama lain kali." contentClassName="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm leading-relaxed text-[#C8A9EA]" romajiClassName="mt-1 text-xs italic text-[#A9A398]" translationClassName="mt-2 text-[10px] leading-5 text-[#A9A398]">ごめんなさい。明日のイベントですが、家族と出かけることになって、行けなくなりました。また今度、いっしょに行きましょう。</JapaneseReading></div>
        <label htmlFor="cancel-plans-draft" className="block text-xs font-semibold text-[#C8A9EA]">Tulis pesanmu dalam bahasa Jepang</label>
        <textarea id="cancel-plans-draft" value={cancelDraft} onChange={(event) => setCancelDraft(event.target.value)} rows={5} placeholder="ごめんなさい。明日のイベントですが、..." className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none placeholder:text-[#746F65] focus:border-[#C8A9EA]/50" />
        <div className="flex items-center justify-between gap-3"><p className="text-[10px] text-[#817A73]">Draf hanya digunakan untuk latihan di halaman ini.</p><span className="text-[10px] tabular-nums text-[#C8A9EA]">{cancelDraft.length} karakter</span></div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">SIMULASI SITUASI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan bahasa Jepang dalam konteks</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan kelima situasi dengan memilih jawaban yang paling sesuai. Semua simulasi harus benar untuk membuka evaluasi.</p></div>
        {simulations.map((task, index) => {
          const selected = simulationChoices[index];
          const checked = Boolean(simulationChecked[index]);
          const isCorrect = checked && selected === task.answer;
          const isWrong = checked && selected !== task.answer;
          return <article key={task.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#C8A9EA]">{task.title}</p><h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p>
            <div className="mt-3 rounded-xl border border-[#80619B]/25 bg-[#2A2333]/60 p-3"><p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{task.japanese}</JapaneseReading></p><p className="mt-1 text-xs text-[#A9A398]">{task.translation}</p></div>
            <div className="mt-3 grid gap-2">{task.options.map((option) => <button key={option.key} type="button" disabled={isCorrect} aria-pressed={selected === option.key} onClick={() => { setSimulationChoices((current) => ({ ...current, [index]: option.key })); setSimulationChecked((current) => ({ ...current, [index]: false })); }} className={"rounded-lg border px-3 py-2.5 text-left text-xs " + (isCorrect && option.key === task.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : selected === option.key ? "border-[#C8A9EA]/60 bg-[#80619B]/20 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>
            {(isCorrect || isWrong) && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>{isCorrect ? task.explanation : "Tinjau kembali situasinya, lalu coba pilih lagi."}</p>}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-[10px] text-[#817A73]">{isCorrect ? "Situasi selesai" : "Pilih jawaban lalu periksa"}</p><button type="button" disabled={!selected || isCorrect} onClick={() => setSimulationChecked((current) => ({ ...current, [index]: true }))} className="rounded-lg bg-[#80619B] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">{isCorrect ? "Selesai" : "Periksa"}</button></div>
            {checked && isWrong && <p className="mt-2 text-[10px] text-[#E7A1A1]">{task.options.find((option) => option.key === task.answer)?.meaning}</p>}
          </article>;
        })}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-xs text-[#A9A398]">Simulasi benar: {simulationScore} dari {simulations.length}.</p><button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#80619B]/40 px-4 py-2 text-xs font-bold text-[#C8A9EA]"><RefreshCw size={13} /> Ulangi simulasi</button></div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p></div>
        <div className="space-y-3">{practiceTasks.map((task, index) => { const selected = practiceAnswers[index]; const isCorrect = selected === task.answer; return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#C8A9EA]">LATIHAN {String(index + 1).padStart(2, "0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{task.options.map((option) => <button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected === option.key} onClick={() => setPracticeAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs " + (practiceSubmitted && option.key === task.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : practiceSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#C8A9EA]/60 bg-[#80619B]/20 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{practiceSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span><JapaneseReading allowIndexFallback>{task.explanation}</JapaneseReading></p>}</article>; })}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{practiceSubmitted ? "Hasil praktik: " + practiceScore + " dari " + practiceTasks.length + " benar." : Object.keys(practiceAnswers).length + " dari " + practiceTasks.length + " pertanyaan dijawab."}</p>{practiceSubmitted ? <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#80619B]/40 px-4 py-2 text-xs font-bold text-[#C8A9EA]"><RefreshCw size={13} /> Ulangi praktik</button> : <button type="button" onClick={() => setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length !== practiceTasks.length} className="rounded-lg bg-[#80619B] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D]">Periksa praktik</button>}</div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">KUIS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2></div>
        <div className="space-y-3">{quizQuestions.map((question, index) => { const selected = answers[index]; const isCorrect = selected === question.answer; return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#C8A9EA]">SOAL {String(index + 1).padStart(2, "0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{question.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{question.options.map((option) => <button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected === option.key} onClick={() => setAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs " + (quizSubmitted && option.key === question.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : quizSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#C8A9EA]/60 bg-[#80619B]/20 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{quizSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span><JapaneseReading allowIndexFallback>{question.explanation}</JapaneseReading></p>}</article>; })}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{quizSubmitted ? "Nilai kuis: " + quizScore + " dari " + quizQuestions.length + " benar." : Object.keys(answers).length + " dari " + quizQuestions.length + " pertanyaan dijawab."}</p>{quizSubmitted ? <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#80619B]/40 px-4 py-2 text-xs font-bold text-[#C8A9EA]"><RefreshCw size={13} /> Ulangi kuis</button> : <button type="button" onClick={() => setQuizSubmitted(true)} disabled={Object.keys(answers).length !== quizQuestions.length} className="rounded-lg bg-[#80619B] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D]">Periksa kuis</button>}</div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#80619B]/25 bg-[#2A2333]/65 p-4 md:p-5">
        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#C8A9EA]" /><h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi target komunikasi</h2></div>
        <p className="text-xs leading-6 text-[#A9A398]">Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan.</p>
        <div className="space-y-3">{canDos.map((item) => <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#C8A9EA]">{item.source}</p><p className="mt-1 text-xs leading-5 text-[#EAE6DD]">{item.text}</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{ratingOptions.map((option) => <button key={option.value} type="button" disabled={!canEvaluate} aria-pressed={visibleRatings[item.id] === option.value} onClick={() => { const nextRatings = { ...visibleRatings, [item.id]: option.value }; setRatings(nextRatings); saveIrodoriSelfEvaluation(lessonId, nextRatings); }} className={"rounded-lg border px-3 py-2 text-left text-[10px] font-semibold disabled:opacity-40 " + (visibleRatings[item.id] === option.value ? "border-[#C8A9EA]/50 bg-[#80619B]/25 text-[#F5ECFF]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div></article>)}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4"><p className="text-xs text-[#A9A398]">{isCompleted ? "Lesson 1 selesai. Progres tersimpan." : canDosRated ? "Semua target target komunikasi sudah dinilai." : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}</p><button type="button" onClick={finishLesson} disabled={!canComplete || isCompleted} className="rounded-xl bg-[#80619B] px-5 py-2.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">{isCompleted ? "Lesson 1 selesai" : "Selesaikan Lesson 1"}</button></div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5"><Link href="/irodori/pre-intermediate" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398]"><ArrowLeft size={14} /> Daftar pelajaran</Link><span className="text-[10px] font-semibold text-[#817A73]">Pra-Menengah · 1 / 18</span></div>
    </main>
  );
}
