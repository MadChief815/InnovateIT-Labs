import React from "react";
import { TextInput as Input } from "react-native-paper";
import { theme } from "../utils/theme";

// Define the reusable InputText component
import { TextInputProps } from "react-native-paper";

interface InputTextProps extends TextInputProps {
  style?: object;
}

const TextInput: React.FC<InputTextProps> = ({ style, ...props }) => {
  return (
    <Input
      {...props}
      mode="outlined"
      outlineColor={theme.colors.primary}
      dense={false}
      style={{
        marginBottom: 15,
        marginTop: 10,
      }}
      // textColor={theme.colors.primary}
      // autoCorrect={true}
    />
  );
};

export default TextInput;
