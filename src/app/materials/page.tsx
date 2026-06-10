"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  Hash,
} from "lucide-react";
import { AssetPlaceholder } from "@/components/AssetPlaceholder";
import materialsData from "../../../phase-1-deliverables/data/materials.json";

// ─── Types ───

interface PlywoodGrade {
  id: string;
  grade: string;
  fullName: string;
  alsoKnownAs: string;
  moistureLevel: string;
  description: string;
  properties: Record<string, string>;
  applications: string[];
  limitations: string[];
  costTier: number;
  costLabel: string;
  takeaway: string;
  media: { card_image?: string; icon?: string; diagram?: string };
}

interface EngineeredBoard {
  id: string;
  name: string;
  fullName: string;
  type: string;
  definition: string;
  composition: string;
  properties: Record<string, string>;
  applications: string[];
  limitations: string[];
  bestFor: string;
  costTier: number;
  takeaway: string;
  media: { card_image?: string; icon?: string; diagram?: string };
}

interface UsageRule {
  area: string;
  recommendedGrade: string;
  note: string;
}

interface ThicknessEntry {
  thickness: string;
  applications: string[];
  loadRating: string;
  structural: boolean;
}

type MaterialsModule = {
  module: string;
  sections: {
    plywoodGrades: {
      title: string;
      summary: string;
      overview: { definition: string; whyCommonlyUsed: string[]; coreGuideline: string };
      grades: PlywoodGrade[];
      usageGuide: { title: string; rules: UsageRule[]; criticalWarning: string };
    };
    engineeredBoards: {
      title: string;
      summary: string;
      boards: EngineeredBoard[];
      comparisonSummary: Record<string, { title: string; verdict: string }>;
    };
    plywoodThickness: {
      title: string;
      summary: string;
      thicknesses: ThicknessEntry[];
      takeaway: string;
    };
  };
};

const data = materialsData as unknown as MaterialsModule;
const { plywoodGrades, engineeredBoards, plywoodThickness } = data.sections;

// ─── Interactive Plywood Grade Card ───

function PlywoodCard({ grade, index }: { grade: PlywoodGrade; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 25 }}
      className="group relative"
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="relative cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-wider">
                Tier {grade.costTier}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                {grade.costLabel}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">{grade.grade}</h3>
            <p className="text-sm text-zinc-400 mt-0.5">{grade.fullName}</p>
          </div>
          <AssetPlaceholder label={grade.grade} aspectRatio="1:1" className="w-20 h-20 shrink-0 rounded-xl" />
        </div>

        {/* Moisture */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-brand-500/60" />
          <span className="text-xs text-zinc-400">{grade.moistureLevel}</span>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed line-clamp-2">{grade.description}</p>

        {/* Expand / Collapse */}
        <div className="flex items-center gap-1.5 mt-4 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
          {expanded ? (
            <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> Show details</>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
              {/* Best For Tags */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Best For
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {grade.applications.map((app) => (
                    <span
                      key={app}
                      className="px-2.5 py-1 rounded-full text-xs bg-green-900/30 text-green-400 border border-green-800/40"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Avoid Tags */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-red-500" /> Avoid
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {grade.limitations.map((lim) => (
                    <span
                      key={lim}
                      className="px-2.5 py-1 rounded-full text-xs bg-red-900/30 text-red-400 border border-red-800/40"
                    >
                      {lim}
                    </span>
                  ))}
                </div>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(grade.properties).map(([key, val]) => (
                  <div key={key} className="p-2 rounded-lg bg-zinc-800/40">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className="text-xs text-zinc-300 mt-0.5">{val}</div>
                  </div>
                ))}
              </div>

              {/* Takeaway */}
              <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-800/30 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-300/90 leading-relaxed">{grade.takeaway}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Engineered Board Card ───

function BoardCard({ board, index }: { board: EngineeredBoard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 25 }}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-5 hover:border-zinc-700 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand-400 uppercase">Tier {board.costTier}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{board.type}</span>
          </div>
          <h3 className="text-base font-bold text-zinc-100">{board.name}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">{board.composition}</p>
        </div>
      </div>

      <div className="mb-3">
        <AssetPlaceholder label={`${board.name} — ${board.bestFor}`} aspectRatio="16:9" />
      </div>

      <p className="text-sm text-zinc-300 leading-relaxed line-clamp-2 mb-3">{board.definition}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {Object.entries(board.properties).slice(0, 4).map(([key, val]) => (
          <span key={key} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
            {key.replace(/([A-Z])/g, " $1").trim()}: {val}
          </span>
        ))}
      </div>

      {/* Best For */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-zinc-500 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-green-500" /> Best For
        </h4>
        <div className="flex flex-wrap gap-1">
          {board.applications.slice(0, 4).map((app) => (
            <span key={app} className="text-[10px] px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 border border-green-800/40">
              {app}
            </span>
          ))}
          {board.applications.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 text-zinc-500">+{board.applications.length - 4}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Usage Guide Table ───

function UsageGuide({ rules, warning }: { rules: UsageRule[]; warning: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h3 className="text-sm font-bold text-zinc-100 mb-4 flex items-center gap-2">
        <Hash className="w-4 h-4 text-brand-400" />
        Where to Use Each Grade
      </h3>
      <div className="space-y-2">
        {rules.map((rule, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60"
          >
            <div className="text-sm font-medium text-zinc-200">{rule.area}</div>
            <div className="text-xs text-brand-400 mt-0.5 font-mono">{rule.recommendedGrade}</div>
            <div className="text-xs text-zinc-500 mt-1">{rule.note}</div>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 p-3 rounded-xl bg-red-900/20 border border-red-800/30 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
        <p className="text-xs text-red-300/90">{warning}</p>
      </div>
    </div>
  );
}

// ─── Thickness Guide ───

function ThicknessGuide({ thicknesses }: { thicknesses: ThicknessEntry[] }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h3 className="text-sm font-bold text-zinc-100 mb-4">Plywood Thickness Guide</h3>
      <div className="space-y-1">
        {thicknesses.map((t, i) => (
          <motion.div
            key={t.thickness}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              t.structural
                ? "border-brand-800/40 bg-brand-900/20"
                : "border-zinc-800 bg-zinc-900/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold font-mono ${t.structural ? "text-brand-400" : "text-zinc-300"}`}>
                {t.thickness}
              </span>
              <div className="text-xs text-zinc-500">
                {t.applications.slice(0, 2).join(" · ")}
                {t.applications.length > 2 && <span className="text-zinc-600"> · +{t.applications.length - 2}</span>}
              </div>
            </div>
            <span className="text-[10px] font-mono text-zinc-600">{t.loadRating}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───

export default function MaterialsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero */}
      <section className="relative border-b border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/30 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-brand-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Core Materials</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
              The Inside Strength
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
              {plywoodGrades.summary}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: Overview */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm"
        >
          <p className="text-sm text-zinc-300 leading-relaxed">{plywoodGrades.overview.definition}</p>
          <ul className="mt-3 space-y-1">
            {plywoodGrades.overview.whyCommonlyUsed.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <ArrowRight className="w-3.5 h-3.5 text-brand-500 mt-0.5 shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 rounded-xl bg-brand-900/20 border border-brand-800/30">
            <p className="text-sm text-brand-300/90 leading-relaxed">{plywoodGrades.overview.coreGuideline}</p>
          </div>
        </motion.div>
      </section>

      {/* Section: Plywood Grades */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Plywood Grades</h2>
          <p className="text-sm text-zinc-500">Each grade is designed for specific moisture and structural requirements.</p>
        </div>
        <div className="space-y-4">
          {plywoodGrades.grades.map((grade, i) => (
            <PlywoodCard key={grade.id} grade={grade} index={i} />
          ))}
        </div>
      </section>

      {/* Section: Usage Guide */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <UsageGuide rules={plywoodGrades.usageGuide.rules} warning={plywoodGrades.usageGuide.criticalWarning} />
      </section>

      {/* Section: Engineered Boards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Engineered Boards</h2>
          <p className="text-sm text-zinc-500">{engineeredBoards.summary}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {engineeredBoards.boards.map((board, i) => (
            <BoardCard key={board.id} board={board} index={i} />
          ))}
        </div>

        {/* Comparison Summaries */}
        <div className="mt-8 space-y-3">
          {Object.entries(engineeredBoards.comparisonSummary).map(([key, val]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-4 rounded-xl border border-amber-800/30 bg-amber-900/20 flex items-start gap-2"
            >
              <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-amber-300">{val.title}</h4>
                <p className="text-xs text-amber-300/70 mt-1 leading-relaxed">{val.verdict}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section: Thickness Guide */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <ThicknessGuide thicknesses={plywoodThickness.thicknesses} />
        <div className="mt-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <p className="text-sm text-zinc-400 leading-relaxed">
            💡 {plywoodThickness.takeaway}
          </p>
        </div>
      </section>
    </div>
  );
}
