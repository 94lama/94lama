---
phase: 04-knowledge-map-experience-contract
plan: "02"
subsystem: ui
tags: [react, nextjs, ogl, shared-selection, experience-timeline]
requires:
  - phase: 04-01
    provides: Shared ranking helper for map-driven experience ordering
provides:
  - Shared coordinator for sections 01 and 02
  - Full-timeline experience renderer driven by map selection
  - Knowledge map without a rendered center sphere
affects: [phase-04-checkpoint, phase-05-ui-polish]
tech-stack:
  added: []
  patterns: [server-page plus client-island coordinator, full-timeline reorder without filtering]
key-files:
  created:
    - app/components/knowledge-experience-coordinator.tsx
    - app/components/experience-timeline-section.tsx
    - app/components/experience-card.tsx
  modified:
    - app/page.tsx
    - app/components/skills-knowledge-map.tsx
    - tests/phase-04-knowledge-experience.test.ts
key-decisions:
  - "Keep app/page.tsx server-first and isolate the shared selection state inside one small client coordinator."
  - "Preserve every experience entry in section 02 and express relevance through ranking plus emphasis, not filtering."
  - "Keep the core overview state in data but remove the rendered center sphere from the map scene."
patterns-established:
  - "Section 01 map writes selection; section 02 timeline reads ranked results from the same client island"
  - "Visual map affordances may change while the semantic core fallback remains stable in state"
requirements-completed: [MAP-01, MAP-02, EXP-01, EXP-02]
duration: 1 min
completed: 2026-04-12
---

# Phase 4 Plan 02: Shared Coordinator Summary

**Shared knowledge-map coordinator with a synced full experience timeline and a de-centered section-01 graph**

## Performance

- **Duration:** 1 min
- **Started:** 2026-04-12T10:43:54Z
- **Completed:** 2026-04-12T10:44:11Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Created `KnowledgeExperienceCoordinator` as the only client owner of the map-to-timeline selection state.
- Replaced the old static skills and standalone experience sections with one shared section-01/section-02 interaction flow.
- Updated the OGL map so `core` remains the overview state while the rendered center sphere disappears and the node spacing opens up.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create the shared coordinator and full-timeline renderer** - `8501393` (feat)
2. **Task 2: Replace duplicate skills and interactive experience sections in the page shell** - `9a9bebe` (feat)
3. **Task 3: Refine the map renderer for the new section-01 role** - `790cc8f` (feat)

**Plan metadata:** pending

## Files Created/Modified
- `app/components/knowledge-experience-coordinator.tsx` - Shared client island for sections 01 and 02.
- `app/components/experience-timeline-section.tsx` - Full-timeline renderer driven by ranked selection output.
- `app/components/experience-card.tsx` - Experience card with match-score emphasis and plain-text highlights.
- `app/page.tsx` - Server page now mounts the coordinator instead of rendering duplicate skills/experience surfaces.
- `app/components/skills-knowledge-map.tsx` - Hidden-core render path, wider layout spacing, and updated primary-surface copy.
- `tests/phase-04-knowledge-experience.test.ts` - Added wiring and hidden-core regression assertions.

## Decisions Made
- Use one client island instead of multiple small client wrappers so map selection cannot drift from timeline ranking.
- Keep the recruiter-visible timeline complete in all states and surface relevance with order, accent, and helper copy.
- Add a reset-to-overview control because the visible center sphere was removed but the semantic `core` state still matters.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed a type-check branch left unreachable after removing rendered core nodes**
- **Found during:** Task 3 (Refine the map renderer for the new section-01 role)
- **Issue:** `npm run build` failed because `updateProjectedNodes` still checked for `visual.data.kind === 'core'` after the loop already skipped `core` nodes.
- **Fix:** Removed the unreachable radius branch and kept only the `category` and `skill` radius calculation.
- **Files modified:** `app/components/skills-knowledge-map.tsx`
- **Verification:** `npm run build`
- **Committed in:** `790cc8f`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix was local to the new hidden-core render path and did not change the intended behavior.

## Issues Encountered
- None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- The human-verification checkpoint can now review the real recruiter-facing behavior in the browser.
- Phase 5 can build on a stable map/timeline interaction contract instead of a duplicated surface.

---
*Phase: 04-knowledge-map-experience-contract*
*Completed: 2026-04-12*
