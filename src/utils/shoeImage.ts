import type { ImageSourcePropType } from 'react-native';

import { seedShoeImages } from '@/constants/seedShoeImages';
import { Shoe } from '@/types';

export function getShoeImage(shoe: Pick<Shoe, 'id' | 'image'>): ImageSourcePropType | undefined {
  return shoe.image ?? seedShoeImages[shoe.id];
}
