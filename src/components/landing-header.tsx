import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import LocaleSwitcher from './locale-switcher'; // 引入 LocaleSwitcher 组件

export default function Header() {
  const t = useTranslations('Header');

  return (
    <header className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <Video className="w-6 h-6" />
            <span className="font-semibold">{t('brand')}</span>
          </Link>
        </div>

        <nav className="flex-1 hidden md:flex items-center justify-center space-x-8">
          <Link
            href="#features"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t('features')}
          </Link>
          <Link
            href="#community"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t('community')}
          </Link>
          <Link
            href="https://github.com/fal-ai-community/video-starter-kit"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t('github')}
          </Link>
        </nav>

        <div className="flex flex-1 justify-end items-center space-x-4">
          <LocaleSwitcher />
          <Link href="/app">
            <Button className="bg-white text-black hover:bg-gray-200">
              {t('tryItNow')}
            </Button>
          </Link>

        </div>
      </div>
    </header>
  );
}
