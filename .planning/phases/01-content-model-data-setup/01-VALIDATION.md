---
phase: 01-content-model-data-setup
date: 2026-04-10
source: 01-RESEARCH.md
---

# Validation Strategy

## Required Evidence

1. Shared content types exist for hero, summary, skills, experience, education, languages, relocation, and contact.
2. The app reads `public/assets/cv.md` through a shared loader/parser path.
3. `app/page.tsx` renders shared content rather than starter-template copy.
4. The app passes lint and production build verification.

## Recommended Commands

- `npm run lint`
- `npm run build`

## File Assertions

- Shared content module exports a typed content contract.
- Parser/loader references `public/assets/cv.md`.
- `app/page.tsx` imports the shared content source.
- Starter text such as `To get started, edit the page.tsx file.` is removed.

## Notes

This phase can pass without a dedicated unit-test framework if the plan includes reliable automated lint/build checks and grep-verifiable file assertions.
