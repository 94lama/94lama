import Script from "next/script";

const SITE_ID = process.env.NEXT_PUBLIC_IUBENDA_SITE_ID;
const COOKIE_POLICY_ID = process.env.NEXT_PUBLIC_IUBENDA_COOKIE_POLICY_ID;
const IUBENDA_LANG = process.env.NEXT_PUBLIC_IUBENDA_LANG ?? "en";

export default function Head() {
  // Only render Iubenda when SITE_ID is provided.
  if (!SITE_ID) return null;

  const config: Record<string, unknown> = {
    siteId: Number(SITE_ID),
    lang: IUBENDA_LANG,
    consentOnScroll: false,
    perPurposeConsent: true,
  };

  if (COOKIE_POLICY_ID) {
    config.cookiePolicyId = Number(COOKIE_POLICY_ID);
  }

  return (
    <>
      <Script
        id="iubenda-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `var _iub = _iub || []; _iub.csConfiguration = ${JSON.stringify(
            config
          )};`,
        }}
      />
      <Script
        id="iubenda-script"
        src="https://cdn.iubenda.com/cs/iubenda_cs.js"
        strategy="beforeInteractive"
      />
    </>
  );
}
