
"use client";

import { toRomaji } from "wanakana";
import type { ReactNode } from "react";
import { extractKanaFromReactNode, extractKanaFromRubyHtml } from "@/lib/japanese-text";

interface Props {
  html?: string;
  children?: ReactNode;
  contentClassName?: string;
  kanaClassName?: string;
  romajiClassName?: string;
  showKana?: boolean;
  showRomaji?: boolean;
  showKanaForKanaOnly?: boolean;
  allowIndexFallback?: boolean;
  allowIndexFallback?: boolean;
}

export default function JapaneseReading({
  html,
  children,
  contentClassName = "font-mincho text-lg leading-[2.2] text-[#F1EBDD]",
  kanaClassName = "mt-2 font-mincho text-base leading-relaxed text-[#D6AD4F]",
  romajiClassName = "mt-1 text-sm italic leading-relaxed text-[#A9A398]",
  showKana = true,
  showRomaji = true,
  showKanaForKanaOnly = false,
  allowIndexFallback = false,
}: Props) {
  const reading = html !== undefined
    ? extractKanaFromRubyHtml(html, allowIndexFallback)
    : extractKanaFromReactNode(children, allowIndexFallback);
  const showKanaLine = Boolean(reading && showKana && (reading.hasKanji || showKanaForKanaOnly));
  const romaji = reading && showRomaji ? toRomaji(reading.kana) : "";

  return (
    <span className="block min-w-0">
      {html !== undefined ? (
        <span className={reading ? contentClassName : undefined} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <span className={reading ? contentClassName : undefined}>{children}</span>
      )}
      {showKanaLine && reading && <span className={kanaClassName + " block"}>（{reading.kana}）</span>}
      {romaji && <span className={romajiClassName + " block"}>{romaji}</span>}
    </span>
  );
}