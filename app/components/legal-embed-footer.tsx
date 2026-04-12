import { readFileSync } from "node:fs";
import { join } from "node:path";
import Script from "next/script";

const COMPONENTS_DIR = join(process.cwd(), "app/components");
const COOKIE_POLICY_PATH = join(COMPONENTS_DIR, "cookie-policy.html");
const PRIVACY_POLICY_PATH = join(COMPONENTS_DIR, "privacy-policy.html");

const iubendaTemplateBootstrap = `(function () {
  function mountPolicy(templateId, slotId) {
    var template = document.getElementById(templateId);
    var slot = document.getElementById(slotId);

    if (!template || !slot || !("content" in template)) {
      return;
    }

    var content = template.content.cloneNode(true);
    var scripts = content.querySelectorAll("script");

    for (var i = 0; i < scripts.length; i += 1) {
      scripts[i].remove();
    }

    slot.replaceChildren(content);
  }

  mountPolicy("privacy-policy-template", "privacy-policy-slot");
  mountPolicy("cookie-policy-template", "cookie-policy-slot");

  var loader = document.querySelector('script[data-iubenda-embed-loader="true"]');

  if (!loader) {
    loader = document.createElement("script");
    loader.src = "https://cdn.iubenda.com/iubenda.js";
    loader.async = true;
    loader.setAttribute("data-iubenda-embed-loader", "true");
    document.body.appendChild(loader);
  }
})();`;

function readPolicySnippet(filePath: string) {
  return readFileSync(filePath, "utf8").trim().replaceAll("className=", "class=");
}

export function LegalEmbedFooter() {
  const privacyPolicy = readPolicySnippet(PRIVACY_POLICY_PATH);
  const cookiePolicy = readPolicySnippet(COOKIE_POLICY_PATH);

  return (
    <footer className="mt-auto py-6 border-t border-border">
      {/* <div className="max-w-3xl mx-auto px-4 text-sm text-muted-foreground flex justify-center gap-6">
        <span id="privacy-policy-slot" />
        <template
          id="privacy-policy-template"
          dangerouslySetInnerHTML={{ __html: privacyPolicy }}
        />
        <span id="cookie-policy-slot" />
        <template
          id="cookie-policy-template"
          dangerouslySetInnerHTML={{ __html: cookiePolicy }}
        />
      </div>
      <Script id="iubenda-template-bootstrap" strategy="afterInteractive">
        {iubendaTemplateBootstrap}
      </Script> */}
    </footer>
  );
}
