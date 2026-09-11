import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0f14",
          surface: "#10161d",
          elevated: "#161d26",
        },
        border: {
          DEFAULT: "#232c36",
        },
        brand: {
          DEFAULT: "#5ee6c8",
          dim: "#3fa38f",
        },
        accent: {
          DEFAULT: "#ff7a45",
        },
        text: {
          DEFAULT: "#e9eef2",
          dim: "#8b98a5",
        },
        danger: "#ff5d6c",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
};

export default config;
