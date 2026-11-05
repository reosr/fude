import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fude — Belajar Bahasa Jepang",
  description: "Belajar bahasa Jepang dari nol sampai N1, gratis.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121110",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-[#121110] text-[#EAE6DD] overflow-x-hidden antialiased`}>
        
        {/* EFEK ORBS DI BACKGROUND */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Orb Merah (Vermilion) */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#C93438] rounded-full blur-[120px] opacity-30 animate-orb-1"></div>
          
          {/* Orb Biru (Indigo) */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E3A59] rounded-full blur-[100px] opacity-40 animate-orb-2"></div>
          
          {/* Orb Emas (Gold) */}
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-[#B8860B] rounded-full blur-[110px] opacity-20 animate-orb-3"></div>
        </div>

        {/* KONTEN UTAMA (Z-index 10 biar di atas orbs) */}
        <div className="relative z-10 md:flex md:min-h-screen">
          <Sidebar />
          <main className="flex-1 pb-20 md:pb-0 md:pl-64">
            {/* Ubah max-w-3xl menjadi max-w-6xl */}
            <div className="max-w-6xl mx-auto p-4 md:p-8">{children}</div>
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}