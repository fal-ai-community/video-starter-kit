"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full border-b border-gray-200 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="https://gostudio-web-cdn.b-cdn.net/public/99.svg"
            alt="GoStudio Clips"
            width={34}
            height={34}
            className="w-8 h-8 rounded-full"
            priority
          />
          <span className="font-bold text-gray-900 text-base tracking-tight">
            Clips.ai
          </span>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
          >
            How it works
          </Link>
          <Link
            href="https://gostudio.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
          >
            GoStudio.ai
          </Link>
        </nav>
        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="https://gostudio.ai/login" target="_blank">
            <Button
              variant="ghost"
              className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium"
            >
              Log in
            </Button>
          </Link>
          <Link href="/en/app">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 rounded-full transition-all duration-200 shadow-md hover:shadow-violet-200">
              Try it free
            </Button>
          </Link>
        </div>
        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden text-gray-500 hover:text-gray-900"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-4">
          <Link
            href="#features"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            onClick={() => setMobileOpen(false)}
          >
            How it works
          </Link>
          <Link
            href="https://gostudio.ai"
            target="_blank"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            GoStudio.ai
          </Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
            <Link href="https://gostudio.ai/login" target="_blank">
              <Button variant="outline" className="w-full text-sm">
                Log in
              </Button>
            </Link>
            <Link href="/en/app">
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-full">
                Try it free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
