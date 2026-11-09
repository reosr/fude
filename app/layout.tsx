import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import DisableRightClick from "@/components/DisableRightClick";
import { Shippori_Mincho } from "next/font/google"; // <-- Tambahin ini

// Setup font-nya
const shipporiMincho = Shippori_Mincho({
  weight: ['400', '500', '700'],
  subsets: ["latin"], // 'latin' biasanya udah mencakup kanji/kana dasar
  variable: "--font-mincho", // Nama variabel CSS
});


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
        
        <DisableRightClick />

        {/* EFEK ORBS DI BACKGROUND */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#C93438] rounded-full blur-[120px] opacity-30 animate-orb-1"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E3A59] rounded-full blur-[100px] opacity-40 animate-orb-2"></div>
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-[#B8860B] rounded-full blur-[110px] opacity-20 animate-orb-3"></div>
        </div>

        {/* KONTEN UTAMA */}
        <div className="relative z-10 md:flex md:min-h-screen">
          
          {/* BUNGKUS SIDEBAR DENGAN SUSPENSE */}
          <Suspense fallback={<div className="hidden md:block w-64 bg-[#1A1918]" />}>
            <Sidebar />
          </Suspense>

          <main className="flex-1 pb-20 md:pb-0 md:pl-64">
            <div className="max-w-6xl mx-auto px-4 pt-28 pb-4 md:p-8">{children}</div>
          </main>

          {/* BUNGKUS BOTTOMNAV DENGAN SUSPENSE */}
          <Suspense fallback={<div className="md:hidden h-16 bg-[#1A1918]" />}>
            <BottomNav />
          </Suspense>
          
        </div>
      </body>
    </html>
  );
}