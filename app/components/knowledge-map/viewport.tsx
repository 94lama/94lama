"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { KnowledgeMapGraph } from "@/app/components/knowledge-map/model";
import { createKnowledgeMapScene, syncHighlight, type SceneState } from "@/app/components/knowledge-map/runtime";

type KnowledgeMapViewportProps = {
  graphData: KnowledgeMapGraph;
  onReadyChange?: (ready: boolean) => void;
  onPickNode: (nodeId: string) => void;
  prefersReducedMotion: boolean;
  selectedNodeId: string;
};

export function KnowledgeMapViewport({
  graphData,
  onReadyChange,
  onPickNode,
  prefersReducedMotion,
  selectedNodeId,
}: Readonly<KnowledgeMapViewportProps>) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<SceneState | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);

  const handleHoverNode = useCallback(
    (nodeId: string | null) => {
      if (nodeId) {
        const node = graphData.nodeMap.get(nodeId);
        setHoveredLabel(node?.label ?? null);
      } else {
        setHoveredLabel(null);
      }
    },
    [graphData],
  );

  const handlePointerMove = useCallback((event: PointerEvent) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  }, []);

  // When hover ends, reapply selection highlight to reset any visual deltas
  useEffect(() => {
    if (hoveredLabel !== null) {
      return;
    }

    if (!sceneRef.current) {
      return;
    }

    try {
      syncHighlight(sceneRef.current, graphData.nodeMap, selectedNodeId);
    } catch (err) {
      // ignore
    }
  }, [hoveredLabel, graphData, selectedNodeId]);

  useEffect(() => {
    const container = viewportRef.current;

    if (!container) {
      return;
    }

    onReadyChange?.(false);

    const { state, cleanup } = createKnowledgeMapScene({
      container,
      graphData,
      onPickNode,
      onHoverNode: handleHoverNode,
      prefersReducedMotion,
    });

    sceneRef.current = state;
    syncHighlight(state, graphData.nodeMap, selectedNodeId);
    onReadyChange?.(true);

    return () => {
      onReadyChange?.(false);
      cleanup();

      if (sceneRef.current === state) {
        sceneRef.current = null;
      }
    };
  }, [graphData, handleHoverNode, onPickNode, onReadyChange, prefersReducedMotion]);

  useEffect(() => {
    syncHighlight(sceneRef.current, graphData.nodeMap, selectedNodeId);
  }, [graphData, selectedNodeId]);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  return (
    <>
      <div ref={viewportRef} className="absolute inset-0" />
      {hoveredLabel && cursorPosition ? (
        <div
          className="pointer-events-none fixed z-50 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-sm font-semibold text-black shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-950/90 dark:text-white"
          style={{
            left: cursorPosition.x,
            top: cursorPosition.y,
            transform: "translate(-50%, calc(-100% - 12px))",
          }}
        >
          {hoveredLabel}
        </div>
      ) : null}
    </>
  );
}
