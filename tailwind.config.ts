import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090a0f",
        surface: "#11131a",
        "surface-raised": "#181a24",
        "surface-border": "#232736",
        primary: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc7fc",
          400: "#36a9f8",
          500: "#0b8de9",
          600: "#026fc7",
          700: "#0358a1",
          800: "#074a85",
          900: "#0c3f6e",
          950: "#082849",
        },
        team: {
          blue: "#0284c7",
          "blue-glow": "#38bdf8",
          orange: "#ea580c",
          "orange-glow": "#fb923c",
        },
        stat: {
          win: "#10b981",
          loss: "#ef4444",
          boost: "#f59e0b",
          speed: "#8b5cf6",
          defense: "#06b6d4",
          offense: "#f43f5e",
        },
      },
    },
  },
  plugins: [],
};
export default config;
