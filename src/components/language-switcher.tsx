"use client";

import { GlobeIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLanguage = (newLocale: string) => {
    if (typeof window === "undefined") return;

    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(en|ru)/, "");
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    window.location.href = newPath;
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="gap-2">
        <GlobeIcon className="w-4 h-4" />
        <span className="text-sm">{currentLanguage?.name}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <GlobeIcon className="w-4 h-4" />
          <span className="text-sm">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className={locale === language.code ? "bg-accent" : ""}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
