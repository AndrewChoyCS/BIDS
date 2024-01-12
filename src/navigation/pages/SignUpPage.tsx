import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '../../config/firebase';
import { getDatabase, ref, set, update, push} from 'firebase/database';


const auth = getAuth();


const SignUpScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [value, setValue] = React.useState({
    email: '',
    password: '',
    username: '',
    error: '',
  });

  async function signUp() {
    if (value.email === '' || value.password === '' || value.username === '') {
      setValue({
        ...value,
        error: 'Email, password, and username are mandatory.',
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );
  
      // Add the username to the user's profile
      await updateProfile(userCredential.user, {
        displayName: value.username,
      });
      const user = auth.currentUser
      // Add the user to the "Users" collection in Firestore
      const usersRef = ref(db, `Users/${userCredential.user.uid}`);

      // Set initial data including an empty array for "Friends"
      const userData = {
        userId: userCredential.user.uid,
        username: value.username,
        email: value.email,
        Friends: [],
        profilePicture:"https://firebasestorage.googleapis.com/v0/b/bids-408802.appspot.com/o/club_Penguin.jpeg?alt=media&token=7091609b-cfa6-4efb-ab4b-158f4dfaeabd",
        status: "Being fucking basic"
        // Add other user details as needed
      };
  
      // Use set to ensure the initial data is set
      await set(usersRef, userData);
  
      navigation.navigate('Sign In');
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up for BIDS</Text>

      {!!value.error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{value.error}</Text>
        </View>
      )}

      <View style={styles.controls}>
        <Input
          placeholder="Username"
          containerStyle={styles.control}
          value={value.username}
          onChangeText={(text) => setValue({ ...value, username: text })}
          leftIcon={<Icon name="user" size={16} color="#2A2D43" />}
        />
        <Input
          placeholder="Email"
          containerStyle={styles.control}
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
          leftIcon={<Icon name="envelope" size={16} color="#2A2D43" />}
        />

        <Input
          placeholder="Password"
          containerStyle={styles.control}
          value={value.password}
          onChangeText={(text) => setValue({ ...value, password: text })}
          secureTextEntry={true}
          leftIcon={<Icon name="key" size={16} color="#2A2D43" />}
        />
        <Button
          title="Sign up"
          buttonStyle={styles.button}
          onPress={signUp}
          containerStyle={styles.control}
        />

        <Button
          title="Back"
          type="clear"
          onPress={() => navigation.navigate('Welcome')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#2A2D43",
  },

  controls: {
    width: '80%', // Adjust the width of the controls
  },

  control: {
    marginTop: 10,
  },

  button: {
    backgroundColor: '#FF84E8', // Use the primary color from your theme
  },

  error: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#D54826FF',
    borderRadius: 5,
  },

  errorText: {
    color: '#fff',
  },
});

export default SignUpScreen;
