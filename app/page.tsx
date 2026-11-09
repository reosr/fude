import HomeOverview from "../components/HomeOverview";
import Link from "next/link";
import { ArrowRightLeft, BookText, ChevronRight, Award, Flame, Trophy, BookA } from "lucide-react"; // BookA ditambahin
import babIndex from "../data/bab-index.json";

const JLPT_IMAGES: Record<string, string> = {
  N5: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=600&auto=format&fit=crop",
  N4: "https://images.unsplash.com/photo-1533050487297-09b450131914?q=80&w=600&auto=format&fit=crop",
  N3: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=600&auto=format&fit=crop",
  N2: "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=600&auto=format&fit=crop",
  N1: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop",
};

export default function Dashboard() {
  const babTitles = babIndex.map((b: any) => ({
  bab: b.bab,
  title: b.title,
}));

  return (
    <div className="space-y-8 pb-10">
      <HomeOverview babTitles={babTitles} />

      {/* MENU CEPAT */}
      <div>
        <h3 className="font-bold text-lg text-[#EAE6DD] mb-4">Menu Cepat</h3>
        {/* Grid diubah jadi 5 kolom di desktop (md:grid-cols-5) biar 5 menu muat */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          <Link href="/belajar" className="relative bg-[#1E1D1B] border border-[#33312E] hover:border-[#C93438] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center transition-all group h-40">
            <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=75&w=400&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/60 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 bg-[#33312E]/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-[#C93438] transition-colors shadow-lg">
                <Award className="text-[#EAE6DD]" size={24} />
              </div>
              <span className="text-sm font-bold text-[#EAE6DD] drop-shadow-md">Materi & Kuis</span>
            </div>
          </Link>

          <Link href="/terjemahan" className="relative bg-[#1E1D1B] border border-[#33312E] hover:border-[#B8860B] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center transition-all group h-40">
            <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=75&w=400&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/60 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 bg-[#33312E]/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-[#B8860B] transition-colors shadow-lg">
                <ArrowRightLeft className="text-[#EAE6DD]" size={24} />
              </div>
              <span className="text-sm font-bold text-[#EAE6DD] drop-shadow-md">Terjemahan</span>
            </div>
          </Link>

          <Link href="/baca" className="relative bg-[#1E1D1B] border border-[#33312E] hover:border-blue-500 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center transition-all group h-40">
            <img src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=75&w=400&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/60 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 bg-[#33312E]/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-500 transition-colors shadow-lg">
                <BookText className="text-[#EAE6DD]" size={24} />
              </div>
              <span className="text-sm font-bold text-[#EAE6DD] drop-shadow-md">Latihan Baca</span>
            </div>
          </Link>

          {/* MENU KONJUGASI BARU */}
          <Link href="/konjugasi" className="relative bg-[#1E1D1B] border border-[#33312E] hover:border-emerald-500 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center transition-all group h-40">
            <img src="https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=75&w=400&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/60 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 bg-[#33312E]/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-500 transition-colors shadow-lg">
                <BookA className="text-[#EAE6DD]" size={24} />
              </div>
              <span className="text-sm font-bold text-[#EAE6DD] drop-shadow-md">Konjugasi</span>
            </div>
          </Link>

          <div className="relative bg-[#1E1D1B] border border-[#33312E] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center opacity-60 cursor-not-allowed h-40">
            <img src="https://images.unsplash.com/photo-1522383225653-ed111181a951?q=75&w=400&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/80 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 bg-[#33312E] rounded-full flex items-center justify-center mb-3 shadow-lg">
                <Flame className="text-[#A3A099]" size={24} />
              </div>
              <span className="text-sm font-bold text-[#A3A099]">Harian (Soon)</span>
            </div>
          </div>
        </div>
      </div>

      {/* LATIHAN SOAL JLPT */}
      <div className="pt-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-[#B8860B]" size={20} />
          <h3 className="font-bold text-lg text-[#EAE6DD]">Latihan Soal JLPT</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["N5", "N4", "N3", "N2", "N1"].map((level) => (
            <Link
              key={level}
              href={`/jlpt/${level}`} 
              className="relative bg-[#1E1D1B] border border-[#33312E] hover:border-[#B8860B] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center transition-all group h-36"
            >
              <img src={JLPT_IMAGES[level]} alt={level} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <span className="relative z-10 text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-[#B8860B] transition-colors">{level}</span>
              <span className="relative z-10 text-[10px] font-bold text-white/80 mt-1 uppercase tracking-widest drop-shadow-md">Latihan Soal</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}