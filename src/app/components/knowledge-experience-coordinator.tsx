"use client";

import { useMemo, useState } from "react";

import {
  createKnowledgeMapGraph,
} from "@/src/app/components/knowledge-map/model";
import {
  getSelectionTriggerSkillLabels,
} from "@/src/app/components/knowledge-map/selection";
import {
  SkillsKnowledgeMap,
  type KnowledgeMapSelection,
} from "@/src/app/components/skills-knowledge-map";
import { ExperienceTimelineSection } from "@/src/app/components/experience-timeline-section";
import { pageRhythm } from "@/src/app/components/layout/page-rhythm";
import { SectionHeading } from "@/src/app/components/section-heading";
import { rankExperienceBySelection } from "@/src/content/portfolio/rank-experience-by-selection";
import type { ExperienceEntry, SkillGroup } from "@/src/content/portfolio/types";

type KnowledgeExperienceCoordinatorProps = {
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
};

type ContinuityState = {
  activeSelection: KnowledgeMapSelection;
  pendingSelection: KnowledgeMapSelection | null;
};

function createRootSelection(skillGroups: SkillGroup[]): KnowledgeMapSelection {
  return {
    id: "core",
    label: "Knowledge Graph",
    kind: "core",
    activeIndex: skillGroups[0] ? 0 : -1,
  };
}

export function KnowledgeExperienceCoordinator({
  skillGroups,
  experience,
}: Readonly<KnowledgeExperienceCoordinatorProps>) {
  const [continuityState, setContinuityState] = useState<ContinuityState>(() => {
    const rootSelection = createRootSelection(skillGroups);

    return {
      activeSelection: rootSelection,
      pendingSelection: null,
    };
  });

  const safeSelection = useMemo(() => {
    const selection = continuityState.activeSelection;

    if (skillGroups.length === 0) {
      return createRootSelection(skillGroups);
    }

    return {
      ...selection,
      activeIndex:
        selection.activeIndex >= 0 && selection.activeIndex < skillGroups.length
          ? selection.activeIndex
          : 0,
    };
  }, [continuityState.activeSelection, skillGroups]);

  const safePendingSelection = useMemo(() => {
    const selection = continuityState.pendingSelection;

    if (!selection) {
      return null;
    }

    if (skillGroups.length === 0) {
      return createRootSelection(skillGroups);
    }

    return {
      ...selection,
      activeIndex:
        selection.activeIndex >= 0 && selection.activeIndex < skillGroups.length
          ? selection.activeIndex
          : 0,
    };
  }, [continuityState.pendingSelection, skillGroups]);

  const graphData = useMemo(() => createKnowledgeMapGraph(skillGroups), [skillGroups]);

  const selectedSkillLabels = useMemo(
    () => getSelectionTriggerSkillLabels(graphData, safeSelection.id),
    [graphData, safeSelection.id],
  );

  const pendingSkillLabels = useMemo(
    () =>
      safePendingSelection
        ? getSelectionTriggerSkillLabels(graphData, safePendingSelection.id)
        : [],
    [graphData, safePendingSelection],
  );

  const rankedExperience = useMemo(
    () =>
      rankExperienceBySelection({
        experience,
        selection: safeSelection,
        selectionSkillLabels: selectedSkillLabels,
      }),
    [experience, safeSelection, selectedSkillLabels],
  );

  const pendingExperience = useMemo(
    () =>
      safePendingSelection
        ? rankExperienceBySelection({
            experience,
            selection: safePendingSelection,
            selectionSkillLabels: pendingSkillLabels,
          })
        : null,
    [experience, pendingSkillLabels, safePendingSelection],
  );

  const handleSelectionChange = (nextSelection: KnowledgeMapSelection) => {
    setContinuityState((currentState) => {
      if (currentState.activeSelection.id === nextSelection.id) {
        return {
          activeSelection: nextSelection,
          pendingSelection: null,
        };
      }

      return {
        activeSelection: currentState.activeSelection,
        pendingSelection: nextSelection,
      };
    });
  };

  const handleSelectionSettled = (selection: KnowledgeMapSelection) => {
    setContinuityState((currentState) => {
      if (currentState.pendingSelection?.id !== selection.id) {
        return currentState;
      }

      return {
        activeSelection: selection,
        pendingSelection: null,
      };
    });
  };

  return (
    <div className={pageRhythm.proofBlock}>
      <section className="space-y-7 lg:space-y-8">
        <SectionHeading
          index="01"
          title="Skills"
          description="Use the knowledge map as the primary skills surface and trace how each domain connects to the experience timeline below."
        />

        <SkillsKnowledgeMap
          activeIndex={safeSelection.activeIndex}
          onSelectionChange={handleSelectionChange}
          onSelectionSettled={handleSelectionSettled}
          pendingSelection={safePendingSelection}
          selectedNodeId={safeSelection.id}
          skillGroups={skillGroups}
        />
      </section>

      <section className="space-y-7 lg:space-y-8 xl:ml-[75vw] xl:w-[25vw] xl:pr-6">
        <SectionHeading
          index="02"
          title="Experience"
          description="Every experience entry stays visible while related roles move higher and receive emphasis from the same map selection state."
        />

        <ExperienceTimelineSection
          entries={rankedExperience.entries}
          helperCopy={rankedExperience.helperCopy}
          isFallback={rankedExperience.isFallback}
          pendingHelperCopy={pendingExperience?.helperCopy ?? null}
          pendingSelectionLabel={safePendingSelection?.label ?? null}
          pendingSelectionKind={safePendingSelection?.kind ?? null}
          pending={safePendingSelection !== null}
        />
      </section>
    </div>
  );
}
