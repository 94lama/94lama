import { readFile } from "node:fs/promises";
import path from "node:path";

import { parseCvMarkdown } from "@/src/content/portfolio/parse-cv";
import type { PortfolioContent } from "@/src/content/portfolio/types";

const CV_PATH = path.join(process.cwd(), "public/assets/cv.md");

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const markdown = await readFile(CV_PATH, "utf8");

  return parseCvMarkdown(markdown);
}
