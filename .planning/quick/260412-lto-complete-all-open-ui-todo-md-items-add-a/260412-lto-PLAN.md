---
quick_task: 260412-lto
type: quick
autonomous: true
files_modified:
  - app/page.tsx
  - app/components/knowledge-experience-coordinator.tsx
  - app/components/experience-timeline-section.tsx
  - app/components/experience-card.tsx
  - TODO.md
---

<objective>
Complete the remaining open UI TODO items that were left after the previous polish pass.

Purpose: Finish the recruiter-facing visual cleanup by making the hero theme-aware, fixing light-mode contrast in the skills/experience flow, and adding restrained motion that fits the current portfolio aesthetic.
Output: Updated hero + skills/experience UI components and a refreshed `TODO.md` with the completed UI items checked off.
</objective>

<context>
@.planning/STATE.md
@./AGENTS.md
@TODO.md
@app/page.tsx
@app/components/knowledge-experience-coordinator.tsx
@app/components/experience-timeline-section.tsx
@app/components/experience-card.tsx
@app/components/skills-knowledge-map.tsx

<interfaces>
From `app/components/knowledge-experience-coordinator.tsx`:
```tsx
export function KnowledgeExperienceCoordinator({
  skillGroups,
  experience,
}: Readonly<KnowledgeExperienceCoordinatorProps>)

function SectionHeading({ index, title, description }: Readonly<{
  index: string;
  title: string;
  description: string;
}>)
```

From `app/components/experience-timeline-section.tsx`:
```tsx
type ExperienceTimelineSectionProps = {
  entries: RankedExperienceEntry[];
  helperCopy: string;
  isFallback: boolean;
};
```

From `app/components/experience-card.tsx`:
```tsx
type ExperienceCardProps = {
  entry: ExperienceEntry;
  index: number;
  isHighlighted: boolean;
  matchScore: number;
  matchedTerms: string[];
};
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Make the hero section work cleanly in both light and dark mode</name>
  <files>app/page.tsx</files>
  <action>Refactor only the hero area in `app/page.tsx` so it no longer assumes a dark-only presentation. Keep the current content structure, CTA destinations, and recruiter-first layout, but convert hard-coded white-on-dark surfaces into theme-aware classes with readable light-mode text, visible light-mode borders, and light-mode-friendly card/background treatments. Preserve the current accent usage and profile/sidebar composition. Add restrained motion where it is currently missing in the hero (for example subtle load-in or hover transitions on major surfaces/CTAs), using transform/opacity only and keeping the experience calm and professional. Do not add a new animation library and do not redesign the page hierarchy.</action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>The hero reads correctly in both themes, retains the current structure and actions, and includes tasteful motion without harming accessibility or introducing flashy behavior.</done>
</task>

<task type="auto">
  <name>Task 2: Fix light-mode contrast across the skills and experience flow</name>
  <files>app/components/knowledge-experience-coordinator.tsx, app/components/experience-timeline-section.tsx, app/components/experience-card.tsx</files>
  <action>Fix the remaining light-mode contrast issues in the coordinated `01 Skills` and `02 Experience` area. Start with the section descriptions in `knowledge-experience-coordinator.tsx`, especially the skills copy called out in `TODO.md`, then update the experience helper panel and cards so the entire experience component remains readable in light mode while preserving the existing highlight/emphasis logic. Replace dark-only text/surface assumptions with theme-aware classes that still feel visually consistent with `skills-knowledge-map.tsx`. Keep the map-to-experience interaction contract intact. Where useful, add subtle transitions to chips/cards/highlight states so the open `add animations` item is fully closed without changing behavior or adding new dependencies.</action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>The skills heading copy, experience helper copy, and experience cards all have solid light-mode contrast, highlighted states still read clearly in both themes, and any added motion is subtle and behavior-preserving.</done>
</task>

<task type="auto">
  <name>Task 3: Update TODO.md to reflect the completed UI cleanup</name>
  <files>TODO.md</files>
  <action>After the UI changes are implemented and the build passes, update `TODO.md` to mark these four remaining UI items as complete: `add animations`, `adapt hero UI to light/dark mode`, `01 - skills: "Use the knowledge map as the primary skills..." is white also in light mode`, and `02 - experience: texts white also in light mode for the entire component`. Leave the unchecked Architecture, knowledge-map, relocation, and contact items untouched.</action>
  <verify>
    <automated>node -e "const fs=require('fs'); const todo=fs.readFileSync('TODO.md','utf8'); ['add animations','adapt hero UI to light/dark mode','01 - skills: \"Use the knowledge map as the primary skills...\" is white also in light mode','02 - experience: texts white also in light mode for the entire component'].forEach((item)=>{ if(!todo.includes(`- [x] ${item}`)) throw new Error(`Missing checked item: ${item}`); }); ['Use OOP to manage components','Use atomization to manage components','Spread the items more three-dimensionally','add more content','Use an icon also for the email button'].forEach((item)=>{ if(!todo.includes(`- [ ] ${item}`) && !todo.includes(`- [x] ${item}`)) throw new Error(`Missing control item: ${item}`); });"</automated>
  </verify>
  <done>`TODO.md` shows the four UI items as complete and does not silently change unrelated unchecked items.</done>
</task>

</tasks>

<success_criteria>
- The hero section is visually correct in both light and dark mode without changing its content model or CTA behavior.
- The skills and experience sections no longer render white/light-only text in light mode.
- Added animations are restrained, theme-safe, and implemented with existing stack primitives only.
- `TODO.md` is updated to show those four UI items as complete.
- `npm run build` passes.
</success_criteria>

<output>
After completion, create `.planning/quick/260412-lto-complete-all-open-ui-todo-md-items-add-a/260412-lto-SUMMARY.md`
</output>
