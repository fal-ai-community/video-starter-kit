import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  const validLocale =
    !locale || !locales.includes(locale as Locale) ? "en" : locale;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
