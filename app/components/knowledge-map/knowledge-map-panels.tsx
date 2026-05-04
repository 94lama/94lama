import type { GraphNode } from "@/app/components/knowledge-map/model";
import {
  sectionContinuityPendingClassName,
  sectionContinuityShellClassName,
  sectionChipClassName,
  sectionControlMotionClassName,
  sectionSkeletonBlockClassName,
} from "@/app/components/section-card-styles";
import type { SkillGroup } from "@/src/content/portfolio/types";

type KnowledgeMapDetailsPanelProps = {
  activeGroupIndex: number;
  mappedTechnologyCounts: number[];
  onFocusNode: (nodeId: string) => void;
  pending: boolean;
  pendingSelectedGroupNames: string[];
  pendingSelectedKindLabel: string;
  pendingSelectedKnowledgeValue: number | null;
  pendingSelectedLabel: string | null;
  pendingSelectedNeighborNodes: GraphNode[];
  selectedGroupNames: string[];
  selectedKindLabel: string;
  selectedKnowledgeValue: number | null;
  selectedLabel: string;
  selectedNeighborNodes: GraphNode[];
  skillGroups: SkillGroup[];
};

type KnowledgeMapCanvasShellProps = {
  children: React.ReactNode;
  mapReady: boolean;
  pending: boolean;
  prefersReducedMotion: boolean;
  resolvedSelectedNodeId: string;
};

export function KnowledgeMapDetailsPanel({
  activeGroupIndex,
  mappedTechnologyCounts,
  onFocusNode,
  pending,
  pendingSelectedGroupNames,
  pendingSelectedKindLabel,
  pendingSelectedKnowledgeValue,
  pendingSelectedLabel,
  pendingSelectedNeighborNodes,
  selectedGroupNames,
  selectedKindLabel,
  selectedKnowledgeValue,
  selectedLabel,
  selectedNeighborNodes,
  skillGroups,
}: Readonly<KnowledgeMapDetailsPanelProps>) {
  const activeGroup = skillGroups[activeGroupIndex] ?? skillGroups[0];
  const continuityLabel = pendingSelectedLabel ?? selectedLabel;
  const continuityKindLabel = pending ? pendingSelectedKindLabel : selectedKindLabel;
  const continuityGroups =
    pending && pendingSelectedGroupNames.length > 0
      ? pendingSelectedGroupNames
      : selectedGroupNames.length > 0
        ? selectedGroupNames
        : ["All fields"];
  const continuityKnowledgeValue = pending ? pendingSelectedKnowledgeValue : selectedKnowledgeValue;
  const continuityNeighborCount = pending
    ? pendingSelectedNeighborNodes.length
    : selectedNeighborNodes.length;

  return (
    <div
      className={`relative overflow-hidden rounded-4xl border border-black/10 bg-black/3 p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.55)] ${sectionContinuityShellClassName} ${pending ? sectionContinuityPendingClassName : ""} dark:border-white/10 dark:bg-white/4 sm:p-8`}
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_62%)] dark:bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.2),transparent_62%)]" />
      {pending ? (
        <div className="pointer-events-none absolute inset-x-6 top-6 z-10 flex items-center justify-between rounded-full border border-black/10 bg-white/78 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-black/48 backdrop-blur dark:border-white/10 dark:bg-slate-950/72 dark:text-white/52 sm:inset-x-8">
          <span>Continuity pending</span>
          <span>{pendingSelectedLabel ?? selectedLabel}</span>
        </div>
      ) : null}
      <div className="relative space-y-6">
        <div className="space-y-3">
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
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
                Current selection
              </p>
              <span className={`${sectionChipClassName} bg-black/4 text-black/55 dark:bg-white/4 dark:text-white/55`}>
                {continuityKindLabel}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-black dark:text-white">{continuityLabel}</p>
                <p className="text-sm text-black/60 dark:text-white/60">
                  {continuityNeighborCount} related points ready to inspect from the same
                  page state
                </p>
              </div>
              {continuityKnowledgeValue ? (
                <div className="flex justify-end">
                  <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/55 dark:border-white/10 dark:bg-black/20 dark:text-white/55">
                    <span>Knowledge</span>
                    <span className="inline-flex items-center gap-0.5 rounded-full border border-black/10 px-1.5 py-1 dark:border-white/10">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span
                          key={`knowledge-${index}`}
                          className={`h-2 w-1.5 rounded-full ${
                            index < continuityKnowledgeValue
                              ? "bg-black/60 dark:bg-white/70"
                              : "bg-black/12 dark:bg-white/12"
                          }`}
                        />
                      ))}
                    </span>
                    <span>{continuityKnowledgeValue}/5</span>
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {continuityGroups.map((groupName) => (
                <span
                  key={groupName}
                  className={`${sectionChipClassName} bg-white text-black/55 dark:bg-black/20 dark:text-white/55`}
                >
                  {groupName}
                </span>
              ))}
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
                  onClick={() => onFocusNode(node.id)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm shadow-sm ${sectionControlMotionClassName} ${
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

        <div className="grid gap-3 sm:grid-cols-2">
          {skillGroups.map((group, index) => {
            const isActive = index === activeGroupIndex;

            return (
              <button
                key={group.category}
                type="button"
                onClick={() => onFocusNode(`category-${index}`)}
                aria-pressed={isActive}
                className={`cursor-pointer rounded-2xl border px-4 py-3 text-left ${sectionControlMotionClassName} ${
                  isActive
                    ? "border-black/15 bg-black text-white dark:border-white/15 dark:bg-white dark:text-black"
                    : "border-black/10 bg-white/70 text-black/75 hover:border-black/20 dark:border-white/10 dark:bg-white/3 dark:text-white/75 dark:hover:border-white/20"
                }`}
              >
                <span className="block text-sm font-semibold">{group.category}</span>
                <span className="mt-1 block text-xs uppercase tracking-[0.18em] opacity-60">
                  {mappedTechnologyCounts[index] ?? group.items.length} mapped technologies
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
  mapReady,
  pending,
  prefersReducedMotion,
  resolvedSelectedNodeId,
}: Readonly<KnowledgeMapCanvasShellProps>) {
  return (
    <div
      className="relative overflow-hidden rounded-4xl border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,247,250,0.78))] p-4 shadow-[0_35px_120px_-70px_rgba(37,99,235,0.45)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.78))] sm:p-6 flex flex-col xl:h-full"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_46%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_30%)]" />
      <div className="relative flex-1 overflow-hidden rounded-[1.6rem] border border-black/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.84),rgba(226,232,240,0.35),rgba(148,163,184,0.08))] dark:border-white/10 dark:bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.8),rgba(15,23,42,0.42),rgba(2,6,23,0.12))]">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 ${
            mapReady ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,219,254,0.42),rgba(255,255,255,0.24),transparent_72%)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.24),rgba(15,23,42,0.16),transparent_72%)]" />
          <div className="absolute inset-x-8 top-18 h-12 rounded-full border border-black/8 bg-white/60 dark:border-white/8 dark:bg-white/4" />
          <div className={`absolute inset-x-12 top-1/2 h-40 -translate-y-1/2 rounded-full ${sectionSkeletonBlockClassName}`} />
          <div className={`absolute inset-x-10 bottom-8 h-14 ${sectionSkeletonBlockClassName}`} />
        </div>
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

        <div className={`absolute inset-0 ${sectionContinuityShellClassName} ${pending ? sectionContinuityPendingClassName : ""}`}>
          {children}
        </div>

        {!mapReady || pending ? (
          <div className="pointer-events-none absolute right-5 top-16 z-10 rounded-full border border-black/10 bg-white/72 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-black/50 backdrop-blur dark:border-white/10 dark:bg-slate-950/68 dark:text-white/50 sm:right-6">
            {!mapReady ? "Map readying" : "Continuity handoff"}
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 rounded-2xl border border-black/10 bg-white/60 px-4 py-3 text-xs uppercase tracking-[0.22em] text-black/45 backdrop-blur dark:border-white/10 dark:bg-white/4 dark:text-white/45 sm:inset-x-6 sm:bottom-6">
          Tap any point to move related experience higher in section 02.
        </div>
      </div>

      <div className="flex-none mt-4 h-28 sm:h-32 rounded-[1.4rem] border border-black/10 bg-white/60 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-white/4 sm:px-5">
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
            <p>Skill knowledge = battery level</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "1/5", filled: 1 },
                { label: "3/5", filled: 3 },
                { label: "5/5", filled: 5 },
              ].map((level) => (
                <span key={level.label} className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center gap-0.5 rounded-full border border-black/10 px-1.5 py-1 dark:border-white/10">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={`${level.label}-${index}`}
                        className={`h-2 w-1.5 rounded-full ${
                          index < level.filled
                            ? "bg-black/60 dark:bg-white/70"
                            : "bg-black/12 dark:bg-white/12"
                        }`}
                      />
                    ))}
                  </span>
                  {level.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
