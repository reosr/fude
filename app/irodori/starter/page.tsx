"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Lock } from "lucide-react";
import { useIrodoriProgress } from "@/lib/irodori-progress";

const lessons = Array.from({ length: 18 }, (_, index) => index + 1);

export default function IrodoriStarterPage() {
  const progress = useIrodoriProgress();
  const completedCount = progress.completedLessons.filter((id) =>
    id.startsWith("starter-")
  ).length;

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-12">
      <Link
        href="/irodori"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"
      >
        <ArrowLeft size={15} />
        Semua level Irodori
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#79602F]/45 bg-gradient-to-br from-[#302319] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D6AD4F]/[0.07]">
          入
        </div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#D6AD4F]">
            IRODORI • STARTER
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">
                Starter
              </h1>
              <p className="mt-1 text-sm font-semibold text-[#D9B66D]">
                Tingkat A1 · 18 Pelajaran
              </p>
            </div>
            <span className="rounded-xl border border-[#D6AD4F]/25 bg-[#D6AD4F]/10 px-3 py-2 text-[10px] font-bold text-[#E7D2A1]">
              16 dari 18 materi tersedia
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Mulai dari ungkapan paling dasar untuk berkomunikasi dalam
            kehidupan sehari-hari. Pelajari setiap tujuan Can-do melalui
            contoh, dialog, dan latihan.
          </p>
          <div className="mt-5 max-w-md rounded-xl border border-white/[0.07] bg-black/20 p-3">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-semibold text-[#A3A099]">Progres Irodori Starter</span>
              <span className="font-bold text-[#E7D2A1]">{completedCount}/18 selesai</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#302D29]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#92272C] to-[#D6AD4F] transition-all"
                style={{ width: `${(completedCount / 18) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-[9px] text-[#817A73]">
              Progres ini tersimpan terpisah dari EXP dan JLPT.
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.22em] text-[#B8860B]">
            MATERI STARTER A1
          </p>
          <h2 className="mt-1 text-xl font-black text-[#EAE6DD]">
            Daftar pelajaran
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => {
            const isAvailable = lesson <= 16;
            const lessonId = `starter-${String(lesson).padStart(2, "0")}`;
            const isCompleted = progress.completedLessons.includes(lessonId);
            const lessonTitle =
              lesson === 1
                ? "Good morning!"
                : lesson === 2
                  ? "I'm sorry, I don't really understand."
                  : lesson === 3
                    ? "Nice to meet you."
                    : lesson === 4
                    ? "I live in Tokyo."
                    : lesson === 5
                      ? "I like udon."
                      : lesson === 6
                        ? "Cheeseburger, please."
                        : lesson === 7
                          ? "There are four rooms."
                          : lesson === 8
                            ? "Where is Yamada-san?"
                            : lesson === 9
                              ? "Lunch is from noon to 1 o’clock."
                              : lesson === 10
                              ? "Please lend me the stapler."
                              : lesson === 11
                              ? "What kind of manga do you like?"
                              : lesson === 12
                                ? "Shall we go together?"
                                : lesson === 13
                                  ? "Does this bus go to the airport?"
                                  : lesson === 14
                                    ? "It’s a big building, isn’t it?"
                                    : lesson === 15
                                      ? "I need some batteries."
                                      : "How much is this?";
            const lessonDescription =
              lesson === 1
                ? "Sapaan, berpamitan, ucapan terima kasih, dan permintaan maaf."
                : lesson === 2
                  ? "Meminta pengulangan, membicarakan kemampuan bahasa, dan menanyakan cara mengatakan sesuatu."
                  : lesson === 3
                    ? "Memperkenalkan diri, menulis kartu nama, menanyakan asal, dan memahami formulir."
                    : lesson === 4
                    ? "Mengenali keluarga, menanyakan usia dan tempat tinggal, membicarakan foto, serta membaca unggahan singkat."
                    : lesson === 5
                      ? "Menyatakan makanan yang disukai, merespons tawaran minuman, membahas sarapan, dan menulis unggahan makanan."
                      : lesson === 6
                        ? "Membaca menu, memesan makanan, memilih hidangan, menyebut jumlah, meminta barang tambahan, dan mengenali papan nama restoran."
                        : lesson === 7
                          ? "Tur rumah, fasilitas yang tersedia, kondisi rumah, jenis hunian, dan tombol mesin cuci serta remote AC."
                          : lesson === 8
                            ? "Mengenali ruangan di tempat kerja, mencari orang, menanyakan lokasi perlengkapan, dan membaca papan nama ruangan."
                            : lesson === 9
                              ? "Membicarakan jam bangun dan tidur, memahami jadwal kerja, membaca papan jadwal, dan menyepakati waktu bersama."
                              : lesson === 10
                              ? "Memahami instruksi kerja, mengonfirmasi jumlah dan waktu, membaca memo tugas, serta meminjam perlengkapan."
                              : lesson === 11
                              ? "Membahas hobi, hal yang disukai, kegiatan saat libur, dan memahami profil sosial sederhana."
                              : lesson === 12
                                ? "Membaca pengumuman acara, menanyakan kehadiran, mengajak teman, dan membalas undangan."
                                : lesson === 13
                                  ? "Memastikan tujuan kendaraan, menanyakan stasiun, menjelaskan durasi perjalanan, meminta petunjuk rute, dan membaca papan stasiun."
                                  : lesson === 14
                                    ? "Menanyakan letak fasilitas, menjelaskan posisi lewat telepon, menyampaikan kesan tentang tempat, dan membaca jam operasional."
                                    : lesson === 15
                                      ? "Mencari tempat membeli barang, membaca panduan lantai, bertanya kepada staf, memberi komentar produk, dan memahami papan tanda toko."
                                      : "Menanyakan harga, menyebut jumlah barang, menjawab pertanyaan kasir, dan membaca tanda diskon." ;
            const content = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
                    LESSON {String(lesson).padStart(2, "0")}
                  </span>
                  {isAvailable ? (
                    <CheckCircle2 size={17} className={isCompleted ? "text-emerald-300" : "text-[#D9B66D]"} />
                  ) : (
                    <Lock size={15} className="text-[#746F65]" />
                  )}
                </div>
                <h3 className="mt-5 text-base font-black text-[#EAE6DD]">
                  {isAvailable ? lessonTitle : `Pelajaran ${lesson}`}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[#A3A099]">
                  {isAvailable ? lessonDescription : "Materi sedang disiapkan."}
                </p>
                <div className="mt-5 flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${
                      isAvailable
                        ? "border-[#D6AD4F]/30 bg-[#D6AD4F]/10 text-[#E7D2A1]"
                        : "border-white/[0.07] bg-white/[0.03] text-[#817A73]"
                    }`}
                  >
                    {isAvailable ? (isCompleted ? "Selesai" : "Bisa dipelajari") : "Segera hadir"}
                  </span>
                  {isAvailable && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#D9B66D]">
                      Mulai <BookOpen size={13} />
                    </span>
                  )}
                </div>
              </>
            );

            return isAvailable ? (
              <Link
                key={lesson}
                href={`/irodori/starter/lesson-${lesson}`}
                className="group rounded-2xl border border-[#B8860B]/35 bg-gradient-to-br from-[#382A1B] to-[#1B1A18] p-5 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:border-[#D6AD4F]/60"
              >
                {content}
              </Link>
            ) : (
              <article
                key={lesson}
                aria-disabled="true"
                className="rounded-2xl border border-white/[0.06] bg-[#191817]/80 p-5 opacity-65"
              >
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <p className="rounded-xl border border-white/[0.06] bg-[#1B1A18]/70 p-4 text-xs leading-6 text-[#A9A398]">
        Pelajaran 17–18 akan dibuka setelah materi, contoh komunikasi, latihan,
        dan evaluasinya selesai disiapkan.
      </p>
    </main>
  );
}
