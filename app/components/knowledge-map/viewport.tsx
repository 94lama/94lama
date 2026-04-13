"use client";

import { useEffect, useRef } from "react";

import type { KnowledgeMapGraph } from "@/app/components/knowledge-map/model";
import { createKnowledgeMapScene, syncHighlight, type SceneState } from "@/app/components/knowledge-map/runtime";

type KnowledgeMapViewportProps = {
  graphData: KnowledgeMapGraph;
  onPickNode: (nodeId: string) => void;
  prefersReducedMotion: boolean;
  selectedNodeId: string;
};

export function KnowledgeMapViewport({
  graphData,
  onPickNode,
  prefersReducedMotion,
  selectedNodeId,
}: Readonly<KnowledgeMapViewportProps>) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<SceneState | null>(null);

  useEffect(() => {
    const container = viewportRef.current;

    if (!container) {
      return;
    }

    const { state, cleanup } = createKnowledgeMapScene({
      container,
      graphData,
      onPickNode,
      prefersReducedMotion,
    });

    sceneRef.current = state;
    syncHighlight(state, graphData.nodeMap, selectedNodeId);

    return () => {
      cleanup();

      if (sceneRef.current === state) {
        sceneRef.current = null;
      }
    };
  }, [graphData, onPickNode, prefersReducedMotion, selectedNodeId]);

  useEffect(() => {
    syncHighlight(sceneRef.current, graphData.nodeMap, selectedNodeId);
  }, [graphData, selectedNodeId]);

  return <div ref={viewportRef} className="absolute inset-0" />;
}
