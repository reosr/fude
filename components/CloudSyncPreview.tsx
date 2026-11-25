"use client";

import { useEffect, useState } from "react";
import { getLocalFudeSnapshot } from "@/lib/supabase/sync";
import { readCloudFudeData } from "@/lib/supabase/read-cloud";
import { mergeFudeData } from "@/lib/supabase/merge";
import { getPendingSyncChanges } from "@/lib/supabase/events";
import { migrateLocalFudeData } from "@/lib/supabase/migrate";
import {
  bindFudeSyncAccount,
  checkFudeSyncAccount,
  getFudeSyncAccount,
  FUDE_SYNC_ACCOUNT_BOUND_EVENT,
} from "@/lib/supabase/account-guard";
import { syncFudeNow } from "@/lib/supabase/sync-engine";

type Props = {
  userId: string;
};

type CloudSummary = {
  hasProfile: boolean;
  hasLearningProgress: boolean;
  jlptSetCount: number;
  hasIrodoriProgress: boolean;
  hasStudyProgress: boolean;
  hasGachaData: boolean;
  hasAnyData: boolean;
};

type PreviewState = {
  local: ReturnType<typeof getLocalFudeSnapshot>;
  cloud: CloudSummary;
  merged: ReturnType<typeof mergeFudeData> | null;
};

type BoundState = "checking" | "unbound" | "bound" | "mismatch";

function summarizeCloud(
  cloud: Awaited<ReturnType<typeof readCloudFudeData>>
): CloudSummary {
  const summary = {
    hasProfile: cloud.profile !== null,
    hasLearningProgress: cloud.progress !== null,
    jlptSetCount: cloud.jlptResults.length,
    hasIrodoriProgress: cloud.irodoriProgress !== null,
    hasStudyProgress: cloud.studyProgress !== null,
    hasGachaData: cloud.gachaData !== null,
    hasAnyData: false,
  };

  summary.hasAnyData = Boolean(
    summary.hasProfile ||
    summary.hasLearningProgress ||
    summary.jlptSetCount > 0 ||
    summary.hasIrodoriProgress ||
    summary.hasStudyProgress ||
    summary.hasGachaData
  );

  return summary;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Terjadi kesalahan saat memproses sinkronisasi.";
}

export default function CloudSyncPreview({ userId }: Props) {
  const [boundState, setBoundState] = useState<BoundState>("checking");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<PreviewState | null>(null);

  useEffect(() => {
    const refreshBoundState = () => {
      const boundUserId = getFudeSyncAccount();

      if (!boundUserId) {
        setBoundState("unbound");
      } else if (boundUserId === userId) {
        setBoundState("bound");
      } else {
        setBoundState("mismatch");
      }
    };

    refreshBoundState();
    window.addEventListener(
      FUDE_SYNC_ACCOUNT_BOUND_EVENT,
      refreshBoundState
    );
    window.addEventListener("storage", refreshBoundState);

    return () => {
      window.removeEventListener(
        FUDE_SYNC_ACCOUNT_BOUND_EVENT,
        refreshBoundState
      );
      window.removeEventListener("storage", refreshBoundState);
    };
  }, [userId]);

  async function handlePreview() {
    setLoading(true);
    setError("");
    setNotice("");
    setPreview(null);

    try {
      checkFudeSyncAccount(userId);

      const [local, cloudData] = await Promise.all([
        Promise.resolve(getLocalFudeSnapshot()),
        readCloudFudeData(),
      ]);

      const cloud = summarizeCloud(cloudData);

      if (!cloud.hasAnyData) {
        setPreview({ local, cloud, merged: null });
        setNotice(
          "Cloud masih kosong. Data lokal siap diperiksa untuk migrasi awal."
        );
        return;
      }

      // Dry-run: menghitung hasil penggabungan tanpa mengubah localStorage
      // atau menulis apa pun ke Supabase.
      const merged = mergeFudeData(
        local,
        cloudData,
        getPendingSyncChanges()
      );

      setPreview({ local, cloud, merged });
      setNotice(
        "Pemeriksaan penggabungan berhasil. Belum ada data yang dikirim atau diubah."
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleMigration() {
    if (!preview || preview.cloud.hasAnyData) return;

    const confirmed = window.confirm(
      "Salin data belajar dari perangkat ini ke akun cloud? Data lokal tidak akan dihapus. Lanjutkan?"
    );

    if (!confirmed) return;

    setProcessing(true);
    setError("");
    setNotice("");

    let migrationCompleted = false;

    try {
      checkFudeSyncAccount(userId);

      const result = await migrateLocalFudeData();

      if (result.status === "already_has_data") {
        setNotice(
          "Cloud ternyata sudah berisi data. Tidak ada data yang ditimpa. Periksa ulang untuk melihat pratinjau penggabungan."
        );
        await handlePreview();
        return;
      }

      migrationCompleted = true;

      // Ikat perangkat hanya setelah migrasi awal berhasil.
      // Sinkronisasi dijalankan langsung agar status dan error dapat ditampilkan.
      bindFudeSyncAccount(userId, false);
      setBoundState("bound");

      await syncFudeNow(userId);

      setPreview(null);
      setNotice(
        "Migrasi awal berhasil dan perangkat ini sudah terhubung. Sinkronisasi otomatis aktif."
      );
    } catch (err) {
      const message = getErrorMessage(err);
      setError(
        migrationCompleted
          ? "Data awal sudah tersalin ke cloud, tetapi sinkronisasi lanjutan belum selesai: " + message
          : message
      );
    } finally {
      setProcessing(false);
    }
  }

  async function handleConnectAndSync() {
    if (!preview?.cloud.hasAnyData || !preview.merged) return;

    const confirmed = window.confirm(
      "Hubungkan perangkat ini dan gabungkan data lokal dengan data cloud sesuai pratinjau? Jika ditemukan konflik baru, sinkronisasi akan dihentikan."
    );

    if (!confirmed) return;

    setProcessing(true);
    setError("");
    setNotice("");

    try {
      checkFudeSyncAccount(userId);

      // Ulangi dry-run dengan data terbaru tepat sebelum mengikat akun.
      const [freshLocal, freshCloud] = await Promise.all([
        Promise.resolve(getLocalFudeSnapshot()),
        readCloudFudeData(),
      ]);

      const freshSummary = summarizeCloud(freshCloud);

      if (!freshSummary.hasAnyData) {
        setPreview(null);
        setNotice(
          "Data cloud berubah dan sekarang kosong. Tekan Periksa Data lagi untuk melihat opsi migrasi."
        );
        return;
      }

      mergeFudeData(
        freshLocal,
        freshCloud,
        getPendingSyncChanges()
      );

      bindFudeSyncAccount(userId, false);
      setBoundState("bound");

      await syncFudeNow(userId);

      setPreview(null);
      setNotice(
        "Perangkat berhasil terhubung dan data berhasil disinkronkan."
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  }

  async function handleManualSync() {
    setSyncing(true);
    setError("");
    setNotice("");

    try {
      checkFudeSyncAccount(userId);
      await syncFudeNow(userId);
      setNotice("Sinkronisasi berhasil. Data perangkat dan cloud sudah diperbarui.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSyncing(false);
    }
  }

  return (
    <section className="mt-4 rounded-2xl border border-[#79602F]/30 bg-[#191918] p-4">
      <div>
        <p className="text-[10px] font-black tracking-[0.2em] text-[#B8860B]">
          DATA ANTARPERANGKAT
        </p>
        <h3 className="mt-1 text-lg font-bold text-[#EAE6DD]">
          Sinkronisasi Cloud
        </h3>
        <p className="mt-1 text-xs leading-5 text-[#A3A099]">
          Progres belajar, hasil JLPT, Irodori, Ungkapan Praktis, cerita, dan koleksi Gacha dapat disinkronkan melalui akun ini.
        </p>
      </div>

      {boundState === "checking" && (
        <p className="mt-4 text-sm text-white/60">
          Memeriksa status perangkat...
        </p>
      )}

      {boundState === "mismatch" && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-sm font-semibold text-red-300">
            Perangkat ini sudah terhubung ke akun Google lain.
          </p>
          <p className="mt-1 text-xs leading-5 text-red-200/80">
            Sinkronisasi dihentikan agar data dua akun tidak tercampur. Masuk kembali menggunakan akun Google yang sebelumnya ditautkan ke perangkat ini.
          </p>
        </div>
      )}

      {boundState === "bound" && (
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-sm font-semibold text-emerald-300">
            Perangkat ini sudah terhubung.
          </p>
          <p className="mt-1 text-xs leading-5 text-white/60">
            Perubahan data akan disinkronkan otomatis saat perangkat online. Kamu juga bisa menjalankan pemeriksaan manual.
          </p>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={syncing || processing}
            className="mt-3 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-50"
          >
            {syncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}
          </button>
        </div>
      )}

      {boundState === "unbound" && (
        <>
          <button
            type="button"
            onClick={handlePreview}
            disabled={loading || processing}
            className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-50"
          >
            {loading ? "Memeriksa..." : "Periksa Data Lokal dan Cloud"}
          </button>

          {preview && (
            <div className="mt-5 space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-[#EAE6DD]">
                  Data di perangkat ini
                </h4>
                <div className="mt-1 space-y-1 text-xs leading-5 text-[#B8B3AA]">
                  <p>Bab terbuka: Bab {preview.local.currentBab}</p>
                  <p>Total EXP: {preview.local.totalXp}</p>
                  <p>Kanji dihafal: {preview.local.memorizedKanji.length}</p>
                  <p>Hasil JLPT: {preview.local.jlptResults.length} set</p>
                  <p>
                    Irodori: {preview.local.irodoriProgress.completedLessons.length} pelajaran selesai
                  </p>
                  <p>
                    Ungkapan Praktis: {preview.local.studyProgress.completedPracticalCategories.length} kategori selesai
                  </p>
                  <p>
                    Cerita Baca: {preview.local.studyProgress.completedStories.length} cerita selesai
                  </p>
                  <p>
                    Gacha: {Object.keys(preview.local.gachaData.inventory.badges).length} jenis badge, {preview.local.gachaData.history.length} riwayat summon
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3">
                <h4 className="font-semibold text-[#EAE6DD]">
                  Data di cloud
                </h4>
                <div className="mt-1 space-y-1 text-xs leading-5 text-[#B8B3AA]">
                  <p>Status: {preview.cloud.hasAnyData ? "Sudah ada data" : "Masih kosong"}</p>
                  <p>Profil: {preview.cloud.hasProfile ? "Ada" : "Belum ada"}</p>
                  <p>
                    Progres belajar: {preview.cloud.hasLearningProgress ? "Ada" : "Belum ada"}
                  </p>
                  <p>Hasil JLPT: {preview.cloud.jlptSetCount} set</p>
                  <p>
                    Progres Irodori: {preview.cloud.hasIrodoriProgress ? "Ada" : "Belum ada"}
                  </p>
                  <p>
                    Ungkapan Praktis dan cerita: {preview.cloud.hasStudyProgress ? "Ada" : "Belum ada"}
                  </p>
                  <p>Data Gacha: {preview.cloud.hasGachaData ? "Ada" : "Belum ada"}</p>
                </div>
              </div>

              {preview.cloud.hasAnyData && preview.merged && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="font-semibold text-emerald-300">
                    Pratinjau penggabungan lolos
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/65">
                    Hasil sementara: Bab {preview.merged.currentBab}, {preview.merged.totalXp} EXP, {preview.merged.jlptResults.length} set JLPT, {preview.merged.irodoriProgress.completedLessons.length} pelajaran Irodori, {preview.merged.studyProgress.completedPracticalCategories.length} kategori praktis, {preview.merged.studyProgress.completedStories.length} cerita, dan {Object.keys(preview.merged.gachaData.inventory.badges).length} jenis badge.
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-white/50">
                    Ini hanya simulasi baca. Data belum ditulis ke perangkat atau cloud.
                  </p>
                  <button
                    type="button"
                    onClick={handleConnectAndSync}
                    disabled={processing || loading}
                    className="mt-3 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:bg-white/85 disabled:opacity-50"
                  >
                    {processing ? "Menghubungkan..." : "Hubungkan Perangkat & Sinkronkan"}
                  </button>
                </div>
              )}

              {!preview.cloud.hasAnyData && (
                <div className="rounded-xl border border-[#B8860B]/20 bg-[#B8860B]/5 p-3">
                  <p className="font-semibold text-[#E7C46A]">
                    Cloud belum memiliki data
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/60">
                    Data lokal dapat disalin sebagai data awal. Data di perangkat ini tidak akan dihapus.
                  </p>
                  <button
                    type="button"
                    onClick={handleMigration}
                    disabled={processing || loading}
                    className="mt-3 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:bg-white/85 disabled:opacity-50"
                  >
                    {processing ? "Memproses migrasi..." : "Migrasikan Data ke Cloud"}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {error && (
        <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs leading-5 text-red-300" role="alert">
          {error}
        </p>
      )}

      {notice && (
        <p className="mt-3 text-xs leading-5 text-emerald-300" role="status">
          {notice}
        </p>
      )}

      <p className="mt-4 text-[11px] leading-5 text-white/40">
        Foto profil ditangani melalui sinkronisasi terpisah setelah perangkat terhubung. Jika ditemukan konflik data yang tidak aman, proses akan dihentikan tanpa melanjutkan penggabungan.
      </p>
    </section>
  );
}
