"use client";

import IrodoriInteractiveLesson, { type IrodoriLessonContent } from "@/components/IrodoriInteractiveLesson";
import { IRODORI_SPEAKERS } from "@/lib/irodori-speakers";

const speakers = IRODORI_SPEAKERS;
const yui = { ...speakers.yui, name: "Yui", role: "Teman" };
const sota = { ...speakers.sota, name: "Sota", role: "Teman" };
const akiko = { ...speakers.akiko, name: "Akiko", role: "Warga setempat" };
const kenji = { ...speakers.kenji, name: "Kenji", role: "Pengurus komunitas" };

const content: IrodoriLessonContent = {
  lessonId: "preintermediate-07",
  number: 7,
  title: "Saya berharap bisa berteman dengan banyak orang.",
  japaneseTitle: "いろいろな人と友だちになりたいです",
  description: "Mencari cara untuk berkenalan dengan orang di lingkungan sekitar, memahami informasi kegiatan komunitas, dan memperkenalkan diri dengan menceritakan minat serta pengalaman secara lebih lengkap.",
  emblem: "友",
  tags: ["Berkenalan dengan orang baru", "Kegiatan komunitas", "Memperkenalkan diri"],
  canDos: [
    { id: "get-advice-to-meet-people", source: "TARGET KOMUNIKASI 21 · A2", text: "Memahami dan meminta saran tentang cara berkenalan dengan orang baru di lingkungan tempat tinggal atau komunitas." },
    { id: "find-community-information", source: "TARGET KOMUNIKASI 22 · A2/B1", text: "Mencari informasi kegiatan atau klub, lalu menanyakan jadwal, biaya, tempat, dan cara ikut serta." },
    { id: "introduce-interests", source: "TARGET KOMUNIKASI 23 · B1", text: "Memperkenalkan diri dengan lebih lengkap, menjelaskan minat, pengalaman, dan alasan ingin bergabung dalam suatu kegiatan." },
  ],
  conversations: [
    {
      title: "Meminta saran agar punya teman baru",
      speakers: [yui, akiko],
      utterances: [
        { speakerId: "yui", japanese: <>最近、この町に引っ越してきたんですが、まだ知り合いが少ないんです。</>, romaji: "Saikin, kono machi ni hikkoshite kita n desu ga, mada shiriai ga sukunai n desu.", translation: "Akhir-akhir ini saya pindah ke kota ini, tetapi kenalan saya masih sedikit.", audioFileName: "irodori-preintermediate-07-u001.mp3" },
        { speakerId: "akiko", japanese: <>そうなんですか。それなら、地域の交流会に参加してみたらどうですか。</>, romaji: "Sou nan desu ka. Sore nara, chiiki no kouryuukai ni sanka shite mitara dou desu ka.", translation: "Oh, begitu. Kalau begitu, bagaimana kalau kamu mencoba ikut acara pertemuan warga?", audioFileName: "irodori-preintermediate-07-u002.mp3" },
        { speakerId: "yui", japanese: <>交流会では、どんなことをするんですか。</>, romaji: "Kouryuukai de wa, donna koto o suru n desu ka.", translation: "Di acara itu biasanya melakukan kegiatan apa?", audioFileName: "irodori-preintermediate-07-u003.mp3" },
        { speakerId: "akiko", japanese: <>みんなでお茶を飲んだり、町のイベントについて話したりするそうですよ。</>, romaji: "Minna de ocha o nondari, machi no ibento ni tsuite hanashitari suru sou desu yo.", translation: "Katanya, semua orang minum teh bersama dan membicarakan acara di kota.", audioFileName: "irodori-preintermediate-07-u004.mp3" },
      ],
    },
    {
      title: "Menanyakan informasi klub",
      speakers: [sota, kenji],
      utterances: [
        { speakerId: "sota", japanese: <>市民センターの写真クラブについて聞きたいんですが、今もメンバーを募集していますか。</>, romaji: "Shimin sentaa no shashin kurabu ni tsuite kikitai n desu ga, ima mo menbaa o boshuu shite imasu ka.", translation: "Saya ingin bertanya tentang klub fotografi di pusat kegiatan warga. Apakah sekarang masih menerima anggota?", audioFileName: "irodori-preintermediate-07-u005.mp3" },
        { speakerId: "kenji", japanese: <>はい。初心者も参加できるそうですよ。</>, romaji: "Hai. Shoshinsha mo sanka dekiru sou desu yo.", translation: "Ya. Katanya, pemula juga boleh ikut.", audioFileName: "irodori-preintermediate-07-u006.mp3" },
        { speakerId: "sota", japanese: <>活動はいつですか。会費も必要ですか。</>, romaji: "Katsudou wa itsu desu ka. Kaihi mo hitsuyou desu ka.", translation: "Kegiatannya kapan? Apakah perlu membayar iuran anggota juga?", audioFileName: "irodori-preintermediate-07-u007.mp3" },
        { speakerId: "kenji", japanese: <>毎月第二土曜日です。会費はかかりませんが、材料費が必要なときもあるそうです。</>, romaji: "Maitsuki dai ni doyoubi desu. Kaihi wa kakarimasen ga, zairyouhi ga hitsuyou na toki mo aru sou desu.", translation: "Setiap Sabtu kedua setiap bulan. Tidak ada iuran anggota, tetapi katanya kadang-kadang ada biaya bahan.", audioFileName: "irodori-preintermediate-07-u008.mp3" },
      ],
    },
    {
      title: "Memperkenalkan diri di kegiatan komunitas",
      speakers: [yui, sota],
      utterances: [
        { speakerId: "yui", japanese: <>はじめまして。ユイです。インドネシアから来ました。</>, romaji: "Hajimemashite. Yui desu. Indoneshia kara kimashita.", translation: "Salam kenal. Saya Yui. Saya berasal dari Indonesia.", audioFileName: "irodori-preintermediate-07-u009.mp3" },
        { speakerId: "sota", japanese: <>はじめまして。日本にはどのくらい住んでいるんですか。</>, romaji: "Hajimemashite. Nihon ni wa dono kurai sunde iru n desu ka.", translation: "Salam kenal. Sudah berapa lama tinggal di Jepang?", audioFileName: "irodori-preintermediate-07-u010.mp3" },
        { speakerId: "yui", japanese: <>一年になります。子どものころから写真を撮るのが好きで、最近は町の景色も撮るようになりました。</>, romaji: "Ichinen ni narimasu. Kodomo no koro kara shashin o toru no ga suki de, saikin wa machi no keshiki mo toru you ni narimashita.", translation: "Sudah satu tahun. Sejak kecil saya suka memotret, dan akhir-akhir ini saya juga mulai memotret pemandangan kota.", audioFileName: "irodori-preintermediate-07-u011.mp3" },
        { speakerId: "sota", japanese: <>いいですね。今度、いっしょに写真を撮りに行きませんか。</>, romaji: "Ii desu ne. Kondo, issho ni shashin o tori ni ikimasen ka.", translation: "Menarik, ya. Kapan-kapan mau pergi memotret bersama?", audioFileName: "irodori-preintermediate-07-u012.mp3" },
      ],
    },
    {
      title: "Menceritakan alasan ingin bergabung",
      speakers: [akiko, yui],
      utterances: [
        { speakerId: "akiko", japanese: <>どうしてこのサークルに参加したいと思ったんですか。</>, romaji: "Doushite kono saakuru ni sanka shitai to omotta n desu ka.", translation: "Mengapa kamu ingin bergabung dengan komunitas ini?", audioFileName: "irodori-preintermediate-07-u013.mp3" },
        { speakerId: "yui", japanese: <>日本語を使って、いろいろな人と話せるようになりたいんです。</>, romaji: "Nihongo o tsukatte, iroiro na hito to hanaseru you ni naritai n desu.", translation: "Saya ingin bisa berbicara dengan berbagai macam orang menggunakan bahasa Jepang.", audioFileName: "irodori-preintermediate-07-u014.mp3" },
        { speakerId: "akiko", japanese: <>すばらしいですね。ここでは料理やスポーツなど、いろいろな活動をしていますよ。</>, romaji: "Subarashii desu ne. Koko de wa ryouri ya supootsu nado, iroiro na katsudou o shite imasu yo.", translation: "Bagus sekali. Di sini ada berbagai kegiatan seperti memasak dan olahraga.", audioFileName: "irodori-preintermediate-07-u015.mp3" },
        { speakerId: "yui", japanese: <>料理にも興味があります。みなさんといっしょに新しいことを始めてみたいです。</>, romaji: "Ryouri ni mo kyoumi ga arimasu. Minasan to issho ni atarashii koto o hajimete mitai desu.", translation: "Saya juga tertarik memasak. Saya ingin mencoba hal baru bersama kalian.", audioFileName: "irodori-preintermediate-07-u016.mp3" },
      ],
    },
  ],
  readingArticle: {
    title: "初めての人も歓迎です",
    lead: "Baca pengumuman komunitas berikut. Perhatikan tujuan kegiatan, jadwal, biaya, dan cara menghubungi pengurus.",
    paragraphs: [
      { japanese: <>地域交流サークルでは、新しいメンバーを募集しています。近所に住んでいる人なら、だれでも参加できます。日本語を勉強している人も歓迎です。</>, translation: "Komunitas pertukaran warga sedang mencari anggota baru. Siapa pun yang tinggal di sekitar sini boleh ikut. Orang yang sedang belajar bahasa Jepang juga diterima." },
      { japanese: <>活動は毎月第二土曜日の午後二時から四時までです。市民センターの二階で、お茶を飲んだり、ゲームをしたり、いっしょに料理を作ったりします。</>, translation: "Kegiatan diadakan setiap Sabtu kedua setiap bulan, dari pukul dua sampai empat sore. Di lantai dua pusat kegiatan warga, peserta minum teh, bermain permainan, dan memasak bersama." },
      { japanese: <>参加費は無料です。参加したい人は、金曜日までに受付で名前を知らせてください。初めて参加する人は、友だちといっしょに来てもいいです。</>, translation: "Biaya keikutsertaan gratis. Jika ingin ikut, beri tahu nama di meja penerimaan paling lambat hari Jumat. Peserta yang baru pertama kali datang boleh membawa teman." },
    ],
  },
  vocabRows: [
    ["友だち", "ともだち · tomodachi", "Teman"],
    ["知り合い", "しりあい · shiriai", "Kenalan"],
    ["近所", "きんじょ · kinjo", "Lingkungan sekitar; tetangga sekitar"],
    ["地域", "ちいき · chiiki", "Wilayah; komunitas setempat"],
    ["交流", "こうりゅう · kouryuu", "Interaksi; pertukaran"],
    ["交流会", "こうりゅうかい · kouryuukai", "Acara pertemuan atau interaksi warga"],
    ["市民センター", "しみんセンター · shimin sentaa", "Pusat kegiatan warga"],
    ["サークル", "サークル · saakuru", "Klub atau komunitas kegiatan"],
    ["写真", "しゃしん · shashin", "Foto"],
    ["写真クラブ", "しゃしんクラブ · shashin kurabu", "Klub fotografi"],
    ["募集する", "ぼしゅうする · boshou suru", "Merekrut; membuka pendaftaran"],
    ["メンバー", "メンバー · menbaa", "Anggota"],
    ["初心者", "しょしんしゃ · shoshinsha", "Pemula"],
    ["経験", "けいけん · keiken", "Pengalaman"],
    ["活動", "かつどう · katsudou", "Kegiatan; aktivitas"],
    ["参加する", "さんかする · sanka suru", "Ikut serta; berpartisipasi"],
    ["参加費", "さんかひ · sankahi", "Biaya keikutsertaan"],
    ["会費", "かいひ · kaihi", "Iuran anggota"],
    ["無料", "むりょう · muryou", "Gratis"],
    ["受付", "うけつけ · uketsuke", "Meja penerimaan; resepsionis"],
    ["申し込む", "もうしこむ · moushikomu", "Mendaftar"],
    ["連絡先", "れんらくさき · renrakusaki", "Informasi kontak"],
    ["電話番号", "でんわばんごう · denwa bangou", "Nomor telepon"],
    ["趣味", "しゅみ · shumi", "Hobi"],
    ["興味", "きょうみ · kyoumi", "Ketertarikan; minat"],
    ["得意", "とくい · tokui", "Hal yang dikuasai"],
    ["苦手", "にがて · nigate", "Hal yang kurang dikuasai"],
    ["紹介する", "しょうかいする · shoukai suru", "Memperkenalkan"],
    ["誘う", "さそう · sasou", "Mengajak"],
    ["歓迎する", "かんげいする · kangei suru", "Menyambut; menerima dengan senang hati"],
    ["集まる", "あつまる · atsumaru", "Berkumpul"],
    ["知り合う", "しりあう · shiriau", "Berkenalan; saling mengenal"],
    ["仲良くなる", "なかよくなる · nakayoku naru", "Menjadi akrab"],
    ["続ける", "つづける · tsuzukeru", "Melanjutkan; meneruskan"],
    ["始める", "はじめる · hajimeru", "Memulai"],
    ["毎月", "まいつき · maitsuki", "Setiap bulan"],
    ["第二土曜日", "だいにどようび · dai ni doyoubi", "Sabtu kedua"],
    ["都合", "つごう · tsugou", "Kondisi atau waktu yang cocok"],
    ["ぜひ", "ぜひ · zehi", "Sangat ingin; silakan (dengan antusias)"],
    ["よかったら", "よかったら · yokattara", "Kalau berkenan; kalau tidak keberatan"],
  ],
  kanjiWords: [
    ["友だち", "ともだち · tomodachi", "Teman"],
    ["近所", "きんじょ · kinjo", "Lingkungan sekitar"],
    ["地域", "ちいき · chiiki", "Wilayah; komunitas setempat"],
    ["交流", "こうりゅう · kouryuu", "Interaksi; pertukaran"],
    ["写真", "しゃしん · shashin", "Foto"],
    ["初心者", "しょしんしゃ · shoshinsha", "Pemula"],
    ["経験", "けいけん · keiken", "Pengalaman"],
    ["活動", "かつどう · katsudou", "Kegiatan"],
    ["参加費", "さんかひ · sankahi", "Biaya keikutsertaan"],
    ["無料", "むりょう · muryou", "Gratis"],
  ],
  grammarNotes: [
    {
      title: "01 · Meminta saran tentang cara melakukan sesuatu",
      pattern: "どうしたらいいですか／V-たらいいですか",
      example: <>新しい友だちを作りたいんですが、どうしたらいいですか。<br />このサークルに参加したいんですが、いつ申し込んだらいいですか。</>,
      note: "どうしたらいいですか digunakan untuk meminta saran ketika belum tahu tindakan yang tepat. Pola V-たらいいですか menanyakan tindakan atau waktu yang disarankan. Dalam percakapan, ungkapan ini sering diawali konteks dengan ～んですが agar terdengar lebih alami.",
    },
    {
      title: "02 · Memberi saran dengan lembut",
      pattern: "V-てみたらどうですか",
      example: <>地域のイベントに参加してみたらどうですか。<br />近所の人に聞いてみたらどうですか。</>,
      note: "Pola ini digunakan untuk menyarankan agar seseorang mencoba melakukan sesuatu. Bentuk てみる memberi nuansa 'mencoba', sedangkan どうですか membuat saran terdengar sebagai pilihan, bukan perintah. Untuk orang yang belum akrab atau situasi formal, sampaikan dengan intonasi yang ramah.",
    },
    {
      title: "03 · Menyampaikan informasi yang didengar",
      pattern: "S（普通形）そうです",
      example: <>初心者も参加できるそうです。<br />毎月、交流会を開いているそうですよ。</>,
      note: "そうです setelah kalimat bentuk biasa digunakan untuk menyampaikan informasi yang didengar dari orang lain atau sumber tertentu. Untuk kata benda dan kata sifat-na, gunakan だそうです. Bedakan dengan ～そうです yang berarti 'kelihatannya', misalnya おいしそうです; maknanya bergantung pada bentuk yang mengikuti.",
    },
    {
      title: "04 · Menjelaskan perubahan kebiasaan atau kemampuan",
      pattern: "V（辞書形・ない形・可能形）＋ようになりました",
      example: <>最近、日本語で簡単な会話ができるようになりました。<br />週末に写真を撮りに出かけるようになりました。</>,
      note: "ようになりました menyatakan perubahan yang terjadi secara bertahap. Bentuk kamus dapat menunjukkan kebiasaan baru, bentuk negatif dapat menunjukkan perubahan menjadi tidak melakukan sesuatu, dan bentuk potensial dapat menunjukkan kemampuan yang mulai dimiliki. Contoh: 写真を撮るようになりました (mulai terbiasa memotret) dan 日本語で話せるようになりました (mulai bisa berbicara dalam bahasa Jepang).",
    },
  ],
  writingPractice: {
    title: "Latihan menulis perkenalan diri",
    instruction: "Bayangkan kamu akan bergabung dengan klub atau kegiatan komunitas. Tulis perkenalan singkat yang menyebutkan asal atau tempat tinggal, hobi, pengalaman, dan alasan ingin bergabung. Tambahkan satu hal yang ingin kamu coba bersama anggota lain.",
    exampleLabel: "CONTOH ORISINAL FUDE",
    exampleJapanese: <>はじめまして。ユイです。写真を撮ることが好きです。日本に来てから、町の景色を撮るようになりました。いろいろな人と話したいので、このサークルに参加したいと思いました。よろしくお願いします。</>,
    exampleTranslation: "Salam kenal. Saya Yui. Saya suka memotret. Sejak datang ke Jepang, saya mulai memotret pemandangan kota. Karena ingin berbicara dengan berbagai macam orang, saya ingin bergabung dengan komunitas ini. Senang berkenalan dengan kalian.",
    placeholder: "はじめまして。＿＿です。趣味は＿＿です。...",
  },
  simulations: [
    {
      title: "01 · Meminta saran",
      heading: "Memilih ungkapan untuk meminta ide",
      prompt: "Kamu baru pindah ke lingkungan baru dan ingin punya kenalan. Kamu belum tahu kegiatan apa yang bisa diikuti. Kalimat mana yang paling tepat untuk meminta saran?",
      japanese: <>近所に知り合いがいないんですが、どうしたらいいですか。</>,
      translation: "Saya belum punya kenalan di lingkungan sekitar. Sebaiknya saya bagaimana?",
      options: [
        { key: "a", label: "どうしたらいいですか。", meaning: "Meminta saran tentang tindakan yang sebaiknya dilakukan." },
        { key: "b", label: "何時に始まりますか。", meaning: "Menanyakan jam mulai, bukan meminta saran." },
        { key: "c", label: "いくらですか。", meaning: "Menanyakan harga atau biaya." },
      ],
      answer: "a",
      explanation: "どうしたらいいですか digunakan ketika pembicara meminta saran karena belum tahu tindakan yang tepat.",
    },
    {
      title: "02 · Memahami informasi klub",
      heading: "Menentukan informasi biaya",
      prompt: "Pada pengumuman tertulis 「参加費は無料です」. Informasi apa yang bisa kamu simpulkan?",
      japanese: <>参加費は無料です。</>,
      translation: "Biaya keikutsertaan gratis.",
      options: [
        { key: "a", label: "Tidak perlu membayar biaya keikutsertaan.", meaning: "無料 berarti gratis atau tidak dikenai biaya." },
        { key: "b", label: "Hanya anggota lama yang boleh ikut.", meaning: "Kalimat tidak menyebutkan pembatasan anggota." },
        { key: "c", label: "Kegiatan diadakan setiap hari.", meaning: "Kalimat tidak menyebutkan jadwal kegiatan." },
      ],
      answer: "a",
      explanation: "無料 berarti tidak dikenai biaya. Tetap baca informasi lain karena biaya tambahan tertentu bisa saja dijelaskan secara terpisah.",
    },
    {
      title: "03 · Memperkenalkan minat",
      heading: "Menjelaskan perubahan kebiasaan",
      prompt: "Kamu dulu jarang mengambil foto, tetapi sekarang sering memotret pemandangan kota. Ungkapan mana yang paling sesuai?",
      japanese: <>最近、町の景色を撮るようになりました。</>,
      translation: "Akhir-akhir ini saya mulai memotret pemandangan kota.",
      options: [
        { key: "a", label: "撮るようになりました。", meaning: "Menyatakan kebiasaan yang baru mulai dilakukan." },
        { key: "b", label: "撮らないでください。", meaning: "Meminta seseorang untuk tidak memotret." },
        { key: "c", label: "撮ってもいいですか。", meaning: "Meminta izin untuk memotret." },
      ],
      answer: "a",
      explanation: "V-るようになりました menyatakan perubahan kebiasaan atau keadaan yang mulai terjadi.",
    },
  ],
  practiceTasks: [
    { prompt: <>Apa arti 「知り合い」?</>, options: [{ key: "a", label: "Kenalan" }, { key: "b", label: "Pengurus klub" }, { key: "c", label: "Biaya kegiatan" }], answer: "a", explanation: <>知り合い berarti orang yang dikenal atau kenalan.</> },
    { prompt: <>Pola 「どうしたらいいですか」 digunakan untuk ...</>, options: [{ key: "a", label: "Meminta saran tentang tindakan yang sebaiknya dilakukan." }, { key: "b", label: "Mengundang seseorang secara langsung." }, { key: "c", label: "Menyampaikan informasi yang didengar." }], answer: "a", explanation: <>どうしたらいいですか meminta saran ketika pembicara belum tahu tindakan yang tepat.</> },
    { prompt: <>Apa nuansa pola 「V-てみたらどうですか」?</>, options: [{ key: "a", label: "Menyarankan seseorang untuk mencoba sesuatu." }, { key: "b", label: "Melarang seseorang melakukan sesuatu." }, { key: "c", label: "Menceritakan kebiasaan masa lalu." }], answer: "a", explanation: <>Pola ini memberi saran secara lembut agar lawan bicara mencoba suatu tindakan.</> },
    { prompt: <>Dalam 「初心者も参加できるそうです」, そうです menyatakan ...</>, options: [{ key: "a", label: "Informasi yang didengar dari sumber lain." }, { key: "b", label: "Penampilan yang terlihat secara langsung." }, { key: "c", label: "Keinginan pembicara." }], answer: "a", explanation: <>そうです setelah kalimat bentuk biasa dapat digunakan untuk menyampaikan kabar atau informasi yang didengar.</> },
    { prompt: <>Apa fungsi 「ようになりました」 pada 「写真を撮るようになりました」?</>, options: [{ key: "a", label: "Menyatakan kebiasaan yang mulai berubah." }, { key: "b", label: "Meminta izin untuk mengambil foto." }, { key: "c", label: "Menyatakan larangan." }], answer: "a", explanation: <>Ungkapan tersebut menunjukkan bahwa memotret mulai menjadi kebiasaan.</> },
    { prompt: <>Saat memperkenalkan diri untuk bergabung dengan klub, informasi apa yang paling membantu?</>, options: [{ key: "a", label: "Minat, pengalaman, dan alasan ingin bergabung." }, { key: "b", label: "Hanya menyebutkan nomor urut." }, { key: "c", label: "Menyebutkan informasi pribadi yang tidak berkaitan." }], answer: "a", explanation: <>Minat, pengalaman, dan alasan bergabung membantu anggota lain mengenal kita serta menemukan kesamaan.</> },
  ],
  quizQuestions: [
    { prompt: <>Temanmu bertanya bagaimana cara mendapat kenalan di lingkungan baru. Ungkapan mana yang meminta saran?</>, options: [{ key: "a", label: <>どうしたらいいですか。</> }, { key: "b", label: <>何時に始まりますか。</> }, { key: "c", label: <>どこで買いましたか。</> }], answer: "a", explanation: <>どうしたらいいですか digunakan untuk meminta saran tentang tindakan yang tepat.</> },
    { prompt: <>Pilih kalimat yang menyampaikan saran agar seseorang mencoba ikut kegiatan komunitas.</>, options: [{ key: "a", label: <>交流会に参加してみたらどうですか。</> }, { key: "b", label: <>交流会に参加したことがあります。</> }, { key: "c", label: <>交流会に参加しないでください。</> }], answer: "a", explanation: <>V-てみたらどうですか menyarankan seseorang untuk mencoba melakukan sesuatu.</> },
    { prompt: <>Kalimat 「土曜日に活動しているそうです」 berarti ...</>, options: [{ key: "a", label: "Katanya, kegiatannya berlangsung pada hari Sabtu." }, { key: "b", label: "Kelihatannya hari Sabtu akan cerah." }, { key: "c", label: "Saya ingin kegiatan pada hari Sabtu." }], answer: "a", explanation: <>そうです pada kalimat ini menyampaikan informasi yang didengar, bukan penampilan yang terlihat.</> },
    { prompt: <>Kamu ingin mengatakan bahwa sekarang sudah bisa berbicara sedikit dalam bahasa Jepang. Pilih bentuk yang tepat.</>, options: [{ key: "a", label: <>日本語で少し話せるようになりました。</> }, { key: "b", label: <>日本語で少し話してみたらどうですか。</> }, { key: "c", label: <>日本語で少し話したそうです。</> }], answer: "a", explanation: <>話せるようになりました menyatakan kemampuan yang sekarang mulai dimiliki.</> },
    { prompt: <>Apa isi perkenalan diri yang cocok ketika pertama kali bergabung dengan klub?</>, options: [{ key: "a", label: "Nama, minat, pengalaman, dan alasan bergabung." }, { key: "b", label: "Daftar lengkap semua anggota yang sudah lama bergabung." }, { key: "c", label: "Informasi yang tidak berhubungan dengan kegiatan." }], answer: "a", explanation: <>Perkenalan yang relevan membantu orang lain memahami minat dan tujuan kita bergabung.</> },
  ],
};

export default function IrodoriPreIntermediateLessonSevenPage() {
  return <IrodoriInteractiveLesson content={content} />;
}
