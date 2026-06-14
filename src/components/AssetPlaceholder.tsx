"use client";

import { ImageIcon } from "lucide-react";

interface AssetPlaceholderProps {
  label: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "16:10";
  className?: string;
}

export function AssetPlaceholder({ label, aspectRatio = "16:9", className = "" }: AssetPlaceholderProps) {
  const aspectClass =
    aspectRatio === "16:9" ? "aspect-video"
    : aspectRatio === "16:10" ? "aspect-[16/10]"
    : aspectRatio === "4:3" ? "aspect-[4/3]"
    : "aspect-square";

  return (
    <div
      className={`relative ${aspectClass} rounded-xl overflow-hidden ${className}`}
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      {/* Shimmer — only if motion OK */}
      <div
        className="absolute inset-0 motion-safe-animate"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
          animation: "shimmer-slide 2s ease-in-out infinite",
        }}
      />
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <ImageIcon className="w-8 h-8" style={{ color: "rgba(255,255,255,0.15)" }} />
        <span className="text-xs font-mono text-center px-4" style={{ color: "rgba(255,255,255,0.20)" }}>
          {label}
        </span>
        <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.10)" }}>
          {aspectRatio}
        </span>
      </div>
    </div>
  );
}
