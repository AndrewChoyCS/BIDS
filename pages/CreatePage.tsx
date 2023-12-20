import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const TextInputBox = ({ placeHolder, style, onChangeText }) => {
  const [text, setText] = useState("");

  const handleChangeText = (newText) => {
    setText(newText);
    onChangeText(newText);
  };

  return (
    <TextInput
      style={[styles.textInput, style]}
      onChangeText={handleChangeText}
      value={text}
      placeholder={placeHolder}
    />
  );
};

const DateTimePickerBox = ({ value, onChange }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Date and Time</Text>
      <DateTimePicker
        value={value ? new Date(value) : new Date()}
        mode="datetime"
        display="default"
        onChange={(event, selectedDate) => onChange(selectedDate)}
      />
    </View>
  );
};

export default function CreatePage() {
  const [eventTitle, setEventTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [address, setAddress] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const isCreateButtonEnabled =
    eventTitle && organization && address && dateTime && entryFee && eventDescription;

  const handleCreateEvent = () => {
    // Implement your logic to handle event creation here
    console.log("Creating event...");
  };

  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Create</Text>
      </View>
      <View style={styles.inputBoxesContainer}>
        <TextInputBox
          style={styles.smallInputBox}
          placeHolder={"Event Title"}
          onChangeText={setEventTitle}
        />
        <TextInputBox
          style={styles.smallInputBox}
          placeHolder={"Organization"}
          onChangeText={setOrganization}
        />
        <TextInputBox
          style={styles.smallInputBox}
          placeHolder={"Address"}
          onChangeText={setAddress}
        />
        <DateTimePickerBox value={dateTime} onChange={setDateTime} />
        <TextInputBox
          style={styles.smallInputBox}
          placeHolder={"Entry Fee"}
          onChangeText={setEntryFee}
        />
        <TextInput
          style={styles.largeInputBox}
          placeholder={"Event Description"}
          multiline
          onChangeText={setEventDescription}
        />
        <TouchableOpacity
          style={[styles.createButton, isCreateButtonEnabled ? {} : styles.disabledButton]}
          onPress={isCreateButtonEnabled ? handleCreateEvent : null}
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
    backgroundColor: "#f0f0f0",
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  titleText: {
    color: "#4CAF50",
    fontSize: 50,
    textAlign: "center",
    fontWeight: "bold",
  },
  inputBoxesContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  smallInputBox: {
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  largeInputBox: {
    height: 100,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    marginVertical: 20,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  inputLabel: {
    marginRight: 10,
    fontSize: 16,
    color: "#333",
  },
  textInput: {
    flex: 1,
  },
});
