# Milestone Architecture Research: v1.1 TODO refresh

**Project:** Riccardo La Malfa Portfolio  
**Scope:** Only new milestone integration work  
**Researched:** 2026-04-12  
**Confidence:** HIGH

## Recommended integration shape

Keep `app/page.tsx` as server-rendered composition root. Do **not** push milestone state into global context or a separate OOP layer. Add one small client island that owns shared map/experience state for sections `01` and `02`, and keep everything else server-first unless browser APIs are required.

## Target structure

```text
app/page.tsx                       // server: loads portfolio content, composes sections
  ├─ Hero / Education / Languages  // server
  ├─ KnowledgeExperienceCoordinator // client: shared selection state for 01 + 02
  │   ├─ KnowledgeMapSection       // client wrapper around map UI
  │   │   ├─ KnowledgeMapCanvas    // client/OGL only
  │   │   ├─ KnowledgeMapInspector  // client/presentational
  │   │   └─ KnowledgeMapLegend     // client/presentational
  │   └─ ExperienceTimelineSection // client, all items visible, highlight/reorder only
  ├─ RelocationSection             // server/presentational
  └─ ContactSection                // server/presentational

app/layout.tsx                     // server
  ├─ ConsentBootstrapScript        // server + next/script beforeInteractive
  └─ LegalFooter                   // server markup; no duplicate script bootstrapping
```

## Integration points

### 1. Replace `01 - Skills` with knowledge map
- **Modify:** `app/page.tsx`
- **Remove:** current static skills grid section.
- **Replace with:** section shell for `01` that renders `KnowledgeExperienceCoordinator`'s map half.
- **Do not keep:** separate `02A Interactive Skills And Experience` section. Its responsibilities move into `01` + `02`.

### 2. Sync map and experience state
- **Replace current boundary:** `ExperienceMapController` + `ExperienceMapSection` currently create a duplicate interactive block.
- **New boundary:** `KnowledgeExperienceCoordinator` becomes closest common parent for:
  - current map selection (`KnowledgeMapSelection`)
  - derived experience ranking/highlight state
- **Rule:** one source of truth for selection. Map writes selection. Experience reads same selection and derives presentation from it.
- **Keep experience fully visible:** reorder and highlight matching entries; do not filter non-matches out.

### 3. Atomize composition, not behavior ownership
- Good split:
  - `KnowledgeMapCanvas` = all OGL setup, pointer handling, rendering lifecycle
  - `KnowledgeMapInspector` = selected node summary + connected points list + category buttons
  - `ExperienceTimelineSection` = list wrapper + helper copy
  - `ExperienceCard` = single timeline item with `isHighlighted` / `matchScore`
  - `ContactIconLinks` = compact GitHub/LinkedIn/email icons
  - `ConsentBootstrapScript` = third-party script/config owner
- Bad split:
  - tiny one-off atoms for every pill, label, border card, or heading.
  - shared UI primitives with no real reuse yet.

## New vs modified boundaries

| Area | Action | Boundary |
|---|---|---|
| `app/page.tsx` | Modify | Becomes mostly section composition; pass content slices into smaller components |
| `app/components/experience-map-controller.tsx` | Replace/rename | Fold into `KnowledgeExperienceCoordinator` with explicit 01/02 ownership |
| `app/components/experience-map-section.tsx` | Retire | Current duplicate map + filtered experience layout no longer matches milestone |
| `app/components/skills-knowledge-map.tsx` | Split internally | Keep public selection contract; extract canvas/inspector/legend helpers only if it reduces file complexity |
| Hero / Education / Languages | Leave mostly unchanged | No milestone-specific architecture change needed |
| Relocation section | Modify | Expand content but keep server-rendered presentational section |
| Contact section | Modify | Replace card grid with compact icon-link composition sourced from content |
| `app/layout.tsx` | Modify | Add single consent bootstrap integration point |
| `app/components/legal-embed-footer.tsx` | Modify | Keep legal links/footer markup; remove responsibility for global consent bootstrapping if centralized elsewhere |

## Data flow

### Server → client boundary
`app/page.tsx` loads `content` with `getPortfolioContent()` and passes only needed props down:

```ts
<KnowledgeExperienceCoordinator
  skillGroups={content.skills}
  experience={content.experience}
/>
```

### Client state shape
Use one local state object in coordinator:

```ts
type KnowledgeExperienceState = {
  selection: KnowledgeMapSelection;
};
```

Derived, not stored:
- `matchedTerms`
- `experienceMatchScore`
- `orderedExperience`
- `activeCategory`

### Experience derivation rule
Prefer pure helper function:

```ts
rankExperienceBySelection(experience, selection, skillGroups)
```

Output per entry:
- `matchScore`
- `isHighlighted`
- `matchedTerms`

Sort strategy:
1. matched entries first
2. higher score first
3. original CV order preserved as stable tiebreaker

This satisfies milestone requirement: synced state + full visibility.

## Knowledge map changes

### Keep
- controlled selection API (`selectedNodeId`, `onSelectionChange`)
- OGL rendering isolated inside client code

### Change
- remove visual dependence on root/core sphere from rendered graph
- keep optional conceptual root in data only **if** needed for edge math, but do not render/select it as primary UX object
- move map into section `01`
- remove map-adjacent experience list under graph
- push all experience response into section `02`

### Safer internal refactor
Current `skills-knowledge-map.tsx` mixes:
- graph generation
- OGL scene setup
- picking/highlighting
- inspector UI
- legend UI

For v1.1, split by responsibility, not by micro-component count:
- `knowledge-map-graph.ts` — pure graph/layout helpers
- `knowledge-map-canvas.tsx` — OGL scene + input
- `knowledge-map-panel.tsx` or `KnowledgeMapSection` — inspector + canvas + legend composition

Stop there. No deeper atomization needed yet.

## Cookie consent / bootstrap behavior

## Recommendation

Use **one** layout-level consent bootstrap component in `app/layout.tsx`, backed by `next/script`, and keep it separate from footer link rendering.

### Why
- Next.js docs recommend `beforeInteractive` in root layout for site-wide critical scripts like cookie consent managers.
- Current `LegalEmbedFooter` already injects `iubenda.js` after hydration for policy links. Adding banner bootstrapping there risks duplicated loaders and late banner display.
- Consent prompt is app-bootstrap behavior, not footer behavior.

### Safe shape
- `ConsentBootstrapScript` in `app/layout.tsx`
  - defines `_iub.csConfiguration`
  - loads iubenda consent script once
  - uses `strategy="beforeInteractive"`
- `LegalEmbedFooter`
  - renders privacy/cookie link slots/templates only
  - may keep lightweight post-hydration embed hookup **only if** consent bootstrap does not already initialize same loader
  - preferred: centralize all iubenda script loading in one place and let footer be markup only

### Guardrails
- No `window` access in server components outside inline `Script` payload.
- Do not initialize iubenda from multiple components.
- Keep policy-link embedding and consent configuration idempotent.
- If banner config must vary later, isolate config object in one file, not inline across layout + footer.

## Suggested build order

1. **Create pure experience ranking helper**
   - lowest-risk change
   - defines exact match/highlight/reorder behavior before UI shuffle

2. **Introduce `KnowledgeExperienceCoordinator`**
   - lift selection state to common parent
   - render existing map + existing experience list through shared state

3. **Move architecture to final section layout**
   - section `01` = knowledge map
   - section `02` = synced experience timeline
   - remove duplicate `02A` interactive section

4. **Refactor map internals**
   - remove center sphere
   - update spatial layout
   - preserve public selection contract so section wiring stays stable

5. **Atomize relocation/contact presentation**
   - expand relocation copy
   - switch contact cards to compact icon links

6. **Centralize consent bootstrap in layout**
   - dedupe iubenda loading
   - ensure banner appears at app bootstrap, not after footer hydration

## Where atomization helps most

High value:
- map internals
- experience card rendering
- contact icon links
- legal bootstrap ownership

Low value / skip for now:
- generic section badge atoms
- generic pill atoms
- generic card wrappers for every section
- shared button system if only 2-3 variants exist

## Anti-patterns to avoid

### 1. Separate selection state in map and experience
Causes drift. Use one parent-owned `selection`.

### 2. Global store/context for one local interaction cluster
Overkill. `01` and `02` share one parent; lift state there.

### 3. Filtering out non-matching experience entries
Breaks recruiter scan flow and contradicts milestone requirement.

### 4. Coupling consent banner to footer mount timing
Banner should bootstrap from layout, not wait for footer-specific behavior.

### 5. Atomizing every visual fragment
Increases indirection faster than it improves maintainability.

## Recommended file plan

```text
app/components/
  knowledge-experience-coordinator.tsx   // new
  knowledge-map-section.tsx              // new wrapper/composition
  knowledge-map-canvas.tsx               // new, if extracted
  experience-timeline-section.tsx        // new
  experience-card.tsx                    // new
  contact-icon-links.tsx                 // new
  consent-bootstrap-script.tsx           // new

app/components/
  skills-knowledge-map.tsx               // modified or slimmed into wrapper
  legal-embed-footer.tsx                 // modified

src/content/portfolio/
  rank-experience-by-selection.ts        // new pure helper
```

## Sources

- Repo architecture review: `/workspaces/94lama/app/page.tsx`, `/workspaces/94lama/app/components/experience-map-controller.tsx`, `/workspaces/94lama/app/components/experience-map-section.tsx`, `/workspaces/94lama/app/components/skills-knowledge-map.tsx`, `/workspaces/94lama/app/layout.tsx`, `/workspaces/94lama/app/components/legal-embed-footer.tsx` — HIGH
- React docs, lifting shared state to common parent: https://react.dev/learn/sharing-state-between-components — HIGH
- Next.js App Router docs, Server vs Client Components: `/workspaces/94lama/node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — HIGH
- Next.js Script docs, `beforeInteractive` for cookie consent managers in root layout: `/workspaces/94lama/node_modules/next/dist/docs/01-app/03-api-reference/02-components/script.md` — HIGH
- iubenda advanced guide, consent/banner implemented site-wide and embedded globally: https://www.iubenda.com/en/help/1205-how-to-configure-your-cookie-solution-advanced-guide — MEDIUM
