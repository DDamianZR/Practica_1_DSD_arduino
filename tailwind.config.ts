import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        base: {
          950: "#070a12",
          900: "#0b1020",
          800: "#0f172a",
          700: "#131b32",
          600: "#1b2544",
          500: "#233054",
        },
        // Per-bit palette
        bit: {
          q0: "#22d3ee", // cyan/teal
          q1: "#34d399", // emerald
          q2: "#f59e0b", // amber
          q3: "#f472b6", // pink/coral
        },
        clk: "#a78bfa", // violet
        din: "#e5e7eb", // near-white
        surface: "rgba(255,255,255,0.04)",
      },
      boxShadow: {
        glow: "0 0 30px rgba(34,211,238,0.35)",
        panel:
          "0 1px 0 rgba(255,255,255,0.05) inset, 0 12px 40px rgba(0,0,0,0.35)",
        press:
          "0 2px 0 rgba(255,255,255,0.05) inset, 0 8px 24px rgba(0,0,0,0.3)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 50% 40%, rgba(80,110,220,0.14), rgba(0,0,0,0) 60%)",
      },
      keyframes: {
        pulse2: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        pulse2: "pulse2 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
