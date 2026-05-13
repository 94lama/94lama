import {
  sectionCardClassName,
  sectionEyebrowToneClassName,
  sectionTitleToneClassName,
} from "@/components/section-card-styles";

type HeroBasedInProps = {
  location?: string;
  relocationSummary?: string;
  draggable?: boolean;
};

export function HeroBasedIn({ location, relocationSummary, draggable = false }: Readonly<HeroBasedInProps>) {
  const contactLocation = typeof location === "string" ? location : "";
  const relocation = typeof relocationSummary === "string" ? relocationSummary : "";
  const dragProps = draggable
    ? { "data-draggable-item": true, "data-delegate-auto-height": true, "data-draggable-id": "hero-based-in" }
    : { "data-draggable-id": "hero-based-in" };

  return (
    <div
      {...dragProps}
      className={`${sectionCardClassName} @container w-full overflow-hidden rounded-3xl p-4 sm:max-w-2xl sm:p-5`}
    >
      <div className="flex flex-col gap-5 @md:grid @md:grid-cols-2 sm:gap-8">
        <div className="space-y-2">
          <h4 className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}>
            Based in
          </h4>
          <p className={`text-base font-medium ${sectionTitleToneClassName} sm:text-lg`}>{contactLocation}</p>
        </div>
        <div className="space-y-2">
          <h4 className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}>
            Relocation
          </h4>
          <p className={`text-base font-medium ${sectionTitleToneClassName} sm:text-lg`}>{relocation}</p>
        </div>
      </div>
    </div>
  );
}
