---
phase: quick
plan: 260412-nbj
subsystem: ui
tags: [readme, github-profile, svg, markdown, developer-branding]

# Dependency graph
requires:
  - phase: quick-task-backlog
    provides: canonical cv facts in public/assets/cv.json and existing profile README surface
provides:
  - local SVG hero banner for the GitHub profile README
  - developer-facing README structure grounded in cv.json facts
  - GitHub-safe profile presentation without remote logo tables or third-party badges
affects: [github-profile, developer-branding, readme-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [local README assets, GitHub-safe markdown plus simple HTML, developer-facing profile copy]

key-files:
  created: [public/assets/readme/profile-banner.svg]
  modified: [README.md]

key-decisions:
  - "Used a local SVG banner as the README anchor instead of remote generators or badge-heavy decoration."
  - "Rewrote the profile in a peer-to-peer developer voice while keeping facts sourced from public/assets/cv.json."
  - "Kept the README GitHub-safe with markdown and a single local image block, avoiding inline styles and third-party branding clutter."

patterns-established:
  - "Profile README refreshes should prefer local assets over remote visual dependencies."
  - "README copy should emphasize stack, shipping style, and collaboration habits rather than recruiter-style self-rating tables."
  - "GitHub profile presentation should stay scannable through short sections and bullet-led hierarchy."

requirements-completed: []

# Metrics
duration: 2m
completed: 2026-04-12
---

# Phase quick Plan 260412-nbj: redesign-the-github-profile-readme-for-f Summary

**Local SVG banner plus a developer-facing GitHub profile README focused on stack, shipped work, and collaboration style.**

## Performance

- **Duration:** 2m
- **Started:** 2026-04-12T17:47:01Z
- **Completed:** 2026-04-12T17:49:20Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments
- Added a repo-local SVG banner that gives the profile README a clear visual anchor without relying on third-party generators.
- Replaced the old logo-table profile stub with a developer-facing README structure built from current cv facts.
- Finished with a GitHub-safety polish pass so the README stays clean, scannable, and free of remote badge clutter.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create the visual system and local hero asset** - `11c987f` (feat)
2. **Task 2: Rewrite README structure and copy for developers** - `e96a394` (feat)
3. **Task 3: GitHub-safety and polish pass** - `335d913` (feat)

**Plan metadata:** Not committed by this executor per quick-task constraints.

## Files Created/Modified
- `public/assets/readme/profile-banner.svg` - Added a custom blue-led banner with code-native framing and GitHub-safe SVG markup.
- `README.md` - Rebuilt the profile around the local banner with concise sections for focus, toolbox, selected work, working style, and contact.

## Decisions Made
- Chose a restrained blue console-card motif so the banner feels developer-oriented rather than recruiter-marketing styled.
- Pulled factual content from `public/assets/cv.json` but rewrote it around how Riccardo builds, ships, and collaborates.
- Removed the previous remote-logo knowledge tables as the main presentation pattern to keep the README lighter and more intentional.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- The GitHub profile README now has a reusable local visual anchor and a cleaner information hierarchy.
- The profile presentation is aligned with the newer `cv.json` source of truth and can be extended without falling back to recruiter-style tables.

## Self-Check: PASSED

- Found summary file at `.planning/quick/260412-nbj-redesign-the-github-profile-readme-for-f/260412-nbj-SUMMARY.md`.
- Verified task commits `11c987f`, `e96a394`, and `335d913` exist in git history.
