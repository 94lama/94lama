import type { SkillGroup } from "@/src/content/portfolio/types";

const CATEGORY_COLORS = [
  [0.29, 0.63, 0.98],
  [0.53, 0.47, 0.98],
  [0.1, 0.73, 0.61],
  [0.98, 0.62, 0.24],
  [0.94, 0.39, 0.55],
  [0.54, 0.72, 0.23],
] as const;

const CROSS_DOMAIN_MEMBERSHIPS: Record<string, string[]> = {
  Javascript: ["Backend"],
  TypeScript: ["Backend"],
  Python: ["DevOps"],
  "Serverless (OpenWhisk)": ["DevOps"],
  Docker: ["DevOps"],
  Kubernetes: ["DevOps"],
  Bash: ["DevOps"],
  Linux: ["DevOps"],
  MySQL: ["Backend"],
  PostgreSQL: ["Backend"],
};

const RELATED_SKILL_LINKS: Record<string, string[]> = {
  HTML: ["CSS", "Javascript", "React", "Next.js", "Svelte", "Tailwind"],
  CSS: ["HTML", "Javascript", "React", "Next.js", "Svelte", "Tailwind"],
  React: ["HTML", "CSS", "Javascript", "Next.js", "TypeScript", "Tailwind", "Svelte"],
  "Next.js": ["HTML", "CSS", "React", "Javascript", "TypeScript", "Tailwind", "Serverless (OpenWhisk)"],
  Svelte: ["HTML", "CSS", "Javascript", "React", "TypeScript"],
  Javascript: ["HTML", "CSS", "React", "Next.js", "Svelte", "TypeScript", "Laravel", "Serverless (OpenWhisk)"],
  TypeScript: ["HTML", "CSS", "Javascript", "React", "Next.js", "Svelte", "Tailwind", "Serverless (OpenWhisk)"],
  Tailwind: ["HTML", "CSS", "React", "Next.js", "TypeScript", "Javascript"],
  Python: ["Django", "Serverless (OpenWhisk)", "Docker", "Linux", "Bash", "PostgreSQL"],
  PHP: ["Laravel", "MySQL", "Javascript"],
  Laravel: ["PHP", "MySQL", "Javascript"],
  Django: ["Python", "PostgreSQL"],
  "Serverless (OpenWhisk)": ["Python", "Docker", "Next.js", "TypeScript", "Javascript"],
  Docker: ["Python", "Linux", "Bash", "CI/CD", "Serverless (OpenWhisk)"],
  Kubernetes: ["Linux", "Bash", "CI/CD", "Serverless (OpenWhisk)"],
  "CI/CD": ["Docker", "Linux", "Bash"],
  Linux: ["Docker", "Bash", "CI/CD", "Python"],
  Bash: ["Linux", "Docker", "CI/CD", "Python"],
  MySQL: ["PHP", "Laravel", "Javascript"],
  PostgreSQL: ["Python", "Django", "MySQL"],
};

export type KnowledgeMapNodeKind = "core" | "category" | "skill";

export type GraphNode = {
  id: string;
  label: string;
  kind: KnowledgeMapNodeKind;
  groupIndices: number[];
  knowledge?: number;
  color: readonly [number, number, number];
  position: readonly [number, number, number];
  neighbors: string[];
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  kind: "hub" | "domain" | "technology";
};

export type KnowledgeMapGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeMap: Map<string, GraphNode>;
};

function getCategoryColor(index: number) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}

function normalizeHash(value: number) {
  return ((value % 1000) + 1000) % 1000 / 1000;
}

function getDepthSpread(hash: number, strength: number) {
  return (normalizeHash(hash) - 0.5) * strength;
}

function averageVector(values: readonly (readonly [number, number, number])[]) {
  if (values.length === 0) {
    return [0, 0, 0] as const;
  }

  const total = values.reduce<[number, number, number]>(
    (accumulator, value) => {
      accumulator[0] += value[0];
      accumulator[1] += value[1];
      accumulator[2] += value[2];
      return accumulator;
    },
    [0, 0, 0],
  );

  return [
    total[0] / values.length,
    total[1] / values.length,
    total[2] / values.length,
  ] as const;
}

function hashLabel(label: string) {
  let hash = 0;

  for (const character of label) {
    hash = (hash * 31 + character.charCodeAt(0)) % 2147483647;
  }

  return hash;
}

function connectNodes(
  nodeMap: Map<string, GraphNode>,
  edges: GraphEdge[],
  edgeIds: Set<string>,
  fromId: string,
  toId: string,
  kind: GraphEdge["kind"],
) {
  if (fromId === toId) {
    return;
  }

  const fromNode = nodeMap.get(fromId);
  const toNode = nodeMap.get(toId);

  if (!fromNode || !toNode) {
    return;
  }

  if (!fromNode.neighbors.includes(toId)) {
    fromNode.neighbors.push(toId);
  }

  if (!toNode.neighbors.includes(fromId)) {
    toNode.neighbors.push(fromId);
  }

  const edgeId = [fromId, toId].sort().join("::");

  if (edgeIds.has(edgeId)) {
    return;
  }

  edgeIds.add(edgeId);
  edges.push({ id: edgeId, from: fromId, to: toId, kind });
}

export function createKnowledgeMapGraph(skillGroups: SkillGroup[]): KnowledgeMapGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeMap = new Map<string, GraphNode>();
  const edgeIds = new Set<string>();
  const categoryIndexByLabel = new Map(
    skillGroups.map((group, index) => [group.category, index] as const),
  );

  const rootNode: GraphNode = {
    id: "core",
    label: "Knowledge Graph",
    kind: "core",
    groupIndices: [],
    color: [0.94, 0.97, 1],
    position: [0, 0, 0],
    neighbors: [],
  };

  nodes.push(rootNode);
  nodeMap.set(rootNode.id, rootNode);

  const categoryNodes = skillGroups.map((group, groupIndex) => {
    const angle = (groupIndex / Math.max(skillGroups.length, 1)) * Math.PI * 2;
    const layerOffset = groupIndex % 2 === 0 ? 1.15 : -1.05;
    const categoryNode: GraphNode = {
      id: `category-${groupIndex}`,
      label: group.category,
      kind: "category",
      groupIndices: [groupIndex],
      color: getCategoryColor(groupIndex),
      position: [
        Math.cos(angle) * 5.4,
        Math.sin(angle * 1.7) * 1.8 + layerOffset,
        Math.sin(angle) * 5.2 + Math.cos(angle * 2.3) * 1.35,
      ],
      neighbors: [],
    };

    nodes.push(categoryNode);
    nodeMap.set(categoryNode.id, categoryNode);
    connectNodes(nodeMap, edges, edgeIds, rootNode.id, categoryNode.id, "hub");

    return categoryNode;
  });

  const skillRecords = new Map<
    string,
    { label: string; groupIndices: Set<number>; knowledgeValues: number[] }
  >();

  skillGroups.forEach((group, groupIndex) => {
    group.entries.forEach((entry) => {
      const item = entry.label;
      const record = skillRecords.get(item) ?? {
        label: item,
        groupIndices: new Set<number>(),
        knowledgeValues: [],
      };

      record.groupIndices.add(groupIndex);
      if (typeof entry.knowledge === "number") {
        record.knowledgeValues.push(entry.knowledge);
      }

      for (const categoryLabel of CROSS_DOMAIN_MEMBERSHIPS[item] ?? []) {
        const extraGroupIndex = categoryIndexByLabel.get(categoryLabel);

        if (typeof extraGroupIndex === "number") {
          record.groupIndices.add(extraGroupIndex);
        }
      }

      skillRecords.set(item, record);
    });
  });

  const skillNodeIds = new Map<string, string>();

  Array.from(skillRecords.values()).forEach((record, skillIndex) => {
    const groupIndices = Array.from(record.groupIndices).sort((left, right) => left - right);
    const anchorPositions = groupIndices.map(
      (groupIndex) => categoryNodes[groupIndex]?.position ?? [0, 0, 0],
    );
    const centroid = averageVector(anchorPositions);
    const hash = hashLabel(record.label);
    const angle = (hash % 360) * (Math.PI / 180);
    const orbit = groupIndices.length > 1 ? 1.9 : 2.8;
    const knowledge =
      record.knowledgeValues.length > 0
        ? record.knowledgeValues.reduce((sum, value) => sum + value, 0) /
          record.knowledgeValues.length
        : undefined;
    const verticalOffset = getDepthSpread(hash >> 3, 2.8);
    const depthOffset = getDepthSpread(hash >> 6, 4.4);
    const lateralOffset = getDepthSpread(hash >> 9, 1.4);
    const skillNode: GraphNode = {
      id: `skill-${skillIndex}`,
      label: record.label,
      kind: "skill",
      groupIndices,
      knowledge,
      color: averageVector(groupIndices.map((groupIndex) => getCategoryColor(groupIndex))),
      position: [
        centroid[0] + Math.cos(angle) * orbit + lateralOffset,
        centroid[1] + Math.sin(angle * 1.8) * 0.9 + verticalOffset,
        centroid[2] + Math.sin(angle) * (groupIndices.length > 1 ? 2.4 : 3.1) + depthOffset,
      ],
      neighbors: [],
    };

    nodes.push(skillNode);
    nodeMap.set(skillNode.id, skillNode);
    skillNodeIds.set(skillNode.label, skillNode.id);

    groupIndices.forEach((groupIndex) => {
      connectNodes(nodeMap, edges, edgeIds, `category-${groupIndex}`, skillNode.id, "domain");
    });
  });

  Object.entries(RELATED_SKILL_LINKS).forEach(([fromLabel, toLabels]) => {
    const fromId = skillNodeIds.get(fromLabel);

    if (!fromId) {
      return;
    }

    toLabels.forEach((toLabel) => {
      const toId = skillNodeIds.get(toLabel);

      if (!toId) {
        return;
      }

      connectNodes(nodeMap, edges, edgeIds, fromId, toId, "technology");
    });
  });

  return { nodes, edges, nodeMap };
}
