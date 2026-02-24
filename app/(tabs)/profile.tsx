import { StyleSheet, Text, View, ScrollView, Pressable, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import * as Haptics from "expo-haptics";

const C = Colors.dark;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, logout } = useAuth();
  const { orders } = useCart();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const topPad = Math.max(insets.top, webTopInset);

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.loginPrompt}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={48} color={C.textMuted} />
          </View>
          <Text style={styles.loginTitle}>Welcome to Blue Flame</Text>
          <Text style={styles.loginSubtitle}>Sign in to access your member profile, order history, and exclusive content.</Text>
          <Pressable
            style={styles.loginBtn}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.loginBtnText}>Sign In</Text>
          </Pressable>
          <Pressable
            style={styles.registerBtn}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.registerBtnText}>Create Account</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); logout(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: topPad }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.username?.[0]?.toUpperCase() || "B"}</Text>
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.memberBadge}>
            <Ionicons name="shield-checkmark" size={14} color={C.tint} />
            <Text style={styles.memberBadgeText}>{user?.membershipTier} Member</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.membershipTier}</Text>
            <Text style={styles.statLabel}>Tier</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.memberSince ? new Date(user.memberSince).toLocaleDateString("en-ZA", { month: "short", year: "2-digit" }) : "--"}</Text>
            <Text style={styles.statLabel}>Since</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuRow icon="bag" label="Order History" count={orders.length} onPress={() => {}} />
          <MenuRow icon="card" label="Payment Methods" onPress={() => {}} />
          <MenuRow icon="location" label="Shipping Addresses" onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <MenuRow icon="notifications" label="Notifications" onPress={() => {}} />
          <MenuRow icon="shield" label="Privacy" onPress={() => {}} />
          <MenuRow icon="help-circle" label="Help & Support" onPress={() => {}} />
        </View>

        {orders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            {orders.slice(0, 3).map(order => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + "20" }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
                  </View>
                </View>
                <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString("en-ZA")}</Text>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderItems}>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</Text>
                  <Text style={styles.orderTotal}>R{order.total}</Text>
                </View>
                {order.trackingNumber && (
                  <View style={styles.trackingRow}>
                    <Ionicons name="locate" size={14} color={C.tint} />
                    <Text style={styles.trackingText}>{order.trackingNumber}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={C.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function MenuRow({ icon, label, count, onPress }: { icon: string; label: string; count?: number; onPress: () => void }) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <Ionicons name={icon as any} size={20} color={C.textSecondary} />
      <Text style={styles.menuLabel}>{label}</Text>
      <View style={styles.menuRight}>
        {count !== undefined && count > 0 && (
          <View style={styles.menuCount}>
            <Text style={styles.menuCountText}>{count}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color={C.textMuted} />
      </View>
    </Pressable>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Processing": return C.accent;
    case "Shipped": return C.tint;
    case "Delivered": return C.success;
    default: return C.textSecondary;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  loginPrompt: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 16 },
  avatarPlaceholder: { width: 96, height: 96, borderRadius: 48, backgroundColor: C.surface, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: C.border },
  loginTitle: { fontFamily: "Inter_700Bold", fontSize: 24, color: C.text, textAlign: "center" },
  loginSubtitle: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary, textAlign: "center", lineHeight: 22 },
  loginBtn: { backgroundColor: C.tint, paddingVertical: 16, paddingHorizontal: 48, borderRadius: 14, width: "100%", alignItems: "center", marginTop: 8 },
  loginBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
  registerBtn: { borderWidth: 1, borderColor: C.border, paddingVertical: 16, paddingHorizontal: 48, borderRadius: 14, width: "100%", alignItems: "center" },
  registerBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.text },
  profileHeader: { alignItems: "center", paddingVertical: 24, gap: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.tint, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: "Inter_700Bold", fontSize: 32, color: "#fff" },
  username: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text },
  email: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary },
  memberBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.tint + "15", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  memberBadgeText: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.tint },
  statsRow: { flexDirection: "row", marginHorizontal: 20, backgroundColor: C.surface, borderRadius: 16, paddingVertical: 20, borderWidth: 1, borderColor: C.borderLight },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSecondary },
  statDivider: { width: 1, backgroundColor: C.borderLight },
  section: { marginTop: 28, paddingHorizontal: 20 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
  menuRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.borderLight, gap: 14 },
  menuLabel: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 16, color: C.text },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  menuCount: { backgroundColor: C.tint, borderRadius: 10, minWidth: 22, height: 22, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  menuCountText: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: "#fff" },
  orderCard: { backgroundColor: C.surface, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: C.borderLight, gap: 6 },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderId: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontFamily: "Inter_600SemiBold", fontSize: 11, textTransform: "uppercase" },
  orderDate: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  orderFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  orderItems: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary },
  orderTotal: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.accent },
  trackingRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  trackingText: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.tint },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 32, marginHorizontal: 20, paddingVertical: 16, borderRadius: 14, borderWidth: 1, borderColor: C.error + "40" },
  logoutText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.error },
});
