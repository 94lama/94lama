# Architecture Research

**Domain:** UX/UI integration for an existing recruiter-facing one-page portfolio
**Researched:** 2026-04-21
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Server shell                                                               │
│ app/layout.tsx → metadata, fonts, scripts, legal footer                    │
│ app/page.tsx   → load cv.json once, compose sections in recruiter order     │
├────────────────────────────────────────────────────────────────────────────┤
│ Server-rendered content sections                                            │
│ HeroSection → Education/Languages → Relocation/Contact                      │
│ Keep semantic order and SEO-visible content in HTML                         │
├────────────────────────────────────────────────────────────────────────────┤
│ Thin client wrappers                                                        │
│ motion/RevealOnScroll → section reveals, micro-interaction state            │
│ loading/KnowledgeMapSkeleton → client-only boot placeholder                 │
├────────────────────────────────────────────────────────────────────────────┤
│ Main client island                                                          │
│ KnowledgeExperienceCoordinator                                              │
│   ├── SkillsKnowledgeMap                                                    │
│   │   ├── knowledge-map-panels.tsx                                          │
│   │   ├── viewport.tsx                                                      │
│   │   ├── runtime.ts                                                        │
│   │   ├── model.ts                                                          │
│   │   └── selection.ts                                                      │
│   └── ExperienceTimelineSection                                             │
├────────────────────────────────────────────────────────────────────────────┤
│ Content/domain layer                                                        │
│ getPortfolioContent() → typed content → rankExperienceBySelection()         │
└────────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `app/page.tsx` | Server composition root only | Fetch content once, compose sections, no motion state |
| `SectionShell` + `section-card-styles.ts` | Shared spacing, surface, and motion tokens | Server-safe class recipes with variant props |
| `motion/*` | Progressive reveal and small interaction polish | Tiny client wrappers around already-server-rendered children |
| `loading/*` | Skeletons only where content is genuinely pending | Mostly client-island boot/pending placeholders |
| `KnowledgeExperienceCoordinator` | Shared state between map and timeline | One client island with selection + pending state |
| `knowledge-map/runtime.ts` | OGL-only scene lifecycle and adaptive quality | Imperative scene API, no section layout ownership |

## Recommended Project Structure

```text
app/
├── layout.tsx                                   # keep server root shell
├── page.tsx                                     # keep thin server composition root
├── loading.tsx                                  # NEW optional route-shell fallback
└── components/
    ├── hero-section.tsx                         # MODIFIED: reveal hooks + rhythm variants only
    ├── education-section.tsx                    # MODIFIED: same
    ├── languages-section.tsx                    # MODIFIED: same
    ├── relocation-section.tsx                   # MODIFIED: same
    ├── contact-section.tsx                      # MODIFIED: same
    ├── experience-timeline-section.tsx          # MODIFIED: transition/pending props
    ├── experience-card.tsx                      # MODIFIED: reorder/highlight motion classes
    ├── section-shell.tsx                        # MODIFIED: spacing-density + reveal slots
    ├── section-card-styles.ts                   # MODIFIED: motion/rhythm token source
    ├── knowledge-experience-coordinator.tsx     # MODIFIED: selection transition ownership
    ├── skills-knowledge-map.tsx                 # MODIFIED: map composition + ready state
    ├── motion/                                  # NEW
    │   ├── motion-tokens.ts
    │   ├── reveal-on-scroll.tsx
    │   ├── section-transition.tsx
    │   └── use-reduced-motion.ts
    ├── loading/                                 # NEW
    │   ├── route-shell-skeleton.tsx
    │   ├── knowledge-map-skeleton.tsx
    │   └── timeline-pending-overlay.tsx
    ├── layout/                                  # NEW
    │   ├── page-rhythm.ts
    │   └── responsive-section-grid.tsx
    └── knowledge-map/
        ├── knowledge-map-panels.tsx             # MODIFIED: shell + overlay ownership
        ├── viewport.tsx                         # MODIFIED: emits ready/interaction callbacks
        ├── runtime.ts                           # MODIFIED: scene API, adaptive quality policy
        ├── model.ts                             # keep pure
        └── selection.ts                         # keep pure
```

### Structure Rationale

- **Do not do another major folder migration in v1.2.** v1.1 already paid the structural refactor cost. v1.2 should be additive and low-risk.
- **Add `motion/`, `loading/`, and `layout/` beside existing components.** These are the new architectural concerns in this milestone.
- **Keep the knowledge-map files where they are.** Improve them internally, but preserve OGL isolation and import stability.

## Recommended Architecture For v1.2

### 1. Motion system: add wrappers, not a client-wide provider

Use a **token-first motion system** built on Tailwind classes/CSS variables plus a few narrow client wrappers.

**Add:**
- `app/components/motion/motion-tokens.ts`
- `app/components/motion/reveal-on-scroll.tsx`
- `app/components/motion/section-transition.tsx`
- `app/components/motion/use-reduced-motion.ts`

**Modify:**
- `app/components/section-card-styles.ts`
- `app/components/section-shell.tsx`
- `app/components/section-heading.tsx`
- CTA/button components in `contact-actions.tsx`

**Ownership:**
- `motion-tokens.ts` owns durations, easing, stagger, hover/press distances, and reduced-motion fallbacks.
- `RevealOnScroll` owns IntersectionObserver-based enter transitions for already-rendered server content.
- `SectionShell` accepts variant props like `density="comfortable|compact"` and optional `reveal` config, but stays server-renderable.

**Why this fits the current architecture:**
- Next.js pages/layouts remain Server Components by default, which keeps initial HTML and SEO safe. Use client wrappers only where browser APIs are needed. Source: Next.js Server and Client Components docs, v16.2.4, updated 2026-04-15.
- A server section can render inside a client wrapper without turning the whole page into a client tree. Use that pattern for reveal effects, not for content ownership. Source: same Next.js doc, “Interleaving Server and Client Components”.

**Recommendation:**
- Do **not** add a heavy animation library for this milestone.
- Use native CSS transitions for cards/buttons/reveals.
- Reserve imperative animation for OGL only.

### 2. Skeleton/loading states: only for real pending states

The page currently loads a local JSON file once on the server. That means most recruiter-facing copy is available immediately in server HTML. So skeletons should be **surgical**, not global.

**Add:**
- `app/loading.tsx` → optional route-shell fallback for cold navigations only
- `app/components/loading/route-shell-skeleton.tsx`
- `app/components/loading/knowledge-map-skeleton.tsx`
- `app/components/loading/timeline-pending-overlay.tsx`

**Modify:**
- `app/components/skills-knowledge-map.tsx`
- `app/components/knowledge-map/viewport.tsx`
- `app/components/knowledge-map/knowledge-map-panels.tsx`
- `app/components/knowledge-experience-coordinator.tsx`

**Recommended behavior:**
- **Route-level loading:** `app/loading.tsx` can mirror the page shell, but value is limited because this is a one-page app with a fast local content source.
- **Map boot loading:** show `KnowledgeMapSkeleton` inside `KnowledgeMapCanvasShell` until the OGL scene reports ready.
- **Timeline interaction pending:** when selection changes, keep the current timeline visible and show a subtle pending overlay/state badge instead of blanking cards.
- **Do not skeletonize hero/contact/education copy on first render.** That content is SEO-visible server content and should appear as real content, not placeholders.

**Why this fits the current architecture:**
- Next.js `loading.tsx` is appropriate for route-segment fallback UI and streams from the server, but it is for route loading, not for every local interaction. Source: Next.js `loading.js` docs, v16.2.4, updated 2026-04-15.
- React Suspense boundaries should match real loading sequences, not be placed around everything. Source: React Suspense docs.

### 3. Responsive restructuring: move layout logic into server-safe layout recipes

Use **CSS-first layout recipes**, not client resize listeners.

**Add:**
- `app/components/layout/page-rhythm.ts`
- `app/components/layout/responsive-section-grid.tsx`

**Modify:**
- `app/page.tsx`
- `app/components/hero-section.tsx`
- `app/components/education-section.tsx`
- `app/components/languages-section.tsx`
- `app/components/relocation-section.tsx`
- `app/components/contact-section.tsx`
- `app/components/section-shell.tsx`

**Ownership:**
- `page-rhythm.ts` exports spacing/padding/gap recipes for mobile, tablet, desktop, and xl.
- `responsive-section-grid.tsx` owns layout pairings like education/languages and relocation/contact.
- Section components stay responsible for section internals only, not page orchestration.

**Rule:** keep DOM order identical to recruiter reading order:
1. Hero
2. Skills
3. Experience
4. Education
5. Languages
6. Relocation
7. Contact

Visual rearrangement is fine through CSS grid, but **do not reorder DOM for desktop cosmetics**. That protects scan flow, accessibility, and SEO.

### 4. Map interaction polish: coordinator owns state, runtime owns rendering

The map is already well split. v1.2 should keep that split and add a clearer contract between UI state and OGL state.

**Modify:**
- `app/components/knowledge-experience-coordinator.tsx`
- `app/components/skills-knowledge-map.tsx`
- `app/components/knowledge-map/knowledge-map-panels.tsx`
- `app/components/knowledge-map/viewport.tsx`
- `app/components/knowledge-map/runtime.ts`

**Keep unchanged in role:**
- `app/components/knowledge-map/model.ts`
- `app/components/knowledge-map/selection.ts`

**New responsibilities:**
- `KnowledgeExperienceCoordinator` should own:
  - selected node state
  - `isPending` selection-transition state
  - derived ranked experience
- `SkillsKnowledgeMap` should own:
  - map-ready state for skeleton handoff
  - map-panel composition
  - passing stable callbacks into viewport/runtime
- `viewport.tsx` should own:
  - mount/unmount bridge only
  - `onSceneReady`, `onPickNode`, and optional `onInteractionStateChange`
- `runtime.ts` should own:
  - renderer creation/destruction
  - drag/rotate/bobbing policy
  - compact-screen quality tuning
  - highlight sync

**Important boundary:**
- UI panels must never mutate OGL objects directly.
- They emit intent (`focus node`, `reset`, `hover label`, `show pending`) back up to the coordinator/map composer.
- The runtime stays a pure imperative engine behind `viewport.tsx`.

## Architectural Patterns

### Pattern 1: Server section inside client reveal wrapper

**What:** Keep content server-rendered, add motion with a tiny client shell.
**When to use:** Section reveals, staggered list entrances, subtle CTA polish.
**Trade-offs:** Slight client JS cost, but much smaller than converting sections to client components.

**Example:**
```tsx
import { RevealOnScroll } from "@/app/components/motion/reveal-on-scroll";

export function EducationSection({ education }: Props) {
  return (
    <RevealOnScroll preset="section">
      <SectionShell density="comfortable">
        {/* server-rendered content */}
      </SectionShell>
    </RevealOnScroll>
  );
}
```

### Pattern 2: Persistent content + pending overlay

**What:** Never replace already-visible map/timeline content with blank loading UI during interaction.
**When to use:** Map selection changes and timeline resorting.
**Trade-offs:** Slightly more state wiring, much better perceived continuity.

**Example:**
```tsx
const [isPending, startTransition] = useTransition();

function handleSelection(next: KnowledgeMapSelection) {
  startTransition(() => setSelection(next));
}

<ExperienceTimelineSection
  entries={ranked.entries}
  helperCopy={ranked.helperCopy}
  isFallback={ranked.isFallback}
  isPending={isPending}
/>
```

### Pattern 3: OGL readiness handoff

**What:** Show a canvas-shaped skeleton until the scene is mounted and first render completed.
**When to use:** Initial hydration of the map client island.
**Trade-offs:** Adds a small ready-state handshake, but avoids a dead/blank canvas box.

**Example:**
```tsx
<KnowledgeMapCanvasShell>
  {!isSceneReady ? <KnowledgeMapSkeleton /> : null}
  <KnowledgeMapViewport
    graphData={graphData}
    selectedNodeId={selectedNodeId}
    onPickNode={applySelection}
    onSceneReady={() => setSceneReady(true)}
  />
</KnowledgeMapCanvasShell>
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
server-rendered sections in final DOM order
  ↓
client hydration for motion wrappers + knowledge map island
  ↓
KnowledgeMapViewport boots OGL scene
  ↓
scene ready → map skeleton fades out
```

### State Management

```text
KnowledgeExperienceCoordinator
    ↓ owns
selection + isPending
    ├── SkillsKnowledgeMap (panels + viewport props)
    ├── rankExperienceBySelection()
    └── ExperienceTimelineSection (reordered cards + pending overlay)
```

### Key Data Flows

1. **Initial page load:** `cv.json` → `getPortfolioContent()` → server sections render real recruiter-facing content.
2. **Section motion:** server section markup → `RevealOnScroll` client wrapper → visible enter transition only.
3. **Map boot:** `SkillsKnowledgeMap` mounts → `viewport.tsx` creates scene via `runtime.ts` → `onSceneReady` clears canvas skeleton.
4. **Map selection:** user click/tap/button → coordinator transition update → ranked timeline recalculates → map highlight syncs.
5. **Responsive restructuring:** `app/page.tsx` composes same sections in same DOM order → `responsive-section-grid.tsx` changes only visual grouping.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current single-page portfolio | Current architecture is enough; optimize polish, not topology |
| More sections/content density | Add more server sections and reuse motion/layout recipes |
| More interactive visualizations | Add separate client islands; do not expand the map island into page-wide state |

### Scaling Priorities

1. **First bottleneck:** too much client JS from over-wrapping sections. Fix by keeping motion wrappers tiny and server content pure.
2. **Second bottleneck:** mobile GPU cost in OGL runtime. Fix in `runtime.ts` with compact-screen quality policy before touching page architecture.

## Anti-Patterns

### Anti-Pattern 1: Fake skeletons over real SSR content

**What people do:** Replace server-rendered hero/summary/contact content with placeholders just to look "modern".
**Why it's wrong:** Hurts scan speed and weakens the recruiter-first value prop.
**Do this instead:** Render real server content immediately and animate it in lightly.

### Anti-Pattern 2: Motion provider at the page root

**What people do:** Wrap `<main>` or the whole page in a client motion shell.
**Why it's wrong:** Pulls too much of the tree into the client bundle.
**Do this instead:** Add client wrappers only around sections or controls that need browser APIs.

### Anti-Pattern 3: Letting map UI own runtime state

**What people do:** Panels/buttons reach into OGL scene internals.
**Why it's wrong:** Couples layout polish to rendering engine details and makes regressions hard to isolate.
**Do this instead:** Keep coordinator intent-driven; keep runtime imperative and isolated.

### Anti-Pattern 4: Responsive behavior via `window.innerWidth` state

**What people do:** Move layout decisions into client hooks.
**Why it's wrong:** Causes hydration risk and unnecessary JS.
**Do this instead:** Use CSS grid/layout recipes and only use JS for map runtime quality tuning.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Iubenda widget | Leave in `app/layout.tsx` | Global shell concern; unrelated to UX motion architecture |
| GTM | Leave in `app/layout.tsx` | Do not couple analytics scripts to section transitions |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `app/page.tsx` ↔ sections | typed props | Still one server fetch, no section-local data loading |
| sections ↔ `motion/*` | `children` slot + simple preset props | Best way to add motion without over-clientifying sections |
| `app/page.tsx` ↔ `KnowledgeExperienceCoordinator` | serializable `experience` + `skillGroups` props | Keep island boundary narrow |
| coordinator ↔ map | callbacks + derived props | Coordinator owns pending state |
| viewport ↔ runtime | imperative scene API only | Runtime does not know section layout |
| map ↔ timeline | shared selection state only | No direct component coupling |
| page layout ↔ responsive recipes | server-safe class variants | Layout changes stay CSS-first |

## Recommended Build Order

1. **Stabilize shared tokens first**
   - Modify `section-card-styles.ts` and `section-shell.tsx`.
   - Add spacing-density variants and motion tokens.
   - Lowest regression risk; everything else composes on top.

2. **Add motion wrappers without restructuring layout**
   - Create `motion/reveal-on-scroll.tsx` and `motion/use-reduced-motion.ts`.
   - Wrap existing sections one by one.
   - This proves the server/client boundary remains healthy before changing grids.

3. **Add map boot skeleton and ready-state handshake**
   - Create `loading/knowledge-map-skeleton.tsx`.
   - Modify `skills-knowledge-map.tsx`, `knowledge-map-panels.tsx`, and `viewport.tsx` to support `onSceneReady`.
   - This isolates canvas polish before touching interaction logic.

4. **Introduce coordinator pending state for timeline/map transitions**
   - Modify `knowledge-experience-coordinator.tsx`, `experience-timeline-section.tsx`, and `experience-card.tsx`.
   - Keep current content visible; add pending overlay and reorder transitions.
   - Lower risk than changing page layout because it stays inside the existing client island.

5. **Tune OGL runtime interaction polish**
   - Modify `runtime.ts` and `viewport.tsx` for compact-screen quality policy, drag hints, ready callbacks, and optional interaction-state callbacks.
   - Do this after ready-state plumbing exists, so regressions stay inside the map boundary.

6. **Extract responsive layout recipes and restructure page composition**
   - Add `layout/page-rhythm.ts` and `layout/responsive-section-grid.tsx`.
   - Modify `app/page.tsx` and section components only after motion + map states are stable.
   - This is the most visually disruptive step, so do it late.

7. **Add optional `app/loading.tsx` last**
   - Only if route-level fallback still feels worth it after the rest of the polish lands.
   - Nice-to-have, not core to this milestone.

## Sources

- Local code inspection:
  - `/home/riccardolm/github/94lama/.planning/PROJECT.md`
  - `/home/riccardolm/github/94lama/app/page.tsx`
  - `/home/riccardolm/github/94lama/app/layout.tsx`
  - `/home/riccardolm/github/94lama/app/components/section-shell.tsx`
  - `/home/riccardolm/github/94lama/app/components/section-card-styles.ts`
  - `/home/riccardolm/github/94lama/app/components/hero-section.tsx`
  - `/home/riccardolm/github/94lama/app/components/contact-section.tsx`
  - `/home/riccardolm/github/94lama/app/components/knowledge-experience-coordinator.tsx`
  - `/home/riccardolm/github/94lama/app/components/skills-knowledge-map.tsx`
  - `/home/riccardolm/github/94lama/app/components/knowledge-map/knowledge-map-panels.tsx`
  - `/home/riccardolm/github/94lama/app/components/knowledge-map/viewport.tsx`
  - `/home/riccardolm/github/94lama/app/components/knowledge-map/runtime.ts`
  - `/home/riccardolm/github/94lama/src/content/portfolio/get-portfolio-content.ts`
- Next.js docs: Server and Client Components — https://nextjs.org/docs/app/getting-started/server-and-client-components (v16.2.4, updated 2026-04-15) — HIGH confidence
- Next.js docs: `loading.js` file convention — https://nextjs.org/docs/app/api-reference/file-conventions/loading (v16.2.4, updated 2026-04-15) — HIGH confidence
- React docs: `<Suspense>` — https://react.dev/reference/react/Suspense — HIGH confidence
- OGL README — https://github.com/oframe/ogl — MEDIUM confidence for library positioning, HIGH confidence for “minimal WebGL library” scope

---
*Architecture research for: recruiter-facing portfolio UX/UI improvement milestone v1.2*
*Researched: 2026-04-21*
