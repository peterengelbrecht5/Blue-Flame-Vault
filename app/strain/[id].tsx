import { StyleSheet, Text, View, ScrollView, Pressable, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { SEED_STRAINS, SEED_PRODUCTS } from "@/lib/data-store";
import * as Haptics from "expo-haptics";

const C = Colors.dark;

export default function StrainDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const strain = SEED_STRAINS.find(s => s.id === id);
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const topPad = Math.max(insets.top, webTopInset);

  if (!strain) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle" size={48} color={C.textMuted} />
          <Text style={styles.notFoundText}>Strain not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const relatedProducts = SEED_PRODUCTS.filter(p => p.strainId === strain.id);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <LinearGradient colors={[strain.imageColor, C.background]} style={[styles.heroGradient, { paddingTop: topPad }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <View style={styles.heroContent}>
            <Ionicons name="leaf" size={64} color="rgba(255,255,255,0.15)" />
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(strain.type) + "30" }]}>
              <Text style={[styles.typeText, { color: getTypeColor(strain.type) }]}>{strain.type}</Text>
            </View>
            <Text style={styles.strainName}>{strain.name}</Text>
            {strain.archived && (
              <View style={styles.archivedBadge}>
                <Ionicons name="archive" size={14} color={C.accent} />
                <Text style={styles.archivedText}>Archived Strain</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.quickStats}>
            <StatBox label="THC" value={strain.thcRange} />
            <StatBox label="CBD" value={strain.cbdRange} />
            <StatBox label="Flowering" value={strain.floweringTime} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{strain.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lineage</Text>
            <View style={styles.lineageFlow}>
              {strain.lineage.map((parent, i) => (
                <View key={parent} style={styles.lineageItem}>
                  {i > 0 && <Ionicons name="close" size={14} color={C.textMuted} style={{ marginRight: 8 }} />}
                  <View style={styles.lineageChip}>
                    <Ionicons name="git-branch" size={14} color={C.tint} />
                    <Text style={styles.lineageText}>{parent}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Breeder</Text>
            <View style={styles.breederRow}>
              <View style={styles.breederIcon}>
                <Ionicons name="shield-checkmark" size={18} color={C.tint} />
              </View>
              <Text style={styles.breederName}>{strain.breeder}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terpene Profile</Text>
            <View style={styles.tagRow}>
              {strain.terpenes.map(t => (
                <View key={t} style={[styles.tag, { backgroundColor: C.tint + "15" }]}>
                  <Text style={[styles.tagText, { color: C.tintLight }]}>{t}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Flavor Profile</Text>
            <View style={styles.tagRow}>
              {strain.flavorProfile.map(f => (
                <View key={f} style={[styles.tag, { backgroundColor: C.accent + "15" }]}>
                  <Text style={[styles.tagText, { color: C.accentLight }]}>{f}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical Uses</Text>
            <View style={styles.tagRow}>
              {strain.medicalUses.map(m => (
                <View key={m} style={[styles.tag, { backgroundColor: C.success + "15" }]}>
                  <Ionicons name="medkit" size={12} color={C.success} />
                  <Text style={[styles.tagText, { color: C.success }]}>{m}</Text>
                </View>
              ))}
            </View>
          </View>

          {relatedProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Products</Text>
              {relatedProducts.map(p => (
                <Pressable
                  key={p.id}
                  style={styles.productRow}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/product/${p.id}`); }}
                >
                  <View style={[styles.productThumb, { backgroundColor: p.imageColor }]}>
                    <Ionicons name="flask" size={18} color="rgba(255,255,255,0.5)" />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{p.name}</Text>
                    <Text style={styles.productMeta}>{p.category} - {p.unit}</Text>
                  </View>
                  <Text style={styles.productPrice}>R{p.price}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function getTypeColor(type: string): string {
  switch (type) {
    case "Sativa": return "#10B981";
    case "Indica": return "#8B5CF6";
    case "Hybrid": return "#F59E0B";
    default: return C.textSecondary;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: C.textMuted },
  backLink: { marginTop: 8 },
  backLinkText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.tint },
  heroGradient: { paddingBottom: 32 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(0,0,0,0.3)", alignItems: "center", justifyContent: "center", marginLeft: 16, marginTop: 8 },
  heroContent: { alignItems: "center", paddingTop: 20, gap: 12 },
  typeBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  typeText: { fontFamily: "Inter_600SemiBold", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 },
  strainName: { fontFamily: "Inter_700Bold", fontSize: 32, color: "#fff", textAlign: "center" },
  archivedBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(0,0,0,0.4)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  archivedText: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.accent },
  body: { paddingHorizontal: 20, marginTop: -8 },
  quickStats: { flexDirection: "row", gap: 10, marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: C.surface, borderRadius: 14, padding: 14, alignItems: "center", gap: 6, borderWidth: 1, borderColor: C.borderLight },
  statLabel: { fontFamily: "Inter_500Medium", fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.text },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
  description: { fontFamily: "Inter_400Regular", fontSize: 15, color: C.textSecondary, lineHeight: 24 },
  lineageFlow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 4 },
  lineageItem: { flexDirection: "row", alignItems: "center" },
  lineageChip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.surface, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: C.borderLight },
  lineageText: { fontFamily: "Inter_500Medium", fontSize: 14, color: C.text },
  breederRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: C.surface, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: C.borderLight },
  breederIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.tint + "15", alignItems: "center", justifyContent: "center" },
  breederName: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.text },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  tagText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  productRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.borderLight, gap: 12 },
  productThumb: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  productInfo: { flex: 1, gap: 4 },
  productName: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },
  productMeta: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  productPrice: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.accent },
});
