import React, { useState } from 'react';
import { View, Button, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const MyDatePicker: React.FC = () => {
  // Set the type of 'date' to 'Date'
  const [date, setDate] = useState<Date>(new Date());

  // Set the type of 'show' to 'boolean'
  const [show, setShow] = useState<boolean>(false);

  // Set the type of 'mode' to either 'date' or 'time'
  const [mode, setMode] = useState<'date' | 'time'>('date');

  // Define the type for the 'onChange' function using DateTimePickerEvent
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // Hide picker on Android after selection
    setDate(currentDate); // Update state with the new date
  };

  // Function to show the picker and set the mode ('date' or 'time')
  const showMode = (currentMode: 'date' | 'time') => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <View>
      <Button onPress={() => showMode('date')} title="Select Date" />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange} // Use the 'onChange' handler
        />
      )}
    </View>
  );
};

export default MyDatePicker;
