import React, { useEffect, useState } from 'react';
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
import Icon from 'react-native-vector-icons/FontAwesome';
import { ref, push, set, onValue } from 'firebase/database';
import getUserData from '../../components/getUserData';
import { db, storage} from '../../config/firebase';
import {ref as StorageRef, getDownloadURL, uploadBytes} from 'firebase/storage'
import { getAuth } from 'firebase/auth';
import FriendSelectorModal from '../../components/FriendSelectorModal';

const CreateOrganizationPage = () => {
  const [orgName, setOrgName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [pictureDownloadURL, setPictureDownloadURL] = useState(null)
  const navigation = useNavigation();

  const auth = getAuth();
  const user = auth.currentUser;
  useEffect(() => {
    const userFriendsRef = ref(db, `Users/${user.uid}/Friends`);

    onValue(userFriendsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const friends = Object.values(data);
        setFriendsList(friends);
        // console.log(friendsList);
      }
    });
  }, [user]);

  const [friendUsernames, setFriendUsernames] = useState({});

  useEffect(() => {
    const fetchUsernames = async () => {
      const usernames = {};
      for (const friend of friendsList) {
        const friendUsername = await getUserData(friend);
        usernames[friend] = friendUsername;
      }
      setFriendUsernames(usernames);
      // console.log(usernames)
    };

    fetchUsernames();
  }, [friendsList]);


  const dataAddOn = async () => {
    try {
      const organizationRef = ref(db, 'Organizations');
      const newOrganizationRef = push(organizationRef);
      const organizationID = newOrganizationRef.key;
      const adminUID = user?.uid;

      let url = null; // Declare url outside the if block
      let result = imageResult;

      if (result && !result.canceled) {
        const imgRef = StorageRef(storage, `${organizationID}-OrganizationPicture`);
        const bytes = await fetch(result.assets[0].uri).then((response) => response.blob());
        const uploadedBytes = await uploadBytes(imgRef, bytes);
        const url = await getDownloadURL(imgRef);
        setPictureDownloadURL(url);
        console.log("Bytes Uploaded");
        console.log(`File available at:`, url);
        console.log("done");
        } 

      const organizationData = {
        organizationID: organizationID,
        organizationName: orgName,
        organizationMembers: [...selectedFriends, adminUID],
        admin: adminUID,
        organizationPhoto: url || "https://firebasestorage.googleapis.com/v0/b/bids-408802.appspot.com/o/J4CXyo8TurMjwsbeKLkoykIXkNi2-ProfilePicture?alt=media&token=051882a0-8f62-4fba-a337-57514439f9e4"
      };

      await set(newOrganizationRef, organizationData);

      navigation.goBack();
      console.log("Organization has been created with ID:", organizationID);
      console.log("The creator is: ", adminUID);
      console.log(selectedFriends)

      for (const friendUID of selectedFriends) {
        const friendOrgRef = ref(db, `Users/${friendUID}/Organizations`);
        const newFriendOrgRef = push(friendOrgRef);
        await set(newFriendOrgRef, organizationID);
      }

      // Add code here do this for every person in selected friends
      const userRef = ref(db, `Users/${user.uid}/Organizations/`);
      const newUserRef = push(userRef)
      await set(newUserRef, organizationID)
      // await set(userRef, true)


    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  const onFriendSelect = (uid) => {
    if (selectedFriends.includes(uid)) {
      setSelectedFriends(selectedFriends.filter(friendId => friendId !== uid));
    } else {
      setSelectedFriends([...selectedFriends, uid]);
    }
  };

  const isFriendSelected = (uid) => {
    return selectedFriends.includes(uid);
  };

  const [imageResult, setImageResult] = useState(null);
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
      setImageResult(result);
      setDefaultImage({ uri: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={25} color="white" />
      </TouchableOpacity>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          {/* Use dynamic source based on whether an image is selected */}
          <Image
            source={pictureDownloadURL ? { uri: pictureDownloadURL } : defaultImage}
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
            {selectedFriends.map(uid => {
              const friendUsername = friendUsernames[uid];
              return (
                <View style={styles.selectedFriend} key={uid}>
                  <Text style={styles.selectedFriendText}>{friendUsername}</Text>
                </View>
              );
            })}
          </View>
        </TouchableOpacity>
        
        <FriendSelectorModal
          showModal={showModal}
          friendsList={friendsList}
          isFriendSelected={isFriendSelected}
          onFriendSelect={onFriendSelect}
          onCloseModal={() => setShowModal(false)}
          friendUsernames={friendUsernames}
        />
        <TouchableOpacity
          style={[styles.submitButton, !orgName && styles.disabledButton]}
          onPress={dataAddOn}
          disabled={!orgName}
        >
          <Text style={styles.submitButtonText}>Create</Text>
        </TouchableOpacity>
      </ScrollView>
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
  backButton: {
    marginTop: 10,
    marginLeft: 10,
    padding: 10,
  },
});

export default CreateOrganizationPage;