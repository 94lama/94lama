import type { ExperienceEntry } from "@/src/content/portfolio/types";
import {
  sectionBodyToneClassName,
  sectionCardClassName,
  sectionChipClassName,
  sectionContinuityPendingClassName,
  sectionContinuityShellClassName,
  sectionControlMotionClassName,
  sectionEyebrowToneClassName,
  sectionTitleToneClassName,
} from "@/components/section-card-styles";

type ExperienceCardProps = {
  entry: ExperienceEntry;
  index: number;
  isHighlighted: boolean;
  matchScore: number;
  matchedTerms: string[];
  pending: boolean;
};

export function ExperienceCard({
  entry,
  index,
  isHighlighted,
  matchScore,
  matchedTerms,
  pending,
}: Readonly<ExperienceCardProps>) {
  return (
    <article
      className={`${sectionCardClassName} ${sectionContinuityShellClassName} ${pending ? sectionContinuityPendingClassName : ""} rounded-[1.75rem] px-5 py-4 sm:px-6 sm:py-5 xl:px-6 ${
        isHighlighted
          ? "border-accent/35 bg-[linear-gradient(180deg,rgba(96,165,250,0.12),rgba(255,255,255,0.94))] shadow-[0_18px_60px_-40px_rgba(37,99,235,0.28)] dark:bg-[linear-gradient(180deg,rgba(96,165,250,0.12),rgba(15,23,42,0.86))] dark:shadow-none"
          : ""
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`${sectionChipClassName} inline-flex min-h-9 min-w-9 items-center justify-center bg-black/4 px-0 py-0 text-[0.7rem] text-slate-500 dark:bg-white/4 dark:text-white/48`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className={`font-mono text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}>
              {entry.dateRange}
            </p>
          </div>

          <div className="flex items-start gap-4">
            <div>
              <p className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${sectionEyebrowToneClassName}`}>
                {entry.company}
              </p>
              <h3 className={`text-xl font-semibold tracking-tight sm:text-[1.25rem] ${sectionTitleToneClassName}`}>
                {entry.role}
              </h3>
            </div>

            {isHighlighted ? (
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border border-accent/35 bg-accent/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent ${sectionControlMotionClassName}`}
                >
                  Match score {matchScore}
                </span>
                {matchedTerms.map((term) => (
                  <span key={`${entry.company}-${term}`} className={sectionChipClassName}>
                    {term}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <ul className={`mt-2 text-base leading-7 ${sectionBodyToneClassName}`}>
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 py-1">
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  isHighlighted ? "bg-accent" : "bg-slate-300 dark:bg-white/24"
                }`}
              />
              <span className="w-full">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
