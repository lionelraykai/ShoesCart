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
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
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

          <Button mode="contained" onPress={handleLogIn} loading={submitting} style={styles.button}>
            Log In
          </Button>

          <Button mode="text" onPress={() => router.push('/signup')} style={styles.button}>
            Don&apos;t have an account? Sign up
          </Button>

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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: Spacing.two,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: Spacing.two,
    borderRadius: 22,
    overflow: 'hidden',
  },
  title: {
    marginBottom: Spacing.one,
  },
  field: {
    marginTop: Spacing.two,
  },
  button: {
    marginTop: Spacing.two,
  },
  demoBox: {
    marginTop: Spacing.four,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.half,
  },
});
