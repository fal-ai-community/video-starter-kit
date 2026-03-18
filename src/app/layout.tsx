import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoStudio Clips — AI Video Creator",
  description:
    "Create stunning AI-powered videos in seconds. Generate, edit, and share with the most powerful AI video models — by GoStudio.ai.",
  openGraph: {
    title: "GoStudio Clips — AI Video Creator",
    description:
      "Create stunning AI-powered videos in seconds. Generate, edit, and share with the most powerful AI video models.",
    url: "https://clips.gostudio.ai",
    siteName: "GoStudio Clips",
    images: [
      {
        url: "https://r1.gostudio.ai/public/final_Logo.svg",
        width: 1200,
        height: 630,
        alt: "GoStudio Clips",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "https://gostudio-web-cdn.b-cdn.net/public/99.svg",
    apple: "https://gostudio-web-cdn.b-cdn.net/public/99.svg",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoStudio Clips-AI Video Creator",
    description: "Create stunning AI-powered videos in seconds.",
    creator: "@gostudio_ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
