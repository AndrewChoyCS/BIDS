import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TextInputBox = ({ placeholder, onChangeText }) => {
  const [text, setText] = useState('');

  const handleChangeText = (newText) => {
    setText(newText);
    onChangeText(newText);
  };

  return (
    <TextInput
      style={styles.textInput}
      onChangeText={handleChangeText}
      value={text}
      placeholder={placeholder}
      placeholderTextColor="#a9a9a9"
    />
  );
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

export default function CreatePage() {
  const [eventTitle, setEventTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [address, setAddress] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const handleCreateEvent = () => {
    // Implement your logic to handle event creation here
    console.log("Creating event...");
  };

  const isCreateButtonEnabled =
    eventTitle && organization && address && entryFee && eventDescription;

  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Create</Text>
      </View>
      <View style={styles.inputBoxesContainer}>
        <TextInputBox
          placeholder="Event Title"
          onChangeText={setEventTitle}
        />
        <TextInputBox
          placeholder="Organization"
          onChangeText={setOrganization}
        />
        <TextInputBox
          placeholder="Address"
          onChangeText={setAddress}
        />
        <TextInputBox
          placeholder="Entry Fee"
          onChangeText={setEntryFee}
        />
        <TextInput
          style={styles.largeInputBox}
          placeholder="Event Description"
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
          onPress={handleCreateEvent}
          disabled={!isCreateButtonEnabled}
        >
          <Text style={styles.buttonText}>Create my event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  titleContainer: {
    margin: 20,
  },
  titleText: {
    color: '#4CAF50',
    fontSize: 34,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputBoxesContainer: {
    paddingHorizontal: 20,
  },
  textInput: {
    height: 50,
    backgroundColor: '#ffffff',
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
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
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginVertical: 10,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
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
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#d3d3d3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  dateTimePickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dateTimePicker: {
    flex: 1,
    marginRight: 10,
  },
  dateTimeSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#cccccc',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  dateTimeContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  });