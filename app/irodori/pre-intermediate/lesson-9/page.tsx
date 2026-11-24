"use client";

import IrodoriInteractiveLesson, { type IrodoriLessonContent } from "@/components/IrodoriInteractiveLesson";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";

const speakers = IRODORI_SPEAKERS;
const yui = { ...speakers.yui, name: "Yui", role: "Teman" };
const sota = { ...speakers.sota, name: "Sota", role: "Teman" };
const akiko = { ...speakers.akiko, name: "Akiko", role: "Tetangga" };
const kenji = { ...speakers.kenji, name: "Kenji", role: "Rekan kerja" };

const content: IrodoriLessonContent = {
  lessonId: "preintermediate-09",
  number: 9,
  title: "Apa yang membuatmu tertarik belajar bahasa Jepang?",
  japaneseTitle: "日本語の勉強を始めたきっかけって、何だったの？",
  description: "Menceritakan alasan mulai belajar bahasa Jepang, menyampaikan target dan pengalaman belajar, serta bertanya ketika mendengar dialek atau menemukan ungkapan daerah yang belum dipahami.",
  emblem: "私",
  tags: ["Motivasi belajar", "Target dan pengalaman", "Dialek bahasa Jepang"],
  canDos: [
    { id: "learning-goal", source: "TARGET KOMUNIKASI 27 · A2", text: "Menyampaikan target belajar bahasa Jepang kepada teman dengan alasan yang sederhana dan mudah dipahami." },
    { id: "ask-about-dialect", source: "TARGET KOMUNIKASI 28 · A2", text: "Menanyakan arti ungkapan dialek yang belum dipahami saat berbicara dengan orang di sekitar." },
    { id: "read-dialect-signs", source: "TARGET KOMUNIKASI · A2", text: "Membaca tulisan pada papan atau tanda yang menggunakan dialek, lalu memperkirakan maknanya dari konteks." },
    { id: "learning-experience", source: "TARGET KOMUNIKASI 29 · B1", text: "Menceritakan pengalaman belajar bahasa Jepang secara lebih terperinci dengan menyertakan contoh atau kejadian tertentu." },
  ],
  conversations: [
    {
      title: "Membicarakan target belajar dengan pengajar",
      speakers: [yui, kenji],
      utterances: [
        { speakerId: "kenji", japanese: <>日本語の勉強で、何か目標がありますか。</>, romaji: "Nihongo no benkyou de, nanika mokuhyou ga arimasu ka?", translation: "Apakah kamu punya target dalam belajar bahasa Jepang?", audioFileName: "" },
        { speakerId: "yui", japanese: <>はい。仕事で電話の内容をよく理解して、落ち着いて話せるようになりたいです。</>, romaji: "Hai. Shigoto de denwa no naiyou o yoku rikai shite, ochitsuite hanaseru you ni naritai desu.", translation: "Ada. Saya ingin bisa memahami isi telepon dengan baik dan berbicara dengan tenang saat bekerja.", audioFileName: "" },
        { speakerId: "kenji", japanese: <>どうして、そう思ったんですか。</>, romaji: "Doushite, sou omotta n desu ka?", translation: "Apa yang membuatmu berpikir begitu?", audioFileName: "" },
        { speakerId: "yui", japanese: <>電話では相手の話が聞き取れないことがあって、困ったからです。</>, romaji: "Denwa de wa aite no hanashi ga kikitorenai koto ga atte, komatta kara desu.", translation: "Karena terkadang saya kesulitan menangkap perkataan lawan bicara lewat telepon.", audioFileName: "" },
      ],
    },
    {
      title: "Menceritakan alasan mulai belajar",
      speakers: [sota, yui],
      utterances: [
        { speakerId: "yui", japanese: <>日本語の勉強を始めたきっかけって、何だったの？</>, romaji: "Nihongo no benkyou o hajimeta kikkake tte, nan datta no?", translation: "Apa yang membuatmu mulai belajar bahasa Jepang?", audioFileName: "" },
        { speakerId: "sota", japanese: <>日本の音楽が好きだったから。歌詞の意味もわかりたくて、勉強し始めたんだ。</>, romaji: "Nihon no ongaku ga suki datta kara. Kashi no imi mo wakaritakute, benkyou shi hajimeta n da.", translation: "Karena saya suka musik Jepang. Saya juga ingin memahami arti liriknya, jadi saya mulai belajar.", audioFileName: "" },
        { speakerId: "yui", japanese: <>へえ。今は、どんな目標があるの？</>, romaji: "Hee. Ima wa, donna mokuhyou ga aru no?", translation: "Oh, begitu. Sekarang apa targetmu?", audioFileName: "" },
        { speakerId: "sota", japanese: <>日本にいる間に、いろいろな人と日本語で話せるようになりたいと思ってる。</>, romaji: "Nihon ni iru aida ni, iroiro na hito to Nihongo de hanaseru you ni naritai to omotteru.", translation: "Selama berada di Jepang, saya berharap bisa berbicara dalam bahasa Jepang dengan banyak orang.", audioFileName: "" },
      ],
    },
    {
      title: "Memastikan arti ungkapan dialek",
      speakers: [akiko, yui],
      utterances: [
        { speakerId: "akiko", japanese: <>この荷物、なおしといてくれる？</>, romaji: "Kono nimotsu, naoshitoite kureru?", translation: "Bisa tolong bereskan barang-barang ini?", audioFileName: "" },
        { speakerId: "yui", japanese: <>なおすって、修理するという意味ですか。</>, romaji: "Naosu tte, shuuri suru to iu imi desu ka?", translation: "Naosu itu maksudnya memperbaiki?", audioFileName: "" },
        { speakerId: "akiko", japanese: <>この辺では、片付けておくという意味で使うことがあるの。</>, romaji: "Kono hen de wa, katazukete oku to iu imi de tsukau koto ga aru no.", translation: "Di daerah sini, ungkapan itu kadang dipakai dengan arti membereskan atau menyimpan.", audioFileName: "" },
        { speakerId: "yui", japanese: <>そうなんですね。初めて聞きました。方言なんですね。</>, romaji: "Sou nan desu ne. Hajimete kikimashita. Hougen nan desu ne.", translation: "Oh, begitu, ya. Baru pertama kali saya mendengarnya. Berarti itu dialek setempat, ya.", audioFileName: "" },
      ],
    },
    {
      title: "Menceritakan pengalaman belajar dan rencana ke depan",
      speakers: [sota, kenji],
      utterances: [
        { speakerId: "kenji", japanese: <>日本語の勉強を始めたきっかけは何ですか。</>, romaji: "Nihongo no benkyou o hajimeta kikkake wa nan desu ka?", translation: "Apa alasan kamu mulai belajar bahasa Jepang?", audioFileName: "" },
        { speakerId: "sota", japanese: <>日本への旅行がきっかけです。最初は駅の案内を読むのも難しかったんですが、毎日少しずつ勉強しました。</>, romaji: "Nihon e no ryokou ga kikkake desu. Saisho wa eki no annai o yomu no mo muzukashikatta n desu ga, mainichi sukoshi zutsu benkyou shimashita.", translation: "Awalnya karena ingin bepergian ke Jepang. Dulu membaca petunjuk di stasiun saja sulit, tetapi saya belajar sedikit demi sedikit setiap hari.", audioFileName: "" },
        { speakerId: "kenji", japanese: <>今はどうですか。</>, romaji: "Ima wa dou desu ka?", translation: "Bagaimana sekarang?", audioFileName: "" },
        { speakerId: "sota", japanese: <>簡単な手続きなら自分でできるようになりました。将来は、勉強したことを活かして、日本で生活する人を手伝えればと思っています。</>, romaji: "Kantan na tetsuzuki nara jibun de dekiru you ni narimashita. Shourai wa, benkyou shita koto o ikashite, Nihon de seikatsu suru hito o tetsudaereba to omotte imasu.", translation: "Sekarang saya sudah bisa mengurus prosedur sederhana sendiri. Ke depannya, saya berharap bisa memanfaatkan apa yang sudah dipelajari untuk membantu orang yang tinggal di Jepang.", audioFileName: "" },
      ],
    },
  ],
  readingArticle: {
    title: "方言を聞いたとき、どうする？",
    lead: "Dialek dapat berbeda menurut daerah. Baca konteks pada contoh papan informasi dan perhatikan cara bertanya ketika mendengar kata yang belum dikenal.",
    paragraphs: [
      { japanese: <>日本では、地域によってことばや発音が違うことがあります。その地域で使われていることばを方言と言います。旅行中や近所の人と話しているとき、教科書で習った日本語と違う表現を聞くこともあります。</>, translation: "Di Jepang, kosakata dan pengucapan dapat berbeda menurut daerah. Ungkapan yang digunakan di suatu wilayah disebut dialek. Saat bepergian atau berbicara dengan tetangga, kita mungkin mendengar ungkapan yang berbeda dari bahasa Jepang yang dipelajari di buku." },
      { japanese: <>たとえば、福岡の「あぶないばい」は「危ないよ」という意味で、京都の「おこしやす」は人を歓迎するときのことばです。秋田の「すったげうめぇ」は「とてもおいしい」という意味です。場所や絵、前後の文を見ると、意味を想像しやすくなります。</>, translation: "Contohnya, ungkapan Fukuoka “あぶないばい” berarti “awas, berbahaya”, sedangkan “おこしやす” di Kyoto merupakan ungkapan untuk menyambut orang. Ungkapan Akita “すったげうめぇ” berarti “sangat enak”. Lokasi, gambar, dan kalimat di sekitarnya dapat membantu kita memperkirakan maknanya." },
      { japanese: <>会話でわからないことばを聞いたら、聞こえた部分をくり返したり、「これはどういう意味ですか」と質問したりできます。「方言ですか」と確認してもいいでしょう。わからないままにせず、相手にたずねると、会話を続けやすくなります。</>, translation: "Saat mendengar kata yang tidak dipahami dalam percakapan, kita bisa mengulang bagian yang terdengar atau bertanya, “Apa arti ungkapan ini?” Kita juga boleh memastikan, “Apakah ini dialek?” Daripada membiarkannya tidak jelas, bertanya kepada lawan bicara akan membantu percakapan berlanjut." },
    ],
  },
  vocabRows: [
    ["きっかけ", "きっかけ · kikkake", "Pemicu; alasan awal"],
    ["目標", "もくひょう · mokuhyou", "Target; tujuan"],
    ["理由", "りゆう · riyuu", "Alasan"],
    ["背景", "はいけい · haikei", "Latar belakang"],
    ["経験", "けいけん · keiken", "Pengalaman"],
    ["方言", "ほうげん · hougen", "Dialek; bahasa daerah"],
    ["共通語", "きょうつうご · kyoutsuugo", "Bahasa umum yang dipahami bersama"],
    ["標準語", "ひょうじゅんご · hyoujungo", "Bahasa standar"],
    ["吹き替え", "ふきかえ · fukikae", "Sulih suara; dubbing"],
    ["字幕", "じまく · jimaku", "Takarir; subtitle"],
    ["セリフ", "セリフ · serifu", "Dialog; ucapan tokoh"],
    ["歌詞", "かし · kashi", "Lirik lagu"],
    ["理解する", "りかいする · rikai suru", "Memahami"],
    ["聞き取る", "ききとる · kikitoru", "Menangkap atau memahami ucapan yang didengar"],
    ["発音", "はつおん · hatsuon", "Pelafalan"],
    ["文字", "もじ · moji", "Huruf; karakter tulisan"],
    ["文法", "ぶんぽう · bunpou", "Tata bahasa"],
    ["会話", "かいわ · kaiwa", "Percakapan"],
    ["失敗する", "しっぱいする · shippai suru", "Melakukan kesalahan; gagal"],
    ["苦労する", "くろうする · kurou suru", "Mengalami kesulitan"],
    ["困る", "こまる · komaru", "Mengalami kesulitan; kebingungan"],
    ["緊張する", "きんちょうする · kinchou suru", "Merasa gugup; tegang"],
    ["恥ずかしい", "はずかしい · hazukashii", "Malu"],
    ["惜しい", "おしい · oshii", "Hampir berhasil; sedikit lagi"],
    ["足りる", "たりる · tariru", "Cukup; mencukupi"],
    ["合格する", "ごうかくする · goukaku suru", "Lulus ujian"],
    ["試験", "しけん · shiken", "Ujian"],
    ["最初", "さいしょ · saisho", "Awalnya; pertama-tama"],
    ["始める", "はじめる · hajimeru", "Memulai sesuatu"],
    ["始める（勉強を）", "はじめる（べんきょうを） · hajimeru (benkyou o)", "Memulai (belajar)"],
    ["間に", "あいだに · aida ni", "Selama; dalam rentang waktu"],
    ["将来", "しょうらい · shourai", "Masa depan"],
    ["知識", "ちしき · chishiki", "Pengetahuan"],
    ["活かす", "いかす · ikasu", "Memanfaatkan; menerapkan"],
    ["伝える", "つたえる · tsutaeru", "Menyampaikan; meneruskan informasi"],
    ["介護", "かいご · kaigo", "Perawatan; pendampingan lansia atau orang yang membutuhkan bantuan"],
    ["悩み", "なやみ · nayami", "Masalah yang dipikirkan; kegelisahan"],
    ["手続き", "てつづき · tetsuzuki", "Prosedur; administrasi"],
    ["生活しやすい", "せいかつしやすい · seikatsu shiyasui", "Mudah untuk menjalani kehidupan"],
    ["知り合う", "しりあう · shiriau", "Berkenalan; saling mengenal"],
  ],
  kanjiWords: [
    ["方言", "ほうげん · hougen", "Dialek; bahasa daerah"],
    ["目標", "もくひょう · mokuhyou", "Target; tujuan"],
    ["知識", "ちしき · chishiki", "Pengetahuan"],
    ["最初", "さいしょ · saisho", "Awalnya; pertama-tama"],
    ["悩み", "なやみ · nayami", "Masalah yang dipikirkan"],
    ["介護", "かいご · kaigo", "Perawatan; pendampingan"],
    ["吹き替え", "ふきかえ · fukikae", "Sulih suara"],
    ["足りる", "たりる · tariru", "Cukup; mencukupi"],
    ["失敗する", "しっぱいする · shippai suru", "Melakukan kesalahan; gagal"],
    ["理解する", "りかいする · rikai suru", "Memahami"],
  ],
  grammarNotes: [
    {
      title: "01 · Melakukan sesuatu dalam suatu rentang waktu",
      pattern: "V-る／V-ている + 間に、〜",
      example: <>日本にいる間に、いろいろな町へ行ってみたいです。<br />仕事をしている間に、少しずつ専門用語を覚えました。</>,
      note: "間に menunjukkan rentang waktu ketika suatu keadaan atau kegiatan berlangsung. Bagian setelah 間に menyatakan sesuatu yang dilakukan atau terjadi dalam rentang tersebut. Pola ini juga dapat digunakan dengan kata benda + の, misalnya 通勤の間に.",
    },
    {
      title: "02 · Memilih gaya bicara sopan dan biasa",
      pattern: "丁寧体（です・ます）／普通体（だ・辞書形など）",
      example: <>日本語の勉強は楽しいです。<br />日本語の勉強は楽しい。<br />昨日、学校で勉強しました。<br />昨日、学校で勉強した。</>,
      note: "丁寧体 biasanya dipakai kepada orang yang belum akrab, pengajar, atau dalam situasi formal. 普通体 lebih sering dipakai bersama teman dekat atau keluarga. Pilihan gaya bicara bergantung pada hubungan dan situasi, bukan sekadar tingkat kesopanan yang lebih tinggi atau rendah. Saat berpindah gaya, ubah bentuk kata benda, kata sifat, dan kata kerja secara konsisten.",
    },
    {
      title: "03 · Menyatakan mulai melakukan sesuatu",
      pattern: "Pangkal kata kerja bentuk ます + 始める",
      example: <>先月から、日本語教室に通い始めました。<br />最近、日本のラジオを聞き始めました。</>,
      note: "始める setelah pangkal kata kerja bentuk ます menyatakan bahwa suatu tindakan mulai dilakukan. Lepaskan ます dari bentuk ます, lalu tambahkan 始める. Contoh: 勉強します → 勉強し始めます, 読みます → 読み始めます.",
    },
    {
      title: "04 · Menyampaikan harapan atau rencana",
      pattern: "V-たい／意向形／V-ば + と思う",
      example: <>これからも日本語の勉強を続けたいと思っています。<br />将来、日本語を使う仕事ができればと思います。<br />もっといろいろな人と話そうと思っています。</>,
      note: "Harapan dapat disampaikan dengan V-たい, bentuk ajakan/kehendak (意向形), atau bentuk ば yang diikuti と思う. Bentuk 〜と思っています juga dapat menunjukkan rencana atau harapan yang sudah dipikirkan sebelumnya. Pilih bentuk sesuai nuansa yang ingin disampaikan.",
    },
  ],
  writingPractice: {
    title: "Latihan menulis cerita perjalanan belajar",
    instruction: "Tulislah cerita singkat tentang alasan mulai belajar bahasa Jepang, dua pengalaman selama belajar, dan satu hal yang ingin kamu lakukan pada masa depan. Gunakan urutan waktu agar ceritamu mudah diikuti. Sesuaikan 丁寧体 atau 普通体 dengan orang yang akan membaca ceritamu.",
    exampleLabel: "CONTOH ORISINAL FUDE",
    exampleJapanese: <>日本の旅行がきっかけで、日本語を勉強し始めました。最初は、駅の案内を読むのが難しかったです。それで、毎日少しずつ漢字を勉強しました。今は、簡単な案内なら自分で読めるようになりました。将来は、日本語を使って、いろいろな人と話せればと思っています。</>,
    exampleTranslation: "Saya mulai belajar bahasa Jepang karena ingin bepergian ke Jepang. Awalnya, membaca petunjuk di stasiun terasa sulit. Karena itu, saya belajar kanji sedikit demi sedikit setiap hari. Sekarang, saya sudah bisa membaca petunjuk sederhana sendiri. Ke depannya, saya berharap bisa menggunakan bahasa Jepang untuk berbicara dengan banyak orang.",
    placeholder: "日本語を勉強し始めたきっかけは＿＿です。最初は＿＿...",
  },
  simulations: [
    {
      title: "01 · Menjelaskan target belajar",
      heading: "Menyampaikan target dan alasannya",
      prompt: "Pengajar bertanya apa target belajarmu. Kamu ingin lebih mudah memahami percakapan di tempat kerja. Pilih jawaban yang paling sesuai.",
      japanese: <>仕事で日本語がもっと上手に使えるようになりたいです。</>,
      translation: "Saya ingin bisa menggunakan bahasa Jepang dengan lebih baik di tempat kerja.",
      options: [
        { key: "a", label: "Menyampaikan kemampuan yang ingin ditingkatkan.", meaning: "Pola ようになりたい menyatakan kemampuan atau keadaan yang ingin dicapai." },
        { key: "b", label: "Menceritakan tempat tinggal.", meaning: "Kalimat tidak membicarakan tempat tinggal." },
        { key: "c", label: "Meminta izin pulang lebih awal.", meaning: "Kalimat tidak berisi permintaan izin." },
      ],
      answer: "a",
      explanation: "仕事で日本語がもっと上手に使えるようになりたいです menyampaikan target yang jelas.",
    },
    {
      title: "02 · Memahami ungkapan dialek",
      heading: "Memastikan arti kata yang belum dipahami",
      prompt: "Seseorang memakai kata なおす saat meminta kamu membereskan barang. Kamu belum memahami penggunaan kata itu. Respons mana yang paling membantu?",
      japanese: <>なおすって、どういう意味ですか。</>,
      translation: "Naosu itu artinya apa?",
      options: [
        { key: "a", label: "Mengulang kata lalu menanyakan maknanya.", meaning: "Mengulang kata yang terdengar membantu lawan bicara memahami bagian yang belum jelas." },
        { key: "b", label: "Berpura-pura sudah mengerti.", meaning: "Hal ini bisa membuat kesalahpahaman tetap terjadi." },
        { key: "c", label: "Mengganti topik pembicaraan.", meaning: "Pertanyaan tentang arti kata lebih sesuai dengan situasinya." },
      ],
      answer: "a",
      explanation: "Mengulang kata yang belum dipahami lalu bertanya artinya adalah strategi yang tepat saat menghadapi dialek.",
    },
    {
      title: "03 · Menebak arti tulisan daerah",
      heading: "Memanfaatkan petunjuk konteks",
      prompt: "Kamu melihat tulisan 「おこしやす」 pada papan di depan tempat wisata di Kyoto. Papan itu juga menampilkan sambutan untuk pengunjung. Apa makna yang paling mungkin?",
      japanese: <>おこしやす。</>,
      translation: "Selamat datang; silakan berkunjung.",
      options: [
        { key: "a", label: "Ungkapan untuk menyambut pengunjung.", meaning: "Konteks papan dan lokasi membantu menebak arti ungkapan tersebut." },
        { key: "b", label: "Peringatan agar tidak masuk.", meaning: "Konteksnya adalah sambutan untuk pengunjung." },
        { key: "c", label: "Petunjuk untuk mencari stasiun.", meaning: "Tidak ada petunjuk arah pada contoh tersebut." },
      ],
      answer: "a",
      explanation: "おこしやす merupakan ungkapan sambutan yang digunakan di Kyoto. Perhatikan konteks untuk memperkirakan makna dialek.",
    },
    {
      title: "04 · Menceritakan pengalaman dan harapan",
      heading: "Menyusun cerita secara runtut",
      prompt: "Kamu ingin menjelaskan bahwa setelah belajar, kamu mulai bisa mengurus beberapa hal sendiri dan berharap dapat menggunakan bahasa Jepang dalam pekerjaan. Pilih kalimat yang sesuai.",
      japanese: <>日本語ができるようになって、生活しやすくなりました。将来は、日本語を使う仕事ができればと思います。</>,
      translation: "Setelah bisa berbahasa Jepang, kehidupan menjadi lebih mudah. Ke depannya, saya berharap bisa bekerja menggunakan bahasa Jepang.",
      options: [
        { key: "a", label: "Menceritakan perubahan yang dialami dan harapan masa depan.", meaning: "Kalimat pertama menceritakan perubahan; kalimat kedua menyampaikan harapan." },
        { key: "b", label: "Menceritakan larangan dan meminta izin.", meaning: "Tidak ada bentuk larangan atau permintaan izin." },
        { key: "c", label: "Menyebutkan jadwal kegiatan hari ini.", meaning: "Kalimat tidak membicarakan jadwal." },
      ],
      answer: "a",
      explanation: "Cerita pengalaman dapat dihubungkan dengan dampak yang dirasakan dan harapan untuk masa depan.",
    },
  ],
  practiceTasks: [
    { prompt: <>Apa arti 「きっかけ」?</>, options: [{ key: "a", label: "Pemicu atau alasan awal" }, { key: "b", label: "Hasil akhir ujian" }, { key: "c", label: "Tempat tinggal" }], answer: "a", explanation: <>きっかけ berarti hal yang menjadi pemicu atau alasan awal suatu tindakan.</> },
    { prompt: <>Pola 「日本にいる間に」 berarti ...</>, options: [{ key: "a", label: "Selama berada di Jepang" }, { key: "b", label: "Sebelum pergi ke Jepang" }, { key: "c", label: "Setelah meninggalkan Jepang" }], answer: "a", explanation: <>間に menunjukkan rentang waktu ketika suatu keadaan berlangsung.</> },
    { prompt: <>Bagaimana bentuk 「勉強します」 jika digabungkan dengan 始める?</>, options: [{ key: "a", label: <>勉強し始める</> }, { key: "b", label: <>勉強する始める</> }, { key: "c", label: <>勉強します始める</> }], answer: "a", explanation: <>Lepaskan ます dari pangkal kata kerja bentuk ます, lalu tambahkan 始める.</> },
    { prompt: <>Kapan 普通体 lebih sering digunakan?</>, options: [{ key: "a", label: "Saat berbicara dengan teman dekat atau keluarga." }, { key: "b", label: "Dalam semua situasi formal." }, { key: "c", label: "Hanya saat menulis surat resmi." }], answer: "a", explanation: <>普通体 sering dipakai dengan orang yang akrab. Pilih gaya bicara berdasarkan hubungan dan situasi.</> },
    { prompt: <>Ungkapan 「できればと思います」 digunakan untuk ...</>, options: [{ key: "a", label: "Menyampaikan harapan dengan lebih halus." }, { key: "b", label: "Memberikan larangan keras." }, { key: "c", label: "Menanyakan arah jalan." }], answer: "a", explanation: <>Bentuk ば + と思います dapat digunakan untuk menyampaikan harapan atau keinginan secara lebih halus.</> },
    { prompt: <>Saat tidak memahami dialek, apa yang sebaiknya dilakukan?</>, options: [{ key: "a", label: "Mengulang bagian yang terdengar lalu menanyakan artinya." }, { key: "b", label: "Menganggap semua dialek punya arti yang sama." }, { key: "c", label: "Diam dan tidak melanjutkan percakapan." }], answer: "a", explanation: <>Mengulang bagian yang terdengar dan bertanya dengan sopan membantu memperjelas maksud lawan bicara.</> },
  ],
  quizQuestions: [
    { prompt: <>Teman bertanya apa tujuanmu belajar bahasa Jepang. Kamu ingin bisa memahami percakapan di tempat kerja. Pilih jawaban yang paling sesuai.</>, options: [{ key: "a", label: <>仕事で日本語がもっとよく理解できるようになりたいです。</> }, { key: "b", label: <>昨日、仕事へ行きました。</> }, { key: "c", label: <>仕事は何時からですか。</> }], answer: "a", explanation: <>ようになりたい menyatakan kemampuan atau keadaan yang ingin dicapai.</> },
    { prompt: <>Pilih kalimat yang benar untuk mengatakan bahwa kamu mulai belajar bahasa Jepang bulan lalu.</>, options: [{ key: "a", label: <>先月、日本語を勉強し始めました。</> }, { key: "b", label: <>先月、日本語を勉強始めますでした。</> }, { key: "c", label: <>先月、日本語を勉強します始めました。</> }], answer: "a", explanation: <>Bentuk pangkal kata kerja ます + 始める digunakan untuk menyatakan awal suatu kegiatan.</> },
    { prompt: <>Saat mendengar kata daerah yang belum dipahami, pertanyaan mana yang paling tepat?</>, options: [{ key: "a", label: <>すみません。そのことばは、どういう意味ですか。</> }, { key: "b", label: <>そのことばを言わないでください。</> }, { key: "c", label: <>もう帰りました。</> }], answer: "a", explanation: <>Pertanyaan tersebut meminta penjelasan makna dengan sopan.</> },
    { prompt: <>Apa perbedaan umum 丁寧体 dan 普通体?</>, options: [{ key: "a", label: "丁寧体 cenderung digunakan pada situasi sopan; 普通体 sering dipakai dengan orang akrab." }, { key: "b", label: "普通体 selalu lebih sopan daripada 丁寧体." }, { key: "c", label: "Keduanya hanya digunakan untuk menulis." }], answer: "a", explanation: <>Gaya bicara dipilih menurut hubungan dengan lawan bicara dan situasinya.</> },
    { prompt: <>Untuk menceritakan pengalaman belajar dengan lebih terperinci, informasi apa yang sebaiknya disusun?</>, options: [{ key: "a", label: "Alasan mulai belajar, pengalaman tertentu, dan harapan ke depan." }, { key: "b", label: "Hanya daftar kosakata tanpa konteks." }, { key: "c", label: "Hanya tanggal dan jam belajar." }], answer: "a", explanation: <>Urutan alasan, pengalaman, dan harapan membantu membentuk cerita yang lebih jelas dan runtut.</> },
  ],
};

export default function IrodoriPreIntermediateLessonNinePage() {
  return <IrodoriInteractiveLesson content={content} />;
}
