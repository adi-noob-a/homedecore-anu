"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

const NAV_STRUCTURE: NavItem[] = [
  {
    title: "Budget & Cost Management",
    href: "/budget",
    children: [
      { title: "Why Quotes Increase", href: "/budget/quote-increases" },
      { title: "Hidden Costs", href: "/budget/hidden-costs" },
      { title: "Cost-Saving Tips", href: "/budget/cost-saving-tips" },
      { title: "Project-Based Budgets", href: "/budget/project-budgets" },
    ],
  },
  {
    title: "Core Materials",
    href: "/materials",
    children: [
      { title: "Plywood Grades", href: "/materials/plywood-grades" },
      { title: "Engineered Boards", href: "/materials/engineered-boards" },
      { title: "Plywood Thickness Guide", href: "/materials/plywood-thickness" },
    ],
  },
  {
    title: "Surface Finishes",
    href: "/finishes",
    children: [
      { title: "Sheet Finishes", href: "/finishes/sheet-finishes" },
      { title: "Paint Finishes", href: "/finishes/paint-finishes" },
      { title: "Specialty Finishes", href: "/finishes/specialty-finishes" },
    ],
  },
  {
    title: "Hardware & Accessories",
    href: "/hardware",
    children: [
      { title: "German vs Indian", href: "/hardware/german-vs-indian" },
      { title: "Sliding vs Swing Wardrobes", href: "/hardware/wardrobe-systems" },
      { title: "Full-Height Systems", href: "/hardware/full-height-systems" },
    ],
  },
  {
    title: "Vendor Selection",
    href: "/vendor-selection",
    children: [
      { title: "Big vs Small Companies", href: "/vendor-selection/big-vs-small" },
      { title: "Experience Centres", href: "/vendor-selection/experience-centres" },
      { title: "Site Visit Guide", href: "/vendor-selection/site-visits" },
    ],
  },
  {
    title: "Countertops",
    href: "/countertops",
    children: [
      { title: "Granite vs Quartz", href: "/countertops/granite-vs-quartz" },
    ],
  },
  {
    title: "Interactive Tools",
    href: "/tools",
    children: [
      { title: "Cost Ladder", href: "/tools/cost-ladder" },
      { title: "Comparison Matrix", href: "/tools/comparison-matrix" },
      { title: "Budget Calculator", href: "/tools/budget-calculator" },
      { title: "Red Flag Alerts", href: "/tools/red-flag-alerts" },
    ],
  },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {NAV_STRUCTURE.map((section) => {
        const isActive = pathname === section.href || pathname.startsWith(section.href + "/");
        const isChildActive = pathname.startsWith(section.href);
        return (
          <div key={section.href}>
            <Link
              href={section.href}
              onClick={onNavigate}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-50 text-brand-700 border-l-2 border-brand-500"
                  : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"
              }`}
            >
              <ChevronRight className={`w-3 h-3 transition-transform ${isChildActive ? "rotate-90" : ""}`} />
              {section.title}
            </Link>
            {section.children && (
              <div className={`ml-4 mt-1 space-y-0.5 ${isChildActive ? "" : "hidden"}`}>
                {section.children.map((child) => {
                  const isChildActivePage = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={`block px-3 py-1.5 rounded-lg text-xs transition-all ${
                        isChildActivePage
                          ? "bg-brand-50 text-brand-600 font-medium"
                          : "text-surface-500 hover:text-surface-800 hover:bg-surface-50"
                      }`}
                    >
                      {child.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function SidebarNavContent() {
  return <SidebarNav />;
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Breadcrumb
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = seg
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { label, href };
  });

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">ID</span>
              </div>
              <span className="font-semibold text-surface-900 text-sm hidden sm:inline">
                Interior Design Hub
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-1 text-xs text-surface-400">
            <Link href="/" className="hover:text-surface-600 transition-colors">Home</Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1">
                <span className="text-surface-300">/</span>
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-surface-600 font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-surface-600 transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-surface-200 min-h-[calc(100vh-3.5rem)] p-4 sticky top-14 self-start overflow-y-auto">
          <SidebarNav />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-14 bottom-0 w-72 bg-white border-r border-surface-200 p-4 overflow-y-auto"
            >
              <SidebarNav onNavigate={() => setMobileMenuOpen(false)} />
            </motion.aside>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
