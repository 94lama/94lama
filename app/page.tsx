import { ContactSection } from "@/app/components/contact-section";
import { EducationSection } from "@/app/components/education-section";
import { HeroSection } from "@/app/components/hero-section";
import { KnowledgeExperienceCoordinator } from "@/app/components/knowledge-experience-coordinator";
import { LanguagesSection } from "@/app/components/languages-section";
import { RelocationSection } from "@/app/components/relocation-section";
import { getPortfolioContent } from "@/src/content/portfolio/get-portfolio-content";

export default async function Home() {
  const content = await getPortfolioContent();

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-4 sm:gap-16 sm:px-6 sm:py-6 lg:gap-24 lg:px-8 xl:px-10">
        <HeroSection
          contact={content.contact}
          hero={content.hero}
          relocation={content.relocation}
          summary={content.summary}
        />

        <KnowledgeExperienceCoordinator
          experience={content.experience}
          skillGroups={content.skills}
        />

        <section className="grid gap-8 xl:grid-cols-2">
          <EducationSection education={content.education} />
          <LanguagesSection languages={content.languages} />
        </section>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <RelocationSection relocation={content.relocation} />
          <ContactSection contact={content.contact} />
        </section>
      </div>
    </main>
  );
}
