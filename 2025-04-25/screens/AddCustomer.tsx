import { View, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import styles from "../assets/Style";
import axios from "axios";
import { base_url } from "../utils/helper";
import TextInput from "../components/TextInput";
import CustomButton from "../components/CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { showToast } from "../utils/ToastHelper";
import { red100, red400 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const AddCustomer = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    line_id: "",
    customer_name: "",
    customer_mobile_number: "",
    alternate_mobile_number: "",
    date_of_birth: "", // Date in string format (YYYY-MM-DD)
    aadhar_number: "",
    pan_number: "",
    address: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleInputChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Close the date picker
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
      setSelectedDate(selectedDate);
      handleInputChange("date_of_birth", formattedDate);
    }
  };

  const handleAddCustomer = async () => {
    if(loading)
      return;
    setLoading(true);
    console.log("AddCustomer is in progress");
    const access_token = await SecureStore.getItemAsync("access_token");
    const line_id = await SecureStore.getItemAsync("line_id");

    const updatedForm = { ...form, line_id: line_id };
    console.log(updatedForm);

    try {
      const response = await axios.post(
        `${base_url}/customers/add/`,
        updatedForm,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Customer added successfully:", response.data);
      showToast("success","Customer added successfully")
      await SecureStore.setItemAsync("new_customer_added", "true");
      navigation.goBack(); // Navigate back after successful submission
    } catch (error) {
      showToast("error","Error adding customer")
      setLoading(false);
      console.error("Error adding customer:", error);
    }
  };

  return (
    
    <ScrollView style={{ padding: 10 }} keyboardShouldPersistTaps="handled">
      <TextInput
        label="Customer Name  *"
        value={form.customer_name}
        onChangeText={(value) => handleInputChange("customer_name", value)}
      />

      <TextInput
        label="Mobile Number  *"
        value={form.customer_mobile_number}
        keyboardType="number-pad"
        maxLength={10}
        onChangeText={(value) =>
          handleInputChange("customer_mobile_number", value)
        }
      />

      <TextInput
        label="Alternate Mobile Number"
        value={form.alternate_mobile_number}
        maxLength={10}
        keyboardType="number-pad"
        onChangeText={(value) =>
          handleInputChange("alternate_mobile_number", value)
        }
      />

      {/* Date of Birth Field */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          label="Date Of Birth"
          value={form.date_of_birth || ""}
          editable={false} // Disable manual input
          placeholder="Select Date of Birth"
        />
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TextInput
        label="Aadhaar Number"
        value={form.aadhar_number}
        keyboardType="number-pad"
        maxLength={12}
        onChangeText={(value) => handleInputChange("aadhar_number", value)}
      />

      <TextInput
        label="PAN Number"
        value={form.pan_number}
        autoCapitalize="characters"
        keyboardType={
          form.pan_number.length < 5 || form.pan_number.length === 9
            ? "default"
            : "number-pad"
        }
        maxLength={10}
        onChangeText={(value) => handleInputChange("pan_number", value)}
        placeholder="Enter PAN (e.g., ABCDE1234F)"
      />

      <TextInput
        label="Address"
        value={form.address}
        multiline={true}
        numberOfLines={4}
        onChangeText={(value) => handleInputChange("address", value)}
      />

      <CustomButton
        onPress={handleAddCustomer}
        
      >
        {loading ? "Adding Customer..." : "Add Customer"}
       
      </CustomButton>
      <CustomButton
        onPress={() => navigation.goBack()}
       
      >
        Cancel
      </CustomButton>
    </ScrollView>
    
  );
};

export default AddCustomer;
