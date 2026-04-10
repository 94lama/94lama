# Phase 1 Research - Content Model & Data Setup

**Date:** 2026-04-10
**Status:** Complete

## Research Question

What implementation approach best preserves `public/assets/cv.md` as the editable source of truth while giving the app a reusable, typed portfolio content model for Phase 1?

## Recommendation

Use a small server-side transformation layer in the Next.js app that:

1. Reads `public/assets/cv.md` directly from the filesystem at runtime/build time.
2. Parses the current heading/list structure with a focused line-oriented parser.
3. Normalizes the result into a typed `PortfolioContent` object consumed by `app/page.tsx`.

This keeps `cv.md` as the only maintained source (D-01, D-02), stays automatically in sync without manual export steps (D-03), and avoids introducing an unnecessary CMS or markdown dependency for a single stable document.

## Why this approach fits Phase 1

### Matches locked decisions
- `public/assets/cv.md` remains the authoring source of truth.
- The parsing layer can preserve the current wording with only light normalization.
- Section-based top-level groups map naturally to the existing CV headings.
- Optional future fields such as `projects`, `github`, and `linkedin` can exist without forcing placeholder content.

### Best fit for current codebase
- The app is a minimal Next.js 16 App Router app with a server-rendered `app/page.tsx`.
- Server components can safely read local files without client bundle impact.
- No existing domain model or content system needs to be preserved.

### Lower risk than alternatives
- A generic markdown parser would add dependency and abstraction cost not justified by the narrow input shape.
- Hardcoding a second TS/JSON dataset would violate D-01/D-02 and create sync drift.
- Build-time generation scripts would add workflow complexity and conflict with D-03 if they require manual reruns.

## Recommended architecture

### Source flow
`public/assets/cv.md` -> parser/normalizer utility -> typed shared content module -> `app/page.tsx`

### Suggested module split
- `src/content/portfolio/types.ts` - exported TypeScript interfaces/types
- `src/content/portfolio/parse-cv.ts` - focused parser for the current markdown shape
- `src/content/portfolio/get-portfolio-content.ts` - reads the file and returns normalized typed content
- `app/page.tsx` - async server component that renders from the shared content source

### Content model shape

Recommended top-level groups:
- `hero`
- `summary`
- `skills`
- `experience`
- `education`
- `languages`
- `relocation`
- `contact`
- `projects?` optional

Recommended details:
- `skills` as grouped categories, not a flat list
- `experience` as structured entries with `role`, `company`, `dateRange`, `highlights[]`
- `contact` as a dedicated object including `email`, `phone?`, `github?`, `linkedin?`, `location`
- `projects` optional and empty-safe

## Parsing guidance

The current markdown is regular enough for a custom parser, but two areas need explicit handling:

1. **Hero block**
   - Line 1: name
   - Line 2: role headline
   - Line 3: inline contact/location row split on ` • `

2. **Professional Experience**
   - Entries are not perfectly normalized.
   - The first experience highlights use deeper indentation.
   - The parser should detect a new entry from a non-list line that matches `Role – Company (dates)` and then collect following bullet lines as highlights until the next entry or section heading.

Other sections can be parsed from headings plus list or paragraph content with light normalization.

## Alternatives considered

### 1. Separate maintained TS/JSON portfolio source
Rejected because it duplicates `cv.md` and breaks the single-source decision.

### 2. Generic markdown AST parser dependency
Not recommended for this phase. It adds dependency weight and still requires custom normalization for the portfolio shape.

### 3. Manual sync/export script
Rejected because it introduces a human step and conflicts with D-03.

## Common pitfalls

- Treating `Projects` as required content instead of optional placeholder support.
- Flattening skill categories into one list, violating D-06.
- Leaving experience as raw markdown blobs instead of structured entries, violating D-07.
- Hiding contact data inside summary/profile text instead of a dedicated object, violating D-08.
- Making GitHub/LinkedIn mandatory even though LinkedIn URL is still missing.
- Over-normalizing authored copy and drifting from the CV wording.

## Implementation constraints for planning

- Stay inside the existing Next.js 16 / React 19 / Tailwind 4 stack.
- Prefer server-only file access from the page/content layer.
- Keep Phase 1 focused on data foundation and safe page wiring, not bold UI redesign.
- Avoid adding new packages unless a concrete blocker appears.

## Validation Architecture

Phase 1 verification should prove three things:

1. A typed shared content module exists and covers all required v1 sections.
2. `app/page.tsx` consumes the shared source instead of hardcoded starter copy.
3. The app still builds/lints successfully after the content-source refactor.

Recommended validation signals:
- File-level checks for exported content types and loader/parser utilities
- Read/grep checks confirming `app/page.tsx` imports and renders shared content
- `npm run lint`
- `npm run build`

Because this repo does not yet have a dedicated test harness, the initial plan may rely on lint/build plus deterministic file-content checks. If the planner introduces parser-specific tests, it should do so explicitly rather than assuming an existing framework.

## Planner guidance

- Create interface contracts for the shared content model before wiring the page.
- Keep file ownership tight so content-model work and page-consumer work can stay understandable.
- Ensure both `CONT-01` and `CONT-02` are explicitly mapped in plan frontmatter.
- Include a threat model even though this phase is low risk; the main trust boundary is local file content entering app rendering.
