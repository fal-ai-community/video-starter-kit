"use client";

import { Button } from "@/components/ui/button";
import { DiscIcon as Discord, Github, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Community() {
  const t = useTranslations("landing.community");

  return (
    <section id="community" className="py-20 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
          <p className="text-gray-400 mb-8">{t("description")}</p>

          <div className="flex justify-center">
            <Link href="https://github.com/timoncool/videosos">
              <Button variant="outline" size="lg">
                <Github className="mr-2 h-5 w-5" />
                {t("starGithub")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
