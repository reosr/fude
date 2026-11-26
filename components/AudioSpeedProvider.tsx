"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Gauge } from "lucide-react";

const AUDIO_SPEED_STORAGE_KEY = "fude_audio_speed";

export const AUDIO_SPEED_OPTIONS = [0.75, 0.85, 0.9, 1, 1.15] as const;

type AudioSpeed = (typeof AUDIO_SPEED_OPTIONS)[number];

interface AudioSpeedContextValue {
  speed: AudioSpeed;
  setSpeed: (speed: number) => void;
}

const AudioSpeedContext = createContext<AudioSpeedContextValue | null>(null);

function isAudioSpeed(value: number): value is AudioSpeed {
  return AUDIO_SPEED_OPTIONS.some((option) => option === value);
}

export function AudioSpeedProvider({ children }: { children: ReactNode }) {
  const [speed, setSpeedState] = useState<AudioSpeed>(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(AUDIO_SPEED_STORAGE_KEY));
      if (isAudioSpeed(saved)) setSpeedState(saved);
    } catch {
      // Keep the default speed when browser storage is unavailable.
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    try {
      window.localStorage.setItem(AUDIO_SPEED_STORAGE_KEY, String(speed));
    } catch {
      // Playback still works when browser storage is unavailable.
    }
  }, [speed, isInitialized]);

  const setSpeed = (nextSpeed: number) => {
    if (isAudioSpeed(nextSpeed)) setSpeedState(nextSpeed);
  };

  const contextValue = useMemo(
    () => ({ speed, setSpeed }),
    [speed],
  );

  return (
    <AudioSpeedContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed right-3 top-3 z-[55] md:right-6 md:top-4">
        <label className="pointer-events-auto inline-flex h-9 items-center gap-1.5 rounded-full border border-[#B8860B]/35 bg-[#1A1918]/95 px-2.5 shadow-lg shadow-black/25 backdrop-blur-md transition-colors hover:border-[#B8860B]/60">
          <Gauge size={14} className="shrink-0 text-[#D9B66D]" />
          <span className="sr-only">Kecepatan audio</span>
          <select
            aria-label="Kecepatan audio"
            title="Atur kecepatan semua audio"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            className="max-w-[4.1rem] cursor-pointer bg-transparent text-[11px] font-semibold tabular-nums text-[#EAE6DD] outline-none"
          >
            {AUDIO_SPEED_OPTIONS.map((option) => (
              <option key={option} value={option} className="bg-[#1A1918]">
                {option.toFixed(2).replace(/0$/, "")}x
              </option>
            ))}
          </select>
        </label>
      </div>
    </AudioSpeedContext.Provider>
  );
}

export function useAudioSpeed(): AudioSpeedContextValue {
  const context = useContext(AudioSpeedContext);
  if (!context) {
    throw new Error("useAudioSpeed harus digunakan di dalam AudioSpeedProvider.");
  }
  return context;
}
