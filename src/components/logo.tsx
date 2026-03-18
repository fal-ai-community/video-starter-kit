import Image from "next/image";
import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 select-none">
      <Image
        src="https://gostudio-web-cdn.b-cdn.net/public/99.svg"
        alt="GoStudio"
        width={32}
        height={32}
        className="w-8 h-8 rounded-full"
        priority
      />
      <span className="font-bold text-gray-900 text-base tracking-tight">
        Clips<span className="font-normal">.ai</span>
      </span>
    </Link>
  );
}
