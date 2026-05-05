import { SectionHeading } from "@/components/section-heading";
import { SectionShell, sectionInnerCardClassNames } from "@/components/section-shell";
import { sectionBodyToneClassName } from "@/components/section-card-styles";

type EducationSectionProps = {
  education: string[];
};

export function EducationSection({ education }: Readonly<EducationSectionProps>) {
  return (
    <SectionShell density="compact">
      <SectionHeading index="03" title="Education" />
      <ul className="mt-6 grid gap-3 sm:mt-7">
        {education.map((entry) => (
          <li
            key={entry}
            className={`${sectionInnerCardClassNames.compact} ${sectionBodyToneClassName} text-base leading-7`}
          >
            {entry}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
