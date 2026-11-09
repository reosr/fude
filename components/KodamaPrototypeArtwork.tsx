"use client";

import { useId } from "react";

export default function KodamaPrototypeArtwork({ size = 76 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} role="img"
      aria-label="Semi-realistic chibi Kodama spirit collectible badge"
      className="shrink-0 overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.62)]">
      <defs>
        <linearGradient id={`k-frame-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFF0C1"/><stop offset=".16" stopColor="#B98D4D"/>
          <stop offset=".38" stopColor="#58452E"/><stop offset=".62" stopColor="#E2C27E"/>
          <stop offset=".84" stopColor="#6A4B2C"/><stop offset="1" stopColor="#F6E2AC"/>
        </linearGradient>
        <radialGradient id={`k-enamel-${uid}`} cx=".35" cy=".22" r=".95">
          <stop stopColor="#46634A"/><stop offset=".48" stopColor="#1C392F"/>
          <stop offset=".82" stopColor="#10251F"/><stop offset="1" stopColor="#081510"/>
        </radialGradient>
        <radialGradient id={`k-skin-${uid}`} cx=".28" cy=".16" r=".92">
          <stop stopColor="#FFFDF0"/><stop offset=".2" stopColor="#F0F0D9"/>
          <stop offset=".48" stopColor="#C9D3B7"/><stop offset=".72" stopColor="#91A487"/>
          <stop offset=".9" stopColor="#647A68"/><stop offset="1" stopColor="#3D594B"/>
        </radialGradient>
        <linearGradient id={`k-skin-side-${uid}`} x1="0" y1="0" x2="1" y2=".2">
          <stop stopColor="#F7F5E5"/><stop offset=".38" stopColor="#D4DCC4"/>
          <stop offset=".72" stopColor="#8D9F84"/><stop offset="1" stopColor="#526B5A"/>
        </linearGradient>
        <radialGradient id={`k-moss-${uid}`} cx=".3" cy=".08" r=".95">
          <stop stopColor="#F0F4B7"/><stop offset=".22" stopColor="#B9D47A"/>
          <stop offset=".5" stopColor="#789D4D"/><stop offset=".78" stopColor="#45683C"/>
          <stop offset="1" stopColor="#263F2E"/>
        </radialGradient>
        <linearGradient id={`k-leaf-${uid}`} x1=".1" y1="0" x2=".9" y2="1">
          <stop stopColor="#F8F7C9"/><stop offset=".22" stopColor="#D4E994"/>
          <stop offset=".55" stopColor="#8EBB61"/><stop offset=".82" stopColor="#4F8048"/>
          <stop offset="1" stopColor="#294B35"/>
        </linearGradient>
        <linearGradient id={`k-bark-${uid}`} x1=".1" y1="0" x2=".8" y2="1">
          <stop stopColor="#C69A69"/><stop offset=".24" stopColor="#8C6746"/>
          <stop offset=".6" stopColor="#59432F"/><stop offset="1" stopColor="#302A22"/>
        </linearGradient>
        <radialGradient id={`k-eye-${uid}`} cx=".28" cy=".16" r=".9">
          <stop stopColor="#63766B"/><stop offset=".18" stopColor="#273A31"/>
          <stop offset=".58" stopColor="#0B1712"/><stop offset="1" stopColor="#020805"/>
        </radialGradient>
        <radialGradient id={`k-glow-${uid}`} cx=".5" cy=".5" r=".5">
          <stop stopColor="#F4F6B7" stopOpacity=".8"/><stop offset=".42" stopColor="#B5D978" stopOpacity=".28"/>
          <stop offset="1" stopColor="#A9D66D" stopOpacity="0"/>
        </radialGradient>
        <filter id={`k-shadow-${uid}`} x="-35%" y="-35%" width="180%" height="190%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="blur"/>
          <feOffset dy="4" dx="1" result="offset"/>
          <feComponentTransfer><feFuncA type="linear" slope=".58"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id={`k-soft-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.4"/>
        </filter>
        <filter id={`k-texture-${uid}`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".58" numOctaves="2" seed="14" result="n"/>
          <feColorMatrix in="n" type="saturate" values="0" result="mono"/>
          <feComponentTransfer in="mono"><feFuncA type="table" tableValues="0 .12"/></feComponentTransfer>
          <feBlend in="SourceGraphic" mode="soft-light"/>
        </filter>
      </defs>

      {/* Dark, recessed forest-enamel medallion; the character is the focal point. */}
      <path d="M80 5 C66 14 52 9 42 20 C28 23 24 37 25 48 C14 60 20 73 15 84 C22 97 20 109 34 117 C42 132 59 131 68 141 L80 153 L92 141 C101 131 118 132 126 117 C140 109 138 97 145 84 C140 73 146 60 135 48 C136 37 132 23 118 20 C108 9 94 14 80 5Z"
        fill={`url(#k-frame-${uid})`} stroke="#30291F" strokeWidth="3"/>
      <path d="M80 12 C67 20 55 16 46 26 C34 29 31 40 32 50 C23 61 28 73 24 84 C30 95 28 106 40 113 C47 125 60 125 69 134 L80 144 L91 134 C100 125 113 125 120 113 C132 106 130 95 136 84 C132 73 137 61 128 50 C129 40 126 29 114 26 C105 16 93 20 80 12Z"
        fill={`url(#k-enamel-${uid})`} stroke="#E7D09A" strokeWidth="1.6"/>
      <path d="M39 44 Q48 29 64 28 M121 44 Q112 29 96 28" fill="none" stroke="#A6B879" strokeWidth="1.4" opacity=".45" strokeLinecap="round"/>
      <ellipse cx="80" cy="91" rx="48" ry="43" fill={`url(#k-glow-${uid})`} opacity=".24"/>

      {/* Small living leaves break the silhouette; no antler-like branches. */}
      <g filter={`url(#k-shadow-${uid})`}>
        <path d="M77 46 Q72 29 59 20" fill="none" stroke="#493B2A" strokeWidth="5" strokeLinecap="round"/>
        <path d="M77 46 Q72 29 59 20" fill="none" stroke="#B58A59" strokeWidth="2" strokeLinecap="round"/>
        <path d="M59 21 C43 18 40 7 46 5 C59 4 68 13 66 23 C64 25 61 24 59 21Z"
          fill={`url(#k-leaf-${uid})`} stroke="#36563A" strokeWidth="1.5"/>
        <path d="M47 8 Q56 13 64 22" fill="none" stroke="#F8F4C9" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M91 42 Q98 27 109 24" fill="none" stroke="#493B2A" strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M109 25 C119 12 130 17 128 25 C124 36 111 37 106 31Z"
          fill={`url(#k-leaf-${uid})`} stroke="#36563A" strokeWidth="1.5"/>
        <path d="M111 29 Q119 23 125 21" fill="none" stroke="#F8F4C9" strokeWidth="1.2" strokeLinecap="round"/>
      </g>

      {/* Body turned three-quarters: one arm reaches toward a tiny forest light. */}
      <g filter={`url(#k-shadow-${uid})`}>
        <path d="M68 91 Q58 99 61 116 Q64 132 82 135 Q101 136 109 121 Q113 106 99 94Z"
          fill={`url(#k-skin-side-${uid})`} stroke="#465B4B" strokeWidth="2.2"/>
        <path d="M79 99 Q91 102 103 96 Q111 107 105 122 Q99 133 85 132 Q93 118 79 99Z"
          fill="#607A65" opacity=".52"/>
        <path d="M72 107 Q82 114 99 108" fill="none" stroke="#F7F4DF" strokeWidth="2" opacity=".58" strokeLinecap="round"/>
        {/* Far arm tucked behind the body. */}
        <path d="M99 102 Q112 103 116 113 Q119 120 113 124 Q106 125 101 116"
          fill="none" stroke="#71896E" strokeWidth="8" strokeLinecap="round"/>
        <path d="M100 103 Q111 105 114 114" fill="none" stroke="#DDE4C8" strokeWidth="1.7" opacity=".55" strokeLinecap="round"/>
        {/* Near arm lifted in a curious, gentle gesture. */}
        <path d="M67 104 Q55 109 49 101 Q44 94 48 89"
          fill="none" stroke={`url(#k-skin-${uid})`} strokeWidth="10" strokeLinecap="round"/>
        <path d="M64 105 Q54 109 49 100" fill="none" stroke="#FFFBEA" strokeWidth="2" opacity=".75" strokeLinecap="round"/>
        {/* Root-like feet, offset to sell the three-quarter pose. */}
        <path d="M76 127 Q72 137 65 138 Q60 140 61 135 Q64 130 68 125 M94 128 Q99 137 108 138 Q113 139 111 134 Q106 129 102 124"
          fill="none" stroke="#4C5F4C" strokeWidth="7" strokeLinecap="round"/>
        <path d="M72 132 Q68 137 63 137 M99 132 Q104 137 110 136" fill="none" stroke="#C5D0AE" strokeWidth="1.5" opacity=".65" strokeLinecap="round"/>
      </g>

      {/* Oversized, asymmetrical spirit head with sculpted cheeks and a mossy crown. */}
      <g filter={`url(#k-shadow-${uid})`}>
        <path d="M52 62 C51 45 63 34 80 33 C99 31 112 43 112 61 C113 79 103 96 86 99 C67 101 53 86 52 69Z"
          fill={`url(#k-skin-${uid})`} stroke="#506653" strokeWidth="2.5"/>
        <path d="M56 61 C58 46 68 38 81 37 C72 46 69 57 72 70 C74 83 81 91 91 96 C73 99 56 84 56 66Z"
          fill="#FFFDEB" opacity=".22"/>
        <path d="M89 39 Q108 44 108 63 Q109 83 94 93" fill="none" stroke="#526B59" strokeWidth="3" opacity=".5" strokeLinecap="round"/>
        <path d="M59 74 Q63 87 75 91" fill="none" stroke="#FDF8E4" strokeWidth="2.2" opacity=".65" strokeLinecap="round"/>
        {/* A soft moss mantle hugs the top and rear of the head. */}
        <path d="M53 59 Q48 49 58 43 Q61 33 73 36 Q81 27 91 34 Q103 30 108 43 Q117 49 109 61 Q102 54 96 56 Q88 48 80 55 Q69 49 62 60Z"
          fill={`url(#k-moss-${uid})`} stroke="#3C5A38" strokeWidth="2"/>
        <path d="M58 47 Q64 37 73 41 M81 38 Q89 32 96 40 M99 42 Q106 42 108 51"
          fill="none" stroke="#F0F2B6" strokeWidth="2.2" opacity=".78" strokeLinecap="round"/>
        <g fill="#D8E99A">
          <circle cx="61" cy="49" r="1.7"/><circle cx="70" cy="42" r="1.4"/>
          <circle cx="86" cy="39" r="1.6"/><circle cx="101" cy="47" r="1.5"/>
        </g>
        {/* Deep, glossy eyes with broad softbox reflections. */}
        <ellipse cx="70" cy="68" rx="5.1" ry="7.1" fill={`url(#k-eye-${uid})`} transform="rotate(-8 70 68)"/>
        <ellipse cx="94" cy="66" rx="4.5" ry="6.6" fill={`url(#k-eye-${uid})`} transform="rotate(7 94 66)"/>
        <ellipse cx="68.4" cy="65.2" rx="1.75" ry="2.35" fill="#FFFFFF" opacity=".98"/>
        <ellipse cx="92.7" cy="63.5" rx="1.55" ry="2.1" fill="#FFFFFF" opacity=".98"/>
        <circle cx="73.8" cy="72.1" r=".9" fill="#9EB8A0" opacity=".7"/>
        <circle cx="97.2" cy="70.2" r=".8" fill="#9EB8A0" opacity=".65"/>
        {/* Subtle blush and a tiny, calm mouth. */}
        <ellipse cx="61" cy="80" rx="5.8" ry="2.6" fill="#D58F82" opacity=".2" transform="rotate(-16 61 80)"/>
        <ellipse cx="103" cy="77" rx="4.8" ry="2.3" fill="#D58F82" opacity=".16" transform="rotate(-12 103 77)"/>
        <path d="M80 83 Q83 85 86 82" fill="none" stroke="#687B68" strokeWidth="1.6" strokeLinecap="round"/>
        {/* Fine organic freckles and bark-like flecks. */}
        <g fill="#81977B" opacity=".7">
          <circle cx="59" cy="67" r=".8"/><circle cx="63" cy="58" r=".65"/>
          <circle cx="101" cy="57" r=".75"/><circle cx="105" cy="70" r=".65"/>
        </g>
        <path d="M58 54 Q60 49 64 47 M101 49 Q105 53 106 57" fill="none" stroke="#FFFFFF" strokeWidth="1.3" opacity=".65" strokeLinecap="round"/>
      </g>

      {/* A floating seed-light, held just beyond the near hand. */}
      <circle cx="43" cy="80" r="13" fill={`url(#k-glow-${uid})`} filter={`url(#k-soft-${uid})`}/>
      <path d="M43 85 C35 78 39 70 45 69 C51 76 49 82 43 85Z"
        fill={`url(#k-leaf-${uid})`} stroke="#D9E7A1" strokeWidth="1"/>
      <path d="M43 83 Q44 77 45 72" fill="none" stroke="#FFF9D0" strokeWidth="1.1" strokeLinecap="round"/>
      <circle cx="34" cy="73" r="1.3" fill="#FFF2BC"/>
      <circle cx="52" cy="88" r="1" fill="#D6E99A"/>

      {/* Restrained engraved roots and directional highlights on the medallion. */}
      <path d="M34 105 Q40 111 48 112 M126 105 Q120 111 112 112 M48 122 Q56 130 66 132 M112 122 Q104 130 94 132"
        fill="none" stroke="#B6C889" strokeWidth="1.3" opacity=".48" strokeLinecap="round"/>
      <path d="M34 37 Q46 22 63 21 M97 21 Q114 22 126 37" fill="none" stroke="#FFF0C5" strokeWidth="1.8" opacity=".72" strokeLinecap="round"/>
      <path d="M27 67 Q24 78 28 89 M133 67 Q136 78 132 89" fill="none" stroke="#A8BE7D" strokeWidth="1.2" opacity=".45" strokeLinecap="round"/>
      <path d="M80 12 C67 20 55 16 46 26 C34 29 31 40 32 50 C23 61 28 73 24 84 C30 95 28 106 40 113 C47 125 60 125 69 134 L80 144 L91 134 C100 125 113 125 120 113 C132 106 130 95 136 84 C132 73 137 61 128 50 C129 40 126 29 114 26 C105 16 93 20 80 12Z"
        fill="none" stroke="#FFF2C8" strokeWidth=".8" opacity=".34"/>
    </svg>
  );
}
