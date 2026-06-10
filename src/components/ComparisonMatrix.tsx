"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { getComparisons, getComparisonById } from "@/lib/data";
import type { ComparisonData, PropertyType } from "@/lib/types";

const springTransition = { type: "spring", stiffness: 300, damping: 30 };

export function ComparisonMatrix() {
  const comparisons = getComparisons();
  const [activeTab, setActiveTab] = useState(comparisons[0]?.id ?? "");
  const [context, setContext] = useState<"budget" | "premium">("budget");
  const [expandedMobileRow, setExpandedMobileRow] = useState<string | null>(null);

  const activeComparison = getComparisonById(activeTab);

  if (!comparisons.length) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-surface-900 mb-2">Material & Finish Comparisons</h2>
      <p className="text-surface-500 text-sm mb-6">
        Side-by-side comparisons to help you make informed material choices.
      </p>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {comparisons.map((comp, i) => (
          <motion.button
            key={comp.id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => setActiveTab(comp.id)}
            className={`relative px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
              activeTab === comp.id
                ? "bg-brand-500 text-white shadow-sm"
                : "bg-surface-100 text-surface-600 hover:bg-surface-200"
            }`}
          >
            {comp.title}
            {activeTab === comp.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-xl bg-brand-500 -z-10"
                transition={springTransition}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Context Toggle — Double-Bridge Engine */}
      <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-surface-50 border border-surface-200">
        <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">
          I'm planning a
        </span>
        <div className="flex rounded-lg border border-surface-200 overflow-hidden">
          <button
            onClick={() => setContext("budget")}
            className={`px-4 py-1.5 text-xs font-semibold transition-all ${
              context === "budget"
                ? "bg-rental text-white"
                : "bg-white text-surface-600 hover:bg-surface-50"
            }`}
          >
            Rental / Budget
          </button>
          <button
            onClick={() => setContext("premium")}
            className={`px-4 py-1.5 text-xs font-semibold transition-all ${
              context === "premium"
                ? "bg-brand-500 text-white"
                : "bg-white text-surface-600 hover:bg-surface-50"
            }`}
          >
            Personal / Premium
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <AnimatePresence mode="wait">
        {activeComparison && (
          <motion.div
            key={activeTab + context}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-surface-200 overflow-hidden"
          >
            {/* Desktop: Table Layout */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50">
                    <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider p-4 w-1/4">
                      Dimension
                    </th>
                    <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider p-4 w-[37.5%]">
                      {activeComparison.title.split(" vs ")[0]}
                    </th>
                    <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider p-4 w-[37.5%]">
                      {activeComparison.title.split(" vs ")[1]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeComparison.dimensions.map((dim, i) => {
                    // Compute winner for context-dependent rows
                    const leftWins =
                      dim.contextDependent && context
                        ? (context === "budget" && dim.leftWinsWhen?.includes("budget")) ||
                          (context === "premium" && dim.leftWinsWhen?.includes("premium"))
                        : dim.leftIsWinner;
                    const rightWins =
                      dim.contextDependent && context
                        ? (context === "budget" && dim.rightWinsWhen?.includes("budget")) ||
                          (context === "premium" && dim.rightWinsWhen?.includes("premium"))
                        : dim.rightIsWinner;

                    return (
                      <motion.tr
                        key={dim.label}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={`border-b border-surface-100 last:border-b-0 ${
                          i % 2 === 0 ? "bg-white" : "bg-surface-50/50"
                        }`}
                        onMouseEnter={() => {}}
                      >
                        <td className="p-4 text-sm font-medium text-surface-700">
                          {dim.label}
                          {dim.contextDependent && (
                            <span className="ml-1 text-[10px] text-warning-500">*</span>
                          )}
                          {dim.rightCaution && (
                            <Info className="inline w-3 h-3 ml-1 text-surface-400 cursor-help" />
                          )}
                        </td>
                        <td
                          className={`p-4 text-sm transition-all ${
                            leftWins ? "bg-brand-50/80" : ""
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {leftWins && (
                              <span className="mt-0.5 text-brand-500 text-xs font-bold shrink-0">
                                ✓
                              </span>
                            )}
                            <span className={dim.leftRiskLevel === "high" ? "text-danger-600" : "text-surface-700"}>
                              {dim.leftValue}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`p-4 text-sm transition-all ${
                            rightWins ? "bg-brand-50/80" : ""
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {rightWins && (
                              <span className="mt-0.5 text-brand-500 text-xs font-bold shrink-0">
                                ✓
                              </span>
                            )}
                            <div>
                              <span className={dim.rightRiskLevel === "high" ? "text-danger-600" : "text-surface-700"}>
                                {dim.rightValue}
                              </span>
                              {dim.rightCondition && (
                                <div className="text-[10px] text-warning-600 mt-1 italic">
                                  ⚠ {dim.rightCondition}
                                </div>
                              )}
                              {dim.rightCaution && (
                                <div className="text-[10px] text-danger-500 mt-1 italic">
                                  ⚠ {dim.rightCaution}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile: Accordion Cards */}
            <div className="md:hidden">
              {activeComparison.dimensions.map((dim, i) => {
                const isExpanded = expandedMobileRow === dim.label;
                return (
                  <motion.div
                    key={dim.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-surface-100 last:border-b-0"
                  >
                    <button
                      onClick={() => setExpandedMobileRow(isExpanded ? null : dim.label)}
                      className="w-full flex items-center justify-between p-3 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-surface-700">{dim.label}</span>
                        {dim.contextDependent && (
                          <span className="text-[10px] text-warning-500">*</span>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-surface-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-surface-400" />
                      )}
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 space-y-2">
                            <div className="p-2 rounded-lg bg-surface-50">
                              <span className="text-[10px] font-semibold text-surface-500 uppercase">
                                {activeComparison.title.split(" vs ")[0]}
                              </span>
                              <p className="text-xs text-surface-700 mt-0.5">{dim.leftValue}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-surface-50">
                              <span className="text-[10px] font-semibold text-surface-500 uppercase">
                                {activeComparison.title.split(" vs ")[1]}
                              </span>
                              <p className="text-xs text-surface-700 mt-0.5">{dim.rightValue}</p>
                              {dim.rightCondition && (
                                <p className="text-[10px] text-warning-600 mt-1">⚠ {dim.rightCondition}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Verdict Card — Dynamic Winner */}
            <div className="p-4 border-t border-surface-200 bg-surface-50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={context}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={springTransition}
                >
                  {(() => {
                    const verdict = activeComparison.verdicts[context];
                    if (!verdict) return null;
                    return (
                      <div className="text-center">
                        <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                          Value Verdict
                        </span>
                        <div className="mt-1 flex items-center justify-center gap-2">
                          <span className={`text-lg font-bold ${
                            verdict.winner === "granite" || verdict.winner === "hdhmr" || verdict.winner === "mdf" || verdict.winner === "sliding" || verdict.winner === "indian"
                              ? "text-rental"
                              : "text-brand-600"
                          }`}>
                            ✦ {verdict.message}
                          </span>
                        </div>
                        {verdict.condition && (
                          <p className="text-xs text-warning-600 mt-1">⚠ {verdict.condition}</p>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Takeaway */}
      {activeComparison?.takeaway && (
        <div className="mt-6 p-4 rounded-xl bg-brand-50 border border-brand-100">
          <div className="flex gap-3">
            <span className="text-brand-500 text-lg leading-none">💡</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                The Takeaway
              </span>
              <p className="text-sm text-surface-700 mt-1">{activeComparison.takeaway}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
