"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Gift, Mail, RefreshCw, Users } from "lucide-react";
import IrodoriConversation, { type IrodoriUtterance } from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import { completeIrodoriLesson, saveIrodoriSelfEvaluation, useIrodoriProgress } from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const speakers = IRODORI_SPEAKERS;
const guestYui = { ...speakers.yui, name: "Yui", role: "Tamu" };
const hostSota = { ...speakers.sota, name: "Sota", role: "Tuan rumah" };
const friendAkiko = { ...speakers.akiko, name: "Akiko", role: "Teman" };
const lessonId = "elementary1-17";

const visitingHomeConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>ごめんください。</>,romaji:"Gomen kudasai.",translation:"Permisi, apakah ada orang di rumah?",audioFileName:"irodori-elementary1-17-a01-l01.mp3"},
{speakerId:"yui",japanese:<>はい。あ、ソウタさん。いらっしゃい。</>,romaji:"Hai. A, Souta-san. Irasshai.",translation:"Ya. Oh, Sota. Selamat datang.",audioFileName:"irodori-elementary1-17-a01-l02.mp3"},
{speakerId:"sota",japanese:<>こんにちは。おじゃまします。</>,romaji:"Konnichiwa. Ojamashimasu.",translation:"Selamat siang. Permisi, saya masuk.",audioFileName:"irodori-elementary1-17-a01-l03.mp3"},
{speakerId:"yui",japanese:<>どうぞ、こちらへ。くつはここで脱いでください。</>,romaji:"Douzo, kochira e. Kutsu wa koko de nuide kudasai.",translation:"Silakan lewat sini. Tolong lepas sepatu di sini.",audioFileName:"irodori-elementary1-17-a01-l04.mp3"},
];

const givingSouvenirConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>これ、お土産です。京都で買ったお菓子です。</>,romaji:"Kore, omiyage desu. Kyouto de katta okashi desu.",translation:"Ini oleh-oleh. Ini kue yang saya beli di Kyoto.",audioFileName:"irodori-elementary1-17-a02-l01.mp3"},
{speakerId:"sota",japanese:<>わあ、ありがとうございます。京都のお菓子なんですね。</>,romaji:"Waa, arigatou gozaimasu. Kyouto no okashi nan desu ne.",translation:"Wah, terima kasih. Jadi ini kue dari Kyoto, ya.",audioFileName:"irodori-elementary1-17-a02-l02.mp3"},
{speakerId:"yui",japanese:<>はい。よかったら、食べてください。</>,romaji:"Hai. Yokattara, tabete kudasai.",translation:"Ya. Silakan dicoba kalau berkenan.",audioFileName:"irodori-elementary1-17-a02-l03.mp3"},
{speakerId:"sota",japanese:<>いただきます。楽しみです。</>,romaji:"Itadakimasu. Tanoshimi desu.",translation:"Terima kasih, saya akan menikmatinya. Saya tidak sabar ingin mencoba.",audioFileName:"irodori-elementary1-17-a02-l04.mp3"},
];

const explainingKeepsakeConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>それは何ですか。かわいいですね。</>,romaji:"Sore wa nan desu ka? Kawaii desu ne.",translation:"Itu apa? Lucu, ya.",audioFileName:"irodori-elementary1-17-a03-l01.mp3"},
{speakerId:"yui",japanese:<>これは、兄がくれたお守りです。</>,romaji:"Kore wa, ani ga kureta omamori desu.",translation:"Ini adalah omamori yang diberikan kakak laki-laki saya.",audioFileName:"irodori-elementary1-17-a03-l02.mp3"},
{speakerId:"akiko",japanese:<>そうなんですね。いつも持っているんですか。</>,romaji:"Sou nan desu ne. Itsumo motte iru n desu ka?",translation:"Oh, begitu. Apakah selalu dibawa?",audioFileName:"irodori-elementary1-17-a03-l03.mp3"},
{speakerId:"yui",japanese:<>はい。旅行のときに、兄にもらったんです。</>,romaji:"Hai. Ryokou no toki ni, ani ni moratta n desu.",translation:"Ya. Saya menerimanya dari kakak saat bepergian.",audioFileName:"irodori-elementary1-17-a03-l04.mp3"},
];

const askingAboutBelongingsConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>そのかばん、すてきですね。どこで買ったんですか。</>,romaji:"Sono kaban, suteki desu ne. Doko de katta n desu ka?",translation:"Tas itu bagus. Di mana kamu membelinya?",audioFileName:"irodori-elementary1-17-a04-l01.mp3"},
{speakerId:"yui",japanese:<>これは、駅の近くの店で買ったかばんです。</>,romaji:"Kore wa, eki no chikaku no mise de katta kaban desu.",translation:"Ini tas yang saya beli di toko dekat stasiun.",audioFileName:"irodori-elementary1-17-a04-l02.mp3"},
{speakerId:"sota",japanese:<>そうですか。色もいいですね。</>,romaji:"Sou desu ka. Iro mo ii desu ne.",translation:"Begitu, ya. Warnanya juga bagus.",audioFileName:"irodori-elementary1-17-a04-l03.mp3"},
{speakerId:"yui",japanese:<>ありがとうございます。毎日使っています。</>,romaji:"Arigatou gozaimasu. Mainichi tsukatte imasu.",translation:"Terima kasih. Saya menggunakannya setiap hari.",audioFileName:"irodori-elementary1-17-a04-l04.mp3"},
];

const thankYouEmailConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>昨日は来てくれて、ありがとうございました。</>,romaji:"Kinou wa kite kurete, arigatou gozaimashita.",translation:"Terima kasih sudah datang kemarin.",audioFileName:"irodori-elementary1-17-a05-l01.mp3"},
{speakerId:"yui",japanese:<>こちらこそ、ごちそうさまでした。とても楽しかったです。</>,romaji:"Kochira koso, gochisousama deshita. Totemo tanoshikatta desu.",translation:"Saya juga berterima kasih atas jamuannya. Saya sangat senang.",audioFileName:"irodori-elementary1-17-a05-l02.mp3"},
{speakerId:"sota",japanese:<>また遊びに来てください。</>,romaji:"Mata asobi ni kite kudasai.",translation:"Silakan berkunjung lagi.",audioFileName:"irodori-elementary1-17-a05-l03.mp3"},
{speakerId:"yui",japanese:<>はい。ぜひ。また連絡します。</>,romaji:"Hai. Zehi. Mata renraku shimasu.",translation:"Tentu. Dengan senang hati. Saya akan menghubungi lagi.",audioFileName:"irodori-elementary1-17-a05-l04.mp3"},
];

const canDos=[
{id:"greet-when-visiting-home",source:"CAN-DO 61",text:"Bertukar salam sederhana ketika berkunjung ke rumah orang lain."},
{id:"explain-a-gift",source:"CAN-DO 62",text:"Menjelaskan secara singkat apa benda oleh-oleh yang diberikan."},
{id:"talk-about-belongings",source:"CAN-DO 63",text:"Menceritakan barang milik sendiri, misalnya tempat membeli atau orang yang memberikannya."},
{id:"write-thank-you-email",source:"CAN-DO 64",text:"Menulis email sederhana untuk mengucapkan terima kasih setelah berkunjung atau menerima undangan."},
{id:"describe-keepsake-story",source:"LATIHAN Fude",text:"Menjelaskan hubungan sebuah benda dengan orang yang memberikannya menggunakan klausa relatif sederhana."},
];

const vocabRows=[
["お土産","おみやげ · omiyage","Oleh-oleh"],
["お守り","おまもり · omamori","Omamori / benda kenangan pembawa keberuntungan"],
["飾り","かざり · kazari","Hiasan"],
["置物","おきもの · okimono","Benda pajangan"],
["人形","にんぎょう · ningyou","Boneka"],
["写真","しゃしん · shashin","Foto"],
["手紙","てがみ · tegami","Surat"],
["贈り物","おくりもの · okurimono","Hadiah"],
["プレゼント","プレゼント · purezento","Hadiah"],
["兄","あに · ani","Kakak laki-laki sendiri"],
["お兄さん","おにいさん · oniisan","Kakak laki-laki orang lain"],
["姉","あね · ane","Kakak perempuan sendiri"],
["お姉さん","おねえさん · oneesan","Kakak perempuan orang lain"],
["弟","おとうと · otouto","Adik laki-laki"],
["妹","いもうと · imouto","Adik perempuan"],
["両親","りょうしん · ryoushin","Kedua orang tua"],
["父","ちち · chichi","Ayah sendiri"],
["母","はは · haha","Ibu sendiri"],
["持って来る","もってくる · motte kuru","Membawa ke tempat pembicara"],
["くれる","くれる · kureru","Memberi kepada saya / pihak saya"],
["もらう","もらう · morau","Menerima"],
["買う","かう · kau","Membeli"],
["作る","つくる · tsukuru","Membuat"],
["招待する","しょうたいする · shoutai suru","Mengundang"],
["お礼","おれい · orei","Ucapan terima kasih"],
];

const kanjiWords=[
["お父さん","おとうさん · otousan","Ayah (sapaan untuk ayah orang lain)"],
["お母さん","おかあさん · okaasan","Ibu (sapaan untuk ibu orang lain)"],
["兄","あに · ani","Kakak laki-laki sendiri"],
["お兄さん","おにいさん · oniisan","Kakak laki-laki orang lain"],
["姉","あね · ane","Kakak perempuan sendiri"],
["お姉さん","おねえさん · oneesan","Kakak perempuan orang lain"],
["弟","おとうと · otouto","Adik laki-laki"],
["妹","いもうと · imouto","Adik perempuan"],
["夫","おっと · otto","Suami"],
["妻","つま · tsuma","Istri"],
["両親","りょうしん · ryoushin","Kedua orang tua"],
];

const emailParts=[
{label:"件名",reading:"けんめい · kenmei",meaning:"Subjek email",example:"昨日のお礼"},
{label:"あいさつ",reading:"aisatsu",meaning:"Salam pembuka",example:"こんにちは。"},
{label:"お礼",reading:"おれい · orei",meaning:"Ucapan terima kasih",example:"昨日はありがとうございました。"},
{label:"感想",reading:"かんそう · kansou",meaning:"Kesan setelah berkunjung",example:"とても楽しかったです。"},
{label:"結び",reading:"musubi",meaning:"Kalimat penutup",example:"また会いましょう。"},
];

const ratingOptions:{value:IrodoriRating;label:string}[]=[
{value:1,label:"★☆☆ Masih perlu latihan"},
{value:2,label:"★★☆ Sudah bisa"},
{value:3,label:"★★★ Bisa dengan baik"},
];

type Task={prompt:ReactNode;options:{key:string;label:ReactNode}[];answer:string;explanation:ReactNode};

const practiceTasks:Task[]=[
{prompt:<>Kalimat 「京都で買ったお菓子」 berarti …</>,options:[{key:"a",label:"Kue yang dibeli di Kyoto."},{key:"b",label:"Kue yang akan dibeli besok."},{key:"c",label:"Kue yang dibuat di rumah."}],answer:"a",explanation:<>買った adalah bentuk biasa lampau dari 買いました dan menjelaskan kata benda お菓子.</>},
{prompt:<>Pilih kalimat yang berarti “mug yang saya terima dari teman”.</>,options:[{key:"a",label:"友だちにもらったマグカップ"},{key:"b",label:"友だちにあげたマグカップ"},{key:"c",label:"友だちが買うマグカップ"}],answer:"a",explanation:<>人にもらいます berarti menerima sesuatu dari seseorang. Partikel に dapat bermakna dari dalam pola ini.</>},
{prompt:<>Dalam 「兄がくれたお守り」, siapa yang memberi omamori?</>,options:[{key:"a",label:"Kakak laki-laki saya."},{key:"b",label:"Saya sendiri."},{key:"c",label:"Teman saya."}],answer:"a",explanation:<>くれます digunakan saat orang lain memberikan sesuatu kepada saya atau pihak saya. Pemberi ditandai dengan が.</>},
{prompt:<>Ungkapan yang tepat saat memasuki rumah orang lain adalah …</>,options:[{key:"a",label:"おじゃまします。"},{key:"b",label:"おかえりなさい。"},{key:"c",label:"いただきます。"}],answer:"a",explanation:<>おじゃまします adalah ungkapan sopan saat masuk atau berkunjung ke rumah orang lain.</>},
{prompt:<>Tujuan utama email 「昨日はありがとうございました」 adalah …</>,options:[{key:"a",label:"Mengucapkan terima kasih atas sesuatu yang terjadi kemarin."},{key:"b",label:"Mengundang seseorang untuk datang besok."},{key:"c",label:"Menanyakan arah ke stasiun."}],answer:"a",explanation:<>ありがとうございました adalah ungkapan terima kasih yang sopan untuk bantuan atau kebaikan yang sudah diterima.</>},
{prompt:<>Apa arti 「両親」?</>,options:[{key:"a",label:"Kedua orang tua."},{key:"b",label:"Kakak dan adik."},{key:"c",label:"Teman sekelas."}],answer:"a",explanation:<>両親（りょうしん）berarti ayah dan ibu atau kedua orang tua.</>},
];

const quizQuestions:Task[]=[
{prompt:<>Apa arti 「お土産」?</>,options:[{key:"a",label:"Oleh-oleh."},{key:"b",label:"Ruang tamu."},{key:"c",label:"Kakak perempuan."}],answer:"a",explanation:<>お土産（おみやげ）adalah oleh-oleh yang dibawa dari suatu tempat atau perjalanan.</>},
{prompt:<>Pilih kalimat yang menjelaskan benda yang dibuat sendiri.</>,options:[{key:"a",label:"私が作った小物です。"},{key:"b",label:"私に作った小物です。"},{key:"c",label:"私を作った小物です。"}],answer:"a",explanation:<>私が作った menjelaskan 小物, yaitu benda kecil yang dibuat oleh saya.</>},
{prompt:<>「友だちにもらった時計」 berarti …</>,options:[{key:"a",label:"Jam yang saya terima dari teman."},{key:"b",label:"Jam yang saya berikan kepada teman."},{key:"c",label:"Jam yang dibeli teman untuk dirinya."}],answer:"a",explanation:<>友だちにもらった berarti diterima dari teman.</>},
{prompt:<>Pilih pola untuk mengatakan “kakak memberikan benda itu kepada saya”.</>,options:[{key:"a",label:"兄がくれました。"},{key:"b",label:"兄にもらいました。"},{key:"c",label:"兄にあげました。"}],answer:"a",explanation:<>兄がくれました menekankan kakak sebagai pemberi kepada saya atau pihak saya.</>},
{prompt:<>Apa arti 「おじゃまします」 ketika berkunjung ke rumah?</>,options:[{key:"a",label:"Permisi, saya masuk / berkunjung."},{key:"b",label:"Selamat tinggal."},{key:"c",label:"Selamat makan."}],answer:"a",explanation:<>おじゃまします adalah ungkapan sopan saat memasuki rumah orang lain.</>},
{prompt:<>Apa arti 「どうぞ、召し上がってください」?</>,options:[{key:"a",label:"Silakan dinikmati / dimakan."},{key:"b",label:"Silakan pulang."},{key:"c",label:"Tolong tulis surat."}],answer:"a",explanation:<>召し上がってください adalah bentuk sopan untuk mempersilakan seseorang makan atau menikmati hidangan.</>},
{prompt:<>Bagian email 「昨日はありがとうございました」 merupakan …</>,options:[{key:"a",label:"Ucapan terima kasih."},{key:"b",label:"Alamat pengirim."},{key:"c",label:"Daftar belanja."}],answer:"a",explanation:<>Kalimat tersebut merupakan ucapan terima kasih atas sesuatu yang terjadi kemarin.</>},
{prompt:<>Apa arti 「両親」?</>,options:[{key:"a",label:"Kedua orang tua."},{key:"b",label:"Dua teman."},{key:"c",label:"Dua tetangga."}],answer:"a",explanation:<>両親 berarti ayah dan ibu.</>},
{prompt:<>Pilih kalimat yang berarti “foto yang diambil kakak saya”.</>,options:[{key:"a",label:"兄が撮った写真"},{key:"b",label:"兄にもらった写真"},{key:"c",label:"兄に見せた写真"}],answer:"a",explanation:<>兄が撮った menjelaskan foto yang diambil oleh kakak.</>},
{prompt:<>Kalimat penutup email yang ramah adalah …</>,options:[{key:"a",label:"また会いましょう。"},{key:"b",label:"どこで買いましたか。"},{key:"c",label:"これは何ですか。"}],answer:"a",explanation:<>また会いましょう berarti mari bertemu lagi dan cocok sebagai penutup ramah.</>},
];

const simulations=[
{title:"01 · Berkunjung ke rumah",heading:"Mengucapkan salam saat tiba",prompt:"Kamu tiba di rumah teman. Pilih ungkapan pembuka yang sesuai sebelum masuk.",japanese:<>ごめんください。おじゃまします。</>,translation:"Permisi. Saya masuk, ya.",options:[{key:"a",label:"ごめんください。おじゃまします。",meaning:"Salam saat tiba dan masuk ke rumah orang lain."},{key:"b",label:"いただきます。",meaning:"Ungkapan sebelum makan."},{key:"c",label:"おかえりなさい。",meaning:"Ungkapan untuk menyambut orang yang pulang."}],answer:"a",explanation:"ごめんください digunakan untuk memanggil dari depan rumah; おじゃまします diucapkan saat masuk."},
{title:"02 · Memberikan oleh-oleh",heading:"Menjelaskan hadiah sederhana",prompt:"Kamu membawa kue yang dibeli di kota yang kamu kunjungi. Jelaskan benda itu kepada tuan rumah.",japanese:<>これ、京都で買ったお菓子です。</>,translation:"Ini kue yang saya beli di Kyoto.",options:[{key:"a",label:"これ、京都で買ったお菓子です。",meaning:"Menjelaskan jenis benda dan tempat membelinya."},{key:"b",label:"これ、京都に行った人です。",meaning:"Berarti orang yang pergi ke Kyoto."},{key:"c",label:"これ、京都で買いますか。",meaning:"Menanyakan apakah membeli di Kyoto."}],answer:"a",explanation:"京都で買った menerangkan お菓子: kue yang dibeli di Kyoto."},
{title:"03 · Menjelaskan barang pribadi",heading:"Menceritakan siapa yang memberi",prompt:"Teman bertanya tentang omamori yang kamu bawa. Benda itu diberikan oleh kakak laki-lakimu.",japanese:<>これは、兄がくれたお守りです。</>,translation:"Ini omamori yang diberikan kakak laki-laki saya.",options:[{key:"a",label:"これは、兄がくれたお守りです。",meaning:"兄がくれた menjelaskan pemberi benda."},{key:"b",label:"これは、兄にもらった人です。",meaning:"Kalimat ini menyebut orang, bukan benda."},{key:"c",label:"これは、兄をくれたお守りです。",meaning:"Partikel tidak tepat."}],answer:"a",explanation:"くれます digunakan ketika orang lain memberikan sesuatu kepada saya atau pihak saya."},
{title:"04 · Menulis email terima kasih",heading:"Membalas undangan teman",prompt:"Kamu ingin mengucapkan terima kasih karena telah diundang ke rumah teman kemarin.",japanese:<>昨日はありがとうございました。とても楽しかったです。</>,translation:"Terima kasih untuk kemarin. Saya sangat senang.",options:[{key:"a",label:"昨日はありがとうございました。とても楽しかったです。",meaning:"Berterima kasih dan menyampaikan kesan."},{key:"b",label:"明日はどこへ行きますか。",meaning:"Menanyakan rencana besok."},{key:"c",label:"これは兄がくれた物です。",meaning:"Menjelaskan benda pemberian kakak."}],answer:"a",explanation:"Ucapan terima kasih dapat diikuti kesan singkat tentang kunjungan."},
{title:"05 · Menjelaskan benda kenangan",heading:"Menjelaskan asal sebuah benda",prompt:"Kamu ingin mengatakan bahwa foto yang sedang ditunjukkan diambil oleh kakak perempuanmu.",japanese:<>姉が撮った写真です。</>,translation:"Ini foto yang diambil kakak perempuan saya.",options:[{key:"a",label:"姉が撮った写真です。",meaning:"姉が撮った menerangkan 写真."},{key:"b",label:"姉にもらった写真です。",meaning:"Berarti foto yang diterima dari kakak."},{key:"c",label:"姉に撮らせた写真です。",meaning:"Bukan ungkapan yang ditargetkan."}],answer:"a",explanation:"Klausa 姉が撮った menjelaskan kata benda 写真."},
];

export default function IrodoriElementaryOneLessonSeventeenPage() {
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
  <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#C5A46D]/40 hover:text-[#EAE6DD]"><ArrowLeft size={15}/> Kembali ke Elementary 1</Link>
  <header className="relative isolate overflow-hidden rounded-[28px] border border-[#8A7044]/35 bg-gradient-to-br from-[#403520] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
   <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D8BC82]/[0.08]">贈</div>
   <div className="relative z-10">
    <p className="text-[9px] font-black tracking-[0.24em] text-[#D8BC82]">IRODORI • ELEMENTARY 1 A2 • LESSON 17</p>
    <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">This is a personal amulet my older brother gave me.</h1>
    <p className="mt-2 text-sm font-semibold text-[#D8BC82]">兄がくれたお守りです</p>
    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar bertamu ke rumah orang lain, memberikan oleh-oleh, menjelaskan asal-usul barang pribadi, serta menulis email terima kasih sederhana.</p>
    <div className="mt-5 flex flex-wrap gap-2">
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#D8BC82]"/>Hubungan sosial</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Gift size={14} className="text-[#D8BC82]"/>Oleh-oleh dan barang</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Mail size={14} className="text-[#D8BC82]"/>Email terima kasih</span>
    </div>
   </div>
  </header>

  <section className="rounded-2xl border border-[#8A7044]/20 bg-[#282319]/80 p-4 md:p-5">
   <div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#D8BC82]"/><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2></div>
   <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target pertama mengikuti Can-do resmi Irodori. Target terakhir menjadi latihan penguatan Fude.</p>
   <div className="mt-3 grid gap-2 sm:grid-cols-2">{canDos.map((item,index)=><article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#D8BC82]">{item.source} · 0{index+1}</p><p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C9AD76]">KOSAKATA KELUARGA DAN HADIAH</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Benda, oleh-oleh, dan anggota keluarga</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan perbedaan kata untuk menyebut anggota keluarga sendiri dan keluarga orang lain.</p></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{vocabRows.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#D8BC82]">{reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C9AD76]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Bertamu, memberi hadiah, dan berterima kasih</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan ungkapan bertamu dan cara menjelaskan siapa yang membuat, membeli, atau memberikan sebuah benda.</p></div>
   <div className="space-y-4">
    <IrodoriConversation title="Bertamu ke rumah teman" speakers={[hostSota,guestYui]} utterances={visitingHomeConversation}/>
    <IrodoriConversation title="Memberikan oleh-oleh" speakers={[guestYui,hostSota]} utterances={givingSouvenirConversation}/>
    <IrodoriConversation title="Menjelaskan benda pemberian kakak" speakers={[friendAkiko,guestYui]} utterances={explainingKeepsakeConversation}/>
    <IrodoriConversation title="Bertanya tentang barang pribadi" speakers={[hostSota,guestYui]} utterances={askingAboutBelongingsConversation}/>
    <IrodoriConversation title="Mengucapkan terima kasih setelah berkunjung" speakers={[hostSota,guestYui]} utterances={thankYouEmailConversation}/>
   </div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C9AD76]">UNGKAPAN SAAT BERTAMU</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Salam sederhana ketika berkunjung</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan ungkapan berikut pada urutan yang sesuai. Kebiasaan bertamu dapat berbeda menurut keluarga dan situasi.</p></div>
   <div className="grid gap-2 sm:grid-cols-2">{[
    ["ごめんください。","Gomen kudasai.","Permisi, apakah ada orang di rumah?","Saat tiba di depan rumah."],
    ["おじゃまします。","Ojamashimasu.","Permisi, saya masuk / berkunjung.","Saat masuk ke rumah."],
    ["おじゃましました。","Ojamashimashita.","Terima kasih, saya pamit.","Saat berpamitan setelah berkunjung."],
    ["ごちそうさまでした。","Gochisousama deshita.","Terima kasih atas hidangannya.","Setelah selesai menikmati hidangan."],
   ].map(([jp,reading,meaning,context])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#D8BC82]">{reading}</p><p className="mt-2 text-xs text-[#C8C2B8]">{meaning}</p><p className="mt-1 text-[10px] text-[#A9A398]">{context}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C9AD76]">MENJELASKAN OLEH-OLEH</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Jelaskan benda yang kamu berikan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Klausa dengan bentuk biasa dapat diletakkan sebelum kata benda untuk menjelaskan benda tersebut.</p></div>
   <div className="grid gap-3 sm:grid-cols-3">{[
    ["私が作った小物です。","Watashi ga tsukutta komono desu.","Ini benda kecil yang saya buat."],
    ["京都で買ったお菓子です。","Kyouto de katta okashi desu.","Ini kue yang saya beli di Kyoto."],
    ["ネパールから持って来た飾りです。","Nepaaru kara motte kita kazari desu.","Ini hiasan yang saya bawa dari Nepal."],
   ].map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-[#8A7044]/20 bg-[#282319]/80 p-4"><p className="font-mincho text-sm leading-7 text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#D8BC82]">{reading}</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">{meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C9AD76]">MENCERITAKAN BARANG PRIBADI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Siapa yang memberi benda itu?</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">もらいます dipakai dari sudut pandang orang yang menerima. くれます dipakai ketika orang lain memberi kepada saya atau pihak saya.</p></div>
   <div className="grid gap-3 sm:grid-cols-2">
    <article className="rounded-xl border border-[#8A7044]/20 bg-[#282319]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#D8BC82]">MENERIMA</p><p className="mt-3 font-mincho text-base leading-7 text-[#F1EBDD]">友だちに時計をもらいました。</p><p className="mt-1 text-xs text-[#A9A398]">Saya menerima jam dari teman.</p><p className="mt-2 text-[10px] leading-5 text-[#D8BC82]">Penerima menjadi sudut pandang kalimat; に menunjukkan pemberi.</p></article>
    <article className="rounded-xl border border-[#8A7044]/20 bg-[#282319]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#D8BC82]">MEMBERI KEPADA SAYA</p><p className="mt-3 font-mincho text-base leading-7 text-[#F1EBDD]">兄が時計をくれました。</p><p className="mt-1 text-xs text-[#A9A398]">Kakak laki-laki saya memberi saya jam.</p><p className="mt-2 text-[10px] leading-5 text-[#D8BC82]">が menunjukkan orang yang memberi kepada saya atau pihak saya.</p></article>
   </div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C9AD76]">EMAIL TERIMA KASIH</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tulis pesan singkat setelah berkunjung</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Email sederhana dapat berisi salam, ucapan terima kasih, kesan, dan kalimat penutup.</p></div>
   <article className="overflow-hidden rounded-2xl border border-[#8A7044]/25 bg-[#211F1A]">
    <div className="border-b border-white/[0.08] bg-[#342D20] px-4 py-3"><p className="text-[9px] font-black tracking-[0.16em] text-[#D8BC82]">CONTOH EMAIL · LATIHAN</p><h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">昨日のお礼</h3><p className="mt-1 text-[10px] text-[#A9A398]">Subjek: Terima kasih untuk kemarin</p></div>
    <div className="space-y-3 p-4"><p className="text-xs leading-6 text-[#C8C2B8]">ソウタさん</p><p className="font-mincho text-sm leading-7 text-[#F1EBDD]">こんにちは。<br/>昨日は招待してくれて、ありがとうございました。<br/>料理もとてもおいしかったです。とても楽しかったです。<br/>また会いましょう。</p><p className="text-xs text-[#C8C2B8]">ユイ</p><p className="border-t border-white/[0.07] pt-3 text-[10px] leading-5 text-[#A9A398]">Email ini berisi salam pembuka, terima kasih atas undangan, kesan setelah berkunjung, dan penutup yang ramah.</p></div>
   </article>
   <div className="grid gap-2 sm:grid-cols-2">{emailParts.map(item=><article key={item.label} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="text-[9px] font-bold text-[#D8BC82]">{item.label} · {item.reading}</p><p className="mt-1 text-xs text-[#C8C2B8]">{item.meaning}</p><p className="mt-1 font-mincho text-sm text-[#F1EBDD]">{item.example}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C9AD76]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tiga pola untuk menjelaskan benda dan pemberian</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan bentuk kata kerja biasa sebelum kata benda, serta perbedaan sudut pandang antara menerima dan memberi.</p></div>
   {[
    {title:"01 · Klausa relatif dengan bentuk biasa lampau",pattern:"V-た ＋ N",example:<>京都で買ったお菓子です。<br/>私が作った小物です。</>,note:"Letakkan klausa bentuk biasa sebelum kata benda yang dijelaskan. Untuk kejadian lampau yang sudah selesai, gunakan bentuk ta: 買いました → 買った; 作りました → 作った. Seluruh klausa menjelaskan kata benda setelahnya."},
    {title:"02 · Menerima sesuatu dari seseorang",pattern:"[人] に [物] を もらいます",example:<>誕生日に、友だちに本をもらいました。</>,note:"もらいます berarti menerima sesuatu. Partikel に menunjukkan pemberi dan dapat diganti から dalam pola ini: 友だちから本をもらいました."},
    {title:"03 · Seseorang memberi kepada saya / pihak saya",pattern:"[人] が [物] を くれます",example:<>兄がこの写真をくれました。<br/>これは、兄がくれた写真です。</>,note:"くれます menunjukkan orang lain memberi sesuatu kepada saya atau orang dekat dalam kelompok saya. Partikel が menandai pemberi. Dalam contoh kedua, 兄がくれた menerangkan 写真."},
   ].map(item=><article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#C9AD76]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]">{item.pattern}</p><p className="mt-2 font-mincho text-base leading-7 text-[#E5D3A8]">{item.example}</p><p className="mt-2 text-xs leading-6 text-[#A9A398]">{item.note}</p></article>)}
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C9AD76]">KANJI DAN KATA PENTING</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kata untuk anggota keluarga</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Bahasa Jepang membedakan penyebutan keluarga sendiri dan keluarga orang lain. Pelajari pasangan kata berikut.</p></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{kanjiWords.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="font-mincho text-lg text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#D8BC82]">{reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C9AD76]">SIMULASI INTERAKTIF</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan bahasa Jepang dalam situasi sehari-hari</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi tentang bertamu, memberi oleh-oleh, menjelaskan barang, dan menulis email.</p></div>
   {simulations.map((task,index)=>{const selected=simulationChoices[index];const isCorrect=simulationChecked[index]&&selected===task.answer;const isWrong=simulationChecked[index]&&selected!==task.answer;return <article key={task.title} className="space-y-3 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
    <div><p className="text-[9px] font-black tracking-[0.18em] text-[#C9AD76]">{task.title}</p><h3 className="mt-1 text-base font-black text-[#EAE6DD]">{task.heading}</h3><p className="mt-1 text-xs leading-6 text-[#A9A398]">{task.prompt}</p></div>
    <div className="rounded-xl border border-[#8A7044]/20 bg-[#282319] p-4"><p className="font-mincho text-base leading-7 text-[#F1EBDD]">{task.japanese}</p><p className="mt-1 text-[10px] text-[#D8BC82]">{task.translation}</p></div>
    <div className="grid gap-2">{task.options.map(option=><button key={option.key} type="button" disabled={Boolean(isCorrect)} aria-pressed={selected===option.key} onClick={()=>{setSimulationChoices(current=>({...current,[index]:option.key}));setSimulationChecked(current=>({...current,[index]:false}));}} className={"rounded-xl border p-3 text-left transition-colors "+(isCorrect&&option.key===task.answer?"border-emerald-500/50 bg-emerald-500/10":isWrong&&selected===option.key?"border-red-400/50 bg-red-400/10":selected===option.key?"border-[#D8BC82]/60 bg-[#8A7044]/15":"border-white/[0.07] bg-black/10")}><p className="font-mincho text-sm text-[#F1EBDD]">{option.label}</p><p className="mt-1 text-[10px] text-[#A9A398]">{option.meaning}</p></button>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" aria-live="polite" className="text-[10px] leading-5 text-[#A9A398]">{isCorrect?"Benar. "+task.explanation:isWrong?"Belum tepat. Coba pilih jawaban lain.":"Pilih satu jawaban, lalu periksa."}</p><button type="button" disabled={!selected||Boolean(isCorrect)} onClick={()=>setSimulationChecked(current=>({...current,[index]:true}))} className="rounded-lg bg-[#8A7044] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#705A37] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">{isCorrect?"Selesai":"Periksa"}</button></div>
   </article>})}
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C9AD76]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban praktik harus benar untuk membuka evaluasi akhir.</p></div>
   <div className="space-y-3">{practiceTasks.map((task,index)=>{const selected=practiceAnswers[index];const isCorrect=selected===task.answer;return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#C9AD76]">PRACTICE {String(index+1).padStart(2,"0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">{task.prompt}</h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{task.options.map(option=><button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected===option.key} onClick={()=>setPracticeAnswers(current=>({...current,[index]:option.key}))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors "+(practiceSubmitted&&option.key===task.answer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-200":practiceSubmitted&&selected===option.key?"border-red-400/50 bg-red-400/10 text-red-200":selected===option.key?"border-[#D8BC82]/60 bg-[#8A7044]/15 text-[#F1EBDD]":"border-white/[0.07] bg-black/15 text-[#A9A398]")}>{option.label}</button>)}</div>{practiceSubmitted&&<p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect?"font-bold text-emerald-300":"font-bold text-[#E7A1A1]"}>{isCorrect?"Benar. ":"Belum tepat. "}</span>{task.explanation}</p>}</article>})}</div>
   <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{practiceSubmitted?"Hasil praktik: "+practiceScore+" dari "+practiceTasks.length+" benar.":Object.keys(practiceAnswers).length+" dari "+practiceTasks.length+" pertanyaan dijawab."}</p>{practiceSubmitted?<button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#8A7044]/35 px-4 py-2 text-xs font-bold text-[#E5D3A8]"><RefreshCw size={13}/> Ulangi praktik</button>:<button type="button" onClick={()=>setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length!==practiceTasks.length} className="rounded-lg bg-[#8A7044] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa praktik</button>}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C9AD76]">KUIS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p></div>
   <div className="space-y-3">{quizQuestions.map((question,index)=>{const selected=answers[index];const isCorrect=selected===question.answer;return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#C9AD76]">QUESTION {String(index+1).padStart(2,"0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]">{question.prompt}</h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{question.options.map(option=><button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected===option.key} onClick={()=>setAnswers(current=>({...current,[index]:option.key}))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors "+(quizSubmitted&&option.key===question.answer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-200":quizSubmitted&&selected===option.key?"border-red-400/50 bg-red-400/10 text-red-200":selected===option.key?"border-[#D8BC82]/60 bg-[#8A7044]/15 text-[#F1EBDD]":"border-white/[0.07] bg-black/15 text-[#A9A398]")}>{option.label}</button>)}</div>{quizSubmitted&&<p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect?"font-bold text-emerald-300":"font-bold text-[#E7A1A1]"}>{isCorrect?"Benar. ":"Belum tepat. "}</span>{question.explanation}</p>}</article>})}</div>
   <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{quizSubmitted?"Nilai kuis: "+score+" dari "+quizQuestions.length+" benar.":Object.keys(answers).length+" dari "+quizQuestions.length+" pertanyaan dijawab."}</p>{quizSubmitted?<button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#8A7044]/35 px-4 py-2 text-xs font-bold text-[#E5D3A8]"><RefreshCw size={13}/> Ulangi kuis</button>:<button type="button" onClick={()=>setQuizSubmitted(true)} disabled={Object.keys(answers).length!==quizQuestions.length} className="rounded-lg bg-[#8A7044] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa jawaban</button>}</div>
  </section>

  <section className="rounded-2xl border border-[#8A7044]/25 bg-gradient-to-br from-[#302819] to-[#191817] p-5 md:p-6">
   <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#D8BC82]"/><p className="text-[9px] font-black tracking-[0.2em] text-[#D8BC82]">CAN-DO CHECK</p></div>
   <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
   <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. Progres Elementary 1 tersimpan dalam jalur Irodori, terpisah dari Minna no Nihongo dan JLPT.</p>
   <div className="mt-4 space-y-3">{canDos.map((item,index)=><div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3"><p className="text-xs font-semibold leading-5 text-[#EAE6DD]"><span className="mr-2 text-[#D8BC82]">{String(index+1).padStart(2,"0")}</span>{item.text}</p><div className="mt-3 flex flex-wrap gap-2">{ratingOptions.map(option=><button key={option.value} type="button" disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete} aria-pressed={visibleRatings[item.id]===option.value} onClick={()=>{const next={...visibleRatings,[item.id]:option.value};setRatings(next);saveIrodoriSelfEvaluation(lessonId,next);}} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 "+(visibleRatings[item.id]===option.value?"border-[#D8BC82]/60 bg-[#8A7044]/20 text-[#F1EBDD]":"border-white/[0.08] bg-[#24221F] text-[#A3A099]")}>{option.label}</button>)}</div></div>)}</div>
   <div className="mt-5 flex flex-wrap items-center justify-between gap-3">{isCompleted?<span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/> Pelajaran selesai</span>:<button type="button" onClick={()=>completeIrodoriLesson(lessonId)} disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#8A7044] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#705A37] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/> Tandai pelajaran selesai</button>}
    <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#D8BC82]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
   </div>
   {(!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated)&&<p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian Can-do.</p>}
  </section>
  <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, contoh email, dan situasi latihan dibuat orisinal oleh Fude untuk melatih komunikasi tentang kunjungan, hadiah, barang pribadi, dan ucapan terima kasih.</p>
 </main>
 );
}
