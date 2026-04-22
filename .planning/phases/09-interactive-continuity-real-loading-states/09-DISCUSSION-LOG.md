# Phase 9: Interactive Continuity & Real Loading States - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-04-21
**Phase:** 9-Interactive Continuity & Real Loading States
**Areas discussed:** Real loading boundaries, Map-panel-timeline continuity, Pending-state presentation, Route-level loading shell

---

## Real Loading Boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| Real waits only | Reserve placeholders only for genuinely delayed surfaces such as map readiness or true route waits. | ✓ |
| Broad skeleton pass | Add skeletons across most sections for a more uniformly animated loading experience. | |
| No loading treatment | Avoid placeholders entirely and accept abrupt readiness differences. | |

**User's choice:** `[auto] Real waits only`
**Notes:** Auto-selected because the roadmap and requirements explicitly reject fake loading, and the current app is mostly server-rendered with the map island as the clearest true delayed surface.

---

## Map-Panel-Timeline Continuity

| Option | Description | Selected |
|--------|-------------|----------|
| Shared coordinator continuity | Keep one shared selection owner and coordinate map, detail panel, and timeline emphasis without remounting the interactive section. | ✓ |
| Surface-by-surface updates | Let each surface animate independently with loose synchronization. | |
| Hard swaps per selection | Replace panel and timeline content abruptly whenever a new hotspot is selected. | |

**User's choice:** `[auto] Shared coordinator continuity`
**Notes:** Auto-selected because `KnowledgeExperienceCoordinator` already owns the relevant shared state, and the milestone research explicitly recommends keeping pending continuity there.

---

## Pending-State Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Stable shells with in-place transition | Keep current shells and previous context visible while the next emphasis or detail state settles into the same space. | ✓ |
| Full-surface loading takeover | Replace the whole map, panel, or timeline surface with a dedicated loading screen on each update. | |
| Filtered-only timeline swaps | Collapse the timeline to only the matched items during transitions. | |

**User's choice:** `[auto] Stable shells with in-place transition`
**Notes:** Auto-selected because the panel and canvas shells already exist, and the current timeline pattern preserves full chronology instead of disorienting filtered-only swaps.

---

## Route-Level Loading Shell

| Option | Description | Selected |
|--------|-------------|----------|
| Structural page shell | Mirror the actual page layout with restrained placeholders so route-level waits still feel like the same portfolio. | ✓ |
| Generic spinner shell | Show a simple centered loading state regardless of page structure. | |
| No route-level shell | Leave route-level waits unshaped and rely entirely on browser/default behavior. | |

**User's choice:** `[auto] Structural page shell`
**Notes:** Auto-selected because the phase success criteria explicitly call for a route-level loading shell that preserves page structure and perceived continuity during real waits.

---

## the agent's Discretion

- Exact placeholder geometry, continuity timing, and whether CSS-only transitions are sufficient.
- Whether React transition primitives alone are enough or an optional motion helper is justified during planning.

## Deferred Ideas

- Responsive hierarchy and spacing rewrites belong to Phase 10.
- Final reduced-motion verification depth and broader polish guardrails belong to Phase 11.
