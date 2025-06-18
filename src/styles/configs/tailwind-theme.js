export const COLORS = {
  inherit: "inherit",
  transparent: "transparent",
  current: "currentColor",
  white: "#FFFFFF",
  black: "#000000",

  // Luxury color palette
  luxury: {
    gold: {
      50: "#FFF9E6",
      100: "#FFF3CC",
      200: "#FFE799",
      300: "#FFDB66",
      400: "#FFCF33",
      500: "#D4AF37",
      600: "#BF9B30",
      700: "#A68729",
      800: "#8C7323",
      900: "#735F1C",
    },
    champagne: {
      100: "#F7E7CE",
      200: "#F5DFC2",
      300: "#F2D7B6",
      400: "#F0CFAA",
      500: "#EDC79E",
    },
  },

  obsidian: {
    50: "#1A1A1A",
    100: "#0F0F0F",
    200: "#0A0A0A",
    300: "#050505",
    400: "#020202",
    500: "#000000",
  },

  pearl: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#F0F0F0",
    300: "#E8E8E8",
    400: "#E0E0E0",
    500: "#D8D8D8",
  },

  gray: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0A0A0A",
  },

  // Legacy colors for compatibility
  light: {
    background: "#000000",
  },
  dark: {
    background: "#000000",
  },
};

export const BORDER_RADIUS = {
  none: "0",
  sm: "2px",
  DEFAULT: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  "3xl": "32px",
  full: "9999px",
};

export const BOX_SHADOW = {
  none: "none",
  sm: "0 1px 2px 0 rgba(212, 175, 55, 0.05)",
  DEFAULT:
    "0 4px 6px -1px rgba(212, 175, 55, 0.1), 0 2px 4px -1px rgba(212, 175, 55, 0.06)",
  md: "0 10px 15px -3px rgba(212, 175, 55, 0.1), 0 4px 6px -2px rgba(212, 175, 55, 0.05)",
  lg: "0 20px 25px -5px rgba(212, 175, 55, 0.1), 0 10px 10px -5px rgba(212, 175, 55, 0.04)",
  xl: "0 25px 50px -12px rgba(212, 175, 55, 0.25)",
  glow: "0 0 30px rgba(212, 175, 55, 0.3)",
};

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};
