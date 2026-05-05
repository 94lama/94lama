import { LanguageEntry } from "@/src/content/portfolio/types";

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
    <article className={className} aria-label={`${language.label}: ${language.level}`}>
      <p className={titleClassName}>{language.label}</p>
      <p className={eyebrowClassName}>{language.level}</p>
    </article>
  );
}
