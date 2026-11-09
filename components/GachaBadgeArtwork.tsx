"use client";

import Image from "next/image";
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
  const artworkSrc = badge.artwork?.[level];

  // Mochi Guardian evolution previews: each level gets a distinct silhouette and finish.
  if (badge.id === "bab-1" && level === 2) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} role="img" aria-label="Mochi Guardian, Common, Level 2 — Blooming Guardian" className="shrink-0 overflow-visible drop-shadow-[0_8px_12px_rgba(0,0,0,0.48)]">
        <defs>
          <linearGradient id={`mochi2-silver-${uniqueId}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFFFFF"/><stop offset=".34" stopColor="#D9E0DF"/><stop offset=".72" stopColor="#879493"/><stop offset="1" stopColor="#F2F3EC"/></linearGradient>
          <linearGradient id={`mochi2-jade-${uniqueId}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#75B99A"/><stop offset=".5" stopColor="#286B58"/><stop offset="1" stopColor="#123C35"/></linearGradient>
          <linearGradient id={`mochi2-body-${uniqueId}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FFFDF1"/><stop offset="1" stopColor="#D9C7A6"/></linearGradient>
          <radialGradient id={`mochi2-aura-${uniqueId}`}><stop offset="0%" stopColor="#EAF5F1" stopOpacity=".5"/><stop offset="48%" stopColor="#C8D9D4" stopOpacity=".25"/><stop offset="100%" stopColor="#C8D9D4" stopOpacity="0"/></radialGradient>
          <filter id={`mochi2-aura-blur-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
        </defs>
        <ellipse cx="64" cy="64" rx="58" ry="55" fill={`url(#mochi2-aura-${uniqueId})`} filter={`url(#mochi2-aura-blur-${uniqueId})`}/>
        <path d="M64 4 C74 15 84 13 91 22 C103 21 108 32 106 43 C119 52 119 67 108 76 C111 91 101 102 87 101 C80 116 68 119 58 108 C45 118 31 111 31 98 C16 96 11 82 20 70 C8 58 15 43 27 39 C25 24 39 15 50 21 Z" fill={`url(#mochi2-silver-${uniqueId})`} stroke="#566361" strokeWidth="2.5"/>
        <path d="M64 12 C73 23 82 20 87 29 C99 28 101 39 98 47 C110 56 109 66 99 74 C103 86 94 94 82 92 C76 105 66 108 58 98 C47 107 36 101 37 89 C24 88 21 77 29 68 C19 58 25 47 36 43 C34 31 44 24 53 29 Z" fill={`url(#mochi2-jade-${uniqueId})`} stroke="#F4F5EE" strokeWidth="1.8"/>
        <g fill="#F5C8CF" stroke="#FFF0D7" strokeWidth="1"><path d="M25 45 C17 34 29 29 33 39 C42 30 48 42 37 48 C47 55 36 64 31 54 C21 63 13 51 25 45Z"/><path d="M91 39 C83 28 95 23 99 33 C108 24 114 36 103 42 C113 49 102 58 97 48 C87 57 79 45 91 39Z"/></g>
        <g fill="#E8C875"><circle cx="32" cy="47" r="2.4"/><circle cx="98" cy="41" r="2.4"/><path d="M64 14l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></g>
        <path d="M43 39 C39 31 45 23 54 25 C57 15 70 15 74 25 C84 21 91 30 84 39 C78 45 50 46 43 39Z" fill="#9CBF79" stroke="#55744E" strokeWidth="1.8"/>
        <path d="M57 29 Q49 17 55 13 Q67 12 65 29 Q72 12 82 17 Q85 29 65 34" fill="#C7DDA0" stroke="#55744E" strokeWidth="1.5"/>
        <path d="M43 44 C36 55 37 76 45 88 C53 101 77 100 86 87 C94 74 91 53 81 43 C72 34 52 35 43 44Z" fill={`url(#mochi2-body-${uniqueId})`} stroke="#8B7759" strokeWidth="2"/>
        <ellipse cx="49" cy="68" rx="7" ry="4" fill="#F49A91" opacity=".45"/><ellipse cx="79" cy="68" rx="7" ry="4" fill="#F49A91" opacity=".45"/>
        <ellipse cx="54" cy="62" rx="2.5" ry="3.4" fill="#403C35"/><ellipse cx="74" cy="62" rx="2.5" ry="3.4" fill="#403C35"/><path d="M60 70 Q64 75 68 70" fill="none" stroke="#9B6C5C" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M39 80 Q64 91 89 78 L85 89 Q64 101 43 91Z" fill="#B86E61" stroke="#815342" strokeWidth="1.5"/>
        <path d="M64 81l8 7-8 9-8-9Z" fill="#F7D98E" stroke="#9B713A" strokeWidth="1.2"/>
        <path d="M31 68 Q20 67 22 78 Q26 85 37 81 M92 67 Q104 66 102 78 Q98 85 87 81" fill="none" stroke="#D9C8A9" strokeWidth="5" strokeLinecap="round"/>
        <path d="M48 98 Q64 108 80 98" fill="none" stroke="#F4DDA8" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M17 68l3 6 6 2-6 3-3 6-3-6-6-3 6-2z M110 66l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#FFF0C9"/>
      </svg>
    );
  }

  if (badge.id === "bab-1" && level === 3) {
    return (
      <svg viewBox="0 0 128 128" width={size} height={size} role="img" aria-label="Mochi Guardian, Common, Level 3 — Celestial Guardian" className="shrink-0 overflow-visible drop-shadow-[0_9px_15px_rgba(0,0,0,0.55)]">
        <defs>
          <linearGradient id={`mochi3-silver-${uniqueId}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFFFFF"/><stop offset=".22" stopColor="#E9F0EF"/><stop offset=".48" stopColor="#AEBDBB"/><stop offset=".72" stopColor="#71817F"/><stop offset="1" stopColor="#F9F7EF"/></linearGradient>
          <linearGradient id={`mochi3-enamel-${uniqueId}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6A9F91"/><stop offset=".5" stopColor="#24594F"/><stop offset="1" stopColor="#102D32"/></linearGradient>
          <linearGradient id={`mochi3-body-${uniqueId}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FFFFFF"/><stop offset=".65" stopColor="#F4EBD8"/><stop offset="1" stopColor="#D5C09C"/></linearGradient>
          <radialGradient id={`mochi3-aura-${uniqueId}`}><stop offset="0%" stopColor="#FFFFFF" stopOpacity=".68"/><stop offset="46%" stopColor="#E5F0EC" stopOpacity=".42"/><stop offset="78%" stopColor="#C8DAD5" stopOpacity=".2"/><stop offset="100%" stopColor="#C8DAD5" stopOpacity="0"/></radialGradient>
          <filter id={`mochi3-aura-blur-${uniqueId}`} x="-55%" y="-55%" width="210%" height="210%"><feGaussianBlur stdDeviation="10"/></filter>
        </defs>
        <ellipse cx="64" cy="64" rx="63" ry="60" fill={`url(#mochi3-aura-${uniqueId})`} filter={`url(#mochi3-aura-blur-${uniqueId})`}/>
        <circle cx="64" cy="64" r="57" fill="none" stroke="#DCE5E2" strokeWidth="1.5" strokeDasharray="2 4"/>
        <circle cx="64" cy="64" r="50" fill="none" stroke="#F8FAF5" strokeWidth="2" opacity=".95"/>
        <path d="M64 3 L75 17 L93 12 L96 31 L115 40 L106 58 L121 73 L103 86 L105 106 L84 105 L64 124 L46 106 L25 111 L24 91 L7 79 L18 62 L7 44 L27 34 L30 14 L49 19Z" fill={`url(#mochi3-silver-${uniqueId})`} stroke="#52615F" strokeWidth="2.4" strokeLinejoin="round"/>
        <path d="M64 11 L74 24 L90 20 L92 36 L108 44 L100 60 L112 73 L97 84 L98 100 L81 99 L64 115 L48 99 L31 103 L31 87 L16 77 L25 62 L16 47 L33 39 L35 23 L50 27Z" fill={`url(#mochi3-enamel-${uniqueId})`} stroke="#F7FAF4" strokeWidth="1.7"/>
        <g fill="#F4C7CF" stroke="#FFF4DE" strokeWidth="1"><path d="M25 48 C17 37 29 31 34 41 C43 32 49 44 38 51 C48 58 36 67 31 57 C20 66 13 54 25 48Z"/><path d="M91 45 C83 34 95 28 100 38 C109 29 115 41 104 48 C114 55 102 64 97 54 C86 63 79 51 91 45Z"/></g>
        <g fill="#F8D987"><path d="M64 12l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/><path d="M19 77l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><path d="M109 76l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></g>
        <path d="M42 42 C37 32 45 24 55 28 C57 17 71 17 75 28 C87 24 93 35 84 44 C74 52 51 51 42 42Z" fill="#B6D28C" stroke="#59784C" strokeWidth="1.8"/>
        <path d="M56 31 Q45 17 53 12 Q65 11 65 30 Q73 12 84 18 Q87 31 66 36" fill="#D7E8AC" stroke="#59784C" strokeWidth="1.5"/>
        <path d="M43 47 C33 59 36 83 46 96 C56 108 76 106 85 93 C95 79 92 56 81 46 C71 37 52 38 43 47Z" fill={`url(#mochi3-body-${uniqueId})`} stroke="#8B7759" strokeWidth="2.1"/>
        <path d="M45 51 Q64 41 82 53" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
        <ellipse cx="49" cy="73" rx="8" ry="5" fill="#EF9994" opacity=".42"/><ellipse cx="80" cy="73" rx="8" ry="5" fill="#EF9994" opacity=".42"/>
        <ellipse cx="55" cy="67" rx="2.6" ry="3.6" fill="#37362F"/><ellipse cx="75" cy="67" rx="2.6" ry="3.6" fill="#37362F"/><path d="M60 76 Q65 81 70 76" fill="none" stroke="#A16D5B" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M39 86 Q64 99 90 84 L86 96 Q64 108 43 97Z" fill="#C98578" stroke="#815342" strokeWidth="1.4"/>
        <path d="M64 87l9 8-9 10-9-10Z" fill="#FFE9A8" stroke="#A77A3C" strokeWidth="1.4"/><path d="M64 91l4 4-4 5-4-5Z" fill="#4D7864"/>
        <path d="M31 72 Q16 66 17 83 Q21 92 38 88 M94 72 Q109 66 111 83 Q107 92 90 88" fill="none" stroke="#E8D8B9" strokeWidth="5" strokeLinecap="round"/>
        <path d="M42 105 Q64 116 86 104" fill="none" stroke="#FFF0C9" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M64 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2z M4 58l2 5 5 2-5 2-2 5-2-5-5-2 5-2z M119 57l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#FFF7D8"/>
        <g fill="#FFFFFF" opacity=".98">
          <path d="M18 17l2.2 5.8L26 25l-5.8 2.2L18 33l-2.2-5.8L10 25l5.8-2.2z"/>
          <path d="M109 17l1.8 4.7 4.7 1.8-4.7 1.8-1.8 4.7-1.8-4.7-4.7-1.8 4.7-1.8z"/>
          <circle cx="13" cy="94" r="1.7"/><circle cx="115" cy="96" r="1.7"/>
        </g>
      </svg>
    );
  }

  // First individually art-directed prototype: Mochi Guardian (Level 1).
  // Keep this bespoke enamel-pin treatment isolated until the visual direction is approved.
  if (badge.id === "bab-1" && level === 1) {
    return (
      <svg
        viewBox="0 0 128 128"
        width={size}
        height={size}
        role="img"
        aria-label="Mochi Guardian, Common, Level 1"
        className="shrink-0 overflow-visible drop-shadow-[0_7px_10px_rgba(0,0,0,0.42)]"
      >
        <defs>
          <linearGradient id={`mochi-silver-${uniqueId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="32%" stopColor="#D8DEDA" />
            <stop offset="66%" stopColor="#7F8985" />
            <stop offset="100%" stopColor="#F3F2E9" />
          </linearGradient>
          <linearGradient id={`mochi-enamel-${uniqueId}`} x1="0" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#3C796C" />
            <stop offset="55%" stopColor="#205247" />
            <stop offset="100%" stopColor="#102F2B" />
          </linearGradient>
          <linearGradient id={`mochi-body-${uniqueId}`} x1="0.15" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#FFFDF1" />
            <stop offset="58%" stopColor="#F4E9D0" />
            <stop offset="100%" stopColor="#D9C7A6" />
          </linearGradient>
          <radialGradient id={`mochi-cheek-${uniqueId}`}>
            <stop offset="0%" stopColor="#F49A91" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#F49A91" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Die-cast pin silhouette and raised metallic rim */}
        <path
          d="M64 5 C72 5 77 13 84 15 C92 17 102 14 107 21 C112 28 107 38 111 46 C115 54 124 59 122 68 C120 77 109 81 106 89 C103 97 106 107 98 112 C90 117 81 110 73 114 C65 118 59 126 50 122 C41 119 39 108 31 104 C23 100 12 102 8 94 C4 86 12 77 10 68 C8 59 1 52 5 43 C9 35 20 34 25 27 C30 20 31 10 40 8 C49 6 56 13 64 5 Z"
          fill={`url(#mochi-silver-${uniqueId})`}
          stroke="#59615D"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M64 11 C72 11 77 19 83 21 C91 23 99 20 103 26 C107 32 102 40 106 47 C110 54 118 59 116 67 C114 75 104 79 101 86 C98 94 101 102 94 106 C87 110 79 104 72 108 C64 112 59 119 51 115 C43 112 41 102 34 98 C27 94 18 96 14 89 C10 82 18 74 16 67 C14 59 8 53 12 45 C16 38 25 37 30 30 C35 24 35 16 43 14 C51 12 57 18 64 11 Z"
          fill={`url(#mochi-enamel-${uniqueId})`}
          stroke="#F5F6EF"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M23 37 C31 24 43 20 55 21" fill="none" stroke="#B9D7B8" strokeWidth="2" strokeLinecap="round" opacity="0.48" />

        {/* Tiny sakura ornaments */}
        <g fill="#F5C6C2" stroke="#FFF0D7" strokeWidth="0.8">
          <path d="M27 47 C23 41 27 37 31 42 C35 36 40 40 36 46 C43 47 42 53 35 53 C35 60 29 59 29 53 C22 56 19 51 27 47 Z" />
          <circle cx="31" cy="48" r="2" fill="#D79A56" stroke="none" />
          <path d="M93 43 C89 37 93 33 97 38 C101 32 106 36 102 42 C109 43 108 49 101 49 C101 56 95 55 95 49 C88 52 85 47 93 43 Z" />
          <circle cx="97" cy="44" r="2" fill="#D79A56" stroke="none" />
        </g>
        <g fill="#E7C879" opacity="0.95">
          <path d="M25 77 l2.2 4.5 4.8.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8-3.5-3.4 4.8-.7z" />
          <path d="M101 76 l1.7 3.5 3.8.6-2.8 2.7.7 3.8-3.4-1.8-3.4 1.8.7-3.8-2.8-2.7 3.8-.6z" />
        </g>

        {/* Mochi guardian: soft rice-cake body with a little sprout */}
        <path d="M47 34 C45 27 49 20 56 18 C63 16 69 21 69 28 C76 25 82 29 82 36 C92 43 96 57 93 72 C91 87 80 97 64 98 C48 99 36 90 34 75 C31 60 36 44 47 34 Z"
          fill={`url(#mochi-body-${uniqueId})`}
          stroke="#8B7759"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
        <path d="M48 35 C48 29 52 24 57 23 C61 22 65 25 65 31 C70 28 76 31 76 37" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <path d="M58 23 C55 15 59 10 66 12 C72 14 74 20 69 25 C67 20 63 19 58 23 Z" fill="#9DBB78" stroke="#55744E" strokeWidth="1.5" />
        <path d="M66 22 C69 14 77 14 80 19 C82 24 76 29 68 27" fill="#C3D59A" stroke="#55744E" strokeWidth="1.3" />
        <path d="M64 24 Q69 18 76 19" fill="none" stroke="#EFF4D3" strokeWidth="1.3" strokeLinecap="round" />

        {/* Face and rosy cheeks */}
        <ellipse cx="49" cy="65" rx="8" ry="5" fill={`url(#mochi-cheek-${uniqueId})`} />
        <ellipse cx="79" cy="65" rx="8" ry="5" fill={`url(#mochi-cheek-${uniqueId})`} />
        <ellipse cx="54" cy="59" rx="2.2" ry="3.2" fill="#403C35" />
        <ellipse cx="74" cy="59" rx="2.2" ry="3.2" fill="#403C35" />
        <circle cx="54.7" cy="57.8" r="0.8" fill="#FFFFFF" />
        <circle cx="74.7" cy="57.8" r="0.8" fill="#FFFFFF" />
        <path d="M61 66 Q64 69 67 66" fill="none" stroke="#9B6C5C" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M43 52 Q45 48 49 47 M79 47 Q83 48 85 52" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.72" />

        {/* Little guardian sash and chest crest */}
        <path d="M39 78 Q63 86 88 76 L85 85 Q62 96 42 87 Z" fill="#C77D65" stroke="#815342" strokeWidth="1.3" />
        <path d="M64 78 L70 83 L64 90 L58 83 Z" fill="#F5D98F" stroke="#9B713A" strokeWidth="1.2" />
        <path d="M64 81 L66 83 L64 86 L62 83 Z" fill="#4D7864" />

        {/* Tiny arms and feet */}
        <path d="M37 68 Q29 72 33 79 Q36 83 42 79" fill="none" stroke="#CBB998" strokeWidth="5" strokeLinecap="round" />
        <path d="M87 67 Q95 71 91 78 Q88 82 82 78" fill="none" stroke="#CBB998" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="51" cy="96" rx="8" ry="3.2" fill="#D7C5A5" />
        <ellipse cx="77" cy="96" rx="8" ry="3.2" fill="#D7C5A5" />

        {/* Glossy enamel highlights and pin glints */}
        <path d="M18 62 Q17 72 22 77 M106 58 Q111 66 106 73" fill="none" stroke="#FFF0C9" strokeWidth="1.5" strokeLinecap="round" opacity="0.78" />
        <path d="M43 39 Q49 32 57 33" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
        <path d="M91 23 l2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5-2.5-5.5-5.5-2.5 5.5-2.5z" fill="#FFF0C9" stroke="#B88B4D" strokeWidth="0.8" />
      </svg>
    );
  }

  if (artworkSrc) {
    return (
      <Image
        src={artworkSrc}
        alt={`${badge.name}, Level ${level}`}
        width={size}
        height={size}
        unoptimized
        className="shrink-0 object-contain drop-shadow-[0_5px_12px_rgba(0,0,0,0.4)]"
      />
    );
  }

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
