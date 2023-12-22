import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Modal} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#000000',
  secondary: '#7d12ff',
  tertiary: '#ab20fd',
  accent: '#200589',
  background: '#fbf8fd',
};

const DateTimeSection = ({ label, dateValue, onDateChange, timeValue, onTimeChange }) => {
  return (
    <View style={styles.dateTimeSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{label}</Text>
      </View>
      <View style={styles.dateTimeContainer}>
        <DateTimePicker
          value={dateValue || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => onDateChange(selectedDate)}
          style={styles.dateTimePicker}
        />
        <DateTimePicker
          value={timeValue || new Date()}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => onTimeChange(selectedTime)}
          style={styles.dateTimePicker}
        />
      </View>
    </View>
  );
};

const EditEventModel = ( {modalVisible,
  closeModal,
  img,
  name,
  ratings,
  location,
  date,
  theme,
  bid,
  organizationName,
  description
}) => {
  const [eventTitle, setEventTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [address, setAddress] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const handleEditEvent = () => {
    // Implement your logic to handle event creation here
    console.log("Creating event...");
    //Chnage to false
    
  };

  const isCreateButtonEnabled =
    eventTitle && organization && address && entryFee && eventDescription;

  return (
      <SafeAreaView>
        <Modal animationType="slide" transparent={false} visible={modalVisible}>
          <ScrollView style={styles.pageContainer}>
            <View style={styles.inputBoxesContainer}>
            <TextInput
              defaultValue={name}
              onChangeText={setEventTitle}
              style={styles.textInput}
            />
            <TextInput
              defaultValue={organizationName}
              onChangeText={setOrganization}
              style={styles.textInput}
            />
            <TextInput
              defaultValue={location}
              onChangeText={setAddress}
              style={styles.textInput}
            />
            <TextInput
              defaultValue="Entry Fee"
              onChangeText={setEntryFee}
              style={styles.textInput}
            />
            <TextInput
              style={styles.largeInputBox}
              defaultValue={description}
              multiline
              onChangeText={setEventDescription}
              placeholderTextColor="#a9a9a9"
            />
            <DateTimeSection
              label="Start Date and Time"
              dateValue={startDate}
              onDateChange={(selectedDate) => setStartDate(selectedDate)}
              timeValue={startTime}
              onTimeChange={(selectedTime) => setStartTime(selectedTime)}
            />
            <DateTimeSection
              label="End Date and Time"
              dateValue={endDate}
              onDateChange={(selectedDate) => setEndDate(selectedDate)}
              timeValue={endTime}
              onTimeChange={(selectedTime) => setEndTime(selectedTime)}
            />
            <TouchableOpacity
              style={[
                styles.createButton,
                isCreateButtonEnabled ? {} : styles.disabledButton,
              ]}
              onPress={closeModal}
              disabled={!isCreateButtonEnabled}
            >
              <Text style={styles.buttonText}>Edit my event</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#0A0A08",
    paddingTop: 75,  // Adjust the paddingTop as needed
  },
  inputBoxesContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,  // Add paddingTop to create space at the top
  },
  textInput: {
    height: 50,
    backgroundColor: COLORS.background,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    fontSize: 16,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  largeInputBox: {
    height: 150,
    textAlignVertical: 'top',
    paddingHorizontal: 15,
    borderRadius: 25,
    fontSize: 16,
    backgroundColor: COLORS.background,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginVertical: 10,
  },
  createButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  disabledButton: {
    backgroundColor: "#bfbfbf",
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  dateTimePickerContainer: {
    alignSelf: 'stretch',
    marginVertical: 10,
    padding: 15,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  dateTimePickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  dateTimePicker: {
    flex: 1,
    marginRight: 10,
  },
  dateTimeSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
  dateTimeContainer: {
    backgroundColor: COLORS.background,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default EditEventModel