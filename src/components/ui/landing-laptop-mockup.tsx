import type React from "react";

export function LaptopMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full border border-border rounded-xl ">
      {/* Gradient border effect */}
      <div className="absolute top-0 -left-4 -right-4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute -top-4 -bottom-4 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/15 to-transparent" />
      <div className="absolute -top-4 -bottom-4 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/15 to-transparent" />
      <div className="absolute bottom-0 -left-4 -right-4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* MacBook-style frame */}
      <div className="relative rounded-xl overflow-hidden bg-gray-900 shadow-2xl">
        {/* MacBook top bar */}
        <div className="relative h-8 bg-neutral-800 backdrop-blur-sm flex items-center px-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
        </div>
        {/* Content */}
        <div className="relative">{children}</div>
      </div>

      {/* Reflection effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
