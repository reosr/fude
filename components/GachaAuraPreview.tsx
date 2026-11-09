"use client";

import { useEffect, useState, type CSSProperties } from "react";
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

const LEGENDARY_LIGHTNING_PATHS = [
  "M8 58 L17 52 L13 45 L25 39 L21 31 L34 36 L40 27",
  "M172 49 L160 56 L165 64 L151 71 L155 80",
  "M15 91 L26 84 L22 77 L35 70 L31 63 L43 59",
  "M166 91 L154 84 L159 76 L146 68 L151 59 L139 54",
  "M49 15 L56 23 L63 19 L69 30 L77 26",
  "M124 119 L117 109 L123 102 L112 94 L117 86",
  "M31 119 L39 109 L35 103 L47 95",
  "M151 18 L143 27 L148 34 L137 42",
] as const;

type LightningBolt = {
  id: number;
  path: string;
  layer: "back" | "front";
  duration: number;
};

export default function GachaAuraPreview({
  badge,
  level,
  size = 88,
  compact = false,
}: {
  badge: GachaBadgeDefinition;
  level: 2 | 3;
  size?: number;
  compact?: boolean;
}) {
  const [lightningBolts, setLightningBolts] = useState<LightningBolt[]>([]);

  useEffect(() => {
    if (level !== 3 || badge.rarity !== "legendary") {
      setLightningBolts([]);
      return;
    }

    let active = true;
    let nextTimer: ReturnType<typeof setTimeout>;
    let clearTimer: ReturnType<typeof setTimeout>;
    let sequence = 0;
    let previousPaths: number[] = [];

    const scheduleDischarge = () => {
      nextTimer = setTimeout(() => {
        if (!active) return;

        const count = Math.random() < 0.2 ? 2 : 1;
        const available = LEGENDARY_LIGHTNING_PATHS
          .map((_, index) => index)
          .filter((index) => !previousPaths.includes(index));
        const chosen: number[] = [];

        for (let i = 0; i < count; i += 1) {
          const pool = available.filter((index) => !chosen.includes(index));
          if (!pool.length) break;
          chosen.push(pool[Math.floor(Math.random() * pool.length)]);
        }

        previousPaths = chosen;
        const duration = 180 + Math.floor(Math.random() * 260);
        const bolts = chosen.map((index, i) => ({
          id: ++sequence,
          path: LEGENDARY_LIGHTNING_PATHS[index],
          layer: (Math.random() < 0.58 ? "back" : "front") as "back" | "front",
          duration: duration + i * 35,
        }));

        setLightningBolts(bolts);
        clearTimer = setTimeout(() => {
          if (!active) return;
          setLightningBolts([]);
          scheduleDischarge();
        }, duration + 45);
      }, 420 + Math.floor(Math.random() * 1580));
    };

    scheduleDischarge();
    return () => {
      active = false;
      clearTimeout(nextTimer);
      clearTimeout(clearTimer);
    };
  }, [level, badge.rarity, compact]);

  const color = AURA_COLORS[badge.rarity];
  const style = {
    "--aura-color": color,
    "--aura-opacity": level === 2 ? ".2" : ".48",
    "--aura-min-opacity": level === 2 ? ".1" : ".25",
  } as CSSProperties;

  return (
    <div className={`fude-aura-preview relative flex items-center justify-center fude-aura-${badge.rarity} ${level === 3 ? "fude-aura-level-3" : "fude-aura-level-2"} ${compact ? "fude-aura-compact" : ""}`} style={style}>
      <div className="fude-aura-cloud pointer-events-none absolute rounded-full" />
      <div className="fude-aura-cloud fude-aura-cloud-secondary pointer-events-none absolute rounded-full" />
      {level === 3 && (
        <>
          {badge.rarity === "epic" && (
            <>
              <span className="fude-aura-shard fude-aura-shard-one" />
              <span className="fude-aura-shard fude-aura-shard-two" />
              <span className="fude-aura-shard fude-aura-shard-three" />
              <span className="fude-aura-shard fude-aura-shard-four" />
            </>
          )}
          {badge.rarity === "mythic" && (
            <div className="fude-mythic-rays" aria-hidden="true">
              <span /><span /><span /><span /><span /><span /><span /><span />
            </div>
          )}
{badge.rarity === "legendary" && lightningBolts.filter((bolt) => bolt.layer === "back").map((bolt) => (
            <svg key={bolt.id} className="fude-legendary-lightning fude-legendary-lightning-back" viewBox="0 0 180 140" preserveAspectRatio="none" aria-hidden="true">
              <path className="lightning-bolt lightning-bolt-glow" d={bolt.path} style={{ animationDuration: `${bolt.duration}ms` }} />
              <path className="lightning-bolt lightning-bolt-core" d={bolt.path} style={{ animationDuration: `${bolt.duration}ms` }} />
            </svg>
          ))}
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
        <GachaBadgeArtwork badge={badge} level={level} size={size} />
      </div>
{level === 3 && badge.rarity === "legendary" && lightningBolts.filter((bolt) => bolt.layer === "front").map((bolt) => (
        <svg key={bolt.id} className="fude-legendary-lightning fude-legendary-lightning-front" viewBox="0 0 180 140" preserveAspectRatio="none" aria-hidden="true">
          <path className="lightning-bolt lightning-bolt-glow" d={bolt.path} style={{ animationDuration: `${bolt.duration}ms` }} />
          <path className="lightning-bolt lightning-bolt-core" d={bolt.path} style={{ animationDuration: `${bolt.duration}ms` }} />
        </svg>
      ))}
      <style jsx>{`
        .fude-aura-preview {
          width: 100%;
          min-height: ${compact ? Math.max(size + 12, 34) : Math.max(size + 24, 80)}px;
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
        .fude-aura-shard {
          position: absolute;
          z-index: 3;
          width: 34%;
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, white 35%, var(--aura-color)), var(--aura-color), transparent);
          filter: drop-shadow(0 0 6px var(--aura-color)) blur(.5px);
          opacity: 0;
          transform-origin: center;
          animation: aura-shard 2.8s ease-in-out infinite;
          pointer-events: none;
        }
        .fude-aura-shard-one { top: 22%; left: 2%; transform: rotate(-38deg); }
        .fude-aura-shard-two { top: 34%; right: 0; width: 29%; transform: rotate(42deg); animation-delay: -.7s; }
        .fude-aura-shard-three { bottom: 23%; left: 4%; width: 26%; transform: rotate(32deg); animation-delay: -1.4s; }
        .fude-aura-shard-four { right: 7%; bottom: 15%; width: 36%; transform: rotate(-35deg); animation-delay: -2.1s; }
        .fude-aura-epic .fude-aura-shard {
          height: 4px;
          filter: drop-shadow(0 0 7px var(--aura-color));
          animation-duration: 2.5s;
        }
        .fude-mythic-rays {
          position: absolute;
          z-index: 2;
          inset: -8% 2%;
          pointer-events: none;
          filter: drop-shadow(0 0 7px #FFD36A);
          animation: mythic-radiance 5s ease-in-out infinite;
        }
        .fude-mythic-rays span {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 8%;
          height: 48%;
          transform-origin: 50% 100%;
          background: linear-gradient(to top, transparent 8%, rgba(255,211,106,.08) 36%, rgba(255,239,184,.82) 92%, transparent);
          clip-path: polygon(50% 0, 100% 100%, 0 100%);
          opacity: .72;
        }
        .fude-mythic-rays span:nth-child(1) { transform: translate(-50%,-100%) rotate(-68deg); }
        .fude-mythic-rays span:nth-child(2) { transform: translate(-50%,-100%) rotate(-46deg); }
        .fude-mythic-rays span:nth-child(3) { transform: translate(-50%,-100%) rotate(-24deg); }
        .fude-mythic-rays span:nth-child(4) { transform: translate(-50%,-100%) rotate(0deg); }
        .fude-mythic-rays span:nth-child(5) { transform: translate(-50%,-100%) rotate(24deg); }
        .fude-mythic-rays span:nth-child(6) { transform: translate(-50%,-100%) rotate(46deg); }
        .fude-mythic-rays span:nth-child(7) { transform: translate(-50%,-100%) rotate(68deg); }
        .fude-mythic-rays span:nth-child(8) { transform: translate(-50%,-100%) rotate(90deg); }
        .fude-aura-mythic .fude-aura-flare { opacity: .76; filter: blur(7px); }
        .fude-aura-mythic .fude-aura-surge { opacity: .48; }
        .fude-legendary-lightning {
          position: absolute;
          inset: -13% -8%;
          width: 116%;
          height: 126%;
          overflow: visible;
          pointer-events: none;
        }
        .fude-legendary-lightning-back { z-index: 4; }
        .fude-legendary-lightning-front { z-index: 20; }
        .lightning-bolt {
          fill: none;
          stroke-linecap: square;
          stroke-linejoin: bevel;
          stroke-dasharray: none;
          animation-name: lightning-discharge;
          animation-timing-function: ease-out;
          animation-fill-mode: both;
        }
        .lightning-bolt-glow {
          stroke: #FF244B;
          stroke-width: 2.8;
          filter: drop-shadow(0 0 2px #FF173F) drop-shadow(0 0 5px rgba(255,23,63,.72));
        }
        .lightning-bolt-core {
          stroke: #FFFDFE;
          stroke-width: .9;
          filter: drop-shadow(0 0 1px #FFFFFF) drop-shadow(0 0 2px #FFD9E0);
        }
        .fude-aura-legendary .fude-aura-flare { opacity: .38; filter: blur(8px); }
        .fude-aura-legendary .fude-aura-surge { opacity: .28; filter: blur(5px); }
        .fude-aura-legendary .fude-aura-particle { box-shadow: 0 0 6px 2px #FF263F; }
        .fude-aura-epic .fude-aura-surge { opacity: .7; }
        @keyframes mythic-radiance {
          0%, 100% { opacity: .42; transform: scale(.9) rotate(-5deg); }
          50% { opacity: 1; transform: scale(1.08) rotate(5deg); }
        }
        @keyframes lightning-discharge {
          0% { opacity: 0; }
          12% { opacity: 1; }
          24% { opacity: .58; }
          34% { opacity: .95; }
          100% { opacity: 0; }
        }
        .fude-aura-level-2.fude-aura-epic .fude-aura-cloud { opacity: .28; }
        .fude-aura-level-2.fude-aura-mythic .fude-aura-cloud { opacity: .3; }
        .fude-aura-level-2.fude-aura-legendary .fude-aura-cloud { opacity: .34; }
        @keyframes aura-shard {
          0%, 100% { opacity: 0; translate: -5px 5px; scale: .72; }
          35%, 65% { opacity: .9; }
          50% { translate: 7px -7px; scale: 1.12; }
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
          .fude-aura-cloud, .fude-aura-flare, .fude-aura-surge, .fude-aura-shard, .fude-aura-particle, .fude-aura-glint, .fude-mythic-rays, .fude-legendary-lightning, .fude-legendary-lightning span, .fude-legendary-lightning path { animation: none; }
        }
      `}</style>
    </div>
  );
}
