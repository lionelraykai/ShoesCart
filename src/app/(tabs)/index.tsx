import { AdminShoesScreen } from '@/screens/AdminShoesScreen';
import { ShopScreen } from '@/screens/ShopScreen';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/selectors';

export default function IndexTab() {
  const currentUser = useAppSelector(selectCurrentUser);
  return currentUser?.role === 'admin' ? <AdminShoesScreen /> : <ShopScreen />;
}
