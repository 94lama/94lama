"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ExperienceTimelineSection } from "@/src/app/components/experience-timeline-section";
import {
  KnowledgeMapCanvasShell,
  KnowledgeMapDetailsPanel,
} from "@/src/app/components/knowledge-map/knowledge-map-panels";
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
import type { ExperienceEntry, SkillGroup } from "@/src/content/portfolio/types";
import { RankedExperienceEntry } from "@/src/content/portfolio/rank-experience-by-selection";

export type { KnowledgeMapSelection } from "@/src/content/portfolio/knowledge-map-selection";

type SkillsKnowledgeMapProps = {
  skillGroups: SkillGroup[];
  activeIndex?: number;
  pendingSelection?: KnowledgeMapSelection | null;
  selectedNodeId?: string;
  onSelectionChange?: (selection: KnowledgeMapSelection) => void;
  onSelectionSettled?: (selection: KnowledgeMapSelection) => void;
  experienceEntries?: RankedExperienceEntry[];
  experienceHelperCopy?: string;
  experienceIsFallback?: boolean;
  experiencePending?: boolean;
  experiencePendingHelperCopy?: string | null;
  experiencePendingSelectionLabel?: string | null;
  experiencePendingSelectionKind?: string | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

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
  const [horizontalTravel, setHorizontalTravel] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

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
    if (!pendingSelection || !mapReady) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      onSelectionSettled?.(pendingSelection);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [mapReady, onSelectionSettled, pendingSelection]);

  useEffect(() => {
    const section = sectionRef.current;
    const scroller = scrollerRef.current;

    if (!section || !scroller) {
      return;
    }

    let frame = 0;

    const updateLayout = () => {
      frame = 0;

      const sectionWidth = section.clientWidth || window.innerWidth;
      const nextTravel = Math.max(0, scroller.scrollWidth - sectionWidth);

      setHorizontalTravel((current) =>
        Math.abs(current - nextTravel) > 1 ? nextTravel : current,
      );
    };

    const scheduleUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateLayout);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(section);
    resizeObserver.observe(scroller);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [experienceEntries]);

  useEffect(() => {
    const section = sectionRef.current;
    const scroller = scrollerRef.current;
    if (!section || !scroller) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
      if (maxScrollLeft <= 0) return;

      // section pinned when its top reached viewport and vertical progress within travel
      const pinned = rect.top <= 0 && -rect.top <= maxScrollLeft;
      if (!pinned) return;

      const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      const deltaScale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? scroller.clientWidth : 1;
      const amount = delta * deltaScale;
      const prev = scroller.scrollLeft;
      const target = clamp(prev + amount, 0, maxScrollLeft);

      if (target !== prev) {
        e.preventDefault();
        scroller.scrollLeft = target;
      }
    };

    section.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      section.removeEventListener("wheel", handleWheel);
    };
  }, [horizontalTravel, experienceEntries]);

  // Keep visual width equal to viewport but avoid page overflow by subtracting scrollbar width
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const applyWidth = () => {
      const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      el.style.width = `calc(100vw - ${scrollbarWidth}px)`;
    };

    applyWidth();
    window.addEventListener("resize", applyWidth);

    return () => window.removeEventListener("resize", applyWidth);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative left-1/2 w-[100vw] -translate-x-1/2 transform box-border"
      style={{ height: `calc(100vh + ${horizontalTravel}px)` }}
    >
      <div className="sticky top-0 h-screen w-full box-border">
        <div className="knowledge-tree absolute inset-0 z-0 h-full w-full box-border">
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

        <div className="inset-0 z-10 pointer-events-none">
          <div
            ref={scrollerRef}
            className="inset-0 pointer-events-auto overflow-x-scroll overflow-y-hidden scrollbar-hidden"
          >
            <div className="flex h-full items-start gap-4 p-4 ml-[100vw] will-change-transform sm:gap-6 sm:px-6 sm:py-6">

              <div className="pointer-events-auto shrink-0 w-[min(82vw,34rem)] lg:w-[min(40vw,36rem)]">
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

              {experienceEntries ? (
                <div className="pointer-events-auto shrink-0 w-[min(92vw,42rem)] lg:w-[min(46vw,44rem)] lg:pr-10 overflow-y-auto max-h-[90vh] scrollbar-hidden">
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
    </div>
  );
}
