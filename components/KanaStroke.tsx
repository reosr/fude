"use client";

import { useEffect, useState } from "react";
import kanaStrokeIndex from "../data/kana-stroke-index.json";

type KanaStrokeAsset = {
  file: string;
  durationMs: number;
};

const strokeIndex = kanaStrokeIndex as Record<string, KanaStrokeAsset>;

function prepareStrokeAnimation(
  source: string,
  minimumDuration: number
): { markup: string; durationMs: number } {
  const delayCounts = new Map<number, number>();
  let maxDelay = 0;

  // AnimCJK kadang membagi satu goresan menjadi beberapa path dengan waktu mulai sama.
  // Tách các path trùng delay để chúng lần lượt được vẽ thay vì chồng lên nhau.
  const staggeredMarkup = source.replace(
    /style="--d:([\d.]+)s;"/g,
    (_match, rawDelay: string) => {
      const baseDelay = Number(rawDelay);
      const duplicateIndex = delayCounts.get(baseDelay) ?? 0;
      delayCounts.set(baseDelay, duplicateIndex + 1);

      const nextDelay = baseDelay + duplicateIndex * 0.85;
      maxDelay = Math.max(maxDelay, nextDelay);

      return `style="--d:${nextDelay.toFixed(2)}s;"`;
    }
  );

  const markup = staggeredMarkup.replace(
    "<svg ",
    '<svg width="100%" height="100%" '
  );

  return {
    markup,
    durationMs: Math.max(
      minimumDuration,
      Math.ceil((maxDelay + 1) * 1000)
    ),
  };
}

export default function KanaStroke({ kana }: { kana: string }) {
  const [loopKey, setLoopKey] = useState(0);
  const [svgMarkup, setSvgMarkup] = useState("");
  const [loadedKana, setLoadedKana] = useState("");
  const [loopDuration, setLoopDuration] = useState(3500);

  const strokeAsset = strokeIndex[kana];

  useEffect(() => {
    if (!strokeAsset) return;

    let active = true;

    fetch(`/kana-strokes/${strokeAsset.file}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal memuat animasi kana.");
        }
        return response.text();
      })
      .then((source) => {
        if (!active) return;

        const prepared = prepareStrokeAnimation(
          source,
          strokeAsset.durationMs
        );

        setSvgMarkup(prepared.markup);
        setLoadedKana(kana);
        setLoopDuration(prepared.durationMs);
      })
      .catch((error) => {
        console.error("Gagal memuat animasi kana:", error);
        if (active) setSvgMarkup("");
      });

    return () => {
      active = false;
    };
  }, [kana, loopKey, strokeAsset]);

  useEffect(() => {
    if (!strokeAsset) return;

    const timer = window.setTimeout(() => {
      setLoopKey((previous) => previous + 1);
    }, loopDuration);

    return () => window.clearTimeout(timer);
  }, [loopKey, kana, loopDuration, strokeAsset]);

  if (!kana) return null;

  return (
    <div className="flex h-full w-full items-center justify-center">
      {strokeAsset && svgMarkup && loadedKana === kana ? (
        <div
          key={`${kana}-${loopKey}`}
          role="img"
          aria-label={`Urutan goresan ${kana}`}
          className="h-full w-full"
          style={{ filter: "invert(1)" }}
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      ) : (
        <span
          style={{
            fontSize: "100px",
            color: "#EAE6DD",
          }}
        >
          {kana}
        </span>
      )}
    </div>
  );
}
