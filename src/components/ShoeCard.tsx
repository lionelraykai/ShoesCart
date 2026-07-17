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
    <Card mode="elevated" onPress={onPress} style={styles.card}>
      {image ? (
        <View style={[styles.cover, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Image source={image} style={styles.coverImage} contentFit="contain" />
        </View>
      ) : (
        <View
          style={[styles.placeholder, { backgroundColor: theme.colors.surfaceVariant }]}
          testID="shoe-image-placeholder">
          <Icon source="shoe-sneaker" size={40} color={theme.colors.onSurfaceVariant} />
        </View>
      )}
      <Card.Content style={styles.content}>
        <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {shoe.brand}
        </Text>
        <Text variant="titleMedium" numberOfLines={1}>
          {shoe.name}
        </Text>
        <View style={styles.metaRow}>
          <Text variant="titleSmall" style={{ color: theme.colors.primary }}>
            {formatPrice(shoe.price)}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {shoe.sizes.length} size{shoe.sizes.length === 1 ? '' : 's'} available
          </Text>
        </View>
      </Card.Content>
      {actions ? <Card.Actions>{actions}</Card.Actions> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  cover: {
    aspectRatio: 4 / 3,
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    aspectRatio: 4 / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: Spacing.half,
    paddingTop: Spacing.two,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
});
