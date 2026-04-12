---
phase: quick
plan: 260412-koo
subsystem: ui
tags: [nextjs, ui, ogl, iubenda, accessibility, portfolio]

# Dependency graph
requires:
  - phase: quick-task-backlog
    provides: existing portfolio shell, knowledge map, and legal footer wiring
provides:
  - deeper 3D knowledge map layout with restrained motion and reduced-motion fallback
  - richer relocation content sourced from portfolio data and icon-supported email CTAs
  - single-path iubenda bootstrap owned by the root layout
affects: [portfolio-ui, recruiter-flow, consent-bootstrap]

# Tech tracking
tech-stack:
  added: []
  patterns: [layout-owned consent bootstrap, data-driven relocation detail cards, reduced-motion-safe microinteractions]

key-files:
  created: []
  modified: [app/components/skills-knowledge-map.tsx, app/page.tsx, app/layout.tsx, app/components/legal-footer.tsx, src/content/portfolio/types.ts, public/assets/cv.json, TODO.md]

key-decisions:
  - "Kept map architecture intact and added depth/motion through node placement plus transform/opacity-only UI transitions."
  - "Centralized iubenda bootstrap in app/layout.tsx and left the footer as the legal-links surface only."

patterns-established:
  - "Reduced-motion-safe UI polish: animate only transform/opacity and disable motion when the user prefers reduced motion."
  - "Portfolio content extensions should flow from public/assets/cv.json through typed interfaces before UI rendering."

requirements-completed: []

# Metrics
duration: 4m 15s
completed: 2026-04-12
---

# Phase quick Plan 260412-koo: fix-all-ui-issues-marked-in-todo-md-upda Summary

**Recruiter-facing polish for the portfolio: deeper animated knowledge map, richer relocation storytelling, icon-supported email CTAs, and a single verified root-layout iubenda bootstrap.**

## Performance

- **Duration:** 4m 15s
- **Started:** 2026-04-12T15:13:47Z
- **Completed:** 2026-04-12T15:22:24Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- Reworked the knowledge-map node placement so categories and skills read with stronger vertical/depth separation instead of a flatter ring.
- Added tasteful staged UI motion and floating node movement while honoring `prefers-reduced-motion`.
- Expanded relocation content from the data source, added email icons to both primary CTAs, and consolidated iubenda bootstrap ownership into `app/layout.tsx`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add restrained motion and stronger depth to the knowledge map** - `9c86d87` (feat)
2. **Task 2: Enrich relocation/contact UI and consolidate the iubenda bootstrap path** - `6565c43` (feat)
3. **Task 3: Mark only the completed in-scope UI TODO items as done** - `c0137f5` (chore)
4. **Follow-up verification fix:** lint-safe motion entrance handling plus removal of redundant manual iubenda config - `d60d90f` (fix)

**Plan metadata:** Not committed by this executor per task constraints.

## Files Created/Modified
- `app/components/skills-knowledge-map.tsx` - Deepened node distribution and added reduced-motion-safe map/UI motion.
- `app/page.tsx` - Rendered relocation support content and priorities, plus accessible email CTAs with icons.
- `app/layout.tsx` - Kept a single layout-owned hosted iubenda bootstrap path and removed redundant manual config injection during verification.
- `app/components/legal-footer.tsx` - Reduced footer responsibility to legal links only by removing duplicate script loading.
- `src/content/portfolio/types.ts` - Extended relocation typing for structured support content.
- `public/assets/cv.json` - Authored relocation support content and priorities used by section 05.
- `TODO.md` - Checked off only the five completed in-scope UI backlog items.

## Decisions Made
- Kept the existing OGL map and selection/picking behavior intact, changing only placement and presentation.
- Reused the already-loaded iubenda widget path in the layout and avoided competing footer/bootstrap loaders.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- The provided TODO verification command initially failed because shell quoting stripped template literals; reran the same check with corrected quoting and it passed.
- Initial executor output introduced a React lint violation (`setState` in effect) and an unnecessary manual iubenda config block; both were corrected in the final verification fix commit.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Portfolio UI backlog items covered by this quick task are complete.
- Architecture TODO items remain intentionally untouched for future planning.

## Self-Check: PASSED

- Found summary file at `.planning/quick/260412-koo-fix-all-ui-issues-marked-in-todo-md-upda/260412-koo-SUMMARY.md`.
- Verified task commits `9c86d87`, `6565c43`, `c0137f5`, and `d60d90f` exist in git history.
