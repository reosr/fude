export type VocabIdentity = {
  kanji: string;
  kana: string;
};

export function normalizeVocabIdentityPart(value: string): string {
  return (value || "")
    .normalize("NFKC")
    .replace(/[\s\u3000]/g, "")
    .replace(/[ã€œï½žâˆ¼]/g, "~");
}

export function getVocabIdentityKey(vocab: VocabIdentity): string {
  return normalizeVocabIdentityPart(vocab.kanji) + "-" + normalizeVocabIdentityPart(vocab.kana);
}

export const MEMORIZED_VOCAB_KEY_PREFIX = "v2:";

export function getMemorizedVocabKey(vocab: VocabIdentity): string {
  return MEMORIZED_VOCAB_KEY_PREFIX + getVocabIdentityKey(vocab);
}

export function isMemorizedVocabKey(value: string): boolean {
  return value.startsWith(MEMORIZED_VOCAB_KEY_PREFIX);
}
