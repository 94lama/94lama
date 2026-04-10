'use client';

import { useMemo, useState } from 'react';

import {
  SkillsKnowledgeMap,
  type KnowledgeMapSelection,
} from '@/app/components/skills-knowledge-map';
import type { ExperienceEntry, SkillGroup } from '@/src/content/portfolio/types';

type ExperienceMapSectionProps = {
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

export function ExperienceMapSection({
  skillGroups,
  experience,
}: Readonly<ExperienceMapSectionProps>) {
  const [selection, setSelection] = useState<KnowledgeMapSelection>(() =>
    createInitialSelection(skillGroups),
  );

  const safeSelection = useMemo(() => {
    if (skillGroups.length === 0) {
      return createInitialSelection(skillGroups);
    }

    return {
      ...selection,
      activeIndex:
        selection.activeIndex >= 0 && selection.activeIndex < skillGroups.length
          ? selection.activeIndex
          : 0,
    };
  }, [selection, skillGroups]);

  return (
    <div className="space-y-10">
      <section className="space-y-4 border-t border-black/10 pt-8 dark:border-white/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-black/60 dark:text-white/60">
          Skills
        </h2>
        <SkillsKnowledgeMap
          activeIndex={safeSelection.activeIndex}
          onSelectionChange={setSelection}
          selectedNodeId={safeSelection.id}
          skillGroups={skillGroups}
        />
      </section>

      <section className="space-y-4 border-t border-black/10 pt-8 dark:border-white/10">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-black/60 dark:text-white/60">
            Experience
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-black/60 dark:text-white/60">
            Experience evidence is ready to follow the knowledge-map selection.
          </p>
        </div>

        <div className="space-y-8">
          {experience.map((entry) => (
            <article key={`${entry.role}-${entry.company}-${entry.dateRange}`} className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  {entry.role} <span className="text-black/50 dark:text-white/50">at</span>{' '}
                  {entry.company}
                </h3>
                <p className="text-sm uppercase tracking-[0.15em] text-black/55 dark:text-white/55">
                  {entry.dateRange}
                </p>
              </div>
              <ul className="space-y-2 pl-5 text-base leading-7 text-black/75 marker:text-black/40 dark:text-white/75 dark:marker:text-white/40">
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
