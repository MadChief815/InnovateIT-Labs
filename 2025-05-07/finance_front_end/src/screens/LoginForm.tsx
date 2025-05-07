import React, { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { CommonActions } from "@react-navigation/native";
import { base_url } from "../utils/helper";
import CustomButton from "../components/CustomButton";
import styles from "../assets/Style";
import { showToast } from "../utils/ToastHelper";


const LoginForm = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if (loading) return; // Prevent multiple presses
    setLoading(true);


    if (!formData.email.trim() || !formData.password.trim()) {
      setLoading(false);
      showToast("error", "Error", "Both fields are required!");
      return;
    }
    try {
      const response = await axios.post(`${base_url}/users/login/`, formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        showToast("success", "Login Successfull");
        const { access, refresh, user_id } = response.data;
        console.log("Access Token:", access);
        await SecureStore.setItemAsync("access_token", access);
        await SecureStore.setItemAsync("refresh_token", refresh);
        +(await SecureStore.setItemAsync("user_id", user_id.toString()));

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "DashBoard" }], // Replace 'Dashboard' with your screen name
          })
        );
      }
    } catch (error) {
      showToast("error", "Something went wrong");
    }
    finally{
      setLoading(false)
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value, // Dynamically update the specific field
    });
  };
  const [secureText, setSecureText] = useState(true);
  const handleEyePress = () => {
    setSecureText(!secureText);
  };



  return (
    <View style={{ padding: 20 }}>
      <Text variant="headlineMedium" style={styles.heading}>
        Login
      </Text>
      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
        right={<TextInput.Icon icon="account" />}
        style={{ marginTop: 70 }}
        autoComplete="email"
      />
      <TextInput
        label="Password"
        secureTextEntry={secureText}
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
        right={
          <TextInput.Icon
            icon={secureText ? "eye" : "eye-off"}
            onPress={handleEyePress}
          />
        }
        autoComplete="password"
      />

      <CustomButton onPress={handleLogin} customStyle={{ marginBottom: 0 }}>
      {loading ? "Logging in ..." : "Login"}
      </CustomButton>
      <CustomButton
        onPress={() => navigation.navigate("Register")}
        customStyle={{ marginTop: 10 }}
      >
        Register
      </CustomButton>
     
    </View>
  );
};

export default LoginForm;