import type { KnowledgeMapSelection } from "./knowledge-map-selection.ts";
import type { ExperienceEntry, SkillGroup } from "./types.ts";

export type RankedExperienceEntry = {
  entry: ExperienceEntry;
  matchScore: number;
  isHighlighted: boolean;
  matchedTerms: string[];
  originalIndex: number;
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSelectionTerms(selection: KnowledgeMapSelection, skillGroups: SkillGroup[]) {
  if (selection.kind === "skill") {
    return [selection.label];
  }

  if (selection.kind === "category") {
    const activeGroup =
      selection.activeIndex >= 0 && selection.activeIndex < skillGroups.length
        ? skillGroups[selection.activeIndex]
        : undefined;

    return activeGroup?.items ?? [];
  }

  return [];
}

function getOverviewCopy() {
  return "Showing the full experience timeline. Select a skill or category to move related entries higher.";
}

function getMatchedCopy(selection: KnowledgeMapSelection) {
  if (selection.kind === "skill") {
    return `Showing experience entries related to ${selection.label} while keeping the full timeline visible.`;
  }

  return `Showing experience entries connected to ${selection.label} while keeping the full timeline visible.`;
}

function getFallbackCopy(selection: KnowledgeMapSelection) {
  if (selection.kind === "skill") {
    return `No experience entry mentions ${selection.label} directly yet, so the full timeline remains visible.`;
  }

  return `No experience entry mentions this ${selection.label} skill cluster directly yet, so the full timeline remains visible.`;
}

export function rankExperienceBySelection(args: {
  experience: ExperienceEntry[];
  selection: KnowledgeMapSelection;
  skillGroups: SkillGroup[];
}): {
  entries: RankedExperienceEntry[];
  helperCopy: string;
  isFallback: boolean;
} {
  const selectionTerms = getSelectionTerms(args.selection, args.skillGroups);
  const normalizedTerms = selectionTerms
    .map((term) => ({ original: term, normalized: normalizeText(term) }))
    .filter((term) => term.normalized);

  const entries = args.experience.map((entry, originalIndex) => {
    const haystack = normalizeText(
      [entry.role, entry.company, ...entry.highlights].join(" "),
    );
    const matchedTerms = normalizedTerms
      .filter((term) => haystack.includes(term.normalized))
      .map((term) => term.original);

    return {
      entry,
      matchScore: matchedTerms.length,
      isHighlighted: matchedTerms.length > 0,
      matchedTerms,
      originalIndex,
    };
  });

  if (args.selection.kind === "core" || normalizedTerms.length === 0) {
    return {
      entries,
      helperCopy: getOverviewCopy(),
      isFallback: true,
    };
  }

  const hasMatches = entries.some((entry) => entry.matchScore > 0);

  if (!hasMatches) {
    return {
      entries,
      helperCopy: getFallbackCopy(args.selection),
      isFallback: true,
    };
  }

  return {
    entries: [...entries].sort((left, right) => {
      if (right.matchScore !== left.matchScore) {
        return right.matchScore - left.matchScore;
      }

      return left.originalIndex - right.originalIndex;
    }),
    helperCopy: getMatchedCopy(args.selection),
    isFallback: false,
  };
}
