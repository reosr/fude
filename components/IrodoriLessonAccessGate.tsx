"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { isIrodoriLessonUnlocked, useIrodoriProgress } from "@/lib/irodori-progress";

export default function IrodoriLessonAccessGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const progress = useIrodoriProgress();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const match = pathname.match(
    /^\/irodori\/(starter|elementary-1|elementary-2|pre-intermediate)\/lesson-(\d+)\/?$/
  );

  if (!match) return <>{children}</>;

  const courseId = match[1];
  const lessonNumber = Number(match[2]);
  if (!hasHydrated) {
    return (
      <main className="mx-auto flex min-h-[45vh] max-w-xl items-center justify-center px-5 text-center">
        <p className="text-sm text-[#A9A398]">Memeriksa akses pelajaran...</p>
      </main>
    );
  }

  const isUnlocked = isIrodoriLessonUnlocked(courseId, lessonNumber, progress.completedLessons);
  if (isUnlocked) return <>{children}</>;

  return (
    <main className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#1B1A18] text-[#A9A398]">
        <Lock size={24} />
      </div>
      <h1 className="mt-5 text-xl font-black text-[#EAE6DD]">Pelajaran masih terkunci</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#A9A398]">
        Selesaikan pelajaran sebelumnya terlebih dahulu. Setelah selesai, pelajaran ini akan terbuka otomatis.
      </p>
      <Link
        href={\`/irodori/\${courseId}\`}
        className="mt-6 rounded-xl border border-white/10 bg-[#1B1A18] px-4 py-2.5 text-xs font-bold text-[#EAE6DD] transition-colors hover:border-white/20"
      >
        Kembali ke daftar pelajaran
      </Link>
    </main>
  );
}
