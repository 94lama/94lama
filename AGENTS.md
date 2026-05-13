# Project: 94lama Portfolio

Personal recruiter-focused portfolio site for Riccardo La Malfa. Single-page app deployed as static export to GitHub Pages.

## Stack

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js | 16.2.3 |
| UI | React | 19.2.4 |
| Language | TypeScript | 5.x (strict) |
| Styling | Tailwind CSS | 4.x |
| Animation | anime.js | 4.3.6 |
| i18n | next-intl | 4.11.0 |
| Analytics | Google Tag Manager | via @next/third-parties |
| Testing (unit) | Node test runner | tsx --test |
| Testing (e2e) | Playwright | 1.51.1 |

## Deployment constraint: STATIC EXPORT ONLY

- `next.config.ts` sets `output: "export"` and `images.unoptimized: true`
- Deployed to GitHub Pages — **no server-side features allowed**
- Forbidden: Server Components, API routes, server actions, `next/headers`, `next/cookies`, `getServerSideProps`
- All interactive components must use `"use client"` directive
- Data must come from static JSON files or client-side fetch

## File size limit

**≤200 lines per file.** Files exceeding this must be split into smaller modules grouped in a feature directory.

Current violations (known tech debt — split when touching these files):
- `knowledge-map/runtime.ts` (644 lines)
- `knowledge-map/knowledge-map-panels.tsx` (318 lines)
- `skills-knowledge-map.tsx` (317 lines)
- `knowledge-map/model.ts` (294 lines)
- `certificates-section.tsx` (276 lines)
- `drag-resize/drag-resize-pointer.ts` (206 lines)

## Project structure

```
src/
  app/
    [locale]/              # i18n route group (en, it, fr)
      layout.tsx           # RootLayout — fonts, metadata, GTM, MotionController, VhFixer
      page.tsx             # Home — composes all sections
      globals.css          # Tailwind + CSS custom properties + motion classes
      loading.tsx          # Route shell skeleton loader
    components/
      drag-resize/         # Draggable/resizable card feature
        drag-resize.client.tsx
        drag-resize-helpers.ts
        drag-resize-pointer.ts
        drag-resize-animation.ts
      knowledge-map/       # 3D skill graph + panels
        model.ts           # Graph data model (nodes, edges, 3D positions)
        runtime.ts         # Canvas rendering (OGL/WebGL)
        selection.ts       # Node selection logic
        knowledge-map-panels.tsx  # Side panels
        viewport.tsx       # Canvas viewport wrapper
      layout/              # Page layout primitives
        page-rhythm.ts     # Spacing/grid rhythm constants
        responsive-section-grid.tsx
      loading/             # Loading states
        route-shell-skeleton.tsx
        page-loader-overlay.tsx
      hero-section.tsx     # Hero with photo, contact, languages, drag-resize wrapper
      hero-contact-line.tsx
      hero-based-in.tsx
      hero-languages.client.tsx
      hero-preferred-regions.tsx
      skills-knowledge-map.tsx    # Full knowledge map + experience timeline
      knowledge-experience-coordinator.tsx  # State bridge between map and timeline
      experience-timeline-section.tsx
      experience-card.tsx
      section-shell.tsx
      section-heading.tsx
      section-card-styles.ts
      certificates-section.tsx
      education-section.tsx
      relocation-section.tsx
      languages-section.tsx
      language-tile.client.tsx
      contact-actions.tsx
      motion-controller.tsx       # Global hover/focus motion effects
      vh-fixer.tsx                # Mobile viewport height fix
      portfolio-icons.tsx
    lib/
      animation.ts         # anime.js wrapper (centralize animation defaults)
  content/
    portfolio/
      types.ts             # PortfolioContent, SkillGroup, ExperienceEntry, etc.
      get-portfolio-content.ts  # Reads cv.json + experience.json
      knowledge-map-selection.ts  # Selection type
      rank-experience-by-selection.ts  # Scores experience by selected skills
  i18n/
    request.ts             # Locale config (en, it, fr), validation, static params
messages/                   # next-intl translation JSON files
public/
  assets/
    cv.json                # Primary content: hero, summary, skills, languages, contact, etc.
    experience.json        # Experience entries with relatedDomains/relatedSkills
    skills-graph.svg       # Radar chart for README
    icon.svg, icon.png     # Favicon
    readme/                # README badges
tests/
  phase-03-contact-validation.test.ts
  phase-04-knowledge-experience.test.ts
  e2e/portfolio-parity.spec.ts
```

## Data flow

1. `page.tsx` imports `cv.json` directly (as static JSON import) for `HeroSection` and sections
2. `KnowledgeExperienceCoordinator` receives `skillGroups` and `experience` as props
3. `createKnowledgeMapGraph()` builds 3D graph from `SkillGroup[]`
4. User selects node → `selection.ts` resolves affected skills → `rankExperienceBySelection()` re-ranks experience entries
5. `SkillsKnowledgeMap` renders graph (WebGL via OGL) + panels + experience timeline

**Key data types** (see `src/content/portfolio/types.ts`):
- `SkillGroup` — category + entries with optional knowledge rating
- `ExperienceEntry` — role, company, dateRange, highlights, relatedDomains, relatedSkills
- `PortfolioContent` — top-level shape (hero, summary, skills, experience, education, certificates, languages, relocation, contact)

## Color system & theming

Dark/light via CSS custom properties in `globals.css`:
- `--background`, `--foreground`, `--surface`, `--surface-strong`, `--muted`, `--accent`, `--accent-foreground`, `--border`
- Both `prefers-color-scheme` queries use same variable names — Tailwind references them via `@theme inline`
- Fonts: Geist Sans (primary), Geist Mono (code)

## Motion system

- CSS classes: `.motion-surface`, `.motion-control`, `.motion-image` — declare intent
- `MotionController` — global pointer/focus listeners, applies anime.js transforms
- Hover effects: `.motion-image` (scale 1.03), `.motion-control` (translateY -4 + scale), `.motion-surface` (translateY -6 + scale)
- `::after` pseudo-elements for hover overlay gradient
- `prefers-reduced-motion` respected globally, with graceful override
- Animation wrapper in `src/app/lib/animation.ts` — always use this, never anime.js directly

## i18n

- 3 locales: `"en"`, `"it"`, `"fr"` (configured in `src/i18n/request.ts`)
- Route-based: `/[locale]/page.tsx`, `/[locale]/layout.tsx`
- `generateStaticParams()` from `getStaticLocaleParams()`
- Default locale: `"en"`
- Messages in `messages/{locale}.json`
- Use `next-intl` APIs for translations

## Component conventions

- Prefer functional components with hooks
- Use `"use client"` only when needed (state, effects, event handlers, browser APIs)
- Props typed via `Readonly<{...}>` interface
- Use `@/components/*`, `@/lib/*`, `@/i18n/*`, `@/app/*` path aliases (see tsconfig paths)
- Each component file = one export (default or named)
- CSS: Tailwind utility classes in JSX; custom styles in `globals.css`
- Layout constants (spacing, grids) centralized in `page-rhythm.ts` and reused via `pageRhythm` / `sectionRhythm` objects

## Build & verify

```bash
npm run dev          # Start dev server
npm run build        # Static export → out/
npm run lint         # ESLint
npm test             # Phase 03 + 04 validation tests (tsx --test)
npm run test:e2e     # Playwright e2e tests
```

**Always run `next build` after changes** to verify static export succeeds. The build must produce `out/` without errors. Server-only features will break the build.

## Testing strategy

- **Unit/integration**: Node test runner via `tsx --test` — validates data integrity, component wiring, content structure
- **e2e**: Playwright — visual parity and interaction flows
- Test files import from relative paths (e.g., `../src/content/portfolio/types.ts`)
- Tests read source files and JSON data directly — no mocking of content

## Git conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`, `ui:`, `refactor:`)
- Atomic commits with small, focused PRs

## Key constraints summary

1. **Static export only** — no server features
2. **≤200 lines per file** — split when exceeding
3. **Group related files in feature directories** (see drag-resize/, knowledge-map/, loading/, layout/)
4. **Use `@/` path aliases** — never relative imports across directories
5. **Run `next build` after changes** — verify static export
6. **Keep AGENTS.md updated** when conventions change
7. **No Server Components** — use `"use client"` for interactive parts
8. **Data from static JSON** — `public/assets/cv.json` and `public/assets/experience.json`
