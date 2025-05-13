import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, FlatList, TextInput, StatusBar } from "react-native";
import {
  Appbar,
  Text,
  Divider,
  Modal,
  Portal,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { theme } from "../utils/theme";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Status Bar Height
const statusBarHeight = StatusBar.currentHeight || 0;

const CustomHeader = ({ navigation, route }: { navigation: any, route: any }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false); // For the search modal
  const [searchInput, setSearchInput] = useState(""); // For the search input
  const [customers, setCustomers] = useState(route.params?.customers || []); // Store customers in state
  const [filteredCustomers, setFilteredCustomers] = useState(customers); // Filtered customers

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Search function
  const handleSearch = () => {
    if (route.name === "CustomerList") {
      console.log("Search icon pressed");
      setSearchModalVisible(true); // Open the search modal
    } else {
      console.log(`Search is not available on the ${route.name} screen`);
    }
  };

  // Update customers state whenever route.params?.customers changes
  useEffect(() => {
    setCustomers(route.params?.customers || []);
    setFilteredCustomers(route.params?.customers || []); // Reset filtered customers as well
  }, [route.params?.customers]);

  // Handle search input change
  const handleSearchInputChange = (text: string) => {
    setSearchInput(text);

    if (text.trim() === "") {
      // Reset to full list if input is empty
      setFilteredCustomers(customers);
    } else {
      // Filter customers based on the search input
      const filtered = customers.filter((customer: any) =>
        customer.customer_name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        {/* Hamburger Menu */}
        <TouchableOpacity onPress={openMenu}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>LoanLink</Text>

        {/* Icons on the right */}
        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={handleSearch} style={styles.icon}>
            <Icon name="magnify" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Calendar')} style={styles.icon}>
            <Icon name="calendar" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Full-Screen Search Modal */}
      {searchModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.searchModalContainer}>
            <View style={styles.searchModalContent}>
              {/* Close Button and Search Input */}
              <View style={{ flexDirection: "row" }}>
                {/* Search Input */}
                <TextInput
                  placeholder="Search Customers"
                  value={searchInput}
                  onChangeText={handleSearchInputChange}
                  style={styles.searchInput}
                />

                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setSearchModalVisible(false); // Close the modal
                    setSearchInput(""); // Clear the search input
                  }}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>

              {/* Filtered Customer List */}
              <FlatList
                data={filteredCustomers}
                keyExtractor={(item) => item.customer_id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.customerItem}
                    onPress={async () => {
                      // Save customer_id to SecureStore and navigate to CustomerInfo
                      await SecureStore.setItemAsync(
                        "customer_id",
                        item.customer_id.toString()
                      );
                      setSearchModalVisible(false);
                      navigation.navigate("CustomerInfo", { customer: item });
                    }}
                  >
                    <Text style={styles.customerName}>{item.customer_name}</Text>
                    <Text style={styles.customerDetails}>
                      {item.customer_mobile_number}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.noResultsText}>No customers found</Text>
                }
              />
            </View>
          </View>
        </View>
      )}

      {/* Full-Screen Menu */}
      <Portal>
        <Modal
          visible={menuVisible}
          onDismiss={closeMenu}
          contentContainerStyle={styles.menuContainer}
        >

          <View style={styles.menuContent}>
            <Divider style={styles.divider} />
            {/* Profile */}
            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={closeMenu}
            >
              <Button
                icon="view-dashboard"
                labelStyle={styles.menuIcon}
                uppercase={false}
                mode="text"
                onPress={() => {
                  closeMenu();
                  navigation.navigate("DashBoard");
                }}
              >
                DashBoard
              </Button>
            </TouchableOpacity>
            <Divider style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={closeMenu}
            >
              <Button
                icon="cash-plus"
                labelStyle={styles.menuIcon}
                uppercase={false}
                mode="text"
                onPress={() => {
                  closeMenu();
                  navigation.navigate("ViewExpenses");
                }}
              >
                Expenses
              </Button>
            </TouchableOpacity>
            <Divider style={styles.divider} />

            {/* Logout */}
            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={closeMenu}
            >
              <Button
                icon="headset"
                labelStyle={styles.menuIcon}
                uppercase={false}
                mode="text"
                onPress={() => {
                  closeMenu();
                  navigation.navigate("Support");
                }}
              >
                Support
              </Button>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            {/* Logout */}
            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={closeMenu}
            >
              <Button
                icon="logout"
                labelStyle={styles.menuIcon}
                uppercase={false}
                mode="text"
                onPress={async () => {
                  closeMenu();
                  await SecureStore.deleteItemAsync("access_token");
                  await SecureStore.deleteItemAsync("refresh_token");
                  navigation.replace("Login");
                }}
              >
                Logout
              </Button>
            </TouchableOpacity>
            <Divider style={styles.divider} />
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    // flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: theme.colors.primary, // Primary color
    width: Dimensions.get("window").width / 2, // Half the screen width
    height: Dimensions.get("window").height, // Full height
  },
  menuContent: {
    padding: 16,
    width: "100%",
  },
  menuItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  menuIcon: {
    fontSize: 18,
    color: "white", // Text and icon color
  },
  divider: {
    backgroundColor: "white",
    marginVertical: 8,
  },
  searchModalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  searchModalContent: {
    // flex: 1,
    padding: 16,
    width: Dimensions.get("window").width, // Full width
    height: Dimensions.get("window").height, // Full height
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  closeButton: {
    flex: 0.25,
    backgroundColor: "#f00",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginLeft: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  customerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  customerDetails: {
    fontSize: 14,
    color: "#555",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fff',
    elevation: 4,
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    marginLeft: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  iconGroup: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 16,
  },
});

export default CustomHeader;
