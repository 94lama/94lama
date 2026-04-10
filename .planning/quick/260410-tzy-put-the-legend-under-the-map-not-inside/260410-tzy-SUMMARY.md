---
quick_task: 260410-tzy
tags: [nextjs, react, portfolio, knowledge-map, layout]
key-files:
  created: []
  modified:
    - app/components/skills-knowledge-map.tsx
completed: 2026-04-10
---

# Quick Task 260410-tzy Summary

**The knowledge-map legend now sits below the 3D map card, keeping the interactive viewport visually cleaner while preserving the same recruiter-facing guidance.**

## Accomplishments
- Ended the 3D map card after the interaction hint instead of nesting the legend inside the viewport wrapper.
- Rendered the legend as its own aligned block beneath the map on the right-hand column.
- Preserved the existing legend labels, knowledge sizing cues, selection behavior, and OGL viewport structure.
- Confirmed the client component change still respects the current Next.js App Router client-component boundary guidance.

## Files Created/Modified
- `app/components/skills-knowledge-map.tsx` - moved the legend panel out of the map card and kept it visually aligned below the viewport.

## Validation
- `npm run lint`
- `npm run build`

## Task Commits
- `5e400a9` — `feat(260410-tzy): move knowledge map legend below viewport`

## Deviations from Plan
None - plan executed exactly as written.

## Known Stubs
None.

## Self-Check: PASSED
- Found `.planning/quick/260410-tzy-put-the-legend-under-the-map-not-inside/260410-tzy-SUMMARY.md`
- Found commit `5e400a9`
