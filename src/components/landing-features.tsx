import { Scissors, Wand2, Share2, Zap, Users, Code } from "lucide-react";

const features = [
  {
    icon: Scissors,
    title: "Precise Editing",
    description:
      "Frame-perfect cutting and editing tools for high-quality videos.",
  },
  {
    icon: Wand2,
    title: "AI-Generated Assets",
    description:
      "Use AI to generate music, image, video and more for your videos.",
  },
  {
    icon: Share2,
    title: "Export Anywhere",
    description: "Export to any format and share directly to social platforms.",
  },
  {
    icon: Code,
    title: "Open-Source",
    description: "Built on open-source technologies and available to everyone.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Powerful features for modern creators
          </h2>
          <p className="text-gray-400">
            Everything you need to create professional-quality videos, available
            to everyone.
          </p>
        </div>

        <div className="max-w-screen-md mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-transparent hover:border-white/20 transition-colors"
            >
              <feature.icon className="w-12 h-12 mb-4 text-white/80" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
