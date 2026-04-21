import type { KnowledgeMapSelection } from "./knowledge-map-selection.ts";
import type { ExperienceEntry } from "./types.ts";

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

function getOverviewCopy() {
  return "Showing the full experience timeline. Select a skill or category to move related entries higher.";
}

function getMatchedCopy(selection: KnowledgeMapSelection) {
  if (selection.kind === "skill") {
    return `Showing experience entries mapped to ${selection.label} while keeping the full timeline visible.`;
  }

  return `Showing experience entries connected to ${selection.label} while keeping the full timeline visible.`;
}

function getFallbackCopy(selection: KnowledgeMapSelection) {
  if (selection.kind === "skill") {
    return `No experience entry is mapped to ${selection.label} yet, so the full timeline remains visible.`;
  }

  return `No experience entry is mapped to the ${selection.label} domain or its related skill points yet, so the full timeline remains visible.`;
}

export function rankExperienceBySelection(args: {
  experience: ExperienceEntry[];
  selection: KnowledgeMapSelection;
  selectionSkillLabels: string[];
}): {
  entries: RankedExperienceEntry[];
  helperCopy: string;
  isFallback: boolean;
} {
  const normalizedSelectionSkills = args.selectionSkillLabels
    .map((term) => ({ original: term, normalized: normalizeText(term) }))
    .filter((term) => term.normalized);
  const normalizedSelectionSkillSet = new Set(
    normalizedSelectionSkills.map((term) => term.normalized),
  );
  const normalizedSelectionDomain =
    args.selection.kind === "category" ? normalizeText(args.selection.label) : "";

  const entries = args.experience.map((entry, originalIndex) => {
    const matchedTerms: string[] = [];
    const seenTerms = new Set<string>();

    for (const relatedDomain of entry.relatedDomains ?? []) {
      const normalizedDomain = normalizeText(relatedDomain);

      if (
        args.selection.kind !== "category" ||
        !normalizedSelectionDomain ||
        normalizedDomain !== normalizedSelectionDomain ||
        seenTerms.has(normalizedDomain)
      ) {
        continue;
      }

      seenTerms.add(normalizedDomain);
      matchedTerms.push(relatedDomain);
    }

    for (const relatedSkill of entry.relatedSkills ?? []) {
      const normalizedSkill = normalizeText(relatedSkill);

      if (
        !normalizedSkill ||
        !normalizedSelectionSkillSet.has(normalizedSkill) ||
        seenTerms.has(normalizedSkill)
      ) {
        continue;
      }

      seenTerms.add(normalizedSkill);
      matchedTerms.push(relatedSkill);
    }

    return {
      entry,
      matchScore: matchedTerms.length,
      isHighlighted: matchedTerms.length > 0,
      matchedTerms,
      originalIndex,
    };
  });

  if (
    args.selection.kind === "core" ||
    (args.selection.kind === "skill" && normalizedSelectionSkillSet.size === 0) ||
    (args.selection.kind === "category" && !normalizedSelectionDomain && normalizedSelectionSkillSet.size === 0)
  ) {
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
