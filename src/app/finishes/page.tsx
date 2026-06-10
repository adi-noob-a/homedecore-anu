"use client";

import { motion } from "framer-motion";
import {
  Palette,
  Layers,
  CheckCircle2,
  Lightbulb,
  ArrowUp,
  Star,
  Sparkles,
} from "lucide-react";
import { AssetPlaceholder } from "@/components/AssetPlaceholder";
import finishesData from "../../../phase-1-deliverables/data/finishes.json";

// ─── Types ───

interface FinishDetail {
  id: string;
  name: string;
  type: string;
  definition: string;
  simpleExplanation: string;
  properties: Record<string, string>;
  applications: string[];
  limitations: string[];
  costTier: number;
  costLabel: string;
  takeaway: string;
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
  rank: number;
  finish: string;
  id: string;
  costTier: number;
  parityWith?: string[];
  media?: { icon?: string; card_image?: string };
}

type FinishesModule = {
  module: string;
  sections: {
    sheetFinishes: {
      title: string;
      summary: string;
      finishes: FinishDetail[];
    };
    paintFinishes: {
      title: string;
      summary: string;
      finishes: FinishDetail[];
    };
    specialtyFinishes: {
      title: string;
      summary: string;
      finishes: FinishDetail[];
    };
    costHierarchy: {
      title: string;
      description: string;
      hierarchyString: string;
      note: string;
      order: CostTier[];
    };
  };
};

const data = finishesData as unknown as FinishesModule;
const { sheetFinishes, paintFinishes, specialtyFinishes, costHierarchy } = data.sections;

// ─── Cost Ladder ───

function CostLadder({ tiers }: { tiers: CostTier[] }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-1">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.02 }}
            className="group relative flex-1 w-full"
          >
            <motion.div
              className="relative p-3 sm:p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm text-center cursor-default transition-all group-hover:border-brand-700/50 group-hover:bg-zinc-900/80 group-hover:scale-[1.04]"
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {/* Tier number */}
              <div className="text-[10px] font-mono text-zinc-600 mb-1">Tier {tier.rank}</div>
              {/* Cost tier indicator */}
              <div className="flex justify-center gap-0.5 mb-1.5">
                {Array.from({ length: tier.costTier }).map((_, j) => (
                  <motion.div
                    key={j}
                    className="w-2 h-2 rounded-full bg-brand-500/60"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: i * 0.08 + j * 0.03 }}
                  />
                ))}
              </div>
              <h3 className="text-sm font-bold text-zinc-100">{tier.finish}</h3>
              {tier.parityWith && tier.parityWith.length > 0 && (
                <div className="text-[9px] text-zinc-600 mt-0.5 font-mono">
                  ≈ {tier.parityWith.join(", ")}
                </div>
              )}
            </motion.div>

            {/* Connecting arrow */}
            {i < tiers.length - 1 && (
              <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <ArrowUp className="w-5 h-5 text-zinc-700 rotate-90" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Formula string */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-6 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center"
      >
        <span className="text-sm font-mono text-zinc-500">
          {costHierarchy.hierarchyString}
        </span>
        <p className="text-xs text-zinc-600 mt-1">{costHierarchy.note}</p>
      </motion.div>
    </div>
  );
}

// ─── Finish Detail Card ───

function FinishCard({ finish, index }: { finish: FinishDetail; index: number }) {
  const hasSubtypes = finish.types && finish.types.length > 0;
  const hasMatteVsGlossy = !!finish.matteVsGlossy;
  const hasAcrylicVsLaminate = !!finish.acrylicVsLaminate;
  const hasDucoVsPu = !!finish.ducoVsPu;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 25 }}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-5 sm:p-6 hover:border-zinc-700 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand-400 uppercase">Tier {finish.costTier}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{finish.type}</span>
            <span className="text-xs text-zinc-600">{finish.costLabel}</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-100">{finish.name}</h3>
          <p className="text-xs text-zinc-500 mt-1">{finish.simpleExplanation}</p>
        </div>
        <AssetPlaceholder label={finish.name} aspectRatio="1:1" className="w-16 h-16 shrink-0 rounded-xl" />
      </div>

      {/* Properties */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {Object.entries(finish.properties).slice(0, 6).map(([key, val]) => (
          <div key={key} className="p-2 rounded-lg bg-zinc-800/40">
            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </div>
            <div className="text-[11px] text-zinc-300 mt-0.5 line-clamp-2">{val}</div>
          </div>
        ))}
      </div>

      {/* Subtypes Grid */}
      {hasSubtypes && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Variants</h4>
          <div className="grid grid-cols-2 gap-1.5">
            {finish.types!.slice(0, 4).map((t) => (
              <div key={t.name} className="p-2 rounded-lg bg-zinc-800/30">
                <div className="text-xs font-medium text-zinc-200">{t.name}</div>
                <div className="text-[10px] text-zinc-500 line-clamp-1">{t.description}</div>
                <div className="text-[9px] text-brand-500/80 mt-0.5">{t.bestFor}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matte vs Glossy */}
      {hasMatteVsGlossy && (
        <div className="mb-4 p-3 rounded-xl bg-zinc-800/40">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Matte vs Glossy</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded-lg bg-zinc-900/60">
              <div className="text-xs font-semibold text-zinc-300">Matte</div>
              <p className="text-[10px] text-zinc-500 mt-1">{finish.matteVsGlossy!.matte.description}</p>
              <p className="text-[9px] text-brand-500/80 mt-1">👍 {finish.matteVsGlossy!.matte.recommendation}</p>
            </div>
            <div className="p-2 rounded-lg bg-zinc-900/60">
              <div className="text-xs font-semibold text-zinc-300">Glossy</div>
              <p className="text-[10px] text-zinc-500 mt-1">{finish.matteVsGlossy!.glossy.description}</p>
              <p className="text-[9px] text-brand-500/80 mt-1">✨ {finish.matteVsGlossy!.glossy.recommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Acrylic vs Laminate */}
      {hasAcrylicVsLaminate && (
        <div className="mb-4 p-3 rounded-xl bg-zinc-800/40">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">vs Laminate</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-brand-400 mb-1">Acrylic Advantages</div>
              <ul className="space-y-0.5">
                {finish.acrylicVsLaminate!.acrylicAdvantages.slice(0, 3).map((adv) => (
                  <li key={adv} className="text-[10px] text-zinc-400 flex items-start gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-brand-500 mt-0.5 shrink-0" /> {adv}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-400 mb-1">Laminate Advantages</div>
              <ul className="space-y-0.5">
                {finish.acrylicVsLaminate!.laminateAdvantages.slice(0, 3).map((adv) => (
                  <li key={adv} className="text-[10px] text-zinc-400 flex items-start gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-zinc-500 mt-0.5 shrink-0" /> {adv}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* DUCO vs PU */}
      {hasDucoVsPu && (
        <div className="mb-4 p-3 rounded-xl bg-zinc-800/40">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">DUCO vs PU</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-zinc-400 mb-1">DUCO</div>
              <ul className="space-y-0.5">
                {finish.ducoVsPu!.ducoAdvantages.map((adv) => (
                  <li key={adv} className="text-[10px] text-zinc-400">• {adv}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-brand-400 mb-1">PU</div>
              <ul className="space-y-0.5">
                {finish.ducoVsPu!.puAdvantages.map((adv) => (
                  <li key={adv} className="text-[10px] text-zinc-400">• {adv}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Takeaway */}
      <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-800/30 flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-300/90 leading-relaxed">{finish.takeaway}</p>
      </div>
    </motion.div>
  );
}

// ─── Section Renderer ───

function FinishSection({
  title,
  summary,
  finishes,
  index,
}: {
  title: string;
  summary: string;
  finishes: FinishDetail[];
  index: number;
}) {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">{title}</h2>
        <p className="text-sm text-zinc-500">{summary}</p>
      </div>
      <div className="space-y-6">
        {finishes.map((finish, i) => (
          <FinishCard key={finish.id} finish={finish} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─── Main Page ───

export default function FinishesPage() {
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
              <Palette className="w-5 h-5 text-brand-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Surface Finishes</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
              The Outer Look
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
              From budget-friendly laminates to ultra-premium PU finishes — choose the surface that matches your style, durability needs, and budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: Interactive Cost Ladder */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/30 border border-brand-800/40 text-brand-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Cost Ladder
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">{costHierarchy.title}</h2>
          <p className="text-sm text-zinc-500">{costHierarchy.description}</p>
        </div>
        <CostLadder tiers={costHierarchy.order} />
      </section>

      {/* Sheet Finishes */}
      <FinishSection
        title={sheetFinishes.title}
        summary={sheetFinishes.summary}
        finishes={sheetFinishes.finishes}
        index={0}
      />

      {/* Paint Finishes */}
      <FinishSection
        title={paintFinishes.title}
        summary={paintFinishes.summary}
        finishes={paintFinishes.finishes}
        index={1}
      />

      {/* Specialty Finishes */}
      <FinishSection
        title={specialtyFinishes.title}
        summary={specialtyFinishes.summary}
        finishes={specialtyFinishes.finishes}
        index={2}
      />
    </div>
  );
}
