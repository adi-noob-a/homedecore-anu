"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

export interface CompareItem {
  id: string;
  title: string;
  specRows: { label: string; value: string }[];
  category: string;
}

interface CompareContextValue {
  pinned: CompareItem[];
  maxPins: number;
  isPinned: (id: string) => boolean;
  togglePin: (item: CompareItem) => void;
  clearAll: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be inside CompareProvider");
  return ctx;
}

const STORAGE_KEY = "idh-compare-pins";

function loadPins(): CompareItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePins(items: CompareItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* noop */ }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [pinned, setPinned] = useState<CompareItem[]>([]);
  const maxPins = 3;

  // Hydrate from localStorage on mount
  useEffect(() => { setPinned(loadPins()); }, []);

  const isPinned = useCallback((id: string) => pinned.some((p) => p.id === id), [pinned]);

  const togglePin = useCallback((item: CompareItem) => {
    setPinned((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      const next = exists
        ? prev.filter((p) => p.id !== item.id)
        : prev.length >= maxPins
        ? [...prev.slice(1), item]
        : [...prev, item];
      savePins(next);
      return next;
    });
  }, [maxPins]);

  const clearAll = useCallback(() => {
    setPinned([]);
    savePins([]);
  }, []);

  return (
    <CompareContext.Provider value={{ pinned, maxPins, isPinned, togglePin, clearAll }}>
      {children}
      <CompareFloatingBar />
    </CompareContext.Provider>
  );
}

function CompareFloatingBar() {
  const { pinned, clearAll } = useCompare();
  const [open, setOpen] = useState(false);

  if (pinned.length === 0) return null;

  // Build common spec rows across all pinned items
  const allLabels = [...new Set(pinned.flatMap((p) => p.specRows.map((r) => r.label)))];

  return (
    <>
      {/* Trigger bar */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
      >
        <button
          onClick={() => setOpen(!open)}
          className="btn-amber flex items-center gap-2 px-5 py-2.5 text-sm shadow-lg"
        >
          Compare ({pinned.length})
          <ArrowRight className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </motion.div>

      {/* Comparison panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-4 bottom-20 z-40 max-w-3xl mx-auto"
          >
            <div className="glass-strong rounded-2xl p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Side-by-Side Comparison</h3>
                <button onClick={clearAll} className="text-xs text-surface-500 hover:text-surface-300 transition-colors">
                  Clear all
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-surface-500 font-medium text-xs uppercase tracking-wider w-1/4">Property</th>
                      {pinned.map((p) => (
                        <th key={p.id} className="p-2 text-white font-semibold text-xs">{p.title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allLabels.map((label) => (
                      <tr key={label} className="border-t border-white/[0.04]">
                        <td className="p-2 text-surface-400 text-xs">{label}</td>
                        {pinned.map((p) => {
                          const row = p.specRows.find((r) => r.label === label);
                          return (
                            <td key={p.id} className="p-2 text-surface-300 text-xs">
                              {row?.value ?? "—"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
