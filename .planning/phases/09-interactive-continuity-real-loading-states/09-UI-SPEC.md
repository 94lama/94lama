# Phase 9: Interactive Continuity & Real Loading States - UI Design Contract

**Generated:** 2026-04-21
**Status:** Ready for planning

## Visual Intent

The interactive skills and experience area should feel continuous instead of rebuilt on every selection. Loading treatment should feel truthful and structural: preserve the page's recognizable geometry, keep stable shells visible, and use restrained placeholders only where a real wait exists.

## Experience Principles

1. Stable landmarks first: the panel shell, canvas shell, and full timeline stay recognizable while emphasis changes happen inside them.
2. Continuity beats replacement: selection changes should carry the current context forward briefly, then settle the next state into the same space.
3. Truthful loading only: placeholders appear only for real waits such as map boot or route-level fallback, never for already-available recruiter copy.
4. Shared motion carry-forward: continuity states extend the calmer Phase 8 motion family instead of inventing a separate loading aesthetic.
5. Structure over shimmer: route-level loading should mirror the real page composition and preserve orientation rather than feeling like a generic skeleton screen.

## Interactive Continuity Contract

### Map, panel, and timeline choreography

- `KnowledgeExperienceCoordinator` remains the single owner for active and pending selection state.
- Selecting a new hotspot should keep the previous panel and timeline state visible while the next emphasis is being resolved.
- The details panel should update inside a stable card shell with light dimming, copy transition, or emphasis overlays rather than a full remount.
- The experience timeline should keep the full chronology visible and only change rank/emphasis treatment while pending work settles.
- The OGL viewport should remain mounted through normal selection changes; continuity work should not recreate the scene for local transitions.

### Real loading boundaries

- Map boot can use a canvas-shaped placeholder or ready overlay if it corresponds to real scene readiness.
- Route-level loading can use a structural shell that mirrors hero, map/timeline, and lower grids.
- Static server-rendered copy such as hero summary, contact details, education, languages, and relocation content must not be replaced by fake skeletons.

### Motion and placeholder treatment

- Use subtle opacity, border, and surface-emphasis changes before heavier exit/enter choreography.
- Placeholder geometry should closely match the final panel, map, timeline, and lower-section layout.
- Motion remains restrained and recruiter-first; no spinner-first screens, theatrical intro, or page-wide loading drama.

## Targeted Surfaces

- `app/components/knowledge-experience-coordinator.tsx`: shared selection and pending continuity state.
- `app/components/skills-knowledge-map.tsx`: selection handoff and map readiness plumbing.
- `app/components/knowledge-map/knowledge-map-panels.tsx`: stable panel and canvas shells plus local continuity overlays.
- `app/components/knowledge-map/viewport.tsx`: ready-state handshake without local scene remount on selection changes.
- `app/components/knowledge-map/runtime.ts`: preserve runtime lifecycle isolation while highlight updates remain cheap.
- `app/components/experience-timeline-section.tsx` and `app/components/experience-card.tsx`: persistent chronology with coordinated emphasis treatment.
- `app/components/section-card-styles.ts`: shared continuity and placeholder surface tokens.
- `app/loading.tsx` plus optional `app/components/loading/*`: route-level loading shell aligned to the real page layout.

## Constraints

- Do not add fake waits or timer-driven skeletons.
- Do not remount the OGL scene on normal selection changes.
- Do not collapse the timeline into matched-only entries during continuity updates.
- Do not redesign page hierarchy or spacing rhythm here; Phase 10 owns that work.
- Do not add a heavy animation or skeleton dependency unless planning proves the current stack cannot express the required continuity.

## Acceptance Signals

- The interactive section preserves stable shells while selection-specific content and emphasis transition in place.
- Any placeholder or skeleton corresponds to a real readiness boundary.
- The route-level shell looks recognizably like the portfolio page, not a generic app loading screen.
- The timeline remains fully visible while related items move higher or gain emphasis from the same coordinator state.

---

*Phase: 09-interactive-continuity-real-loading-states*
*UI contract generated: 2026-04-21*
