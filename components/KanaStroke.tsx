
"use client";

import { useState, useEffect } from "react";
import kanaStrokeIndex from "../data/kana-stroke-index.json";

type KanaStrokeAsset = {
  file: string;
  durationMs: number;
};

const strokeIndex = kanaStrokeIndex as Record<
  string,
  KanaStrokeAsset
>;

export default function KanaStroke({ kana }: { kana: string }) {
  const [loopKey, setLoopKey] = useState(0);

  const strokeAsset = strokeIndex[kana];
  const animationDuration = strokeAsset?.durationMs ?? 3500;

  useEffect(() => {
    if (!strokeAsset) return;

    const timer = setTimeout(() => {
      setLoopKey((prev) => prev + 1);
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [loopKey, kana, animationDuration, strokeAsset]);

  if (!kana) return null;

  return (
    <div className="w-full h-full flex items-center justify-center">
      {strokeAsset ? (
        <img
          key={`${kana}-${loopKey}`}
          src={`/kana-strokes/${strokeAsset.file}`}
          alt={kana}
          draggable={false}
          className="w-full h-full object-contain"
          style={{ filter: "invert(1)" }}
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
