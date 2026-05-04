import { ContactIconAction } from "@/src/app/components/contact-actions";
import { EmailIcon } from "@/src/app/components/portfolio-icons";
import { SectionHeading } from "@/src/app/components/section-heading";
import { SectionShell, sectionInnerCardClassNames } from "@/src/app/components/section-shell";
import {
  sectionBodyToneClassName,
  sectionEyebrowToneClassName,
  sectionPrimaryActionClassName,
  sectionTitleToneClassName,
} from "@/src/app/components/section-card-styles";
import type { ContactInfo } from "@/src/content/portfolio/types";

type ContactSectionProps = {
  contact: ContactInfo;
};

function getSecondaryContactActions(contact: ContactInfo) {
  return [
    contact.github ? { href: contact.github, label: "GitHub" as const } : null,
    contact.linkedin ? { href: contact.linkedin, label: "LinkedIn" as const } : null,
  ].filter((action): action is { href: string; label: "GitHub" | "LinkedIn" } => Boolean(action));
}

export function ContactSection({ contact }: Readonly<ContactSectionProps>) {
  const secondaryContactActions = getSecondaryContactActions(contact);

  return (
    <SectionShell density="compact">
      <SectionHeading index="06" title="Contact" />
      <div className="mt-6 grid gap-3 sm:mt-7 sm:grid-cols-2">
        <div className={`${sectionInnerCardClassNames.compact} sm:col-span-2`}>
          <p
            className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
          >
            Primary CTA
          </p>
          <a
            aria-label={`Email ${contact.email}`}
            className={`mt-4 ${sectionPrimaryActionClassName}`}
            href={`mailto:${contact.email}`}
          >
            <span className="mr-2 inline-flex items-center">
              <EmailIcon />
            </span>
            <span>Email me</span>
          </a>
          {secondaryContactActions.length ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {secondaryContactActions.map((action) => (
                <ContactIconAction
                  key={`contact-${action.label}`}
                  href={action.href}
                  icon={action.label === "GitHub" ? "github" : "linkedin"}
                  label={action.label}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className={`${sectionInnerCardClassNames.compact} space-y-2`}>
          <p
            className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
          >
            Email
          </p>
          <a className={`motion-control block break-all text-base leading-7 underline decoration-slate-300 underline-offset-4 transition-colors duration-300 hover:decoration-accent dark:decoration-white/18 ${sectionTitleToneClassName}`} href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </div>

        <div className={`${sectionInnerCardClassNames.compact} space-y-2`}>
          <p
            className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
          >
            Location
          </p>
          <p className={`text-base leading-7 ${sectionBodyToneClassName}`}>{contact.location}</p>
        </div>

        {contact.phone ? (
          <div className={`${sectionInnerCardClassNames.compact} space-y-2 sm:col-span-2`}>
            <p
              className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
            >
              Phone
            </p>
            <p className={`text-base leading-7 ${sectionBodyToneClassName}`}>{contact.phone}</p>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
