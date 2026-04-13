import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { rankExperienceBySelection } from "../src/content/portfolio/rank-experience-by-selection.ts";
import { createKnowledgeMapGraph } from "../app/components/knowledge-map/model.ts";
import {
  createRootSelection,
  getSelectedKindLabel,
  normalizeSelection,
  selectionFromNode,
} from "../app/components/knowledge-map/selection.ts";
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

const rootDir = process.cwd();
const pagePath = path.join(rootDir, "app/page.tsx");
const mapPath = path.join(rootDir, "app/components/skills-knowledge-map.tsx");
const mapModelPath = path.join(rootDir, "app/components/knowledge-map/model.ts");
const mapRuntimePath = path.join(rootDir, "app/components/knowledge-map/runtime.ts");
const mapPanelsPath = path.join(rootDir, "app/components/knowledge-map/knowledge-map-panels.tsx");

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

test("page wiring replaces duplicate sections with the shared coordinator", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(source, /KnowledgeExperienceCoordinator/);
  assert.match(source, /HeroSection/);
  assert.match(source, /EducationSection/);
  assert.match(source, /LanguagesSection/);
  assert.match(source, /RelocationSection/);
  assert.match(source, /ContactSection/);
  assert.doesNotMatch(source, /ExperienceMapController/);
  assert.doesNotMatch(source, /Interactive Skills And Experience/);
  assert.doesNotMatch(source, /content\.skills\.map\(/);
});

test("map component keeps a semantic core selection without a rendered core mesh", async () => {
  const [source, modelSource, runtimeSource, panelSource] = await Promise.all([
    readFile(mapPath, "utf8"),
    readFile(mapModelPath, "utf8"),
    readFile(mapRuntimePath, "utf8"),
    readFile(mapPanelsPath, "utf8"),
  ]);

  assert.match(source, /createKnowledgeMapGraph/);
  assert.match(modelSource, /id: "core"/);
  assert.match(runtimeSource, /node\.kind === "core" \? undefined : new Mesh/);
  assert.match(runtimeSource, /visual\.data\.kind === "core" \? false/);
  assert.match(panelSource, /Reset to overview/);
});

test("knowledge map graph keeps cross-domain and related-technology links in the model layer", () => {
  const graph = createKnowledgeMapGraph(skillGroups);
  const reactNode = graph.nodes.find((node) => node.label === "React");
  const nextNode = graph.nodes.find((node) => node.label === "Next.js");
  const frontendNode = graph.nodes.find((node) => node.label === "Frontend");

  assert.ok(reactNode);
  assert.ok(nextNode);
  assert.ok(frontendNode);
  assert.equal(reactNode?.neighbors.includes(nextNode?.id ?? ""), true);
  assert.equal(reactNode?.neighbors.includes(frontendNode?.id ?? ""), true);
});

test("selection helpers normalize invalid ids and derive node metadata", () => {
  const graph = createKnowledgeMapGraph(skillGroups);
  const rootSelection = createRootSelection(skillGroups);
  const normalized = normalizeSelection(
    graph,
    {
      id: "missing-node",
      label: "Missing",
      kind: "skill",
      activeIndex: 99,
    },
    skillGroups,
  );
  const reactNode = graph.nodes.find((node) => node.label === "React");
  const reactSelection = selectionFromNode(reactNode, 0);

  assert.equal(rootSelection.id, "core");
  assert.equal(normalized.id, "core");
  assert.equal(normalized.activeIndex, 0);
  assert.equal(reactSelection.kind, "skill");
  assert.equal(getSelectedKindLabel(reactNode), "technology");
});
