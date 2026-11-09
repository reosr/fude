"use client";

import { useId } from "react";
import type { GachaBadgeDefinition, GachaEvolutionLevel } from "@/lib/gacha";

const PALETTES: Record<
  GachaBadgeDefinition["rarity"],
  { base: string; light: string; dark: string; glow: string }
> = {
  common: { base: "#9A9A96", light: "#E6E5DF", dark: "#444541", glow: "#B9B8AE" },
  uncommon: { base: "#45A879", light: "#C5F4D9", dark: "#174C37", glow: "#73D9A5" },
  rare: { base: "#4D8FD4", light: "#C8E5FF", dark: "#17375D", glow: "#70B8F4" },
  epic: { base: "#9561D4", light: "#E3CCFF", dark: "#3B205E", glow: "#B78AF2" },
  mythic: { base: "#C99A36", light: "#FFF0B0", dark: "#604315", glow: "#F5CE68" },
  legendary: { base: "#C94B4E", light: "#FFD0B9", dark: "#5C171D", glow: "#FF777A" },
};

const CRESTS = [
  "M50 13 L58 28 L75 21 L72 40 L89 50 L72 60 L75 79 L58 72 L50 87 L42 72 L25 79 L28 60 L11 50 L28 40 L25 21 L42 28 Z",
  "M50 12 C61 27 79 29 84 47 C89 67 69 84 50 88 C31 84 11 67 16 47 C21 29 39 27 50 12 Z",
  "M50 12 L84 35 L73 78 L50 88 L27 78 L16 35 Z M50 12 L50 88 M16 35 L84 35 M27 78 L73 78",
  "M50 12 C59 27 72 27 85 37 C72 48 72 62 85 75 C68 73 58 78 50 89 C42 78 32 73 15 75 C28 62 28 48 15 37 C28 27 41 27 50 12 Z",
  "M50 12 C68 12 86 29 86 50 C86 71 68 88 50 88 C32 88 14 71 14 50 C14 29 32 12 50 12 Z",
  "M50 12 L61 35 L86 39 L68 57 L72 83 L50 70 L28 83 L32 57 L14 39 L39 35 Z",
  "M50 12 Q61 28 83 27 Q72 48 87 66 Q62 65 50 88 Q38 65 13 66 Q28 48 17 27 Q39 28 50 12 Z",
  "M50 12 L80 25 L88 50 L80 75 L50 88 L20 75 L12 50 L20 25 Z M20 25 L80 75 M80 25 L20 75",
  "M50 12 C58 28 75 32 88 50 C75 68 58 72 50 88 C42 72 25 68 12 50 C25 32 42 28 50 12 Z",
  "M50 12 L59 30 L78 22 L73 42 L90 50 L73 58 L78 78 L59 70 L50 88 L41 70 L22 78 L27 58 L10 50 L27 42 L22 22 L41 30 Z",
] as const;

const ARCHETYPE_MARKS = [
  "M34 45 L39 27 L50 39 L61 27 L66 45 Q64 62 50 68 Q36 62 34 45 Z",
  "M50 27 C61 40 68 47 50 70 C32 47 39 40 50 27 Z",
  "M25 43 Q37 25 50 42 Q63 25 75 43 L68 65 L50 72 L32 65 Z",
  "M31 39 Q42 45 50 33 Q58 45 69 39 L64 65 Q50 76 36 65 Z",
  "M34 33 L43 42 L50 34 L57 42 L66 33 L70 59 Q50 79 30 59 Z",
] as const;

const ORNAMENTS = [
  [[50, 18], [82, 50], [50, 82], [18, 50]],
  [[50, 16], [76, 24], [84, 50], [76, 76], [50, 84], [24, 76], [16, 50], [24, 24]],
  [[50, 17], [78, 35], [67, 76], [33, 76], [22, 35]],
  [[50, 16], [82, 38], [70, 78], [30, 78], [18, 38]],
  [[50, 18], [80, 50], [50, 82], [20, 50], [50, 18]],
] as const;

export default function GachaBadgeArtwork({
  badge,
  level = 0,
  size = 76,
}: {
  badge: GachaBadgeDefinition;
  level?: GachaEvolutionLevel;
  size?: number;
}) {
  const uniqueId = useId().replace(/:/g, "");
  const palette = PALETTES[badge.rarity];
  const match = badge.id.match(/-(\d{2})$/);
  const badgeNumber = match ? Number(match[1]) : 1;
  const motifIndex = (badgeNumber - 1) % CRESTS.length;
  const archetypeIndex = Math.floor((badgeNumber - 1) / 10) % ARCHETYPE_MARKS.length;
  const gradientId = `gacha-gradient-${uniqueId}`;
  const ornamentPoints = ORNAMENTS[archetypeIndex];

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
        <radialGradient id={gradientId} cx="35%" cy="25%" r="80%">
          <stop offset="0%" stopColor={palette.base} stopOpacity="0.95" />
          <stop offset="58%" stopColor={palette.dark} />
          <stop offset="100%" stopColor="#11100F" />
        </radialGradient>
      </defs>

      {level >= 3 && (
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke={palette.glow}
          strokeWidth="1.5"
          opacity="0.8"
          strokeDasharray="2 3"
        />
      )}
      {level >= 2 && (
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke={palette.light}
          strokeWidth="1"
          opacity="0.65"
        />
      )}

      <circle
        cx="50"
        cy="50"
        r="40"
        fill={`url(#${gradientId})`}
        stroke={palette.light}
        strokeWidth={level >= 1 ? 3 : 2}
      />
      <circle
        cx="50"
        cy="50"
        r="34"
        fill="none"
        stroke={palette.glow}
        strokeWidth="1"
        strokeDasharray={motifIndex % 2 === 0 ? "2 3" : "5 2"}
        opacity="0.8"
      />

      <path
        d={CRESTS[motifIndex]}
        fill={palette.base}
        fillOpacity="0.17"
        stroke={palette.light}
        strokeWidth={motifIndex % 3 === 0 ? 1.8 : 1.2}
        strokeLinejoin="round"
      />

      <path
        d={ARCHETYPE_MARKS[archetypeIndex]}
        fill={palette.dark}
        fillOpacity="0.55"
        stroke={palette.glow}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {ornamentPoints.map(([x, y], index) => (
        <g key={index}>
          <circle
            cx={x}
            cy={y}
            r={level >= 2 ? 3 : 2.2}
            fill={palette.light}
            stroke={palette.dark}
            strokeWidth="0.8"
          />
          {level >= 1 && (
            <path
              d={`M ${x} ${y - 5} L ${x + 1.5} ${y - 1.5} L ${x + 5} ${y} L ${x + 1.5} ${y + 1.5} L ${x} ${y + 5} L ${x - 1.5} ${y + 1.5} L ${x - 5} ${y} L ${x - 1.5} ${y - 1.5} Z`}
              fill="none"
              stroke={palette.light}
              strokeWidth="0.7"
              opacity="0.8"
            />
          )}
        </g>
      ))}

      <circle
        cx="50"
        cy="50"
        r="18"
        fill={palette.dark}
        stroke={palette.light}
        strokeWidth={level >= 1 ? 2 : 1.2}
      />
      <circle cx="50" cy="50" r="14" fill={palette.base} fillOpacity="0.35" />
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fontSize="22"
        style={{ userSelect: "none" }}
      >
        {badge.icon}
      </text>

      {level >= 1 && (
        <path
          d="M50 5 L52 10 L58 12 L52 14 L50 20 L48 14 L42 12 L48 10 Z"
          fill={palette.light}
          stroke={palette.dark}
          strokeWidth="0.7"
        />
      )}
      {level >= 2 && (
        <>
          <path d="M8 50 L13 48 L15 43 L17 48 L22 50 L17 52 L15 57 L13 52 Z" fill={palette.light} />
          <path d="M92 50 L87 48 L85 43 L83 48 L78 50 L83 52 L85 57 L87 52 Z" fill={palette.light} />
        </>
      )}
      {level >= 3 && (
        <path
          d="M50 80 L53 87 L61 90 L53 93 L50 100 L47 93 L39 90 L47 87 Z"
          fill={palette.light}
          stroke={palette.dark}
          strokeWidth="1"
        />
      )}
    </svg>
  );
}
