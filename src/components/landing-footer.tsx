"use client";

import { Video } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("landing.footer");

  return (
    <footer className="border-t flex w-full border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 max-w-screen-md md:grid-cols-3 gap-8 mx-auto">
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-2 mb-4">
              <Video className="w-6 h-6" />
              <span className="font-semibold">{t("appName")}</span>
            </div>
            <p className="text-sm text-gray-400">{t("tagline")}</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <h4 className="font-semibold mb-4">{t("credits")}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="https://t.me/nerual_dreming"
                  className="hover:text-white transition-colors"
                  target="_blank"
                >
                  Nerual Dreming
                </Link>
              </li>
              <li>
                <Link
                  href="https://artgeneration.me/"
                  className="hover:text-white transition-colors"
                  target="_blank"
                >
                  ArtGeneration.me
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center text-center">
            <h4 className="font-semibold mb-4">{t("community")}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="https://github.com/timoncool/videosos"
                  className="hover:text-white transition-colors"
                >
                  {t("github")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
