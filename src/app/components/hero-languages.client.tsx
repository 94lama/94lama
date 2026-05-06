"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { sectionCardClassName, sectionEyebrowToneClassName, sectionChipClassName } from "@/src/app/components/section-card-styles";
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

  const currentLocale = pathname?.split("/")[1];

  return (
    <div data-draggable-item data-draggable-id="hero-languages" className={`${sectionCardClassName} space-y-3 rounded-3xl p-5`}>
      <p className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}>
        Languages
      </p>
      <div className="flex items-center gap-3">
        {languages.map((l) => {
          const isActive = currentLocale && isLocale(currentLocale) && currentLocale === l.lang;
          return (
            <button
              key={l.lang}
              type="button"
              onClick={() => changeLocale(l.lang)}
              title={`Switch to ${l.label}`}
              aria-label={`Switch language to ${l.label}`}
              aria-pressed={isActive}
              className={`${sectionChipClassName} inline-flex h-10 w-10 items-center justify-center p-0 text-slate-800 dark:text-white ${isActive ? "bg-accent/10" : ""}`}
            >
              <span className="sr-only">{l.label}</span>
              <FlagIcon code={l.lang} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FlagIcon({ code }: { code: string }) {
  if (code === "it") {
    return (
      <svg width="18" height="12" viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden>
        <rect width="1" height="2" x="0" y="0" fill="#009246" />
        <rect width="1" height="2" x="1" y="0" fill="#FFFFFF" />
        <rect width="1" height="2" x="2" y="0" fill="#CE2B37" />
      </svg>
    );
  }
  if (code === "fr") {
    return (
      <svg width="18" height="12" viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden>
        <rect width="1" height="2" x="0" y="0" fill="#0055A4" />
        <rect width="1" height="2" x="1" y="0" fill="#FFFFFF" />
        <rect width="1" height="2" x="2" y="0" fill="#EF4135" />
      </svg>
    );
  }
  // default: english (use simplified UK/union jack)
  return (
    <svg width="18" height="12" viewBox="0 0 60 30" aria-hidden>
      <rect width="60" height="30" fill="#00247d" />
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#cf142b" strokeWidth="4" />
      <path d="M30 0 L30 30 M0 15 L60 15" stroke="#fff" strokeWidth="10" />
      <path d="M30 0 L30 30 M0 15 L60 15" stroke="#cf142b" strokeWidth="6" />
    </svg>
  );
}
