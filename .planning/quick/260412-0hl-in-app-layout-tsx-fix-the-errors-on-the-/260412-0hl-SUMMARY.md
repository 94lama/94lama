---
phase: quick
plan: 260412-0hl
subsystem: ui
tags: [nextjs, app-router, layout, next-script, iubenda]
requires: []
provides:
  - legal embed footer isolated behind a Next-safe script boundary
  - root layout restored to valid App Router structure
affects: [app/layout.tsx, footer, legal embeds]
tech-stack:
  added: []
  patterns: ["Use next/script for third-party legal embeds in the root layout shell"]
key-files:
  created: [app/components/legal-embed-footer.tsx]
  modified: [app/layout.tsx, app/components/legal-embed-footer.tsx]
key-decisions:
  - "Keep the locked Iubenda anchor text and script bodies unchanged while moving script execution into next/script."
  - "Extract the legal footer into a dedicated component so the root layout stays valid and minimal."
patterns-established:
  - "Root layout keeps global shell markup only and delegates third-party footer integration to a dedicated component."
requirements-completed: []
duration: 2min
completed: 2026-04-12
---

# Phase quick Plan 260412-0hl: in-app-layout-tsx-fix-the-errors-on-the- Summary

**Next-safe Iubenda footer integration using a dedicated footer component and `next/script` inline boundaries**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-12T00:27:14Z
- **Completed:** 2026-04-12T00:29:35Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Moved the locked legal embed out of `app/layout.tsx` into a dedicated footer component.
- Replaced invalid inline `<script>` tags in the root layout tree with `next/script` boundaries.
- Preserved the Iubenda privacy and cookie anchor markup and script bodies while restoring a successful production build.

## Task Commits

Each task was committed atomically:

1. **Task 1: Isolate the legal embed from the root layout without altering its markup** - `c47fb6a` (fix)
2. **Task 2: Validate cookie/privacy behavior still loads through the new boundary** - `60c3873` (fix)

## Files Created/Modified
- `app/layout.tsx` - Imports the dedicated legal footer component instead of embedding invalid inline script markup directly in the root layout.
- `app/components/legal-embed-footer.tsx` - Hosts the locked Iubenda links and script bodies using `next/script` for a layout-safe integration boundary.

## Decisions Made
- Kept the third-party legal anchors and script bodies textually unchanged, only changing how they are mounted.
- Used `strategy="beforeInteractive"` in the extracted footer component because Next.js 16 docs explicitly allow site-wide critical scripts such as cookie managers in the root layout.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Narrowed lint verification to changed files**
- **Found during:** Task 1 (Isolate the legal embed from the root layout without altering its markup)
- **Issue:** Repository-wide `npm run lint` fails due to a pre-existing error in `app/components/experience-map-controller.tsx`, unrelated to this quick task.
- **Fix:** Verified the changed files directly with `npx eslint "app/layout.tsx" "app/components/legal-embed-footer.tsx"` after confirming the task-specific files were clean.
- **Files modified:** None
- **Verification:** `npx eslint "app/layout.tsx" "app/components/legal-embed-footer.tsx"`
- **Committed in:** c47fb6a (part of task commit context)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** No scope creep. The deviation only worked around an unrelated pre-existing lint blocker while preserving task verification for changed files.

## Issues Encountered
- `npm run lint` is currently blocked by an unrelated pre-existing React hook lint error in `app/components/experience-map-controller.tsx`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Root layout is safe to extend again without direct inline browser script tags.
- Full repository lint still needs a separate fix for `app/components/experience-map-controller.tsx` before global lint can pass.

## Self-Check: PASSED
- Found `app/layout.tsx`
- Found `app/components/legal-embed-footer.tsx`
- Found commit `c47fb6a`
- Found commit `60c3873`

---
*Phase: quick*
*Completed: 2026-04-12*
