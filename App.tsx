import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text, Linking } from "react-native";
import auth from "@react-native-firebase/auth";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      if (user) {
        await user.reload();
        setVerified(user.emailVerified);
      } else {
        setVerified(null);
      }
    });

    const handleUrl = async (event: { url: string }) => {
      console.log("📩 Gelen URL:", event.url);
      await auth().currentUser?.reload();
      if (auth().currentUser?.emailVerified) {
        setVerified(true);
        Alert.alert("✅ Doğrulama Başarılı", "E-postan doğrulandı!");
      }
    };

    const subscription = Linking.addEventListener("url", handleUrl);
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => {
      unsubscribeAuth();
      subscription.remove();
    };
  }, []);

  const handleRegister = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.sendEmailVerification({
        url: "https://authdeneme-4378e.web.app", // ✅ sadece domain
        android: { packageName: "com.authdeneme", installApp: true },
        handleCodeInApp: true,
      });
      Alert.alert("📩 Mail Gönderildi", "Doğrulama mailini kontrol et!");
    } catch (error: any) {
      Alert.alert("❌ Hata", error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      await userCredential.user.reload();
      setVerified(userCredential.user.emailVerified);

      if (userCredential.user.emailVerified) {
        Alert.alert("✅ Doğrulandı", "Hoşgeldin!");
      } else {
        Alert.alert("⚠️ Doğrulama Gerekli", "Maildeki linke tıkla.");
      }
    } catch (error: any) {
      Alert.alert("❌ Hata", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Email Doğrulama</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button title="Kayıt Ol" onPress={handleRegister} />
      <View style={{ marginTop: 10 }} />
      <Button title="Giriş Yap" onPress={handleLogin} />

      {verified !== null && (
        <View style={{ marginTop: 30 }}>
          <Text style={styles.status}>Doğrulama Durumu: {verified ? "✅ Doğrulandı" : "❌ Henüz Değil"}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, marginBottom: 20, textAlign: "center", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 8 },
  status: { fontSize: 18, marginBottom: 10, textAlign: "center" },
});

export default App;
