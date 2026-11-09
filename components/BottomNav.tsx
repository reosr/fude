"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { BookOpen, Languages, Layers, Home, Dices } from "lucide-react";
import { GACHA_UPDATED_EVENT, getGachaInventory } from "../lib/gacha";

const tabs = [
  { href: "/belajar", label: "Belajar", icon: BookOpen },
  { href: "/kosakata", label: "Kosakata", icon: Languages },
  { href: "/", label: "Home", icon: Home, isCenter: true }, // Tombol Tengah
  { href: "/flashcard", label: "Flashcard", icon: Layers },
  { href: "/gacha", label: "Gacha", icon: Dices },
];

// Pola gelombang seigaiha (motif tradisional Jepang), dibuat sangat tipis
// dan memudar ke bawah supaya tidak mengganggu ikon.
// Mau dihilangkan? Hapus <span> yang memakai SEIGAIHA_STYLE di bawah.
const SEI = "rgba(184,134,11,0.09)";
const SEIGAIHA_STYLE: CSSProperties = {
  backgroundImage: [
    `radial-gradient(circle at 100% 150%, transparent 24%, ${SEI} 24%, ${SEI} 28%, transparent 28%, transparent 36%, ${SEI} 36%, ${SEI} 40%, transparent 40%)`,
    `radial-gradient(circle at 0 150%, transparent 24%, ${SEI} 24%, ${SEI} 28%, transparent 28%, transparent 36%, ${SEI} 36%, ${SEI} 40%, transparent 40%)`,
    `radial-gradient(circle at 50% 100%, transparent 10%, ${SEI} 10%, ${SEI} 14%, transparent 14%, transparent 23%, ${SEI} 23%, ${SEI} 27%, transparent 27%, transparent 36%, ${SEI} 36%, ${SEI} 40%, transparent 40%, transparent 49%, ${SEI} 49%, ${SEI} 53%, transparent 53%)`,
  ].join(","),
  backgroundSize: "28px 14px",
  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 85%)",
  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 85%)",
};

export default function BottomNav() {
  const path = usePathname();
  const [newGachaCount, setNewGachaCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setNewGachaCount(getGachaInventory().newBadgeIds.length);
    };

    const initialRefresh = window.requestAnimationFrame(refresh);
    window.addEventListener(GACHA_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.cancelAnimationFrame(initialRefresh);
      window.removeEventListener(GACHA_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    // pointer-events-none: area kosong di sekitar bar tidak menghalangi sentuhan ke halaman di belakangnya
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none">
      <div className="pointer-events-auto relative flex h-14 items-center justify-around rounded-full border border-white/[0.07] bg-[#161514]/80 backdrop-blur-xl shadow-[0_14px_36px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)]">
        {/* Motif gelombang seigaiha */}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={SEIGAIHA_STYLE} />
        {/* Garis emas tipis di tepi atas (kesan kintsugi) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#B8860B]/60 to-transparent"
        />

        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = path === t.href;

          if (t.isCenter) {
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-label={t.label}
                aria-current={isActive ? "page" : undefined}
                className={`absolute left-1/2 -top-4 -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-[#121110] text-white ring-1 ring-white/10 shadow-[0_10px_24px_-6px_rgba(201,52,56,0.7)] transition-transform active:scale-95 ${
                  isActive
                    ? "bg-gradient-to-br from-[#D4A017] to-[#9A6F08]"
                    : "bg-gradient-to-br from-[#E0443F] to-[#B02A2E]"
                }`}
              >
                <Icon size={24} strokeWidth={2.25} />
              </Link>
            );
          }

          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex h-full w-14 flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? "text-[#E0443F]" : "text-[#8F8B84] hover:text-[#EAE6DD]"
              }`}
            >
              {/* Titik merah penanda tab aktif (mengingatkan pada Hinomaru) */}
              {isActive && (
                <span
                  aria-hidden
                  className="absolute top-1.5 h-1 w-1 rounded-full bg-[#C93438] shadow-[0_0_8px_2px_rgba(201,52,56,0.6)]"
                />
              )}
              <span className="relative mt-1">
                <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
                {t.href === "/gacha" && newGachaCount > 0 && (
                  <span className="absolute -right-3 -top-2 rounded-full bg-[#C93438] px-1.5 py-0.5 text-[7px] font-black leading-none text-white">
                    NEW
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium leading-none">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}