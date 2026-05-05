import {
  sectionCardClassName,
  sectionEyebrowToneClassName,
  sectionTitleToneClassName,
} from "@/components/section-card-styles";

export function HeroBasedIn({ location, relocationSummary }: { location?: string; relocationSummary?: string }) {
  const contactLocation = typeof location === "string" ? location : "";
  const relocation = typeof relocationSummary === "string" ? relocationSummary : "";

  return (
    <div data-draggable-item data-draggable-id="hero-based-in" className={`${sectionCardClassName} overflow-hidden @container rounded-3xl p-5 sm:max-w-2xl sm:grid-cols-2 `}>
      <div className="flex flex-wrap @md:grid @md:grid-cols-2 gap-6 sm:gap-8">
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
