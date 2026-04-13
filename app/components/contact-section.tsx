import { ContactIconAction } from "@/app/components/contact-actions";
import { EmailIcon } from "@/app/components/portfolio-icons";
import { SectionHeading } from "@/app/components/section-heading";
import { SectionShell, sectionInnerCardClassName } from "@/app/components/section-shell";
import {
  sectionBodyToneClassName,
  sectionEyebrowToneClassName,
  sectionTitleToneClassName,
} from "@/app/components/section-card-styles";
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
    <SectionShell>
      <SectionHeading index="06" title="Contact" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className={`${sectionInnerCardClassName} sm:col-span-2`}>
          <p
            className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
          >
            Primary CTA
          </p>
          <a
            aria-label={`Email ${contact.email}`}
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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

        <div className={sectionInnerCardClassName}>
          <p
            className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
          >
            Email
          </p>
          <a
            className={`mt-3 block break-all text-base leading-7 underline decoration-slate-300 underline-offset-4 transition hover:decoration-accent dark:decoration-white/18 ${sectionTitleToneClassName}`}
            href={`mailto:${contact.email}`}
          >
            {contact.email}
          </a>
        </div>

        <div className={sectionInnerCardClassName}>
          <p
            className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
          >
            Location
          </p>
          <p className={`mt-3 text-base leading-7 ${sectionBodyToneClassName}`}>
            {contact.location}
          </p>
        </div>

        {contact.phone ? (
          <div className={`${sectionInnerCardClassName} sm:col-span-2`}>
            <p
              className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}
            >
              Phone
            </p>
            <p className={`mt-3 text-base leading-7 ${sectionBodyToneClassName}`}>{contact.phone}</p>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
