"use client";

import { useRef } from "react";
import Image from "next/image";

import {
  sectionCardClassName,
  sectionEyebrowToneClassName,
  sectionPanelClassName,
  sectionPillClassName,
  sectionTitleToneClassName,
} from "@/src/app/components/section-card-styles";
import type { ContactInfo, HeroContent, RelocationInfo, LanguageEntry } from "@/src/content/portfolio/types";
import DragResize from "@/src/app/components/drag-resize/drag-resize.client";
import { HeroContactLine } from "@/src/app/components/hero-contact-line";
import { HeroBasedIn } from "@/src/app/components/hero-based-in";
import HeroLanguages from "@/src/app/components/hero-languages.client";
import { HeroDownloadCard } from "@/src/app/components/hero-download-card";

type HeroSectionProps = {
  hero: HeroContent;
  summary: string;
  contact: ContactInfo;
  relocation: RelocationInfo;
  languages?: LanguageEntry[];
};

export function HeroSection({ hero, summary, contact, relocation, languages = [] }: Readonly<HeroSectionProps>) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const heroRole = typeof hero?.role === "string" ? hero.role : "";
  const heroPhoto = hero?.photo;
  const summaryCopy = typeof summary === "string" ? summary : "";
  const contactLocation = typeof contact?.location === "string" ? contact.location : "";
  const relocationSummary = typeof relocation?.summary === "string" ? relocation.summary : "";

  return (
    <div className="relative">
      <section
        ref={sectionRef}
        className={`${sectionPanelClassName} overflow-hidden sm:rounded-[2.5rem] xl:min-h-[calc(100vh-5rem)]`}
      >
        <DragResize id="hero-section" delegate delegateSelector="[data-draggable-item]" absoluteCenter className="flex flex-wrap align-middle justify-center gap-6 px-5 py-6 sm:gap-8 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.22fr)_minmax(19rem,0.78fr)] lg:items-start lg:px-10 lg:py-10 xl:gap-10 xl:px-14 xl:py-14">
          <div data-draggable-item data-draggable-id="hero-positioning" className="flex flex-col gap-8 p-6 overflow-hidden sm:gap-10 xl:gap-12" style={{ position: 'relative' }}>
            <div data-delegate-resize-handle aria-hidden style={{ position: 'absolute', right: 8, bottom: 8, width: 22, height: 22, cursor: 'nwse-resize' }} />
            <div className="space-y-7 sm:space-y-9">
              <div className="space-y-5 sm:space-y-6">
                <div className="space-y-4 sm:space-y-5">
                  <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-white/48">
                    Current positioning
                  </p>
                  <h1 className="max-w-4xl text-[2rem] text-capitalize leading-[0.93] font-semibold tracking-[-0.065em] text-slate-950 uppercase dark:text-white sm:text-[3.36rem] lg:text-[4rem] xl:text-[4.64rem]">
                    {hero.name} <span className="text-nowrap">{hero.surname}</span>
                  </h1>
                  <h3 className="text-xl leading-tight text-slate-700 dark:text-white/78 sm:text-[1.8rem] lg:text-[2rem]">
                    {heroRole}
                  </h3>
                </div>

                <p className="text-base leading-8 text-slate-600 dark:text-white/72 sm:text-lg">
                  {summaryCopy}
                </p>

              </div>
            </div>
          </div>

          <HeroContactLine contact={contact} />

          <HeroBasedIn location={contactLocation} relocationSummary={relocationSummary} />

          {/* Languages card moved into hero and made draggable/resizable (client component) */}
          <HeroLanguages languages={languages} />

          <div className="space-y-5">
            {heroPhoto ? (
              <div data-draggable-item className="space-y-3 w-100">
                <p
                  className={`font-mono text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${sectionEyebrowToneClassName}`}
                >
                  Profile
                </p>
                <div className={`${sectionCardClassName} relative aspect-4/5 overflow-hidden rounded-3xl bg-slate-100/90`}>
                  <div className="relative h-full w-full [scaleX(-1)]">
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
          </div>
        </DragResize>
      </section>

      {/* Download button at top-right of section */}
      <div className="absolute top-4 right-4 z-50">
        <HeroDownloadCard sectionRef={sectionRef} contact={contact} />
      </div>
    </div>
  );
}
