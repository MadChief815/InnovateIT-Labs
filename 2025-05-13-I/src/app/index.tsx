import React, { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import { theme } from "../utils/theme";
import LoginForm from "../screens/LoginForm";
import RegisterForm from "../screens/RegisterForm";
import DashBoard from "../screens/DashBoard";
import AddCustomer from "../screens/AddCustomer";
import AddLoan from "../screens/AddLoan";
import MarkRepayment from "../screens/MarkRepayment";
import Toast from "react-native-toast-message";
import HomePage from "../screens/HomePage";
import CustomHeader from "../components/AppHeader";
import CustomerList from "../screens/CustomerList";
import CustomerInfo from "../screens/CustomerInfo";
import LoanInfo from "../screens/LoanInfo";
import Support from "../screens/Support";
import { SafeAreaView } from "react-native-safe-area-context";
import AddLine from "../screens/AddLine";
import AddExpense from "../screens/AddExpense";
import ViewExpenses from "../screens/ViewExpenses";
import AccountFrozenPage from "../screens/AccountFrozenPage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";

enableScreens();

const Stack = createNativeStackNavigator();

const App = () => {

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("#0000FF"); // Set status bar background color to blue
      StatusBar.setBarStyle("light-content"); // Set text color to light
      StatusBar.setTranslucent(false); // Ensure the status bar is not translucent
    }
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0000FF" }}>
        <StatusBar backgroundColor="#0000FF" barStyle="light-content" />
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                header: (props) => <CustomHeader {...props} />,
              }}
            >
              <Stack.Screen
                name="Login"
                component={LoginForm}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterForm}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="DashBoard" component={DashBoard} />
              <Stack.Screen name="AddCustomer" component={AddCustomer} />
              <Stack.Screen name="AddLoan" component={AddLoan} />
              <Stack.Screen name="AddLine" component={AddLine} />
              <Stack.Screen name="HomePage" component={HomePage} />
              <Stack.Screen name="MarkRepayment" component={MarkRepayment} />
              <Stack.Screen name="CustomerList" component={CustomerList} />
              <Stack.Screen name="CustomerInfo" component={CustomerInfo} />
              <Stack.Screen name="AddExpense" component={AddExpense} />
              <Stack.Screen name="ViewExpenses" component={ViewExpenses} />
              <Stack.Screen name="LoanInfo" component={LoanInfo} />
              <Stack.Screen name="Support" component={Support} />
              <Stack.Screen
                name="AccountFrozenPage"
                component={AccountFrozenPage}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast />
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;