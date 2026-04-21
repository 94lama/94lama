export interface HeroPhoto {
  src: string;
  alt: string;
}

export interface HeroContent {
  name: string;
  role: string;
  photo?: HeroPhoto;
}

export interface SkillEntry {
  label: string;
  knowledge?: number;
}

export interface SkillGroup {
  category: string;
  items: string[];
  entries: SkillEntry[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  dateRange: string;
  highlights: string[];
  relatedDomains: string[];
  relatedSkills: string[];
}

export interface LanguageEntry {
  label: string;
  level: string;
}

export interface CertificateEntry {
  title: string;
  issuer?: string;
  year?: string;
}

export interface RelocationInfo {
  summary: string;
  preferredRegions?: string[];
  support?: {
    label: string;
    value: string;
  }[];
  priorities?: string[];
}

export interface ContactInfo {
  location: string;
  email: string;
  phone?: string;
  github?: string;
  linkedin?: string;
}

export interface ProjectEntry {
  name: string;
  description?: string;
}

export type PortfolioBaseContent = Omit<PortfolioContent, "experience">;

export interface PortfolioContent {
  hero: HeroContent;
  summary: string;
  skills: SkillGroup[];
  experience: ExperienceEntry[];
  education: string[];
  certificates?: CertificateEntry[];
  languages: LanguageEntry[];
  relocation: RelocationInfo;
  contact: ContactInfo;
  projects?: ProjectEntry[];
}
