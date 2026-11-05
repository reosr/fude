export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#F9F6F0] flex flex-col items-center justify-center z-[100]">
      <img 
        src="/logo.webp" 
        alt="Loading..." 
        className="w-24 h-24 object-contain animate-pulse mb-4" 
      />
      <p className="text-[#B7282E] font-bold tracking-widest text-sm animate-pulse">
        MEMUAT...
      </p>
    </div>
  );
}