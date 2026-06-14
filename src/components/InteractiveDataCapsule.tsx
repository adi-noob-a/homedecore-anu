"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Pin, PinOff, Eye, EyeOff, MessageCircle, FileText, X } from "lucide-react";
import { AssetPlaceholder } from "./AssetPlaceholder";
import { useCompare } from "./CompareModeProvider";
import type { CompareItem } from "./CompareModeProvider";

/* ─── Props ─── */

interface SpecRow {
  label: string;
  value: string;
}

export interface InteractiveDataCapsuleProps {
  id: string;
  category: string;
  title: string;
  tagline: string;
  imageLabel: string;
  tierLabel?: string;           // e.g. "Tier 3", "Budget"
  tags?: { label: string; variant: "green" | "red" | "amber" }[];
  /** Shown at Stage 2 — the quick-answer content */
  quickAnswerContent: ReactNode;
  /** Full spec rows for Stage 3 table */
  specRows: SpecRow[];
  /** Full spec content for Stage 3 detail view */
  fullSpecContent?: ReactNode;
  /** WhatsApp share text */
  whatsappText?: string;
  /** Warning callout to keep visible at Stage 1/2 (never buried) */
  warningCallout?: ReactNode;
  /** Insight/bulb callout */
  insightCallout?: ReactNode;
  /** If true, starts at Stage 2 */
  defaultExpanded?: boolean;
}

/* ─── Component ─── */

export function InteractiveDataCapsule({
  id, category, title, tagline, imageLabel, tierLabel, tags,
  quickAnswerContent, specRows, fullSpecContent, whatsappText,
  warningCallout, insightCallout, defaultExpanded = false,
}: InteractiveDataCapsuleProps) {
  const [stage, setStage] = useState<1 | 2 | 3>(defaultExpanded ? 2 : 1);
  const [stage3Open, setStage3Open] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isPinned, togglePin } = useCompare();
  const pinned = isPinned(id);

  const handleStage2 = useCallback(() => {
    setStage((s) => (s === 1 ? 2 : 1));
  }, []);

  const handleStage3Open = useCallback(() => {
    setStage3Open(true);
  }, []);

  const handleStage3Close = useCallback(() => {
    setStage3Open(false);
  }, []);

  // Build compare item
  const compareItem: CompareItem = { id, title, specRows, category };

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        layout
      >
        <div className="glass glass-hover rounded-2xl overflow-hidden">
          {/* Stage 1 — Clickable card header */}
          <div
            onClick={handleStage2}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleStage2(); }}}
            role="button"
            tabIndex={0}
            aria-expanded={stage >= 2}
            className="cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400/60"
          >
            <div className="p-4 sm:p-5">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden">
                  <AssetPlaceholder label={imageLabel} aspectRatio="1:1" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Top row: tier + pin */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {tierLabel && (
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                          {tierLabel}
                        </span>
                      )}
                      <span className="text-[10px] text-surface-600 font-mono uppercase">{category}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePin(compareItem); }}
                      className="shrink-0 p-1 rounded hover:bg-white/[0.06] transition-colors"
                      aria-label={pinned ? "Unpin from comparison" : "Pin to compare"}
                    >
                      {pinned ? (
                        <PinOff className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Pin className="w-3.5 h-3.5 text-surface-500" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{title}</h3>
                  <p className="text-sm text-surface-400 mt-1 line-clamp-2 leading-relaxed">{tagline}</p>

                  {/* Tags */}
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((t) => (
                        <span key={t.label} className={
                          t.variant === "green" ? "tag-green" : t.variant === "red" ? "tag-red" : "tag-amber"
                        }>
                          {t.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Warning callout — always visible at Stage 1/2 */}
              {warningCallout && (
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                  {warningCallout}
                </div>
              )}

              {/* Expand indicator */}
              <div className="flex items-center gap-1.5 mt-3 text-xs text-surface-500 transition-colors">
                {stage === 2 ? (
                  <><ChevronDown className="w-3.5 h-3.5 rotate-180" /> Less</>
                ) : (
                  <><ChevronDown className="w-3.5 h-3.5" /> Quick details</>
                )}
              </div>
            </div>
          </div>

          {/* Stage 2 — Inline expanded quick answer */}
          <AnimatePresence initial={false}>
            {stage >= 2 && (
              <motion.div
                key="stage2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-white/[0.06] pt-3">
                  {quickAnswerContent}

                  {insightCallout && (
                    <div className="mt-3">{insightCallout}</div>
                  )}

                  {/* Actions row */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStage3Open(); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                 bg-white/[0.06] text-surface-300 hover:bg-white/[0.10] hover:text-white transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Full Spec Sheet ↓
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
                        Share via WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Stage 3 — Full spec sheet (modal on desktop, drawer on mobile) */}
      <AnimatePresence>
        {stage3Open && (
          <Stage3Modal
            title={title}
            specRows={specRows}
            fullSpecContent={fullSpecContent}
            whatsappText={whatsappText}
            onClose={handleStage3Close}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Stage 3 Modal / Drawer ─── */

function Stage3Modal({
  title, specRows, fullSpecContent, whatsappText, onClose,
}: {
  title: string;
  specRows: SpecRow[];
  fullSpecContent?: ReactNode;
  whatsappText?: string;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus, handle Escape, prevent body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = prev;
      document.body.style.position = "";
      document.body.style.width = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-3xl" />

      {/* Panel */}
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Full spec sheet: ${title}`}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl
                   bg-zinc-950 border border-white/[0.08] shadow-2xl p-6 sm:p-8"
        // iOS-safe drag: we use spring; full drag-to-dismiss is omitted for reliability
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-surface-400 mt-1">Full Specification Sheet</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-surface-400" />
          </button>
        </div>

        {/* Spec table */}
        <div className="space-y-0.5 mb-6">
          {specRows.map((row) => (
            <div
              key={row.label}
              className="flex items-start gap-4 py-2.5 border-b border-white/[0.04] last:border-0"
            >
              <span className="text-xs font-medium text-surface-500 uppercase tracking-wider w-1/3 shrink-0">
                {row.label}
              </span>
              <span className="text-sm text-surface-200">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Full spec content (if any — e.g. comparison vs layout) */}
        {fullSpecContent && (
          <div className="mb-6">{fullSpecContent}</div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                       bg-white/[0.06] text-surface-300 hover:bg-white/[0.10] hover:text-white transition-all"
          >
            <FileText className="w-4 h-4" />
            Print / Save PDF
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
              Share via WhatsApp
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
