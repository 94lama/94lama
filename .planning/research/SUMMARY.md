# Project Research Summary

**Project:** Riccardo La Malfa Portfolio
**Domain:** Brownfield recruiter-focused Next.js portfolio refactor
**Researched:** 2026-04-13
**Confidence:** HIGH

## Executive Summary

This milestone is not a product expansion; it is an architecture-first refactor of a shipped one-page recruiter portfolio. The research is consistent across stack, feature, architecture, and pitfalls: keep the runtime stack largely unchanged, keep the UI and interaction model effectively unchanged, and restructure the app around a thin server composition root plus a narrow client island for the knowledge-map/timeline feature. Experts would treat this as a boundary-and-module cleanup, not a redesign or framework migration.

The recommended approach is to atomize the full rendered surface in layers: first extract shared atoms and molecules, then move page sections into server organisms, then thin `app/page.tsx` to composition only, and finally split the knowledge-map hotspot by responsibility into model, OGL runtime, controller hooks, and presentational UI. The safest way to ship this brownfield milestone is incremental extraction with parity checks after each boundary move, using TypeScript contracts, server/client discipline, and targeted integration/E2E verification for recruiter-visible flows.

The main risks are architectural drift rather than missing functionality: accidental client-boundary creep, styling drift during atomization, selection-contract drift between the map and timeline, and OGL lifecycle regressions that cause remounts or leaks. Mitigation is concrete: keep static sections server-side, preserve the existing interaction contract, centralize selection semantics, isolate OGL init/update/dispose behind one lifecycle seam, and avoid bundling any redesign, new sections, data-source migration, global state, or renderer replacement into this milestone.

## Key Findings

### Recommended Stack

The stack guidance is unusually clear: do not change the product stack unless a tool directly reduces refactor risk. Next.js 16, React 19, Tailwind 4, OGL, and strict TypeScript are already the right fit for this milestone because the goal is better composition and module boundaries, not new runtime capabilities.

The only meaningful additions recommended by research are defensive ones: `@playwright/test` for UI-parity and interaction regression checks, plus optional `server-only` / `client-only` markers to enforce boundary-sensitive imports. Do not add a new design system, global state library, Storybook, React Compiler rollout, or a new rendering engine in v1.1.

**Core technologies:**
- **Next.js 16.2.3**: server-first App Router composition — supports keeping `app/page.tsx` thin and pushing `'use client'` down to the knowledge-map island.
- **React 19.2.4**: atomic component composition — favors pure components and local state over architectural overreach.
- **Tailwind CSS 4.x**: visual-parity refactor support — lets the app preserve existing utility output while extracting reusable UI primitives.
- **OGL 1.0.11**: existing interactive renderer — should be modularized, not replaced.
- **TypeScript 5.x**: extraction safety — protects prop contracts, graph models, and server/client serialization boundaries.

### Expected Features

For this project, “features” are really success criteria for a safe refactor. The milestone must atomize the entire rendered surface, preserve current recruiter-facing behavior, keep server/client boundaries explicit, modularize the knowledge-map hotspot, and leave behind architecture documentation plus regression safeguards. If any of those are missing, the milestone is structurally incomplete even if the code is split into more files.

Just as important, the research is explicit about what not to add: no visual redesign, no new recruiter-facing sections, no broad product expansion, no global clientification, no class-heavy OOP rewrite, no OGL replacement, and no data-source migration away from `public/assets/cv.json`.

**Must have (table stakes):**
- **Full-surface atomic decomposition** — hero, section shells, metadata rows, contact/legal surfaces, and the map area all move out of large inline page blocks.
- **Explicit server/client boundaries** — `app/page.tsx` stays server-first and shared interactivity stays in a narrow coordinator island.
- **Behavior and UI parity** — section order, copy flow, CTA visibility, map selection/highlighting, and full-timeline visibility remain intact.
- **Knowledge-map modularization** — split graph/model, OGL lifecycle, interaction logic, and presentational UI without changing behavior.
- **Architecture documentation + regression safeguards** — document boundaries and protect recruiter-visible flows with tests/checks.

**Should have (competitive):**
- **Requirement-area refactor plan** — organize work around composition, boundaries, parity, docs, and safeguards.
- **Stable map submodules** — make the highest-risk hotspot safer to change later.
- **Thin composition root with section contracts** — future milestones become easier because `app/page.tsx` becomes declarative.
- **Incremental extraction strategy** — ship the refactor safely instead of as a rewrite.

**Defer (v2+):**
- **Design-system packaging beyond this app** — no cross-project reuse case yet.
- **Content-source/workflow redesign** — keep `public/assets/cv.json` for now.
- **Recruiter-facing IA or interaction changes** — not while validating the architecture refactor.
- **Storybook / broader component-workbench investments** — only if iteration frequency later justifies maintenance cost.

### Architecture Approach

The architecture recommendation is opinionated and project-specific: keep `app/layout.tsx` as the protected root shell, reduce `app/page.tsx` to content loading plus server section composition, extract reusable atoms/molecules/organisms under `app/components/`, and move the knowledge-map/timeline feature into a dedicated feature folder with a single client coordinator. Content loading and ranking logic should remain in `src/content/portfolio/`, while the map is split by responsibility rather than line count: pure model helpers, imperative OGL runtime helpers, React controller hooks, and UI panels.

**Major components:**
1. **`app/page.tsx`** — thin server composition root that loads `PortfolioContent` once and assembles section organisms plus serializable props for the client island.
2. **Server section organisms + shared atoms/molecules** — render stable recruiter-facing markup for hero, education, languages, relocation, contact, headings, metadata rows, chips, links, and shared shells.
3. **`KnowledgeExperienceCoordinator` feature island** — owns shared selection state across the knowledge map and experience timeline.
4. **`SkillsKnowledgeMap` submodules** — split into `model/`, `ogl/`, `hooks/`, and `ui/` so React orchestrates while OGL owns canvas internals.
5. **`src/content/portfolio/*`** — retains canonical content contracts, server-only loading, and pure ranking helpers.

### Critical Pitfalls

The biggest risks are predictable and preventable if the roadmap respects boundaries and extraction order.

1. **Client-boundary creep** — avoid by keeping static atoms and sections server-side, pushing `'use client'` down, and optionally guarding loaders with `server-only`.
2. **Over-abstraction** — avoid by extracting only modules with a real invariant or responsibility, not wrappers that only forward `className` and `children`.
3. **Styling drift during atomization** — avoid by preserving wrapper depth/semantics, centralizing class recipes, and using parity checks on desktop and mobile.
4. **Selection-contract drift between map and timeline** — avoid by centralizing one `KnowledgeMapSelection` model and testing core/category/skill/reset flows.
5. **OGL lifecycle churn and picking regressions** — avoid by isolating init/update/dispose, keeping imperative objects behind refs/controller boundaries, and validating drag/select/reset/resize behavior before signoff.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Baseline, contracts, and guardrails
**Rationale:** The refactor is high-risk because success is parity, not novelty; baseline contracts and tests must exist before big moves.
**Delivers:** Architecture inventory, extraction rules, canonical server/client ownership notes, baseline parity checklist, and initial regression coverage for section order, coordinator wiring, and core selection semantics.
**Addresses:** Architecture documentation, explicit server/client boundaries, refactor regression safeguards.
**Avoids:** Client-boundary creep, over-abstraction, and test-gap regressions.

### Phase 2: Static surface atomization
**Rationale:** Shared atoms/molecules and server section organisms are the safest high-value extractions and prepare the page for a thin composition root.
**Delivers:** Reusable atoms/molecules, extracted hero/education/languages/relocation/contact organisms, stabilized `section-card-styles.ts` recipes, and a leaner `app/page.tsx`.
**Addresses:** Full-surface atomic decomposition, reuse of shared composition primitives, behavior/UI parity for the static recruiter-facing page.
**Uses:** Next.js server components, React pure composition, Tailwind 4 style preservation.
**Avoids:** Styling drift, accessibility regressions, and accidental clientification of static sections.

### Phase 3: Knowledge-map decomposition
**Rationale:** This is the milestone hotspot and should happen only after the page shell is stable; it has the highest technical risk and the most need for discipline.
**Delivers:** Feature-folder move, canonical selection model, extracted pure graph helpers, OGL runtime helpers, controller hooks, smaller `SkillsKnowledgeMap`, and preserved `KnowledgeExperienceCoordinator` behavior.
**Addresses:** Knowledge-map modularization without product change, preserved shared state boundaries, continued full-timeline visibility.
**Uses:** OGL behind a dedicated lifecycle seam, TypeScript contracts, local client state only.
**Avoids:** Selection drift, OGL lifecycle leaks, effect dependency churn, and picking/resize regressions.

### Phase 4: Parity hardening and milestone signoff
**Rationale:** Brownfield refactors are only done once parity is proven across UI, behavior, accessibility, and layout integrations.
**Delivers:** Final regression suite, optional Playwright screenshots/interactions, manual QA for map behavior, accessibility smoke checks, and verification of legal/footer/analytics wiring.
**Addresses:** Behavior and UI parity, accessibility and responsive parity, final confidence for release.
**Avoids:** Shipping a structurally cleaner app with hidden recruiter-facing regressions.

### Phase Ordering Rationale

- Start with contracts and tests because parity is the milestone’s main acceptance criterion.
- Extract the static server-rendered surface before touching the OGL hotspot so the riskiest work happens against a stable shell.
- Split the map by responsibility only after shared selection semantics are explicit and testable.
- Finish with parity hardening because legal/layout wiring, accessibility, and interactive QA are easy to miss in a refactor.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3: Knowledge-map decomposition** — highest-risk area; OGL lifecycle, picking, resize, reduced-motion, and effect boundaries need deliberate implementation planning.
- **Phase 4: Parity hardening** — if Playwright is adopted, screenshot baseline strategy and environment stability should be planned explicitly.

Phases with standard patterns (skip research-phase):
- **Phase 1: Baseline, contracts, and guardrails** — standard brownfield planning and testing discipline.
- **Phase 2: Static surface atomization** — well-supported by existing project architecture and standard Next.js server-component composition patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Backed by official Next.js, React, Tailwind, TypeScript, and Playwright guidance; recommendations match the current repo state closely. |
| Features | HIGH | Strongly grounded in milestone scope, project constraints, and explicit out-of-scope rules from local planning docs. |
| Architecture | HIGH | Based on direct code inspection plus current Next.js/React guidance; structure recommendations are concrete and brownfield-aware. |
| Pitfalls | MEDIUM | Risks are credible and well-supported, but map-runtime regressions still need empirical validation during implementation. |

**Overall confidence:** HIGH

### Gaps to Address

- **Current parity baseline is not fully automated**: confirm whether Playwright will be added in this milestone or whether a manual + existing-test baseline will be the initial guardrail.
- **Exact extraction inventory is not yet frozen**: during planning, decide the minimum viable atom/molecule set so the team does not over-atomize the static surface.
- **Map interaction invariants need an explicit acceptance checklist**: document exact drag/select/reset/resize/reduced-motion expectations before Phase 3 implementation starts.
- **TypeScript strictness tightening is optional, not validated**: evaluate `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` only if extracted graph/prop modules show ambiguity.

## Sources

### Primary (HIGH confidence)
- `/workspaces/94lama/.planning/PROJECT.md` — milestone scope, constraints, out-of-scope items, and active requirements.
- `/workspaces/94lama/.planning/ARCHITECTURE.md` — current app baseline and brownfield integration context.
- Next.js docs — https://nextjs.org/docs/app/getting-started/server-and-client-components — server/client boundaries, App Router defaults, `server-only` / `client-only` guidance.
- Next.js docs — https://nextjs.org/docs/app/guides/testing — testing strategy guidance for App Router apps.
- Next.js docs — https://nextjs.org/docs/app/api-reference/file-conventions/layout — layout boundary conventions.
- React docs — https://react.dev/reference/rules/components-and-hooks-must-be-pure — purity guidance for render vs side-effect boundaries.
- React docs — https://react.dev/reference/react/memo — memoization is optimization, not architecture.
- React docs — https://react.dev/reference/react/useEffect — effect lifecycle guidance relevant to OGL decomposition.
- Tailwind docs — https://tailwindcss.com/docs/styling-with-utility-classes — utility-class composition and reuse guidance.
- TypeScript TSConfig reference — https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess — strictness options relevant to extracted graph/indexed-access code.

### Secondary (MEDIUM confidence)
- OGL README — https://github.com/oframe/ogl — confirms OGL’s low-abstraction positioning and suitability for modular internal refactor rather than replacement.

### Tertiary (LOW confidence)
- None.

---
*Research completed: 2026-04-13*
*Ready for roadmap: yes*
