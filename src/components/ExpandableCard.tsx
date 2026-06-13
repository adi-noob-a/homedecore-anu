"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AssetPlaceholder } from "./AssetPlaceholder";

interface ExpandableCardProps {
  imageLabel: string;
  title: string;
  tagline: string;
  costTier?: number;
  tags?: { label: string; variant: "green" | "red" | "amber" }[];
  children: React.ReactNode;
  defaultExpanded?: boolean;
  /** Optional gradient accent color for the glow border */
  glowColor?: string;
}

export function ExpandableCard({
  imageLabel,
  title,
  tagline,
  costTier,
  tags,
  children,
  defaultExpanded = false,
  glowColor = "rgba(99,102,241,0.3)",
}: ExpandableCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative card-hover"
      data-cursor="pointer"
    >
      {/* Glow border on hover */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`,
        }}
      />

      {/* Card body */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="relative cursor-pointer rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] overflow-hidden transition-all duration-300 hover:border-white/[0.10]"
      >
        {/* Collapsed view */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-5">
            {/* Thumbnail placeholder */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden">
              <AssetPlaceholder label={imageLabel} aspectRatio="1:1" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Cost tier indicator */}
              {costTier && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                    Tier {costTier}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: costTier }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">{title}</h3>
              <p className="text-sm text-[#94A3B8] mt-1.5 line-clamp-2 leading-relaxed">{tagline}</p>

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tags.map((t) => (
                    <span
                      key={t.label}
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        t.variant === "green"
                          ? "bg-green-900/30 text-green-400 border-green-800/40"
                          : t.variant === "red"
                          ? "bg-red-900/30 text-red-400 border-red-800/40"
                          : "bg-amber-900/30 text-amber-400 border-amber-800/40"
                      }`}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Expand indicator */}
              <div className="flex items-center gap-1.5 mt-3 text-xs text-white/30 group-hover:text-white/50 transition-colors">
                {expanded ? (
                  <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                ) : (
                  <><ChevronDown className="w-3.5 h-3.5" /> Click to expand</>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/[0.05]">
                {children}

                {/* "View Full Specs" button */}
                <div className="mt-5 flex justify-center">
                  <span className="btn-premium inline-flex items-center gap-2 text-xs">
                    View Full Specs
                    <ChevronDown className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
