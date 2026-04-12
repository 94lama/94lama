# Feature Landscape — v1.1 TODO Refresh

**Domain:** recruiter-facing one-page portfolio refresh  
**Scope:** new milestone features only  
**Researched:** 2026-04-12  
**Overall confidence:** MEDIUM-HIGH

## What polished portfolio behavior looks like for this milestone

For a recruiter-first portfolio, polish should improve first-impression quality **without adding interpretation cost**. The best versions of these features make the page feel more intentional, faster to scan, and easier to trust.

The key rule for this milestone: **interaction should reveal relevance, not hide information**. The knowledge map can become the visual entry point for skills, but the experience timeline still needs to remain fully visible so recruiters never lose the core evidence block.

The recommended v1.1 pattern is: **blue-led visual refresh + restrained motion + knowledge-map-as-navigation + synced experience highlighting/reordering + cleaner relocation/contact utilities + compliant consent bootstrap**.

## Table Stakes

Features users will expect once this refresh exists. Missing them makes the refresh feel unfinished or harder to use.

| Feature | Expected Behavior in a Polished Portfolio | Complexity | Notes |
|---------|-------------------------------------------|------------|-------|
| Blue-led visual refresh | Replace green accents with a blue system across CTA, chips, focus states, active map nodes, and highlight treatments; preserve strong contrast and fast section scanning. | Low | This is visual-system work, not a redesign of layout hierarchy. |
| Subtle motion polish | Use small hover, fade, and position transitions to clarify interactivity and depth; motion should support focus, not become a hero effect. Respect `prefers-reduced-motion`. | Low-Med | Best done with CSS transitions/animations on opacity/transform, not heavy page-wide JS animation. |
| Knowledge map replaces standalone skills section | Section `01` should present the map as the primary skills surface, with a short explainer and visible legend/help copy. Users should understand “click a node to see related experience.” | Med | The map becomes a navigation aid, not a decorative extra. |
| Map selection syncs with experience | Selecting a node/category should immediately update the experience section state so the page feels coherent. | Med | Shared parent-managed state is the right model and already aligns with project constraints. |
| Experience remains fully visible | All experience entries stay on screen; relevant entries highlight and rise in order, while unrelated entries stay readable but de-emphasized. | Med | Better recruiter UX than hard filtering, which can hide proof and create dead ends. |
| Richer relocation details | Relocation section should answer practical recruiter questions: where, when, preferences, and degree of openness. | Low-Med | Important because current CV data is brief and recruiters use this as a screening input. |
| Compact icon-based contact links | Contact should collapse to compact actions for email/GitHub/LinkedIn with clear hover/focus states and visible or accessible labels. | Low | Icon-only is acceptable only if naming remains explicit for accessibility. |
| Bootstrap cookie consent prompt | If the site uses third-party services/cookies, prompt at app bootstrap with a real consent mechanism, not just footer policy links. | Med | Current footer embeds policies, but policy links are not the same as consent collection. |

## Differentiators

Features that make this refresh feel more polished than a generic portfolio.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Knowledge map as the first skills surface | Turns skills from a static list into a memorable recruiter-friendly navigation model while keeping the page single-page and evidence-led. | Med | Strong differentiator because it supports the narrative instead of adding a gimmick section later. |
| Selection-driven experience reordering | Helps recruiters connect a chosen skill cluster to proof faster without losing the complete timeline. | Med | Better than filtering-only and better aligned with recruiter scan behavior. |
| More spatial, de-centered map layout | Removing the center sphere and spreading nodes gives the map a cleaner, less toy-like 3D feel. | Med | Useful if it improves legibility and hit targets; not valuable if it reduces readability. |
| Cleaner contact utility bar | Icon-based contact actions reduce visual bulk and make the bottom of the page feel more product-like and deliberate. | Low | Works best when paired with strong tooltips/labels and one primary email CTA. |
| Relocation detail framed as decision support | Adding timing/preferences makes relocation content answer recruiter objections proactively. | Low | This is small in build effort but high in hiring relevance. |

## Anti-Features

Things to explicitly avoid in this milestone.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Heavy cinematic animation | Slows scan speed and makes the portfolio feel self-indulgent. | Use subtle transform/opacity motion and limit motion to affordance and depth cues. |
| Hard-filtering experience to only matches | Recruiters can miss important timeline context and think experience is thin. | Keep all entries visible; highlight and reorder matches. |
| Keeping both skills list and knowledge map | Duplicates information and weakens the purpose of the map. | Let the map fully replace the standalone skills section. |
| Icon-only links without accessible naming | Hurts clarity and accessibility, especially for screen readers and low-confidence users. | Add visible labels, tooltips, or strong `aria-label`s with distinct names. |
| Repeating relocation info in multiple sections | Creates noise and makes the page feel less curated. | Keep relocation depth in the dedicated section; keep contact focused on contact actions. |
| Cookie “banner” that is only a legal link | Looks compliant without actually collecting/recording consent. | Use a real CMP/bootstrap prompt if consent is required. |
| OOP management-layer rewrite | Too much structural churn for a presentation-focused milestone. | Refactor into atomized React components with shared state at the correct parent boundary. |

## Expected Behavior by Feature

### 1. Blue-led visual refresh
- Blue becomes the primary accent for CTA, active states, selected map nodes, bullets, and focus outlines.
- Neutrals and typography hierarchy stay stable so recruiters do not need to re-learn the page.
- The refresh should feel cooler and more technical, not louder.

### 2. Subtle motion
- Hover: slight lift/glow on CTAs and interactive chips.
- Enter/update: soft opacity/translate transitions for reordered experience items and section polish.
- Map: motion should emphasize state change and depth, not constant distraction.
- Reduced-motion mode should tone down or disable non-essential movement.

### 3. Knowledge map in section `01`
- The map should occupy the old skills slot.
- The purpose should be obvious within a few seconds: browse skill clusters, then inspect related experience.
- Remove the center sphere if it reads as decorative rather than informative.
- Spread nodes enough to improve separability and reduce clutter.

### 4. Syncing map selection with experience
- Selection state should live above both the map and the experience list.
- Category selection highlights a cluster; node selection sharpens to a specific skill.
- The experience section should respond immediately with matching emphasis and ordering.
- Empty matches should gracefully fall back to the full list with explanatory helper copy.

### 5. Richer relocation details
- Add practical signals such as preferred regions, openness level, and rough availability/timing if available from authored content.
- Keep tone factual and concise; avoid long lifestyle copy.
- Relocation should help qualification, not read like a personal essay.

### 6. Icon-based contact links
- Keep email as the clearest primary CTA.
- Secondary links can become compact icons/buttons for GitHub and LinkedIn.
- Each action needs clear accessible naming; visible tooltips/labels are a plus.
- Do not repeat location/relocation content here.

### 7. Bootstrap cookie consent
- Consent prompt appears at app bootstrap, not buried in footer navigation.
- It should present real choices and link to privacy/cookie policy.
- If using iubenda, use its CMP/banner flow; current footer embeds alone are insufficient for consent UX.

## Dependencies

```text
Blue-led visual refresh → Contact icon styling, map active-state styling, experience highlight styling
Subtle motion → Experience reorder/highlight polish, contact interactions, consent entry/exit transitions
Knowledge map replaces skills section → Shared map/experience state → Experience highlight/reorder behavior
Knowledge map spatial refactor → Better map legibility → Better selection UX
Richer relocation content → Contact simplification (remove duplicated relocation info)
Cookie/privacy policy links in footer → Bootstrap consent prompt (same legal system, different UX responsibility)
Atomized component composition → Safer refactor of map, experience, contact, relocation, and consent pieces
```

## MVP Recommendation for v1.1

Prioritize:
1. **Map/experience restructuring** — move the knowledge map into section `01`, remove duplicate skills block behavior, keep full experience visible with highlight/reorder.
2. **Blue visual system + subtle motion** — apply once the interaction structure is settled so styling targets are stable.
3. **Relocation/contact cleanup** — enrich relocation, compress contact to icon-based utilities, remove duplication.
4. **Cookie consent bootstrap** — add real consent prompting after confirming the required integration path.

Defer:
- Any deeper navigation model beyond single-page recruiter flow.
- Advanced filter logic that hides nonmatching experience items.
- Large-scale component architecture rewrite.
- Decorative motion experiments that do not improve comprehension.

## Complexity Notes

| Feature Area | Complexity | Why |
|--------------|------------|-----|
| Color refresh | Low | Mostly token/class updates with some contrast checking. |
| Motion polish | Low-Med | Easy to overdo; needs accessibility and restraint. |
| Map replacing skills | Med | Requires section restructuring and clearer UX copy. |
| Map/experience sync | Med | State/model already exists, but behavior should shift from filtering toward highlight/reorder. |
| Spatial map changes | Med | 3D layout tweaks can affect readability and hit testing. |
| Relocation expansion | Low-Med | Mostly content-model and presentation changes. |
| Icon contact links | Low | UI simplification with accessibility requirements. |
| Consent bootstrap | Med | Legal/compliance integration is straightforward only if the CMP path is already chosen. |

## Recommendation Summary

This milestone should behave like a **clarity upgrade**, not a feature pile-on. The strongest recruiter-facing result is:

- **map-first skills discovery**,
- **experience-proof synchronization without hiding the timeline**,
- **cleaner blue visual language with restrained motion**,
- **more decision-useful relocation details**,
- **compact but explicit contact actions**,
- and **real consent prompting at bootstrap if consent is required**.

## Sources

- Project context: `/workspaces/94lama/.planning/PROJECT.md`
- Milestone scope: `/workspaces/94lama/TODO.md`
- Existing page and component behavior: `/workspaces/94lama/app/page.tsx`, `/workspaces/94lama/app/components/experience-map-section.tsx`, `/workspaces/94lama/app/components/legal-embed-footer.tsx`
- Current content model: `/workspaces/94lama/public/assets/cv.md`, `/workspaces/94lama/src/content/portfolio/types.ts`
- MDN, Using CSS animations: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations/Using (HIGH)
- MDN, `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion (HIGH)
- W3C APG, accessible names and descriptions: https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/ (HIGH)
- iubenda Cookie Solution overview: https://www.iubenda.com/en/cookie-solution (MEDIUM; product page, but aligns with current embedded iubenda policy setup)
