
import { getProgress } from "./progress";

// =====================================================
// STORAGE KEYS
// =====================================================

export const PROFILE_KEY = "fude_profile";

export const XP_KEY = "fude_xp";
export const XP_REWARDS_KEY = "fude_xp_rewards";

export const TOKEN_KEY = "fude_tokens";
export const TOKEN_REWARDS_KEY = "fude_token_rewards";
export const TOKEN_SPENDS_KEY = "fude_token_spends";
export const TOKEN_TRANSACTIONS_KEY = "fude_token_transactions";
export const ECONOMY_VERSION_KEY = "fude_economy_version";

// =====================================================
// EVENTS
// =====================================================

export const PROFILE_UPDATED_EVENT = "fude-profile-updated";
export const XP_UPDATED_EVENT = "fude-xp-updated";
export const TOKEN_UPDATED_EVENT = "fude-token-updated";

// =====================================================
// ECONOMY CONFIGURATION
// =====================================================

// Level 1 membutuhkan 500 EXP.
// Setiap level berikutnya membutuhkan tambahan 100 EXP.
export const XP_PER_LEVEL = 500;
export const XP_LEVEL_INCREMENT = 100;

// EXP rewards lama tetap dipertahankan.
export const BAB_COMPLETION_XP = 100;
export const JLPT_COMPLETION_XP = 50;
export const JLPT_HIGH_SCORE_BONUS_XP = 25;

// Token rewards.
export const CHAPTER_TOKEN_REWARD = 50;
export const CHAPTER_MILESTONE_TOKEN_BONUS = 20;
export const LEVEL_UP_TOKEN_REWARD = 5;
export const JLPT_PERFECT_TOKEN_REWARD = 100;

// Reward penyelesaian JLPT.
export const JLPT_LEVEL_TOKEN_REWARDS: Record<string, number> = {
  N4: 100,
  N3: 200,
  N2: 200,
  N1: 200,
};

// =====================================================
// TYPES
// =====================================================

export interface FudeProfile {
  name: string;
  avatar: string;
  photoDataUrl?: string | null;
  equippedBadgeId?: string | null;
  equippedFrameId?: string | null;
}

export interface LevelInfo {
  level: number;
  rank: string;
  currentExp: number;
  requiredExp: number;
  progressPercent: number;
  remainingExp: number;
}

export interface TokenTransaction {
  id: string;
  type: "earn" | "spend" | "migration";
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: number;
}

export interface ChapterRewardResult {
  xpAwarded: boolean;
  chapterTokensAwarded: boolean;
  milestoneTokensAwarded: boolean;
}

export const DEFAULT_PROFILE: FudeProfile = {
  name: "Pelajar Fude",
  avatar: "筆",
  photoDataUrl: null,
  equippedBadgeId: null,
  equippedFrameId: "classic",
};

// =====================================================
// SAFE STORAGE READERS
// =====================================================

function readStringArray(key: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is string => typeof item === "string"
    );
  } catch {
    return [];
  }
}

function readRewards(): string[] {
  return readStringArray(XP_REWARDS_KEY);
}

function readTokenRewards(): string[] {
  return readStringArray(TOKEN_REWARDS_KEY);
}

function readTokenSpends(): string[] {
  return readStringArray(TOKEN_SPENDS_KEY);
}

function getStoredTokenBalance(): number {
  if (typeof window === "undefined") return 0;

  const value = Number(localStorage.getItem(TOKEN_KEY));

  return Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : 0;
}

function readTransactions(): TokenTransaction[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(TOKEN_TRANSACTIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is TokenTransaction =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.amount === "number" &&
        typeof item.balanceAfter === "number" &&
        typeof item.description === "string"
    );
  } catch {
    return [];
  }
}

function appendTransaction(
  transaction: TokenTransaction
): void {
  const history = readTransactions();

  // Simpan transaksi terbaru di urutan pertama.
  // Batasi riwayat lokal agar penyimpanan tidak terus membesar.
  const updated = [
    transaction,
    ...history.filter((item) => item.id !== transaction.id),
  ].slice(0, 2000);

  localStorage.setItem(
    TOKEN_TRANSACTIONS_KEY,
    JSON.stringify(updated)
  );
}

function dispatchEconomyUpdate(): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(XP_UPDATED_EVENT));
  window.dispatchEvent(new Event(TOKEN_UPDATED_EVENT));
}

// =====================================================
// PROGRESSIVE EXP LEVEL
// =====================================================

export function getRequiredXpForLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));

  return XP_PER_LEVEL +
    (safeLevel - 1) * XP_LEVEL_INCREMENT;
}

// Total EXP yang dibutuhkan untuk mencapai level tertentu.
function getTotalXpForLevel(level: number): number {
  const previousLevels = Math.max(0, Math.floor(level) - 1);

  return (
    XP_PER_LEVEL * previousLevels +
    (XP_LEVEL_INCREMENT *
      previousLevels *
      (previousLevels - 1)) / 2
  );
}

export function getLevelInfo(totalXp: number): LevelInfo {
  const safeXp = Number.isFinite(totalXp)
    ? Math.max(0, Math.floor(totalXp))
    : 0;

  // Cari level berdasarkan kurva EXP progresif.
  // Rumus ini menghindari loop panjang ketika EXP sangat besar.
  const discriminant =
    450 * 450 + 200 * safeXp;

  const previousLevels = Math.max(
    0,
    Math.floor(
      (-450 + Math.sqrt(discriminant)) / 100
    )
  );

  const level = previousLevels + 1;

  const xpBeforeCurrentLevel =
    getTotalXpForLevel(level);

  const requiredExp = getRequiredXpForLevel(level);

  const currentExp = Math.max(
    0,
    safeXp - xpBeforeCurrentLevel
  );

  const remainingExp = Math.max(
    0,
    requiredExp - currentExp
  );

  let rank = "Kenshi";

  if (level >= 4 && level <= 6) {
    rank = "Samurai";
  }

  if (level >= 7) {
    rank = "Shogun";
  }

  return {
    level,
    rank,
    currentExp,
    requiredExp,
    progressPercent: Math.min(
      100,
      (currentExp / requiredExp) * 100
    ),
    remainingExp,
  };
}

// =====================================================
// INITIALIZE LEGACY EXP
// =====================================================

// Migrasi EXP lama hanya dilakukan satu kali.
function initializeXp(): void {
  if (typeof window === "undefined") return;

  if (localStorage.getItem(XP_KEY) !== null) {
    // Versi lama dapat memiliki saldo EXP tanpa ledger klaim.
    // Rekonstruksi penanda dari progres/hasil yang tersimpan tanpa
    // menambah EXP lagi, agar reward lama tidak bisa diklaim ulang.
    if (localStorage.getItem(XP_REWARDS_KEY) === null) {
      const migratedRewards = new Set<string>();
      const progress = Number(getProgress());
      const completedBab = Number.isFinite(progress)
        ? Math.max(0, Math.floor(progress) - 1)
        : 0;

      for (let bab = 1; bab <= completedBab; bab++) {
        migratedRewards.add(`bab:${bab}`);
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith("jlpt_result_")) continue;

        try {
          const raw = localStorage.getItem(key);
          const result = raw ? JSON.parse(raw) : null;
          if (
            result?.completedOnce === true ||
            result?.isFinished === true
          ) {
            const setId = key.slice("jlpt_result_".length);
            if (setId) migratedRewards.add(`jlpt:${setId}`);
          }
        } catch {
          // Lewati hasil JLPT lama yang tidak valid.
        }
      }

      localStorage.setItem(
        XP_REWARDS_KEY,
        JSON.stringify(Array.from(migratedRewards))
      );
    }

    return;
  }

  const progress = Number(getProgress());

  // Tidak membatasi progres di Bab 50.
  const completedBab = Number.isFinite(progress)
    ? Math.max(0, Math.floor(progress) - 1)
    : 0;

  let totalXp = completedBab * BAB_COMPLETION_XP;

  const rewards: string[] = [];

  for (let bab = 1; bab <= completedBab; bab++) {
    rewards.push(`bab:${bab}`);
  }

  // Migrasi EXP dari hasil JLPT lama.
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (!key?.startsWith("jlpt_result_")) continue;

    try {
      const raw = localStorage.getItem(key);
      const result = raw ? JSON.parse(raw) : null;

      // completedOnce tetap menjadi bukti penyelesaian walaupun pengguna
      // sudah mengulang set non-perfect dan status isFinished kembali false.
      // isFinished dipertahankan untuk kompatibilitas data versi lama.
      if (
        result?.completedOnce === true ||
        result?.isFinished === true
      ) {
        const setId = key.slice("jlpt_result_".length);

        if (setId && !rewards.includes(`jlpt:${setId}`)) {
          totalXp += JLPT_COMPLETION_XP;
          rewards.push(`jlpt:${setId}`);
        }
      }
    } catch {
      // Lewati data hasil ujian yang tidak valid.
    }
  }

  localStorage.setItem(XP_KEY, String(totalXp));

  localStorage.setItem(
    XP_REWARDS_KEY,
    JSON.stringify(rewards)
  );
}

// =====================================================
// INITIALIZE TOKEN ECONOMY
// =====================================================

function initializeTokenEconomy(): void {
  if (typeof window === "undefined") return;

  initializeXp();

  if (
    localStorage.getItem(ECONOMY_VERSION_KEY) === "1"
  ) {
    return;
  }

  // Jika saldo token sudah ada, pertahankan nilainya. Rekonstruksi ledger
  // yang hilang dari riwayat transaksi dan progres lama agar klaim yang
  // pernah terjadi tidak terbuka kembali setelah migrasi.
  if (localStorage.getItem(TOKEN_KEY) !== null) {
    const hasValidStringArray = (key: string): boolean => {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) return false;
        return Array.isArray(JSON.parse(raw)) &&
          JSON.parse(raw).every((item: unknown) => typeof item === "string");
      } catch {
        return false;
      }
    };

    if (
      !hasValidStringArray(TOKEN_REWARDS_KEY) ||
      !hasValidStringArray(TOKEN_SPENDS_KEY)
    ) {
      const tokenRewards = new Set(readTokenRewards());
      const tokenSpends = new Set(readTokenSpends());

      // Riwayat transaksi menjadi sumber utama untuk ledger lama.
      for (const transaction of readTransactions()) {
        if (transaction.type === "spend") {
          tokenSpends.add(transaction.id);
        } else if (
          transaction.type === "earn" ||
          transaction.type === "migration"
        ) {
          tokenRewards.add(transaction.id);
        }
      }

      // Rekonstruksi reward bab dan milestone dari progres yang tersimpan.
      const progress = Number(getProgress());
      const completedBab = Number.isFinite(progress)
        ? Math.max(0, Math.floor(progress) - 1)
        : 0;

      for (let bab = 1; bab <= completedBab; bab++) {
        tokenRewards.add(`chapter:${bab}`);
        if (bab % 10 === 0) {
          tokenRewards.add(`chapter-milestone:${bab}`);
        }
      }

      // Reward level-up yang sudah tercapai tidak boleh diklaim ulang.
      const currentXp = Number(localStorage.getItem(XP_KEY)) || 0;
      const currentLevel = getLevelInfo(currentXp).level;
      for (let level = 2; level <= currentLevel; level++) {
        tokenRewards.add(`level-up:${level}`);
      }

      // Hasil perfect yang tersimpan menandakan reward JLPT pernah memenuhi syarat.
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith("jlpt_result_")) continue;

        try {
          const raw = localStorage.getItem(key);
          const result = raw ? JSON.parse(raw) : null;
          if (result?.isPerfect === true) {
            const setId = key.slice("jlpt_result_".length);
            if (setId) tokenRewards.add(`jlpt-perfect:${setId}`);
          }
        } catch {
          // Lewati hasil JLPT lama yang tidak valid.
        }
      }

      localStorage.setItem(
        TOKEN_REWARDS_KEY,
        JSON.stringify(Array.from(tokenRewards))
      );
      localStorage.setItem(
        TOKEN_SPENDS_KEY,
        JSON.stringify(Array.from(tokenSpends))
      );
    }

    localStorage.setItem(ECONOMY_VERSION_KEY, "1");
    return;
  }

  /*
   * MIGRASI PROGRES LAMA
   *
   * Bab yang sudah selesai sebelum sistem token dibuat
   * tetap memperoleh reward satu kali.
   */

  const completedBab = Number(getProgress());

  const safeCompletedBab = Number.isFinite(completedBab)
    ? Math.max(0, Math.floor(completedBab) - 1)
    : 0;

  const rewardIds = new Set<string>();
  const xpRewardIds = readRewards();

  // Ambil pencapaian bab dari reward EXP lama dan progres.
  for (let bab = 1; bab <= safeCompletedBab; bab++) {
    rewardIds.add(`chapter:${bab}`);
  }

  // Pertahankan pencatatan bab yang pernah diberi EXP.
  for (const id of xpRewardIds) {
    const match = id.match(/^bab:(\d+)$/);

    if (match) {
      rewardIds.add(`chapter:${Number(match[1])}`);
    }
  }

  let migratedTokens = 0;

  // Reward bab.
  migratedTokens += rewardIds.size * CHAPTER_TOKEN_REWARD;

  const completedChapters = Array.from(rewardIds)
    .map((id) => Number(id.slice("chapter:".length)))
    .filter((bab) => Number.isInteger(bab) && bab > 0);

  // Bonus milestone setiap 10 bab.
  for (const bab of completedChapters) {
    if (bab % 10 === 0) {
      const milestoneId = `chapter-milestone:${bab}`;

      if (!rewardIds.has(milestoneId)) {
        rewardIds.add(milestoneId);
        migratedTokens += CHAPTER_MILESTONE_TOKEN_BONUS;
      }
    }
  }

  // Reward level-up berdasarkan EXP yang sudah dimiliki.
  const existingXp = Number(localStorage.getItem(XP_KEY)) || 0;
  const existingLevel = getLevelInfo(existingXp).level;

  for (let level = 2; level <= existingLevel; level++) {
    const levelRewardId = `level-up:${level}`;

    if (!rewardIds.has(levelRewardId)) {
      rewardIds.add(levelRewardId);
      migratedTokens += LEVEL_UP_TOKEN_REWARD;
    }
  }

  localStorage.setItem(
    TOKEN_REWARDS_KEY,
    JSON.stringify(Array.from(rewardIds))
  );

  localStorage.setItem(TOKEN_SPENDS_KEY, "[]");
  localStorage.setItem(TOKEN_KEY, String(migratedTokens));

  localStorage.setItem(ECONOMY_VERSION_KEY, "1");

  if (migratedTokens > 0) {
    appendTransaction({
      id: "legacy-economy-migration",
      type: "migration",
      amount: migratedTokens,
      balanceAfter: migratedTokens,
      description: "Migrasi reward dari progres Fude sebelumnya",
      createdAt: Date.now(),
    });
  }
}

// =====================================================
// GET EXP AND TOKEN
// =====================================================

export function getFudeXp(): number {
  if (typeof window === "undefined") return 0;

  initializeXp();

  const xp = Number(localStorage.getItem(XP_KEY));

  return Number.isFinite(xp)
    ? Math.max(0, Math.floor(xp))
    : 0;
}

export function getFudeTokens(): number {
  if (typeof window === "undefined") return 0;

  initializeTokenEconomy();

  return getStoredTokenBalance();
}

export function getTokenTransactions(
  limit = 50
): TokenTransaction[] {
  if (typeof window === "undefined") return [];

  initializeTokenEconomy();

  const safeLimit = Math.max(
    1,
    Math.min(500, Math.floor(limit))
  );

  return readTransactions().slice(0, safeLimit);
}

// =====================================================
// INTERNAL TOKEN REWARD
// =====================================================

function awardTokenRewardOnce(
  rewardId: string,
  amount: number,
  description: string
): boolean {
  if (typeof window === "undefined") return false;

  if (
    !rewardId ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return false;
  }

  initializeTokenEconomy();

  const rewards = readTokenRewards();

  if (rewards.includes(rewardId)) {
    return false;
  }

  const safeAmount = Math.floor(amount);

  if (safeAmount <= 0) return false;

  const currentBalance = getStoredTokenBalance();
  const newBalance = currentBalance + safeAmount;

  try {
    // Catat klaim terlebih dahulu untuk menghindari duplikasi.
    localStorage.setItem(
      TOKEN_REWARDS_KEY,
      JSON.stringify([...rewards, rewardId])
    );

    localStorage.setItem(
      TOKEN_KEY,
      String(newBalance)
    );

    appendTransaction({
      id: rewardId,
      type: "earn",
      amount: safeAmount,
      balanceAfter: newBalance,
      description,
      createdAt: Date.now(),
    });

    window.dispatchEvent(
      new Event(TOKEN_UPDATED_EVENT)
    );

    return true;
  } catch (error) {
    // Jangan tinggalkan saldo atau klaim setengah tersimpan.
    try {
      localStorage.setItem(TOKEN_KEY, String(currentBalance));
      localStorage.setItem(
        TOKEN_REWARDS_KEY,
        JSON.stringify(rewards)
      );
    } catch (rollbackError) {
      console.error("Gagal mengembalikan reward token:", rollbackError);
    }

    console.error("Gagal memberikan token:", error);
    return false;
  }
}

// Kompensasi ketika seluruh badge dalam satu rarity sudah mencapai Level 3.
export function awardGachaMaxedRarityCompensationOnce(
  rewardId: string,
  rarity: string
): boolean {
  if (!rewardId || !rarity) return false;

  return awardTokenRewardOnce(
    `gacha-compensation:${rewardId}`,
    1,
    `Kompensasi Gacha rarity ${rarity} telah maksimal`
  );
}

// =====================================================
// CHAPTER REWARDS
// =====================================================

export function awardChapterCompletionOnce(
  chapter: number
): ChapterRewardResult {
  const emptyResult: ChapterRewardResult = {
    xpAwarded: false,
    chapterTokensAwarded: false,
    milestoneTokensAwarded: false,
  };

  if (typeof window === "undefined") {
    return emptyResult;
  }

  const bab = Math.floor(chapter);

  if (!Number.isFinite(bab) || bab < 1) {
    return emptyResult;
  }

  initializeTokenEconomy();

  // EXP bab, satu kali per bab.
  const xpAwarded = awardXpOnce(
    `bab:${bab}`,
    BAB_COMPLETION_XP
  );

  // Token penyelesaian bab.
  const chapterTokensAwarded = awardTokenRewardOnce(
    `chapter:${bab}`,
    CHAPTER_TOKEN_REWARD,
    `Menyelesaikan Bab ${bab}`
  );

  // Bonus setiap kelipatan 10 bab.
  let milestoneTokensAwarded = false;

  if (bab % 10 === 0) {
    milestoneTokensAwarded = awardTokenRewardOnce(
      `chapter-milestone:${bab}`,
      CHAPTER_MILESTONE_TOKEN_BONUS,
      `Bonus milestone Bab ${bab}`
    );
  }

  dispatchEconomyUpdate();

  return {
    xpAwarded,
    chapterTokensAwarded,
    milestoneTokensAwarded,
  };
}

// =====================================================
// JLPT TOKEN REWARDS
// =====================================================

// Panggil hanya setelah server atau sistem penilaian
// memastikan set tersebut memperoleh nilai 100%.
export function awardJlptPerfectRewardOnce(
  setId: string
): boolean {
  if (!setId || typeof setId !== "string") {
    return false;
  }

  return awardTokenRewardOnce(
    `jlpt-perfect:${setId}`,
    JLPT_PERFECT_TOKEN_REWARD,
    `Perfect Score: ${setId}`
  );
}

// Panggil setelah semua Practice Set wajib dalam satu
// level JLPT benar-benar diselesaikan.
export function awardJlptLevelCompletionOnce(
  level: string
): boolean {
  const normalizedLevel = level.toUpperCase();
  const reward = JLPT_LEVEL_TOKEN_REWARDS[normalizedLevel];

  if (!reward) return false;

  return awardTokenRewardOnce(
    `jlpt-level:${normalizedLevel}`,
    reward,
    `Menyelesaikan JLPT ${normalizedLevel}`
  );
}

// =====================================================
// SPEND TOKEN
// =====================================================

// Untuk summon dan fitur lain yang memerlukan token.
// Setiap actionId hanya boleh mengurangi saldo satu kali.
export function spendFudeTokensOnce(
  actionId: string,
  amount: number,
  description: string
): boolean {
  if (typeof window === "undefined") return false;

  if (
    !actionId ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return false;
  }

  initializeTokenEconomy();

  const spends = readTokenSpends();

  if (spends.includes(actionId)) {
    return false;
  }

  const safeAmount = Math.floor(amount);

  if (safeAmount <= 0) return false;

  const currentBalance = getStoredTokenBalance();

  if (currentBalance < safeAmount) {
    return false;
  }

  const newBalance = currentBalance - safeAmount;

  try {
    localStorage.setItem(
      TOKEN_SPENDS_KEY,
      JSON.stringify([...spends, actionId])
    );

    localStorage.setItem(
      TOKEN_KEY,
      String(newBalance)
    );

    appendTransaction({
      id: actionId,
      type: "spend",
      amount: -safeAmount,
      balanceAfter: newBalance,
      description,
      createdAt: Date.now(),
    });

    window.dispatchEvent(
      new Event(TOKEN_UPDATED_EVENT)
    );

    return true;
  } catch (error) {
    // Jika pencatatan transaksi gagal, kembalikan saldo dan
    // daftar spend agar pemanggil tidak kehilangan token.
    try {
      localStorage.setItem(TOKEN_KEY, String(currentBalance));
      localStorage.setItem(
        TOKEN_SPENDS_KEY,
        JSON.stringify(spends)
      );
    } catch (rollbackError) {
      console.error("Gagal mengembalikan saldo token:", rollbackError);
    }

    console.error("Gagal menggunakan token:", error);
    return false;
  }
}

// Kembalikan Token untuk transaksi yang sudah tercatat sebagai spend.
// ID refund unik memastikan pemanggilan ulang tidak menambah saldo dua kali.
export function refundFudeTokensOnce(
  actionId: string,
  amount: number,
  description: string
): boolean {
  if (typeof window === "undefined" || !actionId) return false;

  initializeTokenEconomy();

  if (!readTokenSpends().includes(actionId)) {
    return false;
  }

  const refundId = `refund:${actionId}`;
  if (readTokenRewards().includes(refundId)) {
    return true;
  }

  return awardTokenRewardOnce(
    refundId,
    amount,
    description
  );
}

// =====================================================
// EXP REWARD
// =====================================================

// Satu aktivitas hanya boleh memberikan EXP satu kali.
// Setiap level baru yang dicapai memberikan +5 token.
export function awardXpOnce(
  rewardId: string,
  amount: number
): boolean {
  if (typeof window === "undefined") return false;

  if (
    !rewardId ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return false;
  }

  initializeTokenEconomy();

  const rewards = readRewards();

  if (rewards.includes(rewardId)) {
    return false;
  }

  const currentXp = getFudeXp();
  const oldLevel = getLevelInfo(currentXp).level;

  const safeAmount = Math.floor(amount);

  if (safeAmount <= 0) return false;

  const newXp = currentXp + safeAmount;
  const newLevel = getLevelInfo(newXp).level;

  try {
    localStorage.setItem(XP_KEY, String(newXp));

    localStorage.setItem(
      XP_REWARDS_KEY,
      JSON.stringify([...rewards, rewardId])
    );

    // Berikan token untuk setiap level baru yang dilewati.
    for (
      let level = oldLevel + 1;
      level <= newLevel;
      level++
    ) {
      awardTokenRewardOnce(
        `level-up:${level}`,
        LEVEL_UP_TOKEN_REWARD,
        `Mencapai Level ${level}`
      );
    }

    dispatchEconomyUpdate();

    return true;
  } catch (error) {
    console.error("Gagal memberikan EXP:", error);
    return false;
  }
}


// =====================================================
// JLPT EXP REWARDS
// =====================================================

export function awardJlptCompletionXpOnce(
  setId: string
): boolean {
  if (!setId || typeof setId !== "string") {
    return false;
  }
  initializeTokenEconomy();
  const rewards = readRewards();

  // Cegah klaim ulang dari sistem reward lama.
  if (rewards.includes(`jlpt:${setId}`)) {
    return false;
  }

  return awardXpOnce(
    `jlpt-completion:${setId}`,
    JLPT_COMPLETION_XP
  );
}

export function awardJlptHighScoreBonusOnce(
  setId: string
): boolean {
  if (!setId || typeof setId !== "string") {
    return false;
  }
  // Bonus skor tinggi adalah reward terpisah dari EXP penyelesaian.
  // Marker migrasi lama jlpt:<setId> hanya mewakili EXP penyelesaian
  // dan tidak boleh menghalangi bonus 80% yang belum pernah diklaim.
  initializeTokenEconomy();

  return awardXpOnce(
    `jlpt-high-score:${setId}`,
    JLPT_HIGH_SCORE_BONUS_XP
  );
}

// =====================================================
// PROFILE
// =====================================================

export function getFudeProfile(): FudeProfile {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }

  try {
    const raw = localStorage.getItem(PROFILE_KEY);

    if (!raw) return DEFAULT_PROFILE;

    const parsed = JSON.parse(raw);

    return {
      name:
        typeof parsed.name === "string" &&
        parsed.name.trim()
          ? parsed.name
          : DEFAULT_PROFILE.name,

      avatar:
        typeof parsed.avatar === "string"
          ? parsed.avatar
          : DEFAULT_PROFILE.avatar,

      photoDataUrl:
        typeof parsed.photoDataUrl === "string"
          ? parsed.photoDataUrl
          : null,

      equippedBadgeId:
        typeof parsed.equippedBadgeId === "string"
          ? parsed.equippedBadgeId
          : null,

      equippedFrameId:
        typeof parsed.equippedFrameId === "string"
          ? parsed.equippedFrameId
          : DEFAULT_PROFILE.equippedFrameId,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

// Partial update agar mengubah nama tidak menghapus
// foto, badge, atau frame yang sudah dipilih.
export function saveFudeProfile(
  updates: Partial<FudeProfile>
): void {
  if (typeof window === "undefined") return;

  const current = getFudeProfile();

  const updated: FudeProfile = {
    ...current,
    ...updates,
  };

  localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify(updated)
  );

  window.dispatchEvent(
    new Event(PROFILE_UPDATED_EVENT)
  );
}
