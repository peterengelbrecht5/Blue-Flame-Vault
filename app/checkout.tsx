import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Alert, Platform, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import Colors from "@/constants/colors";
import { useCart } from "@/lib/cart-context";
import { SEED_PRODUCTS } from "@/lib/data-store";
import * as Haptics from "expo-haptics";

const C = Colors.dark;

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { items, total, placeOrder } = useCart();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const topPad = Math.max(insets.top, webTopInset);
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  async function handleCheckout() {
    if (!address.trim() || !city.trim() || !postalCode.trim()) {
      Alert.alert("Missing Information", "Please fill in your shipping address.");
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const fullAddress = `${address.trim()}, ${city.trim()}, ${postalCode.trim()}`;
    const order = await placeOrder(fullAddress);

    setLoading(false);
    setOrderPlaced(true);
    setOrderId(order.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  if (orderPlaced) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={72} color={C.success} />
          </View>
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successSubtitle}>Your order {orderId} has been confirmed and is being processed.</Text>
          <View style={styles.successCard}>
            <Ionicons name="time-outline" size={20} color={C.tint} />
            <Text style={styles.successCardText}>Estimated delivery: 3-5 business days</Text>
          </View>
          <View style={styles.successCard}>
            <Ionicons name="locate-outline" size={20} color={C.tint} />
            <Text style={styles.successCardText}>Tracking number will be sent to your email</Text>
          </View>
          <Pressable
            style={styles.doneBtn}
            onPress={() => {
              router.dismissAll();
            }}
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </Pressable>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 200 }}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {items.map(item => {
          const product = SEED_PRODUCTS.find(p => p.id === item.productId);
          if (!product) return null;
          return (
            <View key={item.productId} style={styles.orderItem}>
              <View style={[styles.orderThumb, { backgroundColor: product.imageColor }]}>
                <Ionicons name="flask" size={16} color="rgba(255,255,255,0.4)" />
              </View>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.orderItemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.orderItemPrice}>R{product.price * item.quantity}</Text>
            </View>
          );
        })}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Street Address</Text>
          <TextInput
            style={styles.input}
            placeholder="123 Main Street"
            placeholderTextColor={C.textMuted}
            value={address}
            onChangeText={setAddress}
          />
        </View>
        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 2 }]}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Cape Town"
              placeholderTextColor={C.textMuted}
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Postal Code</Text>
            <TextInput
              style={styles.input}
              placeholder="8001"
              placeholderTextColor={C.textMuted}
              value={postalCode}
              onChangeText={setPostalCode}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.paymentCard}>
          <Ionicons name="card" size={24} color={C.tint} />
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>EFT / Bank Transfer</Text>
            <Text style={styles.paymentSubtitle}>Payment details will be sent after order confirmation</Text>
          </View>
        </View>
        <View style={styles.paymentCard}>
          <Ionicons name="shield-checkmark" size={24} color={C.success} />
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Secure & Private</Text>
            <Text style={styles.paymentSubtitle}>All orders are handled through our private members system</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: bottomPad + 12 }]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R{total}</Text>
        </View>
        <Pressable
          style={[styles.placeOrderBtn, loading && styles.btnDisabled]}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="lock-closed" size={18} color="#fff" />
              <Text style={styles.placeOrderText}>Place Order</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.borderLight },
  closeBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, marginTop: 8 },
  orderItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  orderThumb: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  orderItemInfo: { flex: 1, gap: 2 },
  orderItemName: { fontFamily: "Inter_500Medium", fontSize: 14, color: C.text },
  orderItemQty: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  orderItemPrice: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.accent },
  divider: { height: 1, backgroundColor: C.borderLight, marginVertical: 20 },
  inputGroup: { marginBottom: 14, gap: 6 },
  label: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.textSecondary },
  input: { backgroundColor: C.inputBackground, borderRadius: 14, paddingHorizontal: 16, height: 50, fontFamily: "Inter_400Regular", fontSize: 15, color: C.text, borderWidth: 1, borderColor: C.borderLight },
  inputRow: { flexDirection: "row", gap: 12 },
  paymentCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: C.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.borderLight, marginBottom: 10 },
  paymentInfo: { flex: 1, gap: 4 },
  paymentTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.text },
  paymentSubtitle: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.borderLight, paddingHorizontal: 20, paddingTop: 16 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  totalLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.text },
  totalValue: { fontFamily: "Inter_700Bold", fontSize: 24, color: C.accent },
  placeOrderBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: C.tint, paddingVertical: 16, borderRadius: 14 },
  btnDisabled: { opacity: 0.6 },
  placeOrderText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 16 },
  successIcon: { marginBottom: 8 },
  successTitle: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text },
  successSubtitle: { fontFamily: "Inter_400Regular", fontSize: 15, color: C.textSecondary, textAlign: "center", lineHeight: 24 },
  successCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: C.surface, borderRadius: 14, padding: 16, width: "100%", borderWidth: 1, borderColor: C.borderLight },
  successCardText: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary, flex: 1 },
  doneBtn: { backgroundColor: C.tint, paddingVertical: 16, paddingHorizontal: 48, borderRadius: 14, marginTop: 16, width: "100%", alignItems: "center" },
  doneBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
});
