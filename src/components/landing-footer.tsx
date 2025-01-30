import Link from "next/link";
import { Video } from "lucide-react";

export default function Footer() {
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
              Open-source AI video developer
              <br />
              starter kit.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="https://fal.ai/models"
                  className="hover:text-white transition-colors"
                >
                  AI Models
                </Link>
              </li>
              <li>
                <Link
                  href="https://docs.fal.ai"
                  className="hover:text-white transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="https://blog.fal.ai"
                  className="hover:text-white transition-colors"
                >
                  fal Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center text-center">
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="https://github.com/fal-ai-community/video-starter-kit"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.gg/fal-ai"
                  className="hover:text-white transition-colors"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/fal"
                  target="_blank"
                  className="hover:text-white transition-colors"
                >
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
