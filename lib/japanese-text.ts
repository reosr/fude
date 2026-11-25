import { Children, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import readingIndex from "@/data/japanese-reading-index.json";

export interface JapaneseReadingResult {
  kana: string;
  hasKanji: boolean;
}

const KANJI_RE = /[\u3400-\u4dbf\u4e00-\u9fff々〆ヵヶ]/;
const KANA_RE = /[\u3040-\u30ff]/;
const KANA_ALIGNMENT_RE = /^[\u3040-\u309f\u30a0-\u30ffー]+$/u;

export interface JapaneseReadingSegment {
  text: string;
  reading?: string;
}

function normalizeKanaForAlignment(value: string): string {
  return Array.from(value, (character) => {
    const code = character.codePointAt(0) ?? 0;
    return code >= 0x30a1 && code <= 0x30f6
      ? String.fromCodePoint(code - 0x60)
      : character;
  }).join("");
}

/**
 * Pecah satu entri indeks menjadi ruby khusus kanji dan teks kana biasa.
 * Jika posisi okurigana tidak bisa dipastikan secara unik, jangan membuat ruby.
 */
function splitWordByReading(
  word: string,
  reading: string
): JapaneseReadingSegment[] | null {
  if (!word || !reading || KANJI_RE.test(reading)) return null;

  const parts: Array<{ type: "kanji" | "kana"; text: string; normalized: string }> = [];
  for (const character of Array.from(word)) {
    const type = KANJI_RE.test(character)
      ? "kanji"
      : KANA_ALIGNMENT_RE.test(character)
        ? "kana"
        : null;

    if (!type) return null;

    const normalized = type === "kana"
      ? normalizeKanaForAlignment(character)
      : character;
    const previous = parts[parts.length - 1];

    if (previous?.type === type) {
      previous.text += character;
      previous.normalized += normalized;
    } else {
      parts.push({ type, text: character, normalized });
    }
  }

  if (!parts.some((part) => part.type === "kanji")) return null;

  // Kata yang seluruhnya kanji tetap dapat memakai bacaan lengkap, termasuk
  // entri yang menyediakan beberapa variasi bacaan.
  if (parts.every((part) => part.type === "kanji")) {
    return [{ text: word, reading }];
  }

  const normalizedReading = normalizeKanaForAlignment(reading);
  if (!KANA_ALIGNMENT_RE.test(normalizedReading)) return null;

  type AlignmentResult = {
    count: number;
    segments?: JapaneseReadingSegment[];
  };
  const memo = new Map<string, AlignmentResult>();

  const solve = (partIndex: number, readingIndex: number): AlignmentResult => {
    const key = partIndex + ":" + readingIndex;
    const cached = memo.get(key);
    if (cached) return cached;

    if (partIndex >= parts.length) {
      const result = readingIndex === normalizedReading.length
        ? { count: 1, segments: [] }
        : { count: 0 };
      memo.set(key, result);
      return result;
    }

    const part = parts[partIndex];

    if (part.type === "kana") {
      if (!normalizedReading.startsWith(part.normalized, readingIndex)) {
        const result = { count: 0 };
        memo.set(key, result);
        return result;
      }

      const tail = solve(partIndex + 1, readingIndex + part.normalized.length);
      const result = tail.count > 0
        ? { count: tail.count, segments: [{ text: part.text }, ...(tail.segments ?? [])] }
        : { count: 0 };
      memo.set(key, result);
      return result;
    }

    const nextPart = parts[partIndex + 1];
    let boundaries: number[] = [];

    if (!nextPart) {
      boundaries = [normalizedReading.length];
    } else if (nextPart.type === "kana") {
      let position = normalizedReading.indexOf(nextPart.normalized, readingIndex + 1);
      while (position >= 0) {
        boundaries.push(position);
        position = normalizedReading.indexOf(nextPart.normalized, position + 1);
      }
    }

    let solutionCount = 0;
    let uniqueSegments: JapaneseReadingSegment[] | undefined;

    for (const boundary of boundaries) {
      if (boundary <= readingIndex) continue;

      const tail = solve(partIndex + 1, boundary);
      if (tail.count === 0) continue;

      solutionCount += tail.count;
      if (solutionCount === 1) {
        uniqueSegments = [
          { text: part.text, reading: normalizedReading.slice(readingIndex, boundary) },
          ...(tail.segments ?? []),
        ];
      } else {
        // Lebih dari satu pembagian bacaan berarti ambigu; hindari ruby yang salah.
        solutionCount = 2;
        uniqueSegments = undefined;
        break;
      }
    }

    const result = { count: solutionCount, segments: uniqueSegments };
    memo.set(key, result);
    return result;
  };

  const aligned = solve(0, 0);
  return aligned.count === 1 ? aligned.segments ?? null : null;
}

const READING_ENTRIES = Object.entries(readingIndex as Record<string, string>)
  .filter(([word, reading]) =>
    word.length > 0 &&
    KANJI_RE.test(word) &&
    typeof reading === "string" &&
    reading.length > 0 &&
    !KANJI_RE.test(reading)
  )
  .sort(([a], [b]) => b.length - a.length);

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

// Ubah petunjuk bacaan dalam tanda kurung menjadi furigana pada kanji saja.
// Okurigana tetap berada di teks utama, misalnya 来ます（きます） menjadi
// <ruby>来<rt>き</rt></ruby>ます. Jika batas katanya tidak jelas, biarkan apa adanya.
export function addRubyFromParentheticalReadings(value: string): string {
  return value.replace(
    /([おご]?[\u3400-\u4dbf\u4e00-\u9fff々〆ヵヶ]+[ぁ-ゖァ-ヺー]*)[（(]([ぁ-ゖァ-ヺー]+)[）)]/g,
    (match, base: string, reading: string, offset: number, source: string) => {
      const previous = offset > 0 ? source[offset - 1] : "";
      if (previous && /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff々〆ヵヶ]/u.test(previous)) {
        return match;
      }

      const segments = splitWordByReading(base, reading);
      if (!segments) return match;

      return segments.map((segment) =>
        segment.reading
          ? `<ruby>${escapeRubyText(segment.text)}<rt>${escapeRubyText(segment.reading)}</rt></ruby>`
          : segment.text
      ).join("");
    }
  );
}

const READINGS_BY_INITIAL = READING_ENTRIES.reduce((map, entry) => {
  const initial = entry[0][0];
  const current = map.get(initial) ?? [];
  current.push(entry);
  map.set(initial, current);
  return map;
}, new Map<string, Array<[string, string]>>());

function escapeRubyText(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (char) => entities[char] ?? char);
}

/** Pecah teks menjadi bagian biasa dan kata yang punya bacaan terverifikasi. */
export function segmentTextByReadingIndex(value: string): JapaneseReadingSegment[] {
  const segments: JapaneseReadingSegment[] = [];
  let plain = "";
  let cursor = 0;

  while (cursor < value.length) {
    const candidates = READINGS_BY_INITIAL.get(value[cursor]);
    const matched = candidates?.find(([word, reading]) => {
      if (!value.startsWith(word, cursor)) return false;

      // Bacaan satu kanji sering berubah ketika menjadi bagian kata majemuk
      // (contoh 上手, 何人, 今年). Jangan tempelkan bacaan kata tunggal di
      // tengah gabungan kanji/angka; gunakan entri kata lengkap jika tersedia.
      if (Array.from(word).length === 1 && KANJI_RE.test(word)) {
        const previous = cursor > 0 ? value[cursor - 1] : "";
        const next = value[cursor + word.length] ?? "";
        const isKanjiOrNumber = (char: string) =>
          Boolean(char) && (KANJI_RE.test(char) || /[0-9０-９]/.test(char));

        if (isKanjiOrNumber(previous) || isKanjiOrNumber(next)) return false;
      }

      return Boolean(splitWordByReading(word, reading));
    });

    if (matched) {
      if (plain) {
        segments.push({ text: plain });
        plain = "";
      }
      const matchedSegments = splitWordByReading(matched[0], matched[1]);
      if (matchedSegments) segments.push(...matchedSegments);
      cursor += matched[0].length;
    } else {
      plain += value[cursor];
      cursor += 1;
    }
  }

  if (plain) segments.push({ text: plain });
  return segments;
}

/**
 * Tambahkan furigana dari indeks bacaan terverifikasi pada bagian teks yang
 * belum memiliki ruby. Tag HTML dan ruby yang sudah ditulis di data tetap utuh.
 */
export function addRubyFromReadingIndex(value: string): string {
  const fragments = value.split(/(<[^>]+>)/g);
  let rubyDepth = 0;

  return fragments.map((fragment) => {
    if (fragment.startsWith("<") && fragment.endsWith(">")) {
      const tag = /^<\s*(\/?)\s*([a-z][a-z0-9-]*)/i.exec(fragment);
      if (tag?.[2].toLowerCase() === "ruby") {
        rubyDepth = tag[1] ? Math.max(0, rubyDepth - 1) : rubyDepth + 1;
      }
      return fragment;
    }

    if (rubyDepth > 0) return fragment;

    return segmentTextByReadingIndex(fragment).map((segment) =>
      segment.reading
        ? `<ruby>${escapeRubyText(segment.text)}<rt>${escapeRubyText(segment.reading)}</rt></ruby>`
        : segment.text
    ).join("");
  }).join("");
}

function preserveKanaOnly(value: string): string {
  return Array.from(value).filter((char) => !KANJI_RE.test(char)).join("");
}

function readPlainText(value: string, allowIndexFallback: boolean): JapaneseReadingResult | null {
  const original = stripHtml(value).normalize("NFC");
  const hasKanji = KANJI_RE.test(original);

  if (!hasKanji) {
    if (/[A-Za-z]{3,}/.test(original)) return null;
    const normalized = original.replace(/\s+/g, " ").trim();
    return normalized && KANA_RE.test(normalized)
      ? { kana: normalized, hasKanji: false }
      : null;
  }

  // Terima format bacaan dalam kurung, misalnya 来（き） atau 十歳（じゅっさい）.
  // Ini juga dipakai pada penjelasan yang tidak seluruhnya ditulis dengan tag ruby.
  const withExplicitReadings = original.replace(
    /([おご]?[\u3400-\u4dbf\u4e00-\u9fff々〆ヵヶ]+[ぁ-ゖァ-ヺー]*)[（(]([ぁ-ゖァ-ヺー／/・、,]+)[）)]/g,
    (match, _base: string, reading: string, offset: number, source: string) => {
      const previous = offset > 0 ? source[offset - 1] : "";
      if (previous && /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff々〆ヵヶ]/u.test(previous)) {
        return match;
      }
      return reading;
    }
  );

  // Baca ekspresi angka + penghitung yang memiliki bacaan khusus
  // sebelum angka dibuang dari jalur fallback (misalnya 1分、4月、3万円).
  const withNumericReadings = READING_ENTRIES.reduce(
    (text, [word, reading]) =>
      /[0-9０-９]/.test(word) ? text.replaceAll(word, reading) : text,
    withExplicitReadings
  );

  const japaneseOnly = withNumericReadings
    .replace(/[A-Za-z][A-Za-z0-9._'-]*/g, " ")
    .replace(/[0-9０-９]+/g, " ");

  if (!KANJI_RE.test(japaneseOnly)) {
    const normalized = japaneseOnly.replace(/\s+/g, " ").trim();
    return normalized ? { kana: normalized, hasKanji: true } : null;
  }

  if (!allowIndexFallback) return null;

  // Gunakan aturan segmentasi yang sama dengan renderer ruby agar baris kana
  // tidak memakai bacaan satu-kanji yang berbeda atau keliru di kata majemuk.
  const segments = segmentTextByReadingIndex(japaneseOnly);
  if (segments.some((segment) => KANJI_RE.test(segment.text))) return null;

  const kana = segments.map((segment) => segment.reading ?? segment.text).join("");
  const normalized = kana.replace(/\s+/g, " ").trim();
  return normalized ? { kana: normalized, hasKanji: true } : null;
}

export function extractKanaFromRubyHtml(
  html: string,
  allowIndexFallback = false
): JapaneseReadingResult | null {
  const rubyPattern = /<ruby\b[^>]*>([\s\S]*?)<\/ruby>/gi;
  let cursor = 0;
  let kana = "";
  let hasKanji = false;
  let complete = true;
  let match: RegExpExecArray | null;

  while ((match = rubyPattern.exec(html)) !== null) {
    const outside = stripHtml(html.slice(cursor, match.index));
    const outsideReading = readPlainText(outside, allowIndexFallback);

    if (KANJI_RE.test(outside) && !outsideReading) complete = false;
    kana += outsideReading?.kana ?? outside;

    const body = match[1];
    const rtMatch = /<rt\b[^>]*>([\s\S]*?)<\/rt>/i.exec(body);

    if (!rtMatch) {
      const plain = stripHtml(body);
      const plainReading = readPlainText(plain, allowIndexFallback);
      if (KANJI_RE.test(plain) && !plainReading) complete = false;
      kana += plainReading?.kana ?? plain;
      cursor = rubyPattern.lastIndex;
      continue;
    }

    const before = stripHtml(body.slice(0, rtMatch.index));
    const after = stripHtml(body.slice(rtMatch.index + rtMatch[0].length));
    hasKanji = hasKanji || KANJI_RE.test(before);

    const afterReading = readPlainText(after, allowIndexFallback);
    if (KANJI_RE.test(after) && !afterReading) complete = false;

    kana += preserveKanaOnly(before);
    kana += stripHtml(rtMatch[1]);
    kana += afterReading?.kana ?? after;
    cursor = rubyPattern.lastIndex;
  }

  const tail = stripHtml(html.slice(cursor));
  const tailReading = readPlainText(tail, allowIndexFallback);
  if (KANJI_RE.test(tail) && !tailReading) complete = false;
  kana += tailReading?.kana ?? tail;

  if (!complete) return null;

  const normalized = kana.replace(/\s+/g, " ").trim();
  if (!normalized || (!hasKanji && !KANJI_RE.test(html) && !KANA_RE.test(normalized))) return null;

  return { kana: normalized, hasKanji: hasKanji || KANJI_RE.test(html) };
}

interface NodeReading {
  kana: string;
  hasKanji: boolean;
  complete: boolean;
}

function readReactNode(node: ReactNode, allowIndexFallback: boolean): NodeReading {
  if (node === null || node === undefined || typeof node === "boolean") {
    return { kana: "", hasKanji: false, complete: true };
  }

  if (typeof node === "string" || typeof node === "number") {
    const value = String(node);
    const reading = readPlainText(value, allowIndexFallback);
    return {
      kana: reading?.kana ?? preserveKanaOnly(value),
      hasKanji: KANJI_RE.test(value),
      complete: !KANJI_RE.test(value) || Boolean(reading),
    };
  }

  if (Array.isArray(node)) {
    return node.reduce<NodeReading>((result, child) => {
      const next = readReactNode(child, allowIndexFallback);
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

  if (element.type === "rt") return readReactNode(element.props.children, allowIndexFallback);

  if (element.type === "ruby") {
    const rtIndex = children.findIndex((child) => isValidElement(child) && child.type === "rt");

    if (rtIndex < 0) {
      return children.reduce<NodeReading>((result, child) => {
        const next = readReactNode(child, allowIndexFallback);
        return {
          kana: result.kana + next.kana,
          hasKanji: result.hasKanji || next.hasKanji,
          complete: result.complete && next.complete,
        };
      }, { kana: "", hasKanji: false, complete: true });
    }

    const before = children
      .slice(0, rtIndex)
      .map((child) => preserveKanaOnly(readReactNode(child, allowIndexFallback).kana))
      .join("");
    const rubyReading = readReactNode(children[rtIndex], allowIndexFallback);
    const after = children.slice(rtIndex + 1).reduce<NodeReading>((result, child) => {
      const next = readReactNode(child, allowIndexFallback);
      return {
        kana: result.kana + next.kana,
        hasKanji: result.hasKanji || next.hasKanji,
        complete: result.complete && next.complete,
      };
    }, { kana: "", hasKanji: false, complete: true });

    return {
      kana: before + rubyReading.kana + after.kana,
      hasKanji: true,
      complete: rubyReading.complete && after.complete,
    };
  }

  return readReactNode(element.props.children, allowIndexFallback);
}

export function extractKanaFromReactNode(
  node: ReactNode,
  allowIndexFallback = false
): JapaneseReadingResult | null {
  const result = readReactNode(node, allowIndexFallback);
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

const VERB_NOTATION_FORMS: Array<[string, string]> = ([
  ["ます-stem", "pangkal"],
  ["stem", "pangkal"],
  ["form", "bentuk ます"],
  ["kan", "yang dikenai tindakan"],
  ["ませんでした", "bentuk negatif lampau ます"],
  ["なければなりません", "bentuk ない + ければなりません"],
  ["なければいけません", "bentuk ない + ければいけません"],
  ["てくださいませんか", "bentuk て + くださいませんか"],
  ["ていただけませんか", "bentuk て + いただけませんか"],
  ["ないほうがいいです", "bentuk ない + ほうがいいです"],
  ["たことがありません", "bentuk た + ことがありません"],
  ["ていませんでした", "bentuk て + いませんでした"],
  ["なくてもいいです", "bentuk ない + くてもいいです"],
  ["たことがあります", "bentuk た + ことがあります"],
  ["てもいいですか", "bentuk て + もいいですか"],
  ["ていただきます", "bentuk て + いただきます"],
  ["てくださいます", "bentuk て + くださいます"],
  ["てみてください", "bentuk て + みてください"],
  ["ないでください", "bentuk ないで + ください"],
  ["ない形", "bentuk ない"],
  ["てはいけません", "bentuk て + はいけません"],
  ["てしまいます", "bentuk て + しまいます"],
  ["ておきました", "bentuk て + おきました"],
  ["てみたいです", "bentuk て + みたいです"],
  ["るのにどのくらいかかりますか", "bentuk kamus + のにどのくらいかかりますか"],
  ["るのにいくらかかりますか", "bentuk kamus + のにいくらかかりますか"],
  ["たらいいです", "bentuk た + らいいです"],
  ["たりしました", "bentuk たり + しました"],
  ["ましょう", "bentuk ajakan ます"],
  ["ませんか", "bentuk ajakan/pertanyaan ませんか"],
  ["ますか", "bentuk pertanyaan ますか"],
  ["てしまう", "bentuk て + しまう"],
  ["ておきます", "bentuk て + おきます"],
  ["てあります", "bentuk て + あります"],
  ["ていました", "bentuk て + いました"],
  ["ていません", "bentuk て + いません"],
  ["てみました", "bentuk て + みました"],
  ["てみます", "bentuk て + みます"],
  ["ないために", "bentuk ない + ために"],
  ["ないように", "bentuk ない + ように"],
  ["たばかりの", "bentuk た + ばかりの"],
  ["たりします", "bentuk たり + します"],
  ["るそうです", "bentuk kamus + そうです"],
  ["るところ", "bentuk kamus + ところ"],
  ["るために", "bentuk kamus + ために"],
  ["普通形", "bentuk biasa"],
  ["命令形", "bentuk perintah"],
  ["受身ています", "bentuk pasif dalam keadaan berlangsung"],
  ["ないはず", "bentuk negatif + はず"],
  ["ないでおきます", "memilih tidak melakukan untuk sementara"],
  ["て見ます", "bentuk て + 見ます"],
  ["のに", "bentuk kamus + のに"],
  ["る", "bentuk kamus"],
  ["条件形", "bentuk syarat ば"],
  ["意向形", "bentuk ajakan"],
  ["受身形", "bentuk pasif"],
  ["使役形", "bentuk kausatif"],
  ["可能形", "bentuk potensial"],
  ["てある", "bentuk て + ある"],
  ["てください", "bentuk て + ください"],
  ["てから", "bentuk て + から"],
  ["てもいいです", "bentuk て + もいいです"],
  ["ないとき", "bentuk ない + とき"],
  ["たばかり", "bentuk た + ばかり"],
  ["たところ", "bentuk た + ところ"],
  ["たとき", "bentuk た + とき"],
  ["るのに", "bentuk kamus + のに"],
  ["るのを", "bentuk kamus + のを"],
  ["るとき", "bentuk kamus + とき"],
  ["られる", "bentuk pasif/potensial/kehormatan"],
  ["ません", "bentuk negatif ます"],
  ["ました", "bentuk lampau ます"],
  ["ます", "bentuk ます"],
  ["辞書形", "bentuk kamus"],
  ["受身", "bentuk pasif"],
  ["使役", "bentuk kausatif"],
  ["可能", "bentuk potensial"],
  ["ないで", "bentuk ないで"],
  ["なかった", "bentuk negatif lampau"],
  ["なくても", "bentuk ない + くても"],
  ["なくて", "bentuk なくて"],
  ["なければ", "bentuk ない + ければ"],
  ["ない", "bentuk ない"],
  ["たら", "bentuk た + ら"],
  ["たり", "bentuk たり"],
  ["た形", "bentuk た"],
  ["た", "bentuk た"],
  ["ようになりました", "bentuk menjadi ..."],
  ["れる", "bentuk pasif/kehormatan"],
  ["ば", "bentuk ば"],
  ["て", "bentuk て"],
] as Array<[string, string]>).sort(([left], [right]) => right.length - left.length);

const VERB_NOTATION_PATTERN = new RegExp(
  "(^|[^A-Za-z0-9])V([0-9]*)-?(" +
    VERB_NOTATION_FORMS.map(([suffix]) => suffix).join("|") +
    ")",
  "g"
);

/**
 * Ubah notasi ringkas Minna menjadi istilah bahasa Indonesia yang mudah
 * dipahami. Bentuk terpanjang diproses lebih dahulu agar, misalnya,
 * Vてください tidak terpotong menjadi Vて + teks yang tersisa.
 */
export function formatGrammarNotation(value: string): string {
  let formatted = value.replace(
    /(^|[^A-Za-z0-9])di-V-kan(?=$|[^A-Za-z0-9])/g,
    (_match, prefix: string) => prefix + "dikenai tindakan"
  );
  formatted = formatted.replace(
    VERB_NOTATION_PATTERN,
    (match, prefix: string, number: string, suffix: string) => {
      const description = VERB_NOTATION_FORMS.find(([key]) => key === suffix)?.[1] ?? suffix;
      const numberLabel = number ? " " + number : "";
      if (description === "pangkal") {
        return prefix + "pangkal kata kerja" + numberLabel + " bentuk ます";
      }
      return prefix + "kata kerja" + numberLabel + " " + description;
    }
  );

  // Bentuk kata sifat berakhiran い atau pola kata sifat jenis な.
  formatted = formatted.replace(
    /(^|[^A-Za-z0-9])A-?(い|な)(?=$|[^A-Za-z0-9])/g,
    (_match, prefix: string, suffix: string) =>
      prefix + (suffix === "い" ? "kata sifat berakhiran い" : "kata sifat jenis な")
  );
  formatted = formatted.replace(
    /(^|[^A-Za-z0-9])A(くないです|じゃありません|ければ|なら|し|い|な)(?=$|[^A-Za-z0-9])/g,
    (_match, prefix: string, suffix: string) => {
      const descriptions: Record<string, string> = {
        "くないです": "kata sifat bentuk negatif くないです",
        "じゃありません": "kata sifat bentuk negatif じゃありません",
        "ければ": "kata sifat bentuk ければ",
        "なら": "kata sifat jenis な + なら",
        "し": "kata sifat + し",
        "い": "kata sifat berakhiran い",
        "な": "kata sifat jenis な",
      };
      return prefix + descriptions[suffix];
    }
  );

  // Notasi kata benda dan kalimat, termasuk N1, N2, S1, serta N2-nya.
  formatted = formatted.replace(
    /(^|[^A-Za-z0-9])([NAS])([0-9]*)(-nya)?(?=$|[^A-Za-z0-9])/g,
    (match, prefix: string, symbol: string, number: string, suffix: string | undefined, offset: number, whole: string) => {
      const tail = whole.slice(offset + match.length);
      const needsSpace = /^[\u3040-\u30ff\u3400-\u9fff々〆ヵヶ]/.test(tail);
      return prefix +
        GRAMMAR_LABELS[symbol] +
        (number ? " " + number : "") +
        (suffix ?? "") +
        (needsSpace ? " " : "");
    }
  );

  // Notasi V tanpa akhiran khusus tetap diberi label yang mudah dipahami.
  formatted = formatted.replace(
    /(^|[^A-Za-z0-9])V([0-9]*)(?=$|[^A-Za-z0-9])/g,
    (match, prefix: string, number: string, offset: number, whole: string) => {
      const tail = whole.slice(offset + match.length);
      const needsSpace = /^[\u3040-\u30ff\u3400-\u9fff々〆ヵヶ]/.test(tail);
      return prefix + "kata kerja" + (number ? " " + number : "") + (needsSpace ? " " : "");
    }
  );

  return formatted;
}
