"use client";

import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";

export default function Header() {
  const t = useTranslations("landing.header");
  const locale = useLocale();

  return (
    <header className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex flex-1">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <Video className="w-6 h-6" />
            <span className="font-semibold">VideoSOS</span>
          </Link>
        </div>

        <nav className="flex-1 hidden md:flex items-center justify-center space-x-8">
          <Link
            href="#features"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t("features")}
          </Link>
          <Link
            href="#community"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t("community")}
          </Link>
          <Link
            href="https://github.com/timoncool/videosos"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t("github")}
          </Link>
        </nav>

        <div className="flex flex-1 justify-end items-center space-x-4">
          <LanguageSwitcher />
          <Button className="bg-white text-black hover:bg-gray-200" asChild>
            <Link href={`/${locale}/app`}>{t("tryNow")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
