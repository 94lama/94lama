import type {
  ExperienceEntry,
  LanguageEntry,
  PortfolioContent,
  ProjectEntry,
  SkillGroup,
} from "@/src/content/portfolio/types";

const SECTION_HEADINGS = new Set([
  "Summary",
  "Core Skills",
  "Professional Experience",
  "Projects",
  "Education",
  "Languages",
  "Relocation",
]);

function normalizeLine(line: string) {
  return line.trim();
}

function stripListMarker(line: string) {
  return normalizeLine(line).replace(/^[-*]\s+/, "");
}

function parseSkillLine(line: string): SkillGroup {
  const value = stripListMarker(line);
  const separatorIndex = value.indexOf(":");

  if (separatorIndex === -1) {
    throw new Error(`Invalid skill line: ${line}`);
  }

  const category = value.slice(0, separatorIndex).trim();
  const items = value
    .slice(separatorIndex + 1)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!category || items.length === 0) {
    throw new Error(`Incomplete skill line: ${line}`);
  }

  return { category, items };
}

function parseNestedSkillItem(line: string) {
  const value = normalizeLine(line).replace(/^[-*]\s+/, "");
  const match = value.match(/^(.*?)(?::\s*\d+\/\d+)?\s*$/);
  const label = match?.[1]?.trim() ?? value.trim();

  return label;
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
      };
      continue;
    }

    if (/^\s{2,}[-*]\s+/.test(line) && currentGroup) {
      const label = parseNestedSkillItem(trimmed);

      if (label) {
        currentGroup.items.push(label);
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
      };
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
  const nameLine = normalizeLine(lines[0] ?? "");
  const roleLine = normalizeLine(lines[1] ?? "");
  const contactLine = normalizeLine(lines[2] ?? "");

  if (!nameLine.startsWith("# ")) {
    throw new Error("CV markdown must start with an H1 name line");
  }

  if (!roleLine || !contactLine) {
    throw new Error("CV markdown hero block is incomplete");
  }

  const hero = {
    name: nameLine.replace(/^#\s+/, ""),
    role: roleLine,
  };

  const contactParts = contactLine.split(" • ").map((part) => part.trim()).filter(Boolean);
  const email = contactParts.find((part) => part.includes("@"));
  const phone = contactParts.find((part) => /^[+\d\s()-]+$/.test(part));
  const locationParts = contactParts.filter((part) => part !== email && part !== phone);

  if (!email || locationParts.length === 0) {
    throw new Error("CV markdown contact line must include location and email");
  }

  const sections = splitSections(lines.slice(4));
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
    },
    projects: projects.length > 0 ? projects : undefined,
  };
}
