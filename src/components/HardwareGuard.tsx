"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import type { WardrobeType, HardwareTier, FinishId } from "@/lib/types";
import { getFinishTiers } from "@/lib/data";

interface HardwareGuardProps {
  wardrobeType: WardrobeType;
  hardwareTier: HardwareTier;
  wardrobeFinish: FinishId;
  onHardwareUpgrade?: () => void;
}

interface GuardWarning {
  id: string;
  severity: "critical" | "warning";
  headline: string;
  detail: string;
  suggestion: string;
}

export function HardwareGuard({
  wardrobeType,
  hardwareTier,
  wardrobeFinish,
  onHardwareUpgrade,
}: HardwareGuardProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [animateShake, setAnimateShake] = useState(false);

  const finishTiers = getFinishTiers();
  const finishCostTier = finishTiers.find((t) => t.id === wardrobeFinish)?.costTier ?? 0;

  // Check if finish is heavy (PU, Lacquered Glass = high cost tier = heavier on hardware)
  const isHeavyFinish = finishCostTier >= 5; // PU or Lacquered Glass
  const isSlidingWithIndian = wardrobeType === "sliding" && hardwareTier === "indian";
  const isHeavySliding = wardrobeType === "sliding" && isHeavyFinish && hardwareTier === "indian";

  const warnings: GuardWarning[] = [];

  if (isSlidingWithIndian) {
    warnings.push({
      id: "sliding-indian",
      severity: "critical",
      headline: "Sliding Wardrobe × Indian Hardware — Risk of track sagging",
      detail:
        "Sliding wardrobes require high-quality sliding channels. Low-quality channels can cause wobbling, misalignment, and eventual jamming over time. Indian hardware has lower load ratings that may not support frequent sliding door usage.",
      suggestion: "Upgrade to German-based accessories for smoother soft-close and better load-bearing.",
    });
  }

  if (isHeavySliding) {
    warnings.push({
      id: "heavy-sliding",
      severity: "critical",
      headline: "Heavy Shutters + Sliding + Budget Hardware — Structural Risk",
      detail: `${wardrobeFinish === "pu"
        ? "PU"
        : wardrobeFinish === "lacquered-glass"
        ? "Lacquered glass"
        : "Heavy"} shutters on sliding systems with Indian hardware creates excessive load on tracks. The combined weight can cause permanent track deformation, door sagging, and eventual system failure within 1-2 years.`,
      suggestion: "Switch to German heavy-duty sliding channels OR change to swing wardrobe (which distributes weight better via hinges).",
    });
  }

  if (isHeavyFinish && wardrobeType === "swing" && hardwareTier === "indian") {
    warnings.push({
      id: "heavy-swing-indian",
      severity: "warning",
      headline: "Heavy Shutters with Standard Hinges — Consider upgrading",
      detail:
        `${wardrobeFinish === "pu" ? "PU" : "Lacquered glass"} shutters are heavier than standard laminate. Indian hinges have lower load ratings and may sag over time with the added weight.`,
      suggestion: "Consider German hinges for heavy shutters to maintain alignment and prevent sagging.",
    });
  }

  const activeWarnings = warnings.filter((w) => !dismissed.has(w.id));

  // Trigger shake animation when warnings appear
  useEffect(() => {
    if (activeWarnings.length > 0) {
      setAnimateShake(true);
      const timer = setTimeout(() => setAnimateShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [activeWarnings.length, wardrobeType, hardwareTier, wardrobeFinish]);

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  if (activeWarnings.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: 1,
          height: "auto",
          x: animateShake ? [0, -4, 4, -2, 2, 0] : 0,
        }}
        transition={{
          height: { duration: 0.3, ease: "easeOut" },
          x: animateShake ? { duration: 0.4, ease: "easeInOut" } : undefined,
        }}
        className="overflow-hidden"
      >
        <div className="space-y-2 p-3 rounded-xl border-2 border-danger-200 bg-danger-50">
          {activeWarnings.map((warning) => (
            <motion.div
              key={warning.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <AlertTriangle className="w-5 h-5 text-danger-500" />
                  </motion.div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-danger-800">
                      {warning.severity === "critical" ? "🚨 " : "⚠️ "}
                      {warning.headline}
                    </h4>
                    <button
                      onClick={() => dismiss(warning.id)}
                      className="shrink-0 p-0.5 rounded hover:bg-danger-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-danger-400" />
                    </button>
                  </div>
                  <p className="text-xs text-danger-700 mt-1 leading-relaxed">{warning.detail}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-danger-600 font-medium">💡 {warning.suggestion}</span>
                    {onHardwareUpgrade && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onHardwareUpgrade}
                        className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
                      >
                        Upgrade to German
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
