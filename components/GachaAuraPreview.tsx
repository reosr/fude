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
    <div className={`fude-aura-preview relative flex items-center justify-center fude-aura-${badge.rarity} ${level === 3 ? "fude-aura-level-3" : "fude-aura-level-2"}`} style={style}>
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
          {badge.rarity === "legendary" && (
            <svg className="fude-legendary-lightning fude-legendary-lightning-back" viewBox="0 0 180 140" preserveAspectRatio="none" aria-hidden="true">
              <g className="energy-ribbons">
                <path d="M18 99 C-2 68 18 25 54 18 C83 11 103 31 132 17 C157 5 177 29 161 52" />
                <path d="M8 76 C26 108 54 119 84 111 C117 103 138 122 166 91" />
                <path d="M29 120 C8 89 27 49 61 39 C89 31 116 54 146 34 C164 22 178 40 168 61" />
              </g>
              <g className="lightning-glow">
                <path d="M18 74 L39 61 L32 51 L57 42 L51 29 L75 37 L89 21 L96 42 L121 33 L115 52 L143 57 L125 71 L151 83 L119 87 L110 111 L91 91 L67 112 L69 86 L42 94 Z" />
                <path d="M25 37 L45 46 L56 31 L64 51 L82 55 L69 67 L48 62 L38 81" />
                <path d="M155 37 L138 50 L146 62 L126 73 L138 91" />
              </g>
            </svg>
          )}
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
      {level === 3 && badge.rarity === "legendary" && (
        <svg className="fude-legendary-lightning fude-legendary-lightning-front" viewBox="0 0 180 140" preserveAspectRatio="none" aria-hidden="true">
          <g className="front-bolts">
            <path d="M12 65 L32 57 L26 47 L49 44 L44 31 L65 42 L77 30 L82 52 L103 49 L94 64 L117 72 L96 81 L104 103 L81 87 L62 105 L63 82 L39 87 L47 70 Z" />
            <path d="M139 28 L125 45 L136 53 L118 64 L127 78 L108 82 L113 98" />
            <path d="M35 111 L50 96 L44 87 L62 77" />
          </g>
        </svg>
      )}
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
        .fude-legendary-lightning .energy-ribbons path {
          fill: none;
          stroke: #FF3457;
          stroke-width: 5.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 0 5px #FF1744) drop-shadow(0 0 12px rgba(255,23,68,.8));
          stroke-dasharray: 26 14 8 22;
          animation: crimson-flow 1.7s linear infinite;
        }
        .fude-legendary-lightning .energy-ribbons path:nth-child(2) { animation-delay: -.55s; animation-duration: 2.1s; }
        .fude-legendary-lightning .energy-ribbons path:nth-child(3) { animation-delay: -1.1s; animation-duration: 1.9s; }
        .fude-legendary-lightning .lightning-glow path,
        .fude-legendary-lightning .front-bolts path {
          fill: none;
          stroke: #FF244B;
          stroke-width: 4;
          stroke-linecap: square;
          stroke-linejoin: bevel;
          filter: drop-shadow(0 0 4px #FF163D) drop-shadow(0 0 9px #FF163D);
          stroke-dasharray: 3 8 13 6;
          animation: crimson-spark 1.1s steps(2, end) infinite;
        }
        .fude-legendary-lightning .lightning-glow path:nth-child(2) { animation-delay: -.35s; }
        .fude-legendary-lightning .lightning-glow path:nth-child(3) { animation-delay: -.7s; }
        .fude-legendary-lightning .front-bolts path { stroke: #FF8292; stroke-width: 2.2; }
        .fude-legendary-lightning .front-bolts path:nth-child(2) { animation-delay: -.4s; }
        .fude-legendary-lightning .front-bolts path:nth-child(3) { animation-delay: -.8s; }
        .fude-aura-legendary .fude-aura-flare { opacity: .9; filter: blur(6px); }
        .fude-aura-legendary .fude-aura-surge { opacity: .88; filter: blur(3px); }
        .fude-aura-legendary .fude-aura-particle { box-shadow: 0 0 12px 4px #FF263F; }
        .fude-aura-epic .fude-aura-surge { opacity: .7; }
        @keyframes mythic-radiance {
          0%, 100% { opacity: .42; transform: scale(.9) rotate(-5deg); }
          50% { opacity: 1; transform: scale(1.08) rotate(5deg); }
        }
        @keyframes crimson-flow {
          from { stroke-dashoffset: 0; opacity: .35; }
          45% { opacity: .95; }
          to { stroke-dashoffset: -70; opacity: .45; }
        }
        @keyframes crimson-spark {
          0%, 64%, 100% { opacity: .12; stroke-dashoffset: 0; }
          68%, 84% { opacity: 1; stroke-dashoffset: -28; }
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
