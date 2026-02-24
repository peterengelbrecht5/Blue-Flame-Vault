import { StyleSheet, Text, View, FlatList, Pressable, TextInput, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { SEED_STRAINS, Strain } from "@/lib/data-store";
import * as Haptics from "expo-haptics";

const C = Colors.dark;
const FILTERS = ["All", "Sativa", "Indica", "Hybrid", "Archived"];

export default function StrainsScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const topPad = Math.max(insets.top, webTopInset);

  const filtered = useMemo(() => {
    return SEED_STRAINS.filter(s => {
      if (activeFilter === "Archived") return s.archived;
      if (activeFilter !== "All" && s.type !== activeFilter) return false;
      if (activeFilter !== "Archived" && s.archived) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, activeFilter]);

  function renderStrain({ item }: { item: Strain }) {
    return (
      <Pressable
        style={styles.card}
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/strain/${item.id}`); }}
      >
        <LinearGradient colors={[item.imageColor, C.surface]} style={styles.cardGradient}>
          <Ionicons name="leaf" size={36} color="rgba(255,255,255,0.2)" />
          {item.archived && (
            <View style={styles.archivedBadge}>
              <Ionicons name="archive" size={12} color={C.accent} />
              <Text style={styles.archivedText}>Archived</Text>
            </View>
          )}
        </LinearGradient>
        <View style={styles.cardBody}>
          <View style={styles.cardTypeRow}>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) + "20" }]}>
              <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>{item.type}</Text>
            </View>
            <Text style={styles.thcText}>THC {item.thcRange}</Text>
          </View>
          <Text style={styles.strainName}>{item.name}</Text>
          <View style={styles.terpeneRow}>
            {item.terpenes.slice(0, 3).map(t => (
              <View key={t} style={styles.terpeneChip}>
                <Text style={styles.terpeneText}>{t}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.lineage} numberOfLines={1}>
            {item.lineage.join(" x ")}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.title}>Strain Database</Text>
        <Text style={styles.subtitle}>{SEED_STRAINS.length} registered genetics</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={C.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search strains..."
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
          data={FILTERS}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i}
          contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.chip, activeFilter === item && styles.chipActive]}
              onPress={() => { Haptics.selectionAsync(); setActiveFilter(item); }}
            >
              <Text style={[styles.chipText, activeFilter === item && styles.chipTextActive]}>{item}</Text>
            </Pressable>
          )}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 120 }}
        renderItem={renderStrain}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filtered.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="leaf-outline" size={48} color={C.textMuted} />
            <Text style={styles.emptyText}>No strains found</Text>
          </View>
        }
      />
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
  header: { paddingHorizontal: 20, backgroundColor: C.background, borderBottomWidth: 1, borderBottomColor: C.borderLight },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, color: C.text },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary, marginTop: 2 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: C.inputBackground, borderRadius: 12, paddingHorizontal: 14, height: 44, gap: 10, marginTop: 12 },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: C.text },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderLight },
  chipActive: { backgroundColor: C.tint, borderColor: C.tint },
  chipText: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.textSecondary },
  chipTextActive: { color: "#fff" },
  card: { backgroundColor: C.surface, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: C.borderLight },
  cardGradient: { height: 120, alignItems: "center", justifyContent: "center" },
  archivedBadge: { position: "absolute", top: 10, right: 10, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  archivedText: { fontFamily: "Inter_500Medium", fontSize: 11, color: C.accent },
  cardBody: { padding: 16, gap: 8 },
  cardTypeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontFamily: "Inter_600SemiBold", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 },
  thcText: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.textSecondary },
  strainName: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text },
  terpeneRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  terpeneChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: C.surfaceElevated },
  terpeneText: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textSecondary },
  lineage: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted, fontStyle: "italic" },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 16, color: C.textMuted },
});
