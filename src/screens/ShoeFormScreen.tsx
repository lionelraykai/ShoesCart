import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, HelperText, Icon, Text, TextInput, useTheme } from 'react-native-paper';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SizeMultiSelect } from '@/components/SizeMultiSelect';
import { Spacing } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addShoe, deleteShoe, updateShoe } from '@/store/slices/shoesSlice';
import { seedShoeImages } from '@/constants/seedShoeImages';

interface ShoeFormScreenProps {
  shoeId: string;
}

interface FormErrors {
  brand?: string;
  name?: string;
  price?: string;
  sizes?: string;
}

export function ShoeFormScreen({ shoeId }: ShoeFormScreenProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isEditing = shoeId !== 'new';
  const existingShoe = useAppSelector((state) =>
    isEditing ? state.shoes.items.find((shoe) => shoe.id === shoeId) : undefined
  );

  const [brand, setBrand] = useState(existingShoe?.brand ?? '');
  const [name, setName] = useState(existingShoe?.name ?? '');
  const [price, setPrice] = useState(existingShoe ? String(existingShoe.price) : '');
  const [sizes, setSizes] = useState<number[]>(existingShoe?.sizes ?? []);
  // Persist-only: undefined here for an untouched seed shoe, so saving without picking a
  // new photo doesn't write the bundled seed asset into (persisted) Redux state.
  const [image, setImage] = useState<ImageSourcePropType | undefined>(existingShoe?.image);
  const [errors, setErrors] = useState<FormErrors>({});
  const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const displayImage = image ?? (existingShoe ? seedShoeImages[existingShoe.id] : undefined);

  if (isEditing && !existingShoe) {
    return (
      <View style={styles.centered}>
        <Text variant="titleMedium">This shoe no longer exists.</Text>
      </View>
    );
  }

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setPermissionDialogVisible(true);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setImage({ uri: result.assets[0].uri });
    }
  }

  function toggleSize(size: number) {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!brand.trim()) nextErrors.brand = 'Brand is required';
    if (!name.trim()) nextErrors.name = 'Name is required';
    const priceValue = Number(price);
    if (!price.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      nextErrors.price = 'Enter a valid price greater than 0';
    }
    if (sizes.length === 0) nextErrors.sizes = 'Select at least one size';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const priceValue = Number(price);
    const sortedSizes = [...sizes].sort((a, b) => a - b);

    if (isEditing && existingShoe) {
      dispatch(
        updateShoe({
          ...existingShoe,
          brand: brand.trim(),
          name: name.trim(),
          price: priceValue,
          sizes: sortedSizes,
          image,
        })
      );
    } else {
      dispatch(
        addShoe({ brand: brand.trim(), name: name.trim(), price: priceValue, sizes: sortedSizes, image })
      );
    }
    router.back();
  }

  function handleDelete() {
    if (!existingShoe) return;
    setDeleteDialogVisible(true);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={handlePickImage}>
          {displayImage ? (
            <Image
              source={displayImage}
              style={[styles.image, { backgroundColor: theme.colors.surfaceVariant }]}
              contentFit="contain"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Icon source="camera-plus-outline" size={32} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Add photo (optional)
              </Text>
            </View>
          )}
        </Pressable>

        <View style={styles.field}>
          <TextInput label="Brand" value={brand} onChangeText={setBrand} mode="outlined" error={!!errors.brand} />
          {errors.brand ? <HelperText type="error">{errors.brand}</HelperText> : null}
        </View>

        <View style={styles.field}>
          <TextInput label="Name" value={name} onChangeText={setName} mode="outlined" error={!!errors.name} />
          {errors.name ? <HelperText type="error">{errors.name}</HelperText> : null}
        </View>

        <View style={styles.field}>
          <TextInput
            label="Price"
            value={price}
            onChangeText={setPrice}
            mode="outlined"
            keyboardType="decimal-pad"
            left={<TextInput.Affix text="$" />}
            error={!!errors.price}
          />
          {errors.price ? <HelperText type="error">{errors.price}</HelperText> : null}
        </View>

        <View style={styles.field}>
          <Text variant="titleSmall" style={styles.sizesLabel}>
            Available sizes
          </Text>
          <SizeMultiSelect selectedSizes={sizes} onToggle={toggleSize} />
          {errors.sizes ? <HelperText type="error">{errors.sizes}</HelperText> : null}
        </View>

        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          {isEditing ? 'Save Changes' : 'Add Shoe'}
        </Button>

        {isEditing ? (
          <Button
            mode="outlined"
            textColor={theme.colors.error}
            onPress={handleDelete}
            style={styles.deleteButton}>
            Delete Shoe
          </Button>
        ) : null}
      </ScrollView>

      <ConfirmDialog
        visible={permissionDialogVisible}
        title="Permission needed"
        message="Allow photo library access to add a shoe image."
        confirmLabel="OK"
        hideCancel
        onDismiss={() => setPermissionDialogVisible(false)}
        onConfirm={() => setPermissionDialogVisible(false)}
      />

      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Delete shoe"
        message={`Remove "${existingShoe?.brand} ${existingShoe?.name}" from the catalog?`}
        confirmLabel="Delete"
        destructive
        onDismiss={() => setDeleteDialogVisible(false)}
        onConfirm={() => {
          if (existingShoe) dispatch(deleteShoe(existingShoe.id));
          setDeleteDialogVisible(false);
          router.back();
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.five,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  image: {
    aspectRatio: 4 / 3,
    borderRadius: Spacing.three,
  },
  imagePlaceholder: {
    aspectRatio: 4 / 3,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  field: {
    gap: Spacing.half,
  },
  sizesLabel: {
    marginBottom: Spacing.one,
  },
  saveButton: {
    marginTop: Spacing.two,
    borderRadius: Spacing.two,
  },
  deleteButton: {
    borderRadius: Spacing.two,
  },
});
