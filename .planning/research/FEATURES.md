# Feature Research

**Domain:** Atomic component refactor milestone for an existing recruiter-focused Next.js portfolio app
**Researched:** 2026-04-13
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist for a safe architecture refactor. Missing these = the milestone is not trustworthy even if the code looks cleaner.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Full-surface atomic decomposition | The milestone goal is to remove large inline page blocks across the whole rendered app, not just tidy one or two sections | HIGH | Must cover hero, section shells, metadata rows, contact/legal surfaces, and the knowledge-map surface; `app/page.tsx` should become a thin server composition root |
| Explicit server/client boundaries | In Next.js App Router, pages/layouts are server-first by default and interactivity should stay in narrow client islands | HIGH | Preserve `KnowledgeExperienceCoordinator` as a narrow client boundary or equivalent; avoid pushing `use client` upward because it enlarges the client bundle and weakens refactor safety |
| Behavior and UI parity | This milestone is a refactor, so recruiters should experience the same scan speed, copy flow, and interactions before and after | HIGH | Preserve section order, content hierarchy, CTA visibility, knowledge-map selection/highlighting, and full-timeline experience visibility |
| Knowledge-map modularization without product change | The current hotspot is the map area, so refactor success requires splitting renderer internals as well, not only static sections | HIGH | Separate graph data/modeling, OGL lifecycle, interaction logic, and presentational UI; keep current interaction model and OGL stack |
| Architectural documentation of pages/components/data flow | The milestone explicitly requires architectural documentation as a baseline and handoff artifact | MEDIUM | Document page composition, component boundaries, data flow from `cv.json`, and where client-only logic lives |
| Refactor regression safeguards | A refactor without guardrails is hard to trust and easy to regress silently | MEDIUM | Add or expand tests around composition wiring, map-to-experience behavior, and key recruiter-visible flows; prefer integration/E2E coverage for async/server-heavy paths per current Next.js guidance |
| Reuse of shared atoms and small composition primitives | Atomization is only real if repeated UI patterns are actually consolidated | MEDIUM | Extract shared headings, action links, metadata rows, section shells, list/card primitives, and legal/contact primitives where repetition already exists |
| Accessibility and responsive parity | Refactors must not degrade baseline usability on mobile/desktop or break keyboard/screen-reader expectations | MEDIUM | Keep semantics, focus behavior, tap targets, heading structure, and current responsive scanability intact |

### Differentiators (Competitive Advantage)

Features that make this milestone more valuable than a generic “component cleanup”.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Refactor plan organized by requirement areas | Makes milestone requirements easier to write, estimate, and validate than a vague “adopt atomic design” goal | LOW | Organize around composition, boundaries, behavior preservation, documentation, testing, and safeguards |
| Map internals decomposed into stable submodules | Reduces the highest-risk hotspot first, making future map iteration safer without changing recruiter-facing behavior | HIGH | Best place for selective OOP if lifecycle or scene orchestration benefits from it naturally |
| Thin composition root with section-level contracts | Makes future milestones safer because page composition becomes mostly declarative and sections have clearer input contracts | MEDIUM | Good outcome: `app/page.tsx` mainly loads content and assembles section components |
| Refactor-safe parity definition | Success is measured by preserved recruiter outcomes, not just “more files” or prettier component names | MEDIUM | Define acceptance around same content flow, same interactions, same contact conversion path, same legal bootstrap behavior |
| Architecture docs that explain why boundaries exist | Helps future contributors avoid re-monolithizing the app and accelerates later roadmap work | LOW | Include component inventory, responsibility boundaries, and rationale for client islands |
| Incremental extraction strategy | Lets the team ship the refactor without a risky ground-up rewrite | MEDIUM | Prefer stepwise extractions with behavior checks after each boundary move |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem attractive during a refactor but would make this milestone less safe or less focused.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Visual redesign during the refactor | Refactors often tempt “while we are here” UI cleanup | Blurs success criteria, creates parity disputes, and hides structural regressions behind visual change | Freeze the current UI and treat visual changes as a later milestone |
| Broad product expansion | New sections or recruiter features can feel efficient to bundle with architecture work | Mixes feature risk with refactor risk and makes regressions harder to isolate | Keep scope on internal decomposition and documentation only |
| Global clientification (`use client` too high in the tree) | Feels simpler when extracting interactive components | Increases bundle size, weakens server-first architecture, and spreads client-only constraints across static sections | Keep client islands narrow and pass serializable props from server components |
| Class-heavy OOP rewrite across the app | Can sound “more architectural” during a refactor milestone | Adds ceremony, fights React/Next composition patterns, and risks rewriting good functional code for no recruiter-facing value | Use OOP only for natural fit areas such as renderer orchestration or lifecycle wrappers |
| Premature design-system/package extraction | Shared atoms can invite turning the portfolio into a generalized component library | Over-abstraction slows delivery and creates components optimized for hypothetical reuse instead of current app needs | Extract only primitives already repeated in this app |
| Replacing OGL or changing the map interaction model | The map is the hotspot, so replacement can look like a clean slate | Changes behavior and risk profile at the same time; violates milestone scope | Keep OGL and current interaction semantics, just decompose internals |
| Data-source migration away from `public/assets/cv.json` | Refactors often trigger content architecture ambitions | Adds unrelated migration work and new failure modes without helping atomic decomposition directly | Keep current runtime source unless a later workflow milestone justifies change |
| Snapshot-only test strategy | Fast to add during UI refactors | Catches markup churn poorly and does not validate recruiter-visible behavior well enough | Favor targeted integration/E2E assertions plus selective unit tests |

## Feature Dependencies

```
[Behavior and UI parity]
    └──requires──> [Refactor regression safeguards]

[Full-surface atomic decomposition]
    ├──requires──> [Reuse of shared atoms and small composition primitives]
    ├──requires──> [Explicit server/client boundaries]
    └──requires──> [Knowledge-map modularization without product change]

[Architectural documentation of pages/components/data flow]
    └──requires──> [Thin composition root with section-level contracts]

[Map internals decomposed into stable submodules]
    └──requires──> [Behavior and UI parity]

[Incremental extraction strategy] ──enhances──> [Behavior and UI parity]

[Visual redesign during the refactor] ──conflicts──> [Behavior and UI parity]
[Global clientification] ──conflicts──> [Explicit server/client boundaries]
```

### Dependency Notes

- **Behavior and UI parity requires refactor regression safeguards:** parity is not credible unless the milestone has checks for the known recruiter-visible flows and map wiring.
- **Full-surface atomic decomposition requires shared atoms/primitives:** otherwise the refactor just moves markup into more files without improving reuse or boundaries.
- **Full-surface atomic decomposition requires explicit server/client boundaries:** atomic extraction must not collapse the App Router server-first model into a client-heavy tree.
- **Full-surface atomic decomposition requires knowledge-map modularization:** the milestone is incomplete if the largest interactive hotspot remains monolithic.
- **Architectural documentation requires thin composition contracts:** docs become durable when responsibilities and inputs are explicit instead of buried in one page file.
- **Incremental extraction enhances parity:** smaller boundary moves make it easier to detect regressions early and keep behavior stable.
- **Visual redesign conflicts with parity:** any meaningful UI change makes “same behavior and scan speed” much harder to verify.
- **Global clientification conflicts with explicit server/client boundaries:** it undermines one of the milestone’s core architectural goals.

## MVP Definition

### Launch With (v1.1)

Minimum successful refactor milestone — what must ship for the milestone to count as done.

- [ ] Full-surface atomic decomposition — the rendered app is composed from extracted reusable components instead of large inline page blocks
- [ ] Knowledge-map modularization — graph data, renderer lifecycle, interaction handling, and presentational UI are split into clearer modules without changing recruiter-facing behavior
- [ ] Preserved server/client boundaries — `app/page.tsx` remains server-first and interactive state stays isolated to narrow client components
- [ ] Behavior parity safeguards — tests and/or checks validate map-to-experience behavior, contact-path visibility, and core page composition wiring
- [ ] Architecture documentation — pages, components, boundaries, and data flow are documented for future milestones

### Add After Validation (v1.1.x)

Useful follow-ons once the safe refactor is complete.

- [ ] Visual regression automation — add if manual parity review becomes too fragile or repetitive
- [ ] Storybook or isolated component workbench — add if section/atom iteration becomes frequent enough to justify the maintenance cost
- [ ] Additional structural linting or import-boundary rules — add if contributors start drifting across server/client or section boundaries again

### Future Consideration (v2+)

Important ideas, but not part of this milestone’s safe success definition.

- [ ] Design-system packaging beyond this app — defer until real cross-project reuse exists
- [ ] Content-source/workflow redesign — defer until authoring pain clearly outweighs migration cost
- [ ] Recruiter-facing interaction or information-architecture changes — defer until product goals change, not while validating the refactor

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Behavior and UI parity | HIGH | HIGH | P1 |
| Full-surface atomic decomposition | HIGH | HIGH | P1 |
| Explicit server/client boundaries | HIGH | HIGH | P1 |
| Knowledge-map modularization | HIGH | HIGH | P1 |
| Architectural documentation | MEDIUM | MEDIUM | P1 |
| Refactor regression safeguards | HIGH | MEDIUM | P1 |
| Reuse of shared atoms/primitives | MEDIUM | MEDIUM | P1 |
| Incremental extraction strategy | MEDIUM | LOW | P2 |
| Visual regression automation | MEDIUM | MEDIUM | P2 |
| Storybook/component workbench | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for milestone success
- P2: Should have if time allows after core refactor safety is in place
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| Atomic decomposition | Typical “split files by section” refactor | Full design-system rewrite | Decompose by real reuse and responsibility boundaries across the current app |
| Interactive hotspot cleanup | Leave canvas/renderer code monolithic | Rewrite interaction model entirely | Keep current behavior, but split graph data, renderer lifecycle, interaction logic, and UI |
| Server/client separation | Often blurred during refactors | Sometimes over-engineered with wrappers everywhere | Keep a thin server composition root and narrow client islands aligned with Next.js guidance |
| Refactor validation | Manual spot checks only | Heavy snapshot coverage | Validate recruiter-visible flows with targeted integration/E2E checks and selective unit coverage |

## Sources

- Project scope and milestone requirements: `/workspaces/94lama/.planning/PROJECT.md` — HIGH
- Current architectural baseline: `/workspaces/94lama/.planning/ARCHITECTURE.md` — HIGH
- Next.js 16 docs, Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components (last updated 2026-04-08) — HIGH
- Next.js 16 docs, Testing: https://nextjs.org/docs/app/guides/testing (last updated 2026-04-08) — HIGH

---
*Feature research for: atomic component refactor milestone on existing recruiter portfolio app*
*Researched: 2026-04-13*
