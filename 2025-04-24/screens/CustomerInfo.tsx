import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { base_url } from "../utils/helper";
import axios from "axios";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import Card from "../components/Card"; // Card component for loans
import Style from "../assets/Style";
import { Button, Divider, IconButton, Menu } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { showToast } from "../utils/ToastHelper";
import { useIsFocused } from '@react-navigation/native';
import useStore from "../zustand/store"; // Zustand Store

// Moved all Interfaces to zustand store for setup file to keep things centralized, reusable, and type-safe

const CustomerDetailsScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [loading, setLoading] = useState(false); // I changed this to false because it will only true when data is actually fetching
  const [error, setError] = useState<string | null>(null);
  const [customer_id, setCustomerId] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Updated Code
  // Previously, the customer state was managed locally within the component. 
  // Now, it's handled through Zustand, which means the data won't be lost every time the user navigates away from the screen. 
  // The customer data will persist and be displayed when the user returns. 
  // Fresh data will only be fetched if either dataChanged is true or it's the first time the screen is being viewed (firstView is true). 
  const { dataChanged, setDataChanged, customer, setCustomer, firstView, setFirstView } = useStore(); // Zustand Store
  const isFocused = useIsFocused(); // Use this hook to track focus state of screen

  // Fetch customer_id from SecureStore
  useEffect(() => {
    const getCustomerId = async () => {
      const customer_id_str = await SecureStore.getItemAsync('customer_id');
      const customer_id = customer_id_str ? parseInt(customer_id_str, 10) : null;
      setCustomerId(customer_id);
    };

    getCustomerId();
  }, []);

  // Fetch customer details when the screen is focused or when data has changed
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!customer_id) return; // Early exit if no customer_id

      if (firstView || dataChanged) { // Fetch if first time or dataChanged is true
        setLoading(true);
        try {
          const access_token = await SecureStore.getItemAsync("access_token");
          const response = await axios.get(
            `${base_url}/customers/get_customer_info/${customer_id}/`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );

          setCustomer(response.data);
          setFirstView(false); // set firstView to false so it won't fetch data again unless data has been changed

          // After fetching, reset the dataChanged flag
          setDataChanged(false); // Reset dataChanged in Zustand store
        } catch (err) {
          setError("Failed to fetch customer details");
          console.error("Error fetching customer details:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isFocused) {
      fetchCustomerDetails(); // Fetch when the screen is focused
    }
  }, [customer_id, isFocused, firstView, dataChanged, setCustomer, setFirstView, setDataChanged]); // Dependencies include dataChanged from store


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

  if (!customer) {
    return (
      <View style={Style.errorContainer}>
        <Text style={Style.errorText}>No customer data available.</Text>
      </View>
    );
  }
  const openDialer = (phoneNumber: string) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleAddToMissingCustomer = async () => {
    try {
      const access_token = await SecureStore.getItemAsync("access_token");
      await axios.post(
        `${base_url}/customers/add_to_missing_customer/${customer_id}/`,
        {},

        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );



      const message = customer.is_missing_customer
        ? "Customer removed from missing list."
        : "Customer added to missing list.";
      customer.is_missing_customer = !customer.is_missing_customer;
      showToast("success", message);
      closeMenu();
    } catch (error) {

      const message = customer.is_missing_customer
        ? "Failed to remove customer from missing list"
        : "Failed to add customer to missing list";
      showToast("error", message);

    }
  };

  const handleDeleteCustomer = async () => {
    closeMenu();
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this customer? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const access_token = await SecureStore.getItemAsync(
                "access_token"
              );
              await axios.delete(
                `${base_url}/customers/delete_customer/${customer_id}/`,
                {
                  headers: { Authorization: `Bearer ${access_token}` },
                }
              );
              alert("Customer deleted successfully.");
              navigation.goBack(); // Navigate back after deletion
            } catch (error) {
              console.error("Error deleting customer:", error);
              alert("Failed to delete customer.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 10 }}>
        {/* Customer Details Section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 0,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Customer Details
          </Text>

          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <IconButton icon="dots-vertical" size={24} />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              leadingIcon="account-alert"
              onPress={handleAddToMissingCustomer}
              title={
                customer.is_missing_customer
                  ? "Remove from Missing"
                  : "Add to Missing Customer"
              }
            />
            <Divider />
            <Menu.Item
              leadingIcon="delete"
              onPress={handleDeleteCustomer}
              title="Delete customer"
            />
          </Menu>
        </View>

        <View style={[Style.rowData, Style.entityDetailsContainer]}>
          {[
            { label: "ID", value: customer.customer_id },
            { label: "Name", value: customer.customer_name },
            {
              label: "Mobile 1",
              value: customer.customer_mobile_number,
              showDialer: true,
            },
            {
              label: "Mobile 2",
              value: customer.alternate_mobile_number,
              showDialer: true,
            },

            { label: "Aadhar", value: customer.aadhar_number },
            { label: "PAN", value: customer.pan_number },
            { label: "Address", value: customer.address },
          ].map((item, index) => (
            <View
              key={index}
              style={[
                Style.columnData,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,

                  width: "43%",
                },
              ]}
            >
              <Text style={[Style.infoText, { flexShrink: 1, flexGrow: 1 }]}>
                {item.label}: {item.value || "N/A"}
              </Text>
              {/* Show Dialer Icon if applicable */}
              {item.showDialer && item.value && (
                <TouchableOpacity onPress={() => openDialer(item.value)}>
                  <IconButton
                    icon="phone"
                    iconColor="white"
                    containerColor="green"
                    style={{ padding: 0 }}
                    size={14}
                    onPress={() => openDialer(customer.customer_mobile_number)}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        {/* Add Loan Button */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("AddLoan")}
          >
            Add Loan
          </Button>
        </View>

        {/* Loans Section */}
        <Text style={styles.subHeading}>Loans</Text>
        {customer.loans.map((loan, index) => (
          <Card
            key={index}
            // Passing customer name for loan cards
            loanId={loan.loan_id}
            loanType={loan.loan_type}
            loanAmount={String(loan.loan_amount)}
            pendingLoan={loan.pending_loan}
            loanStatus={loan.loan_status}
            onPress={async () => {
              await SecureStore.setItemAsync(
                "loan_id",
                loan.loan_id.toString()
              );
              await SecureStore.setItemAsync("loan_type", loan.loan_type);
              navigation.navigate("LoanInfo");
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  dialerIcon: {
    fontSize: 10,

    backgroundColor: "white",
    marginLeft: 12,
  },
  buttonContainer: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
});

export default CustomerDetailsScreen;
