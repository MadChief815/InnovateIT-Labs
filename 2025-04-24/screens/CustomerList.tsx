import React, { useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { base_url } from "../utils/helper";
import axios from "axios";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Card from "../components/Card";
import Style from "../assets/Style";
import { Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import useStore from "../zustand/store"; // Zustand Store

interface Customer {
  customer_name: string;
  customer_mobile_number: string;
  pending_loan: boolean;
  customer_id: number;
  loan_status: string;
  overdue_days: number;
  is_missing_customer: boolean;
}

const FetchCustomer = ({ navigation }: { navigation: any }) => {
  const { setDataChanged } = useStore(); // Zustand store to set data changed flag
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loanAnalytics, setLoanAnalytics] = useState({
    total_pending_amount: 0,
    total_pending_points: 0,
    overdue_amount: 0,
    overdue_points: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<
    "Regular" | "Bad Customer" | "Missing Customer"
  >("Regular");


  console.log("CustomerList");


  const fetchCustomers = useCallback(async () => {
    try {
      setDataChanged(true); // change data changed flag to true
      setLoading(true);
      setError(null); // Reset error before fetching data
      const access_token = await SecureStore.getItemAsync("access_token");
      const line_id = await SecureStore.getItemAsync("line_id");

      if (!access_token || !line_id) {
        throw new Error("Missing authentication details.");
      }

      const response = await axios.get(
        `${base_url}/customers/get/${line_id}/`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Response data:", response.data);
      setCustomers(response.data.customers || []); // Ensure it's always an array

      setLoanAnalytics(
        response.data.line_analytics || {
          total_pending_amount: 0,
          total_pending_points: 0,
          overdue_amount: 0,
          overdue_points: 0,
        }
      );
    } catch (err: any) {
      console.error(
        "Error fetching customers:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.detail || "Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
    }, [fetchCustomers])
  );

  const regularCustomers = customers
    .filter(
      (customer) => !customer.is_missing_customer && customer.overdue_days <= 30
    )
    .sort((a, b) => (a.loan_status === "Inactive" ? 1 : -1)); // Moves "Inactive" customers to bottom

  const badCustomers = customers.filter(
    (customer) => customer.overdue_days > 30
  );
  const missingCustomers = customers.filter(
    (customer) => customer.is_missing_customer
  );

  if (loading) {
    return (
      <View style={Style.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={Style.errorContainer}>
        <Text style={Style.errorText}>{error}</Text>
      </View>
    );
  }

  const displayedCustomers =
    selectedTab === "Regular"
      ? regularCustomers
      : selectedTab === "Bad Customer"
      ? badCustomers
      : missingCustomers;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={Style.scrollContainer}>
        <View style={[Style.rowData, Style.entityDetailsContainer]}>
          <Text style={[Style.columnData, Style.infoText]}>
            Pending Loan Amount: {loanAnalytics.total_pending_amount}
          </Text>
          <Text style={[Style.columnData, Style.infoText]}>
            Pending Loan Points: {loanAnalytics.total_pending_points}
          </Text>
          <Text style={[Style.columnData, Style.infoText]}>
            Overdue Amount: {loanAnalytics.overdue_amount}
          </Text>
          <Text style={[Style.columnData, Style.infoText]}>
            Overdue Points: {loanAnalytics.overdue_points}
          </Text>
        </View>
        <View style={Style.sideButton}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("AddCustomer")}
          >
            Add Customer
          </Button>
        </View>
        <View style={styles.tabContainer}>
          <Button
            mode={selectedTab === "Regular" ? "contained" : "outlined"}
            onPress={() => setSelectedTab("Regular")}
            // contentStyle={}
            style={{ borderRadius: 0 }}
          >
            Regular
          </Button>

          <Button
            mode={selectedTab === "Bad Customer" ? "contained" : "outlined"}
            onPress={() => setSelectedTab("Bad Customer")}
            style={{ borderRadius: 0 }}
          >
            Bad Customer
          </Button>

          <Button
            mode={selectedTab === "Missing Customer" ? "contained" : "outlined"}
            onPress={() => setSelectedTab("Missing Customer")}
            style={{ borderRadius: 0, flexShrink: 2 }}
          >
            Missing......
          </Button>
        </View>

        {displayedCustomers.length > 0 ? (
          displayedCustomers.map((customer, index) => (
            <Card
              key={index}
              customerName={customer.customer_name}
              customerMobile={customer.customer_mobile_number}
              loanStatus={customer.loan_status}
              onPress={async () => {
                await SecureStore.setItemAsync(
                  "customer_id",
                  customer.customer_id.toString()
                );
                navigation.navigate("CustomerInfo");
              }}
            />
          ))
        ) : (
          <View style={Style.noDataFoundContainer}>
            <Text style={Style.noDataText}>No customers found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Keeps buttons aligned
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingHorizontal: 10, // Allows text to expand
    minWidth: 100, // Prevents too much shrinking
  },
  tabText: {
    textAlign: "center",
    fontSize: 14, // Adjust for better visibility
  },
});


export default FetchCustomer;
