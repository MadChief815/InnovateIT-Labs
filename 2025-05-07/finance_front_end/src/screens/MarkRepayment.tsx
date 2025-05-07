import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../assets/Style";
import { Button, Menu } from "react-native-paper";
import TextInput from "../components/TextInput";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../components/CustomButton";
import * as SecureStore from "expo-secure-store";
import { base_url, getLocalDate } from "../utils/helper";
import { showToast } from "../utils/ToastHelper";





const MarkRepayment = ({ navigation }: { navigation: any }) => {
  const [form, setForm] = useState({
    loan_id: "",
    repayment_type: "",
    repayment_amount: "",
    payment_date: getLocalDate(),
    comments: "",
  });
  const [loading, setLoading] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false); // Date picker visibility state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menuVisible, setMenuVisible] = useState(false);
  const[loanAmount,setLoanAmount] = useState("");
  const getSecureValue = async () => {
    const loanAmountStr = await SecureStore.getItemAsync("loan_amount");
    if (loanAmountStr !== null) {
      setLoanAmount(loanAmountStr);
    }
  };

  useEffect(() => {
    const getLoanAmount = async () => {
      const loan_amount_str = await SecureStore.getItemAsync("loan_amount");
      if (loan_amount_str) {
        const loan_id = parseInt(loan_amount_str, 10); 
        setLoanAmount(loan_id.toString()); 
      }
    };

    getLoanAmount();
  }, []);

  useEffect(() => {
    const getLoanId = async () => {
      const loan_id_str = await SecureStore.getItemAsync("loan_id");
      if (loan_id_str) {
        const loan_id = parseInt(loan_id_str, 10); // Convert to integer
        setForm((prevForm) => ({ ...prevForm, loan_id: loan_id.toString() })); // Convert back to string
      }
    };

    getLoanId();
  }, []);


  

  const handleInputChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleMarkRepayment = async () => {
    console.log(form);
    if (loading) return; // Prevent multiple presses
    setLoading(true);
    const access_token = await SecureStore.getItemAsync("access_token");

    try {
      const response = await axios.post(`${base_url}/repayments/add/`, form, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log("Repayment marked successfully:", response.data);
      showToast("success", "Repayment marked successfully");
      navigation.navigate("LoanInfo");
    } catch (error) {
      setLoading(false);
      showToast("error", "Error marking repayment");
      console.error("Error marking repayment:", error);
    }
  };

  // Date Picker handler
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Close the date picker
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
      setSelectedDate(selectedDate);
      handleInputChange("payment_date", formattedDate); // Update the form state
    }
  };

  const getLoanType = async () => {
    return await SecureStore.getItemAsync("loan_type");
  };
  const [loanType, setLoanType] = useState("");

  useEffect(() => {
    const fetchLoanType = async () => {
      const type = await getLoanType();
      setLoanType(type || ""); // Ensure it doesn't remain null/undefined
    };
    fetchLoanType();
  }, []);

  return (
    <ScrollView style={{ padding: 10 }} keyboardShouldPersistTaps="handled">
      <TextInput
        label="Loan ID"
        value={form.loan_id} // No need to convert, already a string
        onChangeText={(value) => handleInputChange("loan_id", value)}
        editable={false} // Disable manual editing as it is retrieved
        placeholder="Loan ID"
      />

      {loanType === "Interest-Only Loan" && (
        <Menu
          visible={menuVisible} // Controls whether the menu is visible
          onDismiss={() => setMenuVisible(false)} // Function to close the menu
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <TextInput
                label="Repayment Type  *"
                value={form.repayment_type || "Select Repayment Type"} // Display selected value or placeholder
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
              handleInputChange("repayment_type", "Principle");
              setMenuVisible(false);
            }}
            title="Principle"
          />
          <Menu.Item
            onPress={() => {
              handleInputChange("repayment_type", "Interest");
              setMenuVisible(false);
            }}
            title="Interest"
          />
        </Menu>
      )}
      {form.repayment_type == "Principle" ? (
        <TextInput
          label="Repayment Amount  *"
          value={loanAmount}
          editable={false}
          onChangeText={(value) => handleInputChange("repayment_amount", value)}
          keyboardType="numeric"
        />
      ) : (
        <TextInput
          label="Repayment Amount  *"
          value={form.repayment_amount}
          onChangeText={(value) => handleInputChange("repayment_amount", value)}
          keyboardType="numeric"
        />
      )}

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          label="Payment Date  *"
          value={form.payment_date || ""}
          editable={false} // Disable manual input
          placeholder="Select Payment Date"
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
        label="Comments"
        value={form.comments}
        onChangeText={(value) => handleInputChange("comments", value)}
      />

      <CustomButton
        onPress={handleMarkRepayment}
        customStyle={{ marginBottom: 0 }}
      >
        {loading ? "Marking Repayment..." : "Mark Repayment"}
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

export default MarkRepayment;
