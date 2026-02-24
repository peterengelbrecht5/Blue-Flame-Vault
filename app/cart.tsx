import { StyleSheet, Text, View, FlatList, Pressable, Platform } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { SEED_PRODUCTS, CartItem } from "@/lib/data-store";
import * as Haptics from "expo-haptics";

const C = Colors.dark;

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const topPad = Math.max(insets.top, webTopInset);
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  function renderItem({ item }: { item: CartItem }) {
    const product = SEED_PRODUCTS.find(p => p.id === item.productId);
    if (!product) return null;

    return (
      <View style={styles.cartItem}>
        <View style={[styles.itemThumb, { backgroundColor: product.imageColor }]}>
          <Ionicons name="flask" size={20} color="rgba(255,255,255,0.4)" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.itemMeta}>{product.category} - {product.unit}</Text>
          <Text style={styles.itemPrice}>R{product.price}</Text>
        </View>
        <View style={styles.qtyControls}>
          <Pressable
            style={styles.qtyBtn}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQuantity(item.productId, item.quantity - 1); }}
          >
            <Ionicons name={item.quantity === 1 ? "trash-outline" : "remove"} size={16} color={item.quantity === 1 ? C.error : C.text} />
          </Pressable>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <Pressable
            style={styles.qtyBtn}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQuantity(item.productId, item.quantity + 1); }}
          >
            <Ionicons name="add" size={16} color={C.text} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={C.text} />
        </Pressable>
        <Text style={styles.title}>Cart</Text>
        {items.length > 0 && (
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); clearCart(); }}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        )}
        {items.length === 0 && <View style={{ width: 44 }} />}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bag-outline" size={64} color={C.textMuted} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Browse our catalog to find premium medical cannabis products</Text>
          <Pressable style={styles.browseBtn} onPress={() => { router.back(); router.push("/(tabs)/catalog"); }}>
            <Text style={styles.browseBtnText}>Browse Catalog</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(i) => i.productId}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 200 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!!items.length}
          />
          <View style={[styles.bottomBar, { paddingBottom: bottomPad + 12 }]}>
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>R{total}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Shipping</Text>
                <Text style={styles.shippingFree}>Free</Text>
              </View>
              <View style={[styles.totalRow, styles.grandTotal]}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>R{total}</Text>
              </View>
            </View>
            <Pressable
              style={styles.checkoutBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                if (!isAuthenticated) {
                  router.push("/(auth)/login");
                } else {
                  router.push("/checkout");
                }
              }}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.borderLight },
  closeBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text },
  clearText: { fontFamily: "Inter_500Medium", fontSize: 14, color: C.error, paddingHorizontal: 8 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 12 },
  emptyTitle: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text },
  emptySubtitle: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary, textAlign: "center", lineHeight: 22 },
  browseBtn: { backgroundColor: C.tint, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14, marginTop: 12 },
  browseBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#fff" },
  cartItem: { flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderRadius: 16, padding: 14, gap: 14, borderWidth: 1, borderColor: C.borderLight },
  itemThumb: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  itemInfo: { flex: 1, gap: 3 },
  itemName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.text },
  itemMeta: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  itemPrice: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.accent },
  qtyControls: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: C.surfaceElevated, alignItems: "center", justifyContent: "center" },
  qtyText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.text, minWidth: 24, textAlign: "center" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.borderLight, paddingHorizontal: 20, paddingTop: 16 },
  totalSection: { gap: 8, marginBottom: 16 },
  totalRow: { flexDirection: "row", justifyContent: "space-between" },
  totalLabel: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary },
  totalValue: { fontFamily: "Inter_500Medium", fontSize: 14, color: C.text },
  shippingFree: { fontFamily: "Inter_500Medium", fontSize: 14, color: C.success },
  grandTotal: { borderTopWidth: 1, borderTopColor: C.borderLight, paddingTop: 8 },
  grandTotalLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.text },
  grandTotalValue: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.accent },
  checkoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: C.tint, paddingVertical: 16, borderRadius: 14 },
  checkoutBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
});
