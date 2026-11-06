export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#121110] flex flex-col items-center justify-center z-[100]">
      
      {/* Wadah Logo */}
      <div className="relative flex items-center justify-center">
        {/* Cahaya Merah di Belakang Logo */}
        <div className="absolute inset-0 bg-[#C93438] rounded-full blur-[100px] opacity-30 animate-pulse"></div>
        
        {/* Logo Fude dengan Animasi Melayang */}
        <img
          src="/logo.webp"
          alt="Loading..."
          className="w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain relative z-10 animate-float-breath"
        />
      </div>

      {/* Teks Memuat */}
      <p className="text-[#C93438] font-bold tracking-[0.5em] text-sm md:text-lg animate-pulse mt-10 md:mt-14 ml-[0.5em]">
        MEMUAT
      </p>
    </div>
  );
}