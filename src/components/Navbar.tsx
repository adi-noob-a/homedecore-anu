"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useRef } from "react";

const NAV_LINKS = [
  { href: "/", label: "Calculator" },
  { href: "/materials", label: "Materials" },
  { href: "/finishes", label: "Surface Finishes" },
  { href: "/hardware", label: "Hardware Guide" },
];

const SCROLL_THRESHOLD = 50;   // px before considering direction change
const HEADER_HIDE_Y = -80;     // translateY to hide off-screen

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = lastScrollY.current;
    const delta = current - previous;

    if (Math.abs(delta) < SCROLL_THRESHOLD) {
      // Below threshold — keep current state
      lastScrollY.current = current;
      return;
    }

    if (current < 60) {
      // At top of page — always show
      setHidden(false);
    } else if (delta > 0) {
      // Scrolling down — hide
      setHidden(true);
    } else if (delta < 0) {
      // Scrolling up — show
      setHidden(false);
    }

    lastScrollY.current = current;
  });

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      animate={{ y: hidden ? HEADER_HIDE_Y : 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Glassmorphism backdrop — hardware products peek through */}
      <div className="absolute inset-0 backdrop-blur-[10px] bg-white/[0.08] border-b border-zinc-800/50" />

      {/* Content layer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">ID</span>
            </div>
            <span className="font-semibold text-zinc-100 text-sm hidden sm:inline-block tracking-tight">
              Interior Design Hub
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors"
                >
                  <span className={active ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}>
                    {link.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-2 right-2 h-0.5 bg-brand-400 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-white/[0.06] transition-colors"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-zinc-400" />
            ) : (
              <Menu className="w-5 h-5 text-zinc-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden border-t border-zinc-800"
          style={{ background: "rgba(255, 255, 255, 0.06)", backdropFilter: "blur(10px)" }}
        >
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-zinc-800/50 text-zinc-100"
                      : "text-zinc-500 hover:bg-zinc-800/30 hover:text-zinc-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
