"use client";

import { motion } from "framer-motion";
import { Settings, Shield, CheckCircle2, AlertTriangle, Lightbulb, AlertOctagon, Award, Wrench, Star } from "lucide-react";
import { CinematicDataCard } from "@/components/CinematicDataCard";
import { StickyCtaBar } from "@/components/StickyCtaBar";
import hardwareData from "../../../phase-1-deliverables/data/hardware.json";

// ─── Types ───

interface HardwareSide {
  label: string; properties: Record<string, string>; bestFor: string[];
  costTier: string; recommendation: string; media: { card_image?: string; icon?: string };
}

interface WardrobeSide {
  label: string; mechanism: string;
  properties: Record<string, string | string[]>; bestFor: string[];
  criticalCondition: string; costTier: string; verdict: string;
  media: { card_image?: string; icon?: string; diagram?: string };
}

interface FullHeightSystem {
  label: string; description: string; properties: Record<string, string>;
  costLevel: string; media: { card_image?: string; icon?: string; diagram?: string };
}

interface BudgetGuide { budgetLevel: string; recommendation: string; }

type HardwareModule = {
  module: string;
  sections: {
    accessories: {
      title: string; summary: string; disclaimer: string;
      comparison: { german: HardwareSide; indian: HardwareSide };
      takeaway: string;
    };
    wardrobeSystems: {
      title: string; summary: string;
      comparison: { sliding: WardrobeSide; swing: WardrobeSide };
      takeaway: string;
    };
    fullHeightSystems: {
      title: string; summary: string; definition: string;
      systems: { advanced: FullHeightSystem; standard: FullHeightSystem };
      budgetGuidance: BudgetGuide[]; takeaway: string;
    };
  };
};

const data = hardwareData as unknown as HardwareModule;
const { accessories, wardrobeSystems, fullHeightSystems } = data.sections;

function propertiesToSpecRows(props: Record<string, string>): { label: string; value: string }[] {
  return Object.entries(props).map(([k, v]) => ({
    label: k.replace(/([A-Z])/g, " $1").trim(),
    value: v,
  }));
}

// ─── Data adapters ───

function germanToCardData(): Parameters<typeof CinematicDataCard>[0]["data"] {
  const g = accessories.comparison.german;
  return {
    id: "hw-german",
    title: g.label,
    shortSummary: g.recommendation,
    badgeText: "Premium",
    tierLabel: g.costTier,
    category: "Hardware",
    imageLabel: "German Hardware",
    pros: g.bestFor,
    technicalSpecs: propertiesToSpecRows(g.properties),
    whatsappText: `${g.label}: ${g.recommendation}\nBest for: ${g.bestFor.join(", ")}`,
  };
}

function indianToCardData(): Parameters<typeof CinematicDataCard>[0]["data"] {
  const i = accessories.comparison.indian;
  return {
    id: "hw-indian",
    title: i.label,
    shortSummary: i.recommendation,
    badgeText: "Budget",
    tierLabel: i.costTier,
    category: "Hardware",
    imageLabel: "Indian Hardware",
    pros: i.bestFor,
    technicalSpecs: propertiesToSpecRows(i.properties),
    whatsappText: `${i.label}: ${i.recommendation}\nBest for: ${i.bestFor.join(", ")}`,
  };
}

function slidingToCardData(): Parameters<typeof CinematicDataCard>[0]["data"] {
  const s = wardrobeSystems.comparison.sliding;
  const entries = Object.entries(s.properties);
  const riskArr = entries.find(([k]) => k === "riskFactors");
  const risks: string[] = riskArr ? (riskArr[1] as string[]) : [];
  const safe = entries.filter(([k]) => k !== "riskFactors");

  return {
    id: "hw-sliding",
    title: s.label,
    shortSummary: s.verdict,
    badgeText: "⚠ High Hardware Dependency",
    tierLabel: s.costTier,
    category: "Wardrobe",
    imageLabel: "Sliding Wardrobe",
    cons: risks,
    pros: s.bestFor,
    technicalSpecs: [
      { label: "Mechanism", value: s.mechanism },
      ...safe.map(([k, v]) => ({ label: k.replace(/([A-Z])/g, " $1").trim(), value: String(v) })),
      { label: "Critical Condition", value: s.criticalCondition },
    ],
    insightText: s.criticalCondition,
  };
}

function swingToCardData(): Parameters<typeof CinematicDataCard>[0]["data"] {
  const s = wardrobeSystems.comparison.swing;
  const entries = Object.entries(s.properties);
  const riskArr = entries.find(([k]) => k === "riskFactors");
  const risks: string[] = riskArr ? (riskArr[1] as string[]) : [];
  const safe = entries.filter(([k]) => k !== "riskFactors");

  return {
    id: "hw-swing",
    title: s.label,
    shortSummary: s.verdict,
    badgeText: "✅ Recommended",
    tierLabel: s.costTier,
    category: "Wardrobe",
    imageLabel: "Swing Wardrobe",
    pros: [...s.bestFor, ...risks],
    technicalSpecs: [
      { label: "Mechanism", value: s.mechanism },
      ...safe.map(([k, v]) => ({ label: k.replace(/([A-Z])/g, " $1").trim(), value: String(v) })),
      { label: "Condition", value: s.criticalCondition },
    ],
    insightText: s.criticalCondition,
  };
}

function advancedToCardData(): Parameters<typeof CinematicDataCard>[0]["data"] {
  const adv = fullHeightSystems.systems.advanced;
  return {
    id: "hw-advanced",
    title: adv.label,
    shortSummary: adv.description,
    badgeText: "Premium",
    tierLabel: adv.costLevel,
    category: "Full-Height System",
    imageLabel: "Advanced Full-Height",
    technicalSpecs: propertiesToSpecRows(adv.properties),
  };
}

function standardToCardData(): Parameters<typeof CinematicDataCard>[0]["data"] {
  const std = fullHeightSystems.systems.standard;
  return {
    id: "hw-standard",
    title: std.label,
    shortSummary: std.description,
    badgeText: "Economical",
    tierLabel: std.costLevel,
    category: "Full-Height System",
    imageLabel: "Standard Full-Height",
    technicalSpecs: propertiesToSpecRows(std.properties),
  };
}

// ─── Staggered animation variants ───

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ─── Trust Badge ───

function TrustBadge({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <motion.div
      variants={staggerItem}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]"
    >
      <Icon className="w-4 h-4 text-amber-400 shrink-0" />
      <span className="text-xs text-surface-300 font-medium">{text}</span>
    </motion.div>
  );
}

// ─── Main Page ───

export default function HardwarePage() {
  return (
    <div style={{ backgroundColor: "#0A0A0C" }} className="min-h-screen pb-24">
      {/* ─── Hero Section ─── */}
      <section className="relative border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-surface-400">Hardware & Accessories</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-display">
              Premium Architectural Hardware<br />
              <span className="text-gradient">Engineered for Elegant Living</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-surface-400 max-w-2xl leading-relaxed">
              {accessories.summary}
            </p>
          </motion.div>

          {/* Trust Badges — staggered */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-3 mt-8"
          >
            <TrustBadge icon={Award} text="10-Year Warranty" />
            <TrustBadge icon={Wrench} text="Solid Brass Construction" />
            <TrustBadge icon={Star} text="Precision Engineered" />
            <TrustBadge icon={Shield} text="Load-Tested Systems" />
          </motion.div>
        </div>
      </section>

      {/* ─── Section: German vs Indian ─── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
      >
        <motion.div variants={staggerItem}>
          <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">Structural Comparison</span>
          <h2 className="text-xl font-bold text-white mt-1 mb-2">{accessories.title}</h2>
          <p className="text-sm text-surface-500 mb-5">{accessories.disclaimer}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <motion.div variants={staggerItem}>
            <CinematicDataCard data={germanToCardData()} />
          </motion.div>
          <motion.div variants={staggerItem}>
            <CinematicDataCard data={indianToCardData()} />
          </motion.div>
        </div>

        <motion.div variants={staggerItem} className="mt-6 glass rounded-xl p-4">
          <p className="text-sm text-surface-400 leading-relaxed">💡 {accessories.takeaway}</p>
        </motion.div>
      </motion.section>

      {/* ─── Section: Sliding vs Swing ─── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
      >
        <motion.div variants={staggerItem}>
          <h2 className="text-xl font-bold text-white mb-2">{wardrobeSystems.title}</h2>
          <p className="text-sm text-surface-500 mb-5">{wardrobeSystems.summary}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          {/* Sliding — warning callout passed via children */}
          <motion.div variants={staggerItem}>
            <CinematicDataCard data={slidingToCardData()}>
              <div className="warning-banner rounded-xl p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-red-300/90">{wardrobeSystems.comparison.sliding.criticalCondition}</p>
              </div>
            </CinematicDataCard>
          </motion.div>

          {/* Swing */}
          <motion.div variants={staggerItem}>
            <CinematicDataCard data={swingToCardData()} />
          </motion.div>
        </div>

        <motion.div variants={staggerItem} className="mt-6 glass rounded-xl p-4">
          <p className="text-sm text-surface-400 leading-relaxed">💡 {wardrobeSystems.takeaway}</p>
        </motion.div>
      </motion.section>

      {/* ─── Section: Full-Height Systems ─── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
      >
        <motion.div variants={staggerItem}>
          <h2 className="text-xl font-bold text-white mb-2">{fullHeightSystems.title}</h2>
          <p className="text-sm text-surface-500 mb-5">{fullHeightSystems.summary}</p>
        </motion.div>

        <motion.div variants={staggerItem} className="glass rounded-xl p-4 mb-6">
          <p className="text-sm text-surface-300 leading-relaxed">{fullHeightSystems.definition}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <motion.div variants={staggerItem}>
            <CinematicDataCard data={advancedToCardData()} />
          </motion.div>
          <motion.div variants={staggerItem}>
            <CinematicDataCard data={standardToCardData()} />
          </motion.div>
        </div>

        {/* Budget Guidance */}
        <motion.div variants={staggerItem} className="mt-6 insight-banner rounded-xl p-4">
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">Budget Guidance</h4>
          <div className="space-y-2">
            {fullHeightSystems.budgetGuidance.map((g) => (
              <div key={g.budgetLevel} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  g.budgetLevel === "low" ? "bg-red-500" : g.budgetLevel === "mid" ? "bg-amber-500" : "bg-green-500"
                }`} />
                <div>
                  <span className="text-xs font-semibold text-white capitalize">{g.budgetLevel} budget:</span>
                  <span className="text-xs text-surface-400 ml-1">{g.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Safety Warning — always visible, distinct card */}
        <motion.div variants={staggerItem} className="mt-8 p-5 rounded-2xl warning-banner border-red-800/40">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-red-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-red-300 mb-1">⚠ Weight Warning</h3>
              <p className="text-xs text-red-300/80 leading-relaxed">
                Combining heavy shutters (PU, Lacquered Glass) with sliding systems and budget Indian hardware
                creates excessive structural load on tracks. This can cause permanent track deformation, door
                sagging, and system failure within 1-2 years. Use our{" "}
                <a href="/#calculator" className="text-amber-400 underline hover:text-amber-300 transition-colors">
                  Budget Calculator
                </a>{" "}
                to check your configuration before finalizing.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="mt-6 glass rounded-xl p-4">
          <p className="text-sm text-surface-400 leading-relaxed">💡 {fullHeightSystems.takeaway}</p>
        </motion.div>
      </motion.section>

      <StickyCtaBar />
    </div>
  );
}
