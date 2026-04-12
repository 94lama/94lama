---
quick_task: 260412-koo
type: quick
autonomous: true
files_modified:
  - app/components/skills-knowledge-map.tsx
  - app/page.tsx
  - app/layout.tsx
  - app/components/legal-footer.tsx
  - src/content/portfolio/types.ts
  - public/assets/cv.json
  - TODO.md
---

<objective>
Finish the remaining unchecked UI-facing TODO items without touching the two unchecked Architecture items.

Purpose: Close the current visual/UI backlog in one atomic pass so the portfolio ships with the requested motion, stronger 3D map depth, richer relocation content, icon-supported email CTA, and a single-path iubenda consent bootstrap.
Output: Updated knowledge-map/UI/legal wiring plus a TODO refresh that checks off only the completed in-scope UI items.
</objective>

<context>
@.planning/STATE.md
@./AGENTS.md
@TODO.md
@app/page.tsx
@app/components/skills-knowledge-map.tsx
@app/layout.tsx
@app/components/legal-footer.tsx
@src/content/portfolio/types.ts
@public/assets/cv.json
@node_modules/next/dist/docs/01-app/02-guides/scripts.md

<interfaces>
From `src/content/portfolio/types.ts`:
```ts
export interface RelocationInfo {
  summary: string;
  preferredRegions?: string[];
}

export interface ContactInfo {
  location: string;
  email: string;
  phone?: string;
  github?: string;
  linkedin?: string;
}
```

From `app/page.tsx`:
```tsx
function ContactLink({ href, label }: { href: string; label: string })
function ContactIconLink({ href, label, icon }: { href: string; label: string; icon: "github" | "linkedin" })
```

From `app/layout.tsx`:
```tsx
<Script
  src="https://embeds.iubenda.com/widgets/283fdcdd-8702-47d7-84ee-59bc1203b52c.js"
  type="text/javascript"
  strategy="beforeInteractive"
/>
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add restrained motion and stronger depth to the knowledge map</name>
  <files>app/components/skills-knowledge-map.tsx</files>
  <action>Implement the TODO items `add animations` and `Spread the items more three-dimensionally` inside the existing knowledge-map component only. Keep the current OGL scene, selection model, pointer picking, and map-to-experience coordination intact, but change node placement so the graph reads less like a flat ring and uses more convincing depth variation on the z/y axes. Add subtle UI motion around the map experience (for example staged surface fades, gentle node emphasis, and smooth transform/opacity transitions), but keep it recruiter-friendly rather than flashy. Respect `prefers-reduced-motion`, and use transform/opacity-based motion only; do not introduce a new animation library or rewrite the map architecture.</action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>The map feels visibly more three-dimensional, includes tasteful motion without harming usability, preserves current interactions, and still builds successfully.</done>
</task>

<task type="auto">
  <name>Task 2: Enrich relocation/contact UI and consolidate the iubenda bootstrap path</name>
  <files>app/page.tsx, app/layout.tsx, app/components/legal-footer.tsx, src/content/portfolio/types.ts, public/assets/cv.json</files>
  <action>Complete the TODO items `add more content`, `Use an icon also for the email button`, and `prompt the cookie policy to the user at app bootstrap` in one coherent pass. First, extend the relocation data shape in `src/content/portfolio/types.ts` and `public/assets/cv.json` with authored relocation-specific supporting content (not placeholder text), then render that extra content in section `05` so the relocation area says materially more than the current summary + chips. Second, upgrade the email CTA(s) in `app/page.tsx` to include an email icon while preserving accessible labeling, touch-target size, and the current destinations. Third, make iubenda consent prompting a single bootstrap concern owned by `app/layout.tsx`: reuse iubenda, follow the Next root-layout script pattern, and avoid duplicate bootstraps. `app/components/legal-footer.tsx` should remain the legal-links surface only, unless a minimal hookup is strictly required after consolidation. Do not add a second CMP, do not invent unrelated provider configuration, and do not leave both layout and footer loading competing iubenda scripts.</action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>The relocation section contains newly authored supporting content from the data source, the email CTA is icon-supported and accessible, the app prompts cookie consent from a single iubenda bootstrap path at startup, and the app still builds cleanly.</done>
</task>

<task type="auto">
  <name>Task 3: Mark only the completed in-scope UI TODO items as done</name>
  <files>TODO.md</files>
  <action>After the implementation and build verification succeed, update `TODO.md` to check off only these completed in-scope UI items: `add animations`, `Spread the items more three-dimensionally`, `add more content`, `Use an icon also for the email button`, and `prompt the cookie policy to the user at app bootstrap`. Leave the two unchecked `Architecture` items untouched and keep any already completed TODO lines exactly as they are.</action>
  <verify>
    <automated>node -e "const fs=require('fs'); const todo=fs.readFileSync('TODO.md','utf8'); ['add animations','Spread the items more three-dimensionally','add more content','Use an icon also for the email button','prompt the cookie policy to the user at app bootstrap'].forEach((item)=>{ if(!todo.includes(`- [x] ${item}`)) throw new Error(`Missing checked item: ${item}`); }); ['Use OOP to manage components','Use atomization to manage components'].forEach((item)=>{ if(!todo.includes(`- [ ] ${item}`)) throw new Error(`Architecture item changed unexpectedly: ${item}`); });"</automated>
  </verify>
  <done>`TODO.md` reflects completion of the five in-scope UI items only, with the Architecture items still unchecked.</done>
</task>

</tasks>

<success_criteria>
- The remaining unchecked UI-facing TODO items are implemented without expanding into the two Architecture TODO items.
- The knowledge map gains restrained motion and a more spatial 3D layout while preserving current interaction behavior.
- The relocation section contains more real content, the email CTA uses an icon accessibly, and cookie consent is prompted through one consolidated iubenda bootstrap path.
- `TODO.md` is updated only for the five completed in-scope UI items.
- `npm run build` passes.
</success_criteria>

<output>
After completion, create `.planning/quick/260412-koo-fix-all-ui-issues-marked-in-todo-md-upda/260412-koo-SUMMARY.md`
</output>
