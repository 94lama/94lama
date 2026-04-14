---
phase: quick
plan: 260413-klf
subsystem: metadata
tags: [favicon, metadata, svg, quick-task]

# Summary — Quick 260413-klf: use public/assets/readme/icon.svg as favicon

## What happened

- Updated `app/layout.tsx` root metadata to set `icons.icon` to `/assets/readme/icon.svg`.
- Included the current `public/assets/readme/icon.svg` asset in the task commit, per user instruction.
- Removed `app/favicon.ico` so the requested SVG is the favicon source instead of the old static icon file.

## Commits

- `200bb83` feat(quick-260413-klf): use readme icon SVG as favicon

## Files modified

- app/layout.tsx
- public/assets/readme/icon.svg
- app/favicon.ico (deleted)
- .planning/quick/260413-klf-use-public-assets-readme-icon-svg-as-fav/260413-klf-PLAN.md (created)

## Notes

- Implementation follows the Next.js App Router metadata API by setting `metadata.icons.icon` on the root layout.
- The favicon asset now comes from `public/assets/readme/icon.svg`, which is served at `/assets/readme/icon.svg`.
