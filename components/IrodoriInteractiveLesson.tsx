"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  RefreshCw,
} from "lucide-react";
import IrodoriConversation, {
  type IrodoriSpeaker,
  type IrodoriUtterance,
} from "@/components/IrodoriConversation";
import JapaneseReading from "@/components/JapaneseReading";
import JapaneseVocabularyReading from "@/components/JapaneseVocabularyReading";
import { formatGrammarNotation } from "@/lib/japanese-text";
import {
  completeIrodoriLesson,
  saveIrodoriSelfEvaluation,
  useIrodoriProgress,
} from "@/lib/irodori-progress";
import type { IrodoriRating } from "@/lib/irodori-progress";

export type IrodoriLessonTask = {
  prompt: ReactNode;
  options: { key: string; label: ReactNode }[];
  answer: string;
  explanation: ReactNode;
};

export type IrodoriLessonSimulation = {
  title: string;
  heading: string;
  prompt: string;
  japanese: ReactNode;
  translation: string;
  options: { key: string; label: string; meaning: string }[];
  answer: string;
  explanation: string;
};

export type IrodoriLessonContent = {
  lessonId: string;
  number: number;
  title: string;
  japaneseTitle: string;
  description: string;
  emblem: string;
  tags: string[];
  canDos: { id: string; source: string; text: string }[];
  conversations: { title: string; speakers: IrodoriSpeaker[]; utterances: IrodoriUtterance[] }[];
  vocabRows: [string, string, string][];
  kanjiWords: [string, string, string][];
  grammarNotes: { title: string; pattern: string; example: ReactNode; note: string }[];
  writingPractice: {
    title: string;
    instruction: string;
    exampleLabel: string;
    exampleJapanese: ReactNode;
    exampleTranslation: string;
    placeholder: string;
  };
  simulations: IrodoriLessonSimulation[];
  practiceTasks: IrodoriLessonTask[];
  quizQuestions: IrodoriLessonTask[];
};

const ratingOptions: { value: IrodoriRating; label: string }[] = [
  { value: 1, label: "★☆☆ Masih perlu latihan" },
  { value: 2, label: "★★☆ Sudah bisa" },
  { value: 3, label: "★★★ Bisa dengan baik" },
];

export default function IrodoriInteractiveLesson({ content }: { content: IrodoriLessonContent }) {
  const progress = useIrodoriProgress();
  const [simulationChoices, setSimulationChoices] = useState<Record<number, string>>({});
  const [simulationChecked, setSimulationChecked] = useState<Record<number, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, IrodoriRating>>({});
  const [writingDraft, setWritingDraft] = useState("");

  const { lessonId, number, canDos, simulations, practiceTasks, quizQuestions } = content;
  const isCompleted = progress.completedLessons.includes(lessonId);
  const visibleRatings = { ...(progress.selfEvaluations[lessonId] ?? {}), ...ratings };
  const practiceScore = practiceTasks.filter((task, index) => practiceAnswers[index] === task.answer).length;
  const practiceIsCorrect = practiceSubmitted && practiceScore === practiceTasks.length;
  const simulationScore = simulations.filter((task, index) => simulationChecked[index] && simulationChoices[index] === task.answer).length;
  const simulationsComplete = simulationScore === simulations.length;
  const quizScore = quizQuestions.filter((question, index) => answers[index] === question.answer).length;
  const canDosRated = canDos.every((item) => visibleRatings[item.id] !== undefined);
  const canEvaluate = practiceIsCorrect && simulationsComplete && quizSubmitted;
  const canComplete = canEvaluate && canDosRated;

  const resetPractice = () => { setPracticeAnswers({}); setPracticeSubmitted(false); };
  const resetQuiz = () => { setAnswers({}); setQuizSubmitted(false); };
  const resetSimulations = () => { setSimulationChoices({}); setSimulationChecked({}); };
  const finishLesson = () => { if (!canComplete || isCompleted) return; completeIrodoriLesson(lessonId); };

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-12">
      <Link href="/irodori/pre-intermediate" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1A18]/80 px-4 py-2 text-xs font-semibold text-[#C7C1B5] hover:border-[#B79ADE]/40">
        <ArrowLeft size={15} /> Kembali ke Pra-Menengah
      </Link>

      <header className="relative isolate overflow-hidden rounded-[28px] border border-[#80619B]/40 bg-gradient-to-br from-[#392B4D] via-[#1B1917] to-[#171615] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-mincho text-[180px] leading-none text-[#D9C2F4]/[0.08]">{content.emblem}</div>
        <div className="relative z-10">
          <p className="text-[9px] font-black tracking-[0.24em] text-[#C8A9EA]">IRODORI • PRA-MENENGAH A2/B1 • PELAJARAN {String(number).padStart(2, "0")}</p>
          <h1 className="mt-4 font-mincho text-3xl font-bold text-[#F1EBDD] md:text-4xl">{content.title}</h1>
          <p className="mt-2 text-sm font-semibold text-[#C8A9EA]">{content.japaneseTitle}</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B6B0A5]">{content.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {content.tags.map((tag) => <span key={tag} className="rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 text-[10px] text-[#D6C9E6]">{tag}</span>)}
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#80619B]/25 bg-[#2A2333]/70 p-4 md:p-5">
        <h2 className="text-sm font-bold text-[#EAE6DD]">Target komunikasi</h2>
        <p className="mt-2 text-[10px] leading-5 text-[#A9A398]">Target berikut dirangkum dari tujuan komunikasi materi Irodori Pra-Menengah untuk pelajaran ini.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {canDos.map((item) => <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#C8A9EA]">{item.source}</p><p className="mt-1 text-xs leading-5 text-[#C8C2B8]">{item.text}</p></article>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">DIALOG LATIHAN</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Dengarkan, baca, dan pahami konteks</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Percakapan berikut ditulis khusus untuk Fude. Audio belum tersedia, jadi gunakan teks, furigana, dan romaji untuk berlatih membaca.</p></div>
        <div className="space-y-4">
          {content.conversations.map((conversation) => <IrodoriConversation key={conversation.title} title={conversation.title} speakers={conversation.speakers} utterances={conversation.utterances} />)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">KOSAKATA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">{content.vocabRows.length} kosakata pilihan</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Pelajari arti dan cara baca setiap kata. Istilah yang lazim dipakai dalam bahasa Indonesia tetap dipertahankan agar terjemahannya terasa alami.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {content.vocabRows.map(([jp, reading, meaning]) => <article key={jp} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-base leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm leading-relaxed text-[#C8A9EA]" romajiClassName="mt-1 text-xs italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">KANJI UTAMA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Kosakata kanji utama</h2></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {content.kanjiWords.map(([jp, reading, meaning]) => <article key={jp} className="rounded-xl border border-[#80619B]/25 bg-[#2A2333]/55 p-3"><JapaneseVocabularyReading reading={reading} meaning={meaning} contentClassName="font-mincho text-lg font-bold leading-relaxed text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-base leading-relaxed text-[#C8A9EA]" romajiClassName="mt-1 text-sm italic text-[#A9A398]" translationClassName="mt-2 text-xs leading-5 text-[#A9A398]">{jp}</JapaneseVocabularyReading></article>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">POLA TATA BAHASA</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Pola penting dalam pelajaran ini</h2></div>
        {content.grammarNotes.map((item) => <article key={item.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.15em] text-[#C8A9EA]">{item.title}</p><p className="mt-2 whitespace-pre-line font-mincho text-sm leading-7 text-[#F1EBDD]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.pattern)}</JapaneseReading></p><p className="mt-2 font-mincho text-base leading-8 text-[#D6C2EC]"><JapaneseReading allowIndexFallback>{item.example}</JapaneseReading></p><p className="mt-2 text-xs leading-6 text-[#A9A398]"><JapaneseReading allowIndexFallback>{formatGrammarNotation(item.note)}</JapaneseReading></p></article>)}
      </section>

      <section className="space-y-4 rounded-2xl border border-[#80619B]/25 bg-[#2A2333]/60 p-4 md:p-5">
        <div className="flex items-center gap-2"><FileText size={16} className="text-[#C8A9EA]" /><h2 className="text-sm font-bold text-[#EAE6DD]">{content.writingPractice.title}</h2></div>
        <p className="text-xs leading-6 text-[#A9A398]">{content.writingPractice.instruction}</p>
        <div className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#C8A9EA]">{content.writingPractice.exampleLabel}</p><JapaneseReading allowIndexFallback translation={content.writingPractice.exampleTranslation} contentClassName="mt-2 font-mincho text-sm leading-7 text-[#F1EBDD]" kanaClassName="mt-2 font-mincho text-sm leading-relaxed text-[#C8A9EA]" romajiClassName="mt-1 text-xs italic text-[#A9A398]" translationClassName="mt-2 text-[10px] leading-5 text-[#A9A398]">{content.writingPractice.exampleJapanese}</JapaneseReading></div>
        <label htmlFor={lessonId + "-draft"} className="block text-xs font-semibold text-[#C8A9EA]">Tulis jawabanmu dalam bahasa Jepang</label>
        <textarea id={lessonId + "-draft"} value={writingDraft} onChange={(event) => setWritingDraft(event.target.value)} rows={5} placeholder={content.writingPractice.placeholder} className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#171411] px-3 py-3 font-mincho text-sm leading-7 text-[#F1EBDD] outline-none placeholder:text-[#746F65] focus:border-[#C8A9EA]/50" />
        <div className="flex items-center justify-between gap-3"><p className="text-[10px] text-[#817A73]">Draf hanya digunakan untuk latihan di halaman ini.</p><span className="text-[10px] tabular-nums text-[#C8A9EA]">{writingDraft.length} karakter</span></div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">SIMULASI SITUASI</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Gunakan bahasa Jepang dalam konteks</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab semua situasi berikut dengan memilih jawaban yang paling tepat. Semua jawaban harus benar untuk membuka evaluasi.</p></div>
        {simulations.map((task, index) => {
          const selected = simulationChoices[index];
          const checked = Boolean(simulationChecked[index]);
          const isCorrect = checked && selected === task.answer;
          const isWrong = checked && selected !== task.answer;
          return <article key={task.title} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4">
            <p className="text-[9px] font-black tracking-[0.16em] text-[#C8A9EA]">{task.title}</p><h3 className="mt-2 text-sm font-bold text-[#EAE6DD]">{task.heading}</h3><p className="mt-2 text-xs leading-6 text-[#A9A398]">{task.prompt}</p>
            <div className="mt-3 rounded-xl border border-[#80619B]/25 bg-[#2A2333]/60 p-3"><p className="font-mincho text-base leading-7 text-[#F1EBDD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.japanese}</JapaneseReading></p><p className="mt-1 text-xs text-[#A9A398]">{task.translation}</p></div>
            <div className="mt-3 grid gap-2">{task.options.map((option) => <button key={option.key} type="button" disabled={isCorrect} aria-pressed={selected === option.key} onClick={() => { setSimulationChoices((current) => ({ ...current, [index]: option.key })); setSimulationChecked((current) => ({ ...current, [index]: false })); }} className={"rounded-lg border px-3 py-2.5 text-left text-xs " + (isCorrect && option.key === task.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : selected === option.key ? "border-[#C8A9EA]/60 bg-[#80619B]/20 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}>{option.label}</button>)}</div>
            {(isCorrect || isWrong) && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span>{isCorrect ? task.explanation : "Baca lagi situasinya, lalu coba pilih jawaban lain."}</p>}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-[10px] text-[#817A73]">{isCorrect ? "Situasi selesai" : "Pilih jawaban lalu periksa"}</p><button type="button" disabled={!selected || isCorrect} onClick={() => setSimulationChecked((current) => ({ ...current, [index]: true }))} className="rounded-lg bg-[#80619B] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">{isCorrect ? "Selesai" : "Periksa"}</button></div>
            {isWrong && <p className="mt-2 text-[10px] text-[#E7A1A1]">{task.options.find((option) => option.key === task.answer)?.meaning}</p>}
          </article>;
        })}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-xs text-[#A9A398]">Situasi dijawab benar: {simulationScore} dari {simulations.length}.</p><button type="button" onClick={resetSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#80619B]/40 px-4 py-2 text-xs font-bold text-[#C8A9EA]"><RefreshCw size={13} /> Ulangi simulasi</button></div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">LATIHAN PRAKTIK</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">Uji pemahaman dasar</h2><p className="mt-1 text-xs leading-6 text-[#A9A398]">Jawab enam pertanyaan berikut. Kamu perlu menjawab semuanya dengan benar untuk membuka evaluasi akhir.</p></div>
        <div className="space-y-3">{practiceTasks.map((task, index) => { const selected = practiceAnswers[index]; const isCorrect = selected === task.answer; return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#C8A9EA]">LATIHAN {String(index + 1).padStart(2, "0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{task.options.map((option) => <button key={option.key} type="button" disabled={practiceSubmitted} aria-pressed={selected === option.key} onClick={() => setPracticeAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs " + (practiceSubmitted && option.key === task.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : practiceSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#C8A9EA]/60 bg-[#80619B]/20 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{practiceSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{task.explanation}</JapaneseReading></p>}</article>; })}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{practiceSubmitted ? "Hasil latihan: " + practiceScore + " dari " + practiceTasks.length + " benar." : Object.keys(practiceAnswers).length + " dari " + practiceTasks.length + " pertanyaan dijawab."}</p>{practiceSubmitted ? <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-lg border border-[#80619B]/40 px-4 py-2 text-xs font-bold text-[#C8A9EA]"><RefreshCw size={13} /> Ulangi latihan</button> : <button type="button" onClick={() => setPracticeSubmitted(true)} disabled={Object.keys(practiceAnswers).length !== practiceTasks.length} className="rounded-lg bg-[#80619B] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D]">Kirim jawaban</button>}</div>
      </section>

      <section className="space-y-4">
        <div><p className="text-[9px] font-black tracking-[0.2em] text-[#C8A9EA]">KUIS</p><h2 className="mt-1 text-lg font-black text-[#EAE6DD]">10 soal pemahaman</h2></div>
        <div className="space-y-3">{quizQuestions.map((question, index) => { const selected = answers[index]; const isCorrect = selected === question.answer; return <article key={index} className="rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p className="text-[9px] font-black tracking-[0.16em] text-[#C8A9EA]">SOAL {String(index + 1).padStart(2, "0")}</p><h3 className="mt-2 text-sm font-semibold leading-6 text-[#EAE6DD]"><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.prompt}</JapaneseReading></h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{question.options.map((option) => <button key={option.key} type="button" disabled={quizSubmitted} aria-pressed={selected === option.key} onClick={() => setAnswers((current) => ({ ...current, [index]: option.key }))} className={"rounded-lg border px-3 py-2.5 text-left text-xs " + (quizSubmitted && option.key === question.answer ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" : quizSubmitted && selected === option.key ? "border-red-400/50 bg-red-400/10 text-red-200" : selected === option.key ? "border-[#C8A9EA]/60 bg-[#80619B]/20 text-[#F1EBDD]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>)}</div>{quizSubmitted && <p className="mt-3 text-[10px] leading-5 text-[#A9A398]"><span className={isCorrect ? "font-bold text-emerald-300" : "font-bold text-[#E7A1A1]"}>{isCorrect ? "Benar. " : "Belum tepat. "}</span><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{question.explanation}</JapaneseReading></p>}</article>; })}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1B1A18] p-4"><p role="status" aria-live="polite" className="text-xs text-[#A9A398]">{quizSubmitted ? "Nilai kuis: " + quizScore + " dari " + quizQuestions.length + " benar." : Object.keys(answers).length + " dari " + quizQuestions.length + " pertanyaan dijawab."}</p>{quizSubmitted ? <button type="button" onClick={resetQuiz} className="inline-flex items-center gap-2 rounded-lg border border-[#80619B]/40 px-4 py-2 text-xs font-bold text-[#C8A9EA]"><RefreshCw size={13} /> Ulangi kuis</button> : <button type="button" onClick={() => setQuizSubmitted(true)} disabled={Object.keys(answers).length !== quizQuestions.length} className="rounded-lg bg-[#80619B] px-4 py-2 text-xs font-bold text-white disabled:bg-[#39342D]">Kirim jawaban</button>}</div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#80619B]/25 bg-[#2A2333]/65 p-4 md:p-5">
        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#C8A9EA]" /><h2 className="text-sm font-bold text-[#EAE6DD]">Evaluasi target komunikasi</h2></div>
        <p className="text-xs leading-6 text-[#A9A398]">Kamu bisa menilai kemampuanmu setelah semua simulasi dan latihan dijawab dengan benar serta kuis dikumpulkan.</p>
        <div className="space-y-3">{canDos.map((item) => <article key={item.id} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="text-[9px] font-black tracking-[0.15em] text-[#C8A9EA]">{item.source}</p><p className="mt-1 text-xs leading-5 text-[#EAE6DD]">{item.text}</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{ratingOptions.map((option) => <button key={option.value} type="button" disabled={!canEvaluate} aria-pressed={visibleRatings[item.id] === option.value} onClick={() => { const nextRatings = { ...visibleRatings, [item.id]: option.value }; setRatings(nextRatings); saveIrodoriSelfEvaluation(lessonId, nextRatings); }} className={"rounded-lg border px-3 py-2 text-left text-[10px] font-semibold disabled:opacity-40 " + (visibleRatings[item.id] === option.value ? "border-[#C8A9EA]/50 bg-[#80619B]/25 text-[#F5ECFF]" : "border-white/[0.07] bg-black/15 text-[#A9A398]")}><JapaneseReading showKana={false} showRomaji={false} allowIndexFallback>{option.label}</JapaneseReading></button>)}</div></article>)}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4"><p className="text-xs text-[#A9A398]">{isCompleted ? "Pelajaran " + number + " selesai. Progres tersimpan." : canDosRated ? "Semua target komunikasi sudah dinilai." : Object.keys(visibleRatings).filter((id) => canDos.some((item) => item.id === id)).length + " dari " + canDos.length + " target dinilai."}</p><button type="button" onClick={finishLesson} disabled={!canComplete || isCompleted} className="rounded-xl bg-[#80619B] px-5 py-2.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-[#39342D] disabled:text-[#817A73]">{isCompleted ? "Pelajaran " + number + " selesai" : "Selesaikan Pelajaran " + number}</button></div>
      </section>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5"><Link href="/irodori/pre-intermediate" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#A9A398]"><ArrowLeft size={14} /> Daftar pelajaran</Link><span className="text-[10px] font-semibold text-[#817A73]">Pra-Menengah · {number} / 18</span></div>
    </main>
  );
}
