import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { ref as StorageRef, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { onValue, ref, set, update } from 'firebase/database';
import { db, storage } from '../../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { CommonActions, useNavigation } from '@react-navigation/native';
import MyEventsPage from './MyEventsPage';

const handleSignOut = async (navigation) => {
  const auth = getAuth();

  try {
    await signOut(auth);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      })
    );    } catch (error) {
    console.error('Error signing out:', error.message);
  }
};


const EditProfile = () => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
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

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={changeProfilePicture}>
        <Image
          source={profilePicture ? { uri: profilePicture } : require("../../Images/club_Penguin.jpeg")}
          style={styles.profilePicture}
        />
      </TouchableOpacity>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.status}>{status} "Merp Master"</Text>
      <TouchableOpacity style={styles.touchableContainer}>
        <Text style={styles.touchableText}>Edit Username</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchableContainer}>
        <Text style={styles.touchableText}>Edit Status</Text>
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={() => navigation.navigate('My Events')} style={styles.touchableContainer}>
        <Text style={styles.touchableText}>My Events</Text> 
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => navigation.navigate('My Organizations')} style={styles.touchableContainer}>
        <Text style={styles.touchableText}>My Organizations</Text> 
      </TouchableWithoutFeedback>
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
        backgroundColor: '#0A0A08',
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
    editProfileText: {
        color: '#00bfff',
        fontSize: 16,
        marginBottom: 10,
        textDecorationLine: 'underline',
    },
    username: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    status: {
        color: '#00bfff',
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#2e2e2e',
        color: '#fff',
        width: '80%',
        padding: 10,
        marginBottom: 20,
        borderRadius: 8,
    },
    touchableContainer: {
        backgroundColor: '#857885', 
        marginTop: 10,
        padding: 10, 
        borderRadius: 5,
        width: '85%',
        height: 40,
    },
    touchableContainerSignOut: {
      backgroundColor: 'red', 
      marginTop: 10,
      padding: 10, 
      borderRadius: 5,
      width: '85%',
      height: 40,
      
    },
    touchableText: {
        color: '#94ECBE',
        fontSize: 15
    }
});

export default EditProfile;
