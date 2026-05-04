import type { KnowledgeMapSelection } from "@/src/content/portfolio/knowledge-map-selection";
import type { SkillGroup } from "@/src/content/portfolio/types";

import type { GraphNode, KnowledgeMapGraph } from "@/src/app/components/knowledge-map/model";

export function createRootSelection(skillGroups: SkillGroup[]): KnowledgeMapSelection {
  return {
    id: "core",
    label: "Knowledge Graph",
    kind: "core",
    activeIndex: skillGroups[0] ? 0 : -1,
  };
}

export function normalizeSelection(
  graph: KnowledgeMapGraph,
  selection: KnowledgeMapSelection,
  skillGroups: SkillGroup[],
): KnowledgeMapSelection {
  if (skillGroups.length === 0) {
    return createRootSelection(skillGroups);
  }

  const node = graph.nodeMap.get(selection.id) ?? graph.nodeMap.get("core");
  const activeIndex =
    typeof selection.activeIndex === "number" &&
    selection.activeIndex >= 0 &&
    selection.activeIndex < skillGroups.length
      ? selection.activeIndex
      : node?.groupIndices[0] ?? 0;

  return {
    id: node?.id ?? "core",
    label: node?.label ?? "Knowledge Graph",
    kind: node?.kind ?? "core",
    activeIndex,
  };
}

export function selectionFromNode(
  node: GraphNode | undefined,
  fallbackActiveIndex: number,
): KnowledgeMapSelection {
  const nextActiveIndex = node?.groupIndices[0] ?? fallbackActiveIndex;

  return {
    id: node?.id ?? "core",
    label: node?.label ?? "Knowledge Graph",
    kind: node?.kind ?? "core",
    activeIndex: typeof nextActiveIndex === "number" ? nextActiveIndex : -1,
  };
}

export function getSelectedNode(graph: KnowledgeMapGraph, selectedNodeId: string) {
  return graph.nodeMap.get(selectedNodeId) ?? graph.nodeMap.get("core");
}

export function getSelectedNeighborNodes(graph: KnowledgeMapGraph, selectedNodeId: string) {
  const selectedNode = getSelectedNode(graph, selectedNodeId);

  return (selectedNode?.neighbors ?? [])
    .map((nodeId) => graph.nodeMap.get(nodeId))
    .filter((node): node is GraphNode => node !== undefined && node.id !== "core")
    .sort((left, right) => {
      if (left.kind !== right.kind) {
        return left.kind === "category" ? -1 : 1;
      }

      return left.label.localeCompare(right.label);
    });
}

export function getSelectionTriggerSkillLabels(
  graph: KnowledgeMapGraph,
  selectedNodeId: string,
) {
  const selectedNode = getSelectedNode(graph, selectedNodeId);

  if (!selectedNode || selectedNode.kind === "core") {
    return [];
  }

  const skillLabels = new Set<string>();

  if (selectedNode.kind === "skill") {
    skillLabels.add(selectedNode.label);
    return Array.from(skillLabels);
  }

  for (const neighborId of selectedNode.neighbors) {
    const neighbor = graph.nodeMap.get(neighborId);

    if (neighbor?.kind === "skill") {
      skillLabels.add(neighbor.label);
    }
  }

  return Array.from(skillLabels).sort((left, right) => left.localeCompare(right));
}

export function getSelectedGroupNames(
  selectedNode: GraphNode | undefined,
  skillGroups: SkillGroup[],
) {
  return (selectedNode?.groupIndices ?? [])
    .map((groupIndex) => skillGroups[groupIndex]?.category)
    .filter(Boolean);
}

export function getSelectedKnowledgeValue(selectedNode: GraphNode | undefined) {
  return selectedNode?.kind === "skill" && typeof selectedNode.knowledge === "number"
    ? Math.max(1, Math.min(5, Math.round(selectedNode.knowledge * 5)))
    : null;
}

export function getSelectedKindLabel(selectedNode: GraphNode | undefined) {
  if (selectedNode?.kind === "category") {
    return "domain";
  }

  if (selectedNode?.kind === "skill") {
    return "technology";
  }

  return "overview";
}
