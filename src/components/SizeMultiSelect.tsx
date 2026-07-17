import { StyleSheet, View } from 'react-native';
import { Chip } from 'react-native-paper';

import { Spacing } from '@/constants/theme';

export const AVAILABLE_SIZE_RANGE = Array.from({ length: 8 }, (_, index) => index + 6); // 6..13

interface SizeMultiSelectProps {
  selectedSizes: number[];
  onToggle: (size: number) => void;
}

export function SizeMultiSelect({ selectedSizes, onToggle }: SizeMultiSelectProps) {
  return (
    <View style={styles.row}>
      {AVAILABLE_SIZE_RANGE.map((size) => {
        const isSelected = selectedSizes.includes(size);
        return (
          <Chip
            key={size}
            mode={isSelected ? 'flat' : 'outlined'}
            selected={isSelected}
            showSelectedCheck
            onPress={() => onToggle(size)}>
            {size}
          </Chip>
        );
      })}
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
