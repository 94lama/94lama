"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  sectionCardClassName,
  sectionChipClassName,
  sectionEyebrowToneClassName,
} from "@/src/app/components/section-card-styles";
import { isLocale } from "@/i18n/request";
import type { LanguageEntry } from "@/src/content/portfolio/types";

type HeroLanguagesProps = {
  languages: LanguageEntry[];
  draggable?: boolean;
};

export default function HeroLanguages({ languages, draggable = false }: Readonly<HeroLanguagesProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const changeLocale = (lang: string) => {
    if (!pathname) return;
    const segments = pathname.split("/");
    if (segments.length > 1 && isLocale(segments[1])) segments[1] = lang;
    else segments.splice(1, 0, lang);
    const newPath = segments.join("/") || "/";
    const qs = searchParams ? `?${searchParams.toString()}` : "";
    router.push(newPath + qs);
  };

  if (!languages || languages.length === 0) return null;

  const currentLocale = pathname?.split("/")[1];
  const dragProps = draggable
    ? { "data-draggable-item": true, "data-delegate-auto-height": true, "data-draggable-id": "hero-languages" }
    : { "data-draggable-id": "hero-languages" };

  return (
    <div
      {...dragProps}
      className={`${sectionCardClassName} w-full space-y-3 rounded-3xl p-4 sm:w-auto sm:p-5`}
    >
      <p className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}>
        Languages
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {languages.map((language) => {
          const isActive = Boolean(
            currentLocale && isLocale(currentLocale) && currentLocale === language.lang,
          );
          return (
            <button
              key={language.lang}
              type="button"
              onClick={() => changeLocale(language.lang)}
              title={`Switch to ${language.label}`}
              aria-label={`Switch language to ${language.label}`}
              aria-pressed={isActive}
              className={`${sectionChipClassName} inline-flex h-9 w-9 items-center justify-center p-0 text-slate-800 dark:text-white sm:h-10 sm:w-10 ${isActive ? "bg-accent/10" : ""}`}
            >
              <span className="sr-only">{language.label}</span>
              <FlagIcon code={language.lang} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FlagIcon({ code }: Readonly<{ code: string }>) {
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
