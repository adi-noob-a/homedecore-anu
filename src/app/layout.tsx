import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased font-sans bg-surface-50 text-surface-900">
        {children}
      </body>
    </html>
  );
}
