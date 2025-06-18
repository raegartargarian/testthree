/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require("tailwindcss/plugin");

const {
  COLORS,
  BORDER_RADIUS,
  BOX_SHADOW,
  BREAKPOINTS,
} = require("./src/styles/configs/tailwind-theme.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", "class"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      grotesk: ["grotesk", "sans-serif"],
      playfair: ["Playfair Display", "serif"],
      montserrat: ["Montserrat", "sans-serif"],
      cormorant: ["Cormorant Garamond", "serif"],
    },
    container: {
      center: "true",
      padding: {
        DEFAULT: "1rem",
      },
    },
    colors: COLORS,
    borderRadius: BORDER_RADIUS,
    boxShadow: BOX_SHADOW,
    screens: BREAKPOINTS,
    extend: {
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        spin: "spin 1s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("light", ".light &");
    }),
    require("tailwindcss-animate"),
  ],
};
