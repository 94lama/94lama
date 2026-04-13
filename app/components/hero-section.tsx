import Image from "next/image";

import { ContactAction } from "@/app/components/contact-actions";
import { EmailIcon } from "@/app/components/portfolio-icons";
import {
  sectionCardClassName,
  sectionEyebrowToneClassName,
  sectionPanelClassName,
  sectionPillClassName,
  sectionTitleToneClassName,
} from "@/app/components/section-card-styles";
import type { ContactInfo, HeroContent, RelocationInfo } from "@/src/content/portfolio/types";

type HeroSectionProps = {
  hero: HeroContent;
  summary: string;
  contact: ContactInfo;
  relocation: RelocationInfo;
};

function getSecondaryContactActions(contact: ContactInfo) {
  return [
    contact.github ? { href: contact.github, label: "GitHub" } : null,
    contact.linkedin ? { href: contact.linkedin, label: "LinkedIn" } : null,
  ].filter((action): action is { href: string; label: string } => Boolean(action));
}

export function HeroSection({ hero, summary, contact, relocation }: Readonly<HeroSectionProps>) {
  const secondaryContactActions = getSecondaryContactActions(contact);

  return (
    <section
      className={`${sectionPanelClassName} overflow-hidden sm:rounded-[2.5rem] xl:min-h-[calc(100vh-5rem)]`}
    >
      <div className="grid min-h-full gap-10 px-5 py-6 sm:gap-12 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:px-10 lg:py-10 xl:px-14 xl:py-14">
        <div className="flex flex-col justify-between gap-10 xl:gap-14">
          <div className="space-y-8 sm:space-y-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-white/48">
                  Current positioning
                </p>
                <h1 className="max-w-4xl text-[3.25rem] leading-[0.94] font-semibold tracking-[-0.06em] text-slate-950 dark:text-white sm:text-[4.5rem] lg:text-[5.25rem] xl:text-[6rem]">
                  {hero.name}
                </h1>
                <p className="max-w-3xl text-xl leading-tight text-slate-700 dark:text-white/78 sm:text-2xl lg:text-[2rem]">
                  {hero.role}
                </p>
              </div>

              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-white/72 sm:text-lg">
                {summary}
              </p>

              <div className={`${sectionCardClassName} grid gap-3 rounded-3xl p-5 sm:max-w-xl sm:grid-cols-2`}>
                <div className="space-y-2">
                  <p
                    className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
                  >
                    Based in
                  </p>
                  <p className={`text-base font-medium ${sectionTitleToneClassName} sm:text-lg`}>
                    {contact.location}
                  </p>
                </div>
                <div className="space-y-2">
                  <p
                    className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
                  >
                    Relocation
                  </p>
                  <p className={`text-base font-medium ${sectionTitleToneClassName} sm:text-lg`}>
                    {relocation.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div className="flex flex-col items-start gap-3 xl:items-end">
              <a
                aria-label={`Email ${contact.email}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent-foreground shadow-[0_18px_40px_-28px_rgba(37,99,235,0.7)] transition-[transform,opacity] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                href={`mailto:${contact.email}`}
              >
                <span className="mr-2 inline-flex items-center">
                  <EmailIcon />
                </span>
                <span>Email me</span>
              </a>
              {secondaryContactActions.length ? (
                <div className="flex flex-wrap gap-3 xl:justify-end">
                  {secondaryContactActions.map((action) => (
                    <ContactAction key={action.label} href={action.href} label={action.label} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className={`${sectionPanelClassName} flex h-full flex-col justify-between gap-6 p-5 sm:p-6 xl:p-8`}>
          <div className="space-y-6">
            {hero.photo ? (
              <div className="space-y-3">
                <p
                  className={`font-mono text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${sectionEyebrowToneClassName}`}
                >
                  Profile
                </p>
                <div className={`${sectionCardClassName} relative aspect-4/5 overflow-hidden rounded-3xl bg-slate-100/90`}>
                  <Image
                    alt={hero.photo.alt}
                    className="object-contain translate-y-15 transition-[transform,opacity] duration-500 motion-safe:hover:scale-[1.01]"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 28rem"
                    src={hero.photo.src}
                  />
                </div>
              </div>
            ) : null}

            <div className={`${sectionCardClassName} space-y-3 rounded-3xl p-5`}>
              <p
                className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
              >
                Contact line
              </p>
              <a
                className={`block break-all text-lg font-medium underline decoration-slate-300 underline-offset-4 transition-[opacity,transform,color] duration-300 hover:decoration-accent dark:decoration-white/20 ${sectionTitleToneClassName}`}
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
              {contact.phone ? <p className="text-base text-slate-600 dark:text-white/72">{contact.phone}</p> : null}
            </div>
          </div>

          <div className={`${sectionCardClassName} space-y-3 rounded-3xl p-5`}>
            <p
              className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
            >
              Preferred regions
            </p>
            <div className="flex flex-wrap gap-2">
              {(relocation.preferredRegions ?? []).map((region) => (
                <span key={region} className={sectionPillClassName}>
                  {region}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
