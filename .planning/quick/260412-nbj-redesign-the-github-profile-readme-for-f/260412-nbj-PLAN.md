---
id: 260412-nbj
type: quick-plan
mode: quick
autonomous: true
files_modified:
  - README.md
  - public/assets/readme/profile-banner.svg
---

# Quick Plan — Redesign the GitHub profile README for fellow developers

## Objective

Turn the current profile README from a plain skills table into a GitHub-safe, developer-facing profile with a real visual refresh: a local custom banner, sharper section hierarchy, and tighter copy that reuses facts from `public/assets/cv.json` without sounding like the recruiter-facing site.

## Context

- `README.md` is currently outdated, visually flat, and mostly remote-logo tables.
- `public/assets/cv.json` is the canonical factual source for role, stack, experience, projects, and contact details.
- Audience for this task is **fellow developers**.
- Prefer **local assets** over third-party generated graphics.
- Keep the output GitHub-safe: markdown + simple HTML only, no scripts, no fragile styling assumptions.

## Task 1 — Create the visual system and local hero asset

**Files**
- `public/assets/readme/profile-banner.svg`

**Action**
- Create a custom SVG banner stored in-repo under `public/assets/readme/`.
- Make it feel code-native and developer-oriented, not recruiter-marketing: strong title, concise positioning, subtle visual motif, and readable contrast.
- Use a clean blue-led palette aligned with the current project direction instead of generic gradient-heavy “AI” styling.
- Keep the SVG GitHub-safe: no external fonts, no scripts, no embedded raster dependencies.
- Treat this asset as the README’s main visual anchor so the later markdown structure can stay simple and clean.

**Verify**
- `test -f public/assets/readme/profile-banner.svg`
- `node -e "const fs=require('fs'); const s=fs.readFileSync('public/assets/readme/profile-banner.svg','utf8'); ['<svg','Riccardo','Frontend-focused Full-Stack Developer'].forEach(x=>{if(!s.includes(x)) throw new Error('Missing '+x)});"`

**Done**
- A local banner exists, renders as SVG, and establishes the README’s new visual identity without relying on third-party generators.

## Task 2 — Rewrite README structure and copy for developers

**Files**
- `README.md`

**Action**
- Replace the current table-heavy README with a developer-facing structure built around the new banner.
- Use factual content from `public/assets/cv.json` for role, summary, stack, selected work, contact links, and current interests, but rewrite the voice so it feels peer-to-peer: what Riccardo builds, what he enjoys working on, and how he likes to collaborate.
- Introduce a clearer hierarchy such as: hero/introduction, current focus, toolbox, selected experience or projects, working style/interests, and contact.
- Prefer concise scannable blocks over long prose; remove outdated “junior / learning ...” copy unless directly supported by the newer source content.
- Keep images local (`./public/assets/readme/profile-banner.svg`) and avoid remote logo tables as the main presentation device.
- Ensure the README remains distinct from the recruiter site by emphasizing craft, stack, shipping style, open-source/dev interests, and technical breadth rather than CV-style selling.

**Verify**
- `node -e "const fs=require('fs'); const md=fs.readFileSync('README.md','utf8'); ['profile-banner.svg','## Current focus','## Toolbox','## Selected work','## Find me'].forEach(x=>{if(!md.includes(x)) throw new Error('Missing '+x)});"`

**Done**
- README has a new developer-facing information architecture, references the local banner, and no longer reads like the old generic profile stub.

## Task 3 — GitHub-safety and polish pass

**Files**
- `README.md`
- `public/assets/readme/profile-banner.svg`

**Action**
- Do a final polish pass to tighten spacing, ordering, and visual hierarchy for GitHub rendering.
- Check that headings, lists, links, and any simple HTML used in the README degrade well on GitHub desktop and mobile.
- Remove anything that feels recruiter-first, duplicated from the portfolio site, or visually noisy.
- Confirm the README presents a coherent narrative for fellow developers: what Riccardo works with, what kinds of systems he has shipped, and where to connect.

**Verify**
- `node -e "const fs=require('fs'); const md=fs.readFileSync('README.md','utf8'); if(/style=|<script|badge\.shields\.io/i.test(md)) throw new Error('Non-GitHub-safe or third-party-heavy markup found'); if(md.length < 1200) throw new Error('README likely too thin for a full refresh');"`

**Done**
- README is GitHub-safe, visually cleaner, locally branded, and clearly aimed at fellow developers rather than recruiters.

## Success Criteria

- README has a **real visual refresh**, not just rewritten text.
- The redesign uses at least one **local custom asset**.
- Content is grounded in `public/assets/cv.json` but written in a distinct developer-facing voice.
- The final README is cleaner, easier to scan, and more visually intentional than the current version.
