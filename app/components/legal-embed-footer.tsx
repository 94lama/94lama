import Script from "next/script";

const privacyPolicyScript = `(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);`;

const cookiePolicyScript = `(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);`;

export function LegalEmbedFooter() {
  return (
    <footer className="mt-auto py-6 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 text-sm text-muted-foreground flex justify-center gap-6">
        <a href="https://www.iubenda.com/privacy-policy/76360064" className="iubenda-black iubenda-noiframe iubenda-embed" title="Privacy Policy ">Privacy Policy</a>
        <Script id="iubenda-privacy-policy" strategy="beforeInteractive">
          {privacyPolicyScript}
        </Script>
        <a href="https://www.iubenda.com/privacy-policy/76360064/cookie-policy" className="iubenda-black iubenda-noiframe iubenda-embed" title="Cookie Policy ">Cookie Policy</a>
        <Script id="iubenda-cookie-policy" strategy="beforeInteractive">
          {cookiePolicyScript}
        </Script>
      </div>
    </footer>
  );
}
