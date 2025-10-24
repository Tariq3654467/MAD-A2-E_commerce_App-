// Shopify-Inspired Color Palette
export const colors = {
  // Primary - Shopify Green
  primary: '#008060',
  primaryDark: '#006B4F',
  primaryLight: '#00A575',
  
  // Secondary - Clean neutrals
  secondary: '#5C6AC4',
  accent: '#FFC453',
  
  // Backgrounds
  background: '#F6F6F7',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text
  text: '#202223',
  textSecondary: '#6D7175',
  textLight: '#8C9196',
  
  // Status colors
  success: '#008060',
  warning: '#FFC453',
  error: '#D72C0D',
  info: '#5C6AC4',
  
  // UI Elements
  border: '#E1E3E5',
  divider: '#E1E3E5',
  hover: '#F1F2F3',
  
  // Shadows
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};
