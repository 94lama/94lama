# Phase 8: Motion Language & Reveal Rhythm - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-04-21
**Phase:** 8-Motion Language & Reveal Rhythm
**Areas discussed:** Reveal rhythm, Interaction feedback, Knowledge map motion baseline

---

## Reveal Rhythm

| Option | Description | Selected |
|--------|-------------|----------|
| Short fade-up reveal | Reuse the current `fade-in-up` direction with restrained stagger so content becomes readable quickly. | ✓ |
| Large cinematic sequencing | Longer staged reveals across whole sections with more theatrical pacing. | |
| No shared reveal system | Leave each section with ad-hoc or no entrance behavior. | |

**User's choice:** `[auto] Short fade-up reveal`
**Notes:** Auto-selected because the roadmap asks for consistency without slowing scan speed, and `app/globals.css` plus `app/components/knowledge-map/runtime.ts` already establish this direction.

---

## Interaction Feedback

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle lift and accent reinforcement | Fast hover/focus/press feedback using small travel, border/color reinforcement, and existing transition utilities. | ✓ |
| High-energy motion feedback | Bigger transforms, bounce, or spring-heavy reactions on interactive surfaces. | |
| Color-only state changes | Remove most movement and rely almost entirely on static color changes. | |

**User's choice:** `[auto] Subtle lift and accent reinforcement`
**Notes:** Auto-selected because `section-card-styles.ts`, hero CTA styles, and map panel controls already use restrained translate and transition patterns that match the recruiter-first brief.

---

## Knowledge Map Motion Baseline

| Option | Description | Selected |
|--------|-------------|----------|
| Extend current map motion vocabulary | Use the map panel entrance helper and reduced-motion branching as the baseline for the whole page. | ✓ |
| Introduce a new separate motion system | Keep map motion as-is and design a different reveal/feedback language for the rest of the portfolio. | |
| Flatten map motion to match static sections completely | Remove most of the map's stronger motion personality so everything behaves almost identically. | |

**User's choice:** `[auto] Extend current map motion vocabulary`
**Notes:** Auto-selected because the knowledge-map area is the only place with an explicit entrance helper and reduced-motion branch today, making it the most credible source of a shared system.

---

## the agent's Discretion

- Exact motion token naming and duration numbers.
- Whether to centralize the shared motion language in CSS variables, class exports, or small helpers.

## Deferred Ideas

- Reduced-motion-specific acceptance work belongs to future requirement `MOTN-05`.
- Coordinated map/panel/timeline continuity and real loading choreography belong to Phase 9.
