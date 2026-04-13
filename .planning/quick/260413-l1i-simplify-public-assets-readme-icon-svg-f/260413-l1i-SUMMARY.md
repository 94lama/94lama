---
phase: quick
plan: 260413-l1i
subsystem: assets
tags: [favicon, svg, icon, quick-task]

# Summary — Quick 260413-l1i: simplify favicon SVG for small sizes

## What happened

- Replaced the heavy Inkscape-exported favicon SVG with a compact vector-only icon.
- Kept the requested concept: a llama centered between `<` and `>`.
- Preserved the app accent palette behavior using embedded dark/light color values.

## Commits

- `a4aa1ea` feat(quick-260413-l1i): simplify favicon SVG for small-size rendering

## Files modified

- public/assets/readme/icon.svg
- .planning/quick/260413-l1i-simplify-public-assets-readme-icon-svg-f/260413-l1i-PLAN.md (created)

## Notes

- The new icon is vector-only and avoids embedded raster/base64 payloads, which improves favicon clarity and file size.
- Geometry is intentionally simple so the silhouette holds up better at 16x16 and 32x32.
