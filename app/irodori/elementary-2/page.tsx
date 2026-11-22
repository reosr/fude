"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Lock } from "lucide-react";
import { useIrodoriProgress } from "@/lib/irodori-progress";

const lessons = Array.from({ length: 18 }, (_, index) => index + 1);

export default function IrodoriElementaryTwoPage() {
  const progress = useIrodoriProgress();
  const completedCount = progress.completedLessons.filter((id) =>
    id.startsWith("elementary2-")
  ).length;
  const lessonOneCompleted = progress.completedLessons.includes("elementary2-01");
  const lessonTwoCompleted = progress.completedLessons.includes("elementary2-02");
  const lessonThreeCompleted = progress.completedLessons.includes("elementary2-03");
  const lessonFourCompleted = progress.completedLessons.includes("elementary2-04");
  const lessonFiveCompleted = progress.completedLessons.includes("elementary2-05");
  const lessonSixCompleted = progress.completedLessons.includes("elementary2-06");
  const lessonSevenCompleted = progress.completedLessons.includes("elementary2-07");
  const availableCount = lessonSevenCompleted ? 8 : lessonSixCompleted ? 7 : lessonFiveCompleted ? 6 : lessonFourCompleted ? 5 : lessonThreeCompleted ? 4 : lessonTwoCompleted ? 3 : lessonOneCompleted ? 2 : 1;

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-12">
      <Link
        href="/irodori"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#86A9D0]/40 hover:text-[#EAE6DD]"
      >
        <ArrowLeft size={15} />
        Semua level Irodori
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#486C91]/45 bg-gradient-to-br from-[#20364C] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#A9C9E8]/[0.07]">
          人
        </div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#A9C9E8]">
            IRODORI • ELEMENTARY 2
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">
                Elementary 2
              </h1>
              <p className="mt-1 text-sm font-semibold text-[#A9C9E8]">
                Tingkat A2 · 18 Pelajaran
              </p>
            </div>
            <span className="rounded-xl border border-[#86A9D0]/25 bg-[#486C91]/15 px-3 py-2 text-[10px] font-bold text-[#D8E8F8]">
              {availableCount} dari 18 materi tersedia
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Perluas kemampuan bahasa Jepang untuk berinteraksi dengan orang baru,
            menjelaskan pengalaman, memahami situasi sehari-hari, dan
            menyampaikan informasi dengan lebih terperinci.
          </p>
          <div className="mt-5 max-w-md rounded-xl border border-white/[0.07] bg-black/20 p-3">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-semibold text-[#A3A099]">Progres Irodori Elementary 2</span>
              <span className="font-bold text-[#D8E8F8]">{completedCount}/18 selesai</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#302D29]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#486C91] to-[#A9C9E8] transition-all"
                style={{ width: (completedCount / 18) * 100 + "%" }}
              />
            </div>
            <p className="mt-2 text-[9px] text-[#817A73]">
              Progres tersimpan terpisah dari Starter, Elementary 1, EXP, dan JLPT.
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div>
          <p className="text-[9px] font-black tracking-[0.22em] text-[#A9C9E8]">
            MATERI ELEMENTARY 2 A2
          </p>
          <h2 className="mt-1 text-xl font-black text-[#EAE6DD]">
            Daftar pelajaran
          </h2>
          <p className="mt-1 text-xs leading-6 text-[#A9A398]">
            Lesson 1–8 tersedia secara berurutan. Setiap lesson baru terbuka
            setelah lesson sebelumnya selesai.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => {
            const lessonId = "elementary2-" + String(lesson).padStart(2, "0");
            const isAvailable = lesson === 1
              || (lesson === 2 && lessonOneCompleted)
              || (lesson === 3 && lessonTwoCompleted)
              || (lesson === 4 && lessonThreeCompleted)
              || (lesson === 5 && lessonFourCompleted)
              || (lesson === 6 && lessonFiveCompleted)
              || (lesson === 7 && lessonSixCompleted)
              || (lesson === 8 && lessonSevenCompleted);
            const isCompleted = progress.completedLessons.includes(lessonId);
            const title = lesson === 1
              ? "I just came to Japan last week."
              : lesson === 2
                ? "He looks a serious person."
                : lesson === 3
                  ? "I cannot eat it because of an allergy."
                  : lesson === 4
                    ? "Please eat it without soy sauce."
                    : lesson === 5
                      ? "You should make a reservation early."
                      : lesson === 6
                        ? "I am glad that I went to a lot of different places."
                        : lesson === 7
                          ? "If it rains, it will be held at the hall."
                          : lesson === 8
                            ? "Do you know where the food stands are?"
                            : "Lesson " + String(lesson).padStart(2, "0");
            const description = lesson === 1
              ? "Memahami peran anggota, memperkenalkan diri lebih lengkap, menceritakan kota asal, dan menulis profil singkat."
              : lesson === 2
                ? "Mengenali ciri seseorang, mendeskripsikan sifat, membicarakan figur favorit, dan memahami artikel wawancara."
                : lesson === 3
                  ? "Menyampaikan alergi dan alasan, memesan tempat, memahami menu, dan membaca kupon restoran."
                  : lesson === 4
                    ? "Memahami rekomendasi hidangan, bertanya tentang cara makan, memperkenalkan makanan, dan membaca ulasan restoran."
                    : lesson === 5
                      ? "Memahami destinasi, menyusun rencana perjalanan, meminta dan memberi saran, serta membaca ulasan perjalanan."
                      : lesson === 6
                        ? "Membaca tiket dan pengumuman kereta, menjelaskan rencana, menceritakan kesan perjalanan, dan menulis unggahan singkat."
                        : lesson === 7
                          ? "Membaca pengumuman lingkungan, bertanya tentang acara, memahami siaran komunitas, dan menanyakan detail kegiatan."
                          : lesson === 8
                            ? "Membaca program festival, menanyakan waktu dan lokasi acara, memahami persyaratan kegiatan serta pengumuman, dan berbagi pengalaman."
                            : "Materi akan tersedia setelah lesson sebelumnya selesai.";

            const card = (
              <div className={"relative isolate h-full overflow-hidden rounded-2xl border p-4 shadow-lg shadow-black/10 transition-all " + (
                isAvailable
                  ? "border-[#86A9D0]/20 bg-gradient-to-br from-[#20364C]/50 to-[#191817] hover:-translate-y-0.5 hover:border-[#86A9D0]/50"
                  : "border-white/[0.07] bg-[#191817]/80 opacity-65"
              )}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[9px] font-black tracking-[0.2em] text-[#A9C9E8]">
                    LESSON {String(lesson).padStart(2, "0")}
                  </span>
                  {isAvailable ? (
                    <CheckCircle2 size={17} className={isCompleted ? "text-emerald-300" : "text-[#A9C9E8]"} />
                  ) : (
                    <Lock size={15} className="text-[#746F65]" />
                  )}
                </div>
                <h3 className="mt-5 text-base font-black text-[#EAE6DD]">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#A3A099]">{description}</p>
                <div className="mt-5 flex items-center justify-between gap-2">
                  <span className={"rounded-full border px-2.5 py-1 text-[9px] font-bold " + (
                    isAvailable
                      ? "border-[#86A9D0]/30 bg-[#486C91]/15 text-[#D8E8F8]"
                      : "border-white/[0.07] bg-white/[0.03] text-[#817A73]"
                  )}>
                    {isAvailable ? (isCompleted ? "Selesai" : "Bisa dipelajari") : "Terkunci"}
                  </span>
                  {isAvailable && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#A9C9E8]">
                      {isCompleted ? "Buka lagi" : "Mulai"} <BookOpen size={13} />
                    </span>
                  )}
                </div>
              </div>
            );

            return isAvailable ? (
              <Link key={lesson} href={lesson === 1 ? "/irodori/elementary-2/lesson-1" : lesson === 2 ? "/irodori/elementary-2/lesson-2" : lesson === 3 ? "/irodori/elementary-2/lesson-3" : lesson === 4 ? "/irodori/elementary-2/lesson-4" : lesson === 5 ? "/irodori/elementary-2/lesson-5" : lesson === 6 ? "/irodori/elementary-2/lesson-6" : lesson === 7 ? "/irodori/elementary-2/lesson-7" : "/irodori/elementary-2/lesson-8"} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9C9E8]">
                {card}
              </Link>
            ) : (
              <div key={lesson}>{card}</div>
            );
          })}
        </div>
      </section>

      <p className="rounded-2xl border border-[#486C91]/20 bg-[#202A35]/70 p-4 text-xs leading-6 text-[#A9A398]">
        <span className="font-bold text-[#A9C9E8]">Catatan:</span> Elementary 2
        adalah jalur A2 tersendiri setelah Elementary 1. Progres pelajaran di
        jalur ini tidak mengubah progres Minna no Nihongo atau JLPT.
      </p>
    </main>
  );
}
