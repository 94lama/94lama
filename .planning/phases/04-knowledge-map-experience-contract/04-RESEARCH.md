# Phase 4 Research — Knowledge Map & Experience Contract

**Phase:** 4  
**Researched:** 2026-04-12  
**Confidence:** HIGH

## Research Summary

Phase 4 should stay within the existing stack and focus on the shared interaction contract between the knowledge map and the experience timeline.

- Keep `app/page.tsx` server-first.
- Introduce one small client coordinator for sections `01` and `02`.
- Replace the static skills grid in section `01` with the knowledge map.
- Remove the duplicate `02A` interactive block.
- Keep all experience entries visible; reorder and highlight matches instead of filtering non-matches away.
- Preserve a non-visual default/root selection even if the center sphere is removed from the rendered graph.

## Existing Codebase Findings

### Current structure

- `app/page.tsx` renders:
  - static skills grid in section `01`
  - static experience timeline in section `02`
  - duplicate interactive `02A` section via `ExperienceMapController`
- `app/components/experience-map-controller.tsx` already owns lifted `selection` state.
- `app/components/experience-map-section.tsx` currently couples map + filtered experience list in one duplicate block.
- `app/components/skills-knowledge-map.tsx` already exposes the useful controlled contract:
  - `selectedNodeId`
  - `activeIndex`
  - `onSelectionChange`

### Current risks

1. Experience matching is substring-based (`role + company + highlights`) and can drift.
2. The graph still renders and defaults to a visible `core` node.
3. The current interactive experience block filters to matches instead of keeping the full timeline visible.
4. Over-expanding the client boundary would fight Next.js 16 server/client guidance.

## Recommended Architecture

### Target boundary

Create a `KnowledgeExperienceCoordinator` client island that owns exactly one selection model and renders:

- map section content for `01`
- synced experience timeline content for `02`

Recommended shape:

```text
app/page.tsx
  ├─ server sections
  └─ KnowledgeExperienceCoordinator (client)
      ├─ KnowledgeMapSection / map UI
      └─ ExperienceTimelineSection
```

### Interaction contract

- One parent-owned `selection`
- Map writes selection
- Experience reads selection
- Default state remains available as a semantic root, even if not rendered as a visible sphere
- Matching entries move to the top
- Nonmatching entries remain visible and readable

## Implementation Guidance

### Knowledge map

- Reuse OGL implementation; do not add a new graph library.
- Remove the rendered center sphere from UX.
- Keep a hidden/default root state if needed for reset/fallback behavior.
- Spread nodes more spatially by changing graph generation/layout, not by replacing the renderer.

### Experience sync

- Prefer a pure ranking helper in `src/content/portfolio/`.
- Output should support:
  - `matchScore`
  - `isHighlighted`
  - stable ordering that preserves original CV order for ties
- Empty matches should fall back to the full list with explicit helper copy.

### Testing direction

There is already a Node test pattern in `tests/phase-03-contact-validation.test.ts`.

Phase 4 should add focused automated verification for:

- ranking/highlighting behavior
- full timeline visibility under selection
- page wiring no longer rendering the old skills grid / duplicate `02A` section

## Constraints To Honor

- Requirement coverage must include: `MAP-01`, `MAP-02`, `EXP-01`, `EXP-02`
- Do not add a state library.
- Do not add a new 3D or animation library.
- Keep the app single-page.
- Favor atomized composition, not an OOP rewrite.

## Relevant Files

- `app/page.tsx`
- `app/components/experience-map-controller.tsx`
- `app/components/experience-map-section.tsx`
- `app/components/skills-knowledge-map.tsx`
- `src/content/portfolio/types.ts`
- `tests/phase-03-contact-validation.test.ts`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/02-guides/single-page-applications.md`

## Recommendation

Plan Phase 4 as a structural interaction phase:

1. lock the shared selection + ranking contract first
2. restructure sections `01` and `02` around that contract
3. then update the graph rendering/layout to remove the center sphere and improve spacing
