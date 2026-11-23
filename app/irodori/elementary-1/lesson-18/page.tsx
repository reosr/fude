"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, FileText, Gift, RefreshCw, Users } from "lucide-react";
import IrodoriConversation, { type IrodoriUtterance } from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import JapaneseReading from "@/components/JapaneseReading";
import JapaneseVocabularyReading from "@/components/JapaneseVocabularyReading";
import { formatGrammarNotation } from "@/lib/japanese-text";
import { completeIrodoriLesson, saveIrodoriSelfEvaluation, useIrodoriProgress } from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const speakers = IRODORI_SPEAKERS;
const friendYui = { ...speakers.yui, name: "Yui", role: "Teman" };
const friendSota = { ...speakers.sota, name: "Sota", role: "Teman" };
const friendAkiko = { ...speakers.akiko, name: "Akiko", role: "Teman" };
const friendKenji = { ...speakers.kenji, name: "Kenji", role: "Teman" };
const lessonId = "elementary1-18";

const congratulationsConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>ユイさん、JLPT N4に合格したそうですね。おめでとうございます。</>,romaji:"Yui-san, JLPT N4 ni goukaku shita sou desu ne. Omedetou gozaimasu.",translation:"Yui, saya dengar kamu lulus JLPT N4. Selamat, ya!",audioFileName:"irodori-elementary1-18-a01-l01.mp3"},
{speakerId:"yui",japanese:<>ありがとうございます。とてもうれしいです。</>,romaji:"Arigatou gozaimasu. Totemo ureshii desu.",translation:"Terima kasih. Saya senang sekali.",audioFileName:"irodori-elementary1-18-a01-l02.mp3"},
{speakerId:"akiko",japanese:<>毎日勉強していましたね。よかったですね。</>,romaji:"Mainichi benkyou shite imashita ne. Yokatta desu ne.",translation:"Kamu belajar setiap hari, ya. Syukurlah hasilnya baik.",audioFileName:"irodori-elementary1-18-a01-l03.mp3"},
{speakerId:"yui",japanese:<>はい。これからもがんばります。</>,romaji:"Hai. Kore kara mo ganbarimasu.",translation:"Ya. Saya akan terus berusaha.",audioFileName:"irodori-elementary1-18-a01-l04.mp3"},
];

const choosingGiftConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>来月、アナさんが別の町に引っ越すそうですね。</>,romaji:"Raigetsu, Ana-san ga betsu no machi ni hikkosu sou desu ne.",translation:"Saya dengar bulan depan Ana akan pindah ke kota lain.",audioFileName:"irodori-elementary1-18-a02-l01.mp3"},
{speakerId:"kenji",japanese:<>そうですね。みんなで送別会をしませんか。</>,romaji:"Sou desu ne. Minna de soubetsukai o shimasen ka?",translation:"Benar. Bagaimana kalau kita mengadakan acara perpisahan bersama?",audioFileName:"irodori-elementary1-18-a02-l02.mp3"},
{speakerId:"sota",japanese:<>いいですね。アナさん、前に写真が好きだと言っていました。</>,romaji:"Ii desu ne. Ana-san, mae ni shashin ga suki da to itte imashita.",translation:"Ide bagus. Ana pernah mengatakan bahwa dia suka foto.",audioFileName:"irodori-elementary1-18-a02-l03.mp3"},
{speakerId:"kenji",japanese:<>じゃあ、みんなの写真を入れたフォトフレームをあげませんか。思い出に残ると思います。</>,romaji:"Jaa, minna no shashin o ireta fotofureemu o agemasen ka? Omoide ni nokoru to omoimasu.",translation:"Kalau begitu, bagaimana kalau kita memberinya bingkai foto berisi foto kita semua? Menurut saya itu akan menjadi kenangan.",audioFileName:"irodori-elementary1-18-a02-l04.mp3"},
];

const thankingGiftConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>これ、みんなからのプレゼントです。開けてみてください。</>,romaji:"Kore, minna kara no purezento desu. Akete mite kudasai.",translation:"Ini hadiah dari kita semua. Silakan dibuka.",audioFileName:"irodori-elementary1-18-a03-l01.mp3"},
{speakerId:"sota",japanese:<>わあ、フォトフレームですね。どうもありがとうございます。</>,romaji:"Waa, fotofureemu desu ne. Doumo arigatou gozaimasu.",translation:"Wah, bingkai foto, ya. Terima kasih banyak.",audioFileName:"irodori-elementary1-18-a03-l02.mp3"},
{speakerId:"yui",japanese:<>気に入ってもらえて、うれしいです。</>,romaji:"Ki ni itte moraete, ureshii desu.",translation:"Saya senang kamu menyukainya.",audioFileName:"irodori-elementary1-18-a03-l03.mp3"},
{speakerId:"sota",japanese:<>すてきなプレゼントです。大切にします。</>,romaji:"Suteki na purezento desu. Taisetsu ni shimasu.",translation:"Ini hadiah yang bagus sekali. Akan saya jaga baik-baik.",audioFileName:"irodori-elementary1-18-a03-l04.mp3"},
];

const birthdayPostConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>ケンジさんの誕生日の投稿を見ましたか。</>,romaji:"Kenji-san no tanjoubi no toukou o mimashita ka?",translation:"Apakah kamu melihat unggahan ulang tahun Kenji?",audioFileName:"irodori-elementary1-18-a04-l01.mp3"},
{speakerId:"yui",japanese:<>はい。友達からメッセージをたくさんもらったそうですね。</>,romaji:"Hai. Tomodachi kara messeeji o takusan moratta sou desu ne.",translation:"Ya. Saya dengar dia menerima banyak pesan dari teman-temannya.",audioFileName:"irodori-elementary1-18-a04-l02.mp3"},
{speakerId:"akiko",japanese:<>写真もありましたね。とても楽しそうでした。</>,romaji:"Shashin mo arimashita ne. Totemo tanoshisou deshita.",translation:"Ada fotonya juga. Kelihatannya menyenangkan.",audioFileName:"irodori-elementary1-18-a04-l03.mp3"},
{speakerId:"yui",japanese:<>私も「お誕生日おめでとう」とコメントしました。</>,romaji:"Watashi mo 'Otanjoubi omedetou' to komento shimashita.",translation:"Saya juga berkomentar, 'Selamat ulang tahun'.",audioFileName:"irodori-elementary1-18-a04-l04.mp3"},
];

const messageCardConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>来週、アナさんが引っ越しますね。みんなでカードを書きませんか。</>,romaji:"Raishuu, Ana-san ga hikkoshimasu ne. Minna de kaado o kakimasen ka?",translation:"Minggu depan Ana akan pindah, ya. Bagaimana kalau kita menulis kartu bersama?",audioFileName:"irodori-elementary1-18-a05-l01.mp3"},
{speakerId:"kenji",japanese:<>いいですね。何と書きましょうか。</>,romaji:"Ii desu ne. Nan to kakimashou ka?",translation:"Ide bagus. Sebaiknya kita menulis apa?",audioFileName:"irodori-elementary1-18-a05-l02.mp3"},
{speakerId:"sota",japanese:<>「いろいろありがとうございました。また会いましょう」はどうですか。</>,romaji:"'Iroiro arigatou gozaimashita. Mata aimashou' wa dou desu ka?",translation:"Bagaimana kalau menulis, 'Terima kasih untuk semuanya. Mari bertemu lagi'?",audioFileName:"irodori-elementary1-18-a05-l03.mp3"},
{speakerId:"kenji",japanese:<>いいと思います。私もメッセージを書きます。</>,romaji:"Ii to omoimasu. Watashi mo messeeji o kakimasu.",translation:"Menurut saya bagus. Saya juga akan menulis pesan.",audioFileName:"irodori-elementary1-18-a05-l04.mp3"},
];

const canDos=[
{id:"say-congratulations",source:"CAN-DO 65",text:"Mengucapkan selamat atas ulang tahun, pernikahan, kelulusan, atau kabar baik lainnya."},
{id:"discuss-gift-choice",source:"CAN-DO 66",text:"Mendiskusikan hadiah yang cocok untuk seseorang dengan mempertimbangkan kesukaan dan anggaran bersama."},
{id:"thank-for-a-gift",source:"CAN-DO 67",text:"Mengucapkan terima kasih dan menyampaikan kesan ketika menerima hadiah."},
{id:"understand-birthday-post",source:"CAN-DO 68",text:"Membaca dan memahami unggahan media sosial yang ditulis teman pada hari ulang tahunnya."},
{id:"write-card-message",source:"CAN-DO 69",text:"Menulis pesan ucapan selamat atau perpisahan sederhana pada kartu."},
];

const vocabRows=[
["プレゼント","プレゼント · purezento","Hadiah"],
["お祝い","おいわい · oiwai","Perayaan / ucapan selamat"],
["誕生日","たんじょうび · tanjoubi","Ulang tahun"],
["結婚","けっこん · kekkon","Pernikahan"],
["合格","ごうかく · goukaku","Kelulusan / lulus ujian"],
["男の子","おとこのこ · otokonoko","Anak laki-laki"],
["女の子","おんなのこ · onnanoko","Anak perempuan"],
["時計","とけい · tokei","Jam"],
["フォトフレーム","フォトフレーム · fotofureemu","Bingkai foto"],
["ハンカチ","ハンカチ · hankachi","Sapu tangan"],
["花","はな · hana","Bunga"],
["ケーキ","ケーキ · keeki","Kue"],
["ギフトカード","ギフトカード · gifuto kaado","Kartu hadiah"],
["送別会","そうべつかい · soubetsukai","Acara perpisahan"],
["色紙","しきし · shikishi","Kertas khusus untuk pesan bersama"],
["思い出","おもいで · omoide","Kenangan"],
["幸せ","しあわせ · shiawase","Kebahagiaan"],
["生まれる","うまれる · umareru","Lahir"],
["思う","おもう · omou","Berpikir / berpendapat"],
["選ぶ","えらぶ · erabu","Memilih"],
["合格する","ごうかくする · goukaku suru","Lulus ujian"],
["あげる","あげる · ageru","Memberi kepada orang lain"],
["もらう","もらう · morau","Menerima"],
["言う","いう · iu","Mengatakan"],
["大切にする","たいせつにする · taisetsu ni suru","Menjaga baik-baik / menghargai"],
];

const kanjiWords=[
["男の子","おとこのこ · otokonoko","Anak laki-laki"],
["女の子","おんなのこ · onnanoko","Anak perempuan"],
["お祝い","おいわい · oiwai","Perayaan / ucapan selamat"],
["誕生日","たんじょうび · tanjoubi","Ulang tahun"],
["結婚","けっこん · kekkon","Pernikahan"],
["時計","とけい · tokei","Jam"],
["幸せ","しあわせ · shiawase","Bahagia"],
["生まれる","うまれる · umareru","Lahir"],
["思う","おもう · omou","Berpikir / berpendapat"],
["選ぶ","えらぶ · erabu","Memilih"],
["合格する","ごうかくする · goukaku suru","Lulus ujian"],
];

const giftChoices=[
{label:"フォトフレーム",reading:"fotofureemu",meaning:"Bingkai foto",detail:"Cocok jika ingin mengumpulkan foto bersama teman."},
{label:"ハンカチ",reading:"hankachi",meaning:"Sapu tangan",detail:"Hadiah sederhana yang dapat dipakai sehari-hari."},
{label:"花",reading:"hana",meaning:"Bunga",detail:"Pilihan klasik untuk menyampaikan ucapan selamat."},
{label:"ギフトカード",reading:"gifuto kaado",meaning:"Kartu hadiah",detail:"Penerima dapat memilih barang sesuai kebutuhannya."},
];

const birthdayPost=[
{author:"ケンジ",time:"きょう · Hari ini",body:"今日は私の誕生日です。友達からメッセージをたくさんもらいました。みんな、ありがとうございます！とてもうれしいです。"},
{author:"ユイ",body:"お誕生日おめでとうございます！すてきな一年になりますように。"},
{author:"ソウタ",body:"おめでとう！また一緒に写真を撮りましょう。"},
{author:"アキコ",body:"お誕生日おめでとう。楽しい一日を過ごしてください。"},
];

const cardMessages=[
{occasion:"Ulang tahun",japanese:"お誕生日おめでとうございます。",reading:"Otanjoubi omedetou gozaimasu.",meaning:"Selamat ulang tahun."},
{occasion:"Lulus ujian",japanese:"合格おめでとうございます。",reading:"Goukaku omedetou gozaimasu.",meaning:"Selamat atas kelulusanmu."},
{occasion:"Perpisahan",japanese:"いろいろありがとうございました。また会いましょう。",reading:"Iroiro arigatou gozaimashita. Mata aimashou.",meaning:"Terima kasih untuk semuanya. Mari bertemu lagi."},
];

const ratingOptions:{value:IrodoriRating;label:string}[]=[
{value:1,label:"★☆☆ Masih perlu latihan"},
{value:2,label:"★★☆ Sudah bisa"},
{value:3,label:"★★★ Bisa dengan baik"},
];

type Task={prompt:ReactNode;options:{key:string;label:ReactNode}[];answer:string;explanation:ReactNode};

const practiceTasks:Task[]=[
{prompt:<>Pola 「S（bentuk biasa）そうです」 digunakan untuk …</>,options:[{key:"a",label:"Menyampaikan kabar yang didengar atau dibaca."},{key:"b",label:"Menyatakan perintah."},{key:"c",label:"Meminta izin."}],answer:"a",explanation:<>Pola ini digunakan untuk menyampaikan informasi yang kita dengar atau baca kepada orang lain.</>},
{prompt:<>Pilih kalimat yang berarti “Saya mendengar Yui lulus ujian”.</>,options:[{key:"a",label:"ユイさんが合格したそうです。"},{key:"b",label:"ユイさんに合格をあげます。"},{key:"c",label:"ユイさんは合格だと思いました。"}],answer:"a",explanation:<>合格した adalah bentuk biasa lampau dari 合格しました, lalu ditambah そうです untuk menyampaikan kabar yang didengar.</>},
{prompt:<>Dalam 「アナさんにプレゼントをあげます」, partikel に menunjukkan …</>,options:[{key:"a",label:"Orang yang menerima hadiah."},{key:"b",label:"Tempat membeli hadiah."},{key:"c",label:"Waktu pemberian hadiah."}],answer:"a",explanation:<>Pola 人に物をあげます memakai に untuk menandai orang yang menerima sesuatu.</>},
{prompt:<>Pilih ungkapan untuk menyampaikan hal yang pernah dikatakan seseorang.</>,options:[{key:"a",label:"写真が好きだと言っていました。"},{key:"b",label:"写真が好きだそうと思います。"},{key:"c",label:"写真が好きだあげました。"}],answer:"a",explanation:<>Bentuk biasa + と言っていました digunakan untuk melaporkan ucapan yang pernah didengar langsung dari seseorang.</>},
{prompt:<>Pola 「S（bentuk biasa）と思います」 digunakan untuk …</>,options:[{key:"a",label:"Menyampaikan pendapat atau perkiraan pribadi."},{key:"b",label:"Melaporkan ucapan orang lain secara langsung."},{key:"c",label:"Mengucapkan salam saat datang."}],answer:"a",explanation:<>と思います menyatakan pendapat atau penilaian pembicara. Kalimat sebelum と memakai bentuk biasa.</>},
{prompt:<>Apa arti 「大切にします」 ketika menerima hadiah?</>,options:[{key:"a",label:"Saya akan menjaganya baik-baik."},{key:"b",label:"Saya akan memberikannya kepada orang lain."},{key:"c",label:"Saya akan memilih hadiah lain."}],answer:"a",explanation:<>大切にします berarti akan memperlakukan sesuatu dengan baik atau menjaganya baik-baik.</>},
];

const quizQuestions:Task[]=[
{prompt:<>Apa arti 「お祝い」?</>,options:[{key:"a",label:"Ucapan selamat / perayaan."},{key:"b",label:"Kertas catatan."},{key:"c",label:"Tempat pertemuan."}],answer:"a",explanation:<>お祝い berarti perayaan atau ungkapan selamat untuk kabar baik.</>},
{prompt:<>Pilih ucapan untuk seseorang yang lulus ujian.</>,options:[{key:"a",label:"合格おめでとうございます。"},{key:"b",label:"おじゃまします。"},{key:"c",label:"ごちそうさまでした。"}],answer:"a",explanation:<>合格おめでとうございます berarti selamat atas kelulusan.</>},
{prompt:<>「誕生日」 berarti …</>,options:[{key:"a",label:"Ulang tahun."},{key:"b",label:"Hari perpisahan."},{key:"c",label:"Hari pertama sekolah."}],answer:"a",explanation:<>誕生日（たんじょうび）berarti hari lahir atau ulang tahun.</>},
{prompt:<>Pilih kalimat yang berarti “Saya memberi buku kepada teman”.</>,options:[{key:"a",label:"友だちに本をあげました。"},{key:"b",label:"友だちに本をもらいました。"},{key:"c",label:"友だちが本をくれました。"}],answer:"a",explanation:<>友だちに本をあげました berarti saya memberi buku kepada teman.</>},
{prompt:<>Apa makna 「前に、写真が好きだと言っていました」?</>,options:[{key:"a",label:"Sebelumnya, dia pernah mengatakan suka foto."},{key:"b",label:"Besok, dia akan membeli foto."},{key:"c",label:"Saya akan memberi foto kepadanya."}],answer:"a",explanation:<>と言っていました melaporkan ucapan yang pernah disampaikan seseorang.</>},
{prompt:<>Apa arti 「もっと思い出に残るものがいいと思います」?</>,options:[{key:"a",label:"Menurut saya, sesuatu yang lebih berkesan akan lebih baik."},{key:"b",label:"Saya mendengar sesuatu yang hilang."},{key:"c",label:"Saya sudah memberikan kenangan."}],answer:"a",explanation:<>と思います menyatakan pendapat. 思い出に残るもの berarti sesuatu yang akan menjadi kenangan.</>},
{prompt:<>Bagian 「誕生日の書き込み」 pada materi membaca adalah …</>,options:[{key:"a",label:"Unggahan teman pada hari ulang tahunnya."},{key:"b",label:"Surat izin tidak masuk."},{key:"c",label:"Jadwal kereta."}],answer:"a",explanation:<>誕生日の書き込み adalah unggahan atau tulisan tentang ulang tahun.</>},
{prompt:<>Pilih tanggapan yang sopan ketika menerima hadiah.</>,options:[{key:"a",label:"どうもありがとうございます。大切にします。"},{key:"b",label:"何時に帰りますか。"},{key:"c",label:"どこで勉強しますか。"}],answer:"a",explanation:<>Ungkapan tersebut berarti terima kasih banyak, saya akan menjaganya baik-baik.</>},
{prompt:<>Apa arti 「色紙」 dalam konteks lesson ini?</>,options:[{key:"a",label:"Kertas khusus untuk menulis pesan bersama."},{key:"b",label:"Kartu transportasi."},{key:"c",label:"Buku pelajaran."}],answer:"a",explanation:<>色紙 dapat dipakai sebagai media untuk mengumpulkan pesan dari beberapa orang.</>},
{prompt:<>Ungkapan mana yang cocok untuk kartu perpisahan?</>,options:[{key:"a",label:"いろいろありがとうございました。また会いましょう。"},{key:"b",label:"お誕生日おめでとうございます。"},{key:"c",label:"これは何ですか。"}],answer:"a",explanation:<>Kalimat pertama berterima kasih atas berbagai hal dan mengajak bertemu lagi, sehingga cocok untuk pesan perpisahan.</>},
];

const simulations=[
{title:"01 · Mengucapkan selamat",heading:"Teman lulus ujian",prompt:"Kamu mendengar bahwa temanmu lulus ujian bahasa Jepang. Pilih ungkapan yang tepat untuk menyampaikan kabar dan memberi selamat.",japanese:<>JLPT N4に合格したそうですね。おめでとうございます。</>,translation:"Saya dengar kamu lulus JLPT N4. Selamat, ya!",options:[{key:"a",label:"JLPT N4に合格したそうですね。おめでとうございます。",meaning:"Menyampaikan kabar yang didengar dan memberi selamat."},{key:"b",label:"JLPT N4をあげましょう。",meaning:"Mengatakan akan memberikan JLPT, tidak sesuai."},{key:"c",label:"JLPT N4をもらいましたか。",meaning:"Bertanya apakah menerima sesuatu."}],answer:"a",explanation:"Gunakan bentuk biasa + そうです untuk menyampaikan kabar yang didengar, lalu おめでとうございます untuk memberi selamat."},
{title:"02 · Memilih hadiah",heading:"Mencari hadiah untuk teman",prompt:"Teman yang akan pindah pernah mengatakan bahwa ia suka foto. Kelompok ingin memilih hadiah yang berkesan.",japanese:<>写真が好きだと言っていました。フォトフレームがいいと思います。</>,translation:"Dia pernah mengatakan suka foto. Menurut saya, bingkai foto akan bagus.",options:[{key:"a",label:"写真が好きだと言っていました。フォトフレームがいいと思います。",meaning:"Menggunakan ucapan yang pernah didengar dan menyampaikan pendapat."},{key:"b",label:"写真を食べると言っていました。",meaning:"Tidak sesuai konteks hadiah."},{key:"c",label:"写真にフォトフレームをもらいます。",meaning:"Susunan partikel tidak tepat."}],answer:"a",explanation:"と言っていました melaporkan ucapan seseorang; と思います menyampaikan pendapat sendiri."},
{title:"03 · Menerima hadiah",heading:"Mengucapkan terima kasih",prompt:"Teman memberimu hadiah. Kamu menyukai hadiah itu dan ingin mengatakan akan menjaganya baik-baik.",japanese:<>どうもありがとうございます。大切にします。</>,translation:"Terima kasih banyak. Akan saya jaga baik-baik.",options:[{key:"a",label:"どうもありがとうございます。大切にします。",meaning:"Mengucapkan terima kasih dan menyampaikan kesan."},{key:"b",label:"プレゼントをあげませんか。",meaning:"Mengajak memberikan hadiah kepada orang lain."},{key:"c",label:"何を選びましたか。",meaning:"Menanyakan apa yang dipilih."}],answer:"a",explanation:"どうもありがとうございます menyatakan terima kasih, sedangkan 大切にします berarti akan menjaganya baik-baik."},
{title:"04 · Membaca unggahan",heading:"Memahami post ulang tahun",prompt:"Pada unggahan fiktif, teman menulis bahwa ia menerima banyak pesan dari teman-temannya. Apa inti unggahan tersebut?",japanese:<>友達からメッセージをたくさんもらいました。みんな、ありがとうございます！</>,translation:"Saya menerima banyak pesan dari teman-teman. Terima kasih semuanya!",options:[{key:"a",label:"Teman berterima kasih karena menerima banyak pesan." ,meaning:"Ringkasan sesuai dengan isi unggahan."},{key:"b",label:"Teman sedang memilih hadiah untuk orang lain.",meaning:"Tidak disebutkan dalam unggahan."},{key:"c",label:"Teman sedang menulis jadwal sekolah.",meaning:"Tidak sesuai dengan isi unggahan."}],answer:"a",explanation:"Cari kata kunci メッセージをたくさんもらいました yang berarti menerima banyak pesan."},
{title:"05 · Menulis pesan kartu",heading:"Membuat kartu perpisahan",prompt:"Teman akan pindah sekolah. Kamu ingin berterima kasih atas kebersamaannya dan mengajak bertemu lagi.",japanese:<>いろいろありがとうございました。また会いましょう。</>,translation:"Terima kasih untuk semuanya. Mari bertemu lagi.",options:[{key:"a",label:"いろいろありがとうございました。また会いましょう。",meaning:"Pesan singkat yang cocok untuk kartu perpisahan."},{key:"b",label:"どこでプレゼントを買いますか。",meaning:"Pertanyaan tentang tempat membeli hadiah."},{key:"c",label:"今日は誕生日ですか。",meaning:"Menanyakan apakah hari ini ulang tahun."}],answer:"a",explanation:"Pesan ini mengungkapkan terima kasih dan harapan untuk bertemu kembali."},
];

export default function IrodoriElementaryOneLessonEighteenPage() {
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
  <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#CA7B9A]/40 hover:text-[#EAE6DD]"><ArrowLeft size={15}/> Kembali ke Elementary 1</Link>
  <header className="relative isolate overflow-hidden rounded-[28px] border border-[#A45B79]/35 bg-gradient-to-br from-[#49283A] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
   <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#E5A4BF]/[0.08]">祝</div>
   <div className="relative z-10">
    <p className="text-[9px] font-black tracking-[0.24em] text-[#E5A4BF]">IRODORI • ELEMENTARY 1 A2 • LESSON 18</p>
    <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Bagaimana kalau memberi sesuatu sebagai hadiah?</h1>
    <p className="mt-2 text-sm font-semibold text-[#E5A4BF]">何かプレゼントをあげませんか？</p>
    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar mengucapkan selamat, berdiskusi memilih hadiah, mengucapkan terima kasih, memahami unggahan ulang tahun, dan menulis pesan pada kartu.</p>
    <div className="mt-5 flex flex-wrap gap-2">
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#E5A4BF]"/>Hubungan sosial</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Gift size={14} className="text-[#E5A4BF]"/>Hadiah dan ucapan</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><FileText size={14} className="text-[#E5A4BF]"/>Kartu pesan</span>
    </div>
   </div>
  </header>

  <section className="rounded-2xl border border-[#A45B79]/20 bg-[#2B2028]/80 p-4 md:p-5">
   <div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#E5A4BF]"/><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2></div>
   <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Kelima target berikut mengikuti Can-do resmi Irodori Elementary 1 Lesson 18.</p>
   <div className="mt-3 grid gap-2 sm:grid-cols-2">{canDos.map((item,index)=><article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#E5A4BF]">{item.source} · 0{index+1}</p><p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#D990AE]">KOSAKATA HADIAH DAN UCAPAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Perayaan, hadiah, dan pesan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kata untuk memberi selamat, memilih hadiah, menyampaikan pendapat, dan menulis pesan sederhana.</p></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{vocabRows.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E5A4BF]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#D990AE]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Memberi selamat dan berbagi hadiah</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog dibuat orisinal oleh Fude. Contoh menggunakan suasana pertemanan, pencapaian belajar, hadiah kelompok, dan pesan perpisahan.</p></div>
   <div className="space-y-4">
    <IrodoriConversation title="Mengucapkan selamat atas kelulusan" speakers={[friendAkiko,friendYui]} utterances={congratulationsConversation}/>
    <IrodoriConversation title="Berdiskusi memilih hadiah perpisahan" speakers={[friendSota,friendKenji]} utterances={choosingGiftConversation}/>
    <IrodoriConversation title="Mengucapkan terima kasih atas hadiah" speakers={[friendYui,friendSota]} utterances={thankingGiftConversation}/>
    <IrodoriConversation title="Membicarakan unggahan ulang tahun" speakers={[friendAkiko,friendYui]} utterances={birthdayPostConversation}/>
    <IrodoriConversation title="Menulis pesan untuk kartu perpisahan" speakers={[friendSota,friendKenji]} utterances={messageCardConversation}/>
   </div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#D990AE]">MENGUCAPKAN SELAMAT</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Ungkapan untuk kabar baik</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">「おめでとうございます」 adalah ungkapan sopan untuk menyampaikan selamat. Tambahkan alasan atau kabar baik yang sedang dirayakan.</p></div>
   <div className="grid gap-2 sm:grid-cols-2">{[
    ["お誕生日おめでとうございます。","Otanjoubi omedetou gozaimasu.","Selamat ulang tahun."],
    ["合格おめでとうございます。","Goukaku omedetou gozaimasu.","Selamat atas kelulusanmu."],
    ["ご結婚おめでとうございます。","Gokekkon omedetou gozaimasu.","Selamat atas pernikahan Anda."],
    ["お子さんが生まれたそうですね。おめでとうございます。","Oko-san ga umareta sou desu ne. Omedetou gozaimasu.","Saya dengar Anda mendapat anggota keluarga baru. Selamat, ya."],
   ].map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="font-mincho text-base leading-7 text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#E5A4BF]">{reading}</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">{meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#D990AE]">MEMILIH HADIAH</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sesuaikan hadiah dengan kesukaan penerima</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Diskusikan kesukaan teman, ide hadiah, dan anggaran bersama. Tidak harus memilih hadiah yang mahal.</p></div>
   <div className="grid gap-2 sm:grid-cols-2">{giftChoices.map((item,index)=><article key={item.label} className="rounded-xl border border-[#A45B79]/20 bg-[#2B2028]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#E5A4BF]">IDE HADIAH · 0{index+1}</p><p className="mt-2 font-mincho text-lg text-[#F1EBDD]">{item.label}</p><p className="mt-1 text-[9px] text-[#E5A4BF]">{item.reading}</p><p className="mt-1 text-xs text-[#C8C2B8]">{item.meaning}</p><p className="mt-2 text-[10px] leading-5 text-[#A9A398]">{item.detail}</p></article>)}</div>
   <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#E5A4BF]">CONTOH DISKUSI</p><p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">みんなで 3,000円ぐらいのプレゼントを選びませんか。</p><p className="mt-1 text-xs text-[#A9A398]">Bagaimana kalau kita memilih hadiah sekitar 3.000 yen bersama-sama?</p><p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">思い出に残るものがいいと思います。</p><p className="mt-1 text-xs text-[#A9A398]">Menurut saya, sesuatu yang menjadi kenangan akan lebih baik.</p></div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#D990AE]">MENERIMA HADIAH</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Terima kasih dan sampaikan kesan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Saat menerima hadiah, ucapkan terima kasih lalu sampaikan kesan yang jujur dan sederhana.</p></div>
   <div className="grid gap-2 sm:grid-cols-2">{[
    ["どうもありがとうございます。","Doumo arigatou gozaimasu.","Terima kasih banyak."],
    ["すてきなプレゼントですね。","Suteki na purezento desu ne.","Hadiah yang bagus, ya."],
    ["うれしいです。","Ureshii desu.","Saya senang."],
    ["大切にします。","Taisetsu ni shimasu.","Akan saya jaga baik-baik."],
   ].map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#E5A4BF]">{reading}</p><p className="mt-1 text-xs text-[#A9A398]">{meaning}</p></article>)}</div>
   <div className="rounded-xl border border-[#A45B79]/20 bg-[#2B2028]/80 p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#E5A4BF]">PERBEDAAN KATA KERJA PEMBERIAN</p><div className="mt-3 grid gap-3 sm:grid-cols-3">{[
    ["あげます","agemasu","Saya / seseorang memberi kepada orang lain."],
    ["くれます","kuremasu","Seseorang memberi kepada saya atau pihak saya."],
    ["もらいます","moraimasu","Saya / seseorang menerima dari orang lain."],
   ].map(([jp,reading,meaning])=><div key={jp} className="rounded-lg border border-white/[0.06] bg-black/15 p-3"><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#E5A4BF]">{reading}</p><p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{meaning}</p></div>)}</div></div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#D990AE]">MEMBACA UNGGAHAN ULANG TAHUN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Cari informasi utama dari tulisan teman</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Contoh media sosial berikut sepenuhnya fiktif. Baca isi unggahan dan komentar untuk memahami kabar ulang tahun teman.</p></div>
   <article className="overflow-hidden rounded-2xl border border-[#A45B79]/25 bg-[#25202B]">
    <div className="border-b border-white/[0.08] bg-[#382D40] px-4 py-3"><p className="text-[9px] font-black tracking-[0.16em] text-[#E5A4BF]">UNGGAHAN LATIHAN · FIKTIF</p><div className="mt-1 flex items-center justify-between gap-3"><h3 className="font-mincho text-lg font-bold text-[#F1EBDD]">ケンジ · Kenji</h3><span className="text-[9px] text-[#B9A9BB]">きょう · Hari ini</span></div></div>
    <div className="space-y-3 p-4"><p className="font-mincho text-sm leading-7 text-[#F1EBDD]">今日は私の誕生日です。友達からメッセージをたくさんもらいました。みんな、ありがとうございます！とてもうれしいです。</p><p className="text-xs leading-6 text-[#A9A398]">Hari ini ulang tahun saya. Saya menerima banyak pesan dari teman-teman. Terima kasih semuanya! Saya sangat senang.</p><div className="rounded-xl border border-white/[0.07] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#E5A4BF]">KOMENTAR TEMAN</p>{birthdayPost.slice(1).map(item=><div key={item.author} className="border-b border-white/[0.06] py-2 last:border-0"><p className="text-[10px] font-bold text-[#E5A4BF]">{item.author}</p><p className="mt-1 font-mincho text-xs leading-6 text-[#EAE6DD]">{item.body}</p></div>)}</div></div>
    <p className="border-t border-white/[0.08] px-4 py-3 text-[10px] leading-5 text-[#A9A398]">Nama dan isi unggahan di atas dibuat khusus untuk latihan dan bukan akun atau orang sungguhan.</p>
   </article>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#D990AE]">MENULIS PESAN PADA KARTU</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Ucapan selamat dan pesan perpisahan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pesan singkat dapat berisi ucapan selamat, harapan baik, atau ucapan terima kasih. Sesuaikan tingkat kesopanan dengan penerimanya.</p></div>
   <article className="overflow-hidden rounded-2xl border border-[#A45B79]/25 bg-[#2C2029]">
    <div className="border-b border-white/[0.08] bg-[#44303D] px-4 py-3"><p className="text-[9px] font-black tracking-[0.16em] text-[#E5A4BF]">KARTU PESAN · CONTOH FIKTIF</p><h3 className="mt-1 font-mincho text-xl font-bold text-[#F1EBDD]">お祝いのメッセージ</h3><p className="mt-1 text-[10px] text-[#C8B8C3]">Pesan ucapan selamat</p></div>
    <div className="space-y-3 p-4 text-center"><p className="font-mincho text-lg font-bold leading-8 text-[#F1EBDD]">合格おめでとうございます。</p><p className="font-mincho text-sm leading-7 text-[#E5A4BF]">これからも応援しています。</p><p className="text-xs text-[#A9A398]">Selamat atas kelulusanmu. Kami akan terus mendukungmu.</p><p className="border-t border-white/[0.07] pt-3 font-mincho text-xs text-[#C8C2B8]">友だちより · Dari teman-teman</p></div>
   </article>
   <div className="grid gap-2 sm:grid-cols-3">{cardMessages.map(item=><article key={item.occasion} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#E5A4BF]">{item.occasion}</p><p className="mt-2 font-mincho text-sm leading-6 text-[#F1EBDD]">{item.japanese}</p><p className="mt-1 text-[9px] text-[#E5A4BF]">{item.reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#D990AE]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Empat pola untuk kabar, hadiah, dan pendapat</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari cara menyampaikan kabar yang didengar, memberikan hadiah, melaporkan ucapan orang lain, dan menyatakan pendapat.</p></div>
   {[
    {title:"01 · Menyampaikan kabar yang didengar",pattern:"S（bentuk biasa）＋ そうです",example:<>お子さんが生まれたそうですね。<br/>今日、誕生日だそうです。</>,note:"そうです digunakan untuk menyampaikan informasi yang didengar atau dibaca. Sebelum そうです gunakan bentuk biasa: V-る／V-た／V-ない／V-なかった; kata sifat-i tetap bentuk biasa; kata benda dan kata sifat-na memakai だ pada kalimat positif."},
    {title:"02 · Memberi sesuatu kepada orang lain",pattern:"[Orang] に [benda] を あげます",example:<>アナさんにプレゼントをあげませんか。<br/>友だちに本をあげました。</>,note:"あげます berarti memberikan sesuatu kepada orang lain. Partikel に menunjukkan penerima hadiah, sedangkan を menandai benda yang diberikan."},
    {title:"03 · Melaporkan ucapan seseorang",pattern:"S（bentuk biasa）＋ と言っていました",example:<>アナさんは、写真が好きだと言っていました。<br/>また会いたいと言っていました。</>,note:"Pola ini digunakan untuk menyampaikan apa yang pernah dikatakan seseorang. Isi ucapan memakai bentuk biasa dan diikuti と言っていました. Informasinya berasal dari sesuatu yang didengar langsung dari orang tersebut."},
    {title:"04 · Menyatakan pendapat",pattern:"S（bentuk biasa）＋ と思います",example:<>フォトフレームがいいと思います。<br/>思い出に残るものがいいと思います。</>,note:"と思います menyatakan pendapat atau penilaian pembicara. Isi sebelum と memakai bentuk biasa. Contoh: いいです → いいと思います; 便利です → 便利だと思います."},
   ].map(item=><article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#D990AE]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p><p className="mt-2 font-mincho text-base leading-7 text-[#E5A4BF]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>)}
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#D990AE]">KANJI DAN KATA PENTING</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kanji untuk perayaan dan kabar baik</h2></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{kanjiWords.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#E5A4BF]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#D990AE]">SIMULASI INTERAKTIF</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan bahasa Jepang dalam situasi sehari-hari</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi tentang ucapan selamat, memilih hadiah, menerima hadiah, membaca unggahan, dan menulis kartu.</p></div>
   {simulations.map((task,index)=>{const selected=simulationChoices[index];const isCorrect=simulationChecked[index]&&selected===task.answer;const isWrong=simulationChecked[index]&&selected!==task.answer;return <article key={task.title} className="space-y-3 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
    <div><p className="text-[9px] font-black tracking-[0.18em] text-[#D990AE]">{task.title}</p><h3 className="mt-1 text-base font-black text-[#EAE6DD]">{task.heading}</h3><p className="mt-1 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p></div>
    <div className="rounded-xl border border-[#A45B79]/20 bg-[#2B2028] p-4"><p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{task.japanese}</JapaneseReading></p><p className="mt-1 text-[10px] text-[#E5A4BF]">{task.translation}</p></div>
    <div className="grid gap-2">{task.options.map(option=><button key={option.key} type="button" disabled={Boolean(isCorrect)} aria-pressed={selected===option.key} onClick={()=>{setSimulationChoices(current=>({...current,[index]:option.key}));setSimulationChecked(current=>({...current,[index]:false}));}} className={"rounded-xl border p-3 text-left transition-colors "+(isCorrect&&option.key===task.answer?"border-emerald-500/50 bg-emerald-500/10":isWrong&&selected===option.key?"border-red-400/50 bg-red-400/10":selected===option.key?"border-[#E5A4BF]/60 bg-[#A45B79]/15":"border-white/[0.07] bg-black/10")}><p className="font-mincho text-sm text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></p><p className="mt-1 text-[10px] text-[#A9A398]">{option.meaning}</p></button>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" aria-live="polite" className="text-[10px] leading-5 text-[#A9A398]">{isCorrect?"Benar. "+task.explanation:isWrong?"Belum tepat. Coba pilih jawaban lain.":"Pilih satu jawaban, lalu periksa."}</p><button type="button" disabled={!selected||Boolean(isCorrect)} onClick={()=>setSimulationChecked(current=>({...current,[index]:true}))} className="rounded-lg bg-[#A45B79] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#884665] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">{isCorrect?"Selesai":"Periksa"}</button></div>
   </article>})}
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#D990AE]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban praktik harus benar untuk membuka evaluasi akhir.</p></div>
   <div className="space-y-3">{practiceTasks.map((task,index)=>{const selected=practiceAnswers[index];const isCorrect=selected===task.answer;return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#D990AE]">LATIHAN {String(index+1).padStart(2,"0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{task.options.map(option=><button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected===option.key} onClick={()=>setPracticeAnswers(current=>({...current,[index]:option.key}))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors "+(practiceSubmitted&&option.key===task.answer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-200":practiceSubmitted&&selected===option.key?"border-red-400/50 bg-red-400/10 text-red-200":selected===option.key?"border-[#E5A4BF]/60 bg-[#A45B79]/15 text-[#F1EBDD]":"border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{practiceSubmitted&&<p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect?"font-bold text-emerald-300":"font-bold text-[#E7A1A1]"}>{isCorrect?"Benar. ":"Belum tepat. "}</span><JapaneseReading allowIndexFallback>{task.explanation}</JapaneseReading></p>}</article>})}</div>
   <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{practiceSubmitted?"Hasil praktik: "+practiceScore+" dari "+practiceTasks.length+" benar.":Object.keys(practiceAnswers).length+" dari "+practiceTasks.length+" pertanyaan dijawab."}</p>{practiceSubmitted?<button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#A45B79]/35 px-4 py-2 text-xs font-bold text-[#E5A4BF]"><RefreshCw size={13}/> Ulangi praktik</button>:<button type="button" onClick={()=>setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length!==practiceTasks.length} className="rounded-lg bg-[#A45B79] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa praktik</button>}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#D990AE]">KUIS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p></div>
   <div className="space-y-3">{quizQuestions.map((question,index)=>{const selected=answers[index];const isCorrect=selected===question.answer;return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#D990AE]">SOAL {String(index+1).padStart(2,"0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{question.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{question.options.map(option=><button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected===option.key} onClick={()=>setAnswers(current=>({...current,[index]:option.key}))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors "+(quizSubmitted&&option.key===question.answer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-200":quizSubmitted&&selected===option.key?"border-red-400/50 bg-red-400/10 text-red-200":selected===option.key?"border-[#E5A4BF]/60 bg-[#A45B79]/15 text-[#F1EBDD]":"border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{quizSubmitted&&<p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect?"font-bold text-emerald-300":"font-bold text-[#E7A1A1]"}>{isCorrect?"Benar. ":"Belum tepat. "}</span><JapaneseReading allowIndexFallback>{question.explanation}</JapaneseReading></p>}</article>})}</div>
   <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{quizSubmitted?"Nilai kuis: "+score+" dari "+quizQuestions.length+" benar.":Object.keys(answers).length+" dari "+quizQuestions.length+" pertanyaan dijawab."}</p>{quizSubmitted?<button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#A45B79]/35 px-4 py-2 text-xs font-bold text-[#E5A4BF]"><RefreshCw size={13}/> Ulangi kuis</button>:<button type="button" onClick={()=>setQuizSubmitted(true)} disabled={Object.keys(answers).length!==quizQuestions.length} className="rounded-lg bg-[#A45B79] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa jawaban</button>}</div>
  </section>

  <section className="rounded-2xl border border-[#A45B79]/25 bg-gradient-to-br from-[#3D2633] to-[#191817] p-5 md:p-6">
   <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#E5A4BF]"/><p className="text-[9px] font-black tracking-[0.2em] text-[#E5A4BF]">CAN-DO CHECK</p></div>
   <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
   <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. Ini adalah pelajaran terakhir Irodori Elementary 1; setelah selesai, seluruh 18 pelajaran jalur ini akan lengkap.</p>
   <div className="mt-4 space-y-3">{canDos.map((item,index)=><div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3"><p className="text-xs font-semibold leading-5 text-[#EAE6DD]"><span className="mr-2 text-[#E5A4BF]">{String(index+1).padStart(2,"0")}</span>{item.text}</p><div className="mt-3 flex flex-wrap gap-2">{ratingOptions.map(option=><button key={option.value} type="button" disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete} aria-pressed={visibleRatings[item.id]===option.value} onClick={()=>{const next={...visibleRatings,[item.id]:option.value};setRatings(next);saveIrodoriSelfEvaluation(lessonId,next);}} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 "+(visibleRatings[item.id]===option.value?"border-[#E5A4BF]/60 bg-[#A45B79]/20 text-[#F1EBDD]":"border-white/[0.08] bg-[#24221F] text-[#A3A099]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div></div>)}</div>
   <div className="mt-5 flex flex-wrap items-center justify-between gap-3">{isCompleted?<span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/> Elementary 1 selesai · 18/18</span>:<button type="button" onClick={()=>completeIrodoriLesson(lessonId)} disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#A45B79] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#884665] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/> Selesaikan Elementary 1</button>}
    <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#E5A4BF]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
   </div>
   {(!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated)&&<p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian Can-do.</p>}
  </section>
  <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, unggahan media sosial, pilihan hadiah, dan contoh kartu dibuat orisinal oleh Fude untuk melatih bahasa Jepang dalam hubungan sehari-hari.</p>
 </main>
 );
}
