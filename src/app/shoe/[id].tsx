import { Stack, useLocalSearchParams } from 'expo-router';

import { ShoeDetailScreen } from '@/screens/ShoeDetailScreen';
import { useAppSelector } from '@/store/hooks';

export default function ShoeDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const shoe = useAppSelector((state) => state.shoes.items.find((item) => item.id === id));

  return (
    <>
      <Stack.Screen options={{ title: shoe ? `${shoe.brand} ${shoe.name}` : 'Shoe Details' }} />
      <ShoeDetailScreen shoeId={id} />
    </>
  );
}
