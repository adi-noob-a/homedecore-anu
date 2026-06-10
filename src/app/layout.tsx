import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Interior Design Hub — Budget Calculator & Material Guide",
  description:
    "Interactive budget calculator for Indian homeowners. Compare materials, finishes, and hardware for your interior design project.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-zinc-950 text-zinc-100">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
