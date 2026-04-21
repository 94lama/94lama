import { SectionHeading } from "@/app/components/section-heading";
import { SectionShell, sectionInnerCardClassNames } from "@/app/components/section-shell";
import {
  sectionBodyToneClassName,
  sectionEyebrowToneClassName,
  sectionPillClassName,
} from "@/app/components/section-card-styles";
import type { RelocationInfo } from "@/src/content/portfolio/types";

type RelocationSectionProps = {
  relocation: RelocationInfo;
};

export function RelocationSection({ relocation }: Readonly<RelocationSectionProps>) {
  return (
    <SectionShell density="compact">
      <SectionHeading index="06" title="Relocation" />
      <div className="mt-6 space-y-5 sm:mt-7 sm:space-y-6">
        <p className={`max-w-2xl text-base leading-7 sm:text-lg ${sectionBodyToneClassName}`}>
          {relocation.summary}
        </p>

        {relocation.support?.length ? (
          <div className="grid gap-3 lg:grid-cols-3">
            {relocation.support.map((entry) => (
              <div key={entry.label} className={`${sectionInnerCardClassNames.compact} space-y-2.5`}>
                <p
                  className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${sectionEyebrowToneClassName}`}
                >
                  {entry.label}
                </p>
                <p className={`text-sm leading-6 sm:text-base sm:leading-7 ${sectionBodyToneClassName}`}>
                  {entry.value}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {relocation.preferredRegions?.length ? (
          <div className="flex flex-wrap gap-2.5">
            {relocation.preferredRegions.map((region) => (
              <span key={region} className={sectionPillClassName}>
                {region}
              </span>
            ))}
          </div>
        ) : null}

        {relocation.priorities?.length ? (
          <div className={sectionInnerCardClassNames.compact}>
            <p
              className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${sectionEyebrowToneClassName}`}
            >
              Relocation priorities
            </p>
            <ul className={`mt-4 space-y-3 text-base leading-7 ${sectionBodyToneClassName}`}>
              {relocation.priorities.map((priority) => (
                <li key={priority} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                  <span>{priority}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
