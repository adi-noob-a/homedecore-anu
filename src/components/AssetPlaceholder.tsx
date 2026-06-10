"use client";

import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

interface AssetPlaceholderProps {
  label: string;
  aspectRatio?: "16:9" | "4:3" | "1:1";
  className?: string;
}

export function AssetPlaceholder({ label, aspectRatio = "16:9", className = "" }: AssetPlaceholderProps) {
  const aspectClass =
    aspectRatio === "16:9"
      ? "aspect-video"
      : aspectRatio === "4:3"
      ? "aspect-[4/3]"
      : "aspect-square";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative ${aspectClass} bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden ${className}`}
    >
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/20 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-2">
        <ImageIcon className="w-8 h-8" />
        <div className="text-xs font-mono text-zinc-600 text-center px-4">
          {label}
        </div>
        <div className="text-[10px] text-zinc-700 font-mono">
          {aspectRatio}
        </div>
      </div>
    </motion.div>
  );
}
