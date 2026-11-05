"use client";

import { useState, useEffect } from "react";
import { Volume2, Copy, Check } from "lucide-react";

export default function Terjemahan() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Deteksi bahasa (Cek apakah ada huruf Jepang)
  const hasJapanese = (text: string) => {
    return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
  };

  // EFEK REAL-TIME (AJAX): Jalan otomatis setiap kali 'input' berubah
  useEffect(() => {
    // Kalau input kosong, bersihin hasil dan jangan lakuin apa-apa
    if (!input.trim()) {
      setResult("");
      setIsLoading(false);
      return;
    }

    // Set loading pas mulai ngetik
    setIsLoading(true);

    // Timer 800ms (Debounce): Nunggu user berhenti ngetik baru eksekusi
    const timer = setTimeout(async () => {
      try {
        const isJa = hasJapanese(input);
        const targetLang = isJa ? "id" : "ja"; 

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(input)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        const translatedText = data[0].map((item: any) => item[0]).join("");
        setResult(translatedText);
      } catch (error) {
        console.error(error);
        setResult("Gagal menerjemahkan.");
      } finally {
        setIsLoading(false);
      }
    }, 300); // <--- Ubah dari 800 ke 300
    
    // Bersihin timer kalau user ngetik lagi sebelum 800ms
    return () => clearTimeout(timer);
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!result) return;
    const utterance = new SpeechSynthesisUtterance(result);
    utterance.lang = hasJapanese(result) ? "ja-JP" : "id-ID";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 pb-10 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-[#EAE6DD]">Terjemahan</h2>
        <p className="text-[#A3A099] text-sm mt-1">
          Ketik dan hasil terjemahan akan muncul otomatis.
        </p>
      </div>

      <div className="bg-[#1E1D1B]/80 backdrop-blur-md border border-[#33312E] rounded-2xl overflow-hidden shadow-xl">
        
        {/* Area Input */}
        <div className="p-4 relative border-b border-[#33312E]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik kata atau kalimat di sini..."
            className="w-full bg-transparent text-[#EAE6DD] placeholder-[#A3A099] resize-none focus:outline-none min-h-[120px]"
          />
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={() => { setInput(""); setResult(""); }}
              className="text-xs font-bold text-[#A3A099] hover:text-[#EAE6DD] transition-colors"
            >
              Bersihkan
            </button>
            
            {/* Indikator Loading kecil di pojok */}
            {isLoading && (
              <span className="text-xs text-[#C93438] animate-pulse font-medium">
                Sedang menerjemahkan...
              </span>
            )}
          </div>
        </div>

        {/* Area Hasil */}
        <div className="p-4 bg-[#121110]/50 min-h-[160px] relative">
          {result ? (
            <div className="animate-in fade-in duration-300">
              <p className="text-xl font-medium text-[#EAE6DD] leading-relaxed">
                {result}
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSpeak}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#A3A099] bg-[#262523] px-3 py-1.5 rounded-full hover:text-[#EAE6DD] transition-colors"
                >
                  <Volume2 size={14} /> Dengar
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#A3A099] bg-[#262523] px-3 py-1.5 rounded-full hover:text-[#EAE6DD] transition-colors"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copied ? "Tersalin!" : "Salin"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[#A3A099] text-sm italic">
              {isLoading ? "Menunggu ketikan selesai..." : "Hasil terjemahan akan muncul di sini..."}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}