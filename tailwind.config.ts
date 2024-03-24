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
        white: "#fff",
        gray: {
          "100": "rgba(0, 0, 0, 0.4)",
          "200": "rgba(0, 0, 0, 0.1)",
          "300": "rgba(0, 0, 0, 0.6)",
        },
        black: "#000",
        orange: "#ff7426",
        green:"#E7F9FD"
      },
      spacing: {},
      fontFamily: {
        inter: ['var(--font-inter)'],
        lobster: ['var(--font-lobster)'],
      },
      borderRadius: {
        "12xs": "1px",
      },
    },
    fontSize: {
      base: "16px",
      xs: "12px",
      sm: "16px",
      lg: "18px",
      xl: "24px",
      inherit: "inherit",
    },
  },
  plugins: [],
};
export default config;
