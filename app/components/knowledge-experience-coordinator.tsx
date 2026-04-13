"use client";

import { useMemo, useState } from "react";

import {
  SkillsKnowledgeMap,
  type KnowledgeMapSelection,
} from "@/app/components/skills-knowledge-map";
import { ExperienceTimelineSection } from "@/app/components/experience-timeline-section";
import { SectionHeading } from "@/app/components/section-heading";
import { rankExperienceBySelection } from "@/src/content/portfolio/rank-experience-by-selection";
import type { ExperienceEntry, SkillGroup } from "@/src/content/portfolio/types";

type KnowledgeExperienceCoordinatorProps = {
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
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
  const [selection, setSelection] = useState<KnowledgeMapSelection>(() =>
    createRootSelection(skillGroups),
  );

  const safeSelection = useMemo(() => {
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
  }, [selection, skillGroups]);

  const rankedExperience = useMemo(
    () =>
      rankExperienceBySelection({
        experience,
        selection: safeSelection,
        skillGroups,
      }),
    [experience, safeSelection, skillGroups],
  );

  return (
    <div className="space-y-12 lg:space-y-16">
      <section className="space-y-8 lg:space-y-10">
        <SectionHeading
          index="01"
          title="Skills"
          description="Use the knowledge map as the primary skills surface and trace how each domain connects to the experience timeline below."
        />

        <SkillsKnowledgeMap
          activeIndex={safeSelection.activeIndex}
          onSelectionChange={setSelection}
          selectedNodeId={safeSelection.id}
          skillGroups={skillGroups}
        />
      </section>

      <section className="space-y-8 lg:space-y-10">
        <SectionHeading
          index="02"
          title="Experience"
          description="Every experience entry stays visible while related roles move higher and receive emphasis from the same map selection state."
        />

        <ExperienceTimelineSection
          entries={rankedExperience.entries}
          helperCopy={rankedExperience.helperCopy}
          isFallback={rankedExperience.isFallback}
        />
      </section>
    </div>
  );
}
