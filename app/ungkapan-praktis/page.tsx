"use client";

import Link from "next/link";
import { useStudyProgress } from "@/lib/study-progress";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  BriefcaseBusiness,
  HeartPulse,
  House,
  Hotel,
  MessageCircle,
  ShoppingBag,
  TrainFront,
  Users,
  Utensils,
  GraduationCap,
} from "lucide-react";

const categories = [
  {
    number: "01",
    id: "salam-perkenalan",
    title: "Salam dan Perkenalan",
    description: "Menyapa, memperkenalkan diri dan orang lain, serta membuka percakapan.",
    icon: Users,
    href: "/ungkapan-praktis/salam-perkenalan",
    available: true,
    lessons: "Materi pertama tersedia",
  },
  {
    number: "02",
    id: "belanja-minimarket",
    title: "Belanja dan Minimarket",
    description: "Bertanya barang, ukuran, harga, pembayaran, dan bantuan pegawai.",
    icon: ShoppingBag,
    href: "/ungkapan-praktis/belanja-minimarket",
    available: true,
    lessons: "Materi kedua tersedia",
  },
  {
    number: "03",
    id: "restoran-makanan",
    title: "Restoran dan Makanan",
    description: "Reservasi, memilih menu, memesan hidangan, dan membayar.",
    icon: Utensils,
    href: "/ungkapan-praktis/restoran-makanan",
    available: true,
    lessons: "Materi ketiga tersedia",
  },
  {
    number: "04",
    id: "transportasi-perjalanan",
    title: "Transportasi dan Perjalanan",
    description: "Tiket, peron, pindah kereta, bus, jadwal, dan kendala perjalanan.",
    icon: TrainFront,
    href: "/ungkapan-praktis/transportasi-perjalanan",
    available: true,
    lessons: "Materi keempat tersedia",
  },
  {
    number: "05",
    id: "tempat-tinggal-sehari-hari",
    title: "Tempat Tinggal dan Kehidupan Sehari-hari",
    description: "Masalah rumah, tetangga, aturan sampah, paket, dan fasilitas gedung.",
    icon: House,
    href: "/ungkapan-praktis/tempat-tinggal-sehari-hari",
    available: true,
    lessons: "Materi kelima tersedia",
  },
  {
    number: "06",
    id: "kesehatan-keadaan-darurat",
    title: "Kesehatan dan Keadaan Darurat",
    description: "Mendaftar di klinik, menjelaskan gejala, bertanya tentang obat, dan meminta bantuan darurat.",
    icon: HeartPulse,
    href: "/ungkapan-praktis/kesehatan-keadaan-darurat",
    available: true,
    lessons: "Materi keenam tersedia",
  },
  {
    number: "07",
    id: "sekolah-pendidikan",
    title: "Sekolah dan Pendidikan",
    description: "Bertanya kepada guru, meminta izin, mengurus tugas, dan kerja kelompok.",
    icon: GraduationCap,
    href: "/ungkapan-praktis/sekolah-pendidikan",
    available: true,
    lessons: "Materi ketujuh tersedia",
  },
  {
    number: "08",
    id: "pekerjaan-kantor",
    title: "Pekerjaan dan Lingkungan Kantor",
    description: "Komunikasi dengan atasan, instruksi kerja, laporan, rapat, dan izin.",
    icon: BriefcaseBusiness,
    href: "/ungkapan-praktis/pekerjaan-kantor",
    available: true,
    lessons: "Materi kedelapan tersedia",
  },
  {
    number: "09",
    id: "hotel-akomodasi",
    title: "Hotel dan Akomodasi",
    description: "Reservasi, check-in, fasilitas kamar, bantuan, dan check-out.",
    icon: Hotel,
    href: "/ungkapan-praktis/hotel-akomodasi",
    available: true,
    lessons: "Materi kesembilan tersedia",
  },
  {
    number: "10",
    id: "komunikasi-hubungan-sosial",
    title: "Komunikasi dan Hubungan Sosial",
    description: "Telepon, pesan, ajakan, penolakan sopan, dan menyampaikan pendapat.",
    icon: MessageCircle,
    href: "/ungkapan-praktis/komunikasi-hubungan-sosial",
    available: true,
    lessons: "Materi kesepuluh tersedia",
  },
];

export default function UngkapanPraktisPage() {
  const progress = useStudyProgress();
  const completedCount = categories.filter((category) =>
    progress.completedPracticalCategories.includes(category.id)
  ).length;
  const completionPercent = Math.round((completedCount / categories.length) * 100);

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-10">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#B8860B]/30 bg-[#B8860B]/10 text-[#D9B66D]">
          <MessageCircle size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">
            KOMUNIKASI SEHARI-HARI
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#EAE6DD] sm:text-3xl">
            Ungkapan &amp; Percakapan Praktis
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A3A099]">
            Pelajari cara berbicara dalam situasi nyata di Jepang, memahami variasi kesopanan,
            dan memilih respons yang sesuai dengan lawan bicara.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#33312E] bg-[#1E1D1B]/80 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#EAE6DD]">Jalur komunikasi praktis</p>
            <p className="mt-1 text-xs text-[#A3A099]">10 kategori tersedia · progres penyelesaianmu</p>
          </div>
          <span className="rounded-full border border-[#33312E] bg-[#121110]/60 px-3 py-1 text-xs font-bold text-[#D9B66D]">
            {completedCount} / 10 selesai
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#121110]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#B8860B] to-[#269B70] transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[#817A73]">
          Materi ini melengkapi halaman Baca. Cerita dan latihan membaca yang sudah ada tetap berada di sana.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/kosakata" className="rounded-xl border border-[#33312E] bg-[#1E1D1B]/70 p-3 transition-colors hover:border-[#B8860B]/50">
          <p className="text-xs font-bold text-[#EAE6DD]">Kosakata gabungan</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#A3A099]">Temukan kata dari Minna, Irodori, dan Ungkapan Praktis.</p>
        </Link>
        <Link href="/flashcard" className="rounded-xl border border-[#33312E] bg-[#1E1D1B]/70 p-3 transition-colors hover:border-[#B8860B]/50">
          <p className="text-xs font-bold text-[#EAE6DD]">Flashcard</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#A3A099]">Latih ingatan kosakata dari seluruh sumber belajar.</p>
        </Link>
        <Link href="/baca" className="rounded-xl border border-[#33312E] bg-[#1E1D1B]/70 p-3 transition-colors hover:border-[#B8860B]/50">
          <p className="text-xs font-bold text-[#EAE6DD]">Latihan Baca</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#A3A099]">Baca cerita dan lanjutkan ke ungkapan yang relevan.</p>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isCompleted = progress.completedPracticalCategories.includes(category.id);
          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className={"flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border " + (category.available ? "border-[#B8860B]/35 bg-[#B8860B]/10 text-[#D9B66D]" : "border-[#33312E] bg-[#262523] text-[#817A73]")}>
                  <Icon size={21} />
                </div>
                <span className="text-[11px] font-bold tracking-wider text-[#817A73]">
                  {category.number}
                </span>
              </div>
              <div className="mt-4">
                <h2 className={"text-base font-bold " + (category.available ? "text-[#EAE6DD] group-hover:text-[#D9B66D]" : "text-[#C5C0B7]")}>
                  {category.title}
                </h2>
                <p className="mt-1.5 min-h-[42px] text-xs leading-relaxed text-[#A3A099]">
                  {category.description}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#33312E]/80 pt-3">
                <span className={"inline-flex items-center gap-1 text-[10px] font-semibold " + (isCompleted ? "text-[#66C49C]" : category.available ? "text-[#A3A099]" : "text-[#817A73]")}>
                  {isCompleted ? <><CheckCircle2 size={12} /> Selesai dipelajari</> : category.lessons}
                </span>
                {category.available ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#D9B66D]">
                    Buka <ArrowRight size={14} />
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-[#817A73]">Segera hadir</span>
                )}
              </div>
            </>
          );

          return category.available ? (
            <Link
              key={category.number}
              href={category.href}
              className="group rounded-2xl border border-[#B8860B]/35 bg-[#1E1D1B]/90 p-4 transition-all hover:-translate-y-0.5 hover:border-[#B8860B]/70 hover:bg-[#24211B] sm:p-5"
            >
              {content}
            </Link>
          ) : (
            <div
              key={category.number}
              aria-disabled="true"
              className="rounded-2xl border border-[#33312E] bg-[#1A1918]/70 p-4 opacity-80 sm:p-5"
            >
              {content}
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-[#33312E] bg-[#1A1918]/80 p-4">
        <BookOpen className="mt-0.5 shrink-0 text-[#B8860B]" size={18} />
        <p className="text-xs leading-relaxed text-[#A3A099]">
          <span className="font-semibold text-[#EAE6DD]">Catatan:</span> materi baru berfokus pada pilihan ungkapan,
          cara merespons, dan etika komunikasi. Untuk membaca cerita lengkap dengan audio, furigana, dan romaji,
          tetap gunakan menu Latihan Baca.
        </p>
      </div>
    </div>
  );
}
