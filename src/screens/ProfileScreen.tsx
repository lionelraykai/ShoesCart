import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Divider, Surface, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { MaxContentWidth, Spacing, WebTopBarInset } from '@/constants/theme';
import { persistor } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/selectors';
import { logOut } from '@/store/slices/authSlice';

export function ProfileScreen() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const currentUser = useAppSelector(selectCurrentUser);
  const shoeCount = useAppSelector((state) => state.shoes.items.length);
  const orderCount = useAppSelector((state) => state.orders.items.length);

  const [logOutDialogVisible, setLogOutDialogVisible] = useState(false);
  const [resetDialogVisible, setResetDialogVisible] = useState(false);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.pageTitle}>Profile</Text>

        {/* User info card */}
        <Surface style={styles.userCard} elevation={2}>
          {/* Coloured top strip */}
          <View style={[styles.cardAccent, { backgroundColor: isAdmin ? '#16A34A' : '#0369A1' }]} />

          <View style={styles.cardBody}>
            <Avatar.Text
              size={64}
              label={currentUser.name.slice(0, 2).toUpperCase()}
              style={[styles.avatar, { backgroundColor: isAdmin ? '#16A34A' : '#0369A1' }]}
            />
            <View style={styles.accountInfo}>
              <View style={styles.nameRow}>
                <Text variant="titleLarge" style={styles.userName}>{currentUser.name}</Text>
                <View style={[styles.roleBadge, { backgroundColor: isAdmin ? '#DCFCE7' : '#DBEAFE' }]}>
                  <Text variant="labelSmall" style={[styles.roleText, { color: isAdmin ? '#14532D' : '#1E3A5F' }]}>
                    {isAdmin ? '⚙ Admin' : '👤 User'}
                  </Text>
                </View>
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {currentUser.email}
              </Text>
            </View>

            {/* Stat chips */}
            <View style={styles.statsRow}>
              <View style={[styles.statChip, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text variant="headlineSmall" style={[styles.statNumber, { color: theme.colors.primary }]}>
                  {shoeCount}
                </Text>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Shoes</Text>
              </View>
              <View style={[styles.statChip, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text variant="headlineSmall" style={[styles.statNumber, { color: theme.colors.primary }]}>
                  {orderCount}
                </Text>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Orders</Text>
              </View>
            </View>
          </View>
        </Surface>

        <Button
          mode="outlined"
          onPress={() => setLogOutDialogVisible(true)}
          style={styles.logoutButton}
          contentStyle={styles.buttonContent}
        >
          Log Out
        </Button>

        <Divider />

        <View style={styles.section}>
          <Text variant="titleSmall" style={styles.sectionTitle}>App Data</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {shoeCount} shoes in catalog · {orderCount} orders placed
          </Text>
          <Button
            mode="outlined"
            textColor={theme.colors.error}
            onPress={() => setResetDialogVisible(true)}
            style={styles.dangerButton}
          >
            Reset app data
          </Button>
        </View>

        <Divider />

        <View style={styles.section}>
          <Text variant="titleSmall" style={styles.sectionTitle}>About</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Shoe Cart is a React Native sample app. Accounts and data are stored locally on
            this device with redux-persist — no backend is used, so passwords are hashed on-device
            only and aren&apos;t verified by a server.
          </Text>
        </View>
      </View>

      <ConfirmDialog
        visible={logOutDialogVisible}
        title="Log out"
        message="Are you sure you want to log out?"
        confirmLabel="Log Out"
        destructive
        onDismiss={() => setLogOutDialogVisible(false)}
        onConfirm={() => {
          setLogOutDialogVisible(false);
          dispatch(logOut());
        }}
      />

      <ConfirmDialog
        visible={resetDialogVisible}
        title="Reset app data"
        message="This clears the shoe catalog, cart, orders, and accounts stored on this device (including your login) and restores the sample catalog."
        confirmLabel="Reset"
        destructive
        onDismiss={() => setResetDialogVisible(false)}
        onConfirm={async () => {
          setResetDialogVisible(false);
          await persistor.purge();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    paddingTop: WebTopBarInset + Spacing.four,
    gap: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  pageTitle: {
    fontWeight: '800',
  },
  userCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardAccent: {
    height: 8,
  },
  cardBody: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  avatar: {},
  accountInfo: {
    gap: Spacing.one,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  userName: {
    fontWeight: '800',
  },
  roleBadge: {
    borderRadius: 12,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  roleText: {
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statChip: {
    flex: 1,
    borderRadius: 14,
    padding: Spacing.three,
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    fontWeight: '800',
  },
  logoutButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: Spacing.one,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dangerButton: {
    borderRadius: 12,
  },
});
