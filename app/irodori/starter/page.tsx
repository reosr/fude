import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Lock } from "lucide-react";

const lessons = Array.from({ length: 18 }, (_, index) => index + 1);

export default function IrodoriStarterPage() {
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
              1 materi tersedia
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">
            Mulai dari ungkapan paling dasar untuk berkomunikasi dalam
            kehidupan sehari-hari. Pelajari setiap tujuan Can-do melalui
            contoh, dialog, dan latihan.
          </p>
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
            const isAvailable = lesson === 1;
            const content = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
                    LESSON {String(lesson).padStart(2, "0")}
                  </span>
                  {isAvailable ? (
                    <CheckCircle2 size={17} className="text-[#D9B66D]" />
                  ) : (
                    <Lock size={15} className="text-[#746F65]" />
                  )}
                </div>
                <h3 className="mt-5 text-base font-black text-[#EAE6DD]">
                  {isAvailable ? "Good morning!" : `Pelajaran ${lesson}`}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[#A3A099]">
                  {isAvailable
                    ? "Sapaan, berpamitan, ucapan terima kasih, dan permintaan maaf."
                    : "Materi sedang disiapkan."}
                </p>
                <div className="mt-5 flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${
                      isAvailable
                        ? "border-[#D6AD4F]/30 bg-[#D6AD4F]/10 text-[#E7D2A1]"
                        : "border-white/[0.07] bg-white/[0.03] text-[#817A73]"
                    }`}
                  >
                    {isAvailable ? "Bisa dipelajari" : "Segera hadir"}
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
                href="/irodori/starter/lesson-1"
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
        Pelajaran 2–18 akan dibuka setelah materi, contoh komunikasi, latihan,
        dan evaluasinya selesai disiapkan.
      </p>
    </main>
  );
}
