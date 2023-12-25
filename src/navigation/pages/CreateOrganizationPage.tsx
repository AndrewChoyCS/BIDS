import React, { useState } from 'react';
import { Alert } from 'react-native';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Platform,
  Button
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";


const CreateOrganizationPage = () => {
  const [orgName, setOrgName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();


  // Hardcoded friends list (replace with dynamic data later)
  const friendsList = [
    { id: '1', name: 'Obama' },
    { id: '2', name: 'Donald Trump' },
    { id: '3', name: 'George Bush'},
    { id: '4', name: 'Joe Biden'}
    // ... add more friends
  ];

  const onFriendSelect = (id) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter(friendId => friendId !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  const isFriendSelected = (id) => {
    return selectedFriends.includes(id);
  };

  const onSubmit = () => {
    // Handle the submit action
    const newOrganization = {
      // id:  generateUniqueId(), // Implement a function to generate a unique ID
      id: 3,
      name: orgName,
      profilePicture: image,
      // ... other organization details
      friendList: selectedFriends.map((friendId) => {
        const friend = friendsList.find((f) => f.id === friendId);
        return { id: friendId, name: friend.name };
      }),
    };
    setShowModal(false);
    navigation.goBack(); 
    //You should Add it to the data base, then the backend should query for all the user's organiztions
  };

  const [image, setImage] = useState(null);
  const [defaultImage, setDefaultImage] = useState(require('../../Images/tke.jpeg'));

  
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Set the default image to the selected image
      setDefaultImage({ uri: result.assets[0].uri });
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          {/* Use dynamic source based on whether an image is selected */}
          <Image
            source={image ? { uri: image } : defaultImage}
            style={styles.orgImage}
          />
          <Button
            title="Edit Organization Photo"
            onPress={pickImage}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Organization Name:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setOrgName}
            value={orgName}
            placeholder="Enter the name of your organization"
            placeholderTextColor="#a9a9a9"
          />
        </View>

        <TouchableOpacity style={styles.pickerContainer} onPress={() => setShowModal(true)}>
          <Text style={styles.label}>Add Members:</Text>
          {/* Display selected friends */}
          <View style={styles.selectedFriendsContainer}>
            {selectedFriends.map(friendId => {
              const friend = friendsList.find(f => f.id === friendId);
              return (
                <View style={styles.selectedFriend} key={friendId}>
                  <Text style={styles.selectedFriendText}>{friend.name}</Text>
                </View>
              );
            })}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, !orgName && styles.disabledButton]}
          onPress={onSubmit}
          disabled={!orgName}
        >
          <Text style={styles.submitButtonText}>Create</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalView}>
          <FlatList
            data={friendsList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.friendItem, isFriendSelected(item.id) && styles.friendItemSelected]}
                onPress={() => onFriendSelect(item.id)}
              >
                <Text style={styles.friendItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalSubmitButton} onPress={() => setShowModal(false)}>
            <Text style={styles.submitButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Dark background
  },
  container: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  orgImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#00ff00', // Neon green
  },
  imageUploadText: {
    fontSize: 16,
    color: '#7d12ff',
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    height: 50,
    borderColor: '#7d12ff', // Neon green
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 20, // Increased border radius for a bubbly shape
    color: '#6528F7', // White text
    // fontWeight: "bold",
    backgroundColor: '#ffffff', // Optional: background color if needed
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#A076F9', // Neon green
  },
  pickerContainer: {
    borderColor: '#7d12ff',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 20,
  },
  selectedFriendsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectedFriend: {
    backgroundColor: '#ff00ff', // Neon pink
    borderRadius: 15,
    padding: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedFriendText: {
    fontSize: 14,
    color: '#ffffff', // White text
  },
  friendItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#A076F9',
  },
  friendItemSelected: {
    backgroundColor: '#A076F9', // Light blue
  },
  friendItemText: {
    fontSize: 16,
    color: '#ffffff', // White text
  },
  submitButton: {
    backgroundColor: '#7d12ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#ffffff', // White text
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    backgroundColor: '#0a0a0a', // Dark background
  },
  modalSubmitButton: {
    backgroundColor: '#6528F7', // Neon green
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },  
  disabledButton: {
    backgroundColor: '#808080', // Gray color for disabled button
  },
});

export default CreateOrganizationPage;
