"use client";

import { useState, useEffect, useRef, useMemo } from "react"; 
import { Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import FitText from "../../components/FitText";
import { typeBadgeClass, typeAccentClass } from "../../components/verbType";

let wanakanaModule: typeof import("wanakana") | null = null;

const KanjiStroke = dynamic(() => import("../../components/KanjiStroke"), { ssr: false });

const bgImages = [
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554797589-7241bb691973?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=75&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=75&w=400&auto=format&fit=crop",
];

// ==========================================
// MESIN KONJUGASI
// ==========================================
type VerbData = {
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
  type: string;
  jlptLevel: string;
  transitivity?: string;
  transitivityPairId?: string;
  transitivityPairRole?: string;
  pairedVerb?: { kanji: string; kana: string };
  transitivityNote?: string;
  teIruMeaning?: string;
  teIruExample?: string;
  usagePatterns?: {
    particle: string;
    role: string;
    pattern?: string;
    note?: string;
    example?: string;
    patternStatus?: string;
  }[];
  usagePatternCaveat?: string;
  examples?: {
    ja: string;
    romaji?: string;
    furigana?: string;
    translation: string;
    source?: string;
    sourceId?: number;
    sourceUrl?: string;
    license?: string;
  }[];
};

type FormDefinition = {
  id: string;
  name: string;
  jpName: string;
  kana: string;
  desc: string;
};

type ConjugatedForm = FormDefinition & {
  ruby: string;
  romaji: string;
  meaning: string;
  example?: string;
};

type ConjugatedVerb = VerbData & {
  forms: ConjugatedForm[];
};

type TransitivityFilter = "all" | "transitive" | "intransitive" | "both" | "unreviewed";

const godanEndings: Record<string, {
  a: string; i: string; e: string; o: string; te: string; ta: string;
}> = {
  "う": { a: "わ", i: "い", e: "え", o: "お", te: "って", ta: "った" },
  "く": { a: "か", i: "き", e: "け", o: "こ", te: "いて", ta: "いた" },
  "ぐ": { a: "が", i: "ぎ", e: "げ", o: "ご", te: "いで", ta: "いだ" },
  "す": { a: "さ", i: "し", e: "せ", o: "そ", te: "して", ta: "した" },
  "つ": { a: "た", i: "ち", e: "て", o: "と", te: "って", ta: "った" },
  "ぬ": { a: "な", i: "に", e: "ね", o: "の", te: "んで", ta: "んだ" },
  "ぶ": { a: "ば", i: "び", e: "べ", o: "ぼ", te: "んで", ta: "んだ" },
  "む": { a: "ま", i: "み", e: "め", o: "も", te: "んで", ta: "んだ" },
  "る": { a: "ら", i: "り", e: "れ", o: "ろ", te: "って", ta: "った" },
};

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (char) => entities[char] || char);
}

function furiganaToKana(source: string): string {
  return source.replace(/\{[^|{}]+\|([^{}]+)\}/g, "$1");
}

// WanaKana mengubah bunyi kana secara harfiah, tetapi tidak selalu tahu
// kapan は / へ / を berfungsi sebagai partikel. Normalisasi ini menangani
// pola partikel yang dapat dikenali dari batas furigana dan bentuk umum.
function normalizeParticlePronunciation(source: string): string {
  return source
    // Partikel setelah kelompok kanji yang diberi furigana.
    .replace(/(\})は/g, "$1わ")
    .replace(/(\})へ/g, "$1え")
    // Partikel setelah kata katakana, misalnya ドアは / アメリカへ.
    .replace(/([ァ-ヺー])は(?=[ぁ-ゖァ-ヺー一-龯{}、。！？]|$)/g, "$1わ")
    .replace(/([ァ-ヺー])へ(?=[ぁ-ゖァ-ヺー一-龯{}、。！？]|$)/g, "$1え")
    // Pronomina/keterangan tempat yang lazim ditulis dengan kana.
    .replace(/(これ|それ|あれ|どれ|ここ|そこ|あそこ|どこ|わたし|わたしたち|わたくし|ぼく|ぼくたち|かれ|かれら|かのじょ|みんな|みなさん|あなた|おまえ|なに)は/g, "$1わ")
    .replace(/(で|に|と|から|まで|より|の|だけ|しか|さえ|て)は/g, "$1わ")
    .replace(/(ここ|そこ|あそこ|どこ)へ/g, "$1え")
    // を sebagai partikel objek/jalur dilafalkan "o", bukan "wo".
    .replace(/を/g, "お")
    // Ejaan baku untuk dua salam yang mengandung は secara leksikal.
    .replace(/こんにちは/g, "こんにちわ")
    .replace(/こんばんは/g, "こんばんわ");
}

function romanizeExample(furiganaSource: string): string {
  const particleAwareSource = normalizeParticlePronunciation(furiganaSource);
  return wanakanaModule!.toRomaji(furiganaToKana(particleAwareSource));
}

// Ambil bentuk tulisan yang terlihat dari HTML ruby, tanpa mengambil isi furigana.
function rubyToPlainText(ruby: string): string {
  return ruby
    .replace(/<rt\b[^>]*>[\s\S]*?<\/rt>/gi, "")
    .replace(/<[^>]*>/g, "");
}

function normalizeSearchValue(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase().trim();
}

type SearchEntry = {
  normalized: string;
  hiragana: string;
  compact: string;
  compactHiragana: string;
  kind: "japanese" | "romaji" | "text";
};

function createSearchEntry(value: string, kind: SearchEntry["kind"]): SearchEntry {
  const normalized = normalizeSearchValue(value);
  const hiragana = normalizeSearchValue(wanakanaModule!.toHiragana(normalized));
  return {
    normalized,
    hiragana,
    compact: normalized.replace(/\s+/g, ""),
    compactHiragana: hiragana.replace(/\s+/g, ""),
    kind,
  };
}

function createSearchVariants(query: string): string[] {
  const normalized = normalizeSearchValue(query);
  if (!normalized) return [];

  const hiragana = normalizeSearchValue(wanakanaModule!.toHiragana(normalized));
  return Array.from(new Set([
    normalized,
    hiragana,
    normalized.replace(/\s+/g, ""),
    hiragana.replace(/\s+/g, ""),
  ].filter(Boolean)));
}

function searchEntryMatches(entry: SearchEntry, variants: string[]): boolean {
  return variants.some((variant) => {
    if (!variant) return false;

    if (entry.kind === "romaji") {
      // Romaji hanya cocok dari karakter pertama string, bukan dari tengah
      // atau awal token berikutnya. Contoh: "aki" tidak cocok dengan "noboru".
      if (!/^[a-z\s]+$/i.test(variant)) return false;
      const compactVariant = variant.replace(/\s+/g, "");
      return entry.normalized.startsWith(variant) ||
        entry.compact.startsWith(compactVariant);
    }

    if (entry.kind === "japanese") {
      // Kanji/kana juga memakai prefix matching agar hasil konsisten.
      return entry.normalized.startsWith(variant) ||
        entry.hiragana.startsWith(variant) ||
        entry.compact.startsWith(variant.replace(/\s+/g, "")) ||
        entry.compactHiragana.startsWith(variant.replace(/\s+/g, ""));
    }

    // Arti Bahasa Indonesia juga dicocokkan dari awal, bukan substring.
    return entry.normalized.startsWith(variant);
  });
}

function getVerbSearchEntries(verb: ConjugatedVerb): SearchEntry[] {
  const entries: SearchEntry[] = [
    createSearchEntry(verb.kanji, "japanese"),
    createSearchEntry(verb.kana, "japanese"),
    createSearchEntry(verb.romaji, "romaji"),
    createSearchEntry(verb.meaning, "text"),
  ];

  verb.forms.forEach((form) => {
    entries.push(
      createSearchEntry(form.kana, "japanese"),
      createSearchEntry(form.romaji, "romaji"),
      createSearchEntry(rubyToPlainText(form.ruby), "japanese"),
    );
  });

  return entries.filter((entry) => entry.normalized.length > 0);
}

function findMatchingConjugation(verb: ConjugatedVerb, query: string): ConjugatedForm | undefined {
  const variants = createSearchVariants(query);
  if (!variants.length) return undefined;

  return verb.forms.find((form) => {
    const candidates = [
      createSearchEntry(form.kana, "japanese"),
      createSearchEntry(form.romaji, "romaji"),
      createSearchEntry(rubyToPlainText(form.ruby), "japanese"),
    ];
    return candidates.some((candidate) => searchEntryMatches(candidate, variants));
  });
}

function romanizeFormWithSpacing(verb: VerbData, formKana: string, formId: string): string {
  const romanized = romanizeForm(verb, formKana);
  if (formId === "te-iru") {
    // Pisahkan verba bentuk て/で dari verba bantu いる: aite iru, yonde iru.
    return romanized.replace(/(te|de)iru$/i, "$1 iru");
  }
  return romanized;
}

function furiganaToSafeHtml(source: string): string {
  return source.split(/(\{[^{}]+\})/g).map((part) => {
    if (part.startsWith("{") && part.endsWith("}") && part.includes("|")) {
      const inner = part.slice(1, -1);
      const divider = inner.indexOf("|");
      const base = inner.slice(0, divider);
      const reading = inner.slice(divider + 1);
      return `<ruby>${escapeHtml(base)}<rt>${escapeHtml(reading)}</rt></ruby>`;
    }
    return escapeHtml(part);
  }).join("");
}

// Kata dengan kanji yang terselip di tengah memerlukan pembacaan khusus.
// Prefix ini menjaga okurigana tetap tampil sebagai kana biasa.
const specialRubyPrefixes: Record<string, { reading: string; html: string }> = {
  "引っ越す": {
    reading: "ひっこ",
    html: "<ruby>引<rt>ひ</rt></ruby>っ<ruby>越<rt>こ</rt></ruby>",
  },
  "間に合う": {
    reading: "まにあ",
    html: "<ruby>間<rt>ま</rt></ruby>に<ruby>合<rt>あ</rt></ruby>",
  },
  "付き合う": {
    reading: "つきあ",
    html: "<ruby>付<rt>つ</rt></ruby>き<ruby>合<rt>あ</rt></ruby>",
  },
};

function makeRubyHtml(verb: VerbData, formKana: string): string {
  const plain = escapeHtml(formKana);
  if (!verb.kanji || verb.kanji === verb.kana) return plain;

  const special = specialRubyPrefixes[verb.kanji];
  if (special && formKana.startsWith(special.reading)) {
    return `${special.html}${escapeHtml(formKana.slice(special.reading.length))}`;
  }

  // 来る mempunyai perubahan bacaan く -> き/こ bergantung bentuknya.
  if (verb.kanji === "来る" && verb.kana === "くる") {
    const reading = Array.from(formKana)[0];
    if (["く", "き", "こ"].includes(reading)) {
      return `<ruby>来<rt>${reading}</rt></ruby>${escapeHtml(Array.from(formKana).slice(1).join(""))}`;
    }
  }

  // Pisahkan bagian kanji dari okurigana, misalnya 食べる -> 食 + べる.
  const kanjiChars = Array.from(verb.kanji);
  const firstKanaIndex = kanjiChars.findIndex((char) => /[\u3040-\u309f]/.test(char));
  if (firstKanaIndex > 0) {
    const kanjiPart = kanjiChars.slice(0, firstKanaIndex).join("");
    const kanaSuffix = kanjiChars.slice(firstKanaIndex).join("");
    const kanaChars = Array.from(verb.kana);

    if (kanaChars.join("").endsWith(kanaSuffix)) {
      const readingPrefix = kanaChars.slice(0, kanaChars.length - Array.from(kanaSuffix).length).join("");
      if (readingPrefix && formKana.startsWith(readingPrefix)) {
        return `<ruby>${escapeHtml(kanjiPart)}<rt>${escapeHtml(readingPrefix)}</rt></ruby>${escapeHtml(formKana.slice(readingPrefix.length))}`;
      }
    }
  }

  // Fallback aman: tetap tampilkan kana daripada membuat furigana yang salah.
  return plain;
}

function romanizeForm(verb: VerbData, formKana: string): string {
  if (verb.type === "Irregular" && verb.kana.endsWith("する")) {
    const prefixKana = verb.kana.slice(0, -2);
    const prefixRomaji = verb.romaji.replace(/\s*suru$/i, "").trim();
    const suffixRomaji = wanakanaModule!.toRomaji(formKana.slice(prefixKana.length));
    return [prefixRomaji, suffixRomaji].filter(Boolean).join(" ");
  }

  if (verb.type === "Irregular" && verb.kana.endsWith("くる")) {
    const prefixKana = verb.kana.slice(0, -2);
    const prefixRomaji = verb.romaji.replace(/\s*kuru$/i, "").trim();
    const suffixRomaji = wanakanaModule!.toRomaji(formKana.slice(prefixKana.length));
    return [prefixRomaji, suffixRomaji].filter(Boolean).join(" ");
  }

  return wanakanaModule!.toRomaji(formKana);
}

function getFormMeaning(verb: VerbData, formId: string): string {
  const base = `“${verb.meaning}”`;
  switch (formId) {
    case "dict":
      return `Makna dasar: ${verb.meaning}.`;
    case "masu":
      return `Bentuk sopan nonlampau dari ${base}. Dipakai untuk menyatakan kebiasaan, fakta, atau tindakan yang akan dilakukan dengan bahasa sopan.`;
    case "te":
      return `Bentuk sambung: ${base}, lalu/dan …. Juga dipakai dalam permintaan dan beberapa pola tata bahasa. Bentuk て saja tidak otomatis berarti “sedang …”.`;
    case "te-iru":
      return verb.teIruMeaning || `Pola 〜ている. Bergantung pada jenis verba dan konteks, maknanya dapat berupa aksi yang sedang berlangsung, keadaan hasil, atau kebiasaan.`;
    case "ta":
      return `Bentuk lampau: menyatakan tindakan atau kejadian yang sudah terjadi. Terjemahan alaminya mengikuti konteks dan makna dasar ${base}.`;
    case "nai":
      return `Bentuk negatif: menyatakan tidak melakukan atau tidak mengalami ${base}.`;
    case "potential":
      return `Bentuk potensial: menyatakan bisa atau mampu melakukan/mengalami ${base}.`;
    case "volitional":
      return `Bentuk ajakan atau niat: “ayo/mari …” atau “akan …”, sesuai konteks.`;
    case "conditional":
      return `Bentuk syarat 〜ば: “jika …”, berdasarkan tindakan atau keadaan ${base}.`;
    case "imperative":
      return `Bentuk perintah langsung untuk meminta seseorang melakukan tindakan terkait ${base}. Tingkat ketegasannya bergantung konteks.`;
    case "passive":
      return `Bentuk pasif. Pada verba transitif, subjek menerima tindakan; pada beberapa verba intransitif, bentuk pasif tidak langsung dapat menyatakan pihak yang terkena dampak.`;
    case "causative":
      return `Bentuk kausatif: membuat, menyuruh, atau membiarkan seseorang melakukan tindakan terkait ${base}.`;
    default:
      return `Bentuk konjugasi dari ${base}.`;
  }
}

function getFormExample(verb: VerbData, formId: string): string | undefined {
  if (formId === "te-iru") return verb.teIruExample;
  return undefined;
}

function conjugate(verb: VerbData): ConjugatedForm[] {
  const { kana, type } = verb;
  let masu: string;
  let te: string;
  let ta: string;
  let nai: string;
  let potential: string;
  let volitional: string;
  let conditional: string;
  let imperative: string;
  let passive: string;
  let causative: string;

  if (type === "Godan") {
    const kanaChars = Array.from(kana);
    const lastChar = kanaChars[kanaChars.length - 1] || "";
    const base = kanaChars.slice(0, -1).join("");
    const ending = godanEndings[lastChar];
    if (!ending) return [];

    masu = base + ending.i + "ます";
    te = base + ending.te;
    ta = base + ending.ta;
    nai = base + ending.a + "ない";
    potential = base + ending.e + "る";
    volitional = base + ending.o + "う";
    conditional = base + ending.e + "ば";
    imperative = base + ending.e;
    passive = base + ending.a + "れる";
    causative = base + ending.a + "せる";

    // 行く adalah pengecualian untuk て形 dan た形.
    if (kana === "ある") {
      // ある adalah godan, tetapi bentuk negatifnya tidak memakai あらない.
      nai = "ない";
      potential = "ありうる";
    }

    // Bentuk hormat ini punya konjugasi masu/te/ta khusus.
    const honorificGodanForms: Record<string, { masu: string; te: string; ta: string; nai: string; imperative?: string }> = {
      "くださる": { masu: "くださいます", te: "くださって", ta: "くださった", nai: "くださらない", imperative: "ください" },
      "おっしゃる": { masu: "おっしゃいます", te: "おっしゃって", ta: "おっしゃった", nai: "おっしゃらない", imperative: "おっしゃい" },
      "なさる": { masu: "なさいます", te: "なさって", ta: "なさった", nai: "なさらない", imperative: "なさい" },
      "いらっしゃる": { masu: "いらっしゃいます", te: "いらっしゃって", ta: "いらっしゃった", nai: "いらっしゃらない", imperative: "いらっしゃい" },
    };
    const honorific = honorificGodanForms[kana];
    if (honorific) {
      masu = honorific.masu;
      te = honorific.te;
      ta = honorific.ta;
      nai = honorific.nai;
      if (honorific.imperative) imperative = honorific.imperative;
    }

    if (kana.endsWith("いく")) {
      const ikuBase = kana.slice(0, -2);
      te = ikuBase + "いって";
      ta = ikuBase + "いった";
    }
  } else if (type === "Ichidan") {
    if (!kana.endsWith("る")) return [];
    const stem = kana.slice(0, -1);
    masu = stem + "ます";
    te = stem + "て";
    ta = stem + "た";
    nai = stem + "ない";
    potential = stem + "られる";
    volitional = stem + "よう";
    conditional = stem + "れば";
    imperative = stem + "ろ";
    passive = stem + "られる";
    causative = stem + "させる";
  } else if (type === "Irregular" && kana.endsWith("する")) {
    const stem = kana.slice(0, -2);
    masu = stem + "します";
    te = stem + "して";
    ta = stem + "した";
    nai = stem + "しない";
    potential = stem + "できる";
    volitional = stem + "しよう";
    conditional = stem + "すれば";
    imperative = stem + "しろ";
    passive = stem + "される";
    causative = stem + "させる";
  } else if (type === "Irregular" && kana.endsWith("くる")) {
    const stem = kana.slice(0, -2);
    masu = stem + "きます";
    te = stem + "きて";
    ta = stem + "きた";
    nai = stem + "こない";
    potential = stem + "こられる";
    volitional = stem + "こよう";
    conditional = stem + "くれば";
    imperative = stem + "こい";
    passive = stem + "こられる";
    causative = stem + "こさせる";
  } else {
    // Jangan menganggap semua tipe tak dikenal sebagai 来る.
    return [];
  }

  const teIru = `${te}いる`;

  const definitions: FormDefinition[] = [
    { id: "dict", name: "Bentuk Kamus", jpName: "辞書形", kana, desc: "Bentuk dasar." },
    { id: "masu", name: "Bentuk Masu", jpName: "ます形", kana: masu, desc: "Bentuk sopan." },
    { id: "te", name: "Bentuk Te", jpName: "て形", kana: te, desc: "Menyambung klausa atau membentuk pola tata bahasa." },
    { id: "te-iru", name: "Bentuk ている", jpName: "〜ている", kana: teIru, desc: "Aksi berlangsung, keadaan hasil, atau kebiasaan (bergantung verba)." },
    { id: "ta", name: "Bentuk Lampau", jpName: "た形", kana: ta, desc: "Menyatakan lampau." },
    { id: "nai", name: "Bentuk Negatif", jpName: "ない形", kana: nai, desc: "Bentuk negatif." },
    { id: "potential", name: "Bentuk Potensial", jpName: "可能形", kana: potential, desc: "Menyatakan kemampuan melakukan sesuatu." },
    { id: "volitional", name: "Bentuk Volisional", jpName: "意向形", kana: volitional, desc: "Menyatakan ajakan atau niat." },
    { id: "conditional", name: "Bentuk Kondisional", jpName: "条件形", kana: conditional, desc: "Menyatakan kondisi dengan ば." },
    { id: "imperative", name: "Bentuk Perintah", jpName: "命令形", kana: imperative, desc: "Bentuk perintah langsung." },
    { id: "passive", name: "Bentuk Pasif", jpName: "受身形", kana: passive, desc: "Menyatakan dikenai suatu tindakan." },
    { id: "causative", name: "Bentuk Kausatif", jpName: "使役形", kana: causative, desc: "Menyuruh atau membiarkan seseorang melakukan sesuatu." },
  ];

  return definitions.map((form): ConjugatedForm => ({
    ...form,
    ruby: makeRubyHtml(verb, form.kana),
    // Generate all forms from kana so DB typos in the romaji field do not leak into UI.
    romaji: romanizeFormWithSpacing(verb, form.kana, form.id),
    meaning: getFormMeaning(verb, form.id),
    example: getFormExample(verb, form.id),
  }));
}

export default function Konjugasi() {
  const [search, setSearch] = useState("");
  const [selectedVerb, setSelectedVerb] = useState<ConjugatedVerb | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [transitivityFilter, setTransitivityFilter] = useState<string>("all");
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});

  const [verbsData, setVerbsData] = useState<VerbData[]>([]);
const [isLoadingKamus, setIsLoadingKamus] = useState(true);
const [kamusLoadError, setKamusLoadError] = useState<string | null>(null);

useEffect(() => {
  let active = true;

  Promise.all([
    import("../../data/kamus-kerja.json"),
    import("wanakana"),
  ])
    .then(([kamusModule, wanakana]) => {
      if (!active) return;

      // Pastikan Wanakana tersedia sebelum data kamus diproses.
      wanakanaModule = wanakana;

      setVerbsData(kamusModule.default as VerbData[]);
    })
    .catch((error) => {
      console.error("Gagal memuat kamus konjugasi:", error);

      if (active) {
        setKamusLoadError("Kamus konjugasi gagal dimuat.");
      }
    })
    .finally(() => {
      if (active) {
        setIsLoadingKamus(false);
      }
    });

  return () => {
    active = false;
  };
}, []);

  const conjugationsData = useMemo<ConjugatedVerb[]>(() => {
  return verbsData
    .map((v: VerbData): ConjugatedVerb => ({
      ...v,
      forms: conjugate(v),
    }))
    .filter((v: ConjugatedVerb) => v.forms.length > 0);
}, [verbsData]);

  useEffect(() => {
    let currentPool = [...bgImages].sort(() => Math.random() - 0.5);
    let poolIndex = 0;
    const newMap: Record<string, string> = {};
    conjugationsData.forEach((v: ConjugatedVerb) => {
      if (poolIndex >= currentPool.length) {
        currentPool = [...bgImages].sort(() => Math.random() - 0.5);
        poolIndex = 0;
      }
      newMap[v.kanji] = currentPool[poolIndex];
      poolIndex++;
    });
    setImageMap(newMap);
  }, [conjugationsData]);

  useEffect(() => {
    if (selectedVerb) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedVerb]);

  useEffect(() => {
    const el = panelRef.current;
    if (!selectedVerb || !el) return;
    const CLOSE_THRESHOLD = 110; 
    let startY = 0;
    let prevY = 0;
    let dy = 0;
    let inHandle = false;
    let active = false;
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
    const onStart = (e: TouchEvent) => {
      if (!isMobile()) return;
      startY = prevY = e.touches[0].clientY;
      dy = 0; active = false;
      inHandle = !!(e.target as HTMLElement).closest("[data-sheet-handle]");
    };
    const onMove = (e: TouchEvent) => {
      if (!isMobile()) return;
      const y = e.touches[0].clientY;
      const atTop = inHandle || (scrollRef.current?.scrollTop ?? 0) <= 0;
      if (!active && atTop && y > prevY) {
        active = true; startY = prevY; setDragging(true);
      }
      if (active) {
        dy = y - startY;
        if (dy <= 0) { active = false; dy = 0; setDragging(false); setDragY(0); }
        else { e.preventDefault(); setDragY(dy); }
      }
      prevY = y;
    };
    const onEnd = () => {
      if (!active) return;
      active = false; setDragging(false);
      if (dy > CLOSE_THRESHOLD) {
        setDragY(window.innerHeight); 
        setTimeout(() => { setSelectedVerb(null); setDragY(0); }, 220);
      } else { setDragY(0); }
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [selectedVerb]);

  const verbTypes = Array.from(new Set(conjugationsData.map((v: ConjugatedVerb) => v.type)));

  const getTransitivity = (verb: VerbData): string => {
    const value = (verb.transitivity || "unreviewed").toLowerCase();
    return ["transitive", "intransitive", "both"].includes(value) ? value : "unreviewed";
  };

  const transitivityLabel = (verb: VerbData): string => {
    const value = getTransitivity(verb);
    if (value === "transitive") return "Transitif";
    if (value === "intransitive") return "Intransitif";
    if (value === "both") return "Keduanya";
    return "Belum diverifikasi";
  };

  const transitivityClass = (verb: VerbData): string => {
    const value = getTransitivity(verb);
    if (value === "transitive") return "border-sky-400/30 bg-sky-400/10 text-sky-300";
    if (value === "intransitive") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    if (value === "both") return "border-violet-400/30 bg-violet-400/10 text-violet-300";
    return "border-[#817A73]/30 bg-[#817A73]/10 text-[#A3A099]";
  };

  const transitivityFilters: { id: TransitivityFilter; label: string }[] = [
    { id: "all", label: "Semua" },
    { id: "transitive", label: "Transitif" },
    { id: "intransitive", label: "Intransitif" },
    { id: "both", label: "Keduanya" },
    { id: "unreviewed", label: "Belum Diverifikasi" },
  ];

  // Indeks pencarian dibuat sekali dari kata dasar dan seluruh bentuk konjugasinya.
  // Bentuk ruby turut diindeks agar pencarian kanji seperti 食べた juga ditemukan.
  const searchableVerbs = useMemo(
    () => conjugationsData.map((verb) => ({
      verb,
      entries: getVerbSearchEntries(verb),
    })),
    [conjugationsData]
  );

  const searchVariants = createSearchVariants(search);
  const filteredVerbs = searchableVerbs
    .filter(({ verb, entries }) =>
      (typeFilter === "all" || verb.type === typeFilter) &&
      (levelFilter === "all" || verb.jlptLevel === levelFilter) &&
      (transitivityFilter === "all" || getTransitivity(verb) === transitivityFilter) &&
      (!searchVariants.length || entries.some((entry) => searchEntryMatches(entry, searchVariants)))
    )
    .map(({ verb }) => verb);

  const transitivityCounts = {
    all: conjugationsData.length,
    transitive: conjugationsData.filter((v: ConjugatedVerb) => getTransitivity(v) === "transitive").length,
    intransitive: conjugationsData.filter((v: ConjugatedVerb) => getTransitivity(v) === "intransitive").length,
    both: conjugationsData.filter((v: ConjugatedVerb) => getTransitivity(v) === "both").length,
    unreviewed: conjugationsData.filter((v: ConjugatedVerb) => getTransitivity(v) === "unreviewed").length,
  };

  const selectedPair: ConjugatedVerb | undefined = selectedVerb?.transitivityPairId
    ? conjugationsData.find((v: ConjugatedVerb) =>
        v.transitivityPairId === selectedVerb.transitivityPairId &&
        v.transitivityPairRole !== selectedVerb.transitivityPairRole
      )
    : selectedVerb?.pairedVerb
      ? conjugationsData.find((v: ConjugatedVerb) => v.kanji === selectedVerb.pairedVerb?.kanji && v.kana === selectedVerb.pairedVerb?.kana)
      : undefined;

  const levelFilters = ["N5", "N4", "N5/N4"];

if (isLoadingKamus) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <p className="text-[#A3A099] text-sm">
        Memuat kamus konjugasi...
      </p>
    </div>
  );
}

if (kamusLoadError) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <p className="text-[#EAE6DD]">
        {kamusLoadError}
      </p>
      <p className="text-[#A3A099] text-sm">
        Muat ulang halaman untuk mencoba lagi.
      </p>
    </div>
  );
}

return (
    <div className="space-y-6 pb-10 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#EAE6DD]">Kamus Konjugasi</h2>
          <p className="text-[#A3A099] text-sm mt-1">Pelajari perubahan bentuk kata kerja (Godan, Ichidan, Irregular), termasuk pola 〜ている.</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-[#A3A099]" />
        </div>
        <input
          type="text"
          placeholder="Cari kata dasar atau bentuk konjugasi (kanji, kana, romaji, arti)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1E1D1B]/80 border border-[#33312E] text-[#EAE6DD] rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:border-[#C93438] focus:ring-1 focus:ring-[#C93438] transition-all"
        />
        {search.length > 0 && (
          <button onClick={() => setSearch("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#A3A099] hover:text-[#EAE6DD] transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setLevelFilter("all")}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
            levelFilter === "all" ? "bg-[#C93438] border-[#C93438] text-white" : "bg-[#1E1D1B]/80 border-[#33312E] text-[#A3A099] hover:text-[#EAE6DD]"
          }`}
        >
          Semua Level ({conjugationsData.length})
        </button>
        {levelFilters.map((level: string) => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
              levelFilter === level ? "bg-[#B8860B]/20 border-[#B8860B]/60 text-[#E7C46A]" : "bg-[#1E1D1B]/80 border-[#33312E] text-[#A3A099] hover:text-[#EAE6DD]"
            }`}
          >
            {level} ({conjugationsData.filter((v: ConjugatedVerb) => v.jlptLevel === level).length})
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTypeFilter("all")}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
            typeFilter === "all" ? "bg-[#C93438] border-[#C93438] text-white" : "bg-[#1E1D1B]/80 border-[#33312E] text-[#A3A099] hover:text-[#EAE6DD]"
          }`}
        >
          Semua ({conjugationsData.length})
        </button>
        {verbTypes.map((t: string) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider transition-colors ${
              typeFilter === t ? `${typeBadgeClass(t)} ring-1 ring-current` : "bg-[#1E1D1B]/80 border-[#33312E] text-[#A3A099] hover:text-[#EAE6DD]"
            }`}
          >
            {t} ({conjugationsData.filter((v: ConjugatedVerb) => v.type === t).length})
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#817A73]">Transitivitas</p>
        <div className="flex flex-wrap gap-2">
          {transitivityFilters.map((filter: { id: TransitivityFilter; label: string }) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setTransitivityFilter(filter.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                transitivityFilter === filter.id
                  ? filter.id === "transitive"
                    ? "border-sky-400/60 bg-sky-400/15 text-sky-300"
                    : filter.id === "intransitive"
                      ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-300"
                      : "bg-[#C93438] border-[#C93438] text-white"
                  : "bg-[#1E1D1B]/80 border-[#33312E] text-[#A3A099] hover:text-[#EAE6DD]"
              }`}
            >
              {filter.label} ({transitivityCounts[filter.id as keyof typeof transitivityCounts]})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filteredVerbs.map((v: ConjugatedVerb) => {
          const cardImage = imageMap[v.kanji] || bgImages[0];
          const matchingForm = search.trim() ? findMatchingConjugation(v, search) : undefined;
          return (
            <button
              type="button"
              key={`${v.kanji}-${v.kana}`}
              onClick={() => setSelectedVerb(v)}
              aria-label={`Lihat konjugasi ${v.kanji} (${v.meaning})`}
              className="relative bg-[#1E1D1B] text-inherit border border-[#33312E] rounded-xl overflow-hidden px-3 sm:px-4 pt-10 pb-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C93438]/60 hover:-translate-y-0.5 transition-all h-full min-h-[190px] group shadow-xl"
            >
              <img src={cardImage} alt="Background" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/80 to-transparent"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(18,17,16,0.7)_0%,rgba(18,17,16,0.4)_45%,transparent_75%)]"></div>
              <span className="absolute top-3 left-3 z-10 text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#B8860B]/40 bg-[#121110]/70 text-[#E7C46A] backdrop-blur-sm">
                {v.jlptLevel}
              </span>
              <span className={`absolute top-3 right-3 z-10 text-[10px] font-bold px-2 py-0.5 rounded-md border backdrop-blur-sm uppercase tracking-wider ${typeBadgeClass(v.type)}`}>
                {v.type}
              </span>
              <div className="relative z-10 flex flex-col items-center justify-center w-full">
                <div className="w-full mb-3">
                  <FitText maxSize={44} minSize={18} className="font-mincho text-[#EAE6DD] font-bold group-hover:text-[#C93438] transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {v.kanji}
                  </FitText>
                </div>
                <p className="text-sm text-[#EAE6DD]/80 w-full truncate">{v.kana}</p>
                <p className="text-[11px] text-[#A3A099] mb-2 w-full truncate">({v.romaji})</p>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border mb-2 ${transitivityClass(v)}`}>
                  {transitivityLabel(v)}
                </span>
                <p className="text-sm font-bold text-[#EAE6DD] leading-snug line-clamp-2">{v.meaning}</p>
                {matchingForm && (
                  <p className="mt-2 text-[10px] text-[#E7C46A] leading-relaxed">
                    Bentuk cocok: <span className="font-mincho text-xs">{rubyToPlainText(matchingForm.ruby) || matchingForm.kana}</span>
                    <span className="text-[#A3A099]"> · {matchingForm.name}</span>
                  </p>
                )}
              </div>
            </button>
          );
        })}
        {filteredVerbs.length === 0 && (
          <div className="col-span-full text-center py-10 text-[#A3A099]">Tidak ada kata kerja yang cocok dengan filter atau pencarian saat ini.</div>
        )}
      </div>

      {selectedVerb && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedVerb(null)}>
          <div
            ref={panelRef}
            className="bg-[#1A1918] border border-[#33312E] rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90dvh] flex flex-col relative"
            style={{ transform: dragY ? `translateY(${dragY}px)` : undefined, transition: dragging ? "none" : "transform 0.22s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
              <img src={imageMap[selectedVerb.kanji] || bgImages[0]} alt="Bg" className="w-full h-full object-cover opacity-10 scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-[#1A1918]/90 to-transparent"></div>
            </div>

            <div data-sheet-handle className="md:hidden relative z-20 shrink-0 flex justify-center pt-2.5 bg-[#1A1918]/80">
              <span className="h-1 w-10 rounded-full bg-[#4A4743]" />
            </div>

            <div data-sheet-handle className="flex justify-between items-center gap-3 p-4 md:p-5 border-b border-[#33312E] bg-[#1A1918]/80 backdrop-blur-md relative z-20 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-bold px-2 py-1 rounded-md border border-[#B8860B]/40 bg-[#B8860B]/10 text-[#E7C46A] shrink-0">{selectedVerb.jlptLevel}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-md border uppercase shrink-0 ${typeBadgeClass(selectedVerb.type)}`}>{selectedVerb.type}</span>
                <span className="text-sm font-medium text-[#A3A099] truncate">{selectedVerb.meaning}</span>
              </div>
              <button onClick={() => setSelectedVerb(null)} className="text-[#A3A099] hover:text-[#EAE6DD] transition-colors p-1.5 bg-[#262523] rounded-full shrink-0">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar relative z-10">
              <div className="md:sticky md:top-0 md:z-30 p-4 sm:p-5 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 border-b border-[#4A4743] bg-[#1E1D1B]/95 backdrop-blur-xl shadow-xl md:shrink-0">
                <div className="w-full sm:flex-1 sm:max-w-md min-w-0 text-center">
                  <h3 className="mb-1 md:mb-2 drop-shadow-md">
                    <FitText maxSize={88} minSize={28} className="font-mincho text-[#EAE6DD]">{selectedVerb.kanji}</FitText>
                  </h3>
                  <p className="text-xl sm:text-2xl md:text-3xl text-[#C93438] mb-1 font-medium break-words">{selectedVerb.kana}</p>
                  <p className="text-sm md:text-lg text-[#A3A099] break-words">{selectedVerb.romaji}</p>
                </div>
                <div
                  className="relative h-auto min-h-[148px] bg-[#121110] rounded-2xl p-2 flex items-center justify-center border border-[#33312E] shadow-inner shrink-0 overflow-visible"
                  style={{
                    // Lebar mengikuti jumlah kanji; tetap dibatasi lebar layar pada mobile.
                    width: `${Math.max(176, Array.from(String(selectedVerb.kanji ?? "")).filter((char: string) => /[\u4e00-\u9faf\u3400-\u4dbf]/.test(char)).length * 108 + 48)}px`,
                    maxWidth: "100%",
                  }}
                >
                  <KanjiStroke kanji={selectedVerb.kanji} />
                </div>
              </div>

              <section className="px-4 md:px-8 pt-5">
                <h4 className="text-sm font-bold text-[#EAE6DD]">Daftar Konjugasi</h4>
              </section>
              <div className="p-4 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {selectedVerb.forms.map((form: ConjugatedForm) => (
                    <div key={form.id} className={`bg-[#1E1D1B]/90 backdrop-blur-sm border border-[#33312E] border-l-[3px] ${typeAccentClass(selectedVerb.type)} rounded-xl p-4 md:p-5 shadow-lg hover:border-[#C93438]/40 transition-colors flex flex-col h-full`}>
                      <div className="mb-2 md:mb-3">
                        <p className="text-xs md:text-sm font-bold text-[#C93438]">{form.name}</p>
                        <p className="text-[10px] md:text-xs text-[#A3A099]">{form.jpName}</p>
                      </div>
                      <div className="text-2xl md:text-3xl text-[#EAE6DD] font-mincho mb-1 leading-[2.2] break-words [&_rt]:text-[0.5em] [&_rt]:text-[#B8860B]" dangerouslySetInnerHTML={{ __html: form.ruby }} />
                      <p className="text-xs md:text-sm text-[#B8860B] italic mb-3 md:mb-4 break-words">{form.romaji}</p>
                      <div className="mt-auto">
                        <p className="text-[10px] md:text-xs text-[#A3A099] mb-2 border-t border-[#33312E]/80 pt-2 md:pt-3">{form.desc}</p>
                        <div className="text-[10px] md:text-xs text-[#EAE6DD] bg-[#121110]/60 p-2 md:p-2.5 rounded-lg border border-[#33312E]/50 leading-relaxed">
                          <span className="text-[#817A73] block text-[9px] md:text-[10px] uppercase mb-1">Fungsi / makna bentuk</span>
                          {form.meaning}
                        </div>
                        {form.example && (
                          <p className="text-[10px] md:text-xs text-[#EAE6DD] bg-[#121110]/60 p-2 md:p-2.5 mt-2 rounded-lg border border-[#33312E]/50 leading-relaxed">
                            <span className="text-[#817A73] block text-[9px] md:text-[10px] uppercase mb-1">Contoh pemakaian</span>
                            {form.example}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {(selectedVerb.pairedVerb || selectedVerb.transitivityPairId) && (
                <div className="mx-4 md:mx-8 mt-4 p-4 rounded-xl border border-[#33312E] bg-[#121110]/80 relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="text-xs font-bold text-[#EAE6DD]">Pasangan Transitif / Intransitif</p>
                      <p className="text-[10px] text-[#A3A099] mt-0.5">Umumnya, verba intransitif memakai partikel が, sedangkan verba transitif memakai を. Namun, partikel tetap bergantung pada pola kalimat dan konteks.</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${transitivityClass(selectedVerb)}`}>
                      {transitivityLabel(selectedVerb)}
                    </span>
                  </div>
                  {selectedPair ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-2xl font-mincho text-[#EAE6DD]">{selectedPair.kanji}</p>
                        <p className="text-sm text-[#C93438]">{selectedPair.kana} <span className="text-[#A3A099]">({selectedPair.romaji})</span></p>
                        <p className="text-xs text-[#A3A099] mt-1">{selectedPair.meaning}</p>
                        <span className={`inline-flex mt-2 text-[9px] font-bold px-2 py-0.5 rounded-md border ${transitivityClass(selectedPair)}`}>
                          {transitivityLabel(selectedPair)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedVerb(selectedPair)}
                        className="shrink-0 px-3 py-2 rounded-lg border border-[#C93438]/50 bg-[#C93438]/10 text-[#EAE6DD] text-xs font-bold hover:bg-[#C93438]/20 transition-colors"
                      >
                        Lihat konjugasi pasangan
                      </button>
                    </div>
                  ) : selectedVerb.pairedVerb ? (
                    <div>
                      <p className="text-xl font-mincho text-[#EAE6DD]">{selectedVerb.pairedVerb.kanji}</p>
                      <p className="text-xs text-[#A3A099]">{selectedVerb.pairedVerb.kana} · Belum tersedia di database.</p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#A3A099]">Pasangan belum ditambahkan atau belum diverifikasi.</p>
                  )}
                </div>
              )}


              {(selectedVerb.usagePatterns?.length || selectedVerb.examples?.length) ? (
                <div className="mx-4 md:mx-8 mt-4 p-4 rounded-xl border border-[#33312E] bg-[#121110]/80 relative z-10">
                  {selectedVerb.usagePatterns?.length ? (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div>
                          <p className="text-xs font-bold text-[#EAE6DD]">Pola Penggunaan</p>
                          <p className="text-[10px] text-[#A3A099] mt-0.5">Pola inti untuk makna kata kerja ini. Partikel lain dapat muncul sesuai konteks.</p>
                        </div>
                        <span className="text-[9px] text-[#B8860B] border border-[#B8860B]/30 bg-[#B8860B]/10 rounded-md px-2 py-1">Pola umum</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedVerb.usagePatterns.map((pattern: NonNullable<VerbData["usagePatterns"]>[number], index: number) => (
                          <div key={`${pattern.particle}-${pattern.role}-${index}`} className="rounded-lg border border-[#33312E] bg-[#1E1D1B] p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <span className="text-sm font-bold text-[#EAE6DD]">{pattern.pattern || `N ${pattern.particle} V`}</span>
                              <span className="text-[10px] text-[#C93438] font-bold">{pattern.particle}</span>
                            </div>
                            <p className="text-[11px] text-[#B9B3A9]">{pattern.role}</p>
                            {pattern.example && (
                              <p className="text-xs text-[#EAE6DD] mt-2">Contoh: <span className="font-mincho">{pattern.example}</span></p>
                            )}
                            {pattern.note && <p className="text-[10px] text-[#8F8981] mt-1 leading-relaxed">{pattern.note}</p>}
                          </div>
                        ))}
                      </div>
                      {selectedVerb.usagePatternCaveat && (
                        <p className="text-[10px] text-[#8F8981] mt-3 leading-relaxed">{selectedVerb.usagePatternCaveat}</p>
                      )}
                    </>
                  ) : null}

                  {selectedVerb.examples?.length ? (
                    <div className="mt-4 pt-4 border-t border-[#33312E]">
                      <p className="text-xs font-bold text-[#EAE6DD] mb-2">Contoh Kalimat</p>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedVerb.examples.map((example: NonNullable<VerbData["examples"]>[number], index: number) => {
                          const romajiSource = example.furigana || "";
                          const romajiText = example.romaji || (romajiSource ? romanizeExample(romajiSource) : "");
                          return (
                            <div key={`${example.sourceId || "example"}-${index}`} className="rounded-lg border border-[#33312E] bg-[#1E1D1B] p-3">
                              <p className="text-base md:text-lg text-[#EAE6DD] font-mincho leading-relaxed" dangerouslySetInnerHTML={{ __html: furiganaToSafeHtml(example.furigana || example.ja) }} />
                              {romajiText && <p className="text-[10px] text-[#B8860B] italic mt-1 break-words">{romajiText}</p>}
                              <p className="text-xs text-[#D0CAC0] mt-2">{example.translation}</p>
                              {example.sourceUrl && (
                                <a href={example.sourceUrl} target="_blank" rel="noreferrer" className="inline-block text-[9px] text-[#A3A099] underline underline-offset-2 mt-2 hover:text-[#EAE6DD]">
                                  Sumber kalimat: Tatoeba #{example.sourceId}
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#8F8981] mt-3">Contoh kalimat bersumber untuk entri ini belum ditambahkan.</p>
                  )}
                </div>
              ) : null}


            </div>
          </div>
        </div>
      )}
    </div>
  );
}