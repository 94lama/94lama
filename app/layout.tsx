import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { LegalEmbedFooter } from "./components/legal-embed-footer";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Riccardo La Malfa | Frontend-Focused Full-Stack Developer",
  description:
    "Recruiter-focused portfolio for Riccardo La Malfa, covering summary, skills, experience, relocation, and contact details.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground flex flex-col antialiased selection:bg-accent/30">
        {children}

        {/* 1. Config iubenda — deve essere la prima cosa */}
        <Script
          id="iubenda-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      var _iub = _iub || [];
      _iub.csConfiguration = {
        siteId: 1234567,
        cookiePolicyId: 7654321,
        lang: "it",
        storage: { useSiteId: true },
        callback: {
          onReady: function() {
            console.log("iubenda ready");
          }
        }
      };
    `,
          }}
        />

        {/* 2. Script iubenda */}
        <Script
          id="iubenda-cs"
          src="https://cdn.iubenda.com/cs/iubenda_cs.js"
          strategy="afterInteractive"
        />

        {/* 3. GTM solo dopo */}
        <GoogleTagManager gtmId="G-Y55KQQ4S9Z" />
        {/* Google tag */}
        <GoogleTagManager gtmId="G-Y55KQQ4S9Z" />
      </body>
    </html>
  );
}
