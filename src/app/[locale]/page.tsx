import { CertificatesSection } from "@/components/certificates-section";
import { EducationSection } from "@/components/education-section";
import { HeroSection } from "@/components/hero-section";
import { KnowledgeExperienceCoordinator } from "@/components/knowledge-experience-coordinator";
import { LanguagesSection } from "@/components/languages-section";
import { pageRhythm } from "@/components/layout/page-rhythm";
import { ResponsiveSectionGrid } from "@/components/layout/responsive-section-grid";
import { RelocationSection } from "@/components/relocation-section";
import { ExperienceEntry, LanguageEntry } from "@/src/content/portfolio/types";
import { getStaticLocaleParams, isLocale } from "@/i18n/request";
import content from "@/public/assets/cv.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riccardo La Malfa | Frontend-Focused Full-Stack Developer",
  description: "Recruiter-focused portfolio for Riccardo La Malfa, covering summary, skills, experience, relocation, and contact details.",
  icons: {
    icon: [
      { url: "/assets/readme/icon.svg", type: "image/svg+xml" },
      { url: "/assets/icon.svg", type: "image/svg+xml", sizes: "192x192" },
    ],
    shortcut: "/assets/icon.svg",
  },
  manifest: "/manifest.json",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticLocaleParams();
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale = isLocale(locale) ? locale : "en";

  // Load locale messages at build time (static import, no runtime server code)
  const messages = (
    await import(`@/messages/${activeLocale}.json`)
  ).default as { languages: { title: string } };

  return (
    <main className="min-h-screen">
      <div className={pageRhythm.shell}>
        <HeroSection
          contact={content.contact}
          hero={content.hero}
          relocation={content.relocation}
          summary={content.summary}
          languages={content.languages as LanguageEntry[]}
        />
        <div className={pageRhythm.heroToProof}>
          <KnowledgeExperienceCoordinator
            experience={content.experience as ExperienceEntry[]}
            skillGroups={content.skills}
          />
        </div>
        <ResponsiveSectionGrid className={pageRhythm.supportingBlock} variant="balanced">
          <EducationSection education={content.education} />
          <CertificatesSection certificates={content.certificates ?? []} />
        </ResponsiveSectionGrid>
        <div className={pageRhythm.supportingBlock}>
          <LanguagesSection
            languages={content.languages as LanguageEntry[]}
            title={messages.languages.title}
          />
        </div>
        <RelocationSection relocation={content.relocation} />
      </div>
    </main>
  );
}
