---
phase: 04-knowledge-map-experience-contract
plan: "01"
subsystem: testing
tags: [node-test, selection-ranking, experience, map-sync]
requires: []
provides:
  - Pure ranking helper for map-to-experience selection state
  - Phase 4 automated tests for overview, matched, category, and fallback ordering
affects: [phase-04-ui, experience-timeline, skills-map]
tech-stack:
  added: []
  patterns: [pure ranking helper, node test verification]
key-files:
  created:
    - src/content/portfolio/rank-experience-by-selection.ts
    - tests/phase-04-knowledge-experience.test.ts
  modified:
    - tests/phase-03-contact-validation.test.ts
    - src/content/portfolio/parse-cv.ts
    - tsconfig.json
key-decisions:
  - "Keep ranking logic pure and independent of React so the client coordinator can consume one deterministic contract."
  - "Preserve the full experience timeline for every selection state and express filtering only through ordering, highlighting, and helper copy."
patterns-established:
  - "Map selection -> pure ranking helper -> ordered full timeline"
  - "Node phase tests run directly against TypeScript source with explicit .ts imports"
requirements-completed: [EXP-01, EXP-02]
duration: 3 min
completed: 2026-04-12
---

# Phase 4 Plan 01: Shared Ranking Contract Summary

**Pure map-selection ranking helper with deterministic highlight, reorder, and fallback behavior for the shared experience timeline**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-12T10:33:23Z
- **Completed:** 2026-04-12T10:36:26Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Added `rankExperienceBySelection` as the single typed derivation point for map selection state.
- Added Phase 4 Node tests covering core, skill, category, unmatched, and stable-order behavior.
- Restored runnable direct Node test execution by switching the involved phase tests and content imports to explicit `.ts` resolution.

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing tests and helper contract** - `131f7a6` (test)
2. **Task 2: Implement pure ranking and fallback logic** - `c193e36` (feat)

**Plan metadata:** pending

## Files Created/Modified
- `src/content/portfolio/rank-experience-by-selection.ts` - Pure helper returning ordered entries, match scores, highlight state, and helper copy.
- `tests/phase-04-knowledge-experience.test.ts` - Node coverage for the shared ranking contract.
- `tests/phase-03-contact-validation.test.ts` - Updated to match the current authored email and explicit `.ts` import path.
- `src/content/portfolio/parse-cv.ts` - Explicit `.ts` type import for direct Node test execution.
- `tsconfig.json` - Enabled `allowImportingTsExtensions` for explicit `.ts` imports in test execution.

## Decisions Made
- Keep the ranking contract local to `src/content/portfolio/` instead of in React components so future UI work reads one source of truth.
- Treat unmatched selections as an overview fallback, never as permission to hide experience entries.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed direct Node test module resolution for phase verification**
- **Found during:** Task 1 (Write failing tests and helper contract)
- **Issue:** The planned `node --test --experimental-strip-types ...` commands could not resolve `@/` aliases or extensionless local TypeScript imports, so RED failed before reaching the intended missing implementation.
- **Fix:** Switched the affected phase tests and the involved source imports to explicit `.ts` paths and enabled `allowImportingTsExtensions` in `tsconfig.json`.
- **Files modified:** `tests/phase-03-contact-validation.test.ts`, `src/content/portfolio/parse-cv.ts`, `tsconfig.json`
- **Verification:** `node --test --experimental-strip-types tests/phase-03-contact-validation.test.ts` and `node --test --experimental-strip-types tests/phase-04-knowledge-experience.test.ts`
- **Committed in:** `131f7a6`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix was necessary to make the planned verification commands executable. No scope creep beyond preserving the intended Node test workflow.

## Issues Encountered
- Phase 3's existing contact regression test still expected an outdated email value even though `public/assets/cv.md` already had `info@riccardolamalfa94.it`; the expectation was updated while fixing the direct Node test path.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Wave 2 can now build the shared client coordinator against a stable, tested ranking helper.
- The remaining risk is UI wiring and map readability, not ranking correctness.

---
*Phase: 04-knowledge-map-experience-contract*
*Completed: 2026-04-12*
