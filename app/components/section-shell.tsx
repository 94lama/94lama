import { sectionCardClassName, sectionPanelClassName } from "@/app/components/section-card-styles";

type SectionShellProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export const sectionShellClassName = `${sectionPanelClassName} px-5 py-6 sm:px-6 sm:py-7 xl:px-8`;

export const sectionGlowClassName =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_28%)]";

export const sectionInnerCardClassName = `${sectionCardClassName} px-4 py-4`;

export function SectionShell({
  children,
  className,
  contentClassName = "relative",
}: Readonly<SectionShellProps>) {
  return (
    <article className={className ? `${sectionShellClassName} ${className}` : sectionShellClassName}>
      <div className={sectionGlowClassName} />
      <div className={contentClassName}>{children}</div>
    </article>
  );
}
