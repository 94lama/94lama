import {
  sectionCardClassName,
  sectionPanelClassName,
} from "@/app/components/section-card-styles";
import { sectionRhythm } from "@/app/components/layout/page-rhythm";

type SectionShellProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  density?: keyof typeof sectionRhythm;
};

export const sectionShellClassName = sectionPanelClassName;

export const sectionGlowClassName =
  "pointer-events-none absolute inset-0";

export const sectionInnerCardClassNames = {
  comfortable: `${sectionCardClassName} ${sectionRhythm.comfortable.inner}`,
  compact: `${sectionCardClassName} ${sectionRhythm.compact.inner}`,
} as const;

export const sectionInnerCardClassName = sectionInnerCardClassNames.comfortable;

export function SectionShell({
  children,
  className,
  contentClassName = "relative",
  density = "comfortable",
}: Readonly<SectionShellProps>) {
  const shellClassName = `${sectionShellClassName} ${sectionRhythm[density].shell}`;

  return (
    <article className={className ? `${shellClassName} ${className}` : shellClassName}>
      <div className={sectionGlowClassName} />
      <div className={contentClassName}>{children}</div>
    </article>
  );
}
