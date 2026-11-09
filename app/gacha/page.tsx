"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dices,
  Sparkles,
  Coins,
  Layers3,
  ShieldCheck,
  WandSparkles,
  RefreshCw,
  Info,
  Search,
} from "lucide-react";

import { GACHA_BADGES } from "@/data/gacha-badges";
import {
  GACHA_CATALOG_SIZE,
  GACHA_RARITIES,
  GACHA_UPDATED_EVENT,
  evolveGachaBadge,
  getGachaBadgeEvolutionProgress,
  getGachaHistory,
  getGachaInventory,
  markGachaBadgeSeen,
  getGachaRateLevel,
  getGachaRates,
  getTotalGachaBadgeCopies,
  summonGacha,
  type GachaBadgeCopies,
  type GachaCompensation,
  type GachaHistoryEntry,
  type GachaInventory,
  type GachaRarity,
} from "@/lib/gacha";
import {
  getFudeTokens,
  getFudeProfile,
  saveFudeProfile,
} from "@/lib/gamification";

const RARITY_LABELS: Record<GachaRarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  mythic: "Mythic",
  legendary: "Legendary",
};

const RARITY_STYLES: Record<GachaRarity, string> = {
  common: "border-stone-400/40 bg-stone-500/10 text-stone-200",
  uncommon: "border-green-400/40 bg-green-500/10 text-green-200",
  rare: "border-blue-400/40 bg-blue-500/10 text-blue-200",
  epic: "border-purple-400/40 bg-purple-500/10 text-purple-200",
  mythic: "border-amber-300/50 bg-amber-400/10 text-amber-100",
  legendary: "border-red-400/50 bg-red-500/10 text-red-200",
};

const RARITY_GLOW: Record<GachaRarity, string> = {
  common: "shadow-stone-500/10",
  uncommon: "shadow-green-500/10",
  rare: "shadow-blue-500/15",
  epic: "shadow-purple-500/20",
  mythic: "shadow-amber-400/20",
  legendary: "shadow-red-500/25",
};

function copiesFor(
  inventory: GachaInventory,
  badgeId: string
): GachaBadgeCopies {
  return inventory.badges[badgeId] ?? {
    level0: 0,
    level1: 0,
    level2: 0,
    level3: 0,
  };
}

export default function GachaPage() {
  const [inventory, setInventory] = useState<GachaInventory>({
    version: 1,
    badges: {},
    newBadgeIds: [],
    updatedAt: 0,
  });
  const [history, setHistory] = useState<GachaHistoryEntry[]>([]);
  const [tokens, setTokens] = useState(0);
  const [equippedBadgeId, setEquippedBadgeId] = useState<string | null>(null);
  const [latestResults, setLatestResults] = useState<GachaHistoryEntry[]>([]);
  const [latestCompensations, setLatestCompensations] = useState<GachaCompensation[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [activeRarity, setActiveRarity] = useState<GachaRarity | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const refresh = useCallback(() => {
    setInventory(getGachaInventory());
    setHistory(getGachaHistory(30));
    setTokens(getFudeTokens());
    setEquippedBadgeId(getFudeProfile().equippedBadgeId ?? null);
  }, []);

  useEffect(() => {
    const initialRefresh = window.requestAnimationFrame(refresh);
    window.addEventListener(GACHA_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.cancelAnimationFrame(initialRefresh);
      window.removeEventListener(GACHA_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const ownedBadges = useMemo(
    () =>
      GACHA_BADGES.filter(
        (badge) => getTotalGachaBadgeCopies(copiesFor(inventory, badge.id)) > 0
      )
        .filter((badge) => activeRarity === "all" || badge.rarity === activeRarity)
        .filter((badge) =>
          `${badge.name} ${badge.description ?? ""}`
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        ),
    [inventory, activeRarity, searchTerm]
  );

  const totalOwned = useMemo(
    () =>
      Object.values(inventory.badges).reduce(
        (sum, copies) => sum + getTotalGachaBadgeCopies(copies),
        0
      ),
    [inventory]
  );

  const uniqueOwned = GACHA_BADGES.filter(
    (badge) => getTotalGachaBadgeCopies(copiesFor(inventory, badge.id)) > 0
  ).length;

  const rates = getGachaRates();
  const rateLevel = getGachaRateLevel();
  const maxedRarities = GACHA_RARITIES.filter((rarity) => {
    const rarityBadges = GACHA_BADGES.filter((badge) => badge.rarity === rarity);
    return rarityBadges.length > 0 && rarityBadges.every(
      (badge) => (inventory.badges[badge.id]?.level3 ?? 0) > 0
    );
  });

  const handleSummon = async (count: 1 | 10) => {
    if (busy) return;
    setBusy(true);
    setError("");
    setLatestResults([]);
    setLatestCompensations([]);

    try {
      // Beri waktu untuk animasi gerbang sebelum hasil dibuka.
      await new Promise<void>((resolve) => window.setTimeout(resolve, 650));

      const result = summonGacha(count, GACHA_BADGES);

      if (!result.ok) {
        const messages = {
          "not-available": "Gacha hanya bisa digunakan di browser.",
          "invalid-catalog": "Data koleksi Gacha belum valid.",
          "invalid-count": "Jumlah summon tidak valid.",
          "insufficient-tokens": "Token lu belum cukup.",
          "storage-error": "Gagal menyimpan hasil summon. Token tidak boleh terpotong.",
          "not-enough-copies": "Duplikat badge belum cukup.",
          "max-evolution": "Badge ini sudah mencapai evolusi maksimal.",
        };
        setError(messages[result.reason]);
        return;
      }

      setLatestResults(result.summon?.results ?? []);
      setLatestCompensations(result.summon?.compensations ?? []);
      refresh();
    } catch (summonError) {
      console.error("Gagal menjalankan Gacha:", summonError);
      setError("Gacha gagal diproses. Coba lagi setelah memeriksa saldo token.");
    } finally {
      setBusy(false);
    }
  };

  const handleEquip = (badgeId: string) => {
    const copies = inventory.badges[badgeId];
    if (!copies || getTotalGachaBadgeCopies(copies) <= 0) return;

    saveFudeProfile({ equippedBadgeId: badgeId });
    setEquippedBadgeId(badgeId);
  };

  const handleEvolve = (badgeId: string) => {
    const result = evolveGachaBadge(badgeId);

    if (!result.ok) {
      setError(
        result.reason === "max-evolution"
          ? "Badge sudah mencapai Level 3."
          : "Salinan badge belum cukup untuk evolusi."
      );
      return;
    }

    setError("");
    refresh();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-12">
      <header className="relative overflow-hidden rounded-3xl border border-[#8E6B2B]/40 bg-[#1E1B18] p-6 md:p-9">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#B8860B]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#C93438]/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#B8860B]/40 bg-[#B8860B]/10 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-[#E7C46A]">
              <Sparkles size={13} />
              FUDE COLLECTION ARCHIVE
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#F0E9D9] md:text-4xl">
              Gacha <span className="text-[#D6AD4F]">Sanctum</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#B7AA96]">
              Kumpulkan 300 badge dari enam rarity, temukan duplikat, lalu
              kembangkan koleksi sampai Level 3.
            </p>
          </div>

          <div className="flex min-w-[190px] items-center gap-3 rounded-2xl border border-[#D6AD4F]/30 bg-black/25 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D6AD4F]/10 text-[#E7C46A]">
              <Coins size={23} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-[#A3A099]">
                TOKEN BALANCE
              </p>
              <p className="text-2xl font-black tabular-nums text-[#F1D58A]">
                {tokens.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-7 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/5 bg-black/20 p-3">
            <p className="text-xl font-black text-white">{uniqueOwned}/{GACHA_CATALOG_SIZE}</p>
            <p className="text-[10px] text-[#A3A099]">Badge unik</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 p-3">
            <p className="text-xl font-black text-white">{totalOwned}</p>
            <p className="text-[10px] text-[#A3A099]">Total salinan</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 p-3">
            <p className="text-xl font-black text-white">{history.length}</p>
            <p className="text-[10px] text-[#A3A099]">Riwayat terbaru</p>
          </div>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-3xl border border-[#5E4930] bg-gradient-to-br from-[#30271C] via-[#211D19] to-[#171615] p-6 md:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D6AD4F]/30" />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#D6AD4F]/40" />
          </div>

          <div
            className="relative flex min-h-[250px] flex-col items-center justify-center text-center"
            aria-busy={busy}
          >
            <div className={`relative mb-5 flex h-28 w-28 items-center justify-center rounded-full border border-[#E7C46A]/50 bg-[#B8860B]/10 shadow-[0_0_60px_rgba(184,134,11,0.18)] ${busy ? "fude-gacha-pulse" : ""}`}>
              <div className="absolute inset-2 rounded-full border border-dashed border-[#E7C46A]/40" />
              <Dices size={48} className="text-[#E7C46A]" />
              <Sparkles size={17} className="absolute -right-1 top-3 text-[#F6E6AE]" />
            </div>
            <p className="text-[10px] font-black tracking-[0.25em] text-[#D6AD4F]">
              SUMMON GATE
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#F0E9D9]">
              Panggil koleksi baru
            </h2>
            <p className="mt-2 max-w-sm text-xs leading-5 text-[#A99C89]">
              Satu summon membutuhkan 1 token. Summon 10x membutuhkan tepat
              10 token.
            </p>

            <div className="mt-6 flex w-full max-w-sm gap-3">
              <button
                onClick={() => handleSummon(1)}
                disabled={busy || tokens < 1}
                className="flex-1 rounded-xl border border-[#B8860B]/50 bg-[#B8860B]/15 px-4 py-3 text-sm font-black text-[#F1D58A] transition hover:bg-[#B8860B]/25 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? "Memproses..." : "SUMMON 1X · 1"}
              </button>
              <button
                onClick={() => handleSummon(10)}
                disabled={busy || tokens < 10}
                className="flex-1 rounded-xl bg-[#C93438] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#C93438]/20 transition hover:bg-[#B02A2E] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? "Memproses..." : "SUMMON 10X · 10"}
              </button>
            </div>
            {error && (
              <p role="alert" className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-[#33312E] bg-[#1E1D1B] p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={19} className="text-[#D6AD4F]" />
            <h2 className="font-bold text-[#EAE6DD]">Peluang Summon</h2>
          </div>
          <p className="mt-1 text-xs text-[#A3A099]">
            Tingkat peluang mengikuti progres JLPT tertinggi yang sudah selesai.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#262523] px-3 py-2">
            <span className="text-xs text-[#A3A099]">Rate aktif</span>
            <span className="text-xs font-black text-[#E7C46A]">{rateLevel}</span>
          </div>

          <div className="mt-4 space-y-3">
            {GACHA_RARITIES.map((rarity) => (
              <div key={rarity}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-[#D8D1C5]">{RARITY_LABELS[rarity]}</span>
                  <span className="font-bold tabular-nums text-white">
                    {rates[rarity].toLocaleString("id-ID", {
                      maximumFractionDigits: 2,
                    })}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#33312E]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8D6B35] to-[#E7C46A]"
                    style={{ width: `${rates[rarity]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#B8860B]/20 bg-[#B8860B]/5 p-3">
            <Info size={15} className="mt-0.5 shrink-0 text-[#D6AD4F]" />
            <p className="text-[10px] leading-5 text-[#A99C89]">
              Semua rarity tersedia sejak awal. Menyelesaikan level JLPT yang
              lebih tinggi meningkatkan peluang rarity tinggi. Peluang
              ditampilkan secara terbuka dan totalnya 100%.
            </p>
          </div>
          {maxedRarities.length > 0 && (
            <p className="mt-3 text-[10px] leading-5 text-[#E7C46A]">
              Rarity maksimal: {maxedRarities.map((rarity) => RARITY_LABELS[rarity]).join(", ")}.
              Jika rarity tersebut terpilih, lu mendapat kompensasi 1 token.
            </p>
          )}
        </div>
      </section>

      {(latestResults.length > 0 || latestCompensations.length > 0) && (
        <section className="rounded-3xl border border-[#B8860B]/40 bg-[#211E19] p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black tracking-widest text-[#D6AD4F]">
                SUMMON COMPLETE
              </p>
              <h2 className="mt-1 text-lg font-black text-[#F0E9D9]">
                Hasil summon
              </h2>
            </div>
            <button
              onClick={() => {
                setLatestResults([]);
                setLatestCompensations([]);
              }}
              className="rounded-lg bg-[#33312E] px-3 py-2 text-xs font-bold text-[#D8D1C5] hover:bg-[#44413D]"
            >
              Tutup
            </button>
          </div>
          {latestCompensations.length > 0 && (
            <div className="mb-4 rounded-xl border border-[#D6AD4F]/30 bg-[#B8860B]/10 p-3">
              <p className="text-xs font-bold text-[#F1D58A]">
                Kompensasi rarity maksimal: +{latestCompensations.reduce((sum, item) => sum + item.tokens, 0)} token
              </p>
              <p className="mt-1 text-[10px] text-[#A99C89]">
                Semua badge pada rarity {latestCompensations.map((item) => RARITY_LABELS[item.rarity]).join(", ")} sudah mencapai Level 3 dan dikeluarkan dari pool summon.
              </p>
            </div>
          )}
          {latestResults.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {latestResults.map((result, index) => {
              const badge = GACHA_BADGES.find((item) => item.id === result.badgeId);
              return (
                <div
                  key={result.id}
                  className={`fude-gacha-reveal rounded-2xl border p-3 text-center shadow-lg ${RARITY_STYLES[result.rarity]} ${RARITY_GLOW[result.rarity]}`}
                  style={{ animationDelay: `${index * 65}ms` }}
                >
                  <div className="text-3xl">{badge?.icon ?? "✦"}</div>
                  <p className="mt-2 line-clamp-2 text-xs font-black">{result.badgeName}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wider opacity-80">
                    {RARITY_LABELS[result.rarity]}
                  </p>
                </div>
              );
            })}
            </div>
          )}
        </section>
      )}

      <section className="rounded-3xl border border-[#33312E] bg-[#1E1D1B] p-5 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Layers3 size={19} className="text-[#D6AD4F]" />
              <h2 className="text-lg font-black text-[#EAE6DD]">Inventori Badge</h2>
            </div>
            <p className="mt-1 text-xs text-[#A3A099]">
              Duplikat bisa digabung untuk meningkatkan badge sampai Level 3.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveRarity("all")}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-bold ${activeRarity === "all" ? "bg-[#B8860B] text-white" : "bg-[#33312E] text-[#A3A099]"}`}
            >
              Semua
            </button>
            {GACHA_RARITIES.map((rarity) => (
              <button
                key={rarity}
                onClick={() => setActiveRarity(rarity)}
                className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${activeRarity === rarity ? "bg-[#B8860B] text-white" : "bg-[#33312E] text-[#A3A099]"}`}
              >
                {RARITY_LABELS[rarity]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#33312E] bg-[#262523] px-3">
          <Search size={15} className="shrink-0 text-[#817A73]" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Cari nama atau deskripsi badge..."
            className="w-full bg-transparent py-3 text-xs text-[#EAE6DD] outline-none placeholder:text-[#817A73]"
          />
        </div>

        {ownedBadges.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#44413D] p-8 text-center">
            <Dices size={30} className="mx-auto text-[#817A73]" />
            <p className="mt-3 text-sm font-bold text-[#D8D1C5]">
              Belum ada badge di kategori ini
            </p>
            <p className="mt-1 text-xs text-[#817A73]">
              Mulai summon untuk mengisi inventori koleksimu.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {ownedBadges.map((badge) => {
              const copies = copiesFor(inventory, badge.id);
              const total = getTotalGachaBadgeCopies(copies);
              const progress = getGachaBadgeEvolutionProgress(copies);
              const isNew = inventory.newBadgeIds.includes(badge.id);
              return (
                <article
                  key={badge.id}
                  className={`rounded-2xl border bg-[#262523] p-3 shadow-lg ${RARITY_GLOW[badge.rarity]} ${RARITY_STYLES[badge.rarity]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl">{badge.icon}</span>
                    <div className="flex flex-col items-end gap-1">
                      {isNew && (
                        <span className="rounded-md bg-[#C93438] px-2 py-1 text-[8px] font-black text-white">
                          NEW
                        </span>
                      )}
                      <span className="rounded-md bg-black/20 px-2 py-1 text-[9px] font-black">
                      Lv. {Math.max(
                        copies.level3 > 0 ? 3 : 0,
                        copies.level2 > 0 ? 2 : 0,
                        copies.level1 > 0 ? 1 : 0
                      )}
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-xs font-black text-[#F0E9D9]">
                    {badge.name}
                  </h3>
                  <p className="mt-1 text-[9px] uppercase tracking-wider opacity-80">
                    {RARITY_LABELS[badge.rarity]}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-[#A99C89]">
                    {badge.description}
                  </p>
                  <div className="mt-3 rounded-lg bg-black/20 p-2">
                    <p className="text-[10px] text-[#D8D1C5]">
                      Salinan: <strong>{total}</strong>
                    </p>
                    <p className="mt-1 text-[9px] text-[#A3A099]">
                      Lv0 {copies.level0} · Lv1 {copies.level1} · Lv2 {copies.level2} · Lv3 {copies.level3}
                    </p>
                    {progress.currentLevel === 3 ? (
                      <p className="mt-2 text-[9px] font-bold text-[#E7C46A]">
                        Evolusi maksimal · Level 3
                      </p>
                    ) : (
                      <p className="mt-2 text-[9px] text-[#A99C89]">
                        Progres evolusi Lv{progress.currentLevel}: {progress.copiesOwned}/{progress.copiesRequired}
                        {progress.canEvolve && " · Siap"}
                      </p>
                    )}
                  </div>
                  {isNew && (
                    <button
                      onClick={() => markGachaBadgeSeen(badge.id)}
                      className="mt-3 w-full rounded-lg border border-[#C93438]/30 bg-[#C93438]/10 py-2 text-[10px] font-bold text-[#F0A0A0] hover:bg-[#C93438]/20"
                    >
                      Tandai sudah dilihat
                    </button>
                  )}
                  <button
                    onClick={() => handleEquip(badge.id)}
                    disabled={equippedBadgeId === badge.id}
                    className="mt-2 w-full rounded-lg border border-[#60A5FA]/30 bg-[#60A5FA]/10 py-2 text-[10px] font-bold text-[#BFDBFE] hover:bg-[#60A5FA]/20 disabled:cursor-default disabled:opacity-60"
                  >
                    {equippedBadgeId === badge.id ? "Terpasang di Profil" : "Pasang Badge"}
                  </button>
                  <button
                    onClick={() => handleEvolve(badge.id)}
                    disabled={!progress.canEvolve}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#B8860B]/40 bg-[#B8860B]/10 py-2 text-[10px] font-black text-[#E7C46A] transition hover:bg-[#B8860B]/20 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <WandSparkles size={12} />
                    {progress.canEvolve ? "Evolusi" : "Belum cukup"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-[#33312E] bg-[#1E1D1B] p-5 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-[#EAE6DD]">Riwayat Summon</h2>
            <p className="mt-1 text-xs text-[#A3A099]">Maksimal 200 hasil terakhir tersimpan.</p>
          </div>
          <RefreshCw size={17} className="text-[#817A73]" />
        </div>
        {history.length === 0 ? (
          <p className="mt-5 text-xs text-[#817A73]">Belum ada riwayat summon.</p>
        ) : (
          <div className="mt-4 divide-y divide-[#33312E]">
            {history.slice(0, 12).map((entry) => {
              const badge = GACHA_BADGES.find((item) => item.id === entry.badgeId);
              return (
                <div key={entry.id} className="flex items-center gap-3 py-3">
                  <span className="text-xl">{badge?.icon ?? "✦"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-[#EAE6DD]">{entry.badgeName}</p>
                    <p className="text-[9px] text-[#817A73]">
                      {new Date(entry.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span className={`rounded-md border px-2 py-1 text-[9px] font-black ${RARITY_STYLES[entry.rarity]}`}>
                    {RARITY_LABELS[entry.rarity]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
