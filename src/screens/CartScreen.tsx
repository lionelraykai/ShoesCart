import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Icon,
  IconButton,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { QuantityStepper } from '@/components/QuantityStepper';
import { BottomTabInset, Spacing, WebTopBarInset } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeFromCart, updateQuantity } from '@/store/slices/cartSlice';
import { formatPrice } from '@/utils/currency';
import { getShoeImage } from '@/utils/shoeImage';

export function CartScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  
  const cartItems = useAppSelector((state) => state.cart.items);
  const shoes = useAppSelector((state) => state.shoes.items);

  const rows = useMemo(
    () =>
      cartItems.map((item) => ({
        cartItem: item,
        shoe: shoes.find((shoe) => shoe.id === item.shoeId),
      })),
    [cartItems, shoes]
  );

  const total = rows.reduce((sum, row) => sum + (row.shoe?.price ?? 0) * row.cartItem.quantity, 0);

  // ── Delete confirmation ──
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState('');

  function confirmDelete(id: string, name: string) {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
  }

  function handleDelete() {
    if (deleteTargetId) dispatch(removeFromCart(deleteTargetId));
    setDeleteTargetId(null);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Text variant="headlineSmall" style={styles.header}>My Cart</Text>

      <FlatList
        data={rows}
        keyExtractor={(row) => row.cartItem.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          if (!item.shoe) return null;
          const image = getShoeImage(item.shoe);
          return (
            <Surface style={styles.card} elevation={1}>
              {image ? (
                <Image
                  source={image}
                  style={[styles.thumbnail, { backgroundColor: theme.colors.surfaceVariant }]}
                  contentFit="contain"
                />
              ) : (
                <View style={[styles.thumbnailPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Icon source="shoe-sneaker" size={28} color={theme.colors.onSurfaceVariant} />
                </View>
              )}
              <View style={styles.rowDetails}>
                <Text variant="titleSmall" numberOfLines={1} style={styles.shoeName}>
                  {item.shoe.name}
                </Text>
                <Text variant="labelSmall" style={[styles.brandLabel, { color: theme.colors.primary }]}>
                  {item.shoe.brand.toUpperCase()}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Size {item.cartItem.size}
                </Text>
                <View style={styles.rowActions}>
                  <QuantityStepper
                    quantity={item.cartItem.quantity}
                    onChange={(quantity) =>
                      dispatch(updateQuantity({ id: item.cartItem.id, quantity }))
                    }
                  />
                  <IconButton
                    icon="delete-outline"
                    size={20}
                    iconColor={theme.colors.error}
                    onPress={() => confirmDelete(item.cartItem.id, item.shoe!.name)}
                  />
                </View>
              </View>
              <Text variant="titleSmall" style={[styles.itemTotal, { color: theme.colors.primary }]}>
                {formatPrice(item.shoe.price * item.cartItem.quantity)}
              </Text>
            </Surface>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="cart-outline"
            title="Your cart is empty"
            message="Browse the shop and add a pair you like."
          />
        }
      />

      {rows.length > 0 && (
        <View style={[styles.footer, { borderTopColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}>
          <View style={styles.totalRow}>
            <Text variant="titleMedium" style={styles.totalLabel}>Order Total</Text>
            <Text variant="headlineSmall" style={[styles.totalAmount, { color: theme.colors.primary }]}>
              {formatPrice(total)}
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={() => router.push('/checkout')}
            style={styles.placeOrderButton}
            contentStyle={styles.placeOrderContent}
            labelStyle={styles.placeOrderLabel}
            icon="arrow-right"
          >
            Proceed to Checkout
          </Button>
        </View>
      )}

      {/* ── Delete confirmation ─────────────────────────────── */}
      <ConfirmDialog
        visible={!!deleteTargetId}
        title="Remove item?"
        message={`Remove "${deleteTargetName}" from your cart?`}
        confirmLabel="Remove"
        destructive
        onDismiss={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: WebTopBarInset + Spacing.two,
    paddingBottom: Spacing.two,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.two,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
    borderRadius: 16,
    padding: Spacing.three,
  },
  thumbnail: { width: 80, height: 80, borderRadius: 12 },
  thumbnailPlaceholder: {
    width: 80, height: 80, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  rowDetails: { flex: 1, gap: 2 },
  shoeName: { fontWeight: '700' },
  brandLabel: { fontWeight: '600', letterSpacing: 0.5 },
  rowActions: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.one },
  itemTotal: { fontWeight: '700', alignSelf: 'flex-start' },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontWeight: '600' },
  totalAmount: { fontWeight: '800' },
  placeOrderButton: { borderRadius: 14 },
  placeOrderContent: { paddingVertical: Spacing.one },
  placeOrderLabel: { fontSize: 16, fontWeight: '700' },
});
