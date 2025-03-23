import { Button } from "@/components/ui/button";
import { Github, Twitter, DiscIcon as Discord } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function Community() {
  const t = useTranslations('Community'); // 定义翻译命名空间为 'Community'

  return (
    <section id="community" className="py-20 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('joinOurCommunity')}</h2>
          <p className="text-gray-400 mb-8">
            {t('description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="https://github.com/fal-ai-community">
              <Button variant="outline" className="w-full">
                <Github className="mr-2 h-5 w-5" />
                {t('github')}
              </Button>
            </Link>
            <Link href="https://discord.gg/fal-ai">
              <Button variant="outline" className="w-full">
                <Discord className="mr-2 h-5 w-5" />
                {t('discord')}
              </Button>
            </Link>
            <Link href="https://x.com/fal">
              <Button variant="outline" className="w-full">
                <Twitter className="mr-2 h-5 w-5" />
                {t('twitter')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
