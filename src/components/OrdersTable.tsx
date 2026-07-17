import { FlatList, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { DataTable, Surface, Text, useTheme } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { Order } from '@/types';
import { formatPrice } from '@/utils/currency';

const WIDE_LAYOUT_BREAKPOINT = 700;

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function summarizeItems(order: Order) {
  return order.items
    .map((item) => `${item.brand} ${item.name} (size ${item.size}) ×${item.quantity}`)
    .join('\n');
}

function getItemCount(order: Order) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

interface OrdersTableProps {
  orders: Order[];
  emptyTitle: string;
  emptyMessage: string;
  getCustomerName?: (order: Order) => string;
}

export function OrdersTable({ orders, emptyTitle, emptyMessage, getCustomerName }: OrdersTableProps) {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const isWide = width >= WIDE_LAYOUT_BREAKPOINT;

  if (orders.length === 0) {
    return <EmptyState icon="receipt-text-outline" title={emptyTitle} message={emptyMessage} />;
  }

  if (isWide) {
    return (
      <ScrollView horizontal>
        <DataTable style={styles.table}>
          <DataTable.Header>
            <DataTable.Title style={styles.orderIdColumn}>Order</DataTable.Title>
            <DataTable.Title style={styles.dateColumn}>Date</DataTable.Title>
            {getCustomerName ? (
              <DataTable.Title style={styles.customerColumn}>Customer</DataTable.Title>
            ) : null}
            <DataTable.Title style={styles.itemsColumn}>Items</DataTable.Title>
            <DataTable.Title numeric style={styles.totalColumn}>
              Total
            </DataTable.Title>
          </DataTable.Header>
          {orders.map((order) => (
            <DataTable.Row key={order.id}>
              <DataTable.Cell style={styles.orderIdColumn}>
                #{order.id.slice(-6).toUpperCase()}
              </DataTable.Cell>
              <DataTable.Cell style={styles.dateColumn}>
                {formatDate(order.placedAt)}
              </DataTable.Cell>
              {getCustomerName ? (
                <DataTable.Cell style={styles.customerColumn}>
                  {getCustomerName(order)}
                </DataTable.Cell>
              ) : null}
              <DataTable.Cell style={styles.itemsColumn}>
                <Text variant="bodySmall">{summarizeItems(order)}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric style={styles.totalColumn}>
                {formatPrice(order.total)}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(order) => order.id}
      contentContainerStyle={styles.cardList}
      renderItem={({ item: order }) => (
        <Surface style={styles.card} elevation={1}>
          {/* Order ID + Total row */}
          <View style={styles.cardHeaderRow}>
            <View style={styles.orderIdWrap}>
              <Text variant="labelSmall" style={[styles.orderIdLabel, { color: theme.colors.onSurfaceVariant }]}>
                ORDER
              </Text>
              <Text variant="titleMedium" style={styles.orderId}>
                #{order.id.slice(-6).toUpperCase()}
              </Text>
            </View>
            <View style={styles.totalWrap}>
              <Text variant="labelSmall" style={[styles.totalLabel, { color: theme.colors.onSurfaceVariant }]}>
                TOTAL
              </Text>
              <Text variant="titleMedium" style={[styles.totalAmount, { color: theme.colors.primary }]}>
                {formatPrice(order.total)}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

          {/* Date + customer */}
          <View style={styles.metaRow}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              🕐 {formatDate(order.placedAt)}
            </Text>
            {getCustomerName && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                👤 {getCustomerName(order)}
              </Text>
            )}
          </View>

          {/* Items count chip */}
          <View style={[styles.itemsChip, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {getItemCount(order)} item{getItemCount(order) !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Items detail */}
          <Text variant="bodySmall" style={[styles.itemsText, { color: theme.colors.onSurfaceVariant }]}>
            {summarizeItems(order)}
          </Text>
        </Surface>
      )}
    />
  );
}

const styles = StyleSheet.create({
  table: {
    minWidth: 640,
  },
  orderIdColumn: {
    flex: 0.8,
  },
  dateColumn: {
    flex: 1.2,
  },
  customerColumn: {
    flex: 1.2,
  },
  itemsColumn: {
    flex: 2,
  },
  totalColumn: {
    flex: 0.8,
  },
  cardList: {
    gap: Spacing.two,
    padding: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderIdWrap: {
    gap: 2,
  },
  orderIdLabel: {
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  orderId: {
    fontWeight: '800',
  },
  totalWrap: {
    gap: 2,
    alignItems: 'flex-end',
  },
  totalLabel: {
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  totalAmount: {
    fontWeight: '800',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  metaRow: {
    gap: 4,
  },
  itemsChip: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  itemsText: {
    lineHeight: 20,
  },
});
