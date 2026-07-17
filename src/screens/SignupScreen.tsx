import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';

import { Spacing } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signUp } from '@/store/slices/authSlice';
import { hashPassword } from '@/utils/hash';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function SignupScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const users = useAppSelector((state) => state.auth.users);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = 'Name is required';
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address';
    } else if (users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase())) {
      nextErrors.email = 'An account with this email already exists';
    }
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSignUp() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const passwordHash = await hashPassword(password);
      dispatch(signUp({ name: name.trim(), email: email.trim(), passwordHash }));
    } finally {
      setSubmitting(false);
    }
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
            Create an account
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
            New accounts shop as a User. Use the demo admin account on the login screen to try catalog management.
          </Text>

          {/* Form card */}
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.field}>
              <TextInput label="Name" value={name} onChangeText={setName} mode="outlined" error={!!errors.name} />
              {errors.name ? <HelperText type="error">{errors.name}</HelperText> : null}
            </View>

            <View style={styles.field}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
                error={!!errors.email}
              />
              {errors.email ? <HelperText type="error">{errors.email}</HelperText> : null}
            </View>

            <View style={styles.field}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                error={!!errors.password}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword((prev) => !prev)}
                  />
                }
              />
              {errors.password ? <HelperText type="error">{errors.password}</HelperText> : null}
            </View>

            <View style={styles.field}>
              <TextInput
                label="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                error={!!errors.confirmPassword}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                  />
                }
              />
              {errors.confirmPassword ? <HelperText type="error">{errors.confirmPassword}</HelperText> : null}
            </View>

            <Button mode="contained" onPress={handleSignUp} loading={submitting} style={styles.button} contentStyle={styles.buttonContent}>
              Sign Up
            </Button>

            <Button mode="text" onPress={() => router.push('/login')} style={styles.button}>
              Already have an account? Log in
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
});
