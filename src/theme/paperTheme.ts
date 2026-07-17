import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

import { Colors } from '@/constants/theme';

const BRAND = '#16A34A';
const BRAND_CONTAINER_LIGHT = '#DCFCE7';
const BRAND_ON_CONTAINER_LIGHT = '#14532D';
const BRAND_CONTAINER_DARK = '#14532D';
const BRAND_ON_CONTAINER_DARK = '#BBF7D0';

export const paperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: BRAND,
    onPrimary: '#FFFFFF',
    primaryContainer: BRAND_CONTAINER_LIGHT,
    onPrimaryContainer: BRAND_ON_CONTAINER_LIGHT,
    background: Colors.light.background,
    surface: Colors.light.background,
    surfaceVariant: Colors.light.backgroundElement,
    onSurface: Colors.light.text,
    onSurfaceVariant: Colors.light.textSecondary,
    outline: Colors.light.backgroundSelected,
  },
};

export const paperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: BRAND,
    onPrimary: '#FFFFFF',
    primaryContainer: BRAND_CONTAINER_DARK,
    onPrimaryContainer: BRAND_ON_CONTAINER_DARK,
    background: Colors.dark.background,
    surface: Colors.dark.background,
    surfaceVariant: Colors.dark.backgroundElement,
    onSurface: Colors.dark.text,
    onSurfaceVariant: Colors.dark.textSecondary,
    outline: Colors.dark.backgroundSelected,
  },
};
