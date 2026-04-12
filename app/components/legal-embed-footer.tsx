import { readFileSync } from "node:fs";
import { join } from "node:path";
import Script from "next/script";

const COMPONENTS_DIR = join(process.cwd(), "app/components");
const COOKIE_POLICY_PATH = join(COMPONENTS_DIR, "cookie-policy.html");
const PRIVACY_POLICY_PATH = join(COMPONENTS_DIR, "privacy-policy.html");

type LegalPolicySnippet = {
  href: string;
  className: string;
  title: string;
  label: string;
  scriptBody: string;
};

function getSnippetValue(
  content: string,
  pattern: RegExp,
  name: string,
  filePath: string
) {
  const match = content.match(pattern);

  if (!match?.[1]) {
    throw new Error(`Missing ${name} in ${filePath}`);
  }

  return match[1].trim();
}

function readPolicySnippet(filePath: string): LegalPolicySnippet {
  const content = readFileSync(filePath, "utf8").trim();

  return {
    href: getSnippetValue(content, /href="([^"]+)"/, "href", filePath),
    className: getSnippetValue(content, /className="([^"]+)"/, "className", filePath),
    title: getSnippetValue(content, /title="([^"]*)"/, "title", filePath),
    label: getSnippetValue(content, /<a[^>]*>([^<]+)<\/a>/, "label", filePath),
    scriptBody: getSnippetValue(
      content,
      /<script[^>]*>([\s\S]*?)<\/script>/,
      "script body",
      filePath
    ),
  };
}

export function LegalEmbedFooter() {
  const privacyPolicy = readPolicySnippet(PRIVACY_POLICY_PATH);
  const cookiePolicy = readPolicySnippet(COOKIE_POLICY_PATH);

  return (
    <footer className="mt-auto py-6 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 text-sm text-muted-foreground flex justify-center gap-6">
        <a
          href={privacyPolicy.href}
          className={privacyPolicy.className}
          title={privacyPolicy.title}
        >
          {privacyPolicy.label}
        </a>
        <Script
          id="iubenda-privacy-policy"
          strategy="beforeInteractive"
          type="text/javascript"
        >
          {privacyPolicy.scriptBody}
        </Script>
        <a
          href={cookiePolicy.href}
          className={cookiePolicy.className}
          title={cookiePolicy.title}
        >
          {cookiePolicy.label}
        </a>
        <Script
          id="iubenda-cookie-policy"
          strategy="beforeInteractive"
          type="text/javascript"
        >
          {cookiePolicy.scriptBody}
        </Script>
      </div>
    </footer>
  );
}
