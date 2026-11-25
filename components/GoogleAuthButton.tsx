
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { connectAndSyncFudeNow } from "@/lib/supabase/sync-engine";
import { resetFudeLocalAccountData } from "@/lib/supabase/reset-local";

export default function GoogleAuthButton() {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const popupWatcherRef = useRef<number | null>(null);
  const loginCompletionStartedRef = useRef(false);

  const stopPopupWatcher = () => {
    if (popupWatcherRef.current !== null) {
      window.clearInterval(popupWatcherRef.current);
      popupWatcherRef.current = null;
    }
  };

  const readUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  };

  const mountedRef = useRef(false);

  const completeLogin = async () => {
    // postMessage dan popup watcher bisa aktif hampir bersamaan.
    if (loginCompletionStartedRef.current) return;
    loginCompletionStartedRef.current = true;

    let currentUser: User | null = null;

    try {
      currentUser = await readUser();

      if (!mountedRef.current) return;
      if (!currentUser) {
        throw new Error("Session belum berhasil dibaca. Coba login kembali.");
      }

      setUser(currentUser);
      setModalOpen(false);

      // Popup desktop tidak selalu memicu event auth pada halaman utama.
      // Pulihkan data secara eksplisit setelah session berhasil dibaca.
      await connectAndSyncFudeNow(currentUser.id);

      if (!mountedRef.current) return;
      setBusy(false);
      setError("");
      setNotice("Akun Google berhasil terhubung.");
    } catch (err) {
      if (!mountedRef.current) return;

      setBusy(false);
      setNotice("");

      if (currentUser) {
        setUser(currentUser);
        setModalOpen(false);
        setError(
          `Login berhasil, tetapi data akun belum bisa dimuat: ${
            err instanceof Error ? err.message : "Terjadi kesalahan."
          }`
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memeriksa session akun."
        );
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    mountedRef.current = true;

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

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "fude-google-auth-success") {
        stopPopupWatcher();
        void completeLogin();
      }

      if (event.data?.type === "fude-google-auth-error") {
        stopPopupWatcher();
        setBusy(false);
        setError("Login Google belum berhasil. Silakan coba lagi.");
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      mounted = false;
      mountedRef.current = false;
      stopPopupWatcher();
      subscription.unsubscribe();
      window.removeEventListener("message", handleMessage);
    };
  }, [supabase]);

  const handleGoogleLogin = async () => {
    loginCompletionStartedRef.current = false;
    setBusy(true);
    setError("");
    setNotice("");

    const normalCallback =
      `${window.location.origin}/auth/callback`;

    try {
      const isMobile = window.matchMedia(
        "(max-width: 767px)"
      ).matches;

      // Browser mobile menggunakan redirect yang lebih kompatibel.
      if (isMobile) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: normalCallback },
        });

        if (error) throw error;
        return;
      }

      // Buka jendela langsung dari klik pengguna agar tidak diblokir browser.
      const popup = window.open(
        "about:blank",
        "fude-google-login",
        "popup=yes,width=520,height=680"
      );

      // Fallback jika popup diblokir.
      if (!popup) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: normalCallback },
        });

        if (error) throw error;
        return;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/popup-callback`,
          skipBrowserRedirect: true,
        },
      });

      if (error || !data.url) {
        popup.close();
        throw error ?? new Error("URL login Google tidak tersedia.");
      }

      popup.location.href = data.url;

      // Periksa apabila pengguna menutup popup sendiri.
      popupWatcherRef.current = window.setInterval(() => {
        if (!popup.closed) return;

        stopPopupWatcher();

        void completeLogin();
      }, 500);
    } catch (err) {
      setBusy(false);
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memulai login Google."
      );
    }
  };

  const handleLogout = async () => {
    if (!user) return;

    setBusy(true);
    setError("");

    try {
      // Pastikan perubahan terakhir tersimpan di cloud sebelum cache lokal
      // dikosongkan. Jika sinkronisasi gagal, sesi tetap dipertahankan.
      await connectAndSyncFudeNow(user.id);

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      await resetFudeLocalAccountData();
      setUser(null);
      setModalOpen(false);
      setNotice("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal logout. Data lokal tetap dipertahankan."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-[#33312E] bg-[#1E1D1B] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-black tracking-[0.2em] text-[#B8860B]">
              AKUN FUDE
            </p>

            <h3 className="mt-1 font-bold text-[#EAE6DD]">
              {loading
                ? "Memeriksa akun..."
                : user
                  ? "Akun terhubung"
                  : "Hubungkan akunmu"}
            </h3>

            <p className="mt-1 break-all text-xs text-[#A3A099]">
              {loading
                ? "Memeriksa status login"
                : user?.email ??
                  "Gunakan Google untuk menyiapkan akun Fude."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setModalOpen(true);
            }}
            disabled={loading}
            className="shrink-0 rounded-xl border border-[#B8860B]/40 bg-[#B8860B]/10 px-4 py-3 text-sm font-bold text-[#E7C46A] transition hover:bg-[#B8860B]/20 disabled:opacity-50"
          >
            {user ? "Kelola Akun" : "Masuk / Daftar"}
          </button>
        </div>

        {notice && (
          <p className="mt-3 text-xs text-emerald-400" role="status">
            {notice}
          </p>
        )}

        {error && !modalOpen && (
          <p className="mt-3 text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
      </section>


      {modalOpen && (
        <div
          className="fixed inset-0 z-[250] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => !busy && setModalOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="fude-auth-title"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/10 bg-[#1E1D1B] p-6 shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-[0.2em] text-[#B8860B]">
                AKUN FUDE
              </span>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={busy}
                aria-label="Tutup"
                className="rounded-full bg-white/5 px-3 py-1.5 text-lg text-[#A3A099] hover:text-white disabled:opacity-40"
              >
                ×
              </button>
            </div>

            <div className="mt-7 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#B8860B]/30 bg-[#B8860B]/10 text-3xl font-black text-[#E7C46A]">
                筆
              </div>

              <h2
                id="fude-auth-title"
                className="mt-5 text-xl font-black text-[#EAE6DD]"
              >
                {user ? "Akun Fude kamu" : "Selamat datang di Fude"}
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#A3A099]">
                {user
                  ? user.email
                  : "Hubungkan akun Google untuk menyiapkan akun belajar Fude."}
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs text-red-300"
              >
                {error}
              </p>
            )}

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={busy}
                className="mt-7 w-full rounded-xl border border-red-500/30 bg-red-500/10 py-3.5 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                {busy ? "Memproses..." : "Keluar dari akun"}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={busy}
                  className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-[#242424] shadow-lg transition hover:bg-gray-100 disabled:opacity-60"
                >
                  <span className="text-xl font-black text-[#4285F4]">
                    G
                  </span>
                  {busy
                    ? "Menghubungkan..."
                    : "Lanjutkan dengan Google"}
                </button>

                <p className="mt-4 text-center text-[11px] leading-5 text-[#817A73]">
                  Di HP, halaman Google akan terbuka dan kembali ke Fude
                  setelah login selesai.
                </p>
              </>
            )}

            <p className="mt-5 text-center text-[10px] leading-5 text-[#68635D]">
              Setelah login, data akun akan dimuat otomatis. Saat logout, profil perangkat kembali ke kondisi awal tanpa menghapus data cloud.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
