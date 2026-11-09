"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Languages,
  Layers,
  Home,
  BookA,
  Sparkles,
  X,
  Coins,
  Dices,
} from "lucide-react";
import { useEffect, useState } from "react";

import ProfileAvatar from "./ProfileAvatar";
import { getProfilePhoto } from "../lib/profile-photo";

import {
  getFudeProfile,
  getFudeXp,
  getFudeTokens,
  getLevelInfo,
  PROFILE_UPDATED_EVENT,
  XP_UPDATED_EVENT,
  TOKEN_UPDATED_EVENT,
  type FudeProfile,
} from "../lib/gamification";

import {
  GACHA_UPDATED_EVENT,
  getGachaInventory,
} from "../lib/gacha";

import {
  COLLECTION_UPDATED_EVENT,
  initializeCollectionTracking,
  syncNewCollectionUnlocks,
  getPendingCollectionIds,
  type CollectionUnlockNotice,
} from "../lib/profile-collections";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/belajar", label: "Belajar", icon: BookOpen },
  { href: "/kosakata", label: "Kosakata", icon: Languages },
  { href: "/flashcard", label: "Flashcard", icon: Layers },
  { href: "/konjugasi", label: "Konjugasi", icon: BookA },
  { href: "/gacha", label: "Gacha", icon: Dices },
];

export default function Sidebar() {
  const path = usePathname();

  const [profile, setProfile] = useState<FudeProfile>({
    name: "Pelajar Fude",
    avatar: "筆",
  });

  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [tokens, setTokens] = useState(0);
  const [newGachaCount, setNewGachaCount] = useState(0);
  const [levelInfo, setLevelInfo] = useState(() => getLevelInfo(0));

  const [unlockNotices, setUnlockNotices] = useState<
    CollectionUnlockNotice[]
  >([]);

  useEffect(() => {
    let active = true;
    let currentPhotoUrl: string | null = null;

    const refreshPhoto = async () => {
      try {
        const blob = await getProfilePhoto();

        if (!active) return;

        if (currentPhotoUrl) {
          URL.revokeObjectURL(currentPhotoUrl);
        }

        currentPhotoUrl = blob ? URL.createObjectURL(blob) : null;
        setPhotoSrc(currentPhotoUrl);
      } catch (error) {
        console.error("Gagal memuat foto Sidebar:", error);
      }
    };

    const refreshProfile = () => {
      setProfile(getFudeProfile());
      void refreshPhoto();
    };

    const refreshXp = () => {
      const xp = getFudeXp();
      setLevelInfo(getLevelInfo(xp));
      syncNewCollectionUnlocks();
    };


    const refreshTokens = () => {
      setTokens(getFudeTokens());
      syncNewCollectionUnlocks();
    };

    const refreshGacha = () => {
      setNewGachaCount(getGachaInventory().newBadgeIds.length);
    };

    const handleCollectionUpdate = (event: Event) => {
      const detail = (
        event as CustomEvent<CollectionUnlockNotice[]>
      ).detail;

      if (!Array.isArray(detail) || detail.length === 0) {
        // Jika item sudah dibuka dari halaman profil, tutup toast terkait.
        const pendingIds = new Set(getPendingCollectionIds());

        setUnlockNotices((previous) =>
          previous.filter((item) => pendingIds.has(item.id))
        );
        return;
      }

      setUnlockNotices((previous) => {
        const ids = new Set(previous.map((item) => item.id));

        return [
          ...previous,
          ...detail.filter((item) => !ids.has(item.id)),
        ];
      });
    };

    // Pasang listener sebelum sinkronisasi awal agar unlock yang
    // terjadi saat aplikasi tidak dibuka tetap bisa menampilkan notifikasi.
    window.addEventListener(PROFILE_UPDATED_EVENT, refreshProfile);
    window.addEventListener(XP_UPDATED_EVENT, refreshXp);
    window.addEventListener(TOKEN_UPDATED_EVENT, refreshTokens);
    window.addEventListener(GACHA_UPDATED_EVENT, refreshGacha);
    window.addEventListener("storage", refreshTokens);
    window.addEventListener("storage", refreshGacha);
    window.addEventListener("storage", refreshProfile);
    window.addEventListener("storage", refreshXp);

    window.addEventListener(
      COLLECTION_UPDATED_EVENT,
      handleCollectionUpdate
    );

    initializeCollectionTracking();

    refreshProfile();
    refreshXp();
    refreshTokens();
    refreshGacha();

    return () => {
      active = false;

      if (currentPhotoUrl) {
        URL.revokeObjectURL(currentPhotoUrl);
      }

      window.removeEventListener(PROFILE_UPDATED_EVENT, refreshProfile);
      window.removeEventListener(XP_UPDATED_EVENT, refreshXp);
      window.removeEventListener(TOKEN_UPDATED_EVENT, refreshTokens);
      window.removeEventListener(GACHA_UPDATED_EVENT, refreshGacha);
      window.removeEventListener("storage", refreshTokens);
      window.removeEventListener("storage", refreshGacha);
      window.removeEventListener("storage", refreshProfile);
      window.removeEventListener("storage", refreshXp);

      window.removeEventListener(
        COLLECTION_UPDATED_EVENT,
        handleCollectionUpdate
      );
    };
  }, []);

  const dismissNotice = (id: string) => {
    setUnlockNotices((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  return (
    <>
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:border-r md:border-[#33312E]/50 md:bg-[#1A1918]/80 md:backdrop-blur-xl z-40">

        {/* LOGO */}
        <div className="p-6 border-b border-[#33312E]/50 flex items-center gap-3">
          <Image
            src="/logo.webp"
            alt="Fude Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />

          <div>
            <h1 className="text-xl font-bold text-[#EAE6DD]">Fude</h1>
            <p className="text-[10px] text-[#A3A099] mt-0.5 tracking-wider uppercase font-semibold">
              Nol sampai N1
            </p>
          </div>
        </div>

        {/* NAVIGASI */}
        <nav className="flex-1 p-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = path === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                  isActive
                    ? "bg-[#C93438] text-white shadow-lg shadow-[#C93438]/20"
                    : "hover:bg-[#262523] text-[#A3A099] hover:text-[#EAE6DD]"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="flex-1 text-sm font-medium">{tab.label}</span>
                {tab.href === "/gacha" && newGachaCount > 0 && (
                  <span className="rounded-full bg-[#C93438] px-2 py-0.5 text-[9px] font-black text-white">
                    NEW {newGachaCount > 99 ? "99+" : newGachaCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* PROFIL DAN EXP */}
        <div className="p-4 border-t border-[#33312E]/50">
          <Link
            href="/profil"
            className="block bg-[#262523] hover:bg-[#33312E] transition-all rounded-xl p-3 group"
          >
            <div className="flex items-center gap-3">
              <div className="pb-2 shrink-0">
                <ProfileAvatar
                  avatar={profile.avatar}
                  photoSrc={photoSrc}
                  badgeId={profile.equippedBadgeId}
                  frameId={profile.equippedFrameId}
                  size={46}
                />
              </div>

              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-sm font-bold text-[#EAE6DD] truncate group-hover:text-white">
                  {profile.name}
                </p>

                <p className="text-[11px] text-[#B8860B] font-semibold mt-0.5">
                  {levelInfo.rank} · LVL {levelInfo.level}
                </p>
              </div>
            </div>

            {/* SALDO TOKEN */}
            <div className="mt-3 flex items-center justify-between bg-[#1A1918] border border-[#B8860B]/20 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#B8860B]/10 flex items-center justify-center">
                  <Coins size={15} className="text-[#D6AD4F]" />
                </div>

                <span className="text-[10px] font-bold tracking-wider text-[#A3A099]">
                  TOKEN BALANCE
                </span>
              </div>

              <span className="text-sm font-black text-[#E7C46A] tabular-nums">
                {tokens.toLocaleString("id-ID")}
              </span>
            </div>

            {/* BAR EXP */}
            <div className="mt-3">
              <div className="flex justify-between items-center text-[10px] font-bold mb-1.5">
                <span className="text-[#A3A099]">EXPERIENCE</span>
                <span className="text-[#EAE6DD] tabular-nums">
                  {levelInfo.currentExp} / {levelInfo.requiredExp} EXP
                </span>
              </div>

              <div
                className="w-full h-2 bg-[#121110] rounded-full overflow-hidden"
                role="progressbar"
                aria-label="Experience menuju level berikutnya"
                aria-valuenow={levelInfo.currentExp}
                aria-valuemin={0}
                aria-valuemax={levelInfo.requiredExp}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#C93438] to-[#B8860B] rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>

              <p className="text-[10px] text-[#817A73] mt-1.5 text-right">
                {levelInfo.remainingExp} EXP menuju level berikutnya
              </p>
            </div>
          </Link>
        </div>
      </aside>

      {/* NOTIFIKASI KOLEKSI BARU */}
      {unlockNotices.length > 0 && (
        <div
          className="fixed top-4 right-4 z-[300] w-[min(360px,calc(100vw-2rem))] space-y-3 pointer-events-none"
          aria-live="polite"
        >
          {unlockNotices.map((notice) => (
            <div
              key={notice.id}
              className="pointer-events-auto bg-[#1E1D1B] border border-[#B8860B]/50 rounded-2xl p-4 shadow-2xl shadow-black/40 animate-in slide-in-from-top-3 fade-in"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#B8860B]/10 border border-[#B8860B]/30 flex items-center justify-center text-2xl shrink-0">
                  {notice.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[#B8860B] text-[10px] font-black tracking-widest">
                    <Sparkles size={13} />
                    NEW COLLECTION UNLOCKED
                  </div>

                  <p className="font-bold text-[#EAE6DD] mt-1">
                    {notice.name}
                  </p>

                  <p className="text-xs text-[#A3A099] mt-1">
                    {notice.type === "badge"
                      ? "Badge baru berhasil dibuka!"
                      : "Frame avatar baru berhasil dibuka!"}
                  </p>
                </div>

                <button
                  onClick={() => dismissNotice(notice.id)}
                  aria-label="Tutup notifikasi"
                  className="text-[#817A73] hover:text-white p-1"
                >
                  <X size={17} />
                </button>
              </div>

              <Link
                href="/profil"
                onClick={() => dismissNotice(notice.id)}
                className="mt-3 block text-center bg-[#B8860B]/15 border border-[#B8860B]/30 text-[#EAE6DD] hover:bg-[#B8860B]/25 rounded-lg py-2 text-xs font-bold transition-colors"
              >
                Lihat Koleksi
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}