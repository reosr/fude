import type { GachaBadgeDefinition, GachaRarity } from "../lib/gacha";

const ARCHETYPES = [
  { name: "Kitsune", icon: "🦊", detail: "rubah penjaga hutan dan penjelajah malam" },
  { name: "Kappa", icon: "🥒", detail: "penghuni sungai yang cerdik dan penuh rasa ingin tahu" },
  { name: "Tengu", icon: "👺", detail: "pengembara pegunungan dengan semangat bebas" },
  { name: "Tanuki", icon: "🦝", detail: "penjaga rimba yang jenaka dan penuh kejutan" },
  { name: "Nekomata", icon: "🐈‍⬛", detail: "kucing roh yang misterius dan lincah" },
] as const;

const PREFIXES: Record<GachaRarity, readonly string[]> = {
  common: [
    "Wandering", "Misty", "Mossbound", "Lantern", "Riverbank",
    "Bamboo", "Petal", "Pebble", "Dewdrop", "Twilight",
    "Puddle", "Acorn", "Clover", "Pocky", "Dango",
    "Raindrop", "Firefly", "Mochi",
  ],
  uncommon: [
    "Moonlit", "Frostveil", "Amber", "Whispering", "Cloudstep",
    "Jade", "Maple", "Silverleaf", "Raincaller", "Duskborne",
    "Blossom", "Starling", "Ripple", "Sakura",
  ],
  rare: [
    "Crimson", "Azure", "Obsidian", "Stormbound", "Starlit",
    "Sapphire", "Wildfire", "Galecrest", "Nightfall", "Sunflare",
    "Moonstone",
  ],
  epic: [
    "Astral", "Tempest", "Eclipsed", "Voidtouched", "Runebound",
    "Spiritforged", "Thunderheart", "Dreamweaver",
  ],
  mythic: [
    "Eternal", "Primordial", "Transcendent", "Aurora", "Worldroot",
  ],
  legendary: [
    "Sovereign", "First Dawn", "Last Ember", "Dragonbound",
  ],
};

const RARITY_DESCRIPTIONS: Record<GachaRarity, string> = {
  common: "Sosok kecil yang baru memulai perjalanan dari sudut-sudut Jepang.",
  uncommon: "Penjelajah yang menyimpan kisah tersembunyi di balik alam.",
  rare: "Penjaga istimewa dengan jejak energi yang sulit ditemukan.",
  epic: "Roh agung yang dikenal dalam legenda dan cerita rakyat.",
  mythic: "Makhluk mitos dengan aura yang jarang terlihat.",
  legendary: "Koleksi puncak dengan kisah yang hanya dimiliki sedikit pelajar.",
};

export const GACHA_BADGES: GachaBadgeDefinition[] = (
  Object.keys(PREFIXES) as GachaRarity[]
).flatMap((rarity) =>
  PREFIXES[rarity].flatMap((prefix, prefixIndex) =>
    ARCHETYPES.map((archetype, archetypeIndex) => ({
      id: `gacha-${rarity}-${String(prefixIndex * ARCHETYPES.length + archetypeIndex + 1).padStart(2, "0")}`,
      name: `${prefix} ${archetype.name}`,
      icon: archetype.icon,
      rarity,
      description: `${RARITY_DESCRIPTIONS[rarity]} Terinspirasi dari ${archetype.detail}.`,
    }))
  )
);

export const GACHA_BADGE_COUNTS: Record<GachaRarity, number> = {
  common: 90,
  uncommon: 70,
  rare: 55,
  epic: 40,
  mythic: 25,
  legendary: 20,
};
