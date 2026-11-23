"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  MapPin,
  RefreshCw,
  Star,
  Utensils,
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
const lessonId = "elementary2-04";

const restaurantRecommendationConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>この近くに、おすすめの店はありますか。</>,
    romaji: "Kono chikaku ni, osusume no mise wa arimasu ka?",
    translation: "Apakah ada tempat makan yang direkomendasikan di dekat sini?",
    audioFileName: "irodori-elementary2-04-a01-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>和食なら、「さくら食堂」がおすすめです。</>,
    romaji: "Washoku nara, 'Sakura Shokudou' ga osusume desu.",
    translation: "Kalau mencari makanan Jepang, Sakura Shokudo saya rekomendasikan.",
    audioFileName: "irodori-elementary2-04-a01-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>どんな店ですか。</>,
    romaji: "Donna mise desu ka?",
    translation: "Tempat makan seperti apa?",
    audioFileName: "irodori-elementary2-04-a01-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>メニューが多いし、値段も手ごろですよ。</>,
    romaji: "Menyuu ga ooi shi, nedan mo tegoro desu yo.",
    translation: "Menunya banyak dan harganya juga terjangkau.",
    audioFileName: "irodori-elementary2-04-a01-l04.mp3",
  },
];

const eatingInstructionsConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>お待たせしました。こちらは混ぜそばです。</>,
    romaji: "Omatase shimashita. Kochira wa mazesoba desu.",
    translation: "Terima kasih sudah menunggu. Ini mazesoba.",
    audioFileName: "irodori-elementary2-04-a02-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>どうやって食べるんですか。</>,
    romaji: "Dou yatte taberun desu ka?",
    translation: "Bagaimana cara memakannya?",
    audioFileName: "irodori-elementary2-04-a02-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>たれと具をよく混ぜて食べてください。</>,
    romaji: "Tare to gu o yoku mazete tabete kudasai.",
    translation: "Silakan aduk saus dan isiannya dengan rata, lalu makan.",
    audioFileName: "irodori-elementary2-04-a02-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>わかりました。こうやって混ぜるんですね。</>,
    romaji: "Wakarimashita. Kou yatte mazerun desu ne.",
    translation: "Baik. Jadi, diaduk seperti ini, ya.",
    audioFileName: "irodori-elementary2-04-a02-l04.mp3",
  },
];

const askHowToEatConversation: IrodoriUtterance[] = [
  {
    speakerId: "sota",
    japanese: <>この野菜の天ぷらは、どうやって食べるんですか。</>,
    romaji: "Kono yasai no tenpura wa, dou yatte taberun desu ka?",
    translation: "Bagaimana cara makan tempura sayuran ini?",
    audioFileName: "irodori-elementary2-04-a03-l01.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>つゆにつけて食べてください。</>,
    romaji: "Tsuyu ni tsukete tabete kudasai.",
    translation: "Silakan celupkan ke saus tsuyu, lalu makan.",
    audioFileName: "irodori-elementary2-04-a03-l02.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>全部つけてもいいですか。</>,
    romaji: "Zenbu tsukete mo ii desu ka?",
    translation: "Bolehkah saya mencelupkan semuanya?",
    audioFileName: "irodori-elementary2-04-a03-l03.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>少しずつつけるといいですよ。塩で食べてもいいです。</>,
    romaji: "Sukoshi zutsu tsukeru to ii desu yo. Shio de tabete mo ii desu.",
    translation: "Sebaiknya celupkan sedikit demi sedikit. Bisa juga dimakan dengan garam.",
    audioFileName: "irodori-elementary2-04-a03-l04.mp3",
  },
];

const introduceIndonesianDishConversation: IrodoriUtterance[] = [
  {
    speakerId: "akiko",
    japanese: <>インドネシアの料理で、おすすめは何ですか。</>,
    romaji: "Indoneshia no ryouri de, osusume wa nan desu ka?",
    translation: "Apa hidangan Indonesia yang kamu rekomendasikan?",
    audioFileName: "irodori-elementary2-04-a04-l01.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>ガドガドです。野菜や豆腐、ゆで卵が入っています。</>,
    romaji: "Gadogado desu. Yasai ya toufu, yude tamago ga haitte imasu.",
    translation: "Gado-gado. Isinya sayuran, tahu, dan telur rebus.",
    audioFileName: "irodori-elementary2-04-a04-l02.mp3",
  },
  {
    speakerId: "akiko",
    japanese: <>どんな味ですか。</>,
    romaji: "Donna aji desu ka?",
    translation: "Rasanya seperti apa?",
    audioFileName: "irodori-elementary2-04-a04-l03.mp3",
  },
  {
    speakerId: "kenji",
    japanese: <>ピーナッツソースをかけて食べます。甘くて、少し辛いです。</>,
    romaji: "Piinattsu soosu o kakete tabemasu. Amakute, sukoshi karai desu.",
    translation: "Dimakan dengan saus kacang. Rasanya manis dan sedikit pedas.",
    audioFileName: "irodori-elementary2-04-a04-l04.mp3",
  },
];

const restaurantReviewConversation: IrodoriUtterance[] = [
  {
    speakerId: "yui",
    japanese: <>「さくら食堂」の口コミを読みましたか。</>,
    romaji: "'Sakura Shokudou' no kuchikomi o yomimashita ka?",
    translation: "Apakah kamu sudah membaca ulasan Sakura Shokudo?",
    audioFileName: "irodori-elementary2-04-a05-l01.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>はい。料理はおいしいですが、お昼は少し混んでいるそうです。</>,
    romaji: "Hai. Ryouri wa oishii desu ga, ohiru wa sukoshi konde iru sou desu.",
    translation: "Ya. Makanannya enak, tetapi katanya agak ramai saat siang.",
    audioFileName: "irodori-elementary2-04-a05-l02.mp3",
  },
  {
    speakerId: "yui",
    japanese: <>値段はどうですか。</>,
    romaji: "Nedan wa dou desu ka?",
    translation: "Bagaimana dengan harganya?",
    audioFileName: "irodori-elementary2-04-a05-l03.mp3",
  },
  {
    speakerId: "sota",
    japanese: <>手ごろだし、量も多いそうですよ。</>,
    romaji: "Tegoro da shi, ryou mo ooi sou desu yo.",
    translation: "Katanya harganya terjangkau dan porsinya juga banyak.",
    audioFileName: "irodori-elementary2-04-a05-l04.mp3",
  },
];

const canDos = [
  {
    id: "understand-restaurant-recommendation",
    source: "CAN-DO 14",
    text: "Memahami ciri restoran yang direkomendasikan setelah mendengarkan penjelasan singkat.",
  },
  {
    id: "understand-eating-instructions",
    source: "CAN-DO 15",
    text: "Memahami petunjuk sederhana tentang cara menikmati suatu hidangan.",
  },
  {
    id: "ask-how-to-eat",
    source: "CAN-DO 16",
    text: "Bertanya dan menjawab tentang cara makan suatu hidangan.",
  },
  {
    id: "introduce-local-dish",
    source: "CAN-DO 17",
    text: "Memperkenalkan hidangan dari negara sendiri, termasuk ciri, bahan, dan cara penyajiannya.",
  },
  {
    id: "understand-restaurant-review",
    source: "CAN-DO 18",
    text: "Membaca ulasan restoran daring dan menemukan informasi tentang rasa, harga, porsi, serta layanan.",
  },
];

const vocabRows = [
  ["おすすめ", "おすすめ · osusume", "Rekomendasi"],
  ["飲食店", "いんしょくてん · inshokuten", "Tempat makan atau restoran"],
  ["この辺", "このへん · konohen", "Sekitar sini"],
  ["近く", "ちかく · chikaku", "Dekat"],
  ["看板", "かんばん · kanban", "Papan nama atau papan tanda"],
  ["新しく", "あたらしく · atarashiku", "Baru"],
  ["特徴", "とくちょう · tokuchou", "Ciri khas"],
  ["メニュー", "メニュー · menyuu", "Menu"],
  ["味", "あじ · aji", "Rasa"],
  ["量", "りょう · ryou", "Jumlah atau porsi"],
  ["値段", "ねだん · nedan", "Harga"],
  ["安い", "やすい · yasui", "Murah"],
  ["人気", "にんき · ninki", "Populer"],
  ["満足", "まんぞく · manzoku", "Puas"],
  ["ボリューム", "ボリューム · boryuumu", "Jumlah atau ukuran porsi"],
  ["リーズナブル", "リーズナブル · riizunaburu", "Terjangkau"],
  ["混む", "こむ · komu", "Ramai atau penuh"],
  ["口コミ", "くちこみ · kuchikomi", "Ulasan dari pengguna"],
  ["評判", "ひょうばん · hyouban", "Reputasi atau penilaian"],
  ["つける", "つける · tsukeru", "Mencelupkan atau menambahkan saus"],
  ["混ぜる", "まぜる · mazeru", "Mengaduk atau mencampur"],
  ["かける", "かける · kakeru", "Menuangkan atau menyiramkan"],
  ["入れる", "いれる · ireru", "Memasukkan"],
  ["巻く", "まく · maku", "Menggulung"],
  ["のせる", "のせる · noseru", "Meletakkan di atas"],
  ["むく", "むく · muku", "Mengupas"],
  ["そのまま", "そのまま · sono mama", "Apa adanya"],
  ["皮", "かわ · kawa", "Kulit"],
  ["つゆ", "つゆ · tsuyu", "Saus celup"],
  ["ポン酢", "ぽんず · ponzu", "Saus ponzu"],
  ["ごまだれ", "ごまだれ · gomadare", "Saus wijen"],
  ["白菜", "はくさい · hakusai", "Sawi putih"],
  ["野菜", "やさい · yasai", "Sayuran"],
  ["豆腐", "とうふ · toufu", "Tahu"],
  ["ゆで卵", "ゆでたまご · yude tamago", "Telur rebus"],
  ["ピーナッツ", "ピーナッツ · piinattsu", "Kacang tanah"],
  ["ソース", "ソース · soosu", "Saus"],
  ["甘辛い", "あまからい · amakarai", "Manis dan pedas"],
  ["家庭料理", "かていりょうり · katei ryouri", "Masakan rumahan"],
  ["紹介する", "しょうかいする · shoukai suru", "Memperkenalkan"],
  ["食べ方", "たべかた · tabekata", "Cara makan"],
  ["焼く", "やく · yaku", "Memanggang"],
  ["煮る", "にる · niru", "Merebus atau memasak berkuah"],
  ["蒸す", "むす · musu", "Mengukus"],
  ["揚げる", "あげる · ageru", "Menggoreng"],
  ["切る", "きる · kiru", "Memotong"],
  ["塩", "しお · shio", "Garam"],
  ["油", "あぶら · abura", "Minyak"],
  ["～屋", "～や · ~ya", "Akhiran untuk nama toko atau restoran"],
];

const kanjiWords = [
  ["塩", "しお · shio", "Garam"],
  ["油", "あぶら · abura", "Minyak"],
  ["量", "りょう · ryou", "Jumlah atau porsi"],
  ["満足", "まんぞく · manzoku", "Puas"],
  ["切る", "きる · kiru", "Memotong"],
  ["焼く", "やく · yaku", "Memanggang"],
  ["入れる", "いれる · ireru", "Memasukkan"],
  ["料理", "りょうり · ryouri", "Hidangan"],
  ["食べ方", "たべかた · tabekata", "Cara makan"],
  ["材料", "ざいりょう · zairyou", "Bahan"],
  ["味", "あじ · aji", "Rasa"],
  ["値段", "ねだん · nedan", "Harga"],
];

const restaurantReviews = [
  {
    name: "さくら食堂",
    category: "和食 · Hidangan Jepang",
    rating: "4.5 / 5",
    price: "¥700–¥1,000",
    good: "料理がおいしくて、量も多いです。店員さんも親切です。",
    goodMeaning: "Makanannya enak dan porsinya banyak. Pegawainya juga ramah.",
    caution: "お昼は少し混んでいます。",
    cautionMeaning: "Saat siang agak ramai.",
  },
  {
    name: "みどりカフェ",
    category: "カフェ · Kafe",
    rating: "4.2 / 5",
    price: "¥500–¥900",
    good: "店がきれいで、デザートがおいしいです。",
    goodMeaning: "Tempatnya bersih dan makanan penutupnya enak.",
    caution: "席が少ないので、週末は待つことがあります。",
    cautionMeaning: "Tempat duduknya sedikit, jadi saat akhir pekan kadang harus menunggu.",
  },
  {
    name: "こもれび",
    category: "家庭料理 · Masakan rumahan",
    rating: "4.4 / 5",
    price: "¥650–¥950",
    good: "野菜のメニューが多くて、値段も手ごろです。",
    goodMeaning: "Pilihan menu sayurnya banyak dan harganya terjangkau.",
    caution: "駅から少し遠いです。",
    cautionMeaning: "Agak jauh dari stasiun.",
  },
];

const dishFacts = [
  ["名前", "ガドガド · Gado-gado"],
  ["国", "インドネシア · Indonesia"],
  ["材料", "ゆでた野菜、豆腐、ゆで卵、ピーナッツソース"],
  ["味", "甘くて、少し辛い · Manis dan sedikit pedas"],
  ["食べ方", "ソースをかけて、よく混ぜて食べます。"],
];

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

type Task = {
  prompt: ReactNode;
  options: { key: string; label: ReactNode }[];
  answer: string;
  explanation: ReactNode;
};

type Simulation = {
  title: string;
  heading: string;
  prompt: string;
  japanese: ReactNode;
  translation: string;
  options: { key: string; label: string; meaning: string }[];
  answer: string;
  explanation: string;
};

const simulations: Simulation[] = [
  {
    title: "01 · Merekomendasikan restoran",
    heading: "Teman mencari tempat makan",
    prompt: "Temanmu ingin mencari tempat makan dengan harga terjangkau. Berikan rekomendasi dengan pola なら.",
    japanese: <>安い店なら、「こもれび」がおすすめです。</>,
    translation: "Kalau mencari tempat yang murah, Komorebi saya rekomendasikan.",
    options: [
      { key: "a", label: "安い店なら、「こもれび」がおすすめです。", meaning: "Mengulang kata kunci 安い店 lalu memberi rekomendasi." },
      { key: "b", label: "安い店を食べてください。", meaning: "Mengatakan untuk memakan tempat yang murah." },
      { key: "c", label: "安い店に混ぜてください。", meaning: "Meminta mencampurkan ke dalam tempat yang murah." },
    ],
    answer: "a",
    explanation: "Nなら dipakai untuk menjawab dengan merujuk pada kata kunci yang disebutkan lawan bicara.",
  },
  {
    title: "02 · Menjelaskan cara makan",
    heading: "Menyampaikan petunjuk sederhana",
    prompt: "Kamu ingin menjelaskan bahwa hidangan perlu diaduk dahulu sebelum dimakan.",
    japanese: <>よく混ぜて食べてください。</>,
    translation: "Silakan aduk sampai rata, lalu makan.",
    options: [
      { key: "a", label: "よく混ぜて食べてください。", meaning: "Menghubungkan cara mengaduk dengan tindakan makan." },
      { key: "b", label: "よく混ぜないで食べてください。", meaning: "Berarti makan tanpa mengaduk." },
      { key: "c", label: "よく混ぜちゃだめです。", meaning: "Melarang untuk mengaduk." },
    ],
    answer: "a",
    explanation: "V-て menghubungkan keadaan atau tindakan dengan tindakan berikutnya.",
  },
  {
    title: "03 · Menyatakan larangan",
    heading: "Mengingatkan teman",
    prompt: "Teman ingin menambahkan terlalu banyak saus. Ingatkan dengan ungkapan larangan kasual yang lembut.",
    japanese: <>そんなにたくさんソースをかけちゃだめですよ。</>,
    translation: "Jangan menuangkan saus terlalu banyak, ya.",
    options: [
      { key: "a", label: "そんなにたくさんソースをかけちゃだめですよ。", meaning: "Menggunakan V-ちゃだめ untuk melarang." },
      { key: "b", label: "そんなにたくさんソースをかけてから。", meaning: "Hanya menyatakan urutan dan belum membentuk kalimat lengkap." },
      { key: "c", label: "そんなにたくさんソースがかけます。", meaning: "Bentuk kata kerja dan partikel tidak sesuai." },
    ],
    answer: "a",
    explanation: "V-ちゃだめです adalah bentuk percakapan yang lebih kasual dari V-てはだめです.",
  },
  {
    title: "04 · Menjelaskan urutan",
    heading: "Memberi tahu langkah berikutnya",
    prompt: "Jelaskan bahwa saus dituang terlebih dahulu, baru hidangan diaduk.",
    japanese: <>ソースをかけてから、よく混ぜます。</>,
    translation: "Setelah menuangkan saus, aduk sampai rata.",
    options: [
      { key: "a", label: "ソースをかけてから、よく混ぜます。", meaning: "Menjelaskan urutan dua tindakan secara jelas." },
      { key: "b", label: "ソースをかけちゃだめ、よく混ぜます。", meaning: "Mengandung larangan yang bertentangan dengan konteks." },
      { key: "c", label: "ソースなら、よく混ぜますから。", meaning: "Pola tidak menyatakan urutan yang dimaksud." },
    ],
    answer: "a",
    explanation: "V-てから menyatakan tindakan pertama yang dilakukan sebelum tindakan berikutnya.",
  },
  {
    title: "05 · Membaca ulasan",
    heading: "Mencari kelebihan dan kekurangan",
    prompt: "Ulasan menulis 「料理はおいしいですが、お昼は混んでいます」. Apa artinya?",
    japanese: <>料理はおいしいですが、お昼は混んでいます。</>,
    translation: "Makanannya enak, tetapi saat siang ramai.",
    options: [
      { key: "a", label: "Makanannya enak, tetapi saat siang ramai." , meaning: "が menghubungkan dua informasi yang kontras." },
      { key: "b", label: "Makanannya tidak enak dan tempatnya sepi." , meaning: "Maknanya berlawanan dengan kalimat Jepang." },
      { key: "c", label: "Makanannya gratis saat siang." , meaning: "Kalimat tidak menyebutkan bahwa makanan gratis." },
    ],
    answer: "a",
    explanation: "が menghubungkan dua kalimat yang saling berlawanan atau kontras.",
  },
];

const practiceTasks: Task[] = [
  {
    prompt: <>Pilih arti 「口コミ」.</>,
    options: [
      { key: "a", label: "Ulasan dari pengguna." },
      { key: "b", label: "Cara duduk." },
      { key: "c", label: "Bahan makanan." },
    ],
    answer: "a",
    explanation: <>口コミ adalah informasi atau penilaian yang dibagikan orang berdasarkan pengalaman mereka.</>,
  },
  {
    prompt: <>Lengkapi kalimat: 「和食＿＿、『さくら食堂』がおすすめです。」</>,
    options: [
      { key: "a", label: "なら" },
      { key: "b", label: "から" },
      { key: "c", label: "まで" },
    ],
    answer: "a",
    explanation: <>Nなら digunakan untuk menjawab sambil mengulang kata kunci yang disebutkan lawan bicara.</>,
  },
  {
    prompt: <>Pilih kalimat yang berarti “Silakan makan tanpa mencelupkannya ke saus”.</>,
    options: [
      { key: "a", label: "たれにつけないで食べてください。" },
      { key: "b", label: "たれにつけて食べてください。" },
      { key: "c", label: "たれを混ぜてください。" },
    ],
    answer: "a",
    explanation: <>V-ないで menjelaskan bahwa tindakan berikutnya dilakukan tanpa melakukan tindakan sebelumnya.</>,
  },
  {
    prompt: <>Apa fungsi 「V-ちゃだめです」?</>,
    options: [
      { key: "a", label: "Menyatakan sesuatu yang tidak boleh dilakukan." },
      { key: "b", label: "Menjelaskan tindakan yang sudah selesai." },
      { key: "c", label: "Menyatakan ajakan untuk mencoba." },
    ],
    answer: "a",
    explanation: <>V-ちゃだめです merupakan bentuk kasual dari V-てはだめです untuk menyatakan larangan.</>,
  },
  {
    prompt: <>Pada 「よく混ぜてから食べます」, tindakan yang dilakukan lebih dahulu adalah …</>,
    options: [
      { key: "a", label: "Mengaduk sampai rata." },
      { key: "b", label: "Makan." },
      { key: "c", label: "Membayar." },
    ],
    answer: "a",
    explanation: <>V-てから menunjukkan bahwa tindakan V dilakukan lebih dahulu, kemudian tindakan berikutnya.</>,
  },
  {
    prompt: <>Apa fungsi 「が」 pada 「おいしいですが、少し高いです」?</>,
    options: [
      { key: "a", label: "Menghubungkan dua informasi yang kontras." },
      { key: "b", label: "Menandai lokasi." },
      { key: "c", label: "Menunjukkan jumlah." },
    ],
    answer: "a",
    explanation: <>が menghubungkan dua kalimat yang memiliki hubungan kontras. Bentuk ini lebih sering muncul dalam tulisan atau situasi yang lebih formal.</>,
  },
];

const quizQuestions: Task[] = [
  {
    prompt: <>Apa arti 「量」 dalam ulasan restoran?</>,
    options: [
      { key: "a", label: "Jumlah atau porsi." },
      { key: "b", label: "Rasa." },
      { key: "c", label: "Lokasi." },
    ],
    answer: "a",
    explanation: <>量（りょう）menunjukkan jumlah atau banyaknya sesuatu, termasuk porsi makanan.</>,
  },
  {
    prompt: <>Pilih ungkapan yang berarti “Kalau mencari ramen yang enak, saya rekomendasikan tempat ini”.</>,
    options: [
      { key: "a", label: "おいしいラーメンなら、この店がおすすめです。" },
      { key: "b", label: "おいしいラーメンを混ぜてください。" },
      { key: "c", label: "おいしいラーメンを食べちゃだめです。" },
    ],
    answer: "a",
    explanation: <>Nなら digunakan saat merujuk pada topik atau kata kunci yang disebutkan lawan bicara.</>,
  },
  {
    prompt: <>Apa arti 「そのまま食べてください」?</>,
    options: [
      { key: "a", label: "Silakan makan apa adanya." },
      { key: "b", label: "Silakan campurkan dengan saus." },
      { key: "c", label: "Jangan dimakan." },
    ],
    answer: "a",
    explanation: <>そのまま berarti dalam keadaan apa adanya, tanpa perubahan atau tambahan.</>,
  },
  {
    prompt: <>Pilih bentuk V-ないで yang benar untuk kata kerja 「むく」.</>,
    options: [
      { key: "a", label: "むかないで" },
      { key: "b", label: "むいてないで" },
      { key: "c", label: "むきないで" },
    ],
    answer: "a",
    explanation: <>むく berubah menjadi むかない, lalu ditambahkan で menjadi むかないで.</>,
  },
  {
    prompt: <>Apa makna 「混ぜちゃだめです」?</>,
    options: [
      { key: "a", label: "Jangan diaduk." },
      { key: "b", label: "Silakan diaduk." },
      { key: "c", label: "Setelah diaduk." },
    ],
    answer: "a",
    explanation: <>混ぜちゃだめです adalah bentuk percakapan dari 混ぜてはだめです, yang berarti jangan mengaduk.</>,
  },
  {
    prompt: <>Pilih kalimat yang menyatakan urutan tindakan dengan benar.</>,
    options: [
      { key: "a", label: "ソースをかけてから、食べます。" },
      { key: "b", label: "ソースをかけちゃだめ、食べます。" },
      { key: "c", label: "ソースなら、食べますから。" },
    ],
    answer: "a",
    explanation: <>V-てから menyatakan tindakan pertama yang dilakukan sebelum tindakan selanjutnya.</>,
  },
  {
    prompt: <>Apa arti 「満足です」?</>,
    options: [
      { key: "a", label: "Puas." },
      { key: "b", label: "Lapar." },
      { key: "c", label: "Terlambat." },
    ],
    answer: "a",
    explanation: <>満足（まんぞく）berarti puas atau merasa kebutuhan telah terpenuhi.</>,
  },
  {
    prompt: <>Pada 「新しくてきれいですが、少し遠いです」, bagaimana hubungan dua informasi?</>,
    options: [
      { key: "a", label: "Tempatnya baru dan bersih, tetapi agak jauh." },
      { key: "b", label: "Tempatnya sudah tutup dan dekat." },
      { key: "c", label: "Tempatnya murah karena baru." },
    ],
    answer: "a",
    explanation: <>が menghubungkan dua informasi yang kontras: kelebihan tempat dan kekurangannya.</>,
  },
  {
    prompt: <>Apa bahan utama saus pada contoh gado-gado di lesson ini?</>,
    options: [
      { key: "a", label: "Kacang tanah." },
      { key: "b", label: "Cokelat." },
      { key: "c", label: "Keju." },
    ],
    answer: "a",
    explanation: <>Contoh gado-gado menyebut saus kacang atau ピーナッツソース.</>,
  },
  {
    prompt: <>Informasi apa yang dapat ditemukan dari ulasan restoran?</>,
    options: [
      { key: "a", label: "Rasa, harga, porsi, dan suasana tempat." },
      { key: "b", label: "Nilai ujian sekolah saja." },
      { key: "c", label: "Nama guru dan jadwal kelas." },
    ],
    answer: "a",
    explanation: <>口コミ restoran dapat memuat penilaian rasa, harga, jumlah porsi, dan keadaan tempat.</>,
  },
];

export default function IrodoriElementaryTwoLessonFourPage() {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});

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
      <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#88C39D]/40 hover:text-[#EAE6DD]">
        <ArrowLeft size={15} /> Kembali ke Elementary 2
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#438A61]/35 bg-gradient-to-br from-[#1D3B2D] via-[#1B1A18] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#A8D5B5]/[0.08]">食</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#A8D5B5]">IRODORI • ELEMENTARY 2 A2 • LESSON 04</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Silakan makan tanpa kecap asin.</h1>
          <p className="mt-2 text-sm font-semibold text-[#A8D5B5]">しょうゆをつけないで食べてください</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Belajar memahami rekomendasi tempat makan, mengikuti petunjuk cara makan, bertanya tentang cara menikmati hidangan, memperkenalkan masakan Indonesia, dan membaca ulasan restoran.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Utensils size={14} className="text-[#A8D5B5]" />Cara makan dan hidangan</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><MapPin size={14} className="text-[#A8D5B5]" />Rekomendasi tempat</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]"><Star size={14} className="text-[#A8D5B5]" />Ulasan restoran</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#438A61]/20 bg-[#1D3026]/80 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#A8D5B5]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi (Can-do)</h2>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Lima target berikut sesuai Can-do 14–18 pada Irodori Elementary 2 Lesson 4.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A8D5B5]">{item.source} · 0{index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">KOSAKATA RESTORAN DAN CARA MAKAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tempat makan, rasa, dan penyajian</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari kata untuk menanyakan rekomendasi, memahami petunjuk makanan, dan membaca komentar pengunjung.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {vocabRows.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A8D5B5]"
                romajiClassName="mt-1 text-sm italic text-[#A9A398]"
                translationClassName="mt-2 text-xs leading-5 text-[#A9A398]"
              >
                {jp}
              </JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">REKOMENDASI TEMPAT MAKAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tanyakan tempat yang cocok dengan kebutuhan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Nなら dipakai untuk menjawab dengan mengulang kata kunci yang disampaikan orang lain. Contohnya, saat teman mencari makanan dengan harga terjangkau, kamu bisa menjawab 「安い店なら…」.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["和食なら、「さくら食堂」がおすすめです。", "Washoku nara, 'Sakura Shokudou' ga osusume desu.", "Kalau mencari makanan Jepang, Sakura Shokudo saya rekomendasikan."],
            ["安い店なら、「こもれび」がいいですよ。", "Yasui mise nara, 'Komorebi' ga ii desu yo.", "Kalau mencari tempat yang murah, Komorebi bagus."],
            ["この近くなら、駅の前にあります。", "Kono chikaku nara, eki no mae ni arimasu.", "Kalau di sekitar sini, tempatnya ada di depan stasiun."],
            ["デザートなら、みどりカフェが人気です。", "Dezaato nara, Midori Kafe ga ninki desu.", "Kalau mencari makanan penutup, Midori Cafe populer."],
          ].map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base leading-7 text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#A8D5B5]">{reading}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">PETUNJUK CARA MAKAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">V-て dan V-ないで menjelaskan cara</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">V-て menjelaskan tindakan yang dilakukan dengan cara tersebut. V-ないで berarti tindakan berikutnya dilakukan tanpa melakukan tindakan pertama.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["よく混ぜて食べてください。", "Yoku mazete tabete kudasai.", "Silakan aduk sampai rata, lalu makan."],
            ["しょうゆをつけないで食べてください。", "Shouyu o tsukenaide tabete kudasai.", "Silakan makan tanpa mencelupkan ke kecap asin."],
            ["たれをかけて食べます。", "Tare o kakete tabemasu.", "Dimakan dengan menuangkan saus."],
            ["何もつけないで、そのまま食べます。", "Nani mo tsukenaide, sono mama tabemasu.", "Dimakan apa adanya tanpa tambahan apa pun."],
            ["ご飯の上に具をのせて食べます。", "Gohan no ue ni gu o nosete tabemasu.", "Letakkan isiannya di atas nasi, lalu makan."],
            ["皮をむかないで食べられます。", "Kawa o mukanaide taberaremasu.", "Bisa dimakan tanpa mengupas kulitnya."],
          ].map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base leading-7 text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#A8D5B5]">{reading}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">BERTANYA TENTANG CARA MAKAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Tanyakan cara, saus, dan urutannya</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan どうやって untuk bertanya bagaimana suatu hidangan dimakan. ～てもいいですか digunakan untuk meminta izin.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["どうやって食べるんですか。", "Dou yatte taberun desu ka?", "Bagaimana cara memakannya?"],
            ["たれは、どれがいいですか。", "Tare wa, dore ga ii desu ka?", "Saus yang mana yang bagus?"],
            ["ソースをかけてもいいですか。", "Soosu o kakete mo ii desu ka?", "Bolehkah saya menuangkan saus?"],
            ["よく混ぜてから食べます。", "Yoku mazete kara tabemasu.", "Setelah diaduk rata, baru dimakan."],
            ["少しずつつけるといいですよ。", "Sukoshi zutsu tsukeru to ii desu yo.", "Sebaiknya celupkan sedikit demi sedikit."],
            ["そのまま食べてもいいですよ。", "Sono mama tabete mo ii desu yo.", "Boleh juga dimakan apa adanya."],
          ].map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base leading-7 text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#A8D5B5]">{reading}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">MEMPERKENALKAN HIDANGAN INDONESIA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Contoh: ガドガド · Gado-gado</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Gunakan nama hidangan, bahan utama, ciri rasa, dan cara penyajiannya ketika memperkenalkan makanan dari negara sendiri.</p>
        </div>
        <article className="overflow-hidden rounded-2xl border border-[#438A61]/25 bg-[#1D3026]/80">
          <div className="border-b border-white/[0.08] bg-[#274B36] px-4 py-3">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#A8D5B5]">HIDANGAN INDONESIA · CONTOH</p>
            <h3 className="mt-1 font-mincho text-xl font-bold text-[#F1EBDD]">ガドガド · Gado-gado</h3>
            <p className="mt-1 text-[10px] text-[#C3D3C4]">サラダ · Salad Indonesia</p>
          </div>
          <div className="space-y-3 p-4">
            {dishFacts.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[88px_1fr] gap-3 border-b border-white/[0.06] pb-2 last:border-0 last:pb-0">
                <p className="text-[10px] font-bold text-[#A8D5B5]">{label}</p>
                <p className="font-mincho text-sm leading-7 text-[#F1EBDD]">{value}</p>
              </div>
            ))}
            <p className="rounded-lg border border-white/[0.06] bg-black/15 p-3 text-xs leading-6 text-[#A9A398]">Gado-gado adalah salad khas Indonesia. Contoh ini menjelaskan bahan umum dan cara penyajian sederhana; variasi resep dapat berbeda di setiap daerah atau rumah.</p>
          </div>
        </article>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["これはインドネシアのガドガドという料理です。", "Kore wa Indoneshia no gadogado to iu ryouri desu.", "Ini adalah hidangan bernama gado-gado dari Indonesia."],
            ["ゆでた野菜や豆腐が入っています。", "Yudeta yasai ya toufu ga haitte imasu.", "Isinya sayuran rebus, tahu, dan bahan lainnya."],
            ["ピーナッツソースをかけて食べます。", "Piinattsu soosu o kakete tabemasu.", "Dimakan dengan menuangkan saus kacang."],
            ["甘くて、少し辛い味です。", "Amakute, sukoshi karai aji desu.", "Rasanya manis dan sedikit pedas."],
          ].map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
              <p className="font-mincho text-base leading-7 text-[#F1EBDD]">{jp}</p>
              <p className="mt-1 text-[9px] text-[#A8D5B5]">{reading}</p>
              <p className="mt-2 text-xs leading-5 text-[#A9A398]">{meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">MEMBACA ULASAN RESTORAN</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Bandingkan rasa, harga, dan suasana</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Ulasan berikut sepenuhnya fiktif. Perhatikan pujian dan catatan pengunjung, karena sebuah restoran bisa punya kelebihan sekaligus kekurangan.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {restaurantReviews.map((review) => (
            <article key={review.name} className="overflow-hidden rounded-2xl border border-[#438A61]/20 bg-[#1D3026]/65">
              <div className="border-b border-white/[0.06] bg-[#274B36]/70 p-3">
                <p className="text-[9px] font-black tracking-[0.15em] text-[#A8D5B5]">ULASAN FIKTIF</p>
                <h3 className="mt-1 font-mincho text-lg font-bold text-[#F1EBDD]">{review.name}</h3>
                <p className="mt-1 text-[10px] text-[#B6C8B8]">{review.category}</p>
              </div>
              <div className="space-y-3 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#E8D49C]">★ {review.rating}</span>
                  <span className="text-[10px] font-bold text-[#EAE6DD]">{review.price}</span>
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-[0.12em] text-[#A8D5B5]">良いところ · KELEBIHAN</p>
                  <p className="mt-1 font-mincho text-xs leading-6 text-[#F1EBDD]">{review.good}</p>
                  <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{review.goodMeaning}</p>
                </div>
                <div className="border-t border-white/[0.06] pt-2">
                  <p className="text-[9px] font-black tracking-[0.12em] text-[#D9B66D]">気になるところ · CATATAN</p>
                  <p className="mt-1 font-mincho text-xs leading-6 text-[#F1EBDD]">{review.caution}</p>
                  <p className="mt-1 text-[10px] leading-5 text-[#A9A398]">{review.cautionMeaning}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3 text-[10px] leading-5 text-[#A9A398]">Angka rating dan harga di atas hanya data fiktif untuk latihan membaca, bukan ulasan atau harga bisnis sungguhan.</p>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">KANJI WORDS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kosakata kanji pada lesson ini</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Kenali kanji yang sering digunakan untuk menjelaskan rasa, bahan, porsi, dan cara menyajikan makanan.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {kanjiWords.map(([jp, reading, meaning]) => (
            <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3">
              <JapaneseVocabularyReading reading={reading} meaning={meaning}
                contentClassName="font-mincho text-xl leading-relaxed text-[#F1EBDD]"
                kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#A8D5B5]"
                romajiClassName="mt-1 text-sm italic text-[#A9A398]"
                translationClassName="mt-2 text-xs leading-5 text-[#A9A398]"
              >
                {jp}
              </JapaneseVocabularyReading>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">DIALOG 01–05</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Bertanya, menjelaskan, dan berbagi rekomendasi</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Dialog dibuat orisinal oleh Fude berdasarkan target komunikasi lesson ini.</p>
        </div>
        <div className="space-y-4">
          <IrodoriConversation title="Meminta rekomendasi tempat makan" speakers={[friendYui, friendSota]} utterances={restaurantRecommendationConversation} />
          <IrodoriConversation title="Memahami petunjuk cara makan" speakers={[friendAkiko, friendKenji]} utterances={eatingInstructionsConversation} />
          <IrodoriConversation title="Bertanya tentang saus dan cara makan" speakers={[friendSota, friendYui]} utterances={askHowToEatConversation} />
          <IrodoriConversation title="Memperkenalkan hidangan Indonesia" speakers={[friendAkiko, friendKenji]} utterances={introduceIndonesianDishConversation} />
          <IrodoriConversation title="Membicarakan ulasan restoran" speakers={[friendYui, friendSota]} utterances={restaurantReviewConversation} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">TATA BAHASA</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Lima pola untuk rekomendasi dan cara makan</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari cara menjawab berdasarkan kata kunci, menjelaskan cara makan, melarang tindakan, menyusun urutan, dan menyampaikan kontras.</p>
        </div>
        {[
          {
            title: "01 · Menjawab dengan merujuk kata kunci",
            pattern: "N なら、～",
            example: <>和食なら、「さくら食堂」がおすすめです。<br />安い店なら、「こもれび」がいいですよ。</>,
            note: "Nなら digunakan untuk menjawab sambil mengulang kata kunci yang disebutkan lawan bicara. Misalnya, saat seseorang bertanya tempat makan yang murah, kamu bisa menjawab 「安い店なら…」. Pola ini sering dipakai saat memberi rekomendasi.",
          },
          {
            title: "02 · Menjelaskan cara melakukan sesuatu",
            pattern: "V-て、～ ／ V-ないで、～",
            example: <>たれをつけて食べてください。<br />しょうゆをつけないで食べてください。</>,
            note: "V-て menjelaskan keadaan atau tindakan yang menyertai tindakan berikutnya. V-ないで menyatakan tindakan berikutnya dilakukan tanpa melakukan tindakan pertama. Bentuk kedua dibuat dari kata kerja bentuk ない lalu ditambah で: つけない → つけないで.",
          },
          {
            title: "03 · Menyatakan larangan dalam percakapan",
            pattern: "V-ちゃだめです ／ V-じゃだめです",
            example: <>そんなにたくさんソースをかけちゃだめですよ。<br />ここに入れちゃだめです。</>,
            note: "V-ちゃだめです adalah bentuk kasual dari V-てはだめです, untuk menyampaikan bahwa suatu tindakan tidak boleh dilakukan. Jika bentuk て kata kerja berakhir dengan で, gunakan じゃ: 飲んで → 飲んじゃ. Gunakan bentuk ini pada situasi akrab; untuk situasi lebih formal, pilih 〜てはいけません atau ungkapan yang lebih sopan.",
          },
          {
            title: "04 · Menjelaskan urutan tindakan",
            pattern: "V-てから、～",
            example: <>ソースをかけてから、よく混ぜます。<br />よく混ぜてから、食べてください。</>,
            note: "V-てから menjelaskan bahwa tindakan pertama dilakukan lebih dahulu, kemudian tindakan berikutnya. Bentuk ini tersambung dengan bentuk て dari kata kerja.",
          },
          {
            title: "05 · Menghubungkan dua informasi yang kontras",
            pattern: "S1 が、S2",
            example: <>料理はおいしいですが、少し高いです。<br />店は新しくてきれいですが、お昼は混んでいます。</>,
            note: "が menghubungkan dua informasi yang saling kontras. Dibandingkan けど yang sering digunakan dalam percakapan, が lebih sering muncul dalam tulisan atau situasi yang lebih formal.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.15em] text-[#A8D5B5]">{item.title}</p>
            <p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p>
            <p className="mt-2 font-mincho text-base leading-8 text-[#A8D5B5]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p>
            <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">SIMULASI SITUASI</p>
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
              <p className="text-[9px] font-black tracking-[0.16em] text-[#A8D5B5]">{task.title}</p>
              <h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3>
              <p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{task.prompt}</JapaneseReading></p>
              <div className="mt-3 rounded-xl border border-[#438A61]/20 bg-[#1D3026]/70 p-3">
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
                          ? "border-[#A8D5B5]/60 bg-[#438A61]/15 text-[#F1EBDD]"
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
                  {isCorrect ? task.explanation : "Coba tinjau kembali pola kalimat dan pilih jawaban lain."}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] text-[#817A73]">{isCorrect ? "Situasi selesai" : "Pilih jawaban lalu periksa"}</p>
                <button
                  type="button"
                  disabled={!selected || isCorrect}
                  onClick={() => setSimulationChecked((current) => ({ ...current, [index]: true }))}
                  className="rounded-lg bg-[#438A61] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#34734F] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
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
          <button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#438A61]/35 px-4 py-2 text-xs font-bold text-[#A8D5B5]">
            <RefreshCw size={13} /> Ulangi simulasi
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">LATIHAN PRAKTIK</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Periksa pemahaman dasar</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan. Seluruh jawaban harus benar untuk membuka evaluasi akhir.</p>
        </div>
        <div className="space-y-3">
          {practiceTasks.map((task, index) => {
            const selected = practiceAnswers[index];
            const isCorrect = selected === task.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#A8D5B5]">LATIHAN {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#A8D5B5]/60 bg-[#438A61]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#438A61]/35 px-4 py-2 text-xs font-bold text-[#A8D5B5]">
              <RefreshCw size={13} /> Ulangi praktik
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPracticeSubmitted(true)}
              disabled={Object.keys(practiceAnswers).length !== practiceTasks.length}
              className="rounded-lg bg-[#438A61] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa praktik
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#A8D5B5]">KUIS</p>
          <h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 pertanyaan pemahaman</h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab seluruh pertanyaan sebelum memeriksa hasilnya.</p>
        </div>
        <div className="space-y-3">
          {quizQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected === question.answer;
            return (
              <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
                <p className="text-[9px] font-black tracking-[0.16em] text-[#A8D5B5]">SOAL {String(index + 1).padStart(2, "0")}</p>
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
                              ? "border-[#A8D5B5]/60 bg-[#438A61]/15 text-[#F1EBDD]"
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
            <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#438A61]/35 px-4 py-2 text-xs font-bold text-[#A8D5B5]">
              <RefreshCw size={13} /> Ulangi kuis
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="rounded-lg bg-[#438A61] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
            >
              Periksa kuis
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#438A61]/20 bg-[#1D3026]/70 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#A8D5B5]" />
          <h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi Can-do</h2>
        </div>
        <p className="text-xs leading-6 text-[#A9A398]">
          Nilai kemampuanmu setelah kelima simulasi benar, keenam latihan praktik benar, dan kuis dikumpulkan. Pilih penilaian yang paling sesuai untuk setiap target.
        </p>
        <div className="space-y-3">
          {canDos.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-[#A8D5B5]">{item.source}</p>
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
                        ? "border-[#A8D5B5]/50 bg-[#438A61]/20 text-[#ECF8EF]"
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
              ? "Lesson 4 selesai. Progres tersimpan."
              : canDosRated
                ? "Semua target Can-do sudah dinilai."
                : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}
          </p>
          <button
            type="button"
            onClick={finishLesson}
            disabled={!canComplete || isCompleted}
            className="rounded-xl bg-[#438A61] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#34734F] disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]"
          >
            {isCompleted ? "Lesson 4 selesai" : "Selesaikan Lesson 4"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <Link href="/irodori/elementary-2" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398] hover:text-[#EAE6DD]">
          <ArrowLeft size={14} /> Daftar pelajaran
        </Link>
        <span className="text-[10px] font-semibold text-[#817A73]">Elementary 2 · 04 / 18</span>
      </div>
    </main>
  );
}
