"use client";

import type { CSSProperties } from "react";
import type { GachaBadgeDefinition } from "@/lib/gacha";
import GachaBadgeArtwork from "@/components/GachaBadgeArtwork";

const AURA_COLORS: Record<GachaBadgeDefinition["rarity"], string> = {
  common: "#DCE5E2",
  uncommon: "#45D98A",
  rare: "#55A9FF",
  epic: "#B987FF",
  mythic: "#FFD36A",
  legendary: "#FF596B",
};

export default function GachaAuraPreview({
  badge,
  level,
  size = 88,
}: {
  badge: GachaBadgeDefinition;
  level: 2 | 3;
  size?: number;
}) {
  const color = AURA_COLORS[badge.rarity];
  const style = { "--aura-color": color, "--aura-opacity": level === 2 ? ".22" : ".38", "--aura-min-opacity": level === 2 ? ".12" : ".2" } as CSSProperties;

  return (
    <div className={`fude-aura-preview relative flex items-center justify-center ${level === 3 ? "fude-aura-level-3" : "fude-aura-level-2"}`} style={style}>
      <div className="fude-aura-cloud pointer-events-none absolute rounded-full" />
      <div className="fude-aura-cloud fude-aura-cloud-secondary pointer-events-none absolute rounded-full" />
      <span className="fude-aura-particle fude-aura-particle-one" />
      <span className="fude-aura-particle fude-aura-particle-two" />
      <span className="fude-aura-particle fude-aura-particle-three" />
      {level === 3 && (
        <>
          <span className="fude-aura-glint fude-aura-glint-one">✦</span>
          <span className="fude-aura-glint fude-aura-glint-two">✧</span>
        </>
      )}
      <div className="relative z-10">
        <GachaBadgeArtwork badge={badge} level={1} size={size} />
      </div>
      <style jsx>{`
        .fude-aura-preview {
          width: 100%;
          min-height: 100px;
          isolation: isolate;
        }
        .fude-aura-cloud {
          width: 88%;
          aspect-ratio: 1;
          left: 6%;
          top: 50%;
          transform: translateY(-50%);
          background: radial-gradient(ellipse, var(--aura-color) 0%, color-mix(in srgb, var(--aura-color) 42%, transparent) 32%, transparent 72%);
          opacity: var(--aura-opacity);
          filter: blur(${level === 2 ? "13px" : "17px"});
          animation: aura-breathe ${level === 2 ? "4.8s" : "3.6s"} ease-in-out infinite;
        }
        .fude-aura-cloud-secondary {
          width: 110%;
          left: -5%;
          opacity: ${level === 2 ? ".09" : ".2"};
          filter: blur(22px);
          animation: aura-drift 7s ease-in-out infinite alternate;
        }
        .fude-aura-particle {
          position: absolute;
          z-index: 5;
          width: ${level === 2 ? "2px" : "3px"};
          height: ${level === 2 ? "2px" : "3px"};
          border-radius: 999px;
          background: var(--aura-color);
          box-shadow: 0 0 7px 2px var(--aura-color);
          opacity: .0;
          animation: aura-particle 4.2s ease-in-out infinite;
        }
        .fude-aura-particle-one { left: 16%; top: 52%; animation-delay: -.8s; }
        .fude-aura-particle-two { right: 15%; top: 34%; animation-delay: -2.2s; }
        .fude-aura-particle-three { right: 28%; bottom: 16%; animation-delay: -3.1s; }
        .fude-aura-level-2 .fude-aura-particle { opacity: .45; animation-duration: 5.6s; }
        .fude-aura-glint {
          position: absolute;
          z-index: 20;
          color: var(--aura-color);
          text-shadow: 0 0 9px var(--aura-color);
          animation: aura-glint 3.2s ease-in-out infinite;
          pointer-events: none;
        }
        .fude-aura-glint-one { top: 7%; right: 12%; font-size: 13px; }
        .fude-aura-glint-two { bottom: 9%; left: 10%; font-size: 11px; animation-delay: -1.6s; }
        @keyframes aura-breathe {
          0%, 100% { transform: translateY(-50%) scale(.9); opacity: var(--aura-min-opacity); }
          50% { transform: translateY(-50%) scale(1.12); opacity: var(--aura-opacity); }
        }
        @keyframes aura-drift {
          from { transform: translate(-2%, -54%) scale(.94); }
          to { transform: translate(3%, -46%) scale(1.08); }
        }
        @keyframes aura-particle {
          0%, 100% { transform: translateY(8px) scale(.65); opacity: 0; }
          35%, 70% { opacity: .8; }
          50% { transform: translateY(-12px) scale(1.15); }
        }
        @keyframes aura-glint {
          0%, 100% { transform: scale(.65) rotate(0deg); opacity: .25; }
          50% { transform: scale(1.2) rotate(35deg); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fude-aura-cloud, .fude-aura-particle, .fude-aura-glint { animation: none; }
        }
      `}</style>
    </div>
  );
}
