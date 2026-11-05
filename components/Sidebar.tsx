"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Languages, Layers, ArrowLeftRight, BookText, User, RefreshCw, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { getProgress } from "../lib/progress";
import LevelBadge from "./LevelBadge";


const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/belajar", label: "Belajar", icon: BookOpen },
  { href: "/kosakata", label: "Kosakata", icon: Languages },
  { href: "/flashcard", label: "Flashcard", icon: Layers },
];

export default function Sidebar() {
  const path = usePathname();
  const [currentBab, setCurrentBab] = useState(1);

  useEffect(() => {
    setCurrentBab(getProgress());
  }, []);

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:border-r md:border-[#33312E]/50 md:bg-[#1A1918]/80 md:backdrop-blur-xl z-40">
      <div className="p-6 border-b border-[#33312E]/50 flex items-center gap-3">
        <img src="/logo.webp" alt="Fude Logo" className="w-8 h-8 object-contain" />
        <div>
          <h1 className="text-xl font-bold text-[#EAE6DD]">Fude</h1>
          <p className="text-[10px] text-[#A3A099] mt-0.5 tracking-wider uppercase font-semibold">Nol sampai N1</p>
        </div>
      </div>
      
      <nav className="flex-1 p-3">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = path === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                isActive
                  ? "bg-[#C93438] text-white shadow-lg shadow-[#C93438]/20"
                  : "hover:bg-[#262523] text-[#A3A099] hover:text-[#EAE6DD]"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm font-medium">{t.label}</span>
            </Link>
          );
        })}
      </nav>

            <div className="p-4 border-t border-[#33312E]/50">
        <Link 
          href="/profil"
          className="block bg-[#262523] hover:bg-[#33312E] transition-all rounded-xl p-3 flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-[#33312E] group-hover:bg-[#C93438]/20 rounded-full flex items-center justify-center shrink-0 transition-colors">
            <User size={20} className="text-[#A3A099] group-hover:text-[#C93438] transition-colors" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-[#EAE6DD] truncate group-hover:text-white transition-colors">
              Pengguna Baru
            </p>
            <div className="mt-1">
              <LevelBadge currentBab={currentBab} />
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}