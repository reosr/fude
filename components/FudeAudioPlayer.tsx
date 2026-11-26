"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { useAudioSpeed } from "@/components/AudioSpeedProvider";
import AudioSpeedControl from "@/components/AudioSpeedControl";

interface FudeAudioPlayerProps {
  src: string;
  onUnavailable?: () => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainder = wholeSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export default function FudeAudioPlayer({
  src,
  onUnavailable,
}: FudeAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { speed } = useAudioSpeed();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = speed;
    audio.preservesPitch = true;
  }, [speed]);

  const handleTogglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !isReady) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    if (audio.ended) audio.currentTime = 0;

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(duration)) return;

    const nextTime = Math.min(Math.max(value, 0), duration);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const progressPercent = duration > 0
    ? Math.min(100, (currentTime / duration) * 100)
    : 0;

  return (
    <div className="w-full max-w-xl rounded-2xl border border-[#B8860B]/25 bg-gradient-to-br from-[#211F1B] to-[#171615] p-4 shadow-lg shadow-black/20">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        className="sr-only"
        onLoadedMetadata={(event) => {
          const audio = event.currentTarget;
          const nextDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
          audio.playbackRate = speed;
          audio.preservesPitch = true;
          setDuration(nextDuration);
          setIsReady(true);
        }}
        onDurationChange={(event) => {
          const nextDuration = event.currentTarget.duration;
          if (Number.isFinite(nextDuration)) setDuration(nextDuration);
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setIsPlaying(false);
          setIsReady(false);
          onUnavailable?.();
        }}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void handleTogglePlayback()}
          disabled={!isReady}
          aria-label={isPlaying ? "Jeda audio" : "Putar audio"}
          title={isPlaying ? "Jeda audio" : "Putar audio"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C93438] text-white shadow-md shadow-[#C93438]/25 transition-all hover:bg-[#B02A2E] active:scale-95 disabled:cursor-wait disabled:opacity-50"
        >
          {isPlaying
            ? <Pause size={18} fill="currentColor" />
            : <Play size={18} fill="currentColor" className="translate-x-px" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#D9B66D]">
              <Volume2 size={13} />
              Audio soal
            </span>
            <AudioSpeedControl variant="compact" />
          </div>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => handleSeek(Number(event.target.value))}
            disabled={!isReady || duration <= 0}
            aria-label="Posisi audio"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-[#D9AD42] disabled:cursor-wait"
            style={{
              background: `linear-gradient(to right, #C93438 0%, #C93438 ${progressPercent}%, #484139 ${progressPercent}%, #484139 100%)`,
            }}
          />

          <div className="mt-1 flex items-center justify-between text-[10px] tabular-nums text-[#8F8980]">
            <span>{formatTime(currentTime)}</span>
            <span>{isReady ? formatTime(duration) : "Memuat audio..."}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
