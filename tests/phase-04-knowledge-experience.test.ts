import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { rankExperienceBySelection } from "../src/content/portfolio/rank-experience-by-selection.ts";
import { createKnowledgeMapGraph } from "../src/app/components/knowledge-map/model.ts";
import {
  createRootSelection,
  getSelectionTriggerSkillLabels,
  getSelectedKindLabel,
  normalizeSelection,
  selectionFromNode,
} from "../src/app/components/knowledge-map/selection.ts";
import type { ExperienceEntry, SkillGroup } from "../src/content/portfolio/types.ts";

const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "Javascript", "TypeScript"],
    entries: [
      { label: "React", knowledge: 1 },
      { label: "Next.js", knowledge: 0.8 },
      { label: "Javascript", knowledge: 0.8 },
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
  {
    category: "Backend",
    items: ["Laravel", "Serverless (OpenWhisk)"],
    entries: [
      { label: "Laravel", knowledge: 0.7 },
      { label: "Serverless (OpenWhisk)", knowledge: 0.5 },
    ],
  },
];

const rootDir = process.cwd();
const pagePath = path.join(rootDir, "src/app/[locale]/page.tsx");
const routeLoadingPath = path.join(rootDir, "src/app/[locale]/loading.tsx");
const contactSectionPath = path.join(rootDir, "src/app/components/hero-contact-line.tsx");
const mapPath = path.join(rootDir, "src/app/components/skills-knowledge-map.tsx");
const mapModelPath = path.join(rootDir, "src/app/components/knowledge-map/model.ts");
const mapRuntimePath = path.join(rootDir, "src/app/components/knowledge-map/runtime.ts");
const mapPanelsPath = path.join(rootDir, "src/app/components/knowledge-map/knowledge-map-panels.tsx");
const mapViewportPath = path.join(rootDir, "src/app/components/knowledge-map/viewport.tsx");
const routeShellPath = path.join(rootDir, "src/app/components/loading/route-shell-skeleton.tsx");
const certificatesSectionPath = path.join(rootDir, "src/app/components/certificates-section.tsx");

const experience: ExperienceEntry[] = [
  {
    role: "Frontend Engineer",
    company: "Alpha Studio",
    dateRange: "2024",
    highlights: [
      "Built React and Next.js interfaces for marketing pages.",
      "Shipped TypeScript components for the design system.",
    ],
    relatedDomains: ["Frontend"],
    relatedSkills: ["React", "Next.js", "TypeScript"],
  },
  {
    role: "Product Engineer",
    company: "Beta Labs",
    dateRange: "2023",
    highlights: [
      "Developed React tooling for admin workflows.",
      "Maintained Docker images and Linux deployment scripts.",
    ],
    relatedDomains: ["Frontend", "DevOps"],
    relatedSkills: ["React", "Docker", "Linux"],
  },
  {
    role: "Platform Engineer",
    company: "Gamma Ops",
    dateRange: "2022",
    highlights: [
      "Managed CI/CD pipelines and container releases.",
      "Improved Linux observability for production systems.",
    ],
    relatedDomains: ["DevOps"],
    relatedSkills: ["CI/CD", "Linux", "Serverless (OpenWhisk)"],
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
    selectionSkillLabels: [],
  });

  assert.equal(result.isFallback, true);
  assert.equal(result.entries.length, experience.length);
  assert.deepEqual(
    result.entries.map((item) => item.entry.company),
    ["Alpha Studio", "Beta Labs", "Gamma Ops"],
  );
  assert.match(result.helperCopy, /full timeline|full experience timeline/i);
});

test("skill selection promotes only entries mapped to the selected technology", () => {
  const graph = createKnowledgeMapGraph(skillGroups);
  const typeScriptNode = graph.nodes.find((node) => node.label === "TypeScript");

  assert.ok(typeScriptNode);

  const selectionSkillLabels = getSelectionTriggerSkillLabels(graph, typeScriptNode.id);
  const result = rankExperienceBySelection({
    experience,
    selection: selectionFromNode(typeScriptNode, 0),
    selectionSkillLabels,
  });

  assert.equal(selectionSkillLabels.includes("Frontend"), false);
  assert.deepEqual(selectionSkillLabels, ["TypeScript"]);
  assert.equal(result.entries.length, experience.length);
  assert.deepEqual(
    result.entries.map((item) => item.entry.company),
    ["Alpha Studio", "Beta Labs", "Gamma Ops"],
  );
  assert.equal(result.entries[0]?.isHighlighted, true);
  assert.equal(result.entries[1]?.isHighlighted, false);
  assert.equal(result.entries[2]?.isHighlighted, false);
  assert.deepEqual(result.entries[0]?.matchedTerms, ["TypeScript"]);
});

test("category selection uses explicit domain links plus connected skill points", () => {
  const graph = createKnowledgeMapGraph(skillGroups);
  const devopsNode = graph.nodes.find((node) => node.label === "DevOps");

  assert.ok(devopsNode);

  const selectionSkillLabels = getSelectionTriggerSkillLabels(graph, devopsNode.id);
  const result = rankExperienceBySelection({
    experience,
    selection: selectionFromNode(devopsNode, 1),
    selectionSkillLabels,
  });

  assert.equal(selectionSkillLabels.includes("DevOps"), false);
  assert.equal(result.entries.length, experience.length);
  assert.equal(result.entries[0]?.entry.company, "Gamma Ops");
  assert.equal(result.entries[1]?.entry.company, "Beta Labs");
  assert.equal(result.entries[2]?.entry.company, "Alpha Studio");
  assert.deepEqual(result.entries[0]?.matchedTerms, ["DevOps", "CI/CD", "Linux", "Serverless (OpenWhisk)"]);
  assert.deepEqual(result.entries[1]?.matchedTerms, ["DevOps", "Docker", "Linux"]);
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
    selectionSkillLabels: ["Rust"],
  });

  assert.equal(result.isFallback, true);
  assert.equal(result.entries.length, experience.length);
  assert.equal(result.entries.every((item) => item.isHighlighted === false), true);
  assert.match(result.helperCopy, /full timeline remains visible|full timeline is shown/i);
});

test("page wiring replaces duplicate sections with the shared coordinator", async () => {
  const source = await readFile(pagePath, "utf8");
  const heroIndex = source.indexOf("<HeroSection");
  const proofIndex = source.indexOf("<KnowledgeExperienceCoordinator");

  assert.match(source, /KnowledgeExperienceCoordinator/);
  assert.match(source, /HeroSection/);
  assert.match(source, /pageRhythm/);
  assert.match(source, /ResponsiveSectionGrid/);
  assert.match(source, /EducationSection/);
  assert.match(source, /CertificatesSection/);

  assert.match(source, /RelocationSection/);
  assert.notEqual(heroIndex, -1);
  assert.notEqual(proofIndex, -1);
  assert.equal(heroIndex < proofIndex, true);
  assert.doesNotMatch(source, /ExperienceMapController/);
  assert.doesNotMatch(source, /Interactive Skills And Experience/);
  assert.doesNotMatch(source, /content\.skills\.map\(/);
});

test("contact section keeps the primary mailto CTA explicit", async () => {
  const source = await readFile(contactSectionPath, "utf8");

  assert.match(source, /mailto:\$\{contact\.email\}/);
  assert.match(source, /"Email"/);
  assert.match(source, /HeroContactLine/);
});

test("certificates section uses a button-triggered modal with dialog semantics", async () => {
  const source = await readFile(certificatesSectionPath, "utf8");

  assert.match(source, /"use client"/);
  assert.match(source, /View all certificates/);
  assert.match(source, /aria-haspopup="dialog"/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /Close certificates modal/);
  assert.match(source, /rotateX/);
  assert.match(source, /rotateY/);
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
  assert.match(panelSource, /Current selection/);
});

test("viewport scene creation stays separate from selection highlight sync", async () => {
  const viewportSource = await readFile(mapViewportPath, "utf8");

  assert.match(viewportSource, /createKnowledgeMapScene\(/);
  assert.match(viewportSource, /syncHighlight\(state, graphData\.nodeMap, selectedNodeId\)/);
  assert.match(viewportSource, /syncHighlight\(sceneRef\.current, graphData\.nodeMap, selectedNodeId\)/);
  assert.match(
    viewportSource,
    /\}, \[graphData, handleHoverNode, onPickNode, onReadyChange, prefersReducedMotion\]\);/,
  );
  assert.doesNotMatch(
    viewportSource,
    /\}, \[[^\]]*graphData[^\]]*onPickNode[^\]]*prefersReducedMotion[^\]]*selectedNodeId[^\]]*\]\);/,
  );
});

test("route-level loading renders a structural route shell instead of a spinner fallback", async () => {
  const [loadingSource, routeShellSource] = await Promise.all([
    readFile(routeLoadingPath, "utf8"),
    readFile(routeShellPath, "utf8"),
  ]);

  assert.match(routeShellSource, /RouteShellSkeleton/);
  assert.match(routeShellSource, /data-route-shell="portfolio-loading"/);
  assert.match(routeShellSource, /EclipseLoader/);
  assert.doesNotMatch(routeShellSource, /spinner/i);
  assert.doesNotMatch(routeShellSource, /Loading\.\.\./);
});

test("knowledge map graph keeps cross-domain and related-technology links in the model layer", () => {
  const graph = createKnowledgeMapGraph(skillGroups);
  const reactNode = graph.nodes.find((node) => node.label === "React");
  const nextNode = graph.nodes.find((node) => node.label === "Next.js");
  const typeScriptNode = graph.nodes.find((node) => node.label === "TypeScript");
  const backendNode = graph.nodes.find((node) => node.label === "Backend");
  const serverlessNode = graph.nodes.find(
    (node) => node.label === "Serverless (OpenWhisk)",
  );

  assert.ok(reactNode);
  assert.ok(nextNode);
  assert.ok(typeScriptNode);
  assert.ok(backendNode);
  assert.ok(serverlessNode);
  assert.equal(reactNode?.neighbors.includes(nextNode?.id ?? ""), true);
  assert.equal(typeScriptNode?.neighbors.includes(backendNode?.id ?? ""), true);
  assert.equal(typeScriptNode?.neighbors.includes(serverlessNode?.id ?? ""), true);
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
