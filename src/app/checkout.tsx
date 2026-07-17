import { Stack } from 'expo-router';
import { CheckoutScreen } from '@/screens/CheckoutScreen';

export default function CheckoutRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Checkout', presentation: 'modal' }} />
      <CheckoutScreen />
    </>
  );
}
