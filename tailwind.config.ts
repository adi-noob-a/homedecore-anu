import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ─── Luxury Palette ───
        bg: {
          primary: "#0F172A",     // Deep Luxury Slate — main background
          surface: "#1E293B",     // Soft Charcoal-Blue — cards, menus, drawers
          DEFAULT: "#0F172A",
        },
        text: {
          brand: "#FBBF24",       // Brushed Gold — headlines, accents
          secondary: "#94A3B8",   // Satin Nickel — muted text, borders
          primary: "#F8FAFC",     // Polished Platinum — main body text
          DEFAULT: "#F8FAFC",
        },
        brand: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#4B5563",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",   // Soft Charcoal-Blue
          900: "#0F172A",   // Deep Luxury Slate
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
        "gradient-brand-subtle": "linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.08) 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        "gradient-hero": "radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.08) 0%, transparent 70%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        // ─── Large Typography Hierarchy ───
        "h1": ["3.5rem", { lineHeight: "1.2", fontWeight: "800", letterSpacing: "-0.03em" }],
        "h2": ["2.5rem", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.01em" }],
        "h3": ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6", fontWeight: "400" }],
        "caption": ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }],
        "caption-sm": ["0.6875rem", { lineHeight: "1.45", fontWeight: "400" }],
      },
      keyframes: {
        "shimmer-slide": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "checkmark-draw": {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "shimmer-slide": "shimmer-slide 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "checkmark-draw": "checkmark-draw 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
