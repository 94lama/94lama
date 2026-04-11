---
phase: 02-portfolio-page-experience
plan: 04
subsystem: hero-gap-closure
tags: [nextjs, react, content-pipeline, portfolio, gap-closure]

# Dependency graph
requires:
  - phase: 02-portfolio-page-experience
    plan: 02
    provides: Portfolio page composition and hero structure
  - phase: 02-portfolio-page-experience
    plan: 03
    provides: Validation baseline and manual UAT findings
provides:
  - Hero photo support in the shared portfolio content pipeline
  - Deduplicated Phase 2 hero copy with photo-backed first viewport
affects: [phase-02, hero, content-model, gap-closure]

# Tech tracking
tech-stack:
  added: []
  patterns: [content-driven-hero-media, next-image-fill, gap-remediation]

key-files:
  created:
    - .planning/phases/02-portfolio-page-experience/02-portfolio-page-experience-04-SUMMARY.md
  modified:
    - public/assets/cv.md
    - src/content/portfolio/types.ts
    - src/content/portfolio/parse-cv.ts
    - app/page.tsx

key-decisions:
  - "Kept the headshot sourced from `public/assets/cv.md` instead of hardcoding an image path in the page."
  - "Collapsed duplicated hero location and relocation content into one compact metadata cluster."

patterns-established:
  - "Hero media remains optional so invalid or missing authored photo data cannot break page rendering."
  - "The parser now reads the whole hero block up to the first `##` heading instead of assuming a fixed line count."

requirements-completed: [HERO-01, HERO-02, HERO-03, PORT-02]

# Metrics
duration: 28min
completed: 2026-04-11
---

# Phase 2 Plan 04 Summary

**Closed the recorded Phase 2 hero UAT gap by sourcing the existing profile photo through the shared portfolio pipeline and reducing the hero to one summary block plus one compact metadata cluster.**

## Automated Validation
- `grep tool checks for profile-photo source line, typed hero photo contract, and parser photo wiring` - passed
- `node -e "...content.summary count..."` - passed
- `grep tool checks for next/image import, content.hero.photo usage, and Email Riccardo in app/page.tsx` - passed
- `npm run lint` - passed
- `npm run build` - passed

## Files Created/Modified
- `public/assets/cv.md` - Added the authored `Profile Photo:` line to the hero source-of-truth block.
- `src/content/portfolio/types.ts` - Extended `HeroContent` with optional typed photo metadata.
- `src/content/portfolio/parse-cv.ts` - Parsed hero photo data from the pre-section hero block with `/assets/` validation.
- `app/page.tsx` - Rendered the optional headshot and removed repeated hero summary/location/relocation blocks.

## Decisions Made
- Used `next/image` with `fill`, `priority`, and responsive `sizes` so the hero photo strengthens first paint without layout shift.
- Kept the relocation section lower on the page intact while removing only the redundant hero repetition called out in UAT.

## Deviations from Plan
- None.

## Issues Encountered
- None.

## User Setup Required
- Run one final browser pass at mobile and desktop widths to confirm the updated hero reads cleanly in the actual rendered UI.

## Next Phase Readiness
- The Phase 2 gap-closure implementation is complete and ready for re-verification/sign-off.

---
*Phase: 02-portfolio-page-experience*
*Completed: 2026-04-11*
