export interface HeroContent {
  name: string;
  role: string;
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
}

export interface LanguageEntry {
  label: string;
  level: string;
}

export interface RelocationInfo {
  summary: string;
  preferredRegions?: string[];
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

export interface PortfolioContent {
  hero: HeroContent;
  summary: string;
  skills: SkillGroup[];
  experience: ExperienceEntry[];
  education: string[];
  languages: LanguageEntry[];
  relocation: RelocationInfo;
  contact: ContactInfo;
  projects?: ProjectEntry[];
}
