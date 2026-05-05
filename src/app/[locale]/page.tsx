import { CertificatesSection } from "@/components/certificates-section";
import { EducationSection } from "@/components/education-section";
import { HeroSection } from "@/components/hero-section";
import { KnowledgeExperienceCoordinator } from "@/components/knowledge-experience-coordinator";
import { pageRhythm } from "@/components/layout/page-rhythm";
import { ResponsiveSectionGrid } from "@/components/layout/responsive-section-grid";
import { LanguagesSection } from "@/components/languages-section";
// import { PageLoaderOverlay } from "@/components/loading/page-loader-overlay";
import { RelocationSection } from "@/components/relocation-section";
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
            <LanguagesSection languages={content.languages as LanguageEntry[]} />
          </ResponsiveSectionGrid>
          <RelocationSection relocation={content.relocation} />
        </div>
        {/* <PageLoaderOverlay /> */}
      </main>
    </>
  );
}
