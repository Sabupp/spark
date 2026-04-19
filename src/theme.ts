export const theme = {
  colors: {
    background: "#0D0D0D",
    surface: "#1A1A1A",
    card: "#222222",
    cardElevated: "#262626",
    accent: "#E63946",
    accentLight: "#FF6B6B",
    accentMuted: "rgba(230, 57, 70, 0.16)",
    textPrimary: "#FFFFFF",
    textSecondary: "#A0A0A0",
    textMuted: "#7A7A7A",
    border: "#2C2C2C",
    borderStrong: "#383838",
    shadow: "#000000",
    success: "#7DDF9B"
  },
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 56
  },
  radii: {
    md: 20,
    lg: 24,
    xl: 32
  },
  typography: {
    body: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold"
  },
  shadows: {
    card: {
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 16
      },
      shadowOpacity: 0.22,
      shadowRadius: 24,
      elevation: 10
    }
  }
} as const;

export type AppTheme = typeof theme;
