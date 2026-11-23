"use client";

interface Props {
  reading: string;
  kanaClassName?: string;
  romajiClassName?: string;
  wrapperClassName?: string;
}

export default function JapaneseVocabularyReading({
  reading,
  kanaClassName = "mt-1 font-mincho text-sm leading-relaxed text-[#D6AD4F]",
  romajiClassName = "mt-0.5 text-xs italic leading-relaxed text-[#A9A398]",
  wrapperClassName = "",
}: Props) {
  const parts = reading.split(/\s*[·•]\s*/);
  const kana = (parts[0] ?? "").trim();
  const romaji = parts.slice(1).join(" · ").trim();

  return (
    <span className={"block min-w-0 " + wrapperClassName}>
      {kana && <span className={kanaClassName + " block"}>（{kana}）</span>}
      {romaji && <span className={romajiClassName + " block"}>{romaji}</span>}
    </span>
  );
}
