---
quick_task: 260412-grk
tags: [nextjs, content, json, portfolio, loader]
key-files:
  created:
    - public/assets/cv.json
  modified:
    - src/content/portfolio/get-portfolio-content.ts
    - tests/phase-03-contact-validation.test.ts
completed: 2026-04-12
---

# Quick Task 260412-grk Summary

**The portfolio content pipeline now reads a structured `public/assets/cv.json` source instead of parsing `public/assets/cv.md` at runtime.**

## Accomplishments
- Added `public/assets/cv.json` matching the current `PortfolioContent` shape used by the app.
- Switched `getPortfolioContent()` to load JSON directly from the new content source.
- Updated the Phase 3 regression test to validate the JSON source of truth while preserving the page wiring checks.

## Files Created/Modified
- `public/assets/cv.json` - structured JSON representation of the current portfolio content.
- `src/content/portfolio/get-portfolio-content.ts` - loads JSON instead of markdown parsing.
- `tests/phase-03-contact-validation.test.ts` - validates contact data from the JSON source.

## Validation
- `node --input-type=module -e "import { readFile } from 'node:fs/promises'; JSON.parse(await readFile('./public/assets/cv.json', 'utf8'));"`
- `node --test --experimental-strip-types tests/phase-03-contact-validation.test.ts`
- `npm run build`

## Task Commits
- `8995ac3` — `feat(260412-grk): switch portfolio content source to JSON`

## Deviations from Plan
None - plan executed exactly as written.

## Known Stubs
None.

## Self-Check: PASSED
- Found `.planning/quick/260412-grk-transform-public-assets-cv-md-into-json/260412-grk-SUMMARY.md`
- Found commit `8995ac3`
