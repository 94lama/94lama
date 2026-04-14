---
phase: quick
plan: 260413-kva
subsystem: assets
tags: [favicon, svg, accent, quick-task]

# Summary — Quick 260413-kva: adjust favicon SVG accent colors

## What happened

- Updated `public/assets/readme/icon.svg` to use the app accent palette instead of a hardcoded blue.
- Embedded a small style block inside the SVG so the favicon uses:
  - dark/default: `#60a5fa`
  - light: `#2563eb`
- Replaced the old hardcoded `#3e67ff` path fill with a class-based accent fill.

## Commits

- `379d7df` feat(quick-260413-kva): match favicon SVG accent colors to app palette

## Files modified

- public/assets/readme/icon.svg
- .planning/quick/260413-kva-adjust-public-assets-readme-icon-svg-col/260413-kva-PLAN.md (created)

## Notes

- A standalone favicon SVG cannot directly consume CSS variables from `app/globals.css`, so the icon mirrors the same accent values internally with `prefers-color-scheme`.
