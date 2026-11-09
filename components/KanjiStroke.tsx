"use client";

import { useEffect, useRef, useState } from "react";
// @ts-ignore
import HanziWriter from "hanzi-writer";

export default function KanjiStroke({ kanji }: { kanji: string }) {
  const characters = Array.from(kanji).filter(char => /[\u4e00-\u9faf\u3400-\u4dbf]/.test(char));
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const writerRefs = useRef<any[]>([]);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  
  // State untuk nyimpen huruf mana yang gagal load animasinya
  const [failedChars, setFailedChars] = useState<Record<number, boolean>>({});

  // Ukuran satu kotak kanji: 76px di HP, 100px mulai md (sama seperti breakpoint md Tailwind).
  // Ukuran yang sama dipakai untuk kotaknya DAN untuk gambar HanziWriter, supaya kanji
  // selalu pas di tengah kotak (dulu gambar dipatok 100px walau kotaknya 76px -> kegeser 12px).
  const [size, setSize] = useState<number>(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches ? 100 : 76
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setSize(mq.matches ? 100 : 76);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let isMounted = true;

    characters.forEach((char, index) => {
      const container = containerRefs.current[index];
      if (!container) return;

      container.innerHTML = ""; 
      try {
        const writer = HanziWriter.create(container, char, {
          width: size,
          height: size,
          padding: 5,
          strokeColor: "#EAE6DD",
          radicalColor: "#C93438",
          showOutline: true,
          outlineColor: "#33312E",
          strokeAnimationSpeed: 1.5,
          delayBetweenStrokes: 300,
          charDataLoader: (char: string, onComplete: any) => {
            // Menggunakan dataset khusus Kanji Jepang
            fetch(`https://unpkg.com/@k1low/hanzi-writer-data-jp@latest/${char}.json`)
                .then((res) => {
                if (!res.ok) throw new Error("Data not found");
                return res.json();
                })
                .then((data) => onComplete(data))
                .catch(() => {
                // Tampilkan fallback jika data masih tidak ditemukan
                if (isMounted) {
                    setFailedChars(prev => ({ ...prev, [index]: true }));
                }
                onComplete(null);
                });
            },
        });
        
        writerRefs.current[index] = writer;

        const playLoop = () => {
          if (!isMounted) return; 
          
          writer.animateCharacter({
            onComplete: () => {
              if (!isMounted) return;
              const timeoutId = setTimeout(() => {
                playLoop();
              }, 1500);
              timeoutRefs.current.push(timeoutId);
            }
          });
        };

        playLoop();

      } catch (e) {
        console.log("Gagal render stroke untuk", char);
      }
    });

    return () => {
      isMounted = false; 
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
      characters.forEach((_, index) => {
        const container = containerRefs.current[index];
        if (container) container.innerHTML = "";
      });
    };
  }, [kanji, size]);

  if (characters.length === 0) return null;

  return (
    <div
      className="flex w-full max-w-full flex-col items-center justify-center bg-[#121110] border border-[#33312E] rounded-2xl p-2 md:p-4 my-1 md:my-4 relative z-20 cursor-default"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()} 
    >
      <div className="flex w-full flex-wrap justify-center gap-2">
        {characters.map((char, index) => (
          <div key={index} className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* KALAU ANIMASI GAGAL, TAMPILIN KANJI BIASA BESAR */}
            {failedChars[index] ? (
              <span className="text-5xl md:text-7xl font-mincho text-[#EAE6DD]">{char}</span>
            ) : (
              <>
                <div
                  ref={(el) => { containerRefs.current[index] = el; }}
                  className="absolute inset-0 pointer-events-none" 
                />
                <div className="absolute inset-0 z-50" />
              </>
            )}
          </div>
        ))}
      </div>
      <p className="text-[10px] font-bold text-[#C93438] bg-[#C93438]/10 px-3 py-1 rounded-full mt-3 pointer-events-none">
        {Object.keys(failedChars).length > 0 ? "Data animasi tidak tersedia" : "Animasi Berjalan Otomatis"}
      </p>
    </div>
  );
}