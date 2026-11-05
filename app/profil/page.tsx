"use client";
import { User, Settings, LogOut } from "lucide-react";

export default function Profil() {
  return (
    <div className="space-y-6 pb-10 max-w-2xl mx-auto">
      <div className="flex flex-col items-center justify-center pt-8 pb-4">
        <div className="w-24 h-24 bg-[#262523] border-2 border-[#C93438] rounded-full flex items-center justify-center mb-4">
          <User size={40} className="text-[#EAE6DD]" />
        </div>
        <h2 className="text-2xl font-bold text-[#EAE6DD]">Pengguna Baru</h2>
        <p className="text-[#A3A099] text-sm">Bergabung sejak hari ini</p>
      </div>

      <div className="bg-[#1E1D1B] border border-[#33312E] rounded-xl overflow-hidden">
        <button className="w-full flex items-center gap-4 p-4 hover:bg-[#262523] border-b border-[#33312E] transition-colors text-left text-[#EAE6DD]">
          <Settings size={20} className="text-[#A3A099]" />
          <span className="font-bold text-sm">Pengaturan Akun</span>
        </button>
        <button className="w-full flex items-center gap-4 p-4 hover:bg-[#262523] transition-colors text-left text-red-500">
          <LogOut size={20} />
          <span className="font-bold text-sm">Keluar / Login</span>
        </button>
      </div>
      <p className="text-center text-xs text-[#A3A099]">Fitur Login & Sinkronisasi Progress akan segera hadir.</p>
    </div>
  );
}