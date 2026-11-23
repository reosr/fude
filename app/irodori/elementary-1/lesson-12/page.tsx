"use client";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, RefreshCw, Users } from "lucide-react";
import IrodoriConversation, { type IrodoriUtterance } from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import JapaneseReading from "@/components/JapaneseReading";
import JapaneseVocabularyReading from "@/components/JapaneseVocabularyReading";
import { formatGrammarNotation } from "@/lib/japanese-text";
import { completeIrodoriLesson, saveIrodoriSelfEvaluation, useIrodoriProgress } from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const speakers = IRODORI_SPEAKERS;
const lessonId = "elementary1-12";
const appearanceConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>そのお弁当、おいしそうですね。</>,romaji:"Sono obentou, oishisou desu ne.",translation:"Bento itu kelihatannya enak, ya.",audioFileName:"irodori-elementary1-12-a01-l01.mp3"},
{speakerId:"akiko",japanese:<>ありがとうございます。朝、駅の近くで買いました。</>,romaji:"Arigatou gozaimasu. Asa, eki no chikaku de kaimashita.",translation:"Terima kasih. Tadi pagi saya membelinya di dekat stasiun.",audioFileName:"irodori-elementary1-12-a01-l02.mp3"},
{speakerId:"yui",japanese:<>卵焼きも入っていますね。</>,romaji:"Tamagoyaki mo haitte imasu ne.",translation:"Ada tamagoyaki juga, ya.",audioFileName:"irodori-elementary1-12-a01-l03.mp3"},
{speakerId:"akiko",japanese:<>はい。色もきれいで、おいしいですよ。</>,romaji:"Hai. Iro mo kirei de, oishii desu yo.",translation:"Ya. Warnanya juga cantik dan rasanya enak.",audioFileName:"irodori-elementary1-12-a01-l04.mp3"},
];
const tasteAppearanceConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>わあ、それは辛そうな料理ですね。</>,romaji:"Waa, sore wa karasou na ryouri desu ne.",translation:"Wah, masakan itu kelihatannya pedas.",audioFileName:"irodori-elementary1-12-a02-l01.mp3"},
{speakerId:"yui",japanese:<>これは野菜のカレーです。でも、あまり辛くないですよ。</>,romaji:"Kore wa yasai no karee desu. Demo, amari karakunai desu yo.",translation:"Ini kare sayuran. Rasanya tidak terlalu pedas, kok.",audioFileName:"irodori-elementary1-12-a02-l02.mp3"},
{speakerId:"sota",japanese:<>そうですか。いいにおいですね。</>,romaji:"Sou desu ka. Ii nioi desu ne.",translation:"Oh, begitu. Aromanya enak, ya.",audioFileName:"irodori-elementary1-12-a02-l03.mp3"},
{speakerId:"yui",japanese:<>よかったら、食べてみてください。</>,romaji:"Yokattara, tabete mite kudasai.",translation:"Kalau mau, silakan coba.",audioFileName:"irodori-elementary1-12-a02-l04.mp3"},
];
const tryingFoodConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>よかったら、この卵焼き、食べてみてください。</>,romaji:"Yokattara, kono tamagoyaki, tabete mite kudasai.",translation:"Kalau mau, silakan coba tamagoyaki ini.",audioFileName:"irodori-elementary1-12-a03-l01.mp3"},
{speakerId:"kenji",japanese:<>ありがとうございます。いただきます。</>,romaji:"Arigatou gozaimasu. Itadakimasu.",translation:"Terima kasih, saya coba ya.",audioFileName:"irodori-elementary1-12-a03-l02.mp3"},
{speakerId:"akiko",japanese:<>どうですか。</>,romaji:"Dou desu ka?",translation:"Bagaimana rasanya?",audioFileName:"irodori-elementary1-12-a03-l03.mp3"},
{speakerId:"kenji",japanese:<>甘くて、おいしいですね。もう一ついただきます。</>,romaji:"Amakute, oishii desu ne. Mou hitotsu itadakimasu.",translation:"Manis dan enak, ya. Saya ambil satu lagi, ya.",audioFileName:"irodori-elementary1-12-a03-l04.mp3"},
];
const tasteFeedbackConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>このサラダ、食べてみますか。</>,romaji:"Kono sarada, tabete mimasu ka?",translation:"Mau mencoba salad ini?",audioFileName:"irodori-elementary1-12-a04-l01.mp3"},
{speakerId:"sota",japanese:<>はい。ありがとうございます。</>,romaji:"Hai. Arigatou gozaimasu.",translation:"Ya. Terima kasih.",audioFileName:"irodori-elementary1-12-a04-l02.mp3"},
{speakerId:"yui",japanese:<>味はどうですか。</>,romaji:"Aji wa dou desu ka?",translation:"Bagaimana rasanya?",audioFileName:"irodori-elementary1-12-a04-l03.mp3"},
{speakerId:"sota",japanese:<>すっぱくて、ちょっと苦手です。でも、新しい味ですね。</>,romaji:"Suppakute, chotto nigate desu. Demo, atarashii aji desu ne.",translation:"Rasanya asam dan agak kurang cocok buat saya. Tapi, rasanya unik juga.",audioFileName:"irodori-elementary1-12-a04-l04.mp3"},
];
const ingredientsConversation: IrodoriUtterance[] = [
{speakerId:"kenji",japanese:<>これは茶碗蒸しです。卵の料理ですよ。</>,romaji:"Kore wa chawanmushi desu. Tamago no ryouri desu yo.",translation:"Ini chawanmushi, hidangan berbahan telur.",audioFileName:"irodori-elementary1-12-a05-l01.mp3"},
{speakerId:"yui",japanese:<>中に何が入っていますか。</>,romaji:"Naka ni nani ga haitte imasu ka?",translation:"Apa saja yang ada di dalamnya?",audioFileName:"irodori-elementary1-12-a05-l02.mp3"},
{speakerId:"kenji",japanese:<>鶏肉と、きのこが入っています。だしも使います。</>,romaji:"Toriniku to, kinoko ga haitte imasu. Dashi mo tsukaimasu.",translation:"Isinya ayam dan jamur, ditambah kaldu dashi.",audioFileName:"irodori-elementary1-12-a05-l03.mp3"},
{speakerId:"yui",japanese:<>いいにおいですね。いただきます。</>,romaji:"Ii nioi desu ne. Itadakimasu.",translation:"Aromanya enak, ya. Saya coba, ya.",audioFileName:"irodori-elementary1-12-a05-l04.mp3"},
{speakerId:"kenji",japanese:<>味は、うすくないですか。</>,romaji:"Aji wa, usukunai desu ka?",translation:"Rasanya tidak terlalu hambar, kan?",audioFileName:"irodori-elementary1-12-a05-l05.mp3"},
{speakerId:"yui",japanese:<>いいえ、ちょうどいいです。おいしいですよ。</>,romaji:"Iie, choudo ii desu. Oishii desu yo.",translation:"Tidak, rasanya pas. Enak.",audioFileName:"irodori-elementary1-12-a05-l06.mp3"},
];
const canDos=[
{id:"describe-food-appearance",text:"Memberi kesan tentang makanan berdasarkan penampilannya, misalnya terlihat enak, manis, atau pedas."},
{id:"comment-after-tasting",text:"Mengomentari makanan yang ditawarkan setelah mencobanya, termasuk menyampaikan rasa yang disukai atau kurang cocok."},
{id:"ask-dish-taste-ingredients",text:"Bertanya dan menjawab tentang jenis masakan, rasa, serta bahan yang digunakan."},
{id:"read-instant-food-instructions",text:"Membaca petunjuk pada kemasan makanan instan dan memahami urutan informasi atau langkah yang tertulis."},
{id:"explain-food-content",text:"Menjelaskan bahan yang terkandung dalam makanan dengan pola ～が入っています dan ～を入れます."},
];
const impressionCards=[
{id:"bento",name:"お弁当",reading:"Obentou · Bekal makan",appearance:"おいしそうですね。",translation:"Kelihatannya enak.",note:"そうです menyatakan kesan dari apa yang terlihat."},
{id:"curry",name:"カレー",reading:"Karee · Kare",appearance:"辛そうな料理ですね。",translation:"Masakan yang kelihatannya pedas.",note:"そうな diletakkan sebelum kata benda."},
{id:"cake",name:"ケーキ",reading:"Keeki · Kue",appearance:"甘そうですね。",translation:"Kelihatannya manis.",note:"甘い → 甘そう (hilangkan い)."},
{id:"orange",name:"みかん",reading:"Mikan · Jeruk",appearance:"すっぱそうですね。",translation:"Kelihatannya asam.",note:"Kesan dari tampilan belum tentu sama dengan rasa sebenarnya."},
];
const tastingExamples=[
{food:"卵焼き",reading:"Tamagoyaki",sentence:"甘くて、おいしいです。",meaning:"Manis dan enak."},
{food:"茶碗蒸し",reading:"Chawanmushi",sentence:"甘くなくて、おいしいです。",meaning:"Tidak manis dan enak."},
{food:"サラダ",reading:"Sarada",sentence:"さっぱりして、おいしいです。",meaning:"Rasanya segar dan enak."},
];
const ingredientCards=[
{name:"茶碗蒸し",reading:"Chawanmushi",description:"Masakan telur dengan tekstur lembut.",contents:"卵、鶏肉、きのこ",contentsMeaning:"Telur, ayam, dan jamur",sentence:"鶏肉ときのこが入っています。",note:"Bahan yang terkandung dijelaskan dengan が入っています。"},
{name:"野菜スープ",reading:"Yasai suupu",description:"Sup sayuran sederhana.",contents:"にんじん、玉ねぎ、キャベツ",contentsMeaning:"Wortel, bawang bombai, dan kol",sentence:"玉ねぎを入れます。",note:"Bahan yang sengaja dimasukkan dijelaskan dengan を入れます。"},
];
const packageWords=[
{word:"調理方法",reading:"ちょうりほうほう · chouri houhou",meaning:"Petunjuk cara menyiapkan makanan"},
{word:"フタ",reading:"futa",meaning:"Tutup kemasan"},
{word:"取り出す",reading:"とりだす · toridasu",meaning:"Mengeluarkan"},
{word:"めん",reading:"men",meaning:"Mi"},
{word:"お湯",reading:"おゆ · oyu",meaning:"Air panas"},
{word:"注ぐ",reading:"そそぐ · sosogu",meaning:"Menuangkan"},
{word:"少し",reading:"すこし · sukoshi",meaning:"Sedikit"},
{word:"混ぜる",reading:"まぜる · mazeru",meaning:"Mencampur"},
];
const packageSequence=[
{step:"01",label:"小袋を取り出す",reading:"Kobukuro o toridasu",meaning:"Mengeluarkan kantong kecil dari kemasan."},
{step:"02",label:"調理方法を読む",reading:"Chouri houhou o yomu",meaning:"Membaca petunjuk cara menyiapkan makanan pada kemasan."},
{step:"03",label:"表示された時間を確認する",reading:"Hyouji sareta jikan o kakunin suru",meaning:"Memeriksa waktu yang tertulis pada kemasan."},
{step:"04",label:"よく混ぜる",reading:"Yoku mazeru",meaning:"Mencampur hingga merata sesuai petunjuk produk."},
];
const vocabulary=[
  ["お弁当","おべんとう · obentou","Bento (bekal dalam kotak)"],
  ["料理","りょうり · ryouri","Masakan"],
  ["卵","たまご · tamago","Telur"],
  ["卵焼き","たまごやき · tamagoyaki","Telur dadar gulung Jepang"],
  ["味","あじ · aji","Rasa"],
  ["甘い","あまい · amai","Manis"],
  ["辛い","からい · karai","Pedas"],
  ["すっぱい","すっぱい · suppai","Asam"],
  ["しょっぱい","しょっぱい · shoppai","Asin"],
  ["苦い","にがい · nigai","Pahit"],
  ["おいしい","おいしい · oishii","Enak"],
  ["まずい","まずい · mazui","Tidak enak"],
  ["苦手","にがて · nigate","Kurang cocok / tidak mahir"],
  ["材料","ざいりょう · zairyou","Bahan"],
  ["入る","はいる · hairu","Masuk / terkandung"],
  ["入れる","いれる · ireru","Memasukkan"],
  ["食べてみる","たべてみる · tabete miru","Mencoba makan"],
  ["お湯","おゆ · oyu","Air panas"],
  ["調理方法","ちょうりほうほう · chouri houhou","Petunjuk cara menyiapkan makanan"],
  ["少し","すこし · sukoshi","Sedikit"],
  ["フタ","フタ · futa","Tutup kemasan"],
  ["取り出す","とりだす · toridasu","Mengeluarkan"],
  ["めん","めん · men","Mi"],
  ["注ぐ","そそぐ · sosogu","Menuangkan"],
  ["混ぜる","まぜる · mazeru","Mencampur"],
];

const kanjiWords=[
  ["卵","たまご · tamago","Telur"],
  ["料理","りょうり · ryouri","Masakan"],
  ["お湯","おゆ · oyu","Air panas"],
  ["調理方法","ちょうりほうほう · chouri houhou","Petunjuk cara menyiapkan makanan"],
  ["少し","すこし · sukoshi","Sedikit"],
  ["味","あじ · aji","Rasa"],
  ["甘い","あまい · amai","Manis"],
  ["辛い","からい · karai","Pedas"],
  ["苦手","にがて · nigate","Kurang cocok / tidak mahir"],
  ["食べ物","たべもの · tabemono","Makanan"],
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
{value:1,label:"★☆☆ Masih perlu latihan"},
{value:2,label:"★★☆ Sudah bisa"},
{value:3,label:"★★★ Bisa dengan baik"},
];
type Task = {prompt:ReactNode;options:{key:string;label:ReactNode}[];answer:string;explanation:ReactNode};
const practiceTasks:Task[]=[
{prompt:<>Kalimat 「おいしそうですね」 menyatakan …</>,options:[{key:"a",label:"Kesan bahwa makanan terlihat enak."},{key:"b",label:"Kepastian setelah memakan makanan."},{key:"c",label:"Permintaan untuk membeli makanan."}],answer:"a",explanation:<>～そうです digunakan untuk menyatakan kesan atau perkiraan berdasarkan penampilan.</>},
{prompt:<>Bentuk 「辛そうな料理」 berarti …</>,options:[{key:"a",label:"Masakan yang kelihatannya pedas."},{key:"b",label:"Masakan yang sudah dimakan."},{key:"c",label:"Masakan yang tidak pedas."}],answer:"a",explanation:<>～そうな diletakkan sebelum kata benda, misalnya 辛そうな料理.</>},
{prompt:<>Lengkapi: 「この卵焼きは、甘___おいしいです。」</>,options:[{key:"a",label:"くて"},{key:"b",label:"くない"},{key:"c",label:"そうな"}],answer:"a",explanation:<>kata sifat -i berakhiran い berubah menjadi ～くて untuk menghubungkan sifat atau alasan.</>},
{prompt:<>Apa arti 「食べてみてください」?</>,options:[{key:"a",label:"Silakan coba makan."},{key:"b",label:"Jangan makan."},{key:"c",label:"Sudah selesai makan."}],answer:"a",explanation:<>V-てみます menyatakan mencoba sesuatu untuk mengetahui seperti apa hasil atau rasanya.</>},
{prompt:<>Pilih bentuk yang menjelaskan bahan yang terkandung di dalam masakan.</>,options:[{key:"a",label:"きのこが入っています。"},{key:"b",label:"きのこを入ってます。"},{key:"c",label:"きのこが入れます。"}],answer:"a",explanation:<>入っています menyatakan keadaan bahwa sesuatu terkandung atau berada di dalam masakan.</>},
{prompt:<>「味は、うすくないですか。」 biasanya digunakan untuk …</>,options:[{key:"a",label:"Memastikan apakah rasa makanan tidak terlalu tawar."},{key:"b",label:"Meminta daftar harga makanan."},{key:"c",label:"Menanyakan nama orang."}],answer:"a",explanation:<>～くないですか dapat dipakai untuk menunjukkan perhatian dan memastikan apakah sesuatu terasa baik-baik saja bagi lawan bicara.</>},
];
const quizQuestions:Task[]=[
{prompt:<>Apa arti 「お弁当」?</>,options:[{key:"a",label:"Bento (bekal dalam kotak)."},{key:"b",label:"Bahan masakan."},{key:"c",label:"Petunjuk arah."}],answer:"a",explanation:<>お弁当（おべんとう）adalah bento, yaitu bekal makan dalam kotak.</>},
{prompt:<>Bentuk ～そうです pada 「おいしそうです」 menyatakan …</>,options:[{key:"a",label:"Kesan berdasarkan penampilan."},{key:"b",label:"Pengalaman yang sudah terjadi."},{key:"c",label:"Perintah untuk makan."}],answer:"a",explanation:<>おいしい kehilangan い lalu menjadi おいしそうです.</>},
{prompt:<>Pilih bentuk yang tepat dari 辛い + そうな + 料理.</>,options:[{key:"a",label:"辛そうな料理"},{key:"b",label:"辛いそうな料理"},{key:"c",label:"辛くそうな料理"}],answer:"a",explanation:<>Hilangkan い dari 辛い, lalu tambahkan そうな sebelum kata benda.</>},
{prompt:<>Lengkapi: 「甘く___、おいしいです。」</>,options:[{key:"a",label:"なくて"},{key:"b",label:"ないで"},{key:"c",label:"そうで"}],answer:"a",explanation:<>Bentuk negatif penghubung i-adjective adalah ～くなくて.</>},
{prompt:<>「よかったら、この料理を食べてみてください。」 adalah …</>,options:[{key:"a",label:"Ajakan sopan untuk mencoba makanan."},{key:"b",label:"Larangan makan."},{key:"c",label:"Pertanyaan tentang harga."}],answer:"a",explanation:<>食べてみてください adalah bentuk anjuran sopan dari V-てみる.</>},
{prompt:<>Kalimat 「野菜が入っています」 berarti …</>,options:[{key:"a",label:"Sayuran terkandung di dalamnya."},{key:"b",label:"Saya memasukkan sayuran."},{key:"c",label:"Sayuran sedang dijual."}],answer:"a",explanation:<>入っています berfokus pada keadaan atau isi masakan.</>},
{prompt:<>Kalimat 「野菜を入れます」 berarti …</>,options:[{key:"a",label:"Memasukkan sayuran."},{key:"b",label:"Sayuran sudah terkandung."},{key:"c",label:"Sayuran terlihat enak."}],answer:"a",explanation:<>入れます adalah kata kerja transitif yang menunjukkan tindakan memasukkan sesuatu.</>},
{prompt:<>Apa arti 「苦手」?</>,options:[{key:"a",label:"Kurang cocok / tidak begitu menyukai atau tidak mahir."},{key:"b",label:"Sangat manis."},{key:"c",label:"Petunjuk cara menyiapkan makanan."}],answer:"a",explanation:<>苦手 dapat menyatakan sesuatu yang kurang disukai atau bidang yang tidak dikuasai.</>},
{prompt:<>Pada kemasan, 「調理方法」 menunjukkan …</>,options:[{key:"a",label:"Petunjuk cara menyiapkan makanan."},{key:"b",label:"Nama toko."},{key:"c",label:"Warna kemasan."}],answer:"a",explanation:<>調理方法 adalah bagian yang memuat informasi cara penyiapan makanan.</>},
{prompt:<>「少し」 berarti …</>,options:[{key:"a",label:"Sedikit."},{key:"b",label:"Sangat banyak."},{key:"c",label:"Setiap hari."}],answer:"a",explanation:<>少し（すこし）berarti sedikit atau sebentar, sesuai konteks.</>},
];
const simulations=[
{title:"01 · Kesan dari penampilan",heading:"Mengomentari bento yang terlihat enak",prompt:"Kamu melihat bento milik teman. Kamu ingin mengatakan bahwa bento itu kelihatan enak.",japanese:<>お弁当、おいしそうですね。</>,translation:"Bentonya kelihatan enak, ya.",options:[{key:"a",label:"お弁当、おいしそうですね。",meaning:"Menyampaikan kesan dari penampilan."},{key:"b",label:"お弁当、おいしくてですね。",meaning:"Bentuk ini tidak tepat untuk konteks tersebut."},{key:"c",label:"お弁当、おいしいみたい食べます。",meaning:"Susunan kalimat tidak tepat."}],answer:"a",explanation:"おいしい → おいしそうです. Hilangkan い lalu tambahkan そうです."},
{title:"02 · そうな + kata benda",heading:"Menggambarkan makanan yang tampak pedas",prompt:"Kamu melihat masakan berwarna merah dan ingin mengatakan, 'Itu masakan yang kelihatannya pedas.'",japanese:<>それは辛そうな料理ですね。</>,translation:"Itu masakan yang kelihatannya pedas.",options:[{key:"a",label:"それは辛そうな料理ですね。",meaning:"そうな menerangkan kata benda 料理."},{key:"b",label:"それは辛いそうな料理ですね。",meaning:"い tidak dipertahankan sebelum そうな."},{key:"c",label:"それは辛くて料理ですね。",meaning:"Pola ini tidak menyatakan kesan penampilan."}],answer:"a",explanation:"Untuk i-adjective, hilangkan い: 辛い → 辛そうな料理."},
{title:"03 · Kesan setelah mencicipi",heading:"Menggabungkan dua kesan rasa",prompt:"Setelah mencoba tamagoyaki, kamu ingin mengatakan bahwa rasanya manis dan enak.",japanese:<>甘くて、おいしいです。</>,translation:"Rasanya manis dan enak.",options:[{key:"a",label:"甘くて、おいしいです。",meaning:"Menghubungkan dua sifat positif."},{key:"b",label:"甘いそう、おいしいです。",meaning:"Bentuk そう bukan bentuk penghubung ini."},{key:"c",label:"甘くない、おいしいです。",meaning:"Tidak menyatakan hubungan yang dimaksud."}],answer:"a",explanation:"甘い berubah menjadi 甘くて untuk menghubungkan dua sifat."},
{title:"04 · Menjelaskan bahan",heading:"Menyebutkan isi masakan",prompt:"Teman bertanya apa yang ada di dalam sup. Sup tersebut mengandung wortel dan kol.",japanese:<>にんじんとキャベツが入っています。</>,translation:"Di dalamnya ada wortel dan kol.",options:[{key:"a",label:"にんじんとキャベツが入っています。",meaning:"Menjelaskan bahan yang terkandung."},{key:"b",label:"にんじんとキャベツを入っています。",meaning:"Partikel dan bentuk kata kerja tidak tepat."},{key:"c",label:"にんじんとキャベツが入れます。",meaning:"入れます membutuhkan pola objek を."}],answer:"a",explanation:"Gunakan Nが入っています untuk menjelaskan isi makanan. Nを入れます menjelaskan tindakan seseorang memasukkan bahan."},
{title:"05 · Membaca kemasan",heading:"Menemukan bagian petunjuk",prompt:"Pada kemasan makanan, kamu mencari informasi tentang cara menyiapkannya. Bagian mana yang perlu dicari?",japanese:<>調理方法</>,translation:"Petunjuk cara menyiapkan makanan.",options:[{key:"a",label:"調理方法",meaning:"Bagian petunjuk cara menyiapkan makanan."},{key:"b",label:"商品名",meaning:"Nama produk."},{key:"c",label:"内容量",meaning:"Isi atau jumlah bersih produk."}],answer:"a",explanation:"調理方法 menandai bagian petunjuk penyiapan. Latihan ini berfokus membaca tulisan pada kemasan."},
];

export default function IrodoriElementaryOneLessonTwelvePage() {
 const progress = useIrodoriProgress();
 const [practiceAnswers,setPracticeAnswers] = useState<Record<number,string>>({});
 const [practiceSubmitted,setPracticeSubmitted] = useState(false);
 const [answers,setAnswers] = useState<Record<number,string>>({});
 const [quizSubmitted,setQuizSubmitted] = useState(false);
 const [simulationChoices,setSimulationChoices] = useState<Record<number,string>>({});
 const [simulationChecked,setSimulationChecked] = useState<Record<number,boolean>>({});
 const [ratings,setRatings] = useState<Record<string,IrodoriRating>>({});
 const isCompleted = progress.completedLessons.includes(lessonId);
 const visibleRatings = {...(progress.selfEvaluations[lessonId] ?? {}),...ratings};
 const practiceScore = practiceTasks.filter((task,index)=>practiceAnswers[index]===task.answer).length;
 const practiceIsCorrect = practiceSubmitted && practiceScore===practiceTasks.length;
 const score = quizQuestions.filter((question,index)=>answers[index]===question.answer).length;
 const simulationsComplete = simulations.every((task,index)=>simulationChecked[index] && simulationChoices[index]===task.answer);
 const canDosRated = canDos.every((item)=>visibleRatings[item.id]!==undefined);
 const resetPractice=()=>{setPracticeAnswers({});setPracticeSubmitted(false);};
 const resetQuiz=()=>{setAnswers({});setQuizSubmitted(false);};

 return (
 <main className="mx-auto max-w-5xl space-y-7 pb-12">
  <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"><ArrowLeft size={15}/> Kembali ke Dasar 1</Link>
  <header className="relative isolate overflow-hidden rounded-[28px] border border-[#476C51]/45 bg-gradient-to-br from-[#203428] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
   <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#91B99A]/[0.08]">弁</div>
   <div className="relative z-10">
    <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">IRODORI • DASAR 1 A2 • PELAJARAN 12</p>
    <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Bekal makan siangmu kelihatannya enak.</h1>
    <p className="mt-2 text-sm font-semibold text-[#A9CDB0]">お弁当、おいしそうですね。</p>
    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar memberi kesan tentang penampilan makanan, menceritakan rasa setelah mencicipi, bertanya tentang bahan masakan, dan memahami informasi pada kemasan makanan instan.</p>
    <div className="mt-5 flex flex-wrap gap-2">
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#A9CDB0]"/>Kesan makanan</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#A9CDB0]"/>Rasa dan bahan</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#A9CDB0]"/>Label kemasan</span>
    </div>
   </div>
  </header>
  <section className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4 md:p-5">
   <div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#A9CDB0]"/><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2></div>
   <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target pertama mengikuti sasaran target komunikasi resmi Irodori. Target terakhir merupakan latihan penguatan Fude.</p>
   <div className="mt-3 grid gap-2 sm:grid-cols-2">{canDos.map((item,index)=><article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#A9CDB0]">{index<4?"CAN-DO UTAMA":"LATIHAN PENGUATAN"} · 0{index+1}</p><p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p></article>)}</div>
  </section>
  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KOSAKATA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Rasa, masakan, dan kemasan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kata untuk menggambarkan rasa, bahan masakan, serta informasi pada kemasan makanan.</p></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{vocabulary.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9CDB0]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}</div>
  </section>
  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Melihat, mencoba, dan membicarakan makanan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan perbedaan kesan dari penampilan dan pendapat setelah makanan dicicipi.</p></div>
   <div className="space-y-4">
    <IrodoriConversation title="Memberi kesan tentang bento" speakers={[speakers.yui,speakers.akiko]} utterances={appearanceConversation}/>
    <IrodoriConversation title="Makanan yang kelihatannya pedas" speakers={[speakers.sota,speakers.yui]} utterances={tasteAppearanceConversation}/>
    <IrodoriConversation title="Mencoba makanan yang ditawarkan" speakers={[speakers.akiko,speakers.kenji]} utterances={tryingFoodConversation}/>
    <IrodoriConversation title="Menyampaikan kesan rasa" speakers={[speakers.yui,speakers.sota]} utterances={tasteFeedbackConversation}/>
    <IrodoriConversation title="Bertanya tentang bahan masakan" speakers={[speakers.kenji,speakers.yui]} utterances={ingredientsConversation}/>
   </div>
  </section>
  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KESAN DARI PENAMPILAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Makanan ini kelihatannya seperti apa?</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan ～そうです saat menyampaikan kesan berdasarkan apa yang kamu lihat. Kesan ini belum tentu sama dengan rasa sebenarnya.</p></div>
   <div className="grid gap-3 sm:grid-cols-2">{impressionCards.map(item=><article key={item.id} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="font-mincho text-lg text-[#F1EBDD]">{item.name}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.reading}</p><p className="mt-3 font-mincho text-base text-[#A9CDB0]">{item.appearance}</p><p className="mt-1 text-xs text-[#C8C2B8]">{item.translation}</p><p className="mt-3 border-t border-white/[0.06] pt-2 text-[10px] leading-5 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>)}</div>
  </section>
  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">SETELAH MENCOBA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menyampaikan kesan tentang rasa</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Saat seseorang menawarkan makanan, kamu bisa mencoba lalu menyampaikan pendapat dengan sopan. Kamu juga boleh mengatakan bahwa suatu rasa kurang cocok.</p></div>
   <div className="grid gap-3 sm:grid-cols-3">{tastingExamples.map(item=><article key={item.food} className="rounded-xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4"><p className="font-mincho text-base font-bold text-[#F1EBDD]">{item.food}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.reading}</p><p className="mt-3 font-mincho text-sm leading-6 text-[#A9CDB0]">{item.sentence}</p><p className="mt-1 text-xs text-[#C8C2B8]">{item.meaning}</p></article>)}</div>
   <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">UNGKAPAN SOPAN</p><div className="mt-2 grid gap-3 sm:grid-cols-2"><div><p className="font-mincho text-sm text-[#F1EBDD]">よかったら、食べてみてください。</p><p className="mt-1 text-[10px] text-[#A9A398]">Kalau mau, silakan coba.</p></div><div><p className="font-mincho text-sm text-[#F1EBDD]">ありがとうございます。いただきます。</p><p className="mt-1 text-[10px] text-[#A9A398]">Terima kasih. Saya coba, ya.</p></div></div></div>
  </section>
  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Enam pola untuk membicarakan makanan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari bentuk kesan, penghubung kata sifat, ungkapan mencoba sesuatu, serta cara menjelaskan bahan masakan.</p></div>
   {[
    {title:"01 · Kesan berdasarkan penampilan",pattern:"イA-（い）＋そうです ／ ナA-（な）＋そうです",example:<>おいしそうです。／ 元気そうです。</>,note:"Gunakan ～そうです untuk menyampaikan kesan yang terlihat. Untuk i-adjective, hilangkan い: おいしい → おいしそう. Untuk na-adjective, hilangkan な: 元気な → 元気そう."},
    {title:"02 · Kesan sebelum kata benda",pattern:"イA-（い）＋そうな ＋ N",example:<>それは、辛そうな料理ですね。</>,note:"Ketika menerangkan kata benda, ubah ～そうです menjadi ～そうな. Contoh: おいしそうなケーキ (kue yang kelihatannya enak)."},
    {title:"03 · Menghubungkan i-adjective",pattern:"イA-くて、～ ／ イA-くなくて、～",example:<>甘くて、おいしいです。／ 甘くなくて、おいしいです。</>,note:"Bentuk ～くて menghubungkan sifat atau alasan positif. Bentuk negatifnya adalah ～くなくて. Contoh: 甘い → 甘くて; 甘くない → 甘くなくて."},
    {title:"04 · Mencoba sesuatu",pattern:"V-てみます ／ V-てみてください",example:<>この料理を食べてみてください。</>,note:"V-てみます digunakan saat mencoba sesuatu untuk mengetahui seperti apa hasil atau rasanya. Bentuk ～てみてください merupakan tawaran atau anjuran sopan untuk mencoba."},
    {title:"05 · Kata kerja intransitif dan transitif",pattern:"N が 入っています ／ N を 入れます",example:<>野菜が入っています。／ 野菜を入れます。</>,note:"入っています menjelaskan bahan yang terkandung dalam makanan (fokus pada keadaan). 入れます menjelaskan tindakan seseorang memasukkan bahan (fokus pada tindakan)."},
    {title:"06 · Memastikan dengan pertanyaan negatif",pattern:"イA-くないですか？",example:<>味は、うすくないですか。</>,note:"Pola ini dapat dipakai untuk memastikan apakah sesuatu tidak terlalu terasa atau apakah lawan bicara baik-baik saja. Dalam konteks ini, penanya menunjukkan perhatian terhadap rasa makanan."},
   ].map(item=><article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#8EAE93]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p><p className="mt-2 font-mincho text-base leading-7 text-[#A9CDB0]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>)}
  </section>
  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">BAHAN MAKANAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menjelaskan apa yang terkandung di dalam masakan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan perbedaan antara menjelaskan isi makanan dan menyebutkan tindakan memasukkan bahan.</p></div>
   <div className="grid gap-3 sm:grid-cols-2">{ingredientCards.map(item=><article key={item.name} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="font-mincho text-lg font-bold text-[#F1EBDD]">{item.name}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.reading} · {item.description}</p><div className="mt-3 rounded-lg border border-[#8EAE93]/20 bg-[#202720] p-3"><p className="text-[9px] font-bold text-[#A9CDB0]">材料 · BAHAN</p><p className="mt-1 font-mincho text-sm text-[#F1EBDD]">{item.contents}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.contentsMeaning}</p></div><p className="mt-3 font-mincho text-sm text-[#A9CDB0]">{item.sentence}</p><p className="mt-1 text-[10px] leading-5 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>)}</div>
  </section>
  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">MEMBACA KEMASAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menemukan informasi penyiapan pada kemasan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Latihan membaca ini memakai contoh kemasan fiktif. Fokusnya mengenali judul bagian, kosakata, dan urutan informasi tertulis—bukan mempraktikkan proses memasak.</p></div>
   <article className="rounded-2xl border border-[#6E9A75]/20 bg-[#1B201C]/80 p-4">
    <p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">CONTOH INFORMASI KEMASAN</p>
    <div className="mt-3 rounded-xl border border-white/[0.08] bg-[#F0E9D8] p-4 text-[#292720]">
     <p className="text-[9px] font-bold tracking-[0.16em] text-[#656052]">食品パッケージ · CONTOH FIKTIF</p><h3 className="mt-2 font-mincho text-xl font-black">カップめん</h3>
     <div className="mt-3 grid gap-2 sm:grid-cols-2"><div className="rounded-lg border border-[#A49B84] bg-white/60 p-3"><p className="text-[10px] font-bold">調理方法</p><p className="mt-1 text-xs">パッケージの説明を読んでください。</p><p className="mt-1 text-[9px] text-[#696454]">Baca penjelasan pada kemasan.</p></div><div className="rounded-lg border border-[#A49B84] bg-white/60 p-3"><p className="text-[10px] font-bold">内容量</p><p className="mt-1 text-xs">1食</p><p className="mt-1 text-[9px] text-[#696454]">Satu porsi.</p></div></div>
     <p className="mt-3 text-[9px] text-[#696454]">Contoh latihan bahasa. Informasi produk nyata dapat berbeda.</p>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{packageWords.map(item=><div key={item.word} className="rounded-lg border border-white/[0.07] bg-black/15 p-3"><p className="font-mincho text-sm text-[#F1EBDD]">{item.word}</p><p className="mt-1 text-[9px] text-[#A9CDB0]">{item.reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p></div>)}</div>
   </article>
   <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#A9CDB0]">URUTAN INFORMASI DALAM LATIHAN</p><p className="mt-1 text-[10px] leading-5 text-[#A9A398]">Contoh urutan membaca kartu informasi. Ikuti petunjuk pada kemasan produk sebenarnya karena setiap produk dapat memiliki penjelasan yang berbeda.</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{packageSequence.map(item=><div key={item.step} className="flex gap-3 rounded-lg border border-white/[0.06] bg-black/10 p-3"><span className="font-black text-[#A9CDB0]">{item.step}</span><div><p className="font-mincho text-sm text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-[9px] text-[#A9CDB0]">{item.reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p></div></div>)}</div></div>
  </section>
  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KANJI DAN KATA PENTING</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Baca kanji yang muncul dalam topik ini</h2></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{kanjiWords.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A9CDB0]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}</div>
  </section>
  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">SIMULASI INTERAKTIF</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan bahasa Jepang dalam situasi sehari-hari</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi tentang kesan makanan, rasa, bahan masakan, dan informasi kemasan. Setiap situasi harus dijawab benar.</p></div>
   {simulations.map((task,index)=>{const selected=simulationChoices[index];const isCorrect=simulationChecked[index]&&selected===task.answer;const isWrong=simulationChecked[index]&&selected!==task.answer;return <article key={task.title} className="space-y-3 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
    <div><p className="text-[9px] font-black tracking-[0.18em] text-[#8EAE93]">{task.title}</p><h3 className="mt-1 text-base font-black text-[#EAE6DD]">{task.heading}</h3><p className="mt-1 text-xs leading-6 text-[#A9A398]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></p></div>
    <div className="rounded-xl border border-[#6E9A75]/20 bg-[#202720] p-4"><p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.japanese}</JapaneseReading></p><p className="mt-1 text-[10px] text-[#A9CDB0]">{task.translation}</p></div>
    <div className="grid gap-2">{task.options.map(option=><button key={option.key} type="button" disabled={Boolean(isCorrect)} aria-pressed={selected===option.key} onClick={()=>{setSimulationChoices(current=>({...current,[index]:option.key}));setSimulationChecked(current=>({...current,[index]:false}));}} className={"rounded-xl border p-3 text-left transition-colors "+(isCorrect&&option.key===task.answer?"border-emerald-500/50 bg-emerald-500/10":isWrong&&selected===option.key?"border-red-400/50 bg-red-400/10":selected===option.key?"border-[#8EAE93]/60 bg-[#476C51]/15":"border-white/[0.07] bg-black/10")}><p className="font-mincho text-sm text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></p><p className="mt-1 text-[10px] text-[#A9A398]">{option.meaning}</p></button>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" aria-live="polite" className="text-[10px] leading-5 text-[#A9A398]">{isCorrect?"Benar. "+task.explanation:isWrong?"Belum tepat. Coba pilih jawaban lain.":"Pilih satu jawaban, lalu periksa."}</p><button type="button" disabled={!selected||Boolean(isCorrect)} onClick={()=>setSimulationChecked(current=>({...current,[index]:true}))} className="rounded-lg bg-[#426B4C] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#365A3F] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">{isCorrect?"Selesai":"Periksa"}</button></div>
   </article>})}
  </section>
  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban praktik harus benar untuk membuka evaluasi akhir.</p></div>
   <div className="space-y-3">{practiceTasks.map((task,index)=>{const selected=practiceAnswers[index];const isCorrect=selected===task.answer;return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#8EAE93]">LATIHAN {String(index+1).padStart(2,"0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{task.options.map(option=><button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected===option.key} onClick={()=>setPracticeAnswers(current=>({...current,[index]:option.key}))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors "+(practiceSubmitted&&option.key===task.answer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-200":practiceSubmitted&&selected===option.key?"border-red-400/50 bg-red-400/10 text-red-200":selected===option.key?"border-[#8EAE93]/60 bg-[#476C51]/15 text-[#F1EBDD]":"border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{practiceSubmitted&&<p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect?"font-bold text-emerald-300":"font-bold text-[#E7A1A1]"}>{isCorrect?"Benar. ":"Belum tepat. "}</span><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.explanation}</JapaneseReading></p>}</article>})}</div>
   <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{practiceSubmitted?"Hasil praktik: "+practiceScore+" dari "+practiceTasks.length+" benar.":Object.keys(practiceAnswers).length+" dari "+practiceTasks.length+" pertanyaan dijawab."}</p>{practiceSubmitted?<button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#6E9A75]/35 px-4 py-2 text-xs font-bold text-[#B5D0B9]"><RefreshCw size={13}/> Ulangi praktik</button>:<button type="button" onClick={()=>setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length!==practiceTasks.length} className="rounded-lg bg-[#426B4C] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa praktik</button>}</div>
  </section>
  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">KUIS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p></div>
   <div className="space-y-3">{quizQuestions.map((question,index)=>{const selected=answers[index];const isCorrect=selected===question.answer;return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#8EAE93]">SOAL {String(index+1).padStart(2,"0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{question.options.map(option=><button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected===option.key} onClick={()=>setAnswers(current=>({...current,[index]:option.key}))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors "+(quizSubmitted&&option.key===question.answer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-200":quizSubmitted&&selected===option.key?"border-red-400/50 bg-red-400/10 text-red-200":selected===option.key?"border-[#8EAE93]/60 bg-[#476C51]/15 text-[#F1EBDD]":"border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{quizSubmitted&&<p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect?"font-bold text-emerald-300":"font-bold text-[#E7A1A1]"}>{isCorrect?"Benar. ":"Belum tepat. "}</span><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.explanation}</JapaneseReading></p>}</article>})}</div>
   <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{quizSubmitted?"Nilai kuis: "+score+" dari "+quizQuestions.length+" benar.":Object.keys(answers).length+" dari "+quizQuestions.length+" pertanyaan dijawab."}</p>{quizSubmitted?<button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#6E9A75]/35 px-4 py-2 text-xs font-bold text-[#B5D0B9]"><RefreshCw size={13}/> Ulangi kuis</button>:<button type="button" onClick={()=>setQuizSubmitted(true)} disabled={Object.keys(answers).length!==quizQuestions.length} className="rounded-lg bg-[#426B4C] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa jawaban</button>}</div>
  </section>
  <section className="rounded-2xl border border-[#6E9A75]/25 bg-gradient-to-br from-[#202D22] to-[#191817] p-5 md:p-6">
   <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#A9CDB0]"/><p className="text-[9px] font-black tracking-[0.2em] text-[#A9CDB0]">CEK TARGET KOMUNIKASI</p></div>
   <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
   <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. Progres Dasar 1 tersimpan dalam jalur Irodori, terpisah dari Minna no Nihongo dan JLPT.</p>
   <div className="mt-4 space-y-3">{canDos.map((item,index)=><div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3"><p className="text-xs font-semibold leading-5 text-[#EAE6DD]"><span className="mr-2 text-[#A9CDB0]">{String(index+1).padStart(2,"0")}</span>{item.text}</p><div className="mt-3 flex flex-wrap gap-2">{ratingOptions.map(option=><button key={option.value} type="button" disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete} aria-pressed={visibleRatings[item.id]===option.value} onClick={()=>{const next={...visibleRatings,[item.id]:option.value};setRatings(next);saveIrodoriSelfEvaluation(lessonId,next);}} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 "+(visibleRatings[item.id]===option.value?"border-[#8EAE93]/60 bg-[#476C51]/20 text-[#CFE4D2]":"border-white/[0.08] bg-[#24221F] text-[#A3A099]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>)}</div></div>)}</div>
   <div className="mt-5 flex flex-wrap items-center justify-between gap-3">{isCompleted?<span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/> Pelajaran selesai</span>:<button type="button" onClick={()=>completeIrodoriLesson(lessonId)} disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#426B4C] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#365A3F] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/> Tandai pelajaran selesai</button>}
    <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#8EAE93]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
   </div>
   {(!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated)&&<p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian target komunikasi.</p>}
  </section>
  <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, tokoh, label contoh, dan situasi latihan dibuat orisinal oleh Fude untuk melatih percakapan tentang makanan dan informasi kemasan.</p>
 </main>
 );
}
