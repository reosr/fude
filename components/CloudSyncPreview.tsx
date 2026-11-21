"use client";

import { useState } from "react";
import { getLocalFudeSnapshot } from "@/lib/supabase/sync";
import { inspectCloudFudeState } from "@/lib/supabase/cloud-state";
import { migrateLocalFudeData } from "@/lib/supabase/migrate";

export default function CloudSyncPreview() {
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [preview, setPreview] = useState<{
    local: ReturnType<typeof getLocalFudeSnapshot>;
    cloud: Awaited<ReturnType<typeof inspectCloudFudeState>>;
  } | null>(null);

  async function handlePreview() {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const [local, cloud] = await Promise.all([
        Promise.resolve(getLocalFudeSnapshot()),
        inspectCloudFudeState(),
      ]);

      setPreview({ local, cloud });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memeriksa data Fude."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleMigration() {
    if (!preview || preview.cloud.hasAnyData) return;

    const confirmed = window.confirm(
      "Salin seluruh data belajar lokal Fude ke akun Supabase ini? Data lokal di perangkat tidak akan dihapus."
    );

    if (!confirmed) return;

    setMigrating(true);
    setError("");
    setNotice("");

    try {
      const result = await migrateLocalFudeData();

      if (result.status === "already_has_data") {
        setNotice(
          "Database ternyata sudah memiliki data. Tidak ada data yang ditimpa."
        );
      } else {
        setNotice(
          `Migrasi berhasil! ${result.jlpt_sets} set hasil JLPT ikut disalin.`
        );
      }

      await handlePreview();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Migrasi data Fude gagal."
      );
    } finally {
      setMigrating(false);
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-semibold">Sinkronisasi Cloud</h3>

      <p className="mt-1 text-sm text-white/60">
        Periksa dan migrasikan data belajar ke akun Supabase.
      </p>

      <button
        type="button"
        onClick={handlePreview}
        disabled={loading || migrating}
        className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20 disabled:opacity-50"
      >
        {loading ? "Memeriksa..." : "Periksa Data"}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}

      {notice && (
        <p className="mt-3 text-sm text-green-400">{notice}</p>
      )}

      {preview && (
        <div className="mt-5 space-y-4 text-sm">
          <div>
            <h4 className="font-semibold">Data di perangkat</h4>
            <p>Bab yang terbuka: Bab {preview.local.currentBab}</p>
            <p>Total EXP: {preview.local.totalXp}</p>
            <p>
              Kosakata/kanji yang dihafal:{" "}
              {preview.local.memorizedKanji.length}
            </p>
            <p>
              Hasil JLPT: {preview.local.jlptResults.length} set
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Data di Supabase</h4>
            <p>
              Status:{" "}
              {preview.cloud.hasAnyData
                ? "Sudah ada data"
                : "Masih kosong"}
            </p>
            <p>
              Profil: {preview.cloud.hasProfile ? "Ada" : "Belum ada"}
            </p>
            <p>
              Progres belajar:{" "}
              {preview.cloud.hasLearningProgress ? "Ada" : "Belum ada"}
            </p>
            <p>Hasil JLPT: {preview.cloud.jlptSetCount} set</p>
          </div>

          {!preview.cloud.hasAnyData && (
            <button
              type="button"
              onClick={handleMigration}
              disabled={migrating || loading}
              className="rounded-lg bg-white px-4 py-2 font-semibold text-black transition hover:bg-white/80 disabled:opacity-50"
            >
              {migrating ? "Memigrasikan..." : "Migrasikan Data ke Cloud"}
            </button>
          )}

          <p className="text-xs text-white/50">
            Data lokal tetap tersimpan. Foto profil belum termasuk
            migrasi tahap ini.
          </p>
        </div>
      )}
    </section>
  );
}