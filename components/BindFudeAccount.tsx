"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  bindFudeSyncAccount,
  checkFudeSyncAccount,
  getFudeSyncAccount,
} from "@/lib/supabase/account-guard";
import { inspectCloudFudeState } from "@/lib/supabase/cloud-state";

export default function BindFudeAccount() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [boundId, setBoundId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadAccount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      setEmail(user?.email ?? "");
      setUserId(user?.id ?? "");
      setBoundId(getFudeSyncAccount());
      setLoading(false);
    }

    void loadAccount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void loadAccount();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleBind() {
    if (!userId || !email || working) return;

    const confirmed = window.confirm(
      `Pastikan ${email} adalah akun Google yang digunakan saat migrasi data Fude sebelumnya. Lanjutkan penautan perangkat?`
    );

    if (!confirmed) return;

    setWorking(true);
    setMessage("");

    try {
      checkFudeSyncAccount(userId);

      const cloud = await inspectCloudFudeState();

      if (!cloud.hasAnyData) {
        throw new Error(
          "Database akun ini belum memiliki data hasil migrasi."
        );
      }

      bindFudeSyncAccount(userId);
      setBoundId(userId);
      setMessage("Perangkat berhasil ditautkan ke akun cloud.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal menautkan perangkat."
      );
    } finally {
      setWorking(false);
    }
  }

  if (loading) {
    return <p className="mt-3 text-sm text-white/50">Memeriksa akun...</p>;
  }

  return (
    <section className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 className="font-semibold">Perangkat Terhubung</h3>

      {!userId ? (
        <p className="mt-2 text-sm text-white/60">
          Login Google terlebih dahulu.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-white/60">
            Akun: {email}
          </p>

          {boundId === userId ? (
            <p className="mt-2 text-sm text-green-400">
              Perangkat ini sudah tertaut ke akun cloud.
            </p>
          ) : boundId ? (
            <p className="mt-2 text-sm text-red-400">
              Perangkat ini sudah tertaut ke akun Google lain.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleBind}
              disabled={working}
              className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {working ? "Memeriksa..." : "Tautkan Perangkat Ini"}
            </button>
          )}
        </>
      )}

      {message && (
        <p className="mt-3 text-sm text-white/70">{message}</p>
      )}
    </section>
  );
}