import { StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

import { Spacing } from '@/constants/theme';

interface EmptyStateProps {
  icon: string;
  title: string;
  message?: string;
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Icon inside a soft circular backdrop */}
      <View style={[styles.iconBackdrop, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={[styles.iconInner, { backgroundColor: theme.colors.primaryContainer }]}>
          <Icon source={icon} size={40} color={theme.colors.primary} />
        </View>
      </View>

      <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>

      {message ? (
        <Text
          variant="bodyMedium"
          style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.five,
    gap: Spacing.three,
  },
  iconBackdrop: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});
