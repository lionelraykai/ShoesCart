import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Text } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { ShoeCard } from '@/components/ShoeCard';
import { BottomTabInset, MaxContentWidth, Spacing, WebTopBarInset } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';

export function ShopScreen() {
  const router = useRouter();
  const shoes = useAppSelector((state) => state.shoes.items);
  const [query, setQuery] = useState('');
  const { width } = useWindowDimensions();
  const numColumns = width >= 900 ? 3 : width >= 560 ? 2 : 1;

  const filteredShoes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return shoes;
    return shoes.filter(
      (shoe) =>
        shoe.brand.toLowerCase().includes(normalized) ||
        shoe.name.toLowerCase().includes(normalized)
    );
  }, [shoes, query]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Shop</Text>
        <Searchbar
          placeholder="Search by brand or name"
          value={query}
          onChangeText={setQuery}
          style={styles.searchbar}
        />
      </View>
      <FlatList
        key={numColumns}
        data={filteredShoes}
        keyExtractor={(shoe) => shoe.id}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ShoeCard shoe={item} onPress={() => router.push(`/shoe/${item.id}`)} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="shoe-sneaker"
            title="No shoes found"
            message="Try a different search, or check back later."
          />
        }
      />
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
    gap: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  searchbar: {
    elevation: 0,
  },
  row: {
    gap: Spacing.three,
  },
  cardWrapper: {
    flex: 1,
  },
  listContent: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
});
