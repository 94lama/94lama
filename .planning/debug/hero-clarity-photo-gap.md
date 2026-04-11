---
status: investigating
trigger: "Diagnose the single gap recorded in /workspaces/94lama/.planning/phases/02-portfolio-page-experience/02-UAT.md and return a concrete root cause with affected files and fix direction."
created: 2026-04-10T22:57:09Z
updated: 2026-04-10T22:57:09Z
---

## Current Focus

hypothesis: The hero fails the clarity/positioning test because the redesign repeats the same summary/location/relocation information in multiple hero sub-blocks and never allocates a profile-photo slot, even though a photo asset exists.
test: Compare UAT complaint to the actual hero render, source-of-truth content model, and available public assets.
expecting: If true, the page will show duplicated hero copy, the content contract will have no photo field, and a profile image asset will exist but be unused.
next_action: confirm duplication points and image-source mismatch

## Symptoms

expected: At the top of the page, the hero should immediately communicate Riccardo La Malfa's name, frontend-focused full-stack positioning, summary, Italy location, and EU relocation context without needing to scroll or hunt for the information.
actual: User reported the hero should avoid redundancies in text and add a photo.
errors: "avoid redundancies in text and add a photo"
reproduction: Open the portfolio homepage and inspect the hero section.
started: Reported during Phase 2 UAT on 2026-04-10.

## Eliminated

## Evidence

- timestamp: 2026-04-10T22:57:09Z
  checked: .planning/phases/02-portfolio-page-experience/02-UAT.md
  found: The only failed UAT item is hero clarity/positioning, with the explicit user complaint "avoid redundancies in text and add a photo".
  implication: The issue is localized to the hero implementation, not the broader page structure.

- timestamp: 2026-04-10T22:57:09Z
  checked: app/page.tsx hero section
  found: The hero renders content.summary twice (main body and recruiter snapshot), location twice in/near the hero, and relocation summary multiple times across chips/cards/relocation section, but no image component or photo asset usage appears in the hero.
  implication: The current layout creates repeated messaging instead of a single clear positioning block and provides no photo area.

- timestamp: 2026-04-10T22:57:09Z
  checked: src/content/portfolio/types.ts and src/content/portfolio/parse-cv.ts
  found: HeroContent contains only name and role, and the parser extracts no profile-image field from cv.md or elsewhere.
  implication: The content pipeline cannot supply a headshot to the page, so the hero can only render text.

- timestamp: 2026-04-10T22:57:09Z
  checked: public/assets/cv.md and public/assets directory
  found: cv.md is the declared source of truth but contains no photo reference, while public/assets contains an unused file named "foto profilo.jpg".
  implication: A usable photo asset exists, but the current source-of-truth/content contract never exposes it to the hero.

## Resolution

root_cause: The Phase 2 hero redesign in app/page.tsx over-emphasized recruiter metadata by reusing the same summary/location/relocation copy in multiple adjacent blocks, while the underlying portfolio content contract only models text (name/role/summary/contact/relocation) and provides no profile-image field. As a result, the hero ships with redundant text and no way to render the existing profile photo.
fix: Do not apply in diagnosis-only mode.
verification: Diagnosis-only mode.
files_changed: []
