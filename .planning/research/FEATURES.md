# Feature Research

**Domain:** Recruiter-facing portfolio UX/UI polish milestone (motion, loading, spacing, layout, responsive behavior)
**Researched:** 2026-04-21
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features recruiters will not praise explicitly, but will notice immediately if they are missing or awkward.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Consistent low-distraction motion system | Premium portfolios are expected to feel intentional, not abrupt or random | MEDIUM | Use one shared motion language for reveals, hover/focus states, panel swaps, and timeline/map transitions; keep motion short, readable, and subordinate to content |
| Immediate interaction feedback | Recruiters need instant confirmation that taps, clicks, and selections worked | LOW | Button press, hover/focus, active nav state, hotspot selection, and panel updates should acknowledge input inside the “feels immediate” window; don’t make users wonder if they missed |
| Reduced-motion-safe behavior | Motion polish is only acceptable if it respects accessibility preferences | MEDIUM | All non-essential movement should reduce or disappear under `prefers-reduced-motion`; opacity/color transitions are usually safer than travel/scale-heavy animations |
| Stable loading states with reserved layout space | Premium UX should not jump, flash, or collapse while content/images/interactive surfaces initialize | MEDIUM | Use skeletons or reserved placeholders only where real waiting exists; preserve final geometry so recruiter scanning is never reset by layout shift |
| Responsive single-column-first scanning | Recruiters often scan quickly on mobile or narrow windows, so content must reflow cleanly | MEDIUM | Preserve source-order reading, keep headings/summary/contact easy to find, and avoid horizontal scrolling except inside truly two-dimensional interactive surfaces |
| Clear spacing rhythm and section chunking | A recruiter-facing portfolio should be easy to skim, not visually noisy or cramped | MEDIUM | Use consistent vertical rhythm, predictable section padding, and tighter grouping inside related content blocks so the page reads as fast, distinct chunks |
| Mobile-safe interaction ergonomics | Baseline mobile usability already exists; premium polish means fewer friction points | MEDIUM | Ensure tap targets, sticky elements, overlays, and interactive panels do not crowd content or obscure CTAs on smaller viewports |
| Orientation-preserving section transitions | When a user moves between map, panel, and timeline states, the relationship should stay obvious | HIGH | Transitions should explain “what changed” without forcing the recruiter to re-parse the whole section |

### Differentiators (Competitive Advantage)

Features that make the portfolio feel notably more premium while still serving recruiter comprehension and contact conversion.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Cross-component choreography for knowledge map, detail panel, and timeline | Makes the interactive core feel polished and legible instead of three loosely connected widgets | HIGH | Best differentiator in this milestone: selected state, panel update, and timeline emphasis should feel like one event, not separate rerenders |
| Content-shaped skeletons or graceful progressive reveals | Improves perceived polish because loading feedback previews what is coming instead of showing generic spinners | MEDIUM | Best used for async subsections, media, or heavy client surfaces; avoid decorative placeholders for server-fast content |
| Responsive layout recomposition, not just breakpoint shrinking | Makes the page feel designed for each viewport instead of merely compressed | HIGH | Allow section stacking, content reprioritization, and CTA relocation if it improves recruiter scan speed and keeps contact actions visible |
| Evidence-first hierarchy tuning | Premium recruiter portfolios front-load proof, role fit, and action paths instead of making users hunt | MEDIUM | Strong candidate for layout restructuring: sharpen hero-to-proof-to-contact flow before polishing secondary details |
| Adaptive motion intensity by context | Lets the experience feel smooth on desktop without becoming heavy on mobile or low-power devices | HIGH | Same motion language, lighter amplitude/duration on constrained devices or reduced-motion contexts |
| Micro-interactions that reinforce credibility | Small polish cues can make the portfolio feel maintained and intentional | LOW | Examples: refined hover/focus states, smooth CTA affordances, crisp section-entry transitions, and subtle active-state emphasis |

### Anti-Features (Commonly Requested, Often Problematic)

Features that sound “premium” but usually hurt recruiter outcomes in this milestone.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Cinematic reveal sequences and long scroll-triggered entrances | Feels high-end and portfolio-like | Slows scanning, delays access to facts, and makes the page feel self-indulgent instead of recruiter-friendly | Use short, consistent, skippable reveals that support orientation rather than spectacle |
| Parallax / large travel / scale-heavy motion | Common shorthand for “premium” visual design | Can trigger motion sensitivity, increase distraction, and compete with content comprehension | Prefer opacity, subtle translate, or emphasis transitions; remove under reduced-motion |
| Generic spinner-first loading everywhere | Easy default when polishing perceived performance | Spinners communicate waiting but not structure; overuse makes the site feel slower and less deliberate | Reserve layout space and use skeletons or direct content reveal where geometry is known |
| Fake loading for already-fast SSR content | Sometimes added to make transitions feel “designed” | Creates artificial waiting and harms the portfolio’s fast-scan value proposition | Show real content immediately; animate only genuine state changes |
| Aggressive visual reordering across breakpoints | Can make desktop compositions look clever or dense | Risks disconnecting visual order from reading/tab order and weakens scannability | Keep source order logical; recompose blocks without obscuring narrative hierarchy |
| Hover-only affordances | Desktop interactions can tempt polished hover states as the main signal | Fails on touch devices and hides important affordances from part of the audience | Pair hover polish with visible default affordances, focus states, and tap-safe behavior |
| Sticky UI that steals viewport from content | Seems useful for persistent nav/contact | On small screens or zoomed layouts it can obstruct reading and primary actions | Use minimal sticky patterns only where they preserve orientation without covering content |
| Full layout rewrite before validating hierarchy gains | Bigger change can feel like the fastest route to “premium” | High risk of disrupting proven recruiter flow without evidence the new structure is better | Start with hierarchy and spacing fixes, then do targeted restructuring where it clearly improves scan speed |

## Feature Dependencies

```
[Responsive content hierarchy]
    └──requires──> [Clear spacing rhythm and section chunking]

[Stable loading states]
    └──requires──> [Reserved layout geometry]

[Consistent low-distraction motion system]
    ├──requires──> [Reduced-motion-safe behavior]
    └──requires──> [Immediate interaction feedback]

[Cross-component choreography for map/panel/timeline]
    └──requires──> [Consistent low-distraction motion system]

[Responsive layout recomposition]
    └──enhances──> [Evidence-first hierarchy tuning]

[Cinematic reveal sequences] ──conflicts──> [Recruiter fast-scan behavior]
[Aggressive visual reordering] ──conflicts──> [Responsive single-column-first scanning]
[Sticky UI that steals viewport] ──conflicts──> [Mobile-safe interaction ergonomics]
```

### Dependency Notes

- **Responsive content hierarchy requires spacing rhythm:** hierarchy is not just order; it is also created by spacing, grouping, and separation.
- **Stable loading states require reserved layout geometry:** skeletons only help if they prevent jumps and approximate the final structure.
- **Consistent motion requires reduced-motion safety:** motion polish is incomplete if the same system cannot degrade cleanly for sensitive users.
- **Consistent motion requires immediate interaction feedback:** the motion system should first confirm user input, then add polish.
- **Map/panel/timeline choreography requires a shared motion language:** otherwise transitions feel fragmented and the interaction model becomes harder to parse.
- **Responsive recomposition enhances hierarchy tuning:** some recruiter-first improvements may require moving or regrouping blocks, not only resizing them.
- **Cinematic reveals conflict with recruiter fast-scan behavior:** the more motion asks to be watched, the less the page supports rapid evaluation.
- **Aggressive visual reordering conflicts with responsive scanning:** users should not have to relearn the page order between desktop, mobile, and zoomed views.
- **Sticky UI conflicts with mobile ergonomics when overused:** persistent chrome is only worth it if it does not hide content or CTAs.

## MVP Definition

### Launch With (v1.2)

Minimum successful polish milestone for recruiter-facing UX/UI.

- [ ] Shared motion rules across core surfaces — one restrained motion language for section reveals, panel/timeline changes, and micro-interactions
- [ ] Immediate feedback on key actions — buttons, nav, hotspot selection, and panel changes acknowledge input clearly and quickly
- [ ] Reduced-motion-safe implementation — non-essential motion reduces or disappears without breaking clarity
- [ ] Stable loading polish where real waiting exists — skeletons/placeholders only for genuinely delayed surfaces, with reserved space to prevent jumps
- [ ] Spacing and padding rhythm pass — sections, cards, and metadata rows are rebalanced for faster recruiter scanning
- [ ] Responsive reflow pass — mobile/narrow/zoomed layouts preserve hierarchy, CTA visibility, and one-direction reading for normal content
- [ ] Targeted map/panel/timeline transition smoothing — the portfolio’s most interactive area feels coherent rather than abrupt

### Add After Validation (v1.2.x)

Good follow-ons once the core polish is clearly better.

- [ ] Broader layout restructuring — add if testing or review shows current section order still slows recruiter comprehension
- [ ] Smarter content-shaped skeleton coverage — add if more async surfaces are introduced or perceived loading still feels rough
- [ ] Adaptive motion tuning by device/context — add if desktop and mobile need meaningfully different motion intensity
- [ ] Persistent but non-obstructive orientation aids — add if recruiters benefit from subtle sticky cues without viewport loss

### Future Consideration (v2+)

Interesting, but too risky or too ornamental for this milestone.

- [ ] Experimental scroll-driven storytelling — defer because recruiter portfolios benefit more from scan speed than cinematic sequencing
- [ ] Style-first art direction layers that add little informational value — defer until core hierarchy and conversion are already excellent
- [ ] Major IA redesign of the one-page narrative — defer until validated by analytics, usability review, or a new product goal

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Consistent low-distraction motion system | HIGH | MEDIUM | P1 |
| Immediate interaction feedback | HIGH | LOW | P1 |
| Reduced-motion-safe behavior | HIGH | MEDIUM | P1 |
| Stable loading states with reserved layout space | HIGH | MEDIUM | P1 |
| Responsive single-column-first scanning | HIGH | MEDIUM | P1 |
| Clear spacing rhythm and section chunking | HIGH | MEDIUM | P1 |
| Mobile-safe interaction ergonomics | HIGH | MEDIUM | P1 |
| Orientation-preserving map/panel/timeline transitions | HIGH | HIGH | P1 |
| Evidence-first hierarchy tuning | HIGH | MEDIUM | P2 |
| Responsive layout recomposition | MEDIUM | HIGH | P2 |
| Adaptive motion intensity by context | MEDIUM | HIGH | P2 |
| Content-shaped skeleton refinement | MEDIUM | MEDIUM | P2 |
| Experimental scroll storytelling | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for milestone success
- P2: Should have if core polish is already strong
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| Motion polish | Standard developer portfolio uses abrupt fades or library-default reveals | Award-style portfolio uses cinematic motion that prioritizes spectacle | Use restrained motion that improves clarity, not spectacle |
| Loading states | Many portfolios show blank gaps or generic spinners | Design-heavy portfolios sometimes fake loading for drama | Show immediate content where possible; use structural placeholders only for genuine waits |
| Responsive behavior | Common approach is simple breakpoint shrink | Visual-first approach often preserves composition at the cost of scanability | Recompose for recruiter reading order, CTA visibility, and clean reflow |
| Spacing/layout rhythm | Many portfolios feel inconsistent between sections due to iterative growth | Highly artistic portfolios may use intentionally irregular rhythm | Use deliberate rhythm and grouping that speeds scanning while still feeling premium |

## Sources

- Project scope and recruiter-first success criteria: `/home/riccardolm/github/94lama/.planning/PROJECT.md` — HIGH
- W3C, Understanding SC 1.4.10 Reflow (updated 2025-09-16): https://www.w3.org/WAI/WCAG22/Understanding/reflow.html — HIGH
- W3C, Understanding SC 2.3.3 Animation from Interactions (updated 2025-09-16): https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html — HIGH
- MDN, `prefers-reduced-motion` (modified 2026-04-20): https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — HIGH
- MDN, Realizing common layouts using grids (modified 2026-02-19): https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Realizing_common_layouts_using_grids — HIGH
- NN/g, Response Times: The 3 Important Limits: https://www.nngroup.com/articles/response-times-3-important-limits/ — MEDIUM
- NN/g, Progress Indicators Make a Slow System Less Insufferable: https://www.nngroup.com/articles/progress-indicators/ — MEDIUM
- NN/g, How Users Read on the Web: https://www.nngroup.com/articles/how-users-read-on-the-web/ — MEDIUM
- NN/g, F-Shaped Pattern of Reading on the Web: https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ — MEDIUM

---
*Feature research for: recruiter-facing portfolio UX/UI improvement milestone v1.2*
*Researched: 2026-04-21*
