import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PortfolioBaseContent } from "../src/content/portfolio/types.ts";

const rootDir = process.cwd();
const cvPath = path.join(rootDir, "public/assets/cv.json");
const experiencePath = path.join(rootDir, "public/assets/experience.json");
const pagePath = path.join(rootDir, "app/page.tsx");
const heroSectionPath = path.join(rootDir, "app/components/hero-section.tsx");

test("Phase 3 authored portfolio JSON content includes GitHub, LinkedIn, and dedicated experience data", async () => {
  const [json, experienceJson] = await Promise.all([
    readFile(cvPath, "utf8"),
    readFile(experiencePath, "utf8"),
  ]);
  const content = JSON.parse(json) as PortfolioBaseContent;
  const experience = JSON.parse(experienceJson) as Array<{ relatedSkills: string[] }>;

  assert.equal(content.contact.email.length > 0, true);
  assert.equal(content.contact.github, "https://github.com/94lama");
  assert.equal(content.contact.linkedin, "https://www.linkedin.com/in/riccardo-la-malfa");
  assert.equal(Array.isArray(experience), true);
  assert.equal(experience.length > 0, true);
  assert.equal(Array.isArray(experience[0]?.relatedSkills), true);
});

test("Phase 3 page wiring uses shared contact content without hardcoded profile URLs", async () => {
  const [pageSource, heroSource] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(heroSectionPath, "utf8"),
  ]);

  assert.match(pageSource, /<HeroSection/);
  assert.match(heroSource, /contactEmail/);
  assert.match(heroSource, /href=\{`mailto:\$\{contactEmail\}`\}/);
  assert.match(heroSource, /contact\.github/);
  assert.match(heroSource, /contact\.linkedin/);
  assert.doesNotMatch(heroSource, /https:\/\/github\.com\/94lama/);
  assert.doesNotMatch(heroSource, /https:\/\/www\.linkedin\.com\/in\/riccardo-la-malfa/);
});
