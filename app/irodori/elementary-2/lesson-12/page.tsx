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
const lessonId = "elementary2-12";




const askPurchaseAdviceConversation: IrodoriUtterance[] = [
 { speakerId:"yui", japanese:<>新しいイヤホンがほしいんですけど、何がいいですか。</>, romaji:"Atarashii iyahon ga hoshii n desu kedo, nani ga ii desu ka?", translation:"Saya ingin earphone baru. Yang mana yang bagus?", audioFileName:"irodori-elementary2-12-a01-l01.mp3" },
 { speakerId:"sota", japanese:<>音がよくて、耳が痛くなりにくいものがいいと思います。</>, romaji:"Oto ga yokute, mimi ga itaku nari nikui mono ga ii to omoimasu.", translation:"Menurut saya, pilih yang suaranya bagus dan tidak mudah membuat telinga sakit.", audioFileName:"irodori-elementary2-12-a01-l02.mp3" },
 { speakerId:"yui", japanese:<>どこで買ったらいいですか。</>, romaji:"Doko de kattara ii desu ka?", translation:"Sebaiknya saya membeli di mana?", audioFileName:"irodori-elementary2-12-a01-l03.mp3" },
 { speakerId:"sota", japanese:<>駅の近くに電気屋があります。店員さんに相談できますよ。</>, romaji:"Eki no chikaku ni denkiya ga arimasu. Ten'in-san ni soudan dekimasu yo.", translation:"Ada toko elektronik dekat stasiun. Kamu bisa berkonsultasi dengan pegawainya.", audioFileName:"irodori-elementary2-12-a01-l04.mp3" },
];
const secondhandListingConversation: IrodoriUtterance[] = [
 { speakerId:"akiko", japanese:<>この炊飯器、中古ですが、説明書がついています。</>, romaji:"Kono suihanki, chuuko desu ga, setsumeisho ga tsuite imasu.", translation:"Penanak nasi ini bekas, tetapi dilengkapi buku petunjuk.", audioFileName:"irodori-elementary2-12-a02-l01.mp3" },
 { speakerId:"kenji", japanese:<>傷や汚れはありますか。</>, romaji:"Kizu ya yogore wa arimasu ka?", translation:"Apakah ada goresan atau kotoran?", audioFileName:"irodori-elementary2-12-a02-l02.mp3" },
 { speakerId:"akiko", japanese:<>少し傷があります。写真と説明をよく確認したほうがいいですね。</>, romaji:"Sukoshi kizu ga arimasu. Shashin to setsumei o yoku kakunin shita hou ga ii desu ne.", translation:"Ada sedikit goresan. Sebaiknya periksa foto dan deskripsinya dengan teliti.", audioFileName:"irodori-elementary2-12-a02-l03.mp3" },
 { speakerId:"kenji", japanese:<>そうですね。実際に買うときは、家の人と相談しましょう。</>, romaji:"Sou desu ne. Jissai ni kau toki wa, ie no hito to soudan shimashou.", translation:"Betul. Saat benar-benar akan membeli, mari berdiskusi dengan keluarga.", audioFileName:"irodori-elementary2-12-a02-l04.mp3" },
];
const compareVacuumModelsConversation: IrodoriUtterance[] = [
 { speakerId:"yui", japanese:<>この掃除機とあの掃除機と、どちらが軽いですか。</>, romaji:"Kono soujiki to ano soujiki to, dochira ga karui desu ka?", translation:"Di antara penyedot debu ini dan yang itu, mana yang lebih ringan?", audioFileName:"irodori-elementary2-12-a03-l01.mp3" },
 { speakerId:"sota", japanese:<>こちらのほうが軽くて、動かしやすいですよ。</>, romaji:"Kochira no hou ga karukute, ugokashi yasui desu yo.", translation:"Yang ini lebih ringan dan mudah digerakkan.", audioFileName:"irodori-elementary2-12-a03-l02.mp3" },
 { speakerId:"yui", japanese:<>でも、長い時間使いたいです。</>, romaji:"Demo, nagai jikan tsukai tai desu.", translation:"Tetapi saya ingin menggunakannya dalam waktu lama.", audioFileName:"irodori-elementary2-12-a03-l03.mp3" },
 { speakerId:"sota", japanese:<>それなら、連続使用時間が長いモデルのほうがいいですね。</>, romaji:"Sore nara, renzoku shiyou jikan ga nagai moderu no hou ga ii desu ne.", translation:"Kalau begitu, model dengan waktu penggunaan terus-menerus yang lebih lama lebih cocok.", audioFileName:"irodori-elementary2-12-a03-l04.mp3" },
];
const readPriceTagConversation: IrodoriUtterance[] = [
 { speakerId:"akiko", japanese:<>この価格は、消費税込みですか。</>, romaji:"Kono kakaku wa, shouhizei komi desu ka?", translation:"Apakah harga ini sudah termasuk pajak konsumsi?", audioFileName:"irodori-elementary2-12-a04-l01.mp3" },
 { speakerId:"kenji", japanese:<>いいえ、税別です。レジで合計金額を確認してください。</>, romaji:"Iie, zeibetsu desu. Reji de goukei kingaku o kakunin shite kudasai.", translation:"Belum, harga sebelum pajak. Silakan periksa jumlah total di kasir.", audioFileName:"irodori-elementary2-12-a04-l02.mp3" },
 { speakerId:"akiko", japanese:<>この値段は、いつまでですか。</>, romaji:"Kono nedan wa, itsu made desu ka?", translation:"Harga ini berlaku sampai kapan?", audioFileName:"irodori-elementary2-12-a04-l03.mp3" },
 { speakerId:"kenji", japanese:<>今週の日曜日までです。</>, romaji:"Konshuu no nichiyoubi made desu.", translation:"Sampai hari Minggu minggu ini.", audioFileName:"irodori-elementary2-12-a04-l04.mp3" },
];
const askForDiscountConversation: IrodoriUtterance[] = [
 { speakerId:"yui", japanese:<>この掃除機について、もう少し教えてください。</>, romaji:"Kono soujiki ni tsuite, mou sukoshi oshiete kudasai.", translation:"Tolong jelaskan sedikit lagi tentang penyedot debu ini.", audioFileName:"irodori-elementary2-12-a05-l01.mp3" },
 { speakerId:"sota", japanese:<>軽くて、使いやすいモデルです。お手入れも簡単ですよ。</>, romaji:"Karukute, tsukai yasui moderu desu. O-teire mo kantan desu yo.", translation:"Ini model yang ringan dan mudah digunakan. Perawatannya juga mudah.", audioFileName:"irodori-elementary2-12-a05-l02.mp3" },
 { speakerId:"yui", japanese:<>そうですか。これ、少し安くなりますか。</>, romaji:"Sou desu ka. Kore, sukoshi yasuku narimasu ka?", translation:"Begitu, ya. Apakah harganya bisa sedikit lebih murah?", audioFileName:"irodori-elementary2-12-a05-l03.mp3" },
 { speakerId:"sota", japanese:<>確認しますので、少々お待ちください。</>, romaji:"Kakunin shimasu node, shoushou omachi kudasai.", translation:"Saya akan memeriksanya, mohon tunggu sebentar.", audioFileName:"irodori-elementary2-12-a05-l04.mp3" },
];
const canDos = [
 { id:"ask-product-buying-advice", source:"CAN-DO 51", text:"Meminta saran tentang model barang dan tempat membelinya ketika ingin membeli sesuatu." },
 { id:"understand-secondhand-listing", source:"CAN-DO 52", text:"Memahami informasi pada iklan barang di aplikasi atau situs pasar barang bekas, seperti kondisi, harga, dan ongkos kirim." },
 { id:"read-product-comparison", source:"CAN-DO 53", text:"Membaca tabel perbandingan produk dan label harga untuk mendapatkan informasi yang diperlukan." },
 { id:"ask-store-product-price", source:"CAN-DO 54", text:"Bertanya kepada pegawai toko tentang produk dan meminta potongan harga dengan sopan." },
];
const vocabRows = [
 ["家電","かでん · kaden","Peralatan rumah tangga elektronik"], ["電気製品","でんきせいひん · denki seihin","Produk elektronik"],
 ["冷蔵庫","れいぞうこ · reizouko","Kulkas"], ["洗濯機","せんたくき · sentakuki","Mesin cuci"],
 ["炊飯器","すいはんき · suihanki","Penanak nasi"], ["電子レンジ","でんしレンジ · denshi renji","Microwave"],
 ["掃除機","そうじき · soujiki","Penyedot debu"], ["扇風機","せんぷうき · senpuuki","Kipas angin"],
 ["テレビ","テレビ · terebi","Televisi"], ["パソコン","パソコン · pasokon","Komputer pribadi"],
 ["タブレット","タブレット · taburetto","Tablet"], ["スマホ","スマホ · sumaho","Ponsel pintar"],
 ["イヤホン","イヤホン · iyahon","Earphone"], ["ドライヤー","ドライヤー · doraiyaa","Pengering rambut"],
 ["アイロン","アイロン · airon","Setrika"], ["メーカー","メーカー · meekaa","Produsen atau merek pembuat"],
 ["商品","しょうひん · shouhin","Barang atau produk"], ["製品","せいひん · seihin","Produk"],
 ["型","かた · kata","Tipe atau bentuk model"], ["モデル","モデル · moderu","Model"],
 ["新品","しんぴん · shinpin","Barang baru"], ["中古","ちゅうこ · chuuko","Barang bekas"],
 ["状態","じょうたい · joutai","Kondisi"], ["傷","きず · kizu","Goresan atau kerusakan kecil"],
 ["汚れ","よごれ · yogore","Kotoran atau noda"], ["説明書","せつめいしょ · setsumeisho","Buku petunjuk"],
 ["付属品","ふぞくひん · fuzokuhin","Aksesori atau barang pelengkap"], ["重さ","おもさ · omosa","Berat"],
 ["軽い","かるい · karui","Ringan"], ["重い","おもい · omoi","Berat"],
 ["連続使用時間","れんぞくしようじかん · renzoku shiyou jikan","Waktu penggunaan berkelanjutan"],
 ["充電","じゅうでん · juuden","Pengisian daya"], ["充電時間","じゅうでんじかん · juuden jikan","Waktu pengisian daya"],
 ["機能","きのう · kinou","Fungsi atau fitur"], ["吸引力","きゅういんりょく · kyuuinryoku","Daya hisap"],
 ["デザイン","デザイン · dezain","Desain"], ["価格","かかく · kakaku","Harga"],
 ["値段","ねだん · nedan","Harga"], ["税込","ぜいこみ · zeikomi","Termasuk pajak"],
 ["税別","ぜいべつ · zeibetsu","Belum termasuk pajak"], ["消費税","しょうひぜい · shouhizei","Pajak konsumsi"],
 ["割引","わりびき · waribiki","Diskon"], ["値引き","ねびき · nebiki","Potongan harga"],
 ["送料","そうりょう · souryou","Ongkos kirim"], ["配送","はいそう · haisou","Pengiriman"],
 ["フリマアプリ","フリマアプリ · furima apuri","Aplikasi pasar barang bekas"], ["検索","けんさく · kensaku","Pencarian"],
 ["比較","ひかく · hikaku","Perbandingan"], ["使いやすい","つかいやすい · tsukai yasui","Mudah digunakan"],
 ["使いにくい","つかいにくい · tsukai nikui","Sulit digunakan"],
];
const kanjiWords = [
 ["商品","しょうひん · shouhin","Produk"], ["値段","ねだん · nedan","Harga"],
 ["価格","かかく · kakaku","Harga"], ["消費税","しょうひぜい · shouhizei","Pajak konsumsi"],
 ["税別","ぜいべつ · zeibetsu","Belum termasuk pajak"], ["店員","てんいん · ten'in","Pegawai toko"],
 ["親切","しんせつ · shinsetsu","Ramah atau baik hati"], ["重い","おもい · omoi","Berat"],
 ["軽い","かるい · karui","Ringan"], ["変わる","かわる · kawaru","Berubah"],
];
const shoppingScenarios = [
 {title:"相談して選ぶ",date:"買う前に",activities:"ほしい機能や予算を考えて、どのモデルがいいか人に相談します。",translation:"Pikirkan fitur dan anggaran yang dibutuhkan, lalu mintalah saran tentang model yang sesuai."},
 {title:"中古品の説明を読む",date:"商品情報",activities:"新品か中古か、傷や汚れ、説明書や付属品、送料を確認します。",translation:"Periksa apakah barang baru atau bekas, goresan, noda, buku petunjuk, aksesori, dan ongkos kirim."},
 {title:"比較表を見る",date:"性能を比べる",activities:"重さ、連続使用時間、充電時間、機能などを比べて、自分に必要なものを選びます。",translation:"Bandingkan berat, waktu penggunaan, waktu pengisian, dan fitur untuk menentukan kebutuhan."},
 {title:"値札を確認する",date:"会計の前に",activities:"税込か税別か、割引の期間、配送について店員に確認します。",translation:"Pastikan apakah harga sudah termasuk pajak, periode diskon, dan informasi pengiriman kepada pegawai."},
];
const applianceComparisonTips = [
 {title:"軽さを重視する",japanese:"軽くて、持ち運びやすいものがほしいです。",meaning:"Saya ingin barang yang ringan dan mudah dibawa."},
 {title:"操作のしやすさを考える",japanese:"ボタンが大きくて、使いやすいものがいいです。",meaning:"Saya ingin barang dengan tombol besar dan mudah digunakan."},
 {title:"必要な機能を選ぶ",japanese:"機能が多いものより、簡単で使いやすいものがいいです。",meaning:"Saya lebih memilih barang yang sederhana dan mudah digunakan daripada yang terlalu banyak fitur."},
];
const eventArticle = {
 title:"中古の炊飯器 · 商品情報",date:"出品情報の例",venue:"5.5合・レッド・送料込み",
 body:"メーカー：サンプル電気／商品：IH炊飯器（5.5合）／年式：2019年。状態：少し傷がありますが、問題なく使えます。説明書がついています。付属品：計量カップ。価格：5,000円（送料込み）。写真と説明を確認して、わからないことは家の人と相談しましょう。",
 reading:"Maakaa: Sanpuru Denki. Shouhin: IH suihanki (go-ten-go gou). Nenshiki: nisen juu kyuu nen. Joutai: sukoshi kizu ga arimasu ga, mondai naku tsukaemasu. Setsumeisho ga tsuite imasu. Fuzokuhin: keiryou kappu. Kakaku: go-sen en (souryou komi). Shashin to setsumei o kakunin shite, wakaranai koto wa ie no hito to soudan shimashou.",
 translation:"Produsen: Sample Denki. Produk: penanak nasi IH (kapasitas 5,5 go). Tahun model: 2019. Kondisi: ada sedikit goresan, tetapi dapat digunakan tanpa masalah. Dilengkapi buku petunjuk dan gelas ukur. Harga ¥5.000 termasuk ongkos kirim. Periksa foto dan deskripsi produk, lalu diskusikan dengan keluarga jika ada yang belum jelas.",
};
const shoppingPhraseExamples = [
 {label:"Meminta saran model",japanese:"どのモデルがいいですか。",meaning:"Model yang mana yang bagus?"},
 {label:"Membandingkan dua produk",japanese:"どちらのほうが使いやすいですか。",meaning:"Yang mana lebih mudah digunakan?"},
 {label:"Memeriksa harga",japanese:"この価格は税込ですか。",meaning:"Apakah harga ini sudah termasuk pajak?"},
 {label:"Meminta potongan harga dengan sopan",japanese:"これ、少し安くなりますか。",meaning:"Apakah harganya bisa sedikit lebih murah?"},
];
const grammarNotes = [
 {title:"01 · Menyatakan waktu sampai suatu kegiatan selesai",pattern:"V-るまで、～",example:<>商品が家に届くまで、3日かかりました。<br />店員さんが来るまで、ここで待ちます。</>,note:"まで setelah kata kerja bentuk kamus menyatakan durasi sampai tindakan atau keadaan selesai. Contoh: 届くまで (sampai barang tiba), 直るまで (sampai selesai diperbaiki). Bedakan dengan まで setelah kata benda waktu seperti 5時まで (sampai pukul lima)."},
 {title:"02 · Menyatakan mudah atau sulit dilakukan",pattern:"V-ます tanpa ます + やすい／にくい",example:<>この掃除機は軽くて、動かしやすいです。<br />この説明書は字が小さくて、読みにくいです。</>,note:"Hubungkan bentuk masu tanpa ます dengan やすい untuk menyatakan mudah dilakukan, atau にくい untuk menyatakan sulit dilakukan. Contoh: 使います → 使いやすい／使いにくい、読みます → 読みやすい／読みにくい."},
 {title:"03 · Membandingkan dua benda",pattern:"N1 と N2（と）、どちら／どっちが～か？\n（N1 より）N2 のほうが、～。",example:<>A：白と黒と、どちらがいいですか。<br />B：黒のほうが白より汚れが目立ちにくいです。</>,note:"Gunakan どちら／どっち untuk bertanya mana dari dua pilihan. Jawab dengan N2 のほうが～ untuk menyatakan pilihan yang memiliki sifat tersebut. N1 より menunjukkan pembanding dan dapat dihilangkan jika konteksnya jelas. どちら lebih sopan; どっち lebih santai."},
];
const ratingOptions: {value:IrodoriRating;label:string}[] = [
 {value:1,label:"★☆☆ Masih perlu latihan"},{value:2,label:"★★☆ Sudah bisa"},{value:3,label:"★★★ Bisa dengan baik"},
];
type Task = {prompt:ReactNode;options:{key:string;label:ReactNode}[];answer:string;explanation:ReactNode;};
type Simulation = {title:string;heading:string;prompt:string;japanese:ReactNode;translation:string;options:{key:string;label:string;meaning:string}[];answer:string;explanation:string;};
const simulations: Simulation[] = [
 {title:"01 · Meminta saran membeli barang",heading:"Bertanya model dan tempat membeli",prompt:"Kamu ingin membeli earphone baru. Kamu ingin meminta saran model dan tempat membelinya.",japanese:<>どんなイヤホンがいいですか。どこで買ったらいいですか。</>,translation:"Earphone seperti apa yang bagus? Sebaiknya membeli di mana?",options:[
 {key:"a",label:"どんなイヤホンがいいですか。どこで買ったらいいですか。",meaning:"Kalimat ini meminta saran tentang pilihan produk dan tempat membeli."},
 {key:"b",label:"イヤホンが届くまで、買いました。",meaning:"まで menyatakan waktu sampai tindakan selesai, bukan meminta saran."},
 {key:"c",label:"イヤホンより、どちらですか。",meaning:"Kalimat ini tidak lengkap untuk menanyakan rekomendasi."}],answer:"a",explanation:"Gunakan 何がいいですか／どこで買ったらいいですか untuk meminta saran."},
 {title:"02 · Membaca informasi barang bekas",heading:"Memastikan kondisi dan ongkos kirim",prompt:"Iklan fiktif menyebut ada goresan kecil, buku petunjuk, dan ongkos kirim sudah termasuk. Pernyataan mana yang benar?",japanese:<>少し傷があります。説明書がついています。送料込みです。</>,translation:"Ada sedikit goresan. Buku petunjuk disertakan. Ongkos kirim sudah termasuk.",options:[
 {key:"a",label:"Barangnya baru dan tidak memiliki goresan.",meaning:"Iklan justru menyebut ada sedikit goresan."},
 {key:"b",label:"Buku petunjuk tidak disertakan.",meaning:"Iklan menyebutkan bahwa buku petunjuk disertakan."},
 {key:"c",label:"Ada sedikit goresan, buku petunjuk disertakan, dan ongkos kirim termasuk.",meaning:"Pernyataan ini sesuai dengan informasi pada iklan."}],answer:"c",explanation:"Periksa kondisi, kelengkapan, harga, dan biaya tambahan. Pembelian sebenarnya sebaiknya dibicarakan dengan orang tua atau wali."},
 {title:"03 · Membandingkan spesifikasi",heading:"Memilih berdasarkan kebutuhan",prompt:"Kamu ingin penyedot debu yang sering digunakan dalam waktu lama. Model A dapat digunakan sekitar 60 menit dalam mode biasa, sedangkan model B sekitar 25 menit.",japanese:<>長い時間使いたいなら、Aのほうがいいですね。</>,translation:"Kalau ingin digunakan dalam waktu lama, model A lebih baik.",options:[
 {key:"a",label:"モデルBのほうが長く使えます。",meaning:"Model B hanya sekitar 25 menit pada mode biasa."},
 {key:"b",label:"モデルAのほうが長く使えます。",meaning:"Model A dapat digunakan sekitar 60 menit pada mode biasa."},
 {key:"c",label:"どちらも時間が同じです。",meaning:"Waktu penggunaan kedua model berbeda."}],answer:"b",explanation:"Bandingkan angka pada tabel dan pilih berdasarkan kebutuhan, bukan hanya satu spesifikasi."},
 {title:"04 · Memeriksa label harga",heading:"Memahami harga sebelum dan sesudah pajak",prompt:"Label harga menunjukkan 「9,500円（税別）」. Apa arti informasi tersebut?",japanese:<>この価格は税別です。</>,translation:"Harga ini belum termasuk pajak.",options:[
 {key:"a",label:"Harga ¥9.500 sudah termasuk pajak.",meaning:"税込 berarti termasuk pajak, bukan 税別."},
 {key:"b",label:"Harga ¥9.500 belum termasuk pajak.",meaning:"税別 berarti harga sebelum pajak."},
 {key:"c",label:"Harga ¥9.500 termasuk ongkos kirim.",meaning:"Label ini tidak memberi informasi tentang ongkos kirim."}],answer:"b",explanation:"Periksa apakah label menggunakan 税込 atau 税別, lalu tanyakan total harga jika perlu."},
 {title:"05 · Meminta potongan harga dengan sopan",heading:"Bertanya kepada pegawai toko",prompt:"Kamu ingin bertanya apakah harga suatu produk bisa sedikit lebih murah. Kalimat mana yang sopan?",japanese:<>これ、少し安くなりますか。</>,translation:"Apakah harganya bisa sedikit lebih murah?",options:[
 {key:"a",label:"これ、少し安くなりますか。",meaning:"Ungkapan ini menanyakan kemungkinan potongan harga dengan sopan."},
 {key:"b",label:"これ、安くなりにくいですか。",meaning:"Kalimat ini berarti sulit menjadi lebih murah."},
 {key:"c",label:"これ、届くまで安いですか。",meaning:"Kalimat ini tidak tepat untuk meminta potongan harga."}],answer:"a",explanation:"Gunakan nada sopan dan terima jawaban pegawai dengan baik; tidak semua toko memberi potongan harga."},
];
const practiceTasks: Task[] = [
 {prompt:<>Lengkapi kalimat: 「商品が家に届く＿＿＿、3日かかりました。」</>,options:[{key:"a",label:"まで"},{key:"b",label:"より"},{key:"c",label:"のほう"}],answer:"a",explanation:<>V-るまで menunjukkan durasi sampai suatu tindakan selesai.</>},
 {prompt:<>Bentuk yang tepat dari 「使います」 + やすい adalah apa?</>,options:[{key:"a",label:"使いますやすい"},{key:"b",label:"使いやすい"},{key:"c",label:"使うやすい"}],answer:"b",explanation:<>Ambil bentuk masu tanpa ます: 使います → 使い + やすい.</>},
 {prompt:<>Apa arti 「この掃除機は重くて、使いにくいです」?</>,options:[{key:"a",label:"Penyedot debu ini ringan dan mudah digunakan."},{key:"b",label:"Penyedot debu ini berat dan sulit digunakan."},{key:"c",label:"Penyedot debu ini mudah dibawa."}],answer:"b",explanation:<>～にくい menyatakan bahwa suatu tindakan sulit dilakukan.</>},
 {prompt:<>Lengkapi pola perbandingan: 「Aより、B＿＿＿ほうが軽いです。」</>,options:[{key:"a",label:"の"},{key:"b",label:"に"},{key:"c",label:"を"}],answer:"a",explanation:<>Pola yang benar adalah N2 のほうが～ untuk menyatakan bahwa pilihan kedua memiliki sifat tersebut.</>},
 {prompt:<>Kata 「税別」 pada label harga berarti apa?</>,options:[{key:"a",label:"Termasuk pajak."},{key:"b",label:"Belum termasuk pajak."},{key:"c",label:"Gratis ongkos kirim."}],answer:"b",explanation:<>税別 berarti harga belum termasuk pajak konsumsi.</>},
 {prompt:<>Jika ingin bertanya mana dari dua barang yang lebih mudah digunakan, pola mana yang tepat?</>,options:[{key:"a",label:"N1とN2、どちらが使いやすいですか。"},{key:"b",label:"N1まで使いますか。"},{key:"c",label:"N1の説明書ですか。"}],answer:"a",explanation:<>N1とN2、どちらが～か digunakan untuk membandingkan dua pilihan.</>},
];
const quizQuestions: Task[] = [
 {prompt:<>Apa arti 「家電」?</>,options:[{key:"a",label:"Peralatan rumah tangga elektronik."},{key:"b",label:"Pakaian resmi."},{key:"c",label:"Bahan makanan."}],answer:"a",explanation:<>家電 adalah singkatan dari 家庭用電気製品, peralatan elektronik rumah tangga.</>},
 {prompt:<>Apa fungsi pola 「V-るまで」?</>,options:[{key:"a",label:"Menyatakan waktu sampai suatu kegiatan selesai."},{key:"b",label:"Membandingkan dua barang."},{key:"c",label:"Meminta izin mencoba barang."}],answer:"a",explanation:<>まで setelah kata kerja bentuk kamus menyatakan durasi sampai tindakan selesai.</>},
 {prompt:<>Pilih bentuk yang benar dari 「読みます」 + にくい.</>,options:[{key:"a",label:"読みますにくい."},{key:"b",label:"読むにくい."},{key:"c",label:"読みにくい."}],answer:"c",explanation:<>Bentuk masu tanpa ます adalah 読み, lalu tambahkan にくい.</>},
 {prompt:<>Apa arti 「この説明書は読みやすいです」?</>,options:[{key:"a",label:"Buku petunjuk ini mudah dibaca."},{key:"b",label:"Buku petunjuk ini sulit dibaca."},{key:"c",label:"Buku petunjuk ini mahal."}],answer:"a",explanation:<>～やすい menyatakan bahwa tindakan tersebut mudah dilakukan.</>},
 {prompt:<>Pola 「白と黒と、どちらがいいですか」 digunakan untuk apa?</>,options:[{key:"a",label:"Menanyakan pilihan antara dua warna."},{key:"b",label:"Menanyakan waktu pengiriman."},{key:"c",label:"Menyatakan harga sebelum pajak."}],answer:"a",explanation:<>どちら digunakan untuk menanyakan pilihan di antara dua hal.</>},
 {prompt:<>Apa makna 「BのほうがAより軽いです」?</>,options:[{key:"a",label:"A lebih ringan daripada B."},{key:"b",label:"B lebih ringan daripada A."},{key:"c",label:"A dan B sama berat."}],answer:"b",explanation:<>N2 のほうが N1 より～ menyatakan bahwa N2 memiliki sifat tersebut dibanding N1.</>},
 {prompt:<>Apa arti 「送料込み」?</>,options:[{key:"a",label:"Harga termasuk ongkos kirim."},{key:"b",label:"Harga belum termasuk pajak."},{key:"c",label:"Barang tanpa buku petunjuk."}],answer:"a",explanation:<>込み berarti sudah termasuk sesuatu; 送料込み berarti ongkos kirim sudah termasuk.</>},
 {prompt:<>Apa yang perlu diperiksa pada iklan barang bekas?</>,options:[{key:"a",label:"Hanya warna barang."},{key:"b",label:"Kondisi, kelengkapan, harga, dan ongkos kirim."},{key:"c",label:"Hanya nama penjual."}],answer:"b",explanation:<>Periksa keterangan barang secara menyeluruh dan diskusikan pembelian daring dengan orang tua atau wali.</>},
 {prompt:<>Apa arti 「消費税」?</>,options:[{key:"a",label:"Pajak konsumsi."},{key:"b",label:"Biaya pengiriman."},{key:"c",label:"Diskon."}],answer:"a",explanation:<>消費税 berarti pajak konsumsi.</>},
 {prompt:<>Ungkapan 「これ、安くなりますか」 digunakan untuk apa?</>,options:[{key:"a",label:"Meminta penjelasan tentang warna."},{key:"b",label:"Menanyakan apakah harga dapat dikurangi."},{key:"c",label:"Menanyakan kapan barang tiba."}],answer:"b",explanation:<>Ungkapan ini digunakan untuk menanyakan kemungkinan potongan harga secara sopan.</>},
];
export default function IrodoriElementaryTwoLessonTwelvePage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [shoppingDraft, setShoppingDraft] = useState("");

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
        <ArrowLeft size={15} /> Kembali ke Dasar 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#4B796C]/35 bg-gradient-to-br from-[#203A35] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#B2D7CB]/[0.08]">家</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#B2D7CB]">IRODORI • DASAR 2 A2 • PELAJARAN 12</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Penyedot debu ini ringan dan mudah dipindahkan.</h1>
          <p className="mt-2 text-sm font-semibold text-[#B2D7CB]">この掃除機は軽くて動かしやすいですよ。</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar meminta saran membeli barang elektronik, membaca informasi produk, membandingkan spesifikasi dan harga, serta bertanya kepada pegawai toko.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><CalendarDays size={14} className="text-[#B2D7CB]" />Memilih produk</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Users size={14} className="text-[#B2D7CB]" />Elektronik rumah tangga</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Gift size={14} className="text-[#B2D7CB]" />Harga dan spesifikasi</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#4B796C]/20 bg-[#1D302C]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Empat target berikut sesuai target komunikasi 51–54 pada Irodori Dasar 2 Lesson 12.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">{item.source} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#4B796C]/20 bg-[#192A26] p-4 md:p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Catatan budaya: informasi produk dan pembelian daring</h2>
        </div>
        <p className="mt-2 text-xs leading-6 text-[#B6B0A5]">Spesifikasi dan kelengkapan produk dapat berbeda menurut produsen. Baca deskripsi dan periksa kondisi barang, harga, pajak, serta ongkos kirim sebelum membuat keputusan.</p>
        <p className="mt-2 text-[10px] leading-5 text-[#887F74]">Contoh pasar barang bekas di halaman ini bersifat fiktif. Untuk pembelian atau pembayaran daring yang sebenarnya, diskusikan terlebih dahulu dengan orang tua atau wali.</p>
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Meminta saran, membandingkan produk, dan berbelanja</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Seluruh percakapan dibuat orisinal oleh Fude berdasarkan target komunikasi pelajaran ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Meminta saran tentang earphone" speakers={[friendYui, friendSota]} utterances={askPurchaseAdviceConversation} />
          <IrodoriConversation title="Membaca iklan barang bekas" speakers={[friendAkiko, friendKenji]} utterances={secondhandListingConversation} />
          <IrodoriConversation title="Membandingkan model penyedot debu" speakers={[friendSota, friendYui]} utterances={compareVacuumModelsConversation} />
          <IrodoriConversation title="Memeriksa label harga" speakers={[friendAkiko, friendKenji]} utterances={readPriceTagConversation} />
          <IrodoriConversation title="Meminta potongan harga dengan sopan" speakers={[friendYui, friendSota]} utterances={askForDiscountConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">SITUASI BERBELANJA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Situasi ketika memilih peralatan elektronik</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan contoh ini untuk menentukan kebutuhan, membaca informasi produk, membandingkan spesifikasi, dan memeriksa harga.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {shoppingScenarios.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#4B796C]/20 bg-[#192A26] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mincho text-base font-bold text-[#F1EBDD]">{item.title}</h3>
                <span className="rounded-lg bg-[#4B796C]/15 px-2.5 py-1 text-[10px] font-semibold text-[#B2D7CB]">{item.date}</span>
              </div>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.activities}</p>
              <p className="mt-1 text-xs leading-5 text-[#A9A398]">{item.translation}</p>
            </article>
          ))}
        </div>
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">MEMBANDINGKAN PRODUK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Hal yang dapat dipertimbangkan saat memilih produk</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Perhatikan kemudahan penggunaan, bobot, dan fitur yang benar-benar dibutuhkan.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {applianceComparisonTips.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#4B796C]/20 bg-[#192A26] p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[#F1EBDD]">{item.title}</h3>
                <Star size={18} className="shrink-0 text-[#B2D7CB]" />
              </div>
              <p className="mt-3 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.japanese}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">MEMBACA INFORMASI PRODUK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Contoh iklan produk pada aplikasi fiktif</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Iklan ini fiktif dan dibuat sebagai latihan membaca kondisi, kelengkapan, harga, serta ongkos kirim barang.</p>
        </div>
        <article className="rounded-2xl border border-[#4B796C]/25 bg-[#192A26] p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#4B796C]/30 pb-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">DAFTAR PRODUK FIKTIF</p>
              <h3 className="mt-1 text-sm font-bold text-[#F1EBDD]">{eventArticle.title}</h3>
            </div>
            <FileText size={21} className="text-[#B2D7CB]" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-black/15 px-3 py-2 text-[10px] text-[#C9C3B8]">表示 · {eventArticle.date}</span>
            <span className="rounded-lg bg-black/15 px-3 py-2 text-[10px] text-[#C9C3B8]">商品 · {eventArticle.venue}</span>
          </div>
          <p className="mt-3 font-mincho text-sm leading-8 text-[#F1EBDD]">{eventArticle.body}</p>
          <p className="mt-3 border-t border-white/[0.07] pt-3 text-[10px] leading-6 text-[#B2D7CB]">{eventArticle.reading}</p>
          <p className="mt-2 text-xs leading-6 text-[#A9A398]">{eventArticle.translation}</p>
        </article>
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">UNGKAPAN SAAT MEMILIH PRODUK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Contoh kalimat untuk meminta saran dan informasi harga</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan bentuk sopan saat meminta rekomendasi, membandingkan barang, dan memeriksa harga.</p>
        </div>
        <div className="space-y-2">
          {shoppingPhraseExamples.map((item) => (
            <article key={item.label} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">{item.label}</p>
              <p className="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]">{item.japanese}</p>
              <p className="mt-1 text-xs text-[#A9A398]">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      
      <section className="space-y-4 rounded-2xl border border-[#4B796C]/20 bg-[#1D302C]/60 p-4 md:p-5">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">LATIHAN MENULIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Jelaskan barang yang ingin dibeli</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Tulis 2–4 kalimat tentang barang elektronik yang kamu butuhkan. Jelaskan fungsi yang diinginkan, anggaran, dan fitur yang penting bagimu.</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
          <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">掃除機がほしいです。軽くて、使いやすいものがいいです。予算は一万円ぐらいです。</p>
          <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">Saya ingin penyedot debu. Saya ingin yang ringan dan mudah digunakan. Anggarannya sekitar 10.000 yen.</p>
        </div>
        <label htmlFor="shopping-needs-draft" className="block text-xs font-semibold text-[#B2D7CB]">Tulis kebutuhan produk dalam bahasa Jepang</label>
        <textarea
          id="lost-item-description-draft"
          value={shoppingDraft}
          onChange={(event) => setShoppingDraft(event.target.value)}
          rows={4}
          placeholder="軽くて、使いやすいものがほしいです。"
          className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none transition-colors placeholder:text-[#746F65] focus:border-[#B2D7CB]/50"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] text-[#817A73]">Draf hanya digunakan untuk latihan di halaman ini.</p>
          <span className="text-[10px] tabular-nums text-[#B2D7CB]">{shoppingDraft.length} karakter</span>
        </div>
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">KOSAKATA PRODUK ELEKTRONIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Peralatan rumah tangga, spesifikasi, dan harga</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kosakata untuk meminta saran, memahami spesifikasi, membandingkan produk, dan menanyakan harga.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#B2D7CB]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">KANJI UTAMA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Sepuluh kata kanji pada materi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenali sepuluh kata kanji pada materi Lesson 12.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-[#4B796C]/20 bg-[#192A26] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#B2D7CB]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">POLA TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tiga pola untuk meminta saran dan membandingkan produk</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari cara menyatakan waktu sampai suatu kegiatan selesai, mudah atau sulitnya penggunaan, dan membandingkan dua produk.</p>
        </div>
        {grammarNotes.map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#B2D7CB]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      
      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">SIMULASI SITUASI</p>
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
              <p className="text-[9px] font-black tracking-[0.16em] text-[#B2D7CB]">{task.title}</p>
              <h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#4B796C]/20 bg-[#1D302C]/70 p-3">
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
                          ? "border-[#B2D7CB]/60 bg-[#4B796C]/15 text-[#F1EBDD]"
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
                  className="rounded-lg bg-[#4B796C] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#365B50] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
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
          <button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#4B796C]/35 px-4 py-2 text-xs font-bold text-[#B2D7CB]">
            <RefreshCw size={13} /> Ulangi simulasi
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B2D7CB]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#B2D7CB]/60 bg-[#4B796C]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#4B796C]/35 px-4 py-2 text-xs font-bold text-[#B2D7CB]">
              <RefreshCw size={13} /> Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={Object.keys(practiceAnswers).length !== practiceTasks.length}
              className="rounded-lg bg-[#4B796C] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B2D7CB]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#B2D7CB]">SOAL {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#B2D7CB]/60 bg-[#4B796C]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#4B796C]/35 px-4 py-2 text-xs font-bold text-[#B2D7CB]">
              <RefreshCw size={13} /> Ulangi kuis
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="rounded-lg bg-[#4B796C] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa kuis
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#4B796C]/20 bg-[#1D302C]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#B2D7CB]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi target komunikasi</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">
          Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.
        </p>
        <div className="space-y-3">
          {canDos.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#B2D7CB]">{item.source}</p>
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
                        ? "border-[#B2D7CB]/50 bg-[#4B796C]/20 text-[#F8EEDC]"
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
              ? "Lesson 12 selesai. Progres tersimpan."
              : canDosRated
                ? "Semua target komunikasi sudah dinilai."
                : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button
            type="button"
            onClick={finishLesson}
            disabled={!canComplete || isCompleted}
            className="rounded-xl bg-[#4B796C] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#365B50] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
          >
            {isCompleted ? "Lesson 12 selesai" : "Selesaikan Lesson 12"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Dasar 2 · 12 / 18</span>
      </div>
    </main>
  );
}
