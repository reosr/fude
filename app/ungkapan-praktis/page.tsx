"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
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
    title: "Salam dan Perkenalan",
    description: "Menyapa, memperkenalkan diri dan orang lain, serta membuka percakapan.",
    icon: Users,
    href: "/ungkapan-praktis/salam-perkenalan",
    available: true,
    lessons: "Materi pertama tersedia",
  },
  {
    number: "02",
    title: "Belanja dan Minimarket",
    description: "Bertanya barang, ukuran, harga, pembayaran, dan bantuan pegawai.",
    icon: ShoppingBag,
    href: "/ungkapan-praktis/belanja-minimarket",
    available: true,
    lessons: "Materi kedua tersedia",
  },
  {
    number: "03",
    title: "Restoran dan Makanan",
    description: "Memesan makanan, reservasi, meminta rekomendasi, dan membayar.",
    icon: Utensils,
    href: "",
    available: false,
    lessons: "Dalam persiapan",
  },
  {
    number: "04",
    title: "Transportasi dan Perjalanan",
    description: "Tiket, stasiun, naik kendaraan, transit, dan perubahan perjalanan.",
    icon: TrainFront,
    href: "",
    available: false,
    lessons: "Dalam persiapan",
  },
  {
    number: "05",
    title: "Tempat Tinggal dan Kehidupan Sehari-hari",
    description: "Apartemen, fasilitas, tetangga, sampah, dan layanan lingkungan.",
    icon: House,
    href: "",
    available: false,
    lessons: "Materi Baca terkait sudah ada",
  },
  {
    number: "06",
    title: "Kesehatan dan Keadaan Darurat",
    description: "Menjelaskan keluhan, membuat janji, dan meminta pertolongan.",
    icon: HeartPulse,
    href: "",
    available: false,
    lessons: "Materi Baca terkait sudah ada",
  },
  {
    number: "07",
    title: "Sekolah dan Pendidikan",
    description: "Berbicara dengan guru, meminta izin, dan berdiskusi dengan teman.",
    icon: GraduationCap,
    href: "",
    available: false,
    lessons: "Materi Baca terkait sudah ada",
  },
  {
    number: "08",
    title: "Pekerjaan dan Lingkungan Kantor",
    description: "Wawancara, komunikasi dengan rekan, instruksi, dan laporan.",
    icon: BriefcaseBusiness,
    href: "",
    available: false,
    lessons: "Materi Baca terkait sudah ada",
  },
  {
    number: "09",
    title: "Hotel dan Akomodasi",
    description: "Check-in, check-out, fasilitas, dan menyampaikan permintaan.",
    icon: Hotel,
    href: "",
    available: false,
    lessons: "Dalam persiapan",
  },
  {
    number: "10",
    title: "Komunikasi dan Hubungan Sosial",
    description: "Telepon, pesan, ajakan, penolakan sopan, dan menyampaikan pendapat.",
    icon: MessageCircle,
    href: "",
    available: false,
    lessons: "Dalam persiapan",
  },
];

export default function UngkapanPraktisPage() {
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
            <p className="mt-1 text-xs text-[#A3A099]">10 kategori direncanakan · 2 kategori mulai tersedia</p>
          </div>
          <span className="rounded-full border border-[#269B70]/30 bg-[#269B70]/10 px-3 py-1 text-xs font-bold text-[#66C49C]">
            2 / 10
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#121110]">
          <div className="h-full w-[20%] rounded-full bg-gradient-to-r from-[#B8860B] to-[#269B70]" />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[#817A73]">
          Materi ini melengkapi halaman Baca. Cerita dan latihan membaca yang sudah ada tetap berada di sana.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((category) => {
          const Icon = category.icon;
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
                <span className={"text-[10px] font-semibold " + (category.available ? "text-[#66C49C]" : "text-[#817A73]")}>
                  {category.lessons}
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
