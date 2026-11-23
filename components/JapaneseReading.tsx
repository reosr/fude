
"use client";

import { toRomaji } from "wanakana";
import { extractKanaFromRubyHtml } from "@/lib/japanese-text";

interface Props {
  html: string;
  contentClassName?: string;
  kanaClassName?: string;
  romajiClassName?: string;
  showKana?: boolean;
  showRomaji?: boolean;
  showKanaForKanaOnly?: boolean;
}

export default function JapaneseReading({
  html,
  contentClassName = "font-mincho text-lg leading-[2.2] text-[#F1EBDD]",
  kanaClassName = "mt-1 font-mincho text-sm leading-relaxed text-[#D6AD4F]",
  romajiClassName = "mt-1 text-xs italic leading-relaxed text-[#A9A398]",
  showKana = true,
  showRomaji = true,
  showKanaForKanaOnly = false,
}: Props) {
  const reading = extractKanaFromRubyHtml(html);
  const showKanaLine = Boolean(reading && showKana && (reading.hasKanji || showKanaForKanaOnly));
  const romaji = reading && showRomaji ? toRomaji(reading.kana) : "";

  return (
    <div className="min-w-0">
      <div className={contentClassName} dangerouslySetInnerHTML={{ __html: html }} />
      {showKanaLine && reading && <p className={kanaClassName}>（{reading.kana}）</p>}
      {romaji && <p className={romajiClassName}>{romaji}</p>}
    </div>
  );
}
