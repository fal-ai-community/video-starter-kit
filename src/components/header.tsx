"use client";

import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";

export default function Header({
  openKeyDialog,
}: {
  openKeyDialog?: () => void;
}) {
  const t = useTranslations("app.header");
  const locale = useLocale();
  const [showKeyWarning, setShowKeyWarning] = useState(false);

  useEffect(() => {
    // Check localStorage only on client side after hydration
    const hasKey = localStorage?.getItem("falKey");
    setShowKeyWarning(!hasKey);
  }, []);

  return (
    <header className="px-4 py-2 flex justify-between items-center border-b border-border">
      <h1 className="text-lg font-medium">
        <Link href={`/${locale}/app`}>
          <Logo />
        </Link>
      </h1>
      <nav className="flex flex-row items-center justify-end gap-1">
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://github.com/timoncool/videosos"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("github")}
          </a>
        </Button>
        <LanguageSwitcher />
        {openKeyDialog && (
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openKeyDialog}
          >
            {showKeyWarning && (
              <span className="dark:bg-orange-400 bg-orange-600 w-2 h-2 rounded-full absolute top-1 right-1" />
            )}
            <SettingsIcon className="w-6 h-6" />
          </Button>
        )}
      </nav>
    </header>
  );
}
