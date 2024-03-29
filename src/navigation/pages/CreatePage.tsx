import React, { useState, useEffect} from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Button,} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db, storage } from '../../config/firebase';
import {get, onValue, push, ref, set} from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { color } from 'react-native-elements/dist/helpers';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getStorage, ref as StorageRef, uploadBytes, getDownloadURL} from 'firebase/storage';
import { Alert } from 'react-native';



const COLORS = {
  primary: '#000000',
  secondary: '#7d12ff',
  tertiary: '#ab20fd',
  accent: '#200589',
  background: '#fbf8fd',
};

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
  const [organization, setOrganization] = useState([]);
  const [address, setAddress] = useState('');
  const [theme, setTheme] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [organizationOptions, setOrganizationOptions] = useState([]);
  const [eventBanner, setEventBanner] = useState('')
  const [imageResult, setImageResult] = useState(null);
  const [defaultImage, setDefaultImage] = useState(require('../../Images/tke.jpeg'));
  const [downloadURL, setDownloadURL] = useState('')

  const isCreateButtonEnabled = eventTitle && organization && address && entryFee && eventDescription;
    
  const auth = getAuth();
  const user = auth.currentUser;
  
  const dataAddOn = async () => {
    try {
      const eventsRef = ref(db, 'Events');
      const newEventRef = push(eventsRef);
      const eventId = newEventRef.key;
      const adminUID = user.uid;
  
      const result = imageResult;
      const imgRef = StorageRef(storage, `${eventId}-EventBanner`);
  
      const bytes = await fetch(result.assets[0].uri).then(response => response.blob());
      const uploadedBytes = await uploadBytes(imgRef, bytes);
      const url = await getDownloadURL(imgRef);
      setDownloadURL(url);
      console.log("Bytes Uploaded");
      console.log(`File available at:`, url);
  
      setEventBanner(`${eventId}-EventBanner`);
      setDefaultImage({ uri: result.assets[0].uri });
      console.log("done");
  
      const orgRef = ref(db, `Organizations/${selectedOrganization}`);
      const snapshot = await get(orgRef);
  
      if (snapshot.exists()) {
        const orgData = snapshot.val();
        const orgName = orgData.organizationName;
        const orgID = orgData.organizationID;
        console.log("Start Date is: ", startDate)
        console.log("Start Time is: ", startTime)
  
        const eventData = {
          eventId: eventId,
          eventTitle: eventTitle,
          organization: organization,
          organizationName: orgName,
          theme: theme,
          address: address,
          entryFee: entryFee,
          eventDescription: eventDescription,
          startDate: startDate.toISOString(),
          startTime: startTime.toISOString(),
          endDate: endDate.toISOString(),
          endTime: endTime.toISOString(),
          admin: adminUID,
          eventBanner: url,
          organizationID: orgID
        };
  
        set(newEventRef, eventData);
        console.log("Start Date is: ", startDate.toISOString());
        console.log("Start Time is: ", startTime.toISOString());
        
        console.log("Event has been created with ID:", eventId);
        console.log("The organization that created this was: ", selectedOrganization);
  
        const organizationRef = ref(db, `Organizations/${selectedOrganization}/OngoingEvents`);
        const newOrganizationRef = push(organizationRef);
        const organizationEventId = newOrganizationRef.key;
        const organizationEventData = {
          eventId: eventId,
        };
  
        console.log("Event has been added to OngoingEvents with ID:", organizationEventId);
        set(newOrganizationRef, eventId);
        
        Alert.alert('Success', 'Event has been created successfully.');
        setEventTitle('');
        setOrganization([]);
        setAddress('');
        setTheme('');
        setEntryFee('');
        setEventDescription('');
        setStartDate(new Date());
        setStartTime(new Date());
        setEndDate(new Date());
        setEndTime(new Date());
        setSelectedOrganization(null);
        setEventBanner(null);
        setImageResult(null);
      } else {
        console.log("Organization not found");
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
      });
  
      if (!result.canceled) {
        setImageResult(result);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  useEffect(() => {
    const organizationsRef = ref(db, 'Organizations');
  
    onValue(organizationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const organizationsArray = Object.values(data);
        const userOrganizations = organizationsArray.filter(
          organization => organization.admin === user.uid
        );
        const mappedOrganizations = userOrganizations.map(organization => ({
          label: organization.organizationName,
          value: organization.organizationID,
        }));
        // console.log(mappedOrganizations);
        setOrganizationOptions(mappedOrganizations);
      }
    });
  }, [user.uid]);
  
  // console.log("Organization Options:", organizationOptions);
  const [open, setOpen] = useState(false); // Added open state

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Create</Text>
      </View>
      <ScrollView style={styles.pageContainer}>
        <View style={styles.inputBoxesContainer}>
          <TextInputBox
            placeholder="Event Title"
            onChangeText={setEventTitle}
          />
          <TextInputBox
            placeholder="Address"
            onChangeText={setAddress}
          /> 
          {/* I want my autocomplete API to go here
          {/* <GooglePlacesAutocomplete
            placeholder='Location'
            onPress={(data, details = null) => {
              console.log(data, details);
            }}
            query={{
              key: 'AIzaSyBIt3E2OkFlypJTWt-QD2n2ZVpGMidaLHI',
              language: 'en',
            }}
            styles={{
              container: {
                flex: 1,
                marginTop: 10,
              },
              textInputContainer: {
                width: '100%',
                backgroundColor: COLORS.background,
                marginTop: -15,
                marginBottom: 15,
                borderRadius: 20,
                paddingHorizontal: 15,

              },
              textInput: {
                height: 50,
                color: '#5d5d5d',
                fontSize: 16,
              },
              predefinedPlacesDescription: {
                color: COLORS.primary,
              },
            }}
          /> */}
          <TextInputBox
            placeholder="Theme"
            onChangeText={setTheme}
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={pickImage}
            >
              <Text style={styles.buttonText}>Edit Party Banner</Text>
            </TouchableOpacity>
            <DropDownPicker
              open={open}
              value={selectedOrganization}
              items={organizationOptions}
              setOpen={setOpen}
              setValue={setSelectedOrganization}
              setItems={setOrganizationOptions}
              placeholder="Select an organization"
              containerStyle={styles.dropdownButton}
              placeholderStyle={{ color: 'white', fontSize: 18}}
              style={{ backgroundColor: COLORS.accent, borderColor: COLORS.accent }}
              dropDownStyle={{ backgroundColor: '#fafafa', maxHeight: 200 }}
              onChangeItem={(item) => setSelectedOrganization(item.value)}
              arrowIconStyle={{ tintColor: 'white' }} // Set the color of the arrow
              labelStyle={{ color: 'white' }} // Set the color of the selected item's text
            />
          </View>
          <TouchableOpacity
            style={[
              styles.createButton,
              isCreateButtonEnabled ? {} : styles.disabledButton,
            ]}
            onPress={dataAddOn}
            disabled={!isCreateButtonEnabled}
          >
            <Text style={styles.createButtonText}>Create my event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A08', // Black
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#0A0A08",
  },
  titleContainer: {
    // margin: 10,
    // paddingTop: -10,
    paddingBottom: 10,
  },
  titleText: {
    color: COLORS.secondary,
    fontSize: 34,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputBoxesContainer: {
    paddingHorizontal: 20,
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
    height: 100,
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
    paddingTop: 12,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  dateTimePickerContainer: {
    alignSelf: 'stretch',
    marginVertical: 10,
    paddingTop: 15,
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

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3, // Adjust the spacing as needed
  },
  imagePickerButton: {
    paddingVertical: 12,
    borderRadius: 25,
    width: '48%',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 10,
    backgroundColor: COLORS.accent,
  },
  dropdownButton: {
    paddingVertical: 12,
    borderRadius: 25,
    width: '48%',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 10,
    backgroundColor: COLORS.accent, // Change the color to match the "Edit Party Banner" button
  },
  pickerContainer: {
    // marginBottom: 15,
    // height: 50, // Adjust the height as needed
    paddingBottom: 100
  },
  pickerLabel: {
    color: COLORS.primary,
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 40,
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
});