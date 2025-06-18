// this is a js file cause tailwind config file (tailwind.config.js) only supports js
export const COLORS = {
  inherit: "inherit",
  transparent: "transparent",
  current: "currentColor",
  white: "#FFF",
  black: "#000",
  gray: {
    50: "#FAFAFA",
    100: "#f5f5f5",
    125: "#D9D9D9",
    150: "#27272a",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    850: "#1b1b1e",
    900: "#212121",
    950: "#0B0B0B",
    960: "#1E1E1E",
  },
  red: {
    50: "#FFEBEE",
    100: "#FFCDD2",
    200: "#EF9A9A",
    300: "#E57373",
    400: "#EF5350",
    500: "#F44336",
    600: "#E53935",
    700: "#D32F2F",
    800: "#C62828",
    900: "#B71C1C",
  },
  blue: {
    50: "#E3F2FD",
    100: "#c5d3f5",
    200: "#90CAF9",
    300: "#64B5F6",
    400: "#42A5F5",
    500: "#2196F3",
    600: "#1E88E5",
    700: "#1976D2",
    800: "#27354f",
    900: "#0D47A1",
  },
  green: {
    300: "#79AF96",
  },
  gold: {
    100: "#C9AF70",
    200: "#A58950",
  },
  light: {
    background: "#001201",
    divider: "#0000001F",
    card: {
      header: "#FAFAFA",
      body: "#FFF",
    },
    primary: {
      light: "#dff1ee",
      main: "#29a12e",
      dark: "#2d3b2e",
    },
    secondary: {
      light: "#273550",
      main: "#03172d",
      dark: "#01060d",
    },
    info: {
      light: "#03A9F4",
      main: "#0288D1",
      dark: "#01579B",
      shade30: "#0288D1",
      shade900: "#808eac",
    },
    success: {
      light: "#4CAF50",
      main: "#2E7D32",
      dark: "#1B5E20",
    },
    warning: {
      light: "#FF9800",
      main: "#ed803f",
      dark: "#E65100",
    },
    error: {
      light: "#EF5350",
      main: "#D32F2F",
      dark: "#C62828",
    },
    other: {
      outlineBordered: "#0000003b",
    },
  },
  dark: {
    background: "#03162D",
    divider: "#FFFFFF1F",
    card: {
      header: "#0B1725",
      body: "#0D1A2A",
    },
    action: {
      active: "#FFFFFF8F",
      disabled: "#FFFFFF1F",
      selected: "#FFFFFF29",
    },

    text: {
      disabled: "#FFFFFF80",
    },
    primary: {
      light: "#E3FDF8",
      main: "#90F9E4",
      dark: "#42F5D1",
    },
    secondary: {
      light: "#091A2B",
      main: "#93AFD8",
      dark: "#4776BC",
    },
    info: {
      light: "#4FC3F7",
      main: "#29B6F6",
      dark: "#0288D1",
    },
    success: {
      light: "#81C784",
      main: "#66BB6A",
      dark: "#388E3C",
    },
    warning: {
      light: "#FFB74D",
      main: "#FFA726",
      dark: "#F57C00",
    },
    error: {
      light: "#E57373",
      main: "#F44336",
      dark: "#D32F2F",
    },
    other: {
      outlineBordered: "#FFFFFF3B",
    },
  },
};

export const BORDER_RADIUS = {
  none: "0",
  sm: "1px",
  DEFAULT: "2px",
  mid: "4px",
  lmid: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "1000rem",
};

export const BOX_SHADOW = {
  none: "none", // elevation-0
  sm: "rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px", // elevation-1
  DEFAULT:
    "rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px", // elevation-2
  lg: "rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px", // elevation-3
};

export const BREAKPOINTS = {
  sm: "600px",
  md: "900px",
  lg: "1200px",
  xl: "1536px",
};
// Add font weight configuration
export const FONT_WEIGHT = {
  normal: "400",
  medium: "500",
  bold: "700",
};

// Add font size configuration
export const FONT_SIZE = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
};

// Add line height configuration
export const LINE_HEIGHT = {
  none: "1",
  tight: "1.25",
  normal: "1.5",
  relaxed: "1.75",
  loose: "2",
};
