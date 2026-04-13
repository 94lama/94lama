export type KnowledgeMapSelection = {
  id: string;
  label: string;
  kind: "core" | "category" | "skill";
  activeIndex: number;
};
