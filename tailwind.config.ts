import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#f7f1e8",
        foreground: "#2b2926",
        card: "#fffdf9",
        border: "#e7ded2",
        muted: "#7d746b",
        accent: "#8b5e34",
        soft: "#f1e7d8"
      },
      boxShadow: {
        notion: "0 8px 30px rgba(69, 51, 33, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
