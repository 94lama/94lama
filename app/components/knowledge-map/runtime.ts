import {
  Camera,
  Geometry,
  Mesh,
  Program,
  Renderer,
  Sphere,
  Transform,
  Vec3,
} from "ogl";

import type { GraphNode, KnowledgeMapGraph } from "@/app/components/knowledge-map/model";

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

type NodeVisual = {
  data: GraphNode;
  mesh: Mesh | undefined;
  program: Program;
  baseScale: number;
};

type EdgeVisual = {
  data: KnowledgeMapGraph["edges"][number];
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

export type SceneState = {
  camera: Camera;
  renderer: Renderer;
  scene: Transform;
  graph: Transform;
  nodeVisuals: NodeVisual[];
  edgeVisuals: EdgeVisual[];
  projectedNodes: ProjectedNode[];
  dispose: () => void;
};

type CreateKnowledgeMapSceneArgs = {
  container: HTMLDivElement;
  graphData: KnowledgeMapGraph;
  prefersReducedMotion: boolean;
  onPickNode: (nodeId: string) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mix(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function normalizeHash(value: number) {
  return ((value % 1000) + 1000) % 1000 / 1000;
}

function hashLabel(label: string) {
  let hash = 0;

  for (const character of label) {
    hash = (hash * 31 + character.charCodeAt(0)) % 2147483647;
  }

  return hash;
}

export function getEntranceStyle(prefersReducedMotion: boolean, delay = 0) {
  if (prefersReducedMotion) {
    return undefined;
  }

  return {
    animation: `fade-in-up 500ms ease-out ${delay}ms both`,
  };
}

export function syncHighlight(
  scene: SceneState | null,
  nodeMap: Map<string, GraphNode>,
  selectedNodeId: string,
) {
  if (!scene) {
    return;
  }

  const selectedNode = nodeMap.get(selectedNodeId) ?? nodeMap.get("core");
  const neighbors = new Set(selectedNode?.neighbors ?? []);
  const baseDimmedNodeAlpha = 0.34;
  const relatedNodeAlpha = 0.82;

  for (const visual of scene.nodeVisuals) {
    const isRendered = visual.data.kind === "core" ? false : Boolean(visual.mesh);
    const isSelected = visual.data.id === selectedNode?.id;
    const isNeighbor = neighbors.has(visual.data.id);
    const isRelated = isSelected || isNeighbor;
    const emphasis = isSelected
      ? 1
      : isNeighbor
        ? relatedNodeAlpha
        : selectedNode
          ? baseDimmedNodeAlpha
          : 0.45;
    const scaleBoost = isSelected ? 1.28 : isNeighbor ? 1.08 : 0.92;
    const colorValue = visual.program.uniforms.uColor.value as Float32Array;

    colorValue[0] = mix(0.2, visual.data.color[0], isRelated ? 1 : 0.45);
    colorValue[1] = mix(0.22, visual.data.color[1], isRelated ? 1 : 0.45);
    colorValue[2] = mix(0.28, visual.data.color[2], isRelated ? 1 : 0.45);

    if (!isRendered || !visual.mesh) {
      continue;
    }

    visual.program.uniforms.uAlpha.value =
      visual.data.kind === "skill" ? emphasis : Math.min(1, emphasis + 0.08);
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
      visual.data.kind === "hub"
        ? [0.67, 0.71, 0.8]
        : visual.data.kind === "domain"
          ? [0.33, 0.61, 0.96]
          : [0.91, 0.45, 0.82];
    const emphasizedColor =
      visual.data.kind === "hub"
        ? [0.84, 0.88, 0.98]
        : visual.data.kind === "domain"
          ? [0.48, 0.76, 1]
          : [1, 0.64, 0.9];
    const alpha = touchesSelected
      ? visual.data.kind === "technology"
        ? 0.96
        : 0.9
      : touchesNeighbor
        ? visual.data.kind === "technology"
          ? 0.42
          : 0.28
        : visual.data.kind === "technology"
          ? 0.18
          : visual.data.kind === "domain"
            ? 0.12
            : 0.08;

    colorValue[0] = touchesSelected ? emphasizedColor[0] : baseColor[0];
    colorValue[1] = touchesSelected ? emphasizedColor[1] : baseColor[1];
    colorValue[2] = touchesSelected ? emphasizedColor[2] : baseColor[2];
    visual.program.uniforms.uAlpha.value = alpha;
  }
}

export function createKnowledgeMapScene({
  container,
  graphData,
  prefersReducedMotion,
  onPickNode,
}: CreateKnowledgeMapSceneArgs) {
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
    radius: 0.6,
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
    const mesh =
      node.kind === "core" ? undefined : new Mesh(gl, { geometry: sphereGeometry, program });
    const baseScale =
      node.kind === "core"
        ? 0.74
        : node.kind === "category"
          ? 0.44
          : 0.16 + (node.knowledge ?? 0.45) * 0.18;

    if (mesh) {
      mesh.position.set(node.position[0], node.position[1], node.position[2]);
      mesh.scale.set(baseScale, baseScale, baseScale);
      mesh.setParent(graph);
    }

    return { data: node, mesh, program, baseScale };
  });

  const edgeVisuals: EdgeVisual[] = graphData.edges.map((edge) => {
    const fromNode = graphData.nodeMap.get(edge.from);
    const toNode = graphData.nodeMap.get(edge.to);
    const baseColor =
      edge.kind === "hub"
        ? [0.67, 0.71, 0.8]
        : edge.kind === "domain"
          ? [0.33, 0.61, 0.96]
          : [0.91, 0.45, 0.82];
    const baseAlpha = edge.kind === "hub" ? 0.08 : edge.kind === "domain" ? 0.12 : 0.18;
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
  gl.canvas.className = "h-full w-full touch-none";

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
  let startTime = 0;

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
      if (!visual.mesh || visual.data.kind === "core") {
        continue;
      }

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
          visual.data.kind === "category" ? 18 : 10 + Math.round((visual.data.knowledge ?? 0.45) * 10),
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

    onPickNode(winner.id);
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

  const render = (time: number) => {
    animationFrame = window.requestAnimationFrame(render);

    if (!startTime) {
      startTime = time;
    }

    const elapsed = (time - startTime) / 1000;

    if (!isDragging && !prefersReducedMotion) {
      targetRotationY += 0.0018;
    }

    currentRotationX = mix(currentRotationX, targetRotationX, 0.09);
    currentRotationY = mix(currentRotationY, targetRotationY, 0.09);
    graph.rotation.x = currentRotationX;
    graph.rotation.y = currentRotationY;

    for (const visual of nodeVisuals) {
      if (!visual.mesh) {
        continue;
      }

      const [x, y, z] = visual.data.position;

      if (prefersReducedMotion) {
        visual.mesh.position.set(x, y, z);
        continue;
      }

      const hash = hashLabel(visual.data.id);
      const bobPhase = normalizeHash(hash) * Math.PI * 2;
      const drift = visual.data.kind === "category" ? 0.08 : 0.14;
      const lateral = visual.data.kind === "category" ? 0.05 : 0.08;

      visual.mesh.position.set(
        x + Math.cos(elapsed * 0.5 + bobPhase) * lateral,
        y + Math.sin(elapsed * 0.8 + bobPhase) * drift,
        z + Math.sin(elapsed * 0.45 + bobPhase) * lateral,
      );
    }

    renderer.render({ scene, camera, sort: false, frustumCull: false });
    updateProjectedNodes();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  resize();
  render(0);

  gl.canvas.addEventListener("pointerdown", onPointerDown);
  gl.canvas.addEventListener("pointermove", onPointerMove);
  gl.canvas.addEventListener("pointerup", onPointerUp);
  gl.canvas.addEventListener("pointercancel", onPointerUp);

  return {
    state,
    cleanup: () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      gl.canvas.removeEventListener("pointerdown", onPointerDown);
      gl.canvas.removeEventListener("pointermove", onPointerMove);
      gl.canvas.removeEventListener("pointerup", onPointerUp);
      gl.canvas.removeEventListener("pointercancel", onPointerUp);
      state.dispose();
    },
  };
}
