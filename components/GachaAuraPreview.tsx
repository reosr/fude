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
  const style = {
    "--aura-color": color,
    "--aura-opacity": level === 2 ? ".2" : ".48",
    "--aura-min-opacity": level === 2 ? ".1" : ".25",
  } as CSSProperties;

  return (
    <div className={`fude-aura-preview relative flex items-center justify-center ${level === 3 ? "fude-aura-level-3" : "fude-aura-level-2"}`} style={style}>
      <div className="fude-aura-cloud pointer-events-none absolute rounded-full" />
      <div className="fude-aura-cloud fude-aura-cloud-secondary pointer-events-none absolute rounded-full" />
      {level === 3 && (
        <>
          <div className="fude-aura-flare fude-aura-flare-one" />
          <div className="fude-aura-flare fude-aura-flare-two" />
          <div className="fude-aura-surge fude-aura-surge-one" />
          <div className="fude-aura-surge fude-aura-surge-two" />
        </>
      )}
      <span className="fude-aura-particle fude-aura-particle-one" />
      <span className="fude-aura-particle fude-aura-particle-two" />
      <span className="fude-aura-particle fude-aura-particle-three" />
      {level === 3 && (
        <>
          <span className="fude-aura-particle fude-aura-particle-four" />
          <span className="fude-aura-particle fude-aura-particle-five" />
          <span className="fude-aura-particle fude-aura-particle-six" />
          <span className="fude-aura-particle fude-aura-particle-seven" />
          <span className="fude-aura-glint fude-aura-glint-one">✦</span>
          <span className="fude-aura-glint fude-aura-glint-two">✧</span>
          <span className="fude-aura-glint fude-aura-glint-three">✦</span>
        </>
      )}
      <div className="relative z-10">
        <GachaBadgeArtwork badge={badge} level={1} size={size} />
      </div>
      <style jsx>{`
        .fude-aura-preview {
          width: 100%;
          min-height: 112px;
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
          filter: blur(${level === 2 ? "13px" : "18px"});
          animation: aura-breathe ${level === 2 ? "5.2s" : "3.4s"} ease-in-out infinite;
        }
        .fude-aura-cloud-secondary {
          width: 110%;
          left: -5%;
          opacity: ${level === 2 ? ".08" : ".23"};
          filter: blur(${level === 2 ? "22px" : "25px"});
          animation: aura-drift ${level === 2 ? "8s" : "5.5s"} ease-in-out infinite alternate;
        }
        .fude-aura-flare {
          position: absolute;
          z-index: 1;
          width: 115%;
          height: 76%;
          left: -7.5%;
          top: 12%;
          border-radius: 50%;
          background: radial-gradient(ellipse, transparent 38%, color-mix(in srgb, var(--aura-color) 25%, transparent) 57%, transparent 73%);
          filter: blur(9px);
          opacity: .55;
          animation: flare-breathe 4.8s ease-in-out infinite;
        }
        .fude-aura-flare-two {
          width: 92%;
          height: 110%;
          left: 4%;
          top: -5%;
          opacity: .38;
          filter: blur(13px);
          animation-delay: -2.4s;
          animation-direction: alternate-reverse;
        }
        .fude-aura-surge {
          position: absolute;
          z-index: 2;
          width: 72%;
          height: 22%;
          left: 14%;
          top: 12%;
          border-radius: 50%;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--aura-color) 65%, transparent), transparent);
          filter: blur(7px);
          opacity: .55;
          transform: rotate(-24deg);
          animation: surge-flow 4.2s ease-in-out infinite;
        }
        .fude-aura-surge-two {
          top: auto;
          bottom: 9%;
          left: 12%;
          transform: rotate(24deg);
          animation-delay: -2.1s;
          animation-direction: reverse;
        }
        .fude-aura-particle {
          position: absolute;
          z-index: 5;
          width: ${level === 2 ? "2px" : "3px"};
          height: ${level === 2 ? "2px" : "3px"};
          border-radius: 999px;
          background: var(--aura-color);
          box-shadow: 0 0 7px 2px var(--aura-color);
          opacity: 0;
          animation: aura-particle 4.2s ease-in-out infinite;
        }
        .fude-aura-particle-one { left: 16%; top: 52%; animation-delay: -.8s; }
        .fude-aura-particle-two { right: 15%; top: 34%; animation-delay: -2.2s; }
        .fude-aura-particle-three { right: 28%; bottom: 16%; animation-delay: -3.1s; }
        .fude-aura-level-2 .fude-aura-particle { opacity: .4; animation-duration: 5.8s; }
        .fude-aura-level-3 .fude-aura-particle { width: 3px; height: 3px; box-shadow: 0 0 9px 3px var(--aura-color); animation-duration: 3.5s; }
        .fude-aura-particle-four { left: 27%; top: 12%; animation-delay: -1.4s; }
        .fude-aura-particle-five { right: 25%; top: 68%; animation-delay: -2.8s; }
        .fude-aura-particle-six { left: 9%; bottom: 24%; animation-delay: -1.9s; }
        .fude-aura-particle-seven { right: 8%; bottom: 25%; animation-delay: -.4s; }
        .fude-aura-glint {
          position: absolute;
          z-index: 20;
          color: color-mix(in srgb, white 45%, var(--aura-color));
          text-shadow: 0 0 5px white, 0 0 13px var(--aura-color), 0 0 22px var(--aura-color);
          animation: aura-glint 2.8s ease-in-out infinite;
          pointer-events: none;
        }
        .fude-aura-glint-one { top: 1%; right: 10%; font-size: 15px; }
        .fude-aura-glint-two { bottom: 2%; left: 8%; font-size: 13px; animation-delay: -1.4s; }
        .fude-aura-glint-three { top: 20%; left: 5%; font-size: 10px; animation-delay: -.7s; }
        @keyframes aura-breathe {
          0%, 100% { transform: translateY(-50%) scale(.88); opacity: var(--aura-min-opacity); }
          50% { transform: translateY(-50%) scale(1.14); opacity: var(--aura-opacity); }
        }
        @keyframes aura-drift {
          from { transform: translate(-3%, -55%) scale(.9); }
          to { transform: translate(4%, -45%) scale(1.1); }
        }
        @keyframes flare-breathe {
          0%, 100% { transform: scale(.88) rotate(-8deg); opacity: .3; }
          50% { transform: scale(1.08) rotate(8deg); opacity: .75; }
        }
        @keyframes surge-flow {
          0%, 100% { transform: translate(-8%, 5px) rotate(-24deg) scaleX(.72); opacity: .18; }
          50% { transform: translate(9%, -5px) rotate(-12deg) scaleX(1.12); opacity: .72; }
        }
        @keyframes aura-particle {
          0%, 100% { transform: translateY(10px) scale(.55); opacity: 0; }
          30%, 72% { opacity: .9; }
          50% { transform: translateY(-17px) scale(1.25); }
        }
        @keyframes aura-glint {
          0%, 100% { transform: scale(.55) rotate(0deg); opacity: .18; }
          45%, 60% { transform: scale(1.3) rotate(45deg); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fude-aura-cloud, .fude-aura-flare, .fude-aura-surge, .fude-aura-particle, .fude-aura-glint { animation: none; }
        }
      `}</style>
    </div>
  );
}
