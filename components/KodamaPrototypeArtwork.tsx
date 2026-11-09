"use client";

import { useId } from "react";

export default function KodamaPrototypeArtwork({ size = 76 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const metal = `kodama-proto-metal-${uid}`;
  const bark = `kodama-proto-bark-${uid}`;
  const moss = `kodama-proto-moss-${uid}`;
  const porcelain = `kodama-proto-porcelain-${uid}`;
  const leaf = `kodama-proto-leaf-${uid}`;
  const shade = `kodama-proto-shade-${uid}`;
  const grain = `kodama-proto-grain-${uid}`;

  return (
    <svg viewBox="0 0 160 160" width={size} height={size} role="img"
      aria-label="Kodama, Japanese tree spirit, collectible badge prototype"
      className="shrink-0 overflow-visible drop-shadow-[0_9px_12px_rgba(0,0,0,0.58)]">
      <defs>
        <linearGradient id={metal} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFF4CF"/><stop offset=".16" stopColor="#D9C18A"/>
          <stop offset=".38" stopColor="#8B7047"/><stop offset=".62" stopColor="#E5D09A"/>
          <stop offset=".82" stopColor="#66543A"/><stop offset="1" stopColor="#F4E3B5"/>
        </linearGradient>
        <linearGradient id={bark} x1=".12" y1="0" x2=".9" y2="1">
          <stop stopColor="#B98A5A"/><stop offset=".22" stopColor="#8C603F"/>
          <stop offset=".58" stopColor="#5C402E"/><stop offset=".82" stopColor="#382D26"/>
          <stop offset="1" stopColor="#9C7048"/>
        </linearGradient>
        <linearGradient id={moss} x1="0" y1="0" x2=".9" y2="1">
          <stop stopColor="#E7F0B0"/><stop offset=".18" stopColor="#B7D477"/>
          <stop offset=".48" stopColor="#789B4E"/><stop offset=".76" stopColor="#48683E"/><stop offset="1" stopColor="#263F30"/>
        </linearGradient>
        <linearGradient id={porcelain} x1=".12" y1="0" x2=".82" y2="1">
          <stop stopColor="#FFFFFF"/><stop offset=".2" stopColor="#F7F1DA"/>
          <stop offset=".52" stopColor="#DCE0C8"/><stop offset=".78" stopColor="#AEB99C"/>
          <stop offset="1" stopColor="#66745F"/>
        </linearGradient>
        <linearGradient id={leaf} x1=".15" y1="0" x2=".85" y2="1">
          <stop stopColor="#F5F3C2"/><stop offset=".2" stopColor="#C7DC83"/>
          <stop offset=".52" stopColor="#83A956"/><stop offset=".82" stopColor="#527344"/><stop offset="1" stopColor="#304B35"/>
        </linearGradient>
        <radialGradient id={shade} cx=".32" cy=".18" r=".86">
          <stop stopColor="#FFFCE7" stopOpacity=".85"/><stop offset=".38" stopColor="#F7E7B5" stopOpacity=".2"/>
          <stop offset="1" stopColor="#16231C" stopOpacity=".78"/>
        </radialGradient>
        <filter id={grain} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="2" seed="8" result="noise"/>
          <feColorMatrix in="noise" type="saturate" values="0" result="mono"/>
          <feComponentTransfer><feFuncA type="table" tableValues="0 .16"/></feComponentTransfer>
          <feBlend in="SourceGraphic" mode="soft-light"/>
        </filter>
        <filter id={`kodama-proto-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="blur"/>
          <feOffset dy="3" result="offset"/>
          <feComponentTransfer><feFuncA type="linear" slope=".5"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* A carved old-tree medallion, with a raised bronze edge and inset forest enamel. */}
      <path d="M80 5 C68 14 54 10 44 19 C31 21 26 33 25 44 C14 54 18 67 13 78 C20 90 17 103 31 111 C38 126 53 126 63 136 L80 153 L97 136 C107 126 122 126 129 111 C143 103 140 90 147 78 C142 67 146 54 135 44 C134 33 129 21 116 19 C106 10 92 14 80 5Z"
        fill={`url(#${metal})`} stroke="#3C3326" strokeWidth="3.2" strokeLinejoin="round"/>
      <path d="M80 11 C69 19 56 16 47 24 C35 27 31 37 31 47 C22 56 25 67 21 78 C27 89 24 100 37 107 C43 119 56 120 65 130 L80 143 L95 130 C104 120 117 119 123 107 C136 100 133 89 139 78 C135 67 138 56 129 47 C129 37 125 27 113 24 C104 16 91 19 80 11Z"
        fill="#243B30" stroke="#F2E4B7" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M80 17 C68 25 57 22 49 30 C39 34 37 43 37 51 C29 59 32 68 28 78 C34 88 31 97 43 103 C49 114 60 114 68 124 L80 135 L92 124 C100 114 111 114 117 103 C129 97 126 88 132 78 C128 68 131 59 123 51 C123 43 121 34 111 30 C103 22 92 25 80 17Z"
        fill={`url(#${bark})`} stroke="#D8B77D" strokeWidth="1.4" strokeLinejoin="round"/>

      {/* Raised bark ridges and fine engraved grain. */}
      <g fill="none" strokeLinecap="round" filter={`url(#${grain})`}>
        <path d="M39 48 Q49 34 63 34 M33 76 Q44 66 49 53 M42 101 Q53 98 60 111 M121 48 Q111 34 97 34 M127 76 Q116 66 111 53 M118 101 Q107 98 100 111"
          stroke="#D6A66C" strokeWidth="2.2" opacity=".78"/>
        <path d="M43 52 Q49 44 56 43 M38 80 Q44 76 47 67 M49 105 Q55 106 59 116 M117 52 Q111 44 104 43 M122 80 Q116 76 113 67 M111 105 Q105 106 101 116"
          stroke="#332A22" strokeWidth="2.5" opacity=".8"/>
        <path d="M45 58 Q50 52 54 51 M115 58 Q110 52 106 51 M48 88 Q55 83 59 89 M112 88 Q105 83 101 89"
          stroke="#E6C18A" strokeWidth="1.1" opacity=".8"/>
      </g>

      {/* Ancient roots cradle the spirit without obscuring its silhouette. */}
      <path d="M80 116 C68 124 57 132 43 135 C52 122 57 113 63 104 M80 116 C92 124 103 132 117 135 C108 122 103 113 97 104"
        fill="none" stroke="#302A22" strokeWidth="11" strokeLinecap="round"/>
      <path d="M80 116 C68 124 57 132 43 135 C52 122 57 113 63 104 M80 116 C92 124 103 132 117 135 C108 122 103 113 97 104"
        fill="none" stroke={`url(#${bark})`} strokeWidth="7" strokeLinecap="round"/>
      <path d="M54 125 Q61 120 66 113 M106 125 Q99 120 94 113" fill="none" stroke="#D8AD76" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Moss pads are sculpted into the bark, with bright upper edges and dark undersides. */}
      <path d="M29 91 Q35 78 48 82 Q56 73 65 84 Q63 97 49 100 Q37 103 29 91Z M131 91 Q125 78 112 82 Q104 73 95 84 Q97 97 111 100 Q123 103 131 91Z"
        fill="#293D2D" stroke="#263326" strokeWidth="2"/>
      <path d="M30 88 Q35 77 47 81 Q56 72 64 83 Q60 93 48 96 Q37 98 30 88Z M130 88 Q125 77 113 81 Q104 72 96 83 Q100 93 112 96 Q123 98 130 88Z"
        fill={`url(#${moss})`} stroke="#D0DB91" strokeWidth="1.3"/>
      <path d="M34 84 Q40 77 48 82 M126 84 Q120 77 112 82" fill="none" stroke="#F1F2B9" strokeWidth="2" strokeLinecap="round"/>
      <g fill="#D9E9A0"><circle cx="42" cy="91" r="1.5"/><circle cx="51" cy="87" r="1.2"/><circle cx="118" cy="91" r="1.5"/><circle cx="109" cy="87" r="1.2"/></g>

      {/* A small living sprout grows from the crown, not antler-like branches. */}
      <path d="M78 45 Q73 29 63 22 Q57 17 51 19 M78 40 Q83 27 94 20" fill="none" stroke="#4B3928" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M78 45 Q73 29 63 22 Q57 17 51 19 M78 40 Q83 27 94 20" fill="none" stroke="#B88A59" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M52 20 Q43 8 48 5 Q60 7 63 19 Q59 24 52 20Z" fill={`url(#${leaf})`} stroke="#405D39" strokeWidth="1.4"/>
      <path d="M94 21 Q98 7 106 10 Q109 20 96 25Z" fill={`url(#${leaf})`} stroke="#405D39" strokeWidth="1.4"/>
      <path d="M50 9 Q56 14 59 19 M104 13 Q100 18 97 22" fill="none" stroke="#F7F3C7" strokeWidth="1.2" strokeLinecap="round"/>
      {/* The Kodama itself: pale wood-spirit porcelain, round head and small root body. */}
      <g filter={`url(#kodama-proto-shadow-${uid})`}>
        <path d="M58 91 Q49 95 48 106 Q50 116 62 117 L98 117 Q110 115 111 106 Q108 95 99 91Z" fill={`url(#${bark})`} stroke="#302A22" strokeWidth="2.4"/>
        <path d="M62 94 Q80 101 98 94 L96 113 Q80 119 64 113Z" fill="#6C8750" stroke="#344A34" strokeWidth="1.4"/>
        <path d="M67 98 Q80 103 93 98 M69 106 Q80 110 91 106" fill="none" stroke="#D7B17B" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M62 105 Q57 113 53 119 M98 105 Q103 113 107 119" fill="none" stroke="#647453" strokeWidth="5" strokeLinecap="round"/>
        <path d="M58 94 Q48 91 45 82 Q43 77 48 75 Q54 77 59 87 M99 94 Q110 91 116 97 Q119 101 115 105 Q108 105 101 101"
          fill="none" stroke="#75865B" strokeWidth="6.5" strokeLinecap="round"/>
        <path d="M53 53 C53 42 64 36 80 36 C96 36 107 43 107 57 C107 74 97 88 80 89 C63 88 53 74 53 53Z"
          fill={`url(#${porcelain})`} stroke="#59664F" strokeWidth="2.4" transform="rotate(-8 80 63)"/>
        <path d="M58 51 Q62 41 76 40" fill="none" stroke="#FFFFFF" strokeWidth="3.1" strokeLinecap="round" opacity=".9" transform="rotate(-8 80 63)"/>
        <path d="M60 48 Q65 43 72 43" fill="none" stroke="#D5DCC0" strokeWidth="1.2" strokeLinecap="round" transform="rotate(-8 80 63)"/>
        {/* Hollow, deep-set eyes: a defining quiet Kodama expression. */}
        <ellipse cx="70" cy="63" rx="4.2" ry="6.2" fill="#26362E" transform="rotate(-8 80 63)"/>
        <ellipse cx="91" cy="63" rx="3.7" ry="5.8" fill="#26362E" transform="rotate(-8 80 63)"/>
        <ellipse cx="69" cy="61" rx="1.25" ry="1.8" fill="#F7F5DF" opacity=".9" transform="rotate(-8 80 63)"/>
        <ellipse cx="90" cy="61" rx="1.1" ry="1.6" fill="#F7F5DF" opacity=".9" transform="rotate(-8 80 63)"/>
        <path d="M77 76 Q80 78 83 76" fill="none" stroke="#8D8C70" strokeWidth="1.7" strokeLinecap="round" transform="rotate(-8 80 63)"/>
        {/* Soft natural shading under the head and along the body. */}
        <path d="M58 79 Q80 92 102 79" fill="none" stroke="#8A9A7A" strokeWidth="2.4" opacity=".55" transform="rotate(-8 80 63)"/>
        <path d="M62 98 Q80 105 98 98" fill="none" stroke="#FFFFFF" strokeWidth="1.7" opacity=".75"/>
      </g>

      {/* Fine fern fronds, tiny seed pods and restrained gold inlay. */}
      <path d="M39 69 Q29 61 31 51 M39 69 Q27 67 24 59 M39 69 Q30 74 25 71 M121 69 Q131 61 129 51 M121 69 Q133 67 136 59 M121 69 Q130 74 135 71"
        fill="none" stroke="#A9C978" strokeWidth="1.8" strokeLinecap="round"/>
      <g fill={`url(#${moss})`} stroke="#DDE8A6" strokeWidth=".8">
        <ellipse cx="28" cy="53" rx="3.5" ry="2"/><ellipse cx="25" cy="60" rx="3.2" ry="1.8"/><ellipse cx="27" cy="72" rx="3.4" ry="1.9"/>
        <ellipse cx="132" cy="53" rx="3.5" ry="2"/><ellipse cx="135" cy="60" rx="3.2" ry="1.8"/><ellipse cx="133" cy="72" rx="3.4" ry="1.9"/>
      </g>
      <path d="M43 31 Q50 24 57 25 M103 25 Q110 24 117 31" fill="none" stroke="#F3D99B" strokeWidth="1.3" strokeLinecap="round" opacity=".9"/>
      <path d="M80 6 L82 13 L89 16 L82 19 L80 26 L77 19 L70 16 L77 13Z" fill="#FFF2C6" stroke="#9A7848" strokeWidth=".9"/>
      <path d="M19 105 L21 110 L26 112 L21 114 L19 119 L17 114 L12 112 L17 110Z M141 105 L143 110 L148 112 L143 114 L141 119 L139 114 L134 112 L139 110Z"
        fill="#EBD59D" stroke="#735B3A" strokeWidth=".8"/>

      {/* Directional studio light across the raised metal and enamel. */}
      <path d="M40 28 Q57 14 75 16" fill="none" stroke="#FFF8DF" strokeWidth="2.2" strokeLinecap="round" opacity=".78"/>
      <path d="M28 49 Q24 61 27 69 M132 49 Q136 61 133 69" fill="none" stroke="#F8E9B8" strokeWidth="1.6" strokeLinecap="round" opacity=".65"/>
      <path d="M49 118 Q62 132 80 139" fill="none" stroke="#E6C58C" strokeWidth="1.3" strokeLinecap="round" opacity=".7"/>
      <path d="M80 17 C68 25 57 22 49 30 C39 34 37 43 37 51 C29 59 32 68 28 78 C34 88 31 97 43 103 C49 114 60 114 68 124 L80 135 L92 124 C100 114 111 114 117 103 C129 97 126 88 132 78 C128 68 131 59 123 51 C123 43 121 34 111 30 C103 22 92 25 80 17Z"
        fill={`url(#${shade})`} opacity=".16" pointerEvents="none"/>
    </svg>
  );
}
