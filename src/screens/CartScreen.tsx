import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon, IconButton, Text, useTheme } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { QuantityStepper } from '@/components/QuantityStepper';
import { BottomTabInset, Spacing, WebTopBarInset } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/selectors';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import { placeOrder } from '@/store/slices/ordersSlice';
import { CartItem, OrderItem } from '@/types';
import { formatPrice } from '@/utils/currency';
import { getShoeImage } from '@/utils/shoeImage';

export function CartScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const cartItems = useAppSelector((state) => state.cart.items);
  const shoes = useAppSelector((state) => state.shoes.items);
  const currentUser = useAppSelector(selectCurrentUser);

  const rows = useMemo(
    () =>
      cartItems.map((item) => ({
        cartItem: item,
        shoe: shoes.find((shoe) => shoe.id === item.shoeId),
      })),
    [cartItems, shoes]
  );

  const total = rows.reduce((sum, row) => sum + (row.shoe?.price ?? 0) * row.cartItem.quantity, 0);

  function handlePlaceOrder() {
    const orderItems: OrderItem[] = rows
      .filter((row): row is { cartItem: CartItem; shoe: NonNullable<typeof row.shoe> } =>
        Boolean(row.shoe)
      )
      .map(({ cartItem, shoe }) => ({
        shoeId: shoe.id,
        brand: shoe.brand,
        name: shoe.name,
        price: shoe.price,
        size: cartItem.size,
        quantity: cartItem.quantity,
      }));

    if (orderItems.length === 0 || !currentUser) return;

    dispatch(placeOrder({ userId: currentUser.id, items: orderItems }));
    dispatch(clearCart());
    router.push('/orders');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Text variant="headlineSmall" style={styles.header}>
        Cart
      </Text>
      <FlatList
        data={rows}
        keyExtractor={(row) => row.cartItem.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          if (!item.shoe) return null;
          const image = getShoeImage(item.shoe);
          return (
            <View style={styles.row}>
              {image ? (
                <Image
                  source={image}
                  style={[styles.thumbnail, { backgroundColor: theme.colors.surfaceVariant }]}
                  contentFit="contain"
                />
              ) : (
                <View
                  style={[styles.thumbnailPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Icon source="shoe-sneaker" size={24} color={theme.colors.onSurfaceVariant} />
                </View>
              )}
              <View style={styles.rowDetails}>
                <Text variant="titleSmall" numberOfLines={1}>
                  {item.shoe.brand} {item.shoe.name}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Size {item.cartItem.size} · {formatPrice(item.shoe.price)}
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
                    onPress={() => dispatch(removeFromCart(item.cartItem.id))}
                  />
                </View>
              </View>
              <Text variant="titleSmall">
                {formatPrice(item.shoe.price * item.cartItem.quantity)}
              </Text>
            </View>
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
        <View style={[styles.footer, { borderTopColor: theme.colors.outline }]}>
          <View style={styles.totalRow}>
            <Text variant="titleMedium">Total</Text>
            <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
              {formatPrice(total)}
            </Text>
          </View>
          <Button mode="contained" onPress={handlePlaceOrder} style={styles.placeOrderButton}>
            Place Order
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: WebTopBarInset + Spacing.two,
    paddingBottom: Spacing.two,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: Spacing.two,
  },
  thumbnailPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowDetails: {
    flex: 1,
    gap: Spacing.half,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeOrderButton: {
    borderRadius: Spacing.two,
  },
});
