"use client";

import GoogleAuthButton from "@/components/GoogleAuthButton";
import CloudSyncPreview from "@/components/CloudSyncPreview";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import BindFudeAccount from "@/components/BindFudeAccount";
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
} from "lucide-react";

import { getProgress } from "../../lib/progress";
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

function getCompletedJlptSetCount(): number {
  if (typeof window === "undefined") return 0;

  const completed = new Set<string>();
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith("jlpt_result_")) continue;

      try {
        const raw = localStorage.getItem(key);
        const result = raw ? JSON.parse(raw) : null;
        if (result?.completedOnce === true) {
          completed.add(key.slice("jlpt_result_".length));
        }
      } catch {
        // Lewati hasil JLPT lama yang tidak valid.
      }
    }
  } catch (error) {
    console.error("Gagal membaca progres JLPT:", error);
  }

  return completed.size;
}

export default function Profil() {
  const [profile, setProfile] = useState<FudeProfile>(DEFAULT_PROFILE);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [currentBab, setCurrentBab] = useState(1);
  const [completedBab, setCompletedBab] = useState(0);
  const [completedJLPT, setCompletedJLPT] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(DEFAULT_PROFILE.name);
  const [saveError, setSaveError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshData = () => {
    const progress = Number(getProgress());
    const safeProgress = Number.isFinite(progress)
      ? Math.min(51, Math.max(1, progress))
      : 1;

    setCurrentBab(safeProgress);
    setCompletedBab(Math.min(50, Math.max(0, safeProgress - 1)));
    setCompletedJLPT(getCompletedJlptSetCount());
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

  const levelInfo = getLevelInfo(totalXp);
  const unlockedBab = Math.min(50, currentBab);
  const progressPercent = Math.round((completedBab / 50) * 100);

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
      saveFudeProfile({ name: cleanName, avatar: draftAvatar });
      setIsEditing(false);
      setSaveError("");
    } catch {
      setSaveError("Gagal menyimpan profil.");
    }
  };

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoError("");
    setPhotoLoading(true);
    try {
      await saveProfilePhoto(file);
      await refreshPhoto();
    } catch (error) {
      setPhotoError(
        error instanceof Error ? error.message : "Gagal mengunggah foto."
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
      setPhotoError("");
    } catch {
      setPhotoError("Gagal menghapus foto.");
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <section className="relative bg-[#1E1D1B] border border-[#33312E] rounded-3xl p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C93438]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <div className="flex flex-col items-center shrink-0">
            <ProfilePicture
              avatar={profile.avatar}
              photoSrc={photoSrc}
              size={116}
              className="border-2 border-[#B8860B]/50"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoLoading}
              className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#262523] border border-[#44413D] text-xs font-bold text-[#EAE6DD] hover:border-[#B8860B] transition-colors disabled:opacity-50"
            >
              <Camera size={15} />
              {photoLoading ? "Mengunggah..." : "Ganti Foto"}
            </button>
            {photoSrc && (
              <button
                type="button"
                onClick={handleDeletePhoto}
                className="mt-2 flex items-center gap-1 text-[11px] text-[#A3A099] hover:text-red-400"
              >
                <Trash2 size={12} />
                Hapus Foto
              </button>
            )}
            {photoError && (
              <p className="text-xs text-red-400 mt-2 text-center max-w-[180px]">
                {photoError}
              </p>
            )}
          </div>

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
              <LevelBadge currentBab={currentBab} />
            </div>

            <div className="mt-5 max-w-sm mx-auto sm:mx-0">
              <div className="flex justify-between text-[11px] font-bold mb-2">
                <span className="text-[#A3A099]">EXPERIENCE</span>
                <span className="text-[#EAE6DD] tabular-nums">
                  {levelInfo.currentExp} / {levelInfo.requiredExp} EXP
                </span>
              </div>
              <div
                className="h-2.5 bg-[#33312E] rounded-full overflow-hidden"
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
          </div>

          <button
            type="button"
            onClick={openEditor}
            className="sm:self-start flex items-center gap-2 px-4 py-2 rounded-xl bg-[#262523] border border-[#44413D] text-sm font-bold text-[#EAE6DD] hover:border-[#C93438] transition-colors"
          >
            <Pencil size={15} />
            Edit Profil
          </button>
        </div>
      </section>

      <GoogleAuthButton />
      <CloudSyncPreview />
      <BindFudeAccount />

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Target size={19} className="text-[#C93438]" />
          <h3 className="text-lg font-bold text-[#EAE6DD}"></h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-5">
            <BookOpen size={21} className="text-[#C93438] mb-3" />
            <p className="text-3xl font-black text-[#EAE6DD]">{completedBab}</p>
            <p className="text-xs text-[#A3A099] mt-1">Bab diselesaikan</p>
          </div>
          <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-5">
            <Trophy size={21} className="text-[#B8860B] mb-3" />
            <p className="text-3xl font-black text-[#EAE6DD]">{completedJLPT}</p>
            <p className="text-xs text-[#A3A099] mt-1">Set JLPT selesai</p>
          </div>
          <div className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-5 col-span-2 md:col-span-1">
            <Award size={21} className="text-[#B8860B] mb-3" />
            <p className="text-3xl font-black text-[#EAE6DD]">LVL {levelInfo.level}</p>
            <p className="text-xs text-[#A3A099] mt-1">{levelInfo.rank}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-6">
        <div className="flex justify-between items-center gap-3 mb-3">
          <div>
            <h3 className="font-bold text-[#EAE6DD]">Perjalanan Belajar</h3>
            <p className="text-xs text-[#A3A099] mt-1">
              Penyelesaian materi Minna no Nihongo Bab 1–50
            </p>
          </div>
          <span className="text-xl font-black text-[#C93438]">{progressPercent}%</span>
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

      <section className="bg-[#1E1D1B] border border-[#33312E] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target size={20} className="text-[#B8860B]" />
          <h3 className="font-bold text-[#EAE6DD]">Data Profil</h3>
        </div>
        <p className="text-sm text-[#A3A099] leading-relaxed">
          Nama, avatar, dan progres belajar tersimpan di browser pada perangkat
          ini. Foto profil disimpan di penyimpanan lokal browser. Sinkronisasi
          antarperangkat akan disiapkan bersama fitur akun.
        </p>
      </section>

      {isEditing && (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-[#08090D]/60 p-3 backdrop-blur-md sm:p-4"
          onClick={() => setIsEditing(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#17191D]/90 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 id="edit-profile-title" className="text-xl font-bold text-[#EAE6DD]">
                Edit Profil
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                aria-label="Tutup"
                className="p-2 rounded-full bg-[#262523] text-[#A3A099] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <label htmlFor="profile-name" className="block text-sm font-bold text-[#A3A099] mb-2">
              Nama Pengguna
            </label>
            <input
              id="profile-name"
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
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setDraftAvatar(avatar)}
                  aria-pressed={draftAvatar === avatar}
                  className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-colors ${
                    draftAvatar === avatar
                      ? "bg-[#C93438]/20 border-2 border-[#C93438]"
                      : "bg-[#262523] border border-[#44413D] hover:border-[#817A73]"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>

            {saveError && <p className="text-sm text-red-400 mt-4">{saveError}</p>}

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 rounded-xl bg-[#33312E] text-[#EAE6DD] font-bold text-sm hover:bg-[#44413D]"
              >
                Batal
              </button>
              <button
                type="button"
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
