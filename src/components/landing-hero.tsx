import { Button } from "@/components/ui/button";
import { LaptopMockup } from "@/components/ui/landing-laptop-mockup";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-white">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gradient-to-br from-violet-100/80 via-purple-50/60 to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm text-violet-700">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            <span className="font-medium">AI Video by GoStudio.ai</span>
            <span className="h-3.5 w-px bg-violet-200" />
            <Link
              href="https://gostudio.ai"
              target="_blank"
              className="flex items-center gap-1 text-violet-600 hover:text-violet-800 transition-colors font-semibold"
            >
              Learn more <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6 text-gray-900">
            Create stunning
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              AI videos
            </span>
            <br />
            in seconds
          </h1>

          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            GoStudio Clips harnesses the latest AI video models to turn your
            ideas into professional-quality video content — no editing skills
            required.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/en/app">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 rounded-full text-base min-w-[200px] shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all duration-300"
            >
              Start creating free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-full text-base min-w-[200px] transition-all duration-300"
            >
              <Zap className="mr-2 w-4 h-4 text-violet-500" />
              See how it works
            </Button>
          </Link>
        </div>

        {/* App Screenshot */}
        <div className="relative group max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-200/40 to-purple-200/40 blur-3xl opacity-60 rounded-3xl" />
          <div className="relative ring-1 ring-gray-200 rounded-2xl overflow-hidden shadow-2xl shadow-violet-100">
            <LaptopMockup>
              <Image
                src="/screenshot.webp"
                width={1200}
                height={800}
                alt="GoStudio Clips — AI Video Editor"
                className="w-full h-auto"
                priority
              />
            </LaptopMockup>
          </div>
        </div>

        {/* Social proof strip */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 border-2 border-white"
                />
              ))}
            </div>
            <span>50,000+ creators</span>
          </div>
          <span className="h-4 w-px bg-gray-200 hidden sm:block" />
          <span>✦ Powered by the latest AI models</span>
          <span className="h-4 w-px bg-gray-200 hidden sm:block" />
          <span>✦ No credit card required</span>
        </div>
      </div>
    </section>
  );
}
