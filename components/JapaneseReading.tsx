"use client";

import { toHiragana, toRomaji } from "wanakana";
import type { ReactNode } from "react";
import { addRubyFromParentheticalReadings, extractKanaFromReactNode, extractKanaFromRubyHtml } from "@/lib/japanese-text";

interface Props {
  html?: string;
  children?: ReactNode;
  /** Bacaan hiragana eksplisit dari data kosakata atau materi. */
  kana?: string;
  /** Romaji eksplisit; jika tidak diberikan, dibuat dari hiragana. */
  romaji?: string;
  /** Arti atau terjemahan bahasa Indonesia. */
  translation?: ReactNode;
  contentClassName?: string;
  kanaClassName?: string;
  romajiClassName?: string;
  translationClassName?: string;
  showOriginal?: boolean;
  showKana?: boolean;
  showRomaji?: boolean;
  showTranslation?: boolean;
  showKanaForKanaOnly?: boolean;
  allowIndexFallback?: boolean;
}

export default function JapaneseReading({
  html,
  children,
  kana: explicitKana,
  romaji: explicitRomaji,
  translation,
  contentClassName = "font-mincho text-lg leading-[2.2] text-[#F1EBDD]",
  kanaClassName = "mt-2 font-mincho text-lg leading-relaxed text-[#D6AD4F]",
  romajiClassName = "mt-1 text-base italic leading-relaxed text-[#A9A398]",
  translationClassName = "mt-3 text-base leading-7 text-[#A3A099]",
  showOriginal = true,
  showKana = true,
  showRomaji = true,
  showTranslation = true,
  showKanaForKanaOnly = false,
  allowIndexFallback = false,
}: Props) {
  // Bacaan eksplisit dalam tanda kurung seperti 分（ふん／ぷん）
  // dirender sebagai ruby sebelum bacaan lengkap dihitung.
  const displayHtml = html !== undefined
    ? addRubyFromParentheticalReadings(html)
    : undefined;
  const extractedReading = displayHtml !== undefined
    ? extractKanaFromRubyHtml(displayHtml, allowIndexFallback)
    : extractKanaFromReactNode(children, allowIndexFallback);

  const rawKana = explicitKana?.trim() || extractedReading?.kana || "";
  const normalizedKana = rawKana ? toHiragana(rawKana) : "";
  const hasReading = Boolean(normalizedKana);
  const romanization = explicitRomaji?.trim() || (normalizedKana ? toRomaji(normalizedKana) : "");
  const showKanaLine = Boolean(
    showKana &&
    normalizedKana &&
    (explicitKana?.trim() || extractedReading?.hasKanji || showKanaForKanaOnly)
  );
  const hasTranslation = translation !== undefined && translation !== null && translation !== "";

  return (
    <span className="block min-w-0">
      {showOriginal && (
        html !== undefined ? (
          <span
            className={hasReading ? contentClassName : undefined}
            dangerouslySetInnerHTML={{ __html: displayHtml ?? html }}
          />
        ) : (
          <span className={hasReading ? contentClassName : undefined}>{children}</span>
        )
      )}
      {showKanaLine && (
        <span className={kanaClassName + " block"}>（{normalizedKana}）</span>
      )}
      {showRomaji && romanization && (
        <span className={romajiClassName + " block"}>{romanization}</span>
      )}
      {showTranslation && hasTranslation && (
        <span className={translationClassName + " block"}>{translation}</span>
      )}
    </span>
  );
}
