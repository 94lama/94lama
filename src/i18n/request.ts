export const locales = ["en", "it", "fr"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export function isLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}

export function getStaticLocaleParams() {
  return locales.map((locale) => ({ locale }));
}