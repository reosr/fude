"use client";

import { useParams, useRouter } from "next/navigation";
import jlptData from "../../../../data/jlpt.json";
import JLPTQuiz from "../../../../components/JLPTQuiz";
import { ArrowLeft } from "lucide-react";

export default function JLPTTestPage() {
  const params = useParams();
  const router = useRouter();
  const level = params.level as string;
  const setId = params.setId as string;

  // Cari data set yang dipilih
  const levelData = jlptData.find((j: any) => j.level === level);
  const testSet = levelData?.sets?.find((s: any) => s.id === setId);

  if (!testSet) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-[#EAE6DD] mb-4">Set Ujian tidak ditemukan</h2>
        <button onClick={() => router.push(`/jlpt/${level}`)} className="text-[#C93438] hover:underline">
          Kembali ke Daftar Set
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Komponen Kuisnya dipanggil di sini */}
      <JLPTQuiz testSet={testSet} onBack={() => router.push(`/jlpt/${level}`)} />
    </div>
  );
}