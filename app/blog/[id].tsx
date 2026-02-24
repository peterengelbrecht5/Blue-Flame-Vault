import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Platform, Alert, FlatList } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import Colors from "@/constants/colors";
import { SEED_BLOG_POSTS, Comment, getForumComments, saveForumComment } from "@/lib/data-store";
import { useAuth } from "@/lib/auth-context";
import * as Haptics from "expo-haptics";

const C = Colors.dark;

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();
  const post = SEED_BLOG_POSTS.find(p => p.id === id);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const topPad = Math.max(insets.top, webTopInset);
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (post) loadComments();
  }, [post?.id]);

  async function loadComments() {
    const c = await getForumComments(post!.id);
    setComments(c);
  }

  async function handlePost() {
    if (!isAuthenticated) {
      router.push("/(auth)/login");
      return;
    }
    if (!newComment.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const comment: Comment = {
      id: Date.now().toString(),
      author: user?.username || "Member",
      content: newComment.trim(),
      date: new Date().toISOString(),
    };
    await saveForumComment(post!.id, comment);
    setComments(prev => [...prev, comment]);
    setNewComment("");
  }

  if (!post) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle" size={48} color={C.textMuted} />
          <Text style={styles.notFoundText}>Article not found</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backLinkText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const paragraphs = post.content.split("\n\n");

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.headerBar, { paddingTop: topPad + 8 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={C.text} />
          </Pressable>
          <Text style={styles.headerLabel}>Article</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.articleHeader}>
          <Text style={styles.articleCategory}>{post.category}</Text>
          <Text style={styles.articleTitle}>{post.title}</Text>
          <View style={styles.authorRow}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorAvatarText}>{post.author[0]}</Text>
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{post.author}</Text>
              <Text style={styles.articleDate}>
                {new Date(post.date).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })} - {post.readTime} read
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.articleBody}>
          {paragraphs.map((para, i) => (
            <Text key={i} style={styles.paragraph}>{para}</Text>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Discussion ({comments.length})</Text>

          {comments.length === 0 ? (
            <View style={styles.emptyComments}>
              <Ionicons name="chatbubble-outline" size={32} color={C.textMuted} />
              <Text style={styles.emptyCommentsText}>No comments yet. Be the first to share your thoughts.</Text>
            </View>
          ) : (
            comments.map(c => (
              <View key={c.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>{c.author[0].toUpperCase()}</Text>
                  </View>
                  <View style={styles.commentAuthorInfo}>
                    <Text style={styles.commentAuthor}>{c.author}</Text>
                    <Text style={styles.commentDate}>{new Date(c.date).toLocaleDateString("en-ZA")}</Text>
                  </View>
                </View>
                <Text style={styles.commentContent}>{c.content}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={[styles.commentInputBar, { paddingBottom: bottomPad + 8 }]}>
        <TextInput
          style={styles.commentInput}
          placeholder={isAuthenticated ? "Add a comment..." : "Sign in to comment"}
          placeholderTextColor={C.textMuted}
          value={newComment}
          onChangeText={setNewComment}
          editable={isAuthenticated}
          multiline
        />
        <Pressable
          style={[styles.sendBtn, (!newComment.trim() || !isAuthenticated) && styles.sendBtnDisabled]}
          onPress={handlePost}
          disabled={!newComment.trim() && isAuthenticated}
        >
          <Ionicons name="send" size={20} color={newComment.trim() && isAuthenticated ? "#fff" : C.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: C.textMuted },
  backLinkText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.tint, marginTop: 8 },
  headerBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.text },
  articleHeader: { paddingHorizontal: 20, gap: 12 },
  articleCategory: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: C.tint, textTransform: "uppercase", letterSpacing: 1.5 },
  articleTitle: { fontFamily: "Inter_700Bold", fontSize: 26, color: C.text, lineHeight: 34 },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 },
  authorAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.tint + "20", alignItems: "center", justifyContent: "center" },
  authorAvatarText: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.tint },
  authorInfo: { gap: 2 },
  authorName: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },
  articleDate: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  articleBody: { paddingHorizontal: 20, marginTop: 24, gap: 16 },
  paragraph: { fontFamily: "Inter_400Regular", fontSize: 16, color: C.textSecondary, lineHeight: 26 },
  divider: { height: 1, backgroundColor: C.borderLight, marginHorizontal: 20, marginTop: 32, marginBottom: 24 },
  commentsSection: { paddingHorizontal: 20 },
  commentsTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, marginBottom: 16 },
  emptyComments: { alignItems: "center", paddingVertical: 32, gap: 8 },
  emptyCommentsText: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted, textAlign: "center" },
  commentCard: { backgroundColor: C.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.borderLight, gap: 10 },
  commentHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.surfaceElevated, alignItems: "center", justifyContent: "center" },
  commentAvatarText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.textSecondary },
  commentAuthorInfo: { gap: 2 },
  commentAuthor: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.text },
  commentDate: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  commentContent: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary, lineHeight: 22 },
  commentInputBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.borderLight, flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  commentInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: C.text, backgroundColor: C.inputBackground, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, maxHeight: 100, borderWidth: 1, borderColor: C.borderLight },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.tint, alignItems: "center", justifyContent: "center" },
  sendBtnDisabled: { backgroundColor: C.surfaceElevated },
});
