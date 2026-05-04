"use client";

import { useEffect, useMemo, useState } from "react";

import { KnowledgeMapCanvasShell, KnowledgeMapDetailsPanel } from "@/app/components/knowledge-map/knowledge-map-panels";
import { ExperienceTimelineSection } from "@/app/components/experience-timeline-section";
import type { ExperienceEntry } from "@/src/content/portfolio/types";
import { createKnowledgeMapGraph } from "@/app/components/knowledge-map/model";
import {
  getSelectedGroupNames,
  getSelectedKnowledgeValue,
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
  pendingSelection?: KnowledgeMapSelection | null;
  selectedNodeId?: string;
  onSelectionChange?: (selection: KnowledgeMapSelection) => void;
  onSelectionSettled?: (selection: KnowledgeMapSelection) => void;
  // Experience props (optional) — when provided, experience timeline renders inside details column
  experienceEntries?: ExperienceEntry[];
  experienceHelperCopy?: string;
  experienceIsFallback?: boolean;
  experiencePending?: boolean;
  experiencePendingHelperCopy?: string | null;
  experiencePendingSelectionLabel?: string | null;
  experiencePendingSelectionKind?: string | null;
};

export function SkillsKnowledgeMap({
  activeIndex: controlledActiveIndex,
  onSelectionChange,
  onSelectionSettled,
  pendingSelection = null,
  selectedNodeId: controlledSelectedNodeId,
  skillGroups,
  experienceEntries,
  experienceHelperCopy,
  experienceIsFallback,
  experiencePending,
  experiencePendingHelperCopy,
  experiencePendingSelectionLabel,
  experiencePendingSelectionKind,
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
    <div className="relative left-1/2 transform -translate-x-1/2 w-screen">
      <div className="grid gap-6 xl:grid-cols-[3fr_1fr] xl:items-stretch">
        <div className="map-column xl:sticky xl:top-0 xl:h-screen">
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

        <div className="details-column w-full xl:pt-6 xl:pl-6 xl:pr-4">
          <div>
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

            {experienceEntries ? (
              <div className="mt-6">
                <ExperienceTimelineSection
                  entries={experienceEntries}
                  helperCopy={experienceHelperCopy ?? ""}
                  isFallback={experienceIsFallback ?? false}
                  pendingHelperCopy={experiencePendingHelperCopy ?? null}
                  pendingSelectionLabel={experiencePendingSelectionLabel ?? null}
                  pendingSelectionKind={experiencePendingSelectionKind ?? null}
                  pending={experiencePending ?? false}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

