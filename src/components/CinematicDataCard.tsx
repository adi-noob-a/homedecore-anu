"use client";

import { useState, useRef, useCallback, type ReactNode, type MouseEvent } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X, ChevronDown, FileText, MessageCircle, Lightbulb } from "lucide-react";
import { AssetPlaceholder } from "./AssetPlaceholder";

/* ─── Types ─── */

export interface CinematicCardData {
  id: string;
  title: string;
  shortSummary: string;
  badgeText?: string;           // colored pill
  pros?: string[];
  cons?: string[];
  technicalSpecs?: { label: string; value: string }[];
  imageLabel?: string;
  category?: string;
  tierLabel?: string;
  insightText?: string;
  whatsappText?: string;
}

interface CinematicDataCardProps {
  data: CinematicCardData;
  /** Optional overrides for the quick-answer and spec content */
  quickAnswerContent?: ReactNode;
  fullSpecContent?: ReactNode;
  /** Extra callouts to render below quick answer */
  children?: ReactNode;
}

/* ─── Component ─── */

export function CinematicDataCard({
  data,
  quickAnswerContent,
  fullSpecContent,
  children,
}: CinematicDataCardProps) {
  const {
    id, title, shortSummary, badgeText, pros, cons, technicalSpecs,
    imageLabel, category, tierLabel, insightText, whatsappText,
  } = data;

  // ─── State ───
  const [stage, setStage] = useState<1 | 2>(1);
  const [stage3Open, setStage3Open] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // ─── Hover magnetism ───
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || stage3Open) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    setTilt({ x: deltaX * 6, y: deltaY * -6 });
  }, [stage3Open]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  // ─── Stage 2 toggle ───
  const handleStage2 = useCallback(() => {
    setStage((s) => (s === 1 ? 2 : 1));
  }, []);

  // ─── Stage 3 open/close ───
  const handleStage3Open = useCallback(() => {
    setStage3Open(true);
  }, []);

  const handleStage3Close = useCallback(() => {
    setStage3Open(false);
  }, []);

  // ─── Spec rows (from data or default) ───
  const specRows: { label: string; value: string }[] = technicalSpecs ?? [
    ...(pros?.slice(0, 3).map((p) => ({ label: "Pro", value: p })) ?? []),
    ...(cons?.slice(0, 3).map((c) => ({ label: "Con", value: c })) ?? []),
  ];

  return (
    <>
      {/* ─── Stage 1 & 2 — The Card ─── */}
      <motion.div
        ref={cardRef}
        layoutId={`cinematic-card-${id}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered && !stage3Open
            ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
          transition: isHovered ? "transform 0.08s ease-out" : "transform 0.4s ease-out",
        }}
        className="group cursor-pointer"
        onClick={handleStage2}
      >
        {/* Outer glow ring — visible on hover */}
        <motion.div
          className="absolute -inset-[1.5px] rounded-2xl pointer-events-none z-0"
          animate={{
            opacity: isHovered ? 0.7 : 0,
            background: isHovered
              ? "radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(251,191,36,0.15), transparent 50%)"
              : "transparent",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Card body */}
        <div
          className="relative z-10 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06]
                     overflow-hidden transition-all duration-300 hover:border-white/[0.12]
                     shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
        >
          {/* ─── Stage 1 Header ─── */}
          <div className="p-4 sm:p-5">
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden">
                <AssetPlaceholder label={imageLabel ?? title} aspectRatio="1:1" />
              </div>

              <div className="flex-1 min-w-0">
                {/* Badge + Tier row */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {badgeText && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider
                                     bg-amber-900/30 text-amber-400 border border-amber-800/40">
                      {badgeText}
                    </span>
                  )}
                  {tierLabel && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase
                                     bg-white/[0.06] text-surface-500">
                      {tierLabel}
                    </span>
                  )}
                  {category && (
                    <span className="text-[10px] text-surface-600 font-mono uppercase">{category}</span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{title}</h3>
                <p className="text-sm text-surface-400 mt-1 line-clamp-2 leading-relaxed">{shortSummary}</p>

                {/* Pros / Cons badges */}
                {(pros || cons) && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {pros?.slice(0, 2).map((p) => (
                      <span key={p} className="tag-green">{p}</span>
                    ))}
                    {cons?.slice(0, 1).map((c) => (
                      <span key={c} className="tag-red">{c}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Expand indicator */}
            <div className="flex items-center gap-1.5 mt-3 text-xs text-surface-500 transition-colors group-hover:text-surface-400">
              {stage === 2 ? (
                <><ChevronDown className="w-3.5 h-3.5 rotate-180" /> Less</>
              ) : (
                <><ChevronDown className="w-3.5 h-3.5" /> Quick details</>
              )}
            </div>
          </div>

          {/* ─── Stage 2 — Soft Reveal ─── */}
          <AnimatePresence initial={false}>
            {stage >= 2 && (
              <motion.div
                key="stage2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-white/[0.06] pt-3">
                  {/* Quick answer content */}
                  {quickAnswerContent ?? (
                    <div className="space-y-3">
                      {/* Pros list */}
                      {pros && pros.length > 0 && (
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Pros</span>
                          <ul className="mt-1 space-y-0.5">
                            {pros.map((p, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-surface-300">
                                <span className="text-emerald-500 mt-0.5 shrink-0">+</span> {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* Cons list */}
                      {cons && cons.length > 0 && (
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold">Cons</span>
                          <ul className="mt-1 space-y-0.5">
                            {cons.map((c, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-surface-300">
                                <span className="text-red-500 mt-0.5 shrink-0">−</span> {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Extra children (warning, insight, callouts) */}
                  {children && <div className="mt-3">{children}</div>}

                  {/* Insight callout */}
                  {insightText && (
                    <div className="mt-3 insight-banner rounded-xl p-3 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-300/90">{insightText}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStage3Open(); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                 bg-white/[0.06] text-surface-300 hover:bg-white/[0.10] hover:text-white transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Deep Dive ↗
                    </button>

                    {whatsappText && (
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                   bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/30 transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Share
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ─── Stage 3 — Deep Dive Modal ─── */}
      <AnimatePresence>
        {stage3Open && (
          <Stage3DeepDive
            id={id}
            title={title}
            specRows={specRows}
            fullSpecContent={fullSpecContent}
            insightText={insightText}
            whatsappText={whatsappText}
            onClose={handleStage3Close}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Stage 3 — Deep Dive ───
   Desktop: centered frosted glass modal
   Mobile: drag-to-close bottom sheet
─── */

function Stage3DeepDive({
  id, title, specRows, fullSpecContent, insightText, whatsappText, onClose,
}: {
  id: string;
  title: string;
  specRows: { label: string; value: string }[];
  fullSpecContent?: ReactNode;
  insightText?: string;
  whatsappText?: string;
  onClose: () => void;
}) {
  const [dragY, setDragY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Lock body scroll & handle Escape
  const bodyRef = useRef<string>("");
  if (typeof document !== "undefined") {
    bodyRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  }

  const cleanup = useCallback(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = bodyRef.current;
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, []);

  // Handle drag end for mobile
  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    if (info.offset.y > 150 || info.velocity.y > 400) {
      cleanup();
      onClose();
    } else {
      setDragY(0);
    }
  }, [onClose, cleanup]);

  // Escape key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      cleanup();
      onClose();
    }
  }, [onClose, cleanup]);

  // Click backdrop to close
  const handleBackdropClick = useCallback(() => {
    cleanup();
    onClose();
  }, [onClose, cleanup]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop — dim & blur */}
      <motion.div
        className="absolute inset-0 bg-[#05050A]/80 backdrop-blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel — layoutId for morphing */}
      <motion.div
        ref={sheetRef}
        layoutId={`cinematic-card-${id}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Deep dive: ${title}`}
        // Mobile: drag to close
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onDrag={(_, info) => setDragY(info.offset.y)}
        onClick={(e) => e.stopPropagation()}
        style={{
          y: dragY,
          opacity: dragY > 0 ? Math.max(0, 1 - dragY / 600) : 1,
        }}
        initial={{ y: "100%", scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: "100%", scale: 0.95, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
          mass: 0.8,
        }}
        className="
          relative w-full max-h-[92vh] overflow-y-auto
          /* Mobile: rounded top, full width */
          rounded-t-3xl sm:rounded-3xl
          /* Desktop: max-width centered, frosted glass */
          sm:max-w-2xl sm:max-h-[85vh]
          bg-[#0A0A0C] border border-white/[0.08]
          shadow-[0_32px_64px_rgba(0,0,0,0.5)]
          /* Glow effect on desktop */
          sm:shadow-[0_0_0_1px_rgba(251,191,36,0.08),0_32px_64px_rgba(0,0,0,0.5)]
          inset-x-0 sm:inset-x-auto
          mx-auto
        "
      >
        {/* Drag handle indicator — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/[0.15]" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-8 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{title}</h2>
            <p className="text-sm text-surface-400 mt-1">Specification Sheet</p>
          </div>
          <button
            onClick={() => { cleanup(); onClose(); }}
            className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-surface-400" />
          </button>
        </div>

        {/* Specs table */}
        <div className="px-5 sm:px-8">
          <div className="space-y-0.5">
            {specRows.map((row) => (
              <div
                key={`${row.label}-${row.value}`}
                className="flex items-start gap-4 py-2.5 border-b border-white/[0.04] last:border-0"
              >
                <span className="text-xs font-medium text-surface-500 uppercase tracking-wider w-1/3 shrink-0">
                  {row.label}
                </span>
                <span className="text-sm text-surface-200">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full spec content (e.g. comparison table) */}
        {fullSpecContent && (
          <div className="px-5 sm:px-8 mt-6">{fullSpecContent}</div>
        )}

        {/* Insight */}
        {insightText && (
          <div className="mx-5 sm:mx-8 mt-6 insight-banner rounded-xl p-3 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-300/90">{insightText}</p>
          </div>
        )}

        {/* Actions */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                       bg-white/[0.06] text-surface-300 hover:bg-white/[0.10] hover:text-white transition-all"
          >
            <FileText className="w-4 h-4" />
            Print / PDF
          </button>
          {whatsappText && (
            <a
              href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                         bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/30 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Share
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
