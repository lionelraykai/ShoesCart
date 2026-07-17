import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Icon, Snackbar, Text, useTheme } from 'react-native-paper';

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
        {image ? (
          <Image
            source={image}
            style={[styles.image, { backgroundColor: theme.colors.surfaceVariant }]}
            contentFit="contain"
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Icon source="shoe-sneaker" size={72} color={theme.colors.onSurfaceVariant} />
          </View>
        )}
        <View style={styles.details}>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            {shoe.brand}
          </Text>
          <Text variant="headlineSmall">{shoe.name}</Text>
          <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
            {formatPrice(shoe.price)}
          </Text>

          <View style={styles.section}>
            <Text variant="titleSmall">Select a size</Text>
            <SizeSelector sizes={shoe.sizes} selected={selectedSize} onSelect={setSelectedSize} />
          </View>

          <View style={styles.section}>
            <Text variant="titleSmall">Quantity</Text>
            <QuantityStepper quantity={quantity} onChange={setQuantity} />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.colors.outline }]}>
        <Button
          mode="contained"
          disabled={selectedSize === null}
          onPress={handleAddToCart}
          style={styles.addButton}>
          {selectedSize === null ? 'Select a size' : `Add to Cart · ${formatPrice(shoe.price * quantity)}`}
        </Button>
      </View>

      <Snackbar
        visible={confirmationVisible}
        onDismiss={() => setConfirmationVisible(false)}
        duration={2500}
        action={{ label: 'View Cart', onPress: () => router.push('/cart') }}>
        Added to cart
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
  image: {
    aspectRatio: 4 / 3,
  },
  imagePlaceholder: {
    aspectRatio: 4 / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    padding: Spacing.four,
    gap: Spacing.one,
  },
  section: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
  },
  addButton: {
    borderRadius: Spacing.two,
  },
});
