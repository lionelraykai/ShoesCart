import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { CartBanner } from '@/components/CartBanner';
import { persistor, store } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/selectors';
import { paperDarkTheme, paperLightTheme } from '@/theme/paperTheme';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <Stack>
      <Stack.Protected guard={!!currentUser}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="shoe/[id]" options={{ presentation: 'modal', title: 'Shoe Details' }} />
        <Stack.Screen name="admin/[id]" options={{ presentation: 'modal', title: 'Shoe Details' }} />
      </Stack.Protected>
      <Stack.Protected guard={!currentUser}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={isDark ? paperDarkTheme : paperLightTheme}>
          <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            <RootNavigator />
            <CartBanner />
          </ThemeProvider>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
