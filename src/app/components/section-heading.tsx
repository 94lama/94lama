import {
  sectionBodyToneClassName,
  sectionEyebrowToneClassName,
} from "@/src/app/components/section-card-styles";

type SectionHeadingProps = {
  index: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  index,
  title,
  description,
}: Readonly<SectionHeadingProps>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-accent px-3 py-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent-foreground">
          {index}
        </span>
        <p
          className={`font-mono text-[0.72rem] font-semibold uppercase tracking-[0.26em] ${sectionEyebrowToneClassName}`}
        >
          {title}
        </p>
      </div>
      {description ? (
        <p className={`max-w-2xl text-base leading-7 ${sectionBodyToneClassName}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
