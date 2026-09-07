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
        background: "#f5f6f3",
        foreground: "#263c35",
        card: "#ffffff",
        border: "#e1e7e1",
        muted: "#68766f",
        accent: "#356653",
        soft: "#eaf1eb"
      },
      boxShadow: {
        notion: "0 4px 20px rgba(38, 60, 53, 0.035)"
      }
    }
  },
  plugins: []
};

export default config;
