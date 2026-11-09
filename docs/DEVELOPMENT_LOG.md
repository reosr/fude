# Fude Development Log

## 2026-11-09

### Badge catalog and visual direction

### Badge evolution and artwork production direction
- Set the final badge artwork target to 900 unique illustrations: 300 badge identities, each with Level 1, Level 2, and Level 3 artwork.
- Level 1 is the first Gacha acquisition; three Level 1 copies evolve into Level 2, and three Level 2 copies evolve into Level 3.
- Remove Level 0 from the active inventory model. Migrate legacy Level 0 copies to Level 1, legacy Level 1 copies to Level 2, and legacy Level 2/3 copies to Level 3 so existing collection progress and total copies are preserved.
- Keep badge identity recognizable across its three stages while giving each stage a substantial, character-specific visual redesign. Artwork must be individually art-directed, not emoji substitutions, palette swaps, or generic medallion overlays.
- The existing procedural SVG remains temporary scaffolding; the 900 final artwork variants have not yet been produced.

- Rebalance the 300 badge catalog to 90 Common, 70 Uncommon, 55 Rare, 40 Epic, 25 Mythic, and 20 Legendary entries.
- Keep all rarity tiers visually appealing; rarity controls scarcity and visual prestige, not baseline design quality.
- Set the art direction toward polished 3D collectible-game artwork with a balanced mix of cute, cool, elegant, and playful designs for a broad audience.

### Gacha and profile collection UX
- Unify the 300 profile badges and Gacha summon pool into one collection, retaining Mochi Guardian, Sakura Bloom, and the other original badge identities.
- Make Gacha the only source of badge ownership; chapter/JLPT progress no longer grants badges.
- Preserve legacy Gacha inventory, evolution copies, NEW markers, summon history, and equipped badge IDs through ID migration.
- Add a return action on the Gacha page with browser-history navigation and a Home fallback.
- Restyle collection overlays with a translucent dark surface and backdrop blur while keeping the page visible behind them.
- Lock document scrolling while profile collection/detail/edit dialogs or the Gacha catalog are open; keep scrolling inside the modal.
- Update the Gacha catalog rarity-count copy to match the 90/70/55/40/25/20 distribution.

### Badge artwork refinement
- Expand the rarity-aware SVG medallion with layered metallic rims, engraved sigils, decorative ray systems, and more ornament layouts.
- Derive the artwork composition from both rarity and catalog position so badge designs vary beyond a simple rarity palette swap.
- Preserve the four evolution tiers, unique SVG gradient IDs, responsive sizing, and accessible badge labels.
- This is an improved procedural art foundation; the 300 individually art-directed badge designs remain a future visual-production task.


### JLPT progress and completion
- Save the active section, current question, and answers immediately before navigating or leaving a practice set.
- Keep retry status separate from first-time completion status so an unfinished retry can be resumed.
- Use the validated `completedOnce` flag when calculating JLPT collection unlocks.
- Save the completed result before awarding EXP or token rewards so unlock checks read the final result.

### Collection unlock notifications
- Run collection synchronization when EXP or token balances change.
- Register notification listeners before the initial collection synchronization.
- Remove a pending NEW marker and its toast when the collection item is opened.
- Preserve the existing collection item IDs for saved profile compatibility.
- Rename deity-based collection labels to folklore or nature-based alternatives and replace the yin-yang ornament with a geometric crest.

### Gacha foundation
- Build one 300-entry profile/Gacha badge catalog with rarity distribution: Common 90, Uncommon 70, Rare 55, Epic 40, Mythic 25, Legendary 20.
- Add transparent rarity rates that improve from N5 through N1.
- Set summon costs to 1 token for 1x and 10 tokens for 10x.
- Persist badge copies, NEW markers, and the latest 200 summon results in browser storage.
- Add badge evolution: 10 Level 0 copies create Level 1; 3 Level 1 create Level 2; 3 Level 2 create Level 3.
- Exclude Level 3 badges from future summon pools. If every badge in a rolled rarity is maxed, grant 1 token compensation for that pull.
- Add rarity filters, search, evolution progress, profile equipping, summon reveal animation, and collection progress on the profile page.
- Add rarity-aware SVG badge artwork with distinct crest/archetype combinations and additional visual details at higher evolution levels.
- Roll back token balance and reward-claim records if token transaction persistence fails.

### Kana stroke animation
- Load the local AnimCJK SVG assets inline and stagger paths that share the same start delay.
- Extend the replay interval to account for the staggered segments.
- Avoid showing the previous kana animation while a new character's asset is loading.

### Verification
- Add GitHub Actions CI for linting the changed feature files, TypeScript checking, and a production build.
- The latest CI run for commit `070d6c81` completed successfully.
- The repository-wide lint command still has pre-existing lint debt in legacy files; CI currently scopes ESLint to the changed feature files while TypeScript and the production build check the full project.

### Known limitations and next visual phase
- Gacha inventory and token balances currently use browser localStorage, so they are local to the browser/device and are not server-authoritative.
- The 300 badge names and SVG artwork are a structured visual scaffold, not the final individually art-directed asset set.
- The next visual collection phase should refine all 300 badges and the planned frames, frame ornaments, auras, profile themes, nameplates, companions, and EXP Scrolls into a cohesive, high-quality set.

### Folklore collection content review
- Replace visible deity-based wording and religious symbols in chapter badges with non-religious folklore, nature, and everyday Japanese motifs.
- Keep legacy collection IDs unchanged so existing local profile data remains compatible.
