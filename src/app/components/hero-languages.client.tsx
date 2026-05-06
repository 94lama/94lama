"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { sectionCardClassName, sectionEyebrowToneClassName, sectionPillClassName, sectionTitleToneClassName } from "@/src/app/components/section-card-styles";
import type { LanguageEntry } from "@/src/content/portfolio/types";
import { isLocale } from "@/i18n/request";

export default function HeroLanguages({ languages }: { languages: LanguageEntry[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const changeLocale = (lang: string) => {
    if (!pathname) return;
    const segments = pathname.split("/");
    // ensure leading empty segment for root
    if (segments.length > 1 && isLocale(segments[1])) segments[1] = lang;
    else segments.splice(1, 0, lang);
    const newPath = segments.join("/") || "/";
    const qs = searchParams ? `?${searchParams.toString()}` : "";
    router.push(newPath + qs);
  };

  if (!languages || languages.length === 0) return null;

  return (
    <div data-draggable-item data-draggable-id="hero-languages" className={`${sectionCardClassName} space-y-3 rounded-3xl p-5`}>
      <p className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}>
        Languages
      </p>
      <div className="flex flex-wrap gap-2">
        {languages.map((l) => (
          <button
            key={l.label}
            onClick={() => changeLocale(l.lang)}
            title={`Switch to ${l.label}`}
            aria-label={`Switch language to ${l.label}`}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${sectionPillClassName}`}
          >
            <FlagIcon code={l.lang} />
            <span className="font-semibold">{l.label}</span>
            <span className={`ml-2 text-sm ${sectionTitleToneClassName}`}>{l.level}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FlagIcon({ code }: { code: string }) {
  if (code === "it") {
    return (
      <svg width="20" height="14" viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden>
        <rect width="1" height="2" x="0" y="0" fill="#009246" />
        <rect width="1" height="2" x="1" y="0" fill="#FFFFFF" />
        <rect width="1" height="2" x="2" y="0" fill="#CE2B37" />
      </svg>
    );
  }
  if (code === "fr") {
    return (
      <svg width="20" height="14" viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden>
        <rect width="1" height="2" x="0" y="0" fill="#0055A4" />
        <rect width="1" height="2" x="1" y="0" fill="#FFFFFF" />
        <rect width="1" height="2" x="2" y="0" fill="#EF4135" />
      </svg>
    );
  }
  // default: english (use UK flag simplified)
  return (
    <svg width="20" height="14" viewBox="0 0 60 30" aria-hidden>
      <rect width="60" height="30" fill="#00247d" />
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#cf142b" strokeWidth="4" />
      <path d="M30 0 L30 30 M0 15 L60 15" stroke="#fff" strokeWidth="10" />
      <path d="M30 0 L30 30 M0 15 L60 15" stroke="#cf142b" strokeWidth="6" />
    </svg>
  );
}
