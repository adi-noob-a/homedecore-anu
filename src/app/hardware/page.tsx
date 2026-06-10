"use client";

import { motion } from "framer-motion";
import {
  Wrench,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Shield,
  AlertOctagon,
} from "lucide-react";
import { AssetPlaceholder } from "@/components/AssetPlaceholder";
import hardwareData from "../../../phase-1-deliverables/data/hardware.json";

// ─── Types ───

interface HardwareSide {
  label: string;
  properties: Record<string, string>;
  bestFor: string[];
  costTier: string;
  recommendation: string;
  media: { card_image?: string; icon?: string };
}

interface WardrobeSide {
  label: string;
  mechanism: string;
  properties: Record<string, string | string[]>;
  bestFor: string[];
  criticalCondition: string;
  costTier: string;
  verdict: string;
  media: { card_image?: string; icon?: string; diagram?: string };
}

interface FullHeightSystem {
  label: string;
  description: string;
  properties: Record<string, string>;
  costLevel: string;
  media: { card_image?: string; icon?: string; diagram?: string };
}

interface BudgetGuide {
  budgetLevel: string;
  recommendation: string;
}

type HardwareModule = {
  module: string;
  sections: {
    accessories: {
      title: string;
      summary: string;
      disclaimer: string;
      comparison: {
        german: HardwareSide;
        indian: HardwareSide;
      };
      takeaway: string;
    };
    wardrobeSystems: {
      title: string;
      summary: string;
      comparison: {
        sliding: WardrobeSide;
        swing: WardrobeSide;
      };
      takeaway: string;
    };
    fullHeightSystems: {
      title: string;
      summary: string;
      definition: string;
      systems: {
        advanced: FullHeightSystem;
        standard: FullHeightSystem;
      };
      budgetGuidance: BudgetGuide[];
      takeaway: string;
    };
  };
};

const data = hardwareData as unknown as HardwareModule;
const { accessories, wardrobeSystems, fullHeightSystems } = data.sections;

// ─── Dual Column ───

function DualColumn({
  left,
  right,
  leftTitle,
  rightTitle,
  leftAccent = "border-brand-700/50",
  rightAccent = "border-amber-700/50",
}: {
  left: Record<string, string>[];
  right: Record<string, string>[];
  leftTitle: string;
  rightTitle: string;
  leftAccent?: string;
  rightAccent?: string;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={`rounded-2xl border ${leftAccent} bg-zinc-900/60 backdrop-blur-sm p-5`}
      >
        <h3 className="text-sm font-bold text-zinc-100 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-400" />
          {leftTitle}
        </h3>
        <div className="space-y-2">
          {left.map((item) => {
            const [key, val] = Object.entries(item)[0];
            return (
              <div key={key} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-zinc-300">{key}:</span>
                  <span className="text-xs text-zinc-500 ml-1">{val}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 15 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={`rounded-2xl border ${rightAccent} bg-zinc-900/60 backdrop-blur-sm p-5`}
      >
        <h3 className="text-sm font-bold text-zinc-100 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          {rightTitle}
        </h3>
        <div className="space-y-2">
          {right.map((item) => {
            const [key, val] = Object.entries(item)[0];
            return (
              <div key={key} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-zinc-300">{key}:</span>
                  <span className="text-xs text-zinc-500 ml-1">{val}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ───

export default function HardwarePage() {
  const germanProps = Object.entries(accessories.comparison.german.properties).map(([k, v]) => ({ [k]: v }));
  const indianProps = Object.entries(accessories.comparison.indian.properties).map(([k, v]) => ({ [k]: v }));
  const slidingEntries = Object.entries(wardrobeSystems.comparison.sliding.properties);
  const slidingProps = slidingEntries.filter(([k]) => k !== "riskFactors").map(([k, v]) => ({ [k]: String(v) }));
  const swingEntries = Object.entries(wardrobeSystems.comparison.swing.properties);
  const swingProps = swingEntries.filter(([k]) => k !== "riskFactors").map(([k, v]) => ({ [k]: String(v) }));
  const slidingRiskFactors = slidingEntries.find(([k]) => k === "riskFactors");
  const slidingRisks: string[] = slidingRiskFactors ? (slidingRiskFactors[1] as string[]) : [];
  const swingRiskFactors = swingEntries.find(([k]) => k === "riskFactors");
  const swingRisks: string[] = swingRiskFactors ? (swingRiskFactors[1] as string[]) : [];
  const advancedProps = Object.entries(fullHeightSystems.systems.advanced.properties).map(([k, v]) => ({ [k]: v }));
  const standardProps = Object.entries(fullHeightSystems.systems.standard.properties).map(([k, v]) => ({ [k]: v }));

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
              <Settings className="w-5 h-5 text-brand-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Hardware & Accessories</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
              The Moving Parts
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
              {accessories.summary}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: German vs Indian */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <span className="text-xs font-mono text-brand-500 uppercase tracking-widest">Structural Comparison</span>
          <h2 className="text-2xl font-bold text-zinc-100 mt-1 mb-2">{accessories.title}</h2>
          <p className="text-sm text-zinc-500">{accessories.disclaimer}</p>
        </div>

        <DualColumn
          left={germanProps}
          right={indianProps}
          leftTitle={accessories.comparison.german.label}
          rightTitle={accessories.comparison.indian.label}
          leftAccent="border-brand-800/40"
          rightAccent="border-amber-800/40"
        />

        {/* Best For Columns */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-4 rounded-xl border border-brand-900/30 bg-brand-900/15"
          >
            <h4 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2">Best For</h4>
            <ul className="space-y-1">
              {accessories.comparison.german.bestFor.map((item) => (
                <li key={item} className="text-xs text-zinc-400 flex items-start gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-500 mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-zinc-500 mt-3 italic">{accessories.comparison.german.recommendation}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-4 rounded-xl border border-amber-900/30 bg-amber-900/15"
          >
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Best For</h4>
            <ul className="space-y-1">
              {accessories.comparison.indian.bestFor.map((item) => (
                <li key={item} className="text-xs text-zinc-400 flex items-start gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-zinc-500 mt-3 italic">{accessories.comparison.indian.recommendation}</p>
          </motion.div>
        </div>

        {/* Takeaway */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800"
        >
          <p className="text-sm text-zinc-400 leading-relaxed">💡 {accessories.takeaway}</p>
        </motion.div>
      </section>

      {/* Section: Sliding vs Swing */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">{wardrobeSystems.title}</h2>
          <p className="text-sm text-zinc-500">{wardrobeSystems.summary}</p>
        </div>

        <DualColumn
          left={slidingProps}
          right={swingProps}
          leftTitle={wardrobeSystems.comparison.sliding.label}
          rightTitle={wardrobeSystems.comparison.swing.label}
        />

        {/* Risk Factors */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-xl border border-red-900/30 bg-red-900/15">
            <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Risk Factors — Sliding
            </h4>
            <ul className="space-y-1">
              {slidingRisks.map((f) => (
                <li key={f} className="text-xs text-zinc-400 flex items-start gap-1.5">
                  <span className="text-red-400">⚠</span> {f}
                </li>
              ))}
            </ul>
            <div className="mt-3 p-2 rounded-lg bg-red-900/30">
              <p className="text-xs text-red-300">{wardrobeSystems.comparison.sliding.criticalCondition}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-green-900/30 bg-green-900/15">
            <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Swing Advantages</h4>
            <ul className="space-y-1">
              {swingRisks.map((f) => (
                <li key={f} className="text-xs text-zinc-400 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-3 p-2 rounded-lg bg-green-900/30">
              <p className="text-xs text-green-300">{wardrobeSystems.comparison.swing.criticalCondition}</p>
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center">
            <p className="text-xs text-zinc-400 italic">{wardrobeSystems.comparison.sliding.verdict}</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center">
            <p className="text-xs text-zinc-400 italic">{wardrobeSystems.comparison.swing.verdict}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800"
        >
          <p className="text-sm text-zinc-400 leading-relaxed">💡 {wardrobeSystems.takeaway}</p>
        </motion.div>
      </section>

      {/* Section: Full-Height Systems */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">{fullHeightSystems.title}</h2>
          <p className="text-sm text-zinc-500">{fullHeightSystems.summary}</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 mb-6">
          <p className="text-sm text-zinc-400 leading-relaxed">{fullHeightSystems.definition}</p>
        </div>

        <DualColumn
          left={advancedProps}
          right={standardProps}
          leftTitle={fullHeightSystems.systems.advanced.label}
          rightTitle={fullHeightSystems.systems.standard.label}
        />

        {/* Cost labels */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="p-3 rounded-xl bg-brand-900/20 border border-brand-800/30 text-center">
            <p className="text-xs text-brand-400 font-mono">{fullHeightSystems.systems.advanced.costLevel}</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center">
            <p className="text-xs text-zinc-400 font-mono">{fullHeightSystems.systems.standard.costLevel}</p>
          </div>
        </div>

        {/* Budget Guidance */}
        <div className="mt-6 p-4 rounded-xl border border-amber-800/30 bg-amber-900/20">
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">Budget Guidance</h4>
          <div className="space-y-2">
            {fullHeightSystems.budgetGuidance.map((g) => (
              <div key={g.budgetLevel} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  g.budgetLevel === "low" ? "bg-red-500" : g.budgetLevel === "mid" ? "bg-amber-500" : "bg-green-500"
                }`} />
                <div>
                  <span className="text-xs font-semibold text-zinc-300 capitalize">{g.budgetLevel} budget:</span>
                  <span className="text-xs text-zinc-500 ml-1">{g.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Warning Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-8 p-5 rounded-2xl border border-red-800/40 bg-gradient-to-r from-red-950/40 to-red-900/20"
        >
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-red-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-red-300 mb-1">⚠ Weight Warning</h3>
              <p className="text-xs text-red-300/80 leading-relaxed">
                Combining heavy shutters (PU, Lacquered Glass) with sliding systems and budget Indian hardware 
                creates excessive structural load on tracks. This can cause permanent track deformation, door 
                sagging, and system failure within 1-2 years. Use our{" "}
                <a href="/" className="text-brand-400 underline hover:text-brand-300 transition-colors">
                  Budget Calculator
                </a>{" "}
                to check your configuration before finalizing.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final Takeaway */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800"
        >
          <p className="text-sm text-zinc-400 leading-relaxed">💡 {fullHeightSystems.takeaway}</p>
        </motion.div>
      </section>
    </div>
  );
}
