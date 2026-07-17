import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/selectors';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const currentUser = useAppSelector(selectCurrentUser);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{isAdmin ? 'Manage' : 'Shop'}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={isAdmin ? { default: 'wrench', selected: 'wrench.fill' } : { default: 'bag', selected: 'bag.fill' }}
          md={isAdmin ? 'inventory_2' : 'storefront'}
        />
      </NativeTabs.Trigger>

      {!isAdmin && (
        <NativeTabs.Trigger name="cart">
          <NativeTabs.Trigger.Label>Cart</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={{ default: 'cart', selected: 'cart.fill' }} md="shopping_cart" />
        </NativeTabs.Trigger>
      )}

      <NativeTabs.Trigger name="orders">
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'list.bullet.rectangle', selected: 'list.bullet.rectangle.fill' }}
          md="receipt_long"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md="person"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
