"use client";

import { useState } from "react";
import { BudgetWizard } from "@/components/BudgetWizard";
import { ComparisonMatrix } from "@/components/ComparisonMatrix";

type ActiveView = "calculator" | "comparisons" | "about";

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>("calculator");

  return (
    <main>
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">ID</span>
            </div>
            <span className="font-semibold text-surface-900 text-sm hidden sm:inline">
              Interior Design Hub
            </span>
          </div>
          <nav className="flex gap-1">
            {[
              { id: "calculator" as ActiveView, label: "Calculator" },
              { id: "comparisons" as ActiveView, label: "Comparisons" },
              { id: "about" as ActiveView, label: "About" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeView === item.id
                    ? "bg-brand-500 text-white"
                    : "text-surface-500 hover:text-surface-700 hover:bg-surface-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      {activeView === "calculator" && <BudgetWizard />}
      {activeView === "comparisons" && <ComparisonMatrix />}
      {activeView === "about" && (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-surface-900 mb-4">
            About This Guide
          </h1>
          <div className="prose prose-surface max-w-none space-y-4">
            <p className="text-surface-600 leading-relaxed">
              This platform is built for Indian homeowners navigating the complex world of interior design
              materials, finishes, and budgeting. The content is derived from real-world expertise documented
              in a comprehensive guide covering every aspect of interior fit-outs — from plywood grades and
              hardware types to cost management strategies and vendor selection.
            </p>
            <h2 className="text-xl font-semibold text-surface-800 mt-8">How It Works</h2>
            <ul className="space-y-2 text-surface-600">
              <li><strong className="text-surface-800">Budget Calculator:</strong> Enter your property details and preferences to get a real-time cost estimate with breakdowns by category.</li>
              <li><strong className="text-surface-800">Material Comparisons:</strong> Side-by-side analysis of materials like Granite vs Quartz, MDF vs HDHMR, and Sliding vs Swing wardrobes.</li>
              <li><strong className="text-surface-800">Smart Warnings:</strong> The system detects risky combinations (e.g., sliding wardrobes with budget hardware) and suggests corrections.</li>
            </ul>
            <h2 className="text-xl font-semibold text-surface-800 mt-8">Key Principles</h2>
            <p className="text-surface-600 leading-relaxed">
              Transparency, clear scope, and asking the right questions matter more than company size.
              Knowing how interiors work puts the control back in your hands — regardless of whether
              you choose a big or small firm.
            </p>
            <div className="mt-8 p-4 rounded-xl bg-brand-50 border border-brand-100">
              <p className="text-sm text-brand-800">
                💡 This is a living guide. All data is structured from curated interior design expertise
                and can be extended with real pricing, images, and videos in future phases.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
