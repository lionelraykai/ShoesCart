import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

import { Colors } from '@/constants/theme';

const BRAND = '#16A34A';
const BRAND_LIGHT = '#22C55E';
const BRAND_CONTAINER_LIGHT = '#DCFCE7';
const BRAND_ON_CONTAINER_LIGHT = '#14532D';
const BRAND_CONTAINER_DARK = '#14532D';
const BRAND_ON_CONTAINER_DARK = '#BBF7D0';

export const paperLightTheme = {
  ...MD3LightTheme,
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: BRAND,
    onPrimary: '#FFFFFF',
    primaryContainer: BRAND_CONTAINER_LIGHT,
    onPrimaryContainer: BRAND_ON_CONTAINER_LIGHT,
    secondary: BRAND_LIGHT,
    background: '#F8FAF9',
    surface: '#FFFFFF',
    surfaceVariant: '#EEF5F1',
    onSurface: '#111827',
    onSurfaceVariant: '#4B5563',
    outline: '#D1D5DB',
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level1: '#FFFFFF',
      level2: '#F3FBF6',
    },
  },
};

export const paperDarkTheme = {
  ...MD3DarkTheme,
  roundness: 4,
  colors: {
    ...MD3DarkTheme.colors,
    primary: BRAND,
    onPrimary: '#FFFFFF',
    primaryContainer: BRAND_CONTAINER_DARK,
    onPrimaryContainer: BRAND_ON_CONTAINER_DARK,
    secondary: BRAND_LIGHT,
    background: '#0A0F0C',
    surface: '#111814',
    surfaceVariant: '#1C2620',
    onSurface: '#F0FDF4',
    onSurfaceVariant: '#9CA3AF',
    outline: '#2D3748',
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level1: '#141F18',
      level2: '#1A2B20',
    },
  },
};
