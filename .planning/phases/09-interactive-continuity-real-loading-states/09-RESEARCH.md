# Phase 9: Interactive Continuity & Real Loading States - Research

**Completed:** 2026-04-21
**Status:** Research complete

## Research Question

What is the smallest credible implementation path to preserve orientation across knowledge-map, panel, and timeline changes while adding only-real loading polish and keeping the app server-first?

## Findings

### 1. The current coordinator already owns the right state boundary

- `app/components/knowledge-experience-coordinator.tsx` owns the selection shared by the map and ranked experience timeline.
- `rankExperienceBySelection()` already preserves the full chronology while only changing emphasis and ordering.

Implication: continuity should extend this coordinator with pending and previous-selection state rather than introducing separate loading state owners in the panel or timeline.

### 2. The current viewport remounts on every selection change

- `app/components/knowledge-map/viewport.tsx` recreates the scene in a `useEffect` whose dependency list includes `selectedNodeId`.
- `runtime.ts` already exposes `syncHighlight()` separately from scene creation.

Implication: Phase 9 should split scene boot from highlight updates so selection changes do not recreate the OGL canvas. This is the main technical prerequisite for smooth map continuity.

### 3. Stable shells already exist around the panel and canvas

- `knowledge-map-panels.tsx` already has a persistent details card shell and canvas wrapper.
- The timeline already renders a persistent helper card plus the full list of entries.

Implication: the phase can preserve orientation by keeping these shells mounted and changing local emphasis, copy, and overlays in place. It does not need a new interactive layout structure.

### 4. Real loading boundaries are narrow and explicit in this app

- The page content comes from `getPortfolioContent()` in `app/page.tsx`, so most recruiter-facing copy is available immediately on the server.
- There is currently no `app/loading.tsx`, and the map scene is the clearest real delayed client surface.

Implication: placeholders should be limited to map readiness and optional route-level fallback. Hero, education, languages, relocation, and contact content should keep rendering as real content.

### 5. Route-level continuity should mirror page structure, not abstract it away

- `app/page.tsx` has a clear, repeatable structure: hero, knowledge/map-timeline area, education/languages grid, relocation/contact grid.
- `app/layout.tsx` already owns the stable root shell and footer.

Implication: `app/loading.tsx` can mirror that same vertical rhythm and region sizing with restrained placeholders, preserving the feeling that the same portfolio is loading.

### 6. Verification can stay concrete without over-investing in visual automation

The repo already uses Node tests to assert architecture and wiring contracts. Phase 9 can extend that pattern with checks for:

- viewport effect dependencies no longer recreating the scene on `selectedNodeId`
- presence of explicit pending or ready-state props in the coordinator and map shell wiring
- existence of `app/loading.tsx` with recognizable page regions
- build and test passes after the continuity changes

Manual checks remain necessary for visual continuity and perceived stability, but the plans can still require objective file-level evidence.

## Recommended Implementation Shape

1. Introduce pending continuity state in `KnowledgeExperienceCoordinator` and thread it through the map panel and timeline surfaces.
2. Refactor `KnowledgeMapViewport` so scene creation depends on graph and motion preferences, while highlight sync remains selection-driven.
3. Add truthful map-ready loading treatment inside the existing shells and keep previous context visible during handoff.
4. Add a structural `app/loading.tsx` route shell that mirrors the real page composition.
5. Add focused Node tests that lock the continuity wiring so later polish work does not regress back to remounts or fake loading.

## Risks To Avoid

- Recreating the OGL scene on each selection change and calling that continuity.
- Replacing panel or timeline shells wholesale during local pending states.
- Adding timer-driven skeletons that are not tied to a real pending boundary.
- Introducing a route shell that hides the page's structure behind a generic loading template.
- Folding Phase 10 responsive or layout-rewrite work into this phase.

## Open Questions (RESOLVED)

1. **Should map continuity use a new library?** RESOLVED: no by default; stay within React 19, CSS, and existing app code unless execution proves coordination is too brittle.
2. **Where are placeholders justified?** RESOLVED: map readiness and route-level loading only, unless execution finds another genuine async boundary.
3. **Should the timeline ever collapse to matched items only?** RESOLVED: no; keep the full chronology visible and change emphasis/order instead.

## Validation Architecture

### Test infrastructure

| Property | Value |
|----------|-------|
| Framework | Next.js build plus Node test runner |
| Config file | `package.json` |
| Quick run command | `npm run build` |
| Full suite command | `npm run build && npm test` |
| Estimated runtime | ~90 seconds |

### Feedback sampling

- After the continuity plumbing plan: run `npm run build`.
- After the route-shell and test-coverage plan: run `npm run build && npm test`.
- Use file-level acceptance criteria for viewport lifecycle, route shell presence, and continuity-state wiring so the phase is not judged only by subjective visual language.

## Output For Planning

Phase 9 should split into two execution plans:

1. coordinator, viewport, panel, and timeline continuity plumbing for `MOTN-04`, `LOAD-01`, and `LOAD-02`
2. route-level loading shell plus test and verification coverage for `LOAD-03` and the real-loading guardrails

That split keeps the higher-risk interactive lifecycle work isolated from the route fallback and verification pass while still preserving a simple two-wave phase.

---

*Phase: 09-interactive-continuity-real-loading-states*
*Research completed: 2026-04-21*
