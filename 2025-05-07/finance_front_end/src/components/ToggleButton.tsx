import React, { useState } from 'react';
import { View, Switch, Text } from 'react-native';

type ToggleButtonProps = {
  onSwitchChange: (value: boolean) => void; // Define the type for the prop
};

const ToggleButton: React.FC<ToggleButtonProps> = ({ onSwitchChange }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onSwitchChange(newState); // Emit the new state to the parent
  };

  return (
    <View>
      <Text>{isEnabled ? 'Switch is ON' : 'Switch is OFF'}</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

export default ToggleButton;
