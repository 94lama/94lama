"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useParams } from "next/navigation";
import { GoogleTagManager } from "@next/third-parties/google";
import { MotionController } from "@/components/motion-controller";
import { VhFixer } from "@/components/vh-fixer";
import { defaultLocale, isLocale } from "@/i18n/request";
import "./globals.css";
import Iubnenda from "../components/iubenda";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const rawLocale = params?.locale as string | undefined;
  const activeLocale = rawLocale && isLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <html
      data-motion="ready"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      lang={activeLocale}
    >
      <body className="min-h-full bg-background text-foreground flex flex-col antialiased selection:bg-accent/30">
        <MotionController />
        <VhFixer />
        {children}
        {/* Iubenda cookie manager */}
        <Iubnenda />
        {/* Google tag */}
        <GoogleTagManager gtmId="G-Y55KQQ4S9Z" />
      </body>
    </html>
  );
}
