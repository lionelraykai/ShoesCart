import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';

import { OrdersTable } from '@/components/OrdersTable';
import { Spacing, WebTopBarInset } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/selectors';

export function OrdersScreen() {
  const allOrders = useAppSelector((state) => state.orders.items);
  const users = useAppSelector((state) => state.auth.users);
  const currentUser = useAppSelector(selectCurrentUser);
  const theme = useTheme();
  const isAdmin = currentUser?.role === 'admin';

  const orders = useMemo(
    () => (isAdmin ? allOrders : allOrders.filter((order) => order.userId === currentUser?.id)),
    [allOrders, isAdmin, currentUser?.id]
  );

  function getCustomerName(order: { userId: string }) {
    return users.find((user) => user.id === order.userId)?.name ?? 'Deleted account';
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          {isAdmin ? 'All Orders' : 'My Orders'}
        </Text>
        {orders.length > 0 && (
          <View style={[styles.countBadge, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text variant="labelSmall" style={[styles.countText, { color: theme.colors.onPrimaryContainer }]}>
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </Text>
          </View>
        )}
      </View>
      <OrdersTable
        orders={orders}
        emptyTitle="No orders yet"
        emptyMessage={
          isAdmin
            ? 'Orders placed by shoppers will show up here.'
            : "Orders you place will show up here once you've checked out."
        }
        getCustomerName={isAdmin ? getCustomerName : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: WebTopBarInset + Spacing.two,
    paddingBottom: Spacing.two,
  },
  title: {
    fontWeight: '800',
  },
  countBadge: {
    borderRadius: 12,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  countText: {
    fontWeight: '700',
  },
});
