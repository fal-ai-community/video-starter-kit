import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "../globals.css";

export const metadata: Metadata = {
  title: "AI Video Studio | Demo by fal.ai",
  description: "Create and edit videos with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased dark">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
