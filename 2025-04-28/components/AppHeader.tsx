import React, { useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, FlatList, TextInput } from "react-native";
import {
  Appbar,
  Text,
  Divider,
  Modal,
  Portal,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store"
import { theme } from "../utils/theme"

const CustomHeader = ({ navigation, route }: { navigation: any, route: any }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false); // For the search modal
  const [searchInput, setSearchInput] = useState(""); // For the search input
  const customers = route.params?.customers || []; // Access customers from params
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

  // Handle search input change
  const handleSearchInputChange = (text: string) => {
    setSearchInput(text);
    const filtered = customers.filter((customer: any) =>
      customer.customer_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  return (
    <>
      <Appbar.Header>
        {/* Hamburger Menu */}
        <Appbar.Action icon="menu" onPress={openMenu} />

        {/* Title */}
        <Appbar.Content title="LoanLink" />

        {/* Search Icon */}
        <Appbar.Action icon="magnify" onPress={handleSearch} />

        {/* Calendar Icon */}
        <Appbar.Action
          icon="calendar"
          onPress={() => console.log("Calendar")}
        />
      </Appbar.Header>

      {/* Full-Screen Search Modal */}
      {searchModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.searchModalContainer}>
            <View style={styles.searchModalContent}>
              {/* Search Input */}
              <TextInput
                placeholder="Search Customers"
                value={searchInput}
                onChangeText={handleSearchInputChange}
                style={styles.searchInput}
              />

              {/* Filtered Customer List */}
              <FlatList
                data={filteredCustomers}
                keyExtractor={(item) => item.customer_id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.customerItem}
                    onPress={() => {
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

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSearchModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: theme.colors.primary, // Primary color
    width: Dimensions.get("window").width / 2, // Half the screen width
    height: "100%", // Full screen height
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
    flex: 1,
    padding: 16,
    width: Dimensions.get("window").width, // Full width
    height: Dimensions.get("window").height, // Full height
  },
  searchInput: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
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
  closeButton: {
    backgroundColor: "#f00",
    padding: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomHeader;
