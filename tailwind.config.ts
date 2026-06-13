import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Midnight Void surfaces
        midnight: {
          DEFAULT: "#05050A",
          50: "#0A0A14",
          100: "#0F0F1E",
          200: "#1A1A2E",
          300: "#2A2A3E",
          400: "#3A3A50",
        },
        // Electric Indigo — primary brand
        indigo: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        // Sunset Coral — secondary accent
        coral: {
          50: "#FFF1F0",
          100: "#FFE4E0",
          200: "#FFC9C2",
          300: "#FFA89C",
          400: "#FF8A7A",
          500: "#FF7E67",
          600: "#F05A3E",
          700: "#D64028",
          800: "#B3341E",
          900: "#8F2A18",
        },
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        warning: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          500: "#ef4444",
          600: "#dc2626",
        },
        rental: "#6366f1",
        personal: "#10b981",
        villa: "#f59e0b",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #6366F1 0%, #FF7E67 100%)",
        "gradient-brand-subtle": "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(255,126,103,0.10) 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        "gradient-hero": "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)",
        "gradient-cta": "linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #FF7E67 100%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "badge-flip": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(99, 102, 241, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(99, 102, 241, 0)" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
        "tier-bounce": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-target)" },
        },
        "shimmer-slide": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "badge-flip": "badge-flip 0.6s ease-in-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shake": "shake 0.4s ease-in-out",
        "tier-bounce": "tier-bounce 0.3s ease-in-out",
        "progress-fill": "progress-fill 0.5s ease-out forwards",
        "shimmer-slide": "shimmer-slide 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
