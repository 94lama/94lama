---
quick_task: 260410-tbn
tags: [nextjs, react, portfolio, filtering, recruiter-navigation]
key-files:
  created:
    - app/components/experience-map-section.tsx
  modified:
    - app/page.tsx
    - app/components/skills-knowledge-map.tsx
    - src/content/portfolio/parse-cv.ts
completed: 2026-04-10
---

# Quick Task 260410-tbn Summary

**The 3D knowledge map now drives the experience section, so recruiter-visible experience evidence responds to the currently selected skill context.**

## Accomplishments
- Added `ExperienceMapSection` as the client boundary that owns shared knowledge-map selection state.
- Converted `SkillsKnowledgeMap` into a controlled component that reports every selection through `onSelectionChange`.
- Filtered experience entries with deterministic case-insensitive matching against role, company, and highlights.
- Added graceful fallback copy for core selections and unmatched skill/category selections.

## Files Created/Modified
- `app/components/experience-map-section.tsx` - shared client state, experience filtering, fallback messaging, and experience rendering.
- `app/components/skills-knowledge-map.tsx` - controlled selection API for map clicks, skill chips, and category buttons.
- `app/page.tsx` - keeps data loading on the server and passes only serializable portfolio data into the client wrapper.
- `src/content/portfolio/parse-cv.ts` - updated CV skill parsing to accept the nested skill list currently used in `public/assets/cv.md`.

## Validation
- `npm run lint`
- `npm run build`

## Task Commits
- `1f71b96` — `feat(260410-tbn): share knowledge map selection state`
- `91314df` — `feat(260410-tbn): filter experience from skill map selection`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated CV skill parsing to accept nested skill groups**
- **Found during:** Task 2 verification
- **Issue:** `npm run build` failed because `parse-cv.ts` only accepted flat `Category: item, item` skill lines, while `public/assets/cv.md` now stores skills as nested bullets with proficiency values.
- **Fix:** Added nested skill-group parsing while preserving support for the older flat format.
- **Files modified:** `src/content/portfolio/parse-cv.ts`
- **Commit:** `91314df`

## Known Stubs
None.

## Self-Check: PASSED
- Found `app/components/experience-map-section.tsx`
- Found commit `1f71b96`
- Found commit `91314df`
