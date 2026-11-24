"use client";

import { toHiragana, toRomaji } from "wanakana";
import { cloneElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import { addRubyFromParentheticalReadings, addRubyFromReadingIndex, extractKanaFromReactNode, extractKanaFromRubyHtml, segmentTextByReadingIndex } from "@/lib/japanese-text";

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

function getNodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join(" ");
  if (!isValidElement(node)) return "";

  const element = node as ReactElement<{ children?: ReactNode }>;
  return getNodeText(element.props.children);
}

interface KanaReadingChunk {
  kana: string;
  fromRuby: boolean;
}

function collectKanaReadingChunks(
  node: ReactNode,
  allowIndexFallback: boolean
): KanaReadingChunk[] {
  if (node === null || node === undefined || typeof node === "boolean") return [];

  if (typeof node === "string" || typeof node === "number") {
    const source = String(node);
    const reading = extractKanaFromReactNode(source, allowIndexFallback);
    return [{ kana: reading?.kana ?? source, fromRuby: false }];
  }

  if (Array.isArray(node)) {
    return node.flatMap((child) => collectKanaReadingChunks(child, allowIndexFallback));
  }

  if (!isValidElement(node)) return [];

  const element = node as ReactElement<{ children?: ReactNode }>;
  if (element.type === "ruby") {
    const reading = extractKanaFromReactNode(node, allowIndexFallback);
    return [{ kana: reading?.kana ?? getNodeText(node), fromRuby: true }];
  }
  if (element.type === "rt") return [];

  return collectKanaReadingChunks(element.props.children, allowIndexFallback);
}

function normalizeKanaForRomaji(source: string): string {
  return source
    .replace(/こんにちは/g, "こんにちわ")
    .replace(/こんばんは/g, "こんばんわ")
    .replace(
      /(これ|それ|あれ|どれ|ここ|そこ|あそこ|どこ|わたし|わたしたち|わたくし|ぼく|ぼくたち|かれ|かれら|かのじょ|みんな|みなさん|あなた|おまえ|なに|きょう|あした|きのう)は/g,
      "$1わ"
    )
    .replace(/(ここ|そこ|あそこ|どこ)へ/g, "$1え")
    .replace(/を/g, "お");
}

function getKanaForRomajiFromNode(node: ReactNode, allowIndexFallback: boolean): string {
  const readingNode = allowIndexFallback ? renderJapaneseNodeWithRuby(node) : node;
  const chunks = collectKanaReadingChunks(readingNode, allowIndexFallback);
  let result = "";
  let previousWasRuby = false;

  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    if (chunk.fromRuby) {
      result += chunk.kana;
      previousWasRuby = true;
      continue;
    }

    let kana = chunk.kana;
    if (previousWasRuby) {
      const nextChunk = chunks[index + 1];
      const nextRubyStartsWithLexicalHa = Boolean(
        nextChunk?.fromRuby && nextChunk.kana.startsWith("は")
      );

      if (!nextRubyStartsWithLexicalHa) {
        // は／へ yang berdiri setelah kata ber-furigana adalah partikel arah/topik.
        kana = kana.replace(
          /^(\\s*(?:(?:さん|ちゃん|くん|さま))?)(は|へ)/,
          (_match, prefix: string, particle: string) => prefix + (particle === "は" ? "わ" : "え")
        );
        // Partikel majemuk seperti ではありません dan にはいます tetap dikenali.
        kana = kana.replace(
          /^(\\s*(?:で|に|と|から|まで|より|の|だけ|しか|さえ|て))は/,
          (_match, prefix: string) => prefix + "わ"
        );
      }
    }

    result += normalizeKanaForRomaji(kana);
    if (kana.trim()) previousWasRuby = false;
  }

  return result;
}

function containsIndonesianProse(source: string): boolean {
  const plainText = source
    .replace(/<rt\b[^>]*>[\s\S]*?<\/rt>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g, " ");
  const latinLetters = (plainText.match(/[A-Za-z]/g) ?? []).length;
  const japaneseCharacters = (plainText.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff々〆ヵヶ]/g) ?? []).length;

  // Teks penjelasan berbahasa Indonesia dapat menyisipkan contoh Jepang.
  // Jangan mengubah seluruh paragraf tersebut menjadi kana/romaji; furigana
  // pada bagian Jepang tetap ditangani oleh indeks bacaan.
  const isLongIndonesianExplanation =
    latinLetters >= 20 && latinLetters > japaneseCharacters * 1.1;
  const isShortMixedNotation =
    latinLetters >= 5 &&
    japaneseCharacters > 0 &&
    latinLetters / (latinLetters + japaneseCharacters) >= 0.35;

  // Notasi pendek seperti "V-ます → buang ます + たいです" juga merupakan
  // teks campuran. Baris kana/romaji untuk teks semacam ini akan menyesatkan.
  return isLongIndonesianExplanation || isShortMixedNotation;
}

function renderJapaneseNodeWithRuby(node: ReactNode, keyPrefix = "reading"): ReactNode {
  if (typeof node === "string") {
    const segments = segmentTextByReadingIndex(node);
    if (!segments.some((segment) => segment.reading)) return node;

    return segments.map((segment, index) =>
      segment.reading ? (
        <ruby key={keyPrefix + "-" + index}>
          {segment.text}
          <rt>{segment.reading}</rt>
        </ruby>
      ) : segment.text
    );
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => renderJapaneseNodeWithRuby(child, keyPrefix + "-" + index));
  }

  if (!isValidElement(node)) return node;

  const element = node as ReactElement<{
    children?: ReactNode;
    dangerouslySetInnerHTML?: unknown;
  }>;

  // Jangan mengubah ruby yang sudah disediakan data, elemen <rt>, atau HTML
  // yang memang dikelola langsung oleh pemanggil.
  if (
    element.type === "ruby" ||
    element.type === "rt" ||
    element.props.dangerouslySetInnerHTML
  ) {
    return node;
  }

  return cloneElement(
    element,
    {},
    renderJapaneseNodeWithRuby(element.props.children, keyPrefix)
  );
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
  // Kosakata yang seluruh karakter utamanya berupa kanji dapat memakai
  // bacaan eksplisit dari data kosakata. Ini menjaga variasi kontekstual
  // seperti 何（なに／なん）agar furigana mengikuti entri yang sedang dibaca.
  const explicitWordHtml =
    html === undefined &&
    typeof children === "string" &&
    Boolean(explicitKana?.trim()) &&
    /[\u3400-\u4dbf\u4e00-\u9fff々〆ヵヶ]/.test(children) &&
    !/[ぁ-ゖァ-ヺー]/.test(children)
      ? `<ruby>${escapeHtmlText(children)}<rt>${escapeHtmlText(explicitKana!.trim())}</rt></ruby>`
      : undefined;

  const sourceHtml = html !== undefined
    ? html
    : explicitWordHtml ??
      (allowIndexFallback && (typeof children === "string" || typeof children === "number")
        ? escapeHtmlText(String(children))
        : undefined);
  const displayHtml = sourceHtml !== undefined && allowIndexFallback
    ? addRubyFromReadingIndex(addRubyFromParentheticalReadings(sourceHtml))
    : sourceHtml;
  const extractedReading = displayHtml !== undefined
    ? extractKanaFromRubyHtml(displayHtml, allowIndexFallback)
    : extractKanaFromReactNode(children, allowIndexFallback);

  const sourceTextForReadingCheck =
    html !== undefined
      ? html
      : getNodeText(children);
  const hasMixedLanguageProse = containsIndonesianProse(sourceTextForReadingCheck);

  const rawKana = explicitKana?.trim() || extractedReading?.kana || "";
  const normalizedKana = rawKana ? toHiragana(rawKana) : "";

  // WanaKana membaca kana secara harfiah. Untuk romaji kalimat, sesuaikan
  // partikel は・へ・を yang dapat dikenali dari batas ruby dan pola umum.
  // Teks Jepang yang ditampilkan tidak diubah; penyesuaian hanya untuk romaji.
  const kanaForRomaji = (() => {
    if (explicitKana?.trim()) return normalizedKana;

    if (displayHtml !== undefined) {
      const particleAwareHtml = displayHtml
        .replace(/<\\/ruby>(\\s*)は/g, "</ruby>$1わ")
        .replace(/<\\/ruby>(\\s*)へ/g, "</ruby>$1え")
        .replace(/こんにちは/g, "こんにちわ")
        .replace(/こんばんは/g, "こんばんわ")
        .replace(/を/g, "お");

      return extractKanaFromRubyHtml(particleAwareHtml, allowIndexFallback)?.kana ||
        normalizedKana;
    }

    return getKanaForRomajiFromNode(children, allowIndexFallback) || normalizedKana;
  })();
  const romanization =
    explicitRomaji?.trim() || (kanaForRomaji ? toRomaji(kanaForRomaji) : "");
  const showKanaLine = Boolean(
    showKana &&
    !hasMixedLanguageProse &&
    normalizedKana &&
    (explicitKana?.trim() || extractedReading?.hasKanji || showKanaForKanaOnly)
  );
  const hasTranslation = translation !== undefined && translation !== null && translation !== "";

  return (
    <span className="block min-w-0">
      {showOriginal && (
        html !== undefined || displayHtml !== undefined ? (
          <span
            className={contentClassName}
            dangerouslySetInnerHTML={{ __html: displayHtml ?? html ?? "" }}
          />
        ) : (
          <span className={contentClassName}>
            {allowIndexFallback ? renderJapaneseNodeWithRuby(children) : children}
          </span>
        )
      )}
      {showKanaLine && (
        <span className={kanaClassName + " block"}>（{normalizedKana}）</span>
      )}
      {showRomaji && !hasMixedLanguageProse && romanization && (
        <span className={romajiClassName + " block"}>{romanization}</span>
      )}
      {showTranslation && hasTranslation && (
        <span className={translationClassName + " block"}>{translation}</span>
      )}
    </span>
  );
}
