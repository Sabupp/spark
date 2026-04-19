export const theme = {
  colors: {
    background: "#0D0D0D",
    surface: "#1A1A1A",
    card: "#222222",
    accent: "#E63946",
    accentLight: "#FF6B6B",
    textPrimary: "#FFFFFF",
    textSecondary: "#A0A0A0",
    border: "#2C2C2C",
    shadow: "#000000",
    success: "#7DDF9B"
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  radii: {
    md: 12,
    lg: 16,
    xl: 24
  }
} as const;

export type AppTheme = typeof theme;
