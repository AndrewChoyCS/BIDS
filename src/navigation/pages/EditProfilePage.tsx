// EditProfile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { get, onValue, ref } from 'firebase/database';
import { db } from '../../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import ImagePicker from the appropriate library, like 'expo-image-picker'
// import * as ImagePicker from 'expo-image-picker';

const EditProfile = ({ route }) => {
    const [username, setUsername] = useState();
    const [status, setStatus] = useState();
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const userRef = ref(db, `Users/${user.uid}`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            setUsername(data.username);
            setStatus(data.status);
        });
    }, []);

    const handleEditProfilePic = async () => {
        // Use ImagePicker to open the image library
        // Example using expo-image-picker
        // let result = await ImagePicker.launchImageLibraryAsync();
        // Handle the result as needed
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleEditProfilePic}>
                <Image
                    source={require("../../Images/club_Penguin.jpeg")}
                    style={styles.profilePicture}
                />
                {/* <Text style={styles.editProfileText}>Edit Profile Pic</Text> */}
            </TouchableOpacity>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.status}>*INSERT STATUS HERE*</Text>
            <TouchableOpacity
                // onPress={onPressLearnMore}
                style={styles.touchableContainer}
            >
                <Text style={styles.touchableText}>Edit Username</Text>
            </TouchableOpacity>
            <TouchableOpacity
                // onPress={onPressLearnMore}
                style={styles.touchableContainer}
            >
                <Text style={styles.touchableText}>Edit Status</Text>
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
    touchableText: {
        color: '#94ECBE',
        fontSize: 15
    }
});

export default EditProfile;
