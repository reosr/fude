import type { GachaBadgeDefinition, GachaRarity } from "../lib/gacha";
import { LEGACY_BADGE_SEEDS as PROFILE_BADGES } from "../lib/profile-collections";

const ARCHETYPES = [
  { name: "Kitsune", icon: "🦊", detail: "rubah penjaga hutan dan penjelajah malam" },
  { name: "Kappa", icon: "🥒", detail: "penghuni sungai yang cerdik dan penuh rasa ingin tahu" },
  { name: "Tengu", icon: "👺", detail: "pengembara pegunungan dengan semangat bebas" },
  { name: "Tanuki", icon: "🦝", detail: "penjaga rimba yang jenaka dan penuh kejutan" },
  { name: "Nekomata", icon: "🐈‍⬛", detail: "kucing roh yang misterius dan lincah" },
] as const;

const PREFIXES: Record<GachaRarity, readonly string[]> = {
  common: ["Wandering", "Misty", "Mossbound", "Lantern", "Riverbank", "Bamboo", "Petal", "Pebble", "Dewdrop", "Twilight", "Puddle", "Acorn", "Clover", "Pocky", "Dango", "Raindrop", "Firefly", "Mochi"],
  uncommon: ["Moonlit", "Frostveil", "Amber", "Whispering", "Cloudstep", "Jade", "Maple", "Silverleaf", "Raincaller", "Duskborne", "Blossom", "Starling", "Ripple", "Sakura"],
  rare: ["Crimson", "Azure", "Obsidian", "Stormbound", "Starlit", "Sapphire", "Wildfire", "Galecrest", "Nightfall", "Sunflare", "Moonstone"],
  epic: ["Astral", "Tempest", "Eclipsed", "Voidtouched", "Runebound", "Spiritforged", "Thunderheart", "Dreamweaver"],
  mythic: ["Eternal", "Primordial", "Transcendent", "Aurora", "Worldroot"],
  legendary: ["Sovereign", "First Dawn", "Last Ember", "Dragonbound"],
};

const RARITY_DESCRIPTIONS: Record<GachaRarity, string> = {
  common: "Koleksi yang memulai kisah perjalanan dari sudut-sudut Jepang.",
  uncommon: "Penjelajah yang menyimpan kisah tersembunyi di balik alam.",
  rare: "Penjaga istimewa dengan jejak energi yang sulit ditemukan.",
  epic: "Sosok legendaris dengan karakter dan kekuatan yang khas.",
  mythic: "Makhluk mitos dengan aura yang jarang terlihat.",
  legendary: "Koleksi puncak dengan kisah yang sangat langka.",
};

// Seluruh badge profil lama tetap menjadi bagian koleksi dan kini diperoleh
// melalui Gacha. Sisanya melengkapi katalog hingga tepat 300 badge.
const TARGET_COUNTS: Record<GachaRarity, number> = {
  common: 90,
  uncommon: 70,
  rare: 55,
  epic: 40,
  mythic: 25,
  legendary: 20,
};

const profileCounts = Object.fromEntries(
  (Object.keys(TARGET_COUNTS) as GachaRarity[]).map((rarity) => [
    rarity,
    PROFILE_BADGES.filter((badge) => badge.tier === rarity).length,
  ])
) as Record<GachaRarity, number>;

const generatedBadges: GachaBadgeDefinition[] = (
  Object.keys(PREFIXES) as GachaRarity[]
).flatMap((rarity) =>
  PREFIXES[rarity].flatMap((prefix, prefixIndex) =>
    ARCHETYPES.map((archetype, archetypeIndex) => ({
      id: `gacha-${rarity}-${String(prefixIndex * ARCHETYPES.length + archetypeIndex + 1).padStart(2, "0")}`,
      name: `${prefix} ${archetype.name}`,
      icon: archetype.icon,
      rarity,
      tier: rarity,
      description: `${RARITY_DESCRIPTIONS[rarity]} Terinspirasi dari ${archetype.detail}.`,
      unlockLabel: "Diperoleh melalui Gacha",
    }))
  )
);

const generatedLimits: Record<GachaRarity, number> = Object.fromEntries(
  (Object.keys(TARGET_COUNTS) as GachaRarity[]).map((rarity) => [
    rarity,
    TARGET_COUNTS[rarity] - profileCounts[rarity],
  ])
) as Record<GachaRarity, number>;

const generatedSelectedBase = (Object.keys(TARGET_COUNTS) as GachaRarity[]).flatMap(
  (rarity) =>
    generatedBadges
      .filter((badge) => badge.rarity === rarity)
      .slice(0, generatedLimits[rarity])
);

// Curated folklore batch replaces generic Common placeholders while keeping
// their IDs stable for existing inventories and legacy redirects.
const folkloreCommonBadges: GachaBadgeDefinition[] = [
  { id: "gacha-common-02", name: "Kodama", icon: "🌱", rarity: "common", tier: "common", description: "Roh pohon mungil yang tumbuh bersama tunas, lumut, dan semangat hutan.", unlockLabel: "Diperoleh melalui Gacha" },
  { id: "gacha-common-03", name: "Zashiki-warashi", icon: "🎎", rarity: "common", tier: "common", description: "Roh anak kecil pembawa keberuntungan yang menjaga rumah tradisional.", unlockLabel: "Diperoleh melalui Gacha" },
  { id: "gacha-common-04", name: "Akaname", icon: "👅", rarity: "common", tier: "common", description: "Yokai kecil dengan lidah panjang yang gemar membersihkan tempat kotor.", unlockLabel: "Diperoleh melalui Gacha" },
  { id: "gacha-common-05", name: "Tofu-kozo", icon: "🍥", rarity: "common", tier: "common", description: "Anak yokai pembawa nampan berisi tofu lembut.", unlockLabel: "Diperoleh melalui Gacha" },
  { id: "gacha-common-06", name: "Azukiarai", icon: "🫘", rarity: "common", tier: "common", description: "Roh sungai kecil yang terdengar mencuci kacang azuki di tepi air.", unlockLabel: "Diperoleh melalui Gacha" },
  { id: "gacha-common-07", name: "Sunekosuri", icon: "🐾", rarity: "common", tier: "common", description: "Makhluk kecil berbulu yang diam-diam bergesekan dengan kaki pejalan malam.", unlockLabel: "Diperoleh melalui Gacha" },
  { id: "gacha-common-08", name: "Betobeto-san", icon: "👣", rarity: "common", tier: "common", description: "Roh langkah kaki misterius yang mengikuti orang di jalan malam.", unlockLabel: "Diperoleh melalui Gacha" },
  { id: "gacha-common-09", name: "Amikiri", icon: "🦀", rarity: "common", tier: "common", description: "Yokai mungil bercapit yang dikenal suka memotong jaring ikan.", unlockLabel: "Diperoleh melalui Gacha" },
  { id: "gacha-common-10", name: "Shiro-uneri", icon: "🧣", rarity: "common", tier: "common", description: "Kain putih tua yang berubah hidup menjadi yokai lentur dan nakal.", unlockLabel: "Diperoleh melalui Gacha" },
  { id: "gacha-common-11", name: "Kawauso", icon: "🦦", rarity: "common", tier: "common", description: "Yokai berwujud berang-berang sungai yang terkenal pandai menyamar.", unlockLabel: "Diperoleh melalui Gacha" },
];
const folkloreCommonById = new Map(folkloreCommonBadges.map((badge) => [badge.id, badge]));
const curatedGeneratedSelectedBase = generatedSelectedBase.map(
  (badge) => folkloreCommonById.get(badge.id) ?? badge
);


const kasaObakeBadge: GachaBadgeDefinition = {
  id: "kasa-obake-01",
  name: "Kasa Obake",
  icon: "☂",
  rarity: "common",
  tier: "common",
  description: "Yokai payung kertas yang hidup setelah bertahun-tahun digunakan. Ia melompat-lompat di tengah hujan dengan satu mata yang selalu ingin tahu.",
  unlockLabel: "Diperoleh melalui Gacha",
};

const generatedSelected: GachaBadgeDefinition[] = [
  ...curatedGeneratedSelectedBase.filter((badge, index) => !(badge.rarity === "common" && index === 0)),
  kasaObakeBadge,
];

const originalProfileBadges: GachaBadgeDefinition[] = PROFILE_BADGES.map(
  (badge) => ({
    id: badge.id,
    name: badge.name,
    icon: badge.icon,
    rarity: badge.tier,
    tier: badge.tier,
    description: badge.description,
    unlockLabel: "Diperoleh melalui Gacha",
  })
);

export const GACHA_BADGES: GachaBadgeDefinition[] = [
  ...originalProfileBadges,
  ...generatedSelected,
];

export const GACHA_BADGE_COUNTS = TARGET_COUNTS;

// Legacy IDs from the previous standalone 300-item catalog are redirected
// to a surviving badge of the same rarity so no stored copies disappear.
const selectedIds = new Set(generatedSelected.map((badge) => badge.id));
export const LEGACY_GACHA_BADGE_ID_MAP: Record<string, string> = {};
for (const rarity of Object.keys(TARGET_COUNTS) as GachaRarity[]) {
  const survivors = generatedSelected.filter((badge) => badge.rarity === rarity);
  const removed = generatedBadges.filter(
    (badge) => badge.rarity === rarity && !selectedIds.has(badge.id)
  );
  if (survivors.length === 0) continue;
  removed.forEach((badge, index) => {
    LEGACY_GACHA_BADGE_ID_MAP[badge.id] = survivors[index % survivors.length].id;
  });
}
