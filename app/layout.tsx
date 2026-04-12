import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
      <Script
        src="https://embeds.iubenda.com/widgets/283fdcdd-8702-47d7-84ee-59bc1203b52c.js"
      />
      <body className="min-h-full bg-background text-foreground flex flex-col antialiased selection:bg-accent/30">
        {children}

        {/* Privacy policy */}
        <a href="https://www.iubenda.com/privacy-policy/76360064" className="iubenda-black iubenda-noiframe iubenda-embed" title="Privacy Policy ">Privacy Policy</a>
        <Script id="iubenda-privacy" type="text/javascript">{`(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);`}</Script>

        {/* Cookie Policy */}
        <a href="https://www.iubenda.com/privacy-policy/76360064/cookie-policy" className="iubenda-black iubenda-noiframe iubenda-embed" title="Cookie Policy ">Cookie Policy</a>
        <Script id="iubenda-cookie" type="text/javascript">{`(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);`}</Script>

        {/* GTM */}
        <GoogleTagManager gtmId="G-Y55KQQ4S9Z" />
        {/* Google tag */}
        <GoogleTagManager gtmId="G-Y55KQQ4S9Z" />
      </body>
    </html>
  );
}
