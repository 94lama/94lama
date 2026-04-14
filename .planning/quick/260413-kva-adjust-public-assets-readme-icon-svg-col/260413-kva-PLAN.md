---
id: 260413-kva
type: quick-plan
mode: quick
autonomous: true
files_modified:
  - public/assets/readme/icon.svg
---

# Quick Plan — Adjust public/assets/readme/icon.svg color to match accent from app/globals.css

## Objective

Update `public/assets/readme/icon.svg` so its accent color matches the app accent palette defined in `app/globals.css`.

## Context

- `app/globals.css` defines the accent tokens:
  - dark/default: `#60a5fa`
  - light: `#2563eb`
- The favicon SVG is served as a standalone asset, so it cannot read CSS variables from the page at runtime.
- The correct minimal implementation is to embed equivalent color-scheme-aware CSS in the SVG itself.

## Tasks

### Task 1 — Match icon color to accent palette

Files:
- public/assets/readme/icon.svg

Action:
- Replace the current hardcoded accent fill with an internal SVG style block.
- Default the accent to `#60a5fa` and switch to `#2563eb` under `prefers-color-scheme: light`.

Verify:
- No hardcoded `#3e67ff` remains in the file.
- The SVG includes both accent colors from `app/globals.css`.

Done:
- Icon color behavior matches the app accent palette and is committed atomically.

### Task 2 — Quick docs/state bookkeeping

Files:
- .planning/quick/260413-kva-adjust-public-assets-readme-icon-svg-col/260413-kva-PLAN.md
- .planning/quick/260413-kva-adjust-public-assets-readme-icon-svg-col/260413-kva-SUMMARY.md
- .planning/STATE.md

Action:
- Create summary.
- Add quick task row and update Last activity in `.planning/STATE.md`.

## Success criteria

- `public/assets/readme/icon.svg` matches the app accent palette.
- Quick task artifacts exist and `STATE.md` is updated.
