# Phase 2: Portfolio Page Experience — Research

**Date:** 2026-04-10
**Status:** Complete
**Scope:** Replace the current simple recruiter page with a bold one-page portfolio experience using the Phase 1 typed content pipeline.

## What Exists Now

- `app/page.tsx` is already an async Server Component that reads `getPortfolioContent()` and renders all required sections.
- `src/content/portfolio/types.ts` defines the stable content contract for hero, summary, skills, experience, education, languages, relocation, and contact.
- `public/assets/cv.md` is the single maintained content source.
- Styling is currently minimal and starter-like; `app/globals.css` still uses default background tokens and `Arial, Helvetica, sans-serif` on `body`.

## Phase Goal

Deliver a recruiter-focused one-page portfolio that feels intentionally bold and easy to scan while preserving the typed content pipeline established in Phase 1.

## Standard Stack

- **Framework:** Next.js 16 App Router
- **Rendering:** Async Server Components by default
- **UI:** React 19 + Tailwind CSS 4
- **Fonts:** Continue using `next/font` in `app/layout.tsx`
- **Content loading:** Server-side `getPortfolioContent()`; do not move first-load content fetching to the client

## Architecture Patterns To Follow

1. **Keep `app/page.tsx` server-rendered.** The current page is static content backed by a server-side file read. No client component is needed for Phase 2.
2. **Preserve the Phase 1 content boundary.** Continue treating `src/content/portfolio/*` as the source of typed content and `public/assets/cv.md` as authored input.
3. **Refactor presentation into route-local UI pieces if needed.** If the page becomes large, colocated components under `app/` are preferable to spreading portfolio presentation across unrelated directories.
4. **Let Tailwind handle visual hierarchy.** Use Tailwind 4 utilities and theme variables rather than adding new UI libraries for this phase.
5. **Keep the experience single-page and narrative.** Order should support a recruiter scan: hero/positioning first, credentials next, relocation/contact support after.

## UI/UX Findings

### Information hierarchy that best supports the roadmap requirements

Recommended narrative order:

1. **Hero / positioning** — name, role, short summary, location + relocation context visible immediately
2. **Skills** — grouped and scan-friendly
3. **Experience** — strongest credibility section, visually prominent
4. **Education + languages** — secondary credentials grouped together
5. **Relocation / contact support** — reinforces availability and next-step confidence

### Visual direction that fits the product goal

Because the target is a recruiter-facing portfolio rather than a consumer app, the design should be:

- bold in contrast and layout rhythm
- typographically strong
- editorial rather than dashboard-like
- credible and high-signal, not decorative for its own sake

Best-fit design cues for this repo:

- oversized hero typography
- strong sectional contrast using panels, borders, and spatial breaks
- clear category labels and date/location chips for fast scanning
- restrained motion only if it improves polish; avoid animation-heavy gimmicks
- responsive stacking that preserves reading order on mobile

### Tailwind/UI guardrails from project skills

- Maintain visible focus states on all interactive links/buttons.
- Respect reduced motion if any animations are introduced.
- Avoid hover transforms that cause layout shift.
- Ensure mobile touch targets meet at least ~44px where applicable.
- Keep content within a readable max width; avoid ultra-wide text blocks.

## Do Not Hand-Roll / Avoid

- Do **not** add a CMS, markdown renderer, or design system dependency for this phase.
- Do **not** replace the content parser or duplicate content into page-local constants.
- Do **not** introduce client-side fetching for portfolio content.
- Do **not** expand scope into project showcase, CV download, multi-page routing, or UI switching; those are out of scope for v1.
- Do **not** rely on generic starter-template aesthetics (default font stack, evenly spaced undifferentiated sections, weak hierarchy).

## Common Pitfalls

1. **Visual redesign without hierarchy improvement.** Simply changing colors or spacing will not satisfy `PORT-02`; the page must read as one clear narrative.
2. **Hero that buries relocation context.** `HERO-03` requires location and EU relocation visibility near the top of the page, not only in a lower section.
3. **Skills rendered as long paragraphs.** `SKIL-01` is better served by grouped cards, columns, or labeled clusters.
4. **Experience entries with weak scannability.** Roles, company, dates, and highlights need visual separation.
5. **Desktop-first styling that collapses poorly on mobile.** The page must stay comfortable as a one-page scroll on narrow screens.
6. **Breaking accessibility while chasing “bold”.** Contrast, focus visibility, and reading order must remain strong.

## Recommended File Scope

Primary expected files for Phase 2:

- `app/page.tsx` — main layout and section hierarchy
- `app/globals.css` — shared design tokens, background treatment, typography foundation
- `app/layout.tsx` — only if metadata or global body classes need adjustment

Optional but reasonable if the page becomes too dense:

- `app/_components/portfolio/*.tsx` or similar route-local presentational components

## Requirement Mapping Guidance

- **HERO-01 / HERO-02 / HERO-03:** solved through a stronger above-the-fold hero with summary and relocation context immediately visible
- **SKIL-01:** solve with grouped skill presentation by category, not a flattened list
- **EXPR-01:** give experience its own high-contrast, scan-friendly structure
- **EXPR-02:** group education and languages in a coordinated supporting section
- **PORT-01:** verify mobile + desktop layout quality
- **PORT-02:** preserve one-page narrative order from intro to contact-oriented ending

## Validation Architecture

Phase 2 is mostly presentation work, so validation should combine:

1. **Automated structural checks**
   - `npm run lint`
   - `npm run build`

2. **Source-level assertions inside plan tasks**
   - grep/read checks for hero content placement
   - grouped skill categories present in JSX
   - relocation context rendered near the hero
   - responsive classes and section order visible in source

3. **Manual verification for visual quality**
   - desktop and mobile pass in browser
   - page no longer resembles starter template
   - one-page narrative scan works top-to-bottom

Because the repo has no dedicated UI test framework yet, plans should rely on lint/build plus targeted human verification checkpoints instead of inventing a large test harness for this phase.

## Planning Implications

- This is **Level 1/low Level 2 discovery**: existing stack, existing patterns, no new external integration required.
- The work should likely split into:
  1. design tokens / page-shell direction
  2. section-level layout and recruiter hierarchy
  3. responsive polish + verification checkpoint
- Plans should include a `<threat_model>` block even though risk is low, because workflow security enforcement is enabled.

## Research Conclusion

Phase 2 should be planned as a focused frontend redesign on top of the existing server-rendered portfolio content pipeline. The fastest, lowest-risk approach is to keep data flow unchanged and concentrate effort on hierarchy, typography, spacing, contrast, and responsive section composition.
