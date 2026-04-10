Use the project skill named 'seo-optimization' if it is available in this repository.

Repository root: /home/riccardolm/github/94lama
Mode: audit

Task:
Perform a repo-wide SEO pass for this codebase, focused on organic Google Search.
Inspect the full repository, but prioritize files and templates that affect public,
indexable pages and search behavior.

Repo guidance:
- app/ exists; prioritize routed pages, layouts, metadata generation, and user-facing content there.
- public/ exists; inspect assets that matter for SEO such as robots.txt, sitemap files, and public metadata artifacts.
- This appears to be a Next.js repo; inspect Next metadata, route files, sitemap or robots handlers, canonicals, schema output, and internal links.
- Ignore generated or dependency directories unless they directly affect shipped SEO behavior, especially .git/, node_modules/, and .next/.
- Look for technical SEO, on-page SEO, internal linking, local SEO, migration risks, and template-level SEO issues.
- Keep the scope practical: focus on the highest-impact findings, not a giant checklist.

Output requirements:
- Name the lead SEO lane you chose.
- Explain the most important repo-wide SEO issues first.
- When useful, point to concrete files, routes, templates, or page types.
- End with a prioritized action plan and a short measurement plan.
- Do not commit or push changes.

Audit mode instructions:
- Do not modify files.
- Produce an implementation-ready audit for the whole repo.
- Call out the smallest high-impact fixes that should be made next.

Additional focus area:
- technical SEO and internal linking
