import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Icon,
  RadioButton,
  Surface,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import { Spacing } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/selectors';
import { clearCart } from '@/store/slices/cartSlice';
import { placeOrder } from '@/store/slices/ordersSlice';
import { CartItem, OrderItem } from '@/types';
import { formatPrice } from '@/utils/currency';

// ─── Types ───────────────────────────────────────────────────────────────────

type CheckoutStep = 'address' | 'payment' | 'summary';

interface Address {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const EMPTY_ADDRESS: Address = {
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
};

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: 'credit-card-outline', detail: '**** **** **** 4242' },
  { id: 'upi', label: 'UPI', icon: 'qrcode-scan', detail: 'user@upi' },
  { id: 'cod', label: 'Cash on Delivery', icon: 'cash-multiple', detail: 'Pay when delivered' },
  { id: 'wallet', label: 'Wallet', icon: 'wallet-outline', detail: 'Balance: ₹2,500' },
];

export function CheckoutScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  
  const cartItems = useAppSelector((state) => state.cart.items);
  const shoes = useAppSelector((state) => state.shoes.items);
  const currentUser = useAppSelector(selectCurrentUser);

  const rows = useMemo(
    () =>
      cartItems.map((item) => ({
        cartItem: item,
        shoe: shoes.find((shoe) => shoe.id === item.shoeId),
      })),
    [cartItems, shoes]
  );

  const total = rows.reduce((sum, row) => sum + (row.shoe?.price ?? 0) * row.cartItem.quantity, 0);

  const [step, setStep] = useState<CheckoutStep>('address');

  // Address
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [addressErrors, setAddressErrors] = useState<Partial<Address>>({});

  // Payment
  const [selectedPayment, setSelectedPayment] = useState('cod');

  function validateAddress(): boolean {
    const errors: Partial<Address> = {};
    if (!address.fullName.trim()) errors.fullName = 'Required';
    if (!address.line1.trim()) errors.line1 = 'Required';
    if (!address.city.trim()) errors.city = 'Required';
    if (!address.state.trim()) errors.state = 'Required';
    if (!/^\d{6}$/.test(address.pincode.trim())) errors.pincode = '6-digit pincode';
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleNext() {
    if (step === 'address') {
      if (!validateAddress()) return;
      setStep('payment');
    } else if (step === 'payment') {
      setStep('summary');
    }
  }

  function handlePlaceOrder() {
    const orderItems: OrderItem[] = rows
      .filter((row): row is { cartItem: CartItem; shoe: NonNullable<typeof row.shoe> } =>
        Boolean(row.shoe)
      )
      .map(({ cartItem, shoe }) => ({
        shoeId: shoe.id,
        brand: shoe.brand,
        name: shoe.name,
        price: shoe.price,
        size: cartItem.size,
        quantity: cartItem.quantity,
      }));

    if (orderItems.length === 0 || !currentUser) return;

    dispatch(placeOrder({ userId: currentUser.id, items: orderItems, address, paymentMethod: selectedPayment }));
    dispatch(clearCart());
    
    // Navigate back to root and then to orders
    router.dismissAll();
    router.replace('/orders');
  }

  const STEPS: CheckoutStep[] = ['address', 'payment', 'summary'];
  const stepIndex = STEPS.indexOf(step);
  const stepLabels = ['Address', 'Payment', 'Review'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Step indicator */}
        <View style={styles.stepBar}>
          {stepLabels.map((label, i) => (
            <View key={label} style={styles.stepItem}>
              <View style={[
                styles.stepDot,
                {
                  backgroundColor: i <= stepIndex ? theme.colors.primary : theme.colors.surfaceVariant,
                  borderColor: i <= stepIndex ? theme.colors.primary : theme.colors.outline,
                },
              ]}>
                {i < stepIndex
                  ? <Icon source="check" size={12} color="#fff" />
                  : <Text style={[styles.stepDotText, { color: i <= stepIndex ? '#fff' : theme.colors.onSurfaceVariant }]}>{i + 1}</Text>
                }
              </View>
              <Text variant="labelSmall" style={{ color: i <= stepIndex ? theme.colors.primary : theme.colors.onSurfaceVariant, fontWeight: i === stepIndex ? '700' : '400' }}>
                {label}
              </Text>
              {i < stepLabels.length - 1 && (
                <View style={[styles.stepLine, { backgroundColor: i < stepIndex ? theme.colors.primary : theme.colors.outline }]} />
              )}
            </View>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* ── STEP 1: Address ── */}
          {step === 'address' && (
            <View style={styles.stepContent}>
              <Text variant="titleLarge" style={styles.stepTitle}>Delivery Address</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Where should we deliver your order?
              </Text>

              <View style={styles.formFields}>
                <TextInput
                  label="Full Name *"
                  value={address.fullName}
                  onChangeText={(v) => setAddress((a) => ({ ...a, fullName: v }))}
                  mode="outlined"
                  error={!!addressErrors.fullName}
                />
                {addressErrors.fullName ? <Text style={styles.fieldError}>{addressErrors.fullName}</Text> : null}

                <TextInput
                  label="Address Line 1 *"
                  value={address.line1}
                  onChangeText={(v) => setAddress((a) => ({ ...a, line1: v }))}
                  mode="outlined"
                  placeholder="House / Flat / Street"
                  error={!!addressErrors.line1}
                />
                {addressErrors.line1 ? <Text style={styles.fieldError}>{addressErrors.line1}</Text> : null}

                <TextInput
                  label="Address Line 2"
                  value={address.line2}
                  onChangeText={(v) => setAddress((a) => ({ ...a, line2: v }))}
                  mode="outlined"
                  placeholder="Area / Landmark (optional)"
                />

                <View style={styles.twoCol}>
                  <View style={styles.twoColItem}>
                    <TextInput
                      label="City *"
                      value={address.city}
                      onChangeText={(v) => setAddress((a) => ({ ...a, city: v }))}
                      mode="outlined"
                      error={!!addressErrors.city}
                    />
                    {addressErrors.city ? <Text style={styles.fieldError}>{addressErrors.city}</Text> : null}
                  </View>
                  <View style={styles.twoColItem}>
                    <TextInput
                      label="State *"
                      value={address.state}
                      onChangeText={(v) => setAddress((a) => ({ ...a, state: v }))}
                      mode="outlined"
                      error={!!addressErrors.state}
                    />
                    {addressErrors.state ? <Text style={styles.fieldError}>{addressErrors.state}</Text> : null}
                  </View>
                </View>

                <TextInput
                  label="Pincode *"
                  value={address.pincode}
                  onChangeText={(v) => setAddress((a) => ({ ...a, pincode: v }))}
                  mode="outlined"
                  keyboardType="number-pad"
                  maxLength={6}
                  error={!!addressErrors.pincode}
                />
                {addressErrors.pincode ? <Text style={styles.fieldError}>{addressErrors.pincode}</Text> : null}
              </View>
            </View>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 'payment' && (
            <View style={styles.stepContent}>
              <Text variant="titleLarge" style={styles.stepTitle}>Payment Method</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Choose how you'd like to pay.
              </Text>

              <RadioButton.Group value={selectedPayment} onValueChange={setSelectedPayment}>
                {PAYMENT_METHODS.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    onPress={() => setSelectedPayment(method.id)}
                    activeOpacity={0.7}
                  >
                    <Surface
                      style={[
                        styles.paymentOption,
                        {
                          borderColor: selectedPayment === method.id ? theme.colors.primary : theme.colors.outline,
                          borderWidth: selectedPayment === method.id ? 2 : 1,
                          backgroundColor: selectedPayment === method.id
                            ? theme.colors.primaryContainer
                            : theme.colors.surface,
                        },
                      ]}
                      elevation={0}
                    >
                      <View style={[styles.paymentIconWrap, { backgroundColor: selectedPayment === method.id ? theme.colors.primary : theme.colors.surfaceVariant }]}>
                        <Icon source={method.icon} size={22} color={selectedPayment === method.id ? '#fff' : theme.colors.onSurfaceVariant} />
                      </View>
                      <View style={styles.paymentInfo}>
                        <Text variant="titleSmall" style={styles.paymentLabel}>{method.label}</Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{method.detail}</Text>
                      </View>
                      <RadioButton value={method.id} />
                    </Surface>
                  </TouchableOpacity>
                ))}
              </RadioButton.Group>
            </View>
          )}

          {/* ── STEP 3: Summary ── */}
          {step === 'summary' && (
            <View style={styles.stepContent}>
              <Text variant="titleLarge" style={styles.stepTitle}>Order Review</Text>

              {/* Address summary */}
              <Surface style={[styles.summaryCard, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
                <View style={styles.summaryCardHeader}>
                  <Icon source="map-marker-outline" size={18} color={theme.colors.primary} />
                  <Text variant="labelLarge" style={[styles.summaryCardTitle, { color: theme.colors.primary }]}>Delivery To</Text>
                </View>
                <Text variant="bodySmall">{address.fullName}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {address.line1}{address.line2 ? `, ${address.line2}` : ''}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {address.city}, {address.state} – {address.pincode}
                </Text>
              </Surface>

              {/* Payment summary */}
              <Surface style={[styles.summaryCard, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
                <View style={styles.summaryCardHeader}>
                  <Icon source="credit-card-outline" size={18} color={theme.colors.primary} />
                  <Text variant="labelLarge" style={[styles.summaryCardTitle, { color: theme.colors.primary }]}>Payment</Text>
                </View>
                <Text variant="bodySmall">
                  {PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.label}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.detail}
                </Text>
              </Surface>

              {/* Items summary */}
              <Surface style={[styles.summaryCard, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
                <View style={styles.summaryCardHeader}>
                  <Icon source="shopping-outline" size={18} color={theme.colors.primary} />
                  <Text variant="labelLarge" style={[styles.summaryCardTitle, { color: theme.colors.primary }]}>
                    Items ({rows.length})
                  </Text>
                </View>
                {rows.map((row) =>
                  row.shoe ? (
                    <View key={row.cartItem.id} style={styles.summaryItem}>
                      <Text variant="bodySmall" style={{ flex: 1 }} numberOfLines={1}>
                        {row.shoe.brand} {row.shoe.name} · Size {row.cartItem.size} ×{row.cartItem.quantity}
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                        {formatPrice(row.shoe.price * row.cartItem.quantity)}
                      </Text>
                    </View>
                  ) : null
                )}
                <View style={[styles.summaryTotalRow, { borderTopColor: theme.colors.outline }]}>
                  <Text variant="titleSmall" style={{ fontWeight: '700' }}>Total</Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '800' }}>
                    {formatPrice(total)}
                  </Text>
                </View>
              </Surface>
            </View>
          )}
        </ScrollView>

        {/* Footer actions */}
        <Surface style={[styles.footer, { borderTopColor: theme.colors.outline }]} elevation={2}>
          <Button
            mode="outlined"
            style={styles.footerBtn}
            onPress={() => {
              if (step === 'address') router.back();
              else if (step === 'payment') setStep('address');
              else setStep('payment');
            }}
          >
            {step === 'address' ? 'Cancel' : 'Back'}
          </Button>

          {step !== 'summary' ? (
            <Button
              mode="contained"
              style={styles.footerBtn}
              contentStyle={{ paddingVertical: 2 }}
              onPress={handleNext}
              icon="arrow-right"
            >
              {step === 'address' ? 'Continue' : 'Review Order'}
            </Button>
          ) : (
            <Button
              mode="contained"
              style={styles.footerBtn}
              contentStyle={{ paddingVertical: 2 }}
              onPress={handlePlaceOrder}
              icon="check"
            >
              Place Order
            </Button>
          )}
        </Surface>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  // Step bar
  stepBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    gap: 0,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
    position: 'relative',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotText: { fontSize: 12, fontWeight: '700' },
  stepLine: {
    position: 'absolute',
    top: 14,
    left: '50%',
    right: '-50%',
    height: 2,
    zIndex: -1,
  },
  // Content
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
  stepContent: { gap: Spacing.three },
  stepTitle: { fontWeight: '800' },
  // Address form
  formFields: { gap: Spacing.two },
  twoCol: { flexDirection: 'row', gap: Spacing.two },
  twoColItem: { flex: 1 },
  fieldError: { color: '#DC2626', fontSize: 12, marginTop: -Spacing.one },
  // Payment
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  paymentIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: { flex: 1, gap: 2 },
  paymentLabel: { fontWeight: '700' },
  // Summary
  summaryCard: {
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginBottom: Spacing.one,
  },
  summaryCardTitle: { fontWeight: '700' },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: 2,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.two,
    paddingTop: Spacing.two,
  },
  // Footer
  footer: {
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerBtn: { flex: 1, borderRadius: 12 },
});
