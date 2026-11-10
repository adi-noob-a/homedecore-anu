import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { CompareProvider } from "@/components/CompareModeProvider";
import { ProductViewerProvider } from "@/components/product-viewer/ProductViewerProvider";

export const metadata: Metadata = {
  title: "Interior Design Hub — Design Without Guesswork",
  description:
    "Interactive budget calculator with real-time costing, premium material comparisons, and hardware engineering guides for Indian homeowners.",
  keywords: ["interior design", "budget calculator", "Indian homes", "materials guide", "hardware comparison", "plywood grades", "modular kitchen"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <ScrollProgressBar />
        <Navbar />
        {/* pt-16 accounts for fixed header height (h-16 = 64px) */}
        <div className="pt-16">
          <CompareProvider>
            <ProductViewerProvider>{children}</ProductViewerProvider>
          </CompareProvider>
        </div>
      </body>
    </html>
  );
}
