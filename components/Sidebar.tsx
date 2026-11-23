"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen, Languages, Layers, Home, BookA, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ProfilePicture from "./ProfilePicture";
import { getProfilePhoto, PROFILE_PHOTO_UPDATED_EVENT } from "../lib/profile-photo";
import {
  getFudeProfile,
  getFudeXp,
  getLevelInfo,
  PROFILE_UPDATED_EVENT,
  XP_UPDATED_EVENT,
  type FudeProfile,
} from "../lib/gamification";

const tabs = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/belajar", label: "Belajar", icon: BookOpen },
  { href: "/kosakata", label: "Kosakata", icon: Languages },
  { href: "/flashcard", label: "Kartu Hafalan", icon: Layers },
  { href: "/konjugasi", label: "Konjugasi", icon: BookA },
];

type XpFeedback = {
  id: number;
  amount: number;
  level: number;
  leveledUp: boolean;
};

export default function Sidebar() {
  const path = usePathname();
  const [profile, setProfile] = useState<FudeProfile>({
    name: "Pelajar Fude",
    avatar: "筆",
  });
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [levelInfo, setLevelInfo] = useState(() => getLevelInfo(0));
  const [xpFeedback, setXpFeedback] = useState<XpFeedback | null>(null);

  const previousXpRef = useRef<number | null>(null);
  const xpFeedbackIdRef = useRef(0);
  const xpFeedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    let currentPhotoUrl: string | null = null;

    const refreshPhoto = async () => {
      try {
        const blob = await getProfilePhoto();
        if (!active) return;

        if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
        currentPhotoUrl = blob ? URL.createObjectURL(blob) : null;
        setPhotoSrc(currentPhotoUrl);
      } catch (error) {
        console.error("Gagal memuat foto profil:", error);
      }
    };

    const refreshProfile = () => {
      setProfile(getFudeProfile());
      void refreshPhoto();
    };

    const refreshXp = (showFeedback = false) => {
      const currentXp = getFudeXp();
      const previousXp = previousXpRef.current;
      const nextLevelInfo = getLevelInfo(currentXp);

      previousXpRef.current = currentXp;
      setLevelInfo(nextLevelInfo);

      if (!showFeedback || previousXp === null || currentXp <= previousXp) {
        return;
      }

      const gainedXp = currentXp - previousXp;
      const previousLevel = getLevelInfo(previousXp).level;
      const leveledUp = nextLevelInfo.level > previousLevel;
      const nextFeedbackId = xpFeedbackIdRef.current + 1;
      xpFeedbackIdRef.current = nextFeedbackId;

      setXpFeedback((previous) => ({
        id: nextFeedbackId,
        amount: (previous?.amount ?? 0) + gainedXp,
        level: nextLevelInfo.level,
        leveledUp: Boolean(previous?.leveledUp || leveledUp),
      }));

      if (xpFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(xpFeedbackTimeoutRef.current);
      }

      xpFeedbackTimeoutRef.current = window.setTimeout(() => {
        setXpFeedback(null);
        xpFeedbackTimeoutRef.current = null;
      }, 2200);
    };

    const handleXpUpdate = () => refreshXp(true);

    const refreshAll = () => {
      refreshProfile();
      refreshXp();
    };

    window.addEventListener(PROFILE_PHOTO_UPDATED_EVENT, refreshPhoto);
    window.addEventListener(PROFILE_UPDATED_EVENT, refreshProfile);
    window.addEventListener(XP_UPDATED_EVENT, handleXpUpdate);
    window.addEventListener("storage", refreshAll);

    refreshAll();

    return () => {
      active = false;
      if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
      if (xpFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(xpFeedbackTimeoutRef.current);
      }
      window.removeEventListener(PROFILE_PHOTO_UPDATED_EVENT, refreshPhoto);
      window.removeEventListener(PROFILE_UPDATED_EVENT, refreshProfile);
      window.removeEventListener(XP_UPDATED_EVENT, handleXpUpdate);
      window.removeEventListener("storage", refreshAll);
    };
  }, []);

  const expBar = (
    <div className="mt-3">
      <div className="flex justify-between items-center text-[10px] font-bold mb-1.5">
        <span className="text-[#A3A099]">PENGALAMAN</span>
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
          className="h-full bg-gradient-to-r from-[#C93438] to-[#B8860B] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${levelInfo.progressPercent}%` }}
        />
      </div>
      <p className="text-[10px] text-[#817A73] mt-1.5 text-right">
        {levelInfo.remainingExp} EXP menuju level berikutnya
      </p>
    </div>
  );

  return (
    <>
      {path !== "/profil" && (
        <Link
          href="/profil"
          aria-label={`Profil ${profile.name}, level ${levelInfo.level}`}
          className="md:hidden fixed top-3 left-3 z-[60] inline-flex max-w-[210px] items-center gap-2 rounded-xl border border-[#B8860B]/40 bg-[#1A1918]/95 px-2 py-1.5 shadow-lg shadow-black/35 backdrop-blur-md transition-colors hover:bg-[#262523]"
        >
          <ProfilePicture
            photoSrc={photoSrc}
            photoPositionX={profile.photoPositionX}
            photoPositionY={profile.photoPositionY}
            photoZoom={profile.photoZoom}
            size={46}
          />
          <div className="min-w-0 flex-1">
            <p className="max-w-[128px] truncate text-[12px] font-bold leading-tight text-[#EAE6DD]">
              {profile.name}
            </p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="text-[9px] font-bold tracking-wide text-[#D6AD4F]">
                LV. {levelInfo.level}
              </span>
              <span className="text-[9px] tabular-nums text-[#A3A099]">
                {levelInfo.currentExp}/{levelInfo.requiredExp} EXP
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#0D0C0B]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C93438] to-[#D6AD4F] transition-all duration-700 ease-out"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </Link>
      )}

      {xpFeedback && (
        <div
          key={xpFeedback.id}
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-1/2 z-[120] -translate-x-1/2 md:bottom-6 md:left-auto md:right-6 md:translate-x-0"
        >
          <div className="fude-xp-feedback flex min-w-[205px] items-center gap-3 rounded-2xl border border-[#B8860B]/45 bg-[#1E1D1B]/95 px-4 py-3 shadow-[0_14px_45px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#B8860B]/30 bg-[#B8860B]/10 text-[#E2BC62]">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold tracking-[0.16em] text-[#B8860B]">
                EXP DIDAPATKAN
              </p>
              <p className="text-[18px] font-black leading-tight tabular-nums text-[#EAE6DD]">
                +{xpFeedback.amount} EXP
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-[#A3A099]">
                {xpFeedback.leveledUp
                  ? `LEVEL UP · SEKARANG LV. ${xpFeedback.level}`
                  : "Progres belajarmu bertambah"}
              </p>
            </div>
          </div>
        </div>
      )}

      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:border-r md:border-[#33312E]/50 md:bg-[#1A1918]/80 md:backdrop-blur-xl z-40">
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

        <nav className="flex-1 p-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = path === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                  isActive
                    ? "bg-[#C93438] text-white shadow-lg shadow-[#C93438]/20"
                    : "hover:bg-[#262523] text-[#A3A099] hover:text-[#EAE6DD]"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="flex-1 text-sm font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#33312E]/50">
          <Link
            href="/profil"
            className="block bg-[#262523] hover:bg-[#33312E] transition-all rounded-xl p-3 group"
          >
            <div className="flex items-center gap-3">
              <ProfilePicture
                photoSrc={photoSrc}
                photoPositionX={profile.photoPositionX}
                photoPositionY={profile.photoPositionY}
                photoZoom={profile.photoZoom}
                size={46}
              />
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-sm font-bold text-[#EAE6DD] truncate group-hover:text-white">
                  {profile.name}
                </p>
                <p className="text-[11px] text-[#B8860B] font-semibold mt-0.5">
                  {levelInfo.rank} · LVL {levelInfo.level}
                </p>
              </div>
            </div>
            {expBar}
          </Link>
        </div>
      </aside>
    </>
  );
}
