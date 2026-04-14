# Architecture Research

**Domain:** Brownfield one-page recruiter portfolio with a shared client-side OGL knowledge map
**Researched:** 2026-04-13
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Server composition layer                                             │
│ app/layout.tsx  → global shell, metadata, scripts, footer           │
│ app/page.tsx    → content load + section composition only            │
├──────────────────────────────────────────────────────────────────────┤
│ Server section layer                                                 │
│ HeroSection  EducationSection  LanguagesSection  RelocationSection   │
│ ContactSection  KnowledgeExperienceSectionShell                      │
├──────────────────────────────────────────────────────────────────────┤
│ Shared UI layer                                                      │
│ atoms: badges, chips, pills, icons, buttons                          │
│ molecules: section headings, meta rows, action groups, info cards    │
│ organisms: section shells, cards, panel compositions                 │
├──────────────────────────────────────────────────────────────────────┤
│ Client feature island                                                │
│ KnowledgeExperienceCoordinator                                       │
│   ├── SkillsKnowledgeMap                                             │
│   │   ├── ui/ panels + controls                                      │
│   │   ├── hooks/ selection + reduced motion + scene lifecycle        │
│   │   ├── model/ graph creation + normalization                      │
│   │   └── ogl/ scene, shaders, animation, picking, highlight         │
│   └── ExperienceTimelineSection                                      │
├──────────────────────────────────────────────────────────────────────┤
│ Content / domain layer                                               │
│ getPortfolioContent → PortfolioContent → rankExperienceBySelection   │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `app/page.tsx` | Thin server composition root | Fetch `PortfolioContent`, derive simple view-model arrays, compose section organisms only |
| Server sections | Render stable recruiter-facing markup | Pure server components receiving already-typed content slices |
| Shared atoms/molecules | Reusable visual primitives and small compositions | Stateless components backed by `section-card-styles.ts` recipes |
| `KnowledgeExperienceCoordinator` | Own shared selection state for sections 01 and 02 | Single client island with `useState`, `useMemo`, pure ranking/model helpers |
| `SkillsKnowledgeMap` | Feature-level composition for map UI + canvas | Small client organism delegating graph/model/runtime work to submodules |
| OGL engine modules | Build, animate, pick, and dispose the 3D scene | Pure helpers + one lifecycle hook around `useEffect` |

## Recommended Project Structure

```text
app/
├── layout.tsx                                 # keep as root shell
├── page.tsx                                   # thin server composition root
├── components/
│   ├── atoms/                                 # NEW: smallest reusable UI pieces
│   │   ├── icon-email.tsx
│   │   ├── icon-social.tsx
│   │   ├── section-index-badge.tsx
│   │   ├── chip.tsx
│   │   ├── pill.tsx
│   │   └── action-link.tsx
│   ├── molecules/                             # NEW: small reusable compositions
│   │   ├── section-heading.tsx
│   │   ├── meta-pair.tsx
│   │   ├── tag-list.tsx
│   │   ├── bullet-list.tsx
│   │   └── contact-action-group.tsx
│   ├── organisms/                             # NEW: section-sized building blocks
│   │   ├── hero-section.tsx
│   │   ├── education-section.tsx
│   │   ├── languages-section.tsx
│   │   ├── relocation-section.tsx
│   │   ├── contact-section.tsx
│   │   ├── section-shell.tsx
│   │   └── section-grid.tsx
│   ├── features/                              # NEW: feature-specific client/server modules
│   │   └── knowledge-map/
│   │       ├── knowledge-experience-coordinator.tsx      # MODIFIED
│   │       ├── skills-knowledge-map.tsx                   # MODIFIED, much smaller
│   │       ├── experience-timeline-section.tsx            # move or re-export
│   │       ├── ui/
│   │       │   ├── knowledge-map-sidebar.tsx
│   │       │   ├── knowledge-map-selection-panel.tsx
│   │       │   ├── knowledge-map-connected-points.tsx
│   │       │   ├── knowledge-map-category-grid.tsx
│   │       │   ├── knowledge-map-canvas-panel.tsx
│   │       │   └── knowledge-map-legend.tsx
│   │       ├── hooks/
│   │       │   ├── use-knowledge-map-controller.ts
│   │       │   ├── use-knowledge-map-scene.ts
│   │       │   └── use-reduced-motion.ts
│   │       ├── model/
│   │       │   ├── knowledge-map-types.ts
│   │       │   ├── knowledge-map-constants.ts
│   │       │   ├── create-knowledge-graph.ts
│   │       │   └── selection.ts
│   │       └── ogl/
│   │           ├── shaders.ts
│   │           ├── build-scene.ts
│   │           ├── update-highlight.ts
│   │           ├── project-nodes.ts
│   │           ├── pick-node.ts
│   │           └── animate-scene.ts
│   ├── legal-footer.tsx                        # keep
│   └── section-card-styles.ts                  # keep, expand as token/recipe source
src/
└── content/portfolio/
    ├── get-portfolio-content.ts               # keep server-only
    ├── rank-experience-by-selection.ts        # keep pure domain helper
    └── types.ts                               # keep canonical content contracts
```

### Structure Rationale

- **Keep `app/page.tsx` and `app/layout.tsx` where they are:** this preserves App Router conventions and the current server-first rendering model. Next.js 16 still defaults pages and layouts to Server Components, which is the right baseline here. Source: Next.js docs, last updated 2026-04-08.
- **Introduce `atoms/`, `molecules/`, and `organisms/` under `app/components/`:** this atomizes the rendered app without forcing a risky cross-repo move.
- **Put the knowledge map under `components/features/knowledge-map/`:** the map is not shared generic UI; it is a feature with its own model, runtime, and UI.
- **Keep content/domain logic in `src/content/portfolio/`:** it is already a good non-UI boundary and should not be pulled into the component tree.

## Recommended Integration Into The Existing App

### New vs Modified Modules

| Status | Module | Recommendation |
|--------|--------|----------------|
| **Modify** | `app/page.tsx` | Reduce to content fetch + section composition only. Remove inline helper components and section markup. |
| **Modify** | `app/layout.tsx` | Keep server-only. Optionally extract global script/footer wrappers only if it reduces clutter; do not over-atomize. |
| **Modify** | `app/components/knowledge-experience-coordinator.tsx` | Keep the client-island responsibility, but move to feature folder and strip duplicate heading/presentational code. |
| **Modify** | `app/components/skills-knowledge-map.tsx` | Convert from monolith to feature composer over model/hooks/ui/ogl modules. |
| **Modify** | `app/components/experience-timeline-section.tsx` | Treat as feature organism; optionally relocate under `features/knowledge-map/`. |
| **Modify** | `app/components/section-card-styles.ts` | Keep as shared token/recipe module; let atoms/molecules consume it rather than duplicating class strings. |
| **New** | `app/components/atoms/*` | Extract icons, chips, pills, action links, and other repeated leaf UI from `app/page.tsx`. |
| **New** | `app/components/molecules/*` | Extract `SectionHeading`, metadata rows, tag groups, CTA clusters, and small cards. |
| **New** | `app/components/organisms/*` | Create server section components for hero, education, languages, relocation, and contact. |
| **New** | `app/components/features/knowledge-map/model/*` | Isolate graph constants, graph generation, and selection normalization into pure testable modules. |
| **New** | `app/components/features/knowledge-map/ogl/*` | Isolate OGL setup, animation, picking, projection, highlight syncing, and shader strings. |
| **New** | `app/components/features/knowledge-map/ui/*` | Split side panel, legend, connected points, category buttons, and canvas frame into focused presentational parts. |

### Server vs Client Boundaries

**Keep on the server:**
- `app/layout.tsx`
- `app/page.tsx`
- Hero / education / languages / relocation / contact section organisms
- `getPortfolioContent()` and all direct file reads

**Keep on the client:**
- `KnowledgeExperienceCoordinator`
- `SkillsKnowledgeMap`
- all OGL scene lifecycle code
- any reduced-motion, pointer, resize, or selection hooks

**Why:** Next.js recommends pushing `'use client'` as deep as possible because that boundary pulls all imports beneath it into the client bundle. This milestone should narrow, not spread, the client graph. Source: Next.js Server and Client Components docs, v16.2.3.

### Page-Level Atomic Layering

#### Atoms
- `SectionIndexBadge`
- `EyebrowText` or shared eyebrow class wrapper
- `Chip`
- `Pill`
- `ActionLink`
- `IconEmail`
- `IconSocial`

These replace the current page-local `EmailIcon`, `ContactLink`, and `ContactIconLink` without changing markup semantics.

#### Molecules
- `SectionHeading`
- `MetaPair` for “Based in” / “Relocation” style pairs
- `ContactActionGroup` for email + secondary actions
- `TagList` for preferred regions and selection labels
- `InfoCard` / `StatCard` wrappers for repeated bordered-card blocks

These remove duplication in `app/page.tsx` and `KnowledgeExperienceCoordinator` first.

#### Organisms
- `HeroSection`
- `EducationSection`
- `LanguagesSection`
- `RelocationSection`
- `ContactSection`
- existing `ExperienceCard` remains a strong card-level organism/molecule boundary

Each organism should receive a single typed content slice and render no local data fetching or client state.

## Knowledge Map Decomposition

### Recommended OGL Split

The current `SkillsKnowledgeMap` file should be decomposed into four layers, not dozens of tiny files.

#### 1. Model layer (pure, testable)
- `knowledge-map-types.ts`: `GraphNode`, `GraphEdge`, `KnowledgeMapSelection`, `ProjectedNode`
- `knowledge-map-constants.ts`: `CATEGORY_COLORS`, `CROSS_DOMAIN_MEMBERSHIPS`, `RELATED_SKILL_LINKS`
- `create-knowledge-graph.ts`: current `createGraph()` and small math helpers
- `selection.ts`: `createRootSelection()`, normalization helpers, selected metadata derivation

This is the safest first extraction because it has no DOM or OGL dependency.

#### 2. OGL engine layer (imperative runtime)
- `shaders.ts`: node and edge shader source
- `build-scene.ts`: renderer, camera, graph transform, node meshes, edge meshes, disposal
- `animate-scene.ts`: bobbing + rotation interpolation
- `project-nodes.ts`: world/projected node calculations for picking
- `pick-node.ts`: hit testing from client coordinates
- `update-highlight.ts`: current `syncHighlight()` logic

This keeps render-time React code pure and pushes side effects into one lifecycle boundary, which aligns with React guidance that side effects belong outside render. Source: React docs on component purity.

#### 3. Hook/controller layer
- `use-reduced-motion.ts`: wraps `matchMedia`
- `use-knowledge-map-scene.ts`: mount/unmount canvas, resize observer, pointer listeners, animation frame, calls OGL engine helpers
- `use-knowledge-map-controller.ts`: resolves controlled/uncontrolled selection, active group, selected neighbors, labels, and button actions

This is the seam between React and OGL.

#### 4. UI composition layer
- `knowledge-map-selection-panel.tsx`
- `knowledge-map-connected-points.tsx`
- `knowledge-map-category-grid.tsx`
- `knowledge-map-canvas-panel.tsx`
- `knowledge-map-legend.tsx`
- `knowledge-map-sidebar.tsx`

`SkillsKnowledgeMap.tsx` should mostly assemble these pieces and pass props.

### Boundary Rule For The Map

**Do not split by visual chunk alone. Split by responsibility:**
- pure graph math
- imperative OGL runtime
- React control state
- presentational UI

That gives maintainability without scattering one interaction across ten shallow wrappers.

## Architectural Patterns

### Pattern 1: Thin server composition root

**What:** `app/page.tsx` loads content once, then composes sections.
**When to use:** Everywhere in this app except the interactive map feature.
**Trade-offs:** Slightly more files, much better change isolation.

**Example:**
```tsx
export default async function Home() {
  const content = await getPortfolioContent();

  return (
    <main>
      <HeroSection hero={content.hero} contact={content.contact} relocation={content.relocation} summary={content.summary} />
      <KnowledgeExperienceCoordinator skillGroups={content.skills} experience={content.experience} />
      <EducationSection education={content.education} />
      <LanguagesSection languages={content.languages} />
      <RelocationSection relocation={content.relocation} />
      <ContactSection contact={content.contact} />
    </main>
  );
}
```

### Pattern 2: Client feature island around shared state

**What:** Keep sections 01 and 02 under one client coordinator because they share selection state.
**When to use:** When two adjacent surfaces must stay synchronized.
**Trade-offs:** Slightly larger island than a single widget, but avoids prop-drilling and split-brain state.

**Example:**
```tsx
"use client";

export function KnowledgeExperienceCoordinator({ skillGroups, experience }: Props) {
  const controller = useKnowledgeExperienceController({ skillGroups, experience });

  return (
    <>
      <SkillsKnowledgeMap {...controller.mapProps} />
      <ExperienceTimelineSection {...controller.timelineProps} />
    </>
  );
}
```

### Pattern 3: React shell around imperative renderer

**What:** React owns layout and state; OGL owns canvas internals behind a hook/runtime boundary.
**When to use:** Any canvas/WebGL subfeature in this app.
**Trade-offs:** Requires disciplined prop contracts, but prevents a JSX file from becoming an engine file.

**Example:**
```tsx
function KnowledgeMapCanvasPanel(props: CanvasPanelProps) {
  const viewportRef = useKnowledgeMapScene(props.sceneArgs);

  return <div ref={viewportRef} className="absolute inset-0" />;
}
```

## Data Flow

### Request Flow

```text
Request
  ↓
app/layout.tsx
  ↓
app/page.tsx
  ↓
getPortfolioContent()
  ↓
Server section organisms + client props for KnowledgeExperienceCoordinator
  ↓
Client selection state changes
  ↓
rankExperienceBySelection() + map highlight updates
```

### State Management

```text
KnowledgeExperienceCoordinator state
    ↓
normalized selection
    ├── SkillsKnowledgeMap UI state/labels
    ├── OGL highlight + picking sync
    └── ranked experience entries/helper copy
```

### Key Data Flows

1. **Static content flow:** `cv.json` → `getPortfolioContent()` → server section organisms.
2. **Interactive recruiter flow:** selected map node → normalized selection → experience ranking + map highlight update.
3. **Canvas interaction flow:** pointer event → projected node pick → controller selection update → UI and timeline refresh.

## Build Order For Incremental Refactor

1. **Extract shared atoms and molecules first**
   - Move `EmailIcon`, `ContactLink`, `ContactIconLink`, and duplicated `SectionHeading` out of `app/page.tsx` and `KnowledgeExperienceCoordinator`.
   - Lowest regression risk; immediate deduplication.

2. **Extract server section organisms from `app/page.tsx`**
   - `HeroSection`, `EducationSection`, `LanguagesSection`, `RelocationSection`, `ContactSection`.
   - Keep props close to current content shape to avoid transformation bugs.

3. **Thin `app/page.tsx` to composition only**
   - Once sections are extracted, remove local helpers and inline block markup.

4. **Stabilize the feature boundary for sections 01 and 02**
   - Move/rename `KnowledgeExperienceCoordinator` into a feature folder, but keep its external API unchanged.
   - This reduces import churn while internals are being split.

5. **Extract pure knowledge-map model logic**
   - Move constants, graph creation, selection helpers, and related derivations into `model/`.
   - Add or extend tests here first; this is the safest place to lock behavior.

6. **Extract OGL engine helpers behind one hook**
   - Build `use-knowledge-map-scene.ts` and move renderer lifecycle, resize, animation, projection, picking, and cleanup behind it.
   - Keep the current `SkillsKnowledgeMap` public props unchanged during this step.

7. **Split map UI panels last**
   - Sidebar, legend, connected points, category grid, and canvas panel.
   - By doing this after controller/runtime extraction, UI splits become mechanical.

8. **Optional cleanup in `app/layout.tsx`**
   - Only after page and map refactors are stable. Layout is not the risk hotspot.

This order minimizes regression risk because it goes from pure presentational extraction → server composition cleanup → pure model extraction → imperative engine extraction.

## Anti-Patterns

### Anti-Pattern 1: Turning the whole page into a client tree

**What people do:** Move section extraction into a top-level `'use client'` page or provider because the map is interactive.
**Why it's wrong:** It increases bundle size and breaks the current server-first architecture for no product gain.
**Do this instead:** Keep one client island around the shared map/timeline feature only.

### Anti-Pattern 2: Splitting the OGL file by arbitrary line count

**What people do:** Create many tiny files that still share hidden mutable scene state.
**Why it's wrong:** The code becomes harder to trace and easier to break.
**Do this instead:** Split by responsibility: model, controller hooks, engine helpers, and UI panels.

### Anti-Pattern 3: Combining folder moves with behavior changes

**What people do:** Reorganize files and tweak interaction logic at the same time.
**Why it's wrong:** Brownfield regressions become hard to isolate, especially in the map.
**Do this instead:** Preserve public props and recruiter-facing behavior while changing internals underneath.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Iubenda widget | Keep in `app/layout.tsx` root shell | Global concern; not worth atomizing into small UI pieces |
| Google Tag Manager | Keep in `app/layout.tsx` root shell | Same rationale; global infrastructure, not page composition |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `app/page.tsx` ↔ server section organisms | typed props | No section should fetch its own portfolio data |
| `app/page.tsx` ↔ `KnowledgeExperienceCoordinator` | serializable props | Pass only `skillGroups` and `experience` |
| coordinator ↔ map model | direct pure function calls | Good place for tests |
| coordinator ↔ OGL scene hook | hook args + callback props | Stable contract required during refactor |
| map UI ↔ selection controller | props/events | No direct scene mutation from UI panels |
| OGL engine ↔ React tree | `useEffect` lifecycle only | Avoid side effects during render |

## Sources

- Local code inspection:
  - `/workspaces/94lama/app/page.tsx`
  - `/workspaces/94lama/app/layout.tsx`
  - `/workspaces/94lama/app/components/knowledge-experience-coordinator.tsx`
  - `/workspaces/94lama/app/components/skills-knowledge-map.tsx`
  - `/workspaces/94lama/app/components/experience-timeline-section.tsx`
  - `/workspaces/94lama/app/components/experience-card.tsx`
  - `/workspaces/94lama/app/components/section-card-styles.ts`
  - `/workspaces/94lama/src/content/portfolio/get-portfolio-content.ts`
  - `/workspaces/94lama/src/content/portfolio/rank-experience-by-selection.ts`
- Next.js docs: Server and Client Components — https://nextjs.org/docs/app/getting-started/server-and-client-components (version 16.2.3, last updated 2026-04-08) — HIGH confidence
- Next.js docs: `layout.js` file convention — https://nextjs.org/docs/app/api-reference/file-conventions/layout (version 16.2.3, last updated 2026-04-08) — HIGH confidence
- React docs: Components and Hooks must be pure — https://react.dev/reference/rules/components-and-hooks-must-be-pure — HIGH confidence

---
*Architecture research for: v1.1 atomization of components*
*Researched: 2026-04-13*
