---
quick_task: 260412-jzg
tags: [nextjs, layout, footer, iubenda, legal]
key-files:
  created:
    - app/components/legal-footer.tsx
  modified:
    - app/layout.tsx
  deleted: []
completed: 2026-04-12
---

# Quick Task 260412-jzg Summary

**Moved the Iubenda privacy and cookie policy UI out of `app/layout.tsx` into a dedicated reusable footer component while preserving the existing legal links and script behavior.**

## Accomplishments
- Created `app/components/legal-footer.tsx` as the dedicated boundary for the privacy and cookie policy links.
- Switched the footer bootstrap to a `next/script` external include so the Iubenda loader is owned by the new component.
- Updated `app/layout.tsx` to render `LegalFooter` after `{children}` and removed the inline legal anchors and inline loader scripts.
- Preserved the existing root layout shell, including metadata, fonts, the global Iubenda widget script, and both Google Tag Manager entries.

## Files Created/Modified
- Created `app/components/legal-footer.tsx`.
- Updated `app/layout.tsx` to import and render `LegalFooter`.

## Validation
- `npm run lint`
- `npm run build`

## Task Commits
- `6d840ff` — `feat(260412-jzg): extract legal footer component`
- `785127d` — `feat(260412-jzg): move legal footer into root layout`

## Deviations from Plan
None - plan executed exactly as written.

## Known Stubs
None.

## Self-Check: PASSED
- Found `.planning/quick/260412-jzg-move-privacy-and-cookie-from-app-layout-/260412-jzg-SUMMARY.md`
- Found commit `6d840ff`
- Found commit `785127d`
