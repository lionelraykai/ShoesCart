import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, Icon, Snackbar, Text, useTheme } from 'react-native-paper';

import { QuantityStepper } from '@/components/QuantityStepper';
import { SizeSelector } from '@/components/SizeSelector';
import { Spacing } from '@/constants/theme';
import { addToCart } from '@/store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatPrice } from '@/utils/currency';
import { getShoeImage } from '@/utils/shoeImage';

interface ShoeDetailScreenProps {
  shoeId: string;
}

export function ShoeDetailScreen({ shoeId }: ShoeDetailScreenProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const shoe = useAppSelector((state) => state.shoes.items.find((item) => item.id === shoeId));
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  if (!shoe) {
    return (
      <View style={styles.centered}>
        <Text variant="titleMedium">This shoe is no longer available.</Text>
      </View>
    );
  }

  function handleAddToCart() {
    if (!shoe || selectedSize === null) return;
    dispatch(addToCart({ shoeId: shoe.id, size: selectedSize, quantity }));
    setConfirmationVisible(true);
  }

  const image = getShoeImage(shoe);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero image */}
        {image ? (
          <View style={[styles.imageWrapper, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Image
              source={image}
              style={styles.image}
              contentFit="contain"
            />
          </View>
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Icon source="shoe-sneaker" size={80} color={theme.colors.onSurfaceVariant} />
          </View>
        )}

        <View style={styles.details}>
          {/* Brand chip */}
          <Chip
            compact
            style={[styles.brandChip, { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={[styles.brandChipText, { color: theme.colors.onPrimaryContainer }]}
          >
            {shoe.brand}
          </Chip>

          <Text variant="headlineSmall" style={styles.shoeName}>{shoe.name}</Text>

          <Text variant="headlineMedium" style={[styles.price, { color: theme.colors.primary }]}>
            {formatPrice(shoe.price)}
          </Text>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

          <View style={styles.section}>
            <Text variant="titleSmall" style={styles.sectionLabel}>Select Size</Text>
            <SizeSelector sizes={shoe.sizes} selected={selectedSize} onSelect={setSelectedSize} />
          </View>

          <View style={styles.section}>
            <Text variant="titleSmall" style={styles.sectionLabel}>Quantity</Text>
            <QuantityStepper quantity={quantity} onChange={setQuantity} />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}>
        {selectedSize !== null && (
          <Text variant="bodySmall" style={[styles.totalLabel, { color: theme.colors.onSurfaceVariant }]}>
            Total: {formatPrice(shoe.price * quantity)}
          </Text>
        )}
        <Button
          mode="contained"
          disabled={selectedSize === null}
          onPress={handleAddToCart}
          style={styles.addButton}
          contentStyle={styles.addButtonContent}
          labelStyle={styles.addButtonLabel}
        >
          {selectedSize === null ? 'Select a Size First' : 'Add to Cart'}
        </Button>
      </View>

      <Snackbar
        visible={confirmationVisible}
        onDismiss={() => setConfirmationVisible(false)}
        duration={2500}
        action={{ label: 'View Cart', onPress: () => router.push('/cart') }}>
        Added to cart ✓
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.five,
  },
  scrollContent: {
    paddingBottom: Spacing.six,
  },
  imageWrapper: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  imagePlaceholder: {
    aspectRatio: 4 / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  brandChip: {
    alignSelf: 'flex-start',
    borderRadius: 20,
  },
  brandChipText: {
    fontWeight: '700',
    letterSpacing: 0.5,
    fontSize: 12,
  },
  shoeName: {
    fontWeight: '800',
    marginTop: -Spacing.one,
  },
  price: {
    fontWeight: '800',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.one,
  },
  section: {
    gap: Spacing.two,
  },
  sectionLabel: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  totalLabel: {
    textAlign: 'center',
  },
  addButton: {
    borderRadius: 14,
  },
  addButtonContent: {
    paddingVertical: Spacing.one,
  },
  addButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
