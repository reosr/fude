import type { ReactNode } from "react";
import IrodoriLessonAccessGate from "@/components/IrodoriLessonAccessGate";

export default function IrodoriLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="irodori-learning"><IrodoriLessonAccessGate>{children}</IrodoriLessonAccessGate></div>;
}
