"use client";

import { useId } from "react";

type FolkloreId =
  | "kodama" | "zashiki-warashi" | "akaname" | "tofu-kozo" | "azukiarai"
  | "sunekosuri" | "betobeto-san" | "amikiri" | "shiro-uneri" | "kawauso";

const PALETTES: Record<FolkloreId, { main: string; light: string; dark: string; accent: string }> = {
  kodama: { main: "#72966A", light: "#D7E8AE", dark: "#294B3A", accent: "#E8C77C" },
  "zashiki-warashi": { main: "#C96F69", light: "#F6D4B5", dark: "#653D4B", accent: "#E9BD65" },
  akaname: { main: "#B76C57", light: "#F2C59B", dark: "#563849", accent: "#8FC5B2" },
  "tofu-kozo": { main: "#D5B98B", light: "#FFF4D9", dark: "#76604A", accent: "#A5C4A0" },
  azukiarai: { main: "#668FA1", light: "#D5EEF0", dark: "#294B61", accent: "#B75F56" },
  sunekosuri: { main: "#B7A18A", light: "#F1DFC4", dark: "#665044", accent: "#D5A85F" },
  "betobeto-san": { main: "#777C91", light: "#DCE0EE", dark: "#34394F", accent: "#A9B6D4" },
  amikiri: { main: "#6E9A9A", light: "#D1E8D9", dark: "#294B50", accent: "#D98D68" },
  "shiro-uneri": { main: "#A8A7C2", light: "#F0EFF7", dark: "#4C4A69", accent: "#D5B5CF" },
  kawauso: { main: "#9C795E", light: "#EAD2AD", dark: "#4E3D39", accent: "#82B6A8" },
};

function Character({ id, level, p }: { id: FolkloreId; level: 1 | 2 | 3; p: typeof PALETTES[FolkloreId] }) {
  const eye = "#292B2C";
  const shine = "#FFFFFF";
  switch (id) {
    case "kodama":
      if (level === 1) {
        // Seedling spirit: a compact, floating forest seed with a single sprout.
        return <g>
          <path d="M64 17 C52 7 39 14 40 28 C25 29 19 43 26 55 C18 72 32 91 51 92 L77 92 C96 88 105 70 94 55 C101 40 89 28 76 29 C78 17 68 12 64 17Z" fill={p.main} stroke={p.dark} strokeWidth="3"/>
          <path d="M63 25 C49 15 48 4 54 1 C66 1 69 12 66 25 C74 10 87 9 91 16 C89 28 77 33 66 31" fill={p.light} stroke={p.dark} strokeWidth="2.5" strokeLinejoin="round"/>
          <path d="M34 59 Q45 51 56 59 M72 59 Q83 51 94 59" fill="none" stroke={p.light} strokeWidth="3" strokeLinecap="round"/>
          <ellipse cx="49" cy="62" rx="3.5" ry="5" fill={eye}/><ellipse cx="79" cy="62" rx="3.5" ry="5" fill={eye}/>
          <circle cx="50" cy="60" r="1.2" fill={shine}/><circle cx="80" cy="60" r="1.2" fill={shine}/>
          <path d="M57 74 Q64 80 71 74" fill="none" stroke={p.dark} strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M44 87 Q64 96 84 87" fill="none" stroke={p.light} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="31" cy="76" r="3" fill={p.accent}/><circle cx="97" cy="76" r="3" fill={p.accent}/>
        </g>;
      }
      if (level === 2) {
        // Root runner: the spirit has become a four-limbed, mobile sapling.
        return <g>
          <path d="M40 54 C30 40 31 28 43 24 C52 20 60 29 64 39 C69 27 81 22 89 29 C98 38 91 51 82 59 L86 78 C78 89 69 91 64 82 C58 92 45 91 39 80Z" fill={p.main} stroke={p.dark} strokeWidth="3"/>
          <path d="M43 37 Q26 18 17 27 Q18 43 39 48 M84 38 Q102 18 111 29 Q108 44 89 50" fill={p.main} stroke={p.dark} strokeWidth="3" strokeLinejoin="round"/>
          <path d="M43 76 Q28 78 23 94 Q37 99 51 84 M82 76 Q99 80 105 95 Q90 100 76 84" fill={p.dark} stroke={p.dark} strokeWidth="3" strokeLinejoin="round"/>
          <path d="M64 22 Q51 8 42 13 Q43 27 61 31 M66 23 Q79 5 91 12 Q90 27 68 32" fill={p.light} stroke={p.dark} strokeWidth="2.5" strokeLinejoin="round"/>
          <path d="M42 51 Q52 45 58 52 M70 52 Q77 45 86 51" fill="none" stroke={p.light} strokeWidth="3" strokeLinecap="round"/>
          <ellipse cx="51" cy="58" rx="3.2" ry="4.5" fill={eye}/><ellipse cx="78" cy="58" rx="3.2" ry="4.5" fill={eye}/>
          <path d="M58 68 Q64 73 70 68" fill="none" stroke={p.dark} strokeWidth="2" strokeLinecap="round"/>
          <path d="M64 39 L64 75" stroke={p.light} strokeWidth="2" opacity=".8"/>
          <g fill={p.accent}><circle cx="29" cy="58" r="3"/><circle cx="99" cy="60" r="3"/><circle cx="64" cy="15" r="3"/></g>
        </g>;
      }
      // Ancient grove spirit: a vertical living tree with a trunk-face and a crown.
      return <g>
        <path d="M64 39 C48 28 30 31 22 45 C8 44 6 60 17 69 C8 82 20 96 36 91 C43 106 56 106 64 94 C72 106 85 106 92 91 C108 96 120 82 111 69 C122 60 120 44 106 45 C98 31 80 28 64 39Z" fill={p.main} stroke={p.dark} strokeWidth="3" strokeLinejoin="round"/>
        <path d="M64 49 C54 60 51 77 54 101 L74 101 C77 77 74 60 64 49Z" fill={p.dark} stroke={p.light} strokeWidth="2"/>
        <path d="M55 64 Q47 55 39 60 M73 64 Q81 55 89 60" fill="none" stroke={p.light} strokeWidth="3" strokeLinecap="round"/>
        <ellipse cx="54" cy="70" rx="3.2" ry="4.5" fill={shine}/><ellipse cx="74" cy="70" rx="3.2" ry="4.5" fill={shine}/>
        <circle cx="55" cy="71" r="2" fill={eye}/><circle cx="75" cy="71" r="2" fill={eye}/>
        <path d="M59 82 Q64 87 69 82" fill="none" stroke={p.light} strokeWidth="2" strokeLinecap="round"/>
        <path d="M53 99 Q38 107 31 119 M75 99 Q90 107 97 119 M64 99 L64 121" fill="none" stroke={p.dark} strokeWidth="5" strokeLinecap="round"/>
        <path d="M41 43 Q26 18 15 26 M87 43 Q102 18 113 26 M64 39 Q57 14 64 5" fill="none" stroke={p.dark} strokeWidth="5" strokeLinecap="round"/>
        <path d="M18 26 Q7 15 12 7 Q26 9 29 27 M110 26 Q121 15 116 7 Q102 9 99 27 M64 10 Q52 -2 45 7 Q49 21 64 24 Q79 21 83 7 Q76 -2 64 10Z" fill={p.light} stroke={p.dark} strokeWidth="2"/>
        <g fill={p.accent}><circle cx="28" cy="54" r="4"/><circle cx="100" cy="54" r="4"/><circle cx="64" cy="32" r="3.5"/></g>
      </g>;
    case "zashiki-warashi":
      return <g>
        {level >= 2 && <path d="M29 48 Q12 24 29 17 L42 35 M99 48 Q116 24 99 17 L86 35" fill="none" stroke={p.accent} strokeWidth="5" strokeLinecap="round"/>}
        <path d={level === 1 ? "M42 46 Q64 34 86 46 L94 91 Q64 106 34 91Z" : level === 2 ? "M34 42 Q64 28 94 42 L108 96 Q64 117 20 96Z" : "M29 40 Q64 22 99 40 L116 102 Q64 126 12 102Z"} fill={p.main} stroke={p.dark} strokeWidth="3"/>
        <path d="M40 47 Q64 56 88 47 L83 65 Q64 74 45 65Z" fill={p.light} stroke={p.dark} strokeWidth="1.8"/>
        <ellipse cx="64" cy="43" rx={level === 3 ? 28 : 24} ry="27" fill={p.light} stroke={p.dark} strokeWidth="2.5"/>
        <path d="M39 34 Q43 8 64 15 Q85 8 89 34 Q77 25 64 28 Q51 25 39 34Z" fill="#28262B" stroke={p.dark} strokeWidth="2"/>
        {level >= 2 && <path d="M42 20 Q64 -1 86 20 L79 27 Q64 17 49 27Z" fill={p.accent} stroke={p.dark} strokeWidth="1.5"/>}
        <ellipse cx="55" cy="45" rx="2.8" ry="4" fill={eye}/><ellipse cx="73" cy="45" rx="2.8" ry="4" fill={eye}/>
        <path d="M60 55 Q64 59 68 55" fill="none" stroke={p.dark} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M35 77 Q64 89 93 77 M43 93 L39 108 M85 93 L89 108" fill="none" stroke={p.light} strokeWidth="3"/>
        <path d="M64 72 L72 81 L64 90 L56 81Z" fill={p.accent} stroke={p.dark} strokeWidth="1.5"/>
        {level === 3 && <><path d="M17 54 Q3 43 7 30 M111 54 Q125 43 121 30" stroke={p.accent} strokeWidth="4" fill="none" strokeLinecap="round"/><circle cx="17" cy="25" r="5" fill={p.light}/><circle cx="111" cy="25" r="5" fill={p.light}/></>}
      </g>;
    case "akaname":
      return <g>
        <path d={level === 1 ? "M34 39 Q42 18 65 25 Q91 22 94 52 L88 87 Q64 104 37 86Z" : level === 2 ? "M29 37 Q38 10 66 20 Q98 18 101 52 L94 99 Q64 117 31 97Z" : "M25 34 Q35 5 66 15 Q104 14 105 53 L99 108 Q64 128 25 106Z"} fill={p.main} stroke={p.dark} strokeWidth="3"/>
        <path d="M39 35 Q31 12 45 8 Q57 12 54 30 M77 30 Q79 8 94 10 Q103 24 88 39" fill={p.light} stroke={p.dark} strokeWidth="2.2"/>
        <ellipse cx="51" cy="52" rx="5" ry="7" fill={shine}/><ellipse cx="76" cy="52" rx="5" ry="7" fill={shine}/><circle cx="53" cy="53" r="2.8" fill={eye}/><circle cx="78" cy="53" r="2.8" fill={eye}/>
        <path d={level === 1 ? "M57 66 Q64 73 71 66 Q72 91 64 94 Q56 91 57 66Z" : level === 2 ? "M55 66 Q64 76 73 66 Q82 99 64 108 Q46 99 55 66Z" : "M53 65 Q64 77 75 65 Q90 108 64 120 Q38 108 53 65Z"} fill="#E88B88" stroke={p.dark} strokeWidth="2.2"/>
        <path d="M64 70 Q58 84 66 92" fill="none" stroke="#FFE0D0" strokeWidth="2"/>
        {level >= 2 && <><path d="M29 70 Q11 75 16 91 L35 86 M99 70 Q117 75 112 91 L93 86" fill="none" stroke={p.accent} strokeWidth="5" strokeLinecap="round"/><circle cx="25" cy="29" r="4" fill={p.accent}/><circle cx="103" cy="29" r="4" fill={p.accent}/></>}
        {level === 3 && <path d="M31 17 Q18 1 9 15 M97 17 Q110 1 119 15" fill="none" stroke={p.light} strokeWidth="4" strokeLinecap="round"/>}
      </g>;
    case "tofu-kozo":
      return <g>
        <path d={level === 1 ? "M40 45 Q64 32 88 45 L91 91 Q64 104 37 91Z" : level === 2 ? "M34 42 Q64 26 94 42 L101 98 Q64 116 27 98Z" : "M28 39 Q64 20 100 39 L110 105 Q64 128 18 105Z"} fill={p.main} stroke={p.dark} strokeWidth="3"/>
        <path d="M37 42 Q64 25 91 42 L86 59 Q64 69 42 59Z" fill={p.light} stroke={p.dark} strokeWidth="2"/>
        <ellipse cx="64" cy="42" rx="22" ry="23" fill={p.light} stroke={p.dark} strokeWidth="2.5"/>
        <path d="M43 31 Q45 11 64 15 Q83 11 85 31 Q65 24 43 31Z" fill="#4B4038"/>
        <ellipse cx="56" cy="44" rx="2.5" ry="3.5" fill={eye}/><ellipse cx="72" cy="44" rx="2.5" ry="3.5" fill={eye}/><path d="M60 53 Q64 56 68 53" stroke={p.dark} strokeWidth="1.8" fill="none"/>
        <path d="M30 68 Q17 66 17 79 Q22 88 39 82 M98 68 Q111 66 111 79 Q106 88 89 82" fill="none" stroke={p.light} strokeWidth="5" strokeLinecap="round"/>
        <path d={level === 1 ? "M42 76 L86 76 L82 91 L46 91Z" : level === 2 ? "M34 76 L94 76 L89 96 L39 96Z" : "M27 75 L101 75 L94 101 L34 101Z"} fill="#F8F1D9" stroke={p.dark} strokeWidth="2"/>
        <path d="M45 77 L64 86 L83 77" fill="none" stroke="#C7B58E" strokeWidth="1.5"/>
        {level >= 2 && <><path d="M64 10 L70 20 L64 30 L58 20Z" fill={p.accent} stroke={p.dark} strokeWidth="1.5"/><path d="M29 95 Q17 104 20 115 M99 95 Q111 104 108 115" stroke={p.accent} strokeWidth="4" fill="none" strokeLinecap="round"/></>}
        {level === 3 && <><path d="M18 40 Q7 26 16 14 L31 30 M110 40 Q121 26 112 14 L97 30" fill={p.accent} stroke={p.dark} strokeWidth="2"/><circle cx="64" cy="8" r="5" fill={p.light}/></>}
      </g>;
    case "azukiarai":
      return <g>
        <path d={level === 1 ? "M28 57 Q30 28 64 30 Q98 28 100 57 Q96 91 64 94 Q32 91 28 57Z" : level === 2 ? "M20 58 Q22 20 64 24 Q106 20 108 58 Q103 103 64 106 Q25 103 20 58Z" : "M14 59 Q17 13 64 17 Q111 13 114 59 Q108 114 64 118 Q20 114 14 59Z"} fill={p.main} stroke={p.dark} strokeWidth="3"/>
        <path d="M38 41 Q29 24 43 19 Q55 22 54 38 M74 38 Q73 22 86 19 Q100 24 90 41" fill={p.light} stroke={p.dark} strokeWidth="2"/>
        <ellipse cx="51" cy="56" rx="5" ry="7" fill={shine}/><ellipse cx="77" cy="56" rx="5" ry="7" fill={shine}/><circle cx="52" cy="57" r="3" fill={eye}/><circle cx="78" cy="57" r="3" fill={eye}/>
        <path d="M59 70 Q64 75 69 70" fill="none" stroke={p.dark} strokeWidth="2"/>
        <path d="M27 79 Q64 98 101 79" fill="none" stroke={p.light} strokeWidth="5" strokeLinecap="round"/>
        <g fill="#9D4B45" stroke="#F3C6A2" strokeWidth="1">{Array.from({length: level === 1 ? 3 : level === 2 ? 5 : 7},(_,i)=><ellipse key={i} cx={43+(i%4)*12} cy={83+Math.floor(i/4)*9} rx="3.5" ry="2.5"/>)}</g>
        {level >= 2 && <><path d="M25 65 Q7 69 12 86 M103 65 Q121 69 116 86" fill="none" stroke={p.accent} strokeWidth="4" strokeLinecap="round"/><path d="M64 14 Q51 2 43 11 M64 14 Q77 2 85 11" fill="none" stroke={p.light} strokeWidth="4"/></>}
        {level === 3 && <><path d="M17 37 Q3 19 13 8 Q31 13 30 35 M111 37 Q125 19 115 8 Q97 13 98 35" fill={p.accent} stroke={p.dark} strokeWidth="2"/><path d="M20 104 Q64 126 108 104" fill="none" stroke={p.light} strokeWidth="4"/></>}
      </g>;
    case "sunekosuri":
      return <g>
        <path d={level === 1 ? "M18 66 Q16 40 40 42 Q50 27 73 39 Q99 34 105 60 Q111 84 85 91 Q49 103 23 86Z" : level === 2 ? "M11 67 Q9 34 39 37 Q50 17 78 34 Q111 29 116 60 Q122 91 89 101 Q46 112 17 91Z" : "M6 68 Q4 28 38 31 Q51 8 82 29 Q119 24 122 60 Q128 99 91 109 Q43 120 12 96Z"} fill={p.main} stroke={p.dark} strokeWidth="3"/>
        <path d="M30 49 Q21 29 34 22 Q49 22 48 43 M77 39 Q79 20 94 22 Q108 33 94 50" fill={p.light} stroke={p.dark} strokeWidth="2"/>
        <ellipse cx="48" cy="61" rx="5" ry="6" fill={shine}/><ellipse cx="75" cy="60" rx="5" ry="6" fill={shine}/><circle cx="49" cy="62" r="2.8" fill={eye}/><circle cx="76" cy="61" r="2.8" fill={eye}/>
        <ellipse cx="62" cy="73" rx="12" ry="8" fill={p.light}/><path d="M57 72 Q62 77 67 72" fill="none" stroke={p.dark} strokeWidth="1.8"/>
        <path d="M24 83 Q14 94 8 88 M91 86 Q107 99 116 89" fill="none" stroke={p.dark} strokeWidth="5" strokeLinecap="round"/>
        {level >= 2 && <><path d="M36 39 Q26 11 49 9 Q63 16 57 38 M77 36 Q83 9 103 16 Q111 31 92 43" fill={p.accent} stroke={p.dark} strokeWidth="2"/><path d="M15 55 Q2 49 5 38 M111 54 Q124 48 121 37" stroke={p.light} strokeWidth="3" fill="none"/></>}
        {level === 3 && <><path d="M30 30 Q15 2 41 2 Q61 9 57 31 M80 30 Q85 2 107 8 Q117 25 94 36" fill={p.light} stroke={p.dark} strokeWidth="2.5"/><circle cx="64" cy="14" r="6" fill={p.accent}/></>}
      </g>;
    case "betobeto-san":
      return <g>
        <path d={level === 1 ? "M49 20 Q59 11 69 20 L74 48 Q92 62 83 85 Q75 101 54 91 Q34 80 45 60 L54 47Z" : level === 2 ? "M45 13 Q59 1 73 13 L78 48 Q104 65 90 94 Q77 116 51 99 Q26 83 42 57 L52 45Z" : "M40 7 Q59 -3 78 7 L83 47 Q116 66 98 103 Q80 129 48 108 Q17 87 37 55 L48 42Z"} fill={p.main} stroke={p.dark} strokeWidth="3"/>
        <path d="M54 22 Q63 16 68 24 L69 47 L55 47Z" fill={p.light}/>
        <ellipse cx="55" cy="60" rx="4" ry="6" fill={shine}/><ellipse cx="73" cy="60" rx="4" ry="6" fill={shine}/><circle cx="56" cy="61" r="2.5" fill={eye}/><circle cx="74" cy="61" r="2.5" fill={eye}/>
        <path d="M58 76 Q64 81 70 76" stroke={p.light} strokeWidth="2" fill="none"/>
        <path d="M48 88 Q64 100 80 88" fill="none" stroke={p.accent} strokeWidth="3"/>
        {level >= 2 && <><path d="M27 45 Q8 40 9 57 Q16 69 39 64 M101 45 Q120 40 119 57 Q112 69 89 64" fill="none" stroke={p.accent} strokeWidth="4" strokeLinecap="round"/><circle cx="64" cy="10" r="5" fill={p.light}/></>}
        {level === 3 && <><path d="M25 30 Q8 11 19 3 Q38 6 43 28 M103 30 Q120 11 109 3 Q90 6 85 28" fill={p.light} stroke={p.dark} strokeWidth="2"/><path d="M16 83 Q5 101 18 112 M112 83 Q123 101 110 112" fill="none" stroke={p.accent} strokeWidth="4"/></>}
      </g>;
    case "amikiri":
      return <g>
        <path d={level === 1 ? "M33 45 Q64 25 95 45 L89 81 Q64 101 39 81Z" : level === 2 ? "M27 42 Q64 15 101 42 L96 91 Q64 115 32 91Z" : "M21 38 Q64 7 107 38 L103 99 Q64 128 25 99Z"} fill={p.main} stroke={p.dark} strokeWidth="3"/>
        <path d="M39 48 Q23 27 12 39 Q9 53 34 62 M89 48 Q105 27 116 39 Q119 53 94 62" fill="none" stroke={p.accent} strokeWidth={level === 1 ? 7 : 9} strokeLinecap="round"/>
        <path d="M12 39 Q3 26 14 18 Q26 18 25 34 M116 39 Q125 26 114 18 Q102 18 103 34" fill={p.light} stroke={p.dark} strokeWidth="2"/>
        <path d="M45 65 Q54 57 61 65 M67 65 Q74 57 83 65" fill="none" stroke={p.light} strokeWidth="4" strokeLinecap="round"/>
        <circle cx="53" cy="65" r="3" fill={eye}/><circle cx="75" cy="65" r="3" fill={eye}/>
        <path d="M56 78 Q64 84 72 78" fill="none" stroke={p.dark} strokeWidth="2"/>
        <path d="M42 86 L34 99 M54 91 L50 105 M74 91 L78 105 M86 86 L94 99" stroke={p.dark} strokeWidth="4" strokeLinecap="round"/>
        {level >= 2 && <><path d="M32 30 L20 10 L39 18 M96 30 L108 10 L89 18" fill={p.light} stroke={p.dark} strokeWidth="2"/><path d="M64 23 L64 7" stroke={p.accent} strokeWidth="4" strokeLinecap="round"/></>}
        {level === 3 && <><path d="M15 65 Q0 55 4 39 M113 65 Q128 55 124 39" fill="none" stroke={p.light} strokeWidth="5" strokeLinecap="round"/><path d="M64 8 L71 19 L64 30 L57 19Z" fill={p.accent} stroke={p.dark} strokeWidth="2"/></>}
      </g>;
    case "shiro-uneri":
      return <g>
        <path d={level === 1 ? "M19 67 Q8 46 29 37 Q44 31 53 43 Q66 19 85 34 Q108 46 91 65 Q107 81 85 91 Q60 103 48 83 Q28 99 16 82Z" : level === 2 ? "M12 68 Q0 39 27 29 Q48 23 56 40 Q71 10 94 29 Q119 45 98 68 Q121 91 91 103 Q60 117 45 91 Q20 111 9 87Z" : "M7 70 Q-4 35 25 23 Q49 17 59 37 Q76 2 101 24 Q130 43 105 70 Q132 99 95 114 Q57 130 40 98 Q12 121 2 91Z"} fill={p.main} stroke={p.dark} strokeWidth="3"/>
        <path d="M25 55 Q41 39 56 54 Q71 29 91 48 Q104 62 83 76 Q61 91 46 72 Q28 89 18 72Z" fill={p.light} stroke={p.dark} strokeWidth="2"/>
        <ellipse cx="50" cy="59" rx="4" ry="6" fill={eye}/><ellipse cx="77" cy="55" rx="4" ry="6" fill={eye}/>
        <path d="M58 69 Q64 75 70 68" fill="none" stroke={p.dark} strokeWidth="2"/>
        <path d="M28 43 Q17 28 31 20 M92 38 Q108 20 113 35" fill="none" stroke={p.accent} strokeWidth="3" strokeLinecap="round"/>
        {level >= 2 && <><path d="M24 91 Q5 103 14 117 M92 92 Q116 104 111 119" fill="none" stroke={p.light} strokeWidth="5" strokeLinecap="round"/><path d="M64 17 Q54 3 64 0 Q74 3 64 17Z" fill={p.accent}/></>}
        {level === 3 && <><path d="M20 30 Q1 10 16 2 Q35 8 39 25 M108 29 Q127 9 112 1 Q93 7 89 24" fill={p.light} stroke={p.dark} strokeWidth="2"/><path d="M64 3 L70 14 L64 25 L58 14Z" fill={p.accent} stroke={p.dark} strokeWidth="1.5"/></>}
      </g>;
    case "kawauso":
      return <g>
        <path d={level === 1 ? "M28 48 Q23 23 45 22 L54 35 Q72 22 88 36 Q106 52 91 82 Q76 102 48 90 Q23 80 28 48Z" : level === 2 ? "M22 48 Q15 16 44 15 L55 32 Q78 13 96 34 Q118 55 97 91 Q77 115 43 96 Q15 84 22 48Z" : "M16 47 Q7 9 43 8 L56 29 Q82 7 104 31 Q130 57 103 100 Q77 128 38 102 Q7 86 16 47Z"} fill={p.main} stroke={p.dark} strokeWidth="3"/>
        <path d="M37 34 Q26 11 42 8 Q56 10 54 31 M78 30 Q81 8 98 13 Q109 28 91 41" fill={p.light} stroke={p.dark} strokeWidth="2"/>
        <path d="M38 59 Q64 45 89 59 Q84 84 64 85 Q44 84 38 59Z" fill={p.light} stroke={p.dark} strokeWidth="1.8"/>
        <ellipse cx="51" cy="52" rx="4" ry="5" fill={eye}/><ellipse cx="77" cy="52" rx="4" ry="5" fill={eye}/>
        <ellipse cx="64" cy="66" rx="4" ry="3" fill={p.dark}/><path d="M58 73 Q64 78 70 73" fill="none" stroke={p.dark} strokeWidth="1.8"/>
        <path d="M29 77 Q12 88 7 75 M91 79 Q108 91 119 77" fill="none" stroke={p.dark} strokeWidth="5" strokeLinecap="round"/>
        {level >= 2 && <><path d="M24 41 Q5 27 9 12 M104 40 Q123 26 119 11" fill="none" stroke={p.accent} strokeWidth="4" strokeLinecap="round"/><path d="M45 92 Q64 107 83 92" fill="none" stroke={p.light} strokeWidth="4"/></>}
        {level === 3 && <><path d="M12 59 Q-2 40 8 25 Q26 32 28 52 M116 58 Q130 39 120 24 Q102 31 100 51" fill={p.accent} stroke={p.dark} strokeWidth="2"/><path d="M64 8 Q52 -4 44 7 Q53 21 64 18 Q75 21 84 7 Q76 -4 64 8Z" fill={p.light} stroke={p.dark} strokeWidth="2"/></>}
      </g>;
  }
}


function KodamaMedallion({ level, size }: { level: 1 | 2 | 3; size: number }) {
  const uid = useId().replace(/:/g, "");
  const metal = "kodama-metal-" + uid;
  const bark = "kodama-bark-" + uid;
  const spirit = "kodama-spirit-" + uid;
  const foliage = "kodama-foliage-" + uid;
  const glow = "kodama-glow-" + uid;

  // The badge silhouette grows from a seedling to a full ancient forest tree.
  // It is deliberately not a generic circular medallion.
  const silhouette = level === 1
    ? "M64 5 C75 12 83 18 82 29 C96 22 107 33 103 46 C117 52 112 68 101 73 C108 87 97 98 84 94 C79 108 67 113 58 103 C46 112 33 105 34 93 C19 98 10 86 20 74 C7 66 12 51 25 47 C20 34 32 23 45 29 C44 17 53 8 64 5Z"
    : level === 2
    ? "M64 3 C77 13 86 20 83 33 C98 22 113 34 106 49 C121 58 113 75 100 79 C109 95 94 108 79 99 C75 116 59 122 49 108 C34 119 18 105 25 89 C8 84 9 66 24 57 C14 42 27 27 43 34 C43 17 54 8 64 3Z"
    : "M64 2 C77 13 91 18 84 36 C101 20 118 34 108 52 C126 63 115 82 99 83 C111 102 92 116 76 103 C72 123 53 128 43 110 C23 122 8 103 24 87 C4 78 10 57 28 53 C15 35 33 20 49 34 C46 16 54 7 64 2Z";

  const inner = level === 1
    ? "M64 13 C73 20 78 25 76 37 C91 29 99 39 95 50 C106 57 101 68 91 72 C97 83 87 91 77 87 C72 99 63 103 56 94 C46 101 37 94 39 84 C27 89 19 80 27 70 C17 63 22 53 33 50 C29 40 38 33 49 38 C48 25 56 17 64 13Z"
    : level === 2
    ? "M64 11 C76 20 80 27 77 41 C92 30 104 41 98 54 C111 63 103 75 91 78 C99 91 87 100 75 92 C70 106 57 110 49 96 C37 106 27 94 34 81 C20 77 21 63 35 56 C26 44 38 34 51 42 C50 27 57 17 64 11Z"
    : "M64 10 C77 21 84 28 76 45 C94 29 108 43 98 59 C113 69 102 84 87 82 C98 99 82 108 69 95 C65 113 51 116 43 98 C27 109 17 92 34 76 C17 69 26 51 42 56 C30 39 44 29 57 44 C54 28 58 17 64 10Z";

  return (
    <svg viewBox="0 0 128 128" width={size} height={size} role="img"
      aria-label={"Kodama, Common, Level " + level}
      className="shrink-0 overflow-visible drop-shadow-[0_7px_11px_rgba(0,0,0,0.5)]">
      <defs>
        <linearGradient id={metal} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFF9E8"/><stop offset=".3" stopColor="#D8E1C9"/><stop offset=".62" stopColor="#71866A"/><stop offset=".84" stopColor="#F2EBD2"/><stop offset="1" stopColor="#405B43"/>
        </linearGradient>
        <linearGradient id={bark} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#A77B50"/><stop offset=".48" stopColor="#6E513B"/><stop offset="1" stopColor="#3D392D"/>
        </linearGradient>
        <linearGradient id={spirit} x1=".2" y1="0" x2=".8" y2="1">
          <stop stopColor="#FFFDF0"/><stop offset=".58" stopColor="#E9E7C9"/><stop offset="1" stopColor="#B9C99A"/>
        </linearGradient>
        <linearGradient id={foliage} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#E5F2B7"/><stop offset=".45" stopColor="#91B96D"/><stop offset="1" stopColor="#315D3E"/>
        </linearGradient>
        <radialGradient id={glow}>
          <stop stopColor="#D8F4A8" stopOpacity=".55"/><stop offset="1" stopColor="#D8F4A8" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* A living-tree outline: leaf canopy above, trunk and roots below. */}
      <ellipse cx="64" cy="61" rx={level === 1 ? 43 : level === 2 ? 52 : 59} ry={level === 1 ? 48 : 57} fill={"url(#" + glow + ")"}/>
      <path d={silhouette} fill={"url(#" + metal + ")"} stroke="#344D37" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d={inner} fill="#244B37" stroke="#F0F0D9" strokeWidth="1.7" strokeLinejoin="round"/>

      {/* Enamel leaf clusters are part of the tree silhouette, not a detached frame. */}
      <g fill={"url(#" + foliage + ")"} stroke="#345D3D" strokeWidth="1.8" strokeLinejoin="round">
        {level === 1 ? (
          <>
            <path d="M39 42 C22 40 20 27 28 22 C41 22 46 31 43 42Z"/>
            <path d="M83 39 C86 23 101 20 106 29 C104 42 94 47 83 39Z"/>
          </>
        ) : level === 2 ? (
          <>
            <path d="M35 48 C13 47 12 30 23 24 C39 25 45 36 35 48Z"/>
            <path d="M88 45 C91 25 108 22 115 33 C112 49 101 54 88 45Z"/>
            <path d="M64 23 C48 15 51 5 64 5 C77 7 79 17 64 23Z"/>
          </>
        ) : (
          <>
            <path d="M29 48 C8 45 7 26 20 20 C37 24 41 38 29 48Z"/>
            <path d="M98 46 C101 24 119 19 124 33 C121 49 110 55 98 46Z"/>
            <path d="M64 25 C43 17 45 3 63 3 C82 5 84 18 64 25Z"/>
            <path d="M45 31 C34 15 42 5 54 10 C61 22 55 30 45 31Z"/>
            <path d="M82 31 C93 15 85 5 73 10 C66 22 72 30 82 31Z"/>
          </>
        )}
      </g>

      {/* Branch and root details make the lower silhouette read as a tree. */}
      <path d={level === 1 ? "M64 89 Q64 98 57 105 M64 96 Q70 101 75 105" : level === 2 ? "M64 83 Q64 99 48 112 M64 96 Q78 108 84 114 M64 102 L64 117" : "M64 77 Q64 101 39 119 M64 94 Q87 111 94 121 M64 103 L64 124 M47 111 Q31 111 24 121 M82 111 Q99 109 106 120"}
        fill="none" stroke={"url(#" + bark + ")"} strokeWidth={level === 1 ? 3.5 : level === 2 ? 4.5 : 5.2} strokeLinecap="round"/>
      <path d={level === 1 ? "M64 91 Q59 97 54 98 M64 98 Q69 101 73 101" : level === 2 ? "M48 111 Q42 112 38 118 M84 113 Q90 114 94 119" : "M39 119 Q30 119 25 125 M94 121 Q103 121 108 126 M64 116 Q57 121 55 126"}
        fill="none" stroke="#C59A65" strokeWidth="1.5" strokeLinecap="round"/>

      {level === 1 ? (
        <g>
          {/* A shy forest wisp emerging from a tiny seed pod. */}
          <path d="M64 39 C51 31 38 39 39 53 C29 62 36 79 49 82 C52 92 75 94 80 82 C94 77 97 61 87 53 C89 39 76 32 64 39Z"
            fill={"url(#" + spirit + ")"} stroke="#657B55" strokeWidth="2.3"/>
          <path d="M63 43 C49 31 49 18 57 14 C69 17 72 29 66 43 C76 29 88 29 93 38 C90 49 77 53 66 49Z"
            fill={"url(#" + foliage + ")"} stroke="#456B43" strokeWidth="2"/>
          <path d="M61 40 Q58 26 59 19" fill="none" stroke="#F8F8D9" strokeWidth="1.8" strokeLinecap="round"/>
          <ellipse cx="54" cy="62" rx="2.8" ry="4" fill="#303B32"/><ellipse cx="74" cy="62" rx="2.8" ry="4" fill="#303B32"/>
          <circle cx="55" cy="61" r="1" fill="#FFFFFF"/><circle cx="75" cy="61" r="1" fill="#FFFFFF"/>
          <ellipse cx="46" cy="71" rx="4.5" ry="2.5" fill="#E9A29A" opacity=".45"/><ellipse cx="82" cy="71" rx="4.5" ry="2.5" fill="#E9A29A" opacity=".45"/>
          <path d="M59 74 Q64 79 69 74" fill="none" stroke="#94765D" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M49 83 Q43 91 37 88 M79 83 Q85 91 91 88" fill="none" stroke="#D0DEA5" strokeWidth="3.6" strokeLinecap="round"/>
          <path d="M53 86 Q64 92 75 86" fill="none" stroke="#C5A77A" strokeWidth="2" strokeLinecap="round"/>
        </g>
      ) : level === 2 ? (
        <g>
          {/* The wisp has become a young tree guardian with a trunk-like body. */}
          <path d="M64 42 C50 31 36 39 38 53 C25 62 33 81 49 83 C51 95 77 96 80 83 C96 78 101 60 88 52 C90 39 76 31 64 42Z"
            fill={"url(#" + spirit + ")"} stroke="#657B55" strokeWidth="2.4"/>
          <path d="M64 48 C51 55 50 70 54 91 L74 91 C78 69 76 55 64 48Z"
            fill={"url(#" + bark + ")"} stroke="#E6D5AD" strokeWidth="1.8"/>
          <path d="M44 58 Q31 53 27 67 Q29 77 45 78 M84 58 Q97 53 101 67 Q99 77 83 78"
            fill="none" stroke="#8FB76D" strokeWidth="6" strokeLinecap="round"/>
          <path d="M64 49 Q50 35 48 27 M64 49 Q79 34 82 27" fill="none" stroke="#765B3D" strokeWidth="4.2" strokeLinecap="round"/>
          <ellipse cx="54" cy="63" rx="2.8" ry="4" fill="#303B32"/><ellipse cx="74" cy="63" rx="2.8" ry="4" fill="#303B32"/>
          <circle cx="55" cy="62" r="1" fill="#FFFFFF"/><circle cx="75" cy="62" r="1" fill="#FFFFFF"/>
          <path d="M59 74 Q64 79 69 74" fill="none" stroke="#94765D" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M64 82 L64 91" stroke="#E5D5B2" strokeWidth="1.8"/>
          <path d="M64 82l5 5-5 5-5-5Z" fill="#D8B96D" stroke="#8B7043" strokeWidth="1.1"/>
        </g>
      ) : (
        <g>
          {/* An elder Kodama: broad canopy, expressive face, and a mature trunk. */}
          <path d="M64 38 C49 25 32 35 36 51 C20 62 29 82 47 83 C50 98 78 99 81 83 C100 78 106 59 90 50 C94 34 77 25 64 38Z"
            fill={"url(#" + spirit + ")"} stroke="#657B55" strokeWidth="2.5"/>
          <path d="M64 47 C51 55 49 74 53 96 L75 96 C79 73 76 55 64 47Z"
            fill={"url(#" + bark + ")"} stroke="#E9D8B3" strokeWidth="2"/>
          <path d="M49 57 Q56 51 60 57 M68 57 Q75 51 81 57" fill="none" stroke="#F7F0D8" strokeWidth="2.3" strokeLinecap="round"/>
          <ellipse cx="55" cy="65" rx="3" ry="4.1" fill="#FFF9E9"/><ellipse cx="73" cy="65" rx="3" ry="4.1" fill="#FFF9E9"/>
          <circle cx="56" cy="65" r="1.6" fill="#344336"/><circle cx="74" cy="65" r="1.6" fill="#344336"/>
          <path d="M59 77 Q64 82 69 77" fill="none" stroke="#F0DDB5" strokeWidth="2" strokeLinecap="round"/>
          <path d="M64 43 Q51 26 42 25 M64 43 Q77 26 87 25" fill="none" stroke="#765B3D" strokeWidth="5" strokeLinecap="round"/>
          <path d="M42 25 Q28 12 22 22 Q27 37 48 39 M87 25 Q101 12 106 22 Q101 37 81 39"
            fill={"url(#" + foliage + ")"} stroke="#456B43" strokeWidth="2"/>
          <path d="M42 88 Q31 99 24 108 M86 88 Q97 99 104 108" fill="none" stroke="#987452" strokeWidth="5" strokeLinecap="round"/>
          <g fill="#F4D995"><circle cx="30" cy="63" r="2.8"/><circle cx="98" cy="63" r="2.8"/></g>
          <path d="M64 31l3 6 6 2-6 3-3 6-3-6-6-3 6-2Z" fill="#F4D995" stroke="#FFF2CB" strokeWidth=".8"/>
        </g>
      )}

      {/* Small firefly glints; the face and tree-spirit silhouette stay unobstructed. */}
      <g fill="#F8E7A7">
        <circle cx="24" cy="57" r="1.8"/><circle cx="104" cy="59" r="1.8"/>
        {level === 3 && <><circle cx="34" cy="88" r="1.6"/><circle cx="94" cy="88" r="1.6"/></>}
      </g>
      <path d="M64 13 Q69 17 68 23" fill="none" stroke="#FFFFFF" strokeWidth="1.4" opacity=".7" strokeLinecap="round"/>
    </svg>
  );
}
export default function GachaFolkloreArtwork({ id, level, size = 76 }: { id: FolkloreId; level: 1 | 2 | 3; size?: number }) {
  const uid = useId().replace(/:/g, "");
  const p = PALETTES[id];
  if (id === "kodama") return <KodamaMedallion level={level} size={size} />;
  const gradient = `folklore-bg-${uid}`;
  const rim = `folklore-rim-${uid}`;
  return (
    <svg viewBox="0 0 128 128" width={size} height={size} role="img" aria-label={`${id}, Level ${level}`} className="shrink-0 overflow-visible drop-shadow-[0_7px_11px_rgba(0,0,0,0.42)]">
      <defs>
        <radialGradient id={gradient}><stop stopColor={p.light} stopOpacity=".32"/><stop offset="1" stopColor={p.dark} stopOpacity="0"/></radialGradient>
        <linearGradient id={rim} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFF8E5"/><stop offset=".42" stopColor={p.accent}/><stop offset="1" stopColor={p.dark}/></linearGradient>
      </defs>
      <circle cx="64" cy="64" r={level === 1 ? 58 : level === 2 ? 61 : 63} fill={`url(#${gradient})`}/>
      {level >= 2 && <circle cx="64" cy="64" r="57" fill="none" stroke={p.light} strokeWidth="1.5" strokeDasharray={level === 2 ? "3 5" : "1.5 3"} opacity=".8"/>}
      {level === 3 && <circle cx="64" cy="64" r="51" fill="none" stroke={p.accent} strokeWidth="1.5" opacity=".85"/>}
      <path d={level === 1 ? "M64 7 L70 15 L82 12 L86 23 L98 27 L96 40 L108 48 L103 60 L111 72 L101 82 L101 96 L86 99 L78 111 L64 105 L50 111 L42 99 L27 96 L27 82 L17 72 L25 60 L20 48 L32 40 L30 27 L42 23 L46 12 L58 15Z" : level === 2 ? "M64 3 L73 14 L89 9 L94 25 L110 32 L105 48 L119 61 L109 75 L112 92 L94 99 L84 116 L64 108 L44 116 L34 99 L16 92 L19 75 L9 61 L23 48 L18 32 L34 25 L39 9 L55 14Z" : "M64 1 L76 13 L94 6 L100 25 L119 34 L112 53 L126 67 L113 83 L116 103 L95 108 L83 126 L64 116 L45 126 L33 108 L12 103 L15 83 L2 67 L16 53 L9 34 L28 25 L34 6 L52 13Z"} fill="#171B1B" stroke={`url(#${rim})`} strokeWidth={level === 1 ? 3 : 3.5} strokeLinejoin="round"/>
      <path d={level === 1 ? "M64 12 L72 21 L86 18 L90 30 L102 37 L96 51 L105 64 L96 77 L96 91 L81 94 L74 105 L64 99 L54 105 L47 94 L32 91 L32 77 L23 64 L32 51 L26 37 L38 30 L42 18 L56 21Z" : level === 2 ? "M64 9 L74 21 L88 16 L94 32 L107 39 L101 54 L112 65 L101 80 L104 93 L88 99 L79 108 L64 102 L49 108 L40 99 L24 93 L27 80 L16 65 L27 54 L21 39 L34 32 L40 16 L54 21Z" : "M64 7 L77 19 L91 13 L98 30 L112 39 L105 55 L117 68 L104 83 L107 98 L89 104 L80 116 L64 108 L48 116 L39 104 L21 98 L24 83 L11 68 L23 55 L16 39 L30 30 L37 13 L51 19Z"} fill={p.dark} stroke={p.light} strokeWidth="1.4" strokeLinejoin="round"/>
      <Character id={id} level={level} p={p}/>
      {level >= 2 && <g fill={p.accent}><path d="M64 5 L67 12 L74 15 L67 18 L64 25 L61 18 L54 15 L61 12Z"/><circle cx="17" cy="64" r="2.5"/><circle cx="111" cy="64" r="2.5"/></g>}
      {level === 3 && <g fill={p.light}><path d="M14 23 L17 30 L24 33 L17 36 L14 43 L11 36 L4 33 L11 30Z"/><path d="M114 23 L117 30 L124 33 L117 36 L114 43 L111 36 L104 33 L111 30Z"/><circle cx="64" cy="119" r="3"/></g>}
    </svg>
  );
}
