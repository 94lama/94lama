import { ExperienceCard } from "@/app/components/experience-card";
import type { RankedExperienceEntry } from "@/src/content/portfolio/rank-experience-by-selection";

type ExperienceTimelineSectionProps = {
  entries: RankedExperienceEntry[];
  helperCopy: string;
  isFallback: boolean;
};

export function ExperienceTimelineSection({
  entries,
  helperCopy,
  isFallback,
}: Readonly<ExperienceTimelineSectionProps>) {
  const highlightedCount = entries.filter((entry) => entry.isHighlighted).length;

  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/4 p-5">
        <p className="max-w-3xl text-sm leading-7 text-white/68">{helperCopy}</p>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
          {isFallback
            ? "Full timeline visible"
            : `${highlightedCount} related entr${highlightedCount === 1 ? "y" : "ies"} moved to the top`}
        </p>
      </div>

      <div className="space-y-5">
        {entries.map((item, index) => (
          <ExperienceCard
            key={`${item.entry.role}-${item.entry.company}-${item.entry.dateRange}`}
            entry={item.entry}
            index={index}
            isHighlighted={item.isHighlighted}
            matchScore={item.matchScore}
            matchedTerms={item.matchedTerms}
          />
        ))}
      </div>
    </div>
  );
}
