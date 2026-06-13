"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { BudgetWizard } from "@/components/BudgetWizard";
import { AssetPlaceholder } from "@/components/AssetPlaceholder";
import { ArrowRight, Sparkles, Layers, Palette, Settings, ChevronDown } from "lucide-react";

// ─── Text stagger animation ───

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ─── 3D Tilt Card ───

function TiltCard({
  href,
  icon: Icon,
  title,
  description,
  gradient,
  imageLabel,
  index,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  imageLabel: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / 20);
    setRotateY((centerX - x) / 20);
    setGlowX((x / rect.width) * 100);
    setGlowY((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlowX(50);
    setGlowY(50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 200, damping: 25 }}
      className="perspective-1000"
    >
      <Link href={href}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative preserve-3d group card-hover"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at ${glowX}% ${glowY}%, rgba(99,102,241,0.15), transparent 40%)`,
            }}
          />

          <div className="relative rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] overflow-hidden transition-all duration-300 group-hover:border-white/[0.10] p-6">
            {/* Gradient header */}
            <div className={`h-2 -mx-6 -mt-6 mb-5 ${gradient}`} />

            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center">
                <Icon className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex items-center gap-1 text-xs text-indigo-400/60 group-hover:text-indigo-400 transition-colors">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">{description}</p>

            <AssetPlaceholder label={imageLabel} aspectRatio="16:9" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Hero Section ───

function HeroSection() {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);

  return (
    <motion.section
      style={{ scale: heroScale, opacity: heroOpacity }}
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              Premium Interior Toolkit
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.9]"
          >
            <span className="text-white">Design Without</span>
            <br />
            <span className="text-gradient">Guesswork</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed"
          >
            Real material costs, premium finish comparisons, and hardware engineering — 
            built for Indian homeowners who refuse to compromise.
          </motion.p>

          {/* CTA */}
          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#calculator"
              className="btn-premium inline-flex items-center gap-2 text-base px-8 py-4"
            >
              Start Your Estimate
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/materials"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-white/[0.08] text-white/70 hover:text-white hover:border-white/[0.15] transition-all text-sm font-medium"
            >
              Explore Materials
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero video placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <AssetPlaceholder
            label="HERO VIDEO LOOP: 4K Modern Interior"
            aspectRatio="16:9"
            className="rounded-2xl shadow-2xl shadow-indigo-500/5"
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/20 font-mono">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-4 h-4 text-white/20" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// ─── Value Teasers Section ───

function ValueTeasers() {
  const teasers = [
    {
      href: "/materials",
      icon: Layers,
      title: "Core Materials",
      description: "From BWP plywood to HDHMR — understand what goes inside your furniture before you pay for it.",
      gradient: "bg-gradient-to-r from-indigo-500/20 to-indigo-500/5",
      imageLabel: "MATERIAL: Plywood Cross-Section Close-up",
    },
    {
      href: "/finishes",
      icon: Palette,
      title: "Surface Finishes",
      description: "Laminate, acrylic, PU, lacquered glass — compare cost tiers, durability, and the perfect look for every room.",
      gradient: "bg-gradient-to-r from-[#FF7E67]/20 to-[#FF7E67]/5",
      imageLabel: "FINISH: Laminate vs Acrylic Shine Demo",
    },
    {
      href: "/hardware",
      icon: Settings,
      title: "Hardware Guide",
      description: "German vs Indian, sliding vs swing, full-height systems — the moving parts that determine how long your furniture lasts.",
      gradient: "bg-gradient-to-r from-indigo-500/20 to-coral-500/10",
      imageLabel: "HARDWARE: Sliding Mechanism Close-up",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Knowledge Is Power</span>
        <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3 mb-4">
          Everything You Need to Know
        </h2>
        <p className="text-[#94A3B8] max-w-xl mx-auto text-sm sm:text-base">
          Three comprehensive guides — each one built from real Indian interior industry expertise.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {teasers.map((t, i) => (
          <TiltCard key={t.href} {...t} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─── Calculator Section ───

function CalculatorSection() {
  // Use any for ref since framer-motion types are tricky with useInView
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section id="calculator" ref={sectionRef} className="relative">
      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/[0.05]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="py-20 sm:py-28"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-brand-subtle border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Unlock Your Budget
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Your Interior, Priced Instantly
          </h2>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed">
            Enter your property details and preferences. Our engine calculates real-time costs 
            based on curated industry data — not guesswork.
          </p>
        </div>

        {/* The calculator itself — now wrapped in glass */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] p-1">
            <div className="rounded-2xl bg-[#0A0A14] overflow-hidden">
              <BudgetWizard />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Main Page ───

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ValueTeasers />
      <CalculatorSection />
    </main>
  );
}
