import { SectionHeading } from "@/app/components/section-heading";
import { SectionShell, sectionInnerCardClassName } from "@/app/components/section-shell";
import { sectionBodyToneClassName } from "@/app/components/section-card-styles";

type EducationSectionProps = {
  education: string[];
};

export function EducationSection({ education }: Readonly<EducationSectionProps>) {
  return (
    <SectionShell>
      <SectionHeading index="03" title="Education" />
      <ul className="mt-8 space-y-4">
        {education.map((entry) => (
          <li
            key={entry}
            className={`${sectionInnerCardClassName} ${sectionBodyToneClassName} text-base leading-7`}
          >
            {entry}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
