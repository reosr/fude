
import Image from "next/image";
import {
  PROFILE_FRAMES,
} from "../lib/profile-collections";
import { GACHA_BADGES, LEGACY_GACHA_BADGE_ID_MAP } from "../data/gacha-badges";
import GachaBadgeArtwork from "./GachaBadgeArtwork";
import GachaAuraPreview from "./GachaAuraPreview";
import type { GachaEvolutionLevel } from "../lib/gacha";

interface ProfileAvatarProps {
  avatar?: string;
  photoSrc?: string | null;
  badgeId?: string | null;
  badgeLevel?: GachaEvolutionLevel;
  frameId?: string | null;
  size?: number;
  className?: string;
  compactBadgeAura?: boolean;
}

// =====================================================
// ORNAMEN SVG
// =====================================================

function Gem({
  x,
  y,
  size = 5,
  color,
}: {
  x: number;
  y: number;
  size?: number;
  color: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M 0 ${-size} L ${size * 0.75} 0 L 0 ${size} L ${-size * 0.75} 0 Z`}
        fill={color}
        stroke="#FFF2CF"
        strokeWidth="0.8"
      />
      <path
        d={`M 0 ${-size} L 0 ${size}`}
        stroke="#FFF2CF"
        strokeWidth="0.6"
        opacity="0.8"
      />
    </g>
  );
}

function SakuraFlower({
  x,
  y,
  size = 8,
  color = "#F3A4BF",
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy={-size * 0.55}
          rx={size * 0.34}
          ry={size * 0.58}
          transform={`rotate(${angle})`}
          fill={color}
          stroke="#FFE2EA"
          strokeWidth="0.65"
        />
      ))}
      <circle r={size * 0.2} fill="#F8D477" />
    </g>
  );
}

function KoiFish({
  x,
  y,
  rotation = 0,
  color = "#E88B4A",
}: {
  x: number;
  y: number;
  rotation?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
      <path
        d="M -9 0 C -5 -7 5 -7 10 0 C 5 7 -5 7 -9 0"
        fill={color}
        stroke="#F8DFA7"
        strokeWidth="1"
      />
      <path
        d="M -8 0 L -17 -7 L -15 0 L -17 7 Z"
        fill={color}
        stroke="#F8DFA7"
        strokeWidth="0.8"
      />
      <path
        d="M -1 -5 Q 3 0 -1 5"
        fill="none"
        stroke="#FFF0D0"
        strokeWidth="1.2"
      />
      <circle cx="6" cy="-1.5" r="1.1" fill="#21180F" />
    </g>
  );
}

function Flame({
  x,
  y,
  size = 10,
  color = "#F5A340",
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M 0 ${size} C ${-size} ${size * 0.2}, ${-size * 0.45} ${-size * 0.7}, 0 ${-size} C ${size * 0.1} ${-size * 0.1}, ${size} 0, 0 ${size} Z`}
        fill={color}
        stroke="#FFE5A7"
        strokeWidth="0.8"
      />
      <path
        d={`M 0 ${size * 0.55} Q ${-size * 0.35} 0 0 ${-size * 0.35} Q ${size * 0.4} 0 0 ${size * 0.55}`}
        fill="#FFF1C0"
      />
    </g>
  );
}

function Cloud({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M -12 3 Q -17 -3 -10 -6 Q -6 -14 0 -7 Q 8 -13 11 -5 Q 18 -3 12 3 Z"
        fill={color}
        stroke="#FFF0CE"
        strokeWidth="0.8"
      />
      <path
        d="M -8 0 Q 0 5 8 0"
        fill="none"
        stroke="#FFF0CE"
        strokeWidth="0.8"
      />
    </g>
  );
}

function Feather({
  x,
  y,
  rotation = 0,
  color,
}: {
  x: number;
  y: number;
  rotation?: number;
  color: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
      <path
        d="M 0 12 C -12 2 -10 -10 0 -15 C 10 -8 10 3 0 12 Z"
        fill={color}
        stroke="#FFE6B7"
        strokeWidth="0.9"
      />
      <path
        d="M 0 11 L 0 -12 M 0 -3 L -5 -8 M 0 1 L 6 -5"
        stroke="#FFF0D0"
        strokeWidth="0.8"
        fill="none"
      />
    </g>
  );
}

function Sword({
  x,
  y,
  rotation = 0,
  color,
}: {
  x: number;
  y: number;
  rotation?: number;
  color: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
      <path
        d="M 0 -15 L 2 -2 L 0 0 L -2 -2 Z"
        fill="#E7E6E1"
        stroke={color}
        strokeWidth="0.8"
      />
      <path
        d="M -5 0 L 5 0 M 0 0 L 0 7 M -3 7 L 3 7"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}

// =====================================================
// ORNAMEN KHUSUS SETIAP FRAME
// =====================================================

function FrameDecorations({
  id,
  color,
}: {
  id: string;
  color: string;
}) {
  switch (id) {
    case "sakura":
      return (
        <g>
          <path
            d="M 35 48 Q 47 25 65 25 M 165 48 Q 153 25 135 25"
            fill="none"
            stroke="#9D624B"
            strokeWidth="2"
          />
          <path
            d="M 35 48 Q 47 25 65 25 M 165 48 Q 153 25 135 25"
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <SakuraFlower x={43} y={39} size={9} />
          <SakuraFlower x={157} y={39} size={9} />
          <SakuraFlower x={100} y={12} size={10} />
          <SakuraFlower x={19} y={100} size={7} />
          <SakuraFlower x={181} y={100} size={7} />
          <path
            d="M 23 68 Q 35 56 46 66 Q 37 73 23 68 M 177 68 Q 165 56 154 66 Q 163 73 177 68"
            fill="#8DA66C"
            stroke="#E3C98D"
            strokeWidth="0.8"
          />
          <Gem x={100} y={28} size={4} color="#F8D477" />
        </g>
      );

    case "koi":
      return (
        <g>
          <KoiFish x={100} y={15} rotation={90} />
          <KoiFish x={100} y={185} rotation={-90} color="#F3E6C5" />
          <path
            d="M 22 76 Q 36 65 48 76 Q 36 88 22 76 M 178 76 Q 164 65 152 76 Q 164 88 178 76"
            fill="none"
            stroke="#72C5D0"
            strokeWidth="3"
          />
          <path
            d="M 23 128 Q 36 116 49 128 M 177 128 Q 164 116 151 128"
            fill="none"
            stroke="#72C5D0"
            strokeWidth="2"
          />
          <Gem x={42} y={100} color="#E5BD68" />
          <Gem x={158} y={100} color="#E5BD68" />
        </g>
      );

    case "samurai":
      return (
        <g>
          {/* Kabuto */}
          <path
            d="M 71 30 Q 74 8 100 7 Q 126 8 129 30 L 118 37 L 82 37 Z"
            fill="#3B3030"
            stroke={color}
            strokeWidth="2.5"
          />
          <path
            d="M 100 7 L 100 25 M 85 23 Q 100 29 115 23"
            fill="none"
            stroke="#F4D58D"
            strokeWidth="1.5"
          />
          <Gem x={100} y={19} size={5} color="#F5D278" />
          {/* Armor plates */}
          <path
            d="M 27 73 L 43 59 L 51 80 L 36 91 Z M 173 73 L 157 59 L 149 80 L 164 91 Z"
            fill="#4B3030"
            stroke={color}
            strokeWidth="2"
          />
          <path
            d="M 29 77 L 40 67 M 171 77 L 160 67"
            stroke="#F4D58D"
            strokeWidth="1.5"
          />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle cx={31 + i * 5} cy={102 + i * 3} r="1.6" fill="#F5D278" />
              <circle cx={169 - i * 5} cy={102 + i * 3} r="1.6" fill="#F5D278" />
            </g>
          ))}
        </g>
      );

    case "tengu":
      return (
        <g>
          <path
            d="M 74 31 Q 75 10 100 10 Q 125 10 126 31 L 113 40 L 87 40 Z"
            fill="#8C3028"
            stroke="#F2B78D"
            strokeWidth="1.5"
          />
          <path
            d="M 91 24 Q 100 17 109 24 L 105 32 L 95 32 Z"
            fill="#E8C795"
            stroke="#4B211F"
            strokeWidth="1"
          />
          <path
            d="M 100 29 C 97 42 106 44 100 51 C 94 44 103 42 100 29"
            fill="#C94B3E"
            stroke="#F2B78D"
            strokeWidth="1"
          />
          <path
            d="M 38 49 Q 23 31 17 48 Q 28 57 38 49 M 162 49 Q 177 31 183 48 Q 172 57 162 49"
            fill="#45312A"
            stroke={color}
            strokeWidth="2"
          />
          <Gem x={58} y={28} color="#E7BE71" />
          <Gem x={142} y={28} color="#E7BE71" />
        </g>
      );

    case "kitsune":
      return (
        <g>
          {/* Fox ears */}
          <path
            d="M 51 48 L 45 13 L 77 36 Z M 149 48 L 155 13 L 123 36 Z"
            fill="#D9693F"
            stroke="#FFE0B8"
            strokeWidth="2"
          />
          <path
            d="M 53 37 L 51 23 L 67 36 Z M 147 37 L 149 23 L 133 36 Z"
            fill="#F7D5C3"
          />
          {/* Fox mask */}
          <path
            d="M 88 25 Q 100 17 112 25 L 119 39 L 100 53 L 81 39 Z"
            fill="#F7E9D9"
            stroke="#D9693F"
            strokeWidth="2"
          />
          <path
            d="M 87 34 L 95 37 L 92 41 Z M 113 34 L 105 37 L 108 41 Z"
            fill="#382622"
          />
          <path
            d="M 96 46 L 100 49 L 104 46"
            stroke="#C94B3E"
            fill="none"
            strokeWidth="1.5"
          />
          <Flame x={24} y={105} size={7} />
          <Flame x={176} y={105} size={7} />
        </g>
      );

    case "ronin":
      return (
        <g>
          <Sword x={79} y={23} rotation={-35} color="#D8B879" />
          <Sword x={121} y={23} rotation={35} color="#D8B879" />
          <path
            d="M 68 16 Q 100 2 132 16 M 68 22 Q 100 8 132 22"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
          <path
            d="M 25 80 Q 38 69 49 80 M 175 80 Q 162 69 151 80"
            stroke="#B7B0A6"
            strokeWidth="2"
            fill="none"
          />
          <Gem x={100} y={14} size={4} color="#D8B879" />
          <Gem x={29} y={116} color="#D8B879" />
          <Gem x={171} y={116} color="#D8B879" />
        </g>
      );

    case "dragon":
      return (
        <g>
          <path
            d="M 38 63 Q 15 37 49 21 Q 73 10 85 30 Q 94 44 78 49"
            fill="none"
            stroke="#6F9C5D"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M 38 63 Q 15 37 49 21 Q 73 10 85 30 Q 94 44 78 49"
            fill="none"
            stroke="#E3C16A"
            strokeWidth="1.3"
          />
          <path
            d="M 162 63 Q 185 37 151 21 Q 127 10 115 30 Q 106 44 122 49"
            fill="none"
            stroke="#6F9C5D"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M 162 63 Q 185 37 151 21 Q 127 10 115 30 Q 106 44 122 49"
            fill="none"
            stroke="#E3C16A"
            strokeWidth="1.3"
          />
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i}>
              <path
                d={`M ${30 + i * 8} ${53 - i * 5} l 4 5 l 4 -5`}
                fill="#D5AD4C"
                stroke="#F4DF9A"
                strokeWidth="0.8"
              />
              <path
                d={`M ${170 - i * 8} ${53 - i * 5} l 4 5 l 4 -5`}
                fill="#D5AD4C"
                stroke="#F4DF9A"
                strokeWidth="0.8"
              />
            </g>
          ))}
          <Gem x={100} y={14} size={6} color="#F2D477" />
        </g>
      );

    case "onmyoji":
      return (
        <g>
          <path
            d="M 100 5 L 106 17 L 120 19 L 110 29 L 113 43 L 100 36 L 87 43 L 90 29 L 80 19 L 94 17 Z"
            fill="#7869BD"
            stroke="#D9CCFF"
            strokeWidth="1.4"
          />
          <circle cx="100" cy="24" r="5" fill="#F1DA9B" />
          <path
            d="M 28 63 L 43 72 L 43 104 L 28 113 Z M 172 63 L 157 72 L 157 104 L 172 113 Z"
            fill="#E7D8A8"
            stroke="#7869BD"
            strokeWidth="1.5"
          />
          <path
            d="M 31 75 L 40 81 M 169 75 L 160 81"
            stroke="#A13D3D"
            strokeWidth="2"
          />
          <Gem x={37} y={91} color="#7869BD" />
          <Gem x={163} y={91} color="#7869BD" />
          <circle cx="100" cy="185" r="8" fill="#392C63" stroke="#D9CCFF" strokeWidth="1.5" />
          <path d="M 100 177 L 103 182 L 109 185 L 103 188 L 100 193 L 97 188 L 91 185 L 97 182 Z" fill="#F4E4B5" />
        </g>
      );

    case "phoenix":
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <Feather
                x={32 + i * 9}
                y={42 + i * 5}
                rotation={-35 + i * 8}
                color={i % 2 ? "#E36C42" : "#F6B74F"}
              />
              <Feather
                x={168 - i * 9}
                y={42 + i * 5}
                rotation={35 - i * 8}
                color={i % 2 ? "#E36C42" : "#F6B74F"}
              />
            </g>
          ))}
          <Flame x={100} y={17} size={15} color="#E66B3F" />
          <Gem x={100} y={37} size={5} color="#FFE08A" />
          <path
            d="M 29 121 Q 45 103 58 120 M 171 121 Q 155 103 142 120"
            fill="none"
            stroke="#F7B24B"
            strokeWidth="3"
          />
        </g>
      );

    case "raijin":
      return (
        <g>
          <Cloud x={43} y={34} color="#567FA7" />
          <Cloud x={157} y={34} color="#567FA7" />
          <Cloud x={23} y={103} color="#567FA7" />
          <Cloud x={177} y={103} color="#567FA7" />
          <path
            d="M 68 14 L 94 14 L 83 30 L 101 30 L 74 50 L 81 34 L 64 34 Z"
            fill="#83D2F1"
            stroke="#FFF3BC"
            strokeWidth="1"
          />
          <path
            d="M 132 14 L 106 14 L 117 30 L 99 30 L 126 50 L 119 34 L 136 34 Z"
            fill="#83D2F1"
            stroke="#FFF3BC"
            strokeWidth="1"
          />
          <Gem x={100} y={91} size={5} color="#D7E9FF" />
        </g>
      );

    case "shogun":
      return (
        <g>
          {/* Imperial kabuto */}
          <path
            d="M 64 32 Q 68 7 100 7 Q 132 7 136 32 L 122 39 L 78 39 Z"
            fill="#4A3419"
            stroke="#F5D278"
            strokeWidth="2.5"
          />
          <path
            d="M 68 22 Q 100 3 132 22 M 78 30 Q 100 18 122 30"
            fill="none"
            stroke="#FBE5A2"
            strokeWidth="2"
          />
          <path
            d="M 100 5 L 100 -1 M 91 9 L 86 1 M 109 9 L 114 1"
            stroke="#F5D278"
            strokeWidth="2"
          />
          <Gem x={100} y={19} size={6} color="#FFF1B2" />
          {/* Side ornaments */}
          <path
            d="M 34 51 Q 15 59 25 83 Q 37 74 45 61 Z M 166 51 Q 185 59 175 83 Q 163 74 155 61 Z"
            fill="#9B3D32"
            stroke="#F5D278"
            strokeWidth="2"
          />
          <path
            d="M 31 67 L 40 72 M 169 67 L 160 72"
            stroke="#FFE8A8"
            strokeWidth="1.5"
          />
          <Gem x={34} y={104} size={4} color="#F5D278" />
          <Gem x={166} y={104} size={4} color="#F5D278" />
        </g>
      );

    case "n5-scholar":
      return (
        <g>
          <path
            d="M 65 20 Q 100 3 135 20"
            fill="none"
            stroke="#9DC9A9"
            strokeWidth="3"
          />
          <path
            d="M 72 22 L 72 9 Q 100 17 128 9 L 128 22"
            fill="#F2E2B8"
            stroke="#A98D5E"
            strokeWidth="1.5"
          />
          <path
            d="M 78 13 Q 100 20 122 13"
            fill="none"
            stroke="#79A98B"
            strokeWidth="1.5"
          />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path
                d={`M ${32 + i * 5} ${75 + i * 10} q -16 -12 -8 -27 q 15 4 8 27`}
                fill="#619477"
                stroke="#C3DDBB"
                strokeWidth="0.8"
              />
              <path
                d={`M ${168 - i * 5} ${75 + i * 10} q 16 -12 8 -27 q -15 4 -8 27`}
                fill="#619477"
                stroke="#C3DDBB"
                strokeWidth="0.8"
              />
            </g>
          ))}
          <Gem x={100} y={39} color="#F4D58D" />
        </g>
      );

    case "n4-kensei":
      return (
        <g>
          <Sword x={78} y={20} rotation={-43} color="#78B9E9" />
          <Sword x={122} y={20} rotation={43} color="#78B9E9" />
          <path
            d="M 78 36 Q 100 46 122 36"
            stroke="#E7D8B1"
            strokeWidth="2"
            fill="none"
          />
          <Gem x={100} y={11} size={6} color="#B9DCFF" />
          <path
            d="M 26 89 Q 39 74 52 89 M 174 89 Q 161 74 148 89"
            fill="none"
            stroke="#75B9F4"
            strokeWidth="2.5"
          />
        </g>
      );

    case "n3-oni-guardian":
      return (
        <g>
          <path
            d="M 70 34 Q 49 24 58 5 Q 80 12 85 31 Z M 130 34 Q 151 24 142 5 Q 120 12 115 31 Z"
            fill="#A9434A"
            stroke="#F1C1A0"
            strokeWidth="2"
          />
          <path
            d="M 82 17 Q 100 8 118 17 L 125 36 L 100 48 L 75 36 Z"
            fill="#D7A98D"
            stroke="#7F303A"
            strokeWidth="2"
          />
          <path
            d="M 82 27 L 95 30 L 88 34 Z M 118 27 L 105 30 L 112 34 Z"
            fill="#392326"
          />
          <path
            d="M 94 41 L 100 37 L 106 41"
            stroke="#7F303A"
            strokeWidth="2"
            fill="none"
          />
          <Gem x={100} y={18} color="#F5D278" />
        </g>
      );

    case "n2-kirin":
      return (
        <g>
          <path
            d="M 84 39 Q 69 25 72 8 M 84 39 Q 95 23 90 5 M 116 39 Q 131 25 128 8 M 116 39 Q 105 23 110 5"
            fill="none"
            stroke="#D6B9F3"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 72 8 L 66 4 M 128 8 L 134 4 M 90 5 L 85 0 M 110 5 L 115 0"
            stroke="#FFF1C5"
            strokeWidth="2"
          />
          <Cloud x={36} y={76} color="#7A65A9" />
          <Cloud x={164} y={76} color="#7A65A9" />
          <Gem x={100} y={23} size={7} color="#F5D278" />
          <path
            d="M 42 134 Q 60 122 76 137 M 158 134 Q 140 122 124 137"
            fill="none"
            stroke="#D6B9F3"
            strokeWidth="2"
          />
        </g>
      );

    case "n1-amaterasu":
      return (
        <g>
          {/* Sun rays */}
          {[
            [179, 100, 196, 100],
            [172.986, 130.232, 184.073, 134.824],
            [155.861, 155.861, 167.882, 167.882],
            [130.232, 172.986, 134.824, 184.073],
            [100, 179, 100, 196],
            [69.768, 172.986, 65.176, 184.073],
            [44.139, 155.861, 32.118, 167.882],
            [27.014, 130.232, 15.927, 134.824],
            [21, 100, 4, 100],
            [27.014, 69.768, 15.927, 65.176],
            [44.139, 44.139, 32.118, 32.118],
            [69.768, 27.014, 65.176, 15.927],
            [100, 21, 100, 4],
            [130.232, 27.014, 134.824, 15.927],
            [155.861, 44.139, 167.882, 32.118],
            [172.986, 69.768, 184.073, 65.176],
            ].map(([x1, y1, x2, y2], i) => (
            <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i % 2 === 0 ? "#FFF0B0" : "#E7B84E"}
                strokeWidth={i % 2 === 0 ? 2.8 : 1.5}
                strokeLinecap="round"
            />
            ))}

          {/* Sun crest */}
          <circle
            cx="100"
            cy="21"
            r="14"
            fill="#D88C2E"
            stroke="#FFF0B0"
            strokeWidth="2"
          />
          <circle cx="100" cy="21" r="8" fill="#FFE9A0" />
          <path
            d="M 100 11 L 103 19 L 112 21 L 103 24 L 100 32 L 97 24 L 88 21 L 97 19 Z"
            fill="#D88C2E"
          />

          {/* Celestial ornaments */}
          <Gem x={35} y={52} size={5} color="#FFE28A" />
          <Gem x={165} y={52} size={5} color="#FFE28A" />
          <Gem x={35} y={148} size={5} color="#FFE28A" />
          <Gem x={165} y={148} size={5} color="#FFE28A" />
          <path
            d="M 51 29 Q 60 17 70 25 M 149 29 Q 140 17 130 25"
            fill="none"
            stroke="#FFE9A0"
            strokeWidth="2"
          />
        </g>
      );

    default:
      return null;
  }
}

// =====================================================
// FRAME UTAMA
// =====================================================

function FrameArtwork({
  frameId,
  color,
}: {
  frameId: string;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="absolute inset-0 h-full w-full overflow-visible pointer-events-none select-none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      {/* Dark outer foundation */}
      <circle
        cx="100"
        cy="100"
        r="87"
        fill="none"
        stroke="#171411"
        strokeWidth="14"
      />

      {/* Main metallic ring */}
      <circle
        cx="100"
        cy="100"
        r="87"
        fill="none"
        stroke={color}
        strokeWidth="7"
      />

      {/* Inner highlight */}
      <circle
        cx="100"
        cy="100"
        r="77"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        opacity="0.9"
      />

      {/* Outer decorative dotted ring */}
      <circle
        cx="100"
        cy="100"
        r="96"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeDasharray="2 5"
        opacity="0.8"
      />

      {/* Small metal studs */}
      {[
        [100, 13],
        [143.301, 24.656],
        [175.344, 56.5],
        [187, 100],
        [175.344, 143.5],
        [143.301, 175.344],
        [100, 187],
        [56.5, 175.344],
        [24.656, 143.5],
        [13, 100],
        [24.656, 56.5],
        [56.5, 24.656],
        ].map(([cx, cy], i) => (
        <circle
            key={i}
            cx={cx}
            cy={cy}
            r="2"
            fill="#F7E5B2"
            stroke={color}
            strokeWidth="1"
        />
        ))}

      {/* Theme-specific illustration */}
      <FrameDecorations id={frameId} color={color} />

      {/* Corner gems for premium frames */}
      {frameId !== "classic" && (
        <>
          <Gem x={100} y={3} size={3.5} color={color} />
          <Gem x={17} y={100} size={3} color={color} />
          <Gem x={183} y={100} size={3} color={color} />
        </>
      )}
    </svg>
  );
}

// =====================================================
// PROFILE AVATAR
// =====================================================

export default function ProfileAvatar({
  avatar = "筆",
  photoSrc,
  badgeId,
  badgeLevel = 1,
  frameId = "classic",
  size = 112,
  className = "",
  compactBadgeAura = false,
}: ProfileAvatarProps) {
  const frame =
    PROFILE_FRAMES.find((item) => item.id === frameId) ??
    PROFILE_FRAMES[0];

  const resolvedBadgeId = badgeId
    ? LEGACY_GACHA_BADGE_ID_MAP[badgeId] ?? badgeId
    : null;
  const collectionBadge = GACHA_BADGES.find((item) => item.id === resolvedBadgeId);
  const badge = collectionBadge
    ? {
        name: collectionBadge.name,
        description: collectionBadge.description ?? "Badge koleksi Fude.",
        icon: collectionBadge.icon,
        tier: collectionBadge.rarity,
      }
    : undefined;

  const badgeSize = Math.round(size * (compactBadgeAura ? 0.46 : 0.36));

  // Ruang tengah foto lebih kecil agar artwork frame terlihat.
  const photoInset = Math.max(4, Math.round(size * 0.14));

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        isolation: "isolate",
        overflow: "visible",
      }}
    >
      {/* Background frame */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: frame.colors.background,
          boxShadow: `0 0 18px ${frame.colors.glow}`,
          zIndex: 0,
        }}
      />

      {/* Foto */}
      <div
        className="absolute flex items-center justify-center overflow-hidden rounded-full"
        style={{
          inset: photoInset,
          background: "#262523",
          border: "1px solid #EAE6DD55",
          zIndex: 1,
        }}
      >
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt="Foto profil"
            width={size}
            height={size}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="font-mincho select-none font-bold text-[#EAE6DD]"
            style={{
              fontSize: size * 0.42,
              lineHeight: 1,
            }}
          >
            {avatar}
          </span>
        )}
      </div>

      {/* Artwork frame di atas foto */}
      <FrameArtwork
        frameId={frame.id}
        color={frame.colors.border}
      />

      {/* Badge profil memakai artwork koleksi Gacha yang sama */}
      {badge && collectionBadge && (
        <div
          title={`${badge.name} — ${badge.description}`}
          aria-label={`Badge terpasang: ${badge.name}`}
          className="absolute flex items-center justify-center select-none"
          style={{
            width: badgeLevel > 1
              ? compactBadgeAura
                ? Math.max(30, badgeSize + 4)
                : Math.max(80, badgeSize + 24)
              : badgeSize,
            height: badgeLevel > 1
              ? compactBadgeAura
                ? Math.max(32, badgeSize + 10)
                : Math.max(80, badgeSize + 24)
              : badgeSize,
            left: "50%",
            bottom: 0,
            transform: "translate(-50%, 50%)",
            zIndex: 20,
          }}
        >
          {badgeLevel > 1 ? (
            <GachaAuraPreview
              badge={collectionBadge}
              level={badgeLevel}
              size={badgeSize}
              compact={compactBadgeAura}
            />
          ) : (
            <GachaBadgeArtwork badge={collectionBadge} level={1} size={badgeSize} />
          )}
        </div>
      )}
    </div>
  );
}
