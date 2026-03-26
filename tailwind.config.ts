import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        "bg-base": "#131313",
        "bg-card": "#1b1b1b",
        "bg-sidebar": "#0e0e0e",
        "bg-elevated": "#2a2a2a",
        "bg-subtle": "#353535",
        // Accent
        accent: "#2563eb",
        "accent-hover": "#1d4ed8",
        "accent-light": "#b4c5ff",
        "accent-glow": "#eeefff",
        // Text
        "text-primary": "#e2e2e2",
        "text-secondary": "#c3c6d7",
        "text-muted": "rgba(226,226,226,0.4)",
        "text-faint": "rgba(226,226,226,0.2)",
        // Borders
        "border-default": "rgba(67,70,85,0.2)",
        "border-subtle": "rgba(67,70,85,0.1)",
        "border-accent": "rgba(180,197,255,0.2)",
      },
      fontFamily: {
        epilogue: ["Epilogue", "sans-serif"],
        "space-grotesk": ["Space Grotesk", "sans-serif"],
        mono: ["Liberation Mono", "Courier New", "monospace"],
      },
      fontSize: {
        "2xs": ["8px", { lineHeight: "12px" }],
        "xs": ["10px", { lineHeight: "15px" }],
        "sm": ["12px", { lineHeight: "16px" }],
        "base": ["14px", { lineHeight: "20px" }],
        "lg": ["16px", { lineHeight: "24px" }],
        "xl": ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["36px", { lineHeight: "40px" }],
        "4xl": ["48px", { lineHeight: "56px" }],
        "5xl": ["60px", { lineHeight: "64px" }],
        "7xl": ["96px", { lineHeight: "96px" }],
      },
      letterSpacing: {
        "widest-2": "2px",
        "widest-3": "3px",
        "widest-4": "4px",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "blink": "blink 1.2s step-end infinite",
        "scan": "scan 3s linear infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(67,70,85,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(67,70,85,0.1) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
