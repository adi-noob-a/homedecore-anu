import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

export const metadata: Metadata = {
  title: "Interior Design Hub — Design Without Guesswork",
  description:
    "Interactive budget calculator, premium material comparisons, and hardware guides for Indian homeowners. Design your dream interior with confidence.",
  keywords: ["interior design", "budget calculator", "Indian homes", "materials guide", "hardware comparison"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <CustomCursor />
        <Navbar />
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </body>
    </html>
  );
}
