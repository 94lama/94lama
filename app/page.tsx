import { getPortfolioContent } from "@/src/content/portfolio/get-portfolio-content";

import { ExperienceMapSection } from '@/app/components/experience-map-section';

function Section({
  title,
  children,
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="space-y-4 border-t border-black/10 pt-8 dark:border-white/10">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-black/60 dark:text-white/60">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function Home() {
  const content = await getPortfolioContent();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-12">
      <section className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/60 dark:text-white/60">
          Recruiter-ready portfolio
        </p>
        <div className="space-y-3">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-6xl">
            {content.hero.name}
          </h1>
          <p className="max-w-3xl text-xl text-black/70 dark:text-white/70 sm:text-2xl">
            {content.hero.role}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-black/70 dark:text-white/70 sm:flex-row sm:flex-wrap sm:gap-4">
          <span>{content.contact.location}</span>
          <a className="underline underline-offset-4" href={`mailto:${content.contact.email}`}>
            {content.contact.email}
          </a>
          {content.contact.phone ? <span>{content.contact.phone}</span> : null}
        </div>
      </section>

      <Section title="Summary">
        <p className="max-w-3xl text-base leading-8 text-black/80 dark:text-white/80 sm:text-lg">
          {content.summary}
        </p>
      </Section>

      <ExperienceMapSection experience={content.experience} skillGroups={content.skills} />

      <div className="grid gap-10 lg:grid-cols-2">
        <Section title="Education">
          <ul className="space-y-3 text-base leading-7 text-black/75 dark:text-white/75">
            {content.education.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        </Section>

        <Section title="Languages">
          <ul className="space-y-3 text-base leading-7 text-black/75 dark:text-white/75">
            {content.languages.map((entry) => (
              <li key={entry.label}>
                <span className="font-medium text-black dark:text-white">{entry.label}</span> {entry.level}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <Section title="Relocation">
          <div className="space-y-3 text-base leading-7 text-black/75 dark:text-white/75">
            <p>{content.relocation.summary}</p>
            {content.relocation.preferredRegions?.length ? (
              <p>
                Preferred regions: {content.relocation.preferredRegions.join(", ")}
              </p>
            ) : null}
          </div>
        </Section>

        <Section title="Contact">
          <div className="space-y-3 text-base leading-7 text-black/75 dark:text-white/75">
            <p>
              <span className="font-medium text-black dark:text-white">Email:</span>{" "}
              <a className="underline underline-offset-4" href={`mailto:${content.contact.email}`}>
                {content.contact.email}
              </a>
            </p>
            {content.contact.phone ? (
              <p>
                <span className="font-medium text-black dark:text-white">Phone:</span>{" "}
                {content.contact.phone}
              </p>
            ) : null}
            <p>
              <span className="font-medium text-black dark:text-white">Location:</span>{" "}
              {content.contact.location}
            </p>
          </div>
        </Section>
      </div>
    </main>
  );
}
