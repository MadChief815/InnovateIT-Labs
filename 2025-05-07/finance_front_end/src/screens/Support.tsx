import React from "react";
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

const HelpPage = () => {
  // Function to open WhatsApp
  const openWhatsApp = () => {
    const whatsappUrl =
      "https://wa.me/917904046455?text=Finance%20application%20support:"; // WhatsApp URL format
    Linking.openURL(whatsappUrl).catch((err) =>
      console.error("Failed to open WhatsApp:", err)
    );
  };

  // Function to open Email
  const openEmail = async() => {
     const user_id = await SecureStore.getItemAsync("user_id");

    const email = "prakashpalani147@gmail.com";
    const subject = `Support Request - ${user_id}`;
    const body = "Hello, I need assistance with the application.";
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    Linking.openURL(emailUrl).catch((err) =>
      console.error("Failed to open Email:", err)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Help & Support</Text>

      {/* Description */}
      <Text style={styles.description}>
        🚀 Thank you for using our application! We are dedicated to providing
        you with the best experience. 😊 If you have any questions or need
        assistance, feel free to reach out to us. 📩
      </Text>

      {/* Contact Information */}
      <Text style={styles.contactTitle}>You can contact us through:</Text>

      {/* WhatsApp */}
      <TouchableOpacity onPress={openWhatsApp}>
        {/* <Text style={styles.contactLink}>WhatsApp: +91 79040 46455</Text> */}
        <CustomButton>Whatsapp 💬</CustomButton>
      </TouchableOpacity>

      {/* Email */}
      <TouchableOpacity onPress={openEmail}>
        {/* <Text style={styles.contactLink}>
          Email: prakashpalani147@gmail.com
        </Text> */}
        <CustomButton>Email ✉️</CustomButton>
      </TouchableOpacity>

      {/* Footer Note */}
      <Text style={styles.footerNote}>
        We are happy to assist you and look forward to hearing from you!
      </Text>
    </ScrollView>
  );
};

// Styles
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
    color: "#333",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
    color: "#555",
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  contactLink: {
    fontSize: 16,
    color: "#007bff", // Blue color for links
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  footerNote: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
    color: "#555",
  },
});

export default HelpPage;
