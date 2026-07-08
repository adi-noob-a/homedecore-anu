"use client";

import { motion } from "framer-motion";
import { Palette, Sparkles, Lightbulb, ArrowRight } from "lucide-react";
import { CinematicDataCard } from "@/components/CinematicDataCard";
import { StickyCtaBar } from "@/components/StickyCtaBar";
import finishesData from "../../../phase-1-deliverables/data/finishes.json";

// ─── Types ───

interface FinishDetail {
  id: string; name: string; type: string;
  definition: string; simpleExplanation: string;
  properties: Record<string, string>; applications: string[]; limitations: string[];
  costTier: number; costLabel: string; takeaway: string;
  media: { card_image?: string; icon?: string; diagram?: string };
  types?: { name: string; description: string; bestFor: string; [key: string]: unknown }[];
  matteVsGlossy?: {
    matte: { description: string; maintenance: string; bestFor: string; recommendation: string };
    glossy: { description: string; maintenance: string; bestFor: string; recommendation: string };
  };
  acrylicVsLaminate?: { acrylicAdvantages: string[]; laminateAdvantages: string[] };
  ducoVsPu?: { ducoAdvantages: string[]; puAdvantages: string[] };
}

interface CostTier {
  rank: number; finish: string; id: string; costTier: number;
  parityWith?: string[]; media?: { icon?: string; card_image?: string };
}

type FinishesModule = {
  module: string;
  sections: {
    sheetFinishes: { title: string; summary: string; finishes: FinishDetail[] };
    paintFinishes: { title: string; summary: string; finishes: FinishDetail[] };
    specialtyFinishes: { title: string; summary: string; finishes: FinishDetail[] };
    costHierarchy: {
      title: string; description: string; hierarchyString: string; note: string; order: CostTier[];
    };
  };
};

const data = finishesData as unknown as FinishesModule;
const { sheetFinishes, paintFinishes, specialtyFinishes, costHierarchy } = data.sections;

function propertiesToSpecRows(props: Record<string, string>): { label: string; value: string }[] {
  return Object.entries(props).map(([k, v]) => ({
    label: k.replace(/([A-Z])/g, " $1").trim(),
    value: v,
  }));
}

/** Build the "quick answer" extras for finishes that have matte-vs-glossy, acrylic-vs-laminate, or duco-vs-pu */
function finishQuickAnswerExtra(finish: FinishDetail): React.ReactNode {
  const hasMatteVsGlossy = !!finish.matteVsGlossy;
  const hasAcrylicVsLaminate = !!finish.acrylicVsLaminate;
  const hasDucoVsPu = !!finish.ducoVsPu;

  if (!hasMatteVsGlossy && !hasAcrylicVsLaminate && !hasDucoVsPu) return undefined;

  return (
    <div className="mt-3 space-y-2">
      {hasMatteVsGlossy && (
        <div className="glass rounded-xl p-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs font-semibold text-white">Matte</span>
              <p className="text-[10px] text-surface-400 mt-1">{finish.matteVsGlossy!.matte.recommendation}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-white">Glossy</span>
              <p className="text-[10px] text-surface-400 mt-1">{finish.matteVsGlossy!.glossy.recommendation}</p>
            </div>
          </div>
        </div>
      )}
      {hasAcrylicVsLaminate && (
        <div className="glass rounded-xl p-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">Acrylic vs Laminate</span>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              {finish.acrylicVsLaminate!.acrylicAdvantages.slice(0, 2).map((a) => (
                <p key={a} className="text-[9px] text-surface-400 flex items-start gap-1 mt-1">
                  <span className="text-amber-500 mt-0.5 shrink-0">+</span>{a}
                </p>
              ))}
            </div>
            <div>
              {finish.acrylicVsLaminate!.laminateAdvantages.slice(0, 2).map((a) => (
                <p key={a} className="text-[9px] text-surface-400 flex items-start gap-1 mt-1">
                  <span className="text-surface-500 mt-0.5 shrink-0">+</span>{a}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
      {hasDucoVsPu && (
        <div className="glass rounded-xl p-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">DUCO vs PU</span>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <span className="text-xs font-semibold text-surface-400">DUCO</span>
              {finish.ducoVsPu!.ducoAdvantages.map((a) => (
                <p key={a} className="text-[9px] text-surface-400 mt-1">• {a}</p>
              ))}
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-400">PU</span>
              {finish.ducoVsPu!.puAdvantages.map((a) => (
                <p key={a} className="text-[9px] text-surface-400 mt-1">• {a}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Convert a finish detail into the universal CinematicCardData shape */
function finishToCardData(finish: FinishDetail): Parameters<typeof CinematicDataCard>[0]["data"] {
  return {
    id: `fin-${finish.id}`,
    title: finish.name,
    shortSummary: finish.simpleExplanation,
    badgeText: finish.costLabel,
    tierLabel: `Tier ${finish.costTier}`,
    category: finish.type,
    imageLabel: finish.name,
    pros: finish.applications,
    cons: finish.limitations,
    technicalSpecs: [
      { label: "Type", value: finish.type },
      { label: "Cost Label", value: finish.costLabel },
      ...propertiesToSpecRows(finish.properties),
    ],
    insightText: finish.takeaway,
    whatsappText: `${finish.name} (${finish.type}): ${finish.definition}\nKey features: ${Object.values(finish.properties).slice(0, 3).join(", ")}`,
  };
}

// ─── Cost Ladder ───

function CostLadder({ tiers }: { tiers: CostTier[] }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-1">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group relative flex-1 w-full"
          >
            <div className="glass rounded-xl p-3 sm:p-4 text-center cursor-default transition-all duration-300 group-hover:scale-[1.04] group-hover:border-amber-500/30">
              <div className="text-[10px] font-mono text-surface-600 mb-1">Tier {tier.rank}</div>
              <div className="flex justify-center gap-0.5 mb-1.5">
                {Array.from({ length: tier.costTier }).map((_, j) => (
                  <div key={j} className="w-2 h-2 rounded-full bg-amber-500/60" />
                ))}
              </div>
              <h3 className="text-sm font-bold text-white">{tier.finish}</h3>
              {tier.parityWith && tier.parityWith.length > 0 && (
                <div className="text-[9px] text-surface-600 mt-0.5 font-mono">≈ {tier.parityWith.join(", ")}</div>
              )}
            </div>
            {i < tiers.length - 1 && (
              <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-5 h-5 text-surface-700" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-6 glass rounded-xl p-4 text-center">
        <span className="text-sm font-mono text-surface-500">{costHierarchy.hierarchyString}</span>
        <p className="text-xs text-surface-600 mt-1">{costHierarchy.note}</p>
      </div>
    </div>
  );
}

// ─── Section Renderer ───

function FinishesGrid({
  title, summary, finishes,
}: {
  title: string; summary: string; finishes: FinishDetail[];
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-sm text-surface-500 mb-5">{summary}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
        {finishes.map((finish) => (
          <CinematicDataCard
            key={finish.id}
            data={finishToCardData(finish)}
          >
            {finishQuickAnswerExtra(finish)}
          </CinematicDataCard>
        ))}
      </div>
    </section>
  );
}

// ─── Main Page ───

export default function FinishesPage() {
  return (
    <div style={{ backgroundColor: "#0A0A0C" }} className="min-h-screen pb-24">
      {/* Hero */}
      <section className="relative border-b border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-surface-500">Surface Finishes</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">The Outer Look</h1>
            <p className="mt-4 text-base sm:text-lg text-surface-400 max-w-2xl leading-relaxed">
              From budget-friendly laminates to ultra-premium PU finishes — choose the surface that matches your style, durability needs, and budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cost Ladder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/30 border border-amber-800/40 text-amber-400 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Finish Cost Hierarchy
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{costHierarchy.title}</h2>
          <p className="text-sm text-surface-500">{costHierarchy.description}</p>
        </div>
        <CostLadder tiers={costHierarchy.order} />
      </section>

      <FinishesGrid title={sheetFinishes.title} summary={sheetFinishes.summary} finishes={sheetFinishes.finishes} />
      <FinishesGrid title={paintFinishes.title} summary={paintFinishes.summary} finishes={paintFinishes.finishes} />
      <FinishesGrid title={specialtyFinishes.title} summary={specialtyFinishes.summary} finishes={specialtyFinishes.finishes} />

      <StickyCtaBar />
    </div>
  );
}
