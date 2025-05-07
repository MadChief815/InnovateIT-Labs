import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button, ButtonProps } from 'react-native-paper';

type CustomButtonProps = ButtonProps & {
  customStyle?: StyleProp<ViewStyle>; // Optional additional custom styles
};

const CustomButton: React.FC<CustomButtonProps> = ({ 
  customStyle, 
  mode = 'contained', // Default mode to 'contained'
  style, 
  ...props // Capture all remaining props for the Button
}) => {
  return (
    <Button 
      {...props} // Pass all props from react-native-paper Button
      mode={mode} // Set default mode if not provided
      style={[styles.defaultButton, style, customStyle]} // Combine styles using an array
    />
  );
};

const styles = StyleSheet.create({
  defaultButton: {
    marginBottom: 0,
    marginTop: 12,
  },
});

export default CustomButton;
