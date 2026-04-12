import assert from "node:assert/strict";
import test from "node:test";

import { rankExperienceBySelection } from "../src/content/portfolio/rank-experience-by-selection.ts";
import type { ExperienceEntry, SkillGroup } from "../src/content/portfolio/types.ts";

const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript"],
    entries: [
      { label: "React", knowledge: 1 },
      { label: "Next.js", knowledge: 0.8 },
      { label: "TypeScript", knowledge: 0.7 },
    ],
  },
  {
    category: "DevOps",
    items: ["Docker", "Linux", "CI/CD"],
    entries: [
      { label: "Docker", knowledge: 0.5 },
      { label: "Linux", knowledge: 0.5 },
      { label: "CI/CD", knowledge: 0.4 },
    ],
  },
];

const experience: ExperienceEntry[] = [
  {
    role: "Frontend Engineer",
    company: "Alpha Studio",
    dateRange: "2024",
    highlights: [
      "Built React and Next.js interfaces for marketing pages.",
      "Shipped TypeScript components for the design system.",
    ],
  },
  {
    role: "Product Engineer",
    company: "Beta Labs",
    dateRange: "2023",
    highlights: [
      "Developed React tooling for admin workflows.",
      "Maintained Docker images and Linux deployment scripts.",
    ],
  },
  {
    role: "Platform Engineer",
    company: "Gamma Ops",
    dateRange: "2022",
    highlights: [
      "Managed CI/CD pipelines and container releases.",
      "Improved Linux observability for production systems.",
    ],
  },
];

test("core selection keeps the full timeline in original order", () => {
  const result = rankExperienceBySelection({
    experience,
    selection: {
      id: "core",
      label: "Knowledge Graph",
      kind: "core",
      activeIndex: 0,
    },
    skillGroups,
  });

  assert.equal(result.isFallback, true);
  assert.equal(result.entries.length, experience.length);
  assert.deepEqual(
    result.entries.map((item) => item.entry.company),
    ["Alpha Studio", "Beta Labs", "Gamma Ops"],
  );
  assert.match(result.helperCopy, /full timeline|full experience timeline/i);
});

test("skill selection promotes matching entries and keeps nonmatches visible", () => {
  const result = rankExperienceBySelection({
    experience,
    selection: {
      id: "skill-react",
      label: "React",
      kind: "skill",
      activeIndex: 0,
    },
    skillGroups,
  });

  assert.equal(result.entries.length, experience.length);
  assert.deepEqual(
    result.entries.map((item) => item.entry.company),
    ["Alpha Studio", "Beta Labs", "Gamma Ops"],
  );
  assert.equal(result.entries[0]?.isHighlighted, true);
  assert.equal(result.entries[1]?.isHighlighted, true);
  assert.equal(result.entries[2]?.isHighlighted, false);
});

test("category selection uses the active group's items as match terms", () => {
  const result = rankExperienceBySelection({
    experience,
    selection: {
      id: "category-1",
      label: "DevOps",
      kind: "category",
      activeIndex: 1,
    },
    skillGroups,
  });

  assert.equal(result.entries.length, experience.length);
  assert.equal(result.entries[0]?.entry.company, "Beta Labs");
  assert.equal(result.entries[1]?.entry.company, "Gamma Ops");
  assert.equal(result.entries[2]?.entry.company, "Alpha Studio");
  assert.deepEqual(result.entries[0]?.matchedTerms, ["Docker", "Linux"]);
});

test("unmatched selections fall back to the full timeline with helper copy", () => {
  const result = rankExperienceBySelection({
    experience,
    selection: {
      id: "skill-rust",
      label: "Rust",
      kind: "skill",
      activeIndex: 0,
    },
    skillGroups,
  });

  assert.equal(result.isFallback, true);
  assert.equal(result.entries.length, experience.length);
  assert.equal(result.entries.every((item) => item.isHighlighted === false), true);
  assert.match(result.helperCopy, /full timeline remains visible|full timeline is shown/i);
});
