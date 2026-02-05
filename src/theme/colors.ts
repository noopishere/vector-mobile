// Vector Mobile - Black & White Theme
// Inspired by vector.markets

export const colors = {
  // Core
  black: '#000000',
  white: '#FFFFFF',
  
  // Grays
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  
  // Semantic
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  
  // Theme
  background: '#000000',
  surface: '#0A0A0A',
  surfaceElevated: '#171717',
  border: '#262626',
  borderLight: '#404040',
  
  text: {
    primary: '#FFFFFF',
    secondary: '#A3A3A3',
    tertiary: '#737373',
    inverse: '#000000',
  },
  
  // Accent (minimal use)
  accent: '#FFFFFF',
  accentMuted: '#A3A3A3',
} as const;

export type Colors = typeof colors;
