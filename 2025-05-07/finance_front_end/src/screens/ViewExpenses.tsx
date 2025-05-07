import React, { useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { base_url } from "../utils/helper";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import Style from "../assets/Style";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Card from "../components/Card"; // Reusing Card component for expenses
import { Button } from "react-native-paper";

interface ExpenseData {
  expense_amount: string;
  date: string;
  description: string;
}

const ViewExpenseScreen = ({ navigation }: { navigation: any }) => {
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const user_id = await SecureStore.getItemAsync("user_id");
      const access_token = await SecureStore.getItemAsync("access_token");

      if (!user_id) {
        setError("User ID not found.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${base_url}/expenses/view_expenses/?user_id=${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      setExpenseData(
        Array.isArray(response.data)
          ? response.data.map((expense: any) => ({
              ...expense,
              expense_amount: parseFloat(expense.expense_amount),
            }))
          : []
      );
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to fetch expenses");
      setExpenseData([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh expenses when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 10 }}>
        <View style={Style.sideButton}>
          <Button mode="contained" onPress={() => navigation.navigate("AddExpense")}>
            Add Expense
          </Button>
        </View>

        <Text style={styles.subHeading}>Expenses</Text>
        {expenseData.length > 0 ? (
          expenseData.map((expense, index) => (
            <Card
              key={index}
              date={expense.date}
              expense_amount={expense.expense_amount}
              description={expense.description}
            />
          ))
        ) : (
          <Text>No expenses found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  subHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
});

export default ViewExpenseScreen;
