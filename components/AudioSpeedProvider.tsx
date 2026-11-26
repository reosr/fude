"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AudioSpeedControl from "@/components/AudioSpeedControl";
import {
  AUDIO_SPEED_OPTIONS,
  AudioSpeedContext,
  type AudioSpeed,
} from "@/components/audio-speed-context";

// Keep the original import path working for existing audio components.
export { useAudioSpeed } from "@/components/audio-speed-context";

const AUDIO_SPEED_STORAGE_KEY = "fude_audio_speed";

function isAudioSpeed(value: number): value is AudioSpeed {
  return AUDIO_SPEED_OPTIONS.some((option) => option === value);
}

export function AudioSpeedProvider({ children }: { children: ReactNode }) {
  const [speed, setSpeedState] = useState<AudioSpeed>(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(AUDIO_SPEED_STORAGE_KEY));
      if (isAudioSpeed(saved)) {
        // Restore a persisted preference after the client has hydrated.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSpeedState(saved);
      }
    } catch {
      // Keep the default speed when browser storage is unavailable.
    } finally {
      // Mark the client preference read as complete after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const setSpeed = useCallback((nextSpeed: number) => {
    if (isAudioSpeed(nextSpeed)) setSpeedState(nextSpeed);
  }, []);

  const contextValue = useMemo(
    () => ({ speed, setSpeed }),
    [speed, setSpeed],
  );

  return (
    <AudioSpeedContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed right-3 top-3 z-[55] md:right-6 md:top-4">
        <div className="pointer-events-auto">
          <AudioSpeedControl variant="global" />
        </div>
      </div>
    </AudioSpeedContext.Provider>
  );
}
