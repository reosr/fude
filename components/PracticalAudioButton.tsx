"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square, Volume2 } from "lucide-react";
import { useAudioSpeed } from "@/components/AudioSpeedProvider";

interface Props {
  src?: string;
  sources?: string[];
  label: string;
}

export default function PracticalAudioButton({ src, sources, label }: Props) {
  const { speed } = useAudioSpeed();
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistRef = useRef<string[]>([]);
  const activeIndexRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.playbackRate = speedRef.current;
    audio.preservesPitch = true;
    audioRef.current = audio;

    const playNext = () => {
      const nextIndex = activeIndexRef.current + 1;
      if (nextIndex >= playlistRef.current.length) {
        playlistRef.current = [];
        setIsPlaying(false);
        return;
      }
      activeIndexRef.current = nextIndex;
      audio.playbackRate = speedRef.current;
      audio.preservesPitch = true;
      audio.src = playlistRef.current[nextIndex];
      audio.play().catch(() => {
        playlistRef.current = [];
        setIsPlaying(false);
        setAudioError(true);
      });
    };

    audio.onended = playNext;
    audio.onerror = () => {
      playlistRef.current = [];
      setIsPlaying(false);
      setAudioError(true);
    };

    return () => {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      audioRef.current.preservesPitch = true;
    }
  }, [speed]);

  const handlePlayback = () => {
    const audio = audioRef.current;
    const playlist = src ? [src] : (sources ?? []).filter(Boolean);
    if (!audio || playlist.length === 0) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      playlistRef.current = [];
      setIsPlaying(false);
      return;
    }

    setAudioError(false);
    playlistRef.current = playlist;
    activeIndexRef.current = 0;
    audio.playbackRate = speedRef.current;
    audio.preservesPitch = true;
    audio.src = playlist[0];
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        playlistRef.current = [];
        setIsPlaying(false);
        setAudioError(true);
      });
  };

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <button type="button" onClick={handlePlayback} aria-label={isPlaying ? "Hentikan audio" : label} title={isPlaying ? "Hentikan audio" : label}
        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[#B8860B]/30 bg-[#B8860B]/10 px-2.5 py-2 text-[10px] font-bold text-[#D9B66D] transition-colors hover:border-[#B8860B]/60 hover:bg-[#B8860B]/20">
        {isPlaying ? <Square size={12} fill="currentColor" /> : <Volume2 size={13} />}
        <span>{isPlaying ? "Hentikan" : label}</span>
        {!isPlaying && <Play size={10} fill="currentColor" />}
      </button>
      {audioError && <span role="status" className="text-right text-[9px] text-[#E7A1A1]">Audio belum tersedia.</span>}
    </div>
  );
}
