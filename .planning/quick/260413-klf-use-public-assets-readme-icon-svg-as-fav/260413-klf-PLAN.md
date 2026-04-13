---
id: 260413-klf
type: quick-plan
mode: quick
autonomous: true
files_modified:
  - app/layout.tsx
---

# Quick Plan — Use public/assets/readme/icon.svg as favicon

## Objective

Set the existing `public/assets/readme/icon.svg` asset as the app favicon using the App Router metadata API with the smallest possible change.

## Context

- This repo uses Next.js App Router and already defines root metadata in `app/layout.tsx`.
- Next.js 16 docs recommend file-based icon metadata where possible, but `metadata.icons.icon` supports directly referencing a public asset path.
- The user explicitly wants the existing `public/assets/readme/icon.svg` used as the favicon.

## Tasks

### Task 1 — Wire the favicon in root metadata

Files:
- app/layout.tsx

Action:
- Add an `icons` entry to the exported `metadata` object.
- Point `icons.icon` to `/assets/readme/icon.svg` so the asset served from `public/` becomes the favicon.

Verify:
- `app/layout.tsx` still exports valid `Metadata`.
- The metadata object contains `icons: { icon: "/assets/readme/icon.svg" }`.

Done:
- Root metadata references the requested favicon asset and is committed atomically.

### Task 2 — Quick docs/state bookkeeping

Files:
- .planning/quick/260413-klf-use-public-assets-readme-icon-svg-as-fav/260413-klf-PLAN.md
- .planning/quick/260413-klf-use-public-assets-readme-icon-svg-as-fav/260413-klf-SUMMARY.md
- .planning/STATE.md

Action:
- Create the quick task summary.
- Add a row to `.planning/STATE.md` Quick Tasks Completed.
- Update the current Last activity line for this quick task.

Verify:
- Summary exists and references the implementation commit.
- STATE.md includes quick task `260413-klf`.

## Success criteria

- `app/layout.tsx` uses `/assets/readme/icon.svg` as favicon.
- `.planning/quick/.../260413-klf-PLAN.md` exists.
- `.planning/quick/.../260413-klf-SUMMARY.md` exists.
- `.planning/STATE.md` includes the quick task row and updated Last activity.
