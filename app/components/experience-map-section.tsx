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
  // Optional controlled selection from parent
  selection?: KnowledgeMapSelection;
  onSelectionChange?: (selection: KnowledgeMapSelection) => void;
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
  selection: controlledSelection,
  onSelectionChange,
}: Readonly<ExperienceMapSectionProps>) {
  const [uncontrolledSelection, setUncontrolledSelection] = useState<KnowledgeMapSelection>(() =>
    createInitialSelection(skillGroups),
  );
  const selection = controlledSelection ?? uncontrolledSelection;
  const setSelection = onSelectionChange ?? setUncontrolledSelection;

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

  const activeGroup =
    safeSelection.activeIndex >= 0 ? skillGroups[safeSelection.activeIndex] : undefined;

  const selectionTerms = useMemo(() => {
    if (safeSelection.kind === 'skill') {
      return [safeSelection.label];
    }

    if (safeSelection.kind === 'category') {
      return activeGroup?.items ?? [];
    }

    return [];
  }, [activeGroup, safeSelection]);

  const filteredExperience = useMemo(() => {
    const normalize = (value: string) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (safeSelection.kind === 'core' || selectionTerms.length === 0) {
      return {
        entries: experience,
        isFallback: true,
        helperCopy: 'Showing the full experience timeline. Select a skill or category to narrow it down.',
      };
    }

    const normalizedTerms = selectionTerms.map(normalize).filter(Boolean);
    const matches = experience.filter((entry) => {
      const haystack = normalize(`${entry.role} ${entry.company} ${entry.highlights.join(' ')}`);

      return normalizedTerms.some((term) => haystack.includes(term));
    });

    if (matches.length === 0) {
      return {
        entries: experience,
        isFallback: true,
        helperCopy:
          safeSelection.kind === 'skill'
            ? `No experience entry mentions ${safeSelection.label} directly yet, so the full timeline is shown instead.`
            : `No experience entry mentions this ${safeSelection.label} skill cluster directly yet, so the full timeline is shown instead.`,
      };
    }

    return {
      entries: matches,
      isFallback: false,
      helperCopy:
        safeSelection.kind === 'skill'
          ? `Showing experience entries that mention ${safeSelection.label}.`
          : `Showing experience entries connected to ${safeSelection.label} skills.`,
    };
  }, [experience, safeSelection, selectionTerms]);

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
            {filteredExperience.helperCopy}
          </p>
        </div>

        <div className="space-y-8">
          {filteredExperience.entries.map((entry) => (
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

        {filteredExperience.isFallback ? null : (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45 dark:text-white/45">
            {filteredExperience.entries.length} matching experience item
            {filteredExperience.entries.length === 1 ? '' : 's'}
          </p>
        )}
      </section>
    </div>
  );
}
