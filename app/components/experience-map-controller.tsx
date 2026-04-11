"use client";

import { useState, useEffect } from 'react';

import { ExperienceMapSection } from '@/app/components/experience-map-section';
import type { KnowledgeMapSelection } from '@/app/components/skills-knowledge-map';
import type { ExperienceEntry, SkillGroup } from '@/src/content/portfolio/types';

type Props = {
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
};

function createInitialSelection(skillGroups: SkillGroup[]): KnowledgeMapSelection {
  return {
    id: 'core',
    label: 'Core Skills',
    kind: 'core',
    activeIndex: skillGroups[0] ? 0 : -1,
  };
}

export function ExperienceMapController({ skillGroups, experience }: Props) {
  const [selection, setSelection] = useState<KnowledgeMapSelection>(() =>
    createInitialSelection(skillGroups),
  );

  // If skillGroups change shape, ensure selection stays valid
  useEffect(() => {
    if (!skillGroups || skillGroups.length === 0) {
      setSelection(createInitialSelection(skillGroups));
      return;
    }

    setSelection((prev) => {
      if (prev.activeIndex >= 0 && prev.activeIndex < skillGroups.length) {
        return prev;
      }

      return createInitialSelection(skillGroups);
    });
  }, [skillGroups]);

  return (
    <ExperienceMapSection
      skillGroups={skillGroups}
      experience={experience}
      selection={selection}
      onSelectionChange={setSelection}
    />
  );
}
