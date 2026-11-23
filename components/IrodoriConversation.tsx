"use client";

import { useEffect, useRef, useState } from "react";
import { toHiragana } from "wanakana";
import type { ReactNode } from "react";
import JapaneseReading from "@/components/JapaneseReading";
import { extractKanaFromReactNode } from "@/lib/japanese-text";
import { Gauge, Play, Square, User, Volume2 } from "lucide-react";

export interface IrodoriSpeaker {
  id: string;
  name: string;
  role: string;
  voiceProfileId: string;
  voiceDescription: string;
}

export interface IrodoriUtterance {
  speakerId: string;
  japanese: ReactNode;
  romaji: string;
  translation: string;
  audioFileName: string;
  audioSrc?: string | null;
}

interface Props {
  title: string;
  speakers: IrodoriSpeaker[];
  utterances: IrodoriUtterance[];
}

const SPEED_OPTIONS = [0.7, 0.85, 1, 1.2];

export default function IrodoriConversation({
  title,
  speakers,
  utterances,
}: Props) {
  const [speed, setSpeed] = useState(1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackSessionRef = useRef(0);
  const pendingResolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    return () => {
      playbackSessionRef.current += 1;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      pendingResolveRef.current?.();
      pendingResolveRef.current = null;
      audioRef.current = null;
    };
  }, []);

  const stopAudio = () => {
    playbackSessionRef.current += 1;

    const audio = audioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.currentTime = 0;
    }

    const finishPending = pendingResolveRef.current;
    pendingResolveRef.current = null;
    finishPending?.();

    setIsPlaying(false);
    setActiveIndex(null);
  };

  const playUtterance = (index: number, session: number) =>
    new Promise<void>((resolve) => {
      const utterance = utterances[index];
      const audio = audioRef.current;

      if (!audio || !utterance?.audioSrc) {
        resolve();
        return;
      }

      const finish = () => {
        const ownsPlayback = pendingResolveRef.current === finish;

        if (ownsPlayback) {
          pendingResolveRef.current = null;
          audio.onended = null;
          audio.onerror = null;
        }

        resolve();
      };

      pendingResolveRef.current = finish;
      audio.src = utterance.audioSrc;
      audio.playbackRate = speed;

      if (session === playbackSessionRef.current) {
        setActiveIndex(index);
      }

      audio.onended = finish;
      audio.onerror = () => {
        if (session === playbackSessionRef.current) {
          setAudioError("Audio gagal diputar. Silakan coba lagi.");
        }
        finish();
      };

      audio.play().catch(() => {
        if (session === playbackSessionRef.current) {
          setAudioError("Audio belum dapat diputar. Silakan coba lagi.");
        }
        finish();
      });
    });

  const playOne = async (index: number) => {
    if (!utterances[index]?.audioSrc) return;

    stopAudio();
    const session = playbackSessionRef.current;

    setAudioError("");
    setIsPlaying(true);

    await playUtterance(index, session);

    if (session === playbackSessionRef.current) {
      setIsPlaying(false);
      setActiveIndex(null);
    }
  };

  const playAll = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    const availableIndexes = utterances
      .map((utterance, index) => (utterance.audioSrc ? index : -1))
      .filter((index) => index >= 0);

    if (availableIndexes.length === 0) return;

    stopAudio();
    const session = playbackSessionRef.current;

    setAudioError("");
    setIsPlaying(true);

    for (const index of availableIndexes) {
      if (session !== playbackSessionRef.current) break;
      await playUtterance(index, session);
    }

    if (session === playbackSessionRef.current) {
      setIsPlaying(false);
      setActiveIndex(null);
    }
  };

  const availableAudioCount = utterances.filter(
    (utterance) => Boolean(utterance.audioSrc)
  ).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#39342D] bg-[#1B1A18] shadow-lg shadow-black/10">
      <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#B8860B]">
            LATIHAN PERCAKAPAN
          </p>
          <h4 className="mt-1 text-sm font-bold text-[#EAE6DD]">{title}</h4>
          <p className="mt-1 text-[10px] text-[#817A73]">
            {availableAudioCount > 0
              ? `${availableAudioCount} dari ${utterances.length} audio tersedia`
              : "Audio belum tersedia"}
          </p>
        </div>

{availableAudioCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-[10px] text-[#A3A099]">
              <Gauge size={14} />
              <span className="sr-only">Kecepatan audio</span>
              <select
                aria-label="Kecepatan audio"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
                className="cursor-pointer bg-transparent text-[#EAE6DD] outline-none"
              >
                {SPEED_OPTIONS.map((value) => (
                  <option key={value} value={value} className="bg-[#1B1A18]">
                    {value === 1 ? "1.0" : value.toString()}x
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => void playAll()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C93438] px-4 py-2 text-[10px] font-bold text-white transition-colors hover:bg-[#B02A2E]"
            >
              {isPlaying ? (
                <Square size={13} fill="currentColor" />
              ) : (
                <Play size={13} fill="currentColor" />
              )}
              {isPlaying ? "Hentikan" : "Putar Semua"}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-white/[0.05] px-4 py-3">
        {speakers.map((speaker) => (
          <div
            key={speaker.id}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-black/15 px-3 py-2"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B8860B]/15 text-[#D9B66D]">
              <User size={14} />
            </span>
            <span className="flex flex-col">
              <span className="text-[10px] font-bold text-[#EAE6DD]">
                {speaker.name}
              </span>
              <span className="text-[9px] text-[#A3A099]">
                {speaker.voiceDescription}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="divide-y divide-white/[0.05] p-2 sm:p-3">
        {utterances.map((utterance, index) => {
          const speaker = speakers.find(
            (candidate) => candidate.id === utterance.speakerId
          );
          const isActive = activeIndex === index;
          const kanaReading = toHiragana(utterance.romaji) || extractKanaFromReactNode(utterance.japanese)?.kana || "";

          return (
            <article
              key={`${utterance.audioFileName}-${index}`}
              className={`rounded-xl px-3 py-4 transition-colors sm:px-4 ${
                isActive ? "bg-[#C93438]/10" : "hover:bg-white/[0.025]"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => void playOne(index)}
                  disabled={!utterance.audioSrc}
                  aria-label={`Putar dialog ${index + 1}, ${speaker?.name ?? utterance.speakerId}`}
                  title={
                    utterance.audioSrc
                      ? "Putar kalimat ini"
                      : "Audio belum tersedia"
                  }
                  className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-[#302D29] text-[#D9B66D] transition-colors hover:border-[#C93438]/50 hover:bg-[#C93438] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Volume2 size={16} />
                </button>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-[#D9B66D]">
                    {speaker?.name ?? utterance.speakerId}
                  </p>
                  <JapaneseReading
                    kana={kanaReading}
                    romaji={utterance.romaji}
                    translation={utterance.translation}
                    contentClassName={`mt-1 block font-mincho text-xl leading-[2] text-[#F1EBDD] sm:text-2xl [&_rt]:text-[0.48em] [&_rt]:text-[#D6AD4F] ${
                      isActive ? "text-white" : ""
                    }`}
                    kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]"
                    romajiClassName="mt-1 text-sm italic text-[#B8860B]"
                    translationClassName="mt-2 text-sm leading-6 text-[#A3A099]"
                  >
                    {utterance.japanese}
                  </JapaneseReading>
                  {!utterance.audioSrc && availableAudioCount > 0 && (
                    <p className="mt-2 text-[9px] text-[#746F65]">
                      Audio belum tersedia
                    </p>
                  )}
                </div>
                {isActive && (
                  <span className="mt-2 h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#C93438]" />
                )}
              </div>
            </article>
          );
        })}
      </div>

      {audioError && (
        <p role="status" className="border-t border-red-400/15 px-4 py-3 text-xs text-red-300">
          {audioError}
        </p>
      )}
    </section>
  );
}
