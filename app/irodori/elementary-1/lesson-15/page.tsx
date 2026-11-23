"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, FileText, RefreshCw, Stethoscope } from "lucide-react";
import IrodoriConversation, { type IrodoriUtterance } from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import JapaneseReading from "@/components/JapaneseReading";
import JapaneseVocabularyReading from "@/components/JapaneseVocabularyReading";
import { formatGrammarNotation } from "@/lib/japanese-text";
import { completeIrodoriLesson, saveIrodoriSelfEvaluation, useIrodoriProgress } from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const speakers = IRODORI_SPEAKERS;
const doctor = { ...speakers.akiko, name: "Dokter", role: "Dokter" };
const visitorYui = { ...speakers.yui, name: "Yui", role: "Pengunjung" };
const visitorSota = { ...speakers.sota, name: "Sota", role: "Pengunjung" };
const receptionist = { ...speakers.kenji, name: "Petugas", role: "Petugas pendaftaran" };
const lessonId = "elementary1-15";

const symptomConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>今日はどうしましたか。</>,romaji:"Kyou wa dou shimashita ka?",translation:"Ada keluhan apa hari ini?",audioFileName:"irodori-elementary1-15-a01-l01.mp3"},
{speakerId:"yui",japanese:<>昨日から熱があって、のどが痛いんです。</>,romaji:"Kinou kara netsu ga atte, nodo ga itai n desu.",translation:"Sejak kemarin saya demam dan tenggorokan saya sakit.",audioFileName:"irodori-elementary1-15-a01-l02.mp3"},
{speakerId:"akiko",japanese:<>いつからですか。せきも出ますか。</>,romaji:"Itsu kara desu ka? Seki mo demasu ka?",translation:"Sejak kapan? Apakah juga batuk?",audioFileName:"irodori-elementary1-15-a01-l03.mp3"},
{speakerId:"yui",japanese:<>昨日の夜からです。せきも少し出るんです。</>,romaji:"Kinou no yoru kara desu. Seki mo sukoshi deru n desu.",translation:"Sejak tadi malam. Saya juga sedikit batuk.",audioFileName:"irodori-elementary1-15-a01-l04.mp3"},
];

const stomachConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>ほかに、気になることがありますか。</>,romaji:"Hoka ni, ki ni naru koto ga arimasu ka?",translation:"Apakah ada hal lain yang dirasakan?",audioFileName:"irodori-elementary1-15-a02-l01.mp3"},
{speakerId:"sota",japanese:<>お腹が痛くて、吐き気がするんです。</>,romaji:"Onaka ga itakute, hakike ga suru n desu.",translation:"Perut saya sakit dan saya merasa mual.",audioFileName:"irodori-elementary1-15-a02-l02.mp3"},
{speakerId:"akiko",japanese:<>いつからですか。</>,romaji:"Itsu kara desu ka?",translation:"Sejak kapan?",audioFileName:"irodori-elementary1-15-a02-l03.mp3"},
{speakerId:"sota",japanese:<>おとといからです。</>,romaji:"Ototoi kara desu.",translation:"Sejak dua hari yang lalu.",audioFileName:"irodori-elementary1-15-a02-l04.mp3"},
];

const receptionConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>すみません。初めて来ました。どうしたらいいですか。</>,romaji:"Sumimasen. Hajimete kimashita. Dou shitara ii desu ka?",translation:"Permisi. Ini pertama kalinya saya datang. Apa yang harus saya lakukan?",audioFileName:"irodori-elementary1-15-a03-l01.mp3"},
{speakerId:"kenji",japanese:<>こちらに名前を書いてください。問診票もお願いします。</>,romaji:"Kochira ni namae o kaite kudasai. Monshinhyou mo onegaishimasu.",translation:"Silakan tulis nama di sini. Tolong isi juga formulir pertanyaan.",audioFileName:"irodori-elementary1-15-a03-l02.mp3"},
{speakerId:"yui",japanese:<>はい。書いたあと、こちらに出せばいいですか。</>,romaji:"Hai. Kaita ato, kochira ni daseba ii desu ka?",translation:"Baik. Setelah selesai menulis, apakah saya serahkan ke sini?",audioFileName:"irodori-elementary1-15-a03-l03.mp3"},
{speakerId:"kenji",japanese:<>はい、そうです。ありがとうございます。</>,romaji:"Hai, sou desu. Arigatou gozaimasu.",translation:"Ya, benar. Terima kasih.",audioFileName:"irodori-elementary1-15-a03-l04.mp3"},
];

const waitingConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>診察の前に、こちらに座ってください。</>,romaji:"Shinsatsu no mae ni, kochira ni suwatte kudasai.",translation:"Sebelum pemeriksaan, silakan duduk di sini.",audioFileName:"irodori-elementary1-15-a04-l01.mp3"},
{speakerId:"sota",japanese:<>はい。</>,romaji:"Hai.",translation:"Baik.",audioFileName:"irodori-elementary1-15-a04-l02.mp3"},
{speakerId:"akiko",japanese:<>問診票を見せてください。わからないことはありますか。</>,romaji:"Monshinhyou o misete kudasai. Wakaranai koto wa arimasu ka?",translation:"Tolong tunjukkan formulir pertanyaan. Apakah ada hal yang belum dipahami?",audioFileName:"irodori-elementary1-15-a04-l03.mp3"},
{speakerId:"sota",japanese:<>ここに名前を書けばいいですか。</>,romaji:"Koko ni namae o kakeba ii desu ka?",translation:"Apakah saya harus menulis nama di sini?",audioFileName:"irodori-elementary1-15-a04-l04.mp3"},
{speakerId:"akiko",japanese:<>はい、そうです。</>,romaji:"Hai, sou desu.",translation:"Ya, benar.",audioFileName:"irodori-elementary1-15-a04-l05.mp3"},
];

const formConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>この欄には何を書きますか。</>,romaji:"Kono ran ni wa nani o kakimasu ka?",translation:"Apa yang harus saya tulis di kolom ini?",audioFileName:"irodori-elementary1-15-a05-l01.mp3"},
{speakerId:"kenji",japanese:<>症状を書いてください。いつからかも書いてください。</>,romaji:"Shoujou o kaite kudasai. Itsu kara ka mo kaite kudasai.",translation:"Silakan tulis gejalanya. Tuliskan juga sejak kapan gejala itu muncul.",audioFileName:"irodori-elementary1-15-a05-l02.mp3"},
{speakerId:"yui",japanese:<>「昨日から」と書けばいいですか。</>,romaji:"'Kinou kara' to kakeba ii desu ka?",translation:"Apakah saya tulis 'sejak kemarin'?",audioFileName:"irodori-elementary1-15-a05-l03.mp3"},
{speakerId:"kenji",japanese:<>はい。それで大丈夫です。</>,romaji:"Hai. Sore de daijoubu desu.",translation:"Ya, itu sudah benar.",audioFileName:"irodori-elementary1-15-a05-l04.mp3"},
];

const canDos=[
{id:"explain-symptoms-at-hospital",text:"Menjelaskan gejala yang dirasakan kepada petugas atau dokter dengan kalimat sederhana.",source:"CAN-DO 52"},
{id:"understand-clinic-instructions",text:"Mendengarkan dan memahami arahan sederhana dari petugas klinik.",source:"CAN-DO 53"},
{id:"fill-questionnaire-fields",text:"Mengisi bagian yang diperlukan pada formulir pertanyaan rumah sakit.",source:"CAN-DO 54"},
{id:"explain-duration-of-symptoms",text:"Menjelaskan sejak kapan gejala muncul dengan keterangan waktu yang tepat.",source:"LATIHAN Fude"},
{id:"ask-for-clarification",text:"Menanyakan kembali bagian formulir atau instruksi yang belum dipahami.",source:"LATIHAN Fude"},
];

const symptomRows=[
["のどが痛い","nodo ga itai","Tenggorokan sakit"],
["お腹が痛い","onaka ga itai","Perut sakit"],
["熱がある","netsu ga aru","Demam"],
["せきが出る","seki ga deru","Batuk"],
["鼻水が出る","hanamizu ga deru","Hidung berair"],
["吐き気がする","hakike ga suru","Merasa mual"],
["食欲がない","shokuyoku ga nai","Tidak nafsu makan"],
["目がかゆい","me ga kayui","Mata terasa gatal"],
["足をくじく","ashi o kujiku","Keseleo pada kaki"],
["頭をぶつける","atama o butsukeru","Terbentur kepala"],
];

const vocabRows=[
["症状","しょうじょう · shoujou","Gejala"],
["のど","のど · nodo","Tenggorokan"],
["痛い","いたい · itai","Sakit / terasa nyeri"],
["お腹","おなか · onaka","Perut"],
["熱","ねつ · netsu","Demam"],
["せき","せき · seki","Batuk"],
["鼻水","はなみず · hanamizu","Cairan hidung"],
["吐き気","はきけ · hakike","Rasa mual"],
["食欲","しょくよく · shokuyoku","Nafsu makan"],
["目","め · me","Mata"],
["かゆい","かゆい · kayui","Gatal"],
["足","あし · ashi","Kaki"],
["くじく","くじく · kujiku","Membuat keseleo"],
["頭","あたま · atama","Kepala"],
["ぶつける","ぶつける · butsukeru","Membenturkan"],
["転ぶ","ころぶ · korobu","Terjatuh"],
["おととい","おととい · ototoi","Dua hari yang lalu"],
["一週間","いっしゅうかん · isshuukan","Satu minggu"],
["花粉症","かふんしょう · kafunshou","Alergi serbuk sari"],
["病院","びょういん · byouin","Rumah sakit"],
["医者","いしゃ · isha","Dokter"],
["受付","うけつけ · uketsuke","Meja pendaftaran"],
["問診票","もんしんひょう · monshinhyou","Formulir pertanyaan medis"],
["待合室","まちあいしつ · machiaishitsu","Ruang tunggu"],
["記入する","きにゅうする · kinyuu suru","Mengisi / menuliskan"],
];

const kanjiWords=[
["熱","ねつ · netsu","Demam"],
["病気","びょうき · byouki","Penyakit"],
["病院","びょういん · byouin","Rumah sakit"],
["医者","いしゃ · isha","Dokter"],
["住所","じゅうしょ · juusho","Alamat"],
["～才","～さい · ~sai","~ tahun (usia)"],
["痛い","いたい · itai","Sakit / nyeri"],
["眠い","ねむい · nemui","Mengantuk"],
["寝る","ねる · neru","Tidur"],
["記入する","きにゅうする · kinyuu suru","Mengisi / menuliskan"],
];

const formFields=[
{label:"氏名",reading:"しめい · shimei",meaning:"Nama lengkap",example:"山田 ユイ"},
{label:"症状",reading:"しょうじょう · shoujou",meaning:"Gejala yang dirasakan",example:"熱がある、のどが痛い"},
{label:"いつから",reading:"いつから · itsu kara",meaning:"Sejak kapan",example:"昨日の夜から"},
{label:"確認したいこと",reading:"かくにんしたいこと · kakunin shitai koto",meaning:"Hal yang ingin ditanyakan",example:"診察の順番"},
];

const ratingOptions:{value:IrodoriRating;label:string}[]=[
{value:1,label:"★☆☆ Masih perlu latihan"},
{value:2,label:"★★☆ Sudah bisa"},
{value:3,label:"★★★ Bisa dengan baik"},
];

type Task={prompt:ReactNode;options:{key:string;label:ReactNode}[];answer:string;explanation:ReactNode};

const practiceTasks:Task[]=[
{prompt:<>Kalimat 「のどが痛いんです」 digunakan untuk …</>,options:[{key:"a",label:"Menjelaskan keadaan atau keluhan."},{key:"b",label:"Meminta izin."},{key:"c",label:"Menyebutkan alamat."}],answer:"a",explanation:<>～んです membantu menjelaskan keadaan kepada lawan bicara, misalnya saat menyampaikan gejala kepada dokter.</>},
{prompt:<>Pilih kalimat yang menghubungkan dua gejala secara alami.</>,options:[{key:"a",label:"お腹が痛くて、吐き気がするんです。"},{key:"b",label:"お腹が痛いですと、吐き気。"},{key:"c",label:"お腹が痛い前に、吐き気です。"}],answer:"a",explanation:<>Bentuk て menghubungkan dua keadaan: お腹が痛い → お腹が痛くて.</>},
{prompt:<>Apa fungsi 「V-ないでください」?</>,options:[{key:"a",label:"Meminta seseorang untuk tidak melakukan sesuatu."},{key:"b",label:"Menceritakan pengalaman lampau."},{key:"c",label:"Menanyakan waktu mulai."}],answer:"a",explanation:<>V-ないでください digunakan untuk memberi instruksi atau meminta seseorang agar tidak melakukan sesuatu.</>},
{prompt:<>Lengkapi: 「問診票を書いた＿＿、受付に出してください。」</>,options:[{key:"a",label:"あと"},{key:"b",label:"前"},{key:"c",label:"とき"}],answer:"a",explanation:<>V-たあと menunjukkan bahwa tindakan kedua dilakukan setelah tindakan pertama selesai.</>},
{prompt:<>Kalimat 「病院に行くとき、保険証を確認します」 berarti …</>,options:[{key:"a",label:"Saat pergi ke rumah sakit, saya memeriksa kartu asuransi."},{key:"b",label:"Setelah pulang dari rumah sakit, saya tidur."},{key:"c",label:"Saya tidak pergi ke rumah sakit."}],answer:"a",explanation:<>V-るとき menunjukkan waktu ketika suatu tindakan dilakukan.</>},
{prompt:<>Pada formulir contoh, kolom 「いつから」 meminta informasi …</>,options:[{key:"a",label:"Sejak kapan gejala muncul."},{key:"b",label:"Nama lengkap."},{key:"c",label:"Tempat tinggal."}],answer:"a",explanation:<>いつから berarti sejak kapan. Contoh jawaban: 昨日から (sejak kemarin).</>},
];

const quizQuestions:Task[]=[
{prompt:<>Apa arti 「症状」?</>,options:[{key:"a",label:"Gejala."},{key:"b",label:"Resepsionis."},{key:"c",label:"Ruang tunggu."}],answer:"a",explanation:<>症状（しょうじょう）berarti gejala atau tanda yang dirasakan.</>},
{prompt:<>Pilih ungkapan untuk mengatakan bahwa tenggorokan terasa sakit.</>,options:[{key:"a",label:"のどが痛いんです。"},{key:"b",label:"目がかゆいんです。"},{key:"c",label:"足をくじいたんです。"}],answer:"a",explanation:<>のどが痛いんです berarti tenggorokan saya sakit.</>},
{prompt:<>Apa arti 「おとといからです」?</>,options:[{key:"a",label:"Sejak dua hari yang lalu."},{key:"b",label:"Sejak besok."},{key:"c",label:"Selama dua minggu."}],answer:"a",explanation:<>おととい adalah dua hari yang lalu dan から berarti sejak.</>},
{prompt:<>Pilih kalimat untuk menjelaskan demam dan sakit tenggorokan sekaligus.</>,options:[{key:"a",label:"熱があって、のどが痛いんです。"},{key:"b",label:"熱の前に、のどです。"},{key:"c",label:"熱をのどにします。"}],answer:"a",explanation:<>あって adalah bentuk て dari ある, yang menghubungkan dua keadaan.</>},
{prompt:<>Apa arti 「問診票」?</>,options:[{key:"a",label:"Formulir pertanyaan medis."},{key:"b",label:"Ruang pemeriksaan."},{key:"c",label:"Kartu nama."}],answer:"a",explanation:<>問診票（もんしんひょう）adalah formulir berisi pertanyaan yang diisi sebelum konsultasi.</>},
{prompt:<>Arti 「待合室」 adalah …</>,options:[{key:"a",label:"Ruang tunggu."},{key:"b",label:"Ruang kelas."},{key:"c",label:"Ruang makan."}],answer:"a",explanation:<>待合室（まちあいしつ）adalah tempat untuk menunggu giliran.</>},
{prompt:<>Lengkapi: 「ここで写真を撮ら＿＿でください。」</>,options:[{key:"a",label:"ない"},{key:"b",label:"ます"},{key:"c",label:"て"}],answer:"a",explanation:<>撮る → 撮らない, lalu ないでください untuk meminta seseorang tidak mengambil foto.</>},
{prompt:<>Pilih bentuk yang benar untuk mengatakan “sebelum mengisi formulir”.</>,options:[{key:"a",label:"問診票を書く前に"},{key:"b",label:"問診票を書いたあとに"},{key:"c",label:"問診票を書かないとき"}],answer:"a",explanation:<>V-る前に memakai bentuk kamus: 書く前に.</>},
{prompt:<>Apa arti 「病院に行ったあと」?</>,options:[{key:"a",label:"Setelah pergi ke rumah sakit."},{key:"b",label:"Sebelum pergi ke rumah sakit."},{key:"c",label:"Saat tidak pergi ke rumah sakit."}],answer:"a",explanation:<>V-たあと berarti setelah suatu tindakan selesai dilakukan.</>},
{prompt:<>Jika tidak memahami satu kolom pada formulir, ungkapan yang tepat adalah …</>,options:[{key:"a",label:"この欄には何を書きますか。"},{key:"b",label:"この欄を食べますか。"},{key:"c",label:"この欄は寝ますか。"}],answer:"a",explanation:<>この欄には何を書きますか berarti apa yang harus ditulis di kolom ini?</>},
];

const simulations=[
{title:"01 · Menjelaskan gejala",heading:"Berbicara kepada dokter",prompt:"Dokter menanyakan keluhan. Kamu ingin menjelaskan bahwa sejak kemarin demam dan tenggorokan terasa sakit.",japanese:<>昨日から熱があって、のどが痛いんです。</>,translation:"Sejak kemarin saya demam dan tenggorokan saya sakit.",options:[{key:"a",label:"昨日から熱があって、のどが痛いんです。",meaning:"Menjelaskan dua gejala dan kapan gejala muncul."},{key:"b",label:"昨日から病院を書きます。",meaning:"Susunan kata tidak tepat untuk menjelaskan gejala."},{key:"c",label:"のどの前に熱です。",meaning:"Tidak menyampaikan keluhan dengan jelas."}],answer:"a",explanation:"Gunakan bentuk て untuk menghubungkan beberapa keadaan, lalu んです untuk menjelaskan situasi."},
{title:"02 · Menyebutkan waktu",heading:"Menjawab pertanyaan sejak kapan",prompt:"Petugas bertanya 「いつからですか」. Gejala mulai terasa dua hari yang lalu.",japanese:<>おとといからです。</>,translation:"Sejak dua hari yang lalu.",options:[{key:"a",label:"おとといからです。",meaning:"Menjawab kapan gejala mulai muncul."},{key:"b",label:"おとといまでです。",meaning:"Berarti sampai dua hari yang lalu."},{key:"c",label:"おとといの前です。",meaning:"Tidak menjawab secara alami."}],answer:"a",explanation:"から berarti sejak dan dapat diikuti keterangan waktu seperti 昨日 atau おととい."},
{title:"03 · Mengisi formulir",heading:"Memahami instruksi petugas",prompt:"Petugas meminta kamu menulis nama dan mengisi formulir pertanyaan. Pilih tanggapan yang sesuai.",japanese:<>問診票を書いたあと、受付に出してください。</>,translation:"Setelah mengisi formulir, serahkan ke meja pendaftaran.",options:[{key:"a",label:"はい。書いたあと、受付に出します。",meaning:"Mengulang urutan instruksi dengan tepat."},{key:"b",label:"いいえ。受付を食べます。",meaning:"Tidak sesuai konteks."},{key:"c",label:"書く前に、帰りました。",meaning:"Mengatakan sudah pulang sebelum mengisi."}],answer:"a",explanation:"V-たあと menunjukkan tindakan yang dilakukan setelah mengisi formulir selesai."},
{title:"04 · Menunggu giliran",heading:"Memahami arahan di ruang tunggu",prompt:"Petugas memberi tahu tempat menunggu. Pilih tindakan yang sesuai dengan instruksi.",japanese:<>こちらの待合室でお待ちください。</>,translation:"Silakan menunggu di ruang tunggu ini.",options:[{key:"a",label:"待合室で待ちます。",meaning:"Menunggu di ruang tunggu."},{key:"b",label:"受付で寝ます。",meaning:"Tidur di meja pendaftaran."},{key:"c",label:"病院の外で走ります。",meaning:"Berlari di luar rumah sakit."}],answer:"a",explanation:"待合室 adalah ruang tunggu. Perhatikan lokasi yang disebutkan petugas."},
{title:"05 · Meminta penjelasan",heading:"Bertanya tentang kolom formulir",prompt:"Kamu belum memahami kolom yang sedang ditunjuk. Gunakan pertanyaan yang sopan.",japanese:<>この欄には何を書きますか。</>,translation:"Apa yang harus saya tulis di kolom ini?",options:[{key:"a",label:"この欄には何を書きますか。",meaning:"Meminta penjelasan tentang isi kolom."},{key:"b",label:"この欄はどこで寝ますか。",meaning:"Tidak sesuai konteks."},{key:"c",label:"この欄を食べてもいいですか。",meaning:"Tidak sesuai konteks."}],answer:"a",explanation:"この欄には何を書きますか adalah pertanyaan yang jelas untuk meminta bantuan mengisi formulir."},
];

export default function IrodoriElementaryOneLessonFifteenPage() {
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
  <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#6EA9A0]/40 hover:text-[#EAE6DD]"><ArrowLeft size={15}/> Kembali ke Dasar 1</Link>
  <header className="relative isolate overflow-hidden rounded-[28px] border border-[#397D76]/35 bg-gradient-to-br from-[#1F3936] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
   <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#83C8BC]/[0.08]">健</div>
   <div className="relative z-10">
    <p className="text-[9px] font-black tracking-[0.24em] text-[#91C8BE]">IRODORI • DASAR 1 A2 • PELAJARAN 15</p>
    <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Saya demam dan tenggorokan saya sakit.</h1>
    <p className="mt-2 text-sm font-semibold text-[#91C8BE]">熱があってのどが痛いんです</p>
    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar menjelaskan gejala, menyebutkan sejak kapan gejala muncul, memahami arahan sederhana di klinik, dan mengisi bagian yang diperlukan pada formulir pertanyaan.</p>
    <div className="mt-5 flex flex-wrap gap-2">
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Stethoscope size={14} className="text-[#91C8BE]"/>Komunikasi di klinik</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#91C8BE]"/>Menjelaskan waktu</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><FileText size={14} className="text-[#91C8BE]"/>Formulir pertanyaan</span>
    </div>
   </div>
  </header>

  <section className="rounded-2xl border border-[#397D76]/20 bg-[#1D2927]/80 p-4 md:p-5">
   <div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#91C8BE]"/><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2></div>
   <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Tiga target utama mengikuti target komunikasi resmi Irodori. Dua target terakhir menjadi latihan penguatan Fude.</p>
   <div className="mt-3 grid gap-2 sm:grid-cols-2">{canDos.map((item,index)=><article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#91C8BE]">{item.source} · 0{index+1}</p><p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#83BDB3]">KOSAKATA GEJALA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Ungkapan untuk menjelaskan keadaan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan ungkapan sederhana berikut untuk menjelaskan hal yang dirasakan. Contoh ini hanya latihan bahasa, bukan panduan untuk menilai kondisi kesehatan.</p></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{symptomRows.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-sm leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm leading-relaxed text-[#91C8BE]" romajiClassName="mt-1 text-xs italic text-[#A9A398]" translationClassName="mt-2 text-[10px] leading-4 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#83BDB3]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Berkomunikasi di klinik</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Dialog ditulis orisinal oleh Fude untuk melatih cara menjelaskan keluhan, menjawab pertanyaan waktu, dan memahami arahan petugas.</p></div>
   <div className="space-y-4">
    <IrodoriConversation title="Menjelaskan demam dan sakit tenggorokan" speakers={[doctor,visitorYui]} utterances={symptomConversation}/>
    <IrodoriConversation title="Menjelaskan keluhan lain" speakers={[doctor,visitorSota]} utterances={stomachConversation}/>
    <IrodoriConversation title="Berbicara di meja pendaftaran" speakers={[visitorYui,receptionist]} utterances={receptionConversation}/>
    <IrodoriConversation title="Memahami arahan dokter" speakers={[doctor,visitorSota]} utterances={waitingConversation}/>
    <IrodoriConversation title="Bertanya tentang formulir" speakers={[visitorYui,receptionist]} utterances={formConversation}/>
   </div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#83BDB3]">MENYEBUTKAN GEJALA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menggabungkan beberapa keadaan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan bentuk て untuk menghubungkan gejala, lalu akhiri dengan ～んです untuk menjelaskan keadaan kepada lawan bicara.</p></div>
   <div className="grid gap-3 sm:grid-cols-2">
    <article className="rounded-xl border border-[#397D76]/20 bg-[#1D2927]/80 p-4"><p className="font-mincho text-base leading-7 text-[#E4F1ED]">お腹が痛くて、吐き気がするんです。</p><p className="mt-1 text-xs text-[#A9A398]">Perut saya sakit dan saya merasa mual.</p><p className="mt-2 text-[10px] leading-5 text-[#91C8BE]">痛い → 痛くて · Menghubungkan dua keadaan.</p></article>
    <article className="rounded-xl border border-[#397D76]/20 bg-[#1D2927]/80 p-4"><p className="font-mincho text-base leading-7 text-[#E4F1ED]">熱があって、のどが痛いんです。</p><p className="mt-1 text-xs text-[#A9A398]">Saya demam dan tenggorokan saya sakit.</p><p className="mt-2 text-[10px] leading-5 text-[#91C8BE]">ある → あって · Menghubungkan dua gejala.</p></article>
   </div>
   <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#91C8BE]">PERTANYAAN WAKTU</p><p className="mt-2 font-mincho text-base text-[#F1EBDD]">いつからですか。</p><p className="mt-1 text-xs text-[#A9A398]">Sejak kapan?</p><p className="mt-3 font-mincho text-sm text-[#D3E9E3]">昨日からです。／おとといからです。</p><p className="mt-1 text-[10px] text-[#A9A398]">Sejak kemarin. / Sejak dua hari yang lalu.</p></div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#83BDB3]">ALUR DI KLINIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kosakata untuk memahami arahan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan kata yang digunakan petugas saat pendaftaran dan menunggu giliran.</p></div>
   <div className="grid gap-2 sm:grid-cols-5">{[["受付","うけつけ","Pendaftaran"],["問診票","もんしんひょう","Formulir pertanyaan"],["待合室","まちあいしつ","Ruang tunggu"],["診察室","しんさつしつ","Ruang pemeriksaan"],["会計","かいけい","Pembayaran"]].map(([jp,reading,meaning],index)=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="text-[9px] font-black text-[#91C8BE]">0{index+1}</p><p className="mt-2 font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#91C8BE]">{reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#83BDB3]">MEMBACA FORMULIR</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali bagian-bagian 問診票</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Formulir berikut hanya contoh fiktif untuk latihan bahasa. Tidak perlu memasukkan data pribadi sungguhan.</p></div>
   <article className="overflow-hidden rounded-2xl border border-[#397D76]/25 bg-[#1B2422]">
    <div className="border-b border-white/[0.08] bg-[#253633] px-4 py-3"><p className="text-[9px] font-black tracking-[0.16em] text-[#91C8BE]">FORMULIR LATIHAN · DATA FIKTIF</p><h3 className="mt-1 font-mincho text-xl font-bold text-[#F1EBDD]">問診票</h3><p className="mt-1 text-[10px] text-[#A9A398]">Formulir pertanyaan sebelum pemeriksaan</p></div>
    <div className="grid gap-2 p-4 sm:grid-cols-2">{formFields.map(item=><div key={item.label} className="rounded-lg border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-bold text-[#91C8BE]">{item.label} · {item.reading}</p><p className="mt-1 font-mincho text-sm text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p><p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{item.meaning}</p></div>)}</div>
    <p className="border-t border-white/[0.06] px-4 py-3 text-[10px] leading-5 text-[#A9A398]">Nama dan contoh gejala di atas sepenuhnya fiktif. Pada formulir sungguhan, tanyakan kepada petugas jika ada bagian yang tidak dipahami.</p>
   </article>
   <div className="rounded-xl border border-[#397D76]/20 bg-[#1D2927]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#91C8BE]">URUTAN SEDERHANA</p><p className="mt-2 font-mincho text-sm leading-7 text-[#E4F1ED]">受付 → 問診票に記入 → 待合室で待つ → 診察室へ</p><p className="mt-1 text-xs leading-5 text-[#A9A398]">Pendaftaran → mengisi formulir → menunggu di ruang tunggu → menuju ruang pemeriksaan.</p></div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#83BDB3]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima pola untuk menjelaskan keadaan dan instruksi</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Contoh dibuat untuk percakapan dan urusan administrasi klinik, bukan petunjuk diagnosis atau penggunaan obat.</p></div>
   {[
    {title:"01 · Menjelaskan keadaan atau gejala",pattern:"N／ナA-なんです · イA-いんです · V-る／V-た／V-ない ＋ んです",example:<>風邪なんです。<br/>のどが痛いんです。<br/>昨日から熱があるんです。</>,note:"～んです digunakan untuk menjelaskan situasi kepada lawan bicara. Kata benda dan kata sifat-na memakai なんです; kata sifat-i memakai いんです. Kata kerja menggunakan bentuk biasa sebelum んです."},
    {title:"02 · Menghubungkan beberapa gejala",pattern:"イA-くて、～ ／ V-て、～",example:<>お腹が痛くて、吐き気がするんです。<br/>熱があって、のども痛いんです。</>,note:"Bentuk て menghubungkan dua atau lebih keadaan. Untuk kata sifat-i, ubah い menjadi くて. Untuk kata kerja, gunakan bentuk て."},
    {title:"03 · Meminta seseorang tidak melakukan sesuatu",pattern:"V-ないでください",example:<>ここに名前を書かないでください。<br/>この欄には何も入れないでください。</>,note:"Pola ini digunakan untuk instruksi atau permintaan negatif. Hubungkan bentuk nai kata kerja dengan でください. Contoh: 書く → 書かないでください."},
    {title:"04 · Menyatakan urutan tindakan",pattern:"V-る前に、～ ／ V-たあと、～",example:<>記入する前に、説明を読んでください。<br/>問診票を書いたあと、受付に出してください。</>,note:"前に memakai bentuk kamus untuk menyatakan tindakan yang dilakukan sebelumnya. あと memakai bentuk ta untuk menyatakan tindakan yang sudah selesai."},
    {title:"05 · Menyatakan waktu atau situasi",pattern:"V-るとき ／ V-たとき ／ V-ないとき",example:<>病院に行くとき、受付で確認します。<br/>名前がわからないとき、質問してください。</>,note:"～とき berarti ketika atau pada saat. Untuk kata kerja, pola ini dapat memakai bentuk kamus, ta, atau nai sesuai waktu dan maksud kalimat."},
   ].map(item=><article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#83BDB3]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p><p className="mt-2 font-mincho text-base leading-7 text-[#C5E2DB]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>)}
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#83BDB3]">KANJI DAN KATA PENTING</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tulisan yang sering muncul pada konteks kesehatan</h2></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{kanjiWords.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#91C8BE]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#83BDB3]">SIMULASI INTERAKTIF</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan bahasa Jepang dalam situasi di klinik</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi: menjelaskan gejala, menyebutkan waktu, mengisi formulir, memahami arahan, dan bertanya.</p></div>
   {simulations.map((task,index)=>{const selected=simulationChoices[index];const isCorrect=simulationChecked[index]&&selected===task.answer;const isWrong=simulationChecked[index]&&selected!==task.answer;return <article key={task.title} className="space-y-3 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
    <div><p className="text-[9px] font-black tracking-[0.18em] text-[#83BDB3]">{task.title}</p><h3 className="mt-1 text-base font-black text-[#EAE6DD]">{task.heading}</h3><p className="mt-1 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p></div>
    <div className="rounded-xl border border-[#397D76]/20 bg-[#1D2927] p-4"><p className="font-mincho text-base leading-7 text-[#E4F1ED]"><JapaneseReading allowIndexFallback>{task.japanese}</JapaneseReading></p><p className="mt-1 text-[10px] text-[#91C8BE]">{task.translation}</p></div>
    <div className="grid gap-2">{task.options.map(option=><button key={option.key} type="button" disabled={Boolean(isCorrect)} aria-pressed={selected===option.key} onClick={()=>{setSimulationChoices(current=>({...current,[index]:option.key}));setSimulationChecked(current=>({...current,[index]:false}));}} className={"rounded-xl border p-3 text-left transition-colors "+(isCorrect&&option.key===task.answer?"border-emerald-500/50 bg-emerald-500/10":isWrong&&selected===option.key?"border-red-400/50 bg-red-400/10":selected===option.key?"border-[#83BDB3]/60 bg-[#397D76]/15":"border-white/[0.07] bg-black/10")}><p className="font-mincho text-sm text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></p><p className="mt-1 text-[10px] text-[#A9A398]">{option.meaning}</p></button>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" aria-live="polite" className="text-[10px] leading-5 text-[#A9A398]">{isCorrect?"Benar. "+task.explanation:isWrong?"Belum tepat. Coba pilih jawaban lain.":"Pilih satu jawaban, lalu periksa."}</p><button type="button" disabled={!selected||Boolean(isCorrect)} onClick={()=>setSimulationChecked(current=>({...current,[index]:true}))} className="rounded-lg bg-[#397D76] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#2B655F] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">{isCorrect?"Selesai":"Periksa"}</button></div>
   </article>})}
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#83BDB3]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban praktik harus benar untuk membuka evaluasi akhir.</p></div>
   <div className="space-y-3">{practiceTasks.map((task,index)=>{const selected=practiceAnswers[index];const isCorrect=selected===task.answer;return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#83BDB3]">LATIHAN {String(index+1).padStart(2,"0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{task.options.map(option=><button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected===option.key} onClick={()=>setPracticeAnswers(current=>({...current,[index]:option.key}))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors "+(practiceSubmitted&&option.key===task.answer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-200":practiceSubmitted&&selected===option.key?"border-red-400/50 bg-red-400/10 text-red-200":selected===option.key?"border-[#83BDB3]/60 bg-[#397D76]/15 text-[#F1EBDD]":"border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{practiceSubmitted&&<p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect?"font-bold text-emerald-300":"font-bold text-[#E7A1A1]"}>{isCorrect?"Benar. ":"Belum tepat. "}</span><JapaneseReading allowIndexFallback>{task.explanation}</JapaneseReading></p>}</article>})}</div>
   <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{practiceSubmitted?"Hasil praktik: "+practiceScore+" dari "+practiceTasks.length+" benar.":Object.keys(practiceAnswers).length+" dari "+practiceTasks.length+" pertanyaan dijawab."}</p>{practiceSubmitted?<button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#397D76]/35 px-4 py-2 text-xs font-bold text-[#B7DDD4]"><RefreshCw size={13}/> Ulangi praktik</button>:<button type="button" onClick={()=>setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length!==practiceTasks.length} className="rounded-lg bg-[#397D76] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa praktik</button>}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#83BDB3]">KUIS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p></div>
   <div className="space-y-3">{quizQuestions.map((question,index)=>{const selected=answers[index];const isCorrect=selected===question.answer;return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#83BDB3]">SOAL {String(index+1).padStart(2,"0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{question.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{question.options.map(option=><button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected===option.key} onClick={()=>setAnswers(current=>({...current,[index]:option.key}))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors "+(quizSubmitted&&option.key===question.answer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-200":quizSubmitted&&selected===option.key?"border-red-400/50 bg-red-400/10 text-red-200":selected===option.key?"border-[#83BDB3]/60 bg-[#397D76]/15 text-[#F1EBDD]":"border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{quizSubmitted&&<p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect?"font-bold text-emerald-300":"font-bold text-[#E7A1A1]"}>{isCorrect?"Benar. ":"Belum tepat. "}</span><JapaneseReading allowIndexFallback>{question.explanation}</JapaneseReading></p>}</article>})}</div>
   <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{quizSubmitted?"Nilai kuis: "+score+" dari "+quizQuestions.length+" benar.":Object.keys(answers).length+" dari "+quizQuestions.length+" pertanyaan dijawab."}</p>{quizSubmitted?<button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#397D76]/35 px-4 py-2 text-xs font-bold text-[#B7DDD4]"><RefreshCw size={13}/> Ulangi kuis</button>:<button type="button" onClick={()=>setQuizSubmitted(true)} disabled={Object.keys(answers).length!==quizQuestions.length} className="rounded-lg bg-[#397D76] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa jawaban</button>}</div>
  </section>

  <section className="rounded-2xl border border-[#397D76]/25 bg-gradient-to-br from-[#1D302D] to-[#191817] p-5 md:p-6">
   <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#91C8BE]"/><p className="text-[9px] font-black tracking-[0.2em] text-[#91C8BE]">CAN-DO CHECK</p></div>
   <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
   <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. Progres Dasar 1 tersimpan dalam jalur Irodori, terpisah dari Minna no Nihongo dan JLPT.</p>
   <div className="mt-4 space-y-3">{canDos.map((item,index)=><div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3"><p className="text-xs font-semibold leading-5 text-[#EAE6DD]"><span className="mr-2 text-[#91C8BE]">{String(index+1).padStart(2,"0")}</span>{item.text}</p><div className="mt-3 flex flex-wrap gap-2">{ratingOptions.map(option=><button key={option.value} type="button" disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete} aria-pressed={visibleRatings[item.id]===option.value} onClick={()=>{const next={...visibleRatings,[item.id]:option.value};setRatings(next);saveIrodoriSelfEvaluation(lessonId,next);}} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 "+(visibleRatings[item.id]===option.value?"border-[#83BDB3]/60 bg-[#397D76]/20 text-[#D3E9E3]":"border-white/[0.08] bg-[#24221F] text-[#A3A099]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div></div>)}</div>
   <div className="mt-5 flex flex-wrap items-center justify-between gap-3">{isCompleted?<span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/> Pelajaran selesai</span>:<button type="button" onClick={()=>completeIrodoriLesson(lessonId)} disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#397D76] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#2B655F] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/> Tandai pelajaran selesai</button>}
    <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#83BDB3]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
   </div>
   {(!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated)&&<p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian target komunikasi.</p>}
  </section>
  <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, formulir latihan, dan situasi komunikasi dibuat orisinal oleh Fude. Contoh kesehatan hanya untuk mempelajari bahasa Jepang dan bukan panduan medis.</p>
 </main>
 );
}
