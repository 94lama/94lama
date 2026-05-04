"use client";

import { useEffect, useMemo, useState } from "react";

import { KnowledgeMapCanvasShell, KnowledgeMapDetailsPanel } from "@/src/app/components/knowledge-map/knowledge-map-panels";
import { createKnowledgeMapGraph } from "@/src/app/components/knowledge-map/model";
import {
  getSelectedGroupNames,
  getSelectedKnowledgeValue,
  getSelectedKindLabel,
  getSelectedNeighborNodes,
  getSelectedNode,
  normalizeSelection,
  selectionFromNode,
} from "@/src/app/components/knowledge-map/selection";
import { KnowledgeMapViewport } from "@/src/app/components/knowledge-map/viewport";
import type { KnowledgeMapSelection } from "@/src/content/portfolio/knowledge-map-selection";
import type { SkillGroup } from "@/src/content/portfolio/types";

export type { KnowledgeMapSelection } from "@/src/content/portfolio/knowledge-map-selection";

type SkillsKnowledgeMapProps = {
  skillGroups: SkillGroup[];
  activeIndex?: number;
  pendingSelection?: KnowledgeMapSelection | null;
  selectedNodeId?: string;
  onSelectionChange?: (selection: KnowledgeMapSelection) => void;
  onSelectionSettled?: (selection: KnowledgeMapSelection) => void;
};

export function SkillsKnowledgeMap({
  activeIndex: controlledActiveIndex,
  onSelectionChange,
  onSelectionSettled,
  pendingSelection = null,
  selectedNodeId: controlledSelectedNodeId,
  skillGroups,
}: Readonly<SkillsKnowledgeMapProps>) {
  const graphData = useMemo(() => createKnowledgeMapGraph(skillGroups), [skillGroups]);
  const mappedTechnologyCounts = useMemo(
    () =>
      skillGroups.map((_, groupIndex) =>
        graphData.nodes.filter(
          (node) => node.kind === "skill" && node.groupIndices.includes(groupIndex),
        ).length,
      ),
    [graphData, skillGroups],
  );
  const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = useState(0);
  const [uncontrolledSelectedNodeId, setUncontrolledSelectedNodeId] = useState("core");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mapReady, setMapReady] = useState(false);
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
  const selectedKnowledgeValue = getSelectedKnowledgeValue(selectedNode);
  const selectedKindLabel = getSelectedKindLabel(selectedNode);
  const pendingSelectedNode = pendingSelection
    ? (getSelectedNode(graphData, pendingSelection.id) ?? undefined)
    : undefined;
  const pendingSelectedNeighborNodes = pendingSelection
    ? getSelectedNeighborNodes(graphData, pendingSelection.id)
    : [];
  const pendingSelectedGroupNames = getSelectedGroupNames(pendingSelectedNode, skillGroups);
  const pendingSelectedKnowledgeValue = getSelectedKnowledgeValue(pendingSelectedNode);
  const pendingSelectedKindLabel = getSelectedKindLabel(pendingSelectedNode);

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

  useEffect(() => {
    if (!pendingSelection) {
      return;
    }

    if (!mapReady) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      onSelectionSettled?.(pendingSelection);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [mapReady, onSelectionSettled, pendingSelection]);

  return (
    <div className="relative">
      <div>
        <KnowledgeMapCanvasShell
          mapReady={mapReady}
          pending={pendingSelection !== null}
          prefersReducedMotion={prefersReducedMotion}
          resolvedSelectedNodeId={resolvedSelectedNodeId}
        >
          <KnowledgeMapViewport
            graphData={graphData}
            onReadyChange={setMapReady}
            onPickNode={applySelection}
            prefersReducedMotion={prefersReducedMotion}
            selectedNodeId={pendingSelection?.id ?? resolvedSelectedNodeId}
          />
        </KnowledgeMapCanvasShell>
      </div>

      <div className="w-full h-28 sm:h-32 mt-4 overflow-hidden">
        <div className="w-full h-full">
          <KnowledgeMapDetailsPanel
            activeGroupIndex={activeGroupIndex}
            mappedTechnologyCounts={mappedTechnologyCounts}
            onFocusNode={applySelection}
            pending={pendingSelection !== null}
            pendingSelectedGroupNames={pendingSelectedGroupNames}
            pendingSelectedKindLabel={pendingSelectedKindLabel}
            pendingSelectedKnowledgeValue={pendingSelectedKnowledgeValue}
            pendingSelectedLabel={pendingSelectedNode?.label ?? null}
            pendingSelectedNeighborNodes={pendingSelectedNeighborNodes}
            selectedGroupNames={selectedGroupNames}
            selectedKindLabel={selectedKindLabel}
            selectedKnowledgeValue={selectedKnowledgeValue}
            selectedLabel={selectedNode?.label ?? "Knowledge Graph"}
            selectedNeighborNodes={selectedNeighborNodes}
            skillGroups={skillGroups}
          />
        </div>
      </div>
    </div>
  );
}
