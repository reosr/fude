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
  const enamel = "kodama-enamel-" + uid;
  const skin = "kodama-skin-" + uid;
  const leaf = "kodama-leaf-" + uid;
  const wood = "kodama-wood-" + uid;

  return (
    <svg viewBox="0 0 128 128" width={size} height={size} role="img"
      aria-label={"Kodama, Common, Level " + level}
      className="shrink-0 overflow-visible drop-shadow-[0_6px_9px_rgba(0,0,0,0.42)]">
      <defs>
        <linearGradient id={metal} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFFBEA"/><stop offset=".35" stopColor="#D9E4C8"/><stop offset=".7" stopColor="#829A75"/><stop offset="1" stopColor="#405B43"/>
        </linearGradient>
        <linearGradient id={enamel} x1="0" y1="0" x2=".2" y2="1">
          <stop stopColor={level === 1 ? "#D5B978" : level === 2 ? "#9BC17A" : "#789B65"}/><stop offset=".5" stopColor={level === 1 ? "#8D9B58" : level === 2 ? "#527C4D" : "#385D43"}/><stop offset="1" stopColor={level === 1 ? "#4F6240" : level === 2 ? "#294C39" : "#203D32"}/>
        </linearGradient>
        <linearGradient id={skin} x1=".15" y1="0" x2=".8" y2="1">
          <stop stopColor={level === 1 ? "#FFF3D5" : "#FFFDF0"}/><stop offset=".65" stopColor={level === 1 ? "#EAD9AE" : "#E9E8CD"}/><stop offset="1" stopColor={level === 1 ? "#C8B77F" : "#C9D3A9"}/>
        </linearGradient>
        <linearGradient id={leaf} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={level === 1 ? "#F0D99A" : level === 2 ? "#D4E9A3" : "#E8F4B8"}/><stop offset=".48" stopColor={level === 1 ? "#A8B96B" : level === 2 ? "#A6CA76" : "#91B66C"}/><stop offset="1" stopColor={level === 1 ? "#657B45" : "#47774A"}/>
        </linearGradient>
        <linearGradient id={wood} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#A77A4F"/><stop offset=".55" stopColor="#76543A"/><stop offset="1" stopColor="#493C2D"/>
        </linearGradient>
      </defs>

      {/* The badge silhouette evolves with the spirit: split seed, young tree, ancient grove. */}
      {level === 1 ? (
        <g>
          {/* Split seed shell: compact, tapered, and visibly open at the crown. */}
          <path d="M64 5 C53 13 39 12 29 25 C17 41 22 58 29 73 C34 87 46 101 58 113 L64 105 L70 113 C82 101 94 87 99 73 C106 58 111 41 99 25 C89 12 75 13 64 5Z"
            fill={"url(#" + metal + ")"} stroke="#38553D" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M64 13 C53 22 42 20 34 31 C25 43 30 59 36 72 C42 86 52 97 61 105 L64 96 L67 105 C76 97 86 86 92 72 C98 59 103 43 94 31 C86 20 75 22 64 13Z"
            fill={"url(#" + enamel + ")"} stroke="#F2F0D9" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M63 14 Q50 24 47 40 Q43 56 54 72 M65 14 Q78 24 81 40 Q85 56 74 72"
            fill="none" stroke="#E8C987" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M34 77 Q43 88 56 98 M94 77 Q85 88 72 98" fill="none" stroke="#765638" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M42 33 Q31 25 25 31 M86 33 Q97 25 103 31" fill="none" stroke="#FFF4D4" strokeWidth="2" opacity=".8" strokeLinecap="round"/>
          <path d="M64 12 Q57 4 58 0 M64 12 Q72 1 79 4" fill="none" stroke="#527A49" strokeWidth="3" strokeLinecap="round"/>
          <path d="M57 6 Q47 -1 43 7 Q49 16 62 14 M72 7 Q81 -1 87 6 Q82 16 66 14Z"
            fill={"url(#" + leaf + ")"} stroke="#456B43" strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M64 5 Q64 10 64 15" stroke="#F7F8DC" strokeWidth="1.2" fill="none"/>
          <g fill="#F5DEA0" stroke="#8A7048" strokeWidth=".8"><circle cx="37" cy="62" r="2.2"/><circle cx="91" cy="62" r="2.2"/><circle cx="47" cy="88" r="1.6"/><circle cx="81" cy="88" r="1.6"/></g>
        </g>
      ) : level === 2 ? (
        <g>
          {/* Sapling crest: a rising trunk, branching crown, and exposed young roots. */}
          <path d="M64 4 C53 13 40 10 31 22 C20 36 25 50 15 60 C23 68 21 83 34 91 C40 105 53 110 64 120 C75 110 88 105 94 91 C107 83 105 68 113 60 C103 50 108 36 97 22 C88 10 75 13 64 4Z"
            fill={"url(#" + metal + ")"} stroke="#38553D" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M64 12 C53 20 43 18 35 28 C27 39 33 52 23 61 C31 69 29 81 40 88 C47 100 56 106 64 113 C72 106 81 100 88 88 C99 81 97 69 105 61 C95 52 101 39 93 28 C85 18 75 20 64 12Z"
            fill={"url(#" + enamel + ")"} stroke="#EAF0D5" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M64 104 C58 91 59 76 64 62 C69 76 70 91 64 104Z" fill={"url(#" + wood + ")"} stroke="#DCC69A" strokeWidth="1.4"/>
          <path d="M64 67 C53 51 40 47 31 50 M64 67 C75 51 88 47 97 50 M64 52 C57 38 50 32 42 29 M64 52 C71 38 78 32 86 29"
            fill="none" stroke="#76563B" strokeWidth="4" strokeLinecap="round"/>
          <path d="M31 50 Q19 39 22 30 Q36 29 42 43 Q38 52 31 50Z M97 50 Q109 39 106 30 Q92 29 86 43 Q90 52 97 50Z M42 29 Q35 17 44 12 Q57 16 55 34Z M86 29 Q93 17 84 12 Q71 16 73 34Z"
            fill={"url(#" + leaf + ")"} stroke="#456B43" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M64 102 Q51 108 43 116 M64 102 Q77 108 85 116 M64 103 L64 119"
            fill="none" stroke="#76563B" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M29 73 Q39 67 46 74 M99 73 Q89 67 82 74" fill="none" stroke="#C8DC91" strokeWidth="2" strokeLinecap="round"/>
          <g fill="#F5DEA0"><circle cx="31" cy="58" r="2.2"/><circle cx="97" cy="58" r="2.2"/><circle cx="44" cy="91" r="1.8"/><circle cx="84" cy="91" r="1.8"/></g>
        </g>
      ) : (
        <g>
          {/* Ancient grove crest: broad old canopy, layered boughs, and a powerful root base. */}
          <path d="M64 3 C53 13 42 7 32 15 C18 25 20 39 8 47 C16 59 7 72 17 82 C13 97 29 105 43 103 C49 115 58 117 64 125 C70 117 79 115 85 103 C99 105 115 97 111 82 C121 72 112 59 120 47 C108 39 110 25 96 15 C86 7 75 13 64 3Z"
            fill={"url(#" + metal + ")"} stroke="#304D37" strokeWidth="3.2" strokeLinejoin="round"/>
          <path d="M64 11 C53 20 44 14 35 22 C24 31 27 42 16 49 C25 59 17 71 25 80 C22 92 35 99 48 96 C53 108 59 111 64 118 C69 111 75 108 80 96 C93 99 106 92 103 80 C111 71 103 59 112 49 C101 42 104 31 93 22 C84 14 75 20 64 11Z"
            fill={"url(#" + enamel + ")"} stroke="#EAF0D5" strokeWidth="1.9" strokeLinejoin="round"/>
          <path d="M64 109 C53 92 53 70 64 49 C75 70 75 92 64 109Z" fill={"url(#" + wood + ")"} stroke="#E3D0A7" strokeWidth="1.7"/>
          <path d="M64 65 C48 48 31 44 18 51 M64 65 C80 48 97 44 110 51 M64 48 C54 31 42 25 31 29 M64 48 C74 31 86 25 97 29 M64 37 L64 17"
            fill="none" stroke="#624832" strokeWidth="5" strokeLinecap="round"/>
          <path d="M18 51 Q3 38 11 25 Q29 22 37 43 Q31 54 18 51Z M110 51 Q125 38 117 25 Q99 22 91 43 Q97 54 110 51Z M31 29 Q18 12 32 7 Q50 10 49 34Z M97 29 Q110 12 96 7 Q78 10 79 34Z M64 17 Q51 1 41 10 Q44 28 64 34 Q84 28 87 10 Q77 1 64 17Z"
            fill={"url(#" + leaf + ")"} stroke="#3E6240" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M64 104 Q48 108 35 121 M64 104 Q80 108 93 121 M64 105 L64 124 M49 99 Q40 111 25 111 M79 99 Q88 111 103 111"
            fill="none" stroke="#604832" strokeWidth="5" strokeLinecap="round"/>
          <path d="M28 68 Q39 60 48 69 M100 68 Q89 60 80 69 M36 85 Q45 78 52 86 M92 85 Q83 78 76 86"
            fill="none" stroke="#C6D99A" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M34 38 Q42 31 49 38 M79 38 Q86 31 94 38" fill="none" stroke="#F4F2D8" strokeWidth="2" opacity=".8" strokeLinecap="round"/>
          <g fill="#F5DEA0" stroke="#78915C" strokeWidth=".8"><circle cx="22" cy="62" r="2.5"/><circle cx="106" cy="62" r="2.5"/><circle cx="38" cy="96" r="2"/><circle cx="90" cy="96" r="2"/><circle cx="64" cy="23" r="2.2"/></g>
        </g>
      )}
      
      {level === 1 ? (
        <g fill="#B98B52" stroke="#765638" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M34 76 C20 66 21 48 31 43 C37 51 40 63 43 75Z"/>
          <path d="M94 76 C108 66 107 48 97 43 C91 51 88 63 85 75Z"/>
          <path d="M34 76 Q39 70 43 67 M94 76 Q89 70 85 67" fill="none" stroke="#E8C987" strokeWidth="1.5"/>
        </g>
      ) : level === 2 ? (
        <g>
          <path d="M30 82 Q39 74 47 82 Q43 91 33 91Z M81 83 Q90 74 99 81 Q96 91 85 92Z"
            fill="#789B58" stroke="#3F6743" strokeWidth="1.5"/>
          <path d="M31 84 Q39 78 44 83 M84 84 Q91 78 97 82" fill="none" stroke="#C8DC91" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      ) : (
        <g>
          <path d="M28 79 Q39 68 47 78 Q45 91 31 93Z M81 78 Q91 68 100 78 Q97 92 83 93Z"
            fill="#6C8B50" stroke="#3B6040" strokeWidth="1.7"/>
          <path d="M31 85 Q39 75 44 80 M85 80 Q93 75 98 85" fill="none" stroke="#D5E4A4" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M31 95 Q37 89 42 94 M86 94 Q92 89 97 95" fill="none" stroke="#B6C98A" strokeWidth="2.4" strokeLinecap="round"/>
        </g>
      )}
      {/* Subtle forest-floor details leave the face unobstructed. */}
      <path d="M35 94 Q64 105 93 94" fill="none" stroke="#B6CF8A" strokeWidth="1.5" opacity=".5"/>
      <g fill="#F5DEA0">
        <circle cx="35" cy="67" r="1.7"/><circle cx="93" cy="61" r="1.7"/>
        {level === 3 && <><circle cx="43" cy="86" r="1.4"/><circle cx="85" cy="82" r="1.4"/></>}
      </g>

      {level === 1 ? (
        <g>
          {/* BABY: a newly-awakened seed spirit, still nestled in its split seed shell. */}
          <path d="M46 76 Q35 79 37 92 Q43 101 56 98 L58 91 Q48 91 47 83Z"
            fill="#B98B52" stroke="#765638" strokeWidth="2"/>
          <path d="M82 76 Q93 79 91 92 Q85 101 72 98 L70 91 Q80 91 81 83Z"
            fill="#B98B52" stroke="#765638" strokeWidth="2"/>
          <path d="M43 88 Q48 94 55 93 M85 88 Q80 94 73 93" fill="none" stroke="#E8C987" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M51 78 Q43 80 41 87 Q42 93 51 94 M77 78 Q85 80 87 87 Q86 93 77 94"
            fill="none" stroke="#A4C77A" strokeWidth="5.5" strokeLinecap="round"/>
          <ellipse cx="64" cy="91" rx="13" ry="10" fill={"url(#" + skin + ")"} stroke="#657B55" strokeWidth="1.8"/>
          <path d="M56 97 Q53 102 49 102 M72 97 Q75 102 79 102" fill="none" stroke="#8B6848" strokeWidth="4.2" strokeLinecap="round"/>
          <path d="M64 70 C48 70 38 58 41 44 C43 31 54 26 64 27 C76 25 87 34 88 47 C90 61 79 71 64 70Z"
            fill={"url(#" + skin + ")"} stroke="#657B55" strokeWidth="2.2"/>
          <path d="M63 30 C53 23 53 13 61 11 C69 15 70 22 66 30 C74 21 83 22 85 29 C81 37 73 39 65 35Z"
            fill={"url(#" + leaf + ")"} stroke="#456B43" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M63 28 Q60 20 61 15" fill="none" stroke="#F7F8DC" strokeWidth="1.4" strokeLinecap="round"/>
          <ellipse cx="55" cy="51" rx="2.5" ry="3.5" fill="#344036"/><ellipse cx="73" cy="51" rx="2.5" ry="3.5" fill="#344036"/>
          <circle cx="55.8" cy="50" r=".9" fill="#FFFFFF"/><circle cx="73.8" cy="50" r=".9" fill="#FFFFFF"/>
          <ellipse cx="48" cy="59" rx="4" ry="2.2" fill="#E9A29A" opacity=".55"/><ellipse cx="80" cy="59" rx="4" ry="2.2" fill="#E9A29A" opacity=".55"/>
          <path d="M60 62 Q64 66 68 62" fill="none" stroke="#98765D" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M53 81 Q64 86 75 81" fill="none" stroke="#D5C99F" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="64" cy="91" r="2.1" fill="#E4C77E" stroke="#A7834D" strokeWidth=".8"/>
        </g>
      ) : level === 2 ? (
        <g>
          {/* CHILD: the seedling has grown bark patches, moss, and a living vine mantle. */}
          <path d="M45 67 Q36 61 31 69 Q34 78 45 80Z M83 67 Q92 61 97 69 Q94 78 83 80Z"
            fill="#795B3D" stroke="#E4D2A9" strokeWidth="1.5"/>
          <path d="M43 73 Q50 69 54 76 M85 73 Q78 69 74 76" fill="none" stroke="#B7D58A" strokeWidth="3" strokeLinecap="round"/>
          <path d="M48 88 Q64 96 80 88" fill="none" stroke="#6F9854" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M48 69 Q38 69 34 80 Q35 87 46 85 M80 69 Q90 69 94 80 Q93 87 82 85"
            fill="none" stroke="#8EB76D" strokeWidth="6" strokeLinecap="round"/>
          <path d="M52 66 Q64 60 76 66 L81 91 Q78 101 64 102 Q50 101 47 91Z"
            fill={"url(#" + skin + ")"} stroke="#657B55" strokeWidth="2"/>
          <path d="M54 96 Q49 103 46 107 M74 96 Q79 103 82 107" fill="none" stroke="#76563B" strokeWidth="5" strokeLinecap="round"/>
          <path d="M43 107 Q49 103 55 107 L54 111 Q48 114 42 111Z M73 107 Q79 103 85 107 L86 111 Q80 114 74 111Z"
            fill="#8A6747" stroke="#E6D5B0" strokeWidth="1"/>
          <path d="M64 29 C51 29 44 39 45 51 C46 63 54 69 64 69 C75 69 83 61 83 50 C84 38 76 29 64 29Z"
            fill={"url(#" + skin + ")"} stroke="#657B55" strokeWidth="2.2"/>
          <path d="M52 35 C42 28 43 18 52 17 C60 19 62 27 57 36 M75 34 C80 23 90 23 92 31 C89 40 82 42 75 39"
            fill={"url(#" + leaf + ")"} stroke="#456B43" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M64 31 Q56 18 62 12 Q73 14 69 31Z" fill={"url(#" + leaf + ")"} stroke="#456B43" strokeWidth="1.7"/>
          <ellipse cx="56" cy="49" rx="2.5" ry="3.5" fill="#344036"/><ellipse cx="72" cy="49" rx="2.5" ry="3.5" fill="#344036"/>
          <circle cx="56.8" cy="48" r=".9" fill="#FFFFFF"/><circle cx="72.8" cy="48" r=".9" fill="#FFFFFF"/>
          <path d="M60 59 Q64 63 68 59" fill="none" stroke="#98765D" strokeWidth="1.7" strokeLinecap="round"/>
          <path d="M57 76 Q64 81 71 76" fill="none" stroke="#B4C98C" strokeWidth="2" strokeLinecap="round"/>
          <path d="M64 79 L64 93" stroke={"url(#" + wood + ")"} strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M64 82l4 4-4 4-4-4Z" fill="#D9BD79" stroke="#8B7043" strokeWidth="1"/>
        </g>
      ) : (
        <g>
          {/* ADULT: a fully-awakened ancient tree spirit, with mature bark and lichen crown. */}
          <path d="M45 61 Q32 54 27 69 Q28 84 44 88 L50 79Z M83 61 Q96 54 101 69 Q100 84 84 88 L78 79Z"
            fill="#76543A" stroke="#DCC69A" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M31 73 Q37 65 43 72 M97 73 Q91 65 85 72" fill="none" stroke="#B7D58A" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M52 64 Q64 70 76 64 M50 91 Q64 99 78 91" fill="none" stroke="#C99A65" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M48 62 Q36 59 30 73 Q29 84 44 86 M80 62 Q92 59 98 73 Q99 84 84 86"
            fill="none" stroke="#8BAF68" strokeWidth="7" strokeLinecap="round"/>
          <path d="M49 60 Q64 53 79 60 L83 91 Q80 102 64 104 Q48 102 45 91Z"
            fill={"url(#" + wood + ")"} stroke="#E8D7B1" strokeWidth="2"/>
          <path d="M55 66 Q64 72 73 66 M54 81 Q64 87 74 81" fill="none" stroke="#C89A67" strokeWidth="1.7" opacity=".8" strokeLinecap="round"/>
          <path d="M53 99 Q48 108 43 113 M75 99 Q80 108 85 113" fill="none" stroke="#76563B" strokeWidth="6" strokeLinecap="round"/>
          <path d="M39 113 Q47 107 55 112 L54 117 Q45 120 38 117Z M73 112 Q81 107 89 113 L90 117 Q83 120 74 117Z"
            fill="#806044" stroke="#E6D5B0" strokeWidth="1.2"/>
          <path d="M64 28 C51 28 44 38 45 50 C46 62 54 68 64 68 C75 68 83 60 83 49 C84 37 76 28 64 28Z"
            fill={"url(#" + skin + ")"} stroke="#657B55" strokeWidth="2.2"/>
          <path d="M47 39 Q34 22 24 28 Q24 43 43 49 M81 39 Q94 22 104 28 Q104 43 85 49"
            fill={"url(#" + leaf + ")"} stroke="#456B43" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M64 34 Q48 20 51 10 Q64 6 67 30 Q76 12 88 16 Q89 30 67 39Z"
            fill={"url(#" + leaf + ")"} stroke="#456B43" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M49 34 Q40 19 34 14 M79 34 Q88 19 94 14" fill="none" stroke={"url(#" + wood + ")"} strokeWidth="4" strokeLinecap="round"/>
          <ellipse cx="56" cy="48" rx="2.7" ry="3.8" fill="#344036"/><ellipse cx="72" cy="48" rx="2.7" ry="3.8" fill="#344036"/>
          <circle cx="56.8" cy="47" r="1" fill="#FFFFFF"/><circle cx="72.8" cy="47" r="1" fill="#FFFFFF"/>
          <path d="M59 59 Q64 63 69 59" fill="none" stroke="#98765D" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M64 68 L64 99" stroke="#C99A65" strokeWidth="2.3" strokeLinecap="round"/>
          <path d="M58 75 Q64 79 70 75 M57 88 Q64 92 71 88" fill="none" stroke="#D8B27D" strokeWidth="1.4" opacity=".9"/>
          <path d="M53 68 Q49 76 54 82 M75 68 Q79 76 74 82" fill="none" stroke="#C28E5D" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      )}

      <path d="M64 15 Q68 18 68 23" fill="none" stroke="#FFFFFF" strokeWidth="1.3" opacity=".75" strokeLinecap="round"/>
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
