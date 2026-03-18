"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLinkIcon,
  KeyIcon,
  LogOut,
  Link as LucideLink,
  Moon,
  Settings,
} from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";

export default function Header({
  openKeyDialog,
}: {
  openKeyDialog?: () => void;
}) {
  const locale = useLocale();
  const router = useRouter();
  const [showKeyWarning, setShowKeyWarning] = useState(false);

  useEffect(() => {
    const hasKey = localStorage?.getItem("falKey");
    setShowKeyWarning(!hasKey);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("gostudio_auth");
    localStorage.removeItem("gostudio_user");
    router.replace(`/${locale}`);
  };

  return (
    <header className="px-4 py-2 flex justify-between items-center border-b border-gray-200 bg-white">
      <h1 className="text-lg font-medium">
        <Link href={`/${locale}/app`}>
          <Logo />
        </Link>
      </h1>
      <nav className="flex flex-row items-center justify-end gap-1">
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://gostudio.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-900 flex items-center gap-1"
          >
            GoStudio.ai
            <ExternalLinkIcon className="w-3 h-3 opacity-50" />
          </a>
        </Button>
        {/* <LanguageSwitcher /> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-full ml-1 hover:bg-gray-50 border border-gray-200"
            >
              <span className="text-xs font-bold text-gray-900">G</span>
              {showKeyWarning && openKeyDialog && (
                <span className="bg-orange-500 w-2.5 h-2.5 rounded-full absolute -top-0.5 -right-0.5 border-2 border-white" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1.5 pb-1">
                <p className="text-sm font-medium leading-none text-gray-900">
                  gostudio
                </p>
                <p className="text-xs leading-none text-gray-500">
                  gostudio@gmail.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {openKeyDialog && (
              <DropdownMenuItem
                onClick={openKeyDialog}
                className="py-2 text-gray-700 cursor-pointer relative"
              >
                <KeyIcon className="mr-2 h-4 w-4 text-gray-500" />
                <span>API Keys</span>
                {showKeyWarning && (
                  <span className="bg-orange-500 w-2 h-2 rounded-full absolute right-2" />
                )}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="py-2 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
