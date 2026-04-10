---
quick_task: 260410-trc
tags: [nextjs, react, ogl, portfolio, visual-tuning]
key-files:
  created: []
  modified:
    - app/components/skills-knowledge-map.tsx
completed: 2026-04-10
---

# Quick Task 260410-trc Summary

**The 3D knowledge map now keeps unrelated dots noticeably more visible during selection, while the selected node and its direct neighbors still hold the strongest focus.**

## Accomplishments
- Rebalanced the node highlight opacity inside `syncHighlight` so non-selected nodes fade less aggressively.
- Preserved the existing interaction model, glow treatment, color blending, and scale hierarchy.
- Kept selected and neighboring nodes visually dominant without flattening the overall contrast.

## Files Created/Modified
- `app/components/skills-knowledge-map.tsx` - increased the baseline alpha used for dimmed nodes during selection states.

## Validation
- `npm run lint`
- `npm run build`

## Task Commits
- `69dc5ec` — `fix(260410-trc): raise dimmed node visibility`

## Deviations from Plan
None - plan executed exactly as written.

## Known Stubs
None.

## Self-Check: PASSED
- Found `.planning/quick/260410-trc-increase-the-opacity-of-the-unselected-d/260410-trc-SUMMARY.md`
- Found commit `69dc5ec`
