import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from 'next-intl';
export const metadata: Metadata = {
  title: "AI Video Developer Starter Kit | fal.ai",
  description: "Open-source AI video editor built for developers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className="antialiased dark">
        <NextIntlClientProvider>
          {children}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
