import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';

import { Spacing } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logIn } from '@/store/slices/authSlice';
import { hashPassword } from '@/utils/hash';

export function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const users = useAppSelector((state) => state.auth.users);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogIn() {
    if (!email.trim() || !password) {
      setError('Enter your email and password');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const passwordHash = await hashPassword(password);
      const match = users.find(
        (user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.passwordHash === passwordHash
      );
      if (!match) {
        setError('Invalid email or password');
        return;
      }
      dispatch(logIn(match.id));
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemo(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Top green accent strip */}
      <View style={styles.accentStrip} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          {/* Logo */}
          <Image
            source={require('../../assets/images/app-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text variant="headlineMedium" style={styles.title}>
            Shoe Cart
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Log in to shop or manage the catalog.
          </Text>

          {/* Form card */}
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.field}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.field}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword((prev) => !prev)}
                  />
                }
              />
            </View>

            {error ? <HelperText type="error">{error}</HelperText> : null}

            <Button mode="contained" onPress={handleLogIn} loading={submitting} style={styles.button} contentStyle={styles.buttonContent}>
              Log In
            </Button>

            <Button mode="text" onPress={() => router.push('/signup')} style={styles.button}>
              Don&apos;t have an account? Sign up
            </Button>
          </View>

          {/* Demo box */}
          <View style={[styles.demoBox, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="labelLarge">Try it instantly</Text>
            <Button mode="text" compact onPress={() => fillDemo('admin@shoecart.app', 'admin123')}>
              Demo Admin — admin@shoecart.app / admin123
            </Button>
            <Button mode="text" compact onPress={() => fillDemo('user@shoecart.app', 'user123')}>
              Demo Shopper — user@shoecart.app / user123
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  accentStrip: {
    height: 6,
    backgroundColor: '#16A34A',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: Spacing.three,
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.one,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  field: {
    marginTop: Spacing.two,
  },
  button: {
    marginTop: Spacing.two,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: Spacing.one,
  },
  demoBox: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.half,
  },
});
