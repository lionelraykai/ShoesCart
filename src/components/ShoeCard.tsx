import { Image } from 'expo-image';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Icon, Text, useTheme } from 'react-native-paper';

import { Spacing } from '@/constants/theme';
import { Shoe } from '@/types';
import { formatPrice } from '@/utils/currency';
import { getShoeImage } from '@/utils/shoeImage';

interface ShoeCardProps {
  shoe: Shoe;
  onPress?: () => void;
  actions?: ReactNode;
}

export function ShoeCard({ shoe, onPress, actions }: ShoeCardProps) {
  const theme = useTheme();
  const image = getShoeImage(shoe);

  return (
    <Card mode="elevated" onPress={onPress} style={styles.card} elevation={2}>
      {image ? (
        <View style={[styles.cover, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Image source={image} style={styles.coverImage} contentFit="contain" />
          <View style={styles.imageOverlay} />
          <View style={styles.priceBadge}>
            <Text variant="labelMedium" style={styles.priceBadgeText}>
              {formatPrice(shoe.price)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.placeholder, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Icon source="shoe-sneaker" size={48} color={theme.colors.onSurfaceVariant} />
          <View style={styles.priceBadge}>
            <Text variant="labelMedium" style={styles.priceBadgeText}>
              {formatPrice(shoe.price)}
            </Text>
          </View>
        </View>
      )}
      <Card.Content style={styles.content}>
        <Text variant="labelSmall" style={[styles.brand, { color: theme.colors.primary }]}>
          {shoe.brand.toUpperCase()}
        </Text>
        <Text variant="titleMedium" numberOfLines={1} style={styles.name}>
          {shoe.name}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {shoe.sizes.length} size{shoe.sizes.length === 1 ? '' : 's'}
        </Text>
      </Card.Content>
      {actions ? <Card.Actions>{actions}</Card.Actions> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: 'hidden',
  },
  cover: {
    aspectRatio: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  priceBadge: {
    position: 'absolute',
    bottom: Spacing.two,
    right: Spacing.two,
    backgroundColor: '#16A34A',
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  priceBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  placeholder: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  content: {
    gap: 2,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  brand: {
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  name: {
    fontWeight: '700',
  },
});
