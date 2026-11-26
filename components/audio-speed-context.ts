"use client";

import { createContext, useContext } from "react";

export const AUDIO_SPEED_OPTIONS = [0.75, 0.85, 0.9, 1, 1.15] as const;

export type AudioSpeed = (typeof AUDIO_SPEED_OPTIONS)[number];

export interface AudioSpeedContextValue {
  speed: AudioSpeed;
  setSpeed: (speed: number) => void;
}

export const AudioSpeedContext = createContext<AudioSpeedContextValue | null>(null);

export function useAudioSpeed(): AudioSpeedContextValue {
  const context = useContext(AudioSpeedContext);
  if (!context) {
    throw new Error("useAudioSpeed harus digunakan di dalam AudioSpeedProvider.");
  }
  return context;
}
