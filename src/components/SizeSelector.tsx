import { StyleSheet, View } from 'react-native';
import { Chip } from 'react-native-paper';

import { Spacing } from '@/constants/theme';

interface SizeSelectorProps {
  sizes: number[];
  selected: number | null;
  onSelect: (size: number) => void;
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <View style={styles.row}>
      {sizes.map((size) => (
        <Chip
          key={size}
          mode={selected === size ? 'flat' : 'outlined'}
          selected={selected === size}
          onPress={() => onSelect(size)}>
          {size}
        </Chip>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
