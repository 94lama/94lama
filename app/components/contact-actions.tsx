import { EmailIcon, GitHubIcon, LinkedInIcon, PhoneIcon } from "@/src/app/components/portfolio-icons";
import { sectionChipClassName } from "@/src/app/components/section-card-styles";

type ContactActionProps = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

type ContactIconActionProps = {
  href: string;
  label: string;
  icon: "email" | "phone" | "github" | "linkedin";
  external?: boolean;
};

export function ContactAction({ href, label, icon }: Readonly<ContactActionProps>) {
  return (
    <a
      className={`${sectionChipClassName} inline-flex min-h-11 items-center justify-center px-5 py-3 text-sm tracking-[0.2em] text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent dark:text-white`}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {icon ? <span className="mr-2 inline-flex items-center">{icon}</span> : null}
      <span>{label}</span>
    </a>
  );
}

export function ContactIconAction({
  href,
  label,
  icon,
  external = true,
}: Readonly<ContactIconActionProps>) {
  return (
    <a
      aria-label={label}
      className={`${sectionChipClassName} inline-flex h-12 w-12 items-center justify-center px-0 py-0 text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent dark:text-white`}
      href={href}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
      title={label}
    >
      {icon === "email" ? <EmailIcon /> : null}
      {icon === "phone" ? <PhoneIcon /> : null}
      {icon === "github" ? <GitHubIcon /> : null}
      {icon === "linkedin" ? <LinkedInIcon /> : null}
    </a>
  );
}
