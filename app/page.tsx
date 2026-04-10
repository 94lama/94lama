import { ExperienceMapSection } from "@/app/components/experience-map-section";
import { getPortfolioContent } from "@/src/content/portfolio/get-portfolio-content";

function SectionHeading({
  index,
  title,
  description,
}: Readonly<{
  index: string;
  title: string;
  description?: string;
}>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-accent px-3 py-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent-foreground">
          {index}
        </span>
        <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted">
          {title}
        </p>
      </div>
      {description ? (
        <p className="max-w-2xl text-base leading-7 text-white/72">{description}</p>
      ) : null}
    </div>
  );
}

export default async function Home() {
  const content = await getPortfolioContent();

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-4 sm:gap-16 sm:px-6 sm:py-6 lg:gap-24 lg:px-8 xl:px-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(23,26,34,0.98),rgba(12,12,15,0.94))] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.8)] sm:rounded-[2.5rem] xl:min-h-[calc(100vh-5rem)]">
          <div className="grid min-h-full gap-10 px-5 py-6 sm:gap-12 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)] lg:px-10 lg:py-10 xl:px-14 xl:py-14">
            <div className="flex flex-col justify-between gap-10 xl:gap-14">
              <div className="space-y-8 sm:space-y-10">
                <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/58">
                  <span className="rounded-full border border-white/12 bg-white/4 px-4 py-3 font-mono">
                    {content.contact.location}
                  </span>
                  <span className="rounded-full border border-accent/30 bg-accent px-4 py-3 font-mono text-accent-foreground">
                    {content.relocation.summary}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-white/48">
                      Current positioning
                    </p>
                    <h1 className="max-w-4xl text-[3.25rem] leading-[0.94] font-semibold tracking-[-0.06em] text-white sm:text-[4.5rem] lg:text-[5.25rem] xl:text-[6rem]">
                      {content.hero.name}
                    </h1>
                    <p className="max-w-3xl text-xl leading-tight text-white/78 sm:text-2xl lg:text-[2rem]">
                      {content.hero.role}
                    </p>
                  </div>

                  <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                    {content.summary}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-5 backdrop-blur-sm">
                    <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/46">
                      Location
                    </p>
                    <p className="mt-3 text-lg font-medium text-white">{content.contact.location}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-5 backdrop-blur-sm">
                    <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/46">
                      Relocation
                    </p>
                    <p className="mt-3 text-lg font-medium text-white">{content.relocation.summary}</p>
                  </div>
                </div>

                <a
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  href={`mailto:${content.contact.email}`}
                >
                  Email Riccardo
                </a>
              </div>
            </div>

            <aside className="flex h-full flex-col justify-between gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6 xl:p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-white/44">
                    Recruiter snapshot
                  </p>
                  <p className="text-lg leading-8 text-white/74">
                    {content.summary}
                  </p>
                </div>

                <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
                    Contact line
                  </p>
                  <a
                    className="block break-all text-lg font-medium text-white underline decoration-white/20 underline-offset-4 transition hover:decoration-accent"
                    href={`mailto:${content.contact.email}`}
                  >
                    {content.contact.email}
                  </a>
                  {content.contact.phone ? (
                    <p className="text-base text-white/70">{content.contact.phone}</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(184,255,32,0.12),rgba(184,255,32,0.03))] p-5">
                <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/52">
                  Preferred regions
                </p>
                <div className="flex flex-wrap gap-2">
                  {(content.relocation.preferredRegions ?? []).map((region) => (
                    <span
                      key={region}
                      className="rounded-full border border-white/12 bg-white/6 px-3 py-2 text-sm text-white/78"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-12 xl:gap-16">
          <SectionHeading
            index="01"
            title="Skills"
            description="Grouped for recruiter-speed scanning across frontend, backend, DevOps, and data work."
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {content.skills.map((group, index) => (
              <article
                key={group.category}
                className={`rounded-[1.75rem] border p-5 sm:p-6 ${
                  index === 0
                    ? "border-accent/25 bg-[linear-gradient(180deg,rgba(184,255,32,0.12),rgba(23,26,34,0.9))]"
                    : "border-white/10 bg-surface"
                }`}
              >
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      {group.category}
                    </h2>
                  </div>

                  <ul className="space-y-3">
                    {group.entries.map((entry) => (
                      <li
                        key={`${group.category}-${entry.label}`}
                        className="flex items-center justify-between gap-4 border-t border-white/8 pt-3 text-sm text-white/72"
                      >
                        <span>{entry.label}</span>
                        {typeof entry.knowledge === "number" ? (
                          <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/42">
                            {Math.round(entry.knowledge * 5)}/5
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-12 xl:gap-16">
          <SectionHeading
            index="02"
            title="Experience"
            description="The highest-weight credential block after the hero, organized for role, company, timing, and proof points."
          />

          <div className="space-y-5">
            {content.experience.map((entry, index) => (
              <article
                key={`${entry.role}-${entry.company}-${entry.dateRange}`}
                className="rounded-[1.75rem] border border-white/10 bg-surface px-5 py-6 sm:px-6 sm:py-7 xl:px-8"
              >
                <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
                  <div className="flex items-start gap-4 lg:flex-col lg:gap-8">
                    <span className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/12 bg-white/4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/48">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/42 lg:max-w-[10rem]">
                      {entry.dateRange}
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-3">
                      <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
                        {entry.company}
                      </p>
                      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.2rem]">
                        {entry.role}
                      </h2>
                    </div>

                    <ul className="space-y-3 text-base leading-7 text-white/74">
                      {entry.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(23,26,34,0.96),rgba(12,12,15,0.98))] px-5 py-6 sm:px-6 sm:py-7 xl:px-8">
          <SectionHeading
            index="02A"
            title="Interactive Skills And Experience"
            description="A deeper pass on how the grouped skill areas connect back to the experience timeline without changing the one-page flow."
          />
          <ExperienceMapSection
            experience={content.experience}
            skillGroups={content.skills}
          />
        </section>

        <section className="grid gap-8 xl:grid-cols-2">
          <article className="rounded-[2rem] border border-white/10 bg-surface px-5 py-6 sm:px-6 sm:py-7 xl:px-8">
            <SectionHeading index="03" title="Education" />
            <ul className="mt-8 space-y-4">
              {content.education.map((entry) => (
                <li
                  key={entry}
                  className="rounded-[1.25rem] border border-white/8 bg-black/18 px-4 py-4 text-base leading-7 text-white/76"
                >
                  {entry}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-surface px-5 py-6 sm:px-6 sm:py-7 xl:px-8">
            <SectionHeading index="04" title="Languages" />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {content.languages.map((entry) => (
                <div
                  key={entry.label}
                  className="rounded-[1.25rem] border border-white/8 bg-black/18 px-4 py-4"
                >
                  <p className="text-lg font-semibold text-white">{entry.label}</p>
                  <p className="mt-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/46">
                    {entry.level}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(184,255,32,0.12),rgba(23,26,34,0.9))] px-5 py-6 sm:px-6 sm:py-7 xl:px-8">
            <SectionHeading index="05" title="Relocation" />
            <div className="mt-8 space-y-6">
              <p className="max-w-2xl text-lg leading-8 text-white/78">
                {content.relocation.summary}
              </p>

              {content.relocation.preferredRegions?.length ? (
                <div className="flex flex-wrap gap-3">
                  {content.relocation.preferredRegions.map((region) => (
                    <span
                      key={region}
                      className="rounded-full border border-white/12 bg-white/6 px-4 py-3 text-sm text-white/78"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-surface px-5 py-6 sm:px-6 sm:py-7 xl:px-8">
            <SectionHeading index="06" title="Contact" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/8 bg-black/18 p-5 sm:col-span-2">
                <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
                  Primary CTA
                </p>
                <a
                  className="mt-4 inline-flex min-h-11 items-center rounded-full bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  href={`mailto:${content.contact.email}`}
                >
                  Email Riccardo
                </a>
              </div>

              <div className="rounded-[1.5rem] border border-white/8 bg-black/18 p-5">
                <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
                  Email
                </p>
                <a
                  className="mt-3 block break-all text-base leading-7 text-white underline decoration-white/18 underline-offset-4 transition hover:decoration-accent"
                  href={`mailto:${content.contact.email}`}
                >
                  {content.contact.email}
                </a>
              </div>

              <div className="rounded-[1.5rem] border border-white/8 bg-black/18 p-5">
                <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
                  Location
                </p>
                <p className="mt-3 text-base leading-7 text-white/76">{content.contact.location}</p>
              </div>

              {content.contact.phone ? (
                <div className="rounded-[1.5rem] border border-white/8 bg-black/18 p-5 sm:col-span-2">
                  <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
                    Phone
                  </p>
                  <p className="mt-3 text-base leading-7 text-white/76">{content.contact.phone}</p>
                </div>
              ) : null}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
