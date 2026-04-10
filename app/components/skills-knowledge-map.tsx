'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Camera, Geometry, Mesh, Program, Renderer, Sphere, Transform, Vec3 } from 'ogl';

import type { SkillGroup } from '@/src/content/portfolio/types';

const CATEGORY_COLORS = [
  [0.29, 0.63, 0.98],
  [0.53, 0.47, 0.98],
  [0.1, 0.73, 0.61],
  [0.98, 0.62, 0.24],
  [0.94, 0.39, 0.55],
  [0.54, 0.72, 0.23],
] as const;

const CROSS_DOMAIN_MEMBERSHIPS: Record<string, string[]> = {
  Python: ['DevOps'],
  'Serverless (OpenWhisk)': ['DevOps'],
  Docker: ['Backend'],
  Bash: ['Backend'],
  Linux: ['Backend'],
  MySQL: ['Backend'],
  PostgreSQL: ['Backend'],
};

const RELATED_SKILL_LINKS: Record<string, string[]> = {
  React: ['Next.js', 'TypeScript', 'Tailwind', 'Svelte'],
  'Next.js': ['React', 'TypeScript', 'Tailwind', 'Serverless (OpenWhisk)'],
  Svelte: ['React', 'TypeScript'],
  TypeScript: ['React', 'Next.js', 'Svelte', 'Tailwind'],
  Tailwind: ['React', 'Next.js', 'TypeScript'],
  Python: ['Django', 'Serverless (OpenWhisk)', 'Docker', 'Linux', 'Bash', 'PostgreSQL'],
  PHP: ['Laravel', 'MySQL'],
  Laravel: ['PHP', 'MySQL'],
  Django: ['Python', 'PostgreSQL'],
  'Serverless (OpenWhisk)': ['Python', 'Docker', 'Next.js'],
  Docker: ['Python', 'Linux', 'Bash', 'CI/CD', 'Serverless (OpenWhisk)'],
  'CI/CD': ['Docker', 'Linux', 'Bash'],
  Linux: ['Docker', 'Bash', 'CI/CD', 'Python'],
  Bash: ['Linux', 'Docker', 'CI/CD', 'Python'],
  MySQL: ['PHP', 'Laravel', 'PostgreSQL'],
  PostgreSQL: ['Python', 'Django', 'MySQL'],
};

const NODE_VERTEX_SHADER = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vNormal;

void main() {
  vNormal = normal;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

const NODE_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform vec3 uColor;
uniform float uAlpha;
uniform float uGlow;

varying vec3 vNormal;

void main() {
  float light = dot(normalize(vNormal), normalize(vec3(0.35, 0.8, 0.55))) * 0.32 + 0.68;
  vec3 color = (uColor * light) + vec3(uGlow * 0.35);
  gl_FragColor = vec4(color, uAlpha);
}
`;

const EDGE_VERTEX_SHADER = /* glsl */ `
attribute vec3 position;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

const EDGE_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform vec3 uColor;
uniform float uAlpha;

void main() {
  gl_FragColor = vec4(uColor, uAlpha);
}
`;

export type KnowledgeMapSelection = {
  id: string;
  label: string;
  kind: 'core' | 'category' | 'skill';
  activeIndex: number;
};

type SkillsKnowledgeMapProps = {
  skillGroups: SkillGroup[];
  activeIndex?: number;
  selectedNodeId?: string;
  onSelectionChange?: (selection: KnowledgeMapSelection) => void;
};

type GraphNode = {
  id: string;
  label: string;
  kind: 'core' | 'category' | 'skill';
  groupIndices: number[];
  knowledge?: number;
  color: readonly [number, number, number];
  position: readonly [number, number, number];
  neighbors: string[];
};

type GraphEdge = {
  id: string;
  from: string;
  to: string;
  kind: 'hub' | 'domain' | 'technology';
};

type NodeVisual = {
  data: GraphNode;
  mesh: Mesh;
  program: Program;
  baseScale: number;
};

type EdgeVisual = {
  data: GraphEdge;
  mesh: Mesh;
  program: Program;
};

type ProjectedNode = {
  id: string;
  x: number;
  y: number;
  z: number;
  radius: number;
};

type SceneState = {
  camera: Camera;
  renderer: Renderer;
  scene: Transform;
  graph: Transform;
  nodeVisuals: NodeVisual[];
  edgeVisuals: EdgeVisual[];
  projectedNodes: ProjectedNode[];
  dispose: () => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mix(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function getCategoryColor(index: number) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
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
  kind: GraphEdge['kind'],
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

  const edgeId = [fromId, toId].sort().join('::');

  if (edgeIds.has(edgeId)) {
    return;
  }

  edgeIds.add(edgeId);
  edges.push({ id: edgeId, from: fromId, to: toId, kind });
}

function createGraph(skillGroups: SkillGroup[]) {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeMap = new Map<string, GraphNode>();
  const edgeIds = new Set<string>();
  const categoryIndexByLabel = new Map(
    skillGroups.map((group, index) => [group.category, index] as const),
  );

  const rootNode: GraphNode = {
    id: 'core',
    label: 'Knowledge Graph',
    kind: 'core',
    groupIndices: [],
    color: [0.94, 0.97, 1],
    position: [0, 0, 0],
    neighbors: [],
  };

  nodes.push(rootNode);
  nodeMap.set(rootNode.id, rootNode);

  const categoryNodes = skillGroups.map((group, groupIndex) => {
    const angle = (groupIndex / Math.max(skillGroups.length, 1)) * Math.PI * 2;
    const categoryNode: GraphNode = {
      id: `category-${groupIndex}`,
      label: group.category,
      kind: 'category',
      groupIndices: [groupIndex],
      color: getCategoryColor(groupIndex),
      position: [
        Math.cos(angle) * 3.75,
        Math.sin(angle * 2) * 1.1,
        Math.sin(angle) * 3.1,
      ],
      neighbors: [],
    };

    nodes.push(categoryNode);
    nodeMap.set(categoryNode.id, categoryNode);
    connectNodes(nodeMap, edges, edgeIds, rootNode.id, categoryNode.id, 'hub');

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
      if (typeof entry.knowledge === 'number') {
        record.knowledgeValues.push(entry.knowledge);
      }

      for (const categoryLabel of CROSS_DOMAIN_MEMBERSHIPS[item] ?? []) {
        const extraGroupIndex = categoryIndexByLabel.get(categoryLabel);

        if (typeof extraGroupIndex === 'number') {
          record.groupIndices.add(extraGroupIndex);
        }
      }

      skillRecords.set(item, record);
    });
  });

  const skillNodeIds = new Map<string, string>();

  Array.from(skillRecords.values()).forEach((record, skillIndex) => {
    const groupIndices = Array.from(record.groupIndices).sort((left, right) => left - right);
    const anchorPositions = groupIndices.map((groupIndex) => categoryNodes[groupIndex]?.position ?? [0, 0, 0]);
    const centroid = averageVector(anchorPositions);
    const hash = hashLabel(record.label);
    const angle = (hash % 360) * (Math.PI / 180);
    const orbit = groupIndices.length > 1 ? 1.05 : 1.55;
    const knowledge =
      record.knowledgeValues.length > 0
        ? record.knowledgeValues.reduce((sum, value) => sum + value, 0) / record.knowledgeValues.length
        : undefined;
    const skillNode: GraphNode = {
      id: `skill-${skillIndex}`,
      label: record.label,
      kind: 'skill',
      groupIndices,
      knowledge,
      color: averageVector(groupIndices.map((groupIndex) => getCategoryColor(groupIndex))),
      position: [
        centroid[0] + Math.cos(angle) * orbit,
        centroid[1] + (((hash >> 3) % 9) - 4) * 0.18,
        centroid[2] + Math.sin(angle) * (groupIndices.length > 1 ? 1.1 : 1.45),
      ],
      neighbors: [],
    };

    nodes.push(skillNode);
    nodeMap.set(skillNode.id, skillNode);
    skillNodeIds.set(skillNode.label, skillNode.id);

    groupIndices.forEach((groupIndex) => {
      connectNodes(nodeMap, edges, edgeIds, `category-${groupIndex}`, skillNode.id, 'domain');
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

      connectNodes(nodeMap, edges, edgeIds, fromId, toId, 'technology');
    });
  });

  return { nodes, edges, nodeMap };
}

function syncHighlight(
  scene: SceneState | null,
  nodeMap: Map<string, GraphNode>,
  selectedNodeId: string,
) {
  if (!scene) {
    return;
  }

  const selectedNode = nodeMap.get(selectedNodeId) ?? nodeMap.get('core');
  const neighbors = new Set(selectedNode?.neighbors ?? []);
  const baseDimmedNodeAlpha = 0.34;
  const relatedNodeAlpha = 0.82;

  for (const visual of scene.nodeVisuals) {
    const isSelected = visual.data.id === selectedNode?.id;
    const isNeighbor = neighbors.has(visual.data.id);
    const isRelated = isSelected || isNeighbor;
    const emphasis = isSelected ? 1 : isNeighbor ? relatedNodeAlpha : selectedNode ? baseDimmedNodeAlpha : 0.45;
    const scaleBoost = isSelected ? 1.28 : isNeighbor ? 1.08 : 0.92;
    const colorValue = visual.program.uniforms.uColor.value as Float32Array;

    colorValue[0] = mix(0.2, visual.data.color[0], isRelated ? 1 : 0.45);
    colorValue[1] = mix(0.22, visual.data.color[1], isRelated ? 1 : 0.45);
    colorValue[2] = mix(0.28, visual.data.color[2], isRelated ? 1 : 0.45);

    visual.program.uniforms.uAlpha.value = visual.data.kind === 'skill' ? emphasis : Math.min(1, emphasis + 0.08);
    visual.program.uniforms.uGlow.value = isSelected ? 0.68 : isNeighbor ? 0.28 : 0.05;
    visual.mesh.scale.set(
      visual.baseScale * scaleBoost,
      visual.baseScale * scaleBoost,
      visual.baseScale * scaleBoost,
    );
  }

  for (const visual of scene.edgeVisuals) {
    const touchesSelected =
      visual.data.from === selectedNode?.id || visual.data.to === selectedNode?.id;
    const touchesNeighbor =
      neighbors.has(visual.data.from) ||
      neighbors.has(visual.data.to) ||
      (neighbors.has(visual.data.from) && neighbors.has(visual.data.to));
    const colorValue = visual.program.uniforms.uColor.value as Float32Array;
    const baseColor =
      visual.data.kind === 'hub'
        ? [0.67, 0.71, 0.8]
        : visual.data.kind === 'domain'
          ? [0.33, 0.61, 0.96]
          : [0.91, 0.45, 0.82];
    const emphasizedColor =
      visual.data.kind === 'hub'
        ? [0.84, 0.88, 0.98]
        : visual.data.kind === 'domain'
          ? [0.48, 0.76, 1]
          : [1, 0.64, 0.9];
    const alpha = touchesSelected
      ? visual.data.kind === 'technology'
        ? 0.96
        : 0.9
      : touchesNeighbor
        ? visual.data.kind === 'technology'
          ? 0.42
          : 0.28
        : visual.data.kind === 'technology'
          ? 0.18
          : visual.data.kind === 'domain'
            ? 0.12
            : 0.08;

    colorValue[0] = touchesSelected ? emphasizedColor[0] : baseColor[0];
    colorValue[1] = touchesSelected ? emphasizedColor[1] : baseColor[1];
    colorValue[2] = touchesSelected ? emphasizedColor[2] : baseColor[2];
    visual.program.uniforms.uAlpha.value = alpha;
  }
}

export function SkillsKnowledgeMap({
  activeIndex: controlledActiveIndex,
  onSelectionChange,
  selectedNodeId: controlledSelectedNodeId,
  skillGroups,
}: Readonly<SkillsKnowledgeMapProps>) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<SceneState | null>(null);

  const graphData = useMemo(() => createGraph(skillGroups), [skillGroups]);
  const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = useState(0);
  const [uncontrolledSelectedNodeId, setUncontrolledSelectedNodeId] = useState('core');
  const activeIndex = controlledActiveIndex ?? uncontrolledActiveIndex;
  const selectedNodeId = controlledSelectedNodeId ?? uncontrolledSelectedNodeId;
  const resolvedSelectedNodeId = graphData.nodeMap.has(selectedNodeId) ? selectedNodeId : 'core';

  const selectedNode = graphData.nodeMap.get(resolvedSelectedNodeId) ?? graphData.nodeMap.get('core');
  const activeGroupIndex = selectedNode?.groupIndices[0] ?? activeIndex;
  const activeGroup = skillGroups[activeGroupIndex] ?? skillGroups[0];
  const selectedNeighborNodes = useMemo(() => {
    return (selectedNode?.neighbors ?? [])
      .map((nodeId) => graphData.nodeMap.get(nodeId))
      .filter((node): node is GraphNode => node !== undefined && node.id !== 'core')
      .sort((left, right) => {
        if (left.kind !== right.kind) {
          return left.kind === 'category' ? -1 : 1;
        }

        return left.label.localeCompare(right.label);
      });
  }, [graphData.nodeMap, selectedNode]);
  const selectedGroupNames = (selectedNode?.groupIndices ?? [])
    .map((groupIndex) => skillGroups[groupIndex]?.category)
    .filter(Boolean);
  const selectedKnowledgeLabel =
    selectedNode?.kind === 'skill' && typeof selectedNode.knowledge === 'number'
      ? `${Math.round(selectedNode.knowledge * 5)}/5 knowledge`
      : null;
  const selectedKindLabel =
    selectedNode?.kind === 'category'
      ? 'domain'
      : selectedNode?.kind === 'skill'
        ? 'technology'
        : 'hub';

  const applySelection = (nodeId: string) => {
    const node = graphData.nodeMap.get(nodeId);
    const nextActiveIndex = node?.groupIndices[0] ?? activeIndex;
    const normalizedSelection: KnowledgeMapSelection = {
      id: node?.id ?? 'core',
      label: node?.label ?? 'Knowledge Graph',
      kind: node?.kind ?? 'core',
      activeIndex: typeof nextActiveIndex === 'number' ? nextActiveIndex : -1,
    };

    if (controlledSelectedNodeId === undefined) {
      setUncontrolledSelectedNodeId(normalizedSelection.id);
    }

    if (controlledActiveIndex === undefined && normalizedSelection.activeIndex >= 0) {
      setUncontrolledActiveIndex(normalizedSelection.activeIndex);
    }

    onSelectionChange?.(normalizedSelection);
  };

  useEffect(() => {
    const container = viewportRef.current;

    if (!container) {
      return;
    }

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const { gl } = renderer;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 40, near: 0.1, far: 100 });
    camera.position.set(0, 0, 12);
    camera.lookAt([0, 0, 0]);

    const scene = new Transform();
    const graph = new Transform();
    graph.setParent(scene);

    const sphereGeometry = new Sphere(gl, {
      radius: 1,
      widthSegments: 24,
      heightSegments: 24,
    });

    const nodeVisuals: NodeVisual[] = graphData.nodes.map((node) => {
      const program = new Program(gl, {
        vertex: NODE_VERTEX_SHADER,
        fragment: NODE_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new Float32Array(node.color) },
          uAlpha: { value: 1 },
          uGlow: { value: 0 },
        },
      });
      const mesh = new Mesh(gl, { geometry: sphereGeometry, program });
      const baseScale =
        node.kind === 'core'
          ? 0.74
          : node.kind === 'category'
            ? 0.44
            : 0.16 + (node.knowledge ?? 0.45) * 0.18;

      mesh.position.set(node.position[0], node.position[1], node.position[2]);
      mesh.scale.set(baseScale, baseScale, baseScale);
      mesh.setParent(graph);

      return { data: node, mesh, program, baseScale };
    });

    const edgeVisuals: EdgeVisual[] = graphData.edges.map((edge) => {
      const fromNode = graphData.nodeMap.get(edge.from);
      const toNode = graphData.nodeMap.get(edge.to);
      const baseColor =
        edge.kind === 'hub'
          ? [0.67, 0.71, 0.8]
          : edge.kind === 'domain'
            ? [0.33, 0.61, 0.96]
            : [0.91, 0.45, 0.82];
      const baseAlpha =
        edge.kind === 'hub' ? 0.08 : edge.kind === 'domain' ? 0.12 : 0.18;
      const geometry = new Geometry(gl, {
        position: {
          size: 3,
          data: new Float32Array([
            fromNode?.position[0] ?? 0,
            fromNode?.position[1] ?? 0,
            fromNode?.position[2] ?? 0,
            toNode?.position[0] ?? 0,
            toNode?.position[1] ?? 0,
            toNode?.position[2] ?? 0,
          ]),
        },
      });
      const program = new Program(gl, {
        vertex: EDGE_VERTEX_SHADER,
        fragment: EDGE_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new Float32Array(baseColor) },
          uAlpha: { value: baseAlpha },
        },
      });
      const mesh = new Mesh(gl, { geometry, program, mode: gl.LINES });

      mesh.setParent(graph);

      return { data: edge, mesh, program };
    });

    container.appendChild(gl.canvas);
    gl.canvas.className = 'h-full w-full touch-none';

    const state: SceneState = {
      camera,
      renderer,
      scene,
      graph,
      nodeVisuals,
      edgeVisuals,
      projectedNodes: [],
      dispose: () => {
        if (gl.canvas.parentNode === container) {
          container.removeChild(gl.canvas);
        }
      },
    };

    sceneRef.current = state;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let currentRotationX = -0.18;
    let currentRotationY = 0.62;
    let targetRotationX = currentRotationX;
    let targetRotationY = currentRotationY;
    let isDragging = false;
    let moved = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let startRotationX = 0;
    let startRotationY = 0;
    let pointerId = -1;

    const resize = () => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;

      if (!nextWidth || !nextHeight) {
        return;
      }

      width = nextWidth;
      height = nextHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
    };

    const updateProjectedNodes = () => {
      const projectedNodes: ProjectedNode[] = [];

      for (const visual of nodeVisuals) {
        const worldPosition = new Vec3();
        const projected = new Vec3();

        visual.mesh.worldMatrix.getTranslation(worldPosition);
        projected.copy(worldPosition);
        camera.project(projected);

        projectedNodes.push({
          id: visual.data.id,
          x: (projected.x * 0.5 + 0.5) * width,
          y: (1 - (projected.y * 0.5 + 0.5)) * height,
          z: projected.z,
          radius:
            visual.data.kind === 'core'
              ? 28
              : visual.data.kind === 'category'
                ? 18
                : 10 + Math.round((visual.data.knowledge ?? 0.45) * 10),
        });
      }

      state.projectedNodes = projectedNodes;
    };

    const pickNode = (clientX: number, clientY: number) => {
      const bounds = container.getBoundingClientRect();
      const x = clientX - bounds.left;
      const y = clientY - bounds.top;

      let winner: ProjectedNode | null = null;

      for (const candidate of state.projectedNodes) {
        if (candidate.z < -1 || candidate.z > 1) {
          continue;
        }

        const distance = Math.hypot(candidate.x - x, candidate.y - y);
        if (distance > candidate.radius) {
          continue;
        }

        if (!winner || candidate.z < winner.z) {
          winner = candidate;
        }
      }

      if (!winner) {
        return;
      }

      const node = graphData.nodeMap.get(winner.id);

      if (!node) {
        return;
      }

      const nextActiveIndex = node.groupIndices[0] ?? activeIndex;
      const normalizedSelection: KnowledgeMapSelection = {
        id: node.id,
        label: node.label,
        kind: node.kind,
        activeIndex: typeof nextActiveIndex === 'number' ? nextActiveIndex : -1,
      };

      if (controlledSelectedNodeId === undefined) {
        setUncontrolledSelectedNodeId(normalizedSelection.id);
      }

      if (controlledActiveIndex === undefined && normalizedSelection.activeIndex >= 0) {
        setUncontrolledActiveIndex(normalizedSelection.activeIndex);
      }

      onSelectionChange?.(normalizedSelection);
    };

    const onPointerDown = (event: PointerEvent) => {
      pointerId = event.pointerId;
      isDragging = true;
      moved = false;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      startRotationX = targetRotationX;
      startRotationY = targetRotationY;
      gl.canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging || event.pointerId !== pointerId) {
        return;
      }

      const deltaX = event.clientX - pointerStartX;
      const deltaY = event.clientY - pointerStartY;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        moved = true;
      }

      targetRotationY = startRotationY + deltaX * 0.0085;
      targetRotationX = clamp(startRotationX + deltaY * 0.0065, -0.95, 0.95);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) {
        return;
      }

      if (!moved) {
        pickNode(event.clientX, event.clientY);
      }

      isDragging = false;
      pointerId = -1;

      if (gl.canvas.hasPointerCapture(event.pointerId)) {
        gl.canvas.releasePointerCapture(event.pointerId);
      }
    };

    const render = () => {
      animationFrame = window.requestAnimationFrame(render);

      if (!isDragging) {
        targetRotationY += 0.0018;
      }

      currentRotationX = mix(currentRotationX, targetRotationX, 0.09);
      currentRotationY = mix(currentRotationY, targetRotationY, 0.09);
      graph.rotation.x = currentRotationX;
      graph.rotation.y = currentRotationY;

      renderer.render({ scene, camera, sort: false, frustumCull: false });
      updateProjectedNodes();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    resize();
    render();

    gl.canvas.addEventListener('pointerdown', onPointerDown);
    gl.canvas.addEventListener('pointermove', onPointerMove);
    gl.canvas.addEventListener('pointerup', onPointerUp);
    gl.canvas.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      gl.canvas.removeEventListener('pointerdown', onPointerDown);
      gl.canvas.removeEventListener('pointermove', onPointerMove);
      gl.canvas.removeEventListener('pointerup', onPointerUp);
      gl.canvas.removeEventListener('pointercancel', onPointerUp);
      state.dispose();

      if (sceneRef.current === state) {
        sceneRef.current = null;
      }
    };
  }, [activeIndex, controlledActiveIndex, controlledSelectedNodeId, graphData, onSelectionChange]);

  useEffect(() => {
    syncHighlight(sceneRef.current, graphData.nodeMap, resolvedSelectedNodeId);
  }, [graphData, resolvedSelectedNodeId]);

  const focusNode = (nodeId: string) => {
    applySelection(nodeId);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-black/[0.03] p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.55)] dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_62%)] dark:bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.2),transparent_62%)]" />
        <div className="relative space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
              Unified knowledge graph
            </p>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight text-black dark:text-white sm:text-3xl">
                Frontend, backend, DevOps, and data in one map
              </h3>
              <p className="max-w-xl text-sm leading-7 text-black/65 dark:text-white/65 sm:text-base">
                Rotate the graph in 3D and inspect how frameworks, runtimes, infrastructure, and storage tools connect across the stack.
              </p>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-black/10 bg-white/65 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
              Selected point
            </p>
            <div className="mt-2 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-black dark:text-white">{selectedNode?.label}</p>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    {selectedNeighborNodes.length} directly connected points highlighted
                  </p>
                </div>
                <span className="rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/55 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/55">
                  {selectedKindLabel}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(selectedGroupNames.length > 0 ? selectedGroupNames : ['All fields']).map((groupName) => (
                  <span
                    key={groupName}
                    className="rounded-full border border-black/10 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/55 dark:border-white/10 dark:bg-black/20 dark:text-white/55"
                  >
                    {groupName}
                  </span>
                ))}
                {selectedKnowledgeLabel ? (
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/55 dark:border-white/10 dark:bg-black/20 dark:text-white/55">
                    {selectedKnowledgeLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
                Connected points
              </p>
              {activeGroup ? (
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                  Focused field: {activeGroup.category}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedNeighborNodes.length > 0 ? (
                selectedNeighborNodes.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => focusNode(node.id)}
                    className={`rounded-full border px-3 py-1.5 text-sm shadow-sm transition-colors ${
                      node.kind === 'category'
                        ? 'border-black/10 bg-black/[0.04] text-black/75 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/75'
                        : 'border-black/10 bg-white text-black/75 dark:border-white/10 dark:bg-black/20 dark:text-white/75'
                    }`}
                  >
                    {node.label}
                  </button>
                ))
              ) : (
                <p className="text-sm leading-7 text-black/60 dark:text-white/60">
                  Select a point to inspect the domains and technologies directly connected to it.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {skillGroups.map((group, index) => {
              const isActive = index === activeGroupIndex;

              return (
                <button
                  key={group.category}
                  type="button"
                  onClick={() => focusNode(`category-${index}`)}
                  aria-pressed={isActive}
                  className={`rounded-2xl border px-4 py-3 text-left transition-colors duration-300 ${
                    isActive
                      ? 'border-black/15 bg-black text-white dark:border-white/15 dark:bg-white dark:text-black'
                      : 'border-black/10 bg-white/70 text-black/75 hover:border-black/20 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/75 dark:hover:border-white/20'
                  }`}
                >
                  <span className="block text-sm font-semibold">{group.category}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.18em] opacity-60">
                    {group.items.length} mapped technologies
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,247,250,0.78))] p-4 shadow-[0_35px_120px_-70px_rgba(37,99,235,0.45)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.78))] sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_46%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_30%)]" />
        <div className="relative h-[24rem] overflow-hidden rounded-[1.6rem] border border-black/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.84),rgba(226,232,240,0.35),rgba(148,163,184,0.08))] dark:border-white/10 dark:bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.8),rgba(15,23,42,0.42),rgba(2,6,23,0.12))] sm:h-[30rem]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-5 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45 sm:px-6 sm:py-5">
            <span>3D knowledge map</span>
            <span>Drag to rotate</span>
          </div>

          <div ref={viewportRef} className="absolute inset-0" />

          <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 rounded-2xl border border-black/10 bg-white/60 px-4 py-3 text-xs uppercase tracking-[0.22em] text-black/45 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:text-white/45 sm:inset-x-6 sm:bottom-6">
            Tap any point to trace its direct links across the graph.
          </div>
        </div>
      </div>
    </div>
  );
}
