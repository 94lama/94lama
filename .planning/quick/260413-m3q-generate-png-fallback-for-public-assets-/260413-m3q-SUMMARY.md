---
phase: quick
plan: 260413-m3q
subsystem: metadata
tags: [favicon, png, svg, quick-task]

# Summary — Quick 260413-m3q: add PNG favicon fallback

## What happened

- Updated `app/layout.tsx` metadata to include both the existing SVG favicon and a PNG fallback.
- Added `public/assets/icon.png` as the fallback favicon asset.
- Left `public/assets/readme/icon.svg` untouched, per user instruction.

## Commits

- `ceaf7d2` feat(quick-260413-m3q): add PNG favicon fallback alongside SVG icon

## Files modified

- app/layout.tsx
- public/assets/icon.png
- .planning/quick/260413-m3q-generate-png-fallback-for-public-assets-/260413-m3q-PLAN.md (created)

## Notes

- The root metadata now exposes:
  - `/assets/readme/icon.svg` as SVG icon
  - `/assets/icon.png` as PNG icon + shortcut fallback
- The current worktree modifications to `public/assets/readme/icon.svg` were deliberately excluded from this task.
