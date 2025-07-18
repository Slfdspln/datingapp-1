import { DefaultTheme } from 'react-native-paper';

// Define your app's color palette
export const colors = {
  primary: '#a085e9', // Purple - main brand color
  accent: '#5c6bc0', // Indigo - secondary color
  success: '#4CAF50', // Green - for positive actions like matches
  error: '#ff5252', // Red - for negative actions
  warning: '#FFC107', // Amber - for warnings
  info: '#2196F3', // Blue - for information
  background: '#f5f5f5', // Light gray - app background
  surface: '#ffffff', // White - card surface
  text: '#212121', // Near black - primary text
  textSecondary: '#757575', // Medium gray - secondary text
  border: '#e0e0e0', // Light gray - borders
  disabled: '#bdbdbd', // Gray - disabled elements
  placeholder: '#9e9e9e', // Medium gray - placeholder text
};

// Create a custom theme for React Native Paper
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    error: colors.error,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  roundness: 12,
};

// Define consistent spacing values
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Define consistent font sizes
export const typography = {
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 'bold',
  },
  headline: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
  },
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold',
  },
};

// Shadow styles for different elevations
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Common button styles
export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.accent,
  },
  success: {
    backgroundColor: colors.success,
  },
  error: {
    backgroundColor: colors.error,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
};

export default {
  colors,
  theme,
  spacing,
  typography,
  shadows,
  buttonStyles,
};
