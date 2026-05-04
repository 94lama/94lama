import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { MotionController } from "@components/motion-controller";
import { VhFixer } from "@components/vh-fixer";
import { defaultLocale, getStaticLocaleParams, isLocale } from "@i18n/request";

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
  description: "Recruiter-focused portfolio for Riccardo La Malfa, covering summary, skills, experience, relocation, and contact details.",
  icons: {
    icon: [
      { url: "/assets/readme/icon.svg", type: "image/svg+xml" },
      { url: "/assets/icon.svg", type: "image/svg+xml", sizes: "192x192" },
    ],
    shortcut: "/assets/icon.svg",
  },
  manifest: "/manifest.json",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticLocaleParams();
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const activeLocale = isLocale(locale) ? locale : defaultLocale;

  return (
    <html
      data-motion="ready"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      lang={activeLocale}
    >
      <body className="min-h-full bg-background text-foreground flex flex-col antialiased selection:bg-accent/30">
        <MotionController />
        <VhFixer />
        <Script
          id="iubenda-widget-bootstrap"
          src="https://embeds.iubenda.com/widgets/283fdcdd-8702-47d7-84ee-59bc1203b52c.js"
          strategy="lazyOnload"
          type="text/javascript"
        />
        {children}

        {/* Google tag */}
        <GoogleTagManager gtmId="G-Y55KQQ4S9Z" />
      </body>
    </html>
  );
}
