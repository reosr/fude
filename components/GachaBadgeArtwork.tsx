"use client";

import { useId } from "react";
import type { GachaBadgeDefinition, GachaEvolutionLevel } from "@/lib/gacha";

const PALETTES: Record<
  GachaBadgeDefinition["rarity"],
  { base: string; light: string; dark: string; glow: string; accent: string }
> = {
  common: { base: "#858984", light: "#E7E9E1", dark: "#343B38", glow: "#AEB9AF", accent: "#C5C9B9" },
  uncommon: { base: "#3E9B72", light: "#C5F3D9", dark: "#123F30", glow: "#70D9A5", accent: "#A1E7BE" },
  rare: { base: "#397FBD", light: "#C8E5FF", dark: "#142E50", glow: "#70B8F4", accent: "#9BD6FF" },
  epic: { base: "#8954C5", light: "#E5D0FF", dark: "#321A54", glow: "#B78AF2", accent: "#D1B0FF" },
  mythic: { base: "#BD8A2B", light: "#FFF0B0", dark: "#50370F", glow: "#F5CE68", accent: "#FFE39A" },
  legendary: { base: "#B83E4A", light: "#FFD0B9", dark: "#4A111C", glow: "#FF777A", accent: "#FFB18D" },
};

const RARITY_ORDER: GachaBadgeDefinition["rarity"][] = [
  "common", "uncommon", "rare", "epic", "mythic", "legendary",
];

const CRESTS = [
  "M50 8 L60 24 L79 17 L76 37 L94 50 L76 63 L79 83 L60 76 L50 92 L40 76 L21 83 L24 63 L6 50 L24 37 L21 17 L40 24 Z",
  "M50 8 C64 25 82 27 89 45 C97 66 72 88 50 93 C28 88 3 66 11 45 C18 27 36 25 50 8 Z",
  "M50 8 L91 36 L77 82 L50 94 L23 82 L9 36 Z M50 8 L50 94 M9 36 L91 36 M23 82 L77 82",
  "M50 8 C62 25 77 27 92 37 C78 51 78 66 91 84 C69 79 59 83 50 94 C41 83 31 79 9 84 C22 66 22 51 8 37 C23 27 38 25 50 8 Z",
  "M50 8 C74 8 92 27 92 50 C92 73 74 92 50 92 C26 92 8 73 8 50 C8 27 26 8 50 8 Z",
  "M50 7 L63 31 L91 36 L70 56 L75 87 L50 72 L25 87 L30 56 L9 36 L37 31 Z",
  "M50 7 Q64 27 88 24 Q75 49 94 70 Q65 67 50 94 Q35 67 6 70 Q25 49 12 24 Q36 27 50 7 Z",
  "M50 8 L82 20 L94 50 L82 80 L50 92 L18 80 L6 50 L18 20 Z M18 20 L82 80 M82 20 L18 80",
  "M50 8 C61 28 78 32 93 50 C78 68 61 72 50 92 C39 72 22 68 7 50 C22 32 39 28 50 8 Z",
  "M50 7 L61 26 L82 17 L76 39 L94 50 L76 61 L82 83 L61 74 L50 93 L39 74 L18 83 L24 61 L6 50 L24 39 L18 17 L39 26 Z",
] as const;

const SIGILS = [
  "M50 23 C61 32 69 42 63 55 C59 64 53 69 50 76 C47 69 41 64 37 55 C31 42 39 32 50 23 Z",
  "M27 43 Q39 25 50 42 Q61 25 73 43 L66 63 L50 76 L34 63 Z",
  "M31 31 L43 42 L50 30 L57 42 L69 31 L73 57 Q50 82 27 57 Z",
  "M25 49 Q38 35 50 49 Q62 35 75 49 Q62 64 50 70 Q38 64 25 49 Z",
  "M50 25 L57 43 L76 50 L57 57 L50 76 L43 57 L24 50 L43 43 Z",
  "M32 35 Q50 19 68 35 L64 62 L50 77 L36 62 Z M38 46 L62 46 M40 56 L60 56",
] as const;

const ORNAMENT_LAYOUTS = [
  [[50, 15], [85, 50], [50, 85], [15, 50]],
  [[50, 13], [76, 24], [87, 50], [76, 76], [50, 87], [24, 76], [13, 50], [24, 24]],
  [[50, 14], [82, 34], [70, 79], [30, 79], [18, 34]],
  [[50, 15], [83, 39], [68, 82], [32, 82], [17, 39]],
  [[50, 15], [82, 50], [50, 85], [18, 50], [50, 15], [50, 50]],
] as const;

const RAY_SETS = [
  "M50 4 L50 10 M50 90 L50 96 M4 50 L10 50 M90 50 L96 50",
  "M50 4 L52 11 M50 89 L48 96 M4 50 L11 48 M89 50 L96 52 M18 18 L23 23 M77 77 L82 82 M82 18 L77 23 M23 77 L18 82",
  "M50 3 L53 12 M50 88 L47 97 M3 50 L12 47 M88 50 L97 53 M25 5 L29 14 M75 95 L71 86 M95 25 L86 29 M5 75 L14 71",
] as const;

export default function GachaBadgeArtwork({
  badge,
  level = 1,
  size = 76,
}: {
  badge: GachaBadgeDefinition;
  level?: GachaEvolutionLevel;
  size?: number;
}) {
  const uniqueId = useId().replace(/:/g, "");
  const palette = PALETTES[badge.rarity];
  const match = badge.id.match(/-(\\d{2})$/);
  const badgeNumber = match ? Number(match[1]) : 1;
  const rarityIndex = RARITY_ORDER.indexOf(badge.rarity);
  // Mix rarity and catalog position so the same folklore archetype is not
  // forced into one identical medallion layout throughout the full catalog.
  const seed = rarityIndex * 17 + badgeNumber * 7;
  const crestIndex = seed % CRESTS.length;
  const sigilIndex = Math.floor(seed / 3) % SIGILS.length;
  const layoutIndex = Math.floor(seed / 5) % ORNAMENT_LAYOUTS.length;
  const rayIndex = seed % RAY_SETS.length;
  const gradientId = `gacha-gradient-${uniqueId}`;
  const glowId = `gacha-glow-${uniqueId}`;
  const ornamentPoints = ORNAMENT_LAYOUTS[layoutIndex];

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={`${badge.name}, ${badge.rarity}, Level ${level}`}
      className="shrink-0 overflow-visible"
    >
      <defs>
        <radialGradient id={gradientId} cx="34%" cy="24%" r="82%">
          <stop offset="0%" stopColor={palette.base} />
          <stop offset="48%" stopColor={palette.dark} />
          <stop offset="100%" stopColor="#090B0B" />
        </radialGradient>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor={palette.glow} stopOpacity="0.3" />
          <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="49" fill={`url(#${glowId})`} />
      {level >=3 && (
        <circle cx="50" cy="50" r="48" fill="none" stroke={palette.glow} strokeWidth="1.4" strokeDasharray="1.5 2.5" />
      )}
      {level >=3 && (
        <circle cx="50" cy="50" r="44.5" fill="none" stroke={palette.light} strokeWidth="0.9" opacity="0.75" />
      )}

      <circle cx="50" cy="50" r="42" fill="#101313" stroke={palette.dark} strokeWidth="2.5" />
      <circle cx="50" cy="50" r="39" fill={`url(#${gradientId})`} stroke={palette.light} strokeWidth={level >=2 ? 3 : 2} />
      <circle cx="50" cy="50" r="34.5" fill="none" stroke={palette.accent} strokeWidth="0.8" opacity="0.8" />
      <circle cx="50" cy="50" r="31.5" fill="none" stroke={palette.glow} strokeWidth="1" strokeDasharray={seed % 2 === 0 ? "2 3" : "5 2"} opacity="0.9" />

      <path d={RAY_SETS[rayIndex]} fill="none" stroke={palette.light} strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
      <path
        d={CRESTS[crestIndex]}
        fill={palette.base}
        fillOpacity="0.14"
        stroke={palette.light}
        strokeWidth={crestIndex % 3 === 0 ? 1.8 : 1.25}
        strokeLinejoin="round"
      />
      <path
        d={SIGILS[sigilIndex]}
        fill={palette.dark}
        fillOpacity="0.72"
        stroke={palette.glow}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {ornamentPoints.map(([x, y], index) => (
        <g key={index}>
          <circle cx={x} cy={y} r={level >=3 ? 3 : 2.2} fill={palette.light} stroke={palette.dark} strokeWidth="0.8" />
          {level >=2 && (
            <path
              d={`M ${x} ${y - 5} L ${x + 1.4} ${y - 1.4} L ${x + 5} ${y} L ${x + 1.4} ${y + 1.4} L ${x} ${y + 5} L ${x - 1.4} ${y + 1.4} L ${x - 5} ${y} L ${x - 1.4} ${y - 1.4} Z`}
              fill="none"
              stroke={palette.light}
              strokeWidth="0.7"
              opacity="0.9"
            />
          )}
        </g>
      ))}

      <circle cx="50" cy="50" r="17.5" fill={palette.dark} stroke={palette.light} strokeWidth={level >=2 ? 2 : 1.2} />
      <circle cx="50" cy="50" r="13.5" fill={palette.base} fillOpacity="0.42" />
      <text x="50" y="57" textAnchor="middle" fontSize="21" style={{ userSelect: "none" }}>
        {badge.icon}
      </text>

      {level >=2 && (
        <path d="M50 3 L52.5 9.5 L59 12 L52.5 14.5 L50 21 L47.5 14.5 L41 12 L47.5 9.5 Z" fill={palette.light} stroke={palette.dark} strokeWidth="0.7" />
      )}
      {level >=3 && (
        <>
          <path d="M5 50 L11 47.5 L13.5 41 L16 47.5 L22 50 L16 52.5 L13.5 59 L11 52.5 Z" fill={palette.light} />
          <path d="M95 50 L89 47.5 L86.5 41 L84 47.5 L78 50 L84 52.5 L86.5 59 L89 52.5 Z" fill={palette.light} />
        </>
      )}
      {level >=3 && (
        <path d="M50 78 L53 86 L61 89 L53 92 L50 100 L47 92 L39 89 L47 86 Z" fill={palette.light} stroke={palette.dark} strokeWidth="1" />
      )}
    </svg>
  );
}
