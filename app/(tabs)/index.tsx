import { StyleSheet, Text, View, ScrollView, Pressable, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { SEED_STRAINS, SEED_PRODUCTS, SEED_BLOG_POSTS } from "@/lib/data-store";
import * as Haptics from "expo-haptics";

const C = Colors.dark;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const topPad = Math.max(insets.top, webTopInset);

  const featuredStrains = SEED_STRAINS.filter(s => !s.archived).slice(0, 3);
  const latestPosts = SEED_BLOG_POSTS.slice(0, 2);
  const newProducts = SEED_PRODUCTS.filter(p => p.inStock).slice(0, 3);

  return (
    <View style={[styles.container]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: topPad }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brandLabel}>PRIVATE MEMBERS CLUB</Text>
            <Text style={styles.brandName}>Blue Flame</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/cart"); }} style={styles.iconBtn}>
              <Ionicons name="bag-outline" size={24} color={C.text} />
              {itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{itemCount}</Text>
                </View>
              )}
            </Pressable>
            {!isAuthenticated && (
              <Pressable onPress={() => router.push("/(auth)/login")} style={styles.iconBtn}>
                <Ionicons name="log-in-outline" size={24} color={C.tint} />
              </Pressable>
            )}
          </View>
        </View>

        <LinearGradient
          colors={["#0F2027", "#203A43", "#2C5364"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroOverlay}>
            <Ionicons name="flame" size={48} color={C.accent} />
            <Text style={styles.heroTitle}>Medical-Grade{"\n"}Genetic Vault</Text>
            <Text style={styles.heroSubtitle}>Preserving, stabilizing & documenting{"\n"}elite medical cannabis lineages</Text>
            <Pressable
              style={styles.heroBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                if (!isAuthenticated) router.push("/(auth)/login");
                else router.push("/(tabs)/strains");
              }}
            >
              <Text style={styles.heroBtnText}>{isAuthenticated ? "Explore Strains" : "Join the Club"}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
          </View>
        </LinearGradient>

        <View style={styles.statsRow}>
          {[
            { label: "Strains", value: SEED_STRAINS.length.toString(), icon: "leaf" as const },
            { label: "Products", value: SEED_PRODUCTS.length.toString(), icon: "flask" as const },
            { label: "Members", value: "142", icon: "people" as const },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Ionicons name={stat.icon} size={20} color={C.tint} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Strains</Text>
            <Pressable onPress={() => router.push("/(tabs)/strains")}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
            {featuredStrains.map((strain) => (
              <Pressable
                key={strain.id}
                style={styles.strainCard}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/strain/${strain.id}`); }}
              >
                <LinearGradient colors={[strain.imageColor, "#0A0A0F"]} style={styles.strainCardGradient}>
                  <Ionicons name="leaf" size={32} color="rgba(255,255,255,0.3)" />
                </LinearGradient>
                <View style={styles.strainCardInfo}>
                  <Text style={styles.strainCardType}>{strain.type}</Text>
                  <Text style={styles.strainCardName}>{strain.name}</Text>
                  <Text style={styles.strainCardThc}>THC {strain.thcRange}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Products</Text>
            <Pressable onPress={() => router.push("/(tabs)/catalog")}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          {newProducts.map((product) => (
            <Pressable
              key={product.id}
              style={styles.productRow}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/product/${product.id}`); }}
            >
              <View style={[styles.productThumb, { backgroundColor: product.imageColor }]}>
                <Ionicons name="flask" size={20} color="rgba(255,255,255,0.5)" />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.productMeta}>{product.category} - {product.unit}</Text>
              </View>
              <Text style={styles.productPrice}>R{product.price}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Articles</Text>
            <Pressable onPress={() => router.push("/(tabs)/blog")}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          {latestPosts.map((post) => (
            <Pressable
              key={post.id}
              style={styles.blogCard}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/blog/${post.id}`); }}
            >
              <Text style={styles.blogCategory}>{post.category}</Text>
              <Text style={styles.blogTitle}>{post.title}</Text>
              <Text style={styles.blogExcerpt} numberOfLines={2}>{post.excerpt}</Text>
              <View style={styles.blogMeta}>
                <Text style={styles.blogAuthor}>{post.author}</Text>
                <Text style={styles.blogDot}>  </Text>
                <Text style={styles.blogRead}>{post.readTime}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  brandLabel: { fontFamily: "Inter_500Medium", fontSize: 10, color: C.accent, letterSpacing: 2 },
  brandName: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text, marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 8 },
  iconBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: 4, right: 4, backgroundColor: C.accent, borderRadius: 10, minWidth: 18, height: 18, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  badgeText: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: "#fff" },
  heroBanner: { marginHorizontal: 20, borderRadius: 20, marginTop: 12, overflow: "hidden" },
  heroOverlay: { padding: 28, gap: 12 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 28, color: "#fff", lineHeight: 34 },
  heroSubtitle: { fontFamily: "Inter_400Regular", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 20 },
  heroBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.tint, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12, alignSelf: "flex-start", marginTop: 8 },
  heroBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#fff" },
  statsRow: { flexDirection: "row", paddingHorizontal: 20, marginTop: 20, gap: 12 },
  statCard: { flex: 1, backgroundColor: C.surface, borderRadius: 16, padding: 16, alignItems: "center", gap: 6, borderWidth: 1, borderColor: C.borderLight },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSecondary },
  section: { marginTop: 32, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text },
  seeAll: { fontFamily: "Inter_500Medium", fontSize: 14, color: C.tint },
  strainCard: { width: 160, marginRight: 12, borderRadius: 16, backgroundColor: C.surface, overflow: "hidden", borderWidth: 1, borderColor: C.borderLight },
  strainCardGradient: { height: 100, alignItems: "center", justifyContent: "center" },
  strainCardInfo: { padding: 12, gap: 4 },
  strainCardType: { fontFamily: "Inter_500Medium", fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: 1 },
  strainCardName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.text },
  strainCardThc: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSecondary },
  productRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.borderLight, gap: 14 },
  productThumb: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  productInfo: { flex: 1, gap: 4 },
  productName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.text },
  productMeta: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSecondary },
  productPrice: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.accent },
  blogCard: { backgroundColor: C.surface, borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: C.borderLight, gap: 8 },
  blogCategory: { fontFamily: "Inter_500Medium", fontSize: 11, color: C.tint, textTransform: "uppercase", letterSpacing: 1 },
  blogTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text, lineHeight: 24 },
  blogExcerpt: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary, lineHeight: 20 },
  blogMeta: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  blogAuthor: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.textMuted },
  blogDot: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  blogRead: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
});
