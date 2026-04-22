import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  ExperienceEntry,
  PortfolioBaseContent,
  PortfolioContent,
} from "@/src/content/portfolio/types";

const CV_PATH = path.join(process.cwd(), "public/assets/cv.json");
const EXPERIENCE_PATH = path.join(process.cwd(), "public/assets/experience.json");

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const [content, experienceContent] = await Promise.all([
    readFile(CV_PATH, "utf8"),
    readFile(EXPERIENCE_PATH, "utf8"),
  ]);

  const portfolio = JSON.parse(content) as PortfolioBaseContent;
  const experience = JSON.parse(experienceContent) as ExperienceEntry[];

  return {
    ...portfolio,
    experience,
  };
}
