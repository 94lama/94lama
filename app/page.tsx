import Image from "next/image";

import { KnowledgeExperienceCoordinator } from "@/app/components/knowledge-experience-coordinator";
import { getPortfolioContent } from "@/src/content/portfolio/get-portfolio-content";

function EmailIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M3.75 7.5 12 13.5l8.25-6M5.25 6h13.5A1.5 1.5 0 0 1 20.25 7.5v9a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5.25 6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ContactLink({
  href,
  label,
  icon,
}: Readonly<{
  href: string;
  label: string;
  icon?: React.ReactNode;
}>) {
  return (
    <a
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-800 shadow-sm transition-[transform,background-color,border-color,color,opacity] duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent dark:border-white/12 dark:bg-white/4 dark:text-white dark:hover:border-white/24 dark:hover:bg-white/10"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {icon ? <span className="mr-2 inline-flex items-center">{icon}</span> : null}
      <span>{label}</span>
    </a>
  );
}

function ContactIconLink({
  href,
  label,
  icon,
}: Readonly<{
  href: string;
  label: string;
  icon: "github" | "linkedin";
}>) {
  return (
    <a
      aria-label={label}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition-colors duration-200 hover:border-white/24 hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      href={href}
      rel="noreferrer"
      target="_blank"
      title={label}
    >
      {icon === "github" ? (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05A9.33 9.33 0 0 1 12 6.83c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.71 1.03 1.62 1.03 2.74 0 3.95-2.35 4.81-4.59 5.07.36.32.68.93.68 1.88 0 1.36-.01 2.46-.01 2.8 0 .27.18.6.69.5A10.24 10.24 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56c0-1.07-.8-1.94-1.91-1.94-1.1 0-1.91.87-1.91 1.94 0 1.06.79 1.94 1.88 1.94h.02c1.12 0 1.92-.88 1.92-1.94ZM20.44 13.02c0-3.48-1.86-5.1-4.35-5.1-2 0-2.9 1.12-3.4 1.9V8.5H9.31c.04.88 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.12-.92.27-.69.88-1.4 1.9-1.4 1.34 0 1.88 1.05 1.88 2.58V20h3.38v-6.98Z" />
        </svg>
      )}
    </a>
  );
}

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

const sectionShellClassName =
  "relative overflow-hidden rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(23,26,34,0.88))] px-5 py-6 shadow-[0_35px_120px_-80px_rgba(56,189,248,0.3)] sm:px-6 sm:py-7 xl:px-8";

const sectionGlowClassName =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_28%)]";

const sectionInnerCardClassName =
  "rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(12,12,15,0.34))] px-4 py-4 backdrop-blur-sm";

export default async function Home() {
  const content = await getPortfolioContent();
  const secondaryContactActions = [
    content.contact.github
      ? { href: content.contact.github, label: "GitHub" }
      : null,
    content.contact.linkedin
      ? { href: content.contact.linkedin, label: "LinkedIn" }
      : null,
  ].filter((action): action is { href: string; label: string } => Boolean(action));

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-4 sm:gap-16 sm:px-6 sm:py-6 lg:gap-24 lg:px-8 xl:px-10">
        <section className="overflow-hidden rounded-4xl border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(241,245,249,0.94))] shadow-[0_40px_120px_-70px_rgba(37,99,235,0.18)] transition-[transform,opacity] duration-500 motion-safe:hover:-translate-y-0.5 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(23,26,34,0.98),rgba(12,12,15,0.94))] dark:shadow-[0_40px_120px_-60px_rgba(0,0,0,0.8)] sm:rounded-[2.5rem] xl:min-h-[calc(100vh-5rem)]">
          <div className="grid min-h-full gap-10 px-5 py-6 sm:gap-12 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:px-10 lg:py-10 xl:px-14 xl:py-14">
            <div className="flex flex-col justify-between gap-10 xl:gap-14">
              <div className="space-y-8 sm:space-y-10">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-white/48">
                      Current positioning
                    </p>
                    <h1 className="max-w-4xl text-[3.25rem] leading-[0.94] font-semibold tracking-[-0.06em] text-slate-950 dark:text-white sm:text-[4.5rem] lg:text-[5.25rem] xl:text-[6rem]">
                      {content.hero.name}
                    </h1>
                    <p className="max-w-3xl text-xl leading-tight text-slate-700 dark:text-white/78 sm:text-2xl lg:text-[2rem]">
                      {content.hero.role}
                    </p>
                  </div>

                  <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-white/72 sm:text-lg">
                    {content.summary}
                  </p>

                  <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-[transform,opacity] duration-300 motion-safe:hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/4 dark:shadow-none sm:max-w-xl sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-white/46">
                        Based in
                      </p>
                      <p className="text-base font-medium text-slate-900 dark:text-white sm:text-lg">
                        {content.contact.location}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-white/46">
                        Relocation
                      </p>
                      <p className="text-base font-medium text-slate-900 dark:text-white sm:text-lg">
                        {content.relocation.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
                <div className="flex flex-col items-start gap-3 xl:items-end">
                  <a
                    aria-label={`Email ${content.contact.email}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent-foreground shadow-[0_18px_40px_-28px_rgba(37,99,235,0.7)] transition-[transform,opacity] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    href={`mailto:${content.contact.email}`}
                  >
                    <span className="mr-2 inline-flex items-center">
                      <EmailIcon />
                    </span>
                    <span>Email me</span>
                  </a>
                  {secondaryContactActions.length ? (
                    <div className="flex flex-wrap gap-3 xl:justify-end">
                      {secondaryContactActions.map((action) => (
                        <ContactLink key={action.label} href={action.href} label={action.label} />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <aside className="flex h-full flex-col justify-between gap-6 rounded-4xl border border-slate-200/90 bg-white/78 p-5 shadow-[0_28px_90px_-60px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-[transform,opacity] duration-300 motion-safe:hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-6 xl:p-8">
              <div className="space-y-6">
                {content.hero.photo ? (
                  <div className="space-y-3">
                    <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-white/44">
                      Profile
                    </p>
                    <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100/90 transition-[transform,opacity] duration-300 motion-safe:hover:-translate-y-0.5 dark:border-white/10 dark:bg-black/20">
                      <Image
                        alt={content.hero.photo.alt}
                        className="object-contain translate-y-15 transition-[transform,opacity] duration-500 motion-safe:hover:scale-[1.01]"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 28rem"
                        src={content.hero.photo.src}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/82 p-5 transition-[transform,opacity] duration-300 motion-safe:hover:-translate-y-0.5 dark:border-white/10 dark:bg-black/20">
                  <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-white/42">
                    Contact line
                  </p>
                  <a
                    className="block break-all text-lg font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition-[opacity,transform,color] duration-300 hover:decoration-accent dark:text-white dark:decoration-white/20"
                    href={`mailto:${content.contact.email}`}
                  >
                    {content.contact.email}
                  </a>
                  {content.contact.phone ? (
                    <p className="text-base text-slate-600 dark:text-white/70">{content.contact.phone}</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3 rounded-3xl border border-sky-200/80 bg-[linear-gradient(180deg,rgba(96,165,250,0.16),rgba(255,255,255,0.84))] p-5 transition-[transform,opacity] duration-300 motion-safe:hover:-translate-y-0.5 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(96,165,250,0.18),rgba(37,99,235,0.05))]">
                <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-white/52">
                  Preferred regions
                </p>
                <div className="flex flex-wrap gap-2">
                  {(content.relocation.preferredRegions ?? []).map((region) => (
                    <span
                      key={region}
                      className="rounded-full border border-sky-200 bg-white/80 px-3 py-2 text-sm text-slate-700 transition-[transform,opacity] duration-300 motion-safe:hover:-translate-y-0.5 dark:border-white/12 dark:bg-white/6 dark:text-white/78"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <KnowledgeExperienceCoordinator
          experience={content.experience}
          skillGroups={content.skills}
        />

        <section className="grid gap-8 xl:grid-cols-2">
          <article className={sectionShellClassName}>
            <div className={sectionGlowClassName} />
            <div className="relative">
              <SectionHeading index="03" title="Education" />
              <ul className="mt-8 space-y-4">
                {content.education.map((entry) => (
                  <li
                    key={entry}
                    className={`${sectionInnerCardClassName} text-base leading-7 text-white/76`}
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className={sectionShellClassName}>
            <div className={sectionGlowClassName} />
            <div className="relative">
              <SectionHeading index="04" title="Languages" />
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {content.languages.map((entry) => (
                  <div key={entry.label} className={sectionInnerCardClassName}>
                    <p className="text-lg font-semibold text-white">{entry.label}</p>
                    <p className="mt-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/46">
                      {entry.level}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <article className={sectionShellClassName}>
            <div className={sectionGlowClassName} />
            <div className="relative">
              <SectionHeading index="05" title="Relocation" />
              <div className="mt-8 space-y-6">
                <p className="max-w-2xl text-lg leading-8 text-white/78">
                  {content.relocation.summary}
                </p>

                {content.relocation.support?.length ? (
                  <div className="grid gap-4 lg:grid-cols-3">
                    {content.relocation.support.map((entry) => (
                      <div key={entry.label} className={sectionInnerCardClassName}>
                        <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/42">
                          {entry.label}
                        </p>
                        <p className="mt-3 text-base leading-7 text-white/76">{entry.value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {content.relocation.preferredRegions?.length ? (
                  <div className="flex flex-wrap gap-3">
                    {content.relocation.preferredRegions.map((region) => (
                      <span
                        key={region}
                        className="rounded-full border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/78 backdrop-blur-sm"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                ) : null}

                {content.relocation.priorities?.length ? (
                  <div className={sectionInnerCardClassName}>
                    <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/42">
                      Relocation priorities
                    </p>
                    <ul className="mt-4 space-y-3 text-base leading-7 text-white/76">
                      {content.relocation.priorities.map((priority) => (
                        <li key={priority} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                          <span>{priority}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </article>

          <article className={sectionShellClassName}>
            <div className={sectionGlowClassName} />
            <div className="relative">
              <SectionHeading index="06" title="Contact" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className={`${sectionInnerCardClassName} sm:col-span-2`}>
                  <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
                    Primary CTA
                  </p>
                  <a
                    aria-label={`Email ${content.contact.email}`}
                    className="mt-4 inline-flex min-h-11 items-center rounded-full bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    href={`mailto:${content.contact.email}`}
                  >
                    <span className="mr-2 inline-flex items-center">
                      <EmailIcon />
                    </span>
                    <span>Email me</span>
                  </a>
                  {secondaryContactActions.length ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {secondaryContactActions.map((action) => (
                        <ContactIconLink
                          key={`contact-${action.label}`}
                          href={action.href}
                          icon={action.label === "GitHub" ? "github" : "linkedin"}
                          label={action.label}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className={sectionInnerCardClassName}>
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

                <div className={sectionInnerCardClassName}>
                  <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
                    Location
                  </p>
                  <p className="mt-3 text-base leading-7 text-white/76">{content.contact.location}</p>
                </div>

                {content.contact.phone ? (
                  <div className={`${sectionInnerCardClassName} sm:col-span-2`}>
                    <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
                      Phone
                    </p>
                    <p className="mt-3 text-base leading-7 text-white/76">{content.contact.phone}</p>
                  </div>
                ) : null}

              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
