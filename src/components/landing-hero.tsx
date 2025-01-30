import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import { LaptopMockup } from "@/components/ui/landing-laptop-mockup";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm mb-8">
            <span className="text-gray-400">Now Open Source</span>
            <span className="ml-3 h-4 w-px bg-white/20" />
            <a
              href="https://github.com/fal-ai-community/video-starter-kit"
              className="ml-3 flex items-center text-white hover:text-gray-300"
            >
              Star on GitHub <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            AI Video Developer
            <br />
            Starter Kit
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            A powerful, open-source AI video editor built for creators. Create
            stunning videos with our intuitive tools, or develop your own AI
            video product using our kit.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/app">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 min-w-[200px]"
              >
                Try it now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="min-w-[200px]">
              <Github className="mr-2 h-5 w-5" />
              Star on GitHub
            </Button>
          </div>
        </div>

        {/* App Screenshot */}
        <div className="relative group max-w-6xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-blue-500/40 blur-3xl opacity-20" />
          <LaptopMockup>
            <Image
              src="/screenshot.webp?height=800&width=1200"
              width={1200}
              height={800}
              alt="Video Starter Kit interface"
              className="w-full h-auto"
              priority
            />
          </LaptopMockup>

          {/* Floating gradient elements */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl opacity-20" />
        </div>
      </div>
    </section>
  );
}
