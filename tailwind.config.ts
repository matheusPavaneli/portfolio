import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
    extend: {
      colors: {
        accent:            "rgb(var(--color-accent) / <alpha-value>)",
        "accent-dim":      "rgb(var(--color-accent-hover) / <alpha-value>)",
        "accent-hover":    "rgb(var(--color-accent-hover) / <alpha-value>)",
        surface:           "rgb(var(--surface) / <alpha-value>)",
        "surface-elevated":"rgb(var(--surface-elevated) / <alpha-value>)",
        fg:                "rgb(var(--fg) / <alpha-value>)",
        "fg-muted":        "rgb(var(--fg-muted) / <alpha-value>)",
        "on-accent":       "rgb(var(--on-accent) / <alpha-value>)",
        "color-error":     "rgb(var(--color-error) / <alpha-value>)",
        "color-success":   "rgb(var(--color-success) / <alpha-value>)",
        "color-warning":   "rgb(var(--color-warning) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "reveal-up": "reveal-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      letterSpacing: {
        "tightest": "-0.04em",
        "mega": "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
