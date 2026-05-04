import Image from "next/image";

import { ContactIconAction } from "@/src/app/components/contact-actions";
import {
  sectionCardClassName,
  sectionEyebrowToneClassName,
  sectionPanelClassName,
  sectionPillClassName,
  sectionTitleToneClassName,
} from "@/src/app/components/section-card-styles";
import type { ContactInfo, HeroContent, RelocationInfo } from "@/src/content/portfolio/types";

type HeroSectionProps = {
  hero: HeroContent;
  summary: string;
  contact: ContactInfo;
  relocation: RelocationInfo;
};

function getHeroContactActions(contact: ContactInfo | undefined) {
  if (!contact) {
    return [];
  }

  return [
    { href: `mailto:${contact.email}`, label: "Email", icon: "email" as const, external: false },
    contact.phone
      ? { href: `tel:${contact.phone.replace(/\s+/g, "")}`, label: "Phone", icon: "phone" as const, external: false }
      : null,
    contact.github
      ? { href: contact.github, label: "GitHub", icon: "github" as const, external: true }
      : null,
    contact.linkedin
      ? { href: contact.linkedin, label: "LinkedIn", icon: "linkedin" as const, external: true }
      : null,
  ].filter(
    (
      action,
    ): action is { href: string; label: string; icon: "email" | "phone" | "github" | "linkedin"; external: boolean } =>
      Boolean(action),
  );
}

export function HeroSection({ hero, summary, contact, relocation }: Readonly<HeroSectionProps>) {
  const heroName = typeof hero?.name === "string" ? hero.name : "";
  const heroRole = typeof hero?.role === "string" ? hero.role : "";
  const heroPhoto = hero?.photo;
  const summaryCopy = typeof summary === "string" ? summary : "";
  const contactEmail = typeof contact?.email === "string" ? contact.email : "";
  const contactPhone = typeof contact?.phone === "string" ? contact.phone : undefined;
  const contactLocation = typeof contact?.location === "string" ? contact.location : "";
  const relocationSummary = typeof relocation?.summary === "string" ? relocation.summary : "";
  const preferredRegions = Array.isArray(relocation?.preferredRegions)
    ? relocation.preferredRegions
    : [];
  const heroContactActions = getHeroContactActions(contact);
  const [heroInitial = "", ...heroRemainingCharacters] = heroName;
  const heroRemainingName = heroRemainingCharacters.join("");

  return (
    <section
      className={`${sectionPanelClassName} overflow-hidden sm:rounded-[2.5rem] xl:min-h-[calc(100vh-5rem)]`}
    >
      <div className="grid min-h-full gap-6 px-5 py-6 sm:gap-8 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.22fr)_minmax(19rem,0.78fr)] lg:items-stretch lg:px-10 lg:py-10 xl:gap-10 xl:px-14 xl:py-14">
        <div className="flex flex-col justify-between gap-8 sm:gap-10 xl:gap-12">
          <div className="space-y-7 sm:space-y-9">
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-4 sm:space-y-5">
                <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-white/48">
                  Current positioning
                </p>
                <h1 className="max-w-4xl text-[2.4rem] leading-[0.93] font-semibold tracking-[-0.065em] text-slate-950 uppercase dark:text-white sm:text-[3.36rem] lg:text-[4rem] xl:text-[4.64rem]">
                  <span className="text-[1.16em]">{heroInitial}</span>
                  {heroRemainingName}
                </h1>
                <p className="max-w-3xl text-xl leading-tight text-slate-700 dark:text-white/78 sm:text-[1.8rem] lg:text-[2rem]">
                  {heroRole}
                </p>
              </div>

              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-white/72 sm:text-lg">
                {summaryCopy}
              </p>

              <div
                className={`${sectionCardClassName} flex flex-col gap-4 rounded-3xl p-5 sm:max-w-3xl sm:flex-row sm:items-center sm:justify-between sm:gap-6`}
              >
                <div className="space-y-2">
                  <p
                    className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
                  >
                    Contact line
                  </p>
                  {contactEmail ? (
                    <a
                      className={`motion-control block break-all text-lg font-medium underline decoration-slate-300 underline-offset-4 transition-colors duration-300 hover:decoration-accent dark:decoration-white/20 ${sectionTitleToneClassName}`}
                      href={`mailto:${contactEmail}`}
                    >
                      {contactEmail}
                    </a>
                  ) : null}
                  {contactPhone ? <p className="text-base text-slate-600 dark:text-white/72">{contactPhone}</p> : null}
                </div>
                <div className="flex flex-wrap gap-3 sm:justify-end">
                  {heroContactActions.map((action) => (
                    <ContactIconAction
                      key={action.label}
                      external={action.external}
                      href={action.href}
                      icon={action.icon}
                      label={action.label}
                    />
                  ))}
                </div>
              </div>

              <div
                className={`${sectionCardClassName} grid gap-3 rounded-3xl p-5 sm:max-w-2xl sm:grid-cols-2`}
              >
                <div className="space-y-2">
                  <p
                    className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
                  >
                    Based in
                  </p>
                  <p className={`text-base font-medium ${sectionTitleToneClassName} sm:text-lg`}>
                    {contactLocation}
                  </p>
                </div>
                <div className="space-y-2">
                  <p
                    className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
                  >
                    Relocation
                  </p>
                  <p className={`text-base font-medium ${sectionTitleToneClassName} sm:text-lg`}>
                    {relocationSummary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside
          className={`${sectionPanelClassName} flex h-full flex-col justify-between gap-5 p-5 sm:p-6 xl:p-7`}
        >
          <div className="space-y-5">
            {heroPhoto ? (
              <div className="space-y-3">
                <p
                  className={`font-mono text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${sectionEyebrowToneClassName}`}
                >
                  Profile
                </p>
                <div className={`${sectionCardClassName} relative aspect-4/5 overflow-hidden rounded-3xl bg-slate-100/90`}>
                  <div className="relative h-full w-full [transform:scaleX(-1)]">
                    <Image
                      alt={heroPhoto.alt}
                      className="motion-image object-contain translate-y-15"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 28rem"
                      src={heroPhoto.src}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              <div
                className={`${sectionCardClassName} space-y-3 rounded-3xl p-5`}
              >
                <p
                  className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
                >
                  Based in
                </p>
                <p className={`text-base leading-7 ${sectionTitleToneClassName}`}>{contactLocation}</p>
                <p className="text-sm leading-6 text-slate-600 dark:text-white/70">{relocationSummary}</p>
              </div>
            </div>
          </div>

          <div
            className={`${sectionCardClassName} space-y-3 rounded-3xl p-5`}
          >
            <p
              className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
            >
              Preferred regions
            </p>
            <div className="flex flex-wrap gap-2">
              {preferredRegions.map((region) => (
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
