/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#3bb3f9';
const tintColorDark = '#3bb3f9';

// Legacy Colors export for compatibility
export const Colors = {
  light: {
    text: '#1F2A44',
    background: '#F5F6FA',
    tint: '#3bb3f9',
    icon: '#6B6F85',
    tabIconDefault: '#6B6F85',
    tabIconSelected: '#3bb3f9',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#3bb3f9',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#3bb3f9',
  },
};

// Deep Indigo Light Bold Theme
export const theme = {
  colors: {
    background: '#F5F6FA',
    card: '#FFFFFF',
    textPrimary: '#1F2A44',
    textSecondary: '#6B6F85',
    accent: '#3bb3f9',
    accentDark: '#1e7db6',
    accentLight: '#c7e9ff',
    border: 'rgba(31,42,68,0.08)',
    headerGradient: ['#1e7db6', '#3bb3f9'],
    bubbleSent: '#3bb3f9',
    bubbleReceived: '#FFFFFF',
    bubbleShadow: 'rgba(0,0,0,0.05)',
    badgeBg: '#E4F4FE',
    badgeText: '#3bb3f9',
    buttonSecondaryBg: '#F1F3F8',
    buttonSecondaryText: '#1F2A44',
    navBg: '#F7F8FC',
    navShadow: 'rgba(31,42,68,0.10)',
    navActive: '#3bb3f9',
    navInactive: '#6B6F85',
  },
  radius: {
    card: 18,
    bubble: 16,
    button: 16,
    input: 16,
    badge: 12,
  },
  shadow: {
    card: '0 2px 12px rgba(31,42,68,0.10)',
    bubble: '0 2px 8px rgba(0,0,0,0.05)',
    nav: '0 -2px 8px rgba(31,42,68,0.10)',
    button: '0 2px 8px #C9CCF5',
  },
  font: {
    bold: '700',
    semiBold: '600',
    regular: '400',
    family: 'System',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
