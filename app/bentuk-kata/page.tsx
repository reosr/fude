"use client";

import { useState } from "react";
import conjugations from "../../data/conjugations.json";
import { Search, ChevronRight } from "lucide-react";

export default function BentukKata() {
  const [search, setSearch] = useState("");

  const filtered = conjugations.filter(
    (v) =>
      v.kanji.includes(search) ||
      v.kana.includes(search) ||
      v.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold text-[#EAE6DD]">Bentuk Kata Kerja</h2>
        <p className="text-[#A3A099] text-sm mt-1">
          Kamus lengkap perubahan kata kerja (Konjugasi).
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-[#A3A099]" />
        </div>
        <input
          type="text"
          placeholder="Cari kata kerja (Kanji/Kana/Arti)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1E1D1B]/80 border border-[#33312E] text-[#EAE6DD] rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#C93438] focus:ring-1 focus:ring-[#C93438] transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((v, i) => (
          <div key={i} className="bg-[#1E1D1B]/80 backdrop-blur-md border border-[#33312E] rounded-xl p-5 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-2xl text-[#EAE6DD] font-mincho">{v.kanji}</h3>
                <p className="text-sm text-[#A3A099]">{v.kana}</p>
              </div>
              <span className="text-sm font-medium text-[#C93438] bg-[#C93438]/10 px-2 py-1 rounded-md">
                {v.meaning}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-[#33312E]/50 pb-1">
                <span className="text-[#A3A099]">Kamus (Dictionary)</span>
                <span className="text-[#EAE6DD] font-semibold font-mincho">{v.dict}</span>
              </div>
              <div className="flex justify-between border-b border-[#333312E]/50 pb-1">
                <span className="text-[#A3A099]">Sopan (〜ます)</span>
                <span className="text-[#EAE6DD] font-semibold font-mincho">{v.masu}</span>
              </div>
              <div className="flex justify-between border-b border-[#333312E]/50 pb-1">
                <span className="text-[#A3A099]">Bentuk 〜て</span>
                <span className="text-[#EAE6DD] font-semibold font-mincho">{v.te}</span>
              </div>
              <div className="flex justify-between border-b border-[#333312E]/50 pb-1">
                <span className="text-[#A3A099]">Lampau (〜た)</span>
                <span className="text-[#EAE6DD] font-semibold font-mincho">{v.ta}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-[#A3A099]">Negatif (〜ない)</span>
                <span className="text-[#EAE6DD] font-semibold font-mincho">{v.nai}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-10 text-[#A3A099]">
            Tidak ada kata kerja yang cocok.
          </div>
        )}
      </div>
    </div>
  );
}