"use client";

import Link from "next/link";
import { Calculator } from "lucide-react";

export function StickyCtaBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:bottom-auto md:top-20 md:right-4 md:left-auto md:w-auto">
      <Link
        href="/#calculator"
        className="btn-amber flex items-center justify-center gap-2 px-5 py-3 text-sm rounded-none md:rounded-xl shadow-lg md:shadow-xl"
      >
        <Calculator className="w-4 h-4" />
        Get Your Estimate
      </Link>
    </div>
  );
}
