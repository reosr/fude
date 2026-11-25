"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  BookText,
  Layers,
  MessageCircle,
  Trophy,
} from "lucide-react";
import jlptData from "@/data/jlpt.json";
import storyIndex from "@/data/story-index.json";
import practicalVocabData from "@/data/practical-vocab.json";
import { getProgress } from "@/lib/progress";
import { getUnlockedVocab } from "@/lib/vocab";
import { getMemorizedKanji } from "@/lib/memorized";
import { useIrodoriProgress } from "@/lib/irodori-progress";
import { getCompletedJlptSetIds, useStudyProgress } from "@/lib/study-progress";

type FlashcardProgress = {
  memorized: number;
  available: number;
};

const IRODORI_PREFIXES = [
  "starter-",
  "elementary1-",
  "elementary2-",
  "preintermediate-",
];

const JLPT_TOTAL_SETS = jlptData.reduce(
  (total, level: any) => total + (Array.isArray(level.sets) ? level.sets.length : 0),
  0
);

export default function LearningJourneyOverview() {
  const irodoriProgress = useIrodoriProgress();
  const studyProgress = useStudyProgress();
  const [completedBab, setCompletedBab] = useState(0);
  const [completedJlpt, setCompletedJlpt] = useState(0);
  const [flashcardProgress, setFlashcardProgress] = useState<FlashcardProgress>({
    memorized: 0,
    available: 0,
  });

  const refreshLocalProgress = useCallback(() => {
    const currentBab = Math.min(51, Math.max(1, getProgress()));
    setCompletedBab(Math.min(50, Math.max(0, currentBab - 1)));
    setCompletedJlpt(getCompletedJlptSetIds().length);
  }, []);

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      refreshLocalProgress();

      try {
        const vocab = await getUnlockedVocab(getProgress());
        if (!active) return;

        const availableKanji = new Set(vocab.map((item) => item.kanji));
        const memorizedKanji = new Set(
          getMemorizedKanji().filter((kanji) => availableKanji.has(kanji))
        );

        setFlashcardProgress({
          memorized: memorizedKanji.size,
          available: availableKanji.size,
        });
      } catch (error) {
        console.error("Gagal memuat ringkasan Flashcard:", error);
      }
    };

    const handleRefresh = () => {
      void refresh();
    };

    void refresh();
    window.addEventListener("storage", handleRefresh);
    window.addEventListener("focus", handleRefresh);
    window.addEventListener("fude:local-data-changed", handleRefresh);
    window.addEventListener("fude:irodori-progress-updated", handleRefresh);

    return () => {
      active = false;
      window.removeEventListener("storage", handleRefresh);
      window.removeEventListener("focus", handleRefresh);
      window.removeEventListener("fude:local-data-changed", handleRefresh);
      window.removeEventListener("fude:irodori-progress-updated", handleRefresh);
    };
  }, [refreshLocalProgress]);

  const validPracticalIds = new Set(practicalVocabData.map((category) => category.id));
  const completedPractical = new Set(
    studyProgress.completedPracticalCategories.filter((id) => validPracticalIds.has(id))
  ).size;

  const validStoryIds = new Set(storyIndex.map((story: any) => story.id));
  const completedStories = new Set(
    studyProgress.completedStories.filter((id) => validStoryIds.has(id))
  ).size;

  const validIrodoriIds = new Set(
    irodoriProgress.completedLessons.filter((id) =>
      IRODORI_PREFIXES.some((prefix) => {
        if (!id.startsWith(prefix)) return false;
        const lessonNumber = Number(id.slice(prefix.length));
        return Number.isInteger(lessonNumber) && lessonNumber >= 1 && lessonNumber <= 18;
      })
    )
  );
  const completedIrodori = validIrodoriIds.size;

  const cards = [
    {
      title: "Minna no Nihongo",
      subtitle: "Jalur materi utama",
      detail: `${completedBab}/50 bab selesai`,
      current: completedBab,
      total: 50,
      href: "/belajar",
      icon: BookOpen,
      tone: "text-[#F06A6E]",
      bar: "bg-[#C93438]",
    },
    {
      title: "Irodori",
      subtitle: "Jalur komunikasi A1–B1",
      detail: `${completedIrodori}/72 pelajaran selesai`,
      current: completedIrodori,
      total: 72,
      href: "/irodori",
      icon: BookText,
      tone: "text-[#D9B66D]",
      bar: "bg-[#B8860B]",
    },
    {
      title: "Latihan JLPT",
      subtitle: "Latihan per level dan set",
      detail: `${completedJlpt}/${JLPT_TOTAL_SETS} set selesai`,
      current: completedJlpt,
      total: JLPT_TOTAL_SETS,
      href: "/jlpt/N5",
      icon: Trophy,
      tone: "text-[#D9B66D]",
      bar: "bg-[#B8860B]",
    },
    {
      title: "Ungkapan Praktis",
      subtitle: "Situasi sehari-hari di Jepang",
      detail: `${completedPractical}/${practicalVocabData.length} kategori selesai`,
      current: completedPractical,
      total: practicalVocabData.length,
      href: "/ungkapan-praktis",
      icon: MessageCircle,
      tone: "text-[#D9B66D]",
      bar: "bg-[#B8860B]",
    },
    {
      title: "Latihan Baca",
      subtitle: "Cerita dan percakapan",
      detail: `${completedStories}/${storyIndex.length} cerita selesai dibaca`,
      current: completedStories,
      total: storyIndex.length,
      href: "/baca",
      icon: BookText,
      tone: "text-[#8FB8E8]",
      bar: "bg-[#5B88BD]",
    },
    {
      title: "Flashcard",
      subtitle: "Kosakata yang sudah dihafal",
      detail: `${flashcardProgress.memorized}/${flashcardProgress.available} kata dihafal`,
      current: flashcardProgress.memorized,
      total: flashcardProgress.available,
      href: "/flashcard",
      icon: Layers,
      tone: "text-[#8ED8B4]",
      bar: "bg-[#269B70]",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">
            RINGKASAN PERJALANAN
          </p>
          <h3 className="mt-1 text-xl font-bold text-[#EAE6DD]">
            Progres Semua Modul
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-[#A3A099]">
            Setiap jalur punya catatan sendiri. Menyelesaikan satu modul tidak membuka atau mengubah progres modul lainnya.
          </p>
        </div>
        <Link
          href="/profil"
          className="text-xs font-semibold text-[#D9B66D] transition-colors hover:text-[#F0D38A]"
        >
          Lihat profil
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const percent = card.total > 0
            ? Math.min(100, Math.round((card.current / card.total) * 100))
            : 0;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-2xl border border-[#33312E] bg-[#1E1D1B]/85 p-4 transition-all hover:-translate-y-0.5 hover:border-[#B8860B]/45 hover:bg-[#24211B]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#33312E] bg-[#121110]/70">
                    <Icon size={19} className={card.tone} />
                  </span>
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-bold text-[#EAE6DD] group-hover:text-[#D9B66D]">
                      {card.title}
                    </h4>
                    <p className="mt-0.5 text-[10px] text-[#817A73]">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-bold tabular-nums text-[#C5C0B7]">
                  {percent}%
                </span>
              </div>
              <div
                className="mt-4 h-2 overflow-hidden rounded-full bg-[#121110]"
                role="progressbar"
                aria-label={`Progres ${card.title}`}
                aria-valuemin={0}
                aria-valuemax={Math.max(1, card.total)}
                aria-valuenow={Math.min(card.current, card.total)}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${card.bar}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] font-semibold text-[#A3A099]">
                {card.detail}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
