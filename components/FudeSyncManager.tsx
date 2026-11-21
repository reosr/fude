"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { syncFudeNow } from "@/lib/supabase/sync-engine";
import { PROFILE_PHOTO_UPDATED_EVENT } from "@/lib/profile-photo";
import {
  FUDE_LOCAL_DATA_CHANGED_EVENT,
} from "@/lib/supabase/events";

import {
  FUDE_SYNC_ACCOUNT_BOUND_EVENT,
  getFudeSyncAccount,
} from "@/lib/supabase/account-guard";

export default function FudeSyncManager() {
  useEffect(() => {
    const supabase = createClient();

    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function cancelScheduledSync() {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    }

    function scheduleSync(delay = 800) {
      if (!mounted) return;

      cancelScheduledSync();

      timer = setTimeout(() => {
        timer = null;

        void (async () => {
          try {
            const {
              data: { user },
              error,
            } = await supabase.auth.getUser();

            if (!mounted || error || !user) return;

            const boundUserId = getFudeSyncAccount();

            // Jangan sinkronkan perangkat yang belum ditautkan
            // atau yang terhubung ke akun berbeda.
            if (!boundUserId || boundUserId !== user.id) return;

            await syncFudeNow(user.id);
          } catch (error) {
            console.error(
              "Sinkronisasi otomatis Fude gagal:",
              error
            );
          }
        })();
      }, delay);
    }

    function handleLocalChange() {
      scheduleSync(900);
    }

    function handlePhotoChange() {
        scheduleSync(900);
    }

    function handleAccountBound() {
      scheduleSync(0);
    }

    function handleOnline() {
      scheduleSync(0);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        scheduleSync(300);
      }
    }

    function handleStorage(event: StorageEvent) {
      const key = event.key;

      if (
        key === "fude_profile" ||
        key === "fude_progress" ||
        key === "fude_xp" ||
        key === "fude_xp_rewards" ||
        key === "fude_xp_base" ||
        key === "fude_profile_photo_updated" ||
        key === "fude_xp_events" ||
        key === "fude_memorized" ||
        key?.startsWith("jlpt_result_")
      ) {
        scheduleSync(900);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        scheduleSync(500);
      }

      if (event === "SIGNED_OUT") {
        cancelScheduledSync();
      }
    });

    window.addEventListener(
      FUDE_LOCAL_DATA_CHANGED_EVENT,
      handleLocalChange
    );

    window.addEventListener(
        PROFILE_PHOTO_UPDATED_EVENT,
        handlePhotoChange
    );

    window.addEventListener(
      FUDE_SYNC_ACCOUNT_BOUND_EVENT,
      handleAccountBound
    );

    window.addEventListener("online", handleOnline);
    window.addEventListener("storage", handleStorage);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    // Periksa sinkronisasi saat komponen pertama kali aktif.
    scheduleSync(1000);

    return () => {
      mounted = false;
      cancelScheduledSync();

      subscription.unsubscribe();

      window.removeEventListener(
  PROFILE_PHOTO_UPDATED_EVENT,
  handlePhotoChange
);

      window.removeEventListener(
        FUDE_LOCAL_DATA_CHANGED_EVENT,
        handleLocalChange
      );

      window.removeEventListener(
        FUDE_SYNC_ACCOUNT_BOUND_EVENT,
        handleAccountBound
      );

      window.removeEventListener("online", handleOnline);
      window.removeEventListener("storage", handleStorage);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  return null;
}