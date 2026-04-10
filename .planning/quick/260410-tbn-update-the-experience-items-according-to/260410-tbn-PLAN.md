---
quick_task: 260410-tbn
type: quick
autonomous: true
files_modified:
  - app/page.tsx
  - app/components/skills-knowledge-map.tsx
  - app/components/experience-map-section.tsx
---

<objective>
Link the knowledge-map selection to the experience section so the visible experience items update when the visitor selects a skill point or a skill category.

Purpose: Turn the new 3D knowledge map into a recruiter-facing navigation control instead of an isolated visual, making experience evidence react to the selected skill context.
Output: A shared client-side selection flow between the knowledge map and the experience list, with deterministic filtering/fallback behavior.
</objective>

<context>
@.planning/STATE.md
@./AGENTS.md
@.planning/quick/260410-swt-the-knowledge-map-has-to-be-interactive-/260410-swt-SUMMARY.md
@app/page.tsx
@app/components/skills-knowledge-map.tsx
@src/content/portfolio/types.ts
@public/assets/cv.md

<interfaces>
From `src/content/portfolio/types.ts`:
```ts
export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  dateRange: string;
  highlights: string[];
}
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create a shared selection bridge for skills and experience</name>
  <files>app/page.tsx, app/components/skills-knowledge-map.tsx, app/components/experience-map-section.tsx</files>
  <action>Create `app/components/experience-map-section.tsx` as the client boundary that receives `skillGroups` and `experience` from `app/page.tsx`, owns the active knowledge-map selection, and renders both the map and the experience list from the same state. Update `SkillsKnowledgeMap` to support controlled selection via props plus an `onSelectionChange` callback that reports the selected node id, label, kind, and active group index for every interaction path (canvas pick, skill chip, category button). Keep `app/page.tsx` as the async server page that loads portfolio content once, then passes only the needed data into the new client wrapper. Per `AGENTS.md`, the executor should read the relevant Next.js App Router/client-component guide before changing server/client boundaries.</action>
  <verify>
    <automated>rg -n "onSelectionChange|selectedNodeId|activeIndex|experience-map-section" app/page.tsx app/components/skills-knowledge-map.tsx app/components/experience-map-section.tsx</automated>
  </verify>
  <done>The knowledge map no longer owns isolated selection state; the selected skill/category can drive other UI in the page through a single shared client state.</done>
</task>

<task type="auto">
  <name>Task 2: Update experience items from the current knowledge-map selection</name>
  <files>app/components/skills-knowledge-map.tsx, app/components/experience-map-section.tsx</files>
  <action>In `app/components/experience-map-section.tsx`, derive the displayed experience entries from the active selection using deterministic case-insensitive text matching against each entry's `role`, `company`, and `highlights`. When a skill node is selected, show only entries matching that skill label. When a category node is selected, show entries matching any skill item from that category. When the core node is selected, or a selection produces zero matches, fall back to the full experience list and show concise helper copy explaining the fallback. Preserve the existing structured rendering of role, company, date range, and highlights; do not hardcode manual mappings that duplicate CV data unless matching logic truly cannot infer a relationship.</action>
  <verify>
    <automated>npm run lint &amp;&amp; npm run build</automated>
  </verify>
  <done>Changing the selected point or category in the knowledge map updates the experience items shown on the page, while unmatched selections degrade gracefully to the full list.</done>
</task>

</tasks>

<success_criteria>
- The skills knowledge map and experience section share one selection state.
- Selecting a skill point narrows experience items to entries relevant to that skill.
- Selecting a category updates experience items using that category's skill set.
- Core or unmatched selections fall back to the full experience list with clear explanatory copy.
- `npm run lint` and `npm run build` pass after the change.
</success_criteria>

<output>
After completion, create `.planning/quick/260410-tbn-update-the-experience-items-according-to/260410-tbn-SUMMARY.md`
</output>
