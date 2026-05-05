import { SectionHeading } from "@/components/section-heading";
import { SectionShell, sectionInnerCardClassNames } from "@/components/section-shell";
import {
  sectionEyebrowToneClassName,
  sectionTitleToneClassName,
} from "@/components/section-card-styles";
import LanguageTile from "@/components/language-tile.client";
import type { LanguageEntry } from "@/src/content/portfolio/types";

export function LanguagesSection({languages}: {languages: LanguageEntry[]}) {
  return (
    <SectionShell density="compact">
      <SectionHeading index="05" title="Languages" />
      <div className="mt-6 grid gap-3 sm:mt-7 sm:grid-cols-3">
        {languages.map((entry) => (
          <LanguageTile
            key={entry.label}
            language={entry}
            className={`${sectionInnerCardClassNames.compact} space-y-2`}
            titleClassName={`text-lg font-semibold ${sectionTitleToneClassName}`}
            eyebrowClassName={`font-mono text-[0.72rem] font-semibold uppercase tracking-[0.22em] ${sectionEyebrowToneClassName}`}
          />
        ))}
      </div>
    </SectionShell>
  );
}
