export const theme = {
  accentName: "indigo",
  colors: {
    background: "rgb(10 1 26)",
    surface: "rgb(12 1 32)",
    surfaceElevated: "rgb(14 2 38)",
    border: "rgb(28 11 62)",
    foreground: "oklch(0.96 0.01 270)",
    mutedForeground: "oklch(0.76 0.03 278)",
    accent: "rgb(24 3 64)",
    accentSoft: "rgb(17 2 45)",
    success: "oklch(0.72 0.14 150)",
    warning: "oklch(0.78 0.16 80)",
  },
} as const;

export type AccentColorName = typeof theme.accentName;
