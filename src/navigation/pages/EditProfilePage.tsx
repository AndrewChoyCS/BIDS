import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { ref as StorageRef, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { onValue, ref, update } from 'firebase/database';
import { db, storage } from '../../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

import MyEventsPage from './MyEventsPage';

const handleSignOut = async (navigation) => {
  const auth = getAuth();
  const user = auth.currentUser;

  try {
    await signOut(auth);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      })
    );
  } catch (error) {
    console.error('Error signing out:', error.message);
  }
};

const EditProfile = () => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    const userRef = ref(db, `Users/${user.uid}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setUsername(data.username || '');
      setStatus(data.status || '');
      setProfilePicture(data.profilePicture || null);
    });
  }, [user.uid]);

  const changeProfilePicture = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
      });

      if (!result.canceled) {
        const imgRef = StorageRef(storage, `${user.uid}-ProfilePicture`);
        const bytes = await fetch(result.assets[0].uri).then(response => response.blob());
        const uploadedBytes = await uploadBytes(imgRef, bytes);
        const url = await getDownloadURL(imgRef);

        // Update profile picture URL in the database
        const userRef = ref(db, `Users/${user.uid}`);
        update(userRef, { profilePicture: url });

        // Update state with the new profile picture URL
        setProfilePicture(url);

        Alert.alert('Success', 'Profile picture updated successfully.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to update profile picture.');
    }
  };

  const handleEditUsername = () => {
    if (isEditingUsername) {
      const userRef = ref(db, `Users/${user.uid}`);
      update(userRef, {
        username: username,
      });
    }
    setIsEditingUsername(!isEditingUsername);
  };

  const handleEditStatus = () => {
    if (isEditingStatus) {
      const userRef = ref(db, `Users/${user.uid}`);
      update(userRef, {
        status: status,
      });
    }
    setIsEditingStatus(!isEditingStatus);
  };


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={changeProfilePicture}>
        <Image
          source={profilePicture ? { uri: profilePicture } : require("../../Images/club_Penguin.jpeg")}
          style={styles.profilePicture}
        />
      </TouchableOpacity>
      <View style={styles.userInfoContainer}>
        <View style={styles.usernameContainer}>
          {isEditingUsername ? (
            <TextInput
              style={styles.editInput}
              value={username}
              onChangeText={(text) => setUsername(text)}
              autoFocus
              onBlur={handleEditUsername}
            />
          ) : (
            <Text style={styles.username}>{username}</Text>
          )}
          <TouchableOpacity onPress={handleEditUsername}>
            <FontAwesome name="pencil" size={20} color="#00bfff" />
          </TouchableOpacity>
        </View>
        <View style={styles.statusContainer}>
          {isEditingStatus ? (
            <TextInput
              style={styles.editInput}
              value={status}
              onChangeText={(text) => setStatus(text)}
              autoFocus
              onBlur={handleEditStatus}
            />
          ) : (
            <Text style={styles.status}>{status} "Merp Master"</Text>
          )}
          <TouchableOpacity onPress={handleEditStatus}>
            <FontAwesome name="pencil" size={20} color="#00bfff" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('My Events')} style={styles.touchableContainer}>
        <Text style={styles.touchableText}>My Events</Text> 
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('My Organizations')} style={styles.touchableContainer}>
        <Text style={styles.touchableText}>My Organizations</Text> 
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => handleSignOut(navigation)}
        style={styles.touchableContainerSignOut}
        >
        <Text style={styles.touchableText}>Sign Out</Text> 
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0A0A08', // Dark background color for a futuristic look
    paddingTop: 55,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderColor: '#00bfff',
    borderWidth: 2,
  },
  username: {
    color: '#FBFEF9',
    fontSize: 24, // Increased font size for a more prominent display
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    color: '#5DFDCB',
    fontSize: 18, // Increased font size for a more prominent display
    marginBottom: 10,
  },
  touchableContainer: {
    backgroundColor: '#7CC6FE',
    marginTop: 10,
    padding: 15, // Increased padding for a larger touchable area
    borderRadius: 8,
    width: '85%',
    height: 50, // Increased height for a larger touchable area
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableContainerSignOut: {
    backgroundColor: 'red',
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    width: '85%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableText: {
    color: '#F4FAFF', // Dark text color for better readability on light backgrounds
    fontSize: 16,
    fontWeight: 'bold', // Bold text for better visibility
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  editInput: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomColor: '#00bfff',
    borderBottomWidth: 2,
    paddingBottom: 5,
  },
});

export default EditProfile;
