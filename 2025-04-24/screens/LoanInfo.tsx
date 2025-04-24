import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { base_url, getLocalDate } from "../utils/helper";
import axios from "axios";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import Card from "../components/Card"; // Import the Card component
import Style from "../assets/Style";
import CustomButton from "../components/CustomButton";
import { Button, Icon, IconButton, Menu } from "react-native-paper";
import { showToast } from "../utils/ToastHelper";
import useStore from "../zustand/store"; // Zustand Store

// Moved all Interfaces to zustand store for setup file to keep things centralized, reusable, and type-safe

const LoanInfoScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  // Replaced previous local state with Zustand to persist loan details across screens and fetch only when needed
  const { loanDetails, setLoanDetails } = useStore();
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Zustand Store
  const { setDataChanged } = useStore();

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        // Retrieve loan_id from SecureStore
        const loan_id = await SecureStore.getItemAsync("loan_id");

        if (!loan_id) {
          setError("Loan ID not found.");
          setLoading(false);
          return;
        }

        // Retrieve access token from secure storage
        const access_token = await SecureStore.getItemAsync("access_token");

        // Fetch loan details using the loan_id (which includes repayments now)
        const response = await axios.get(
          `${base_url}/loans/loan_details/${loan_id}/`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log(response.data);
        setLoanDetails(response.data); // Save loan details in global state (Zustand) for persistent access and controlled re-fetching
        if (response.data.loan_type === "Interest-Only Loan") {
          await SecureStore.setItemAsync(
            "loan_amount",
            response.data.loan_amount.toString()
          );
          console.log("Loan amount stored securely.");
        }
      } catch (err) {
        console.error("Error fetching loan details:", err);
        setError("Failed to fetch loan details.");
      } finally {
        setLoading(false);
      }
    };

    // Add focus listener to refresh the data when screen is focused
    const unsubscribe = navigation.addListener("focus", () => {
      fetchLoanDetails(); // Re-fetch loan details when screen is focused
    });

    // Clean up the listener when component is unmounted
    return unsubscribe;
  }, [navigation]);

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

  // Ensure loanDetails is available before rendering
  if (!loanDetails) {
    return null; // Or return a fallback UI
  }
  console.log(getLocalDate());
  const lendingDate = new Date(loanDetails.lending_date); // Convert string to Date object
  const today = new Date(getLocalDate()); // Convert string to Date object

  // Calculate the difference in days
  const diffTime = Math.abs(today.getTime() - lendingDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const handleDeleteLoan = async () => {
    closeMenu();
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Loan? This action cannot be undone.",
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
                `${base_url}/loans/delete_loan/${loanDetails.loan_id}/`,
                {
                  headers: { Authorization: `Bearer ${access_token}` },
                }
              );
              showToast("success", "Loan deleted successfully.")

              setDataChanged(true);
              navigation.goBack(); // Navigate back after deletion
            } catch (error) {

              showToast('error', 'Failed to delete loan.');

            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 10 }}>
        {/* <Text style={styles.heading}>Loan Details</Text> */}

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
            Loan Details
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
              leadingIcon="trash-can"
              onPress={handleDeleteLoan}
              title={"Delete Loan"
              }
            />
          </Menu>

        </View>

        <View style={[Style.rowData, Style.entityDetailsContainer]}>
          {loanDetails.loan_type == "Interest-Only Loan" && (
            <>
              <Text style={[Style.columnData, Style.infoText]}>
                Principle Amount:{" "}
                <Text style={{ color: "#1E90FF" }}>
                  {loanDetails.loan_amount - loanDetails.total_principle_paid}
                </Text>
              </Text>
              <Text style={[Style.columnData, Style.infoText]}>
                Monthly Interest Amount:{" "}
                <Text style={{ color: "#1E90FF" }}>
                  {(loanDetails.loan_amount / 100) *
                    loanDetails.rate_of_interest}
                </Text>
              </Text>
              <Text style={[Style.columnData, Style.infoText]}>
                Loan Type: {loanDetails.loan_type}
              </Text>

              {showMore && (
                <>
                  <Text style={[Style.columnData, Style.infoText]}>
                    Amount Issued: {loanDetails.loan_amount}
                  </Text>

                  <Text style={[Style.columnData, Style.infoText]}>
                    Principle Paid: {loanDetails.total_principle_paid}
                  </Text>
                  <Text style={[Style.columnData, Style.infoText]}>
                    Rate Of Interest: {loanDetails.rate_of_interest} %
                  </Text>
                  <Text style={[Style.columnData, Style.infoText]}>
                    Number Of Months: {loanDetails.number_of_installments}
                  </Text>
                </>
              )}
            </>
          )}

          {loanDetails.loan_type === "Installment Loan" && (
            <>
              <Text style={[Style.columnData, Style.infoText]}>
                Amount With Interest:{" "}
                <Text style={{ color: "#1E90FF" }}>
                  {loanDetails.number_of_installments *
                    loanDetails.repayment_amount}
                </Text>
              </Text>

              <Text style={[Style.columnData, Style.infoText]}>
                Amount Paid Till Now:{" "}
                <Text style={{ color: "green" }}>
                  {loanDetails.total_amount_paid}
                </Text>
              </Text>

              <Text style={[Style.columnData, Style.infoText]}>
                Amount Pending:{" "}
                <Text style={{ color: "#E65100" }}>
                  {loanDetails.number_of_installments *
                    loanDetails.repayment_amount -
                    loanDetails.total_amount_paid}
                </Text>
              </Text>

              {/* Other details - only visible when 'showMore' is true */}
              {showMore && (
                <>
                  <Text style={[Style.columnData, Style.infoText]}>
                    Loan Amount Issued: {loanDetails.loan_amount}
                  </Text>
                  <Text style={[Style.columnData, Style.infoText]}>
                    Loan Type: {loanDetails.loan_type}
                  </Text>
                  <Text style={[Style.columnData, Style.infoText]}>
                    Amount Per Installment: {loanDetails.repayment_amount}
                  </Text>
                  <Text style={[Style.columnData, Style.infoText]}>
                    Number of Installments: {loanDetails.number_of_installments}
                  </Text>
                  <Text style={[Style.columnData, Style.infoText]}>
                    Number of Installments Paid:{" "}
                    {loanDetails.no_of_repayments_paid}
                  </Text>
                  <Text style={[Style.columnData, Style.infoText]}>
                    Repayment Frequency: {loanDetails.repayment_frequency}
                  </Text>
                  <Text style={[Style.columnData, Style.infoText]}>
                    Lending Date: {loanDetails.lending_date} ({diffDays} Days)
                  </Text>
                  <Text style={[Style.columnData, Style.infoText]}>
                    Pre Charges: {loanDetails.pre_charges}
                  </Text>
                </>
              )}
            </>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowMore(!showMore)}
          >
            <Text style={[styles.buttonText]}>
              {showMore ? "Less  " : "More "}
              <Icon
                source={showMore ? "chevron-up" : "chevron-down"}
                size={20}
                color="blue"
              />
            </Text>
          </TouchableOpacity>
          {/* <CustomButton onPress={}>{showMore ? "Less" : "More"}</CustomButton> */}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("MarkRepayment")}
          >
            Mark Repayment
          </Button>
        </View>

        <Text style={styles.subHeading}>Repayments</Text>
        {loanDetails.repayments.length === 0 ? (
          <Text>No repayments found for this loan.</Text>
        ) : (
          loanDetails.repayments.map((repayment, index) => (
            <Card
              key={index}
              repaymentAmount={
                repayment.repayment_amount || repayment.interest_amount || " "
              }
              repaymentType={repayment.repayment_type}
              paymentDate={repayment.repayment_date}
              comments={repayment.comments}
              onPress={() => { }}
            />
          ))
        )}
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
  label: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "blue",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  column: {
    width: "48%",
    marginVertical: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
});

export default LoanInfoScreen;
