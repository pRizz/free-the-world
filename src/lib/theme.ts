export const theme = {
  accentName: "indigo",
  colors: {
    background: "oklch(0.16 0.018 285)",
    surface: "oklch(0.21 0.02 285)",
    surfaceElevated: "oklch(0.25 0.03 285)",
    border: "oklch(0.32 0.025 285)",
    foreground: "oklch(0.96 0.01 270)",
    mutedForeground: "oklch(0.76 0.03 278)",
    accent: "oklch(0.58 0.16 285)",
    accentSoft: "oklch(0.3 0.08 285)",
    success: "oklch(0.72 0.14 150)",
    warning: "oklch(0.78 0.16 80)",
  },
} as const;

export type AccentColorName = typeof theme.accentName;
