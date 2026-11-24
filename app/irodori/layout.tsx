import type { ReactNode } from "react";

export default function IrodoriLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="irodori-learning">{children}</div>;
}
