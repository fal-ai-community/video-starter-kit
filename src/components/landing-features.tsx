import {
  ImageIcon,
  Layers,
  Mic,
  Music,
  Share2,
  Wand2,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: Wand2,
    title: "AI Video Generation",
    description:
      "Generate stunning video clips from a text prompt using Minimax, Kling, Hunyuan, Veo 2, and more.",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: ImageIcon,
    title: "Image-to-Video",
    description:
      "Upload any photo and bring it to life with smooth, realistic AI animation.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Music,
    title: "AI Music Generation",
    description:
      "Create original music tracks and soundscapes that perfectly match your video's mood.",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: Mic,
    title: "AI Voiceovers",
    description:
      "Generate natural-sounding voiceovers in multiple voices and languages using PlayHT and F5-TTS.",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Layers,
    title: "Multi-Track Timeline",
    description:
      "Compose your story with a professional timeline editor — layer video, audio, and voiceover tracks.",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: Share2,
    title: "Export & Share",
    description:
      "Export your finished video or create a shareable link instantly with one click.",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
];

const steps = [
  {
    step: "01",
    title: "Describe your idea",
    description: "Type a prompt, upload an image, or start from a template.",
  },
  {
    step: "02",
    title: "Generate with AI",
    description:
      "Pick from the world's best AI video models and generate in seconds.",
  },
  {
    step: "03",
    title: "Edit & compose",
    description:
      "Arrange clips on the timeline, add music, voiceover, and effects.",
  },
  {
    step: "04",
    title: "Export & share",
    description: "Download your final video or share it instantly online.",
  },
];

export default function Features() {
  return (
    <>
      {/* Features Grid */}
      <section
        id="features"
        className="py-24 bg-gray-50 border-t border-gray-100"
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-violet-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Everything you need
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Your complete AI video studio
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              From generation to export — GoStudio Clips gives you professional
              AI video tools in one seamless experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <Link href="/en/app" key={feature.title}>
                <div className="group h-full p-6 rounded-2xl border border-gray-200 bg-white hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div
                    className={`w-10 h-10 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-gray-900 group-hover:text-violet-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-24 bg-white border-t border-gray-100"
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-violet-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Simple process
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How it works
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Go from idea to polished video in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-violet-200 to-transparent z-0" />
                )}
                <div className="relative z-10 p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-300">
                  <span className="text-4xl font-bold bg-gradient-to-br from-violet-600 to-fuchsia-500 bg-clip-text text-transparent block mb-4">
                    {step.step}
                  </span>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner Professional Layout */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="rounded-[2.5rem] bg-gray-50 border border-gray-200 p-8 md:p-14 overflow-hidden shadow-lg relative flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm text-violet-700 mb-6 font-semibold">
                <Zap className="w-4 h-4" /> Start creating today
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Turn your imagination into{" "}
                <span className="text-violet-600">masterpieces.</span>
              </h2>
              <p className="text-gray-500 text-lg mb-8 max-w-md leading-relaxed">
                Join thousands of creators, agencies, and brands who already use
                GoStudio Clips to produce breathtaking AI-powered videos.
              </p>
              <Link href="/en/app">
                <button
                  type="button"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-4 rounded-full text-base shadow-md shadow-violet-200 transition-all duration-300 hover:-translate-y-1"
                >
                  Start creating for free
                </button>
              </Link>
            </div>

            {/* Right Image/Mockup */}
            <div className="lg:w-1/2 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-200 to-purple-100 blur-3xl opacity-50 rounded-full" />
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white aspect-video flex items-center justify-center p-2">
                <Image
                  src="/screenshot.webp"
                  alt="Editor Interface"
                  width={1280}
                  height={720}
                  className="rounded-xl w-full h-full object-cover shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
