"use client";

import { motion } from "framer-motion";
import { Layers, Hash, AlertTriangle, Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import { InteractiveDataCapsule } from "@/components/InteractiveDataCapsule";
import { StickyCtaBar } from "@/components/StickyCtaBar";
import materialsData from "../../../phase-1-deliverables/data/materials.json";

// ─── Types ───

interface PlywoodGrade {
  id: string; grade: string; fullName: string; alsoKnownAs: string;
  moistureLevel: string; description: string;
  properties: Record<string, string>; applications: string[]; limitations: string[];
  costTier: number; costLabel: string; takeaway: string;
  media: { card_image?: string; icon?: string; diagram?: string };
}

interface EngineeredBoard {
  id: string; name: string; fullName: string; type: string;
  definition: string; composition: string;
  properties: Record<string, string>; applications: string[]; limitations: string[];
  bestFor: string; costTier: number; takeaway: string;
  media: { card_image?: string; icon?: string; diagram?: string };
}

interface UsageRule { area: string; recommendedGrade: string; note: string; }
interface ThicknessEntry { thickness: string; applications: string[]; loadRating: string; structural: boolean; }

type MaterialsModule = {
  module: string;
  sections: {
    plywoodGrades: {
      title: string; summary: string;
      overview: { definition: string; whyCommonlyUsed: string[]; coreGuideline: string };
      grades: PlywoodGrade[];
      usageGuide: { title: string; rules: UsageRule[]; criticalWarning: string };
    };
    engineeredBoards: {
      title: string; summary: string; boards: EngineeredBoard[];
      comparisonSummary: Record<string, { title: string; verdict: string }>;
    };
    plywoodThickness: {
      title: string; summary: string; thicknesses: ThicknessEntry[]; takeaway: string;
    };
  };
};

const data = materialsData as unknown as MaterialsModule;
const { plywoodGrades, engineeredBoards, plywoodThickness } = data.sections;

// ─── Helpers ───

function propertiesToSpecRows(props: Record<string, string>): { label: string; value: string }[] {
  return Object.entries(props).map(([k, v]) => ({
    label: k.replace(/([A-Z])/g, " $1").trim(),
    value: v,
  }));
}

// ─── Usage Guide (standalone) ───

function UsageGuide({ rules, warning }: { rules: UsageRule[]; warning: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <Hash className="w-4 h-4 text-amber-400" />
        Where to Use Each Grade
      </h3>
      <div className="space-y-2">
        {rules.map((rule, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
          >
            <div className="text-sm font-medium text-white">{rule.area}</div>
            <div className="text-xs text-amber-400 mt-0.5 font-mono">{rule.recommendedGrade}</div>
            <div className="text-xs text-surface-500 mt-1">{rule.note}</div>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 p-3 rounded-xl warning-banner flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
        <p className="text-xs text-red-300/90">{warning}</p>
      </div>
    </div>
  );
}

// ─── Thickness Guide (standalone) ───

function ThicknessGuide({ thicknesses }: { thicknesses: ThicknessEntry[] }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-bold text-white mb-4">Plywood Thickness Guide</h3>
      {/* Mobile: horizontal scroll strip */}
      <div className="flex sm:hidden gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {thicknesses.map((t) => (
          <div
            key={t.thickness}
            className={`shrink-0 w-36 p-3 rounded-xl border ${
              t.structural ? "border-amber-800/40 bg-amber-900/15" : "border-white/[0.06] bg-white/[0.03]"
            }`}
          >
            <div className={`text-sm font-bold font-mono ${t.structural ? "text-amber-400" : "text-white"}`}>
              {t.thickness}
            </div>
            <div className="text-[10px] text-surface-500 mt-1">
              {t.applications.slice(0, 2).join(" · ")}
            </div>
            <div className="text-[10px] font-mono text-surface-600 mt-1">{t.loadRating}</div>
          </div>
        ))}
      </div>
      {/* Desktop: vertical list */}
      <div className="hidden sm:block space-y-1">
        {thicknesses.map((t, i) => (
          <motion.div
            key={t.thickness}
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              t.structural ? "border-amber-800/40 bg-amber-900/15" : "border-white/[0.06] bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold font-mono ${t.structural ? "text-amber-400" : "text-white"}`}>
                {t.thickness}
              </span>
              <span className="text-xs text-surface-500">
                {t.applications.slice(0, 2).join(" · ")}
                {t.applications.length > 2 && <span className="text-surface-600"> · +{t.applications.length - 2}</span>}
              </span>
            </div>
            <span className="text-[10px] font-mono text-surface-600">{t.loadRating}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───

export default function MaterialsPage() {
  return (
    <div style={{ backgroundColor: "#0A0A0C" }} className="min-h-screen pb-24">
      {/* Hero */}
      <section className="relative border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-surface-500">Core Materials</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              The Inside Strength
            </h1>
            <p className="mt-4 text-base sm:text-lg text-surface-400 max-w-2xl leading-relaxed">
              {plywoodGrades.summary}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="glass rounded-2xl p-5 sm:p-6">
          <p className="text-sm text-surface-300 leading-relaxed">{plywoodGrades.overview.definition}</p>
          <ul className="mt-3 space-y-1">
            {plywoodGrades.overview.whyCommonlyUsed.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-surface-400">
                <span className="text-amber-500 mt-0.5 shrink-0">→</span>
                {reason}
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 rounded-xl insight-banner">
            <p className="text-sm text-amber-300/90 leading-relaxed">{plywoodGrades.overview.coreGuideline}</p>
          </div>
        </div>
      </section>

      {/* Plywood Grades — capsule grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <h2 className="text-xl font-bold text-white mb-5">Plywood Grades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          {plywoodGrades.grades.map((grade) => (
            <InteractiveDataCapsule
              key={grade.id}
              id={`ply-${grade.id}`}
              category="Plywood"
              title={grade.grade}
              tagline={grade.fullName}
              imageLabel={grade.grade}
              tierLabel={`Tier ${grade.costTier} — ${grade.costLabel}`}
              tags={[
                ...grade.applications.slice(0, 3).map((a) => ({ label: a, variant: "green" as const })),
                ...grade.limitations.slice(0, 1).map((l) => ({ label: l, variant: "red" as const })),
              ]}
              quickAnswerContent={
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {grade.applications.map((a) => (
                      <span key={a} className="tag-green">{a}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {grade.limitations.map((l) => (
                      <span key={l} className="tag-red">{l}</span>
                    ))}
                  </div>
                  <p className="text-sm text-surface-400 leading-relaxed">{grade.description}</p>
                </div>
              }
              specRows={[
                { label: "Grade", value: grade.grade },
                { label: "Full Name", value: grade.fullName },
                { label: "Also Known As", value: grade.alsoKnownAs },
                { label: "Moisture Level", value: grade.moistureLevel },
                ...propertiesToSpecRows(grade.properties),
              ]}
              insightCallout={
                <div className="insight-banner rounded-xl p-3 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-300/90">{grade.takeaway}</p>
                </div>
              }
              whatsappText={`${grade.grade} (${grade.fullName}): ${grade.description}\nBest for: ${grade.applications.slice(0, 3).join(", ")}\nAvoid: ${grade.limitations.slice(0, 2).join(", ")}`}
            />
          ))}
        </div>
      </section>

      {/* Usage Guide — standalone reference table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <UsageGuide rules={plywoodGrades.usageGuide.rules} warning={plywoodGrades.usageGuide.criticalWarning} />
      </section>

      {/* Engineered Boards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <h2 className="text-xl font-bold text-white mb-5">{engineeredBoards.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          {engineeredBoards.boards.map((board) => (
            <InteractiveDataCapsule
              key={board.id}
              id={`brd-${board.id}`}
              category="Engineered Board"
              title={board.name}
              tagline={board.fullName}
              imageLabel={`${board.name} — ${board.bestFor}`}
              tierLabel={`Tier ${board.costTier}`}
              tags={[
                { label: board.bestFor, variant: "amber" as const },
                ...board.applications.slice(0, 2).map((a) => ({ label: a, variant: "green" as const })),
              ]}
              quickAnswerContent={
                <div className="space-y-3">
                  <p className="text-sm text-surface-300 leading-relaxed">{board.definition}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {board.applications.map((a) => (
                      <span key={a} className="tag-green">{a}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {board.limitations.map((l) => (
                      <span key={l} className="tag-red">{l}</span>
                    ))}
                  </div>
                  <p className="text-xs text-surface-500 italic">{board.composition}</p>
                </div>
              }
              specRows={[
                { label: "Type", value: board.type },
                { label: "Composition", value: board.composition },
                { label: "Best For", value: board.bestFor },
                ...propertiesToSpecRows(board.properties),
              ]}
              insightCallout={
                <div className="insight-banner rounded-xl p-3 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-300/90">{board.takeaway}</p>
                </div>
              }
              whatsappText={`${board.name} (${board.fullName}): ${board.definition}\nBest for: ${board.bestFor}\nComposition: ${board.composition}`}
            />
          ))}
        </div>

        {/* Comparison summaries — kept visible */}
        <div className="mt-6 space-y-3">
          {Object.entries(engineeredBoards.comparisonSummary).map(([key, val]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="insight-banner rounded-xl p-4 flex items-start gap-2"
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

      {/* Thickness Guide — standalone */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <ThicknessGuide thicknesses={plywoodThickness.thicknesses} />
        <div className="mt-4 glass rounded-xl p-4">
          <p className="text-sm text-surface-400 leading-relaxed">💡 {plywoodThickness.takeaway}</p>
        </div>
      </section>

      <StickyCtaBar />
    </div>
  );
}
