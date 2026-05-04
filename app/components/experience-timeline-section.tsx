"use client";

import { animate, remove } from "@/app/lib/animation";
import { useLayoutEffect, useRef } from "react";

import { ExperienceCard } from "@/app/components/experience-card";
import {
  sectionBodyToneClassName,
  sectionCardClassName,
  sectionContinuityPendingClassName,
  sectionContinuityShellClassName,
  sectionEyebrowToneClassName,
} from "@/app/components/section-card-styles";
import type { RankedExperienceEntry } from "@/src/content/portfolio/rank-experience-by-selection";

type ExperienceTimelineSectionProps = {
  entries: RankedExperienceEntry[];
  helperCopy: string;
  isFallback: boolean;
  pending: boolean;
  pendingHelperCopy: string | null;
  pendingSelectionKind: string | null;
  pendingSelectionLabel: string | null;
};

export function ExperienceTimelineSection({
  entries,
  helperCopy,
  isFallback,
  pending,
  pendingHelperCopy,
  pendingSelectionKind,
  pendingSelectionLabel,
}: Readonly<ExperienceTimelineSectionProps>) {
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const highlightedCount = entries.filter((entry) => entry.isHighlighted).length;

  useLayoutEffect(() => {
    const orderedNodes = entries
      .map((item) => itemRefs.current.get(`${item.entry.role}-${item.entry.company}-${item.entry.dateRange}`))
      .filter((node): node is HTMLDivElement => node !== undefined);

    for (const node of orderedNodes) {
      remove(node);
    }

    if (orderedNodes.length === 0) {
      return;
    }

    animate(orderedNodes, {
      translateX: [48, 0],
      opacity: [0, 1],
      duration: 720,
      delay: (_, index) => index * 55,
      ease: "inOutCubic",
    });
  }, [entries]);

  return (
    <div className="space-y-5">
      <div
        className={`${sectionCardClassName} ${sectionContinuityShellClassName} ${pending ? sectionContinuityPendingClassName : ""} space-y-3 p-5`}
      >
        <p className={`max-w-3xl text-sm leading-7 ${sectionBodyToneClassName}`}>
          {helperCopy}
        </p>
        <p
          className={`text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
        >
          {isFallback
            ? "Full timeline visible"
            : `${highlightedCount} related entr${highlightedCount === 1 ? "y" : "ies"} moved to the top`}
        </p>
        {pending ? (
          <p className={`text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${sectionEyebrowToneClassName}`}>
            Pending {pendingSelectionKind ?? "selection"}: {pendingSelectionLabel ?? "Next focus"}. {pendingHelperCopy ?? "Keeping the full timeline visible during the handoff."}
          </p>
        ) : null}
      </div>

      <div className="space-y-5">
        {entries.map((item, index) => (
          <div
            key={`${item.entry.role}-${item.entry.company}-${item.entry.dateRange}`}
            ref={(node) => {
              const itemKey = `${item.entry.role}-${item.entry.company}-${item.entry.dateRange}`;

              if (node) {
                itemRefs.current.set(itemKey, node);
                return;
              }

              itemRefs.current.delete(itemKey);
            }}
            className="will-change-transform"
          >
            <ExperienceCard
              entry={item.entry}
              index={index}
              isHighlighted={item.isHighlighted}
              matchScore={item.matchScore}
              matchedTerms={item.matchedTerms}
              pending={pending}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
