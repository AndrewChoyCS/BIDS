import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const auth = getAuth();

const SignInScreen = () => {
  const navigation = useNavigation();

  const [value, setValue] = React.useState({
    email: '',
    password: '',
    error: '',
  });

  async function signIn() {
    if (value.email === '' || value.password === '') {
      setValue({
        ...value,
        error: 'Email and password are mandatory.',
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, value.email, value.password);
      navigation.navigate('LandingPage');

    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to BIDS</Text>

      {!!value.error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{value.error}</Text>
        </View>
      )}

      <View style={styles.controls}>
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
          title="Sign in"
          buttonStyle={styles.button}
          onPress={signIn}
          containerStyle={styles.control}
        />

        {/* Back button */}
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

export default SignInScreen;
