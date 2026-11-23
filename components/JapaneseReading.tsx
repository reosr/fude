
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
}

export default function JapaneseReading({
  html,
  children,
  contentClassName = "font-mincho text-lg leading-[2.2] text-[#F1EBDD]",
  kanaClassName = "mt-1 font-mincho text-sm leading-relaxed text-[#D6AD4F]",
  romajiClassName = "mt-1 text-xs italic leading-relaxed text-[#A9A398]",
  showKana = true,
  showRomaji = true,
  showKanaForKanaOnly = false,
}: Props) {
  const reading = html !== undefined ? extractKanaFromRubyHtml(html) : extractKanaFromReactNode(children);
  const showKanaLine = Boolean(reading && showKana && (reading.hasKanji || showKanaForKanaOnly));
  const romaji = reading && showRomaji ? toRomaji(reading.kana) : "";

  return (
    <span className="block min-w-0">
      {html !== undefined ? (
        <span className={contentClassName} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <span className={contentClassName}>{children}</span>
      )}
      {showKanaLine && reading && <p className={kanaClassName}>（{reading.kana}）</p>}
      {romaji && <p className={romajiClassName}>{romaji}</p>}
    </span>
  );
}