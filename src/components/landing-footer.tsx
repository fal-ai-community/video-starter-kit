import {
  ArrowRight,
  Facebook,
  HelpCircle,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  {
    title: "Video Models",
    links: [
      "Minimax Video",
      "Kling AI",
      "Hunyuan Video",
      "Luma Dream Machine",
      "Runway Gen-3",
      "Veo 2",
      "Pika Labs",
      "Sora Alternative",
    ],
  },
  {
    title: "AI Features",
    links: [
      "Text to Video",
      "Image to Video",
      "Video to Video",
      "AI Voiceovers",
      "AI Music Generator",
      "Video Upscaler",
      "Background Remover",
      "Auto Captions",
    ],
  },
  {
    title: "Use Cases",
    links: [
      "YouTube Shorts",
      "TikTok Videos",
      "Instagram Reels",
      "Marketing Videos",
      "E-commerce Promos",
      "Explainer Videos",
      "Music Videos",
      "Cinematic Trailers",
    ],
  },
  {
    title: "Company",
    links: [
      "About Us",
      "Services",
      "Testimonials",
      "Pricing",
      "FAQ",
      "Privacy Policy",
      "Terms of Service",
    ],
  },
  {
    title: "Free Tools",
    links: [
      "Free Video Editor",
      "Free Video Compressor",
      "Free Video Trimmer",
      "Video Converter",
      "Audio Extractor",
      "Free Subtitles",
      "Prompt Generator",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-[1400px]">
        {/* Main Footer Content */}
        <div className="flex flex-col xl:flex-row gap-16 xl:gap-8 mb-16">
          {/* 5 Columns of Links */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 xl:w-3/4">
            {footerLinks.map((column, i) => (
              <div key={column.title}>
                <h4 className="text-gray-900 font-bold text-[15px] mb-6">
                  {column.title}
                </h4>
                <ul className="space-y-4">
                  {column.links.map((link, j) => (
                    <li key={link}>
                      <Link
                        href="/"
                        className="text-[14px] text-gray-500 hover:text-violet-600 transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right Sidebar Section */}
          <div className="xl:w-1/4 flex flex-col items-start xl:pl-8">
            <Link href="/" className="flex items-center gap-2 mb-10">
              <Image
                src="https://gostudio-web-cdn.b-cdn.net/public/99.svg"
                alt="GoStudio"
                width={36}
                height={36}
                className="w-9 h-9 rounded-full"
              />
              <span className="font-bold text-gray-900 text-lg tracking-tight">
                Clips.ai
              </span>
            </Link>

            <div className="mb-10 w-full">
              <h4 className="text-gray-900 font-medium text-[15px] mb-4 flex items-center gap-4">
                Follow us
                <div className="flex gap-3">
                  <Link
                    href="/"
                    className="text-violet-600 hover:text-violet-800"
                  >
                    <Facebook
                      className="w-[18px] h-[18px]"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  </Link>
                  <Link
                    href="/"
                    className="text-violet-600 hover:text-violet-800"
                  >
                    <Instagram className="w-[18px] h-[18px]" />
                  </Link>
                  <Link
                    href="/"
                    className="text-violet-600 hover:text-violet-800"
                  >
                    <Twitter
                      className="w-[18px] h-[18px]"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  </Link>
                  <Link
                    href="/"
                    className="text-violet-600 hover:text-violet-800"
                  >
                    <Linkedin
                      className="w-[18px] h-[18px]"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  </Link>
                </div>
              </h4>
            </div>

            <div className="mb-10 w-full">
              <h4 className="text-gray-900 font-medium text-[15px] mb-4">
                Ask AI about GoStudio
              </h4>
              <div className="flex gap-3">
                <span className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:border-violet-300 hover:bg-violet-50 transition-colors">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-700"
                  >
                    <title>AI Provider 1</title>
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </span>
                <span className="w-10 h-10 rounded-full border border-violet-200 bg-violet-50 flex items-center justify-center cursor-pointer">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-violet-600"
                  >
                    <title>AI Provider 2</title>
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  </svg>
                </span>
                <span className="w-10 h-10 rounded-full border border-teal-200 bg-teal-50 flex items-center justify-center cursor-pointer">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-teal-600"
                  >
                    <title>AI Provider 3</title>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </span>
                <span className="w-10 h-10 rounded-full border border-orange-200 bg-orange-50 flex items-center justify-center cursor-pointer">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-orange-500"
                  >
                    <title>AI Provider 4</title>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    <path d="M2 12h20" />
                  </svg>
                </span>
              </div>
            </div>

            <Link
              href="/"
              className="w-full relative overflow-hidden group rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 p-px shadow-md"
            >
              <div className="bg-gradient-to-r from-violet-500 to-cyan-400 w-full h-full px-5 py-4 rounded-[11px] flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1">
                    Earn 30% for every referral
                  </h4>
                  <p className="text-white/80 text-[11px]">
                    Join the Affiliate Program Today
                  </p>
                </div>
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <ArrowRight className="w-4 h-4 text-cyan-500" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] font-bold text-gray-900">
            Copyright © {new Date().getFullYear()} All rights reserved.
            GoStudio.ai
          </p>
          <div className="flex items-center gap-4 text-[13px]">
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer">
              Need Help?
            </span>
            <button
              type="button"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-1.5 rounded-full flex items-center gap-2 transition-colors"
            >
              English
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Chevron down</title>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
