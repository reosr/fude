
import { Children, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";

export interface JapaneseReadingResult {
  kana: string;
  hasKanji: boolean;
}

const KANJI_RE = /[\u3400-\u4dbf\u4e00-\u9fff々〆ヵヶ]/;
const KANA_RE = /[\u3040-\u30ff]/;

function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function preserveKanaOnly(value: string): string {
  return Array.from(value).filter((char) => !KANJI_RE.test(char)).join("");
}

export function extractKanaFromRubyHtml(html: string): JapaneseReadingResult | null {
  const rubyPattern = /<ruby\b[^>]*>([\s\S]*?)<\/ruby>/gi;
  let cursor = 0;
  let kana = "";
  let hasKanji = false;
  let complete = true;
  let match: RegExpExecArray | null;

  while ((match = rubyPattern.exec(html)) !== null) {
    const outside = stripHtml(html.slice(cursor, match.index));
    if (KANJI_RE.test(outside)) complete = false;
    if (outside) kana += outside;

    const body = match[1];
    const rtMatch = /<rt\b[^>]*>([\s\S]*?)<\/rt>/i.exec(body);
    if (!rtMatch) {
      const plain = stripHtml(body);
      if (KANJI_RE.test(plain)) complete = false;
      kana += plain;
      cursor = rubyPattern.lastIndex;
      continue;
    }

    const before = stripHtml(body.slice(0, rtMatch.index));
    const after = stripHtml(body.slice(rtMatch.index + rtMatch[0].length));
    hasKanji = hasKanji || KANJI_RE.test(before);
    if (KANJI_RE.test(after)) complete = false;

    kana += preserveKanaOnly(before);
    kana += stripHtml(rtMatch[1]);
    kana += after;
    cursor = rubyPattern.lastIndex;
  }

  const tail = stripHtml(html.slice(cursor));
  if (KANJI_RE.test(tail)) complete = false;
  kana += tail;

  if (!complete) return null;
  const normalized = kana.replace(/\s+/g, " ").trim();
  if (!normalized || (!hasKanji && !KANA_RE.test(normalized))) return null;

  return { kana: normalized, hasKanji };
}

interface NodeReading {
  kana: string;
  hasKanji: boolean;
  complete: boolean;
}

function readReactNode(node: ReactNode): NodeReading {
  if (node === null || node === undefined || typeof node === "boolean") {
    return { kana: "", hasKanji: false, complete: true };
  }
  if (typeof node === "string" || typeof node === "number") {
    const value = String(node);
    return { kana: value, hasKanji: KANJI_RE.test(value), complete: !KANJI_RE.test(value) };
  }
  if (Array.isArray(node)) {
    return node.reduce<NodeReading>((result, child) => {
      const next = readReactNode(child);
      return {
        kana: result.kana + next.kana,
        hasKanji: result.hasKanji || next.hasKanji,
        complete: result.complete && next.complete,
      };
    }, { kana: "", hasKanji: false, complete: true });
  }
  if (!isValidElement(node)) return { kana: "", hasKanji: false, complete: true };

  const element = node as ReactElement<{ children?: ReactNode }>;
  const children = Children.toArray(element.props.children);

  if (element.type === "rt") return readReactNode(element.props.children);

  if (element.type === "ruby") {
    const rtIndex = children.findIndex((child) => isValidElement(child) && child.type === "rt");
    if (rtIndex < 0) {
      return children.reduce<NodeReading>((result, child) => {
        const next = readReactNode(child);
        return {
          kana: result.kana + next.kana,
          hasKanji: result.hasKanji || next.hasKanji,
          complete: result.complete && next.complete,
        };
      }, { kana: "", hasKanji: false, complete: true });
    }

    const before = children.slice(0, rtIndex).map((child) => preserveKanaOnly(readReactNode(child).kana)).join("");
    const rubyReading = readReactNode(children[rtIndex]);
    const after = children.slice(rtIndex + 1).reduce<NodeReading>((result, child) => {
      const next = readReactNode(child);
      return {
        kana: result.kana + next.kana,
        hasKanji: result.hasKanji || next.hasKanji,
        complete: result.complete && next.complete,
      };
    }, { kana: "", hasKanji: false, complete: true });

    return {
      kana: before + rubyReading.kana + after.kana,
      hasKanji: true,
      complete: after.complete,
    };
  }

  return readReactNode(element.props.children);
}

export function extractKanaFromReactNode(node: ReactNode): JapaneseReadingResult | null {
  const result = readReactNode(node);
  if (!result.complete) return null;
  const kana = result.kana.replace(/\s+/g, " ").trim();
  if (!kana || (!result.hasKanji && !KANA_RE.test(kana))) return null;
  return { kana, hasKanji: result.hasKanji };
}

const GRAMMAR_LABELS: Record<string, string> = {
  N: "kata benda",
  V: "kata kerja",
  A: "kata sifat",
  S: "kalimat",
};

export function formatGrammarNotation(value: string): string {
  return value.replace(
    /(^|[^\\p{L}\\p{N}])([NVAS])(\\d*)(?=$|[^\\p{L}\\p{N}]|[ぁ-ゖァ-ヶ一-龯々])/gu,
    (_match, prefix: string, symbol: string, number: string, offset: number, whole: string) => {
      const nextChar = whole[offset + prefix.length + symbol.length + number.length] ?? "";
      const isJapaneseSuffix = /[ぁ-ゖァ-ヶ一-龯々]/.test(nextChar);
      const label = GRAMMAR_LABELS[symbol];
      const formatted = isJapaneseSuffix && !number
        ? (symbol === "V" ? "bentuk kata kerja" : symbol === "A" ? "bentuk kata sifat" : label)
        : label + (number ? " " + number : "");
      return prefix + formatted + (isJapaneseSuffix ? " " : "");
    }
  );
}
