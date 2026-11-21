
"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function GoogleAuthButton() {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleGoogleLogin = async () => {
    setBusy(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memulai login Google."
      );
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    setError("");

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal logout."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B] p-5">
      <h3 className="font-bold text-[#EAE6DD]">Akun Fude</h3>

      {loading ? (
        <p className="mt-2 text-sm text-[#A3A099]">
          Memeriksa status akun...
        </p>
      ) : user ? (
        <>
          <p className="mt-2 text-xs text-[#A3A099]">
            Masuk sebagai
          </p>
          <p className="mt-1 break-all text-sm font-semibold text-[#EAE6DD]">
            {user.email ?? "Akun Google"}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={busy}
            className="mt-4 rounded-xl border border-[#44413D] bg-[#262523] px-4 py-2 text-sm font-bold text-[#EAE6DD] hover:border-[#C93438] disabled:opacity-50"
          >
            {busy ? "Memproses..." : "Keluar"}
          </button>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-[#A3A099]">
            Masuk dengan akun Google untuk membuat akun Fude.
          </p>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={busy}
            className="mt-4 rounded-xl bg-[#C93438] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#B02A2E] disabled:opacity-50"
          >
            {busy ? "Menghubungkan..." : "Masuk dengan Google"}
          </button>
        </>
      )}

      {error && (
        <p role="alert" className="mt-3 text-xs text-red-400">
          {error}
        </p>
      )}

      <p className="mt-4 text-xs leading-5 text-[#817A73]">
        Sinkronisasi progres antarperangkat belum aktif. Data belajar
        tetap tersimpan di browser sampai fitur tersebut selesai.
      </p>
    </section>
  );
}
