import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
}

export function QuantityStepper({ quantity, onChange, min = 1 }: QuantityStepperProps) {
  const theme = useTheme();

  return (
    <View style={[styles.row, { borderColor: theme.colors.outline }]}>
      <IconButton
        icon="minus"
        size={16}
        disabled={quantity <= min}
        onPress={() => onChange(quantity - 1)}
      />
      <Text variant="titleMedium" style={styles.value}>
        {quantity}
      </Text>
      <IconButton icon="plus" size={16} onPress={() => onChange(quantity + 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 24,
  },
  value: {
    minWidth: 24,
    textAlign: 'center',
  },
});
