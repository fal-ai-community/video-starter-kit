import Link from "next/link";
import { Video } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer'); // 定义翻译命名空间为 'Footer'

  return (
    <footer className="border-t flex w-full border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 max-w-screen-md md:grid-cols-3 gap-8 mx-auto">
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-2 mb-4">
              <Video className="w-6 h-6" />
              <span className="font-semibold">fal.ai</span>
            </div>
            <p className="text-sm text-gray-400">
              {t('openSourceDescription')}
              <br />
              {t('starterKit')}
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <h4 className="font-semibold mb-4">{t('resources')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="https://fal.ai/models"
                  className="hover:text-white transition-colors"
                >
                  {t('aiModels')}
                </Link>
              </li>
              <li>
                <Link
                  href="https://docs.fal.ai"
                  className="hover:text-white transition-colors"
                >
                  {t('apiReference')}
                </Link>
              </li>
              <li>
                <Link
                  href="https://blog.fal.ai"
                  className="hover:text-white transition-colors"
                >
                  {t('falBlog')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center text-center">
            <h4 className="font-semibold mb-4">{t('community')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="https://github.com/fal-ai-community/video-starter-kit"
                  className="hover:text-white transition-colors"
                >
                  {t('github')}
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.gg/fal-ai"
                  className="hover:text-white transition-colors"
                >
                  {t('discord')}
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/fal"
                  target="_blank"
                  className="hover:text-white transition-colors"
                >
                  {t('twitter')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
