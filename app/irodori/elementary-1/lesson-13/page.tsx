"use client";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, RefreshCw, Users } from "lucide-react";
import IrodoriConversation, { type IrodoriUtterance } from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import JapaneseReading from "@/components/JapaneseReading";
import { formatGrammarNotation } from "@/lib/japanese-text";
import { completeIrodoriLesson, saveIrodoriSelfEvaluation, useIrodoriProgress } from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const speakers = IRODORI_SPEAKERS;
const lessonId = "elementary1-13";

const reportingIssueConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>すみません、会議室のモニターがつかないんですが……。</>,romaji:"Sumimasen, kaigishitsu no monitaa ga tsukanai n desu ga...",translation:"Permisi, monitor di ruang rapat tidak menyala.",audioFileName:"irodori-elementary1-13-a01-l01.mp3"},
{speakerId:"kenji",japanese:<>そうですか。担当の人に連絡しますね。</>,romaji:"Sou desu ka. Tantou no hito ni renraku shimasu ne.",translation:"Oh begitu. Saya akan menghubungi petugas yang menangani.",audioFileName:"irodori-elementary1-13-a01-l02.mp3"},
{speakerId:"yui",japanese:<>ありがとうございます。会議は午後2時からです。</>,romaji:"Arigatou gozaimasu. Kaigi wa gogo niji kara desu.",translation:"Terima kasih. Rapat dimulai pukul dua siang.",audioFileName:"irodori-elementary1-13-a01-l03.mp3"},
{speakerId:"kenji",japanese:<>わかりました。確認して、また連絡します。</>,romaji:"Wakarimashita. Kakunin shite, mata renraku shimasu.",translation:"Baik. Saya periksa dulu, lalu mengabari lagi.",audioFileName:"irodori-elementary1-13-a01-l04.mp3"},
];

const workProgressConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>資料の準備はどうですか。</>,romaji:"Shiryou no junbi wa dou desu ka?",translation:"Bagaimana persiapan materinya?",audioFileName:"irodori-elementary1-13-a02-l01.mp3"},
{speakerId:"yui",japanese:<>もうすぐ終わります。</>,romaji:"Mou sugu owarimasu.",translation:"Sebentar lagi selesai.",audioFileName:"irodori-elementary1-13-a02-l02.mp3"},
{speakerId:"sota",japanese:<>あと、どのぐらいかかりそうですか。</>,romaji:"Ato, dono gurai kakarisou desu ka?",translation:"Kira-kira masih membutuhkan waktu berapa lama?",audioFileName:"irodori-elementary1-13-a02-l03.mp3"},
{speakerId:"yui",japanese:<>あと10分ぐらいで終わりそうです。</>,romaji:"Ato juppun gurai de owari sou desu.",translation:"Sepertinya selesai sekitar sepuluh menit lagi.",audioFileName:"irodori-elementary1-13-a02-l04.mp3"},
];

const askingMachineConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>すみません、コピー機の使い方を教えてもらえませんか。</>,romaji:"Sumimasen, kopiiki no tsukaikata o oshiete moraemasen ka?",translation:"Permisi, boleh ajari saya cara menggunakan mesin fotokopi?",audioFileName:"irodori-elementary1-13-a03-l01.mp3"},
{speakerId:"akiko",japanese:<>いいですよ。まず、ここに資料を置いてください。</>,romaji:"Ii desu yo. Mazu, koko ni shiryou o oite kudasai.",translation:"Tentu. Pertama, letakkan dokumennya di sini.",audioFileName:"irodori-elementary1-13-a03-l02.mp3"},
{speakerId:"sota",japanese:<>両面コピーしたいときは、どうすればいいですか。</>,romaji:"Ryoumen kopii shitai toki wa, dou sureba ii desu ka?",translation:"Kalau ingin menyalin bolak-balik, bagaimana caranya?",audioFileName:"irodori-elementary1-13-a03-l03.mp3"},
{speakerId:"akiko",japanese:<>このボタンを押すと、両面コピーができます。</>,romaji:"Kono botan o osu to, ryoumen kopii ga dekimasu.",translation:"Kalau menekan tombol ini, kamu bisa membuat salinan bolak-balik.",audioFileName:"irodori-elementary1-13-a03-l04.mp3"},
{speakerId:"sota",japanese:<>わかりました。ありがとうございます。</>,romaji:"Wakarimashita. Arigatou gozaimasu.",translation:"Saya mengerti. Terima kasih.",audioFileName:"irodori-elementary1-13-a03-l05.mp3"},
];

const meetingPreparationConversation: IrodoriUtterance[] = [
{speakerId:"kenji",japanese:<>会議の準備をお願いします。</>,romaji:"Kaigi no junbi o onegaishimasu.",translation:"Tolong siapkan kebutuhan rapat.",audioFileName:"irodori-elementary1-13-a04-l01.mp3"},
{speakerId:"yui",japanese:<>はい。机はどうしますか。</>,romaji:"Hai. Tsukue wa dou shimasu ka?",translation:"Baik. Bagaimana dengan mejanya?",audioFileName:"irodori-elementary1-13-a04-l02.mp3"},
{speakerId:"kenji",japanese:<>机を三つ並べてください。いすはその前に置いてください。</>,romaji:"Tsukue o mittsu narabete kudasai. Isu wa sono mae ni oite kudasai.",translation:"Tolong susun tiga meja. Letakkan kursi di depannya.",audioFileName:"irodori-elementary1-13-a04-l03.mp3"},
{speakerId:"yui",japanese:<>わかりました。資料も用意します。</>,romaji:"Wakarimashita. Shiryou mo youi shimasu.",translation:"Baik. Saya juga akan menyiapkan dokumennya.",audioFileName:"irodori-elementary1-13-a04-l04.mp3"},
];

const noticeEmailConversation: IrodoriUtterance[] = [
{speakerId:"akiko",japanese:<>会議のメール、読みましたか。</>,romaji:"Kaigi no meeru, yomimashita ka?",translation:"Apakah kamu sudah membaca email rapat?",audioFileName:"irodori-elementary1-13-a05-l01.mp3"},
{speakerId:"sota",japanese:<>はい。時間と場所が変わりましたね。</>,romaji:"Hai. Jikan to basho ga kawarimashita ne.",translation:"Sudah. Waktu dan tempatnya berubah, ya.",audioFileName:"irodori-elementary1-13-a05-l02.mp3"},
{speakerId:"akiko",japanese:<>金曜日の午後2時から、第2会議室ですね。</>,romaji:"Kinyoubi no gogo niji kara, dai-ni kaigishitsu desu ne.",translation:"Jadi hari Jumat pukul dua siang di ruang rapat nomor dua.",audioFileName:"irodori-elementary1-13-a05-l03.mp3"},
{speakerId:"sota",japanese:<>そうです。みんなに連絡しておきます。</>,romaji:"Sou desu. Minna ni renraku shite okimasu.",translation:"Betul. Saya akan memberi tahu semuanya.",audioFileName:"irodori-elementary1-13-a05-l04.mp3"},
];

const canDos=[
{id:"report-work-problem",text:"Melaporkan kepada atasan ketika mengalami masalah atau kendala di tempat kerja."},
{id:"answer-work-progress",text:"Menjawab secara singkat ketika ditanya tentang perkembangan atau perkiraan waktu penyelesaian pekerjaan."},
{id:"ask-machine-howto",text:"Bertanya dan memahami penjelasan sederhana tentang cara menggunakan mesin atau peralatan di tempat kerja."},
{id:"understand-work-instructions",text:"Mendengarkan dan memahami penjelasan serta instruksi untuk menyiapkan pekerjaan atau rapat."},
{id:"read-work-email",text:"Membaca email pemberitahuan singkat terkait pekerjaan dan memahami perubahan informasi penting."},
];

const issueExamples=[
{id:"monitor",problem:"会議室のモニターがつかないんですが……。",reading:"Kaigishitsu no monitaa ga tsukanai n desu ga...",meaning:"Monitor ruang rapat tidak menyala.",response:"担当の人に連絡します。",responseMeaning:"Saya akan menghubungi petugas yang menangani."},
{id:"printer",problem:"プリンターから変な音がするんですが……。",reading:"Purintaa kara hen na oto ga suru n desu ga...",meaning:"Printer mengeluarkan suara yang tidak biasa.",response:"確認してもらいましょう。",responseMeaning:"Mari minta petugas memeriksanya."},
{id:"paper",problem:"コピー用紙がなくなったんですが……。",reading:"Kopii youshi ga nakunatta n desu ga...",meaning:"Kertas fotokopi sudah habis.",response:"新しい紙を用意します。",responseMeaning:"Saya akan menyiapkan kertas baru."},
];

const progressExamples=[
{id:"nearly",question:"あと、どのぐらいかかりそうですか。",answer:"あと10分ぐらいで終わりそうです。",meaning:"Sepertinya selesai sekitar sepuluh menit lagi."},
{id:"done",question:"準備はできましたか。",answer:"はい、もう終わりました。",meaning:"Ya, sudah selesai."},
{id:"needhelp",question:"一人でできそうですか。",answer:"すみません、少し手伝ってもらえますか。",meaning:"Maaf, bisakah kamu membantu sebentar?"},
];

const machineSteps=[
{step:"01",title:"資料を置く",reading:"Shiryou o oku",meaning:"Letakkan dokumen pada bagian yang ditunjukkan."},
{step:"02",title:"数字を入力する",reading:"Suuji o nyuuryoku suru",meaning:"Masukkan jumlah salinan yang diinginkan."},
{step:"03",title:"両面を選ぶ",reading:"Ryoumen o erabu",meaning:"Pilih opsi salinan dua sisi jika diperlukan."},
{step:"04",title:"スタートボタンを押す",reading:"Sutaato botan o osu",meaning:"Tekan tombol mulai setelah pengaturan diperiksa."},
];

const meetingTasks=[
{step:"01",instruction:"机を三つ並べてください。",reading:"Tsukue o mittsu narabete kudasai.",meaning:"Susun tiga meja."},
{step:"02",instruction:"いすを机の前に置いてください。",reading:"Isu o tsukue no mae ni oite kudasai.",meaning:"Letakkan kursi di depan meja."},
{step:"03",instruction:"資料を一人に一つずつ置いてください。",reading:"Shiryou o hitori ni hitotsu zutsu oite kudasai.",meaning:"Letakkan satu dokumen untuk setiap orang."},
{step:"04",instruction:"最後に、部屋を確認してください。",reading:"Saigo ni, heya o kakunin shite kudasai.",meaning:"Terakhir, periksa ruangan."},
];

const vocabRows=[
["コピー機","コピーき · kopiiki","Mesin fotokopi"],
["数字","すうじ · suuji","Angka"],
["電気","でんき · denki","Listrik / lampu"],
["音","おと · oto","Suara"],
["机","つくえ · tsukue","Meja"],
["都合","つごう · tsugou","Keadaan / waktu yang cocok"],
["悪い","わるい · warui","Buruk / tidak baik"],
["動く","うごく · ugoku","Bergerak / berfungsi"],
["使う","つかう · tsukau","Menggunakan"],
["終わる","おわる · owaru","Selesai"],
["お願いします","おねがいします · onegaishimasu","Mohon bantuan / tolong"],
["パソコン","パソコン · pasokon","Komputer"],
["会議室","かいぎしつ · kaigishitsu","Ruang rapat"],
["連絡する","れんらくする · renraku suru","Menghubungi / memberi kabar"],
["担当","たんとう · tantou","Penanggung jawab"],
["状況","じょうきょう · joukyou","Situasi / keadaan"],
["作業","さぎょう · sagyou","Pekerjaan / tugas"],
["資料","しりょう · shiryou","Dokumen / materi"],
["準備","じゅんび · junbi","Persiapan"],
["両面","りょうめん · ryoumen","Dua sisi"],
["片面","かためん · katamen","Satu sisi"],
["押す","おす · osu","Menekan"],
["始まる","はじまる · hajimaru","Dimulai"],
["並べる","ならべる · naraberu","Menyusun / menata"],
["変更","へんこう · henkou","Perubahan"],
];

const kanjiWords=[
["コピー機","コピーき · kopiiki","Mesin fotokopi"],
["数字","すうじ · suuji","Angka"],
["電気","でんき · denki","Listrik / lampu"],
["音","おと · oto","Suara"],
["机","つくえ · tsukue","Meja"],
["都合","つごう · tsugou","Keadaan / waktu yang cocok"],
["悪い","わるい · warui","Buruk / tidak baik"],
["動く","うごく · ugoku","Bergerak / berfungsi"],
["使う","つかう · tsukau","Menggunakan"],
["終わる","おわる · owaru","Selesai"],
["お願いします","おねがいします · onegaishimasu","Mohon bantuan / tolong"],
];

const emailFields=[
{label:"件名",value:"会議の日程変更のお知らせ",meaning:"Subjek: Pemberitahuan perubahan jadwal rapat"},
{label:"日時",value:"金曜日 14:00～15:00",meaning:"Hari Jumat, pukul 14.00–15.00"},
{label:"場所",value:"第2会議室",meaning:"Ruang rapat nomor 2"},
{label:"連絡",value:"都合が悪い場合は、ご連絡ください。",meaning:"Bila waktunya tidak cocok, mohon hubungi kami."},
];

const ratingOptions:{value:IrodoriRating;label:string}[]=[
{value:1,label:"★☆☆ Masih perlu latihan"},
{value:2,label:"★★☆ Sudah bisa"},
{value:3,label:"★★★ Bisa dengan baik"},
];

type Task={prompt:ReactNode;options:{key:string;label:ReactNode}[];answer:string;explanation:ReactNode};

const practiceTasks:Task[]=[
{prompt:<>Ungkapan 「会議室の電気がつかないんですが……」 digunakan untuk …</>,options:[{key:"a",label:"Melaporkan masalah dan meminta bantuan atau arahan."},{key:"b",label:"Memastikan pekerjaan sudah selesai."},{key:"c",label:"Mengundang seseorang ke rapat."}],answer:"a",explanation:<>～んですが digunakan untuk menjelaskan situasi atau masalah, lalu memberi kesempatan kepada lawan bicara untuk merespons.</>},
{prompt:<>Bentuk 「終わりそうです」 berasal dari kata kerja …</>,options:[{key:"a",label:"終わります"},{key:"b",label:"終わりました"},{key:"c",label:"終わりません"}],answer:"a",explanation:<>V-そうです dibentuk dari bentuk masu tanpa ます: 終わります → 終わりそうです.</>},
{prompt:<>Lengkapi: 「両面コピーしたい ___、どうすればいいですか。」</>,options:[{key:"a",label:"ときは"},{key:"b",label:"ので"},{key:"c",label:"まで"}],answer:"a",explanation:<>V-たいときは digunakan untuk menyebut situasi ketika ingin melakukan sesuatu.</>},
{prompt:<>Kalimat 「このボタンを押すと、コピーが始まります」 menunjukkan …</>,options:[{key:"a",label:"Hasil yang terjadi ketika tombol ditekan."},{key:"b",label:"Keinginan menekan tombol."},{key:"c",label:"Pekerjaan yang sudah selesai."}],answer:"a",explanation:<>V-ると menjelaskan hasil atau kejadian yang muncul setelah suatu tindakan.</>},
{prompt:<>Dalam tanya negatif 「使ったことがないですか」, jawaban 「はい、ないです」 berarti …</>,options:[{key:"a",label:"Benar, saya memang belum pernah menggunakannya."},{key:"b",label:"Tidak, saya pernah menggunakannya."},{key:"c",label:"Ya, saya sering menggunakannya."}],answer:"a",explanation:<>はい menyatakan bahwa isi pertanyaan negatif itu benar: memang belum pernah. いいえ、あります menyatakan sebaliknya.</>},
{prompt:<>Bagian 「件名」 pada email menunjukkan …</>,options:[{key:"a",label:"Subjek email."},{key:"b",label:"Nama ruangan."},{key:"c",label:"Jumlah peserta."}],answer:"a",explanation:<>件名（けんめい）adalah judul atau subjek email.</>},
];

const quizQuestions:Task[]=[
{prompt:<>Apa arti 「コピー機」?</>,options:[{key:"a",label:"Mesin fotokopi."},{key:"b",label:"Ruang rapat."},{key:"c",label:"Komputer."}],answer:"a",explanation:<>コピー機（コピーき）adalah mesin fotokopi.</>},
{prompt:<>Pilih ungkapan untuk melaporkan monitor yang tidak menyala.</>,options:[{key:"a",label:"モニターがつかないんですが……。"},{key:"b",label:"モニターを見たいときです。"},{key:"c",label:"モニターが終わりそうです。"}],answer:"a",explanation:<>～んですが menyampaikan masalah atau situasi yang perlu ditangani.</>},
{prompt:<>Apa arti 「あと10分ぐらいで終わりそうです」?</>,options:[{key:"a",label:"Sepertinya selesai sekitar sepuluh menit lagi."},{key:"b",label:"Pekerjaan sudah selesai sepuluh menit lalu."},{key:"c",label:"Pekerjaan dimulai sepuluh menit lagi."}],answer:"a",explanation:<>終わりそうです berarti sepertinya akan selesai; ぐらいで menunjukkan perkiraan rentang waktu.</>},
{prompt:<>Bentuk V-そうです untuk memperkirakan kejadian berasal dari …</>,options:[{key:"a",label:"Bentuk masu tanpa ます."},{key:"b",label:"Bentuk lampau ました."},{key:"c",label:"Bentuk negatif ません."}],answer:"a",explanation:<>Contoh: かかります → かかりそうです; 終わります → 終わりそうです.</>},
{prompt:<>Kalimat 「コピーしたいときは、どうすればいいですか」 berarti …</>,options:[{key:"a",label:"Kalau ingin memfotokopi, bagaimana caranya?"},{key:"b",label:"Kapan fotokopi selesai?"},{key:"c",label:"Siapa yang menggunakan mesin fotokopi?"}],answer:"a",explanation:<>V-たいときは menyatakan situasi ketika ingin melakukan suatu tindakan.</>},
{prompt:<>Pilih bentuk kamus yang tepat sebelum と.</>,options:[{key:"a",label:"ボタンを押すと、コピーが始まります。"},{key:"b",label:"ボタンを押しますと、コピーが始まります。"},{key:"c",label:"ボタンを押したと、コピーが始まります。"}],answer:"a",explanation:<>Pola V-ると menggunakan bentuk kamus: 押すと.</>},
{prompt:<>「机を三つ並べてください」 berarti …</>,options:[{key:"a",label:"Tolong susun tiga meja."},{key:"b",label:"Tolong pindahkan tiga kursi."},{key:"c",label:"Tolong hapus tiga angka."}],answer:"a",explanation:<>机 adalah meja, 三つ berarti tiga benda, dan 並べてください berarti tolong susun.</>},
{prompt:<>Dalam email, 「日時」 menunjukkan …</>,options:[{key:"a",label:"Tanggal dan waktu."},{key:"b",label:"Subjek."},{key:"c",label:"Lampiran."}],answer:"a",explanation:<>日時（にちじ）menunjukkan tanggal atau waktu kegiatan.</>},
{prompt:<>Pertanyaan negatif 「使ったことがないですか」 dijawab 「いいえ、あります」 berarti …</>,options:[{key:"a",label:"Tidak, saya pernah menggunakannya."},{key:"b",label:"Ya, saya belum pernah menggunakannya."},{key:"c",label:"Tidak tahu cara menggunakannya."}],answer:"a",explanation:<>いいえ menyangkal isi pertanyaan negatif, sehingga pengalaman pernah menggunakan mesin memang ada.</>},
{prompt:<>Apa arti 「都合が悪い場合は、ご連絡ください」?</>,options:[{key:"a",label:"Bila waktunya tidak cocok, mohon hubungi kami."},{key:"b",label:"Rapat sudah selesai."},{key:"c",label:"Silakan menyalakan komputer."}],answer:"a",explanation:<>都合が悪い berarti waktunya tidak cocok atau ada halangan; ご連絡ください berarti mohon hubungi kami.</>},
];

const simulations=[
{title:"01 · Melaporkan masalah",heading:"Menyampaikan kendala dengan sopan",prompt:"Monitor ruang rapat tidak menyala. Kamu ingin memberi tahu penanggung jawab dan meminta arahan, bukan mencoba memperbaiki perangkat sendiri.",japanese:<>会議室のモニターがつかないんですが……。</>,translation:"Monitor di ruang rapat tidak menyala.",options:[{key:"a",label:"会議室のモニターがつかないんですが……。",meaning:"Melaporkan masalah dengan sopan."},{key:"b",label:"会議室のモニターを買いたいです。",meaning:"Mengatakan ingin membeli monitor."},{key:"c",label:"会議室のモニターが終わりました。",meaning:"Susunan kalimat tidak sesuai."}],answer:"a",explanation:"～んですが… menjelaskan keadaan yang bermasalah agar lawan bicara dapat memberi bantuan atau arahan."},
{title:"02 · Perkiraan pekerjaan",heading:"Menjawab perkiraan waktu selesai",prompt:"Atasan bertanya berapa lama lagi persiapan dokumen. Kamu memperkirakan perlu sepuluh menit lagi.",japanese:<>あと10分ぐらいで終わりそうです。</>,translation:"Sepertinya selesai sekitar sepuluh menit lagi.",options:[{key:"a",label:"あと10分ぐらいで終わりそうです。",meaning:"Perkiraan waktu selesai."},{key:"b",label:"あと10分ぐらいで終わりました。",meaning:"Bentuk lampau, bukan perkiraan."},{key:"c",label:"あと10分ぐらいで終わりたいです。",meaning:"Menyatakan keinginan untuk selesai."}],answer:"a",explanation:"Bentuk masu tanpa ます + そうです menyatakan perkiraan: 終わります → 終わりそうです."},
{title:"03 · Bertanya cara memakai mesin",heading:"Meminta penjelasan dengan sopan",prompt:"Kamu belum tahu cara membuat salinan dua sisi. Kamu ingin meminta bantuan menjelaskan langkahnya.",japanese:<>両面コピーしたいときは、どうすればいいですか。</>,translation:"Kalau ingin membuat salinan dua sisi, bagaimana caranya?",options:[{key:"a",label:"両面コピーしたいときは、どうすればいいですか。",meaning:"Bertanya cara melakukan sesuatu yang diinginkan."},{key:"b",label:"両面コピーが終わりそうですか。",meaning:"Bertanya perkiraan selesai."},{key:"c",label:"両面コピーが動かないんですが。",meaning:"Melaporkan masalah mesin."}],answer:"a",explanation:"V-たいときは digunakan untuk bertanya cara melakukan sesuatu saat ingin melakukannya."},
{title:"04 · Memahami instruksi rapat",heading:"Mengikuti arahan penataan ruangan",prompt:"Penanggung jawab meminta tiga meja disusun berjajar. Pilih instruksi yang sesuai.",japanese:<>机を三つ並べてください。</>,translation:"Tolong susun tiga meja.",options:[{key:"a",label:"机を三つ並べてください。",meaning:"Menyusun tiga meja."},{key:"b",label:"机を三つ使いたいです。",meaning:"Ingin menggunakan tiga meja."},{key:"c",label:"机を三つ終わります。",meaning:"Bentuk ini tidak tepat."}],answer:"a",explanation:"並べてください adalah bentuk permintaan sopan dari 並べる, menyusun atau menata."},
{title:"05 · Membaca email pemberitahuan",heading:"Menemukan waktu dan lokasi rapat",prompt:"Baca email fiktif di atas. Waktu rapat Jumat pukul 14.00–15.00, bertempat di ruang rapat nomor 2.",japanese:<>金曜日 14:00～15:00 ／ 第2会議室</>,translation:"Hari Jumat pukul 14.00–15.00, ruang rapat nomor 2.",options:[{key:"a",label:"金曜日の午後2時から、第2会議室です。",meaning:"Menyebut waktu mulai dan ruang rapat dengan benar."},{key:"b",label:"月曜日の午前9時から、第1会議室です。",meaning:"Hari, waktu, dan tempat berbeda."},{key:"c",label:"金曜日の午後4時から、第3会議室です。",meaning:"Waktu dan tempat berbeda."}],answer:"a",explanation:"Periksa bagian 日時 untuk waktu dan 場所 untuk lokasi pada email."},
];

export default function IrodoriElementaryOneLessonThirteenPage() {
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
  <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"><ArrowLeft size={15}/> Kembali ke Elementary 1</Link>
  <header className="relative isolate overflow-hidden rounded-[28px] border border-[#8D514B]/35 bg-gradient-to-br from-[#382725] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
   <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D08A7D]/[0.08]">連</div>
   <div className="relative z-10">
    <p className="text-[9px] font-black tracking-[0.24em] text-[#D6A39A]">IRODORI • ELEMENTARY 1 A2 • LESSON 13</p>
    <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Sepertinya akan selesai dalam sekitar sepuluh menit.</h1>
    <p className="mt-2 text-sm font-semibold text-[#D6A39A]">あと10分ぐらいで終わりそうです。</p>
    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar melaporkan kendala di tempat kerja, menyampaikan perkiraan waktu penyelesaian, bertanya cara menggunakan mesin, memahami instruksi persiapan rapat, dan membaca email pemberitahuan.</p>
    <div className="mt-5 flex flex-wrap gap-2">
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#D6A39A]"/>Komunikasi kerja</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#D6A39A]"/>Perkiraan waktu</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><BriefcaseBusiness size={14} className="text-[#D6A39A]"/>Instruksi dan email</span>
    </div>
   </div>
  </header>

  <section className="rounded-2xl border border-[#8D514B]/20 bg-[#241D1C]/80 p-4 md:p-5">
   <div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#D6A39A]"/><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2></div>
   <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Kelima target komunikasi mengikuti sasaran Can-do resmi Irodori Elementary 1 Lesson 13.</p>
   <div className="mt-3 grid gap-2 sm:grid-cols-2">{canDos.map((item,index)=><article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#D6A39A]">CAN-DO · 0{index+1}</p><p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">KOSAKATA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tempat kerja, peralatan, dan komunikasi</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kata yang digunakan untuk melaporkan kendala, menjelaskan pekerjaan, dan mengikuti instruksi.</p></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{vocabRows.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#D6A39A]">{reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Melaporkan, bertanya, dan memahami informasi</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan cara menyampaikan masalah dengan sopan dan memastikan instruksi sudah dipahami.</p></div>
   <div className="space-y-4">
    <IrodoriConversation title="Melaporkan kendala di ruang rapat" speakers={[speakers.yui,speakers.kenji]} utterances={reportingIssueConversation}/>
    <IrodoriConversation title="Menjawab pertanyaan tentang progres" speakers={[speakers.sota,speakers.yui]} utterances={workProgressConversation}/>
    <IrodoriConversation title="Bertanya cara menggunakan mesin fotokopi" speakers={[speakers.sota,speakers.akiko]} utterances={askingMachineConversation}/>
    <IrodoriConversation title="Memahami instruksi persiapan rapat" speakers={[speakers.kenji,speakers.yui]} utterances={meetingPreparationConversation}/>
    <IrodoriConversation title="Membaca pemberitahuan rapat" speakers={[speakers.akiko,speakers.sota]} utterances={noticeEmailConversation}/>
   </div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">MELAPORKAN KENDALA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menjelaskan masalah dan meminta arahan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">～んですが… membantu menjelaskan situasi yang mengganggu pekerjaan sehingga orang lain dapat memberi bantuan atau arahan.</p></div>
   <div className="grid gap-3 sm:grid-cols-3">{issueExamples.map(item=><article key={item.id} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="font-mincho text-base text-[#F1EBDD]">{item.problem}</p><p className="mt-1 text-[9px] text-[#D6A39A]">{item.reading}</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">{item.meaning}</p><div className="mt-3 rounded-lg border border-[#8D514B]/20 bg-[#2A211F] p-3"><p className="font-mincho text-sm text-[#E8B6AC]">{item.response}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.responseMeaning}</p></div></article>)}</div>
   <p className="rounded-xl border border-white/[0.06] bg-[#1B1A18] p-3 text-[10px] leading-5 text-[#A9A398]">Dalam contoh, cukup laporkan kendala dan ikuti arahan penanggung jawab. Jangan mencoba membongkar atau memperbaiki perangkat sendiri.</p>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">PERKIRAAN PEKERJAAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menjawab kapan pekerjaan akan selesai</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">V-そうです yang berasal dari bentuk masu menyatakan perkiraan atau sesuatu yang tampaknya akan terjadi.</p></div>
   <div className="grid gap-3 sm:grid-cols-3">{progressExamples.map(item=><article key={item.id} className="rounded-xl border border-[#8D514B]/20 bg-[#241D1C]/80 p-4"><p className="font-mincho text-sm leading-6 text-[#F1EBDD]">{item.question}</p><p className="mt-3 font-mincho text-sm leading-6 text-[#E8B6AC]">{item.answer}</p><p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{item.meaning}</p></article>)}</div>
   <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#D6A39A]">PERUBAHAN BENTUK</p><div className="mt-3 grid gap-2 sm:grid-cols-3"><div className="rounded-lg bg-black/15 p-3"><p className="text-[9px] text-[#A9A398]">終わります</p><p className="mt-1 font-mincho text-base text-[#F1EBDD]">終わりそうです</p><p className="mt-1 text-[10px] text-[#A9A398]">Sepertinya akan selesai</p></div><div className="rounded-lg bg-black/15 p-3"><p className="text-[9px] text-[#A9A398]">かかります</p><p className="mt-1 font-mincho text-base text-[#F1EBDD]">かかりそうです</p><p className="mt-1 text-[10px] text-[#A9A398]">Sepertinya akan membutuhkan waktu</p></div><div className="rounded-lg bg-black/15 p-3"><p className="text-[9px] text-[#A9A398]">できます</p><p className="mt-1 font-mincho text-base text-[#F1EBDD]">できそうです</p><p className="mt-1 text-[10px] text-[#A9A398]">Sepertinya bisa</p></div></div><p className="mt-3 text-[10px] leading-5 text-[#A9A398]">Untuk perkiraan durasi, gunakan penanda waktu + ぐらいで, misalnya 10分ぐらいで (dalam kira-kira sepuluh menit).</p></div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">CARA MENGGUNAKAN MESIN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Meminta dan memahami penjelasan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Ketika belum tahu cara melakukan sesuatu, gunakan V-たいときは、どうすればいいですか untuk meminta petunjuk.</p></div>
   <div className="rounded-xl border border-[#8D514B]/20 bg-[#241D1C]/80 p-4"><p className="font-mincho text-base text-[#F1EBDD]">両面コピーしたいときは、どうすればいいですか。</p><p className="mt-1 text-xs text-[#A9A398]">Kalau ingin membuat salinan dua sisi, bagaimana caranya?</p><p className="mt-3 font-mincho text-base text-[#E8B6AC]">このボタンを押すと、両面コピーができます。</p><p className="mt-1 text-xs text-[#A9A398]">Kalau tombol ini ditekan, salinan dua sisi bisa dibuat.</p></div>
   <div className="grid gap-2 sm:grid-cols-2">{machineSteps.map(item=><div key={item.step} className="flex gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><span className="font-black text-[#D6A39A]">{item.step}</span><div><p className="font-mincho text-sm text-[#F1EBDD]">{item.title}</p><p className="mt-1 text-[9px] text-[#D6A39A]">{item.reading}</p><p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{item.meaning}</p></div></div>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">PERSIAPAN RAPAT</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Memahami instruksi singkat</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pola V-ると menjelaskan hasil yang terjadi setelah suatu tindakan. Di bawah ini adalah kartu instruksi fiktif untuk latihan membaca.</p></div>
   <div className="grid gap-2 sm:grid-cols-2">{meetingTasks.map(item=><article key={item.step} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black text-[#D6A39A]">INSTRUKSI {item.step}</p><p className="mt-2 font-mincho text-base text-[#F1EBDD]">{item.instruction}</p><p className="mt-1 text-[9px] text-[#D6A39A]">{item.reading}</p><p className="mt-1 text-xs text-[#A9A398]">{item.meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">MEMBACA EMAIL</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Menemukan informasi penting dalam pemberitahuan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Email berikut fiktif dan dibuat khusus untuk latihan. Periksa subjek, waktu, tempat, dan catatan kontak.</p></div>
   <article className="overflow-hidden rounded-2xl border border-[#8D514B]/25 bg-[#211D1B]">
    <div className="border-b border-white/[0.08] bg-[#302725] px-4 py-3"><p className="text-[9px] font-black tracking-[0.16em] text-[#D6A39A]">社内メール · EMAIL INTERNAL (CONTOH)</p><h3 className="mt-1 font-mincho text-base font-bold text-[#F1EBDD]">会議の日程変更のお知らせ</h3></div>
    <div className="grid gap-2 p-4 sm:grid-cols-2">{emailFields.map(item=><div key={item.label} className="rounded-lg border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-bold text-[#D6A39A]">{item.label}</p><p className="mt-1 font-mincho text-sm text-[#F1EBDD]">{item.value}</p><p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{item.meaning}</p></div>)}</div>
    <p className="border-t border-white/[0.06] px-4 py-3 text-[10px] leading-5 text-[#A9A398]">このメールは練習用の例です。 · Email ini adalah contoh latihan.</p>
   </article>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[["件名","けんめい · kenmei","Subjek"],["日時","にちじ · nichiji","Tanggal dan waktu"],["場所","ばしょ · basho","Tempat"],["変更","へんこう · henkou","Perubahan"]].map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#D6A39A]">{reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima pola untuk komunikasi di tempat kerja</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan pola ini untuk melaporkan situasi, memperkirakan penyelesaian, meminta petunjuk, dan memahami instruksi.</p></div>
   {[
    {title:"01 · Menjelaskan keadaan atau kendala",pattern:"V（辞書形・タ形・ナイ形）＋んですが…",example:<>パソコンが動かないんですが……。／ 資料ができたんですが……。</>,note:"～んですが digunakan untuk menjelaskan situasi kepada orang lain, biasanya untuk meminta bantuan, arahan, atau respons. Bentuk sebelum んですが dapat berupa bentuk kamus, bentuk lampau (た形), atau bentuk negatif (ない形). Contoh: 動く → 動かないんですが; 終わる → 終わったんですが."},
    {title:"02 · Memperkirakan apa yang akan terjadi",pattern:"V-ます（ますを取る）＋そうです",example:<>あと10分ぐらいで終わりそうです。／ 時間がかかりそうです。</>,note:"Bentuk masu tanpa ます ditambah そうです menyatakan perkiraan berdasarkan keadaan saat ini. Contoh: 終わります → 終わりそうです; かかります → かかりそうです; できます → できそうです. Untuk perkiraan waktu, gunakan waktu + ぐらいで."},
    {title:"03 · Bertanya ketika ingin melakukan sesuatu",pattern:"V-たいとき、～",example:<>両面コピーしたいときは、どうすればいいですか。</>,note:"V-たいとき menyatakan situasi ketika ingin melakukan sesuatu. Pola ini sering digunakan untuk bertanya cara atau langkah yang perlu dilakukan."},
    {title:"04 · Menjelaskan hasil suatu tindakan",pattern:"V-ると、～",example:<>このボタンを押すと、コピーが始まります。</>,note:"V-ると digunakan untuk menjelaskan hasil atau kejadian yang muncul setelah suatu tindakan. Kata kerja sebelum と menggunakan bentuk kamus, bukan bentuk ます."},
    {title:"05 · Menjawab pertanyaan negatif",pattern:"はい、【内容を認める】／いいえ、【内容を否定する】",example:<>A：コピー機を使ったことがないですか。<br/>B：はい、まだないです。<br/>B：いいえ、一度あります。</>,note:"Pada pertanyaan negatif, はい menyatakan bahwa isi pertanyaan itu benar; いいえ menyatakan bahwa isinya tidak benar. Jadi はい、ないです berarti memang belum pernah, sedangkan いいえ、あります berarti pernah."},
   ].map(item=><article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#C98E84]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p><p className="mt-2 font-mincho text-base leading-7 text-[#E8B6AC]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>)}
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">KANJI DAN KATA PENTING</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali kanji yang sering muncul di tempat kerja</h2></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{kanjiWords.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="font-mincho text-lg text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#D6A39A]">{reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">SIMULASI INTERAKTIF</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan bahasa Jepang dalam situasi sehari-hari</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi tentang kendala, progres pekerjaan, penggunaan mesin, instruksi rapat, dan email.</p></div>
   {simulations.map((task,index)=>{const selected=simulationChoices[index];const isCorrect=simulationChecked[index]&&selected===task.answer;const isWrong=simulationChecked[index]&&selected!==task.answer;return <article key={task.title} className="space-y-3 rounded-2xl border border-white/[0.07] bg-[#1B1A18] p-4 md:p-5">
    <div><p className="text-[9px] font-black tracking-[0.18em] text-[#C98E84]">{task.title}</p><h3 className="mt-1 text-base font-black text-[#EAE6DD]">{task.heading}</h3><p className="mt-1 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p></div>
    <div className="rounded-xl border border-[#8D514B]/20 bg-[#2A211F] p-4"><p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{task.japanese}</JapaneseReading></p><p className="mt-1 text-[10px] text-[#D6A39A]">{task.translation}</p></div>
    <div className="grid gap-2">{task.options.map(option=><button key={option.key} type="button" disabled={Boolean(isCorrect)} aria-pressed={selected===option.key} onClick={()=>{setSimulationChoices(current=>({...current,[index]:option.key}));setSimulationChecked(current=>({...current,[index]:false}));}} className={"rounded-xl border p-3 text-left transition-colors "+(isCorrect&&option.key===task.answer?"border-emerald-500/50 bg-emerald-500/10":isWrong&&selected===option.key?"border-red-400/50 bg-red-400/10":selected===option.key?"border-[#C98E84]/60 bg-[#8D514B]/15":"border-white/[0.07] bg-black/10")}><p className="font-mincho text-sm text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></p><p className="mt-1 text-[10px] text-[#A9A398]">{option.meaning}</p></button>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" aria-live="polite" className="text-[10px] leading-5 text-[#A9A398]">{isCorrect?"Benar. "+task.explanation:isWrong?"Belum tepat. Coba pilih jawaban lain.":"Pilih satu jawaban, lalu periksa."}</p><button type="button" disabled={!selected||Boolean(isCorrect)} onClick={()=>setSimulationChecked(current=>({...current,[index]:true}))} className="rounded-lg bg-[#8D514B] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#75413C] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">{isCorrect?"Selesai":"Periksa"}</button></div>
   </article>})}
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban praktik harus benar untuk membuka evaluasi akhir.</p></div>
   <div className="space-y-3">{practiceTasks.map((task,index)=>{const selected=practiceAnswers[index];const isCorrect=selected===task.answer;return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#C98E84]">LATIHAN {String(index+1).padStart(2,"0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{task.options.map(option=><button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected===option.key} onClick={()=>setPracticeAnswers(current=>({...current,[index]:option.key}))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors "+(practiceSubmitted&&option.key===task.answer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-200":practiceSubmitted&&selected===option.key?"border-red-400/50 bg-red-400/10 text-red-200":selected===option.key?"border-[#C98E84]/60 bg-[#8D514B]/15 text-[#F1EBDD]":"border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{practiceSubmitted&&<p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect?"font-bold text-emerald-300":"font-bold text-[#E7A1A1]"}>{isCorrect?"Benar. ":"Belum tepat. "}</span><JapaneseReading allowIndexFallback>{task.explanation}</JapaneseReading></p>}</article>})}</div>
   <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{practiceSubmitted?"Hasil praktik: "+practiceScore+" dari "+practiceTasks.length+" benar.":Object.keys(practiceAnswers).length+" dari "+practiceTasks.length+" pertanyaan dijawab."}</p>{practiceSubmitted?<button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#8D514B]/35 px-4 py-2 text-xs font-bold text-[#E8B6AC]"><RefreshCw size={13}/> Ulangi praktik</button>:<button type="button" onClick={()=>setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length!==practiceTasks.length} className="rounded-lg bg-[#8D514B] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa praktik</button>}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">KUIS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p></div>
   <div className="space-y-3">{quizQuestions.map((question,index)=>{const selected=answers[index];const isCorrect=selected===question.answer;return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#C98E84]">SOAL {String(index+1).padStart(2,"0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading allowIndexFallback>{question.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{question.options.map(option=><button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected===option.key} onClick={()=>setAnswers(current=>({...current,[index]:option.key}))} className={"rounded-lg border px-3 py-2.5 text-left text-xs transition-colors "+(quizSubmitted&&option.key===question.answer?"border-emerald-500/50 bg-emerald-500/10 text-emerald-200":quizSubmitted&&selected===option.key?"border-red-400/50 bg-red-400/10 text-red-200":selected===option.key?"border-[#C98E84]/60 bg-[#8D514B]/15 text-[#F1EBDD]":"border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{quizSubmitted&&<p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect?"font-bold text-emerald-300":"font-bold text-[#E7A1A1]"}>{isCorrect?"Benar. ":"Belum tepat. "}</span><JapaneseReading allowIndexFallback>{question.explanation}</JapaneseReading></p>}</article>})}</div>
   <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{quizSubmitted?"Nilai kuis: "+score+" dari "+quizQuestions.length+" benar.":Object.keys(answers).length+" dari "+quizQuestions.length+" pertanyaan dijawab."}</p>{quizSubmitted?<button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#8D514B]/35 px-4 py-2 text-xs font-bold text-[#E8B6AC]"><RefreshCw size={13}/> Ulangi kuis</button>:<button type="button" onClick={()=>setQuizSubmitted(true)} disabled={Object.keys(answers).length!==quizQuestions.length} className="rounded-lg bg-[#8D514B] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">Periksa jawaban</button>}</div>
  </section>

  <section className="rounded-2xl border border-[#8D514B]/25 bg-gradient-to-br from-[#2B211F] to-[#191817] p-5 md:p-6">
   <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-[#E8B6AC]"/><p className="text-[9px] font-black tracking-[0.2em] text-[#E8B6AC]">CAN-DO CHECK</p></div>
   <h2 className="mt-2 text-lg font-black text-[#F1EBDD]">Nilai kemampuanmu</h2>
   <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. Progres Elementary 1 tersimpan dalam jalur Irodori, terpisah dari Minna no Nihongo dan JLPT.</p>
   <div className="mt-4 space-y-3">{canDos.map((item,index)=><div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3"><p className="text-xs font-semibold leading-5 text-[#EAE6DD]"><span className="mr-2 text-[#E8B6AC]">{String(index+1).padStart(2,"0")}</span>{item.text}</p><div className="mt-3 flex flex-wrap gap-2">{ratingOptions.map(option=><button key={option.value} type="button" disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete} aria-pressed={visibleRatings[item.id]===option.value} onClick={()=>{const next={...visibleRatings,[item.id]:option.value};setRatings(next);saveIrodoriSelfEvaluation(lessonId,next);}} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 "+(visibleRatings[item.id]===option.value?"border-[#C98E84]/60 bg-[#8D514B]/20 text-[#F2CDC5]":"border-white/[0.08] bg-[#24221F] text-[#A3A099]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div></div>)}</div>
   <div className="mt-5 flex flex-wrap items-center justify-between gap-3">{isCompleted?<span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/> Pelajaran selesai</span>:<button type="button" onClick={()=>completeIrodoriLesson(lessonId)} disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#8D514B] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#75413C] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/> Tandai pelajaran selesai</button>}
    <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#C98E84]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
   </div>
   {(!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated)&&<p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian Can-do.</p>}
  </section>
  <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, email contoh, instruksi, dan situasi latihan dibuat orisinal oleh Fude untuk melatih komunikasi di tempat kerja.</p>
 </main>
 );
}
