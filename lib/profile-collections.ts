
import { getProgress } from "./progress";

export type BadgeTier =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "mythic"
  | "legendary";

export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export interface ProfileBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  tier: BadgeTier;
  unlockLabel: string;
  chapter?: number;
}

export interface ProfileFrame {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockBab: number;
  unlockLabel: string;
  unlockJlptLevel?: JLPTLevel;
  tier: BadgeTier;
  colors: {
    border: string;
    glow: string;
    background: string;
  };
}

const getTier = (chapter: number): BadgeTier => {
  if (chapter <= 10) return "common";
  if (chapter <= 20) return "rare";
  if (chapter <= 30) return "epic";
  if (chapter <= 40) return "mythic";
  return "legendary";
};

// =====================================================
// 50 BADGE BERDASARKAN BAB
// =====================================================

const CHAPTER_BADGE_DATA = [
  // THE BEGINNER COLLECTION — BAB 1–10
  ["Mochi Guardian", "🍡", "Penjaga mochi kecil"],
  ["Sakura Bloom", "🌸", "Bunga sakura pertama"],
  ["Maneki Friend", "🐱", "Sahabat pembawa keberuntungan"],
  ["Onigiri Keeper", "🍙", "Penjaga bekal perjalanan"],
  ["Tanuki Trickster", "🦝", "Roh hutan yang jahil"],
  ["Little Kokeshi", "🪆", "Boneka kayu kecil yang menemani perjalanan belajar"],
  ["Matcha Spirit", "🍵", "Penjaga ketenangan"],
  ["Origami Star", "⭐", "Bintang kertas pertama"],
  ["Lucky Crane", "🕊️", "Burung pembawa harapan"],
  ["Sakura Guardian", "🌺", "Penjaga taman sakura"],

  // THE EXPLORER COLLECTION — BAB 11–20
  ["Koi Wanderer", "🐟", "Ikan koi sang penjelajah"],
  ["Bamboo Keeper", "🎋", "Penjaga hutan bambu"],
  ["Tengu Scout", "👺", "Pengintai dari pegunungan"],
  ["Tsuru Noble", "🪽", "Bangau yang anggun"],
  ["Fox Messenger", "🦊", "Utusan dari dunia roh"],
  ["Lantern Traveler", "🏮", "Penjelajah malam yang mengikuti cahaya lentera"],
  ["Moon Rabbit", "🐇", "Kelinci penjaga bulan"],
  ["Kitsune Flame", "🔥", "Api rubah yang misterius"],
  ["Golden Koi", "🐠", "Koi pembawa keberuntungan"],
  ["Spirit Seeker", "🔮", "Pencari rahasia kuno"],

  // THE WARRIOR COLLECTION — BAB 21–30
  ["Ronin Wanderer", "⚔️", "Pendekar tanpa tuan"],
  ["Samurai Guard", "🗡️", "Pelindung kehormatan"],
  ["Oni Breaker", "👹", "Penakluk kekuatan oni"],
  ["Thunder Tengu", "⚡", "Pengendali petir pegunungan"],
  ["Red Shogun", "🛡️", "Panglima dengan tekad kuat"],
  ["Iron Katana", "刀", "Pedang yang ditempa disiplin"],
  ["Shadow Ninja", "🥷", "Penguasa bayangan"],
  ["Dragon Warrior", "🐉", "Prajurit sang naga"],
  ["Storm Guardian", "🌩️", "Penjaga badai"],
  ["Warrior of Dawn", "🌅", "Pahlawan fajar"],

  // THE MYTHICAL COLLECTION — BAB 31–40
  ["Kirin Wanderer", "🦄", "Makhluk legenda yang melintasi kabut pegunungan"],
  ["Storm Oni", "⚡", "Oni tangguh yang muncul bersama gemuruh badai"],
  ["Gale Kitsune", "🌪️", "Penguasa angin"],
  ["Yamata Serpent", "🐍", "Penakluk ular legendaris"],
  ["Moonlit Dragon", "🌙", "Naga penjaga malam"],
  ["Spirit Phoenix", "🦅", "Roh burung abadi"],
  ["Starfall Guardian", "✨", "Pelindung langit"],
  ["Moonlit Chrysanthemum", "🌼", "Krisan malam yang mekar di bawah cahaya bulan"],
  ["Solar Phoenix", "☀️", "Cahaya matahari"],
  ["Mystic Sovereign", "💠", "Penguasa kekuatan mistis"],

  // THE LEGENDARY COLLECTION — BAB 41–50
  ["Crimson Dragon", "🐲", "Naga merah legendaris"],
  ["Eternal Phoenix", "🔥", "Api yang tak pernah padam"],
  ["Starbound Shogun", "👑", "Penguasa langit dan bumi"],
  ["Nine-Tailed Kitsune", "🦊", "Rubah berekor sembilan dari cerita rakyat Jepang"],
  ["Skyward Samurai", "⚔️", "Pendekar dari surga"],
  ["Dragon Emperor", "🐉", "Kaisar para naga"],
  ["Eternal Guardian", "💎", "Pelindung keabadian"],
  ["Mythic Sovereign", "🌌", "Penguasa alam semesta"],
  ["Golden Legend", "🏆", "Legenda yang bersinar"],
  [
    "Minna no Shogun",
    "🏯",
    "Menuntaskan perjalanan Minna no Nihongo Bab 1–50. Perjalanan menuju JLPT N1 masih berlanjut.",
  ],
] as const;

export const CHAPTER_BADGES: ProfileBadge[] =
  CHAPTER_BADGE_DATA.map(([name, icon, description], index) => {
    const chapter = index + 1;

    return {
      id: `bab-${chapter}`,
      name,
      icon,
      description,
      chapter,
      tier: getTier(chapter),
      unlockLabel: `Selesaikan Bab ${chapter}`,
    };
  });

// =====================================================
// 5 BADGE SPESIAL
// =====================================================

export const SPECIAL_BADGES: ProfileBadge[] = [
  {
    id: "special-first-bab",
    name: "First Steps",
    icon: "👣",
    description: "Menyelesaikan bab pertamamu.",
    tier: "common",
    unlockLabel: "Selesaikan Bab 1",
  },
  {
    id: "special-ten-babs",
    name: "Dedicated Learner",
    icon: "📚",
    description: "Menyelesaikan sepuluh bab.",
    tier: "rare",
    unlockLabel: "Selesaikan 10 bab",
  },
  {
    id: "special-quarter",
    name: "Rising Scholar",
    icon: "🎖️",
    description: "Menyelesaikan separuh materi Minna no Nihongo.",
    tier: "epic",
    unlockLabel: "Selesaikan 25 bab",
  },
  {
    id: "special-master",
    name: "Fude Master",
    icon: "👑",
    description:
      "Menyelesaikan seluruh materi Minna no Nihongo Bab 1–50. Perjalanan Fude menuju JLPT N1 masih berlanjut.",
    tier: "legendary",
    unlockLabel: "Selesaikan Bab 50",
  },
  {
    id: "special-jlpt",
    name: "JLPT Challenger",
    icon: "🏅",
    description: "Menyelesaikan Practice Set JLPT pertamamu.",
    tier: "rare",
    unlockLabel: "Selesaikan satu Practice Set JLPT",
  },
];

export const ALL_BADGES: ProfileBadge[] = [
  ...CHAPTER_BADGES,
  ...SPECIAL_BADGES,
];

// =====================================================
// 17 FRAME AVATAR
// =====================================================

export const PROFILE_FRAMES: ProfileFrame[] = [
  {
    id: "classic",
    name: "Classic",
    icon: "⚪",
    description: "Frame awal untuk setiap pelajar.",
    unlockBab: 0,
    unlockLabel: "Tersedia sejak awal",
    tier: "common",
    colors: {
      border: "#817A73",
      glow: "rgba(129,122,115,0.15)",
      background: "#262523",
    },
  },

  // MINNA NO NIHONGO — 11 FRAME

  {
    id: "sakura",
    name: "Sakura",
    icon: "🌸",
    description: "Hiasan kelopak sakura dengan nuansa merah muda dan emas.",
    unlockBab: 1,
    unlockLabel: "Selesaikan Bab 1",
    tier: "common",
    colors: {
      border: "#E99AB5",
      glow: "rgba(233,154,181,0.4)",
      background: "#351D2B",
    },
  },
  {
    id: "koi",
    name: "Koi",
    icon: "🐟",
    description: "Ornamen koi dan gelombang air dengan aksen merah dan emas.",
    unlockBab: 5,
    unlockLabel: "Selesaikan Bab 5",
    tier: "common",
    colors: {
      border: "#D58B43",
      glow: "rgba(213,139,67,0.4)",
      background: "#352416",
    },
  },
  {
    id: "samurai",
    name: "Samurai",
    icon: "⚔️",
    description: "Terinspirasi zirah samurai dan ornamen logam.",
    unlockBab: 10,
    unlockLabel: "Selesaikan Bab 10",
    tier: "rare",
    colors: {
      border: "#C7A35A",
      glow: "rgba(199,163,90,0.4)",
      background: "#302619",
    },
  },
  {
    id: "tengu",
    name: "Tengu",
    icon: "👺",
    description: "Ornamen topeng Tengu dan bulu pegunungan.",
    unlockBab: 15,
    unlockLabel: "Selesaikan Bab 15",
    tier: "rare",
    colors: {
      border: "#C85A4A",
      glow: "rgba(200,90,74,0.4)",
      background: "#351B1B",
    },
  },
  {
    id: "kitsune",
    name: "Kitsune",
    icon: "🦊",
    description: "Rubah cerita rakyat dengan ornamen api dan topeng putih.",
    unlockBab: 20,
    unlockLabel: "Selesaikan Bab 20",
    tier: "rare",
    colors: {
      border: "#E77A4D",
      glow: "rgba(231,122,77,0.45)",
      background: "#361D19",
    },
  },
  {
    id: "ronin",
    name: "Ronin",
    icon: "🗡️",
    description: "Frame pendekar pengembara dengan aksen besi dan merah tua.",
    unlockBab: 25,
    unlockLabel: "Selesaikan Bab 25",
    tier: "epic",
    colors: {
      border: "#A9A29A",
      glow: "rgba(169,162,154,0.4)",
      background: "#252525",
    },
  },
  {
    id: "dragon",
    name: "Dragon",
    icon: "🐉",
    description: "Ornamen sisik naga dan ukiran emas.",
    unlockBab: 30,
    unlockLabel: "Selesaikan Bab 30",
    tier: "epic",
    colors: {
      border: "#D4A638",
      glow: "rgba(212,166,56,0.5)",
      background: "#302619",
    },
  },
  {
    id: "onmyoji",
    name: "Sealkeeper",
    icon: "✦",
    description: "Ornamen segel geometris dan bintang dengan nuansa ungu.",
    unlockBab: 35,
    unlockLabel: "Selesaikan Bab 35",
    tier: "mythic",
    colors: {
      border: "#8C83DB",
      glow: "rgba(140,131,219,0.5)",
      background: "#26213D",
    },
  },
  {
    id: "phoenix",
    name: "Phoenix",
    icon: "🔥",
    description: "Ornamen sayap dan bulu api burung abadi.",
    unlockBab: 40,
    unlockLabel: "Selesaikan Bab 40",
    tier: "mythic",
    colors: {
      border: "#F0A443",
      glow: "rgba(240,164,67,0.55)",
      background: "#382218",
    },
  },
  {
    id: "raijin",
    name: "Stormcrest",
    icon: "⚡",
    description: "Ornamen petir dan awan badai.",
    unlockBab: 45,
    unlockLabel: "Selesaikan Bab 45",
    tier: "legendary",
    colors: {
      border: "#75B9E7",
      glow: "rgba(117,185,231,0.6)",
      background: "#1D2B3B",
    },
  },
  {
    id: "shogun",
    name: "Shogun",
    icon: "👑",
    description: "Zirah dan mahkota panglima. Puncak jalur Minna no Nihongo.",
    unlockBab: 50,
    unlockLabel: "Selesaikan Bab 50",
    tier: "legendary",
    colors: {
      border: "#F0C75E",
      glow: "rgba(240,199,94,0.65)",
      background: "#382D16",
    },
  },

  // JLPT — 5 FRAME MENUJU N1

  {
    id: "n5-scholar",
    name: "Scholar",
    icon: "📜",
    description: "Lambang awal perjalanan JLPT N5.",
    unlockBab: 51,
    unlockLabel: "Selesaikan Practice Set N5",
    unlockJlptLevel: "N5",
    tier: "rare",
    colors: {
      border: "#78B8A0",
      glow: "rgba(120,184,160,0.4)",
      background: "#1C332D",
    },
  },
  {
    id: "n4-kensei",
    name: "Kensei",
    icon: "⚔️",
    description: "Lambang ketekunan seorang pendekar di level N4.",
    unlockBab: 51,
    unlockLabel: "Selesaikan Practice Set N4",
    unlockJlptLevel: "N4",
    tier: "epic",
    colors: {
      border: "#72A9D8",
      glow: "rgba(114,169,216,0.45)",
      background: "#1D293B",
    },
  },
  {
    id: "n3-oni-guardian",
    name: "Oni Guardian",
    icon: "👹",
    description: "Lambang kekuatan dan keteguhan di level N3.",
    unlockBab: 51,
    unlockLabel: "Selesaikan Practice Set N3",
    unlockJlptLevel: "N3",
    tier: "epic",
    colors: {
      border: "#C77A91",
      glow: "rgba(199,122,145,0.5)",
      background: "#351D2A",
    },
  },
  {
    id: "n2-kirin",
    name: "Kirin",
    icon: "🦌",
    description: "Lambang Kirin, makhluk legenda dari cerita rakyat Jepang di level N2.",
    unlockBab: 51,
    unlockLabel: "Selesaikan Practice Set N2",
    unlockJlptLevel: "N2",
    tier: "mythic",
    colors: {
      border: "#B69AE8",
      glow: "rgba(182,154,232,0.55)",
      background: "#29213D",
    },
  },
  {
    id: "n1-amaterasu",
    name: "Solar Crest",
    icon: "☀️",
    description: "Frame puncak koleksi Fude untuk pencapaian JLPT N1, dengan ornamen sinar matahari.",
    unlockBab: 51,
    unlockLabel: "Selesaikan Practice Set N1",
    unlockJlptLevel: "N1",
    tier: "legendary",
    colors: {
      border: "#FFE08A",
      glow: "rgba(255,224,138,0.75)",
      background: "#403018",
    },
  },
];

// =====================================================
// MEMBACA PROGRES DAN KOLEKSI
// =====================================================

export function getCompletedBabCount(): number {
  if (typeof window === "undefined") return 0;

  const progress = Number(getProgress());

  if (!Number.isFinite(progress)) return 0;

  return Math.min(50, Math.max(0, progress - 1));
}

export function getCompletedJlptSetIds(): string[] {
  if (typeof window === "undefined") return [];

  const completed: string[] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (!key?.startsWith("jlpt_result_")) continue;

      try {
        const raw = localStorage.getItem(key);
        const result = raw ? JSON.parse(raw) : null;

        // Gunakan flag riwayat yang sudah divalidasi oleh JLPTQuiz.
        // isFinished saja tidak cukup karena data lama bisa tidak lengkap.
        if (result?.completedOnce === true) {
          const setId = key.slice("jlpt_result_".length);

          if (setId && !completed.includes(setId)) {
            completed.push(setId);
          }
        }
      } catch {
        // Lewati data yang tidak valid.
      }
    }
  } catch (error) {
    console.error("Gagal membaca hasil JLPT:", error);
  }

  return completed;
}

// Mengambil level JLPT dari ID set, misalnya n5-set-1.
export function getCompletedJlptLevels(): JLPTLevel[] {
  const completedSetIds = getCompletedJlptSetIds();
  const levels = new Set<JLPTLevel>();

  for (const setId of completedSetIds) {
    const match = setId.match(/^(n[1-5])(?:[-_]|$)/i);

    if (match) {
      levels.add(match[1].toUpperCase() as JLPTLevel);
    }
  }

  const order: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];

  return order.filter((level) => levels.has(level));
}

export function getUnlockedBadges(): ProfileBadge[] {
  const completedBab = getCompletedBabCount();
  const completedJlpt = getCompletedJlptSetIds();

  const chapterBadges = CHAPTER_BADGES.filter(
    (badge) => (badge.chapter ?? 0) <= completedBab
  );

  const specialBadges = SPECIAL_BADGES.filter((badge) => {
    switch (badge.id) {
      case "special-first-bab":
        return completedBab >= 1;

      case "special-ten-babs":
        return completedBab >= 10;

      case "special-quarter":
        return completedBab >= 25;

      case "special-master":
        return completedBab >= 50;

      case "special-jlpt":
        return completedJlpt.length >= 1;

      default:
        return false;
    }
  });

  return [...chapterBadges, ...specialBadges];
}

export function getUnlockedFrames(): ProfileFrame[] {
  const completedBab = getCompletedBabCount();
  const completedJlptLevels = getCompletedJlptLevels();

  return PROFILE_FRAMES.filter((frame) => {
    // Frame JLPT hanya terbuka melalui Practice Set pada levelnya.
    if (frame.unlockJlptLevel) {
      return completedJlptLevels.includes(frame.unlockJlptLevel);
    }

    // Frame Minna terbuka melalui penyelesaian bab.
    return completedBab >= frame.unlockBab;
  });
}

export function isBadgeUnlocked(badgeId: string): boolean {
  return getUnlockedBadges().some((badge) => badge.id === badgeId);
}

export function isFrameUnlocked(frameId: string): boolean {
  return getUnlockedFrames().some((frame) => frame.id === frameId);
}

// =====================================================
// NOTIFIKASI KOLEKSI BARU
// =====================================================

export const COLLECTION_UPDATED_EVENT = "fude-collection-updated";

const COLLECTION_TRACKING_KEY = "fude_collection_tracking";
const COLLECTION_KNOWN_KEY = "fude_collection_known";
const COLLECTION_PENDING_KEY = "fude_collection_pending";

export interface CollectionUnlockNotice {
  id: string;
  collectionId: string;
  type: "badge" | "frame";
  name: string;
  icon: string;
}

function readCollectionIds(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function getCurrentUnlockedCollections(): CollectionUnlockNotice[] {
  const badges = getUnlockedBadges().map((badge) => ({
    id: `badge:${badge.id}`,
    collectionId: badge.id,
    type: "badge" as const,
    name: badge.name,
    icon: badge.icon,
  }));

  const frames = getUnlockedFrames().map((frame) => ({
    id: `frame:${frame.id}`,
    collectionId: frame.id,
    type: "frame" as const,
    name: frame.name,
    icon: frame.icon,
  }));

  return [...badges, ...frames];
}

// Inisialisasi tanpa menganggap progres lama sebagai reward baru.
export function initializeCollectionTracking(): void {
  if (typeof window === "undefined") return;

  if (localStorage.getItem(COLLECTION_TRACKING_KEY) === "1") {
    syncNewCollectionUnlocks();
    return;
  }

  const current = getCurrentUnlockedCollections();

  localStorage.setItem(
    COLLECTION_KNOWN_KEY,
    JSON.stringify(current.map((item) => item.id))
  );

  localStorage.setItem(COLLECTION_PENDING_KEY, JSON.stringify([]));
  localStorage.setItem(COLLECTION_TRACKING_KEY, "1");
}

// Mendeteksi badge dan frame yang baru terbuka.
export function syncNewCollectionUnlocks(): CollectionUnlockNotice[] {
  if (typeof window === "undefined") return [];

  if (localStorage.getItem(COLLECTION_TRACKING_KEY) !== "1") {
    initializeCollectionTracking();
    return [];
  }

  const current = getCurrentUnlockedCollections();
  const known = readCollectionIds(COLLECTION_KNOWN_KEY);
  const pending = readCollectionIds(COLLECTION_PENDING_KEY);

  const newlyUnlocked = current.filter(
    (item) => !known.includes(item.id)
  );

  if (newlyUnlocked.length === 0) return [];

  const newKnown = [
    ...known,
    ...newlyUnlocked.map((item) => item.id),
  ];

  const newPending = [
    ...new Set([
      ...pending,
      ...newlyUnlocked.map((item) => item.id),
    ]),
  ];

  localStorage.setItem(
    COLLECTION_KNOWN_KEY,
    JSON.stringify(newKnown)
  );

  localStorage.setItem(
    COLLECTION_PENDING_KEY,
    JSON.stringify(newPending)
  );

  window.dispatchEvent(
    new CustomEvent<CollectionUnlockNotice[]>(
      COLLECTION_UPDATED_EVENT,
      { detail: newlyUnlocked }
    )
  );

  return newlyUnlocked;
}

export function getPendingCollectionIds(): string[] {
  if (typeof window === "undefined") return [];

  return readCollectionIds(COLLECTION_PENDING_KEY);
}

export function markCollectionSeen(id: string): void {
  if (typeof window === "undefined") return;

  const pending = readCollectionIds(COLLECTION_PENDING_KEY);

  localStorage.setItem(
    COLLECTION_PENDING_KEY,
    JSON.stringify(pending.filter((item) => item !== id))
  );

  window.dispatchEvent(new Event(COLLECTION_UPDATED_EVENT));
}
