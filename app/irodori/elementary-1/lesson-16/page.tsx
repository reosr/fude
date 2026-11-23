"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { Activity, ArrowLeft, CalendarDays, CheckCircle2, Clock3, FileText, RefreshCw } from "lucide-react";
import IrodoriConversation, { type IrodoriUtterance } from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import JapaneseReading from "@/components/JapaneseReading";
import { formatGrammarNotation } from "@/lib/japanese-text";
import { completeIrodoriLesson, saveIrodoriSelfEvaluation, useIrodoriProgress } from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const speakers = IRODORI_SPEAKERS;
const friendYui = { ...speakers.yui, name: "Yui", role: "Teman" };
const friendSota = { ...speakers.sota, name: "Sota", role: "Teman" };
const friendAkiko = { ...speakers.akiko, name: "Akiko", role: "Teman" };
const friendKenji = { ...speakers.kenji, name: "Kenji", role: "Teman" };
const newsHost = { ...speakers.akiko, name: "Penyiar", role: "Pembaca berita" };
const newsGuest = { ...speakers.kenji, name: "Pendengar", role: "Pendengar berita" };
const lessonId = "elementary1-16";

const feelingUnwellConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>ユイさん、どうしたんですか。大丈夫ですか。</>,romaji:"Yui-san, dou shita n desu ka? Daijoubu desu ka?",translation:"Yui, ada apa? Kamu baik-baik saja?",audioFileName:"irodori-elementary1-16-a01-l01.mp3"},
{speakerId:"yui",japanese:<>最近よく眠れなくて、体がだるいんです。</>,romaji:"Saikin yoku nemurenakute, karada ga darui n desu.",translation:"Akhir-akhir ini saya sulit tidur dan badan terasa lemas.",audioFileName:"irodori-elementary1-16-a01-l02.mp3"},
{speakerId:"sota",japanese:<>そうですか。それはいけませんね。今日は早く休むといいですよ。</>,romaji:"Sou desu ka. Sore wa ikemasen ne. Kyou wa hayaku yasumu to ii desu yo.",translation:"Begitu, ya. Itu pasti tidak nyaman. Sebaiknya hari ini beristirahat lebih awal.",audioFileName:"irodori-elementary1-16-a01-l03.mp3"},
{speakerId:"yui",japanese:<>ありがとうございます。そうしてみます。</>,romaji:"Arigatou gozaimasu. Sou shite mimasu.",translation:"Terima kasih. Saya akan mencobanya.",audioFileName:"irodori-elementary1-16-a01-l04.mp3"},
];

const tiredEyesConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>ソウタさん、目が疲れているんですか。</>,romaji:"Souta-san, me ga tsukarete iru n desu ka?",translation:"Sota, apakah matamu terasa lelah?",audioFileName:"irodori-elementary1-16-a02-l01.mp3"},
{speakerId:"sota",japanese:<>はい。長い時間、画面を見すぎたんです。</>,romaji:"Hai. Nagai jikan, gamen o misugita n desu.",translation:"Ya. Saya terlalu lama melihat layar.",audioFileName:"irodori-elementary1-16-a02-l02.mp3"},
{speakerId:"akiko",japanese:<>ときどき画面から目を離すといいですよ。</>,romaji:"Tokidoki gamen kara me o hanasu to ii desu yo.",translation:"Sebaiknya sesekali alihkan pandangan dari layar.",audioFileName:"irodori-elementary1-16-a02-l03.mp3"},
{speakerId:"sota",japanese:<>そうですね。少し休憩します。</>,romaji:"Sou desu ne. Sukoshi kyuukei shimasu.",translation:"Benar juga. Saya akan beristirahat sebentar.",audioFileName:"irodori-elementary1-16-a02-l04.mp3"},
];

const exerciseHabitsConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>ユイさん、最近何か運動していますか。</>,romaji:"Yui-san, saikin nanika undou shite imasu ka?",translation:"Yui, akhir-akhir ini apakah kamu berolahraga?",audioFileName:"irodori-elementary1-16-a03-l01.mp3"},
{speakerId:"yui",japanese:<>友達と歩いたり、家でストレッチしたりしています。</>,romaji:"Tomodachi to aruitari, ie de sutoretchi shitari shite imasu.",translation:"Saya berjalan kaki bersama teman atau melakukan peregangan di rumah.",audioFileName:"irodori-elementary1-16-a03-l02.mp3"},
{speakerId:"akiko",japanese:<>いいですね。ほかに気をつけていることはありますか。</>,romaji:"Ii desu ne. Hoka ni ki o tsukete iru koto wa arimasu ka?",translation:"Bagus, ya. Apakah ada hal lain yang kamu perhatikan?",audioFileName:"irodori-elementary1-16-a03-l03.mp3"},
{speakerId:"yui",japanese:<>夜はできるだけ早く寝るようにしています。</>,romaji:"Yoru wa dekiru dake hayaku neru you ni shite imasu.",translation:"Pada malam hari, saya berusaha tidur lebih awal sebisa mungkin.",audioFileName:"irodori-elementary1-16-a03-l04.mp3"},
];

const balancedMealsConversation: IrodoriUtterance[] = [
{speakerId:"kenji",japanese:<>健康のために、何か気をつけていますか。</>,romaji:"Kenkou no tame ni, nanika ki o tsukete imasu ka?",translation:"Apakah ada hal yang kamu perhatikan demi kesehatan?",audioFileName:"irodori-elementary1-16-a04-l01.mp3"},
{speakerId:"sota",japanese:<>はい。朝ごはんを食べるようにしています。</>,romaji:"Hai. Asagohan o taberu you ni shite imasu.",translation:"Ya. Saya berusaha sarapan.",audioFileName:"irodori-elementary1-16-a04-l02.mp3"},
{speakerId:"kenji",japanese:<>ほかには？</>,romaji:"Hoka ni wa?",translation:"Selain itu?",audioFileName:"irodori-elementary1-16-a04-l03.mp3"},
{speakerId:"sota",japanese:<>野菜も食べます。食べすぎないようにしていますが、食事は抜かないようにしています。</>,romaji:"Yasai mo tabemasu. Tabesuginai you ni shite imasu ga, shokuji wa nukanai you ni shite imasu.",translation:"Saya juga makan sayuran. Saya berusaha tidak makan berlebihan, tetapi tetap tidak melewatkan waktu makan.",audioFileName:"irodori-elementary1-16-a04-l04.mp3"},
];

const healthNewsConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>次は、かぜの予防についてです。</>,romaji:"Tsugi wa, kaze no yobou ni tsuite desu.",translation:"Berikutnya, tentang pencegahan pilek.",audioFileName:"irodori-elementary1-16-a05-l01.mp3"},
{speakerId:"kenji",japanese:<>最近、学校でかぜの人が増えています。</>,romaji:"Saikin, gakkou de kaze no hito ga fuete imasu.",translation:"Akhir-akhir ini, jumlah orang yang pilek di sekolah bertambah.",audioFileName:"irodori-elementary1-16-a05-l02.mp3"},
{speakerId:"akiko",japanese:<>せきやくしゃみが出るときは、せきエチケットを守りましょう。</>,romaji:"Seki ya kushami ga deru toki wa, seki echiketto o mamorimashou.",translation:"Saat batuk atau bersin, mari ikuti etika batuk dan bersin.",audioFileName:"irodori-elementary1-16-a05-l03.mp3"},
{speakerId:"kenji",japanese:<>手をよく洗って、部屋の空気を入れかえることも大切です。</>,romaji:"Te o yoku aratte, heya no kuuki o irekaeru koto mo taisetsu desu.",translation:"Mencuci tangan dengan baik dan mengganti udara di ruangan juga penting.",audioFileName:"irodori-elementary1-16-a05-l04.mp3"},
];

const canDos=[
{id:"give-and-understand-simple-advice",source:"CAN-DO 57",text:"Memberi saran sederhana kepada seseorang yang merasa kurang sehat, atau mendengarkan dan memahami sarannya."},
{id:"talk-about-health-habits",source:"CAN-DO 58",text:"Menceritakan kebiasaan yang dilakukan untuk menjaga kesehatan sehari-hari."},
{id:"understand-health-news",source:"CAN-DO 59",text:"Memahami gambaran umum berita sederhana tentang penyakit yang sedang menyebar, termasuk nama, gejala, dan pencegahannya."},
{id:"understand-health-poster",source:"CAN-DO 60",text:"Membaca poster kesehatan dan menemukan informasi tentang gejala serta cara pencegahan."},
{id:"describe-balanced-routine",source:"LATIHAN Fude",text:"Menyebutkan beberapa kebiasaan secara runtut dan menjelaskan hal yang sedang diusahakan."},
];

const vocabRows=[
["体","からだ · karada","Tubuh"],
["顔","かお · kao","Wajah"],
["頭","あたま · atama","Kepala"],
["目","め · me","Mata"],
["耳","みみ · mimi","Telinga"],
["口","くち · kuchi","Mulut"],
["歯","は · ha","Gigi"],
["鼻","はな · hana","Hidung"],
["首","くび · kubi","Leher"],
["肩","かた · kata","Bahu"],
["胸","むね · mune","Dada"],
["お腹","おなか · onaka","Perut"],
["背中","せなか · senaka","Punggung"],
["腰","こし · koshi","Pinggang"],
["腕","うで · ude","Lengan"],
["手","て · te","Tangan"],
["指","ゆび · yubi","Jari"],
["足","あし · ashi","Kaki"],
["眠い","ねむい · nemui","Mengantuk"],
["眠る","ねむる · nemuru","Tidur"],
["疲れる","つかれる · tsukareru","Menjadi lelah"],
["だるい","だるい · darui","Merasa lemas"],
["歩く","あるく · aruku","Berjalan"],
["走る","はしる · hashiru","Berlari"],
["運動する","うんどうする · undou suru","Berolahraga"],
];

const kanjiWords=[
["体","からだ · karada","Tubuh"],
["顔","かお · kao","Wajah"],
["目","め · me","Mata"],
["耳","みみ · mimi","Telinga"],
["口","くち · kuchi","Mulut"],
["頭","あたま · atama","Kepala"],
["足","あし · ashi","Kaki"],
["手","て · te","Tangan"],
["起きる","おきる · okiru","Bangun tidur"],
["歩く","あるく · aruku","Berjalan"],
["走る","はしる · hashiru","Berlari"],
["運動する","うんどうする · undou suru","Berolahraga"],
];

const adviceExamples=[
{id:"rest",situation:"Merasa lelah",japanese:"少し休むといいですよ。",reading:"Sukoshi yasumu to ii desu yo.",meaning:"Sebaiknya beristirahat sebentar."},
{id:"sleep",situation:"Sulit tidur",japanese:"夜は早く寝るといいですよ。",reading:"Yoru wa hayaku neru to ii desu yo.",meaning:"Sebaiknya tidur lebih awal pada malam hari."},
{id:"eyes",situation:"Mata terasa lelah",japanese:"ときどき画面から目を離すといいですよ。",reading:"Tokidoki gamen kara me o hanasu to ii desu yo.",meaning:"Sebaiknya sesekali alihkan pandangan dari layar."},
];

const posterItems=[
{label:"症状",reading:"しょうじょう · shoujou",meaning:"Gejala",detail:"せき、くしゃみ、のどの痛みなど。"},
{label:"手洗い",reading:"てあらい · tearai",meaning:"Cuci tangan",detail:"外から帰ったとき、食事の前に手を洗いましょう。"},
{label:"せきエチケット",reading:"seki echiketto",meaning:"Etika batuk dan bersin",detail:"せきやくしゃみをするとき、口と鼻をおおいましょう。"},
{label:"換気",reading:"かんき · kanki",meaning:"Ventilasi / pergantian udara",detail:"部屋の空気をときどき入れかえましょう。"},
{label:"マスク",reading:"masuku",meaning:"Masker",detail:"必要なときは、マスクを使いましょう。"},
];

const ratingOptions:{value:IrodoriRating;label:string}[]=[
{value:1,label:"★☆☆ Masih perlu latihan"},
{value:2,label:"★★☆ Sudah bisa"},
{value:3,label:"★★★ Bisa dengan baik"},
];

type Task={prompt:ReactNode;options:{key:string;label:ReactNode}[];answer:string;explanation:ReactNode};

const practiceTasks:Task[]=[
{prompt:<>Fungsi 「V-るといいですよ」 adalah …</>,options:[{key:"a",label:"Memberi saran sederhana."},{key:"b",label:"Menyatakan larangan."},{key:"c",label:"Menyebutkan waktu lampau."}],answer:"a",explanation:<>Pola V-るといいですよ digunakan untuk memberi saran sederhana. Kata kerja memakai bentuk kamus.</>},
{prompt:<>Bentuk yang tepat dari 「食べます」 untuk menyatakan “makan terlalu banyak” adalah …</>,options:[{key:"a",label:"食べすぎます"},{key:"b",label:"食べたり"},{key:"c",label:"食べるようです"}],answer:"a",explanation:<>Ambil bentuk masu tanpa ます lalu tambahkan すぎます: 食べます → 食べすぎます.</>},
{prompt:<>Lengkapi: 「歩いたり、家でヨガをしたり＿＿。」</>,options:[{key:"a",label:"しています"},{key:"b",label:"しなければなりません"},{key:"c",label:"してもいいですか"}],answer:"a",explanation:<>V-たり、V-たりしています digunakan untuk menyebut beberapa kegiatan yang dilakukan.</>},
{prompt:<>Pilih kalimat yang menyatakan kebiasaan yang sedang diusahakan.</>,options:[{key:"a",label:"早く寝るようにしています。"},{key:"b",label:"早く寝たことがあります。"},{key:"c",label:"早く寝てもいいですか。"}],answer:"a",explanation:<>V-るようにしています menyatakan hal yang diusahakan menjadi kebiasaan.</>},
{prompt:<>Apa perbedaan 「食べるようにしています」 dan 「食べないようにしています」?</>,options:[{key:"a",label:"Yang pertama berusaha melakukan, yang kedua berusaha tidak melakukan."},{key:"b",label:"Keduanya berarti sudah selesai makan."},{key:"c",label:"Yang kedua adalah bentuk lampau."}],answer:"a",explanation:<>Bentuk kamus menyatakan usaha melakukan sesuatu, sedangkan bentuk nai menyatakan usaha untuk tidak melakukannya.</>},
{prompt:<>Pada poster kesehatan, arti 「手洗い」 adalah …</>,options:[{key:"a",label:"Mencuci tangan."},{key:"b",label:"Berjalan kaki."},{key:"c",label:"Waktu tidur."}],answer:"a",explanation:<>手洗い berarti mencuci tangan. Poster latihan juga memuat etika batuk dan ventilasi.</>},
];

const quizQuestions:Task[]=[
{prompt:<>Apa arti 「体がだるい」?</>,options:[{key:"a",label:"Badan terasa lemas."},{key:"b",label:"Mata terasa gatal."},{key:"c",label:"Kaki terasa dingin."}],answer:"a",explanation:<>だるい berarti merasa lemas atau lesu.</>},
{prompt:<>Pilih saran yang menggunakan pola 「V-るといいですよ」.</>,options:[{key:"a",label:"少し休むといいですよ。"},{key:"b",label:"少し休んだことがあります。"},{key:"c",label:"少し休まないでください。"}],answer:"a",explanation:<>休む adalah bentuk kamus yang diikuti といいですよ untuk memberi saran.</>},
{prompt:<>Apa arti 「画面を見すぎました」?</>,options:[{key:"a",label:"Saya terlalu lama melihat layar."},{key:"b",label:"Saya tidak melihat layar."},{key:"c",label:"Saya akan melihat layar nanti."}],answer:"a",explanation:<>見すぎました berasal dari 見ます + すぎました dan menyatakan melihat secara berlebihan.</>},
{prompt:<>Pilih kalimat yang menyebutkan beberapa kegiatan.</>,options:[{key:"a",label:"歩いたり、走ったりしています。"},{key:"b",label:"歩くといいです。"},{key:"c",label:"歩かないようにしています。"}],answer:"a",explanation:<>V-たり、V-たりしています memberi beberapa contoh kegiatan.</>},
{prompt:<>「早く寝るようにしています」 berarti …</>,options:[{key:"a",label:"Saya berusaha tidur lebih awal."},{key:"b",label:"Saya sudah tidur lebih awal kemarin."},{key:"c",label:"Saya dilarang tidur lebih awal."}],answer:"a",explanation:<>V-るようにしています menyatakan upaya menjadikan tindakan sebagai kebiasaan.</>},
{prompt:<>Apa arti 「野菜を食べるようにしています」?</>,options:[{key:"a",label:"Saya berusaha makan sayuran."},{key:"b",label:"Saya tidak pernah makan sayuran."},{key:"c",label:"Saya sedang membeli sayuran."}],answer:"a",explanation:<>食べるようにしています berarti berusaha untuk makan atau membiasakan diri makan.</>},
{prompt:<>Pada berita latihan, arti 「かぜの人が増えています」 adalah …</>,options:[{key:"a",label:"Jumlah orang yang pilek sedang bertambah."},{key:"b",label:"Semua orang sudah sembuh."},{key:"c",label:"Sekolah sedang libur."}],answer:"a",explanation:<>増えています berarti sedang bertambah. かぜの人 berarti orang yang sedang pilek.</>},
{prompt:<>Apa yang dimaksud 「換気」 pada poster?</>,options:[{key:"a",label:"Pergantian udara dalam ruangan."},{key:"b",label:"Mencuci piring."},{key:"c",label:"Mengisi formulir."}],answer:"a",explanation:<>換気（かんき）adalah ventilasi atau mengganti udara di dalam ruangan.</>},
{prompt:<>Kalimat yang tepat untuk meminta orang menjaga etika batuk adalah …</>,options:[{key:"a",label:"せきエチケットを守りましょう。"},{key:"b",label:"せきエチケットを食べましょう。"},{key:"c",label:"せきエチケットを寝ましょう。"}],answer:"a",explanation:<>守りましょう adalah ajakan untuk mematuhi atau menjaga sesuatu.</>},
{prompt:<>Pilih pernyataan yang seimbang mengenai kebiasaan makan.</>,options:[{key:"a",label:"食事を抜かないようにしています。"},{key:"b",label:"食事を全部やめるようにしています。"},{key:"c",label:"毎日同じものだけ食べるようにしています。"}],answer:"a",explanation:<>食事を抜かないようにしています berarti berusaha untuk tidak melewatkan waktu makan.</>},
];

const simulations=[
{title:"01 · Memberi saran",heading:"Teman merasa lelah",prompt:"Temanmu berkata bahwa akhir-akhir ini ia merasa lelah. Pilih saran sederhana yang sesuai.",japanese:<>少し休むといいですよ。</>,translation:"Sebaiknya beristirahat sebentar.",options:[{key:"a",label:"少し休むといいですよ。",meaning:"Memberi saran sederhana dengan bentuk kamus + といいです."},{key:"b",label:"少し休んだことがあります。",meaning:"Menceritakan pengalaman, bukan memberi saran."},{key:"c",label:"少し休んでもいいですか。",meaning:"Meminta izin untuk diri sendiri."}],answer:"a",explanation:"Pola V-るといいですよ dipakai untuk memberi saran sederhana."},
{title:"02 · Kebiasaan sehat",heading:"Menceritakan kegiatan",prompt:"Seseorang bertanya apa yang kamu lakukan untuk menjaga kebugaran. Kamu berjalan kaki dan kadang melakukan peregangan.",japanese:<>歩いたり、ストレッチしたりしています。</>,translation:"Saya berjalan kaki dan melakukan peregangan, serta kegiatan lainnya.",options:[{key:"a",label:"歩いたり、ストレッチしたりしています。",meaning:"Menyebut beberapa contoh kegiatan dengan ～たり."},{key:"b",label:"歩くといいですよ。",meaning:"Memberi saran kepada orang lain."},{key:"c",label:"歩きすぎました。",meaning:"Menyatakan berjalan terlalu banyak."}],answer:"a",explanation:"V-たり、V-たりしています menyebut beberapa kegiatan sebagai contoh."},
{title:"03 · Memahami berita",heading:"Menangkap informasi utama",prompt:"Dengarkan ringkasan berita latihan tentang pilek yang sedang meningkat di sekolah. Apa informasi yang disebutkan?",japanese:<>学校でかぜの人が増えています。せきやくしゃみが出るときは、せきエチケットを守りましょう。</>,translation:"Jumlah orang yang pilek di sekolah bertambah. Saat batuk atau bersin, mari ikuti etika batuk dan bersin.",options:[{key:"a",label:"Pilek bertambah; berita mengingatkan tentang etika batuk dan bersin."},{key:"b",label:"Sekolah akan ditutup selama satu bulan.",meaning:"Informasi ini tidak disebutkan dalam berita."},{key:"c",label:"Berita membahas perlombaan olahraga.",meaning:"Topik ini tidak sesuai dengan berita latihan."}],answer:"a",explanation:"Informasi utama adalah peningkatan pilek serta pengingat etika batuk dan bersin."},
{title:"04 · Membaca poster",heading:"Menemukan langkah pencegahan",prompt:"Pada poster latihan tertulis 手洗い、せきエチケット、換気. Pilih arti yang sesuai.",japanese:<>手洗い · せきエチケット · 換気</>,translation:"Mencuci tangan · etika batuk dan bersin · ventilasi.",options:[{key:"a",label:"Mencuci tangan, etika batuk, dan mengganti udara."},{key:"b",label:"Berolahraga, tidur, dan makan.",meaning:"Ini bukan terjemahan dari tiga kata pada poster."},{key:"c",label:"Pendaftaran, pemeriksaan, dan pembayaran.",meaning:"Ini adalah kosakata administrasi, bukan pencegahan kesehatan."}],answer:"a",explanation:"Ketiga kata tersebut merupakan bagian poster pencegahan dalam latihan."},
{title:"05 · Menyatakan usaha",heading:"Menceritakan kebiasaan makan",prompt:"Kamu ingin mengatakan bahwa kamu berusaha makan teratur dan tidak melewatkan waktu makan.",japanese:<>食事を抜かないようにしています。</>,translation:"Saya berusaha untuk tidak melewatkan waktu makan.",options:[{key:"a",label:"食事を抜かないようにしています。",meaning:"Bentuk nai + ようにしています menyatakan upaya untuk tidak melakukan sesuatu."},{key:"b",label:"食事を抜くといいですよ。",meaning:"Memberi saran untuk melewatkan makan, bukan kebiasaan sehat."},{key:"c",label:"食事を抜いたりしました。",meaning:"Menceritakan beberapa hal yang sudah dilakukan."}],answer:"a",explanation:"V-ないようにしています berarti berusaha untuk tidak melakukan tindakan tersebut."},
];

export default function IrodoriElementaryOneLessonSixteenPage() {
 const progress=useIrodoriProgress();
 const [practiceAnswers,setPracticeAnswers]=useState<Record<number,string>>({});
 const [practiceSubmitted,setPracticeSubmitted]=useState(false);
 const [answers,setAnswers]=useState<Record<number,string>>({});
 const [quizSubmitted,setQuizSubmitted]=useState(false);
 const [simulationChoices,setSimulationChoices]=useState<Record<number,string>>({});
 const [simulationChecked,setSimulationChecked]=useState<Record<number,boolean>>({});
 const [ratings,setRatings]=useState<Record<string,IrodoriRating>>({});
 const isCompleted=progress.completedLessons.includes(lessonId);
 const visibleRatings={...(progress.selfEvaluations[lessonId]??{}),...ratings};
 const practiceScore=practiceTasks.filter((task,index)=>practiceAnswers[index]===task.answer).length;
 const practiceIsCorrect=practiceSubmitted&&practiceScore===practiceTasks.length;
 const score=quizQuestions.filter((question,index)=>answers[index]===question.answer).length;
 const simulationsComplete=simulations.every((task,index)=>simulationChecked[index]&&simulationChoices[index]===task.answer);
 const canDosRated=canDos.every(item=>visibleRatings[item.id]!==undefined);
 const resetPractice=()=>{setPracticeAnswers({});setPracticeSubmitted(false);};
 const resetQuiz=()=>{setAnswers({});setQuizSubmitted(false);};

 return (
 <main className="mx-auto max-w-5xl space-y-7 pb-12">
  <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#7D92CF]/40 hover:text-[#EAE6DD]"><ArrowLeft size={15}/> Kembali ke Elementary 1</Link>
  <header className="relative isolate overflow-hidden rounded-[28px] border border-[#5266A2]/35 bg-gradient-to-br from-[#252F55] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
   <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#91A6E8]/[0.08]">健</div>
   <div className="relative z-10">
    <p className="text-[9px] font-black tracking-[0.24em] text-[#AAB8E8]">IRODORI • ELEMENTARY 1 A2 • LESSON 16</p>
    <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">I try not to eat too much.</h1>
    <p className="mt-2 text-sm font-semibold text-[#AAB8E8]">食べすぎないようにしています</p>
    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar memberi saran sederhana, menceritakan kebiasaan sehari-hari untuk menjaga kesehatan, memahami berita singkat, dan membaca poster pencegahan penyakit.</p>
    <div className="mt-5 flex flex-wrap gap-2">
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Activity size={14} className="text-[#AAB8E8]"/>Kebiasaan sehat</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#AAB8E8]"/>Aktivitas dan tidur</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><FileText size={14} className="text-[#AAB8E8]"/>Berita dan poster</span>
    </div>
   </div>
  </header>

  <section className="rounded-2xl border border-[#5266A2]/20 bg-[#202638]/80 p-4 md:p-5">
   <div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#AAB8E8]"/><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2></div>
   <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target pertama mengikuti Can-do resmi Irodori. Target terakhir menjadi latihan penguatan Fude.</p>
   <div className="mt-3 grid gap-2 sm:grid-cols-2">{canDos.map((item,index)=><article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#AAB8E8]">{item.source} · 0{index+1}</p><p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#9EAFE1]">KOSAKATA TUBUH DAN KEGIATAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Bagian tubuh dan aktivitas sehari-hari</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenali kata-kata untuk menyebut bagian tubuh, rasa lelah, tidur, dan aktivitas fisik.</p></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{vocabRows.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#AAB8E8]">{reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#9EAFE1]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Memberi saran dan membicarakan kebiasaan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Fokus pada ungkapan saran, contoh aktivitas, dan kebiasaan seimbang.</p></div>
   <div className="space-y-4">
    <IrodoriConversation title="Memberi saran kepada teman yang lelah" speakers={[friendSota,friendYui]} utterances={feelingUnwellConversation}/>
    <IrodoriConversation title="Membicarakan mata yang lelah" speakers={[friendAkiko,friendSota]} utterances={tiredEyesConversation}/>
    <IrodoriConversation title="Menceritakan kegiatan sehari-hari" speakers={[friendAkiko,friendYui]} utterances={exerciseHabitsConversation}/>
    <IrodoriConversation title="Membicarakan kebiasaan makan yang seimbang" speakers={[friendKenji,friendSota]} utterances={balancedMealsConversation}/>
    <IrodoriConversation title="Mendengarkan berita tentang pencegahan pilek" speakers={[newsHost,newsGuest]} utterances={healthNewsConversation}/>
   </div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#9EAFE1]">MEMBERI SARAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pola 「V-るといいですよ」</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan bentuk kamus kata kerja sebelum といいですよ untuk menyampaikan saran sederhana. Ini latihan ungkapan, bukan diagnosis atau pengganti arahan tenaga kesehatan.</p></div>
   <div className="grid gap-3 sm:grid-cols-3">{adviceExamples.map(item=><article key={item.id} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#AAB8E8]">{item.situation}</p><p className="mt-3 font-mincho text-base leading-7 text-[#F1EBDD]">{item.japanese}</p><p className="mt-1 text-[9px] text-[#AAB8E8]">{item.reading}</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">{item.meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#9EAFE1]">KEBIASAAN SEHARI-HARI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menceritakan hal yang sedang diusahakan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pilih contoh kebiasaan yang sesuai dengan kegiatan dan kebutuhan sehari-hari. Tidak harus melakukan semuanya.</p></div>
   <div className="grid gap-3 sm:grid-cols-2">
    <article className="rounded-xl border border-[#5266A2]/20 bg-[#202638]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#AAB8E8]">AKTIVITAS</p><p className="mt-3 font-mincho text-base leading-7 text-[#E4E9F8]">友達と歩いたり、家でストレッチしたりしています。</p><p className="mt-1 text-xs text-[#A9A398]">Saya berjalan kaki bersama teman atau melakukan peregangan di rumah.</p></article>
    <article className="rounded-xl border border-[#5266A2]/20 bg-[#202638]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#AAB8E8]">ISTIRAHAT</p><p className="mt-3 font-mincho text-base leading-7 text-[#E4E9F8]">夜は早く寝るようにしています。</p><p className="mt-1 text-xs text-[#A9A398]">Saya berusaha tidur lebih awal pada malam hari.</p></article>
    <article className="rounded-xl border border-[#5266A2]/20 bg-[#202638]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#AAB8E8]">MAKAN TERATUR</p><p className="mt-3 font-mincho text-base leading-7 text-[#E4E9F8]">朝ごはんを食べるようにしています。</p><p className="mt-1 text-xs text-[#A9A398]">Saya berusaha untuk sarapan.</p></article>
    <article className="rounded-xl border border-[#5266A2]/20 bg-[#202638]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#AAB8E8]">KESEIMBANGAN</p><p className="mt-3 font-mincho text-base leading-7 text-[#E4E9F8]">食事を抜かないようにしています。</p><p className="mt-1 text-xs text-[#A9A398]">Saya berusaha tidak melewatkan waktu makan.</p></article>
   </div>
   <p className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4 text-[10px] leading-6 text-[#A9A398]">Catatan: pola 食べすぎないようにしています adalah contoh cara menyebut kebiasaan secara moderat, bukan anjuran diet ketat. Makan teratur dan tidak melewatkan waktu makan tetap penting; kebiasaan sehat juga tidak perlu dinilai dari bentuk tubuh atau penampilan.</p>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#9EAFE1]">MEMAHAMI BERITA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menangkap informasi utama dari berita singkat</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Contoh berita di bawah sepenuhnya fiktif. Cari nama penyakit, gejala yang disebutkan, dan hal-hal yang diingatkan dalam berita.</p></div>
   <article className="overflow-hidden rounded-2xl border border-[#5266A2]/25 bg-[#1D2233]">
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-[#2B3450] px-4 py-3"><div><p className="text-[9px] font-black tracking-[0.16em] text-[#AAB8E8]">BERITA LATIHAN · FIKTIF</p><h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">学校でかぜが増えています</h3></div><span className="rounded-lg bg-black/20 px-2 py-1 text-[9px] text-[#C6D0F0]">NEWS</span></div>
    <div className="space-y-3 p-4"><p className="font-mincho text-sm leading-7 text-[#E4E9F8]">最近、学校でかぜの人が増えています。せきやくしゃみが出る人もいます。手をよく洗って、せきエチケットを守りましょう。部屋の空気を入れかえることも大切です。</p><p className="text-xs leading-6 text-[#A9A398]">Akhir-akhir ini, jumlah orang yang pilek di sekolah bertambah. Ada juga orang yang batuk atau bersin. Mari mencuci tangan dengan baik dan mengikuti etika batuk. Mengganti udara di ruangan juga penting.</p></div>
    <div className="grid gap-2 border-t border-white/[0.08] p-4 sm:grid-cols-3">{[["病気","かぜ","Pilek"],["症状","せき・くしゃみ","Batuk dan bersin"],["予防","手洗い・せきエチケット・換気","Cuci tangan, etika batuk, ventilasi"]].map(([label,jp,meaning])=><div key={label} className="rounded-lg border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-bold text-[#AAB8E8]">{label}</p><p className="mt-1 font-mincho text-sm text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p></div>)}</div>
   </article>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#9EAFE1]">MEMBACA POSTER KESEHATAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Temukan gejala dan langkah pencegahan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Poster berikut merupakan bahan latihan orisinal. Baca judul, lalu cari kata kunci pada setiap bagian.</p></div>
   <article className="overflow-hidden rounded-2xl border border-[#5266A2]/25 bg-[#202638]">
    <div className="border-b border-white/[0.08] bg-[#334064] px-4 py-4 text-center"><p className="text-[9px] font-black tracking-[0.2em] text-[#C6D0F0]">POSTER LATIHAN · FIKTIF</p><h3 className="mt-2 font-mincho text-2xl font-black text-[#F1EBDD]">かぜ予防のポイント</h3><p className="mt-1 text-xs text-[#D3DCF5]">Hal penting untuk mencegah pilek</p></div>
    <div className="grid gap-2 p-4 sm:grid-cols-2">{posterItems.map((item,index)=><div key={item.label} className="rounded-xl border border-white/[0.08] bg-black/15 p-3"><p className="text-[9px] font-black text-[#AAB8E8]">0{index+1} · {item.reading}</p><p className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-xs text-[#D3DCF5]">{item.meaning}</p><p className="mt-2 border-t border-white/[0.07] pt-2 text-xs leading-6 text-[#A9A398]">{item.detail}</p></div>)}</div>
    <p className="border-t border-white/[0.08] px-4 py-3 text-[10px] leading-5 text-[#A9A398]">Poster ini hanya contoh fiktif untuk latihan membaca bahasa Jepang. Ikuti panduan kesehatan dari sekolah, keluarga, dan tenaga kesehatan.</p>
   </article>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#9EAFE1]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Empat pola untuk saran dan kebiasaan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari empat bentuk yang dipakai untuk memberi saran, menyatakan sesuatu yang berlebihan, memberi contoh kegiatan, dan menjelaskan usaha membentuk kebiasaan.</p></div>
   {[
    {title:"01 · Memberi saran sederhana",pattern:"V-る ＋ といいです（よ）",example:<>少し休むといいですよ。<br/>夜は早く寝るといいですよ。</>,note:"Gunakan bentuk kamus kata kerja sebelum といいです untuk menyampaikan saran ringan. Contoh: 休みます → 休むといいです."},
    {title:"02 · Menyatakan sesuatu yang berlebihan",pattern:"V-ます（tanpa ます）＋ すぎます",example:<>画面を見すぎました。<br/>食べすぎて、お腹が痛いです。</>,note:"Tambahkan すぎます pada akar bentuk masu. Pola ini menyatakan tindakan yang melewati batas atau terlalu banyak. Contoh: 見ます → 見すぎます; 食べます → 食べすぎます."},
    {title:"03 · Menyebut beberapa contoh kegiatan",pattern:"V1-たり、V2-たり（します）",example:<>歩いたり、走ったりしています。<br/>休みの日は、本を読んだり、音楽を聞いたりします。</>,note:"Gunakan bentuk ta ditambah り untuk memberi beberapa contoh kegiatan. Daftar ini tidak harus menyebut semua kegiatan yang dilakukan."},
    {title:"04 · Menjelaskan hal yang sedang diusahakan",pattern:"V-る ／ V-ない ＋ ようにしています",example:<>早く寝るようにしています。<br/>食事を抜かないようにしています。</>,note:"Bentuk kamus menyatakan usaha untuk melakukan sesuatu sebagai kebiasaan. Bentuk nai menyatakan usaha untuk tidak melakukannya. Pola ini cocok untuk menceritakan hal yang sedang diperhatikan dalam kehidupan sehari-hari."},
   ].map(item=><article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#9EAFE1]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p><p className="mt-2 font-mincho text-base leading-7 text-[#C6D0F0]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>)}
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#9EAFE1]">KANJI DAN KATA PENTING</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kanji untuk bagian tubuh dan aktivitas</h2></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{kanjiWords.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="font-mincho text-lg text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#AAB8E8]">{reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#9EAFE1]">SIMULASI INTERAKTIF</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan bahasa Jepang dalam situasi sehari-hari</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi tentang memberi saran, kebiasaan, berita, poster, dan hal yang sedang diusahakan.</p></div>
   {simulations.map((task,index)=>{const selected=simulationChoices[index];const isCorrect=simulationChecked[index]&&selected===task.answer;const isWrong=simulationChecked[index]&&selected!==task.answer;return <article key={task.title} className="space-y-3 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
    <div><p className="text-[9px] font-black tracking-[0.18em] text-[#9EAFE1]">{task.title}</p><h3 className="mt-1 text-base font-black text-[#EAE6DD]">{task.heading}</h3><p className="mt-1 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p></div>
    <div className="rounded-xl border border-[#5266A2]/20 bg-[#202638] p-4"><p className="font-mincho text-base leading-7 text-[#E4E9F8]"><JapaneseReading allowIndexFallback>{task.japanese}</JapaneseReading></p><p className="mt-1 text-[10px] text-[#AAB8E8]">{task.translation}</p></div>
    <div className="grid gap-2">{task.options.map(option=><button key={option.key} type="button" disabled={Boolean(isCorrect)} aria-pressed={selected===option.key} onClick={()=>{setSimulationChoices(current=>({...current,[index]:option.key}));setSimulationChecked(current=>({...current,[index]:false}));}} className={"rounded-xl border p-3 text-left transition-colors "+(isCorrect&&option.key===task.answer?"border-emerald-500/50 bg-emerald-500/10":isWrong&&selected===option.key?"border-red-400/50 bg-red-400/10":selected===option.key?"border-[#91A6E8]/60 bg-[#5266A2]/15":"border-white/[0.07] bg-black/10")}><p className="font-mincho text-sm text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></p><p className="mt-1 text-[10px] text-[#A9A398]">{option.meaning}</p></button>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" aria-live="polite" className="text-[10px] leading-5 text-[#A9A398]">{isCorrect?"Benar. "+task.explanation:isWrong?"Belum tepat. Coba pilih jawaban lain.":"Pilih satu jawaban, lalu periksa."}</p><button type="button" disabled={!selected||Boolean(isCorrect)} onClick={()=>setSimulationChecked(current=>({...current,[index]:true}))} className="rounded-lg bg-[#5266A2] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#404F82] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">{isCorrect?"Selesai":"Periksa"}</button></div>
   </article>})}
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#9EAFE1]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban praktik harus benar untuk membuka evaluasi akhir.</p></div>
   <div className="space-y-3">{practiceTasks.map((task,index)=>{const selected=practiceAnswers[index];const isCorrect=selected===task.answer;return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#9EAFE1]">LATIHAN {String(index+1).padStart(2,"0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{task.options.map(option=><button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected===option.key} onClick={()=>setPracticeAnswers(current=>({...current,[index]:option.key}))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors "+(practiceSubmitted&&option.key===task.answer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-200":practiceSubmitted&&selected===option.key?"border-red-400/50 bg-red-400/10 text-red-200":selected===option.key?"border-[#91A6E8]/60 bg-[#5266A2]/15 text-[#F1EBDD]":"border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{practiceSubmitted&&<p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect?"font-bold text-emerald-300":"font-bold text-[#E7A1A1]"}>{isCorrect?"Benar. ":"Belum tepat. "}</span><JapaneseReading allowIndexFallback>{task.explanation}</JapaneseReading></p>}</article>})}</div>
   <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{practiceSubmitted?"Hasil praktik: "+practiceScore+" dari "+practiceTasks.length+" benar.":Object.keys(practiceAnswers).length+" dari "+practiceTasks.length+" pertanyaan dijawab."}</p>{practiceSubmitted?<button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#5266A2]/35 px-4 py-2 text-xs font-bold text-[#C6D0F0]"><RefreshCw size={13}/> Ulangi praktik</button>:<button type="button" onClick={()=>setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length!==practiceTasks.length} className="rounded-lg bg-[#5266A2] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa praktik</button>}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#9EAFE1]">KUIS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p></div>
   <div className="space-y-3">{quizQuestions.map((question,index)=>{const selected=answers[index];const isCorrect=selected===question.answer;return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#9EAFE1]">SOAL {String(index+1).padStart(2,"0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{question.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{question.options.map(option=><button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected===option.key} onClick={()=>setAnswers(current=>({...current,[index]:option.key}))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors "+(quizSubmitted&&option.key===question.answer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-200":quizSubmitted&&selected===option.key?"border-red-400/50 bg-red-400/10 text-red-200":selected===option.key?"border-[#91A6E8]/60 bg-[#5266A2]/15 text-[#F1EBDD]":"border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{quizSubmitted&&<p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect?"font-bold text-emerald-300":"font-bold text-[#E7A1A1]"}>{isCorrect?"Benar. ":"Belum tepat. "}</span><JapaneseReading allowIndexFallback>{question.explanation}</JapaneseReading></p>}</article>})}</div>
   <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{quizSubmitted?"Nilai kuis: "+score+" dari "+quizQuestions.length+" benar.":Object.keys(answers).length+" dari "+quizQuestions.length+" pertanyaan dijawab."}</p>{quizSubmitted?<button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#5266A2]/35 px-4 py-2 text-xs font-bold text-[#C6D0F0]"><RefreshCw size={13}/> Ulangi kuis</button>:<button type="button" onClick={()=>setQuizSubmitted(true)} disabled={Object.keys(answers).length!==quizQuestions.length} className="rounded-lg bg-[#5266A2] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa jawaban</button>}</div>
  </section>

  <section className="rounded-2xl border border-[#5266A2]/25 bg-gradient-to-br from-[#232D4B] to-[#191817] p-5 md:p-6">
   <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#AAB8E8]"/><p className="text-[9px] font-black tracking-[0.2em] text-[#AAB8E8]">CAN-DO CHECK</p></div>
   <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
   <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. Progres Elementary 1 tersimpan dalam jalur Irodori, terpisah dari Minna no Nihongo dan JLPT.</p>
   <div className="mt-4 space-y-3">{canDos.map((item,index)=><div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3"><p className="text-xs font-semibold leading-5 text-[#EAE6DD]"><span className="mr-2 text-[#AAB8E8]">{String(index+1).padStart(2,"0")}</span>{item.text}</p><div className="mt-3 flex flex-wrap gap-2">{ratingOptions.map(option=><button key={option.value} type="button" disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete} aria-pressed={visibleRatings[item.id]===option.value} onClick={()=>{const next={...visibleRatings,[item.id]:option.value};setRatings(next);saveIrodoriSelfEvaluation(lessonId,next);}} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 "+(visibleRatings[item.id]===option.value?"border-[#91A6E8]/60 bg-[#5266A2]/20 text-[#E0E6FA]":"border-white/[0.08] bg-[#24221F] text-[#A3A099]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div></div>)}</div>
   <div className="mt-5 flex flex-wrap items-center justify-between gap-3">{isCompleted?<span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/> Pelajaran selesai</span>:<button type="button" onClick={()=>completeIrodoriLesson(lessonId)} disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#5266A2] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#404F82] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/> Tandai pelajaran selesai</button>}
    <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#91A6E8]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
   </div>
   {(!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated)&&<p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian Can-do.</p>}
  </section>
  <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, berita, dan poster latihan dibuat orisinal oleh Fude. Materi ini melatih bahasa Jepang dan tidak dimaksudkan sebagai panduan medis atau diet.</p>
 </main>
 );
}
