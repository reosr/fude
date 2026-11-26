"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Gauge } from "lucide-react";
import { AUDIO_SPEED_OPTIONS, useAudioSpeed } from "@/components/audio-speed-context";

type AudioSpeedControlProps = {
  variant?: "global" | "compact";
};

function formatSpeed(speed: number): string {
  return `${speed.toFixed(2).replace(/0$/, "")}x`;
}

export default function AudioSpeedControl({
  variant = "global",
}: AudioSpeedControlProps) {
  const { speed, setSpeed } = useAudioSpeed();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isCompact = variant === "compact";

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Kecepatan audio saat ini ${formatSpeed(speed)}. Ubah kecepatan audio`}
        title="Ubah kecepatan audio"
        className={
          isCompact
            ? "inline-flex h-7 items-center gap-1 rounded-full border border-[#D9B66D]/30 bg-[#D9B66D]/[0.08] px-2 text-[10px] font-bold tabular-nums text-[#E8C77D] transition hover:border-[#D9B66D]/65 hover:bg-[#D9B66D]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B66D]/50"
            : "inline-flex h-9 items-center gap-2 rounded-full border border-[#B8860B]/35 bg-gradient-to-b from-[#24211C] to-[#171615] px-3 text-[11px] font-semibold tabular-nums text-[#EAE6DD] shadow-lg shadow-black/25 backdrop-blur-md transition hover:border-[#D9B66D]/70 hover:from-[#2D281F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B66D]/50"
        }
      >
        {!isCompact && <Gauge size={14} className="shrink-0 text-[#D9B66D]" />}
        <span>{formatSpeed(speed)}</span>
        <ChevronDown
          size={isCompact ? 11 : 13}
          className={`shrink-0 text-[#B7A98D] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Pilihan kecepatan audio"
          className="absolute right-0 top-full z-[90] mt-2 w-48 overflow-hidden rounded-2xl border border-[#B8860B]/30 bg-[#191816]/[0.98] p-2.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <div className="mb-2 border-b border-white/[0.07] px-1 pb-2">
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#D9B66D]">
              KECEPATAN AUDIO
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-[#9D978D]">
              Berlaku untuk semua audio
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {AUDIO_SPEED_OPTIONS.map((option) => {
              const isSelected = speed === option;

              return (
                <button
                  key={option}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setSpeed(option);
                    setIsOpen(false);
                  }}
                  className={
                    isSelected
                      ? "flex h-9 items-center justify-between rounded-xl border border-[#D9B66D]/50 bg-gradient-to-r from-[#D9B66D]/20 to-[#B8860B]/10 px-2.5 text-[11px] font-bold tabular-nums text-[#F0D99D] shadow-inner shadow-[#D9B66D]/[0.06]"
                      : "flex h-9 items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-2.5 text-[11px] font-semibold tabular-nums text-[#C7C1B6] transition hover:border-[#D9B66D]/30 hover:bg-white/[0.07] hover:text-white"
                  }
                >
                  <span>{formatSpeed(option)}</span>
                  {isSelected && <Check size={13} className="text-[#E7C879]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
