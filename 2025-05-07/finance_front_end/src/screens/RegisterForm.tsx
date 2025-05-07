//RegisterForm
import React, { useState } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
import axios from "axios";
import styles from "../assets/Style";
import {
  Switch,
  Button,
  TextInput as PaperTextInput,
} from "react-native-paper";
import TextInput from "../components/TextInput";
import Toast from "react-native-toast-message";
import CustomButton from "../components/CustomButton";
import { theme } from "../utils/theme";
import { base_url } from "../utils/helper";
import { showToast } from "../utils/ToastHelper";

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  // State as a single object for all form fields
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    finance_name: "",
    email: "",
    password: "",
    user_name: "",
    mobile_number: "",
    role: "admin",
    admin_id: "",
    admin_mobile_number: "",
  });

  // Handle input change for each field
  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: name === "email" ? value.toLowerCase() : value, // Dynamically update the specific field
    });
  };

  // Handle form submission
  const handleRegister = async () => {
    try {
      // Make the POST request to your API using Axios
      if (loading) return; // Prevent multiple presses
    setLoading(true);
      const response = await axios.post(`${base_url}/users/signup/`, formData);

      if (response.status === 201) {
        showToast("success", "Registred Successfully");
        // Alert.alert("Success", "Registration successful");
        // Navigate to the login screen after successful registration
        navigation.navigate("Login");
      }
    } catch (error: any) {
      console.log(error);
      showToast("error", error.response?.data?.error);
    }
  };

  // const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = (name1: string, value: boolean) => {
    console.log(value);
    setFormData({
      ...formData,
      [name1]: value ? "agent" : "admin",
    });
  };
  // React.useEffect(() => {
  //   console.log("Updated formData:", formData);
  // }, [formData]);

  const [secureText, setSecureText] = useState(true);
  const handleEyePress = () => {
    setSecureText(!secureText);
  };

  return (
    <ScrollView style={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Register</Text>

      <TextInput
        label="Finance Name  *"
        value={formData.finance_name}
        onChangeText={(value) => handleInputChange("finance_name", value)}
      />

      <TextInput
        label="Name  *"
        value={formData.user_name}
        onChangeText={(value) => handleInputChange("user_name", value)}
      />

      <TextInput
        label="Email  *"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
      />
      <PaperTextInput
        mode="outlined"
        outlineColor={theme.colors.primary}
        dense={false}
        style={{
          marginBottom: 25,
        }}
        label="Password  *"
        secureTextEntry={secureText}
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
        right={
          <PaperTextInput.Icon
            icon={secureText ? "eye" : "eye-off"}
            onPress={handleEyePress}
          />
        }
      />

      <TextInput
        label="Mobile Number  *"
        value={formData.mobile_number}
        keyboardType="number-pad"
        maxLength={10}
        onChangeText={(value) => handleInputChange("mobile_number", value)}
      />

      <View style={styles.header}>
        <Text>Register as a Agent : </Text>
        <Switch
          value={formData.role === "admin" ? false : true}
          onValueChange={(value) => onToggleSwitch("role", value)}
        />
      </View>
      {formData.role === "agent" && (
        <>
          <TextInput
            label="Admin ID  *"
            // Update style name if needed
            value={formData.admin_id}
            onChangeText={(value) => handleInputChange("admin_id", value)}
          />

          <TextInput
            label="Admin Mobile Number  *"
            value={formData.admin_mobile_number}
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={(value) =>
              handleInputChange("admin_mobile_number", value)
            }
          />
        </>
      )}

      {/* Button to submit form */}
      <CustomButton onPress={handleRegister} customStyle={{ marginBottom: 0 }}>
        {loading ? "Registering..." : "Register"}
      </CustomButton>

      <CustomButton
        onPress={() => navigation.navigate("Login")}
        customStyle={{ marginTop: 10 }}
      >
        Go to Login
      </CustomButton>
    </ScrollView>
  );
};

export default RegisterScreen;
