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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#020617",
          foreground: "#F8FAFC",
        },
        accent: {
          DEFAULT: "#38bdf8",
          hover: "#0ea5e9",
          foreground: "#020617",
        },
        surface: {
          dark: "#0f172a",
          light: "#1e293b",
        }
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "premium-gradient": "radial-gradient(circle at center, #1e293b 0%, #020617 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      boxShadow: {
        "premium": "0 25px 60px -15px rgba(0, 0, 0, 0.5)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        "glow": "0 0 20px rgba(56, 189, 248, 0.2)",
      },
      borderRadius: {
        "premium": "3rem",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
