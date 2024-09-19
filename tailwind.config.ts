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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      container: {
        center: true,
      },
    },
  },
  daisyui: {
    themes: [
      {
        brocTheme: {
          primary: "#7ab374",
          secondary: "#8cb388",
          accent: "#a0b59e",
          neutral: "#374151",
          "base-100": "#111827",
          info: "#00c4df",
          success: "#00f191",
          warning: "#ff8c00",
          error: "#ff638a",
        },
      },
    ],
  },
  //plugins: [daisyui],
  plugins: [require("daisyui")],
};
export default config;
