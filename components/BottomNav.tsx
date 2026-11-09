"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Languages, Layers, Home, User, Dices } from "lucide-react";
import { GACHA_UPDATED_EVENT, getGachaInventory } from "../lib/gacha";

const tabs = [
  { href: "/belajar", label: "Belajar", icon: BookOpen },
  { href: "/kosakata", label: "Kosakata", icon: Languages },
  { href: "/", label: "Home", icon: Home, isCenter: true }, // Tombol Tengah
  { href: "/flashcard", label: "Flashcard", icon: Layers },
  { href: "/gacha", label: "Gacha", icon: Dices },
  { href: "/profil", label: "Profil", icon: User },
];

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
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 px-4 pb-4">
      <div className="bg-[#1A1918]/95 backdrop-blur-xl border border-[#33312E] rounded-3xl flex justify-around items-center h-16 relative shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = path === t.href;
          
          if (t.isCenter) {
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`absolute left-1/2 -translate-x-1/2 -top-6 flex items-center justify-center w-16 h-16 rounded-full border-4 border-[#121110] shadow-lg transition-transform active:scale-95 ${
                  isActive ? "bg-[#B8860B] text-white" : "bg-[#C93438] text-white"
                }`}
              >
                <Icon size={28} strokeWidth={2.5} />
              </Link>
            );
          }

          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-col items-center justify-center w-12 h-full pt-1 transition-colors ${
                isActive ? "text-[#C93438]" : "text-[#A3A099] hover:text-[#EAE6DD]"
              }`}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {t.href === "/gacha" && newGachaCount > 0 && (
                  <span className="absolute -right-3 -top-2 rounded-full bg-[#C93438] px-1.5 py-0.5 text-[7px] font-black leading-none text-white">
                    NEW
                  </span>
                )}
              </span>
              <span className="text-[10px] mt-1 font-medium">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}