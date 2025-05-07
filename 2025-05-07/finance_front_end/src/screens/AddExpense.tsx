import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import CustomButton from "../components/CustomButton";
import TextInput from "../components/TextInput";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { base_url } from "../utils/helper";
import { showToast } from "../utils/ToastHelper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form"; // Importing useForm and Controller from react-hook-form
import { z } from "zod"; // Importing zod for schema validation
import { zodResolver } from "@hookform/resolvers/zod"; // Importing zodResolver for integrating zod with react-hook-form

// Define Zod schema for validation
const expenseSchema = z.object({
  expense_amount: z
    .string()
    .nonempty("Expense amount is required")
    .regex(/^\d+$/, "Expense amount must be a number"),
  expense_date: z.string().nonempty("Date of expense is required"),
  description: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>; // Type for form values based on the schema

const ExpenseForm = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expense_amount: "",
      expense_date: "",
      description: "",
    },
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Close the date picker
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
      setSelectedDate(selectedDate);
      setValue("expense_date", formattedDate); // Update the form value
    }
  };

  const handleAddExpense = async (data: ExpenseFormValues) => {
    if (loading) return; // Prevent multiple presses
    setLoading(true);

    const access_token = await SecureStore.getItemAsync("access_token");
    const user_id = await SecureStore.getItemAsync("user_id");
    const updatedForm = { ...data, user_id };

    try {
      const response = await axios.post(
        `${base_url}/expenses/add/`,
        updatedForm,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        navigation.goBack();
        showToast("success", "Expense added successfully!");
      }
    } catch (error) {
      showToast("error", "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      {/* Expense Amount */}
      <Controller
        control={control}
        name="expense_amount"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Expense Amount *"
            value={value}
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.expense_amount}
          />
        )}
      />
      {errors.expense_amount && (
        <Text style={{ color: "red" }}>{errors.expense_amount.message}</Text>
      )}

      {/* Date of Expense */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Controller
          control={control}
          name="expense_date"
          render={({ field: { value } }) => (
            <TextInput
              label="Date Of Expense *"
              value={value || ""}
              editable={false} // Disable manual input
              placeholder="Select Date of Expense"
              error={!!errors.expense_date}
            />
          )}
        />
      </TouchableOpacity>
      {errors.expense_date && (
        <Text style={{ color: "red" }}>{errors.expense_date.message}</Text>
      )}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Description */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Description"
            value={value}
            maxLength={100}
            numberOfLines={3}
            multiline={true}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {/* Add Expense Button */}
      <CustomButton onPress={handleSubmit(handleAddExpense)}>
        {loading ? "Adding Expense..." : "Add Expense"}
      </CustomButton>

      {/* Cancel Button */}
      <CustomButton onPress={navigation.goBack}>Cancel</CustomButton>
    </ScrollView>
  );
};

export default ExpenseForm;