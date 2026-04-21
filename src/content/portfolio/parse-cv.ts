import type {
  ExperienceEntry,
  HeroPhoto,
  LanguageEntry,
  PortfolioContent,
  ProjectEntry,
  SkillEntry,
  SkillGroup,
} from "./types.ts";

const SECTION_HEADINGS = new Set([
  "Summary",
  "Core Skills",
  "Professional Experience",
  "Projects",
  "Education",
  "Languages",
  "Relocation",
  "Contact",
]);

function normalizeLine(line: string) {
  return line.trim();
}

function stripListMarker(line: string) {
  return normalizeLine(line).replace(/^[-*]\s+/, "");
}

function parseSkillToken(value: string): SkillEntry {
  const match = value.trim().match(/^(.*?)(?::\s*(\d+)\/(\d+))?\s*$/);
  const label = match?.[1]?.trim() ?? value.trim();
  const numerator = match?.[2] ? Number(match[2]) : undefined;
  const denominator = match?.[3] ? Number(match[3]) : undefined;
  const knowledge =
    numerator !== undefined && denominator && denominator > 0
      ? numerator / denominator
      : undefined;

  return {
    label,
    knowledge,
  };
}

function parseSkillLine(line: string): SkillGroup {
  const value = stripListMarker(line);
  const separatorIndex = value.indexOf(":");

  if (separatorIndex === -1) {
    throw new Error(`Invalid skill line: ${line}`);
  }

  const category = value.slice(0, separatorIndex).trim();
  const entries = value
    .slice(separatorIndex + 1)
    .split(",")
    .map((item) => parseSkillToken(item))
    .filter((item) => item.label);
  const items = entries.map((entry) => entry.label);

  if (!category || items.length === 0) {
    throw new Error(`Incomplete skill line: ${line}`);
  }

  return { category, items, entries };
}

function parseNestedSkillItem(line: string) {
  const value = normalizeLine(line).replace(/^[-*]\s+/, "");

  return parseSkillToken(value);
}

function parseSkills(lines: string[]) {
  const normalizedLines = lines.filter((line) => normalizeLine(line));

  const hasNestedGroups = normalizedLines.some(
    (line) => /^\s{2,}[-*]\s+/.test(line) || /^[-*]\s+[^:]+:\s*$/.test(normalizeLine(line)),
  );

  if (!hasNestedGroups) {
    return normalizedLines.map(normalizeLine).map(parseSkillLine);
  }

  const groups: SkillGroup[] = [];
  let currentGroup: SkillGroup | null = null;

  for (const rawLine of normalizedLines) {
    const line = rawLine.trimEnd();
    const trimmed = normalizeLine(line);

    if (/^[-*]\s+[^:]+:\s*$/.test(trimmed)) {
      if (currentGroup) {
        groups.push(currentGroup);
      }

      currentGroup = {
        category: trimmed.replace(/^[-*]\s+/, '').replace(/:\s*$/, '').trim(),
        items: [],
        entries: [],
      };
      continue;
    }

    if (/^\s{2,}[-*]\s+/.test(line) && currentGroup) {
      const entry = parseNestedSkillItem(trimmed);

      if (entry.label) {
        currentGroup.items.push(entry.label);
        currentGroup.entries.push(entry);
      }

      continue;
    }

    throw new Error(`Unrecognized skill line: ${rawLine}`);
  }

  if (currentGroup) {
    groups.push(currentGroup);
  }

  if (groups.length === 0 || groups.some((group) => !group.category || group.items.length === 0)) {
    throw new Error('Core Skills section is incomplete');
  }

  return groups;
}

function parseExperienceHeader(line: string) {
  const match = line.match(/^(.*?)\s+[–-]\s+(.*?)\s+\((.*?)\)$/);

  if (!match) {
    return null;
  }

  const [, role, company, dateRange] = match;

  return {
    role: role.trim(),
    company: company.trim(),
    dateRange: dateRange.trim(),
  };
}

function parseExperience(lines: string[]): ExperienceEntry[] {
  const entries: ExperienceEntry[] = [];
  let current: ExperienceEntry | null = null;

  for (const rawLine of lines) {
    const line = normalizeLine(rawLine);

    if (!line) {
      continue;
    }

    const header = parseExperienceHeader(line);
    if (header) {
      if (current) {
        entries.push(current);
      }

      current = {
        ...header,
        highlights: [],
        relatedDomains: [],
        relatedSkills: [],
      };
      continue;
    }

    const relatedDomainsMatch = line.match(/^Related Domains:\s*(.+)$/i);
    if (relatedDomainsMatch && current) {
      current.relatedDomains = relatedDomainsMatch[1]
        .split(",")
        .map((domain) => normalizeLine(domain))
        .filter(Boolean);
      continue;
    }

    const relatedSkillsMatch = line.match(/^Related Skills:\s*(.+)$/i);
    if (relatedSkillsMatch && current) {
      current.relatedSkills = relatedSkillsMatch[1]
        .split(",")
        .map((skill) => normalizeLine(skill))
        .filter(Boolean);
      continue;
    }

    if (line.startsWith("-") && current) {
      current.highlights.push(stripListMarker(line));
      continue;
    }

    if (current && current.highlights.length > 0) {
      const lastHighlight = current.highlights[current.highlights.length - 1];
      current.highlights[current.highlights.length - 1] = `${lastHighlight} ${line}`;
      continue;
    }

    throw new Error(`Unrecognized experience line: ${rawLine}`);
  }

  if (current) {
    entries.push(current);
  }

  return entries;
}

function parseLanguages(lines: string[]): LanguageEntry[] {
  return lines
    .flatMap((line) => line.split(","))
    .map((entry) => normalizeLine(entry))
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(.*?)\s+\((.*?)\)$/);

      if (!match) {
        throw new Error(`Invalid language entry: ${entry}`);
      }

      const [, label, level] = match;

      return {
        label: label.trim(),
        level: level.trim(),
      };
    });
}

function parseProjects(lines: string[]): ProjectEntry[] {
  return lines
    .map((line) => stripListMarker(line))
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(" – ");

      if (separatorIndex === -1) {
        return { name: line };
      }

      return {
        name: line.slice(0, separatorIndex).trim(),
        description: line.slice(separatorIndex + 3).trim(),
      };
    });
}

function parseRelocation(lines: string[]) {
  const summary = lines.map(normalizeLine).filter(Boolean).join(" ");
  const preferredRegionsMatch = summary.match(/\((.*?) preferred\)/i);
  const preferredRegions = preferredRegionsMatch?.[1]
    .split(",")
    .map((region) => region.trim())
    .filter(Boolean);

  return {
    summary,
    preferredRegions:
      preferredRegions && preferredRegions.length > 0 ? preferredRegions : undefined,
  };
}

function parseContactLinks(lines: string[]) {
  const links = lines
    .map(stripListMarker)
    .filter(Boolean)
    .reduce<{
      github?: string;
      linkedin?: string;
    }>((accumulator, line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        throw new Error(`Invalid contact entry: ${line}`);
      }

      const label = line.slice(0, separatorIndex).trim().toLowerCase();
      const value = line.slice(separatorIndex + 1).trim();

      if (!value) {
        throw new Error(`Missing contact URL for: ${label}`);
      }

      if (label === "github") {
        accumulator.github = value;
      }

      if (label === "linkedin") {
        accumulator.linkedin = value;
      }

      return accumulator;
    }, {});

  return links;
}

function parseHeroPhoto(line: string, heroName: string): HeroPhoto | undefined {
  const match = line.match(/^Profile Photo:\s*(.+)$/i);
  const value = match?.[1]?.trim();

  if (!value || !value.startsWith("/assets/")) {
    return undefined;
  }

  return {
    src: value,
    alt: `Profile photo of ${heroName}`,
  };
}

function splitSections(lines: string[]) {
  const sections = new Map<string, string[]>();
  let currentSection: string | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("## ")) {
      const heading = line.slice(3).trim();

      if (!SECTION_HEADINGS.has(heading)) {
        throw new Error(`Unexpected section heading: ${heading}`);
      }

      currentSection = heading;
      sections.set(currentSection, []);
      continue;
    }

    if (currentSection) {
      sections.get(currentSection)?.push(line);
    }
  }

  return sections;
}

function requireSection(sections: Map<string, string[]>, name: string) {
  const value = sections.get(name);

  if (!value || value.length === 0) {
    throw new Error(`Missing section: ${name}`);
  }

  return value;
}

export function parseCvMarkdown(markdown: string): PortfolioContent {
  const lines = markdown.split(/\r?\n/);
  const firstSectionIndex = lines.findIndex((line) => line.startsWith("## "));

  if (firstSectionIndex === -1) {
    throw new Error("CV markdown must include section headings");
  }

  const heroLines = lines
    .slice(0, firstSectionIndex)
    .map(normalizeLine)
    .filter(Boolean);
  const nameLine = heroLines[0] ?? "";
  const roleLine = heroLines[1] ?? "";
  const contactLine = heroLines[2] ?? "";

  if (!nameLine.startsWith("# ")) {
    throw new Error("CV markdown must start with an H1 name line");
  }

  if (!roleLine || !contactLine) {
    throw new Error("CV markdown hero block is incomplete");
  }

  const heroName = nameLine.replace(/^#\s+/, "");
  const photoLine = heroLines.slice(3).find((line) => /^Profile Photo:\s*/i.test(line));
  const hero = {
    name: heroName,
    role: roleLine,
    photo: photoLine ? parseHeroPhoto(photoLine, heroName) : undefined,
  };

  const contactParts = contactLine.split(" • ").map((part) => part.trim()).filter(Boolean);
  const email = contactParts.find((part) => part.includes("@"));
  const phone = contactParts.find((part) => /^[+\d\s()-]+$/.test(part));
  const locationParts = contactParts.filter((part) => part !== email && part !== phone);

  if (!email || locationParts.length === 0) {
    throw new Error("CV markdown contact line must include location and email");
  }

  const sections = splitSections(lines.slice(firstSectionIndex));
  const summary = requireSection(sections, "Summary")
    .map(normalizeLine)
    .filter(Boolean)
    .join(" ");
  const skills = parseSkills(requireSection(sections, "Core Skills"));
  const experience = parseExperience(requireSection(sections, "Professional Experience"));
  const education = requireSection(sections, "Education")
    .map(stripListMarker)
    .filter(Boolean);
  const languages = parseLanguages(requireSection(sections, "Languages"));
  const relocation = parseRelocation(requireSection(sections, "Relocation"));
  const contactLinks = sections.has("Contact")
    ? parseContactLinks(requireSection(sections, "Contact"))
    : {};
  const projectsSection = sections.get("Projects") ?? [];
  const projects = parseProjects(projectsSection.filter((line) => normalizeLine(line)));

  return {
    hero,
    summary,
    skills,
    experience,
    education,
    languages,
    relocation,
    contact: {
      location: locationParts.join(" • "),
      email,
      phone,
      github: contactLinks.github,
      linkedin: contactLinks.linkedin,
    },
    projects: projects.length > 0 ? projects : undefined,
  };
}
