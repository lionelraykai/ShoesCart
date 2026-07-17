import { Image } from 'expo-image';
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
  // 2 columns on phones, 3 on tablets/wide screens
  const numColumns = width >= 900 ? 3 : width >= 560 ? 2 : 2;

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
      <FlatList
        key={numColumns}
        data={filteredShoes}
        keyExtractor={(shoe) => shoe.id}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Hero banner */}
            <View style={styles.heroBanner}>
              <View style={styles.heroTextBlock}>
                <Text variant="headlineMedium" style={styles.heroTitle}>
                  Step Into{'\n'}Your Style
                </Text>
                <Text variant="bodyMedium" style={styles.heroSubtitle}>
                  Discover premium footwear
                </Text>
              </View>
              <Image
                source={require('../../assets/images/app-logo.png')}
                style={styles.heroLogo}
                contentFit="contain"
              />
            </View>

            {/* Search */}
            <Searchbar
              placeholder="Search brand or name..."
              value={query}
              onChangeText={setQuery}
              style={styles.searchbar}
              inputStyle={styles.searchInput}
            />

            {filteredShoes.length > 0 && (
              <Text variant="labelMedium" style={styles.resultCount}>
                {filteredShoes.length} {filteredShoes.length === 1 ? 'shoe' : 'shoes'}
              </Text>
            )}
          </View>
        }
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
  headerContainer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingTop: WebTopBarInset + Spacing.two,
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  heroBanner: {
    marginHorizontal: Spacing.three,
    borderRadius: 20,
    backgroundColor: '#14532D',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroTextBlock: {
    flex: 1,
    gap: Spacing.one,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    lineHeight: 32,
  },
  heroSubtitle: {
    color: '#BBF7D0',
  },
  heroLogo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
  },
  searchbar: {
    marginHorizontal: Spacing.three,
    borderRadius: 14,
    elevation: 0,
  },
  searchInput: {
    fontSize: 14,
  },
  resultCount: {
    marginHorizontal: Spacing.three,
    color: '#6B7280',
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
