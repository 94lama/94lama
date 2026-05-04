import { CertificatesSection } from "@/app/components/certificates-section";
import { EducationSection } from "@/app/components/education-section";
import { HeroSection } from "@/app/components/hero-section";
import { KnowledgeExperienceCoordinator } from "@/app/components/knowledge-experience-coordinator";
import { pageRhythm } from "@/app/components/layout/page-rhythm";
import { ResponsiveSectionGrid } from "@/app/components/layout/responsive-section-grid";
import { LanguagesSection } from "@/app/components/languages-section";
// import { PageLoaderOverlay } from "@/app/components/loading/page-loader-overlay";
import { RelocationSection } from "@/app/components/relocation-section";
import { ExperienceEntry, LanguageEntry } from "@/src/content/portfolio/types";
import content from "@/public/assets/cv.json";

export default async function Home() {
  return (
    <>
      {/* Temporary: disable page mount loader overlay. */}
      <main className="min-h-screen">
        <div className={pageRhythm.shell}>
          <HeroSection
            contact={content.contact}
            hero={content.hero}
            relocation={content.relocation}
            summary={content.summary}
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
          <LanguagesSection languages={content.languages as LanguageEntry[]} />
          <RelocationSection relocation={content.relocation} />
        </div>
        {/* <PageLoaderOverlay /> */}
      </main>
    </>
  );
}
