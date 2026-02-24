import { StyleSheet, Text, View, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useAuth } from "@/lib/auth-context";
import * as Haptics from "expo-haptics";

const C = Colors.dark;

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = await login(email.trim(), password);
    setLoading(false);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.dismissAll();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Login Failed", "Invalid email or password. Please try again or create an account.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="flame" size={40} color={C.accent} />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your Blue Flame account</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={C.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={C.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={C.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={C.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={C.textMuted} />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[styles.primaryBtn, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Sign In</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Link href="/(auth)/register" asChild>
          <Pressable>
            <Text style={styles.linkText}>Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  content: { flex: 1, padding: 24, gap: 20, justifyContent: "center" },
  iconWrap: { width: 72, height: 72, borderRadius: 20, backgroundColor: C.accent + "15", alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 8 },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text, textAlign: "center" },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary, textAlign: "center", marginTop: -8 },
  inputGroup: { gap: 8 },
  label: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.textSecondary },
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: C.inputBackground, borderRadius: 14, paddingHorizontal: 16, height: 52, gap: 12, borderWidth: 1, borderColor: C.borderLight },
  input: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 16, color: C.text },
  primaryBtn: { backgroundColor: C.tint, paddingVertical: 16, borderRadius: 14, alignItems: "center", marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
  footer: { flexDirection: "row", justifyContent: "center", padding: 24, gap: 6 },
  footerText: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted },
  linkText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.tint },
});
