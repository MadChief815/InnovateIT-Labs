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

interface Line {
  line_id: number;
  line_name: string;
 
}

const FetchLines = ({ navigation }: { navigation: any }) => {
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLines = async () => {
    try {
      setLoading(true);
      const access_token = await SecureStore.getItemAsync("access_token");
      const user_id = await SecureStore.getItemAsync("user_id");

      const response = await axios.get(
        `${base_url}/lines/get_lines/${user_id}/`, // Updated API endpoint
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Response Data:", response.data); 
      setLines(response.data);
    } catch (err:unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          // Redirect to SubscriptionExpired screen
          navigation.navigate('AccountFrozenPage');
        } else {
          setError("Failed to fetch lines: " + err.message);
        }
      } else {
        setError("An unexpected error occurred");
      }
      
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLines(); // Fetch data when screen is focused
    }, [])
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

  return (
    <View style={{ flex: 1 }}>
      {/* Scrollable content */}
      <ScrollView style={{ paddingLeft: 10, paddingRight: 10 }}>
        <View style={Style.sideButton}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("AddLine")} // Updated navigation
          >
            Add Line
          </Button>
        </View>

        {lines.length>0 ? 
        (lines.map((line, index) => (
          <Card
            key={index}
            customerName={line.line_name} 
           
            onPress={async () => {
              await SecureStore.setItemAsync(
                "line_id",
                line.line_id.toString()
              );
              
              navigation.navigate("CustomerList"); // Updated navigation
            }}
            


            
          />
        ))):(<View style={styles.noCustomerContainer}>
                    <Text style={styles.noCustomerText}>No Lines found</Text>
                  </View>)
      
      }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  
  noCustomerContainer: {
    alignItems: "center",
    marginTop: 20,
    padding: 10,
  },
  noCustomerText: {
    fontSize: 16,
    color: "gray",
  },
});

export default FetchLines;
