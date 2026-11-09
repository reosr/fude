"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Camera,
  Pencil,
  BookOpen,
  Trophy,
  Award,
  Target,
  CheckCircle2,
  Lock,
  Save,
  X,
  ShieldCheck,
  Sparkles,
  ImagePlus,
  Trash2,
  Check,
  Coins,
} from "lucide-react";

import { getProgress } from "../../lib/progress";
import LevelBadge from "../../components/LevelBadge";
import ProfileAvatar from "../../components/ProfileAvatar";

import {
  DEFAULT_PROFILE,
  getFudeProfile,
  getFudeXp,
  getFudeTokens,
  getLevelInfo,
  saveFudeProfile,
  PROFILE_UPDATED_EVENT,
  XP_UPDATED_EVENT,
  TOKEN_UPDATED_EVENT,
  type FudeProfile,
} from "../../lib/gamification";

import {
  ALL_BADGES,
  PROFILE_FRAMES,
  getUnlockedBadges,
  getUnlockedFrames,
  getCompletedBabCount,
  getCompletedJlptSetIds,
  getPendingCollectionIds,
  markCollectionSeen,
  COLLECTION_UPDATED_EVENT,
  type ProfileBadge,
  type ProfileFrame,
} from "../../lib/profile-collections";

import {
  saveProfilePhoto,
  getProfilePhoto,
  deleteProfilePhoto,
} from "../../lib/profile-photo";

const AVATARS = ["筆", "🎌", "🌸", "🗻", "🦊", "🐈"];
const PROFILE_DESCRIPTION = "Pelajar bahasa Jepang di Fude";

// MODE PENGEMBANGAN:
// Semua badge dan frame bisa dilihat tanpa syarat unlock.
// Ubah menjadi false setelah seluruh desain koleksi selesai.
const COLLECTION_PREVIEW_MODE = true;

type CollectionTab = "badges" | "frames";

type SelectedItem =
  | { type: "badge"; id: string }
  | { type: "frame"; id: string };

const TIER_LABELS: Record<string, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  mythic: "Mythic",
  legendary: "Legendary",
};

const TIER_STYLES: Record<string, string> = {
  common: "border-[#A8A29E]/50 text-[#D6D3D1] bg-[#78716C]/10",
  uncommon: "border-green-400/50 text-green-300 bg-green-500/10",
  rare: "border-blue-400/50 text-blue-300 bg-blue-500/10",
  epic: "border-purple-400/50 text-purple-300 bg-purple-500/10",
  mythic: "border-[#F0C75E]/50 text-[#F0C75E] bg-[#B8860B]/10",
  legendary: "border-red-400/50 text-red-300 bg-red-500/10",
};

export default function Profil() {
  const [profile, setProfile] = useState<FudeProfile>(DEFAULT_PROFILE);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  const [currentBab, setCurrentBab] = useState(1);
  const [completedBab, setCompletedBab] = useState(0);
  const [completedJLPT, setCompletedJLPT] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [tokens, setTokens] = useState(0);

  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>([]);
  const [unlockedFrameIds, setUnlockedFrameIds] = useState<string[]>([]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<CollectionTab>("badges");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(DEFAULT_PROFILE.name);
  const [draftAvatar, setDraftAvatar] = useState(DEFAULT_PROFILE.avatar);

  const [saveError, setSaveError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshData = () => {
    const progress = Number(getProgress());

    setCurrentBab(
      Number.isFinite(progress)
        ? Math.min(51, Math.max(1, progress))
        : 1
    );

    setCompletedBab(getCompletedBabCount());
    setCompletedJLPT(getCompletedJlptSetIds().length);
    setTotalXp(getFudeXp());
    setTokens(getFudeTokens());

    setProfile(getFudeProfile());

    // Status kepemilikan asli tetap disimpan.
    // Preview hanya membuka tampilan desain, bukan mengubah reward permanen.
    setUnlockedBadgeIds(
      getUnlockedBadges().map((badge) => badge.id)
    );

    setUnlockedFrameIds(
      getUnlockedFrames().map((frame) => frame.id)
    );

    setPendingIds(getPendingCollectionIds());
  };

  const refreshPhoto = async () => {
    try {
      const blob = await getProfilePhoto();

      setPhotoSrc((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return blob ? URL.createObjectURL(blob) : null;
      });
    } catch (error) {
      console.error("Gagal membaca foto profil:", error);
    }
  };

  useEffect(() => {
    let active = true;

    const loadPhoto = async () => {
      try {
        const blob = await getProfilePhoto();

        if (!active) return;

        setPhotoSrc((previous) => {
          if (previous) URL.revokeObjectURL(previous);
          return blob ? URL.createObjectURL(blob) : null;
        });
      } catch (error) {
        console.error("Gagal memuat foto profil:", error);
      }
    };

    const refresh = () => {
      refreshData();
      void loadPhoto();
    };

    refreshData();
    void loadPhoto();

    window.addEventListener(PROFILE_UPDATED_EVENT, refresh);
    window.addEventListener(XP_UPDATED_EVENT, refresh);
    window.addEventListener(TOKEN_UPDATED_EVENT, refresh);
    window.addEventListener(COLLECTION_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    setIsLoaded(true);

    return () => {
      active = false;
      window.removeEventListener(PROFILE_UPDATED_EVENT, refresh);
      window.removeEventListener(XP_UPDATED_EVENT, refresh);
      window.removeEventListener(TOKEN_UPDATED_EVENT, refresh);
      window.removeEventListener(COLLECTION_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (photoSrc) URL.revokeObjectURL(photoSrc);
    };
  }, [photoSrc]);

  const levelInfo = getLevelInfo(totalXp);
  const safeBab = Math.min(51, Math.max(1, currentBab));
  const unlockedBab = Math.min(50, safeBab);
  const progressPercent = Math.round((completedBab / 50) * 100);

  const equippedBadge = ALL_BADGES.find(
    (badge) => badge.id === profile.equippedBadgeId
  );

  const equippedFrame =
    PROFILE_FRAMES.find(
      (frame) => frame.id === profile.equippedFrameId
    ) ?? PROFILE_FRAMES[0];

  const unlockedBadgeCount = unlockedBadgeIds.length;
  const unlockedFrameCount = unlockedFrameIds.length;

  const newBadgeCount = pendingIds.filter(
    (id) => id.startsWith("badge:")
  ).length;

  const newFrameCount = pendingIds.filter(
    (id) => id.startsWith("frame:")
  ).length;

  const selectedBadge =
    selectedItem?.type === "badge"
      ? ALL_BADGES.find((badge) => badge.id === selectedItem.id)
      : undefined;

  const selectedFrame =
    selectedItem?.type === "frame"
      ? PROFILE_FRAMES.find((frame) => frame.id === selectedItem.id)
      : undefined;

  const selectedIsUnlocked = selectedItem
    ? selectedItem.type === "badge"
      ? unlockedBadgeIds.includes(selectedItem.id)
      : unlockedFrameIds.includes(selectedItem.id)
    : false;

  const openEditor = () => {
    setDraftName(profile.name);
    setDraftAvatar(profile.avatar);
    setSaveError("");
    setIsEditing(true);
  };

  const saveProfile = () => {
    const cleanName = draftName.trim().slice(0, 24);

    if (!cleanName) {
      setSaveError("Nama tidak boleh kosong.");
      return;
    }

    try {
      saveFudeProfile({
        name: cleanName,
        avatar: draftAvatar,
      });

      setIsEditing(false);
      setSaveError("");
    } catch {
      setSaveError("Gagal menyimpan profil.");
    }
  };

  const handlePhotoUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoError("");
    setPhotoLoading(true);

    try {
      await saveProfilePhoto(file);
      await refreshPhoto();

      // Memicu sinkronisasi avatar di Sidebar.
      saveFudeProfile({});
    } catch (error) {
      setPhotoError(
        error instanceof Error
          ? error.message
          : "Gagal mengunggah foto."
      );
    } finally {
      setPhotoLoading(false);
      event.target.value = "";
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await deleteProfilePhoto();
      await refreshPhoto();
      saveFudeProfile({});
      setPhotoError("");
    } catch {
      setPhotoError("Gagal menghapus foto.");
    }
  };

  const openBadge = (badge: ProfileBadge) => {
    const id = `badge:${badge.id}`;

    if (pendingIds.includes(id)) {
      markCollectionSeen(id);
    }

    setSelectedItem({ type: "badge", id: badge.id });
  };

  const openFrame = (frame: ProfileFrame) => {
    const id = `frame:${frame.id}`;

    if (pendingIds.includes(id)) {
      markCollectionSeen(id);
    }

    setSelectedItem({ type: "frame", id: frame.id });
  };

  const equipSelectedItem = () => {
    if (!selectedItem || !selectedIsUnlocked) return;

    if (selectedItem.type === "badge") {
      saveFudeProfile({
        equippedBadgeId: selectedItem.id,
      });
    } else {
      saveFudeProfile({
        equippedFrameId: selectedItem.id,
      });
    }

    setSelectedItem(null);
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      {/* PROFILE HEADER */}
      <section className="relative bg-[#1E1D1B] border border-[#33312E] rounded-3xl p-6 md:p-8 overflow-visible">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C93438]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6">

          {/* AVATAR */}
          <div className="flex flex-col items-center shrink-0">
            <div className="pb-5">
              <ProfileAvatar
                avatar={profile.avatar}
                photoSrc={photoSrc}
                badgeId={profile.equippedBadgeId}
                frameId={profile.equippedFrameId}
                size={116}
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={photoLoading}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#262523] border border-[#44413D] text-xs font-bold text-[#EAE6DD] hover:border-[#B8860B] transition-colors disabled:opacity-50"
            >
              <Camera size={15} />
              {photoLoading ? "Mengunggah..." : "Ganti Foto"}
            </button>

            {photoSrc && (
              <button
                onClick={handleDeletePhoto}
                className="mt-2 flex items-center gap-1 text-[11px] text-[#A3A099] hover:text-red-400"
              >
                <Trash2 size={12} />
                Hapus Foto
              </button>
            )}

            {photoError && (
              <p className="text-xs text-red-400 mt-2 text-center max-w-[150px]">
                {photoError}
              </p>
            )}
          </div>

          {/* IDENTITAS */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B8860B] mb-1">
              Profil Pelajar
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-[#EAE6DD] break-words">
              {profile.name}
            </h2>

            <p className="text-sm text-[#A3A099] mt-1">
              {PROFILE_DESCRIPTION}
            </p>

            <div className="mt-3 flex justify-center sm:justify-start">
              <LevelBadge currentBab={safeBab} />
            </div>

            {equippedBadge && (
              <p className="text-xs text-[#B8860B] mt-2">
                <Sparkles size={12} className="inline mr-1" />
                {equippedBadge.name}
              </p>
            )}

            <div className="mt-5 max-w-sm mx-auto sm:mx-0">
              <div className="flex justify-between text-[11px] font-bold mb-2">
                <span className="text-[#A3A099]">EXPERIENCE</span>
                <span className="text-[#EAE6DD] tabular-nums">
                  {levelInfo.currentExp} / {levelInfo.requiredExp} EXP
                </span>
              </div>

              <div className="h-2.5 bg-[#33312E] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C93438] to-[#B8860B] rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>

              <p className="text-[10px] text-[#817A73] mt-1.5 text-right">
                {levelInfo.remainingExp} EXP menuju level berikutnya
              </p>
            </div>
          </div>

          <button
            onClick={openEditor}
            className="sm:self-start flex items-center gap-2 px-4 py-2 rounded-xl bg-[#262523] border border-[#44413D] text-sm font-bold text-[#EAE6DD] hover:border-[#C93438] transition-colors"
          >
            <Pencil size={15} />
            Edit Profil
          </button>
        </div>
      </section>

      {/* STATISTIK */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Target size={19} className="text-[#C93438]" />
          <h3 className="text-lg font-bold text-[#EAE6DD]">
            Statistik Belajar
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-5">
            <BookOpen size={21} className="text-[#C93438] mb-3" />
            <p className="text-3xl font-black text-[#EAE6DD]">
              {completedBab}
            </p>
            <p className="text-xs text-[#A3A099] mt-1">Bab diselesaikan</p>
          </div>

          <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-5">
            <Trophy size={21} className="text-[#B8860B] mb-3" />
            <p className="text-3xl font-black text-[#EAE6DD]">
              {completedJLPT}
            </p>
            <p className="text-xs text-[#A3A099] mt-1">Set JLPT selesai</p>
          </div>

          <div className="bg-[#1E1D1B] border border-[#B8860B]/30 rounded-2xl p-5">
            <Coins size={21} className="text-[#D6AD4F] mb-3" />
            <p className="text-3xl font-black text-[#E7C46A] tabular-nums">
              {tokens.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-[#A3A099] mt-1">
              Token tersedia
            </p>
          </div>

          <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-5 col-span-2 md:col-span-1">
            <Award size={21} className="text-[#B8860B] mb-3" />
            <p className="text-3xl font-black text-[#EAE6DD]">
              LVL {levelInfo.level}
            </p>
            <p className="text-xs text-[#A3A099] mt-1">
              {levelInfo.rank}
            </p>
          </div>
        </div>
      </section>

      {/* PROGRESS BAB */}
      <section className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-bold text-[#EAE6DD]">
              Perjalanan Belajar
            </h3>
            <p className="text-xs text-[#A3A099] mt-1">
              Penyelesaian 50 bab Fude
            </p>
          </div>

          <span className="text-xl font-black text-[#C93438]">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full h-3 bg-[#33312E] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C93438] to-[#B8860B] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-[#A3A099] mt-3">
          <span>{completedBab} bab selesai</span>
          <span>{unlockedBab} / 50 bab terbuka</span>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl overflow-hidden">
        <div className="p-5 md:p-6 border-b border-[#33312E]">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-[#B8860B]" />
            <h3 className="text-lg font-bold text-[#EAE6DD]">
              Koleksi
            </h3>
          </div>

          <p className="text-xs text-[#A3A099] mt-1">
            Kumpulkan badge dan frame selama perjalanan belajarmu.
          </p>

          {COLLECTION_PREVIEW_MODE && (
            <div className="mt-4 p-3 rounded-xl border border-[#B8860B]/30 bg-[#B8860B]/5">
              <p className="text-xs text-[#E7C46A] font-bold">
                <Sparkles size={13} className="inline mr-1" />
                DEVELOPMENT PREVIEW MODE
              </p>
              <p className="text-xs text-[#A3A099] mt-1">
                Semua desain badge dan frame bisa dilihat. Syarat unlock
                permanen tetap berlaku dan tidak diubah.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-[#262523] rounded-xl p-3">
              <p className="text-2xl font-black text-[#EAE6DD]">
                {unlockedBadgeCount}/{ALL_BADGES.length}
              </p>
              <p className="text-xs text-[#A3A099]">Badge terbuka</p>
              {newBadgeCount > 0 && (
                <span className="text-[10px] font-black text-[#F0C75E] mt-1 inline-block">
                  {newBadgeCount} NEW
                </span>
              )}
            </div>

            <div className="bg-[#262523] rounded-xl p-3">
              <p className="text-2xl font-black text-[#EAE6DD]">
                {unlockedFrameCount}/{PROFILE_FRAMES.length}
              </p>
              <p className="text-xs text-[#A3A099]">Frame terbuka</p>
              {newFrameCount > 0 && (
                <span className="text-[10px] font-black text-[#F0C75E] mt-1 inline-block">
                  {newFrameCount} NEW
                </span>
              )}
            </div>
          </div>
        </div>

        {/* TAB */}
        <div className="flex border-b border-[#33312E]">
          <button
            onClick={() => setActiveTab("badges")}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              activeTab === "badges"
                ? "text-[#F0C75E] border-b-2 border-[#B8860B] bg-[#B8860B]/5"
                : "text-[#A3A099] hover:bg-[#262523]"
            }`}
          >
            Badge ({unlockedBadgeCount}/{ALL_BADGES.length})
            {newBadgeCount > 0 && (
              <span className="ml-2 text-[9px] bg-[#C93438] text-white px-1.5 py-0.5 rounded">
                NEW
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("frames")}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              activeTab === "frames"
                ? "text-[#F0C75E] border-b-2 border-[#B8860B] bg-[#B8860B]/5"
                : "text-[#A3A099] hover:bg-[#262523]"
            }`}
          >
            Frame ({unlockedFrameCount}/{PROFILE_FRAMES.length})
            {newFrameCount > 0 && (
              <span className="ml-2 text-[9px] bg-[#C93438] text-white px-1.5 py-0.5 rounded">
                NEW
              </span>
            )}
          </button>
        </div>

        {/* BADGE GRID */}
        {activeTab === "badges" && (
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {ALL_BADGES.map((badge) => {
                const actuallyUnlocked = unlockedBadgeIds.includes(badge.id);
                const unlocked =
                  COLLECTION_PREVIEW_MODE || actuallyUnlocked;
                const isNew = pendingIds.includes(`badge:${badge.id}`);
                const equipped = profile.equippedBadgeId === badge.id;

                return (
                  <button
                    key={badge.id}
                    onClick={() => openBadge(badge)}
                    className={`relative min-h-[145px] rounded-xl border p-3 text-center flex flex-col items-center justify-center transition-all ${
                      unlocked
                        ? "bg-[#262523] border-[#B8860B]/40 hover:border-[#F0C75E] hover:bg-[#302B20]"
                        : "bg-[#181716] border-[#33312E] opacity-55 hover:opacity-80"
                    }`}
                  >
                    {isNew && (
                      <span className="absolute top-2 right-2 text-[9px] font-black tracking-wide bg-[#C93438] text-white px-1.5 py-1 rounded">
                        NEW
                      </span>
                    )}

                    {equipped && (
                      <span className="absolute top-2 left-2 text-[#F0C75E]">
                        <Check size={13} />
                      </span>
                    )}

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 border ${
                        unlocked
                          ? TIER_STYLES[badge.tier]
                          : "bg-[#33312E] border-[#44413D] grayscale"
                      }`}
                    >
                      {unlocked ? badge.icon : <Lock size={19} />}
                    </div>

                    <p className="text-xs font-bold text-[#EAE6DD] leading-tight">
                      {badge.name}
                    </p>

                    <span className="text-[9px] text-[#A3A099] mt-1">
                      {TIER_LABELS[badge.tier]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* FRAME GRID */}
        {activeTab === "frames" && (
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {PROFILE_FRAMES.map((frame) => {
                const actuallyUnlocked = unlockedFrameIds.includes(frame.id);
                const unlocked =
                  COLLECTION_PREVIEW_MODE || actuallyUnlocked;
                const isNew = pendingIds.includes(`frame:${frame.id}`);
                const equipped = profile.equippedFrameId === frame.id;

                return (
                  <button
                    key={frame.id}
                    onClick={() => openFrame(frame)}
                    className={`relative min-h-[160px] rounded-xl border p-3 flex flex-col items-center justify-center transition-all ${
                      unlocked
                        ? "bg-[#262523] border-[#B8860B]/40 hover:border-[#F0C75E]"
                        : "bg-[#181716] border-[#33312E] opacity-55 hover:opacity-80"
                    }`}
                  >
                    {isNew && (
                      <span className="absolute top-2 right-2 text-[9px] font-black bg-[#C93438] text-white px-1.5 py-1 rounded">
                        NEW
                      </span>
                    )}

                    {equipped && (
                      <span className="absolute top-2 left-2 text-[#F0C75E]">
                        <Check size={13} />
                      </span>
                    )}

                    <div className="relative flex items-center justify-center pt-2 mb-2">
                      <div className={unlocked ? "" : "grayscale opacity-50"}>
                        <ProfileAvatar
                          avatar="筆"
                          frameId={frame.id}
                          size={88}
                        />
                      </div>

                      {!unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="p-2 rounded-full bg-black/75 text-[#EAE6DD]">
                            <Lock size={18} />
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs font-bold text-[#EAE6DD]">
                      {frame.name}
                    </p>

                    <span className="text-[10px] text-[#A3A099] mt-1">
                      {COLLECTION_PREVIEW_MODE
                        ? "Preview Desain"
                        : frame.unlockLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ACHIEVEMENT RINGKAS */}
      <section className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={20} className="text-[#B8860B]" />
          <h3 className="font-bold text-[#EAE6DD]">Data Profil</h3>
        </div>

        <p className="text-sm text-[#A3A099] leading-relaxed">
          Nama, avatar, frame, badge, dan progres tersimpan di browser pada
          perangkat ini. Foto profil disimpan di IndexedDB. Belum tersedia
          sinkronisasi akun antarperangkat.
        </p>
      </section>

      {/* MODAL DETAIL KOLEKSI */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm bg-[#1E1D1B] border border-[#44413D] rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                aria-label="Tutup"
                className="p-2 bg-[#262523] rounded-full text-[#A3A099] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {selectedBadge && (
              <div className="text-center">
                <div
                  className={`w-24 h-24 mx-auto rounded-full border-2 flex items-center justify-center text-5xl mb-4 ${
                    TIER_STYLES[selectedBadge.tier]
                  }`}
                >
                  {unlockedBadgeIds.includes(selectedBadge.id)
                    ? selectedBadge.icon
                    : <Lock size={34} />}
                </div>

                <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-black">
                  {TIER_LABELS[selectedBadge.tier]} BADGE
                </p>

                <h3 className="text-xl font-bold text-[#EAE6DD] mt-2">
                  {selectedBadge.name}
                </h3>

                <p className="text-sm text-[#A3A099] mt-2">
                  {selectedBadge.description}
                </p>

                <p className="text-xs text-[#817A73] mt-4">
                  {unlockedBadgeIds.includes(selectedBadge.id)
                    ? "Badge sudah menjadi milikmu."
                    : `Syarat: ${selectedBadge.unlockLabel}`}
                </p>

                {unlockedBadgeIds.includes(selectedBadge.id) && (
                  <button
                    onClick={equipSelectedItem}
                    disabled={profile.equippedBadgeId === selectedBadge.id}
                    className="w-full mt-6 py-3 rounded-xl bg-[#B8860B] text-[#171312] font-bold text-sm disabled:opacity-50"
                  >
                    {profile.equippedBadgeId === selectedBadge.id
                      ? "Sedang Dipakai"
                      : "Pakai Badge"}
                  </button>
                )}
              </div>
            )}

            {selectedFrame && (
              <div className="text-center">
                <div className="relative flex justify-center mb-4">
                    <div
                      className={
                        unlockedFrameIds.includes(selectedFrame.id)
                          ? ""
                          : "grayscale opacity-50"
                      }
                    >
                      <ProfileAvatar
                        avatar="筆"
                        frameId={selectedFrame.id}
                        size={116}
                      />
                    </div>

                    {!unlockedFrameIds.includes(selectedFrame.id) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="p-3 rounded-full bg-black/75 text-[#EAE6DD]">
                          <Lock size={24} />
                        </span>
                      </div>
                    )}
                  </div>

                <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-black">
                  {TIER_LABELS[selectedFrame.tier]} FRAME
                </p>

                <h3 className="text-xl font-bold text-[#EAE6DD] mt-2">
                  {selectedFrame.name}
                </h3>

                <p className="text-sm text-[#A3A099] mt-2">
                  {selectedFrame.description}
                </p>

                <p className="text-xs text-[#817A73] mt-4">
                  {unlockedFrameIds.includes(selectedFrame.id)
                    ? "Frame sudah terbuka."
                    : `Syarat: ${selectedFrame.unlockLabel}.`}
                </p>

                {unlockedFrameIds.includes(selectedFrame.id) && (
                  <button
                    onClick={equipSelectedItem}
                    disabled={profile.equippedFrameId === selectedFrame.id}
                    className="w-full mt-6 py-3 rounded-xl bg-[#B8860B] text-[#171312] font-bold text-sm disabled:opacity-50"
                  >
                    {profile.equippedFrameId === selectedFrame.id
                      ? "Sedang Dipakai"
                      : "Pakai Frame"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL EDIT NAMA DAN AVATAR */}
      {isEditing && (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsEditing(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md bg-[#1E1D1B] border border-[#44413D] rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                id="edit-profile-title"
                className="text-xl font-bold text-[#EAE6DD]"
              >
                Edit Profil
              </h3>

              <button
                onClick={() => setIsEditing(false)}
                aria-label="Tutup"
                className="p-2 rounded-full bg-[#262523] text-[#A3A099] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <label className="block text-sm font-bold text-[#A3A099] mb-2">
              Nama Pengguna
            </label>

            <input
              type="text"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              maxLength={24}
              placeholder="Masukkan nama"
              className="w-full bg-[#121110] border border-[#44413D] rounded-xl px-4 py-3 text-[#EAE6DD] outline-none focus:border-[#C93438]"
            />

            <div className="flex justify-between text-xs text-[#817A73] mt-2">
              <span>Maksimal 24 karakter</span>
              <span>{draftName.length}/24</span>
            </div>

            <p className="text-sm font-bold text-[#A3A099] mt-6 mb-3">
              Avatar Bawaan
            </p>

            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((item) => (
                <button
                  key={item}
                  onClick={() => setDraftAvatar(item)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-colors ${
                    draftAvatar === item
                      ? "bg-[#C93438]/20 border-2 border-[#C93438]"
                      : "bg-[#262523] border border-[#44413D] hover:border-[#817A73]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {saveError && (
              <p className="text-sm text-red-400 mt-4">{saveError}</p>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 rounded-xl bg-[#33312E] text-[#EAE6DD] font-bold text-sm hover:bg-[#44413D]"
              >
                Batal
              </button>

              <button
                onClick={saveProfile}
                className="flex-1 py-3 rounded-xl bg-[#C93438] text-white font-bold text-sm hover:bg-[#B02A2E] flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}