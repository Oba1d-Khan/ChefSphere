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
          "100": "rgba(0, 0, 0, 0.8)",
          "200": "rgba(0, 0, 0, 0.1)",
          "300": "rgba(0, 0, 0, 0.4)",
          "400": "rgba(0, 0, 0, 0.6)",
        },
        black: "#000",
        orange: "#ff7426",
        darkslategray: "#333",
      },
      spacing: {},
      fontFamily: {
        inter: ["var(--font-inter)"],
        lobster: ["var(--font-lobster)"],
      },
      borderRadius: {
        "12xs": "1px",
        "11xl": "30px",
      },
    },
    fontSize: {
      base: "1rem",
      "5xl": "1.5rem",
      lgi: "1.188rem",
      sm: "0.875rem",
      lg: "1.125rem",
      "17xl": "2.25rem",
      "3xl": "1.375rem",
      "10xl": "1.813rem",
      "29xl": "3rem",
      "19xl": "2.375rem",
      xs: "0.75rem",
      "45xl": "4rem",
      "32xl": "3.188rem",
      inherit: "inherit",
    },
    screens: {
      lg: {
        max: "1200px",
      },
      mq1050: {
        raw: "screen and (max-width: 1050px)",
      },
      mq1000: {
        raw: "screen and (max-width: 1000px)",
      },
      mq725: {
        raw: "screen and (max-width: 725px)",
      },
      mq450: {
        raw: "screen and (max-width: 450px)",
      },
    },
  },
  plugins: [],
};
export default config;
