---
quick_task: 260412-grk
type: quick
autonomous: true
files_modified:
  - public/assets/cv.json
  - src/content/portfolio/get-portfolio-content.ts
  - tests/phase-03-contact-validation.test.ts
---

<objective>
Transform the current authored CV data into JSON and make the portfolio content loader read the JSON source instead of markdown.

Purpose: Replace the runtime markdown parsing step with a direct structured content file while preserving the existing typed portfolio contract.
Output: A JSON content source plus updated loader/test wiring.
</objective>

<context>
@.planning/STATE.md
@./AGENTS.md
@public/assets/cv.md
@src/content/portfolio/get-portfolio-content.ts
@src/content/portfolio/parse-cv.ts
@tests/phase-03-contact-validation.test.ts

<interfaces>
From `src/content/portfolio/get-portfolio-content.ts`:
```ts
export async function getPortfolioContent(): Promise<PortfolioContent>
```

From `src/content/portfolio/types.ts`:
```ts
export interface PortfolioContent { /* typed content contract used by the page */ }
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add a JSON portfolio content source matching the current CV structure</name>
  <files>public/assets/cv.json</files>
  <action>Create `public/assets/cv.json` containing the structured portfolio data currently authored in `public/assets/cv.md`. Preserve the existing `PortfolioContent` shape used by the app, including hero, summary, skills with both `items` and `entries`, experience, education, languages, relocation, contact, and projects. The JSON should reflect the current parsed meaning of the markdown, including the Nuvolaris backend highlight line being normalized into a single string and the current relocation preferences.</action>
  <verify>
    <automated>node --input-type=module -e "import { readFile } from 'node:fs/promises'; JSON.parse(await readFile('./public/assets/cv.json', 'utf8'));"</automated>
  </verify>
  <done>`public/assets/cv.json` exists, parses successfully, and contains the full portfolio content in the app's existing typed shape.</done>
</task>

<task type="auto">
  <name>Task 2: Switch the portfolio loader and regression test to the JSON source</name>
  <files>src/content/portfolio/get-portfolio-content.ts, tests/phase-03-contact-validation.test.ts</files>
  <action>Update `getPortfolioContent()` to read `public/assets/cv.json` and return the parsed JSON as `PortfolioContent`, removing the runtime dependency on `parseCvMarkdown` in the loader path. Update the Phase 3 regression test so it reads `public/assets/cv.json` directly and asserts the same contact/source-of-truth behavior against the JSON file while keeping the page wiring assertions intact. Keep the rest of the app API unchanged so callers still use `getPortfolioContent()` the same way.</action>
  <verify>
    <automated>node --test --experimental-strip-types tests/phase-03-contact-validation.test.ts && npm run build</automated>
  </verify>
  <done>The app content loader now uses `cv.json`, the regression test validates the JSON source, and the app still builds successfully.</done>
</task>

</tasks>

<success_criteria>
- `public/assets/cv.json` exists and matches the current portfolio content contract.
- `getPortfolioContent()` loads JSON instead of markdown parsing.
- The Phase 3 regression test validates the JSON content source.
- `node --test --experimental-strip-types tests/phase-03-contact-validation.test.ts` passes.
- `npm run build` passes after the source switch.
</success_criteria>

<output>
After completion, create `.planning/quick/260412-grk-transform-public-assets-cv-md-into-json/260412-grk-SUMMARY.md`
</output>
