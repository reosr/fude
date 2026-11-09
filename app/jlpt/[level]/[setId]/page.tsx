"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import JLPTQuiz from "../../../../components/JLPTQuiz";

export default function JLPTTestPage() {
  const params = useParams();
  const router = useRouter();

  const level = params.level as string;
  const setId = params.setId as string;

  const [testSet, setTestSet] = useState<any | null>(null);
  const [levelSetIds, setLevelSetIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setIsLoading(true);
      setLoadError(false);
      setTestSet(null);
      setLevelSetIds([]);

      try {
        const module = await import("../../../../data/jlpt.json");
        const allJlptData = module.default as any[];

        const levelData = allJlptData.find(
          (j: any) =>
            String(j.level).toUpperCase() ===
            String(level).toUpperCase()
        );

        const selectedSet = levelData?.sets?.find(
          (s: any) => s.id === setId
        );

        if (!active) return;

        setTestSet(selectedSet ?? null);

        setLevelSetIds(
          (levelData?.sets || [])
            .map((set: any) => set.id)
            .filter((id: any): id is string => typeof id === "string")
        );
      } catch (error) {
        console.error("Gagal memuat data ujian JLPT:", error);

        if (active) {
          setLoadError(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [level, setId]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-[#A3A099]">
        Memuat soal ujian...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-center py-20">
        <p className="text-[#A3A099] mb-4">
          Gagal memuat data ujian JLPT.
        </p>

        <button
          onClick={() => router.push(`/jlpt/${level}`)}
          className="text-[#C93438] hover:underline"
        >
          Kembali ke Daftar Set
        </button>
      </div>
    );
  }

  if (!testSet) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-[#EAE6DD] mb-4">
          Set Ujian tidak ditemukan
        </h2>

        <button
          onClick={() => router.push(`/jlpt/${level}`)}
          className="text-[#C93438] hover:underline"
        >
          Kembali ke Daftar Set
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <JLPTQuiz
        testSet={testSet}
        onBack={() => router.push(`/jlpt/${level}`)}
        level={level}
        levelSetIds={levelSetIds}
      />
    </div>
  );
}