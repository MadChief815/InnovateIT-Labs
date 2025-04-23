import React, { useState, useEffect, useRef } from "react";
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

interface Loan {
  loan_id: number;
  loan_amount: string;
  pending_loan: boolean;
  loan_type: string;
  loan_status: string;
}

interface Customer {
  customer_id: number;
  customer_name: string;
  customer_mobile_number: string;
  alternate_mobile_number: string;
  aadhar_number: string;
  pan_number: string;
  address: string;
  is_missing_customer: boolean;
  loans: Loan[];
}

const CustomerDetailsScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer_id, setCustomerId] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  useEffect(() => {
    // Fetch customer_id from SecureStore
    const getCustomerId = async () => {
      const customer_id_str = await SecureStore.getItemAsync("customer_id");
      const customer_id = customer_id_str
        ? parseInt(customer_id_str, 10)
        : null;
      setCustomerId(customer_id);
    };

    getCustomerId();
  }, []);

  // Updated code to enhance the user experience by optimizing data fetching.
  const hasFetched = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // Function to fetch customer details from the API
    const fetchCustomerDetails = async () => {
      if (customer_id && !hasFetched.current) {
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

          if (isMounted) {
            setCustomer(response.data);
            hasFetched.current = true;
          }
        } catch (err) {
          if (isMounted) {
            setError("Failed to fetch customer details");
            console.error("Error fetching customer details:", err);
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };

    // Fetch customer details initially
    fetchCustomerDetails();

    return () => {
      isMounted = false;
    };
  }, [customer_id]); // Adding customer_id to the dependency array

  // useEffect(() => {
  //   // Function to fetch customer details from the API
  //   const fetchCustomerDetails = async () => {
  //     console.log("CustomerInfo Screen")
  //     if (customer_id) {
  //       try {
  //         const access_token = await SecureStore.getItemAsync("access_token");

  //         const response = await axios.get(
  //           `${base_url}/customers/get_customer_info/${customer_id}/`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${access_token}`,
  //             },
  //           }
  //         );

  //         console.log(response.data);
  //         setCustomer(response.data);
  //       } catch (err) {
  //         console.error("Error fetching customer details:", err);
  //         setError("Failed to fetch customer details");
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   // Fetch customer details initially
  //   fetchCustomerDetails();

  //   // Add a listener to refresh data when the screen comes into focus
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     fetchCustomerDetails(); // Refresh customer details when screen is focused
  //   });

  //   // Cleanup the listener when the component is unmounted
  //   return unsubscribe;
  // }, [customer_id, navigation]); // Adding customer_id and navigation to the dependency array

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
