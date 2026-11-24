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
  /** Romaji eksplisit; jika tidak diberikan, dibuat dari teks Jepang. */
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
          /^(\s*(?:(?:さん|ちゃん|くん|さま))?)(は|へ)/,
          (_match, prefix: string, particle: string) => prefix + (particle === "は" ? "わ" : "え")
        );
        // Partikel majemuk seperti ではありません dan にはいます tetap dikenali.
        kana = kana.replace(
          /^(\s*(?:で|に|と|から|まで|より|の|だけ|しか|さえ|て))は/,
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


interface RomajiRubySpan {
  start: number;
  end: number;
  reading: string;
}

interface RomajiSource {
  surface: string;
  rubySpans: RomajiRubySpan[];
}

function decodeRomajiHtmlText(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function appendRomajiPlainText(
  source: RomajiSource,
  value: string,
  allowIndexFallback: boolean
): void {
  const plain = decodeRomajiHtmlText(value);
  if (!plain) return;

  const segments: Array<{ text: string; reading?: string }> = allowIndexFallback
    ? segmentTextByReadingIndex(plain)
    : [{ text: plain }];

  for (const segment of segments) {
    const start = source.surface.length;
    source.surface += segment.text;

    if (segment.reading) {
      source.rubySpans.push({
        start,
        end: source.surface.length,
        reading: segment.reading,
      });
    }
  }
}

function appendRomajiRuby(
  source: RomajiSource,
  base: string,
  reading: string
): void {
  if (!base) return;

  const start = source.surface.length;
  source.surface += base;

  if (reading) {
    source.rubySpans.push({
      start,
      end: source.surface.length,
      reading,
    });
  }
}

function createRomajiSourceFromHtml(
  html: string,
  allowIndexFallback: boolean
): RomajiSource {
  const source: RomajiSource = { surface: "", rubySpans: [] };
  const rubyPattern = /<ruby\b[^>]*>([\s\S]*?)<\/ruby>/gi;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = rubyPattern.exec(html)) !== null) {
    appendRomajiPlainText(
      source,
      html.slice(cursor, match.index),
      allowIndexFallback
    );

    const body = match[1];
    const rtMatch = /<rt\b[^>]*>([\s\S]*?)<\/rt>/i.exec(body);

    if (rtMatch) {
      const baseHtml =
        body.slice(0, rtMatch.index) +
        body.slice(rtMatch.index + rtMatch[0].length);
      appendRomajiRuby(
        source,
        decodeRomajiHtmlText(baseHtml),
        decodeRomajiHtmlText(rtMatch[1])
      );
    } else {
      appendRomajiPlainText(source, body, allowIndexFallback);
    }

    cursor = rubyPattern.lastIndex;
  }

  appendRomajiPlainText(source, html.slice(cursor), allowIndexFallback);
  return source;
}

function getVisibleRomajiNodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getVisibleRomajiNodeText).join("");
  if (!isValidElement(node)) return "";

  const element = node as ReactElement<{ children?: ReactNode }>;
  if (element.type === "rt") return "";
  return getVisibleRomajiNodeText(element.props.children);
}

function appendRomajiReactNode(
  source: RomajiSource,
  node: ReactNode,
  allowIndexFallback: boolean
): void {
  if (node === null || node === undefined || typeof node === "boolean") return;

  if (typeof node === "string" || typeof node === "number") {
    appendRomajiPlainText(source, String(node), allowIndexFallback);
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((child) =>
      appendRomajiReactNode(source, child, allowIndexFallback)
    );
    return;
  }

  if (!isValidElement(node)) return;

  const element = node as ReactElement<{ children?: ReactNode }>;
  if (element.type === "rt") return;

  if (element.type === "ruby") {
    const children = Array.isArray(element.props.children)
      ? element.props.children
      : [element.props.children];
    const rtNodes = children.filter(
      (child) => isValidElement(child) && child.type === "rt"
    );
    const baseNodes = children.filter(
      (child) => !(isValidElement(child) && child.type === "rt")
    );

    if (rtNodes.length > 0) {
      const base = baseNodes.map(getVisibleRomajiNodeText).join("");
      const reading = rtNodes
        .map((child) => {
          if (!isValidElement(child)) return "";
          const rt = child as ReactElement<{ children?: ReactNode }>;
          return getVisibleRomajiNodeText(rt.props.children);
        })
        .join("");

      appendRomajiRuby(source, base, reading);
    } else {
      baseNodes.forEach((child) =>
        appendRomajiReactNode(source, child, allowIndexFallback)
      );
    }
    return;
  }

  appendRomajiReactNode(
    source,
    element.props.children,
    allowIndexFallback
  );
}

interface JapaneseIntlSegmenter {
  segment(input: string): Iterable<{ segment: string; index: number }>;
}

interface JapaneseIntlWithSegmenter {
  Segmenter: new (
    locale: string,
    options: { granularity: "word" }
  ) => JapaneseIntlSegmenter;
}

interface RomajiToken {
  surface: string;
  kana: string;
  start: number;
  end: number;
  punctuation: boolean;
  fromRuby: boolean;
}

const ROMAJI_PARTICLES = new Set([
  "は", "が", "を", "に", "で", "と", "へ", "も", "の", "か", "や", "ね", "よ", "な",
  "から", "まで", "より", "しか", "だけ", "など", "って", "ので", "とか",
]);

const ROMAJI_HONORIFICS = new Set(["さん", "ちゃん", "くん", "さま"]);

function isRomajiPunctuation(value: string): boolean {
  return /^[\s。、！？!?.,／/「」『』（）()「」・]+$/u.test(value);
}

function getRomajiReadingForRange(
  source: RomajiSource,
  start: number,
  end: number
): string | null {
  let cursor = start;
  let reading = "";

  while (cursor < end) {
    const span = source.rubySpans.find(
      (candidate) => candidate.start <= cursor && cursor < candidate.end
    );

    if (span) {
      if (span.start < cursor || span.end > end) return null;
      reading += span.reading;
      cursor = span.end;
      continue;
    }

    const character = source.surface.slice(cursor, cursor + 1);
    if (/[\u3400-\u4dbf\u4e00-\u9fff々〆ヵヶ]/u.test(character)) {
      return null;
    }

    reading += character;
    cursor += 1;
  }

  return reading;
}

function romanizeJapaneseSource(source: RomajiSource): string | null {
  if (!source.surface.trim()) return "";
  if (typeof Intl === "undefined" || !("Segmenter" in Intl)) return null;

  const Segmenter = (Intl as unknown as JapaneseIntlWithSegmenter).Segmenter;
  const segmenter = new Segmenter("ja", { granularity: "word" });
  const tokens: RomajiToken[] = [];

  const pushToken = (
    surface: string,
    start: number,
    end: number,
    fromRuby = false,
    knownReading?: string
  ): void => {
    if (!surface || /^\s+$/u.test(surface)) return;
    const reading = knownReading ?? getRomajiReadingForRange(source, start, end);
    if (reading === null) {
      throw new Error("Missing furigana for romaji segment");
    }
    tokens.push({
      surface,
      kana: toHiragana(reading),
      start,
      end,
      punctuation: isRomajiPunctuation(surface),
      fromRuby,
    });
  };

  const pushGap = (start: number, end: number): boolean => {
    if (end <= start) return true;
    const gap = source.surface.slice(start, end);
    const raw = Array.from(segmenter.segment(gap));

    for (let index = 0; index < raw.length; index++) {
      const part = raw[index];
      const surface = part.segment;
      if (/^\s+$/u.test(surface)) continue;

      const tokenStart = start + part.index;
      const tokenEnd = tokenStart + surface.length;

      // Ungkapan sopan ini merupakan dua kata, meskipun Segmenter
      // kadang mengembalikannya sebagai satu rangkaian.
      if (surface === "おやすみなさい") {
        pushToken("おやすみ", tokenStart, tokenStart + 4);
        pushToken("なさい", tokenStart + 4, tokenEnd);
        continue;
      }

      // ご + ざ + い + ます adalah satu kata bantu: gozaimasu.
      if (
        surface === "ご" &&
        raw[index + 1]?.segment === "ざ" &&
        raw[index + 2]?.segment === "い" &&
        raw[index + 3]?.segment === "ます"
      ) {
        const last = raw[index + 3];
        const gozaimasuEnd = start + last.index + last.segment.length;
        pushToken("ございます", tokenStart, gozaimasuEnd);
        index += 3;
        continue;
      }

      // Segmenter memisahkan でした menjadi で + した dalam ungkapan
      // seperti お疲れさまでした／ごちそうさまでした.
      if (surface === "で" && raw[index + 1]?.segment === "した") {
        const next = raw[index + 1];
        const deshitaEnd = start + next.index + next.segment.length;
        pushToken("でした", tokenStart, deshitaEnd);
        index += 1;
        continue;
      }

      // Segmenter dapat menyatukan "で／に／と + は".
      // Pecah kembali agar partikel は dibaca "wa" dan memiliki jarak sendiri.
      const compoundParticle = /^(から|まで|より|で|に|と)は$/u.exec(surface);
      if (compoundParticle) {
        const first = compoundParticle[1];
        pushToken(first, tokenStart, tokenStart + first.length);
        pushToken("は", tokenStart + first.length, tokenEnd);
        continue;
      }

      // ですが terdiri dari bentuk です + partikel penghubung が.
      if (surface === "ですが") {
        pushToken("です", tokenStart, tokenStart + 2);
        pushToken("が", tokenStart + 2, tokenEnd);
        continue;
      }

      // "ことに／ことが／ものを／ように" dan pola serupa merupakan
      // frasa + partikel, bukan satu kata panjang.
      const nominalParticle = /^(こと|もの|ため|とき|ところ|よう|はず|わけ)(から|まで|より|は|が|を|に|で|と|へ|も|か)$/u.exec(surface);
      if (nominalParticle) {
        const noun = nominalParticle[1];
        pushToken(noun, tokenStart, tokenStart + noun.length);
        pushToken(
          nominalParticle[2],
          tokenStart + noun.length,
          tokenEnd
        );
        continue;
      }

      // Pisahkan たん／だん dari ん ketika menjadi bentuk penjelas んです.
      if (
        (surface === "たん" || surface === "だん") &&
        /^(?:です|ですが|ですよ|ですか)$/.test(raw[index + 1]?.segment ?? "")
      ) {
        pushToken(surface.slice(0, 1), tokenStart, tokenStart + 1);
        pushToken("ん", tokenStart + 1, tokenEnd);
        continue;
      }

      // ています／でいます／っています／んでいます menjadi
      // bentuk て／で + います, bukan satu rentang yang menempel.
      const progressive = /^(て|で|って|んで)(います|いました|いません|いる|いた|いない|いなかった)$/u.exec(surface);
      if (progressive) {
        const first = progressive[1];
        pushToken(first, tokenStart, tokenStart + first.length);
        pushToken(
          progressive[2],
          tokenStart + first.length,
          tokenEnd
        );
        continue;
      }

      // Segmenter umumnya memecah てい + ます; satukan い + ます
      // menjadi "います" agar hasil akhirnya "mite imasu".
      if (
        (surface === "てい" || surface === "でい" || surface === "ってい" || surface === "んでい") &&
        raw[index + 1]?.segment === "ます"
      ) {
        const first = surface.slice(0, -1);
        pushToken(first, tokenStart, tokenEnd - 1);
        const next = raw[index + 1];
        const nextStart = start + next.index;
        pushToken("います", tokenEnd - 1, nextStart + next.segment.length);
        index += 1;
        continue;
      }

      pushToken(surface, tokenStart, tokenEnd);
    }

    return true;
  };

  try {
    const spans = source.rubySpans
      .filter((span) => span.start >= 0 && span.end <= source.surface.length && span.end > span.start)
      .sort((a, b) => a.start - b.start);
    let cursor = 0;

    for (const span of spans) {
      if (span.start < cursor) continue;

      // Segmentasikan hanya teks di antara rentang ruby. Rentang furigana
      // selalu masuk sebagai satu token, walaupun Segmenter ingin memecahnya.
      if (!pushGap(cursor, span.start)) return null;

      pushToken(
        source.surface.slice(span.start, span.end),
        span.start,
        span.end,
        true,
        span.reading
      );
      cursor = span.end;
    }

    if (!pushGap(cursor, source.surface.length)) return null;
  } catch {
    return null;
  }

  const merged: RomajiToken[] = [];

  const mergeIntoPrevious = (previous: RomajiToken, current: RomajiToken) => {
    previous.surface += current.surface;
    previous.kana += current.kana;
    previous.end = current.end;
    previous.punctuation = false;
  };

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    const previous = merged[merged.length - 1];
    const next = tokens[index + 1];
    const adjacent = Boolean(previous && previous.end === token.start);
    const previousIsParticle = previous
      ? ROMAJI_PARTICLES.has(previous.surface)
      : false;
    const currentIsKana = /^[ぁ-ゖァ-ヺー]+$/u.test(token.surface);

    if (token.punctuation) {
      merged.push(token);
      continue;
    }

    // Awalan sopan お／ご melekat pada kata berikutnya: お名前 → onamae.
    if (
      adjacent &&
      previous &&
      ["お", "ご"].includes(previous.surface)
    ) {
      mergeIntoPrevious(previous, token);
      previous.fromRuby = token.fromRuby;
      continue;
    }

    // Okurigana setelah ruby menempel ke kata dasarnya, kecuali partikel
    // dan honorifik yang harus tetap menjadi unit terpisah.
    if (
      adjacent &&
      previous?.fromRuby &&
      currentIsKana &&
      !ROMAJI_PARTICLES.has(token.surface) &&
      !ROMAJI_HONORIFICS.has(token.surface) &&
      !(token.surface === "なさい" && /(?:おやすみ|お休み)$/u.test(previous.surface)) &&
      token.surface !== "し" &&
      !["です", "でした", "ます", "ました", "ません", "ましょう", "でしょう", "ください"].includes(token.surface)
    ) {
      mergeIntoPrevious(previous, token);
      previous.fromRuby = false;
      continue;
    }

    // Bentuk て setelah okurigana, misalnya 遅れ + て → okurete.
    if (
      adjacent &&
      previous &&
      token.surface === "て" &&
      /[ぁ-ゖァ-ヺー]$/u.test(previous.surface) &&
      !previousIsParticle
    ) {
      mergeIntoPrevious(previous, token);
      continue;
    }

    // Bentuk sambung する: 勉強 + し + て → benkyou shite.
    if (
      adjacent &&
      previous &&
      previous.surface === "し" &&
      (token.surface === "て" || token.surface === "てい")
    ) {
      mergeIntoPrevious(previous, token);
      continue;
    }

    // Bentuk しまった／しました: satukan し + まっ + た.
    if (
      adjacent &&
      previous &&
      previous.surface === "し" &&
      (token.surface === "まっ" || token.surface === "ま")
    ) {
      mergeIntoPrevious(previous, token);
      continue;
    }

    if (
      adjacent &&
      previous &&
      (token.surface === "たい" ||
        token.surface === "た" ||
        token.surface === "ない" ||
        token.surface === "なかった" ||
        token.surface === "たら" ||
        (token.surface === "い" &&
          /(?:した|べた|けた|めた|った|いた|みた|びた|りた|きた|えた)$/u.test(previous.surface)))
    ) {
      mergeIntoPrevious(previous, token);
      continue;
    }

    // Akhiran sopan melekat pada pangkal kata kerja: し + ます → shimasu.
    if (
      adjacent &&
      previous &&
      !previousIsParticle &&
      (token.surface === "ます" ||
        token.surface === "ました" ||
        token.surface === "ません" ||
        token.surface === "ましょう" ||
        (token.surface === "ま" &&
          ["せん", "しょう"].includes(next?.surface ?? "")) ||
        (token.surface === "せん" && /ま$/u.test(previous.surface)))
    ) {
      mergeIntoPrevious(previous, token);
      continue;
    }

    // ください kadang dibagi oleh Segmenter menjadi くだ + さい.
    if (
      adjacent &&
      previous &&
      previous.surface === "くだ" &&
      token.surface === "さい"
    ) {
      mergeIntoPrevious(previous, token);
      continue;
    }

    // Bentuk sambung setelah bunyi ん: 読ん + で → yonde.
    if (
      adjacent &&
      previous &&
      /ん$/u.test(previous.surface) &&
      token.surface === "で"
    ) {
      mergeIntoPrevious(previous, token);
      continue;
    }

    // Partikel は／へ／を ditulis sesuai cara bacanya dalam kalimat.
    merged.push({ ...token });
  }

  const output: string[] = [];

  for (const token of merged) {
    if (token.punctuation) {
      const punctuation = token.surface
        .replace(/。/g, ".")
        .replace(/、/g, ",")
        .replace(/！/g, "!")
        .replace(/？/g, "?")
        .replace(/／/g, "/")
        .replace(/[「『]/g, '"')
        .replace(/[」』]/g, '"');

      if (punctuation === "/") {
        output.push("/");
      } else if (punctuation) {
        if (/^[.,!?)]$/u.test(punctuation) && output.length > 0) {
          output[output.length - 1] += punctuation;
        } else {
          output.push(punctuation);
        }
      }
      continue;
    }

    let romanized: string;
    if (token.surface === "こんにちは") {
      romanized = "konnichiwa";
    } else if (token.surface === "こんばんは") {
      romanized = "konbanwa";
    } else if (token.surface === "は") {
      romanized = "wa";
    } else if (token.surface === "へ") {
      romanized = "e";
    } else if (token.surface === "を") {
      romanized = "o";
    } else {
      romanized = toRomaji(token.kana);
    }

    if (romanized) output.push(romanized);
  }

  return output
    .join(" ")
    .replace(/\s+([.,!?])/g, "$1")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/"\s+/g, '"')
    .replace(/\s+"/g, '"')
    .trim();
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
        .replace(/<\/ruby>(\s*)は/g, "</ruby>$1わ")
        .replace(/<\/ruby>(\s*)へ/g, "</ruby>$1え")
        .replace(/こんにちは/g, "こんにちわ")
        .replace(/こんばんは/g, "こんばんわ")
        .replace(/を/g, "お");

      return extractKanaFromRubyHtml(particleAwareHtml, allowIndexFallback)?.kana ||
        normalizedKana;
    }

    return getKanaForRomajiFromNode(children, allowIndexFallback) || normalizedKana;
  })();
  const romajiSource =
    displayHtml !== undefined
      ? createRomajiSourceFromHtml(displayHtml, allowIndexFallback)
      : (() => {
          const source: RomajiSource = { surface: "", rubySpans: [] };
          appendRomajiReactNode(
            source,
            allowIndexFallback
              ? renderJapaneseNodeWithRuby(children)
              : children,
            allowIndexFallback
          );
          return source;
        })();
  const segmentedRomaji = romanizeJapaneseSource(romajiSource);
  const automaticRomaji =
    segmentedRomaji ?? (kanaForRomaji ? toRomaji(kanaForRomaji) : "");
  const romanization = explicitRomaji?.trim() || automaticRomaji;
  const consistentRomajiClassName = [
    ...romajiClassName.split(" ").filter((className) => !className.startsWith("text-[#")),
    "text-[#D9B66D]",
  ].join(" ");
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
        <span className={consistentRomajiClassName + " block"}>{romanization}</span>
      )}
      {showTranslation && hasTranslation && (
        <span className={translationClassName + " block"}>{translation}</span>
      )}
    </span>
  );
}
