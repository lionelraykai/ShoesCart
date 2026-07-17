import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, Button, Divider, Text, useTheme } from 'react-native-paper';
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <Text variant="headlineSmall">Profile</Text>

        <View style={styles.accountRow}>
          <Avatar.Text size={48} label={currentUser.name.slice(0, 2).toUpperCase()} />
          <View style={styles.accountInfo}>
            <View style={styles.nameRow}>
              <Text variant="titleMedium">{currentUser.name}</Text>
              <Badge style={currentUser.role === 'admin' ? styles.adminBadge : styles.userBadge}>
                {currentUser.role === 'admin' ? 'Admin' : 'User'}
              </Badge>
            </View>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {currentUser.email}
            </Text>
          </View>
        </View>

        <Button mode="outlined" onPress={() => setLogOutDialogVisible(true)}>
          Log Out
        </Button>

        <Divider />

        <View style={styles.section}>
          <Text variant="titleSmall">App data</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {shoeCount} shoes in catalog · {orderCount} orders placed
          </Text>
          <Button mode="outlined" textColor={theme.colors.error} onPress={() => setResetDialogVisible(true)}>
            Reset app data
          </Button>
        </View>

        <Divider />

        <View style={styles.section}>
          <Text variant="titleSmall">About</Text>
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
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  accountInfo: {
    gap: Spacing.half,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  adminBadge: {
    backgroundColor: '#16A34A',
  },
  userBadge: {
    backgroundColor: '#6B7280',
  },
  section: {
    gap: Spacing.two,
  },
});
