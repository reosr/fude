"use client";

import { toHiragana, toRomaji } from "wanakana";
import type { ReactNode } from "react";
import { addRubyFromParentheticalReadings, addRubyFromReadingIndex, extractKanaFromReactNode, extractKanaFromRubyHtml } from "@/lib/japanese-text";

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

function escapeHtmlText(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (char) => entities[char] ?? char);
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
  // String biasa juga dapat diberi ruby, tetapi hanya saat fallback bacaan
  // diizinkan. Soal yang menguji bacaan/penulisan kanji tetap menampilkan target
  // tanpa petunjuk otomatis agar jawabannya tidak bocor.
  const sourceHtml = html !== undefined
    ? html
    : allowIndexFallback && (typeof children === "string" || typeof children === "number")
      ? escapeHtmlText(String(children))
      : undefined;
  const displayHtml = sourceHtml !== undefined && allowIndexFallback
    ? addRubyFromReadingIndex(addRubyFromParentheticalReadings(sourceHtml))
    : sourceHtml;
  const extractedReading = displayHtml !== undefined
    ? extractKanaFromRubyHtml(displayHtml, allowIndexFallback)
    : extractKanaFromReactNode(children, allowIndexFallback);

  const rawKana = explicitKana?.trim() || extractedReading?.kana || "";
  const normalizedKana = rawKana ? toHiragana(rawKana) : "";
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
            className={contentClassName}
            dangerouslySetInnerHTML={{ __html: displayHtml ?? html }}
          />
        ) : (
          <span className={contentClassName}>{children}</span>
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
