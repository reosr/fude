# Fude Development Log

## 2026-11-09

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
- Add a 300-entry badge catalog scaffold: 50 entries in each of the six rarities.
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
