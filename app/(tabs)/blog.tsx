import { StyleSheet, Text, View, FlatList, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import Colors from "@/constants/colors";
import { SEED_BLOG_POSTS, BlogPost } from "@/lib/data-store";
import * as Haptics from "expo-haptics";

const C = Colors.dark;
const BLOG_CATEGORIES = ["All", "Genetics", "Education", "Cultivation", "Industry"];

export default function BlogScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("All");
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const topPad = Math.max(insets.top, webTopInset);

  const filtered = activeCategory === "All"
    ? SEED_BLOG_POSTS
    : SEED_BLOG_POSTS.filter(p => p.category === activeCategory);

  function renderPost({ item, index }: { item: BlogPost; index: number }) {
    const isFirst = index === 0;

    if (isFirst) {
      return (
        <Pressable
          style={styles.featuredCard}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/blog/${item.id}`); }}
        >
          <View style={styles.featuredHeader}>
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color={C.accent} />
              <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
            <Text style={styles.featuredCategory}>{item.category}</Text>
          </View>
          <Text style={styles.featuredTitle}>{item.title}</Text>
          <Text style={styles.featuredExcerpt} numberOfLines={3}>{item.excerpt}</Text>
          <View style={styles.postMeta}>
            <Ionicons name="person-circle" size={20} color={C.textMuted} />
            <Text style={styles.metaAuthor}>{item.author}</Text>
            <View style={styles.metaDivider} />
            <Ionicons name="time-outline" size={14} color={C.textMuted} />
            <Text style={styles.metaTime}>{item.readTime}</Text>
            <View style={styles.metaDivider} />
            <Text style={styles.metaDate}>{new Date(item.date).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</Text>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        style={styles.postCard}
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/blog/${item.id}`); }}
      >
        <View style={styles.postLeft}>
          <Text style={styles.postCategory}>{item.category}</Text>
          <Text style={styles.postTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.postMeta}>
            <Text style={styles.metaAuthor}>{item.author}</Text>
            <View style={styles.metaDivider} />
            <Text style={styles.metaTime}>{item.readTime}</Text>
          </View>
        </View>
        <View style={styles.postIconWrap}>
          <Ionicons name="document-text" size={24} color={C.tint} />
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.title}>Blog & Forum</Text>
        <Text style={styles.subtitle}>Knowledge from our cultivation experts</Text>
        <FlatList
          horizontal
          data={BLOG_CATEGORIES}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i}
          contentContainerStyle={{ gap: 8, paddingVertical: 12 }}
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
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 120 }}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filtered.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={C.textMuted} />
            <Text style={styles.emptyText}>No articles in this category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { paddingHorizontal: 20, backgroundColor: C.background, borderBottomWidth: 1, borderBottomColor: C.borderLight },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, color: C.text },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary, marginTop: 2 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderLight },
  chipActive: { backgroundColor: C.tint, borderColor: C.tint },
  chipText: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.textSecondary },
  chipTextActive: { color: "#fff" },
  featuredCard: { backgroundColor: C.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.tint + "40", gap: 10 },
  featuredHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  featuredBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: C.accent + "20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  featuredBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: C.accent },
  featuredCategory: { fontFamily: "Inter_500Medium", fontSize: 11, color: C.tint, textTransform: "uppercase", letterSpacing: 1 },
  featuredTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, lineHeight: 28 },
  featuredExcerpt: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary, lineHeight: 22 },
  postCard: { flexDirection: "row", backgroundColor: C.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.borderLight, gap: 16, alignItems: "center" },
  postLeft: { flex: 1, gap: 6 },
  postCategory: { fontFamily: "Inter_500Medium", fontSize: 11, color: C.tint, textTransform: "uppercase", letterSpacing: 1 },
  postTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.text, lineHeight: 22 },
  postIconWrap: { width: 52, height: 52, borderRadius: 14, backgroundColor: C.tint + "15", alignItems: "center", justifyContent: "center" },
  postMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  metaAuthor: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.textMuted },
  metaDivider: { width: 3, height: 3, borderRadius: 2, backgroundColor: C.textMuted },
  metaTime: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  metaDate: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 16, color: C.textMuted },
});
