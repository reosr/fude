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
  const [listeningAnswer, setListeningAnswer] = useState<string | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackSessionRef = useRef(0);
  const pendingResolveRef = useRef<(() => void) | null>(null);

  // File audio dibuat sekaligus melalui batch VOICEVOX.
  const audioUtterances = utterances.map((utterance) => ({
    ...utterance,
    audioSrc: utterance.audioSrc ?? (utterance.audioFileName ? `/audio/irodori/${utterance.audioFileName}` : null),
  }));

  const listeningChoices = audioUtterances.reduce<
    { index: number; speakerId: string; translation: string }[]
  >((items, utterance, index) => {
    const translation = utterance.translation.trim();
    if (translation && !items.some((item) => item.translation === translation)) {
      items.push({ index, speakerId: utterance.speakerId, translation });
    }
    return items;
  }, []);

  const listeningTarget = listeningChoices.length >= 2
    ? listeningChoices[Math.floor(listeningChoices.length / 2)]
    : null;
  const rawListeningOptions = listeningTarget
    ? [listeningTarget, ...listeningChoices.filter((item) => item.translation !== listeningTarget.translation).slice(0, 2)]
    : [];
  const listeningShift = listeningTarget && rawListeningOptions.length > 1
    ? listeningTarget.index % rawListeningOptions.length
    : 0;
  const listeningOptions = [...rawListeningOptions.slice(listeningShift), ...rawListeningOptions.slice(0, listeningShift)];
  const targetSpeaker = listeningTarget
    ? speakers.find((speaker) => speaker.id === listeningTarget.speakerId)?.name ?? "penutur"
    : "";

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
      const utterance = audioUtterances[index];
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
    if (!audioUtterances[index]?.audioSrc) return;

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

    const availableIndexes = audioUtterances
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

  const availableAudioCount = audioUtterances.filter(
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
              ? `${availableAudioCount} baris dialog disiapkan untuk audio`
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

      {listeningTarget && availableAudioCount > 0 && (
        <div className="border-b border-white/[0.06] bg-[#26211A]/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">LATIHAN MENYIMAK</p>
              <p className="mt-1 text-xs leading-5 text-[#C5C0B7]">Dengarkan percakapan, lalu pilih arti ucapan {targetSpeaker}.</p>
            </div>
            <button type="button" onClick={() => { setListeningAnswer(null); void playAll(); }} className="inline-flex items-center gap-2 rounded-lg bg-[#C93438] px-3 py-2.5 text-[10px] font-bold text-white transition-colors hover:bg-[#B02A2E]">
              {isPlaying ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
              {isPlaying ? "Hentikan" : "Dengarkan dialog"}
            </button>
          </div>
          <p className="mt-3 text-xs font-semibold text-[#EAE6DD]">Apa maksud ucapan {targetSpeaker} dalam percakapan tadi?</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {listeningOptions.map((option) => {
              const selected = listeningAnswer === option.translation;
              const isCorrect = option.translation === listeningTarget.translation;
              return (
                <button key={option.translation} type="button" aria-pressed={selected} onClick={() => setListeningAnswer(option.translation)}
                  className={"rounded-lg border px-3 py-2.5 text-left text-xs leading-5 transition-colors " + (selected && isCorrect ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : selected ? "border-red-400/50 bg-red-400/10 text-red-200" : "border-white/[0.08] bg-black/15 text-[#D6D0C5] hover:border-[#D9B66D]/40")}>
                  {option.translation}
                </button>
              );
            })}
          </div>
          {listeningAnswer && <p role="status" className={"mt-2 text-[10px] " + (listeningAnswer === listeningTarget.translation ? "text-emerald-300" : "text-[#E7A1A1]")}>
            {listeningAnswer === listeningTarget.translation ? "Benar. Kamu memahami maksud ucapan tersebut." : "Belum tepat. Dengarkan sekali lagi, lalu coba pilihan lain."}
          </p>}
        </div>
      )}

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

      <div className="border-b border-white/[0.05] px-4 py-3">
        <button type="button" onClick={() => setTranscriptOpen((open) => !open)} aria-expanded={transcriptOpen}
          className="text-[10px] font-bold text-[#D9B66D] transition-colors hover:text-[#F1EBDD]">
          {transcriptOpen ? "Sembunyikan teks dialog" : "Tampilkan teks dialog"}
        </button>
      </div>
      {transcriptOpen && (
      <div className="divide-y divide-white/[0.05] p-2 sm:p-3">
        {audioUtterances.map((utterance, index) => {
          const speaker = speakers.find(
            (candidate) => candidate.id === utterance.speakerId
          );
          const isActive = activeIndex === index;
          // Utamakan furigana dan indeks bacaan dari teks Jepang; romaji menjadi cadangan terakhir.
          const kanaReading = extractKanaFromReactNode(utterance.japanese, true)?.kana || toHiragana(utterance.romaji) || "";

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
                    allowIndexFallback
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
      )}

      {audioError && (
        <p role="status" className="border-t border-red-400/15 px-4 py-3 text-xs text-red-300">
          {audioError}
        </p>
      )}
    </section>
  );
}
