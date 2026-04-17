import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { LegalFooter } from "./components/legal-footer";

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
      { url: "/assets/icon.png", type: "image/png", sizes: "1024x1024" },
    ],
    shortcut: "/assets/icon.png",
  },
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
        {/* <Script
          id="iubenda-widget-bootstrap"
          src="https://embeds.iubenda.com/widgets/283fdcdd-8702-47d7-84ee-59bc1203b52c.js"
          type="text/javascript"
        /> */}
        {children}
        {/* <LegalFooter /> */}

        {/* GTM */}
        <GoogleTagManager gtmId="G-Y55KQQ4S9Z" />
        {/* Google tag */}
        <GoogleTagManager gtmId="G-Y55KQQ4S9Z" />
      </body>
    </html>
  );
}
