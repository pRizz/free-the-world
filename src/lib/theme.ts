export const theme = {
  accentName: "indigo",
  colors: {
    background: "hsl(261, 50%, 4%)",
    foreground: "hsl(270, 5%, 94%)",
    card: "hsl(262, 91%, 5%)",
    primary: "hsl(264, 83%, 12%)",
    primaryForeground: "hsl(270, 5%, 96%)",
    secondary: "hsl(265, 85%, 8%)",
    muted: "hsl(265, 85%, 8%)",
    mutedForeground: "hsl(278, 12%, 63%)",
    accent: "hsl(280, 40%, 70%)",
    border: "hsl(263, 25%, 20%)",
    success: "hsl(150, 45%, 42%)",
    warning: "hsl(80, 55%, 50%)",
  },
} as const;

export type AccentColorName = typeof theme.accentName;
