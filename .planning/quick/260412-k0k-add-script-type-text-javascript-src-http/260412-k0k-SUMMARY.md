---
quick_task: 260412-k0k
tags: [nextjs, scripts, iubenda, app-router]
key-files:
  created: []
  modified:
    - app/layout.tsx
  deleted: []
completed: 2026-04-12
---

# Quick Task 260412-k0k Summary

**Added the requested global Iubenda widget loader to the root App Router layout via `next/script` with `strategy="beforeInteractive"`, keeping the change isolated to `app/layout.tsx` and aligned with current Next.js script guidance.**

## Accomplishments
- Inserted the requested `https://embeds.iubenda.com/widgets/283fdcdd-8702-47d7-84ee-59bc1203b52c.js` asset in `app/layout.tsx` using `next/script` with `type="text/javascript"` and `strategy="beforeInteractive"` so Next injects it into the document head without raw head markup.
- Preserved the existing metadata, fonts, inline Iubenda loaders, and GTM wiring.
- Verified the layout still linted and built after the script addition.

## Files Created/Modified
- Modified `app/layout.tsx` to include the global Iubenda widget script at the root layout level.

## Validation
- `npm run lint` *(passes; reports existing unrelated warnings in `tests/agent-skills-caveman.test.ts` only)*
- `npm run build`

## Task Commits
- `a8341fe` — `fix(260412-k0k): load Iubenda widget with next/script`
- `0dea861` — `fix(260412-k0k): inject Iubenda widget in head`

## Deviations from Plan
None - plan executed exactly as written.

## Known Stubs
None.
