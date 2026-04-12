import type { ExperienceEntry } from "@/src/content/portfolio/types";
import {
  sectionBodyToneClassName,
  sectionCardClassName,
  sectionChipClassName,
  sectionEyebrowToneClassName,
  sectionTitleToneClassName,
} from "@/app/components/section-card-styles";

type ExperienceCardProps = {
  entry: ExperienceEntry;
  index: number;
  isHighlighted: boolean;
  matchScore: number;
  matchedTerms: string[];
};

export function ExperienceCard({
  entry,
  index,
  isHighlighted,
  matchScore,
  matchedTerms,
}: Readonly<ExperienceCardProps>) {
  return (
    <article
      className={`${sectionCardClassName} rounded-[1.75rem] px-5 py-6 sm:px-6 sm:py-7 xl:px-8 ${
        isHighlighted
          ? "border-accent/35 bg-[linear-gradient(180deg,rgba(96,165,250,0.18),rgba(255,255,255,0.94))] shadow-[0_24px_80px_-56px_rgba(37,99,235,0.34)] dark:bg-[linear-gradient(180deg,rgba(96,165,250,0.18),rgba(15,23,42,0.86))] dark:shadow-none"
          : ""
      }`}
    >
      <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="flex items-start gap-4 lg:flex-col lg:gap-8">
          <span className={`${sectionChipClassName} inline-flex min-h-11 min-w-11 items-center justify-center bg-black/4 px-0 py-0 text-[0.7rem] text-slate-500 dark:bg-white/4 dark:text-white/48`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <p
            className={`font-mono text-[0.72rem] font-semibold uppercase tracking-[0.24em] lg:max-w-40 ${sectionEyebrowToneClassName}`}
          >
            {entry.dateRange}
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p
                className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
              >
                {entry.company}
              </p>
              <h3
                className={`text-3xl font-semibold tracking-tight sm:text-[2.2rem] ${sectionTitleToneClassName}`}
              >
                {entry.role}
              </h3>
            </div>

            {isHighlighted ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-accent/35 bg-accent/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
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

          <ul className={`space-y-3 text-base leading-7 ${sectionBodyToneClassName}`}>
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span
                  className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                    isHighlighted ? "bg-accent" : "bg-slate-300 dark:bg-white/24"
                  }`}
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
