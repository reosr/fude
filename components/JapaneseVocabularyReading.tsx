"use client";

import type { ReactNode } from "react";
import JapaneseReading from "@/components/JapaneseReading";

interface Props {
  reading: string;
  children?: ReactNode;
  meaning?: ReactNode;
  kanaClassName?: string;
  romajiClassName?: string;
  translationClassName?: string;
  contentClassName?: string;
  wrapperClassName?: string;
}

export default function JapaneseVocabularyReading({
  reading,
  children,
  meaning,
  kanaClassName = "mt-1 font-mincho text-base leading-relaxed text-[#D6AD4F]",
  romajiClassName = "mt-1 text-sm italic leading-relaxed text-[#A9A398]",
  translationClassName = "mt-2 text-sm leading-6 text-[#A9A398]",
  contentClassName = "font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]",
  wrapperClassName = "",
}: Props) {
  const parts = reading.split(/\s*[·•]\s*/);
  const kana = (parts[0] ?? "").trim();
  const romaji = parts.slice(1).join(" · ").trim();
  const hasKanji = typeof children === "string"
    ? /[\u3400-\u4dbf\u4e00-\u9fff々〆ヵヶ]/.test(children)
    : Boolean(children);

  // Pertahankan bentuk lama bagi pemanggil yang hanya meminta baris bacaan.
  if (children === undefined && meaning === undefined) {
    return (
      <span className={"block min-w-0 " + wrapperClassName}>
        {kana && <span className={kanaClassName + " block"}>（{kana}）</span>}
        {romaji && <span className={romajiClassName + " block"}>{romaji}</span>}
      </span>
    );
  }

  return (
    <div className={"min-w-0 " + wrapperClassName}>
      <JapaneseReading
        kana={hasKanji ? kana : undefined}
        romaji={romaji || undefined}
        translation={meaning}
        contentClassName={contentClassName}
        kanaClassName={kanaClassName}
        romajiClassName={romajiClassName}
        translationClassName={translationClassName}
      >
        {children}
      </JapaneseReading>
    </div>
  );
}
