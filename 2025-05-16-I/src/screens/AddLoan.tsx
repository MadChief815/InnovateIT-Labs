import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, PermissionsAndroid, NativeModules, Platform } from "react-native";
import styles from "../assets/Style";
import { Menu } from "react-native-paper"; // Import Menu from React Native Paper
import TextInput from "../components/TextInput"; // Your custom TextInput component
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../components/CustomButton";
import * as SecureStore from "expo-secure-store";
import { base_url } from "../utils/helper";
import { showToast } from "../utils/ToastHelper";
import { getLocalDate } from "../utils/helper";


const AddLoan = ({ navigation, route }: { navigation: any; route: any }) => {
  const [loading, setLoading] = useState(false);

  const [customer_id, setCustomerId] = useState<number | null>(null);
  const [form, setForm] = useState({
    customer_id: 0,
    loan_type: "",
    loan_amount: "",
    pre_charges: "",
    repayment_amount: "",
    repayment_frequency: "Monthly", // Default value is "Monthly"
    number_of_installments: "",
    rate_of_interest: "",
    lending_date: getLocalDate(),

  });
  const [showDatePicker1, setShowDatePicker1] = useState(false); // Date picker visibility state
  const [showDatePicker2, setShowDatePicker2] = useState(false); // Date picker visibility state
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  const [menuVisible1, setMenuVisible1] = useState(false);
  const [menuVisible2, setMenuVisible2] = useState(false);

  useEffect(() => {
    const getCustomerId = async () => {
      const customer_id_str = await SecureStore.getItemAsync("customer_id");
      const customer_id = customer_id_str
        ? parseInt(customer_id_str, 10)
        : null;
      setCustomerId(customer_id);
    };
    getCustomerId();
  }, []);

  useEffect(() => {
    if (customer_id) {
      setForm({ ...form, customer_id });
    }
  }, [customer_id]);

  const handleInputChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Work 2025-05-16

  // Access native module for sending SMS
  const { SmsModule } = NativeModules;

  /**
   * Request SMS permission on Android
   * Returns true if permission is granted, false otherwise
   */
  async function requestSmsPermission() {
    if (Platform.OS === "android") {
      const currentStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.SEND_SMS
      );
      if (currentStatus) return true;

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
          {
            title: "Send SMS Permission",
            message: "This app needs permission to send SMS messages.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return false; // iOS not supported
  }

  // Get mobile number from route parameters
  const { mobileNumber } = route.params;

  /**
   * Sends SMS silently in background (Android only)
   * @param mobileNumber - recipient's phone number
   * @param message - message to send
   */
  async function sendSmsInBackground(phoneNumber: string, message: string) {
    if (Platform.OS !== "android") {
      console.warn("Silent SMS sending not supported on iOS");
      return;
    }

    const permissionGranted = await requestSmsPermission();
    if (!permissionGranted) {
      console.warn("SMS permission denied");
      return;
    }

    try {
      const result = await SmsModule.sendSms(phoneNumber, message);
      console.log(result); // Log result if successful
    } catch (e) {
      console.error("Failed to send SMS:", e);
    }
  }

  /**
   * Handle submission of loan form
   * Sends loan data to backend and SMS to customer if successful
   */
  const handleAddLoan = async () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true);
    console.log("AddLoan is in progress");

    try {
      // Retrieve JWT token
      const access_token = await SecureStore.getItemAsync("access_token");

      // Send loan data to backend API
      const response = await axios.post(`${base_url}/loans/add/`, form, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log("Loan added successfully:", response.data);
      showToast("success", "Loan added successfully");

      // Store a flag to indicate loan was added (can be used elsewhere)
      await SecureStore.setItemAsync("loan_added", "true");

      // Build SMS message based on loan type
      let message = "";

      if (form.loan_type === "Interest-Only Loan") {
        message = `
Loan Details (Interest-Only):
Customer ID: ${form.customer_id}
Type: ${form.loan_type}
Amount: ${form.loan_amount}
Pre-Charges: ${form.pre_charges}
Interest Rate: ${form.rate_of_interest}
Installments: ${form.number_of_installments}
Date: ${form.lending_date}
      `.trim();
      } else if (form.loan_type === "Installment Loan") {
        message = `
Loan Details (Installment):
Customer ID: ${form.customer_id}
Type: ${form.loan_type}
Amount: ${form.loan_amount}
Pre-Charges: ${form.pre_charges}
Repayment: ${form.repayment_amount}
Frequency: ${form.repayment_frequency}
Installments: ${form.number_of_installments}
Interest Rate: ${form.rate_of_interest}
Date: ${form.lending_date}
      `.trim();
      } else {
        // Handle unexpected loan type
        message = `Loan added successfully.`;
      }

      // Send SMS with loan summary
      await sendSmsInBackground(mobileNumber, message);

      // Navigate back to previous screen
      navigation.goBack();
    } catch (error) {
      showToast("error", "Error adding loan");
      console.error("Error adding loan:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  /**
   * Validate form based on loan type
   * Returns true if required fields are filled, false otherwise
   */
  const isFormValid = () => {
    if (form.loan_type === "Interest-Only Loan") {
      return (
        form.loan_amount.trim() !== "" &&
        form.pre_charges.trim() !== "" &&
        form.rate_of_interest.trim() !== "" &&
        form.number_of_installments.trim() !== "" &&
        form.lending_date.trim() !== ""
      );
    } else if (form.loan_type === "Installment Loan") {
      return (
        form.loan_type.trim() !== "" &&
        form.loan_amount.trim() !== "" &&
        form.pre_charges.trim() !== "" &&
        form.repayment_amount.trim() !== "" &&
        form.repayment_frequency.trim() !== "" &&
        form.number_of_installments.trim() !== "" &&
        form.rate_of_interest.trim() !== "" &&
        form.lending_date.trim() !== ""
      );
    } else {
      // Loan type not selected or unrecognized
      return false;
    }
  };

  // Date Picker handler
  const handleDateChange1 = (event: any, selectedDate?: Date) => {
    setShowDatePicker1(false); // Close the date picker
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
      setSelectedDate1(selectedDate1);
      handleInputChange("lending_date", formattedDate); // Update the form state
    }
  };
  // const handleDateChange2 = (event: any, selectedDate?: Date) => {
  //   setShowDatePicker2(false); // Close the date picker
  //   if (selectedDate) {
  //     let day = selectedDate.getDate();

  //     if (day > 28) {
  //       showToast("error", "Please select a date between 1 and 28.")
  //       // ToastAndroid.show("Please select a date between 1 and 28.", ToastAndroid.SHORT);
  //       return; // Stop execution if invalid date is chosen
  //     }
  //     const formattedDate = selectedDate.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
  //     setSelectedDate2(selectedDate2);
  //     handleInputChange("desired_due_date", formattedDate); // Update the form state
  //   }
  // };

  return (

    <ScrollView style={{ padding: 10 }} keyboardShouldPersistTaps="handled">
      {/* Loan Amount */}
      <Menu
        visible={menuVisible1} // Controls whether the menu is visible
        onDismiss={() => setMenuVisible1(false)} // Function to close the menu
        anchor={
          <TouchableOpacity onPress={() => setMenuVisible1(true)}>
            <TextInput
              label="Loan Type  *"
              value={form.loan_type || "Select Loan Type  *"} // Display selected value or placeholder
              editable={false} // Disable manual input
              pointerEvents="none" // Prevent text input interaction
              style={{ backgroundColor: "#f5f5f5", opacity: 0.8 }} // Visual indication of non-editability
            />
          </TouchableOpacity>
        }
      >
        {/* Menu Items */}
        <Menu.Item
          onPress={() => {
            handleInputChange("loan_type", "Installment Loan");
            setMenuVisible1(false);
          }}
          title="Installment Loan"
        />
        <Menu.Item
          onPress={() => {
            handleInputChange("loan_type", "Interest-Only Loan");
            setMenuVisible1(false);
          }}
          title="Interest-Only Loan"
        />
      </Menu>

      <TextInput
        label="Loan Amount  *"
        value={form.loan_amount}
        onChangeText={(value) => handleInputChange("loan_amount", value)}
        keyboardType="numeric"
      />
      <TextInput
        label="Pre Charges"
        value={form.pre_charges}
        onChangeText={(value) => handleInputChange("pre_charges", value)}
        keyboardType="numeric"
      />
      {form.loan_type === "Interest-Only Loan" && (
        <>
          <TextInput
            label="Rate of Interest  *"
            value={form.rate_of_interest}
            onChangeText={(value) =>
              handleInputChange("rate_of_interest", value)
            }
            keyboardType="numeric"
          />
          <TextInput
            label="Number of Months"
            value={form.number_of_installments}
            onChangeText={(value) =>
              handleInputChange("number_of_installments", value)
            }
            keyboardType="numeric"
          />


        </>
      )}

      {/* Amount per Repayment */}
      {form.loan_type === "Installment Loan" && (
        <>
          <TextInput
            label="Amount per Repayment  *"
            value={form.repayment_amount}
            onChangeText={(value) =>
              handleInputChange("repayment_amount", value)
            }
            keyboardType="numeric"
          />

          {/* Repayment Frequency Dropdown */}
          <Menu
            visible={menuVisible2} // Controls whether the menu is visible
            onDismiss={() => setMenuVisible2(false)} // Function to close the menu
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible2(true)}>
                <TextInput
                  label="Repayment Frequency  *"
                  value={form.repayment_frequency || "Select Frequency"} // Display selected value or placeholder
                  editable={false} // Disable manual input
                  pointerEvents="none" // Prevent text input interaction
                  style={{ backgroundColor: "#f5f5f5", opacity: 0.8 }} // Visual indication of non-editability
                />
              </TouchableOpacity>
            }
          >
            {/* Menu Items */}
            <Menu.Item
              onPress={() => {
                handleInputChange("repayment_frequency", "Daily");
                setMenuVisible2(false);
              }}
              title="Daily"
            />
            <Menu.Item
              onPress={() => {
                handleInputChange("repayment_frequency", "Weekly");
                setMenuVisible2(false);
              }}
              title="Weekly"
            />
            <Menu.Item
              onPress={() => {
                handleInputChange("repayment_frequency", "Monthly");
                setMenuVisible2(false);
              }}
              title="Monthly"
            />
          </Menu>

          {/* Number of Installments */}
          <TextInput
            label="Number of Installments  *"
            value={form.number_of_installments}
            onChangeText={(value) =>
              handleInputChange("number_of_installments", value)
            }
            keyboardType="numeric"
          />

        </>
      )}

      {/* Lending Date Field */}
      <TouchableOpacity onPress={() => setShowDatePicker1(true)}>
        <TextInput
          label="Lending Date  *"
          value={form.lending_date || ""}
          editable={false} // Disable manual input
          placeholder="Select Lending Date"
        />
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker1 && (
        <DateTimePicker
          value={selectedDate1}
          mode="date"
          display="default"
          onChange={handleDateChange1}
        />
      )}

      {/* Buttons */}
      <CustomButton disabled={!isFormValid() || loading} onPress={handleAddLoan} customStyle={{ marginBottom: 0 }}>
        {loading ? "Adding Loan..." : "Add Loan"}
      </CustomButton>
      <CustomButton
        onPress={() => navigation.goBack()}
        customStyle={{ marginTop: 10 }}
      >
        Cancel
      </CustomButton>
    </ScrollView>
  );
};

export default AddLoan;
