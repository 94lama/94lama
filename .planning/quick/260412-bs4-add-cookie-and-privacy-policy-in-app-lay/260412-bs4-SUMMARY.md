---
phase: quick
plan: 260412-bs4
subsystem: ui
tags: [nextjs, app-router, layout, next-script, iubenda]
requires: []
provides:
  - legal footer wiring sourced from app component html snippets
  - root layout-safe policy integration without restoring deleted public anchors
affects: [app/layout.tsx, app/components/legal-embed-footer.tsx, legal embeds]
tech-stack:
  added: []
  patterns: ["Read legal policy snippets from app-local html files and mount third-party scripts through next/script in the footer boundary"]
key-files:
  created: [app/components/cookie-policy.html, app/components/privacy-policy.html]
  modified: [app/components/legal-embed-footer.tsx]
key-decisions:
  - "Use app/components/cookie-policy.html and app/components/privacy-policy.html as the only source of truth for the legal links and script content."
  - "Leave unrelated public anchor deletions untouched because they were out of scope for this quick task."
patterns-established:
  - "Keep legal embed integration in a dedicated footer component rather than injecting raw html into the root layout."
requirements-completed: []
duration: 1 task
completed: 2026-04-12
---

# Phase quick Plan 260412-bs4: add-cookie-and-privacy-policy-in-app-lay Summary

**Legal footer now derives cookie and privacy policy embeds from app-local html snippets while staying App Router-safe in Next 16**

## Performance

- **Tasks:** 1 code commit already completed
- **Files modified:** 3
- **Completed:** 2026-04-12

## Accomplishments
- Wired `app/components/legal-embed-footer.tsx` to read `app/components/cookie-policy.html` and `app/components/privacy-policy.html` as the source of truth.
- Kept the existing root layout integration intact so the legal embed stays mounted through the footer boundary instead of raw html in `app/layout.tsx`.
- Added the untracked snippet files to version control without restoring unrelated deleted `public/*` anchor files.

## Task Commits

1. **Completed quick task: add cookie/privacy policy integration in app layout** - `a44ab99` (fix)

## Files Created/Modified
- `app/components/legal-embed-footer.tsx` - Reads and parses the two html snippets, then renders their links and scripts through `next/script`.
- `app/components/cookie-policy.html` - Canonical cookie policy snippet committed as app-local source of truth.
- `app/components/privacy-policy.html` - Canonical privacy policy snippet committed as app-local source of truth.

## Decisions Made
- Followed the Next 16 scripts guidance by keeping third-party script loading inside `next/script` rather than injecting raw html into the root layout.
- Left `public/cookie-anchor.html` and `public/privacy-anchor.html` deletions untouched because they were unrelated to this task and not required for the new snippet-based integration.

## Verification
- `npx eslint app/layout.tsx app/components/legal-embed-footer.tsx`
- `npm run build`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Narrowed lint verification to changed files**
- **Found during:** Verification
- **Issue:** Repo-wide `npm run lint` remains blocked by a pre-existing unrelated error in `app/components/experience-map-controller.tsx`.
- **Fix:** Verified the changed integration files directly with `npx eslint app/layout.tsx app/components/legal-embed-footer.tsx`.
- **Files modified:** None
- **Verification:** `npx eslint app/layout.tsx app/components/legal-embed-footer.tsx`, `npm run build`
- **Committed in:** `a44ab99`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** No scope creep. The workaround only bypassed an unrelated repository lint blocker while confirming the changed task files and production build were healthy.

## Issues Encountered
- Repo-wide `npm run lint` is still blocked by the unrelated pre-existing error in `app/components/experience-map-controller.tsx`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Legal policy integration is now sourced from the committed app-local snippet files.
- Unrelated public anchor deletions remain untouched and can be handled separately if ever needed.

## Self-Check: PASSED
- Found `.planning/quick/260412-bs4-add-cookie-and-privacy-policy-in-app-lay/260412-bs4-SUMMARY.md`
- Found commit `a44ab99`
