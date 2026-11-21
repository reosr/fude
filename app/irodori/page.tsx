import Link from "next/link";
import { ArrowLeft, BookOpen, Compass, Headphones, MessageCircle, Sparkles } from "lucide-react";

const courses = [
  {
    id: "starter",
    number: "01",
    title: "Starter",
    level: "A1",
    description: "Mulai dari ungkapan sederhana, perkenalan, dan kebutuhan sehari-hari.",
    status: "Mulai belajar",
    statusTone: "border-[#D6AD4F]/35 bg-[#D6AD4F]/10 text-[#E5C77D]",
    accent: "from-[#9A6F20]/25",
  },
  {
    id: "elementary-1",
    number: "02",
    title: "Elementary 1",
    level: "A2",
    description: "Mengembangkan percakapan sederhana dalam situasi yang akrab.",
    status: "Tahap berikutnya",
    statusTone: "border-white/10 bg-white/[0.04] text-[#A3A099]",
    accent: "from-[#4F8A67]/20",
  },
  {
    id: "elementary-2",
    number: "03",
    title: "Elementary 2",
    level: "A2",
    description: "Memperluas kemampuan berkomunikasi dalam beragam aktivitas harian.",
    status: "Tahap berikutnya",
    statusTone: "border-white/10 bg-white/[0.04] text-[#A3A099]",
    accent: "from-[#4D7198]/20",
  },
  {
    id: "pre-intermediate",
    number: "04",
    title: "Pre-Intermediate",
    level: "A2/B1",
    description: "Berlatih menyampaikan informasi dan pengalaman dengan lebih mandiri.",
    status: "Tahap berikutnya",
    statusTone: "border-white/10 bg-white/[0.04] text-[#A3A099]",
    accent: "from-[#80619B]/20",
  },
];

export default function IrodoriPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] transition-colors hover:border-[#B8860B]/40 hover:text-[#EAE6DD]"
      >
        <ArrowLeft size={15} />
        Kembali ke Home
      </Link>

      <section className="relative isolate overflow-hidden rounded-[28px] border border-[#79602F]/45 bg-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-[#B8860B]/15" />
        <div className="pointer-events-none absolute -right-2 -top-10 h-44 w-44 rounded-full border border-[#C93438]/15" />
        <div className="pointer-events-none absolute right-8 top-2 select-none font-serif text-[150px] leading-none text-[#D6AD4F]/[0.06]">
          彩
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B8860B]/30 bg-[#B8860B]/10 px-3 py-1.5 text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
            <Sparkles size={12} />
            JAPAN FOUNDATION • IRODORI
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#A3A099]">
              JALUR BELAJAR TERPISAH
            </p>
            <h1 className="mt-2 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">
              Bahasa Jepang untuk kehidupan sehari-hari
            </h1>
          </div>

          <p className="max-w-xl text-sm leading-7 text-[#B6B0A5]">
            Belajar melalui situasi nyata dan tujuan komunikasi (Can-do).
            Pilih tahap sesuai kemampuanmu. Progres Irodori berdiri sendiri,
            terpisah dari Minna no Nihongo dan JLPT.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              <MessageCircle size={14} className="text-[#D6AD4F]" />
              Fokus komunikasi
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              <Headphones size={14} className="text-[#D6AD4F]" />
              Listening & dialog
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] font-semibold text-[#C9C3B8]">
              <Compass size={14} className="text-[#D6AD4F]" />
              CEFR: A1–B1
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[9px] font-black tracking-[0.24em] text-[#B8860B]">
              PILIH JALUR
            </p>
            <h2 className="mt-1 text-xl font-black text-[#EAE6DD]">
              Level Irodori
            </h2>
          </div>
          <span className="text-[10px] font-semibold text-[#817A73]">
            4 tahap • 18 pelajaran per tahap
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {courses.map((course) => {
            const card = (
              <div className={`relative isolate h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br ${course.accent} to-[#191817] p-5 shadow-lg shadow-black/10 transition-all ${course.id === "starter" ? "group-hover:-translate-y-0.5 group-hover:border-[#D6AD4F]/60" : "opacity-75"}`}>
                <div className="pointer-events-none absolute -right-5 -top-8 select-none font-mincho text-[112px] font-bold leading-none text-white/[0.035]">
                  {course.number}
                </div>

                <div className="relative z-10 flex min-h-[176px] flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
                      IRODORI • {course.number}
                    </span>
                    <span className="rounded-lg border border-[#D6AD4F]/25 bg-[#D6AD4F]/10 px-2.5 py-1 text-xs font-black text-[#E7D2A1]">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-black text-[#F1EBDD]">
                    {course.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#AAA49A]">
                    {course.description}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#A3A099]">
                      <BookOpen size={13} />
                      18 pelajaran
                    </span>
                    <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${course.statusTone}`}>
                      {course.status}
                    </span>
                  </div>
                </div>
              </div>
            );

            return course.id === "starter" ? (
              <Link
                key={course.id}
                href="/irodori/starter"
                aria-label="Buka Irodori Starter A1"
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AD4F]"
              >
                {card}
              </Link>
            ) : (
              <div key={course.id}>{card}</div>
            );
          })}
        </div>
      </section>

      <div className="rounded-2xl border border-[#B8860B]/20 bg-[#1B1917]/80 p-4 md:p-5">
        <p className="text-xs leading-6 text-[#A9A398]">
          <span className="font-bold text-[#D9B66D]">Catatan:</span> halaman ini
          adalah pemilih jalur. Starter A1 sudah memiliki sebelas pelajaran
          yang bisa dibuka. Pelajaran berikutnya dan level lainnya akan aktif
          setelah materi, dialog, dan latihan orisinalnya siap.
        </p>
      </div>
    </main>
  );
}
