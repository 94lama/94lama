import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { parseCvMarkdown } from "../src/content/portfolio/parse-cv.ts";

const rootDir = process.cwd();
const cvPath = path.join(rootDir, "public/assets/cv.md");
const pagePath = path.join(rootDir, "app/page.tsx");

test("Phase 3 authored CV contact data includes GitHub and LinkedIn", async () => {
  const markdown = await readFile(cvPath, "utf8");
  const content = parseCvMarkdown(markdown);

  assert.equal(content.contact.email, "riccardo.lamalfa94@gmail.com");
  assert.equal(content.contact.github, "https://github.com/94lama");
  assert.equal(content.contact.linkedin, "https://www.linkedin.com/in/riccardo-la-malfa");
});

test("Phase 3 page wiring uses shared contact content without hardcoded profile URLs", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(source, /href=\{`mailto:\$\{content\.contact\.email\}`\}/);
  assert.match(source, /content\.contact\.github/);
  assert.match(source, /content\.contact\.linkedin/);
  assert.doesNotMatch(source, /https:\/\/github\.com\/94lama/);
  assert.doesNotMatch(source, /https:\/\/www\.linkedin\.com\/in\/riccardo-la-malfa/);
});
