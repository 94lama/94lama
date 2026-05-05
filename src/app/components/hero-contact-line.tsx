import { ContactIconAction } from "@/components/contact-actions";
import {
  sectionCardClassName,
  sectionEyebrowToneClassName,
} from "@/components/section-card-styles";
import type { ContactInfo } from "@/src/content/portfolio/types";

export function HeroContactLine({ contact }: { contact: ContactInfo | undefined }) {
  if (!contact) return null;

  const actions = [
    { href: `mailto:${contact.email}`, label: "Email", icon: "email" as const, external: false },
    contact.phone
      ? { href: `tel:${contact.phone.replace(/\s+/g, "")}`, label: "Phone", icon: "phone" as const, external: false }
      : null,
    contact.github
      ? { href: contact.github, label: "GitHub", icon: "github" as const, external: true }
      : null,
    contact.linkedin
      ? { href: contact.linkedin, label: "LinkedIn", icon: "linkedin" as const, external: true }
      : null,
  ].filter((a): a is { href: string; label: string; icon: "email" | "phone" | "github" | "linkedin"; external: boolean } => Boolean(a));

  return (
    <div data-draggable-item data-draggable-id="hero-contact-line" className={`${sectionCardClassName} @container flex flex-wrap gap-4 rounded-3xl p-5 sm:max-w-3xl sm:flex-row sm:items-center sm:justify-between sm:gap-6`}>
      <h3 className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}>
        Contact line
      </h3>
      <div className="flex flex-wrap @md:grid @md:grid-cols-2 gap-4 sm:justify-end">
        {actions.map((action) => (
          <ContactIconAction key={action.label} external={action.external} href={action.href} icon={action.icon} label={action.label} />
        ))}
      </div>
    </div>
  );
}
