import { SectionHeading } from "@/app/components/section-heading";
import { SectionShell, sectionInnerCardClassNames } from "@/app/components/section-shell";
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
    <SectionShell density="compact">
      <SectionHeading index="05" title="Languages" />
      <div className="mt-6 grid gap-3 sm:mt-7 sm:grid-cols-3">
        {languages.map((entry) => (
          <div key={entry.label} className={`${sectionInnerCardClassNames.compact} space-y-2`}>
            <p className={`text-lg font-semibold ${sectionTitleToneClassName}`}>{entry.label}</p>
            <p
              className={`font-mono text-[0.72rem] font-semibold uppercase tracking-[0.22em] ${sectionEyebrowToneClassName}`}
            >
              {entry.level}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
