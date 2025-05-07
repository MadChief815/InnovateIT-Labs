import { ScrollView } from "react-native";
import Style from "../assets/Style";
import { TextInput } from "react-native-paper";
import { View, TouchableOpacity, Text } from "react-native";

const HomePage = () => {
  return (
    <ScrollView>
      <View style={Style.container}>
        <TextInput style={[Style.input, { flex: 3 }, { height: 40 }]} />
        <TouchableOpacity
          style={[
            Style.button,
            { flex: 1 },
            { borderRadius: 0 },
            { margin: 0 },
            { height: 43
              
             },
          ]}
        >
          <Text>Add Customer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default HomePage;
