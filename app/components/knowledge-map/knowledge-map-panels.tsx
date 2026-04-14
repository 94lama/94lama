import type { GraphNode } from "@/app/components/knowledge-map/model";
import { getEntranceStyle } from "@/app/components/knowledge-map/runtime";
import type { SkillGroup } from "@/src/content/portfolio/types";

type KnowledgeMapDetailsPanelProps = {
  activeGroupIndex: number;
  onFocusNode: (nodeId: string) => void;
  prefersReducedMotion: boolean;
  resolvedSelectedNodeId: string;
  selectedGroupNames: string[];
  selectedKindLabel: string;
  selectedKnowledgeLabel: string | null;
  selectedLabel: string;
  selectedNeighborNodes: GraphNode[];
  skillGroups: SkillGroup[];
};

type KnowledgeMapCanvasShellProps = {
  children: React.ReactNode;
  prefersReducedMotion: boolean;
  resolvedSelectedNodeId: string;
};

export function KnowledgeMapDetailsPanel({
  activeGroupIndex,
  onFocusNode,
  prefersReducedMotion,
  resolvedSelectedNodeId,
  selectedGroupNames,
  selectedKindLabel,
  selectedKnowledgeLabel,
  selectedLabel,
  selectedNeighborNodes,
  skillGroups,
}: Readonly<KnowledgeMapDetailsPanelProps>) {
  const activeGroup = skillGroups[activeGroupIndex] ?? skillGroups[0];

  return (
    <div
      className="relative overflow-hidden rounded-4xl border border-black/10 bg-black/3 p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.55)] dark:border-white/10 dark:bg-white/4 sm:p-8"
      style={getEntranceStyle(prefersReducedMotion)}
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_62%)] dark:bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.2),transparent_62%)]" />
      <div className="relative space-y-6">
        <div className="space-y-3" style={getEntranceStyle(prefersReducedMotion, 75)}>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
            Primary skills surface
          </p>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight text-black dark:text-white sm:text-3xl">
              Trace the skills behind the experience timeline.
            </h3>
            <p className="max-w-xl text-sm leading-7 text-black/65 dark:text-white/65 sm:text-base">
              Use section 01 as the main skills surface, then move related roles higher in
              section 02 without losing the full timeline.
            </p>
          </div>
        </div>

        <div
          className="rounded-[1.4rem] border border-black/10 bg-white/65 p-4 dark:border-white/10 dark:bg-white/4"
          style={getEntranceStyle(prefersReducedMotion, 150)}
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
            Current selection
          </p>
          <div className="mt-2 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-black dark:text-white">{selectedLabel}</p>
                <p className="text-sm text-black/60 dark:text-white/60">
                  {selectedNeighborNodes.length} related points ready to inspect from the same
                  page state
                </p>
              </div>
              <span className="rounded-full border border-black/10 bg-black/4 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/55 dark:border-white/10 dark:bg-white/4 dark:text-white/55">
                {selectedKindLabel}
              </span>
            </div>

            {resolvedSelectedNodeId !== "core" ? (
              <button
                type="button"
                onClick={() => onFocusNode("core")}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/55 transition-colors hover:border-black/20 dark:border-white/10 dark:bg-black/20 dark:text-white/55 dark:hover:border-white/20"
              >
                Reset to overview
              </button>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {(selectedGroupNames.length > 0 ? selectedGroupNames : ["All fields"]).map((groupName) => (
                <span
                  key={groupName}
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/55 transition-[opacity,transform] duration-300 dark:border-white/10 dark:bg-black/20 dark:text-white/55"
                >
                  {groupName}
                </span>
              ))}
              {selectedKnowledgeLabel ? (
                <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/55 transition-[opacity,transform] duration-300 dark:border-white/10 dark:bg-black/20 dark:text-white/55">
                  {selectedKnowledgeLabel}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-3" style={getEntranceStyle(prefersReducedMotion, 200)}>
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
                  onClick={() => onFocusNode(node.id)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm shadow-sm transition-[opacity,transform,colors] duration-200 hover:-translate-y-0.5 ${
                    node.kind === "category"
                      ? "border-black/10 bg-black/4 text-black/75 dark:border-white/10 dark:bg-white/6 dark:text-white/75"
                      : "border-black/10 bg-white text-black/75 dark:border-white/10 dark:bg-black/20 dark:text-white/75"
                  }`}
                >
                  {node.label}
                </button>
              ))
            ) : (
              <p className="text-sm leading-7 text-black/60 dark:text-white/60">
                Start from the overview or select a point to inspect the domains and
                technologies connected to it.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2" style={getEntranceStyle(prefersReducedMotion, 300)}>
          {skillGroups.map((group, index) => {
            const isActive = index === activeGroupIndex;

            return (
              <button
                key={group.category}
                type="button"
                onClick={() => onFocusNode(`category-${index}`)}
                aria-pressed={isActive}
                className={`cursor-pointer rounded-2xl border px-4 py-3 text-left transition-[opacity,transform,colors] duration-300 hover:-translate-y-0.5 ${
                  isActive
                    ? "border-black/15 bg-black text-white dark:border-white/15 dark:bg-white dark:text-black"
                    : "border-black/10 bg-white/70 text-black/75 hover:border-black/20 dark:border-white/10 dark:bg-white/3 dark:text-white/75 dark:hover:border-white/20"
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
  );
}

export function KnowledgeMapCanvasShell({
  children,
  prefersReducedMotion,
  resolvedSelectedNodeId,
}: Readonly<KnowledgeMapCanvasShellProps>) {
  return (
    <div
      className="relative overflow-hidden rounded-4xl border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,247,250,0.78))] p-4 shadow-[0_35px_120px_-70px_rgba(37,99,235,0.45)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.78))] sm:p-6"
      style={getEntranceStyle(prefersReducedMotion, 100)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_46%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_30%)]" />
      <div className="relative h-96 overflow-hidden rounded-[1.6rem] border border-black/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.84),rgba(226,232,240,0.35),rgba(148,163,184,0.08))] dark:border-white/10 dark:bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.8),rgba(15,23,42,0.42),rgba(2,6,23,0.12))] sm:h-120">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12),transparent_62%)] transition-opacity duration-500 dark:bg-[radial-gradient(circle,rgba(96,165,250,0.18),transparent_62%)] ${
            resolvedSelectedNodeId === "core" ? "opacity-45" : "opacity-75"
          } ${prefersReducedMotion ? "duration-0" : ""}`}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-5 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45 sm:px-6 sm:py-5">
          <span>3D knowledge map</span>
          <span>Drag to rotate</span>
        </div>

        {children}

        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 rounded-2xl border border-black/10 bg-white/60 px-4 py-3 text-xs uppercase tracking-[0.22em] text-black/45 backdrop-blur dark:border-white/10 dark:bg-white/4 dark:text-white/45 sm:inset-x-6 sm:bottom-6">
          Tap any point to move related experience higher in section 02.
        </div>
      </div>
      <div className="rounded-[1.4rem] border border-black/10 bg-white/60 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-white/4 sm:px-5 xl:col-start-2">
        <div className="flex flex-col gap-3 text-[0.68rem] uppercase tracking-[0.22em] text-black/45 dark:text-white/45 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p>Link legend</p>
            <div className="flex flex-wrap gap-3 text-[0.62rem]">
              <span className="inline-flex items-center gap-2">
                <span className="h-px w-5 bg-[rgb(171,181,204)]" />
                Hub
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-px w-5 bg-[rgb(84,156,245)]" />
                Domain
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-px w-5 bg-[rgb(232,115,209)]" />
                Technology
              </span>
            </div>
          </div>

          <div className="space-y-2 text-[0.62rem]">
            <p>Dot size = skill knowledge</p>
            <div className="flex items-end gap-3">
              <span className="inline-flex items-end gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-black/50 dark:bg-white/55" />
                1/5
              </span>
              <span className="inline-flex items-end gap-1.5">
                <span className="h-3.5 w-3.5 rounded-full bg-black/55 dark:bg-white/60" />
                3/5
              </span>
              <span className="inline-flex items-end gap-1.5">
                <span className="h-5 w-5 rounded-full bg-black/60 dark:bg-white/70" />
                5/5
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
