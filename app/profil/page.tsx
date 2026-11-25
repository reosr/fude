"use client";

import GoogleAuthButton from "@/components/GoogleAuthButton";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Camera,
  Pencil,
  BookOpen,
  Trophy,
  Target,
  Save,
  X,
  Trash2,
  Award,
  MessageCircle,
  BookText,
  Layers,
} from "lucide-react";
import ProfilePhotoEditor, {
  type ProfilePhotoSettings,
} from "@/components/ProfilePhotoEditor";
import { getProgress } from "../../lib/progress";
import { getMemorizedKanji } from "../../lib/memorized";
import { useIrodoriProgress } from "@/lib/irodori-progress";
import { getCompletedJlptSetIds, useStudyProgress } from "@/lib/study-progress";
import LevelBadge from "../../components/LevelBadge";
import ProfilePicture from "../../components/ProfilePicture";
import {
  DEFAULT_PROFILE,
  getFudeProfile,
  getFudeXp,
  getLevelInfo,
  saveFudeProfile,
  PROFILE_UPDATED_EVENT,
  XP_UPDATED_EVENT,
  type FudeProfile,
} from "../../lib/gamification";
import {
  saveProfilePhoto,
  getProfilePhoto,
  deleteProfilePhoto,
  PROFILE_PHOTO_UPDATED_EVENT,
} from "../../lib/profile-photo";

const PROFILE_DESCRIPTION = "Pelajar bahasa Jepang di Fude";

export default function Profil() {
  const irodoriProgress = useIrodoriProgress();
  const studyProgress = useStudyProgress();
  const [photoEditorFile, setPhotoEditorFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<FudeProfile>(DEFAULT_PROFILE);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [currentBab, setCurrentBab] = useState(1);
  const [completedBab, setCompletedBab] = useState(0);
  const [completedJLPT, setCompletedJLPT] = useState(0);
  const [memorizedWords, setMemorizedWords] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(DEFAULT_PROFILE.name);
  const [draftPhotoSettings, setDraftPhotoSettings] =
  useState<ProfilePhotoSettings>({
    photoPositionX: 50,
    photoPositionY: 50,
    photoZoom: 1,
  });
  const [saveError, setSaveError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPhotoPreviewOpen, setIsPhotoPreviewOpen] = useState(false);

  const refreshData = () => {
    const progress = Number(getProgress());
    const safeProgress = Number.isFinite(progress)
      ? Math.min(51, Math.max(1, progress))
      : 1;

    setCurrentBab(safeProgress);
    setCompletedBab(Math.min(50, Math.max(0, safeProgress - 1)));
    setCompletedJLPT(getCompletedJlptSetIds().length);
    setMemorizedWords(getMemorizedKanji().length);
    setTotalXp(getFudeXp());
    setProfile(getFudeProfile());
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
    let currentPhotoUrl: string | null = null;

    const loadPhoto = async () => {
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

    const refresh = () => {
      refreshData();
      void loadPhoto();
    };

    const initialRefresh = window.requestAnimationFrame(() => {
      refreshData();
      setIsLoaded(true);
    });
    void loadPhoto();

    window.addEventListener(PROFILE_PHOTO_UPDATED_EVENT, loadPhoto);
    window.addEventListener(PROFILE_UPDATED_EVENT, refreshData);
    window.addEventListener(XP_UPDATED_EVENT, refreshData);
    window.addEventListener("storage", refresh);

    return () => {
      active = false;
      window.cancelAnimationFrame(initialRefresh);
      if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
      window.removeEventListener(PROFILE_PHOTO_UPDATED_EVENT, loadPhoto);
      window.removeEventListener(PROFILE_UPDATED_EVENT, refreshData);
      window.removeEventListener(XP_UPDATED_EVENT, refreshData);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (photoSrc) URL.revokeObjectURL(photoSrc);
    };
  }, [photoSrc]);

  useEffect(() => {
    if (!isEditing) return;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isEditing]);

  const irodoriPrefixes = ["starter-", "elementary1-", "elementary2-", "preintermediate-"];
  const completedIrodori = new Set(
    irodoriProgress.completedLessons.filter((id) =>
      irodoriPrefixes.some((prefix) => {
        if (!id.startsWith(prefix)) return false;
        const lessonNumber = Number(id.slice(prefix.length));
        return Number.isInteger(lessonNumber) && lessonNumber >= 1 && lessonNumber <= 18;
      })
    )
  ).size;
  const completedPractical = new Set(studyProgress.completedPracticalCategories).size;
  const completedStories = new Set(studyProgress.completedStories).size;

  const levelInfo = getLevelInfo(totalXp);
  const unlockedBab = Math.min(50, currentBab);
  const progressPercent = Math.round((completedBab / 50) * 100);

  const openEditor = () => {
    setDraftName(profile.name);

    setDraftPhotoSettings({
      photoPositionX: profile.photoPositionX ?? 50,
      photoPositionY: profile.photoPositionY ?? 50,
      photoZoom: profile.photoZoom ?? 1,
    });

    setPhotoEditorFile(null);
    setSaveError("");
    setIsEditing(true);
  };

  const saveProfile = async () => {
    const cleanName = draftName.trim().slice(0, 24);

    if (!cleanName) {
      setSaveError("Nama tidak boleh kosong.");
      return;
    }

    setPhotoLoading(true);
    setSaveError("");

    try {
      // Simpan foto asli jika pengguna menggantinya.
      if (photoEditorFile) {
        await saveProfilePhoto(photoEditorFile);
        await refreshPhoto();
      }

      // Simpan nama dan pengaturan tampilan foto.
      saveFudeProfile({
        name: cleanName,
        ...draftPhotoSettings,
      });

      setPhotoEditorFile(null);
      setIsEditing(false);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan profil."
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  const handlePhotoEditorSave = async (
  file: File,
  settings: ProfilePhotoSettings
  ) => {
    setPhotoLoading(true);
    setPhotoError("");

    try {
      // Simpan file asli, tanpa crop.
      await saveProfilePhoto(file);

      // Simpan pengaturan tampilan avatar.
      saveFudeProfile(settings);

      await refreshPhoto();
      setPhotoEditorFile(null);
    } catch (error) {
      setPhotoError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan foto."
      );

      throw error;
    } finally {
      setPhotoLoading(false);
    }
  };

  const handlePhotoUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoError("");

    if (!file.type.startsWith("image/")) {
      setPhotoError("File harus berupa gambar.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Ukuran foto maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    setPhotoEditorFile(file);
    event.target.value = "";
  };

  const handleCropSave = async (blob: Blob) => {
  setPhotoError("");
  setPhotoLoading(true);

    try {
      await saveProfilePhoto(blob);
      await refreshPhoto();
    } catch (error) {
      setPhotoError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan foto."
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await deleteProfilePhoto();
      await refreshPhoto();
      setPhotoError("");
    } catch {
      setPhotoError("Gagal menghapus foto.");
    }
  };

  
  if (!isLoaded) return null;

  return (
    <div className="relative max-w-5xl mx-auto space-y-6 pb-14">

      {/* HEADER */}
      <header className="flex items-center justify-between px-1">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-[#B8860B]">
            FUDE • ARSIP KARAKTER
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-[#EAE6DD] mt-1">
            旅人の記録
          </h1>
          <p className="text-xs text-[#817A73] mt-1 tracking-wider">
            CATATAN PERJALANAN PEMAIN
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 border border-[#B8860B]/30 bg-[#1B1918] rounded-full px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-[#C93438]" />
          <span className="text-[10px] font-bold tracking-widest text-[#C9B98D]">
            STATUS PEMAIN
          </span>
        </div>
      </header>

      {/* CHARACTER HERO */}
      <section
        className="relative isolate overflow-hidden rounded-[28px] border border-[#79602F]/50 bg-[#111315] shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(201,52,56,0.20), transparent 32%), radial-gradient(circle at 10% 100%, rgba(184,134,11,0.10), transparent 40%), linear-gradient(135deg, #211C1C, #111315 65%)",
        }}
      >
        {/* Japanese ornaments */}
        <div className="absolute right-5 top-0 text-[180px] font-serif leading-none text-[#EAE6DD]/[0.035] pointer-events-none select-none">
          武
        </div>

        <div className="absolute -right-12 -bottom-24 w-72 h-72 rounded-full border border-[#B8860B]/15 pointer-events-none" />
        <div className="absolute -right-2 -bottom-16 w-56 h-56 rounded-full border border-[#C93438]/15 pointer-events-none" />

        <svg
          className="absolute bottom-0 right-0 w-[55%] max-w-[420px] opacity-[0.13] pointer-events-none"
          viewBox="0 0 420 220"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="310" cy="70" r="48" fill="#C93438" />
          <path d="M0 210 L100 125 L160 180 L245 105 L420 210Z" fill="#A49B87" />
          <path d="M210 210 V78 M345 210 V78" stroke="#D9B66D" strokeWidth="15" />
          <path d="M175 78 H380 M195 55 H360" stroke="#C93438" strokeWidth="13" />
          <path d="M198 55 L180 78 M375 55 L395 78" stroke="#C93438" strokeWidth="9" />
        </svg>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[190px_1fr] gap-7 p-6 md:p-9">

          {/* AVATAR */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative p-1.5 rounded-full border border-[#B8860B]/60 bg-[#171513]/80 shadow-[0_0_35px_rgba(184,134,11,0.12)]">
              <div className="p-1 rounded-full border border-[#C93438]/50">
                <button
                  type="button"
                  onClick={() => {
                    if (photoSrc) setIsPhotoPreviewOpen(true);
                  }}
                  disabled={!photoSrc}
                  aria-label="Lihat foto profil ukuran penuh"
                  className="block rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B8860B]"
                >
                  <ProfilePicture
                    photoPositionX={profile.photoPositionX}
                    photoPositionY={profile.photoPositionY}
                    photoZoom={profile.photoZoom}
                    photoSrc={photoSrc}
                    size={132}
                    className="border border-[#B8860B]/50"
                  />
                </button>
              </div>

              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#B8860B]/50 bg-[#211B17] px-4 py-1 text-[9px] font-black tracking-[0.2em] text-[#D9B66D]">
                PLAYER
              </div>
            </div>

            {photoSrc && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Hapus foto profil?")) {
                    void handleDeletePhoto();
                  }
                }}
                className="mt-5 flex items-center gap-1 text-[10px] text-[#817A73] hover:text-red-400 transition-colors"
              >
                <Trash2 size={12} />
                HAPUS FOTO
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* PLAYER INFORMATION */}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#B8860B]">
                冒険者 • PETUALANG
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#B8860B]/40 to-transparent" />
            </div>

            <p className="text-[10px] font-bold tracking-widest text-[#817A73]">
              NAMA PEMAIN
            </p>

            <h2 className="mt-1 text-3xl md:text-4xl font-black text-[#F1EBDD] break-words">
              {profile.name}
            </h2>

            <p className="text-xs text-[#A3A099] mt-2">
              {PROFILE_DESCRIPTION}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <LevelBadge currentBab={currentBab} />

              <span className="inline-flex items-center gap-2 rounded-full border border-[#B8860B]/30 bg-[#B8860B]/10 px-3 py-1.5 text-[10px] font-bold text-[#D9B66D]">
                <Award size={13} />
                {levelInfo.rank}
              </span>
            </div>

            {/* EXP */}
            <div className="mt-7 rounded-2xl border border-white/[0.07] bg-black/25 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] text-[#B8860B]">
                    経験値 • PENGALAMAN
                  </p>
                  <p className="text-xs text-[#817A73] mt-1">
                    Progres level
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-[#EAE6DD] tabular-nums">
                    {totalXp.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[9px] text-[#817A73]">TOTAL EXP</p>
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-bold mb-2">
                <span className="text-[#A3A099]">
                  {levelInfo.currentExp} / {levelInfo.requiredExp} EXP
                </span>
                <span className="text-[#D9B66D]">
                  {Math.round(levelInfo.progressPercent)}%
                </span>
              </div>

              <div
                className="h-3 rounded-full bg-[#302D29] border border-white/[0.04] overflow-hidden"
                role="progressbar"
                aria-label="Experience menuju level berikutnya"
                aria-valuenow={levelInfo.currentExp}
                aria-valuemin={0}
                aria-valuemax={levelInfo.requiredExp}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#92272C] via-[#C93438] to-[#D9B66D] shadow-[0_0_12px_rgba(201,52,56,0.35)] transition-all duration-700"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>

              <p className="text-[10px] text-[#A3A099] mt-2 text-right">
                {levelInfo.remainingExp} EXP menuju level berikutnya
              </p>
            </div>

            <button
              type="button"
              onClick={openEditor}
              className="mt-5 flex items-center justify-center gap-2 w-full sm:w-fit rounded-xl border border-[#B8860B]/40 bg-[#B8860B]/10 px-5 py-3 text-xs font-bold tracking-wider text-[#E7D2A1] hover:bg-[#B8860B]/20 hover:border-[#B8860B]/70 transition-all"
            >
              <Pencil size={14} />
              EDIT KARAKTER
            </button>

            {photoError && (
              <p className="text-xs text-red-400 mt-3">{photoError}</p>
            )}
          </div>
        </div>
      </section>

      {/* PLAYER ATTRIBUTES */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 rounded-full bg-[#C93438]" />
          <div>
            <p className="text-[9px] font-bold tracking-[0.25em] text-[#B8860B]">
              STATUS • 能力値
            </p>
            <h3 className="text-lg font-black text-[#EAE6DD]">
              Atribut Pemain
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

          <div className="relative overflow-hidden rounded-2xl border border-[#B8860B]/20 bg-gradient-to-br from-[#252019] to-[#171615] p-5">
            <div className="absolute -right-3 -top-3 text-6xl text-[#B8860B]/10 font-serif">
              学
            </div>
            <BookOpen size={21} className="text-[#D0A74F] mb-4" />
            <p className="text-3xl font-black text-[#F1EBDD]">
              {completedBab}
            </p>
            <p className="text-xs text-[#A3A099] mt-1">
              Bab diselesaikan
            </p>
            <p className="text-[9px] text-[#B8860B] mt-2 tracking-widest">
              BAB SELESAI
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#C93438]/20 bg-gradient-to-br from-[#271B1B] to-[#171615] p-5">
            <div className="absolute -right-3 -top-3 text-6xl text-[#C93438]/10 font-serif">
              試
            </div>
            <Trophy size={21} className="text-[#C93438] mb-4" />
            <p className="text-3xl font-black text-[#F1EBDD]">
              {completedJLPT}
            </p>
            <p className="text-xs text-[#A3A099] mt-1">
              Set JLPT selesai
            </p>
            <p className="text-[9px] text-[#C93438] mt-2 tracking-widest">
              UJIAN SELESAI
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#B8860B]/20 bg-gradient-to-br from-[#222127] to-[#171615] p-5">
            <div className="absolute -right-3 -top-3 text-6xl text-[#B8860B]/10 font-serif">
              道
            </div>
            <Award size={21} className="text-[#D0A74F] mb-4" />
            <p className="text-3xl font-black text-[#F1EBDD]">
              LEVEL {levelInfo.level}
            </p>
            <p className="text-xs text-[#A3A099] mt-1">
              {levelInfo.rank}
            </p>
            <p className="text-[9px] text-[#B8860B] mt-2 tracking-widest">
              PERINGKAT PEMAIN
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#B8860B]/20 bg-gradient-to-br from-[#242019] to-[#171615] p-5">
            <BookOpen size={21} className="mb-4 text-[#D0A74F]" />
            <p className="text-3xl font-black text-[#F1EBDD]">{completedIrodori}/72</p>
            <p className="mt-1 text-xs text-[#A3A099]">Pelajaran Irodori selesai</p>
            <p className="mt-2 text-[9px] tracking-widest text-[#B8860B]">JALUR KOMUNIKASI</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#B8860B]/20 bg-gradient-to-br from-[#242019] to-[#171615] p-5">
            <MessageCircle size={21} className="mb-4 text-[#D0A74F]" />
            <p className="text-3xl font-black text-[#F1EBDD]">{completedPractical}/10</p>
            <p className="mt-1 text-xs text-[#A3A099]">Kategori ungkapan selesai</p>
            <p className="mt-2 text-[9px] tracking-widest text-[#B8860B]">KOMUNIKASI PRAKTIS</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#86A9D0]/20 bg-gradient-to-br from-[#20232A] to-[#171615] p-5">
            <BookText size={21} className="mb-4 text-[#8FB8E8]" />
            <p className="text-3xl font-black text-[#F1EBDD]">{completedStories}/10</p>
            <p className="mt-1 text-xs text-[#A3A099]">Cerita selesai dibaca</p>
            <p className="mt-2 text-[9px] tracking-widest text-[#8FB8E8]">LATIHAN BACA</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#269B70]/20 bg-gradient-to-br from-[#1D2923] to-[#171615] p-5">
            <Layers size={21} className="mb-4 text-[#8ED8B4]" />
            <p className="text-3xl font-black text-[#F1EBDD]">{memorizedWords}</p>
            <p className="mt-1 text-xs text-[#A3A099]">Kata di daftar hafalan</p>
            <p className="mt-2 text-[9px] tracking-widest text-[#8ED8B4]">FLASHCARD</p>
          </div>
        </div>
      </section>

      {/* LEARNING QUEST */}
      <section className="relative overflow-hidden rounded-3xl border border-[#68522C]/40 bg-[#181716] p-6 md:p-7">
        <div className="absolute right-0 top-0 text-[150px] leading-none font-serif text-[#B8860B]/[0.035] pointer-events-none">
          道
        </div>

        <div className="relative">
          <div className="flex justify-between items-start gap-3 mb-6">
            <div>
              <p className="text-[9px] font-black tracking-[0.25em] text-[#B8860B]">
                MISI UTAMA • 学習の旅
              </p>
              <h3 className="text-xl font-black text-[#EAE6DD] mt-1">
                Perjalanan Belajar
              </h3>
              <p className="text-xs text-[#817A73] mt-1">
                Minna no Nihongo • Bab 1–50
              </p>
            </div>

            <div className="rounded-xl border border-[#C93438]/30 bg-[#C93438]/10 px-3 py-2 text-right shrink-0">
              <p className="text-xl font-black text-[#EAE6DD]">
                {progressPercent}%
              </p>
              <p className="text-[8px] font-bold tracking-widest text-[#C93438]">
                TUNTAS
              </p>
            </div>
          </div>

          <div className="h-3 rounded-full overflow-hidden bg-[#302D29] border border-white/[0.04]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#92272C] via-[#C93438] to-[#D9B66D] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-[#A3A099] mt-3">
            <span>{completedBab} Bab selesai</span>
            <span>{unlockedBab} / 50 Bab terbuka</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="rounded-xl bg-black/20 border border-white/[0.05] p-3 text-center">
              <p className="text-lg font-black text-[#D9B66D]">
                {completedBab}
              </p>
              <p className="text-[9px] text-[#817A73]">TUNTAS</p>
            </div>
            <div className="rounded-xl bg-black/20 border border-white/[0.05] p-3 text-center">
              <p className="text-lg font-black text-[#EAE6DD]">
                {unlockedBab}
              </p>
              <p className="text-[9px] text-[#817A73]">TERBUKA</p>
            </div>
            <div className="rounded-xl bg-black/20 border border-white/[0.05] p-3 text-center">
              <p className="text-lg font-black text-[#EAE6DD]">
                {50 - completedBab}
              </p>
              <p className="text-[9px] text-[#817A73]">TERSISA</p>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-[#B8860B]/25 bg-gradient-to-r from-[#211C18] to-[#171719] p-5 md:p-6">
        <div className="absolute right-5 top-1 text-8xl font-serif text-[#B8860B]/[0.07] pointer-events-none">
          宝
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[9px] font-black tracking-[0.25em] text-[#B8860B]">
              KOLEKSI • 宝物
            </p>
            <h3 className="text-lg font-black text-[#EAE6DD] mt-1">
              Perlengkapan & Koleksi
            </h3>
            <p className="text-xs text-[#A3A099] mt-1">
              Lencana, bingkai, dan berbagai koleksi karakter.
            </p>
          </div>

          <a
            href="/gacha"
            className="inline-flex items-center justify-center rounded-xl border border-[#B8860B]/40 bg-[#B8860B]/10 px-5 py-3 text-xs font-bold tracking-wider text-[#E7D2A1] hover:bg-[#B8860B]/20 transition-colors"
          >
            BUKA KOLEKSI
          </a>
        </div>
      </section>

      {/* ACCOUNT */}
      <section className="rounded-2xl border border-white/[0.07] bg-[#191918] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-[#B8860B]" />
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#A3A099]">
            AKUN PEMAIN
          </p>
        </div>
        <GoogleAuthButton />
      </section>

      {/* FULL PHOTO PREVIEW */}
      {isPhotoPreviewOpen && photoSrc && (
        <div
          className="fixed inset-0 z-[280] flex items-center justify-center bg-[#090B0E]/65 backdrop-blur-sm p-5"
          onClick={() => setIsPhotoPreviewOpen(false)}
        >
          <div
            className="relative flex items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPhotoPreviewOpen(false)}
              aria-label="Tutup preview foto"
              className="absolute -top-12 right-0 rounded-full border border-white/10 bg-[#282523]/80 p-3 text-white hover:bg-[#423B34]"
            >
              <X size={22} />
            </button>

            <img
              src={photoSrc}
              alt="Foto profil ukuran penuh"
              className="max-h-[82vh] max-w-[90vw] rounded-2xl border border-[#B8860B]/30 object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* EDIT CHARACTER MODAL */}
      {isEditing && (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-[#090B0E]/65 p-3 backdrop-blur-md sm:p-4"
          onClick={() => {
            setPhotoEditorFile(null);
            setIsEditing(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl border border-[#79602F]/45 bg-[#191817]/95 p-5 md:p-6 shadow-[0_24px_90px_rgba(0,0,0,0.65)]"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[9px] font-bold tracking-[0.25em] text-[#B8860B]">
                  KUSTOMISASI KARAKTER
                </p>
                <h3
                  id="edit-profile-title"
                  className="text-xl font-black text-[#EAE6DD] mt-1"
                >
                  人物設定 • Pengaturan Profil
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPhotoEditorFile(null);
                  setIsEditing(false);
                }}
                aria-label="Tutup"
                className="p-2 rounded-full bg-[#33312E] text-[#A3A099] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <ProfilePhotoEditor
              photoSrc={photoSrc}
              file={photoEditorFile}
              initialSettings={draftPhotoSettings}
              onSettingsChange={setDraftPhotoSettings}
              onChoosePhoto={() => fileInputRef.current?.click()}
            />

            <div className="border-t border-[#6F5A35]/30 pt-5 mt-5">
              <label
                htmlFor="profile-name"
                className="block text-[10px] font-black tracking-[0.15em] text-[#B8860B] mb-2"
              >
                NAMA PEMAIN • 名前
              </label>

              <input
                id="profile-name"
                type="text"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    void saveProfile();
                  }
                }}
                maxLength={24}
                placeholder="Masukkan nama"
                className="w-full bg-[#121110] border border-[#514638] rounded-xl px-4 py-3 text-[#EAE6DD] outline-none focus:border-[#B8860B] transition-colors"
              />

              <div className="flex justify-between text-[10px] text-[#817A73] mt-2">
                <span>Maksimal 24 karakter</span>
                <span>{draftName.length}/24</span>
              </div>
            </div>

            {photoError && (
              <p className="text-sm text-red-400 mt-4">{photoError}</p>
            )}

            {saveError && (
              <p className="text-sm text-red-400 mt-4">{saveError}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setPhotoEditorFile(null);
                  setIsEditing(false);
                }}
                disabled={photoLoading}
                className="flex-1 py-3 rounded-xl border border-white/10 bg-[#33312E] text-[#EAE6DD] font-bold text-xs hover:bg-[#44413D] disabled:opacity-50"
              >
                BATAL
              </button>

              <button
                type="button"
                onClick={() => void saveProfile()}
                disabled={photoLoading}
                className="flex-1 py-3 rounded-xl border border-[#D9B66D]/30 bg-gradient-to-r from-[#92272C] to-[#C93438] text-white font-black text-xs tracking-wider hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={15} />
                {photoLoading ? "MENYIMPAN..." : "SIMPAN"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
