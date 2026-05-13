import { ContactIconAction } from "@/components/contact-actions";
import {
  sectionCardClassName,
  sectionEyebrowToneClassName,
} from "@/components/section-card-styles";
import type { ContactInfo } from "@/src/content/portfolio/types";

type HeroContactLineProps = {
  contact?: ContactInfo;
  draggable?: boolean;
};

export function HeroContactLine({ contact, draggable = false }: Readonly<HeroContactLineProps>) {
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

  const dragProps = draggable
    ? { "data-draggable-item": true, "data-delegate-auto-height": true, "data-draggable-id": "hero-contact-line" }
    : { "data-draggable-id": "hero-contact-line" };

  return (
    <div
      {...dragProps}
      className={`${sectionCardClassName} @container flex w-full flex-col gap-4 rounded-3xl p-4 sm:max-w-3xl sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5`}
    >
      <h3 className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${sectionEyebrowToneClassName}`}>
        Contact line
      </h3>
      <div className="flex flex-wrap gap-3 @md:grid @md:grid-cols-2 sm:justify-end sm:gap-4">
        {actions.map((action) => (
          <ContactIconAction key={action.label} external={action.external} href={action.href} icon={action.icon} label={action.label} />
        ))}
      </div>
    </div>
  );
}
