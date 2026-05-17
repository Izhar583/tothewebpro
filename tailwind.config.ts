import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        /* Brand + orange-inspired neutrals */
        primary: "#f97316", // orange-500
        "primary-dark": "#ea580c", // orange-600
        navy: "#0f172a", 
        accent: "#f59e0b", // amber-500
        "accent-light": "#fef3c7", // amber-100
        body: "#475569",
        surface: "#f8fafc",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        /* Keep Google SERP blue accurate in meta checker */
        serpTitle: "#1a0dab",
      },
      borderRadius: {
        card: "20px",
        input: "12px",
        badge: "9999px",
      },
      boxShadow: {
        soft: "0 18px 50px -24px rgba(15, 23, 42, 0.15)",
        lift: "0 20px 40px -15px rgba(37, 99, 235, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
