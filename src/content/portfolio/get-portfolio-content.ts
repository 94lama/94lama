import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import type { PortfolioContent } from "@/src/content/portfolio/types";

const CV_PATH = path.join(process.cwd(), "public/assets/cv.json");

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const content = await readFile(CV_PATH, "utf8");

  return JSON.parse(content) as PortfolioContent;
}
