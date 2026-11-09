"use client";

import { useEffect, useState } from "react";
import kanaStrokeIndex from "../data/kana-stroke-index.json";

type KanaStrokeAsset = {
  file: string;
  durationMs: number;
};

const strokeIndex = kanaStrokeIndex as Record<string, KanaStrokeAsset>;

function KanaStrokeCharacter({ kana }: { kana: string }) {
  const [loopKey, setLoopKey] = useState(0);
  const [svgMarkup, setSvgMarkup] = useState("");
  const [loadedKana, setLoadedKana] = useState("");
  const strokeAsset = strokeIndex[kana];

  useEffect(() => {
    if (!strokeAsset) return;
    let active = true;

    fetch(`/kana-strokes/${strokeAsset.file}`)
      .then((response) => {
        if (!response.ok) throw new Error("Gagal memuat animasi kana.");
        return response.text();
      })
      .then((source) => {
        if (!active) return;

        // Pertahankan timing asli AnimCJK. Beberapa path memang harus
        // bergerak bersamaan karena merupakan bagian dari goresan yang sama.
        const markup = source.replace(
          "<svg ",
          '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" '
        );

        setSvgMarkup(markup);
        setLoadedKana(kana);
      })
      .catch((error) => {
        console.error("Gagal memuat animasi kana:", error);
        if (active) {
          setSvgMarkup("");
          setLoadedKana("");
        }
      });

    return () => {
      active = false;
    };
  }, [kana, loopKey, strokeAsset]);

  useEffect(() => {
    if (!strokeAsset) return;

    const timer = window.setTimeout(
      () => setLoopKey((previous) => previous + 1),
      strokeAsset.durationMs
    );

    return () => window.clearTimeout(timer);
  }, [loopKey, strokeAsset]);

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center sm:h-16 sm:w-16">
      {strokeAsset && svgMarkup && loadedKana === kana ? (
        <div
          key={`${kana}-${loopKey}`}
          role="img"
          aria-label={`Urutan goresan ${kana}`}
          className="h-full w-full [&>svg]:block"
          style={{ filter: "invert(1)" }}
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      ) : (
        <span className="font-mincho text-4xl text-[#EAE6DD]">{kana}</span>
      )}
    </div>
  );
}

export default function KanaStroke({ kana }: { kana: string }) {
  if (!kana) return null;

  const characters = Array.from(kana).filter((character) => strokeIndex[character]);

  if (characters.length === 0) return null;

  return (
    <div className="w-full max-w-full rounded-xl border border-[#33312E] bg-[#121110]/90 px-2 py-2">
      <p className="mb-1 text-center text-[9px] font-bold uppercase tracking-wider text-[#C93438]">
        Urutan Goresan Kana
      </p>
      <div className="w-full max-w-full overflow-x-auto">
        <div className="flex w-max min-w-full items-center justify-center gap-1">
          {characters.map((character, index) => (
            <KanaStrokeCharacter key={`${character}-${index}`} kana={character} />
          ))}
        </div>
      </div>
    </div>
  );
}
