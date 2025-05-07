import { View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../assets/Style";
import TextInput from "../components/TextInput";
import axios from "axios";
import CustomButton from "../components/CustomButton";
import * as SecureStore from "expo-secure-store";
import { base_url } from "../utils/helper";
import { showToast } from "../utils/ToastHelper";
import  Style from "../assets/Style";

const AddLine = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    line_name: "",
    user_id: "",
  });

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await SecureStore.getItemAsync("user_id");
      setForm((prevForm) => ({ ...prevForm, user_id: userId || "" }));
    };

    fetchUserId();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleAddLine = async () => {
    if (loading) return; // Prevent multiple presses
    setLoading(true);
    if (!form.line_name.trim()) {
      showToast("error", "Line name is required");
      return;
    }

    const access_token = await SecureStore.getItemAsync("access_token");

    try {
      const response = await axios.post(`${base_url}/customers/add_line/`, form, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log("Line added successfully:", response.data);
      showToast("success", "Line added successfully");
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      showToast("error", "Error adding line");
      console.error("Error adding line:", error);
    }
  };

  return (
    <ScrollView style={Style.scrollContainer}  keyboardShouldPersistTaps="handled">
      <TextInput
        label="Line Name  *"
        value={form.line_name}
        onChangeText={(value) => handleInputChange("line_name", value)}
        placeholder="Enter Line Name"
        
      />

      <CustomButton onPress={handleAddLine} >
        {loading ? "Adding..." : "Add Line"}
      </CustomButton>

      <CustomButton onPress={() => navigation.goBack()} >
        Cancel
      </CustomButton>
    </ScrollView>
  );
};

export default AddLine;
