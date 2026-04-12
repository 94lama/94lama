import Script from 'next/script';

export default function Head() {
  return (
    <>
      <Script
        id="iubenda-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _iub = _iub || [];
            _iub.csConfiguration = {
              siteId: TUO_SITE_ID,
              cookiePolicyId: TUO_COOKIE_POLICY_ID,
              lang: "it",
              storage: { useSiteId: true }
            };
          `,
        }}
      />
      <Script
        id="iubenda-cs"
        src="https://cdn.iubenda.com/cs/iubenda_cs.js"
        strategy="beforeInteractive"
      />
    </>
  );
}
