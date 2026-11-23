"use client";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, FileText, RefreshCw, Users } from "lucide-react";
import IrodoriConversation, { type IrodoriUtterance } from "@/components/IrodoriConversation";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";
import JapaneseReading from "@/components/JapaneseReading";
import JapaneseVocabularyReading from "@/components/JapaneseVocabularyReading";
import { formatGrammarNotation } from "@/lib/japanese-text";
import { completeIrodoriLesson, saveIrodoriSelfEvaluation, useIrodoriProgress } from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

const speakers = IRODORI_SPEAKERS;
const lessonId = "elementary1-14";

const phoneCallConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>おはようございます。ユイです。電車が遅れていて、15分ぐらい遅れます。</>,romaji:"Ohayou gozaimasu. Yui desu. Densha ga okurete ite, juugo-fun gurai okuremasu.",translation:"Selamat pagi. Saya Yui. Keretanya terlambat, jadi saya akan terlambat sekitar 15 menit.",audioFileName:"irodori-elementary1-14-a01-l01.mp3"},
{speakerId:"kenji",japanese:<>わかりました。気をつけて来てください。</>,romaji:"Wakarimashita. Ki o tsukete kite kudasai.",translation:"Baik, saya mengerti. Hati-hati di perjalanan.",audioFileName:"irodori-elementary1-14-a01-l02.mp3"},
{speakerId:"yui",japanese:<>すみません。みなさんに伝えていただけますか。</>,romaji:"Sumimasen. Minasan ni tsutaete itadakemasu ka?",translation:"Maaf. Bisakah tolong sampaikan kepada semuanya?",audioFileName:"irodori-elementary1-14-a01-l03.mp3"},
{speakerId:"kenji",japanese:<>はい、伝えておきます。</>,romaji:"Hai, tsutaete okimasu.",translation:"Ya, akan saya sampaikan.",audioFileName:"irodori-elementary1-14-a01-l04.mp3"},
];

const askingBriefPermissionConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>あのう、すみません。少し休憩してもいいですか。</>,romaji:"Anou, sumimasen. Sukoshi kyuukei shite mo ii desu ka?",translation:"Permisi. Bolehkah saya beristirahat sebentar?",audioFileName:"irodori-elementary1-14-a02-l01.mp3"},
{speakerId:"akiko",japanese:<>はい、どうぞ。</>,romaji:"Hai, douzo.",translation:"Ya, silakan.",audioFileName:"irodori-elementary1-14-a02-l02.mp3"},
{speakerId:"sota",japanese:<>ありがとうございます。すぐ戻ります。</>,romaji:"Arigatou gozaimasu. Sugu modorimasu.",translation:"Terima kasih. Saya segera kembali.",audioFileName:"irodori-elementary1-14-a02-l03.mp3"},
{speakerId:"akiko",japanese:<>わかりました。</>,romaji:"Wakarimashita.",translation:"Baik.",audioFileName:"irodori-elementary1-14-a02-l04.mp3"},
];

const askingDayOffConversation: IrodoriUtterance[] = [
{speakerId:"yui",japanese:<>すみません。来週の月曜日、午後から休みを取ってもいいでしょうか。</>,romaji:"Sumimasen. Raishuu no getsuyoubi, gogo kara yasumi o totte mo ii deshou ka?",translation:"Permisi. Apakah saya boleh mengambil cuti mulai Senin siang minggu depan?",audioFileName:"irodori-elementary1-14-a03-l01.mp3"},
{speakerId:"kenji",japanese:<>何か用事がありますか。</>,romaji:"Nanika youji ga arimasu ka?",translation:"Apakah ada keperluan?",audioFileName:"irodori-elementary1-14-a03-l02.mp3"},
{speakerId:"yui",japanese:<>市役所に行かなければならないんです。</>,romaji:"Shiyakusho ni ikanakereba naranai n desu.",translation:"Saya harus pergi ke kantor pemerintahan kota.",audioFileName:"irodori-elementary1-14-a03-l03.mp3"},
{speakerId:"kenji",japanese:<>わかりました。休暇届を出してください。</>,romaji:"Wakarimashita. Kyuuka todoke o dashite kudasai.",translation:"Baik. Tolong serahkan formulir permohonan cuti.",audioFileName:"irodori-elementary1-14-a03-l04.mp3"},
];

const fillingLeaveFormConversation: IrodoriUtterance[] = [
{speakerId:"sota",japanese:<>休暇届の書き方を教えてもらえませんか。</>,romaji:"Kyuuka todoke no kakikata o oshiete moraemasen ka?",translation:"Bisakah Anda menjelaskan cara mengisi formulir cuti?",audioFileName:"irodori-elementary1-14-a04-l01.mp3"},
{speakerId:"akiko",japanese:<>はい。ここに所属チームと氏名を書いてください。</>,romaji:"Hai. Koko ni shozoku chiimu to shimei o kaite kudasai.",translation:"Tentu. Tuliskan tim bagian dan nama lengkap di sini.",audioFileName:"irodori-elementary1-14-a04-l02.mp3"},
{speakerId:"sota",japanese:<>休む期間は、どこに書きますか。</>,romaji:"Yasumu kikan wa, doko ni kakimasu ka?",translation:"Di mana saya menuliskan periode cutinya?",audioFileName:"irodori-elementary1-14-a04-l03.mp3"},
{speakerId:"akiko",japanese:<>この「期間」のところです。理由と休み中の連絡先も書いてください。</>,romaji:"Kono 'kikan' no tokoro desu. Riyuu to yasumi-chuu no renrakusaki mo kaite kudasai.",translation:"Di bagian 'periode' ini. Tuliskan juga alasan dan kontak selama cuti.",audioFileName:"irodori-elementary1-14-a04-l04.mp3"},
{speakerId:"sota",japanese:<>わかりました。ありがとうございます。</>,romaji:"Wakarimashita. Arigatou gozaimasu.",translation:"Saya mengerti. Terima kasih.",audioFileName:"irodori-elementary1-14-a04-l05.mp3"},
];

const afterReturnConversation: IrodoriUtterance[] = [
{speakerId:"kenji",japanese:<>昨日はお休みでしたね。用事は済みましたか。</>,romaji:"Kinou wa oyasumi deshita ne. Youji wa sumimashita ka?",translation:"Kemarin kamu libur, ya. Apakah keperluannya sudah selesai?",audioFileName:"irodori-elementary1-14-a05-l01.mp3"},
{speakerId:"yui",japanese:<>はい。おかげさまで、終わりました。</>,romaji:"Hai. Okagesama de, owarimashita.",translation:"Ya. Berkat bantuan dan pengertiannya, sudah selesai.",audioFileName:"irodori-elementary1-14-a05-l02.mp3"},
{speakerId:"kenji",japanese:<>それはよかったです。</>,romaji:"Sore wa yokatta desu.",translation:"Syukurlah kalau begitu.",audioFileName:"irodori-elementary1-14-a05-l03.mp3"},
{speakerId:"yui",japanese:<>昨日は、休んですみませんでした。ありがとうございました。</>,romaji:"Kinou wa, yasunde sumimasen deshita. Arigatou gozaimashita.",translation:"Maaf kemarin saya tidak masuk. Terima kasih atas pengertiannya.",audioFileName:"irodori-elementary1-14-a05-l04.mp3"},
];

const canDos=[
{id:"call-workplace-late-or-absent",text:"Menelepon tempat kerja untuk memberi kabar bahwa akan terlambat atau tidak masuk."},
{id:"ask-coworker-brief-permission",text:"Meminta izin kepada rekan kerja ketika perlu meninggalkan area kerja sebentar."},
{id:"request-leave-in-advance",text:"Meminta izin kepada atasan terlebih dahulu ketika ingin mengambil cuti atau pulang lebih awal."},
{id:"ask-how-to-fill-leave-form",text:"Menanyakan cara mengisi formulir cuti dan memahami penjelasan setiap bagiannya."},
{id:"confirm-leave-details",text:"Memastikan periode cuti, alasan, dan kontak yang ditulis pada formulir sudah benar."},
];

const reasonExamples=[
{id:"traffic",label:"Keterlambatan transportasi",sentence:"電車が遅れていて、少し遅れます。",reading:"Densha ga okurete ite, sukoshi okuremasu.",meaning:"Kereta terlambat, jadi saya akan sedikit terlambat."},
{id:"appointment",label:"Keperluan pribadi",sentence:"用事があって、午後から休みたいんです。",reading:"Youji ga atte, gogo kara yasumitai n desu.",meaning:"Ada keperluan, jadi saya ingin izin mulai siang."},
{id:"schedule",label:"Urusan administrasi",sentence:"市役所に行かなければならないんです。",reading:"Shiyakusho ni ikanakereba naranai n desu.",meaning:"Saya harus pergi ke kantor pemerintahan kota."},
];

const permissionExamples=[
{id:"break",request:"少し休憩してもいいですか。",meaning:"Bolehkah saya beristirahat sebentar?",reply:"はい、どうぞ。",replyMeaning:"Ya, silakan."},
{id:"water",request:"飲み物を買って来てもいいですか。",meaning:"Bolehkah saya pergi membeli minuman lalu kembali?",reply:"すみません。あとにしてください。",replyMeaning:"Maaf, tolong lakukan nanti."},
{id:"restroom",request:"トイレに行って来てもいいですか。",meaning:"Bolehkah saya pergi ke toilet lalu kembali?",reply:"もちろんです。",replyMeaning:"Tentu saja."},
];

const leaveFormFields=[
{label:"所属",reading:"しょぞく · shozoku",meaning:"Bagian / tim",example:"企画チーム"},
{label:"氏名",reading:"しめい · shimei",meaning:"Nama lengkap",example:"山田 ユイ"},
{label:"期間",reading:"きかん · kikan",meaning:"Periode cuti",example:"11月30日 午後から"},
{label:"理由",reading:"りゆう · riyuu",meaning:"Alasan",example:"私用"},
{label:"連絡先",reading:"れんらくさき · renrakusaki",meaning:"Kontak selama cuti",example:"メールアドレス"},
{label:"備考",reading:"びこう · bikou",meaning:"Catatan tambahan",example:"必要な場合のみ記入"},
];

const vocabRows=[
["用事","ようじ · youji","Keperluan / urusan"],
["氏名","しめい · shimei","Nama lengkap"],
["理由","りゆう · riyuu","Alasan"],
["連絡先","れんらくさき · renrakusaki","Kontak"],
["別に","べつに · betsuni","Tidak secara khusus / tidak masalah (sesuai konteks)"],
["早く","はやく · hayaku","Lebih awal / cepat"],
["休む","やすむ · yasumu","Beristirahat / tidak masuk"],
["取る","とる · toru","Mengambil"],
["帰る","かえる · kaeru","Pulang / kembali"],
["伝える","つたえる · tsutaeru","Menyampaikan"],
["休み","やすみ · yasumi","Libur / istirahat"],
["休暇","きゅうか · kyuuka","Cuti"],
["遅刻","ちこく · chikoku","Keterlambatan"],
["遅れる","おくれる · okureru","Terlambat"],
["早退","そうたい · soutai","Pulang lebih awal"],
["職場","しょくば · shokuba","Tempat kerja"],
["上司","じょうし · joushi","Atasan"],
["同僚","どうりょう · douryou","Rekan kerja"],
["電話","でんわ · denwa","Telepon"],
["連絡する","れんらくする · renraku suru","Menghubungi / memberi kabar"],
["休暇届","きゅうかとどけ · kyuuka todoke","Formulir permohonan cuti"],
["所属","しょぞく · shozoku","Bagian / tim"],
["期間","きかん · kikan","Periode"],
["私用","しよう · shiyou","Keperluan pribadi"],
["提出する","ていしゅつする · teishutsu suru","Menyerahkan / mengajukan"],
];

const kanjiWords=[
["用事","ようじ · youji","Keperluan / urusan"],
["氏名","しめい · shimei","Nama lengkap"],
["理由","りゆう · riyuu","Alasan"],
["連絡先","れんらくさき · renrakusaki","Kontak"],
["別に","べつに · betsuni","Tidak secara khusus / tidak masalah"],
["早く","はやく · hayaku","Lebih awal / cepat"],
["休む","やすむ · yasumu","Beristirahat / tidak masuk"],
["取る","とる · toru","Mengambil"],
["帰る","かえる · kaeru","Pulang / kembali"],
["伝える","つたえる · tsutaeru","Menyampaikan"],
];

const ratingOptions:{value:IrodoriRating;label:string}[]=[
{value:1,label:"★☆☆ Masih perlu latihan"},
{value:2,label:"★★☆ Sudah bisa"},
{value:3,label:"★★★ Bisa dengan baik"},
];

type Task={prompt:ReactNode;options:{key:string;label:ReactNode}[];answer:string;explanation:ReactNode};

const practiceTasks:Task[]=[
{prompt:<>Kalimat 「電車が遅れていて、少し遅れます」 memakai bentuk ～ていて untuk …</>,options:[{key:"a",label:"Menyatakan alasan keterlambatan."},{key:"b",label:"Meminta izin cuti."},{key:"c",label:"Menanyakan nama lengkap."}],answer:"a",explanation:<>Bentuk ～て、～ dapat menghubungkan dua kalimat. Bagian pertama menjelaskan alasan bagian kedua.</>},
{prompt:<>Fungsi 「それで」 dalam 「電車が遅れています。それで、遅刻します」 adalah …</>,options:[{key:"a",label:"Menghubungkan alasan dengan akibat."},{key:"b",label:"Menanyakan pilihan."},{key:"c",label:"Memberi perintah."}],answer:"a",explanation:<>それで berarti &quot;karena itu / jadi&quot; dan menghubungkan alasan dengan akibat.</>},
{prompt:<>Pilih bentuk yang tepat untuk meminta izin sebentar kepada rekan kerja.</>,options:[{key:"a",label:"少し休憩してもいいですか。"},{key:"b",label:"少し休憩しなければなりませんか。"},{key:"c",label:"少し休憩しましたか。"}],answer:"a",explanation:<>V-てもいいですか digunakan untuk meminta izin; kata kerja memakai bentuk て.</>},
{prompt:<>Bentuk yang lebih sopan untuk bertanya kepada atasan adalah …</>,options:[{key:"a",label:"休みを取ってもいいでしょうか。"},{key:"b",label:"休みを取ってもいいだろう。"},{key:"c",label:"休みを取りますか。"}],answer:"a",explanation:<>V-てもいいでしょうか adalah bentuk permintaan izin yang lebih sopan daripada V-てもいいですか.</>},
{prompt:<>「市役所に行かなければなりません」 berarti …</>,options:[{key:"a",label:"Harus pergi ke kantor pemerintahan kota."},{key:"b",label:"Boleh pergi ke kantor pemerintahan kota."},{key:"c",label:"Tidak jadi pergi ke kantor pemerintahan kota."}],answer:"a",explanation:<>V-なければなりません menyatakan sesuatu yang harus dilakukan.</>},
{prompt:<>Pada formulir cuti, bagian 「連絡先」 digunakan untuk menulis …</>,options:[{key:"a",label:"Informasi kontak."},{key:"b",label:"Nama tim."},{key:"c",label:"Alasan cuti."}],answer:"a",explanation:<>連絡先 berarti informasi atau alamat kontak yang dapat dihubungi.</>},
];

const quizQuestions:Task[]=[
{prompt:<>Apa arti 「遅刻」?</>,options:[{key:"a",label:"Terlambat."},{key:"b",label:"Cuti."},{key:"c",label:"Rekan kerja."}],answer:"a",explanation:<>遅刻（ちこく）berarti keterlambatan.</>},
{prompt:<>Pilih kalimat untuk memberi kabar bahwa kamu akan terlambat.</>,options:[{key:"a",label:"少し遅れます。"},{key:"b",label:"休暇届を書きます。"},{key:"c",label:"休憩してもいいですか。"}],answer:"a",explanation:<>少し遅れます berarti saya akan sedikit terlambat.</>},
{prompt:<>Apa arti 「用事があって、午後から休みたいんです」?</>,options:[{key:"a",label:"Ada keperluan, jadi saya ingin izin mulai siang."},{key:"b",label:"Saya sudah bekerja sejak siang."},{key:"c",label:"Saya akan menghubungi rekan kerja."}],answer:"a",explanation:<>用事があって menjelaskan alasan, sedangkan 午後から休みたいんです menyatakan ingin izin mulai siang.</>},
{prompt:<>Pilih pola untuk meminta izin kepada rekan kerja.</>,options:[{key:"a",label:"V-てもいいですか。"},{key:"b",label:"V-なければなりません。"},{key:"c",label:"V-ると。"}],answer:"a",explanation:<>V-てもいいですか digunakan untuk meminta izin melakukan sesuatu.</>},
{prompt:<>Apa perbedaan umum 「てもいいですか」 dan 「てもいいでしょうか」?</>,options:[{key:"a",label:"てもいいでしょうか lebih sopan."},{key:"b",label:"てもいいでしょうか adalah bentuk lampau."},{key:"c",label:"Keduanya berarti larangan."}],answer:"a",explanation:<>てもいいでしょうか adalah cara yang lebih sopan untuk meminta izin.</>},
{prompt:<>Kalimat 「休まなければなりません」 berarti …</>,options:[{key:"a",label:"Harus beristirahat / harus tidak masuk."},{key:"b",label:"Boleh beristirahat."},{key:"c",label:"Sudah beristirahat."}],answer:"a",explanation:<>なければなりません menyatakan kewajiban atau keharusan.</>},
{prompt:<>Pilih kalimat yang menyatakan sebab dengan kata sifat-i.</>,options:[{key:"a",label:"道が混んでいて、遅れます。"},{key:"b",label:"道が混みますと、遅れます。"},{key:"c",label:"道が混んだでしょうか。"}],answer:"a",explanation:<>kata sifat -i 混んでいる dapat berubah menjadi 混んでいて untuk menghubungkan alasan.</>},
{prompt:<>Apa arti 「それで」?</>,options:[{key:"a",label:"Karena itu / jadi."},{key:"b",label:"Namun demikian."},{key:"c",label:"Sebelum itu."}],answer:"a",explanation:<>それで menghubungkan alasan dengan akibat yang dijelaskan setelahnya.</>},
{prompt:<>Pada formulir cuti, bagian 「期間」 menunjukkan …</>,options:[{key:"a",label:"Periode tanggal cuti."},{key:"b",label:"Nama lengkap."},{key:"c",label:"Kontak darurat."}],answer:"a",explanation:<>期間 berarti rentang waktu atau periode.</>},
{prompt:<>Apa arti 「みなさんに伝えてください」?</>,options:[{key:"a",label:"Tolong sampaikan kepada semuanya."},{key:"b",label:"Tolong pulang lebih awal."},{key:"c",label:"Tolong isi nama tim."}],answer:"a",explanation:<>伝えてください adalah bentuk permintaan dari 伝える, menyampaikan atau memberitahu.</>},
];

const simulations=[
{title:"01 · Menelepon tempat kerja",heading:"Memberi kabar akan terlambat",prompt:"Kereta mengalami keterlambatan. Kamu perlu menelepon tempat kerja dan memberi tahu perkiraan keterlambatan dengan sopan.",japanese:<>電車が遅れていて、15分ぐらい遅れます。</>,translation:"Kereta terlambat, jadi saya akan terlambat sekitar 15 menit.",options:[{key:"a",label:"電車が遅れていて、15分ぐらい遅れます。",meaning:"Memberi alasan dan perkiraan keterlambatan."},{key:"b",label:"電車が遅れてもいいですか。",meaning:"Bukan ungkapan untuk melaporkan keterlambatan diri."},{key:"c",label:"電車を休みます。",meaning:"Susunan kata tidak tepat."}],answer:"a",explanation:"～ていて menghubungkan alasan (kereta terlambat) dengan akibat (saya akan terlambat)."},
{title:"02 · Meminta izin sebentar",heading:"Meminta izin mengambil istirahat singkat",prompt:"Kamu perlu beristirahat sebentar dan meminta izin kepada rekan kerja.",japanese:<>少し休憩してもいいですか。</>,translation:"Bolehkah saya beristirahat sebentar?",options:[{key:"a",label:"少し休憩してもいいですか。",meaning:"Meminta izin dengan V-てもいいですか."},{key:"b",label:"少し休憩しなければなりません。",meaning:"Menyatakan keharusan, bukan meminta izin."},{key:"c",label:"少し休憩しました。",meaning:"Menyatakan sudah beristirahat."}],answer:"a",explanation:"休憩する berubah menjadi 休憩して, lalu ditambah もいいですか untuk meminta izin."},
{title:"03 · Meminta izin cuti",heading:"Berbicara kepada atasan lebih dahulu",prompt:"Kamu perlu pergi ke kantor pemerintahan kota pada Senin siang minggu depan. Pilih permintaan izin yang sopan dan alasan yang sesuai.",japanese:<>来週の月曜日、午後から休みを取ってもいいでしょうか。市役所に行かなければならないんです。</>,translation:"Bolehkah saya cuti mulai Senin siang minggu depan? Saya harus pergi ke kantor pemerintahan kota.",options:[{key:"a",label:"休みを取ってもいいでしょうか。市役所に行かなければならないんです。",meaning:"Meminta izin dengan sopan dan menjelaskan alasan."},{key:"b",label:"休みを取ってください。市役所に行きますか。",meaning:"Memerintah orang lain dan bertanya."},{key:"c",label:"休みを取ると、いいです。",meaning:"Tidak membentuk permintaan izin yang tepat."}],answer:"a",explanation:"てもいいでしょうか adalah permintaan izin yang sopan; なければならないんです menjelaskan sesuatu yang harus dilakukan."},
{title:"04 · Memahami formulir cuti",heading:"Menemukan bagian yang benar",prompt:"Kamu perlu menuliskan alasan mengambil cuti. Bagian formulir mana yang harus diisi?",japanese:<>理由</>,translation:"Alasan.",options:[{key:"a",label:"理由",meaning:"Bagian untuk menuliskan alasan."},{key:"b",label:"氏名",meaning:"Bagian nama lengkap."},{key:"c",label:"期間",meaning:"Bagian periode cuti."}],answer:"a",explanation:"理由（りゆう）berarti alasan. Pastikan mengisi formulir sesuai aturan tempat kerja."},
{title:"05 · Menyampaikan pesan",heading:"Meminta rekan menyampaikan kabar",prompt:"Kamu sudah memberi kabar kepada satu rekan dan ingin memintanya menyampaikan informasi itu kepada seluruh tim.",japanese:<>みなさんに伝えていただけますか。</>,translation:"Bisakah tolong sampaikan kepada semuanya?",options:[{key:"a",label:"みなさんに伝えていただけますか。",meaning:"Meminta bantuan menyampaikan informasi dengan sopan."},{key:"b",label:"みなさんが帰ってもいいですか。",meaning:"Menanyakan izin orang lain untuk pulang."},{key:"c",label:"みなさんの理由を書きます。",meaning:"Mengatakan akan menulis alasan semua orang."}],answer:"a",explanation:"伝えていただけますか adalah permintaan sopan agar lawan bicara menyampaikan informasi."},
];

export default function IrodoriElementaryOneLessonFourteenPage() {
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
  <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"><ArrowLeft size={15}/> Kembali ke Dasar 1</Link>
  <header className="relative isolate overflow-hidden rounded-[28px] border border-[#8D514B]/35 bg-gradient-to-br from-[#382725] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
   <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D08A7D]/[0.08]">休</div>
   <div className="relative z-10">
    <p className="text-[9px] font-black tracking-[0.24em] text-[#D6A39A]">IRODORI • DASAR 1 A2 • PELAJARAN 14</p>
    <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Bolehkah saya izin tidak masuk sehari?</h1>
    <p className="mt-2 text-sm font-semibold text-[#D6A39A]">休みを取ってもいいでしょうか？</p>
    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar memberi kabar saat terlambat atau tidak masuk, meminta izin singkat kepada rekan kerja, mengajukan cuti kepada atasan, dan memahami formulir permohonan cuti.</p>
    <div className="mt-5 flex flex-wrap gap-2">
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#D6A39A]"/>Komunikasi kerja</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Clock3 size={14} className="text-[#D6A39A]"/>Izin dan waktu</span>
     <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><FileText size={14} className="text-[#D6A39A]"/>Formulir cuti</span>
    </div>
   </div>
  </header>

  <section className="rounded-2xl border border-[#8D514B]/20 bg-[#241D1C]/80 p-4 md:p-5">
   <div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#D6A39A]"/><h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2></div>
   <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target pertama mengikuti target komunikasi resmi Irodori. Target terakhir merupakan latihan penguatan Fude.</p>
   <div className="mt-3 grid gap-2 sm:grid-cols-2">{canDos.map((item,index)=><article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#D6A39A]">{index<4?"CAN-DO UTAMA":"LATIHAN PENGUATAN"} · 0{index+1}</p><p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">KOSAKATA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Keterlambatan, izin, dan cuti</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata untuk memberi kabar, menjelaskan alasan, meminta izin, dan mengisi formulir.</p></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{vocabRows.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6A39A]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">DIALOG 01–05</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Memberi kabar dan meminta izin</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Semua dialog ditulis orisinal oleh Fude. Perhatikan cara memberi alasan, meminta izin dengan sopan, dan memastikan informasi cuti dipahami.</p></div>
   <div className="space-y-4">
    <IrodoriConversation title="Menelepon karena akan terlambat" speakers={[speakers.yui,speakers.kenji]} utterances={phoneCallConversation}/>
    <IrodoriConversation title="Meminta izin istirahat sebentar" speakers={[speakers.sota,speakers.akiko]} utterances={askingBriefPermissionConversation}/>
    <IrodoriConversation title="Meminta izin cuti kepada atasan" speakers={[speakers.yui,speakers.kenji]} utterances={askingDayOffConversation}/>
    <IrodoriConversation title="Bertanya cara mengisi formulir cuti" speakers={[speakers.sota,speakers.akiko]} utterances={fillingLeaveFormConversation}/>
    <IrodoriConversation title="Kembali bekerja setelah mengambil cuti" speakers={[speakers.kenji,speakers.yui]} utterances={afterReturnConversation}/>
   </div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">MENJELASKAN ALASAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Alasan dan kabar disampaikan dengan jelas</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Bentuk ～で／～くて／～て menghubungkan alasan dengan informasi berikutnya. それで membantu menunjukkan akibatnya.</p></div>
   <div className="grid gap-3 sm:grid-cols-3">{reasonExamples.map(item=><article key={item.id} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#D6A39A]">{item.label}</p><p className="mt-3 font-mincho text-sm leading-6 text-[#F1EBDD]">{item.sentence}</p><p className="mt-1 text-[9px] text-[#D6A39A]">{item.reading}</p><p className="mt-2 text-xs leading-5 text-[#A9A398]">{item.meaning}</p></article>)}</div>
   <div className="rounded-xl border border-[#8D514B]/20 bg-[#241D1C]/80 p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#D6A39A]">S1。 それで、S2</p><p className="mt-2 font-mincho text-sm leading-6 text-[#F1EBDD]">電車が遅れています。それで、少し遅刻します。</p><p className="mt-1 text-xs text-[#A9A398]">Kereta terlambat. Karena itu, saya akan sedikit terlambat.</p></div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">MEMINTA IZIN SINGKAT</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pilih ungkapan sesuai situasi</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan ～てもいいですか untuk meminta izin kepada rekan kerja. Jawaban dapat berupa persetujuan atau permintaan untuk menunggu.</p></div>
   <div className="grid gap-3 sm:grid-cols-3">{permissionExamples.map(item=><article key={item.id} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="font-mincho text-sm leading-6 text-[#F1EBDD]">{item.request}</p><p className="mt-1 text-xs text-[#A9A398]">{item.meaning}</p><div className="mt-3 rounded-lg border border-[#8D514B]/20 bg-[#2A211F] p-3"><p className="font-mincho text-sm text-[#E8B6AC]">{item.reply}</p><p className="mt-1 text-[10px] text-[#A9A398]">{item.replyMeaning}</p></div></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">MENGAJUKAN CUTI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Meminta izin dengan lebih sopan kepada atasan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Untuk meminta izin sebelumnya kepada atasan, gunakan ～てもいいでしょうか. Sertakan alasan secara singkat dan jelas.</p></div>
   <div className="rounded-xl border border-[#8D514B]/20 bg-[#241D1C]/80 p-4"><p className="font-mincho text-base leading-7 text-[#F1EBDD]">来週の月曜日、午後から休みを取ってもいいでしょうか。</p><p className="mt-1 text-xs text-[#A9A398]">Bolehkah saya mengambil cuti mulai Senin siang minggu depan?</p><p className="mt-3 font-mincho text-base leading-7 text-[#E8B6AC]">市役所に行かなければならないんです。</p><p className="mt-1 text-xs text-[#A9A398]">Saya harus pergi ke kantor pemerintahan kota.</p><p className="mt-3 border-t border-white/[0.06] pt-3 text-[10px] leading-5 text-[#A9A398]">Ketentuan persetujuan dan batas pengajuan cuti dapat berbeda di setiap tempat kerja. Ikuti aturan yang berlaku di tempat kerja masing-masing.</p></div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">MEMBACA FORMULIR CUTI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali bagian-bagian 休暇届</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Formulir berikut adalah contoh fiktif untuk latihan membaca. Periksa nama bagian dan informasi yang perlu ditulis.</p></div>
   <article className="overflow-hidden rounded-2xl border border-[#8D514B]/25 bg-[#211D1B]">
    <div className="border-b border-white/[0.08] bg-[#302725] px-4 py-3"><p className="text-[9px] font-black tracking-[0.16em] text-[#D6A39A]">FORMULIR CONTOH · FIKTIF</p><h3 className="mt-1 font-mincho text-xl font-bold text-[#F1EBDD]">休暇届</h3><p className="mt-1 text-[10px] text-[#A9A398]">Permohonan cuti</p></div>
    <div className="grid gap-2 p-4 sm:grid-cols-2">{leaveFormFields.map(item=><div key={item.label} className="rounded-lg border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-bold text-[#D6A39A]">{item.label} · {item.reading}</p><p className="mt-1 font-mincho text-sm text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p><p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{item.meaning}</p></div>)}</div>
    <p className="border-t border-white/[0.06] px-4 py-3 text-[10px] leading-5 text-[#A9A398]">Contoh ini untuk latihan bahasa. Isian dan proses pengajuan yang sebenarnya mengikuti ketentuan tempat kerja.</p>
   </article>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{[["いつから","Itsu kara","Mulai kapan"],["いつまで","Itsu made","Sampai kapan"],["何日間","Nannichikan","Berapa hari"],["所属","Shozoku","Bagian / tim"],["理由","Riyuu","Alasan"],["連絡先","Renrakusaki","Kontak"]].map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="font-mincho text-base text-[#F1EBDD]">{jp}</p><p className="mt-1 text-[9px] text-[#D6A39A]">{reading}</p><p className="mt-1 text-[10px] text-[#A9A398]">{meaning}</p></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Enam pola untuk memberi alasan dan meminta izin</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari cara menghubungkan alasan, meminta izin secara langsung atau lebih sopan, dan menjelaskan kewajiban.</p></div>
   {[
    {title:"01 · Menghubungkan sebab atau alasan",pattern:"Nで、～ ／ ナA-で、～ ／ イA-くて、～ ／ V-て、～",example:<>電車が遅れていて、少し遅れます。<br/>用事があって、午後から休みます。</>,note:"Dua kalimat dapat dihubungkan dengan で／くて／て. Kalimat pertama menjelaskan sebab atau alasan untuk kalimat kedua. Untuk bentuk V-ている, gunakan V-ていて: 遅れている → 遅れていて."},
    {title:"02 · Menyatakan akibat dari alasan",pattern:"S1。それで、S2",example:<>市役所に行きます。それで、午後から休みます。</>,note:"それで berarti 'karena itu / jadi'. Kalimat pertama menyatakan alasan dan kalimat kedua menyatakan akibatnya."},
    {title:"03 · Meminta izin",pattern:"V-て ＋ もいいですか？",example:<>少し休憩してもいいですか。</>,note:"Gunakan bentuk て dari kata kerja sebelum もいいですか untuk meminta izin. Contoh: 休憩します → 休憩してもいいですか."},
    {title:"04 · Meminta izin dengan lebih sopan",pattern:"V-て ＋ もいいでしょうか？",example:<>明日の午後、早く帰ってもいいでしょうか。</>,note:"Pola ini lebih sopan daripada ～てもいいですか dan cocok untuk meminta izin kepada atasan. Contoh: 帰ります → 帰ってもいいでしょうか."},
    {title:"05 · Menyatakan sesuatu yang harus dilakukan",pattern:"V-なければなりません ／ V-なければならない",example:<>市役所に行かなければなりません。</>,note:"Ubah bentuk ない pada kata kerja menjadi なければなりません. Bentuk biasa adalah なければならない. Contoh: 行かない → 行かなければなりません."},
    {title:"06 · Menjelaskan situasi atau alasan",pattern:"V-る ＋ んです ／ V-なければならない ＋ んです",example:<>市役所に行くんです。<br/>用事があって、休まなければならないんです。</>,note:"～んです digunakan untuk menjelaskan situasi atau alasan kepada lawan bicara. Dalam lesson ini, bentuknya dipelajari setelah kata kerja bentuk kamus dan setelah なければならない."},
   ].map(item=><article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#C98E84]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p><p className="mt-2 font-mincho text-base leading-7 text-[#E8B6AC]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>)}
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">KANJI DAN KATA PENTING</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kenali tulisan pada komunikasi dan formulir</h2></div>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{kanjiWords.map(([jp,reading,meaning])=><article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6A39A]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}</div>
  </section>

  <section className="space-y-4">
   <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C98E84]">SIMULASI INTERAKTIF</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan bahasa Jepang dalam situasi sehari-hari</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Selesaikan lima situasi tentang memberi kabar, meminta izin, mengajukan cuti, membaca formulir, dan menyampaikan pesan.</p></div>
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
   <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Selesaikan praktik, lima simulasi, dan kuis sebelum menilai kemampuan. Progres Dasar 1 tersimpan dalam jalur Irodori, terpisah dari Minna no Nihongo dan JLPT.</p>
   <div className="mt-4 space-y-3">{canDos.map((item,index)=><div key={item.id} className="rounded-xl border border-white/[0.07] bg-black/15 p-3"><p className="text-xs font-semibold leading-5 text-[#EAE6DD]"><span className="mr-2 text-[#E8B6AC]">{String(index+1).padStart(2,"0")}</span>{item.text}</p><div className="mt-3 flex flex-wrap gap-2">{ratingOptions.map(option=><button key={option.value} type="button" disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete} aria-pressed={visibleRatings[item.id]===option.value} onClick={()=>{const next={...visibleRatings,[item.id]:option.value};setRatings(next);saveIrodoriSelfEvaluation(lessonId,next);}} className={"rounded-lg border px-3 py-2 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 "+(visibleRatings[item.id]===option.value?"border-[#C98E84]/60 bg-[#8D514B]/20 text-[#F2CDC5]":"border-white/[0.08] bg-[#24221F] text-[#A3A099]")}><JapaneseReading allowIndexFallback>{option.label}</JapaneseReading></button>)}</div></div>)}</div>
   <div className="mt-5 flex flex-wrap items-center justify-between gap-3">{isCompleted?<span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-200"><CheckCircle2 size={15}/> Pelajaran selesai</span>:<button type="button" onClick={()=>completeIrodoriLesson(lessonId)} disabled={!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated} className="inline-flex items-center gap-2 rounded-xl bg-[#8D514B] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#75413C] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"><CheckCircle2 size={15}/> Tandai pelajaran selesai</button>}
    <Link href="/irodori/elementary-1" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-[#C7C1B5] transition-colors hover:border-[#C98E84]/40 hover:text-[#EAE6DD]">Daftar pelajaran <ArrowLeft size={15} className="rotate-180"/></Link>
   </div>
   {(!quizSubmitted||!practiceIsCorrect||!simulationsComplete||!canDosRated)&&<p className="mt-2 text-[10px] leading-5 text-[#817A73]">Selesaikan kuis, jawab benar seluruh enam soal praktik, selesaikan kelima simulasi dengan tepat, lalu isi kelima penilaian target komunikasi.</p>}
  </section>
  <p className="text-center text-[10px] leading-5 text-[#746F65]">Dialog, formulir contoh, dan situasi latihan dibuat orisinal oleh Fude untuk melatih komunikasi tentang keterlambatan, izin, dan cuti.</p>
 </main>
 );
}
