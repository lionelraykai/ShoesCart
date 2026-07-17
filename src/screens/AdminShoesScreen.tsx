import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FAB, IconButton, Text } from 'react-native-paper';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { ShoeCard } from '@/components/ShoeCard';
import { BottomTabInset, MaxContentWidth, Spacing, WebTopBarInset } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteShoe } from '@/store/slices/shoesSlice';

export function AdminShoesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const shoes = useAppSelector((state) => state.shoes.items);
  const { width } = useWindowDimensions();
  const numColumns = width >= 900 ? 3 : width >= 560 ? 2 : 1;

  const [pendingDelete, setPendingDelete] = useState<{ id: string; label: string } | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Text variant="headlineSmall" style={styles.header}>
        Manage Shoes
      </Text>
      <FlatList
        key={numColumns}
        data={shoes}
        keyExtractor={(shoe) => shoe.id}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ShoeCard
              shoe={item}
              onPress={() => router.push(`/admin/${item.id}`)}
              actions={[
                <IconButton
                  key="edit"
                  icon="pencil-outline"
                  onPress={() => router.push(`/admin/${item.id}`)}
                />,
                <IconButton
                  key="delete"
                  icon="delete-outline"
                  onPress={() => setPendingDelete({ id: item.id, label: `${item.brand} ${item.name}` })}
                />,
              ]}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="shoe-sneaker"
            title="No shoes yet"
            message="Tap the + button to add your first shoe to the catalog."
          />
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/admin/new')} label="Add Shoe" />

      <ConfirmDialog
        visible={pendingDelete !== null}
        title="Delete shoe"
        message={`Remove "${pendingDelete?.label}" from the catalog?`}
        confirmLabel="Delete"
        destructive
        onDismiss={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) dispatch(deleteShoe(pendingDelete.id));
          setPendingDelete(null);
        }}
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
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
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
    paddingBottom: BottomTabInset + Spacing.six,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  fab: {
    position: 'absolute',
    right: Spacing.four,
    bottom: BottomTabInset + Spacing.three,
  },
});
