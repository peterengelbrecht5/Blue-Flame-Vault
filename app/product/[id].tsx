import { StyleSheet, Text, View, ScrollView, Pressable, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { SEED_PRODUCTS, SEED_STRAINS } from "@/lib/data-store";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import * as Haptics from "expo-haptics";

const C = Colors.dark;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const product = SEED_PRODUCTS.find(p => p.id === id);
  const strain = product ? SEED_STRAINS.find(s => s.id === product.strainId) : null;
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const topPad = Math.max(insets.top, webTopInset);
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (!product) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle" size={48} color={C.textMuted} />
          <Text style={styles.notFoundText}>Product not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  function handleAdd() {
    if (!isAuthenticated) {
      router.push("/(auth)/login");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    addItem(product!.id);
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <LinearGradient colors={[product.imageColor, C.background]} style={[styles.hero, { paddingTop: topPad }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <View style={styles.heroCenter}>
            <Ionicons name={getCategoryIcon(product.category)} size={56} color="rgba(255,255,255,0.2)" />
          </View>
          {!product.inStock && (
            <View style={styles.outBadge}>
              <Text style={styles.outText}>Currently Unavailable</Text>
            </View>
          )}
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>R{product.price}</Text>
            <Text style={styles.unit}>/ {product.unit}</Text>
          </View>

          <View style={styles.cannabinoidRow}>
            <View style={styles.cannabinoidBox}>
              <Text style={styles.cannabinoidLabel}>THC</Text>
              <Text style={styles.cannabinoidValue}>{product.thc}</Text>
            </View>
            <View style={styles.cannabinoidBox}>
              <Text style={styles.cannabinoidLabel}>CBD</Text>
              <Text style={styles.cannabinoidValue}>{product.cbd}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {strain && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Strain Information</Text>
              <Pressable
                style={styles.strainLink}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/strain/${strain.id}`); }}
              >
                <View style={[styles.strainThumb, { backgroundColor: strain.imageColor }]}>
                  <Ionicons name="leaf" size={18} color="rgba(255,255,255,0.4)" />
                </View>
                <View style={styles.strainInfo}>
                  <Text style={styles.strainName}>{strain.name}</Text>
                  <Text style={styles.strainType}>{strain.type} - {strain.thcRange} THC</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={C.textMuted} />
              </Pressable>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quality Assurance</Text>
            {["Lab-tested for potency and purity", "Independent third-party verification", "Medical-grade cultivation standards", "Organic growing practices"].map(item => (
              <View key={item} style={styles.qaRow}>
                <Ionicons name="checkmark-circle" size={18} color={C.success} />
                <Text style={styles.qaText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {product.inStock && (
        <View style={[styles.bottomBar, { paddingBottom: bottomPad + 12 }]}>
          <View style={styles.bottomPrice}>
            <Text style={styles.bottomPriceLabel}>Price</Text>
            <Text style={styles.bottomPriceValue}>R{product.price}</Text>
          </View>
          <Pressable style={styles.addToCartBtn} onPress={handleAdd}>
            <Ionicons name="bag-add" size={20} color="#fff" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function getCategoryIcon(cat: string): keyof typeof Ionicons.glyphMap {
  switch (cat) {
    case "Flower": return "flower";
    case "Oil": return "water";
    case "Tincture": return "flask";
    case "Edible": return "nutrition";
    case "Seed": return "ellipse";
    case "Clone": return "git-branch";
    default: return "cube";
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: C.textMuted },
  backLink: { marginTop: 8 },
  backLinkText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.tint },
  hero: { height: 260, paddingBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(0,0,0,0.3)", alignItems: "center", justifyContent: "center", marginLeft: 16, marginTop: 8 },
  heroCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  outBadge: { alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  outText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.error },
  body: { paddingHorizontal: 20, marginTop: -8 },
  category: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.tint, textTransform: "uppercase", letterSpacing: 1 },
  name: { fontFamily: "Inter_700Bold", fontSize: 26, color: C.text, marginTop: 4, lineHeight: 32 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 8 },
  price: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.accent },
  unit: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted },
  cannabinoidRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  cannabinoidBox: { flex: 1, backgroundColor: C.surface, borderRadius: 14, padding: 16, alignItems: "center", gap: 6, borderWidth: 1, borderColor: C.borderLight },
  cannabinoidLabel: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.textMuted, textTransform: "uppercase" },
  cannabinoidValue: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text },
  section: { marginTop: 28 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
  description: { fontFamily: "Inter_400Regular", fontSize: 15, color: C.textSecondary, lineHeight: 24 },
  strainLink: { flexDirection: "row", alignItems: "center", backgroundColor: C.surface, padding: 14, borderRadius: 14, gap: 14, borderWidth: 1, borderColor: C.borderLight },
  strainThumb: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  strainInfo: { flex: 1, gap: 4 },
  strainName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.text },
  strainType: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  qaRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  qaText: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.borderLight, flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16 },
  bottomPrice: { flex: 1, gap: 2 },
  bottomPriceLabel: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  bottomPriceValue: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.accent },
  addToCartBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.tint, paddingHorizontal: 24, paddingVertical: 16, borderRadius: 14 },
  addToCartText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
});
