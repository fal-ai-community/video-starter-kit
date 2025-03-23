import { Scissors, Wand2, Share2, Zap, Users, Code } from "lucide-react";
import { useTranslations } from 'next-intl';

const features = [
  {
    icon: Scissors,
    titleKey: "preciseEditing.title",
    descriptionKey: "preciseEditing.description"
  },
  {
    icon: Wand2,
    titleKey: "aiGeneratedAssets.title",
    descriptionKey: "aiGeneratedAssets.description"
  },
  {
    icon: Share2,
    titleKey: "exportAnywhere.title",
    descriptionKey: "exportAnywhere.description"
  },
  {
    icon: Code,
    titleKey: "openSource.title",
    descriptionKey: "openSource.description"
  },
];

export default function Features() {
  const t = useTranslations('Features');

  return (
    <section id="features" className="py-20 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            {t("powerfulFeaturesTitle")}
          </h2>
          <p className="text-gray-400">
            {t("powerfulFeaturesDescription")}
          </p>
        </div>

        <div className="max-w-screen-md mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-transparent hover:border-white/20 transition-colors"
            >
              <feature.icon className="w-12 h-12 mb-4 text-white/80" />
              <h3 className="text-xl font-semibold mb-2">{t(feature.titleKey)}</h3>
              <p className="text-gray-400">{t(feature.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
