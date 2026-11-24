"use client";

import IrodoriInteractiveLesson, { type IrodoriLessonContent } from "@/components/IrodoriInteractiveLesson";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";

const speakers = IRODORI_SPEAKERS;
const yui = { ...speakers.yui, name: "Yui", role: "Teman" };
const sota = { ...speakers.sota, name: "Sota", role: "Teman" };
const akiko = { ...speakers.akiko, name: "Akiko", role: "Warga setempat" };
const kenji = { ...speakers.kenji, name: "Kenji", role: "Pengurus komunitas" };

const content: IrodoriLessonContent = {
  lessonId: "preintermediate-08",
  number: 8,
  title: "Bolehkah saya duduk di sebelahmu?",
  japaneseTitle: "隣に座ってもいいですか",
  description: "Memulai percakapan dengan orang yang baru dikenal, merespons obrolan ringan dengan alami, menemukan kesamaan minat, dan memahami hal-hal yang perlu diperhatikan saat bertemu orang untuk pertama kalinya.",
  emblem: "隣",
  tags: ["Memulai percakapan", "Obrolan ringan", "Kesan pertama"],
  canDos: [
    { id: "ask-to-sit-near", source: "TARGET KOMUNIKASI 24 · A2", text: "Meminta izin untuk duduk atau bergabung dengan seseorang, lalu merespons izin dan ajakan secara sopan." },
    { id: "keep-small-talk", source: "TARGET KOMUNIKASI 25 · A2/B1", text: "Memulai obrolan ringan, mengajukan pertanyaan yang mudah dijawab, dan melanjutkan percakapan dengan menanggapi informasi dari lawan bicara." },
    { id: "understand-first-impression", source: "TARGET KOMUNIKASI 26 · B1", text: "Memahami artikel tentang kesan pertama dan mengenali cara menjaga percakapan agar kedua pihak merasa nyaman." },
  ],
  conversations: [
    {
      title: "Meminta izin untuk duduk di sebelah seseorang",
      speakers: [yui, akiko],
      utterances: [
        { speakerId: "yui", japanese: <>すみません。隣に座ってもいいですか。</>, romaji: "Sumimasen. Tonari ni suwatte mo ii desu ka?", translation: "Permisi. Bolehkah saya duduk di sebelah Anda?", audioFileName: "" },
        { speakerId: "akiko", japanese: <>もちろんです。どうぞ、座ってください。</>, romaji: "Mochiron desu. Douzo, suwatte kudasai.", translation: "Tentu saja. Silakan duduk.", audioFileName: "" },
        { speakerId: "yui", japanese: <>ありがとうございます。ここに来るのは初めてなんです。</>, romaji: "Arigatou gozaimasu. Koko ni kuru no wa hajimete na n desu.", translation: "Terima kasih. Ini pertama kalinya saya datang ke sini.", audioFileName: "" },
        { speakerId: "akiko", japanese: <>そうなんですね。今日は、いろいろな人が集まるそうですよ。</>, romaji: "Sou nan desu ne. Kyou wa, iroiro na hito ga atsumaru sou desu yo.", translation: "Oh, begitu, ya. Katanya hari ini banyak orang dari berbagai kalangan akan berkumpul.", audioFileName: "" },
      ],
    },
    {
      title: "Melanjutkan obrolan ringan",
      speakers: [sota, kenji],
      utterances: [
        { speakerId: "sota", japanese: <>この町には長く住んでいるんですか。</>, romaji: "Kono machi ni wa nagaku sunde iru n desu ka?", translation: "Apakah Anda sudah lama tinggal di kota ini?", audioFileName: "" },
        { speakerId: "kenji", japanese: <>はい、もう十年になります。ソウタさんは？</>, romaji: "Hai, mou juunen ni narimasu. Souta-san wa?", translation: "Ya, sudah sepuluh tahun. Kalau Sota?", audioFileName: "" },
        { speakerId: "sota", japanese: <>去年引っ越してきたばかりです。まだ知らない場所が多いんです。</>, romaji: "Kyonen hikkoshite kita bakari desu. Mada shiranai basho ga ooi n desu.", translation: "Saya baru pindah tahun lalu. Masih banyak tempat yang belum saya kenal.", audioFileName: "" },
        { speakerId: "kenji", japanese: <>そうなんですね。おすすめの店を、今度紹介しますよ。</>, romaji: "Sou nan desu ne. Osusume no mise o, kondo shoukai shimasu yo.", translation: "Oh, begitu. Nanti saya rekomendasikan beberapa tempat yang bagus.", audioFileName: "" },
      ],
    },
    {
      title: "Menemukan kesamaan minat",
      speakers: [yui, sota],
      utterances: [
        { speakerId: "yui", japanese: <>休日は何をすることが多いですか。</>, romaji: "Kyuujitsu wa nani o suru koto ga ooi desu ka?", translation: "Apa yang biasanya kamu lakukan saat hari libur?", audioFileName: "" },
        { speakerId: "sota", japanese: <>よく映画を見ます。ユイさんは？</>, romaji: "Yoku eiga o mimasu. Yui-san wa?", translation: "Saya sering menonton film. Kalau Yui?", audioFileName: "" },
        { speakerId: "yui", japanese: <>私は写真を撮るのが好きなんです。最近、古い町並みを撮りました。</>, romaji: "Watashi wa shashin o toru no ga suki na n desu. Saikin, furui machinami o torimashita.", translation: "Saya suka memotret. Akhir-akhir ini saya memotret deretan bangunan tua.", audioFileName: "" },
        { speakerId: "sota", japanese: <>いいですね。今度、その写真を見せてもらってもいいですか。</>, romaji: "Ii desu ne. Kondo, sono shashin o misete moratte mo ii desu ka?", translation: "Menarik, ya. Kapan-kapan boleh lihat foto itu?", audioFileName: "" },
      ],
    },
    {
      title: "Mengajak seseorang melakukan kegiatan bersama",
      speakers: [kenji, akiko],
      utterances: [
        { speakerId: "kenji", japanese: <>料理教室に参加したことがありますか。</>, romaji: "Ryouri kyoushitsu ni sanka shita koto ga arimasu ka?", translation: "Apakah Anda pernah ikut kelas memasak?", audioFileName: "" },
        { speakerId: "akiko", japanese: <>いいえ、ありません。でも、前から興味があったんです。</>, romaji: "Iie, arimasen. Demo, mae kara kyoumi ga atta n desu.", translation: "Belum pernah. Tetapi, sejak dulu saya tertarik.", audioFileName: "" },
        { speakerId: "kenji", japanese: <>それなら、今度いっしょに参加してみませんか。</>, romaji: "Sore nara, kondo issho ni sanka shite mimasen ka?", translation: "Kalau begitu, kapan-kapan mau ikut bersama saya?", audioFileName: "" },
        { speakerId: "akiko", japanese: <>ぜひ。初めてなので、いろいろ教えてください。</>, romaji: "Zehi. Hajimete na node, iroiro oshiete kudasai.", translation: "Tentu. Karena ini pertama kalinya, tolong ajari saya banyak hal.", audioFileName: "" },
      ],
    },
  ],
  readingArticle: {
    title: "初対面の人と話すとき",
    lead: "Baca artikel singkat berikut tentang cara memulai percakapan dengan orang yang baru dikenal.",
    paragraphs: [
      { japanese: <>地域のイベントなどでは、初めて会う人と話す機会があります。最初に、相手の近くに座ってもいいか聞いたり、簡単な自己紹介をしたりすると、会話を始めやすくなります。</>, translation: "Di acara lingkungan atau kegiatan komunitas, kita punya kesempatan berbicara dengan orang yang baru ditemui. Dengan bertanya apakah boleh duduk di dekatnya atau memperkenalkan diri secara singkat, percakapan akan lebih mudah dimulai." },
      { japanese: <>相手の話をよく聞いて、趣味や住んでいる場所など、答えやすい質問をするといいでしょう。自分と同じ経験や好きなことがあれば、そのことについて話を続けることができます。</>, translation: "Dengarkan lawan bicara dengan baik dan ajukan pertanyaan yang mudah dijawab, misalnya tentang hobi atau tempat tinggal. Jika ada pengalaman atau kesukaan yang sama, kita bisa melanjutkan percakapan tentang hal tersebut." },
      { japanese: <>ただし、初めて会ったばかりの人に、年齢や仕事、家族のことなどを急に聞くと、相手が答えにくい場合もあります。相手の様子を見ながら、少しずつ話すのが大切です。</>, translation: "Namun, jika kita langsung menanyakan usia, pekerjaan, atau keluarga kepada orang yang baru pertama kali ditemui, terkadang orang tersebut akan merasa sulit menjawab. Penting untuk berbicara secara bertahap sambil memperhatikan respons lawan bicara." },
    ],
  },
  vocabRows: [
    ["初対面", "はつたいめん · hatsutaimen", "Pertemuan pertama; baru pertama kali bertemu"],
    ["隣", "となり · tonari", "Sebelah; sisi di samping"],
    ["座る", "すわる · suwaru", "Duduk"],
    ["席", "せき · seki", "Tempat duduk; kursi"],
    ["空く", "あく · aku", "Kosong; tersedia (tempat duduk)"],
    ["話しかける", "はなしかける · hanashikakeru", "Memulai percakapan dengan seseorang"],
    ["会話", "かいわ · kaiwa", "Percakapan"],
    ["話題", "わだい · wadai", "Topik pembicaraan"],
    ["質問", "しつもん · shitsumon", "Pertanyaan"],
    ["相手", "あいて · aite", "Lawan bicara; orang yang dihadapi"],
    ["答える", "こたえる · kotaeru", "Menjawab"],
    ["聞く", "きく · kiku", "Mendengar; bertanya"],
    ["趣味", "しゅみ · shumi", "Hobi"],
    ["共通点", "きょうつうてん · kyoutsuuten", "Kesamaan"],
    ["興味", "きょうみ · kyoumi", "Ketertarikan; minat"],
    ["経験", "けいけん · keiken", "Pengalaman"],
    ["自己紹介", "じこしょうかい · jikoshoukai", "Perkenalan diri"],
    ["印象", "いんしょう · inshou", "Kesan"],
    ["雰囲気", "ふんいき · funiki", "Suasana"],
    ["遠慮する", "えんりょする · enryo suru", "Sungkan; menahan diri"],
    ["失礼", "しつれい · shitsurei", "Tidak sopan; permisi (sesuai konteks)"],
    ["近く", "ちかく · chikaku", "Dekat; di sekitar"],
    ["初めて", "はじめて · hajimete", "Pertama kali"],
    ["もちろん", "もちろん · mochiron", "Tentu saja"],
    ["よかったら", "よかったら · yokattara", "Kalau berkenan; kalau tidak keberatan"],
    ["話しやすい", "はなしやすい · hanashiyasui", "Mudah diajak bicara"],
    ["聞き上手", "ききじょうず · kikijouzu", "Pandai mendengarkan"],
    ["休日", "きゅうじつ · kyuujitsu", "Hari libur"],
    ["最近", "さいきん · saikin", "Akhir-akhir ini"],
    ["以前", "いぜん · izen", "Sebelumnya; dahulu"],
    ["引っ越す", "ひっこす · hikkosu", "Pindah tempat tinggal"],
    ["紹介する", "しょうかいする · shoukai suru", "Memperkenalkan; merekomendasikan"],
    ["見せる", "みせる · miseru", "Memperlihatkan"],
    ["参加する", "さんかする · sanka suru", "Ikut serta; berpartisipasi"],
    ["誘う", "さそう · sasou", "Mengajak"],
    ["集まる", "あつまる · atsumaru", "Berkumpul"],
    ["一緒に", "いっしょに · issho ni", "Bersama-sama"],
    ["思い出", "おもいで · omoide", "Kenangan"],
    ["同じ", "おなじ · onaji", "Sama"],
    ["だれでも", "だれでも · dare demo", "Siapa saja"],
  ],
  kanjiWords: [
    ["初対面", "はつたいめん · hatsutaimen", "Baru pertama kali bertemu"],
    ["隣", "となり · tonari", "Sebelah"],
    ["座る", "すわる · suwaru", "Duduk"],
    ["席", "せき · seki", "Tempat duduk"],
    ["会話", "かいわ · kaiwa", "Percakapan"],
    ["話題", "わだい · wadai", "Topik pembicaraan"],
    ["質問", "しつもん · shitsumon", "Pertanyaan"],
    ["相手", "あいて · aite", "Lawan bicara"],
    ["共通点", "きょうつうてん · kyoutsuuten", "Kesamaan"],
    ["印象", "いんしょう · inshou", "Kesan"],
  ],
  grammarNotes: [
    {
      title: "01 · Meminta izin melakukan sesuatu",
      pattern: "V-て + もいいですか",
      example: <>ここに座ってもいいですか。<br />窓を開けてもいいですか。</>,
      note: "Pola V-てもいいですか digunakan untuk meminta izin melakukan sesuatu. Bentuk ini cocok untuk situasi sehari-hari yang sopan. Untuk meminta izin dengan lebih halus, awali dengan すみません atau tambahkan alasan singkat.",
    },
    {
      title: "02 · Memberikan izin",
      pattern: "V-てもいいです／V-てもいいですよ",
      example: <>はい、ここに座ってもいいですよ。<br />この資料を見てもいいです。</>,
      note: "Pola ini digunakan untuk mengizinkan seseorang melakukan sesuatu. Tambahan よ dapat memberi nuansa ramah dan meyakinkan. Dalam situasi tertentu, jawaban seperti もちろんです atau どうぞ juga terdengar alami.",
    },
    {
      title: "03 · Menanggapi informasi dengan menunjukkan perhatian",
      pattern: "S（普通形）んですね",
      example: <>この町に来て一年なんですね。<br />写真を撮るのが好きなんですね。</>,
      note: "んですね digunakan ketika pembicara memahami atau menyadari informasi baru dan ingin menunjukkan perhatian terhadap cerita lawan bicara. Intonasi dan konteks menentukan apakah ungkapan ini terdengar seperti tanggapan hangat atau konfirmasi.",
    },
    {
      title: "04 · Menanyakan pengalaman",
      pattern: "V-たことがありますか",
      example: <>料理教室に参加したことがありますか。<br />日本の祭りを見たことがありますか。</>,
      note: "Pola V-たことがありますか digunakan untuk menanyakan apakah seseorang pernah mengalami atau melakukan sesuatu. Jawaban dapat berupa はい、あります atau いいえ、ありません. Pola ini menanyakan pengalaman, bukan kegiatan yang sedang berlangsung.",
    },
  ],
  writingPractice: {
    title: "Latihan menulis pembuka percakapan",
    instruction: "Bayangkan kamu bertemu seseorang untuk pertama kalinya dalam kegiatan komunitas. Tulis perkenalan singkat, sebutkan satu minat atau kegiatan yang kamu sukai, lalu tambahkan satu pertanyaan ringan yang bisa membantu percakapan berlanjut.",
    exampleLabel: "CONTOH ORISINAL FUDE",
    exampleJapanese: <>はじめまして。ユイです。写真を撮るのが好きです。休日はよく町を歩いています。よかったら、好きなことについて話しませんか。</>,
    exampleTranslation: "Salam kenal. Saya Yui. Saya suka memotret. Saat hari libur saya sering berjalan-jalan di kota. Kalau berkenan, maukah kita mengobrol tentang hal-hal yang kita sukai?",
    placeholder: "はじめまして。＿＿です。＿＿が好きです。...",
  },
  simulations: [
    {
      title: "01 · Meminta izin duduk",
      heading: "Memilih ungkapan yang sopan",
      prompt: "Kamu datang ke acara komunitas dan ingin duduk di kursi kosong di sebelah seseorang. Apa yang sebaiknya kamu katakan terlebih dahulu?",
      japanese: <>すみません。隣に座ってもいいですか。</>,
      translation: "Permisi. Bolehkah saya duduk di sebelah Anda?",
      options: [
        { key: "a", label: "Meminta izin dengan てもいいですか。", meaning: "Pola ini digunakan untuk menanyakan apakah suatu tindakan diperbolehkan." },
        { key: "b", label: "Langsung menyuruh orang itu pindah.", meaning: "Situasi ini membutuhkan permintaan izin, bukan perintah." },
        { key: "c", label: "Menanyakan harga tempat duduk.", meaning: "Tidak ada konteks jual beli tempat duduk." },
      ],
      answer: "a",
      explanation: "隣に座ってもいいですか adalah cara sopan untuk meminta izin duduk di sebelah seseorang.",
    },
    {
      title: "02 · Melanjutkan obrolan ringan",
      heading: "Memilih pertanyaan yang mudah dijawab",
      prompt: "Kamu baru berkenalan dengan seseorang. Topik apa yang paling aman untuk membuka percakapan santai?",
      japanese: <>休日は何をすることが多いですか。</>,
      translation: "Apa yang biasanya Anda lakukan saat hari libur?",
      options: [
        { key: "a", label: "Bertanya tentang kegiatan saat hari libur.", meaning: "Pertanyaan ringan tentang kegiatan atau hobi biasanya mudah dijawab." },
        { key: "b", label: "Langsung menanyakan hal pribadi yang sensitif.", meaning: "Pertanyaan terlalu pribadi dapat membuat lawan bicara tidak nyaman." },
        { key: "c", label: "Meminta informasi rahasia.", meaning: "Hal tersebut tidak sesuai untuk obrolan awal." },
      ],
      answer: "a",
      explanation: "Topik seperti hobi atau kegiatan saat hari libur dapat menjadi pembuka percakapan yang ringan.",
    },
    {
      title: "03 · Menanggapi cerita lawan bicara",
      heading: "Menunjukkan bahwa kamu memperhatikan",
      prompt: "Seseorang bercerita bahwa ia sudah tinggal di kota itu selama sepuluh tahun. Tanggapan mana yang menunjukkan bahwa kamu memahami informasi baru tersebut?",
      japanese: <>十年住んでいるんですね。</>,
      translation: "Oh, berarti Anda sudah tinggal di sini selama sepuluh tahun, ya.",
      options: [
        { key: "a", label: "Menggunakan んですね untuk menanggapi informasi.", meaning: "Ungkapan ini menunjukkan bahwa pembicara menangkap dan menanggapi informasi." },
        { key: "b", label: "Menggunakan てください untuk memberi perintah.", meaning: "Kalimat itu bukan permintaan tindakan." },
        { key: "c", label: "Menggunakan ませんか untuk menolak ajakan.", meaning: "Kalimat itu tidak sedang menolak ajakan." },
      ],
      answer: "a",
      explanation: "んですね dapat digunakan untuk menunjukkan perhatian dan pemahaman terhadap informasi yang baru didengar.",
    },
  ],
  practiceTasks: [
    { prompt: <>Apa arti 「初対面」?</>, options: [{ key: "a", label: "Pertemuan pertama; baru pertama kali bertemu" }, { key: "b", label: "Pertemuan rutin setiap minggu" }, { key: "c", label: "Tempat duduk kosong" }], answer: "a", explanation: <>初対面（はつたいめん） berarti situasi ketika dua orang bertemu untuk pertama kalinya.</> },
    { prompt: <>Pola 「V-てもいいですか」 digunakan untuk ...</>, options: [{ key: "a", label: "Meminta izin melakukan sesuatu." }, { key: "b", label: "Menyampaikan pengalaman masa lalu." }, { key: "c", label: "Menyatakan larangan." }], answer: "a", explanation: <>Pola ini digunakan untuk menanyakan apakah suatu tindakan diperbolehkan.</> },
    { prompt: <>Apa jawaban yang menunjukkan bahwa seseorang mengizinkan kita duduk?</>, options: [{ key: "a", label: <>はい、どうぞ。</> }, { key: "b", label: <>まだわかりません。</> }, { key: "c", label: <>行ったことがあります。</> }], answer: "a", explanation: <>はい、どうぞ berarti 'ya, silakan' dan merupakan respons yang wajar saat memberikan izin.</> },
    { prompt: <>Apa fungsi 「んですね」 dalam 「写真が好きなんですね」?</>, options: [{ key: "a", label: "Menanggapi informasi dengan menunjukkan perhatian." }, { key: "b", label: "Meminta seseorang berhenti memotret." }, { key: "c", label: "Menanyakan harga kamera." }], answer: "a", explanation: <>んですね menunjukkan bahwa pembicara memahami atau menyadari informasi tentang lawan bicara.</> },
    { prompt: <>Pertanyaan 「日本の祭りを見たことがありますか」 menanyakan ...</>, options: [{ key: "a", label: "Apakah seseorang pernah melihat festival Jepang." }, { key: "b", label: "Apakah seseorang sedang melihat festival." }, { key: "c", label: "Apakah seseorang ingin mengadakan festival." }], answer: "a", explanation: <>V-たことがありますか menanyakan pengalaman yang pernah dialami.</> },
    { prompt: <>Topik apa yang paling sesuai untuk memulai percakapan dengan orang yang baru dikenal?</>, options: [{ key: "a", label: "Hobi atau kegiatan saat hari libur." }, { key: "b", label: "Informasi pribadi yang sangat sensitif." }, { key: "c", label: "Rahasia keluarga." }], answer: "a", explanation: <>Topik ringan yang mudah dijawab membantu kedua orang merasa nyaman saat mulai berbicara.</> },
  ],
  quizQuestions: [
    { prompt: <>Kamu ingin duduk di kursi kosong di sebelah seseorang. Pilih permintaan izin yang tepat.</>, options: [{ key: "a", label: <>隣に座ってもいいですか。</> }, { key: "b", label: <>隣に座ったことがあります。</> }, { key: "c", label: <>隣に座らないでください。</> }], answer: "a", explanation: <>座ってもいいですか digunakan untuk meminta izin duduk.</> },
    { prompt: <>Pilih respons yang tepat ketika seseorang memberi izin.</>, options: [{ key: "a", label: <>はい、どうぞ。</> }, { key: "b", label: <>いいえ、ありません。</> }, { key: "c", label: <>いつですか。</> }], answer: "a", explanation: <>はい、どうぞ berarti 'ya, silakan'.</> },
    { prompt: <>Seseorang berkata bahwa ia menyukai fotografi. Tanggapan mana yang menunjukkan perhatian?</>, options: [{ key: "a", label: <>写真を撮るのが好きなんですね。</> }, { key: "b", label: <>写真を撮らないでください。</> }, { key: "c", label: <>写真を撮ったことがありませんか。</> }], answer: "a", explanation: <>んですね digunakan untuk menanggapi informasi yang baru diketahui.</> },
    { prompt: <>Kalimat 「料理教室に参加したことがありますか」 berarti ...</>, options: [{ key: "a", label: "Apakah kamu pernah ikut kelas memasak?" }, { key: "b", label: "Apakah kamu sedang mengajar kelas memasak?" }, { key: "c", label: "Apakah kamu ingin membuka kelas memasak?" }], answer: "a", explanation: <>V-たことがありますか menanyakan pengalaman.</> },
    { prompt: <>Menurut bacaan, hal apa yang baik dilakukan saat berbicara dengan orang yang baru dikenal?</>, options: [{ key: "a", label: "Mendengarkan dengan baik dan mengajukan pertanyaan ringan." }, { key: "b", label: "Langsung menanyakan semua urusan pribadi." }, { key: "c", label: "Menguasai percakapan tanpa memberi kesempatan menjawab." }], answer: "a", explanation: <>Artikel menyarankan mendengarkan lawan bicara dan memulai dari pertanyaan yang mudah dijawab.</> },
  ],
};

export default function IrodoriPreIntermediateLessonEightPage() {
  return <IrodoriInteractiveLesson content={content} />;
}
