import { Stack, useLocalSearchParams } from 'expo-router';

import { ShoeFormScreen } from '@/screens/ShoeFormScreen';

export default function ShoeFormRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = id !== 'new';

  return (
    <>
      <Stack.Screen options={{ title: isEditing ? 'Edit Shoe' : 'Add Shoe' }} />
      <ShoeFormScreen shoeId={id} />
    </>
  );
}
