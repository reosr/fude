"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { connectAndSyncFudeNow } from "@/lib/supabase/sync-engine";
import { resetFudeLocalAccountData } from "@/lib/supabase/reset-local";
import { PROFILE_PHOTO_UPDATED_EVENT } from "@/lib/profile-photo";
import { FUDE_LOCAL_DATA_CHANGED_EVENT } from "@/lib/supabase/events";
import {
  FUDE_SYNC_ACCOUNT_BOUND_EVENT,
  getFudeSyncAccount,
} from "@/lib/supabase/account-guard";

const REALTIME_TABLES = [
  "fude_profiles",
  "fude_learning_progress",
  "fude_jlpt_results",
  "fude_irodori_progress",
  "fude_study_progress",
  "fude_gacha_data",
] as const;

export default function FudeSyncManager() {
  useEffect(() => {
    const supabase = createClient();

    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;
    let realtimeUserId: string | null = null;

    function cancelScheduledSync() {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    }

    function stopRealtimeChannel() {
      if (!realtimeChannel) return;

      const channel = realtimeChannel;
      realtimeChannel = null;
      realtimeUserId = null;
      void supabase.removeChannel(channel);
    }

    function startRealtimeChannel(userId: string) {
      if (
        realtimeChannel &&
        realtimeUserId === userId &&
        getFudeSyncAccount() === userId
      ) {
        return;
      }

      stopRealtimeChannel();

      if (getFudeSyncAccount() !== userId) return;

      let channel = supabase.channel(`fude-sync-${userId}`);

      for (const table of REALTIME_TABLES) {
        channel = channel.on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table,
            filter: `user_id=eq.${userId}`,
          },
          () => scheduleSync(300)
        );
      }

      realtimeChannel = channel;
      realtimeUserId = userId;

      channel.subscribe((status) => {
        if (
          mounted &&
          status !== "SUBSCRIBED" &&
          status !== "CLOSED"
        ) {
          console.warn("Status kanal Realtime Fude:", status);
        }
      });
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

            await connectAndSyncFudeNow(user.id);

            if (mounted && getFudeSyncAccount() === user.id) {
              startRealtimeChannel(user.id);
            }
          } catch (error) {
            console.error("Sinkronisasi otomatis Fude gagal:", error);
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
      void supabase.auth.getUser().then(({ data, error }) => {
        if (
          !mounted ||
          error ||
          !data.user ||
          getFudeSyncAccount() !== data.user.id
        ) {
          return;
        }

        startRealtimeChannel(data.user.id);
      });
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
        key === "fude_irodori_progress_v1" ||
        key === "fude_learning_progress_v1" ||
        key === "fude_gacha_inventory_v1" ||
        key === "fude_gacha_history_v1" ||
        key?.startsWith("jlpt_result_")
      ) {
        scheduleSync(900);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        // Perangkat baru akan ditautkan otomatis jika penggabungan aman.
        scheduleSync(0);
      }

      if (event === "SIGNED_OUT") {
        cancelScheduledSync();
        stopRealtimeChannel();

        if (getFudeSyncAccount()) {
          void resetFudeLocalAccountData();
        }
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
    document.addEventListener("visibilitychange", handleVisibilityChange);

    scheduleSync(1000);

    return () => {
      mounted = false;
      cancelScheduledSync();
      stopRealtimeChannel();
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
