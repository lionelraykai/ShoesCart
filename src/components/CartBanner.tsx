import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Icon, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/selectors';
import { formatPrice } from '@/utils/currency';

export function CartBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const currentUser = useAppSelector(selectCurrentUser);
  const cartItems = useAppSelector((state) => state.cart.items);
  const shoes = useAppSelector((state) => state.shoes.items);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => {
    const shoe = shoes.find((s) => s.id === item.shoeId);
    return sum + (shoe?.price ?? 0) * item.quantity;
  }, 0);

  if (currentUser?.role !== 'user' || itemCount === 0 || pathname === '/cart') {
    return null;
  }

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Surface style={[styles.pill, { backgroundColor: theme.colors.primary }]} elevation={4}>
        <TouchableRipple onPress={() => router.push('/cart')} style={styles.ripple} borderless>
          <View style={styles.content}>
            <Icon source="cart" size={20} color={theme.colors.onPrimary} />
            <Text variant="labelLarge" style={{ color: theme.colors.onPrimary }} numberOfLines={1}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'} · {formatPrice(total)} — View Cart
            </Text>
            <Icon source="chevron-right" size={18} color={theme.colors.onPrimary} />
          </View>
        </TouchableRipple>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BottomTabInset + Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  pill: {
    borderRadius: Spacing.five,
    maxWidth: MaxContentWidth,
    width: '100%',
    overflow: 'hidden',
  },
  ripple: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});
