import { StyleSheet, Text, View, FlatList, Pressable, TextInput, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useMemo } from "react";
import Colors from "@/constants/colors";
import { SEED_PRODUCTS, Product } from "@/lib/data-store";
import { useCart } from "@/lib/cart-context";
import * as Haptics from "expo-haptics";

const C = Colors.dark;
const CATEGORIES = ["All", "Flower", "Oil", "Tincture", "Edible", "Seed", "Clone"];

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const { addItem, itemCount } = useCart();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const topPad = Math.max(insets.top, webTopInset);

  const filtered = useMemo(() => {
    return SEED_PRODUCTS.filter(p => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.strainName.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  function renderProduct({ item }: { item: Product }) {
    return (
      <Pressable
        style={styles.card}
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/product/${item.id}`); }}
      >
        <View style={[styles.cardImage, { backgroundColor: item.imageColor }]}>
          <Ionicons name={getCategoryIcon(item.category)} size={28} color="rgba(255,255,255,0.4)" />
          {!item.inStock && (
            <View style={styles.outOfStock}>
              <Text style={styles.outOfStockText}>Sold Out</Text>
            </View>
          )}
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.cardUnit}>{item.unit}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>R{item.price}</Text>
            {item.inStock && (
              <Pressable
                style={styles.addBtn}
                onPress={(e) => {
                  e.stopPropagation?.();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  addItem(item.id);
                }}
              >
                <Ionicons name="add" size={18} color="#fff" />
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Product Catalog</Text>
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/cart"); }} style={styles.cartBtn}>
            <Ionicons name="bag-outline" size={22} color={C.text} />
            {itemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={C.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={C.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={C.textMuted} />
            </Pressable>
          )}
        </View>
        <FlatList
          horizontal
          data={CATEGORIES}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i}
          contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.chip, activeCategory === item && styles.chipActive]}
              onPress={() => { Haptics.selectionAsync(); setActiveCategory(item); }}
            >
              <Text style={[styles.chipText, activeCategory === item && styles.chipTextActive]}>{item}</Text>
            </Pressable>
          )}
        />
      </View>
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filtered.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bag-outline" size={48} color={C.textMuted} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />
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
  header: { paddingHorizontal: 20, backgroundColor: C.background, borderBottomWidth: 1, borderBottomColor: C.borderLight },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, color: C.text },
  cartBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: 4, right: 4, backgroundColor: C.accent, borderRadius: 10, minWidth: 18, height: 18, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  badgeText: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: "#fff" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: C.inputBackground, borderRadius: 12, paddingHorizontal: 14, height: 44, gap: 10, marginTop: 12 },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: C.text },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderLight },
  chipActive: { backgroundColor: C.tint, borderColor: C.tint },
  chipText: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.textSecondary },
  chipTextActive: { color: "#fff" },
  grid: { padding: 20, gap: 12, paddingBottom: 120 },
  card: { flex: 1, backgroundColor: C.surface, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: C.borderLight },
  cardImage: { height: 100, alignItems: "center", justifyContent: "center" },
  outOfStock: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  outOfStockText: { fontFamily: "Inter_500Medium", fontSize: 10, color: C.error },
  cardBody: { padding: 12, gap: 4 },
  cardCategory: { fontFamily: "Inter_500Medium", fontSize: 10, color: C.tint, textTransform: "uppercase", letterSpacing: 1 },
  cardName: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text, lineHeight: 20 },
  cardUnit: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  cardPrice: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.accent },
  addBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: C.tint, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 16, color: C.textMuted },
});
