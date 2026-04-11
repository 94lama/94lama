@AGENTS.md

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Riccardo La Malfa Portfolio**

A recruiter-focused portfolio webapp for Riccardo La Malfa. It presents his frontend-focused full-stack profile, experience, and core skills in a bold one-page format designed to make a strong first impression quickly. The content should stay reusable so future milestones can add alternative portfolio UIs without rewriting the underlying information.

**Core Value:** A recruiter can understand Riccardo's positioning and know how to contact him within one minute.

### Constraints

- **Tech stack**: Stay within the existing Next.js 16, React 19, and Tailwind 4 app - use the current codebase rather than replatforming.
- **Scope**: One page only - keep the first milestone tight and shippable.
- **Brand**: Bold/creative presentation - the final design should feel intentional, not like the starter template.
- **Content source**: Use `public/assets/cv.md` as the planning source of truth - avoid depending on the outdated profile README.
- **Contact dependency**: LinkedIn is approved for the contact section, but the actual profile URL still needs to be supplied before implementation is complete.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

| Skill | Description | Path |
|-------|-------------|------|
| caveman | > Ultra-compressed communication mode. Cuts token usage ~75% by speaking like caveman while keeping full technical accuracy. Supports intensity levels: lite, full (default), ultra, wenyan-lite, wenyan-full, wenyan-ultra. Use when user says "caveman mode", "talk like caveman", "use caveman", "less tokens", "be brief", or invokes /caveman. Also auto-triggers when token efficiency is requested. | `.agents/skills/caveman/SKILL.md` |
| compress | > Compress natural language memory files (CLAUDE.md, todos, preferences) into caveman format to save input tokens. Preserves all technical substance, code, URLs, and structure. Compressed version overwrites the original file. Human-readable backup saved as FILE.original.md. Trigger: /caveman:compress <filepath> or "compress memory file" | `.agents/skills/compress/SKILL.md` |
| frontend-design | Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics. | `.agents/skills/frontend-design/SKILL.md` |
| seo-optimization | Manage organic Google Search performance for websites in codebases. Use this skill whenever the user asks to audit, fix, or improve SEO in a repo or site: organic traffic drops, ranking or indexing problems, Search Console issues, title tags, meta descriptions, schema, canonicals, sitemap.xml, robots.txt, redirects, internal linking, page overlap or cannibalization, local SEO pages, docs or ecommerce templates, or URL migrations. Also use it when the user wants a page rewritten to rank better in Google or wants SEO changes implemented in code. Route the request to the right SEO lane automatically. Do not use it for paid search, Google Ads, social media, or generic marketing strategy unless organic search is the core need. | `.agents/skills/seo-optimization/SKILL.md` |
| skill-creator | Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy. | `.agents/skills/skill-creator/SKILL.md` |
| ui-ux-pro-max | "UI/UX design intelligence. 50 styles, 21 palettes, 50 font pairings, 20 charts, 9 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, check UI/UX code. Projects: website, landing page, dashboard, admin panel, e-commerce, SaaS, portfolio, blog, mobile app, .html, .tsx, .vue, .svelte. Elements: button, modal, navbar, sidebar, card, table, form, chart. Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, dark mode, responsive, skeuomorphism, flat design. Topics: color palette, accessibility, animation, layout, typography, font pairing, spacing, hover, shadow, gradient. Integrations: shadcn/ui MCP for component search and examples." | `.agents/skills/ui-ux-pro-max/SKILL.md` |
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
