import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import CustomButton from "../components/CustomButton";

const AccountFrozenPage = () => {
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user_id from SecureStore on mount
  useEffect(() => {
    const getUserId = async () => {
      const id = await SecureStore.getItemAsync("user_id");
      setUserId(id);
    };
    getUserId();
  }, []);

  // Open WhatsApp with dynamic user_id
  const openWhatsApp = () => {
    const baseUrl = "https://wa.me/917904046455";
    const message = `Hi, my account is frozen on the Finance app. My user ID is ${userId}. Please help.`;
    const url = `${baseUrl}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open WhatsApp:", err)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚫 Account Temporarily Frozen</Text>

      <Text style={styles.description}>
        Your account has been temporarily frozen due to unusual activity or policy issues. 
      </Text>

      <Text style={styles.description}>
        To resolve this issue, please reach out to our support team. We’re here to help you! 💡
      </Text>

      <TouchableOpacity onPress={openWhatsApp} disabled={!userId}>
        <CustomButton>Contact Support via WhatsApp 💬</CustomButton>
      </TouchableOpacity>

      <Text style={styles.footerNote}>
        We appreciate your patience and look forward to assisting you promptly.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#d9534f",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
    color: "#555",
    textAlign: "center",
  },
  footerNote: {
    fontSize: 16,
    marginTop: 30,
    textAlign: "center",
    color: "#555",
  },
});

export default AccountFrozenPage;
