import { FlatList, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Card, DataTable, Text, useTheme } from 'react-native-paper';

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
        <Card mode="outlined">
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeaderRow}>
              <Text variant="titleSmall">#{order.id.slice(-6).toUpperCase()}</Text>
              <Text variant="titleSmall" style={{ color: theme.colors.primary }}>
                {formatPrice(order.total)}
              </Text>
            </View>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {formatDate(order.placedAt)}
              {getCustomerName ? ` · ${getCustomerName(order)}` : ''}
            </Text>
            <Text variant="bodyMedium" style={styles.itemsText}>
              {summarizeItems(order)}
            </Text>
          </Card.Content>
        </Card>
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
    gap: Spacing.three,
    padding: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  cardContent: {
    gap: Spacing.one,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemsText: {
    marginTop: Spacing.one,
  },
});
