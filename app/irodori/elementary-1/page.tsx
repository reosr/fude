"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Lock } from "lucide-react";
import { isIrodoriLessonUnlocked, useIrodoriProgress } from "@/lib/irodori-progress";

const lessons = Array.from({ length: 18 }, (_, index) => index + 1);

export default function IrodoriElementaryOnePage() {
  const progress = useIrodoriProgress();
  const completedCount = progress.completedLessons.filter((id) =>
    id.startsWith("elementary1-")
  ).length;
  const availableCount = lessons.filter((lesson) =>
    isIrodoriLessonUnlocked("elementary-1", lesson, progress.completedLessons)
  ).length;

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-12">
      <Link
        href="/irodori"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#8EAE93]/40 hover:text-[#EAE6DD]"
      >
        <ArrowLeft size={15} />
        Semua level Irodori
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#476C51]/45 bg-gradient-to-br from-[#203428] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#91B99A]/[0.07]">
          仕
        </div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#9CC5A3]">
            IRODORI • DASAR 1
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">Dasar 1</h1>
              <p className="mt-1 text-sm font-semibold text-[#A9CDB0]">
                Tingkat A2 · 18 Pelajaran
              </p>
            </div>
            <span className="rounded-xl border border-[#8EAE93]/25 bg-[#476C51]/15 px-3 py-2 text-[10px] font-bold text-[#CFE4D2]">
              {availableCount} dari 18 materi tersedia
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Kembangkan kemampuan komunikasi dari tingkat A1 ke A2. Pelajari
            cara bertukar kabar, menjelaskan kegiatan, dan menghadapi situasi
            sehari-hari melalui dialog serta latihan.
          </p>
          <div className="mt-5 max-w-md rounded-xl border border-white/[0.07] bg-black/20 p-3">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-semibold text-[#A3A099]">Progres Irodori Dasar 1</span>
              <span className="font-bold text-[#CFE4D2]">{completedCount}/18 selesai</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#302D29]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#426B4C] to-[#A9CDB0] transition-all"
                style={{ width: (completedCount / 18) * 100 + "%" }}
              />
            </div>
            <p className="mt-2 text-[9px] text-[#817A73]">
              
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.22em] text-[#8EAE93]">
            MATERI DASAR 1 A2
          </p>
          <h2 className="mt-1 text-xl font-black text-[#EAE6DD]">
            Daftar pelajaran
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => {
            const lessonId = `elementary1-${String(lesson).padStart(2, "0")}`;
            const isAvailable = isIrodoriLessonUnlocked("elementary-1", lesson, progress.completedLessons);
            const isCompleted = progress.completedLessons.includes(lessonId);
            const lessonTitle = lesson === 1
              ? "Saya bekerja di restoran."
              : lesson === 2
                ? "Saya suka bermain gim video."
                : lesson === 3
                  ? "Musim dingin sangat dingin."
                  : lesson === 4
                    ? "Kemarin hujan deras."
                    : lesson === 5
                      ? "Tempat ini sangat ramai dan nyaman."
                      : lesson === 6
                        ? "Tolong beri tahu jalan ke kantor pos."
                        : lesson === 7
                          ? "Saya akan sedikit terlambat karena tersesat."
                          : lesson === 8
                            ? "Pernah bermain bisbol?"
                            : lesson === 9
                              ? "Maukah kamu memberi tahu cara membaca ini?"
                              : lesson === 10
                                ? "Saya ingin mengikuti kelas bahasa Jepang."
                                : lesson === 11
                                  ? "Saya akan membawa daging dan sayuran."
                                  : lesson === 12
                                    ? "Bekal makan siangmu kelihatannya enak."
                                    : lesson === 13
                                      ? "Sepertinya akan selesai dalam sekitar sepuluh menit."
                                      : lesson === 14
                                        ? "Bolehkah saya izin tidak masuk sehari?"
                                        : lesson === 15
                                          ? "Saya demam dan tenggorokan saya sakit."
                                          : lesson === 16
                                          ? "Saya berusaha untuk tidak makan terlalu banyak."
                                          : lesson === 17
                                            ? "Ini jimat pribadi yang diberikan kakak laki-laki saya."
                                            : lesson === 18
                                              ? "Bagaimana kalau memberi sesuatu sebagai hadiah?"
                                              : "Pelajaran " + lesson;
            const lessonDescription = lesson === 1
              ? "Sapaan setelah lama tidak bertemu, kabar terkini, durasi tinggal, dan kegiatan sehari-hari."
              : lesson === 2
                ? "Hobi, hal yang disukai, kegiatan hari libur, rutinitas, dan kemampuan sederhana."
                : lesson === 3
                  ? "Empat musim di Jepang, iklim negara sendiri, cuaca, dan musim favorit."
                  : lesson === 4
                    ? "Menyapa sambil membicarakan cuaca, memahami prakiraan, dan membaca unggahan cuaca."
                    : lesson === 5
                      ? "Mendeskripsikan kota, bertanya tentang tempat rekomendasi, dan membaca peta sederhana."
                      : lesson === 6
                        ? "Meminta dan memberi petunjuk arah secara langsung, melalui telepon, dan saat diantar."
                        : lesson === 7
                          ? "Menentukan waktu dan tempat pertemuan, membaca pesan keterlambatan, dan memberi kabar jika terlambat."
                          : lesson === 8
                            ? "Menanyakan pengalaman, mengajak teman, menentukan kegiatan berikutnya, dan menyampaikan kesan setelah acara."
                            : lesson === 9
                              ? "Menceritakan pengalaman belajar, menjelaskan kesan, meminta bantuan dengan sopan, dan membaca saran belajar."
                              : lesson === 10
                                ? "Membaca jadwal kelas, menanyakan kelas yang diminati, membicarakan kelas bahasa Jepang, dan menjelaskan tujuan belajar."
                                : lesson === 11
                                  ? "Membagi barang untuk acara makan bersama, memilih makanan, dan membaca informasi bahan serta tanggal pada label."
                                  : lesson === 12
                                    ? "Mengomentari penampilan dan rasa makanan, bertanya tentang bahan masakan, dan memahami petunjuk pada kemasan."
                                    : lesson === 13
                                      ? "Melaporkan kendala, memperkirakan waktu pekerjaan, memahami instruksi penggunaan mesin, menyiapkan rapat, dan membaca email."
                                      : lesson === 14
                                        ? "Menelepon saat terlambat atau tidak masuk, meminta izin, mengajukan cuti, dan memahami formulir permohonan cuti."
                                        : lesson === 15
                                          ? "Menjelaskan gejala, menyebutkan sejak kapan gejala muncul, memahami arahan di klinik, dan mengisi formulir pertanyaan."
                                          : lesson === 16
                                            ? "Memberi saran sederhana, membicarakan kebiasaan sehat, memahami berita singkat, dan membaca poster pencegahan penyakit."
                                            : lesson === 17
                                              ? "Bertamu, memberikan oleh-oleh, menjelaskan asal-usul barang pribadi, dan menulis email terima kasih."
                                              : lesson === 18
                                              ? "Memberi selamat, memilih hadiah, mengucapkan terima kasih, membaca unggahan ulang tahun, dan menulis pesan pada kartu."
                                              : "Materi orisinal sedang disiapkan."; 

            const content = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[9px] font-black tracking-[0.2em] text-[#8EAE93]">
                    PELAJARAN {String(lesson).padStart(2, "0")}
                  </span>
                  {isAvailable ? (
                    <CheckCircle2 size={17} className={isCompleted ? "text-emerald-300" : "text-[#A9CDB0]"} />
                  ) : (
                    <Lock size={15} className="text-[#746F65]" />
                  )}
                </div>
                <h3 className="mt-5 text-base font-black text-[#EAE6DD]">
                  {lessonTitle}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[#A3A099]">
                  {lessonDescription}
                </p>
                <div className="mt-5 flex items-center justify-between gap-2">
                  <span className={"rounded-full border px-2.5 py-1 text-[9px] font-bold " + (
                    isAvailable
                      ? "border-[#8EAE93]/30 bg-[#476C51]/15 text-[#CFE4D2]"
                      : "border-white/[0.07] bg-white/[0.03] text-[#817A73]"
                  )}>
                    {isAvailable ? (isCompleted ? "Selesai" : "Bisa dipelajari") : "Segera hadir"}
                  </span>
                  {isAvailable && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#A9CDB0]">
                      Mulai <BookOpen size={13} />
                    </span>
                  )}
                </div>
              </>
            );

            return isAvailable ? (
              <Link
                key={lesson}
                href={
                  lesson === 1
                    ? "/irodori/elementary-1/lesson-1"
                    : lesson === 2
                      ? "/irodori/elementary-1/lesson-2"
                      : lesson === 3
                      ? "/irodori/elementary-1/lesson-3"
                      : lesson === 4
                        ? "/irodori/elementary-1/lesson-4"
                        : lesson === 5
                          ? "/irodori/elementary-1/lesson-5"
                          : lesson === 6
                            ? "/irodori/elementary-1/lesson-6"
                            : lesson === 7
                              ? "/irodori/elementary-1/lesson-7"
                              : lesson === 8
                                ? "/irodori/elementary-1/lesson-8"
                                : lesson === 9
                                  ? "/irodori/elementary-1/lesson-9"
                                  : lesson === 10
                                    ? "/irodori/elementary-1/lesson-10"
                                    : lesson === 11
                                      ? "/irodori/elementary-1/lesson-11"
                                      : lesson === 12
                                        ? "/irodori/elementary-1/lesson-12"
                                        : lesson === 13
                                        ? "/irodori/elementary-1/lesson-13"
                                        : lesson === 14
                                          ? "/irodori/elementary-1/lesson-14"
                                          : lesson === 15
                                            ? "/irodori/elementary-1/lesson-15"
                                            : lesson === 16
                                              ? "/irodori/elementary-1/lesson-16"
                                              : lesson === 17
                                              ? "/irodori/elementary-1/lesson-17"
                                              : "/irodori/elementary-1/lesson-18"
                }
                className="group rounded-2xl border border-[#6E9A75]/35 bg-gradient-to-br from-[#263D2D] to-[#1B1A18] p-5 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:border-[#A9CDB0]/60"
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
        Pelajaran berikutnya terbuka setelah pelajaran sebelumnya selesai.
        Selesaikan materi, simulasi, praktik, kuis, dan penilaian target komunikasi untuk
        melanjutkan perjalanan belajar.
      </p>
    </main>
  );
}
