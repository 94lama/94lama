import type { ExperienceEntry, SkillGroup } from "./types.ts";

export type KnowledgeMapSelection = {
  id: string;
  label: string;
  kind: "core" | "category" | "skill";
  activeIndex: number;
};

export type RankedExperienceEntry = {
  entry: ExperienceEntry;
  matchScore: number;
  isHighlighted: boolean;
  matchedTerms: string[];
  originalIndex: number;
};

export function rankExperienceBySelection(args: {
  experience: ExperienceEntry[];
  selection: KnowledgeMapSelection;
  skillGroups: SkillGroup[];
}): {
  entries: RankedExperienceEntry[];
  helperCopy: string;
  isFallback: boolean;
} {
  void args;

  throw new Error("Not implemented.");
}
