import type { ExperienceEntry } from "@/src/content/portfolio/types";

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
      className={`rounded-[1.75rem] border px-5 py-6 transition-colors sm:px-6 sm:py-7 xl:px-8 ${
        isHighlighted
          ? "border-accent/35 bg-[linear-gradient(180deg,rgba(184,255,32,0.12),rgba(23,26,34,0.92))]"
          : "border-white/10 bg-surface"
      }`}
    >
      <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="flex items-start gap-4 lg:flex-col lg:gap-8">
          <span className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/12 bg-white/4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/48">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/42 lg:max-w-40">
            {entry.dateRange}
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
                {entry.company}
              </p>
              <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.2rem]">
                {entry.role}
              </h3>
            </div>

            {isHighlighted ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-accent/35 bg-accent/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
                  Match score {matchScore}
                </span>
                {matchedTerms.map((term) => (
                  <span
                    key={`${entry.company}-${term}`}
                    className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/62"
                  >
                    {term}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <ul className="space-y-3 text-base leading-7 text-white/74">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span
                  className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                    isHighlighted ? "bg-accent" : "bg-white/24"
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
