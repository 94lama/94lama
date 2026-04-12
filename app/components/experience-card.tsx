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
      className={`rounded-[1.75rem] border px-5 py-6 transition-[transform,opacity,border-color,background-color,box-shadow] duration-300 hover:-translate-y-0.5 sm:px-6 sm:py-7 xl:px-8 ${
        isHighlighted
          ? "border-accent/35 bg-[linear-gradient(180deg,rgba(96,165,250,0.16),rgba(255,255,255,0.96))] shadow-[0_24px_80px_-56px_rgba(37,99,235,0.48)] dark:bg-[linear-gradient(180deg,rgba(96,165,250,0.18),rgba(23,26,34,0.92))] dark:shadow-none"
          : "border-black/10 bg-white/80 shadow-[0_20px_70px_-56px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-surface dark:shadow-none"
      }`}
    >
      <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="flex items-start gap-4 lg:flex-col lg:gap-8">
          <span className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-black/10 bg-black/4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500 transition-[transform,opacity,border-color,background-color,color] duration-300 dark:border-white/12 dark:bg-white/4 dark:text-white/48">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-white/42 lg:max-w-40">
            {entry.dateRange}
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-white/42">
                {entry.company}
              </p>
              <h3 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-[2.2rem]">
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
                    className="rounded-full border border-black/10 bg-white/82 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-600 transition-[transform,opacity,border-color,background-color,color] duration-300 hover:-translate-y-0.5 dark:border-white/12 dark:bg-white/6 dark:text-white/62"
                  >
                    {term}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <ul className="space-y-3 text-base leading-7 text-slate-600 dark:text-white/74">
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
