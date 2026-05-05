import { sectionCardClassName, sectionEyebrowToneClassName, sectionPillClassName } from "@/components/section-card-styles";

export function HeroPreferredRegions({ preferredRegions }: { preferredRegions?: string[] }) {
  const regions = Array.isArray(preferredRegions) ? preferredRegions : [];

  return (
    <div data-draggable-item data-draggable-id="hero-preferred-regions" className={`${sectionCardClassName} space-y-3 rounded-3xl p-5`}>
      <p className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}>
        Preferred regions
      </p>
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => (
          <span key={region} className={sectionPillClassName}>
            {region}
          </span>
        ))}
      </div>
    </div>
  );
}
