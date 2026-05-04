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
        /* Brand + travel-inspired neutrals */
        primary: "#2563eb",
        "primary-dark": "#1d4ed8",
        navy: "#0f172a", // Darker navy for better contrast with blue
        accent: "#3b82f6",
        "accent-light": "#93c5fd",
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
