import { SectionHeading } from "@/app/components/section-heading";
import { SectionShell, sectionInnerCardClassName } from "@/app/components/section-shell";
import {
  sectionEyebrowToneClassName,
  sectionTitleToneClassName,
} from "@/app/components/section-card-styles";
import type { LanguageEntry } from "@/src/content/portfolio/types";

type LanguagesSectionProps = {
  languages: LanguageEntry[];
};

export function LanguagesSection({ languages }: Readonly<LanguagesSectionProps>) {
  return (
    <SectionShell>
      <SectionHeading index="04" title="Languages" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {languages.map((entry) => (
          <div key={entry.label} className={sectionInnerCardClassName}>
            <p className={`text-lg font-semibold ${sectionTitleToneClassName}`}>{entry.label}</p>
            <p
              className={`mt-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.22em] ${sectionEyebrowToneClassName}`}
            >
              {entry.level}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
