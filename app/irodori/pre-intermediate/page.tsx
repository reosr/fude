"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Lock } from "lucide-react";
import { useIrodoriProgress } from "@/lib/irodori-progress";

const implementedLessons = [1];
const lessons = [
  { number: 1, topic: "Hal yang disukai dan kegiatan favorit", title: "Futsal itu apa, ya?", description: "Memahami komentar tentang olahraga favorit, mengundang teman ke acara, dan menulis pesan pembatalan." },
  { number: 2, topic: "Hal yang disukai dan kegiatan favorit", title: "Saya paling suka menonton drama televisi.", description: "Membaca ulasan, membicarakan film atau drama, dan menjelaskan hal yang disukai beserta alasannya." },
  { number: 3, topic: "Di mana kamu akan tinggal?", title: "Bagaimana persiapan pindahanmu?", description: "Mencari informasi tempat tinggal, memahami rekomendasi lokasi, dan meminta bantuan pindahan." },
  { number: 4, topic: "Di mana kamu akan tinggal?", title: "Sepertinya AC-nya rusak...", description: "Melaporkan masalah tempat tinggal, menyampaikan keluhan, dan menjelaskan kondisi lingkungan rumah." },
  { number: 5, topic: "Makanan sehari-hari", title: "Restoran seperti apa yang bagus?", description: "Memesan makanan, merekomendasikan restoran, dan memahami penjelasan makanan khas." },
  { number: 6, topic: "Makanan sehari-hari", title: "Saya memasak sendiri setiap hari.", description: "Membicarakan belanja bahan makanan, kebiasaan makan, dan cara mengatur menu sehari-hari." },
  { number: 7, topic: "Berkenalan dengan orang", title: "Saya berharap bisa berteman dengan banyak orang.", description: "Memahami saran untuk berkenalan, mencari informasi klub, dan memperkenalkan diri dengan lebih lengkap." },
  { number: 8, topic: "Berkenalan dengan orang", title: "Bolehkah saya duduk di sebelahmu?", description: "Memulai percakapan dengan orang baru, merespons obrolan ringan, dan memahami artikel tentang kesan pertama." },
  { number: 9, topic: "Bahasa Jepang dan diriku", title: "Apa yang membuatmu tertarik belajar bahasa Jepang?", description: "Menyampaikan tujuan belajar, bertanya tentang dialek, serta menceritakan pengalaman belajar bahasa Jepang." },
  { number: 10, topic: "Bahasa Jepang dan diriku", title: "Bagaimana caramu belajar bahasa Jepang?", description: "Memilih sumber belajar, bertukar metode belajar, dan menulis profil untuk mencari teman tandem." },
  { number: 11, topic: "Apa yang kamu lakukan dalam situasi seperti ini?", title: "Ini email penipuan.", description: "Mengenali pesan mencurigakan, memahami aturan, dan merespons permintaan konfirmasi identitas." },
  { number: 12, topic: "Apa yang kamu lakukan dalam situasi seperti ini?", title: "Saya membutuhkan ambulans.", description: "Menawarkan bantuan, menyampaikan informasi darurat, dan menjelaskan pengalaman sulit dengan runtut." },
  { number: 13, topic: "Hubungan dengan orang lain", title: "Selamat atas pernikahanmu.", description: "Mengucapkan selamat, bertukar kabar, memberi saran hadiah, dan memahami pidato acara." },
  { number: 14, topic: "Hubungan dengan orang lain", title: "Saya sedang menghadapi masalah dengan teman.", description: "Mendengarkan masalah pertemanan, menggambarkan karakter, dan menyampaikan saran yang spesifik." },
  { number: 15, topic: "Serunya bepergian", title: "Saya ingin melihat Sakurajima.", description: "Memahami video dan artikel wisata, lalu menjelaskan tempat yang ingin dikunjungi." },
  { number: 16, topic: "Serunya bepergian", title: "Saya berhasil mengambil banyak foto bagus.", description: "Mengirim kabar dari perjalanan, meminta penyesuaian layanan, dan menceritakan pengalaman wisata." },
  { number: 17, topic: "Bekerja di Jepang", title: "Saya akan menjelaskan pekerjaan staf layanan lantai.", description: "Memberi instruksi kerja, memahami aturan tempat kerja, dan menyampaikan permintaan atau masalah." },
  { number: 18, topic: "Bekerja di Jepang", title: "Saya akan senang jika diberi kesempatan bekerja di sana.", description: "Memahami laporan pekerjaan, membaca informasi lowongan, dan menjelaskan kemampuan saat wawancara." },
];

export default function IrodoriPreIntermediatePage() {
  const progress = useIrodoriProgress();
  const completedCount = progress.completedLessons.filter((id) => id.startsWith("preintermediate-")).length;
  const topics = [...new Set(lessons.map((lesson) => lesson.topic))];

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-12">
      <Link href="/irodori" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] hover:border-[#B79ADE]/40">
        <ArrowLeft size={15} /> Semua level Irodori
      </Link>
      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#80619B]/45 bg-gradient-to-br from-[#392B4D] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D9C2F4]/[0.08]">彩</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#C8A9EA]">IRODORI • PRA-MENENGAH</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div><h1 className="font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Pra-Menengah</h1><p className="mt-1 text-sm font-semibold text-[#C8A9EA]">Tingkat A2/B1 · 18 Pelajaran</p></div>
            <span className="rounded-xl border border-[#B79ADE]/25 bg-[#80619B]/20 px-3 py-2 text-[10px] font-bold text-[#E3D5F6]">9 topik • 18 pelajaran</span>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">Mengembangkan kemampuan untuk memahami informasi yang lebih panjang, bertukar pendapat, menjelaskan pengalaman, membaca teks praktis, dan menyampaikan pesan dengan lebih terstruktur.</p>
          <div className="mt-5 max-w-md rounded-xl border border-white/[0.07] bg-black/20 p-3">
            <div className="flex items-center justify-between text-[10px]"><span className="font-semibold text-[#A3A099]">Progres Irodori Pra-Menengah</span><span className="font-bold text-[#E3D5F6]">{completedCount}/18 selesai</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#302D29]"><div className="h-full rounded-full bg-gradient-to-r from-[#80619B] to-[#C8A9EA] transition-all" style={{ width: (completedCount / 18) * 100 + "%" }} /></div>
            <p className="mt-2 text-[9px] text-[#817A73]">Progres jalur ini tersimpan terpisah dari Pemula, Dasar, EXP, dan JLPT.</p>
          </div>
        </div>
      </header>
      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.22em] text-[#C8A9EA]">MATERI PRA-MENENGAH A2/B1</p><h2 className="mt-1 text-xl font-black text-[#EAE6DD]">Daftar pelajaran</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Sembilan topik dengan delapan belas pelajaran. Pelajaran yang sudah dibuat akan terbuka berurutan setelah pelajaran sebelumnya selesai.</p></div>
        <div className="space-y-5">
          {topics.map((topic) => (
            <section key={topic} className="space-y-3">
              <div className="flex items-center gap-3"><span className="h-px flex-1 bg-[#80619B]/35" /><h3 className="text-center text-[10px] font-black tracking-[0.14em] text-[#C8A9EA]">{topic}</h3><span className="h-px flex-1 bg-[#80619B]/35" /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {lessons.filter((lesson) => lesson.topic === topic).map((lesson) => {
                  const lessonId = "preintermediate-" + String(lesson.number).padStart(2, "0");
                  const isImplemented = implementedLessons.includes(lesson.number);
                  const previousCompleted = lesson.number === 1 || progress.completedLessons.includes("preintermediate-" + String(lesson.number - 1).padStart(2, "0"));
                  const isCompleted = progress.completedLessons.includes(lessonId);
                  const isAvailable = isImplemented && (previousCompleted || isCompleted);
                  const card = (
                    <div className={"relative isolate h-full overflow-hidden rounded-2xl border p-4 shadow-lg shadow-black/10 transition-all " + (isAvailable ? "border-[#80619B]/35 bg-gradient-to-br from-[#392B4D]/60 to-[#191817] group-hover:-translate-y-0.5 group-hover:border-[#C8A9EA]/55" : "border-white/[0.07] bg-[#191817]/80 opacity-75")}>
                      <div className="flex items-center justify-between gap-3"><span className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">PELAJARAN {String(lesson.number).padStart(2, "0")}</span><span className={"inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-bold " + (isCompleted ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300" : isAvailable ? "border-[#B79ADE]/25 bg-[#80619B]/15 text-[#E3D5F6]" : "border-white/10 bg-white/[0.04] text-[#817A73]")}>{isCompleted ? <CheckCircle2 size={11} /> : isAvailable ? <BookOpen size={11} /> : <Lock size={11} />}{isCompleted ? "Selesai" : isAvailable ? "Bisa dipelajari" : "Terkunci"}</span></div>
                      <h4 className="mt-3 text-sm font-bold leading-6 text-[#F1EBDD]">{lesson.title}</h4><p className="mt-2 text-[10px] leading-5 text-[#A9A398]">{lesson.description}</p>
                    </div>
                  );
                  return isAvailable ? <Link key={lesson.number} href={"/irodori/pre-intermediate/lesson-" + lesson.number} className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A9EA]">{card}</Link> : <div key={lesson.number}>{card}</div>;
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
      <p className="rounded-2xl border border-[#80619B]/25 bg-[#2A2333]/70 p-4 text-xs leading-6 text-[#A9A398]"><span className="font-bold text-[#C8A9EA]">Catatan:</span> Pra-Menengah merupakan jalur A2/B1 tersendiri setelah materi Dasar. Tingkat bahasa pada aktivitas dapat berbeda antara A2 dan B1 sesuai target komunikasi di setiap pelajaran.</p>
    </main>
  );
}
