"use client";

import { useEffect, useMemo, useState } from "react";

import { KnowledgeMapCanvasShell, KnowledgeMapDetailsPanel } from "@/app/components/knowledge-map/knowledge-map-panels";
import { createKnowledgeMapGraph } from "@/app/components/knowledge-map/model";
import {
  getSelectedGroupNames,
  getSelectedKnowledgeLabel,
  getSelectedKindLabel,
  getSelectedNeighborNodes,
  getSelectedNode,
  normalizeSelection,
  selectionFromNode,
} from "@/app/components/knowledge-map/selection";
import { KnowledgeMapViewport } from "@/app/components/knowledge-map/viewport";
import type { KnowledgeMapSelection } from "@/src/content/portfolio/knowledge-map-selection";
import type { SkillGroup } from "@/src/content/portfolio/types";

export type { KnowledgeMapSelection } from "@/src/content/portfolio/knowledge-map-selection";

type SkillsKnowledgeMapProps = {
  skillGroups: SkillGroup[];
  activeIndex?: number;
  selectedNodeId?: string;
  onSelectionChange?: (selection: KnowledgeMapSelection) => void;
};

export function SkillsKnowledgeMap({
  activeIndex: controlledActiveIndex,
  onSelectionChange,
  selectedNodeId: controlledSelectedNodeId,
  skillGroups,
}: Readonly<SkillsKnowledgeMapProps>) {
  const graphData = useMemo(() => createKnowledgeMapGraph(skillGroups), [skillGroups]);
  const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = useState(0);
  const [uncontrolledSelectedNodeId, setUncontrolledSelectedNodeId] = useState("core");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const activeIndex = controlledActiveIndex ?? uncontrolledActiveIndex;
  const selectedNodeId = controlledSelectedNodeId ?? uncontrolledSelectedNodeId;
  const safeSelection = normalizeSelection(
    graphData,
    {
      id: selectedNodeId,
      label: "Knowledge Graph",
      kind: "core",
      activeIndex,
    },
    skillGroups,
  );
  const resolvedSelectedNodeId = safeSelection.id;
  const selectedNode = getSelectedNode(graphData, resolvedSelectedNodeId);
  const activeGroupIndex = selectedNode?.groupIndices[0] ?? safeSelection.activeIndex;
  const selectedNeighborNodes = getSelectedNeighborNodes(graphData, resolvedSelectedNodeId);
  const selectedGroupNames = getSelectedGroupNames(selectedNode, skillGroups);
  const selectedKnowledgeLabel = getSelectedKnowledgeLabel(selectedNode);
  const selectedKindLabel = getSelectedKindLabel(selectedNode);

  const applySelection = (nodeId: string) => {
    const normalizedSelection = selectionFromNode(graphData.nodeMap.get(nodeId), activeIndex);

    if (controlledSelectedNodeId === undefined) {
      setUncontrolledSelectedNodeId(normalizedSelection.id);
    }

    if (controlledActiveIndex === undefined && normalizedSelection.activeIndex >= 0) {
      setUncontrolledActiveIndex(normalizedSelection.activeIndex);
    }

    onSelectionChange?.(normalizedSelection);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <KnowledgeMapDetailsPanel
        activeGroupIndex={activeGroupIndex}
        onFocusNode={applySelection}
        prefersReducedMotion={prefersReducedMotion}
        resolvedSelectedNodeId={resolvedSelectedNodeId}
        selectedGroupNames={selectedGroupNames}
        selectedKindLabel={selectedKindLabel}
        selectedKnowledgeLabel={selectedKnowledgeLabel}
        selectedLabel={selectedNode?.label ?? "Knowledge Graph"}
        selectedNeighborNodes={selectedNeighborNodes}
        skillGroups={skillGroups}
      />

      <KnowledgeMapCanvasShell
        prefersReducedMotion={prefersReducedMotion}
        resolvedSelectedNodeId={resolvedSelectedNodeId}
      >
        <KnowledgeMapViewport
          graphData={graphData}
          onPickNode={applySelection}
          prefersReducedMotion={prefersReducedMotion}
          selectedNodeId={resolvedSelectedNodeId}
        />
      </KnowledgeMapCanvasShell>
    </div>
  );
}
