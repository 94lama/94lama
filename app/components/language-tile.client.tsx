"use client";

import React from "react";
import { LanguageEntry } from "@/src/content/portfolio/types";
import { switchLanguage } from "@/app/components/language-switch.action";

type Props = {
  language: LanguageEntry;
  className?: string;
  titleClassName?: string;
  eyebrowClassName?: string;
  locales?: string[];
};

export default function LanguageTile({
  language,
  className,
  titleClassName,
  eyebrowClassName,
}: Props) {

  return (
    <button
      onClick={() => switchLanguage(language.lang)}
      className={className}
      aria-label={`Switch site language to ${language.label}`}>
      <p className={titleClassName}>{language.label}</p>
      <p className={eyebrowClassName}>{language.level}</p>
    </button>
  );
}
