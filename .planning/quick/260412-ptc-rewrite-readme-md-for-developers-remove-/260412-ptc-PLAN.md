---
id: 260412-ptc
type: quick-plan
mode: quick
autonomous: true
files_modified:
  - README.md
---

# Quick Plan — Rewrite README.md for developers and remove HR-style copy

## Objective

Refocus `README.md` on fellow developers: keep the existing graphic-heavy presentation and skill graph visuals, but strip out recruiter / HR-style phrasing so the profile reads like builder-to-builder positioning instead of a job-market pitch.

## Context

- `README.md` was already redesigned in quick tasks `260412-nbj` and `260412-p2l`.
- The current README still contains copy that leans recruiter-facing, especially relocation / pitch-style language.
- The user wants a **developer-facing rewrite**, not a new visual system.
- Keep the existing local README graphics in place, especially the skill visuals (`skill-bars.svg` and `skill-graph.svg` / hexagon graph section).
- Stay GitHub-safe: markdown + simple HTML only, no scripts, no remote assets.

## Task 1 — Rewrite the README copy in a peer-to-peer developer voice

**Files**
- `README.md`

**Action**
- Rewrite the README text so it speaks to developers, not recruiters: focus on stack, product-building style, shipped domains, and technical range.
- Remove HR-style or job-market language such as relocation pitch, soft-sell phrasing, or generic employability copy.
- Keep the structure compact and scan-friendly; prefer short sections and factual bullets over narrative sales copy.
- Preserve the existing local visual embeds already used by the README instead of redesigning or regenerating assets.
- Keep experience factual, but compress it into technical signals rather than CV-style promotion.

**Verify**
- `node -e "const fs=require('fs'); const md=fs.readFileSync('README.md','utf8'); ['profile-banner.svg','skill-bars.svg','skill-graph.svg'].forEach(x=>{if(!md.includes(x)) throw new Error('Missing asset: '+x)}); ['open to the right EU relocation move','recruiter','collaboration fluff'].forEach(x=>{if(md.toLowerCase().includes(x.toLowerCase())) throw new Error('HR-style copy still present: '+x)}); if(md.length > 2600) throw new Error('README still too long');"`

**Done**
- README reads like a concise developer profile, not a recruiter-targeted summary, while keeping the existing visual assets.

## Task 2 — Do a final GitHub-safety and factual-integrity pass

**Files**
- `README.md`

**Action**
- Check that the rewritten README remains grounded in `public/assets/cv.json` and does not introduce exaggerated or unsupported claims.
- Keep the final wording tight, technical, and credible.
- Ensure the existing skill graph section remains visible and the README still renders safely on GitHub without fragile markup.

**Verify**
- `node -e "const fs=require('fs'); const md=fs.readFileSync('README.md','utf8'); const cv=JSON.parse(fs.readFileSync('public/assets/cv.json','utf8')); if(/<script|style=|badge\.shields\.io|img\.shields\.io/i.test(md)) throw new Error('Non-GitHub-safe markup found'); ['React','TypeScript','Python'].forEach(x=>{if(!md.includes(x)) throw new Error('Missing core stack mention: '+x); if(!JSON.stringify(cv).includes(x)) throw new Error('Stack not backed by cv.json: '+x);});"`

**Done**
- README is concise, developer-facing, asset-preserving, factually grounded, and GitHub-safe.

## Success Criteria

- `README.md` is rewritten for developers rather than recruiters.
- HR-style / relocation-pitch copy is removed.
- Existing local README visuals, including the skill graph section, are preserved.
- The result is shorter, sharper, and still grounded in `public/assets/cv.json`.

## Output

After completion, create `.planning/quick/260412-ptc-rewrite-readme-md-for-developers-remove-/260412-ptc-SUMMARY.md`
